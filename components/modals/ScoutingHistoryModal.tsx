'use client';

import { useState, useMemo } from 'react';
import {
    X,
    History,
    MapPin,
    Calendar,
    Filter,
    ChevronDown,
    Bug,
    Droplets,
    Leaf,
    Wrench,
    FileText,
    AlertTriangle,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FIELDS } from '@/lib/mock-data';
import {
    ScoutingObservation,
    ObservationType,
    SeverityLevel,
    ScoutingObservationsStorage,
    OBSERVATION_TYPE_LABELS,
    SEVERITY_LABELS,
    getObservationTypeColor,
    getSeverityColor
} from '@/lib/scouting-observations-data';

interface ScoutingHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    fieldId?: string; // Optional: filter by specific field
}

export function ScoutingHistoryModal({ isOpen, onClose, fieldId }: ScoutingHistoryModalProps) {
    const [selectedType, setSelectedType] = useState<ObservationType | 'all'>('all');
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'all'>('all');
    const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Get all observations from storage
    const allObservations = ScoutingObservationsStorage.getObservations();

    // Filter observations
    const filteredObservations = useMemo(() => {
        let filtered = [...allObservations];

        // Filter by field if provided
        if (fieldId) {
            filtered = filtered.filter(obs => obs.fieldId === fieldId);
        }

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(obs => obs.observationType === selectedType);
        }

        // Filter by severity
        if (selectedSeverity !== 'all') {
            filtered = filtered.filter(obs => obs.severity === selectedSeverity);
        }

        // Filter by date range
        if (dateRange !== 'all') {
            const now = new Date();
            const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
            const cutoff = new Date(now.setDate(now.getDate() - days));
            filtered = filtered.filter(obs => new Date(obs.timestamp) >= cutoff);
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [allObservations, fieldId, selectedType, selectedSeverity, dateRange]);

    const getObservationIcon = (type: ObservationType) => {
        switch (type) {
            case 'pest': return Bug;
            case 'disease': return AlertTriangle;
            case 'weed': return Leaf;
            case 'irrigation': return Droplets;
            case 'equipment': return Wrench;
            case 'other': return FileText;
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            if (diffInHours < 1) return 'Just now';
            return `${Math.floor(diffInHours)}h ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const getFieldName = (fieldId: string) => {
        const field = FIELDS.find(f => f.id === fieldId);
        return field?.name || 'Unknown Field';
    };

    if (!isOpen) return null;

    const observationTypes: ObservationType[] = ['pest', 'disease', 'weed', 'irrigation', 'equipment', 'other'];
    const severityLevels: SeverityLevel[] = ['none', 'low', 'medium', 'high', 'critical'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="modal-icon-chip bg-blue-500/20">
                            <History className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Scouting History</h2>
                            <p className="text-sm text-muted-foreground">
                                {fieldId ? `Observations for ${getFieldName(fieldId)}` : 'All field observations'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showFilters ? "bg-primary/20 text-primary" : "hover:bg-white/10"
                            )}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-4 border-b border-white/10 bg-white/5 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            {/* Type Filter */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-2">Type</label>
                                <div className="relative">
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value as ObservationType | 'all')}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="all">All Types</option>
                                        {observationTypes.map(type => (
                                            <option key={type} value={type}>
                                                {OBSERVATION_TYPE_LABELS[type]}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Severity Filter */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-2">Severity</label>
                                <div className="relative">
                                    <select
                                        value={selectedSeverity}
                                        onChange={(e) => setSelectedSeverity(e.target.value as SeverityLevel | 'all')}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="all">All Severities</option>
                                        {severityLevels.map(severity => (
                                            <option key={severity} value={severity}>
                                                {SEVERITY_LABELS[severity]}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Date Range Filter */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-2">Date Range</label>
                                <div className="relative">
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="7days">Last 7 Days</option>
                                        <option value="30days">Last 30 Days</option>
                                        <option value="90days">Last 90 Days</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Count */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Active filters:</span>
                            {selectedType !== 'all' && (
                                <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                    {OBSERVATION_TYPE_LABELS[selectedType]}
                                </span>
                            )}
                            {selectedSeverity !== 'all' && (
                                <span className={cn("px-2 py-0.5 rounded-full", getSeverityColor(selectedSeverity))}>
                                    {SEVERITY_LABELS[selectedSeverity]}
                                </span>
                            )}
                            {dateRange !== 'all' && (
                                <span className="px-2 py-0.5 bg-white/10 rounded-full">
                                    {dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : 'Last 90 days'}
                                </span>
                            )}
                            {selectedType === 'all' && selectedSeverity === 'all' && dateRange === 'all' && (
                                <span>None</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="px-6 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredObservations.length} observation{filteredObservations.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Observations List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredObservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <History className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium">No observations found</p>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your filters or scout this field to add observations
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredObservations.map((observation) => {
                                const Icon = getObservationIcon(observation.observationType);
                                return (
                                    <div
                                        key={observation.id}
                                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                getObservationTypeColor(observation.observationType)
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {OBSERVATION_TYPE_LABELS[observation.observationType]}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDate(observation.timestamp)}
                                                            {!fieldId && (
                                                                <>
                                                                    <span className="text-white/20">•</span>
                                                                    <span>{getFieldName(observation.fieldId)}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-full text-xs font-medium shrink-0",
                                                        getSeverityColor(observation.severity)
                                                    )}>
                                                        {SEVERITY_LABELS[observation.severity]}
                                                    </span>
                                                </div>

                                                {/* Notes */}
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                    {observation.notes}
                                                </p>

                                                {/* Photo and Location */}
                                                <div className="flex items-center gap-4 mt-3">
                                                    {observation.photoUrl && (
                                                        <img
                                                            src={observation.photoUrl}
                                                            alt="Observation"
                                                            className="w-16 h-16 rounded-lg object-cover border border-white/10"
                                                        />
                                                    )}
                                                    {observation.coordinates && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>
                                                                {observation.coordinates.lat.toFixed(4)}, {observation.coordinates.lng.toFixed(4)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
