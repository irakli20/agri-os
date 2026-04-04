'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
    generateHourlyForecast,
    getSprayWindows,
    WEATHER_ALERTS,
    DROUGHT_PREDICTION,
    type HourlyForecast
} from '@/lib/weather-data';
import {
    Cloud,
    CloudRain,
    Wind,
    Droplets,
    Sun,
    Thermometer,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Sprout,
    Zap,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

export default function WeatherPage() {
    const [selectedDay, setSelectedDay] = useState(0);
    const hourlyForecast = useMemo(() => generateHourlyForecast(), []);
    const sprayWindows = useMemo(() => getSprayWindows(hourlyForecast), [hourlyForecast]);

    const getSprayScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400 bg-green-500/20';
        if (score >= 70) return 'text-blue-400 bg-blue-500/20';
        if (score >= 50) return 'text-yellow-400 bg-yellow-500/20';
        if (score >= 30) return 'text-orange-400 bg-orange-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getSprayScoreLabel = (score: number) => {
        if (score >= 90) return 'Ideal';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Acceptable';
        if (score >= 30) return 'Poor';
        return 'Not Recommended';
    };

    return (
        <AppShell>
            <div className="page-shell">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <p className="page-header-meta">Agronomic Weather</p>
                        <h1 className="text-3xl font-bold">Weather Intelligence</h1>
                        <p className="text-muted-foreground mt-1">
                            Hourly forecasts, spray windows, and agricultural insights
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="glass-panel rounded-lg px-4 py-2">
                            <div className="text-xs text-muted-foreground">Last Updated</div>
                            <div className="text-sm font-medium">{new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>

                {/* Weather Alerts */}
                {WEATHER_ALERTS.length > 0 && (
                    <div className="space-y-2">
                        {WEATHER_ALERTS.map(alert => (
                            <div key={alert.id} className="card-soft rounded-2xl p-4 border-l-4 border-yellow-500">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{alert.title}</h3>
                                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium uppercase">
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Spray Windows Timeline */}
                {sprayWindows.length > 0 && (
                    <div className="card-soft rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sprout className="w-5 h-5 text-green-400" />
                            <h2 className="text-lg font-semibold">Optimal Spray Windows</h2>
                        </div>
                        <div className="space-y-3">
                            {sprayWindows[0]?.windows.map((window, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-32 text-sm font-medium">
                                        {window.start} - {window.end}
                                    </div>
                                    <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                                        <div
                                            className={cn(
                                                "h-full flex items-center px-3 text-sm font-medium",
                                                window.score >= 90 ? "bg-green-500/30 text-green-400" :
                                                    window.score >= 70 ? "bg-blue-500/30 text-blue-400" :
                                                        "bg-yellow-500/30 text-yellow-400"
                                            )}
                                            style={{ width: `${window.score}%` }}
                                        >
                                            {window.reason}
                                        </div>
                                    </div>
                                    <div className="w-16 text-right text-sm font-bold">
                                        {window.score}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hourly Forecast Table */}
                <div className="card-soft rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-semibold">24-Hour Forecast</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Header */}
                            <div className="grid grid-cols-8 gap-4 p-4 border-b border-white/10 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-white/5">
                                <div>Time</div>
                                <div>Temp</div>
                                <div>Feels Like</div>
                                <div>Wind</div>
                                <div>Humidity</div>
                                <div>Precip</div>
                                <div>UV Index</div>
                                <div>Spray Score</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-white/5">
                                {hourlyForecast.map((hour, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-8 gap-4 p-4 hover:bg-white/5 transition-colors animate-slide-up-fade items-center"
                                        style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
                                    >
                                        <div className="text-sm font-medium">
                                            {new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </div>
                                        <div className="text-sm font-bold flex items-center gap-2">
                                            <Thermometer className="w-4 h-4 text-orange-400" />
                                            {hour.temp}°F
                                        </div>
                                        <div className="text-sm text-muted-foreground">{hour.feelsLike}°F</div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Wind className="w-4 h-4 text-blue-400" />
                                            {hour.windSpeed} <span className="text-xs text-muted-foreground">{hour.windDirection}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Droplets className="w-4 h-4 text-secondary" />
                                            {hour.humidity}%
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            {hour.precipitation > 0 ? (
                                                <>
                                                    <CloudRain className="w-4 h-4 text-blue-400" />
                                                    {hour.precipitation}%
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <Sun className="w-4 h-4 text-yellow-400" />
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-xs font-medium",
                                                    hour.uvIndex > 7 ? 'bg-red-500/20 text-red-400' :
                                                        hour.uvIndex > 5 ? 'bg-orange-500/20 text-orange-400' :
                                                            hour.uvIndex > 2 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-green-500/20 text-green-400'
                                                )}>
                                                    {hour.uvIndex}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        getSprayScoreColor(hour.sprayScore || 0).replace('text-', 'bg-').replace('-400', '-500')
                                                    )}
                                                    style={{ width: `${hour.sprayScore || 0}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-xs font-bold", getSprayScoreColor(hour.sprayScore || 0))}>
                                                {hour.sprayScore || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agricultural Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Drought Prediction */}
                    <div className="card-soft rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            <h3 className="font-semibold">Drought Prediction</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Week</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                                            style={{ width: `${DROUGHT_PREDICTION.weekAhead}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{DROUGHT_PREDICTION.weekAhead}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Month</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                            style={{ width: `${DROUGHT_PREDICTION.monthAhead}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{DROUGHT_PREDICTION.monthAhead}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">This Season</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                            style={{ width: `${DROUGHT_PREDICTION.seasonAhead}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{DROUGHT_PREDICTION.seasonAhead}%</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                                <div className="font-medium text-blue-400 mb-1">Recommendation</div>
                                <p className="text-muted-foreground">{DROUGHT_PREDICTION.recommendation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card-soft rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="w-5 h-5 text-purple-400" />
                            <h3 className="font-semibold">Today&apos;s Conditions</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">High / Low</div>
                                <div className="text-lg font-bold">
                                    {Math.max(...hourlyForecast.map(h => h.temperature))}° / {Math.min(...hourlyForecast.map(h => h.temperature))}°
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Avg Wind</div>
                                <div className="text-lg font-bold">
                                    {Math.round(hourlyForecast.reduce((sum, h) => sum + h.windSpeed, 0) / hourlyForecast.length)} mph
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Avg Humidity</div>
                                <div className="text-lg font-bold">
                                    {Math.round(hourlyForecast.reduce((sum, h) => sum + h.humidity, 0) / hourlyForecast.length)}%
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Peak UV</div>
                                <div className="text-lg font-bold">
                                    {Math.max(...hourlyForecast.map(h => h.uvIndex))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
