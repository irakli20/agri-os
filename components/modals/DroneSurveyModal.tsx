import React, { useState, useEffect } from 'react';
import { X, Plane, Cpu, Map as MapIcon, Aperture, Leaf, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroneSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (config: DroneConfig, cost: number) => void;
    fieldName: string;
    fieldAreaHa: number;
}

export interface DroneConfig {
    type: 'rgb' | 'multispectral' | 'thermal' | 'lidar';
    resolution: 'standard' | 'high';
    addons: {
        elevation: boolean;
        weedPressure: boolean;
    };
}

const SURVEY_TYPES = [
    { id: 'rgb', name: 'RGB Visual', price: 10, icon: Aperture, desc: 'Basic visual mapping and scouting.' },
    { id: 'multispectral', name: 'Multispectral (NDVI)', price: 20, icon: Leaf, desc: 'Assess crop health, vigor, and stress.' },
    { id: 'thermal', name: 'Thermal Imaging', price: 30, icon: Cpu, desc: 'Identify irrigation issues and heat stress.' },
    { id: 'lidar', name: 'LiDAR Scan', price: 80, icon: Crosshair, desc: 'High-precision 3D topographic modeling.' },
] as const;

export function DroneSurveyModal({ isOpen, onClose, onConfirm, fieldName, fieldAreaHa }: DroneSurveyModalProps) {
    const [config, setConfig] = useState<DroneConfig>({
        type: 'multispectral',
        resolution: 'standard',
        addons: { elevation: false, weedPressure: false }
    });
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        let perHaCost = 0;

        // Base Type
        const type = SURVEY_TYPES.find(t => t.id === config.type);
        if (type) perHaCost += type.price;

        // Resolution
        if (config.resolution === 'high') perHaCost += 15;

        // Add-ons
        if (config.addons.elevation) perHaCost += 10;
        if (config.addons.weedPressure) perHaCost += 15;

        setTotalCost(perHaCost * fieldAreaHa);
    }, [config, fieldAreaHa]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                            <Plane className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Configure Drone Survey</h2>
                            <p className="text-sm text-muted-foreground">For {fieldName} ({fieldAreaHa} ha)</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">

                    {/* Survey Type */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Base Sensor Technology</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SURVEY_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = config.type === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setConfig({ ...config, type: type.id as any })}
                                        className={cn(
                                            "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                                            isSelected
                                                ? "bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                                : "bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg mt-0.5", isSelected ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-400")}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white flex items-center justify-between">
                                                {type.name}
                                                <span className={cn("text-xs font-mono", isSelected ? "text-blue-400" : "text-slate-400")}>${type.price}/ha</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 leading-snug">{type.desc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resolution */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Flight Resolution</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfig({ ...config, resolution: 'standard' })}
                                className={cn(
                                    "flex-1 p-3 rounded-xl border transition-all text-sm font-semibold",
                                    config.resolution === 'standard' ? "bg-white/10 border-white/30 text-white" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                Standard (5cm/px)
                                <span className="block text-xs font-normal text-slate-400 mt-0.5">Included</span>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, resolution: 'high' })}
                                className={cn(
                                    "flex-1 p-3 rounded-xl border transition-all text-sm font-semibold",
                                    config.resolution === 'high' ? "bg-white/10 border-white/30 text-white" : "bg-slate-800/50 border-white/5 text-muted-foreground hover:bg-slate-800"
                                )}
                            >
                                High-Res (1cm/px)
                                <span className="block text-xs font-normal text-amber-400 mt-0.5">+$15/ha</span>
                            </button>
                        </div>
                    </div>

                    {/* Analysis Add-ons */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">AI Analysis Add-ons</h3>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-800/30 hover:bg-slate-800/60 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        checked={config.addons.elevation}
                                        onChange={(e) => setConfig({ ...config, addons: { ...config.addons, elevation: e.target.checked } })}
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-white">3D Elevation Map</div>
                                        <div className="text-xs text-muted-foreground">Digital Surface Model (DSM) generation</div>
                                    </div>
                                </div>
                                <div className="text-sm font-mono text-amber-400">+$10/ha</div>
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-800/30 hover:bg-slate-800/60 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        checked={config.addons.weedPressure}
                                        onChange={(e) => setConfig({ ...config, addons: { ...config.addons, weedPressure: e.target.checked } })}
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-white">AI Weed Detection</div>
                                        <div className="text-xs text-muted-foreground">Machine learning weed pressure mapping</div>
                                    </div>
                                </div>
                                <div className="text-sm font-mono text-amber-400">+$15/ha</div>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Footer / Checkout */}
                <div className="p-5 border-t border-white/10 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Estimated Cost</div>
                        <div className="text-2xl font-bold font-mono text-green-400">
                            ${totalCost.toLocaleString()}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">Cancel</button>
                        <button onClick={() => onConfirm(config, totalCost)} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20">
                            Deploy Drone
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
