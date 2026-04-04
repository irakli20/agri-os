// @ts-nocheck
/**
 * Post-Harvest Logistics Store
 * Manages grain cart logistics, drying costs, truck scheduling,
 * storage facilities, forward contracting, and basis calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CropType, Field, Coordinates, StoredCrop, StorageFacility } from '../../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GrainCartLogistics {
  id: string;
  fieldId: string;
  cropType: CropType;
  harvestDate: Date;
  
  // Field to Truck
  fieldToTruck: {
    grainCartId: string;
    cartCapacity: number; // bushels
    loadsToTruck: number;
    averageDistance: number; // feet
    waitTime: number; // minutes per load
    cycleTime: number; // minutes
  };
  
  // Truck to Elevator
  truckToElevator: {
    truckId: string;
    truckCapacity: number; // bushels
    distance: number; // miles
    roadConditions: 'good' | 'fair' | 'poor';
    travelTime: number; // minutes one way
    unloadTime: number; // minutes
    roundTripTime: number; // minutes
  };
  
  // Harvest Flow
  combineCapacity: number; // bushels/hour
  trucksNeeded: number;
  maxHarvestRate: number; // acres/hour (constrained by logistics)
  bottleneck: 'combine' | 'cart' | 'truck' | 'elevator';
  
  // Costs
  fuelCost: number; // per acre
  laborCost: number; // per acre
  equipmentCost: number; // per acre
  totalLogisticsCost: number; // per acre
}

export interface DryingOperation {
  id: string;
  facilityId: string;
  cropType: CropType;
  
  // Moisture Information
  harvestMoisture: number; // %
  targetMoisture: number; // % (typically 15% for corn, 13% for beans)
  moistureRemoved: number; // % points
  
  // Volume
  wetBushels: number;
  dryBushels: number; // after shrink
  shrinkFactor: number; // 1.18% per point for corn
  
  // Drying Parameters
  dryingMethod: 'high_temp' | 'natural_air' | 'low_temp' | 'combination';
  fuelType: 'lp' | 'natural_gas' | 'electric';
  fuelCostPerUnit: number;
  fuelUsed: number; // gallons or therms
  electricityUsed: number; // kWh
  
  // Costs
  fuelCost: number;
  electricityCost: number;
  laborCost: number;
  handlingCost: number; // augers, etc.
  totalDryingCost: number;
  costPerWetBushel: number;
  costPerDryBushel: number;
  costPerPoint: number;
  
  // Quality
  testWeightBefore?: number; // lbs/bushel
  testWeightAfter?: number;
  damageBefore?: number; // %
  damageAfter?: number;
}

export interface TruckSchedule {
  id: string;
  date: Date;
  truckId: string;
  driver: string;
  
  // Route
  origin: 'field' | 'storage';
  originId: string;
  destination: string; // elevator ID
  distance: number; // miles
  
  // Load
  cropType: CropType;
  bushels: number;
  moisture: number;
  
  // Timing
  scheduledDepart: Date;
  actualDepart?: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  
  // Costs
  freightRate: number; // $/bushel or $/mile
  fuelCost: number;
  driverWages: number;
  tolls: number;
  totalCost: number;
  
  // Status
  status: 'scheduled' | 'loading' | 'in_transit' | 'delivered' | 'delayed';
  deliveryTicket?: string;
}

export interface StorageManagement {
  facilityId: string;
  
  // Current Inventory
  contents: StoredGrain[];
  totalBushels: number;
  availableSpace: number;
  
  // Quality Management
  aerationSchedule: AerationCycle[];
  moistureMonitoring: MoistureReading[];
  temperatureMonitoring: TemperatureReading[];
  qualityReports: QualityReport[];
  
  // Costs
  storageCost: StorageCosts;
  
  // Logistics
  inbounds: InboundDelivery[];
  outbounds: OutboundDelivery[];
}

export interface StoredGrain extends StoredCrop {
  storageLocation: string; // bin/silo number
  dateStored: Date;
  projectedExitDate?: Date;
  storageCostToDate: number;
  qualityGrade: '1' | '2' | '3' | '4' | 'sample';
  marketValue: number; // current value
  unrealizedGainLoss: number; // vs harvest price
}

export interface AerationCycle {
  startDate: Date;
  endDate: Date;
  targetMoisture: number;
  targetTemperature: number;
  electricityUsed: number;
  cost: number;
}

export interface MoistureReading {
  date: Date;
  location: string; // probe location
  moisture: number;
  temperature: number;
}

export interface TemperatureReading {
  date: Date;
  location: string;
  temperature: number;
}

export interface QualityReport {
  date: Date;
  inspector: string;
  testWeight: number;
  moisture: number;
  damage: number;
  foreignMaterial: number;
  grade: string;
  deductions: string[];
}

export interface StorageCosts {
  fixedCosts: {
    depreciation: number; // annual
    interest: number;
    insurance: number;
    taxes: number;
    maintenance: number;
  };
  variableCosts: {
    electricity: number; // per bushel per month
    handling: number; // in/out
    shrink: number; // loss during storage
  };
  totalPerBushelPerMonth: number;
}

export interface InboundDelivery {
  date: Date;
  source: string;
  bushels: number;
  moisture: number;
  quality: string;
}

export interface OutboundDelivery {
  date: Date;
  destination: string;
  bushels: number;
  moisture: number;
  price: number;
  revenue: number;
}

export interface ForwardContract {
  id: string;
  cropType: CropType;
  contractDate: Date;
  deliveryPeriod: { start: Date; end: Date };
  
  // Pricing
  contractType: 'fixed_price' | 'basis' | 'hedge_to_arrive';
  contractedBushels: number;
  contractPrice: number; // $/bushel
  futuresPrice?: number; // for HTA contracts
  basis?: number; // for basis contracts
  
  // Delivery
  deliveryLocation: string;
  freightResponsibility: 'seller' | 'buyer';
  
  // Status
  bushelsDelivered: number;
  bushelsRemaining: number;
  status: 'open' | 'partial' | 'delivered' | 'priced' | 'expired';
  
  // Performance
  marketPriceAtContract: number;
  currentMarketPrice: number;
  unrealizedGainLoss: number;
  vsSpotMarket: number; // comparison to current spot
}

export interface BasisRecord {
  id: string;
  cropType: CropType;
  location: string; // elevator or delivery point
  date: Date;
  futuresMonth: string;
  futuresPrice: number;
  cashPrice: number;
  basis: number; // cash - futures (usually negative)
  basisStrength: 'strong' | 'normal' | 'weak';
  historicalAverage: number;
  vsAverage: number;
}

export interface StorageArbitrage {
  cropType: CropType;
  currentSpotPrice: number;
  forwardContractPrice: number;
  harvestBasis: number;
  deferredBasis: number;
  
  // Storage economics
  storageCost: number; // $/bushel/month
  interestCost: number; // opportunity cost
  shrinkLoss: number; // %
  
  // Analysis
  carryInMarket: number; // forward - spot
  costToStore: number;
  profitPotential: number; // carry - cost
  recommendation: 'store' | 'sell' | 'hedge';
  optimalExitMonth: string;
}

export interface FreightQuote {
  id: string;
  carrier: string;
  origin: string;
  destination: string;
  cropType: CropType;
  
  // Pricing
  ratePerBushel: number;
  ratePerMile: number;
  minimumCharge: number;
  fuelSurcharge: number;
  
  // Terms
  equipmentType: 'hopper' | 'walking_floor' | 'live-bottom';
  transitTime: number; // hours
  availability: Date;
  validUntil: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Moisture shrink factors (USDA standard)
const MOISTURE_SHRINK: Record<CropType, { factor: number; baseMoisture: number }> = {
  corn: { factor: 1.18, baseMoisture: 15.5 },
  soybeans: { factor: 1.18, baseMoisture: 13.0 },
  wheat: { factor: 1.20, baseMoisture: 13.5 },
  barley: { factor: 1.20, baseMoisture: 13.0 },
  oats: { factor: 1.20, baseMoisture: 14.0 },
  rice: { factor: 1.18, baseMoisture: 13.0 },
  canola: { factor: 1.20, baseMoisture: 10.0 },
  sunflowers: { factor: 1.18, baseMoisture: 10.0 },
  cotton: { factor: 0, baseMoisture: 0 }, // Not stored in bushels
  alfalfa: { factor: 0, baseMoisture: 0 },
  lettuce: { factor: 0, baseMoisture: 0 },
  broccoli: { factor: 0, baseMoisture: 0 },
  strawberries: { factor: 0, baseMoisture: 0 },
  tomatoes: { factor: 0, baseMoisture: 0 },
  potatoes: { factor: 0, baseMoisture: 0 },
};

// Drying costs per point of moisture (per bushel)
const DRYING_COSTS: Record<string, { fuel: number; total: number }> = {
  high_temp_lp: { fuel: 0.025, total: 0.045 },
  high_temp_natural_gas: { fuel: 0.015, total: 0.035 },
  natural_air: { fuel: 0.005, total: 0.015 },
  low_temp: { fuel: 0.012, total: 0.025 }
};

// Typical storage costs per bushel per month
const STORAGE_COST_RATES: Record<StorageFacility['type'], number> = {
  grain_elevator: 0.05,
  on_farm_bin: 0.03,
  silo: 0.04,
  warehouse: 0.06,
  cold_storage: 0.15
};

// ============================================================================
// STORE STATE & ACTIONS
// ============================================================================

interface PostHarvestState {
  // Data
  grainCartOperations: GrainCartLogistics[];
  dryingOperations: DryingOperation[];
  truckSchedules: TruckSchedule[];
  storageManagement: Record<string, StorageManagement>;
  forwardContracts: ForwardContract[];
  basisRecords: BasisRecord[];
  freightQuotes: FreightQuote[];
  
  // Actions - Grain Cart Logistics
  planGrainCartOperation: (
    fieldId: string,
    cropType: CropType,
    acres: number,
    expectedYield: number,
    harvestMoisture: number,
    equipment: {
      combineCapacity: number;
      grainCartCapacity: number;
      truckCapacity: number;
      numTrucks: number;
    },
    distances: {
      fieldToTruck: number;
      toElevator: number;
    }
  ) => GrainCartLogistics;
  
  calculateLogisticsBottleneck: (operation: GrainCartLogistics) => {
    bottleneck: GrainCartLogistics['bottleneck'];
    maxRate: number;
    recommendation: string;
  };
  
  optimizeTruckFleet: (
    fieldId: string,
    acres: number,
    yieldPerAcre: number,
    distances: { elevator: number }
  ) => { trucksNeeded: number; totalCost: number };
  
  // Actions - Drying
  calculateDryingCost: (
    cropType: CropType,
    wetBushels: number,
    harvestMoisture: number,
    targetMoisture: number,
    method: DryingOperation['dryingMethod'],
    fuelType: DryingOperation['fuelType']
  ) => DryingOperation;
  
  compareDryingMethods: (
    cropType: CropType,
    wetBushels: number,
    moistureToRemove: number
  ) => Array<{ method: string; cost: number; time: number; quality: number }>;
  
  scheduleDrying: (operationId: string, startDate: Date, priority: 'high' | 'normal' | 'low') => void;
  
  // Actions - Truck Scheduling
  createTruckSchedule: (
    loads: Array<{
      origin: string;
      destination: string;
      cropType: CropType;
      bushels: number;
      desiredDate: Date;
    }>
  ) => TruckSchedule[];
  
  optimizeRoutes: (
    schedules: string[] // schedule IDs
  ) => { optimizedOrder: string[]; totalDistance: number; fuelSavings: number };
  
  trackDelivery: (scheduleId: string) => {
    status: TruckSchedule['status'];
    currentLocation?: string;
    eta: Date;
  };
  
  // Actions - Storage Management
  receiveIntoStorage: (
    facilityId: string,
    cropType: CropType,
    bushels: number,
    moisture: number,
    quality: string,
    source: string
  ) => string; // stored grain ID
  
  shipFromStorage: (
    facilityId: string,
    storedGrainId: string,
    bushels: number,
    destination: string
  ) => OutboundDelivery;
  
  monitorStorageQuality: (facilityId: string) => {
    temperature: number;
    moisture: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    actionRequired?: string;
  };
  
  calculateStorageCost: (
    facilityId: string,
    bushels: number,
    months: number
  ) => { totalCost: number; perBushelPerMonth: number };
  
  // Actions - Forward Contracts
  createForwardContract: (
    cropType: CropType,
    bushels: number,
    contractType: ForwardContract['contractType'],
    contractPrice: number,
    deliveryWindow: { start: Date; end: Date },
    deliveryLocation: string
  ) => string;
  
  priceHTAContract: (
    contractId: string,
    futuresPrice: number,
    basis: number
  ) => void;
  
  rollContract: (
    contractId: string,
    newDeliveryMonth: string,
    rollFee: number
  ) => void;
  
  deliverOnContract: (
    contractId: string,
    bushels: number,
    deliveryDate: Date,
    quality: string
  ) => void;
  
  // Actions - Basis & Marketing
  recordBasis: (
    cropType: CropType,
    location: string,
    futuresMonth: string,
    cashPrice: number,
    futuresPrice: number
  ) => BasisRecord;
  
  analyzeBasisTrend: (
    cropType: CropType,
    location: string,
    months: number
  ) => {
    trend: 'strengthening' | 'weakening' | 'stable';
    currentVsAverage: number;
    seasonalFactor: number;
  };
  
  calculateStorageArbitrage: (
    cropType: CropType,
    currentSpot: number,
    deferredPrice: number,
    storageMonths: number,
    interestRate: number
  ) => StorageArbitrage;
  
  getMarketingRecommendation: (
    cropType: CropType,
    currentStorage: number,
    marketConditions: object
  ) => {
    action: 'sell' | 'store' | 'hedge' | 'contract';
    targetPrice: number;
    timing: string;
    reasoning: string;
  };
  
  // Actions - Freight
  requestFreightQuote: (
    origin: string,
    destination: string,
    cropType: CropType,
    bushels: number,
    dateNeeded: Date
  ) => FreightQuote[];
  
  compareFreightOptions: (
    quotes: string[] // quote IDs
  ) => { bestValue: string; fastest: string; cheapest: string };
  
  // Getters
  getStorageInventory: (facilityId?: string) => StoredGrain[];
  getOpenContracts: () => ForwardContract[];
  getPendingDeliveries: () => TruckSchedule[];
  getTotalStorageValue: () => number;
  getUnrealizedGainsLosses: () => number;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const usePostHarvestStore = create<PostHarvestState>()(
  persist(
    (set, get) => ({
      // Initial state
      grainCartOperations: [],
      dryingOperations: [],
      truckSchedules: [],
      storageManagement: {},
      forwardContracts: [],
      basisRecords: [],
      freightQuotes: [],

      // ============================================================================
      // GRAIN CART LOGISTICS
      // ============================================================================
      
      planGrainCartOperation: (fieldId, cropType, acres, expectedYield, harvestMoisture, equipment, distances) => {
        const totalBushels = acres * expectedYield;
        
        // Calculate field to truck cycle
        const loadsToTruck = Math.ceil(totalBushels / equipment.grainCartCapacity);
        const cartCycleTime = 10; // minutes average (simplified)
        const cartCapacityPerHour = (60 / cartCycleTime) * equipment.grainCartCapacity;
        
        // Calculate truck to elevator cycle
        const truckLoads = Math.ceil(totalBushels / equipment.truckCapacity);
        const travelTime = (distances.toElevator / 40) * 60; // 40 mph average
        const roundTripTime = travelTime * 2 + 30; // unload time
        const truckCapacityPerHour = (60 / roundTripTime) * equipment.truckCapacity * equipment.numTrucks;
        
        // Identify bottleneck
        const combineCapacityPerHour = equipment.combineCapacity;
        const rates = [
          { type: 'combine', rate: combineCapacityPerHour },
          { type: 'cart', rate: cartCapacityPerHour },
          { type: 'truck', rate: truckCapacityPerHour }
        ];
        const bottleneck = rates.reduce((min, r) => r.rate < min.rate ? r : min);
        
        // Max harvest rate constrained by bottleneck
        const maxHarvestRate = bottleneck.rate / expectedYield;
        
        // Costs
        const fuelCost = (distances.toElevator * 2 * truckLoads * 0.15 * 3.50) / acres;
        const laborCost = (truckLoads * roundTripTime / 60 * 25) / acres;
        const equipmentCost = 15; // per acre
        
        const operation: GrainCartLogistics = {
          id: `cart-${Date.now()}`,
          fieldId,
          cropType,
          harvestDate: new Date(),
          fieldToTruck: {
            grainCartId: 'cart-1',
            cartCapacity: equipment.grainCartCapacity,
            loadsToTruck,
            averageDistance: distances.fieldToTruck,
            waitTime: 5,
            cycleTime: cartCycleTime
          },
          truckToElevator: {
            truckId: 'truck-1',
            truckCapacity: equipment.truckCapacity,
            distance: distances.toElevator,
            roadConditions: 'good',
            travelTime,
            unloadTime: 15,
            roundTripTime
          },
          combineCapacity: equipment.combineCapacity,
          trucksNeeded: equipment.numTrucks,
          maxHarvestRate,
          bottleneck: bottleneck.type as GrainCartLogistics['bottleneck'],
          fuelCost,
          laborCost,
          equipmentCost,
          totalLogisticsCost: fuelCost + laborCost + equipmentCost
        };
        
        set(state => ({
          grainCartOperations: [...state.grainCartOperations, operation]
        }));
        
        return operation;
      },
      
      calculateLogisticsBottleneck: (operation) => {
        const rates = {
          combine: operation.combineCapacity,
          cart: (60 / operation.fieldToTruck.cycleTime) * operation.fieldToTruck.cartCapacity,
          truck: (60 / operation.truckToElevator.roundTripTime) * 
                 operation.truckToElevator.truckCapacity * operation.trucksNeeded
        };
        
        const bottleneck = Object.entries(rates).reduce((min, [type, rate]) => 
          rate < min.rate ? { type, rate } : min
        , { type: 'combine', rate: rates.combine });
        
        return {
          bottleneck: bottleneck.type as GrainCartLogistics['bottleneck'],
          maxRate: bottleneck.rate,
          recommendation: bottleneck.type === 'truck' 
            ? 'Add more trucks or use larger trucks'
            : bottleneck.type === 'cart'
            ? 'Consider larger grain cart or second cart'
            : 'Equipment capacity is limiting factor'
        };
      },
      
      optimizeTruckFleet: (fieldId, acres, yieldPerAcre, distances) => {
        const totalBushels = acres * yieldPerAcre;
        const truckCapacities = [650, 900, 1000, 1100]; // bushel capacities
        
        let bestOption = { trucks: 0, totalCost: Infinity };
        
        for (const capacity of truckCapacities) {
          for (let trucks = 1; trucks <= 5; trucks++) {
            const loads = Math.ceil(totalBushels / capacity);
            const travelTime = (distances.elevator / 40) * 2; // hours round trip
            const totalTruckHours = loads * travelTime;
            const fuelCost = totalTruckHours * 5 * 3.50; // 5 gal/hr
            const laborCost = totalTruckHours * 25;
            const ownershipCost = trucks * 50 * (totalTruckHours / trucks / 10); // amortized
            
            const totalCost = fuelCost + laborCost + ownershipCost;
            
            if (totalCost < bestOption.totalCost) {
              bestOption = { trucks, totalCost };
            }
          }
        }
        
        return { trucksNeeded: bestOption.trucks, totalCost: bestOption.totalCost };
      },

      // ============================================================================
      // DRYING
      // ============================================================================
      
      calculateDryingCost: (cropType, wetBushels, harvestMoisture, targetMoisture, method, fuelType) => {
        const shrinkData = MOISTURE_SHRINK[cropType];
        const moistureRemoved = harvestMoisture - targetMoisture;
        
        // Calculate shrink
        const shrinkPercent = moistureRemoved * shrinkData.factor;
        const dryBushels = wetBushels * (1 - shrinkPercent / 100);
        
        // Calculate drying cost
        const costKey = `${method}_${fuelType}`;
        const costRates = DRYING_COSTS[costKey] || DRYING_COSTS.high_temp_lp;
        
        const costPerPoint = costRates.total;
        const fuelCost = moistureRemoved * costRates.fuel * wetBushels;
        const electricityCost = 0.005 * wetBushels; // $0.005 per bushel
        const laborCost = 0.002 * wetBushels;
        const handlingCost = 0.01 * wetBushels;
        const totalDryingCost = (fuelCost + electricityCost + laborCost + handlingCost);
        
        const operation: DryingOperation = {
          id: `dry-${Date.now()}`,
          facilityId: 'dryer-1',
          cropType,
          harvestMoisture,
          targetMoisture,
          moistureRemoved,
          wetBushels,
          dryBushels,
          shrinkFactor: shrinkPercent,
          dryingMethod: method,
          fuelType,
          fuelCostPerUnit: fuelType === 'lp' ? 1.50 : 0.80,
          fuelUsed: fuelCost / (fuelType === 'lp' ? 1.50 : 0.80),
          electricityUsed: wetBushels * 0.5, // kWh per bushel
          fuelCost,
          electricityCost,
          laborCost,
          handlingCost,
          totalDryingCost,
          costPerWetBushel: totalDryingCost / wetBushels,
          costPerDryBushel: totalDryingCost / dryBushels,
          costPerPoint: costPerPoint
        };
        
        set(state => ({
          dryingOperations: [...state.dryingOperations, operation]
        }));
        
        return operation;
      },
      
      compareDryingMethods: (cropType, wetBushels, moistureToRemove) => {
        const methods = [
          { method: 'High Temp LP', type: 'high_temp' as const, fuel: 'lp' as const, time: 6, quality: 3 },
          { method: 'High Temp Natural Gas', type: 'high_temp' as const, fuel: 'natural_gas' as const, time: 6, quality: 3 },
          { method: 'Natural Air', type: 'natural_air' as const, fuel: 'electric' as const, time: 336, quality: 5 },
          { method: 'Low Temp', type: 'low_temp' as const, fuel: 'lp' as const, time: 48, quality: 4 }
        ];
        
        return methods.map(m => {
          const operation = get().calculateDryingCost(
            cropType, wetBushels, 20, 20 - moistureToRemove, m.type, m.fuel
          );
          
          return {
            method: m.method,
            cost: operation.costPerWetBushel * wetBushels,
            time: m.time,
            quality: m.quality
          };
        });
      },
      
      scheduleDrying: (operationId, startDate, priority) => {
        // In real implementation, this would add to a drying queue
        set(state => ({
          dryingOperations: state.dryingOperations.map(op =>
            op.id === operationId ? { ...op /* update scheduling */ } : op
          )
        }));
      },

      // ============================================================================
      // TRUCK SCHEDULING
      // ============================================================================
      
      createTruckSchedule: (loads) => {
        const schedules: TruckSchedule[] = [];
        
        for (const load of loads) {
          const id = `truck-${Date.now()}-${schedules.length}`;
          const distance = 25; // Would calculate actual distance
          const freightRate = 0.25; // $/bushel
          
          const schedule: TruckSchedule = {
            id,
            date: load.desiredDate,
            truckId: 'truck-1',
            driver: 'Driver 1',
            origin: 'field',
            originId: load.origin,
            destination: load.destination,
            distance,
            cropType: load.cropType,
            bushels: load.bushels,
            moisture: 15,
            scheduledDepart: load.desiredDate,
            estimatedArrival: new Date(load.desiredDate.getTime() + 2 * 60 * 60 * 1000),
            freightRate,
            fuelCost: distance * 0.15 * 3.50,
            driverWages: 50,
            tolls: 0,
            totalCost: (freightRate * load.bushels) + (distance * 0.15 * 3.50) + 50,
            status: 'scheduled'
          };
          
          schedules.push(schedule);
        }
        
        set(state => ({
          truckSchedules: [...state.truckSchedules, ...schedules]
        }));
        
        return schedules;
      },
      
      optimizeRoutes: (scheduleIds) => {
        // Simplified route optimization
        // In reality, this would use TSP or VRP algorithms
        return {
          optimizedOrder: scheduleIds,
          totalDistance: scheduleIds.length * 25,
          fuelSavings: 0
        };
      },
      
      trackDelivery: (scheduleId) => {
        const schedule = get().truckSchedules.find(s => s.id === scheduleId);
        if (!schedule) {
          return { status: 'scheduled', eta: new Date() };
        }
        
        return {
          status: schedule.status,
          currentLocation: schedule.status === 'in_transit' ? 'En route' : undefined,
          eta: schedule.estimatedArrival
        };
      },

      // ============================================================================
      // STORAGE MANAGEMENT
      // ============================================================================
      
      receiveIntoStorage: (facilityId, cropType, bushels, moisture, quality, source) => {
        const storedGrainId = `stored-${Date.now()}`;
        
        const storedGrain: StoredGrain = {
          id: storedGrainId,
          cropType,
          variety: '',
          quantity: bushels,
          moisture,
          quality: quality === '1' ? 'premium' : quality === '2' ? 'standard' : 'discount',
          harvestDate: new Date(),
          storageDate: new Date(),
          spoilageRisk: moisture > 15 ? 30 : 10,
          storageCostToDate: 0,
          storageLocation: 'Bin-1',
          dateStored: new Date(),
          qualityGrade: quality as StoredGrain['qualityGrade'],
          marketValue: 4.50 * bushels, // example price
          unrealizedGainLoss: 0
        };
        
        set(state => {
          const current = state.storageManagement[facilityId] || {
            facilityId,
            contents: [],
            totalBushels: 0,
            availableSpace: 10000,
            aerationSchedule: [],
            moistureMonitoring: [],
            temperatureMonitoring: [],
            qualityReports: [],
            storageCost: {
              fixedCosts: { depreciation: 0, interest: 0, insurance: 0, taxes: 0, maintenance: 0 },
              variableCosts: { electricity: 0.02, handling: 0.10, shrink: 0.005 },
              totalPerBushelPerMonth: STORAGE_COST_RATES.on_farm_bin
            },
            inbounds: [],
            outbounds: []
          };
          
          return {
            storageManagement: {
              ...state.storageManagement,
              [facilityId]: {
                ...current,
                contents: [...current.contents, storedGrain],
                totalBushels: current.totalBushels + bushels,
                availableSpace: current.availableSpace - bushels,
                inbounds: [...current.inbounds, {
                  date: new Date(),
                  source,
                  bushels,
                  moisture,
                  quality
                }]
              }
            }
          };
        });
        
        return storedGrainId;
      },
      
      shipFromStorage: (facilityId, storedGrainId, bushels, destination) => {
        const state = get();
        const facility = state.storageManagement[facilityId];
        const grain = facility?.contents.find(c => c.id === storedGrainId);
        
        if (!grain) throw new Error('Grain not found');
        
        const price = 4.75; // current price
        const revenue = bushels * price;
        
        const outbound: OutboundDelivery = {
          date: new Date(),
          destination,
          bushels,
          moisture: grain.moisture,
          price,
          revenue
        };
        
        set(s => ({
          storageManagement: {
            ...s.storageManagement,
            [facilityId]: {
              ...facility,
              contents: facility.contents.map(c =>
                c.id === storedGrainId 
                  ? { ...c, quantity: c.quantity - bushels }
                  : c
              ).filter(c => c.quantity > 0),
              totalBushels: facility.totalBushels - bushels,
              availableSpace: facility.availableSpace + bushels,
              outbounds: [...facility.outbounds, outbound]
            }
          }
        }));
        
        return outbound;
      },
      
      monitorStorageQuality: (facilityId) => {
        const facility = get().storageManagement[facilityId];
        if (!facility) {
          return { temperature: 60, moisture: 14, condition: 'good' };
        }
        
        // Simplified quality check
        const avgMoisture = facility.contents.reduce((sum, c) => sum + c.moisture, 0) / 
                           (facility.contents.length || 1);
        const condition = avgMoisture > 16 ? 'poor' : 
                         avgMoisture > 15 ? 'fair' : 'good';
        
        return {
          temperature: 55,
          moisture: avgMoisture,
          condition,
          actionRequired: condition === 'poor' ? 'Aerate immediately' : undefined
        };
      },
      
      calculateStorageCost: (facilityId, bushels, months) => {
        const facility = get().storageManagement[facilityId];
        const rate = facility?.storageCost.totalPerBushelPerMonth || 
                     STORAGE_COST_RATES.on_farm_bin;
        
        // Add opportunity cost (interest)
        const grainValue = bushels * 4.50; // $4.50/bu average
        const interestCost = grainValue * 0.05 * (months / 12);
        
        const storageCost = bushels * rate * months;
        const shrinkCost = bushels * 0.005 * months * 4.50; // 0.5% shrink per month
        
        const totalCost = storageCost + interestCost + shrinkCost;
        
        return {
          totalCost,
          perBushelPerMonth: totalCost / bushels / months
        };
      },

      // ============================================================================
      // FORWARD CONTRACTS
      // ============================================================================
      
      createForwardContract: (cropType, bushels, contractType, contractPrice, deliveryWindow, deliveryLocation) => {
        const id = `contract-${Date.now()}`;
        
        const contract: ForwardContract = {
          id,
          cropType,
          contractDate: new Date(),
          deliveryPeriod: deliveryWindow,
          contractType,
          contractedBushels: bushels,
          contractPrice,
          futuresPrice: contractType === 'hedge_to_arrive' ? contractPrice : undefined,
          basis: contractType === 'basis' ? contractPrice : undefined,
          deliveryLocation,
          freightResponsibility: 'seller',
          bushelsDelivered: 0,
          bushelsRemaining: bushels,
          status: 'open',
          marketPriceAtContract: 4.50,
          currentMarketPrice: 4.50,
          unrealizedGainLoss: 0,
          vsSpotMarket: 0
        };
        
        set(state => ({
          forwardContracts: [...state.forwardContracts, contract]
        }));
        
        return id;
      },
      
      priceHTAContract: (contractId, futuresPrice, basis) => {
        set(state => ({
          forwardContracts: state.forwardContracts.map(c => {
            if (c.id !== contractId) return c;
            
            const finalPrice = futuresPrice + basis;
            
            return {
              ...c,
              futuresPrice,
              basis,
              contractPrice: finalPrice,
              status: 'priced',
              unrealizedGainLoss: (finalPrice - c.marketPriceAtContract) * c.contractedBushels
            };
          })
        }));
      },
      
      rollContract: (contractId, newDeliveryMonth, rollFee) => {
        set(state => ({
          forwardContracts: state.forwardContracts.map(c => {
            if (c.id !== contractId) return c;
            
            return {
              ...c,
              deliveryPeriod: {
                ...c.deliveryPeriod,
                start: new Date(newDeliveryMonth), // simplified
                end: new Date(newDeliveryMonth)
              },
              contractPrice: c.contractPrice - rollFee
            };
          })
        }));
      },
      
      deliverOnContract: (contractId, bushels, deliveryDate, quality) => {
        set(state => ({
          forwardContracts: state.forwardContracts.map(c => {
            if (c.id !== contractId) return c;
            
            const newDelivered = c.bushelsDelivered + bushels;
            const newRemaining = c.contractedBushels - newDelivered;
            
            return {
              ...c,
              bushelsDelivered: newDelivered,
              bushelsRemaining: newRemaining,
              status: newRemaining <= 0 ? 'delivered' : 'partial'
            };
          })
        }));
      },

      // ============================================================================
      // BASIS & MARKETING
      // ============================================================================
      
      recordBasis: (cropType, location, futuresMonth, cashPrice, futuresPrice) => {
        const basis = cashPrice - futuresPrice;
        const historicalAverage = -0.25; // Example
        
        const record: BasisRecord = {
          id: `basis-${Date.now()}`,
          cropType,
          location,
          date: new Date(),
          futuresMonth,
          futuresPrice,
          cashPrice,
          basis,
          basisStrength: basis > -0.15 ? 'strong' : basis < -0.35 ? 'weak' : 'normal',
          historicalAverage,
          vsAverage: basis - historicalAverage
        };
        
        set(state => ({
          basisRecords: [...state.basisRecords, record]
        }));
        
        return record;
      },
      
      analyzeBasisTrend: (cropType, location, months) => {
        const records = get().basisRecords.filter(
          r => r.cropType === cropType && r.location === location
        );
        
        if (records.length < 2) {
          return { trend: 'stable', currentVsAverage: 0, seasonalFactor: 1 };
        }
        
        const recent = records.slice(-5);
        const trend = recent[recent.length - 1].basis > recent[0].basis ? 'strengthening' :
                     recent[recent.length - 1].basis < recent[0].basis ? 'weakening' : 'stable';
        
        return {
          trend,
          currentVsAverage: recent[recent.length - 1].vsAverage,
          seasonalFactor: 1 // Would calculate from historical patterns
        };
      },
      
      calculateStorageArbitrage: (cropType, currentSpot, deferredPrice, storageMonths, interestRate) => {
        // Calculate costs to store
        const storageCostPerMonth = STORAGE_COST_RATES.on_farm_bin;
        const totalStorageCost = storageCostPerMonth * storageMonths;
        
        const grainValue = currentSpot;
        const interestCost = grainValue * interestRate * (storageMonths / 12);
        
        const shrinkLoss = 0.005 * storageMonths; // 0.5% per month
        const shrinkCost = shrinkLoss * deferredPrice;
        
        const totalCost = totalStorageCost + interestCost + shrinkCost;
        
        // Calculate carry
        const carry = deferredPrice - currentSpot;
        const profitPotential = carry - totalCost;
        
        const analysis: StorageArbitrage = {
          cropType,
          currentSpotPrice: currentSpot,
          forwardContractPrice: deferredPrice,
          harvestBasis: -0.30,
          deferredBasis: -0.20,
          storageCost: totalStorageCost,
          interestCost,
          shrinkLoss,
          carryInMarket: carry,
          costToStore: totalCost,
          profitPotential,
          recommendation: profitPotential > 0.10 ? 'store' : 
                         profitPotential < -0.05 ? 'sell' : 'hedge',
          optimalExitMonth: 'March' // Simplified
        };
        
        return analysis;
      },
      
      getMarketingRecommendation: (cropType, currentStorage, marketConditions) => {
        // Simplified recommendation logic
        const hasStorage = currentStorage > 0;
        
        return {
          action: hasStorage ? 'hedge' : 'contract',
          targetPrice: 5.00,
          timing: 'Before year-end',
          reasoning: 'Protect against downside while maintaining upside potential'
        };
      },

      // ============================================================================
      // FREIGHT
      // ============================================================================
      
      requestFreightQuote: (origin, destination, cropType, bushels, dateNeeded) => {
        // Simulated freight quotes
        const quotes: FreightQuote[] = [
          {
            id: `quote-${Date.now()}-1`,
            carrier: 'Midwest Transport',
            origin,
            destination,
            cropType,
            ratePerBushel: 0.22,
            ratePerMile: 0.008,
            minimumCharge: 250,
            fuelSurcharge: 0.025,
            equipmentType: 'hopper',
            transitTime: 4,
            availability: dateNeeded,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: `quote-${Date.now()}-2`,
            carrier: 'Farm Belt Logistics',
            origin,
            destination,
            cropType,
            ratePerBushel: 0.25,
            ratePerMile: 0.009,
            minimumCharge: 200,
            fuelSurcharge: 0.020,
            equipmentType: 'walking_floor',
            transitTime: 3,
            availability: new Date(dateNeeded.getTime() + 24 * 60 * 60 * 1000),
            validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          }
        ];
        
        set(state => ({
          freightQuotes: [...state.freightQuotes, ...quotes]
        }));
        
        return quotes;
      },
      
      compareFreightOptions: (quoteIds) => {
        const quotes = get().freightQuotes.filter(q => quoteIds.includes(q.id)
        );
        
        if (quotes.length === 0) {
          return { bestValue: '', fastest: '', cheapest: '' };
        }
        
        const totalCosts = quotes.map(q => ({
          id: q.id,
          total: q.ratePerBushel + q.fuelSurcharge
        }));
        
        const cheapest = totalCosts.reduce((min, c) => c.total < min.total ? c : min
        );
        
        const fastest = quotes.reduce((fast, q) => q.transitTime < fast.transitTime ? q : fast
        );
        
        // Best value considers cost and time
        const bestValue = quotes.reduce((best, q) => {
          const score = (q.ratePerBushel + q.fuelSurcharge) * 0.6 + 
                       (q.transitTime / 10) * 0.4;
          return score < (best.score || Infinity) ? { id: q.id, score } : best;
        }, { id: '', score: Infinity });
        
        return {
          bestValue: bestValue.id,
          fastest: fastest.id,
          cheapest: cheapest.id
        };
      },

      // ============================================================================
      // GETTERS
      // ============================================================================
      
      getStorageInventory: (facilityId) => {
        if (facilityId) {
          return get().storageManagement[facilityId]?.contents || [];
        }
        
        return Object.values(get().storageManagement).flatMap(s => s.contents);
      },
      
      getOpenContracts: () => {
        return get().forwardContracts.filter(
          c => c.status === 'open' || c.status === 'partial'
        );
      },
      
      getPendingDeliveries: () => {
        return get().truckSchedules.filter(
          s => s.status === 'scheduled' || s.status === 'loading' || s.status === 'in_transit'
        );
      },
      
      getTotalStorageValue: () => {
        return Object.values(get().storageManagement).reduce(
          (sum, facility) => sum + facility.contents.reduce(
            (s, grain) => s + grain.marketValue, 0
          ), 0
        );
      },
      
      getUnrealizedGainsLosses: () => {
        return get().forwardContracts.reduce(
          (sum, c) => sum + c.unrealizedGainLoss, 0
        );
      }
    }),
    {
      name: 'agri-os-post-harvest-store',
      partialize: (state) => ({
        grainCartOperations: state.grainCartOperations,
        dryingOperations: state.dryingOperations,
        truckSchedules: state.truckSchedules,
        storageManagement: state.storageManagement,
        forwardContracts: state.forwardContracts,
        basisRecords: state.basisRecords,
        freightQuotes: state.freightQuotes
      })
    }
  )
);

export default usePostHarvestStore;
