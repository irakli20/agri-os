import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import type { Field } from '@/lib/mock-data';
import {
  PEST_DATABASE,
  DISEASE_DATABASE,
  TREATMENT_OPTIONS,
  calculateDiseaseTriangle,
  calculateEconomicThreshold,
} from '@/lib/pest-disease-store';

type PressureLevel = 'none' | 'low' | 'medium' | 'high' | 'severe';
type Urgency = 'low' | 'medium' | 'high' | 'critical';
type RecommendationMethod = 'chemical' | 'biological' | 'cultural' | 'physical';
type EnvironmentalImpact = 'low' | 'medium' | 'high';

export interface ThresholdEvidence {
  metric: 'economic_threshold' | 'disease_outbreak_probability';
  currentLevel: number;
  threshold: number;
  thresholdBreached: boolean;
  treatmentJustified: boolean;
  damageEstimatePerAcre: number;
  netBenefitPerAcre: number;
}

export interface TreatmentProductOption {
  name: string;
  activeIngredient: string;
  rate: string;
  cost: number;
  efficacy: number;
  resistanceRisk: 'low' | 'medium' | 'high';
}

export interface AgronomicTreatmentRecommendation {
  id: string;
  fieldId: string;
  fieldName: string;
  problemId: string;
  problemType: 'pest' | 'disease' | 'weed';
  urgency: Urgency;
  method: RecommendationMethod;
  confidenceScore: number;
  impactScore: number;
  expectedCost: number;
  expectedYieldProtection: number;
  estimatedLossAvoided: number;
  environmentalImpact: EnvironmentalImpact;
  threshold: ThresholdEvidence;
  products: TreatmentProductOption[];
  timing: string;
  conditions: string;
  rationale: string[];
}

export interface AgronomicPestObservation {
  id: string;
  fieldId: string;
  fieldName: string;
  pestId: string;
  pestName: string;
  pressureLevel: PressureLevel;
  affectedArea: number;
  population: number;
  economicThreshold: number;
  thresholdBreached: boolean;
  treatmentJustified: boolean;
  treatmentStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  detectedDate: string;
  lastScouted: string;
  notes?: string;
}

export interface AgronomicDiseaseObservation {
  id: string;
  fieldId: string;
  fieldName: string;
  diseaseId: string;
  diseaseName: string;
  diseaseType: 'fungal' | 'bacterial' | 'viral' | 'oomycete';
  pressureLevel: PressureLevel;
  affectedArea: number;
  weatherFavorability: number;
  spreadRisk: 'low' | 'medium' | 'high';
  treatmentStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  symptoms: string[];
}

export interface AgronomicWeedObservation {
  id: string;
  fieldId: string;
  fieldName: string;
  weedType: 'broadleaf' | 'grass' | 'sedge';
  weedSpecies: string;
  pressureLevel: PressureLevel;
  coverage: number;
  growthStage: 'seedling' | 'vegetative' | 'flowering' | 'seeding';
  competitionImpact: number;
  resistanceProfile: string[];
  treatmentStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
}

export interface AgronomicRegionalAlert {
  id: string;
  type: 'pest' | 'disease';
  name: string;
  region: string;
  severity: 'watch' | 'warning' | 'outbreak';
  radius: number;
  reportedCases: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
  affectedCrops: string[];
  recommendations: string[];
}

export interface AgronomyIntelligenceReport {
  generatedAt: string;
  seasonContext: {
    season: string;
    week: number;
    year: number;
  };
  summary: {
    fieldsAnalyzed: number;
    pestsDetected: number;
    diseasesDetected: number;
    weedsDetected: number;
    thresholdsEvaluated: number;
    thresholdsBreached: number;
    treatmentsJustified: number;
    avgConfidenceScore: number;
    avgImpactScore: number;
    criticalRecommendations: number;
  };
  pests: AgronomicPestObservation[];
  diseases: AgronomicDiseaseObservation[];
  weeds: AgronomicWeedObservation[];
  recommendations: AgronomicTreatmentRecommendation[];
  alerts: AgronomicRegionalAlert[];
}

interface CropEconomics {
  cropValue: number;
  expectedYield: number;
}

const CROP_ECONOMICS: Record<string, CropEconomics> = {
  lettuce: { cropValue: 12.5, expectedYield: 420 },
  broccoli: { cropValue: 14, expectedYield: 185 },
  strawberries: { cropValue: 22, expectedYield: 135 },
  cauliflower: { cropValue: 16, expectedYield: 210 },
  spinach: { cropValue: 9.8, expectedYield: 310 },
  corn: { cropValue: 5.2, expectedYield: 182 },
  soybeans: { cropValue: 12.2, expectedYield: 56 },
  wheat: { cropValue: 6.9, expectedYield: 74 },
  tomatoes: { cropValue: 17, expectedYield: 95 },
  potatoes: { cropValue: 9.4, expectedYield: 390 },
  cotton: { cropValue: 0.92, expectedYield: 1120 },
  canola: { cropValue: 10.4, expectedYield: 52 },
};

function round(value: number, places = 2): number {
  const factor = Math.pow(10, places);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hashToUnit(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

function normalizeCrop(crop?: string): string {
  return (crop || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function mapGrowthStage(field: Field): 'germination' | 'seedling' | 'vegetative' | 'reproductive' | 'grain_filling' | 'maturity' | 'senescence' {
  const stage = String(field.cropStage || '').toLowerCase();
  if (stage === 'seeded') return 'germination';
  if (stage === 'germination') return 'seedling';
  if (stage === 'vegetative') return 'vegetative';
  if (stage === 'flowering') return 'reproductive';
  if (stage === 'ripening') return 'grain_filling';
  if (stage === 'harvest_ready') return 'maturity';
  return 'vegetative';
}

function derivePressureLevel(ratio: number): PressureLevel {
  if (ratio >= 1.6) return 'severe';
  if (ratio >= 1.2) return 'high';
  if (ratio >= 0.75) return 'medium';
  if (ratio > 0.35) return 'low';
  return 'none';
}

function deriveUrgency(ratio: number, breached: boolean, justified: boolean): Urgency {
  if (breached && justified && ratio >= 1.45) return 'critical';
  if (breached && justified) return 'high';
  if (breached) return 'medium';
  if (ratio >= 0.75) return 'medium';
  return 'low';
}

function mapEnvironmentalImpact(value?: string): EnvironmentalImpact {
  if (value === 'high') return 'high';
  if (value === 'medium') return 'medium';
  return 'low';
}

function scoreTreatmentOption(option: any): number {
  const efficacyScore = Number(option.effectiveness || 0) * 0.62;
  const costPenalty = Number(option.costPerAcre || 0) * 0.28;
  const resistancePenalty = option.resistanceRisk === 'high' ? 10 : option.resistanceRisk === 'medium' ? 5 : 2;
  const beneficialPenalty = option.beneficialInsectImpact === 'high'
    ? 9
    : option.beneficialInsectImpact === 'medium' ? 4 : 1;
  const organicBonus = option.organicApproved ? 4 : 0;
  return efficacyScore - costPenalty - resistancePenalty - beneficialPenalty + organicBonus;
}

function resolveCropEconomics(crop: string): CropEconomics {
  return CROP_ECONOMICS[crop] || { cropValue: 10, expectedYield: 180 };
}

function deriveFieldRisk(field: Field): number {
  const healthRisk = field.healthStatus === 'critical'
    ? 1.1
    : field.healthStatus === 'attention'
      ? 0.82
      : field.healthStatus === 'good' ? 0.58 : 0.35;
  const ndviRisk = clamp((0.76 - Number(field.ndviScore || 0.62)) / 0.36, 0, 1.15);
  const weedRisk = field.weedPressure === 'high'
    ? 0.45
    : field.weedPressure === 'medium'
      ? 0.28
      : field.weedPressure === 'low' ? 0.12 : 0;
  const protectionRisk = field.inputStatus?.needsProtection ? 0.25 : 0;
  return clamp(healthRisk + ndviRisk + weedRisk + protectionRisk, 0.35, 1.95);
}

function getWeatherContext() {
  const weather = useGameStore.getState().weeklyWeather;
  const humidity = clamp(48 + weather.precipitationChance * 0.45 + (weather.fieldworkOpen ? -4 : 6), 35, 98);
  const temperature = clamp(58 + (weather.fieldworkOpen ? 8 : 2) + (weather.harvestOpen ? 3 : 0), 38, 95);
  const base = {
    temperature,
    humidity,
    windSpeed: round(weather.windMph * 1.61, 1),
    windDirection: 'W',
    precipitation: round((weather.precipitationChance / 100) * 0.75, 2),
    cloudCover: clamp(round(weather.precipitationChance * 0.8), 10, 100),
    uvIndex: weather.fieldworkOpen ? 7 : 4,
    soilTemperature: round(temperature - 3, 1),
    pressure: 1012,
    visibility: 10,
  };

  const history = [0, 1, 2].map((offset) => ({
    ...base,
    temperature: round(base.temperature - offset * 1.2, 1),
    humidity: clamp(base.humidity + offset * 2, 30, 100),
  }));

  return {
    weather,
    current: base,
    history,
  };
}

function selectFieldSet(fieldId?: string): Field[] {
  const fieldStore = useFieldStore.getState() as any;
  const merged = new Map<string, Field>();
  for (const field of [...(fieldStore.fields || []), ...(fieldStore.gameFields || [])]) {
    merged.set(field.id, field as Field);
  }
  const fields = Array.from(merged.values());
  return fieldId ? fields.filter((field) => field.id === fieldId) : fields;
}

export function generateAgronomyIntelligenceReport(opts?: { fieldId?: string }): AgronomyIntelligenceReport {
  const fields = selectFieldSet(opts?.fieldId);
  const weatherContext = getWeatherContext();
  const now = new Date();
  const pests: AgronomicPestObservation[] = [];
  const diseases: AgronomicDiseaseObservation[] = [];
  const weeds: AgronomicWeedObservation[] = [];
  const recommendations: AgronomicTreatmentRecommendation[] = [];

  for (const field of fields) {
    const crop = normalizeCrop(field.crop);
    const growthStage = mapGrowthStage(field);
    const economics = resolveCropEconomics(crop);
    const risk = deriveFieldRisk(field);
    const acres = Math.max(1, Number(field.acres || 1));

    const hostPests = (Object.values(PEST_DATABASE) as any[])
      .filter((pest) => (pest.hostCrops || []).includes(crop))
      .sort((a, b) => {
        const scoreA = hashToUnit(`${field.id}:${a.id}`) + risk;
        const scoreB = hashToUnit(`${field.id}:${b.id}`) + risk;
        return scoreB - scoreA;
      })
      .slice(0, risk > 1.2 ? 3 : 2);

    for (const pest of hostPests) {
      const thresholdBase = Number(
        pest.economicThreshold?.countPerPlant ||
        pest.economicThreshold?.percentInfestation ||
        pest.economicThreshold?.defoliationPercent ||
        10
      );
      const multiplier = clamp(
        0.54 + risk * 0.62 + hashToUnit(`${field.id}:${pest.id}:pop`) * 0.75,
        0.45,
        2.4
      );
      const population = round(thresholdBase * multiplier, 2);
      const candidateOptions = (TREATMENT_OPTIONS as any[])
        .filter((option) => (option.targetPests || []).includes(pest.id))
        .sort((a, b) => scoreTreatmentOption(b) - scoreTreatmentOption(a));
      const baselineControlCost = candidateOptions.length > 0
        ? Number(candidateOptions[0].costPerAcre ?? 35)
        : 35;
      const thresholdResult = calculateEconomicThreshold(
        pest,
        population,
        economics.cropValue,
        economics.expectedYield,
        baselineControlCost,
        growthStage as any
      );
      const ratio = thresholdResult.threshold > 0 ? population / thresholdResult.threshold : 0;
      const pressureLevel = derivePressureLevel(ratio);
      const thresholdUnit = pest.economicThreshold?.countPerPlant ? 'plant' : '%';
      const affectedArea = round(acres * clamp(0.15 + ratio * 0.26, 0.12, 0.92), 1);
      let treatmentJustified = Boolean(thresholdResult.treatmentJustified);
      let recommendationAction = thresholdResult.recommendedAction;

      if (candidateOptions.length > 0) {
        const products: TreatmentProductOption[] = candidateOptions.slice(0, 3).map((option) => ({
          name: option.name,
          activeIngredient: option.activeIngredient || 'Multi-factor approach',
          rate: option.applicationRate || 'Per label',
          cost: round(Number(option.costPerAcre || 0), 2),
          efficacy: round(Number(option.effectiveness || 0), 1),
          resistanceRisk: option.resistanceRisk || 'low',
        }));
        const primary = candidateOptions[0];
        const expectedYieldProtection = round(
          clamp((Number(primary.effectiveness || 0) * 0.72) + (thresholdResult.thresholdBreached ? 16 : 8), 18, 95),
          1
        );
        const expectedCostPerAcre = Number(primary.costPerAcre ?? baselineControlCost);
        const expectedLossAvoidedPerAcre = Number(thresholdResult.damageEstimate || 0) * clamp(expectedYieldProtection / 100, 0.25, 0.95);
        const netBenefitPerAcre = expectedLossAvoidedPerAcre - expectedCostPerAcre;
        treatmentJustified = Boolean(thresholdResult.thresholdBreached && netBenefitPerAcre > 5);
        recommendationAction = treatmentJustified
          ? `Treat immediately - ${pest.name} at ${population}/${thresholdUnit} exceeds threshold of ${round(thresholdResult.threshold, 1)}`
          : thresholdResult.thresholdBreached
            ? `Threshold breached but treatment not economically justified (net benefit $${round(netBenefitPerAcre, 2).toFixed(2)}/acre)`
            : 'No treatment needed';
        const confidenceScore = round(
          clamp(
            32 +
              clamp(ratio * 28, 0, 34) +
              (treatmentJustified ? 18 : 7) +
              (Number(primary.effectiveness || 0) * 0.22),
            30,
            98
          ),
          1
        );
        const impactScore = round(
          clamp(
            (expectedYieldProtection * 0.58) +
              clamp((netBenefitPerAcre / Math.max(1, expectedCostPerAcre)) * 18, -18, 26) +
              (deriveUrgency(ratio, thresholdResult.thresholdBreached, treatmentJustified) === 'critical' ? 16 : 8),
            12,
            99
          ),
          1
        );
        const urgency = deriveUrgency(ratio, thresholdResult.thresholdBreached, treatmentJustified);

        recommendations.push({
          id: `rec-pest-${field.id}-${pest.id}`,
          fieldId: field.id,
          fieldName: field.name,
          problemId: pest.id,
          problemType: 'pest',
          urgency,
          method: (primary.type || 'chemical') as RecommendationMethod,
          confidenceScore,
          impactScore,
          expectedCost: round(expectedCostPerAcre * affectedArea, 2),
          expectedYieldProtection,
          estimatedLossAvoided: round(expectedLossAvoidedPerAcre * affectedArea, 2),
          environmentalImpact: mapEnvironmentalImpact(primary.beneficialInsectImpact),
          threshold: {
            metric: 'economic_threshold',
            currentLevel: round(population, 2),
            threshold: round(thresholdResult.threshold, 2),
            thresholdBreached: Boolean(thresholdResult.thresholdBreached),
            treatmentJustified,
            damageEstimatePerAcre: round(Number(thresholdResult.damageEstimate || 0), 2),
            netBenefitPerAcre: round(netBenefitPerAcre, 2),
          },
          products,
          timing: thresholdResult.thresholdBreached
            ? 'Apply in next available spray window (within 24-48h).'
            : 'Monitor and re-scout within 3 days before application.',
          conditions: `Prefer wind < 15 mph and rain chance < 40%. Current week: ${weatherContext.weather.precipitationChance}% rain chance, ${weatherContext.weather.windMph} mph wind.`,
          rationale: [
            recommendationAction,
            `Population/threshold ratio: ${round(ratio, 2)}x.`,
            `Top product efficacy: ${round(Number(primary.effectiveness || 0), 1)}%.`,
          ],
        });
      }

      pests.push({
        id: `pest-obs-${field.id}-${pest.id}`,
        fieldId: field.id,
        fieldName: field.name,
        pestId: pest.id,
        pestName: pest.name,
        pressureLevel,
        affectedArea,
        population: round(population, 2),
        economicThreshold: round(thresholdResult.threshold, 2),
        thresholdBreached: Boolean(thresholdResult.thresholdBreached),
        treatmentJustified,
        treatmentStatus: 'pending',
        detectedDate: new Date(now.getTime() - Math.floor(hashToUnit(pest.id) * 4) * 24 * 60 * 60 * 1000).toISOString(),
        lastScouted: new Date(now.getTime() - Math.floor(hashToUnit(`${field.id}:${pest.id}`) * 3) * 24 * 60 * 60 * 1000).toISOString(),
        notes: recommendationAction,
      });
    }

    const hostDiseases = (Object.values(DISEASE_DATABASE) as any[])
      .filter((disease) => (disease.hostCrops || []).includes(crop))
      .sort((a, b) => {
        const scoreA = hashToUnit(`${field.id}:${a.id}:d`) + (a.susceptibleStages?.includes(growthStage) ? 0.5 : 0);
        const scoreB = hashToUnit(`${field.id}:${b.id}:d`) + (b.susceptibleStages?.includes(growthStage) ? 0.5 : 0);
        return scoreB - scoreA;
      })
      .slice(0, risk > 1.2 ? 3 : 2);

    for (const disease of hostDiseases) {
      const assessment = calculateDiseaseTriangle(
        disease,
        crop as any,
        growthStage as any,
        weatherContext.current as any,
        weatherContext.history as any,
        { yearsInField: Math.floor(hashToUnit(`${field.id}:years`) * 3), previousOutbreaks: Math.floor(hashToUnit(`${field.id}:${disease.id}:history`) * 4) }
      );
      if ((assessment.outbreakProbability || 0) < 18 && risk < 1.2) {
        continue;
      }

      const severityScore = clamp(
        round((assessment.outbreakProbability || 0) * 0.88 + risk * 14, 1),
        5,
        98
      );
      const pressureLevel = derivePressureLevel(severityScore / 60);
      const spreadRisk: 'low' | 'medium' | 'high' = severityScore >= 68 ? 'high' : severityScore >= 42 ? 'medium' : 'low';
      const affectedArea = round(acres * clamp((severityScore / 100) * 0.92, 0.08, 0.95), 1);

      diseases.push({
        id: `disease-obs-${field.id}-${disease.id}`,
        fieldId: field.id,
        fieldName: field.name,
        diseaseId: disease.id,
        diseaseName: disease.name,
        diseaseType: disease.type,
        pressureLevel,
        affectedArea,
        weatherFavorability: round(assessment.environmentalFavorability || 0, 1),
        spreadRisk,
        treatmentStatus: 'pending',
        symptoms: (disease.symptoms || []).slice(0, 4),
      });

      const diseaseOptions = (TREATMENT_OPTIONS as any[])
        .filter((option) => (option.targetDiseases || []).includes(disease.id))
        .sort((a, b) => scoreTreatmentOption(b) - scoreTreatmentOption(a));
      if (diseaseOptions.length === 0) continue;

      const primary = diseaseOptions[0];
      const products: TreatmentProductOption[] = diseaseOptions.slice(0, 3).map((option) => ({
        name: option.name,
        activeIngredient: option.activeIngredient || 'Integrated approach',
        rate: option.applicationRate || 'Per label',
        cost: round(Number(option.costPerAcre || 0), 2),
        efficacy: round(Number(option.effectiveness || 0), 1),
        resistanceRisk: option.resistanceRisk || 'low',
      }));
      const expectedYieldProtection = round(
        clamp((Number(primary.effectiveness || 0) * 0.63) + ((assessment.outbreakProbability || 0) * 0.18), 16, 92),
        1
      );
      const expectedCostPerAcre = Number(primary.costPerAcre ?? 30);
      const diseaseDamageEstimatePerAcre = economics.cropValue * economics.expectedYield * (severityScore / 100) * 0.06;
      const expectedLossAvoidedPerAcre = diseaseDamageEstimatePerAcre * clamp(expectedYieldProtection / 100, 0.28, 0.92);
      const netBenefitPerAcre = expectedLossAvoidedPerAcre - expectedCostPerAcre;
      const urgency: Urgency = (assessment.outbreakProbability || 0) >= 72
        ? 'critical'
        : (assessment.outbreakProbability || 0) >= 55
          ? 'high'
          : (assessment.outbreakProbability || 0) >= 35 ? 'medium' : 'low';
      const confidenceScore = round(
        clamp(
          30 +
            (assessment.outbreakProbability || 0) * 0.36 +
            Number(primary.effectiveness || 0) * 0.24,
          28,
          97
        ),
        1
      );
      const impactScore = round(
        clamp(
          expectedYieldProtection * 0.54 +
            clamp((netBenefitPerAcre / Math.max(1, expectedCostPerAcre)) * 16, -15, 24) +
            (urgency === 'critical' ? 18 : urgency === 'high' ? 12 : 6),
          14,
          99
        ),
        1
      );

      recommendations.push({
        id: `rec-disease-${field.id}-${disease.id}`,
        fieldId: field.id,
        fieldName: field.name,
        problemId: disease.id,
        problemType: 'disease',
        urgency,
        method: (primary.type || 'chemical') as RecommendationMethod,
        confidenceScore,
        impactScore,
        expectedCost: round(expectedCostPerAcre * affectedArea, 2),
        expectedYieldProtection,
        estimatedLossAvoided: round(expectedLossAvoidedPerAcre * affectedArea, 2),
        environmentalImpact: mapEnvironmentalImpact(primary.beneficialInsectImpact),
        threshold: {
          metric: 'disease_outbreak_probability',
          currentLevel: round(assessment.outbreakProbability || 0, 1),
          threshold: 45,
          thresholdBreached: (assessment.outbreakProbability || 0) >= 45,
          treatmentJustified: netBenefitPerAcre > 0,
          damageEstimatePerAcre: round(diseaseDamageEstimatePerAcre, 2),
          netBenefitPerAcre: round(netBenefitPerAcre, 2),
        },
        products,
        timing: urgency === 'critical'
          ? 'Apply protectant/curative program within 24h.'
          : 'Apply within next suitable 48-72h window and repeat per label.',
        conditions: `Disease spread risk rises above humidity ${round(weatherContext.current.humidity, 0)}% and rain probability ${weatherContext.weather.precipitationChance}%.`,
        rationale: [
          `Outbreak probability: ${round(assessment.outbreakProbability || 0, 1)}%.`,
          `Environmental favorability: ${round(assessment.environmentalFavorability || 0, 1)}%.`,
          `Primary treatment efficacy: ${round(Number(primary.effectiveness || 0), 1)}%.`,
        ],
      });
    }

    if (field.weedPressure && field.weedPressure !== 'none') {
      const pressure = field.weedPressure as 'low' | 'medium' | 'high';
      const coverage = round(
        pressure === 'high' ? clamp(30 + risk * 14, 24, 75) : pressure === 'medium' ? clamp(16 + risk * 10, 12, 40) : clamp(6 + risk * 6, 4, 18),
        1
      );
      const competitionImpact = round(clamp(coverage * 0.85, 8, 72), 1);
      weeds.push({
        id: `weed-obs-${field.id}`,
        fieldId: field.id,
        fieldName: field.name,
        weedType: pressure === 'high' ? 'broadleaf' : pressure === 'medium' ? 'grass' : 'sedge',
        weedSpecies: pressure === 'high' ? 'Palmer amaranth' : pressure === 'medium' ? 'Barnyardgrass' : 'Nutsedge',
        pressureLevel: pressure,
        coverage,
        growthStage: coverage > 28 ? 'flowering' : coverage > 16 ? 'vegetative' : 'seedling',
        competitionImpact,
        resistanceProfile: pressure === 'high' ? ['ALS inhibitors', 'glyphosate'] : pressure === 'medium' ? ['glyphosate'] : [],
        treatmentStatus: 'pending',
      });
    }
  }

  recommendations.sort((a, b) => {
    if (b.impactScore !== a.impactScore) return b.impactScore - a.impactScore;
    return b.confidenceScore - a.confidenceScore;
  });

  const topPestSignals = pests
    .filter((pest) => pest.thresholdBreached)
    .slice(0, 2)
    .map((pest, index) => ({
      id: `alert-pest-${index}-${pest.pestId}`,
      type: 'pest' as const,
      name: pest.pestName,
      region: 'Farm perimeter zone',
      severity: (pest.pressureLevel === 'severe' ? 'outbreak' : pest.pressureLevel === 'high' ? 'warning' : 'watch') as AgronomicRegionalAlert['severity'],
      radius: 12 + index * 7,
      reportedCases: Math.max(2, Math.round(pest.population / 8)),
      trend: (pest.pressureLevel === 'severe' ? 'increasing' : 'stable') as AgronomicRegionalAlert['trend'],
      description: `${pest.pestName} pressure is above economic threshold near ${pest.fieldName}.`,
      affectedCrops: [pest.fieldName],
      recommendations: [
        'Prioritize near-term scouting pass to confirm spread boundary.',
        'Apply threshold-approved treatment in next spray window.',
      ],
    }));
  const topDiseaseSignals = diseases
    .filter((disease) => disease.weatherFavorability >= 50)
    .slice(0, 2)
    .map((disease, index) => ({
      id: `alert-disease-${index}-${disease.diseaseId}`,
      type: 'disease' as const,
      name: disease.diseaseName,
      region: 'Local microclimate cluster',
      severity: (disease.spreadRisk === 'high' ? 'outbreak' : disease.spreadRisk === 'medium' ? 'warning' : 'watch') as AgronomicRegionalAlert['severity'],
      radius: 10 + index * 6,
      reportedCases: Math.max(1, Math.round(disease.weatherFavorability / 14)),
      trend: (disease.spreadRisk === 'high' ? 'increasing' : 'stable') as AgronomicRegionalAlert['trend'],
      description: `${disease.diseaseName} conditions are favorable and spread risk is ${disease.spreadRisk}.`,
      affectedCrops: [disease.fieldName],
      recommendations: [
        'Raise scouting frequency until weather favorability declines.',
        'Use preventative chemistry rotation to reduce resistance pressure.',
      ],
    }));

  const avgConfidenceScore = recommendations.length > 0
    ? recommendations.reduce((sum, rec) => sum + rec.confidenceScore, 0) / recommendations.length
    : 0;
  const avgImpactScore = recommendations.length > 0
    ? recommendations.reduce((sum, rec) => sum + rec.impactScore, 0) / recommendations.length
    : 0;

  const gameStore = useGameStore.getState();
  return {
    generatedAt: new Date().toISOString(),
    seasonContext: {
      season: gameStore.gameTime.season,
      week: gameStore.gameTime.week,
      year: gameStore.gameTime.year,
    },
    summary: {
      fieldsAnalyzed: fields.length,
      pestsDetected: pests.length,
      diseasesDetected: diseases.length,
      weedsDetected: weeds.length,
      thresholdsEvaluated: pests.length,
      thresholdsBreached: pests.filter((pest) => pest.thresholdBreached).length,
      treatmentsJustified: pests.filter((pest) => pest.treatmentJustified).length,
      avgConfidenceScore: round(avgConfidenceScore, 1),
      avgImpactScore: round(avgImpactScore, 1),
      criticalRecommendations: recommendations.filter((rec) => rec.urgency === 'critical').length,
    },
    pests,
    diseases,
    weeds,
    recommendations,
    alerts: [...topPestSignals, ...topDiseaseSignals].slice(0, 4),
  };
}
