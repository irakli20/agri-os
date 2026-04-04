// @ts-nocheck
/**
 * areaToAcres
 * 
 * Converts area in square meters to acres.
 * 1 Square Meter = 0.000247105 Acres
 */
export function areaToAcres(squareMeters: number): number {
    return squareMeters * 0.000247105;
}

/**
 * formatArea
 * 
 * Formats acres for display with 1 decimal place.
 */
export function formatArea(acres: number): string {
    return acres.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}
