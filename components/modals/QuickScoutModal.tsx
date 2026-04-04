'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
    X,
    Clipboard,
    ChevronDown,
    MapPin,
    Camera,
    Upload,
    Check,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FIELDS } from '@/lib/mock-data';
import {
    ObservationType,
    SeverityLevel,
    ScoutingObservationsStorage,
    OBSERVATION_TYPE_LABELS,
    getObservationTypeColor,
    SEVERITY_LABELS,
    getSeverityColor
} from '@/lib/scouting-observations-data';

interface QuickScoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedFieldId?: string;
}

export function QuickScoutModal({ isOpen, onClose, preselectedFieldId }: QuickScoutModalProps) {
    const [selectedFieldId, setSelectedFieldId] = useState<string>(preselectedFieldId || '');
    const [observationType, setObservationType] = useState<ObservationType>('pest');
    const [severity, setSeverity] = useState<SeverityLevel>('low');
    const [notes, setNotes] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Request geolocation when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLocating(true);
            setLocationError(null);
            
            if (!navigator.geolocation) {
                setLocationError('Geolocation is not supported by your browser');
                setIsLocating(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    setIsLocating(false);
                },
                (error) => {
                    let errorMessage = 'Unable to retrieve your location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    setLocationError(errorMessage);
                    setIsLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, [isOpen]);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleBrowseClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleClearPhoto = useCallback(() => {
        setPhotoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!selectedFieldId || !notes.trim()) return;

        setIsSubmitting(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Save observation to storage
        ScoutingObservationsStorage.addObservation({
            fieldId: selectedFieldId,
            coordinates,
            observationType,
            severity,
            photoUrl: photoUrl || undefined,
            notes: notes.trim(),
            timestamp: new Date().toISOString(),
        });
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Reset form after showing success
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedFieldId(preselectedFieldId || '');
            setObservationType('pest');
            setSeverity('low');
            setNotes('');
            setPhotoUrl(null);
            setCoordinates(null);
            onClose();
        }, 1500);
    }, [selectedFieldId, observationType, severity, notes, photoUrl, coordinates, preselectedFieldId, onClose]);

    const observationTypes: ObservationType[] = ['pest', 'disease', 'weed', 'irrigation', 'equipment', 'other'];
    const severityLevels: SeverityLevel[] = ['none', 'low', 'medium', 'high', 'critical'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Clipboard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Quick Scout</h2>
                            <p className="text-sm text-muted-foreground">
                                Log a new scouting observation
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
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Success Message */}
                    {showSuccess && (
                        <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium">Observation Saved!</p>
                                <p className="text-sm text-muted-foreground">Your scouting report has been logged</p>
                            </div>
                        </div>
                    )}

                    {!showSuccess && (
                        <>
                            {/* Field Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Field</label>
                                <div className="relative">
                                    <select
                                        value={selectedFieldId}
                                        onChange={(e) => setSelectedFieldId(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Select a field...</option>
                                        {FIELDS.map(field => (
                                            <option key={field.id} value={field.id}>
                                                {field.name} - {field.crop}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Observation Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Observation Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {observationTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setObservationType(type)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                                observationType === type
                                                    ? "border-primary bg-primary/20 text-primary"
                                                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            {OBSERVATION_TYPE_LABELS[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Severity */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Severity</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {severityLevels.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSeverity(level)}
                                            className={cn(
                                                "px-2 py-2 rounded-lg border text-sm font-medium transition-all",
                                                severity === level
                                                    ? getSeverityColor(level)
                                                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            {SEVERITY_LABELS[level]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* GPS Coordinates */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <div className="flex-1">
                                        {isLocating ? (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
                                                Getting location...
                                            </div>
                                        ) : coordinates ? (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">GPS: </span>
                                                <span className="font-medium">
                                                    {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                                                </span>
                                                {coordinates.accuracy && (
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        (±{Math.round(coordinates.accuracy)}m)
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-amber-400">
                                                <AlertCircle className="w-4 h-4" />
                                                {locationError || 'Location unavailable'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Describe what you observed..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Photo (Optional)</label>
                                {!photoUrl ? (
                                    <button
                                        onClick={handleBrowseClick}
                                        className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Camera className="w-8 h-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Click to add a photo</p>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={photoUrl}
                                            alt="Scouting photo"
                                            className="w-full max-h-48 object-contain bg-black/20"
                                        />
                                        <button
                                            onClick={handleClearPhoto}
                                            className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                        </>
                    )}
                </div>

                {/* Footer */}
                {!showSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedFieldId || !notes.trim() || isSubmitting}
                            className={cn(
                                "px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium",
                                selectedFieldId && notes.trim() && !isSubmitting
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-white/10 text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Save Observation
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
