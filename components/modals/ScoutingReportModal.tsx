'use client';

import { useState } from 'react';
import {
    X,
    Camera,
    Bug,
    Sprout,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoutingStorage, type ScoutingMission } from '@/lib/scouting-data';
import { PEST_INFESTATIONS, DISEASE_INCIDENTS } from '@/lib/pest-disease-data';

interface ScoutingReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    mission: ScoutingMission;
}

export function ScoutingReportModal({ isOpen, onClose, mission }: ScoutingReportModalProps) {
    const [step, setStep] = useState(1);
    const [cropStage, setCropStage] = useState('V3');
    const [standCount, setStandCount] = useState('');
    const [observations, setObservations] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        ScoutingStorage.updateStatus(mission.id, 'completed');
        setIsSuccess(true);
        setIsSubmitting(false);

        setTimeout(() => {
            onClose();
        }, 2000);
    };

    const handleAddObservation = (type: 'pest' | 'disease') => {
        const newObs = {
            id: Date.now(),
            type,
            targetId: '',
            severity: 'low',
            count: 0
        };
        setObservations([...observations, newObs]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Submit Scouting Report</h2>
                        <p className="text-sm text-muted-foreground">
                            {mission.fieldName} • {mission.date} • {mission.scoutName}
                        </p>
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
                        <h3 className="text-2xl font-bold mb-2">Report Submitted!</h3>
                        <p className="text-muted-foreground">Data has been synced to the farm dashboard.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-center mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                                        step === s ? "bg-primary text-primary-foreground" :
                                            step > s ? "bg-green-500 text-white" : "bg-white/10 text-muted-foreground"
                                    )}>
                                        {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={cn(
                                            "w-16 h-0.5 mx-2",
                                            step > s ? "bg-green-500" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Crop Status */}
                        {step === 1 && (
                            <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-300">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Sprout className="w-5 h-5 text-green-400" />
                                    Crop Status
                                </h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Growth Stage</label>
                                        <select
                                            value={cropStage}
                                            onChange={(e) => setCropStage(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="VE">VE (Emergence)</option>
                                            <option value="V1">V1 (First Leaf)</option>
                                            <option value="V2">V2 (Second Leaf)</option>
                                            <option value="V3">V3 (Third Leaf)</option>
                                            <option value="V6">V6 (Sixth Leaf)</option>
                                            <option value="VT">VT (Tasseling)</option>
                                            <option value="R1">R1 (Silking)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Stand Count (plants/acre)</label>
                                        <input
                                            type="number"
                                            value={standCount}
                                            onChange={(e) => setStandCount(e.target.value)}
                                            placeholder="e.g. 32000"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">General Vigor</label>
                                    <div className="flex gap-4">
                                        {['Poor', 'Fair', 'Good', 'Excellent'].map(v => (
                                            <button
                                                key={v}
                                                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 focus:bg-primary/20 focus:border-primary transition-all"
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Observations */}
                        {step === 2 && (
                            <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-300">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Bug className="w-5 h-5 text-red-400" />
                                    Observations
                                </h3>

                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => handleAddObservation('pest')}
                                        className="flex-1 py-3 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <Bug className="w-4 h-4" />
                                        Add Pest
                                    </button>
                                    <button
                                        onClick={() => handleAddObservation('disease')}
                                        className="flex-1 py-3 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        Add Disease
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {observations.map((obs, idx) => (
                                        <div key={obs.id} className="glass-panel p-4 rounded-xl relative">
                                            <button
                                                onClick={() => setObservations(observations.filter(o => o.id !== obs.id))}
                                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
                                            >
                                                <X className="w-4 h-4 text-muted-foreground" />
                                            </button>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">Issue</label>
                                                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                                                        <option value="">Select {obs.type}</option>
                                                        {obs.type === 'pest'
                                                            ? PEST_INFESTATIONS.map(p => <option key={p.id} value={p.id}>{p.pestName}</option>)
                                                            : DISEASE_INCIDENTS.map(d => <option key={d.id} value={d.id}>{d.diseaseName}</option>)
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">Severity</label>
                                                    <div className="flex gap-2">
                                                        {['Low', 'Med', 'High'].map(s => (
                                                            <button key={s} className="flex-1 py-1.5 bg-white/5 rounded text-xs hover:bg-white/10">{s}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {observations.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground italic">
                                            No observations recorded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Photos & Notes */}
                        {step === 3 && (
                            <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-300">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-blue-400" />
                                    Photos & Notes
                                </h3>

                                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="font-medium">Upload Photos</p>
                                    <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Field Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="Enter detailed observations..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between shrink-0">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {step > 1 ? 'Back' : 'Cancel'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? 'Submitting...' : step < 3 ? (
                                <>Next <ChevronRight className="w-4 h-4" /></>
                            ) : 'Submit Report'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
