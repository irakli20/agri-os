'use client';

import {
    X,
    Brain,
    TrendingUp,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Clock,
    MapPin,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    OUTBREAK_PREDICTIONS,
    SEASONAL_RISKS,
    RiskLevel,
    UrgencyLevel,
    OutbreakPrediction,
    getRiskLevelColor,
    getRiskLevelBorderColor,
    getUrgencyColor,
    getRiskFactorIcon,
    getCurrentSeason,
    getCurrentSeasonRisks
} from '@/lib/predictive-analytics-data';

interface PredictiveAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScheduleTreatment?: (prediction: OutbreakPrediction) => void;
}

export function PredictiveAnalyticsModal({
    isOpen,
    onClose,
    onScheduleTreatment
}: PredictiveAnalyticsModalProps) {
    const currentSeason = getCurrentSeason();
    const seasonalRisk = getCurrentSeasonRisks();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Predictive Analytics</h2>
                            <p className="text-sm text-muted-foreground">
                                AI-powered outbreak predictions and risk forecasting
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
                <div className="flex-1 overflow-y-auto">
                    {/* Current Season Overview */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold capitalize">
                                {currentSeason} Season Risks
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {seasonalRisk?.risks.map((risk, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-4 rounded-lg border flex items-start gap-3",
                                        getRiskLevelBorderColor(risk.likelihood === 'high' ? 75 : risk.likelihood === 'medium' ? 45 : 20),
                                        "bg-white/5"
                                    )}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{risk.pestType}</span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                risk.likelihood === 'high' ? 'bg-red-500/20 text-red-400' :
                                                risk.likelihood === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                            )}>
                                                {risk.likelihood} risk
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {risk.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <p className="text-sm text-blue-400">
                                <strong>Historical Pattern:</strong> {seasonalRisk?.historicalPatterns[0]}
                            </p>
                        </div>
                    </div>

                    {/* Outbreak Predictions */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Outbreak Predictions</h3>
                        </div>

                        <div className="space-y-4">
                            {OUTBREAK_PREDICTIONS.sort((a, b) => b.probability - a.probability).map((prediction) => (
                                <PredictionCard
                                    key={prediction.id}
                                    prediction={prediction}
                                    onScheduleTreatment={onScheduleTreatment}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PredictionCardProps {
    prediction: OutbreakPrediction;
    onScheduleTreatment?: (prediction: OutbreakPrediction) => void;
}

function PredictionCard({ prediction, onScheduleTreatment }: PredictionCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border p-5 space-y-4",
                getRiskLevelBorderColor(prediction.probability),
                "bg-white/5"
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0",
                        getRiskLevelColor(prediction.probability)
                    )}>
                        <span className="text-lg font-bold">{prediction.probability}%</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-70">Risk</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">{prediction.pestType}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Peak: {new Date(prediction.peakDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{prediction.affectedFields.length} field{prediction.affectedFields.length > 1 ? 's' : ''} affected</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Contributing Risk Factors</h5>
                <div className="space-y-2">
                    {prediction.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-black/20">
                            <span className="text-lg shrink-0">{getRiskFactorIcon(factor.type)}</span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium capitalize">
                                        {factor.type.replace('_', ' ')}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-xs",
                                        factor.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                                        factor.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-green-500/20 text-green-400'
                                    )}>
                                        {factor.impact}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{factor.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preventive Actions */}
            <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Recommended Preventive Actions</h5>
                <div className="space-y-2">
                    {prediction.preventiveActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    getUrgencyColor(action.urgency)
                                )}>
                                    {action.urgency === 'critical' || action.urgency === 'high' ? (
                                        <AlertTriangle className="w-4 h-4" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{action.action}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Cost: ${action.estimatedCost} • Effectiveness: {action.effectiveness}%
                                    </p>
                                </div>
                            </div>
                            <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                getUrgencyColor(action.urgency)
                            )}>
                                {action.urgency}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Prevention Button */}
            {onScheduleTreatment && (
                <button
                    onClick={() => onScheduleTreatment(prediction)}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Calendar className="w-4 h-4" />
                    Schedule Prevention
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
