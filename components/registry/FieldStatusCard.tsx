'use client';

import React from 'react';
import { Activity, Calendar, AlertTriangle } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { useMapStore } from '@/lib/map-store';

export function FieldStatusCard() {
    const { activeBand } = useMapStore();

    return (
        <Widget title="Field Status: Sector B" className="col-span-1">
            <div className="space-y-3">
                {/* Health Score */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Avg. NDVI</span>
                            <span className="text-xs text-muted-foreground">Last Flight: 2h ago</span>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-green-400">0.85</span>
                </div>

                {/* Active Band Indicator */}
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-xs text-muted-foreground">Active View</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        {activeBand}
                    </span>
                </div>

                {/* Alerts */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-red-400">Moisture Stress Detected</span>
                            <span className="text-[10px] text-red-400/70">North-East Quadrant</span>
                        </div>
                    </div>
                </div>
            </div>
        </Widget>
    );
}
