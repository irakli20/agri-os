/**
 * Component Registry Index
 * 
 * This is the central registry of "Smart Components" that the AI Agent
 * can dynamically assemble to build custom interfaces.
 * 
 * Each component is:
 * 1. Self-contained and modular
 * 2. Documented with metadata for AI selection
 * 3. Designed for composition with other registry components
 * 
 * The AI uses this registry instead of generating code from scratch,
 * ensuring consistency, performance, and domain expertise.
 */

import { MapCanvas } from './MapCanvas';
import { SpectrumSlider } from './SpectrumSlider';
import { WeatherCard } from './WeatherCard';
import { FieldStatusCard } from './FieldStatusCard';
import { FleetStatusCard } from './FleetStatusCard';
import { TaskListCard } from './TaskListCard';
import { FieldHealthCard } from './FieldHealthCard';
import { RecentFlightsCard } from './RecentFlightsCard';
import { ComponentRegistryEntry } from '@/types';

// ============================================================================
// Registry Exports
// ============================================================================

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
    'map-canvas': {
        component: MapCanvas,
        metadata: {
            id: 'map-canvas',
            name: 'Map Canvas',
            description: 'High-performance geospatial rendering engine using Deck.gl. Handles multispectral imagery and heavy point cloud data.',
            category: 'visualization',
            props: {},
        },
    },

    'spectrum-slider': {
        component: SpectrumSlider,
        metadata: {
            id: 'spectrum-slider',
            name: 'Spectrum Slider',
            description: 'Controls for switching between multispectral bands (RGB, NIR, Thermal) and adjusting layer opacity.',
            category: 'control',
            props: {},
        },
    },

    'weather-card': {
        component: WeatherCard,
        metadata: {
            id: 'weather-card',
            name: 'Weather Card',
            description: 'Displays local weather conditions, wind speed, and spray suitability.',
            category: 'widget',
            props: {},
        },
    },

    'field-status-card': {
        component: FieldStatusCard,
        metadata: {
            id: 'field-status-card',
            name: 'Field Status Card',
            description: 'Summary of field health (NDVI), active tasks, and alerts.',
            category: 'widget',
            props: {},
        },
    },

    'fleet-status-card': {
        component: FleetStatusCard,
        metadata: {
            id: 'fleet-status-card',
            name: 'Fleet Status Card',
            description: 'Shows drone fleet status, battery levels, and flight hours.',
            category: 'widget',
            props: {},
        },
    },

    'task-list-card': {
        component: TaskListCard,
        metadata: {
            id: 'task-list-card',
            name: 'Task List Card',
            description: 'Displays upcoming spray missions, surveys, and sampling tasks.',
            category: 'widget',
            props: {},
        },
    },

    'field-health-card': {
        component: FieldHealthCard,
        metadata: {
            id: 'field-health-card',
            name: 'Field Health Card',
            description: 'Grid view of all fields with NDVI heatmaps and health scores.',
            category: 'widget',
            props: {},
        },
    },

    'recent-flights-card': {
        component: RecentFlightsCard,
        metadata: {
            id: 'recent-flights-card',
            name: 'Recent Flights Card',
            description: 'Timeline of recent drone flights with coverage and data collected.',
            category: 'widget',
            props: {},
        },
    },

    // Future components (Phase 2+):
    // 'spray-calculator': { ... },
    // 'growth-stage-bar': { ... },
    // 'mission-editor': { ... },
};

/**
 * Helper function for AI to query available components
 */
export function getComponentByCategory(category: string) {
    return Object.values(COMPONENT_REGISTRY).filter(
        (entry) => entry.metadata.category === category
    );
}

/**
 * Helper function for AI to search components by description
 */
export function searchComponents(query: string) {
    const lowerQuery = query.toLowerCase();
    return Object.values(COMPONENT_REGISTRY).filter(
        (entry) =>
            entry.metadata.name.toLowerCase().includes(lowerQuery) ||
            entry.metadata.description.toLowerCase().includes(lowerQuery)
    );
}
