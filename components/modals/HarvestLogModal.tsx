'use client';

import { useState } from 'react';
import {
    X,
    Sprout,
    Scale,
    Calendar,
    Star,
    FileText,
    CheckCircle,
    Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HarvestLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (harvest: any) => void;
    initialCrop?: string;
    fieldName?: string;
}

const GRADES = ['Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Processing)', 'Feed Grade'];
const UNITS = ['Bushels', 'Tons', 'Lbs', 'Kg', 'Bales'];

export function HarvestLogModal({ isOpen, onClose, onSubmit, initialCrop = '', fieldName = 'Unknown Field' }: HarvestLogModalProps) {
    const [crop, setCrop] = useState(initialCrop);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Bushels');
    const [grade, setGrade] = useState('Grade A (Premium)');
    const [moisture, setMoisture] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const harvestData = {
            crop,
            date,
            quantity: parseFloat(quantity),
            unit,
            grade,
            moisture: parseFloat(moisture),
            notes,
            field: fieldName
        };

        onSubmit?.(harvestData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="modal-icon-chip bg-orange-500/20">
                            <Sprout className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Harvest Recorded' : 'Log Harvest'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Yield data saved successfully' : `Record yield for ${fieldName}`}
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
                <div className="modal-content">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Harvest Logged!</h3>
                            <p className="text-muted-foreground mb-6">
                                <span className="text-foreground font-medium">{quantity} {unit}</span> of {crop} recorded.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setQuantity('');
                                        setMoisture('');
                                        setNotes('');
                                        setIsSuccess(false);
                                    }}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Log Another Load
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
                        <div className="space-y-4">
                            {/* Crop & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Crop</label>
                                    <input
                                        type="text"
                                        value={crop}
                                        onChange={(e) => setCrop(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Harvest Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Quantity & Unit */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Unit</label>
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {UNITS.map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Quality & Moisture */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Quality Grade</label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {GRADES.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Moisture %</label>
                                    <input
                                        type="number"
                                        value={moisture}
                                        onChange={(e) => setMoisture(e.target.value)}
                                        placeholder="14.5"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Storage location, weather conditions, etc."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="modal-footer justify-between">
                        <button
                            onClick={onClose}
                            className="btn-modal-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!quantity || !crop || isSubmitting}
                            className={cn("btn-modal-primary")}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Harvest Log'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
