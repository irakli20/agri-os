'use client';

import React from 'react';
import { 
    Droplets, 
    Thermometer, 
    Wind, 
    CloudRain,
    Satellite,
    Cpu,
    MapPin,
    Fuel,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Signal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorFeedProps {
    className?: string;
}

interface SensorCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ComponentType<{ className?: string }>;
    status: 'normal' | 'warning' | 'critical';
    lastUpdate: string;
    trend?: 'up' | 'down' | 'stable';
}

function SensorCard({ title, value, unit, icon: Icon, status, lastUpdate, trend }: SensorCardProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'normal': return 'border-primary/30 bg-primary/10';
            case 'warning': return 'border-amber-500/30 bg-amber-500/10';
            case 'critical': return 'border-red-500/30 bg-red-500/10';
        }
    };

    const getIconColor = () => {
        switch (status) {
            case 'normal': return 'text-primary';
            case 'warning': return 'text-amber-400';
            case 'critical': return 'text-red-400';
        }
    };

    return (
        <div className={cn(
            "p-4 rounded-xl border transition-all duration-200",
            getStatusColor()
        )}>
            <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg bg-white/5", getIconColor())}>
                    <Icon className="w-4 h-4" />
                </div>
                {status !== 'normal' && (
                    <AlertTriangle className={cn("w-4 h-4", 
                        status === 'warning' ? 'text-amber-400' : 'text-red-400'
                    )} />
                )}
            </div>
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
                </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-muted-foreground">{lastUpdate}</span>
                {trend && (
                    <span className={cn(
                        trend === 'up' ? 'text-primary' :
                        trend === 'down' ? 'text-red-400' : 'text-slate-400'
                    )}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                    </span>
                )}
            </div>
        </div>
    );
}

export function SensorFeed({ className }: SensorFeedProps) {
    // Mock sensor data - in real implementation, this would come from the API
    const soilSensors = [
        { id: 'soil-1', title: 'Soil Moisture', value: 68, unit: '%', status: 'normal' as const, lastUpdate: '2 min ago', trend: 'stable' as const },
        { id: 'soil-2', title: 'Soil Temp', value: 18.5, unit: '°C', status: 'normal' as const, lastUpdate: '2 min ago', trend: 'up' as const },
        { id: 'soil-3', title: 'Nitrogen Level', value: 45, unit: 'mg/kg', status: 'warning' as const, lastUpdate: '5 min ago', trend: 'down' as const },
        { id: 'soil-4', title: 'pH Level', value: 6.8, unit: '', status: 'normal' as const, lastUpdate: '10 min ago', trend: 'stable' as const },
    ];

    const weatherSensors = [
        { id: 'air-1', title: 'Air Temp', value: 22.3, unit: '°C', status: 'normal' as const, lastUpdate: '1 min ago', trend: 'up' as const },
        { id: 'air-2', title: 'Humidity', value: 65, unit: '%', status: 'normal' as const, lastUpdate: '1 min ago', trend: 'down' as const },
        { id: 'air-3', title: 'Wind Speed', value: 12, unit: 'km/h', status: 'normal' as const, lastUpdate: '1 min ago', trend: 'stable' as const },
        { id: 'air-4', title: 'Pressure', value: 1013, unit: 'hPa', status: 'normal' as const, lastUpdate: '3 min ago', trend: 'up' as const },
    ];

    const equipment = [
        { id: 'eq-1', name: 'Tractor T-01', location: 'Field 3', fuel: 85, status: 'active' as const },
        { id: 'eq-2', name: 'Harvester H-02', location: 'Field 7', fuel: 42, status: 'maintenance' as const },
        { id: 'eq-3', name: 'Drone D-01', location: 'Base', fuel: 92, status: 'standby' as const },
    ];

    const droneStatus = {
        lastFlight: '2 hours ago',
        nextScheduled: 'Tomorrow 08:00',
        batteryLevel: 87,
        imagesPending: 12,
        coveragePercent: 68,
    };

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Signal className="w-5 h-5 text-secondary" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        Live Sensor Feed
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="w-3 h-3" /> 24 Online
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="flex items-center gap-1 text-amber-400">
                        <AlertTriangle className="w-3 h-3" /> 2 Alerts
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Soil Sensors */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Droplets className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Soil Sensors</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {soilSensors.map((sensor) => (
                            <SensorCard
                                key={sensor.id}
                                title={sensor.title}
                                value={sensor.value}
                                unit={sensor.unit}
                                icon={sensor.title.includes('Moisture') ? Droplets : Thermometer}
                                status={sensor.status}
                                lastUpdate={sensor.lastUpdate}
                                trend={sensor.trend}
                            />
                        ))}
                    </div>
                </div>

                {/* Weather Station */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CloudRain className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Weather Station</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {weatherSensors.map((sensor) => (
                            <SensorCard
                                key={sensor.id}
                                title={sensor.title}
                                value={sensor.value}
                                unit={sensor.unit}
                                icon={
                                    sensor.title.includes('Temp') ? Thermometer :
                                    sensor.title.includes('Humidity') ? Droplets :
                                    sensor.title.includes('Wind') ? Wind : CloudRain
                                }
                                status={sensor.status}
                                lastUpdate={sensor.lastUpdate}
                                trend={sensor.trend}
                            />
                        ))}
                    </div>
                </div>

                {/* Drone Imagery Status */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Satellite className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Drone Imagery</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Last Flight</p>
                                <p className="text-sm font-medium text-white">{droneStatus.lastFlight}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Next Scheduled</p>
                                <p className="text-sm font-medium text-white">{droneStatus.nextScheduled}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Battery Level</span>
                                <span className="text-white">{droneStatus.batteryLevel}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={cn(
                                        "h-full rounded-full",
                                        droneStatus.batteryLevel > 50 ? "bg-primary" : 
                                        droneStatus.batteryLevel > 20 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${droneStatus.batteryLevel}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-xs text-muted-foreground">Images Pending: {droneStatus.imagesPending}</span>
                            <span className="text-xs text-primary">Coverage: {droneStatus.coveragePercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Equipment Telemetry */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Equipment Telemetry</span>
                    </div>
                    <div className="space-y-2">
                        {equipment.map((eq) => (
                            <div key={eq.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-2 h-2 rounded-full",
                                        eq.status === 'active' ? "bg-primary animate-pulse" :
                                        eq.status === 'standby' ? "bg-blue-400" : "bg-amber-400"
                                    )} />
                                    <div>
                                        <p className="text-sm font-medium text-white">{eq.name}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {eq.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Fuel className="w-3 h-3" />
                                        <span className={cn(
                                            eq.fuel < 30 ? "text-red-400" : "text-white"
                                        )}>{eq.fuel}%</span>
                                    </div>
                                    <span className={cn("text-xs px-2 py-0.5 rounded-full",
                                        eq.status === 'active' ? "bg-primary/20 text-primary" :
                                        eq.status === 'standby' ? "bg-blue-500/20 text-blue-400" :
                                        "bg-amber-500/20 text-amber-400"
                                    )}>
                                        {eq.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Live feed • 30s refresh</span>
                </div>
                <button className="text-secondary hover:text-secondary transition-colors">
                    View All Sensors
                </button>
            </div>
        </div>
    );
}
