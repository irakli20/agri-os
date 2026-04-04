'use client';

import { AppShell } from '@/components/layout/AppShell';
import { DRONES, TASKS, RECENT_FLIGHTS, FIELDS } from '@/lib/mock-data';
import { Battery, Clock, Wrench, Plane, AlertCircle, CheckCircle2, TrendingUp, ShoppingCart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/lib/game-store';
import Link from 'next/link';

export default function FleetPage() {
    const { gameMode, equipment: gameEquipment } = useGameStore();

    // Use game equipment if in game mode, otherwise use mock drones
    const activeFleet = gameMode ? gameEquipment : DRONES;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'text-green-400 bg-green-500/20';
            case 'in-flight': return 'text-blue-400 bg-blue-500/20';
            case 'charging': return 'text-yellow-400 bg-yellow-500/20';
            case 'maintenance': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getDroneTasks = (droneId: string) => gameMode ? [] : TASKS.filter(t => t.droneId === droneId);
    const getDroneFlights = (droneId: string) => gameMode ? [] : RECENT_FLIGHTS.filter(f => f.droneId === droneId);

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="card-soft rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Fleet Management</h1>
                        <p className="text-muted-foreground mt-1">
                            {gameMode
                                ? `Manage your owned machinery and drones (${activeFleet.length})`
                                : `Monitor and manage ${DRONES.length} drones across your operation`}
                        </p>
                    </div>
                    {gameMode ? (
                        <Link
                            href="/game/marketplace/equipment"
                            className="cta-primary text-sm inline-flex items-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Buy Equipment
                        </Link>
                    ) : (
                        <button className="cta-primary text-sm inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Drone
                        </button>
                    )}
                </div>

                {activeFleet.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Plane className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Equipment Owned</h2>
                        <p className="text-muted-foreground mb-6 text-center max-w-sm">
                            You haven&apos;t purchased any drones or machinery yet. Visit the marketplace to start building your fleet.
                        </p>
                        <Link
                            href="/game/marketplace/equipment"
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Open Marketplace
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Fleet Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="card-soft rounded-2xl p-4 elevate-card">
                                <div className="text-sm text-muted-foreground mb-1">Total Assets</div>
                                <div className="text-2xl font-bold text-primary">
                                    {activeFleet.length}
                                </div>
                            </div>
                            <div className="card-soft rounded-2xl p-4 elevate-card">
                                <div className="text-sm text-muted-foreground mb-1">Ready Status</div>
                                <div className="text-2xl font-bold text-green-400">
                                    {gameMode ? activeFleet.length : activeFleet.filter(d => d.status === 'ready').length}
                                </div>
                            </div>
                            <div className="card-soft rounded-2xl p-4 elevate-card">
                                <div className="text-sm text-muted-foreground mb-1">Maint. Cost/Wk</div>
                                <div className="text-2xl font-bold text-red-400">
                                    ${gameMode ? (activeFleet as any[]).reduce((sum, e) => sum + (e.maintainanceCostPerWeek || 0), 0) : '0'}
                                </div>
                            </div>
                            <div className="card-soft rounded-2xl p-4 elevate-card">
                                <div className="text-sm text-muted-foreground mb-1">Tech Efficiency</div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {gameMode ? 'A+' : (Math.round(DRONES.reduce((sum, d) => sum + d.batteryLevel, 0) / DRONES.length) + '%')}
                                </div>
                            </div>
                        </div>

                        {/* Drones/Machinery Grid */}
                        <div className="space-y-4">
                            {activeFleet.map((item: any) => {
                                const tasks = getDroneTasks(item.id);
                                const flights = getDroneFlights(item.id);
                                const status = gameMode ? 'ready' : (item.status || 'ready');

                                return (
                                    <div
                                        key={item.id}
                                        className="card-soft rounded-2xl p-6 transition-all border border-white/5 elevate-card"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-16 h-16 rounded-xl flex items-center justify-center",
                                                    status === 'ready' && "bg-green-500/20",
                                                    status === 'in-flight' && "bg-blue-500/20",
                                                    status === 'charging' && "bg-yellow-500/20",
                                                    status === 'maintenance' && "bg-red-500/20"
                                                )}>
                                                    {gameMode ? (
                                                        <span className="text-3xl">{item.icon}</span>
                                                    ) : (
                                                        <Plane className={cn(
                                                            "w-8 h-8",
                                                            status === 'ready' && "text-green-400",
                                                            status === 'in-flight' && "text-blue-400",
                                                            status === 'charging' && "text-yellow-400",
                                                            status === 'maintenance' && "text-red-400"
                                                        )} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                                                        {gameMode ? item.category : 'Drone'}
                                                    </div>
                                                    <h3 className="text-xl font-semibold">{gameMode ? item.name : item.model}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {gameMode ? item.description : (item.currentTask || 'No active task')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                                                getStatusColor(status)
                                            )}>
                                                {status}
                                            </span>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            {gameMode ? (
                                                <>
                                                    {Object.entries(item.specs || {}).map(([key, value]: [string, any]) => (
                                                        <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xs text-muted-foreground capitalize">{key}</span>
                                                            </div>
                                                            <div className="text-xl font-bold">{value}</div>
                                                        </div>
                                                    ))}
                                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Wrench className="w-4 h-4 text-red-400" />
                                                            <span className="text-xs text-muted-foreground">Maint./Week</span>
                                                        </div>
                                                        <div className="text-xl font-bold text-red-400">-${item.maintainanceCostPerWeek}</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-white/5 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Battery className={cn(
                                                                "w-4 h-4",
                                                                item.batteryLevel > 70 && "text-green-400",
                                                                item.batteryLevel > 30 && item.batteryLevel <= 70 && "text-yellow-400",
                                                                item.batteryLevel <= 30 && "text-red-400"
                                                            )} />
                                                            <span className="text-xs text-muted-foreground">Battery</span>
                                                        </div>
                                                        <div className="text-2xl font-bold">{item.batteryLevel}%</div>
                                                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full",
                                                                    item.batteryLevel > 70 && "bg-green-500",
                                                                    item.batteryLevel > 30 && item.batteryLevel <= 70 && "bg-yellow-500",
                                                                    item.batteryLevel <= 30 && "bg-red-500"
                                                                )}
                                                                style={{ width: `${item.batteryLevel}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Clock className="w-4 h-4 text-blue-400" />
                                                            <span className="text-xs text-muted-foreground">Flight Hours</span>
                                                        </div>
                                                        <div className="text-2xl font-bold">{item.flightHours}h</div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                            <span className="text-xs text-muted-foreground">Flights</span>
                                                        </div>
                                                        <div className="text-2xl font-bold">{flights.length}</div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Wrench className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">Last Service</span>
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {new Date(item.lastMaintenance).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Assigned Tasks (Non-game mode only for now) */}
                                        {!gameMode && tasks.length > 0 && (
                                            <div className="border-t border-white/10 pt-4">
                                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Assigned Tasks ({tasks.length})</h4>
                                                <div className="space-y-2">
                                                    {tasks.slice(0, 3).map((task) => (
                                                        <div key={task.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "w-2 h-2 rounded-full",
                                                                    task.priority === 'high' && "bg-red-400",
                                                                    task.priority === 'medium' && "bg-yellow-400",
                                                                    task.priority === 'low' && "bg-blue-400"
                                                                )} />
                                                                <span className="text-sm">{task.description}</span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(task.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
