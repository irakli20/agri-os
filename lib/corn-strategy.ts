import type { Field } from '@/lib/mock-data';

export type FarmingStage = NonNullable<Field['farmingStage']>;
export type CropStage = NonNullable<Field['cropStage']>;

export interface CornReferenceStage {
    id: string;
    label: string;
    bbchRef: string;
    description: string;
    image: string;
}

export const FARM_STAGE_FLOW: FarmingStage[] = [
    'fallow',
    'scouted',
    'aerial_surveyed',
    'soil_tested',
    'plowed',
    'pre_plant_treated',
    'tilled',
    'growing',
    'harvest_ready',
    'harvested',
    'post_harvest',
];

export const CROP_STAGE_FLOW: CropStage[] = [
    'seeded',
    'germination',
    'vegetative',
    'flowering',
    'ripening',
    'harvest_ready',
];

export const CORN_REFERENCE_STAGES: CornReferenceStage[] = [
    {
        id: 'VE',
        label: 'Emergence',
        bbchRef: '11',
        description: 'The first stage is emergence, when the coleoptile is fully visible and no fully developed leaves are present.',
        image: '/assets/corn-growth/weatherstem/corn_growth1_orig.png',
    },
    {
        id: 'V1',
        label: 'First leaf fully developed',
        bbchRef: '12',
        description: 'V1 indicates full development of the first leaf collar. Vegetative stages are identified by the count of fully developed leaves.',
        image: '/assets/corn-growth/weatherstem/corn_growth2_orig.png',
    },
    {
        id: 'V2',
        label: 'Second leaf fully developed',
        bbchRef: '13',
        description: 'Two leaves with visible collars.',
        image: '/assets/corn-growth/weatherstem/corn_growth2_orig.png',
    },
    {
        id: 'V4',
        label: 'Fourth leaf stage',
        bbchRef: '14',
        description: 'Four leaves with visible collars.',
        image: '/assets/corn-growth/weatherstem/corn_growth2_orig.png',
    },
    {
        id: 'V6',
        label: 'Six-leaf stage',
        bbchRef: '16',
        description: 'Around V6, the growing point is above the soil surface and the earliest leaves begin to senesce.',
        image: '/assets/corn-growth/weatherstem/corn_growth3_orig.png',
    },
    {
        id: 'V10',
        label: 'Ten-leaf stage',
        bbchRef: '31',
        description: 'At V10, ear shoots are visible and tassel development is underway.',
        image: '/assets/corn-growth/weatherstem/corn_growth4_orig.png',
    },
    {
        id: 'V12',
        label: 'Twelve-leaf stage',
        bbchRef: '33',
        description: 'Twelve collared leaves.',
        image: '/assets/corn-growth/weatherstem/corn_growth4_orig.png',
    },
    {
        id: 'V14',
        label: 'Fourteen-leaf stage',
        bbchRef: '35',
        description: 'Rapid growth and maximum water usage nearing.',
        image: '/assets/corn-growth/weatherstem/corn_growth4_orig.png',
    },
    {
        id: 'VT',
        label: 'Tasseling',
        bbchRef: '53',
        description: 'VT is the last vegetative stage, when the tassel is fully emerged and final leaf count is complete.',
        image: '/assets/corn-growth/weatherstem/corn_growth5_orig.png',
    },
    {
        id: 'R1',
        label: 'Silking',
        bbchRef: '69',
        description: 'At R1, silks emerge and capture pollen for pollination to begin in the husk.',
        image: '/assets/corn-growth/weatherstem/corn_growth6_orig.png',
    },
    {
        id: 'R2',
        label: 'Blister',
        bbchRef: '74',
        description: 'In R2 blister, kernels form and fill with fluid while silks dry and darken.',
        image: '/assets/corn-growth/weatherstem/corn_growth7_orig.png',
    },
    {
        id: 'R3',
        label: 'Milk',
        bbchRef: '79',
        description: 'In R3 milk, kernels contain milky fluid as starch accumulation accelerates.',
        image: '/assets/corn-growth/weatherstem/corn_growth8_orig.png',
    },
    {
        id: 'R4',
        label: 'Dough',
        bbchRef: '83',
        description: 'At R4 dough, kernels brighten and thicken as starch content increases.',
        image: '/assets/corn-growth/weatherstem/corn_growth9_orig.png',
    },
    {
        id: 'R5',
        label: 'Dent',
        bbchRef: '87',
        description: 'R5 dent reflects falling moisture and harder kernel texture as maturation advances.',
        image: '/assets/corn-growth/weatherstem/corn_growth10_orig.png',
    },
    {
        id: 'R6',
        label: 'Physiological maturity',
        bbchRef: '89',
        description: 'At R6, kernels have finished growth and reached physiological maturity.',
        image: '/assets/corn-growth/weatherstem/corn_growth11_orig.png',
    },
];

export const CORN_STAGE_IMAGE_ANCHOR_PCT = [
    4.0, 8.5, 13.0, 17.5, 22.0, 31.5, 36.0, 40.5, 48.5,
    56.0, 64.0, 72.0, 80.0, 88.0, 96.0,
];

export function normalizeFarmingStage(stage: Field['farmingStage'] | undefined): FarmingStage {
    if (!stage) return 'fallow';
    return FARM_STAGE_FLOW.includes(stage) ? stage : 'fallow';
}

export function formatStageLabel(stage: string): string {
    const labels: Record<string, string> = {
        fallow: 'Fallow',
        scouted: 'Scouted',
        aerial_surveyed: 'Aerial Surveyed',
        soil_tested: 'Soil Tested',
        plowed: 'Plowed',
        pre_plant_treated: 'Pre-Plant Treated',
        tilled: 'Seedbed Ready',
        growing: 'Growing',
        harvest_ready: 'Harvest Ready',
        harvested: 'Harvested',
        post_harvest: 'Post-Harvest',
        seeded: 'Seeded',
        germination: 'Germination',
        vegetative: 'Vegetative',
        flowering: 'Flowering',
        ripening: 'Ripening',
    };
    return labels[stage] || stage.replace(/_/g, ' ');
}

export function getNextFarmingStage(stage: Field['farmingStage'] | undefined): FarmingStage | null {
    const current = normalizeFarmingStage(stage);
    const idx = FARM_STAGE_FLOW.indexOf(current);
    if (idx === -1 || idx >= FARM_STAGE_FLOW.length - 1) return null;
    return FARM_STAGE_FLOW[idx + 1];
}

export function getCurrentStageLabel(field: Field): string {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage !== 'growing') return stage;
    return field.cropStage && CROP_STAGE_FLOW.includes(field.cropStage) ? field.cropStage : 'seeded';
}

export function getNextStageLabel(field: Field): string | null {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage !== 'growing') return getNextFarmingStage(field.farmingStage);

    const currentCropStage = field.cropStage && CROP_STAGE_FLOW.includes(field.cropStage)
        ? field.cropStage
        : 'seeded';
    const idx = CROP_STAGE_FLOW.indexOf(currentCropStage);
    return idx !== -1 && idx < CROP_STAGE_FLOW.length - 1 ? CROP_STAGE_FLOW[idx + 1] : null;
}

export function getFieldProgressPct(field: Field): number {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage === 'growing') {
        const currentCropStage = field.cropStage && CROP_STAGE_FLOW.includes(field.cropStage)
            ? field.cropStage
            : 'seeded';
        const idx = CROP_STAGE_FLOW.indexOf(currentCropStage);
        return Math.max(0, Math.min(100, ((idx + 1) / CROP_STAGE_FLOW.length) * 100));
    }

    const idx = FARM_STAGE_FLOW.indexOf(stage);
    return Math.max(0, Math.min(100, ((idx + 1) / FARM_STAGE_FLOW.length) * 100));
}

export function mapBbchToCornReferenceStage(bbch: string): number {
    const value = Number.parseInt(bbch, 10);
    if (Number.isNaN(value)) return 0;

    if (value <= 11) return 0;
    if (value <= 12) return 1;
    if (value <= 13) return 2;
    if (value <= 14) return 3;
    if (value <= 16) return 4;
    if (value <= 31) return 5;
    if (value <= 33) return 6;
    if (value <= 35) return 7;
    if (value <= 53) return 8;
    if (value <= 69) return 9;
    if (value <= 74) return 10;
    if (value <= 79) return 11;
    if (value <= 83) return 12;
    if (value <= 87) return 13;
    return 14;
}
