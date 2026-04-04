'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
    FINANCIAL_SUMMARY,
    BUDGETS,
    TRANSACTIONS,
    AUTO_PAY_CONFIGS,
    getBudgetStatus,
    getPendingTransactions,
    getFinanceStats
} from '@/lib/finance-data';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle,
    Clock,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PaymentMethodsModal } from '@/components/modals/PaymentMethodsModal';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';

import { useGameStore } from '@/lib/game-store';

export default function FinancePage() {
    const { gameMode, getCurrentPlayer, transactions: gameTransactions } = useGameStore();
    const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

    const player = getCurrentPlayer();

    const stats = gameMode ? {
        total: 0,
        lowStock: 0,
        expiringSoon: 0,
        totalValue: 0,
        criticalAlerts: 0
    } : getFinanceStats(); // Actually getFinanceStats is for finance-data, let's just ignore it and use direct mappings Below

    const pendingTransactions = gameMode ? [] : getPendingTransactions();

    const currentBalance = gameMode ? (player?.balance || 0) : FINANCIAL_SUMMARY.netProfit; // Simplified mapping
    const displayedTransactions = gameMode ? gameTransactions : TRANSACTIONS;
    const displayedBudgets = gameMode ? [] : BUDGETS;

    return (
        <AppShell>
            <div className="page-shell">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <p className="page-header-meta">Financial Control</p>
                        <h1 className="text-3xl font-bold">Financial Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Track expenses, automate payments, and manage budgets
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="cta-secondary flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Download Report
                        </button>
                        <button className="cta-primary flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Make Payment
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="page-kpi-grid">
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
                        <div className="text-2xl font-bold text-green-400">
                            ${currentBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 text-green-400" />
                            <span>{gameMode ? "Current game funds" : "12% vs last year"}</span>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
                        <div className="text-2xl font-bold text-red-400">
                            ${gameMode ? 0 : FINANCIAL_SUMMARY.totalExpenses.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {gameMode ? "No costs recorded" : "15% below budget"}
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Cash Flow</div>
                        <div className="text-2xl font-bold text-blue-400">
                            ${gameMode ? 0 : FINANCIAL_SUMMARY.cashFlow.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {gameMode ? "Operational cashflow" : "Current month"}
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="text-sm text-muted-foreground mb-1">Projected Spend</div>
                        <div className="text-2xl font-bold text-yellow-400">
                            ${FINANCIAL_SUMMARY.projectedExpenses.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Next 30 days
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content: Budgets & Transactions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Budget Overview */}
                        <div className="card-soft rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-semibold">Budget Performance</h3>
                                </div>
                                <button className="text-sm text-primary hover:underline">View Details</button>
                            </div>

                            <div className="space-y-4">
                                {displayedBudgets.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10">
                                        <PieChart className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        <p>No active budgets defined.</p>
                                        <p className="text-xs mt-1">Manage your spending as you scale your farm operations.</p>
                                    </div>
                                ) : (
                                    displayedBudgets.map((budget) => {
                                        const status = getBudgetStatus(budget);
                                        const percentage = Math.round((budget.spent / budget.allocated) * 100);

                                        return (
                                            <div key={budget.id} className="space-y-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium">{budget.category}</span>
                                                    <span className="text-muted-foreground">
                                                        ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-500",
                                                            status === 'critical' ? "bg-red-500" :
                                                                status === 'warning' ? "bg-yellow-500" :
                                                                    "bg-green-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                                    />
                                                </div>

                                                <div className="flex justify-between text-xs">
                                                    <span className={cn(
                                                        status === 'critical' ? "text-red-400" :
                                                            status === 'warning' ? "text-yellow-400" :
                                                                "text-green-400"
                                                    )}>
                                                        {percentage}% Used
                                                    </span>
                                                    <span className="text-muted-foreground capitalize">{budget.period} Budget</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="card-soft rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Date</th>
                                            <th className="px-4 py-3 font-medium">Description</th>
                                            <th className="px-4 py-3 font-medium">Category</th>
                                            <th className="px-4 py-3 font-medium">Amount</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayedTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                    No recent transactions recorded.
                                                </td>
                                            </tr>
                                        ) : (
                                            displayedTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {new Date(tx.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {(tx as any).description || (tx as any).name || 'Transaction'}
                                                        <div className="text-xs text-muted-foreground">{(tx as any).paymentMethod || 'Wallet'}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {(tx as any).category || 'General'}
                                                    </td>
                                                    <td className={cn("px-4 py-3 font-medium",
                                                        tx.type === 'income' ? "text-green-400" : "text-foreground"
                                                    )}>
                                                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider",
                                                            (tx as any).status === 'completed' ? "bg-green-500/20 text-green-400" :
                                                                (tx as any).status === 'pending' ? "bg-yellow-500/20 text-yellow-400" :
                                                                    "bg-green-500/20 text-green-400" // Default for game tx
                                                        )}>
                                                            {(tx as any).status || 'completed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Payment Automation */}
                    <div className="space-y-6">
                        {/* Pending Approvals */}
                        {pendingTransactions.length > 0 && (
                            <div className="glass-panel rounded-xl p-5 border-l-4 border-yellow-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    <h3 className="text-lg font-semibold">Pending Approvals</h3>
                                </div>
                                <div className="space-y-3">
                                    {pendingTransactions.map((tx) => (
                                        <div key={tx.id} className="bg-white/5 rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm">{tx.description}</span>
                                                <span className="font-bold">${tx.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button className="flex-1 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded transition-colors font-medium">
                                                    Approve
                                                </button>
                                                <button className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors font-medium">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Auto-Pay Settings */}
                        <div className="glass-panel rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-lg font-semibold">Auto-Pay Rules</h3>
                                </div>
                                <button className="text-xs text-primary hover:underline">+ Add Rule</button>
                            </div>

                            <div className="space-y-3">
                                {AUTO_PAY_CONFIGS.map((config) => (
                                    <div key={config.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">{config.supplierName}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Up to ${config.maxAmount.toLocaleString()} • {config.frequency}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-8 h-4 rounded-full relative transition-colors cursor-pointer",
                                            config.isEnabled ? "bg-green-500" : "bg-white/20"
                                        )}>
                                            <div className={cn(
                                                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                                config.isEnabled ? "left-4.5" : "left-0.5"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setTransactionType('income');
                                        setIsTransactionModalOpen(true);
                                    }}
                                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left px-4 transition-colors flex items-center gap-2"
                                >
                                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                                    Record Income
                                </button>
                                <button
                                    onClick={() => {
                                        setTransactionType('expense');
                                        setIsTransactionModalOpen(true);
                                    }}
                                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left px-4 transition-colors flex items-center gap-2"
                                >
                                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                                    Record Expense
                                </button>
                                <button
                                    onClick={() => setIsPaymentMethodsOpen(true)}
                                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left px-4 transition-colors flex items-center gap-2"
                                >
                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                    Manage Cards
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods Modal */}
            <PaymentMethodsModal
                isOpen={isPaymentMethodsOpen}
                onClose={() => setIsPaymentMethodsOpen(false)}
            />

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                type={transactionType}
                onSubmit={(transaction) => {
                    console.log('Transaction recorded:', transaction);
                    // In a real app, this would send to API
                }}
            />
        </AppShell >
    );
}
