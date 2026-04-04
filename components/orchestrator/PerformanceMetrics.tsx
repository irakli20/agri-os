'use client';

import React from 'react';
import { 
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Brain,
    Download,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetricsProps {
    className?: string;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    trend: number;
    trendLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

function MetricCard({ title, value, unit, trend, trendLabel, icon: Icon, color }: MetricCardProps) {
    const getTrendIcon = () => {
        if (trend > 0) return ArrowUpRight;
        if (trend < 0) return ArrowDownRight;
        return Minus;
    };
    
    const TrendIcon = getTrendIcon();
    
    return (
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", color)}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={cn("flex items-center gap-1 text-xs",
                    trend > 0 ? "text-primary" : trend < 0 ? "text-red-400" : "text-slate-400"
                )}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            
            <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
                </div>
            </div>
            
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
        </div>
    );
}

export function PerformanceMetrics({ className }: PerformanceMetricsProps) {
    // Mock metrics data
    const metrics = {
        yieldPrediction: { value: 94, trend: 3.2, trendLabel: 'vs last season' },
        weatherAccuracy: { value: 87, trend: 1.5, trendLabel: 'vs last month' },
        marketPrediction: { value: 91, trend: -0.8, trendLabel: 'vs last quarter' },
        aiVsManualROI: { value: 156, trend: 12.4, trendLabel: 'AI outperformance' },
        costSavings: { value: 28450, trend: 8.3, trendLabel: 'YTD savings' },
        learningProgress: { value: 78, trend: 4.2, trendLabel: 'Model improvement' },
    };

    const roiComparison = [
        { category: 'Yield', ai: 8500, manual: 7200 },
        { category: 'Input Costs', ai: 3200, manual: 4100 },
        { category: 'Labor', ai: 1800, manual: 2400 },
        { category: 'Total ROI', ai: 3500, manual: 700 },
    ];

    const predictions = [
        { metric: 'Crop Yield', predicted: 8.5, actual: 8.2, accuracy: 96 },
        { metric: 'Rainfall', predicted: 125, actual: 118, accuracy: 94 },
        { metric: 'Market Price', predicted: 245, actual: 238, accuracy: 97 },
        { metric: 'Input Costs', predicted: 3200, actual: 3350, accuracy: 95 },
    ];

    const generateReport = () => {
        // Would trigger report download
        console.log('Generating performance report...');
    };

    return (
        <div className={cn(
            "h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        AI Performance
                    </h3>
                </div>
                <button 
                    onClick={generateReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export Report
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                        title="Yield Prediction"
                        value={metrics.yieldPrediction.value}
                        unit="%"
                        trend={metrics.yieldPrediction.trend}
                        trendLabel={metrics.yieldPrediction.trendLabel}
                        icon={Target}
                        color="bg-primary/20"
                    />
                    <MetricCard
                        title="Weather Accuracy"
                        value={metrics.weatherAccuracy.value}
                        unit="%"
                        trend={metrics.weatherAccuracy.trend}
                        trendLabel={metrics.weatherAccuracy.trendLabel}
                        icon={TrendingUp}
                        color="bg-blue-500/20"
                    />
                    <MetricCard
                        title="AI vs Manual ROI"
                        value={`+${metrics.aiVsManualROI.value}`}
                        unit="%"
                        trend={metrics.aiVsManualROI.trend}
                        trendLabel={metrics.aiVsManualROI.trendLabel}
                        icon={Award}
                        color="bg-violet-500/20"
                    />
                    <MetricCard
                        title="Cost Savings"
                        value={`$${metrics.costSavings.value.toLocaleString()}`}
                        trend={metrics.costSavings.trend}
                        trendLabel={metrics.costSavings.trendLabel}
                        icon={DollarSign}
                        color="bg-amber-500/20"
                    />
                </div>

                {/* Prediction Accuracy Chart */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Brain className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Prediction Accuracy</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        {predictions.map((pred) => (
                            <div key={pred.metric} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white">{pred.metric}</span>
                                    <span className="text-primary font-mono">{pred.accuracy}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full transition-all duration-500",
                                            pred.accuracy >= 95 ? "bg-primary" :
                                            pred.accuracy >= 90 ? "bg-blue-500" : "bg-amber-500"
                                        )}
                                        style={{ width: `${pred.accuracy}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Predicted: {pred.predicted}</span>
                                    <span>Actual: {pred.actual}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROI Comparison */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">AI vs Manual ROI</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-muted-foreground">
                            <span>Category</span>
                            <span className="text-center">AI ($)</span>
                            <span className="text-center">Manual ($)</span>
                        </div>
                        
                        {roiComparison.map((item) => (
                            <div key={item.category} className="grid grid-cols-3 gap-2 py-2 border-b border-white/5 last:border-0">
                                <span className="text-sm text-white">{item.category}</span>
                                <span className="text-center text-sm font-mono text-primary">{item.ai.toLocaleString()}</span>
                                <span className="text-center text-sm font-mono text-slate-400">{item.manual.toLocaleString()}</span>
                            </div>
                        ))}
                        
                        <div className="mt-4 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white">Total Advantage</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="text-lg font-bold text-primary">+$2,800</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Progress */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Brain className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Learning Progress</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-white">Model Training</span>
                            <span className="text-sm font-mono text-secondary">{metrics.learningProgress.value}%</span>
                        </div>
                        
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-secondary to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${metrics.learningProgress.value}%` }}
                            />
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3 text-primary" />
                            <span>+{metrics.learningProgress.trend}% improvement this month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
