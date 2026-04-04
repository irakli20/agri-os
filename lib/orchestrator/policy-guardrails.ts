import type { ActionControlMode, ActionType, DecisionPriority } from '@/types/orchestrator';
import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';

export type GuardrailDecision = 'allow' | 'warn' | 'block';
export type GuardrailSeverity = 'warning' | 'critical';

export interface GuardrailHit {
  code: string;
  severity: GuardrailSeverity;
  message: string;
  remediation: string;
  context?: Record<string, any>;
}

export interface GuardrailEvaluation {
  policyVersion: string;
  decision: GuardrailDecision;
  hits: GuardrailHit[];
  evaluatedAt: Date;
  context: {
    actionType?: ActionType;
    controlMode?: ActionControlMode;
    priority?: DecisionPriority;
    requestedOperation?: string;
  };
}

export interface EvaluateGuardrailsInput {
  source: 'decision_approval' | 'action_dispatch' | 'orchestrator_control';
  actionType?: ActionType;
  controlMode?: ActionControlMode;
  priority?: DecisionPriority;
  parameters?: Record<string, any>;
  requestedOperation?: string;
  targetMode?: string;
}

const POLICY_VERSION = 'guardrails-v1.0.0';

function makeHit(
  code: string,
  severity: GuardrailSeverity,
  message: string,
  remediation: string,
  context?: Record<string, any>
): GuardrailHit {
  return {
    code,
    severity,
    message,
    remediation,
    context,
  };
}

export function resolveActionTypeFromDecisionType(value: unknown): ActionType | undefined {
  if (typeof value !== 'string') return undefined;
  const type = value.toLowerCase();
  const map: Record<string, ActionType> = {
    plant: 'plant_crop',
    irrigate: 'apply_irrigation',
    fertilize: 'apply_fertilizer',
    spray: 'apply_treatment',
    treat: 'apply_treatment',
    harvest: 'harvest',
    scout: 'scout',
    sell: 'sell_product',
    buy: 'buy_inputs',
    lease: 'lease_equipment',
    maintenance: 'schedule_maintenance',
    emergency: 'emergency_response',
  };
  return map[type];
}

export function evaluateOrchestratorGuardrails(input: EvaluateGuardrailsInput): GuardrailEvaluation {
  const hits: GuardrailHit[] = [];
  const weather = useGameStore.getState().weeklyWeather;
  const safety = useOrchestratorStore.getState().safety;

  const windMph = Number(input.parameters?.windMph ?? weather?.windMph ?? 0);
  const precipitationChance = Number(input.parameters?.precipitationChance ?? weather?.precipitationChance ?? 0);
  const actionType = input.actionType;
  const controlMode = input.controlMode;
  const priority = input.priority;

  if (safety.emergencyStopActive && input.source !== 'orchestrator_control') {
    hits.push(
      makeHit(
        'EMERGENCY_STOP_ACTIVE',
        'critical',
        'Dispatch is blocked while emergency stop is active.',
        'Release emergency stop with authorized safety workflow before dispatching actions.',
        {
          emergencyStopBy: safety.emergencyStopBy,
          emergencyStopReason: safety.emergencyStopReason,
        }
      )
    );
  }

  if (input.source === 'orchestrator_control' && input.requestedOperation === 'start' && safety.emergencyStopActive) {
    hits.push(
      makeHit(
        'START_BLOCKED_BY_EMERGENCY_STOP',
        'critical',
        'Cannot start orchestrator while emergency stop is active.',
        'Release emergency stop first, then retry start.',
        {
          emergencyStopBy: safety.emergencyStopBy,
        }
      )
    );
  }

  if (
    input.source === 'orchestrator_control' &&
    input.requestedOperation === 'mode' &&
    input.targetMode === 'fully_automated' &&
    safety.emergencyStopActive
  ) {
    hits.push(
      makeHit(
        'AUTOPILOT_MODE_BLOCKED',
        'critical',
        'Cannot enable fully automated mode while emergency stop is active.',
        'Resolve active safety incident and release emergency stop before switching to fully automated mode.'
      )
    );
  }

  if (actionType === 'apply_treatment') {
    if (!weather?.sprayOpen || windMph > 18 || precipitationChance > 60) {
      hits.push(
        makeHit(
          'SPRAY_WINDOW_UNSAFE',
          'critical',
          'Treatment dispatch blocked due unsafe spray window conditions.',
          'Wait for spray-open window with lower wind/rain risk or switch to manual contingency plan.',
          {
            windMph,
            precipitationChance,
            sprayOpen: weather?.sprayOpen,
          }
        )
      );
    } else if (windMph > 12 || precipitationChance > 40) {
      hits.push(
        makeHit(
          'SPRAY_WINDOW_RISKY',
          'warning',
          'Spray conditions are marginal and may reduce efficacy.',
          'Proceed only with operator confirmation and tighter monitoring.',
          { windMph, precipitationChance }
        )
      );
    }
  }

  if (actionType === 'harvest' && !weather?.harvestOpen) {
    hits.push(
      makeHit(
        'HARVEST_WINDOW_CLOSED',
        'critical',
        'Harvest dispatch blocked because harvest window is closed this week.',
        'Re-plan harvest for next open weather window or book external service contingency.'
      )
    );
  }

  const fieldworkActions = new Set<ActionType>([
    'plant_crop',
    'apply_fertilizer',
    'dispatch_equipment',
    'schedule_maintenance',
    'scout',
  ]);
  if (actionType && fieldworkActions.has(actionType) && !weather?.fieldworkOpen) {
    hits.push(
      makeHit(
        'FIELDWORK_WINDOW_CLOSED',
        'critical',
        'Fieldwork-dependent action blocked due current weather gate.',
        'Delay execution until fieldwork window opens or use service fallback where applicable.',
        { fieldworkOpen: weather?.fieldworkOpen }
      )
    );
  }

  if (controlMode === 'autopilot' && (priority === 'critical' || actionType === 'emergency_response')) {
    hits.push(
      makeHit(
        'AUTOPILOT_HIGH_RISK_BLOCK',
        'critical',
        'High-risk actions cannot dispatch in autopilot mode.',
        'Switch control mode to assisted/manual and require explicit human approval.',
        {
          priority,
          actionType,
        }
      )
    );
  }

  const hasCritical = hits.some((hit) => hit.severity === 'critical');
  const hasWarning = hits.some((hit) => hit.severity === 'warning');
  const decision: GuardrailDecision = hasCritical ? 'block' : hasWarning ? 'warn' : 'allow';

  return {
    policyVersion: POLICY_VERSION,
    decision,
    hits,
    evaluatedAt: new Date(),
    context: {
      actionType,
      controlMode,
      priority,
      requestedOperation: input.requestedOperation,
    },
  };
}
