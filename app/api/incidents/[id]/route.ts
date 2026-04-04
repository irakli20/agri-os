import { NextRequest, NextResponse } from 'next/server';
import { getIncidentById, updateIncident } from '@/lib/orchestrator/incidents';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';

/**
 * GET /api/incidents/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id?: string } | Promise<{ id?: string }> }
) {
  const authz = authorizeOrchestratorRequest(request, 'incidents.read', {
    action: 'read incident details',
    entityType: 'incident',
  });
  if (!authz.ok) {
    return authz.response;
  }

  const resolved = await Promise.resolve(params);
  const incidentId = resolved?.id || decodeURIComponent(request.nextUrl.pathname.split('/').filter(Boolean).at(-1) || '');
  if (!incidentId) {
    return NextResponse.json({ success: false, error: 'Incident id is required' }, { status: 400 });
  }

  const incident = getIncidentById(incidentId);
  if (!incident) {
    return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, incident });
}

/**
 * PATCH /api/incidents/[id]
 * Body:
 * - status?: open|acknowledged|mitigating|resolved|closed
 * - note?: string
 * - recommendedActions?: string[]
 * - metadata?: object
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id?: string } | Promise<{ id?: string }> }
) {
  const authz = authorizeOrchestratorRequest(request, 'incidents.manage', {
    action: 'update incident',
    entityType: 'incident',
  });
  if (!authz.ok) {
    return authz.response;
  }

  const resolved = await Promise.resolve(params);
  const incidentId = resolved?.id || decodeURIComponent(request.nextUrl.pathname.split('/').filter(Boolean).at(-1) || '');
  if (!incidentId) {
    return NextResponse.json({ success: false, error: 'Incident id is required' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const incident = updateIncident(incidentId, {
      status: body?.status,
      note: typeof body?.note === 'string' ? body.note : undefined,
      actorId: authz.actor.id,
      recommendedActions: Array.isArray(body?.recommendedActions)
        ? body.recommendedActions.map(String)
        : undefined,
      metadata: body?.metadata && typeof body.metadata === 'object'
        ? body.metadata
        : undefined,
    });

    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, incident });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update incident', details: (error as Error).message },
      { status: 400 }
    );
  }
}
