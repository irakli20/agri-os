'use client';

import { useState, useEffect } from 'react';
import {
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    Search,
    MoreHorizontal,
    ArrowRight,
    Droplets,
    Tractor,
    AlertTriangle,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TreatmentStorage, type ScheduledTreatment } from '@/lib/treatment-data';

export function TreatmentHistory() {
    const [treatments, setTreatments] = useState<ScheduledTreatment[]>([]);
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'in_progress'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Initial load
        setTreatments(TreatmentStorage.getTreatments());

        // Poll for updates (since we're using localStorage and want to react to changes from other components)
        const interval = setInterval(() => {
            setTreatments(TreatmentStorage.getTreatments());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const filteredTreatments = treatments.filter(t => {
        const matchesFilter = filter === 'all' || t.status === filter;
        const matchesSearch = t.treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.fieldId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'in_progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'scheduled': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Treatment History</h2>
                        <p className="text-sm text-muted-foreground">Track applications & sprays</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search treatments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                    {(['all', 'scheduled', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                                filter === f
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {filteredTreatments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Tractor className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No treatments found</p>
                    </div>
                ) : (
                    filteredTreatments.map(treatment => (
                        <div
                            key={treatment.id}
                            className="group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all hover:border-white/10"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                                        getStatusColor(treatment.status)
                                    )}>
                                        {treatment.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                                            treatment.status === 'scheduled' ? <Calendar className="w-4 h-4" /> :
                                                <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">{treatment.treatmentName}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {treatment.productName} • {treatment.rate}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-medium text-foreground">
                                        {new Date(treatment.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-1">
                                        {treatment.time}
                                    </div>
                                    {treatment.status === 'scheduled' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                TreatmentStorage.updateTreatmentStatus(treatment.id, 'completed');
                                                setTreatments(TreatmentStorage.getTreatments());
                                            }}
                                            className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/20 transition-colors"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pl-11">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Tractor className="w-3 h-3" />
                                        Field {treatment.fieldId}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        ${treatment.cost.toFixed(2)}
                                    </span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary hover:underline">
                                    Details <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
