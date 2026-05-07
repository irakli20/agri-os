import { AppShell } from '@/components/layout/AppShell';
import { FIELDS } from '@/lib/mock-data';
import { Sprout, Calendar, TrendingUp, Droplets, AlertTriangle, CalendarDays, Flower2, Snowflake, Sun, Wheat } from 'lucide-react';
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

const CROP_CALENDAR_MONTHS = ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'];

const CROP_CALENDAR_ROWS = [
    { crop: 'Wheat', icon: '🌾', planting: [[6, 7]], harvest: [[4, 5]] },
    { crop: 'Barley', icon: '🌾', planting: [[6, 7]], harvest: [[3, 4]] },
    { crop: 'Canola', icon: '🌼', planting: [[5, 6]], harvest: [[4, 5]] },
    { crop: 'Oat', icon: '🌿', planting: [[0, 1]], harvest: [[4, 5]] },
    { crop: 'Corn', icon: '🌽', planting: [[1, 2]], harvest: [[7, 8]] },
    { crop: 'Sunflowers', icon: '🌻', planting: [[0, 1]], harvest: [[7, 8]] },
    { crop: 'Soybeans', icon: '🫘', planting: [[1, 2]], harvest: [[7, 8]] },
    { crop: 'Potatoes', icon: '🥔', planting: [[0, 1]], harvest: [[5, 6]] },
    { crop: 'Rice', icon: '🌾', planting: [[1, 2]], harvest: [[5, 6]] },
    { crop: 'Long Grain Rice', icon: '🌾', planting: [[1, 1]], harvest: [[6, 6]] },
    { crop: 'Sugar Beet', icon: '🌱', planting: [[0, 1]], harvest: [[7, 8]] },
];

function CropCalendarBar({ range, type }: { range: number[]; type: 'planting' | 'harvest' }) {
    const [start, end] = range;
    const left = `${(start / CROP_CALENDAR_MONTHS.length) * 100}%`;
    const width = `${((end - start + 1) / CROP_CALENDAR_MONTHS.length) * 100}%`;

    return (
        <div
            className={cn(
                "absolute top-1/2 h-4 -translate-y-1/2 rounded-full shadow-lg",
                type === 'planting'
                    ? "bg-lime-500 shadow-lime-500/20"
                    : "bg-orange-600 shadow-orange-600/20"
            )}
            style={{ left, width }}
        />
    );
}

function CropCalendar() {
    return (
        <section className="card-soft rounded-2xl overflow-hidden elevate-card">
            <div className="flex flex-col gap-4 border-b border-lime-500/30 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
                        <CalendarDays className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="page-header-meta">Season Planner</p>
                        <h2 className="text-2xl font-semibold tracking-wide">Crop Calendar</h2>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-lime-500 shadow-sm shadow-lime-500/40" />
                        Planting Season
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-orange-600 shadow-sm shadow-orange-600/40" />
                        Harvest Season
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[1080px]">
                    <div className="grid grid-cols-[190px_1fr]">
                        <div className="border-r border-white/10" />
                        <div className="relative">
                            <div className="grid grid-cols-12 border-b border-lime-500/30">
                                {CROP_CALENDAR_MONTHS.map((month) => (
                                    <div key={month} className="border-r border-white/10 px-3 py-5 text-center text-sm font-bold tracking-wide text-foreground/90 last:border-r-0">
                                        {month}
                                    </div>
                                ))}
                            </div>
                            <div className="pointer-events-none absolute inset-x-0 -top-12 grid grid-cols-4 text-muted-foreground/80">
                                <Flower2 className="mx-auto h-7 w-7" />
                                <Sun className="mx-auto h-7 w-7" />
                                <Wheat className="mx-auto h-7 w-7" />
                                <Snowflake className="mx-auto h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    {CROP_CALENDAR_ROWS.map((row, index) => (
                        <div
                            key={row.crop}
                            className={cn(
                                "grid grid-cols-[190px_1fr] border-b border-white/5",
                                index % 2 === 0 ? "bg-white/[0.045]" : "bg-black/10"
                            )}
                        >
                            <div className="flex items-center gap-3 border-r border-white/10 px-5 py-4">
                                <span className="text-2xl leading-none">{row.icon}</span>
                                <span className="font-semibold text-foreground/90">{row.crop}</span>
                            </div>
                            <div className="relative min-h-[56px]">
                                <div className="absolute inset-0 grid grid-cols-12">
                                    {CROP_CALENDAR_MONTHS.map((month) => (
                                        <div key={month} className="border-r border-white/10 last:border-r-0" />
                                    ))}
                                </div>
                                {row.planting.map((range) => (
                                    <CropCalendarBar key={`plant-${range.join('-')}`} range={range} type="planting" />
                                ))}
                                {row.harvest.map((range) => (
                                    <CropCalendarBar key={`harvest-${range.join('-')}`} range={range} type="harvest" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

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

                <CropCalendar />

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
