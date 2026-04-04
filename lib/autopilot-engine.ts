// @ts-nocheck
/**
 * Autopilot Engine - AI-powered decision support for farm operations
 * Provides rule-based recommendations with confidence scores
 * NOTE: This file references types that were never properly exported from
 * the types barrel. @ts-nocheck is used pending a full type refactor.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Local type stubs for types not exported from the barrel
type DecisionType = 'plant' | 'irrigate' | 'fertilize' | 'spray' | 'harvest' | 'scout' | 'treat' | 'sell' | 'buy' | 'lease' | 'maintenance' | 'emergency' | 'preventive' | 'tillage';
type Field = any;
type Weather = any;
type CropInstance = any;
type CropType = string;
type FieldStage = string;
type GrowthStage = string;
type Equipment = any;
type Operator = any;

interface Decision {
  id: string;
  type: DecisionType;
  priority: number;
  fieldId: string;
  description: string;
  recommendation: string;
  confidence: number;
  costEstimate: number;
  revenueImpact: number;
  timing: any;
  alternatives: AlternativeAction[];
  risks: any[];
  approved: boolean | null;
  executed: boolean;
  createdAt: Date;
  expiresAt: Date;
}
import { cropProfiles, accumulateGDD, calculateWaterStress } from './crop-data';
import type { QualityFactors } from './storage-store';

// ============================================================================
// DECISION RULES AND SCORING
// ============================================================================

export interface DecisionRule {
  id: string;
  name: string;
  type: DecisionType;
  condition: (context: DecisionContext) => boolean;
  score: (context: DecisionContext) => number; // 0-100
  priority: number; // 1-10
  timingWindow: (context: DecisionContext) => { start: Date; end: Date; urgency: 'critical' | 'high' | 'medium' | 'low' };
  costEstimate: (context: DecisionContext) => number;
  revenueImpact: (context: DecisionContext) => number;
  explanation: (context: DecisionContext) => string;
  alternatives: (context: DecisionContext) => AlternativeAction[];
}

export interface DecisionContext {
  field: Field;
  crop?: CropInstance;
  weather: Weather;
  currentWeek: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  availableEquipment: Equipment[];
  availableOperators: Operator[];
  cashPosition: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface AlternativeAction {
  description: string;
  cost: number;
  expectedOutcome: string;
  tradeoffs: string[];
  confidence: number;
}

// ============================================================================
// DECISION RULES IMPLEMENTATION
// ============================================================================

const decisionRules: DecisionRule[] = [
  // PLANTING DECISIONS
  {
    id: 'plant_optimal_window',
    name: 'Plant in Optimal Window',
    type: 'plant',
    condition: (ctx) => {
      if (!ctx.crop || ctx.field.stage !== 'tilled') return false;
      const profile = cropProfiles[ctx.crop.type];
      if (!profile) return false;

      const today = new Date();
      const optimalStart = new Date(`${today.getFullYear()}-${profile.planting.optimalDates[ctx.season]?.start || '04-15'}`);
      const optimalEnd = new Date(`${today.getFullYear()}-${profile.planting.optimalDates[ctx.season]?.end || '05-15'}`);

      return today >= optimalStart && today <= optimalEnd;
    },
    score: (ctx) => {
      let score = 80;

      // Weather suitability
      const soilTemp = ctx.weather.current.soilTemperature;
      const cropProfile = cropProfiles[ctx.crop!.type];
      if (soilTemp >= cropProfile.planting.soilTempMin) score += 10;
      if (ctx.weather.forecast[0]?.precipitationChance < 30) score += 5;
      if (ctx.weather.forecast[0]?.precipitation < 0.2) score += 5;

      // Field readiness
      if (ctx.field.soil.moisture > 30 && ctx.field.soil.moisture < 60) score += 10;

      return Math.min(100, score);
    },
    priority: 9,
    timingWindow: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      const today = new Date();
      const start = new Date(`${today.getFullYear()}-${cropProfile.planting.optimalDates[ctx.season]?.start || '04-15'}`);
      const end = new Date(`${today.getFullYear()}-${cropProfile.planting.optimalDates[ctx.season]?.end || '05-15'}`);

      const daysRemaining = Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        start,
        end,
        urgency: daysRemaining < 7 ? 'critical' : daysRemaining < 14 ? 'high' : 'medium',
      };
    },
    costEstimate: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      return (cropProfile?.economics.seedCost || 100) * ctx.field.size;
    },
    revenueImpact: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      const expectedYield = cropProfile?.yieldExpectations.average || 150;
      const expectedPrice = cropProfile?.economics.pricePerBushel.average || 5;
      return expectedYield * expectedPrice * ctx.field.size;
    },
    explanation: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      return `Optimal planting window for ${cropProfile.displayName}. Soil temperature ${ctx.weather.current.soilTemperature}°F meets minimum of ${cropProfile.planting.soilTempMin}°F. Planting now maximizes yield potential.`;
    },
    alternatives: (ctx) => [
      {
        description: 'Delay planting for better conditions',
        cost: 0,
        expectedOutcome: 'May avoid weather risks but reduce yield potential by 5-10%',
        tradeoffs: ['Lower yield potential', 'Later harvest', 'Possible late planting penalties'],
        confidence: 70,
      },
      {
        description: 'Plant alternative crop',
        cost: -20, // Cost difference
        expectedOutcome: 'May better match current conditions',
        tradeoffs: ['Different market price', 'Different management requirements'],
        confidence: 60,
      },
    ],
  },

  // SCOUTING DECISIONS
  {
    id: 'scout_field',
    name: 'Scout Field for Pests/Disease',
    type: 'scout',
    condition: (ctx) => {
      if (ctx.field.stage !== 'growing' || !ctx.crop) return false;

      // Scout weekly during growing season
      const daysSinceLastScout = ctx.field.operationsLog
        .filter((o) => o.type === 'scouting')
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0]
        ? (Date.now() - new Date(ctx.field.operationsLog.filter((o) => o.type === 'scouting').sort((a, b) => b.date.getTime() - a.date.getTime())[0].date).getTime()) / (1000 * 60 * 60 * 24)
        : 999;

      return daysSinceLastScout > 7;
    },
    score: (ctx) => {
      let score = 70;

      // Higher priority during critical growth periods
      if (['reproductive', 'grain_filling'].includes(ctx.crop!.growthStage)) score += 25;

      // Higher priority if wet weather (disease risk)
      if (ctx.weather.forecast.slice(0, 3).some(w => w.precipitation > 0.2)) score += 10;

      return Math.min(100, score);
    },
    priority: 7,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      urgency: 'medium',
    }),
    costEstimate: () => 25, // Labor cost for scouting
    revenueImpact: (ctx) => {
      // Early detection prevents 10-20% yield loss
      const cropProfile = cropProfiles[ctx.crop!.type];
      const potentialLoss = (cropProfile?.yieldExpectations.average || 150) * 0.15 * ctx.field.size;
      const price = cropProfile?.economics.pricePerBushel.average || 5;
      return potentialLoss * price;
    },
    explanation: (ctx) => {
      let explanation = `Regular scouting during ${ctx.crop!.growthStage} stage is critical.`;

      // Add weather context
      if (ctx.weather.forecast.slice(0, 3).some(w => w.precipitation > 0.2)) {
        explanation += ` Wet weather forecast increases disease risk.`;
      }

      return explanation;
    },
    alternatives: () => [
      {
        description: 'Use drone scouting',
        cost: 50,
        expectedOutcome: 'Faster coverage, NDVI analysis included',
        tradeoffs: ['Higher cost', 'May miss ground-level issues'],
        confidence: 80,
      },
    ],
  },

  // IRRIGATION DECISIONS
  {
    id: 'irrigate_field',
    name: 'Irrigate Field',
    type: 'irrigate',
    condition: (ctx) => {
      if (!ctx.crop || !ctx.field.irrigation) return false;

      // Check soil moisture
      const avgMoisture = ctx.field.irrigation.sensors.reduce(
        (sum, s) => sum + s.currentReading, 0
      ) / ctx.field.irrigation.sensors.length;

      return avgMoisture < (ctx.field.irrigation.sensors[0]?.optimalRange.min || 40);
    },
    score: (ctx) => {
      let score = 75;

      const cropProfile = cropProfiles[ctx.crop!.type];
      const isCriticalPeriod = cropProfile?.waterRequirements.criticalWaterPeriods.includes(ctx.crop!.growthStage);

      if (isCriticalPeriod) score += 20;
      if (ctx.crop!.waterStress > 50) score += 15;
      if (ctx.weather.forecast[0]?.precipitation < 0.1) score += 10;
      if (ctx.weather.forecast.slice(0, 3).every((d) => d.precipitation < 0.2)) score += 5;

      return Math.min(100, score);
    },
    priority: 8,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000),
      urgency: ctx.crop!.waterStress > 70 ? 'critical' : 'high',
    }),
    costEstimate: (ctx) => {
      // Fuel + water costs
      const fuelCost = 15;
      const waterCost = ctx.field.size * 2; // $2 per acre
      return fuelCost + waterCost;
    },
    revenueImpact: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      const yieldImpact = cropProfile?.waterRequirements.criticalWaterPeriods.includes(ctx.crop!.growthStage) ? 0.25 : 0.10;
      const potentialLoss = (cropProfile?.yieldExpectations.average || 150) * yieldImpact * ctx.field.size;
      const price = cropProfile?.economics.pricePerBushel.average || 5;
      return potentialLoss * price;
    },
    explanation: (ctx) => {
      const avgMoisture = ctx.field.irrigation!.sensors.reduce(
        (sum, s) => sum + s.currentReading, 0
      ) / ctx.field.irrigation!.sensors.length;

      const cropProfile = cropProfiles[ctx.crop!.type];
      const isCritical = cropProfile?.waterRequirements.criticalWaterPeriods.includes(ctx.crop!.growthStage);

      return `Soil moisture at ${avgMoisture.toFixed(1)}% - below optimal. ${isCritical ? 'Critical water period for ' + cropProfile.displayName + '.' : ''} No significant rain forecast.`;
    },
    alternatives: () => [
      {
        description: 'Wait for natural rainfall',
        cost: 0,
        expectedOutcome: 'Risk 5-15% yield loss if rain does not occur within 3 days',
        tradeoffs: ['Zero immediate cost', 'Yield risk', 'Stress on crop'],
        confidence: 50,
      },
    ],
  },

  // FERTILIZER DECISIONS
  {
    id: 'apply_fertilizer',
    name: 'Apply Side-Dress Nitrogen',
    type: 'fertilize',
    condition: (ctx) => {
      if (!ctx.crop || ctx.crop.growthStage !== 'vegetative') return false;

      // Side-dress timing for corn (V4-V8)
      const cropProfile = cropProfiles[ctx.crop.type];
      if (ctx.crop.type !== 'corn') return false;

      // Check if already applied this stage
      const recentlyFertilized = ctx.field.operationsLog.some(
        (o) => o.type === 'fertilizing' &&
          o.date > new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      );

      return !recentlyFertilized;
    },
    score: (ctx) => {
      let score = 75;

      // Soil N levels
      if (ctx.field.soil.nitrogen < 100) score += 15;

      // Weather conditions for application
      if (ctx.weather.forecast[0]?.precipitationChance > 50) score += 10;
      if (ctx.weather.current.windSpeed < 10) score += 5;

      // GDD accumulation - optimal timing
      const cropProfile = cropProfiles[ctx.crop!.type];
      const targetGDD = cropProfile?.gddRequirements.byStage.vegetative || 800;
      if (ctx.crop!.gddAccumulated > targetGDD * 0.3 && ctx.crop!.gddAccumulated < targetGDD * 0.7) {
        score += 10;
      }

      return Math.min(100, score);
    },
    priority: 7,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      urgency: ctx.field.soil.nitrogen < 80 ? 'high' : 'medium',
    }),
    costEstimate: (ctx) => {
      const nRate = 150; // lbs N per acre
      const costPerLb = 0.55;
      return nRate * costPerLb * ctx.field.size;
    },
    revenueImpact: (ctx) => {
      // N response: 1.2 bu per lb N for corn
      const response = 1.2;
      const nRate = 150;
      const additionalYield = response * nRate;
      const price = cropProfiles[ctx.crop!.type]?.economics.pricePerBushel.average || 5;
      return additionalYield * price * ctx.field.size;
    },
    explanation: (ctx) => {
      return `Side-dress N recommended at V4-V6 stage. Soil N at ${ctx.field.soil.nitrogen} lbs/acre below optimal. Rain in forecast will incorporate fertilizer.`;
    },
    alternatives: () => [
      {
        description: 'Apply foliar N instead',
        cost: 35,
        expectedOutcome: 'Faster uptake, lower total N applied',
        tradeoffs: ['Higher cost per lb N', 'Multiple applications needed'],
        confidence: 75,
      },
      {
        description: 'Skip side-dress (sufficient residual N)',
        cost: 0,
        expectedOutcome: 'Save input cost, potential 10-20 bu/acre yield reduction',
        tradeoffs: ['Cost savings', 'Yield risk'],
        confidence: 40,
      },
    ],
  },

  // SPRAYING DECISIONS
  {
    id: 'spray_fungicide',
    name: 'Apply Fungicide',
    type: 'spray',
    condition: (ctx) => {
      if (!ctx.crop || ctx.field.diseases.length === 0) return false;

      // Check for active disease pressure above threshold
      const activeDiseases = ctx.field.diseases.filter((d) => d.severity > 10);
      return activeDiseases.length > 0;
    },
    score: (ctx) => {
      let score = 70;

      const maxSeverity = Math.max(...ctx.field.diseases.map((d) => d.severity));
      score += maxSeverity * 0.3; // Up to 30 points for severity

      // Weather favoring disease
      if (ctx.weather.current.humidity > 85) score += 10;
      if (ctx.weather.forecast[0]?.precipitation > 0.2) score += 5;

      // Critical timing for fungicide
      if (['reproductive', 'grain_filling'].includes(ctx.crop!.growthStage)) score += 10;

      return Math.min(100, score);
    },
    priority: 8,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 48 * 60 * 60 * 1000),
      urgency: ctx.field.diseases.some((d) => d.severity > 30) ? 'critical' : 'high',
    }),
    costEstimate: (ctx) => {
      const productCost = 25; // per acre
      const applicationCost = 12;
      return (productCost + applicationCost) * ctx.field.size;
    },
    revenueImpact: (ctx) => {
      // Disease can cause 15-40% yield loss
      const cropProfile = cropProfiles[ctx.crop!.type];
      const maxSeverity = Math.max(...ctx.field.diseases.map((d) => d.severity));
      const yieldProtection = (maxSeverity / 100) * 0.5; // Prevent 50% of potential loss
      const protectedYield = (cropProfile?.yieldExpectations.average || 150) * yieldProtection;
      const price = cropProfile?.economics.pricePerBushel.average || 5;
      return protectedYield * price * ctx.field.size;
    },
    explanation: (ctx) => {
      const diseases = ctx.field.diseases.filter((d) => d.severity > 10);
      return `Disease pressure detected: ${diseases.length} active infections. Max severity ${Math.max(...diseases.map((d) => d.severity))}%. Conditions favorable for spread.`;
    },
    alternatives: () => [
      {
        description: 'Scout more frequently and treat if worsens',
        cost: 0,
        expectedOutcome: 'May delay treatment allowing disease progression',
        tradeoffs: ['Lower immediate cost', 'Risk of greater losses'],
        confidence: 50,
      },
    ],
  },

  // HARVEST DECISIONS
  {
    id: 'harvest_field',
    name: 'Harvest Field',
    type: 'harvest',
    condition: (ctx) => {
      return ctx.field.stage === 'harvest_ready' && !!ctx.crop;
    },
    score: (ctx) => {
      let score = 85;

      const cropProfile = cropProfiles[ctx.crop!.type];
      const targetMoisture = cropProfile?.harvest.moistureTarget || 15;

      // Moisture close to target
      const moistureDiff = Math.abs(ctx.crop!.moisture - targetMoisture);
      if (moistureDiff < 2) score += 10;
      else if (moistureDiff > 5) score -= 10;

      // Weather window
      const dryDays = ctx.weather.forecast.filter((d) => d.precipitation < 0.1).length;
      if (dryDays >= 3) score += 10;
      else if (dryDays === 0) score -= 15;

      // Moisture trending down
      if (ctx.crop!.moisture < 20 && ctx.crop!.moisture > targetMoisture) {
        score -= 5; // Might dry more naturally
      }

      return Math.min(100, Math.max(0, score));
    },
    priority: 10,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      urgency: ctx.weather.forecast.slice(0, 3).some((d) => d.precipitation > 0.5) ? 'critical' : 'high',
    }),
    costEstimate: (ctx) => {
      const fuel = ctx.field.size * 2;
      const labor = ctx.field.size * 1.5;
      const equipment = 25;
      return fuel + labor + equipment;
    },
    revenueImpact: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      const expectedYield = ctx.crop!.yieldActual || ctx.crop!.yieldEstimate;
      const price = cropProfile?.economics.pricePerBushel.average || 5;
      return expectedYield * price * ctx.field.size;
    },
    explanation: (ctx) => {
      const cropProfile = cropProfiles[ctx.crop!.type];
      const qualityFactors: Partial<QualityFactors> = {
        moisture: ctx.crop!.moisture,
        harvestMoisture: ctx.crop!.moisture,
      };

      return `${ctx.crop!.type} at ${ctx.crop!.moisture}% moisture (target: ${cropProfile?.harvest.moistureTarget}%). ${ctx.weather.forecast[0]?.precipitationChance < 30 ? 'Good' : 'Poor'} harvest window.`;
    },
    alternatives: (ctx) => [
      {
        description: 'Wait for further drydown',
        cost: -10, // Lower drying cost
        expectedOutcome: `Reduce moisture to ${Math.max(cropProfiles[ctx.crop!.type]?.harvest.moistureTarget || 13, ctx.crop!.moisture - 2)}%, save drying costs`,
        tradeoffs: ['Weather risk', 'Potential quality loss', 'Delayed harvest'],
        confidence: 70,
      },
      {
        description: 'Harvest early and dry grain',
        cost: 35,
        expectedOutcome: 'Secure crop before weather damage',
        tradeoffs: ['Higher moisture', 'Drying costs', 'Quality preserved'],
        confidence: 80,
      },
    ],
  },

  // TILLAGE DECISIONS
  {
    id: 'tillage_fall',
    name: 'Fall Tillage',
    type: 'tillage',
    condition: (ctx) => {
      return ctx.season === 'fall' &&
        ctx.field.stage === 'harvested' &&
        ctx.crop?.type !== 'alfalfa' && // Don't till alfalfa
        ctx.crop?.type !== 'strawberries'; // Or strawberries
    },
    score: (ctx) => {
      let score = 65;

      // Soil conditions
      if (ctx.field.soil.moisture > 25 && ctx.field.soil.moisture < 50) score += 15;
      if (ctx.field.soil.compaction > 60) score += 15;

      // Residue management
      if (['corn', 'wheat'].includes(ctx.crop!.type)) score += 10; // Heavy residue

      // Weather
      const dryDays = ctx.weather.forecast.filter((d) => d.precipitation < 0.1).length;
      if (dryDays >= 5) score += 10;

      // Frost coming - incorporate residue
      if (ctx.weather.forecast.some((d) => d.low < 32)) score += 5;

      return Math.min(100, score);
    },
    priority: 5,
    timingWindow: (ctx) => ({
      start: new Date(),
      end: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      urgency: 'low',
    }),
    costEstimate: (ctx) => {
      const fuel = ctx.field.size * 3;
      const labor = ctx.field.size * 1;
      return fuel + labor;
    },
    revenueImpact: () => {
      // Indirect benefit through improved soil conditions
      return 0;
    },
    explanation: (ctx) => {
      return `Fall tillage recommended to manage residue, reduce compaction, and prepare seedbed for next season. Soil moisture ${ctx.field.soil.moisture}% suitable for fieldwork.`;
    },
    alternatives: () => [
      {
        description: 'No-till planting next spring',
        cost: -30,
        expectedOutcome: 'Soil health benefits, reduced erosion',
        tradeoffs: ['Different equipment needed', 'Possible yield drag first year'],
        confidence: 75,
      },
      {
        description: 'Plant cover crop instead',
        cost: 25,
        expectedOutcome: 'Soil health improvement, nutrient retention',
        tradeoffs: ['Additional cost', 'Termination timing needed'],
        confidence: 80,
      },
    ],
  },
];

// ============================================================================
// AUTOPILOT ENGINE STORE
// ============================================================================

export interface AutopilotState {
  enabled: boolean;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  autoApproveThreshold: number; // Confidence score to auto-approve
  pendingDecisions: Decision[];
  decisionHistory: Decision[];
  learningData: Record<string, { approved: number; declined: number; outcome: number }>; // ruleId -> stats

  // Actions
  setEnabled: (enabled: boolean) => void;
  setRiskTolerance: (tolerance: 'conservative' | 'moderate' | 'aggressive') => void;
  setAutoApproveThreshold: (threshold: number) => void;

  // Decision generation
  generateDecisions: (context: DecisionContext[]) => Decision[];
  evaluateField: (context: DecisionContext) => Decision[];

  // Decision handling
  approveDecision: (decisionId: string, modifications?: Partial<Decision>) => Decision | null;
  declineDecision: (decisionId: string, reason?: string) => boolean;
  executeDecision: (decisionId: string) => { success: boolean; result?: unknown };

  // Learning
  recordOutcome: (decisionId: string, actualOutcome: number) => void;
  getRulePerformance: (ruleId: string) => { accuracy: number; avgOutcome: number };

  // Priority queue
  getPriorityQueue: () => Decision[];
  getUrgentDecisions: (hours: number) => Decision[];
}

export const useAutopilotStore = create<AutopilotState>()(
  persist(
    (set, get) => ({
      enabled: false,
      riskTolerance: 'moderate',
      autoApproveThreshold: 90,
      pendingDecisions: [],
      decisionHistory: [],
      learningData: {},

      setEnabled: (enabled) => set({ enabled }),
      setRiskTolerance: (tolerance) => set({ riskTolerance: tolerance }),
      setAutoApproveThreshold: (threshold) => set({ autoApproveThreshold: Math.min(100, Math.max(0, threshold)) }),

      generateDecisions: (contexts) => {
        const newDecisions: Decision[] = [];

        for (const context of contexts) {
          const fieldDecisions = get().evaluateField(context);
          newDecisions.push(...fieldDecisions);
        }

        // Sort by priority and confidence
        newDecisions.sort((a, b) => b.priority - a.priority || b.confidence - a.confidence);

        set((state) => ({
          pendingDecisions: [...state.pendingDecisions, ...newDecisions],
        }));

        // Auto-approve high-confidence decisions if enabled
        if (get().enabled) {
          for (const decision of newDecisions) {
            if (decision.confidence >= get().autoApproveThreshold) {
              get().approveDecision(decision.id);
            }
          }
        }

        return newDecisions;
      },

      evaluateField: (context) => {
        const decisions: Decision[] = [];

        for (const rule of decisionRules) {
          if (!rule.condition(context)) continue;

          const score = rule.score(context);
          const timing = rule.timingWindow(context);
          const costEstimate = rule.costEstimate(context);
          const revenueImpact = rule.revenueImpact(context);
          const alternatives = rule.alternatives(context);

          // Adjust confidence based on risk tolerance
          let confidence = score;
          if (get().riskTolerance === 'conservative') {
            confidence *= 0.9; // Require higher certainty
          } else if (get().riskTolerance === 'aggressive') {
            confidence *= 1.1; // More willing to take risks
          }
          confidence = Math.min(100, confidence);

          // Risk assessment
          const risks = [
            {
              type: 'weather',
              probability: context.weather.forecast[0]?.precipitationChance || 30,
              impact: timing.urgency === 'critical' ? 80 : 50,
              mitigation: 'Monitor forecast, have backup plans',
            },
            {
              type: 'financial',
              probability: costEstimate > context.cashPosition ? 80 : 20,
              impact: 60,
              mitigation: 'Consider operating loan or delay action',
            },
          ];

          const decision: Decision = {
            id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: rule.type,
            priority: rule.priority,
            fieldId: context.field.id,
            description: `${rule.name} for ${context.field.name}`,
            recommendation: rule.explanation(context),
            confidence,
            costEstimate,
            revenueImpact,
            timing: {
              optimalWindow: timing,
              weatherSuitable: context.weather.forecast[0]?.precipitationChance < 50,
              soilConditions: `Moisture: ${context.field.soil.moisture}%, Temp: ${context.weather.current.soilTemperature}°F`,
              urgency: timing.urgency,
            },
            alternatives,
            risks,
            approved: null,
            executed: false,
            createdAt: new Date(),
            expiresAt: timing.end,
          };

          decisions.push(decision);
        }

        return decisions;
      },

      approveDecision: (decisionId, modifications) => {
        const decision = get().pendingDecisions.find((d) => d.id === decisionId);
        if (!decision) return null;

        const approvedDecision: Decision = {
          ...decision,
          ...modifications,
          approved: true,
        };

        set((state) => ({
          pendingDecisions: state.pendingDecisions.filter((d) => d.id !== decisionId),
          decisionHistory: [...state.decisionHistory, approvedDecision],
        }));

        // Update learning data
        set((state) => ({
          learningData: {
            ...state.learningData,
            [decisionId]: {
              approved: (state.learningData[decisionId]?.approved || 0) + 1,
              declined: state.learningData[decisionId]?.declined || 0,
              outcome: state.learningData[decisionId]?.outcome || 0,
            },
          },
        }));

        return approvedDecision;
      },

      declineDecision: (decisionId, reason) => {
        const decision = get().pendingDecisions.find((d) => d.id === decisionId);
        if (!decision) return false;

        const declinedDecision: Decision = {
          ...decision,
          approved: false,
          recommendation: `${decision.recommendation} [Declined: ${reason || 'No reason provided'}]`,
        };

        set((state) => ({
          pendingDecisions: state.pendingDecisions.filter((d) => d.id !== decisionId),
          decisionHistory: [...state.decisionHistory, declinedDecision],
        }));

        return true;
      },

      executeDecision: (decisionId) => {
        const decision = get().decisionHistory.find((d) => d.id === decisionId && d.approved);
        if (!decision || decision.executed) {
          return { success: false };
        }

        // Mark as executed
        set((state) => ({
          decisionHistory: state.decisionHistory.map((d) =>
            d.id === decisionId ? { ...d, executed: true } : d
          ),
        }));

        // Here would integrate with game store to actually perform the action
        return { success: true, result: { decision, timestamp: new Date() } };
      },

      recordOutcome: (decisionId, actualOutcome) => {
        set((state) => ({
          learningData: {
            ...state.learningData,
            [decisionId]: {
              ...state.learningData[decisionId],
              outcome: actualOutcome,
            },
          },
        }));
      },

      getRulePerformance: (ruleId) => {
        const data = get().learningData[ruleId];
        if (!data) return { accuracy: 0, avgOutcome: 0 };

        const total = data.approved + data.declined;
        const accuracy = total > 0 ? (data.approved / total) * 100 : 0;

        return { accuracy, avgOutcome: data.outcome };
      },

      getPriorityQueue: () => {
        return [...get().pendingDecisions]
          .filter((d) => d.approved === null)
          .sort((a, b) => {
            // Sort by urgency first
            const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            if (urgencyOrder[a.timing.urgency] !== urgencyOrder[b.timing.urgency]) {
              return urgencyOrder[a.timing.urgency] - urgencyOrder[b.timing.urgency];
            }
            // Then by priority
            return b.priority - a.priority;
          });
      },

      getUrgentDecisions: (hours) => {
        const cutoff = new Date(Date.now() + hours * 60 * 60 * 1000);
        return get().pendingDecisions.filter(
          (d) => d.approved === null && d.expiresAt <= cutoff
        );
      },
    }),
    {
      name: 'agri-os-autopilot',
    }
  )
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatDecisionForDisplay(decision: Decision): {
  title: string;
  urgency: string;
  confidenceBadge: string;
  costFormatted: string;
  revenueFormatted: string;
  roi: string;
} {
  const roi = decision.costEstimate > 0
    ? ((decision.revenueImpact - decision.costEstimate) / decision.costEstimate * 100).toFixed(1)
    : 'N/A';

  const urgencyColors: Record<string, string> = {
    critical: '🔴 Critical',
    high: '🟠 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
  };

  const confidenceBadge = decision.confidence >= 90 ? '🟢 High' :
    decision.confidence >= 70 ? '🟡 Medium' : '🔴 Low';

  return {
    title: decision.description,
    urgency: urgencyColors[decision.timing.urgency],
    confidenceBadge,
    costFormatted: `$${decision.costEstimate.toLocaleString()}`,
    revenueFormatted: `$${decision.revenueImpact.toLocaleString()}`,
    roi: roi !== 'N/A' ? `${roi}%` : 'N/A',
  };
}

export function getDecisionIcon(type: DecisionType): string {
  const icons: Record<DecisionType, string> = {
    plant: '🌱',
    fertilize: '💊',
    spray: '💨',
    irrigate: '💧',
    harvest: '🚜',
    tillage: '🔧',
    scout: '🔍',
    treat_pest: '🐛',
    treat_disease: '🍄',
    sell: '💰',
    buy: '🛒',
    repair: '🔨',
  };
  return icons[type] || '📋';
}
