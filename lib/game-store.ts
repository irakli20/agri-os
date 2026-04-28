// @ts-nocheck
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { advanceFieldGrowth, applyOperation, canPerformOperation } from './game-logic/field-simulation';
import { applySeasonalPressure } from './game-logic/season-pressure';
import { useFieldStore } from './field-store';
import { EquipmentItem, SERVICES } from './marketplace-data';
import { Field } from './mock-data';
import { ScoutingStorage, buildPlannedAerialParams, buildPerformedAerialParams } from './scouting-data';
import { gameLog, subscribeGameLog } from './game-debug';
import { escalateChallenges, generateSeasonChallenges, getChallengeWeekNumber } from './corn-challenges';
import type { CornChallengeCategory, CornChallengeSeverity, CornChallengeInputType } from './corn-challenges';

const challengeLogKeys = new Set<string>();

// ============================================================================
// Player & Game Types
// ============================================================================

export interface Player {
    id: string;
    username: string;
    email: string;
    passwordHash: string; // Simple hash for demo
    balance: number;
    xp: number;
    level: number;
    reputation: number;
    ownedFieldIds: string[];
    rentedFieldIds: string[];
    createdAt: string;
}

export interface FieldTransaction {
    id: string;
    playerId: string;
    fieldId?: string;
    type: 'income' | 'expense' | 'buy' | 'rent';
    amount: number;
    date: string;
    description?: string;
    category?: string;
    status?: 'completed' | 'pending' | 'cancelled';
    paymentMethod?: string;
}

export type WeeklyChallengePriority = 'critical' | 'high' | 'medium';

export interface WeeklyChallenge {
    id: string;
    title: string;
    description: string;
    priority: WeeklyChallengePriority;
    rewardXp: number;
    fieldId?: string;
    operationId?: string;
    status: 'open' | 'completed' | 'missed';
    category?: CornChallengeCategory;
    severity?: CornChallengeSeverity;
    yieldImpactPct?: number;
    mitigationDescription?: string;
    mitigationCost?: number;
    requiresInput?: { type: CornChallengeInputType; productHint?: string };
    challengeTemplateId?: string;
    symptoms?: string;
    escalationWeeks?: number;
    createdWeek?: number;
}

export interface CompletedChallengeRecord {
    key: string;
    fieldId: string;
    category: CornChallengeCategory;
    completedWeek: number;
    challengeTemplateId?: string;
}

export interface WeeklySummary {
    periodLabel: string;
    completed: number;
    missed: number;
    message: string;
}

export interface WeeklyWeather {
    condition: string;
    windMph: number;
    precipitationChance: number;
    fieldworkOpen: boolean;
    sprayOpen: boolean;
    harvestOpen: boolean;
    dailyForecast: DailyWeather[];
}

export interface DailyWeather {
    day: number;
    label: string;
    condition: string;
    windMph: number;
    precipitationChance: number;
    fieldworkOpen: boolean;
    sprayOpen: boolean;
    harvestOpen: boolean;
}

// ============================================================================
// Constants
// ============================================================================

export const STARTING_BALANCE = 150000;
export const UNLIMITED_TEST_FUNDS = process.env.NEXT_PUBLIC_UNLIMITED_TEST_FUNDS === 'true';
export const XP_PER_PURCHASE = 100;
export const XP_PER_RENTAL = 50;
export const XP_PER_LEVEL = 500;
export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;
export const WEEKS_PER_SEASON = 12; // 3 months * 4 weeks
const WEEKS_PER_YEAR = SEASONS.length * WEEKS_PER_SEASON;
const CORN_SEASON_END: GameTime = { year: 1, season: 'Autumn', week: 12 };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Bump this when the weather model changes to force re-generation of stale persisted weather
const WEATHER_MODEL_VERSION = 2;
const CHALLENGE_COOLDOWN_WEEKS = 4;

function canAfford(balance: number, cost: number): boolean {
    return UNLIMITED_TEST_FUNDS || balance >= cost;
}

function spend(balance: number, cost: number): number {
    return UNLIMITED_TEST_FUNDS ? balance : (balance - cost);
}

// ============================================================================
// Simple hash for demo (NOT for production)
// ============================================================================

function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
}

function mapServiceToOperation(serviceId: string): string {
    const mapping: Record<string, string> = {
        'serv-plow': 'op-plow',
        'serv-till': 'op-till',
        'serv-plant-drill': 'op-plant',
        'serv-plant-manual': 'op-plant',
        'serv-harvest-hand': 'op-harvest',
        'serv-harvest-combine-corn': 'op-harvest',
        'serv-spray-drone': 'serv-spray-drone',
        'serv-irrigate': 'serv-irrigate',
        'serv-aerial-survey': 'op-aerial-survey',
        'serv-pre-plant-herbicide': 'op-pre-plant-herbicide',
        'serv-residue-management': 'op-residue-management',
        'serv-fertilize-incorporated': 'op-apply-fertilizer-incorporated',
        'serv-topdress-fertilizer': 'op-topdress-fertilizer',
    };
    return mapping[serviceId] || serviceId;
}

interface SeasonWindow {
    season: GameTime['season'];
    fromWeek: number;
    toWeek: number;
}

const CROP_CALENDAR: Record<string, { plant: SeasonWindow[]; harvest: SeasonWindow[] }> = {
    lettuce: {
        plant: [{ season: 'Spring', fromWeek: 2, toWeek: 10 }, { season: 'Autumn', fromWeek: 1, toWeek: 8 }],
        harvest: [{ season: 'Summer', fromWeek: 1, toWeek: 8 }, { season: 'Winter', fromWeek: 1, toWeek: 5 }],
    },
    broccoli: {
        plant: [{ season: 'Spring', fromWeek: 1, toWeek: 6 }, { season: 'Autumn', fromWeek: 1, toWeek: 5 }],
        harvest: [{ season: 'Summer', fromWeek: 2, toWeek: 10 }, { season: 'Winter', fromWeek: 1, toWeek: 8 }],
    },
    cauliflower: {
        plant: [{ season: 'Spring', fromWeek: 1, toWeek: 5 }, { season: 'Autumn', fromWeek: 1, toWeek: 5 }],
        harvest: [{ season: 'Summer', fromWeek: 3, toWeek: 10 }, { season: 'Winter', fromWeek: 2, toWeek: 9 }],
    },
    spinach: {
        plant: [{ season: 'Spring', fromWeek: 1, toWeek: 10 }, { season: 'Autumn', fromWeek: 1, toWeek: 10 }],
        harvest: [{ season: 'Spring', fromWeek: 5, toWeek: 12 }, { season: 'Winter', fromWeek: 1, toWeek: 10 }],
    },
    strawberry: {
        plant: [{ season: 'Autumn', fromWeek: 1, toWeek: 8 }],
        harvest: [{ season: 'Spring', fromWeek: 6, toWeek: 12 }, { season: 'Summer', fromWeek: 1, toWeek: 6 }],
    },
    wheat: {
        plant: [{ season: 'Autumn', fromWeek: 1, toWeek: 8 }],
        harvest: [{ season: 'Summer', fromWeek: 1, toWeek: 9 }],
    },
    // Corn: Spring-planted, Autumn harvested
    corn: {
        plant: [{ season: 'Spring', fromWeek: 1, toWeek: 12 }],
        harvest: [
            { season: 'Summer', fromWeek: 1, toWeek: 12 },
            { season: 'Autumn', fromWeek: 1, toWeek: 12 }
        ],
    },
};

function normalizeCropName(crop: string): string {
    const normalized = (crop || 'lettuce').trim().toLowerCase();
    if (normalized.includes('strawberr')) return 'strawberry';
    return normalized;
}

function isCornCandidate(field: Field): boolean {
    if (field.crop?.toLowerCase().includes('corn')) return true;
    if (!field.crop || field.crop === 'Unplanted' || field.crop === 'None') return field.isCornSuitable !== false;
    return field.farmingStage === 'harvested' || field.farmingStage === 'post_harvest';
}

function isWithinSeasonWindow(gameTime: GameTime, windows: SeasonWindow[]): boolean {
    return windows.some(window =>
        window.season === gameTime.season &&
        gameTime.week >= window.fromWeek &&
        gameTime.week <= window.toWeek
    );
}

function isPlantingWindowOpen(crop: string, gameTime: GameTime): boolean {
    const cropKey = normalizeCropName(crop);
    const calendar = CROP_CALENDAR[cropKey];
    if (!calendar) return true;
    return isWithinSeasonWindow(gameTime, calendar.plant);
}

function isHarvestWindowOpen(crop: string, gameTime: GameTime): boolean {
    const cropKey = normalizeCropName(crop);
    const calendar = CROP_CALENDAR[cropKey];
    if (!calendar) return true;
    return isWithinSeasonWindow(gameTime, calendar.harvest);
}

function gameTimeToOrdinal(gameTime: GameTime): number {
    return ((gameTime.year - 1) * WEEKS_PER_YEAR) + (SEASONS.indexOf(gameTime.season) * WEEKS_PER_SEASON) + gameTime.week;
}

function challengeCooldownKey(fieldId?: string, category?: CornChallengeCategory): string | null {
    return fieldId && category ? `${fieldId}:${category}` : null;
}

function pruneCompletedChallengeHistory(history: CompletedChallengeRecord[], currentWeek: number): CompletedChallengeRecord[] {
    return history.filter(record => currentWeek - record.completedWeek < CHALLENGE_COOLDOWN_WEEKS);
}

function recordCompletedSeasonalChallenge(
    history: CompletedChallengeRecord[],
    challenge: WeeklyChallenge | undefined,
    gameTime: GameTime
): CompletedChallengeRecord[] {
    const key = challengeCooldownKey(challenge?.fieldId, challenge?.category);
    if (!challenge?.challengeTemplateId || !challenge.fieldId || !challenge.category || !key) return history;

    const currentWeek = getChallengeWeekNumber(gameTime);
    const pruned = pruneCompletedChallengeHistory(history, currentWeek).filter(record => record.key !== key);
    return [
        ...pruned,
        {
            key,
            fieldId: challenge.fieldId,
            category: challenge.category,
            completedWeek: currentWeek,
            challengeTemplateId: challenge.challengeTemplateId,
        },
    ];
}

function operationResolvesChallenge(challenge: WeeklyChallenge, operationId: string): boolean {
    if (!challenge.challengeTemplateId || challenge.status !== 'open') return false;

    const normalizedOperation = mapServiceToOperation(operationId);
    const normalizedChallengeOperation = mapServiceToOperation(challenge.operationId || '');
    if (operationId === challenge.operationId || normalizedOperation === normalizedChallengeOperation) return true;

    if (challenge.category === 'pest' || challenge.category === 'disease' || challenge.category === 'weed') {
        return ['serv-spray-drone', 'op-apply-herbicide'].includes(operationId) ||
            ['serv-spray-drone', 'op-apply-herbicide'].includes(normalizedOperation);
    }

    if (challenge.category === 'nutrient') {
        return ['op-topdress-fertilizer', 'serv-topdress-fertilizer', 'op-apply-fertilizer-incorporated', 'op-soil-test'].includes(operationId) ||
            ['op-topdress-fertilizer', 'serv-topdress-fertilizer', 'op-apply-fertilizer-incorporated', 'op-soil-test'].includes(normalizedOperation);
    }

    if (challenge.category === 'weather') {
        return ['serv-irrigate', 'op-irrigation-setup', 'op-harvest', 'op-scout'].includes(operationId) ||
            ['serv-irrigate', 'op-irrigation-setup', 'op-harvest', 'op-scout'].includes(normalizedOperation);
    }

    return normalizedOperation === normalizedChallengeOperation;
}

function resolveChallengesForOperation(
    challenges: WeeklyChallenge[],
    fieldId: string | undefined,
    operationId: string,
    gameTime: GameTime,
    completedChallengeHistory: CompletedChallengeRecord[]
): { challenges: WeeklyChallenge[]; completedChallengeHistory: CompletedChallengeRecord[] } {
    let nextHistory = completedChallengeHistory;
    const nextChallenges = challenges.map(challenge => {
        if (challenge.fieldId !== fieldId || !operationResolvesChallenge(challenge, operationId)) return challenge;
        nextHistory = recordCompletedSeasonalChallenge(nextHistory, challenge, gameTime);
        gameLog('CHALLENGE', `Challenge resolved by operation: ${challenge.title}`, {
            challengeId: challenge.id,
            challengeTemplateId: challenge.challengeTemplateId,
            category: challenge.category,
            fieldId: challenge.fieldId,
            operationId,
            severity: challenge.severity,
        });
        return { ...challenge, status: 'completed' as const };
    });

    return { challenges: nextChallenges, completedChallengeHistory: nextHistory };
}

function isAtOrAfterCornSeasonEnd(gameTime: GameTime): boolean {
    return gameTimeToOrdinal(gameTime) >= gameTimeToOrdinal(CORN_SEASON_END);
}

function getNextGameTime(gameTime: GameTime, cornFocusMode = false): GameTime {
    if (cornFocusMode && isAtOrAfterCornSeasonEnd(gameTime)) {
        return gameTime;
    }

    let newWeek = gameTime.week + 1;
    let newSeason = gameTime.season;
    let newYear = gameTime.year;

    if (newWeek > WEEKS_PER_SEASON) {
        newWeek = 1;
        const seasonIndex = SEASONS.indexOf(gameTime.season);
        if (seasonIndex === SEASONS.length - 1) {
            newSeason = 'Spring';
            newYear += 1;
        } else {
            newSeason = SEASONS[seasonIndex + 1];
        }
    }

    const next = { year: newYear, season: newSeason, week: newWeek };
    return cornFocusMode && gameTimeToOrdinal(next) > gameTimeToOrdinal(CORN_SEASON_END)
        ? CORN_SEASON_END
        : next;
}

function generateDailyWeather(gameTime: GameTime): DailyWeather[] {
    const seasonBase = {
        Spring: { rain: 22, wind: 10, condition: 'Unsettled spring fronts' },
        Summer: { rain: 14, wind: 8, condition: 'Dry and stable' },
        Autumn: { rain: 25, wind: 10, condition: 'Cool transition period' },
        Winter: { rain: 62, wind: 15, condition: 'Wet and storm-prone' },
    }[gameTime.season];

    return DAYS.map((label, idx) => {
        const day = idx + 1;
        const variationSeed = (gameTime.year * 37) + (SEASONS.indexOf(gameTime.season) * 19) + (gameTime.week * 13) + (day * 7);
        const rainVariation = Math.sin(variationSeed);
        const windVariation = Math.cos(variationSeed * 0.71);
        const precipitationChance = Math.min(95, Math.max(5, Math.round(seasonBase.rain + rainVariation * 18)));
        const windMph = Math.max(3, Math.round(seasonBase.wind + windVariation * 7));
        return {
            day,
            label,
            condition: seasonBase.condition,
            windMph,
            precipitationChance,
            fieldworkOpen: precipitationChance <= 55 && windMph <= 20,
            sprayOpen: precipitationChance <= 30 && windMph <= 12,
            harvestOpen: precipitationChance <= 45 && windMph <= 18,
        };
    });
}

function generateWeeklyWeather(gameTime: GameTime, shouldLog = true): WeeklyWeather {
    const dailyForecast = generateDailyWeather(gameTime);
    const precipitationChance = Math.round(dailyForecast.reduce((sum, day) => sum + day.precipitationChance, 0) / dailyForecast.length);
    const windMph = Math.round(dailyForecast.reduce((sum, day) => sum + day.windMph, 0) / dailyForecast.length);
    const result = {
        condition: dailyForecast[0]?.condition || 'Stable',
        windMph,
        precipitationChance,
        fieldworkOpen: dailyForecast.some((day) => day.fieldworkOpen),
        sprayOpen: dailyForecast.some((day) => day.sprayOpen),
        harvestOpen: dailyForecast.some((day) => day.harvestOpen),
        dailyForecast,
    };

    if (shouldLog) {
        gameLog('WEATHER', `Generated weather for Y${gameTime.year} ${gameTime.season} W${gameTime.week}`, {
            precip: precipitationChance, wind: windMph,
            fieldwork: result.fieldworkOpen, spray: result.sprayOpen, harvest: result.harvestOpen,
            ...getWeatherLogData(result, gameTime),
        });
    }

    return result;
}

function getWeatherWindowLabel(weather: WeeklyWeather, kind: 'fieldwork' | 'spray' | 'harvest'): string {
    const key = `${kind}Open` as const;
    const day = weather.dailyForecast.find((forecast) => forecast[key]);
    return day ? `${day.label} (${day.precipitationChance}% rain, ${day.windMph} mph wind)` : 'no open day this week';
}

function getSeasonTemperature(gameTime: GameTime): number {
    const baseBySeason: Record<GameTime['season'], number> = {
        Spring: 68,
        Summer: 84,
        Autumn: 62,
        Winter: 42,
    };
    const seasonalArc = Math.round(Math.sin((gameTime.week / WEEKS_PER_SEASON) * Math.PI) * 8);
    return baseBySeason[gameTime.season] + seasonalArc;
}

function getWeatherLogData(weather: WeeklyWeather, gameTime: GameTime) {
    return {
        condition: weather.condition,
        fieldworkOpen: weather.fieldworkOpen,
        sprayOpen: weather.sprayOpen,
        harvestOpen: weather.harvestOpen,
        fieldworkWindow: getWeatherWindowLabel(weather, 'fieldwork'),
        sprayWindow: getWeatherWindowLabel(weather, 'spray'),
        harvestWindow: getWeatherWindowLabel(weather, 'harvest'),
        temperature: getSeasonTemperature(gameTime),
        wind: weather.windMph,
        precipitationChance: weather.precipitationChance,
    };
}

function getOperationLogData(
    field: Field,
    operationId: string,
    resultField: Field | undefined,
    weather: WeeklyWeather,
    gameTime: GameTime,
    cost = 0,
    mode = 'manual',
    reason?: string
) {
    return {
        mode,
        reason,
        operationId,
        fieldId: field.id,
        fieldName: field.name,
        oldStage: field.farmingStage,
        newStage: resultField?.farmingStage || field.farmingStage,
        oldBbch: field.bbchStage,
        bbch: resultField?.bbchStage || field.bbchStage,
        weather: getWeatherLogData(weather, gameTime),
        fieldworkOpen: weather.fieldworkOpen,
        sprayOpen: weather.sprayOpen,
        harvestOpen: weather.harvestOpen,
        temperature: getSeasonTemperature(gameTime),
        wind: weather.windMph,
        precipitationChance: weather.precipitationChance,
        cost,
        acres: field.acres,
        cropType: resultField?.crop || field.crop,
        previousCropType: field.crop,
    };
}

function canWeatherRunOperation(operationId: string, weather: WeeklyWeather, gameTime?: GameTime): { allowed: boolean; reason?: string } {
    const logicalOp = mapServiceToOperation(operationId);
    if (['serv-spray-drone', 'op-apply-herbicide', 'op-pre-plant-herbicide'].includes(logicalOp)) {
        return weather.sprayOpen
            ? { allowed: true }
            : { allowed: false, reason: `spray window closed (${getWeatherWindowLabel(weather, 'spray')})` };
    }
    if (['op-harvest', 'serv-harvest-combine-corn', 'serv-harvest-hand'].includes(logicalOp)) {
        return weather.harvestOpen
            ? { allowed: true }
            : { allowed: false, reason: `harvest window closed (${getWeatherWindowLabel(weather, 'harvest')})` };
    }
    if (['op-plow', 'op-till', 'op-plant', 'op-topdress-fertilizer', 'op-residue-management', 'op-scout', 'op-aerial-survey', 'op-soil-test', 'op-apply-fertilizer-incorporated'].includes(logicalOp)) {
        return weather.fieldworkOpen
            ? { allowed: true }
            : { allowed: false, reason: `fieldwork window closed (${getWeatherWindowLabel(weather, 'fieldwork')})` };
    }
    return { allowed: true };
}

function makeClosedSeasonWeather(): WeeklyWeather {
    return {
        condition: 'Corn season complete',
        windMph: 0,
        precipitationChance: 0,
        fieldworkOpen: false,
        sprayOpen: false,
        harvestOpen: false,
        dailyForecast: [],
    };
}

function getEquipmentCategoryForOperation(operationId: string): EquipmentItem['category'] | null {
    if (['op-plow', 'op-till', 'op-plant', 'op-pre-plant-herbicide'].includes(operationId)) return 'tractor';
    if (operationId === 'op-harvest') return 'harvester';
    if (['serv-spray-drone', 'serv-irrigate', 'op-aerial-survey'].includes(operationId)) return 'drone';
    return null;
}

function hasEquipmentForOperation(equipment: EquipmentItem[], operationId: string): boolean {
    const category = getEquipmentCategoryForOperation(operationId);
    if (!category) return true;
    return equipment.some(eq => eq.category === category);
}

function hasReadyEquipmentForOperation(equipment: EquipmentItem[], operationId: string): boolean {
    const category = getEquipmentCategoryForOperation(operationId);
    if (!category) return true;
    return equipment.some(eq => eq.category === category && eq.status === 'ready');
}

function getSeedUnits(inventory: InventoryItem[]): number {
    return inventory
        .filter(item => item.category === 'seed')
        .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
}

function getCornSeedUnits(inventory: InventoryItem[]): number {
    return inventory
        .filter(item => item.category === 'seed' && (item.id?.includes('corn') || item.name?.toLowerCase().includes('corn')))
        .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
}

function hasGaucho(inventory: InventoryItem[]): boolean {
    return inventory.some(i =>
        i.quantity > 0 &&
        (i.id === 'chem-gaucho' || i.id === 'pest-gaucho')
    );
}

function getFuelUnits(inventory: InventoryItem[]): number {
    return inventory
        .filter(item => item.category === 'fuel')
        .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
}

function getFertilizerUnits(inventory: InventoryItem[]): number {
    return inventory
        .filter(item => item.category === 'fertilizer')
        .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
}

function getChemicalUnits(inventory: InventoryItem[]): number {
    return inventory
        .filter(item => item.category === 'chemical')
        .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
}

function hasPrePlantHerbicide(inventory: InventoryItem[]): boolean {
    // Glyphosate or Maister Power or Adengo qualify as pre-plant burndown
    // Accept both chem-* (planner alias) and pest-* (supplies page) IDs
    const validIds = [
        'chem-herbicide', 'pest-3',              // Glyphosate
        'chem-maister-power', 'pest-maister-power', // Maister Power
        'chem-adengo', 'pest-adengo',             // Adengo
    ];
    return inventory.some(i =>
        i.quantity > 0 && validIds.includes(i.id)
    );
}

function getFuelRequirement(operationId: string, acres: number): number {
    const normalizedAcres = Math.max(1, acres || 1);
    const byOperation: Record<string, number> = {
        'op-plow': Math.ceil(normalizedAcres / 25),
        'op-till': Math.ceil(normalizedAcres / 35),
        'op-pre-plant-herbicide': Math.ceil(normalizedAcres / 40),
        'op-plant': Math.ceil(normalizedAcres / 40),
        'op-harvest': Math.ceil(normalizedAcres / 30),
        'op-residue-management': Math.ceil(normalizedAcres / 50),
    };
    return byOperation[operationId] || 0;
}

function requiresOperator(operationId: string): boolean {
    return ['op-plow', 'op-till', 'op-plant', 'op-harvest', 'op-pre-plant-herbicide', 'op-residue-management'].includes(operationId);
}

function getRecommendedOperation(
    field: Field,
    equipment: EquipmentItem[],
    inventory: InventoryItem[],
    gameTime: GameTime,
    weeklyWeather: WeeklyWeather,
    operatorAssignmentsRemaining: number,
    cornFocusMode?: boolean
): { operationId: string; title: string; priority: WeeklyChallengePriority; description: string } | null {
    const stage = field.farmingStage || 'fallow';
    const hasTractor = equipment.some(eq => eq.category === 'tractor');
    const hasHarvester = equipment.some(eq => eq.category === 'harvester');
    const hasDrone = equipment.some(eq => eq.category === 'drone');
    const hasSeeds = getSeedUnits(inventory) > 0;
    const hasFertilizer = getFertilizerUnits(inventory) > 0;
    const hasChemicals = getChemicalUnits(inventory) > 0;
    const fuelUnits = getFuelUnits(inventory);
    const canUseOwnMachinery = operatorAssignmentsRemaining > 0;

    const isCornMode = cornFocusMode && isCornCandidate(field);
    const hasCornSeeds = getCornSeedUnits(inventory) > 0;
    const hasUrea = inventory.some(i => i.id === 'fert-urea' && i.quantity > 0);
    const hasPrePlantChem = hasPrePlantHerbicide(inventory);
    const gaucho = hasGaucho(inventory);

    // ── CORN STOCKPILING READINESS CHECK ────────────────────────────────────
    // For corn in Corn Focus Mode: before plowing begins, all key inputs must be in stock.
    const isCornStockpiled = !isCornMode || (hasCornSeeds && hasUrea && hasPrePlantChem && fuelUnits >= 1);

    switch (stage) {
        case 'fallow':
            if (isCornMode) {
                // Corn path: prompt aerial survey first (replaces ground scout as first step)
                return hasDrone
                    ? { operationId: 'op-aerial-survey', title: `Run Aerial Survey – ${field.name}`, priority: 'high', description: 'Corn Focus Mode: Run a drone aerial survey to reveal field characteristics (weed pressure, soil zones) before ground preparation.' }
                    : { operationId: 'serv-aerial-survey', title: `Book Aerial Survey – ${field.name}`, priority: 'high', description: 'Corn Focus Mode: Book a drone aerial survey to reveal field characteristics before ground preparation.' };
            }
            return { operationId: 'op-scout', title: `Scout ${field.name}`, priority: 'high', description: 'Run scouting before planning soil work for this season.' };
        case 'scouted':
            if (isCornMode) {
                return hasDrone
                    ? { operationId: 'op-aerial-survey', title: `Run Aerial Survey – ${field.name}`, priority: 'high', description: 'Corn Focus Mode: Complete the drone aerial survey to generate a multispectral prescription map before soil testing.' }
                    : { operationId: 'serv-aerial-survey', title: `Book Aerial Survey – ${field.name}`, priority: 'high', description: 'Corn Focus Mode: Book a drone aerial survey to generate a multispectral prescription map before soil testing.' };
            }
            return { operationId: 'op-soil-test', title: `Soil Test ${field.name}`, priority: 'high', description: 'Get nutrient baseline to avoid inefficient input spend.' };
        case 'aerial_surveyed':
            return { operationId: 'op-soil-test', title: `Soil Test ${field.name}`, priority: 'high', description: 'Soil test next: aerial survey is complete. Get pH and nutrient baseline for fertilizer plan.' };
        case 'soil_tested':
            if (field.soilStatus === 'plowed') {
                // Fallthrough logic to 'plowed' checks if the soil is already turned
                return getRecommendedOperation({ ...field, farmingStage: 'plowed' }, equipment, inventory, gameTime, weeklyWeather, operatorAssignmentsRemaining);
            }
            if (field.inputStatus?.needsNutrients && !hasFertilizer) {
                return { operationId: 'buy-fertilizer', title: `Buy Fertilizer for ${field.name}`, priority: 'high', description: 'Soil test indicates nutrient deficiency. Buy fertilizer before primary tillage.' };
            }
            if (field.inputStatus?.needsNutrients && hasFertilizer) {
                return { operationId: 'op-apply-fertilizer-incorporated', title: `Apply Fertilizer During Tillage (${field.name})`, priority: 'high', description: 'Incorporate base fertilizer ahead of plowing/seedbed operations.' };
            }
            if (!weeklyWeather.fieldworkOpen) {
                return { operationId: 'weekly-plan-open', title: `Weather Delay: ${field.name}`, priority: 'high', description: `Fieldwork hold this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind). Re-plan or hire service next window.` };
            }
            if (hasTractor && !hasReadyEquipmentForOperation(equipment, 'op-plow')) {
                return { operationId: 'maint-equipment', title: `Service Tractor Fleet`, priority: 'high', description: 'Your tractor is in maintenance status. Service equipment before in-house tillage.' };
            }
            if (hasTractor && fuelUnits < getFuelRequirement('op-plow', field.acres)) {
                return { operationId: 'buy-fuel', title: `Buy Fuel for ${field.name}`, priority: 'high', description: 'Fuel stock is too low for plowing. Refill diesel in Supplies Marketplace.' };
            }
            return hasTractor
                ? canUseOwnMachinery
                    ? { operationId: 'op-plow', title: `Plow ${field.name} (Own Tractor)`, priority: 'medium', description: 'Use your owned tractor to plow and save contractor costs.' }
                    : { operationId: 'serv-plow', title: `Book Plowing for ${field.name}`, priority: 'high', description: 'No operators available this week. Book provider to avoid delay.' }
                : { operationId: 'serv-plow', title: `Book Plowing for ${field.name}`, priority: 'medium', description: 'Book a machinery provider to plow the field.' };
        case 'plowed':
            if (field.soilStatus === 'tilled') {
                return getRecommendedOperation({ ...field, farmingStage: 'tilled' }, equipment, inventory, gameTime, weeklyWeather, operatorAssignmentsRemaining, cornFocusMode);
            }
            // ── Corn: pre-plant herbicide burndown is mandatory before tilling ──
            if (isCornMode) {
                if (!hasPrePlantChem) return { operationId: 'buy-chemical', title: `Buy Pre-Plant Herbicide for ${field.name}`, priority: 'critical', description: 'Corn Focus Mode: glyphosate/Maister Power burndown is required after plowing before tilling.' };
                if (!weeklyWeather.fieldworkOpen) return { operationId: 'weekly-plan-open', title: `Fieldwork Delayed – ${field.name}`, priority: 'high', description: `Pre-plant herbicide application blocked by weather (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind). Wait for drier conditions.` };
                return hasTractor
                    ? canUseOwnMachinery
                        ? { operationId: 'op-pre-plant-herbicide', title: `Apply Pre-Plant Herbicide – ${field.name}`, priority: 'critical', description: 'Apply glyphosate/Maister Power burndown to kill off weeds before seedbed preparation.' }
                        : { operationId: 'serv-pre-plant-herbicide', title: `Book Pre-Plant Herbicide Service – ${field.name}`, priority: 'critical', description: 'No operators available. Book contractor for herbicide burndown.' }
                    : { operationId: 'serv-pre-plant-herbicide', title: `Book Pre-Plant Herbicide Service – ${field.name}`, priority: 'critical', description: 'Book herbicide contractor for burndown before tilling.' };
            }
            if (field.inputStatus?.needsNutrients && !hasFertilizer) {
                return { operationId: 'buy-fertilizer', title: `Buy Fertilizer for ${field.name}`, priority: 'high', description: 'Nutrient correction pending. Buy fertilizer to continue with balanced crop establishment.' };
            }
            if (field.inputStatus?.needsNutrients && hasFertilizer) {
                return { operationId: 'op-apply-fertilizer-incorporated', title: `Incorporate Fertilizer (${field.name})`, priority: 'high', description: 'Apply fertilizer now while soil is open before planting.' };
            }
            if (!weeklyWeather.fieldworkOpen) {
                return { operationId: 'weekly-plan-open', title: `Weather Delay: ${field.name}`, priority: 'high', description: `Tillage blocked by weather (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).` };
            }
            if (hasTractor && !hasReadyEquipmentForOperation(equipment, 'op-till')) {
                return { operationId: 'maint-equipment', title: `Service Tractor Fleet`, priority: 'high', description: 'Your tractor is in maintenance status. Service equipment before tillage.' };
            }
            if (hasTractor && fuelUnits < getFuelRequirement('op-till', field.acres)) {
                return { operationId: 'buy-fuel', title: `Buy Fuel for ${field.name}`, priority: 'high', description: 'Fuel stock is too low for tillage. Refill diesel in Supplies Marketplace.' };
            }
            return hasTractor
                ? canUseOwnMachinery
                    ? { operationId: 'op-till', title: `Till ${field.name} (Own Tractor)`, priority: 'medium', description: 'Use your owned tractor for seedbed preparation.' }
                    : { operationId: 'serv-till', title: `Book Tilling for ${field.name}`, priority: 'high', description: 'No operators available this week. Book tillage service.' }
                : { operationId: 'serv-till', title: `Book Tilling for ${field.name}`, priority: 'medium', description: 'Book tilling service to finalize seedbed prep.' };
        case 'pre_plant_treated':
            // Corn Focus Mode only: after herbicide burndown, proceed to tilling
            if (!weeklyWeather.fieldworkOpen) {
                return { operationId: 'weekly-plan-open', title: `Weather Delay: ${field.name}`, priority: 'high', description: `Tilling blocked by weather (${weeklyWeather.precipitationChance}% rain). Herbicide has been applied – wait for field access.` };
            }
            if (hasTractor && !hasReadyEquipmentForOperation(equipment, 'op-till')) {
                return { operationId: 'maint-equipment', title: `Service Tractor Fleet`, priority: 'high', description: 'Tractor not ready. Service before tilling the treated seedbed.' };
            }
            if (hasTractor && fuelUnits < getFuelRequirement('op-till', field.acres)) {
                return { operationId: 'buy-fuel', title: `Buy Fuel for ${field.name}`, priority: 'high', description: 'Fuel stock is too low for tilling the treated seedbed.' };
            }
            return hasTractor
                ? canUseOwnMachinery
                    ? { operationId: 'op-till', title: `Till Treated Seedbed – ${field.name}`, priority: 'critical', description: 'Herbicide burndown complete. Till now while soil conditions are optimal.' }
                    : { operationId: 'serv-till', title: `Book Tilling – ${field.name}`, priority: 'critical', description: 'Book tillage contractor to prepare the treated seedbed.' }
                : { operationId: 'serv-till', title: `Book Tilling – ${field.name}`, priority: 'critical', description: 'Book tillage contractor for the pre-treated seedbed.' };
        case 'tilled':
            if (field.inputStatus?.needsNutrients && !hasFertilizer) {
                return { operationId: 'buy-fertilizer', title: `Buy Fertilizer for ${field.name}`, priority: 'high', description: 'Nutrients are still below target. Buy fertilizer now (top-dress or incorporate).' };
            }
            if (field.inputStatus?.needsNutrients && hasFertilizer) {
                return { operationId: 'op-topdress-fertilizer', title: `Top-Dress Fertilizer (${field.name})`, priority: 'high', description: 'Apply fertilizer before/at planting to improve early vigor.' };
            }
            // ── Corn: Gaucho seed treatment required before planting ─────────
            if (isCornMode && !gaucho) {
                return { operationId: 'buy-chemical', title: `Buy Gaucho Seed Treatment – ${field.name}`, priority: 'critical', description: 'Corn Focus Mode: Gaucho seed treatment (imidacloprid) is required before planting to protect against wireworms and soil pests. Buy from Supplies Marketplace.' };
            }
            const targetCrop = isCornMode || field.crop?.toLowerCase().includes('corn') ? 'Corn' : field.crop;
            if (!isPlantingWindowOpen(targetCrop, gameTime)) {
                return { operationId: 'weekly-plan-open', title: `Planting Window Closed (${field.name})`, priority: 'critical', description: `${targetCrop} planting window is closed in ${gameTime.season} W${gameTime.week}. Hold or rotate crop plan.` };
            }
            if (!weeklyWeather.fieldworkOpen) {
                return { operationId: 'weekly-plan-open', title: `Weather Delay: ${field.name}`, priority: 'high', description: `Planting blocked by weather (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).` };
            }
            if (isCornMode ? !hasCornSeeds : !hasSeeds) {
                return { operationId: 'buy-seeds', title: `Buy ${isCornMode ? 'Corn Seeds' : 'Seeds'} for ${field.name}`, priority: 'critical', description: isCornMode ? 'Purchase certified corn seed bags from Supplies Marketplace before planting.' : 'Purchase seeds in Supplies Marketplace before planting.' };
            }
            if (hasTractor && !hasReadyEquipmentForOperation(equipment, 'op-plant')) {
                return { operationId: 'maint-equipment', title: `Service Tractor Fleet`, priority: 'high', description: 'Your planting equipment is in maintenance status.' };
            }
            if (hasTractor && fuelUnits < getFuelRequirement('op-plant', field.acres)) {
                return { operationId: 'buy-fuel', title: `Buy Fuel for ${field.name}`, priority: 'high', description: 'Fuel stock is too low for planting. Refill diesel before dispatch.' };
            }
            return hasTractor
                ? canUseOwnMachinery
                    ? { operationId: 'op-plant', title: `Plant ${field.name}${isCornMode ? ' (Corn – Gaucho Applied)' : ' (Own Machinery)'}`, priority: 'critical', description: isCornMode ? 'Plant corn with Gaucho seed treatment applied. Precision drilling at optimal depth.' : 'Plant now using your own machinery and seed stock.' }
                    : { operationId: 'serv-plant-drill', title: `Book Planting for ${field.name}`, priority: 'critical', description: 'No operators available this week. Book planting service.' }
                : { operationId: 'serv-plant-drill', title: `Book Planting for ${field.name}`, priority: 'critical', description: 'Book planting crew/equipment this week to avoid delays.' };
        case 'growing':
            if (field.inputStatus?.needsNutrients && !hasFertilizer) {
                return { operationId: 'buy-fertilizer', title: `Buy Fertilizer for ${field.name}`, priority: 'high', description: 'Crop vigor is below target. Buy fertilizer for in-season top-dressing.' };
            }
            if (field.inputStatus?.needsNutrients && hasFertilizer) {
                return { operationId: 'op-topdress-fertilizer', title: `Top-Dress ${field.name}`, priority: 'high', description: 'Apply in-season fertilizer to improve vegetative vigor.' };
            }

            // Corn Specific Recommendations
            if (cornFocusMode && field.crop?.toLowerCase().includes('corn')) {
                const bbch = field.bbchStage || '00';

                if (bbch === '00' && !inventory.some(i => (i.id === 'chem-gaucho' || i.id === 'pest-gaucho') && i.quantity > 0)) {
                    return { operationId: 'buy-chemical', title: `Buy Gaucho for ${field.name}`, priority: 'high', description: 'BBCH 00: Seed treatment with Gaucho protects against wireworms and soil pests.' };
                }

                if ((bbch === '12' || bbch === '13' || bbch === '15' || bbch === '16') && !inventory.some(i => (i.id === 'chem-maister-power' || i.id === 'pest-maister-power') && i.quantity > 0)) {
                    return { operationId: 'buy-chemical', title: `Buy Maister Power for ${field.name}`, priority: 'high', description: `BBCH ${bbch}: Critical window for broad-spectrum weed control in corn. Maister Power recommended.` };
                }

                if (bbch === '11' && !inventory.some(i => (i.id === 'chem-adengo' || i.id === 'pest-adengo') && i.quantity > 0)) {
                    return { operationId: 'buy-chemical', title: `Buy Adengo for ${field.name}`, priority: 'high', description: 'BBCH 11: Early post-emergence weed control window. Adengo is highly effective now.' };
                }

                if (field.inputStatus?.needsProtection && (bbch === '53' || bbch === '69')) {
                    return { operationId: 'buy-chemical', title: `Buy Decis Expert for ${field.name}`, priority: 'high', description: 'Flowering Stage: Corn borer and aphids risk. Decis Expert provides rapid control.' };
                }

                // BBCH 89 (R6 - Physiological Maturity) - Immediate Harvest Recommmendation
                if (bbch === '89') {
                    return getRecommendedOperation({ ...field, farmingStage: 'harvest_ready' }, equipment, inventory, gameTime, weeklyWeather, operatorAssignmentsRemaining, cornFocusMode);
                }
            }

            // CRITICAL: Disease Outbreak
            if (field.diseaseOutbreak) {
                if (!hasChemicals) {
                    return { operationId: 'buy-chemical', title: `CRITICAL: Fungal Blight (${field.name})`, priority: 'critical', description: 'Active outbreak! Yield dropping. Buy fungicide immediately.' };
                }
                if (hasChemicals && weeklyWeather.sprayOpen) {
                    return { operationId: 'op-apply-herbicide', title: `CRITICAL: Apply Fungicide (${field.name})`, priority: 'critical', description: 'Active outbreak! Yield dropping. Execute emergency spray now.' };
                }
                return { operationId: 'serv-spray-drone', title: `EMERGENCY: Drone Spray (${field.name})`, priority: 'critical', description: 'Active outbreak! Yield dropping. Book emergency drone spraying.' };
            }

            if (field.inputStatus?.needsProtection && !hasChemicals) {
                return { operationId: 'buy-chemical', title: `Buy Herbicide/Chemical for ${field.name}`, priority: 'high', description: 'Protection needed. Buy herbicide/chemical input based on survey map.' };
            }
            if (field.inputStatus?.needsProtection && hasChemicals && weeklyWeather.sprayOpen) {
                return { operationId: 'op-apply-herbicide', title: `Apply Chemical Program (${field.name})`, priority: 'high', description: 'Execute variable-rate protection from drone/multispectral prescription map.' };
            }
            if (field.inputStatus?.needsProtection) {
                return { operationId: 'serv-spray-drone', title: `Book Spray Service for ${field.name}`, priority: 'high', description: 'Protection needed. Book drone spray service for current risk window.' };
            }
            return null;
        case 'harvest_ready':
            // ── Priority Operational Gates (Fuel & Maintenance) ──────────
            if (hasHarvester && !hasReadyEquipmentForOperation(equipment, 'op-harvest')) {
                return { operationId: 'maint-equipment', title: `Service Harvester Fleet`, priority: 'critical', description: 'Your harvester is in maintenance status. Service before grain loss increases.' };
            }
            if (hasHarvester && fuelUnits < getFuelRequirement('op-harvest', field.acres)) {
                return { operationId: 'buy-fuel', title: `Buy Fuel for ${field.name}`, priority: 'critical', description: 'Fuel stock is too low for harvest. Refill diesel immediately.' };
            }

            // ── Window Gates ─────────────────────────────────────────────
            // Bypass seasonal window if already at harvest_ready stage (R6/Maturity)
            const seasonalWindowOpen = isHarvestWindowOpen(field.crop, gameTime);
            if (!seasonalWindowOpen && field.farmingStage !== 'harvest_ready') {
                return { operationId: 'weekly-plan-open', title: `Harvest Window Closed (${field.name})`, priority: 'critical', description: `${field.crop} harvest window is not open in ${gameTime.season} W${gameTime.week}. Hold and monitor quality.` };
            }
            if (!weeklyWeather.harvestOpen) {
                return { operationId: 'weekly-plan-open', title: `Weather Delay: ${field.name}`, priority: 'critical', description: `Harvest blocked this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).` };
            }
            return hasHarvester
                ? canUseOwnMachinery
                    ? { operationId: 'op-harvest', title: `Harvest ${field.name} (Own Harvester)`, priority: 'critical', description: isCornMode ? 'Use your combine to harvest corn at physiological maturity (BBCH 89).' : 'Use your combine to harvest at peak maturity.' }
                    : isCornMode
                        ? { operationId: 'serv-harvest-combine-corn', title: `Book Corn Combine – ${field.name}`, priority: 'critical', description: 'Operator shortage this week. Book corn combine service to avoid field losses.' }
                        : { operationId: 'serv-harvest-hand', title: `Book Harvest Crew for ${field.name}`, priority: 'critical', description: 'Operator shortage this week. Book harvest crew to avoid quality loss.' }
                : isCornMode
                    ? { operationId: 'serv-harvest-combine-corn', title: `Book Corn Combine – ${field.name}`, priority: 'critical', description: 'No harvester owned. Book corn combine service to secure the crop.' }
                    : { operationId: 'serv-harvest-hand', title: `Book Harvest Crew for ${field.name}`, priority: 'critical', description: 'Book harvest service now to secure crop value.' };
        case 'harvested':
            if (isCornMode) {
                if (!weeklyWeather.fieldworkOpen) {
                    return { operationId: 'weekly-plan-open', title: `Weather Delay – Post-Harvest (${field.name})`, priority: 'medium', description: `Stalk chopping blocked by weather (${weeklyWeather.precipitationChance}% rain). Schedule residue management next week.` };
                }
                return hasTractor
                    ? canUseOwnMachinery
                        ? { operationId: 'op-residue-management', title: `Chop Stalks & Manage Residue – ${field.name}`, priority: 'high', description: 'Corn Focus Mode: Chop and incorporate corn stalks to prevent disease carry-over and improve soil for next season.' }
                        : { operationId: 'serv-residue-management', title: `Book Residue Management – ${field.name}`, priority: 'high', description: 'No operators available. Book a contractor for stalk chopping and residue management.' }
                    : { operationId: 'serv-residue-management', title: `Book Residue Management – ${field.name}`, priority: 'high', description: 'Book a contractor for post-harvest stalk chopping and soil recovery.' };
            }
            // Non-corn: recommend starting next season
            return hasTractor
                ? { operationId: 'op-plow', title: `Start Next Season – Plow ${field.name}`, priority: 'medium', description: 'Begin preparing this field for the next growing season.' }
                : { operationId: 'serv-plow', title: `Book Pre-Season Plowing – ${field.name}`, priority: 'medium', description: 'Book plowing service to begin next season preparation.' };
        case 'post_harvest':
            if (isCornMode) {
                return null;
            }
            // After residue management: cycle restarts with plowing
            return hasTractor
                ? canUseOwnMachinery
                    ? { operationId: 'op-plow', title: `Start Next Corn Season – Plow ${field.name}`, priority: 'medium', description: 'Residue managed. Plow now to begin the next corn growing cycle.' }
                    : { operationId: 'serv-plow', title: `Book Pre-Season Plowing – ${field.name}`, priority: 'medium', description: 'Book plowing service to kick off the next corn season.' }
                : { operationId: 'serv-plow', title: `Book Pre-Season Plowing – ${field.name}`, priority: 'medium', description: 'Book plowing to start the next corn growing cycle.' };
        default:
            return null;
    }
}

function generateChallengesForFields(
    fields: Field[],
    equipment: EquipmentItem[],
    inventory: InventoryItem[],
    gameTime: GameTime,
    weeklyWeather: WeeklyWeather,
    operatorAssignmentsRemaining: number,
    isAutoIrrigationEnabled?: boolean,
    isAutoProcurementEnabled?: boolean,
    isAutoFieldOpsEnabled?: boolean,
    isAutoBookingEnabled?: boolean,
    cornFocusMode?: boolean,
    existingWeeklyChallenges: WeeklyChallenge[] = [],
    completedChallengeHistory: CompletedChallengeRecord[] = []
): WeeklyChallenge[] {
    const challenges: WeeklyChallenge[] = [];
    const currentWeek = getChallengeWeekNumber(gameTime);
    const fieldIds = new Set(fields.map(field => field.id));
    const recentCompletedKeys = new Set(
        pruneCompletedChallengeHistory(completedChallengeHistory, currentWeek).map(record => record.key)
    );
    const seasonalChallenges: WeeklyChallenge[] = existingWeeklyChallenges.filter(challenge =>
        challenge.status === 'open' &&
        !!challenge.challengeTemplateId &&
        !!challenge.fieldId &&
        fieldIds.has(challenge.fieldId) &&
        !recentCompletedKeys.has(challengeCooldownKey(challenge.fieldId, challenge.category) || '')
    );
    const activeSeasonalKeys = new Set(
        seasonalChallenges.map(challenge => challengeCooldownKey(challenge.fieldId, challenge.category)).filter(Boolean)
    );

    const hasMachinery = equipment.some(eq => ['tractor', 'harvester'].includes(eq.category));
    
    // Equipment maintenance automated by Auto-Ops
    if (!isAutoFieldOpsEnabled && equipment.some(eq => eq.status === 'maintenance')) {
        challenges.push({
            id: `wk-maint-${Date.now()}`,
            title: 'Service Equipment in Maintenance',
            description: 'At least one machine is unavailable. Service it or rely on marketplace providers this week.',
            priority: 'high',
            rewardXp: 30,
            operationId: 'maint-equipment',
            status: 'open',
        });
    }

    fields.forEach((field, idx) => {
        const newSeasonalChallenges = generateSeasonChallenges(gameTime, field, cornFocusMode).filter(challenge => {
            const key = challengeCooldownKey(challenge.fieldId, challenge.category);
            if (!key) return true;
            if (recentCompletedKeys.has(key)) return false;
            if (activeSeasonalKeys.has(key)) return false;
            activeSeasonalKeys.add(key);
            return true;
        });
        seasonalChallenges.push(...newSeasonalChallenges);

        const recommended = getRecommendedOperation(field, equipment, inventory, gameTime, weeklyWeather, operatorAssignmentsRemaining, cornFocusMode);
        const recommendedOperationId = recommended?.operationId || null;
        const challengeLogKey = [
            gameTime.year,
            gameTime.season,
            gameTime.week,
            field.id,
            field.farmingStage || 'unknown',
            recommendedOperationId || 'null',
        ].join(':');

        if (!challengeLogKeys.has(challengeLogKey)) {
            challengeLogKeys.add(challengeLogKey);
            if (challengeLogKeys.size > 500) {
                const oldest = challengeLogKeys.values().next().value;
                if (oldest) challengeLogKeys.delete(oldest);
            }
            gameLog('CHALLENGE', `Field "${field.name}" (${field.farmingStage}) → ${recommendedOperationId || 'null'}`, {
                fieldId: field.id,
                stage: field.farmingStage,
                cropStage: field.cropStage,
                bbch: field.bbchStage,
                needsNutrients: field.inputStatus?.needsNutrients,
                needsProtection: field.inputStatus?.needsProtection,
                needsWater: field.inputStatus?.needsWater,
                recommended: recommendedOperationId,
                title: recommended?.title,
                weatherFieldwork: weeklyWeather.fieldworkOpen,
                weatherSpray: weeklyWeather.sprayOpen,
            });
        }
        const validationOp = recommended ? mapServiceToOperation(recommended.operationId) : null;
        const isPurchasingTask =
            recommended?.operationId === 'buy-seeds' ||
            recommended?.operationId === 'buy-fuel' ||
            recommended?.operationId === 'buy-fertilizer' ||
            recommended?.operationId === 'buy-chemical';
        
        // Skip challenges if their respective autopilots are active
        if (isPurchasingTask && isAutoProcurementEnabled) return;
        
        const isBookingTask = recommended?.operationId?.startsWith('serv-');
        if (isBookingTask && isAutoBookingEnabled) return;

        const isDirectFieldOp = recommended?.operationId?.startsWith('op-');
        if (isDirectFieldOp && isAutoFieldOpsEnabled) return;

        // Special case for irrigation/spraying which might be tagged as op or serv
        if ((recommended?.operationId === 'serv-irrigate' || recommended?.operationId === 'op-irrigation-setup') && (isAutoFieldOpsEnabled || isAutoBookingEnabled)) return;
        if (recommended?.operationId === 'maint-equipment' && isAutoFieldOpsEnabled) return;

        const isMetaTask = recommended?.operationId === 'maint-equipment' || recommended?.operationId === 'hire-operator' || recommended?.operationId === 'weekly-plan-open';
        if (recommended && (isMetaTask || isPurchasingTask || (validationOp && canPerformOperation(field, validationOp, cornFocusMode).allowed))) {
            challenges.push({
                id: `wk-op-${Date.now()}-${idx}`,
                title: recommended.title,
                description: recommended.description,
                priority: recommended.priority,
                rewardXp: recommended.priority === 'critical' ? 70 : recommended.priority === 'high' ? 50 : 30,
                fieldId: field.id,
                operationId: recommended.operationId,
                status: 'open',
            });
        }

        if (!isAutoIrrigationEnabled && !isAutoFieldOpsEnabled && field.farmingStage === 'growing' && field.inputStatus?.needsWater && recommendedOperationId !== 'serv-irrigate') {
            challenges.push({
                id: `wk-water-${field.id}-${Date.now()}`,
                title: `Irrigate ${field.name}`,
                description: weeklyWeather.fieldworkOpen
                    ? 'Water stress detected. Book irrigation support this week.'
                    : `Water stress detected, but weather is unstable (${weeklyWeather.precipitationChance}% rain). Watch the next window closely.`,
                priority: 'high',
                rewardXp: 40,
                fieldId: field.id,
                operationId: 'serv-irrigate',
                status: 'open',
            });
        }

        if (!isAutoFieldOpsEnabled && field.farmingStage === 'growing' && field.inputStatus?.needsProtection && !['serv-spray-drone', 'op-apply-herbicide', 'buy-chemical'].includes(recommendedOperationId || '')) {
            challenges.push({
                id: `wk-protect-${field.id}-${Date.now()}`,
                title: `Protect ${field.name}`,
                description: weeklyWeather.sprayOpen
                    ? `Apply crop protection to reduce active risk pressure${field.weedPressure && field.weedPressure !== 'none' ? ` (weed pressure: ${field.weedPressure})` : ''}.`
                    : `Spray window is currently closed (${weeklyWeather.windMph} mph wind / ${weeklyWeather.precipitationChance}% rain). Queue next suitable slot.`,
                priority: 'high',
                rewardXp: 45,
                fieldId: field.id,
                operationId: 'serv-spray-drone',
                status: 'open',
            });
        }
    });

    return [...seasonalChallenges.slice(0, 3), ...challenges].slice(0, 8);
}

// ============================================================================
// Game Store
// ============================================================================

interface GameStore {
    // Mode
    gameMode: boolean;
    toggleGameMode: () => void;
    cornFocusMode: boolean;
    toggleCornFocusMode: () => void;

    // Auth
    currentPlayerId: string | null;
    players: Player[];
    transactions: FieldTransaction[];
    deletedFieldIds: string[];

    // Auth Actions
    signup: (username: string, email: string, password: string) => { success: boolean; error?: string };
    login: (email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;

    // Game Actions
    buyField: (fieldId: string, price: number) => { success: boolean; error?: string };
    rentField: (fieldId: string, price: number) => { success: boolean; error?: string };
    addXp: (amount: number) => void;
    addFunds: (amount: number) => void;

    // Helpers
    getCurrentPlayer: () => Player | null;

    // Phase 3: Dynamic Growth & Resources
    inventory: InventoryItem[];
    equipment: EquipmentItem[];
    gameTime: GameTime;
    weeklyWeather: WeeklyWeather;
    operatorCapacity: number;
    operatorAssignmentsUsed: number;
    activeRentals: ActiveRental[];
    weeklyChallenges: WeeklyChallenge[];
    completedChallengeHistory: CompletedChallengeRecord[];
    weekSummary: WeeklySummary | null;
    isWeeklyPlannerOpen: boolean;
    guideTargetId: string | null;
    guideMessage: string | null;
    pendingOrders: Array<{ id: string, operationId: string, fieldId: string, name: string }>;

    buySupplies: (item: InventoryItem, cost: number) => { success: boolean; error?: string };
    buyEquipment: (item: EquipmentItem, cost: number) => { success: boolean; error?: string };
    addRental: (rental: ActiveRental, cost: number) => { success: boolean; error?: string };
    placePendingOrder: (order: { operationId: string, fieldId: string, name: string }) => void;
    hireTemporaryOperator: () => { success: boolean; error?: string };
    serviceEquipment: () => { success: boolean; error?: string };
    performFieldOperation: (fieldId: string, operationId: string) => { success: boolean; error?: string };
    abandonField: (fieldId: string) => { success: boolean; error?: string };
    advanceTime: (fastForwardToSpring?: boolean) => void; // Advances week/season
    completeChallenge: (challengeId: string) => void;
    refreshWeeklyChallenges: () => void;
    dismissWeekSummary: () => void;
    openWeeklyPlanner: () => void;
    closeWeeklyPlanner: () => void;
    resetSeason: () => { success: boolean; error?: string };
    setGuideTarget: (targetId: string | null, message?: string | null) => void;
    clearGuide: () => void;
    isAutoScoutingEnabled: boolean;
    toggleAutoScouting: () => void;
    isAutoIrrigationEnabled: boolean;
    toggleAutoIrrigation: () => void;
    isAutoProcurementEnabled: boolean;
    toggleAutoProcurement: () => void;
    isAutoFieldOpsEnabled: boolean;
    toggleAutoFieldOps: () => void;
    isAutoBookingEnabled: boolean;
    toggleAutoBooking: () => void;
    seasonLog: DebugEntry[];
}

export interface InventoryItem {
    id: string;
    name: string;
    category: 'seed' | 'fertilizer' | 'chemical' | 'tool' | 'spare_part' | 'fuel' | 'other';
    quantity: number;
    unit: string;
    icon?: string;
    // Harmonized with inventory-data.ts
    sku?: string;
    brand?: string;
    reorderPoint?: number;
    location?: string;
    purchasePrice?: number;
    currentValue?: number;
    status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
}

export interface GameTime {
    year: number;
    season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
    week: number; // 1-12 per season
}

export interface ActiveRental {
    id: string;
    serviceId: string;
    name: string;
    expiresAtWeek: number; // Absolute week number or specific game time
    fieldId?: string; // If tied to a specific field
}

export const useGameStore = create<GameStore>()(persist(
    (set, get) => ({
        // Initial state
        gameMode: false,
        cornFocusMode: false,
        currentPlayerId: null,
        players: [],
        transactions: [],
        pendingOrders: [],
        seasonLog: [],

        toggleGameMode: () => set((state) => ({ gameMode: !state.gameMode })),
        toggleCornFocusMode: () => set((state) => ({ cornFocusMode: !state.cornFocusMode })),

        signup: (username, email, password) => {
            const { players } = get();

            // Check for duplicate email
            if (players.find(p => p.email.toLowerCase() === email.toLowerCase())) {
                return { success: false, error: 'An account with this email already exists.' };
            }

            // Check for duplicate username
            if (players.find(p => p.username.toLowerCase() === username.toLowerCase())) {
                return { success: false, error: 'This username is already taken.' };
            }

            const newPlayer: Player = {
                id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                username,
                email: email.toLowerCase(),
                passwordHash: simpleHash(password),
                balance: STARTING_BALANCE,
                xp: 0,
                level: 1,
                reputation: 0,
                ownedFieldIds: [],
                rentedFieldIds: [],
                createdAt: new Date().toISOString(),
            };

            set((state) => ({
                players: [...state.players, newPlayer],
                currentPlayerId: newPlayer.id,
            }));

            return { success: true };
        },

        login: (email, password) => {
            const { players } = get();
            const player = players.find(
                p => p.email.toLowerCase() === email.toLowerCase()
            );

            if (!player) {
                return { success: false, error: 'No account found with this email.' };
            }

            if (player.passwordHash !== simpleHash(password)) {
                return { success: false, error: 'Incorrect password.' };
            }

            set({ currentPlayerId: player.id });
            return { success: true };
        },

        logout: () => set({ currentPlayerId: null }),

        buyField: (fieldId, price) => {
            const { currentPlayerId, players, transactions } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);

            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const player = players[playerIndex];

            if (!canAfford(player.balance, price)) {
                return { success: false, error: `Insufficient funds. You need $${price.toLocaleString()} but only have $${player.balance.toLocaleString()}.` };
            }

            if (player.ownedFieldIds.includes(fieldId)) {
                return { success: false, error: 'You already own this field.' };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = {
                ...player,
                balance: spend(player.balance, price),
                xp: player.xp + XP_PER_PURCHASE,
                level: Math.floor((player.xp + XP_PER_PURCHASE) / XP_PER_LEVEL) + 1,
                ownedFieldIds: [...player.ownedFieldIds, fieldId],
            };

            const transaction: FieldTransaction = {
                id: `txn-${Date.now()}`,
                playerId: currentPlayerId!,
                fieldId,
                type: 'buy',
                amount: price,
                date: new Date().toISOString(),
            };

            set({
                players: updatedPlayers,
                transactions: [...transactions, transaction],
            });

            const fieldStore = useFieldStore.getState();
            fieldStore.syncGameFields(updatedPlayers[playerIndex].ownedFieldIds, updatedPlayers[playerIndex].rentedFieldIds);

            return { success: true };
        },

        rentField: (fieldId, price) => {
            const { currentPlayerId, players, transactions } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);

            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const player = players[playerIndex];

            if (!canAfford(player.balance, price)) {
                return { success: false, error: `Insufficient funds. You need $${price.toLocaleString()} but only have $${player.balance.toLocaleString()}.` };
            }

            if (player.rentedFieldIds.includes(fieldId)) {
                return { success: false, error: 'You are already renting this field.' };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = {
                ...player,
                balance: spend(player.balance, price),
                xp: player.xp + XP_PER_RENTAL,
                level: Math.floor((player.xp + XP_PER_RENTAL) / XP_PER_LEVEL) + 1,
                rentedFieldIds: [...player.rentedFieldIds, fieldId],
            };

            const transaction: FieldTransaction = {
                id: `txn-${Date.now()}`,
                playerId: currentPlayerId!,
                fieldId,
                type: 'rent',
                amount: price,
                date: new Date().toISOString(),
            };

            set({
                players: updatedPlayers,
                transactions: [...transactions, transaction],
            });

            const fieldStore = useFieldStore.getState();
            fieldStore.syncGameFields(updatedPlayers[playerIndex].ownedFieldIds, updatedPlayers[playerIndex].rentedFieldIds);

            return { success: true };
        },



        addXp: (amount) => {
            const { currentPlayerId, players } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return;

            const updatedPlayers = [...players];
            const player = updatedPlayers[playerIndex];
            updatedPlayers[playerIndex] = {
                ...player,
                xp: player.xp + amount,
                level: Math.floor((player.xp + amount) / XP_PER_LEVEL) + 1,
            };

            set({ players: updatedPlayers });
        },

        addFunds: (amount) => {
            const { currentPlayerId, players } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return;
            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = {
                ...updatedPlayers[playerIndex],
                balance: updatedPlayers[playerIndex].balance + amount,
            };
            set({ players: updatedPlayers });
        },

        getCurrentPlayer: () => {
            const { currentPlayerId, players } = get();
            return players.find(p => p.id === currentPlayerId) || null;
        },

        // Phase 3 Implementation
        inventory: [],
        equipment: [],
        gameTime: { year: 1, season: 'Spring', week: 1 },
        weeklyWeather: generateWeeklyWeather({ year: 1, season: 'Spring', week: 1 }),
        operatorCapacity: 2,
        operatorAssignmentsUsed: 0,
        activeRentals: [],
        weeklyChallenges: [],
        completedChallengeHistory: [],
        weekSummary: null,
        isWeeklyPlannerOpen: false,
        guideTargetId: null,
        guideMessage: null,
        deletedFieldIds: [],
        isAutoScoutingEnabled: false,
        isAutoIrrigationEnabled: false,
        isAutoProcurementEnabled: false,
        isAutoFieldOpsEnabled: false,
        isAutoBookingEnabled: false,



        // ... (previous imports)

        buySupplies: (item, cost) => {
            const { currentPlayerId, players, inventory } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in' };

            const player = players[playerIndex];
            if (!canAfford(player.balance, cost)) {
                return { success: false, error: `Insufficient funds.` };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = { ...player, balance: spend(player.balance, cost) };

            // Add to inventory or update quantity if exists
            const existingItemIndex = inventory.findIndex(i => i.id === item.id);
            let updatedInventory = [...inventory];
            if (existingItemIndex !== -1) {
                updatedInventory[existingItemIndex] = {
                    ...updatedInventory[existingItemIndex],
                    quantity: updatedInventory[existingItemIndex].quantity + item.quantity
                };
            } else {
                updatedInventory.push(item);
            }

            set({
                players: updatedPlayers,
                inventory: updatedInventory
            });
            const fieldStore = useFieldStore.getState();
            const { equipment, gameTime, weeklyWeather, operatorCapacity, operatorAssignmentsUsed } = get();
            set({
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    equipment,
                    updatedInventory,
                    gameTime,
                    weeklyWeather,
                    Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                    get().isAutoIrrigationEnabled,
                    get().isAutoProcurementEnabled,
                    get().isAutoFieldOpsEnabled,
                    get().isAutoBookingEnabled,
                    get().cornFocusMode,
                    get().weeklyChallenges,
                    get().completedChallengeHistory
                )
            });
            return { success: true };
        },

        buyEquipment: (item, cost) => {
            const { currentPlayerId, players, equipment } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in' };

            const player = players[playerIndex];
            if (!canAfford(player.balance, cost)) {
                return { success: false, error: `Insufficient funds.` };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = { ...player, balance: spend(player.balance, cost) };

            set({
                players: updatedPlayers,
                equipment: [...equipment, item]
            });
            const fieldStore = useFieldStore.getState();
            const { inventory, gameTime, weeklyWeather, operatorCapacity, operatorAssignmentsUsed } = get();
            set({
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    [...equipment, item],
                    inventory,
                    gameTime,
                    weeklyWeather,
                    Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                    get().isAutoIrrigationEnabled,
                    get().isAutoProcurementEnabled,
                    get().isAutoFieldOpsEnabled,
                    get().isAutoBookingEnabled,
                    get().cornFocusMode,
                    get().weeklyChallenges,
                    get().completedChallengeHistory
                )
            });
            return { success: true };
        },

        addRental: (rental, cost) => {
            const { currentPlayerId, players, activeRentals, equipment, inventory, gameTime, weeklyWeather, operatorCapacity, operatorAssignmentsUsed, cornFocusMode } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in' };

            const player = players[playerIndex];
            if (!canAfford(player.balance, cost)) {
                return { success: false, error: `Insufficient funds.` };
            }

            const fieldStore = useFieldStore.getState();
            let updatedInventory = inventory;

            // Apply Service Effect Immediately (Simulated)
            if (rental.fieldId && rental.serviceId) {
                const field = fieldStore.gameFields.find(f => f.id === rental.fieldId);

                if (field) {
                    // Map service IDs to valid operation IDs
                    const opId = mapServiceToOperation(rental.serviceId);
                    if (opId === 'op-plant') {
                        const targetCrop = cornFocusMode || field.crop?.toLowerCase().includes('corn') ? 'Corn' : field.crop;
                        if (!isPlantingWindowOpen(targetCrop, gameTime)) {
                            return {
                                success: false,
                                error: `Planting window is closed for ${targetCrop} in ${gameTime.season} week ${gameTime.week}.`
                            };
                        }
                        if (getSeedUnits(inventory) <= 0) {
                            return {
                                success: false,
                                error: 'No seeds in inventory. Buy seeds from Supplies Marketplace before booking planting.'
                            };
                        }
                        updatedInventory = inventory.map((item, idx) => {
                            if (item.category !== 'seed') return item;
                            if (idx !== inventory.findIndex(i => i.category === 'seed' && i.quantity > 0)) return item;
                            return { ...item, quantity: Math.max(0, item.quantity - 1) };
                        });
                    }
                    if (opId === 'op-harvest') {
                        const isReady = field.farmingStage === 'harvest_ready' || field.bbchStage === '89';
                        if (!isHarvestWindowOpen(field.crop, gameTime) && !isReady) {
                            return {
                                success: false,
                                error: `Harvest window is closed for ${field.crop} in ${gameTime.season} week ${gameTime.week}.`
                            };
                        }
                    }
                    if (['op-plow', 'op-till', 'op-plant', 'op-pre-plant-herbicide', 'op-residue-management', 'op-apply-fertilizer-incorporated', 'op-topdress-fertilizer'].includes(opId) && !weeklyWeather.fieldworkOpen) {
                        return {
                            success: false,
                            error: `Fieldwork blocked by weather this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).`
                        };
                    }
                    if (opId === 'op-harvest' && !weeklyWeather.harvestOpen) {
                        return {
                            success: false,
                            error: `Harvest blocked by weather this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).`
                        };
                    }
                    if (opId === 'serv-spray-drone' && !weeklyWeather.sprayOpen) {
                        return {
                            success: false,
                            error: `Spraying window closed this week (${weeklyWeather.precipitationChance}% rain, ${weeklyWeather.windMph} mph wind).`
                        };
                    }

                    const result = applyOperation(field, opId, cornFocusMode);

                    if (result.success && result.field) {
                        fieldStore.updateField(field.id, result.field);
                    } else if (!result.success) {
                        return { success: false, error: result.error || 'Service cannot be performed in current field stage.' };
                    }
                }
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = { ...player, balance: spend(player.balance, cost) };
            const resolved = rental.fieldId && rental.serviceId
                ? resolveChallengesForOperation(
                    get().weeklyChallenges,
                    rental.fieldId,
                    mapServiceToOperation(rental.serviceId),
                    gameTime,
                    get().completedChallengeHistory || []
                )
                : { challenges: get().weeklyChallenges, completedChallengeHistory: get().completedChallengeHistory || [] };
            const refreshedChallenges = generateChallengesForFields(
                useFieldStore.getState().gameFields,
                equipment,
                updatedInventory,
                gameTime,
                weeklyWeather,
                Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                get().isAutoIrrigationEnabled,
                get().isAutoProcurementEnabled,
                get().isAutoFieldOpsEnabled,
                get().isAutoBookingEnabled,
                get().cornFocusMode,
                resolved.challenges,
                resolved.completedChallengeHistory
            );

            set({
                players: updatedPlayers,
                inventory: updatedInventory,
                activeRentals: [...activeRentals, rental],
                weeklyChallenges: refreshedChallenges,
                completedChallengeHistory: resolved.completedChallengeHistory
            });
            return { success: true };
        },

        hireTemporaryOperator: () => {
            const { currentPlayerId, players, operatorCapacity, operatorAssignmentsUsed } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const hireCost = 900;
            const player = players[playerIndex];
            if (!canAfford(player.balance, hireCost)) {
                return { success: false, error: `Insufficient funds. You need $${hireCost.toLocaleString()} to hire temporary operators.` };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = { ...player, balance: spend(player.balance, hireCost) };

            const fieldStore = useFieldStore.getState();
            const { equipment, inventory, gameTime, weeklyWeather } = get();
            const newOperatorCapacity = operatorCapacity + 2;

            set({
                players: updatedPlayers,
                operatorCapacity: newOperatorCapacity,
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    equipment,
                    inventory,
                    gameTime,
                    weeklyWeather,
                    Math.max(0, newOperatorCapacity - operatorAssignmentsUsed),
                    get().isAutoIrrigationEnabled,
                    get().isAutoProcurementEnabled,
                    get().isAutoFieldOpsEnabled,
                    get().isAutoBookingEnabled,
                    get().cornFocusMode,
                    get().weeklyChallenges,
                    get().completedChallengeHistory
                ),
            });

            return { success: true };
        },

        placePendingOrder: (order) => {
            set((state) => ({
                pendingOrders: [
                    ...state.pendingOrders,
                    { ...order, id: `pend-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }
                ]
            }));
        },

        serviceEquipment: () => {
            const { currentPlayerId, players, equipment } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const targetIndex = equipment.findIndex(eq => eq.status === 'maintenance');
            if (targetIndex === -1) return { success: false, error: 'No equipment currently in maintenance.' };

            const target = equipment[targetIndex];
            const serviceCost = Math.max(300, Math.round(target.maintainanceCostPerWeek * 1.5));
            const player = players[playerIndex];
            if (!canAfford(player.balance, serviceCost)) {
                return { success: false, error: `Insufficient funds. You need $${serviceCost.toLocaleString()} for service.` };
            }

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = { ...player, balance: spend(player.balance, serviceCost) };
            const updatedEquipment = [...equipment];
            updatedEquipment[targetIndex] = { ...target, status: 'ready' };

            const fieldStore = useFieldStore.getState();
            const { inventory, gameTime, weeklyWeather, operatorCapacity, operatorAssignmentsUsed } = get();
            set({
                players: updatedPlayers,
                equipment: updatedEquipment,
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    updatedEquipment,
                    inventory,
                    gameTime,
                    weeklyWeather,
                    Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                    get().isAutoIrrigationEnabled,
                    get().isAutoProcurementEnabled,
                    get().isAutoFieldOpsEnabled,
                    get().isAutoBookingEnabled,
                    get().cornFocusMode,
                    get().weeklyChallenges,
                    get().completedChallengeHistory
                ),
            });

            return { success: true };
        },

        performFieldOperation: (fieldId, operationId) => {
            const {
                currentPlayerId,
                players,
                transactions,
                equipment,
                inventory,
                weeklyWeather,
                gameTime,
                operatorCapacity,
                operatorAssignmentsUsed,
                cornFocusMode
            } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const player = players[playerIndex];
            const fieldStore = useFieldStore.getState();
            const field = fieldStore.gameFields.find(f => f.id === fieldId);

            if (!field) return { success: false, error: 'Field not found.' };

            // Define operation costs
            const costs: Record<string, number> = {
                'op-scout': 500,
                'op-aerial-survey': 800,
                'op-soil-test': 1200,
                'op-plow': 2500,
                'op-pre-plant-herbicide': 550,
                'op-till': 1500,
                'op-plant': 2000,
                'op-apply-fertilizer-incorporated': 700,
                'op-topdress-fertilizer': 650,
                'op-apply-herbicide': 550,
                'op-irrigation-setup': 400,
                'op-harvest': 500,
                'op-residue-management': 600,
                'serv-spray-drone': 800,
                'serv-irrigate': 300,
            };

            const cost = costs[operationId] || 0;

            const isCornField = cornFocusMode && field.crop?.toLowerCase().includes('corn');

            // Realistic workflow: heavy operations require own machinery OR provider booking.
            if (['op-plow', 'op-till', 'op-plant', 'op-harvest', 'op-pre-plant-herbicide', 'op-residue-management'].includes(operationId)) {
                if (!hasEquipmentForOperation(equipment, operationId)) {
                    return {
                        success: false,
                        error: 'No suitable machinery found. Buy equipment or book a provider in Services Marketplace.'
                    };
                }
                if (!hasReadyEquipmentForOperation(equipment, operationId)) {
                    return {
                        success: false,
                        error: 'Required machinery is in maintenance. Service it first or book a provider.'
                    };
                }
            }

            // ── Corn Focus Mode: Full Operation Gate Logic ───────────────
            if (isCornField) {
                // Seeds required before planting
                if (operationId === 'op-plant' && getCornSeedUnits(inventory) <= 0) {
                    return { success: false, error: 'No corn seeds in inventory. Buy corn seeds from Supplies Marketplace before planting.' };
                }
                // Gaucho seed treatment required before corn planting
                if (operationId === 'op-plant' && !hasGaucho(inventory)) {
                    return { success: false, error: 'Gaucho seed treatment is required before planting corn. Buy Gaucho from Supplies Marketplace.' };
                }
                // Pre-plant herbicide required before tilling (after plowing)
                if (operationId === 'op-pre-plant-herbicide' && !hasPrePlantHerbicide(inventory)) {
                    return { success: false, error: 'No pre-plant herbicide in inventory. Buy Maister Power or a glyphosate product from Supplies Marketplace.' };
                }
                // Fertilizer required for fertilizer operations
                if ((operationId === 'op-apply-fertilizer-incorporated' || operationId === 'op-topdress-fertilizer') && getFertilizerUnits(inventory) <= 0) {
                    return { success: false, error: 'No fertilizer in inventory. Buy Urea (46-0-0) from Supplies Marketplace before applying.' };
                }
                // Chemicals required for herbicide operations
                if (operationId === 'op-apply-herbicide' && getChemicalUnits(inventory) <= 0) {
                    return { success: false, error: 'No crop protection chemicals in inventory. Buy from Supplies Marketplace.' };
                }
                // Planting window check
                const targetCrop = isCornField ? 'Corn' : field.crop;
                if (operationId === 'op-plant' && !isPlantingWindowOpen(targetCrop, gameTime)) {
                    return {
                        success: false,
                        error: `${targetCrop} planting window is closed in ${gameTime.season} W${gameTime.week}. Consult the crop calendar for optimal timing.`
                    };
                }
                // Harvest window check
                // Allow bypass if stage is harvest_ready (R6)
                const isR6 = field.bbchStage === '89';
                if (operationId === 'op-harvest' && field.farmingStage !== 'harvest_ready' && !isR6 && !isHarvestWindowOpen(field.crop, gameTime)) {
                    return {
                        success: false,
                        error: `${field.crop} harvest window is closed in ${gameTime.season} W${gameTime.week}. Monitor maturity and wait for the correct season.`
                    };
                }
            }

            // ── General Operational Gates (Apply to all crops) ───────────────

            // Weather gates use the weekly execution window.
            const weatherCheck = canWeatherRunOperation(operationId, weeklyWeather, gameTime);
            if (!weatherCheck.allowed) {
                return { success: false, error: `${weatherCheck.reason}. Advance to the next week or wait for the next available weather window.` };
            }

            // Operator capacity check
            const operatorSlotsLeft = Math.max(0, operatorCapacity - operatorAssignmentsUsed);
            if (requiresOperator(operationId) && operatorSlotsLeft <= 0) {
                return { success: false, error: 'No operator slots left this week. Hire temporary operators or book marketplace services.' };
            }

            // Fuel gate check
            const fuelNeeded = getFuelRequirement(operationId, field.acres);
            if (fuelNeeded > 0 && getFuelUnits(inventory) < fuelNeeded) {
                return { success: false, error: `Not enough fuel. Need ${fuelNeeded} units for ${field.acres.toFixed(1)} acres. Refill diesel in Supplies Marketplace.` };
            }

            if (!canAfford(player.balance, cost)) {
                return { success: false, error: `Insufficient funds. You need $${cost.toLocaleString()} but only have $${player.balance.toLocaleString()}.` };
            }

            // Apply operation
            const result = applyOperation(field, operationId, cornFocusMode);
            if (!result.success) {
                gameLog('ERROR', `applyOperation FAILED: ${operationId} on field ${fieldId}`, { error: result.error, stage: field.farmingStage });
                return { success: false, error: result.error };
            }

            gameLog('OPERATION', `applyOperation OK: ${operationId} on "${field.name}"`, {
                ...getOperationLogData(field, operationId, result.field, weeklyWeather, gameTime, cost, 'manual', 'Player executed operation from the weekly plan.'),
            });

            // Update player balance and transactions
            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = {
                ...player,
                balance: spend(player.balance, cost),
                xp: player.xp + 25,
            };

            const transaction: FieldTransaction = {
                id: `txn-${Date.now()}`,
                playerId: currentPlayerId!,
                fieldId,
                type: 'expense',
                amount: cost,
                date: new Date().toISOString(),
                description: operationId.replace('op-', '').replace('serv-', '').replace(/-/g, ' ').toUpperCase(),
                category: 'operations'
            };

            // Update field store
            if (result.field) {
                fieldStore.updateField(fieldId, result.field);
            }
            
            // Re-read fresh state after the update – the captured `fieldStore` snapshot is stale
            const updatedGameFields = useFieldStore.getState().gameFields;

            const seededInventory = operationId === 'op-plant'
                ? inventory.map((item, idx) => {
                    if (item.category !== 'seed') return item;
                    if (idx !== inventory.findIndex(i => i.category === 'seed' && i.quantity > 0)) return item;
                    return { ...item, quantity: Math.max(0, item.quantity - 1) };
                })
                : inventory;
            const fertilizerAdjustedInventory = (operationId === 'op-apply-fertilizer-incorporated' || operationId === 'op-topdress-fertilizer')
                ? seededInventory.map((item, idx) => {
                    if (item.category !== 'fertilizer') return item;
                    if (idx !== seededInventory.findIndex(i => i.category === 'fertilizer' && i.quantity > 0)) return item;
                    return { ...item, quantity: Math.max(0, item.quantity - 1) };
                })
                : seededInventory;
            const chemicalAdjustedInventory = operationId === 'op-apply-herbicide'
                ? fertilizerAdjustedInventory.map((item, idx) => {
                    if (item.category !== 'chemical') return item;
                    if (idx !== fertilizerAdjustedInventory.findIndex(i => i.category === 'chemical' && i.quantity > 0)) return item;
                    return { ...item, quantity: Math.max(0, item.quantity - 1) };
                })
                : fertilizerAdjustedInventory;
            const fuelRequired = getFuelRequirement(operationId, field.acres || 0);
            const fuelAdjustedInventory = fuelRequired > 0
                ? chemicalAdjustedInventory.map((item, idx) => {
                    if (item.category !== 'fuel') return item;
                    if (idx !== chemicalAdjustedInventory.findIndex(i => i.category === 'fuel' && i.quantity > 0)) return item;
                    return { ...item, quantity: Math.max(0, item.quantity - fuelRequired) };
                })
                : chemicalAdjustedInventory;
            const newOperatorAssignmentsUsed = requiresOperator(operationId)
                ? operatorAssignmentsUsed + 1
                : operatorAssignmentsUsed;
            const resolved = resolveChallengesForOperation(
                get().weeklyChallenges,
                fieldId,
                operationId,
                gameTime,
                get().completedChallengeHistory || []
            );

            const refreshedChallenges = generateChallengesForFields(
                updatedGameFields,
                equipment,
                fuelAdjustedInventory,
                gameTime,
                weeklyWeather,
                Math.max(0, operatorCapacity - newOperatorAssignmentsUsed),
                get().isAutoIrrigationEnabled,
                get().isAutoProcurementEnabled,
                get().isAutoFieldOpsEnabled,
                get().isAutoBookingEnabled,
                get().cornFocusMode,
                resolved.challenges,
                resolved.completedChallengeHistory
            );

            set({
                players: updatedPlayers,
                transactions: [...transactions, transaction],
                operatorAssignmentsUsed: newOperatorAssignmentsUsed,
                inventory: fuelAdjustedInventory,
                weeklyChallenges: refreshedChallenges,
                completedChallengeHistory: resolved.completedChallengeHistory,
            });

            return { success: true };
        },

        abandonField: (fieldId) => {
            const { currentPlayerId, players, transactions, deletedFieldIds } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const player = players[playerIndex];

            // Extract marketplace ID
            const mktId = fieldId.replace(/^game-/, '');

            const updatedPlayers = [...players];
            updatedPlayers[playerIndex] = {
                ...player,
                ownedFieldIds: player.ownedFieldIds.filter(id => id !== mktId),
                rentedFieldIds: player.rentedFieldIds.filter(id => id !== mktId),
            };

            const transaction: FieldTransaction = {
                id: `txn-${Date.now()}`,
                playerId: currentPlayerId!,
                fieldId,
                type: 'expense',
                amount: 0,
                date: new Date().toISOString(),
                description: `ABANDONED FIELD`,
                category: 'operations'
            };

            const fieldStore = useFieldStore.getState();

            set({
                players: updatedPlayers,
                transactions: [...transactions, transaction],
                deletedFieldIds: [...deletedFieldIds, mktId]
            });

            // Immediate sync to update UI
            const updatedPlayer = updatedPlayers[playerIndex];
            fieldStore.syncGameFields(updatedPlayer.ownedFieldIds, updatedPlayer.rentedFieldIds);

            return { success: true };
        },

        advanceTime: (fastForwardToSpring = false) => {
            set(state => {
                const { season, week, year } = state.gameTime;
                if (state.cornFocusMode && isAtOrAfterCornSeasonEnd(state.gameTime)) {
                    return {
                        weekSummary: {
                            periodLabel: `Y${year} ${season} W${week}`,
                            completed: state.weeklyChallenges.filter(c => c.status === 'completed').length,
                            missed: state.weeklyChallenges.filter(c => c.status === 'open').length,
                            message: 'Corn Expert season complete. Review harvest, storage, residue, and closeout results. Reset the season to run another simulation.',
                        },
                    };
                }

                let currentWeeklyChallenges = escalateChallenges(
                    state.weeklyChallenges,
                    state.gameTime,
                    (challenge, nextSeverity) => {
                        gameLog('CHALLENGE', `Challenge escalated: ${challenge.title} → ${nextSeverity}`, {
                            challengeId: challenge.id,
                            challengeTemplateId: challenge.challengeTemplateId,
                            fieldId: challenge.fieldId,
                            category: challenge.category,
                            fromSeverity: challenge.severity,
                            toSeverity: nextSeverity,
                            currentWeek: getChallengeWeekNumber(state.gameTime),
                            createdWeek: challenge.createdWeek,
                            escalationWeeks: challenge.escalationWeeks,
                        });
                    }
                );
                let completedChallengeHistory = pruneCompletedChallengeHistory(
                    state.completedChallengeHistory || [],
                    getChallengeWeekNumber(state.gameTime)
                );

                const autoActions: string[] = [];
                let nextGameTime = fastForwardToSpring && !state.cornFocusMode
                    ? { year: season === 'Autumn' || season === 'Winter' ? year + 1 : year, season: 'Spring' as const, week: 1 }
                    : getNextGameTime(state.gameTime, state.cornFocusMode);
                const fieldStore = useFieldStore.getState();
                let nextWeeklyWeather = generateWeeklyWeather(nextGameTime);

                const { season: newSeason, week: newWeek, year: newYear } = nextGameTime;

                if (fastForwardToSpring && !state.cornFocusMode) {
                    autoActions.push(`Skipped dormant season: Fast-forwarded to Spring Year ${newYear}`);
                } else if (fastForwardToSpring && state.cornFocusMode) {
                    autoActions.push('Corn Expert uses one bounded season. Fast-forward to a new year is disabled; reset season to replay.');
                }

                gameLog('ADVANCE', `advanceTime: Y${year} ${season} W${week} → Y${newYear} ${newSeason} W${newWeek}`, {
                    year: newYear,
                    season: newSeason,
                    week: newWeek,
                    pendingOrders: state.pendingOrders.length,
                    fields: fieldStore.gameFields.length,
                    cornFocusMode: state.cornFocusMode,
                    weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                    ...getWeatherLogData(nextWeeklyWeather, nextGameTime),
                });

                // Process Pending Orders (Simulates night-time micro-windows)
                let pendingSummaryMsg = "";
                if (state.pendingOrders.length > 0) {
                    let fieldsUpdated = 0;
                    state.pendingOrders.forEach(order => {
                        const field = fieldStore.gameFields.find(f => f.id === order.fieldId);
                        if (field) {
                            const result = applyOperation(field, order.operationId, state.cornFocusMode);
                            if (result.success && result.field) {
                                fieldStore.updateField(field.id, result.field);
                                const resolved = resolveChallengesForOperation(
                                    currentWeeklyChallenges,
                                    field.id,
                                    order.operationId,
                                    state.gameTime,
                                    completedChallengeHistory
                                );
                                currentWeeklyChallenges = resolved.challenges;
                                completedChallengeHistory = resolved.completedChallengeHistory;
                                gameLog('OPERATION', `Pending order completed: ${order.operationId} on "${field.name}"`, {
                                    ...getOperationLogData(field, order.operationId, result.field, nextWeeklyWeather, nextGameTime, 0, 'pending-order', 'Previously queued order executed during an open weather window this week.'),
                                    orderId: order.id,
                                    orderName: order.name,
                                });
                                fieldsUpdated++;
                            }
                        }
                    });
                    if (fieldsUpdated > 0) {
                        pendingSummaryMsg = ` + Executed ${fieldsUpdated} pending weather orders during calm night slot.`;
                    }
                }

                // Advance Field Growth and Auto-Scouting

                // 1. Auto-Procurement Logic (Buy inputs if low) - Move BEFORE field loop
                let finalInventory = [...state.inventory];
                let finalBalance = state.players.find(p => p.id === state.currentPlayerId)?.balance || 0;
                
                if (state.isAutoProcurementEnabled) {
                    // Check Urea (Fertilizer)
                    const hasUrea = finalInventory.some(i => i.id === 'fert-urea' && i.quantity > 0);
                    if (!hasUrea && finalBalance > 5000) {
                        const cost = 2250;
                        finalBalance -= cost;
                        finalInventory.push({ id: 'fert-urea', name: 'Urea (46-0-0)', category: 'fertilizer', quantity: 5, unit: 'ton', purchasePrice: 450 });
                        gameLog('ADVANCE', `Auto-Procurement: Purchased Urea (Balance: $${finalBalance})`, {
                            mode: 'auto-procurement',
                            itemName: 'Urea (46-0-0)',
                            category: 'fertilizer',
                            quantity: 5,
                            unit: 'ton',
                            cost,
                            balance: finalBalance,
                            reason: 'Fertilizer inventory was empty before field preparation and nutrient correction tasks.',
                            weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                        });
                        autoActions.push(`Purchased Urea Fertilizer ($2,250)`);
                    }

                    // Check Chemicals (Maister Power & Gaucho)
                    const hasMaister = finalInventory.some(i => (i.id === 'chem-maister-power' || i.id === 'chem-maister-bio') && i.quantity > 0);
                    if (!hasMaister && finalBalance > 5000) {
                        const cost = 1450;
                        finalBalance -= cost;
                        finalInventory.push({ id: 'chem-maister-power', name: 'Maister Power', category: 'chemical', quantity: 5, unit: 'L', purchasePrice: 290 });
                        gameLog('ADVANCE', `Auto-Procurement: Purchased Maister Power (Balance: $${finalBalance})`, {
                            mode: 'auto-procurement',
                            itemName: 'Maister Power',
                            category: 'chemical',
                            quantity: 5,
                            unit: 'L',
                            cost,
                            balance: finalBalance,
                            reason: 'Crop protection inventory was empty before herbicide and protection tasks.',
                            weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                        });
                        autoActions.push(`Purchased Maister Power herbicide ($1,450)`);
                    }

                    const hasGaucho = finalInventory.some(i => i.id === 'chem-gaucho' && i.quantity > 0);
                    if (state.cornFocusMode && !hasGaucho && finalBalance > 5000) {
                        const cost = 1700;
                        finalBalance -= cost;
                        finalInventory.push({ id: 'chem-gaucho', name: 'Gaucho', category: 'chemical', quantity: 2, unit: 'L', purchasePrice: 850 });
                        gameLog('ADVANCE', `Auto-Procurement: Purchased Gaucho Seed Treatment (Balance: $${finalBalance})`, {
                            mode: 'auto-procurement',
                            itemName: 'Gaucho seed treatment',
                            category: 'chemical',
                            quantity: 2,
                            unit: 'L',
                            cost,
                            balance: finalBalance,
                            reason: 'Corn planting requires seed treatment before the planter can be dispatched.',
                            weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                        });
                        autoActions.push(`Purchased Gaucho seed treatment ($1,700)`);
                    }

                    // Check Fuel
                    const fuelItem = finalInventory.find(i => i.id === 'fuel-diesel');
                    if ((!fuelItem || fuelItem.quantity < 200) && finalBalance > 2000) {
                        const cost = 1300;
                        finalBalance -= cost;
                        if (fuelItem) {
                            fuelItem.quantity += 500;
                        } else {
                            finalInventory.push({ id: 'fuel-diesel', name: 'Diesel', category: 'fuel', quantity: 500, unit: 'L', purchasePrice: 2.6 });
                        }
                        gameLog('ADVANCE', `Auto-Procurement: Purchased Fuel (Balance: $${finalBalance})`, {
                            mode: 'auto-procurement',
                            itemName: 'Diesel fuel',
                            category: 'fuel',
                            quantity: 500,
                            unit: 'L',
                            cost,
                            balance: finalBalance,
                            reason: 'Fuel stock was below the reserve needed for tractor and harvester operations.',
                            weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                        });
                        autoActions.push(`Purchased Diesel fuel ($1,300)`);
                    }

                    // Check Corn Seeds
                    if (state.cornFocusMode) {
                        const hasCornSeeds = finalInventory.some(i => i.id === 'seed-corn-standard' && i.quantity > 0);
                        if (!hasCornSeeds && finalBalance > 8000) {
                            const cost = 1400;
                            finalBalance -= cost;
                            finalInventory.push({ id: 'seed-corn-standard', name: 'Field Corn Seed', category: 'seed', quantity: 5, unit: 'bag (1 ha)', purchasePrice: 280 });
                            gameLog('ADVANCE', `Auto-Procurement: Purchased Corn Seeds (Balance: $${finalBalance})`, {
                                mode: 'auto-procurement',
                                itemName: 'Field Corn Seed',
                                category: 'seed',
                                quantity: 5,
                                unit: 'bag (1 ha)',
                                cost,
                                balance: finalBalance,
                                reason: 'Corn seed inventory was empty while planting tasks were expected this season.',
                                weather: getWeatherLogData(nextWeeklyWeather, nextGameTime),
                            });
                            autoActions.push(`Purchased Field Corn Seeds ($1,400)`);
                        }
                    }
                }

                // 2. Equipment Auto-Maintenance
                let updatedEquipment: EquipmentItem[] = state.equipment.map((eq): EquipmentItem => {
                    if (eq.status === 'maintenance') {
                        // If Auto-Ops is on, 80% chance to finish maintenance early (simulate priority service)
                        if (state.isAutoFieldOpsEnabled || Math.random() < 0.55) {
                            return { ...eq, status: 'ready' as const };
                        }
                        return eq;
                    }
                    const breakdownRisk = eq.category === 'harvester' ? 0.15 : eq.category === 'tractor' ? 0.12 : 0.08;
                    return Math.random() < breakdownRisk ? { ...eq, status: 'maintenance' as const } : eq;
                });
                
                const updatedGameFields = fieldStore.gameFields.map(field => {
                    let grown = advanceFieldGrowth(field, state.cornFocusMode, newSeason);

                    // Background auto-scouting logic
                    if (state.cornFocusMode && state.isAutoScoutingEnabled) {
                        // ... (auto-scouting logic remains same)
                        const isCorn = grown.crop?.toLowerCase().includes('corn') ||
                            (!grown.crop || grown.crop === 'None' || grown.crop === 'Unplanted');

                        if (isCorn && grown.isCornSuitable !== false) {
                            grown = {
                                ...grown,
                                isScouted: true,
                                lastFlightDate: new Date().toISOString().split('T')[0]
                            };
                            ScoutingStorage.recordAutoWeeklyRun({
                                fieldId: grown.id,
                                fieldName: grown.name,
                                planned: buildPlannedAerialParams({ acres: grown.acres, routePattern: 'grid', captureProfile: 'corn' }),
                                performed: buildPerformedAerialParams({ acresCovered: grown.acres, captureBands: ['RGB', 'NIR', 'RedEdge'] }),
                                detectedStageId: 'AUTO_DETECT',
                                detectedBbch: grown.bbchStage || '00',
                                gameYear: newYear,
                                gameSeason: newSeason,
                                gameWeek: newWeek,
                                notes: 'Background auto-scouting run',
                            });
                        }
                    }

                    if (grown.farmingStage === 'growing' || grown.farmingStage === 'harvest_ready') {
                        const pressure = applySeasonalPressure(grown, nextWeeklyWeather);
                        grown.diseasePressure = pressure.diseasePressure;
                        grown.diseaseOutbreak = pressure.diseaseOutbreak;
                        grown.weedPressure = pressure.weedPressure;
                        grown.ndviScore = Math.max(0, Math.min(0.95, Math.round(((grown.ndviScore || 0) + pressure.ndviDelta) * 100) / 100));
                        grown.healthStatus = pressure.healthStatus;
                        grown.inputStatus = {
                            needsWater: pressure.needsWater,
                            needsNutrients: pressure.needsNutrients,
                            needsProtection: pressure.needsProtection,
                        };
                    }

                    // Comprehensive Auto-Ops Logic
                    if (state.isAutoFieldOpsEnabled) {
                        const recommended = getRecommendedOperation(grown, updatedEquipment, finalInventory, nextGameTime, nextWeeklyWeather, 2, state.cornFocusMode);
                        
                        if (recommended && recommended.operationId) {
                            const opId = recommended.operationId;
                            const isService = opId.startsWith('serv-');
                            const isDirectOp = opId.startsWith('op-');
                            const weatherCheck = canWeatherRunOperation(opId, nextWeeklyWeather, nextGameTime);

                            if (weatherCheck.allowed && (isService || isDirectOp)) {
                                // Service handling: triggered by Auto-Booking
                                if (isService && state.isAutoBookingEnabled) {
                                    const service = SERVICES.find(s => s.id === opId);
                                    const cost = service ? (service.pricePerHectare * grown.acres) : 500;
                                    if (finalBalance >= cost) {
                                        const operationForExecution = mapServiceToOperation(opId);
                                        const fieldBeforeOperation = grown;
                                        const result = applyOperation(fieldBeforeOperation, operationForExecution, state.cornFocusMode);
                                        if (result.success && result.field) {
                                            grown = result.field;
                                            finalBalance -= cost;
                                            const resolved = resolveChallengesForOperation(
                                                currentWeeklyChallenges,
                                                grown.id,
                                                operationForExecution,
                                                state.gameTime,
                                                completedChallengeHistory
                                            );
                                            currentWeeklyChallenges = resolved.challenges;
                                            completedChallengeHistory = resolved.completedChallengeHistory;
                                            gameLog('OPERATION', `Auto-Booking completed: ${recommended.title} for "${fieldBeforeOperation.name}"`, {
                                                ...getOperationLogData(fieldBeforeOperation, operationForExecution, result.field, nextWeeklyWeather, nextGameTime, cost, 'auto-booking', recommended.description || 'A service provider was booked because the weekly challenge recommended a contractor-assisted operation.'),
                                                serviceId: opId,
                                                serviceTitle: recommended.title,
                                            });
                                            autoActions.push(`Booked ${recommended.title} for ${grown.name} ($${cost.toLocaleString()})`);
                                        }
                                    }
                                } 
                                // Direct Op handling: triggered by Auto-Ops
                                else if (isDirectOp && state.isAutoFieldOpsEnabled) {
                                    const validation = canPerformOperation(grown, opId, state.cornFocusMode);
                                    if (validation.allowed) {
                                        const fieldBeforeOperation = grown;
                                        const result = applyOperation(fieldBeforeOperation, opId, state.cornFocusMode);
                                        if (result.success && result.field) {
                                            grown = result.field;
                                            const resolved = resolveChallengesForOperation(
                                                currentWeeklyChallenges,
                                                grown.id,
                                                opId,
                                                state.gameTime,
                                                completedChallengeHistory
                                            );
                                            currentWeeklyChallenges = resolved.challenges;
                                            completedChallengeHistory = resolved.completedChallengeHistory;
                                            gameLog('OPERATION', `Auto-Ops completed: ${recommended.title} for "${fieldBeforeOperation.name}"`, {
                                                ...getOperationLogData(fieldBeforeOperation, opId, result.field, nextWeeklyWeather, nextGameTime, 0, 'auto-ops', recommended.description || 'Auto-Ops executed this recommended in-house field operation.'),
                                                serviceTitle: recommended.title,
                                            });
                                            autoActions.push(`Executed ${recommended.title} for ${grown.name}`);
                                        }
                                    }
                                }
                            } else if (!weatherCheck.allowed) {
                                autoActions.push(`Delayed ${recommended.title}: ${weatherCheck.reason}.`);
                            }
                        }
                    } else if (state.isAutoIrrigationEnabled && grown.farmingStage === 'growing') {
                        // Legacy individual auto-irrigation (if ops is off)
                        const precipChance = nextWeeklyWeather.precipitationChance;
                        const soilMoisture = grown.soilMoisture ?? (grown.inputStatus.needsWater ? 20 : 50);
                        if (soilMoisture < 30 && precipChance < 40) {
                            const fieldBeforeOperation = grown;
                            const result = applyOperation(fieldBeforeOperation, 'serv-irrigate', state.cornFocusMode);
                            if (result.success && result.field) {
                                grown = result.field;
                                const resolved = resolveChallengesForOperation(
                                    currentWeeklyChallenges,
                                    grown.id,
                                    'serv-irrigate',
                                    state.gameTime,
                                    completedChallengeHistory
                                );
                                currentWeeklyChallenges = resolved.challenges;
                                completedChallengeHistory = resolved.completedChallengeHistory;
                                gameLog('OPERATION', `Auto-Irrigation completed on "${fieldBeforeOperation.name}"`, {
                                    ...getOperationLogData(fieldBeforeOperation, 'serv-irrigate', result.field, nextWeeklyWeather, nextGameTime, 0, 'auto-irrigation', `Soil moisture was ${soilMoisture}% and rain probability was only ${precipChance}%, so irrigation was triggered to prevent crop stress.`),
                                    soilMoisture,
                                });
                                autoActions.push(`Auto-Irrigated ${grown.name}`);
                            }
                        }
                    }

                    return grown;
                });

                // Update players with final balance (including auto-procurement and auto-ops costs)
                let playerWithProcurement = state.players.map(p => {
                    if (p.id === state.currentPlayerId) {
                        return { ...p, balance: finalBalance };
                    }
                    return p;
                });

                // Batch update fields
                updatedGameFields.forEach(f => {
                    fieldStore.updateField(f.id, f);
                });

                // Remove expired rentals
                const updatedRentals = state.activeRentals.filter(r => r.expiresAtWeek > newWeek); // Simple check
                const completed = currentWeeklyChallenges.filter(c => c.status === 'completed').length;
                const missed = currentWeeklyChallenges.filter(c => c.status === 'open').length;



                const maintenanceExpense = updatedEquipment.reduce((sum, eq) => sum + (eq.maintainanceCostPerWeek || 0), 0);
                const updatedPlayersFinal = playerWithProcurement.map(player => {
                    if (player.id !== state.currentPlayerId) return player;
                    return {
                        ...player,
                        balance: UNLIMITED_TEST_FUNDS
                            ? player.balance
                            : Math.max(0, player.balance - maintenanceExpense)
                    };
                });

                const refreshedChallenges = generateChallengesForFields(
                    updatedGameFields,
                    updatedEquipment,
                    finalInventory,
                    nextGameTime,
                    nextWeeklyWeather,
                    2,
                    state.isAutoIrrigationEnabled,
                    state.isAutoProcurementEnabled,
                    state.isAutoFieldOpsEnabled,
                    state.isAutoBookingEnabled,
                    state.cornFocusMode,
                    currentWeeklyChallenges,
                    completedChallengeHistory
                );

                // Winter Kill Warning Logic
                const readyFields = updatedGameFields.filter(f => f.farmingStage === 'harvest_ready');
                let seasonalWarning = "";
                if (season === 'Autumn' && week >= 8 && readyFields.length > 0) {
                    seasonalWarning = ` WARNING: ${readyFields.length} fields are ready for harvest. Winter transition is approaching—unharvested crops will be lost!`;
                }

                return {
                    gameTime: nextGameTime,
                    weeklyWeather: nextWeeklyWeather,
                    operatorCapacity: 2,
                    operatorAssignmentsUsed: 0,
                    equipment: updatedEquipment,
                    players: updatedPlayersFinal,
                    inventory: finalInventory,
                    activeRentals: updatedRentals,
                    weeklyChallenges: refreshedChallenges,
                    completedChallengeHistory,
                    pendingOrders: [],
                    weekSummary: {
                        periodLabel: `Y${year} ${season} W${week}`,
                        completed,
                        missed,
                        message: (completed >= missed
                            ? `Strong operational week. Maintenance cost: $${maintenanceExpense.toLocaleString()}.`
                            : `You missed key operations. Maintenance cost this rollover: $${maintenanceExpense.toLocaleString()}.`) + 
                            pendingSummaryMsg + seasonalWarning + 
                            (autoActions.length > 0 ? `\n\nAutopilot Actions:\n• ${autoActions.join('\n• ')}` : ""),
                    },
                };
            });
        },

        completeChallenge: (challengeId) => {
            set((state) => {
                const challenge = state.weeklyChallenges.find(ch => ch.id === challengeId);
                if (challenge?.challengeTemplateId) {
                    const field = challenge.fieldId
                        ? useFieldStore.getState().gameFields.find(f => f.id === challenge.fieldId)
                        : null;
                    gameLog('CHALLENGE', `Seasonal challenge completed: ${challenge.title}`, {
                        challengeId: challenge.id,
                        challengeTemplateId: challenge.challengeTemplateId,
                        category: challenge.category,
                        severity: challenge.severity,
                        fieldId: challenge.fieldId,
                        fieldName: field?.name,
                        operationId: challenge.operationId,
                        mitigationDescription: challenge.mitigationDescription,
                        mitigationCost: challenge.mitigationCost,
                        yieldImpactPct: challenge.yieldImpactPct,
                        yieldSavedPct: challenge.yieldImpactPct,
                        requiresInput: challenge.requiresInput,
                        year: state.gameTime.year,
                        season: state.gameTime.season,
                        gameWeek: state.gameTime.week,
                    });
                }

                const completedChallengeHistory = recordCompletedSeasonalChallenge(
                    state.completedChallengeHistory || [],
                    challenge,
                    state.gameTime
                );

                return {
                    weeklyChallenges: state.weeklyChallenges.map(ch =>
                        ch.id === challengeId ? { ...ch, status: 'completed' } : ch
                    ),
                    completedChallengeHistory,
                };
            });
        },

        refreshWeeklyChallenges: () => {
            const fieldStore = useFieldStore.getState();
            const { 
                equipment, inventory, gameTime, operatorCapacity, operatorAssignmentsUsed, 
                isAutoIrrigationEnabled, isAutoProcurementEnabled, isAutoFieldOpsEnabled, isAutoBookingEnabled,
                cornFocusMode,
                weeklyChallenges,
                completedChallengeHistory,
            } = get();

            // Always regenerate weather for the current week to avoid stale persisted weather
            const freshWeather = generateWeeklyWeather(gameTime);

            gameLog('CHALLENGE', `refreshWeeklyChallenges: Y${gameTime.year} ${gameTime.season} W${gameTime.week}`, {
                fields: fieldStore.gameFields.length,
                cornFocusMode: cornFocusMode,
                fieldwork: freshWeather.fieldworkOpen,
                spray: freshWeather.sprayOpen,
            });

            set({
                weeklyWeather: freshWeather,
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    equipment,
                    inventory,
                    gameTime,
                    freshWeather,
                    Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                    isAutoIrrigationEnabled,
                    isAutoProcurementEnabled,
                    isAutoFieldOpsEnabled,
                    isAutoBookingEnabled,
                    cornFocusMode,
                    weeklyChallenges,
                    completedChallengeHistory
                )
            });
        },

        dismissWeekSummary: () => set({ weekSummary: null }),

        openWeeklyPlanner: () => {
            const fieldStore = useFieldStore.getState();
            const { 
                equipment, inventory, gameTime, operatorCapacity, operatorAssignmentsUsed, 
                isAutoIrrigationEnabled, isAutoProcurementEnabled, isAutoFieldOpsEnabled, isAutoBookingEnabled,
                cornFocusMode,
                weeklyChallenges,
                completedChallengeHistory,
            } = get();

            // Always regenerate weather to avoid stale persisted state
            const freshWeather = generateWeeklyWeather(gameTime);

            gameLog('CHALLENGE', `openWeeklyPlanner: Y${gameTime.year} ${gameTime.season} W${gameTime.week}`, {
                fieldwork: freshWeather.fieldworkOpen, spray: freshWeather.sprayOpen,
                fields: fieldStore.gameFields.map(f => f.name + ':' + f.farmingStage),
            });

            set({
                isWeeklyPlannerOpen: true,
                weeklyWeather: freshWeather,
                weeklyChallenges: generateChallengesForFields(
                    fieldStore.gameFields,
                    equipment,
                    inventory,
                    gameTime,
                    freshWeather,
                    Math.max(0, operatorCapacity - operatorAssignmentsUsed),
                    get().isAutoIrrigationEnabled,
                    get().isAutoProcurementEnabled,
                    get().isAutoFieldOpsEnabled,
                    get().isAutoBookingEnabled,
                    get().cornFocusMode,
                    weeklyChallenges,
                    completedChallengeHistory
                ),
            });
        },
        closeWeeklyPlanner: () => set({ isWeeklyPlannerOpen: false }),
        resetSeason: () => {
            const { currentPlayerId, players, transactions } = get();
            const playerIndex = players.findIndex(p => p.id === currentPlayerId);
            if (playerIndex === -1) return { success: false, error: 'Not logged in.' };

            const updatedPlayers = [...players];
            const current = updatedPlayers[playerIndex];
            updatedPlayers[playerIndex] = {
                ...current,
                balance: STARTING_BALANCE,
                xp: 0,
                level: 1,
                reputation: 0,
                ownedFieldIds: [],
                rentedFieldIds: [],
            };

            const baseTime: GameTime = { year: 1, season: 'Spring', week: 1 };
            const fieldStore = useFieldStore.getState();

            // Reset all game fields to fallow state (clear BBCH, farming stage, etc.)
            fieldStore.gameFields.forEach(f => {
                fieldStore.updateField(f.id, {
                    farmingStage: 'fallow',
                    bbchStage: undefined,
                    cropStage: 'none',
                    crop: 'Unplanted',
                    ndviScore: 0,
                    isScouted: false,
                    isSoilTested: false,
                    isAeriallySurveyed: false,
                    weedPressure: 'none',
                    healthStatus: 'good',
                    inputStatus: { needsWater: false, needsNutrients: false, needsProtection: false },
                });
            });
            fieldStore.syncGameFields([], []);

            // Clear all scouting localStorage data so the season truly starts fresh
            ScoutingStorage.clearAll();

            set({
                players: updatedPlayers,
                transactions: transactions.filter(txn => txn.playerId !== currentPlayerId),
                inventory: [],
                equipment: [],
                gameTime: baseTime,
                weeklyWeather: generateWeeklyWeather(baseTime, false),
                operatorCapacity: 2,
                operatorAssignmentsUsed: 0,
                activeRentals: [],
                weeklyChallenges: [],
                completedChallengeHistory: [],
                weekSummary: null,
                isWeeklyPlannerOpen: false,
                guideTargetId: null,
                guideMessage: null,
                deletedFieldIds: [],
                seasonLog: [],
                isAutoScoutingEnabled: false,
                isAutoIrrigationEnabled: false,
                isAutoProcurementEnabled: false,
                isAutoFieldOpsEnabled: false,
                isAutoBookingEnabled: false,
            });

            return { success: true };
        },

        setGuideTarget: (targetId, message = null) => set({ guideTargetId: targetId, guideMessage: message }),
        clearGuide: () => set({ guideTargetId: null, guideMessage: null }),

        toggleAutoScouting: () => set(state => ({ isAutoScoutingEnabled: !state.isAutoScoutingEnabled })),
        toggleAutoIrrigation: () => set(state => ({ isAutoIrrigationEnabled: !state.isAutoIrrigationEnabled })),
        toggleAutoProcurement: () => set(state => ({ isAutoProcurementEnabled: !state.isAutoProcurementEnabled })),
        toggleAutoFieldOps: () => set(state => ({ isAutoFieldOpsEnabled: !state.isAutoFieldOpsEnabled })),
        toggleAutoBooking: () => set(state => ({ isAutoBookingEnabled: !state.isAutoBookingEnabled }))
    }),
    {
        name: 'agri-os-game-storage',
        storage: createJSONStorage(() =>
            typeof window !== 'undefined' ? localStorage : {
                getItem: () => null,
                setItem: () => undefined,
                removeItem: () => undefined,
            }
        ),
        partialize: (state) => {
        // Don't persist seasonLog — it should reset each season
        const { seasonLog, ...rest } = state;
        return rest;
    },
    onRehydrateStorage: () => (state) => {
            // After rehydrating from localStorage, regenerate weather if the model is stale
            if (state && state.gameTime) {
                const normalizedTime: GameTime = {
                    year: state.gameTime.year,
                    season: state.gameTime.season,
                    week: state.gameTime.week,
                };
                const freshWeather = generateWeeklyWeather(normalizedTime);
                gameLog('ADVANCE', 'Store rehydrated — regenerating weather with current model', {
                    gameTime: normalizedTime,
                    oldFieldwork: state.weeklyWeather?.fieldworkOpen,
                    newFieldwork: freshWeather.fieldworkOpen,
                    oldSpray: state.weeklyWeather?.sprayOpen,
                    newSpray: freshWeather.sprayOpen,
                });
                useGameStore.setState({ gameTime: normalizedTime, weeklyWeather: freshWeather });
            }
        },
    }
)
);

// Season activity log: subscribe directly to gameLog. Delivery is queued by game-debug,
// so logs emitted inside Zustand set callbacks are appended after the state update settles.
if (typeof window !== 'undefined') {
    subscribeGameLog((entry) => {
        const state = useGameStore.getState();
        if (state && Array.isArray((state as any).seasonLog)) {
            useGameStore.setState({ seasonLog: [...(state as any).seasonLog.slice(-499), entry] } as any);
        }
    }, 'season-activity-log-store');
}
