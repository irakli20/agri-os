import type { ActionLifecycleStatus } from '@/types/orchestrator';

const TERMINAL_STATES: ActionLifecycleStatus[] = ['completed', 'failed', 'cancelled'];

export const ACTION_LIFECYCLE_TRANSITIONS: Record<ActionLifecycleStatus, ActionLifecycleStatus[]> = {
  proposed: ['approved', 'cancelled', 'failed'],
  approved: ['dispatched', 'cancelled', 'failed'],
  dispatched: ['acknowledged', 'failed', 'cancelled'],
  acknowledged: ['completed', 'failed', 'cancelled'],
  completed: [],
  failed: [],
  cancelled: [],
};

export function canTransitionActionStatus(
  from: ActionLifecycleStatus,
  to: ActionLifecycleStatus
): boolean {
  return ACTION_LIFECYCLE_TRANSITIONS[from]?.includes(to) || false;
}

export function isTerminalActionStatus(status: ActionLifecycleStatus): boolean {
  return TERMINAL_STATES.includes(status);
}
