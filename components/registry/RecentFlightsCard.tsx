'use client';

import React from 'react';
import { Clock, MapPin, Database } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { RECENT_FLIGHTS, FIELDS, DRONES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function RecentFlightsCard() {
    const getFieldName = (fieldId: string) => FIELDS.find(f => f.id === fieldId)?.name || 'Unknown';
    const getDroneName = (droneId: string) => DRONES.find(d => d.id === droneId)?.model || 'Unknown';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <Widget title="Recent Flights" className="col-span-1">
            <div className="space-y-2">
                {RECENT_FLIGHTS.slice(0, 5).map((flight, index) => (
                    <div
                        key={flight.id}
                        className="relative pl-6 pb-3 last:pb-0"
                    >
                        {/* Timeline Line */}
                        {index < RECENT_FLIGHTS.length - 1 && (
                            <div className="absolute left-2 top-6 bottom-0 w-px bg-white/10" />
                        )}

                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>

                        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium">{getFieldName(flight.fieldId)}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {getDroneName(flight.droneId).split(' ')[0]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {flight.duration}min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {flight.coverageArea}ac
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                    {formatDate(flight.date)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 flex-wrap">
                                {flight.dataCollected.map((data) => (
                                    <span
                                        key={data}
                                        className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                                    >
                                        {data}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Flights</span>
                <span className="font-medium">{RECENT_FLIGHTS.length}</span>
            </div>
        </Widget>
    );
}
