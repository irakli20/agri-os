// @ts-nocheck
/**
 * Finance & Payment Data
 * 
 * Financial management, budgeting, and payment automation
 */

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'expense' | 'income';
    category: string;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    supplierId?: string;
    invoiceUrl?: string;
}

export interface Budget {
    id: string;
    category: string;
    allocated: number;
    spent: number;
    period: 'monthly' | 'quarterly' | 'annual';
    alerts: {
        threshold: number; // percentage
        triggered: boolean;
    }[];
}

export interface AutoPayConfig {
    id: string;
    supplierId: string;
    supplierName: string;
    isEnabled: boolean;
    maxAmount: number; // Auto-approve limit
    paymentMethod: string;
    frequency: 'invoice' | 'monthly' | 'net30';
    nextPaymentDate?: string;
}

export interface FinancialSummary {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    cashFlow: number;
    projectedExpenses: number;
}

// Mock Transactions
export const TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-1',
        date: '2024-12-01',
        description: 'Monthly Drone Lease Payment',
        amount: 1200.00,
        type: 'expense',
        category: 'Equipment',
        status: 'completed',
        paymentMethod: 'Corporate Card ••4242',
        supplierId: 'sup-2',
    },
    {
        id: 'tx-2',
        date: '2024-12-02',
        description: 'Bulk Fertilizer Order #4829',
        amount: 4500.00,
        type: 'expense',
        category: 'Inputs',
        status: 'pending',
        paymentMethod: 'ACH Transfer',
        supplierId: 'sup-1',
    },
    {
        id: 'tx-3',
        date: '2024-12-03',
        description: 'Harvest Service Payment',
        amount: 2800.00,
        type: 'expense',
        category: 'Services',
        status: 'completed',
        paymentMethod: 'Wire Transfer',
    },
    {
        id: 'tx-4',
        date: '2024-11-28',
        description: 'Crop Sales - Wheat Harvest',
        amount: 45000.00,
        type: 'income',
        category: 'Sales',
        status: 'completed',
        paymentMethod: 'Direct Deposit',
    },
    // Service Booking Transactions
    {
        id: 'tx-5',
        date: '2024-11-20',
        description: 'Ground Spraying - AgriSpray Pro (BK-005)',
        amount: 336.00,
        type: 'expense',
        category: 'Services',
        status: 'completed',
        paymentMethod: 'Corporate Card ••4242',
        invoiceUrl: '/invoices/BK-005.pdf',
    },
    {
        id: 'tx-6',
        date: '2024-11-28',
        description: 'Crop Management Consultation - AgriConsult Partners (BK-004)',
        amount: 450.00,
        type: 'expense',
        category: 'Services',
        status: 'completed',
        paymentMethod: 'Corporate Card ••4242',
        invoiceUrl: '/invoices/BK-004.pdf',
    },
    {
        id: 'tx-7',
        date: '2024-12-04',
        description: 'Aerial Crop Spraying - AgriSpray Pro (BK-001)',
        amount: 504.00,
        type: 'expense',
        category: 'Services',
        status: 'pending',
        paymentMethod: 'Corporate Card ••4242',
    },
    {
        id: 'tx-8',
        date: '2024-12-05',
        description: 'Soil Analysis - SoilTech Labs (BK-002)',
        amount: 420.00,
        type: 'expense',
        category: 'Services',
        status: 'pending',
        paymentMethod: 'Corporate Card ••4242',
    },
];

// Budgets
export const BUDGETS: Budget[] = [
    {
        id: 'bud-1',
        category: 'Inputs (Seed/Chem/Fert)',
        allocated: 50000,
        spent: 32450,
        period: 'annual',
        alerts: [{ threshold: 80, triggered: false }],
    },
    {
        id: 'bud-2',
        category: 'Equipment & Maintenance',
        allocated: 25000,
        spent: 18200,
        period: 'annual',
        alerts: [{ threshold: 80, triggered: true }],
    },
    {
        id: 'bud-3',
        category: 'Labor & Services',
        allocated: 40000,
        spent: 12500,
        period: 'annual',
        alerts: [{ threshold: 80, triggered: false }],
    },
    {
        id: 'bud-4',
        category: 'Fuel & Energy',
        allocated: 15000,
        spent: 11200,
        period: 'annual',
        alerts: [{ threshold: 80, triggered: true }],
    },
];

// Auto-Pay Configurations
export const AUTO_PAY_CONFIGS: AutoPayConfig[] = [
    {
        id: 'ap-1',
        supplierId: 'sup-2',
        supplierName: 'Valley Fuel Co.',
        isEnabled: true,
        maxAmount: 2000,
        paymentMethod: 'Corporate Card ••4242',
        frequency: 'invoice',
    },
    {
        id: 'ap-2',
        supplierId: 'sup-1',
        supplierName: 'AgChem Supply Co.',
        isEnabled: true,
        maxAmount: 5000,
        paymentMethod: 'ACH Transfer',
        frequency: 'net30',
    },
    {
        id: 'ap-3',
        supplierId: 'sup-4',
        supplierName: 'Johnny\'s Selected Seeds',
        isEnabled: false,
        maxAmount: 1000,
        paymentMethod: 'Corporate Card ••4242',
        frequency: 'invoice',
    },
];

// Financial Summary
export const FINANCIAL_SUMMARY: FinancialSummary = {
    totalRevenue: 485000,
    totalExpenses: 142350,
    netProfit: 342650,
    cashFlow: 28500,
    projectedExpenses: 15000,
};

// Helper Functions
export function getBudgetStatus(budget: Budget) {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'good';
}

export function getPendingTransactions() {
    return TRANSACTIONS.filter(t => t.status === 'pending');
}

export function getFinanceStats() {
    return FINANCIAL_SUMMARY;
}
