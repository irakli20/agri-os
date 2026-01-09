'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoutingRouteMapProps {
    pattern: 'zigzag' | 'diamond' | 'perimeter' | 'grid';
    progress?: number; // 0 to 100
    className?: string;
}

export function ScoutingRouteMap({ pattern, progress = 0, className }: ScoutingRouteMapProps) {
    const [pathLength, setPathLength] = useState(0);

    // Mock field boundary (normalized 0-100 coordinates)
    const boundary = "M 10,10 L 90,10 L 90,90 L 10,90 Z";

    // Generate path based on pattern
    const getPath = (p: string) => {
        switch (p) {
            case 'zigzag':
                return "M 15,85 L 85,85 L 15,65 L 85,65 L 15,45 L 85,45 L 15,25 L 85,25";
            case 'diamond':
                return "M 50,85 L 85,50 L 50,15 L 15,50 Z";
            case 'perimeter':
                return "M 15,85 L 85,85 L 85,15 L 15,15 Z";
            case 'grid':
                return "M 20,80 L 20,20 M 40,80 L 40,20 M 60,80 L 60,20 M 80,80 L 80,20 M 20,30 L 80,30 M 20,50 L 80,50 M 20,70 L 80,70";
            default:
                return "";
        }
    };

    const pathData = getPath(pattern);

    return (
        <div className={cn("relative aspect-square bg-green-900/20 rounded-xl overflow-hidden border border-white/10", className)}>
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100">
                {/* Field Boundary */}
                <path
                    d={boundary}
                    fill="rgba(34, 197, 94, 0.1)"
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="1"
                />

                {/* Scouting Path */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* Active Path Animation */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset={1000 - (progress * 10)} // Simple animation mock
                    className="transition-all duration-1000 ease-linear"
                />

                {/* Start Point */}
                <circle cx="15" cy="85" r="3" fill="#4ade80" />

                {/* End Point */}
                {pattern === 'zigzag' && <circle cx="85" cy="25" r="3" fill="#ef4444" />}
            </svg>

            {/* Legend/Info Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs flex items-center gap-2">
                <Navigation className="w-3 h-3 text-green-400" />
                <span className="font-medium capitalize">{pattern} Route</span>
            </div>
        </div>
    );
}
