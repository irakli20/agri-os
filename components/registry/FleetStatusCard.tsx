'use client';

import React from 'react';
import { Plane, Battery, Clock, Wrench } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { DRONES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function FleetStatusCard() {
    return (
        <Widget title="Fleet Status" className="col-span-1">
            <div className="space-y-3">
                {DRONES.map((drone) => (
                    <div
                        key={drone.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                drone.status === 'ready' && "bg-green-500/20",
                                drone.status === 'in-flight' && "bg-blue-500/20",
                                drone.status === 'charging' && "bg-yellow-500/20",
                                drone.status === 'maintenance' && "bg-red-500/20"
                            )}>
                                <Plane className={cn(
                                    "w-5 h-5",
                                    drone.status === 'ready' && "text-green-500",
                                    drone.status === 'in-flight' && "text-blue-500",
                                    drone.status === 'charging' && "text-yellow-500",
                                    drone.status === 'maintenance' && "text-red-500"
                                )} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">{drone.model}</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium",
                                        drone.status === 'ready' && "bg-green-500/20 text-green-400",
                                        drone.status === 'in-flight' && "bg-blue-500/20 text-blue-400",
                                        drone.status === 'charging' && "bg-yellow-500/20 text-yellow-400",
                                        drone.status === 'maintenance' && "bg-red-500/20 text-red-400"
                                    )}>
                                        {drone.status}
                                    </span>
                                </div>
                                {drone.currentTask && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                        {drone.currentTask}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-2">
                            <div className="flex items-center gap-1">
                                <Battery className={cn(
                                    "w-3 h-3",
                                    drone.batteryLevel > 70 && "text-green-400",
                                    drone.batteryLevel > 30 && drone.batteryLevel <= 70 && "text-yellow-400",
                                    drone.batteryLevel <= 30 && "text-red-400"
                                )} />
                                <span className="text-xs font-medium">{drone.batteryLevel}%</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{drone.flightHours}h</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Fleet</span>
                <span className="font-medium">{DRONES.length} Drones</span>
            </div>
        </Widget>
    );
}
