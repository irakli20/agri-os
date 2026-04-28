'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bug, Calendar, CheckCircle2, Clock3, Cloud, Droplet, FlaskConical, Leaf, ShoppingCart, Sprout, Target, X, Tractor, Wrench } from 'lucide-react';
import { useGameStore, WeeklyChallenge, InventoryItem, ActiveRental } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { canPerformOperation } from '@/lib/game-logic/field-simulation';
import { Field } from '@/lib/mock-data';
import { CornGrowthTimeline } from '@/components/game/CornGrowthTimeline';
import { getRunbookTemplateForOperation } from '@/lib/runbooks-data';
import { MOCK_SUPPLY_PRODUCTS, type SupplyProduct } from '@/lib/supplies-store';
import { SERVICES } from '@/lib/marketplace-data';
import {
    FARM_STAGE_FLOW,
    formatStageLabel,
    getCurrentStageLabel,
    getFieldProgressPct,
    getNextFarmingStage,
    getNextStageLabel,
    normalizeFarmingStage,
} from '@/lib/corn-strategy';
import { StrategyActionButton, strategyActionClass, strategyNoticeClass } from '@/components/game/strategy-ui';
import { SeasonActivityLog } from '@/components/game/SeasonActivityLog';


interface WeeklyPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Stages where a crop is actively growing and crop metrics are meaningful
const CROP_ACTIVE_STAGES: NonNullable<Field['farmingStage']>[] = ['growing', 'harvest_ready'];
// Stages considered "in-progress" pre-plant pipeline
const PRE_PLANT_STAGES: NonNullable<Field['farmingStage']>[] = [
    'fallow', 'scouted', 'aerial_surveyed', 'soil_tested',
    'plowed', 'pre_plant_treated', 'tilled',
];
const SEASON_ORDER = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;
const WEEKS_PER_SEASON = 12;

function getPlannerWeekNumber(gameTime: { year: number; season: string; week: number }): number {
    const seasonIndex = SEASON_ORDER.findIndex((season) => season === gameTime.season);
    return ((gameTime.year - 1) * SEASON_ORDER.length * WEEKS_PER_SEASON)
        + (Math.max(0, seasonIndex) * WEEKS_PER_SEASON)
        + gameTime.week;
}

function getEscalationCountdown(challenge: WeeklyChallenge, currentWeek: number): string | null {
    if (!challenge.createdWeek || !challenge.escalationWeeks || challenge.severity === 'severe') return null;

    const threshold = challenge.severity === 'moderate'
        ? challenge.escalationWeeks * 2
        : challenge.escalationWeeks;
    const weeksRemaining = Math.max(0, threshold - (currentWeek - challenge.createdWeek));
    if (weeksRemaining <= 0) return 'Escalates this week';
    return `Escalates in ${weeksRemaining} week${weeksRemaining === 1 ? '' : 's'}`;
}

function priorityClass(priority: WeeklyChallenge['priority']) {
    switch (priority) {
        case 'critical':
            return 'text-red-300 border-red-500/30 bg-red-500/10';
        case 'high':
            return 'text-orange-300 border-orange-500/30 bg-orange-500/10';
        default:
            return 'text-primary border-primary/30 bg-primary/10';
    }
}

function severityClass(severity?: WeeklyChallenge['severity']) {
    switch (severity) {
        case 'severe':
            return 'text-red-300 border-red-500/30 bg-red-500/10';
        case 'moderate':
            return 'text-orange-300 border-orange-500/30 bg-orange-500/10';
        case 'mild':
            return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
        default:
            return 'text-muted-foreground border-white/10 bg-white/5';
    }
}

function getChallengeCategoryMeta(category?: WeeklyChallenge['category']) {
    switch (category) {
        case 'pest':
            return { label: 'Pest', Icon: Bug, className: 'text-red-300 bg-red-500/10 border-red-500/20' };
        case 'disease':
            return { label: 'Disease', Icon: Droplet, className: 'text-sky-300 bg-sky-500/10 border-sky-500/20' };
        case 'weed':
            return { label: 'Weed', Icon: Leaf, className: 'text-green-300 bg-green-500/10 border-green-500/20' };
        case 'nutrient':
            return { label: 'Nutrient', Icon: FlaskConical, className: 'text-violet-300 bg-violet-500/10 border-violet-500/20' };
        case 'weather':
            return { label: 'Weather', Icon: Cloud, className: 'text-slate-200 bg-slate-500/10 border-slate-500/20' };
        case 'other':
            return { label: 'Field Risk', Icon: AlertTriangle, className: 'text-amber-300 bg-amber-500/10 border-amber-500/20' };
        default:
            return null;
    }
}

type PlannerWindowKind = 'desk' | 'fieldwork' | 'spray' | 'harvest' | 'review';

function normalizePlannerOperation(operationId?: string): string {
    const mapping: Record<string, string> = {
        'serv-plow': 'op-plow',
        'serv-till': 'op-till',
        'serv-plant-drill': 'op-plant',
        'serv-plant-manual': 'op-plant',
        'serv-harvest-hand': 'op-harvest',
        'serv-harvest-combine-corn': 'op-harvest',
        'serv-aerial-survey': 'op-aerial-survey',
        'serv-pre-plant-herbicide': 'op-pre-plant-herbicide',
        'serv-residue-management': 'op-residue-management',
        'serv-fertilize-incorporated': 'op-apply-fertilizer-incorporated',
        'serv-topdress-fertilizer': 'op-topdress-fertilizer',
    };
    return operationId ? mapping[operationId] || operationId : '';
}

function getPlannerWindowKind(operationId?: string): PlannerWindowKind {
    const op = normalizePlannerOperation(operationId);
    if (!op) return 'desk';
    if (op === 'weekly-plan-open') return 'review';
    if (op.startsWith('buy-') || op === 'hire-operator' || op === 'maint-equipment') return 'desk';
    if (['serv-spray-drone', 'op-apply-herbicide'].includes(op)) return 'spray';
    if (['op-harvest'].includes(op)) return 'harvest';
    if ([
        'op-scout',
        'op-aerial-survey',
        'op-soil-test',
        'op-plow',
        'op-pre-plant-herbicide',
        'op-till',
        'op-plant',
        'op-apply-fertilizer-incorporated',
        'op-topdress-fertilizer',
        'op-residue-management',
    ].includes(op)) {
        return 'fieldwork';
    }
    return 'desk';
}

function isPlannerWindowOpen(day: { fieldworkOpen: boolean; sprayOpen: boolean; harvestOpen: boolean }, kind: PlannerWindowKind): boolean {
    if (kind === 'desk' || kind === 'review') return true;
    if (kind === 'fieldwork') return day.fieldworkOpen;
    if (kind === 'spray') return day.sprayOpen;
    if (kind === 'harvest') return day.harvestOpen;
    return true;
}

function plannerWindowLabel(kind: PlannerWindowKind): string {
    const labels: Record<PlannerWindowKind, string> = {
        desk: 'Desk',
        fieldwork: 'Fieldwork',
        spray: 'Spray',
        harvest: 'Harvest',
        review: 'Review',
    };
    return labels[kind];
}

function plannerWindowClass(kind: PlannerWindowKind): string {
    const classes: Record<PlannerWindowKind, string> = {
        desk: 'bg-white/10 text-zinc-100',
        fieldwork: 'bg-green-500/15 text-green-200',
        spray: 'bg-sky-500/15 text-sky-200',
        harvest: 'bg-amber-500/15 text-amber-200',
        review: 'bg-violet-500/15 text-violet-200',
    };
    return classes[kind];
}

export function WeeklyPlanningModal({ isOpen, onClose }: WeeklyPlanningModalProps) {
    const router = useRouter();
    const {
        gameTime,
        weeklyWeather,
        operatorCapacity,
        operatorAssignmentsUsed,
        inventory,
        weeklyChallenges,
        weekSummary,
        dismissWeekSummary,
        performFieldOperation,
        buySupplies,
        hireTemporaryOperator,
        completeChallenge,
        refreshWeeklyChallenges,
        advanceTime,
        placePendingOrder,
        serviceEquipment,
        cornFocusMode,
        pendingOrders,
        isAutoProcurementEnabled,
        isAutoFieldOpsEnabled,
        isAutoBookingEnabled,
    } = useGameStore();
    const { gameFields } = useFieldStore();
    const [advancingAction, setAdvancingAction] = useState<'week' | 'spring' | null>(null);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [recentInputPurchases, setRecentInputPurchases] = useState<Array<{
        id: string;
        itemName: string;
        category: 'fertilizer' | 'chemical';
        fieldName?: string;
        at: number;
    }>>([]);
    const [inventoryPulse, setInventoryPulse] = useState<{
        fertilizer: boolean;
        chemical: boolean;
        seed: boolean;
        fuel: boolean;
    }>({
        fertilizer: false,
        chemical: false,
        seed: false,
        fuel: false,
    });
    const [pendingExecution, setPendingExecution] = useState<{
        challenge: WeeklyChallenge;
        field: Field | null;
        operationId: string;
        fieldId: string | null;
        challengeId: string;
        challengeTitle: string;
    } | null>(null);
    const [showCornExpertDetails, setShowCornExpertDetails] = useState(false);
    const [pulsingChallengeIds, setPulsingChallengeIds] = useState<Set<string>>(new Set());
    const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);
    const SUPPLY_ID_ALIAS: Record<string, string> = {
        'pest-gaucho': 'chem-gaucho',
        'pest-maister-power': 'chem-maister-power',
        'pest-adengo': 'chem-adengo',
        'pest-decis-expert': 'chem-decis-expert',
    };

    const openChallenges = useMemo(
        () => weeklyChallenges.filter((ch) => ch.status === 'open'),
        [weeklyChallenges]
    );
    const currentChallengeWeek = useMemo(() => getPlannerWeekNumber(gameTime), [gameTime]);
    const isAdvancing = advancingAction !== null;

    const runAdvance = (action: 'week' | 'spring', delayMs: number, advance: () => void) => {
        setAdvancingAction(action);
        window.setTimeout(() => {
            try {
                advance();
            } catch (error) {
                console.error('[WeeklyPlanningModal] advance failed', error);
                setActionMessage({
                    type: 'error',
                    text: error instanceof Error
                        ? `Advance failed: ${error.message}`
                        : 'Advance failed. Check the console for details.',
                });
            } finally {
                setAdvancingAction(null);
            }
        }, delayMs);
    };

    const inventoryMetrics = useMemo(() => {
        const summarize = (category: InventoryItem['category']) =>
            inventory
                .filter((item) => item.category === category)
                .reduce((sum, item) => sum + Math.max(0, item.quantity || 0), 0);

        return {
            fertilizerUnits: summarize('fertilizer'),
            chemicalUnits: summarize('chemical'),
            seedUnits: summarize('seed'),
            fuelUnits: summarize('fuel'),
        };
    }, [inventory]);

    // Pulse animation on priority titles when challenges are refreshed
    const prevChallengeCountRef = useRef((weeklyChallenges || []).length);
    useEffect(() => {
        const currentCount = weeklyChallenges.filter(c => c.status === 'open').length;
        // Only pulse if the open challenge list actually changed (not on mount)
        if (prevChallengeCountRef.current !== 0 && prevChallengeCountRef.current !== currentCount) {
            const ids = new Set(weeklyChallenges.filter(c => c.status === 'open').map(c => c.id));
            setPulsingChallengeIds(ids);
            const timeout = setTimeout(() => setPulsingChallengeIds(new Set()), 1500);
            return () => clearTimeout(timeout);
        }
        prevChallengeCountRef.current = currentCount;
    }, [weeklyChallenges]);
    
    useEffect(() => {
        if (!isOpen) return;
        if (weeklyChallenges.length === 0) {
            refreshWeeklyChallenges();
        }
    }, [isOpen, refreshWeeklyChallenges, weeklyChallenges.length]);

    useEffect(() => {
        if (!isOpen || typeof document === 'undefined') return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const stageCounts = useMemo(() => {
        return gameFields.reduce<Record<string, number>>((acc, field) => {
            const key = field.farmingStage || 'fallow';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }, [gameFields]);

    const isDirectFieldOperation = (operationId: string) => {
        return operationId.startsWith('op-') || operationId === 'serv-spray-drone' || operationId === 'serv-irrigate';
    };

    const getLogicalOperationForStage = (field: Field): string | null => {
        const stage = field.farmingStage || 'fallow';
        if (stage === 'growing') {
            if (field.inputStatus?.needsProtection) return 'serv-spray-drone';
            if (field.inputStatus?.needsWater) return 'serv-irrigate';
            return null;
        }
        switch (stage) {
            case 'fallow':
                return 'op-scout';
            case 'scouted':
                return 'op-soil-test';
            case 'soil_tested':
                return 'op-plow';
            case 'plowed':
                return 'op-till';
            case 'tilled':
                return 'op-plant';
            case 'harvested':
                return 'op-plow';
            case 'harvest_ready':
                return 'op-harvest';
            default:
                return null;
        }
    };

    const handleExecuteAction = (challenge: WeeklyChallenge, field: Field | null | undefined) => {
        setActionMessage(null);
        const liveChallenge = resolveLiveChallenge(challenge) || challenge;
        const liveField = liveChallenge.fieldId
            ? gameFields.find((f) => f.id === liveChallenge.fieldId) || field
            : field;
        const operationId = liveChallenge.operationId || challenge.operationId;
        const fieldId = liveChallenge.fieldId || challenge.fieldId;
        const challengeId = liveChallenge.id || challenge.id;
        const challengeTitle = liveChallenge.title || challenge.title;

        if (!operationId) return;

        if (operationId === 'buy-fertilizer' || operationId === 'buy-chemical') {
            quickBuyPlannerInput(liveChallenge, liveField || null);
            return;
        }

        if (operationId === 'buy-seeds') {
            const seeds = MOCK_SUPPLY_PRODUCTS.filter(p => p.category === 'seeds' && p.inStock);
            const seedProduct = seeds.find(p => p.isCornRelated) || seeds[0];
            if (seedProduct) {
                const item = toInventoryItem(seedProduct);
                const result = buySupplies(item, seedProduct.price);
                if (result.success) {
                    completeChallenge(challengeId);
                    refreshWeeklyChallenges();
                    setActionMessage({ type: 'success', text: `Purchased ${seedProduct.name}!` });
                } else {
                    setActionMessage({ type: 'error', text: result.error || 'Purchase failed.' });
                }
            } else {
                setActionMessage({ type: 'error', text: 'No seeds available.' });
            }
            return;
        }

        if (operationId === 'buy-fuel') {
            const fuels = MOCK_SUPPLY_PRODUCTS.filter(p => p.category === 'fuel' && p.inStock);
            const fuelProduct = fuels[0];
            if (fuelProduct) {
                const item: InventoryItem = { id: fuelProduct.id, name: fuelProduct.name, category: 'fuel', quantity: 1, unit: fuelProduct.unit };
                const result = buySupplies(item, fuelProduct.price);
                if (result.success) {
                    completeChallenge(challengeId);
                    refreshWeeklyChallenges();
                    setActionMessage({ type: 'success', text: `Purchased ${fuelProduct.name}!` });
                } else {
                    setActionMessage({ type: 'error', text: result.error || 'Purchase failed.' });
                }
            } else {
                setActionMessage({ type: 'error', text: 'No fuel available.' });
            }
            return;
        }

        if (operationId === 'hire-operator') {
            const result = hireTemporaryOperator();
            if (result.success) {
                completeChallenge(challengeId);
                setActionMessage({ type: 'success', text: 'Temporary operators hired for this week.' });
            } else {
                setActionMessage({ type: 'error', text: result.error || 'Could not hire operators.' });
            }
            return;
        }

        if (operationId === 'maint-equipment') {
            const result = serviceEquipment();
            if (result.success) {
                completeChallenge(challengeId);
                setActionMessage({ type: 'success', text: 'Equipment service completed.' });
            } else {
                setActionMessage({ type: 'error', text: result.error || 'Could not service equipment.' });
            }
            return;
        }

        if (operationId.startsWith('serv-')) {
            quickHireService(liveChallenge, liveField || null);
            return;
        }

        executeDirectFieldOperation(fieldId!, operationId, challengeId, challengeTitle);
    };

    const executeDirectFieldOperation = (
        fieldId: string,
        operationId: string,
        challengeId: string,
        challengeTitle: string
    ) => {
        const currentField = useFieldStore.getState().gameFields.find((field) => field.id === fieldId);
        if (!currentField) {
            console.log(`[EXEC] Field not found: ${fieldId}`);
            setActionMessage({ type: 'error', text: 'Field not found for this priority. Plan refreshed.' });
            refreshWeeklyChallenges();
            return;
        }

        console.log(`[EXEC] executeDirectFieldOperation`, {
            fieldId,
            operationId,
            fieldName: currentField.name,
            stage: currentField.farmingStage,
            cropStage: currentField.cropStage,
            bbch: currentField.bbchStage,
            fieldwork: weeklyWeather.fieldworkOpen,
            spray: weeklyWeather.sprayOpen,
            precip: weeklyWeather.precipitationChance,
            wind: weeklyWeather.windMph,
        });

        if (operationId === 'weekly-plan-open') {
            completeChallenge(challengeId);
            const isWindow = challengeTitle.toLowerCase().includes('window');
            const isSeasonal = challengeTitle.toLowerCase().includes('season');
            setActionMessage({ type: 'success', text: isWindow ? 'Confirmed: Waiting for correct season.' : isSeasonal ? 'Acknowledged: No action available for current growth stage. Plan applies later in the season.' : 'Acknowledged: Review complete. The recommended action will be available at the right field stage.' });
            refreshWeeklyChallenges();
            return;
        }

        const logicalOp = getLogicalOperationForStage(currentField);
        let opToRun = operationId;
        let adjusted = false;

        const originalValidation = canPerformOperation(currentField, operationId, cornFocusMode);

        // Priority 1: User's explicitly clicked operation, if valid for stage
        if (originalValidation.allowed) {
            opToRun = operationId;
            adjusted = false;
        }
        // Priority 2: Fallback to the logical operation for the current stage if the clicked one is now invalid
        else if (logicalOp && logicalOp !== operationId && canPerformOperation(currentField, logicalOp, cornFocusMode).allowed) {
            opToRun = logicalOp;
            adjusted = true;
        }

        // Weather Intercepts for Direct Operations
        if (opToRun === 'op-apply-herbicide' || opToRun === 'serv-spray-drone') {
            if (!weeklyWeather.sprayOpen) {
                placePendingOrder({ operationId: 'serv-spray-drone', fieldId, name: currentField.name });
                completeChallenge(challengeId);
                refreshWeeklyChallenges();
                setActionMessage({ type: 'success', text: `Weather blocked flight. Order placed! Will automatically execute during next calm window.` });
                return;
            }
        } else if (opToRun === 'op-topdress-fertilizer' || opToRun === 'op-apply-fertilizer-incorporated' || opToRun === 'op-pre-plant-herbicide') {
            if (!weeklyWeather.fieldworkOpen) {
                placePendingOrder({ operationId: opToRun, fieldId, name: currentField.name });
                completeChallenge(challengeId);
                refreshWeeklyChallenges();
                setActionMessage({ type: 'success', text: `Weather blocked fieldwork. Ground application queued for next clear window.` });
                return;
            }
        }

        const initial = performFieldOperation(fieldId, opToRun);
        if (initial.success) {
            completeChallenge(challengeId);
            setActionMessage({
                type: 'success',
                text: adjusted
                    ? `Stage changed. Auto-executed next logical task: ${challengeTitle}`
                    : `Completed: ${challengeTitle}`
            });
            return;
        }

        // Recompute tasks and try the latest valid direct operation for this field once.
        refreshWeeklyChallenges();
        const latestOpenFieldTask = useGameStore.getState().weeklyChallenges.find((nextChallenge) =>
            nextChallenge.status === 'open' &&
            nextChallenge.fieldId === fieldId &&
            !!nextChallenge.operationId &&
            isDirectFieldOperation(nextChallenge.operationId) &&
            canPerformOperation(useFieldStore.getState().gameFields.find((field) => field.id === fieldId) || currentField, nextChallenge.operationId, cornFocusMode).allowed
        );

        if (latestOpenFieldTask?.operationId && latestOpenFieldTask.operationId !== operationId) {
            const retry = performFieldOperation(fieldId, latestOpenFieldTask.operationId);
            if (retry.success) {
                completeChallenge(latestOpenFieldTask.id);
                setActionMessage({
                    type: 'success',
                    text: `Task was updated to current stage and completed: ${latestOpenFieldTask.title}`
                });
                return;
            }
        }

        setActionMessage({
            type: 'error',
            text: (initial.error || 'Could not execute this priority.') + ' Plan refreshed with current valid tasks.'
        });
    };

    const toInventoryItem = (product: SupplyProduct): InventoryItem => ({
        id: SUPPLY_ID_ALIAS[product.id] || product.id,
        name: product.name,
        category: product.category === 'fertilizer' ? 'fertilizer' :
                  product.category === 'seeds' ? 'seed' :
                  product.category === 'fuel' ? 'fuel' : 'chemical',
        quantity: 1,
        unit: product.unit,
    });

    const resolvePlannerSupplyProduct = (
        operationId: string,
        challengeTitle: string,
        field: Field | null
    ): SupplyProduct | null => {
        const isCornField = (field?.crop || '').toLowerCase().includes('corn');
        const preferCorn = cornFocusMode || isCornField;
        const title = challengeTitle.toLowerCase();

        if (operationId === 'buy-fertilizer') {
            const fertilizers = MOCK_SUPPLY_PRODUCTS.filter((p) => p.category === 'fertilizer' && p.inStock);
            if (fertilizers.length === 0) return null;
            if (preferCorn) {
                const cornFirst = fertilizers.find((p) => p.isCornRelated);
                if (cornFirst) return cornFirst;
            }
            return fertilizers[0];
        }

        if (operationId === 'buy-chemical') {
            const chemicals = MOCK_SUPPLY_PRODUCTS.filter((p) => p.category === 'pesticide' && p.inStock);
            if (chemicals.length === 0) return null;

            const preferredSpecific =
                (title.includes('gaucho') && chemicals.find((p) => p.id === 'pest-gaucho')) ||
                (title.includes('maister') && chemicals.find((p) => p.id === 'pest-maister-power')) ||
                (title.includes('adengo') && chemicals.find((p) => p.id === 'pest-adengo')) ||
                (title.includes('decis') && chemicals.find((p) => p.id === 'pest-decis-expert')) ||
                // Pre-plant herbicide: prefer Maister Power or Adengo or Glyphosate
                ((title.includes('herbicide') || title.includes('pre-plant')) &&
                    (chemicals.find((p) => p.id === 'pest-maister-power') ||
                     chemicals.find((p) => p.id === 'pest-adengo') ||
                     chemicals.find((p) => p.id === 'pest-3')));

            if (preferredSpecific) return preferredSpecific;
            if (preferCorn) {
                const cornFirst = chemicals.find((p) => p.isCornRelated);
                if (cornFirst) return cornFirst;
            }
            return chemicals[0];
        }

        return null;
    };

    const quickBuyPlannerInput = (
        challenge: WeeklyChallenge,
        field: Field | null
    ) => {
        const operationId = challenge.operationId;
        if (!operationId || !['buy-fertilizer', 'buy-chemical'].includes(operationId)) {
            return;
        }

        const product = resolvePlannerSupplyProduct(operationId, challenge.title, field);
        if (!product) {
            setActionMessage({
                type: 'error',
                text: `No in-stock ${operationId === 'buy-fertilizer' ? 'fertilizer' : 'chemical'} is currently available.`,
            });
            return;
        }

        const result = buySupplies(toInventoryItem(product), product.price);
        if (!result.success) {
            setActionMessage({
                type: 'error',
                text: result.error || `Could not purchase ${product.name}.`,
            });
            return;
        }

        const pulseKey = operationId === 'buy-fertilizer' ? 'fertilizer' : 'chemical';
        const purchaseCategory: 'fertilizer' | 'chemical' =
            operationId === 'buy-fertilizer' ? 'fertilizer' : 'chemical';
        setInventoryPulse((prev) => ({ ...prev, [pulseKey]: true }));
        setTimeout(() => {
            setInventoryPulse((prev) => ({ ...prev, [pulseKey]: false }));
        }, 1400);

        completeChallenge(challenge.id);
        refreshWeeklyChallenges();
        setRecentInputPurchases((prev) => [
            {
                id: `${challenge.id}-${Date.now()}`,
                itemName: product.name,
                category: purchaseCategory,
                fieldName: field?.name,
                at: Date.now(),
            },
            ...prev,
        ].slice(0, 4));
        setActionMessage({
            type: 'success',
            text: `Purchased ${product.name} from Weekly Planner and completed this priority.`,
        });
    };

    const quickHireService = (
        challenge: WeeklyChallenge,
        field: Field | null,
    ) => {
        console.log('[Hire] quickHireService triggered for:', challenge.operationId, 'field:', field?.name);
        const operationId = challenge.operationId;
        if (!operationId || !field) {
            console.log('[Hire] Missing operationId or field! Aborting.');
            return;
        }

        let serviceId = operationId;

        // Dynamic Weather Selection
        if (operationId === 'op-apply-herbicide' || operationId === 'serv-spray-drone') {
            if (weeklyWeather.sprayOpen) {
                serviceId = 'serv-spray-drone';
            } else {
                console.log('[Hire] Weather blocked drone service. Sending to pending queue...');
                placePendingOrder({
                    operationId,
                    fieldId: field.id,
                    name: field.name
                });
                completeChallenge(challenge.id);
                refreshWeeklyChallenges();
                setActionMessage({ type: 'success', text: `Weather blocked drone flight. Order placed for next calm window.` });
                return;
            }
        } else if (operationId === 'op-topdress-fertilizer' || operationId === 'serv-topdress-fertilizer') {
            if (weeklyWeather.fieldworkOpen) {
                serviceId = 'serv-topdress-fertilizer';
            } else {
                console.log('[Hire] Weather blocked ground service. Sending to pending queue...');
                placePendingOrder({
                    operationId,
                    fieldId: field.id,
                    name: field.name
                });
                completeChallenge(challenge.id);
                refreshWeeklyChallenges();
                setActionMessage({ type: 'success', text: `Weather blocked fieldwork. Ground application queued.` });
                return;
            }
        }
        // Standard Mappings
        else if (operationId === 'op-plow') serviceId = 'serv-plow';
        else if (operationId === 'op-till') serviceId = 'serv-till';
        else if (operationId === 'op-plant') serviceId = 'serv-plant-drill';
        else if (operationId === 'op-harvest') serviceId = 'serv-harvest-combine-corn';
        else if (operationId === 'op-apply-fertilizer-incorporated') serviceId = 'serv-fertilize-incorporated';
        else if (operationId === 'op-pre-plant-herbicide') serviceId = 'serv-pre-plant-herbicide';
        else if (operationId === 'op-scout' || operationId === 'op-aerial-survey') serviceId = 'serv-aerial-survey';
        else if (operationId === 'op-soil-test') serviceId = 'serv-soil-test';
        else if (operationId === 'op-irrigation-setup') serviceId = 'serv-irrigate';
        else if (operationId === 'op-residue-management') serviceId = 'serv-residue-management';

        const service = SERVICES.find((s) => s.id === serviceId);
        if (!service) {
            setActionMessage({ type: 'error', text: 'No matching service found for this operation.' });
            return;
        }

        const acres = field.acres || 10;
        const hectares = Math.max(0.1, acres / 2.471);
        const totalCost = Math.round(service.pricePerHectare * hectares);

        // Validate the operation is still valid for the field's current stage
        const stageCheck = canPerformOperation(field, operationId, cornFocusMode);
        if (!stageCheck.allowed) {
            completeChallenge(challenge.id);
            refreshWeeklyChallenges();
            setActionMessage({ type: 'success', text: `Field stage changed since this task was created. Refresh your priorities — the updated task will match the current stage.` });
            return;
        }

        const rental: ActiveRental = {
            id: `rental-${Date.now()}`,
            serviceId: service.id,
            name: service.name,
            expiresAtWeek: gameTime.week + service.durationWeeks,
            fieldId: field.id
        };

        const result = useGameStore.getState().addRental(rental, totalCost);
        console.log('[Hire] addRental result:', result);
        if (result.success) {
            completeChallenge(challenge.id);
            refreshWeeklyChallenges();
            setActionMessage({ type: 'success', text: `Hired & executed ${service.name} for ${field.name}!` });
        } else {
            // It might fail if funds are too low, but since weather blocked it, check pending orders too.
            // Wait, we didn't block fieldwork operations! Let's handle generic weather blocks for fieldwork too!
            const errorText = (result.error || '').toLowerCase();
            if (errorText.includes('window') || errorText.includes('closed') || errorText.includes('blocked by weather')) {
                placePendingOrder({
                    operationId,
                    fieldId: field.id,
                    name: field.name
                });
                completeChallenge(challenge.id);
                refreshWeeklyChallenges();
                const isWindow = errorText.includes('window') || errorText.includes('closed');
                setActionMessage({ type: 'success', text: isWindow ? `Season window closed. Service queued.` : `Service booked on standby queue! Execution will occur during next calm window.` });
                return;
            } else {
                setActionMessage({ type: 'error', text: result.error || 'Could not hire service.' });
            }
        }
    };

    const resolveLiveChallenge = (snapshot: WeeklyChallenge): WeeklyChallenge | null => {
        const latest = useGameStore.getState().weeklyChallenges.filter((challenge) => challenge.status === 'open');

        const byId = latest.find((challenge) => challenge.id === snapshot.id);
        if (byId) return byId;

        if (snapshot.fieldId && snapshot.operationId) {
            const byFieldAndOperation = latest.find((challenge) =>
                challenge.fieldId === snapshot.fieldId &&
                challenge.operationId === snapshot.operationId
            );
            if (byFieldAndOperation) return byFieldAndOperation;
        }

        if (snapshot.fieldId) {
            const byFieldAndTitle = latest.find((challenge) =>
                challenge.fieldId === snapshot.fieldId &&
                challenge.title === snapshot.title
            );
            if (byFieldAndTitle) return byFieldAndTitle;

            const sameField = latest.find((challenge) => challenge.fieldId === snapshot.fieldId);
            if (sameField) return sameField;
        }

        if (snapshot.operationId) {
            const sameOp = latest.find((challenge) => challenge.operationId === snapshot.operationId);
            if (sameOp) return sameOp;
        }

        return latest[0] || null;
    };

    const growthSignals = useMemo(() => {
        return gameFields
            // Only show crop vigor notices for fields that actually have a growing crop
            .filter((field) => CROP_ACTIVE_STAGES.includes(
                normalizeFarmingStage(field.farmingStage) as typeof CROP_ACTIVE_STAGES[number]
            ))
            .map((field) => {
                const stage = normalizeFarmingStage(field.farmingStage);

                const nextStageLabel = getNextStageLabel(field);
                const progressPct = getFieldProgressPct(field);

                const ndvi = Math.round((field.ndviScore || 0) * 100);
                const vigor = ndvi >= 70 ? 'Strong' : ndvi >= 45 ? 'Moderate' : 'Weak';
                return {
                    id: field.id,
                    name: field.name,
                    crop: field.crop || 'Unknown',
                    stage: (field.cropStage as string) || (stage as string),
                    nextStage: nextStageLabel as string | null,
                    progressPct,
                    ndvi,
                    vigor,
                    needsAttention: !!(field.inputStatus?.needsWater || field.inputStatus?.needsNutrients || field.inputStatus?.needsProtection),
                    // Weed pressure only meaningful after aerial survey or scouting
                    weedPressure: (field.isAeriallySurveyed || field.isScouted) ? (field.weedPressure || 'none') : null,
                };
            });
    }, [gameFields]);

    const fieldPipelineSignals = useMemo(() => {
        // Fields actively being prepared (pre-plant) — show pipeline progress, no crop metrics
        return gameFields
            .filter((field) => {
                const s = normalizeFarmingStage(field.farmingStage);
                return PRE_PLANT_STAGES.includes(s as typeof PRE_PLANT_STAGES[number]);
            })
            .map((field) => {
                const stage = normalizeFarmingStage(field.farmingStage);
                const nextStage = getNextFarmingStage(stage);
                const stageIndex = FARM_STAGE_FLOW.indexOf(stage);
                const progressPct = Math.max(0, Math.min(100, ((stageIndex + 1) / FARM_STAGE_FLOW.length) * 100));
                return {
                    id: field.id,
                    name: field.name,
                    crop: field.crop || 'Unknown',
                    stage,
                    nextStage,
                    progressPct,
                    needsAttention: !!(field.inputStatus?.needsWater || field.inputStatus?.needsNutrients),
                };
            });
    }, [gameFields]);

    const dailyExecutionPlan = useMemo(() => {
        const days = weeklyWeather.dailyForecast || [];
        const dayPlans = days.map((day) => ({
            ...day,
            planned: [] as Array<{
                id: string;
                title: string;
                fieldName?: string;
                priority: WeeklyChallenge['priority'];
                windowKind: PlannerWindowKind;
                operationId?: string;
            }>,
            blocked: [] as Array<{
                id: string;
                title: string;
                fieldName?: string;
                windowKind: PlannerWindowKind;
            }>,
        }));

        openChallenges.forEach((challenge) => {
            const windowKind = getPlannerWindowKind(challenge.operationId);
            const fieldName = challenge.fieldId
                ? gameFields.find((field) => field.id === challenge.fieldId)?.name
                : undefined;
            const firstOpenDay = dayPlans.find((day) => isPlannerWindowOpen(day, windowKind));
            const item = {
                id: challenge.id,
                title: challenge.title,
                fieldName,
                priority: challenge.priority,
                windowKind,
                operationId: challenge.operationId,
            };

            if (firstOpenDay) {
                firstOpenDay.planned.push(item);
                return;
            }

            dayPlans.forEach((day) => {
                day.blocked.push({
                    id: challenge.id,
                    title: challenge.title,
                    fieldName,
                    windowKind,
                });
            });
        });

        return dayPlans;
    }, [gameFields, openChallenges, weeklyWeather.dailyForecast]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] bg-zinc-950 text-foreground">
            <div className="h-screen w-screen overflow-y-auto bg-zinc-950">
                <div className="sticky top-0 z-10 bg-zinc-950 border-b border-white/10 px-5 py-4 flex items-center justify-between shadow-2xl">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Weekly Strategy Planner
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Year {gameTime.year} • {gameTime.season} • Week {gameTime.week}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-modal-secondary !p-2 !w-10 !h-10 flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {actionMessage && (
                        <div className={strategyNoticeClass(actionMessage.type)}>
                            {actionMessage.text}
                        </div>
                    )}

                    {pendingExecution && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                            <div className="modal-shell max-w-md w-full bg-zinc-950/95 border border-white/10 rounded-xl p-6 shadow-2xl">
                                <div className="text-center">
                                    <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-7 h-7 text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Confirm Execution</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        You are about to execute the following task:
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                                    <div className="font-semibold text-foreground mb-1">{pendingExecution.challengeTitle}</div>
                                    <div className="text-sm text-muted-foreground mb-2">{pendingExecution.challenge.description}</div>
                                    {pendingExecution.field && (
                                        <div className="text-xs text-muted-foreground">
                                            <span className="text-muted-foreground/70">Field:</span> {pendingExecution.field.name}
                                        </div>
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                        <span className="text-muted-foreground/70">Operation:</span> {pendingExecution.operationId}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                        <span className="text-xs text-green-400 font-medium">+{pendingExecution.challenge.rewardXp} XP</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <StrategyActionButton
                                        onClick={() => setPendingExecution(null)}
                                        variant="neutral"
                                        className="flex-1 px-4 py-2.5"
                                    >
                                        Cancel
                                    </StrategyActionButton>
                                    <StrategyActionButton
                                        onClick={() => {
                                            const { fieldId, operationId, challengeId, challengeTitle, challenge, field } = pendingExecution;
                                            setPendingExecution(null);

                                            if (operationId === 'buy-fertilizer' || operationId === 'buy-chemical') {
                                                quickBuyPlannerInput(challenge, field);
                                                return;
                                            }

                                            if (operationId === 'buy-seeds') {
                                                const seeds = MOCK_SUPPLY_PRODUCTS.filter(p => p.category === 'seeds' && p.inStock);
                                                const seedProduct = seeds.find(p => p.isCornRelated) || seeds[0];
                                                if (seedProduct) {
                                                    const item = toInventoryItem(seedProduct);
                                                    const result = buySupplies(item, seedProduct.price);
                                                    if (result.success) {
                                                        completeChallenge(challengeId);
                                                        refreshWeeklyChallenges();
                                                        setActionMessage({ type: 'success', text: `Purchased ${seedProduct.name}!` });
                                                    } else {
                                                        setActionMessage({ type: 'error', text: result.error || 'Purchase failed.' });
                                                    }
                                                } else {
                                                    setActionMessage({ type: 'error', text: 'No seeds available.' });
                                                }
                                                return;
                                            }

                                            if (operationId === 'buy-fuel') {
                                                const fuels = MOCK_SUPPLY_PRODUCTS.filter(p => p.category === 'fuel' && p.inStock);
                                                const fuelProduct = fuels[0];
                                                if (fuelProduct) {
                                                    const item: InventoryItem = { id: fuelProduct.id, name: fuelProduct.name, category: 'fuel', quantity: 1, unit: fuelProduct.unit };
                                                    const result = buySupplies(item, fuelProduct.price);
                                                    if (result.success) {
                                                        completeChallenge(challengeId);
                                                        refreshWeeklyChallenges();
                                                        setActionMessage({ type: 'success', text: `Purchased ${fuelProduct.name}!` });
                                                    } else {
                                                        setActionMessage({ type: 'error', text: result.error || 'Purchase failed.' });
                                                    }
                                                } else {
                                                    setActionMessage({ type: 'error', text: 'No fuel available.' });
                                                }
                                                return;
                                            }

                                            if (operationId === 'hire-operator') {
                                                const result = hireTemporaryOperator();
                                                if (result.success) {
                                                    completeChallenge(challengeId);
                                                    setActionMessage({ type: 'success', text: 'Temporary operators hired for this week.' });
                                                } else {
                                                    setActionMessage({ type: 'error', text: result.error || 'Could not hire operators.' });
                                                }
                                                return;
                                            }

                                            if (operationId === 'maint-equipment') {
                                                const result = serviceEquipment();
                                                if (result.success) {
                                                    completeChallenge(challengeId);
                                                    setActionMessage({ type: 'success', text: 'Equipment service completed.' });
                                                } else {
                                                    setActionMessage({ type: 'error', text: result.error || 'Could not service equipment.' });
                                                }
                                                return;
                                            }

                                            if (operationId === 'weekly-plan-open') {
                                                completeChallenge(challengeId);
                                                setActionMessage({ type: 'success', text: 'Reviewed weekly constraints.' });
                                                return;
                                            }

                                            if (operationId.startsWith('op-') && fieldId && isDirectFieldOperation(operationId)) {
                                                executeDirectFieldOperation(fieldId, operationId, challengeId, challengeTitle);
                                                return;
                                            }

                                            if ((operationId.startsWith('op-') || operationId.startsWith('serv-')) && field) {
                                                quickHireService(challenge, field);
                                                return;
                                            }

                                            setActionMessage({ type: 'error', text: 'No field attached to this operation.' });
                                        }}
                                        variant="secondary"
                                        className="flex-1 px-4 py-2.5"
                                    >
                                        Confirm Execute
                                    </StrategyActionButton>
                                </div>
                            </div>
                        </div>
                    )}

                    {weekSummary && (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-4">
                            <div className="text-sm">
                                <div className="font-semibold">Last Week Summary ({weekSummary.periodLabel})</div>
                                <div className="text-muted-foreground">{weekSummary.message}</div>
                            </div>
                            <div className="ml-auto flex gap-2 text-xs">
                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-300">Completed: {weekSummary.completed}</span>
                                <span className="px-2 py-1 rounded bg-red-500/20 text-red-300">Missed: {weekSummary.missed}</span>
                            </div>
                            <button
                                onClick={dismissWeekSummary}
                                className="text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/15"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(420px,1fr)] gap-5 items-start">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="md:col-span-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm flex flex-wrap items-center gap-4">
                                    <span className="text-muted-foreground">
                                        Weekly Weather: <span className="text-foreground font-medium">{weeklyWeather.condition}</span>
                                    </span>
                                    <span className="text-muted-foreground">Wind {weeklyWeather.windMph} mph</span>
                                    <span className="text-muted-foreground">Rain Risk {weeklyWeather.precipitationChance}%</span>
                                    <span className="text-muted-foreground">Operators {Math.max(0, operatorCapacity - operatorAssignmentsUsed)}/{operatorCapacity} free</span>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs transition-all duration-300",
                                        inventoryPulse.fertilizer
                                            ? "bg-primary/35 text-emerald-50 ring-2 ring-primary/60 animate-pulse"
                                            : "bg-primary/15 text-primary"
                                    )}>
                                        Fertilizer: {inventoryMetrics.fertilizerUnits}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs transition-all duration-300",
                                        inventoryPulse.chemical
                                            ? "bg-sky-400/35 text-sky-50 ring-2 ring-sky-300/60 animate-pulse"
                                            : "bg-sky-500/15 text-sky-200"
                                    )}>
                                        Chemical: {inventoryMetrics.chemicalUnits}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs transition-all duration-300",
                                        inventoryPulse.seed
                                            ? "bg-amber-400/35 text-amber-50 ring-2 ring-amber-300/60 animate-pulse"
                                            : "bg-amber-500/15 text-amber-200"
                                    )}>
                                        Seed: {inventoryMetrics.seedUnits}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs transition-all duration-300",
                                        inventoryPulse.fuel
                                            ? "bg-zinc-300/35 text-zinc-50 ring-2 ring-zinc-200/60 animate-pulse"
                                            : "bg-zinc-500/20 text-zinc-200"
                                    )}>
                                        Fuel: {inventoryMetrics.fuelUnits}
                                    </span>
                                </div>
                                {dailyExecutionPlan.length > 0 && (
                                    <div className="md:col-span-4 rounded-xl border border-white/10 bg-black/20 p-3">
                                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Daily execution windows generated before actions
                                                </div>
                                                <div className="mt-0.5 text-xs text-muted-foreground">
                                                    Priorities are assigned to the earliest usable weather window from today onward.
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                                                <span className="rounded bg-green-500/15 px-2 py-0.5 text-green-200">Fieldwork</span>
                                                <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-200">Spray</span>
                                                <span className="rounded bg-amber-500/15 px-2 py-0.5 text-amber-200">Harvest</span>
                                                <span className="rounded bg-white/10 px-2 py-0.5 text-zinc-100">Desk</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
                                            {dailyExecutionPlan.map((day) => {
                                                const visibleBlocked = day.blocked.slice(0, 2);
                                                return (
                                                <div
                                                    key={day.day}
                                                    className={cn(
                                                        "rounded-lg border p-2 text-xs min-h-[150px]",
                                                        "border-white/10 bg-white/5"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="font-semibold text-foreground">{day.label}</div>
                                                    </div>
                                                    <div className="mt-0.5 text-muted-foreground">{day.precipitationChance}% rain • {day.windMph} mph</div>
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {day.fieldworkOpen && <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-200">field</span>}
                                                        {day.sprayOpen && <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] text-sky-200">spray</span>}
                                                        {day.harvestOpen && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-200">harvest</span>}
                                                        {!day.fieldworkOpen && !day.sprayOpen && !day.harvestOpen && (
                                                            <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] text-red-200">hold</span>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 space-y-1.5">
                                                        {day.planned.length > 0 ? (
                                                            day.planned.slice(0, 3).map((item) => (
                                                                <div key={item.id} className="rounded border border-white/10 bg-black/25 p-1.5">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={cn("rounded px-1 py-0.5 text-[9px] uppercase", plannerWindowClass(item.windowKind))}>
                                                                            {plannerWindowLabel(item.windowKind)}
                                                                        </span>
                                                                        <span className={cn(
                                                                            "h-1.5 w-1.5 rounded-full",
                                                                            item.priority === 'critical' ? 'bg-red-300' : item.priority === 'high' ? 'bg-orange-300' : 'bg-primary'
                                                                        )} />
                                                                    </div>
                                                                    <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-foreground">
                                                                        {item.title}
                                                                    </div>
                                                                    {item.fieldName && (
                                                                        <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{item.fieldName}</div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="rounded border border-dashed border-white/10 p-2 text-[11px] text-muted-foreground">
                                                                {visibleBlocked.length > 0
                                                                    ? 'No executable slot'
                                                                    : 'No planned action'}
                                                            </div>
                                                        )}
                                                        {day.planned.length > 3 && (
                                                            <div className="text-[10px] text-muted-foreground">+{day.planned.length - 3} more planned</div>
                                                        )}
                                                        {day.planned.length === 0 && visibleBlocked.map((item) => (
                                                            <div key={`${day.day}-${item.id}`} className="text-[10px] leading-snug text-red-200/80">
                                                                Blocked {plannerWindowLabel(item.windowKind).toLowerCase()}: {item.fieldName || item.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {recentInputPurchases.length > 0 && (
                                    <div className="md:col-span-4 rounded-xl border border-primary/30 bg-primary/10 p-3">
                                        <div className="text-xs font-semibold text-primary mb-2">Recent Planner Purchases</div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentInputPurchases.map((purchase) => (
                                                <span
                                                    key={purchase.id}
                                                    className="px-2 py-1 rounded bg-black/30 border border-primary/20 text-xs text-primary"
                                                >
                                                    Purchased: {purchase.itemName}
                                                    {purchase.fieldName ? ` • ${purchase.fieldName}` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {Object.entries(stageCounts).length === 0 && (
                                    <div className="md:col-span-4 rounded-xl border border-dashed border-white/15 p-4 text-sm text-muted-foreground">
                                        No active fields in strategy mode yet.
                                    </div>
                                )}
                            </div>

                            {/* ── Crop Vigor Notices (growing fields only) ── */}
                            {growthSignals.length > 0 && (
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                                        Crop Vigor & Growth Notices
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {growthSignals.map((signal) => (
                                            <div key={signal.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">{signal.name}</div>
                                                    <div className="text-[10px] text-muted-foreground border border-white/10 px-1.5 py-0.5 rounded">{signal.crop}</div>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    Stage: <span className="text-foreground">{formatStageLabel(signal.stage)}</span>
                                                    {signal.nextStage && <> → <span className="text-primary">{formatStageLabel(signal.nextStage)}</span></>}
                                                    {' '}• NDVI <span className={cn(
                                                        signal.ndvi >= 70 ? 'text-green-300' : signal.ndvi >= 45 ? 'text-yellow-300' : 'text-red-300'
                                                    )}>{signal.ndvi}</span>
                                                </div>
                                                <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div className="h-full bg-primary/80" style={{ width: `${signal.progressPct}%` }} />
                                                </div>
                                                <div className={cn(
                                                    "text-xs mt-1",
                                                    signal.vigor === 'Strong' ? 'text-green-300' : signal.vigor === 'Moderate' ? 'text-yellow-300' : 'text-red-300'
                                                )}>
                                                    Vigor: {signal.vigor}{signal.needsAttention ? ' • ⚠️ Attention required' : ' • Stable'}
                                                </div>
                                                {signal.weedPressure !== null && (
                                                    <div className="text-[11px] text-muted-foreground mt-1">
                                                        Weed pressure (multispectral): <span className="capitalize text-foreground">{signal.weedPressure}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Field Pipeline (pre-plant fields) ── */}
                            {fieldPipelineSignals.length > 0 && (
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-sm font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                            Active Field Preparation Pipeline
                                        </div>
                                        <span className="rounded bg-white/10 px-2 py-1 text-[11px] text-muted-foreground">
                                            {fieldPipelineSignals.length} active field{fieldPipelineSignals.length === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {fieldPipelineSignals.map((signal) => (
                                            <div key={signal.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">{signal.name}</div>
                                                    <div className="text-[10px] text-muted-foreground border border-white/10 px-1.5 py-0.5 rounded">{signal.crop}</div>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    <span className="text-[11px] text-muted-foreground mr-1 uppercase tracking-wider">Current</span>
                                                    <span className="text-foreground">{formatStageLabel(signal.stage)}</span>
                                                    {signal.nextStage && <> <span className="text-[11px] text-muted-foreground ml-2 mr-1 uppercase tracking-wider">Next</span> <span className="text-primary">{formatStageLabel(signal.nextStage)}</span></>}
                                                    {!signal.nextStage && <span className="text-muted-foreground ml-2">(Season complete)</span>}
                                                </div>
                                                <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div className="h-full bg-primary/70" style={{ width: `${signal.progressPct}%` }} />
                                                </div>
                                                {signal.needsAttention && (
                                                    <div className="text-xs text-yellow-300 mt-1">⚠️ Input attention required</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {cornFocusMode && (
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-primary">Corn Expert Detail Panel</div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Load the full corn roadmap, growth image, products, scouting table, and cart only when you need the detailed view.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowCornExpertDetails((value) => !value)}
                                            className={strategyActionClass('neutral', 'px-3 py-2 text-xs')}
                                        >
                                            {showCornExpertDetails ? 'Hide Details' : 'Show Details'}
                                        </button>
                                    </div>
                                    {showCornExpertDetails && (
                                        <div className="mt-4">
                                            <CornGrowthTimeline />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="sticky top-[82px] max-h-[calc(90vh-160px)] flex flex-col">
                            <div className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-0">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-400" />
                                    <h3 className="font-semibold">This Week&apos;s Priorities</h3>
                                </div>

                                {openChallenges.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-50">All priorities complete</h3>
                                            <p className="text-sm text-primary/70 mt-1">Ready for the next weather-generated week.</p>
                                            {pendingOrders.length > 0 && (
                                                <p className="text-xs font-semibold text-primary mt-2 bg-primary/20 px-2 py-1 rounded inline-block">
                                                    Executing {pendingOrders.length} standby order{pendingOrders.length > 1 ? 's' : ''} during night window
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    openChallenges.map((challenge) => {
                                        const field = challenge.fieldId ? gameFields.find((f) => f.id === challenge.fieldId) : null;
                                        const runbookTemplateId = getRunbookTemplateForOperation(challenge.operationId);
                                        const categoryMeta = getChallengeCategoryMeta(challenge.category);
                                        const CategoryIcon = categoryMeta?.Icon;
                                        const isSeasonalChallenge = !!challenge.challengeTemplateId;
                                        const isExpanded = expandedChallengeId === challenge.id;
                                        const escalationCountdown = getEscalationCountdown(challenge, currentChallengeWeek);
                                        return (
                                            <div key={challenge.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                                <div className="flex flex-wrap items-start gap-3">
                                                    <div className={cn('px-2 py-1 rounded border text-xs uppercase', priorityClass(challenge.priority))}>
                                                        {challenge.priority}
                                                    </div>
                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <div className={`font-semibold transition-all duration-300 ${pulsingChallengeIds.has(challenge.id) ? 'animate-pulse ring-2 ring-primary/60 rounded px-1 -mx-1' : ''}`}>{challenge.title}</div>
                                                            {categoryMeta && CategoryIcon && (
                                                                <span className={cn('inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase', categoryMeta.className)}>
                                                                    <CategoryIcon className="h-3 w-3" />
                                                                    {categoryMeta.label}
                                                                </span>
                                                            )}
                                                            {challenge.severity && (
                                                                <span className={cn('rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase', severityClass(challenge.severity))}>
                                                                    {challenge.severity}
                                                                </span>
                                                            )}
                                                            {escalationCountdown && (
                                                                <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-200">
                                                                    <Clock3 className="h-3 w-3" />
                                                                    {escalationCountdown}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{challenge.description}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Reward: +{challenge.rewardXp} XP
                                                            {field && ` • Field: ${field.name}`}
                                                            {challenge.yieldImpactPct ? ` • Yield at risk: ${challenge.yieldImpactPct}%` : ''}
                                                        </div>
                                                        {challenge.yieldImpactPct ? (
                                                            <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                                                                Untreated risk may cost about {challenge.yieldImpactPct}% of yield on this field.
                                                            </div>
                                                        ) : null}
                                                        {isSeasonalChallenge && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setExpandedChallengeId(isExpanded ? null : challenge.id)}
                                                                className="mt-2 text-xs font-semibold text-primary hover:text-primary/80"
                                                            >
                                                                {isExpanded ? 'Hide mitigation' : 'Show mitigation'}
                                                            </button>
                                                        )}
                                                        {isSeasonalChallenge && isExpanded && (
                                                            <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-muted-foreground">
                                                                {challenge.symptoms && (
                                                                    <div>
                                                                        <span className="font-semibold text-foreground">Symptoms:</span> {challenge.symptoms}
                                                                    </div>
                                                                )}
                                                                {challenge.mitigationDescription && (
                                                                    <div className="mt-1">
                                                                        <span className="font-semibold text-foreground">Mitigation:</span> {challenge.mitigationDescription}
                                                                    </div>
                                                                )}
                                                                <div className="mt-1">
                                                                    <span className="font-semibold text-foreground">Estimated cost:</span> ${Math.round(challenge.mitigationCost || 0).toLocaleString()}
                                                                    {challenge.requiresInput?.type && challenge.requiresInput.type !== 'none'
                                                                        ? ` • Input: ${challenge.requiresInput.productHint || challenge.requiresInput.type}`
                                                                        : ' • Input: none'}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {field && (
                                                            <div className="mt-2">
                                                                <div className="text-[11px] text-muted-foreground">
                                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Current:</span>
                                                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-white/10 text-foreground capitalize font-medium">
                                                                        {formatStageLabel(getCurrentStageLabel(field))}
                                                                    </span>
                                                                    <span className="ml-3 mr-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Next:</span>
                                                                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary capitalize font-medium">
                                                                        {getNextStageLabel(field)
                                                                            ? formatStageLabel(getNextStageLabel(field) as string)
                                                                            : 'Season complete'}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-primary/80"
                                                                        style={{ width: `${getFieldProgressPct(field)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {runbookTemplateId && (
                                                            <button
                                                                onClick={() => {
                                                                    onClose();
                                                                    router.push(`/runbooks?template=${runbookTemplateId}`);
                                                                }}
                                                                data-guide-id="weekly-plan-open-runbook"
                                                                className={strategyActionClass('neutral')}
                                                            >
                                                                Open Runbook
                                                            </button>
                                                        )}
                                                        {challenge.operationId && ['buy-fertilizer', 'buy-chemical'].includes(challenge.operationId) && (
                                                            <button
                                                                onClick={() => handleExecuteAction(challenge, field)}
                                                                data-guide-id="weekly-plan-quick-buy"
                                                                className={strategyActionClass('warning')}
                                                                title="Quick buy required input"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                                Buy
                                                            </button>
                                                        )}
                                                        {challenge.operationId && challenge.operationId.startsWith('op-') && (
                                                            <button
                                                                onClick={() => handleExecuteAction(challenge, field)}
                                                                className={strategyActionClass('secondary')}
                                                                title="Quick hire machinery service"
                                                            >
                                                                <Tractor className="w-4 h-4" />
                                                                Hire
                                                            </button>
                                                        )}
                                                        {challenge.operationId && challenge.operationId.startsWith('serv-') && (
                                                            <button
                                                                onClick={() => handleExecuteAction(challenge, field)}
                                                                className={strategyActionClass('primary')}
                                                                title="Quick book service contractor"
                                                            >
                                                                <Wrench className="w-4 h-4" />
                                                                Book
                                                            </button>
                                                        )}
                                                        {challenge.operationId ? (
                                                            <button
                                                                onClick={() => handleExecuteAction(challenge, field)}
                                                                data-guide-id="weekly-plan-execute"
                                                                className={strategyActionClass('secondary')}
                                                            >
                                                                Execute
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => completeChallenge(challenge.id)}
                                                                className={strategyActionClass('neutral')}
                                                            >
                                                                Mark Done
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm">
                                <div className="flex items-center gap-2 font-semibold mb-1">
                                    <Sprout className="w-4 h-4 text-primary" />
                                    Weekly Loop
                                </div>
                                <div className="text-primary/80 flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> Plan</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Execute</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Review</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Adapt</span>
                                </div>

                            <div className="max-h-64 overflow-y-auto border border-white/5 rounded-lg">
                            <SeasonActivityLog fieldId={gameFields[0]?.id} />
                            </div>

                            </div>

                            </div>
                            <div className="sticky bottom-0 z-10 flex justify-end pt-3 pb-2 bg-zinc-950/95 border-t border-white/10 shrink-0">
                                {gameTime.season === 'Autumn' || gameTime.season === 'Winter' ? (() => {
                                    const allFieldsIdle = useFieldStore.getState().gameFields.every(f =>
                                        f.farmingStage === 'post_harvest' ||
                                        f.farmingStage === 'fallow' ||
                                        (!f.crop || f.crop === 'Unplanted') ||
                                        (f.farmingStage === 'plowed' && f.crop === 'Unplanted')
                                    );

                                    if (allFieldsIdle) {
                                        return (
                                            <button
                                                onClick={() => runAdvance('spring', 400, () => advanceTime(true))}
                                                disabled={isAdvancing}
                                                className={strategyActionClass('secondary', 'px-4 disabled:cursor-wait')}
                                            >
                                                {advancingAction === 'spring' ? 'Skipping dormant season...' : 'Fast-Forward to Spring'}
                                            </button>
                                        );
                                    }
                                    return null;
                                })() : null}

                                <button
                                    onClick={() => runAdvance('week', 250, () => advanceTime())}
                                    data-guide-id="weekly-plan-advance"
                                    disabled={isAdvancing}
                                    className={`px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-60 disabled:cursor-wait ml-3`}
                                    title="Advance one full week and process planned operations"
                                >
                                    {advancingAction === 'week'
                                        ? 'Advancing week...'
                                        : (isAutoFieldOpsEnabled || isAutoBookingEnabled || isAutoProcurementEnabled)
                                            ? 'Advance Week & Process'
                                            : 'Advance Week'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
