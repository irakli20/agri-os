'use client';

import React from 'react';
import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { 
    Play, 
    Pause, 
    Settings, 
    CheckCircle2, 
    AlertCircle,
    RefreshCw,
    Activity,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutomationLevel, OrchestratorStatus, SyncStatus } from '@/types/orchestrator';

const ORCHESTRATOR_HEADERS = {
    'content-type': 'application/json',
    'x-agri-user-id': 'local-ui',
    'x-agri-user-role': 'supervisor',
};

interface ControlPanelProps {
    className?: string;
}

export function ControlPanel({ className }: ControlPanelProps) {
    const { gameTime, transactions, activeRentals } = useGameStore();
    const {
        status,
        automationLevel,
        digitalTwin,
        activeDecisions,
        completedActions,
        pendingAlerts,
        start,
        pause,
        setAutomationLevel,
    } = useOrchestratorStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [controlError, setControlError] = React.useState<string | null>(null);

    const mode = automationLevel;
    const seasonProgress = React.useMemo(() => {
        const weeksPerSeason = 13;
        const normalizedWeek = ((gameTime?.week || 1) - 1) / weeksPerSeason;
        return Math.max(0, Math.min(100, Math.round(normalizedWeek * 100)));
    }, [gameTime?.week]);

    const activeOperations = React.useMemo(
        () => completedActions.filter((action) => ['approved', 'dispatched', 'acknowledged'].includes(action.status)).length,
        [completedActions]
    );

    const fieldsManaged = React.useMemo(() => {
        const seen = new Set<string>();
        for (const transaction of transactions) {
            if (transaction.fieldId) {
                seen.add(transaction.fieldId);
            }
        }
        for (const rental of activeRentals) {
            if (rental.fieldId) {
                seen.add(rental.fieldId);
            }
        }
        return seen.size;
    }, [transactions, activeRentals]);
    const pendingDecisions = activeDecisions.filter((decision) => decision.status === 'pending').length;
    const syncStatus: SyncStatus = digitalTwin?.syncStatus || 'synced';

    const syncFromApi = React.useCallback(async () => {
        const response = await fetch('/api/orchestrator');
        if (!response.ok) {
            throw new Error(`Failed to load orchestrator state (${response.status})`);
        }
        // Unified store: API reads from the same store as UI.
        // We sync only for display verification if needed, but don't force-set the store 
        // to avoid clobbering local state or creating sync loops.
    }, []);

    React.useEffect(() => {
        void syncFromApi().catch((error) => {
            console.warn('[ControlPanel] Failed to sync orchestrator state from API:', error);
        });
    }, [syncFromApi]);

    const submitControlAction = React.useCallback(async (action: 'start' | 'pause' | 'mode', mode?: AutomationLevel) => {
        setIsSubmitting(true);
        setControlError(null);
        try {
            const response = await fetch(`/api/orchestrator?action=${action}`, {
                method: 'POST',
                headers: ORCHESTRATOR_HEADERS,
                body: action === 'mode'
                    ? JSON.stringify({ mode })
                    : JSON.stringify({}),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok || payload?.success === false) {
                throw new Error(payload?.error || `Control action failed (${response.status})`);
            }
            await syncFromApi();
        } catch (error) {
            setControlError((error as Error).message || 'Failed to update orchestrator');
        } finally {
            setIsSubmitting(false);
        }
    }, [syncFromApi]);

    const toggleStatus = () => {
        void submitControlAction(status === 'running' ? 'pause' : 'start');
    };

    const getModeColor = (m: AutomationLevel) => {
        switch (m) {
            case 'fully_automated': return 'text-primary bg-primary/20 border-primary/30';
            case 'assisted': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'manual': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        }
    };

    const getStatusColor = (s: OrchestratorStatus) => {
        switch (s) {
            case 'running': return 'text-primary';
            case 'paused': return 'text-amber-400';
            case 'idle': return 'text-slate-400';
            case 'error': return 'text-red-400';
        }
    };

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        Orchestrator Control
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("flex items-center gap-1.5 text-xs", getStatusColor(status))}>
                        <span className={cn("w-2 h-2 rounded-full animate-pulse", 
                            status === 'running' ? 'bg-primary' : 
                            status === 'paused' ? 'bg-amber-400' : 
                            status === 'error' ? 'bg-red-400' : 'bg-slate-400'
                        )} />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </div>

            {/* Main Controls */}
            <div className="py-4 space-y-4">
                {/* Start/Pause Button */}
                <button
                    onClick={toggleStatus}
                    disabled={isSubmitting}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200",
                        status === 'running' 
                            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30" 
                            : "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30",
                        isSubmitting && 'opacity-70 cursor-not-allowed'
                    )}
                >
                    {status === 'running' ? (
                        <><Pause className="w-5 h-5" /> Pause Automation</>
                    ) : (
                        <><Play className="w-5 h-5" /> Start Automation</>
                    )}
                </button>

                {/* Mode Selector */}
                <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Automation Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['manual', 'assisted', 'fully_automated'] as AutomationLevel[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => void submitControlAction('mode', m)}
                                className={cn(
                                    "px-2 py-2 rounded-lg text-xs font-medium transition-all border",
                                    mode === m 
                                        ? getModeColor(m)
                                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                )}
                            >
                                {m === 'fully_automated' ? 'Auto' : m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                {controlError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {controlError}
                    </div>
                )}
            </div>

            {/* Season Progress */}
            <div className="py-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Season Progress</span>
                    <span className="text-xs font-medium text-white">{seasonProgress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${seasonProgress}%` }}
                    />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{gameTime?.season || 'Spring'} Week {gameTime?.week || 1}</span>
                    <span>Year {gameTime?.year || 1}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Active Ops</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{activeOperations}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Fields</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{fieldsManaged}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Pending</span>
                    </div>
                    <p className={cn("text-2xl font-bold", pendingDecisions > 0 ? "text-amber-400" : "text-white")}>
                        {pendingDecisions}
                    </p>
                    {pendingAlerts.length > 0 && (
                        <p className="text-[11px] text-muted-foreground mt-1">Alerts: {pendingAlerts.length}</p>
                    )}
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <RefreshCw className={cn("w-4 h-4", syncStatus === 'syncing' && "animate-spin")} />
                        <span className="text-xs uppercase tracking-wider">Sync</span>
                    </div>
                    <p className={cn("text-sm font-bold",
                        syncStatus === 'synced' ? "text-primary" :
                        syncStatus === 'syncing' ? "text-blue-400" : "text-red-400"
                    )}>
                        {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Error'}
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-muted-foreground gap-3">
                    <span>
                        Last Update: {digitalTwin?.lastSync ? new Date(digitalTwin.lastSync).toLocaleTimeString() : 'Unavailable'}
                    </span>
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <Settings className="w-3 h-3" />
                        {pendingAlerts.length > 0 ? `${pendingAlerts.length} Alerts` : 'Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
