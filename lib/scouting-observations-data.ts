export type ObservationType = 'pest' | 'disease' | 'weed' | 'irrigation' | 'equipment' | 'other';

export type SeverityLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ScoutingObservation {
    id: string;
    fieldId: string;
    coordinates: { lat: number; lng: number } | null;
    observationType: ObservationType;
    severity: SeverityLevel;
    photoUrl?: string;
    notes: string;
    timestamp: string;
}

export const OBSERVATION_TYPE_LABELS: Record<ObservationType, string> = {
    pest: 'Pest',
    disease: 'Disease',
    weed: 'Weed',
    irrigation: 'Irrigation Issue',
    equipment: 'Equipment Issue',
    other: 'Other',
};

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
    none: 'None',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};

export function getObservationTypeColor(type: ObservationType): string {
    switch (type) {
        case 'pest':
            return 'bg-orange-500/20 text-orange-400';
        case 'disease':
            return 'bg-purple-500/20 text-purple-400';
        case 'weed':
            return 'bg-green-500/20 text-green-400';
        case 'irrigation':
            return 'bg-blue-500/20 text-blue-400';
        case 'equipment':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'other':
            return 'bg-gray-500/20 text-gray-400';
    }
}

export function getSeverityColor(severity: SeverityLevel): string {
    switch (severity) {
        case 'none':
            return 'bg-gray-500/20 text-gray-400';
        case 'low':
            return 'bg-green-500/20 text-green-400';
        case 'medium':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'high':
            return 'bg-orange-500/20 text-orange-400';
        case 'critical':
            return 'bg-red-500/20 text-red-400';
    }
}

export const MOCK_SCOUTING_OBSERVATIONS: ScoutingObservation[] = [
    {
        id: 'obs-1',
        fieldId: 'field-1',
        coordinates: { lat: 36.6780, lng: -121.6525 },
        observationType: 'pest',
        severity: 'high',
        photoUrl: '/pest-aphid.jpg',
        notes: 'Aphid infestation detected along the eastern edge. Approximately 40% of plants affected.',
        timestamp: '2024-12-15T09:30:00Z',
    },
    {
        id: 'obs-2',
        fieldId: 'field-1',
        coordinates: { lat: 36.6775, lng: -121.6540 },
        observationType: 'disease',
        severity: 'medium',
        notes: 'Signs of powdery mildew on lower leaves. Early stage, recommend fungicide treatment.',
        timestamp: '2024-12-14T14:15:00Z',
    },
    {
        id: 'obs-3',
        fieldId: 'field-2',
        coordinates: { lat: 36.6720, lng: -121.6580 },
        observationType: 'weed',
        severity: 'low',
        notes: 'Scattered pigweed emerging between rows. Hand weeding recommended.',
        timestamp: '2024-12-13T11:00:00Z',
    },
    {
        id: 'obs-4',
        fieldId: 'field-1',
        coordinates: { lat: 36.6785, lng: -121.6510 },
        observationType: 'irrigation',
        severity: 'high',
        notes: 'Drip line leak detected. Pooling water causing potential root rot risk.',
        timestamp: '2024-12-12T16:45:00Z',
    },
    {
        id: 'obs-5',
        fieldId: 'field-3',
        coordinates: null,
        observationType: 'equipment',
        severity: 'medium',
        notes: 'Tractor GPS system showing intermittent connectivity issues during field operation.',
        timestamp: '2024-12-11T08:20:00Z',
    },
    {
        id: 'obs-6',
        fieldId: 'field-2',
        coordinates: { lat: 36.6730, lng: -121.6570 },
        observationType: 'pest',
        severity: 'critical',
        notes: 'Cabbage looper outbreak identified. Immediate action required to prevent crop loss.',
        timestamp: '2024-12-10T13:30:00Z',
    },
    {
        id: 'obs-7',
        fieldId: 'field-1',
        coordinates: { lat: 36.6790, lng: -121.6530 },
        observationType: 'other',
        severity: 'none',
        notes: 'Routine check completed. Crop health looks excellent in this section.',
        timestamp: '2024-12-09T10:00:00Z',
    },
];

class ScoutingObservationsStorageService {
    private STORAGE_KEY = 'agri-os-scouting-observations';

    getObservations(): ScoutingObservation[] {
        if (typeof window === 'undefined') return MOCK_SCOUTING_OBSERVATIONS;

        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(MOCK_SCOUTING_OBSERVATIONS));
            return MOCK_SCOUTING_OBSERVATIONS;
        }
        return JSON.parse(stored);
    }

    getObservationsByField(fieldId: string): ScoutingObservation[] {
        return this.getObservations().filter(o => o.fieldId === fieldId);
    }

    addObservation(observation: Omit<ScoutingObservation, 'id'>): ScoutingObservation {
        const observations = this.getObservations();
        const newObservation: ScoutingObservation = {
            ...observation,
            id: `obs-${Date.now()}`,
        };

        observations.unshift(newObservation);
        this.saveObservations(observations);
        return newObservation;
    }

    private saveObservations(observations: ScoutingObservation[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(observations));
        }
    }
}

export const ScoutingObservationsStorage = new ScoutingObservationsStorageService();
