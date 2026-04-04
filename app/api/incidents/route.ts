import { NextRequest, NextResponse } from 'next/server';
import {
  clearIncidents,
  createIncident,
  getIncidentSummary,
  queryIncidents,
} from '@/lib/orchestrator/incidents';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';

/**
 * GET /api/incidents
 * Query params:
 * - status?: open|acknowledged|mitigating|resolved|closed
 * - severity?: low|medium|high|critical
 * - source?: action|safety|policy|system|manual
 * - limit?: number
 */
export async function GET(request: NextRequest) {
  const authz = authorizeOrchestratorRequest(request, 'incidents.read', {
    action: 'read incident queue',
    entityType: 'incident',
  });
  if (!authz.ok) {
    return authz.response;
  }

  const url = new URL(request.url);
  const incidents = queryIncidents({
    status: (url.searchParams.get('status') as any) || undefined,
    severity: (url.searchParams.get('severity') as any) || undefined,
    source: (url.searchParams.get('source') as any) || undefined,
    limit: url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined,
  });

  return NextResponse.json({
    success: true,
    summary: getIncidentSummary(),
    incidents,
  });
}

/**
 * POST /api/incidents
 * Manual incident creation for operations workflows.
 */
export async function POST(request: NextRequest) {
  const authz = authorizeOrchestratorRequest(request, 'incidents.manage', {
    action: 'create incident',
    entityType: 'incident',
  });
  if (!authz.ok) {
    return authz.response;
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (!body?.title || !body?.description) {
      return NextResponse.json(
        { success: false, error: 'title and description are required' },
        { status: 400 }
      );
    }

    const incident = createIncident({
      title: String(body.title),
      description: String(body.description),
      severity: (body?.severity || 'medium') as any,
      source: (body?.source || 'manual') as any,
      relatedEntityType: body?.relatedEntityType,
      relatedEntityId: body?.relatedEntityId,
      recommendedActions: Array.isArray(body?.recommendedActions) ? body.recommendedActions.map(String) : [],
      metadata: body?.metadata || {},
      actorId: authz.actor.id,
    });

    return NextResponse.json({ success: true, incident });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create incident', details: (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/incidents
 * Clear in-memory incidents (dev/test usage).
 */
export async function DELETE(request: NextRequest) {
  const authz = authorizeOrchestratorRequest(request, 'incidents.manage', {
    action: 'clear incident queue',
    entityType: 'incident',
  });
  if (!authz.ok) {
    return authz.response;
  }

  const cleared = clearIncidents();
  return NextResponse.json({ success: true, cleared });
}
