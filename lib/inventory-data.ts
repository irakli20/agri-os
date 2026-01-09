/**
 * Inventory & Warehouse Data
 * 
 * Complete inventory tracking for chemicals, seeds, fertilizers, tools, and spare parts
 */

export type InventoryCategory = 'chemical' | 'seed' | 'fertilizer' | 'tool' | 'spare_part' | 'fuel';
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';

export interface InventoryItem {
    id: string;
    category: InventoryCategory;
    name: string;
    brand?: string;
    sku?: string;
    quantity: number;
    unit: string;
    reorderPoint: number;
    location: string; // Warehouse zone
    purchasePrice: number;
    currentValue: number;
    supplier: string;
    lastRestocked: string;
    expiryDate?: string;
    batchNumber?: string;
    status: InventoryStatus;
    usageRate?: number; // units per month
}

export interface WarehouseZone {
    id: string;
    name: string;
    capacity: number; // cubic feet
    currentUsage: number; // cubic feet
    temperature?: number; // °F
    humidity?: number; // %
    itemCount: number;
    categories: InventoryCategory[];
}

export interface InventoryAlert {
    id: string;
    type: 'low_stock' | 'expiring' | 'temperature' | 'pest' | 'maintenance';
    severity: 'critical' | 'warning' | 'info';
    item: string;
    message: string;
    actionRequired: string;
    dueDate?: string;
}

// Warehouse Zones
export const WAREHOUSE_ZONES: WarehouseZone[] = [
    {
        id: 'zone-a',
        name: 'Chemical Storage',
        capacity: 2000,
        currentUsage: 1450,
        temperature: 68,
        humidity: 45,
        itemCount: 24,
        categories: ['chemical'],
    },
    {
        id: 'zone-b',
        name: 'Seed Vault',
        capacity: 1500,
        currentUsage: 890,
        temperature: 55,
        humidity: 35,
        itemCount: 18,
        categories: ['seed'],
    },
    {
        id: 'zone-c',
        name: 'Fertilizer Bay',
        capacity: 3000,
        currentUsage: 2100,
        temperature: 72,
        humidity: 50,
        itemCount: 12,
        categories: ['fertilizer'],
    },
    {
        id: 'zone-d',
        name: 'Tool & Parts',
        capacity: 1000,
        currentUsage: 650,
        itemCount: 45,
        categories: ['tool', 'spare_part'],
    },
    {
        id: 'zone-e',
        name: 'Fuel Storage',
        capacity: 5000,
        currentUsage: 3200,
        temperature: 75,
        itemCount: 3,
        categories: ['fuel'],
    },
];

// Inventory Items
export const INVENTORY_ITEMS: InventoryItem[] = [
    // Chemicals
    {
        id: 'inv-chem-1',
        category: 'chemical',
        name: 'Glyphosate 41% Herbicide',
        brand: 'Roundup Pro',
        sku: 'RUP-GLY-41-2.5',
        quantity: 45,
        unit: 'gallons',
        reorderPoint: 20,
        location: 'Zone A - Shelf 3',
        purchasePrice: 85,
        currentValue: 3825,
        supplier: 'AgChem Supply Co.',
        lastRestocked: '2024-11-15',
        expiryDate: '2026-11-01',
        batchNumber: 'GLY2024-Q4-001',
        status: 'in_stock',
        usageRate: 12,
    },
    {
        id: 'inv-chem-2',
        category: 'chemical',
        name: 'Organic Neem Oil Insecticide',
        brand: 'Garden Safe',
        sku: 'GS-NEEM-1G',
        quantity: 8,
        unit: 'gallons',
        reorderPoint: 15,
        location: 'Zone A - Shelf 1',
        purchasePrice: 45,
        currentValue: 360,
        supplier: 'Organic Farm Supplies',
        lastRestocked: '2024-10-20',
        expiryDate: '2025-10-01',
        batchNumber: 'NEEM-2024-10',
        status: 'low_stock',
        usageRate: 6,
    },
    {
        id: 'inv-chem-3',
        category: 'chemical',
        name: 'Fungicide - Copper Sulfate',
        brand: 'Southern Ag',
        sku: 'SA-COP-SUL-4LB',
        quantity: 28,
        unit: 'lbs',
        reorderPoint: 10,
        location: 'Zone A - Shelf 5',
        purchasePrice: 32,
        currentValue: 896,
        supplier: 'AgChem Supply Co.',
        lastRestocked: '2024-11-28',
        expiryDate: '2027-06-01',
        batchNumber: 'COP-2024-11',
        status: 'in_stock',
        usageRate: 8,
    },
    {
        id: 'inv-chem-4',
        category: 'chemical',
        name: 'Insecticide - Pyrethrin',
        brand: 'PyGanic',
        sku: 'PYG-5.0-GAL',
        quantity: 3,
        unit: 'gallons',
        reorderPoint: 8,
        location: 'Zone A - Shelf 2',
        purchasePrice: 120,
        currentValue: 360,
        supplier: 'Organic Farm Supplies',
        lastRestocked: '2024-09-15',
        expiryDate: '2025-03-01',
        batchNumber: 'PYR-2024-09',
        status: 'expiring_soon',
        usageRate: 4,
    },

    // Seeds
    {
        id: 'inv-seed-1',
        category: 'seed',
        name: 'Lettuce Seeds - Romaine',
        brand: 'Johnny\'s Selected Seeds',
        sku: 'JSS-LET-ROM-1LB',
        quantity: 12,
        unit: 'lbs',
        reorderPoint: 5,
        location: 'Zone B - Bin 1',
        purchasePrice: 85,
        currentValue: 1020,
        supplier: 'Johnny\'s Selected Seeds',
        lastRestocked: '2024-11-01',
        expiryDate: '2025-12-01',
        batchNumber: 'ROM-2024-F',
        status: 'in_stock',
        usageRate: 3,
    },
    {
        id: 'inv-seed-2',
        category: 'seed',
        name: 'Broccoli Seeds - Premium Crop',
        brand: 'High Mowing Organic',
        sku: 'HMO-BRO-PC-500G',
        quantity: 2,
        unit: 'lbs',
        reorderPoint: 4,
        location: 'Zone B - Bin 2',
        purchasePrice: 95,
        currentValue: 190,
        supplier: 'High Mowing Organic Seeds',
        lastRestocked: '2024-10-10',
        expiryDate: '2025-10-01',
        batchNumber: 'BRO-2024-10',
        status: 'low_stock',
        usageRate: 2,
    },
    {
        id: 'inv-seed-3',
        category: 'seed',
        name: 'Strawberry Crowns - Albion',
        brand: 'Nourse Farms',
        sku: 'NF-STR-ALB-100',
        quantity: 500,
        unit: 'crowns',
        reorderPoint: 200,
        location: 'Zone B - Cold Storage',
        purchasePrice: 0.85,
        currentValue: 425,
        supplier: 'Nourse Farms',
        lastRestocked: '2024-11-20',
        status: 'in_stock',
        usageRate: 150,
    },

    // Fertilizers
    {
        id: 'inv-fert-1',
        category: 'fertilizer',
        name: 'NPK 10-10-10 Balanced Fertilizer',
        brand: 'Scotts',
        sku: 'SCT-NPK-101010-50LB',
        quantity: 85,
        unit: 'bags (50lb)',
        reorderPoint: 30,
        location: 'Zone C - Pallet 1',
        purchasePrice: 28,
        currentValue: 2380,
        supplier: 'Farm Supply Direct',
        lastRestocked: '2024-11-10',
        status: 'in_stock',
        usageRate: 25,
    },
    {
        id: 'inv-fert-2',
        category: 'fertilizer',
        name: 'Organic Compost - Premium Blend',
        brand: 'Black Gold',
        sku: 'BG-COMP-1CY',
        quantity: 15,
        unit: 'cubic yards',
        reorderPoint: 10,
        location: 'Zone C - Outdoor Bay',
        purchasePrice: 45,
        currentValue: 675,
        supplier: 'Local Compost Co.',
        lastRestocked: '2024-11-25',
        status: 'in_stock',
        usageRate: 8,
    },
    {
        id: 'inv-fert-3',
        category: 'fertilizer',
        name: 'Calcium Nitrate',
        brand: 'YaraLiva',
        sku: 'YL-CANO3-55LB',
        quantity: 12,
        unit: 'bags (55lb)',
        reorderPoint: 20,
        location: 'Zone C - Pallet 3',
        purchasePrice: 42,
        currentValue: 504,
        supplier: 'Yara North America',
        lastRestocked: '2024-10-15',
        status: 'low_stock',
        usageRate: 10,
    },

    // Fuel
    {
        id: 'inv-fuel-1',
        category: 'fuel',
        name: 'Diesel Fuel',
        quantity: 2500,
        unit: 'gallons',
        reorderPoint: 1000,
        location: 'Zone E - Tank 1',
        purchasePrice: 3.85,
        currentValue: 9625,
        supplier: 'Valley Fuel Co.',
        lastRestocked: '2024-11-28',
        status: 'in_stock',
        usageRate: 450,
    },
    {
        id: 'inv-fuel-2',
        category: 'fuel',
        name: 'Gasoline - 87 Octane',
        quantity: 650,
        unit: 'gallons',
        reorderPoint: 300,
        location: 'Zone E - Tank 2',
        purchasePrice: 3.25,
        currentValue: 2112.50,
        supplier: 'Valley Fuel Co.',
        lastRestocked: '2024-11-30',
        status: 'in_stock',
        usageRate: 180,
    },
];

// Inventory Alerts
export const INVENTORY_ALERTS: InventoryAlert[] = [
    {
        id: 'alert-1',
        type: 'low_stock',
        severity: 'warning',
        item: 'Organic Neem Oil Insecticide',
        message: 'Stock below reorder point',
        actionRequired: 'Reorder 20 gallons',
        dueDate: '2024-12-10',
    },
    {
        id: 'alert-2',
        type: 'expiring',
        severity: 'critical',
        item: 'Insecticide - Pyrethrin',
        message: 'Expires in 87 days',
        actionRequired: 'Use or dispose before expiry',
        dueDate: '2025-03-01',
    },
    {
        id: 'alert-3',
        type: 'low_stock',
        severity: 'warning',
        item: 'Broccoli Seeds - Premium Crop',
        message: 'Only 2 lbs remaining',
        actionRequired: 'Reorder for spring planting',
        dueDate: '2024-12-15',
    },
    {
        id: 'alert-4',
        type: 'low_stock',
        severity: 'critical',
        item: 'Calcium Nitrate',
        message: 'Stock critically low',
        actionRequired: 'Immediate reorder needed',
        dueDate: '2024-12-05',
    },
    {
        id: 'alert-5',
        type: 'temperature',
        severity: 'info',
        item: 'Seed Vault (Zone B)',
        message: 'Temperature optimal at 55°F',
        actionRequired: 'No action required',
    },
];

// Helper Functions
export function getInventoryStats() {
    const total = INVENTORY_ITEMS.length;
    const lowStock = INVENTORY_ITEMS.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length;
    const expiringSoon = INVENTORY_ITEMS.filter(i => i.status === 'expiring_soon' || i.status === 'expired').length;
    const totalValue = INVENTORY_ITEMS.reduce((sum, i) => sum + i.currentValue, 0);

    return {
        total,
        lowStock,
        expiringSoon,
        totalValue,
        criticalAlerts: INVENTORY_ALERTS.filter(a => a.severity === 'critical').length,
    };
}

export function getInventoryByCategory(category: InventoryCategory) {
    return INVENTORY_ITEMS.filter(i => i.category === category);
}

export function getExpiringItems(daysThreshold: number = 90) {
    const now = new Date();
    return INVENTORY_ITEMS.filter(item => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
    });
}

export function getLowStockItems() {
    return INVENTORY_ITEMS.filter(i => i.quantity <= i.reorderPoint);
}
