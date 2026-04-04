// @ts-nocheck
/**
 * Compliance Store - Regulatory compliance tracking
 * Pesticide records, RUP licensing, buffer zones, organic certification
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PesticideApplication, 
  Certification, 
  InspectionRecord,
  BufferZone,
  RequiredReport,
  Field 
} from '../types';

// ============================================================================
// COMPLIANCE CONSTANTS
// ============================================================================

// Restricted Use Pesticides
export const RESTRICTED_USE_PESTICIDES = [
  { name: 'Atrazine 4L', epaNumber: '100-XXXX', restricted: true, rei: 12 },
  { name: 'Lorsban 4E', epaNumber: '101-XXXX', restricted: true, rei: 24 },
  { name: 'Counter 20G', epaNumber: '102-XXXX', restricted: true, rei: 48 },
  { name: 'Tordon 22K', epaNumber: '103-XXXX', restricted: true, rei: 48 },
  { name: 'Gramoxone SL', epaNumber: '104-XXXX', restricted: true, rei: 12 },
  { name: 'Lasso EC', epaNumber: '105-XXXX', restricted: true, rei: 12 },
];

// Buffer zone requirements (feet)
export const BUFFER_ZONES = {
  water_body: { permanent: 25, intermittent: 15 },
  well: { private: 100, public: 200 },
  dwelling: { occupied: 100, unoccupied: 50 },
  sensitive_area: { school: 300, park: 100, beehive: 50 },
  endangered_species: { critical: 1000, habitat: 500 },
};

// Organic certification requirements
export const ORGANIC_REQUIREMENTS = {
  transitionPeriod: 3, // years
  prohibitedInputs: [
    'synthetic_fertilizers',
    'synthetic_pesticides',
    'gmo_seeds',
    'sewage_sludge',
    'ionizing_radiation',
  ],
  requiredPractices: [
    'crop_rotation',
    'soil_conservation',
    'manure_management',
    'record_keeping',
    'buffer_zones',
  ],
  auditFrequency: 1, // annual
};

// Required reports and deadlines
export const REQUIRED_REPORTS: Record<string, { type: string; dueMonth: number; dueDay: number }> = {
    pesticide_usage: { type: 'Pesticide Use Report', dueMonth: 1, dueDay: 31 },
    water_quality: { type: 'Water Quality Report', dueMonth: 3, dueDay: 15 },
    organic_inspection: { type: 'Organic Certification Inspection', dueMonth: 6, dueDay: 30 },
    endangered_species: { type: 'Endangered Species Assessment', dueMonth: 4, dueDay: 1 },
    nass_survey: { type: 'NASS Crop Survey', dueMonth: 12, dueDay: 31 },
  };
  
  // Spray drift vulnerability by condition
  export const DRIFT_FACTORS = {
    wind_speed: {
      calm: 0.5,      // < 3 mph
      light: 1.0,     // 3-10 mph
      moderate: 1.5,  // 10-15 mph
      high: 2.0,      // > 15 mph (no spray)
    },
    temperature: {
      cool: 0.8,      // < 70°F
      moderate: 1.0,  // 70-85°F
      hot: 1.3,       // > 85°F
    },
    humidity: {
      high: 0.7,      // > 70%
      moderate: 1.0,  // 50-70%
      low: 1.5,       // < 50%
    },
    inversion: 2.5,   // Temperature inversion
  };
  
  // ============================================================================
  // COMPLIANCE STORE
  // ============================================================================
  
  export interface ComplianceState {
    // Pesticide records
    pesticideApplications: PesticideApplication[];
    
    // Certifications
    certifications: Certification[];
    
    // Inspections
    inspections: InspectionRecord[];
    
    // Buffer zones
    bufferZones: BufferZone[];
    
    // Required reports
    requiredReports: RequiredReport[];
    
    // Actions
    recordPesticideApplication: (application: Omit<PesticideApplication, 'id'>) => { 
      success: boolean; 
      applicationId?: string; 
      warnings?: string[];
      violations?: string[];
    };
    
    getApplicationsForField: (fieldId: string, startDate?: Date, endDate?: Date) => PesticideApplication[];
    getApplicationsByProduct: (productName: string) => PesticideApplication[];
    getApplicationsByPest: (pestName: string) => PesticideApplication[];
    
    // Certification management
    applyForCertification: (type: Certification['type'], issuer: string) => { 
      success: boolean; 
      certificationId?: string;
      requirements?: string[];
    };
    updateCertification: (certId: string, updates: Partial<Certification>) => boolean;
    renewCertification: (certId: string) => { success: boolean; newExpiration?: Date };
    
    // Buffer zone management
    registerBufferZone: (bufferZone: Omit<BufferZone, 'id'>) => string;
    checkBufferZoneViolation: (fieldId: string, application: { windDirection: string; driftPotential: number }) => {
      violations: BufferZone[];
      warnings: BufferZone[];
    };
    
    // Inspection handling
    scheduleInspection: (type: string, inspector: string, date: Date) => string;
    recordInspectionResult: (inspectionId: string, result: InspectionRecord['status'], findings: string[], violations: string[]) => void;
    
    // Report management
    checkRequiredReports: () => { overdue: RequiredReport[]; upcoming: RequiredReport[] };
    fileReport: (reportType: string, filedDate: Date) => boolean;
    
    // Compliance checking
    checkCompliance: (fieldId?: string) => {
      compliant: boolean;
      issues: string[];
      recommendations: string[];
    };
    
    // RUP handling
    checkRUPLicense: (applicatorName: string) => { licensed: boolean; expires?: Date; categories?: string[] };
    getRestrictedProducts: () => typeof RESTRICTED_USE_PESTICIDES;
    
    // Weather suitability for application
    checkApplicationConditions: (conditions: {
      windSpeed: number;
      windDirection: string;
      temperature: number;
      humidity: number;
      temperatureInversion: boolean;
    }) => {
      suitable: boolean;
      warnings: string[];
      restrictions: string[];
    };
  }
  
  export const useComplianceStore = create<ComplianceState>()(
    persist(
      (set, get) => ({
        pesticideApplications: [],
        certifications: [],
        inspections: [],
        bufferZones: [],
        requiredReports: [],
  
        recordPesticideApplication: (application) => {
          const warnings: string[] = [];
          const violations: string[] = [];
          
          // Check if RUP and applicator is licensed
          const product = RESTRICTED_USE_PESTICIDES.find(
            (p) => p.name.toLowerCase() === application.product.toLowerCase()
          );
          
          if (product?.restricted) {
            const licenseCheck = get().checkRUPLicense(application.applicator);
            if (!licenseCheck.licensed) {
              violations.push(`Applicator ${application.applicator} not licensed for Restricted Use Pesticides`);
            }
          }
          
          // Check buffer zones
          const bufferCheck = get().checkBufferZoneViolation(application.fieldId, {
            windDirection: application.windDirection,
            driftPotential: 1.0,
          });
          
          if (bufferCheck.violations.length > 0) {
            violations.push(`Buffer zone violations: ${bufferCheck.violations.map((v) => v.feature).join(', ')}`);
          }
          if (bufferCheck.warnings.length > 0) {
            warnings.push(`Buffer zone warnings: ${bufferCheck.warnings.map((v) => v.feature).join(', ')}`);
          }
          
          // Check weather conditions
          const conditions = get().checkApplicationConditions({
            windSpeed: application.windSpeed,
            windDirection: application.windDirection,
            temperature: application.temperature,
            humidity: application.humidity,
            temperatureInversion: false, // Would need to check actual conditions
          });
          
          if (!conditions.suitable) {
            warnings.push(...conditions.warnings);
          }
          
          // Check REI compliance for workers
          const recentApps = get().pesticideApplications.filter(
            (a) => a.fieldId === application.fieldId &&
            new Date().getTime() - new Date(a.date).getTime() < 7 * 24 * 60 * 60 * 1000
          );
          
          for (const recent of recentApps) {
            const product = RESTRICTED_USE_PESTICIDES.find(
              (p) => p.name.toLowerCase() === recent.product.toLowerCase()
            );
            if (product) {
              const reiEnd = new Date(recent.date);
              reiEnd.setHours(reiEnd.getHours() + product.rei);
              if (new Date() < reiEnd) {
                warnings.push(`REI for ${recent.product} in effect until ${reiEnd.toLocaleString()}`);
              }
            }
          }
          
          const id = `app_${Date.now()}`;
          const newApplication: PesticideApplication = {
            ...application,
            id,
          };
          
          set((state) => ({
            pesticideApplications: [...state.pesticideApplications, newApplication],
          }));
          
          return {
            success: violations.length === 0,
            applicationId: id,
            warnings: warnings.length > 0 ? warnings : undefined,
            violations: violations.length > 0 ? violations : undefined,
          };
        },
  
        getApplicationsForField: (fieldId, startDate, endDate) => {
          return get().pesticideApplications.filter((app) => {
            if (app.fieldId !== fieldId) return false;
            if (startDate && new Date(app.date) < startDate) return false;
            if (endDate && new Date(app.date) > endDate) return false;
            return true;
          });
        },
  
        getApplicationsByProduct: (productName) => {
          return get().pesticideApplications.filter(
            (app) => app.product.toLowerCase() === productName.toLowerCase()
          );
        },
  
        getApplicationsByPest: (pestName) => {
          return get().pesticideApplications.filter(
            (app) => app.targetPest.toLowerCase().includes(pestName.toLowerCase())
          );
        },
  
        applyForCertification: (type, issuer) => {
          const id = `cert_${Date.now()}`;
          const cert: Certification = {
            id,
            type,
            issuer,
            issuedDate: new Date(),
            expiresDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'pending',
            requirements: ORGANIC_REQUIREMENTS.requiredPractices,
          };
          
          set((state) => ({
            certifications: [...state.certifications, cert],
          }));
          
          return {
            success: true,
            certificationId: id,
            requirements: ORGANIC_REQUIREMENTS.requiredPractices,
          };
        },
  
        updateCertification: (certId, updates) => {
          const cert = get().certifications.find((c) => c.id === certId);
          if (!cert) return false;
          
          set((state) => ({
            certifications: state.certifications.map((c) =
              c.id === certId ? { ...c, ...updates } : c
            ),
          }));
          
          return true;
        },
  
        renewCertification: (certId) => {
          const cert = get().certifications.find((c) => c.id === certId);
          if (!cert) return { success: false };
          
          const newExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          
          set((state) => ({
            certifications: state.certifications.map((c) =
              c.id === certId
                ? { ...c, expiresDate: newExpiration, status: 'active' }
                : c
            ),
          }));
          
          return { success: true, newExpiration };
        },
  
        registerBufferZone: (bufferZone) => {
          const id = `buffer_${Date.now()}`;
          set((state) => ({
            bufferZones: [...state.bufferZones, { ...bufferZone }],
          }));
          return id;
        },
  
        checkBufferZoneViolation: (fieldId, application) => {
          const fieldBuffers = get().bufferZones.filter((b) => b.fieldId === fieldId);
          const violations: BufferZone[] = [];
          const warnings: BufferZone[] = [];
          
          for (const buffer of fieldBuffers) {
            // Check if application is downwind
            const isDownwind = application.windDirection.includes(buffer.requirements);
            
            if (isDownwind && application.driftPotential > 1.5) {
              violations.push(buffer);
            } else if (isDownwind) {
              warnings.push(buffer);
            }
          }
          
          return { violations, warnings };
        },
  
        scheduleInspection: (type, inspector, date) => {
          const id = `insp_${Date.now()}`;
          const inspection: InspectionRecord = {
            id,
            date,
            inspector,
            type,
            findings: [],
            violations: [],
            correctiveActions: [],
            status: 'pending',
          };
          
          set((state) => ({
            inspections: [...state.inspections, inspection],
          }));
          
          return id;
        },
  
        recordInspectionResult: (inspectionId, result, findings, violations) => {
          set((state) => ({
            inspections: state.inspections.map((i) =
              i.id === inspectionId
                ? { ...i, status: result, findings, violations }
                : i
            ),
          }));
        },
  
        checkRequiredReports: () => {
          const now = new Date();
          const overdue: RequiredReport[] = [];
          const upcoming: RequiredReport[] = [];
          
          for (const [key, reportDef] of Object.entries(REQUIRED_REPORTS)) {
            const dueDate = new Date(now.getFullYear(), reportDef.dueMonth - 1, reportDef.dueDay);
            const filed = get().requiredReports.find(
              (r) => r.type === reportDef.type && r.filed
            );
            
            if (!filed && dueDate < now) {
              overdue.push({
                id: key,
                type: reportDef.type,
                dueDate,
                filed: false,
              });
            } else if (!filed && dueDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
              upcoming.push({
                id: key,
                type: reportDef.type,
                dueDate,
                filed: false,
              });
            }
          }
          
          return { overdue, upcoming };
        },
  
        fileReport: (reportType, filedDate) => {
          set((state) => ({
            requiredReports: [...state.requiredReports, {
              id: `report_${Date.now()}`,
              type: reportType,
              dueDate: filedDate,
              filed: true,
              filedDate,
            }],
          }));
          
          return true;
        },
  
        checkCompliance: (fieldId) => {
          const issues: string[] = [];
          const recommendations: string[] = [];
          
          // Check certifications
          const expiredCerts = get().certifications.filter(
            (c) => c.status === 'expired'
          );
          if (expiredCerts.length > 0) {
            issues.push(`${expiredCerts.length} expired certifications`);
          }
          
          // Check reports
          const reports = get().checkRequiredReports();
          if (reports.overdue.length > 0) {
            issues.push(`${reports.overdue.length} overdue reports: ${reports.overdue.map((r) => r.type).join(', ')}`);
          }
          if (reports.upcoming.length > 0) {
            recommendations.push(`Upcoming reports due: ${reports.upcoming.map((r) => r.type).join(', ')}`);
          }
          
          // Check buffer zones
          if (get().bufferZones.length === 0) {
            recommendations.push('No buffer zones registered - consider mapping sensitive areas');
          }
          
          // Check pesticide records completeness
          const recentApps = get().pesticideApplications.filter(
            (a) => new Date().getTime() - new Date(a.date).getTime() < 90 * 24 * 60 * 60 * 1000
          );
          const incompleteRecords = recentApps.filter(
            (a) => !a.windSpeed || !a.temperature || !a.humidity
          );
          if (incompleteRecords.length > 0) {
            recommendations.push(`${incompleteRecords.length} pesticide applications missing weather data`);
          }
          
          return {
            compliant: issues.length === 0,
            issues,
            recommendations,
          };
        },
  
        checkRUPLicense: (applicatorName) => {
          // This would check against a database of licensed applicators
          // For simulation, return a mock result
          return {
            licensed: true,
            expires: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            categories: ['Herbicides', 'Insecticides', 'Fungicides'],
          };
        },
  
        getRestrictedProducts: () => {
          return RESTRICTED_USE_PESTICIDES;
        },
  
        checkApplicationConditions: (conditions) => {
          const warnings: string[] = [];
          const restrictions: string[] = [];
          
          // Wind speed check
          if (conditions.windSpeed > 15) {
            restrictions.push('Wind speed exceeds 15 mph - do not apply');
          } else if (conditions.windSpeed > 10) {
            warnings.push('Wind speed 10-15 mph - high drift risk');
          } else if (conditions.windSpeed < 3) {
            warnings.push('Wind speed below 3 mph - check for temperature inversion');
          }
          
          // Temperature check
          if (conditions.temperature > 85) {
            warnings.push('Temperature above 85°F - increased volatility risk');
          }
          
          // Humidity check
          if (conditions.humidity < 50) {
            warnings.push('Low humidity - increased drift risk');
          }
          
          // Temperature inversion
          if (conditions.temperatureInversion) {
            restrictions.push('Temperature inversion present - do not apply');
          }
          
          return {
            suitable: restrictions.length === 0,
            warnings,
            restrictions,
          };
        },
      }),
      {
        name: 'agri-os-compliance',
      }
    )
  );
  
  // ============================================================================
  // COMPLIANCE REPORT GENERATION
  // ============================================================================
  
  export interface ComplianceReport {
    period: { start: Date; end: Date };
    totalApplications: number;
    productsUsed: Record<string, { totalAmount: string; applications: number }>;
    fieldsTreated: string[];
    pestsTreated: Record<string, number>;
    weatherConditions: {
      avgWindSpeed: number;
      avgTemperature: number;
      applicationsInAdverse: number;
    };
    violations: string[];
    recommendations: string[];
  }
  
  export function generateComplianceReport(
    state: ComplianceState,
    startDate: Date,
    endDate: Date
  ): ComplianceReport {
    const applications = state.getApplicationsForField('', startDate, endDate);
    
    const productsUsed: Record<string, { totalAmount: string; applications: number }> = {};
    const pestsTreated: Record<string, number> = {};
    const fieldsTreated = new Set<string>();
    let totalWindSpeed = 0;
    let totalTemp = 0;
    let adverseConditions = 0;
    
    for (const app of applications) {
      // Products
      if (!productsUsed[app.product]) {
        productsUsed[app.product] = { totalAmount: '0', applications: 0 };
      }
      productsUsed[app.product].applications++;
      
      // Pests
      pestsTreated[app.targetPest] = (pestsTreated[app.targetPest] || 0) + 1;
      
      // Fields
      fieldsTreated.add(app.fieldId);
      
      // Weather
      totalWindSpeed += app.windSpeed;
      totalTemp += app.temperature;
      
      if (app.windSpeed > 10 || app.temperature > 85) {
        adverseConditions++;
      }
    }
    
    const count = applications.length || 1;
    
    return {
      period: { start: startDate, end: endDate },
      totalApplications: applications.length,
      productsUsed,
      fieldsTreated: Array.from(fieldsTreated),
      pestsTreated,
      weatherConditions: {
        avgWindSpeed: totalWindSpeed / count,
        avgTemperature: totalTemp / count,
        applicationsInAdverse: adverseConditions,
      },
      violations: [],
      recommendations: [],
    };
  }
  
  // ============================================================================
  // BUFFER ZONE CALCULATOR
  // ============================================================================
  
  export function calculateBufferDistance(
    featureType: keyof typeof BUFFER_ZONES,
    featureSubType: string,
    productType: string,
    applicationMethod: string
  ): number {
    const baseDistance = BUFFER_ZONES[featureType]?.[featureSubType as keyof typeof BUFFER_ZONES[typeof featureType]] || 100;
    
    // Adjust for application method
    let multiplier = 1;
    if (applicationMethod === 'aerial') multiplier = 1.5;
    else if (applicationMethod === 'ground') multiplier = 1.0;
    else if (applicationMethod === 'drip') multiplier = 0.5;
    
    // Adjust for product volatility
    if (productType.toLowerCase().includes('volatile')) multiplier *= 1.3;
    
    return Math.round(baseDistance * multiplier);
  }
