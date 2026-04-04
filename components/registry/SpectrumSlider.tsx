'use client';

import React from 'react';
import { useMapStore } from '@/lib/map-store';
import { cn } from '@/lib/utils';
import { Layers, Activity, Thermometer, Eye } from 'lucide-react';

/**
 * SpectrumSlider Component
 * 
 * Allows the user to toggle between different spectral bands and indices.
 * This component is "generative-ready" - the AI can inject it when
 * the user context implies imagery analysis.
 */
export function SpectrumSlider() {
    const { activeBand, setActiveBand, layerOpacity, setLayerOpacity } = useMapStore();

    const bands = [
        { id: 'rgb', label: 'RGB', icon: Eye, color: 'bg-blue-500' },
        { id: 'ndvi', label: 'NDVI', icon: Activity, color: 'bg-green-500' },
        { id: 'ndre', label: 'NDRE', icon: Activity, color: 'bg-primary' },
        { id: 'thermal', label: 'Thermal', icon: Thermometer, color: 'bg-red-500' },
    ] as const;

    return (
        <div className="generative-panel p-4 w-64 bottom-8 right-8 fixed z-20">
            <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Spectral Analysis</h3>
            </div>

            <div className="space-y-4">
                {/* Band Selection */}
                <div className="grid grid-cols-4 gap-2">
                    {bands.map((band) => {
                        const Icon = band.icon;
                        const isActive = activeBand === band.id;

                        return (
                            <button
                                key={band.id}
                                onClick={() => setActiveBand(band.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-md transition-all",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActive
                                        ? "bg-accent text-accent-foreground ring-1 ring-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                                    isActive ? band.color + "/20" : "bg-muted"
                                )}>
                                    <Icon className={cn(
                                        "w-4 h-4",
                                        isActive ? "text-" + band.color.split('-')[1] + "-500" : "text-muted-foreground"
                                    )} />
                                </div>
                                <span className="text-xs font-medium">{band.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Opacity Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Opacity</span>
                        <span>{Math.round(layerOpacity * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layerOpacity}
                        onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
        </div>
    );
}
