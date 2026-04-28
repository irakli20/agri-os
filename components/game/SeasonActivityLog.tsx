'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Bug, ChevronDown, ChevronUp, Clock3, Sprout,
    Tractor, Cloud, AlertTriangle, CheckCircle2, ListFilter,
    Target, ShoppingCart, Calendar, Droplet, Droplets, FlaskConical, Leaf, Package,
} from 'lucide-react';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { formatStageLabel } from '@/lib/corn-strategy';
import type { DebugEntry } from '@/lib/game-debug';

function priorityClass(priority: string) {
    return priority === 'critical' ? 'border-red-400/50 bg-red-500/10 text-red-300'
        : priority === 'high' ? 'border-orange-400/50 bg-orange-500/10 text-orange-300'
        : 'border-blue-400/50 bg-blue-500/10 text-blue-300';
}

const OP_LABELS: Record<string, string> = {
    'op-till': 'Tilling', 'op-plow': 'Plowing', 'op-spray': 'Spraying',
    'op-harvest': 'Harvesting', 'op-plant': 'Planting', 'op-fertilize': 'Fertilizing',
    'op-irrigate': 'Irrigating', 'op-scout': 'Scouting', 'op-soil-test': 'Soil testing',
};

const FARMING_STAGE_IDS = new Set([
    'fallow', 'scouted', 'aerial_surveyed', 'soil_tested', 'plowed',
    'pre_plant_treated', 'tilled', 'growing', 'harvest_ready',
    'harvested', 'post_harvest',
]);

function isStageId(value: unknown): boolean {
    return typeof value === 'string' && FARMING_STAGE_IDS.has(value);
}

function describeOp(operationId?: unknown): string {
    if (typeof operationId !== 'string' || !operationId || operationId === 'undefined' || operationId === 'null') {
        return 'Field work';
    }
    if (isStageId(operationId)) return 'Field work';
    for (const [k, v] of Object.entries(OP_LABELS)) {
        if (operationId.includes(k)) return v;
    }
    const label = operationId.replace(/^(op-|serv-)/, '').replace(/-/g, ' ').trim();
    return label || 'Field work';
}

function categoryIcon(category?: unknown) {
    switch (category) {
        case 'pest':
            return Bug;
        case 'disease':
            return Droplet;
        case 'weed':
            return Leaf;
        case 'nutrient':
            return FlaskConical;
        case 'weather':
            return Cloud;
        default:
            return AlertTriangle;
    }
}

function categoryLabel(category?: unknown): string {
    return typeof category === 'string'
        ? category.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
        : 'Seasonal Challenge';
}

function money(value: unknown): string {
    const amount = typeof value === 'number' ? value : Number(value || 0);
    return amount > 0 ? `$${Math.round(amount).toLocaleString()}` : 'no direct cash charge';
}

function stageText(oldStage?: unknown, newStage?: unknown): string {
    if (!oldStage && !newStage) return 'Stage was unchanged.';
    if (oldStage && newStage && oldStage !== newStage) {
        return `Field advanced: ${formatStageLabel(String(oldStage))} -> ${formatStageLabel(String(newStage))}.`;
    }
    return `Field remained at ${formatStageLabel(String(newStage || oldStage))}.`;
}

function weatherText(data: Record<string, unknown>): string {
    const weather = (data.weather || {}) as Record<string, unknown>;
    const temperature = data.temperature ?? weather.temperature;
    const wind = data.wind ?? weather.wind;
    const rain = data.precipitationChance ?? weather.precipitationChance;
    const fieldworkOpen = data.fieldworkOpen ?? weather.fieldworkOpen;
    const sprayOpen = data.sprayOpen ?? weather.sprayOpen;
    const windows = [
        fieldworkOpen ? 'fieldwork open' : 'fieldwork closed',
        (data.sprayOpen ?? weather.sprayOpen) ? 'spray open' : 'spray closed',
    ].join(', ');
    const tempPart = temperature ? `${temperature}°F` : 'temperature unavailable';
    const windPart = wind !== undefined ? `${wind} mph wind` : 'wind unavailable';
    const rainPart = rain !== undefined ? `${rain}% rain risk` : 'rain risk unavailable';
    return `Weather: ${tempPart}, ${windPart}, ${rainPart}; ${windows}.`;
}

function operationWhy(operationId: string, oldStage?: unknown): string {
    const stage = String(oldStage || '');
    if (operationId.includes('till')) return stage === 'plowed' || stage === 'pre_plant_treated'
        ? 'Why: prepared a uniform seedbed after primary soil work.'
        : 'Why: reduced compaction and prepared soil for the next crop step.';
    if (operationId.includes('plow')) return 'Why: opened compacted soil so seedbed preparation can begin.';
    if (operationId.includes('plant')) return 'Why: moved the prepared field into crop establishment while the planting window was available.';
    if (operationId.includes('fertilizer') || operationId.includes('topdress')) return 'Why: corrected nutrient demand before yield potential was limited.';
    if (operationId.includes('herbicide') || operationId.includes('spray')) return 'Why: reduced weed, disease, or pest pressure during the active protection window.';
    if (operationId.includes('harvest')) return 'Why: crop maturity and harvest access aligned, reducing field-loss risk.';
    if (operationId.includes('irrigate')) return 'Why: prevented moisture stress while rain probability was low.';
    if (operationId.includes('scout') || operationId.includes('survey')) return 'Why: collected field intelligence before committing machinery and inputs.';
    if (operationId.includes('soil-test')) return 'Why: established nutrient baseline before spending on fertilizer.';
    return 'Why: completed the recommended task for this field stage.';
}

function formatLogEntry(entry: DebugEntry): { icon: typeof Sprout; text: string; detail: string; tag: string } {
    const msg = entry.msg;
    const d = (entry.data || {}) as Record<string, unknown>;
    const tag = entry.tag;

    // ── ADVANCE ──
    if (tag === 'ADVANCE') {
        if (d.mode === 'auto-procurement') {
            const itemName = String(d.itemName || msg.replace('Auto-Procurement: Purchased ', '').replace(/\s*\(Balance:.*/, ''));
            return {
                icon: Package,
                text: `Auto-Procurement purchased ${itemName}.`,
                detail: `${d.reason || 'Inventory was below the operating threshold.'} Cost: ${money(d.cost)}. New cash balance: ${money(d.balance)}. ${weatherText(d)}`,
                tag,
            };
        }
        if (msg.startsWith('advanceTime:')) {
            const m = msg.match(/Y(\d+) (\w+) W(\d+) → Y(\d+) (\w+) W(\d+)/);
            if (m) return {
                icon: Clock3,
                text: `Week advanced from ${m[2]} W${m[3]} to ${m[5]} W${m[6]}.`,
                detail: `Planning window refreshed for Year ${m[4]}. ${weatherText(d)}`,
                tag
            };
        }
        if (msg.startsWith('Auto-Procurement:')) {
            if (msg.includes('Urea')) return { icon: Package, text: 'Purchased Urea 46-0-0 fertilizer', detail: 'Applied pre-plant for nitrogen baseline — $2,250', tag };
            if (msg.includes('Maister')) return { icon: Package, text: 'Purchased Maister Power herbicide', detail: 'Post-emergence weed control — $1,450', tag };
            if (msg.includes('Gaucho')) return { icon: Package, text: 'Purchased Gaucho seed treatment', detail: 'Insecticide + fungicide coating — $1,700', tag };
            if (msg.includes('Fuel')) return { icon: Package, text: 'Purchased diesel fuel', detail: 'Tractor and equipment operations — $1,300', tag };
            if (msg.includes('Corn Seeds')) return { icon: Sprout, text: 'Purchased field corn seed', detail: 'Hybrid variety, 80K kernels/unit — $1,400', tag };
            return { icon: Package, text: msg.replace('Auto-Procurement: ', ''), detail: '', tag };
        }
        if (msg.startsWith('Auto-Booking:')) {
            const m = msg.match(/Booked & Executed (.+) for (.+) \(Cost: \$(\d[\d,]*)\)/);
            if (m) return { icon: Calendar, text: `${m[1]}`, detail: `${m[2]} — $${m[3]}`, tag };
            return { icon: Calendar, text: msg.replace('Auto-Booking: ', '').replace(/\(Cost: [^)]+\)/, '').trim(), detail: '', tag };
        }
        if (msg.startsWith('Auto-Ops:')) {
            const clean = msg.replace('Auto-Ops: Executed Direct ', '').replace('Auto-Ops: ', '');
            return { icon: Tractor, text: clean, detail: 'Direct field operation executed', tag };
        }
        if (msg.startsWith('Auto-Irrigation')) {
            const m = msg.match(/triggered for (.+)/);
            return { icon: Droplets, text: 'Irrigation applied', detail: m?.[1] || '', tag };
        }
    }

    // ── OPERATION ──
    if (tag === 'OPERATION') {
        const operationId = String(d.operationId || msg.match(/(?:OK|completed): ([\w-]+)/)?.[1] || '');
        const fieldName = String(d.fieldName || msg.match(/"(.+)"/)?.[1] || 'field');
        if (operationId && fieldName) {
            const op = describeOp(operationId);
            const bbch = d.bbch ? ` BBCH ${d.bbch}.` : '';
            const acres = d.acres ? ` ${Number(d.acres).toLocaleString()} acres.` : '';
            const crop = d.cropType ? ` Crop: ${d.cropType}.` : '';
            return {
                icon: operationId.includes('irrigate') ? Droplets : Tractor,
                text: `${op} completed on ${fieldName}.`,
                detail: `${stageText(d.oldStage, d.newStage)}${bbch}${crop}${acres} ${weatherText(d)} Cost: ${money(d.cost)}. ${d.reason || operationWhy(operationId, d.oldStage)}`,
                tag,
            };
        }
        if (msg.startsWith('applyOperation OK:')) {
            const m = msg.match(/applyOperation OK: (\S+) on "(.+)"/);
            if (m) {
                const op = describeOp(m[1]);
                const oldStage = (d as any).oldStage || '';
                const newStage = (d as any).newStage || '';
                const stageChange = oldStage && newStage && oldStage !== newStage
                    ? `Field advanced: ${formatStageLabel(oldStage)} → ${formatStageLabel(newStage)}`
                    : '';
                return { icon: Tractor, text: `${op} completed`, detail: `${m[2]}${stageChange ? ' — ' + stageChange : ''}`, tag };
            }
        }
        if (msg.startsWith('applyOperation FAILED:')) {
            return { icon: AlertTriangle, text: 'Operation failed', detail: (d as any).error || '', tag };
        }
    }

    // ── WEATHER ──
    if (tag === 'WEATHER') {
        if (msg.includes('Generated weather')) {
            const m = msg.match(/Y(\d+) (\w+) W(\d+)/);
            const fw = (d as any).fieldwork;
            const win = fw ? 'Fieldwork window OPEN — operations can proceed' : 'Fieldwork window CLOSED — ground too wet';
            return { icon: Cloud, text: m ? `${m[2]} Week ${m[3]} forecast` : 'Weather updated', detail: win, tag };
        }
    }

    // ── CHALLENGE ──
    if (tag === 'CHALLENGE') {
        if ((d as any).challengeTemplateId && msg.startsWith('Seasonal challenge completed:')) {
            const title = msg.replace('Seasonal challenge completed: ', '');
            const category = categoryLabel((d as any).category);
            const fieldName = (d as any).fieldName ? ` on ${(d as any).fieldName}` : '';
            const mitigation = String((d as any).mitigationDescription || 'Mitigation completed.');
            const cost = money((d as any).mitigationCost);
            const yieldSaved = typeof (d as any).yieldSavedPct === 'number'
                ? `${Math.round((d as any).yieldSavedPct)}% yield protected`
                : 'yield risk reduced';
            return {
                icon: categoryIcon((d as any).category),
                text: `${category} challenge resolved${fieldName}: ${title}.`,
                detail: `${mitigation} Cost: ${cost}. ${yieldSaved}.`,
                tag,
            };
        }
        // Use the title/recommended from data if available
        const title = (d as any).title as string | undefined;
        const recommended = (d as any).recommended as string | undefined;
        
        if (msg.startsWith('Field "') && msg.includes('→')) {
            const m = msg.match(/Field "(.+)" \((\w+)\) → (\S+)/);
            if (m) {
                const fieldName = m[1];
                const stage = m[2];
                const opId = m[3];
                
                // If title is available, use it
                if (title) {
                    return { icon: Target, text: title, detail: `${fieldName} — stage: ${formatStageLabel(stage)}`, tag };
                }
                
                // If opId is the stage name or null, no operation was recommended
                if (!opId || opId === 'null' || opId === stage) {
                    const stageHints: Record<string, string> = {
                        fallow: 'Scout or soil test recommended',
                        scouted: 'Soil testing or aerial survey recommended',
                        aerial_surveyed: 'Soil testing recommended',
                        soil_tested: 'Plowing or pre-plant treatment recommended',
                        plowed: 'Pre-plant treatment or tilling recommended',
                        pre_plant_treated: 'Tilling and planting recommended',
                        tilled: 'Planting recommended',
                        growing: 'Monitor crop; spray or fertilize as needed',
                        harvest_ready: 'Harvest immediately',
                    };
                    const hint = stageHints[stage] || `Next step for ${formatStageLabel(stage)}`;
                    return { icon: Target, text: hint, detail: `${fieldName} — stage: ${formatStageLabel(stage)}`, tag };
                }
                
                const op = describeOp(opId);
                return { icon: Target, text: `${op} needed`, detail: `${fieldName} — stage: ${formatStageLabel(stage)}`, tag };
            }
        }
        // Generic challenge
        if (title) {
            return { icon: Target, text: title, detail: `Week ${(d as any).gameWeek || ''}`, tag };
        }
    }// ── FIELD ──
    if (tag === 'FIELD') {
        return { icon: Sprout, text: msg, detail: '', tag };
    }

    // ── ERROR ──
    if (tag === 'ERROR') {
        return { icon: AlertTriangle, text: msg.replace('ERROR: ', ''), detail: (d as any).error || '', tag };
    }

    // Default
    return { icon: CheckCircle2, text: msg, detail: '', tag };
}

function logEntryKey(entry: DebugEntry): string {
    return `${entry.ts}|${entry.tag}|${entry.msg}|${JSON.stringify(entry.data || {})}`;
}

interface Props {
    fieldId?: string;  // If provided, only show entries for this field
}

export function SeasonActivityLog({ fieldId }: Props) {
    const { gameTime, seasonLog, weeklyChallenges, pendingOrders } = useGameStore();
    const { gameFields } = useFieldStore();
    const [expanded, setExpanded] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const latestRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom only when user was already near the bottom
    useEffect(() => {
        // Find the nearest scrollable ancestor (the parent with overflow-y-auto)
        let container: HTMLElement | null = scrollRef.current?.parentElement || null;
        while (container) {
            const style = window.getComputedStyle(container);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') break;
            container = container.parentElement;
        }
        if (!container) return;
        // Only auto-scroll if user was within 150px of the bottom (they were following along)
        const wasNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (!wasNearBottom) return;
        if (latestRef.current) {
            latestRef.current.scrollIntoView({ block: 'nearest' });
        } else {
            container.scrollTop = container.scrollHeight;
        }
    }, [seasonLog, weeklyChallenges, pendingOrders]);

    // Completed entries — filter by current season AND optional fieldId
    const completedEntries = useMemo(() => {
        if (!seasonLog || seasonLog.length === 0) return [];
        // Filter to current season only
        const seasonLabel = `Y${gameTime.year} ${gameTime.season}`;
        const inSeason = seasonLog.filter((e: DebugEntry) => {
            return e.msg.includes(seasonLabel) ||
                e.msg.includes(`Y${gameTime.year}`) ||
                (e.data?.season === gameTime.season) ||
                (e.data?.year === gameTime.year) ||
                e.tag === 'OPERATION' ||
                e.tag === 'CHALLENGE';
        });

        let entries = inSeason;

        // Filter by field if specified
        if (fieldId) {
            const field = gameFields.find(f => f.id === fieldId);
            const fieldName = field?.name || '';
            entries = inSeason.filter((e: DebugEntry) => {
                const msg = e.msg;
                // Match field name or fieldId in message or data
                if (fieldName && msg.includes(fieldName)) return true;
                if ((e.data as any)?.fieldId === fieldId) return true;
                if ((e.data as any)?.fieldName === fieldName) return true;
                // For challenges, check if msg includes a known field name
                if (fieldName) {
                    const match = msg.match(/Field "([^"]+)"/);
                    if (match && match[1] === fieldName) return true;
                }
                return false;
            });
        }

        const seen = new Set<string>();
        return entries
            .filter((entry: DebugEntry) => {
                const key = logEntryKey(entry);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a: DebugEntry, b: DebugEntry) => b.ts.localeCompare(a.ts));
    }, [seasonLog, gameTime, fieldId, gameFields]);

    // Planned items — also filter by field
    const plannedItems = useMemo(() => {
        const openChallenges = weeklyChallenges.filter(c => c.status === 'open');
        const items: Array<{ type: 'challenge' | 'order'; id: string; title: string; fieldName?: string; priority: string; rewardXp: number; detail: string; category?: string }> = [];

        for (const c of openChallenges) {
            if (fieldId && c.fieldId !== fieldId) continue;
            const field = c.fieldId ? gameFields.find(f => f.id === c.fieldId) : null;
            const op = c.operationId ? describeOp(c.operationId) : 'planned task';
            items.push({
                type: 'challenge',
                id: c.id,
                title: c.title,
                fieldName: field?.name,
                priority: c.priority,
                rewardXp: c.rewardXp,
                category: (c as any).category,
                detail: `${op} is planned for this week${field ? ` on ${field.name}` : ''}. Current stage: ${field?.farmingStage ? formatStageLabel(field.farmingStage) : 'pending'}. ${c.description}${(c as any).yieldImpactPct ? ` Yield at risk: ${(c as any).yieldImpactPct}%.` : ''}${(c as any).mitigationDescription ? ` Mitigation: ${(c as any).mitigationDescription}` : ''}`,
            });
        }

        for (const o of pendingOrders) {
            if (fieldId && o.fieldId !== fieldId) continue;
            const field = gameFields.find(f => f.id === o.fieldId);
            items.push({
                type: 'order',
                id: o.id,
                title: o.name,
                fieldName: field?.name,
                priority: 'high',
                rewardXp: 0,
                detail: `${describeOp(o.operationId)} is queued to execute this week${field ? ` on ${field.name}` : ''} when the weather window opens. Current stage: ${field?.farmingStage ? formatStageLabel(field.farmingStage) : 'pending'}.`,
            });
        }

        return items;
    }, [weeklyChallenges, pendingOrders, gameFields, fieldId]);

    const totalItems = completedEntries.length + plannedItems.length;
    const completedCount = completedEntries.length;
    const plannedCount = plannedItems.length;

    if (totalItems === 0) {
        return (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ListFilter className="w-4 h-4" />
                    <span className="text-sm">No operations yet. Advance the week to begin.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">
                        {fieldId ? 'Field Activity' : 'Season Activity'} — W{gameTime.week}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {completedCount > 0 && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{completedCount} done</span>}
                        {plannedCount > 0 && <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">{plannedCount} planned</span>}
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {expanded && (
                <div ref={scrollRef} className="border-t border-white/5">
                    {plannedItems.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-amber-500/[0.04] border-b border-amber-500/10">
                                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />Planned
                                </span>
                            </div>
                            {plannedItems.map(item => (
                                <div key={item.id} className="flex items-start gap-2 px-4 py-3 text-xs border-b border-white/[0.03] hover:bg-white/[0.02]">
                                    {item.type === 'challenge' ? (() => {
                                        const PlannedIcon = item.category ? categoryIcon(item.category) : Target;
                                        return <PlannedIcon className="w-3 h-3 mt-0.5 shrink-0 text-green-400" />;
                                    })() : <ShoppingCart className="w-3 h-3 mt-0.5 shrink-0 text-blue-400" />}
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-foreground/90">{item.title}</div>
                                        <div className="text-muted-foreground/70 leading-relaxed mt-1">{item.detail}</div>
                                    </div>
                                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold border shrink-0', priorityClass(item.priority))}>{item.priority}</span>
                                    {item.rewardXp > 0 && <span className="text-[10px] text-green-400/70 shrink-0">+{item.rewardXp}XP</span>}
                                </div>
                            ))}
                        </div>
                    )}

                    {completedEntries.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-green-500/[0.04] border-b border-green-500/10">
                                <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" />Completed
                                </span>
                            </div>
                            {completedEntries.map((entry: DebugEntry, i: number) => {
                                const f = formatLogEntry(entry);
                                const Icon = f.icon;
                                const colors: Record<string, string> = {
                                    ADVANCE: 'text-purple-400', OPERATION: 'text-amber-400',
                                    CHALLENGE: 'text-green-400', WEATHER: 'text-blue-400',
                                    FIELD: 'text-emerald-400', ERROR: 'text-red-400',
                                };
                                return (
                                    <div key={`${entry.ts}-${i}`} className="flex items-start gap-2 px-4 py-3 text-xs border-b border-white/[0.03] hover:bg-white/[0.02]">
                                        <span className="text-[10px] text-muted-foreground/50 font-mono mt-0.5 w-14 shrink-0">{entry.ts.slice(0, 8)}</span>
                                        <Icon className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', colors[f.tag] || 'text-slate-400')} />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-foreground/90 font-medium">{f.text}</div>
                                            {f.detail && <div className="text-muted-foreground/70 leading-relaxed mt-1">{f.detail}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div ref={latestRef} />
                </div>
            )}
        </div>
    );
}
