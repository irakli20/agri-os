'use client';

import { useState } from 'react';
import {
    X,
    Sprout,
    Calendar,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CropRotationPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (plan: any) => void;
    fieldName?: string;
    currentCrop?: string;
}

const CROP_FAMILIES = {
    'Legumes': ['Soybeans', 'Peas', 'Beans', 'Clover', 'Alfalfa'],
    'Brassicas': ['Broccoli', 'Cabbage', 'Cauliflower', 'Kale', 'Mustard'],
    'Solanaceae': ['Tomatoes', 'Peppers', 'Eggplant', 'Potatoes'],
    'Cucurbits': ['Cucumbers', 'Squash', 'Melons', 'Pumpkins'],
    'Grains': ['Corn', 'Wheat', 'Oats', 'Barley', 'Rye'],
    'Root Vegetables': ['Carrots', 'Beets', 'Radishes', 'Turnips'],
};

const ROTATION_BENEFITS = {
    'Legumes': 'Fixes nitrogen in soil, improves soil structure',
    'Brassicas': 'Deep roots break up compacted soil',
    'Solanaceae': 'Heavy feeders, benefit from nitrogen-rich soil',
    'Cucurbits': 'Sprawling growth suppresses weeds',
    'Grains': 'Adds organic matter, prevents erosion',
    'Root Vegetables': 'Aerates soil, breaks pest cycles',
};

export function CropRotationPlannerModal({
    isOpen,
    onClose,
    onSubmit,
    fieldName = 'Field',
    currentCrop = ''
}: CropRotationPlannerModalProps) {
    const [year1Crop, setYear1Crop] = useState(currentCrop);
    const [year2Crop, setYear2Crop] = useState('');
    const [year3Crop, setYear3Crop] = useState('');
    const [year4Crop, setYear4Crop] = useState('');
    const [rotationNotes, setRotationNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const getAllCrops = () => {
        return Object.values(CROP_FAMILIES).flat();
    };

    const getCropFamily = (crop: string) => {
        for (const [family, crops] of Object.entries(CROP_FAMILIES)) {
            if (crops.includes(crop)) return family;
        }
        return 'Unknown';
    };

    const validateRotation = () => {
        const crops = [year1Crop, year2Crop, year3Crop, year4Crop].filter(Boolean);
        const families = crops.map(getCropFamily);

        // Check for consecutive same family (bad practice)
        for (let i = 0; i < families.length - 1; i++) {
            if (families[i] === families[i + 1]) {
                return {
                    valid: false,
                    message: `Avoid planting ${families[i]} crops consecutively`
                };
            }
        }

        return { valid: true, message: 'Good rotation plan!' };
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const rotationPlan = {
            fieldName,
            rotationCycle: [
                { year: 1, crop: year1Crop, family: getCropFamily(year1Crop) },
                { year: 2, crop: year2Crop, family: getCropFamily(year2Crop) },
                { year: 3, crop: year3Crop, family: getCropFamily(year3Crop) },
                { year: 4, crop: year4Crop, family: getCropFamily(year4Crop) },
            ].filter(item => item.crop),
            notes: rotationNotes,
            createdAt: new Date().toISOString()
        };

        onSubmit?.(rotationPlan);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const validation = validateRotation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Rotation Plan Created' : 'Crop Rotation Planner'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Plan saved successfully' : `Plan 4-year rotation for ${fieldName}`}
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
                            <h3 className="text-lg font-semibold mb-2">Rotation Plan Saved!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your 4-year crop rotation plan for <span className="text-foreground font-medium">{fieldName}</span> has been created.
                            </p>

                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                <Leaf className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-blue-400 mb-1">Why Rotate Crops?</div>
                                    <p className="text-muted-foreground">
                                        Crop rotation prevents soil depletion, breaks pest cycles, and improves yields. Avoid planting crops from the same family consecutively.
                                    </p>
                                </div>
                            </div>

                            {/* Rotation Years */}
                            <div className="space-y-4">
                                {[
                                    { year: 1, crop: year1Crop, setCrop: setYear1Crop, label: 'Current/Year 1' },
                                    { year: 2, crop: year2Crop, setCrop: setYear2Crop, label: 'Year 2' },
                                    { year: 3, crop: year3Crop, setCrop: setYear3Crop, label: 'Year 3' },
                                    { year: 4, crop: year4Crop, setCrop: setYear4Crop, label: 'Year 4' },
                                ].map(({ year, crop, setCrop, label }) => (
                                    <div key={year} className="glass-panel rounded-xl p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                                <span className="font-bold text-primary">{year}</span>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">{label}</label>
                                                    <select
                                                        value={crop}
                                                        onChange={(e) => setCrop(e.target.value)}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                    >
                                                        <option value="">Select Crop</option>
                                                        {Object.entries(CROP_FAMILIES).map(([family, crops]) => (
                                                            <optgroup key={family} label={family}>
                                                                {crops.map(c => (
                                                                    <option key={c} value={c}>{c}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                </div>
                                                {crop && (
                                                    <div className="text-xs bg-white/5 rounded p-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <TrendingUp className="w-3 h-3 text-green-400" />
                                                            <span className="font-medium text-green-400">
                                                                {getCropFamily(crop)} Family
                                                            </span>
                                                        </div>
                                                        <p className="text-muted-foreground">
                                                            {ROTATION_BENEFITS[getCropFamily(crop) as keyof typeof ROTATION_BENEFITS]}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Validation Message */}
                            {year1Crop && year2Crop && (
                                <div className={cn(
                                    "rounded-xl p-4 flex gap-3",
                                    validation.valid
                                        ? "bg-green-500/10 border border-green-500/20"
                                        : "bg-red-500/10 border border-red-500/20"
                                )}>
                                    {validation.valid ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    )}
                                    <div className="text-sm">
                                        <div className={cn(
                                            "font-medium mb-1",
                                            validation.valid ? "text-green-400" : "text-red-400"
                                        )}>
                                            {validation.valid ? 'Valid Rotation' : 'Rotation Issue'}
                                        </div>
                                        <p className="text-muted-foreground">{validation.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                                <textarea
                                    value={rotationNotes}
                                    onChange={(e) => setRotationNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Cover crops, soil amendments, timing considerations..."
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
                            disabled={!year1Crop || !year2Crop || !validation.valid || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Rotation Plan'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
