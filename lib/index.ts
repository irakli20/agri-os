// @ts-nocheck
/**
 * Agri-OS Library Index
 * 
 * Comprehensive exports for all game systems and simulation stores:
 * - Core Game Store & Field Simulation
 * - Storage & Inventory Management
 * - Crop Data & Simulation
 * - Autopilot Engine
 * - Finance Management
 * - Market Data
 * - Pest & Disease System
 * - Soil Health Management
 * - Irrigation Management
 * - Insurance Management
 * - Compliance Tracking
 * - Equipment & Labor Management
 * - Precision Agriculture
 * - Post-Harvest Management
 * - Weather Risk System
 */

// ============================================================================
// CORE GAME SYSTEMS
// ============================================================================

export { useGameStore, useFieldStore } from './game-store';
export type { 
  Player, 
  FieldTransaction, 
  WeeklyChallenge, 
  WeeklySummary, 
  WeeklyWeather,
  GameStore,
  InventoryItem,
  GameTime,
  ActiveRental,
  WeeklyChallengePriority
} from './game-store';
export { 
  STARTING_BALANCE, 
  UNLIMITED_TEST_FUNDS, 
  XP_PER_PURCHASE, 
  XP_PER_RENTAL, 
  XP_PER_LEVEL,
  SEASONS,
  WEEKS_PER_SEASON
} from './game-store';

// ============================================================================
// FIELD STORE
// ============================================================================

export type { FieldStore } from './field-store';

// ============================================================================
// STORAGE & INVENTORY STORE
// ============================================================================

export {
  useStorageStore,
  GRAIN_DETERIORATION_RATES,
  OPTIMAL_STORAGE_CONDITIONS,
  STORAGE_CAPACITY_OPTIONS,
  DEFAULT_STORAGE_FACILITY
} from './storage-store';
export type {
  StorageFacility,
  StorageType,
  StoredProduct,
  ProductCategory,
  StorageConditions,
  StorageQuality,
  InventoryItem as StorageInventoryItem,
  StorageTransaction,
  StorageAlert,
  StorageAnalytics,
  StorageFacilityState
} from './storage-store';

// ============================================================================
// CROP DATA & SIMULATION
// ============================================================================

export {
  CROP_DATABASE,
  CROP_GROWTH_STAGES,
  CROP_MARKET_DATA,
  CROP_ROTATION_SUITABILITY,
  NUTRIENT_REQUIREMENTS,
  WATER_REQUIREMENTS,
  PEST_VULNERABILITY,
  DISEASE_VULNERABILITY,
  HARVEST_WINDOWS,
  getCropData,
  getCropGrowthStage,
  getCropMarketPrice,
  calculateNutrientRequirements,
  calculateWaterRequirements,
  calculateCropRotationScore,
  simulateCropGrowth,
  predictYield
} from './crop-data';
export type {
  CropType,
  CropVariety,
  CropGrowthStage,
  GrowthStageInfo,
  CropMarketData,
  NutrientRequirements,
  WaterRequirements,
  PestVulnerability,
  DiseaseVulnerability,
  HarvestWindow,
  CropRotationSuitability
} from './crop-data';

// ============================================================================
// AUTOPILOT ENGINE
// ============================================================================

export {
  useAutopilotStore,
  AUTOPILOT_MODES,
  AUTOPILOT_PRIORITIES,
  DEFAULT_AUTOPILOT_CONFIG,
  generateAutopilotRecommendations,
  executeAutopilotAction,
  getOptimalPlantingDate,
  getOptimalHarvestDate,
  getOptimalIrrigationSchedule,
  getOptimalFertilizerSchedule,
  calculateAutopilotEfficiency,
  generateAutopilotReport
} from './autopilot-engine';
export type {
  AutopilotMode,
  AutopilotPriority,
  AutopilotConfig,
  AutopilotRecommendation,
  AutopilotAction,
  AutopilotActionType,
  AutopilotActionStatus,
  AutopilotDecision,
  AutopilotReport,
  AutopilotState,
  FieldRecommendation
} from './autopilot-engine';

// ============================================================================
// FINANCE STORE
// ============================================================================

export {
  useFinanceStore,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  DEFAULT_BUDGET_ALLOCATION,
  generateFinancialForecast,
  calculateROI,
  calculateBreakEven,
  generateCashFlowProjection,
  createBudget,
  trackExpense,
  trackIncome,
  analyzeProfitability,
  generateFinancialReport
} from './finance-store';
export type {
  ExpenseCategory,
  IncomeCategory,
  Expense,
  Income,
  Budget,
  BudgetAllocation,
  FinancialForecast,
  CashFlowProjection,
  ROIAnalysis,
  BreakEvenAnalysis,
  FinancialReport,
  FinancialPeriod,
  FinancialAlert,
  FinanceState
} from './finance-store';

// ============================================================================
// MARKET STORE
// ============================================================================

export {
  useMarketStore,
  COMMODITY_PRICES,
  MARKET_INDICES,
  SUPPLY_CHAIN_FACTORS,
  WEATHER_IMPACT_FACTORS,
  POLICY_IMPACT_FACTORS,
  DEMAND_DRIVERS,
  generatePriceForecast,
  calculateMarketSentiment,
  analyzeSupplyChain,
  getSeasonalPricePattern,
  getOptimalSellingWindow,
  calculateBasis,
  analyzeMarketTrends,
  generateMarketReport
} from './market-store';
export type {
  CommodityType,
  CommodityPrice,
  PricePoint,
  MarketIndex,
  SupplyChainFactor,
  WeatherImpactFactor,
  PolicyImpactFactor,
  DemandDriver,
  PriceForecast,
  MarketSentiment,
  SupplyChainAnalysis,
  SeasonalPattern,
  BasisAnalysis,
  MarketTrend,
  MarketReport,
  MarketState
} from './market-store';

// ============================================================================
// PEST & DISEASE STORE
// ============================================================================

export {
  usePestDiseaseStore,
  PEST_PROFILES,
  DISEASE_PROFILES,
  WEATHER_DISEASE_THRESHOLDS,
  ECONOMIC_THRESHOLDS,
  TREATMENT_OPTIONS,
  RESISTANCE_RISKS,
  scoutForPests,
  scoutForDiseases,
  calculateTreatmentPriority,
  getTreatmentRecommendations,
  calculateEconomicThreshold,
  assessWeatherDiseaseRisk,
  generateIPMPlan,
  trackTreatmentHistory,
  updateResistanceProfile,
  generatePestDiseaseReport
} from './pest-disease-store';
export type {
  PestProfile,
  DiseaseProfile,
  PestInfestation,
  DiseaseIncident,
  WeatherDiseaseThresholds,
  EconomicThreshold,
  TreatmentOption,
  TreatmentRecord,
  ResistanceProfile,
  IPMPlan,
  IPMStrategy,
  ScoutReport,
  DiseaseWeatherRisk,
  PestDiseaseAlert,
  PestDiseaseState
} from './pest-disease-store';

// ============================================================================
// SOIL HEALTH STORE
// ============================================================================

export {
  useSoilHealthStore,
  SOIL_TEST_INTERPRETATION,
  NUTRIENT_CRITICAL_LEVELS,
  PH_MANAGEMENT,
  ORGANIC_MATTER_TARGETS,
  COVER_CROP_BENEFITS,
  TILLAGE_IMPACTS,
  interpretSoilTest,
  calculateNutrientBalance,
  calculateLimeRequirement,
  calculateGypsumRequirement,
  assessSoilStructure,
  calculateCompactionRisk,
  recommendCoverCrops,
  calculateCoverCropBenefits,
  calculateTillageImpact,
  generateSoilHealthReport
} from './soil-health-store';
export type {
  SoilTest,
  NutrientLevel,
  SoilStructure,
  CompactionAssessment,
  SoilBiology,
  SoilHealthScore,
  SoilHealthTrend,
  SoilAmendment,
  CoverCropRecommendation,
  TillageRecommendation,
  SoilHealthReport,
  SoilZone,
  SoilHealthState
} from './soil-health-store';

// ============================================================================
// IRRIGATION STORE
// ============================================================================

export {
  useIrrigationStore,
  IRRIGATION_SYSTEMS,
  CROP_WATER_REQUIREMENTS,
  SOIL_WATER_HOLDS,
  EVAPOTRANSPIRATION_RATES,
  DROUGHT_TOLERANCE_LEVELS,
  WATER_QUALITY_STANDARDS,
  calculateWaterRequirement,
  calculateIrrigationSchedule,
  calculateWaterStressIndex,
  calculateIrrigationEfficiency,
  estimateWaterCost,
  generateIrrigationPlan,
  optimizeIrrigationTiming,
  calculateSoilMoisture,
  forecastWaterNeeds,
  generateWaterReport
} from './irrigation-store';
export type {
  IrrigationSystem,
  IrrigationType,
  WaterRequirement,
  IrrigationEvent,
  IrrigationSchedule,
  SoilMoisture,
  WaterStressIndex,
  IrrigationEfficiency,
  WaterCost,
  IrrigationPlan,
  WaterSource,
  WaterQuality,
  IrrigationState
} from './irrigation-store';

// ============================================================================
// INSURANCE STORE
// ============================================================================

export {
  useInsuranceStore,
  INSURANCE_PRODUCTS,
  COVERAGE_LEVELS,
  PREMIUM_CALCULATION_FACTORS,
  RISK_RATING_FACTORS,
  CLAIM_TYPES,
  calculatePremium,
  calculateCoverage,
  assessRisk,
  generateQuote,
  fileClaim,
  evaluateClaim,
  calculateLossAdjustment,
  generateInsuranceReport
} from './insurance-store';
export type {
  InsuranceProduct,
  InsuranceType,
  CoverageLevel,
  Policy,
  Claim,
  ClaimStatus,
  RiskAssessment,
  PremiumCalculation,
  Quote,
  InsuranceReport,
  InsuranceState
} from './insurance-store';

// ============================================================================
// COMPLIANCE STORE
// ============================================================================

export {
  useComplianceStore,
  REGULATORY_REQUIREMENTS,
  CERTIFICATION_STANDARDS,
  AUDIT_CHECKLISTS,
  COMPLIANCE_THRESHOLDS,
  DOCUMENT_TEMPLATES,
  checkCompliance,
  calculateComplianceScore,
  generateAuditReport,
  trackDocumentation,
  scheduleInspection,
  assessRiskLevel,
  generateCompliancePlan,
  createComplianceReport
} from './compliance-store';
export type {
  RegulatoryRequirement,
  CertificationStandard,
  ComplianceStatus,
  ComplianceCheck,
  AuditChecklist,
  AuditResult,
  ComplianceDocument,
  Inspection,
  RiskAssessment as ComplianceRiskAssessment,
  ComplianceScore,
  CompliancePlan,
  ComplianceReport,
  ComplianceState
} from './compliance-store';

// ============================================================================
// EQUIPMENT & LABOR STORE
// ============================================================================

export {
  useEquipmentLaborStore,
  EQUIPMENT_TYPES,
  EQUIPMENT_SPECS,
  MAINTENANCE_SCHEDULES,
  LABOR_RATES,
  OPERATOR_CERTIFICATIONS,
  calculateEquipmentCost,
  calculateLaborCost,
  scheduleMaintenance,
  trackEquipmentUsage,
  calculateDepreciation,
  assessEquipmentEfficiency,
  generateEquipmentReport,
  planLaborAllocation,
  calculateLaborProductivity,
  generateLaborReport
} from './equipment-labor-store';
export type {
  Equipment,
  EquipmentType,
  EquipmentSpecs,
  MaintenanceRecord,
  LaborRecord,
  LaborType,
  Operator,
  Certification,
  EquipmentCost,
  LaborCost,
  DepreciationSchedule,
  EquipmentEfficiency,
  LaborAllocation,
  LaborProductivity,
  EquipmentLaborReport,
  EquipmentLaborState
} from './equipment-labor-store';

// ============================================================================
// PRECISION AG STORE
// ============================================================================

export {
  usePrecisionAgStore,
  SENSOR_TYPES,
  VARIABLE_RATE_TECHNOLOGIES,
  PRECISION_EQUIPMENT,
  DATA_SOURCES,
  ACCURACY_STANDARDS,
  VRT_APPLICATION_RATES,
  createPrescriptionMap,
  generateVariableRatePlan,
  analyzeYieldData,
  createManagementZones,
  calculatePrescriptionAccuracy,
  estimateROI,
  generatePrecisionAgReport
} from './precision-ag-store';
export type {
  SensorType,
  SensorData,
  VariableRateTechnology,
  PrescriptionMap,
  ManagementZone,
  ZoneCharacteristics,
  VRTApplication,
  YieldData,
  AccuracyMetrics,
  PrecisionAgROI,
  DataSource,
  PrecisionAgReport,
  PrecisionAgState
} from './precision-ag-store';

// ============================================================================
// POST-HARVEST STORE
// ============================================================================

export {
  usePostHarvestStore,
  DRYING_METHODS,
  STORAGE_OPTIONS,
  QUALITY_GRADES,
  HANDLING_EQUIPMENT,
  QUALITY_TESTING_METHODS,
  MARKET_CHANNELS,
  calculateDryingCost,
  calculateStorageCost,
  assessGrainQuality,
  generateQualityCertificate,
  optimizeDryingSchedule,
  calculatePostHarvestLoss,
  planLogistics,
  generatePostHarvestReport
} from './post-harvest-store';
export type {
  HarvestRecord,
  DryingMethod,
  DryingSession,
  StorageRecord,
  QualityGrade,
  QualityTest,
  QualityCertificate,
  HandlingEquipment,
  LogisticsPlan,
  MarketChannel,
  PostHarvestLoss,
  PostHarvestReport,
  PostHarvestState
} from './post-harvest-store';

// ============================================================================
// PEST & DISEASE DATA (Simulation Models)
// ============================================================================

export {
  // Disease Triangle Model
  analyzeDiseaseTriangle,
  type DiseaseTriangle,
  type DiseaseTriangleAnalysis,
  
  // Weather-Triggered Disease
  calculateDiseaseWeatherIndex,
  type WeatherDiseaseIndex,
  type DiseaseEnvironmentRequirements,
  
  // Pest Lifecycle
  simulatePestLifecycle,
  PEST_LIFECYCLE_PARAMS,
  type PestLifecycleModel,
  type PestLifecycleParameters,
  
  // Economic Thresholds
  calculateEconomicThreshold as calculateEconomicThresholdData,
  type EconomicThreshold as EconomicThresholdData,
  type TreatmentDecision,
  
  // Resistance Management
  updateResistanceProfile as updateResistanceProfileData,
  recommendRotationStrategy,
  type ModeOfAction,
  type ResistanceProfile as ResistanceProfileData,
  type ResistanceLevel,
  
  // Beneficial Insects
  calculateBiologicalControl,
  BENEFICIAL_INSECTS,
  type BeneficialInsect,
  type BiologicalControl,
  
  // Disease Profiles
  DISEASE_PROFILES as DISEASE_PROFILES_DATA,
  getDiseaseProfile,
  type ExtendedDiseaseProfile,
  type DiseaseSymptom,
  
  // Pest Profiles
  PEST_PROFILES as PEST_PROFILES_DATA,
  getPestProfile,
  type ExtendedPestProfile,
  
  // Utilities
  calculatePestDamage,
  simulateDiseaseSpread,
  calculateIPMScore,
  isCropSusceptible,
  DEFAULT_DISEASE_REQUIREMENTS
} from './pest-disease-data';

// ============================================================================
// WEATHER DATA (Risk System)
// ============================================================================

export {
  // Frost/Freeze
  assessFrostRisk,
  generateFrostAlert,
  FROST_THRESHOLDS,
  type FrostRiskAssessment,
  
  // Heat Stress
  assessHeatStress,
  generateHeatAlert,
  HEAT_STRESS_THRESHOLDS,
  type HeatStressAssessment,
  
  // Hail Damage
  assessHailRisk,
  generateHailAlert,
  HAIL_VULNERABILITY,
  type HailRiskAssessment,
  
  // Drought (PDSI)
  calculatePDSI,
  generateDroughtAlert,
  type PDSI,
  
  // Disease Weather Index
  calculateDiseaseWeatherIndex as calculateWeatherDiseaseIndex,
  DISEASE_WEATHER_FACTORS,
  type WeatherDiseaseIndex,
  
  // Comprehensive Assessment
  assessWeatherRisks,
  type ComprehensiveWeatherRisk
} from './weather-data';

// ============================================================================
// SUPPLIES STORE (Mock Suppliers & Products)
// ============================================================================

export {
  useSuppliesStore,
  MOCK_SUPPLIERS,
  MOCK_SUPPLY_PRODUCTS,
  getSuppliersByType,
  getCategoryDisplayName,
  getCategoryIcon
} from './supplies-store';
export type {
  Supplier,
  SupplyProduct,
  SupplyOrder
} from './supplies-store';

export * from './mock-data';
export * from './corn-challenges';
export * from './marketplace-data';
export * from './inventory-data';
export * from './equipment-data';
export * from './finance-data';
export * from './service-data';
export * from './bookings-data';
export * from './notifications-data';
export * from './procurement-data';
export * from './scouting-data';
export * from './treatment-data';
export * from './field-analysis-data';
export * from './predictive-analytics-data';
export * from './spray-predictions';
export * from './scouting-observations-data';
export * from './utils';
