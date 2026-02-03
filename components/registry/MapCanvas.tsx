'use client';

import React, { useState, useCallback, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { BitmapLayer, PolygonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { useMapStore } from '@/lib/map-store';
import { useFieldStore } from '@/lib/field-store';
import { createGeoTIFFLayer } from '@/lib/geotiff-layer';
import { useRouter } from 'next/navigation';

/**
 * MapCanvas Component
 * 
 * High-performance geospatial rendering engine for Agri-OS using Deck.gl
 * Designed to handle heavy multispectral imagery (MicaSense Altum TIFFs)
 */
export function MapCanvas() {
    const router = useRouter();
    const { viewState, setViewState, layers: storeLayers, basemapStyle, activeBand, layerOpacity } = useMapStore();
    const { fields } = useFieldStore();

    const [hoverInfo, setHoverInfo] = useState<any>(null);

    // Update view state to focus on the fields area (California/Georgia focus)
    useEffect(() => {
        // Default to first field if available, otherwise central California (mock data) or Georgia (user focus)
        const center = fields.length > 0
            ? fields[0].coordinates[0]
            : [44.8, 41.7]; // Georgia

        setViewState({
            longitude: center[0],
            latitude: center[1],
            zoom: 12,
            pitch: 0,
            bearing: 0,
        });
    }, [fields, setViewState]);

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
        if (info.object && info.object.id) {
            router.push(`/fields/${info.object.id}`);
        }
    }, [router]);

    // Combine store layers with generated spectral layers and fields layer
    const activeLayers = React.useMemo(() => {
        const spectralLayer = new BitmapLayer({
            id: 'spectral-overlay',
            bounds: [-121.66, 36.67, -121.64, 36.69],
            image: `/${activeBand}-field.png`,
            opacity: layerOpacity,
            visible: activeBand !== 'rgb'
        });

        const fieldsLayer = new PolygonLayer({
            id: 'fields-polygon-layer',
            data: fields,
            pickable: true,
            stroked: true,
            filled: true,
            extruded: false,
            wireframe: true,
            getPolygon: (d: any) => d.coordinates,
            getFillColor: (d: any) => {
                switch (d.healthStatus) {
                    case 'excellent': return [34, 197, 94, 120];
                    case 'good': return [132, 204, 22, 120];
                    case 'attention': return [234, 179, 8, 120];
                    case 'critical': return [239, 68, 68, 120];
                    default: return [255, 255, 255, 120];
                }
            },
            getLineColor: (d: any) => {
                switch (d.healthStatus) {
                    case 'excellent': return [34, 197, 94];
                    case 'good': return [132, 204, 22];
                    case 'attention': return [234, 179, 8];
                    case 'critical': return [239, 68, 68];
                    default: return [255, 255, 255];
                }
            },
            getLineWidth: 3,
            lineWidthUnits: 'pixels',
            updateTriggers: {
                getFillColor: [fields],
                getLineColor: [fields]
            }
        });

        // Add dots for centers to make them very clickable/visible
        const centersLayer = new ScatterplotLayer({
            id: 'fields-centers-layer',
            data: fields,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 5,
            radiusMaxPixels: 15,
            getPosition: (d: any) => d.coordinates[0],
            getFillColor: [255, 255, 255],
            getLineColor: [0, 0, 0],
            getLineWidth: 1,
        });

        return [spectralLayer, fieldsLayer, centersLayer, ...storeLayers];
    }, [activeBand, layerOpacity, storeLayers, fields]);

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
                onHover={handleHover}
                onClick={handleClick}
                getCursor={({ isHovering }) => isHovering ? 'pointer' : 'default'}
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
                    className="absolute z-10 pointer-events-none bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        left: hoverInfo.x + 15,
                        top: hoverInfo.y + 15,
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-lg leading-tight">
                            {hoverInfo.object.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <span className="bg-white/10 px-2 py-0.5 rounded-full">
                                {hoverInfo.object.crop}
                            </span>
                            <span>•</span>
                            <span>{hoverInfo.object.acres} acres</span>
                        </div>
                        <div className="mt-2 text-[10px] text-primary font-medium uppercase tracking-wider">
                            Click to view analysis →
                        </div>
                    </div>
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
