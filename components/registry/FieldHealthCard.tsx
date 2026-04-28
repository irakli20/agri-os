'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Trash2 } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { cn } from '@/lib/utils';
import { getFieldDisplaySemantics } from '@/lib/field-display';

export function FieldHealthCard() {
    const { getFieldsForMode, deleteField } = useFieldStore();
    const { gameMode } = useGameStore();

    const fields = getFieldsForMode(gameMode ? 'strategy' : 'demo');

    const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setFieldToDelete(id);
    };

    const confirmDelete = () => {
        if (fieldToDelete) {
            deleteField(fieldToDelete);
            setFieldToDelete(null);
        }
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'from-green-500 to-primary';
            case 'good': return 'from-lime-500 to-green-600';
            case 'attention': return 'from-yellow-500 to-orange-500';
            case 'critical': return 'from-red-500 to-rose-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getHealthScore = (ndvi: number) => Math.round(ndvi * 100);

    return (
        <>
            <Widget title="Field Health Overview" className="col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fields.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10">
                            <p className="mb-2">No active fields</p>
                            {gameMode ? (
                                <Link
                                    href="/game/marketplace"
                                    className="text-sm text-green-400 hover:text-green-300 font-medium"
                                >
                                    Browse Marketplace →
                                </Link>
                            ) : (
                                <p className="text-xs">Add a field to see health status</p>
                            )}
                        </div>
                    ) : (
                        fields.map((field) => {
                            const display = getFieldDisplaySemantics(field);

                            return (
                            <Link
                                key={field.id}
                                href={`/fields/${field.id}`}
                                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer block"
                            >
                                {/* Field Image or NDVI Heatmap Simulation */}
                                {field.image ? (
                                    <div className="absolute inset-0 h-full w-full">
                                        <img
                                            src={field.image}
                                            alt={field.name}
                                            className="h-24 w-full object-contain opacity-50 group-hover:opacity-60 transition-opacity"
                                        />
                                        <div className="absolute inset-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "h-24 bg-gradient-to-br",
                                        getHealthColor(field.healthStatus),
                                        "opacity-30 group-hover:opacity-40 transition-opacity"
                                    )} />
                                )}

                                {/* Field Info Overlay */}
                                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold text-white drop-shadow-lg">
                                                {field.name}
                                            </h4>
                                            <p className="text-[10px] text-white/80 drop-shadow">{display.displayCropLabel}</p>
                                        </div>

                                        {field.healthStatus === 'critical' && (
                                            <AlertTriangle className="w-4 h-4 text-red-400 drop-shadow-lg" />
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, field.id)}
                                        className="absolute top-2 right-2 p-1.5 text-white/70 hover:text-red-400 hover:bg-black/40 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Field"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-white drop-shadow-lg">
                                                {display.scoreValue}
                                            </div>
                                            <div className="text-[10px] text-white/80 drop-shadow">{display.scoreLabel}</div>
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
                                            <span className="text-[9px] text-white/60 drop-shadow">{field.acres} acres • {display.stageLabel}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )})
                    )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Coverage</span>
                    <span className="font-medium">{fields.reduce((sum, f) => sum + f.acres, 0).toFixed(1)} acres</span>
                </div>
            </Widget>

            {/* Delete Confirmation Modal */}
            {
                fieldToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                        <div className="bg-card border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                            <h3 className="text-lg font-semibold text-white mb-2">Delete Field</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Are you sure you want to delete this field? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setFieldToDelete(null)}
                                    className="px-4 py-2 text-sm rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    Delete Field
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
