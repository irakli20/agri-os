import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';
import { createIncident } from '@/lib/orchestrator/incidents';

/**
 * GET /api/orchestrator/safety
 * Read current safety/emergency-stop state.
 */
export async function GET() {
  const state = useOrchestratorStore.getState();
  return NextResponse.json({
    success: true,
    safety: state.safety,
    orchestratorStatus: state.status,
  });
}

/**
 * POST /api/orchestrator/safety
 * Body:
 * - { action: 'emergency_stop', triggeredBy: string, reason: string }
 * - { action: 'release_stop', releasedBy: string, note?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const store = useOrchestratorStore.getState();

    if (body?.action === 'emergency_stop') {
      const authz = authorizeOrchestratorRequest(request, 'safety.emergency_stop', {
        action: 'trigger emergency stop',
        entityType: 'safety',
      });
      if (!authz.ok) {
        return authz.response;
      }

      if (!body?.triggeredBy || !body?.reason) {
        return NextResponse.json(
          { success: false, error: 'triggeredBy and reason are required' },
          { status: 400 }
        );
      }
      const result = store.triggerEmergencyStop({
        triggeredBy: String(body.triggeredBy),
        reason: String(body.reason),
      });
      if (result.success) {
        createIncident({
          title: 'Emergency stop activated',
          description: String(body.reason),
          severity: 'critical',
          source: 'safety',
          relatedEntityType: 'safety',
          recommendedActions: [
            'Verify operator and field safety conditions.',
            'Review in-flight actions and rollback state.',
            'Require supervisor sign-off before releasing stop.',
          ],
          metadata: {
            triggeredBy: String(body.triggeredBy),
          },
          actorId: String(body.triggeredBy),
        });
      }
      return NextResponse.json({ success: result.success, safety: useOrchestratorStore.getState().safety });
    }

    if (body?.action === 'release_stop') {
      const authz = authorizeOrchestratorRequest(request, 'safety.release_stop', {
        action: 'release emergency stop',
        entityType: 'safety',
      });
      if (!authz.ok) {
        return authz.response;
      }

      if (!body?.releasedBy) {
        return NextResponse.json(
          { success: false, error: 'releasedBy is required' },
          { status: 400 }
        );
      }
      const result = store.releaseEmergencyStop({
        releasedBy: String(body.releasedBy),
        note: body?.note ? String(body.note) : undefined,
      });
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.reason }, { status: 409 });
      }
      return NextResponse.json({ success: true, safety: useOrchestratorStore.getState().safety });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'emergency_stop' or 'release_stop'." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update safety state', details: (error as Error).message },
      { status: 400 }
    );
  }
}
