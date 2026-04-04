// @ts-nocheck
/**
 * Game Field Bridge
 * 
 * Converts MarketplaceField (game data) → Field (existing Agri-OS type)
 * so that purchased/rented game fields seamlessly integrate with the
 * existing farm management interface.
 */

import { Field } from './mock-data';
import { MarketplaceField, MARKETPLACE_FIELDS } from './marketplace-data';

/**
 * Generate a polygon from a center point for map display.
 * Creates a rectangular approximation around the center coordinate
 * scaled to the field size.
 */
function generatePolygon(center: [number, number], sizeHectares: number): [number, number][] {
    // Approximate side length in degrees (rough: 1 hectare ≈ 0.001° side at mid-latitudes)
    const side = Math.sqrt(sizeHectares) * 0.001;
    const [lng, lat] = center;
    return [
        [lng - side, lat + side],
        [lng + side, lat + side],
        [lng + side, lat - side],
        [lng - side, lat - side],
        [lng - side, lat + side], // close polygon
    ];
}

/**
 * Determine a suggested crop based on field category.
 * Fields start as "Unplanted" — this is the recommendation text shown to the player.
 */
export function getSuggestedCrop(category: MarketplaceField['category']): string {
    const suggestions: Record<string, string> = {
        fruits: 'Citrus / Stone Fruits',
        vegetables: 'Leafy Greens / Brassicas',
        grains: 'Wheat / Barley',
        berries: 'Strawberries / Blueberries',
        orchards: 'Almonds / Olives',
        'cover-crops': 'Clover / Rye',
    };
    return suggestions[category] || 'General Crops';
}

/**
 * Convert a MarketplaceField to the existing Field type.
 * 
 * New fields start as bare land:
 * - crop: 'Unplanted'
 * - ndviScore: 0 (no vegetation)
 * - healthStatus: 'attention' (needs preparation)
 */
export function marketplaceFieldToField(mf: MarketplaceField): Field {
    const acresPerHectare = 2.47105;

    return {
        id: `game-${mf.id}`,
        name: mf.name,
        acres: Math.round(mf.sizeHectares * acresPerHectare * 10) / 10,
        crop: 'Unplanted',
        plantingDate: new Date().toISOString().split('T')[0],
        ndviScore: 0,
        healthStatus: 'attention',
        lastFlightDate: 'Never',
        coordinates: generatePolygon(mf.coordinates, mf.sizeHectares),

        // Initial Game State
        soilStatus: 'compacted',
        cropStage: 'none',
        inputStatus: {
            needsWater: false,
            needsNutrients: true,
            needsProtection: false
        },
        weedPressure: 'low',
    };
}

/**
 * Convert all of a player's owned/rented fields into Field objects.
 */
export function getPlayerFields(
    ownedFieldIds: string[],
    rentedFieldIds: string[]
): Field[] {
    const allPlayerFieldIds = [...ownedFieldIds, ...rentedFieldIds];
    return allPlayerFieldIds
        .map(id => {
            const mf = MARKETPLACE_FIELDS.find(f => f.id === id);
            if (!mf) return null;
            return marketplaceFieldToField(mf);
        })
        .filter((f): f is Field => f !== null);
}

/**
 * Get ownership type for a game field.
 */
export function getFieldOwnership(
    marketplaceId: string,
    ownedFieldIds: string[],
    rentedFieldIds: string[]
): 'owned' | 'rented' | null {
    if (ownedFieldIds.includes(marketplaceId)) return 'owned';
    if (rentedFieldIds.includes(marketplaceId)) return 'rented';
    return null;
}

/**
 * Extract the marketplace ID from a game field ID.
 * game-mkt-1 → mkt-1
 */
export function extractMarketplaceId(gameFieldId: string): string {
    return gameFieldId.replace(/^game-/, '');
}
