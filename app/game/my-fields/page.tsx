'use client';

import React from 'react';
import { GameShell } from '@/components/game/GameShell';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import Link from 'next/link';
import { AlertTriangle, Calendar, Eye, Trash2, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameAuthScreen } from '@/components/game/GameAuthScreen';
import { getFieldDisplaySemantics, isFieldGrowing } from '@/lib/field-display';

export default function MyFieldsPage() {
    const { getStrategyFields } = useFieldStore();
    const { currentPlayerId } = useGameStore();

    if (!currentPlayerId) {
        return <GameAuthScreen />;
    }

    const fields = getStrategyFields();

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-green-400 bg-green-500/20';
            case 'good': return 'text-lime-400 bg-lime-500/20';
            case 'attention': return 'text-yellow-400 bg-yellow-500/20';
            case 'critical': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getHealthScore = (ndvi: number) => Math.round(ndvi * 100);

    return (
        <GameShell>
            <div className="h-full overflow-y-auto p-6 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Fields</h1>
                    <p className="text-muted-foreground">
                        Manage your owned and rented fields. Monitor crop health, farming stages, and dispatch operations.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/5">
                        <div className="text-sm text-muted-foreground mb-1">Total Fields</div>
                        <div className="text-2xl font-bold">{fields.length}</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/5">
                        <div className="text-sm text-muted-foreground mb-1">Total Area</div>
                        <div className="text-2xl font-bold">{fields.reduce((sum, f) => sum + f.acres, 0).toFixed(1)} ha</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/5">
                        <div className="text-sm text-muted-foreground mb-1">Avg. Crop Health</div>
                        <div className="text-2xl font-bold text-green-400">
                            {(() => {
                                const growingFields = fields.filter(isFieldGrowing);
                                return growingFields.length > 0
                                    ? Math.round((growingFields.reduce((sum, f) => sum + f.ndviScore, 0) / growingFields.length) * 100)
                                    : '—';
                            })()}
                        </div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border-yellow-500/20 bg-yellow-500/5">
                        <div className="text-sm text-yellow-500/80 mb-1">Needs Attention</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {fields.filter(f => f.healthStatus === 'attention' || f.healthStatus === 'critical').length}
                        </div>
                    </div>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {fields.length === 0 ? (
                        <div className="col-span-full glass-panel rounded-2xl p-12 text-center border border-dashed border-white/20">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Sprout className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No fields yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                You haven&apos;t purchased or rented any fields yet. Head over to the Marketplace to acquire your first plot of land.
                            </p>
                            <Link href="/game/marketplace" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-400 transition-colors">
                                Go to Marketplace
                            </Link>
                        </div>
                    ) : (
                        fields.map((field) => {
                            const display = getFieldDisplaySemantics(field);

                            return (
                            <div
                                key={field.id}
                                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-green-500/30 transition-all duration-300 group flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 pr-2">
                                        <Link href={`/fields/${field.id}`} className="block group-hover:text-green-400 transition-colors">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                {field.name}
                                                {(field.healthStatus === 'attention' || field.healthStatus === 'critical') && (
                                                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                                                )}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {display.displayCropLabel} • {field.acres} ha
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                            getHealthColor(field.healthStatus)
                                        )}>
                                            {field.healthStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* NDVI / Field Health Score */}
                                <div className="mb-5 bg-black/20 p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {display.scoreLabel}
                                        </span>
                                        <span className="text-xl font-bold">{display.scoreValue}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                field.ndviScore > 0.75 && "bg-green-500",
                                                field.ndviScore > 0.55 && field.ndviScore <= 0.75 && "bg-yellow-500",
                                                field.ndviScore <= 0.55 && "bg-red-500"
                                            )}
                                            style={{ width: `${display.scoreValue}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-1.5 truncate">
                                        {display.scoreDescription}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                                    <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                                        <div className="overflow-hidden">
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Planted</div>
                                            <div className="text-xs font-medium truncate">
                                                {new Date(field.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                                        <Eye className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                                        <div className="overflow-hidden">
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Analyzed</div>
                                            <div className="text-xs font-medium truncate">
                                                {new Date(field.lastFlightDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={`/fields/${field.id}`}
                                    className="w-full py-2.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/20 hover:border-green-500 rounded-xl text-sm font-semibold transition-all text-center block"
                                >
                                    {display.primaryActionLabel.replace(' →', '')}
                                </Link>
                            </div>
                        )})
                    )}
                </div>
            </div>
        </GameShell>
    );
}
