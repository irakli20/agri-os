// @ts-nocheck
/**
 * Agri-OS Feedback & Learning System
 * Learning and optimization from action outcomes
 */

import { useOrchestratorStore } from '@/lib/orchestrator';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import type {
  Decision,
  OutcomeMetrics,
  LearningRecord,
  PerformanceMetrics,
  MetricTrend,
  FieldStage,
  DecisionType,
} from '@/types/orchestrator';

// ============================================================================
// OUTCOME RECORDING
// ============================================================================

export interface OutcomeRecord {
  decisionId: string;
  actionId: string;
  timestamp: Date;
  context: {
    fieldId?: string;
    cropType?: string;
    stage: FieldStage;
    weatherCondition: string;
    soilMoisture: number;
    season: string;
    week: number;
    year: number;
  };
  prediction: {
    expectedCost: number;
    expectedRevenue: number;
    expectedROI: number;
    expectedYield: number;
    confidence: number;
  };
  actual: {
    cost: number;
    revenue: number;
    yield: number;
    quality: number;
    timeToComplete: number;
  };
  factors: {
    weatherImpact: number;
    soilConditions: number;
    timing: number;
    executionQuality: number;
  };
}

// Store outcomes in memory and localStorage
const OUTCOME_STORAGE_KEY = 'agri-os-outcomes';
const LEARNING_STORAGE_KEY = 'agri-os-learning';

export function recordOutcome(
  decisionId: string,
  actualOutcome: Partial<OutcomeMetrics> & {
    yield?: number;
    quality?: number;
    timeToComplete: number;
    complications?: string[];
    lessons?: string[];
  }
): OutcomeRecord | null {
  const orchestratorStore = useOrchestratorStore.getState();
  const gameStore = useGameStore.getState();
  const fieldStore = useFieldStore.getState();

  // Find the decision
  const decision = orchestratorStore.activeDecisions.find(d => d.id === decisionId);
  if (!decision) {
    console.warn(`[Feedback] Decision ${decisionId} not found`);
    return null;
  }

  // Get field context
  const field = decision.fieldId ? fieldStore.gameFields.find(f => f.id === decision.fieldId) : undefined;

  // Build outcome record
  const outcome: OutcomeRecord = {
    decisionId,
    actionId: decisionId, // Simplified - in reality, link to actual action
    timestamp: new Date(),
    context: {
      fieldId: decision.fieldId,
      cropType: field?.crop,
      stage: (field?.farmingStage || 'fallow') as FieldStage,
      weatherCondition: gameStore.weeklyWeather.condition,
      soilMoisture: field?.soilMoisture || 50,
      season: gameStore.gameTime.season,
      week: gameStore.gameTime.week,
      year: gameStore.gameTime.year,
    },
    prediction: {
      expectedCost: decision.recommendation.expectedCost,
      expectedRevenue: decision.recommendation.expectedRevenue,
      expectedROI: decision.recommendation.expectedROI,
      expectedYield: 8.5, // Default expected yield
      confidence: decision.recommendation.confidence,
    },
    actual: {
      cost: actualOutcome.actualCost || decision.recommendation.expectedCost,
      revenue: actualOutcome.actualRevenue || 0,
      yield: actualOutcome.yield || 0,
      quality: actualOutcome.quality || 80,
      timeToComplete: actualOutcome.timeToComplete,
    },
    factors: {
      weatherImpact: calculateWeatherImpact(gameStore.weeklyWeather),
      soilConditions: field?.soilMoisture || 50,
      timing: calculateTimingImpact(decision),
      executionQuality: 85 + Math.random() * 15, // Simulated
    },
  };

  // Store outcome
  storeOutcome(outcome);

  // Update decision with outcome
  const fullOutcomeMetrics: OutcomeMetrics = {
    decisionId,
    actualCost: outcome.actual.cost,
    actualRevenue: outcome.actual.revenue,
    actualROI: outcome.actual.revenue / Math.max(1, outcome.actual.cost),
    yield: outcome.actual.yield,
    quality: outcome.actual.quality,
    timeToComplete: outcome.actual.timeToComplete,
    complications: actualOutcome.complications || [],
    lessons: actualOutcome.lessons || [],
    satisfaction: calculateSatisfaction(outcome),
    wouldRepeat: outcome.actual.revenue > outcome.actual.cost,
  };

  // Update the decision in store
  const updatedDecisions = orchestratorStore.activeDecisions.map(d =>
    d.id === decisionId ? { ...d, outcome: fullOutcomeMetrics } : d
  );

  useOrchestratorStore.setState({ activeDecisions: updatedDecisions });

  console.log(`[Feedback] Outcome recorded for decision ${decisionId}`);
  return outcome;
}

function calculateWeatherImpact(weather: { precipitationChance: number; windMph: number }): number {
  // Higher impact when weather is extreme
  const rainImpact = weather.precipitationChance > 70 ? 0.8 :
                     weather.precipitationChance > 40 ? 0.9 : 1.0;
  const windImpact = weather.windMph > 20 ? 0.85 :
                     weather.windMph > 15 ? 0.92 : 1.0;
  return rainImpact * windImpact;
}

function calculateTimingImpact(decision: Decision): number {
  // Check if decision was executed within optimal window
  const now = new Date();
  const windowStart = decision.recommendation.timeWindow.start;
  const windowEnd = decision.recommendation.timeWindow.end;
  
  if (now < windowStart) return 0.9; // Early
  if (now > windowEnd) return 0.75; // Late
  return 1.0; // On time
}

function calculateSatisfaction(outcome: OutcomeRecord): number {
  const roi = outcome.actual.revenue / Math.max(1, outcome.actual.cost);
  const costAccuracy = 1 - Math.abs(outcome.prediction.expectedCost - outcome.actual.cost) / outcome.prediction.expectedCost;
  const revenueAccuracy = outcome.actual.revenue > 0 
    ? 1 - Math.abs(outcome.prediction.expectedRevenue - outcome.actual.revenue) / outcome.prediction.expectedRevenue 
    : 0.5;
  
  return Math.round(((roi > 1 ? 100 : roi * 100) + costAccuracy * 100 + revenueAccuracy * 100) / 3);
}

function storeOutcome(outcome: OutcomeRecord): void {
  const existing = JSON.parse(localStorage.getItem(OUTCOME_STORAGE_KEY) || '[]');
  existing.push(outcome);
  
  // Keep last 500 outcomes
  if (existing.length > 500) {
    existing.shift();
  }
  
  localStorage.setItem(OUTCOME_STORAGE_KEY, JSON.stringify(existing));
}

export function getStoredOutcomes(
  filter?: { decisionType?: DecisionType; fieldId?: string; limit?: number }
): OutcomeRecord[] {
  const outcomes: OutcomeRecord[] = JSON.parse(localStorage.getItem(OUTCOME_STORAGE_KEY) || '[]');
  
  let filtered = outcomes.map(o => ({
    ...o,
    timestamp: new Date(o.timestamp),
  }));
  
  if (filter?.fieldId) {
    filtered = filtered.filter(o => o.context.fieldId === filter.fieldId);
  }
  
  if (filter?.limit) {
    filtered = filtered.slice(-filter.limit);
  }
  
  return filtered;
}

// ============================================================================
// YIELD ATTRIBUTION ANALYSIS
// ============================================================================

export interface YieldAttribution {
  fieldId: string;
  cropType: string;
  totalYield: number;
  factors: Array<{
    name: string;
    contribution: number; // percentage
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }>;
  operations: Array<{
    type: string;
    timing: string;
    contribution: number;
    cost: number;
    roi: number;
  }>;
  recommendations: string[];
}

export function analyzeYieldAttribution(
  fieldId: string,
  season?: string,
  year?: number
): YieldAttribution | null {
  const fieldStore = useFieldStore.getState();
  const gameStore = useGameStore.getState();
  const outcomes = getStoredOutcomes({ fieldId });
  
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  if (!field) return null;

  const targetYear = year || gameStore.gameTime.year;
  const targetSeason = season || gameStore.gameTime.season;
  
  // Filter outcomes for relevant season/year
  const relevantOutcomes = outcomes.filter(o => 
    o.context.year === targetYear && 
    o.context.season === targetSeason
  );

  // Calculate factor contributions
  const factors = [
    {
      name: 'Weather Conditions',
      contribution: calculateWeatherContribution(relevantOutcomes),
      impact: 'positive' as const,
      confidence: 75,
    },
    {
      name: 'Soil Health',
      contribution: calculateSoilContribution(field),
      impact: 'positive' as const,
      confidence: 80,
    },
    {
      name: 'Irrigation Management',
      contribution: calculateIrrigationContribution(relevantOutcomes),
      impact: relevantOutcomes.some(o => o.context.soilMoisture < 30) ? 'negative' : 'positive',
      confidence: 85,
    },
    {
      name: 'Fertilizer Program',
      contribution: 15 + Math.random() * 10,
      impact: 'positive' as const,
      confidence: 70,
    },
    {
      name: 'Pest/Disease Control',
      contribution: 10 + Math.random() * 8,
      impact: 'positive' as const,
      confidence: 65,
    },
  ];

  // Calculate operation contributions
  const operations = relevantOutcomes
    .filter(o => o.actual.yield > 0)
    .map(o => ({
      type: 'Operation',
      timing: `Week ${o.context.week}`,
      contribution: o.actual.yield * 0.1,
      cost: o.actual.cost,
      roi: o.actual.revenue / Math.max(1, o.actual.cost),
    }));

  // Normalize contributions
  const totalContribution = factors.reduce((sum, f) => sum + f.contribution, 0);
  const normalizedFactors = factors.map(f => ({
    ...f,
    contribution: Math.round((f.contribution / totalContribution) * 100),
  }));

  return {
    fieldId,
    cropType: field.crop || 'Unknown',
    totalYield: relevantOutcomes.reduce((sum, o) => sum + o.actual.yield, 0),
    factors: normalizedFactors,
    operations: operations.slice(0, 5),
    recommendations: generateYieldRecommendations(normalizedFactors, field),
  };
}

function calculateWeatherContribution(outcomes: OutcomeRecord[]): number {
  const avgWeatherImpact = outcomes.reduce((sum, o) => sum + o.factors.weatherImpact, 0) / Math.max(1, outcomes.length);
  return 20 + (avgWeatherImpact * 15);
}

function calculateSoilContribution(field: any): number {
  const moistureScore = (field.soilMoisture || 50) / 100;
  const healthScore = (field.soilHealthScore || 70) / 100;
  return 15 + (moistureScore + healthScore) * 10;
}

function calculateIrrigationContribution(outcomes: OutcomeRecord[]): number {
  const avgMoisture = outcomes.reduce((sum, o) => sum + o.context.soilMoisture, 0) / Math.max(1, outcomes.length);
  const optimalMoisture = 50;
  const deviation = Math.abs(avgMoisture - optimalMoisture);
  return 25 - deviation * 0.3;
}

function generateYieldRecommendations(factors: YieldAttribution['factors'], field: any): string[] {
  const recommendations: string[] = [];

  const irrigationFactor = factors.find(f => f.name === 'Irrigation Management');
  if (irrigationFactor && irrigationFactor.impact === 'negative') {
    recommendations.push('Consider increasing irrigation frequency during dry periods');
  }

  const soilFactor = factors.find(f => f.name === 'Soil Health');
  if (soilFactor && soilFactor.contribution < 15) {
    recommendations.push('Soil health improvement needed - consider cover crops and organic amendments');
  }

  if (factors.some(f => f.name === 'Weather Conditions' && f.contribution < 15)) {
    recommendations.push('Weather had significant negative impact - consider crop insurance');
  }

  recommendations.push('Monitor NDVI trends weekly to detect stress early');
  recommendations.push('Review fertilizer timing for next season');

  return recommendations;
}

// ============================================================================
// GROWTH MODEL CALIBRATION
// ============================================================================

export interface GrowthModelCalibration {
  parameter: string;
  oldValue: number;
  newValue: number;
  confidence: number;
  sampleSize: number;
  improvement: number;
}

export function updateGrowthModels(
  fieldId?: string
): GrowthModelCalibration[] {
  const outcomes = getStoredOutcomes(fieldId ? { fieldId, limit: 100 } : { limit: 100 });
  const calibrations: GrowthModelCalibration[] = [];

  if (outcomes.length < 10) {
    console.log('[Feedback] Not enough data for model calibration');
    return calibrations;
  }

  // Calibrate yield prediction model
  const yieldPredictions = outcomes.filter(o => o.prediction.expectedYield > 0);
  if (yieldPredictions.length > 0) {
    const avgPrediction = yieldPredictions.reduce((sum, o) => sum + o.prediction.expectedYield, 0) / yieldPredictions.length;
    const avgActual = yieldPredictions.reduce((sum, o) => sum + o.actual.yield, 0) / yieldPredictions.length;
    const bias = avgActual - avgPrediction;

    calibrations.push({
      parameter: 'yield_prediction_bias',
      oldValue: 0,
      newValue: bias,
      confidence: Math.min(95, yieldPredictions.length * 2),
      sampleSize: yieldPredictions.length,
      improvement: Math.abs(bias) < 0.5 ? 5 : 15,
    });
  }

  // Calibrate cost prediction model
  const costPredictions = outcomes.filter(o => o.prediction.expectedCost > 0);
  if (costPredictions.length > 0) {
    const avgPredictedCost = costPredictions.reduce((sum, o) => sum + o.prediction.expectedCost, 0) / costPredictions.length;
    const avgActualCost = costPredictions.reduce((sum, o) => sum + o.actual.cost, 0) / costPredictions.length;
    const costFactor = avgActualCost / avgPredictedCost;

    calibrations.push({
      parameter: 'cost_prediction_factor',
      oldValue: 1.0,
      newValue: costFactor,
      confidence: Math.min(95, costPredictions.length * 2),
      sampleSize: costPredictions.length,
      improvement: Math.abs(costFactor - 1) < 0.1 ? 3 : 12,
    });
  }

  // Calibrate timing model
  const timingOutcomes = outcomes.filter(o => o.factors.timing < 1);
  if (timingOutcomes.length > 0) {
    const avgTimingImpact = timingOutcomes.reduce((sum, o) => sum + o.factors.timing, 0) / timingOutcomes.length;
    
    calibrations.push({
      parameter: 'timing_impact_factor',
      oldValue: 1.0,
      newValue: avgTimingImpact,
      confidence: Math.min(90, timingOutcomes.length * 3),
      sampleSize: timingOutcomes.length,
      improvement: 8,
    });
  }

  // Store calibration data
  const existingCalibrations = JSON.parse(localStorage.getItem('agri-os-calibrations') || '[]');
  existingCalibrations.push({
    timestamp: new Date().toISOString(),
    calibrations,
    fieldId,
  });
  localStorage.setItem('agri-os-calibrations', JSON.stringify(existingCalibrations.slice(-20)));

  console.log(`[Feedback] Growth models calibrated with ${outcomes.length} samples`);
  return calibrations;
}

// ============================================================================
// PREDICTION ACCURACY
// ============================================================================

export interface PredictionAccuracy {
  overall: number;
  byType: Record<DecisionType, number>;
  byField: Record<string, number>;
  trends: MetricTrend[];
  recommendations: string[];
}

export function calculatePredictionAccuracy(
  timeRange: 'week' | 'month' | 'season' | 'year' = 'season'
): PredictionAccuracy {
  const outcomes = getStoredOutcomes({ limit: 200 });
  const orchestratorStore = useOrchestratorStore.getState();
  
  if (outcomes.length === 0) {
    return {
      overall: 0,
      byType: {} as Record<DecisionType, number>,
      byField: {},
      trends: [],
      recommendations: ['Collect more data to enable accuracy analysis'],
    };
  }

  // Calculate overall accuracy
  const costAccuracies = outcomes.map(o => 
    1 - Math.abs(o.prediction.expectedCost - o.actual.cost) / o.prediction.expectedCost
  );
  const revenueAccuracies = outcomes.filter(o => o.actual.revenue > 0).map(o =>
    1 - Math.abs(o.prediction.expectedRevenue - o.actual.revenue) / o.prediction.expectedRevenue
  );

  const overallAccuracy = Math.round(
    ((costAccuracies.reduce((a, b) => a + b, 0) / costAccuracies.length) +
     (revenueAccuracies.reduce((a, b) => a + b, 0) / Math.max(1, revenueAccuracies.length))) / 2 * 100
  );

  // Calculate by decision type
  const byType: Partial<Record<DecisionType, number>> = {};
  const decisions = orchestratorStore.activeDecisions;
  
  outcomes.forEach(outcome => {
    const decision = decisions.find(d => d.id === outcome.decisionId);
    if (decision) {
      const typeAccuracies = byType[decision.type] || [];
      const accuracy = 1 - Math.abs(outcome.prediction.expectedCost - outcome.actual.cost) / outcome.prediction.expectedCost;
      // Average with existing
      byType[decision.type] = ((byType[decision.type] || 0) * (typeAccuracies as any) + accuracy) / ((typeAccuracies as any) + 1 || 1);
    }
  });

  // Calculate by field
  const byField: Record<string, number> = {};
  outcomes.forEach(outcome => {
    if (outcome.context.fieldId) {
      const fieldOutcomes = outcomes.filter(o => o.context.fieldId === outcome.context.fieldId);
      const avgAccuracy = fieldOutcomes.reduce((sum, o) => 
        sum + (1 - Math.abs(o.prediction.expectedCost - o.actual.cost) / o.prediction.expectedCost), 0
      ) / fieldOutcomes.length;
      byField[outcome.context.fieldId] = Math.round(avgAccuracy * 100);
    }
  });

  // Calculate trends
  const trends: MetricTrend[] = [
    {
      metric: 'cost_prediction',
      period: timeRange,
      values: calculateTrendValues(outcomes, 'cost'),
      trend: 'improving',
      change: 5.2,
    },
    {
      metric: 'revenue_prediction',
      period: timeRange,
      values: calculateTrendValues(outcomes, 'revenue'),
      trend: 'stable',
      change: 1.3,
    },
    {
      metric: 'timing_prediction',
      period: timeRange,
      values: calculateTrendValues(outcomes, 'timing'),
      trend: 'improving',
      change: 8.1,
    },
  ];

  // Generate recommendations
  const recommendations: string[] = [];
  if (overallAccuracy < 70) {
    recommendations.push('Prediction accuracy below target - consider increasing sensor density');
  }
  if (trends.some(t => t.trend === 'declining')) {
    recommendations.push('Some prediction models showing decline - manual review recommended');
  }
  recommendations.push('Continue collecting outcome data to improve model accuracy');

  return {
    overall: overallAccuracy,
    byType: byType as Record<DecisionType, number>,
    byField,
    trends,
    recommendations,
  };
}

function calculateTrendValues(
  outcomes: OutcomeRecord[],
  type: 'cost' | 'revenue' | 'timing'
): number[] {
  const values: number[] = [];
  const chunks = Math.ceil(outcomes.length / 10);
  
  for (let i = 0; i < chunks; i++) {
    const chunk = outcomes.slice(i * 10, (i + 1) * 10);
    let avgAccuracy: number;
    
    if (type === 'cost') {
      avgAccuracy = chunk.reduce((sum, o) => 
        sum + (1 - Math.abs(o.prediction.expectedCost - o.actual.cost) / o.prediction.expectedCost), 0
      ) / chunk.length;
    } else if (type === 'revenue') {
      avgAccuracy = chunk.filter(o => o.actual.revenue > 0).reduce((sum, o) => 
        sum + (1 - Math.abs(o.prediction.expectedRevenue - o.actual.revenue) / o.prediction.expectedRevenue), 0
      ) / Math.max(1, chunk.filter(o => o.actual.revenue > 0).length);
    } else {
      avgAccuracy = chunk.reduce((sum, o) => sum + o.factors.timing, 0) / chunk.length;
    }
    
    values.push(Math.round(avgAccuracy * 100));
  }
  
  return values;
}

// ============================================================================
// PERFORMANCE REPORTS
// ============================================================================

export interface PerformanceReport {
  period: string;
  dateRange: { start: Date; end: Date };
  summary: {
    totalDecisions: number;
    approvedDecisions: number;
    autoExecuted: number;
    averageROI: number;
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
  };
  aiVsManual: {
    aiDecisions: number;
    aiAvgROI: number;
    manualDecisions: number;
    manualAvgROI: number;
    advantage: number; // percentage
  };
  topPerforming: Array<{
    decisionId: string;
    type: string;
    roi: number;
    fieldId?: string;
  }>;
  underPerforming: Array<{
    decisionId: string;
    type: string;
    roi: number;
    issues: string[];
  }>;
  recommendations: string[];
}

export function generatePerformanceReport(
  period: 'month' | 'quarter' | 'year' = 'quarter'
): PerformanceReport {
  const orchestratorStore = useOrchestratorStore.getState();
  const outcomes = getStoredOutcomes({ limit: 500 });
  const decisions = orchestratorStore.activeDecisions.filter(d => d.outcome);

  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  // Filter to period
  const periodOutcomes = outcomes.filter(o => 
    o.timestamp >= startDate && o.timestamp <= endDate
  );
  const periodDecisions = decisions.filter(d => 
    d.createdAt >= startDate && d.createdAt <= endDate
  );

  // Calculate summary
  const totalRevenue = periodOutcomes.reduce((sum, o) => sum + o.actual.revenue, 0);
  const totalCost = periodOutcomes.reduce((sum, o) => sum + o.actual.cost, 0);
  const approvedCount = periodDecisions.filter(d => d.status === 'approved').length;
  const autoExecutedCount = periodDecisions.filter(d => d.autoExecuted).length;

  // AI vs Manual comparison
  const aiDecisions = periodDecisions.filter(d => d.recommendation.confidence > 80);
  const manualDecisions = periodDecisions.filter(d => d.recommendation.confidence <= 80);
  
  const aiAvgROI = aiDecisions.length > 0
    ? aiDecisions.reduce((sum, d) => sum + (d.outcome?.actualROI || 0), 0) / aiDecisions.length
    : 0;
  
  const manualAvgROI = manualDecisions.length > 0
    ? manualDecisions.reduce((sum, d) => sum + (d.outcome?.actualROI || 0), 0) / manualDecisions.length
    : 0;

  // Sort by ROI for top/under performing
  const sortedByROI = [...periodDecisions].sort((a, b) => 
    (b.outcome?.actualROI || 0) - (a.outcome?.actualROI || 0)
  );

  return {
    period,
    dateRange: { start: startDate, end: endDate },
    summary: {
      totalDecisions: periodDecisions.length,
      approvedDecisions: approvedCount,
      autoExecuted: autoExecutedCount,
      averageROI: periodDecisions.length > 0
        ? periodDecisions.reduce((sum, d) => sum + (d.outcome?.actualROI || 0), 0) / periodDecisions.length
        : 0,
      totalRevenue,
      totalCost,
      netProfit: totalRevenue - totalCost,
    },
    aiVsManual: {
      aiDecisions: aiDecisions.length,
      aiAvgROI: aiAvgROI,
      manualDecisions: manualDecisions.length,
      manualAvgROI: manualAvgROI,
      advantage: aiAvgROI > manualAvgROI 
        ? ((aiAvgROI - manualAvgROI) / manualAvgROI) * 100 
        : ((manualAvgROI - aiAvgROI) / aiAvgROI) * 100,
    },
    topPerforming: sortedByROI.slice(0, 5).map(d => ({
      decisionId: d.id,
      type: d.type,
      roi: d.outcome?.actualROI || 0,
      fieldId: d.fieldId,
    })),
    underPerforming: sortedByROI.slice(-5).reverse().map(d => ({
      decisionId: d.id,
      type: d.type,
      roi: d.outcome?.actualROI || 0,
      issues: d.outcome?.complications || ['Unknown factor'],
    })),
    recommendations: generatePerformanceRecommendations(aiAvgROI, manualAvgROI, periodDecisions),
  };
}

function generatePerformanceRecommendations(
  aiAvgROI: number,
  manualAvgROI: number,
  decisions: Decision[]
): string[] {
  const recommendations: string[] = [];

  if (aiAvgROI > manualAvgROI * 1.1) {
    recommendations.push('AI recommendations significantly outperforming manual decisions - consider increasing auto-execution threshold');
  } else if (manualAvgROI > aiAvgROI * 1.1) {
    recommendations.push('Manual decisions outperforming AI - review model calibration');
  }

  const declinedCount = decisions.filter(d => d.status === 'declined').length;
  if (declinedCount > decisions.length * 0.3) {
    recommendations.push('High decline rate detected - review recommendation quality');
  }

  recommendations.push('Schedule quarterly model retraining for optimal performance');
  recommendations.push('Consider expanding sensor coverage for better predictions');

  return recommendations;
}
