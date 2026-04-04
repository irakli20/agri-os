import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { v4 as uuidv4 } from 'uuid';
import type { ActionControlMode, ActionLifecycleStatus, ActionResult } from '@/types/orchestrator';
import { isHighRiskAction } from '@/lib/orchestrator/action-policy';
import { getActionContingencyPolicy } from '@/lib/orchestrator/action-contingency';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';
import { evaluateOrchestratorGuardrails } from '@/lib/orchestrator/policy-guardrails';
import { recordAuditEvent } from '@/lib/orchestrator/audit';
import { createIncident } from '@/lib/orchestrator/incidents';

/**
 * POST /api/actions/lifecycle
 * Preview/validate action lifecycle transitions on the orchestrator store.
 */
export async function POST(request: NextRequest) {
  try {
    const authz = authorizeOrchestratorRequest(request, 'actions.dispatch', {
      action: 'dispatch action lifecycle transition',
      entityType: 'action',
    });
    if (!authz.ok) {
      return authz.response;
    }

    const body = await request.json();
    const transitions = (body?.transitions || [
      'approved',
      'dispatched',
      'acknowledged',
      'completed',
    ]) as ActionLifecycleStatus[];

    const actionId = `preview-${uuidv4()}`;
    const store = useOrchestratorStore.getState();
    const controlMode: ActionControlMode =
      body?.controlMode === 'manual' || body?.controlMode === 'assisted' || body?.controlMode === 'autopilot'
        ? body.controlMode
        : 'assisted';
    const actionType = (body?.actionType || 'apply_irrigation') as ActionResult['actionType'];
    const guardrail = evaluateOrchestratorGuardrails({
      source: 'action_dispatch',
      actionType,
      controlMode,
      priority: body?.priority || 'high',
      parameters: body?.parameters || {},
      requestedOperation: 'dispatch',
    });
    if (guardrail.decision === 'block') {
      recordAuditEvent({
        eventType: 'policy_guardrail_blocked',
        severity: 'critical',
        entityType: 'policy',
        actor: { id: authz.actor.id, type: 'api' },
        message: `Action lifecycle dispatch blocked for ${actionType}`,
        metadata: { guardrail, actionType },
      });
      createIncident({
        title: `Dispatch blocked: ${actionType}`,
        description: 'Policy guardrails prevented action dispatch.',
        severity: 'high',
        source: 'policy',
        relatedEntityType: 'action',
        relatedEntityId: actionId,
        recommendedActions: guardrail.hits.map((hit) => hit.remediation),
        metadata: { guardrail, actionType },
        actorId: authz.actor.id,
      });
      return NextResponse.json({
        success: false,
        error: 'Action dispatch blocked by policy guardrails.',
        guardrail,
        actionType,
      }, { status: 409 });
    }
    if (guardrail.decision === 'warn') {
      recordAuditEvent({
        eventType: 'policy_guardrail_warning',
        severity: 'warning',
        entityType: 'policy',
        actor: { id: authz.actor.id, type: 'api' },
        message: `Action lifecycle warning for ${actionType}`,
        metadata: { guardrail, actionType },
      });
    }
    const risk = isHighRiskAction(actionType, body?.priority || 'high', body?.parameters || {});
    const contingencyPolicy = getActionContingencyPolicy(actionType);
    const requiresApproval = risk.isHighRisk && controlMode !== 'manual';
    const approvedBy = typeof body?.approvedBy === 'string' && body.approvedBy.trim().length > 0
      ? body.approvedBy.trim()
      : authz.actor.id;

    if (requiresApproval && !approvedBy) {
      return NextResponse.json({
        success: false,
        error: 'High-risk action requires explicit approval.',
        actionId,
        controlMode,
        requiresApproval,
      }, { status: 409 });
    }

    const seed: ActionResult = {
      id: actionId,
      decisionId: body?.decisionId || 'preview-decision',
      actionType,
      status: 'proposed',
      requestedAt: new Date(),
      fieldId: body?.fieldId,
      parameters: body?.parameters || {},
      cost: 0,
      controlMode,
      requiresApproval,
      approvalRequiredReason: requiresApproval ? (risk.reason || 'High-risk action requires explicit approval.') : undefined,
      approvedBy,
      contingencyPolicy,
      lifecycleHistory: [{ status: 'proposed', timestamp: new Date(), note: 'Preview action created' }],
    };

    store.addActionResult(seed);

    for (const next of transitions) {
      store.updateActionStatus(actionId, next, { preview: true, next });
    }

    const action = useOrchestratorStore.getState().completedActions.find((a) => a.id === actionId);
    if (!action) {
      return NextResponse.json({ error: 'Failed to read preview action state' }, { status: 500 });
    }

    const invalidTransitionDetected = action.status === 'failed' &&
      action.error?.toLowerCase().includes('invalid transition');
    if (action.status === 'failed' || action.status === 'cancelled') {
      createIncident({
        title: `Action ${action.status}: ${action.actionType}`,
        description: action.error || `Action ${action.id} ended with status ${action.status}.`,
        severity: action.status === 'failed' ? 'high' : 'medium',
        source: 'action',
        relatedEntityType: 'action',
        relatedEntityId: action.id,
        recommendedActions: [
          'Review lifecycle history and contingency policy.',
          'Validate operator override requirements before retry.',
        ],
        metadata: {
          actionId: action.id,
          finalStatus: action.status,
          invalidTransitionDetected,
          guardrail,
        },
        actorId: authz.actor.id,
      });
    }

    return NextResponse.json({
      success: true,
      actionId,
      finalStatus: action.status,
      controlMode: action.controlMode,
      requiresApproval: action.requiresApproval,
      contingencyPolicy: action.contingencyPolicy,
      lifecycleHistory: action.lifecycleHistory,
      transitionCount: action.lifecycleHistory.length,
      invalidTransitionDetected,
      guardrail,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed lifecycle preview', details: (error as Error).message },
      { status: 400 }
    );
  }
}
