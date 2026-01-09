import { useState, useEffect } from 'react';
import {
    X,
    Bug,
    Leaf,
    AlertTriangle,
    TrendingUp,
    MapPin,
    Calendar,
    DollarSign,
    Sprout,
    Shield,
    Target,
    Activity,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    PEST_INFESTATIONS,
    DISEASE_INCIDENTS,
    WEED_PRESSURE,
    TREATMENT_RECOMMENDATIONS,
    REGIONAL_ALERTS,
    getPressureLevelColor,
    getUrgencyColor,
    getSeverityColor,
    type PestInfestation,
    type DiseaseIncident,
    type WeedPressure,
    type TreatmentRecommendation
} from '@/lib/pest-disease-data';
import { TreatmentSchedulerModal } from './TreatmentSchedulerModal';
import { TreatmentStorage, type ScheduledTreatment } from '@/lib/treatment-data';

interface PestDiseaseMonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    fieldId?: string;
}

export function PestDiseaseMonitorModal({ isOpen, onClose, fieldId }: PestDiseaseMonitorModalProps) {
    const [activeTab, setActiveTab] = useState<'pests' | 'diseases' | 'weeds' | 'recommendations' | 'alerts' | 'scheduled'>('pests');
    const [schedulerOpen, setSchedulerOpen] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState<TreatmentRecommendation | null>(null);
    const [scheduledTreatments, setScheduledTreatments] = useState<ScheduledTreatment[]>([]);

    useEffect(() => {
        if (isOpen) {
            const treatments = fieldId
                ? TreatmentStorage.getTreatmentsByField(fieldId)
                : TreatmentStorage.getTreatments();
            setScheduledTreatments(treatments);
        }
    }, [isOpen, fieldId, activeTab]);

    const handleScheduleTreatment = (recommendation: TreatmentRecommendation) => {
        setSelectedRecommendation(recommendation);
        setSchedulerOpen(true);
    };

    const handleTreatmentSubmit = () => {
        // Refresh treatments list
        const treatments = fieldId
            ? TreatmentStorage.getTreatmentsByField(fieldId)
            : TreatmentStorage.getTreatments();
        setScheduledTreatments(treatments);

        // Switch to scheduled tab
        setActiveTab('scheduled');
    };

    if (!isOpen) return null;

    const filteredPests = fieldId
        ? PEST_INFESTATIONS.filter(p => p.fieldId === fieldId)
        : PEST_INFESTATIONS;

    const filteredDiseases = fieldId
        ? DISEASE_INCIDENTS.filter(d => d.fieldId === fieldId)
        : DISEASE_INCIDENTS;

    const filteredWeeds = fieldId
        ? WEED_PRESSURE.filter(w => w.fieldId === fieldId)
        : WEED_PRESSURE;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <Bug className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Pest & Disease Monitor</h2>
                            <p className="text-sm text-muted-foreground">
                                {fieldId ? 'Field-specific threats and treatments' : 'Farm-wide pest, disease, and weed management'}
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

                {/* Tabs */}
                <div className="px-6 pt-4 border-b border-white/10 shrink-0">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {[
                            { id: 'pests' as const, label: 'Pests', icon: Bug, count: filteredPests.length },
                            { id: 'diseases' as const, label: 'Diseases', icon: Activity, count: filteredDiseases.length },
                            { id: 'weeds' as const, label: 'Weeds', icon: Sprout, count: filteredWeeds.length },
                            { id: 'recommendations' as const, label: 'Treatments', icon: Shield, count: TREATMENT_RECOMMENDATIONS.length },
                            { id: 'alerts' as const, label: 'Regional Alerts', icon: AlertTriangle, count: REGIONAL_ALERTS.length },
                            { id: 'scheduled' as const, label: 'Scheduled', icon: Calendar, count: scheduledTreatments.length }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-white/10 text-foreground"
                                            : "text-muted-foreground hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{tab.label}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-xs",
                                        activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-white/10"
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Pests Tab */}
                    {activeTab === 'pests' && (
                        <div className="space-y-4">
                            {filteredPests.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Bug className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No pest infestations detected</p>
                                </div>
                            ) : (
                                filteredPests.map(pest => (
                                    <div key={pest.id} className="glass-panel rounded-xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                                    <Bug className="w-6 h-6 text-red-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{pest.pestName}</h3>
                                                    <p className="text-sm text-muted-foreground">Field {pest.fieldId} • {pest.affectedArea} acres affected</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                                getPressureLevelColor(pest.pressureLevel)
                                            )}>
                                                {pest.pressureLevel} Pressure
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Population</div>
                                                <div className="text-lg font-bold">{pest.population}/plant</div>
                                                <div className="text-xs text-red-400">Threshold: {pest.economicThreshold}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Detected</div>
                                                <div className="text-sm font-medium">{new Date(pest.detectedDate).toLocaleDateString()}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Last Scouted</div>
                                                <div className="text-sm font-medium">{new Date(pest.lastScouted).toLocaleDateString()}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Status</div>
                                                <div className={cn(
                                                    "text-sm font-medium capitalize",
                                                    pest.treatmentStatus === 'completed' ? 'text-green-400' :
                                                        pest.treatmentStatus === 'in_progress' ? 'text-blue-400' :
                                                            pest.treatmentStatus === 'scheduled' ? 'text-yellow-400' :
                                                                'text-gray-400'
                                                )}>
                                                    {pest.treatmentStatus.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>

                                        {pest.notes && (
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                                                <span className="font-medium text-blue-400">Notes:</span> {pest.notes}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Diseases Tab */}
                    {activeTab === 'diseases' && (
                        <div className="space-y-4">
                            {filteredDiseases.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No disease incidents detected</p>
                                </div>
                            ) : (
                                filteredDiseases.map(disease => (
                                    <div key={disease.id} className="glass-panel rounded-xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                                    <Activity className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{disease.diseaseName}</h3>
                                                    <p className="text-sm text-muted-foreground capitalize">{disease.diseaseType} • {disease.affectedArea} acres</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                                getPressureLevelColor(disease.pressureLevel)
                                            )}>
                                                {disease.pressureLevel}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Weather Favorability</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-500 to-red-500"
                                                            style={{ width: `${disease.weatherFavorability}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold">{disease.weatherFavorability}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Spread Risk</div>
                                                <div className={cn(
                                                    "text-sm font-medium capitalize",
                                                    disease.spreadRisk === 'high' ? 'text-red-400' :
                                                        disease.spreadRisk === 'medium' ? 'text-yellow-400' :
                                                            'text-green-400'
                                                )}>
                                                    {disease.spreadRisk}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Treatment</div>
                                                <div className={cn(
                                                    "text-sm font-medium capitalize",
                                                    disease.treatmentStatus === 'completed' ? 'text-green-400' :
                                                        disease.treatmentStatus === 'scheduled' ? 'text-yellow-400' :
                                                            'text-gray-400'
                                                )}>
                                                    {disease.treatmentStatus.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-2">Symptoms:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {disease.symptoms.map((symptom, i) => (
                                                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                                        {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Weeds Tab */}
                    {activeTab === 'weeds' && (
                        <div className="space-y-4 animate-slide-right-fade">
                            {filteredWeeds.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Sprout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No significant weed pressure detected</p>
                                </div>
                            ) : (
                                filteredWeeds.map(weed => (
                                    <div key={weed.id} className="glass-panel rounded-xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                                                    <Sprout className="w-6 h-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{weed.weedSpecies}</h3>
                                                    <p className="text-sm text-muted-foreground capitalize">{weed.weedType} weed • {weed.coverage}% coverage</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                                getPressureLevelColor(weed.pressureLevel)
                                            )}>
                                                {weed.pressureLevel}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Growth Stage</div>
                                                <div className="text-sm font-medium">{weed.growthStage}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Competition Impact</div>
                                                <div className="text-lg font-bold text-orange-400">{weed.competitionImpact}%</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Treatment</div>
                                                <div className={cn(
                                                    "text-sm font-medium capitalize",
                                                    weed.treatmentStatus === 'scheduled' ? 'text-yellow-400' : 'text-gray-400'
                                                )}>
                                                    {weed.treatmentStatus.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>

                                        {weed.resistanceProfile.length > 0 && (
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                                <div className="text-xs text-red-400 font-medium mb-2">⚠ Herbicide Resistance:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {weed.resistanceProfile.map((herbicide, i) => (
                                                        <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                                                            {herbicide}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Treatment Recommendations Tab */}
                    {activeTab === 'recommendations' && (
                        <div className="space-y-4">
                            {TREATMENT_RECOMMENDATIONS.map(rec => (
                                <div key={rec.id} className="glass-panel rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                                <Shield className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg capitalize">{rec.method} Treatment</h3>
                                                <p className="text-sm text-muted-foreground capitalize">For {rec.problemType} issue</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                            getUrgencyColor(rec.urgency)
                                        )}>
                                            {rec.urgency} Urgency
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Expected Cost</div>
                                            <div className="text-lg font-bold text-green-400">${rec.expectedCost.toFixed(2)}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Yield Protection</div>
                                            <div className="text-lg font-bold text-blue-400">{rec.expectedYieldProtection}%</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Environmental Impact</div>
                                            <div className={cn(
                                                "text-sm font-medium capitalize",
                                                rec.environmentalImpact === 'low' ? 'text-green-400' :
                                                    rec.environmentalImpact === 'medium' ? 'text-yellow-400' :
                                                        'text-red-400'
                                            )}>
                                                {rec.environmentalImpact}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-2">Recommended Products:</div>
                                            {rec.products.map((product, i) => (
                                                <div key={i} className="flex items-center justify-between py-2 border-t border-white/5 first:border-0">
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground">{product.activeIngredient} • {product.rate}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">${product.cost}/acre</div>
                                                        <div className="text-xs text-green-400">{product.efficacy}% efficacy</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                                            <div className="font-medium text-blue-400 mb-1">Timing:</div>
                                            <p>{rec.timing}</p>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm">
                                            <div className="font-medium text-yellow-400 mb-1">Conditions:</div>
                                            <p>{rec.conditions}</p>
                                        </div>

                                        <button
                                            onClick={() => handleScheduleTreatment(rec)}
                                            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            Schedule Treatment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Regional Alerts Tab */}
                    {activeTab === 'alerts' && (
                        <div className="space-y-4">
                            {REGIONAL_ALERTS.map(alert => (
                                <div key={alert.id} className="glass-panel rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                                                <AlertTriangle className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{alert.name}</h3>
                                                <p className="text-sm text-muted-foreground capitalize">{alert.type} • {alert.region}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                            getSeverityColor(alert.severity)
                                        )}>
                                            {alert.severity}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Distance</div>
                                            <div className="text-lg font-bold">{alert.radius} miles</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Reported Cases</div>
                                            <div className="text-lg font-bold text-red-400">{alert.reportedCases}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="text-xs text-muted-foreground mb-1">Trend</div>
                                            <div className={cn(
                                                "text-sm font-medium capitalize flex items-center gap-1",
                                                alert.trend === 'increasing' ? 'text-red-400' :
                                                    alert.trend === 'decreasing' ? 'text-green-400' :
                                                        'text-yellow-400'
                                            )}>
                                                {alert.trend === 'increasing' && <TrendingUp className="w-4 h-4" />}
                                                {alert.trend}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                                        <div className="text-sm mb-2">{alert.description}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {alert.affectedCrops.map((crop, i) => (
                                                <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                                                    {crop}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                        <div className="text-xs text-blue-400 font-medium mb-2">Recommendations:</div>
                                        <ul className="space-y-1 text-sm">
                                            {alert.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-blue-400 shrink-0">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Scheduled Treatments Tab */}
                    {activeTab === 'scheduled' && (
                        <div className="space-y-4 animate-slide-right-fade">
                            {scheduledTreatments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No treatments scheduled</p>
                                    <button
                                        onClick={() => setActiveTab('recommendations')}
                                        className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                                    >
                                        View Recommendations
                                    </button>
                                </div>
                            ) : (
                                scheduledTreatments.map(treatment => (
                                    <div key={treatment.id} className="glass-panel rounded-xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                                    <Calendar className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{treatment.treatmentName}</h3>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {treatment.productName} • {treatment.rate}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                                treatment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    treatment.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                            )}>
                                                {treatment.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Scheduled Date</div>
                                                <div className="text-sm font-medium">{new Date(treatment.date).toLocaleDateString()}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Time Window</div>
                                                <div className="text-sm font-medium">{treatment.time}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Estimated Cost</div>
                                                <div className="text-sm font-bold text-green-400">${treatment.cost.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        {treatment.notes && (
                                            <div className="bg-white/5 rounded-lg p-3 text-sm">
                                                <span className="text-muted-foreground">Notes:</span> {treatment.notes}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Treatment Scheduler Modal */}
            {selectedRecommendation && (
                <TreatmentSchedulerModal
                    isOpen={schedulerOpen}
                    onClose={() => {
                        setSchedulerOpen(false);
                        setSelectedRecommendation(null);
                    }}
                    recommendation={selectedRecommendation}
                    fieldId={fieldId}
                    onSubmit={handleTreatmentSubmit}
                />
            )}
        </div>
    );
}
