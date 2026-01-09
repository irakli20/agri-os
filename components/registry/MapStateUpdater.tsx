'use client';

import { useEffect } from 'react';
import { useMapStore } from '@/lib/map-store';

interface MapStateUpdaterProps {
    activeBand?: 'rgb' | 'ndvi' | 'thermal';
    zoom?: number;
    latitude?: number;
    longitude?: number;
}

/**
 * MapStateUpdater
 * 
 * A "headless" component used by the AI to trigger client-side state updates.
 * When the AI streams this component to the client, it mounts and immediately
 * updates the Zustand store.
 */
export function MapStateUpdater({ activeBand, zoom, latitude, longitude }: MapStateUpdaterProps) {
    const { setActiveBand, setViewState } = useMapStore();

    useEffect(() => {
        if (activeBand) {
            setActiveBand(activeBand);
        }

        if (zoom !== undefined || latitude !== undefined || longitude !== undefined) {
            setViewState({
                ...(zoom !== undefined && { zoom }),
                ...(latitude !== undefined && { latitude }),
                ...(longitude !== undefined && { longitude }),
            });
        }
    }, [activeBand, zoom, latitude, longitude, setActiveBand, setViewState]);

    return (
        <div className="text-xs text-muted-foreground mt-1">
            ✓ Map updated: {activeBand ? `Band: ${activeBand.toUpperCase()}` : ''}
            {zoom ? ` Zoom: ${zoom}` : ''}
        </div>
    );
}
