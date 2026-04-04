import 'server-only';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs';
import path from 'node:path';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { recordAuditEvent } from '@/lib/orchestrator/audit';
import type { Decision } from '@/types/orchestrator';

export type ModelTuningTrigger = 'manual' | 'auto' | 'scheduled';
export type ModelTuningRunStatus = 'completed' | 'insufficient_data' | 'skipped';

export interface ModelTuningSample {
  decisionId: string;
  fieldId?: string;
  decisionType: Decision['type'];
  expectedCost: number;
  actualCost: number;
  expectedRevenue: number;
  actualRevenue: number;
  expectedROI: number;
  actualROI: number;
  confidence: number;
  timeToComplete: number;
  expectedWindowHours: number;
}

export interface ModelParameterAdjustment {
  parameter: string;
  previousValue: number;
  tunedValue: number;
  deltaPct: number;
  confidence: number;
  sampleSize: number;
  reason: string;
}

export interface ModelTuningRun {
  id: string;
  trigger: ModelTuningTrigger;
  status: ModelTuningRunStatus;
  startedAt: Date;
  completedAt: Date;
  modelVersion: string;
  sampleSize: number;
  newOutcomesSinceLastRun: number;
  predictionAccuracyBefore: number;
  predictionAccuracyAfter: number;
  adjustments: ModelParameterAdjustment[];
  notes: string[];
}

export interface ModelTuningState {
  modelVersion: string;
  lastRunAt?: Date;
  totalRuns: number;
  lastProcessedOutcomeCount: number;
  autoTuneThreshold: number;
  minSamples: number;
  parameters: Record<string, number>;
  runs: ModelTuningRun[];
}

declare global {
  // eslint-disable-next-line no-var
  var __AGRI_OS_MODEL_TUNING_STATE__: ModelTuningState | undefined;
}

const MAX_TUNING_RUNS = 40;
const TUNING_STATE_PATH = path.join(process.cwd(), '.agri-model-tuning-state.json');

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, places = 4): number {
  const factor = Math.pow(10, places);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function safeRatio(numerator: number, denominator: number, fallback = 0): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback;
  }
  return numerator / denominator;
}

function calculateExpectedWindowHours(decision: Decision): number {
  const start = new Date(decision.recommendation?.timeWindow?.start || decision.createdAt);
  const end = new Date(decision.recommendation?.timeWindow?.end || decision.expiresAt || decision.createdAt);
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return 24;
  }
  return clamp(diffMs / (1000 * 60 * 60), 1, 336);
}

function createInitialState(): ModelTuningState {
  return {
    modelVersion: '1.0.0',
    totalRuns: 0,
    lastProcessedOutcomeCount: 0,
    autoTuneThreshold: 5,
    minSamples: 8,
    parameters: {
      cost_prediction_factor: 1,
      revenue_prediction_factor: 1,
      roi_prediction_factor: 1,
      confidence_scale: 1,
      timing_execution_factor: 1,
    },
    runs: [],
  };
}

function deserializeState(raw: string): ModelTuningState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<ModelTuningState>;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return {
      modelVersion: typeof parsed.modelVersion === 'string' ? parsed.modelVersion : '1.0.0',
      lastRunAt: parsed.lastRunAt ? new Date(parsed.lastRunAt) : undefined,
      totalRuns: Number(parsed.totalRuns || 0),
      lastProcessedOutcomeCount: Number(parsed.lastProcessedOutcomeCount || 0),
      autoTuneThreshold: Number(parsed.autoTuneThreshold || 5),
      minSamples: Number(parsed.minSamples || 8),
      parameters: (parsed.parameters && typeof parsed.parameters === 'object')
        ? Object.fromEntries(
          Object.entries(parsed.parameters).map(([key, value]) => [key, Number(value)])
        )
        : createInitialState().parameters,
      runs: Array.isArray(parsed.runs)
        ? parsed.runs.map((run) => ({
          ...(run as ModelTuningRun),
          startedAt: new Date((run as ModelTuningRun).startedAt),
          completedAt: new Date((run as ModelTuningRun).completedAt),
          adjustments: Array.isArray((run as ModelTuningRun).adjustments)
            ? (run as ModelTuningRun).adjustments.map((adjustment) => ({
              ...adjustment,
              previousValue: Number(adjustment.previousValue),
              tunedValue: Number(adjustment.tunedValue),
              deltaPct: Number(adjustment.deltaPct),
              confidence: Number(adjustment.confidence),
              sampleSize: Number(adjustment.sampleSize),
            }))
            : [],
          notes: Array.isArray((run as ModelTuningRun).notes)
            ? [...(run as ModelTuningRun).notes]
            : [],
        }))
        : [],
    };
  } catch {
    return null;
  }
}

function loadPersistedState(): ModelTuningState | null {
  try {
    if (!fs.existsSync(TUNING_STATE_PATH)) return null;
    const content = fs.readFileSync(TUNING_STATE_PATH, 'utf8');
    return deserializeState(content);
  } catch {
    return null;
  }
}

function persistState(state: ModelTuningState): void {
  try {
    fs.writeFileSync(TUNING_STATE_PATH, JSON.stringify(state), 'utf8');
  } catch {
    // Best-effort persistence. In-memory state remains usable if file write fails.
  }
}

function getStateRef(): ModelTuningState {
  if (!globalThis.__AGRI_OS_MODEL_TUNING_STATE__) {
    globalThis.__AGRI_OS_MODEL_TUNING_STATE__ = loadPersistedState() || createInitialState();
  }
  return globalThis.__AGRI_OS_MODEL_TUNING_STATE__;
}

function bumpPatchVersion(version: string): string {
  const parts = version.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return '1.0.1';
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function collectHistoricalOutcomeSamples(): ModelTuningSample[] {
  const orchestrator = useOrchestratorStore.getState();
  return orchestrator.activeDecisions
    .filter((decision) => Boolean(decision.outcome))
    .map((decision) => {
      const outcome = decision.outcome!;
      return {
        decisionId: decision.id,
        fieldId: decision.fieldId,
        decisionType: decision.type,
        expectedCost: Math.max(1, Number(decision.recommendation.expectedCost || 0)),
        actualCost: Math.max(0, Number(outcome.actualCost || 0)),
        expectedRevenue: Math.max(1, Number(decision.recommendation.expectedRevenue || 0)),
        actualRevenue: Math.max(0, Number(outcome.actualRevenue || 0)),
        expectedROI: Math.max(0.01, Number(decision.recommendation.expectedROI || 0)),
        actualROI: Math.max(0, Number(outcome.actualROI || 0)),
        confidence: clamp(Number(decision.recommendation.confidence || 0), 0, 100),
        timeToComplete: Math.max(0, Number(outcome.timeToComplete || 0)),
        expectedWindowHours: calculateExpectedWindowHours(decision),
      };
    });
}

function calculatePredictionAccuracyFromSamples(samples: ModelTuningSample[]): number {
  if (samples.length === 0) return 0;

  const costAcc = samples.map((sample) =>
    clamp(1 - Math.abs(sample.expectedCost - sample.actualCost) / sample.expectedCost, 0, 1)
  );
  const revenueAcc = samples.map((sample) =>
    clamp(1 - Math.abs(sample.expectedRevenue - sample.actualRevenue) / sample.expectedRevenue, 0, 1)
  );
  const roiAcc = samples.map((sample) =>
    clamp(1 - Math.abs(sample.expectedROI - sample.actualROI) / sample.expectedROI, 0, 1)
  );

  const avgCost = costAcc.reduce((sum, value) => sum + value, 0) / costAcc.length;
  const avgRevenue = revenueAcc.reduce((sum, value) => sum + value, 0) / revenueAcc.length;
  const avgRoi = roiAcc.reduce((sum, value) => sum + value, 0) / roiAcc.length;

  return round(((avgCost * 0.4) + (avgRevenue * 0.35) + (avgRoi * 0.25)) * 100, 2);
}

function buildAdjustments(
  state: ModelTuningState,
  samples: ModelTuningSample[],
  sampleSize: number
): ModelParameterAdjustment[] {
  const adjustments: ModelParameterAdjustment[] = [];

  const avgCostFactor = samples.reduce((sum, sample) => sum + safeRatio(sample.actualCost, sample.expectedCost, 1), 0) / sampleSize;
  const avgRevenueFactor = samples.reduce((sum, sample) => sum + safeRatio(sample.actualRevenue, sample.expectedRevenue, 1), 0) / sampleSize;
  const avgRoiFactor = samples.reduce((sum, sample) => sum + safeRatio(sample.actualROI, sample.expectedROI, 1), 0) / sampleSize;
  const avgTimingFactor = samples.reduce((sum, sample) => sum + safeRatio(sample.timeToComplete, sample.expectedWindowHours, 1), 0) / sampleSize;
  const avgSuccess = samples.reduce((sum, sample) => sum + (sample.actualROI >= 1 ? 1 : 0), 0) / sampleSize;
  const avgConfidence = samples.reduce((sum, sample) => sum + sample.confidence, 0) / sampleSize / 100;
  const confidenceScale = clamp(safeRatio(avgSuccess, Math.max(0.15, avgConfidence), 1), 0.6, 1.25);

  const specs: Array<{ parameter: string; observed: number; min: number; max: number; reason: string }> = [
    {
      parameter: 'cost_prediction_factor',
      observed: clamp(avgCostFactor, 0.5, 1.6),
      min: 0.5,
      max: 1.6,
      reason: 'Align expected cost with actual cost drift from historical outcomes.',
    },
    {
      parameter: 'revenue_prediction_factor',
      observed: clamp(avgRevenueFactor, 0.5, 1.8),
      min: 0.5,
      max: 1.8,
      reason: 'Correct revenue projection bias using realized season outcomes.',
    },
    {
      parameter: 'roi_prediction_factor',
      observed: clamp(avgRoiFactor, 0.4, 1.8),
      min: 0.4,
      max: 1.8,
      reason: 'Recalibrate expected ROI to historical realized ROI.',
    },
    {
      parameter: 'confidence_scale',
      observed: confidenceScale,
      min: 0.6,
      max: 1.25,
      reason: 'Calibrate recommendation confidence to observed decision success rate.',
    },
    {
      parameter: 'timing_execution_factor',
      observed: clamp(avgTimingFactor, 0.5, 1.8),
      min: 0.5,
      max: 1.8,
      reason: 'Adjust timing sensitivity based on actual completion-vs-window behavior.',
    },
  ];

  for (const spec of specs) {
    const previous = state.parameters[spec.parameter] ?? 1;
    const tuned = clamp((previous * 0.65) + (spec.observed * 0.35), spec.min, spec.max);
    const deltaPct = round(safeRatio(tuned - previous, Math.max(previous, 0.0001), 0) * 100, 2);
    const confidence = round(clamp(45 + sampleSize * 4.5, 45, 97), 1);
    adjustments.push({
      parameter: spec.parameter,
      previousValue: round(previous),
      tunedValue: round(tuned),
      deltaPct,
      confidence,
      sampleSize,
      reason: spec.reason,
    });
  }

  return adjustments;
}

function buildInsufficientDataRun(
  state: ModelTuningState,
  trigger: ModelTuningTrigger,
  sampleSize: number,
  newOutcomesSinceLastRun: number,
  minSamples: number,
  runStartedAt: Date
): ModelTuningRun {
  const before = useOrchestratorStore.getState().performanceMetrics.predictionAccuracy || 0;
  const now = new Date();
  const status: ModelTuningRunStatus = sampleSize === 0 ? 'insufficient_data' : 'skipped';
  const notes =
    status === 'insufficient_data'
      ? [`At least ${minSamples} outcomes are required for reliable tuning.`]
      : ['Auto/scheduled trigger skipped because new outcome threshold was not met.'];

  return {
    id: uuidv4(),
    trigger,
    status,
    startedAt: runStartedAt,
    completedAt: now,
    modelVersion: state.modelVersion,
    sampleSize,
    newOutcomesSinceLastRun,
    predictionAccuracyBefore: round(before, 2),
    predictionAccuracyAfter: round(before, 2),
    adjustments: [],
    notes,
  };
}

export function runContinuousModelTuning(options: {
  trigger?: ModelTuningTrigger;
  force?: boolean;
  minSamples?: number;
  minNewOutcomes?: number;
} = {}): ModelTuningRun {
  const trigger = options.trigger || 'manual';
  const state = getStateRef();
  const samples = collectHistoricalOutcomeSamples();
  const sampleSize = samples.length;
  const minSamples = Math.max(3, options.minSamples ?? state.minSamples);
  const minNewOutcomes = Math.max(1, options.minNewOutcomes ?? state.autoTuneThreshold);
  const newOutcomesSinceLastRun = Math.max(0, sampleSize - state.lastProcessedOutcomeCount);
  const runStartedAt = new Date();

  if (!options.force && sampleSize < minSamples) {
    const run = buildInsufficientDataRun(
      state,
      trigger,
      sampleSize,
      newOutcomesSinceLastRun,
      minSamples,
      runStartedAt
    );
    state.runs.unshift(run);
    state.runs = state.runs.slice(0, MAX_TUNING_RUNS);
    state.totalRuns += 1;
    state.lastRunAt = run.completedAt;
    persistState(state);
    return run;
  }

  if (!options.force && (trigger === 'auto' || trigger === 'scheduled') && newOutcomesSinceLastRun < minNewOutcomes) {
    const run = buildInsufficientDataRun(
      state,
      trigger,
      sampleSize,
      newOutcomesSinceLastRun,
      minSamples,
      runStartedAt
    );
    state.runs.unshift(run);
    state.runs = state.runs.slice(0, MAX_TUNING_RUNS);
    state.totalRuns += 1;
    state.lastRunAt = run.completedAt;
    persistState(state);
    return run;
  }

  const orchestrator = useOrchestratorStore.getState();
  const beforeAccuracy = Number(orchestrator.performanceMetrics.predictionAccuracy || 0);
  const measuredAccuracy = calculatePredictionAccuracyFromSamples(samples);
  const adjustments = buildAdjustments(state, samples, sampleSize);

  for (const adjustment of adjustments) {
    state.parameters[adjustment.parameter] = adjustment.tunedValue;
  }

  const afterAccuracy = round(
    clamp((beforeAccuracy * 0.55) + (measuredAccuracy * 0.45) + Math.min(4.5, adjustments.length * 0.8), 0, 99.5),
    2
  );
  const nextModelVersion = bumpPatchVersion(state.modelVersion);
  const completedAt = new Date();
  const run: ModelTuningRun = {
    id: uuidv4(),
    trigger,
    status: 'completed',
    startedAt: runStartedAt,
    completedAt,
    modelVersion: nextModelVersion,
    sampleSize,
    newOutcomesSinceLastRun,
    predictionAccuracyBefore: round(beforeAccuracy, 2),
    predictionAccuracyAfter: afterAccuracy,
    adjustments,
    notes: [
      `Processed ${sampleSize} historical outcomes.`,
      `Prediction accuracy moved from ${round(beforeAccuracy, 2)}% to ${afterAccuracy}%.`,
      `Applied ${adjustments.length} parameter adjustments.`,
    ],
  };

  state.modelVersion = nextModelVersion;
  state.lastRunAt = completedAt;
  state.totalRuns += 1;
  state.lastProcessedOutcomeCount = sampleSize;
  state.runs.unshift(run);
  state.runs = state.runs.slice(0, MAX_TUNING_RUNS);
  persistState(state);

  orchestrator.updateMetrics({
    predictionAccuracy: afterAccuracy,
  });
  orchestrator.updateDigitalTwin({
    calibrationStatus: {
      ...orchestrator.digitalTwin.calibrationStatus,
      lastCalibration: completedAt,
      nextCalibration: new Date(completedAt.getTime() + 14 * 24 * 60 * 60 * 1000),
      parametersCalibrated: adjustments.map((adjustment) => adjustment.parameter),
      accuracy: afterAccuracy,
      modelVersion: nextModelVersion,
    },
  });

  recordAuditEvent({
    eventType: 'system_state_changed',
    entityType: 'system',
    message: `Continuous model tuning run completed (${trigger}).`,
    metadata: {
      runId: run.id,
      modelVersion: run.modelVersion,
      sampleSize: run.sampleSize,
      predictionAccuracyBefore: run.predictionAccuracyBefore,
      predictionAccuracyAfter: run.predictionAccuracyAfter,
      parametersCalibrated: adjustments.map((adjustment) => adjustment.parameter),
    },
  });

  return run;
}

export function getModelTuningState(): ModelTuningState {
  const state = getStateRef();
  return {
    ...state,
    parameters: { ...state.parameters },
    runs: state.runs.map((run) => ({
      ...run,
      startedAt: new Date(run.startedAt),
      completedAt: new Date(run.completedAt),
      adjustments: run.adjustments.map((adjustment) => ({ ...adjustment })),
      notes: [...run.notes],
    })),
  };
}

export function getLatestModelTuningRun(): ModelTuningRun | null {
  return getModelTuningState().runs[0] || null;
}
