'use client';

import { useState } from 'react';
import {
    X,
    Package,
    ShoppingCart,
    Truck,
    Clock,
    CheckCircle,
    AlertTriangle,
    Plus,
    Minus,
    Building,
    DollarSign,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    currentStock: number;
    unit: string;
    reorderPoint: number;
    avgPrice: number;
    supplier: string;
}

interface ReorderModalProps {
    item: InventoryItem;
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (order: ReorderData) => void;
}

export interface ReorderData {
    itemId: string;
    quantity: number;
    supplier: string;
    urgency: 'standard' | 'express' | 'urgent';
    deliveryDate: string;
    notes: string;
    totalCost: number;
}

const URGENCY_OPTIONS = [
    { id: 'standard', label: 'Standard', days: '5-7 days', multiplier: 1, color: 'text-gray-400' },
    { id: 'express', label: 'Express', days: '2-3 days', multiplier: 1.25, color: 'text-blue-400' },
    { id: 'urgent', label: 'Urgent', days: 'Next Day', multiplier: 1.5, color: 'text-red-400' },
];

const MOCK_SUPPLIERS = [
    { id: 'sup-1', name: 'AgChem Supply Co.', rating: 4.8, deliveryDays: 3 },
    { id: 'sup-2', name: 'Farm Equipment Direct', rating: 4.6, deliveryDays: 5 },
    { id: 'sup-3', name: 'Valley Agricultural Supply', rating: 4.9, deliveryDays: 4 },
];

export function ReorderModal({ item, isOpen, onClose, onSubmit }: ReorderModalProps) {
    const [quantity, setQuantity] = useState(Math.max(item.reorderPoint * 2 - item.currentStock, 10));
    const [selectedSupplier, setSelectedSupplier] = useState(MOCK_SUPPLIERS[0].id);
    const [urgency, setUrgency] = useState<'standard' | 'express' | 'urgent'>('standard');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const urgencyConfig = URGENCY_OPTIONS.find(u => u.id === urgency)!;
    const unitCost = item.avgPrice * urgencyConfig.multiplier;
    const totalCost = quantity * unitCost;

    const selectedSupplierData = MOCK_SUPPLIERS.find(s => s.id === selectedSupplier)!;
    const estimatedDelivery = new Date();
    const deliveryDays = urgency === 'urgent' ? 1 : urgency === 'express' ? 3 : selectedSupplierData.deliveryDays;
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const orderData: ReorderData = {
            itemId: item.id,
            quantity,
            supplier: selectedSupplier,
            urgency,
            deliveryDate: estimatedDelivery.toISOString(),
            notes,
            totalCost,
        };

        onSubmit?.(orderData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const adjustQuantity = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Order Placed!' : 'Reorder Item'}
                            </h2>
                            <p className="text-sm text-muted-foreground">{item.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Order Submitted!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your order for {quantity} {item.unit} of {item.name} has been placed.
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 text-left mb-6">
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order #</span>
                                        <span className="font-mono">PO-{Date.now().toString(36).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Supplier</span>
                                        <span>{selectedSupplierData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Est. Delivery</span>
                                        <span>{estimatedDelivery.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/10 pt-2">
                                        <span className="font-medium">Total</span>
                                        <span className="text-green-400 font-bold">${totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Stock Status */}
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-yellow-400">Low Stock Alert</div>
                                    <div className="text-sm text-muted-foreground">
                                        Current: <span className="text-foreground font-medium">{item.currentStock} {item.unit}</span>
                                        {' '}• Reorder Point: <span className="text-foreground font-medium">{item.reorderPoint} {item.unit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Order Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => adjustQuantity(-10)}
                                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                            className="w-full text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <div className="text-center text-sm text-muted-foreground mt-1">
                                            {item.unit}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => adjustQuantity(10)}
                                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Supplier Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    <Building className="w-4 h-4 inline mr-2" />
                                    Select Supplier
                                </label>
                                <div className="space-y-2">
                                    {MOCK_SUPPLIERS.map((supplier) => (
                                        <button
                                            key={supplier.id}
                                            onClick={() => setSelectedSupplier(supplier.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                                                selectedSupplier === supplier.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            <div>
                                                <div className="font-medium">{supplier.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Delivery: {supplier.deliveryDays} days
                                                </div>
                                            </div>
                                            <div className="text-yellow-400 text-sm">
                                                ★ {supplier.rating}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Urgency Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    <Truck className="w-4 h-4 inline mr-2" />
                                    Shipping Speed
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {URGENCY_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setUrgency(opt.id as any)}
                                            className={cn(
                                                "p-3 rounded-xl border text-center transition-all",
                                                urgency === opt.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            <div className={cn("font-medium", opt.color)}>{opt.label}</div>
                                            <div className="text-xs text-muted-foreground">{opt.days}</div>
                                            {opt.multiplier > 1 && (
                                                <div className="text-xs text-yellow-400 mt-1">
                                                    +{((opt.multiplier - 1) * 100).toFixed(0)}%
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Special instructions for this order..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Order Summary */}
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-muted-foreground">Unit Price</span>
                                    <span>${item.avgPrice.toFixed(2)}/{item.unit}</span>
                                </div>
                                {urgencyConfig.multiplier > 1 && (
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-muted-foreground">{urgencyConfig.label} Fee</span>
                                        <span className="text-yellow-400">+{((urgencyConfig.multiplier - 1) * 100).toFixed(0)}%</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-muted-foreground">Est. Delivery</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {estimatedDelivery.toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="text-2xl font-bold text-green-400">${totalCost.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || quantity < 1}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
