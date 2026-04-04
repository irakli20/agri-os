import React, { useState, useEffect } from 'react';
import { X, TestTube2, Layers, MapPin, FlaskConical, Beaker, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoilTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (config: SoilConfig, cost: number) => void;
    onManualPlacementStart?: (config: SoilConfig) => void; // New prop to handle manual mode
    fieldName: string;
    fieldAreaHa: number;
}

export interface SoilConfig {
    density: number | 'manual'; // Allow 'manual' mode
    type: 'basic' | 'precise' | 'becrop';
    depth: 'standard' | 'deep';
}

const TEST_TYPES = [
    { id: 'basic', name: 'Basic NPK', price: 15, icon: TestTube2, desc: 'Cost-effective check of N, P, K, pH and Moisture.' },
    { id: 'precise', name: 'Precise Macro/Micro', price: 40, icon: Beaker, desc: 'Detailed nutrient profile including all micro-elements.' },
    { id: 'becrop', name: 'BeCrop Biology', price: 150, icon: Sprout, desc: 'Advanced Biomemakers analysis of soil microbiome and pathogen risks.' },
] as const;

export function SoilTestModal({ isOpen, onClose, onConfirm, onManualPlacementStart, fieldName, fieldAreaHa }: SoilTestModalProps) {
    const [config, setConfig] = useState<SoilConfig>({
        density: 2, // 1 sample per 2 ha
        type: 'precise',
        depth: 'standard'
    });
    const [totalCost, setTotalCost] = useState(0);

    const totalSamples = config.density === 'manual'
        ? 0 // Cost calculated later by pins dropped 
        : config.density === 0.2 // (1 per 0.2ha = 5 per ha)
            ? Math.ceil(fieldAreaHa * 5)
            : Math.ceil(fieldAreaHa / (config.density as number));

    useEffect(() => {
        let perSampleCost = 0;

        // Base Type
        const type = TEST_TYPES.find(t => t.id === config.type);
        if (type) perSampleCost += type.price;

        // Depth
        if (config.depth === 'deep') perSampleCost += 10;

        // Manual mode cost is base until pins are actualy dropped 
        if (config.density === 'manual') {
            setTotalCost(perSampleCost); // Show price per pin
        } else {
            setTotalCost(totalSamples * perSampleCost);
        }
    }, [config, totalSamples]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                            <FlaskConical className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Configure Soil Testing</h2>
                            <p className="text-sm text-muted-foreground">For {fieldName} ({fieldAreaHa} ha) • {config.density === 'manual' ? 'Manual Pin Placement' : `${totalSamples} Samples Required`}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">

                    {/* Sampling Density */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pr-2">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Sampling Density</h3>
                            {onManualPlacementStart && (
                                <button
                                    onClick={() => setConfig({ ...config, density: 'manual' })}
                                    className={cn(
                                        "text-xs px-3 py-1.5 rounded-full font-medium transition-colors border",
                                        config.density === 'manual'
                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                                    )}
                                >
                                    <MapPin className="w-3 h-3 inline-block mr-1.5" />
                                    Manual Pins
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => setConfig({ ...config, density: 5 })}
                                className={cn(
                                    "p-2 rounded-xl border transition-all text-sm font-semibold flex flex-col items-center justify-center gap-1",
                                    config.density === 5 ? "bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_10px_rgba(245,158,11,0.1)]" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                <span className="text-xl">1</span>
                                <span className="text-[10px] font-normal text-slate-400 text-center leading-tight">per 5ha</span>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, density: 2 })}
                                className={cn(
                                    "p-2 rounded-xl border transition-all text-sm font-semibold flex flex-col items-center justify-center gap-1",
                                    config.density === 2 ? "bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_10px_rgba(245,158,11,0.1)]" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                <span className={cn("text-xl", config.density === 2 ? "text-amber-400" : "")}>1</span>
                                <span className="text-[10px] font-normal text-slate-400 text-center leading-tight">per 2ha</span>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, density: 1 })}
                                className={cn(
                                    "p-2 rounded-xl border transition-all text-sm font-semibold flex flex-col items-center justify-center gap-1",
                                    config.density === 1 ? "bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_10px_rgba(245,158,11,0.1)]" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                <span className="text-xl">1</span>
                                <span className="text-[10px] font-normal text-slate-400 text-center leading-tight">per 1ha</span>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, density: 0.2 })}
                                className={cn(
                                    "p-2 rounded-xl border transition-all text-sm font-semibold flex flex-col items-center justify-center gap-1 relative overflow-hidden",
                                    config.density === 0.2 ? "bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_10px_rgba(245,158,11,0.1)]" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                {config.density === 0.2 && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />}
                                <span className="text-xl z-10">5</span>
                                <span className="text-[10px] font-normal text-slate-400 text-center leading-tight z-10">per 1ha<br />(Max)</span>
                            </button>
                        </div>
                    </div>

                    {/* Test Type */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Analysis Type</h3>
                        <div className="flex flex-col gap-3">
                            {TEST_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = config.type === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setConfig({ ...config, type: type.id as any })}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-xl border text-left transition-all w-full",
                                            isSelected
                                                ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                                : "bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg mt-0.5 shrink-0", isSelected ? "bg-amber-500 text-white" : "bg-slate-700 text-slate-400")}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-white flex items-center justify-between">
                                                {type.name}
                                                <span className={cn("text-sm font-mono", isSelected ? "text-amber-400" : "text-slate-400")}>${type.price}/sample</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 leading-snug pr-4">{type.desc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sampling Depth */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Sampling Depth</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfig({ ...config, depth: 'standard' })}
                                className={cn(
                                    "flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all text-sm font-semibold",
                                    config.depth === 'standard' ? "bg-white/10 border-white/30 text-white" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                <Layers className={cn("w-5 h-5", config.depth === 'standard' ? "text-white" : "text-slate-500")} />
                                <div>Standard (0-15cm)
                                    <span className="block text-xs font-normal text-slate-400 mt-0.5 text-center">Included</span></div>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, depth: 'deep' })}
                                className={cn(
                                    "flex-1 p-3 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all text-sm font-semibold",
                                    config.depth === 'deep' ? "bg-white/10 border-white/30 text-white" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                <Layers className={cn("w-5 h-5", config.depth === 'deep' ? "text-amber-400" : "text-slate-500")} />
                                <div>Deep Profile (0-60cm)
                                    <span className="block text-xs font-normal text-amber-400 mt-0.5 text-center">+$10/sample</span></div>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer / Checkout */}
                <div className="p-5 border-t border-white/10 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Estimated Cost</div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold font-mono text-green-400">
                                ${totalCost.toLocaleString()}
                                {config.density === 'manual' && <span className="text-sm font-sans text-green-500/70 ml-1">/ pin</span>}
                            </div>
                            {config.density !== 'manual' && (
                                <div className="text-xs text-slate-500">
                                    ({totalSamples} samples)
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 font-medium text-white rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>

                        {config.density === 'manual' ? (
                            <button onClick={() => onManualPlacementStart?.(config)} className="px-4 py-2 font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Place Pins on Map
                            </button>
                        ) : (
                            <button onClick={() => onConfirm(config, totalCost)} className="px-4 py-2 font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-lg shadow-amber-500/20">
                                Dispatch Lab Team
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
