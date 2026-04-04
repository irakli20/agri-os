'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudDrizzle, Settings, Clock, Sprout, ArrowRight, Calendar, CloudSun, Brain } from 'lucide-react';
import { PredictiveAnalyticsModal } from '@/components/modals/PredictiveAnalyticsModal';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { WEATHER } from '@/lib/mock-data';
import { generateHourlyForecast, getSprayWindows } from '@/lib/weather-data';
import { WeatherAlertConfigModal } from '@/components/modals/WeatherAlertConfigModal';
import { cn } from '@/lib/utils';

export function WeatherCard() {
    const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);
    const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
    const hourlyForecast = generateHourlyForecast();
    const sprayWindows = getSprayWindows(hourlyForecast);

    const getWeatherIcon = (condition: string) => {
        if (condition.includes('Rain')) return CloudRain;
        if (condition.includes('Cloudy')) return Cloud;
        if (condition.includes('Drizzle')) return CloudDrizzle;
        return Sun;
    };

    const WeatherIcon = getWeatherIcon(WEATHER.current.condition);
    const isSafeForSpraying = WEATHER.current.windSpeed < 10 && WEATHER.current.precipitation === 0;

    // Get next 6 hours for preview
    const nextHours = hourlyForecast.slice(0, 6);

    // Get next optimal spray window from today's windows
    const todayWindows = sprayWindows[0]?.windows || [];
    const nextSprayWindow = todayWindows.find(w => w.score >= 80);

    const getSprayScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-blue-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <>
            <Widget
                title="Weather Intelligence"
                icon={CloudSun}
                action={
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsPredictiveOpen(true)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            title="Predictive Analytics"
                        >
                            <Brain className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsAlertConfigOpen(true)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                }
            >
                <div className="group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-1 -m-1">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="text-3xl font-bold">{WEATHER.current.temp}°F</div>
                                <WeatherIcon className="w-8 h-8 text-yellow-400 animate-float" />
                            </div>
                            <div className="text-sm text-muted-foreground">{WEATHER.current.condition}</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 justify-end mb-1">
                                <div className={cn(
                                    "w-2 h-2 rounded-full animate-pulse-soft",
                                    isSafeForSpraying ? "bg-green-400" : "bg-red-400"
                                )} />
                                <span className={cn(
                                    "text-xs font-medium",
                                    isSafeForSpraying ? "text-green-400" : "text-red-400"
                                )}>
                                    {isSafeForSpraying ? "Safe to Spray" : "No Spray"}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Wind: {WEATHER.current.windSpeed} mph
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                            <Wind className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium">{WEATHER.current.windSpeed} mph</span>
                            <span className="text-[10px] text-muted-foreground">Wind</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium">{WEATHER.current.humidity}%</span>
                            <span className="text-[10px] text-muted-foreground">Humidity</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5">
                            <CloudRain className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium">{WEATHER.current.precipitation}%</span>
                            <span className="text-[10px] text-muted-foreground">Precip</span>
                        </div>
                    </div>

                    {/* Spray Window Indicator */}
                    {nextSprayWindow && (
                        <div className="mb-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Sprout className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-green-400 mb-1">Next Spray Window</div>
                                    <div className="text-[11px] text-muted-foreground">
                                        {nextSprayWindow.start} - {nextSprayWindow.end}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            nextSprayWindow.score >= 90 ? 'bg-green-400' : 'bg-blue-400'
                                        )} />
                                        <span className="text-[10px]">{nextSprayWindow.reason}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hourly Preview */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Next 6 Hours</span>
                            <Link href="/weather" className="flex items-center gap-1 hover:text-foreground transition-colors group/link">
                                Details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {nextHours.map((hour, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 min-w-[40px]">
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(hour.time).toLocaleTimeString([], { hour: 'numeric' })}
                                    </span>
                                    <span className="text-[10px] font-medium">{hour.temperature}°</span>
                                    <div className={cn(
                                        "w-1.5 h-8 rounded-full bg-white/10 relative overflow-hidden",
                                        "after:absolute after:bottom-0 after:left-0 after:right-0 after:bg-current",
                                        getSprayScoreColor(hour.sprayScore ?? 0)
                                    )} style={{
                                        '--tw-text-opacity': 1,
                                        color: 'currentColor'
                                    } as any}>
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-current opacity-50"
                                            style={{ height: `${hour.sprayScore ?? 0}%` }}
                                        />
                                    </div>
                                    <div className={cn(
                                        "w-1 h-1 rounded-full",
                                        (hour.sprayScore ?? 0) >= 80 ? 'bg-green-400' :
                                            (hour.sprayScore ?? 0) >= 60 ? 'bg-blue-400' :
                                                (hour.sprayScore ?? 0) >= 40 ? 'bg-yellow-400' :
                                                    'bg-red-400'
                                    )} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Widget>

            <WeatherAlertConfigModal
                isOpen={isAlertConfigOpen}
                onClose={() => setIsAlertConfigOpen(false)}
                onSubmit={(config) => {
                    console.log('Weather alert config saved:', config);
                }}
            />

            <PredictiveAnalyticsModal
                isOpen={isPredictiveOpen}
                onClose={() => setIsPredictiveOpen(false)}
                onScheduleTreatment={(prediction) => {
                    console.log('Schedule treatment for:', prediction);
                    setIsPredictiveOpen(false);
                }}
            />
        </>
    );
}
