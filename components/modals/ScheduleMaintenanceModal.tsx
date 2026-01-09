'use client';

import { useState } from 'react';
import {
    X,
    Wrench,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    User,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (maintenance: any) => void;
    equipmentName?: string;
    equipmentId?: string;
}

const MAINTENANCE_TYPES = [
    'Routine Inspection',
    'Oil Change',
    'Filter Replacement',
    'Tire Rotation',
    'Battery Check',
    'Brake Service',
    'Calibration',
    'Deep Clean',
    'Parts Replacement',
    'Other'
];

const PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Urgent'];

export function ScheduleMaintenanceModal({
    isOpen,
    onClose,
    onSubmit,
    equipmentName = 'Equipment',
    equipmentId = ''
}: ScheduleMaintenanceModalProps) {
    const [maintenanceType, setMaintenanceType] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [notes, setNotes] = useState('');
    const [partsNeeded, setPartsNeeded] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const maintenanceData = {
            equipmentId,
            equipmentName,
            type: maintenanceType,
            scheduledDate,
            priority,
            estimatedDuration: parseFloat(estimatedDuration),
            assignedTo,
            notes,
            partsNeeded,
            status: 'scheduled'
        };

        onSubmit?.(maintenanceData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setMaintenanceType('');
        setScheduledDate('');
        setPriority('Medium');
        setEstimatedDuration('');
        setAssignedTo('');
        setNotes('');
        setPartsNeeded('');
        setIsSuccess(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Maintenance Scheduled' : 'Schedule Maintenance'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Service appointment created' : `For ${equipmentName}`}
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
                            <h3 className="text-lg font-semibold mb-2">Maintenance Scheduled!</h3>
                            <p className="text-muted-foreground mb-6">
                                <span className="text-foreground font-medium">{maintenanceType}</span> scheduled for {scheduledDate}
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Schedule Another
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
                            {/* Maintenance Type & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Maintenance Type</label>
                                    <select
                                        value={maintenanceType}
                                        onChange={(e) => setMaintenanceType(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Type</option>
                                        {MAINTENANCE_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {PRIORITY_LEVELS.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Date & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                                    <input
                                        type="number"
                                        value={estimatedDuration}
                                        onChange={(e) => setEstimatedDuration(e.target.value)}
                                        placeholder="2.5"
                                        step="0.5"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Assigned To */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Assign To</label>
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select Technician</option>
                                    <option value="john">John Doe (Lead Mechanic)</option>
                                    <option value="sarah">Sarah Smith (Technician)</option>
                                    <option value="mike">Mike Johnson (Equipment Specialist)</option>
                                    <option value="external">External Service Provider</option>
                                </select>
                            </div>

                            {/* Parts Needed */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Parts Needed</label>
                                <input
                                    type="text"
                                    value={partsNeeded}
                                    onChange={(e) => setPartsNeeded(e.target.value)}
                                    placeholder="e.g., Oil filter, Air filter, Spark plugs"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Additional details, issues observed, etc."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-blue-400 mb-1">Automatic Reminders</div>
                                    <p className="text-muted-foreground">
                                        The assigned technician will receive notifications 24 hours before the scheduled maintenance.
                                    </p>
                                </div>
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
                            disabled={!maintenanceType || !scheduledDate || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
