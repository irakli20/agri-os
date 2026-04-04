'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { Activity, Beaker, Camera, ChevronLeft, ChevronRight, Clock3, ExternalLink, Leaf, MapPin, Plane, RefreshCcw, ShoppingCart } from 'lucide-react';
import { CORN_BBCH_STAGES } from '@/lib/game-logic/field-simulation';
import { ScoutingStorage, buildPerformedAerialParams, buildPlannedAerialParams, type ScoutingRunRecord } from '@/lib/scouting-data';

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
    { id: 'decis', name: 'Decis', type: 'insecticide', brandColor: 'bg-blue-600/80', dosage: '0.08-0.13 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'Corn borer, Bollworm, Aphids' },
    { id: 'decis_expert', name: 'Decis Expert', type: 'insecticide', brandColor: 'bg-blue-800/80', dosage: '0.4-0.7 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'Premium broad-spectrum insecticide' },
    { id: 'varigo', name: 'Varigo', type: 'insecticide', brandColor: 'bg-blue-900/80', dosage: '0.15 L/ha', ranges: [{ start: '13', end: '89' }], targetPests: 'High-performance pest management' },
    { id: 'urea_46', name: 'Urea 46% N', type: 'fertilizer', brandColor: 'bg-primary/80', dosage: '150 kg/ha', ranges: [{ start: '00', end: '16' }], targetPests: 'Essential Nitrogen for growth' },
    { id: 'npk_20_20_20', name: 'NPK 20-20-20', type: 'fertilizer', brandColor: 'bg-teal-600/80', dosage: '250 kg/ha', ranges: [{ start: '00', end: '39' }], targetPests: 'Pre-plant or starter nutrients' },
];

interface CornReferenceStage {
    id: string;
    label: string;
    bbchRef: string;
    description: string;
    image: string;
}

const CORN_REFERENCE_STAGES: CornReferenceStage[] = [
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

// X-center positions (%) of each of the 15 CORN_REFERENCE_STAGES on the corn_growth_overview.png
// The image has a non-uniform grid: Vegetative clusters are ~4.5% apart, Reproductive are 8.0% apart.
const STAGE_IMAGE_ANCHOR_PCT = [
    4.0, 8.5, 13.0, 17.5, 22.0, 31.5, 36.0, 40.5, 48.5,
    56.0, 64.0, 72.0, 80.0, 88.0, 96.0
];

function mapBbchToReferenceStage(bbch: string): number {
    const value = Number.parseInt(bbch, 10);
    if (Number.isNaN(value)) return 0;

    if (value <= 11) return 0; // VE
    if (value <= 12) return 1; // V1
    if (value <= 13) return 2; // V2
    if (value <= 14) return 3; // V4
    if (value <= 16) return 4; // V6
    if (value <= 31) return 5; // V10
    if (value <= 33) return 6; // V12
    if (value <= 35) return 7; // V14
    if (value <= 53) return 8; // VT
    if (value <= 69) return 9; // R1
    if (value <= 74) return 10; // R2
    if (value <= 79) return 11; // R3
    if (value <= 83) return 12; // R4
    if (value <= 87) return 13; // R5
    return 14;                  // R6
}

export function CornGrowthTimeline() {
    const { gameFields, updateField } = useFieldStore();
    const { cornFocusMode, gameTime, weeklyWeather, buySupplies, isAutoScoutingEnabled, toggleAutoScouting } = useGameStore();
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

    const derivedLiveStageIndex = mapBbchToReferenceStage(mostAdvancedBbch);
    const liveStageIndex = derivedLiveStageIndex;
    const selectedStageIndex = manualStageIndex ?? liveStageIndex;
    const selectedStage = CORN_REFERENCE_STAGES[selectedStageIndex];
    const liveStage = CORN_REFERENCE_STAGES[liveStageIndex];
    const liveProgressPct = ((liveStageIndex + 1) / CORN_REFERENCE_STAGES.length) * 100;
    const selectedProgressPct = ((selectedStageIndex + 1) / CORN_REFERENCE_STAGES.length) * 100;
    const selectedImageAnchor = STAGE_IMAGE_ANCHOR_PCT[selectedStageIndex] ?? STAGE_IMAGE_ANCHOR_PCT[0];
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
        const mappedIndex = mapBbchToReferenceStage(bbch);
        return {
            id: field.id,
            name: field.name,
            bbch,
            mappedStage: CORN_REFERENCE_STAGES[mappedIndex],
        };
    });

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
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-in fade-in duration-500">
            <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex flex-wrap items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">
                        Corn Growth Strategy Planner
                        {cornFields.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-yellow-500/20 text-[10px] normal-case font-medium">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                    >
                        Reference
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                        className={cn(
                            "px-3 py-1.5 text-white rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5",
                            isAutoScoutingEnabled ? "bg-primary hover:bg-primary shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-primary/50" : "bg-secondary hover:bg-secondary"
                        )}
                        onClick={toggleAutoScouting}
                    >
                        <Plane className="w-3.5 h-3.5" />
                        {isAutoScoutingEnabled ? 'Auto-Scout Active' : 'Enable Auto Drone Scout'}
                    </button>
                    <button
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        onClick={() => setManualStageIndex(null)}
                    >
                        Sync to live stage
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {scoutingMessage && (
                    <div
                        className={cn(
                            'rounded-lg border p-3 text-xs',
                            scoutingMessage.type === 'success'
                                ? 'border-primary/40 bg-primary/10 text-primary'
                                : 'border-red-400/40 bg-red-500/10 text-red-100'
                        )}
                    >
                        {scoutingMessage.text}
                    </div>
                )}
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
                    {scoutingMessage && (
                        <div className={cn(
                            "mb-4 rounded-lg border p-3 text-sm animate-in fade-in slide-in-from-top-2",
                            scoutingMessage.type === 'success'
                                ? "bg-green-500/10 border-green-500/30 text-green-300"
                                : "bg-red-500/10 border-red-500/30 text-red-300"
                        )}>
                            {scoutingMessage.text}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Beaker className="w-5 h-5 text-blue-400" />
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recommended Products</h4>
                        </div>
                        <button
                            onClick={handleBuySeasonBundle}
                            className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
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
