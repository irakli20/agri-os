'use client';

import { useState } from 'react';
import {
    X,
    ShoppingCart,
    Building,
    Calendar,
    DollarSign,
    Plus,
    Trash2,
    FileText,
    CheckCircle,
    Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    unit: string;
}

interface ProcurementOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (order: any) => void;
}

const MOCK_SUPPLIERS = [
    { id: 'sup-1', name: 'AgChem Supply Co.', terms: 'Net 30' },
    { id: 'sup-2', name: 'Farm Equipment Direct', terms: 'Due on Receipt' },
    { id: 'sup-3', name: 'Valley Agricultural Supply', terms: 'Net 60' },
    { id: 'sup-4', name: 'Green Earth Seeds', terms: 'Net 30' },
];

export function ProcurementOrderModal({ isOpen, onClose, onSubmit }: ProcurementOrderModalProps) {
    const [supplier, setSupplier] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [items, setItems] = useState<OrderItem[]>([
        { id: '1', description: '', quantity: 1, unitPrice: 0, unit: 'units' }
    ]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleAddItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, unit: 'units' }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof OrderItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const orderData = {
            supplier,
            deliveryDate,
            items,
            totalAmount: calculateTotal(),
            notes,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        onSubmit?.(orderData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Purchase Order Created!' : 'New Purchase Order'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Order has been sent to supplier' : 'Create a new procurement request'}
                            </p>
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
                            <h3 className="text-lg font-semibold mb-2">Order Submitted Successfully</h3>
                            <p className="text-muted-foreground mb-6">
                                Purchase Order #PO-{Date.now().toString().slice(-6)} has been created and sent to {MOCK_SUPPLIERS.find(s => s.id === supplier)?.name}.
                            </p>

                            <div className="bg-white/5 rounded-xl p-6 max-w-md mx-auto mb-6">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold text-green-400">${calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Supplier</span>
                                        <span className="font-medium">{MOCK_SUPPLIERS.find(s => s.id === supplier)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Date</span>
                                        <span className="font-medium">{deliveryDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items</span>
                                        <span className="font-medium">{items.length} items</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Building className="w-4 h-4 inline mr-2" />
                                        Supplier
                                    </label>
                                    <select
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Supplier...</option>
                                        {MOCK_SUPPLIERS.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Expected Delivery
                                    </label>
                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium">Order Items</label>
                                    <button
                                        onClick={handleAddItem}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={item.id} className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Item description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="text"
                                                    placeholder="Unit"
                                                    value={item.unit}
                                                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="w-32 relative">
                                                <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                                    className="w-full pl-6 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={items.length === 1}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary & Notes */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Delivery instructions or special requirements..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 h-fit">
                                    <h3 className="font-semibold mb-3 text-sm">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Subtotal</span>
                                            <span>${calculateTotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Tax (est.)</span>
                                            <span>${(calculateTotal() * 0.08).toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-green-400">${(calculateTotal() * 1.08).toLocaleString()}</span>
                                        </div>
                                    </div>
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
                            disabled={!supplier || !deliveryDate || calculateTotal() === 0 || isSubmitting}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            <Truck className="w-4 h-4" />
                            {isSubmitting ? 'Creating Order...' : 'Create Purchase Order'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
