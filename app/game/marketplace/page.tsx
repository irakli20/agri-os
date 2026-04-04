'use client';

import React, { useState, useMemo } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { useGameStore } from '@/lib/game-store';
import { GameAuthScreen } from '@/components/game/GameAuthScreen';
import {
    MARKETPLACE_FIELDS,
    FIELD_CATEGORIES,
    SORT_OPTIONS,
    sortFields,
    type FieldCategory,
    type SortOption,
    type MarketplaceField,
} from '@/lib/marketplace-data';
import {
    Search,
    SlidersHorizontal,
    Star,
    MapPin,
    Ruler,
    DollarSign,
    Droplets,
    Sun,
    Mountain,
    Store,
    Leaf,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { MarketplaceNav } from '@/components/game/MarketplaceNav';

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "w-3 h-3",
                        i < value ? "text-yellow-400 fill-yellow-400" : "text-white/10"
                    )}
                />
            ))}
        </div>
    );
}

function FieldCard({ field, isOwned, isRented, guideId }: { field: MarketplaceField; isOwned: boolean; isRented: boolean; guideId?: string }) {
    const category = FIELD_CATEGORIES.find(c => c.id === field.category);

    return (
        <Link
            href={`/game/marketplace/${field.id}`}
            data-guide-id={guideId}
            className="group glass-panel rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
        >
            {/* Image / Preview */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-green-900/30 to-blue-900/30">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300 group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url(${field.imageUrl})` }}
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-medium">
                    <span>{category?.icon}</span>
                    <span className={category?.color}>{category?.label}</span>
                </div>
                {/* Status Badge */}
                {(isOwned || isRented) && (
                    <div className={cn(
                        "absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold",
                        isOwned ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    )}>
                        {isOwned ? '✓ Owned' : '◎ Renting'}
                    </div>
                )}
                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">{field.overallRating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-green-400 transition-colors">
                    {field.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {field.location}
                </div>

                {/* Size + Price Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Ruler className="w-3 h-3" />
                        {field.sizeHectares} ha
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Buy</span>
                        <span className="text-sm font-bold text-green-400">${field.buyPrice.toLocaleString()}</span>
                    </div>
                </div>

                {/* Quick Characteristics */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-orange-400" />
                        <StarRating value={field.characteristics.climate} />
                    </div>
                    <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-green-400" />
                        <StarRating value={field.characteristics.soilQuality} />
                    </div>
                    <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <StarRating value={field.characteristics.waterAccess} />
                    </div>
                </div>

                {/* View Details Hint */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Rent from ${field.rentPrice.toLocaleString()}/season</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-green-400 transition-colors" />
                </div>
            </div>
        </Link>
    );
}

export default function MarketplacePage() {
    const { getCurrentPlayer, players, cornFocusMode, currentPlayerId, deletedFieldIds } = useGameStore();
    const player = getCurrentPlayer();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<FieldCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

    // Combine filters and sort
    const filteredFields = useMemo(() => {
        let result = MARKETPLACE_FIELDS.filter(f => !deletedFieldIds.includes(f.id));

        // Corn Focus Mode filter
        if (cornFocusMode) {
            result = result.filter(f => f.isCornSuitable);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(f =>
                f.name.toLowerCase().includes(query) ||
                f.location.toLowerCase().includes(query) ||
                f.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter(f => f.category === selectedCategory);
        }

        // Sorting
        return sortFields(result, sortBy);
    }, [searchQuery, selectedCategory, sortBy, cornFocusMode, deletedFieldIds]);

    if (!currentPlayerId) {
        return <GameAuthScreen />;
    }

    return (
        <GameShell>
            <div className="h-full overflow-y-auto">
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Navigation */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
                        <MarketplaceNav />
                        <p className="text-sm text-muted-foreground">
                            Browse available fields. Compare characteristics. Rent or buy to start farming.
                        </p>
                    </div>

                    {/* Search + Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search fields by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.id} className="bg-[#0a0e1a]">{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={cn(
                                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                                selectedCategory === 'all'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-sm shadow-green-500/10'
                                    : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
                            )}
                        >
                            All Fields
                        </button>
                        {FIELD_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-1.5',
                                    selectedCategory === cat.id
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-sm shadow-green-500/10'
                                        : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
                                )}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-xs text-muted-foreground mb-4">
                        Showing {filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''}
                        {selectedCategory !== 'all' && ` in ${FIELD_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
                    </p>

                    {/* Field Grid */}
                    {filteredFields.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFields.map((field, index) => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    isOwned={player?.ownedFieldIds.includes(field.id) || false}
                                    isRented={player?.rentedFieldIds.includes(field.id) || false}
                                    guideId={index === 0 ? 'game-marketplace-first-field' : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No fields found</h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your filters or search query.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </GameShell>
    );
}
