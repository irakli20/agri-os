import { TreatmentRecommendation } from './pest-disease-data';

export interface ScheduledTreatment {
    id: string;
    fieldId: string;
    problemId: string; // ID of the pest/disease/weed
    problemType: 'pest' | 'disease' | 'weed';
    recommendationId?: string;
    treatmentName: string;
    productName: string;
    rate: string;
    date: string; // ISO date string
    time: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    cost: number;
    assignedTo?: string;
    createdAt: string;
}

const STORAGE_KEY = 'agri-os-treatments';

export const TreatmentStorage = {
    getTreatments: (): ScheduledTreatment[] => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load treatments', e);
            return [];
        }
    },

    getTreatmentsByField: (fieldId: string): ScheduledTreatment[] => {
        const treatments = TreatmentStorage.getTreatments();
        return treatments.filter(t => t.fieldId === fieldId);
    },

    addTreatment: (treatment: Omit<ScheduledTreatment, 'id' | 'createdAt'>): ScheduledTreatment => {
        const treatments = TreatmentStorage.getTreatments();
        const newTreatment: ScheduledTreatment = {
            ...treatment,
            id: `treatment-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...treatments, newTreatment]));
        }

        return newTreatment;
    },

    updateTreatmentStatus: (id: string, status: ScheduledTreatment['status']): void => {
        const treatments = TreatmentStorage.getTreatments();
        const updated = treatments.map(t =>
            t.id === id ? { ...t, status } : t
        );

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    },

    deleteTreatment: (id: string): void => {
        const treatments = TreatmentStorage.getTreatments();
        const filtered = treatments.filter(t => t.id !== id);

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }
    }
};
