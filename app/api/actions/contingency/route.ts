import { NextRequest, NextResponse } from 'next/server';
import { getActionContingencyPolicy } from '@/lib/orchestrator/action-contingency';
import type { ActionType } from '@/types/orchestrator';

function resolveActionType(value: unknown): ActionType {
  const fallback: ActionType = 'apply_irrigation';
  if (typeof value !== 'string') {
    return fallback;
  }
  return value as ActionType;
}

/**
 * GET /api/actions/contingency?actionType=apply_irrigation
 * Returns the configured rollback/contingency policy for an action type.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const actionType = resolveActionType(url.searchParams.get('actionType'));
  const policy = getActionContingencyPolicy(actionType);

  return NextResponse.json({
    success: true,
    actionType,
    policy,
  });
}

/**
 * POST /api/actions/contingency
 * Returns policy and a deterministic simulated rollback outcome payload.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const actionType = resolveActionType(body?.actionType);
    const policy = getActionContingencyPolicy(actionType);
    const rollbackAttempted = policy.rollbackEnabled && policy.autoRollbackOnFailure;
    const simulatePartialFailure = Boolean(body?.simulatePartialFailure);

    const stepResults = rollbackAttempted
      ? policy.rollbackSteps.map((step, idx) => ({
        step,
        success: simulatePartialFailure ? idx !== policy.rollbackSteps.length - 1 : true,
        details: simulatePartialFailure && idx === policy.rollbackSteps.length - 1
          ? 'Simulated rollback step failure.'
          : 'Simulated rollback step success.',
      }))
      : [];

    const rollbackApplied = rollbackAttempted && stepResults.every((step) => step.success);

    return NextResponse.json({
      success: true,
      actionType,
      policy,
      simulatedRollback: {
        attempted: rollbackAttempted,
        applied: rollbackApplied,
        stepResults,
        summary: rollbackAttempted
          ? (rollbackApplied ? 'Simulated rollback success.' : 'Simulated rollback partial failure.')
          : 'No rollback configured for this action type.',
        attemptedAt: new Date(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to simulate contingency policy', details: (error as Error).message },
      { status: 400 }
    );
  }
}
