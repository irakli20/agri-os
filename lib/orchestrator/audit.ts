import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type {
  OrchestratorAuditEntityType,
  OrchestratorAuditEvent,
  OrchestratorAuditEventType,
  OrchestratorAuditSeverity,
  OrchestratorAuditActor,
  OrchestratorAuditSignature,
} from '@/types/orchestrator';

const MAX_AUDIT_EVENTS = 3000;

declare global {
  // eslint-disable-next-line no-var
  var __AGRI_OS_AUDIT_EVENTS__: OrchestratorAuditEvent[] | undefined;
  // eslint-disable-next-line no-var
  var __AGRI_OS_AUDIT_CHAIN_HEAD__: string | undefined;
}

function getAuditStore(): OrchestratorAuditEvent[] {
  if (!globalThis.__AGRI_OS_AUDIT_EVENTS__) {
    globalThis.__AGRI_OS_AUDIT_EVENTS__ = [];
  }
  return globalThis.__AGRI_OS_AUDIT_EVENTS__;
}

function getAuditChainHead(): string | null {
  return globalThis.__AGRI_OS_AUDIT_CHAIN_HEAD__ || null;
}

function setAuditChainHead(value: string | null): void {
  globalThis.__AGRI_OS_AUDIT_CHAIN_HEAD__ = value || undefined;
}

function canonicalize(value: any): any {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }
  const keys = Object.keys(value).sort();
  const normalized: Record<string, any> = {};
  for (const key of keys) {
    normalized[key] = canonicalize(value[key]);
  }
  return normalized;
}

function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function signingSecret(): string {
  return process.env.AGRI_OS_SIGNING_SECRET || 'agri-os-dev-signing-secret';
}

function signingKeyId(): string {
  return process.env.AGRI_OS_SIGNING_KEY_ID || 'dev-local-key';
}

function signValue(value: string): string {
  return crypto.createHmac('sha256', signingSecret()).update(value).digest('hex');
}

function buildSignablePayload(event: Omit<OrchestratorAuditEvent, 'signature'>): Record<string, any> {
  return {
    id: event.id,
    timestamp: new Date(event.timestamp).toISOString(),
    eventType: event.eventType,
    severity: event.severity,
    entityType: event.entityType,
    entityId: event.entityId || null,
    actor: event.actor || null,
    message: event.message,
    metadata: event.metadata || null,
  };
}

function signAuditEvent(event: Omit<OrchestratorAuditEvent, 'signature'>, previousHash: string | null): OrchestratorAuditSignature {
  const payload = buildSignablePayload(event);
  const payloadHash = hashValue(JSON.stringify(canonicalize(payload)));
  const signature = signValue(`${previousHash || ''}:${payloadHash}`);
  const chainHash = hashValue(`${signature}:${payloadHash}:${previousHash || ''}`);
  return {
    algorithm: 'HMAC-SHA256',
    keyId: signingKeyId(),
    signedAt: new Date(),
    payloadHash,
    previousHash,
    signature,
    chainHash,
  };
}

export interface RecordAuditEventInput {
  eventType: OrchestratorAuditEventType;
  severity?: OrchestratorAuditSeverity;
  entityType: OrchestratorAuditEntityType;
  entityId?: string;
  actor?: OrchestratorAuditActor;
  message: string;
  metadata?: Record<string, any>;
}

export interface AuditQuery {
  eventType?: OrchestratorAuditEventType;
  severity?: OrchestratorAuditSeverity;
  entityType?: OrchestratorAuditEntityType;
  entityId?: string;
  since?: Date;
  until?: Date;
  limit?: number;
}

export interface AuditChainVerificationResult {
  valid: boolean;
  checked: number;
  headHash: string | null;
  failures: Array<{
    eventId: string;
    reason: string;
  }>;
}

export function recordAuditEvent(input: RecordAuditEventInput): OrchestratorAuditEvent {
  const unsignedEvent: Omit<OrchestratorAuditEvent, 'signature'> = {
    id: uuidv4(),
    timestamp: new Date(),
    eventType: input.eventType,
    severity: input.severity || 'info',
    entityType: input.entityType,
    entityId: input.entityId,
    actor: input.actor,
    message: input.message,
    metadata: input.metadata,
  };
  const signature = signAuditEvent(unsignedEvent, getAuditChainHead());
  const event: OrchestratorAuditEvent = { ...unsignedEvent, signature };

  const store = getAuditStore();
  store.unshift(event);
  setAuditChainHead(signature.chainHash);
  if (store.length > MAX_AUDIT_EVENTS) {
    store.splice(MAX_AUDIT_EVENTS);
  }
  return event;
}

export function queryAuditEvents(query: AuditQuery = {}): OrchestratorAuditEvent[] {
  const sinceTs = query.since ? new Date(query.since).getTime() : undefined;
  const untilTs = query.until ? new Date(query.until).getTime() : undefined;
  const limit = Math.max(1, Math.min(query.limit || 200, 2000));

  return getAuditStore()
    .filter((event) => (query.eventType ? event.eventType === query.eventType : true))
    .filter((event) => (query.severity ? event.severity === query.severity : true))
    .filter((event) => (query.entityType ? event.entityType === query.entityType : true))
    .filter((event) => (query.entityId ? event.entityId === query.entityId : true))
    .filter((event) => (sinceTs !== undefined ? new Date(event.timestamp).getTime() >= sinceTs : true))
    .filter((event) => (untilTs !== undefined ? new Date(event.timestamp).getTime() <= untilTs : true))
    .slice(0, limit);
}

export function clearAuditEvents(): number {
  const store = getAuditStore();
  const count = store.length;
  store.splice(0, store.length);
  setAuditChainHead(null);
  return count;
}

export function getAuditEventCount(): number {
  return getAuditStore().length;
}

export function verifyAuditChain(): AuditChainVerificationResult {
  const events = getAuditStore();
  const failures: AuditChainVerificationResult['failures'] = [];

  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    if (!event.signature) {
      failures.push({ eventId: event.id, reason: 'Missing signature payload.' });
      continue;
    }

    const nextOlder = events[index + 1];
    const expectedPreviousHash = nextOlder?.signature?.chainHash || null;
    if (event.signature.previousHash !== expectedPreviousHash) {
      failures.push({
        eventId: event.id,
        reason: `Previous hash mismatch. expected=${expectedPreviousHash || 'null'} actual=${event.signature.previousHash || 'null'}`,
      });
    }

    const payloadHash = hashValue(JSON.stringify(canonicalize(buildSignablePayload({
      id: event.id,
      timestamp: event.timestamp,
      eventType: event.eventType,
      severity: event.severity,
      entityType: event.entityType,
      entityId: event.entityId,
      actor: event.actor,
      message: event.message,
      metadata: event.metadata,
    }))));
    if (payloadHash !== event.signature.payloadHash) {
      failures.push({ eventId: event.id, reason: 'Payload hash mismatch.' });
    }

    const expectedSignature = signValue(`${event.signature.previousHash || ''}:${event.signature.payloadHash}`);
    if (expectedSignature !== event.signature.signature) {
      failures.push({ eventId: event.id, reason: 'Signature mismatch.' });
    }

    const expectedChainHash = hashValue(
      `${event.signature.signature}:${event.signature.payloadHash}:${event.signature.previousHash || ''}`
    );
    if (expectedChainHash !== event.signature.chainHash) {
      failures.push({ eventId: event.id, reason: 'Chain hash mismatch.' });
    }
  }

  const currentHead = getAuditChainHead();
  const newestEventHead = events[0]?.signature?.chainHash || null;
  if (currentHead !== newestEventHead) {
    failures.push({
      eventId: events[0]?.id || 'none',
      reason: `Global chain head mismatch. expected=${newestEventHead || 'null'} actual=${currentHead || 'null'}`,
    });
  }

  return {
    valid: failures.length === 0,
    checked: events.length,
    headHash: currentHead,
    failures,
  };
}
