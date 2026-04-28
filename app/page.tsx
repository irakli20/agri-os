'use client';

import dynamic from 'next/dynamic';
const MapCanvas = dynamic(() => import('@/components/registry/MapCanvas').then(mod => mod.MapCanvas), { ssr: false });
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { WeatherCard } from '@/components/registry/WeatherCard';
import { FleetStatusCard } from '@/components/registry/FleetStatusCard';
import { TaskListCard } from '@/components/registry/TaskListCard';
import { FieldHealthCard } from '@/components/registry/FieldHealthCard';
import { RecentFlightsCard } from '@/components/registry/RecentFlightsCard';
import { QuickActionsCard } from '@/components/registry/QuickActionsCard';
import { ActivityLogPanel, MOCK_ACTIVITIES } from '@/components/ui/ActivityLogPanel';
import { useGameStore } from '@/lib/game-store';
import { GameControlBar } from '@/components/game/GameControlBar';
import { InventorySummaryCard } from '@/components/game/InventorySummaryCard';
import { StrategyCoachCard } from '@/components/game/StrategyCoachCard';
import { useFieldStore } from '@/lib/field-store';
import Link from 'next/link';
import { MapPinned, ArrowRight, AlertTriangle } from 'lucide-react';
import { WEATHER } from '@/lib/mock-data';

/**
 * Agri-OS Main Page
 */
export default function Home() {
    const { gameMode, weeklyChallenges } = useGameStore();
    const { getFieldsForMode } = useFieldStore();
    const fields = getFieldsForMode(gameMode ? 'strategy' : 'demo');
    const openChallenges = weeklyChallenges.filter((challenge) => challenge.status === 'open').length;
    const criticalFields = fields.filter((field) => field.healthStatus === 'critical').length;
    const totalAcres = fields.reduce((sum, field) => sum + field.acres, 0);

    return (
        <AppShell>
            <div className="relative w-full h-full overflow-hidden bg-background">
                <MapCanvas />
                <div className="absolute inset-0 z-10 pointer-events-none overflow-y-auto">
                    {gameMode && (
                        <div className="pointer-events-auto">
                            <GameControlBar />
                        </div>
                    )}
                    <DashboardGrid className="p-4">
                        <div className="col-span-full pointer-events-auto mission-banner elevate-card fade-up">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                                        <MapPinned className="h-3.5 w-3.5" />
                                        Mission Overview
                                    </div>
                                    <h2 className="mt-2 text-xl font-semibold text-foreground">
                                        {gameMode ? 'Run the season one week at a time' : 'Plan, monitor, and act from one operational surface'}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {gameMode
                                            ? 'Strategy mode is active: focus on weekly priorities, weather windows, and field progression.'
                                            : 'Operations mode: monitor field health, weather windows, and pending work before dispatch.'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={gameMode ? '/game/my-fields' : '/fields'} className="cta-primary inline-flex items-center gap-2 text-sm">
                                        {gameMode ? 'Open Strategy Fields' : 'View Fields'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link href={gameMode ? '/game/marketplace/services' : '/services'} className="cta-secondary inline-flex items-center gap-2 text-sm">
                                        {gameMode ? 'Open Service Market' : 'Book Service'}
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Active Fields</p>
                                    <p className="mt-1 text-lg font-semibold">{fields.length}</p>
                                    <p className="text-xs text-muted-foreground">{totalAcres.toFixed(1)} acres covered</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Critical Health</p>
                                    <p className="mt-1 text-lg font-semibold text-red-300">{criticalFields}</p>
                                    <p className="text-xs text-muted-foreground">Fields needing immediate action</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Weather Risk</p>
                                    <p className="mt-1 text-lg font-semibold">{WEATHER.current.precipitation}%</p>
                                    <p className="text-xs text-muted-foreground">
                                        {gameMode ? 'Current weather pressure for this week' : 'Current precipitation chance'}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Open Priorities</p>
                                    <p className="mt-1 text-lg font-semibold">{gameMode ? openChallenges : '5'}</p>
                                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3 text-yellow-300" />
                                        {gameMode ? 'From strategy planning' : 'Tasks queued for this week'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <FieldHealthCard />
                        <WeatherCard />
                        <TaskListCard />
                        {gameMode ? (
                            <>
                                <StrategyCoachCard />
                                <InventorySummaryCard />
                                <QuickActionsCard />
                            </>
                        ) : (
                            <>
                                <FleetStatusCard />
                                <RecentFlightsCard />
                                <QuickActionsCard />
                                <div className="h-full min-h-[300px]">
                                    <ActivityLogPanel activities={MOCK_ACTIVITIES} />
                                </div>
                            </>
                        )}
                    </DashboardGrid>
                </div>
            </div>
        </AppShell>
    );
}
