// @ts-nocheck
/**
 * Insurance Store - Crop insurance and risk management
 * Implements MPCI, Revenue Protection, and APH tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  InsurancePolicy, 
  InsuranceClaim, 
  InsuranceType,
  CropType,
  Field,
  CropInstance 
} from '../types';
import { cropProfiles } from './crop-data';

// ============================================================================
// INSURANCE CONSTANTS
// ============================================================================

// USDA RMA premium rates (simplified - would be based on actuarial data)
export const PREMIUM_RATES: Record<InsuranceType, number> = {
  mpci_yield: 0.055,      // 5.5% of liability
  mpci_revenue: 0.065,    // 6.5% of liability
  hail: 0.015,            // 1.5% of liability
  prevented_planting: 0.025, // 2.5% of liability
  private: 0.04,          // 4% of liability
};

// Coverage levels available
export const COVERAGE_LEVELS = [0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85];

// Standard APH (Actual Production History) - 4-10 year average
export const DEFAULT_APH: Record<CropType, number> = {
  corn: 175,
  soybeans: 50,
  wheat: 55,
  cotton: 850,
  lettuce: 450,
  broccoli: 180,
  strawberries: 15000,
  tomatoes: 28000,
  potatoes: 420,
  alfalfa: 6,
  oats: 70,
  barley: 65,
  canola: 35,
  sunflowers: 1600,
  rice: 7500,
};

// Projected prices (set before planting season)
export const PROJECTED_PRICES: Record<CropType, number> = {
  corn: 5.50,
  soybeans: 12.00,
  wheat: 7.00,
  cotton: 0.80,
  lettuce: 14.00,
  broccoli: 30.00,
  strawberries: 2.00,
  tomatoes: 0.80,
  potatoes: 9.50,
  alfalfa: 180,
  oats: 3.25,
  barley: 4.50,
  canola: 12.50,
  sunflowers: 0.18,
  rice: 0.16,
};

// Harvest prices (discovered during harvest)
export const HARVEST_PRICES: Record<CropType, number> = {
  corn: 5.75,
  soybeans: 12.50,
  wheat: 7.25,
  cotton: 0.85,
  lettuce: 15.00,
  broccoli: 32.00,
  strawberries: 2.25,
  tomatoes: 0.85,
  potatoes: 10.00,
  alfalfa: 200,
  oats: 3.50,
  barley: 4.75,
  canola: 13.00,
  sunflowers: 0.20,
  rice: 0.17,
};

// Prevented planting coverage (typically 60-70% of guarantee)
export const PREVENTED_PLANTING_COVERAGE = 0.60;

// Late planting dates (when coverage starts reducing)
export const LATE_PLANTING_DATES: Record<CropType, { final: string; late: string }> = {
  corn: { final: '06-10', late: '06-20' },
  soybeans: { final: '06-20', late: '07-05' },
  wheat: { final: '11-15', late: '12-01' },
  cotton: { final: '06-10', late: '06-20' },
  // Vegetables vary by region - simplified
  lettuce: { final: '05-01', late: '05-15' },
  broccoli: { final: '04-15', late: '05-01' },
  strawberries: { final: '04-01', late: '04-15' },
  tomatoes: { final: '06-01', late: '06-15' },
  potatoes: { final: '05-15', late: '06-01' },
  alfalfa: { final: '04-15', late: '05-01' },
  oats: { final: '04-30', late: '05-15' },
  barley: { final: '04-30', late: '05-15' },
  canola: { final: '05-01', late: '05-15' },
  sunflowers: { final: '06-10', late: '06-25' },
  rice: { final: '05-20', late: '06-05' },
};

// ============================================================================
// INSURANCE CALCULATIONS
// ============================================================================

export interface InsuranceCalculation {
  liability: number;
  premium: number;
  subsidy: number;
  farmerPremium: number;
  guarantee: {
    yield: number;
    revenue?: number;
  };
}

export function calculateYieldGuarantee(
  cropType: CropType,
  aph: number,
  coverageLevel: number
): number {
  return aph * coverageLevel;
}

export function calculateRevenueGuarantee(
  cropType: CropType,
  aph: number,
  coverageLevel: number,
  projectedPrice: number,
  harvestPrice: number
): number {
  // RP uses higher of projected or harvest price
  const price = Math.max(projectedPrice, harvestPrice);
  const yieldGuarantee = calculateYieldGuarantee(cropType, aph, coverageLevel);
  return yieldGuarantee * price;
}

export function calculateInsurancePremium(
  cropType: CropType,
  acres: number,
  aph: number,
  coverageLevel: number,
  policyType: InsuranceType,
  projectedPrice: number
): InsuranceCalculation {
  // Calculate liability
  const yieldGuarantee = calculateYieldGuarantee(cropType, aph, coverageLevel);
  
  let liability: number;
  let guarantee: { yield: number; revenue?: number };
  
  if (policyType === 'mpci_revenue') {
    guarantee = {
      yield: yieldGuarantee,
      revenue: yieldGuarantee * projectedPrice,
    };
    liability = guarantee.revenue! * acres;
  } else {
    guarantee = { yield: yieldGuarantee };
    liability = yieldGuarantee * projectedPrice * acres;
  }
  
  // Calculate premium
  const baseRate = PREMIUM_RATES[policyType];
  const premium = liability * baseRate;
  
  // USDA subsidy based on coverage level
  let subsidyRate = 0.38; // Default for 50-70%
  if (coverageLevel >= 0.80) subsidyRate = 0.38;
  else if (coverageLevel >= 0.75) subsidyRate = 0.55;
  else if (coverageLevel >= 0.70) subsidyRate = 0.59;
  else if (coverageLevel >= 0.65) subsidyRate = 0.59;
  else if (coverageLevel >= 0.60) subsidyRate = 0.64;
  else if (coverageLevel >= 0.55) subsidyRate = 0.64;
  else subsidyRate = 0.67;
  
  const subsidy = premium * subsidyRate;
  const farmerPremium = premium - subsidy;
  
  return {
    liability,
    premium,
    subsidy,
    farmerPremium,
    guarantee,
  };
}

export function calculateIndemnity(
  policy: InsurancePolicy,
  actualYield: number,
  harvestPrice: number
): number {
  if (policy.type === 'mpci_revenue') {
    // Revenue Protection
    const actualRevenue = actualYield * harvestPrice;
    const guaranteedRevenue = policy.coverageAmount;
    return Math.max(0, guaranteedRevenue - actualRevenue);
  } else {
    // Yield Protection
    const aph = policy.aph[policy.crops[0]] || DEFAULT_APH[policy.crops[0]];
    const guaranteeYield = aph * policy.coverageLevel;
    const yieldLoss = Math.max(0, guaranteeYield - actualYield);
    return yieldLoss * harvestPrice;
  }
}

export function calculatePreventedPlantingIndemnity(
  policy: InsurancePolicy,
  cropType: CropType
): number {
  const aph = policy.aph[cropType] || DEFAULT_APH[cropType];
  const projectedPrice = PROJECTED_PRICES[cropType];
  const guaranteeYield = aph * policy.coverageLevel * PREVENTED_PLANTING_COVERAGE;
  return guaranteeYield * projectedPrice;
}

// ============================================================================
// INSURANCE STORE
// ============================================================================

export interface InsuranceState {
  policies: InsurancePolicy[];
  aphHistory: Record<string, Record<CropType, number[]>>; // field -> crop -> yield history
  pendingClaims: InsuranceClaim[];
  processedClaims: InsuranceClaim[];
  
  // Actions
  createPolicy: (
    type: InsuranceType,
    coverageLevel: number,
    fields: string[],
    crops: CropType[],
    provider?: string
  ) => { success: boolean; policyId?: string; premium?: number; message?: string };
  
  updateAPH: (fieldId: string, cropType: CropType, yield: number, year: number) => void;
  getAPH: (fieldId: string, cropType: CropType) => number;
  
  // Claims
  fileClaim: (
    policyId: string,
    fieldId: string,
    cropType: CropType,
    lossType: string,
    estimatedLoss: number,
    lossDate: Date
  ) => { success: boolean; claimId?: string; message?: string };
  
  processClaim: (claimId: string, actualYield: number, harvestPrice: number) => { 
    success: boolean; 
    indemnity?: number; 
    message?: string;
    status: 'approved' | 'denied' | 'adjusted';
  };
  
  // Prevented planting
  filePreventedPlantingClaim: (policyId: string, fieldId: string, cropType: CropType) => {
    success: boolean;
    indemnity?: number;
    message?: string;
  };
  
  // Late planting penalties
  checkLatePlanting: (cropType: CropType, plantDate: Date) => {
    isLate: boolean;
    isFinal: boolean;
    coverageReduction: number;
    message: string;
  };
  
  // Queries
  getActivePolicies: (cropType?: CropType) => InsurancePolicy[];
  getTotalPremiumsDue: () => number;
  getTotalCoverage: () => number;
  getPolicyForField: (fieldId: string, cropType: CropType) => InsurancePolicy | undefined;
  
  // Annual processing
  processAnnualReset: (year: number) => void;
}

export const useInsuranceStore = create<InsuranceState>()(
  persist(
    (set, get) => ({
      policies: [],
      aphHistory: {},
      pendingClaims: [],
      processedClaims: [],

      createPolicy: (type, coverageLevel, fields, crops, provider = 'FCIC') => {
        // Validate coverage level
        if (!COVERAGE_LEVELS.includes(coverageLevel)) {
          return { success: false, message: 'Invalid coverage level' };
        }
        
        // Calculate premium for all fields
        let totalPremium = 0;
        let totalLiability = 0;
        
        const aph: Record<CropType, number> = {} as Record<CropType, number>;
        
        for (const crop of crops) {
          // Use average APH across fields
          const fieldAPHs = fields.map((f) => get().getAPH(f, crop));
          const avgAPH = fieldAPHs.reduce((a, b) => a + b, 0) / fieldAPHs.length || DEFAULT_APH[crop];
          aph[crop] = avgAPH;
          
          // Calculate for each field (assuming 100 acres per field for simplicity)
          const acres = 100; // Would come from field data
          const calc = calculateInsurancePremium(
            crop,
            acres,
            avgAPH,
            coverageLevel,
            type,
            PROJECTED_PRICES[crop]
          );
          
          totalPremium += calc.farmerPremium;
          totalLiability += calc.liability;
        }
        
        const policyId = `policy_${Date.now()}`;
        const policy: InsurancePolicy = {
          id: policyId,
          type,
          provider,
          policyNumber: `${provider}-${Date.now().toString(36).toUpperCase()}`,
          coverageLevel,
          premium: totalPremium,
          premiumDue: new Date(new Date().getFullYear(), 9, 1), // Oct 1
          coverageAmount: totalLiability,
          deductible: 0, // Deductible is built into coverage level
          fields,
          crops,
          aph,
          claims: [],
          status: 'active',
        };
        
        set((state) => ({
          policies: [...state.policies, policy],
        }));
        
        return {
          success: true,
          policyId,
          premium: totalPremium,
          message: `Policy created. Annual premium: $${totalPremium.toFixed(2)}`,
        };
      },

      updateAPH: (fieldId, cropType, yield, year) => {
        set((state) => ({
          aphHistory: {
            ...state.aphHistory,
            [fieldId]: {
              ...state.aphHistory[fieldId],
              [cropType]: [
                ...(state.aphHistory[fieldId]?.[cropType] || []),
                yield,
              ].slice(-10), // Keep last 10 years
            },
          },
        }));
      },

      getAPH: (fieldId, cropType) => {
        const history = get().aphHistory[fieldId]?.[cropType] || [];
        if (history.length === 0) return DEFAULT_APH[cropType];
        
        // Calculate APH (simple average, would use RMA methodology)
        const sum = history.reduce((a, b) => a + b, 0);
        return sum / history.length;
      },

      fileClaim: (policyId, fieldId, cropType, lossType, estimatedLoss, lossDate) => {
        const policy = get().policies.find((p) => p.id === policyId);
        if (!policy) {
          return { success: false, message: 'Policy not found' };
        }
        
        if (policy.status !== 'active') {
          return { success: false, message: 'Policy is not active' };
        }
        
        const claimId = `claim_${Date.now()}`;
        const claim: InsuranceClaim = {
          id: claimId,
          fieldId,
          cropType,
          lossType,
          lossDate,
          estimatedLoss,
          claimedAmount: 0, // Will be calculated when processed
          paidAmount: 0,
          status: 'filed',
          adjusterNotes: '',
        };
        
        set((state) => ({
          pendingClaims: [...state.pendingClaims, claim],
          policies: state.policies.map((p) =
            p.id === policyId
              ? { ...p, claims: [...p.claims, claim] }
              : p
          ),
        }));
        
        return { success: true, claimId, message: 'Claim filed successfully' };
      },

      processClaim: (claimId, actualYield, harvestPrice) => {
        const claim = get().pendingClaims.find((c) => c.id === claimId);
        if (!claim) {
          return { success: false, message: 'Claim not found', status: 'denied' };
        }
        
        // Find the policy
        const policy = get().policies.find((p) =
          p.claims.some((c) => c.id === claimId)
        );
        
        if (!policy) {
          return { success: false, message: 'Policy not found', status: 'denied' };
        }
        
        // Calculate indemnity
        const indemnity = calculateIndemnity(policy, actualYield, harvestPrice);
        
        let status: 'approved' | 'denied' | 'adjusted';
        let finalIndemnity = indemnity;
        
        if (indemnity <= 0) {
          status = 'denied';
          finalIndemnity = 0;
        } else if (Math.abs(indemnity - claim.estimatedLoss * policy.coverageAmount / 100) > indemnity * 0.2) {
          status = 'adjusted';
        } else {
          status = 'approved';
        }
        
        const updatedClaim: InsuranceClaim = {
          ...claim,
          claimedAmount: claim.estimatedLoss * policy.coverageAmount / 100,
          paidAmount: finalIndemnity,
          status,
          adjusterNotes: `Actual yield: ${actualYield}. Harvest price: $${harvestPrice}.`,
        };
        
        set((state) => ({
          pendingClaims: state.pendingClaims.filter((c) => c.id !== claimId),
          processedClaims: [...state.processedClaims, updatedClaim],
          policies: state.policies.map((p) => ({
            ...p,
            claims: p.claims.map((c) => c.id === claimId ? updatedClaim : c),
          })),
        }));
        
        return {
          success: status !== 'denied',
          indemnity: finalIndemnity,
          message: `Claim ${status}. Indemnity: $${finalIndemnity.toFixed(2)}`,
          status,
        };
      },

      filePreventedPlantingClaim: (policyId, fieldId, cropType) => {
        const policy = get().policies.find((p) => p.id === policyId);
        if (!policy) {
          return { success: false, message: 'Policy not found' };
        }
        
        if (policy.type !== 'mpci_yield' && policy.type !== 'mpci_revenue') {
          return { success: false, message: 'Prevented planting only available for MPCI' };
        }
        
        const indemnity = calculatePreventedPlantingIndemnity(policy, cropType);
        
        const claim: InsuranceClaim = {
          id: `claim_pp_${Date.now()}`,
          fieldId,
          cropType,
          lossType: 'Prevented Planting',
          lossDate: new Date(),
          estimatedLoss: 100,
          claimedAmount: indemnity,
          paidAmount: indemnity,
          status: 'approved',
          adjusterNotes: 'Prevented planting claim approved.',
        };
        
        set((state) => ({
          processedClaims: [...state.processedClaims, claim],
          policies: state.policies.map((p) =
            p.id === policyId
              ? { ...p, claims: [...p.claims, claim] }
              : p
          ),
        }));
        
        return {
          success: true,
          indemnity,
          message: `Prevented planting claim approved. Indemnity: $${indemnity.toFixed(2)}`,
        };
      },

      checkLatePlanting: (cropType, plantDate) => {
        const dates = LATE_PLANTING_DATES[cropType];
        if (!dates) {
          return { isLate: false, isFinal: false, coverageReduction: 0, message: 'No late planting dates defined' };
        }
        
        const finalDate = new Date(`${new Date().getFullYear()}-${dates.final}`);
        const lateDate = new Date(`${new Date().getFullYear()}-${dates.late}`);
        
        if (plantDate <= finalDate) {
          return { isLate: false, isFinal: false, coverageReduction: 0, message: 'Planted within final planting date' };
        }
        
        if (plantDate <= lateDate) {
          const daysLate = Math.floor((plantDate.getTime() - finalDate.getTime()) / (1000 * 60 * 60 * 24));
          const reduction = Math.min(0.25, daysLate * 0.01); // 1% per day, max 25%
          return {
            isLate: true,
            isFinal: false,
            coverageReduction: reduction,
            message: `Late planted (${daysLate} days). Coverage reduced by ${(reduction * 100).toFixed(0)}%`,
          };
        }
        
        return {
          isLate: true,
          isFinal: true,
          coverageReduction: 0,
          message: 'Planted after late planting period. No coverage.',
        };
      },

      getActivePolicies: (cropType) => {
        return get().policies.filter((p) => {
          if (p.status !== 'active') return false;
          if (cropType && !p.crops.includes(cropType)) return false;
          return true;
        });
      },

      getTotalPremiumsDue: () => {
        return get().policies
          .filter((p) => p.status === 'active')
          .reduce((sum, p) => sum + p.premium, 0);
      },

      getTotalCoverage: () => {
        return get().policies
          .filter((p) => p.status === 'active')
          .reduce((sum, p) => sum + p.coverageAmount, 0);
      },

      getPolicyForField: (fieldId, cropType) => {
        return get().policies.find((p) =>
          p.status === 'active' &&
          p.fields.includes(fieldId) &&
          p.crops.includes(cropType)
        );
      },

      processAnnualReset: (year) => {
        // Expire old policies
        set((state) => ({
          policies: state.policies.map((p) => ({
            ...p,
            status: new Date() > p.premiumDue && p.status === 'active' ? 'expired' : p.status,
          })),
        }));
      },
    }),
    {
      name: 'agri-os-insurance',
    }
  )
);

// ============================================================================
// INSURANCE RECOMMENDATIONS
// ============================================================================

export function recommendInsuranceCoverage(
  cropType: CropType,
  riskTolerance: 'low' | 'medium' | 'high',
  debtLevel: number
): {
  type: InsuranceType;
  coverageLevel: number;
  rationale: string;
} {
  // Higher debt = need more coverage
  const baseCoverage: Record<'riskTolerance', number> = {
    low: 0.85,
    medium: 0.75,
    high: 0.65,
  };
  
  let recommendedCoverage = baseCoverage[riskTolerance];
  
  // Adjust for debt
  if (debtLevel > 0.6) recommendedCoverage = Math.min(0.85, recommendedCoverage + 0.05);
  else if (debtLevel < 0.3) recommendedCoverage = Math.max(0.50, recommendedCoverage - 0.05);
  
  // Revenue protection recommended for higher value crops
  const recommendedType: InsuranceType = 
    ['corn', 'soybeans', 'wheat'].includes(cropType) ? 'mpci_revenue' : 'mpci_yield';
  
  const rationale = debtLevel > 0.5
    ? `With high debt levels (${(debtLevel * 100).toFixed(0)}%), higher coverage protects loan obligations.`
    : `Coverage level balances premium cost with risk protection.`;
  
  return {
    type: recommendedType,
    coverageLevel: recommendedCoverage,
    rationale,
  };
}
