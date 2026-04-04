// @ts-nocheck
/**
 * Agri-OS Sensor Integration Layer
 * Bridge between real hardware and simulation
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  SensorData,
  SensorType,
  SensorReading,
  DataQuality,
  DataQualityFlag,
  SensorIngestionPayload,
  SensorIngestionResponse,
  SensorError,
  SensorMetadata,
} from '@/types/orchestrator';
import { useOrchestratorStore } from '../orchestrator';

// ============================================================================
// SENSOR REGISTRY
// ============================================================================

interface RegisteredSensor {
  id: string;
  type: SensorType;
  fieldId: string;
  location: { lat: number; lng: number };
  depth?: number; // for soil sensors
  installedAt: Date;
  lastReading?: Date;
  metadata: SensorMetadata;
  status: 'online' | 'offline' | 'maintenance' | 'error';
}

class SensorRegistry {
  private sensors: Map<string, RegisteredSensor> = new Map();

  register(sensor: Omit<RegisteredSensor, 'installedAt' | 'status'>): RegisteredSensor {
    const newSensor: RegisteredSensor = {
      ...sensor,
      installedAt: new Date(),
      status: 'online',
    };
    this.sensors.set(sensor.id, newSensor);
    return newSensor;
  }

  unregister(sensorId: string): boolean {
    return this.sensors.delete(sensorId);
  }

  get(sensorId: string): RegisteredSensor | undefined {
    return this.sensors.get(sensorId);
  }

  getByField(fieldId: string): RegisteredSensor[] {
    return Array.from(this.sensors.values()).filter(s => s.fieldId === fieldId);
  }

  getByType(type: SensorType): RegisteredSensor[] {
    return Array.from(this.sensors.values()).filter(s => s.type === type);
  }

  getAll(): RegisteredSensor[] {
    return Array.from(this.sensors.values());
  }

  updateStatus(sensorId: string, status: RegisteredSensor['status']): void {
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      sensor.status = status;
    }
  }

  updateLastReading(sensorId: string): void {
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      sensor.lastReading = new Date();
    }
  }
}

export const sensorRegistry = new SensorRegistry();

// ============================================================================
// DATA VALIDATION & SMOOTHING
// ============================================================================

interface ValidationRule {
  metric: string;
  min?: number;
  max?: number;
  maxChange?: number; // max change from previous reading
  required?: boolean;
}

const VALIDATION_RULES: Record<SensorType, ValidationRule[]> = {
  soil_moisture: [
    { metric: 'moisture', min: 0, max: 100, maxChange: 30 },
    { metric: 'temperature', min: -10, max: 60 },
  ],
  soil_temperature: [
    { metric: 'temperature', min: -10, max: 60, maxChange: 10 },
  ],
  air_temperature: [
    { metric: 'temperature', min: -40, max: 60, maxChange: 15 },
  ],
  humidity: [
    { metric: 'humidity', min: 0, max: 100, maxChange: 40 },
  ],
  rainfall: [
    { metric: 'precipitation', min: 0, max: 500, maxChange: 100 },
  ],
  wind: [
    { metric: 'speed', min: 0, max: 200, maxChange: 50 },
    { metric: 'direction', min: 0, max: 360 },
  ],
  solar_radiation: [
    { metric: 'radiation', min: 0, max: 1500, maxChange: 500 },
  ],
  leaf_wetness: [
    { metric: 'wetness', min: 0, max: 100 },
  ],
  ndvi: [
    { metric: 'ndvi', min: -1, max: 1 },
  ],
  thermal: [
    { metric: 'temperature', min: -20, max: 80 },
  ],
  equipment_telemetry: [
    { metric: 'fuel', min: 0, max: 100 },
    { metric: 'engine_temp', min: 0, max: 150 },
  ],
  drone_imagery: [
    { metric: 'altitude', min: 0, max: 500 },
  ],
  weather_station: [
    { metric: 'temperature', min: -40, max: 60 },
    { metric: 'humidity', min: 0, max: 100 },
    { metric: 'pressure', min: 800, max: 1100 },
    { metric: 'wind_speed', min: 0, max: 200 },
  ],
};

// Store recent readings for smoothing
const readingHistory: Map<string, SensorReading[]> = new Map();
const MAX_HISTORY = 10;

function validateReading(
  reading: SensorReading,
  sensorType: SensorType,
  previousReadings: SensorReading[]
): { valid: boolean; flags: DataQualityFlag[] } {
  const flags: DataQualityFlag[] = [];
  const rules = VALIDATION_RULES[sensorType] || [];
  const rule = rules.find(r => r.metric === reading.metric);

  if (!rule) {
    return { valid: true, flags: [] };
  }

  // Range validation
  if (rule.min !== undefined && reading.value < rule.min) {
    flags.push('outlier_detected');
  }
  if (rule.max !== undefined && reading.value > rule.max) {
    flags.push('outlier_detected');
  }

  // Change rate validation
  if (rule.maxChange && previousReadings.length > 0) {
    const previous = previousReadings[previousReadings.length - 1];
    if (previous.metric === reading.metric) {
      const change = Math.abs(reading.value - previous.value);
      if (change > rule.maxChange) {
        flags.push('outlier_detected');
      }
    }
  }

  return { valid: flags.length === 0, flags };
}

function smoothReading(
  reading: SensorReading,
  sensorId: string,
  windowSize: number = 3
): SensorReading {
  const history = readingHistory.get(sensorId) || [];
  const sameMetric = history.filter(r => r.metric === reading.metric);
  
  if (sameMetric.length < windowSize - 1) {
    return reading;
  }

  const recent = sameMetric.slice(-(windowSize - 1));
  const sum = recent.reduce((acc, r) => acc + r.value, 0) + reading.value;
  const smoothed = sum / (recent.length + 1);

  return {
    ...reading,
    value: Math.round(smoothed * 1000) / 1000, // 3 decimal precision
  };
}

function calculateDataQuality(
  readings: SensorReading[],
  flags: DataQualityFlag[],
  sensorMetadata: SensorMetadata
): DataQuality {
  let score = 100;

  // Reduce score for quality flags
  score -= flags.length * 10;

  // Reduce score for stale calibration
  const daysSinceCalibration = (Date.now() - new Date(sensorMetadata.calibrationDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCalibration > 180) {
    score -= 20;
    flags.push('calibration_needed');
  }

  // Reduce score for low battery
  if (sensorMetadata.batteryLevel !== undefined && sensorMetadata.batteryLevel < 20) {
    score -= 15;
    flags.push('battery_low');
  }

  return {
    score: Math.max(0, score),
    flags,
    confidence: Math.max(0, score - flags.length * 5),
    validated: flags.length === 0,
  };
}

// ============================================================================
// SENSOR FUSION
// ============================================================================

interface FusedReading {
  metric: string;
  value: number;
  unit: string;
  sources: string[];
  confidence: number;
  timestamp: Date;
}

export function fuseSensorData(
  fieldId: string,
  metric: string,
  timeWindow: number = 300000 // 5 minutes
): FusedReading | null {
  const sensors = sensorRegistry.getByField(fieldId);
  const relevantReadings: { sensorId: string; reading: SensorReading; quality: number }[] = [];

  const now = Date.now();

  for (const sensor of sensors) {
    const history = readingHistory.get(sensor.id) || [];
    const recent = history.filter(
      r => r.metric === metric && now - new Date(r.timestamp || now).getTime() < timeWindow
    );

    for (const reading of recent) {
      const quality = sensor.metadata.batteryLevel || 100;
      relevantReadings.push({ sensorId: sensor.id, reading, quality });
    }
  }

  if (relevantReadings.length === 0) {
    return null;
  }

  // Weighted average based on data quality
  const totalWeight = relevantReadings.reduce((sum, r) => sum + r.quality, 0);
  const weightedSum = relevantReadings.reduce(
    (sum, r) => sum + r.reading.value * r.quality,
    0
  );

  return {
    metric,
    value: weightedSum / totalWeight,
    unit: relevantReadings[0].reading.unit,
    sources: relevantReadings.map(r => r.sensorId),
    confidence: totalWeight / relevantReadings.length,
    timestamp: new Date(),
  };
}

// ============================================================================
// INGRESS API
// ============================================================================

export class SensorIngressAPI {
  private apiKey: string | null = null;
  private farmId: string | null = null;

  configure(apiKey: string, farmId: string): void {
    this.apiKey = apiKey;
    this.farmId = farmId;
  }

  async ingest(payload: SensorIngestionPayload): Promise<SensorIngestionResponse> {
    const errors: SensorError[] = [];
    const warnings: string[] = [];
    let processed = 0;

    // Validate API key
    if (payload.apiKey !== this.apiKey) {
      return {
        success: false,
        batchId: payload.batchId,
        processed: 0,
        failed: payload.readings.length,
        errors: [{ sensorId: 'auth', error: 'Invalid API key' }],
        warnings: [],
      };
    }

    for (const reading of payload.readings) {
      try {
        const result = await this.processReading(reading);
        if (result.success) {
          processed++;
        } else {
          errors.push({ sensorId: reading.sensorId, error: result.error });
        }
      } catch (error) {
        errors.push({
          sensorId: reading.sensorId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Update orchestrator sensor status
    const sensorIds = new Set(payload.readings.map(r => r.sensorId));
    const onlineSensors = Array.from(sensorIds).filter(
      id => !errors.some(e => e.sensorId === id)
    ).length;

    useOrchestratorStore.getState().updateSensorStatus({
      totalSensors: sensorRegistry.getAll().length,
      onlineSensors,
      offlineSensors: sensorRegistry.getAll().length - onlineSensors,
      lastSync: new Date(),
    });

    return {
      success: errors.length === 0,
      batchId: payload.batchId,
      processed,
      failed: payload.readings.length - processed,
      errors,
      warnings,
    };
  }

  private async processReading(data: SensorData): Promise<{ success: boolean; error?: string }> {
    // Get or register sensor
    let sensor = sensorRegistry.get(data.sensorId);
    if (!sensor) {
      sensor = sensorRegistry.register({
        id: data.sensorId,
        type: data.sensorType,
        fieldId: data.fieldId,
        location: data.location,
        depth: data.readings[0]?.depth,
        metadata: data.metadata,
      });
    }

    // Get previous readings for this sensor
    const history = readingHistory.get(data.sensorId) || [];

    // Validate and smooth each reading
    const processedReadings: SensorReading[] = [];
    const allFlags: DataQualityFlag[] = [];

    for (const reading of data.readings) {
      // Validate
      const validation = validateReading(reading, data.sensorType, history);
      allFlags.push(...validation.flags);

      // Smooth (even if flagged, we still process)
      const smoothed = smoothReading(reading, data.sensorId);
      processedReadings.push(smoothed);

      // Update history
      history.push({ ...smoothed, timestamp: data.timestamp });
    }

    // Trim history
    if (history.length > MAX_HISTORY) {
      readingHistory.set(data.sensorId, history.slice(-MAX_HISTORY));
    } else {
      readingHistory.set(data.sensorId, history);
    }

    // Calculate quality
    const quality = calculateDataQuality(processedReadings, [...new Set(allFlags)], data.metadata);

    // Update sensor status
    if (quality.flags.includes('sensor_malfunction')) {
      sensorRegistry.updateStatus(data.sensorId, 'error');
    } else {
      sensorRegistry.updateLastReading(data.sensorId);
    }

    // Create processed sensor data
    const processedData: SensorData = {
      ...data,
      readings: processedReadings,
      quality,
    };

    // Emit event for other systems
    window.dispatchEvent(new CustomEvent('sensor:data_received', {
      detail: processedData,
    }));

    return { success: true };
  }

  // Simulate receiving data from various sensor types
  simulateReading(
    sensorType: SensorType,
    fieldId: string,
    overrides?: Partial<SensorData>
  ): SensorData {
    const baseReadings: Record<SensorType, SensorReading[]> = {
      soil_moisture: [
        { metric: 'moisture', value: 35 + Math.random() * 30, unit: '%', depth: 10 },
        { metric: 'moisture', value: 40 + Math.random() * 25, unit: '%', depth: 30 },
        { metric: 'temperature', value: 15 + Math.random() * 10, unit: '°C', depth: 10 },
      ],
      soil_temperature: [
        { metric: 'temperature', value: 15 + Math.random() * 10, unit: '°C', depth: 10 },
      ],
      air_temperature: [
        { metric: 'temperature', value: 20 + Math.random() * 15, unit: '°C' },
      ],
      humidity: [
        { metric: 'humidity', value: 40 + Math.random() * 40, unit: '%' },
      ],
      rainfall: [
        { metric: 'precipitation', value: Math.random() * 10, unit: 'mm' },
        { metric: 'intensity', value: Math.random() * 5, unit: 'mm/h' },
      ],
      wind: [
        { metric: 'speed', value: 5 + Math.random() * 20, unit: 'km/h' },
        { metric: 'direction', value: Math.random() * 360, unit: '°' },
        { metric: 'gust', value: 10 + Math.random() * 30, unit: 'km/h' },
      ],
      solar_radiation: [
        { metric: 'radiation', value: 200 + Math.random() * 800, unit: 'W/m²' },
      ],
      leaf_wetness: [
        { metric: 'wetness', value: Math.random() * 100, unit: '%' },
      ],
      ndvi: [
        { metric: 'ndvi', value: 0.3 + Math.random() * 0.5, unit: 'index' },
        { metric: 'ndre', value: 0.2 + Math.random() * 0.4, unit: 'index' },
      ],
      thermal: [
        { metric: 'temperature', value: 18 + Math.random() * 12, unit: '°C' },
      ],
      equipment_telemetry: [
        { metric: 'fuel', value: 20 + Math.random() * 60, unit: '%' },
        { metric: 'engine_temp', value: 80 + Math.random() * 20, unit: '°C' },
        { metric: 'rpm', value: 1000 + Math.random() * 1500, unit: 'rpm' },
      ],
      drone_imagery: [
        { metric: 'altitude', value: 50 + Math.random() * 100, unit: 'm' },
        { metric: 'battery', value: 40 + Math.random() * 50, unit: '%' },
      ],
      weather_station: [
        { metric: 'temperature', value: 20 + Math.random() * 15, unit: '°C' },
        { metric: 'humidity', value: 40 + Math.random() * 40, unit: '%' },
        { metric: 'pressure', value: 1013 + Math.random() * 20, unit: 'hPa' },
        { metric: 'wind_speed', value: 5 + Math.random() * 20, unit: 'km/h' },
        { metric: 'wind_direction', value: Math.random() * 360, unit: '°' },
      ],
    };

    const sensorId = overrides?.sensorId || `sim-${sensorType}-${uuidv4().slice(0, 8)}`;

    return {
      id: uuidv4(),
      sensorId,
      sensorType,
      fieldId,
      timestamp: new Date(),
      location: overrides?.location || { lat: 52.0 + Math.random() * 0.1, lng: 5.0 + Math.random() * 0.1 },
      readings: overrides?.readings || baseReadings[sensorType],
      quality: {
        score: 85 + Math.random() * 15,
        flags: [],
        confidence: 90,
        validated: true,
      },
      metadata: overrides?.metadata || {
        firmwareVersion: '1.0.0',
        calibrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextCalibration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        batteryLevel: 60 + Math.random() * 40,
        signalStrength: -70 + Math.random() * 20,
      },
    };
  }
}

export const sensorIngress = new SensorIngressAPI();

// ============================================================================
// WEBSOCKET SIMULATION
// ============================================================================

export class SensorWebSocket {
  private connected = false;
  private reconnectInterval = 5000;
  private listeners: ((data: SensorData) => void)[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;

  connect(): void {
    this.connected = true;
    console.log('[SensorWebSocket] Connected');
    this.startSimulation();
  }

  disconnect(): void {
    this.connected = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    console.log('[SensorWebSocket] Disconnected');
  }

  onMessage(callback: (data: SensorData) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private startSimulation(): void {
    // Simulate incoming sensor data every 30 seconds
    this.simulationInterval = setInterval(() => {
      if (!this.connected) return;

      const sensorTypes: SensorType[] = [
        'soil_moisture',
        'air_temperature',
        'humidity',
        'wind',
        'ndvi',
      ];

      const randomType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
      const data = sensorIngress.simulateReading(randomType, 'field-1');

      // Process the data
      sensorIngress.ingest({
        apiKey: 'simulation',
        farmId: 'farm-1',
        batchId: uuidv4(),
        timestamp: new Date(),
        readings: [data],
      });

      // Notify listeners
      this.listeners.forEach(listener => listener(data));
    }, 30000);
  }
}

export const sensorWebSocket = new SensorWebSocket();

// ============================================================================
// REAL-TIME UPDATES
// ============================================================================

export function subscribeToSensorUpdates(
  fieldId: string,
  callback: (data: SensorData) => void
): () => void {
  const handler = (event: CustomEvent<SensorData>) => {
    if (event.detail.fieldId === fieldId) {
      callback(event.detail);
    }
  };

  window.addEventListener('sensor:data_received', handler as EventListener);

  return () => {
    window.removeEventListener('sensor:data_received', handler as EventListener);
  };
}

export function subscribeToFusedData(
  fieldId: string,
  metrics: string[],
  callback: (data: Record<string, ReturnType<typeof fuseSensorData>>) => void,
  interval = 60000
): () => void {
  const update = () => {
    const fused: Record<string, ReturnType<typeof fuseSensorData>> = {};
    for (const metric of metrics) {
      fused[metric] = fuseSensorData(fieldId, metric);
    }
    callback(fused);
  };

  update(); // Initial update
  const intervalId = setInterval(update, interval);

  return () => clearInterval(intervalId);
}
