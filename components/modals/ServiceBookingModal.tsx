'use client';

import { useMemo, useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, CheckCircle, Star, Truck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Service } from '@/lib/service-data';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';

interface ServiceBookingModalProps {
    service: Service;
    isOpen: boolean;
    onClose: () => void;
}

export function ServiceBookingModal({ service, isOpen, onClose }: ServiceBookingModalProps) {
    const { getFieldsForMode } = useFieldStore();
    const { gameMode } = useGameStore();
    const activeFields = getFieldsForMode(gameMode ? 'strategy' : 'demo');
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [acres, setAcres] = useState(50);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalCost = service.pricing.type === 'per_acre'
        ? service.pricing.amount * acres
        : service.pricing.amount;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(4); // Success step
        setIsSubmitting(false);
    };

    const availableTimes = [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
    ];

    const bookableFields = useMemo(() => activeFields.map((field) => ({
        id: field.id,
        name: field.name,
        acres: field.acres,
    })), [activeFields]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2 className="text-xl font-bold">Book Service</h2>
                        <p className="text-sm text-muted-foreground mt-1">{service.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-6">
                        {['Details', 'Schedule', 'Confirm', 'Done'].map((label, i) => (
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
                                {i < 3 && (
                                    <div className={cn(
                                        "w-12 h-0.5 mx-3",
                                        step > i + 1 ? "bg-green-500" : "bg-white/10"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="modal-content !pt-0">
                    {/* Step 1: Service Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Provider Info */}
                            <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Truck className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{service.provider.company}</div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span>{service.provider.rating} ({service.provider.reviewCount} reviews)</span>
                                        <span>•</span>
                                        <span>{service.provider.completedJobs} jobs completed</span>
                                    </div>
                                </div>
                                {service.provider.verified && (
                                    <CheckCircle className="w-5 h-5 text-blue-400" />
                                )}
                            </div>

                            {/* Field Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Field</label>
                                {bookableFields.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-muted-foreground">
                                        No fields available in the current mode. Add or acquire a field before booking a service.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {bookableFields.map(field => (
                                            <button
                                                key={field.id}
                                                onClick={() => {
                                                    setSelectedField(field.id);
                                                    setAcres(field.acres);
                                                }}
                                                className={cn(
                                                    "p-4 rounded-xl border text-left transition-all",
                                                    selectedField === field.id
                                                        ? "border-primary bg-primary/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="font-medium">{field.name}</div>
                                                <div className="text-sm text-muted-foreground">{field.acres} acres</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Acres Override */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Area to Service (acres)</label>
                                <input
                                    type="number"
                                    value={acres}
                                    onChange={(e) => setAcres(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Cost Estimate */}
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Estimated Cost</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        ${totalCost.toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    ${service.pricing.amount}/{service.pricing.unit} × {acres} acres
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Schedule */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Time Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Preferred Time
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {availableTimes.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={cn(
                                                "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                                                selectedTime === time
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Special Instructions (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="e.g., Access through the east gate, watch for irrigation lines..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Weather Alert */}
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-yellow-400 mb-1">Weather Advisory</div>
                                    <p className="text-muted-foreground">
                                        Weather conditions look favorable for this date. Wind speeds expected under 8 mph.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                <h3 className="font-semibold">Booking Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service</span>
                                        <span className="font-medium">{service.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Provider</span>
                                        <span>{service.provider.company}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Field</span>
                                        <span>{bookableFields.find(f => f.id === selectedField)?.name || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Area</span>
                                        <span>{acres} acres</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date & Time</span>
                                        <span>{selectedDate} at {selectedTime}</span>
                                    </div>

                                    <div className="border-t border-white/10 pt-3 flex justify-between">
                                        <span className="font-medium">Total</span>
                                        <span className="text-xl font-bold text-green-400">${totalCost.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Payment Method</div>
                                        <div className="text-xs text-muted-foreground">Corporate Card ••4242</div>
                                    </div>
                                    <button className="text-xs text-primary hover:underline">Change</button>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground text-center">
                                By confirming, you agree to the service terms and cancellation policy.
                            </p>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your service has been scheduled. You&apos;ll receive a confirmation email shortly.
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 text-left mb-6">
                                <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                                <div className="font-mono text-lg font-bold">SRV-{Date.now().toString(36).toUpperCase()}</div>
                            </div>
                            <button
                                onClick={onClose}
                                className="btn-modal-primary"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step < 4 && (
                    <div className="modal-footer !justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="btn-modal-secondary"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={
                                (step === 1 && !selectedField) ||
                                (step === 2 && (!selectedDate || !selectedTime)) ||
                                isSubmitting
                            }
                            className={cn(
                                "btn-modal-primary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "min-w-[160px]"
                            )}
                        >
                            {isSubmitting ? 'Processing...' : step === 3 ? 'Confirm Booking' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
