import { AppShell } from '@/components/layout/AppShell';
import { DRONES, TASKS, RECENT_FLIGHTS, FIELDS } from '@/lib/mock-data';
import { Battery, Clock, Wrench, Plane, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FleetPage() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'text-green-400 bg-green-500/20';
            case 'in-flight': return 'text-blue-400 bg-blue-500/20';
            case 'charging': return 'text-yellow-400 bg-yellow-500/20';
            case 'maintenance': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getDroneTasks = (droneId: string) => TASKS.filter(t => t.droneId === droneId);
    const getDroneFlights = (droneId: string) => RECENT_FLIGHTS.filter(f => f.droneId === droneId);

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Fleet Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor and manage {DRONES.length} drones across your operation
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        + Add Drone
                    </button>
                </div>

                {/* Fleet Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Ready to Fly</div>
                        <div className="text-2xl font-bold text-green-400">
                            {DRONES.filter(d => d.status === 'ready').length}
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">In Flight</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {DRONES.filter(d => d.status === 'in-flight').length}
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Flight Hours</div>
                        <div className="text-2xl font-bold">
                            {DRONES.reduce((sum, d) => sum + d.flightHours, 0)}h
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Avg. Battery</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {Math.round(DRONES.reduce((sum, d) => sum + d.batteryLevel, 0) / DRONES.length)}%
                        </div>
                    </div>
                </div>

                {/* Drones Grid */}
                <div className="space-y-4">
                    {DRONES.map((drone) => {
                        const tasks = getDroneTasks(drone.id);
                        const flights = getDroneFlights(drone.id);

                        return (
                            <div
                                key={drone.id}
                                className="glass-panel rounded-xl p-6 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-16 h-16 rounded-xl flex items-center justify-center",
                                            drone.status === 'ready' && "bg-green-500/20",
                                            drone.status === 'in-flight' && "bg-blue-500/20",
                                            drone.status === 'charging' && "bg-yellow-500/20",
                                            drone.status === 'maintenance' && "bg-red-500/20"
                                        )}>
                                            <Plane className={cn(
                                                "w-8 h-8",
                                                drone.status === 'ready' && "text-green-400",
                                                drone.status === 'in-flight' && "text-blue-400",
                                                drone.status === 'charging' && "text-yellow-400",
                                                drone.status === 'maintenance' && "text-red-400"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{drone.model}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {drone.currentTask || 'No active task'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                                        getStatusColor(drone.status)
                                    )}>
                                        {drone.status}
                                    </span>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Battery className={cn(
                                                "w-4 h-4",
                                                drone.batteryLevel > 70 && "text-green-400",
                                                drone.batteryLevel > 30 && drone.batteryLevel <= 70 && "text-yellow-400",
                                                drone.batteryLevel <= 30 && "text-red-400"
                                            )} />
                                            <span className="text-xs text-muted-foreground">Battery</span>
                                        </div>
                                        <div className="text-2xl font-bold">{drone.batteryLevel}%</div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full",
                                                    drone.batteryLevel > 70 && "bg-green-500",
                                                    drone.batteryLevel > 30 && drone.batteryLevel <= 70 && "bg-yellow-500",
                                                    drone.batteryLevel <= 30 && "bg-red-500"
                                                )}
                                                style={{ width: `${drone.batteryLevel}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-muted-foreground">Flight Hours</span>
                                        </div>
                                        <div className="text-2xl font-bold">{drone.flightHours}h</div>
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
                                            {new Date(drone.lastMaintenance).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Assigned Tasks */}
                                {tasks.length > 0 && (
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
            </div>
        </AppShell>
    );
}
