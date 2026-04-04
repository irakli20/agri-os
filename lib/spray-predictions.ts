// @ts-nocheck
/**
 * Spray Window Prediction & Analysis
 * 
 * AI-powered optimal spray timing based on:
 * - Field conditions (NDVI, moisture, temperature)
 * - Pest infestation data and forecasts
 * - Weather conditions (wind, precipitation, temperature)
 * - Crop stage and sensitivity
 */

export interface SprayWindow {
    date: string;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    suitability: 'optimal' | 'good' | 'marginal' | 'poor';
    score: number; // 0-100
    conditions: {
        windSpeed: number; // mph
        temperature: number; // °F
        humidity: number; // %
        precipitation: number; // %
    };
    reasons: string[];
    warnings: string[];
}

export interface SprayRecommendation {
    fieldId: string;
    urgency: 'immediate' | 'high' | 'medium' | 'low';
    targetPest?: string;
    targetDisease?: string;
    recommendedProduct: string;
    applicationRate: string;
    optimalWindows: SprayWindow[];
    fieldReadiness: {
        soilMoisture: 'optimal' | 'too_wet' | 'too_dry';
        cropStage: string;
        stressLevel: 'low' | 'medium' | 'high';
    };
}

// Mock spray window predictions for North Valley field
export const SPRAY_RECOMMENDATIONS: SprayRecommendation[] = [
    {
        fieldId: 'field-1',
        urgency: 'medium',
        targetPest: 'Aphids',
        recommendedProduct: 'Organic Neem Oil',
        applicationRate: '2 gallons/acre',
        optimalWindows: [
            {
                date: '2024-12-04',
                startTime: '06:00',
                endTime: '09:30',
                suitability: 'optimal',
                score: 95,
                conditions: {
                    windSpeed: 4,
                    temperature: 68,
                    humidity: 65,
                    precipitation: 0,
                },
                reasons: [
                    'Low wind speed ideal for drift control',
                    'Optimal temperature for product efficacy',
                    'High humidity enhances absorption',
                    'No precipitation forecast',
                ],
                warnings: [],
            },
            {
                date: '2024-12-04',
                startTime: '17:00',
                endTime: '19:30',
                suitability: 'good',
                score: 85,
                conditions: {
                    windSpeed: 6,
                    temperature: 72,
                    humidity: 55,
                    precipitation: 0,
                },
                reasons: [
                    'Acceptable wind conditions',
                    'Good temperature range',
                    'No rain expected',
                ],
                warnings: [
                    'Slightly higher wind - monitor drift',
                ],
            },
            {
                date: '2024-12-05',
                startTime: '06:30',
                endTime: '10:00',
                suitability: 'optimal',
                score: 92,
                conditions: {
                    windSpeed: 3,
                    temperature: 70,
                    humidity: 70,
                    precipitation: 0,
                },
                reasons: [
                    'Excellent wind conditions',
                    'Perfect temperature',
                    'High humidity for better coverage',
                ],
                warnings: [],
            },
        ],
        fieldReadiness: {
            soilMoisture: 'optimal',
            cropStage: 'Vegetative - Heading',
            stressLevel: 'low',
        },
    },
    {
        fieldId: 'field-3',
        urgency: 'high',
        targetPest: 'Spider Mites',
        targetDisease: 'Powdery Mildew',
        recommendedProduct: 'Miticide + Fungicide Mix',
        applicationRate: '1.5 gallons/acre',
        optimalWindows: [
            {
                date: '2024-12-04',
                startTime: '07:00',
                endTime: '09:00',
                suitability: 'good',
                score: 82,
                conditions: {
                    windSpeed: 5,
                    temperature: 70,
                    humidity: 60,
                    precipitation: 0,
                },
                reasons: [
                    'Acceptable conditions for urgent treatment',
                    'Low precipitation risk',
                ],
                warnings: [
                    'Wind slightly elevated - use drift reduction nozzles',
                    'High pest pressure requires immediate action',
                ],
            },
            {
                date: '2024-12-04',
                startTime: '18:00',
                endTime: '20:00',
                suitability: 'marginal',
                score: 65,
                conditions: {
                    windSpeed: 8,
                    temperature: 74,
                    humidity: 50,
                    precipitation: 5,
                },
                reasons: [
                    'Last viable window before rain',
                ],
                warnings: [
                    'Wind approaching upper limit (10 mph)',
                    'Low humidity may reduce efficacy',
                    'Small chance of evening showers',
                ],
            },
        ],
        fieldReadiness: {
            soilMoisture: 'optimal',
            cropStage: 'Flowering',
            stressLevel: 'high',
        },
    },
    {
        fieldId: 'field-5',
        urgency: 'immediate',
        targetDisease: 'Downy Mildew',
        recommendedProduct: 'Systemic Fungicide',
        applicationRate: '3 gallons/acre',
        optimalWindows: [
            {
                date: '2024-12-04',
                startTime: '06:00',
                endTime: '08:00',
                suitability: 'good',
                score: 78,
                conditions: {
                    windSpeed: 7,
                    temperature: 66,
                    humidity: 75,
                    precipitation: 0,
                },
                reasons: [
                    'Critical treatment window',
                    'No rain in forecast',
                ],
                warnings: [
                    'Wind at upper acceptable range',
                    'Disease pressure critical - treat ASAP',
                    'Monitor for drift with high humidity',
                ],
            },
        ],
        fieldReadiness: {
            soilMoisture: 'too_wet',
            cropStage: 'Seedling',
            stressLevel: 'high',
        },
    },
];

// Calculate spray window score based on conditions
export function calculateSprayScore(conditions: {
    windSpeed: number;
    temperature: number;
    humidity: number;
    precipitation: number;
    cropStage: string;
}): number {
    let score = 100;

    // Wind penalty (ideal: 2-8 mph)
    if (conditions.windSpeed < 2) score -= 20; // Too calm, poor coverage
    if (conditions.windSpeed > 8) score -= (conditions.windSpeed - 8) * 10;
    if (conditions.windSpeed > 12) return 0; // Unsafe

    // Temperature penalty (ideal: 65-85°F)
    if (conditions.temperature < 50 || conditions.temperature > 90) score -= 30;
    if (conditions.temperature < 40 || conditions.temperature > 95) return 0;

    // Precipitation penalty
    if (conditions.precipitation > 20) score -= 40;
    if (conditions.precipitation > 50) return 0; // No spray

    // Humidity bonus (ideal: 50-70%)
    if (conditions.humidity >= 50 && conditions.humidity <= 70) score += 10;
    if (conditions.humidity < 30) score -= 20; // Too dry, poor absorption

    return Math.max(0, Math.min(100, score));
}

// Get urgency color
export function getUrgencyColor(urgency: string): string {
    switch (urgency) {
        case 'immediate': return 'text-red-400 bg-red-500/20';
        case 'high': return 'text-orange-400 bg-orange-500/20';
        case 'medium': return 'text-yellow-400 bg-yellow-500/20';
        case 'low': return 'text-green-400 bg-green-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
}

// Get suitability color
export function getSuitabilityColor(suitability: string): string {
    switch (suitability) {
        case 'optimal': return 'text-green-400 bg-green-500/20';
        case 'good': return 'text-lime-400 bg-lime-500/20';
        case 'marginal': return 'text-yellow-400 bg-yellow-500/20';
        case 'poor': return 'text-red-400 bg-red-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
}
