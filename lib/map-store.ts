// @ts-nocheck
import { create } from 'zustand';
import { MapStore, ViewState, BasemapStyle } from '@/types';
import { Layer } from '@deck.gl/core';

/**
 * Agri-OS Map Store
 * Central state management for the map canvas and geospatial layers
 * This enables the AI to manipulate the map state programmatically
 */
export const useMapStore = create<MapStore>((set) => ({
    // Initial view state - centered on a typical agricultural region
    // You can customize this to your primary operating area
    viewState: {
        longitude: -95.7129, // Central US (example)
        latitude: 37.0902,
        zoom: 12,
        pitch: 0,
        bearing: 0,
    },

    basemapStyle: 'dark',
    layers: [],
    selectedField: null,
    activeBand: 'rgb',
    layerOpacity: 1.0,

    // Actions
    setViewState: (newViewState: Partial<ViewState>) =>
        set((state) => ({
            viewState: { ...state.viewState, ...newViewState },
        })),

    setBasemapStyle: (style: BasemapStyle) =>
        set({ basemapStyle: style }),

    addLayer: (layer: Layer) =>
        set((state) => ({
            layers: [...state.layers, layer],
        })),

    removeLayer: (layerId: string) =>
        set((state) => ({
            layers: state.layers.filter((layer) => layer.id !== layerId),
        })),

    setSelectedField: (field) =>
        set({ selectedField: field }),

    setActiveBand: (band) =>
        set({ activeBand: band }),

    setLayerOpacity: (opacity) =>
        set({ layerOpacity: opacity }),
}));
