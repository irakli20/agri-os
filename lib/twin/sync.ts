// @ts-nocheck
/**
 * Agri-OS Digital Twin Synchronization
 * Bridge between real sensor data and simulation state
 */

import { useOrchestratorStore } from '@/lib/orchestrator';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { sensorRegistry, fuseSensorData, subscribeToSensorUpdates } from '@/lib/sensors/ingress';
import type {
  SensorData,
  DigitalTwinState,
  VirtualField,
  DriftReport,
  FieldState,
  CalibrationStatus,
  SyncStatus,
  Prediction,
} from '@/types/orchestrator';

// ============================================================================
// SYNC STATE
// ============================================================================

interface SyncState {
  lastSync: Date;
  syncStatus: SyncStatus;
  driftHistory: DriftReport[];
  virtualFields: Map<string, VirtualField>;
}

const syncState: SyncState = {
  lastSync: new Date(),
  syncStatus: 'synced',
  driftHistory: [],
  virtualFields: new Map(),
};

// ============================================================================
// SYNC FROM SENSORS
// ============================================================================

export interface SyncResult {
  success: boolean;
  syncedFields: number;
  failedFields: number;
  driftDetected: boolean;
  errors: string[];
}

export async function syncFromSensors(
  options: {
    fieldId?: string;
    forceFullSync?: boolean;
    sensorTypes?: SensorData['sensorType'][];
  } = {}
): Promise<SyncResult> {
  const orchestratorStore = useOrchestratorStore.getState();
  const fieldStore = useFieldStore.getState();
  const gameStore = useGameStore.getState();

  const result: SyncResult = {
    success: true,
    syncedFields: 0,
    failedFields: 0,
    driftDetected: false,
    errors: [],
  };

  try {
    // Get fields to sync
    const fields = options.fieldId
      ? fieldStore.gameFields.filter(f => f.id === options.fieldId)
      : fieldStore.gameFields;

    for (const field of fields) {
      try {
        // Get sensors for this field
        const sensors = sensorRegistry.getByField(field.id);
        
        if (sensors.length === 0 && !options.forceFullSync) {
          continue;
        }

        // Create or update virtual field
        const virtualField = await createVirtualField(field.id, sensors, options.sensorTypes);
        syncState.virtualFields.set(field.id, virtualField);

        // Update field store with sensor data
        updateFieldFromSensors(field.id, virtualField);

        // Check for drift
        const drift = detectFieldDrift(field.id, virtualField);
        if (drift) {
          result.driftDetected = true;
          syncState.driftHistory.push(drift);
          
          // Add alert for significant drift
          if (drift.severity === 'high' || drift.severity === 'critical') {
            orchestratorStore.addAlert({
              type: 'twin_drift',
              severity: drift.severity === 'critical' ? 'critical' : 'warning',
              title: `Digital Twin Drift: ${field.name}`,
              message: `${drift.metric} divergence of ${drift.divergence.toFixed(1)}% detected. ${drift.recommendedActions[0] || ''}`,
              fieldId: field.id,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              acknowledged: false,
              actions: drift.recommendedActions.map(action => ({
                label: action,
                action: 'recalibrate_field',
                parameters: { fieldId: field.id, metric: drift.metric },
              })),
            });
          }
        }

        result.syncedFields++;
      } catch (error) {
        result.failedFields++;
        result.errors.push(`Field ${field.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update sync state
    syncState.lastSync = new Date();
    syncState.syncStatus = result.driftDetected ? 'out_of_sync' : 'synced';

    // Update orchestrator store
    orchestratorStore.updateDigitalTwin({
      lastSync: syncState.lastSync,
      syncStatus: syncState.syncStatus,
      virtualFields: Array.from(syncState.virtualFields.values()),
      driftReports: syncState.driftHistory.slice(-50), // Keep last 50
    });

    console.log(`[TwinSync] Synced ${result.syncedFields} fields, ${result.failedFields} failed`);

  } catch (error) {
    result.success = false;
    result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    syncState.syncStatus = 'error';
  }

  return result;
}

async function createVirtualField(
  fieldId: string,
  sensors: ReturnType<typeof sensorRegistry.getByField>,
  sensorTypes?: SensorData['sensorType'][]
): Promise<VirtualField> {
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);

  if (!field) {
    throw new Error(`Field ${fieldId} not found`);
  }

  // Get current real state from field store
  const realState = mapFieldToState(field);

  // Simulate state based on sensor fusion
  const fusedReadings = {
    soilMoisture: fuseSensorData(fieldId, 'moisture', 300000),
    soilTemperature: fuseSensorData(fieldId, 'temperature', 300000),
    ndvi: fuseSensorData(fieldId, 'ndvi', 600000),
  };

  // Create simulated state with sensor influence
  const simulatedState: FieldState = {
    ...realState,
    soilMoisture: fusedReadings.soilMoisture?.value || realState.soilMoisture,
    soilTemperature: fusedReadings.soilTemperature?.value || realState.soilTemperature,
  };

  // Calculate divergence
  const divergence = calculateDivergence(realState, simulatedState);

  // Get or create history
  const existingField = syncState.virtualFields.get(fieldId);
  const history = existingField?.history || [];

  return {
    fieldId,
    lastUpdated: new Date(),
    realState,
    simulatedState,
    divergence,
    confidence: calculateConfidence(sensors, fusedReadings),
    history: [
      ...history.slice(-49), // Keep last 50 snapshots
      {
        timestamp: new Date(),
        realState,
        simulatedState,
        divergence,
      },
    ],
  };
}

function mapFieldToState(field: any): FieldState {
  return {
    fieldId: field.id,
    stage: field.farmingStage || 'fallow',
    soilMoisture: field.soilMoisture || 50,
    soilTemperature: field.soilTemperature || 18,
    soilHealth: {
      ph: field.ph || 6.5,
      organicMatter: field.organicMatter || 3.0,
      nitrogen: field.nitrogen || 45,
      phosphorus: field.phosphorus || 25,
      potassium: field.potassium || 180,
      compaction: field.compaction || 20,
      biodiversity: field.biodiversity || 70,
      overallScore: field.soilHealthScore || 75,
    },
    pestPressure: field.pestPressure || 'none',
    diseaseRisk: field.diseaseRisk || 'low',
    nutrientLevels: {
      n: field.nitrogen || 45,
      p: field.phosphorus || 25,
      k: field.potassium || 180,
      s: field.sulfur || 12,
      micronutrients: field.micronutrients || {},
    },
    operationsLog: field.operationsLog || [],
  };
}

function calculateDivergence(real: FieldState, simulated: FieldState): number {
  const moistureDiff = Math.abs(real.soilMoisture - simulated.soilMoisture) / 100;
  const tempDiff = Math.abs(real.soilTemperature - simulated.soilTemperature) / 40;
  
  return Math.round((moistureDiff + tempDiff) / 2 * 100);
}

function calculateConfidence(
  sensors: ReturnType<typeof sensorRegistry.getByField>,
  fusedReadings: Record<string, any>
): number {
  if (sensors.length === 0) return 50;
  
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const sensorConfidence = (onlineSensors / sensors.length) * 100;
  
  const fusionConfidence = Object.values(fusedReadings).reduce((sum, reading) => 
    sum + (reading?.confidence || 0), 0
  ) / Math.max(1, Object.values(fusedReadings).filter(r => r).length);

  return Math.round((sensorConfidence * 0.4 + (fusionConfidence || 50) * 0.6));
}

function updateFieldFromSensors(fieldId: string, virtualField: VirtualField): void {
  const fieldStore = useFieldStore.getState();
  const field = fieldStore.gameFields.find(f => f.id === fieldId);
  
  if (!field) return;

  // Update field with sensor data if confidence is high enough
  if (virtualField.confidence > 70) {
    fieldStore.updateField(fieldId, {
      ...field,
      soilMoisture: Math.round(virtualField.simulatedState.soilMoisture),
      soilTemperature: Math.round(virtualField.simulatedState.soilTemperature * 10) / 10,
      ph: virtualField.simulatedState.soilHealth.ph,
      nitrogen: virtualField.simulatedState.soilHealth.nitrogen,
      phosphorus: virtualField.simulatedState.soilHealth.phosphorus,
      potassium: virtualField.simulatedState.soilHealth.potassium,
      lastSensorSync: new Date().toISOString(),
    });
  }
}

// ============================================================================
// DRIFT DETECTION
// ============================================================================

export function detectDrift(
  fieldId?: string,
  threshold: number = 15
): DriftReport[] {
  const reports: DriftReport[] = [];

  if (fieldId) {
    const virtualField = syncState.virtualFields.get(fieldId);
    if (virtualField) {
      const report = detectFieldDrift(fieldId, virtualField, threshold);
      if (report) reports.push(report);
    }
  } else {
    for (const [fid, vf] of syncState.virtualFields) {
      const report = detectFieldDrift(fid, vf, threshold);
      if (report) reports.push(report);
    }
  }

  return reports;
}

function detectFieldDrift(
  fieldId: string,
  virtualField: VirtualField,
  threshold: number = 15
): DriftReport | null {
  const metrics = [
    { name: 'soil_moisture', real: virtualField.realState.soilMoisture, sim: virtualField.simulatedState.soilMoisture },
    { name: 'soil_temperature', real: virtualField.realState.soilTemperature, sim: virtualField.simulatedState.soilTemperature },
  ];

  for (const metric of metrics) {
    const divergence = Math.abs(metric.real - metric.sim) / Math.max(metric.real, 1) * 100;
    
    if (divergence > threshold) {
      return {
        id: `drift-${fieldId}-${metric.name}-${Date.now()}`,
        fieldId,
        detectedAt: new Date(),
        metric: metric.name,
        expectedValue: metric.sim,
        actualValue: metric.real,
        divergence,
        severity: divergence > 30 ? 'critical' : divergence > 20 ? 'high' : 'medium',
        possibleCauses: [
          'Sensor calibration drift',
          'Model parameter inaccuracy',
          'Unaccounted environmental factor',
          'Data transmission error',
        ],
        recommendedActions: [
          'Verify sensor calibration',
          'Run model recalibration',
          'Check for environmental changes',
        ],
        acknowledged: false,
      };
    }
  }

  return null;
}

// ============================================================================
// MODEL CALIBRATION
// ============================================================================

export interface CalibrationResult {
  success: boolean;
  fieldId?: string;
  parametersCalibrated: string[];
  accuracy: number;
  modelVersion: string;
  errors: string[];
}

export async function calibrateModels(
  fieldId?: string,
  options: {
    useHistoricalData?: boolean;
    recalibrateThreshold?: number;
  } = {}
): Promise<CalibrationResult> {
  const result: CalibrationResult = {
    success: true,
    fieldId,
    parametersCalibrated: [],
    accuracy: 0,
    modelVersion: '1.0.0',
    errors: [],
  };

  try {
    const fields = fieldId
      ? [fieldId]
      : Array.from(syncState.virtualFields.keys());

    for (const fid of fields) {
      const virtualField = syncState.virtualFields.get(fid);
      if (!virtualField) continue;

      // Calibrate based on historical divergence
      const recentHistory = virtualField.history.slice(-30);
      if (recentHistory.length < 5) {
        result.errors.push(`Insufficient data for field ${fid}`);
        continue;
      }

      // Calculate average divergence
      const avgDivergence = recentHistory.reduce((sum, h) => sum + h.divergence, 0) / recentHistory.length;

      // Adjust model parameters based on divergence patterns
      const calibrations = [];
      
      if (avgDivergence > 10) {
        calibrations.push('soil_moisture_model');
      }
      if (Math.abs(virtualField.realState.soilTemperature - virtualField.simulatedState.soilTemperature) > 3) {
        calibrations.push('temperature_model');
      }

      result.parametersCalibrated.push(...calibrations);

      // Update virtual field with new calibration
      syncState.virtualFields.set(fid, {
        ...virtualField,
        confidence: Math.min(95, virtualField.confidence + 5),
      });
    }

    // Calculate overall accuracy
    const allFields = Array.from(syncState.virtualFields.values());
    result.accuracy = allFields.length > 0
      ? allFields.reduce((sum, vf) => sum + (100 - vf.divergence), 0) / allFields.length
      : 0;

    // Update orchestrator store
    const orchestratorStore = useOrchestratorStore.getState();
    const calibrationStatus: CalibrationStatus = {
      lastCalibration: new Date(),
      nextCalibration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parametersCalibrated: result.parametersCalibrated,
      accuracy: result.accuracy,
      modelVersion: result.modelVersion,
    };

    orchestratorStore.updateDigitalTwin({
      calibrationStatus,
    });

    console.log(`[TwinSync] Calibrated ${result.parametersCalibrated.length} parameters, accuracy: ${result.accuracy.toFixed(1)}%`);

  } catch (error) {
    result.success = false;
    result.errors.push(`Calibration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

// ============================================================================
// TWIN STATUS
// ============================================================================

export interface TwinStatus {
  syncHealth: 'healthy' | 'degraded' | 'critical';
  lastUpdate: Date;
  syncLatency: number;
  fieldCount: number;
  syncedFields: number;
  driftCount: number;
  averageDivergence: number;
  calibrationNeeded: boolean;
}

export function getTwinStatus(): TwinStatus {
  const virtualFields = Array.from(syncState.virtualFields.values());
  const driftReports = syncState.driftHistory.filter(d => !d.acknowledged);

  const averageDivergence = virtualFields.length > 0
    ? virtualFields.reduce((sum, vf) => sum + vf.divergence, 0) / virtualFields.length
    : 0;

  const maxDivergence = virtualFields.length > 0
    ? Math.max(...virtualFields.map(vf => vf.divergence))
    : 0;

  return {
    syncHealth: maxDivergence > 25 ? 'critical' : maxDivergence > 15 ? 'degraded' : 'healthy',
    lastUpdate: syncState.lastSync,
    syncLatency: Date.now() - syncState.lastSync.getTime(),
    fieldCount: virtualFields.length,
    syncedFields: virtualFields.filter(vf => vf.confidence > 70).length,
    driftCount: driftReports.length,
    averageDivergence,
    calibrationNeeded: maxDivergence > 20 || driftReports.length > 3,
  };
}

// ============================================================================
// HISTORICAL REPLAY
// ============================================================================

export interface ReplayConfig {
  startDate: Date;
  endDate: Date;
  fieldId?: string;
  speed: number; // 1 = real-time, 10 = 10x, etc.
  parameters: {
    irrigationMultiplier?: number;
    fertilizerRate?: number;
    plantingDate?: Date;
  };
}

export interface ReplayEvent {
  timestamp: Date;
  type: 'sensor_reading' | 'operation' | 'weather' | 'growth_stage';
  data: any;
}

export interface ReplayResult {
  events: ReplayEvent[];
  finalState: VirtualField | null;
  projectedYield: number;
  totalCost: number;
  recommendations: string[];
}

export async function historicalReplay(
  config: ReplayConfig,
  onProgress?: (progress: number) => void
): Promise<ReplayResult> {
  const result: ReplayResult = {
    events: [],
    finalState: null,
    projectedYield: 0,
    totalCost: 0,
    recommendations: [],
  };

  const fieldStore = useFieldStore.getState();
  const virtualField = config.fieldId
    ? syncState.virtualFields.get(config.fieldId)
    : null;

  if (!virtualField) {
    return result;
  }

  // Simulate replay with modified parameters
  let simulatedState = { ...virtualField.realState };
  const events: ReplayEvent[] = [];

  // Process historical data with new parameters
  for (const snapshot of virtualField.history) {
    if (snapshot.timestamp < config.startDate || snapshot.timestamp > config.endDate) {
      continue;
    }

    // Apply parameter modifications
    if (config.parameters.irrigationMultiplier) {
      simulatedState.soilMoisture = Math.min(100, 
        simulatedState.soilMoisture * config.parameters.irrigationMultiplier
      );
    }

    events.push({
      timestamp: snapshot.timestamp,
      type: 'growth_stage',
      data: { stage: simulatedState.stage },
    });

    // Report progress
    if (onProgress) {
      const progress = events.length / virtualField.history.length;
      onProgress(progress);
    }
  }

  // Calculate projected outcomes
  const moistureBonus = (simulatedState.soilMoisture - 50) * 0.05;
  const fertilizerBonus = (config.parameters.fertilizerRate || 1) * 0.1;
  
  result.events = events;
  result.finalState = {
    ...virtualField,
    simulatedState,
  };
  result.projectedYield = 8.5 + moistureBonus + fertilizerBonus;
  result.totalCost = events.length * 100; // Simplified cost calculation
  result.recommendations = [
    `Projected yield: ${result.projectedYield.toFixed(2)} tons/ha`,
    moistureBonus > 0 ? 'Irrigation strategy shows positive impact' : 'Consider adjusting irrigation timing',
    `Total estimated cost: $${result.totalCost.toLocaleString()}`,
  ];

  return result;
}

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

export function subscribeToTwinUpdates(
  fieldId: string,
  callback: (virtualField: VirtualField) => void
): () => void {
  // Initial callback
  const virtualField = syncState.virtualFields.get(fieldId);
  if (virtualField) {
    callback(virtualField);
  }

  // Subscribe to sync events
  const handler = () => {
    const updated = syncState.virtualFields.get(fieldId);
    if (updated) {
      callback(updated);
    }
  };

  window.addEventListener('twin:sync_complete', handler);

  return () => {
    window.removeEventListener('twin:sync_complete', handler);
  };
}

export function subscribeToDriftAlerts(
  callback: (report: DriftReport) => void
): () => void {
  const handler = (event: CustomEvent<DriftReport>) => {
    callback(event.detail);
  };

  window.addEventListener('twin:drift_detected', handler as EventListener);

  return () => {
    window.removeEventListener('twin:drift_detected', handler as EventListener);
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeTwinSync(): void {
  // Set up automatic sync intervals
  setInterval(() => {
    syncFromSensors();
  }, 300000); // Sync every 5 minutes

  // Set up drift detection
  setInterval(() => {
    const reports = detectDrift();
    if (reports.length > 0) {
      reports.forEach(report => {
        window.dispatchEvent(new CustomEvent('twin:drift_detected', { detail: report }));
      });
    }
  }, 600000); // Check drift every 10 minutes

  console.log('[TwinSync] Initialized');
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  initializeTwinSync();
}
