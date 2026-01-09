'use client';

import { useState } from 'react';
import {
    X,
    MapPin,
    Sprout,
    Ruler,
    Calendar,
    CheckCircle,
    Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (field: any) => void;
}

const CROPS = ['Corn', 'Soybeans', 'Wheat', 'Cotton', 'Rice', 'Sunflowers', 'Potatoes', 'Grapes (Vineyard)'];

export function AddFieldModal({ isOpen, onClose, onSubmit }: AddFieldModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        acres: '',
        plantingDate: '',
        soilType: '',
        irrigationType: ''
    });
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSubmit?.(formData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Field Added!' : 'Add New Field'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Field registered successfully' : 'Define boundaries and crop details'}
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

                {/* Progress Steps */}
                {!isSuccess && (
                    <div className="px-6 pt-4">
                        <div className="flex items-center justify-between">
                            {['Boundaries', 'Crop Details', 'Review'].map((label, i) => (
                                <div key={label} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                        step > i + 1 ? "bg-green-500 text-white" :
                                            step === i + 1 ? "bg-primary text-primary-foreground" :
                                                "bg-white/10 text-muted-foreground"
                                    )}>
                                        {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "ml-2 text-sm hidden sm:block",
                                        step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"
                                    )}>
                                        {label}
                                    </span>
                                    {i < 2 && (
                                        <div className={cn(
                                            "w-16 h-0.5 mx-3",
                                            step > i + 1 ? "bg-green-500" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Field Registered</h3>
                            <p className="text-muted-foreground mb-6">
                                <span className="text-foreground font-medium">{formData.name}</span> ({formData.acres} acres) has been added to your farm.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setFormData({
                                            name: '', crop: '', acres: '', plantingDate: '', soilType: '', irrigationType: ''
                                        });
                                        setIsSuccess(false);
                                    }}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Boundaries */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Field Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="e.g., North 40"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden h-64 relative group cursor-crosshair">
                                        {/* Mock Map Interface */}
                                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/-95.7129,37.0902,3,0/800x600?access_token=pk.mock')] bg-cover bg-center opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {isDrawing ? (
                                                <div className="text-center animate-pulse">
                                                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                                                    <span className="text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                                        Click points to define boundary
                                                    </span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsDrawing(true)}
                                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/20 transition-all flex items-center gap-2"
                                                >
                                                    <Map className="w-4 h-4" />
                                                    Draw Boundary
                                                </button>
                                            )}
                                        </div>
                                        {/* Mock drawn polygon */}
                                        {isDrawing && (
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <path
                                                    d="M 150 100 L 450 120 L 420 300 L 180 280 Z"
                                                    fill="rgba(34, 197, 94, 0.2)"
                                                    stroke="#22c55e"
                                                    strokeWidth="2"
                                                    className="animate-in fade-in duration-500"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/5 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Ruler className="w-4 h-4" />
                                            <span>Calculated Area:</span>
                                        </div>
                                        <div className="font-mono font-bold text-foreground">
                                            {isDrawing ? '42.5' : '0.0'} acres
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Crop Details */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Current Crop</label>
                                            <select
                                                value={formData.crop}
                                                onChange={(e) => updateField('crop', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select Crop</option>
                                                {CROPS.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Acres (Manual)</label>
                                            <input
                                                type="number"
                                                value={formData.acres}
                                                onChange={(e) => updateField('acres', e.target.value)}
                                                placeholder="42.5"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Planting Date</label>
                                        <input
                                            type="date"
                                            value={formData.plantingDate}
                                            onChange={(e) => updateField('plantingDate', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Soil Type</label>
                                            <select
                                                value={formData.soilType}
                                                onChange={(e) => updateField('soilType', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="loam">Loam</option>
                                                <option value="sandy">Sandy</option>
                                                <option value="clay">Clay</option>
                                                <option value="silt">Silt</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Irrigation</label>
                                            <select
                                                value={formData.irrigationType}
                                                onChange={(e) => updateField('irrigationType', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select System</option>
                                                <option value="pivot">Center Pivot</option>
                                                <option value="drip">Drip</option>
                                                <option value="flood">Flood</option>
                                                <option value="none">Rainfed (None)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                        <h3 className="font-semibold border-b border-white/10 pb-2">Field Summary</h3>
                                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                                            <div className="text-muted-foreground">Name</div>
                                            <div className="font-medium">{formData.name}</div>

                                            <div className="text-muted-foreground">Crop</div>
                                            <div className="font-medium flex items-center gap-2">
                                                <Sprout className="w-4 h-4 text-green-400" />
                                                {formData.crop}
                                            </div>

                                            <div className="text-muted-foreground">Area</div>
                                            <div className="font-medium">{formData.acres} acres</div>

                                            <div className="text-muted-foreground">Planted</div>
                                            <div className="font-medium">{formData.plantingDate}</div>

                                            <div className="text-muted-foreground">Soil / Irrigation</div>
                                            <div className="font-medium capitalize">{formData.soilType} / {formData.irrigationType}</div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <div className="font-medium text-blue-400 mb-1">Satellite Monitoring</div>
                                            <p className="text-muted-foreground">
                                                Once added, we'll automatically start fetching satellite imagery and NDVI data for this field every 5 days.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={
                                (step === 1 && !formData.name) ||
                                (step === 2 && (!formData.crop || !formData.acres)) ||
                                isSubmitting
                            }
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Saving...' : step === 3 ? 'Add Field' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
