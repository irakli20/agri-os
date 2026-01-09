'use client';

import { useState } from 'react';
import {
    X,
    Building2,
    Phone,
    Mail,
    MapPin,
    Star,
    CheckCircle,
    DollarSign,
    TrendingUp,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (supplier: any) => void;
}

const SUPPLIER_CATEGORIES = [
    'Seeds & Plants',
    'Fertilizers',
    'Pesticides & Chemicals',
    'Equipment & Machinery',
    'Irrigation Supplies',
    'Fuel & Energy',
    'Packaging Materials',
    'Services',
    'Other'
];

const PAYMENT_TERMS = ['Net 30', 'Net 60', 'Net 90', 'Due on Receipt', 'COD', 'Prepaid'];

export function AddSupplierModal({ isOpen, onClose, onSubmit }: AddSupplierModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        category: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentTerms: 'Net 30',
        taxId: '',
        website: '',
        notes: '',
        rating: 0
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

        onSubmit?.({
            ...formData,
            id: `sup-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'active'
        });
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            companyName: '',
            category: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            paymentTerms: 'Net 30',
            taxId: '',
            website: '',
            notes: '',
            rating: 0
        });
        setIsSuccess(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Supplier Added!' : 'Add New Supplier'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Supplier registered successfully' : 'Register a new supplier or vendor'}
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
                            {['Company Info', 'Contact Details', 'Terms & Review'].map((label, i) => (
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
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Supplier Registered!</h3>
                            <p className="text-muted-foreground mb-6">
                                <span className="text-foreground font-medium">{formData.companyName}</span> has been added to your supplier network.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Company Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company Name *</label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => updateField('companyName', e.target.value)}
                                            placeholder="e.g., AgriSupply Co."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => updateField('category', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select Category</option>
                                            {SUPPLIER_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Website</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => updateField('website', e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tax ID / EIN</label>
                                        <input
                                            type="text"
                                            value={formData.taxId}
                                            onChange={(e) => updateField('taxId', e.target.value)}
                                            placeholder="XX-XXXXXXX"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Details */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Contact Person *</label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => updateField('contactPerson', e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email *</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                placeholder="contact@example.com"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                placeholder="(555) 123-4567"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => updateField('address', e.target.value)}
                                            placeholder="123 Main Street"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">City</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => updateField('city', e.target.value)}
                                                placeholder="City"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">State</label>
                                            <input
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => updateField('state', e.target.value)}
                                                placeholder="ST"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">ZIP</label>
                                            <input
                                                type="text"
                                                value={formData.zipCode}
                                                onChange={(e) => updateField('zipCode', e.target.value)}
                                                placeholder="12345"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Terms & Review */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Payment Terms</label>
                                        <select
                                            value={formData.paymentTerms}
                                            onChange={(e) => updateField('paymentTerms', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            {PAYMENT_TERMS.map(term => (
                                                <option key={term} value={term}>{term}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Initial Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(rating => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => updateField('rating', rating)}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        formData.rating >= rating
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    <Star className={cn(
                                                        "w-6 h-6",
                                                        formData.rating >= rating && "fill-current"
                                                    )} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => updateField('notes', e.target.value)}
                                            rows={3}
                                            placeholder="Additional information about this supplier..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    {/* Review Summary */}
                                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <h3 className="font-semibold border-b border-white/10 pb-2">Supplier Summary</h3>
                                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                                            <div className="text-muted-foreground">Company</div>
                                            <div className="font-medium">{formData.companyName}</div>

                                            <div className="text-muted-foreground">Category</div>
                                            <div className="font-medium">{formData.category}</div>

                                            <div className="text-muted-foreground">Contact</div>
                                            <div className="font-medium">{formData.contactPerson}</div>

                                            <div className="text-muted-foreground">Email</div>
                                            <div className="font-medium text-xs">{formData.email}</div>

                                            <div className="text-muted-foreground">Payment Terms</div>
                                            <div className="font-medium">{formData.paymentTerms}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={
                                (step === 1 && (!formData.companyName || !formData.category)) ||
                                (step === 2 && (!formData.contactPerson || !formData.email || !formData.phone)) ||
                                isSubmitting
                            }
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Saving...' : step === 3 ? 'Add Supplier' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
