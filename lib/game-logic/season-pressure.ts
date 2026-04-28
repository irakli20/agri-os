import type { Field } from '../mock-data';

interface WeeklyWeatherLike {
  precipitationChance: number;
  windMph: number;
  sprayOpen?: boolean;
  harvestOpen?: boolean;
}

export interface SeasonalPressureResult {
  needsWater: boolean;
  needsNutrients: boolean;
  needsProtection: boolean;
  diseasePressure: number;
  diseaseOutbreak: boolean;
  weedPressure: Field['weedPressure'];
  ndviDelta: number;
  healthStatus: Field['healthStatus'];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isGrowingStage(field: Field) {
  return field.farmingStage === 'growing' || field.farmingStage === 'harvest_ready';
}

function stageFactor(field: Field) {
  switch (field.cropStage) {
    case 'seeded':
    case 'germination':
      return 'early';
    case 'vegetative':
      return 'mid';
    case 'flowering':
    case 'ripening':
      return 'late';
    default:
      return 'generic';
  }
}

export function applySeasonalPressure(field: Field, weeklyWeather: WeeklyWeatherLike): SeasonalPressureResult {
  if (!isGrowingStage(field)) {
    return {
      needsWater: false,
      needsNutrients: false,
      needsProtection: false,
      diseasePressure: field.diseasePressure || 0,
      diseaseOutbreak: field.diseaseOutbreak || false,
      weedPressure: field.weedPressure || 'none',
      ndviDelta: 0,
      healthStatus: field.healthStatus || 'good',
    };
  }

  const stage = stageFactor(field);
  const rain = weeklyWeather.precipitationChance || 0;
  const wind = weeklyWeather.windMph || 0;
  const currentDisease = field.diseasePressure || 0;

  const needsWater =
    !field.irrigationReady && (
      (stage === 'early' && rain < 35) ||
      (stage === 'mid' && rain < 45) ||
      (stage === 'late' && rain < 40)
    );

  const needsNutrients =
    !!field.inputStatus?.needsNutrients ||
    (stage === 'mid' && (field.ndviScore || 0) < 0.45) ||
    (stage === 'late' && (field.ndviScore || 0) < 0.55);

  let diseasePressure = currentDisease;
  if (rain >= 60) diseasePressure += 18;
  else if (rain >= 40) diseasePressure += 8;
  else if (rain <= 15) diseasePressure -= 10;
  else diseasePressure -= 3;

  if (wind > 16) diseasePressure -= 4;

  diseasePressure = clamp(diseasePressure, 0, 100);
  const diseaseOutbreak = diseasePressure >= 75;
  const needsProtection = diseaseOutbreak || diseasePressure >= 55;

  let weedPressure: Field['weedPressure'] = field.weedPressure || 'none';
  if (stage === 'early' && rain >= 35 && weedPressure === 'none') weedPressure = 'low';
  if (stage === 'mid' && rain >= 45 && weedPressure === 'low') weedPressure = 'medium';
  if (needsProtection && weedPressure === 'medium') weedPressure = 'high';

  let ndviDelta = 0;
  if (needsWater) ndviDelta -= 0.04;
  if (needsNutrients) ndviDelta -= 0.03;
  if (needsProtection) ndviDelta -= 0.05;
  if (!needsWater && !needsNutrients && !needsProtection) ndviDelta += 0.02;

  let healthStatus: Field['healthStatus'] = 'good';
  if (needsProtection || diseaseOutbreak || (field.ndviScore || 0) + ndviDelta < 0.45) healthStatus = 'critical';
  else if (needsWater || needsNutrients || weedPressure === 'medium' || weedPressure === 'high') healthStatus = 'attention';
  else if ((field.ndviScore || 0) + ndviDelta > 0.78) healthStatus = 'excellent';

  return {
    needsWater,
    needsNutrients,
    needsProtection,
    diseasePressure,
    diseaseOutbreak,
    weedPressure,
    ndviDelta,
    healthStatus,
  };
}
