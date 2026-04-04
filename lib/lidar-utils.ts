// @ts-nocheck
// Simple pseudo-random noise function for terrain generation
// Simple pseudo-random noise function for terrain generation
export const terrainNoise = (x: number, z: number) => {
    // Multi-frequency noise for more organic look
    const n1 = Math.sin(x * 0.05 + z * 0.03);
    const n2 = Math.cos(x * 0.1 - z * 0.08) * 0.5;
    const n3 = Math.sin(x * 0.2 + z * 0.2) * 0.25;
    return (n1 + n2 + n3) * 2;
};

// Crop height noise (more high frequency)
export const cropNoise = (x: number, z: number) => {
    // Organic cellular-like noise
    const n1 = Math.abs(Math.sin(x * 0.3) * Math.cos(z * 0.3));
    const n2 = Math.abs(Math.cos(x * 0.6 + z * 0.2) * Math.sin(z * 0.6 - x * 0.1)) * 0.5;
    return (n1 + n2) * 1.5 + Math.random() * 0.1;
};

export const getLidarValue = (x: number, y: number, type: 'elevation' | 'absolute' | 'crop-height') => {
    const elevation = terrainNoise(x, y);
    const cropHeight = cropNoise(x, y);

    switch (type) {
        case 'elevation':
            return elevation;
        case 'absolute':
            return elevation + cropHeight;
        case 'crop-height':
            return cropHeight;
        default:
            return 0;
    }
};

export const getLidarColor = (value: number, type: 'elevation' | 'absolute' | 'crop-height') => {
    if (type === 'crop-height') {
        // Red (low) to Green (high)
        // Assuming crop height ranges roughly 0 to 2
        const t = Math.min(Math.max(value / 1.5, 0), 1);
        const r = Math.round((1 - t) * 255);
        const g = Math.round(t * 255);
        return `rgb(${r}, ${g}, 0)`;
    } else if (type === 'elevation') {
        // Brown/Terrain map
        // Range roughly -3 to 3
        const t = (value + 3) / 6;
        const r = Math.round(139 * t + 50);
        const g = Math.round(69 * t + 50);
        const b = Math.round(19 * t + 20);
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // Absolute - mix of both? Or just heat map
        const t = (value + 3) / 8;
        const v = Math.round(t * 255);
        return `rgb(${v}, ${v}, ${v})`;
    }
};
