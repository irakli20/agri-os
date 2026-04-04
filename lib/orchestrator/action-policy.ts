import type {
  ActionControlMode,
  AutomationLevel,
  Decision,
  DecisionExecutionPolicy,
  DecisionPriority,
} from '@/types/orchestrator';

function inferControlModeFromAutomation(
  automationLevel: AutomationLevel,
  isHighRisk: boolean
): ActionControlMode {
  if (isHighRisk) {
    return 'manual';
  }

  if (automationLevel === 'fully_automated') {
    return 'autopilot';
  }

  if (automationLevel === 'assisted') {
    return 'assisted';
  }

  return 'manual';
}

export function isHighRiskDecision(decision: Pick<Decision, 'priority' | 'recommendation'>): {
  isHighRisk: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const score = decision.recommendation.priorityScoring;

  if (decision.priority === 'critical') {
    reasons.push('Critical priority decision.');
  }

  if ((score?.riskToYieldScore || 0) >= 85) {
    reasons.push(`Risk-to-yield score ${score.riskToYieldScore.toFixed(1)} is above high-risk threshold.`);
  }

  if ((score?.urgencyScore || 0) >= 90) {
    reasons.push(`Urgency score ${score.urgencyScore.toFixed(1)} requires immediate response.`);
  }

  if (decision.recommendation.riskFactors.length >= 3) {
    reasons.push('Multiple risk factors identified.');
  }

  return {
    isHighRisk: reasons.length > 0,
    reasons,
  };
}

export function evaluateDecisionExecutionPolicy(
  decision: Pick<Decision, 'priority' | 'recommendation'>,
  automationLevel: AutomationLevel
): DecisionExecutionPolicy {
  const risk = isHighRiskDecision(decision);
  return {
    controlMode: inferControlModeFromAutomation(automationLevel, risk.isHighRisk),
    isHighRisk: risk.isHighRisk,
    requiresApproval: risk.isHighRisk,
    reasons: risk.reasons,
    evaluatedAt: new Date(),
  };
}

export function isHighRiskAction(
  actionType: string,
  priority: DecisionPriority,
  parameters: Record<string, any>
): { isHighRisk: boolean; reason?: string } {
  if (priority === 'critical') {
    return { isHighRisk: true, reason: 'Critical-priority action.' };
  }

  if (actionType === 'emergency_response' || actionType === 'apply_treatment') {
    return { isHighRisk: true, reason: `Action type ${actionType} is safety-sensitive.` };
  }

  if ((parameters?.riskScore || 0) >= 85) {
    return { isHighRisk: true, reason: `Provided risk score ${parameters.riskScore} exceeds threshold.` };
  }

  return { isHighRisk: false };
}
