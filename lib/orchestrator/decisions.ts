// @ts-nocheck
/**
 * Agri-OS AI Decision Engine
 * OpenClaw-powered automation for farm operations
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Decision,
  DecisionType,
  DecisionPriority,
  DecisionContext,
  Recommendation,
  AlternativeAction,
  FieldState,
  CropState,
  MarketConditions,
  ResourceAvailability,
  WeatherForecast,
  FieldStage,
  GrowthStage,
} from '@/types/orchestrator';
import { useOrchestratorStore, OrchestratorService } from '../orchestrator';
import { useGameStore } from '../game-store';
import { useFieldStore } from '../field-store';
import { cropProfiles, CROP_DATABASE } from '../crop-data';
import { useWeatherStore } from '../weather-data';
import { useMarketStore } from '../market-store';

// ============================================================================
// DECISION RULES ENGINE
// ============================================================================

interface DecisionRule {
  id: string;
  type: DecisionType;
  priority: DecisionPriority;
  condition: (context: DecisionContext) => boolean;
  score: (context: DecisionContext) => number;
  generateRecommendation: (
    context: DecisionContext
  ) => Omit<
    Recommendation,
    'id' | 'confidence' | 'rationale' | 'whyNow' | 'deadline' | 'expectedImpact' | 'priorityScoring'
  >;
  alternatives: (context: DecisionContext) => AlternativeAction[];
}

// Helper to calculate GDD (Growing Degree Days)
function calculateGDD(minTemp: number, maxTemp: number, baseTemp: number): number {
  const avgTemp = (minTemp + maxTemp) / 2;
  return Math.max(0, avgTemp - baseTemp);
}

// Helper to assess planting window
function isInPlantingWindow(cropType: string, gameTime: { season: string; week: number }): boolean {
  const profile = cropProfiles[cropType as keyof typeof cropProfiles];
  if (!profile) return false;
  
  const optimal = profile.planting.optimalDates[gameTime.season.toLowerCase() as 'spring' | 'summer' | 'fall' | 'winter'];
  if (!optimal) return false;
  
  const start = parseInt(optimal.start.split('-')[1]);
  const end = parseInt(optimal.end.split('-')[1]);
  
  // Convert week to approximate day (week * 7)
  const currentDay = gameTime.week * 7;
  
  return currentDay >= start && currentDay <= end;
}

function buildRecommendationRationale(
  context: DecisionContext,
  rule: DecisionRule,
  explanation: string
): Recommendation['rationale'] {
  const reasons: Recommendation['rationale'] = [
    {
      title: `Rule Triggered: ${rule.id}`,
      detail: explanation,
      source: 'rule',
    },
    {
      title: 'Field State',
      detail: `Stage ${context.fieldState.stage}, soil moisture ${context.fieldState.soilMoisture.toFixed(1)}%.`,
      source: 'field',
    },
  ];

  const nextWeather = context.weather.forecast[0];
  if (nextWeather) {
    reasons.push({
      title: 'Weather Context',
      detail: `Rain chance ${nextWeather.precipitationChance}%, wind ${nextWeather.windSpeed.toFixed(1)} km/h.`,
      source: 'weather',
    });
  }

  const crop = context.cropState;
  if (crop) {
    reasons.push({
      title: 'Crop Progress',
      detail: `${crop.cropType} at ${crop.growthStage}, expected yield ${crop.expectedYield.toFixed(2)} t/ha.`,
      source: 'historical',
    });
  }

  return reasons;
}

function buildExpectedImpact(rec: {
  expectedRevenue: number;
  expectedCost: number;
  confidence: number;
}): Recommendation['expectedImpact'] {
  const net = rec.expectedRevenue - rec.expectedCost;
  const confidenceMultiplier = rec.confidence / 100;
  return {
    yieldDeltaPct: Number((Math.max(0, confidenceMultiplier * 12)).toFixed(2)),
    revenueDelta: Number((net * confidenceMultiplier).toFixed(2)),
    costDelta: Number((-rec.expectedCost).toFixed(2)),
    riskReductionPct: Number((Math.max(0, confidenceMultiplier * 25)).toFixed(2)),
  };
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

function getRiskToYieldScore(
  context: DecisionContext,
  decisionType: DecisionType,
  confidence: number
): number {
  const stageWeights: Record<string, number> = {
    germinating: 55,
    growing: 70,
    reproductive: 90,
    harvest_ready: 80,
    prepared: 45,
    planted: 60,
    fallow: 25,
    harvested: 10,
  };
  const stageScore = stageWeights[context.fieldState.stage] ?? 50;

  const pestScoreMap: Record<string, number> = {
    none: 0,
    low: 20,
    moderate: 45,
    high: 75,
    severe: 95,
  };
  const diseaseScoreMap: Record<string, number> = {
    none: 0,
    low: 20,
    moderate: 45,
    high: 75,
    epidemic: 95,
  };
  const waterStress = context.cropState?.waterStress ?? (context.fieldState.soilMoisture < 25 ? 80 : 35);
  const nutrientStress = context.cropState?.nutrientStress ?? clampScore((60 - context.fieldState.nutrientLevels.n) * 2);
  const biologicalStress = Math.max(
    pestScoreMap[context.fieldState.pestPressure] ?? 0,
    diseaseScoreMap[context.fieldState.diseaseRisk] ?? 0
  );
  const stressScore = clampScore((waterStress + nutrientStress + biologicalStress) / 3);

  const wx = context.weather.forecast[0];
  const weatherThreat = wx
    ? clampScore((wx.precipitationChance - 35) * 1.3 + (wx.windSpeed - 18) * 2 + (wx.humidity - 75) * 0.7)
    : 35;

  const actionCriticality: Partial<Record<DecisionType, number>> = {
    treat: 90,
    spray: 88,
    irrigate: 84,
    harvest: 86,
    plant: 72,
    fertilize: 66,
    scout: 55,
  };
  const actionScore = actionCriticality[decisionType] ?? 50;

  const raw = stageScore * 0.28 + stressScore * 0.37 + weatherThreat * 0.2 + actionScore * 0.15;
  const confidenceAdjusted = raw * (0.8 + (confidence / 100) * 0.2);
  return clampScore(confidenceAdjusted);
}

function getEconomicsScore(
  context: DecisionContext,
  rec: { expectedCost: number; expectedRevenue: number; expectedROI: number },
  confidence: number
): number {
  const roiNormalized = clampScore(((rec.expectedROI + 50) / 250) * 100);
  const netBenefit = rec.expectedRevenue - rec.expectedCost;
  const netNormalized = clampScore((netBenefit / Math.max(1, rec.expectedCost)) * 100);

  const availableCash = context.resourceAvailability.cash + context.resourceAvailability.credit;
  const affordabilityScore =
    rec.expectedCost <= context.resourceAvailability.cash
      ? 100
      : rec.expectedCost <= availableCash
        ? 70
        : 20;

  const marketTrendBonus =
    context.marketConditions.trend === 'rising'
      ? 10
      : context.marketConditions.trend === 'falling'
        ? -8
        : 3;

  const raw = roiNormalized * 0.45 + netNormalized * 0.3 + affordabilityScore * 0.25 + marketTrendBonus;
  const confidenceAdjusted = raw * (0.82 + (confidence / 100) * 0.18);
  return clampScore(confidenceAdjusted);
}

function getUrgencyScore(timeWindow: { start: Date; end: Date }, priority: DecisionPriority): number {
  const hoursToDeadline = (new Date(timeWindow.end).getTime() - Date.now()) / (1000 * 60 * 60);
  let score =
    hoursToDeadline <= 6 ? 95 :
      hoursToDeadline <= 24 ? 82 :
        hoursToDeadline <= 72 ? 68 :
          hoursToDeadline <= 168 ? 52 : 35;

  if (priority === 'critical') score += 8;
  if (priority === 'high') score += 4;

  return clampScore(score);
}

function buildPriorityScoring(
  context: DecisionContext,
  rule: DecisionRule,
  rec: { expectedCost: number; expectedRevenue: number; expectedROI: number; timeWindow: { start: Date; end: Date } },
  confidence: number
): Recommendation['priorityScoring'] {
  const riskToYieldScore = getRiskToYieldScore(context, rule.type, confidence);
  const economicsScore = getEconomicsScore(context, rec, confidence);
  const urgencyScore = getUrgencyScore(rec.timeWindow, rule.priority);
  const compositeScore = clampScore(riskToYieldScore * 0.45 + economicsScore * 0.4 + urgencyScore * 0.15);

  return {
    riskToYieldScore,
    economicsScore,
    urgencyScore,
    compositeScore,
    reasons: [
      `Risk-to-yield score ${riskToYieldScore.toFixed(1)} driven by stage and stress signals.`,
      `Economics score ${economicsScore.toFixed(1)} from ROI, net benefit, and affordability.`,
      `Urgency score ${urgencyScore.toFixed(1)} based on deadline and priority class.`,
    ],
  };
}

function overlapsTimeWindow(
  a: { start: Date; end: Date },
  b: { start: Date; end: Date }
): boolean {
  const aStart = new Date(a.start).getTime();
  const aEnd = new Date(a.end).getTime();
  const bStart = new Date(b.start).getTime();
  const bEnd = new Date(b.end).getTime();
  return aStart <= bEnd && bStart <= aEnd;
}

function findDecisionConflicts(decisions: Decision[], context: DecisionContext): Decision[] {
  const incompatiblePairs = new Set<string>([
    'harvest:irrigate',
    'irrigate:harvest',
    'harvest:spray',
    'spray:harvest',
    'harvest:fertilize',
    'fertilize:harvest',
    'plant:harvest',
    'harvest:plant',
    'spray:plant',
    'plant:spray',
  ]);

  const budgetCap = context.resourceAvailability.cash + context.resourceAvailability.credit;
  const annotated = decisions.map((d) => ({
    ...d,
    conflictAnalysis: {
      hasConflicts: false,
      conflictingDecisionIds: [],
      reasons: [],
      severity: 'low' as const,
      recommendedResolution: 'No conflicts detected.',
    },
  }));

  for (let i = 0; i < annotated.length; i++) {
    for (let j = i + 1; j < annotated.length; j++) {
      const a = annotated[i];
      const b = annotated[j];

      if (a.fieldId && b.fieldId && a.fieldId !== b.fieldId) {
        continue;
      }

      const sameWindow = overlapsTimeWindow(a.recommendation.timeWindow, b.recommendation.timeWindow);
      const pairKey = `${a.type}:${b.type}`;

      if (sameWindow && incompatiblePairs.has(pairKey)) {
        const reason = `Action conflict: ${a.type} and ${b.type} overlap on the same field/time window.`;
        a.conflictAnalysis.hasConflicts = true;
        b.conflictAnalysis.hasConflicts = true;
        a.conflictAnalysis.conflictingDecisionIds.push(b.id);
        b.conflictAnalysis.conflictingDecisionIds.push(a.id);
        a.conflictAnalysis.reasons.push(reason);
        b.conflictAnalysis.reasons.push(reason);
      }

      if (sameWindow) {
        const combinedCost = a.recommendation.expectedCost + b.recommendation.expectedCost;
        if (combinedCost > budgetCap && Math.max(a.recommendation.expectedCost, b.recommendation.expectedCost) > budgetCap * 0.45) {
          const reason = `Resource conflict: combined expected cost ($${combinedCost.toFixed(0)}) exceeds available budget ($${budgetCap.toFixed(0)}).`;
          a.conflictAnalysis.hasConflicts = true;
          b.conflictAnalysis.hasConflicts = true;
          a.conflictAnalysis.conflictingDecisionIds.push(b.id);
          b.conflictAnalysis.conflictingDecisionIds.push(a.id);
          a.conflictAnalysis.reasons.push(reason);
          b.conflictAnalysis.reasons.push(reason);
        }
      }

      if (a.type === b.type && sameWindow && a.fieldId === b.fieldId) {
        const deltaComposite = Math.abs(
          (a.recommendation.priorityScoring?.compositeScore || 0) -
          (b.recommendation.priorityScoring?.compositeScore || 0)
        );
        if (deltaComposite < 12) {
          const reason = `Duplicate intent conflict: concurrent ${a.type} recommendations with similar priority scores.`;
          a.conflictAnalysis.hasConflicts = true;
          b.conflictAnalysis.hasConflicts = true;
          a.conflictAnalysis.conflictingDecisionIds.push(b.id);
          b.conflictAnalysis.conflictingDecisionIds.push(a.id);
          a.conflictAnalysis.reasons.push(reason);
          b.conflictAnalysis.reasons.push(reason);
        }
      }
    }
  }

  return annotated.map((d) => {
    if (!d.conflictAnalysis.hasConflicts) {
      return d;
    }

    const uniqueIds = [...new Set(d.conflictAnalysis.conflictingDecisionIds)];
    const uniqueReasons = [...new Set(d.conflictAnalysis.reasons)];
    const severity =
      uniqueReasons.some((r) => r.includes('Action conflict')) ? 'high' :
        uniqueReasons.some((r) => r.includes('Resource conflict')) ? 'medium' :
          'low';
    const recommendation =
      severity === 'high'
        ? 'Choose a single mutually-compatible action and reschedule others outside the current window.'
        : severity === 'medium'
          ? 'Prioritize by composite score and available budget; defer lower economic impact actions.'
          : 'Merge duplicate recommendations and keep the higher composite score option.';

    return {
      ...d,
      conflictAnalysis: {
        hasConflicts: true,
        conflictingDecisionIds: uniqueIds,
        reasons: uniqueReasons,
        severity,
        recommendedResolution: recommendation,
      },
    };
  });
}

const DECISION_RULES: DecisionRule[] = [
  // PLANTING DECISIONS
  {
    id: 'plant-optimal-window',
    type: 'plant',
    priority: 'high',
    condition: (ctx) => {
      if (ctx.fieldState.stage !== 'prepared') return false;
      if (!ctx.cropState) return false;
      return isInPlantingWindow(ctx.cropState.cropType, ctx.gameTime);
    },
    score: (ctx) => {
      let score = 70;
      
      // Weather suitability
      if (ctx.weather.forecast[0]?.soilTemperature >= 10) score += 15;
      if (ctx.weather.forecast[0]?.precipitationChance < 40) score += 10;
      if (ctx.fieldState.soilMoisture > 30 && ctx.fieldState.soilMoisture < 70) score += 5;
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      const cropProfile = cropProfiles[ctx.cropState!.cropType as keyof typeof cropProfiles];
      const seedCost = cropProfile?.economics.seedCost || 100;
      const area = 10; // hectares, should come from field data
      
      return {
        action: 'Plant Crop',
        actionType: 'plant',
        parameters: {
          cropType: ctx.cropState!.cropType,
          variety: ctx.cropState!.variety,
          seedingRate: cropProfile?.planting.seedingRate || 150,
          depth: cropProfile?.planting.plantingDepth || 3,
        },
        expectedCost: seedCost * area,
        expectedRevenue: (cropProfile?.yieldExpectations.average || 5) * 
                        (cropProfile?.economics.pricePerBushel.average || 200) * area,
        expectedROI: 0,
        timeWindow: {
          start: new Date(),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        explanation: `Optimal planting window for ${cropProfile?.displayName || ctx.cropState!.cropType}. ` +
                    `Soil temperature ${ctx.weather.forecast[0]?.soilTemperature}°C is suitable. ` +
                    `Planting now maximizes yield potential.`,
        riskFactors: ['Weather change', 'Pest emergence', 'Soil conditions'],
        prerequisites: ['Field prepared', 'Seed available', 'Equipment ready'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Delay planting 3-5 days',
        cost: 0,
        expectedOutcome: 'May avoid immediate weather risks but reduce yield potential by 3-5%',
        tradeoffs: ['Lower yield potential', 'Later harvest window'],
        confidence: 70,
      },
      {
        description: 'Plant alternative variety',
        cost: -10,
        expectedOutcome: 'May better match current conditions',
        tradeoffs: ['Different market price', 'Unknown performance'],
        confidence: 60,
      },
    ],
  },

  // IRRIGATION DECISIONS
  {
    id: 'irrigation-water-stress',
    type: 'irrigate',
    priority: 'critical',
    condition: (ctx) => {
      if (ctx.fieldState.stage !== 'growing' && ctx.fieldState.stage !== 'reproductive') return false;
      return ctx.cropState?.waterStress > 60 || ctx.fieldState.soilMoisture < 25;
    },
    score: (ctx) => {
      let score = 80;
      
      // Higher priority in critical growth stages
      if (ctx.cropState?.growthStage === 'grain_fill') score += 10;
      if (ctx.cropState?.growthStage === 'flowering') score += 15;
      
      // Higher priority if drought conditions
      if (ctx.cropState?.waterStress > 80) score += 10;
      if (ctx.weather.forecast[0]?.precipitationChance < 20) score += 5;
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      const area = 10;
      const waterNeeded = (50 - ctx.fieldState.soilMoisture) * 0.5 * area; // mm to m³ approximation
      const costPerM3 = 0.5; // Cost per cubic meter
      
      return {
        action: 'Apply Irrigation',
        actionType: 'irrigate',
        parameters: {
          method: 'drip',
          amount: Math.round(waterNeeded),
          duration: Math.round(waterNeeded / 20), // 20 m³/hr typical
          timing: 'early_morning',
        },
        expectedCost: waterNeeded * costPerM3,
        expectedRevenue: ctx.cropState ? ctx.cropState.expectedYield * 200 * 0.15 : 0, // Prevent 15% yield loss
        expectedROI: 0,
        timeWindow: {
          start: new Date(Date.now() + 4 * 60 * 60 * 1000), // Within 4 hours
          end: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        explanation: `Water stress detected: ${ctx.cropState?.waterStress.toFixed(0)}%. ` +
                    `Soil moisture at ${ctx.fieldState.soilMoisture.toFixed(1)}%. ` +
                    `Immediate irrigation recommended to prevent yield loss.`,
        riskFactors: ['Overwatering', 'Equipment failure', 'Weather change'],
        prerequisites: ['Irrigation system functional', 'Water available', 'Power supply'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Wait for rain',
        cost: 0,
        expectedOutcome: `Risk: ${ctx.weather.forecast[0]?.precipitationChance}% chance of rain. May lose yield.`,
        tradeoffs: ['Free if it rains', 'Significant yield risk'],
        confidence: 40,
      },
      {
        description: 'Partial irrigation (50%)',
        cost: -30,
        expectedOutcome: 'Moderate stress relief at lower cost',
        tradeoffs: ['Partial yield protection', 'May need second application'],
        confidence: 65,
      },
    ],
  },

  // FERTILIZATION DECISIONS
  {
    id: 'fertilize-nitrogen',
    type: 'fertilize',
    priority: 'medium',
    condition: (ctx) => {
      if (ctx.fieldState.stage !== 'growing') return false;
      return ctx.fieldState.nutrientLevels.n < 50;
    },
    score: (ctx) => {
      let score = 65;
      
      if (ctx.cropState?.nutrientStress > 50) score += 20;
      if (ctx.cropState?.growthStage === 'vegetative') score += 10;
      if (ctx.weather.forecast[0]?.precipitationChance > 40) score += 5; // Rain will help incorporation
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      const area = 10;
      const nNeeded = 80 - ctx.fieldState.nutrientLevels.n;
      const fertilizerRate = nNeeded / 0.46; // Urea is 46% N
      const costPerKg = 1.2;
      
      return {
        action: 'Apply Nitrogen Fertilizer',
        actionType: 'fertilize',
        parameters: {
          type: 'urea',
          rate: Math.round(fertilizerRate),
          method: 'broadcast',
          timing: 'morning',
        },
        expectedCost: fertilizerRate * area * costPerKg,
        expectedRevenue: ctx.cropState ? ctx.cropState.expectedYield * 200 * 0.1 : 0,
        expectedROI: 0,
        timeWindow: {
          start: new Date(Date.now() + 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        explanation: `Nitrogen levels at ${ctx.fieldState.nutrientLevels.n.toFixed(0)} kg/ha, ` +
                    `below optimal for ${ctx.cropState?.growthStage} stage. ` +
                    `Fertilization will support continued growth.`,
        riskFactors: ['Volatilization', 'Leaching', 'Over-application'],
        prerequisites: ['Fertilizer available', 'Spreading equipment', 'Weather window'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Split application (half now, half later)',
        cost: 10,
        expectedOutcome: 'Better efficiency, lower risk',
        tradeoffs: ['Higher labor cost', 'Two operations needed'],
        confidence: 75,
      },
      {
        description: 'Foliar application',
        cost: 25,
        expectedOutcome: 'Rapid uptake, lower rate needed',
        tradeoffs: ['Higher cost per kg N', 'Faster but shorter effect'],
        confidence: 70,
      },
    ],
  },

  // SCOUTING DECISIONS
  {
    id: 'scout-routine',
    type: 'scout',
    priority: 'medium',
    condition: (ctx) => {
      if (ctx.fieldState.stage !== 'growing' && ctx.fieldState.stage !== 'reproductive') return false;
      
      const lastScout = ctx.fieldState.operationsLog
        .filter(o => o.type === 'scout')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (!lastScout) return true;
      
      const daysSinceScout = (Date.now() - new Date(lastScout.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceScout > 7;
    },
    score: (ctx) => {
      let score = 60;
      
      // Higher priority if weather conditions favor pests/disease
      if (ctx.weather.forecast[0]?.humidity > 70) score += 15;
      if (ctx.weather.forecast.slice(0, 3).some(w => w.precipitation > 5)) score += 10;
      
      // Higher priority in critical stages
      if (ctx.cropState?.growthStage === 'flowering') score += 15;
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      return {
        action: 'Scout Field',
        actionType: 'scout',
        parameters: {
          method: 'walking',
          pattern: 'zigzag',
          focus: ['pests', 'disease', 'weeds', 'nutrient_deficiency'],
        },
        expectedCost: 50,
        expectedRevenue: ctx.cropState ? ctx.cropState.expectedYield * 200 * 0.12 : 0, // Catch issues early
        expectedROI: 0,
        timeWindow: {
          start: new Date(),
          end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        explanation: `Weekly scouting due. ${ctx.weather.forecast[0]?.humidity > 70 ? 'High humidity increases disease risk.' : ''} ` +
                    `Early detection prevents significant yield loss.`,
        riskFactors: ['Missing early symptoms', 'Weather delays'],
        prerequisites: ['Trained scout', 'Equipment available'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Drone scouting',
        cost: 80,
        expectedOutcome: 'Faster coverage, NDVI analysis',
        tradeoffs: ['Higher cost', 'Less detailed than walking'],
        confidence: 75,
      },
      {
        description: 'Skip this week',
        cost: 0,
        expectedOutcome: 'Risk of missing early pest/disease detection',
        tradeoffs: ['Save labor cost', 'Potential yield risk'],
        confidence: 50,
      },
    ],
  },

  // HARVEST DECISIONS
  {
    id: 'harvest-window',
    type: 'harvest',
    priority: 'high',
    condition: (ctx) => {
      if (ctx.fieldState.stage !== 'harvest_ready') return false;
      
      // Check if in harvest window
      const cropProfile = cropProfiles[ctx.cropState!.cropType as keyof typeof cropProfiles];
      if (!cropProfile) return false;
      
      return ctx.weather.harvestOpen;
    },
    score: (ctx) => {
      let score = 75;
      
      // Higher priority if moisture is optimal
      // (Would need grain moisture data in real implementation)
      
      // Weather window
      const goodDaysAhead = ctx.weather.forecast.filter(
        w => w.precipitationChance < 30 && w.windSpeed < 25
      ).length;
      score += goodDaysAhead * 3;
      
      // Market conditions
      if (ctx.marketConditions.trend === 'rising') score += 10;
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      const area = 10;
      
      return {
        action: 'Harvest Crop',
        actionType: 'harvest',
        parameters: {
          method: 'combine',
          moisture: 18, // Target moisture %
          speed: 5, // km/h
        },
        expectedCost: 35 * area, // $35/ha typical
        expectedRevenue: ctx.cropState ? ctx.cropState.expectedYield * area * 
                        (ctx.marketConditions.commodityPrices[ctx.cropState.cropType]?.current || 200) : 0,
        expectedROI: 0,
        timeWindow: {
          start: new Date(),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        explanation: `Crop at ${ctx.cropState?.growthStage} stage. ` +
                    `Favorable weather window with ${ctx.weather.forecast.filter(w => w.precipitationChance < 30).length} dry days ahead. ` +
                    `Optimal harvest conditions.`,
        riskFactors: ['Weather change', 'Equipment breakdown', 'Grain moisture'],
        prerequisites: ['Combine available', 'Transport ready', 'Storage space'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Wait for lower moisture',
        cost: -5,
        expectedOutcome: 'Better grain quality, lower drying costs',
        tradeoffs: ['Weather risk', 'Potential field losses'],
        confidence: 70,
      },
      {
        description: 'Contract custom harvester',
        cost: 15,
        expectedOutcome: 'Faster completion, professional equipment',
        tradeoffs: ['Higher cost', 'Less control over timing'],
        confidence: 75,
      },
    ],
  },

  // PEST TREATMENT
  {
    id: 'treat-pest-pressure',
    type: 'treat',
    priority: 'critical',
    condition: (ctx) => {
      return ctx.fieldState.pestPressure === 'high' || ctx.fieldState.pestPressure === 'severe';
    },
    score: (ctx) => {
      let score = 85;
      
      if (ctx.fieldState.pestPressure === 'severe') score += 15;
      if (ctx.cropState?.growthStage === 'reproductive') score += 5;
      
      // Check spray conditions
      if (ctx.weather.sprayOpen) score += 5;
      
      return Math.min(100, score);
    },
    generateRecommendation: (ctx) => {
      const area = 10;
      
      return {
        action: 'Apply Pesticide Treatment',
        actionType: 'spray',
        parameters: {
          product: 'insecticide', // Would be specific based on pest
          rate: 1.5,
          volume: 150,
          timing: 'evening',
        },
        expectedCost: 45 * area,
        expectedRevenue: ctx.cropState ? ctx.cropState.expectedYield * 200 * 0.2 : 0, // Prevent 20% loss
        expectedROI: 0,
        timeWindow: {
          start: new Date(Date.now() + 2 * 60 * 60 * 1000),
          end: new Date(Date.now() + 12 * 60 * 60 * 1000),
        },
        explanation: `Severe pest pressure detected: ${ctx.fieldState.pestPressure}. ` +
                    `Immediate treatment required to prevent significant yield loss. ` +
                    `Apply during ${ctx.weather.sprayOpen ? 'favorable' : 'marginal'} spray conditions.`,
        riskFactors: ['Resistance development', 'Beneficial insect impact', 'Weather'],
        prerequisites: ['Product available', 'Sprayer calibrated', 'Spray window'],
      };
    },
    alternatives: (ctx) => [
      {
        description: 'Biological control',
        cost: -10,
        expectedOutcome: 'Environmentally friendly, slower action',
        tradeoffs: ['Lower efficacy', 'May not stop current infestation'],
        confidence: 55,
      },
      {
        description: 'Spot treatment',
        cost: -30,
        expectedOutcome: 'Reduced cost, targeted application',
        tradeoffs: ['Requires precise mapping', 'May miss spread'],
        confidence: 70,
      },
    ],
  },
];

// ============================================================================
// DECISION ENGINE
// ============================================================================

export class DecisionEngine {
  private rules: DecisionRule[] = [...DECISION_RULES];

  addRule(rule: DecisionRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  async analyze(context: DecisionContext): Promise<Decision[]> {
    const decisions: Decision[] = [];

    for (const rule of this.rules) {
      try {
        // Check if condition is met
        if (!rule.condition(context)) continue;

        // Calculate confidence score
        const confidence = rule.score(context);
        
        // Only generate decision if confidence is above threshold
        if (confidence < 50) continue;

        // Generate recommendation
        const rec = rule.generateRecommendation(context);
        
        // Calculate ROI
        const expectedROI = rec.expectedRevenue > 0 
          ? ((rec.expectedRevenue - rec.expectedCost) / rec.expectedCost) * 100
          : 0;

        const recommendation: Recommendation = {
          ...rec,
          id: uuidv4(),
          confidence,
          expectedROI,
          rationale: buildRecommendationRationale(context, rule, rec.explanation),
          whyNow: `Recommended now to act before ${rec.timeWindow.end.toLocaleString()} and preserve expected outcomes.`,
          deadline: rec.timeWindow.end,
          expectedImpact: buildExpectedImpact({
            expectedRevenue: rec.expectedRevenue,
            expectedCost: rec.expectedCost,
            confidence,
          }),
          priorityScoring: buildPriorityScoring(
            context,
            rule,
            {
              expectedCost: rec.expectedCost,
              expectedRevenue: rec.expectedRevenue,
              expectedROI,
              timeWindow: rec.timeWindow,
            },
            confidence
          ),
        };

        // Generate alternatives
        const alternatives = rule.alternatives(context).map(alt => ({
          ...alt,
          id: uuidv4(),
          actionType: rule.type,
          parameters: {},
          expectedCost: rec.expectedCost + alt.cost,
          expectedRevenue: rec.expectedRevenue * (alt.confidence / 100),
          expectedROI: 0,
          timeWindow: rec.timeWindow,
          explanation: alt.expectedOutcome,
          riskFactors: alt.tradeoffs,
          prerequisites: [],
          confidence: alt.confidence,
          rationale: [
            {
              title: 'Alternative Path',
              detail: alt.expectedOutcome,
              source: 'rule',
            },
          ],
          whyNow: `Alternative remains viable until ${rec.timeWindow.end.toLocaleString()}.`,
          deadline: rec.timeWindow.end,
          expectedImpact: buildExpectedImpact({
            expectedRevenue: rec.expectedRevenue * (alt.confidence / 100),
            expectedCost: rec.expectedCost + alt.cost,
            confidence: alt.confidence,
          }),
          priorityScoring: buildPriorityScoring(
            context,
            rule,
            {
              expectedCost: rec.expectedCost + alt.cost,
              expectedRevenue: rec.expectedRevenue * (alt.confidence / 100),
              expectedROI:
                rec.expectedCost + alt.cost > 0
                  ? (((rec.expectedRevenue * (alt.confidence / 100)) - (rec.expectedCost + alt.cost)) /
                    (rec.expectedCost + alt.cost)) * 100
                  : 0,
              timeWindow: rec.timeWindow,
            },
            alt.confidence
          ),
        }));

        // Create decision
        const decision: Decision = {
          id: uuidv4(),
          type: rule.type,
          status: 'pending',
          priority: rule.priority,
          fieldId: context.fieldState.fieldId,
          cropId: context.cropState?.cropId,
          title: recommendation.action,
          description: recommendation.explanation,
          recommendation,
          alternatives,
          context,
          createdAt: new Date(),
          expiresAt: recommendation.timeWindow.end,
          autoExecuted: false,
        };

        decisions.push(decision);
      } catch (error) {
        console.error(`[DecisionEngine] Rule ${rule.id} failed:`, error);
      }
    }

    const conflictAwareDecisions = findDecisionConflicts(decisions, context);

    // Sort by priority and confidence (conflicts deprioritized as tie-breaker)
    const priorityOrder: Record<DecisionPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      routine: 4,
    };

    return conflictAwareDecisions.sort((a, b) => {
      const scoreDiff =
        (b.recommendation.priorityScoring?.compositeScore || 0) -
        (a.recommendation.priorityScoring?.compositeScore || 0);
      if (Math.abs(scoreDiff) > 0.01) return scoreDiff;

      const conflictPenaltyA = a.conflictAnalysis?.hasConflicts ? 1 : 0;
      const conflictPenaltyB = b.conflictAnalysis?.hasConflicts ? 1 : 0;
      if (conflictPenaltyA !== conflictPenaltyB) return conflictPenaltyA - conflictPenaltyB;

      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.recommendation.confidence - a.recommendation.confidence;
    });
  }

  // Build decision context from current game state
  buildContext(fieldId: string): DecisionContext {
    const gameStore = useGameStore.getState();
    const fieldStore = useFieldStore.getState();
    const weatherStore = useWeatherStore.getState();
    const marketStore = useMarketStore.getState();

    const field = gameStore.fields.find(f => f.id === fieldId);
    const gameField = fieldStore.fields.find(f => f.id === fieldId);
    
    // Build field state
    const fieldState: FieldState = {
      fieldId,
      stage: (field?.stage || 'fallow') as FieldState['stage'],
      soilMoisture: gameField?.soilMoisture || 40,
      soilTemperature: gameField?.soilTemperature || 15,
      soilHealth: {
        ph: 6.5,
        organicMatter: 3.5,
        nitrogen: 60,
        phosphorus: 25,
        potassium: 180,
        compaction: 20,
        biodiversity: 70,
        overallScore: 75,
      },
      pestPressure: 'low',
      diseaseRisk: 'low',
      nutrientLevels: {
        n: 60,
        p: 25,
        k: 180,
        s: 15,
        micronutrients: {},
      },
      operationsLog: [],
    };

    // Build crop state if exists
    let cropState: CropState | undefined;
    if (field?.crop) {
      const cropProfile = cropProfiles[field.crop as keyof typeof cropProfiles];
      cropState = {
        cropId: `${fieldId}-${field.crop}`,
        cropType: field.crop,
        variety: 'standard',
        plantedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        growthStage: field.growthStage as GrowthStage || 'vegetative',
        growthProgress: 45,
        gddAccumulated: 450,
        waterStress: gameField?.waterStress || 20,
        nutrientStress: 15,
        healthScore: 85,
        expectedYield: cropProfile?.yieldExpectations.average || 5,
        harvestWindow: {
          start: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      };
    }

    // Build weather forecast
    const weeklyWeather = gameStore.weeklyWeather;
    const forecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      condition: i === 0 ? weeklyWeather.condition : 'Partly cloudy',
      temperature: {
        min: 12,
        max: 24,
      },
      precipitation: i < 2 ? 0 : Math.random() * 5,
      precipitationChance: weeklyWeather.precipitationChance,
      humidity: 60,
      windSpeed: weeklyWeather.windMph * 1.6, // mph to km/h
      soilTemperature: 16,
    }));

    return {
      timestamp: new Date(),
      gameTime: gameStore.gameTime,
      weather: {
        ...weeklyWeather,
        forecast,
      },
      fieldState,
      cropState,
      marketConditions: {
        commodityPrices: Object.fromEntries(
          Object.entries(marketStore.prices || {}).map(([k, v]) => [k, { current: v, previous: v * 0.98, change: 2, forecast: [v] }])
        ),
        inputCosts: {},
        demandIndex: 70,
        supplyIndex: 65,
        trend: 'stable',
        volatility: 15,
      },
      resourceAvailability: {
        equipment: [],
        labor: {
          totalWorkers: 5,
          availableWorkers: 3,
          hourlyRate: 25,
          overtimeRate: 37.5,
        },
        inputs: {
          seeds: {},
          fertilizers: {},
          chemicals: {},
          fuel: 500,
        },
        cash: gameStore.balance,
        credit: 100000,
      },
      historicalData: {
        samePeriodLastYear: { yield: 5.5, quality: 85, costs: 5000, revenue: 12000, profit: 7000, weatherPattern: 'normal' },
        threeYearAverage: { yield: 5.2, quality: 82, costs: 4800, revenue: 11000, profit: 6200, weatherPattern: 'variable' },
        lastSimilarWeather: [],
        yieldHistory: [],
        decisionHistory: [],
      },
      player: {
        id: gameStore.currentPlayer?.id || 'player-1',
        username: gameStore.currentPlayer?.username || 'Player',
        email: '',
        passwordHash: '',
        balance: gameStore.balance,
        xp: gameStore.xp,
        level: gameStore.level,
        reputation: gameStore.reputation,
        ownedFieldIds: gameStore.fields.map(f => f.id),
        rentedFieldIds: [],
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export const decisionEngine = new DecisionEngine();

// ============================================================================
// PRIORITY QUEUE
// ============================================================================

export class DecisionPriorityQueue {
  private decisions: Decision[] = [];

  add(decision: Decision): void {
    this.decisions.push(decision);
    this.sort();
  }

  remove(decisionId: string): void {
    this.decisions = this.decisions.filter(d => d.id !== decisionId);
  }

  getNext(): Decision | null {
    return this.decisions.find(d => d.status === 'pending') || null;
  }

  getByPriority(priority: DecisionPriority): Decision[] {
    return this.decisions.filter(d => d.priority === priority && d.status === 'pending');
  }

  getAll(): Decision[] {
    return [...this.decisions];
  }

  clear(): void {
    this.decisions = [];
  }

  private sort(): void {
    const priorityOrder: Record<DecisionPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      routine: 4,
    };

    this.decisions.sort((a, b) => {
      const scoreDiff =
        (b.recommendation.priorityScoring?.compositeScore || 0) -
        (a.recommendation.priorityScoring?.compositeScore || 0);
      if (Math.abs(scoreDiff) > 0.01) return scoreDiff;

      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    });
  }
}

export const decisionQueue = new DecisionPriorityQueue();

// ============================================================================
// ROI CALCULATOR
// ============================================================================

export function calculateDecisionROI(
  cost: number,
  expectedRevenue: number,
  confidence: number
): {
  expectedROI: number;
  riskAdjustedROI: number;
  breakEvenProbability: number;
} {
  const expectedROI = cost > 0 ? ((expectedRevenue - cost) / cost) * 100 : 0;
  const riskAdjustedROI = expectedROI * (confidence / 100);
  
  // Simplified break-even probability based on confidence
  const breakEvenProbability = confidence;

  return {
    expectedROI,
    riskAdjustedROI,
    breakEvenProbability,
  };
}

// ============================================================================
// AUTO-EXECUTION
// ============================================================================

export function shouldAutoExecute(decision: Decision, automationLevel: string): boolean {
  if (automationLevel === 'manual') return false;
  if (automationLevel === 'assisted') return false;
  if (automationLevel !== 'fully_automated') return false;

  const store = useOrchestratorStore.getState();
  
  // Critical decisions always require approval
  if (decision.priority === 'critical') return false;
  
  // Check confidence threshold
  if (decision.recommendation.confidence < store.config.autoExecuteThreshold) {
    return false;
  }

  // Check if we have enough resources
  const context = decision.context;
  if (decision.recommendation.expectedCost > context.resourceAvailability.cash + context.resourceAvailability.credit) {
    return false;
  }

  return true;
}

// ============================================================================
// LEARNING LOOP
// ============================================================================

interface DecisionOutcome {
  decisionId: string;
  actualCost: number;
  actualRevenue: number;
  actualYield: number;
  quality: number;
  satisfaction: number;
}

class LearningLoop {
  private outcomes: Map<string, DecisionOutcome> = new Map();

  recordOutcome(decisionId: string, outcome: DecisionOutcome): void {
    this.outcomes.set(decisionId, outcome);
    
    // Update decision in store
    const store = useOrchestratorStore.getState();
    const decision = store.activeDecisions.find(d => d.id === decisionId);
    
    if (decision) {
      const predictedROI = decision.recommendation.expectedROI;
      const actualROI = ((outcome.actualRevenue - outcome.actualCost) / outcome.actualCost) * 100;
      const accuracy = 100 - Math.abs(predictedROI - actualROI);

      store.updateMetrics({
        predictionAccuracy: accuracy,
      });
    }
  }

  getAccuracyTrend(decisionType: string, window = 10): number {
    const relevant = Array.from(this.outcomes.values())
      .slice(-window);
    
    if (relevant.length === 0) return 0;
    
    const accuracies = relevant.map(o => o.satisfaction);
    return accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  }

  generateInsights(): string[] {
    const insights: string[] = [];
    
    // Analyze patterns
    const allOutcomes = Array.from(this.outcomes.values());
    if (allOutcomes.length > 10) {
      const avgSatisfaction = allOutcomes.reduce((a, o) => a + o.satisfaction, 0) / allOutcomes.length;
      
      if (avgSatisfaction > 80) {
        insights.push('AI recommendations are performing well. Consider increasing auto-execution threshold.');
      } else if (avgSatisfaction < 60) {
        insights.push('Recommendation accuracy is below target. Review decision rules and thresholds.');
      }
    }
    
    return insights;
  }
}

export const learningLoop = new LearningLoop();
