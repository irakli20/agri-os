'use client';

import React from 'react';
import { 
    Brain,
    Clock,
    CheckCircle2,
    XCircle,
    Edit3,
    AlertOctagon,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    History,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Decision, DecisionPriority, DecisionStatus } from '@/types/orchestrator';

interface DecisionQueueProps {
    className?: string;
}

interface DecisionCardProps {
    decision: Decision;
    mode: 'auto' | 'assisted' | 'manual';
    onApprove: (id: string) => void;
    onDecline: (id: string) => void;
    onModify: (id: string) => void;
}

function DecisionCard({ decision, mode, onApprove, onDecline, onModify }: DecisionCardProps) {
    const [countdown, setCountdown] = React.useState(mode === 'assisted' ? 30 : 0);
    const [isExpanded, setIsExpanded] = React.useState(false);

    React.useEffect(() => {
        if (mode === 'assisted' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (mode === 'assisted' && countdown === 0) {
            onApprove(decision.id);
        }
    }, [countdown, mode, decision.id, onApprove]);

    const getPriorityColor = (priority: DecisionPriority) => {
        switch (priority) {
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            case 'routine': return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
        }
    };

    const getPriorityIcon = (priority: DecisionPriority) => {
        switch (priority) {
            case 'critical': return AlertOctagon;
            case 'high': return AlertTriangle;
            default: return null;
        }
    };

    const PriorityIcon = getPriorityIcon(decision.priority);

    return (
        <div className={cn("rounded-xl border overflow-hidden transition-all duration-200",
            getPriorityColor(decision.priority)
        )}>
            <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                        {PriorityIcon && <PriorityIcon className="w-5 h-5 mt-0.5" />}
                        <div>
                            <h4 className="font-medium text-white">{decision.title}</h4>
                            <p className="text-xs opacity-80">{decision.type} • Field {decision.fieldId}</p>
                        </div>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize",
                        getPriorityColor(decision.priority)
                    )}>
                        {decision.priority}
                    </span>
                </div>

                {/* Main Info */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-lg p-2">
                        <p className="text-xs opacity-70 mb-1">Expected ROI</p>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="font-mono font-medium">+{decision.recommendation.expectedROI}%</span>
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2">
                        <p className="text-xs opacity-70 mb-1">AI Confidence</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full rounded-full",
                                        decision.recommendation.confidence >= 85 ? "bg-primary" :
                                        decision.recommendation.confidence >= 60 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${decision.recommendation.confidence}%` }}
                                />
                            </div>
                            <span className="font-mono text-sm">{decision.recommendation.confidence}%</span>
                        </div>
                    </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                    <div className="bg-black/20 rounded-lg p-3 space-y-2">
                        <p className="text-sm text-white">{decision.description}</p>
                        <div className="text-xs space-y-1">
                            <p className="opacity-70">Action: {decision.recommendation.action}</p>
                            <p className="opacity-70">Expected Cost: ${decision.recommendation.expectedCost.toLocaleString()}</p>
                            <p className="opacity-70">Expected Revenue: ${decision.recommendation.expectedRevenue.toLocaleString()}</p>
                            {decision.recommendation.riskFactors.length > 0 && (
                                <div className="pt-2 border-t border-white/10">
                                    <p className="opacity-70 mb-1">Risk Factors:</p>
                                    <ul className="list-disc list-inside opacity-60">
                                        {decision.recommendation.riskFactors.map((risk, idx) => (
                                            <li key={idx}>{risk}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onApprove(decision.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-colors"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                    </button>
                    <button 
                        onClick={() => onDecline(decision.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                        Decline
                    </button>
                    <button 
                        onClick={() => onModify(decision.id)}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>

                {/* Assisted Mode Countdown */}
                {mode === 'assisted' && countdown > 0 && (
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-400">
                        <Clock className="w-3 h-3" />
                        <span>Auto-executing in {countdown}s...</span>
                    </div>
                )}

                {/* Expand Toggle */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors w-full"
                >
                    {isExpanded ? (
                        <>Less details <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>More details <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            </div>
        </div>
    );
}

export function DecisionQueue({ className }: DecisionQueueProps) {
    const [mode, setMode] = React.useState<'auto' | 'assisted' | 'manual'>('assisted');
    const [showHistory, setShowHistory] = React.useState(false);

    // Mock decisions - would come from API
    const [decisions, setDecisions] = React.useState<Decision[]>([
        {
            id: 'dec-1',
            type: 'irrigate',
            status: 'pending',
            priority: 'high',
            fieldId: 'field-3',
            title: 'Irrigate Field 3',
            description: 'Soil moisture has dropped below optimal threshold. Recommend 15mm irrigation to maintain crop health.',
            recommendation: {
                id: 'rec-1',
                action: 'Apply 15mm irrigation',
                actionType: 'irrigate',
                parameters: { amount: 15, method: 'drip' },
                confidence: 87,
                expectedCost: 450,
                expectedRevenue: 1200,
                expectedROI: 166,
                timeWindow: { start: new Date(), end: new Date(Date.now() + 86400000) },
                explanation: 'Soil moisture at 42%, optimal range 55-70%',
                rationale: [
                    { title: 'Field Moisture Drop', detail: 'Current moisture is below target band for current stage.', source: 'field' },
                    { title: 'Near-Term Weather', detail: 'Rain probability is not high enough to defer irrigation safely.', source: 'weather' },
                ],
                whyNow: 'Act now to avoid stress before the next day closes the current window.',
                deadline: new Date(Date.now() + 86400000),
                expectedImpact: { yieldDeltaPct: 4.2, revenueDelta: 750, costDelta: -450, riskReductionPct: 19 },
                priorityScoring: {
                    riskToYieldScore: 79,
                    economicsScore: 74,
                    urgencyScore: 81,
                    compositeScore: 77.15,
                    reasons: ['High stress risk', 'Positive net return', 'Short decision window'],
                },
                riskFactors: ['Weather forecast shows 30% rain chance', 'Water costs elevated this week'],
                prerequisites: ['Irrigation system operational', 'Water supply available'],
            },
            alternatives: [],
            context: {} as any,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
            autoExecuted: false,
            conflictAnalysis: {
                hasConflicts: false,
                conflictingDecisionIds: [],
                reasons: [],
                severity: 'low',
                recommendedResolution: 'No conflicts detected.',
            },
        },
        {
            id: 'dec-2',
            type: 'fertilize',
            status: 'pending',
            priority: 'medium',
            fieldId: 'field-7',
            title: 'Nitrogen Top-Dress',
            description: 'NDVI analysis indicates nitrogen deficiency. Recommend 50kg/ha N application.',
            recommendation: {
                id: 'rec-2',
                action: 'Apply 50kg/ha nitrogen fertilizer',
                actionType: 'fertilize',
                parameters: { amount: 50, type: 'N', method: 'broadcast' },
                confidence: 78,
                expectedCost: 320,
                expectedRevenue: 850,
                expectedROI: 165,
                timeWindow: { start: new Date(), end: new Date(Date.now() + 172800000) },
                explanation: 'NDVI index 0.68, target 0.75+ for this growth stage',
                rationale: [
                    { title: 'NDVI Signal', detail: 'Vegetation index indicates potential N shortfall.', source: 'field' },
                    { title: 'Growth Timing', detail: 'Current growth stage is responsive to top-dress correction.', source: 'rule' },
                ],
                whyNow: 'Apply before the 48-hour window to recover canopy vigor.',
                deadline: new Date(Date.now() + 172800000),
                expectedImpact: { yieldDeltaPct: 3.6, revenueDelta: 530, costDelta: -320, riskReductionPct: 14 },
                priorityScoring: {
                    riskToYieldScore: 62,
                    economicsScore: 70,
                    urgencyScore: 66,
                    compositeScore: 65.9,
                    reasons: ['Moderate yield risk', 'Healthy ROI', '2-day window'],
                },
                riskFactors: ['Rain forecast may delay application'],
                prerequisites: ['Fertilizer in inventory', 'Spreading equipment available'],
            },
            alternatives: [],
            context: {} as any,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            autoExecuted: false,
            conflictAnalysis: {
                hasConflicts: false,
                conflictingDecisionIds: [],
                reasons: [],
                severity: 'low',
                recommendedResolution: 'No conflicts detected.',
            },
        },
        {
            id: 'dec-3',
            type: 'spray',
            status: 'pending',
            priority: 'critical',
            fieldId: 'field-2',
            title: 'Fungicide Application',
            description: 'Disease model predicts high risk of powdery mildew. Immediate preventive treatment recommended.',
            recommendation: {
                id: 'rec-3',
                action: 'Apply preventive fungicide',
                actionType: 'spray',
                parameters: { product: 'Fungicide-X', rate: '2L/ha' },
                confidence: 92,
                expectedCost: 180,
                expectedRevenue: 2400,
                expectedROI: 1233,
                timeWindow: { start: new Date(), end: new Date(Date.now() + 43200000) },
                explanation: 'Disease pressure index at 8.5/10, temperature and humidity favorable',
                rationale: [
                    { title: 'Disease Pressure', detail: 'Modeled infection pressure exceeds intervention threshold.', source: 'rule' },
                    { title: 'Environmental Risk', detail: 'Humidity and temperature currently favor disease spread.', source: 'weather' },
                ],
                whyNow: 'Critical risk period is active; delay raises expected loss probability.',
                deadline: new Date(Date.now() + 43200000),
                expectedImpact: { yieldDeltaPct: 7.8, revenueDelta: 1860, costDelta: -180, riskReductionPct: 32 },
                priorityScoring: {
                    riskToYieldScore: 94,
                    economicsScore: 88,
                    urgencyScore: 92,
                    compositeScore: 91.2,
                    reasons: ['Critical disease pressure', 'High avoided-loss value', '12-hour window'],
                },
                riskFactors: ['Wind speeds may exceed safe spraying limits'],
                prerequisites: ['Spray window open (wind < 15km/h)', 'Fungicide in stock'],
            },
            alternatives: [],
            context: {} as any,
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
            autoExecuted: false,
            conflictAnalysis: {
                hasConflicts: true,
                conflictingDecisionIds: ['dec-1'],
                reasons: ['Action conflict: spray and irrigate overlap on the same field/time window.'],
                severity: 'high',
                recommendedResolution: 'Execute fungicide first and reschedule irrigation after spray interval.',
            },
        },
    ]);

    const [history, setHistory] = React.useState<Decision[]>([
        {
            id: 'dec-0-1',
            type: 'harvest',
            status: 'completed',
            priority: 'high',
            fieldId: 'field-1',
            title: 'Harvest Field 1',
            description: 'Grain moisture at optimal 14%. Weather window favorable.',
            recommendation: {
                id: 'rec-0-1',
                action: 'Harvest winter wheat',
                actionType: 'harvest',
                parameters: {},
                confidence: 89,
                expectedCost: 1200,
                expectedRevenue: 8500,
                expectedROI: 608,
                timeWindow: { start: new Date(), end: new Date() },
                explanation: 'Harvest completed successfully',
                rationale: [
                    { title: 'Harvest Window', detail: 'Crop moisture and weather met harvest criteria.', source: 'field' },
                ],
                whyNow: 'Executed during optimal conditions.',
                deadline: new Date(),
                expectedImpact: { yieldDeltaPct: 5.1, revenueDelta: 7300, costDelta: -1200, riskReductionPct: 21 },
                priorityScoring: {
                    riskToYieldScore: 83,
                    economicsScore: 86,
                    urgencyScore: 78,
                    compositeScore: 83.3,
                    reasons: ['High harvest loss risk', 'Strong gross margin', 'Time-bound weather window'],
                },
                riskFactors: [],
                prerequisites: [],
            },
            alternatives: [],
            context: {} as any,
            createdAt: new Date(Date.now() - 86400000 * 3),
            expiresAt: new Date(Date.now() - 86400000 * 2),
            executedAt: new Date(Date.now() - 86400000 * 2),
            autoExecuted: false,
            conflictAnalysis: {
                hasConflicts: false,
                conflictingDecisionIds: [],
                reasons: [],
                severity: 'low',
                recommendedResolution: 'No conflicts detected.',
            },
        },
    ]);

    const handleApprove = (id: string) => {
        setDecisions(prev => prev.filter(d => d.id !== id));
        const decision = decisions.find(d => d.id === id);
        if (decision) {
            setHistory(prev => [{ ...decision, status: 'completed' as DecisionStatus, executedAt: new Date() }, ...prev]);
        }
    };

    const handleDecline = (id: string) => {
        setDecisions(prev => prev.filter(d => d.id !== id));
        const decision = decisions.find(d => d.id === id);
        if (decision) {
            setHistory(prev => [{ ...decision, status: 'declined' as DecisionStatus }, ...prev]);
        }
    };

    const handleModify = (id: string) => {
        // Would open a modify dialog
        console.log('Modify decision:', id);
    };

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        AI Decision Queue
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Mode:</span>
                    <select 
                        value={mode}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="bg-white/10 border border-white/20 rounded-lg text-xs px-2 py-1 outline-none focus:border-rose-400"
                    >
                        <option value="manual">Manual</option>
                        <option value="assisted">Assisted</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {/* Pending Decisions */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider">Pending ({decisions.length})</span>
                        </div>
                    </div>
                    
                    {decisions.length === 0 ? (
                        <div className="text-center py-8 bg-white/5 rounded-xl">
                            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No pending decisions</p>
                        </div>
                    ) : (
                        decisions.map(decision => (
                            <DecisionCard
                                key={decision.id}
                                decision={decision}
                                mode={mode}
                                onApprove={handleApprove}
                                onDecline={handleDecline}
                                onModify={handleModify}
                            />
                        ))
                    )}
                </div>

                {/* Decision History */}
                <div className="space-y-3">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center justify-between w-full text-muted-foreground hover:text-white transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider">Decision History</span>
                        </div>
                        {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {showHistory && (
                        <div className="space-y-2">
                            {history.map((decision) => (
                                <div 
                                    key={decision.id}
                                    className="p-3 bg-white/5 rounded-lg border border-white/10 opacity-60"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {decision.status === 'completed' ? (
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className="text-sm text-white">{decision.title}</span>
                                        </div>
                                        <span className={cn("text-xs px-2 py-0.5 rounded-full",
                                            decision.status === 'completed' 
                                                ? "bg-primary/20 text-primary" 
                                                : "bg-red-500/20 text-red-400"
                                        )}>
                                            {decision.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {decision.executedAt && new Date(decision.executedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
