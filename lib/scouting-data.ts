import { useState, useEffect } from 'react';

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

class ScoutingStorageService {
    private STORAGE_KEY = 'agri-os-scouting-missions';

    getMissions(): ScoutingMission[] {
        if (typeof window === 'undefined') return INITIAL_MISSIONS;

        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_MISSIONS));
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

    getTemplates(): ScoutingTemplate[] {
        return MOCK_TEMPLATES;
    }

    private saveMissions(missions: ScoutingMission[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(missions));
        }
    }
}

export const ScoutingStorage = new ScoutingStorageService();
