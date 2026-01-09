/**
 * Procurement & Price Scouting Data
 * 
 * Automated price comparison, supplier management, and deal finding
 */

export interface Supplier {
    id: string;
    name: string;
    rating: number;
    reliability: number; // 0-100%
    deliverySpeed: 'fast' | 'medium' | 'slow';
    minOrder: number;
    categories: string[];
    website: string;
    logo?: string;
}

export interface PriceQuote {
    id: string;
    supplierId: string;
    productId: string; // Links to InventoryItem
    price: number;
    unit: string;
    minQuantity: number;
    bulkDiscounts: {
        quantity: number;
        price: number;
    }[];
    availability: 'in_stock' | 'low_stock' | 'backordered';
    deliveryDays: number;
    shippingCost: number;
    lastUpdated: string;
}

export interface DealAlert {
    id: string;
    productId: string;
    productName: string;
    supplierId: string;
    supplierName: string;
    normalPrice: number;
    dealPrice: number;
    savings: number;
    savingsPercent: number;
    expiresAt: string;
    urgency: 'high' | 'medium' | 'low';
    type: 'flash_sale' | 'clearance' | 'bulk_discount' | 'seasonal';
}

// Suppliers
export const SUPPLIERS: Supplier[] = [
    {
        id: 'sup-1',
        name: 'AgChem Supply Co.',
        rating: 4.8,
        reliability: 98,
        deliverySpeed: 'fast',
        minOrder: 500,
        categories: ['chemical', 'fertilizer'],
        website: 'agchemsupply.com',
    },
    {
        id: 'sup-2',
        name: 'Valley Fuel Co.',
        rating: 4.9,
        reliability: 99,
        deliverySpeed: 'fast',
        minOrder: 100,
        categories: ['fuel'],
        website: 'valleyfuel.com',
    },
    {
        id: 'sup-3',
        name: 'Farm Supply Direct',
        rating: 4.5,
        reliability: 92,
        deliverySpeed: 'medium',
        minOrder: 0,
        categories: ['tool', 'spare_part', 'fertilizer'],
        website: 'farmsupplydirect.com',
    },
    {
        id: 'sup-4',
        name: 'Johnny\'s Selected Seeds',
        rating: 4.9,
        reliability: 97,
        deliverySpeed: 'medium',
        minOrder: 50,
        categories: ['seed', 'tool'],
        website: 'johnnyseeds.com',
    },
    {
        id: 'sup-5',
        name: 'Global Ag Wholesalers',
        rating: 4.2,
        reliability: 85,
        deliverySpeed: 'slow',
        minOrder: 2000,
        categories: ['chemical', 'fertilizer', 'seed'],
        website: 'globalag.com',
    },
];

// Price Quotes (Mocking real-time data)
export const PRICE_QUOTES: PriceQuote[] = [
    // Glyphosate Quotes
    {
        id: 'qt-1',
        supplierId: 'sup-1',
        productId: 'inv-chem-1', // Glyphosate
        price: 85.00,
        unit: 'gallon',
        minQuantity: 1,
        bulkDiscounts: [{ quantity: 10, price: 82.50 }, { quantity: 50, price: 78.00 }],
        availability: 'in_stock',
        deliveryDays: 2,
        shippingCost: 25,
        lastUpdated: '2024-12-04T10:00:00Z',
    },
    {
        id: 'qt-2',
        supplierId: 'sup-3',
        productId: 'inv-chem-1',
        price: 88.50,
        unit: 'gallon',
        minQuantity: 1,
        bulkDiscounts: [{ quantity: 5, price: 85.00 }],
        availability: 'in_stock',
        deliveryDays: 4,
        shippingCost: 15,
        lastUpdated: '2024-12-04T09:30:00Z',
    },
    {
        id: 'qt-3',
        supplierId: 'sup-5',
        productId: 'inv-chem-1',
        price: 75.00,
        unit: 'gallon',
        minQuantity: 100, // Bulk only
        bulkDiscounts: [],
        availability: 'in_stock',
        deliveryDays: 14,
        shippingCost: 150,
        lastUpdated: '2024-12-03T15:00:00Z',
    },

    // Fertilizer Quotes
    {
        id: 'qt-4',
        supplierId: 'sup-3',
        productId: 'inv-fert-1', // NPK 10-10-10
        price: 28.00,
        unit: 'bag',
        minQuantity: 1,
        bulkDiscounts: [{ quantity: 40, price: 25.00 }],
        availability: 'in_stock',
        deliveryDays: 3,
        shippingCost: 50,
        lastUpdated: '2024-12-04T11:00:00Z',
    },
    {
        id: 'qt-5',
        supplierId: 'sup-1',
        productId: 'inv-fert-1',
        price: 32.00,
        unit: 'bag',
        minQuantity: 10,
        bulkDiscounts: [{ quantity: 50, price: 29.00 }],
        availability: 'low_stock',
        deliveryDays: 2,
        shippingCost: 40,
        lastUpdated: '2024-12-04T08:00:00Z',
    },
];

// Active Deals
export const ACTIVE_DEALS: DealAlert[] = [
    {
        id: 'deal-1',
        productId: 'inv-chem-1',
        productName: 'Glyphosate 41%',
        supplierId: 'sup-5',
        supplierName: 'Global Ag Wholesalers',
        normalPrice: 85.00,
        dealPrice: 68.00,
        savings: 17.00,
        savingsPercent: 20,
        expiresAt: '2024-12-06T23:59:59Z',
        urgency: 'high',
        type: 'flash_sale',
    },
    {
        id: 'deal-2',
        productId: 'inv-seed-3',
        productName: 'Strawberry Crowns',
        supplierId: 'sup-4',
        supplierName: 'Johnny\'s Selected Seeds',
        normalPrice: 0.85,
        dealPrice: 0.72,
        savings: 0.13,
        savingsPercent: 15,
        expiresAt: '2024-12-10T00:00:00Z',
        urgency: 'medium',
        type: 'seasonal',
    },
    {
        id: 'deal-3',
        productId: 'inv-fert-3',
        productName: 'Calcium Nitrate',
        supplierId: 'sup-1',
        supplierName: 'AgChem Supply Co.',
        normalPrice: 42.00,
        dealPrice: 35.70,
        savings: 6.30,
        savingsPercent: 15,
        expiresAt: '2024-12-05T12:00:00Z',
        urgency: 'high',
        type: 'clearance',
    },
];

// Helper Functions
export function getBestPrice(productId: string, quantity: number = 1): PriceQuote | null {
    const quotes = PRICE_QUOTES.filter(q => q.productId === productId);
    if (quotes.length === 0) return null;

    return quotes.reduce((best, current) => {
        // Calculate effective price including bulk discounts
        const getEffectivePrice = (quote: PriceQuote, qty: number) => {
            const discount = quote.bulkDiscounts
                .sort((a, b) => b.quantity - a.quantity)
                .find(d => qty >= d.quantity);
            return discount ? discount.price : quote.price;
        };

        const bestPrice = getEffectivePrice(best, quantity);
        const currentPrice = getEffectivePrice(current, quantity);

        return currentPrice < bestPrice ? current : best;
    });
}

export function getSupplier(id: string) {
    return SUPPLIERS.find(s => s.id === id);
}
