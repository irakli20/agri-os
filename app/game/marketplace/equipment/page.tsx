'use client';

import React from 'react';
import { GameShell } from '@/components/game/GameShell';
import { MarketplaceNav } from '@/components/game/MarketplaceNav';

export default function EquipmentMarketplacePage() {
    return (
        <GameShell>
            <div className="h-full overflow-y-auto p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Equipment</h2>
                    <MarketplaceNav />
                    <p className="text-sm text-muted-foreground mt-4">
                        Buy or rent machinery to operate your farm.
                    </p>
                </div>
                <div className="text-center py-16 text-muted-foreground">
                    Equipment marketplace coming soon.
                </div>
            </div>
        </GameShell>
    );
}
