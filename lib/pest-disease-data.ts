/**
 * Pest & Disease Monitoring Data
 * 
 * Field-level pest tracking, disease pressure, weed mapping, and treatment recommendations
 */

export type PestType = 'aphid' | 'caterpillar' | 'beetle' | 'mite' | 'fly' | 'moth' | 'grasshopper';
export type DiseaseType = 'fungal' | 'bacterial' | 'viral' | 'nematode';
export type WeedType = 'broadleaf' | 'grass' | 'sedge';
export type PressureLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe';
export type TreatmentStatus = 'none' | 'scheduled' | 'in_progress' | 'completed';

export interface PestInfestation {
    id: string;
    fieldId: string;
    pestType: PestType;
    pestName: string;
    pressureLevel: PressureLevel;
    affectedArea: number; // acres
    detectedDate: string;
    lastScouted: string;
    population: number; // per trap or per plant
    economicThreshold: number;
    treatmentStatus: TreatmentStatus;
    coordinates: { lat: number; lng: number }[];
    notes: string;
}

export interface DiseaseIncident {
    id: string;
    fieldId: string;
    diseaseType: DiseaseType;
    diseaseName: string;
    pressureLevel: PressureLevel;
    affectedArea: number;
    detectedDate: string;
    symptoms: string[];
    weatherFavorability: number; // 0-100
    spreadRisk: 'low' | 'medium' | 'high';
    treatmentStatus: TreatmentStatus;
    coordinates: { lat: number; lng: number }[];
}

export interface WeedPressure {
    id: string;
    fieldId: string;
    weedType: WeedType;
    weedSpecies: string;
    pressureLevel: PressureLevel;
    coverage: number; // percentage
    growthStage: string;
    competitionImpact: number; // 0-100
    treatmentStatus: TreatmentStatus;
    resistanceProfile: string[];
    coordinates: { lat: number; lng: number }[];
}

export interface TreatmentRecommendation {
    id: string;
    problemId: string;
    problemType: 'pest' | 'disease' | 'weed';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    method: 'chemical' | 'biological' | 'cultural' | 'mechanical' | 'integrated';
    products: {
        name: string;
        activeIngredient: string;
        rate: string;
        cost: number;
        efficacy: number; // 0-100
    }[];
    timing: string;
    conditions: string;
    expectedCost: number;
    expectedYieldProtection: number; // percentage
    environmentalImpact: 'low' | 'medium' | 'high';
    resistanceRisk: 'low' | 'medium' | 'high';
}

export interface RegionalAlert {
    id: string;
    type: 'pest' | 'disease';
    name: string;
    severity: 'watch' | 'warning' | 'outbreak';
    region: string;
    radius: number; // miles from farm
    description: string;
    affectedCrops: string[];
    reportedCases: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    issuedDate: string;
    recommendations: string[];
}

// Mock Pest Infestations
export const PEST_INFESTATIONS: PestInfestation[] = [
    {
        id: 'pest-1',
        fieldId: 'field-1',
        pestType: 'aphid',
        pestName: 'Soybean Aphid',
        pressureLevel: 'moderate',
        affectedArea: 12.5,
        detectedDate: '2024-12-01',
        lastScouted: '2024-12-03',
        population: 450, // per plant
        economicThreshold: 250,
        treatmentStatus: 'scheduled',
        coordinates: [
            { lat: 40.7128, lng: -74.0060 },
            { lat: 40.7138, lng: -74.0050 },
            { lat: 40.7148, lng: -74.0070 }
        ],
        notes: 'Population increasing rapidly. Treatment scheduled for tomorrow morning.'
    },
    {
        id: 'pest-2',
        fieldId: 'field-2',
        pestType: 'caterpillar',
        pestName: 'Corn Earworm',
        pressureLevel: 'high',
        affectedArea: 8.3,
        detectedDate: '2024-11-28',
        lastScouted: '2024-12-02',
        population: 3.2, // per plant
        economicThreshold: 1.5,
        treatmentStatus: 'in_progress',
        coordinates: [
            { lat: 40.7200, lng: -74.0100 },
            { lat: 40.7210, lng: -74.0090 }
        ],
        notes: 'Spraying in progress. Second application may be needed.'
    }
];

// Mock Disease Incidents
export const DISEASE_INCIDENTS: DiseaseIncident[] = [
    {
        id: 'disease-1',
        fieldId: 'field-1',
        diseaseType: 'fungal',
        diseaseName: 'Late Blight',
        pressureLevel: 'moderate',
        affectedArea: 5.2,
        detectedDate: '2024-11-30',
        symptoms: ['Dark lesions on leaves', 'White fungal growth', 'Stem rot'],
        weatherFavorability: 75,
        spreadRisk: 'high',
        treatmentStatus: 'scheduled',
        coordinates: [
            { lat: 40.7150, lng: -74.0065 },
            { lat: 40.7155, lng: -74.0070 }
        ]
    },
    {
        id: 'disease-2',
        fieldId: 'field-3',
        diseaseType: 'bacterial',
        diseaseName: 'Bacterial Leaf Streak',
        pressureLevel: 'low',
        affectedArea: 2.1,
        detectedDate: '2024-12-02',
        symptoms: ['Yellow streaks', 'Leaf wilting'],
        weatherFavorability: 45,
        spreadRisk: 'low',
        treatmentStatus: 'none',
        coordinates: [
            { lat: 40.7180, lng: -74.0080 }
        ]
    }
];

// Mock Weed Pressure
export const WEED_PRESSURE: WeedPressure[] = [
    {
        id: 'weed-1',
        fieldId: 'field-2',
        weedType: 'broadleaf',
        weedSpecies: 'Palmer Amaranth',
        pressureLevel: 'high',
        coverage: 35,
        growthStage: '4-6 leaf',
        competitionImpact: 65,
        treatmentStatus: 'scheduled',
        resistanceProfile: ['Glyphosate', 'ALS inhibitors'],
        coordinates: [
            { lat: 40.7205, lng: -74.0095 },
            { lat: 40.7215, lng: -74.0085 }
        ]
    },
    {
        id: 'weed-2',
        fieldId: 'field-1',
        weedSpecies: 'Waterhemp',
        weedType: 'broadleaf',
        pressureLevel: 'moderate',
        coverage: 18,
        growthStage: '2-4 leaf',
        competitionImpact: 40,
        treatmentStatus: 'none',
        resistanceProfile: ['Glyphosate'],
        coordinates: [
            { lat: 40.7140, lng: -74.0055 }
        ]
    }
];

// Mock Treatment Recommendations
export const TREATMENT_RECOMMENDATIONS: TreatmentRecommendation[] = [
    {
        id: 'rec-1',
        problemId: 'pest-1',
        problemType: 'pest',
        urgency: 'high',
        method: 'integrated',
        products: [
            {
                name: 'Lambda-Cyhalothrin',
                activeIngredient: 'Pyrethroid',
                rate: '3.84 fl oz/acre',
                cost: 12.50,
                efficacy: 92
            },
            {
                name: 'Beneficial Insects (Lady Beetles)',
                activeIngredient: 'Biological Control',
                rate: '1500 per acre',
                cost: 45.00,
                efficacy: 75
            }
        ],
        timing: 'Early morning (6-9 AM) when temperatures are 65-75°F',
        conditions: 'Wind speed < 5 mph, no rain forecast for 24 hours',
        expectedCost: 156.25,
        expectedYieldProtection: 15,
        environmentalImpact: 'medium',
        resistanceRisk: 'medium'
    },
    {
        id: 'rec-2',
        problemId: 'disease-1',
        problemType: 'disease',
        urgency: 'critical',
        method: 'chemical',
        products: [
            {
                name: 'Chlorothalonil',
                activeIngredient: 'Broad-spectrum fungicide',
                rate: '1.5 pt/acre',
                cost: 18.75,
                efficacy: 88
            }
        ],
        timing: 'Apply immediately, repeat in 7-10 days',
        conditions: 'Apply before rain events, ensure good coverage',
        expectedCost: 97.50,
        expectedYieldProtection: 25,
        environmentalImpact: 'medium',
        resistanceRisk: 'low'
    },
    {
        id: 'rec-3',
        problemId: 'weed-1',
        problemType: 'weed',
        urgency: 'high',
        method: 'chemical',
        products: [
            {
                name: '2,4-D + Dicamba',
                activeIngredient: 'Synthetic auxin',
                rate: '1 qt/acre',
                cost: 8.50,
                efficacy: 85
            }
        ],
        timing: 'Apply when weeds are 2-4 inches tall',
        conditions: 'Temperature below 85°F, low wind',
        expectedCost: 70.55,
        expectedYieldProtection: 20,
        environmentalImpact: 'medium',
        resistanceRisk: 'low'
    }
];

// Mock Regional Alerts
export const REGIONAL_ALERTS: RegionalAlert[] = [
    {
        id: 'alert-1',
        type: 'pest',
        name: 'Fall Armyworm',
        severity: 'warning',
        region: 'Central Valley',
        radius: 25,
        description: 'Significant fall armyworm activity detected in corn and sorghum fields. Multiple reports of economic damage.',
        affectedCrops: ['Corn', 'Sorghum', 'Wheat'],
        reportedCases: 47,
        trend: 'increasing',
        issuedDate: '2024-12-02',
        recommendations: [
            'Scout fields every 2-3 days',
            'Check for egg masses on leaf undersides',
            'Consider preventive treatment if population exceeds threshold',
            'Monitor weather conditions favorable for migration'
        ]
    },
    {
        id: 'alert-2',
        type: 'disease',
        name: 'Wheat Rust',
        severity: 'outbreak',
        region: 'Northern Plains',
        radius: 50,
        description: 'Widespread wheat rust outbreak confirmed. Favorable weather conditions for rapid spread.',
        affectedCrops: ['Wheat', 'Barley'],
        reportedCases: 128,
        trend: 'increasing',
        issuedDate: '2024-11-30',
        recommendations: [
            'Apply fungicide immediately if rust detected',
            'Use resistant varieties for future plantings',
            'Monitor wind patterns from affected areas',
            'Increase scouting frequency to twice weekly'
        ]
    }
];

// Helper functions
export function getPressureLevelColor(level: PressureLevel): string {
    switch (level) {
        case 'none': return 'text-gray-400 bg-gray-500/20';
        case 'low': return 'text-green-400 bg-green-500/20';
        case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
        case 'high': return 'text-orange-400 bg-orange-500/20';
        case 'severe': return 'text-red-400 bg-red-500/20';
    }
}

export function getUrgencyColor(urgency: string): string {
    switch (urgency) {
        case 'low': return 'text-blue-400 bg-blue-500/20';
        case 'medium': return 'text-yellow-400 bg-yellow-500/20';
        case 'high': return 'text-orange-400 bg-orange-500/20';
        case 'critical': return 'text-red-400 bg-red-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
}

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'watch': return 'text-blue-400 bg-blue-500/20';
        case 'warning': return 'text-yellow-400 bg-yellow-500/20';
        case 'outbreak': return 'text-red-400 bg-red-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
}
