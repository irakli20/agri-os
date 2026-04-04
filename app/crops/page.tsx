import { AppShell } from '@/components/layout/AppShell';
import { FIELDS } from '@/lib/mock-data';
import { Sprout, Calendar, TrendingUp, Droplets, Sun, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Crop growth stage data
const CROP_DATA = [
    {
        crop: 'Lettuce',
        fields: FIELDS.filter(f => f.crop === 'Lettuce'),
        growthStage: 'Heading',
        daysToHarvest: 18,
        waterNeeds: 'High',
        pestPressure: 'Low',
        recommendations: ['Monitor for aphids', 'Maintain consistent irrigation', 'Scout for tip burn'],
    },
    {
        crop: 'Broccoli',
        fields: FIELDS.filter(f => f.crop === 'Broccoli'),
        growthStage: 'Head Formation',
        daysToHarvest: 25,
        waterNeeds: 'Medium',
        pestPressure: 'Medium',
        recommendations: ['Watch for cabbage worms', 'Apply boron if needed', 'Monitor head size'],
    },
    {
        crop: 'Strawberries',
        fields: FIELDS.filter(f => f.crop === 'Strawberries'),
        growthStage: 'Flowering',
        daysToHarvest: 35,
        waterNeeds: 'High',
        pestPressure: 'High',
        recommendations: ['Scout for spider mites', 'Manage powdery mildew', 'Ensure pollination'],
    },
    {
        crop: 'Cauliflower',
        fields: FIELDS.filter(f => f.crop === 'Cauliflower'),
        growthStage: 'Vegetative',
        daysToHarvest: 32,
        waterNeeds: 'Medium',
        pestPressure: 'Low',
        recommendations: ['Monitor nitrogen levels', 'Scout for aphids', 'Check soil moisture'],
    },
    {
        crop: 'Spinach',
        fields: FIELDS.filter(f => f.crop === 'Spinach'),
        growthStage: 'Seedling',
        daysToHarvest: 42,
        waterNeeds: 'High',
        pestPressure: 'High',
        recommendations: ['Critical: Apply fungicide for downy mildew', 'Thin plants if needed', 'Monitor for leaf miners'],
    },
];

export default function CropsPage() {
    const getWaterColor = (needs: string) => {
        switch (needs) {
            case 'High': return 'text-blue-400 bg-blue-500/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'Low': return 'text-green-400 bg-green-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getPestColor = (pressure: string) => {
        switch (pressure) {
            case 'High': return 'text-red-400 bg-red-500/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'Low': return 'text-green-400 bg-green-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    return (
        <AppShell>
            <div className="page-shell">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <p className="page-header-meta">Agronomy Insights</p>
                        <h1 className="text-3xl font-bold">Crop Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor growth stages and manage {CROP_DATA.length} crop types
                        </p>
                    </div>
                    <button className="cta-primary">
                        Add Crop Plan
                    </button>
                </div>

                {/* Crop Stats */}
                <div className="page-kpi-grid">
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Active Crops</div>
                        <div className="text-2xl font-bold">{CROP_DATA.length}</div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Avg. Days to Harvest</div>
                        <div className="text-2xl font-bold text-green-400">
                            {Math.round(CROP_DATA.reduce((sum, c) => sum + c.daysToHarvest, 0) / CROP_DATA.length)}
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">High Pest Pressure</div>
                        <div className="text-2xl font-bold text-red-400">
                            {CROP_DATA.filter(c => c.pestPressure === 'High').length}
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">High Water Needs</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {CROP_DATA.filter(c => c.waterNeeds === 'High').length}
                        </div>
                    </div>
                </div>

                {/* Crops Grid */}
                <div className="space-y-4">
                    {CROP_DATA.map((cropData) => (
                        <div
                            key={cropData.crop}
                            className="card-soft rounded-2xl p-6 hover:bg-white/10 transition-all elevate-card"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <Sprout className="w-8 h-8 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{cropData.crop}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {cropData.fields.length} field{cropData.fields.length !== 1 ? 's' : ''} • {cropData.fields.reduce((sum, f) => sum + f.acres, 0)} acres
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Growth Stage</div>
                                    <div className="text-lg font-semibold text-primary">{cropData.growthStage}</div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-muted-foreground">Days to Harvest</span>
                                    </div>
                                    <div className="text-2xl font-bold">{cropData.daysToHarvest}</div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplets className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs text-muted-foreground">Water Needs</span>
                                    </div>
                                    <span className={cn(
                                        "inline-block px-2 py-1 rounded text-xs font-medium",
                                        getWaterColor(cropData.waterNeeds)
                                    )}>
                                        {cropData.waterNeeds}
                                    </span>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                        <span className="text-xs text-muted-foreground">Pest Pressure</span>
                                    </div>
                                    <span className={cn(
                                        "inline-block px-2 py-1 rounded text-xs font-medium",
                                        getPestColor(cropData.pestPressure)
                                    )}>
                                        {cropData.pestPressure}
                                    </span>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-muted-foreground">Avg. NDVI</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {Math.round((cropData.fields.reduce((sum, f) => sum + f.ndviScore, 0) / cropData.fields.length) * 100)}
                                    </div>
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Fields</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cropData.fields.map((field) => (
                                        <div
                                            key={field.id}
                                            className="bg-white/5 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors cursor-pointer"
                                        >
                                            <div className="font-medium">{field.name}</div>
                                            <div className="text-xs text-muted-foreground">{field.acres} ac • NDVI {Math.round(field.ndviScore * 100)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Agronomic Recommendations</h4>
                                <div className="space-y-2">
                                    {cropData.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm">
                                            <span className="text-primary mt-0.5">•</span>
                                            <span className={cn(
                                                rec.includes('Critical') && "text-red-400 font-medium"
                                            )}>{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
