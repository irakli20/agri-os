'use client';

import React, { useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { BitmapLayer } from '@deck.gl/layers';
import { useMapStore } from '@/lib/map-store';

/**
 * MapCanvas Component
 * 
 * Simple map canvas for the main dashboard background
 * No field boundaries are shown - just a clean background
 */
export function MapCanvas() {
    const { viewState, setViewState, layers: storeLayers, basemapStyle, activeBand, layerOpacity } = useMapStore();

    const handleViewStateChange = useCallback(
        ({ viewState: newViewState }: any) => {
            setViewState(newViewState);
        },
        [setViewState]
    );

    // Simple layers - no field boundaries on main dashboard
    const activeLayers = React.useMemo(() => {
        const spectralLayer = new BitmapLayer({
            id: 'spectral-overlay',
            bounds: [-121.66, 36.67, -121.64, 36.69],
            image: `/${activeBand}-field.png`,
            opacity: layerOpacity,
            visible: activeBand !== 'rgb'
        });

        return [spectralLayer, ...storeLayers];
    }, [activeBand, layerOpacity, storeLayers]);

    return (
        <div className="map-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Background */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: getBasemapBackground(basemapStyle),
                    zIndex: 0,
                }}
            />

            {/* DeckGL Layer */}
            <DeckGL
                viewState={viewState}
                onViewStateChange={handleViewStateChange}
                controller={true}
                layers={activeLayers}
                getCursor={() => 'default'}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    zIndex: '1',
                }}
            />
        </div>
    );
}

/**
 * Basemap background styles
 */
function getBasemapBackground(style: string): string {
    const styles: Record<string, string> = {
        dark: 'linear-gradient(180deg, #0a0e1a 0%, #1a1f2e 100%)',
        satellite: '#000000',
        terrain: '#2d3748',
        streets: '#1a202c',
    };
    return styles[style] || styles.dark;
}
