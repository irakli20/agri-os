// @ts-nocheck
/**
 * Storage Store - Grain elevator and on-farm storage management
 * Priority 1 Feature for Agri-OS
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  StorageFacility, 
  StoredCrop, 
  CropType, 
  CropQuality,
  Field,
  CropInstance 
} from '../types';
import { cropProfiles } from './crop-data';

// ============================================================================
// STORAGE CONSTANTS
// ============================================================================

export const STORAGE_COSTS = {
  grain_elevator: 0.04, // $ per bushel per week
  on_farm_bin: 0.02,
  silo: 0.025,
  warehouse: 0.05,
  cold_storage: 0.15,
};

export const MOISTURE_DISCOUNTS: Partial<Record<CropType, { threshold: number; discount: number }[]>> = {
  corn: [
    { threshold: 15.5, discount: 0 },
    { threshold: 17, discount: 0.02 },
    { threshold: 18, discount: 0.04 },
    { threshold: 20, discount: 0.06 },
    { threshold: 25, discount: 0.10 },
  ],
  soybeans: [
    { threshold: 13, discount: 0 },
    { threshold: 15, discount: 0.015 },
    { threshold: 18, discount: 0.03 },
    { threshold: 20, discount: 0.05 },
  ],
  wheat: [
    { threshold: 13.5, discount: 0 },
    { threshold: 15, discount: 0.02 },
    { threshold: 18, discount: 0.04 },
    { threshold: 20, discount: 0.06 },
  ],
};

export const SPOILAGE_RATES = {
  grain_elevator: 0.001, // 0.1% per week
  on_farm_bin: 0.002,
  silo: 0.0015,
  warehouse: 0.003,
  cold_storage: 0.0001,
};

export const MOISTURE_SPOILAGE_MULTIPLIERS: Partial<Record<CropType, { threshold: number; multiplier: number }>> = {
  corn: { threshold: 15.5, multiplier: 2.0 },
  soybeans: { threshold: 13, multiplier: 2.5 },
  wheat: { threshold: 13.5, multiplier: 2.0 },
};

// ============================================================================
// QUALITY CALCULATION
// ============================================================================

export interface QualityFactors {
  moisture: number;
  harvestMoisture: number;
  testWeight: number;
  foreignMatter: number;
  damagedKernels: number;
  harvestTiming: 'optimal' | 'early' | 'late' | 'very_late';
  weatherDuringHarvest: 'dry' | 'light_rain' | 'heavy_rain' | 'dew';
  storageDuration: number; // weeks
  storageConditions: 'excellent' | 'good' | 'fair' | 'poor';
}

export function calculateCropQuality(factors: QualityFactors): {
  quality: CropQuality;
  gradeFactors: string[];
  priceAdjustment: number; // percentage
} {
  let qualityScore = 100;
  const gradeFactors: string[] = [];

  // Moisture penalty
  const cropProfile = cropProfiles[factors.moisture as unknown as CropType];
  const moistureTarget = cropProfile?.harvest.moistureTarget || 13.5;
  if (factors.harvestMoisture > moistureTarget + 2) {
    qualityScore -= 10;
    gradeFactors.push(`High moisture at harvest: ${factors.harvestMoisture}%`);
  }

  // Test weight (important for grains)
  if (factors.testWeight < 56) {
    qualityScore -= 15;
    gradeFactors.push(`Low test weight: ${factors.testWeight} lbs/bu`);
  } else if (factors.testWeight > 58) {
    qualityScore += 5;
    gradeFactors.push(`Excellent test weight: ${factors.testWeight} lbs/bu`);
  }

  // Foreign matter
  if (factors.foreignMatter > 2) {
    qualityScore -= Math.min(20, factors.foreignMatter * 5);
    gradeFactors.push(`Foreign matter: ${factors.foreignMatter}%`);
  }

  // Damaged kernels
  if (factors.damagedKernels > 5) {
    qualityScore -= Math.min(25, factors.damagedKernels * 3);
    gradeFactors.push(`Damaged kernels: ${factors.damagedKernels}%`);
  }

  // Harvest timing
  switch (factors.harvestTiming) {
    case 'optimal':
      qualityScore += 5;
      gradeFactors.push('Optimal harvest timing');
      break;
    case 'early':
      qualityScore -= 5;
      gradeFactors.push('Early harvest - moisture issues');
      break;
    case 'late':
      qualityScore -= 10;
      gradeFactors.push('Late harvest - quality degradation');
      break;
    case 'very_late':
      qualityScore -= 25;
      gradeFactors.push('Very late harvest - significant quality loss');
      break;
  }

  // Weather during harvest
  switch (factors.weatherDuringHarvest) {
    case 'dry':
      qualityScore += 3;
      break;
    case 'dew':
      qualityScore -= 3;
      gradeFactors.push('Harvested with dew');
      break;
    case 'light_rain':
      qualityScore -= 10;
      gradeFactors.push('Light rain during harvest');
      break;
    case 'heavy_rain':
      qualityScore -= 20;
      gradeFactors.push('Heavy rain during harvest');
      break;
  }

  // Storage duration and conditions
  if (factors.storageDuration > 12) {
    const storagePenalty = Math.min(15, (factors.storageDuration - 12) * 1.5);
    qualityScore -= storagePenalty;
    gradeFactors.push(`Extended storage: ${factors.storageDuration} weeks`);
  }

  switch (factors.storageConditions) {
    case 'excellent':
      qualityScore += 3;
      break;
    case 'fair':
      qualityScore -= 5;
      gradeFactors.push('Fair storage conditions');
      break;
    case 'poor':
      qualityScore -= 15;
      gradeFactors.push('Poor storage conditions');
      break;
  }

  // Determine quality grade
  let quality: CropQuality;
  if (qualityScore >= 90) {
    quality = 'premium';
  } else if (qualityScore >= 75) {
    quality = 'standard';
  } else if (qualityScore >= 50) {
    quality = 'discount';
  } else {
    quality = 'reject';
  }

  // Calculate price adjustment
  const priceAdjustment = (qualityScore - 85) / 5; // +/- percentage from base

  return { quality, gradeFactors, priceAdjustment };
}

// ============================================================================
// MOISTURE CALCULATIONS
// ============================================================================

export function calculateMoistureDiscount(
  cropType: CropType,
  moisture: number
): { discount: number; dryingCost: number } {
  const discounts = MOISTURE_DISCOUNTS[cropType] || MOISTURE_DISCOUNTS.wheat || [];
  let discount = 0;
  
  for (const tier of discounts || []) {
    if (moisture > tier.threshold) {
      discount = tier.discount;
    }
  }

  // Calculate drying cost for excess moisture
  const targetMoisture = cropProfiles[cropType]?.harvest.moistureTarget || 13.5;
  let dryingCost = 0;
  if (moisture > targetMoisture) {
    const pointsOver = moisture - targetMoisture;
    // $0.05 per point per bushel is typical drying cost
    dryingCost = pointsOver * 0.05;
  }

  return { discount, dryingCost };
}

export function calculateMoistureLoss(
  cropType: CropType,
  currentMoisture: number,
  weeksInStorage: number,
  facilityType: StorageFacility['type']
): number {
  const baseLossRate = 0.1; // 0.1% per week base
  const multipliers = MOISTURE_SPOILAGE_MULTIPLIERS[cropType];
  
  let moistureMultiplier = 1;
  if (multipliers && currentMoisture > multipliers.threshold) {
    moistureMultiplier = multipliers.multiplier;
  }

  const facilityMultiplier = facilityType === 'cold_storage' ? 0.5 : 1.0;
  
  return baseLossRate * moistureMultiplier * facilityMultiplier * weeksInStorage;
}

// ============================================================================
// STORAGE STORE
// ============================================================================

export interface StorageState {
  facilities: StorageFacility[];
  
  // Actions
  addFacility: (facility: Omit<StorageFacility, 'id'>) => string;
  removeFacility: (facilityId: string) => boolean;
  upgradeFacility: (facilityId: string, upgrades: Partial<StorageFacility>) => boolean;
  
  // Storage operations
  storeHarvest: (
    field: Field,
    crop: CropInstance,
    facilityId: string,
    harvestConditions?: Partial<QualityFactors>
  ) => { success: boolean; storedCropId?: string; message: string };
  
  moveToStorage: (
    cropId: string,
    fromFacilityId: string,
    toFacilityId: string,
    quantity: number
  ) => { success: boolean; message: string };
  
  removeFromStorage: (
    facilityId: string,
    cropId: string,
    quantity: number
  ) => { success: boolean; removedCrop?: StoredCrop; message: string };
  
  // Quality management
  updateCropQuality: (facilityId: string, cropId: string) => void;
  blendCrops: (facilityId: string, cropIds: string[], ratios: number[]) => { success: boolean; blendedCrop?: StoredCrop };
  
  // Weekly processing
  processWeeklyStorage: () => {
    storageCosts: number;
    spoilageLosses: { cropId: string; quantity: number; facilityId: string }[];
    qualityChanges: { cropId: string; oldQuality: CropQuality; newQuality: CropQuality }[];
  };
  
  // Queries
  getAvailableCapacity: (facilityId: string) => number;
  getTotalStorageByCrop: (cropType: CropType) => number;
  getStorageUtilization: (facilityId: string) => number;
  getInventoryValue: (marketPrices: Record<CropType, number>) => number;
  getStorageCostProjection: (weeks: number) => number;
}

export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      facilities: [],

      addFacility: (facility) => {
        const id = `facility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newFacility: StorageFacility = {
          ...facility,
          id,
          currentContents: [],
        };
        set((state) => ({
          facilities: [...state.facilities, newFacility],
        }));
        return id;
      },

      removeFacility: (facilityId) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility) return false;
        if (facility.currentContents.length > 0) return false;
        
        set((state) => ({
          facilities: state.facilities.filter((f) => f.id !== facilityId),
        }));
        return true;
      },

      upgradeFacility: (facilityId, upgrades) => {
        set((state) => ({
          facilities: state.facilities.map((f) =>
            f.id === facilityId ? { ...f, ...upgrades } : f
          ),
        }));
        return true;
      },

      storeHarvest: (field, crop, facilityId, harvestConditions) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility) {
          return { success: false, message: 'Storage facility not found' };
        }

        // Calculate yield from field
        const yieldBushels = (crop.yieldActual || crop.yieldEstimate) * field.size;
        
        // Check capacity
        const availableCapacity = get().getAvailableCapacity(facilityId);
        if (yieldBushels > availableCapacity) {
          return { 
            success: false, 
            message: `Insufficient storage capacity. Available: ${availableCapacity.toFixed(1)} bu, Need: ${yieldBushels.toFixed(1)} bu` 
          };
        }

        // Determine quality factors
        const qualityFactors: QualityFactors = {
          moisture: crop.moisture,
          harvestMoisture: crop.moisture,
          testWeight: 56 + Math.random() * 4, // Simulate test weight 56-60
          foreignMatter: Math.random() * 2, // 0-2%
          damagedKernels: Math.random() * 3, // 0-3%
          harvestTiming: harvestConditions?.harvestTiming || 'optimal',
          weatherDuringHarvest: harvestConditions?.weatherDuringHarvest || 'dry',
          storageDuration: 0,
          storageConditions: facility.condition >= 80 ? 'excellent' : 
                            facility.condition >= 60 ? 'good' : 
                            facility.condition >= 40 ? 'fair' : 'poor',
        };

        const qualityResult = calculateCropQuality(qualityFactors);

        // Create stored crop record
        const storedCrop: StoredCrop = {
          id: `stored_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          cropType: crop.type,
          variety: crop.variety,
          quantity: yieldBushels,
          moisture: crop.moisture,
          quality: qualityResult.quality,
          harvestDate: new Date(),
          storageDate: new Date(),
          spoilageRisk: crop.moisture > 15 ? 30 : 10,
          storageCostToDate: 0,
        };

        set((state) => ({
          facilities: state.facilities.map((f) =>
            f.id === facilityId
              ? { ...f, currentContents: [...f.currentContents, storedCrop] }
              : f
          ),
        }));

        return { 
          success: true, 
          storedCropId: storedCrop.id,
          message: `Stored ${yieldBushels.toFixed(1)} bu of ${crop.type} as ${qualityResult.quality} quality` 
        };
      },

      moveToStorage: (cropId, fromFacilityId, toFacilityId, quantity) => {
        const fromFacility = get().facilities.find((f) => f.id === fromFacilityId);
        const toFacility = get().facilities.find((f) => f.id === toFacilityId);
        
        if (!fromFacility || !toFacility) {
          return { success: false, message: 'Facility not found' };
        }

        const crop = fromFacility.currentContents.find((c) => c.id === cropId);
        if (!crop) {
          return { success: false, message: 'Crop not found in source facility' };
        }

        if (quantity > crop.quantity) {
          return { success: false, message: 'Insufficient quantity' };
        }

        const availableCapacity = get().getAvailableCapacity(toFacilityId);
        if (quantity > availableCapacity) {
          return { success: false, message: 'Insufficient capacity in destination' };
        }

        set((state) => ({
          facilities: state.facilities.map((f) => {
            if (f.id === fromFacilityId) {
              return {
                ...f,
                currentContents: f.currentContents.map((c) =>
                  c.id === cropId ? { ...c, quantity: c.quantity - quantity } : c
                ).filter((c) => c.quantity > 0),
              };
            }
            if (f.id === toFacilityId) {
              const movedCrop: StoredCrop = {
                ...crop,
                id: `stored_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                quantity,
                storageDate: new Date(),
                storageCostToDate: 0,
              };
              return {
                ...f,
                currentContents: [...f.currentContents, movedCrop],
              };
            }
            return f;
          }),
        }));

        return { success: true, message: `Moved ${quantity.toFixed(1)} bu to ${toFacility.name}` };
      },

      removeFromStorage: (facilityId, cropId, quantity) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility) {
          return { success: false, message: 'Facility not found' };
        }

        const cropIndex = facility.currentContents.findIndex((c) => c.id === cropId);
        if (cropIndex === -1) {
          return { success: false, message: 'Crop not found' };
        }

        const crop = facility.currentContents[cropIndex];
        if (quantity > crop.quantity) {
          return { success: false, message: 'Insufficient quantity' };
        }

        const removedCrop: StoredCrop = { ...crop, quantity };

        set((state) => ({
          facilities: state.facilities.map((f) => {
            if (f.id !== facilityId) return f;
            
            const updatedContents = [...f.currentContents];
            if (quantity >= crop.quantity) {
              updatedContents.splice(cropIndex, 1);
            } else {
              updatedContents[cropIndex] = {
                ...crop,
                quantity: crop.quantity - quantity,
              };
            }
            
            return { ...f, currentContents: updatedContents };
          }),
        }));

        return { success: true, removedCrop, message: `Removed ${quantity.toFixed(1)} bu` };
      },

      updateCropQuality: (facilityId, cropId) => {
        set((state) => ({
          facilities: state.facilities.map((f) => {
            if (f.id !== facilityId) return f;
            
            return {
              ...f,
              currentContents: f.currentContents.map((c) => {
                if (c.id !== cropId) return c;
                
                const weeksInStorage = Math.floor(
                  (Date.now() - c.storageDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
                );
                
                const factors: QualityFactors = {
                  moisture: c.moisture,
                  harvestMoisture: c.moisture,
                  testWeight: 57,
                  foreignMatter: 0.5,
                  damagedKernels: 1,
                  harvestTiming: 'optimal',
                  weatherDuringHarvest: 'dry',
                  storageDuration: weeksInStorage,
                  storageConditions: f.condition >= 80 ? 'excellent' : 
                                    f.condition >= 60 ? 'good' : 
                                    f.condition >= 40 ? 'fair' : 'poor',
                };
                
                const result = calculateCropQuality(factors);
                return { ...c, quality: result.quality };
              }),
            };
          }),
        }));
      },

      blendCrops: (facilityId, cropIds, ratios) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility) {
          return { success: false, blendedCrop: undefined };
        }

        const cropsToBlend = facility.currentContents.filter((c) => cropIds.includes(c.id));
        if (cropsToBlend.length !== cropIds.length) {
          return { success: false, blendedCrop: undefined };
        }

        // Calculate blended properties
        const totalQuantity = cropsToBlend.reduce((sum, c) => sum + c.quantity, 0);
        const blendedMoisture = cropsToBlend.reduce(
          (sum, c, i) => sum + c.moisture * (ratios[i] || 0),
          0
        );
        
        // Quality is based on weighted average
        const qualityScores: Record<CropQuality, number> = { premium: 4, standard: 3, discount: 2, reject: 1 };
        const avgQualityScore = cropsToBlend.reduce(
          (sum, c, i) => sum + qualityScores[c.quality] * (ratios[i] || 0),
          0
        );
        
        let blendedQuality: CropQuality;
        if (avgQualityScore >= 3.5) blendedQuality = 'premium';
        else if (avgQualityScore >= 2.5) blendedQuality = 'standard';
        else if (avgQualityScore >= 1.5) blendedQuality = 'discount';
        else blendedQuality = 'reject';

        const blendedCrop: StoredCrop = {
          id: `blended_${Date.now()}`,
          cropType: cropsToBlend[0].cropType,
          variety: `Blend of ${cropsToBlend.map((c) => c.variety).join(', ')}`,
          quantity: totalQuantity,
          moisture: blendedMoisture,
          quality: blendedQuality,
          harvestDate: new Date(),
          storageDate: new Date(),
          spoilageRisk: Math.max(...cropsToBlend.map((c) => c.spoilageRisk)),
          storageCostToDate: cropsToBlend.reduce((sum, c) => sum + c.storageCostToDate, 0),
        };

        set((state) => ({
          facilities: state.facilities.map((f) => {
            if (f.id !== facilityId) return f;
            
            const remainingContents = f.currentContents.filter(
              (c) => !cropIds.includes(c.id)
            );
            
            return {
              ...f,
              currentContents: [...remainingContents, blendedCrop],
            };
          }),
        }));

        return { success: true, blendedCrop };
      },

      processWeeklyStorage: () => {
        let totalStorageCosts = 0;
        const spoilageLosses: { cropId: string; quantity: number; facilityId: string }[] = [];
        const qualityChanges: { cropId: string; oldQuality: CropQuality; newQuality: CropQuality }[] = [];

        set((state) => ({
          facilities: state.facilities.map((f) => {
            const updatedContents = f.currentContents.map((crop) => {
              // Calculate storage cost
              const weeklyCost = crop.quantity * f.costPerBushelPerWeek;
              totalStorageCosts += weeklyCost;
              
              // Calculate spoilage
              let spoilageRate = SPOILAGE_RATES[f.type] || 0.002;
              const multipliers = MOISTURE_SPOILAGE_MULTIPLIERS[crop.cropType];
              if (multipliers && crop.moisture > multipliers.threshold) {
                spoilageRate *= multipliers.multiplier;
              }
              
              const spoilageLoss = crop.quantity * spoilageRate;
              if (spoilageLoss > 0.1) {
                spoilageLosses.push({
                  cropId: crop.id,
                  quantity: spoilageLoss,
                  facilityId: f.id,
                });
              }

              // Moisture loss during storage (natural drying)
              const moistureLoss = calculateMoistureLoss(
                crop.cropType,
                crop.moisture,
                1,
                f.type
              );

              // Quality degradation over time
              const oldQuality = crop.quality;
              let newQuality = oldQuality;
              
              const weeksInStorage = Math.floor(
                (Date.now() - crop.storageDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
              );
              
              if (weeksInStorage > 4 && crop.moisture > 15) {
                if (oldQuality === 'premium') newQuality = 'standard';
                else if (oldQuality === 'standard') newQuality = 'discount';
                else if (oldQuality === 'discount') newQuality = 'reject';
              }

              if (newQuality !== oldQuality) {
                qualityChanges.push({
                  cropId: crop.id,
                  oldQuality,
                  newQuality,
                });
              }

              return {
                ...crop,
                quantity: crop.quantity - spoilageLoss,
                moisture: Math.max(
                  cropProfiles[crop.cropType]?.harvest.moistureTarget || 13,
                  crop.moisture - moistureLoss
                ),
                storageCostToDate: crop.storageCostToDate + weeklyCost,
                spoilageRisk: Math.min(100, crop.spoilageRisk + (crop.moisture > 15 ? 5 : 1)),
                quality: newQuality,
              };
            }).filter((crop) => crop.quantity > 0.1); // Remove negligible amounts

            return { ...f, currentContents: updatedContents };
          }),
        }));

        return {
          storageCosts: totalStorageCosts,
          spoilageLosses,
          qualityChanges,
        };
      },

      getAvailableCapacity: (facilityId) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility) return 0;
        
        const usedCapacity = facility.currentContents.reduce(
          (sum, c) => sum + c.quantity,
          0
        );
        return facility.capacity - usedCapacity;
      },

      getTotalStorageByCrop: (cropType) => {
        return get().facilities.reduce((total, facility) => {
          const cropTotal = facility.currentContents
            .filter((c) => c.cropType === cropType)
            .reduce((sum, c) => sum + c.quantity, 0);
          return total + cropTotal;
        }, 0);
      },

      getStorageUtilization: (facilityId) => {
        const facility = get().facilities.find((f) => f.id === facilityId);
        if (!facility || facility.capacity === 0) return 0;
        
        const usedCapacity = facility.currentContents.reduce(
          (sum, c) => sum + c.quantity,
          0
        );
        return (usedCapacity / facility.capacity) * 100;
      },

      getInventoryValue: (marketPrices) => {
        return get().facilities.reduce((total, facility) => {
          const facilityValue = facility.currentContents.reduce((sum, crop) => {
            const basePrice = marketPrices[crop.cropType] || 0;
            
            // Apply quality adjustment
            let qualityMultiplier = 1;
            switch (crop.quality) {
              case 'premium': qualityMultiplier = 1.1; break;
              case 'standard': qualityMultiplier = 1.0; break;
              case 'discount': qualityMultiplier = 0.85; break;
              case 'reject': qualityMultiplier = 0.5; break;
            }
            
            // Apply moisture discount
            const { discount } = calculateMoistureDiscount(crop.cropType, crop.moisture);
            
            const adjustedPrice = basePrice * qualityMultiplier * (1 - discount);
            return sum + crop.quantity * adjustedPrice;
          }, 0);
          return total + facilityValue;
        }, 0);
      },

      getStorageCostProjection: (weeks) => {
        return get().facilities.reduce((total, facility) => {
          const weeklyFacilityCost = facility.currentContents.reduce(
            (sum, c) => sum + c.quantity * facility.costPerBushelPerWeek,
            0
          );
          return total + weeklyFacilityCost * weeks;
        }, 0);
      },
    }),
    {
      name: 'agri-os-storage',
    }
  )
);

// ============================================================================
// DEFAULT STORAGE FACILITIES
// ============================================================================

export const defaultStorageFacilities: Omit<StorageFacility, 'id'>[] = [
  {
    name: 'Main Grain Elevator',
    type: 'grain_elevator',
    capacity: 100000,
    currentContents: [],
    costPerBushelPerWeek: STORAGE_COSTS.grain_elevator,
    moistureDiscount: 0,
    location: 'town',
    condition: 90,
    features: ['drying', 'cleaning', 'grading'],
  },
  {
    name: 'Farm Bin #1',
    type: 'on_farm_bin',
    capacity: 10000,
    currentContents: [],
    costPerBushelPerWeek: STORAGE_COSTS.on_farm_bin,
    moistureDiscount: 0,
    location: 'farm',
    condition: 85,
    features: ['aeration', 'temperature_monitoring'],
  },
  {
    name: 'Farm Bin #2',
    type: 'on_farm_bin',
    capacity: 10000,
    currentContents: [],
    costPerBushelPerWeek: STORAGE_COSTS.on_farm_bin,
    moistureDiscount: 0,
    location: 'farm',
    condition: 80,
    features: ['aeration'],
  },
];

// ============================================================================
// HARVEST STORAGE HELPER
// ============================================================================

export interface HarvestStorageResult {
  storedCrops: {
    facilityId: string;
    facilityName: string;
    cropId: string;
    quantity: number;
    quality: CropQuality;
  }[];
  storageCosts: number;
  totalValue: number;
  qualitySummary: Record<CropQuality, number>;
}

export function createInitialStorageFacilities(): StorageFacility[] {
  const store = useStorageStore.getState();
  return defaultStorageFacilities.map((facility) => {
    const id = store.addFacility(facility);
    return { ...facility, id, currentContents: [] };
  });
}
