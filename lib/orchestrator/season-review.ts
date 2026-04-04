import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { getFieldKpiSnapshots } from '@/lib/orchestrator/kpi';
import { generateEconomicBenchmarkReport, type EconomicBenchmarkReport } from '@/lib/orchestrator/economic-benchmark';
import type { Decision, DecisionType } from '@/types/orchestrator';

export interface DecisionAttribution {
  decisionId: string;
  title: string;
  type: DecisionType;
  priority: Decision['priority'];
  status: Decision['status'];
  fieldId?: string;
  fieldName?: string;
  confidence: number;
  expectedROI: number;
  actualROI?: number;
  expectedProfit: number;
  realizedProfit: number;
  attributedImpact: number;
  impact: 'positive' | 'negative' | 'neutral';
  note: string;
}

export interface DecisionTypeAttribution {
  type: DecisionType;
  decisions: number;
  outcomes: number;
  avgROI: number;
  netImpact: number;
  successRatePct: number;
}

export interface FieldAttributionSummary {
  fieldId: string;
  fieldName: string;
  decisions: number;
  outcomes: number;
  netImpact: number;
  avgROI: number;
}

export interface SeasonReviewReport {
  generatedAt: Date;
  seasonContext: {
    season: string;
    week: number;
    year: number;
  };
  summary: {
    fieldsReviewed: number;
    decisionsReviewed: number;
    decisionsWithOutcomes: number;
    outcomeCoveragePct: number;
    avgConfidence: number;
    avgTimingAdherencePct: number;
    totalYield: number;
    totalCost: number;
    totalAvoidedLoss: number;
    netAttributedImpact: number;
  };
  attribution: {
    decisions: DecisionAttribution[];
    topPositive: DecisionAttribution[];
    topNegative: DecisionAttribution[];
    byDecisionType: DecisionTypeAttribution[];
    byField: FieldAttributionSummary[];
  };
  benchmarking: EconomicBenchmarkReport;
  recommendations: string[];
}

function getFieldNameMap(): Map<string, string> {
  const fieldStore = useFieldStore.getState();
  const map = new Map<string, string>();

  for (const field of [...fieldStore.fields, ...fieldStore.gameFields]) {
    map.set(field.id, field.name);
  }

  return map;
}

function round(value: number, places = 2): number {
  const factor = Math.pow(10, places);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function resolveAttribution(decision: Decision): Pick<DecisionAttribution, 'expectedProfit' | 'realizedProfit' | 'attributedImpact' | 'impact' | 'note'> {
  const expectedProfit = (decision.recommendation.expectedRevenue || 0) - (decision.recommendation.expectedCost || 0);
  const hasOutcome = Boolean(decision.outcome);
  const realizedProfit = hasOutcome
    ? (decision.outcome?.actualRevenue || 0) - (decision.outcome?.actualCost || 0)
    : 0;

  let attributedImpact = 0;
  let note = 'No measurable outcome recorded yet.';

  if (hasOutcome) {
    attributedImpact = realizedProfit;
    note = decision.outcome?.complications?.length
      ? `Outcome recorded with ${decision.outcome.complications.length} complication(s).`
      : 'Outcome recorded and attributed from realized profit.';
  } else if (decision.status === 'approved' || decision.status === 'executing' || decision.status === 'completed') {
    attributedImpact = expectedProfit * 0.4;
    note = 'Outcome missing; using conservative 40% expected-profit attribution.';
  } else if (decision.status === 'failed') {
    attributedImpact = -Math.abs((decision.recommendation.expectedCost || 0) * 0.5);
    note = 'Failed execution; applying estimated recovery-adjusted cost impact.';
  }

  const impact: DecisionAttribution['impact'] =
    attributedImpact > 0 ? 'positive' : attributedImpact < 0 ? 'negative' : 'neutral';

  return {
    expectedProfit: round(expectedProfit),
    realizedProfit: round(realizedProfit),
    attributedImpact: round(attributedImpact),
    impact,
    note,
  };
}

export function generateSeasonReviewReport(): SeasonReviewReport {
  const orchestrator = useOrchestratorStore.getState();
  const gameStore = useGameStore.getState();
  const fieldNameById = getFieldNameMap();
  const fieldKpis = getFieldKpiSnapshots();
  const benchmarking = generateEconomicBenchmarkReport();
  const decisions = orchestrator.activeDecisions;

  const attributionDecisions: DecisionAttribution[] = decisions.map((decision) => {
    const attribution = resolveAttribution(decision);
    return {
      decisionId: decision.id,
      title: decision.title,
      type: decision.type,
      priority: decision.priority,
      status: decision.status,
      fieldId: decision.fieldId,
      fieldName: decision.fieldId ? fieldNameById.get(decision.fieldId) || decision.fieldId : undefined,
      confidence: round(decision.recommendation.confidence || 0),
      expectedROI: round(decision.recommendation.expectedROI || 0),
      actualROI: decision.outcome ? round(decision.outcome.actualROI || 0) : undefined,
      ...attribution,
    };
  });

  const decisionsWithOutcomes = attributionDecisions.filter((decision) => typeof decision.actualROI === 'number');
  const coveragePct = attributionDecisions.length
    ? (decisionsWithOutcomes.length / attributionDecisions.length) * 100
    : 0;

  const byDecisionTypeMap = new Map<DecisionType, DecisionAttribution[]>();
  for (const decision of attributionDecisions) {
    const existing = byDecisionTypeMap.get(decision.type) || [];
    existing.push(decision);
    byDecisionTypeMap.set(decision.type, existing);
  }

  const byDecisionType: DecisionTypeAttribution[] = Array.from(byDecisionTypeMap.entries())
    .map(([type, items]) => {
      const outcomes = items.filter((item) => typeof item.actualROI === 'number');
      const avgROIBase = outcomes.length > 0
        ? outcomes.reduce((sum, item) => sum + (item.actualROI || 0), 0) / outcomes.length
        : items.reduce((sum, item) => sum + item.expectedROI, 0) / Math.max(1, items.length);
      const netImpact = items.reduce((sum, item) => sum + item.attributedImpact, 0);
      const successful = items.filter((item) => item.impact === 'positive').length;
      return {
        type,
        decisions: items.length,
        outcomes: outcomes.length,
        avgROI: round(avgROIBase),
        netImpact: round(netImpact),
        successRatePct: round((successful / Math.max(1, items.length)) * 100, 1),
      };
    })
    .sort((a, b) => b.netImpact - a.netImpact);

  const byFieldMap = new Map<string, DecisionAttribution[]>();
  for (const decision of attributionDecisions) {
    if (!decision.fieldId) continue;
    const existing = byFieldMap.get(decision.fieldId) || [];
    existing.push(decision);
    byFieldMap.set(decision.fieldId, existing);
  }

  const byField: FieldAttributionSummary[] = Array.from(byFieldMap.entries())
    .map(([fieldId, items]) => {
      const outcomes = items.filter((item) => typeof item.actualROI === 'number');
      const avgROI = outcomes.length > 0
        ? outcomes.reduce((sum, item) => sum + (item.actualROI || 0), 0) / outcomes.length
        : items.reduce((sum, item) => sum + item.expectedROI, 0) / Math.max(1, items.length);
      return {
        fieldId,
        fieldName: fieldNameById.get(fieldId) || fieldId,
        decisions: items.length,
        outcomes: outcomes.length,
        netImpact: round(items.reduce((sum, item) => sum + item.attributedImpact, 0)),
        avgROI: round(avgROI),
      };
    })
    .sort((a, b) => b.netImpact - a.netImpact);

  const topPositive = [...attributionDecisions]
    .filter((item) => item.attributedImpact > 0)
    .sort((a, b) => b.attributedImpact - a.attributedImpact)
    .slice(0, 6);

  const topNegative = [...attributionDecisions]
    .filter((item) => item.attributedImpact < 0)
    .sort((a, b) => a.attributedImpact - b.attributedImpact)
    .slice(0, 6);

  const totalAttributedImpact = attributionDecisions.reduce((sum, item) => sum + item.attributedImpact, 0);
  const avgConfidence = attributionDecisions.length > 0
    ? attributionDecisions.reduce((sum, item) => sum + item.confidence, 0) / attributionDecisions.length
    : 0;

  const recommendations: string[] = [];
  if (coveragePct < 50) {
    recommendations.push('Outcome coverage is low. Record more completed decision outcomes before next season closeout.');
  }
  if (fieldKpis.summary.avgTimingAdherencePct < 80) {
    recommendations.push('Timing adherence is below target. Prioritize time-window execution discipline and dispatch readiness.');
  }
  if (fieldKpis.summary.totalStressEvents > Math.max(5, fieldKpis.fields.length * 2)) {
    recommendations.push('Stress event volume is high. Increase preventive scouting and earlier intervention thresholds.');
  }
  if (totalAttributedImpact < 0) {
    recommendations.push('Net attributed impact is negative. Review top negative decisions and tighten approval criteria.');
  } else if (totalAttributedImpact > 0) {
    recommendations.push('Net attributed impact is positive. Replicate top-performing decision patterns across more fields.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Season performance is stable. Continue monitoring attribution trends and collect richer outcome telemetry.');
  }
  if (benchmarking.insights.length > 0) {
    recommendations.push(`Benchmark insight: ${benchmarking.insights[0]}`);
  }

  return {
    generatedAt: new Date(),
    seasonContext: {
      season: gameStore.gameTime.season,
      week: gameStore.gameTime.week,
      year: gameStore.gameTime.year,
    },
    summary: {
      fieldsReviewed: byField.length,
      decisionsReviewed: attributionDecisions.length,
      decisionsWithOutcomes: decisionsWithOutcomes.length,
      outcomeCoveragePct: round(coveragePct, 1),
      avgConfidence: round(avgConfidence, 1),
      avgTimingAdherencePct: fieldKpis.summary.avgTimingAdherencePct,
      totalYield: fieldKpis.summary.totalYield,
      totalCost: fieldKpis.summary.totalCost,
      totalAvoidedLoss: fieldKpis.summary.totalAvoidedLoss,
      netAttributedImpact: round(totalAttributedImpact),
    },
    attribution: {
      decisions: attributionDecisions.sort((a, b) => b.attributedImpact - a.attributedImpact),
      topPositive,
      topNegative,
      byDecisionType,
      byField,
    },
    benchmarking,
    recommendations,
  };
}
