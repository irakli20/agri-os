import type { ActionContingencyPolicy, ActionType } from '@/types/orchestrator';

const DEFAULT_CONTINGENCY_POLICY: ActionContingencyPolicy = {
  actionType: 'scout',
  rollbackEnabled: true,
  autoRollbackOnFailure: true,
  rollbackSteps: ['Record failure context', 'Reverse reversible ledger mutations', 'Re-queue action for manual review'],
  contingencyActions: ['Escalate to operator for inspection'],
  escalationContactRole: 'operations_manager',
};

const ACTION_CONTINGENCY_POLICIES: Record<ActionType, ActionContingencyPolicy> = {
  plant_crop: {
    actionType: 'plant_crop',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund operation spend if planting did not complete',
      'Restore consumed seed inventory',
      'Revert planned planting dispatch status',
    ],
    contingencyActions: [
      'Schedule manual planter inspection',
      'Re-plan planting window with next weather slot',
    ],
    escalationContactRole: 'field_supervisor',
  },
  apply_irrigation: {
    actionType: 'apply_irrigation',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund operation spend for aborted irrigation',
      'Restore allocated fuel volume',
      'Flag irrigation controller diagnostics check',
    ],
    contingencyActions: [
      'Dispatch manual irrigation check',
      'Switch to assisted/manual mode for next irrigation cycle',
    ],
    escalationContactRole: 'irrigation_lead',
  },
  apply_fertilizer: {
    actionType: 'apply_fertilizer',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund operation spend for failed nutrient pass',
      'Restore fertilizer inventory if not applied',
      'Create calibration check task for spreader',
    ],
    contingencyActions: [
      'Require agronomist approval for retry',
      'Re-score risk and economics before resubmission',
    ],
    escalationContactRole: 'agronomist',
  },
  apply_treatment: {
    actionType: 'apply_treatment',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund operation spend if treatment application aborted',
      'Restore treatment inventory if safe to reclaim',
      'Place safety hold before next spray/treatment dispatch',
    ],
    contingencyActions: [
      'Trigger incident review',
      'Require manual sign-off for retry',
    ],
    escalationContactRole: 'safety_officer',
  },
  harvest: {
    actionType: 'harvest',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund operation spend for incomplete harvest run',
      'Restore allocated fuel inventory',
      'Re-open harvest window task with high urgency',
    ],
    contingencyActions: [
      'Assign alternate combine/operator',
      'Escalate weather-risk monitoring for delayed harvest',
    ],
    escalationContactRole: 'harvest_manager',
  },
  scout: {
    actionType: 'scout',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Refund scouting dispatch cost if applicable',
      'Log missed scouting slot for reschedule',
    ],
    contingencyActions: ['Schedule make-up scouting within 24h'],
    escalationContactRole: 'field_scout_lead',
  },
  sell_product: {
    actionType: 'sell_product',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Reverse provisional transaction booking',
      'Reconcile inventory lock for unsold product',
    ],
    contingencyActions: [
      'Re-route to alternate buyer',
      'Trigger price re-evaluation',
    ],
    escalationContactRole: 'commercial_manager',
  },
  buy_inputs: {
    actionType: 'buy_inputs',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Reverse purchase authorization',
      'Release committed budget amount',
    ],
    contingencyActions: ['Request alternate supplier quote'],
    escalationContactRole: 'procurement_manager',
  },
  lease_equipment: {
    actionType: 'lease_equipment',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Cancel lease reservation',
      'Reverse lease prepayment hold',
    ],
    contingencyActions: ['Switch to marketplace backup provider'],
    escalationContactRole: 'fleet_manager',
  },
  dispatch_equipment: {
    actionType: 'dispatch_equipment',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Cancel dispatch order',
      'Return equipment to ready queue',
      'Restore allocated fuel volume',
    ],
    contingencyActions: ['Retry dispatch with alternate equipment'],
    escalationContactRole: 'fleet_manager',
  },
  schedule_maintenance: {
    actionType: 'schedule_maintenance',
    rollbackEnabled: true,
    autoRollbackOnFailure: true,
    rollbackSteps: [
      'Cancel failed maintenance work order',
      'Release reserved parts and labor budget',
    ],
    contingencyActions: [
      'Escalate critical equipment to manual lockout',
      'Rebook maintenance with external provider',
    ],
    escalationContactRole: 'maintenance_lead',
  },
  emergency_response: {
    actionType: 'emergency_response',
    rollbackEnabled: false,
    autoRollbackOnFailure: false,
    rollbackSteps: [
      'Do not auto-rollback emergency actions',
      'Capture full incident telemetry for review',
    ],
    contingencyActions: [
      'Escalate to incident commander immediately',
      'Engage emergency stop/override workflow',
    ],
    escalationContactRole: 'incident_commander',
  },
};

export function getActionContingencyPolicy(actionType: ActionType): ActionContingencyPolicy {
  const policy = ACTION_CONTINGENCY_POLICIES[actionType];
  if (!policy) {
    return {
      ...DEFAULT_CONTINGENCY_POLICY,
      actionType,
    };
  }
  return policy;
}
