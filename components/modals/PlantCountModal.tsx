'use client';

import { useState } from 'react';
import {
    X,
    Calculator,
    Sprout,
    HelpCircle,
    RotateCcw,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantCountModalProps {
    isOpen: boolean;
    onClose: () => void;
    fieldId?: string;
}

export function PlantCountModal({ isOpen, onClose, fieldId }: PlantCountModalProps) {
    const [rowSpacing, setRowSpacing] = useState(30); // inches
    const [rowLength, setRowLength] = useState(17.42); // feet (1/1000th acre for 30" rows)
    const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0]);
    const [activeSample, setActiveSample] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);

    // Calculate 1/1000th acre row length based on spacing
    const calculateRowLength = (spacing: number) => {
        // 43560 sq ft per acre / 1000 = 43.56 sq ft per sample
        // 43.56 / (spacing in feet) = length in feet
        return 43.56 / (spacing / 12);
    };

    const handleSpacingChange = (spacing: number) => {
        setRowSpacing(spacing);
        setRowLength(parseFloat(calculateRowLength(spacing).toFixed(2)));
    };

    const updateCount = (index: number, value: number) => {
        const newCounts = [...counts];
        newCounts[index] = value;
        setCounts(newCounts);
    };

    const averageCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    const population = Math.round(averageCount * 1000);

    const handleSubmit = () => {
        // In a real app, save this data
        setIsSuccess(true);
        setTimeout(() => {
            onClose();
            setIsSuccess(false);
            setCounts([0, 0, 0, 0, 0]);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Stand Count Calculator</h2>
                            <p className="text-sm text-muted-foreground">
                                Estimate plant population per acre
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-in zoom-in">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Analysis Saved!</h3>
                        <p className="text-muted-foreground">Population estimate recorded for this field.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Configuration */}
                        <div className="glass-panel p-4 rounded-xl bg-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold">Configuration</h3>
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-black/90 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Standard 1/1000th acre method. Measure the specified row length and count all plants within that distance.
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Row Spacing (inches)</label>
                                    <select
                                        value={rowSpacing}
                                        onChange={(e) => handleSpacingChange(Number(e.target.value))}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={15}>15 inches</option>
                                        <option value={20}>20 inches</option>
                                        <option value={22}>22 inches</option>
                                        <option value={30}>30 inches</option>
                                        <option value={36}>36 inches</option>
                                        <option value={38}>38 inches</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Measure Distance</label>
                                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-muted-foreground font-mono">
                                        {rowLength} feet
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Samples */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Sample Counts</h3>
                                <button
                                    onClick={() => setCounts([0, 0, 0, 0, 0])}
                                    className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {counts.map((count, i) => (
                                    <div key={i} className="space-y-2">
                                        <label className="block text-xs text-center text-muted-foreground">Sample {i + 1}</label>
                                        <input
                                            type="number"
                                            value={count || ''}
                                            onChange={(e) => updateCount(i, Number(e.target.value))}
                                            onFocus={() => setActiveSample(i)}
                                            className={cn(
                                                "w-full px-2 py-3 bg-white/5 border rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                                                activeSample === i ? "border-primary bg-primary/5" : "border-white/10"
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="glass-panel p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-white/10 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Estimated Population</div>
                            <div className="text-4xl font-bold text-white mb-2">
                                {population.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">plants/acre</span>
                            </div>
                            <div className="flex items-center justify-center gap-6 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Average Count:</span>
                                    <span className="ml-2 font-medium">{averageCount.toFixed(1)}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Target:</span>
                                    <span className="ml-2 font-medium text-green-400">32,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={population === 0}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
