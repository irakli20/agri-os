import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import type { SensorData, SensorIngestionPayload, SensorIngestionResponse } from '@/types/orchestrator';

export type EnvelopeSource = 'sensor' | 'manual' | 'fused' | 'derived';

export interface FieldZoneStateEnvelope {
  id: string;
  fieldId: string;
  zoneId?: string;
  metric: string;
  value: number;
  unit: string;
  source: EnvelopeSource;
  timestamp: string;
  confidence: number;
  provenance: {
    sensorId?: string;
    sensorType?: SensorData['sensorType'];
    batchId?: string;
    qualityScore?: number;
    qualityFlags: string[];
  };
}

export interface SensorEvent {
  id: string;
  fieldId: string;
  zoneId?: string;
  sensorId: string;
  sensorType: SensorData['sensorType'];
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
  qualityScore: number;
  qualityFlags: string[];
  confidence: number;
  batchId: string;
}

export interface ManualObservation {
  id: string;
  fieldId: string;
  zoneId?: string;
  metric: string;
  value: number;
  unit: string;
  observedAt: string;
  observedBy?: string;
  confidence: number;
  notes?: string;
}

export interface ReconciliationResult {
  id: string;
  fieldId: string;
  zoneId?: string;
  metric: string;
  status: 'matched' | 'conflict' | 'manual_only' | 'sensor_only';
  sensorValue?: number;
  manualValue?: number;
  delta?: number;
  deltaPercent?: number;
  resolvedEnvelope: FieldZoneStateEnvelope;
  createdAt: string;
}

export interface FreshnessRecord {
  sensorId: string;
  fieldId: string;
  sensorType: SensorData['sensorType'];
  lastSeenAt: string;
  ageMinutes: number;
  thresholdMinutes: number;
  isStale: boolean;
}

type SensorLike = Omit<SensorData, 'timestamp'> & { timestamp: string | Date };
type IngestionLike = Omit<SensorIngestionPayload, 'timestamp' | 'readings'> & {
  timestamp: string | Date;
  readings: SensorLike[];
};

const STALE_THRESHOLDS_MINUTES: Partial<Record<SensorData['sensorType'], number>> = {
  soil_moisture: 120,
  soil_temperature: 120,
  air_temperature: 60,
  humidity: 60,
  rainfall: 60,
  wind: 30,
  solar_radiation: 60,
  leaf_wetness: 60,
  ndvi: 24 * 60,
  thermal: 24 * 60,
  equipment_telemetry: 15,
  drone_imagery: 24 * 60,
  weather_station: 15,
};

function toIsoDate(input: string | Date): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString();
  }
  return d.toISOString();
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

class TwinIntelligencePipeline {
  private events: SensorEvent[] = [];
  private stateByField = new Map<string, Map<string, FieldZoneStateEnvelope>>();
  private manualObservations: ManualObservation[] = [];
  private reconciliationHistory: ReconciliationResult[] = [];
  private maxEvents = 5000;
  private storagePath = path.join(process.cwd(), '.agri-intelligence-pipeline.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (!fs.existsSync(this.storagePath)) return;
      const raw = fs.readFileSync(this.storagePath, 'utf8');
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        events?: SensorEvent[];
        state?: Record<string, FieldZoneStateEnvelope[]>;
        manual?: ManualObservation[];
        reconciliation?: ReconciliationResult[];
      };

      this.events = parsed.events ?? [];
      this.manualObservations = parsed.manual ?? [];
      this.reconciliationHistory = parsed.reconciliation ?? [];
      this.stateByField = new Map<string, Map<string, FieldZoneStateEnvelope>>();

      for (const [fieldId, envelopes] of Object.entries(parsed.state ?? {})) {
        const metricMap = new Map<string, FieldZoneStateEnvelope>();
        for (const env of envelopes) {
          const key = `${env.zoneId || 'field'}::${env.metric}`;
          metricMap.set(key, env);
        }
        this.stateByField.set(fieldId, metricMap);
      }
    } catch {
      // Ignore bad persisted state and continue with in-memory defaults.
    }
  }

  private persistToDisk(): void {
    try {
      const state: Record<string, FieldZoneStateEnvelope[]> = {};
      for (const [fieldId, metricMap] of this.stateByField.entries()) {
        state[fieldId] = [...metricMap.values()];
      }

      fs.writeFileSync(
        this.storagePath,
        JSON.stringify(
          {
            events: this.events.slice(-this.maxEvents),
            state,
            manual: this.manualObservations.slice(-2000),
            reconciliation: this.reconciliationHistory.slice(-2000),
          },
          null,
          2
        )
      );
    } catch {
      // Non-fatal: APIs should still return in-memory data.
    }
  }

  ingest(payload: IngestionLike): SensorIngestionResponse & {
    stateUpdates: number;
    eventCount: number;
    updatedFields: string[];
  } {
    this.loadFromDisk();
    const errors: Array<{ sensorId: string; error: string; data?: unknown }> = [];
    const warnings: string[] = [];
    let processed = 0;
    let stateUpdates = 0;
    const updatedFields = new Set<string>();

    if (!payload || !Array.isArray(payload.readings)) {
      return {
        success: false,
        batchId: payload?.batchId || randomUUID(),
        processed: 0,
        failed: 0,
        errors: [{ sensorId: 'payload', error: 'Invalid payload: readings array is required' }],
        warnings: [],
        stateUpdates: 0,
        eventCount: this.events.length,
        updatedFields: [],
      };
    }

    for (const sensorPacket of payload.readings) {
      try {
        if (!sensorPacket.sensorId || !sensorPacket.fieldId || !Array.isArray(sensorPacket.readings)) {
          throw new Error('Missing required sensor packet fields');
        }

        const eventTimestamp = toIsoDate(sensorPacket.timestamp);
        const qualityScore = clampConfidence(sensorPacket.quality?.score ?? 70);
        const qualityFlags = sensorPacket.quality?.flags ?? [];
        const confidence = clampConfidence(sensorPacket.quality?.confidence ?? qualityScore);

        for (const reading of sensorPacket.readings) {
          if (!reading || typeof reading.metric !== 'string' || typeof reading.value !== 'number') {
            errors.push({
              sensorId: sensorPacket.sensorId,
              error: 'Invalid reading entry',
              data: reading,
            });
            continue;
          }

          const event: SensorEvent = {
            id: randomUUID(),
            fieldId: sensorPacket.fieldId,
            zoneId: reading.depth !== undefined ? `depth-${reading.depth}` : undefined,
            sensorId: sensorPacket.sensorId,
            sensorType: sensorPacket.sensorType,
            metric: reading.metric,
            value: reading.value,
            unit: reading.unit,
            timestamp: eventTimestamp,
            qualityScore,
            qualityFlags,
            confidence,
            batchId: payload.batchId,
          };
          this.events.push(event);
          stateUpdates += this.updateEnvelopeFromEvent(event);
        }

        updatedFields.add(sensorPacket.fieldId);
        processed += 1;
      } catch (error) {
        errors.push({
          sensorId: sensorPacket?.sensorId || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown ingestion error',
        });
      }
    }

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    const freshness = this.getFreshness();
    const staleSensors = freshness.filter((f) => f.isStale).length;
    if (staleSensors > 0) {
      warnings.push(`${staleSensors} sensor(s) are stale based on freshness thresholds`);
    }
    this.persistToDisk();

    return {
      success: errors.length === 0,
      batchId: payload.batchId,
      processed,
      failed: payload.readings.length - processed,
      errors,
      warnings,
      stateUpdates,
      eventCount: this.events.length,
      updatedFields: [...updatedFields],
    };
  }

  private updateEnvelopeFromEvent(event: SensorEvent): number {
    const fieldState = this.stateByField.get(event.fieldId) ?? new Map<string, FieldZoneStateEnvelope>();
    const key = `${event.zoneId || 'field'}::${event.metric}`;
    const existing = fieldState.get(key);

    const envelope: FieldZoneStateEnvelope = {
      id: randomUUID(),
      fieldId: event.fieldId,
      zoneId: event.zoneId,
      metric: event.metric,
      value: event.value,
      unit: event.unit,
      source: 'sensor',
      timestamp: event.timestamp,
      confidence: event.confidence,
      provenance: {
        sensorId: event.sensorId,
        sensorType: event.sensorType,
        batchId: event.batchId,
        qualityScore: event.qualityScore,
        qualityFlags: event.qualityFlags,
      },
    };

    const shouldReplace =
      !existing ||
      new Date(event.timestamp).getTime() > new Date(existing.timestamp).getTime() ||
      (event.timestamp === existing.timestamp && envelope.confidence > existing.confidence);

    if (shouldReplace) {
      fieldState.set(key, envelope);
      this.stateByField.set(event.fieldId, fieldState);
      return 1;
    }
    return 0;
  }

  getState(fieldId?: string): Record<string, FieldZoneStateEnvelope[]> {
    this.loadFromDisk();
    if (fieldId) {
      return {
        [fieldId]: [...(this.stateByField.get(fieldId)?.values() ?? [])],
      };
    }

    const output: Record<string, FieldZoneStateEnvelope[]> = {};
    for (const [fid, metricMap] of this.stateByField.entries()) {
      output[fid] = [...metricMap.values()];
    }
    return output;
  }

  getTimeline(options?: { fieldId?: string; start?: string; end?: string; limit?: number }): SensorEvent[] {
    this.loadFromDisk();
    const start = options?.start ? new Date(options.start).getTime() : Number.NEGATIVE_INFINITY;
    const end = options?.end ? new Date(options.end).getTime() : Number.POSITIVE_INFINITY;
    const limit = options?.limit ?? 500;

    return this.events
      .filter((e) => {
        if (options?.fieldId && e.fieldId !== options.fieldId) return false;
        const ts = new Date(e.timestamp).getTime();
        return ts >= start && ts <= end;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-limit);
  }

  getFreshness(fieldId?: string): FreshnessRecord[] {
    this.loadFromDisk();
    const latestBySensor = new Map<string, SensorEvent>();

    for (const evt of this.events) {
      if (fieldId && evt.fieldId !== fieldId) continue;
      const existing = latestBySensor.get(evt.sensorId);
      if (!existing || new Date(evt.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
        latestBySensor.set(evt.sensorId, evt);
      }
    }

    const now = Date.now();
    return [...latestBySensor.values()].map((evt) => {
      const ageMinutes = Math.floor((now - new Date(evt.timestamp).getTime()) / 60000);
      const thresholdMinutes = STALE_THRESHOLDS_MINUTES[evt.sensorType] ?? 120;
      return {
        sensorId: evt.sensorId,
        fieldId: evt.fieldId,
        sensorType: evt.sensorType,
        lastSeenAt: evt.timestamp,
        ageMinutes,
        thresholdMinutes,
        isStale: ageMinutes > thresholdMinutes,
      };
    });
  }

  addManualObservation(input: Omit<ManualObservation, 'id'>): ManualObservation {
    this.loadFromDisk();
    const observation: ManualObservation = {
      ...input,
      id: randomUUID(),
      observedAt: toIsoDate(input.observedAt),
      confidence: clampConfidence(input.confidence),
    };
    this.manualObservations.push(observation);
    if (this.manualObservations.length > 2000) {
      this.manualObservations = this.manualObservations.slice(-2000);
    }
    this.persistToDisk();
    return observation;
  }

  reconcile(options: { fieldId: string; metric: string; tolerancePercent?: number }): ReconciliationResult {
    this.loadFromDisk();
    const tolerancePercent = options.tolerancePercent ?? 10;
    const telemetry = this.getState(options.fieldId)[options.fieldId]?.find((s) => s.metric === options.metric);
    const manual = [...this.manualObservations]
      .filter((m) => m.fieldId === options.fieldId && m.metric === options.metric)
      .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime())[0];

    let status: ReconciliationResult['status'] = 'matched';
    let delta: number | undefined;
    let deltaPercent: number | undefined;
    let resolvedEnvelope: FieldZoneStateEnvelope;

    if (!telemetry && !manual) {
      throw new Error(`No telemetry or manual observations found for ${options.fieldId}/${options.metric}`);
    }

    if (!telemetry && manual) {
      status = 'manual_only';
      resolvedEnvelope = {
        id: randomUUID(),
        fieldId: manual.fieldId,
        zoneId: manual.zoneId,
        metric: manual.metric,
        value: manual.value,
        unit: manual.unit,
        source: 'manual',
        timestamp: manual.observedAt,
        confidence: manual.confidence,
        provenance: {
          qualityFlags: ['manual_observation_only'],
        },
      };
      this.upsertEnvelope(resolvedEnvelope);
    } else if (telemetry && !manual) {
      status = 'sensor_only';
      resolvedEnvelope = telemetry;
    } else {
      delta = (manual as ManualObservation).value - (telemetry as FieldZoneStateEnvelope).value;
      const base = Math.abs((telemetry as FieldZoneStateEnvelope).value) || 1;
      deltaPercent = Math.abs((delta / base) * 100);
      status = deltaPercent > tolerancePercent ? 'conflict' : 'matched';

      resolvedEnvelope = {
        ...(telemetry as FieldZoneStateEnvelope),
        id: randomUUID(),
        source: status === 'conflict' ? 'manual' : 'fused',
        value:
          status === 'conflict'
            ? (manual as ManualObservation).value
            : Number(
                (
                  ((telemetry as FieldZoneStateEnvelope).value * (telemetry as FieldZoneStateEnvelope).confidence +
                    (manual as ManualObservation).value * (manual as ManualObservation).confidence) /
                  Math.max(
                    1,
                    (telemetry as FieldZoneStateEnvelope).confidence + (manual as ManualObservation).confidence
                  )
                ).toFixed(3)
              ),
        timestamp: new Date().toISOString(),
        confidence: Math.max((telemetry as FieldZoneStateEnvelope).confidence, (manual as ManualObservation).confidence),
        provenance: {
          ...(telemetry as FieldZoneStateEnvelope).provenance,
          qualityFlags: [
            ...new Set([
              ...((telemetry as FieldZoneStateEnvelope).provenance.qualityFlags || []),
              status === 'conflict' ? 'manual_sensor_conflict' : 'manual_sensor_reconciled',
            ]),
          ],
        },
      };
      this.upsertEnvelope(resolvedEnvelope);
    }

    const result: ReconciliationResult = {
      id: randomUUID(),
      fieldId: options.fieldId,
      metric: options.metric,
      zoneId: resolvedEnvelope.zoneId,
      status,
      sensorValue: telemetry?.value,
      manualValue: manual?.value,
      delta,
      deltaPercent,
      resolvedEnvelope,
      createdAt: new Date().toISOString(),
    };

    this.reconciliationHistory.push(result);
    if (this.reconciliationHistory.length > 2000) {
      this.reconciliationHistory = this.reconciliationHistory.slice(-2000);
    }
    this.persistToDisk();

    return result;
  }

  private upsertEnvelope(envelope: FieldZoneStateEnvelope): void {
    const fieldState = this.stateByField.get(envelope.fieldId) ?? new Map<string, FieldZoneStateEnvelope>();
    const key = `${envelope.zoneId || 'field'}::${envelope.metric}`;
    fieldState.set(key, envelope);
    this.stateByField.set(envelope.fieldId, fieldState);
  }

  getReconciliationHistory(fieldId?: string): ReconciliationResult[] {
    this.loadFromDisk();
    if (!fieldId) return [...this.reconciliationHistory];
    return this.reconciliationHistory.filter((r) => r.fieldId === fieldId);
  }

  replay(options: { fieldId: string; start?: string; end?: string; speed?: number }) {
    const timeline = this.getTimeline({
      fieldId: options.fieldId,
      start: options.start,
      end: options.end,
      limit: 2000,
    });
    const speed = Math.max(0.1, options.speed ?? 1);
    const durationMs = timeline.length > 1
      ? new Date(timeline[timeline.length - 1].timestamp).getTime() - new Date(timeline[0].timestamp).getTime()
      : 0;

    const keyMetrics = ['moisture', 'temperature', 'ndvi', 'humidity'];
    const summary = keyMetrics.map((metric) => {
      const series = timeline.filter((e) => e.metric === metric).map((e) => e.value);
      if (series.length === 0) {
        return { metric, points: 0, min: null, max: null, avg: null };
      }
      const min = Math.min(...series);
      const max = Math.max(...series);
      const avg = Number((series.reduce((a, b) => a + b, 0) / series.length).toFixed(3));
      return { metric, points: series.length, min, max, avg };
    });

    return {
      fieldId: options.fieldId,
      start: timeline[0]?.timestamp ?? options.start ?? null,
      end: timeline[timeline.length - 1]?.timestamp ?? options.end ?? null,
      events: timeline,
      eventCount: timeline.length,
      replayDurationMs: durationMs,
      estimatedPlaybackMs: Math.round(durationMs / speed),
      speed,
      summary,
    };
  }
}

export const twinIntelligencePipeline = new TwinIntelligencePipeline();
