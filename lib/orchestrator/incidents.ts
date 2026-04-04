import { v4 as uuidv4 } from 'uuid';
import type {
  IncidentSeverity,
  IncidentSource,
  IncidentStatus,
  OrchestratorIncident,
  OrchestratorIncidentTimelineEvent,
} from '@/types/orchestrator';
import { recordAuditEvent } from '@/lib/orchestrator/audit';
import { useOrchestratorStore } from '@/lib/orchestrator';

const MAX_INCIDENTS = 1500;

declare global {
  // eslint-disable-next-line no-var
  var __AGRI_OS_INCIDENTS__: OrchestratorIncident[] | undefined;
}

function getIncidentStore(): OrchestratorIncident[] {
  if (!globalThis.__AGRI_OS_INCIDENTS__) {
    globalThis.__AGRI_OS_INCIDENTS__ = [];
  }
  return globalThis.__AGRI_OS_INCIDENTS__;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  severity: IncidentSeverity;
  source: IncidentSource;
  relatedEntityType?: OrchestratorIncident['relatedEntityType'];
  relatedEntityId?: string;
  recommendedActions?: string[];
  metadata?: Record<string, any>;
  actorId?: string;
}

export interface IncidentQuery {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  source?: IncidentSource;
  limit?: number;
}

function severityToAlertLevel(severity: IncidentSeverity): 'info' | 'warning' | 'critical' {
  if (severity === 'critical' || severity === 'high') return 'critical';
  if (severity === 'medium') return 'warning';
  return 'info';
}

export function createIncident(input: CreateIncidentInput): OrchestratorIncident {
  const now = new Date();
  const timeline: OrchestratorIncidentTimelineEvent[] = [
    {
      at: now,
      event: 'incident_opened',
      actorId: input.actorId,
      note: input.description,
    },
  ];

  const incident: OrchestratorIncident = {
    id: `inc-${uuidv4()}`,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: 'open',
    source: input.source,
    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,
    recommendedActions: input.recommendedActions || [],
    metadata: input.metadata,
    createdAt: now,
    updatedAt: now,
    timeline,
  };

  const store = getIncidentStore();
  store.unshift(incident);
  if (store.length > MAX_INCIDENTS) {
    store.splice(MAX_INCIDENTS);
  }

  recordAuditEvent({
    eventType: 'incident_opened',
    severity: input.severity === 'critical' ? 'critical' : input.severity === 'high' ? 'warning' : 'info',
    entityType: 'incident',
    entityId: incident.id,
    actor: input.actorId ? { id: input.actorId, type: 'api' } : undefined,
    message: `Incident opened: ${incident.title}`,
    metadata: {
      source: incident.source,
      severity: incident.severity,
      relatedEntityType: incident.relatedEntityType,
      relatedEntityId: incident.relatedEntityId,
    },
  });

  try {
    useOrchestratorStore.getState().addAlert({
      type: 'compliance_reminder',
      severity: severityToAlertLevel(incident.severity),
      title: `Incident: ${incident.title}`,
      message: incident.description,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      acknowledged: false,
      actions: [
        {
          label: 'Open Incident Queue',
          action: 'open_incident_queue',
          parameters: { incidentId: incident.id },
        },
      ],
    });
  } catch {
    // In API worker contexts this store can be unavailable; keep incident creation non-blocking.
  }

  return incident;
}

export function getIncidentById(id: string): OrchestratorIncident | null {
  return getIncidentStore().find((incident) => incident.id === id) || null;
}

export function queryIncidents(query: IncidentQuery = {}): OrchestratorIncident[] {
  const limit = Math.max(1, Math.min(query.limit || 200, 2000));
  return getIncidentStore()
    .filter((incident) => (query.status ? incident.status === query.status : true))
    .filter((incident) => (query.severity ? incident.severity === query.severity : true))
    .filter((incident) => (query.source ? incident.source === query.source : true))
    .slice(0, limit);
}

export function updateIncident(
  id: string,
  patch: {
    status?: IncidentStatus;
    note?: string;
    actorId?: string;
    recommendedActions?: string[];
    metadata?: Record<string, any>;
  }
): OrchestratorIncident | null {
  const store = getIncidentStore();
  const index = store.findIndex((incident) => incident.id === id);
  if (index === -1) {
    return null;
  }

  const current = store[index];
  const now = new Date();
  const nextStatus = patch.status || current.status;
  const timelineEvent: OrchestratorIncidentTimelineEvent = {
    at: now,
    event: nextStatus === current.status ? 'incident_updated' : `incident_status_${nextStatus}`,
    actorId: patch.actorId,
    note: patch.note,
  };

  const updated: OrchestratorIncident = {
    ...current,
    status: nextStatus,
    recommendedActions: patch.recommendedActions || current.recommendedActions,
    metadata: patch.metadata ? { ...(current.metadata || {}), ...patch.metadata } : current.metadata,
    updatedAt: now,
    resolvedAt: (nextStatus === 'resolved' || nextStatus === 'closed') ? now : current.resolvedAt,
    timeline: [...current.timeline, timelineEvent],
  };

  store[index] = updated;

  recordAuditEvent({
    eventType: (nextStatus === 'resolved' || nextStatus === 'closed') ? 'incident_resolved' : 'incident_updated',
    severity: nextStatus === 'resolved' || nextStatus === 'closed' ? 'info' : 'warning',
    entityType: 'incident',
    entityId: id,
    actor: patch.actorId ? { id: patch.actorId, type: 'api' } : undefined,
    message: `Incident ${id} updated to ${nextStatus}`,
    metadata: {
      previousStatus: current.status,
      status: nextStatus,
      note: patch.note,
    },
  });

  return updated;
}

export function getIncidentSummary(): {
  total: number;
  open: number;
  criticalOpen: number;
  highOpen: number;
} {
  const incidents = getIncidentStore();
  const openIncidents = incidents.filter((incident) => incident.status === 'open' || incident.status === 'acknowledged' || incident.status === 'mitigating');
  return {
    total: incidents.length,
    open: openIncidents.length,
    criticalOpen: openIncidents.filter((incident) => incident.severity === 'critical').length,
    highOpen: openIncidents.filter((incident) => incident.severity === 'high').length,
  };
}

export function clearIncidents(): number {
  const store = getIncidentStore();
  const count = store.length;
  store.splice(0, store.length);
  return count;
}
