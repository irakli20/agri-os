import type { Field } from '@/lib/mock-data';

export interface FieldDisplaySemantics {
  isGrowing: boolean;
  hasCrop: boolean;
  displayCropLabel: string;
  scoreLabel: string;
  scoreValue: number;
  stageLabel: string;
  scoreDescription: string;
  primaryActionLabel: string;
}

const NON_GROWING_STAGES = new Set([
  'fallow',
  'scouted',
  'aerial_surveyed',
  'soil_tested',
  'plowed',
  'pre_plant_treated',
  'tilled',
  'harvested',
  'post_harvest',
]);

function normalizeCropName(crop?: string): string {
  const value = (crop || '').trim();
  if (!value || value.toLowerCase() === 'unplanted') return 'Unplanted';
  return value;
}

export function isFieldGrowing(field: Pick<Field, 'farmingStage' | 'cropStage' | 'crop' | 'ndviScore'>): boolean {
  if (field.farmingStage === 'growing' || field.farmingStage === 'harvest_ready') {
    return true;
  }

  if (field.farmingStage && NON_GROWING_STAGES.has(field.farmingStage)) {
    return false;
  }

  if (field.cropStage && field.cropStage !== 'none') {
    return true;
  }

  return false;
}

export function getFieldStageLabel(field: Pick<Field, 'farmingStage' | 'cropStage'>): string {
  if (field.farmingStage) return field.farmingStage.replace(/_/g, ' ');
  if (field.cropStage && field.cropStage !== 'none') return field.cropStage.replace(/_/g, ' ');
  return 'fallow';
}

export function getFieldDisplaySemantics(field: Field): FieldDisplaySemantics {
  const isGrowingNow = isFieldGrowing(field);
  const crop = normalizeCropName(field.crop);
  const scoreValue = Math.round((field.ndviScore || 0) * 100);
  const stageLabel = getFieldStageLabel(field);
  const hasCrop = crop !== 'Unplanted';

  if (isGrowingNow) {
    return {
      isGrowing: true,
      hasCrop,
      displayCropLabel: crop,
      scoreLabel: 'Crop Health',
      scoreValue,
      stageLabel,
      scoreDescription: `Stage: ${stageLabel}`,
      primaryActionLabel: 'View Multispectral Analysis →',
    };
  }

  const isLifecycleTracked = !!field.farmingStage || (field.cropStage && field.cropStage !== 'none');

  return {
    isGrowing: false,
    hasCrop,
    displayCropLabel: hasCrop ? crop : 'Unplanted',
    scoreLabel: isLifecycleTracked ? 'Field Condition' : 'Latest Field Index',
    scoreValue,
    stageLabel,
    scoreDescription: isLifecycleTracked
      ? `${stageLabel} — crop NDVI not yet available`
      : 'Demo field snapshot — lifecycle stage not yet tracked',
    primaryActionLabel: 'View Field Details →',
  };
}
