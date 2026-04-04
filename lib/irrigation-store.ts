// @ts-nocheck
/**
 * Irrigation Management System for Agri-OS
 * 
 * Features:
 * - Soil moisture sensors with real-time data
 * - ET (Evapotranspiration) calculations
 * - Irrigation scheduling (drip, sprinkler, flood)
 * - Water stress impact on yield by crop stage
 * - Drought tolerance curves
 * - Water costs and pump fuel consumption
 */

import type { 
  Field, 
  CropType, 
  GrowthStage, 
  WeatherConditions,
  SoilTexture,
  IrrigationSystem
} from '@/types';

// ============================================================================
// SOIL MOISTURE SENSOR SYSTEM
// ============================================================================

export interface SoilMoistureSensor {
  id: string;
  fieldId: string;
  location: { x: number; y: number }; // relative position in field (0-1)
  depth: number; // inches (typically 6, 12, 24, 36)
  currentReading: number; // volumetric water content (VWC) %
  temperature: number; // °F at sensor depth
  ec: number; // electrical conductivity dS/m (salinity indicator)
  lastReading: Date;
  batteryLevel: number; // 0-100
  status: 'active' | 'low_battery' | 'offline' | 'error';
  // Calibrated values for this soil
  fieldCapacity: number; // % VWC at field capacity
  permanentWiltingPoint: number; // % VWC at PWP
}

export interface SoilMoistureData {
  sensorId: string;
  timestamp: Date;
  vwc: number; // volumetric water content %
  temperature: number;
  ec: number;
  // Derived values
  plantAvailableWater: number; // % of available water capacity
  irrigationNeeded: boolean;
  daysToDepletion: number;
}

export interface SensorNetwork {
  fieldId: string;
  sensors: SoilMoistureSensor[];
  coverage: number; // % of field covered
  averageMoisture: number; // field average VWC
  moistureMap: MoistureZone[];
  recommendations: IrrigationRecommendation[];
}

export interface MoistureZone {
  id: string;
  boundary: { x: number; y: number }[];
  averageVWC: number;
  variability: number; // coefficient of variation
  irrigationPriority: 'high' | 'medium' | 'low';
}

// Soil moisture constants by texture
export const SOIL_WATER_CONSTANTS: Record<SoilTexture, {
  fieldCapacity: number; // % VWC
  permanentWiltingPoint: number; // % VWC
  availableWaterCapacity: number; // % (FC - PWP)
  infiltrationRate: number; // inches/hour
}> = {
  sand: { fieldCapacity: 10, permanentWiltingPoint: 4, availableWaterCapacity: 6, infiltrationRate: 6.0 },
  loamy_sand: { fieldCapacity: 12, permanentWiltingPoint: 5, availableWaterCapacity: 7, infiltrationRate: 4.0 },
  sandy_loam: { fieldCapacity: 18, permanentWiltingPoint: 8, availableWaterCapacity: 10, infiltrationRate: 2.5 },
  loam: { fieldCapacity: 28, permanentWiltingPoint: 14, availableWaterCapacity: 14, infiltrationRate: 1.5 },
  silt_loam: { fieldCapacity: 32, permanentWiltingPoint: 12, availableWaterCapacity: 20, infiltrationRate: 1.0 },
  silt: { fieldCapacity: 30, permanentWiltingPoint: 10, availableWaterCapacity: 20, infiltrationRate: 0.8 },
  sandy_clay_loam: { fieldCapacity: 26, permanentWiltingPoint: 14, availableWaterCapacity: 12, infiltrationRate: 1.0 },
  clay_loam: { fieldCapacity: 34, permanentWiltingPoint: 20, availableWaterCapacity: 14, infiltrationRate: 0.5 },
  silty_clay_loam: { fieldCapacity: 36, permanentWiltingPoint: 18, availableWaterCapacity: 18, infiltrationRate: 0.4 },
  sandy_clay: { fieldCapacity: 28, permanentWiltingPoint: 16, availableWaterCapacity: 12, infiltrationRate: 0.4 },
  silty_clay: { fieldCapacity: 38, permanentWiltingPoint: 22, availableWaterCapacity: 16, infiltrationRate: 0.3 },
  clay: { fieldCapacity: 40, permanentWiltingPoint: 24, availableWaterCapacity: 16, infiltrationRate: 0.2 }
};

/**
 * Calculate plant available water percentage
 */
export function calculatePlantAvailableWater(
  currentVWC: number,
  fieldCapacity: number,
  permanentWiltingPoint: number
): {
  paw: number; // % of available water capacity
  depletion: number; // % depleted from FC
  stressLevel: 'none' | 'mild' | 'moderate' | 'severe';
} {
  const awc = fieldCapacity - permanentWiltingPoint;
  const available = currentVWC - permanentWiltingPoint;
  const paw = Math.max(0, Math.min(100, (available / awc) * 100));
  const depletion = 100 - paw;
  
  let stressLevel: typeof stressLevel = 'none';
  if (paw <= 25) stressLevel = 'severe';
  else if (paw <= 50) stressLevel = 'moderate';
  else if (paw <= 70) stressLevel = 'mild';
  
  return { paw, depletion, stressLevel };
}

/**
 * Simulate sensor readings based on actual conditions
 */
export function simulateSensorReading(
  sensor: SoilMoistureSensor,
  weather: WeatherConditions,
  cropWaterUse: number, // inches per day
  irrigationApplied: number // inches
): SoilMoistureData {
  // Simple water balance
  const waterConstants = SOIL_WATER_CONSTANTS[getSoilTexture(sensor)];
  
  // Precipitation/irrigation input
  const waterInput = (weather.precipitation || 0) + irrigationApplied;
  
  // Water loss (ET + drainage)
  const waterLoss = cropWaterUse + Math.max(0, 
    sensor.currentReading - waterConstants.fieldCapacity
  ) * 0.1;
  
  // New VWC
  const newVWC = Math.max(
    waterConstants.permanentWiltingPoint,
    Math.min(waterConstants.fieldCapacity, 
      sensor.currentReading + (waterInput - waterLoss) * 0.5 // rough conversion
    )
  );
  
  const paw = calculatePlantAvailableWater(
    newVWC, 
    waterConstants.fieldCapacity, 
    waterConstants.permanentWiltingPoint
  );
  
  // Days to depletion estimate
  const daysToDepletion = paw.paw > 50 ? 
    (paw.paw - 50) / 100 * (sensor.depth / 6) / cropWaterUse : 0;
  
  return {
    sensorId: sensor.id,
    timestamp: new Date(),
    vwc: newVWC,
    temperature: weather.temperature || 65,
    ec: sensor.ec,
    plantAvailableWater: paw.paw,
    irrigationNeeded: paw.paw < 50,
    daysToDepletion: Math.max(0, daysToDepletion)
  };
}

function getSoilTexture(sensor: SoilMoistureSensor): SoilTexture {
  // Default to loam if unknown
  return 'loam';
}

// ============================================================================
// EVAPOTRANSPIRATION (ET) CALCULATIONS
// ============================================================================

export interface ETCalculation {
  date: Date;
  eto: number; // Reference ET (inches)
  etc: number; // Crop ET (inches)
  cropCoefficient: number; // Kc
  growthStage: GrowthStage;
  waterStressFactor: number; // 0-1, reduces ET
  netIrrigationNeed: number; // inches needed
}

// Crop coefficients by growth stage
export const CROP_COEFFICIENTS: Record<CropType, Record<GrowthStage, number>> = {
  lettuce: { germination: 0.3, seedling: 0.5, vegetative: 0.9, reproductive: 0.95, grain_filling: 0.85, maturity: 0.7, senescence: 0.5 },
  broccoli: { germination: 0.3, seedling: 0.5, vegetative: 0.9, reproductive: 1.0, grain_filling: 0.9, maturity: 0.7, senescence: 0.5 },
  wheat: { germination: 0.3, seedling: 0.4, vegetative: 0.8, reproductive: 1.1, grain_filling: 0.5, maturity: 0.3, senescence: 0.2 },
  strawberries: { germination: 0.3, seedling: 0.4, vegetative: 0.8, reproductive: 0.9, grain_filling: 0.85, maturity: 0.8, senescence: 0.6 },
  corn: { germination: 0.3, seedling: 0.4, vegetative: 0.8, reproductive: 1.15, grain_filling: 0.9, maturity: 0.6, senescence: 0.3 },
  soybeans: { germination: 0.3, seedling: 0.4, vegetative: 0.85, reproductive: 1.1, grain_filling: 0.7, maturity: 0.4, senescence: 0.2 },
  cotton: { germination: 0.3, seedling: 0.4, vegetative: 0.85, reproductive: 1.15, grain_filling: 0.8, maturity: 0.6, senescence: 0.4 },
  tomatoes: { germination: 0.3, seedling: 0.45, vegetative: 0.8, reproductive: 1.05, grain_filling: 0.9, maturity: 0.7, senescence: 0.5 },
  potatoes: { germination: 0.3, seedling: 0.4, vegetative: 0.85, reproductive: 1.1, grain_filling: 1.0, maturity: 0.7, senescence: 0.4 },
  alfalfa: { germination: 0.3, seedling: 0.5, vegetative: 0.95, reproductive: 1.0, grain_filling: 0.9, maturity: 0.8, senescence: 0.6 },
  oats: { germination: 0.3, seedling: 0.4, vegetative: 0.75, reproductive: 1.05, grain_filling: 0.45, maturity: 0.25, senescence: 0.15 },
  barley: { germination: 0.3, seedling: 0.4, vegetative: 0.75, reproductive: 1.05, grain_filling: 0.45, maturity: 0.25, senescence: 0.15 },
  canola: { germination: 0.3, seedling: 0.4, vegetative: 0.8, reproductive: 1.05, grain_filling: 0.65, maturity: 0.35, senescence: 0.2 },
  sunflowers: { germination: 0.3, seedling: 0.4, vegetative: 0.8, reproductive: 1.0, grain_filling: 0.75, maturity: 0.5, senescence: 0.3 },
  rice: { germination: 0.5, seedling: 0.6, vegetative: 1.05, reproductive: 1.15, grain_filling: 0.95, maturity: 0.7, senescence: 0.5 }
};

/**
 * Calculate reference ET using Penman-Monteith (simplified)
 */
export function calculateReferenceET(
  weather: WeatherConditions,
  latitude: number,
  dayOfYear: number
): number {
  // Simplified Hargreaves-Samani method
  const Tmax = weather.temperature + 10; // Estimate high
  const Tmin = weather.temperature - 10; // Estimate low
  const Tavg = weather.temperature;
  
  // Extraterrestrial radiation estimate (simplified)
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI / 365) * dayOfYear);
  const delta = 0.409 * Math.sin((2 * Math.PI / 365) * dayOfYear - 1.39);
  const phi = (Math.PI / 180) * latitude;
  const ws = Math.acos(-Math.tan(phi) * Math.tan(delta));
  const Ra = (24 * 60 / Math.PI) * 0.082 * dr * (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
  
  // Hargreaves equation
  const eto = 0.0023 * (Tavg + 17.8) * Math.pow(Tmax - Tmin, 0.5) * Ra;
  
  // Convert mm to inches and ensure positive
  return Math.max(0, eto * 0.03937);
}

/**
 * Calculate crop-specific ET
 */
export function calculateCropET(
  weather: WeatherConditions,
  crop: CropType,
  growthStage: GrowthStage,
  fieldLatitude: number,
  dayOfYear: number,
  waterStress: number = 0 // 0-100
): ETCalculation {
  const eto = calculateReferenceET(weather, fieldLatitude, dayOfYear);
  const kc = CROP_COEFFICIENTS[crop]?.[growthStage] || 0.8;
  
  // Water stress factor (0 = no stress, 1 = severe stress)
  const waterStressFactor = Math.max(0, 1 - (waterStress / 100) * 1.5);
  
  const etc = eto * kc * waterStressFactor;
  
  // Effective precipitation
  const effectivePrecip = Math.min(weather.precipitation || 0, etc);
  
  return {
    date: new Date(),
    eto,
    etc,
    cropCoefficient: kc,
    growthStage,
    waterStressFactor,
    netIrrigationNeed: Math.max(0, etc - effectivePrecip)
  };
}

/**
 * Calculate cumulative ET and water balance
 */
export function calculateWaterBalance(
  etCalculations: ETCalculation[],
  precipitation: number[],
  irrigation: number[],
  soilAWC: number // inches of available water in root zone
): {
  cumulativeET: number;
  cumulativePrecip: number;
  cumulativeIrrigation: number;
  waterDeficit: number;
  soilMoistureDepletion: number; // %
  irrigationEfficiency: number;
} {
  const cumulativeET = etCalculations.reduce((sum, et) => sum + et.etc, 0);
  const cumulativePrecip = precipitation.reduce((sum, p) => sum + p, 0);
  const cumulativeIrrigation = irrigation.reduce((sum, i) => sum + i, 0);
  
  const waterBalance = cumulativePrecip + cumulativeIrrigation - cumulativeET;
  const waterDeficit = Math.max(0, -waterBalance);
  
  const soilMoistureDepletion = Math.min(100, Math.max(0, 
    100 - ((soilAWC + waterBalance) / soilAWC) * 100
  ));
  
  const irrigationEfficiency = cumulativeIrrigation > 0 
    ? Math.min(100, ((cumulativeIrrigation - (cumulativeIrrigation * 0.1)) / cumulativeIrrigation) * 100)
    : 100;
  
  return {
    cumulativeET,
    cumulativePrecip,
    cumulativeIrrigation,
    waterDeficit,
    soilMoistureDepletion,
    irrigationEfficiency
  };
}

// ============================================================================
// IRRIGATION SCHEDULING
// ============================================================================

export type IrrigationType = 'drip' | 'sprinkler' | 'flood' | 'pivot' | 'furrow' | 'center_pivot';

export interface IrrigationSchedule {
  id: string;
  fieldId: string;
  startTime: Date;
  duration: number; // minutes
  applicationRate: number; // inches per hour
  targetDepth: number; // inches to apply
  actualDepth: number; // inches actually applied
  efficiency: number; // %
  type: IrrigationType;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  weatherConditions: WeatherConditions;
  cost: {
    fuel: number; // gallons
    electricity: number; // kWh
    labor: number; // hours
    total: number; // $
  };
}

export interface IrrigationRecommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  suggestedStartTime: Date;
  duration: number; // minutes
  depth: number; // inches
  method: IrrigationType;
  estimatedCost: number;
  reasoning: string;
  expectedBenefit: string;
}

// Irrigation system efficiencies and application rates
export const IRRIGATION_SYSTEMS: Record<IrrigationType, {
  efficiency: number; // %
  applicationRate: number; // inches/hour
  uniformity: number; // % distribution uniformity
  suitableCrops: CropType[];
  suitableSoils: SoilTexture[];
  energyRequirement: number; // kWh per acre-inch
  laborRequirement: number; // hours per acre
}> = {
  drip: {
    efficiency: 90,
    applicationRate: 0.05,
    uniformity: 90,
    suitableCrops: ['tomatoes', 'potatoes', 'lettuce', 'broccoli', 'strawberries', 'cotton'],
    suitableSoils: ['sand', 'loamy_sand', 'sandy_loam', 'loam', 'silt_loam', 'silty_clay_loam'],
    energyRequirement: 15,
    laborRequirement: 2
  },
  sprinkler: {
    efficiency: 75,
    applicationRate: 0.3,
    uniformity: 80,
    suitableCrops: ['lettuce', 'broccoli', 'strawberries', 'tomatoes', 'alfalfa'],
    suitableSoils: ['sandy_loam', 'loam', 'silt_loam', 'silt'],
    energyRequirement: 25,
    laborRequirement: 1.5
  },
  pivot: {
    efficiency: 85,
    applicationRate: 0.4,
    uniformity: 85,
    suitableCrops: ['corn', 'soybeans', 'wheat', 'cotton', 'potatoes', 'alfalfa'],
    suitableSoils: ['sandy_loam', 'loam', 'silt_loam', 'silty_clay_loam'],
    energyRequirement: 20,
    laborRequirement: 0.5
  },
  center_pivot: {
    efficiency: 85,
    applicationRate: 0.4,
    uniformity: 85,
    suitableCrops: ['corn', 'soybeans', 'wheat', 'cotton', 'potatoes', 'alfalfa'],
    suitableSoils: ['sandy_loam', 'loam', 'silt_loam', 'silty_clay_loam'],
    energyRequirement: 20,
    laborRequirement: 0.5
  },
  flood: {
    efficiency: 60,
    applicationRate: 1.0,
    uniformity: 70,
    suitableCrops: ['rice', 'alfalfa', 'wheat', 'oats', 'barley'],
    suitableSoils: ['clay', 'silty_clay', 'clay_loam', 'silty_clay_loam'],
    energyRequirement: 10,
    laborRequirement: 4
  },
  furrow: {
    efficiency: 65,
    applicationRate: 0.8,
    uniformity: 75,
    suitableCrops: ['corn', 'cotton', 'tomatoes', 'potatoes'],
    suitableSoils: ['loam', 'silt_loam', 'clay_loam', 'silty_clay_loam'],
    energyRequirement: 12,
    laborRequirement: 3
  }
};

/**
 * Generate irrigation schedule recommendation
 */
export function generateIrrigationSchedule(
  field: Field,
  crop: CropType,
  growthStage: GrowthStage,
  currentMoisture: number, // % available water
  forecast: WeatherConditions[],
  availableSystems: IrrigationType[],
  energyCost: number, // $/kWh
  fuelCost: number // $/gallon
): IrrigationRecommendation[] {
  const recommendations: IrrigationRecommendation[] = [];
  
  // Determine water need based on stress sensitivity
  const criticalStages = getCriticalWaterStages(crop);
  const isCritical = criticalStages.includes(growthStage);
  const triggerPoint = isCritical ? 60 : 50; // % AWC
  
  if (currentMoisture > triggerPoint) {
    return []; // No irrigation needed
  }
  
  // Check forecast for rain
  const rainExpected = forecast.slice(0, 3).some(w => w.precipitation > 0.2);
  if (rainExpected && currentMoisture > 30) {
    return [{
      priority: 'low',
      suggestedStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 0,
      depth: 0,
      method: availableSystems[0],
      estimatedCost: 0,
      reasoning: 'Rain expected in next 24-72 hours - delay irrigation',
      expectedBenefit: 'Avoid unnecessary irrigation costs'
    }];
  }
  
  // Calculate water needed
  const waterNeeded = (triggerPoint - currentMoisture) / 100 * getRootZoneDepth(crop, growthStage);
  const adjustedWaterNeeded = waterNeeded / 0.85; // Account for application efficiency
  
  // Evaluate each available system
  availableSystems.forEach(systemType => {
    const system = IRRIGATION_SYSTEMS[systemType];
    
    // Check suitability
    if (!system.suitableCrops.includes(crop)) return;
    
    const duration = (adjustedWaterNeeded / system.applicationRate) * 60; // minutes
    const energyUse = energyCost * system.energyRequirement * adjustedWaterNeeded;
    const laborCost = system.laborRequirement * 25; // $25/hour
    const totalCost = energyUse + laborCost;
    
    let priority: IrrigationRecommendation['priority'] = 'medium';
    if (currentMoisture < 30) priority = 'urgent';
    else if (currentMoisture < 40) priority = 'high';
    else if (isCritical) priority = 'high';
    
    recommendations.push({
      priority,
      suggestedStartTime: calculateOptimalStartTime(forecast, systemType),
      duration: Math.round(duration),
      depth: Math.round(adjustedWaterNeeded * 100) / 100,
      method: systemType,
      estimatedCost: Math.round(totalCost * 100) / 100,
      reasoning: generateReasoning(currentMoisture, growthStage, isCritical, systemType),
      expectedBenefit: `Maintain optimal growth, prevent ${isCritical ? 'significant' : 'moderate'} yield loss`
    });
  });
  
  // Sort by priority and cost-effectiveness
  return recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.estimatedCost - b.estimatedCost;
  });
}

function getCriticalWaterStages(crop: CropType): GrowthStage[] {
  const critical: Record<CropType, GrowthStage[]> = {
    corn: ['reproductive', 'grain_filling'],
    soybeans: ['reproductive', 'grain_filling'],
    wheat: ['reproductive', 'grain_filling'],
    cotton: ['reproductive', 'grain_filling'],
    tomatoes: ['reproductive', 'grain_filling'],
    potatoes: ['vegetative', 'reproductive'],
    lettuce: ['vegetative'],
    broccoli: ['reproductive'],
    strawberries: ['reproductive', 'grain_filling'],
    alfalfa: ['vegetative', 'reproductive'],
    oats: ['reproductive'],
    barley: ['reproductive'],
    canola: ['reproductive'],
    sunflowers: ['reproductive', 'grain_filling'],
    rice: ['vegetative', 'reproductive', 'grain_filling']
  };
  return critical[crop] || ['reproductive'];
}

function getRootZoneDepth(crop: CropType, growthStage: GrowthStage): number {
  const depths: Record<CropType, number> = {
    lettuce: 12,
    broccoli: 18,
    wheat: 36,
    strawberries: 18,
    corn: 48,
    soybeans: 42,
    cotton: 48,
    tomatoes: 36,
    potatoes: 24,
    alfalfa: 60,
    oats: 30,
    barley: 30,
    canola: 36,
    sunflowers: 48,
    rice: 12
  };
  return depths[crop] || 24;
}

function calculateOptimalStartTime(forecast: WeatherConditions[], systemType: IrrigationType): Date {
  // Avoid irrigating during high wind or extreme heat
  const now = new Date();
  
  // Find best window (typically early morning)
  const bestHour = 4; // 4 AM
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(bestHour, 0, 0, 0);
  
  return tomorrow;
}

function generateReasoning(
  moisture: number, 
  stage: GrowthStage, 
  isCritical: boolean,
  systemType: IrrigationType
): string {
  const parts: string[] = [];
  
  parts.push(`Soil moisture at ${moisture.toFixed(0)}% of available water capacity`);
  parts.push(`Crop in ${stage} growth stage`);
  
  if (isCritical) {
    parts.push('CRITICAL water-sensitive growth stage');
  }
  
  parts.push(`Using ${systemType} irrigation system`);
  
  return parts.join('. ');
}

// ============================================================================
// WATER STRESS AND YIELD IMPACT
// ============================================================================

export interface DroughtTolerance {
  crop: CropType;
  toleranceLevel: 'low' | 'moderate' | 'high';
  criticalWaterPeriods: GrowthStage[];
  yieldResponseFactor: number; // Ky - higher = more sensitive
  droughtRecovery: number; // 0-100 ability to recover
}

export const DROUGHT_TOLERANCE: Record<CropType, DroughtTolerance> = {
  lettuce: { crop: 'lettuce', toleranceLevel: 'low', criticalWaterPeriods: ['vegetative'], yieldResponseFactor: 1.2, droughtRecovery: 30 },
  broccoli: { crop: 'broccoli', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive'], yieldResponseFactor: 1.1, droughtRecovery: 40 },
  wheat: { crop: 'wheat', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 1.1, droughtRecovery: 50 },
  strawberries: { crop: 'strawberries', toleranceLevel: 'low', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 1.0, droughtRecovery: 35 },
  corn: { crop: 'corn', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 1.25, droughtRecovery: 40 },
  soybeans: { crop: 'soybeans', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 1.0, droughtRecovery: 60 },
  cotton: { crop: 'cotton', toleranceLevel: 'high', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 0.9, droughtRecovery: 55 },
  tomatoes: { crop: 'tomatoes', toleranceLevel: 'low', criticalWaterPeriods: ['reproductive', 'grain_filling'], yieldResponseFactor: 1.15, droughtRecovery: 35 },
  potatoes: { crop: 'potatoes', toleranceLevel: 'low', criticalWaterPeriods: ['vegetative', 'reproductive'], yieldResponseFactor: 1.1, droughtRecovery: 30 },
  alfalfa: { crop: 'alfalfa', toleranceLevel: 'high', criticalWaterPeriods: ['vegetative'], yieldResponseFactor: 0.85, droughtRecovery: 70 },
  oats: { crop: 'oats', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive'], yieldResponseFactor: 1.05, droughtRecovery: 45 },
  barley: { crop: 'barley', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive'], yieldResponseFactor: 1.05, droughtRecovery: 45 },
  canola: { crop: 'canola', toleranceLevel: 'moderate', criticalWaterPeriods: ['reproductive'], yieldResponseFactor: 1.0, droughtRecovery: 50 },
  sunflowers: { crop: 'sunflowers', toleranceLevel: 'high', criticalWaterPeriods: ['reproductive'], yieldResponseFactor: 0.95, droughtRecovery: 60 },
  rice: { crop: 'rice', toleranceLevel: 'low', criticalWaterPeriods: ['vegetative', 'reproductive'], yieldResponseFactor: 1.3, droughtRecovery: 20 }
};

/**
 * Calculate water stress impact on yield
 * Uses FAO 33 yield response model: (1 - Ya/Ym) = Ky * (1 - ETa/ETm)
 */
export function calculateWaterStressImpact(
  crop: CropType,
  growthStage: GrowthStage,
  actualET: number,
  maxET: number,
  soilMoistureDepletion: number
): {
  yieldReduction: number; // %
  qualityImpact: number; // %
  recoveryPotential: number; // %
  stageSpecificImpact: string;
} {
  const tolerance = DROUGHT_TOLERANCE[crop];
  const isCritical = tolerance.criticalWaterPeriods.includes(growthStage);
  
  // ET deficit ratio
  const etDeficitRatio = Math.max(0, 1 - (actualET / maxET));
  
  // Apply response factor (higher Ky = more sensitive)
  let effectiveKy = tolerance.yieldResponseFactor;
  if (isCritical) effectiveKy *= 1.3; // Increase sensitivity during critical stages
  
  const yieldReduction = Math.min(100, effectiveKy * etDeficitRatio * 100);
  
  // Quality impact varies by crop
  let qualityImpact = yieldReduction * 0.5;
  if (crop === 'tomatoes' || crop === 'strawberries') qualityImpact = yieldReduction * 0.8;
  if (crop === 'wheat') qualityImpact = yieldReduction * 0.3; // Protein increases with stress
  
  // Recovery potential decreases with stage
  const stageRecoveryFactors: Record<GrowthStage, number> = {
    germination: 0.8,
    seedling: 0.7,
    vegetative: 0.6,
    reproductive: 0.4,
    grain_filling: 0.2,
    maturity: 0.1,
    senescence: 0
  };
  const recoveryPotential = tolerance.droughtRecovery * stageRecoveryFactors[growthStage];
  
  // Stage-specific impact description
  let stageSpecificImpact = '';
  if (growthStage === 'reproductive') {
    stageSpecificImpact = 'Flowering/pollination may be impaired, leading to poor fruit/seed set';
  } else if (growthStage === 'grain_filling') {
    stageSpecificImpact = 'Reduced grain/fruit size and weight';
  } else if (growthStage === 'vegetative') {
    stageSpecificImpact = 'Reduced plant growth and canopy development';
  }
  
  return {
    yieldReduction: Math.round(yieldReduction * 10) / 10,
    qualityImpact: Math.round(qualityImpact * 10) / 10,
    recoveryPotential: Math.round(recoveryPotential),
    stageSpecificImpact
  };
}

/**
 * Calculate drought tolerance curve
 */
export function calculateDroughtToleranceCurve(
  crop: CropType
): {
  stages: GrowthStage[];
  tolerance: number[]; // 0-100 at each stage
  criticalThreshold: number; // % AWC where stress begins
} {
  const tolerance = DROUGHT_TOLERANCE[crop];
  const stages: GrowthStage[] = ['germination', 'seedling', 'vegetative', 'reproductive', 'grain_filling', 'maturity'];
  
  const stageTolerance = stages.map(stage => {
    const baseTolerance = tolerance.toleranceLevel === 'high' ? 70 
      : tolerance.toleranceLevel === 'moderate' ? 50 
      : 30;
    
    if (tolerance.criticalWaterPeriods.includes(stage)) {
      return baseTolerance * 0.6; // More sensitive during critical periods
    }
    return baseTolerance;
  });
  
  return {
    stages,
    tolerance: stageTolerance,
    criticalThreshold: 50
  };
}

// ============================================================================
// WATER COSTS AND PUMP CALCULATIONS
// ============================================================================

export interface WaterCostCalculation {
  volume: number; // acre-inches
  pumpingLift: number; // feet from water source to field
  pressure: number; // psi at nozzle
  pumpEfficiency: number; // %
  
  energy: {
    type: 'diesel' | 'electric' | 'gasoline';
    amount: number; // gallons or kWh
    cost: number; // $
  };
  
  waterCost: number; // $ (if purchased)
  laborCost: number; // $
  maintenanceCost: number; // $ per acre-inch
  totalCost: number; // $ per acre
  costPerAcreInch: number; // $
}

/**
 * Calculate pumping energy requirements
 */
export function calculatePumpingEnergy(
  volume: number, // acre-inches
  lift: number, // feet
  pressure: number, // psi
  pumpEfficiency: number,
  energyType: 'diesel' | 'electric' | 'gasoline'
): {
  amount: number;
  cost: number;
  unit: string;
} {
  // Total head (lift + pressure conversion)
  // 1 psi = 2.31 feet of head
  const totalHead = lift + (pressure * 2.31);
  
  // Water weight: 1 acre-inch = 226,610 lbs
  const waterWeight = volume * 226610;
  
  // Work required (ft-lbs)
  const work = waterWeight * totalHead;
  
  // Energy required accounting for efficiency
  const efficiency = pumpEfficiency / 100;
  const energyRequired = work / (efficiency * 550 * 3600); // horsepower-hours
  
  let amount: number;
  let cost: number;
  let unit: string;
  
  switch (energyType) {
    case 'diesel':
      // 1 gallon diesel ≈ 16 hp-hours
      amount = energyRequired / 16;
      cost = amount * 3.50; // $3.50/gallon
      unit = 'gallons';
      break;
    case 'gasoline':
      // 1 gallon gas ≈ 12 hp-hours
      amount = energyRequired / 12;
      cost = amount * 3.80;
      unit = 'gallons';
      break;
    case 'electric':
      // 1 kWh = 1.34 hp-hours
      amount = energyRequired / 1.34;
      cost = amount * 0.12; // $0.12/kWh
      unit = 'kWh';
      break;
  }
  
  return {
    amount: Math.round(amount * 100) / 100,
    cost: Math.round(cost * 100) / 100,
    unit
  };
}

/**
 * Calculate total irrigation cost
 */
export function calculateIrrigationCost(
  params: {
    volume: number; // acre-inches
    lift: number; // feet
    pressure: number; // psi
    pumpEfficiency: number; // %
    energyType: 'diesel' | 'electric' | 'gasoline';
    waterPrice: number; // $ per acre-inch (if applicable)
    laborRate: number; // $ per hour
    laborHours: number;
    maintenanceRate: number; // $ per acre-inch
  }
): WaterCostCalculation {
  const energy = calculatePumpingEnergy(
    params.volume, params.lift, params.pressure, 
    params.pumpEfficiency, params.energyType
  );
  
  const waterCost = params.waterPrice * params.volume;
  const laborCost = params.laborRate * params.laborHours;
  const maintenanceCost = params.maintenanceRate * params.volume;
  
  const totalCost = energy.cost + waterCost + laborCost + maintenanceCost;
  
  return {
    volume: params.volume,
    pumpingLift: params.lift,
    pressure: params.pressure,
    pumpEfficiency: params.pumpEfficiency,
    energy: {
      type: params.energyType,
      amount: energy.amount,
      cost: energy.cost
    },
    waterCost,
    laborCost,
    maintenanceCost,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerAcreInch: Math.round((totalCost / params.volume) * 100) / 100
  };
}

// ============================================================================
// INTEGRATED IRRIGATION MANAGEMENT
// ============================================================================

export interface IrrigationManagementPlan {
  fieldId: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  totalWaterBudget: number; // acre-inches allocated
  waterUsed: number;
  irrigationEvents: IrrigationSchedule[];
  sensorNetwork: SensorNetwork;
  etCalculations: ETCalculation[];
  recommendations: IrrigationRecommendation[];
  costSummary: {
    totalEnergyCost: number;
    totalLaborCost: number;
    totalWaterCost: number;
    costPerAcre: number;
  };
}

/**
 * Create comprehensive irrigation management plan
 */
export function createIrrigationPlan(
  field: Field,
  crop: CropType,
  waterBudget: number,
  sensors: SoilMoistureSensor[],
  forecast: WeatherConditions[],
  energyCost: number,
  fuelCost: number
): IrrigationManagementPlan {
  const plan: IrrigationManagementPlan = {
    fieldId: field.id,
    season: 'summer',
    totalWaterBudget: waterBudget,
    waterUsed: 0,
    irrigationEvents: [],
    sensorNetwork: {
      fieldId: field.id,
      sensors,
      coverage: sensors.length * 5, // Assume 5 acres per sensor
      averageMoisture: sensors.reduce((s, s2) => s + s2.currentReading, 0) / sensors.length,
      moistureMap: [],
      recommendations: []
    },
    etCalculations: [],
    recommendations: [],
    costSummary: {
      totalEnergyCost: 0,
      totalLaborCost: 0,
      totalWaterCost: 0,
      costPerAcre: 0
    }
  };
  
  // Calculate ET for planning
  const latitude = field.location?.latitude || 40;
  const today = new Date();
  
  forecast.forEach((weather, index) => {
    const dayOfYear = today.getDayOfYear ? today.getDayOfYear() : 180;
    const et = calculateCropET(
      weather, crop, 'vegetative', latitude, dayOfYear + index
    );
    plan.etCalculations.push(et);
  });
  
  // Generate recommendations based on sensors
  const avgMoisture = plan.sensorNetwork.averageMoisture;
  const paw = calculatePlantAvailableWater(avgMoisture, 28, 14); // Assumed loam
  
  plan.recommendations = generateIrrigationSchedule(
    field, crop, 'vegetative', paw.paw, forecast,
    ['drip', 'sprinkler', 'pivot'],
    energyCost, fuelCost
  );
  
  return plan;
}

// Add day of year helper to Date
declare global {
  interface Date {
    getDayOfYear?(): number;
  }
}

if (!Date.prototype.getDayOfYear) {
  Date.prototype.getDayOfYear = function() {
    const start = new Date(this.getFullYear(), 0, 0);
    const diff = this.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
}

export default {
  calculatePlantAvailableWater,
  simulateSensorReading,
  calculateReferenceET,
  calculateCropET,
  calculateWaterBalance,
  generateIrrigationSchedule,
  calculateWaterStressImpact,
  calculateDroughtToleranceCurve,
  calculatePumpingEnergy,
  calculateIrrigationCost,
  createIrrigationPlan,
  SOIL_WATER_CONSTANTS,
  CROP_COEFFICIENTS,
  IRRIGATION_SYSTEMS,
  DROUGHT_TOLERANCE
};
