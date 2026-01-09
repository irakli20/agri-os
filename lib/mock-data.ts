/**
 * Mock Data for Agri-OS
 * 
 * Realistic farm data for "Greenfield Farms" - a 450-acre operation in California
 */

export interface Farm {
    name: string;
    location: string;
    totalAcres: number;
    established: string;
}

export interface Field {
    id: string;
    name: string;
    acres: number;
    crop: string;
    plantingDate: string;
    ndviScore: number; // 0-1
    healthStatus: 'excellent' | 'good' | 'attention' | 'critical';
    lastFlightDate: string;
    coordinates: [number, number][]; // GeoJSON polygon
}

export interface Drone {
    id: string;
    model: string;
    status: 'ready' | 'in-flight' | 'maintenance' | 'charging';
    batteryLevel: number; // 0-100
    flightHours: number;
    lastMaintenance: string;
    currentTask?: string;
}

export interface Task {
    id: string;
    type: 'spray' | 'survey' | 'sampling';
    fieldId: string;
    droneId: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    scheduledDate: string;
    description: string;
}

export interface Flight {
    id: string;
    droneId: string;
    fieldId: string;
    date: string;
    duration: number; // minutes
    coverageArea: number; // acres
    dataCollected: string[];
}

// Farm Profile
export const FARM: Farm = {
    name: 'Greenfield Farms',
    location: 'Salinas Valley, California',
    totalAcres: 450,
    established: '1987',
};

// Fields
export const FIELDS: Field[] = [
    {
        id: 'field-1',
        name: 'North Valley',
        acres: 120,
        crop: 'Lettuce',
        plantingDate: '2024-10-15',
        ndviScore: 0.78,
        healthStatus: 'good',
        lastFlightDate: '2024-12-02',
        coordinates: [
            [-121.6550, 36.6800],
            [-121.6500, 36.6800],
            [-121.6500, 36.6750],
            [-121.6550, 36.6750],
            [-121.6550, 36.6800],
        ],
    },
    {
        id: 'field-2',
        name: 'South Ridge',
        acres: 95,
        crop: 'Broccoli',
        plantingDate: '2024-11-01',
        ndviScore: 0.85,
        healthStatus: 'excellent',
        lastFlightDate: '2024-12-03',
        coordinates: [
            [-121.6600, 36.6750],
            [-121.6550, 36.6750],
            [-121.6550, 36.6700],
            [-121.6600, 36.6700],
            [-121.6600, 36.6750],
        ],
    },
    {
        id: 'field-3',
        name: 'East Meadow',
        acres: 80,
        crop: 'Strawberries',
        plantingDate: '2024-09-20',
        ndviScore: 0.62,
        healthStatus: 'attention',
        lastFlightDate: '2024-12-01',
        coordinates: [
            [-121.6500, 36.6800],
            [-121.6450, 36.6800],
            [-121.6450, 36.6750],
            [-121.6500, 36.6750],
            [-121.6500, 36.6800],
        ],
    },
    {
        id: 'field-4',
        name: 'West Plateau',
        acres: 110,
        crop: 'Cauliflower',
        plantingDate: '2024-10-28',
        ndviScore: 0.81,
        healthStatus: 'good',
        lastFlightDate: '2024-11-30',
        coordinates: [
            [-121.6650, 36.6800],
            [-121.6600, 36.6800],
            [-121.6600, 36.6750],
            [-121.6650, 36.6750],
            [-121.6650, 36.6800],
        ],
    },
    {
        id: 'field-5',
        name: 'Central Basin',
        acres: 45,
        crop: 'Spinach',
        plantingDate: '2024-11-10',
        ndviScore: 0.45,
        healthStatus: 'critical',
        lastFlightDate: '2024-12-03',
        coordinates: [
            [-121.6575, 36.6775],
            [-121.6550, 36.6775],
            [-121.6550, 36.6750],
            [-121.6575, 36.6750],
            [-121.6575, 36.6775],
        ],
    },
];

// Drones
export const DRONES: Drone[] = [
    {
        id: 'drone-1',
        model: 'DJI Agras T40',
        status: 'ready',
        batteryLevel: 95,
        flightHours: 342,
        lastMaintenance: '2024-11-25',
    },
    {
        id: 'drone-2',
        model: 'DJI Matrice 350 RTK',
        status: 'in-flight',
        batteryLevel: 68,
        flightHours: 187,
        lastMaintenance: '2024-11-28',
        currentTask: 'NDVI Survey - North Valley',
    },
    {
        id: 'drone-3',
        model: 'DJI Phantom 4 Multispectral',
        status: 'charging',
        batteryLevel: 42,
        flightHours: 521,
        lastMaintenance: '2024-11-20',
    },
];

// Tasks
export const TASKS: Task[] = [
    {
        id: 'task-1',
        type: 'spray',
        fieldId: 'field-5',
        droneId: 'drone-1',
        priority: 'high',
        status: 'pending',
        scheduledDate: '2024-12-04',
        description: 'Fungicide application - Central Basin (Spinach)',
    },
    {
        id: 'task-2',
        type: 'survey',
        fieldId: 'field-1',
        droneId: 'drone-2',
        priority: 'medium',
        status: 'in-progress',
        scheduledDate: '2024-12-04',
        description: 'NDVI health survey - North Valley (Lettuce)',
    },
    {
        id: 'task-3',
        type: 'survey',
        fieldId: 'field-3',
        droneId: 'drone-3',
        priority: 'high',
        status: 'pending',
        scheduledDate: '2024-12-04',
        description: 'Thermal stress analysis - East Meadow (Strawberries)',
    },
    {
        id: 'task-4',
        type: 'sampling',
        fieldId: 'field-2',
        droneId: 'drone-1',
        priority: 'low',
        status: 'pending',
        scheduledDate: '2024-12-05',
        description: 'Soil moisture sampling - South Ridge (Broccoli)',
    },
    {
        id: 'task-5',
        type: 'spray',
        fieldId: 'field-4',
        droneId: 'drone-3',
        priority: 'medium',
        status: 'pending',
        scheduledDate: '2024-12-05',
        description: 'Fertilizer application - West Plateau (Cauliflower)',
    },
];

// Recent Flights
export const RECENT_FLIGHTS: Flight[] = [
    {
        id: 'flight-1',
        droneId: 'drone-2',
        fieldId: 'field-2',
        date: '2024-12-03T14:30:00Z',
        duration: 28,
        coverageArea: 95,
        dataCollected: ['RGB', 'NDVI', 'Thermal'],
    },
    {
        id: 'flight-2',
        droneId: 'drone-3',
        fieldId: 'field-5',
        date: '2024-12-03T10:15:00Z',
        duration: 18,
        coverageArea: 45,
        dataCollected: ['RGB', 'NDVI'],
    },
    {
        id: 'flight-3',
        droneId: 'drone-1',
        fieldId: 'field-1',
        date: '2024-12-02T16:45:00Z',
        duration: 35,
        coverageArea: 120,
        dataCollected: ['RGB', 'NDVI', 'Thermal', 'Elevation'],
    },
    {
        id: 'flight-4',
        droneId: 'drone-2',
        fieldId: 'field-3',
        date: '2024-12-01T11:20:00Z',
        duration: 22,
        coverageArea: 80,
        dataCollected: ['RGB', 'NDVI'],
    },
    {
        id: 'flight-5',
        droneId: 'drone-3',
        fieldId: 'field-4',
        date: '2024-11-30T09:00:00Z',
        duration: 31,
        coverageArea: 110,
        dataCollected: ['RGB', 'NDVI', 'Thermal'],
    },
];

// Weather Data
export interface WeatherData {
    current: {
        temp: number;
        condition: string;
        windSpeed: number;
        humidity: number;
        precipitation: number;
    };
    forecast: Array<{
        date: string;
        high: number;
        low: number;
        condition: string;
        precipitation: number;
    }>;
}

export const WEATHER: WeatherData = {
    current: {
        temp: 72,
        condition: 'Partly Cloudy',
        windSpeed: 8,
        humidity: 45,
        precipitation: 0,
    },
    forecast: [
        { date: '2024-12-04', high: 74, low: 58, condition: 'Sunny', precipitation: 0 },
        { date: '2024-12-05', high: 76, low: 60, condition: 'Sunny', precipitation: 0 },
        { date: '2024-12-06', high: 73, low: 59, condition: 'Partly Cloudy', precipitation: 10 },
        { date: '2024-12-07', high: 70, low: 56, condition: 'Cloudy', precipitation: 30 },
        { date: '2024-12-08', high: 68, low: 54, condition: 'Rain', precipitation: 70 },
        { date: '2024-12-09', high: 71, low: 57, condition: 'Partly Cloudy', precipitation: 20 },
        { date: '2024-12-10', high: 75, low: 61, condition: 'Sunny', precipitation: 0 },
    ],
};
