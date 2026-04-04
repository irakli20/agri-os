// @ts-nocheck
/**
 * Crop Data Store - Detailed Crop Profiles and Growth Models
 * 
 * Features:
 * - Detailed profiles for 6 crops: Lettuce, Broccoli, Wheat, Corn, Soybeans, Strawberries
 * - GDD (Growing Degree Day) calculations
 * - Water requirements per growth stage
 * - Nutrient uptake curves
 * - Realistic yield expectations based on USDA/NASS data
 */

import { 
  CropProfile, 
  CropType, 
  GrowthStage, 
  CropInstance,
  WeatherConditions,
  WeatherForecast 
} from '../types';

// Growing Degree Day Calculation
export interface GDDResult {
  dailyGDD: number;
  accumulatedGDD: number;
  percentComplete: number;
  currentStage: GrowthStage;
  daysToNextStage: number;
}

// Water stress calculation
export interface WaterStressResult {
  stressLevel: number; // 0-100
  etReplacementNeeded: number; // inches
  daysUntilCritical: number;
  recommendations: string[];
}

// Nutrient recommendation
export interface NutrientRecommendation {
  nitrogen: number; // lbs/acre needed
  phosphorus: number;
  potassium: number;
  sulfur: number;
  timing: string;
  method: string;
}

// ============================================================================
// CROP PROFILES WITH USDA/NASS DATA
// ============================================================================

export const CROP_PROFILES: Record<CropType, CropProfile> = {
  // ============================================================================
  // LETTUCE - Cool season annual, 45-60 days
  // ============================================================================
  lettuce: {
    type: 'lettuce',
    displayName: 'Lettuce',
    family: 'asteraceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: {
      baseTemp: 40,
      maxTemp: 80,
      totalGDD: 1200,
      byStage: {
        germination: 80,
        seedling: 150,
        vegetative: 600,
        reproductive: 0, // Harvested before reproduction
        grain_filling: 0,
        maturity: 1200,
        senescence: 0,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Germination',
        duration: { min: 3, max: 7 },
        gddRequired: 80,
        critical: true,
        description: 'Seed germination and radicle emergence',
      },
      {
        stage: 'seedling',
        name: 'Seedling',
        duration: { min: 10, max: 14 },
        gddRequired: 150,
        critical: false,
        description: 'First true leaves emerge',
      },
      {
        stage: 'vegetative',
        name: 'Leaf Development',
        duration: { min: 25, max: 35 },
        gddRequired: 600,
        critical: true,
        description: 'Rapid leaf formation and head development',
      },
      {
        stage: 'maturity',
        name: 'Harvest Ready',
        duration: { min: 5, max: 10 },
        gddRequired: 370,
        critical: true,
        description: 'Head firm and ready for harvest',
      },
    ],
    waterRequirements: {
      totalInches: 12,
      byStage: {
        germination: 1.5,
        seedling: 2.0,
        vegetative: 6.0,
        reproductive: 0,
        grain_filling: 0,
        maturity: 2.5,
        senescence: 0,
      },
      droughtTolerance: 30,
      criticalWaterPeriods: ['vegetative'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 120,
        byStage: {
          germination: 5,
          seedling: 15,
          vegetative: 65,
          reproductive: 0,
          grain_filling: 0,
          maturity: 35,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 60,
        byStage: {
          germination: 10,
          seedling: 20,
          vegetative: 25,
          reproductive: 0,
          grain_filling: 0,
          maturity: 5,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 140,
        byStage: {
          germination: 10,
          seedling: 25,
          vegetative: 75,
          reproductive: 0,
          grain_filling: 0,
          maturity: 30,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 20,
        byStage: {
          germination: 2,
          seedling: 5,
          vegetative: 10,
          reproductive: 0,
          grain_filling: 0,
          maturity: 3,
          senescence: 0,
        },
      },
      micronutrients: ['boron', 'calcium', 'magnesium'],
    },
    pestPressures: [
      { pestId: 'aphid', riskLevel: 'high', vulnerableStages: ['seedling', 'vegetative'], economicThreshold: 50 },
      { pestId: 'lettuce_root_aphid', riskLevel: 'medium', vulnerableStages: ['vegetative'], economicThreshold: 25 },
      { pestId: 'cutworm', riskLevel: 'medium', vulnerableStages: ['germination', 'seedling'], economicThreshold: 5 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'downy_mildew', riskLevel: 'high', vulnerableStages: ['vegetative'], weatherTriggers: [{ condition: 'humidity', threshold: 85, duration: 6 }] },
      { diseaseId: 'bacterial_leaf_spot', riskLevel: 'medium', vulnerableStages: ['seedling', 'vegetative'], weatherTriggers: [{ condition: 'rain', threshold: 0.5, duration: 2 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '03-15', end: '05-01' },
        summer: { start: '08-01', end: '09-01' },
        fall: { start: '09-01', end: '10-01' },
        winter: { start: '01-01', end: '02-28' },
      },
      seedRate: { min: 40000, max: 80000 }, // seeds per acre
      seedDepth: { min: 0.25, max: 0.5 },
      rowSpacing: { min: 12, max: 20 },
      soilTempMin: 40,
      companionCrops: [],
      precedingCrops: ['soybeans', 'alfalfa'],
      followingCrops: ['soybeans', 'tomatoes'],
    },
    yieldExpectations: {
      average: 350, // crates per acre (30 lbs each)
      excellent: 500,
      poor: 200,
      factors: [
        { factor: 'Optimal temperature (60-65°F)', impact: 20 },
        { factor: 'Consistent moisture', impact: 15 },
        { factor: 'Disease pressure', impact: -25 },
        { factor: 'Heat stress (>80°F)', impact: -30 },
      ],
    },
    harvest: {
      moistureTarget: 95,
      moistureDiscount: [
        { above: 90, below: 100, discount: 0 },
        { above: 80, below: 90, discount: 0.10 },
        { above: 0, below: 80, discount: 0.25 },
      ],
      equipment: ['machete', 'harvest_knife', 'cooler_trailer'],
      timing: 'Early morning for best quality',
      storageRequirements: '32°F, 95-100% humidity, 1-3 weeks max',
    },
    economics: {
      seedCost: 250,
      typicalRevenue: 8750,
      pricePerBushel: { min: 20, max: 35, average: 25 },
    },
    rotation: {
      yearsBeforeReturn: 2,
      nitrogenContribution: 0,
      soilHealthImpact: 2,
      followingCropBenefit: { tomatoes: 5, soybeans: 8 },
    },
  },

  // ============================================================================
  // BROCCOLI - Cold hardy, 70-90 days
  // ============================================================================
  broccoli: {
    type: 'broccoli',
    displayName: 'Broccoli',
    family: 'brassicaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: {
      baseTemp: 40,
      maxTemp: 85,
      totalGDD: 1800,
      byStage: {
        germination: 100,
        seedling: 250,
        vegetative: 1000,
        reproductive: 0,
        grain_filling: 0,
        maturity: 1800,
        senescence: 0,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Germination',
        duration: { min: 5, max: 10 },
        gddRequired: 100,
        critical: true,
        description: 'Seed germination',
      },
      {
        stage: 'seedling',
        name: 'Seedling',
        duration: { min: 20, max: 30 },
        gddRequired: 250,
        critical: false,
        description: 'Leaf development',
      },
      {
        stage: 'vegetative',
        name: 'Head Formation',
        duration: { min: 30, max: 40 },
        gddRequired: 1000,
        critical: true,
        description: 'Head development - critical for yield',
      },
      {
        stage: 'maturity',
        name: 'Harvest Ready',
        duration: { min: 5, max: 10 },
        gddRequired: 450,
        critical: true,
        description: 'Compact head, before flowering',
      },
    ],
    waterRequirements: {
      totalInches: 18,
      byStage: {
        germination: 2.0,
        seedling: 3.0,
        vegetative: 10.0,
        reproductive: 0,
        grain_filling: 0,
        maturity: 3.0,
        senescence: 0,
      },
      droughtTolerance: 40,
      criticalWaterPeriods: ['vegetative'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 160,
        byStage: {
          germination: 5,
          seedling: 25,
          vegetative: 100,
          reproductive: 0,
          grain_filling: 0,
          maturity: 30,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 80,
        byStage: {
          germination: 10,
          seedling: 25,
          vegetative: 35,
          reproductive: 0,
          grain_filling: 0,
          maturity: 10,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 180,
        byStage: {
          germination: 15,
          seedling: 35,
          vegetative: 100,
          reproductive: 0,
          grain_filling: 0,
          maturity: 30,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 40,
        byStage: {
          germination: 5,
          seedling: 10,
          vegetative: 20,
          reproductive: 0,
          grain_filling: 0,
          maturity: 5,
          senescence: 0,
        },
      },
      micronutrients: ['boron', 'molybdenum', 'calcium'],
    },
    pestPressures: [
      { pestId: 'cabbage_worm', riskLevel: 'high', vulnerableStages: ['vegetative', 'maturity'], economicThreshold: 20 },
      { pestId: 'cabbage_looper', riskLevel: 'high', vulnerableStages: ['vegetative'], economicThreshold: 30 },
      { pestId: 'aphid', riskLevel: 'medium', vulnerableStages: ['seedling', 'vegetative'], economicThreshold: 50 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'black_rot', riskLevel: 'high', vulnerableStages: ['seedling', 'vegetative'], weatherTriggers: [{ condition: 'humidity', threshold: 90, duration: 8 }] },
      { diseaseId: 'clubroot', riskLevel: 'medium', vulnerableStages: ['seedling'], weatherTriggers: [{ condition: 'soil_temp', threshold: 75, duration: 7 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '03-01', end: '04-15' },
        summer: { start: '07-15', end: '08-15' },
        fall: { start: '08-15', end: '09-15' },
        winter: { start: '01-15', end: '02-28' },
      },
      seedRate: { min: 12000, max: 18000 },
      seedDepth: { min: 0.5, max: 1.0 },
      rowSpacing: { min: 24, max: 36 },
      soilTempMin: 45,
      companionCrops: [],
      precedingCrops: ['soybeans', 'alfalfa'],
      followingCrops: ['lettuce', 'tomatoes'],
    },
    yieldExpectations: {
      average: 180, // boxes per acre (14 lbs each)
      excellent: 280,
      poor: 100,
      factors: [
        { factor: 'Consistent moisture', impact: 20 },
        { factor: 'Cool temperatures', impact: 15 },
        { factor: 'Clubroot pressure', impact: -35 },
        { factor: 'Heat stress (>85°F)', impact: -25 },
      ],
    },
    harvest: {
      moistureTarget: 92,
      moistureDiscount: [
        { above: 88, below: 100, discount: 0 },
        { above: 80, below: 88, discount: 0.10 },
      ],
      equipment: ['harvest_knife', 'field_boxes'],
      timing: 'When head is firm and compact, before yellowing',
      storageRequirements: '32°F, 95-100% humidity, 2-3 weeks',
    },
    economics: {
      seedCost: 350,
      typicalRevenue: 12600,
      pricePerBushel: { min: 18, max: 28, average: 22 },
    },
    rotation: {
      yearsBeforeReturn: 3,
      nitrogenContribution: 0,
      soilHealthImpact: 3,
      followingCropBenefit: { lettuce: 5, tomatoes: 8 },
    },
  },

  // ============================================================================
  // WHEAT - Winter and Spring varieties, 120-150 days
  // ============================================================================
  wheat: {
    type: 'wheat',
    displayName: 'Wheat',
    family: 'poaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: {
      baseTemp: 32,
      maxTemp: 90,
      totalGDD: 2800,
      byStage: {
        germination: 150,
        seedling: 400,
        vegetative: 1200,
        reproductive: 600,
        grain_filling: 350,
        maturity: 2800,
        senescence: 2900,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Germination & Emergence',
        duration: { min: 7, max: 14 },
        gddRequired: 150,
        critical: true,
        description: 'Seed germination and coleoptile emergence',
      },
      {
        stage: 'seedling',
        name: 'Tillering',
        duration: { min: 30, max: 50 },
        gddRequired: 400,
        critical: false,
        description: 'Multiple stems develop from each plant',
      },
      {
        stage: 'vegetative',
        name: 'Stem Elongation',
        duration: { min: 30, max: 40 },
        gddRequired: 1200,
        critical: true,
        description: 'Rapid stem growth, node development',
      },
      {
        stage: 'reproductive',
        name: 'Heading & Flowering',
        duration: { min: 10, max: 15 },
        gddRequired: 600,
        critical: true,
        description: 'Head emergence and pollination - most vulnerable stage',
      },
      {
        stage: 'grain_filling',
        name: 'Grain Fill',
        duration: { min: 20, max: 30 },
        gddRequired: 350,
        critical: true,
        description: 'Starch deposition in grain',
      },
      {
        stage: 'maturity',
        name: 'Physiological Maturity',
        duration: { min: 5, max: 10 },
        gddRequired: 100,
        critical: true,
        description: 'Grain hard, harvest ready when dry',
      },
    ],
    waterRequirements: {
      totalInches: 22,
      byStage: {
        germination: 2.0,
        seedling: 3.0,
        vegetative: 6.0,
        reproductive: 5.0,
        grain_filling: 4.0,
        maturity: 2.0,
        senescence: 0,
      },
      droughtTolerance: 60,
      criticalWaterPeriods: ['reproductive', 'grain_filling'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 120,
        byStage: {
          germination: 5,
          seedling: 20,
          vegetative: 60,
          reproductive: 25,
          grain_filling: 5,
          maturity: 5,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 50,
        byStage: {
          germination: 10,
          seedling: 20,
          vegetative: 15,
          reproductive: 3,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 90,
        byStage: {
          germination: 8,
          seedling: 20,
          vegetative: 45,
          reproductive: 12,
          grain_filling: 5,
          maturity: 0,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 15,
        byStage: {
          germination: 2,
          seedling: 5,
          vegetative: 6,
          reproductive: 2,
          grain_filling: 0,
          maturity: 0,
          senescence: 0,
        },
      },
      micronutrients: ['zinc', 'manganese', 'copper'],
    },
    pestPressures: [
      { pestId: 'hessian_fly', riskLevel: 'high', vulnerableStages: ['seedling'], economicThreshold: 5 },
      { pestId: 'aphid', riskLevel: 'medium', vulnerableStages: ['seedling', 'reproductive'], economicThreshold: 25 },
      { pestId: 'armyworm', riskLevel: 'medium', vulnerableStages: ['vegetative', 'reproductive'], economicThreshold: 3 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'stripe_rust', riskLevel: 'high', vulnerableStages: ['vegetative', 'reproductive'], weatherTriggers: [{ condition: 'humidity', threshold: 90, duration: 6 }] },
      { diseaseId: 'fusarium_head_blight', riskLevel: 'high', vulnerableStages: ['reproductive'], weatherTriggers: [{ condition: 'rain', threshold: 0.2, duration: 3 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '03-15', end: '04-30' }, // Spring wheat
        summer: { start: '09-01', end: '10-30' }, // Winter wheat
        fall: { start: '09-01', end: '10-30' }, // Winter wheat
        winter: { start: '01-01', end: '02-28' },
      },
      seedRate: { min: 90, max: 150 }, // lbs per acre
      seedDepth: { min: 0.75, max: 1.5 },
      rowSpacing: { min: 6, max: 10 },
      soilTempMin: 38,
      companionCrops: [],
      precedingCrops: ['soybeans', 'alfalfa'],
      followingCrops: ['soybeans', 'corn'],
    },
    yieldExpectations: {
      average: 50, // bushels per acre (USDA 5-year average)
      excellent: 80,
      poor: 25,
      factors: [
        { factor: 'Timely planting', impact: 10 },
        { factor: 'Adequate nitrogen', impact: 15 },
        { factor: 'Disease pressure', impact: -20 },
        { factor: 'Heat during grain fill', impact: -15 },
      ],
    },
    harvest: {
      moistureTarget: 13.5,
      moistureDiscount: [
        { above: 13.5, below: 15, discount: 0.015 },
        { above: 15, below: 18, discount: 0.03 },
        { above: 18, below: 20, discount: 0.05 },
      ],
      equipment: ['combine', 'grain_cart', 'semi'],
      timing: 'When grain moisture is 13.5% or below',
      storageRequirements: '13.5% moisture or less for long-term storage',
    },
    economics: {
      seedCost: 45,
      typicalRevenue: 375,
      pricePerBushel: { min: 5.50, max: 9.50, average: 7.50 },
    },
    rotation: {
      yearsBeforeReturn: 1,
      nitrogenContribution: 0,
      soilHealthImpact: 1,
      followingCropBenefit: { soybeans: 5, corn: 3 },
    },
  },

  // ============================================================================
  // CORN - Nitrogen hungry, 90-120 days
  // ============================================================================
  corn: {
    type: 'corn',
    displayName: 'Corn',
    family: 'poaceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: {
      baseTemp: 50,
      maxTemp: 95,
      totalGDD: 2700,
      byStage: {
        germination: 115,
        seedling: 200,
        vegetative: 1200,
        reproductive: 700,
        grain_filling: 400,
        maturity: 2700,
        senescence: 2800,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Germination & Emergence',
        duration: { min: 5, max: 12 },
        gddRequired: 115,
        critical: true,
        description: 'Seed germination and emergence',
      },
      {
        stage: 'seedling',
        name: 'V2-V6 (Early Vegetative)',
        duration: { min: 15, max: 25 },
        gddRequired: 200,
        critical: false,
        description: 'Early leaf development',
      },
      {
        stage: 'vegetative',
        name: 'V6-VT (Rapid Growth)',
        duration: { min: 35, max: 45 },
        gddRequired: 1200,
        critical: true,
        description: 'Rapid growth, ear size determined',
      },
      {
        stage: 'reproductive',
        name: 'Silking & Pollination',
        duration: { min: 8, max: 12 },
        gddRequired: 700,
        critical: true,
        description: 'Pollination - most critical for yield',
      },
      {
        stage: 'grain_filling',
        name: 'Grain Fill (R2-R5)',
        duration: { min: 35, max: 45 },
        gddRequired: 400,
        critical: true,
        description: 'Kernel development and starch fill',
      },
      {
        stage: 'maturity',
        name: 'Physiological Maturity (R6)',
        duration: { min: 10, max: 15 },
        gddRequired: 85,
        critical: true,
        description: 'Black layer formation, harvest when dry',
      },
    ],
    waterRequirements: {
      totalInches: 25,
      byStage: {
        germination: 2.0,
        seedling: 3.0,
        vegetative: 7.0,
        reproductive: 8.0,
        grain_filling: 4.0,
        maturity: 1.0,
        senescence: 0,
      },
      droughtTolerance: 50,
      criticalWaterPeriods: ['vegetative', 'reproductive'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 180,
        byStage: {
          germination: 5,
          seedling: 15,
          vegetative: 110,
          reproductive: 35,
          grain_filling: 10,
          maturity: 5,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 75,
        byStage: {
          germination: 10,
          seedling: 20,
          vegetative: 35,
          reproductive: 8,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 160,
        byStage: {
          germination: 10,
          seedling: 25,
          vegetative: 90,
          reproductive: 25,
          grain_filling: 10,
          maturity: 0,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 25,
        byStage: {
          germination: 2,
          seedling: 5,
          vegetative: 12,
          reproductive: 4,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      micronutrients: ['zinc', 'manganese', 'iron'],
    },
    pestPressures: [
      { pestId: 'corn_borer', riskLevel: 'high', vulnerableStages: ['vegetative', 'reproductive'], economicThreshold: 5 },
      { pestId: 'corn_rootworm', riskLevel: 'high', vulnerableStages: ['seedling', 'vegetative'], economicThreshold: 0.25 },
      { pestId: 'armyworm', riskLevel: 'medium', vulnerableStages: ['vegetative'], economicThreshold: 25 },
      { pestId: 'aphid', riskLevel: 'medium', vulnerableStages: ['reproductive'], economicThreshold: 250 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'gray_leaf_spot', riskLevel: 'high', vulnerableStages: ['vegetative', 'reproductive'], weatherTriggers: [{ condition: 'humidity', threshold: 85, duration: 12 }] },
      { diseaseId: 'northern_corn_leaf_blight', riskLevel: 'medium', vulnerableStages: ['vegetative'], weatherTriggers: [{ condition: 'rain', threshold: 0.5, duration: 2 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '04-20', end: '05-20' },
        summer: { start: '01-01', end: '02-28' },
        fall: { start: '01-01', end: '02-28' },
        winter: { start: '01-01', end: '02-28' },
      },
      seedRate: { min: 28000, max: 36000 }, // seeds per acre
      seedDepth: { min: 1.5, max: 2.5 },
      rowSpacing: { min: 20, max: 30 },
      soilTempMin: 50,
      companionCrops: [],
      precedingCrops: ['soybeans', 'alfalfa'],
      followingCrops: ['soybeans', 'wheat'],
    },
    yieldExpectations: {
      average: 175, // bushels per acre (USDA national average)
      excellent: 250,
      poor: 100,
      factors: [
        { factor: 'Adequate nitrogen', impact: 25 },
        { factor: 'Timely planting', impact: 15 },
        { factor: 'Drought during pollination', impact: -40 },
        { factor: 'Optimal plant population', impact: 10 },
      ],
    },
    harvest: {
      moistureTarget: 15.5,
      moistureDiscount: [
        { above: 15.5, below: 17, discount: 0.02 },
        { above: 17, below: 20, discount: 0.03 },
        { above: 20, below: 25, discount: 0.05 },
      ],
      equipment: ['combine', 'grain_cart', 'semi', 'dryer'],
      timing: 'When grain moisture is 15.5-25% depending on storage',
      storageRequirements: '15.5% moisture for long-term storage',
    },
    economics: {
      seedCost: 120,
      typicalRevenue: 787,
      pricePerBushel: { min: 3.50, max: 6.50, average: 4.50 },
    },
    rotation: {
      yearsBeforeReturn: 1,
      nitrogenContribution: 0,
      soilHealthImpact: -2,
      followingCropBenefit: { soybeans: 8, wheat: 5 },
    },
  },

  // ============================================================================
  // SOYBEANS - Nitrogen fixing, 90-120 days
  // ============================================================================
  soybeans: {
    type: 'soybeans',
    displayName: 'Soybeans',
    family: 'fabaceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: {
      baseTemp: 50,
      maxTemp: 95,
      totalGDD: 2500,
      byStage: {
        germination: 90,
        seedling: 250,
        vegetative: 1000,
        reproductive: 800,
        grain_filling: 300,
        maturity: 2500,
        senescence: 2600,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Germination & Emergence',
        duration: { min: 5, max: 10 },
        gddRequired: 90,
        critical: true,
        description: 'Seed germination and emergence',
      },
      {
        stage: 'seedling',
        name: 'VC-V2 (Early Growth)',
        duration: { min: 15, max: 25 },
        gddRequired: 250,
        critical: false,
        description: 'First trifoliate leaves',
      },
      {
        stage: 'vegetative',
        name: 'V3-R1 (Rapid Growth)',
        duration: { min: 30, max: 45 },
        gddRequired: 1000,
        critical: true,
        description: 'Rapid growth, node development begins',
      },
      {
        stage: 'reproductive',
        name: 'Flowering & Pod Set',
        duration: { min: 25, max: 35 },
        gddRequired: 800,
        critical: true,
        description: 'Flowering, pod and seed development',
      },
      {
        stage: 'grain_filling',
        name: 'Seed Fill (R5-R6)',
        duration: { min: 20, max: 30 },
        gddRequired: 300,
        critical: true,
        description: 'Rapid seed filling',
      },
      {
        stage: 'maturity',
        name: 'Physiological Maturity (R7-R8)',
        duration: { min: 10, max: 15 },
        gddRequired: 60,
        critical: true,
        description: 'Pods brown, seeds at max dry weight',
      },
    ],
    waterRequirements: {
      totalInches: 22,
      byStage: {
        germination: 2.0,
        seedling: 3.0,
        vegetative: 6.0,
        reproductive: 8.0,
        grain_filling: 2.5,
        maturity: 0.5,
        senescence: 0,
      },
      droughtTolerance: 55,
      criticalWaterPeriods: ['reproductive'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 40, // Less N needed due to nitrogen fixation
        byStage: {
          germination: 5,
          seedling: 10,
          vegetative: 15,
          reproductive: 8,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 60,
        byStage: {
          germination: 8,
          seedling: 15,
          vegetative: 25,
          reproductive: 10,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 140,
        byStage: {
          germination: 10,
          seedling: 25,
          vegetative: 70,
          reproductive: 30,
          grain_filling: 5,
          maturity: 0,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 15,
        byStage: {
          germination: 2,
          seedling: 4,
          vegetative: 7,
          reproductive: 2,
          grain_filling: 0,
          maturity: 0,
          senescence: 0,
        },
      },
      micronutrients: ['molybdenum', 'iron', 'manganese'],
    },
    pestPressures: [
      { pestId: 'aphid', riskLevel: 'medium', vulnerableStages: ['reproductive'], economicThreshold: 250 },
      { pestId: 'stink_bug', riskLevel: 'medium', vulnerableStages: ['reproductive', 'grain_filling'], economicThreshold: 3 },
      { pestId: 'bean_leaf_beetle', riskLevel: 'medium', vulnerableStages: ['seedling', 'reproductive'], economicThreshold: 30 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'sudden_death_syndrome', riskLevel: 'high', vulnerableStages: ['reproductive'], weatherTriggers: [{ condition: 'soil_saturation', threshold: 48, duration: 2 }] },
      { diseaseId: 'white_mold', riskLevel: 'high', vulnerableStages: ['reproductive'], weatherTriggers: [{ condition: 'humidity', threshold: 90, duration: 12 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '04-25', end: '05-25' },
        summer: { start: '01-01', end: '02-28' },
        fall: { start: '01-01', end: '02-28' },
        winter: { start: '01-01', end: '02-28' },
      },
      seedRate: { min: 140000, max: 200000 }, // seeds per acre
      seedDepth: { min: 1.0, max: 2.0 },
      rowSpacing: { min: 15, max: 30 },
      soilTempMin: 55,
      companionCrops: [],
      precedingCrops: ['corn', 'wheat'],
      followingCrops: ['corn', 'wheat', 'cotton'],
    },
    yieldExpectations: {
      average: 50, // bushels per acre (USDA national average)
      excellent: 75,
      poor: 25,
      factors: [
        { factor: 'Early planting', impact: 12 },
        { factor: 'Good nodulation', impact: 15 },
        { factor: 'Adequate potassium', impact: 10 },
        { factor: 'Drought during pod fill', impact: -35 },
      ],
    },
    harvest: {
      moistureTarget: 13,
      moistureDiscount: [
        { above: 13, below: 15, discount: 0.015 },
        { above: 15, below: 18, discount: 0.03 },
      ],
      equipment: ['combine', 'grain_cart', 'semi'],
      timing: 'When grain moisture is 13% or less',
      storageRequirements: '13% moisture for long-term storage',
    },
    economics: {
      seedCost: 65,
      typicalRevenue: 600,
      pricePerBushel: { min: 8.50, max: 15.00, average: 12.00 },
    },
    rotation: {
      yearsBeforeReturn: 1,
      nitrogenContribution: 40, // lbs N per acre
      soilHealthImpact: 5,
      followingCropBenefit: { corn: 8, wheat: 5, cotton: 6 },
    },
  },

  // ============================================================================
  // STRAWBERRIES - Perennial, 1-2 year establishment
  // ============================================================================
  strawberries: {
    type: 'strawberries',
    displayName: 'Strawberries',
    family: 'rosaceae',
    lifecycle: 'perennial',
    seasonType: 'cool',
    gddRequirements: {
      baseTemp: 40,
      maxTemp: 85,
      totalGDD: 3500,
      byStage: {
        germination: 100,
        seedling: 300,
        vegetative: 1500,
        reproductive: 1200,
        grain_filling: 300,
        maturity: 3500,
        senescence: 4000,
      },
    },
    growthStages: [
      {
        stage: 'germination',
        name: 'Establishment (Bare Root)',
        duration: { min: 14, max: 21 },
        gddRequired: 100,
        critical: true,
        description: 'Root establishment after planting',
      },
      {
        stage: 'seedling',
        name: 'Runner Production',
        duration: { min: 60, max: 90 },
        gddRequired: 300,
        critical: false,
        description: 'Vegetative growth, daughter plants',
      },
      {
        stage: 'vegetative',
        name: 'Crown Development',
        duration: { min: 120, max: 180 },
        gddRequired: 1500,
        critical: true,
        description: 'Flower bud initiation for next season',
      },
      {
        stage: 'reproductive',
        name: 'Flowering',
        duration: { min: 30, max: 45 },
        gddRequired: 1200,
        critical: true,
        description: 'Flower emergence and pollination',
      },
      {
        stage: 'grain_filling',
        name: 'Fruit Development',
        duration: { min: 20, max: 35 },
        gddRequired: 300,
        critical: true,
        description: 'Fruit sizing and ripening',
      },
      {
        stage: 'maturity',
        name: 'Harvest',
        duration: { min: 14, max: 28 },
        gddRequired: 100,
        critical: true,
        description: 'Peak harvest period',
      },
    ],
    waterRequirements: {
      totalInches: 28,
      byStage: {
        germination: 3.0,
        seedling: 5.0,
        vegetative: 8.0,
        reproductive: 6.0,
        grain_filling: 4.0,
        maturity: 2.0,
        senescence: 0,
      },
      droughtTolerance: 35,
      criticalWaterPeriods: ['reproductive', 'grain_filling'],
    },
    nutrientRequirements: {
      nitrogen: {
        totalLbsPerAcre: 120,
        byStage: {
          germination: 10,
          seedling: 25,
          vegetative: 60,
          reproductive: 20,
          grain_filling: 5,
          maturity: 0,
          senescence: 0,
        },
      },
      phosphorus: {
        totalLbsPerAcre: 80,
        byStage: {
          germination: 15,
          seedling: 25,
          vegetative: 30,
          reproductive: 8,
          grain_filling: 2,
          maturity: 0,
          senescence: 0,
        },
      },
      potassium: {
        totalLbsPerAcre: 200,
        byStage: {
          germination: 20,
          seedling: 40,
          vegetative: 90,
          reproductive: 40,
          grain_filling: 10,
          maturity: 0,
          senescence: 0,
        },
      },
      sulfur: {
        totalLbsPerAcre: 25,
        byStage: {
          germination: 3,
          seedling: 7,
          vegetative: 12,
          reproductive: 3,
          grain_filling: 0,
          maturity: 0,
          senescence: 0,
        },
      },
      micronutrients: ['boron', 'calcium', 'magnesium', 'iron'],
    },
    pestPressures: [
      { pestId: 'spider_mite', riskLevel: 'high', vulnerableStages: ['reproductive', 'grain_filling'], economicThreshold: 5 },
      { pestId: 'strawberry_aphid', riskLevel: 'medium', vulnerableStages: ['seedling', 'vegetative'], economicThreshold: 30 },
      { pestId: 'slugs', riskLevel: 'medium', vulnerableStages: ['grain_filling', 'maturity'], economicThreshold: 1 },
    ],
    diseaseSusceptibility: [
      { diseaseId: 'gray_mold', riskLevel: 'high', vulnerableStages: ['reproductive', 'grain_filling'], weatherTriggers: [{ condition: 'humidity', threshold: 90, duration: 8 }] },
      { diseaseId: 'anthracnose', riskLevel: 'high', vulnerableStages: ['grain_filling'], weatherTriggers: [{ condition: 'rain', threshold: 0.5, duration: 3 }] },
    ],
    planting: {
      optimalDates: {
        spring: { start: '03-15', end: '04-30' },
        summer: { start: '08-15', end: '09-30' }, // Fall planting
        fall: { start: '08-15', end: '09-30' },
        winter: { start: '01-01', end: '02-28' },
      },
      seedRate: { min: 15000, max: 20000 }, // plants per acre
      seedDepth: { min: 0, max: 0 }, // Bare root transplants
      rowSpacing: { min: 36, max: 48 },
      soilTempMin: 45,
      companionCrops: [],
      precedingCrops: ['broccoli', 'tomatoes'],
      followingCrops: ['lettuce', 'soybeans'],
    },
    yieldExpectations: {
      average: 15000, // lbs per acre (Year 2)
      excellent: 25000,
      poor: 8000,
      factors: [
        { factor: 'Year 2 production', impact: 50 },
        { factor: 'Frost protection', impact: 20 },
        { factor: 'Adequate pollination', impact: 15 },
        { factor: 'Gray mold pressure', impact: -30 },
      ],
    },
    harvest: {
      moistureTarget: 90,
      moistureDiscount: [
        { above: 85, below: 100, discount: 0 },
        { above: 80, below: 85, discount: 0.10 },
        { above: 0, below: 80, discount: 0.20 },
      ],
      equipment: ['pickers', 'field_containers', 'cooler'],
      timing: 'Every 2-3 days during peak season',
      storageRequirements: '32°F, 90-95% humidity, 5-7 days max',
    },
    economics: {
      seedCost: 3500,
      typicalRevenue: 45000,
      pricePerBushel: { min: 25, max: 45, average: 35 },
    },
    rotation: {
      yearsBeforeReturn: 3,
      nitrogenContribution: 0,
      soilHealthImpact: 4,
      followingCropBenefit: { lettuce: 10, soybeans: 8 },
    },
  },
  
  // Additional crops (simplified profiles)
  cotton: {
    type: 'cotton',
    displayName: 'Cotton',
    family: 'malvaceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: { baseTemp: 60, maxTemp: 95, totalGDD: 2200, byStage: { germination: 100, seedling: 300, vegetative: 1000, reproductive: 600, grain_filling: 200, maturity: 2200, senescence: 2300 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 5, max: 10 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 28, byStage: { germination: 2, seedling: 4, vegetative: 10, reproductive: 8, grain_filling: 3, maturity: 1, senescence: 0 }, droughtTolerance: 45, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 100, byStage: { germination: 5, seedling: 15, vegetative: 50, reproductive: 25, grain_filling: 5, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 50, byStage: { germination: 10, seedling: 20, vegetative: 15, reproductive: 5, grain_filling: 0, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 80, byStage: { germination: 10, seedling: 20, vegetative: 35, reproductive: 12, grain_filling: 3, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 15, byStage: { germination: 2, seedling: 5, vegetative: 6, reproductive: 2, grain_filling: 0, maturity: 0, senescence: 0 } }, micronutrients: [] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '04-15', end: '05-30' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 40000, max: 60000 }, seedDepth: { min: 0.5, max: 1.0 }, rowSpacing: { min: 30, max: 40 }, soilTempMin: 60, companionCrops: [], precedingCrops: ['soybeans', 'wheat'], followingCrops: ['wheat', 'soybeans'] },
    yieldExpectations: { average: 850, excellent: 1200, poor: 500, factors: [] },
    harvest: { moistureTarget: 12, moistureDiscount: [{ above: 12, below: 15, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 100, typicalRevenue: 650, pricePerBushel: { min: 0.65, max: 0.85, average: 0.75 } },
    rotation: { yearsBeforeReturn: 2, nitrogenContribution: 0, soilHealthImpact: -1, followingCropBenefit: { wheat: 5, soybeans: 8 } },
  },
  tomatoes: {
    type: 'tomatoes',
    displayName: 'Tomatoes',
    family: 'solanaceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: { baseTemp: 50, maxTemp: 90, totalGDD: 1800, byStage: { germination: 100, seedling: 200, vegetative: 800, reproductive: 500, grain_filling: 200, maturity: 1800, senescence: 1900 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 5, max: 10 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 24, byStage: { germination: 2, seedling: 3, vegetative: 8, reproductive: 8, grain_filling: 2, maturity: 1, senescence: 0 }, droughtTolerance: 40, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 140, byStage: { germination: 5, seedling: 15, vegetative: 70, reproductive: 40, grain_filling: 10, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 70, byStage: { germination: 10, seedling: 20, vegetative: 30, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 200, byStage: { germination: 15, seedling: 30, vegetative: 100, reproductive: 45, grain_filling: 10, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 25, byStage: { germination: 2, seedling: 5, vegetative: 12, reproductive: 5, grain_filling: 1, maturity: 0, senescence: 0 } }, micronutrients: ['calcium', 'magnesium'] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '04-15', end: '05-30' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 10000, max: 15000 }, seedDepth: { min: 0.25, max: 0.5 }, rowSpacing: { min: 48, max: 72 }, soilTempMin: 55, companionCrops: [], precedingCrops: ['lettuce', 'broccoli'], followingCrops: ['lettuce', 'broccoli'] },
    yieldExpectations: { average: 300, excellent: 450, poor: 200, factors: [] },
    harvest: { moistureTarget: 94, moistureDiscount: [{ above: 90, below: 100, discount: 0 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 200, typicalRevenue: 9000, pricePerBushel: { min: 25, max: 35, average: 30 } },
    rotation: { yearsBeforeReturn: 3, nitrogenContribution: 0, soilHealthImpact: 1, followingCropBenefit: { lettuce: 8, broccoli: 6 } },
  },
  potatoes: {
    type: 'potatoes',
    displayName: 'Potatoes',
    family: 'solanaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: { baseTemp: 45, maxTemp: 85, totalGDD: 1500, byStage: { germination: 100, seedling: 200, vegetative: 700, reproductive: 400, grain_filling: 100, maturity: 1500, senescence: 1600 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 10, max: 20 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 20, byStage: { germination: 2, seedling: 3, vegetative: 8, reproductive: 5, grain_filling: 2, maturity: 0, senescence: 0 }, droughtTolerance: 35, criticalWaterPeriods: ['vegetative', 'reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 180, byStage: { germination: 10, seedling: 25, vegetative: 100, reproductive: 40, grain_filling: 5, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 100, byStage: { germination: 15, seedling: 30, vegetative: 45, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 220, byStage: { germination: 20, seedling: 40, vegetative: 120, reproductive: 35, grain_filling: 5, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 30, byStage: { germination: 3, seedling: 7, vegetative: 15, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, micronutrients: ['calcium', 'magnesium'] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '03-15', end: '05-01' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 2000, max: 3000 }, seedDepth: { min: 4, max: 6 }, rowSpacing: { min: 30, max: 36 }, soilTempMin: 45, companionCrops: [], precedingCrops: ['corn', 'soybeans'], followingCrops: ['corn', 'soybeans'] },
    yieldExpectations: { average: 350, excellent: 500, poor: 200, factors: [] },
    harvest: { moistureTarget: 80, moistureDiscount: [{ above: 75, below: 85, discount: 0 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 2000, typicalRevenue: 4200, pricePerBushel: { min: 10, max: 14, average: 12 } },
    rotation: { yearsBeforeReturn: 3, nitrogenContribution: 0, soilHealthImpact: -2, followingCropBenefit: { corn: 5, soybeans: 5 } },
  },
  alfalfa: {
    type: 'alfalfa',
    displayName: 'Alfalfa',
    family: 'fabaceae',
    lifecycle: 'perennial',
    seasonType: 'neutral',
    gddRequirements: { baseTemp: 40, maxTemp: 90, totalGDD: 1200, byStage: { germination: 80, seedling: 200, vegetative: 600, reproductive: 200, grain_filling: 100, maturity: 1200, senescence: 1300 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 7, max: 14 }, gddRequired: 80, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 24, byStage: { germination: 2, seedling: 4, vegetative: 12, reproductive: 4, grain_filling: 2, maturity: 0, senescence: 0 }, droughtTolerance: 55, criticalWaterPeriods: ['vegetative'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 0, byStage: { germination: 0, seedling: 0, vegetative: 0, reproductive: 0, grain_filling: 0, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 60, byStage: { germination: 10, seedling: 20, vegetative: 25, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 220, byStage: { germination: 20, seedling: 40, vegetative: 120, reproductive: 30, grain_filling: 10, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 25, byStage: { germination: 3, seedling: 7, vegetative: 12, reproductive: 2, grain_filling: 1, maturity: 0, senescence: 0 } }, micronutrients: ['boron', 'molybdenum'] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '04-01', end: '05-15' }, summer: { start: '08-01', end: '09-01' }, fall: { start: '08-15', end: '09-15' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 15, max: 25 }, seedDepth: { min: 0.25, max: 0.5 }, rowSpacing: { min: 6, max: 10 }, soilTempMin: 40, companionCrops: [], precedingCrops: ['corn', 'wheat'], followingCrops: ['corn', 'wheat'] },
    yieldExpectations: { average: 6, excellent: 8, poor: 4, factors: [] },
    harvest: { moistureTarget: 18, moistureDiscount: [{ above: 18, below: 20, discount: 0 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 80, typicalRevenue: 900, pricePerBushel: { min: 140, max: 160, average: 150 } },
    rotation: { yearsBeforeReturn: 5, nitrogenContribution: 150, soilHealthImpact: 8, followingCropBenefit: { corn: 15, wheat: 10 } },
  },
  oats: {
    type: 'oats',
    displayName: 'Oats',
    family: 'poaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: { baseTemp: 40, maxTemp: 85, totalGDD: 1500, byStage: { germination: 100, seedling: 300, vegetative: 700, reproductive: 300, grain_filling: 100, maturity: 1500, senescence: 1600 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 7, max: 10 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 18, byStage: { germination: 2, seedling: 3, vegetative: 7, reproductive: 4, grain_filling: 2, maturity: 0, senescence: 0 }, droughtTolerance: 50, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 70, byStage: { germination: 5, seedling: 15, vegetative: 40, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 40, byStage: { germination: 8, seedling: 15, vegetative: 12, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 70, byStage: { germination: 10, seedling: 20, vegetative: 35, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 12, byStage: { germination: 2, seedling: 4, vegetative: 5, reproductive: 1, grain_filling: 0, maturity: 0, senescence: 0 } }, micronutrients: [] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '03-15', end: '04-30' }, summer: { start: '08-01', end: '09-15' }, fall: { start: '08-01', end: '09-15' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 80, max: 120 }, seedDepth: { min: 0.75, max: 1.5 }, rowSpacing: { min: 6, max: 8 }, soilTempMin: 38, companionCrops: [], precedingCrops: ['soybeans', 'alfalfa'], followingCrops: ['soybeans', 'corn'] },
    yieldExpectations: { average: 65, excellent: 90, poor: 40, factors: [] },
    harvest: { moistureTarget: 14, moistureDiscount: [{ above: 14, below: 16, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 35, typicalRevenue: 260, pricePerBushel: { min: 3.50, max: 4.50, average: 4.00 } },
    rotation: { yearsBeforeReturn: 1, nitrogenContribution: 0, soilHealthImpact: 2, followingCropBenefit: { soybeans: 5, corn: 3 } },
  },
  barley: {
    type: 'barley',
    displayName: 'Barley',
    family: 'poaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: { baseTemp: 40, maxTemp: 85, totalGDD: 1600, byStage: { germination: 100, seedling: 300, vegetative: 800, reproductive: 300, grain_filling: 100, maturity: 1600, senescence: 1700 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 7, max: 10 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 19, byStage: { germination: 2, seedling: 3, vegetative: 8, reproductive: 4, grain_filling: 2, maturity: 0, senescence: 0 }, droughtTolerance: 55, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 80, byStage: { germination: 5, seedling: 15, vegetative: 45, reproductive: 12, grain_filling: 3, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 45, byStage: { germination: 8, seedling: 15, vegetative: 15, reproductive: 5, grain_filling: 2, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 80, byStage: { germination: 10, seedling: 20, vegetative: 40, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 15, byStage: { germination: 2, seedling: 5, vegetative: 6, reproductive: 2, grain_filling: 0, maturity: 0, senescence: 0 } }, micronutrients: [] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '03-15', end: '04-30' }, summer: { start: '08-01', end: '09-30' }, fall: { start: '08-01', end: '09-30' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 90, max: 130 }, seedDepth: { min: 0.75, max: 1.5 }, rowSpacing: { min: 6, max: 8 }, soilTempMin: 38, companionCrops: [], precedingCrops: ['soybeans', 'alfalfa'], followingCrops: ['soybeans', 'corn'] },
    yieldExpectations: { average: 55, excellent: 75, poor: 35, factors: [] },
    harvest: { moistureTarget: 14, moistureDiscount: [{ above: 14, below: 16, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 40, typicalRevenue: 302, pricePerBushel: { min: 5.00, max: 6.00, average: 5.50 } },
    rotation: { yearsBeforeReturn: 1, nitrogenContribution: 0, soilHealthImpact: 1, followingCropBenefit: { soybeans: 5, corn: 3 } },
  },
  canola: {
    type: 'canola',
    displayName: 'Canola',
    family: 'brassicaceae',
    lifecycle: 'annual',
    seasonType: 'cool',
    gddRequirements: { baseTemp: 40, maxTemp: 85, totalGDD: 1800, byStage: { germination: 100, seedling: 300, vegetative: 900, reproductive: 400, grain_filling: 100, maturity: 1800, senescence: 1900 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 5, max: 10 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 20, byStage: { germination: 2, seedling: 3, vegetative: 9, reproductive: 5, grain_filling: 1, maturity: 0, senescence: 0 }, droughtTolerance: 50, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 100, byStage: { germination: 5, seedling: 15, vegetative: 60, reproductive: 18, grain_filling: 2, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 50, byStage: { germination: 10, seedling: 20, vegetative: 15, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 90, byStage: { germination: 10, seedling: 20, vegetative: 50, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 20, byStage: { germination: 2, seedling: 5, vegetative: 10, reproductive: 3, grain_filling: 0, maturity: 0, senescence: 0 } }, micronutrients: [] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '04-01', end: '05-15' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 40000, max: 60000 }, seedDepth: { min: 0.5, max: 1.0 }, rowSpacing: { min: 7, max: 10 }, soilTempMin: 40, companionCrops: [], precedingCrops: ['soybeans', 'alfalfa'], followingCrops: ['wheat', 'soybeans'] },
    yieldExpectations: { average: 35, excellent: 50, poor: 20, factors: [] },
    harvest: { moistureTarget: 10, moistureDiscount: [{ above: 10, below: 12, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 55, typicalRevenue: 560, pricePerBushel: { min: 15.00, max: 17.00, average: 16.00 } },
    rotation: { yearsBeforeReturn: 3, nitrogenContribution: 0, soilHealthImpact: 3, followingCropBenefit: { wheat: 10, soybeans: 5 } },
  },
  sunflowers: {
    type: 'sunflowers',
    displayName: 'Sunflowers',
    family: 'asteraceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: { baseTemp: 45, maxTemp: 90, totalGDD: 2000, byStage: { germination: 100, seedling: 300, vegetative: 1000, reproductive: 500, grain_filling: 100, maturity: 2000, senescence: 2100 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 7, max: 14 }, gddRequired: 100, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 22, byStage: { germination: 2, seedling: 3, vegetative: 10, reproductive: 6, grain_filling: 1, maturity: 0, senescence: 0 }, droughtTolerance: 65, criticalWaterPeriods: ['reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 100, byStage: { germination: 5, seedling: 15, vegetative: 60, reproductive: 18, grain_filling: 2, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 55, byStage: { germination: 10, seedling: 20, vegetative: 20, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 100, byStage: { germination: 10, seedling: 25, vegetative: 50, reproductive: 12, grain_filling: 3, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 18, byStage: { germination: 2, seedling: 5, vegetative: 8, reproductive: 3, grain_filling: 0, maturity: 0, senescence: 0 } }, micronutrients: [] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '04-20', end: '06-01' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 18000, max: 25000 }, seedDepth: { min: 1.5, max: 2.5 }, rowSpacing: { min: 22, max: 30 }, soilTempMin: 50, companionCrops: [], precedingCrops: ['wheat', 'soybeans'], followingCrops: ['wheat', 'soybeans'] },
    yieldExpectations: { average: 1400, excellent: 2000, poor: 800, factors: [] },
    harvest: { moistureTarget: 10, moistureDiscount: [{ above: 10, below: 12, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 50, typicalRevenue: 2800, pricePerBushel: { min: 18.00, max: 22.00, average: 20.00 } },
    rotation: { yearsBeforeReturn: 3, nitrogenContribution: 0, soilHealthImpact: 2, followingCropBenefit: { wheat: 8, soybeans: 5 } },
  },
  rice: {
    type: 'rice',
    displayName: 'Rice',
    family: 'poaceae',
    lifecycle: 'annual',
    seasonType: 'warm',
    gddRequirements: { baseTemp: 55, maxTemp: 95, totalGDD: 2500, byStage: { germination: 150, seedling: 350, vegetative: 1200, reproductive: 600, grain_filling: 200, maturity: 2500, senescence: 2600 } },
    growthStages: [{ stage: 'germination', name: 'Germination', duration: { min: 7, max: 14 }, gddRequired: 150, critical: true, description: 'Seed germination' }],
    waterRequirements: { totalInches: 45, byStage: { germination: 5, seedling: 10, vegetative: 20, reproductive: 8, grain_filling: 2, maturity: 0, senescence: 0 }, droughtTolerance: 20, criticalWaterPeriods: ['vegetative', 'reproductive'] },
    nutrientRequirements: { nitrogen: { totalLbsPerAcre: 140, byStage: { germination: 5, seedling: 20, vegetative: 80, reproductive: 30, grain_filling: 5, maturity: 0, senescence: 0 } }, phosphorus: { totalLbsPerAcre: 60, byStage: { germination: 10, seedling: 20, vegetative: 25, reproductive: 4, grain_filling: 1, maturity: 0, senescence: 0 } }, potassium: { totalLbsPerAcre: 120, byStage: { germination: 10, seedling: 25, vegetative: 65, reproductive: 18, grain_filling: 2, maturity: 0, senescence: 0 } }, sulfur: { totalLbsPerAcre: 25, byStage: { germination: 2, seedling: 5, vegetative: 14, reproductive: 3, grain_filling: 1, maturity: 0, senescence: 0 } }, micronutrients: ['zinc', 'silicon'] },
    pestPressures: [],
    diseaseSusceptibility: [],
    planting: { optimalDates: { spring: { start: '03-15', end: '05-15' }, summer: { start: '01-01', end: '02-28' }, fall: { start: '01-01', end: '02-28' }, winter: { start: '01-01', end: '02-28' } }, seedRate: { min: 90000, max: 150000 }, seedDepth: { min: 0.5, max: 1.0 }, rowSpacing: { min: 6, max: 8 }, soilTempMin: 60, companionCrops: [], precedingCrops: ['soybeans', 'corn'], followingCrops: ['soybeans', 'corn'] },
    yieldExpectations: { average: 7500, excellent: 10000, poor: 5000, factors: [] },
    harvest: { moistureTarget: 20, moistureDiscount: [{ above: 20, below: 22, discount: 0.02 }], equipment: [], timing: '', storageRequirements: '' },
    economics: { seedCost: 120, typicalRevenue: 1125, pricePerBushel: { min: 13.00, max: 17.00, average: 15.00 } },
    rotation: { yearsBeforeReturn: 1, nitrogenContribution: 0, soilHealthImpact: 0, followingCropBenefit: { soybeans: 5, corn: 3 } },
  },
};

// ============================================================================
// GDD CALCULATIONS
// ============================================================================

/**
 * Calculate daily GDD using the standard formula
 * GDD = ((Tmax + Tmin) / 2) - Tbase
 * Capped at Tmax for the crop
 */
export function calculateDailyGDD(
  minTemp: number,
  maxTemp: number,
  baseTemp: number,
  maxEffectiveTemp: number = 95
): number {
  // Cap temperatures at effective maximum
  const effectiveMax = Math.min(maxTemp, maxEffectiveTemp);
  const effectiveMin = Math.max(minTemp, baseTemp);
  
  // Calculate average
  const avgTemp = (effectiveMax + effectiveMin) / 2;
  
  // Calculate GDD
  const gdd = Math.max(0, avgTemp - baseTemp);
  
  return Math.round(gdd * 10) / 10;
}

/**
 * Accumulate GDD and determine growth stage
 */
export function accumulateGDD(
  cropType: CropType,
  currentGDD: number,
  weatherForecast: WeatherForecast[],
  daysToProject: number = 7
): GDDResult {
  const profile = CROP_PROFILES[cropType];
  if (!profile) {
    return {
      dailyGDD: 0,
      accumulatedGDD: currentGDD,
      percentComplete: 0,
      currentStage: 'germination',
      daysToNextStage: 0,
    };
  }

  const { gddRequirements } = profile;
  
  // Calculate average daily GDD from forecast
  let totalGDD = 0;
  const days = Math.min(daysToProject, weatherForecast.length);
  
  for (let i = 0; i < days; i++) {
    const day = weatherForecast[i];
    const dailyGDD = calculateDailyGDD(
      day.low,
      day.high,
      gddRequirements.baseTemp,
      gddRequirements.maxTemp
    );
    totalGDD += dailyGDD;
  }
  
  const avgDailyGDD = days > 0 ? totalGDD / days : 10;
  
  // Determine current stage
  let currentStage: GrowthStage = 'germination';
  let gddForNextStage = gddRequirements.byStage.germination;
  
  const stages: GrowthStage[] = ['germination', 'seedling', 'vegetative', 'reproductive', 'grain_filling', 'maturity'];
  
  for (const stage of stages) {
    if (currentGDD >= gddRequirements.byStage[stage]) {
      currentStage = stage;
      const nextStageIndex = stages.indexOf(stage) + 1;
      if (nextStageIndex < stages.length) {
        gddForNextStage = gddRequirements.byStage[stages[nextStageIndex]];
      } else {
        gddForNextStage = gddRequirements.totalGDD;
      }
    }
  }
  
  // Calculate days to next stage
  const gddNeeded = gddForNextStage - currentGDD;
  const daysToNextStage = avgDailyGDD > 0 ? Math.ceil(gddNeeded / avgDailyGDD) : 0;
  
  // Calculate percent complete
  const percentComplete = Math.min(100, Math.round((currentGDD / gddRequirements.totalGDD) * 100));
  
  return {
    dailyGDD: avgDailyGDD,
    accumulatedGDD: currentGDD,
    percentComplete,
    currentStage,
    daysToNextStage,
  };
}

// ============================================================================
// WATER STRESS CALCULATIONS
// ============================================================================

/**
 * Calculate water stress based on ET demand vs available water
 */
export function calculateWaterStress(
  cropType: CropType,
  growthStage: GrowthStage,
  soilMoisture: number, // percentage
  recentET: number[], // inches per day for last week
  recentPrecipitation: number[]
): WaterStressResult {
  const profile = CROP_PROFILES[cropType];
  if (!profile) {
    return {
      stressLevel: 0,
      etReplacementNeeded: 0,
      daysUntilCritical: 7,
      recommendations: [],
    };
  }

  const stageWater = profile.waterRequirements.byStage[growthStage] || 1;
  const totalWaterNeeded = stageWater / 7; // per day
  
  const avgET = recentET.reduce((a, b) => a + b, 0) / recentET.length;
  const avgPrecip = recentPrecipitation.reduce((a, b) => a + b, 0) / recentPrecipitation.length;
  
  const waterDeficit = Math.max(0, avgET - avgPrecip);
  const etReplacementNeeded = waterDeficit * 7; // weekly need
  
  // Calculate stress level
  let stressLevel = 0;
  
  if (soilMoisture < 30) stressLevel = 80;
  else if (soilMoisture < 50) stressLevel = 60;
  else if (soilMoisture < 70) stressLevel = 30;
  
  // Critical periods amplify stress
  if (profile.waterRequirements.criticalWaterPeriods.includes(growthStage)) {
    stressLevel *= 1.5;
  }
  
  stressLevel = Math.min(100, stressLevel);
  
  // Days until critical
  let daysUntilCritical = 7;
  if (stressLevel > 70) daysUntilCritical = 2;
  else if (stressLevel > 50) daysUntilCritical = 4;
  else if (stressLevel > 30) daysUntilCritical = 6;
  
  // Recommendations
  const recommendations: string[] = [];
  if (stressLevel > 60) {
    recommendations.push('Immediate irrigation recommended - crop in critical stress');
  } else if (stressLevel > 40) {
    recommendations.push('Irrigate within 48 hours to prevent yield loss');
  } else if (stressLevel > 20) {
    recommendations.push('Monitor soil moisture, irrigate if no rain in next 5 days');
  }
  
  if (profile.waterRequirements.criticalWaterPeriods.includes(growthStage)) {
    recommendations.push(`Critical water period for ${cropType} - maintain adequate moisture`);
  }
  
  return {
    stressLevel,
    etReplacementNeeded,
    daysUntilCritical,
    recommendations,
  };
}

// ============================================================================
// NUTRIENT RECOMMENDATIONS
// ============================================================================

/**
 * Get nutrient recommendation for current growth stage
 */
export function getNutrientRecommendation(
  cropType: CropType,
  growthStage: GrowthStage,
  soilTestN: number,
  soilTestP: number,
  soilTestK: number,
  yieldGoal: number
): NutrientRecommendation {
  const profile = CROP_PROFILES[cropType];
  if (!profile) {
    return { nitrogen: 0, phosphorus: 0, potassium: 0, sulfur: 0, timing: '', method: '' };
  }

  const { nutrientRequirements } = profile;
  
  // Get percentage needed by this stage
  const nPercent = nutrientRequirements.nitrogen.byStage[growthStage] || 0;
  const pPercent = nutrientRequirements.phosphorus.byStage[growthStage] || 0;
  const kPercent = nutrientRequirements.potassium.byStage[growthStage] || 0;
  const sPercent = nutrientRequirements.sulfur.byStage[growthStage] || 0;
  
  // Calculate absolute needs (adjust for yield goal)
  const yieldFactor = yieldGoal / profile.yieldExpectations.average;
  
  const nTotal = nutrientRequirements.nitrogen.totalLbsPerAcre * yieldFactor;
  const pTotal = nutrientRequirements.phosphorus.totalLbsPerAcre * yieldFactor;
  const kTotal = nutrientRequirements.potassium.totalLbsPerAcre * yieldFactor;
  const sTotal = nutrientRequirements.sulfur.totalLbsPerAcre * yieldFactor;
  
  // Calculate what's needed now
  let nitrogen = (nTotal * nPercent / 100) - (soilTestN * 0.5);
  let phosphorus = (pTotal * pPercent / 100) - (soilTestP * 2);
  let potassium = (kTotal * kPercent / 100) - (soilTestK * 0.2);
  let sulfur = sTotal * sPercent / 100;
  
  // Don't recommend negative values
  nitrogen = Math.max(0, nitrogen);
  phosphorus = Math.max(0, phosphorus);
  potassium = Math.max(0, potassium);
  
  // Determine timing and method
  let timing = 'Apply as soon as possible';
  let method = 'Broadcast or sidedress';
  
  if (growthStage === 'vegetative') {
    timing = 'Sidedress within 7 days';
    method = 'Sidedress or fertigation';
  } else if (growthStage === 'reproductive') {
    timing = 'Foliar application if needed';
    method = 'Foliar spray';
  }
  
  return {
    nitrogen: Math.round(nitrogen),
    phosphorus: Math.round(phosphorus),
    potassium: Math.round(potassium),
    sulfur: Math.round(sulfur),
    timing,
    method,
  };
}

// ============================================================================
// TEST FUNCTION
// ============================================================================

export function testCropDataSystem(): void {
  console.log('=== Crop Data System Tests ===\n');

  // Test 1: GDD calculation
  console.log('Test 1: GDD Calculation for Corn');
  const gdd = calculateDailyGDD(55, 78, 50, 95);
  console.log(`✓ Daily GDD: ${gdd}`);

  // Test 2: Accumulate GDD
  console.log('\nTest 2: Accumulate GDD for Soybeans');
  const forecast: WeatherForecast[] = [
    { date: new Date(), high: 82, low: 62, precipitation: 0, precipitationChance: 10, windSpeed: 8, conditions: 'Sunny', gdd: 22, et: 0.25 },
    { date: new Date(), high: 85, low: 65, precipitation: 0, precipitationChance: 5, windSpeed: 10, conditions: 'Sunny', gdd: 25, et: 0.28 },
    { date: new Date(), high: 80, low: 60, precipitation: 0.2, precipitationChance: 60, windSpeed: 12, conditions: 'Partly Cloudy', gdd: 20, et: 0.22 },
  ];
  
  const gddResult = accumulateGDD('soybeans', 1200, forecast, 3);
  console.log(`✓ Current stage: ${gddResult.currentStage}`);
  console.log(`✓ Accumulated GDD: ${gddResult.accumulatedGDD}`);
  console.log(`✓ Percent complete: ${gddResult.percentComplete}%`);
  console.log(`✓ Days to next stage: ${gddResult.daysToNextStage}`);

  // Test 3: Water stress
  console.log('\nTest 3: Water Stress for Corn at Reproductive Stage');
  const waterResult = calculateWaterStress(
    'corn',
    'reproductive',
    45, // soil moisture
    [0.28, 0.30, 0.32, 0.29, 0.31, 0.27, 0.30], // ET
    [0, 0, 0.1, 0, 0, 0.2, 0] // precipitation
  );
  console.log(`✓ Stress level: ${waterResult.stressLevel}%`);
  console.log(`✓ ET replacement needed: ${waterResult.etReplacementNeeded.toFixed(2)} inches`);
  console.log(`✓ Days until critical: ${waterResult.daysUntilCritical}`);
  console.log(`✓ Recommendations: ${waterResult.recommendations.join(', ')}`);

  // Test 4: Nutrient recommendation
  console.log('\nTest 4: Nutrient Recommendation for Wheat');
  const nutrientRec = getNutrientRecommendation(
    'wheat',
    'vegetative',
    45, // soil N
    25, // soil P
    180, // soil K
    60 // yield goal
  );
  console.log(`✓ Nitrogen needed: ${nutrientRec.nitrogen} lbs/acre`);
  console.log(`✓ Phosphorus needed: ${nutrientRec.phosphorus} lbs/acre`);
  console.log(`✓ Potassium needed: ${nutrientRec.potassium} lbs/acre`);
  console.log(`✓ Timing: ${nutrientRec.timing}`);
  console.log(`✓ Method: ${nutrientRec.method}`);

  // Test 5: Crop profiles verification
  console.log('\nTest 5: Crop Profiles Summary');
  const crops: CropType[] = ['lettuce', 'broccoli', 'wheat', 'corn', 'soybeans', 'strawberries'];
  crops.forEach((crop) => {
    const profile = CROP_PROFILES[crop];
    console.log(`✓ ${profile.displayName}: ${profile.lifecycle}, ${profile.seasonType} season, ${profile.yieldExpectations.average} avg yield`);
  });

  console.log('\n=== All Crop Data Tests Complete ===');
}

// Export crop data for use in other modules
export { CROP_PROFILES as cropProfiles };
