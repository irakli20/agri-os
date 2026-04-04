// @ts-nocheck
/**
 * Agri-OS Simulation Stores Integration Example
 * 
 * This file demonstrates how to use the new simulation stores
 * in your UI components and game logic.
 */

import {
  // Storage Management
  useStorageStore,
  
  // Crop Data & Growth
  getCropData,
  simulateCropGrowth,
  CROP_DATABASE,
  
  // Autopilot Engine
  useAutopilotStore,
  generateAutopilotRecommendations,
  executeAutopilotAction,
  
  // Financial Management
  useFinanceStore,
  calculateROI,
  generateFinancialForecast,
  
  // Market Data
  useMarketStore,
  generatePriceForecast,
  getOptimalSellingWindow,
  
  // Pest & Disease
  usePestDiseaseStore,
  scoutForPests,
  assessWeatherDiseaseRisk,
  generateIPMPlan,
  
  // Soil Health
  useSoilHealthStore,
  interpretSoilTest,
  calculateLimeRequirement,
  
  // Irrigation
  useIrrigationStore,
  calculateWaterRequirement,
  generateIrrigationPlan,
  
  // Insurance
  useInsuranceStore,
  calculatePremium,
  generateQuote,
  
  // Compliance
  useComplianceStore,
  checkCompliance,
  calculateComplianceScore,
  
  // Equipment & Labor
  useEquipmentLaborStore,
  calculateEquipmentCost,
  calculateLaborCost,
  
  // Precision Agriculture
  usePrecisionAgStore,
  createPrescriptionMap,
  generateVariableRatePlan,
  
  // Post-Harvest
  usePostHarvestStore,
  assessGrainQuality,
  calculateDryingCost,
  
  // Weather Risk
  assessWeatherRisks,
  assessFrostRisk,
  assessHeatStress,
  
  // Game Store (existing)
  useGameStore,
  useFieldStore
} from './index';

// ============================================================================
// EXAMPLE 1: Storage Management
// ============================================================================

export function StorageManagementExample() {
  // Access storage store
  const { 
    facilities, 
    addFacility, 
    storeProduct, 
    transferProduct,
    getStorageUtilization,
    getQualityTrend
  } = useStorageStore();

  // Example: Add a new storage facility
  const addGrainSilo = () => {
    addFacility({
      id: 'silo-001',
      name: 'Main Grain Silo',
      type: 'grain_silo',
      capacity: 50000, // bushels
      currentUtilization: 0,
      location: { lat: 41.8781, lng: -87.6298 },
      conditions: {
        temperature: 65,
        humidity: 55,
        moisture: 13.5,
        co2: 400,
        aeration: true
      }
    });
  };

  // Example: Store harvested grain
  const storeHarvest = () => {
    storeProduct('silo-001', {
      id: 'harvest-2024-001',
      category: 'grain',
      productType: 'corn',
      variety: 'Pioneer P1197',
      quantity: 25000,
      quality: {
        grade: 'Grade 2',
        moisture: 14.2,
        testWeight: 56,
        damage: 2,
        foreignMaterial: 0.5
      },
      storageDate: new Date().toISOString(),
      origin: { fieldId: 'field-001', harvestDate: new Date().toISOString() }
    });
  };

  return { addGrainSilo, storeHarvest, facilities };
}

// ============================================================================
// EXAMPLE 2: Crop Growth Simulation
// ============================================================================

export function CropGrowthExample() {
  // Get crop data
  const cornData = getCropData('corn');
  
  // Simulate crop growth
  const growthResult = simulateCropGrowth({
    cropType: 'corn',
    variety: 'Pioneer P1197',
    plantingDate: '2024-04-15',
    soilType: 'loam',
    irrigationType: 'drip',
    fertilizerPlan: {
      nitrogen: { total: 180, split: [30, 100, 50] },
      phosphorus: 60,
      potassium: 80
    },
    weatherData: [], // Add weather data
    pestPressure: 'low',
    diseasePressure: 'low'
  });

  return { cornData, growthResult };
}

// ============================================================================
// EXAMPLE 3: Autopilot Recommendations
// ============================================================================

export function AutopilotExample() {
  const {
    config,
    setMode,
    enableAutopilot,
    disableAutopilot,
    getRecommendations,
    executeAction
  } = useAutopilotStore();

  // Enable autopilot for a field
  const enableFieldAutopilot = () => {
    enableAutopilot('field-001');
    setMode('semi'); // semi-autonomous mode
  };

  // Get recommendations for current conditions
  const recommendations = getRecommendations('field-001');

  // Execute a recommended action
  const executeRecommendedAction = (actionId: string) => {
    executeAction('field-001', actionId);
  };

  return { enableFieldAutopilot, recommendations, executeRecommendedAction };
}

// ============================================================================
// EXAMPLE 4: Financial Management
// ============================================================================

export function FinancialManagementExample() {
  const {
    expenses,
    income,
    budgets,
    forecasts,
    addExpense,
    addIncome,
    createBudget
  } = useFinanceStore();

  // Add an expense
  const recordExpense = () => {
    addExpense({
      id: 'exp-001',
      date: new Date().toISOString(),
      category: 'seed',
      amount: 12500,
      description: 'Corn seed purchase',
      fieldId: 'field-001',
      cropType: 'corn',
      vendor: 'Pioneer Seeds',
      paymentMethod: 'credit'
    });
  };

  // Calculate ROI for a field
  const fieldROI = calculateROI({
    revenue: 85000,
    costs: {
      seed: 12500,
      fertilizer: 8500,
      chemicals: 4200,
      fuel: 3800,
      labor: 12000,
      equipment: 6500,
      land: 15000,
      other: 3500
    }
  });

  return { recordExpense, fieldROI, totalExpenses: expenses.length };
}

// ============================================================================
// EXAMPLE 5: Market Analysis
// ============================================================================

export function MarketAnalysisExample() {
  const {
    commodities,
    forecasts: marketForecasts,
    refreshPrices
  } = useMarketStore();

  // Get corn price forecast
  const cornForecast = generatePriceForecast('corn', 30);

  // Find optimal selling window
  const sellingWindow = getOptimalSellingWindow('corn', {
    currentPrice: commodities.corn?.currentPrice || 4.85,
    harvestMonth: 10,
    storageCost: 0.05,
    interestRate: 0.06
  });

  return { cornForecast, sellingWindow };
}

// ============================================================================
// EXAMPLE 6: Pest & Disease Management
// ============================================================================

export function PestDiseaseExample() {
  const {
    infestations,
    diseaseIncidents,
    activeTreatments,
    scoutField,
    calculateTreatmentPriority
  } = usePestDiseaseStore();

  // Scout a field for pests
  const scoutResult = scoutForPests('field-001', {
    pestTypes: ['aphid', 'armyworm', 'corn_borer'],
    scoutMethod: 'visual_inspection',
    sampleSize: 20
  });

  // Assess disease risk based on weather
  const diseaseRisk = assessWeatherDiseaseRisk({
    temperature: 75,
    humidity: 85,
    leafWetness: 12,
    rainfall: 0.5
  }, 'gray_leaf_spot');

  // Generate IPM plan
  const ipmPlan = generateIPMPlan('field-001', 'corn', {
    currentPests: infestations.filter(i => i.fieldId === 'field-001'),
    currentDiseases: diseaseIncidents.filter(d => d.fieldId === 'field-001'),
    weatherForecast: [],
    economicThresholds: true,
    resistanceManagement: true
  });

  return { scoutResult, diseaseRisk, ipmPlan };
}

// ============================================================================
// EXAMPLE 7: Soil Health Management
// ============================================================================

export function SoilHealthExample() {
  const {
    soilTests,
    amendments,
    healthScores,
    addSoilTest
  } = useSoilHealthStore();

  // Interpret soil test results
  const testInterpretation = interpretSoilTest({
    ph: 6.2,
    organicMatter: 3.8,
    nitrogen: 45,
    phosphorus: 28,
    potassium: 185,
    calcium: 1200,
    magnesium: 280,
    sulfur: 15,
    zinc: 1.2,
    manganese: 12,
    boron: 0.6,
    texture: 'silt_loam'
  }, 'corn');

  // Calculate lime requirement
  const limeRequirement = calculateLimeRequirement(6.2, 6.8, 15, 'silt_loam');

  return { testInterpretation, limeRequirement };
}

// ============================================================================
// EXAMPLE 8: Irrigation Management
// ============================================================================

export function IrrigationExample() {
  const {
    schedules,
    waterUsage,
    createSchedule
  } = useIrrigationStore();

  // Calculate water requirement
  const waterNeed = calculateWaterRequirement({
    crop: 'corn',
    growthStage: 'reproductive',
    evapotranspiration: 0.25,
    rainfall: 0,
    soilMoisture: 45,
    fieldArea: 120
  });

  // Generate irrigation plan
  const irrigationPlan = generateIrrigationPlan('field-001', {
    crop: 'corn',
    systemType: 'center_pivot',
    waterSource: 'well',
    scheduleType: 'optimized',
    constraints: {
      maxWaterPerApplication: 1.0,
      maxApplicationsPerWeek: 3,
      avoidWindSpeed: 15
    }
  });

  return { waterNeed, irrigationPlan };
}

// ============================================================================
// EXAMPLE 9: Insurance Management
// ============================================================================

export function InsuranceExample() {
  const {
    policies,
    claims,
    quotes,
    requestQuote
  } = useInsuranceStore();

  // Request an insurance quote
  const cropInsuranceQuote = requestQuote({
    type: 'crop',
    cropType: 'corn',
    coverageLevel: 75,
    insuredAcres: 500,
    expectedYield: 180,
    projectedPrice: 4.50,
    location: { lat: 41.8781, lng: -87.6298 }
  });

  return { cropInsuranceQuote, policies: policies.length };
}

// ============================================================================
// EXAMPLE 10: Compliance Tracking
// ============================================================================

export function ComplianceExample() {
  const {
    requirements,
    certifications,
    audits,
    documents,
    checkRequirement
  } = useComplianceStore();

  // Check compliance for a requirement
  const complianceCheck = checkRequirement('req-001', {
    hasDocumentation: true,
    lastInspectionDate: '2024-01-15',
    trainingCompleted: true,
    recordsUpToDate: true
  });

  // Calculate overall compliance score
  const complianceScore = calculateComplianceScore(requirements);

  return { complianceCheck, complianceScore };
}

// ============================================================================
// EXAMPLE 11: Equipment & Labor Management
// ============================================================================

export function EquipmentLaborExample() {
  const {
    equipment,
    laborRecords,
    maintenanceSchedule,
    trackEquipmentUsage,
    trackLabor
  } = useEquipmentLaborStore();

  // Calculate equipment cost for an operation
  const equipmentCost = calculateEquipmentCost({
    equipmentType: 'tractor',
    operation: 'tillage',
    hours: 8,
    fuelCost: 3.50,
    fuelConsumption: 6,
    acreage: 120
  });

  // Calculate labor cost
  const laborCost = calculateLaborCost({
    laborType: 'operator',
    hours: 8,
    rate: 25,
    benefits: 0.25,
    overtime: false
  });

  return { equipmentCost, laborCost };
}

// ============================================================================
// EXAMPLE 12: Precision Agriculture
// ============================================================================

export function PrecisionAgExample() {
  const {
    prescriptionMaps,
    managementZones,
    sensorData,
    createZone
  } = usePrecisionAgStore();

  // Create management zones from yield data
  const zones = createZone('field-001', {
    yieldData: [],
    soilData: [],
    elevationData: [],
    numZones: 3
  });

  // Create variable rate prescription
  const prescription = createPrescriptionMap('field-001', {
    applicationType: 'fertilizer',
    nutrient: 'nitrogen',
    baseRate: 180,
    zones: zones || [],
    adjustmentFactors: {
      yieldGoal: 1.0,
      soilTest: 0.8,
      topography: 1.1
    }
  });

  return { zones, prescription };
}

// ============================================================================
// EXAMPLE 13: Post-Harvest Management
// ============================================================================

export function PostHarvestExample() {
  const {
    harvestRecords,
    dryingSessions,
    qualityGrades,
    recordHarvest
  } = usePostHarvestStore();

  // Calculate drying cost
  const dryingCost = calculateDryingCost({
    initialMoisture: 22,
    targetMoisture: 15,
    volume: 5000,
    dryingMethod: 'natural_air',
    energyCost: 0.12
  });

  // Assess grain quality
  const quality = assessGrainQuality({
    moisture: 14.5,
    testWeight: 57,
    damage: 1.5,
    foreignMaterial: 0.3,
    brokenKernels: 2.0
  }, 'corn');

  return { dryingCost, quality };
}

// ============================================================================
// EXAMPLE 14: Weather Risk Assessment
// ============================================================================

export function WeatherRiskExample() {
  // Comprehensive weather risk assessment
  const weatherRisks = assessWeatherRisks({
    temperature: { min: 35, max: 85 },
    humidity: 70,
    windSpeed: 12,
    precipitation: 0.2,
    cloudCover: 40,
    soilMoisture: 55
  }, 'corn', 'reproductive');

  // Specific risk assessments
  const frostRisk = assessFrostRisk(35, 'corn', 'reproductive');
  const heatStress = assessHeatStress(95, 75, 'corn', 'reproductive');

  return { weatherRisks, frostRisk, heatStress };
}

// ============================================================================
// EXAMPLE 15: Integration with Game Store
// ============================================================================

export function GameIntegrationExample() {
  // Access existing game store
  const { 
    currentPlayerId, 
    getCurrentPlayer, 
    buyField, 
    rentField,
    inventory,
    equipment,
    gameTime,
    advanceTime
  } = useGameStore();

  // Access field store
  const { gameFields, updateField } = useFieldStore();

  // Combine with new stores
  const { facilities } = useStorageStore();
  const { addExpense } = useFinanceStore();

  // Example: Purchase field and record in finance
  const purchaseFieldWithTracking = (fieldId: string, price: number) => {
    // Buy field in game store
    const result = buyField(fieldId, price);
    
    if (result.success) {
      // Record expense in finance store
      addExpense({
        id: `exp-field-${Date.now()}`,
        date: new Date().toISOString(),
        category: 'land',
        amount: price,
        description: `Field purchase: ${fieldId}`,
        paymentMethod: 'transfer'
      });
    }

    return result;
  };

  return { purchaseFieldWithTracking, gameFields, facilities };
}

// ============================================================================
// EXAMPLE 16: Complete Farm Management Dashboard
// ============================================================================

export function FarmDashboardExample() {
  // Gather data from all stores for a comprehensive dashboard
  const dashboard = {
    // Financial overview
    finances: useFinanceStore(),
    
    // Storage status
    storage: useStorageStore(),
    
    // Field status
    fields: useFieldStore(),
    
    // Pest & disease alerts
    pestDisease: usePestDiseaseStore(),
    
    // Weather risks
    weather: {
      risks: assessWeatherRisks({} as any, 'corn', 'vegetative')
    },
    
    // Autopilot status
    autopilot: useAutopilotStore(),
    
    // Market data
    market: useMarketStore(),
    
    // Equipment status
    equipment: useEquipmentLaborStore(),
    
    // Compliance status
    compliance: useComplianceStore()
  };

  return dashboard;
}
