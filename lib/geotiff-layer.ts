import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { load } from '@loaders.gl/core';
import { GeoTIFFLoader } from '@loaders.gl/geotiff';

/**
 * GeoTIFF Layer Utility
 * 
 * Handles the creation of Deck.gl layers for multispectral imagery.
 * Supports COG (Cloud Optimized GeoTIFF) for efficient tiling.
 */

export interface LayerSettings {
    band: 'rgb' | 'ndvi' | 'ndre' | 'thermal';
    opacity: number;
    contrast?: number;
    brightness?: number;
}

/**
 * Create a Deck.gl layer for a GeoTIFF/COG
 * 
 * @param id Unique layer ID
 * @param url URL to the GeoTIFF/COG file
 * @param settings Visualization settings
 */
export function createGeoTIFFLayer(id: string, url: string, settings: LayerSettings) {
    const { band, opacity } = settings;

    // Use TileLayer for COGs/Large TIFFs
    return new TileLayer({
        id: `${id}-${band}`,
        data: url,
        opacity,

        // Loaders.gl configuration for GeoTIFF
        loaders: [GeoTIFFLoader],

        loadOptions: {
            geotiff: {
                // Optimization: only fetch needed bands
                // bands: getBandsForAnalysis(band)
            }
        },

        renderSubLayers: (props: any) => {
            const { data } = props;

            // If data is available, we can apply custom shaders for NDVI/NDRE
            return new BitmapLayer(props, {
                data: undefined,
                image: props.data,
                // Custom shaders would go here for NDVI calculation on the GPU
                // For now, we assume the server/loader provides the processed image or we use simple RGB
                desaturate: band === 'thermal' ? 1 : 0,
                transparentColor: [0, 0, 0, 0],
            });
        }
    });
}

/**
 * Helper to determine which spectral bands are needed for a given analysis
 */
function getBandsForAnalysis(band: 'rgb' | 'ndvi' | 'ndre' | 'thermal'): number[] {
    switch (band) {
        case 'rgb': return [0, 1, 2]; // Red, Green, Blue
        case 'ndvi': return [2, 4];   // Red, NIR (MicaSense mapping)
        case 'ndre': return [3, 4];   // RedEdge, NIR
        case 'thermal': return [5];   // Thermal
        default: return [0, 1, 2];
    }
}
