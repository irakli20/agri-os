'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
    INVENTORY_ITEMS,
    WAREHOUSE_ZONES,
    INVENTORY_ALERTS,
    getInventoryStats,
    getInventoryByCategory,
    type InventoryCategory
} from '@/lib/inventory-data';
import {
    Package,
    AlertTriangle,
    Thermometer,
    Droplets,
    Search,
    Filter,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Box,
    ShoppingCart
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ReorderModal, type ReorderData } from '@/components/modals/ReorderModal';
import { AddInventoryItemModal } from '@/components/modals/AddInventoryItemModal';
import { type InventoryItem } from '@/lib/inventory-data';

const CATEGORY_LABELS: Record<InventoryCategory, string> = {
    chemical: 'Chemicals',
    seed: 'Seeds',
    fertilizer: 'Fertilizers',
    tool: 'Tools',
    spare_part: 'Spare Parts',
    fuel: 'Fuel',
};

const STATUS_COLORS = {
    in_stock: 'text-green-400 bg-green-500/20',
    low_stock: 'text-yellow-400 bg-yellow-500/20',
    out_of_stock: 'text-red-400 bg-red-500/20',
    expiring_soon: 'text-orange-400 bg-orange-500/20',
    expired: 'text-red-500 bg-red-500/20',
};

export default function InventoryPage() {
    const [activeCategory, setActiveCategory] = useState<InventoryCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const stats = getInventoryStats();

    const filteredItems = INVENTORY_ITEMS.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Inventory & Warehouse</h1>
                        <p className="text-muted-foreground mt-1">
                            Track stock levels, warehouse conditions, and procurement
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Items</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 text-green-400" />
                            <span>12 new this month</span>
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                        <div className="text-2xl font-bold text-green-400">
                            ${stats.totalValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Current inventory value
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Low Stock</div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.lowStock}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Items below reorder point
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Critical Alerts</div>
                        <div className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Requires immediate attention
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Inventory List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search and Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                    activeCategory === 'all'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                All Items
                            </button>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveCategory(key as InventoryCategory)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                        activeCategory === key
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-white/5 hover:bg-white/10"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="glass-panel rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search inventory..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-sm w-full"
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Item Name</th>
                                            <th className="px-4 py-3 font-medium">Category</th>
                                            <th className="px-4 py-3 font-medium">Stock Level</th>
                                            <th className="px-4 py-3 font-medium">Location</th>
                                            <th className="px-4 py-3 font-medium">Value</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">{item.sku || item.brand}</div>
                                                </td>
                                                <td className="px-4 py-3 capitalize text-muted-foreground">
                                                    {CATEGORY_LABELS[item.category]}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">
                                                        {item.quantity} <span className="text-muted-foreground text-xs">{item.unit}</span>
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full",
                                                                item.quantity <= item.reorderPoint ? "bg-red-400" : "bg-green-400"
                                                            )}
                                                            style={{ width: `${Math.min(100, (item.quantity / (item.reorderPoint * 3)) * 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {item.location}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    ${item.currentValue.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-xs font-medium uppercase tracking-wider whitespace-nowrap",
                                                        STATUS_COLORS[item.status]
                                                    )}>
                                                        {item.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {(item.status === 'low_stock' || item.status === 'out_of_stock') ? (
                                                        <button
                                                            onClick={() => setReorderItem(item)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-xs font-medium transition-colors"
                                                        >
                                                            <ShoppingCart className="w-3 h-3" />
                                                            Reorder
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setReorderItem(item)}
                                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                            Order More
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Warehouse Zones & Alerts */}
                    <div className="space-y-6">
                        {/* Alerts Section */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                <h3 className="text-lg font-semibold">Active Alerts</h3>
                            </div>
                            <div className="space-y-3">
                                {INVENTORY_ALERTS.map((alert) => (
                                    <div key={alert.id} className={cn(
                                        "p-3 rounded-lg border-l-2",
                                        alert.severity === 'critical' ? "bg-red-500/10 border-red-500" :
                                            alert.severity === 'warning' ? "bg-yellow-500/10 border-yellow-500" :
                                                "bg-blue-500/10 border-blue-500"
                                    )}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm">{alert.item}</span>
                                            <span className="text-[10px] uppercase opacity-70">{alert.type.replace('_', ' ')}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                                        <div className="text-xs font-medium text-primary cursor-pointer hover:underline">
                                            {alert.actionRequired} →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warehouse Zones */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Box className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold">Warehouse Zones</h3>
                            </div>
                            <div className="space-y-4">
                                {WAREHOUSE_ZONES.map((zone) => (
                                    <div key={zone.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium">{zone.name}</span>
                                            <span className="text-muted-foreground">{zone.itemCount} items</span>
                                        </div>

                                        {/* Capacity Bar */}
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(zone.currentUsage / zone.capacity) * 100}%` }}
                                            />
                                        </div>

                                        {/* Zone Stats */}
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{Math.round((zone.currentUsage / zone.capacity) * 100)}% Full</span>
                                            {(zone.temperature || zone.humidity) && (
                                                <div className="flex gap-2">
                                                    {zone.temperature && (
                                                        <span className="flex items-center gap-1">
                                                            <Thermometer className="w-3 h-3" /> {zone.temperature}°F
                                                        </span>
                                                    )}
                                                    {zone.humidity && (
                                                        <span className="flex items-center gap-1">
                                                            <Droplets className="w-3 h-3" /> {zone.humidity}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reorder Modal */}
            {reorderItem && (
                <ReorderModal
                    item={{
                        id: reorderItem.id,
                        name: reorderItem.name,
                        category: reorderItem.category,
                        currentStock: reorderItem.quantity,
                        unit: reorderItem.unit,
                        reorderPoint: reorderItem.reorderPoint,
                        avgPrice: reorderItem.purchasePrice || 0,
                        supplier: reorderItem.supplier || 'AgChem Supply Co.',
                    }}
                    isOpen={!!reorderItem}
                    onClose={() => setReorderItem(null)}
                    onSubmit={(order: ReorderData) => {
                        console.log('Order placed:', order);
                    }}
                />
            )}
            {/* Add Inventory Item Modal */}
            <AddInventoryItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(item) => {
                    console.log('Item added:', item);
                    // In a real app, this would send to API
                }}
            />
        </AppShell>
    );
}
