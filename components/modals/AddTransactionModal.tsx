'use client';

import { useState } from 'react';
import {
    X,
    DollarSign,
    Calendar,
    CreditCard,
    FileText,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (transaction: any) => void;
    type?: 'income' | 'expense';
}

const CATEGORIES = {
    income: ['Crop Sales', 'Service Revenue', 'Government Grant', 'Insurance Claim', 'Other Income'],
    expense: ['Seeds & Plants', 'Fertilizer & Chemicals', 'Labor', 'Fuel', 'Equipment Maintenance', 'Utilities', 'Rent', 'Insurance', 'Other Expense'],
};

export function AddTransactionModal({ isOpen, onClose, onSubmit, type = 'expense' }: AddTransactionModalProps) {
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>(type);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [reference, setReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const transactionData = {
            type: transactionType,
            amount: parseFloat(amount),
            date,
            category,
            description,
            paymentMethod,
            reference,
        };

        onSubmit?.(transactionData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('');
        setDescription('');
        setPaymentMethod('');
        setReference('');
        setIsSuccess(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            transactionType === 'income' ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                            <DollarSign className={cn(
                                "w-6 h-6",
                                transactionType === 'income' ? "text-green-400" : "text-red-400"
                            )} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Transaction Recorded' : 'Record Transaction'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Financial records updated' : 'Manually add income or expense'}
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
                            <h3 className="text-lg font-semibold mb-2">Transaction Saved</h3>
                            <p className="text-muted-foreground mb-6">
                                The {transactionType} of <span className="text-foreground font-medium">${parseFloat(amount).toLocaleString()}</span> has been recorded.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        resetForm();
                                    }}
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
                        <div className="space-y-4">
                            {/* Type Toggle */}
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setTransactionType('income')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                                        transactionType === 'income'
                                            ? "bg-green-500/20 text-green-400 shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                    Income
                                </button>
                                <button
                                    onClick={() => setTransactionType('expense')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                                        transactionType === 'expense'
                                            ? "bg-red-500/20 text-red-400 shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <ArrowDownRight className="w-4 h-4" />
                                    Expense
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Date & Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select...</option>
                                        {CATEGORIES[transactionType].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Monthly tractor lease payment"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Payment Method & Ref */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select...</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Reference #</label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
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
                            disabled={!amount || !category || !description || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Transaction'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
