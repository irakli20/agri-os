'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { AlertTriangle, Calendar, CheckCircle2, Clock3, ShoppingCart, Sprout, Target, X, Tractor, Wrench } from 'lucide-react';
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


interface WeeklyPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FARM_STAGE_FLOW: NonNullable<Field['farmingStage']>[] = [
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

// Stages where a crop is actively growing and crop metrics are meaningful
const CROP_ACTIVE_STAGES: NonNullable<Field['farmingStage']>[] = ['growing', 'harvest_ready'];
// Stages considered "in-progress" pre-plant pipeline
const PRE_PLANT_STAGES: NonNullable<Field['farmingStage']>[] = [
    'fallow', 'scouted', 'aerial_surveyed', 'soil_tested',
    'plowed', 'pre_plant_treated', 'tilled',
];

function formatStageLabel(stage: string): string {
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
    };
    return labels[stage] || stage.replace(/_/g, ' ');
}

function normalizeFarmingStage(stage: Field['farmingStage'] | undefined): NonNullable<Field['farmingStage']> {
    if (!stage) return 'fallow';
    if ((FARM_STAGE_FLOW as string[]).includes(stage)) {
        return stage as NonNullable<Field['farmingStage']>;
    }
    return 'fallow';
}

function getNextFarmingStage(stage: Field['farmingStage'] | undefined): NonNullable<Field['farmingStage']> | null {
    const current = normalizeFarmingStage(stage);
    const idx = FARM_STAGE_FLOW.indexOf(current);
    if (idx === -1 || idx >= FARM_STAGE_FLOW.length - 1) return null;
    return FARM_STAGE_FLOW[idx + 1];
}

function getCurrentStageLabel(field: Field): string {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage === 'growing') {
        const cropStages = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'] as const;
        return field.cropStage && cropStages.includes(field.cropStage as any) ? field.cropStage : 'seeded';
    }
    return stage;
}

function getNextStageLabel(field: Field): string | null {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage === 'growing') {
        const cropStages = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'] as const;
        const currentCropStage = field.cropStage && cropStages.includes(field.cropStage as any)
            ? field.cropStage as typeof cropStages[number]
            : 'seeded';
        const idx = cropStages.indexOf(currentCropStage);
        if (idx !== -1 && idx < cropStages.length - 1) {
            return cropStages[idx + 1];
        } else if (idx === cropStages.length - 1) {
            return null; // Next is harvest ready or handled by game loop
        }
    }
    return getNextFarmingStage(field.farmingStage);
}

function getFieldProgressPct(field: Field): number {
    const stage = normalizeFarmingStage(field.farmingStage);
    if (stage === 'growing') {
        const cropStages = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'] as const;
        const currentCropStage = field.cropStage && cropStages.includes(field.cropStage as any)
            ? field.cropStage as typeof cropStages[number]
            : 'seeded';
        const idx = cropStages.indexOf(currentCropStage);
        return Math.max(0, Math.min(100, ((idx + 1) / cropStages.length) * 100));
    }
    const idx = FARM_STAGE_FLOW.indexOf(stage);
    return Math.max(0, Math.min(100, ((idx + 1) / FARM_STAGE_FLOW.length) * 100));
}

function priorityClass(priority: WeeklyChallenge['priority']) {
    switch (priority) {
        case 'critical':
            return 'text-red-300 border-red-500/30 bg-red-500/10';
        case 'high':
            return 'text-orange-300 border-orange-500/30 bg-orange-500/10';
        default:
            return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
    }
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
        pendingOrders
    } = useGameStore();
    const { gameFields } = useFieldStore();
    const [isAdvancing, setIsAdvancing] = useState(false);
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
    const SUPPLY_ID_ALIAS: Record<string, string> = {
        'pest-gaucho': 'chem-gaucho',
        'pest-maister-power': 'chem-maister-power',
        'pest-adengo': 'chem-adengo',
        'pest-decis-expert': 'chem-decis-expert',
    };

    const openChallenges = weeklyChallenges.filter((ch) => ch.status === 'open');

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

    useEffect(() => {
        if (!isOpen) return;
        refreshWeeklyChallenges();
    }, [isOpen, refreshWeeklyChallenges]);

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

    const executeDirectFieldOperation = (
        fieldId: string,
        operationId: string,
        challengeId: string,
        challengeTitle: string
    ) => {
        const currentField = useFieldStore.getState().gameFields.find((field) => field.id === fieldId);
        if (!currentField) {
            setActionMessage({ type: 'error', text: 'Field not found for this priority. Plan refreshed.' });
            refreshWeeklyChallenges();
            return;
        }

        const logicalOp = getLogicalOperationForStage(currentField);
        let opToRun = operationId;
        let adjusted = false;

        const originalValidation = canPerformOperation(currentField, operationId);

        // Priority 1: User's explicitly clicked operation, if valid for stage
        if (originalValidation.allowed) {
            opToRun = operationId;
            adjusted = false;
        }
        // Priority 2: Fallback to the logical operation for the current stage if the clicked one is now invalid
        else if (logicalOp && logicalOp !== operationId && canPerformOperation(currentField, logicalOp).allowed) {
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
        } else if (opToRun === 'op-topdress-fertilizer' || opToRun === 'op-apply-fertilizer-incorporated') {
            if (!weeklyWeather.fieldworkOpen) {
                placePendingOrder({ operationId: opToRun, fieldId, name: currentField.name });
                completeChallenge(challengeId);
                refreshWeeklyChallenges();
                setActionMessage({ type: 'success', text: `Weather blocked fieldwork. Ground application queued.` });
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
            canPerformOperation(useFieldStore.getState().gameFields.find((field) => field.id === fieldId) || currentField, nextChallenge.operationId).allowed
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
        category: product.category === 'fertilizer' ? 'fertilizer' : 'chemical',
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
                (title.includes('decis') && chemicals.find((p) => p.id === 'pest-decis-expert'));

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
        const totalCost = Math.round(service.pricePerHectare * acres);

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
                setActionMessage({ type: 'success', text: `Service booked on standby queue! Execution will occur during next calm window.` });
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

                // For growing crops, 'nextStage' should reflect biological progression, not just 'growing -> harvest_ready'
                let nextStageLabel = getNextFarmingStage(stage);
                let progressPct = 0;

                if (stage === 'growing') {
                    // Use cropStage if available
                    const cropStages = ['seeded', 'germination', 'vegetative', 'flowering', 'ripening', 'harvest_ready'] as const;
                    const currentCropStage = field.cropStage && cropStages.includes(field.cropStage as any)
                        ? field.cropStage as typeof cropStages[number]
                        : 'seeded';

                    const idx = cropStages.indexOf(currentCropStage);

                    if (idx !== -1 && idx < cropStages.length - 1) {
                        nextStageLabel = cropStages[idx + 1] as any;
                    } else if (idx === cropStages.length - 1) {
                        nextStageLabel = null; // already at harvest_ready
                    }
                    progressPct = Math.max(0, Math.min(100, ((idx + 1) / cropStages.length) * 100));
                } else {
                    const stageIndex = FARM_STAGE_FLOW.indexOf(stage);
                    progressPct = Math.max(0, Math.min(100, ((stageIndex + 1) / FARM_STAGE_FLOW.length) * 100));
                }

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-[96vw] max-h-[90vh] overflow-y-auto bg-zinc-950/95">
                <div className="sticky top-0 z-10 bg-zinc-950/95 border-b border-white/10 px-5 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
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
                        <div className={cn(
                            "rounded-lg border p-3 text-sm",
                            actionMessage.type === 'success'
                                ? "bg-green-500/10 border-green-500/30 text-green-300"
                                : "bg-red-500/10 border-red-500/30 text-red-300"
                        )}>
                            {actionMessage.text}
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
                                {Object.entries(stageCounts).map(([stage, count]) => (
                                    <div key={stage} className="rounded-xl bg-white/5 border border-white/10 p-3">
                                        <div className="text-xs text-muted-foreground uppercase">{stage.replace('_', ' ')}</div>
                                        <div className="text-xl font-bold mt-1">{count}</div>
                                    </div>
                                ))}
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
                                    <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                                        Field Preparation Pipeline
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
                                                    {signal.nextStage && <> <span className="text-[11px] text-muted-foreground ml-2 mr-1 uppercase tracking-wider">Next</span> <span className="text-blue-300">{formatStageLabel(signal.nextStage)}</span></>}
                                                    {!signal.nextStage && <span className="text-muted-foreground ml-2">(Season complete)</span>}
                                                </div>
                                                <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div className="h-full bg-blue-400/70" style={{ width: `${signal.progressPct}%` }} />
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
                                <CornGrowthTimeline />
                            )}
                        </div>

                        <div className="space-y-4 xl:sticky xl:top-[82px] max-h-[calc(90vh-160px)] overflow-y-auto pr-1">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-400" />
                                    <h3 className="font-semibold">This Week&apos;s Priorities</h3>
                                </div>

                                {openChallenges.length === 0 ? (
                                    <div
                                        className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col items-center justify-center gap-4 text-center"
                                        ref={(el) => {
                                            if (el && !isAdvancing) {
                                                setIsAdvancing(true);
                                                setTimeout(() => {
                                                    advanceTime();
                                                    setIsAdvancing(false);
                                                }, 1200);
                                            }
                                        }}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-50">All priorities complete</h3>
                                            <p className="text-sm text-primary/70 mt-1">Starting next week...</p>
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
                                        return (
                                            <div key={challenge.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                                <div className="flex flex-wrap items-start gap-3">
                                                    <div className={cn('px-2 py-1 rounded border text-xs uppercase', priorityClass(challenge.priority))}>
                                                        {challenge.priority}
                                                    </div>
                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="font-semibold">{challenge.title}</div>
                                                        <div className="text-sm text-muted-foreground">{challenge.description}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Reward: +{challenge.rewardXp} XP
                                                            {field && ` • Field: ${field.name}`}
                                                        </div>
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
                                                                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                                                            >
                                                                Open Runbook
                                                            </button>
                                                        )}
                                                        {challenge.operationId && ['buy-fertilizer', 'buy-chemical'].includes(challenge.operationId) && (
                                                            <button
                                                                onClick={() => {
                                                                    setActionMessage(null);
                                                                    refreshWeeklyChallenges();
                                                                    const liveChallenge = resolveLiveChallenge(challenge) || challenge;
                                                                    const liveField = liveChallenge.fieldId
                                                                        ? useFieldStore.getState().gameFields.find((f) => f.id === liveChallenge.fieldId) || field
                                                                        : field;
                                                                    quickBuyPlannerInput(liveChallenge, liveField || null);
                                                                }}
                                                                data-guide-id="weekly-plan-quick-buy"
                                                                className="px-3 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-black text-sm font-semibold transition-colors inline-flex items-center gap-2"
                                                                title="Quick buy required input"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                                Buy
                                                            </button>
                                                        )}
                                                        {challenge.operationId && challenge.operationId.startsWith('op-') && (
                                                            <button
                                                                onClick={() => {
                                                                    console.log('[Hire Button Clicked] Challenge:', challenge.title);
                                                                    setActionMessage(null);
                                                                    refreshWeeklyChallenges();
                                                                    const liveChallenge = resolveLiveChallenge(challenge) || challenge;
                                                                    const liveField = liveChallenge.fieldId
                                                                        ? useFieldStore.getState().gameFields.find((f) => f.id === liveChallenge.fieldId) || field
                                                                        : field;
                                                                    quickHireService(liveChallenge, liveField || null);
                                                                }}
                                                                className="px-3 py-2 rounded-lg bg-blue-500/90 hover:bg-blue-500 text-white text-sm font-semibold transition-colors inline-flex items-center gap-2"
                                                                title="Quick hire machinery service"
                                                            >
                                                                <Tractor className="w-4 h-4" />
                                                                Hire
                                                            </button>
                                                        )}
                                                        {challenge.operationId && challenge.operationId.startsWith('serv-') && (
                                                            <button
                                                                onClick={() => {
                                                                    setActionMessage(null);
                                                                    refreshWeeklyChallenges();
                                                                    const liveChallenge = resolveLiveChallenge(challenge) || challenge;
                                                                    const liveField = liveChallenge.fieldId
                                                                        ? useFieldStore.getState().gameFields.find((f) => f.id === liveChallenge.fieldId) || field
                                                                        : field;
                                                                    quickHireService(liveChallenge, liveField || null);
                                                                }}
                                                                className="px-3 py-2 rounded-lg bg-indigo-500/90 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors inline-flex items-center gap-2"
                                                                title="Quick book service contractor"
                                                            >
                                                                <Wrench className="w-4 h-4" />
                                                                Book
                                                            </button>
                                                        )}
                                                        {challenge.operationId ? (
                                                            <button
                                                                onClick={() => {
                                                                    setActionMessage(null);
                                                                    refreshWeeklyChallenges();
                                                                    const liveChallenge = resolveLiveChallenge(challenge) || challenge;
                                                                    const operationId = liveChallenge.operationId || challenge.operationId;
                                                                    const fieldId = liveChallenge.fieldId || challenge.fieldId;
                                                                    const challengeId = liveChallenge.id || challenge.id;
                                                                    const challengeTitle = liveChallenge.title || challenge.title;

                                                                    if (!operationId) return;

                                                                    if (fieldId && isDirectFieldOperation(operationId)) {
                                                                        executeDirectFieldOperation(fieldId, operationId, challengeId, challengeTitle);
                                                                        return;
                                                                    }

                                                                    if (operationId === 'buy-seeds') {
                                                                        setActionMessage({
                                                                            type: 'success',
                                                                            text: 'Opening Supplies Marketplace to purchase seeds...'
                                                                        });
                                                                        onClose();
                                                                        router.push('/game/marketplace/supplies');
                                                                        return;
                                                                    }

                                                                    if (operationId === 'buy-fuel') {
                                                                        setActionMessage({
                                                                            type: 'success',
                                                                            text: 'Opening Supplies Marketplace to refill fuel...'
                                                                        });
                                                                        onClose();
                                                                        router.push('/game/marketplace/supplies');
                                                                        return;
                                                                    }

                                                                    if (operationId === 'buy-fertilizer') {
                                                                        setActionMessage({
                                                                            type: 'success',
                                                                            text: 'Opening Supplies Marketplace to purchase fertilizer...'
                                                                        });
                                                                        onClose();
                                                                        router.push('/game/marketplace/supplies');
                                                                        return;
                                                                    }

                                                                    if (operationId === 'buy-chemical') {
                                                                        setActionMessage({
                                                                            type: 'success',
                                                                            text: 'Opening Supplies Marketplace to purchase crop protection chemical...'
                                                                        });
                                                                        onClose();
                                                                        router.push('/game/marketplace/supplies');
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
                                                                        setActionMessage({ type: 'success', text: 'Reviewed weekly constraints. Re-check priorities after weather window shifts.' });
                                                                        return;
                                                                    }

                                                                    if (operationId.startsWith('serv-')) {
                                                                        if (!fieldId) {
                                                                            setActionMessage({ type: 'error', text: 'This service task requires a target field.' });
                                                                            return;
                                                                        }
                                                                        setActionMessage({
                                                                            type: 'success',
                                                                            text: 'Opening Services Marketplace for provider booking...'
                                                                        });
                                                                        onClose();
                                                                        router.push(`/game/marketplace/services?fieldId=${fieldId}`);
                                                                        return;
                                                                    }

                                                                    if (!fieldId) {
                                                                        setActionMessage({ type: 'error', text: 'No field is attached to this operation.' });
                                                                        return;
                                                                    }
                                                                }}
                                                                data-guide-id="weekly-plan-execute"
                                                                className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                                                            >
                                                                Execute
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => completeChallenge(challenge.id)}
                                                                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
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

                            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm">
                                <div className="flex items-center gap-2 font-semibold mb-1">
                                    <Sprout className="w-4 h-4 text-blue-300" />
                                    Weekly Loop
                                </div>
                                <div className="text-blue-100/80 flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> Plan</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Execute</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Review</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Adapt</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => {
                                        setIsAdvancing(true);
                                        setTimeout(() => {
                                            advanceTime();
                                            setIsAdvancing(false);
                                            onClose();
                                        }, 400);
                                    }}
                                    data-guide-id="weekly-plan-advance"
                                    disabled={isAdvancing}
                                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-60 disabled:cursor-wait"
                                >
                                    {isAdvancing ? 'Advancing...' : 'Advance to Next Week'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
