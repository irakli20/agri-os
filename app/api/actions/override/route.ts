import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import type { ActionLifecycleStatus } from '@/types/orchestrator';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';
import { createIncident } from '@/lib/orchestrator/incidents';

/**
 * POST /api/actions/override
 * Body: {
 *   actionId: string,
 *   overriddenBy: string,
 *   overrideType: 'status_change'|'force_cancel'|'force_complete'|'parameter_adjustment'|'emergency_stop',
 *   note: string,
 *   forceStatus?: ActionLifecycleStatus
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authz = authorizeOrchestratorRequest(request, 'actions.override', {
      action: 'override action state',
      entityType: 'action',
    });
    if (!authz.ok) {
      return authz.response;
    }

    const body = await request.json();
    if (!body?.overriddenBy || !body?.overrideType || !body?.note) {
      return NextResponse.json(
        { success: false, error: 'overriddenBy, overrideType, and note are required' },
        { status: 400 }
      );
    }

    const store = useOrchestratorStore.getState();
    let actionId = body?.actionId as string | undefined;

    if (!actionId && body?.previewAction) {
      actionId = `override-preview-${Date.now()}`;
      store.addActionResult({
        id: actionId,
        decisionId: 'override-preview-decision',
        actionType: body?.actionType || 'apply_irrigation',
        status: 'approved',
        requestedAt: new Date(),
        approvedAt: new Date(),
        fieldId: body?.fieldId,
        parameters: body?.parameters || {},
        cost: 0,
        lifecycleHistory: [
          { status: 'proposed', timestamp: new Date(), note: 'Preview action created for override test' },
          { status: 'approved', timestamp: new Date(), note: 'Preview action approved' },
        ],
      });
    }

    if (!actionId) {
      return NextResponse.json(
        { success: false, error: 'actionId is required unless previewAction=true is provided' },
        { status: 400 }
      );
    }

    const forceStatus = body?.forceStatus as ActionLifecycleStatus | undefined;
    const result = store.overrideAction(String(actionId), {
      overriddenBy: body?.overriddenBy ? String(body.overriddenBy) : authz.actor.id,
      overrideType: body.overrideType,
      note: String(body.note),
      forceStatus,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.reason }, { status: 409 });
    }

    const action = useOrchestratorStore.getState().completedActions.find((a) => a.id === actionId);
    if (body.overrideType === 'emergency_stop' || body.overrideType === 'force_cancel') {
      createIncident({
        title: `Action override: ${body.overrideType}`,
        description: String(body.note),
        severity: body.overrideType === 'emergency_stop' ? 'critical' : 'high',
        source: 'action',
        relatedEntityType: 'action',
        relatedEntityId: String(actionId),
        recommendedActions: [
          'Review operator override justification and action timeline.',
          'Validate safe state before resuming autonomous flows.',
        ],
        metadata: {
          overrideType: body.overrideType,
          forceStatus,
        },
        actorId: body?.overriddenBy ? String(body.overriddenBy) : authz.actor.id,
      });
    }
    return NextResponse.json({ success: true, actionId, action });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to override action', details: (error as Error).message },
      { status: 400 }
    );
  }
}
