import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { queryAuditEvents } from '@/lib/orchestrator/audit';
import type { ActionResult, Decision } from '@/types/orchestrator';

export interface FieldKpiSnapshot {
  fieldId: string;
  fieldName: string;
  crop?: string;
  acres?: number;
  period: {
    since: Date;
    until: Date;
  };
  seasonContext: {
    season: string;
    week: number;
    year: number;
  };
  kpis: {
    yield: number;
    cost: number;
    timingAdherencePct: number;
    stressEvents: number;
    avoidedLoss: number;
  };
  diagnostics: {
    outcomesCount: number;
    actionsCount: number;
    timingEvaluatedCount: number;
    alertEventsCount: number;
    complicationEventsCount: number;
  };
}

export interface FieldKpiResponse {
  generatedAt: Date;
  fields: FieldKpiSnapshot[];
  summary: {
    totalYield: number;
    totalCost: number;
    avgTimingAdherencePct: number;
    totalStressEvents: number;
    totalAvoidedLoss: number;
  };
}

interface FieldKpiOptions {
  fieldId?: string;
  since?: Date;
  until?: Date;
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function isTerminalAction(action: ActionResult): boolean {
  return action.status === 'completed' || action.status === 'failed' || action.status === 'cancelled';
}

function buildFieldCatalog(): Map<string, { name: string; crop?: string; acres?: number }> {
  const fieldStore = useFieldStore.getState();
  const catalog = new Map<string, { name: string; crop?: string; acres?: number }>();

  for (const field of [...fieldStore.fields, ...fieldStore.gameFields]) {
    catalog.set(field.id, { name: field.name, crop: field.crop, acres: field.acres });
  }

  return catalog;
}

function estimateAvoidedLoss(decision: Decision): number {
  const impact = decision.recommendation?.expectedImpact;
  if (!impact) return 0;

  const expectedRevenue = Math.max(0, Number(decision.recommendation?.expectedRevenue) || 0);
  const riskReductionPct = Math.max(0, Number(impact.riskReductionPct) || 0);
  const directRevenueDelta = Math.max(0, Number(impact.revenueDelta) || 0);
  const baselineAvoidedLoss = directRevenueDelta + (expectedRevenue * (riskReductionPct / 100));

  if (baselineAvoidedLoss <= 0) return 0;

  if (decision.outcome) {
    const expected = Math.max(1, expectedRevenue);
    const realizedRatio = Math.min(1.25, Math.max(0, decision.outcome.actualRevenue / expected));
    return baselineAvoidedLoss * realizedRatio;
  }

  if (decision.status === 'approved' || decision.status === 'executing') {
    return baselineAvoidedLoss * 0.5;
  }

  if (decision.status === 'completed') {
    return baselineAvoidedLoss * 0.75;
  }

  return 0;
}

export function getFieldKpiSnapshots(options: FieldKpiOptions = {}): FieldKpiResponse {
  const now = options.until || new Date();
  const since = options.since || new Date(now.getTime() - (120 * 24 * 60 * 60 * 1000));

  const orchestrator = useOrchestratorStore.getState();
  const gameStore = useGameStore.getState();
  const fieldCatalog = buildFieldCatalog();

  const decisions = orchestrator.activeDecisions.filter((decision) => {
    if (!decision.fieldId) return false;
    if (options.fieldId && decision.fieldId !== options.fieldId) return false;
    const createdAt = toDate(decision.createdAt);
    if (!createdAt) return true;
    return createdAt >= since && createdAt <= now;
  });

  const actions = orchestrator.completedActions.filter((action) => {
    if (!action.fieldId) return false;
    if (options.fieldId && action.fieldId !== options.fieldId) return false;
    const requestedAt = toDate(action.requestedAt);
    if (!requestedAt) return true;
    return requestedAt >= since && requestedAt <= now;
  });

  const alertEvents = queryAuditEvents({
    eventType: 'alert_created',
    since,
    until: now,
    limit: 2000,
  });

  const fieldIds = new Set<string>();
  for (const decision of decisions) {
    if (decision.fieldId) fieldIds.add(decision.fieldId);
  }
  for (const action of actions) {
    if (action.fieldId) fieldIds.add(action.fieldId);
  }
  if (options.fieldId) {
    fieldIds.add(options.fieldId);
  }
  if (!options.fieldId) {
    for (const fieldId of fieldCatalog.keys()) {
      fieldIds.add(fieldId);
    }
  }

  const snapshots: FieldKpiSnapshot[] = Array.from(fieldIds)
    .map((fieldId) => {
      const fieldDecisions = decisions.filter((decision) => decision.fieldId === fieldId);
      const decisionById = new Map(fieldDecisions.map((decision) => [decision.id, decision]));
      const fieldActions = actions.filter((action) => action.fieldId === fieldId);
      const terminalActions = fieldActions.filter(isTerminalAction);

      const outcomeBackedDecisionIds = new Set(
        fieldDecisions.filter((decision) => Boolean(decision.outcome)).map((decision) => decision.id)
      );

      const totalYieldFromOutcomes = fieldDecisions.reduce((sum, decision) => sum + (decision.outcome?.yield || 0), 0);
      const totalYieldFromActions = terminalActions
        .filter((action) => !outcomeBackedDecisionIds.has(action.decisionId))
        .reduce((sum, action) => {
          const actionYield = Number(action.result?.outputs?.yield) || 0;
          return sum + Math.max(0, actionYield);
        }, 0);

      const totalCostFromOutcomes = fieldDecisions.reduce((sum, decision) => sum + (decision.outcome?.actualCost || 0), 0);
      const totalCostFromActions = terminalActions
        .filter((action) => !outcomeBackedDecisionIds.has(action.decisionId))
        .reduce((sum, action) => sum + Math.max(0, Number(action.cost) || 0), 0);

      const timingEvaluated = terminalActions.filter((action) => {
        const decision = decisionById.get(action.decisionId);
        const deadline = toDate(decision?.recommendation?.timeWindow?.end) || toDate(decision?.recommendation?.deadline);
        const completedAt = toDate(action.completedAt) || toDate(action.acknowledgedAt) || toDate(action.dispatchedAt);
        return Boolean(deadline && completedAt);
      });

      const onTimeCount = timingEvaluated.filter((action) => {
        const decision = decisionById.get(action.decisionId);
        const deadline = toDate(decision?.recommendation?.timeWindow?.end) || toDate(decision?.recommendation?.deadline);
        const completedAt = toDate(action.completedAt) || toDate(action.acknowledgedAt) || toDate(action.dispatchedAt);
        if (!deadline || !completedAt) return false;
        return completedAt.getTime() <= deadline.getTime();
      }).length;

      const timingAdherencePct = timingEvaluated.length > 0
        ? Number(((onTimeCount / timingEvaluated.length) * 100).toFixed(1))
        : 100;

      const fieldAlertEvents = alertEvents.filter((event) => {
        const metadataFieldId = (event.metadata?.fieldId as string | undefined) || undefined;
        return metadataFieldId === fieldId && (event.severity === 'warning' || event.severity === 'critical');
      });

      const complicationEventsCount = fieldDecisions.reduce(
        (sum, decision) => sum + (decision.outcome?.complications?.length || 0),
        0
      );

      const stressEvents = fieldAlertEvents.length + complicationEventsCount;
      const avoidedLoss = fieldDecisions.reduce((sum, decision) => sum + estimateAvoidedLoss(decision), 0);

      const fieldMeta = fieldCatalog.get(fieldId);
      return {
        fieldId,
        fieldName: fieldMeta?.name || `Field ${fieldId}`,
        crop: fieldMeta?.crop,
        acres: fieldMeta?.acres,
        period: { since, until: now },
        seasonContext: {
          season: gameStore.gameTime.season,
          week: gameStore.gameTime.week,
          year: gameStore.gameTime.year,
        },
        kpis: {
          yield: Number((totalYieldFromOutcomes + totalYieldFromActions).toFixed(2)),
          cost: Number((totalCostFromOutcomes + totalCostFromActions).toFixed(2)),
          timingAdherencePct,
          stressEvents,
          avoidedLoss: Number(avoidedLoss.toFixed(2)),
        },
        diagnostics: {
          outcomesCount: fieldDecisions.filter((decision) => Boolean(decision.outcome)).length,
          actionsCount: fieldActions.length,
          timingEvaluatedCount: timingEvaluated.length,
          alertEventsCount: fieldAlertEvents.length,
          complicationEventsCount,
        },
      };
    })
    .sort((a, b) => a.fieldName.localeCompare(b.fieldName));

  const summary = {
    totalYield: Number(snapshots.reduce((sum, item) => sum + item.kpis.yield, 0).toFixed(2)),
    totalCost: Number(snapshots.reduce((sum, item) => sum + item.kpis.cost, 0).toFixed(2)),
    avgTimingAdherencePct: snapshots.length > 0
      ? Number((snapshots.reduce((sum, item) => sum + item.kpis.timingAdherencePct, 0) / snapshots.length).toFixed(1))
      : 100,
    totalStressEvents: snapshots.reduce((sum, item) => sum + item.kpis.stressEvents, 0),
    totalAvoidedLoss: Number(snapshots.reduce((sum, item) => sum + item.kpis.avoidedLoss, 0).toFixed(2)),
  };

  return {
    generatedAt: new Date(),
    fields: snapshots,
    summary,
  };
}
