'use client';

import React, { useState, useCallback, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { useMapStore } from '@/lib/map-store';

/**
 * MapCanvas Component
 * 
 * High-performance geospatial rendering engine for Agri-OS using Deck.gl
 * Designed to handle heavy multispectral imagery (MicaSense Altum TIFFs)
 */
export function MapCanvas() {
    const { viewState, setViewState, layers, basemapStyle } = useMapStore();

    const [hoverInfo, setHoverInfo] = useState<any>(null);

    // Update view state to focus on a sample agricultural area
    useEffect(() => {
        setViewState({
            longitude: -61.68,
            latitude: 10.42,
            zoom: 15,
            pitch: 0,
            bearing: 0,
        });
    }, [setViewState]);

    const handleViewStateChange = useCallback(
        ({ viewState: newViewState }: any) => {
            setViewState(newViewState);
        },
        [setViewState]
    );

    const handleHover = useCallback((info: any) => {
        setHoverInfo(info);
    }, []);

    const handleClick = useCallback((info: any) => {
        if (info.object) {
            console.log('Clicked:', info.object);
        }
    }, []);

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
                layers={layers}
                onHover={handleHover}
                onClick={handleClick}
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

            {/* Hover tooltip */}
            {hoverInfo?.object && (
                <div
                    className="absolute z-10 pointer-events-none bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg text-sm"
                    style={{
                        left: hoverInfo.x + 10,
                        top: hoverInfo.y + 10,
                    }}
                >
                    <pre className="text-foreground">
                        {JSON.stringify(hoverInfo.object, null, 2)}
                    </pre>
                </div>
            )}
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
