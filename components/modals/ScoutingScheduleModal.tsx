'use client';

import { useState } from 'react';
import {
    X,
    Calendar,
    MapPin,
    User,
    Flag,
    Route,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoutingStorage, type ScoutingTemplate } from '@/lib/scouting-data';

interface ScoutingScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    fieldId?: string;
    fieldName?: string;
    onSchedule?: () => void;
}

const SCOUTS = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams'
];

const PRIORITIES = [
    { id: 'low', label: 'Low', color: 'bg-gray-500/20 text-gray-400' },
    { id: 'medium', label: 'Medium', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-400' },
    { id: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-400' }
];

const ROUTE_PATTERNS = [
    { id: 'zigzag', label: 'Zig-Zag', description: 'Standard coverage' },
    { id: 'diamond', label: 'Diamond', description: 'Center focused' },
    { id: 'perimeter', label: 'Perimeter', description: 'Edge inspection' },
    { id: 'grid', label: 'Grid', description: 'Detailed sampling' }
];

export function ScoutingScheduleModal({
    isOpen,
    onClose,
    fieldId,
    fieldName,
    onSchedule
}: ScoutingScheduleModalProps) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [scout, setScout] = useState('');
    const [priority, setPriority] = useState('medium');
    const [templateId, setTemplateId] = useState('general-scout');
    const [routePattern, setRoutePattern] = useState('zigzag');
    const [notes, setNotes] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const templates = ScoutingStorage.getTemplates();

    const handleSubmit = () => {
        if (!fieldId || !fieldName) return;

        ScoutingStorage.addMission({
            fieldId,
            fieldName,
            scoutName: scout,
            date,
            priority: priority as any,
            templateId,
            routePattern: routePattern as any,
            notes
        });

        setIsSuccess(true);
        setTimeout(() => {
            onSchedule?.();
            onClose();
            setIsSuccess(false);
            // Reset form
            setScout('');
            setNotes('');
        }, 1500);
    };

    if (!isOpen) return null;

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
                            <h2 className="text-xl font-bold">Schedule Scouting Mission</h2>
                            <p className="text-sm text-muted-foreground">
                                Plan field inspection for {fieldName || 'Field'}
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

                {isSuccess ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Mission Scheduled!</h3>
                        <p className="text-muted-foreground">Scout has been notified.</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Date & Scout */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Assign Scout
                                    </label>
                                    <select
                                        value={scout}
                                        onChange={(e) => setScout(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Scout</option>
                                        {SCOUTS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority & Template */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Flag className="w-4 h-4 text-muted-foreground" />
                                        Priority
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PRIORITIES.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setPriority(p.id)}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                                                    priority === p.id
                                                        ? `${p.color} border-current`
                                                        : "bg-white/5 border-transparent hover:bg-white/10 text-muted-foreground"
                                                )}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Inspection Template</label>
                                    <select
                                        value={templateId}
                                        onChange={(e) => setTemplateId(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {templates.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Route Pattern */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Route className="w-4 h-4 text-muted-foreground" />
                                Scouting Route Pattern
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {ROUTE_PATTERNS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setRoutePattern(p.id)}
                                        className={cn(
                                            "p-3 rounded-xl border text-left transition-all",
                                            routePattern === p.id
                                                ? "bg-primary/10 border-primary"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "font-medium mb-1",
                                            routePattern === p.id ? "text-primary" : "text-foreground"
                                        )}>
                                            {p.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{p.description}</div>
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
                                placeholder="Specific instructions for the scout..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!scout || !date}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Schedule Mission
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
