// @ts-nocheck
/**
 * Soil Health Store - Comprehensive soil health management
 * Tracks organic matter, NPK, pH, biology, and crop rotation benefits
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SoilHealth, 
  SoilBiology, 
  Field, 
  CropType,
  FieldOperation 
} from '../types';
import { cropProfiles } from './crop-data';

// ============================================================================
// SOIL CONSTANTS
// ============================================================================

// Optimal ranges for soil parameters
export const OPTIMAL_RANGES = {
  ph: { min: 6.0, max: 7.0, ideal: 6.5 },
  organicMatter: { min: 3, max: 6, ideal: 4.5 },
  nitrogen: { min: 80, max: 150, ideal: 120 }, // lbs/acre
  phosphorus: { min: 20, max: 50, ideal: 35 }, // ppm
  potassium: { min: 150, max: 250, ideal: 200 }, // ppm
  sulfur: { min: 10, max: 30, ideal: 20 }, // ppm
  calcium: { min: 1000, max: 2000, ideal: 1500 }, // ppm
  magnesium: { min: 100, max: 300, ideal: 200 }, // ppm
  cec: { min: 10, max: 25, ideal: 18 },
  compaction: { min: 0, max: 40, ideal: 20 }, // 0-100 scale
};

// Crop rotation benefits (yield bonus %)
export const ROTATION_BENEFITS: Record<CropType, Record<CropType, number>> = {
  corn: {
    soybeans: 15,  // Corn after soybeans
    alfalfa: 20,
    wheat: 8,
    oats: 6,
    corn: 0,       // Continuous corn
  },
  soybeans: {
    corn: 10,
    wheat: 8,
    oats: 6,
    alfalfa: 12,
    soybeans: -5,  // Soybean-after-soybean penalty
  },
  wheat: {
    soybeans: 8,
    corn: 5,
    alfalfa: 10,
    wheat: 0,
  },
  cotton: {
    corn: 5,
    wheat: 8,
    soybeans: 8,
    cotton: -10,
  },
  // Vegetables
  lettuce: {
    corn: 3,
    tomatoes: 5,
    lettuce: 0,
  },
  broccoli: {
    lettuce: 5,
    corn: 3,
    broccoli: -15, // Disease pressure
  },
  strawberries: {
    oats: 5,
    corn: 3,
    strawberries: -20, // Disease buildup
  },
  tomatoes: {
    lettuce: 5,
    corn: 3,
    tomatoes: -10,
  },
  potatoes: {
    corn: 5,
    oats: 5,
    potatoes: -25,
  },
  // Forages
  alfalfa: {
    corn: 20,
    wheat: 15,
    soybeans: 10,
    alfalfa: 0,
  },
  oats: {
    soybeans: 8,
    corn: 5,
    alfalfa: 5,
    oats: 0,
  },
  barley: {
    soybeans: 8,
    corn: 5,
    barley: 0,
  },
  canola: {
    wheat: 10,
    barley: 8,
    canola: -10,
  },
  sunflowers: {
    wheat: 8,
    corn: 5,
    sunflowers: -8,
  },
  rice: {
    soybeans: 8,
    wheat: 5,
    rice: -5,
  },
};

// Cover crop benefits
export const COVER_CROP_BENEFITS = {
  nitrogenFixation: {
    legumes: { min: 50, max: 150 }, // lbs N/acre
    nonLegumes: { min: 0, max: 10 },
  },
  organicMatter: {
    annualAddition: 0.1, // % per year with cover crops
    decomposition: 0.05, // % per year
  },
  erosionReduction: 0.90, // 90% reduction
  compactionReduction: 5, // points per year
  waterHoldingIncrease: 0.05, // 5% per 1% OM increase
};

// Equipment compaction impact
export const COMPACTION_IMPACT = {
  tractor: 2,      // points per pass
  harvester: 5,
  grain_cart: 4,
  truck: 8,
  planter: 1,
  sprayer: 1,
};

// Lime requirements (lbs per acre to raise pH 0.1)
export const LIME_REQUIREMENTS: Record<string, number> = {
  sand: 100,
  loamy_sand: 150,
  sandy_loam: 200,
  loam: 250,
  silt_loam: 275,
  silt: 300,
  sandy_clay_loam: 325,
  clay_loam: 350,
  silty_clay_loam: 375,
  sandy_clay: 400,
  silty_clay: 425,
  clay: 450,
};

// Nutrient uptake by crops (lbs per bushel)
export const NUTRIENT_REMOVAL: Record<CropType, { n: number; p2o5: number; k2o: number }> = {
  corn: { n: 0.90, p2o5: 0.37, k2o: 0.27 },
  soybeans: { n: 3.80, p2o5: 0.79, k2o: 1.20 },
  wheat: { n: 1.30, p2o5: 0.50, k2o: 0.25 },
  cotton: { n: 3.00, p2o5: 1.10, k2o: 1.50 }, // per 480 lb bale
  lettuce: { n: 1.50, p2o5: 0.40, k2o: 2.00 }, // per crate
  broccoli: { n: 4.00, p2o5: 1.50, k2o: 3.50 }, // per carton
  strawberries: { n: 2.50, p2o5: 0.80, k2o: 3.20 }, // per 1000 lb
  tomatoes: { n: 2.50, p2o5: 0.80, k2o: 3.00 }, // per ton
  potatoes: { n: 0.30, p2o5: 0.15, k2o: 0.45 }, // per cwt
  alfalfa: { n: 0.45, p2o5: 0.12, k2o: 0.55 }, // per ton
  oats: { n: 0.65, p2o5: 0.25, k2o: 0.20 },
  barley: { n: 0.90, p2o5: 0.35, k2o: 0.25 },
  canola: { n: 3.00, p2o5: 1.30, k2o: 1.50 },
  sunflowers: { n: 2.00, p2o5: 0.80, k2o: 3.00 }, // per 1000 lb
  rice: { n: 1.00, p2o5: 0.45, k2o: 0.30 },
};

// ============================================================================
// SOIL CALCULATIONS
// ============================================================================

export function calculateSoilHealthScore(soil: SoilHealth): number {
  const scores = [
    scoreParameter(soil.ph, OPTIMAL_RANGES.ph.min, OPTIMAL_RANGES.ph.max, OPTIMAL_RANGES.ph.ideal),
    scoreParameter(soil.organicMatter, OPTIMAL_RANGES.organicMatter.min, OPTIMAL_RANGES.organicMatter.max, OPTIMAL_RANGES.organicMatter.ideal),
    scoreParameter(soil.nitrogen, OPTIMAL_RANGES.nitrogen.min, OPTIMAL_RANGES.nitrogen.max, OPTIMAL_RANGES.nitrogen.ideal),
    scoreParameter(soil.phosphorus, OPTIMAL_RANGES.phosphorus.min, OPTIMAL_RANGES.phosphorus.max, OPTIMAL_RANGES.phosphorus.ideal),
    scoreParameter(soil.potassium, OPTIMAL_RANGES.potassium.min, OPTIMAL_RANGES.potassium.max, OPTIMAL_RANGES.potassium.ideal),
    scoreParameter(soil.cec, OPTIMAL_RANGES.cec.min, OPTIMAL_RANGES.cec.max, OPTIMAL_RANGES.cec.ideal),
    100 - (soil.compaction * 2), // Lower compaction is better
  ];
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function scoreParameter(value: number, min: number, max: number, ideal: number): number {
  if (value < min) return Math.max(0, (value / min) * 50);
  if (value > max) return Math.max(0, 100 - ((value - max) / ideal) * 50);
  
  const range = max - min;
  const distanceFromIdeal = Math.abs(value - ideal);
  return Math.max(0, 100 - (distanceFromIdeal / range) * 50);
}

export function calculateLimeRequirement(
  currentPh: number,
  targetPh: number,
  soilTexture: string
): number {
  if (currentPh >= targetPh) return 0;
  
  const phDiff = targetPh - currentPh;
  const limePerTenth = LIME_REQUIREMENTS[soilTexture] || 300;
  
  return phDiff * 10 * limePerTenth; // lbs per acre
}

export function calculateNutrientRemoval(
  cropType: CropType,
  yieldPerAcre: number
): { n: number; p2o5: number; k2o: number } {
  const removal = NUTRIENT_REMOVAL[cropType];
  if (!removal) return { n: 0, p2o5: 0, k2o: 0 };
  
  return {
    n: removal.n * yieldPerAcre,
    p2o5: removal.p2o5 * yieldPerAcre,
    k2o: removal.k2o * yieldPerAcre,
  };
}

export function getRotationBenefit(
  previousCrop: CropType,
  currentCrop: CropType
): { yieldBonus: number; nitrogenCredit: number; explanation: string } {
  const yieldBonus = ROTATION_BENEFITS[currentCrop]?.[previousCrop] || 0;
  
  // Calculate nitrogen credit
  let nitrogenCredit = 0;
  if (previousCrop === 'soybeans' || previousCrop === 'alfalfa') {
    const profile = cropProfiles[previousCrop];
    nitrogenCredit = profile?.rotation.nitrogenContribution || 0;
  }
  
  let explanation = '';
  if (yieldBonus > 0) {
    explanation = `${previousCrop} provides excellent rotation benefits for ${currentCrop}. `;
  } else if (yieldBonus < 0) {
    explanation = `Continuous ${currentCrop} increases disease and pest pressure. `;
  } else {
    explanation = `Neutral rotation effect. `;
  }
  
  if (nitrogenCredit > 0) {
    explanation += `Nitrogen credit of ${nitrogenCredit} lbs/acre from ${previousCrop}.`;
  }
  
  return { yieldBonus, nitrogenCredit, explanation };
}

// ============================================================================
// SOIL HEALTH STORE
// ============================================================================

export interface SoilHealthState {
  fieldSoils: Record<string, SoilHealth>;
  fieldHistory: Record<string, { year: number; crop: CropType; yield: number }[]>;
  coverCrops: Record<string, { type: string; plantingDate: Date; terminationDate?: Date }>;
  
  // Actions
  initializeSoil: (fieldId: string, initialSoil?: Partial<SoilHealth>) => void;
  updateSoil: (fieldId: string, updates: Partial<SoilHealth>) => void;
  
  // Nutrient management
  applyFertilizer: (
    fieldId: string,
    nutrients: { n?: number; p2o5?: number; k2o?: number; s?: number },
    source: string
  ) => { success: boolean; cost: number; availability: number };
  
  applyLime: (fieldId: string, tonsPerAcre: number) => { success: boolean; cost: number; phChange: number };
  
  // Crop impact
  recordHarvest: (fieldId: string, cropType: CropType, yieldPerAcre: number) => void;
  recordCoverCrop: (fieldId: string, coverCropType: string, plantingDate: Date) => void;
  terminateCoverCrop: (fieldId: string, terminationDate: Date) => { nCredit: number; biomass: number };
  
  // Equipment impact
  recordFieldOperation: (fieldId: string, operation: FieldOperation) => void;
  reduceCompaction: (fieldId: string, method: 'deep_till' | 'cover_crop' | 'freeze_thaw') => void;
  
  // Analysis
  getSoilHealthScore: (fieldId: string) => number;
  getFertilizerRecommendation: (fieldId: string, cropType: CropType, targetYield: number) => {
    n: { required: number; available: number; deficit: number };
    p2o5: { required: number; available: number; deficit: number };
    k2o: { required: number; available: number; deficit: number };
  };
  getLimeRecommendation: (fieldId: string) => { required: number; current: number; target: number };
  getRotationRecommendation: (fieldId: string, proposedCrop: CropType) => {
    previousCrops: CropType[];
    benefit: number;
    nitrogenCredit: number;
    recommendation: string;
  };
  
  // Weekly processing
  processWeekly: () => void;
  processAnnual: () => void;
}

export const useSoilHealthStore = create<SoilHealthState>()(
  persist(
    (set, get) => ({
      fieldSoils: {},
      fieldHistory: {},
      coverCrops: {},

      initializeSoil: (fieldId, initialSoil) => {
        const defaultSoil: SoilHealth = {
          ph: 6.5,
          organicMatter: 3.5,
          nitrogen: 100,
          phosphorus: 25,
          potassium: 180,
          sulfur: 15,
          calcium: 1200,
          magnesium: 180,
          cec: 15,
          compaction: 30,
          drainage: 'good',
          texture: 'silt_loam',
          biology: {
            mycorrhizae: 60,
            bacteria: 70,
            fungi: 65,
            earthworms: 8,
            beneficialNematodes: 60,
          },
          lastTested: new Date(),
        };
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: { ...defaultSoil, ...initialSoil },
          },
        }));
      },

      updateSoil: (fieldId, updates) => {
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...state.fieldSoils[fieldId],
              ...updates,
            },
          },
        }));
      },

      applyFertilizer: (fieldId, nutrients, source) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return { success: false, cost: 0, availability: 0 };
        
        // Apply nutrients (convert P2O5 to P, K2O to K)
        const nApplied = nutrients.n || 0;
        const pApplied = (nutrients.p2o5 || 0) * 0.44;
        const kApplied = (nutrients.k2o || 0) * 0.83;
        const sApplied = nutrients.s || 0;
        
        // Update soil (simplified - would model availability over time)
        const updatedSoil: Partial<SoilHealth> = {
          nitrogen: Math.min(200, soil.nitrogen + nApplied * 0.6), // 60% available
          phosphorus: Math.min(80, soil.phosphorus + pApplied * 0.1),
          potassium: Math.min(400, soil.potassium + kApplied * 0.15),
          sulfur: Math.min(50, soil.sulfur + sApplied * 0.5),
        };
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: { ...soil, ...updatedSoil },
          },
        }));
        
        // Calculate cost (simplified)
        const cost = (nutrients.n || 0) * 0.55 + (nutrients.p2o5 || 0) * 0.45 + 
                     (nutrients.k2o || 0) * 0.35 + (nutrients.s || 0) * 0.25;
        
        return { 
          success: true, 
          cost,
          availability: 0.6, // Percentage immediately available
        };
      },

      applyLime: (fieldId, tonsPerAcre) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return { success: false, cost: 0, phChange: 0 };
        
        // Calculate pH change (simplified)
        const limeEfficiency = LIME_REQUIREMENTS[soil.texture] || 300;
        const phChange = (tonsPerAcre * 2000) / limeEfficiency * 0.1;
        
        const newPh = Math.min(7.5, soil.ph + phChange);
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...soil,
              ph: newPh,
              calcium: soil.calcium + tonsPerAcre * 800, // lbs per ton
            },
          },
        }));
        
        const cost = tonsPerAcre * 35; // $35/ton typical
        
        return { success: true, cost, phChange };
      },

      recordHarvest: (fieldId, cropType, yieldPerAcre) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return;
        
        // Remove nutrients
        const removal = calculateNutrientRemoval(cropType, yieldPerAcre);
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...soil,
              nitrogen: Math.max(20, soil.nitrogen - removal.n),
              phosphorus: Math.max(10, soil.phosphorus - removal.p2o5 * 0.44),
              potassium: Math.max(80, soil.potassium - removal.k2o * 0.83),
            },
          },
          fieldHistory: {
            ...state.fieldHistory,
            [fieldId]: [
              ...(state.fieldHistory[fieldId] || []),
              { year: new Date().getFullYear(), crop: cropType, yield: yieldPerAcre },
            ].slice(-10),
          },
        }));
      },

      recordCoverCrop: (fieldId, coverCropType, plantingDate) => {
        set((state) => ({
          coverCrops: {
            ...state.coverCrops,
            [fieldId]: {
              type: coverCropType,
              plantingDate,
            },
          },
        }));
      },

      terminateCoverCrop: (fieldId, terminationDate) => {
        const coverCrop = get().coverCrops[fieldId];
        if (!coverCrop) return { nCredit: 0, biomass: 0 };
        
        const soil = get().fieldSoils[fieldId];
        if (!soil) return { nCredit: 0, biomass: 0 };
        
        // Calculate nitrogen credit
        const isLegume = ['clover', 'vetch', 'peas', 'beans', 'alfalfa'].some(l => 
          coverCrop.type.toLowerCase().includes(l)
        );
        
        const nCredit = isLegume 
          ? COVER_CROP_BENEFITS.nitrogenFixation.legumes.min + 
            Math.random() * (COVER_CROP_BENEFITS.nitrogenFixation.legumes.max - 
            COVER_CROP_BENEFITS.nitrogenFixation.legumes.min)
          : Math.random() * COVER_CROP_BENEFITS.nitrogenFixation.nonLegumes.max;
        
        const biomass = 2000 + Math.random() * 4000; // lbs per acre
        
        // Update soil
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...soil,
              nitrogen: Math.min(200, soil.nitrogen + nCredit),
              organicMatter: Math.min(8, soil.organicMatter + COVER_CROP_BENEFITS.organicMatter.annualAddition),
            },
          },
          coverCrops: {
            ...state.coverCrops,
            [fieldId]: {
              ...coverCrop,
              terminationDate,
            },
          },
        }));
        
        return { nCredit: Math.round(nCredit), biomass: Math.round(biomass) };
      },

      recordFieldOperation: (fieldId, operation) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return;
        
        // Calculate compaction from equipment
        let compactionIncrease = 0;
        for (const equip of operation.equipment) {
          if (equip.toLowerCase().includes('tractor')) compactionIncrease += COMPACTION_IMPACT.tractor;
          else if (equip.toLowerCase().includes('harvest')) compactionIncrease += COMPACTION_IMPACT.harvester;
          else if (equip.toLowerCase().includes('cart')) compactionIncrease += COMPACTION_IMPACT.grain_cart;
          else if (equip.toLowerCase().includes('truck')) compactionIncrease += COMPACTION_IMPACT.truck;
        }
        
        // Reduce if soil is dry
        if (soil.moisture < 30) compactionIncrease *= 0.5;
        else if (soil.moisture > 60) compactionIncrease *= 1.5;
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...soil,
              compaction: Math.min(100, soil.compaction + compactionIncrease),
            },
          },
        }));
      },

      reduceCompaction: (fieldId, method) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return;
        
        let reduction = 0;
        switch (method) {
          case 'deep_till':
            reduction = 15;
            break;
          case 'cover_crop':
            reduction = 5;
            break;
          case 'freeze_thaw':
            reduction = 3;
            break;
        }
        
        set((state) => ({
          fieldSoils: {
            ...state.fieldSoils,
            [fieldId]: {
              ...soil,
              compaction: Math.max(0, soil.compaction - reduction),
            },
          },
        }));
      },

      getSoilHealthScore: (fieldId) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return 0;
        return calculateSoilHealthScore(soil);
      },

      getFertilizerRecommendation: (fieldId, cropType, targetYield) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) {
          return {
            n: { required: 0, available: 0, deficit: 0 },
            p2o5: { required: 0, available: 0, deficit: 0 },
            k2o: { required: 0, available: 0, deficit: 0 },
          };
        }
        
        const cropProfile = cropProfiles[cropType];
        const nutrientNeeds = cropProfile?.nutrientRequirements;
        
        if (!nutrientNeeds) {
          return {
            n: { required: 0, available: 0, deficit: 0 },
            p2o5: { required: 0, available: 0, deficit: 0 },
            k2o: { required: 0, available: 0, deficit: 0 },
          };
        }
        
        // Calculate requirements based on target yield
        const yieldRatio = targetYield / (cropProfile.yieldExpectations.average || 150);
        
        const nRequired = nutrientNeeds.nitrogen.totalLbsPerAcre * yieldRatio;
        const pRequired = nutrientNeeds.phosphorus.totalLbsPerAcre * yieldRatio;
        const kRequired = nutrientNeeds.potassium.totalLbsPerAcre * yieldRatio;
        
        return {
          n: {
            required: Math.round(nRequired),
            available: Math.round(soil.nitrogen),
            deficit: Math.max(0, Math.round(nRequired - soil.nitrogen)),
          },
          p2o5: {
            required: Math.round(pRequired * 2.29), // Convert P to P2O5
            available: Math.round(soil.phosphorus * 2.29),
            deficit: Math.max(0, Math.round((pRequired - soil.phosphorus) * 2.29)),
          },
          k2o: {
            required: Math.round(kRequired * 1.2), // Convert K to K2O
            available: Math.round(soil.potassium * 1.2),
            deficit: Math.max(0, Math.round((kRequired - soil.potassium) * 1.2)),
          },
        };
      },

      getLimeRecommendation: (fieldId) => {
        const soil = get().fieldSoils[fieldId];
        if (!soil) return { required: 0, current: 6.5, target: 6.5 };
        
        const targetPh = OPTIMAL_RANGES.ph.ideal;
        const required = calculateLimeRequirement(soil.ph, targetPh, soil.texture);
        
        return {
          required: Math.round(required),
          current: soil.ph,
          target: targetPh,
        };
      },

      getRotationRecommendation: (fieldId, proposedCrop) => {
        const history = get().fieldHistory[fieldId] || [];
        const previousCrops = history.slice(-3).map((h) => h.crop);
        const lastCrop = previousCrops[previousCrops.length - 1];
        
        const rotationBenefit = lastCrop 
          ? getRotationBenefit(lastCrop, proposedCrop)
          : { yieldBonus: 0, nitrogenCredit: 0, explanation: 'No rotation history available.' };
        
        return {
          previousCrops,
          benefit: rotationBenefit.yieldBonus,
          nitrogenCredit: rotationBenefit.nitrogenCredit,
          recommendation: rotationBenefit.explanation,
        };
      },

      processWeekly: () => {
        // Nutrient mineralization from organic matter
        set((state) => ({
          fieldSoils: Object.fromEntries(
            Object.entries(state.fieldSoils).map(([fieldId, soil]) => {
              const mineralizationRate = 0.02; // 2% of OM mineralizes per week
              const nFromOM = soil.organicMatter * 20 * mineralizationRate; // lbs N per % OM
              
              return [fieldId, {
                ...soil,
                nitrogen: Math.min(200, soil.nitrogen + nFromOM),
                // Slight natural compaction reduction
                compaction: Math.max(0, soil.compaction - 0.1),
              }];
            })
          ),
        }));
      },

      processAnnual: () => {
        // Annual soil changes
        set((state) => ({
          fieldSoils: Object.fromEntries(
            Object.entries(state.fieldSoils).map(([fieldId, soil]) => {
              // Natural OM change
              const omChange = COVER_CROP_BENEFITS.organicMatter.decomposition;
              
              // Biology improvements with good management
              const biologyImprovement = {
                mycorrhizae: Math.min(100, soil.biology.mycorrhizae + 2),
                bacteria: Math.min(100, soil.biology.bacteria + 1),
                fungi: Math.min(100, soil.biology.fungi + 2),
                earthworms: Math.min(20, soil.biology.earthworms + 0.5),
                beneficialNematodes: Math.min(100, soil.biology.beneficialNematodes + 2),
              };
              
              return [fieldId, {
                ...soil,
                organicMatter: Math.max(1, soil.organicMatter - omChange),
                biology: biologyImprovement,
              }];
            })
          ),
        }));
      },
    }),
    {
      name: 'agri-os-soil-health',
    }
  )
);
