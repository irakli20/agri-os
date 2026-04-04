'use client';

import React from 'react';
import { 
    Scan,
    CheckCircle2,
    AlertTriangle,
    AlertOctagon,
    RefreshCw,
    Database,
    Clock,
    Activity,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SyncStatus, DriftReport } from '@/types/orchestrator';

interface TwinStatusProps {
    className?: string;
}

export function TwinStatus({ className }: TwinStatusProps) {
    // Mock twin state - would come from API
    const [syncStatus, setSyncStatus] = React.useState<SyncStatus>('synced');
    const [lastSync, setLastSync] = React.useState('2 minutes ago');
    const [calibrationStatus, setCalibrationStatus] = React.useState({
        accuracy: 94,
        lastCalibrated: '3 days ago',
        nextCalibration: 'In 11 days',
        modelVersion: 'v2.4.1',
    });

    const driftReports: DriftReport[] = [
        {
            id: 'drift-1',
            fieldId: 'field-3',
            detectedAt: new Date(Date.now() - 1000 * 60 * 30),
            metric: 'Soil Moisture',
            expectedValue: 65,
            actualValue: 58,
            divergence: 10.8,
            severity: 'low',
            possibleCauses: ['Sensor calibration drift', 'Irrigation timing variation'],
            recommendedActions: ['Recalibrate soil sensors', 'Adjust irrigation schedule'],
            acknowledged: false,
        },
        {
            id: 'drift-2',
            fieldId: 'field-7',
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            metric: 'Crop Growth Rate',
            expectedValue: 12.5,
            actualValue: 10.2,
            divergence: 18.4,
            severity: 'medium',
            possibleCauses: ['Weather variance', 'Nutrient deficiency not modeled'],
            recommendedActions: ['Review weather model', 'Soil sample analysis'],
            acknowledged: true,
        },
    ];

    const comparisonData = [
        { metric: 'Soil Temperature', virtual: 18.5, real: 18.3, diff: -0.2, unit: '°C' },
        { metric: 'Moisture Content', virtual: 68, real: 65, diff: -3, unit: '%' },
        { metric: 'pH Level', virtual: 6.8, real: 6.9, diff: 0.1, unit: '' },
        { metric: 'Nitrogen (N)', virtual: 45, real: 42, diff: -3, unit: 'mg/kg' },
        { metric: 'Crop Height', virtual: 45.2, real: 43.8, diff: -1.4, unit: 'cm' },
        { metric: 'NDVI Index', virtual: 0.72, real: 0.68, diff: -0.04, unit: '' },
    ];

    const getSyncColor = (status: SyncStatus) => {
        switch (status) {
            case 'synced': return 'text-primary bg-primary/20 border-primary/30';
            case 'syncing': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'out_of_sync': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
        }
    };

    const getSyncIcon = (status: SyncStatus) => {
        switch (status) {
            case 'synced': return CheckCircle2;
            case 'syncing': return RefreshCw;
            case 'out_of_sync': return AlertTriangle;
            case 'error': return AlertOctagon;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
        }
    };

    const SyncIcon = getSyncIcon(syncStatus);

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Scan className="w-5 h-5 text-violet-400" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        Digital Twin Status
                    </h3>
                </div>
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
                    getSyncColor(syncStatus)
                )}>
                    <SyncIcon className={cn("w-4 h-4", syncStatus === 'syncing' && "animate-spin")} />
                    <span className="capitalize">{syncStatus.replace('_', ' ')}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Sync Status Overview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider">Last Sync</span>
                        </div>
                        <p className="text-lg font-semibold text-white">{lastSync}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider">Accuracy</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-white">{calibrationStatus.accuracy}</span>
                            <span className="text-sm text-muted-foreground">%</span>
                        </div>
                    </div>
                </div>

                {/* Drift Detection */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider">Drift Detection</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{driftReports.filter(r => !r.acknowledged).length} unacknowledged</span>
                    </div>
                    
                    {driftReports.map((report) => (
                        <div key={report.id} className={cn("p-4 rounded-xl border space-y-3",
                            getSeverityColor(report.severity)
                        )}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-white">{report.metric}</p>
                                    <p className="text-xs opacity-80">Field {report.fieldId} • {new Date(report.detectedAt).toLocaleTimeString()}</p>
                                </div>
                                <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                                    getSeverityColor(report.severity)
                                )}>
                                    {report.severity}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs opacity-70">Expected</p>
                                    <p className="font-mono font-medium">{report.expectedValue}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs opacity-70">Actual</p>
                                    <p className="font-mono font-medium">{report.actualValue}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs opacity-70">Diff</p>
                                    <p className={cn("font-mono font-medium",
                                        report.divergence > 15 ? "text-red-400" : "text-amber-400"
                                    )}>+{report.divergence.toFixed(1)}%</p>
                                </div>
                            </div>

                            {!report.acknowledged && (
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                        Acknowledge
                                    </button>
                                    <button className="flex-1 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                        Recalibrate
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Virtual vs Real Comparison */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Database className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Virtual vs Real</span>
                    </div>
                    <div className="bg-white/5 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-4 gap-2 p-3 text-xs text-muted-foreground border-b border-white/10">
                            <span>Metric</span>
                            <span className="text-center">Virtual</span>
                            <span className="text-center">Real</span>
                            <span className="text-center">Diff</span>
                        </div>
                        {comparisonData.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-2 p-3 text-xs border-b border-white/5 last:border-0">
                                <span className="text-white">{row.metric}</span>
                                <span className="text-center font-mono text-slate-300">{row.virtual}{row.unit}</span>
                                <span className="text-center font-mono text-slate-300">{row.real}{row.unit}</span>
                                <span className="flex items-center justify-center gap-1">
                                    {Math.abs(row.diff) < 0.5 ? (
                                        <Minus className="w-3 h-3 text-slate-400" />
                                    ) : row.diff > 0 ? (
                                        <TrendingUp className="w-3 h-3 text-primary" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-red-400" />
                                    )}
                                    <span className={cn("font-mono",
                                        Math.abs(row.diff) < 0.5 ? "text-slate-400" :
                                        row.diff > 0 ? "text-primary" : "text-red-400"
                                    )}>
                                        {Math.abs(row.diff)}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calibration Status */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Calibration</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Model Version</span>
                            <span className="text-sm font-mono text-white">{calibrationStatus.modelVersion}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Calibrated</span>
                            <span className="text-sm text-white">{calibrationStatus.lastCalibrated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Next Calibration</span>
                            <span className="text-sm text-primary">{calibrationStatus.nextCalibration}</span>
                        </div>
                        <button className="w-full py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30 rounded-lg text-sm font-medium transition-colors">
                            Run Calibration Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
