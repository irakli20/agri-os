'use client';

import { AppShell } from '@/components/layout/AppShell';
import { FIELDS } from '@/lib/mock-data';
import { MapPin, Calendar, TrendingUp, TrendingDown, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { AddFieldModal } from '@/components/modals/AddFieldModal';
import { CropRotationPlannerModal } from '@/components/modals/CropRotationPlannerModal';

export default function FieldsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRotationPlannerOpen, setIsRotationPlannerOpen] = useState(false);

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
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Fields</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and monitor all {FIELDS.length} fields across 450 acres
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsRotationPlannerOpen(true)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Plan Rotation
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            + Add Field
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Area</div>
                        <div className="text-2xl font-bold">{FIELDS.reduce((sum, f) => sum + f.acres, 0)} acres</div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Avg. Health</div>
                        <div className="text-2xl font-bold text-green-400">
                            {Math.round((FIELDS.reduce((sum, f) => sum + f.ndviScore, 0) / FIELDS.length) * 100)}
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Active Crops</div>
                        <div className="text-2xl font-bold">{new Set(FIELDS.map(f => f.crop)).size}</div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Needs Attention</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {FIELDS.filter(f => f.healthStatus === 'attention' || f.healthStatus === 'critical').length}
                        </div>
                    </div>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {FIELDS.map((field) => (
                        <Link
                            key={field.id}
                            href={`/fields/${field.id}`}
                            className="glass-panel rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        {field.name}
                                        {(field.healthStatus === 'attention' || field.healthStatus === 'critical') && (
                                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{field.crop} • {field.acres} acres</p>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                                    getHealthColor(field.healthStatus)
                                )}>
                                    {field.healthStatus}
                                </span>
                            </div>

                            {/* NDVI Score */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">NDVI Health Score</span>
                                    <span className="text-2xl font-bold">{getHealthScore(field.ndviScore)}</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all",
                                            field.ndviScore > 0.75 && "bg-green-500",
                                            field.ndviScore > 0.55 && field.ndviScore <= 0.75 && "bg-yellow-500",
                                            field.ndviScore <= 0.55 && "bg-red-500"
                                        )}
                                        style={{ width: `${getHealthScore(field.ndviScore)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-muted-foreground text-xs">Planted</div>
                                        <div className="font-medium">
                                            {new Date(field.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-muted-foreground text-xs">Last Flight</div>
                                        <div className="font-medium">
                                            {new Date(field.lastFlightDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-center opacity-0 group-hover:opacity-100">
                                View Multispectral Analysis →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


            {/* Add Field Modal */}
            <AddFieldModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(field) => {
                    console.log('Field added:', field);
                }}
            />

            {/* Crop Rotation Planner Modal */}
            <CropRotationPlannerModal
                isOpen={isRotationPlannerOpen}
                onClose={() => setIsRotationPlannerOpen(false)}
                onSubmit={(plan) => {
                    console.log('Rotation plan created:', plan);
                }}
            />
        </AppShell >
    );
}
