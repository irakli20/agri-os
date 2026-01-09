'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
    ACTIVE_DEALS,
    SUPPLIERS,
    PRICE_QUOTES,
    getBestPrice,
    getSupplier
} from '@/lib/procurement-data';
import { INVENTORY_ITEMS } from '@/lib/inventory-data';
import {
    ShoppingBag,
    TrendingDown,
    Truck,
    DollarSign,
    AlertCircle,
    Search,
    ArrowRight,
    Star,
    Clock,
    Package
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProcurementOrderModal } from '@/components/modals/ProcurementOrderModal';
import { AddSupplierModal } from '@/components/modals/AddSupplierModal';

export default function ProcurementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

    // Calculate potential savings
    const totalPotentialSavings = ACTIVE_DEALS.reduce((sum, deal) => sum + (deal.savings * 100), 0); // Mock volume

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Procurement & Sourcing</h1>
                        <p className="text-muted-foreground mt-1">
                            AI-powered price scouting and automated purchasing
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAddSupplierOpen(true)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Add Supplier
                        </button>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            Order History
                        </button>
                        <button
                            onClick={() => setIsOrderModalOpen(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Create Order
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Active Deals</div>
                        <div className="text-2xl font-bold">{ACTIVE_DEALS.length}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3 text-green-400" />
                            <span>Avg 18% savings</span>
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Potential Savings</div>
                        <div className="text-2xl font-bold text-green-400">
                            ${totalPotentialSavings.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            If acted on today
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Active Suppliers</div>
                        <div className="text-2xl font-bold text-blue-400">{SUPPLIERS.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            96% reliability score
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Pending Orders</div>
                        <div className="text-2xl font-bold text-yellow-400">3</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Arriving this week
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content: Price Scouting */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Deal Finder */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                <h3 className="text-lg font-semibold">Smart Deal Finder</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ACTIVE_DEALS.map((deal) => (
                                    <div key={deal.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-primary/50 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                                                    deal.type === 'flash_sale' ? "bg-red-500/20 text-red-400" :
                                                        deal.type === 'clearance' ? "bg-yellow-500/20 text-yellow-400" :
                                                            "bg-blue-500/20 text-blue-400"
                                                )}>
                                                    {deal.type.replace('_', ' ')}
                                                </span>
                                                {deal.urgency === 'high' && (
                                                    <span className="flex items-center gap-1 text-xs text-red-400 animate-pulse">
                                                        <Clock className="w-3 h-3" /> Expires Soon
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-green-400 font-bold">
                                                {deal.savingsPercent}% OFF
                                            </div>
                                        </div>

                                        <h4 className="font-medium mb-1">{deal.productName}</h4>
                                        <div className="text-sm text-muted-foreground mb-3">
                                            Sold by {deal.supplierName}
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <div className="text-xs text-muted-foreground line-through">
                                                    ${deal.normalPrice.toFixed(2)}
                                                </div>
                                                <div className="text-xl font-bold text-white">
                                                    ${deal.dealPrice.toFixed(2)}
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100">
                                                View Deal
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Comparison Tool */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Search className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-lg font-semibold">Price Comparison</h3>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Example Comparison Item */}
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Glyphosate 41% Herbicide</div>
                                                <div className="text-xs text-muted-foreground">3 suppliers found</div>
                                            </div>
                                        </div>
                                        <button className="text-xs text-primary hover:underline">View Analysis →</button>
                                    </div>

                                    <div className="space-y-2">
                                        {PRICE_QUOTES.filter(q => q.productId === 'inv-chem-1').map((quote) => {
                                            const supplier = getSupplier(quote.supplierId);
                                            const isBestPrice = quote.price === 75.00; // Hardcoded for demo logic

                                            return (
                                                <div key={quote.id} className={cn(
                                                    "flex items-center justify-between p-2 rounded text-sm",
                                                    isBestPrice ? "bg-green-500/10 border border-green-500/20" : "bg-black/20"
                                                )}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-32 truncate font-medium">{supplier?.name}</div>
                                                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            {supplier?.rating}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {quote.deliveryDays} day delivery
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {isBestPrice && (
                                                            <span className="text-[10px] bg-green-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">
                                                                Best Price
                                                            </span>
                                                        )}
                                                        <div className="font-bold">
                                                            ${quote.price.toFixed(2)}
                                                            <span className="text-xs text-muted-foreground font-normal">/{quote.unit}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Recommendations & Suppliers */}
                    <div className="space-y-6">
                        {/* AI Recommendations */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                    <div className="text-sm font-medium text-purple-300 mb-1">Bulk Buy Opportunity</div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Usage analysis suggests you'll need 120 gal of Glyphosate next month. Buying now in bulk saves $450.
                                    </p>
                                    <button className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded transition-colors">
                                        Review Order
                                    </button>
                                </div>

                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="text-sm font-medium text-blue-300 mb-1">Supplier Switch</div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Valley Fuel Co. has dropped diesel prices by $0.15/gal. Consider switching for next refill.
                                    </p>
                                    <button className="w-full py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs rounded transition-colors">
                                        Compare Prices
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Top Suppliers */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold">Top Suppliers</h3>
                            </div>
                            <div className="space-y-3">
                                {SUPPLIERS.slice(0, 3).map((supplier) => (
                                    <div key={supplier.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors cursor-pointer">
                                        <div>
                                            <div className="font-medium text-sm">{supplier.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className="flex items-center gap-0.5 text-yellow-400">
                                                    <Star className="w-3 h-3 fill-current" /> {supplier.rating}
                                                </span>
                                                <span>•</span>
                                                <span>{supplier.deliverySpeed} delivery</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                View All Suppliers
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Procurement Order Modal */}
            <ProcurementOrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                onSubmit={(order) => {
                    console.log('Order created:', order);
                    // In a real app, this would send to API
                }}
            />

            {/* Add Supplier Modal */}
            <AddSupplierModal
                isOpen={isAddSupplierOpen}
                onClose={() => setIsAddSupplierOpen(false)}
                onSubmit={(supplier) => {
                    console.log('Supplier added:', supplier);
                    // In a real app, this would send to API
                }}
            />
        </AppShell>
    );
}
