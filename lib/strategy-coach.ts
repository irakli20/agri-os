import type { Field } from '@/lib/mock-data';
import type { WeeklyChallenge, WeeklyWeather } from '@/lib/game-store';

export type CoachUrgency = 'critical' | 'high' | 'medium';

export interface FieldCoachInsight {
  fieldId: string;
  fieldName: string;
  urgency: CoachUrgency;
  actionLabel: string;
  actionHref: string;
  whyNow: string;
  evidence: string;
}

function getUrgencyWeight(urgency: CoachUrgency): number {
  if (urgency === 'critical') return 0;
  if (urgency === 'high') return 1;
  return 2;
}

export function buildFieldInsights(
  gameFields: Field[],
  weeklyChallenges: WeeklyChallenge[],
  weeklyWeather: WeeklyWeather
): FieldCoachInsight[] {
  const openChallenges = weeklyChallenges.filter((challenge) => challenge.status === 'open');

  const insights: FieldCoachInsight[] = gameFields.map((field) => {
    const fieldChallenge = openChallenges.find((challenge) => challenge.fieldId === field.id);
    const stage = field.farmingStage || 'fallow';
    const needsWater = !!field.inputStatus?.needsWater;
    const needsProtection = !!field.inputStatus?.needsProtection;
    const needsNutrients = !!field.inputStatus?.needsNutrients;

    if (stage === 'harvest_ready') {
      return {
        fieldId: field.id,
        fieldName: field.name,
        urgency: 'critical',
        actionLabel: 'Open Harvest Field',
        actionHref: `/fields/${field.id}`,
        whyNow: weeklyWeather.harvestOpen
          ? `Harvest window is open this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).`
          : `Harvest is ready but weather is hostile (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind). Re-plan immediately.`,
        evidence: `Stage: ${stage}. Delay increases quality and lodging risk.`,
      };
    }

    if (needsProtection) {
      return {
        fieldId: field.id,
        fieldName: field.name,
        urgency: 'high',
        actionLabel: 'Protection Services',
        actionHref: `/game/marketplace/services?fieldId=${field.id}`,
        whyNow: weeklyWeather.sprayOpen
          ? `Spray window is open (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).`
          : `Protection needed but spray window is currently closed. Queue provider now for the next opening.`,
        evidence: `Protection flag is active${field.weedPressure && field.weedPressure !== 'none' ? `, weed pressure: ${field.weedPressure}` : ''}.`,
      };
    }

    if (needsWater) {
      return {
        fieldId: field.id,
        fieldName: field.name,
        urgency: weeklyWeather.precipitationChance > 60 ? 'medium' : 'high',
        actionLabel: 'Irrigation Services',
        actionHref: `/game/marketplace/services?fieldId=${field.id}`,
        whyNow: `Water stress is active with ${weeklyWeather.precipitationChance}% precipitation chance and ${weeklyWeather.windMph} mph wind.`,
        evidence: 'Input status indicates irrigation need this week.',
      };
    }

    if (needsNutrients) {
      return {
        fieldId: field.id,
        fieldName: field.name,
        urgency: 'medium',
        actionLabel: 'Buy Fertilizer',
        actionHref: '/game/marketplace/supplies',
        whyNow: 'Nutrient deficit is flagged before next growth-stage progression.',
        evidence: `Stage: ${stage}. Top-dress timing is more efficient before stress compounds.`,
      };
    }

    if (fieldChallenge) {
      return {
        fieldId: field.id,
        fieldName: field.name,
        urgency: fieldChallenge.priority === 'critical' ? 'critical' : fieldChallenge.priority === 'high' ? 'high' : 'medium',
        actionLabel: 'Open Weekly Plan',
        actionHref: '/game/dashboard',
        whyNow: fieldChallenge.description,
        evidence: `Open challenge: ${fieldChallenge.title}`,
      };
    }

    return {
      fieldId: field.id,
      fieldName: field.name,
      urgency: 'medium',
      actionLabel: 'Open Field',
      actionHref: `/fields/${field.id}`,
      whyNow: `No blocking risks detected this week. Keep stage progression on schedule (${stage}).`,
      evidence: `Weather context: ${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind.`,
    };
  });

  return insights
    .sort((a, b) => getUrgencyWeight(a.urgency) - getUrgencyWeight(b.urgency))
    .slice(0, 3);
}
