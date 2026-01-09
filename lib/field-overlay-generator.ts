/**
 * Field Overlay Generator
 * 
 * Generates SVG-based heatmap overlays for pest, disease, and weed pressure visualization
 */

import { PEST_INFESTATIONS, DISEASE_INCIDENTS, WEED_PRESSURE } from './pest-disease-data';

export interface OverlayHotspot {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    intensity: number; // 0-100
    radius: number; // percentage
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

/**
 * Generate pest pressure hotspots for a field
 */
export function generatePestHotspots(fieldId: string): OverlayHotspot[] {
    const pests = PEST_INFESTATIONS.filter(p => p.fieldId === fieldId);

    return pests.map((pest, index) => {
        // Distribute pests across the field (in real app, would use actual GPS coordinates)
        const baseX = 20 + (index * 25);
        const baseY = 30 + (index * 20);

        return {
            x: baseX + Math.random() * 10,
            y: baseY + Math.random() * 10,
            intensity: pressureToIntensity(pest.pressureLevel),
            radius: 15 + (pest.affectedArea / 10) * 5, // Scale radius by affected area
        };
    });
}

/**
 * Generate disease incident hotspots for a field
 */
export function generateDiseaseHotspots(fieldId: string): OverlayHotspot[] {
    const diseases = DISEASE_INCIDENTS.filter(d => d.fieldId === fieldId);

    return diseases.map((disease, index) => {
        const baseX = 30 + (index * 30);
        const baseY = 25 + (index * 25);

        return {
            x: baseX + Math.random() * 15,
            y: baseY + Math.random() * 15,
            intensity: pressureToIntensity(disease.pressureLevel),
            radius: 12 + (disease.affectedArea / 10) * 6,
        };
    });
}

/**
 * Generate weed pressure hotspots for a field
 */
export function generateWeedHotspots(fieldId: string): OverlayHotspot[] {
    const weeds = WEED_PRESSURE.filter(w => w.fieldId === fieldId);

    return weeds.map((weed, index) => {
        const baseX = 15 + (index * 35);
        const baseY = 40 + (index * 15);

        return {
            x: baseX + Math.random() * 20,
            y: baseY + Math.random() * 20,
            intensity: pressureToIntensity(weed.pressureLevel),
            radius: 18 + (weed.coverage / 10) * 4, // Scale by coverage percentage
        };
    });
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
    const gradients = hotspots.map((spot, index) => `
        <radialGradient id="gradient-${index}" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:${spot.intensity / 100}" />
            <stop offset="50%" style="stop-color:${color};stop-opacity:${spot.intensity / 200}" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        </radialGradient>
    `).join('');

    const circles = hotspots.map((spot, index) => `
        <circle
            cx="${(spot.x / 100) * width}"
            cy="${(spot.y / 100) * height}"
            r="${(spot.radius / 100) * Math.min(width, height)}"
            fill="url(#gradient-${index})"
        />
    `).join('');

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                ${gradients}
            </defs>
            ${circles}
        </svg>
    `;
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
export function getFieldOverlay(fieldId: string, type: 'pest' | 'disease' | 'weed' | 'elevation' | 'absolute' | 'crop-height'): {
    hotspots?: OverlayHotspot[];
    svg: string;
    color?: string;
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
            hotspots = generatePestHotspots(fieldId);
            color = '#ef4444'; // red
            break;
        case 'disease':
            hotspots = generateDiseaseHotspots(fieldId);
            color = '#a855f7'; // purple
            break;
        case 'weed':
            hotspots = generateWeedHotspots(fieldId);
            color = '#22c55e'; // green
            break;
        default:
            hotspots = [];
            color = '#000000';
    }

    return {
        hotspots,
        svg: generateHeatmapSVG(hotspots, color),
        color,
    };
}
