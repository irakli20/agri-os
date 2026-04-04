'use client';

import React from 'react';
import { Plane, Battery, Clock, Wrench, Plus, ShoppingCart } from 'lucide-react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { DRONES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/lib/game-store';
import Link from 'next/link';

export function FleetStatusCard() {
    const { gameMode, equipment: gameEquipment } = useGameStore();

    // Use game equipment if in game mode, otherwise use mock drones
    const activeFleet = gameMode ? gameEquipment : DRONES;

    return (
        <Widget title="Fleet Status" className="col-span-1">
            <div className="space-y-3">
                {activeFleet.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">No assets owned. Start building your fleet.</p>
                        <Link
                            href="/game/marketplace/equipment"
                            className="text-[10px] px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all font-bold uppercase tracking-wider"
                        >
                            Open Marketplace
                        </Link>
                    </div>
                ) : (
                    activeFleet.map((item: any) => {
                        const status = item.status || 'ready';
                        const name = gameMode ? item.name : item.model;
                        const icon = gameMode ? <span>{item.icon}</span> : <Plane className={cn(
                            "w-5 h-5",
                            status === 'ready' && "text-green-500",
                            status === 'in-flight' && "text-blue-500",
                            status === 'charging' && "text-yellow-500",
                            status === 'maintenance' && "text-red-500"
                        )} />;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        status === 'ready' && "bg-green-500/20",
                                        status === 'in-flight' && "bg-blue-500/20",
                                        status === 'charging' && "bg-yellow-500/20",
                                        status === 'maintenance' && "bg-red-500/20"
                                    )}>
                                        {icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium truncate">{name}</span>
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium",
                                                status === 'ready' && "bg-green-500/20 text-green-400",
                                                status === 'in-flight' && "bg-blue-500/20 text-blue-400",
                                                status === 'charging' && "bg-yellow-500/20 text-yellow-400",
                                                status === 'maintenance' && "bg-red-500/20 text-red-400"
                                            )}>
                                                {status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                            {gameMode ? item.category : (item.currentTask || 'No active task')}
                                        </p>
                                    </div>
                                </div>

                                {!gameMode && (
                                    <div className="flex items-center gap-3 ml-2">
                                        <div className="flex items-center gap-1">
                                            <Battery className={cn(
                                                "w-3 h-3",
                                                item.batteryLevel > 70 && "text-green-400",
                                                item.batteryLevel > 30 && item.batteryLevel <= 70 && "text-yellow-400",
                                                item.batteryLevel <= 30 && "text-red-400"
                                            )} />
                                            <span className="text-xs font-medium">{item.batteryLevel}%</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{item.flightHours}h</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{gameMode ? 'Owned Assets' : 'Total Fleet'}</span>
                <span className="font-medium">{activeFleet.length} {gameMode ? 'Items' : 'Drones'}</span>
            </div>
        </Widget>
    );
}

