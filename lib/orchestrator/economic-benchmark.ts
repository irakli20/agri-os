import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';
import type { Decision } from '@/types/orchestrator';

export type BenchmarkBand = 'leading' | 'above_average' | 'average' | 'below_average' | 'lagging';

export interface EconomicBenchmarkEntry {
  id: string;
  label: string;
  type: 'field' | 'crop';
  crop?: string;
  decisions: number;
  outcomes: number;
  estimatedRecords: number;
  acres: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  roiPct: number;
  marginPct: number;
  yield: number;
  yieldPerAcre: number;
  costPerAcre: number;
  profitPerAcre: number;
  benchmarkScore: number;
  percentile: number;
  benchmarkBand: BenchmarkBand;
}

export interface EconomicBenchmarkReport {
  generatedAt: Date;
  seasonContext: {
    season: string;
    week: number;
    year: number;
  };
  summary: {
    entriesByField: number;
    entriesByCrop: number;
    topField?: string;
    topCrop?: string;
    medianProfitPerAcre: number;
    medianRoiPct: number;
    spreadProfitPerAcre: number;
  };
  byField: EconomicBenchmarkEntry[];
  byCrop: EconomicBenchmarkEntry[];
  insights: string[];
}

interface FieldMeta {
  id: string;
  name: string;
  crop?: string;
  acres?: number;
}

interface AggregateBucket {
  id: string;
  label: string;
  type: 'field' | 'crop';
  crop?: string;
  decisions: number;
  outcomes: number;
  estimatedRecords: number;
  acres: number;
  totalRevenue: number;
  totalCost: number;
  yield: number;
  fieldIds: Set<string>;
}

interface DecisionEconomics {
  revenue: number;
  cost: number;
  yield: number;
  isEstimated: boolean;
  hasOutcome: boolean;
}

function round(value: number, places = 2): number {
  const factor = Math.pow(10, places);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getFieldCatalog(): Map<string, FieldMeta> {
  const fieldStore = useFieldStore.getState();
  const map = new Map<string, FieldMeta>();
  for (const field of [...fieldStore.fields, ...fieldStore.gameFields]) {
    map.set(field.id, {
      id: field.id,
      name: field.name,
      crop: field.crop,
      acres: Number(field.acres || 0),
    });
  }
  return map;
}

function estimateDecisionEconomics(decision: Decision): DecisionEconomics | null {
  if (!decision.fieldId) return null;

  if (decision.outcome) {
    return {
      revenue: Math.max(0, Number(decision.outcome.actualRevenue || 0)),
      cost: Math.max(0, Number(decision.outcome.actualCost || 0)),
      yield: Math.max(0, Number(decision.outcome.yield || 0)),
      isEstimated: false,
      hasOutcome: true,
    };
  }

  if (decision.status === 'approved' || decision.status === 'executing' || decision.status === 'completed') {
    return {
      revenue: Math.max(0, Number(decision.recommendation.expectedRevenue || 0) * 0.55),
      cost: Math.max(0, Number(decision.recommendation.expectedCost || 0) * 0.9),
      yield: Math.max(0, Number(decision.recommendation.expectedImpact?.yieldDeltaPct || 0) * 0.08),
      isEstimated: true,
      hasOutcome: false,
    };
  }

  if (decision.status === 'failed') {
    return {
      revenue: 0,
      cost: Math.max(0, Number(decision.recommendation.expectedCost || 0) * 0.65),
      yield: 0,
      isEstimated: true,
      hasOutcome: false,
    };
  }

  return null;
}

function percentileByRank(index: number, total: number): number {
  if (total <= 1) return 100;
  return round(((total - index - 1) / (total - 1)) * 100, 1);
}

function minMaxNormalize(value: number, min: number, max: number, invert = false): number {
  if (max <= min) return 50;
  const norm = ((value - min) / (max - min)) * 100;
  return invert ? 100 - norm : norm;
}

function applyBenchmarkScoring(entries: EconomicBenchmarkEntry[]): EconomicBenchmarkEntry[] {
  if (entries.length === 0) return [];

  const roiValues = entries.map((entry) => entry.roiPct);
  const profitValues = entries.map((entry) => entry.profitPerAcre);
  const costValues = entries.map((entry) => entry.costPerAcre);

  const minRoi = Math.min(...roiValues);
  const maxRoi = Math.max(...roiValues);
  const minProfit = Math.min(...profitValues);
  const maxProfit = Math.max(...profitValues);
  const minCost = Math.min(...costValues);
  const maxCost = Math.max(...costValues);

  const scored = entries
    .map((entry) => {
      const roiNorm = minMaxNormalize(entry.roiPct, minRoi, maxRoi);
      const profitNorm = minMaxNormalize(entry.profitPerAcre, minProfit, maxProfit);
      const costNorm = minMaxNormalize(entry.costPerAcre, minCost, maxCost, true);
      const benchmarkScore = round((roiNorm * 0.4) + (profitNorm * 0.45) + (costNorm * 0.15), 1);

      let benchmarkBand: BenchmarkBand = 'average';
      if (benchmarkScore >= 80) benchmarkBand = 'leading';
      else if (benchmarkScore >= 65) benchmarkBand = 'above_average';
      else if (benchmarkScore < 30) benchmarkBand = 'lagging';
      else if (benchmarkScore < 45) benchmarkBand = 'below_average';

      return {
        ...entry,
        benchmarkScore,
        benchmarkBand,
      };
    })
    .sort((a, b) => b.benchmarkScore - a.benchmarkScore)
    .map((entry, index, arr) => ({
      ...entry,
      percentile: percentileByRank(index, arr.length),
    }));

  return scored;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return round((sorted[mid - 1] + sorted[mid]) / 2, 2);
  }
  return round(sorted[mid], 2);
}

function createEntryFromBucket(bucket: AggregateBucket): EconomicBenchmarkEntry {
  const acres = Math.max(1, bucket.acres || 1);
  const netProfit = bucket.totalRevenue - bucket.totalCost;
  const roiPct = bucket.totalCost > 0 ? (netProfit / bucket.totalCost) * 100 : 0;
  const marginPct = bucket.totalRevenue > 0 ? (netProfit / bucket.totalRevenue) * 100 : 0;

  return {
    id: bucket.id,
    label: bucket.label,
    type: bucket.type,
    crop: bucket.crop,
    decisions: bucket.decisions,
    outcomes: bucket.outcomes,
    estimatedRecords: bucket.estimatedRecords,
    acres: round(acres, 2),
    totalRevenue: round(bucket.totalRevenue),
    totalCost: round(bucket.totalCost),
    netProfit: round(netProfit),
    roiPct: round(roiPct, 2),
    marginPct: round(marginPct, 2),
    yield: round(bucket.yield, 2),
    yieldPerAcre: round(bucket.yield / acres, 3),
    costPerAcre: round(bucket.totalCost / acres, 2),
    profitPerAcre: round(netProfit / acres, 2),
    benchmarkScore: 0,
    percentile: 0,
    benchmarkBand: 'average',
  };
}

export function generateEconomicBenchmarkReport(): EconomicBenchmarkReport {
  const orchestrator = useOrchestratorStore.getState();
  const gameStore = useGameStore.getState();
  const fieldCatalog = getFieldCatalog();
  const decisions = orchestrator.activeDecisions;

  const fieldBuckets = new Map<string, AggregateBucket>();
  const cropBuckets = new Map<string, AggregateBucket>();

  for (const decision of decisions) {
    if (!decision.fieldId) continue;
    const economics = estimateDecisionEconomics(decision);
    if (!economics) continue;

    const fieldMeta = fieldCatalog.get(decision.fieldId);
    const fieldLabel = fieldMeta?.name || decision.fieldId;
    const fieldCrop = fieldMeta?.crop || 'Unknown Crop';
    const fieldAcres = Math.max(1, Number(fieldMeta?.acres || 1));

    const fieldBucket = fieldBuckets.get(decision.fieldId) || {
      id: decision.fieldId,
      label: fieldLabel,
      type: 'field',
      crop: fieldCrop,
      decisions: 0,
      outcomes: 0,
      estimatedRecords: 0,
      acres: fieldAcres,
      totalRevenue: 0,
      totalCost: 0,
      yield: 0,
      fieldIds: new Set<string>([decision.fieldId]),
    };

    fieldBucket.decisions += 1;
    if (economics.hasOutcome) fieldBucket.outcomes += 1;
    if (economics.isEstimated) fieldBucket.estimatedRecords += 1;
    fieldBucket.totalRevenue += economics.revenue;
    fieldBucket.totalCost += economics.cost;
    fieldBucket.yield += economics.yield;
    fieldBuckets.set(decision.fieldId, fieldBucket);

    const cropKey = fieldCrop;
    const cropBucket = cropBuckets.get(cropKey) || {
      id: cropKey.toLowerCase().replace(/\s+/g, '-'),
      label: cropKey,
      type: 'crop',
      crop: cropKey,
      decisions: 0,
      outcomes: 0,
      estimatedRecords: 0,
      acres: 0,
      totalRevenue: 0,
      totalCost: 0,
      yield: 0,
      fieldIds: new Set<string>(),
    };

    cropBucket.decisions += 1;
    if (economics.hasOutcome) cropBucket.outcomes += 1;
    if (economics.isEstimated) cropBucket.estimatedRecords += 1;
    cropBucket.totalRevenue += economics.revenue;
    cropBucket.totalCost += economics.cost;
    cropBucket.yield += economics.yield;
    if (!cropBucket.fieldIds.has(decision.fieldId)) {
      cropBucket.fieldIds.add(decision.fieldId);
      cropBucket.acres += fieldAcres;
    }
    cropBuckets.set(cropKey, cropBucket);
  }

  const byField = applyBenchmarkScoring(
    Array.from(fieldBuckets.values()).map((bucket) => createEntryFromBucket(bucket))
  );
  const byCrop = applyBenchmarkScoring(
    Array.from(cropBuckets.values()).map((bucket) => createEntryFromBucket(bucket))
  );

  const fieldProfitPerAcre = byField.map((entry) => entry.profitPerAcre);
  const fieldRoi = byField.map((entry) => entry.roiPct);
  const medianProfitPerAcre = median(fieldProfitPerAcre);
  const medianRoiPct = median(fieldRoi);
  const spreadProfitPerAcre = byField.length > 0
    ? round(Math.max(...fieldProfitPerAcre) - Math.min(...fieldProfitPerAcre), 2)
    : 0;

  const insights: string[] = [];
  if (byField.length > 1) {
    const topField = byField[0];
    const bottomField = byField[byField.length - 1];
    insights.push(
      `${topField.label} outperforms ${bottomField.label} by ${round(topField.profitPerAcre - bottomField.profitPerAcre, 2).toLocaleString()} profit/acre.`
    );
  }
  if (byCrop.length > 0) {
    const topCrop = byCrop[0];
    insights.push(
      `${topCrop.label} leads crop economics with ${topCrop.roiPct.toLocaleString()}% ROI and score ${topCrop.benchmarkScore}.`
    );
  }
  const laggingFields = byField.filter((entry) => entry.benchmarkBand === 'lagging' || entry.benchmarkBand === 'below_average');
  if (laggingFields.length > 0) {
    insights.push(
      `${laggingFields.length} field(s) are below benchmark. Prioritize cost control and timing improvements on those fields.`
    );
  }
  if (insights.length === 0) {
    insights.push('Insufficient data for comparative benchmarking. Record more completed outcomes to unlock rankings.');
  }

  return {
    generatedAt: new Date(),
    seasonContext: {
      season: gameStore.gameTime.season,
      week: gameStore.gameTime.week,
      year: gameStore.gameTime.year,
    },
    summary: {
      entriesByField: byField.length,
      entriesByCrop: byCrop.length,
      topField: byField[0]?.label,
      topCrop: byCrop[0]?.label,
      medianProfitPerAcre,
      medianRoiPct,
      spreadProfitPerAcre,
    },
    byField,
    byCrop,
    insights,
  };
}
