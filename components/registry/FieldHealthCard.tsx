'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { FIELDS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function FieldHealthCard() {
    const getHealthColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'from-green-500 to-emerald-600';
            case 'good': return 'from-lime-500 to-green-600';
            case 'attention': return 'from-yellow-500 to-orange-500';
            case 'critical': return 'from-red-500 to-rose-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getHealthScore = (ndvi: number) => Math.round(ndvi * 100);

    return (
        <Widget title="Field Health Overview" className="col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FIELDS.map((field) => (
                    <Link
                        key={field.id}
                        href={`/fields/${field.id}`}
                        className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    >
                        {/* NDVI Heatmap Simulation */}
                        <div className={cn(
                            "h-24 bg-gradient-to-br",
                            getHealthColor(field.healthStatus),
                            "opacity-30 group-hover:opacity-40 transition-opacity"
                        )} />

                        {/* Field Info Overlay */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold text-white drop-shadow-lg">
                                        {field.name}
                                    </h4>
                                    <p className="text-[10px] text-white/80 drop-shadow">{field.crop}</p>
                                </div>

                                {field.healthStatus === 'critical' && (
                                    <AlertTriangle className="w-4 h-4 text-red-400 drop-shadow-lg" />
                                )}
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-white drop-shadow-lg">
                                        {getHealthScore(field.ndviScore)}
                                    </div>
                                    <div className="text-[10px] text-white/80 drop-shadow">NDVI Score</div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className={cn(
                                        "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
                                        field.healthStatus === 'excellent' && "bg-green-500/30 text-green-200",
                                        field.healthStatus === 'good' && "bg-lime-500/30 text-lime-200",
                                        field.healthStatus === 'attention' && "bg-yellow-500/30 text-yellow-200",
                                        field.healthStatus === 'critical' && "bg-red-500/30 text-red-200"
                                    )}>
                                        {field.ndviScore > 0.75 ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : field.ndviScore < 0.55 ? (
                                            <TrendingDown className="w-3 h-3" />
                                        ) : (
                                            <Minus className="w-3 h-3" />
                                        )}
                                        {field.healthStatus}
                                    </div>
                                    <span className="text-[9px] text-white/60 drop-shadow">{field.acres} acres</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Coverage</span>
                <span className="font-medium">{FIELDS.reduce((sum, f) => sum + f.acres, 0)} acres</span>
            </div>
        </Widget>
    );
}
