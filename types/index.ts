/**
 * Agri-OS Type Definitions
 * Core types for geospatial data, map state, and component registry
 */

import { Layer } from '@deck.gl/core';

// ============================================================================
// Map & Geospatial Types
// ============================================================================

export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    transitionDuration?: number;
}

export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export type BasemapStyle = 'dark' | 'satellite' | 'terrain' | 'streets';

// ============================================================================
// Agronomic Data Types
// ============================================================================

export interface Field {
    id: string;
    name: string;
    geometry: GeoJSON.Polygon;
    area: number; // hectares
    crop?: string;
    growthStage?: string;
}

export interface MultispectralBand {
    type: 'RGB' | 'NIR' | 'RedEdge' | 'Thermal' | 'NDVI' | 'NDRE';
    url: string; // COG URL
    timestamp: Date;
}

export interface DroneImagery {
    id: string;
    fieldId: string;
    flightDate: Date;
    bands: MultispectralBand[];
    resolution: number; // cm/pixel
    altitude: number; // meters
}

// ============================================================================
// Component Registry Types (for AI Generation)
// ============================================================================

export interface GenerativeComponent {
    id: string;
    name: string;
    description: string;
    category: 'analysis' | 'control' | 'visualization' | 'input' | 'widget';
    props: Record<string, any>;
    dependencies?: string[]; // Other component IDs this depends on
}

export interface ComponentRegistryEntry {
    component: React.ComponentType<any>;
    metadata: GenerativeComponent;
}

// ============================================================================
// Map Store State (Zustand)
// ============================================================================

export interface MapStore {
    viewState: ViewState;
    basemapStyle: BasemapStyle;
    layers: Layer[];
    selectedField: Field | null;
    activeBand: 'rgb' | 'ndvi' | 'thermal';
    layerOpacity: number;

    // Actions
    setViewState: (viewState: Partial<ViewState>) => void;
    setBasemapStyle: (style: BasemapStyle) => void;
    addLayer: (layer: Layer) => void;
    removeLayer: (layerId: string) => void;
    setSelectedField: (field: Field | null) => void;
    setActiveBand: (band: 'rgb' | 'ndvi' | 'thermal') => void;
    setLayerOpacity: (opacity: number) => void;
}
