'use client';

import React, { useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { MarketplaceNav } from '@/components/game/MarketplaceNav';
import { useSuppliesStore, getCategoryDisplayName, getCategoryIcon } from '@/lib/supplies-store';
import { useGameStore } from '@/lib/game-store';
import { DollarSign, Package, ShoppingCart, Info, CheckCircle2, ChevronRight, AlertCircle, Sprout, Tractor, Warehouse, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CATEGORIES = ['all', 'seeds', 'fertilizer', 'pesticide', 'fuel', 'equipment'] as const;
type CategoryTab = typeof CATEGORIES[number];

const SEED_IMAGES = [
    '/marketplace/seeds/pioneer-tote.png',
    '/marketplace/seeds/seed-bigbag.png',
    '/marketplace/seeds/pioneer-pallet.png',
];

function SeedProductShowcase({
    seedProducts,
    selectedSeedId,
    setSelectedSeedId,
    inventory,
}: {
    seedProducts: any[];
    selectedSeedId: string;
    setSelectedSeedId: (id: string) => void;
    inventory: any[];
}) {
    if (seedProducts.length === 0) return null;

    const selectedSeed = seedProducts.find((product) => product.id === selectedSeedId) || seedProducts[0];
    const selectedStock = selectedSeed.stockQuantity * (selectedSeed.unit === 'kg' ? 25 : 1);
    const ownedSeed = inventory.find((item) => item.id === selectedSeed.id);

    return (
        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#202321] shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-white/15 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
                        <Tractor className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-light uppercase tracking-[0.16em] text-white">Seeds</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Seed stock for corn planters and row-crop sowing machines.</p>
                    </div>
                </div>
                <div className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white">
                    Seed SKUs: <span className="text-lime-400">{seedProducts.length}</span>
                </div>
            </div>

            <div className="overflow-x-auto px-5 py-7">
                <div className="grid min-w-[860px] grid-cols-3 gap-5 lg:grid-cols-4">
                    {seedProducts.map((seed, index) => {
                        const isSelected = seed.id === selectedSeed.id;
                        const ownedItem = inventory.find((item) => item.id === seed.id);
                        const seedImage = SEED_IMAGES[index % SEED_IMAGES.length];

                        return (
                            <button
                                key={seed.id}
                                onClick={() => setSelectedSeedId(seed.id)}
                                className={cn(
                                    "group relative overflow-hidden rounded-2xl border bg-[#262927] text-left shadow-xl transition-all",
                                    isSelected ? "border-lime-400 shadow-lime-500/10" : "border-white/10 hover:border-white/25"
                                )}
                            >
                                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_56%)]">
                                    <Image
                                        src={seedImage}
                                        alt={seed.name}
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#262927] to-transparent" />
                                    {seed.isCornRelated && (
                                        <span className="absolute left-4 top-4 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300 ring-1 ring-yellow-500/30">
                                            Corn Focus
                                        </span>
                                    )}
                                    {ownedItem && (
                                        <span className="absolute right-4 top-4 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 ring-1 ring-blue-500/30">
                                            {ownedItem.quantity} owned
                                        </span>
                                    )}
                                </div>
                                <div className={cn("space-y-3 border-t border-white/10 p-5", isSelected && "bg-lime-500 text-black")}>
                                    <div className="text-center">
                                        <div className={cn("text-xs font-bold uppercase tracking-[0.16em]", isSelected ? "text-black/55" : "text-lime-400")}>Seeds</div>
                                        <div className="mt-2 min-h-[44px] text-lg font-bold">{seed.name.replace('Corn Seeds - ', '').replace('Bayer Corn Seed - ', '')}</div>
                                    </div>
                                    <div className="text-center text-3xl font-light">${seed.price.toLocaleString()}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-6 border-t border-white/15 px-5 py-7 lg:grid-cols-[minmax(260px,0.9fr)_1.4fr]">
                <div>
                    <h3 className="text-3xl font-bold uppercase tracking-wide">{selectedSeed.name}</h3>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {selectedSeed.description}. Seeds are used to refill sowing machines and support the corn-focused planting pass.
                    </p>
                </div>
                <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                            <Warehouse className="h-7 w-7 text-white/85" />
                            <div>
                                <div className="text-xs text-muted-foreground">Owned</div>
                                <div className="font-semibold">{ownedSeed?.quantity || 0} {selectedSeed.unit}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                            <KeyRound className="h-7 w-7 text-white/85" />
                            <div>
                                <div className="text-xs text-muted-foreground">Reserved</div>
                                <div className="font-semibold">0 {selectedSeed.unit}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                            <Package className="h-7 w-7 text-white/85" />
                            <div>
                                <div className="text-xs text-muted-foreground">Stock Capacity</div>
                                <div className="font-semibold">{selectedStock.toLocaleString()} l</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 border-y border-white/10 py-5 md:grid-cols-2">
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                <Sprout className="h-4 w-4 text-lime-400" />
                                Seed Specs
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(selectedSeed.specifications).map(([key, value]) => (
                                    <span key={key} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                                        {key}: {String(value)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                <Tractor className="h-4 w-4 text-lime-400" />
                                Compatible Operations
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Planters', 'Seeders', 'Corn Focus', 'Precision rows'].map((item) => (
                                    <span key={item} className="rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-sm text-lime-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function SuppliesMarketplacePage() {
    const { products } = useSuppliesStore();
    const { buySupplies, getCurrentPlayer, inventory } = useGameStore();
    const player = getCurrentPlayer();

    const [activeTab, setActiveTab] = useState<CategoryTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [purchaseState, setPurchaseState] = useState<{ id: string, status: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ id: '', status: 'idle' });
    const [purchaseQuantities, setPurchaseQuantities] = useState<Record<string, number>>({});
    const seedProducts = products.filter(product => product.category === 'seeds');
    const [selectedSeedId, setSelectedSeedId] = useState(seedProducts.find(product => product.isCornRelated)?.id || seedProducts[0]?.id || '');

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeTab === 'all' || product.category === activeTab;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleQuantityChange = (productId: string, value: string) => {
        const qty = parseInt(value, 10);
        if (!isNaN(qty) && qty > 0) {
            setPurchaseQuantities(prev => ({ ...prev, [productId]: qty }));
        } else if (value === '') {
            setPurchaseQuantities(prev => {
                const updated = { ...prev };
                delete updated[productId];
                return updated;
            });
        }
    };

    const handlePurchase = async (product: any) => {
        if (!player) return;

        const productId = product.id;
        const price = product.price;
        const quantity = purchaseQuantities[productId] || 1;

        setPurchaseState({ id: productId, status: 'loading' });

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 600));

        const inventoryItem = {
            id: productId,
            name: product.name,
            category: product.category === 'seeds' ? 'seed' :
                product.category === 'fertilizer' ? 'fertilizer' :
                    product.category === 'pesticide' ? 'chemical' :
                        product.category === 'fuel' ? 'fuel' : 'tool',
            quantity: quantity,
            unit: product.unit,
            purchasePrice: price,
            currentValue: price * quantity,
            status: 'in_stock',
            location: 'Main Barn'
        } as any;

        const result = buySupplies(inventoryItem, price * quantity);

        if (result.success) {
            setPurchaseState({ id: productId, status: 'success' });
            setTimeout(() => {
                setPurchaseState({ id: '', status: 'idle' });
                // Reset quantity after purchase
                setPurchaseQuantities(prev => {
                    const updated = { ...prev };
                    delete updated[productId];
                    return updated;
                });
            }, 3000);
        } else {
            setPurchaseState({ id: productId, status: 'error', message: result.error });
            setTimeout(() => {
                setPurchaseState({ id: '', status: 'idle' });
            }, 4000);
        }
    };

    return (
        <GameShell>
            <div className="h-full overflow-y-auto w-full">
                {/* Hero Section */}
                <div className="relative border-b border-white/10 bg-black overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/10 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />

                    <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                            <div className="max-w-xl">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Farm Supplies</h1>
                                <p className="text-muted-foreground text-lg">
                                    Purchase seeds, fertilizers, chemicals, and essential supplies for your farming operations.
                                </p>
                            </div>

                            {/* Player Balance Card */}
                            {player && (
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[200px] flex items-center justify-between shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Available Funds</p>
                                            <p className="text-xl font-bold">${player.balance.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <MarketplaceNav />
                    </div>
                </div>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {(activeTab === 'all' || activeTab === 'seeds') && (
                        <SeedProductShowcase
                            seedProducts={seedProducts}
                            selectedSeedId={selectedSeedId}
                            setSelectedSeedId={setSelectedSeedId}
                            inventory={inventory}
                        />
                    )}

                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-xl">
                        {/* Tabs */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-1 w-full md:w-auto">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveTab(category)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                                        activeTab === category
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {category !== 'all' && <span>{getCategoryIcon(category as any)}</span>}
                                    {category === 'all' ? 'All Supplies' : getCategoryDisplayName(category as any)}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                                {/* Search Icon placeholder */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-2xl">
                            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No supplies found</h3>
                            <p className="text-muted-foreground">Try adjusting your category filter or search query.</p>
                            <button
                                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                                className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => {
                                const isPurchasingThis = purchaseState.id === product.id;
                                const currentQty = purchaseQuantities[product.id] || 1;
                                const totalCost = product.price * currentQty;
                                const canAfford = player && player.balance >= totalCost;

                                return (
                                    <div key={product.id} className="group flex flex-col bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                        {/* Product Image Area */}
                                        <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/10 relative p-6 flex flex-col justify-center items-center">
                                            <div className="absolute top-3 right-3">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md",
                                                    product.category === 'seeds' ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                                                        product.category === 'fertilizer' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                                            product.category === 'pesticide' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                                                                product.category === 'fuel' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                                                    "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                )}>
                                                    {product.category}
                                                </span>
                                            </div>

                                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                                                {getCategoryIcon(product.category as any)}
                                            </div>

                                            {(() => {
                                                const ownedItem = inventory.find(i => i.id === product.id);
                                                const ownedQty = ownedItem ? ownedItem.quantity : 0;
                                                return ownedQty > 0 ? (
                                                    <div className="absolute top-3 left-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                                                        📦 {ownedQty} {product.unit.split(' ')[0]}s Owned
                                                    </div>
                                                ) : null;
                                            })()}

                                            {product.isCornRelated && (
                                                <div className="absolute bottom-3 left-3 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                                                    🌽 Corn Focus
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="mb-1 flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-lg leading-tight line-clamp-2">{product.name}</h3>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                                {product.description}
                                            </p>

                                            {/* Specifications Mini-list */}
                                            <div className="mb-5 space-y-1.5 bg-black/30 rounded-lg p-3 border border-white/5">
                                                {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                                                        <span className="font-medium">{value}</span>
                                                    </div>
                                                ))}
                                                {Object.keys(product.specifications).length > 2 && (
                                                    <div className="text-[10px] text-primary/70 text-right mt-1 cursor-pointer hover:text-primary">
                                                        +{Object.keys(product.specifications).length - 2} more specs
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Buy Section */}
                                            <div className="pt-4 border-t border-white/10 mt-auto">
                                                <div className="flex justify-between items-baseline mb-3">
                                                    <span className="text-sm text-muted-foreground">Price</span>
                                                    <div className="text-right">
                                                        <span className="font-bold tracking-tight">${product.price.toLocaleString()}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={product.stockQuantity}
                                                        value={currentQty}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        className="w-16 bg-black/50 border border-white/10 rounded-md py-1.5 px-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    />
                                                    <div className="text-xs text-muted-foreground flex-1 text-right">
                                                        Total: <span className="font-medium text-white">${totalCost.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handlePurchase(product)}
                                                    disabled={isPurchasingThis && purchaseState.status === 'loading' || !canAfford}
                                                    className={cn(
                                                        "w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                                                        isPurchasingThis && purchaseState.status === 'success'
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                                            : isPurchasingThis && purchaseState.status === 'error'
                                                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                                                : !canAfford
                                                                    ? "bg-black text-muted-foreground border border-white/10 cursor-not-allowed"
                                                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    )}
                                                >
                                                    {isPurchasingThis && purchaseState.status === 'loading' ? (
                                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                    ) : isPurchasingThis && purchaseState.status === 'success' ? (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4" /> Purchased!
                                                        </>
                                                    ) : isPurchasingThis && purchaseState.status === 'error' ? (
                                                        <><AlertCircle className="w-4 h-4" /> Failed</>
                                                    ) : !canAfford ? (
                                                        'Insufficient Funds'
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="w-4 h-4" /> Buy Now
                                                        </>
                                                    )}
                                                </button>

                                                {/* Error Message Tooltip-style */}
                                                {isPurchasingThis && purchaseState.status === 'error' && purchaseState.message && (
                                                    <div className="mt-2 text-[10px] text-red-400 text-center">
                                                        {purchaseState.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </GameShell>
    );
}
