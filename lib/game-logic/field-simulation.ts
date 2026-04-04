// @ts-nocheck
import { Field } from '../mock-data';
import { ServiceItem } from '../marketplace-data';

/**
 * Full farming stage ordering.
 * Corn Focus Mode inserts additional stages; non-corn fields only use
 * the base stages (fallow → scouted → soil_tested → plowed → tilled → growing → harvest_ready → harvested).
 */
export const FARMING_STAGES: Field['farmingStage'][] = [
    'fallow',
    'scouted',
    'aerial_surveyed',  // Corn Focus Mode: drone survey before soil test
    'soil_tested',
    'plowed',
    'pre_plant_treated', // Corn Focus Mode: pre-plant herbicide burndown
    'tilled',
    'growing',
    'harvest_ready',
    'harvested',
    'post_harvest',     // Corn Focus Mode: stalk chopping + residue management
];

export interface OperationResult {
    success: boolean;
    field?: Field;
    error?: string;
}

export const CORN_BBCH_STAGES = [
    { id: '00', label: 'Sowing', stage: 'seeded', heightCm: 0 },
    { id: '05', label: 'Germination', stage: 'germination', heightCm: 2 },
    { id: '11', label: 'Emergence (VE)', stage: 'vegetative', heightCm: 5 },
    { id: '12', label: '1st Leaf (V1)', stage: 'vegetative', heightCm: 10 },
    { id: '13', label: '2nd Leaf (V2)', stage: 'vegetative', heightCm: 15 },
    { id: '14', label: '4th Leaf (V4)', stage: 'vegetative', heightCm: 30 },
    { id: '16', label: '6th Leaf (V6)', stage: 'vegetative', heightCm: 45 },
    { id: '31', label: '10th Leaf (V10)', stage: 'vegetative', heightCm: 80 },
    { id: '33', label: '12th Leaf (V12)', stage: 'vegetative', heightCm: 110 },
    { id: '35', label: '14th Leaf (V14)', stage: 'vegetative', heightCm: 140 },
    { id: '53', label: 'Tasseling (VT)', stage: 'flowering', heightCm: 170 },
    { id: '69', label: 'Silking (R1)', stage: 'flowering', heightCm: 210 },
    { id: '74', label: 'Blister (R2)', stage: 'ripening', heightCm: 220 },
    { id: '79', label: 'Milk Stage (R3)', stage: 'ripening', heightCm: 230 },
    { id: '83', label: 'Dough Stage (R4)', stage: 'ripening', heightCm: 235 },
    { id: '87', label: 'Dent Stage (R5)', stage: 'ripening', heightCm: 240 },
    { id: '89', label: 'Physiological Maturity (R6)', stage: 'harvest_ready', heightCm: 240 },
];

// In Corn Focus Mode, if a field is suitable for corn or is already corn or unplanted, we treat it as corn for operation logic
const isCornField = (field: Field) => {
    if (field.crop?.toLowerCase().includes('corn')) return true;
    if (!field.crop || field.crop === 'Unplanted' || field.crop === 'None') return field.isCornSuitable !== false;
    return false;
};

/**
 * Valid transitions and logic for field operations.
 * cornFocusMode flag enables additional corn-specific stages.
 */
export function canPerformOperation(
    field: Field,
    operationId: string,
    cornFocusMode = false
): { allowed: boolean; error?: string } {
    const stage = field.farmingStage || 'fallow';
    const isCorn = isCornField(field) && cornFocusMode;

    switch (operationId) {
        // ── Scouting & Survey ────────────────────────────────────────────────
        case 'op-scout':
            if (stage !== 'fallow')
                return { allowed: false, error: 'Field has already been scouted or is further in the cycle.' };
            return { allowed: true };

        case 'op-aerial-survey':
            // Corn only. Can be done from fallow or after ground scout.
            if (!isCorn)
                return { allowed: false, error: 'Aerial survey is a Corn Focus Mode operation.' };
            if (stage !== 'fallow' && stage !== 'scouted')
                return { allowed: false, error: 'Aerial survey must be booked before soil testing.' };
            return { allowed: true };

        // ── Soil Testing ─────────────────────────────────────────────────────
        case 'op-soil-test':
            // Corn: requires aerial survey first. Others: requires ground scout.
            if (isCorn && stage !== 'aerial_surveyed' && stage !== 'scouted')
                return { allowed: false, error: 'Complete the aerial survey before soil testing in Corn Focus Mode.' };
            if (!isCorn && stage !== 'scouted')
                return { allowed: false, error: 'Field must be scouted before soil testing.' };
            return { allowed: true };

        // ── Primary Tillage ──────────────────────────────────────────────────
        case 'op-plow':
            if (stage !== 'soil_tested' && stage !== 'post_harvest' && stage !== 'harvested')
                return { allowed: false, error: 'Soil must be tested (or previously harvested) before plowing.' };
            return { allowed: true };

        // ── Pre-Plant Herbicide (Corn Only) ──────────────────────────────────
        case 'op-pre-plant-herbicide':
            if (!isCorn)
                return { allowed: false, error: 'Pre-plant burndown herbicide is a Corn Focus Mode operation.' };
            if (stage !== 'plowed')
                return { allowed: false, error: 'Apply pre-plant herbicide after plowing and before tilling.' };
            return { allowed: true };

        // ── Secondary Tillage ────────────────────────────────────────────────
        case 'op-till':
            // Corn: pre_plant_treated unlocks tilling. Others: plowed unlocks tilling.
            if (isCorn && stage !== 'pre_plant_treated' && stage !== 'plowed')
                return { allowed: false, error: 'Apply pre-plant herbicide before tilling in Corn Focus Mode.' };
            if (!isCorn && stage !== 'plowed')
                return { allowed: false, error: 'Field must be plowed before tilling.' };
            return { allowed: true };

        // ── Planting ─────────────────────────────────────────────────────────
        case 'op-plant':
            if (stage !== 'tilled')
                return { allowed: false, error: 'Field must be tilled before planting.' };
            return { allowed: true };

        // ── In-Season Fertiliser ─────────────────────────────────────────────
        case 'op-apply-fertilizer-incorporated':
            if (!['soil_tested', 'plowed', 'pre_plant_treated', 'tilled'].includes(stage))
                return { allowed: false, error: 'Incorporated fertilizer should be applied during pre-plant tillage operations.' };
            return { allowed: true };

        case 'op-topdress-fertilizer':
            if (stage !== 'growing' && stage !== 'tilled')
                return { allowed: false, error: 'Top-dress fertilizer is used after planting or at final seedbed stage.' };
            return { allowed: true };

        // ── In-Season Protection ─────────────────────────────────────────────
        case 'op-apply-herbicide':
            if (stage !== 'growing' && stage !== 'harvest_ready')
                return { allowed: false, error: 'Herbicide can only be applied while crop is established.' };
            return { allowed: true };

        // ── Irrigation Setup ─────────────────────────────────────────────────
        case 'op-irrigation-setup':
            if (!['soil_tested', 'plowed', 'pre_plant_treated', 'tilled'].includes(stage))
                return { allowed: false, error: 'Irrigation can be set up during field preparation stages.' };
            return { allowed: true };

        // ── Harvest ──────────────────────────────────────────────────────────
        case 'op-harvest':
            if (stage !== 'harvest_ready')
                return { allowed: false, error: 'Crop is not ready for harvest.' };
            return { allowed: true };

        // ── Post-Harvest Residue Management (Corn Only) ──────────────────────
        case 'op-residue-management':
            if (!isCorn)
                return { allowed: false, error: 'Residue management is a Corn Focus Mode operation.' };
            if (stage !== 'harvested')
                return { allowed: false, error: 'Residue management is performed after harvest.' };
            return { allowed: true };

        // ── Marketplace Service Ops ──────────────────────────────────────────
        case 'serv-spray-drone':
        case 'serv-irrigate':
            if (stage !== 'growing' && stage !== 'harvest_ready')
                return { allowed: false, error: 'Field must have growing crops for maintenance.' };
            return { allowed: true };

        default:
            return { allowed: true };
    }
}

export function applyOperation(field: Field, operationId: string, cornFocusMode = false): OperationResult {
    const validation = canPerformOperation(field, operationId, cornFocusMode);
    if (!validation.allowed) return { success: false, error: validation.error };

    const updated = { ...field };
    const isCorn = isCornField(field) && cornFocusMode;

    switch (operationId) {
        // ── Scouting & Survey ────────────────────────────────────────────────
        case 'op-scout':
            updated.farmingStage = 'scouted';
            updated.isScouted = true;
            break;

        case 'op-aerial-survey':
            updated.farmingStage = 'aerial_surveyed';
            updated.isAeriallySurveyed = true;
            updated.isScouted = true; // aerial survey counts as scouting
            // Reveal weed pressure from aerial multispectral data
            updated.weedPressure = Math.random() > 0.5 ? 'medium' : 'low';
            break;

        // ── Soil Testing ─────────────────────────────────────────────────────
        case 'op-soil-test':
            updated.farmingStage = 'soil_tested';
            updated.isSoilTested = true;
            updated.inputStatus = {
                needsWater: false,
                needsNutrients: true, // soil test always flags nutrient baseline as needing attention
                needsProtection: false,
            };
            break;

        // ── Primary Tillage ──────────────────────────────────────────────────
        case 'op-plow':
            updated.farmingStage = 'plowed';
            updated.soilStatus = 'plowed';
            updated.crop = isCorn ? 'Corn' : 'Unplanted';
            updated.cropStage = 'none';
            break;

        // ── Pre-Plant Herbicide (Corn Only) ──────────────────────────────────
        case 'op-pre-plant-herbicide':
            updated.farmingStage = 'pre_plant_treated';
            updated.weedPressure = 'none'; // burndown eliminates existing vegetation
            if (updated.inputStatus) updated.inputStatus.needsProtection = false;
            break;

        // ── Secondary Tillage ────────────────────────────────────────────────
        case 'op-till':
            updated.farmingStage = 'tilled';
            updated.soilStatus = 'tilled';
            break;

        // ── Planting ─────────────────────────────────────────────────────────
        case 'op-plant':
            updated.farmingStage = 'growing';
            updated.cropStage = 'seeded';
            updated.crop = isCorn ? 'Corn' : (updated.crop || 'Unplanted');
            updated.plantingDate = new Date().toISOString().split('T')[0];
            updated.ndviScore = 0.1;
            if (isCorn) {
                updated.bbchStage = '00';
            }
            break;

        // ── In-Season Fertiliser ─────────────────────────────────────────────
        case 'op-apply-fertilizer-incorporated':
            if (updated.inputStatus) updated.inputStatus.needsNutrients = false;
            updated.healthStatus = updated.healthStatus === 'critical' ? 'attention' : 'good';
            break;

        case 'op-topdress-fertilizer':
            if (updated.inputStatus) updated.inputStatus.needsNutrients = false;
            updated.ndviScore = Math.min(0.95, (updated.ndviScore || 0) + 0.08);
            updated.healthStatus = 'good';
            break;

        // ── In-Season Protection ─────────────────────────────────────────────
        case 'op-apply-herbicide':
            if (updated.inputStatus) updated.inputStatus.needsProtection = false;
            updated.weedPressure = 'low';
            updated.diseasePressure = 0;
            updated.diseaseOutbreak = false;
            break;

        // ── Irrigation Setup ─────────────────────────────────────────────────
        case 'op-irrigation-setup':
            updated.irrigationReady = true;
            if (updated.inputStatus) updated.inputStatus.needsWater = false;
            break;

        // ── Harvest ──────────────────────────────────────────────────────────
        case 'op-harvest':
            updated.farmingStage = 'harvested';
            updated.cropStage = 'none';
            updated.crop = 'Unplanted';
            updated.soilStatus = 'compacted';
            updated.ndviScore = 0.05;
            updated.weedPressure = 'none';
            updated.bbchStage = undefined;
            break;

        // ── Post-Harvest Residue Management (Corn Only) ──────────────────────
        case 'op-residue-management':
            updated.farmingStage = 'post_harvest';
            // Stalk chopping improves soil for next season
            updated.soilStatus = 'ready';
            updated.healthStatus = 'good';
            updated.weedPressure = 'none';
            break;

        // ── Marketplace Service Ops ──────────────────────────────────────────
        case 'serv-spray-drone':
            if (updated.inputStatus) updated.inputStatus.needsProtection = false;
            updated.healthStatus = 'excellent';
            updated.diseasePressure = 0;
            updated.diseaseOutbreak = false;
            break;

        case 'serv-irrigate':
            if (updated.inputStatus) updated.inputStatus.needsWater = false;
            break;
    }

    return { success: true, field: updated };
}

/**
 * Simulate crop growth.
 * Called when time advances (e.g. Next Week).
 */
export function advanceFieldGrowth(field: Field, cornFocusMode?: boolean, season?: string): Field {
    if (field.farmingStage !== 'growing' && field.farmingStage !== 'harvest_ready') {
        return field;
    }

    // ── Winter Kill Logic ──────────────────────────────────────────────
    // If we've hit Winter and there's still a crop in the field, it dies/fails.
    if (season === 'Winter') {
        return {
            ...field,
            farmingStage: 'post_harvest',
            cropStage: 'none',
            ndviScore: 0.05,
            healthStatus: 'critical',
            bbchStage: undefined,
            diseasePressure: 0,
            diseaseOutbreak: false,
            // Tag it so we know it was a seasonal failure
            notes: 'Crop failed due to Winter transition (unharvested).'
        };
    }

    // Auto-heal fields corrupted by the Unplanted bug
    let fixedField = { ...field };
    if (cornFocusMode && isCornField(fixedField)) {
        if (fixedField.crop === 'Unplanted') {
            fixedField.crop = 'Corn';
        }
        // If it got to harvest_ready via generic pipeline but BBCH is still '00', reset it to growing
        if (fixedField.farmingStage === 'harvest_ready' && fixedField.bbchStage === '00') {
            fixedField.farmingStage = 'growing';
            fixedField.cropStage = 'seeded';
        }
    }

    // Specialized Corn Focus Growth (BBCH)
    if (cornFocusMode && isCornField(fixedField)) {
        const currentBbch = fixedField.bbchStage || '00';
        let currentIndex = CORN_BBCH_STAGES.findIndex(s => s.id === currentBbch);

        if (currentIndex === -1) {
            // Find closest BBCH if data is orphaned
            const num = parseInt(currentBbch, 10);
            const closest = CORN_BBCH_STAGES.reduce((prev, curr) =>
                Math.abs(parseInt(curr.id, 10) - num) < Math.abs(parseInt(prev.id, 10) - num) ? curr : prev
            );
            currentIndex = CORN_BBCH_STAGES.findIndex(s => s.id === closest.id);
        }

        if (currentIndex === -1 || currentIndex === CORN_BBCH_STAGES.length - 1) {
            // Safety: If we're at R6 but farmingStage isn't harvest_ready, fix it now
            if (currentIndex === CORN_BBCH_STAGES.length - 1 && fixedField.farmingStage !== 'harvest_ready') {
                return { ...fixedField, farmingStage: 'harvest_ready' };
            }
            return fixedField;
        }

        // Growth Calibration Logic: 
        // 60% base chance, but reduces in Autumn to simulate cooling weather
        let advanceChance = 0.6;
        if (season === 'Autumn') {
            advanceChance = 0.45; // Slow down maturity in late season
        }

        if (Math.random() < advanceChance) {
            const next = CORN_BBCH_STAGES[currentIndex + 1];

            // NDVI Simulation for Corn
            let newNdvi = field.ndviScore || 0;
            const progress = currentIndex / CORN_BBCH_STAGES.length;

            if (currentIndex < 6) newNdvi = 0.1 + (progress * 0.4);       // Early veg
            else if (currentIndex < 11) newNdvi = 0.5 + (progress * 0.45); // Rapid growth
            else newNdvi = 0.85 - (progress * 0.3);                        // Senescence

            return {
                ...fixedField,
                bbchStage: next.id,
                cropStage: next.stage as any,
                ndviScore: Math.round(newNdvi * 100) / 100,
                farmingStage: next.id === '89' ? 'harvest_ready' : fixedField.farmingStage
            };
        }
        return fixedField;
    }

    // Standard Crop lifecycle sequence
    const stages: string[] = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'];
    const currentIndex = stages.indexOf(field.cropStage || 'none');

    if (currentIndex === -1 || currentIndex === stages.length - 1) {
        return field;
    }

    // 60% chance per week to advance, also slowing in Autumn
    let advanceChance = 0.6;
    if (season === 'Autumn') {
        advanceChance = 0.45;
    }

    if (Math.random() < advanceChance) {
        const nextStage = stages[currentIndex + 1] as any;

        let newNdvi = field.ndviScore;
        if (nextStage === 'vegetative') newNdvi = 0.4;
        if (nextStage === 'flowering') newNdvi = 0.7;
        if (nextStage === 'ripening') newNdvi = 0.6;
        if (nextStage === 'harvest_ready') newNdvi = 0.55;

        return {
            ...field,
            cropStage: nextStage,
            ndviScore: newNdvi,
            farmingStage: nextStage === 'harvest_ready' ? 'harvest_ready' : field.farmingStage
        };
    }

    return field;
}
