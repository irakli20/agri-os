// @ts-nocheck
/**
 * Equipment & Labor Store
 * Manages field efficiency, work rates, transport times,
 * custom hire economics, and H2A labor program
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Equipment, Field, Coordinates } from '../../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EquipmentPerformance {
  equipmentId: string;
  operationType: OperationType;
  
  // Efficiency Metrics
  fieldEfficiency: number; // percentage (actual vs theoretical)
  theoreticalCapacity: number; // acres/hour at 100% efficiency
  effectiveCapacity: number; // acres/hour actual
  
  // Time Analysis
  operatingTime: number; // hours
  turningTime: number; // hours (headland turns)
  overlapTime: number; // hours (spray/fertilizer overlap)
  loadingTime: number; // hours (refill seed/chemical)
  maintenanceTime: number; // hours (breakdowns, adjustments)
  transportTime: number; // hours (between fields)
  
  // Coverage Metrics
  overlapPercentage: number;
  skipPercentage: number;
  coverageAccuracy: number;
  acresCompleted: number;
}

export type OperationType = 
  | 'tillage' | 'planting' | 'spraying' | 'fertilizing' 
  | 'harvesting' | 'cultivating' | 'mowing' | 'baling'
  | 'grain_cart' | 'transport';

export interface WorkRateCalculation {
  operationType: OperationType;
  equipment: string;
  
  // Speed Parameters
  travelSpeed: number; // mph
  fieldSpeed: number; // mph (adjusted for conditions)
  
  // Width Parameters
  implementWidth: number; // feet
  effectiveWidth: number; // feet (accounting for overlap)
  
  // Time Parameters
  fieldEfficiency: number; // decimal (0-1)
  areaCapacity: number; // acres/hour
  timePerAcre: number; // minutes
  
  // Daily Capacity
  availableHours: number; // per day
  dailyCapacity: number; // acres/day
  
  // Field-Specific
  fieldSize: number; // acres
  estimatedTime: number; // hours for this field
  turnsPerAcre: number;
  turnTime: number; // minutes per turn
}

export interface TransportCalculation {
  fromField: string;
  toField: string;
  fromLocation: Coordinates;
  toLocation: Coordinates;
  distance: number; // miles
  roadSpeed: number; // mph
  fieldSpeed: number; // mph (internal roads)
  transportTime: number; // hours
  fuelConsumption: number; // gallons
  cost: number; // fuel cost
}

export interface CustomHireComparison {
  operationType: OperationType;
  acres: number;
  
  // Own Equipment Costs
  ownEquipment: {
    equipmentId: string;
    depreciation: number; // $/hour
    interest: number;
    repairs: number;
    fuel: number;
    labor: number;
    totalCost: number; // for this job
    costPerAcre: number;
  };
  
  // Custom Hire Costs
  customHire: {
    operator: string;
    ratePerAcre: number;
    minimumCharge: number;
    mobilizationFee: number;
    totalCost: number;
    availability: 'available' | 'limited' | 'unavailable';
    timing: string; // when they can do it
    quality: number; // rating 1-5
  };
  
  // Comparison
  savingsWithOwn: number;
  savingsWithCustom: number;
  recommendation: 'own' | 'custom' | 'either';
  reasoning: string;
}

export interface H2AWorker {
  id: string;
  name: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber: string;
  visaNumber: string;
  visaIssueDate: Date;
  visaExpirationDate: Date;
  
  // Employment Details
  jobClassification: 'agricultural' | 'equipment_operator' | 'livestock' | 'supervisor';
  startDate: Date;
  endDate: Date;
  contractType: 'seasonal' | 'peak_load' | 'intermittent';
  
  // Wage Information
  hourlyWage: number;
  hoursPerWeek: number;
  overtimeRate: number; // 1.5x after 40 hours
  
  // Housing & Transport
  housingProvided: boolean;
  housingCost: number; // per week
  transportProvided: boolean;
  transportCost: number; // inbound
  mealsProvided: boolean;
  mealCost: number; // per day
  
  // Compliance
  workersCompInsurance: boolean;
  payrollTaxesPaid: boolean;
  adverseEffectWageRate: number; // AEWR - minimum required wage
  
  // Performance
  performance: {
    attendance: number; // percentage
    productivity: number; // relative to standard
    quality: number; // 1-5 rating
    safetyRecord: number; // incidents
  };
  
  // Documentation
  i9Completed: boolean;
  w4Completed: boolean;
  trainingCompleted: string[];
}

export interface LaborEfficiency {
  workerId: string;
  date: Date;
  operationType: OperationType;
  
  // Time Tracking
  hoursWorked: number;
  acresCompleted: number;
  unitsCompleted: number; // bales, loads, etc.
  
  // Efficiency Metrics
  acresPerHour: number;
  efficiencyRating: number; // compared to standard
  
  // Quality Metrics
  reworkRequired: number; // hours of corrections needed
  qualityScore: number; // 1-5
  errors: string[];
  
  // Supervision
  supervisedBy?: string;
  supervisionHours: number;
  supervisionEffectiveness: number; // productivity improvement
  
  // Weather Impact
  conditions: 'ideal' | 'good' | 'fair' | 'poor';
  weatherDelay: number; // hours
}

export interface SupervisionBonus {
  supervisorId: string;
  month: string;
  
  // Team Performance
  teamSize: number;
  workersSupervised: string[];
  
  // Metrics
  teamEfficiency: number; // average
  teamSafety: number; // incident-free days
  teamQuality: number; // average quality score
  completionRate: number; // jobs completed on time
  
  // Bonus Calculation
  baseBonus: number;
  efficiencyMultiplier: number;
  safetyBonus: number;
  qualityBonus: number;
  totalBonus: number;
}

export interface FieldLogistics {
  fieldId: string;
  operationType: OperationType;
  
  // Equipment Assignments
  primaryEquipment: string;
  supportEquipment: string[];
  operators: string[];
  
  // Schedule
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  
  // Progress
  acresPlanned: number;
  acresCompleted: number;
  percentComplete: number;
  
  // Daily Log
  dailyProgress: DailyProgressEntry[];
}

export interface DailyProgressEntry {
  date: Date;
  equipment: string[];
  operators: string[];
  hoursWorked: number;
  weather: string;
  acresCompleted: number;
  issues: string[];
  notes: string;
}

export interface EquipmentEconomics {
  equipmentId: string;
  purchasePrice: number;
  salvageValue: number;
  usefulLife: number; // years
  hoursPerYear: number;
  
  // Ownership Costs
  depreciation: number; // annual
  interest: number; // annual
  insurance: number; // annual
  housing: number; // annual
  totalOwnershipCost: number; // annual
  ownershipCostPerHour: number;
  ownershipCostPerAcre: number;
  
  // Operating Costs
  fuelCost: number; // per hour
  repairCost: number; // per hour
  laborCost: number; // per hour
  totalOperatingCost: number; // per hour
  
  // Total
  totalCostPerHour: number;
  totalCostPerAcre: number;
  breakEvenUtilization: number; // hours/year
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Field efficiency factors by operation
const EFFICIENCY_FACTORS: Record<OperationType, number> = {
  tillage: 0.85,
  planting: 0.75,
  spraying: 0.70,
  fertilizing: 0.72,
  harvesting: 0.80,
  cultivating: 0.82,
  mowing: 0.88,
  baling: 0.65,
  grain_cart: 0.90,
  transport: 0.95
};

// Average speeds by operation (mph)
const OPERATION_SPEEDS: Record<OperationType, { min: number; typical: number; max: number }> = {
  tillage: { min: 3, typical: 5, max: 7 },
  planting: { min: 4, typical: 6, max: 8 },
  spraying: { min: 8, typical: 12, max: 15 },
  fertilizing: { min: 5, typical: 8, max: 12 },
  harvesting: { min: 2, typical: 3.5, max: 5 },
  cultivating: { min: 4, typical: 6, max: 8 },
  mowing: { min: 5, typical: 8, max: 12 },
  baling: { min: 3, typical: 5, max: 7 },
  grain_cart: { min: 8, typical: 12, max: 20 },
  transport: { min: 15, typical: 25, max: 35 }
};

// Custom hire rates per acre (2024 estimates)
const CUSTOM_HIRE_RATES: Record<OperationType, { min: number; max: number; typical: number }> = {
  tillage: { min: 18, max: 35, typical: 25 },
  planting: { min: 20, max: 40, typical: 28 },
  spraying: { min: 6, max: 15, typical: 10 },
  fertilizing: { min: 8, max: 18, typical: 12 },
  harvesting: { min: 35, max: 60, typical: 45 },
  cultivating: { min: 12, max: 25, typical: 18 },
  mowing: { min: 10, max: 20, typical: 15 },
  baling: { min: 15, max: 30, typical: 22 },
  grain_cart: { min: 0, max: 0, typical: 0 }, // typically bundled with harvest
  transport: { min: 0.15, max: 0.35, typical: 0.25 } // per bushel-mile
};

// 2024 Adverse Effect Wage Rates by state (sample)
const AEWR_RATES: Record<string, number> = {
  'IA': 17.15,
  'IL': 17.43,
  'IN': 17.15,
  'NE': 17.15,
  'MN': 17.96,
  'OH': 17.15,
  'WI': 17.15,
  'KS': 16.38,
  'MO': 16.38,
  'TX': 14.62,
  'CA': 18.65,
  'WA': 18.65
};

// ============================================================================
// STORE STATE & ACTIONS
// ============================================================================

interface EquipmentLaborState {
  // Data
  performanceRecords: EquipmentPerformance[];
  workRateHistory: WorkRateCalculation[];
  transportRecords: TransportCalculation[];
  customComparisons: CustomHireComparison[];
  h2aWorkers: H2AWorker[];
  laborEfficiency: LaborEfficiency[];
  supervisionBonuses: SupervisionBonus[];
  fieldLogistics: FieldLogistics[];
  equipmentEconomics: EquipmentEconomics[];
  
  // Actions - Field Efficiency
  calculateFieldEfficiency: (
    equipmentId: string,
    operationType: OperationType,
    hoursData: {
      operating: number;
      turning: number;
      overlap: number;
      loading: number;
      maintenance: number;
    },
    acresCompleted: number
  ) => EquipmentPerformance;
  
  recordPerformance: (performance: Omit<EquipmentPerformance, 'fieldEfficiency' | 'effectiveCapacity'>) => void;
  getEfficiencyTrend: (equipmentId: string, days: number) => EquipmentPerformance[];
  identifyEfficiencyOpportunities: (equipmentId: string) => string[];
  
  // Actions - Work Rates
  calculateWorkRate: (
    operationType: OperationType,
    equipmentWidth: number,
    fieldSize: number,
    conditions?: 'ideal' | 'good' | 'fair' | 'poor'
  ) => WorkRateCalculation;
  
  estimateJobTime: (
    fieldId: string,
    operationType: OperationType,
    equipmentIds: string[]
  ) => { totalHours: number; completionDate: Date };
  
  // Actions - Transport
  calculateTransport: (
    fromField: string,
    toField: string,
    fromLocation: Coordinates,
    toLocation: Coordinates,
    equipmentType: string
  ) => TransportCalculation;
  
  optimizeFieldSequence: (
    operations: Array<{ fieldId: string; operation: OperationType }>
  ) => string[]; // optimized field order
  
  // Actions - Custom Hire Economics
  compareCustomHire: (
    operationType: OperationType,
    acres: number,
    equipmentId?: string
  ) => CustomHireComparison;
  
  findCustomOperators: (
    operationType: OperationType,
    location: Coordinates,
    radius: number
  ) => Array<{ name: string; rate: number; availability: string; rating: number }>;
  
  // Actions - H2A Program
  addH2AWorker: (worker: Omit<H2AWorker, 'id'>) => string;
  updateH2AWorker: (id: string, updates: Partial<H2AWorker>) => void;
  calculateH2ACost: (workerId: string) => {
    totalCost: number;
    costPerHour: number;
    vsDomesticWorker: number;
  };
  
  checkH2ACompliance: (workerId: string) => {
    compliant: boolean;
    issues: string[];
  };
  
  getExpiringVisas: (days: number) => H2AWorker[];
  calculateAEWR: (state: string) => number;
  
  // Actions - Labor Efficiency
  recordLaborEfficiency: (record: Omit<LaborEfficiency, 'acresPerHour' | 'efficiencyRating'>) => void;
  getWorkerPerformance: (workerId: string, days: number) => LaborEfficiency[];
  compareWorkerEfficiency: (workerIds: string[], operationType: OperationType) => Array<{
    workerId: string;
    avgAcresPerHour: number;
    avgQuality: number;
    ranking: number;
  }>;
  
  // Actions - Supervision
  calculateSupervisionBonus: (supervisorId: string, month: string) => SupervisionBonus;
  getSupervisionEffectiveness: (supervisorId: string) => {
    teamProductivityImprovement: number;
    qualityImprovement: number;
    safetyImprovement: number;
  };
  
  // Actions - Field Logistics
  planFieldOperation: (
    fieldId: string,
    operationType: OperationType,
    acres: number,
    equipmentIds: string[],
    preferredStartDate: Date
  ) => FieldLogistics;
  
  updateProgress: (
    fieldId: string,
    operationType: OperationType,
    acresCompleted: number,
    entry: DailyProgressEntry
  ) => void;
  
  // Actions - Equipment Economics
  calculateEquipmentEconomics: (
    equipmentId: string,
    purchasePrice: number,
    salvageValue: number,
    usefulLife: number,
    hoursPerYear: number
  ) => EquipmentEconomics;
  
  compareEquipmentOptions: (
    newEquipment: { price: number; specs: object },
    usedEquipment: { price: number; age: number; hours: number },
    customHireRate: number,
    annualAcres: number
  ) => { buyNew: number; buyUsed: number; customHire: number; recommendation: string };
  
  // Getters
  getPerformanceByEquipment: (equipmentId: string) => EquipmentPerformance[];
  getPerformanceByOperation: (operationType: OperationType) => EquipmentPerformance[];
  getH2AWorkers: () => H2AWorker[];
  getActiveFieldOperations: () => FieldLogistics[];
  getEquipmentEconomics: (equipmentId: string) => EquipmentEconomics | undefined;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useEquipmentLaborStore = create<EquipmentLaborState>()(
  persist(
    (set, get) => ({
      // Initial state
      performanceRecords: [],
      workRateHistory: [],
      transportRecords: [],
      customComparisons: [],
      h2aWorkers: [],
      laborEfficiency: [],
      supervisionBonuses: [],
      fieldLogistics: [],
      equipmentEconomics: [],

      // ============================================================================
      // FIELD EFFICIENCY
      // ============================================================================
      
      calculateFieldEfficiency: (equipmentId, operationType, hoursData, acresCompleted) => {
        const totalTime = Object.values(hoursData).reduce((a, b) => a + b, 0);
        const operatingTime = hoursData.operating;
        
        // Field efficiency = productive time / total time
        const fieldEfficiency = (operatingTime / totalTime) * 100;
        
        // Theoretical capacity based on width and speed
        const speed = OPERATION_SPEEDS[operationType]?.typical || 5;
        // Assume 40ft width for calculation (would come from equipment)
        const width = 40; // feet
        const theoreticalCapacity = (speed * 5280 * width) / 43560; // acres/hour
        
        // Effective capacity
        const effectiveCapacity = theoreticalCapacity * (fieldEfficiency / 100);
        
        const performance: EquipmentPerformance = {
          equipmentId,
          operationType,
          fieldEfficiency,
          theoreticalCapacity,
          effectiveCapacity,
          operatingTime: hoursData.operating,
          turningTime: hoursData.turning,
          overlapTime: hoursData.overlap,
          loadingTime: hoursData.loading,
          maintenanceTime: hoursData.maintenance,
          transportTime: 0, // calculated separately
          overlapPercentage: (hoursData.overlap / totalTime) * 100,
          skipPercentage: 0, // would need coverage analysis
          coverageAccuracy: 100 - (hoursData.overlap / totalTime) * 100,
          acresCompleted
        };
        
        return performance;
      },
      
      recordPerformance: (performance) => {
        // Calculate derived metrics
        const totalTime = performance.operatingTime + performance.turningTime + 
                         performance.overlapTime + performance.loadingTime + 
                         performance.maintenanceTime;
        const fieldEfficiency = (performance.operatingTime / totalTime) * 100;
        const effectiveCapacity = performance.acresCompleted / totalTime;
        
        const completePerformance: EquipmentPerformance = {
          ...performance,
          fieldEfficiency,
          effectiveCapacity
        };
        
        set(state => ({
          performanceRecords: [...state.performanceRecords, completePerformance]
        }));
      },
      
      getEfficiencyTrend: (equipmentId, days) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return get().performanceRecords.filter(
          p => p.equipmentId === equipmentId // Would also filter by date in real implementation
        );
      },
      
      identifyEfficiencyOpportunities: (equipmentId) => {
        const records = get().performanceRecords.filter(p => p.equipmentId === equipmentId
        );
        
        if (records.length === 0) return [];
        
        const avgOverlap = records.reduce((sum, r) => sum + r.overlapPercentage, 0) / records.length;
        const avgTurnTime = records.reduce((sum, r) => sum + r.turningTime, 0) / records.length;
        const avgEfficiency = records.reduce((sum, r) => sum + r.fieldEfficiency, 0) / records.length;
        
        const opportunities: string[] = [];
        
        if (avgOverlap > 10) {
          opportunities.push('High overlap detected - consider auto-steer or RTK guidance');
        }
        if (avgTurnTime > records[0].operatingTime * 0.15) {
          opportunities.push('Excessive turning time - optimize field pattern or expand headlands');
        }
        if (avgEfficiency < 70) {
          opportunities.push('Low field efficiency - analyze downtime causes');
        }
        
        return opportunities;
      },

      // ============================================================================
      // WORK RATES
      // ============================================================================
      
      calculateWorkRate: (operationType, equipmentWidth, fieldSize, conditions = 'good') => {
        const speedData = OPERATION_SPEEDS[operationType];
        const baseEfficiency = EFFICIENCY_FACTORS[operationType];
        
        // Adjust speed for conditions
        let speedMultiplier = 1.0;
        if (conditions === 'ideal') speedMultiplier = 1.1;
        if (conditions === 'fair') speedMultiplier = 0.85;
        if (conditions === 'poor') speedMultiplier = 0.65;
        
        const fieldSpeed = speedData.typical * speedMultiplier;
        const effectiveWidth = equipmentWidth * 0.97; // 3% overlap
        
        // Calculate theoretical and effective capacity
        const theoreticalCapacity = (fieldSpeed * 5280 * effectiveWidth) / 43560;
        const fieldEfficiency = baseEfficiency * speedMultiplier;
        const areaCapacity = theoreticalCapacity * fieldEfficiency;
        
        // Calculate time per acre
        const timePerAcre = 60 / areaCapacity; // minutes
        
        // Estimate for this field
        // Assume rectangular field - turns add time
        const acresPerTurn = (fieldSize / equipmentWidth) * 0.1; // simplified
        const turnsPerAcre = 1 / acresPerTurn;
        const turnTime = 0.5; // minutes per turn
        const turnTimePerAcre = turnsPerAcre * turnTime;
        
        const estimatedTime = (timePerAcre + turnTimePerAcre) * fieldSize / 60; // hours
        
        const calculation: WorkRateCalculation = {
          operationType,
          equipment: `${equipmentWidth}ft ${operationType} equipment`,
          travelSpeed: speedData.typical,
          fieldSpeed,
          implementWidth: equipmentWidth,
          effectiveWidth,
          fieldEfficiency,
          areaCapacity,
          timePerAcre,
          availableHours: 10, // typical work day
          dailyCapacity: areaCapacity * 10,
          fieldSize,
          estimatedTime,
          turnsPerAcre,
          turnTime
        };
        
        set(state => ({
          workRateHistory: [...state.workRateHistory, calculation]
        }));
        
        return calculation;
      },
      
      estimateJobTime: (fieldId, operationType, equipmentIds) => {
        // Simplified estimation
        const hoursPerEquipment = 8; // Example
        const totalHours = hoursPerEquipment / equipmentIds.length;
        
        const completionDate = new Date();
        completionDate.setHours(completionDate.getHours() + totalHours);
        
        return { totalHours, completionDate };
      },

      // ============================================================================
      // TRANSPORT
      // ============================================================================
      
      calculateTransport: (fromField, toField, fromLocation, toLocation, equipmentType) => {
        // Calculate straight-line distance
        const R = 3959; // Earth's radius in miles
        const dLat = (toLocation.latitude - fromLocation.latitude) * Math.PI / 180;
        const dLon = (toLocation.longitude - fromLocation.longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(fromLocation.latitude * Math.PI / 180) * 
                  Math.cos(toLocation.latitude * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Road speed depends on equipment type
        const roadSpeed = equipmentType.includes('harvest') ? 20 : 
                         equipmentType.includes('sprayer') ? 25 : 30;
        
        const transportTime = distance / roadSpeed;
        const fuelConsumption = distance * 0.15; // gallons (varies by equipment)
        const cost = fuelConsumption * 3.50; // $3.50/gallon
        
        const calculation: TransportCalculation = {
          fromField,
          toField,
          fromLocation,
          toLocation,
          distance,
          roadSpeed,
          fieldSpeed: 15,
          transportTime,
          fuelConsumption,
          cost
        };
        
        set(state => ({
          transportRecords: [...state.transportRecords, calculation]
        }));
        
        return calculation;
      },
      
      optimizeFieldSequence: (operations) => {
        // Simple nearest-neighbor TSP approximation
        // In reality, this would use actual field locations
        return operations.map(o => o.fieldId);
      },

      // ============================================================================
      // CUSTOM HIRE ECONOMICS
      // ============================================================================
      
      compareCustomHire: (operationType, acres, equipmentId) => {
        const customRate = CUSTOM_HIRE_RATES[operationType];
        const customTotal = customRate.typical * acres;
        
        // Calculate own equipment cost if equipmentId provided
        let ownCost = 0;
        if (equipmentId) {
          const economics = get().equipmentEconomics.find(e => e.equipmentId === equipmentId
          );
          if (economics) {
            ownCost = economics.totalCostPerAcre * acres;
          }
        }
        
        // Estimate ownership costs if no equipment
        if (ownCost === 0) {
          ownCost = customRate.typical * 0.8 * acres; // Assume 20% savings with ownership
        }
        
        const comparison: CustomHireComparison = {
          operationType,
          acres,
          ownEquipment: {
            equipmentId: equipmentId || 'estimated',
            depreciation: ownCost * 0.25 / acres,
            interest: ownCost * 0.15 / acres,
            repairs: ownCost * 0.20 / acres,
            fuel: ownCost * 0.25 / acres,
            labor: ownCost * 0.15 / acres,
            totalCost: ownCost,
            costPerAcre: ownCost / acres
          },
          customHire: {
            operator: 'Local Custom Operator',
            ratePerAcre: customRate.typical,
            minimumCharge: customRate.min * 20, // Assume 20 acre minimum
            mobilizationFee: acres > 100 ? 0 : 150,
            totalCost: customTotal + (acres > 100 ? 0 : 150),
            availability: 'available',
            timing: 'Within 1 week',
            quality: 4
          },
          savingsWithOwn: customTotal - ownCost,
          savingsWithCustom: ownCost - customTotal,
          recommendation: ownCost < customTotal * 0.9 ? 'own' : 
                         ownCost > customTotal * 1.1 ? 'custom' : 'either',
          reasoning: ownCost < customTotal ? 
            'Ownership is more cost-effective at this volume' : 
            'Custom hire is more cost-effective for this operation'
        };
        
        set(state => ({
          customComparisons: [...state.customComparisons, comparison]
        }));
        
        return comparison;
      },
      
      findCustomOperators: (operationType, location, radius) => {
        // In real implementation, this would query a database
        return [
          { name: 'Smith Custom Farming', rate: 45, availability: 'Available next week', rating: 4.5 },
          { name: 'Johnson Ag Services', rate: 42, availability: 'Limited availability', rating: 4.2 },
          { name: 'Midwest Custom Harvest', rate: 48, availability: 'Available', rating: 4.8 }
        ];
      },

      // ============================================================================
      // H2A PROGRAM
      // ============================================================================
      
      addH2AWorker: (worker) => {
        const id = `h2a-${Date.now()}`;
        const newWorker: H2AWorker = { ...worker, id };
        
        set(state => ({
          h2aWorkers: [...state.h2aWorkers, newWorker]
        }));
        
        return id;
      },
      
      updateH2AWorker: (id, updates) => {
        set(state => ({
          h2aWorkers: state.h2aWorkers.map(w =>
            w.id === id ? { ...w, ...updates } : w
          )
        }));
      },
      
      calculateH2ACost: (workerId) => {
        const worker = get().h2aWorkers.find(w => w.id === workerId);
        if (!worker) return { totalCost: 0, costPerHour: 0, vsDomesticWorker: 0 };
        
        const weeks = Math.ceil(
          (worker.endDate.getTime() - worker.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        
        // Wage costs
        const regularHours = Math.min(worker.hoursPerWeek, 40);
        const overtimeHours = Math.max(0, worker.hoursPerWeek - 40);
        const weeklyWages = (regularHours * worker.hourlyWage) + 
                           (overtimeHours * worker.hourlyWage * worker.overtimeRate);
        const totalWages = weeklyWages * weeks;
        
        // Non-wage costs
        const housingCost = worker.housingProvided ? worker.housingCost * weeks : 0;
        const transportCost = worker.transportProvided ? worker.transportCost : 0;
        const mealCost = worker.mealsProvided ? worker.mealCost * 7 * weeks : 0;
        const workersComp = totalWages * 0.05; // ~5% for workers comp
        const payrollTaxes = totalWages * 0.0765; // FICA
        
        const totalCost = totalWages + housingCost + transportCost + mealCost + 
                         workersComp + payrollTaxes;
        
        const totalHours = worker.hoursPerWeek * weeks;
        const costPerHour = totalCost / totalHours;
        
        // Compare to domestic worker (typically $2-4/hour less in wages but no housing/transport)
        const domesticHourly = worker.hourlyWage + 2;
        const domesticTotal = domesticHourly * totalHours * 1.0765; // With payroll taxes
        
        return {
          totalCost,
          costPerHour,
          vsDomesticWorker: totalCost - domesticTotal
        };
      },
      
      checkH2ACompliance: (workerId) => {
        const worker = get().h2aWorkers.find(w => w.id === workerId);
        if (!worker) return { compliant: false, issues: ['Worker not found'] };
        
        const issues: string[] = [];
        
        // Check AEWR compliance
        const requiredAEWR = AEWR_RATES['IA'] || 15; // Default
        if (worker.hourlyWage < requiredAEWR) {
          issues.push(`Wage ($${worker.hourlyWage}) below AEWR ($${requiredAEWR})`);
        }
        
        // Check visa status
        const now = new Date();
        if (worker.visaExpirationDate < now) {
          issues.push('Visa has expired');
        }
        
        // Check housing
        if (!worker.housingProvided) {
          issues.push('H-2A requires housing be provided');
        }
        
        // Check transport
        if (!worker.transportProvided) {
          issues.push('Inbound transport must be provided');
        }
        
        // Check insurance
        if (!worker.workersCompInsurance) {
          issues.push('Workers compensation insurance required');
        }
        
        return {
          compliant: issues.length === 0,
          issues
        };
      },
      
      getExpiringVisas: (days) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        
        return get().h2aWorkers.filter(w => 
          w.visaExpirationDate <= cutoff && w.visaExpirationDate >= new Date()
        );
      },
      
      calculateAEWR: (state) => {
        return AEWR_RATES[state] || 15.00;
      },

      // ============================================================================
      // LABOR EFFICIENCY
      // ============================================================================
      
      recordLaborEfficiency: (record) => {
        const acresPerHour = record.acresCompleted / record.hoursWorked;
        
        // Calculate efficiency rating based on standard
        const standardRates: Record<OperationType, number> = {
          tillage: 10,
          planting: 12,
          spraying: 25,
          fertilizing: 18,
          harvesting: 8,
          cultivating: 15,
          mowing: 12,
          baling: 6,
          grain_cart: 0,
          transport: 0
        };
        
        const standard = standardRates[record.operationType] || 10;
        const efficiencyRating = (acresPerHour / standard) * 100;
        
        const completeRecord: LaborEfficiency = {
          ...record,
          acresPerHour,
          efficiencyRating
        };
        
        set(state => ({
          laborEfficiency: [...state.laborEfficiency, completeRecord]
        }));
      },
      
      getWorkerPerformance: (workerId, days) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return get().laborEfficiency.filter(
          e => e.workerId === workerId // Would also check date
        );
      },
      
      compareWorkerEfficiency: (workerIds, operationType) => {
        const results = workerIds.map(workerId => {
          const records = get().laborEfficiency.filter(
            e => e.workerId === workerId && e.operationType === operationType
          );
          
          const avgAcresPerHour = records.length > 0 
            ? records.reduce((sum, r) => sum + r.acresPerHour, 0) / records.length
            : 0;
          
          const avgQuality = records.length > 0
            ? records.reduce((sum, r) => sum + r.qualityScore, 0) / records.length
            : 0;
          
          return {
            workerId,
            avgAcresPerHour,
            avgQuality,
            ranking: 0 // Will be assigned after sorting
          };
        });
        
        // Sort and assign rankings
        results.sort((a, b) => b.avgAcresPerHour - a.avgAcresPerHour);
        results.forEach((r, i) => r.ranking = i + 1);
        
        return results;
      },

      // ============================================================================
      // SUPERVISION
      // ============================================================================
      
      calculateSupervisionBonus: (supervisorId, month) => {
        // Get all workers supervised by this supervisor
        const teamEfficiency = get().laborEfficiency.filter(
          e => e.supervisedBy === supervisorId
        );
        
        const workers = [...new Set(teamEfficiency.map(e => e.workerId))];
        
        if (workers.length === 0) {
          return {
            supervisorId,
            month,
            teamSize: 0,
            workersSupervised: [],
            teamEfficiency: 0,
            teamSafety: 0,
            teamQuality: 0,
            completionRate: 0,
            baseBonus: 0,
            efficiencyMultiplier: 1,
            safetyBonus: 0,
            qualityBonus: 0,
            totalBonus: 0
          };
        }
        
        const avgEfficiency = teamEfficiency.reduce((sum, e) => sum + e.efficiencyRating, 0) / 
                             teamEfficiency.length;
        const avgQuality = teamEfficiency.reduce((sum, e) => sum + e.qualityScore, 0) / 
                          teamEfficiency.length;
        const incidentFreeDays = teamEfficiency.filter(e => e.errors.length === 0).length;
        const safety = (incidentFreeDays / teamEfficiency.length) * 100;
        
        // Calculate bonus
        const baseBonus = 500;
        const efficiencyMultiplier = avgEfficiency >= 100 ? 1.5 : avgEfficiency >= 85 ? 1.2 : 1.0;
        const safetyBonus = safety === 100 ? 250 : safety >= 95 ? 100 : 0;
        const qualityBonus = avgQuality >= 4.5 ? 250 : avgQuality >= 4.0 ? 150 : 0;
        
        const bonus: SupervisionBonus = {
          supervisorId,
          month,
          teamSize: workers.length,
          workersSupervised: workers,
          teamEfficiency: avgEfficiency,
          teamSafety: safety,
          teamQuality: avgQuality,
          completionRate: 95, // Would calculate from jobs
          baseBonus,
          efficiencyMultiplier,
          safetyBonus,
          qualityBonus,
          totalBonus: baseBonus * efficiencyMultiplier + safetyBonus + qualityBonus
        };
        
        set(state => ({
          supervisionBonuses: [...state.supervisionBonuses, bonus]
        }));
        
        return bonus;
      },
      
      getSupervisionEffectiveness: (supervisorId) => {
        const bonuses = get().supervisionBonuses.filter(b => b.supervisorId === supervisorId
        );
        
        if (bonuses.length === 0) {
          return { teamProductivityImprovement: 0, qualityImprovement: 0, safetyImprovement: 0 };
        }
        
        const avgEfficiency = bonuses.reduce((sum, b) => sum + b.teamEfficiency, 0) / bonuses.length;
        const avgQuality = bonuses.reduce((sum, b) => sum + b.teamQuality, 0) / bonuses.length;
        const avgSafety = bonuses.reduce((sum, b) => sum + b.teamSafety, 0) / bonuses.length;
        
        return {
          teamProductivityImprovement: avgEfficiency - 85, // vs baseline
          qualityImprovement: avgQuality - 3.5,
          safetyImprovement: avgSafety - 90
        };
      },

      // ============================================================================
      // FIELD LOGISTICS
      // ============================================================================
      
      planFieldOperation: (fieldId, operationType, acres, equipmentIds, preferredStartDate) => {
        const logistics: FieldLogistics = {
          fieldId,
          operationType,
          primaryEquipment: equipmentIds[0],
          supportEquipment: equipmentIds.slice(1),
          operators: [], // Would assign based on availability
          plannedStart: preferredStartDate,
          plannedEnd: new Date(preferredStartDate.getTime() + 8 * 60 * 60 * 1000),
          acresPlanned: acres,
          acresCompleted: 0,
          percentComplete: 0,
          dailyProgress: []
        };
        
        set(state => ({
          fieldLogistics: [...state.fieldLogistics, logistics]
        }));
        
        return logistics;
      },
      
      updateProgress: (fieldId, operationType, acresCompleted, entry) => {
        set(state => ({
          fieldLogistics: state.fieldLogistics.map(fl => {
            if (fl.fieldId !== fieldId || fl.operationType !== operationType) return fl;
            
            const newAcres = fl.acresCompleted + acresCompleted;
            const percentComplete = (newAcres / fl.acresPlanned) * 100;
            
            return {
              ...fl,
              acresCompleted: newAcres,
              percentComplete,
              dailyProgress: [...fl.dailyProgress, entry],
              actualEnd: percentComplete >= 100 ? entry.date : fl.actualEnd
            };
          })
        }));
      },

      // ============================================================================
      // EQUIPMENT ECONOMICS
      // ============================================================================
      
      calculateEquipmentEconomics: (
        equipmentId,
        purchasePrice,
        salvageValue,
        usefulLife,
        hoursPerYear
      ) => {
        // Ownership costs (annual)
        const depreciation = (purchasePrice - salvageValue) / usefulLife;
        const interest = (purchasePrice + salvageValue) / 2 * 0.05; // 5% interest rate
        const insurance = purchasePrice * 0.005; // 0.5% of value
        const housing = purchasePrice * 0.005; // 0.5% for storage
        const totalOwnership = depreciation + interest + insurance + housing;
        
        // Operating costs (per hour)
        const fuelCost = 15; // gallons/hr * $3.50 - varies by equipment
        const repairCost = (purchasePrice * 0.03) / hoursPerYear; // 3% of value annually
        const laborCost = 25; // $25/hour operator
        const totalOperating = fuelCost + repairCost + laborCost;
        
        // Total costs
        const totalCostPerHour = totalOwnership / hoursPerYear + totalOperating;
        const totalCostPerAcre = totalCostPerHour / 10; // Assume 10 acres/hour
        
        const economics: EquipmentEconomics = {
          equipmentId,
          purchasePrice,
          salvageValue,
          usefulLife,
          hoursPerYear,
          depreciation,
          interest,
          insurance,
          housing,
          totalOwnershipCost: totalOwnership,
          ownershipCostPerHour: totalOwnership / hoursPerYear,
          ownershipCostPerAcre: (totalOwnership / hoursPerYear) / 10,
          fuelCost,
          repairCost,
          laborCost,
          totalOperatingCost: totalOperating,
          totalCostPerHour,
          totalCostPerAcre,
          breakEvenUtilization: totalOwnership / (totalOperating * 0.5) // Simplified
        };
        
        set(state => ({
          equipmentEconomics: [...state.equipmentEconomics, economics]
        }));
        
        return economics;
      },
      
      compareEquipmentOptions: (
        newEquipment,
        usedEquipment,
        customHireRate,
        annualAcres
      ) => {
        // Calculate annual costs for each option
        const newAnnual = newEquipment.price * 0.15; // 15% of value annually
        const usedAnnual = usedEquipment.price * 0.20 + 
                          (usedEquipment.hours > 1000 ? 5000 : 0); // Higher repairs for used
        const customAnnual = customHireRate * annualAcres;
        
        const buyNew = newAnnual;
        const buyUsed = usedAnnual;
        const customHire = customAnnual;
        
        const minCost = Math.min(buyNew, buyUsed, customHire);
        let recommendation = '';
        
        if (minCost === buyNew) {
          recommendation = 'Buy new equipment for reliability and warranty';
        } else if (minCost === buyUsed) {
          recommendation = 'Buy used equipment for lower initial investment';
        } else {
          recommendation = 'Use custom hire for flexibility and lower commitment';
        }
        
        return { buyNew, buyUsed, customHire, recommendation };
      },

      // ============================================================================
      // GETTERS
      // ============================================================================
      
      getPerformanceByEquipment: (equipmentId) => {
        return get().performanceRecords.filter(p => p.equipmentId === equipmentId);
      },
      
      getPerformanceByOperation: (operationType) => {
        return get().performanceRecords.filter(p => p.operationType === operationType);
      },
      
      getH2AWorkers: () => {
        return get().h2aWorkers;
      },
      
      getActiveFieldOperations: () => {
        return get().fieldLogistics.filter(
          fl => fl.percentComplete < 100
        );
      },
      
      getEquipmentEconomics: (equipmentId) => {
        return get().equipmentEconomics.find(e => e.equipmentId === equipmentId);
      }
    }),
    {
      name: 'agri-os-equipment-labor-store',
      partialize: (state) => ({
        performanceRecords: state.performanceRecords,
        workRateHistory: state.workRateHistory,
        transportRecords: state.transportRecords,
        customComparisons: state.customComparisons,
        h2aWorkers: state.h2aWorkers,
        laborEfficiency: state.laborEfficiency,
        supervisionBonuses: state.supervisionBonuses,
        fieldLogistics: state.fieldLogistics,
        equipmentEconomics: state.equipmentEconomics
      })
    }
  )
);

export default useEquipmentLaborStore;
