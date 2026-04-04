'use client';

import { useState } from 'react';
import {
    X,
    Wrench,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    Truck,
    FileText,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Equipment {
    id: string;
    name: string;
    type: string;
    lastMaintenance?: string;
    nextMaintenance?: string;
    hoursUsed: number;
    status: 'available' | 'in-use' | 'maintenance' | 'retired';
}

interface MaintenanceModalProps {
    equipment: Equipment;
    isOpen: boolean;
    onClose: () => void;
    onSchedule?: (data: MaintenanceSchedule) => void;
}

export interface MaintenanceSchedule {
    equipmentId: string;
    type: 'preventive' | 'repair' | 'inspection';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledDate: string;
    estimatedDuration: string;
    provider: 'internal' | 'external';
    notes: string;
    parts: string[];
    estimatedCost: number;
}

const MAINTENANCE_TYPES = [
    { id: 'preventive', label: 'Preventive Maintenance', icon: Wrench, description: 'Scheduled routine maintenance' },
    { id: 'repair', label: 'Repair', icon: AlertTriangle, description: 'Fix a specific issue' },
    { id: 'inspection', label: 'Inspection', icon: FileText, description: 'Safety or compliance check' },
];

const PRIORITY_OPTIONS = [
    { id: 'low', label: 'Low', color: 'bg-gray-500/20 text-gray-400' },
    { id: 'medium', label: 'Medium', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'high', label: 'High', color: 'bg-yellow-500/20 text-yellow-400' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-500/20 text-red-400' },
];

const COMMON_PARTS = [
    'Oil Filter', 'Air Filter', 'Hydraulic Fluid', 'Belts', 'Bearings',
    'Spark Plugs', 'Battery', 'Tires', 'Blades', 'Fuel Filter'
];

export function MaintenanceModal({ equipment, isOpen, onClose, onSchedule }: MaintenanceModalProps) {
    const [step, setStep] = useState(1);
    const [maintenanceType, setMaintenanceType] = useState<'preventive' | 'repair' | 'inspection'>('preventive');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [scheduledDate, setScheduledDate] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('2 hours');
    const [provider, setProvider] = useState<'internal' | 'external'>('internal');
    const [notes, setNotes] = useState('');
    const [selectedParts, setSelectedParts] = useState<string[]>([]);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const togglePart = (part: string) => {
        setSelectedParts(prev =>
            prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const schedule: MaintenanceSchedule = {
            equipmentId: equipment.id,
            type: maintenanceType,
            priority,
            scheduledDate,
            estimatedDuration,
            provider,
            notes,
            parts: selectedParts,
            estimatedCost,
        };

        onSchedule?.(schedule);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="modal-icon-chip bg-yellow-500/20">
                            <Wrench className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Maintenance Scheduled!' : 'Schedule Maintenance'}
                            </h2>
                            <p className="text-sm text-muted-foreground">{equipment.name}</p>
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
                            {['Type', 'Details', 'Confirm'].map((label, i) => (
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
                <div className="modal-content">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Maintenance Scheduled</h3>
                            <p className="text-muted-foreground mb-4">
                                {maintenanceType.charAt(0).toUpperCase() + maintenanceType.slice(1)} maintenance for {equipment.name} has been scheduled for {scheduledDate}.
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 text-left mb-6 max-w-sm mx-auto">
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reference</span>
                                        <span className="font-mono">MNT-{Date.now().toString(36).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date</span>
                                        <span>{scheduledDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Est. Cost</span>
                                        <span className="text-green-400">${estimatedCost}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="btn-modal-primary"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Maintenance Type */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground mb-4">
                                        Select the type of maintenance needed
                                    </div>
                                    <div className="grid gap-3">
                                        {MAINTENANCE_TYPES.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setMaintenanceType(type.id as any)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                                        maintenanceType === type.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center",
                                                        maintenanceType === type.id ? "bg-primary/20" : "bg-white/10"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-6 h-6",
                                                            maintenanceType === type.id ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-sm text-muted-foreground">{type.description}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Priority Selection */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium mb-3">Priority</label>
                                        <div className="flex gap-2">
                                            {PRIORITY_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setPriority(opt.id as any)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                                        priority === opt.id
                                                            ? opt.color + " ring-2 ring-offset-2 ring-offset-background"
                                                            : "bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Schedule Details */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Scheduled Date
                                            </label>
                                            <input
                                                type="date"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <Clock className="w-4 h-4 inline mr-2" />
                                                Est. Duration
                                            </label>
                                            <select
                                                value={estimatedDuration}
                                                onChange={(e) => setEstimatedDuration(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="1 hour">1 hour</option>
                                                <option value="2 hours">2 hours</option>
                                                <option value="4 hours">4 hours</option>
                                                <option value="1 day">1 day</option>
                                                <option value="2+ days">2+ days</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Provider Selection */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Service Provider</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setProvider('internal')}
                                                className={cn(
                                                    "p-4 rounded-xl border text-left transition-all",
                                                    provider === 'internal'
                                                        ? "border-primary bg-primary/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <Wrench className="w-5 h-5 mb-2" />
                                                <div className="font-medium">Internal Team</div>
                                                <div className="text-xs text-muted-foreground">On-site maintenance staff</div>
                                            </button>
                                            <button
                                                onClick={() => setProvider('external')}
                                                className={cn(
                                                    "p-4 rounded-xl border text-left transition-all",
                                                    provider === 'external'
                                                        ? "border-primary bg-primary/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <Truck className="w-5 h-5 mb-2" />
                                                <div className="font-medium">External Vendor</div>
                                                <div className="text-xs text-muted-foreground">Book from marketplace</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Parts Selection */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Required Parts (Optional)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {COMMON_PARTS.map((part) => (
                                                <button
                                                    key={part}
                                                    onClick={() => togglePart(part)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-sm transition-all",
                                                        selectedParts.includes(part)
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    {part}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            placeholder="Describe the issue or maintenance requirements..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Confirmation */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <h3 className="font-semibold">Maintenance Summary</h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Equipment</span>
                                                <div className="font-medium">{equipment.name}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Type</span>
                                                <div className="font-medium capitalize">{maintenanceType}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Date</span>
                                                <div className="font-medium">{scheduledDate}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Duration</span>
                                                <div className="font-medium">{estimatedDuration}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Provider</span>
                                                <div className="font-medium capitalize">{provider}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Priority</span>
                                                <div className={cn("font-medium capitalize", PRIORITY_OPTIONS.find(p => p.id === priority)?.color.split(' ')[1])}>
                                                    {priority}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedParts.length > 0 && (
                                            <div>
                                                <span className="text-sm text-muted-foreground">Parts</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedParts.map(part => (
                                                        <span key={part} className="text-xs px-2 py-1 bg-white/10 rounded">
                                                            {part}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cost Estimate */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            Estimated Cost
                                        </label>
                                        <input
                                            type="number"
                                            value={estimatedCost}
                                            onChange={(e) => setEstimatedCost(Number(e.target.value))}
                                            placeholder="Enter estimated cost"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <div className="font-medium text-yellow-400 mb-1">Note</div>
                                            <p className="text-muted-foreground">
                                                The equipment will be marked as unavailable during the maintenance period.
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
                    <div className="modal-footer !justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="btn-modal-secondary"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={(step === 2 && !scheduledDate) || isSubmitting}
                            className={cn(
                                "btn-modal-primary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "min-w-[190px]"
                            )}
                        >
                            {isSubmitting ? 'Scheduling...' : step === 3 ? 'Schedule Maintenance' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
