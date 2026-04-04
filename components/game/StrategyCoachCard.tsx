'use client';

import Link from 'next/link';
import { Widget } from '@/components/dashboard/DashboardGrid';
import { useFieldStore } from '@/lib/field-store';
import { useGameStore } from '@/lib/game-store';
import { buildFieldInsights } from '@/lib/strategy-coach';
import { Bot, ChevronRight, Calendar, AlertTriangle, Sprout, Droplets, ShieldAlert, Leaf, Clock3 } from 'lucide-react';

export function StrategyCoachCard() {
    const { gameFields } = useFieldStore();
    const {
        weeklyChallenges,
        gameTime,
        weeklyWeather,
        advanceTime,
        openWeeklyPlanner,
    } = useGameStore();

    const openChallenges = weeklyChallenges.filter((c) => c.status === 'open');
    const waterRiskField = gameFields.find((f) => f.inputStatus?.needsWater);
    const protectionRiskField = gameFields.find((f) => f.inputStatus?.needsProtection);
    const harvestReadyField = gameFields.find((f) => f.farmingStage === 'harvest_ready');
    const fieldInsights = buildFieldInsights(gameFields, weeklyChallenges, weeklyWeather);
    const topInsight = fieldInsights[0];

    let primaryAction: React.ReactNode;
    let guidanceText = topInsight
        ? `${topInsight.fieldName}: ${topInsight.whyNow}`
        : 'Review priorities and execute your highest-value field action first.';

    if (gameFields.length === 0) {
        guidanceText = 'Acquire your first field to start the growth cycle.';
        primaryAction = (
            <Link
                href="/game/marketplace"
                data-guide-id="game-cta-open-marketplace"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
            >
                Open Marketplace <ChevronRight className="w-4 h-4" />
            </Link>
        );
    } else if (openChallenges.length > 0) {
        guidanceText = `You have ${openChallenges.length} open priority ${openChallenges.length === 1 ? 'task' : 'tasks'} this week.`;
        primaryAction = (
            <button
                onClick={openWeeklyPlanner}
                data-guide-id="game-cta-open-weekly-plan"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold"
            >
                Open Weekly Plan <ChevronRight className="w-4 h-4" />
            </button>
        );
    } else if (topInsight) {
        primaryAction = (
            <Link
                href={topInsight.actionHref}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
            >
                {topInsight.actionLabel} <ChevronRight className="w-4 h-4" />
            </Link>
        );
    } else {
        guidanceText = 'All weekly priorities are complete. Advance to generate next-week tasks.';
        primaryAction = (
            <button
                onClick={advanceTime}
                data-guide-id="game-cta-next-week"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold"
            >
                Advance to Week {gameTime.week + 1} <Calendar className="w-4 h-4" />
            </button>
        );
    }

    return (
        <Widget title="AI Strategy Coach" className="col-span-1" icon={Bot}>
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{guidanceText}</p>
                <div>{primaryAction}</div>

                {fieldInsights.length > 0 && (
                    <div className="space-y-2 pt-1">
                        {fieldInsights.map((insight) => (
                            <div
                                key={insight.fieldId}
                                className="text-xs p-2 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-2"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium text-foreground flex items-center gap-1">
                                        {insight.urgency === 'critical' && <AlertTriangle className="w-3 h-3 text-red-300" />}
                                        {insight.urgency === 'high' && <ShieldAlert className="w-3 h-3 text-amber-300" />}
                                        {insight.urgency === 'medium' && <Clock3 className="w-3 h-3 text-blue-300" />}
                                        {insight.fieldName}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">{insight.whyNow}</p>
                                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">{insight.evidence}</p>
                                </div>
                                <Link href={insight.actionHref} className="shrink-0 text-primary hover:text-primary">
                                    Act
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2 pt-1">
                    {harvestReadyField && (
                        <div className="text-xs p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                            <span className="flex items-center gap-1"><Sprout className="w-3 h-3 text-amber-300" /> {harvestReadyField.name} ready to harvest</span>
                            <Link href={`/fields/${harvestReadyField.id}`} className="text-amber-300 hover:text-amber-200">Open</Link>
                        </div>
                    )}
                    {waterRiskField && (
                        <div className="text-xs p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-300" /> {waterRiskField.name} needs irrigation</span>
                            <Link href={`/game/marketplace/services?fieldId=${waterRiskField.id}`} className="text-blue-300 hover:text-blue-200">Services</Link>
                        </div>
                    )}
                    {protectionRiskField && (
                        <div className="text-xs p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                            <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-red-300" /> {protectionRiskField.name} needs protection</span>
                            <Link href={`/game/marketplace/services?fieldId=${protectionRiskField.id}`} className="text-red-300 hover:text-red-200">Services</Link>
                        </div>
                    )}
                </div>
            </div>
        </Widget>
    );
}
