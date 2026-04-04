'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { generateSeasonReviewReport, type DecisionAttribution } from '@/lib/orchestrator/season-review';
import type { EconomicBenchmarkEntry } from '@/lib/orchestrator/economic-benchmark';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Gauge,
  ClipboardList,
  Sparkles,
  Cpu,
  RefreshCw,
  Medal,
} from 'lucide-react';

interface ModelParameterAdjustment {
  parameter: string;
  previousValue: number;
  tunedValue: number;
  deltaPct: number;
  confidence: number;
  sampleSize: number;
  reason: string;
}

interface ModelTuningRun {
  id: string;
  trigger: 'manual' | 'auto' | 'scheduled';
  status: 'completed' | 'insufficient_data' | 'skipped';
  startedAt: string;
  completedAt: string;
  modelVersion: string;
  sampleSize: number;
  newOutcomesSinceLastRun: number;
  predictionAccuracyBefore: number;
  predictionAccuracyAfter: number;
  adjustments: ModelParameterAdjustment[];
  notes: string[];
}

interface ModelTuningState {
  modelVersion: string;
  lastRunAt?: string;
  totalRuns: number;
  lastProcessedOutcomeCount: number;
  autoTuneThreshold: number;
  minSamples: number;
  parameters: Record<string, number>;
  runs: ModelTuningRun[];
}

function getImpactColor(impact: DecisionAttribution['impact']): string {
  switch (impact) {
    case 'positive':
      return 'text-primary bg-primary/15 border-primary/30';
    case 'negative':
      return 'text-red-300 bg-red-500/15 border-red-300/30';
    default:
      return 'text-slate-300 bg-slate-500/15 border-slate-300/20';
  }
}

function getBenchmarkBandStyle(band: EconomicBenchmarkEntry['benchmarkBand']): string {
  switch (band) {
    case 'leading':
      return 'text-primary bg-primary/15 border-primary/30';
    case 'above_average':
      return 'text-secondary bg-secondary/15 border-secondary/30';
    case 'average':
      return 'text-slate-200 bg-slate-500/15 border-slate-300/20';
    case 'below_average':
      return 'text-amber-200 bg-amber-500/15 border-amber-300/30';
    case 'lagging':
      return 'text-red-200 bg-red-500/15 border-red-300/30';
    default:
      return 'text-slate-200 bg-slate-500/15 border-slate-300/20';
  }
}

export default function SeasonReviewPage() {
  const reviewRefreshSignal = useOrchestratorStore(
    (state) =>
      state.activeDecisions.length +
      state.completedActions.length +
      state.pendingAlerts.length +
      state.week +
      state.year
  );

  const report = reviewRefreshSignal >= 0 ? generateSeasonReviewReport() : null;
  const [tuningState, setTuningState] = useState<ModelTuningState | null>(null);
  const [latestTuningRun, setLatestTuningRun] = useState<ModelTuningRun | null>(null);
  const [isTuningLoading, setIsTuningLoading] = useState(true);
  const [isTuningRunInFlight, setIsTuningRunInFlight] = useState(false);
  const [tuningError, setTuningError] = useState<string | null>(null);

  const loadTuningState = async () => {
    setIsTuningLoading(true);
    setTuningError(null);
    try {
      const response = await fetch('/api/models/tuning');
      if (!response.ok) {
        throw new Error(`Tuning request failed (${response.status})`);
      }
      const payload = await response.json() as {
        success?: boolean;
        state?: ModelTuningState;
        autoRun?: ModelTuningRun | null;
        error?: string;
      };
      if (!payload.success || !payload.state) {
        throw new Error(payload.error || 'Failed to load tuning state');
      }
      setTuningState(payload.state);
      setLatestTuningRun(payload.autoRun || payload.state.runs?.[0] || null);
    } catch (error) {
      setTuningError((error as Error).message || 'Failed to load model tuning state');
      setTuningState(null);
      setLatestTuningRun(null);
    } finally {
      setIsTuningLoading(false);
    }
  };

  const runManualTuning = async () => {
    setIsTuningRunInFlight(true);
    setTuningError(null);
    try {
      const response = await fetch('/api/models/tuning', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual' }),
      });
      if (!response.ok) {
        throw new Error(`Model tuning failed (${response.status})`);
      }
      const payload = await response.json() as {
        success?: boolean;
        run?: ModelTuningRun;
        state?: ModelTuningState;
        error?: string;
      };
      if (!payload.success || !payload.state || !payload.run) {
        throw new Error(payload.error || 'Model tuning failed');
      }
      setTuningState(payload.state);
      setLatestTuningRun(payload.run);
    } catch (error) {
      setTuningError((error as Error).message || 'Failed to run model tuning');
    } finally {
      setIsTuningRunInFlight(false);
    }
  };

  useEffect(() => {
    void loadTuningState();
    // reviewRefreshSignal is used to refresh tuning status when orchestrator state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewRefreshSignal]);

  if (!report) {
    return (
      <AppShell>
        <div className="page-shell">
          <div className="card-soft rounded-2xl p-6">
            <h1 className="text-2xl font-bold">Season Review</h1>
            <p className="text-sm text-muted-foreground mt-2">Review data is unavailable right now.</p>
          </div>
        </div>
      </AppShell>
    );
  }
  const benchmark = report.benchmarking;

  return (
    <AppShell>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <p className="page-header-meta">Post-Season Attribution</p>
            <h1 className="text-3xl font-bold">Season Review</h1>
            <p className="text-muted-foreground mt-1">
              Season {report.seasonContext.season}, Week {report.seasonContext.week}, Year {report.seasonContext.year}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Generated</div>
            <div className="text-sm font-medium">{new Date(report.generatedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="page-kpi-grid">
          <div className="kpi-card">
            <div className="text-sm text-muted-foreground mb-1">Net Attributed Impact</div>
            <div
              className={cn(
                'text-2xl font-bold',
                report.summary.netAttributedImpact >= 0 ? 'text-primary' : 'text-red-300'
              )}
            >
              ${report.summary.netAttributedImpact.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Decision-level attribution estimate</div>
          </div>
          <div className="kpi-card">
            <div className="text-sm text-muted-foreground mb-1">Outcome Coverage</div>
            <div className="text-2xl font-bold text-secondary">{report.summary.outcomeCoveragePct}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {report.summary.decisionsWithOutcomes}/{report.summary.decisionsReviewed} decisions with outcomes
            </div>
          </div>
          <div className="kpi-card">
            <div className="text-sm text-muted-foreground mb-1">Timing Adherence</div>
            <div className="text-2xl font-bold text-amber-300">{report.summary.avgTimingAdherencePct}%</div>
            <div className="text-xs text-muted-foreground mt-1">Average across reviewed fields</div>
          </div>
          <div className="kpi-card">
            <div className="text-sm text-muted-foreground mb-1">Avoided Loss</div>
            <div className="text-2xl font-bold text-primary">${report.summary.totalAvoidedLoss.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">{report.summary.fieldsReviewed} fields included</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-semibold">Decision Attribution Ledger</h3>
              </div>
              {report.attribution.decisions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-muted-foreground">
                  No decisions recorded yet for attribution.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Decision</th>
                        <th className="px-3 py-2 font-medium">Field</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">ROI</th>
                        <th className="px-3 py-2 font-medium text-right">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {report.attribution.decisions.slice(0, 18).map((decision) => (
                        <tr key={decision.decisionId} className="hover:bg-white/5 transition-colors">
                          <td className="px-3 py-2">
                            <div className="font-medium">{decision.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {decision.type.replace(/_/g, ' ')} • {decision.priority}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{decision.fieldName || 'Unassigned'}</td>
                          <td className="px-3 py-2">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border',
                                getImpactColor(decision.impact)
                              )}
                            >
                              {decision.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-xs text-muted-foreground">Expected {decision.expectedROI}%</div>
                            <div className="font-medium">
                              {typeof decision.actualROI === 'number' ? `Actual ${decision.actualROI}%` : 'Outcome pending'}
                            </div>
                          </td>
                          <td
                            className={cn(
                              'px-3 py-2 text-right font-semibold',
                              decision.attributedImpact >= 0 ? 'text-primary' : 'text-red-300'
                            )}
                          >
                            ${decision.attributedImpact.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-soft rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Top Positive Decisions</h3>
                </div>
                <div className="space-y-3">
                  {report.attribution.topPositive.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No positive attributions yet.</p>
                  ) : (
                    report.attribution.topPositive.map((item) => (
                      <div key={item.decisionId} className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.fieldName || 'Unassigned'} • {item.type}</div>
                        <div className="text-sm font-semibold text-primary mt-1">
                          +${item.attributedImpact.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card-soft rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-300" />
                  <h3 className="text-lg font-semibold">Top Negative Decisions</h3>
                </div>
                <div className="space-y-3">
                  {report.attribution.topNegative.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No negative attributions yet.</p>
                  ) : (
                    report.attribution.topNegative.map((item) => (
                      <div key={item.decisionId} className="rounded-lg bg-red-500/10 border border-red-300/20 p-3">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.fieldName || 'Unassigned'} • {item.type}</div>
                        <div className="text-sm font-semibold text-red-200 mt-1">
                          ${item.attributedImpact.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-semibold">Economic Benchmarking</h3>
              </div>
              {benchmark.byField.length === 0 && benchmark.byCrop.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-muted-foreground">
                  Not enough economic records yet. Complete and log more outcomes to unlock crop/field benchmarking.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Top Field</div>
                      <div className="font-semibold mt-0.5">{benchmark.summary.topField || 'N/A'}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Top Crop</div>
                      <div className="font-semibold mt-0.5">{benchmark.summary.topCrop || 'N/A'}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Median Profit/Acre</div>
                      <div className="font-semibold mt-0.5">${benchmark.summary.medianProfitPerAcre.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Median ROI</div>
                      <div className="font-semibold mt-0.5">{benchmark.summary.medianRoiPct}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">By Field</div>
                      <div className="space-y-2">
                        {benchmark.byField.slice(0, 6).map((entry) => (
                          <div key={entry.id} className="rounded-lg border border-white/10 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium">{entry.label}</div>
                              <span className={cn('px-1.5 py-0.5 rounded text-[10px] uppercase border', getBenchmarkBandStyle(entry.benchmarkBand))}>
                                {entry.benchmarkBand.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              score {entry.benchmarkScore} • ROI {entry.roiPct}% • ${entry.profitPerAcre.toLocaleString()}/acre
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">By Crop</div>
                      <div className="space-y-2">
                        {benchmark.byCrop.slice(0, 6).map((entry) => (
                          <div key={entry.id} className="rounded-lg border border-white/10 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium">{entry.label}</div>
                              <span className={cn('px-1.5 py-0.5 rounded text-[10px] uppercase border', getBenchmarkBandStyle(entry.benchmarkBand))}>
                                {entry.benchmarkBand.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              score {entry.benchmarkScore} • ROI {entry.roiPct}% • ${entry.profitPerAcre.toLocaleString()}/acre
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {benchmark.insights.length > 0 && (
                    <div className="space-y-2">
                      {benchmark.insights.slice(0, 3).map((insight, index) => (
                        <div key={`${insight}-${index}`} className="rounded-lg border border-secondary/20 bg-secondary/10 p-3 text-sm">
                          {insight}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Continuous Model Tuning</h3>
                </div>
                <button
                  onClick={runManualTuning}
                  disabled={isTuningRunInFlight}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors',
                    isTuningRunInFlight
                      ? 'bg-white/10 text-muted-foreground cursor-wait'
                      : 'bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30'
                  )}
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', isTuningRunInFlight && 'animate-spin')} />
                  Run Tuning
                </button>
              </div>

              {isTuningLoading ? (
                <p className="text-sm text-muted-foreground">Loading tuning state...</p>
              ) : tuningError ? (
                <p className="text-sm text-red-200">{tuningError}</p>
              ) : tuningState ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Model Version</div>
                      <div className="font-semibold text-foreground mt-0.5">{tuningState.modelVersion}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Total Runs</div>
                      <div className="font-semibold text-foreground mt-0.5">{tuningState.totalRuns}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Min Samples</div>
                      <div className="font-semibold text-foreground mt-0.5">{tuningState.minSamples}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                      <div className="text-muted-foreground">Auto Threshold</div>
                      <div className="font-semibold text-foreground mt-0.5">{tuningState.autoTuneThreshold}</div>
                    </div>
                  </div>

                  {latestTuningRun ? (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">Latest Run ({latestTuningRun.trigger})</div>
                        <span className={cn(
                          'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border',
                          latestTuningRun.status === 'completed'
                            ? 'border-primary/30 bg-primary/15 text-primary'
                            : latestTuningRun.status === 'insufficient_data'
                              ? 'border-amber-300/30 bg-amber-500/15 text-amber-200'
                              : 'border-slate-300/20 bg-slate-500/10 text-slate-200'
                        )}>
                          {latestTuningRun.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(latestTuningRun.completedAt).toLocaleString()} • samples {latestTuningRun.sampleSize}
                      </div>
                      <div className="text-xs mt-2">
                        Accuracy: <span className="font-semibold">{latestTuningRun.predictionAccuracyBefore}%</span> →{' '}
                        <span className="font-semibold text-secondary">{latestTuningRun.predictionAccuracyAfter}%</span>
                      </div>
                      {latestTuningRun.adjustments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {latestTuningRun.adjustments.slice(0, 3).map((adjustment) => (
                            <div key={adjustment.parameter} className="text-[11px] text-muted-foreground">
                              {adjustment.parameter}: {adjustment.previousValue} → {adjustment.tunedValue}
                              <span className={cn(
                                'ml-1 font-medium',
                                adjustment.deltaPct >= 0 ? 'text-primary' : 'text-red-300'
                              )}>
                                ({adjustment.deltaPct >= 0 ? '+' : ''}{adjustment.deltaPct}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      No tuning runs yet. Run an initial calibration after enough outcome data is collected.
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Model tuning state unavailable.</p>
              )}
            </div>

            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-semibold">By Decision Type</h3>
              </div>
              <div className="space-y-3">
                {report.attribution.byDecisionType.map((row) => (
                  <div key={row.type} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium capitalize">{row.type.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-muted-foreground">{row.decisions} decisions</div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Success</div>
                        <div className="font-semibold">{row.successRatePct}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg ROI</div>
                        <div className="font-semibold">{row.avgROI}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Impact</div>
                        <div className={cn('font-semibold', row.netImpact >= 0 ? 'text-primary' : 'text-red-300')}>
                          ${row.netImpact.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-semibold">Field Attribution</h3>
              </div>
              <div className="space-y-2">
                {report.attribution.byField.map((field) => (
                  <div key={field.fieldId} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{field.fieldName}</div>
                      <div className={cn('text-sm font-semibold', field.netImpact >= 0 ? 'text-primary' : 'text-red-300')}>
                        ${field.netImpact.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {field.decisions} decisions • {field.outcomes} outcomes • avg ROI {field.avgROI}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-semibold">Recommendations</h3>
              </div>
              <div className="space-y-2">
                {report.recommendations.map((recommendation, index) => (
                  <div key={`${recommendation}-${index}`} className="rounded-lg border border-amber-300/15 bg-amber-500/10 p-3 text-sm">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-soft rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Season Totals</h3>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Total Yield: <span className="text-foreground font-medium">{report.summary.totalYield.toLocaleString()} t</span></div>
                <div>Total Cost: <span className="text-foreground font-medium">${report.summary.totalCost.toLocaleString()}</span></div>
                <div>Avg Confidence: <span className="text-foreground font-medium">{report.summary.avgConfidence}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
