'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { MapPin, Calendar, TrendingUp, TrendingDown, AlertTriangle, Eye, RefreshCw, Trash2, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { AddFieldModal } from '@/components/modals/AddFieldModal';
import { CropRotationPlannerModal } from '@/components/modals/CropRotationPlannerModal';

export default function FieldsPage() {
    const { getActiveFields, addField, deleteField } = useFieldStore();
    const { gameMode, abandonField } = useGameStore();

    // Get fields based on active mode
    const fields = getActiveFields(gameMode);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRotationPlannerOpen, setIsRotationPlannerOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

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

    const isFieldGrowing = (field: { farmingStage?: string }) => {
        return field.farmingStage === 'growing' || field.farmingStage === 'harvest_ready';
    };

    const handleDeleteField = (fieldId: string) => {
        setFieldToDelete(fieldId);
    };

    const confirmDelete = () => {
        if (fieldToDelete) {
            if (gameMode) {
                abandonField(fieldToDelete);
            }
            deleteField(fieldToDelete);
            setFieldToDelete(null);
        }
    };

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Game Mode Banner */}
                {gameMode && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <Gamepad2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-400">Strategy Mode Active</h3>
                            <p className="text-sm text-green-400/80">
                                Managing your {fields.length} active fields. Purchase more land in the Marketplace.
                            </p>
                        </div>
                        <Link
                            href="/game/marketplace"
                            className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors"
                        >
                            Marketplace
                        </Link>
                    </div>
                )}

                {/* Header */}
                <div className="card-soft rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Fields</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and monitor all {fields.length} fields across {fields.reduce((s, f) => s + f.acres, 0).toFixed(1)} acres
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsRotationPlannerOpen(true)}
                            className="cta-secondary flex items-center gap-2 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Plan Rotation
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="cta-primary text-sm"
                        >
                            + Add Field
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card-soft rounded-2xl p-4 elevate-card">
                        <div className="text-sm text-muted-foreground mb-1">Total Area</div>
                        <div className="text-2xl font-bold">{fields.reduce((sum, f) => sum + f.acres, 0).toFixed(1)} acres</div>
                    </div>
                    <div className="card-soft rounded-2xl p-4 elevate-card">
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
                    <div className="card-soft rounded-2xl p-4 elevate-card">
                        <div className="text-sm text-muted-foreground mb-1">Active Crops</div>
                        <div className="text-2xl font-bold">{new Set(fields.map(f => f.crop)).size}</div>
                    </div>
                    <div className="card-soft rounded-2xl p-4 elevate-card">
                        <div className="text-sm text-muted-foreground mb-1">Needs Attention</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {fields.filter(f => f.healthStatus === 'attention' || f.healthStatus === 'critical').length}
                        </div>
                    </div>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {fields.length === 0 && (
                        <div className="lg:col-span-2 card-soft rounded-2xl p-10 text-center border border-dashed border-white/20">
                            <h3 className="text-lg font-semibold mb-2">No active fields</h3>
                            <p className="text-sm text-muted-foreground mb-4">Add a field to start monitoring health, scouting, and operational priorities.</p>
                            <button onClick={() => setIsAddModalOpen(true)} className="cta-primary text-sm">Add First Field</button>
                        </div>
                    )}
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="card-soft rounded-2xl p-6 transition-all group elevate-card"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <Link
                                        href={`/fields/${field.id}`}
                                        data-guide-id={index === 0 ? 'fields-open-first-field' : undefined}
                                        className="block"
                                    >
                                        <h3 className="text-xl font-semibold flex items-center gap-2 hover:text-primary transition-colors">
                                            {field.name}
                                            {(field.healthStatus === 'attention' || field.healthStatus === 'critical') && (
                                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">{field.crop} • {field.acres} acres</p>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                                        getHealthColor(field.healthStatus)
                                    )}>
                                        {field.healthStatus}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteField(field.id);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete field"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* NDVI / Field Health Score */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        {isFieldGrowing(field) ? 'NDVI Crop Health' : 'Field Health Score'}
                                    </span>
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
                                {!isFieldGrowing(field) && (
                                    <div className="text-[10px] text-muted-foreground mt-1">
                                        {field.farmingStage ? field.farmingStage.replace(/_/g, ' ') : 'fallow'} — crop NDVI not yet available
                                    </div>
                                )}
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
                            <Link
                                href={`/fields/${field.id}`}
                                data-guide-id={index === 0 ? 'fields-open-first-field' : undefined}
                                className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-center block"
                            >
                                {isFieldGrowing(field) ? 'View Multispectral Analysis →' : 'View Field Details →'}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Field Modal */}
            <AddFieldModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(fieldData) => {
                    addField({
                        ...fieldData,
                        id: `field-${Date.now()}`,
                        ndviScore: 0.6,
                        healthStatus: 'good',
                        lastFlightDate: new Date().toISOString(),
                        coordinates: fieldData.coordinates || [
                            [-121.65, 36.68],
                            [-121.64, 36.68],
                            [-121.64, 36.67],
                            [-121.65, 36.67],
                            [-121.65, 36.68],
                        ],
                    } as any, gameMode);
                    setIsAddModalOpen(false);
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

            {/* Deletion Confirmation Modal */}
            {fieldToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Delete Field?</h2>
                                <p className="text-sm text-muted-foreground">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete <strong>{fields.find(f => f.id === fieldToDelete)?.name}</strong>?
                            All associated satellite data, scouting reports, and analysis will be permanently removed.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setFieldToDelete(null)}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Field
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
