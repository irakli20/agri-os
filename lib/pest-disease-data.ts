// @ts-nocheck
/**
 * Comprehensive Pest & Disease System for Agri-OS
 * 
 * Features:
 * - Disease triangle model (host + pathogen + environment)
 * - Weather-triggered disease outbreaks
 * - Pest lifecycle modeling (egg → larva → pupa → adult)
 * - Economic thresholds for treatment
 * - Resistance management (rotate chemical modes of action)
 * - Beneficial insects that suppress pests
 */

import type { 
  CropType, 
  GrowthStage, 
  PestProfile, 
  DiseaseProfile, 
  PestInfestation,
  DiseaseInfection,
  WeatherConditions,
  TreatmentRecord,
  PestLifecycle,
  WeatherTrigger
} from '@/types';

// ============================================================================
// DISEASE TRIANGLE MODEL
// ============================================================================

export interface DiseaseTriangle {
  host: {
    cropType: CropType;
    growthStage: GrowthStage;
    susceptibility: number; // 0-100
    susceptible: boolean;
  };
  pathogen: {
    present: boolean;
    inoculumLevel: number; // 0-100, spore count/survival structures
    virulence: number; // 0-100
  };
  environment: {
    temperature: number; // current temp in °F
    humidity: number; // current humidity %
    leafWetness: number; // hours of leaf wetness
    precipitation: boolean;
    favorable: boolean;
    favorabilityScore: number; // 0-100
  };
}

export interface DiseaseTriangleAnalysis {
  diseaseRisk: number; // 0-100
  outbreakProbability: number; // 0-100
  limitingFactor: 'host' | 'pathogen' | 'environment' | 'none';
  recommendations: string[];
}

/**
 * Analyze disease triangle to determine infection risk
 */
export function analyzeDiseaseTriangle(
  triangle: DiseaseTriangle,
  diseaseRequirements: DiseaseEnvironmentRequirements
): DiseaseTriangleAnalysis {
  const { host, pathogen, environment } = triangle;
  
  // All three components must be present for disease
  if (!host.susceptible || !pathogen.present || !environment.favorable) {
    const limitingFactor = !host.susceptible ? 'host' 
      : !pathogen.present ? 'pathogen' 
      : 'environment';
    
    return {
      diseaseRisk: 0,
      outbreakProbability: 0,
      limitingFactor,
      recommendations: generateRecommendations(limitingFactor, diseaseRequirements)
    };
  }
  
  // Calculate risk based on all three factors
  const hostFactor = host.susceptibility / 100;
  const pathogenFactor = (pathogen.inoculumLevel * pathogen.virulence) / 10000;
  const environmentFactor = environment.favorabilityScore / 100;
  
  // Disease triangle: Risk increases exponentially when all factors align
  const diseaseRisk = Math.min(100, 
    Math.pow(hostFactor * pathogenFactor * environmentFactor, 1/3) * 100
  );
  
  // Outbreak probability increases with sustained favorable conditions
  const outbreakProbability = Math.min(100,
    diseaseRisk * (1 + environmentFactor * 0.5)
  );
  
  return {
    diseaseRisk,
    outbreakProbability,
    limitingFactor: 'none',
    recommendations: generateRecommendations('none', diseaseRequirements, diseaseRisk)
  };
}

function generateRecommendations(
  limitingFactor: string, 
  requirements: DiseaseEnvironmentRequirements,
  currentRisk?: number
): string[] {
  const recommendations: string[] = [];
  
  switch (limitingFactor) {
    case 'host':
      recommendations.push('Host not susceptible at current growth stage');
      break;
    case 'pathogen':
      recommendations.push('No pathogen detected - maintain scouting');
      break;
    case 'environment':
      recommendations.push(`Monitor conditions - disease requires: ${requirements.optimalTemp.min}-${requirements.optimalTemp.max}°F, >${requirements.minHumidity}% humidity`);
      break;
    case 'none':
      if (currentRisk && currentRisk > 70) {
        recommendations.push('HIGH RISK: Consider preventive fungicide application');
      } else if (currentRisk && currentRisk > 40) {
        recommendations.push('MODERATE RISK: Increase scouting frequency');
      }
      break;
  }
  
  return recommendations;
}

// ============================================================================
// WEATHER-TRIGGERED DISEASE OUTBREAKS
// ============================================================================

export interface DiseaseEnvironmentRequirements {
  optimalTemp: { min: number; max: number }; // °F
  minHumidity: number; // %
  minLeafWetness: number; // hours
  requiresPrecipitation: boolean;
  precipitationEffect: 'triggers' | 'spreads' | 'inhibits' | 'none';
  durationForOutbreak: number; // days of favorable conditions
}

export interface WeatherDiseaseIndex {
  date: Date;
  temperatureStress: number; // 0-100
  humidityStress: number; // 0-100
  leafWetnessStress: number; // 0-100
  combinedIndex: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  diseasePressure: Record<string, number>; // disease ID -> pressure score
}

/**
 * Calculate disease weather index based on conditions
 * Fungal diseases: rain + high humidity = high risk
 * Bacterial diseases: warm + wet = high risk
 * Viral diseases: often vector-dependent
 */
export function calculateDiseaseWeatherIndex(
  weather: WeatherConditions,
  historicalConditions: WeatherConditions[],
  diseaseType: 'fungal' | 'bacterial' | 'viral' | 'oomycete'
): WeatherDiseaseIndex {
  const diseasePressure: Record<string, number> = {};
  
  // Calculate stress factors based on disease type
  let temperatureStress = 0;
  let humidityStress = 0;
  let leafWetnessStress = 0;
  
  switch (diseaseType) {
    case 'fungal':
      // Fungal diseases favor 60-80°F, high humidity, leaf wetness
      temperatureStress = calculateTempStress(weather.temperature, 60, 80);
      humidityStress = weather.humidity > 85 ? (weather.humidity - 85) * 6.67 : 0;
      leafWetnessStress = estimateLeafWetness(weather, historicalConditions);
      break;
      
    case 'oomycete':
      // Oomycetes (like Phytophthora) favor cool, wet conditions
      temperatureStress = calculateTempStress(weather.temperature, 50, 75);
      humidityStress = weather.humidity > 90 ? (weather.humidity - 90) * 10 : 0;
      leafWetnessStress = estimateLeafWetness(weather, historicalConditions) * 1.2;
      break;
      
    case 'bacterial':
      // Bacterial diseases favor warm, wet conditions
      temperatureStress = calculateTempStress(weather.temperature, 75, 90);
      humidityStress = weather.humidity > 80 ? (weather.humidity - 80) * 5 : 0;
      leafWetnessStress = estimateLeafWetness(weather, historicalConditions) * 0.8;
      break;
      
    case 'viral':
      // Viral diseases often spread by vectors - temperature affects vectors
      temperatureStress = calculateTempStress(weather.temperature, 70, 85);
      humidityStress = weather.humidity > 60 ? 30 : 50; // Moderate humidity favors aphids
      leafWetnessStress = 0; // Less directly affected
      break;
  }
  
  // Combine factors - fungal diseases are highly dependent on wetness
  let combinedIndex: number;
  if (diseaseType === 'fungal' || diseaseType === 'oomycete') {
    combinedIndex = (temperatureStress * 0.3 + humidityStress * 0.3 + leafWetnessStress * 0.4);
  } else {
    combinedIndex = (temperatureStress * 0.4 + humidityStress * 0.4 + leafWetnessStress * 0.2);
  }
  
  combinedIndex = Math.min(100, combinedIndex);
  
  // Calculate specific disease pressures
  DISEASE_PROFILES.forEach(disease => {
    if (disease.type === diseaseType) {
      diseasePressure[disease.id] = calculateDiseasePressure(disease, weather, historicalConditions);
    }
  });
  
  const riskLevel = combinedIndex < 25 ? 'low' 
    : combinedIndex < 50 ? 'moderate' 
    : combinedIndex < 75 ? 'high' 
    : 'severe';
  
  return {
    date: new Date(),
    temperatureStress,
    humidityStress,
    leafWetnessStress,
    combinedIndex,
    riskLevel,
    diseasePressure
  };
}

function calculateTempStress(temp: number, optimalMin: number, optimalMax: number): number {
  if (temp >= optimalMin && temp <= optimalMax) {
    return 100; // Optimal range
  } else if (temp < optimalMin) {
    return Math.max(0, 100 - (optimalMin - temp) * 5);
  } else {
    return Math.max(0, 100 - (temp - optimalMax) * 8);
  }
}

function estimateLeafWetness(
  current: WeatherConditions,
  historical: WeatherConditions[]
): number {
  // Leaf wetness from precipitation or high humidity + cool temps
  let wetnessHours = 0;
  
  if (current.precipitation > 0) {
    wetnessHours += 12; // Approximate drying time after rain
  }
  
  if (current.humidity > 90 && current.temperature < 70) {
    wetnessHours += 6; // Dew formation
  }
  
  // Consider recent history
  const recentPrecip = historical.slice(-3).some(w => w.precipitation > 0);
  if (recentPrecip && current.humidity > 75) {
    wetnessHours += 4;
  }
  
  return Math.min(100, wetnessHours * 4); // Scale to 0-100
}

function calculateDiseasePressure(
  disease: DiseaseProfile,
  weather: WeatherConditions,
  historical: WeatherConditions[]
): number {
  // Simplified pressure calculation based on disease requirements
  const reqs = disease.environmentalRequirements || DEFAULT_DISEASE_REQUIREMENTS[disease.type];
  if (!reqs) return 0;
  
  let pressure = 0;
  
  // Temperature match
  if (weather.temperature >= reqs.optimalTemp.min && weather.temperature <= reqs.optimalTemp.max) {
    pressure += 30;
  }
  
  // Humidity match
  if (weather.humidity >= reqs.minHumidity) {
    pressure += 25;
  }
  
  // Leaf wetness
  const wetness = estimateLeafWetness(weather, historical);
  if (wetness > 20) {
    pressure += 25;
  }
  
  // Precipitation effect
  if (weather.precipitation > 0 && reqs.requiresPrecipitation) {
    pressure += 20;
  }
  
  return Math.min(100, pressure);
}

// ============================================================================
// PEST LIFECYCLE MODELING
// ============================================================================

export interface PestLifecycleModel {
  pestId: string;
  currentStage: PestLifecycle;
  stageProgress: number; // 0-100 progress through current stage
  generation: number; // Which generation (1, 2, 3... per year)
  population: number; // per unit area
  eggs: number;
  larvae: number;
  pupae: number;
  adults: number;
  gddAccumulated: number; // Growing degree days for this pest
}

export interface PestLifecycleParameters {
  baseTemp: number; // °F - minimum temp for development
  upperTemp: number; // °F - maximum temp for development
  stageGDD: Record<PestLifecycle, number>; // GDD required for each stage
  generationsPerYear: number;
  overwinteringStage: PestLifecycle;
  mortalityRates: Record<PestLifecycle, number>; // daily mortality %
}

export const PEST_LIFECYCLE_PARAMS: Record<string, PestLifecycleParameters> = {
  aphids: {
    baseTemp: 45,
    upperTemp: 90,
    stageGDD: { egg: 100, larva: 150, pupa: 80, adult: 200 },
    generationsPerYear: 8,
    overwinteringStage: 'egg',
    mortalityRates: { egg: 2, larva: 5, pupa: 3, adult: 8 }
  },
  corn_rootworm: {
    baseTemp: 52,
    upperTemp: 95,
    stageGDD: { egg: 200, larva: 350, pupa: 150, adult: 100 },
    generationsPerYear: 1,
    overwinteringStage: 'egg',
    mortalityRates: { egg: 10, larva: 15, pupa: 5, adult: 20 }
  },
  soybean_podworm: {
    baseTemp: 55,
    upperTemp: 100,
    stageGDD: { egg: 80, larva: 300, pupa: 100, adult: 150 },
    generationsPerYear: 3,
    overwinteringStage: 'pupa',
    mortalityRates: { egg: 8, larva: 12, pupa: 6, adult: 15 }
  },
  spider_mites: {
    baseTemp: 50,
    upperTemp: 105,
    stageGDD: { egg: 120, larva: 100, pupa: 60, adult: 180 },
    generationsPerYear: 10,
    overwinteringStage: 'adult',
    mortalityRates: { egg: 5, larva: 10, pupa: 4, adult: 12 }
  },
  whiteflies: {
    baseTemp: 52,
    upperTemp: 95,
    stageGDD: { egg: 150, larva: 200, pupa: 100, adult: 250 },
    generationsPerYear: 6,
    overwinteringStage: 'larva',
    mortalityRates: { egg: 6, larva: 8, pupa: 5, adult: 10 }
  }
};

/**
 * Simulate pest lifecycle progression based on temperature
 */
export function simulatePestLifecycle(
  model: PestLifecycleModel,
  avgTemp: number,
  days: number
): PestLifecycleModel {
  const params = PEST_LIFECYCLE_PARAMS[model.pestId];
  if (!params) return model;
  
  const newModel = { ...model };
  
  // Calculate GDD accumulation
  const dailyGDD = Math.max(0, Math.min(avgTemp, params.upperTemp) - params.baseTemp);
  newModel.gddAccumulated += dailyGDD * days;
  
  // Progress through lifecycle stages
  let remainingGDD = newModel.gddAccumulated;
  const stages: PestLifecycle[] = ['egg', 'larva', 'pupa', 'adult'];
  let currentStageIndex = stages.indexOf(model.currentStage);
  
  for (let i = 0; i <= currentStageIndex; i++) {
    const stage = stages[i];
    const stageGDD = params.stageGDD[stage];
    
    if (remainingGDD >= stageGDD) {
      remainingGDD -= stageGDD;
      
      // Check for stage transition
      if (i === currentStageIndex && currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        newModel.currentStage = stages[currentStageIndex];
        newModel.stageProgress = 0;
        
        // Reproduction on adult emergence
        if (newModel.currentStage === 'adult') {
          const reproductionRate = getReproductionRate(model.pestId);
          newModel.eggs += Math.floor(newModel.adults * reproductionRate);
        }
      }
    } else {
      newModel.stageProgress = (remainingGDD / stageGDD) * 100;
      break;
    }
  }
  
  // Apply mortality
  const dailyMortality = params.mortalityRates[newModel.currentStage] / 100;
  const survivalRate = Math.pow(1 - dailyMortality, days);
  
  newModel.population = Math.floor(newModel.population * survivalRate);
  newModel.eggs = Math.floor(newModel.eggs * survivalRate);
  newModel.larvae = Math.floor(newModel.larvae * survivalRate);
  newModel.pupae = Math.floor(newModel.pupae * survivalRate);
  newModel.adults = Math.floor(newModel.adults * survivalRate);
  
  return newModel;
}

function getReproductionRate(pestId: string): number {
  const rates: Record<string, number> = {
    aphids: 50, // Aphids are prolific
    corn_rootworm: 200,
    soybean_podworm: 100,
    spider_mites: 20,
    whiteflies: 30
  };
  return rates[pestId] || 10;
}

// ============================================================================
// ECONOMIC THRESHOLDS
// ============================================================================

export interface EconomicThreshold {
  pestId: string;
  populationThreshold: number; // per plant or per unit area
  damagePerIndividual: number; // $ damage per pest
  treatmentCost: number; // $ per acre
  expectedControl: number; // % control achieved
  breakEvenPopulation: number; // calculated
}

export interface TreatmentDecision {
  shouldTreat: boolean;
  population: number;
  damageEstimate: number;
  treatmentCost: number;
  netBenefit: number;
  roi: number; // return on investment %
  urgency: 'immediate' | 'soon' | 'scout' | 'none';
  recommendedProduct?: string;
}

/**
 * Calculate economic threshold and treatment decision
 * Treatment justified when: Damage > Treatment Cost
 */
export function calculateEconomicThreshold(
  threshold: EconomicThreshold,
  currentPopulation: number,
  cropValue: number, // $ per acre expected revenue
  pestDamageRate: number // % yield loss per pest unit
): TreatmentDecision {
  // Calculate potential damage
  const damageEstimate = currentPopulation * pestDamageRate * cropValue;
  const treatmentCost = threshold.treatmentCost;
  
  // Calculate control effectiveness
  const controlValue = damageEstimate * (threshold.expectedControl / 100);
  
  // Net benefit of treatment
  const netBenefit = controlValue - treatmentCost;
  const roi = treatmentCost > 0 ? (netBenefit / treatmentCost) * 100 : 0;
  
  // Break-even population
  const breakEvenPop = treatmentCost / (pestDamageRate * cropValue * (threshold.expectedControl / 100));
  
  // Determine urgency
  let urgency: TreatmentDecision['urgency'] = 'none';
  if (currentPopulation > breakEvenPop * 2) {
    urgency = 'immediate';
  } else if (currentPopulation > breakEvenPop) {
    urgency = 'soon';
  } else if (currentPopulation > breakEvenPop * 0.5) {
    urgency = 'scout';
  }
  
  return {
    shouldTreat: netBenefit > 0,
    population: currentPopulation,
    damageEstimate,
    treatmentCost,
    netBenefit,
    roi,
    urgency,
    recommendedProduct: getRecommendedProduct(threshold.pestId)
  };
}

function getRecommendedProduct(pestId: string): string {
  const products: Record<string, string> = {
    aphids: 'Transform WG (sulfoxaflor)',
    corn_rootworm: 'Force 3G (tefluthrin)',
    soybean_podworm: 'Besiege (lambda-cyhalothrin + chlorantraniliprole)',
    spider_mites: 'Agri-Mek SC (abamectin)',
    whiteflies: 'Sivanto Prime (flupyradifurone)'
  };
  return products[pestId] || 'Consult local extension';
}

// ============================================================================
// RESISTANCE MANAGEMENT
// ============================================================================

export type ModeOfAction = 
  | '1A' | '1B' // Acetylcholinesterase inhibitors
  | '2A' | '2B' // GABA-gated chloride channel blockers
  | '3A' // Sodium channel modulators
  | '4A' | '4C' | '4D' // Nicotinic acetylcholine receptor agonists
  | '5' // Spinosyns
  | '6' // Avermectins
  | '9B' | '9C' | '9D' // Chordotonal organ TRPV channel modulators
  | '10A' // Juvenile hormone mimics
  | '11A' // Microbial disruptors
  | '15' // Inhibitors of chitin biosynthesis
  | '18' // Ecdysone receptor agonists
  | '22A' | '22B' // Voltage-dependent sodium channel blockers
  | '28' // Ryanodine receptor modulators
  | '29' // Chordotonal organ modulators
  | 'UN' | 'unknown';

export interface ChemicalApplication {
  date: Date;
  product: string;
  activeIngredient: string;
  modeOfAction: ModeOfAction;
  targetPest: string;
  fieldId: string;
}

export interface ResistanceProfile {
  pestId: string;
  resistanceHistory: Record<ModeOfAction, ResistanceLevel>;
  applicationsByMOA: Record<ModeOfAction, number>;
  lastApplication: Record<ModeOfAction, Date>;
}

export interface ResistanceLevel {
  level: 'susceptible' | 'low' | 'moderate' | 'high' | 'extreme';
  rfValue: number; // Resistance factor
  effectiveness: number; // 0-100% control still achieved
}

/**
 * Track and manage resistance development
 */
export function updateResistanceProfile(
  profile: ResistanceProfile,
  application: ChemicalApplication
): ResistanceProfile {
  const newProfile = { ...profile };
  const moa = application.modeOfAction;
  
  // Increment application count
  newProfile.applicationsByMOA[moa] = (newProfile.applicationsByMOA[moa] || 0) + 1;
  newProfile.lastApplication[moa] = application.date;
  
  // Calculate resistance development
  const applications = newProfile.applicationsByMOA[moa];
  const previousLevel = newProfile.resistanceHistory[moa];
  
  // Resistance increases with repeated use of same MOA
  let newLevel: ResistanceLevel['level'] = 'susceptible';
  let rfValue = 1;
  
  if (applications >= 20) {
    newLevel = 'extreme';
    rfValue = 100;
  } else if (applications >= 12) {
    newLevel = 'high';
    rfValue = 30;
  } else if (applications >= 6) {
    newLevel = 'moderate';
    rfValue = 10;
  } else if (applications >= 3) {
    newLevel = 'low';
    rfValue = 3;
  }
  
  // Calculate effectiveness based on resistance
  const effectiveness = Math.max(10, 100 - (applications * 5));
  
  newProfile.resistanceHistory[moa] = {
    level: newLevel,
    rfValue,
    effectiveness
  };
  
  return newProfile;
}

/**
 * Recommend rotation strategy based on resistance profile
 */
export function recommendRotationStrategy(
  profile: ResistanceProfile,
  targetPest: string
): {
  avoidMOAs: ModeOfAction[];
  recommendedMOAs: ModeOfAction[];
  strategy: string;
} {
  const avoidMOAs: ModeOfAction[] = [];
  const recommendedMOAs: ModeOfAction[] = [];
  
  // Identify high-resistance MOAs to avoid
  Object.entries(profile.resistanceHistory).forEach(([moa, level]) => {
    if (level.level === 'high' || level.level === 'extreme') {
      avoidMOAs.push(moa as ModeOfAction);
    } else if (level.level === 'susceptible' || level.level === 'low') {
      recommendedMOAs.push(moa as ModeOfAction);
    }
  });
  
  // Check for recent applications (within 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  Object.entries(profile.lastApplication).forEach(([moa, date]) => {
    if (date > thirtyDaysAgo) {
      // Don't use same MOA within 30 days
      if (!avoidMOAs.includes(moa as ModeOfAction)) {
        avoidMOAs.push(moa as ModeOfAction);
      }
    }
  });
  
  let strategy = 'Rotate modes of action between applications.';
  if (avoidMOAs.length > 3) {
    strategy = 'CRITICAL: Multiple resistance detected. Consider non-chemical controls.';
  } else if (recommendedMOAs.length < 2) {
    strategy = 'WARNING: Limited effective chemistries remaining. Integrate biological and cultural controls.';
  }
  
  return { avoidMOAs, recommendedMOAs, strategy };
}

// ============================================================================
// BENEFICIAL INSECTS
// ============================================================================

export interface BeneficialInsect {
  id: string;
  name: string;
  commonName: string;
  type: 'predator' | 'parasitoid' | 'pollinator';
  targetPests: string[];
  efficacy: number; // 0-100 pest suppression capability
  establishmentRate: number; // 0-100 success of introduction
  population: number; // per acre
  habitatRequirements: string[];
  floweringPlants: string[]; // Plants that support population
  gddActivityStart: number; // GDD threshold for activity
  gddActivityEnd: number;
}

export interface BiologicalControl {
  beneficialId: string;
  targetPestId: string;
  suppressionRate: number; // % of pest population controlled
  areaOfEffect: number; // acres per beneficial unit
  cost: number; // per acre
}

export const BENEFICIAL_INSECTS: BeneficialInsect[] = [
  {
    id: 'lady_beetle',
    name: 'Coccinellidae',
    commonName: 'Lady Beetles',
    type: 'predator',
    targetPests: ['aphids', 'spider_mites', 'whiteflies'],
    efficacy: 85,
    establishmentRate: 70,
    population: 0,
    habitatRequirements: ['diverse flowering plants', 'shelter from wind'],
    floweringPlants: ['dill', 'fennel', 'yarrow', 'cosmos'],
    gddActivityStart: 300,
    gddActivityEnd: 3000
  },
  {
    id: 'lacewing',
    name: 'Chrysoperla carnea',
    commonName: 'Green Lacewing',
    type: 'predator',
    targetPests: ['aphids', 'whiteflies', 'thrips'],
    efficacy: 75,
    establishmentRate: 65,
    population: 0,
    habitatRequirements: ['high humidity', 'pollen sources'],
    floweringPlants: ['sweet alyssum', 'sunflowers', 'angelica'],
    gddActivityStart: 400,
    gddActivityEnd: 3200
  },
  {
    id: 'parasitic_wasp_aphidius',
    name: 'Aphidius colemani',
    commonName: 'Aphid Parasitoid Wasp',
    type: 'parasitoid',
    targetPests: ['aphids'],
    efficacy: 90,
    establishmentRate: 60,
    population: 0,
    habitatRequirements: ['aphid population present', 'nectar sources'],
    floweringPlants: ['alyssum', 'buckwheat', 'phacelia'],
    gddActivityStart: 500,
    gddActivityEnd: 3500
  },
  {
    id: 'minute_pirate_bug',
    name: 'Orius insidiosus',
    commonName: 'Minute Pirate Bug',
    type: 'predator',
    targetPests: ['spider_mites', 'thrips', 'aphids'],
    efficacy: 80,
    establishmentRate: 55,
    population: 0,
    habitatRequirements: ['permanent plantings', 'pollen'],
    floweringPlants: ['goldenrod', 'sunflowers', 'corn pollen'],
    gddActivityStart: 600,
    gddActivityEnd: 2800
  },
  {
    id: 'trichogramma',
    name: 'Trichogramma spp.',
    commonName: 'Egg Parasitoid Wasp',
    type: 'parasitoid',
    targetPests: ['corn_earworm', 'armyworm', 'soybean_podworm'],
    efficacy: 70,
    establishmentRate: 50,
    population: 0,
    habitatRequirements: ['target pest eggs present', 'sugar sources'],
    floweringPlants: ['honeysuckle', 'wild carrot'],
    gddActivityStart: 800,
    gddActivityEnd: 3000
  },
  {
    id: 'hover_fly',
    name: 'Syrphidae',
    commonName: 'Hover Flies',
    type: 'predator',
    targetPests: ['aphids'],
    efficacy: 70,
    establishmentRate: 75,
    population: 0,
    habitatRequirements: ['open flowers', 'undisturbed soil'],
    floweringPlants: ['alyssum', 'dill', 'fennel', 'mustards'],
    gddActivityStart: 350,
    gddActivityEnd: 3300
  }
];

/**
 * Calculate beneficial insect suppression of pest populations
 */
export function calculateBiologicalControl(
  beneficial: BeneficialInsect,
  pestPopulation: number,
  gdd: number,
  habitatQuality: number // 0-100 habitat suitability
): BiologicalControl {
  // Check if beneficial is active at current GDD
  if (gdd < beneficial.gddActivityStart || gdd > beneficial.gddActivityEnd) {
    return {
      beneficialId: beneficial.id,
      targetPestId: beneficial.targetPests[0],
      suppressionRate: 0,
      areaOfEffect: 0,
      cost: 0
    };
  }
  
  // Calculate effective population based on habitat quality
  const effectivePopulation = beneficial.population * (habitatQuality / 100);
  
  // Functional response - predation rate varies with prey density
  const attackRate = 0.1; // per predator per day
  const handlingTime = 0.01; // days per prey
  const predationRate = (attackRate * pestPopulation) / (1 + attackRate * handlingTime * pestPopulation);
  
  // Calculate suppression
  const maxSuppression = beneficial.efficacy / 100;
  const actualSuppression = Math.min(maxSuppression, 
    (effectivePopulation * predationRate) / Math.max(pestPopulation, 1)
  );
  
  return {
    beneficialId: beneficial.id,
    targetPestId: beneficial.targetPests[0],
    suppressionRate: actualSuppression * 100,
    areaOfEffect: effectivePopulation * 0.5, // acres per population unit
    cost: 25 // typical cost per acre for release
  };
}

// ============================================================================
// DISEASE PROFILES
// ============================================================================

export interface ExtendedDiseaseProfile extends DiseaseProfile {
  environmentalRequirements: DiseaseEnvironmentRequirements;
  symptoms: DiseaseSymptom[];
  spreadRate: number; // % per day under favorable conditions
  yieldImpact: Record<GrowthStage, number>; // % yield loss at each stage
  fungicideResistance: Record<string, ResistanceLevel>;
}

export interface DiseaseSymptom {
  stage: GrowthStage;
  location: 'leaf' | 'stem' | 'root' | 'fruit' | 'flower' | 'whole_plant';
  description: string;
  severityIndicator: number; // symptom intensity 0-100
}

export const DEFAULT_DISEASE_REQUIREMENTS: Record<string, DiseaseEnvironmentRequirements> = {
  fungal: {
    optimalTemp: { min: 65, max: 85 },
    minHumidity: 85,
    minLeafWetness: 6,
    requiresPrecipitation: false,
    precipitationEffect: 'triggers',
    durationForOutbreak: 3
  },
  bacterial: {
    optimalTemp: { min: 75, max: 90 },
    minHumidity: 80,
    minLeafWetness: 4,
    requiresPrecipitation: false,
    precipitationEffect: 'spreads',
    durationForOutbreak: 2
  },
  oomycete: {
    optimalTemp: { min: 55, max: 75 },
    minHumidity: 90,
    minLeafWetness: 8,
    requiresPrecipitation: true,
    precipitationEffect: 'triggers',
    durationForOutbreak: 2
  },
  viral: {
    optimalTemp: { min: 70, max: 85 },
    minHumidity: 60,
    minLeafWetness: 0,
    requiresPrecipitation: false,
    precipitationEffect: 'none',
    durationForOutbreak: 7
  }
};

export const DISEASE_PROFILES: ExtendedDiseaseProfile[] = [
  // EARLY BLIGHT (Alternaria solani) - Tomatoes & Potatoes
  {
    id: 'early_blight',
    name: 'Early Blight',
    type: 'fungal',
    family: 'Pleosporaceae',
    diseaseTriangle: {
      susceptibleHost: ['tomatoes', 'potatoes'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 60, max: 85 }, humidity: { min: 90, max: 100 }, leafWetness: 3, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 65, max: 85 },
      minHumidity: 90,
      minLeafWetness: 3,
      requiresPrecipitation: false,
      precipitationEffect: 'spreads',
      durationForOutbreak: 4
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Dark brown concentric rings (target spots)', severityIndicator: 30 },
      { stage: 'reproductive', location: 'leaf', description: 'Yellowing around lesions, leaf drop', severityIndicator: 60 },
      { stage: 'reproductive', location: 'stem', description: 'Dark cankers near soil line', severityIndicator: 50 },
      { stage: 'grain_filling', location: 'fruit', description: 'Sunken lesions with target pattern', severityIndicator: 70 }
    ],
    spreadMethod: ['splashing water', 'wind', 'contaminated equipment', 'seed transmission'],
    spreadRate: 5, // % per day under optimal conditions
    yieldImpact: {
      germination: 0,
      seedling: 5,
      vegetative: 15,
      reproductive: 40,
      grain_filling: 60,
      maturity: 30,
      senescence: 10
    },
    management: {
      cultural: [
        'Rotate crops 3+ years away from solanaceous crops',
        'Remove and destroy infected plant debris',
        'Space plants for air circulation',
        'Mulch to reduce soil splash',
        'Fertilize properly - balanced NPK reduces susceptibility'
      ],
      chemical: [
        { activeIngredient: 'chlorothalonil', modeOfAction: 'M5', applicationRate: '1.5 pt/acre', timing: 'Preventive', resistanceRisk: 'low' },
        { activeIngredient: 'azoxystrobin', modeOfAction: '11', applicationRate: '8 fl oz/acre', timing: 'At first sign', resistanceRisk: 'medium' },
        { activeIngredient: 'boscalid + pyraclostrobin', modeOfAction: '7+11', applicationRate: '14 oz/acre', timing: 'Preventive', resistanceRisk: 'medium' }
      ],
      biological: ['Bacillus subtilis', 'Trichoderma harzianum', 'Copper-based products'],
      resistantVarieties: ['Mountain Magic tomato', 'Defiant PHR tomato', 'Kennebec potato']
    },
    resistantVarieties: ['Mountain Magic', 'Defiant PHR', 'Iron Lady'],
    fungicideResistance: {
      'chlorothalonil': { level: 'susceptible', rfValue: 1, effectiveness: 95 },
      'azoxystrobin': { level: 'low', rfValue: 3, effectiveness: 85 },
      'boscalid': { level: 'susceptible', rfValue: 1, effectiveness: 90 }
    }
  },
  
  // LATE BLIGHT (Phytophthora infestans) - Tomatoes & Potatoes
  {
    id: 'late_blight',
    name: 'Late Blight',
    type: 'oomycete',
    family: 'Phytophthoraceae',
    diseaseTriangle: {
      susceptibleHost: ['tomatoes', 'potatoes'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 50, max: 75 }, humidity: { min: 90, max: 100 }, leafWetness: 6, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 60, max: 70 },
      minHumidity: 90,
      minLeafWetness: 6,
      requiresPrecipitation: true,
      precipitationEffect: 'triggers',
      durationForOutbreak: 1 // Can spread extremely fast
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Water-soaked dark green spots turning brown/black', severityIndicator: 40 },
      { stage: 'vegetative', location: 'stem', description: 'Dark brown to black lesions', severityIndicator: 50 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Rapid blighting and collapse', severityIndicator: 90 },
      { stage: 'grain_filling', location: 'fruit', description: 'Firm brown rot, white fuzzy growth', severityIndicator: 80 },
      { stage: 'grain_filling', location: 'root', description: 'Tuber rot (potatoes)', severityIndicator: 85 }
    ],
    spreadMethod: ['wind', 'rain splash', 'infected tubers/seed', 'fog/clouds'],
    spreadRate: 15, // Very fast spread under cool, wet conditions
    yieldImpact: {
      germination: 0,
      seedling: 10,
      vegetative: 30,
      reproductive: 70,
      grain_filling: 100,
      maturity: 80,
      senescence: 40
    },
    management: {
      cultural: [
        'Plant certified disease-free seed/tubers',
        'Destroy volunteer potatoes/tomatoes',
        'Hill potatoes to protect tubers',
        'Eliminate cull piles',
        'Harvest when tubers are mature and dry'
      ],
      chemical: [
        { activeIngredient: 'mancozeb', modeOfAction: 'M3', applicationRate: '2 lb/acre', timing: 'Preventive', resistanceRisk: 'low' },
        { activeIngredient: 'mefenoxam', modeOfAction: '4', applicationRate: '1 pt/acre', timing: 'Preventive', resistanceRisk: 'high' },
        { activeIngredient: 'cyazofamid', modeOfAction: '21', applicationRate: '3 fl oz/acre', timing: 'Preventive', resistanceRisk: 'low' },
        { activeIngredient: 'oxathiapiprolin', modeOfAction: '49', applicationRate: '3 fl oz/acre', timing: 'Preventive', resistanceRisk: 'low' }
      ],
      biological: ['Bacillus subtilis', 'Phosphorous acid'],
      resistantVarieties: ['Defender potato', 'Elba potato', 'Iron Lady tomato']
    },
    resistantVarieties: ['Defender', 'Elba', 'Iron Lady'],
    fungicideResistance: {
      'mancozeb': { level: 'susceptible', rfValue: 1, effectiveness: 85 },
      'mefenoxam': { level: 'high', rfValue: 50, effectiveness: 40 }
    }
  },
  
  // POWDERY MILDEW - Multiple crops
  {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    family: 'Erysiphaceae',
    diseaseTriangle: {
      susceptibleHost: ['lettuce', 'grapes', 'wheat', 'cucurbits'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 60, max: 80 }, humidity: { min: 50, max: 90 }, leafWetness: 0, precipitation: false }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 68, max: 80 },
      minHumidity: 50,
      minLeafWetness: 0, // Unlike most fungi, doesn't need free water
      requiresPrecipitation: false,
      precipitationEffect: 'inhibits',
      durationForOutbreak: 5
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'White powdery patches on leaf surface', severityIndicator: 30 },
      { stage: 'vegetative', location: 'leaf', description: 'Leaf curling and distortion', severityIndicator: 50 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Stunted growth, reduced vigor', severityIndicator: 60 },
      { stage: 'grain_filling', location: 'fruit', description: 'Discolored, misshapen fruit', severityIndicator: 40 }
    ],
    spreadMethod: ['wind-borne spores', 'movement of infected plants'],
    spreadRate: 8,
    yieldImpact: {
      germination: 0,
      seedling: 10,
      vegetative: 25,
      reproductive: 50,
      grain_filling: 45,
      maturity: 30,
      senescence: 15
    },
    management: {
      cultural: [
        'Space plants for air circulation',
        'Avoid overhead irrigation',
        'Plant resistant varieties',
        'Remove infected plant parts',
        'Apply organic mulches'
      ],
      chemical: [
        { activeIngredient: 'sulfur', modeOfAction: 'M2', applicationRate: '3 lb/acre', timing: 'Preventive', resistanceRisk: 'low' },
        { activeIngredient: 'myclobutanil', modeOfAction: '3', applicationRate: '6 fl oz/acre', timing: 'At first sign', resistanceRisk: 'medium' },
        { activeIngredient: 'quinoxyfen', modeOfAction: '13', applicationRate: '6 fl oz/acre', timing: 'Preventive', resistanceRisk: 'medium' }
      ],
      biological: ['Bacillus subtilis', 'Ampelomyces quisqualis', 'Neem oil'],
      resistantVarieties: ['Sarah grape', 'Bronx grape']
    },
    resistantVarieties: ['Sarah', 'Bronx'],
    fungicideResistance: {}
  },
  
  // DOWNY MILDEW - Lettuce, grapes, cucurbits
  {
    id: 'downy_mildew',
    name: 'Downy Mildew',
    type: 'oomycete',
    family: 'Peronosporaceae',
    diseaseTriangle: {
      susceptibleHost: ['lettuce', 'grapes', 'cucurbits', 'onions'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 50, max: 75 }, humidity: { min: 85, max: 100 }, leafWetness: 4, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 55, max: 68 },
      minHumidity: 85,
      minLeafWetness: 4,
      requiresPrecipitation: true,
      precipitationEffect: 'triggers',
      durationForOutbreak: 3
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Yellow angular spots on upper leaf surface', severityIndicator: 35 },
      { stage: 'vegetative', location: 'leaf', description: 'Gray/purple fuzzy growth on leaf underside', severityIndicator: 60 },
      { stage: 'reproductive', location: 'leaf', description: 'Browning and death of leaf tissue', severityIndicator: 75 },
      { stage: 'grain_filling', location: 'fruit', description: 'Fruit discoloration and rot', severityIndicator: 50 }
    ],
    spreadMethod: ['wind', 'splashing water', 'overhead irrigation'],
    spreadRate: 10,
    yieldImpact: {
      germination: 5,
      seedling: 15,
      vegetative: 35,
      reproductive: 60,
      grain_filling: 55,
      maturity: 40,
      senescence: 20
    },
    management: {
      cultural: [
        'Use resistant varieties',
        'Avoid overhead irrigation',
        'Space for air circulation',
        'Remove infected debris',
        'Rotate crops 2+ years'
      ],
      chemical: [
        { activeIngredient: 'copper hydroxide', modeOfAction: 'M1', applicationRate: '2 lb/acre', timing: 'Preventive', resistanceRisk: 'low' },
        { activeIngredient: 'mandipropamid', modeOfAction: '40', applicationRate: '8 fl oz/acre', timing: 'Preventive', resistanceRisk: 'medium' },
        { activeIngredient: 'fosetyl-Al', modeOfAction: '33', applicationRate: '2.5 lb/acre', timing: 'Preventive/curative', resistanceRisk: 'medium' }
      ],
      biological: ['Copper products', 'Bacillus subtilis'],
      resistantVarieties: ['Concept lettuce', 'Salvius lettuce']
    },
    resistantVarieties: ['Concept', 'Salvius'],
    fungicideResistance: {}
  },
  
  // FUSARIUM WILT
  {
    id: 'fusarium_wilt',
    name: 'Fusarium Wilt',
    type: 'fungal',
    family: 'Nectriaceae',
    diseaseTriangle: {
      susceptibleHost: ['tomatoes', 'cotton', 'bananas', 'watermelon'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 75, max: 90 }, humidity: { min: 60, max: 100 }, leafWetness: 0, precipitation: false }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 80, max: 90 },
      minHumidity: 60,
      minLeafWetness: 0,
      requiresPrecipitation: false,
      precipitationEffect: 'none',
      durationForOutbreak: 14 // Slow development
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Yellowing of lower leaves, often one-sided', severityIndicator: 40 },
      { stage: 'vegetative', location: 'stem', description: 'Vascular discoloration (brown streaks)', severityIndicator: 60 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Wilting during day, recovery at night initially', severityIndicator: 70 },
      { stage: 'grain_filling', location: 'whole_plant', description: 'Permanent wilting, plant death', severityIndicator: 100 }
    ],
    spreadMethod: ['contaminated soil', 'water movement', 'infected transplants', 'equipment'],
    spreadRate: 2, // Slow soil-borne spread
    yieldImpact: {
      germination: 10,
      seedling: 30,
      vegetative: 50,
      reproductive: 80,
      grain_filling: 100,
      maturity: 100,
      senescence: 80
    },
    management: {
      cultural: [
        'Plant resistant varieties (race-specific)',
        'Rotate with non-host crops 5+ years',
        'Soil solarization',
        'Adjust soil pH to 6.5-7.0',
        'Use disease-free transplants',
        'Improve drainage'
      ],
      chemical: [
        { activeIngredient: 'fumigants', modeOfAction: 'various', applicationRate: 'See label', timing: 'Pre-plant', resistanceRisk: 'low' }
      ],
      biological: ['Trichoderma spp.', 'Bacillus subtilis', 'Myrothecium verrucaria'],
      resistantVarieties: ['VFN tomato varieties', 'UA2226 cotton']
    },
    resistantVarieties: ['VFN tomatoes', 'UA2226 cotton'],
    fungicideResistance: {}
  },
  
  // VERTICILLIUM WILT
  {
    id: 'verticillium_wilt',
    name: 'Verticillium Wilt',
    type: 'fungal',
    family: 'Plectosphaerellaceae',
    diseaseTriangle: {
      susceptibleHost: ['tomatoes', 'potatoes', 'strawberries', 'cotton'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 60, max: 80 }, humidity: { min: 50, max: 100 }, leafWetness: 0, precipitation: false }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 65, max: 75 },
      minHumidity: 50,
      minLeafWetness: 0,
      requiresPrecipitation: false,
      precipitationEffect: 'none',
      durationForOutbreak: 21
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'V-shaped yellowing at leaf margins', severityIndicator: 35 },
      { stage: 'vegetative', location: 'stem', description: 'Brown vascular tissue', severityIndicator: 55 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Wilting, stunted growth', severityIndicator: 65 },
      { stage: 'grain_filling', location: 'root', description: 'Root rot, vascular damage', severityIndicator: 75 }
    ],
    spreadMethod: ['soil', 'water', 'infected plant material', 'nematodes'],
    spreadRate: 3,
    yieldImpact: {
      germination: 5,
      seedling: 20,
      vegetative: 40,
      reproductive: 65,
      grain_filling: 75,
      maturity: 60,
      senescence: 40
    },
    management: {
      cultural: [
        'Plant resistant varieties',
        'Rotate with cereals/grasses 4+ years',
        'Soil solarization',
        'Control nematodes',
        'Optimize fertility - avoid excess nitrogen'
      ],
      chemical: [
        { activeIngredient: 'soil fumigants', modeOfAction: 'various', applicationRate: 'See label', timing: 'Pre-plant', resistanceRisk: 'low' }
      ],
      biological: ['Trichoderma harzianum', 'Gliocladium catenulatum'],
      resistantVarieties: ['Verticillium-resistant tomatoes', 'Chipeta potato']
    },
    resistantVarieties: ['Verticillium-resistant varieties'],
    fungicideResistance: {}
  },
  
  // WHEAT STEM RUST
  {
    id: 'wheat_stem_rust',
    name: 'Wheat Stem Rust',
    type: 'fungal',
    family: 'Pucciniaceae',
    diseaseTriangle: {
      susceptibleHost: ['wheat', 'barley', 'oats'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 65, max: 85 }, humidity: { min: 90, max: 100 }, leafWetness: 6, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 75, max: 85 },
      minHumidity: 90,
      minLeafWetness: 6,
      requiresPrecipitation: false,
      precipitationEffect: 'spreads',
      durationForOutbreak: 5
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Small yellow spots on leaves', severityIndicator: 20 },
      { stage: 'reproductive', location: 'stem', description: 'Elongated brick-red pustules on stems', severityIndicator: 70 },
      { stage: 'grain_filling', location: 'whole_plant', description: 'Shattered stems, black teliospores', severityIndicator: 90 }
    ],
    spreadMethod: ['wind', 'long-distance spore transport'],
    spreadRate: 12,
    yieldImpact: {
      germination: 0,
      seedling: 5,
      vegetative: 20,
      reproductive: 60,
      grain_filling: 80,
      maturity: 70,
      senescence: 30
    },
    management: {
      cultural: [
        'Plant resistant varieties (primary control)',
        'Early planting to avoid peak rust season',
        'Monitor for urediniospores',
        'Remove barberry alternate host'
      ],
      chemical: [
        { activeIngredient: 'propiconazole', modeOfAction: '3', applicationRate: '4 fl oz/acre', timing: 'Flag leaf emergence', resistanceRisk: 'low' },
        { activeIngredient: 'prothioconazole', modeOfAction: '3', applicationRate: '4 fl oz/acre', timing: 'Flag leaf emergence', resistanceRisk: 'low' }
      ],
      biological: [],
      resistantVarieties: ['Sr2-derived varieties', 'Race-specific resistant wheats']
    },
    resistantVarieties: ['Sr2-derived varieties'],
    fungicideResistance: {}
  },
  
  // CORN SOUTHERN RUST
  {
    id: 'corn_southern_rust',
    name: 'Corn Southern Rust',
    type: 'fungal',
    family: 'Pucciniaceae',
    diseaseTriangle: {
      susceptibleHost: ['corn'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 77, max: 95 }, humidity: { min: 85, max: 100 }, leafWetness: 6, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 80, max: 90 },
      minHumidity: 85,
      minLeafWetness: 6,
      requiresPrecipitation: false,
      precipitationEffect: 'spreads',
      durationForOutbreak: 3
    },
    symptoms: [
      { stage: 'vegetative', location: 'leaf', description: 'Small circular orange pustules on upper leaf', severityIndicator: 40 },
      { stage: 'reproductive', location: 'leaf', description: 'Dense pustule clusters, yellow halos', severityIndicator: 65 },
      { stage: 'grain_filling', location: 'leaf', description: 'Premature senescence, defoliation', severityIndicator: 85 },
      { stage: 'grain_filling', location: 'whole_plant', description: 'Stalk rot, lodging', severityIndicator: 70 }
    ],
    spreadMethod: ['wind', 'hurricane-spread from tropics'],
    spreadRate: 20, // Very fast under hot, humid conditions
    yieldImpact: {
      germination: 0,
      seedling: 0,
      vegetative: 15,
      reproductive: 45,
      grain_filling: 70,
      maturity: 50,
      senescence: 20
    },
    management: {
      cultural: [
        'Plant resistant hybrids',
        'Early planting',
        'Scout fields regularly',
        'Maintain good fertility'
      ],
      chemical: [
        { activeIngredient: 'pyraclostrobin', modeOfAction: '11', applicationRate: '6 fl oz/acre', timing: 'VT-R1', resistanceRisk: 'medium' },
        { activeIngredient: 'propiconazole', modeOfAction: '3', applicationRate: '4 fl oz/acre', timing: 'VT-R1', resistanceRisk: 'low' },
        { activeIngredient: 'tetraconazole', modeOfAction: '3', applicationRate: '4 fl oz/acre', timing: 'VT-R1', resistanceRisk: 'low' }
      ],
      biological: [],
      resistantVarieties: ['Resistant hybrids (limited availability)']
    },
    resistantVarieties: ['Rpp-resistant hybrids'],
    fungicideResistance: {}
  },
  
  // ROOT ROTS (Phytophthora/Pythium)
  {
    id: 'phytophthora_root_rot',
    name: 'Phytophthora Root Rot',
    type: 'oomycete',
    family: 'Phytophthoraceae',
    diseaseTriangle: {
      susceptibleHost: ['soybeans', 'peppers', 'citrus', 'avocado'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 60, max: 80 }, humidity: { min: 80, max: 100 }, leafWetness: 0, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 65, max: 75 },
      minHumidity: 80,
      minLeafWetness: 0,
      requiresPrecipitation: true,
      precipitationEffect: 'triggers',
      durationForOutbreak: 7
    },
    symptoms: [
      { stage: 'seedling', location: 'root', description: 'Seed rot, pre-emergence damping-off', severityIndicator: 80 },
      { stage: 'seedling', location: 'stem', description: 'Stem canker at soil line', severityIndicator: 70 },
      { stage: 'vegetative', location: 'root', description: 'Brown rotted roots, reduced nodules', severityIndicator: 75 },
      { stage: 'vegetative', location: 'leaf', description: 'Yellowing, wilting between wilted areas', severityIndicator: 60 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Stunting, early death', severityIndicator: 90 }
    ],
    spreadMethod: ['water', 'soil movement', 'infected plants'],
    spreadRate: 4,
    yieldImpact: {
      germination: 40,
      seedling: 60,
      vegetative: 50,
      reproductive: 70,
      grain_filling: 60,
      maturity: 40,
      senescence: 20
    },
    management: {
      cultural: [
        'Plant resistant varieties (Rps genes)',
        'Improve drainage',
        'Avoid compaction',
        'Plant on raised beds',
        'Reduce soil erosion'
      ],
      chemical: [
        { activeIngredient: 'mefenoxam', modeOfAction: '4', applicationRate: 'See label', timing: 'Seed treatment/planting', resistanceRisk: 'high' },
        { activeIngredient: 'ethaboxam', modeOfAction: '22', applicationRate: 'Seed treatment', timing: 'Planting', resistanceRisk: 'low' },
        { activeIngredient: 'oxathiapiprolin', modeOfAction: '49', applicationRate: 'Seed treatment', timing: 'Planting', resistanceRisk: 'low' }
      ],
      biological: ['Trichoderma asperellum', 'Bacillus amyloliquefaciens'],
      resistantVarieties: ['Rps1k soybeans', 'Rps6 soybeans']
    },
    resistantVarieties: ['Rps1k', 'Rps6', 'Rps3a'],
    fungicideResistance: {
      'mefenoxam': { level: 'high', rfValue: 30, effectiveness: 35 }
    }
  },
  
  // CLUBROOT (Broccoli/Cabbage)
  {
    id: 'clubroot',
    name: 'Clubroot',
    type: 'oomycete',
    family: 'Plasmodiophoraceae',
    diseaseTriangle: {
      susceptibleHost: ['broccoli', 'cabbage', 'cauliflower', 'canola'],
      pathogenPresent: true,
      favorableEnvironment: [
        { temperature: { min: 60, max: 75 }, humidity: { min: 80, max: 100 }, leafWetness: 0, precipitation: true }
      ]
    },
    environmentalRequirements: {
      optimalTemp: { min: 64, max: 72 },
      minHumidity: 80,
      minLeafWetness: 0,
      requiresPrecipitation: true,
      precipitationEffect: 'triggers',
      durationForOutbreak: 14
    },
    symptoms: [
      { stage: 'vegetative', location: 'root', description: 'Clubbed, swollen roots', severityIndicator: 80 },
      { stage: 'vegetative', location: 'leaf', description: 'Wilting during day, stunted growth', severityIndicator: 60 },
      { stage: 'vegetative', location: 'whole_plant', description: 'Yellowing, nutrient deficiency symptoms', severityIndicator: 55 },
      { stage: 'reproductive', location: 'whole_plant', description: 'Plant death in severe cases', severityIndicator: 100 }
    ],
    spreadMethod: ['soil', 'water', 'transplants', 'equipment', 'spores survive 10+ years'],
    spreadRate: 1, // Very slow spread but persistent
    yieldImpact: {
      germination: 10,
      seedling: 40,
      vegetative: 60,
      reproductive: 70,
      grain_filling: 50,
      maturity: 40,
      senescence: 30
    },
    management: {
      cultural: [
        'Raise soil pH to 7.0-7.5 with lime',
        'Rotate away from brassicas 4+ years',
        'Improve drainage',
        'Use certified transplants',
        'Soil biofumigation with mustard cover crops'
      ],
      chemical: [
        { activeIngredient: 'cyazofamid', modeOfAction: '21', applicationRate: '0.6 fl oz/1000 ft row', timing: 'Transplant water', resistanceRisk: 'low' },
        { activeIngredient: 'fluazinam', modeOfAction: '29', applicationRate: 'See label', timing: 'Pre-plant', resistanceRisk: 'low' }
      ],
      biological: ['Serenade ASO (Bacillus subtilis)', 'Prestop (Gliocladium catenulatum)'],
      resistantVarieties: ['Tekila cabbage', 'Bronco cabbage', 'SE1 broccoli']
    },
    resistantVarieties: ['Tekila', 'Bronco', 'SE1'],
    fungicideResistance: {}
  }
];

// ============================================================================
// PEST PROFILES
// ============================================================================

export interface ExtendedPestProfile extends PestProfile {
  multipleResistance: Record<string, ResistanceLevel>;
  beneficialSuppression: Record<string, number>; // beneficial ID -> suppression rate
  damageCurve: Record<GrowthStage, number>; // yield loss % per pest unit
}

export const PEST_PROFILES: ExtendedPestProfile[] = [
  // APHIDS
  {
    id: 'aphids',
    name: 'Aphid Complex',
    type: 'insect',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      duration: { egg: 5, larva: 7, pupa: 3, adult: 21 },
      generationsPerYear: 8
    },
    hostCrops: ['lettuce', 'broccoli', 'tomatoes', 'potatoes', 'wheat', 'soybeans', 'cotton'],
    damageType: 'sucking',
    economicThreshold: 50, // per plant or per sweep
    weatherTriggers: [
      { condition: 'temperature', threshold: 75, duration: 3 },
      { condition: 'humidity', threshold: 60, duration: 2 }
    ],
    beneficialPredators: ['lady_beetle', 'lacewing', 'parasitic_wasp_aphidius', 'hover_fly'],
    controlMethods: [
      { type: 'chemical', name: 'Transform WG', activeIngredient: 'sulfoxaflor', efficacy: 95 },
      { type: 'chemical', name: 'Sivanto Prime', activeIngredient: 'flupyradifurone', efficacy: 90 },
      { type: 'chemical', name: 'Assail', activeIngredient: 'acetamiprid', efficacy: 85 },
      { type: 'biological', name: 'BotaniGard', activeIngredient: 'Beauveria bassiana', efficacy: 70 },
      { type: 'cultural', name: 'Reflective mulch', efficacy: 40 },
      { type: 'cultural', name: 'Row covers', efficacy: 80 }
    ],
    multipleResistance: {
      'pyrethroids': { level: 'high', rfValue: 50, effectiveness: 20 },
      'neonicotinoids': { level: 'moderate', rfValue: 15, effectiveness: 60 },
      'organophosphates': { level: 'moderate', rfValue: 10, effectiveness: 65 }
    },
    beneficialSuppression: {
      'lady_beetle': 70,
      'lacewing': 60,
      'parasitic_wasp_aphidius': 85,
      'hover_fly': 55
    },
    damageCurve: {
      germination: 5,
      seedling: 15,
      vegetative: 25,
      reproductive: 40,
      grain_filling: 35,
      maturity: 15,
      senescence: 5
    }
  },
  
  // SPIDER MITES
  {
    id: 'spider_mites',
    name: 'Two-Spotted Spider Mite',
    type: 'insect',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      duration: { egg: 3, larva: 4, pupa: 2, adult: 14 },
      generationsPerYear: 10
    },
    hostCrops: ['soybeans', 'corn', 'tomatoes', 'strawberries', 'cotton'],
    damageType: 'sucking',
    economicThreshold: 20, // per leaflet
    weatherTriggers: [
      { condition: 'temperature', threshold: 85, duration: 2 },
      { condition: 'humidity', threshold: 40, duration: 3 }
    ],
    beneficialPredators: ['minute_pirate_bug', 'lady_beetle'],
    controlMethods: [
      { type: 'chemical', name: 'Agri-Mek SC', activeIngredient: 'abamectin', efficacy: 95 },
      { type: 'chemical', name: 'Zeal', activeIngredient: 'etoxazole', efficacy: 90 },
      { type: 'chemical', name: 'Acramite', activeIngredient: 'bifenazate', efficacy: 85 },
      { type: 'biological', name: 'Predatory mites', activeIngredient: 'Phytoseiulus persimilis', efficacy: 80 },
      { type: 'cultural', name: 'Water sprays', efficacy: 30 },
      { type: 'cultural', name: 'Dust control', efficacy: 40 }
    ],
    multipleResistance: {
      'abamectin': { level: 'moderate', rfValue: 8, effectiveness: 75 },
      'bifenthrin': { level: 'high', rfValue: 40, effectiveness: 25 }
    },
    beneficialSuppression: {
      'minute_pirate_bug': 75,
      'lady_beetle': 50
    },
    damageCurve: {
      germination: 2,
      seedling: 10,
      vegetative: 30,
      reproductive: 50,
      grain_filling: 45,
      maturity: 20,
      senescence: 10
    }
  },
  
  // WHITEFLIES
  {
    id: 'whiteflies',
    name: 'Sweetpotato Whitefly',
    type: 'insect',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      duration: { egg: 6, larva: 10, pupa: 5, adult: 20 },
      generationsPerYear: 6
    },
    hostCrops: ['tomatoes', 'cotton', 'lettuce', 'broccoli', 'soybeans'],
    damageType: 'sucking',
    economicThreshold: 5, // per leaf
    weatherTriggers: [
      { condition: 'temperature', threshold: 80, duration: 3 },
      { condition: 'humidity', threshold: 50, duration: 2 }
    ],
    beneficialPredators: ['lady_beetle', 'lacewing'],
    controlMethods: [
      { type: 'chemical', name: 'Sivanto Prime', activeIngredient: 'flupyradifurone', efficacy: 90 },
      { type: 'chemical', name: 'Oberon', activeIngredient: 'spiromesifen', efficacy: 85 },
      { type: 'chemical', name: 'Courier', activeIngredient: 'buprofezin', efficacy: 80 },
      { type: 'biological', name: 'Beneficial fungi', activeIngredient: 'Isaria fumosorosea', efficacy: 65 },
      { type: 'cultural', name: 'Reflective mulch', efficacy: 50 },
      { type: 'cultural', name: 'Yellow sticky traps', efficacy: 30 }
    ],
    multipleResistance: {
      'pyrethroids': { level: 'extreme', rfValue: 200, effectiveness: 5 },
      'neonicotinoids': { level: 'high', rfValue: 50, effectiveness: 30 },
      'pyriproxyfen': { level: 'moderate', rfValue: 12, effectiveness: 60 }
    },
    beneficialSuppression: {
      'lady_beetle': 60,
      'lacewing': 50
    },
    damageCurve: {
      germination: 5,
      seedling: 15,
      vegetative: 30,
      reproductive: 45,
      grain_filling: 35,
      maturity: 15,
      senescence: 5
    }
  },
  
  // CORN ROOTWORM
  {
    id: 'corn_rootworm',
    name: 'Corn Rootworm Complex',
    type: 'insect',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      duration: { egg: 180, larva: 21, pupa: 7, adult: 30 },
      generationsPerYear: 1
    },
    hostCrops: ['corn'],
    damageType: 'boring',
    economicThreshold: 0.5, // larvae per plant
    weatherTriggers: [
      { condition: 'temperature', threshold: 50, duration: 5 }, // Spring hatch trigger
      { condition: 'precipitation', threshold: 1, duration: 1 }
    ],
    beneficialPredators: ['ground_beetles', 'ants'],
    controlMethods: [
      { type: 'chemical', name: 'Force 3G', activeIngredient: 'tefluthrin', efficacy: 85 },
      { type: 'chemical', name: 'Aztec 4.67G', activeIngredient: 'cyfluthrin + tebupirimphos', efficacy: 90 },
      { type: 'chemical', name: 'SmartStax', activeIngredient: 'Bt proteins', efficacy: 95 },
      { type: 'cultural', name: 'Crop rotation', efficacy: 90 },
      { type: 'cultural', name: 'Plant late', efficacy: 40 }
    ],
    multipleResistance: {
      'Cry3Bb1': { level: 'high', rfValue: 30, effectiveness: 40 },
      'mCry3A': { level: 'high', rfValue: 25, effectiveness: 45 },
      'Cry34/35Ab1': { level: 'low', rfValue: 2, effectiveness: 90 }
    },
    beneficialSuppression: {},
    damageCurve: {
      germination: 20,
      seedling: 50,
      vegetative: 60,
      reproductive: 40,
      grain_filling: 30,
      maturity: 15,
      senescence: 5
    }
  },
  
  // SOYBEAN PODWORM (Corn Earworm)
  {
    id: 'soybean_podworm',
    name: 'Soybean Podworm',
    type: 'insect',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      duration: { egg: 3, larva: 14, pupa: 10, adult: 12 },
      generationsPerYear: 3
    },
    hostCrops: ['soybeans', 'corn', 'cotton', 'tomatoes'],
    damageType: 'chewing',
    economicThreshold: 1, // per foot of row
    weatherTriggers: [
      { condition: 'temperature', threshold: 70, duration: 5 },
      { condition: 'humidity', threshold: 60, duration: 2 }
    ],
    beneficialPredators: ['trichogramma', 'ground_beetles'],
    controlMethods: [
      { type: 'chemical', name: 'Besiege', activeIngredient: 'lambda-cyhalothrin + chlorantraniliprole', efficacy: 95 },
      { type: 'chemical', name: 'Prevathon', activeIngredient: 'chlorantraniliprole', efficacy: 90 },
      { type: 'chemical', name: 'Blackhawk', activeIngredient: 'spinetoram', efficacy: 85 },
      { type: 'biological', name: 'Trichogramma wasps', activeIngredient: 'egg parasitoid', efficacy: 60 },
      { type: 'cultural', name: 'Early planting', efficacy: 30 }
    ],
    multipleResistance: {
      'pyrethroids': { level: 'moderate', rfValue: 8, effectiveness: 70 },
      'spinosyns': { level: 'low', rfValue: 2, effectiveness: 90 }
    },
    beneficialSuppression: {
      'trichogramma': 65
    },
    damageCurve: {
      germination: 0,
      seedling: 5,
      vegetative: 10,
      reproductive: 60,
      grain_filling: 80,
      maturity: 40,
      senescence: 10
    }
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get disease profile by ID
 */
export function getDiseaseProfile(diseaseId: string): ExtendedDiseaseProfile | undefined {
  return DISEASE_PROFILES.find(d => d.id === diseaseId);
}

/**
 * Get pest profile by ID
 */
export function getPestProfile(pestId: string): ExtendedPestProfile | undefined {
  return PEST_PROFILES.find(p => p.id === pestId);
}

/**
 * Check if crop is susceptible to disease
 */
export function isCropSusceptible(cropType: CropType, diseaseId: string): boolean {
  const disease = getDiseaseProfile(diseaseId);
  if (!disease) return false;
  return disease.diseaseTriangle.susceptibleHost.includes(cropType);
}

/**
 * Calculate pest damage based on population and crop stage
 */
export function calculatePestDamage(
  pestId: string,
  population: number,
  cropStage: GrowthStage,
  beneficialSuppression: number // 0-100
): number {
  const pest = getPestProfile(pestId);
  if (!pest) return 0;
  
  const damageRate = pest.damageCurve[cropStage] / 100;
  const effectivePopulation = population * (1 - beneficialSuppression / 100);
  
  return Math.min(100, effectivePopulation * damageRate);
}

/**
 * Simulate disease spread in a field
 */
export function simulateDiseaseSpread(
  currentInfection: DiseaseInfection,
  weatherIndex: WeatherDiseaseIndex,
  days: number
): DiseaseInfection {
  const disease = getDiseaseProfile(currentInfection.diseaseId);
  if (!disease) return currentInfection;
  
  const spreadRate = disease.spreadRate * (weatherIndex.combinedIndex / 100);
  const dailySpread = spreadRate / 100;
  
  const newSpread = Math.min(100, 
    currentInfection.spread + (dailySpread * days * 100)
  );
  
  // Severity increases with spread
  const severityIncrease = newSpread > currentInfection.spread ? 2 * days : 0;
  const newSeverity = Math.min(100, currentInfection.severity + severityIncrease);
  
  return {
    ...currentInfection,
    spread: newSpread,
    severity: newSeverity
  };
}

/**
 * Calculate integrated pest management (IPM) score
 */
export function calculateIPMScore(
  fieldPests: PestInfestation[],
  fieldDiseases: DiseaseInfection[],
  beneficialPopulations: Record<string, number>,
  treatments: TreatmentRecord[]
): {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
} {
  let score = 100;
  const recommendations: string[] = [];
  
  // Penalize high pest populations without treatment
  fieldPests.forEach(infestation => {
    const pest = getPestProfile(infestation.pestId);
    if (pest && infestation.population > pest.economicThreshold) {
      score -= 15;
      recommendations.push(`Treat ${pest.name} - above economic threshold`);
    }
  });
  
  // Reward beneficial insect presence
  const totalBeneficials = Object.values(beneficialPopulations).reduce((a, b) => a + b, 0);
  if (totalBeneficials > 50) {
    score += 10;
    recommendations.push('Maintain beneficial habitat - good biocontrol present');
  }
  
  // Penalize excessive chemical use
  const recentChemicalTreatments = treatments.filter(t => 
    t.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
    !t.product?.includes('biological') &&
    !t.product?.includes('Bacillus')
  );
  
  if (recentChemicalTreatments.length > 4) {
    score -= 20;
    recommendations.push('Reduce chemical sprays - consider resistance management');
  }
  
  // Disease management
  fieldDiseases.forEach(disease => {
    if (disease.severity > 50) {
      score -= 15;
      recommendations.push(`Disease outbreak requires attention: ${disease.diseaseId}`);
    }
  });
  
  score = Math.max(0, Math.min(100, score));
  
  const status = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';
  
  return { score, status, recommendations };
}

// Mock data exports for compatibility with existing UI components
export const REGIONAL_ALERTS: any[] = [];
export const PEST_INFESTATIONS: any[] = [];
export const DISEASE_INCIDENTS: any[] = [];
export const WEED_PRESSURE: any[] = [];
export const TREATMENT_RECOMMENDATIONS: any[] = [];

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-500';
    case 'high': return 'text-orange-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
}

export function getPressureLevelColor(level: string): string {
  switch (level) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'immediate': return 'text-red-500';
    case 'soon': return 'text-orange-500';
    case 'scheduled': return 'text-blue-500';
    default: return 'text-gray-500';
  }
}

const pestDiseaseData = {
  analyzeDiseaseTriangle,
  calculateDiseaseWeatherIndex,
  simulatePestLifecycle,
  calculateEconomicThreshold,
  updateResistanceProfile,
  recommendRotationStrategy,
  calculateBiologicalControl,
  calculatePestDamage,
  simulateDiseaseSpread,
  calculateIPMScore,
  getDiseaseProfile,
  getPestProfile,
  isCropSusceptible,
  DISEASE_PROFILES,
  PEST_PROFILES,
  BENEFICIAL_INSECTS,
  PEST_LIFECYCLE_PARAMS,
  DEFAULT_DISEASE_REQUIREMENTS,
  REGIONAL_ALERTS,
  PEST_INFESTATIONS,
  DISEASE_INCIDENTS,
  WEED_PRESSURE,
  getSeverityColor
};

export default pestDiseaseData;
