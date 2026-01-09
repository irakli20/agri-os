/**
 * Equipment & Machinery Data
 * 
 * Comprehensive equipment registry for farm management
 */

export type EquipmentCategory = 'drone' | 'machinery' | 'irrigation' | 'tool' | 'chemical' | 'seed';
export type EquipmentStatus = 'available' | 'in-use' | 'maintenance' | 'retired';

export interface MaintenanceRecord {
    id: string;
    date: string;
    type: 'routine' | 'repair' | 'inspection';
    cost: number;
    technician?: string;
    notes: string;
    nextDue?: string;
}

export interface Equipment {
    id: string;
    category: EquipmentCategory;
    name: string;
    model?: string;
    manufacturer?: string;
    status: EquipmentStatus;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    location: string;
    assignedTo?: string;
    assignedField?: string;
    maintenanceSchedule: MaintenanceRecord[];
    usageHours?: number;
    specifications?: Record<string, string>;
    imageUrl?: string;
}

// Drones (from existing data, enhanced)
export const DRONES_EQUIPMENT: Equipment[] = [
    {
        id: 'eq-drone-1',
        category: 'drone',
        name: 'DJI Agras T40',
        model: 'T40',
        manufacturer: 'DJI',
        status: 'available',
        purchaseDate: '2023-06-15',
        purchasePrice: 15000,
        currentValue: 12000,
        location: 'Hangar A',
        usageHours: 342,
        maintenanceSchedule: [
            {
                id: 'm1',
                date: '2024-11-25',
                type: 'routine',
                cost: 250,
                technician: 'John Smith',
                notes: 'Battery check, propeller replacement, firmware update',
                nextDue: '2025-02-25',
            },
        ],
        specifications: {
            'Max Payload': '40kg',
            'Flight Time': '18 min (full load)',
            'Spray Width': '11m',
            'Tank Capacity': '40L',
        },
    },
    {
        id: 'eq-drone-2',
        category: 'drone',
        name: 'DJI Matrice 350 RTK',
        model: 'M350 RTK',
        manufacturer: 'DJI',
        status: 'in-use',
        purchaseDate: '2024-03-10',
        purchasePrice: 8500,
        currentValue: 7800,
        location: 'Field Operations',
        assignedTo: 'Mike Johnson',
        assignedField: 'field-1',
        usageHours: 187,
        maintenanceSchedule: [
            {
                id: 'm2',
                date: '2024-11-28',
                type: 'inspection',
                cost: 150,
                notes: 'Pre-flight inspection, camera calibration',
                nextDue: '2025-01-28',
            },
        ],
        specifications: {
            'Max Flight Time': '55 min',
            'Max Speed': '23 m/s',
            'Camera': 'Zenmuse P1',
            'RTK': 'Centimeter-level positioning',
        },
    },
    {
        id: 'eq-drone-3',
        category: 'drone',
        name: 'DJI Phantom 4 Multispectral',
        model: 'P4M',
        manufacturer: 'DJI',
        status: 'maintenance',
        purchaseDate: '2022-08-20',
        purchasePrice: 6500,
        currentValue: 4200,
        location: 'Repair Shop',
        usageHours: 521,
        maintenanceSchedule: [
            {
                id: 'm3',
                date: '2024-11-20',
                type: 'repair',
                cost: 450,
                technician: 'Sarah Lee',
                notes: 'Gimbal replacement, sensor recalibration',
                nextDue: '2024-12-05',
            },
        ],
        specifications: {
            'Sensors': '6 (RGB + 5 multispectral)',
            'Flight Time': '27 min',
            'GSD': '2.74 cm/pixel @ 100m',
        },
    },
];

// Tractors & Heavy Machinery
export const MACHINERY_EQUIPMENT: Equipment[] = [
    {
        id: 'eq-tractor-1',
        category: 'machinery',
        name: 'John Deere 8R 370',
        model: '8R 370',
        manufacturer: 'John Deere',
        status: 'available',
        purchaseDate: '2021-04-12',
        purchasePrice: 285000,
        currentValue: 220000,
        location: 'Main Barn',
        usageHours: 1842,
        maintenanceSchedule: [
            {
                id: 'm4',
                date: '2024-10-15',
                type: 'routine',
                cost: 1200,
                technician: 'Deere Service',
                notes: 'Oil change, filter replacement, hydraulic system check',
                nextDue: '2025-01-15',
            },
        ],
        specifications: {
            'Engine Power': '370 HP',
            'Transmission': 'AutoPowr IVT',
            'Hitch Capacity': '18,500 lbs',
            'Fuel Capacity': '265 gal',
        },
    },
    {
        id: 'eq-tractor-2',
        category: 'machinery',
        name: 'Case IH Magnum 340',
        model: 'Magnum 340',
        manufacturer: 'Case IH',
        status: 'in-use',
        purchaseDate: '2022-09-05',
        purchasePrice: 295000,
        currentValue: 250000,
        location: 'North Valley',
        assignedTo: 'Tom Wilson',
        assignedField: 'field-1',
        usageHours: 956,
        maintenanceSchedule: [
            {
                id: 'm5',
                date: '2024-11-10',
                type: 'inspection',
                cost: 350,
                notes: 'Pre-season inspection, tire pressure check',
                nextDue: '2025-02-10',
            },
        ],
        specifications: {
            'Engine Power': '340 HP',
            'Transmission': 'CVXDrive',
            'PTO': '1000 rpm',
        },
    },
    {
        id: 'eq-sprayer-1',
        category: 'machinery',
        name: 'John Deere R4045',
        model: 'R4045',
        manufacturer: 'John Deere',
        status: 'available',
        purchaseDate: '2023-02-20',
        purchasePrice: 425000,
        currentValue: 380000,
        location: 'Equipment Shed',
        usageHours: 412,
        maintenanceSchedule: [
            {
                id: 'm6',
                date: '2024-11-05',
                type: 'routine',
                cost: 850,
                notes: 'Nozzle cleaning, pump inspection, tank flush',
                nextDue: '2025-03-05',
            },
        ],
        specifications: {
            'Tank Capacity': '1200 gal',
            'Boom Width': '120 ft',
            'Engine': '373 HP',
            'Speed': '30 mph',
        },
    },
];

// Irrigation Equipment
export const IRRIGATION_EQUIPMENT: Equipment[] = [
    {
        id: 'eq-pivot-1',
        category: 'irrigation',
        name: 'Valley 8000 Series Center Pivot',
        model: '8120',
        manufacturer: 'Valley',
        status: 'in-use',
        purchaseDate: '2020-05-10',
        purchasePrice: 85000,
        currentValue: 65000,
        location: 'Field 2',
        assignedField: 'field-2',
        usageHours: 3200,
        maintenanceSchedule: [
            {
                id: 'm7',
                date: '2024-09-15',
                type: 'routine',
                cost: 450,
                notes: 'Sprinkler head replacement, electrical check',
                nextDue: '2025-03-15',
            },
        ],
        specifications: {
            'Coverage': '125 acres',
            'Length': '1320 ft',
            'Flow Rate': '800 GPM',
        },
    },
    {
        id: 'eq-pump-1',
        category: 'irrigation',
        name: 'Berkeley B6TQBM',
        model: 'B6TQBM',
        manufacturer: 'Berkeley',
        status: 'available',
        purchaseDate: '2022-03-15',
        purchasePrice: 4500,
        currentValue: 3800,
        location: 'Pump House',
        usageHours: 1250,
        maintenanceSchedule: [],
        specifications: {
            'Flow Rate': '300 GPM',
            'Head': '150 ft',
            'Power': '15 HP',
        },
    },
];

// Tools
export const TOOLS_EQUIPMENT: Equipment[] = [
    {
        id: 'eq-tool-1',
        category: 'tool',
        name: 'Soil Moisture Sensor Kit',
        model: 'SMS-100',
        manufacturer: 'Spectrum Technologies',
        status: 'available',
        purchaseDate: '2023-06-01',
        purchasePrice: 1200,
        currentValue: 1000,
        location: 'Tool Shed',
        maintenanceSchedule: [],
        specifications: {
            'Sensors': '10 units',
            'Depth Range': '0-24 inches',
            'Connectivity': 'Wireless',
        },
    },
    {
        id: 'eq-tool-2',
        category: 'tool',
        name: 'Handheld GPS Unit',
        model: 'Trimble Geo 7X',
        manufacturer: 'Trimble',
        status: 'in-use',
        purchaseDate: '2022-11-10',
        purchasePrice: 5500,
        currentValue: 4200,
        location: 'Field Operations',
        assignedTo: 'Mike Johnson',
        maintenanceSchedule: [],
        specifications: {
            'Accuracy': 'Sub-meter',
            'Display': '4.3" touchscreen',
            'Battery': '10 hours',
        },
    },
];

// All Equipment Combined
export const ALL_EQUIPMENT: Equipment[] = [
    ...DRONES_EQUIPMENT,
    ...MACHINERY_EQUIPMENT,
    ...IRRIGATION_EQUIPMENT,
    ...TOOLS_EQUIPMENT,
];

// Equipment Statistics
export function getEquipmentStats() {
    const total = ALL_EQUIPMENT.length;
    const available = ALL_EQUIPMENT.filter(e => e.status === 'available').length;
    const inUse = ALL_EQUIPMENT.filter(e => e.status === 'in-use').length;
    const maintenance = ALL_EQUIPMENT.filter(e => e.status === 'maintenance').length;
    const totalValue = ALL_EQUIPMENT.reduce((sum, e) => sum + e.currentValue, 0);
    const totalUsageHours = ALL_EQUIPMENT.reduce((sum, e) => sum + (e.usageHours || 0), 0);

    return {
        total,
        available,
        inUse,
        maintenance,
        totalValue,
        totalUsageHours,
        utilizationRate: ((inUse / total) * 100).toFixed(1),
    };
}

// Get equipment by category
export function getEquipmentByCategory(category: EquipmentCategory) {
    return ALL_EQUIPMENT.filter(e => e.category === category);
}

// Get equipment needing maintenance
export function getMaintenanceDue() {
    const now = new Date();
    return ALL_EQUIPMENT.filter(e => {
        const lastMaintenance = e.maintenanceSchedule[e.maintenanceSchedule.length - 1];
        if (!lastMaintenance?.nextDue) return false;
        const dueDate = new Date(lastMaintenance.nextDue);
        const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 30;
    });
}
