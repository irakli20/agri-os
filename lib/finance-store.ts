// @ts-nocheck
/**
 * Finance Store - Financial management, loans, and accounting
 * Implements operating loans, cash flow, cost tracking, and tax accounting
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  OperatingLoan, 
  AccountEntry, 
  CostOfProduction,
  VariableCosts,
  FixedCosts,
  CashFlowProjection,
  DepreciationRecord,
  CropType,
  Field,
  Equipment
} from '../types';
import { cropProfiles } from './crop-data';

// ============================================================================
// FINANCIAL CONSTANTS
// ============================================================================

export const INTEREST_RATES = {
  operating_loan: {
    excellent: 0.045, // Prime - 0.5%
    good: 0.055,      // Prime + 0.5%
    fair: 0.065,      // Prime + 1.5%
    poor: 0.085,      // Prime + 3.5%
  },
  equipment_loan: 0.065,
  real_estate: 0.055,
  line_of_credit: 0.065,
};

export const DEPRECIATION_METHODS = {
  straight_line: 'straight_line',
  declining_balance: 'declining_balance',
  section_179: 'section_179',
  bonus: 'bonus',
};

export const TAX_BRACKETS = [
  { limit: 50000, rate: 0.12 },
  { limit: 150000, rate: 0.22 },
  { limit: 200000, rate: 0.24 },
  { limit: 500000, rate: 0.32 },
  { limit: Infinity, rate: 0.35 },
];

// Section 179 limits (2024)
export const SECTION_179_LIMIT = 1250000;
export const SECTION_179_PHASEOUT = 3115000;

// ============================================================================
// COST CALCULATIONS
// ============================================================================

export function calculateVariableCosts(
  cropType: CropType,
  acres: number,
  inputs: Partial<VariableCosts>
): VariableCosts {
  const cropProfile = cropProfiles[cropType];
  
  // Default costs per acre based on USDA data
  const defaults: Record<CropType, VariableCosts> = {
    corn: {
      seed: 118,
      fertilizer: 180,
      chemicals: 65,
      fuel: 42,
      repairs: 35,
      labor: 28,
      irrigation: 0,
      hauling: 18,
      storage: 12,
      interest: 25,
    },
    soybeans: {
      seed: 68,
      fertilizer: 55,
      chemicals: 52,
      fuel: 32,
      repairs: 28,
      labor: 22,
      irrigation: 0,
      hauling: 15,
      storage: 10,
      interest: 18,
    },
    wheat: {
      seed: 28,
      fertilizer: 95,
      chemicals: 35,
      fuel: 28,
      repairs: 22,
      labor: 18,
      irrigation: 0,
      hauling: 12,
      storage: 8,
      interest: 12,
    },
    cotton: {
      seed: 95,
      fertilizer: 115,
      chemicals: 145,
      fuel: 48,
      repairs: 42,
      labor: 55,
      irrigation: 85,
      hauling: 18,
      storage: 0,
      interest: 35,
    },
    lettuce: {
      seed: 350,
      fertilizer: 220,
      chemicals: 180,
      fuel: 35,
      repairs: 25,
      labor: 850,
      irrigation: 120,
      hauling: 85,
      storage: 45,
      interest: 65,
    },
    broccoli: {
      seed: 450,
      fertilizer: 280,
      chemicals: 220,
      fuel: 42,
      repairs: 32,
      labor: 1200,
      irrigation: 150,
      hauling: 110,
      storage: 55,
      interest: 85,
    },
    strawberries: {
      seed: 3500,
      fertilizer: 350,
      chemicals: 280,
      fuel: 55,
      repairs: 45,
      labor: 4500,
      irrigation: 200,
      hauling: 180,
      storage: 85,
      interest: 180,
    },
    tomatoes: {
      seed: 450,
      fertilizer: 320,
      chemicals: 280,
      fuel: 48,
      repairs: 38,
      labor: 1800,
      irrigation: 180,
      hauling: 150,
      storage: 65,
      interest: 120,
    },
    potatoes: {
      seed: 1200,
      fertilizer: 380,
      chemicals: 350,
      fuel: 65,
      repairs: 55,
      labor: 950,
      irrigation: 150,
      hauling: 85,
      storage: 95,
      interest: 110,
    },
    alfalfa: {
      seed: 180,
      fertilizer: 45,
      chemicals: 35,
      fuel: 42,
      repairs: 38,
      labor: 85,
      irrigation: 120,
      hauling: 35,
      storage: 15,
      interest: 25,
    },
    oats: {
      seed: 32,
      fertilizer: 55,
      chemicals: 25,
      fuel: 22,
      repairs: 18,
      labor: 15,
      irrigation: 0,
      hauling: 10,
      storage: 6,
      interest: 8,
    },
    barley: {
      seed: 30,
      fertilizer: 58,
      chemicals: 28,
      fuel: 24,
      repairs: 20,
      labor: 16,
      irrigation: 0,
      hauling: 11,
      storage: 7,
      interest: 9,
    },
    canola: {
      seed: 55,
      fertilizer: 85,
      chemicals: 65,
      fuel: 32,
      repairs: 28,
      labor: 22,
      irrigation: 0,
      hauling: 15,
      storage: 12,
      interest: 18,
    },
    sunflowers: {
      seed: 180,
      fertilizer: 95,
      chemicals: 55,
      fuel: 35,
      repairs: 32,
      labor: 28,
      irrigation: 85,
      hauling: 18,
      storage: 10,
      interest: 22,
    },
    rice: {
      seed: 95,
      fertilizer: 145,
      chemicals: 125,
      fuel: 75,
      repairs: 65,
      labor: 120,
      irrigation: 280,
      hauling: 25,
      storage: 18,
      interest: 35,
    },
  };
  
  const defaultCosts = defaults[cropType] || defaults.corn;
  
  return {
    seed: inputs.seed ?? defaultCosts.seed,
    fertilizer: inputs.fertilizer ?? defaultCosts.fertilizer,
    chemicals: inputs.chemicals ?? defaultCosts.chemicals,
    fuel: inputs.fuel ?? defaultCosts.fuel,
    repairs: inputs.repairs ?? defaultCosts.repairs,
    labor: inputs.labor ?? defaultCosts.labor,
    irrigation: inputs.irrigation ?? defaultCosts.irrigation,
    hauling: inputs.hauling ?? defaultCosts.hauling,
    storage: inputs.storage ?? defaultCosts.storage,
    interest: inputs.interest ?? defaultCosts.interest,
  };
}

export function calculateFixedCosts(
  acres: number,
  owned: number,
  rented: number,
  equipment: Equipment[]
): FixedCosts {
  const rentRate = 250; // Average per acre
  const ownedCost = 25; // Property tax, insurance per acre
  
  const equipmentCost = equipment.reduce((sum, eq) => {
    const annualDepreciation = eq.purchasePrice / 10; // 10 year life
    const annualInterest = eq.currentValue * 0.05;
    const annualInsurance = eq.currentValue * 0.01;
    return sum + annualDepreciation + annualInterest + annualInsurance;
  }, 0) / acres;
  
  return {
    land: (owned * ownedCost + rented * rentRate) / acres,
    equipment: equipmentCost,
    insurance: 25, // Crop insurance per acre
    taxes: ownedCost,
    management: 35, // Per acre management cost
  };
}

export function calculateCostOfProduction(
  cropType: CropType,
  acres: number,
  ownedAcres: number,
  rentedAcres: number,
  equipment: Equipment[],
  inputs?: Partial<VariableCosts>
): CostOfProduction {
  const variableCosts = calculateVariableCosts(cropType, acres, inputs || {});
  const fixedCosts = calculateFixedCosts(acres, ownedAcres, rentedAcres, equipment);
  
  const totalVariable = Object.values(variableCosts).reduce((a, b) => a + b, 0);
  const totalFixed = Object.values(fixedCosts).reduce((a, b) => a + b, 0);
  const totalPerAcre = totalVariable + totalFixed;
  
  // Expected yield from crop profile
  const expectedYield = cropProfiles[cropType]?.yieldExpectations.average || 150;
  
  return {
    crop: cropType,
    variableCosts,
    fixedCosts,
    totalPerAcre,
    breakEvenYield: totalPerAcre / (cropProfiles[cropType]?.economics.pricePerBushel.average || 5),
    breakEvenPrice: totalPerAcre / expectedYield,
  };
}

// ============================================================================
// DEPRECIATION CALCULATIONS
// ============================================================================

export function calculateDepreciation(
  asset: Equipment,
  method: keyof typeof DEPRECIATION_METHODS,
  year: number
): { depreciation: number; accumulated: number; bookValue: number } {
  const age = year - asset.year;
  const usefulLife = 7; // Years for farm equipment
  
  switch (method) {
    case 'straight_line': {
      const annualDepreciation = (asset.purchasePrice - asset.purchasePrice * 0.1) / usefulLife;
      const accumulated = Math.min(annualDepreciation * age, asset.purchasePrice * 0.9);
      return {
        depreciation: annualDepreciation,
        accumulated,
        bookValue: asset.purchasePrice - accumulated,
      };
    }
    
    case 'declining_balance': {
      const rate = 2 / usefulLife; // Double declining
      let bookValue = asset.purchasePrice;
      let accumulated = 0;
      
      for (let i = 0; i < age; i++) {
        const yearlyDepreciation = bookValue * rate;
        accumulated += yearlyDepreciation;
        bookValue -= yearlyDepreciation;
      }
      
      return {
        depreciation: bookValue * rate,
        accumulated,
        bookValue: Math.max(bookValue, asset.purchasePrice * 0.1),
      };
    }
    
    case 'section_179': {
      // Full depreciation in first year up to limit
      if (age === 0) {
        const depreciation = Math.min(asset.purchasePrice, SECTION_179_LIMIT);
        return {
          depreciation,
          accumulated: depreciation,
          bookValue: asset.purchasePrice - depreciation,
        };
      }
      return {
        depreciation: 0,
        accumulated: Math.min(asset.purchasePrice, SECTION_179_LIMIT),
        bookValue: asset.purchasePrice - Math.min(asset.purchasePrice, SECTION_179_LIMIT),
      };
    }
    
    default:
      return calculateDepreciation(asset, 'straight_line', year);
  }
}

// ============================================================================
// FINANCE STORE
// ============================================================================

export interface FinanceState {
  cash: number;
  creditScore: number;
  
  // Accounts
  operatingLoans: OperatingLoan[];
  accountsReceivable: AccountEntry[];
  accountsPayable: AccountEntry[];
  
  // Cost tracking
  costOfProduction: Record<CropType, CostOfProduction>;
  fieldCosts: Record<string, { costs: number; revenue: number }>;
  
  // Cash flow
  cashFlowProjections: CashFlowProjection[];
  
  // Equipment
  equipmentDepreciation: DepreciationRecord[];
  
  // Tax records
  taxableIncome: number;
  taxPaid: number;
  taxYear: number;
  section179Used: number;
  
  // Actions
  addCash: (amount: number, description: string) => void;
  removeCash: (amount: number, description: string) => boolean;
  
  // Loan operations
  takeOperatingLoan: (amount: number, termMonths: number) => { success: boolean; loanId?: string; rate?: number };
  makeLoanPayment: (loanId: string, amount: number) => { success: boolean; remainingBalance?: number };
  accrueInterest: () => number; // Weekly interest accrual
  
  // Cost tracking
  recordFieldCost: (fieldId: string, amount: number, category: string) => void;
  recordFieldRevenue: (fieldId: string, amount: number) => void;
  calculateCostOfProduction: (cropType: CropType, acres: number, owned: number, rented: number, equipment: Equipment[]) => CostOfProduction;
  
  // Cash flow
  generateCashFlowProjection: (months: number) => CashFlowProjection[];
  
  // Break-even analysis
  calculateBreakEven: (cropType: CropType, acres: number) => { cropYield: number; price: number };
  
  // Depreciation
  addEquipment: (equipment: Equipment, method: keyof typeof DEPRECIATION_METHODS) => void;
  calculateAnnualDepreciation: (year: number) => { total: number; byAsset: DepreciationRecord[] };
  
  // Tax
  calculateTaxLiability: (year: number) => { taxableIncome: number; tax: number; effectiveRate: number };
  payTaxes: (year: number, amount: number) => boolean;
  
  // Financial health
  getCurrentRatio: () => number;
  getDebtToAssetRatio: (totalAssets: number) => number;
  getWorkingCapital: () => number;
  getProfitMargin: (totalRevenue: number) => number;
  getROA: (totalAssets: number) => number;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      cash: 100000, // Starting cash
      creditScore: 750,
      operatingLoans: [],
      accountsReceivable: [],
      accountsPayable: [],
      costOfProduction: {} as Record<CropType, CostOfProduction>,
      fieldCosts: {},
      cashFlowProjections: [],
      equipmentDepreciation: [],
      taxableIncome: 0,
      taxPaid: 0,
      taxYear: new Date().getFullYear(),
      section179Used: 0,

      addCash: (amount, description) => {
        set((state) => ({
          cash: state.cash + amount,
        }));
      },

      removeCash: (amount, description) => {
        if (get().cash < amount) return false;
        
        set((state) => ({
          cash: state.cash - amount,
        }));
        return true;
      },

      takeOperatingLoan: (amount, termMonths) => {
        const creditScore = get().creditScore;
        let rateTier: keyof typeof INTEREST_RATES.operating_loan = 'fair';
        
        if (creditScore >= 750) rateTier = 'excellent';
        else if (creditScore >= 700) rateTier = 'good';
        else if (creditScore >= 650) rateTier = 'fair';
        else rateTier = 'poor';
        
        const rate = INTEREST_RATES.operating_loan[rateTier];
        const loanId = `loan_${Date.now()}`;
        
        const loan: OperatingLoan = {
          id: loanId,
          lender: 'Farm Credit Services',
          principal: amount,
          interestRate: rate,
          originationDate: new Date(),
          maturityDate: new Date(Date.now() + termMonths * 30 * 24 * 60 * 60 * 1000),
          paymentsMade: 0,
          balance: amount,
          interestAccrued: 0,
          status: 'active',
        };
        
        set((state) => ({
          operatingLoans: [...state.operatingLoans, loan],
          cash: state.cash + amount,
        }));
        
        return { success: true, loanId, rate };
      },

      makeLoanPayment: (loanId, amount) => {
        const loan = get().operatingLoans.find((l) => l.id === loanId);
        if (!loan || loan.status !== 'active') {
          return { success: false };
        }
        
        if (get().cash < amount) {
          return { success: false };
        }
        
        // Apply payment to interest first, then principal
        const interestPayment = Math.min(amount, loan.interestAccrued);
        const principalPayment = amount - interestPayment;
        const newBalance = loan.balance - principalPayment;
        
        set((state) => ({
          cash: state.cash - amount,
          operatingLoans: state.operatingLoans.map((l) =>
            l.id === loanId
              ? {
                  ...l,
                  balance: Math.max(0, newBalance),
                  interestAccrued: Math.max(0, loan.interestAccrued - interestPayment),
                  paymentsMade: l.paymentsMade + amount,
                  status: newBalance <= 0 ? 'paid' : 'active',
                }
              : l
          ),
        }));
        
        return { success: true, remainingBalance: Math.max(0, newBalance) };
      },

      accrueInterest: () => {
        let totalInterest = 0;
        
        set((state) => ({
          operatingLoans: state.operatingLoans.map((loan) => {
            if (loan.status !== 'active') return loan;
            
            // Weekly interest accrual
            const weeklyInterest = loan.balance * (loan.interestRate / 52);
            totalInterest += weeklyInterest;
            
            return {
              ...loan,
              interestAccrued: loan.interestAccrued + weeklyInterest,
            };
          }),
        }));
        
        return totalInterest;
      },

      recordFieldCost: (fieldId, amount, category) => {
        set((state) => ({
          fieldCosts: {
            ...state.fieldCosts,
            [fieldId]: {
              costs: (state.fieldCosts[fieldId]?.costs || 0) + amount,
              revenue: state.fieldCosts[fieldId]?.revenue || 0,
            },
          },
          cash: state.cash - amount,
        }));
      },

      recordFieldRevenue: (fieldId, amount) => {
        set((state) => ({
          fieldCosts: {
            ...state.fieldCosts,
            [fieldId]: {
              costs: state.fieldCosts[fieldId]?.costs || 0,
              revenue: (state.fieldCosts[fieldId]?.revenue || 0) + amount,
            },
          },
          cash: state.cash + amount,
          taxableIncome: state.taxableIncome + amount,
        }));
      },

      calculateCostOfProduction: (cropType, acres, owned, rented, equipment) => {
        return calculateCostOfProduction(cropType, acres, owned, rented, equipment);
      },

      generateCashFlowProjection: (months) => {
        const projections: CashFlowProjection[] = [];
        const currentMonth = new Date().getMonth();
        
        // Expected monthly revenue patterns (simplified)
        const revenueByMonth: Record<number, number> = {
          0: 0.02,   // January
          1: 0.02,   // February
          2: 0.03,   // March
          3: 0.05,   // April
          4: 0.08,   // May
          5: 0.05,   // June
          6: 0.10,   // July
          7: 0.15,   // August
          8: 0.25,   // September (harvest)
          9: 0.20,   // October (harvest)
          10: 0.08,  // November
          11: 0.07,  // December
        };
        
        const annualRevenue = Object.values(get().fieldCosts).reduce(
          (sum, f) => sum + f.revenue, 0
        ) * 1.1; // Project 10% growth
        
        const annualExpenses = Object.values(get().costOfProduction).reduce(
          (sum, cop) => sum + cop.totalPerAcre * 100, // Assuming 100 acres per crop for projection
          0
        );
        
        let cumulativeCashFlow = get().cash;
        
        for (let i = 0; i < months; i++) {
          const month = (currentMonth + i) % 12;
          const expectedRevenue = annualRevenue * (revenueByMonth[month] || 0.05);
          const expectedExpenses = annualExpenses / 12;
          const netCashFlow = expectedRevenue - expectedExpenses;
          cumulativeCashFlow += netCashFlow;
          
          projections.push({
            month: new Date(2024, month, 1).toLocaleString('default', { month: 'short' }),
            expectedRevenue,
            expectedExpenses,
            netCashFlow,
            cumulativeCashFlow,
          });
        }
        
        set({ cashFlowProjections: projections });
        return projections;
      },

      calculateBreakEven: (cropType, acres) => {
        const cop = get().costOfProduction[cropType];
        if (!cop) return { cropYield: 0, price: 0 };
        
        return {
          cropYield: cop.breakEvenYield,
          price: cop.breakEvenPrice,
        };
      },

      addEquipment: (equipment, method) => {
        const depResult = calculateDepreciation(equipment, method, new Date().getFullYear());
        
        const record: DepreciationRecord = {
          assetId: equipment.id,
          assetName: `${equipment.brand} ${equipment.model}`,
          purchasePrice: equipment.purchasePrice,
          purchaseDate: new Date(),
          method,
          usefulLife: 7,
          salvageValue: equipment.purchasePrice * 0.1,
          accumulatedDepreciation: depResult.accumulated,
          currentValue: depResult.bookValue,
        };
        
        // Check Section 179 limits
        if (method === 'section_179') {
          const newSection179Used = get().section179Used + depResult.depreciation;
          if (newSection179Used <= SECTION_179_LIMIT) {
            set((state) => ({
              equipmentDepreciation: [...state.equipmentDepreciation, record],
              section179Used: newSection179Used,
              taxableIncome: state.taxableIncome - depResult.depreciation,
            }));
          }
        } else {
          set((state) => ({
            equipmentDepreciation: [...state.equipmentDepreciation, record],
          }));
        }
      },

      calculateAnnualDepreciation: (year) => {
        const byAsset = get().equipmentDepreciation.map((asset) => {
          const equipment: Equipment = {
            id: asset.assetId,
            type: 'tractor', // Simplified
            name: asset.assetName,
            brand: '',
            model: '',
            year: asset.purchaseDate.getFullYear(),
            purchasePrice: asset.purchasePrice,
            currentValue: asset.currentValue,
            condition: 80,
            hoursUsed: 0,
            maintenanceDue: 100,
            efficiency: 85,
            fuelConsumption: 5,
            location: 'farm',
            width: 20,
          };
          
          const result = calculateDepreciation(
            equipment,
            asset.method as keyof typeof DEPRECIATION_METHODS,
            year
          );
          
          return {
            ...asset,
            accumulatedDepreciation: result.accumulated,
            currentValue: result.bookValue,
          };
        });
        
        const total = byAsset.reduce((sum, a) => {
          // Calculate current year depreciation
          const currentYearDep = a.method === 'section_179' && a.purchaseDate.getFullYear() === year
            ? a.purchasePrice <= SECTION_179_LIMIT ? a.purchasePrice : SECTION_179_LIMIT
            : (a.purchasePrice - a.salvageValue) / a.usefulLife;
          return sum + currentYearDep;
        }, 0);
        
        return { total, byAsset };
      },

      calculateTaxLiability: (year) => {
        const income = get().taxableIncome;
        const depreciation = get().calculateAnnualDepreciation(year).total;
        const interestExpense = get().operatingLoans.reduce(
          (sum, l) => sum + l.interestAccrued, 0
        );
        
        // Standard deduction for single farmer (2024)
        const standardDeduction = 14600;
        
        const taxableIncome = Math.max(0, income - depreciation - interestExpense - standardDeduction);
        
        // Calculate tax using brackets
        let tax = 0;
        let remainingIncome = taxableIncome;
        let previousLimit = 0;
        
        for (const bracket of TAX_BRACKETS) {
          const bracketIncome = Math.min(remainingIncome, bracket.limit - previousLimit);
          tax += bracketIncome * bracket.rate;
          remainingIncome -= bracketIncome;
          previousLimit = bracket.limit;
          
          if (remainingIncome <= 0) break;
        }
        
        const effectiveRate = taxableIncome > 0 ? tax / taxableIncome : 0;
        
        return { taxableIncome, tax, effectiveRate };
      },

      payTaxes: (year, amount) => {
        const liability = get().calculateTaxLiability(year);
        
        if (get().cash < amount || amount < liability.tax) {
          return false;
        }
        
        set((state) => ({
          cash: state.cash - amount,
          taxPaid: state.taxPaid + amount,
          taxableIncome: 0, // Reset for new year
        }));
        
        return true;
      },

      getCurrentRatio: () => {
        const currentAssets = get().cash + 
          get().accountsReceivable.reduce((sum, a) => sum + a.amount, 0);
        const currentLiabilities = get().accountsPayable.reduce((sum, a) => sum + a.amount, 0) +
          get().operatingLoans
            .filter((l) => l.status === 'active')
            .reduce((sum, l) => sum + l.balance + l.interestAccrued, 0);
        
        return currentLiabilities > 0 ? currentAssets / currentLiabilities : 999;
      },

      getDebtToAssetRatio: (totalAssets) => {
        const totalDebt = get().operatingLoans
          .filter((l) => l.status === 'active')
          .reduce((sum, l) => sum + l.balance + l.interestAccrued, 0);
        
        return totalAssets > 0 ? totalDebt / totalAssets : 0;
      },

      getWorkingCapital: () => {
        const currentAssets = get().cash + 
          get().accountsReceivable.reduce((sum, a) => sum + a.amount, 0);
        const currentLiabilities = get().accountsPayable.reduce((sum, a) => sum + a.amount, 0) +
          get().operatingLoans
            .filter((l) => l.status === 'active')
            .reduce((sum, l) => sum + l.balance + l.interestAccrued, 0);
        
        return currentAssets - currentLiabilities;
      },

      getProfitMargin: (totalRevenue) => {
        if (totalRevenue === 0) return 0;
        const totalCosts = Object.values(get().fieldCosts).reduce(
          (sum, f) => sum + f.costs, 0
        );
        return (totalRevenue - totalCosts) / totalRevenue;
      },

      getROA: (totalAssets) => {
        if (totalAssets === 0) return 0;
        const netIncome = Object.values(get().fieldCosts).reduce(
          (sum, f) => sum + f.revenue - f.costs, 0
        );
        return netIncome / totalAssets;
      },
    }),
    {
      name: 'agri-os-finance',
    }
  )
);
