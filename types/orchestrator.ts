// @ts-nocheck
/**
 * Agri-OS Master Orchestrator Types
 * Comprehensive type definitions for the agricultural operating system
 */

import { Field, CropType } from '@/lib/mock-data';
import { GameTime, WeeklyWeather, Player } from '@/lib/game-store';

// ============================================================================
// ORCHESTRATOR CORE TYPES
// ============================================================================

export type AutomationLevel = 'manual' | 'assisted' | 'fully_automated';
export type OrchestratorStatus = 'idle' | 'running' | 'paused' | 'error';
export type SimulationMode = 'real_time' | 'simulation';

export interface OrchestratorState {
  id: string;
  status: OrchestratorStatus;
  automationLevel: AutomationLevel;
  simulationMode: SimulationMode;
  currentTick: number;
  lastTickTime: Date;
  season: GameTime['season'];
  week: number;
  year: number;
  activeDecisions: Decision[];
  completedActions: ActionResult[];
  pendingAlerts: Alert[];
  performanceMetrics: PerformanceMetrics;
  digitalTwin: DigitalTwinState;
  sensorStatus: SensorSystemStatus;
  safety: OrchestratorSafetyState;
}

export interface OrchestratorConfig {
  tickInterval: number; // milliseconds
  sensorSyncInterval: number; // milliseconds
  decisionInterval: number; // milliseconds
  autoExecuteThreshold: number; // confidence threshold for auto-execution (0-100)
  maxPendingDecisions: number;
  enablePredictiveAlerts: boolean;
  enableLearning: boolean;
  driftThreshold: number; // percentage before drift alert
  dataRetentionDays: number;
}

export const DEFAULT_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
  tickInterval: 60000, // 1 minute
  sensorSyncInterval: 3600000, // 1 hour
  decisionInterval: 86400000, // 1 day
  autoExecuteThreshold: 85,
  maxPendingDecisions: 10,
  enablePredictiveAlerts: true,
  enableLearning: true,
  driftThreshold: 15,
  dataRetentionDays: 1095, // 3 years
};

// ============================================================================
// DECISION SYSTEM TYPES
// ============================================================================

export type DecisionType = 
  | 'plant' | 'irrigate' | 'fertilize' | 'spray' | 'harvest' 
  | 'scout' | 'treat' | 'sell' | 'buy' | 'lease' 
  | 'maintenance' | 'emergency' | 'preventive';

export type DecisionStatus = 'pending' | 'approved' | 'declined' | 'executing' | 'completed' | 'failed';

export type DecisionPriority = 'critical' | 'high' | 'medium' | 'low' | 'routine';

export interface Decision {
  id: string;
  type: DecisionType;
  status: DecisionStatus;
  priority: DecisionPriority;
  fieldId?: string;
  cropId?: string;
  title: string;
  description: string;
  recommendation: Recommendation;
  alternatives: Recommendation[];
  context: DecisionContext;
  createdAt: Date;
  expiresAt: Date;
  executedAt?: Date;
  outcome?: OutcomeMetrics;
  approvedBy?: string;
  autoExecuted: boolean;
  conflictAnalysis?: DecisionConflictAnalysis;
  executionPolicy?: DecisionExecutionPolicy;
}

export interface DecisionConflictAnalysis {
  hasConflicts: boolean;
  conflictingDecisionIds: string[];
  reasons: string[];
  severity: 'low' | 'medium' | 'high';
  recommendedResolution: string;
}

export interface Recommendation {
  id: string;
  action: string;
  actionType: DecisionType;
  parameters: Record<string, any>;
  confidence: number; // 0-100
  rationale: RecommendationRationale[];
  whyNow: string;
  deadline: Date;
  expectedImpact: RecommendationImpact;
  priorityScoring: DecisionPriorityScoring;
  expectedCost: number;
  expectedRevenue: number;
  expectedROI: number;
  timeWindow: { start: Date; end: Date };
  explanation: string;
  riskFactors: string[];
  prerequisites: string[];
}

export interface RecommendationRationale {
  title: string;
  detail: string;
  source: 'weather' | 'field' | 'market' | 'resource' | 'historical' | 'rule';
}

export interface RecommendationImpact {
  yieldDeltaPct: number;
  revenueDelta: number;
  costDelta: number;
  riskReductionPct: number;
}

export interface DecisionPriorityScoring {
  riskToYieldScore: number; // 0-100
  economicsScore: number; // 0-100
  urgencyScore: number; // 0-100
  compositeScore: number; // 0-100
  reasons: string[];
}

export interface DecisionContext {
  timestamp: Date;
  gameTime: GameTime;
  weather: WeeklyWeather & { forecast: WeatherForecast[] };
  fieldState: FieldState;
  cropState?: CropState;
  marketConditions: MarketConditions;
  resourceAvailability: ResourceAvailability;
  historicalData: HistoricalContext;
  player: Player;
}

export interface FieldState {
  fieldId: string;
  stage: FieldStage;
  soilMoisture: number; // percentage
  soilTemperature: number; // celsius
  soilHealth: SoilHealthSnapshot;
  pestPressure: PestPressureLevel;
  diseaseRisk: DiseaseRiskLevel;
  nutrientLevels: NutrientLevels;
  operationsLog: FieldOperation[];
}

export type FieldStage = 
  | 'fallow' 
  | 'prepared' 
  | 'planted' 
  | 'germinating' 
  | 'growing' 
  | 'reproductive' 
  | 'harvest_ready' 
  | 'harvested';

export interface CropState {
  cropId: string;
  cropType: CropType;
  variety: string;
  plantedAt: Date;
  growthStage: GrowthStage;
  growthProgress: number; // 0-100
  gddAccumulated: number;
  waterStress: number; // 0-100
  nutrientStress: number; // 0-100
  healthScore: number; // 0-100
  expectedYield: number; // tons per hectare
  harvestWindow: { start: Date; end: Date };
}

export type GrowthStage = 
  | 'seed' 
  | 'germination' 
  | 'vegetative' 
  | 'booting' 
  | 'heading' 
  | 'flowering' 
  | 'grain_fill' 
  | 'maturity';

export interface SoilHealthSnapshot {
  ph: number;
  organicMatter: number; // percentage
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  compaction: number; // 0-100
  biodiversity: number; // 0-100
  overallScore: number; // 0-100
}

export interface NutrientLevels {
  n: number; // Nitrogen kg/ha
  p: number; // Phosphorus kg/ha
  k: number; // Potassium kg/ha
  s: number; // Sulfur kg/ha
  micronutrients: Record<string, number>;
}

export type PestPressureLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe';
export type DiseaseRiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'epidemic';

export interface FieldOperation {
  id: string;
  type: string;
  timestamp: Date;
  operator?: string;
  equipment?: string;
  inputs?: Record<string, number>;
  results?: Record<string, any>;
  cost: number;
}

export interface WeatherForecast {
  date: Date;
  condition: string;
  temperature: { min: number; max: number };
  precipitation: number; // mm
  precipitationChance: number; // percentage
  humidity: number; // percentage
  windSpeed: number; // km/h
  soilTemperature: number;
}

export interface MarketConditions {
  commodityPrices: Record<string, CommodityPrice>;
  inputCosts: Record<string, number>;
  demandIndex: number; // 0-100
  supplyIndex: number; // 0-100
  trend: 'rising' | 'stable' | 'falling';
  volatility: number; // 0-100
}

export interface CommodityPrice {
  current: number;
  previous: number;
  change: number; // percentage
  forecast: number[];
}

export interface ResourceAvailability {
  equipment: EquipmentAvailability[];
  labor: LaborAvailability;
  inputs: InputInventory;
  cash: number;
  credit: number;
}

export interface EquipmentAvailability {
  id: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
  nextAvailable: Date;
  hourlyRate: number;
}

export interface LaborAvailability {
  totalWorkers: number;
  availableWorkers: number;
  hourlyRate: number;
  overtimeRate: number;
}

export interface InputInventory {
  seeds: Record<string, number>;
  fertilizers: Record<string, number>;
  chemicals: Record<string, number>;
  fuel: number;
}

export interface HistoricalContext {
  samePeriodLastYear: SeasonSnapshot;
  threeYearAverage: SeasonSnapshot;
  lastSimilarWeather: FieldOperation[];
  yieldHistory: YieldRecord[];
  decisionHistory: Decision[];
}

export interface SeasonSnapshot {
  yield: number;
  quality: number;
  costs: number;
  revenue: number;
  profit: number;
  weatherPattern: string;
}

export interface YieldRecord {
  year: number;
  crop: string;
  yield: number; // tons per hectare
  quality: number; // 0-100
  conditions: string;
}

// ============================================================================
// SENSOR SYSTEM TYPES
// ============================================================================

export type SensorType = 
  | 'soil_moisture' 
  | 'soil_temperature' 
  | 'air_temperature' 
  | 'humidity' 
  | 'rainfall' 
  | 'wind' 
  | 'solar_radiation' 
  | 'leaf_wetness' 
  | 'ndvi' 
  | 'thermal' 
  | 'equipment_telemetry' 
  | 'drone_imagery' 
  | 'weather_station';

export interface SensorData {
  id: string;
  sensorId: string;
  sensorType: SensorType;
  fieldId: string;
  timestamp: Date;
  location: { lat: number; lng: number };
  readings: SensorReading[];
  quality: DataQuality;
  metadata: SensorMetadata;
}

export interface SensorReading {
  metric: string;
  value: number;
  unit: string;
  depth?: number; // for soil sensors in cm
}

export interface DataQuality {
  score: number; // 0-100
  flags: DataQualityFlag[];
  confidence: number; // 0-100
  validated: boolean;
}

export type DataQualityFlag = 
  | 'outlier_detected' 
  | 'sensor_malfunction' 
  | 'battery_low' 
  | 'calibration_needed' 
  | 'transmission_error' 
  | 'stale_data';

export interface SensorMetadata {
  firmwareVersion: string;
  calibrationDate: Date;
  nextCalibration: Date;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface SensorSystemStatus {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  lowBatterySensors: number;
  calibrationDueSensors: number;
  lastSync: Date;
  syncLatency: number; // milliseconds
}

export interface SensorIngestionPayload {
  apiKey: string;
  farmId: string;
  batchId: string;
  timestamp: Date;
  readings: SensorData[];
}

export interface SensorIngestionResponse {
  success: boolean;
  batchId: string;
  processed: number;
  failed: number;
  errors: SensorError[];
  warnings: string[];
}

export interface SensorError {
  sensorId: string;
  error: string;
  data?: any;
}

// ============================================================================
// DIGITAL TWIN TYPES
// ============================================================================

export interface DigitalTwinState {
  lastSync: Date;
  syncStatus: SyncStatus;
  virtualFields: VirtualField[];
  driftReports: DriftReport[];
  calibrationStatus: CalibrationStatus;
  predictions: Prediction[];
}

export type SyncStatus = 'synced' | 'syncing' | 'out_of_sync' | 'error';

export interface VirtualField {
  fieldId: string;
  lastUpdated: Date;
  realState: FieldState;
  simulatedState: FieldState;
  divergence: number; // percentage difference
  confidence: number; // 0-100
  history: FieldStateSnapshot[];
}

export interface FieldStateSnapshot {
  timestamp: Date;
  realState: FieldState;
  simulatedState: FieldState;
  divergence: number;
}

export interface DriftReport {
  id: string;
  fieldId: string;
  detectedAt: Date;
  metric: string;
  expectedValue: number;
  actualValue: number;
  divergence: number; // percentage
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleCauses: string[];
  recommendedActions: string[];
  acknowledged: boolean;
}

export interface CalibrationStatus {
  lastCalibration: Date;
  nextCalibration: Date;
  parametersCalibrated: string[];
  accuracy: number; // 0-100
  modelVersion: string;
}

export interface Prediction {
  id: string;
  type: string;
  fieldId: string;
  metric: string;
  predictedValue: number;
  confidence: number;
  predictionWindow: { start: Date; end: Date };
  actualValue?: number;
  accuracy?: number;
  createdAt: Date;
}

// ============================================================================
// ACTION EXECUTION TYPES
// ============================================================================

export type ActionType = 
  | 'plant_crop' | 'apply_irrigation' | 'apply_fertilizer' 
  | 'apply_treatment' | 'harvest' | 'scout' | 'sell_product'
  | 'buy_inputs' | 'lease_equipment' | 'dispatch_equipment'
  | 'schedule_maintenance' | 'emergency_response';

export type ActionLifecycleStatus =
  | 'proposed'
  | 'approved'
  | 'dispatched'
  | 'acknowledged'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ActionControlMode = 'manual' | 'assisted' | 'autopilot';

export interface DecisionExecutionPolicy {
  controlMode: ActionControlMode;
  isHighRisk: boolean;
  requiresApproval: boolean;
  reasons: string[];
  evaluatedAt: Date;
}

export interface ActionRequest {
  decisionId: string;
  actionType: ActionType;
  fieldId?: string;
  parameters: Record<string, any>;
  requestedBy: string;
  scheduledTime?: Date;
  priority: DecisionPriority;
  controlMode?: ActionControlMode;
  requiresApproval?: boolean;
}

export interface ActionResult {
  id: string;
  decisionId: string;
  actionType: ActionType;
  status: ActionLifecycleStatus;
  requestedAt: Date;
  approvedAt?: Date;
  dispatchedAt?: Date;
  acknowledgedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  fieldId?: string;
  parameters: Record<string, any>;
  result?: any;
  cost: number;
  error?: string;
  operator?: string;
  equipment?: string;
  controlMode?: ActionControlMode;
  requiresApproval?: boolean;
  approvalRequiredReason?: string;
  approvedBy?: string;
  contingencyPolicy?: ActionContingencyPolicy;
  rollback?: ActionRollbackResult;
  overrideEvents?: ActionOverrideEvent[];
  lifecycleHistory: ActionLifecycleEntry[];
}

export interface ActionLifecycleEntry {
  status: ActionLifecycleStatus;
  timestamp: Date;
  note?: string;
}

export interface ActionContingencyPolicy {
  actionType: ActionType;
  rollbackEnabled: boolean;
  autoRollbackOnFailure: boolean;
  rollbackSteps: string[];
  contingencyActions: string[];
  escalationContactRole?: string;
}

export interface ActionRollbackResult {
  attempted: boolean;
  applied: boolean;
  stepResults: ActionRollbackStepResult[];
  summary: string;
  attemptedAt: Date;
}

export interface ActionRollbackStepResult {
  step: string;
  success: boolean;
  details?: string;
}

export interface ActionOverrideEvent {
  id: string;
  overriddenBy: string;
  overrideType: 'status_change' | 'force_cancel' | 'force_complete' | 'parameter_adjustment' | 'emergency_stop';
  note: string;
  at: Date;
  previousStatus: ActionLifecycleStatus;
  newStatus: ActionLifecycleStatus;
}

export interface OrchestratorSafetyState {
  emergencyStopActive: boolean;
  emergencyStopReason?: string;
  emergencyStopBy?: string;
  emergencyStopAt?: Date;
  lastReleaseAt?: Date;
}

export type OrchestratorAuditEntityType = 'decision' | 'action' | 'safety' | 'alert' | 'system' | 'incident' | 'policy';
export type OrchestratorAuditSeverity = 'info' | 'warning' | 'critical';
export type OrchestratorAuditActorType = 'user' | 'operator' | 'system' | 'api';
export type OrchestratorAuditEventType =
  | 'decision_created'
  | 'decision_approved'
  | 'decision_declined'
  | 'decision_approval_blocked'
  | 'action_created'
  | 'action_status_changed'
  | 'action_transition_invalid'
  | 'action_overridden'
  | 'safety_emergency_stop_activated'
  | 'safety_emergency_stop_released'
  | 'policy_guardrail_blocked'
  | 'policy_guardrail_warning'
  | 'incident_opened'
  | 'incident_updated'
  | 'incident_resolved'
  | 'signed_log_verification_failed'
  | 'alert_created'
  | 'system_state_changed';

export interface OrchestratorAuditActor {
  id: string;
  type: OrchestratorAuditActorType;
}

export interface OrchestratorAuditEvent {
  id: string;
  timestamp: Date;
  eventType: OrchestratorAuditEventType;
  severity: OrchestratorAuditSeverity;
  entityType: OrchestratorAuditEntityType;
  entityId?: string;
  actor?: OrchestratorAuditActor;
  message: string;
  metadata?: Record<string, any>;
  signature?: OrchestratorAuditSignature;
}

export interface OrchestratorAuditSignature {
  algorithm: 'HMAC-SHA256';
  keyId: string;
  signedAt: Date;
  payloadHash: string;
  previousHash: string | null;
  signature: string;
  chainHash: string;
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'acknowledged' | 'mitigating' | 'resolved' | 'closed';
export type IncidentSource = 'action' | 'safety' | 'policy' | 'system' | 'manual';

export interface OrchestratorIncidentTimelineEvent {
  at: Date;
  event: string;
  actorId?: string;
  note?: string;
}

export interface OrchestratorIncident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  relatedEntityType?: OrchestratorAuditEntityType;
  relatedEntityId?: string;
  recommendedActions: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  timeline: OrchestratorIncidentTimelineEvent[];
}

// ============================================================================
// FEEDBACK & LEARNING TYPES
// ============================================================================

export interface OutcomeMetrics {
  decisionId: string;
  actualCost: number;
  actualRevenue: number;
  actualROI: number;
  yield: number;
  quality: number;
  timeToComplete: number; // hours
  complications: string[];
  lessons: string[];
  satisfaction: number; // 0-100
  wouldRepeat: boolean;
}

export interface LearningRecord {
  id: string;
  decisionType: DecisionType;
  context: DecisionContext;
  recommendation: Recommendation;
  outcome: OutcomeMetrics;
  accuracy: number; // how accurate was the prediction
  createdAt: Date;
  incorporated: boolean;
}

export interface PerformanceMetrics {
  totalDecisions: number;
  approvedDecisions: number;
  declinedDecisions: number;
  autoExecutedDecisions: number;
  averageConfidence: number;
  averageROI: number;
  predictionAccuracy: number;
  systemUptime: number; // percentage
  lastUpdated: Date;
  trends: MetricTrend[];
}

export interface MetricTrend {
  metric: string;
  period: string;
  values: number[];
  trend: 'improving' | 'stable' | 'declining';
  change: number; // percentage
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  fieldId?: string;
  timestamp: Date;
  expiresAt: Date;
  acknowledged: boolean;
  actions: AlertAction[];
}

export type AlertType = 
  | 'weather_warning' | 'pest_outbreak' | 'disease_risk' 
  | 'irrigation_needed' | 'harvest_window' | 'market_opportunity'
  | 'equipment_failure' | 'sensor_offline' | 'twin_drift'
  | 'financial_alert' | 'compliance_reminder';

export interface AlertAction {
  label: string;
  action: string;
  parameters?: Record<string, any>;
}

// ============================================================================
// EVENT SYSTEM TYPES
// ============================================================================

export interface GameEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical' | 'catastrophic';
  title: string;
  description: string;
  affectedFields: string[];
  duration: number; // hours
  effects: EventEffect[];
  mitigations: MitigationOption[];
  resolved: boolean;
  resolvedAt?: Date;
}

export type EventType = 
  | 'weather_event' | 'market_shock' | 'equipment_failure' 
  | 'pest_outbreak' | 'disease_epidemic' | 'supply_shortage'
  | 'price_spike' | 'regulatory_change' | 'labor_shortage';

export interface EventEffect {
  target: string;
  metric: string;
  change: number; // percentage
  duration: number; // hours
}

export interface MitigationOption {
  action: string;
  cost: number;
  effectiveness: number; // 0-100
  timeToImplement: number; // hours
}

// ============================================================================
// API TYPES
// ============================================================================

export interface OrchestratorAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface DecisionApprovalRequest {
  decisionId: string;
  approved: boolean;
  modifiedParameters?: Record<string, any>;
  reason?: string;
  approvedBy: string;
}

export interface SensorDataRequest {
  farmId: string;
  fieldId?: string;
  sensorTypes?: SensorType[];
  startTime?: Date;
  endTime?: Date;
}

export interface TwinSyncRequest {
  fieldId?: string;
  forceFullSync?: boolean;
  recalibrateModels?: boolean;
}
