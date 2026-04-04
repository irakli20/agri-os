import React from 'react';
import { useGameStore } from '@/lib/game-store';
import { Package, Droplets, SprayCan } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const InventorySummaryCard = () => {
    const { inventory } = useGameStore();

    // Group by category
    const seeds = inventory.filter(i => i.category === 'seed');
    const fertilizers = inventory.filter(i => i.category === 'fertilizer');
    const chemicals = inventory.filter(i => i.category === 'chemical');

    return (
        <div className="h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white flex flex-col">
            <div className="flex flex-row items-center justify-between pb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Farm Inventory
                </h3>
                <Package className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-4 flex-1">
                {/* Seeds */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <span className="text-sm">🌱</span>
                        </div>
                        <span className="text-sm font-medium">Seeds</span>
                    </div>
                    <span className="font-mono">{seeds.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                </div>

                {/* Fertilizers */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Droplets className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium">Fertilizers</span>
                    </div>
                    <span className="font-mono">{fertilizers.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                </div>

                {/* Chemicals */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <SprayCan className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-sm font-medium">Chemicals</span>
                    </div>
                    <span className="font-mono">{chemicals.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <Link
                    href="/game/marketplace/supplies"
                    className="text-xs text-primary hover:text-primary/90 flex items-center justify-center gap-1 w-full py-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                    Restock Supplies
                </Link>
            </div>
        </div>
    );
};
