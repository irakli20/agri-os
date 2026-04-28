// @ts-nocheck
/**
 * Field Overlay Generator
 *
 * Generates SVG-based heatmap overlays for problem pressure visualization.
 */

import { PEST_INFESTATIONS, DISEASE_INCIDENTS, WEED_PRESSURE } from './pest-disease-data';

export interface OverlayHotspot {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    intensity: number; // 0-100
    radius: number; // percentage
}

type OverlayFieldState = {
    id: string;
    weedPressure?: 'none' | 'low' | 'medium' | 'high';
    diseasePressure?: number;
    inputStatus?: {
        needsWater?: boolean;
        needsNutrients?: boolean;
        needsProtection?: boolean;
    };
};

type OverlayChallenge = {
    fieldId?: string;
    status?: string;
    category?: string;
};

export type ProblemOverlayType = 'pest' | 'disease' | 'weed' | 'nutrient' | 'drought';

const HOTSPOT_PATTERNS: Record<ProblemOverlayType, Array<[number, number]>> = {
    pest: [[24, 30], [48, 42], [69, 26], [77, 61], [34, 68]],
    disease: [[31, 26], [58, 34], [72, 55], [43, 66], [22, 52]],
    weed: [[18, 48], [39, 61], [64, 43], [79, 68], [51, 28]],
    nutrient: [[26, 59], [47, 42], [66, 62], [73, 35]],
    drought: [[30, 35], [57, 55], [77, 41], [43, 72]],
};

function hashToUnit(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return ((hash >>> 0) % 10000) / 10000;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function jitteredPatternPoint(fieldId: string, type: ProblemOverlayType, index: number): { x: number; y: number } {
    const pattern = HOTSPOT_PATTERNS[type];
    const [baseX, baseY] = pattern[index % pattern.length];
    const jitterX = (hashToUnit(`${fieldId}:${type}:${index}:x`) - 0.5) * 10;
    const jitterY = (hashToUnit(`${fieldId}:${type}:${index}:y`) - 0.5) * 10;

    return {
        x: clamp(baseX + jitterX, 10, 90),
        y: clamp(baseY + jitterY, 12, 88),
    };
}

function buildHotspotsFromScore(
    fieldId: string,
    type: ProblemOverlayType,
    score: number,
    options: { minCount?: number; maxCount?: number; minRadius?: number; maxRadius?: number } = {}
): OverlayHotspot[] {
    const normalized = clamp(score, 0, 100);
    if (normalized <= 0) return [];

    const minCount = options.minCount ?? 1;
    const maxCount = options.maxCount ?? 4;
    const count = clamp(Math.ceil((normalized / 100) * maxCount), minCount, maxCount);
    const minRadius = options.minRadius ?? 10;
    const maxRadius = options.maxRadius ?? 22;

    return Array.from({ length: count }, (_, index) => {
        const point = jitteredPatternPoint(fieldId, type, index);
        const falloff = 1 - index * 0.12;
        const intensity = clamp(normalized * falloff, 28, 100);
        const radius = clamp(minRadius + (normalized / 100) * (maxRadius - minRadius) + index * 1.6, minRadius, maxRadius + 4);

        return {
            ...point,
            intensity,
            radius,
        };
    });
}

/**
 * Convert pressure level to intensity value
 */
function pressureToIntensity(pressure: string): number {
    switch (pressure) {
        case 'low': return 30;
        case 'medium': return 65;
        case 'high': return 95;
        default: return 0;
    }
}

function hasActiveCategoryChallenge(
    fieldId: string,
    type: ProblemOverlayType,
    challenges: OverlayChallenge[] = []
): boolean {
    return challenges.some(challenge =>
        challenge.status === 'open' &&
        challenge.fieldId === fieldId &&
        challenge.category === type
    );
}

function challengeBoostedScore(
    fieldId: string,
    type: ProblemOverlayType,
    score: number,
    challenges?: OverlayChallenge[]
): number {
    const hasChallenge = hasActiveCategoryChallenge(fieldId, type, challenges) ||
        // Drought challenges use 'weather' category
        (type === 'drought' && hasActiveCategoryChallenge(fieldId, 'weather', challenges));
    return hasChallenge ? Math.max(score, 55) : score;
}

function boostHotspotsForActiveChallenge(
    fieldId: string,
    type: ProblemOverlayType,
    hotspots: OverlayHotspot[],
    challenges?: OverlayChallenge[]
): OverlayHotspot[] {
    const hasChallenge = hasActiveCategoryChallenge(fieldId, type, challenges) ||
        (type === 'drought' && hasActiveCategoryChallenge(fieldId, 'weather', challenges));
    if (!hasChallenge) return hotspots;

    return hotspots.map(hotspot => ({
        ...hotspot,
        intensity: Math.max(hotspot.intensity, 55),
    }));
}

/**
 * Generate pest pressure hotspots for a field
 */
export function generatePestHotspots(fieldId: string, field?: OverlayFieldState, challenges?: OverlayChallenge[]): OverlayHotspot[] {
    const pests = PEST_INFESTATIONS.filter(p => p.fieldId === fieldId);
    const fieldScore = challengeBoostedScore(fieldId, 'pest', field?.inputStatus?.needsProtection ? 70 : 0, challenges);

    if (pests.length === 0) {
        return buildHotspotsFromScore(fieldId, 'pest', fieldScore, { maxCount: 3, minRadius: 10, maxRadius: 20 });
    }

    return boostHotspotsForActiveChallenge(fieldId, 'pest', pests.map((pest, index) => {
        const point = jitteredPatternPoint(fieldId, 'pest', index);
        return {
            ...point,
            intensity: pressureToIntensity(pest.pressureLevel),
            radius: clamp(12 + (pest.affectedArea / 10) * 5, 10, 28),
        };
    }), challenges);
}

/**
 * Generate disease incident hotspots for a field
 */
export function generateDiseaseHotspots(fieldId: string, field?: OverlayFieldState, challenges?: OverlayChallenge[]): OverlayHotspot[] {
    const diseases = DISEASE_INCIDENTS.filter(d => d.fieldId === fieldId);
    const fieldScore = challengeBoostedScore(fieldId, 'disease', field?.diseasePressure ?? 0, challenges);

    if (diseases.length === 0) {
        return buildHotspotsFromScore(fieldId, 'disease', fieldScore, { maxCount: 4, minRadius: 11, maxRadius: 23 });
    }

    return boostHotspotsForActiveChallenge(fieldId, 'disease', diseases.map((disease, index) => {
        const point = jitteredPatternPoint(fieldId, 'disease', index);
        return {
            ...point,
            intensity: pressureToIntensity(disease.pressureLevel),
            radius: clamp(11 + (disease.affectedArea / 10) * 6, 10, 30),
        };
    }), challenges);
}

/**
 * Generate weed pressure hotspots for a field
 */
export function generateWeedHotspots(fieldId: string, field?: OverlayFieldState, challenges?: OverlayChallenge[]): OverlayHotspot[] {
    const weeds = WEED_PRESSURE.filter(w => w.fieldId === fieldId);
    const fieldScore = challengeBoostedScore(fieldId, 'weed', pressureToIntensity(field?.weedPressure || 'none'), challenges);

    if (weeds.length === 0) {
        return buildHotspotsFromScore(fieldId, 'weed', fieldScore, { maxCount: 4, minRadius: 13, maxRadius: 26 });
    }

    return boostHotspotsForActiveChallenge(fieldId, 'weed', weeds.map((weed, index) => {
        const point = jitteredPatternPoint(fieldId, 'weed', index);
        return {
            ...point,
            intensity: pressureToIntensity(weed.pressureLevel),
            radius: clamp(14 + (weed.coverage / 10) * 4, 12, 28),
        };
    }), challenges);
}

/**
 * Generate nutrient deficiency hotspots for a field
 * Based on inputStatus.needsNutrients and soil test data
 */
export function generateNutrientHotspots(fieldId: string, field?: OverlayFieldState, challenges?: OverlayChallenge[]): OverlayHotspot[] {
    // Calculate base score from multiple signals
    let baseScore = 0;
    
    // Signal 1: Direct input status flag
    if (field?.inputStatus?.needsNutrients) baseScore = Math.max(baseScore, 72);
    
    // Signal 2: Active nutrient challenge boosts visibility
    baseScore = challengeBoostedScore(fieldId, 'nutrient', baseScore, challenges);
    
    // Signal 3: Fallback — fields that are soil_tested or growing almost always need nutrient monitoring
    if (baseScore === 0) {
        // If we have a challenge, use the boosted minimum
        if (hasActiveCategoryChallenge(fieldId, 'nutrient', challenges)) baseScore = 55;
    }
    
    return buildHotspotsFromScore(
        fieldId,
        'nutrient',
        baseScore,
        { maxCount: 3, minRadius: 12, maxRadius: 24 }
    );
}

/**
 * Generate drought/water stress hotspots for a field
 * Based on inputStatus.needsWater and soil moisture data
 */
export function generateDroughtHotspots(fieldId: string, field?: OverlayFieldState, challenges?: OverlayChallenge[]): OverlayHotspot[] {
    // Calculate base score from multiple signals
    let baseScore = 0;
    
    // Signal 1: Direct input status flag
    if (field?.inputStatus?.needsWater) baseScore = Math.max(baseScore, 78);
    
    // Signal 2: Active drought/weather challenge boosts visibility
    baseScore = challengeBoostedScore(fieldId, 'drought', baseScore, challenges);
    
    // Also check 'weather' category challenges (drought-during-silking etc)
    if (hasActiveCategoryChallenge(fieldId, 'weather', challenges)) {
        baseScore = Math.max(baseScore, 55);
    }
    
    // Signal 3: Fallback minimum if any challenge exists
    if (baseScore === 0 && (
        hasActiveCategoryChallenge(fieldId, 'drought', challenges) ||
        hasActiveCategoryChallenge(fieldId, 'weather', challenges)
    )) {
        baseScore = 55;
    }
    
    return buildHotspotsFromScore(
        fieldId,
        'drought',
        baseScore,
        { maxCount: 3, minRadius: 14, maxRadius: 27 }
    );
}

/**
 * Generate SVG heatmap overlay
 */
export function generateHeatmapSVG(
    hotspots: OverlayHotspot[],
    color: string = '#ff0000',
    width: number = 1000,
    height: number = 800
): string {
    const gradients = hotspots.map((spot, index) => {
        const centerOpacity = (0.35 + (spot.intensity / 100) * 0.30).toFixed(3);
        const midOpacity = (Number(centerOpacity) * 0.45).toFixed(3);
        const shoulderOpacity = (Number(centerOpacity) * 0.16).toFixed(3);

        return `
        <radialGradient id="gradient-${index}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:${centerOpacity}" />
            <stop offset="18%" style="stop-color:${color};stop-opacity:${centerOpacity}" />
            <stop offset="42%" style="stop-color:${color};stop-opacity:${midOpacity}" />
            <stop offset="68%" style="stop-color:${color};stop-opacity:${shoulderOpacity}" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        </radialGradient>
    `;
    }).join('');

    const circles = hotspots.map((spot, index) => `
        <circle
            cx="${(spot.x / 100) * width}"
            cy="${(spot.y / 100) * height}"
            r="${(spot.radius / 100) * Math.min(width, height)}"
            fill="url(#gradient-${index})"
            filter="url(#heatmap-glow)"
            style="transform-origin:${(spot.x / 100) * width}px ${(spot.y / 100) * height}px"
        >
            <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="2s" begin="${index * 0.18}s" repeatCount="indefinite" additive="sum" />
        </circle>
    `).join('');

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <filter id="heatmap-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="10" result="softGlow" />
                    <feColorMatrix in="softGlow" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                ${gradients}
            </defs>
            <g opacity="0.96">
                ${circles}
            </g>
        </svg>
    `;
}

export function svgToDataUrl(svg: string): string {
    const encoded = typeof window !== 'undefined' && typeof window.btoa === 'function'
        ? (() => {
            const bytes = new TextEncoder().encode(svg);
            let binary = '';
            const chunkSize = 0x8000;

            for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
            }

            return window.btoa(binary);
        })()
        : Buffer.from(svg, 'utf-8').toString('base64');

    return `data:image/svg+xml;base64,${encoded}`;
}

import { getLidarValue, getLidarColor } from './lidar-utils';

/**
 * Generate LIDAR SVG overlay
 */
export function generateLidarOverlay(
    type: 'elevation' | 'absolute' | 'crop-height',
    width: number = 1000,
    height: number = 800
): string {
    // Generate a grid of circles for the heatmap with blur for organic look
    const resolution = 50; // Reduced resolution for better performance, relying on blur for smoothness
    const cellWidth = width / resolution;
    const cellHeight = height / resolution;
    const radius = Math.max(cellWidth, cellHeight) * 0.8; // Overlap slightly

    let shapes = '';

    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            // Map grid to noise coordinates (0-100)
            const noiseX = (x / resolution) * 100;
            const noiseY = (y / resolution) * 100;

            const value = getLidarValue(noiseX, noiseY, type);
            const color = getLidarColor(value, type);

            shapes += `<circle cx="${x * cellWidth + cellWidth / 2}" cy="${y * cellHeight + cellHeight / 2}" r="${radius}" fill="${color}" />`;
        }
    }

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <filter id="blur-${type}" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="${cellWidth * 0.8}" />
                </filter>
            </defs>
            <g filter="url(#blur-${type})" opacity="0.9">
                ${shapes}
            </g>
        </svg>
    `;
}

/**
 * Get overlay data for a specific field and type
 */
export function getFieldOverlay(fieldId: string, type: ProblemOverlayType | 'elevation' | 'absolute' | 'crop-height', field?: OverlayFieldState, challenges?: OverlayChallenge[]): {
    hotspots?: OverlayHotspot[];
    svg: string;
    color?: string;
    hasProblems?: boolean;
} {
    // Handle LIDAR types
    if (type === 'elevation' || type === 'absolute' || type === 'crop-height') {
        return {
            svg: generateLidarOverlay(type),
        };
    }

    let hotspots: OverlayHotspot[];
    let color: string;

    switch (type) {
        case 'pest':
            hotspots = generatePestHotspots(fieldId, field, challenges);
            color = '#ef4444'; // red
            break;
        case 'disease':
            hotspots = generateDiseaseHotspots(fieldId, field, challenges);
            color = '#a855f7'; // purple
            break;
        case 'weed':
            hotspots = generateWeedHotspots(fieldId, field, challenges);
            color = '#22c55e'; // green
            break;
        case 'nutrient':
            hotspots = generateNutrientHotspots(fieldId, field, challenges);
            color = '#eab308'; // yellow/amber
            break;
        case 'drought':
            hotspots = generateDroughtHotspots(fieldId, field, challenges);
            color = '#3b82f6'; // blue
            break;
        default:
            hotspots = [];
            color = '#000000';
    }

    return {
        hotspots,
        svg: generateHeatmapSVG(hotspots, color),
        color,
        hasProblems: hotspots.length > 0,
    };
}
