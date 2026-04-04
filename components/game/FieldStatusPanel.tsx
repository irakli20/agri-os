import React, { useState } from 'react';
import { Field } from '@/lib/mock-data';
import {
    Droplets, Sprout, Tractor, AlertCircle, ArrowRight,
    Loader2, Wrench, Radar, Leaf, CheckCircle2, Circle
} from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/lib/game-store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface FieldStatusPanelProps {
    field: Field;
}

// ── Corn Season Progress Stepper ──────────────────────────────────────────────
const CORN_STAGES = [
    { stage: 'fallow', label: 'Fallow' },
    { stage: 'aerial_surveyed', label: 'Surveyed' },
    { stage: 'soil_tested', label: 'Soil Test' },
    { stage: 'plowed', label: 'Plowed' },
    { stage: 'pre_plant_treated', label: 'Burndown' },
    { stage: 'tilled', label: 'Tilled' },
    { stage: 'growing', label: 'Growing' },
    { stage: 'harvest_ready', label: 'Ready' },
    { stage: 'harvested', label: 'Harvested' },
    { stage: 'post_harvest', label: 'Residue Mgmt' },
] as const;

type CornStage = typeof CORN_STAGES[number]['stage'];

function getCornStageIndex(stage: Field['farmingStage']): number {
    const idx = CORN_STAGES.findIndex(s => s.stage === stage);
    return idx === -1 ? 0 : idx;
}

function CornProgressStepper({ currentStage }: { currentStage: Field['farmingStage'] }) {
    const currentIdx = getCornStageIndex(currentStage);
    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Corn Season Progress
                </span>
                <span className="text-xs text-muted-foreground">
                    {currentIdx + 1}/{CORN_STAGES.length}
                </span>
            </div>
            <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
                {CORN_STAGES.map((s, i) => {
                    const done = i < currentIdx;
                    const active = i === currentIdx;
                    return (
                        <React.Fragment key={s.stage}>
                            <div className="flex flex-col items-center min-w-[48px]">
                                <div className={cn(
                                    'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                                    done ? 'bg-yellow-500 border-yellow-400 text-black' :
                                        active ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 ring-2 ring-yellow-400/30' :
                                            'bg-white/5 border-white/20 text-muted-foreground'
                                )}>
                                    {done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                </div>
                                <span className={cn(
                                    'text-[9px] mt-0.5 text-center leading-tight',
                                    active ? 'text-yellow-400 font-semibold' :
                                        done ? 'text-yellow-500/70' : 'text-muted-foreground'
                                )}>
                                    {s.label}
                                </span>
                            </div>
                            {i < CORN_STAGES.length - 1 && (
                                <div className={cn('h-0.5 flex-1 min-w-[8px] mx-0.5 rounded-full transition-all', done ? 'bg-yellow-500' : 'bg-white/10')} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// ── Contextual Corn Tips ──────────────────────────────────────────────────────
function getCornTip(stage: Field['farmingStage']): string | null {
    switch (stage) {
        case 'fallow':
            return '🌽 Corn Focus: Start with a drone aerial survey to map weed zones & soil variability.';
        case 'scouted':
            return '📡 Aerial survey reveals multispectral prescription map — book it before soil testing.';
        case 'aerial_surveyed':
            return '🧪 Aerial data ready. Order soil test to confirm pH & NPK before planning inputs.';
        case 'soil_tested':
            return '📦 Stock Up before plowing: you need corn seeds, Urea (46-0-0), pre-plant herbicide & fuel.';
        case 'plowed':
            return '🌿 Apply glyphosate/Maister Power burndown now to eliminate weeds before seedbed tillage.';
        case 'pre_plant_treated':
            return '✅ Burndown applied. Till while soil conditions are optimal for a fine seedbed.';
        case 'tilled':
            return '🐛 Gaucho seed treatment (imidacloprid) is REQUIRED to protect corn from wireworms.';
        case 'growing':
            return '📊 Monitor BBCH stages: apply Adengo at 2-leaf (BBCH 12), Decis at flowering (BBCH 53+).';
        case 'harvest_ready':
            return '⚡ Harvest at BBCH 89 (Full Ripeness). Moisture should be ≤20% for combine efficiency.';
        case 'harvested':
            return '🌾 Chop and incorporate corn stalks to prevent grey leaf spot and improve soil OM.';
        case 'post_harvest':
            return '🔄 Residue managed. Ready to start the next corn season with improved soil structure.';
        default:
            return null;
    }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export const FieldStatusPanel: React.FC<FieldStatusPanelProps> = ({ field }) => {
    const { performFieldOperation, equipment, inventory, cornFocusMode } = useGameStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const hasTractor = equipment.some(eq => eq.category === 'tractor');
    const hasHarvester = equipment.some(eq => eq.category === 'harvester');
    const hasDrone = equipment.some(eq => eq.category === 'drone');

    const hasReadyTractor = equipment.some(eq => eq.category === 'tractor' && eq.status === 'ready');
    const hasReadyHarvester = equipment.some(eq => eq.category === 'harvester' && eq.status === 'ready');
    const hasReadyDrone = equipment.some(eq => eq.category === 'drone' && eq.status === 'ready');

    const hasSeeds = inventory.some(item => item.category === 'seed' && item.quantity > 0);
    const hasCornSeeds = inventory.some(item =>
        item.category === 'seed' && item.quantity > 0 &&
        (item.id?.includes('corn') || item.name?.toLowerCase().includes('corn'))
    );
    const hasPrePlantChem = inventory.some(i =>
        i.quantity > 0 &&
        (i.id === 'chem-herbicide' || i.id === 'chem-maister-power' || i.id === 'chem-adengo')
    );
    const hasGaucho = inventory.some(i => i.id === 'chem-gaucho' && i.quantity > 0);

    const isCornMode = cornFocusMode && field.crop?.toLowerCase().includes('corn');

    // Determine the next step in the farming sequence
    const getNextStep = (stage: Field['farmingStage']) => {
        switch (stage) {
            // ── Corn path ──────────────────────────────────────────────────
            case 'fallow':
                if (isCornMode) {
                    return hasDrone
                        ? { id: 'op-aerial-survey', label: 'Run Aerial Survey (Drone)', cost: 800, type: 'direct' as const }
                        : { id: 'serv-aerial-survey', label: 'Book Aerial Survey', type: 'service' as const };
                }
                return { id: 'op-scout', label: 'Run Scouting Mission', cost: 500, type: 'direct' as const };
            case 'scouted':
                if (isCornMode) {
                    return hasDrone
                        ? { id: 'op-aerial-survey', label: 'Run Aerial Survey (Drone)', cost: 800, type: 'direct' as const }
                        : { id: 'serv-aerial-survey', label: 'Book Aerial Survey', type: 'service' as const };
                }
                return { id: 'op-soil-test', label: 'Run Soil Lab Test', cost: 1200, type: 'direct' as const };
            case 'aerial_surveyed':
                return { id: 'op-soil-test', label: 'Run Soil Lab Test', cost: 1200, type: 'direct' as const };
            case 'soil_tested':
                if (isCornMode && !hasCornSeeds) {
                    return { id: 'buy-seeds', label: '📦 Buy Corn Seeds First', type: 'service' as const };
                }
                return hasTractor
                    ? { id: 'op-plow', label: 'Plow with Own Tractor', cost: 2500, type: 'direct' as const }
                    : { id: 'serv-plow', label: 'Book Plowing Service', type: 'service' as const };
            case 'plowed':
                if (isCornMode) {
                    if (!hasPrePlantChem) {
                        return { id: 'buy-chemical', label: '📦 Buy Pre-Plant Herbicide', type: 'service' as const };
                    }
                    return hasTractor
                        ? { id: 'op-pre-plant-herbicide', label: 'Apply Burndown Herbicide', cost: 550, type: 'direct' as const }
                        : { id: 'serv-pre-plant-herbicide', label: 'Book Herbicide Service', type: 'service' as const };
                }
                return hasTractor
                    ? { id: 'op-till', label: 'Till with Own Tractor', cost: 1500, type: 'direct' as const }
                    : { id: 'serv-till', label: 'Book Tilling Service', type: 'service' as const };
            case 'pre_plant_treated':
                return hasTractor
                    ? { id: 'op-till', label: 'Till Treated Seedbed', cost: 1500, type: 'direct' as const }
                    : { id: 'serv-till', label: 'Book Tilling Service', type: 'service' as const };
            case 'tilled':
                if (isCornMode && !hasGaucho) {
                    return { id: 'buy-chemical', label: '⚠️ Buy Gaucho Seed Treatment', type: 'service' as const };
                }
                if (!hasSeeds) return { id: 'buy-seeds', label: 'Buy Seeds First', type: 'service' as const };
                return hasTractor
                    ? { id: 'op-plant', label: isCornMode ? 'Plant Corn (Gaucho Applied)' : 'Plant with Own Machinery', cost: 2000, type: 'direct' as const }
                    : { id: 'serv-plant-drill', label: 'Book Planting Service', type: 'service' as const };
            case 'growing':
                return { id: 'op-monitor', label: 'Monitoring Growth', type: 'direct' as const, disabled: true };
            case 'harvest_ready':
                return hasHarvester
                    ? { id: 'op-harvest', label: 'Harvest with Own Combine', cost: 500, type: 'direct' as const }
                    : { id: 'serv-harvest-combine-corn', label: 'Book Corn Harvest Crew', type: 'service' as const };
            case 'harvested':
                if (isCornMode) {
                    return hasTractor
                        ? { id: 'op-residue-management', label: 'Chop Stalks & Manage Residue', cost: 600, type: 'direct' as const }
                        : { id: 'serv-residue-management', label: 'Book Residue Management', type: 'service' as const };
                }
                return hasTractor
                    ? { id: 'op-plow', label: 'Prep Next Season (Own Tractor)', cost: 2500, type: 'direct' as const }
                    : { id: 'serv-plow', label: 'Book Pre-Season Plowing', type: 'service' as const };
            case 'post_harvest':
                return hasTractor
                    ? { id: 'op-plow', label: 'Start Next Corn Season (Plow)', cost: 2500, type: 'direct' as const }
                    : { id: 'serv-plow', label: 'Book Pre-Season Plowing', type: 'service' as const };
            default:
                return null;
        }
    };

    const nextStep = getNextStep(field.farmingStage || 'fallow');

    const handleAction = async () => {
        if (!nextStep) return;

        if (nextStep.type === 'service') {
            if (nextStep.id === 'buy-seeds') {
                router.push('/game/marketplace/supplies');
            } else if (nextStep.id === 'buy-chemical') {
                router.push('/game/marketplace/supplies');
            } else {
                router.push(`/game/marketplace/services?fieldId=${field.id}`);
            }
            return;
        }
        setIsProcessing(true);
        const result = performFieldOperation(field.id, nextStep.id);
        if (!result.success) {
            alert(result.error);
        }
        setIsProcessing(false);
    };

    // Helper to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'good': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'attention': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-muted-foreground bg-white/5 border-white/10';
        }
    };

    const cornTip = isCornMode ? getCornTip(field.farmingStage) : null;

    // Display-friendly stage label
    const stageLabel = (() => {
        const s = field.farmingStage || 'fallow';
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
        return labels[s] || s;
    })();

    const maintenanceRequired = (() => {
        if (!nextStep || nextStep.type !== 'direct') return false;
        if (nextStep.id === 'op-harvest' && hasHarvester && !hasReadyHarvester) return true;
        if (['op-plow', 'op-till', 'op-plant', 'op-pre-plant-herbicide', 'op-residue-management'].includes(nextStep.id) && hasTractor && !hasReadyTractor) return true;
        if (nextStep.id === 'op-aerial-survey' && hasDrone && !hasReadyDrone) return true;
        return false;
    })();

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Tractor className="w-5 h-5 text-primary" />
                    Field Operations
                    {isCornMode && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded-full font-medium">
                            🌽 Corn Mode
                        </span>
                    )}
                </h3>
                <div className="flex gap-2">
                    {nextStep && (
                        <button
                            onClick={handleAction}
                            data-guide-id="field-cta-primary-operation"
                            disabled={isProcessing || nextStep.disabled}
                            className={cn(
                                "text-xs px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 font-bold",
                                nextStep.disabled
                                    ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                                    : nextStep.id.startsWith('buy-')
                                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30"
                                        : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                            )}
                        >
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                nextStep.type === 'service' ? <Wrench className="w-3 h-3" /> :
                                    nextStep.id === 'op-aerial-survey' ? <Radar className="w-3 h-3" /> :
                                        <ArrowRight className="w-3 h-3" />}
                            {nextStep.label}{nextStep.type === 'direct' && nextStep.cost ? ` ($${nextStep.cost})` : ''}
                        </button>
                    )}
                    <Link
                        href={`/game/marketplace/services?fieldId=${field.id}`}
                        data-guide-id="field-cta-go-services"
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                        Hire Marketplace Services <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Contextual Corn Tip */}
            {cornTip && (
                <div className="mb-3 text-xs bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-yellow-300/90 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">💡</span>
                    <span>{cornTip}</span>
                </div>
            )}

            {/* Maintenance Warning */}
            {maintenanceRequired && (
                <div className="mb-3 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 flex items-start gap-2 animate-pulse">
                    <Wrench className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-bold">Machinery Maintenance Required</p>
                        <p className="opacity-80">Your required equipment is currently in for repairs. Visit the Fleet Manager or book a service provider.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Farming Stage */}
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Seasonal Stage</div>
                    <div className="font-medium capitalize text-white flex items-center gap-2">
                        {stageLabel}
                    </div>
                </div>

                {/* Crop Stage / BBCH */}
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                        {isCornMode && field.bbchStage ? 'BBCH Stage' : 'Crop Progress'}
                    </div>
                    <div className="font-medium capitalize text-white flex items-center gap-2">
                        <Sprout className="w-3 h-3 text-green-400" />
                        {isCornMode && field.bbchStage
                            ? `BBCH ${field.bbchStage}`
                            : field.cropStage === 'none' ? 'Waiting' : field.cropStage?.replace('_', ' ') || 'None'
                        }
                    </div>
                </div>

                {/* Health */}
                <div className={`rounded-lg p-3 border ${getStatusColor(field.healthStatus || 'good')}`}>
                    <div className="text-xs opacity-70 mb-1">Health</div>
                    <div className="font-medium capitalize flex items-center gap-2">
                        {field.healthStatus || 'Good'}
                    </div>
                </div>

                {/* Maintenance Alerts */}
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Alerts</div>
                    <div className="flex gap-2 flex-wrap">
                        {field.inputStatus?.needsWater && (
                            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center" title="Needs Water">
                                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                        )}
                        {field.inputStatus?.needsNutrients && (
                            <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center" title="Needs Nutrients">
                                <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                            </div>
                        )}
                        {isCornMode && field.farmingStage === 'tilled' && !hasGaucho && (
                            <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center" title="Gaucho Required!">
                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                            </div>
                        )}
                        {!field.inputStatus?.needsWater && !field.inputStatus?.needsNutrients && !(isCornMode && field.farmingStage === 'tilled' && !hasGaucho) && (
                            <span className="text-xs text-muted-foreground py-1">Optimal</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Corn Season Progress Stepper */}
            {isCornMode && <CornProgressStepper currentStage={field.farmingStage} />}
        </div>
    );
};
