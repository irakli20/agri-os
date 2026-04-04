// @ts-nocheck
/**
 * Predictive Analytics Data for Agri-OS
 * 
 * Outbreak predictions and seasonal risk forecasting
 */

export type RiskLevel = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskFactorType = 'weather' | 'season' | 'nearby_outbreak' | 'historical' | 'crop_susceptibility';

export interface RiskFactor {
    type: RiskFactorType;
    description: string;
    impact: RiskLevel;
}

export interface PreventiveAction {
    id: string;
    action: string;
    urgency: UrgencyLevel;
    estimatedCost: number;
    effectiveness: number; // 0-100
}

export interface OutbreakPrediction {
    id: string;
    pestType: string;
    probability: number; // 0-100
    peakDate: string;
    affectedFields: string[];
    riskFactors: RiskFactor[];
    preventiveActions: PreventiveAction[];
}

export interface SeasonalRisk {
    season: 'spring' | 'summer' | 'fall' | 'winter';
    risks: {
        pestType: string;
        likelihood: RiskLevel;
        description: string;
    }[];
    historicalPatterns: string[];
}

export function getRiskLevelColor(probability: number): string {
    if (probability < 30) return 'bg-green-500/20 text-green-400';
    if (probability <= 60) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
}

export function getRiskLevelBorderColor(probability: number): string {
    if (probability < 30) return 'border-green-500/30';
    if (probability <= 60) return 'border-yellow-500/30';
    return 'border-red-500/30';
}

export function getUrgencyColor(urgency: UrgencyLevel): string {
    switch (urgency) {
        case 'critical': return 'bg-red-500/20 text-red-400';
        case 'high': return 'bg-orange-500/20 text-orange-400';
        case 'medium': return 'bg-yellow-500/20 text-yellow-400';
        case 'low': return 'bg-green-500/20 text-green-400';
    }
}

export function getRiskFactorIcon(type: RiskFactorType): string {
    switch (type) {
        case 'weather': return '🌧️';
        case 'season': return '📅';
        case 'nearby_outbreak': return '🚨';
        case 'historical': return '📊';
        case 'crop_susceptibility': return '🌱';
    }
}

// Mock predictions for current season (winter/early spring)
export const OUTBREAK_PREDICTIONS: OutbreakPrediction[] = [
    {
        id: 'pred-1',
        pestType: 'Aphids',
        probability: 72,
        peakDate: '2025-02-15',
        affectedFields: ['field-1', 'field-3'],
        riskFactors: [
            { type: 'weather', description: 'Mild temperatures forecast for next 2 weeks', impact: 'high' },
            { type: 'season', description: 'Late winter aphid emergence typical in region', impact: 'medium' },
            { type: 'nearby_outbreak', description: 'Reported outbreak 5 miles north', impact: 'high' },
        ],
        preventiveActions: [
            { id: 'pa-1', action: 'Apply insecticidal soap spray', urgency: 'high', estimatedCost: 450, effectiveness: 85 },
            { id: 'pa-2', action: 'Release ladybug predators', urgency: 'medium', estimatedCost: 280, effectiveness: 70 },
            { id: 'pa-3', action: 'Install reflective mulch', urgency: 'low', estimatedCost: 620, effectiveness: 55 },
        ],
    },
    {
        id: 'pred-2',
        pestType: 'Powdery Mildew',
        probability: 58,
        peakDate: '2025-02-28',
        affectedFields: ['field-2', 'field-4'],
        riskFactors: [
            { type: 'weather', description: 'High humidity expected with morning fog', impact: 'high' },
            { type: 'crop_susceptibility', description: 'Broccoli and spinach highly susceptible', impact: 'medium' },
            { type: 'historical', description: 'Farm had outbreak same period last year', impact: 'medium' },
        ],
        preventiveActions: [
            { id: 'pa-4', action: 'Apply fungicide preventively', urgency: 'high', estimatedCost: 380, effectiveness: 90 },
            { id: 'pa-5', action: 'Improve air circulation between rows', urgency: 'medium', estimatedCost: 150, effectiveness: 60 },
            { id: 'pa-6', action: 'Apply sulfur dust treatment', urgency: 'medium', estimatedCost: 220, effectiveness: 75 },
        ],
    },
    {
        id: 'pred-3',
        pestType: 'Cabbage Looper',
        probability: 35,
        peakDate: '2025-03-10',
        affectedFields: ['field-2'],
        riskFactors: [
            { type: 'season', description: 'Early spring emergence expected', impact: 'medium' },
            { type: 'crop_susceptibility', description: 'Broccoli is primary host crop', impact: 'high' },
        ],
        preventiveActions: [
            { id: 'pa-7', action: 'Install pheromone traps for monitoring', urgency: 'low', estimatedCost: 120, effectiveness: 40 },
            { id: 'pa-8', action: 'Apply Bt (Bacillus thuringiensis)', urgency: 'medium', estimatedCost: 340, effectiveness: 88 },
        ],
    },
    {
        id: 'pred-4',
        pestType: 'Spider Mites',
        probability: 22,
        peakDate: '2025-03-20',
        affectedFields: ['field-3', 'field-5'],
        riskFactors: [
            { type: 'weather', description: 'Dry conditions may favor mite populations', impact: 'low' },
            { type: 'historical', description: 'No significant history on this farm', impact: 'low' },
        ],
        preventiveActions: [
            { id: 'pa-9', action: 'Increase irrigation frequency', urgency: 'low', estimatedCost: 80, effectiveness: 45 },
            { id: 'pa-10', action: 'Release predatory mites', urgency: 'low', estimatedCost: 350, effectiveness: 82 },
        ],
    },
];

export const SEASONAL_RISKS: SeasonalRisk[] = [
    {
        season: 'winter',
        risks: [
            { pestType: 'Aphids', likelihood: 'high', description: 'Cold-tolerant species active on brassicas' },
            { pestType: 'Powdery Mildew', likelihood: 'medium', description: 'Thrives in cool, humid conditions' },
            { pestType: 'Slugs', likelihood: 'medium', description: 'Active in wet conditions' },
        ],
        historicalPatterns: [
            'Aphid populations typically peak in late February',
            'Fungal diseases more prevalent during foggy periods',
            'Reduced pest pressure overall compared to summer',
        ],
    },
    {
        season: 'spring',
        risks: [
            { pestType: 'Cabbage Looper', likelihood: 'high', description: 'First generation emerges mid-spring' },
            { pestType: 'Thrips', likelihood: 'medium', description: 'Migrate from surrounding areas' },
            { pestType: 'Downy Mildew', likelihood: 'high', description: 'Warm, wet conditions ideal' },
        ],
        historicalPatterns: [
            'Major pest pressure begins mid-March',
            'Monitor weekly for early detection',
            'Beneficial insect populations also increase',
        ],
    },
    {
        season: 'summer',
        risks: [
            { pestType: 'Spider Mites', likelihood: 'high', description: 'Hot, dry conditions favor rapid reproduction' },
            { pestType: 'Whiteflies', likelihood: 'high', description: 'Peak populations July-August' },
            { pestType: 'Armyworms', likelihood: 'medium', description: 'Can cause rapid defoliation' },
        ],
        historicalPatterns: [
            'Highest pest pressure of the year',
            'Daily scouting recommended',
            'Consider biological control programs',
        ],
    },
    {
        season: 'fall',
        risks: [
            { pestType: 'Aphids', likelihood: 'medium', description: 'Second population surge before winter' },
            { pestType: 'Fungal Diseases', likelihood: 'high', description: 'Early rains increase disease pressure' },
            { pestType: 'Cutworms', likelihood: 'low', description: 'May affect late plantings' },
        ],
        historicalPatterns: [
            'Transition period with variable pest pressure',
            'Focus on disease prevention as humidity increases',
            'Good time for cover crop pest management',
        ],
    },
];

export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
}

export function getCurrentSeasonRisks(): SeasonalRisk | undefined {
    return SEASONAL_RISKS.find(r => r.season === getCurrentSeason());
}
