'use client';

import { useState } from 'react';
import {
    X,
    CloudRain,
    Wind,
    Thermometer,
    Droplets,
    AlertTriangle,
    CheckCircle,
    Bell,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherAlertConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (config: any) => void;
}

const ALERT_TYPES = [
    { id: 'frost', name: 'Frost Warning', icon: Thermometer, color: 'blue' },
    { id: 'heavy_rain', name: 'Heavy Rain', icon: CloudRain, color: 'blue' },
    { id: 'high_wind', name: 'High Wind', icon: Wind, color: 'yellow' },
    { id: 'drought', name: 'Drought Conditions', icon: Droplets, color: 'orange' },
    { id: 'hail', name: 'Hail Risk', icon: CloudRain, color: 'red' },
    { id: 'extreme_heat', name: 'Extreme Heat', icon: Thermometer, color: 'red' },
];

export function WeatherAlertConfigModal({ isOpen, onClose, onSubmit }: WeatherAlertConfigModalProps) {
    const [enabledAlerts, setEnabledAlerts] = useState<string[]>(['frost', 'heavy_rain', 'high_wind']);
    const [thresholds, setThresholds] = useState({
        frostTemp: '32',
        rainAmount: '1.0',
        windSpeed: '30',
        heatTemp: '95',
        droughtDays: '14'
    });
    const [notificationMethods, setNotificationMethods] = useState({
        email: true,
        sms: false,
        push: true,
        dashboard: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const toggleAlert = (alertId: string) => {
        setEnabledAlerts(prev =>
            prev.includes(alertId)
                ? prev.filter(id => id !== alertId)
                : [...prev, alertId]
        );
    };

    const updateThreshold = (key: string, value: string) => {
        setThresholds(prev => ({ ...prev, [key]: value }));
    };

    const toggleNotificationMethod = (method: keyof typeof notificationMethods) => {
        setNotificationMethods(prev => ({ ...prev, [method]: !prev[method] }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSubmit?.({
            enabledAlerts,
            thresholds,
            notificationMethods,
            updatedAt: new Date().toISOString()
        });
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Alerts Configured' : 'Weather Alert Settings'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Your preferences have been saved' : 'Configure weather alerts and notifications'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Settings Saved!</h3>
                            <p className="text-muted-foreground mb-6">
                                You'll receive alerts for {enabledAlerts.length} weather conditions via your selected channels.
                            </p>

                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Alert Types */}
                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Alert Types
                                </h3>
                                <div className="space-y-2">
                                    {ALERT_TYPES.map(alert => {
                                        const Icon = alert.icon;
                                        const isEnabled = enabledAlerts.includes(alert.id);

                                        return (
                                            <div
                                                key={alert.id}
                                                onClick={() => toggleAlert(alert.id)}
                                                className={cn(
                                                    "glass-panel rounded-xl p-4 cursor-pointer transition-all",
                                                    isEnabled
                                                        ? "border-2 border-primary bg-primary/5"
                                                        : "border border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                                            `bg-${alert.color}-500/20`
                                                        )}>
                                                            <Icon className={cn("w-5 h-5", `text-${alert.color}-400`)} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{alert.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {alert.id === 'frost' && `Below ${thresholds.frostTemp}°F`}
                                                                {alert.id === 'heavy_rain' && `Over ${thresholds.rainAmount}" per hour`}
                                                                {alert.id === 'high_wind' && `Above ${thresholds.windSpeed} mph`}
                                                                {alert.id === 'extreme_heat' && `Above ${thresholds.heatTemp}°F`}
                                                                {alert.id === 'drought' && `${thresholds.droughtDays}+ days without rain`}
                                                                {alert.id === 'hail' && 'Hail forecast detected'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                        isEnabled
                                                            ? "bg-primary border-primary"
                                                            : "border-white/30"
                                                    )}>
                                                        {isEnabled && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Thresholds */}
                            <div>
                                <h3 className="font-semibold mb-4">Alert Thresholds</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Frost Temperature (°F)</label>
                                        <input
                                            type="number"
                                            value={thresholds.frostTemp}
                                            onChange={(e) => updateThreshold('frostTemp', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rain Amount (inches/hr)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={thresholds.rainAmount}
                                            onChange={(e) => updateThreshold('rainAmount', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Wind Speed (mph)</label>
                                        <input
                                            type="number"
                                            value={thresholds.windSpeed}
                                            onChange={(e) => updateThreshold('windSpeed', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Heat Temperature (°F)</label>
                                        <input
                                            type="number"
                                            value={thresholds.heatTemp}
                                            onChange={(e) => updateThreshold('heatTemp', e.target.value)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notification Methods */}
                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-400" />
                                    Notification Methods
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { key: 'email' as const, label: 'Email Notifications', desc: 'Receive alerts via email' },
                                        { key: 'sms' as const, label: 'SMS Text Messages', desc: 'Get urgent alerts via text' },
                                        { key: 'push' as const, label: 'Push Notifications', desc: 'Mobile app notifications' },
                                        { key: 'dashboard' as const, label: 'Dashboard Alerts', desc: 'Show in-app notifications' },
                                    ].map(method => (
                                        <label
                                            key={method.key}
                                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{method.label}</div>
                                                <div className="text-xs text-muted-foreground">{method.desc}</div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationMethods[method.key]}
                                                onChange={() => toggleNotificationMethod(method.key)}
                                                className="w-5 h-5"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-blue-400 mb-1">Stay Prepared</div>
                                    <p className="text-muted-foreground">
                                        Weather alerts help you protect crops, schedule operations, and make informed decisions based on forecasts.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={enabledAlerts.length === 0 || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Alert Settings'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
