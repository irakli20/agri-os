'use client';

import React from 'react';
import { GameShell } from '@/components/game/GameShell';
import { GameControlBar } from '@/components/game/GameControlBar';
import { StrategyCoachCard } from '@/components/game/StrategyCoachCard';
import { InventorySummaryCard } from '@/components/game/InventorySummaryCard';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

export default function GameDashboardPage() {
    return (
        <GameShell>
            <div className="h-full overflow-y-auto p-6">
                <GameControlBar />
                <DashboardGrid className="mt-6">
                    <div className="sticky top-[82px] z-40">
                        <StrategyCoachCard />
                    </div>
                    <InventorySummaryCard />
                </DashboardGrid>
            </div>
        </GameShell>
    );
}
