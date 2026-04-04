// @ts-nocheck

export interface ScoutingMission {
    id: string;
    fieldId: string;
    fieldName: string;
    scoutName: string;
    date: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
    templateId: string;
    routePattern: 'zigzag' | 'diamond' | 'perimeter' | 'grid';
    notes?: string;
}

export interface AerialScoutingParameters {
    droneHeightM: number;
    flightSpeedMps: number;
    fps: number;
    missionFlightPasses: number;
    frontImageOverlapPct: number;
    sideImageOverlapPct: number;
    routePattern: 'zigzag' | 'diamond' | 'perimeter' | 'grid' | 'crosshatch';
    captureBands: string[];
    gimbalAngleDeg: number;
    groundSamplingDistanceCm: number;
    estimatedDurationMin: number;
}

export interface ScoutingRunRecord {
    id: string;
    missionId?: string;
    source: 'mission_scheduled' | 'mission_report' | 'auto_weekly';
    status: 'planned' | 'completed';
    fieldId: string;
    fieldName: string;
    scheduledDate?: string;
    scannedAtIso: string;
    planned: AerialScoutingParameters;
    performed?: AerialScoutingParameters;
    detectedStageId?: string;
    detectedBbch?: string;
    gameYear?: number;
    gameSeason?: string;
    gameWeek?: number;
    notes?: string;
}

export interface ScoutingReport {
    id: string;
    missionId: string;
    fieldId: string;
    date: string;
    cropStage: string;
    standCount?: number; // plants per 1/1000th acre
    pestObservations: {
        pestId: string;
        severity: 'low' | 'medium' | 'high';
        count: number;
        notes?: string;
    }[];
    diseaseObservations: {
        diseaseId: string;
        severity: 'low' | 'medium' | 'high';
        notes?: string;
    }[];
    weedPressure: {
        weedId: string;
        density: 'low' | 'medium' | 'high';
    }[];
    images: string[];
    generalNotes: string;
}

export interface ScoutingTemplate {
    id: string;
    name: string;
    focus: 'general' | 'pests' | 'disease' | 'weeds' | 'harvest';
    checkpoints: string[];
}

const MOCK_TEMPLATES: ScoutingTemplate[] = [
    {
        id: 'general-scout',
        name: 'General Field Scout',
        focus: 'general',
        checkpoints: ['Crop Stage', 'General Vigor', 'Soil Moisture', 'Pest Presence']
    },
    {
        id: 'pest-scout',
        name: 'Pest Pressure Scout',
        focus: 'pests',
        checkpoints: ['Leaf Damage', 'Insect Count', 'Egg Masses', 'Beneficials']
    },
    {
        id: 'harvest-readiness',
        name: 'Harvest Readiness',
        focus: 'harvest',
        checkpoints: ['Grain Moisture', 'Pod Color', 'Stalk Integrity', 'Weed Interference']
    }
];

const INITIAL_MISSIONS: ScoutingMission[] = [
    {
        id: 'm-1',
        fieldId: 'f-1',
        fieldName: 'North Field',
        scoutName: 'John Doe',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        priority: 'medium',
        status: 'scheduled',
        templateId: 'general-scout',
        routePattern: 'zigzag'
    },
    {
        id: 'm-2',
        fieldId: 'f-2',
        fieldName: 'South Pasture',
        scoutName: 'Jane Smith',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        priority: 'high',
        status: 'overdue',
        templateId: 'pest-scout',
        routePattern: 'diamond'
    }
];

const INITIAL_SCOUTING_RUNS: ScoutingRunRecord[] = [];

export function mapBbchToCornReferenceStage(bbch: string): number {
    const value = Number.parseInt(bbch, 10);
    if (Number.isNaN(value)) return 0;
    if (value <= 11) return 0;
    if (value <= 12) return 1;
    if (value <= 16) return 2;
    if (value <= 39) return 3;
    if (value <= 53) return 4;
    if (value <= 69) return 5;
    if (value <= 74) return 6;
    if (value <= 79) return 7;
    if (value <= 83) return 8;
    if (value <= 87) return 9;
    return 10;
}

export function mapCropStageCodeToBbch(stageCode: string): string {
    const code = (stageCode || '').toUpperCase();
    switch (code) {
        case 'VE':
            return '11';
        case 'V1':
            return '12';
        case 'V2':
            return '13';
        case 'V3':
            return '15';
        case 'V6':
            return '16';
        case 'VT':
            return '53';
        case 'R1':
            return '69';
        case 'R2':
            return '74';
        case 'R3':
            return '79';
        case 'R4':
            return '83';
        case 'R5':
            return '87';
        case 'R6':
            return '89';
        default:
            return '11';
    }
}

export function mapCropStageCodeToReferenceStage(stageCode: string): string {
    const code = (stageCode || '').toUpperCase();
    switch (code) {
        case 'VE':
            return 'START';
        case 'V1':
            return 'V1';
        case 'V2':
        case 'V3':
        case 'V6':
            return 'V6';
        case 'VT':
            return 'VT';
        case 'R1':
            return 'R1';
        case 'R2':
            return 'R2';
        case 'R3':
            return 'R3';
        case 'R4':
            return 'R4';
        case 'R5':
            return 'R5';
        case 'R6':
            return 'R6';
        default:
            return 'START';
    }
}

function round(value: number, decimals = 1): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

export function buildPlannedAerialParams(options: {
    acres: number;
    stageIndex?: number;
    routePattern?: AerialScoutingParameters['routePattern'];
    captureProfile?: 'corn' | 'general';
}): AerialScoutingParameters {
    const stageIndex = Math.max(0, options.stageIndex ?? 0);
    const acres = Math.max(1, options.acres || 1);
    const routePattern = options.routePattern || 'grid';
    const captureProfile = options.captureProfile || 'general';

    const baseAltitude = stageIndex <= 2 ? 54 : stageIndex <= 5 ? 66 : 76;
    const baseSpeed = stageIndex <= 2 ? 4.6 : stageIndex <= 5 ? 5.4 : 6.1;
    const captureBands =
        captureProfile === 'corn'
            ? (stageIndex <= 2
                ? ['RGB', 'Multispectral']
                : stageIndex <= 6
                    ? ['RGB', 'Multispectral', 'Thermal']
                    : ['RGB', 'Thermal'])
            : ['RGB', 'Multispectral'];

    return {
        droneHeightM: baseAltitude,
        flightSpeedMps: baseSpeed,
        fps: stageIndex <= 3 ? 4 : 3,
        missionFlightPasses: Math.max(5, Math.round(acres / 17)),
        frontImageOverlapPct: stageIndex <= 3 ? 82 : 76,
        sideImageOverlapPct: stageIndex <= 3 ? 72 : 68,
        routePattern,
        captureBands,
        gimbalAngleDeg: -90,
        groundSamplingDistanceCm: round(baseAltitude * 0.18),
        estimatedDurationMin: Math.max(14, Math.round((acres / Math.max(1, baseSpeed)) * 1.6)),
    };
}

export function buildPerformedAerialParams(
    planned: AerialScoutingParameters,
    windMph = 8
): AerialScoutingParameters {
    const windAdjustment = Math.min(0.7, windMph / 40);
    const captureBands =
        windMph > 15 && planned.captureBands.includes('Thermal')
            ? planned.captureBands.filter((band) => band !== 'Thermal')
            : planned.captureBands;

    return {
        droneHeightM: round(Math.max(35, planned.droneHeightM + (Math.random() - 0.5) * 5)),
        flightSpeedMps: round(Math.max(3, planned.flightSpeedMps - windAdjustment + (Math.random() - 0.5) * 0.5)),
        fps: round(Math.max(2, planned.fps + (Math.random() > 0.65 ? -0.5 : 0)), 1),
        missionFlightPasses: Math.max(4, planned.missionFlightPasses + (Math.random() > 0.6 ? 1 : 0)),
        frontImageOverlapPct: Math.max(68, Math.min(88, Math.round(planned.frontImageOverlapPct + (Math.random() - 0.5) * 6))),
        sideImageOverlapPct: Math.max(60, Math.min(82, Math.round(planned.sideImageOverlapPct + (Math.random() - 0.5) * 6))),
        routePattern: planned.routePattern,
        captureBands,
        gimbalAngleDeg: planned.gimbalAngleDeg,
        groundSamplingDistanceCm: round(Math.max(6, planned.groundSamplingDistanceCm + (Math.random() - 0.5) * 1.2)),
        estimatedDurationMin: Math.max(12, Math.round(planned.estimatedDurationMin + (Math.random() - 0.5) * 8)),
    };
}

class ScoutingStorageService {
    private MISSION_STORAGE_KEY = 'agri-os-scouting-missions';
    private RUN_STORAGE_KEY = 'agri-os-scouting-runs';

    getMissions(): ScoutingMission[] {
        if (typeof window === 'undefined') return INITIAL_MISSIONS;

        const stored = localStorage.getItem(this.MISSION_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.MISSION_STORAGE_KEY, JSON.stringify(INITIAL_MISSIONS));
            return INITIAL_MISSIONS;
        }
        return JSON.parse(stored);
    }

    getMissionsByField(fieldId: string): ScoutingMission[] {
        return this.getMissions().filter(m => m.fieldId === fieldId);
    }

    addMission(mission: Omit<ScoutingMission, 'id' | 'status'>): ScoutingMission {
        const missions = this.getMissions();
        const newMission: ScoutingMission = {
            ...mission,
            id: `m-${Date.now()}`,
            status: 'scheduled'
        };

        missions.push(newMission);
        this.saveMissions(missions);
        return newMission;
    }

    updateStatus(id: string, status: ScoutingMission['status']) {
        const missions = this.getMissions();
        const index = missions.findIndex(m => m.id === id);
        if (index !== -1) {
            missions[index].status = status;
            this.saveMissions(missions);
        }
    }

    getRuns(): ScoutingRunRecord[] {
        if (typeof window === 'undefined') return INITIAL_SCOUTING_RUNS;

        const stored = localStorage.getItem(this.RUN_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.RUN_STORAGE_KEY, JSON.stringify(INITIAL_SCOUTING_RUNS));
            return INITIAL_SCOUTING_RUNS;
        }

        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : INITIAL_SCOUTING_RUNS;
        } catch {
            return INITIAL_SCOUTING_RUNS;
        }
    }

    getRunsByField(fieldId: string): ScoutingRunRecord[] {
        return this.getRuns().filter((run) => run.fieldId === fieldId);
    }

    getLatestRunByMission(missionId: string): ScoutingRunRecord | null {
        const missionRuns = this.getRuns().filter((run) => run.missionId === missionId);
        if (missionRuns.length === 0) return null;
        return missionRuns.sort((a, b) => new Date(b.scannedAtIso).getTime() - new Date(a.scannedAtIso).getTime())[0];
    }

    getLatestCompletedRunForFields(fieldIds: string[]): ScoutingRunRecord | null {
        if (!fieldIds || fieldIds.length === 0) return null;
        const allowed = new Set(fieldIds);
        const matching = this.getRuns().filter(
            (run) => run.status === 'completed' && allowed.has(run.fieldId)
        );
        if (matching.length === 0) return null;
        return matching.sort((a, b) => new Date(b.scannedAtIso).getTime() - new Date(a.scannedAtIso).getTime())[0];
    }

    createPlannedRunForMission(
        mission: ScoutingMission,
        planned: AerialScoutingParameters,
        metadata?: {
            notes?: string;
            scheduledDate?: string;
            gameYear?: number;
            gameSeason?: string;
            gameWeek?: number;
        }
    ): ScoutingRunRecord {
        const runs = this.getRuns();
        const newRun: ScoutingRunRecord = {
            id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            missionId: mission.id,
            source: 'mission_scheduled',
            status: 'planned',
            fieldId: mission.fieldId,
            fieldName: mission.fieldName,
            scheduledDate: metadata?.scheduledDate || mission.date,
            scannedAtIso: new Date().toISOString(),
            planned: {
                ...planned,
                routePattern: mission.routePattern,
            },
            gameYear: metadata?.gameYear,
            gameSeason: metadata?.gameSeason,
            gameWeek: metadata?.gameWeek,
            notes: metadata?.notes || mission.notes,
        };

        this.saveRuns([newRun, ...runs]);
        return newRun;
    }

    completeMissionRun(
        missionId: string,
        completion: {
            performed?: AerialScoutingParameters;
            detectedStageId?: string;
            detectedBbch?: string;
            notes?: string;
            scannedAtIso?: string;
        }
    ): ScoutingRunRecord | null {
        const runs = this.getRuns();
        const missionRunIndex = runs.findIndex((run) => run.missionId === missionId);

        if (missionRunIndex !== -1) {
            const existing = runs[missionRunIndex];
            const updated: ScoutingRunRecord = {
                ...existing,
                source: 'mission_report',
                status: 'completed',
                scannedAtIso: completion.scannedAtIso || new Date().toISOString(),
                performed: completion.performed || existing.performed || existing.planned,
                detectedStageId: completion.detectedStageId || existing.detectedStageId,
                detectedBbch: completion.detectedBbch || existing.detectedBbch,
                notes: completion.notes || existing.notes,
            };
            runs[missionRunIndex] = updated;
            this.saveRuns(runs);
            return updated;
        }

        const mission = this.getMissions().find((item) => item.id === missionId);
        if (!mission) return null;

        const fallbackPlanned = buildPlannedAerialParams({
            acres: 40,
            routePattern: mission.routePattern,
            captureProfile: 'general',
            stageIndex: 0,
        });

        const created: ScoutingRunRecord = {
            id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            missionId,
            source: 'mission_report',
            status: 'completed',
            fieldId: mission.fieldId,
            fieldName: mission.fieldName,
            scheduledDate: mission.date,
            scannedAtIso: completion.scannedAtIso || new Date().toISOString(),
            planned: fallbackPlanned,
            performed: completion.performed || fallbackPlanned,
            detectedStageId: completion.detectedStageId,
            detectedBbch: completion.detectedBbch,
            notes: completion.notes || mission.notes,
        };
        this.saveRuns([created, ...runs]);
        return created;
    }

    recordAutoWeeklyRun(
        run: {
            fieldId: string;
            fieldName: string;
            planned: AerialScoutingParameters;
            performed: AerialScoutingParameters;
            detectedStageId: string;
            detectedBbch: string;
            gameYear?: number;
            gameSeason?: string;
            gameWeek?: number;
            notes?: string;
        }
    ): ScoutingRunRecord {
        const runs = this.getRuns();
        const record: ScoutingRunRecord = {
            id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            source: 'auto_weekly',
            status: 'completed',
            fieldId: run.fieldId,
            fieldName: run.fieldName,
            scannedAtIso: new Date().toISOString(),
            planned: run.planned,
            performed: run.performed,
            detectedStageId: run.detectedStageId,
            detectedBbch: run.detectedBbch,
            gameYear: run.gameYear,
            gameSeason: run.gameSeason,
            gameWeek: run.gameWeek,
            notes: run.notes,
        };

        this.saveRuns([record, ...runs]);
        return record;
    }

    getTemplates(): ScoutingTemplate[] {
        return MOCK_TEMPLATES;
    }

    clearAll() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.MISSION_STORAGE_KEY);
            localStorage.removeItem(this.RUN_STORAGE_KEY);
        }
    }

    private saveMissions(missions: ScoutingMission[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.MISSION_STORAGE_KEY, JSON.stringify(missions));
        }
    }

    private saveRuns(runs: ScoutingRunRecord[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.RUN_STORAGE_KEY, JSON.stringify(runs));
        }
    }
}

export const ScoutingStorage = new ScoutingStorageService();
