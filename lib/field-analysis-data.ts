// @ts-nocheck
/**
 * Advanced Field Analysis Data
 * 
 * Multispectral imagery analysis, soil data, and zone management
 * Inspired by Pix4D Fields, Solvi, and Taranis platforms
 */
import { BeCropReport } from './services/biomemakers';

export interface MultispectralLayer {
    id: string;
    name: string;
    type: 'ndvi' | 'ndre' | 'gndvi' | 'savi' | 'evi' | 'rgb' | 'thermal';
    description: string;
    colorScale: string[];
    unit?: string;
}

export interface SoilSample {
    id: string;
    fieldId: string;
    location: [number, number];
    depth: number; // cm
    ph: number;
    nitrogen: number; // ppm
    phosphorus: number; // ppm
    potassium: number; // ppm
    organicMatter: number; // %
    moisture: number; // %
    temperature: number; // °C
    sampledDate: string;
    biomemakersReport?: BeCropReport;
}

export interface ManagementZone {
    id: string;
    fieldId: string;
    name: string;
    area: number; // acres
    avgNDVI: number;
    soilType: string;
    recommendation: string;
    coordinates: [number, number][];
}

export interface FieldAnalysis {
    fieldId: string;
    captureDate: string;
    resolution: number; // cm/pixel
    coverage: number; // %
    indices: {
        ndvi: { min: number; max: number; avg: number; std: number };
        ndre: { min: number; max: number; avg: number; std: number };
        thermal: { min: number; max: number; avg: number; std: number };
    };
    anomalies: Array<{
        type: 'stress' | 'disease' | 'nutrient' | 'water';
        severity: 'low' | 'medium' | 'high';
        area: number; // acres
        location: [number, number];
    }>;
}

// Multispectral Layers
export const MULTISPECTRAL_LAYERS: MultispectralLayer[] = [
    {
        id: 'ndvi',
        name: 'NDVI',
        type: 'ndvi',
        description: 'Normalized Difference Vegetation Index - Overall plant health',
        colorScale: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
    },
    {
        id: 'ndre',
        name: 'NDRE',
        type: 'ndre',
        description: 'Normalized Difference Red Edge - Chlorophyll content',
        colorScale: ['#8e0152', '#c51b7d', '#de77ae', '#7fbc41', '#4d9221', '#276419'],
    },
    {
        id: 'gndvi',
        name: 'GNDVI',
        type: 'gndvi',
        description: 'Green NDVI - Nitrogen status',
        colorScale: ['#a50026', '#d73027', '#fdae61', '#a6d96a', '#66bd63', '#1a9850'],
    },
    {
        id: 'savi',
        name: 'SAVI',
        type: 'savi',
        description: 'Soil Adjusted Vegetation Index - Minimizes soil brightness',
        colorScale: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'],
    },
    {
        id: 'thermal',
        name: 'Thermal',
        type: 'thermal',
        description: 'Surface temperature - Water stress detection',
        colorScale: ['#313695', '#4575b4', '#abd9e9', '#fee090', '#f46d43', '#a50026'],
        unit: '°F',
    },
    {
        id: 'lidar-elevation',
        name: 'LIDAR Elevation',
        type: 'elevation' as any,
        description: 'Ground Elevation Map from LIDAR scan',
        colorScale: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'], // Red (low) to Green (high)
        unit: 'ft',
    },
    {
        id: 'lidar-absolute',
        name: 'LIDAR Veg. Height (Abs)',
        type: 'absolute' as any,
        description: 'Absolute Vegetation Height (Ground + Crop)',
        colorScale: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'], // Red (low) to Green (high)
        unit: 'ft',
    },
    {
        id: 'lidar-crop',
        name: 'LIDAR Crop Height (Rel)',
        type: 'crop-height' as any,
        description: 'Relative Crop Height (Absolute - Ground)',
        colorScale: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'], // Red (low) to Green (high)
        unit: 'ft',
    },
];

// Soil Samples for North Valley field
export const SOIL_SAMPLES: SoilSample[] = [
    {
        id: 'soil-1',
        fieldId: 'field-1',
        location: [-121.6525, 36.6785],
        depth: 15,
        ph: 6.8,
        nitrogen: 45,
        phosphorus: 28,
        potassium: 185,
        organicMatter: 3.2,
        moisture: 22,
        temperature: 18,
        sampledDate: '2024-11-28',
    },
    {
        id: 'soil-2',
        fieldId: 'field-1',
        location: [-121.6510, 36.6775],
        depth: 15,
        ph: 7.1,
        nitrogen: 38,
        phosphorus: 32,
        potassium: 195,
        organicMatter: 2.8,
        moisture: 18,
        temperature: 19,
        sampledDate: '2024-11-28',
    },
    {
        id: 'soil-3',
        fieldId: 'field-1',
        location: [-121.6535, 36.6765],
        depth: 15,
        ph: 6.5,
        nitrogen: 52,
        phosphorus: 25,
        potassium: 175,
        organicMatter: 3.8,
        moisture: 25,
        temperature: 17,
        sampledDate: '2024-11-28',
    },
    {
        id: 'soil-4',
        fieldId: 'field-1',
        location: [-121.6520, 36.6755],
        depth: 15,
        ph: 6.9,
        nitrogen: 41,
        phosphorus: 30,
        potassium: 188,
        organicMatter: 3.1,
        moisture: 20,
        temperature: 18,
        sampledDate: '2024-11-28',
    },
];

// Management Zones for North Valley
export const MANAGEMENT_ZONES: ManagementZone[] = [
    {
        id: 'zone-1',
        fieldId: 'field-1',
        name: 'High Productivity Zone',
        area: 45,
        avgNDVI: 0.82,
        soilType: 'Loam',
        recommendation: 'Maintain current fertility program',
        coordinates: [
            [-121.6550, 36.6800],
            [-121.6520, 36.6800],
            [-121.6520, 36.6775],
            [-121.6550, 36.6775],
            [-121.6550, 36.6800],
        ],
    },
    {
        id: 'zone-2',
        fieldId: 'field-1',
        name: 'Medium Productivity Zone',
        area: 50,
        avgNDVI: 0.72,
        soilType: 'Sandy Loam',
        recommendation: 'Increase nitrogen by 15%, improve irrigation',
        coordinates: [
            [-121.6520, 36.6800],
            [-121.6500, 36.6800],
            [-121.6500, 36.6770],
            [-121.6520, 36.6770],
            [-121.6520, 36.6800],
        ],
    },
    {
        id: 'zone-3',
        fieldId: 'field-1',
        name: 'Low Productivity Zone',
        area: 25,
        avgNDVI: 0.58,
        soilType: 'Clay Loam',
        recommendation: 'Soil amendment needed, consider drainage improvement',
        coordinates: [
            [-121.6520, 36.6770],
            [-121.6500, 36.6770],
            [-121.6500, 36.6750],
            [-121.6520, 36.6750],
            [-121.6520, 36.6770],
        ],
    },
];

// Field Analysis Data
export const FIELD_ANALYSES: FieldAnalysis[] = [
    {
        fieldId: 'field-1',
        captureDate: '2024-12-02T14:30:00Z',
        resolution: 5, // 5cm/pixel
        coverage: 98.5,
        indices: {
            ndvi: { min: 0.42, max: 0.89, avg: 0.78, std: 0.12 },
            ndre: { min: 0.38, max: 0.82, avg: 0.71, std: 0.11 },
            thermal: { min: 68, max: 84, avg: 75, std: 4.2 },
        },
        anomalies: [
            {
                type: 'water',
                severity: 'medium',
                area: 3.2,
                location: [-121.6515, 36.6760],
            },
            {
                type: 'nutrient',
                severity: 'low',
                area: 1.8,
                location: [-121.6505, 36.6755],
            },
        ],
    },
    {
        fieldId: 'field-3',
        captureDate: '2024-12-01T11:20:00Z',
        resolution: 5,
        coverage: 97.2,
        indices: {
            ndvi: { min: 0.35, max: 0.75, avg: 0.62, std: 0.15 },
            ndre: { min: 0.32, max: 0.68, avg: 0.58, std: 0.13 },
            thermal: { min: 72, max: 88, avg: 79, std: 5.1 },
        },
        anomalies: [
            {
                type: 'stress',
                severity: 'high',
                area: 5.5,
                location: [-121.6475, 36.6775],
            },
            {
                type: 'disease',
                severity: 'medium',
                area: 2.1,
                location: [-121.6465, 36.6765],
            },
        ],
    },
];
