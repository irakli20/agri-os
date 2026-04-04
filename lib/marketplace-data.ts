// @ts-nocheck
// ============================================================================
// Marketplace Field Data
// Available fields for players to browse, rent, and buy
// ============================================================================

export type FieldCategory = 'fruits' | 'vegetables' | 'grains' | 'berries' | 'orchards' | 'cover-crops';

export interface FieldCharacteristics {
    climate: number;       // 1-5 — Local climate suitability
    soilQuality: number;   // 1-5 — Soil type & quality
    waterAccess: number;   // 1-5 — Water availability
    terrain: number;       // 1-5 — Terrain/topography
    proximity: number;     // 1-5 — Proximity to markets & infrastructure
}

export interface MarketplaceField {
    id: string;
    name: string;
    category: FieldCategory;
    description: string;
    location: string;
    sizeHectares: number;
    buyPrice: number;
    rentPrice: number;   // per season
    characteristics: FieldCharacteristics;
    overallRating: number; // computed avg of characteristics
    status: 'available' | 'rented' | 'sold';
    coordinates: [number, number]; // center point for map display
    imageUrl: string;
    soilType: string;
    waterSource: string;
    elevation: number; // meters
    annualRainfall: number; // mm
    isCornSuitable?: boolean;
    cornAgronomy?: {
        soilPH: number;           // e.g. 6.2
        drainageRating: string;   // 'excellent' | 'good' | 'moderate' | 'poor'
        pestHistory: string;      // e.g. 'Low - No wireworm history'
        recommendedNPK: string;   // e.g. '160-80-60'
        irrigationNeeded: boolean;
        notes?: string;
    };
}

export const FIELD_CATEGORIES: { id: FieldCategory; label: string; icon: string; color: string }[] = [
    { id: 'fruits', label: 'Fruits', icon: '🍎', color: 'text-red-400' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥬', color: 'text-green-400' },
    { id: 'grains', label: 'Grains', icon: '🌾', color: 'text-yellow-400' },
    { id: 'berries', label: 'Berries', icon: '🫐', color: 'text-purple-400' },
    { id: 'orchards', label: 'Orchards', icon: '🌳', color: 'text-primary' },
    { id: 'cover-crops', label: 'Cover Crops', icon: '🌿', color: 'text-teal-400' },
];

function computeRating(c: FieldCharacteristics): number {
    return Math.round(((c.climate + c.soilQuality + c.waterAccess + c.terrain + c.proximity) / 5) * 10) / 10;
}

const raw: Omit<MarketplaceField, 'overallRating'>[] = [
    // ── Fruits ──────────────────────────────────────────────────────────
    {
        id: 'mkt-1',
        name: 'Sunny Ridge Orchard Plot',
        category: 'fruits',
        description: 'A sun-drenched hillside ideal for stone fruits and citrus. Excellent drainage and warm microclimate. Southern exposure maximizes growing degree days.',
        location: 'Salinas Valley, CA',
        sizeHectares: 12,
        buyPrice: 18000,
        rentPrice: 2400,
        characteristics: { climate: 5, soilQuality: 4, waterAccess: 3, terrain: 4, proximity: 4 },
        status: 'available',
        coordinates: [-121.6544, 36.6777],
        imageUrl: '/ndvi-field.png',
        soilType: 'Sandy Loam',
        waterSource: 'Well + Canal',
        elevation: 120,
        annualRainfall: 380,
    },
    {
        id: 'mkt-2',
        name: 'Harvest Moon Meadow',
        category: 'fruits',
        description: 'Flat, fertile land with deep topsoil. Perfect for melons, tomatoes, and table grapes. Near the processing facility for quick harvest delivery.',
        location: 'Central Valley, CA',
        sizeHectares: 25,
        buyPrice: 32000,
        rentPrice: 4200,
        characteristics: { climate: 4, soilQuality: 5, waterAccess: 4, terrain: 5, proximity: 5 },
        status: 'available',
        coordinates: [-120.4800, 37.3200],
        imageUrl: '/rgb-field.png',
        soilType: 'Clay Loam',
        waterSource: 'Irrigation District',
        elevation: 45,
        annualRainfall: 280,
    },

    // ── Vegetables ──────────────────────────────────────────────────────
    {
        id: 'mkt-3',
        name: 'Green Valley Flats',
        category: 'vegetables',
        description: 'Premier lettuce and brassica land. Rich alluvial soil with excellent organic matter content. Year-round growing season in the fog belt.',
        location: 'Watsonville, CA',
        sizeHectares: 8,
        buyPrice: 12000,
        rentPrice: 1800,
        characteristics: { climate: 4, soilQuality: 5, waterAccess: 5, terrain: 5, proximity: 4 },
        status: 'available',
        coordinates: [-121.7568, 36.9103],
        imageUrl: '/ndvi-field.png',
        soilType: 'Alluvial Loam',
        waterSource: 'River + Drip System',
        elevation: 25,
        annualRainfall: 520,
    },
    {
        id: 'mkt-4',
        name: 'Copper Terrace Gardens',
        category: 'vegetables',
        description: 'Terraced hillside with raised beds for root vegetables and peppers. Protected from strong winds by surrounding hills. Rich copper-tinged volcanic soil.',
        location: 'Sonoma County, CA',
        sizeHectares: 5,
        buyPrice: 9500,
        rentPrice: 1400,
        characteristics: { climate: 4, soilQuality: 4, waterAccess: 3, terrain: 3, proximity: 3 },
        status: 'available',
        coordinates: [-122.7141, 38.4404],
        imageUrl: '/thermal-field.png',
        soilType: 'Volcanic Clay',
        waterSource: 'Spring-fed',
        elevation: 210,
        annualRainfall: 740,
    },
    {
        id: 'mkt-5',
        name: 'Riverside Greens',
        category: 'vegetables',
        description: 'Low-lying plot along the Sacramento River. Incredible water access and nutrient-rich flood plains. Ideal for leafy greens and herbs.',
        location: 'Sacramento Delta, CA',
        sizeHectares: 15,
        buyPrice: 22000,
        rentPrice: 3000,
        characteristics: { climate: 3, soilQuality: 5, waterAccess: 5, terrain: 4, proximity: 5 },
        status: 'available',
        coordinates: [-121.5000, 38.5500],
        imageUrl: '/rgb-field.png',
        soilType: 'Peat Loam',
        waterSource: 'River Direct',
        elevation: 3,
        annualRainfall: 450,
    },

    // ── Grains ──────────────────────────────────────────────────────────
    {
        id: 'mkt-6',
        name: 'Golden Wheat Plains',
        category: 'grains',
        description: 'Vast open flatland perfect for mechanized grain farming. Deep topsoil and reliable seasonal rains. Low cost per hectare with massive scale potential.',
        location: 'San Joaquin Valley, CA',
        sizeHectares: 50,
        buyPrice: 35000,
        rentPrice: 4500,
        characteristics: { climate: 4, soilQuality: 4, waterAccess: 3, terrain: 5, proximity: 3 },
        status: 'available',
        coordinates: [-119.7725, 36.7378],
        imageUrl: '/ndre-field.png',
        soilType: 'Deep Loam',
        waterSource: 'Rain-fed + Well',
        elevation: 90,
        annualRainfall: 260,
        isCornSuitable: true,
        cornAgronomy: {
            soilPH: 6.1,
            drainageRating: 'good',
            pestHistory: 'Low — No wireworm history on record',
            recommendedNPK: '160-80-60',
            irrigationNeeded: true,
            notes: 'Deep loam retains moisture well but irrigation supplement advised during tasseling (BBCH 53+). Weed pressure historically moderate — burndown essential.',
        },
    },
    {
        id: 'mkt-7',
        name: 'Heritage Grain Field',
        category: 'grains',
        description: 'Historical farmland with proven grain yields for over a century. Established infrastructure including grain silos and a drying barn.',
        location: 'Yolo County, CA',
        sizeHectares: 30,
        buyPrice: 28000,
        rentPrice: 3600,
        characteristics: { climate: 4, soilQuality: 4, waterAccess: 4, terrain: 5, proximity: 4 },
        status: 'available',
        coordinates: [-121.7700, 38.5400],
        imageUrl: '/ndvi-field.png',
        soilType: 'Silt Loam',
        waterSource: 'Canal System',
        elevation: 18,
        annualRainfall: 430,
        isCornSuitable: true,
        cornAgronomy: {
            soilPH: 6.5,
            drainageRating: 'excellent',
            pestHistory: 'Moderate — Western corn rootworm pressure in 2 prior seasons',
            recommendedNPK: '180-90-70',
            irrigationNeeded: false,
            notes: 'Silt loam provides excellent tilth for precision corn drilling. Canal irrigation system available as backup. Prior rootworm pressure means Gaucho (imidacloprid) seed treatment is strongly advised.',
        },
    },

    // ── Berries ─────────────────────────────────────────────────────────
    {
        id: 'mkt-8',
        name: 'Blueberry Hollow',
        category: 'berries',
        description: 'Acidic soil haven ideal for blueberries and cranberries. Natural pine windbreak; raised bed infrastructure already in place.',
        location: 'Humboldt County, CA',
        sizeHectares: 6,
        buyPrice: 14000,
        rentPrice: 2000,
        characteristics: { climate: 3, soilQuality: 5, waterAccess: 4, terrain: 3, proximity: 2 },
        status: 'available',
        coordinates: [-124.1637, 40.8021],
        imageUrl: '/thermal-field.png',
        soilType: 'Acidic Sandy Loam',
        waterSource: 'Rain + Drip',
        elevation: 30,
        annualRainfall: 1020,
    },
    {
        id: 'mkt-9',
        name: 'Strawberry Sunset Fields',
        category: 'berries',
        description: 'Coastal plot famous for its strawberry production. Cool ocean breezes, consistent fog drip, and sandy loam soil create perfect berry conditions.',
        location: 'Oxnard, CA',
        sizeHectares: 10,
        buyPrice: 20000,
        rentPrice: 2800,
        characteristics: { climate: 5, soilQuality: 4, waterAccess: 4, terrain: 5, proximity: 5 },
        status: 'available',
        coordinates: [-119.1771, 34.1975],
        imageUrl: '/rgb-field.png',
        soilType: 'Coastal Sandy Loam',
        waterSource: 'Municipal + Fog',
        elevation: 12,
        annualRainfall: 350,
    },
    {
        id: 'mkt-10',
        name: 'Raspberry Ridge',
        category: 'berries',
        description: 'Elevated plot with excellent air circulation, reducing mildew risk. Rich compost-amended soil. Small but highly productive.',
        location: 'Santa Cruz Mountains, CA',
        sizeHectares: 4,
        buyPrice: 11000,
        rentPrice: 1600,
        characteristics: { climate: 4, soilQuality: 4, waterAccess: 3, terrain: 3, proximity: 3 },
        status: 'available',
        coordinates: [-122.0554, 37.0601],
        imageUrl: '/ndvi-field.png',
        soilType: 'Forest Loam',
        waterSource: 'Well',
        elevation: 450,
        annualRainfall: 890,
    },

    // ── Orchards ─────────────────────────────────────────────────────────
    {
        id: 'mkt-11',
        name: 'Almond Blossom Estate',
        category: 'orchards',
        description: 'Premium orchard land with mature almond tree rootstock still viable. Warm winters, hot dry summers, perfect chill hours for stone-fruit trees.',
        location: 'Fresno County, CA',
        sizeHectares: 20,
        buyPrice: 40000,
        rentPrice: 5500,
        characteristics: { climate: 5, soilQuality: 4, waterAccess: 3, terrain: 5, proximity: 4 },
        status: 'available',
        coordinates: [-119.7726, 36.7468],
        imageUrl: '/ndre-field.png',
        soilType: 'Deep Sandy Loam',
        waterSource: 'Groundwater Well',
        elevation: 100,
        annualRainfall: 270,
    },
    {
        id: 'mkt-12',
        name: 'Olive Grove Terrace',
        category: 'orchards',
        description: 'Mediterranean-style hillside perfect for olive trees. Rocky, well-drained soil, and hot summers. Existing olive press building on site.',
        location: 'Paso Robles, CA',
        sizeHectares: 15,
        buyPrice: 30000,
        rentPrice: 4000,
        characteristics: { climate: 5, soilQuality: 3, waterAccess: 2, terrain: 3, proximity: 3 },
        status: 'available',
        coordinates: [-120.6596, 35.6264],
        imageUrl: '/thermal-field.png',
        soilType: 'Chalky Clay',
        waterSource: 'Rain-fed Only',
        elevation: 310,
        annualRainfall: 330,
    },

    // ── Cover Crops ─────────────────────────────────────────────────────
    {
        id: 'mkt-13',
        name: 'Clover & Rye Bottomland',
        category: 'cover-crops',
        description: 'Flat bottomland ideal for nitrogen-fixing cover crops. Use this field to improve soil health and earn environmental stewardship XP.',
        location: 'Napa Valley, CA',
        sizeHectares: 18,
        buyPrice: 15000,
        rentPrice: 1800,
        characteristics: { climate: 4, soilQuality: 3, waterAccess: 4, terrain: 5, proximity: 4 },
        status: 'available',
        coordinates: [-122.3367, 38.2975],
        imageUrl: '/ndvi-field.png',
        soilType: 'Heavy Clay',
        waterSource: 'Creek + Rain',
        elevation: 40,
        annualRainfall: 630,
    },
    {
        id: 'mkt-14',
        name: 'Vetch & Buckwheat Meadow',
        category: 'cover-crops',
        description: 'Excellent pollinator habitat. Plant hairy vetch and buckwheat to attract beneficial insects. Bonus reputation points for biodiversity.',
        location: 'Mendocino County, CA',
        sizeHectares: 22,
        buyPrice: 13000,
        rentPrice: 1500,
        characteristics: { climate: 3, soilQuality: 3, waterAccess: 3, terrain: 4, proximity: 2 },
        status: 'available',
        coordinates: [-123.4428, 39.3076],
        imageUrl: '/rgb-field.png',
        soilType: 'Gravelly Loam',
        waterSource: 'Rain-fed',
        elevation: 190,
        annualRainfall: 980,
    },
    {
        id: 'mkt-15',
        name: 'Mustard & Fescue Prairie',
        category: 'cover-crops',
        description: 'Wide-open prairie plot suited for large-scale cover cropping. Prevent erosion, build organic matter, and prepare the land for high-value crops.',
        location: 'Lake County, CA',
        sizeHectares: 35,
        buyPrice: 16000,
        rentPrice: 2000,
        characteristics: { climate: 3, soilQuality: 4, waterAccess: 3, terrain: 4, proximity: 2 },
        status: 'available',
        coordinates: [-122.9110, 39.0300],
        imageUrl: '/ndre-field.png',
        soilType: 'Volcanic Loam',
        waterSource: 'Seasonal Creek',
        elevation: 410,
        annualRainfall: 610,
    },
];

export const MARKETPLACE_FIELDS: MarketplaceField[] = raw.map(f => ({
    ...f,
    overallRating: computeRating(f.characteristics),
}));

// ============================================================================
// Sort options
// ============================================================================

export type SortOption = 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc' | 'rating-desc' | 'soil-desc' | 'water-desc';

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
    { id: 'rating-desc', label: 'Best Overall' },
    { id: 'price-asc', label: 'Price: Low → High' },
    { id: 'price-desc', label: 'Price: High → Low' },
    { id: 'size-desc', label: 'Largest First' },
    { id: 'size-asc', label: 'Smallest First' },
    { id: 'soil-desc', label: 'Best Soil' },
    { id: 'water-desc', label: 'Best Water' },
];

export function sortFields(fields: MarketplaceField[], sortBy: SortOption): MarketplaceField[] {
    const sorted = [...fields];
    switch (sortBy) {
        case 'price-asc': return sorted.sort((a, b) => a.buyPrice - b.buyPrice);
        case 'price-desc': return sorted.sort((a, b) => b.buyPrice - a.buyPrice);
        case 'size-asc': return sorted.sort((a, b) => a.sizeHectares - b.sizeHectares);
        case 'size-desc': return sorted.sort((a, b) => b.sizeHectares - a.sizeHectares);
        case 'rating-desc': return sorted.sort((a, b) => b.overallRating - a.overallRating);
        case 'soil-desc': return sorted.sort((a, b) => b.characteristics.soilQuality - a.characteristics.soilQuality);
        case 'water-desc': return sorted.sort((a, b) => b.characteristics.waterAccess - a.characteristics.waterAccess);
        default: return sorted;
    }
}

// ============================================================================
// Supplies Data (Seeds, Chems, Fertilizer)
// ============================================================================

export interface SupplyItem {
    id: string;
    name: string;
    category: 'seed' | 'fertilizer' | 'chemical' | 'fuel' | 'other';
    description: string;
    price: number;
    unit: string;
    icon: string;
    type?: string; // e.g. 'Lettuce', 'Strawberries' for seeds
    isCornRelated?: boolean;
}

export const SUPPLIES: SupplyItem[] = [
    // Seeds
    { id: 'seed-lettuce', name: 'Premium Lettuce Seeds', category: 'seed', type: 'Lettuce', description: 'High-yield, disease-resistant lettuce variety. Perfect for coastal climates.', price: 450, unit: 'bag (1 ha)', icon: '🥬' },
    { id: 'seed-strawberry', name: 'Albion Strawberry Runners', category: 'seed', type: 'Strawberries', description: 'Ever-bearing strawberry variety known for sweetness and robust growth.', price: 1200, unit: 'crate (1 ha)', icon: '🍓' },
    { id: 'seed-broccoli', name: 'Marathon Broccoli', category: 'seed', type: 'Broccoli', description: 'Reliable broccoli variety with uniform head size and cold tolerance.', price: 380, unit: 'bag (1 ha)', icon: '🥦' },
    { id: 'seed-wheat', name: 'Winter Wheat', category: 'seed', type: 'Wheat', description: 'Hard red winter wheat. Excellent for large-scale grain production.', price: 150, unit: 'sack (1 ha)', icon: '🌾' },
    // Corn-Specific Seeds
    { id: 'seed-corn-standard', name: 'Standard Field Corn', category: 'seed', type: 'Corn', description: 'Reliable, high-yield corn seed. Pre-treated with fungicides.', price: 280, unit: 'bag (1 ha)', icon: '🌽', isCornRelated: true },
    { id: 'seed-corn-sweet', name: 'Sweet Corn (G90)', category: 'seed', type: 'Corn', description: 'High-sugar variety for fresh market. Excellent disease resistance.', price: 350, unit: 'bag (1 ha)', icon: '🌽', isCornRelated: true },

    // Fertilizers
    { id: 'fert-npk', name: 'All-Purpose NPK 10-10-10', category: 'fertilizer', description: 'Balanced granular fertilizer for general crop health.', price: 200, unit: 'ton', icon: '🧪' },
    { id: 'fert-urea', name: 'Urea (46-0-0)', category: 'fertilizer', description: 'High nitrogen source critical for early corn vegetative growth.', price: 450, unit: 'ton', icon: '💎', isCornRelated: true },
    { id: 'fert-organic', name: 'Organic Compost', category: 'fertilizer', description: 'Rich organic matter to improve soil structure and fertility.', price: 120, unit: 'ton', icon: '🍂' },

    // Chemicals
    { id: 'chem-herbicide', name: 'Selective Herbicide', category: 'chemical', description: 'Controls broadleaf weeds without harming grasses.', price: 300, unit: 'drum', icon: '☠️' },
    { id: 'chem-fungicide', name: 'Copper Fungicide', category: 'chemical', description: 'Prevents mildew and fungal diseases in fruits and vegetables.', price: 450, unit: 'drum', icon: '🍄' },

    // Bayer Corn Products
    { id: 'chem-gaucho', name: 'Gaucho', category: 'chemical', description: 'Seed treatment: wireworms and soil-borne pests.', price: 850, unit: 'L', icon: '🔴', isCornRelated: true },
    { id: 'chem-maister-bio', name: 'Maister + Biopower', category: 'chemical', description: 'Broad-spectrum herbicide for dicot weeds.', price: 1200, unit: 'unit', icon: '🟠', isCornRelated: true },
    { id: 'chem-maister-power', name: 'Maister Power', category: 'chemical', description: 'Premium weed control for rapid growth periods.', price: 1450, unit: 'L', icon: '🟧', isCornRelated: true },
    { id: 'chem-adengo', name: 'Adengo', category: 'chemical', description: 'Early post-emergence specialized weed control.', price: 1100, unit: 'L', icon: '🔸', isCornRelated: true },
    { id: 'chem-decis', name: 'Decis', category: 'chemical', description: 'Insecticide: corn borer, bollworm, aphids.', price: 650, unit: 'L', icon: '🔵', isCornRelated: true },
    { id: 'chem-decis-expert', name: 'Decis Expert', category: 'chemical', description: 'Premium insecticide for severe infestations.', price: 950, unit: 'L', icon: '🔷', isCornRelated: true },

    // Fuel
    { id: 'fuel-diesel', name: 'Ultra-Low Sulfur Diesel', category: 'fuel', description: 'Primary fuel stock for tractors and combines during heavy field operations.', price: 260, unit: 'tank unit', icon: '⛽', isCornRelated: true },
];

// ============================================================================
// Services Data (Contractors)
// ============================================================================

export interface ServiceItem {
    id: string;
    name: string;
    category: 'preparation' | 'planting' | 'maintenance' | 'harvest';
    description: string;
    pricePerHectare: number;
    durationWeeks: number;
    icon: string;
    targetState?: string; // helper for logic
    isCornRelated?: boolean;
}

export const SERVICES: ServiceItem[] = [
    // Preparation (generic – also applicable to corn)
    { id: 'serv-plow', name: 'Deep Plowing', category: 'preparation', description: 'Heavy machinery plowing to break up compacted soil and incorporate residue.', pricePerHectare: 150, durationWeeks: 1, icon: '🚜', targetState: 'plowed', isCornRelated: true },
    { id: 'serv-till', name: 'Rotary Tilling', category: 'preparation', description: 'Fine tillage to create an ideal seedbed structure for planting.', pricePerHectare: 100, durationWeeks: 1, icon: '🌪️', targetState: 'tilled', isCornRelated: true },
    { id: 'serv-soil-test', name: 'Soil Core Analysis', category: 'preparation', description: 'Comprehensive grid soil sampling and lab analysis for NPK baselines.', pricePerHectare: 25, durationWeeks: 1, icon: '🧪', targetState: 'soil_tested' },

    // Corn Expert – Survey & Scouting
    { id: 'serv-aerial-survey', name: 'Drone Aerial Survey', category: 'preparation', description: 'Multispectral drone survey to map soil zones, weed pressure and field variability before tillage.', pricePerHectare: 35, durationWeeks: 1, icon: '🛰️', targetState: 'scouted', isCornRelated: true },

    // Corn Expert – Pre-Plant Herbicide
    { id: 'serv-pre-plant-herbicide', name: 'Pre-Plant Herbicide Burndown', category: 'preparation', description: 'Contractor-applied glyphosate/Maister Power burndown after plowing. Mandatory in Corn Focus Mode before tilling.', pricePerHectare: 55, durationWeeks: 1, icon: '🧪', targetState: 'pre_plant_treated', isCornRelated: true },

    // Planting
    { id: 'serv-plant-drill', name: 'Precision Corn Drilling', category: 'planting', description: 'Precision seed placement at optimal depth and spacing for corn row establishment.', pricePerHectare: 120, durationWeeks: 1, icon: '🌱', targetState: 'seeded', isCornRelated: true },
    { id: 'serv-plant-manual', name: 'Manual Transplanting', category: 'planting', description: 'Hand-planting for delicate vegetables and berries.', pricePerHectare: 800, durationWeeks: 2, icon: '🧤', targetState: 'seeded' },

    // Maintenance
    { id: 'serv-spray-drone', name: 'Drone Spraying', category: 'maintenance', description: 'Aerial application of in-season fertilizers, herbicides or pesticides via prescription map.', pricePerHectare: 60, durationWeeks: 0, icon: '🚁', targetState: 'protected', isCornRelated: true },
    { id: 'serv-fertilize-incorporated', name: 'Ground Fertilizer Spreading', category: 'maintenance', description: 'Tractor-pulled spreader for base NPK incorporation into soil profile.', pricePerHectare: 45, durationWeeks: 1, icon: '🚜', targetState: 'fertilized', isCornRelated: true },
    { id: 'serv-topdress-fertilizer', name: 'Top-Dress Ground Application', category: 'maintenance', description: 'Tractor-based top-dressing for growing crops. Bypasses strict aerial weather limits.', pricePerHectare: 50, durationWeeks: 1, icon: '🚜', targetState: 'fertilized', isCornRelated: true },
    { id: 'serv-irrigate', name: 'Irrigation Setup', category: 'maintenance', description: 'Installation and testing of temporary drip/overhead irrigation lines.', pricePerHectare: 200, durationWeeks: 1, icon: '💧', targetState: 'irrigated', isCornRelated: true },

    // Harvest
    { id: 'serv-harvest-hand', name: 'Hand Harvest Crew', category: 'harvest', description: 'Experienced crew for high-value fruit and vegetable picking.', pricePerHectare: 1200, durationWeeks: 2, icon: '🧺', targetState: 'harvested' },
    { id: 'serv-harvest-combine-corn', name: 'Corn Combine Service', category: 'harvest', description: 'High-capacity combine harvester service for corn at peak maturity.', pricePerHectare: 180, durationWeeks: 1, icon: '🌽', targetState: 'harvested', isCornRelated: true },

    // Post-Harvest (Corn Expert)
    { id: 'serv-residue-management', name: 'Residue Management & Stalk Chopping', category: 'preparation', description: 'Commercial stalk chopping and residue incorporation to prepare the field for the next rotation.', pricePerHectare: 80, durationWeeks: 1, icon: '🪓', targetState: 'post_harvest', isCornRelated: true },
];

// ============================================================================
// Equipment Data (Drones & Machinery)
// ============================================================================

export interface EquipmentItem {
    id: string;
    name: string;
    category: 'drone' | 'tractor' | 'harvester' | 'implement';
    description: string;
    price: number;
    maintainanceCostPerWeek: number;
    specs: Record<string, string | number>;
    icon: string;
    image: string;
    status: 'ready' | 'in-flight' | 'charging' | 'maintenance';
}

export const EQUIPMENT: EquipmentItem[] = [
    // Drones
    {
        id: 'eq-drone-scout',
        name: 'AgriScan X1',
        category: 'drone',
        description: 'Basic scouting drone for NDVI and visual field inspection. 30min flight time.',
        price: 2500,
        maintainanceCostPerWeek: 50,
        specs: { 'Range': '2km', 'Battery': '30m', 'Camera': '4K RGB' },
        icon: '🚁',
        image: '/drone-scout.png',
        status: 'ready'
    },
    {
        id: 'eq-drone-spray',
        name: 'SprayMaster 3000',
        category: 'drone',
        description: 'Heavy-lift agricultural drone for precise chemical application.',
        price: 15000,
        maintainanceCostPerWeek: 200,
        specs: { 'Payload': '30L', 'Swath': '6m', 'Battery': '15m' },
        icon: '🛸',
        image: '/drone-spray.png',
        status: 'ready'
    },

    // Tractors
    {
        id: 'eq-tractor-small',
        name: 'Compact Utility Tractor',
        category: 'tractor',
        description: 'Versatile 45HP tractor for small-scale operations and orchards.',
        price: 35000,
        maintainanceCostPerWeek: 150,
        specs: { 'Power': '45 HP', 'Drive': '4WD', 'Weight': '1.8T' },
        icon: '🚜',
        image: '/tractor-small.png',
        status: 'ready'
    },
    {
        id: 'eq-tractor-large',
        name: 'Heavy Row-Crop Tractor',
        category: 'tractor',
        description: 'High-horsepower tractor for plowing and heavy fieldwork.',
        price: 120000,
        maintainanceCostPerWeek: 450,
        specs: { 'Power': '250 HP', 'Tech': 'GPS Auto-Steer', 'Weight': '8.5T' },
        icon: '🚜',
        image: '/tractor-large.png',
        status: 'ready'
    },

    // Harvesters
    {
        id: 'eq-harvester',
        name: 'Combine Harvester',
        category: 'harvester',
        description: 'General purpose combine with interchangeable headers for grain.',
        price: 250000,
        maintainanceCostPerWeek: 800,
        specs: { 'Power': '350 HP', 'Grain Tank': '8000L', 'Width': '9m' },
        icon: '🏭',
        image: '/harvester.png',
        status: 'ready'
    }
];
