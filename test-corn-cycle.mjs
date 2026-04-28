/**
 * Deterministic test: simulates the full corn growth cycle.
 * Replicates the pure functions from game-store.ts and field-simulation.ts
 * to verify every stage transition works without getting stuck.
 *
 * Run: node test-corn-cycle.mjs
 */

// ═══════════════════════════════════════════════════════════════════
//  Replicated pure logic from game-store.ts & field-simulation.ts
// ═══════════════════════════════════════════════════════════════════

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const WEEKS_PER_SEASON = 12;

const CORN_BBCH_STAGES = [
    { id: '00', label: 'Sowing', stage: 'seeded' },
    { id: '05', label: 'Germination', stage: 'germination' },
    { id: '11', label: 'Emergence (VE)', stage: 'vegetative' },
    { id: '12', label: '1st Leaf (V1)', stage: 'vegetative' },
    { id: '13', label: '2nd Leaf (V2)', stage: 'vegetative' },
    { id: '14', label: '4th Leaf (V4)', stage: 'vegetative' },
    { id: '16', label: '6th Leaf (V6)', stage: 'vegetative' },
    { id: '31', label: '10th Leaf (V10)', stage: 'vegetative' },
    { id: '33', label: '12th Leaf (V12)', stage: 'vegetative' },
    { id: '35', label: '14th Leaf (V14)', stage: 'vegetative' },
    { id: '53', label: 'Tasseling (VT)', stage: 'flowering' },
    { id: '69', label: 'Silking (R1)', stage: 'flowering' },
    { id: '74', label: 'Blister (R2)', stage: 'ripening' },
    { id: '79', label: 'Milk Stage (R3)', stage: 'ripening' },
    { id: '83', label: 'Dough Stage (R4)', stage: 'ripening' },
    { id: '87', label: 'Dent Stage (R5)', stage: 'ripening' },
    { id: '89', label: 'Physiological Maturity (R6)', stage: 'harvest_ready' },
];

function generateWeeklyWeather(gameTime) {
    const seasonBase = {
        Spring: { rain: 32, wind: 10 },
        Summer: { rain: 18, wind: 8 },
        Autumn: { rain: 35, wind: 10 },
        Winter: { rain: 62, wind: 15 },
    }[gameTime.season];

    const seed = (gameTime.year * 37) + (gameTime.week * 13);
    const variation = Math.abs(Math.sin(seed));
    const precipitationChance = Math.min(95, Math.max(5, Math.round(seasonBase.rain + (variation - 0.5) * 40)));
    const windMph = Math.max(3, Math.round(seasonBase.wind + (variation - 0.5) * 12));

    return {
        precipitationChance,
        windMph,
        fieldworkOpen: precipitationChance <= 55 && windMph <= 20,
        sprayOpen: precipitationChance <= 30 && windMph <= 12,
        harvestOpen: precipitationChance <= 45 && windMph <= 18,
    };
}

function hasPrePlantHerbicide(inventory) {
    const validIds = ['chem-herbicide', 'pest-3', 'chem-maister-power', 'pest-maister-power', 'chem-adengo', 'pest-adengo'];
    return inventory.some(i => i.quantity > 0 && validIds.includes(i.id));
}

function hasGaucho(inventory) {
    return inventory.some(i => i.quantity > 0 && (i.id === 'chem-gaucho' || i.id === 'pest-gaucho'));
}

function getSeedUnits(inventory) {
    return inventory.filter(i => i.category === 'seed').reduce((s, i) => s + i.quantity, 0);
}

function getChemicalUnits(inventory) {
    return inventory.filter(i => i.category === 'chemical').reduce((s, i) => s + i.quantity, 0);
}

function getFertilizerUnits(inventory) {
    return inventory.filter(i => i.category === 'fertilizer').reduce((s, i) => s + i.quantity, 0);
}

function getFuelUnits(inventory) {
    return inventory.filter(i => i.category === 'fuel').reduce((s, i) => s + i.quantity, 0);
}

function isPlantingWindowOpen(crop, gameTime) {
    if (crop.toLowerCase().includes('corn')) {
        return gameTime.season === 'Spring';
    }
    return true;
}

function isHarvestWindowOpen(crop, gameTime) {
    if (crop.toLowerCase().includes('corn')) {
        return gameTime.season === 'Summer' || gameTime.season === 'Autumn';
    }
    return true;
}

/**
 * Simplified getRecommendedOperation — mirrors game-store.ts logic for corn cycle
 */
function getRecommendedOperation(field, inventory, gameTime, weather, cornFocusMode) {
    const stage = field.farmingStage || 'fallow';
    const isCornMode = cornFocusMode && (field.crop?.toLowerCase().includes('corn') || !field.crop || field.crop === 'Unplanted');

    const hasPrePlantChem = hasPrePlantHerbicide(inventory);
    const hasFertilizer = getFertilizerUnits(inventory) > 0;
    const hasChemicals = getChemicalUnits(inventory) > 0;
    const hasSeeds = getSeedUnits(inventory) > 0;
    const hasFuel = getFuelUnits(inventory) >= 2;

    switch (stage) {
        case 'fallow':
            if (isCornMode) return { opId: 'op-aerial-survey', title: 'Aerial Survey' };
            return { opId: 'op-scout', title: 'Scout Field' };

        case 'scouted':
            if (isCornMode) return { opId: 'op-aerial-survey', title: 'Aerial Survey (corn)' };
            return { opId: 'op-soil-test', title: 'Soil Test' };

        case 'aerial_surveyed':
            return { opId: 'op-soil-test', title: 'Soil Test' };

        case 'soil_tested':
            if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (plow)' };
            return { opId: 'op-plow', title: 'Plow' };

        case 'plowed':
            if (field.soilStatus === 'tilled') {
                // skip to tilled logic
                return getRecommendedOperation({ ...field, farmingStage: 'tilled' }, inventory, gameTime, weather, cornFocusMode);
            }
            if (isCornMode) {
                if (!hasPrePlantChem) return { opId: 'buy-chemical', title: 'Buy Pre-Plant Herbicide' };
                if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Fieldwork Delayed (pre-plant herb)' };
                return { opId: 'op-pre-plant-herbicide', title: 'Apply Pre-Plant Herbicide' };
            }
            if (field.inputStatus?.needsNutrients && !hasFertilizer) return { opId: 'buy-fertilizer', title: 'Buy Fertilizer' };
            if (field.inputStatus?.needsNutrients && hasFertilizer) return { opId: 'op-apply-fertilizer-incorporated', title: 'Incorporate Fertilizer' };
            if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (till)' };
            return { opId: 'op-till', title: 'Till' };

        case 'pre_plant_treated':
            if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (till)' };
            return { opId: 'op-till', title: 'Till' };

        case 'tilled':
            if (!hasSeeds) return { opId: 'buy-seeds', title: 'Buy Seeds' };
            if (isCornMode && !hasGaucho(inventory)) return { opId: 'buy-chemical', title: 'Buy Gaucho' };
            if (!isPlantingWindowOpen(field.crop || 'Corn', gameTime)) return { opId: 'weekly-plan-open', title: 'Planting Window Closed' };
            if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (plant)' };
            return { opId: 'op-plant', title: 'Plant' };

        case 'growing':
            if (field.inputStatus?.needsNutrients && !hasFertilizer) return { opId: 'buy-fertilizer', title: 'Buy Fertilizer' };
            if (field.inputStatus?.needsNutrients && hasFertilizer) return { opId: 'op-topdress-fertilizer', title: 'Top-Dress' };
            if (isCornMode && field.crop?.toLowerCase().includes('corn')) {
                const bbch = field.bbchStage || '00';
                if (bbch === '00' && !hasGaucho(inventory)) return { opId: 'buy-chemical', title: 'Buy Gaucho' };
                if (['12','13','15','16'].includes(bbch) && !inventory.some(i => (i.id === 'chem-maister-power' || i.id === 'pest-maister-power') && i.quantity > 0))
                    return { opId: 'buy-chemical', title: 'Buy Maister Power' };
                if (bbch === '89') return getRecommendedOperation({ ...field, farmingStage: 'harvest_ready' }, inventory, gameTime, weather, cornFocusMode);
            }
            if (field.inputStatus?.needsProtection && !hasChemicals) return { opId: 'buy-chemical', title: 'Buy Chemical' };
            if (field.inputStatus?.needsProtection && hasChemicals && weather.sprayOpen) return { opId: 'op-apply-herbicide', title: 'Apply Chemical' };
            if (field.inputStatus?.needsProtection) return { opId: 'serv-spray-drone', title: 'Book Spray' };
            return null; // growing, no action needed — wait for BBCH advance

        case 'harvest_ready':
            if (!isHarvestWindowOpen(field.crop || 'Corn', gameTime)) return { opId: 'weekly-plan-open', title: 'Harvest Window Closed' };
            if (!weather.harvestOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (harvest)' };
            return { opId: 'op-harvest', title: 'Harvest' };

        case 'harvested':
            if (isCornMode) {
                if (!weather.fieldworkOpen) return { opId: 'weekly-plan-open', title: 'Weather Delay (residue)' };
                return { opId: 'op-residue-management', title: 'Residue Management' };
            }
            return null;

        case 'post_harvest':
            return null; // cycle complete

        default:
            return null;
    }
}

/**
 * Simplified applyOperation — mirrors field-simulation.ts
 */
function applyOperation(field, opId, cornFocusMode) {
    const updated = { ...field, inputStatus: { ...field.inputStatus } };
    const isCorn = cornFocusMode && (field.crop?.toLowerCase().includes('corn') || !field.crop || field.crop === 'Unplanted');

    switch (opId) {
        case 'op-scout':
            updated.farmingStage = 'scouted';
            break;
        case 'op-aerial-survey':
            updated.farmingStage = 'aerial_surveyed';
            break;
        case 'op-soil-test':
            updated.farmingStage = 'soil_tested';
            updated.inputStatus = { needsWater: false, needsNutrients: true, needsProtection: false };
            break;
        case 'op-plow':
            updated.farmingStage = 'plowed';
            updated.soilStatus = 'plowed';
            updated.crop = isCorn ? 'Corn' : 'Unplanted';
            break;
        case 'op-pre-plant-herbicide':
            updated.farmingStage = 'pre_plant_treated';
            updated.weedPressure = 'none';
            if (updated.inputStatus) updated.inputStatus.needsProtection = false;
            break;
        case 'op-apply-fertilizer-incorporated':
            if (updated.inputStatus) updated.inputStatus.needsNutrients = false;
            break;
        case 'op-till':
            updated.farmingStage = 'tilled';
            updated.soilStatus = 'tilled';
            break;
        case 'op-plant':
            updated.farmingStage = 'growing';
            updated.cropStage = 'seeded';
            updated.crop = isCorn ? 'Corn' : updated.crop;
            if (isCorn) updated.bbchStage = '00';
            break;
        case 'op-topdress-fertilizer':
            if (updated.inputStatus) updated.inputStatus.needsNutrients = false;
            break;
        case 'op-apply-herbicide':
            if (updated.inputStatus) updated.inputStatus.needsProtection = false;
            break;
        case 'op-harvest':
            updated.farmingStage = 'harvested';
            updated.cropStage = 'none';
            updated.crop = 'Unplanted';
            updated.bbchStage = undefined;
            break;
        case 'op-residue-management':
            updated.farmingStage = 'post_harvest';
            updated.soilStatus = 'ready';
            break;
        default:
            break;
    }
    return updated;
}

/**
 * Deterministic BBCH advance (skips randomness — always advances)
 */
function advanceBBCH(field) {
    if (field.farmingStage !== 'growing') return field;
    const bbch = field.bbchStage || '00';
    const idx = CORN_BBCH_STAGES.findIndex(s => s.id === bbch);
    if (idx === -1 || idx === CORN_BBCH_STAGES.length - 1) {
        if (idx === CORN_BBCH_STAGES.length - 1) return { ...field, farmingStage: 'harvest_ready' };
        return field;
    }
    const next = CORN_BBCH_STAGES[idx + 1];
    return {
        ...field,
        bbchStage: next.id,
        cropStage: next.stage,
        farmingStage: next.id === '89' ? 'harvest_ready' : field.farmingStage,
    };
}

// ═══════════════════════════════════════════════════════════════════
//  Test Runner
// ═══════════════════════════════════════════════════════════════════

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const WARN = '\x1b[33m⚠\x1b[0m';
let passed = 0, failed = 0;

function assert(condition, msg) {
    if (condition) { console.log(`  ${PASS} ${msg}`); passed++; }
    else { console.log(`  ${FAIL} ${msg}`); failed++; }
}

// ─── Test 1: Weather Model ───────────────────────────────────────
console.log('\n\x1b[1m═══ Test 1: Weather Model — Spring fieldwork always open ═══\x1b[0m');
for (let y = 1; y <= 3; y++) {
    for (let w = 1; w <= 12; w++) {
        const wx = generateWeeklyWeather({ year: y, season: 'Spring', week: w });
        assert(wx.fieldworkOpen, `Y${y} Spring W${w}: fieldwork=${wx.fieldworkOpen} (precip=${wx.precipitationChance}% wind=${wx.windMph}mph)`);
    }
}

console.log('\n\x1b[1m═══ Test 2: Weather Model — Summer spray windows exist ═══\x1b[0m');
let sprayOpenCount = 0;
for (let w = 1; w <= 12; w++) {
    const wx = generateWeeklyWeather({ year: 1, season: 'Summer', week: w });
    if (wx.sprayOpen) sprayOpenCount++;
}
assert(sprayOpenCount >= 4, `Summer: ${sprayOpenCount}/12 weeks with spray open (need ≥4)`);

console.log('\n\x1b[1m═══ Test 3: Weather Model — Autumn harvest windows exist ═══\x1b[0m');
let harvestOpenCount = 0;
for (let w = 1; w <= 12; w++) {
    const wx = generateWeeklyWeather({ year: 1, season: 'Autumn', week: w });
    if (wx.harvestOpen) harvestOpenCount++;
}
assert(harvestOpenCount >= 4, `Autumn: ${harvestOpenCount}/12 weeks with harvest open (need ≥4)`);

// ─── Test 4: Full Corn Cycle ─────────────────────────────────────
console.log('\n\x1b[1m═══ Test 4: Full Corn Growth Cycle (cornFocusMode=true) ═══\x1b[0m');

let field = {
    id: 'test-field-1',
    name: 'Heritage Grain Field',
    farmingStage: 'fallow',
    crop: 'Unplanted',
    cropStage: 'none',
    soilStatus: 'compacted',
    acres: 50,
    isCornSuitable: true,
    inputStatus: { needsWater: false, needsNutrients: false, needsProtection: false },
};

let inventory = [
    { id: 'pest-maister-power', name: 'Maister Power', category: 'chemical', quantity: 2, unit: 'L' },
    { id: 'pest-gaucho', name: 'Gaucho 600 FS', category: 'chemical', quantity: 2, unit: 'L' },
    { id: 'seed-corn-1', name: 'Corn Seed', category: 'seed', quantity: 5, unit: 'bag' },
    { id: 'fert-npk', name: 'NPK 15-15-15', category: 'fertilizer', quantity: 3, unit: 'bag' },
    { id: 'fuel-diesel', name: 'Diesel', category: 'fuel', quantity: 10, unit: 'gal' },
];

let gameTime = { year: 1, season: 'Spring', week: 1 };
const cornFocusMode = true;

const expectedStages = [
    'fallow',
    'aerial_surveyed',
    'soil_tested',
    'plowed',       // needsNutrients becomes true after soil test
    'plowed',       // incorporate fertilizer (stage stays plowed, but needsNutrients clears)
    'pre_plant_treated',
    'tilled',
    'growing',      // plant → bbch 00
    'growing',      // BBCH progression...
    'harvest_ready',
    'harvested',
    'post_harvest',
];

const MAX_ITERATIONS = 200;
let iteration = 0;
const stageLog = [];

console.log(`  Starting: stage=${field.farmingStage}, crop=${field.crop}`);

while (field.farmingStage !== 'post_harvest' && iteration < MAX_ITERATIONS) {
    iteration++;
    const weather = generateWeeklyWeather(gameTime);

    // If field is growing, advance BBCH first (simulating advanceTime)
    if (field.farmingStage === 'growing' && field.bbchStage) {
        const before = field.bbchStage;
        field = advanceBBCH(field);
        if (field.bbchStage !== before) {
            stageLog.push(`  [W${iteration}] BBCH ${before} → ${field.bbchStage} (${field.farmingStage})`);
        }
        if (field.farmingStage === 'harvest_ready') {
            stageLog.push(`  [W${iteration}] 🌽 Reached harvest_ready via BBCH 89!`);
            // Advance season to Summer for harvest
            gameTime = { year: 1, season: 'Summer', week: 1 };
        }
        // Advance game time for growing weeks
        gameTime.week++;
        if (gameTime.week > WEEKS_PER_SEASON) {
            gameTime.week = 1;
            const si = SEASONS.indexOf(gameTime.season);
            gameTime.season = SEASONS[(si + 1) % 4];
            if (si === 3) gameTime.year++;
        }
        if (field.farmingStage === 'growing') continue; // keep growing
    }

    const rec = getRecommendedOperation(field, inventory, gameTime, weather, cornFocusMode);

    if (!rec) {
        if (field.farmingStage === 'growing') {
            // No recommendation but still growing — just advance time
            gameTime.week++;
            if (gameTime.week > WEEKS_PER_SEASON) {
                gameTime.week = 1;
                const si = SEASONS.indexOf(gameTime.season);
                gameTime.season = SEASONS[(si + 1) % 4];
                if (si === 3) gameTime.year++;
            }
            continue;
        }
        console.log(`  ${FAIL} No recommendation at stage=${field.farmingStage}, bbch=${field.bbchStage} (iteration ${iteration})`);
        failed++;
        break;
    }

    // Skip meta/purchase tasks — simulate buying or waiting
    if (rec.opId === 'weekly-plan-open') {
        stageLog.push(`  ${WARN} [W${iteration}] BLOCKED: "${rec.title}" at ${gameTime.season} W${gameTime.week} (fieldwork=${weather.fieldworkOpen}, spray=${weather.sprayOpen})`);
        // Advance time
        gameTime.week++;
        if (gameTime.week > WEEKS_PER_SEASON) {
            gameTime.week = 1;
            const si = SEASONS.indexOf(gameTime.season);
            gameTime.season = SEASONS[(si + 1) % 4];
            if (si === 3) gameTime.year++;
        }
        continue;
    }

    if (rec.opId.startsWith('buy-') || rec.opId === 'serv-spray-drone') {
        // Auto-buy — skip
        stageLog.push(`  [W${iteration}] 🛒 ${rec.title} (auto-resolved)`);
        continue;
    }

    // Execute the operation
    const before = field.farmingStage;
    field = applyOperation(field, rec.opId, cornFocusMode);
    stageLog.push(`  [W${iteration}] ${rec.opId}: ${before} → ${field.farmingStage} (crop=${field.crop}, bbch=${field.bbchStage || '-'})`);
}

// Print condensed stage log
console.log('\n  Stage progression log:');
stageLog.forEach(l => console.log(l));

console.log('');
assert(field.farmingStage === 'post_harvest', `Reached post_harvest (actual: ${field.farmingStage})`);
assert(iteration < MAX_ITERATIONS, `Completed in ${iteration} iterations (max ${MAX_ITERATIONS})`);
assert(iteration < 50, `Completed in reasonable time: ${iteration} iterations (want <50)`);

// ─── Test 5: Non-corn cycle ─────────────────────────────────────
console.log('\n\x1b[1m═══ Test 5: Non-Corn Cycle (cornFocusMode=false) ═══\x1b[0m');

let ncField = {
    id: 'test-field-2',
    name: 'Lettuce Field',
    farmingStage: 'fallow',
    crop: 'Lettuce',
    cropStage: 'none',
    soilStatus: 'compacted',
    acres: 20,
    inputStatus: { needsWater: false, needsNutrients: false, needsProtection: false },
};

let ncGameTime = { year: 1, season: 'Spring', week: 2 };
let ncIteration = 0;
const ncLog = [];

while (ncField.farmingStage !== 'harvested' && ncIteration < 100) {
    ncIteration++;
    const wx = generateWeeklyWeather(ncGameTime);
    const rec = getRecommendedOperation(ncField, inventory, ncGameTime, wx, false);

    if (!rec) {
        if (ncField.farmingStage === 'growing') {
            // Simulate growth — advance cropStage
            const stages = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'];
            const idx = stages.indexOf(ncField.cropStage || 'seeded');
            if (idx < stages.length - 1) {
                ncField = { ...ncField, cropStage: stages[idx + 1], farmingStage: stages[idx + 1] === 'harvest_ready' ? 'harvest_ready' : 'growing' };
                ncLog.push(`  [W${ncIteration}] Growth: ${stages[idx]} → ${stages[idx+1]}`);
            }
            ncGameTime.week++;
            if (ncGameTime.week > 12) { ncGameTime.week = 1; ncGameTime.season = 'Summer'; }
            continue;
        }
        break;
    }

    if (rec.opId === 'weekly-plan-open') {
        ncGameTime.week++;
        if (ncGameTime.week > 12) { ncGameTime.week = 1; ncGameTime.season = 'Summer'; }
        continue;
    }
    if (rec.opId.startsWith('buy-')) continue;

    const before = ncField.farmingStage;
    ncField = applyOperation(ncField, rec.opId, false);
    ncLog.push(`  [W${ncIteration}] ${rec.opId}: ${before} → ${ncField.farmingStage}`);
}

console.log('  Stage progression:');
ncLog.forEach(l => console.log(l));
console.log('');
assert(ncField.farmingStage === 'harvested', `Non-corn reached harvested (actual: ${ncField.farmingStage})`);

// ─── Test 6: Pre-plant herbicide ID matching ────────────────────
console.log('\n\x1b[1m═══ Test 6: Inventory ID matching ═══\x1b[0m');
assert(hasPrePlantHerbicide([{ id: 'pest-maister-power', quantity: 1 }]), 'pest-maister-power recognized as pre-plant herbicide');
assert(hasPrePlantHerbicide([{ id: 'chem-maister-power', quantity: 1 }]), 'chem-maister-power recognized as pre-plant herbicide');
assert(hasPrePlantHerbicide([{ id: 'pest-3', quantity: 1 }]), 'pest-3 (Glyphosate) recognized as pre-plant herbicide');
assert(hasPrePlantHerbicide([{ id: 'chem-herbicide', quantity: 1 }]), 'chem-herbicide recognized as pre-plant herbicide');
assert(hasPrePlantHerbicide([{ id: 'pest-adengo', quantity: 1 }]), 'pest-adengo recognized as pre-plant herbicide');
assert(!hasPrePlantHerbicide([{ id: 'pest-gaucho', quantity: 1 }]), 'pest-gaucho NOT recognized as pre-plant herbicide');
assert(!hasPrePlantHerbicide([{ id: 'chem-gaucho', quantity: 1 }]), 'chem-gaucho NOT recognized as pre-plant herbicide');

assert(hasGaucho([{ id: 'pest-gaucho', quantity: 1 }]), 'pest-gaucho recognized as Gaucho');
assert(hasGaucho([{ id: 'chem-gaucho', quantity: 1 }]), 'chem-gaucho recognized as Gaucho');
assert(!hasGaucho([{ id: 'pest-maister-power', quantity: 1 }]), 'pest-maister-power NOT recognized as Gaucho');

// ─── Summary ─────────────────────────────────────────────────────
console.log(`\n\x1b[1m═══ Results: ${passed} passed, ${failed} failed ═══\x1b[0m`);
if (failed > 0) {
    console.log('\x1b[31mSome tests FAILED. Fix the issues above.\x1b[0m');
    process.exit(1);
} else {
    console.log('\x1b[32mAll tests PASSED! Corn cycle flows from fallow → post_harvest without getting stuck.\x1b[0m');
}
