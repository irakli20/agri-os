'use client';

import React from 'react';
import { 
    Calendar,
    Sprout,
    Leaf,
    Sun,
    Wheat,
    CheckCircle2,
    Clock,
    CloudSun,
    CloudRain,
    Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/lib/game-store';

interface SeasonTimelineProps {
    className?: string;
}

interface TimelinePhase {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    weekStart: number;
    weekEnd: number;
}

interface Operation {
    id: string;
    name: string;
    week: number;
    completed: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

interface WeatherForecast {
    week: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    tempHigh: number;
    tempLow: number;
    precipitation: number;
}

export function SeasonTimeline({ className }: SeasonTimelineProps) {
    const { gameTime } = useGameStore();
    const currentWeek = (gameTime?.year || 1) * 48 + getSeasonOffset(gameTime?.season) + (gameTime?.week || 1);

    function getSeasonOffset(season?: string): number {
        switch (season) {
            case 'Spring': return 0;
            case 'Summer': return 12;
            case 'Autumn': return 24;
            case 'Winter': return 36;
            default: return 0;
        }
    }

    const phases: TimelinePhase[] = [
        { id: 'prep', name: 'Preparation', icon: Sprout, color: 'bg-primary', weekStart: 1, weekEnd: 8 },
        { id: 'plant', name: 'Planting', icon: Leaf, color: 'bg-blue-500', weekStart: 9, weekEnd: 16 },
        { id: 'grow', name: 'Growing', icon: Sun, color: 'bg-amber-500', weekStart: 17, weekEnd: 36 },
        { id: 'harvest', name: 'Harvest', icon: Wheat, color: 'bg-orange-500', weekStart: 37, weekEnd: 44 },
        { id: 'rest', name: 'Post-Harvest', icon: Clock, color: 'bg-slate-500', weekStart: 45, weekEnd: 48 },
    ];

    const operations: Operation[] = [
        { id: 'op-1', name: 'Soil Test', week: 2, completed: true, icon: CheckCircle2 },
        { id: 'op-2', name: 'Plowing', week: 4, completed: true, icon: CheckCircle2 },
        { id: 'op-3', name: 'Fertilizing', week: 6, completed: true, icon: CheckCircle2 },
        { id: 'op-4', name: 'Tilling', week: 8, completed: true, icon: CheckCircle2 },
        { id: 'op-5', name: 'Planting', week: 10, completed: true, icon: CheckCircle2 },
        { id: 'op-6', name: 'Irrigation', week: 18, completed: false, icon: Clock },
        { id: 'op-7', name: 'Pest Control', week: 24, completed: false, icon: Clock },
        { id: 'op-8', name: 'Top Dress', week: 28, completed: false, icon: Clock },
        { id: 'op-9', name: 'Scouting', week: 32, completed: false, icon: Clock },
        { id: 'op-10', name: 'Pre-Harvest', week: 38, completed: false, icon: Clock },
        { id: 'op-11', name: 'Harvest', week: 40, completed: false, icon: Clock },
    ];

    const forecast: WeatherForecast[] = [
        { week: currentWeek + 1, condition: 'sunny', tempHigh: 24, tempLow: 15, precipitation: 0 },
        { week: currentWeek + 2, condition: 'cloudy', tempHigh: 22, tempLow: 14, precipitation: 10 },
        { week: currentWeek + 3, condition: 'rainy', tempHigh: 19, tempLow: 12, precipitation: 45 },
        { week: currentWeek + 4, condition: 'sunny', tempHigh: 25, tempLow: 16, precipitation: 5 },
    ];

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'sunny': return Sun;
            case 'cloudy': return CloudSun;
            case 'rainy': return CloudRain;
            case 'windy': return Wind;
            default: return Sun;
        }
    };

    const getCurrentPhase = () => {
        const weekInYear = ((currentWeek - 1) % 48) + 1;
        return phases.find(p => weekInYear >= p.weekStart && weekInYear <= p.weekEnd) || phases[0];
    };

    const currentPhase = getCurrentPhase();
    const weekInYear = ((currentWeek - 1) % 48) + 1;
    const seasonProgress = ((weekInYear - 1) / 48) * 100;

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        Season Timeline
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Year {gameTime?.year || 1}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-amber-400 font-medium">{gameTime?.season || 'Spring'}</span>
                    <span className="text-muted-foreground">Week {gameTime?.week || 1}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Timeline Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Season Progress</span>
                        <span className="text-white font-medium">{Math.round(seasonProgress)}%</span>
                    </div>
                    
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                        {/* Phase backgrounds */}
                        <div className="absolute inset-0 flex">
                            {phases.map((phase) => (
                                <div
                                    key={phase.id}
                                    className={cn("h-full opacity-20", phase.color)}
                                    style={{ 
                                        width: `${((phase.weekEnd - phase.weekStart + 1) / 48) * 100}%` 
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Progress bar */}
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-blue-500 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${seasonProgress}%` }}
                        />
                        
                        {/* Current marker */}
                        <div 
                            className="absolute top-0 w-1 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{ left: `${seasonProgress}%` }}
                        />
                    </div>

                    {/* Phase labels */}
                    <div className="flex justify-between text-xs">
                        {phases.map((phase) => {
                            const Icon = phase.icon;
                            const isActive = phase.id === currentPhase.id;
                            return (
                                <div 
                                    key={phase.id}
                                    className={cn("flex flex-col items-center gap-1 transition-all",
                                        isActive ? "text-white scale-110" : "text-muted-foreground"
                                    )}
                                >
                                    <div className={cn("p-1.5 rounded-lg", 
                                        isActive ? phase.color : "bg-white/10"
                                    )}>
                                        <Icon className="w-3 h-3" />
                                    </div>
                                    <span className={isActive ? "font-medium" : ""}>{phase.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Operations */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Operations</span>
                    </div>
                    
                    <div className="space-y-2">
                        {operations.map((op) => {
                            const Icon = op.icon;
                            const isPast = op.week < weekInYear;
                            const isCurrent = op.week === weekInYear;
                            
                            return (
                                <div 
                                    key={op.id}
                                    className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all",
                                        op.completed 
                                            ? "bg-primary/10 border-primary/30" 
                                            : isCurrent
                                                ? "bg-amber-500/10 border-amber-500/30"
                                                : "bg-white/5 border-white/10"
                                    )}
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                                        op.completed ? "bg-primary/20 text-primary" :
                                        isCurrent ? "bg-amber-500/20 text-amber-400 animate-pulse" :
                                        "bg-white/10 text-slate-400"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-medium",
                                            op.completed || isCurrent ? "text-white" : "text-slate-300"
                                        )}>
                                            {op.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Week {op.week}
                                        </p>
                                    </div>
                                    
                                    {op.completed && (
                                        <span className="text-xs text-primary">Completed</span>
                                    )}
                                    {isCurrent && !op.completed && (
                                        <span className="text-xs text-amber-400">Current</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weather Forecast */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CloudSun className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">4-Week Forecast</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                        {forecast.map((day, idx) => {
                            const WeatherIcon = getWeatherIcon(day.condition);
                            return (
                                <div 
                                    key={idx}
                                    className="bg-white/5 rounded-lg p-3 text-center space-y-2"
                                >
                                    <span className="text-xs text-muted-foreground">W+{idx + 1}</span>
                                    
                                    <div className="flex justify-center">
                                        <WeatherIcon className={cn("w-6 h-6",
                                            day.condition === 'sunny' ? "text-amber-400" :
                                            day.condition === 'rainy' ? "text-blue-400" :
                                            day.condition === 'cloudy' ? "text-slate-400" :
                                            "text-secondary"
                                        )} />
                                    </div>
                                    
                                    <div className="text-xs">
                                        <p className="text-white">{day.tempHigh}°/{day.tempLow}°</p>
                                        {day.precipitation > 0 && (
                                            <p className="text-blue-400">{day.precipitation}mm</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
