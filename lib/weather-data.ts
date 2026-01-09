/**
 * Enhanced Weather Data
 * 
 * Hourly forecasts, weather layers, and agricultural advisories
 */

export interface HourlyForecast {
    time: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
    condition: string;
    uvIndex: number;
    dewPoint: number;
    pressure: number;
    visibility: number;
    sprayScore: number; // 0-100
}

export interface WeatherAlert {
    id: string;
    type: 'frost' | 'heat' | 'wind' | 'rain' | 'hail' | 'drought';
    severity: 'watch' | 'warning' | 'advisory';
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    affectedFields: string[];
}

export interface DroughtPrediction {
    weekAhead: number; // 0-100 drought index
    monthAhead: number;
    seasonAhead: number;
    trend: 'improving' | 'stable' | 'worsening';
    recommendation: string;
}

// Generate hourly forecast for the next 24 hours
export function generateHourlyForecast(): HourlyForecast[] {
    const now = new Date();
    const forecasts: HourlyForecast[] = [];

    for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hourNum = hour.getHours();

        // Simulate temperature curve (cooler at night, warmer midday)
        const baseTemp = 65;
        const tempVariation = Math.sin((hourNum - 6) * Math.PI / 12) * 15;
        const temp = Math.round(baseTemp + tempVariation);

        // Wind typically lower at night
        const baseWind = 5;
        const windVariation = hourNum >= 10 && hourNum <= 18 ? 5 : 0;
        const windSpeed = baseWind + windVariation + Math.random() * 3;

        // Humidity inversely related to temperature
        const humidity = Math.round(60 - tempVariation / 2 + Math.random() * 10);

        // Spray score calculation
        const sprayScore = calculateSprayScore(windSpeed, humidity, temp);

        forecasts.push({
            time: hour.toISOString(),
            temp,
            feelsLike: temp + (windSpeed > 10 ? -3 : 2),
            humidity,
            windSpeed: Math.round(windSpeed * 10) / 10,
            windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            precipitation: hourNum >= 14 && hourNum <= 16 ? 20 : 0,
            condition: hourNum >= 6 && hourNum <= 18 ? 'Sunny' : 'Clear',
            uvIndex: hourNum >= 10 && hourNum <= 16 ? Math.min(11, Math.floor((hourNum - 6) / 2)) : 0,
            dewPoint: temp - 15,
            pressure: 1013 + Math.random() * 5,
            visibility: 10,
            sprayScore,
        });
    }

    return forecasts;
}

function calculateSprayScore(windSpeed: number, humidity: number, temp: number): number {
    let score = 100;

    // Wind penalty
    if (windSpeed > 5) score -= (windSpeed - 5) * 8;
    if (windSpeed > 10) score -= 20;
    if (windSpeed > 15) score = 0;

    // Humidity penalty (too low = evaporation, too high = runoff)
    if (humidity < 40) score -= (40 - humidity) * 2;
    if (humidity > 80) score -= (humidity - 80) * 2;

    // Temperature penalty (too hot = evaporation)
    if (temp > 85) score -= (temp - 85) * 3;
    if (temp < 50) score -= (50 - temp) * 2;

    return Math.max(0, Math.min(100, Math.round(score)));
}

// Weather Alerts
export const WEATHER_ALERTS: WeatherAlert[] = [
    {
        id: 'alert-1',
        type: 'wind',
        severity: 'advisory',
        title: 'Wind Advisory',
        description: 'Gusty winds expected from 2 PM to 6 PM. Peak gusts of 25-30 mph possible.',
        startTime: '2024-12-04T14:00:00',
        endTime: '2024-12-04T18:00:00',
        affectedFields: ['north-40', 'east-orchard'],
    },
];

// AI Drought Prediction
export const DROUGHT_PREDICTION: DroughtPrediction = {
    weekAhead: 25,
    monthAhead: 35,
    seasonAhead: 45,
    trend: 'stable',
    recommendation: 'Current soil moisture at 68%. Consider increasing irrigation frequency by 15% if no precipitation in next 7 days.',
};

// Spray Window Recommendations
export interface SprayWindow {
    date: string;
    windows: {
        start: string;
        end: string;
        score: number;
        recommendation: string;
    }[];
}

export function getSprayWindows(hourlyForecast: HourlyForecast[]): SprayWindow[] {
    const windows: SprayWindow[] = [];
    const today = new Date().toISOString().split('T')[0];

    const dayWindows: { start: string; end: string; score: number; recommendation: string }[] = [];
    let inWindow = false;
    let windowStart = '';
    let minScore = 100;

    hourlyForecast.forEach((hour, i) => {
        if (hour.sprayScore >= 70 && !inWindow) {
            inWindow = true;
            windowStart = hour.time;
            minScore = hour.sprayScore;
        } else if (hour.sprayScore >= 70 && inWindow) {
            minScore = Math.min(minScore, hour.sprayScore);
        } else if (hour.sprayScore < 70 && inWindow) {
            inWindow = false;
            dayWindows.push({
                start: new Date(windowStart).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                end: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                score: minScore,
                recommendation: minScore >= 90 ? 'Excellent conditions' : minScore >= 80 ? 'Good conditions' : 'Acceptable conditions',
            });
        }
    });

    if (dayWindows.length > 0) {
        windows.push({ date: today, windows: dayWindows });
    }

    return windows;
}
