'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ALL_EQUIPMENT, getEquipmentStats, getEquipmentByCategory, getMaintenanceDue, type EquipmentCategory } from '@/lib/equipment-data';
import { Plane, Tractor, Droplets, Wrench, AlertTriangle, DollarSign, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MaintenanceModal, type MaintenanceSchedule } from '@/components/modals/MaintenanceModal';
import { AddEquipmentModal, type EquipmentData } from '@/components/modals/AddEquipmentModal';
import { type Equipment } from '@/lib/equipment-data';

const CATEGORY_ICONS = {
    drone: Plane,
    machinery: Tractor,
    irrigation: Droplets,
    tool: Wrench,
    chemical: DollarSign,
    seed: TrendingUp,
};

const CATEGORY_LABELS = {
    drone: 'Drones',
    machinery: 'Machinery',
    irrigation: 'Irrigation',
    tool: 'Tools',
    chemical: 'Chemicals',
    seed: 'Seeds',
};

const STATUS_COLORS = {
    available: 'text-green-400 bg-green-500/20',
    'in-use': 'text-blue-400 bg-blue-500/20',
    maintenance: 'text-yellow-400 bg-yellow-500/20',
    retired: 'text-gray-400 bg-gray-500/20',
};

export default function EquipmentPage() {
    const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const stats = getEquipmentStats();
    const maintenanceDue = getMaintenanceDue();

    const filteredEquipment = activeCategory === 'all'
        ? ALL_EQUIPMENT
        : getEquipmentByCategory(activeCategory);

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Equipment & Assets</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage all farm equipment, machinery, and tools
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        + Add Equipment
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Equipment</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {stats.available} available
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">In Use</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.inUse}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {stats.utilizationRate}% utilization
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                        <div className="text-2xl font-bold text-green-400">
                            ${(stats.totalValue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Current market value
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Maintenance Due</div>
                        <div className="text-2xl font-bold text-yellow-400">{maintenanceDue.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Within 30 days
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
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
                        All Equipment
                    </button>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                        const Icon = CATEGORY_ICONS[key as EquipmentCategory];
                        const count = getEquipmentByCategory(key as EquipmentCategory).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key as EquipmentCategory)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                                    activeCategory === key
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEquipment.map((equipment) => {
                        const Icon = CATEGORY_ICONS[equipment.category];
                        const lastMaintenance = equipment.maintenanceSchedule[equipment.maintenanceSchedule.length - 1];

                        return (
                            <div
                                key={equipment.id}
                                className="glass-panel rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{equipment.name}</h3>
                                            {equipment.model && (
                                                <p className="text-sm text-muted-foreground">{equipment.model}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs font-medium uppercase tracking-wider",
                                        STATUS_COLORS[equipment.status]
                                    )}>
                                        {equipment.status}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium">{equipment.location}</span>
                                    </div>
                                    {equipment.assignedTo && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Assigned to:</span>
                                            <span className="font-medium">{equipment.assignedTo}</span>
                                        </div>
                                    )}
                                    {equipment.usageHours !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Usage Hours:</span>
                                            <span className="font-medium">{equipment.usageHours.toLocaleString()}h</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Value:</span>
                                        <span className="font-medium text-green-400">
                                            ${equipment.currentValue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Maintenance Info */}
                                {lastMaintenance && (
                                    <div className="pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Wrench className="w-3 h-3" />
                                            <span>
                                                Last: {new Date(lastMaintenance.date).toLocaleDateString()}
                                            </span>
                                            {lastMaintenance.nextDue && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        Next: {new Date(lastMaintenance.nextDue).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Specifications Preview */}
                                {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <div className="text-xs text-muted-foreground mb-2">Key Specs:</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {Object.entries(equipment.specifications).slice(0, 2).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="text-muted-foreground">{key}</div>
                                                    <div className="font-medium">{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        View Details
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEquipment(equipment);
                                        }}
                                        className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Wrench className="w-4 h-4" />
                                        Maintenance
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Maintenance Alerts */}
                {maintenanceDue.length > 0 && (
                    <div className="glass-panel rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-semibold">Upcoming Maintenance</h3>
                        </div>
                        <div className="space-y-3">
                            {maintenanceDue.slice(0, 5).map((equipment) => {
                                const lastMaintenance = equipment.maintenanceSchedule[equipment.maintenanceSchedule.length - 1];
                                const daysUntilDue = lastMaintenance?.nextDue
                                    ? Math.floor((new Date(lastMaintenance.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                    : 0;

                                return (
                                    <div key={equipment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                            <div>
                                                <div className="font-medium">{equipment.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {lastMaintenance?.type} maintenance
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right mr-2">
                                                <div className={cn(
                                                    "text-sm font-medium",
                                                    daysUntilDue <= 7 ? "text-red-400" : "text-yellow-400"
                                                )}>
                                                    {daysUntilDue} days
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {lastMaintenance?.nextDue && new Date(lastMaintenance.nextDue).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedEquipment(equipment)}
                                                className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Schedule
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Maintenance Modal */}
            {selectedEquipment && (
                <MaintenanceModal
                    equipment={{
                        id: selectedEquipment.id,
                        name: selectedEquipment.name,
                        type: selectedEquipment.category,
                        hoursUsed: selectedEquipment.usageHours || 0,
                        status: selectedEquipment.status,
                    }}
                    isOpen={!!selectedEquipment}
                    onClose={() => setSelectedEquipment(null)}
                    onSchedule={(schedule: MaintenanceSchedule) => {
                        console.log('Maintenance scheduled:', schedule);
                    }}
                />
            )}
            {/* Add Equipment Modal */}
            <AddEquipmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(data: EquipmentData) => {
                    console.log('Equipment added:', data);
                    // In a real app, this would send to API and refresh list
                }}
            />
        </AppShell>
    );
}
