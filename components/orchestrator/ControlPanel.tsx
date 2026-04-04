'use client';

import React from 'react';
import { useGameStore } from '@/lib/game-store';
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
import { AutomationLevel, OrchestratorStatus } from '@/types/orchestrator';

interface ControlPanelProps {
    className?: string;
}

export function ControlPanel({ className }: ControlPanelProps) {
    const { gameTime } = useGameStore();
    
    // Orchestrator state (mock for now, would come from API in real implementation)
    const [status, setStatus] = React.useState<OrchestratorStatus>('running');
    const [mode, setMode] = React.useState<AutomationLevel>('assisted');
    const [seasonProgress, setSeasonProgress] = React.useState(45);
    const [activeOperations, setActiveOperations] = React.useState(3);
    const [fieldsManaged, setFieldsManaged] = React.useState(8);
    const [pendingDecisions, setPendingDecisions] = React.useState(2);
    const [syncStatus, setSyncStatus] = React.useState<'synced' | 'syncing' | 'error'>('synced');

    const toggleStatus = () => {
        setStatus(prev => prev === 'running' ? 'paused' : 'running');
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
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200",
                        status === 'running' 
                            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30" 
                            : "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
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
                                onClick={() => setMode(m)}
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Update: 2 min ago</span>
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <Settings className="w-3 h-3" />
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
