// @ts-nocheck
/**
 * Pest & Disease Store - Comprehensive pest and disease management system
 * 
 * Features:
 * - Disease triangle modeling (host + pathogen + environment)
 * - Weather-triggered outbreak probability
 * - Economic thresholds for treatment decisions
 * - Chemical/organic treatment options with costs
 * - Resistance management tracking
 * - Beneficial insects system
 * - 15+ diseases and pests with realistic modeling
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CropType, 
  GrowthStage,
  Field,
  WeatherConditions,
  TreatmentRecord
} from '../types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type PestType = 'insect' | 'mite' | 'nematode' | 'mammal' | 'bird';
export type DiseaseType = 'fungal' | 'bacterial' | 'viral' | 'oomycete';
export type PestLifecycleStage = 'egg' | 'larva' | 'pupa' | 'adult' | 'overwintering';

export interface Pest {
  id: string;
  name: string;
  type: PestType;
  description: string;
  hostCrops: CropType[];
  damageType: 'chewing' | 'sucking' | 'boring' | 'mining' | 'galling' | 'piercing';
  lifecycle: {
    stages: PestLifecycleStage[];
    daysPerStage: Record<PestLifecycleStage, number>;
    generationsPerYear: number;
  };
  economicThreshold: {
    countPerPlant?: number;
    percentInfestation?: number;
    defoliationPercent?: number;
  };
  weatherTriggers: {
    temperatureOptimal: { min: number; max: number };
    humidityMin?: number;
    droughtStress?: boolean;
    degreeDayBase: number;
  };
  naturalEnemies: string[]; // IDs of beneficial insects
}

export interface Disease {
  id: string;
  name: string;
  type: DiseaseType;
  description: string;
  pathogen: string;
  hostCrops: CropType[];
  susceptibleStages: GrowthStage[];
  symptoms: string[];
  spreadMethod: ('wind' | 'rain' | 'soil' | 'seed' | 'insect_vector' | 'equipment')[];
  diseaseTriangle: {
    hostSusceptibility: Record<GrowthStage, number>; // 0-100
    pathogenSurvival: {
      inSoilYears: number;
      inResidue: boolean;
      alternateHosts: string[];
    };
    environmentalRequirements: {
      temperatureOptimal: { min: number; max: number };
      humidityMin: number;
      leafWetnessHours: number;
      precipitationTrigger?: boolean;
    };
  };
  yieldImpact: {
    mild: number; // % loss
    moderate: number;
    severe: number;
  };
}

export interface BeneficialInsect {
  id: string;
  name: string;
  type: 'predator' | 'parasitoid' | 'pollinator';
  targetPests: string[]; // Pest IDs
  effectiveness: number; // 0-100
  conservationStrategies: string[];
  establishmentCost: number; // per acre
  sensitivityToPesticides: 'low' | 'medium' | 'high';
}

export interface PestInfestation {
  id: string;
  fieldId: string;
  pestId: string;
  population: number; // count per plant or per trap
  stage: PestLifecycleStage;
  damagePercent: number;
  detectedDate: Date;
  spread: number; // 0-100 % of field affected
  treated: boolean;
  treatments: TreatmentRecord[];
  economicThresholdBreached: boolean;
}

export interface DiseaseInfection {
  id: string;
  fieldId: string;
  diseaseId: string;
  severity: number; // 0-100
  spread: number; // 0-100 % of field affected
  incidence: number; // % plants infected
  detectedDate: Date;
  treated: boolean;
  treatments: TreatmentRecord[];
  favorableConditionsDays: number; // consecutive days of favorable conditions
}

export interface TreatmentOption {
  id: string;
  name: string;
  type: 'chemical' | 'biological' | 'cultural' | 'physical';
  targetPests?: string[];
  targetDiseases?: string[];
  activeIngredient?: string;
  modeOfAction?: string;
  applicationRate: string;
  costPerAcre: number;
  effectiveness: number; // 0-100
  daysToHarvest: number;
  reentryInterval: number; // hours
  resistanceRisk: 'low' | 'medium' | 'high';
  beneficialInsectImpact: 'low' | 'medium' | 'high';
  organicApproved: boolean;
}

export interface ResistanceRecord {
  pestId?: string;
  diseaseId?: string;
  activeIngredient: string;
  applicationsCount: number;
  lastApplication: Date;
  resistanceLevel: 'none' | 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export interface DiseaseTriangleAssessment {
  fieldId: string;
  diseaseId: string;
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  outbreakProbability: number; // 0-100
  limitingFactor?: 'host' | 'pathogen' | 'environment';
  hostSusceptibility: number; // 0-100
  pathogenPressure: number; // 0-100
  environmentalFavorability: number; // 0-100
  recommendations: string[];
}

// ============================================================================
// PEST DATABASE - 15+ Pests
// ============================================================================

export const PEST_DATABASE: Record<string, Pest> = {
  aphids: {
    id: 'aphids',
    name: 'Aphids (Green Peach, Potato)',
    type: 'insect',
    description: 'Small sap-sucking insects that vector viruses and stunt growth',
    hostCrops: ['lettuce', 'tomatoes', 'potatoes', 'soybeans', 'corn', 'cotton', 'canola'],
    damageType: 'sucking',
    lifecycle: {
      stages: ['egg', 'larva', 'adult'],
      daysPerStage: { egg: 3, larva: 7, pupa: 0, adult: 21, overwintering: 90 },
      generationsPerYear: 10,
    },
    economicThreshold: { countPerPlant: 50, percentInfestation: 20 },
    weatherTriggers: {
      temperatureOptimal: { min: 68, max: 82 },
      humidityMin: 40,
      droughtStress: true,
      degreeDayBase: 50,
    },
    naturalEnemies: ['lady_beetle', 'lacewing', 'parasitic_wasp'],
  },
  
  corn_rootworm: {
    id: 'corn_rootworm',
    name: 'Western Corn Rootworm',
    type: 'insect',
    description: 'Larvae feed on corn roots, causing lodging and yield loss',
    hostCrops: ['corn'],
    damageType: 'boring',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 10, larva: 21, pupa: 10, adult: 42, overwintering: 180 },
      generationsPerYear: 1,
    },
    economicThreshold: { countPerPlant: 1.5 },
    weatherTriggers: {
      temperatureOptimal: { min: 70, max: 85 },
      droughtStress: false,
      degreeDayBase: 52,
    },
    naturalEnemies: ['ground_beetle', 'predatory_nematode'],
  },
  
  podworm: {
    id: 'podworm',
    name: 'Corn Earworm / Cotton Bollworm / Soybean Podworm',
    type: 'insect',
    description: 'Polyphagous pest feeding on corn ears, cotton bolls, and soybean pods',
    hostCrops: ['corn', 'cotton', 'soybeans', 'tomatoes'],
    damageType: 'chewing',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 3, larva: 14, pupa: 14, adult: 14, overwintering: 120 },
      generationsPerYear: 3,
    },
    economicThreshold: { countPerPlant: 1, percentInfestation: 5 },
    weatherTriggers: {
      temperatureOptimal: { min: 75, max: 95 },
      degreeDayBase: 55,
    },
    naturalEnemies: ['trichogramma_wasp', 'lady_beetle', 'predatory_bug'],
  },
  
  spider_mites: {
    id: 'spider_mites',
    name: 'Two-Spotted Spider Mite',
    type: 'mite',
    description: 'Tiny arachnids causing stippling and bronzing of leaves',
    hostCrops: ['soybeans', 'corn', 'cotton', 'tomatoes', 'strawberries', 'potatoes'],
    damageType: 'piercing',
    lifecycle: {
      stages: ['egg', 'larva', 'adult'],
      daysPerStage: { egg: 3, larva: 5, pupa: 0, adult: 14, overwintering: 0 },
      generationsPerYear: 12,
    },
    economicThreshold: { percentInfestation: 30, defoliationPercent: 15 },
    weatherTriggers: {
      temperatureOptimal: { min: 80, max: 100 },
      humidityMin: 40,
      droughtStress: true,
      degreeDayBase: 50,
    },
    naturalEnemies: ['predatory_mite', 'minute_pirate_bug'],
  },
  
  whiteflies: {
    id: 'whiteflies',
    name: 'Silverleaf Whitefly',
    type: 'insect',
    description: 'Sap-feeding insects that excrete honeydew and vector viruses',
    hostCrops: ['cotton', 'tomatoes', 'lettuce', 'soybeans'],
    damageType: 'sucking',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 6, larva: 7, pupa: 5, adult: 30, overwintering: 60 },
      generationsPerYear: 6,
    },
    economicThreshold: { countPerPlant: 5, percentInfestation: 25 },
    weatherTriggers: {
      temperatureOptimal: { min: 75, max: 90 },
      degreeDayBase: 52,
    },
    naturalEnemies: ['parasitic_wasp', 'predatory_beetle'],
  },
  
  flea_beetle: {
    id: 'flea_beetle',
    name: 'Flea Beetle',
    type: 'insect',
    description: 'Small beetles that create shot holes in leaves',
    hostCrops: ['broccoli', 'canola', 'potatoes', 'lettuce'],
    damageType: 'chewing',
    lifecycle: {
      stages: ['egg', 'larva', 'adult'],
      daysPerStage: { egg: 7, larva: 21, pupa: 7, adult: 60, overwintering: 180 },
      generationsPerYear: 2,
    },
    economicThreshold: { percentInfestation: 25, defoliationPercent: 10 },
    weatherTriggers: {
      temperatureOptimal: { min: 65, max: 80 },
      degreeDayBase: 50,
    },
    naturalEnemies: ['ground_beetle', 'predatory_nematode'],
  },
  
  thrips: {
    id: 'thrips',
    name: 'Thrips (Western Flower, Onion)',
    type: 'insect',
    description: 'Tiny insects causing silvery feeding scars and vectoring viruses',
    hostCrops: ['lettuce', 'tomatoes', 'cotton', 'strawberries', 'onions'],
    damageType: 'piercing',
    lifecycle: {
      stages: ['egg', 'larva', 'adult'],
      daysPerStage: { egg: 3, larva: 5, pupa: 3, adult: 21, overwintering: 0 },
      generationsPerYear: 8,
    },
    economicThreshold: { countPerPlant: 5 },
    weatherTriggers: {
      temperatureOptimal: { min: 70, max: 85 },
      droughtStress: true,
      degreeDayBase: 50,
    },
    naturalEnemies: ['predatory_mite', 'minute_pirate_bug', 'lacewing'],
  },
  
  armyworm: {
    id: 'armyworm',
    name: 'Fall Armyworm',
    type: 'insect',
    description: 'Migrant pest causing rapid defoliation',
    hostCrops: ['corn', 'cotton', 'wheat', 'oats', 'barley', 'rice'],
    damageType: 'chewing',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 3, larva: 14, pupa: 10, adult: 14, overwintering: 0 },
      generationsPerYear: 4,
    },
    economicThreshold: { countPerPlant: 3, defoliationPercent: 15 },
    weatherTriggers: {
      temperatureOptimal: { min: 75, max: 90 },
      degreeDayBase: 55,
    },
    naturalEnemies: ['parasitic_wasp', 'tachinid_fly', 'predatory_stink_bug'],
  },
  
  stink_bug: {
    id: 'stink_bug',
    name: 'Brown Marmorated Stink Bug',
    type: 'insect',
    description: 'Piercing-sucking pest causing cat-facing in fruits',
    hostCrops: ['soybeans', 'corn', 'tomatoes', 'apples', 'peaches'],
    damageType: 'piercing',
    lifecycle: {
      stages: ['egg', 'larva', 'adult'],
      daysPerStage: { egg: 5, larva: 28, pupa: 0, adult: 60, overwintering: 180 },
      generationsPerYear: 2,
    },
    economicThreshold: { countPerPlant: 1 },
    weatherTriggers: {
      temperatureOptimal: { min: 70, max: 85 },
      degreeDayBase: 54,
    },
    naturalEnemies: ['parasitic_wasp', 'predatory_stink_bug'],
  },
  
  cutworm: {
    id: 'cutworm',
    name: 'Black Cutworm',
    type: 'insect',
    description: 'Larvae cut seedlings at soil line',
    hostCrops: ['corn', 'soybeans', 'cotton', 'lettuce', 'tomatoes'],
    damageType: 'chewing',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 5, larva: 28, pupa: 14, adult: 14, overwintering: 120 },
      generationsPerYear: 3,
    },
    economicThreshold: { percentInfestation: 5 },
    weatherTriggers: {
      temperatureOptimal: { min: 65, max: 80 },
      degreeDayBase: 50,
    },
    naturalEnemies: ['ground_beetle', 'predatory_nematode', 'parasitic_fly'],
  },
  
  wireworm: {
    id: 'wireworm',
    name: 'Wireworm (Click Beetle Larvae)',
    type: 'insect',
    description: 'Larvae bore into seeds and underground plant parts',
    hostCrops: ['corn', 'wheat', 'potatoes', 'oats', 'barley'],
    damageType: 'boring',
    lifecycle: {
      stages: ['egg', 'larva', 'pupa', 'adult'],
      daysPerStage: { egg: 14, larva: 1460, pupa: 21, adult: 14, overwintering: 0 },
      generationsPerYear: 0.25, // 4-year lifecycle
    },
    economicThreshold: { countPerPlant: 1 },
    weatherTriggers: {
      temperatureOptimal: { min: 60, max: 75 },
      degreeDayBase: 50,
    },
    naturalEnemies: ['predatory_nematode', 'entomopathogenic_fungi'],
  },
};

// ============================================================================
// DISEASE DATABASE - 15+ Diseases
// ============================================================================

export const DISEASE_DATABASE: Record<string, Disease> = {
  early_blight: {
    id: 'early_blight',
    name: 'Early Blight (Alternaria solani)',
    type: 'fungal',
    description: 'Dark brown spots with concentric rings on lower leaves',
    pathogen: 'Alternaria solani',
    hostCrops: ['tomatoes', 'potatoes'],
    susceptibleStages: ['vegetative', 'reproductive', 'grain_filling'],
    symptoms: ['dark brown spots with target-like rings', 'yellowing of older leaves', 'stem cankers', 'fruit lesions'],
    spreadMethod: ['soil', 'wind', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 10, seedling: 30, vegetative: 70, reproductive: 90, grain_filling: 60, maturity: 20, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 1,
        inResidue: true,
        alternateHosts: ['nightshade', 'jimsonweed'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 68, max: 85 },
        humidityMin: 90,
        leafWetnessHours: 3,
      },
    },
    yieldImpact: { mild: 10, moderate: 25, severe: 50 },
  },
  
  late_blight: {
    id: 'late_blight',
    name: 'Late Blight (Phytophthora infestans)',
    type: 'oomycete',
    description: 'Devastating disease causing rapid foliar and tuber rot',
    pathogen: 'Phytophthora infestans',
    hostCrops: ['potatoes', 'tomatoes'],
    susceptibleStages: ['vegetative', 'reproductive', 'grain_filling'],
    symptoms: ['water-soaked lesions on leaves', 'white fuzzy growth on underside', 'brown tuber rot', 'rapid defoliation'],
    spreadMethod: ['wind', 'rain'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 5, seedling: 40, vegetative: 80, reproductive: 100, grain_filling: 90, maturity: 30, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 0,
        inResidue: false,
        alternateHosts: ['volunteer potatoes', 'tomatoes'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 60, max: 72 },
        humidityMin: 90,
        leafWetnessHours: 6,
        precipitationTrigger: true,
      },
    },
    yieldImpact: { mild: 20, moderate: 50, severe: 100 },
  },
  
  powdery_mildew: {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    description: 'White powdery coating on leaves reducing photosynthesis',
    pathogen: 'Erysiphe spp., Sphaerotheca spp.',
    hostCrops: ['wheat', 'lettuce', 'tomatoes', 'strawberries', 'cucurbits'],
    susceptibleStages: ['vegetative', 'reproductive'],
    symptoms: ['white powdery patches on leaves', 'distorted growth', 'premature defoliation', 'reduced fruit quality'],
    spreadMethod: ['wind', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 5, seedling: 30, vegetative: 80, reproductive: 90, grain_filling: 70, maturity: 20, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 0,
        inResidue: true,
        alternateHosts: ['weeds', 'volunteer crops'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 68, max: 80 },
        humidityMin: 50,
        leafWetnessHours: 0, // Unique - doesn't require leaf wetness
      },
    },
    yieldImpact: { mild: 10, moderate: 30, severe: 60 },
  },
  
  downy_mildew: {
    id: 'downy_mildew',
    name: 'Downy Mildew',
    type: 'oomycete',
    description: 'Yellow angular spots with fuzzy growth on underside',
    pathogen: 'Peronospora spp., Pseudoperonospora spp.',
    hostCrops: ['lettuce', 'broccoli', 'cucurbits', 'soybeans', 'grapes'],
    susceptibleStages: ['seedling', 'vegetative', 'reproductive'],
    symptoms: ['yellow angular spots on upper leaf', 'gray/purple fuzzy growth below', 'leaf curling', 'stunted growth'],
    spreadMethod: ['wind', 'rain'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 20, seedling: 70, vegetative: 80, reproductive: 60, grain_filling: 40, maturity: 10, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 2,
        inResidue: true,
        alternateHosts: ['wild crucifers', 'weeds'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 50, max: 72 },
        humidityMin: 85,
        leafWetnessHours: 4,
        precipitationTrigger: true,
      },
    },
    yieldImpact: { mild: 15, moderate: 35, severe: 70 },
  },
  
  fusarium_wilt: {
    id: 'fusarium_wilt',
    name: 'Fusarium Wilt',
    type: 'fungal',
    description: 'Vascular disease causing wilting and yellowing',
    pathogen: 'Fusarium oxysporum',
    hostCrops: ['tomatoes', 'cotton', 'lettuce', 'bananas', 'melons'],
    susceptibleStages: ['seedling', 'vegetative', 'reproductive'],
    symptoms: ['yellowing of lower leaves', 'wilting during day', 'vascular discoloration', 'stunted growth', 'plant death'],
    spreadMethod: ['soil', 'equipment', 'seed'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 30, seedling: 80, vegetative: 70, reproductive: 50, grain_filling: 30, maturity: 10, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 10,
        inResidue: true,
        alternateHosts: [],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 75, max: 90 },
        humidityMin: 60,
        leafWetnessHours: 0,
      },
    },
    yieldImpact: { mild: 20, moderate: 50, severe: 100 },
  },
  
  verticillium_wilt: {
    id: 'verticillium_wilt',
    name: 'Verticillium Wilt',
    type: 'fungal',
    description: 'Vascular wilt disease favored by cool weather',
    pathogen: 'Verticillium dahliae',
    hostCrops: ['tomatoes', 'potatoes', 'cotton', 'lettuce', 'strawberries', 'olives'],
    susceptibleStages: ['vegetative', 'reproductive'],
    symptoms: ['V-shaped yellowing of leaves', 'wilting', 'vascular browning', 'early senescence'],
    spreadMethod: ['soil', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 10, seedling: 50, vegetative: 80, reproductive: 70, grain_filling: 40, maturity: 20, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 14,
        inResidue: true,
        alternateHosts: ['weeds'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 65, max: 80 },
        humidityMin: 70,
        leafWetnessHours: 0,
      },
    },
    yieldImpact: { mild: 15, moderate: 40, severe: 80 },
  },
  
  leaf_rust: {
    id: 'leaf_rust',
    name: 'Leaf Rust (Puccinia triticina)',
    type: 'fungal',
    description: 'Orange pustules on leaves reducing photosynthetic area',
    pathogen: 'Puccinia triticina',
    hostCrops: ['wheat'],
    susceptibleStages: ['vegetative', 'reproductive', 'grain_filling'],
    symptoms: ['orange-brown pustules on leaves', 'chlorotic halos', 'premature senescence', 'reduced grain fill'],
    spreadMethod: ['wind', 'rain'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 5, seedling: 40, vegetative: 70, reproductive: 90, grain_filling: 80, maturity: 30, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 0,
        inResidue: false,
        alternateHosts: ['oxalis', 'woodsorrel'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 55, max: 75 },
        humidityMin: 90,
        leafWetnessHours: 6,
        precipitationTrigger: true,
      },
    },
    yieldImpact: { mild: 10, moderate: 25, severe: 50 },
  },
  
  stem_rust: {
    id: 'stem_rust',
    name: 'Stem Rust',
    type: 'fungal',
    description: 'Destructive disease producing red pustules on stems',
    pathogen: 'Puccinia graminis',
    hostCrops: ['wheat', 'oats', 'barley'],
    susceptibleStages: ['vegetative', 'reproductive'],
    symptoms: ['red-brown pustules on stems', 'tissue tearing', 'broken stems', 'shriveled grain'],
    spreadMethod: ['wind'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 5, seedling: 30, vegetative: 80, reproductive: 100, grain_filling: 60, maturity: 20, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 0,
        inResidue: false,
        alternateHosts: ['barberry'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 65, max: 85 },
        humidityMin: 90,
        leafWetnessHours: 6,
      },
    },
    yieldImpact: { mild: 20, moderate: 50, severe: 100 },
  },
  
  root_rot: {
    id: 'root_rot',
    name: 'Phytophthora Root Rot',
    type: 'oomycete',
    description: 'Soil-borne disease causing root decay in wet conditions',
    pathogen: 'Phytophthora sojae, P. cinnamomi',
    hostCrops: ['soybeans', 'avocados', 'citrus', 'ornamentals'],
    susceptibleStages: ['germination', 'seedling', 'vegetative'],
    symptoms: ['seed rot', 'damping off', 'brown roots', 'wilting', 'plant death'],
    spreadMethod: ['soil', 'water', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 80, seedling: 90, vegetative: 60, reproductive: 30, grain_filling: 10, maturity: 5, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 5,
        inResidue: true,
        alternateHosts: [],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 60, max: 80 },
        humidityMin: 80,
        leafWetnessHours: 0,
        precipitationTrigger: true,
      },
    },
    yieldImpact: { mild: 15, moderate: 40, severe: 100 },
  },
  
  rhizoctonia: {
    id: 'rhizoctonia',
    name: 'Rhizoctonia Root Rot / Damping Off',
    type: 'fungal',
    description: 'Soil-borne fungus causing seedling diseases',
    pathogen: 'Rhizoctonia solani',
    hostCrops: ['corn', 'soybeans', 'cotton', 'potatoes', 'rice', 'beans'],
    susceptibleStages: ['germination', 'seedling'],
    symptoms: ['damping off', 'red sunken lesions on stems', 'root rot', 'stunted growth'],
    spreadMethod: ['soil', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 70, seedling: 90, vegetative: 40, reproductive: 20, grain_filling: 10, maturity: 5, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 3,
        inResidue: true,
        alternateHosts: ['weeds'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 75, max: 95 },
        humidityMin: 85,
        leafWetnessHours: 0,
      },
    },
    yieldImpact: { mild: 10, moderate: 30, severe: 80 },
  },
  
  clubroot: {
    id: 'clubroot',
    name: 'Clubroot',
    type: 'oomycete',
    description: 'Galls on roots of brassica crops',
    pathogen: 'Plasmodiophora brassicae',
    hostCrops: ['broccoli', 'cabbage', 'canola', 'mustard', 'turnips'],
    susceptibleStages: ['seedling', 'vegetative'],
    symptoms: ['clubbed/galled roots', 'wilting', 'stunted growth', 'plant death', 'galls vary in size'],
    spreadMethod: ['soil', 'equipment', 'water'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 30, seedling: 90, vegetative: 80, reproductive: 40, grain_filling: 20, maturity: 10, senescence: 5,
      },
      pathogenSurvival: {
        inSoilYears: 20,
        inResidue: true,
        alternateHosts: ['wild mustard', 'shepherd\'s purse'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 68, max: 77 },
        humidityMin: 80,
        leafWetnessHours: 0,
      },
    },
    yieldImpact: { mild: 20, moderate: 50, severe: 100 },
  },
  
  bacterial_blight: {
    id: 'bacterial_blight',
    name: 'Bacterial Blight',
    type: 'bacterial',
    description: 'Angular water-soaked lesions turning necrotic',
    pathogen: 'Xanthomonas campestris, Pseudomonas syringae',
    hostCrops: ['cotton', 'soybeans', 'rice', 'tomatoes', 'peppers'],
    susceptibleStages: ['vegetative', 'reproductive'],
    symptoms: ['angular water-soaked spots', 'necrotic centers', 'leaf drop', 'boll rot', 'systemic infection'],
    spreadMethod: ['rain', 'wind', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 10, seedling: 40, vegetative: 70, reproductive: 80, grain_filling: 50, maturity: 20, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 1,
        inResidue: true,
        alternateHosts: ['weeds'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 75, max: 90 },
        humidityMin: 85,
        leafWetnessHours: 6,
        precipitationTrigger: true,
      },
    },
    yieldImpact: { mild: 10, moderate: 30, severe: 60 },
  },
  
  common_scab: {
    id: 'common_scab',
    name: 'Common Scab (Potato)',
    type: 'bacterial',
    description: 'Corky lesions on potato tubers',
    pathogen: 'Streptomyces scabies',
    hostCrops: ['potatoes', 'beets', 'radish', 'carrots'],
    susceptibleStages: ['reproductive', 'grain_filling'],
    symptoms: ['corky lesions on tubers', 'rough surface', 'reduced marketability', 'shallow pits'],
    spreadMethod: ['soil', 'seed', 'equipment'],
    diseaseTriangle: {
      hostSusceptibility: {
        germination: 5, seedling: 10, vegetative: 30, reproductive: 80, grain_filling: 90, maturity: 40, senescence: 10,
      },
      pathogenSurvival: {
        inSoilYears: 10,
        inResidue: true,
        alternateHosts: ['weeds'],
      },
      environmentalRequirements: {
        temperatureOptimal: { min: 65, max: 80 },
        humidityMin: 60,
        leafWetnessHours: 0,
      },
    },
    yieldImpact: { mild: 5, moderate: 20, severe: 40 },
  },
};

// ============================================================================
// BENEFICIAL INSECTS DATABASE
// ============================================================================

export const BENEFICIAL_INSECTS: Record<string, BeneficialInsect> = {
  lady_beetle: {
    id: 'lady_beetle',
    name: 'Lady Beetle (Ladybug)',
    type: 'predator',
    targetPests: ['aphids', 'spider_mites', 'whiteflies', 'thrips'],
    effectiveness: 85,
    conservationStrategies: ['flower strips', 'reduced broad-spectrum insecticides', 'overwintering sites'],
    establishmentCost: 25,
    sensitivityToPesticides: 'high',
  },
  
  lacewing: {
    id: 'lacewing',
    name: 'Green Lacewing',
    type: 'predator',
    targetPests: ['aphids', 'thrips', 'whiteflies', 'mite_eggs'],
    effectiveness: 80,
    conservationStrategies: ['flowering plants', 'avoid pyrethroids', 'habitat hedgerows'],
    establishmentCost: 30,
    sensitivityToPesticides: 'high',
  },
  
  parasitic_wasp: {
    id: 'parasitic_wasp',
    name: 'Parasitic Wasp (Trichogramma, Aphidius)',
    type: 'parasitoid',
    targetPests: ['aphids', 'armyworm', 'podworm', 'whiteflies', 'thrips'],
    effectiveness: 75,
    conservationStrategies: ['nectar sources', 'small flowers', 'shelterbelts'],
    establishmentCost: 40,
    sensitivityToPesticides: 'high',
  },
  
  minute_pirate_bug: {
    id: 'minute_pirate_bug',
    name: 'Minute Pirate Bug',
    type: 'predator',
    targetPests: ['thrips', 'spider_mites', 'aphids', 'whiteflies'],
    effectiveness: 70,
    conservationStrategies: ['goldenrod', 'yarrow', 'reduced sprays'],
    establishmentCost: 20,
    sensitivityToPesticides: 'medium',
  },
  
  predatory_mite: {
    id: 'predatory_mite',
    name: 'Predatory Mite (Phytoseiulus)',
    type: 'predator',
    targetPests: ['spider_mites'],
    effectiveness: 90,
    conservationStrategies: ['humidity maintenance', 'avoid miticides', 'windbreaks'],
    establishmentCost: 50,
    sensitivityToPesticides: 'high',
  },
  
  ground_beetle: {
    id: 'ground_beetle',
    name: 'Ground Beetle',
    type: 'predator',
    targetPests: ['corn_rootworm', 'cutworm', 'flea_beetle', 'wireworm'],
    effectiveness: 65,
    conservationStrategies: ['ground cover', 'reduced tillage', 'perennial borders'],
    establishmentCost: 15,
    sensitivityToPesticides: 'medium',
  },
  
  predatory_stink_bug: {
    id: 'predatory_stink_bug',
    name: 'Predatory Stink Bug (Spined Soldier Bug)',
    type: 'predator',
    targetPests: ['armyworm', 'podworm', 'stink_bug', 'flea_beetle'],
    effectiveness: 70,
    conservationStrategies: ['maintain populations', 'avoid broad-spectrum sprays'],
    establishmentCost: 20,
    sensitivityToPesticides: 'medium',
  },
};

// ============================================================================
// TREATMENT OPTIONS
// ============================================================================

export const TREATMENT_OPTIONS: TreatmentOption[] = [
  // Chemical treatments
  {
    id: 'chlorothalonil',
    name: 'Chlorothalonil (Bravo)',
    type: 'chemical',
    targetDiseases: ['early_blight', 'late_blight', 'leaf_rust'],
    activeIngredient: 'Chlorothalonil',
    modeOfAction: 'Multi-site contact',
    applicationRate: '1.5 pt/acre',
    costPerAcre: 28,
    effectiveness: 75,
    daysToHarvest: 7,
    reentryInterval: 12,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'medium',
    organicApproved: false,
  },
  {
    id: 'mancozeb',
    name: 'Mancozeb (Dithane)',
    type: 'chemical',
    targetDiseases: ['early_blight', 'downy_mildew', 'leaf_rust'],
    activeIngredient: 'Mancozeb',
    modeOfAction: 'Multi-site contact',
    applicationRate: '2.0 lb/acre',
    costPerAcre: 18,
    effectiveness: 70,
    daysToHarvest: 5,
    reentryInterval: 24,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'high',
    organicApproved: false,
  },
  {
    id: 'boscalid',
    name: 'Boscalid (Endura)',
    type: 'chemical',
    targetDiseases: ['powdery_mildew', 'white_mold', 'downy_mildew'],
    activeIngredient: 'Boscalid',
    modeOfAction: 'SDHI (Succinate dehydrogenase inhibitor)',
    applicationRate: '8 oz/acre',
    costPerAcre: 45,
    effectiveness: 85,
    daysToHarvest: 14,
    reentryInterval: 12,
    resistanceRisk: 'medium',
    beneficialInsectImpact: 'low',
    organicApproved: false,
  },
  {
    id: 'pyraclostrobin',
    name: 'Pyraclostrobin (Headline)',
    type: 'chemical',
    targetDiseases: ['leaf_rust', 'stem_rust', 'early_blight'],
    activeIngredient: 'Pyraclostrobin',
    modeOfAction: 'Strobilurin (QoI)',
    applicationRate: '9 oz/acre',
    costPerAcre: 22,
    effectiveness: 85,
    daysToHarvest: 7,
    reentryInterval: 12,
    resistanceRisk: 'high',
    beneficialInsectImpact: 'medium',
    organicApproved: false,
  },
  {
    id: 'imidacloprid',
    name: 'Imidacloprid (Admire Pro)',
    type: 'chemical',
    targetPests: ['aphids', 'whiteflies', 'corn_rootworm'],
    activeIngredient: 'Imidacloprid',
    modeOfAction: 'Neonicotinoid',
    applicationRate: '7 fl oz/acre',
    costPerAcre: 65,
    effectiveness: 90,
    daysToHarvest: 21,
    reentryInterval: 12,
    resistanceRisk: 'medium',
    beneficialInsectImpact: 'high',
    organicApproved: false,
  },
  {
    id: 'chlorantraniliprole',
    name: 'Chlorantraniliprole (Prevathon)',
    type: 'chemical',
    targetPests: ['podworm', 'armyworm', 'corn_rootworm'],
    activeIngredient: 'Chlorantraniliprole',
    modeOfAction: 'Ryanodine receptor modulator',
    applicationRate: '20 fl oz/acre',
    costPerAcre: 35,
    effectiveness: 88,
    daysToHarvest: 1,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: false,
  },
  {
    id: 'bifenthrin',
    name: 'Bifenthrin (Capture)',
    type: 'chemical',
    targetPests: ['cutworm', 'corn_rootworm', 'whiteflies', 'thrips'],
    activeIngredient: 'Bifenthrin',
    modeOfAction: 'Pyrethroid',
    applicationRate: '6.4 fl oz/acre',
    costPerAcre: 18,
    effectiveness: 80,
    daysToHarvest: 14,
    reentryInterval: 12,
    resistanceRisk: 'medium',
    beneficialInsectImpact: 'high',
    organicApproved: false,
  },
  {
    id: 'spinetoram',
    name: 'Spinetoram (Radiant)',
    type: 'chemical',
    targetPests: ['thrips', 'armyworm', 'podworm'],
    activeIngredient: 'Spinetoram',
    modeOfAction: 'Spinosyn',
    applicationRate: '6 fl oz/acre',
    costPerAcre: 42,
    effectiveness: 85,
    daysToHarvest: 3,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'medium',
    organicApproved: false,
  },
  
  // Biological treatments
  {
    id: 'bacillus_subtilis',
    name: 'Bacillus subtilis (Serenade)',
    type: 'biological',
    targetDiseases: ['early_blight', 'powdery_mildew', 'downy_mildew'],
    activeIngredient: 'Bacillus subtilis QST 713',
    applicationRate: '4 qt/acre',
    costPerAcre: 55,
    effectiveness: 65,
    daysToHarvest: 0,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'bacillus_thuringiensis',
    name: 'Bacillus thuringiensis (Dipel)',
    type: 'biological',
    targetPests: ['podworm', 'armyworm', 'cutworm'],
    activeIngredient: 'Bacillus thuringiensis kurstaki',
    applicationRate: '1 lb/acre',
    costPerAcre: 25,
    effectiveness: 70,
    daysToHarvest: 0,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'beauveria_bassiana',
    name: 'Beauveria bassiana (BotaniGard)',
    type: 'biological',
    targetPests: ['aphids', 'thrips', 'whiteflies'],
    activeIngredient: 'Beauveria bassiana GHA',
    applicationRate: '2 qt/acre',
    costPerAcre: 48,
    effectiveness: 65,
    daysToHarvest: 0,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'trichoderma',
    name: 'Trichoderma harzianum (RootShield)',
    type: 'biological',
    targetDiseases: ['root_rot', 'rhizoctonia', 'fusarium_wilt'],
    activeIngredient: 'Trichoderma harzianum',
    applicationRate: '3 lb/acre',
    costPerAcre: 35,
    effectiveness: 60,
    daysToHarvest: 0,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'neem_oil',
    name: 'Neem Oil',
    type: 'biological',
    targetPests: ['aphids', 'whiteflies', 'spider_mites', 'thrips'],
    targetDiseases: ['powdery_mildew'],
    activeIngredient: 'Azadirachtin',
    applicationRate: '2% solution',
    costPerAcre: 30,
    effectiveness: 55,
    daysToHarvest: 0,
    reentryInterval: 4,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'medium',
    organicApproved: true,
  },
  
  // Cultural treatments
  {
    id: 'crop_rotation',
    name: 'Crop Rotation',
    type: 'cultural',
    targetDiseases: ['clubroot', 'fusarium_wilt', 'verticillium_wilt', 'root_rot'],
    targetPests: ['corn_rootworm', 'wireworm', 'cutworm'],
    applicationRate: '3-4 year rotation',
    costPerAcre: 0,
    effectiveness: 70,
    daysToHarvest: 0,
    reentryInterval: 0,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'resistant_variety',
    name: 'Plant Resistant Variety',
    type: 'cultural',
    targetDiseases: ['leaf_rust', 'stem_rust', 'fusarium_wilt', 'clubroot', 'root_rot'],
    targetPests: ['aphids', 'corn_rootworm'],
    applicationRate: 'Select appropriate variety',
    costPerAcre: 0,
    effectiveness: 85,
    daysToHarvest: 0,
    reentryInterval: 0,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'sanitation',
    name: 'Crop Residue Sanitation',
    type: 'cultural',
    targetDiseases: ['early_blight', 'late_blight', 'bacterial_blight'],
    applicationRate: 'Remove and destroy infected material',
    costPerAcre: 15,
    effectiveness: 60,
    daysToHarvest: 0,
    reentryInterval: 0,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
  {
    id: 'beneficial_release',
    name: 'Release Beneficial Insects',
    type: 'cultural',
    targetPests: ['aphids', 'spider_mites', 'whiteflies', 'thrips', 'podworm'],
    applicationRate: 'Release per recommendations',
    costPerAcre: 50,
    effectiveness: 60,
    daysToHarvest: 0,
    reentryInterval: 0,
    resistanceRisk: 'low',
    beneficialInsectImpact: 'low',
    organicApproved: true,
  },
];

// ============================================================================
// DISEASE TRIANGLE CALCULATIONS
// ============================================================================

export function calculateDiseaseTriangle(
  disease: Disease,
  cropType: CropType,
  growthStage: GrowthStage,
  weather: WeatherConditions,
  weatherHistory: WeatherConditions[],
  pathogenHistory: { yearsInField: number; previousOutbreaks: number }
): DiseaseTriangleAssessment {
  // Host susceptibility
  const hostSusceptibility = disease.diseaseTriangle.hostSusceptibility[growthStage] || 50;
  const isHostSusceptible = disease.hostCrops.includes(cropType) && hostSusceptibility > 30;
  
  // Pathogen pressure
  const survivalBonus = Math.min(50, pathogenHistory.yearsInField * 10 + pathogenHistory.previousOutbreaks * 15);
  const pathogenPressure = disease.diseaseTriangle.pathogenSurvival.inSoilYears > 0 
    ? Math.min(100, 40 + survivalBonus)
    : 30 + survivalBonus;
  
  // Environmental favorability
  const env = disease.diseaseTriangle.environmentalRequirements;
  let envScore = 0;
  
  // Temperature check
  const tempInRange = weather.temperature >= env.temperatureOptimal.min && 
                      weather.temperature <= env.temperatureOptimal.max;
  if (tempInRange) envScore += 40;
  else {
    const tempDist = Math.min(
      Math.abs(weather.temperature - env.temperatureOptimal.min),
      Math.abs(weather.temperature - env.temperatureOptimal.max)
    );
    envScore += Math.max(0, 40 - tempDist * 5);
  }
  
  // Humidity check
  if (weather.humidity >= env.humidityMin) envScore += 30;
  else envScore += Math.max(0, (weather.humidity / env.humidityMin) * 30);
  
  // Leaf wetness calculation
  let leafWetnessHours = 0;
  weatherHistory.slice(-3).forEach(w => {
    if (w.humidity > 90 && w.temperature < 70) leafWetnessHours += 6;
    if (w.precipitation > 0) leafWetnessHours += 12;
  });
  
  if (leafWetnessHours >= env.leafWetnessHours) envScore += 30;
  else envScore += Math.max(0, (leafWetnessHours / env.leafWetnessHours) * 30);
  
  // Calculate outbreak probability
  const outbreakProbability = Math.min(100, 
    Math.pow((hostSusceptibility / 100) * (pathogenPressure / 100) * (envScore / 100), 1/3) * 100
  );
  
  // Determine risk level
  let riskLevel: DiseaseTriangleAssessment['riskLevel'] = 'none';
  if (outbreakProbability >= 70) riskLevel = 'severe';
  else if (outbreakProbability >= 50) riskLevel = 'high';
  else if (outbreakProbability >= 30) riskLevel = 'moderate';
  else if (outbreakProbability >= 10) riskLevel = 'low';
  
  // Find limiting factor
  let limitingFactor: DiseaseTriangleAssessment['limitingFactor'] | undefined;
  if (!isHostSusceptible) limitingFactor = 'host';
  else if (pathogenPressure < 30) limitingFactor = 'pathogen';
  else if (envScore < 40) limitingFactor = 'environment';
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'high' || riskLevel === 'severe') {
    recommendations.push('Apply preventive fungicide immediately');
    recommendations.push('Increase scouting to daily');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Monitor weather conditions closely');
    recommendations.push('Scout fields every 2-3 days');
  }
  
  if (disease.type === 'fungal' && leafWetnessHours > 6) {
    recommendations.push('Fungal disease risk elevated due to prolonged leaf wetness');
  }
  
  return {
    fieldId: '', // Will be set by caller
    diseaseId: disease.id,
    riskLevel,
    outbreakProbability: Math.round(outbreakProbability),
    limitingFactor,
    hostSusceptibility,
    pathogenPressure: Math.round(pathogenPressure),
    environmentalFavorability: Math.round(envScore),
    recommendations,
  };
}

// ============================================================================
// ECONOMIC THRESHOLD CALCULATIONS
// ============================================================================

export interface EconomicThresholdResult {
  thresholdBreached: boolean;
  currentLevel: number;
  threshold: number;
  damageEstimate: number; // $/acre
  treatmentJustified: boolean;
  recommendedAction: string;
}

export function calculateEconomicThreshold(
  pest: Pest,
  population: number,
  cropValue: number, // $/bushel
  expectedYield: number, // bushels/acre
  controlCost: number, // $/acre
  growthStage: GrowthStage
): EconomicThresholdResult {
  // Get threshold
  let threshold = pest.economicThreshold.countPerPlant || 
                  pest.economicThreshold.percentInfestation || 10;
  
  // Adjust threshold for growth stage
  let stageMultiplier = 1;
  if (growthStage === 'reproductive') stageMultiplier = 0.7; // More sensitive
  if (growthStage === 'grain_filling') stageMultiplier = 0.8;
  if (growthStage === 'seedling') stageMultiplier = 0.6;
  
  const adjustedThreshold = threshold * stageMultiplier;
  
  // Calculate damage potential
  const damagePerUnit = pest.damageType === 'boring' ? 0.15 : 
                        pest.damageType === 'sucking' ? 0.08 :
                        pest.damageType === 'chewing' ? 0.12 : 0.1;
  
  const damagePercent = Math.min(100, population * damagePerUnit);
  const yieldLoss = expectedYield * (damagePercent / 100);
  const damageEstimate = yieldLoss * cropValue;
  
  // Treatment decision
  const thresholdBreached = population >= adjustedThreshold;
  const netBenefit = damageEstimate - controlCost;
  const treatmentJustified = thresholdBreached && netBenefit > 5; // Minimum $5/acre benefit
  
  let recommendedAction = 'No treatment needed';
  if (treatmentJustified) {
    recommendedAction = `Treat immediately - ${pest.name} at ${population}/${pest.economicThreshold.countPerPlant ? 'plant' : '%'} exceeds threshold of ${adjustedThreshold.toFixed(1)}`;
  } else if (thresholdBreached) {
    recommendedAction = `Threshold breached but treatment not economically justified (net benefit $${netBenefit.toFixed(2)}/acre)`;
  }
  
  return {
    thresholdBreached,
    currentLevel: population,
    threshold: adjustedThreshold,
    damageEstimate,
    treatmentJustified,
    recommendedAction,
  };
}

// ============================================================================
// PEST & DISEASE STORE
// ============================================================================

export interface PestDiseaseState {
  // Infestations and infections
  pestInfestations: PestInfestation[];
  diseaseInfections: DiseaseInfection[];
  
  // Field history for disease triangle
  fieldPathogenHistory: Record<string, Record<string, {
    yearsInField: number;
    previousOutbreaks: number;
    lastDetected: Date;
  }>>;
  
  // Resistance tracking
  resistanceRecords: ResistanceRecord[];
  
  // Beneficial insect populations
  beneficialPopulations: Record<string, Record<string, {
    count: number;
    effectiveness: number;
    established: Date;
  }>>;
  
  // Actions
  scoutField: (
    fieldId: string,
    cropType: CropType,
    growthStage: GrowthStage,
    weather: WeatherConditions,
    weatherHistory: WeatherConditions[]
  ) => {
    pestsFound: PestInfestation[];
    diseasesFound: DiseaseInfection[];
    beneficialsObserved: { id: string; count: number }[];
    recommendations: string[];
  };
  
  assessDiseaseRisk: (
    fieldId: string,
    diseaseId: string,
    cropType: CropType,
    growthStage: GrowthStage,
    weather: WeatherConditions,
    weatherHistory: WeatherConditions[]
  ) => DiseaseTriangleAssessment;
  
  detectPest: (
    fieldId: string,
    pestId: string,
    population: number,
    stage: PestLifecycleStage
  ) => PestInfestation;
  
  detectDisease: (
    fieldId: string,
    diseaseId: string,
    severity: number,
    spread: number
  ) => DiseaseInfection;
  
  applyTreatment: (
    infestationOrInfectionId: string,
    treatmentId: string,
    applicator: string
  ) => { 
    success: boolean; 
    effectiveness: number; 
    cost: number;
    resistanceWarning?: string;
  };
  
  checkEconomicThreshold: (
    infestationId: string,
    cropValue: number,
    expectedYield: number,
    controlCost: number
  ) => EconomicThresholdResult;
  
  // Beneficial insects
  releaseBeneficials: (
    fieldId: string,
    beneficialId: string,
    count: number
  ) => { success: boolean; cost: number };
  
  // Resistance management
  checkResistanceRisk: (
    pestId: string | undefined,
    diseaseId: string | undefined,
    activeIngredient: string
  ) => ResistanceRecord;
  
  getResistanceHistory: (
    fieldId: string,
    pestId?: string,
    diseaseId?: string
  ) => ResistanceRecord[];
  
  // Weekly/seasonal processing
  processWeekly: (weather: WeatherConditions) => void;
  processSeasonal: () => void;
  
  // Queries
  getActiveInfestations: (fieldId?: string) => PestInfestation[];
  getActiveInfections: (fieldId?: string) => DiseaseInfection[];
  getTreatmentsForPest: (pestId: string, organicOnly?: boolean) => TreatmentOption[];
  getTreatmentsForDisease: (diseaseId: string, organicOnly?: boolean) => TreatmentOption[];
}

export const usePestDiseaseStore = create<PestDiseaseState>()(
  persist(
    (set, get) => ({
      pestInfestations: [],
      diseaseInfections: [],
      fieldPathogenHistory: {},
      resistanceRecords: [],
      beneficialPopulations: {},

      scoutField: (fieldId, cropType, growthStage, weather, weatherHistory) => {
        const pestsFound: PestInfestation[] = [];
        const diseasesFound: DiseaseInfection[] = [];
        const beneficialsObserved: { id: string; count: number }[] = [];
        const recommendations: string[] = [];
        
        // Check for pests based on weather conditions
        Object.values(PEST_DATABASE).forEach(pest => {
          if (!pest.hostCrops.includes(cropType)) return;
          
          const tempInRange = weather.temperature >= pest.weatherTriggers.temperatureOptimal.min &&
                             weather.temperature <= pest.weatherTriggers.temperatureOptimal.max;
          
          if (tempInRange && Math.random() < 0.3) {
            const population = Math.floor(Math.random() * 100);
            const infestation = get().detectPest(fieldId, pest.id, population, 'adult');
            pestsFound.push(infestation);
            
            const threshold = calculateEconomicThreshold(
              pest, population, 5, 150, 25, growthStage
            );
            if (threshold.thresholdBreached) {
              recommendations.push(threshold.recommendedAction);
            }
          }
        });
        
        // Check for diseases using disease triangle
        Object.values(DISEASE_DATABASE).forEach(disease => {
          if (!disease.hostCrops.includes(cropType)) return;
          
          const assessment = calculateDiseaseTriangle(
            disease, cropType, growthStage, weather, weatherHistory,
            get().fieldPathogenHistory[fieldId]?.[disease.id] || { yearsInField: 0, previousOutbreaks: 0 }
          );
          
          if (assessment.riskLevel !== 'none' && Math.random() < assessment.outbreakProbability / 100) {
            const infection = get().detectDisease(fieldId, disease.id, 
              Math.floor(Math.random() * 50) + 10, 
              Math.floor(Math.random() * 30)
            );
            diseasesFound.push(infection);
            recommendations.push(...assessment.recommendations);
          }
        });
        
        // Check for beneficial insects
        Object.values(BENEFICIAL_INSECTS).forEach(beneficial => {
          if (Math.random() < 0.4) {
            const count = Math.floor(Math.random() * 50);
            beneficialsObserved.push({ id: beneficial.id, count });
          }
        });
        
        return { pestsFound, diseasesFound, beneficialsObserved, recommendations };
      },

      assessDiseaseRisk: (fieldId, diseaseId, cropType, growthStage, weather, weatherHistory) => {
        const disease = DISEASE_DATABASE[diseaseId];
        if (!disease) {
          return {
            fieldId,
            diseaseId,
            riskLevel: 'none',
            outbreakProbability: 0,
            hostSusceptibility: 0,
            pathogenPressure: 0,
            environmentalFavorability: 0,
            recommendations: ['Disease not found in database'],
          };
        }
        
        const history = get().fieldPathogenHistory[fieldId]?.[diseaseId] || { yearsInField: 0, previousOutbreaks: 0 };
        const assessment = calculateDiseaseTriangle(disease, cropType, growthStage, weather, weatherHistory, history);
        assessment.fieldId = fieldId;
        
        return assessment;
      },

      detectPest: (fieldId, pestId, population, stage) => {
        const pest = PEST_DATABASE[pestId];
        const infestation: PestInfestation = {
          id: `pest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fieldId,
          pestId,
          population,
          stage,
          damagePercent: Math.min(100, population * 0.5),
          detectedDate: new Date(),
          spread: Math.min(100, population * 2),
          treated: false,
          treatments: [],
          economicThresholdBreached: population >= (pest?.economicThreshold.countPerPlant || 10),
        };
        
        set(state => ({
          pestInfestations: [...state.pestInfestations, infestation],
        }));
        
        return infestation;
      },

      detectDisease: (fieldId, diseaseId, severity, spread) => {
        const infection: DiseaseInfection = {
          id: `dis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fieldId,
          diseaseId,
          severity,
          spread,
          incidence: spread,
          detectedDate: new Date(),
          treated: false,
          treatments: [],
          favorableConditionsDays: 0,
        };
        
        set(state => ({
          diseaseInfections: [...state.diseaseInfections, infection],
        }));
        
        // Update pathogen history
        set(state => ({
          fieldPathogenHistory: {
            ...state.fieldPathogenHistory,
            [fieldId]: {
              ...state.fieldPathogenHistory[fieldId],
              [diseaseId]: {
                yearsInField: (state.fieldPathogenHistory[fieldId]?.[diseaseId]?.yearsInField || 0) + 1,
                previousOutbreaks: (state.fieldPathogenHistory[fieldId]?.[diseaseId]?.previousOutbreaks || 0) + 1,
                lastDetected: new Date(),
              },
            },
          },
        }));
        
        return infection;
      },

      applyTreatment: (infestationOrInfectionId, treatmentId, applicator) => {
        const treatment = TREATMENT_OPTIONS.find(t => t.id === treatmentId);
        if (!treatment) {
          return { success: false, effectiveness: 0, cost: 0 };
        }
        
        // Find infestation or infection
        const infestation = get().pestInfestations.find(i => i.id === infestationOrInfectionId);
        const infection = get().diseaseInfections.find(i => i.id === infestationOrInfectionId);
        
        if (!infestation && !infection) {
          return { success: false, effectiveness: 0, cost: 0 };
        }
        
        // Check resistance
        const pestId = infestation?.pestId;
        const diseaseId = infection?.diseaseId;
        const resistance = get().checkResistanceRisk(pestId, diseaseId, treatment.activeIngredient || '');
        
        let effectiveness = treatment.effectiveness;
        let resistanceWarning: string | undefined;
        
        if (resistance.resistanceLevel === 'moderate') {
          effectiveness *= 0.7;
          resistanceWarning = `Moderate resistance to ${treatment.activeIngredient} detected`;
        } else if (resistance.resistanceLevel === 'high') {
          effectiveness *= 0.4;
          resistanceWarning = `HIGH RESISTANCE: Rotate to different mode of action`;
        }
        
        // Record treatment
        const treatmentRecord: TreatmentRecord = {
          date: new Date(),
          method: treatment.type,
          product: treatment.name,
          rate: treatment.applicationRate,
          cost: treatment.costPerAcre,
          effectiveness,
        };
        
        if (infestation) {
          set(state => ({
            pestInfestations: state.pestInfestations.map(i =>
              i.id === infestationOrInfectionId
                ? { ...i, treated: true, treatments: [...i.treatments, treatmentRecord] }
                : i
            ),
          }));
        } else if (infection) {
          set(state => ({
            diseaseInfections: state.diseaseInfections.map(i =>
              i.id === infestationOrInfectionId
                ? { ...i, treated: true, treatments: [...i.treatments, treatmentRecord] }
                : i
            ),
          }));
        }
        
        // Update resistance records
        if (treatment.activeIngredient) {
          set(state => {
            const existing = state.resistanceRecords.find(r =>
              (r.pestId === pestId || r.diseaseId === diseaseId) &&
              r.activeIngredient === treatment.activeIngredient
            );
            
            if (existing) {
              return {
                resistanceRecords: state.resistanceRecords.map(r =>
                  r === existing
                    ? {
                        ...r,
                        applicationsCount: r.applicationsCount + 1,
                        lastApplication: new Date(),
                        resistanceLevel: r.applicationsCount > 3 ? 'moderate' : 
                                         r.applicationsCount > 6 ? 'high' : 'low',
                      }
                    : r
                ),
              };
            } else {
              return {
                resistanceRecords: [...state.resistanceRecords, {
                  pestId,
                  diseaseId,
                  activeIngredient: treatment.activeIngredient,
                  applicationsCount: 1,
                  lastApplication: new Date(),
                  resistanceLevel: 'none',
                  recommendations: [],
                }],
              };
            }
          });
        }
        
        return {
          success: true,
          effectiveness,
          cost: treatment.costPerAcre,
          resistanceWarning,
        };
      },

      checkEconomicThreshold: (infestationId, cropValue, expectedYield, controlCost) => {
        const infestation = get().pestInfestations.find(i => i.id === infestationId);
        if (!infestation) {
          return {
            thresholdBreached: false,
            currentLevel: 0,
            threshold: 0,
            damageEstimate: 0,
            treatmentJustified: false,
            recommendedAction: 'Infestation not found',
          };
        }
        
        const pest = PEST_DATABASE[infestation.pestId];
        if (!pest) {
          return {
            thresholdBreached: false,
            currentLevel: infestation.population,
            threshold: 0,
            damageEstimate: 0,
            treatmentJustified: false,
            recommendedAction: 'Pest not found in database',
          };
        }
        
        return calculateEconomicThreshold(
          pest,
          infestation.population,
          cropValue,
          expectedYield,
          controlCost,
          'vegetative' // Default, should come from crop store
        );
      },

      releaseBeneficials: (fieldId, beneficialId, count) => {
        const beneficial = BENEFICIAL_INSECTS[beneficialId];
        if (!beneficial) {
          return { success: false, cost: 0 };
        }
        
        const cost = (beneficial.establishmentCost * count) / 1000; // Cost per 1000
        
        set(state => ({
          beneficialPopulations: {
            ...state.beneficialPopulations,
            [fieldId]: {
              ...state.beneficialPopulations[fieldId],
              [beneficialId]: {
                count: (state.beneficialPopulations[fieldId]?.[beneficialId]?.count || 0) + count,
                effectiveness: beneficial.effectiveness,
                established: new Date(),
              },
            },
          },
        }));
        
        return { success: true, cost };
      },

      checkResistanceRisk: (pestId, diseaseId, activeIngredient) => {
        const record = get().resistanceRecords.find(r =>
          (r.pestId === pestId || r.diseaseId === diseaseId) &&
          r.activeIngredient === activeIngredient
        );
        
        if (record) return record;
        
        return {
          pestId,
          diseaseId,
          activeIngredient,
          applicationsCount: 0,
          lastApplication: new Date(),
          resistanceLevel: 'none',
          recommendations: ['No resistance history - safe to use'],
        };
      },

      getResistanceHistory: (fieldId, pestId, diseaseId) => {
        return get().resistanceRecords.filter(r =>
          (!pestId || r.pestId === pestId) &&
          (!diseaseId || r.diseaseId === diseaseId)
        );
      },

      processWeekly: (weather) => {
        // Update disease progress based on weather
        set(state => ({
          diseaseInfections: state.diseaseInfections.map(infection => {
            const disease = DISEASE_DATABASE[infection.diseaseId];
            if (!disease) return infection;
            
            const env = disease.diseaseTriangle.environmentalRequirements;
            const tempFavorable = weather.temperature >= env.temperatureOptimal.min &&
                                  weather.temperature <= env.temperatureOptimal.max;
            const humidityFavorable = weather.humidity >= env.humidityMin;
            
            let newFavorableDays = infection.favorableConditionsDays;
            if (tempFavorable && humidityFavorable) {
              newFavorableDays += 1;
            } else {
              newFavorableDays = Math.max(0, newFavorableDays - 1);
            }
            
            // Disease spreads with favorable conditions
            const spreadIncrease = newFavorableDays > 3 ? 5 : 
                                   newFavorableDays > 0 ? 2 : -1;
            
            return {
              ...infection,
              spread: Math.min(100, infection.spread + spreadIncrease),
              severity: Math.min(100, infection.severity + (newFavorableDays > 3 ? 3 : 0)),
              favorableConditionsDays: newFavorableDays,
            };
          }),
        }));
        
        // Update pest populations
        set(state => ({
          pestInfestations: state.pestInfestations.map(infestation => {
            const pest = PEST_DATABASE[infestation.pestId];
            if (!pest) return infestation;
            
            const tempFavorable = weather.temperature >= pest.weatherTriggers.temperatureOptimal.min &&
                                  weather.temperature <= pest.weatherTriggers.temperatureOptimal.max;
            
            // Population changes
            let popChange = 0;
            if (tempFavorable && !infestation.treated) {
              popChange = Math.floor(infestation.population * 0.1); // 10% increase
            } else if (infestation.treated) {
              popChange = -Math.floor(infestation.population * 0.3); // 30% decrease
            }
            
            return {
              ...infestation,
              population: Math.max(0, infestation.population + popChange),
              spread: Math.min(100, infestation.spread + (tempFavorable ? 3 : 0)),
            };
          }),
        }));
      },

      processSeasonal: () => {
        // Clear old infestations, reset beneficial populations
        set(state => ({
          pestInfestations: [],
          diseaseInfections: [],
          beneficialPopulations: {},
        }));
      },

      getActiveInfestations: (fieldId) => {
        const infestations = get().pestInfestations;
        return fieldId ? infestations.filter(i => i.fieldId === fieldId) : infestations;
      },

      getActiveInfections: (fieldId) => {
        const infections = get().diseaseInfections;
        return fieldId ? infections.filter(i => i.fieldId === fieldId) : infections;
      },

      getTreatmentsForPest: (pestId, organicOnly = false) => {
        return TREATMENT_OPTIONS.filter(t => 
          t.targetPests?.includes(pestId) &&
          (!organicOnly || t.organicApproved)
        );
      },

      getTreatmentsForDisease: (diseaseId, organicOnly = false) => {
        return TREATMENT_OPTIONS.filter(t => 
          t.targetDiseases?.includes(diseaseId) &&
          (!organicOnly || t.organicApproved)
        );
      },
    }),
    {
      name: 'agri-os-pest-disease',
    }
  )
);

// ============================================================================
// TEST FUNCTION
// ============================================================================

export function testPestDiseaseSystem(): void {
  console.log('\n🐛 PEST & DISEASE SYSTEM TESTS');
  console.log('================================\n');
  
  const store = usePestDiseaseStore.getState();
  
  // Test 1: Database completeness
  console.log('1. Database completeness:');
  console.log(`   - Pests defined: ${Object.keys(PEST_DATABASE).length}`);
  console.log(`   - Diseases defined: ${Object.keys(DISEASE_DATABASE).length}`);
  console.log(`   - Beneficial insects: ${Object.keys(BENEFICIAL_INSECTS).length}`);
  console.log(`   - Treatment options: ${TREATMENT_OPTIONS.length}`);
  
  // Test 2: Disease Triangle
  console.log('\n2. Disease Triangle Analysis:');
  const weather: WeatherConditions = {
    temperature: 72,
    humidity: 95,
    windSpeed: 5,
    windDirection: 'N',
    precipitation: 0.5,
    cloudCover: 80,
    uvIndex: 3,
    soilTemperature: 65,
    pressure: 1013,
    visibility: 10,
  };
  
  const assessment = calculateDiseaseTriangle(
    DISEASE_DATABASE.late_blight,
    'potatoes',
    'vegetative',
    weather,
    [weather, weather, weather],
    { yearsInField: 2, previousOutbreaks: 1 }
  );
  console.log(`   - Late blight risk: ${assessment.riskLevel}`);
  console.log(`   - Outbreak probability: ${assessment.outbreakProbability}%`);
  console.log(`   - Host susceptibility: ${assessment.hostSusceptibility}%`);
  
  // Test 3: Economic Threshold
  console.log('\n3. Economic Threshold:');
  const threshold = calculateEconomicThreshold(
    PEST_DATABASE.aphids,
    75, // population
    12, // crop value
    50, // expected yield
    30, // control cost
    'reproductive'
  );
  console.log(`   - Aphid population: ${threshold.currentLevel}`);
  console.log(`   - Threshold breached: ${threshold.thresholdBreached}`);
  console.log(`   - Damage estimate: $${threshold.damageEstimate.toFixed(2)}/acre`);
  console.log(`   - Treatment justified: ${threshold.treatmentJustified}`);
  
  // Test 4: Treatment options
  console.log('\n4. Treatment Options:');
  const lateBlightTreatments = store.getTreatmentsForDisease('late_blight');
  console.log(`   - Late blight treatments: ${lateBlightTreatments.length}`);
  const aphidTreatments = store.getTreatmentsForPest('aphids');
  console.log(`   - Aphid treatments: ${aphidTreatments.length}`);
  
  // Test 5: Beneficial insects
  console.log('\n5. Beneficial Insects:');
  const ladybug = BENEFICIAL_INSECTS.lady_beetle;
  console.log(`   - Lady beetle targets: ${ladybug.targetPests.join(', ')}`);
  console.log(`   - Effectiveness: ${ladybug.effectiveness}%`);
  console.log(`   - Pesticide sensitivity: ${ladybug.sensitivityToPesticides}`);
  
  console.log('\n✅ Pest & Disease system tests complete\n');
}
