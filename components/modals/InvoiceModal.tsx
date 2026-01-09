'use client';

import { useState } from 'react';
import {
    X,
    Download,
    Printer,
    Mail,
    CheckCircle,
    Clock,
    FileText,
    Building,
    Calendar,
    CreditCard,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ServiceBooking } from '@/lib/bookings-data';

interface InvoiceModalProps {
    booking: ServiceBooking;
    isOpen: boolean;
    onClose: () => void;
}

export function InvoiceModal({ booking, isOpen, onClose }: InvoiceModalProps) {
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    if (!isOpen) return null;

    const invoiceNumber = `INV-${booking.id.replace('BK-', '')}`;
    const invoiceDate = new Date(booking.createdAt).toLocaleDateString();
    const dueDate = new Date(new Date(booking.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

    const subtotal = booking.totalCost;
    const tax = booking.totalCost * 0.08; // 8% tax
    const total = subtotal + tax;

    const handleEmailInvoice = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEmailSent(true);
        setIsSending(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Invoice {invoiceNumber}</h2>
                            <p className="text-sm text-muted-foreground">
                                {booking.status === 'completed' ? 'Paid' : 'Pending Payment'}
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

                {/* Invoice Content */}
                <div className="p-6">
                    {/* Status Banner */}
                    <div className={cn(
                        "rounded-xl p-4 mb-6 flex items-center justify-between",
                        booking.status === 'completed'
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-yellow-500/10 border border-yellow-500/20"
                    )}>
                        <div className="flex items-center gap-3">
                            {booking.status === 'completed' ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                                <Clock className="w-6 h-6 text-yellow-400" />
                            )}
                            <div>
                                <div className={cn(
                                    "font-semibold",
                                    booking.status === 'completed' ? "text-green-400" : "text-yellow-400"
                                )}>
                                    {booking.status === 'completed' ? 'Payment Complete' : 'Payment Pending'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {booking.status === 'completed'
                                        ? `Paid on ${booking.scheduledDate}`
                                        : `Due by ${dueDate}`
                                    }
                                </div>
                            </div>
                        </div>
                        {booking.status !== 'completed' && (
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                                Pay Now
                            </button>
                        )}
                    </div>

                    {/* Invoice Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">From</div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="font-medium mb-1">{booking.providerCompany}</div>
                                <div className="text-sm text-muted-foreground">
                                    {booking.providerName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {booking.providerPhone}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill To</div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="font-medium mb-1">Your Farm Name</div>
                                <div className="text-sm text-muted-foreground">
                                    123 Farm Road
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Farmville, CA 95678
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="flex gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Invoice Date:</span>
                            <span className="font-medium">{invoiceDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{dueDate}</span>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Service</th>
                                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Qty</th>
                                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Rate</th>
                                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 px-4">
                                        <div className="font-medium">{booking.serviceName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {booking.fieldName} • {booking.scheduledDate}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">{booking.acres} acres</td>
                                    <td className="py-4 px-4 text-right">
                                        ${(booking.totalCost / booking.acres).toFixed(2)}/acre
                                    </td>
                                    <td className="py-4 px-4 text-right font-medium">
                                        ${booking.totalCost.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6 flex items-center gap-3 bg-white/5 rounded-xl p-4">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                            <div className="text-sm font-medium">Payment Method</div>
                            <div className="text-sm text-muted-foreground">Corporate Card ••4242</div>
                        </div>
                        <button className="text-sm text-primary hover:underline">Change</button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex flex-wrap gap-3">
                    <button
                        onClick={handleEmailInvoice}
                        disabled={isSending || emailSent}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm",
                            (isSending || emailSent) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        {emailSent ? 'Email Sent!' : isSending ? 'Sending...' : 'Email Invoice'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
