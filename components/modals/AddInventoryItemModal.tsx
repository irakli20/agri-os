'use client';

import { useState } from 'react';
import {
    X,
    Package,
    Tag,
    MapPin,
    AlertTriangle,
    DollarSign,
    BarChart3,
    CheckCircle,
    Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddInventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (item: any) => void;
}

const CATEGORIES = [
    { id: 'seeds', label: 'Seeds' },
    { id: 'fertilizers', label: 'Fertilizers' },
    { id: 'chemicals', label: 'Chemicals' },
    { id: 'fuel', label: 'Fuel' },
    { id: 'tools', label: 'Tools & Parts' },
    { id: 'packaging', label: 'Packaging' },
];

const UNITS = ['kg', 'lbs', 'liters', 'gallons', 'units', 'bags', 'boxes'];

const ZONES = ['Zone A (Chemicals)', 'Zone B (Seeds)', 'Zone C (Tools)', 'Zone D (General)', 'Silo 1', 'Silo 2'];

export function AddInventoryItemModal({ isOpen, onClose, onSubmit }: AddInventoryItemModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        quantity: '',
        unit: 'units',
        minStock: '',
        location: '',
        unitPrice: '',
        supplier: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSubmit?.(formData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="modal-shell w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="modal-icon-chip bg-yellow-500/20">
                            <Package className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Item Added!' : 'Add Inventory Item'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Inventory updated successfully' : 'Register new stock in the warehouse'}
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

                {/* Progress Steps */}
                {!isSuccess && (
                    <div className="px-6 pt-4">
                        <div className="flex items-center justify-between">
                            {['Basic Info', 'Stock & Location', 'Review'].map((label, i) => (
                                <div key={label} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                        step > i + 1 ? "bg-green-500 text-white" :
                                            step === i + 1 ? "bg-primary text-primary-foreground" :
                                                "bg-white/10 text-muted-foreground"
                                    )}>
                                        {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "ml-2 text-sm hidden sm:block",
                                        step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"
                                    )}>
                                        {label}
                                    </span>
                                    {i < 2 && (
                                        <div className={cn(
                                            "w-16 h-0.5 mx-3",
                                            step > i + 1 ? "bg-green-500" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="modal-content">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Item Registered Successfully</h3>
                            <p className="text-muted-foreground mb-6">
                                {formData.name} has been added to {formData.location}.
                            </p>

                            <div className="bg-white/5 rounded-xl p-6 max-w-sm mx-auto mb-6 text-left space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">SKU</span>
                                    <span className="font-mono">{formData.sku || 'AUTO-GEN'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Initial Stock</span>
                                    <span className="font-medium">{formData.quantity} {formData.unit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Value</span>
                                    <span className="font-medium text-green-400">
                                        ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setFormData({
                                            name: '', sku: '', category: '', quantity: '', unit: 'units',
                                            minStock: '', location: '', unitPrice: '', supplier: '', description: ''
                                        });
                                        setIsSuccess(false);
                                    }}
                                    className="btn-modal-secondary"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={onClose}
                                    className="btn-modal-primary"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Item Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="e.g., Roundup PowerMAX 3"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => updateField('category', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select Category</option>
                                                {CATEGORIES.map(c => (
                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">SKU (Optional)</label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => updateField('sku', e.target.value)}
                                                placeholder="Auto-generated if empty"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Product Image</label>
                                        <div className="border-2 border-dashed border-white/20 hover:border-primary/50 rounded-xl p-6 text-center transition-colors cursor-pointer">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                            <div className="text-sm text-muted-foreground">
                                                Click to upload image
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Stock & Location */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Initial Quantity *</label>
                                            <input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => updateField('quantity', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Unit *</label>
                                            <select
                                                value={formData.unit}
                                                onChange={(e) => updateField('unit', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                {UNITS.map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <AlertTriangle className="w-4 h-4 inline mr-2" />
                                                Low Stock Alert
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.minStock}
                                                onChange={(e) => updateField('minStock', e.target.value)}
                                                placeholder="Min quantity"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <DollarSign className="w-4 h-4 inline mr-2" />
                                                Unit Price
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.unitPrice}
                                                onChange={(e) => updateField('unitPrice', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Storage Location *
                                        </label>
                                        <select
                                            value={formData.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select Zone/Silo</option>
                                            {ZONES.map(z => (
                                                <option key={z} value={z}>{z}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                        <h3 className="font-semibold border-b border-white/10 pb-2">Item Summary</h3>
                                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                                            <div className="text-muted-foreground">Name</div>
                                            <div className="font-medium">{formData.name}</div>

                                            <div className="text-muted-foreground">Category</div>
                                            <div className="font-medium capitalize">{formData.category}</div>

                                            <div className="text-muted-foreground">Initial Stock</div>
                                            <div className="font-medium">{formData.quantity} {formData.unit}</div>

                                            <div className="text-muted-foreground">Location</div>
                                            <div className="font-medium">{formData.location}</div>

                                            <div className="text-muted-foreground">Total Value</div>
                                            <div className="font-medium text-green-400">
                                                ${(parseFloat(formData.quantity || '0') * parseFloat(formData.unitPrice || '0')).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                        <BarChart3 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <div className="font-medium text-blue-400 mb-1">Inventory Tracking</div>
                                            <p className="text-muted-foreground">
                                                This item will be automatically tracked. You&apos;ll receive alerts when stock drops below {formData.minStock || '0'} {formData.unit}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="modal-footer !justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="btn-modal-secondary"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={
                                (step === 1 && (!formData.name || !formData.category)) ||
                                (step === 2 && (!formData.quantity || !formData.location)) ||
                                isSubmitting
                            }
                            className={cn(
                                "btn-modal-primary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "min-w-[140px]"
                            )}
                        >
                            {isSubmitting ? 'Adding...' : step === 3 ? 'Add Item' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
