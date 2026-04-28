'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { Activity, Beaker, Calendar, Camera, ChevronLeft, ChevronRight, Clock3, ExternalLink, Leaf, MapPin, Plane, ShoppingCart, Droplets, Zap, ClipboardCheck, Tractor, Sprout, ShieldCheck, Wheat, Warehouse } from 'lucide-react';
import { CORN_BBCH_STAGES } from '@/lib/game-logic/field-simulation';
import { ScoutingStorage, buildPlannedAerialParams, type ScoutingRunRecord } from '@/lib/scouting-data';
import { CORN_REFERENCE_STAGES, CORN_STAGE_IMAGE_ANCHOR_PCT, mapBbchToCornReferenceStage } from '@/lib/corn-strategy';
import { StrategyActionButton, strategyActionClass, strategyNoticeClass } from '@/components/game/strategy-ui';

interface Product {
    id: string;
    name: string;
    type: 'insecticide' | 'herbicide' | 'seed-treatment' | 'general' | 'fertilizer';
    brandColor: string;
    dosage: string;
    ranges: { start: string; end: string }[];
    targetPests: string;
}

const PRODUCTS: Product[] = [
    { id: 'gaucho', name: 'Gaucho', type: 'seed-treatment', brandColor: 'bg-red-700/80', dosage: '5-7 L/t', ranges: [{ start: '00', end: '00' }], targetPests: 'Wireworms, Soil-borne pests' },
    { id: 'roundup', name: 'Roundup Max', type: 'herbicide', brandColor: 'bg-orange-400/80', dosage: '1.5-6.0 L/ha', ranges: [{ start: '00', end: '05' }], targetPests: 'Pre-emergence total weed control' },
    { id: 'maister_bio', name: 'Maister + Biopower', type: 'herbicide', brandColor: 'bg-orange-600/80', dosage: '0.15 kg/ha + 1.25 L/ha', ranges: [{ start: '12', end: '16' }], targetPests: 'Annual and perennial dicot weeds' },
    { id: 'maister_power', name: 'Maister Power', type: 'herbicide', brandColor: 'bg-orange-500/80', dosage: '1.25-1.5 L/ha', ranges: [{ start: '12', end: '16' }], targetPests: 'Broad-spectrum weed control' },
    { id: 'adengo', name: 'Adengo', type: 'herbicide', brandColor: 'bg-orange-300/80', dosage: '0.1 L/ha', ranges: [{ start: '11', end: '15' }], targetPests: 'Early post-emergence specialized control' },
    { id: 'decis', name: 'Decis', type: 'insecticide', brandColor: 'bg-emerald-600/80', dosage: '0.08-0.13 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'Corn borer, Bollworm, Aphids' },
    { id: 'decis_expert', name: 'Decis Expert', type: 'insecticide', brandColor: 'bg-emerald-800/80', dosage: '0.4-0.7 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'Premium broad-spectrum insecticide' },
    { id: 'varigo', name: 'Varigo', type: 'insecticide', brandColor: 'bg-teal-800/80', dosage: '0.15 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'High-performance pest management' },
    { id: 'urea_46', name: 'Urea 46% N', type: 'fertilizer', brandColor: 'bg-primary/80', dosage: '150 kg/ha', ranges: [{ start: '00', end: '16' }], targetPests: 'Essential Nitrogen for growth' },
    { id: 'npk_20_20_20', name: 'NPK 20-20-20', type: 'fertilizer', brandColor: 'bg-teal-600/80', dosage: '250 kg/ha', ranges: [{ start: '00', end: '39' }], targetPests: 'Pre-plant or starter nutrients' },
];

interface CornSeasonPhase {
    id: string;
    label: string;
    window: string;
    intent: string;
    stageIds: string[];
    bbchStart?: number;
    bbchEnd?: number;
    Icon: React.ComponentType<{ className?: string }>;
}

const CORN_SEASON_PHASES: CornSeasonPhase[] = [
    {
        id: 'recon',
        label: 'Recon & Baseline',
        window: 'Pre-plant',
        intent: 'Aerial survey, soil sampling, field zones, and starting constraints.',
        stageIds: ['fallow', 'scouted', 'aerial_surveyed', 'soil_tested'],
        Icon: Plane,
    },
    {
        id: 'seedbed',
        label: 'Seedbed Build',
        window: 'Spring W1-W4',
        intent: 'Plow, burndown, till, stock inputs, and prepare the planter pass.',
        stageIds: ['plowed', 'pre_plant_treated', 'tilled'],
        Icon: Tractor,
    },
    {
        id: 'planting',
        label: 'Planting',
        window: 'Spring window',
        intent: 'Seed treatment, planting, starter fertility, and stand establishment.',
        stageIds: ['growing'],
        bbchStart: 0,
        bbchEnd: 5,
        Icon: Sprout,
    },
    {
        id: 'vegetative',
        label: 'Vegetative Build',
        window: 'VE-V14',
        intent: 'Scout stand count, protect yield potential, top-dress nitrogen, and manage water.',
        stageIds: ['growing'],
        bbchStart: 11,
        bbchEnd: 35,
        Icon: Leaf,
    },
    {
        id: 'reproductive',
        label: 'Pollination Risk',
        window: 'VT-R3',
        intent: 'Watch heat, water stress, silk timing, disease pressure, and insect risk.',
        stageIds: ['growing'],
        bbchStart: 53,
        bbchEnd: 79,
        Icon: ShieldCheck,
    },
    {
        id: 'finish',
        label: 'Drydown & Harvest',
        window: 'R4-R6',
        intent: 'Track grain fill, moisture, standability, harvest window, and combine booking.',
        stageIds: ['growing', 'harvest_ready', 'harvested'],
        bbchStart: 83,
        bbchEnd: 89,
        Icon: Wheat,
    },
    {
        id: 'storage',
        label: 'Storage & Closeout',
        window: 'Post-harvest',
        intent: 'Residue, drying/storage, shrink/loss, quality, and season attribution.',
        stageIds: ['post_harvest'],
        Icon: Warehouse,
    },
];

function getPhaseForField(field: { farmingStage?: string; bbchStage?: string }) {
    const stage = field.farmingStage || 'fallow';
    const bbch = Number.parseInt(field.bbchStage || '00', 10);

    if (stage === 'harvested') {
        return CORN_SEASON_PHASES.findIndex((phase) => phase.id === 'finish');
    }
    if (stage === 'post_harvest') {
        return CORN_SEASON_PHASES.findIndex((phase) => phase.id === 'storage');
    }
    if (stage !== 'growing' && stage !== 'harvest_ready') {
        const stageMatch = CORN_SEASON_PHASES.findIndex((phase) => phase.stageIds.includes(stage));
        return stageMatch === -1 ? 0 : stageMatch;
    }

    const bbchMatch = CORN_SEASON_PHASES.findIndex((phase) => {
        if (phase.bbchStart === undefined || phase.bbchEnd === undefined || Number.isNaN(bbch)) return false;
        return bbch >= phase.bbchStart && bbch <= phase.bbchEnd;
    });
    if (bbchMatch !== -1) return bbchMatch;

    return stage === 'harvest_ready'
        ? CORN_SEASON_PHASES.findIndex((phase) => phase.id === 'finish')
        : CORN_SEASON_PHASES.findIndex((phase) => phase.id === 'planting');
}

export function CornGrowthTimeline() {
    const { gameFields, updateField } = useFieldStore();
    const {
        cornFocusMode, gameTime, weeklyWeather, buySupplies,
        isAutoScoutingEnabled, toggleAutoScouting,
        isAutoIrrigationEnabled, toggleAutoIrrigation,
        isAutoProcurementEnabled, toggleAutoProcurement,
        isAutoFieldOpsEnabled, toggleAutoFieldOps,
        isAutoBookingEnabled, toggleAutoBooking
    } = useGameStore();
    const [manualStageIndex, setManualStageIndex] = useState<number | null>(null);
    const [latestScoutingRecord, setLatestScoutingRecord] = useState<ScoutingRunRecord | null>(null);
    const [scoutingMessage, setScoutingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [cart, setCart] = useState<{ id: string; name: string; category: 'chemical' | 'fertilizer'; unit: string; price: number; quantity: number }[]>([]);

    const cornFields = gameFields.filter((f) => {
        if (f.crop?.toLowerCase().includes('corn')) return true;

        // In Corn Focus Mode (if active), we assume unplanted/fallow fields are intended for corn
        // and should be trackable via aerial scouting for planning purposes.
        if (cornFocusMode && (!f.crop || f.crop === 'None' || f.crop === 'Unplanted')) {
            return f.isCornSuitable !== false;
        }

        return false;
    });
    const currentBbchStages = cornFields.map((f) => f.bbchStage || '00');
    const mostAdvancedBbch = [...currentBbchStages].length > 0
        ? [...currentBbchStages].sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))[0]
        : '00';

    const derivedLiveStageIndex = mapBbchToCornReferenceStage(mostAdvancedBbch);
    const liveStageIndex = derivedLiveStageIndex;
    const selectedStageIndex = manualStageIndex ?? liveStageIndex;
    const selectedStage = CORN_REFERENCE_STAGES[selectedStageIndex];
    const liveStage = CORN_REFERENCE_STAGES[liveStageIndex];
    const liveProgressPct = ((liveStageIndex + 1) / CORN_REFERENCE_STAGES.length) * 100;
    const selectedProgressPct = ((selectedStageIndex + 1) / CORN_REFERENCE_STAGES.length) * 100;
    const selectedImageAnchor = CORN_STAGE_IMAGE_ANCHOR_PCT[selectedStageIndex] ?? CORN_STAGE_IMAGE_ANCHOR_PCT[0];
    const cornFieldIdSignature = cornFields.map((field) => field.id).sort().join('|');
    const totalCornAcres = useMemo(
        () => cornFields.reduce((sum, field) => sum + Math.max(0, field.acres || 0), 0),
        [cornFields]
    );
    const defaultPlannedParams = useMemo(
        () => buildPlannedAerialParams({
            acres: totalCornAcres || 30,
            stageIndex: liveStageIndex,
            routePattern: 'grid',
            captureProfile: 'corn',
        }),
        [liveStageIndex, totalCornAcres]
    );
    const cornFieldStageRows = cornFields.map((field) => {
        const bbch = field.bbchStage || '00';
        const mappedIndex = mapBbchToCornReferenceStage(bbch);
        return {
            id: field.id,
            name: field.name,
            bbch,
            mappedStage: CORN_REFERENCE_STAGES[mappedIndex],
        };
    });
    const liveSeasonPhaseIndex = cornFields.length > 0
        ? Math.max(...cornFields.map(getPhaseForField))
        : 0;
    const liveSeasonPhase = CORN_SEASON_PHASES[liveSeasonPhaseIndex] || CORN_SEASON_PHASES[0];
    const phaseFieldCounts = CORN_SEASON_PHASES.map((_, idx) =>
        cornFields.filter((field) => getPhaseForField(field) === idx).length
    );
    const stageDistributionLabel = phaseFieldCounts
        .map((count, idx) => count > 0 ? `${count} ${CORN_SEASON_PHASES[idx].label}` : null)
        .filter(Boolean)
        .join(' / ');

    const getBbchIndex = (id: string) => CORN_BBCH_STAGES.findIndex((s) => s.id === id);

    const hoverIdx = getBbchIndex(selectedStage.bbchRef);
    const inWindowProducts = PRODUCTS.map((product) => {
        const isInRange = product.ranges.some((range) => {
            const startIdx = getBbchIndex(range.start);
            const endIdx = getBbchIndex(range.end);
            return hoverIdx >= startIdx && hoverIdx <= endIdx;
        });
        return { product, isInRange };
    });

    useEffect(() => {
        if (!cornFocusMode || !cornFieldIdSignature) {
            setLatestScoutingRecord(null);
            return;
        }
        const latest = ScoutingStorage.getLatestCompletedRunForFields(cornFieldIdSignature.split('|'));
        setLatestScoutingRecord(latest);
    }, [cornFieldIdSignature, cornFocusMode]);

    // Automatically sync back to the live stage if it advances in the background
    useEffect(() => {
        setManualStageIndex(null);
    }, [liveStageIndex]);

    const productMapping: Record<string, { inventoryId: string, price: number, name: string, category: 'chemical' | 'fertilizer', unit: string, baseRatePerHectare: number }> = {
        'gaucho': { inventoryId: 'chem-gaucho', price: 350, name: 'Gaucho 600 FS', category: 'chemical', unit: 'L', baseRatePerHectare: 1 },
        'roundup': { inventoryId: 'chem-roundup', price: 120, name: 'Roundup Max', category: 'chemical', unit: 'L', baseRatePerHectare: 4 },
        'maister_bio': { inventoryId: 'chem-maister-bio', price: 290, name: 'Maister + Biopower', category: 'chemical', unit: 'L', baseRatePerHectare: 1.5 },
        'maister_power': { inventoryId: 'chem-maister-power', price: 420, name: 'Maister Power', category: 'chemical', unit: 'L', baseRatePerHectare: 1.5 },
        'adengo': { inventoryId: 'chem-adengo', price: 395, name: 'Adengo 315 SC', category: 'chemical', unit: 'L', baseRatePerHectare: 0.1 },
        'decis': { inventoryId: 'chem-decis', price: 150, name: 'Decis', category: 'chemical', unit: 'L', baseRatePerHectare: 0.1 },
        'decis_expert': { inventoryId: 'chem-decis-expert', price: 280, name: 'Decis Expert', category: 'chemical', unit: 'L', baseRatePerHectare: 0.5 },
        'varigo': { inventoryId: 'chem-varigo', price: 320, name: 'Varigo', category: 'chemical', unit: 'L', baseRatePerHectare: 0.15 },
        'urea_46': { inventoryId: 'fert-urea-46', price: 85, name: 'Urea 46% N', category: 'fertilizer', unit: 'bags', baseRatePerHectare: 3 },
        'npk_20_20_20': { inventoryId: 'fert-npk-20', price: 110, name: 'NPK 20-20-20', category: 'fertilizer', unit: 'bags', baseRatePerHectare: 5 },
    };

    const handleAddToCart = (productId: string) => {
        const mapping = productMapping[productId];
        if (!mapping) return;

        const totalHectares = Math.max(1, (totalCornAcres || 10) / 2.471);
        const requiredQty = Math.max(1, Math.ceil(mapping.baseRatePerHectare * totalHectares));

        setCart((prev) => {
            const existing = prev.find(item => item.id === mapping.inventoryId);
            if (existing) {
                return prev.map(item => item.id === mapping.inventoryId ? { ...item, quantity: item.quantity + requiredQty } : item);
            }
            return [...prev, {
                id: mapping.inventoryId,
                name: mapping.name,
                category: mapping.category,
                price: mapping.price,
                unit: mapping.unit,
                quantity: requiredQty
            }];
        });
        setScoutingMessage({ type: 'success', text: `Added ${requiredQty} ${mapping.unit} of ${mapping.name} (for ${Math.round(totalHectares)} ha) to cart.` });
        setTimeout(() => setScoutingMessage(null), 3500);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        let successCount = 0;
        let failCount = 0;

        cart.forEach(item => {
            const result = buySupplies({
                id: item.id,
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                unit: item.unit
            }, item.price * item.quantity);
            if (result.success) successCount++;
            else failCount++;
        });

        if (failCount === 0) {
            setScoutingMessage({ type: 'success', text: `Successfully purchased ${successCount} items.` });
        } else {
            setScoutingMessage({ type: 'error', text: `Checkout complete: ${successCount} succeeded, ${failCount} failed (insufficient funds?).` });
        }
        setCart([]);
        setTimeout(() => setScoutingMessage(null), 4000);
    };

    const handleBuySeasonBundle = () => {
        const totalHectares = Math.max(1, (totalCornAcres || 10) / 2.471);
        const newCartItems: typeof cart = [];
        Object.keys(productMapping).forEach(productId => {
            const mapping = productMapping[productId];
            const requiredQty = Math.max(1, Math.ceil(mapping.baseRatePerHectare * totalHectares));
            newCartItems.push({
                id: mapping.inventoryId,
                name: mapping.name,
                category: mapping.category,
                price: mapping.price,
                unit: mapping.unit,
                quantity: requiredQty
            });
        });

        setCart((prev) => {
            let updated = [...prev];
            newCartItems.forEach(newItem => {
                const existing = updated.find(i => i.id === newItem.id);
                if (existing) {
                    updated = updated.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
                } else {
                    updated.push(newItem);
                }
            });
            return updated;
        });

        setScoutingMessage({ type: 'success', text: `Added entire season's recommended products to cart.` });
        setTimeout(() => setScoutingMessage(null), 3000);
    };

    if (!cornFocusMode) return null;

    const moveStage = (direction: -1 | 1) => {
        const next = Math.min(CORN_REFERENCE_STAGES.length - 1, Math.max(0, selectedStageIndex + direction));
        setManualStageIndex(next);
    };

    return (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden animate-in fade-in duration-500">
            <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex flex-wrap items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                        Corn Growth Strategy Planner
                        {cornFields.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-primary/20 text-[10px] normal-case font-medium">
                                {cornFields.length} active fields
                            </span>
                        )}
                    </h3>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 text-[11px]">
                    <a
                        href="https://learn.weatherstem.com/modules/learn/lessons/188/9.html"
                        target="_blank"
                        rel="noreferrer"
                        className={strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]')}
                    >
                        Reference
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                        className={cn(
                            strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]'),
                            isAutoScoutingEnabled && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-primary/50"
                        )}
                        onClick={toggleAutoScouting}
                    >
                        <Plane className="w-3.5 h-3.5" />
                        {isAutoScoutingEnabled ? 'Auto-Scout Active' : 'Enable Auto Drone Scout'}
                    </button>
                    <button
                        className={cn(
                            strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]'),
                            isAutoIrrigationEnabled && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-primary/50"
                        )}
                        onClick={toggleAutoIrrigation}
                    >
                        <Droplets className="w-3.5 h-3.5" />
                        {isAutoIrrigationEnabled ? 'Auto-Irrigation Active' : 'Enable Auto Irrigation'}
                    </button>
                    <button
                        className={cn(
                            strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]'),
                            isAutoProcurementEnabled && "bg-amber-500/90 hover:bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/50"
                        )}
                        onClick={toggleAutoProcurement}
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isAutoProcurementEnabled ? 'Auto-Procure Active' : 'Enable Auto-Procure'}
                    </button>
                    <button
                        className={cn(
                            strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]'),
                            isAutoBookingEnabled && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-primary/50"
                        )}
                        onClick={toggleAutoBooking}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        {isAutoBookingEnabled ? 'Auto-Booking Active' : 'Enable Auto-Booking'}
                    </button>
                    <button
                        className={cn(
                            strategyActionClass('neutral', 'px-3 py-1.5 text-[11px]'),
                            isAutoFieldOpsEnabled && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-primary/50"
                        )}
                        onClick={toggleAutoFieldOps}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        {isAutoFieldOpsEnabled ? 'Auto-Ops & Fieldwork Active' : 'Enable Auto-Ops & Fieldwork'}
                    </button>
                    <StrategyActionButton
                        variant="secondary"
                        className="px-3 py-1.5 text-[11px]"
                        onClick={() => setManualStageIndex(null)}
                    >
                        Sync to live stage
                    </StrategyActionButton>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {scoutingMessage && (
                    <div className={strategyNoticeClass(scoutingMessage.type, 'text-xs')}>
                        {scoutingMessage.text}
                    </div>
                )}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                                Season Autopilot Roadmap
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                    Current focus: {liveSeasonPhase.label}
                                </span>
                                <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                    {liveSeasonPhase.window}
                                </span>
                            </div>
                            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                                {liveSeasonPhase.intent}
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-muted-foreground">
                            <div className="font-semibold text-foreground">{cornFields.length} corn field{cornFields.length === 1 ? '' : 's'}</div>
                            <div>{stageDistributionLabel || 'No active corn fields yet'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-7">
                        {CORN_SEASON_PHASES.map((phase, idx) => {
                            const done = idx < liveSeasonPhaseIndex;
                            const active = idx === liveSeasonPhaseIndex;
                            const count = phaseFieldCounts[idx];
                            const PhaseIcon = phase.Icon;
                            return (
                                <div
                                    key={phase.id}
                                    className={cn(
                                        'rounded-lg border p-3 transition-all',
                                        active
                                            ? 'border-primary/60 bg-primary/15 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]'
                                            : done
                                                ? 'border-green-400/25 bg-green-500/10'
                                                : 'border-white/10 bg-black/20'
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-lg border',
                                            active
                                                ? 'border-primary/50 bg-primary/20 text-primary'
                                                : done
                                                    ? 'border-green-400/30 bg-green-500/15 text-green-300'
                                                    : 'border-white/10 bg-white/5 text-muted-foreground'
                                        )}>
                                            {done ? <ClipboardCheck className="h-4 w-4" /> : <PhaseIcon className="h-4 w-4" />}
                                        </div>
                                        {count > 0 && (
                                            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xs font-semibold text-white">{phase.label}</div>
                                    <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{phase.window}</div>
                                    <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{phase.intent}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="rounded-xl border border-green-400/20 bg-green-500/5 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-green-300 font-semibold uppercase tracking-wider">Live Corn Stage Progress</span>
                        <span className="text-green-200">
                            {liveStage.id} • {liveStage.label} ({liveStageIndex + 1}/{CORN_REFERENCE_STAGES.length})
                        </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-primary transition-all duration-500"
                            style={{ width: `${liveProgressPct}%` }}
                        />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                        Selected stage: {selectedStage.id} ({Math.round(selectedProgressPct)}% through reference timeline)
                        {mostAdvancedBbch === '00' || mostAdvancedBbch === '05' ? (
                            <span className="ml-2 text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded font-semibold">
                                Note: Crop is currently pre-emergence (underground). Waiting for VE.
                            </span>
                        ) : null}
                    </div>
                    {latestScoutingRecord ? (
                        <div className="mt-2 text-[11px] text-secondary/90">
                            {latestScoutingRecord.gameWeek
                                ? `Stage source: latest weekly scout (Y${latestScoutingRecord.gameYear} ${latestScoutingRecord.gameSeason} W${latestScoutingRecord.gameWeek})`
                                : 'Stage source: latest completed scouting run'}
                        </div>
                    ) : (
                        <div className="mt-2 text-[11px] text-muted-foreground">
                            Stage source: field BBCH state (run weekly drone scout to refresh with aerial observations)
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2 min-w-0 rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => moveStage(-1)}
                                disabled={selectedStageIndex === 0}
                                className="btn-modal-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="text-center">
                                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stage {selectedStageIndex + 1} of {CORN_REFERENCE_STAGES.length}</div>
                                <div className="text-lg font-bold text-white">{selectedStage.id} • {selectedStage.label}</div>
                            </div>
                            <button
                                onClick={() => moveStage(1)}
                                disabled={selectedStageIndex === CORN_REFERENCE_STAGES.length - 1}
                                className="btn-modal-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ── Weekly Grows Overview Strip ─────────────────────────────────── */}
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pt-2 pb-1">
                                Weekly Grows — Corn Development Overview
                            </div>
                            <div className="relative">
                                <Image
                                    src="/assets/corn-growth/weatherstem/corn_growth_overview.png"
                                    alt="Corn Growth and Development overview"
                                    width={1516}
                                    height={530}
                                    className="w-full h-auto"
                                    priority
                                />
                                {/* Red oval circle highlighting the current stage plant column */}
                                <div
                                    className="pointer-events-none absolute"
                                    style={{
                                        top: '8%',
                                        left: `${selectedImageAnchor}%`,
                                        transform: 'translateX(-50%)',
                                        width: '5.5%',
                                        height: '90.2%',
                                    }}
                                >
                                    <div
                                        className="w-full h-full rounded-md border-[3px] border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6),inset_0_0_12px_rgba(244,63,94,0.15)] transition-all duration-700 ease-out"
                                    />
                                </div>
                                {/* Stage label badge */}
                                <div
                                    className="pointer-events-none absolute bottom-1 transition-all duration-700 ease-out"
                                    style={{
                                        left: `${selectedImageAnchor}%`,
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <span className="px-1.5 py-0.5 rounded bg-rose-500/90 text-[9px] font-bold text-white tracking-wide whitespace-nowrap shadow-lg">
                                        {selectedStage.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stage mini-grid */}
                        <div className="mt-3 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-8 gap-2">
                            {CORN_REFERENCE_STAGES.map((stage, idx) => {
                                const active = idx === selectedStageIndex;
                                const isLive = idx === liveStageIndex;
                                return (
                                    <button
                                        key={stage.id}
                                        onClick={() => setManualStageIndex(idx)}
                                        className={cn(
                                            'rounded-lg border p-2 text-left transition-colors',
                                            active ? 'border-green-400 bg-green-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10',
                                            isLive && !active ? 'ring-2 ring-rose-400/60 bg-rose-500/10' : '',
                                            active ? 'shadow-[0_0_0_1px_rgba(74,222,128,0.35)] -translate-y-0.5' : ''
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={cn('text-xs font-bold', active ? 'text-green-300' : 'text-white')}>{stage.id}</div>
                                            {isLive && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-100 animate-pulse">LIVE</span>}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground truncate mt-0.5">{stage.label}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>  {/* end xl:col-span-2 */}
                </div>

                <div className="min-w-0 rounded-xl border border-white/10 bg-green-500/5 p-4 space-y-3">
                    <div>
                        <div className="text-2xl font-black text-green-400">{selectedStage.id}</div>
                        <div className="text-sm font-semibold text-white">{selectedStage.label}</div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedStage.description}</p>

                    <div className="pt-3 border-t border-white/10 text-xs">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground">Mapped BBCH</span>
                            <span className="font-semibold text-white">{selectedStage.bbchRef}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Live farm BBCH</span>
                            <span className="font-semibold text-green-300">{mostAdvancedBbch}</span>
                        </div>
                        {cornFieldStageRows.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Field Stage Snapshot</div>
                                {cornFieldStageRows.slice(0, 4).map((row) => (
                                    <div key={row.id} className="flex items-center justify-between gap-2">
                                        <span className="truncate text-muted-foreground">{row.name}</span>
                                        <span className="text-green-300 font-medium">
                                            {row.mappedStage.id} (BBCH {row.bbch})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Plane className="w-3 h-3" />
                                Weekly Drone Scouting Parameters
                            </div>
                            <div className="overflow-x-auto">
                                <div className="min-w-[360px] grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-[10px]">
                                    <div className="text-muted-foreground">Parameter</div>
                                    <div className="text-secondary font-semibold">Planned</div>
                                    <div className="text-primary font-semibold">Performed</div>

                                    <div className="text-muted-foreground">Drone height</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).droneHeightM} m</div>
                                    <div>{latestScoutingRecord?.performed ? `${latestScoutingRecord.performed.droneHeightM} m` : '-'}</div>

                                    <div className="text-muted-foreground">Flight speed</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).flightSpeedMps} m/s</div>
                                    <div>{latestScoutingRecord?.performed ? `${latestScoutingRecord.performed.flightSpeedMps} m/s` : '-'}</div>

                                    <div className="text-muted-foreground">FPS</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).fps}</div>
                                    <div>{latestScoutingRecord?.performed ? latestScoutingRecord.performed.fps : '-'}</div>

                                    <div className="text-muted-foreground">Mission flight passes</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).missionFlightPasses}</div>
                                    <div>{latestScoutingRecord?.performed ? latestScoutingRecord.performed.missionFlightPasses : '-'}</div>

                                    <div className="text-muted-foreground">Image overlap</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).frontImageOverlapPct}% / {(latestScoutingRecord?.planned || defaultPlannedParams).sideImageOverlapPct}%</div>
                                    <div>{latestScoutingRecord?.performed ? `${latestScoutingRecord.performed.frontImageOverlapPct}% / ${latestScoutingRecord.performed.sideImageOverlapPct}%` : '-'}</div>

                                    <div className="text-muted-foreground">Capture bands</div>
                                    <div>{(latestScoutingRecord?.planned || defaultPlannedParams).captureBands?.join(', ') || 'RGB'}</div>
                                    <div>{latestScoutingRecord?.performed?.captureBands?.join(', ') || '-'}</div>

                                    <div className="text-muted-foreground">Route pattern</div>
                                    <div className="capitalize">{(latestScoutingRecord?.planned || defaultPlannedParams).routePattern}</div>
                                    <div className="capitalize">{latestScoutingRecord?.performed ? latestScoutingRecord.performed.routePattern : '-'}</div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Activity className="w-3 h-3 text-primary" />
                                    GSD: {(latestScoutingRecord?.planned || defaultPlannedParams).groundSamplingDistanceCm} cm/px planned
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock3 className="w-3 h-3 text-secondary" />
                                    Duration: {(latestScoutingRecord?.planned || defaultPlannedParams).estimatedDurationMin} min planned
                                </div>
                                {latestScoutingRecord && (
                                    <>
                                        <div className="flex items-center gap-1 text-primary">
                                            <Camera className="w-3 h-3" />
                                            Last scout: {new Date(latestScoutingRecord.scannedAtIso).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-primary">
                                            <MapPin className="w-3 h-3" />
                                            Scouted area: {Math.max(1, Math.round(totalCornAcres))} acres
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Beaker className="w-5 h-5 text-primary" />
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recommended Products</h4>
                        </div>
                        <button
                            onClick={handleBuySeasonBundle}
                            className={strategyActionClass('warning', 'px-3 py-1.5 text-xs')}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add Full Season Bundle
                        </button>
                    </div>
                    <div className="space-y-2">
                        {inWindowProducts.map(({ product, isInRange }) => (
                            <div
                                key={product.id}
                                className={cn(
                                    'flex items-center gap-4 p-3 rounded-xl border transition-all',
                                    isInRange
                                        ? 'bg-white/5 border-white/10 opacity-100 translate-x-1'
                                        : 'opacity-30 border-transparent grayscale'
                                )}
                            >
                                <div className={cn('w-2 h-8 rounded-full', product.brandColor)}></div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">{product.name}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground">{product.dosage}</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground mt-0.5">{product.targetPests}</div>
                                </div>
                                {isInRange && (
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-white transition-colors"
                                        title={`Add ${product.name} to Cart`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shopping Cart Sidebar */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-5 flex flex-col min-h-[300px]">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <ShoppingCart className="w-5 h-5" />
                        <h4 className="font-bold uppercase tracking-widest text-sm text-foreground">Shopping Cart</h4>
                        <div className="ml-auto bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                            {cart.length}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[150px]">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                                <ShoppingCart className="w-8 h-8" />
                                <span className="text-xs">Your cart is empty.</span>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="text-xs border-b border-white/5 pb-2 last:border-0">
                                    <div className="flex justify-between font-semibold text-white/90">
                                        <span>{item.name}</span>
                                        <span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                                            x{item.quantity} {item.unit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mt-1 text-muted-foreground">
                                        <span>${item.price} each</span>
                                        <span className="font-bold text-white text-[13px]">${item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-muted-foreground uppercase tracking-widest">Total</span>
                            <span className="text-primary text-lg">
                                ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full bg-primary hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
                        >
                            Purchase Items
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CornGrowthTimeline;
