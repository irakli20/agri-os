'use client';

import { useState, useMemo } from 'react';
import {
    X,
    Calendar,
    Clock,
    Tractor,
    Package,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Sprout,
    Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateHourlyForecast, getSprayWindows } from '@/lib/weather-data';
// Local type – the pest-disease-data arrays are typed as any[]
type TreatmentRecommendation = Record<string, any>;
import { TreatmentStorage } from '@/lib/treatment-data';

interface TreatmentSchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    recommendation?: TreatmentRecommendation;
    onSubmit?: (schedule: any) => void;
    fieldId?: string;
}

const EQUIPMENT_OPTIONS = [
    'Sprayer #1 (500 gal)',
    'Sprayer #2 (300 gal)',
    'Drone Fleet (4 units)',
    'ATV Sprayer',
    'Backpack Sprayer'
];

export function TreatmentSchedulerModal({
    isOpen,
    onClose,
    recommendation,
    onSubmit,
    fieldId
}: TreatmentSchedulerModalProps) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedWindow, setSelectedWindow] = useState<string>('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [acreage, setAcreage] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const hourlyForecast = useMemo(() => generateHourlyForecast(), []);
    const sprayWindows = useMemo(() => getSprayWindows(hourlyForecast), [hourlyForecast]);

    if (!isOpen) return null;

    const selectedProductData = recommendation?.products[selectedProduct];
    const totalCost = selectedProductData && acreage
        ? selectedProductData.cost * parseFloat(acreage)
        : 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (recommendation && selectedProductData && fieldId) {
            TreatmentStorage.addTreatment({
                fieldId: fieldId,
                problemId: recommendation.problemId,
                problemType: recommendation.problemType,
                recommendationId: recommendation.id,
                treatmentName: `${recommendation.method} Treatment`,
                productName: selectedProductData.name,
                rate: selectedProductData.rate,
                date: selectedDate,
                time: selectedWindow.split(' - ')[0], // Approximate start time
                status: 'scheduled',
                notes: notes,
                cost: totalCost,
                assignedTo: 'Farm Manager' // Default assignment
            });
        }

        onSubmit?.({
            recommendationId: recommendation?.id,
            date: selectedDate,
            window: selectedWindow,
            equipment: selectedEquipment,
            product: selectedProductData,
            acreage: parseFloat(acreage),
            totalCost,
            notes,
            scheduledAt: new Date().toISOString()
        });

        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Treatment Scheduled!' : 'Schedule Treatment'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Application has been added to calendar' : 'Plan application during optimal spray windows'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Treatment Scheduled Successfully!</h3>
                            <p className="text-muted-foreground mb-6">
                                Application scheduled for <span className="text-foreground font-medium">{selectedDate}</span> during {selectedWindow}
                            </p>

                            <div className="glass-panel rounded-xl p-4 mb-6 text-left">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Product</div>
                                        <div className="font-medium">{selectedProductData?.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Equipment</div>
                                        <div className="font-medium">{selectedEquipment}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Area</div>
                                        <div className="font-medium">{acreage} acres</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Total Cost</div>
                                        <div className="font-medium text-green-400">${totalCost.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Treatment Info */}
                            {recommendation && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <Sprout className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-medium text-blue-400 mb-1 capitalize">
                                                {recommendation.method} Treatment for {recommendation.problemType}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Urgency: <span className={cn(
                                                    "font-medium capitalize",
                                                    recommendation.urgency === 'critical' ? 'text-red-400' :
                                                        recommendation.urgency === 'high' ? 'text-orange-400' :
                                                            'text-yellow-400'
                                                )}>{recommendation.urgency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Spray Windows */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Select Spray Window</label>
                                {sprayWindows.length > 0 && sprayWindows[0].windows.length > 0 ? (
                                    <div className="space-y-2">
                                        {sprayWindows[0].windows.map((window, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedWindow(`${window.start} - ${window.end}`)}
                                                className={cn(
                                                    "glass-panel rounded-xl p-4 cursor-pointer transition-all",
                                                    selectedWindow === `${window.start} - ${window.end}`
                                                        ? "border-2 border-primary bg-primary/5"
                                                        : "border border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-5 h-5 text-blue-400" />
                                                        <div>
                                                            <div className="font-medium">{window.start} - {window.end}</div>
                                                            <div className="text-sm text-muted-foreground">{window.reason}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-medium",
                                                            window.score >= 90 ? "bg-green-500/20 text-green-400" :
                                                                window.score >= 70 ? "bg-blue-500/20 text-blue-400" :
                                                                    "bg-yellow-500/20 text-yellow-400"
                                                        )}>
                                                            {window.score}% Quality
                                                        </div>
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                            selectedWindow === `${window.start} - ${window.end}`
                                                                ? "bg-primary border-primary"
                                                                : "border-white/30"
                                                        )}>
                                                            {selectedWindow === `${window.start} - ${window.end}` && (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass-panel rounded-xl p-6 text-center">
                                        <Wind className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-sm text-muted-foreground">No ideal spray windows in next 24 hours</p>
                                        <p className="text-xs text-muted-foreground mt-1">Check back later or proceed with caution</p>
                                    </div>
                                )}
                            </div>

                            {/* Product Selection */}
                            {recommendation && recommendation.products.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium mb-3">Select Product</label>
                                    <div className="space-y-2">
                                        {recommendation.products.map((product: Record<string, any>, i: number) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedProduct(i)}
                                                className={cn(
                                                    "glass-panel rounded-xl p-4 cursor-pointer transition-all",
                                                    selectedProduct === i
                                                        ? "border-2 border-primary bg-primary/5"
                                                        : "border border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-muted-foreground">{product.activeIngredient} • {product.rate}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">${product.cost}/acre</div>
                                                        <div className="text-xs text-green-400">{product.efficacy}% efficacy</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Equipment & Area */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Equipment</label>
                                    <select
                                        value={selectedEquipment}
                                        onChange={(e) => setSelectedEquipment(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Equipment</option>
                                        {EQUIPMENT_OPTIONS.map(eq => (
                                            <option key={eq} value={eq}>{eq}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Acreage</label>
                                    <input
                                        type="number"
                                        value={acreage}
                                        onChange={(e) => setAcreage(e.target.value)}
                                        placeholder="0.0"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Cost Summary */}
                            {totalCost > 0 && (
                                <div className="glass-panel rounded-xl p-4 bg-green-500/10 border border-green-500/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-400" />
                                            <span className="font-medium">Estimated Cost</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-400">${totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">
                                        {acreage} acres × ${selectedProductData?.cost}/acre
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Additional instructions, precautions, or observations..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedWindow || !selectedEquipment || !acreage || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Scheduling...' : 'Schedule Treatment'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
