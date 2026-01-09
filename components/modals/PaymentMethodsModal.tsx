'use client';

import { useState } from 'react';
import {
    X,
    CreditCard,
    Building,
    Plus,
    CheckCircle,
    Star,
    Trash2,
    Edit3,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank' | 'ach';
    name: string;
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
    icon: 'visa' | 'mastercard' | 'amex' | 'bank';
}

interface PaymentMethodsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (method: PaymentMethod) => void;
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'pm-1',
        type: 'card',
        name: 'Corporate Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
        icon: 'visa',
    },
    {
        id: 'pm-2',
        type: 'card',
        name: 'Amex Business',
        last4: '1001',
        expiryMonth: 8,
        expiryYear: 2025,
        isDefault: false,
        icon: 'amex',
    },
    {
        id: 'pm-3',
        type: 'bank',
        name: 'Farm Operations Account',
        last4: '6789',
        isDefault: false,
        icon: 'bank',
    },
];

const CARD_ICONS: Record<string, React.ReactNode> = {
    visa: <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>,
    mastercard: <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-[6px] font-bold">MC</div>,
    amex: <div className="w-8 h-5 bg-blue-400 rounded text-white text-[8px] font-bold flex items-center justify-center">AMEX</div>,
    bank: <Building className="w-5 h-5 text-green-400" />,
};

export function PaymentMethodsModal({ isOpen, onClose, onSelect }: PaymentMethodsModalProps) {
    const [methods, setMethods] = useState(MOCK_PAYMENT_METHODS);
    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });

    if (!isOpen) return null;

    const handleSetDefault = (id: string) => {
        setMethods(methods.map(m => ({
            ...m,
            isDefault: m.id === id,
        })));
    };

    const handleDelete = (id: string) => {
        setMethods(methods.filter(m => m.id !== id));
    };

    const handleAddCard = () => {
        if (!newCard.number || !newCard.expiry || !newCard.cvc || !newCard.name) return;

        const [month, year] = newCard.expiry.split('/');
        const newMethod: PaymentMethod = {
            id: `pm-${Date.now()}`,
            type: 'card',
            name: newCard.name,
            last4: newCard.number.slice(-4),
            expiryMonth: parseInt(month),
            expiryYear: 2000 + parseInt(year),
            isDefault: methods.length === 0,
            icon: newCard.number.startsWith('4') ? 'visa' : newCard.number.startsWith('5') ? 'mastercard' : 'amex',
        };

        setMethods([...methods, newMethod]);
        setNewCard({ number: '', expiry: '', cvc: '', name: '' });
        setIsAdding(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Payment Methods</h2>
                            <p className="text-sm text-muted-foreground">Manage your payment options</p>
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
                <div className="p-6 space-y-4">
                    {/* Security Note */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 rounded-lg p-3">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>Your payment information is encrypted and secure</span>
                    </div>

                    {/* Payment Methods List */}
                    <div className="space-y-3">
                        {methods.map((method) => (
                            <div
                                key={method.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                                    method.isDefault
                                        ? "border-primary bg-primary/5"
                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {CARD_ICONS[method.icon]}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{method.name}</span>
                                            {method.isDefault && (
                                                <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-medium">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            •••• {method.last4}
                                            {method.expiryMonth && ` · Expires ${method.expiryMonth}/${method.expiryYear?.toString().slice(-2)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {!method.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Set as default"
                                        >
                                            <Star className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    )}
                                    <button
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Card Form */}
                    {isAdding ? (
                        <div className="p-4 bg-white/5 rounded-xl space-y-4 border border-white/10">
                            <h3 className="font-medium">Add New Card</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={newCard.number}
                                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={newCard.expiry}
                                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">CVC</label>
                                        <input
                                            type="text"
                                            value={newCard.cvc}
                                            onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                            placeholder="123"
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={newCard.name}
                                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                        placeholder="John Smith"
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCard}
                                    className="flex-1 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm"
                                >
                                    Add Card
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 hover:border-primary/50 rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Payment Method</span>
                        </button>
                    )}

                    {/* Add Bank Account */}
                    <button className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm">
                        <Building className="w-5 h-5 text-green-400" />
                        <span>Link Bank Account (ACH)</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
