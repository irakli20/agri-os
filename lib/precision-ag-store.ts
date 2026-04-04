// @ts-nocheck
/**
 * Precision Agriculture Store
 * Manages VRA prescriptions, grid soil sampling, yield mapping,
 * NDVI analysis, and management zones
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CropType, 
  Field, 
  Coordinates,
  PrecisionData,
  ManagementZone,
  YieldMap,
  PrescriptionMap,
  SoilMap,
  SatelliteImagery
} from '../../types';

// ============================================================================
// EXTENDED TYPES
// ============================================================================

export interface VRAPrescription {
  id: string;
  fieldId: string;
  name: string;
  type: 'seed' | 'fertilizer' | 'chemical' | 'lime' | 'gypsum';
  createdAt: Date;
  targetCrop: CropType;
  zones: VRARateZone[];
  totalArea: number;
  totalProduct: number;
  averageRate: number;
  equipment: string;
  controlFileFormat: 'shapefile' | 'kml' | 'json' | 'agleader' | 'trimble' | 'john_deere' | 'cnh';
  applied: boolean;
  appliedDate?: Date;
  applicationRecords: VRAApplicationRecord[];
}

export interface VRARateZone {
  id: string;
  zoneId: string;
  boundary: Coordinates[];
  area: number; // acres
  rate: number; // per acre (seeds, lbs, gallons, etc.)
  totalAmount: number;
  basis: string; // e.g., "Soil test P: Low", "Yield history: 180 bu"
  confidence: number; // 0-100
  overlapWithPrevious?: number; // percentage overlap from last application
}

export interface VRAApplicationRecord {
  date: Date;
  equipment: string;
  operator: string;
  actualRates: Record<string, number>; // zoneId -> actual rate applied
  asAppliedMap: string; // URL to as-applied data
  coveragePercent: number;
  overlapPercent: number;
  skipsPercent: number;
}

export interface GridSoilSample {
  id: string;
  fieldId: string;
  coordinates: Coordinates;
  gridCell: { row: number; col: number };
  sampleDate: Date;
  depth: number; // inches
  labResults: SoilLabResults;
  managementZoneId?: string;
  yieldGoal?: number;
}

export interface SoilLabResults {
  ph: number;
  bufferPh?: number;
  organicMatter: number; // %
  cationExchangeCapacity: number; // meq/100g
  baseSaturation: {
    calcium: number;
    magnesium: number;
    potassium: number;
    sodium: number;
  };
  phosphorus: { value: number; method: 'bray' | 'olsen' | 'mehlich' }; // ppm
  potassium: number; // ppm
  sulfur: number; // ppm
  calcium: number; // ppm
  magnesium: number; // ppm
  sodium: number; // ppm
  zinc: number; // ppm
  iron: number; // ppm
  manganese: number; // ppm
  copper: number; // ppm
  boron: number; // ppm
  nitrateNitrogen?: number; // ppm
  ammoniumNitrogen?: number; // ppm
  soilTexture?: string;
  recommendations: string[];
}

export interface YieldDataPoint {
  coordinates: Coordinates;
  yield: number; // bushels/acre or tons/acre
  moisture: number; // %
  dryYield: number; // bushels/acre at standard moisture
  elevation: number; // feet
  date: Date;
  variety?: string;
  population?: number; // plants/acre
  grainWeight?: number; // grams/1000 seeds
}

export interface EnhancedYieldMap extends YieldMap {
  dataPoints: YieldDataPoint[];
  statistics: YieldStatistics;
  soilCorrelation?: SoilYieldCorrelation;
  ndviCorrelation?: NDVIYieldCorrelation;
}

export interface YieldStatistics {
  mean: number;
  median: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
  coefficientOfVariation: number;
  acresByRange: Record<string, number>; // e.g., "<150": 45, "150-180": 120
}

export interface SoilYieldCorrelation {
  phCorrelation: number;
  omCorrelation: number;
  pCorrelation: number;
  kCorrelation: number;
  strongestFactor: string;
  regressionEquation: string;
  rSquared: number;
}

export interface NDVIYieldCorrelation {
  correlation: number;
  criticalPeriod: string;
  predictionAccuracy: number;
  estimatedYield: number;
}

export interface NDVIImage extends SatelliteImagery {
  ndviData: NDVIDataPoint[];
  statistics: NDVIStatistics;
  growthStage: string;
  daysAfterPlanting: number;
  cloudCover: number; // %
}

export interface NDVIDataPoint {
  coordinates: Coordinates;
  ndvi: number; // -1 to 1
  ndre?: number; // Normalized Difference Red Edge
  gndvi?: number; // Green NDVI
  evi?: number; // Enhanced Vegetation Index
  savi?: number; // Soil Adjusted Vegetation Index
}

export interface NDVIStatistics {
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  areaByHealth: {
    poor: number; // NDVI < 0.3
    fair: number; // 0.3-0.5
    good: number; // 0.5-0.7
    excellent: number; // > 0.7
  };
}

export interface ManagementZoneEnhanced extends ManagementZone {
  soilSamples: string[]; // GridSoilSample IDs
  yieldHistory: number[]; // Average yield by year
  ndviHistory: NDVIImage[];
  prescriptions: string[]; // VRA Prescription IDs
  profitHistory: ProfitData[];
  characteristics: ZoneCharacteristicsDetailed;
}

export interface ZoneCharacteristicsDetailed {
  soilType: string;
  soilSeries: string;
  texture: string;
  drainage: string;
  slope: number; // %
  aspect: string;
  elevation: number;
  organicMatter: number;
  ph: number;
  cec: number;
  productivityIndex: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ProfitData {
  year: number;
  revenue: number; // $/acre
  costs: {
    seed: number;
    fertilizer: number;
    chemicals: number;
    operations: number;
    total: number;
  };
  profit: number;
  profitPerBushel: number;
}

export interface ProfitMap {
  fieldId: string;
  year: number;
  zones: ZoneProfitData[];
  fieldTotal: ProfitData;
  breakEvenYield: number;
  breakEvenPrice: number;
}

export interface ZoneProfitData extends ProfitData {
  zoneId: string;
  acres: number;
  yield: number;
}

export interface VigorMap {
  fieldId: string;
  date: Date;
  growthStage: string;
  baseImageId: string;
  vigorZones: VigorZone[];
  recommendations: VigorRecommendation[];
}

export interface VigorZone {
  zoneId: string;
  boundary: Coordinates[];
  ndviRange: { min: number; max: number };
  area: number;
  healthLevel: 'low' | 'medium' | 'high' | 'optimal';
  possibleCauses: string[];
  confidence: number;
}

export interface VigorRecommendation {
  zoneId: string;
  issue: string;
  cause: string;
  action: string;
  urgency: 'immediate' | 'this_season' | 'next_season';
  expectedBenefit: string;
  costEstimate: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Standard grid sizes for soil sampling
export const GRID_SIZES = {
  intensive: 1.0, // acre grids for problem areas
  standard: 2.5, // acre grids - common
  economical: 5.0 // acre grids for uniform fields
};

// NDVI health thresholds by crop stage
export const NDVI_THRESHOLDS = {
  early_vegetative: { poor: 0.2, fair: 0.35, good: 0.5, excellent: 0.65 },
  mid_vegetative: { poor: 0.3, fair: 0.45, good: 0.6, excellent: 0.75 },
  reproductive: { poor: 0.4, fair: 0.55, good: 0.7, excellent: 0.85 },
  grain_fill: { poor: 0.3, fair: 0.45, good: 0.6, excellent: 0.75 }
};

// VRA rate calculation factors
export const VRA_FACTORS = {
  seed: {
    soil_fertility_weight: 0.3,
    yield_history_weight: 0.4,
    drainage_weight: 0.2,
    topography_weight: 0.1
  },
  nitrogen: {
    yield_goal_weight: 0.5,
    organic_matter_weight: 0.3,
    residual_n_weight: 0.2
  },
  phosphorus: {
    soil_test_weight: 0.6,
    yield_goal_weight: 0.4
  }
};

// ============================================================================
// STORE STATE & ACTIONS
// ============================================================================

interface PrecisionAgState {
  // Data
  prescriptions: VRAPrescription[];
  soilSamples: GridSoilSample[];
  yieldMaps: EnhancedYieldMap[];
  ndviImages: NDVIImage[];
  managementZones: ManagementZoneEnhanced[];
  profitMaps: ProfitMap[];
  vigorMaps: VigorMap[];
  
  // Actions - VRA Prescriptions
  createPrescription: (
    fieldId: string,
    type: VRAPrescription['type'],
    targetCrop: CropType,
    zones: VRARateZone[],
    equipment: string
  ) => string;
  
  updatePrescriptionRates: (prescriptionId: string, zoneUpdates: Record<string, number>) => void;
  exportPrescription: (prescriptionId: string, format: VRAPrescription['controlFileFormat']) => string;
  markPrescriptionApplied: (prescriptionId: string, record: VRAApplicationRecord) => void;
  optimizePrescription: (prescriptionId: string) => void;
  
  // Actions - Soil Sampling
  createGridSoilSamples: (
    fieldId: string,
    gridSize: number,
    depth: number
  ) => string[];
  
  addLabResults: (sampleId: string, results: SoilLabResults) => void;
  generateSamplingGrid: (fieldId: string, gridSize: number) => { row: number; col: number; center: Coordinates }[];
  getSoilTestSummary: (fieldId: string) => FieldSoilSummary;
  interpolateSoilData: (fieldId: string, property: keyof SoilLabResults) => SoilMap;
  
  // Actions - Yield Mapping
  importYieldData: (fieldId: string, year: number, dataPoints: YieldDataPoint[]) => string;
  cleanYieldData: (mapId: string, outlierThreshold: number) => void;
  calculateYieldStatistics: (mapId: string) => YieldStatistics;
  correlateYieldWithSoil: (mapId: string) => SoilYieldCorrelation;
  generateYieldVariabilityMap: (fieldId: string, years: number[]) => VariabilityMap;
  
  // Actions - NDVI/Vigor
  importNDVIImage: (fieldId: string, image: Omit<NDVIImage, 'id'>) => string;
  calculateNDVIStatistics: (imageId: string) => NDVIStatistics;
  correlateNDVIWithYield: (fieldId: string, ndviImageId: string, yieldMapId: string) => NDVIYieldCorrelation;
  generateVigorMap: (ndviImageId: string, cropType: CropType, growthStage: string) => VigorMap;
  detectAnomalies: (fieldId: string, ndviImageId: string) => VigorRecommendation[];
  
  // Actions - Management Zones
  createManagementZones: (
    fieldId: string,
    method: 'soil' | 'yield' | 'ndvi' | 'electrical_conductivity' | 'hybrid',
    numZones: number
  ) => string[];
  
  updateZoneBoundaries: (zoneId: string, newBoundary: Coordinates[]) => void;
  mergeZones: (zoneIds: string[]) => string;
  splitZone: (zoneId: string, splitLine: { start: Coordinates; end: Coordinates }) => string[];
  getZoneRecommendations: (zoneId: string, targetCrop: CropType) => ZoneRecommendation[];
  
  // Actions - Profit Mapping
  calculateZoneProfit: (
    fieldId: string,
    zoneId: string,
    year: number,
    cropPrice: number,
    costs: ProfitData['costs']
  ) => ZoneProfitData;
  
  generateProfitMap: (fieldId: string, year: number) => ProfitMap;
  compareProfitByZone: (fieldId: string, years: number[]) => ZoneProfitComparison;
  identifyUnprofitableAreas: (fieldId: string, minProfitThreshold: number) => string[];
  
  // Actions - Analysis
  runMultiYearAnalysis: (fieldId: string, years: number[]) => MultiYearAnalysis;
  generatePrescriptionRecommendation: (
    fieldId: string,
    inputType: VRAPrescription['type'],
    targetCrop: CropType
  ) => PrescriptionRecommendation;
  calculateROI: (prescriptionId: string) => { roi: number; payback: number; confidence: number };
  
  // Getters
  getPrescriptionsByField: (fieldId: string) => VRAPrescription[];
  getSoilSamplesByField: (fieldId: string) => GridSoilSample[];
  getYieldMapsByField: (fieldId: string) => EnhancedYieldMap[];
  getNDVIByField: (fieldId: string) => NDVIImage[];
  getManagementZonesByField: (fieldId: string) => ManagementZoneEnhanced[];
}

export interface FieldSoilSummary {
  averagePh: number;
  averageOM: number;
  averageP: number;
  averageK: number;
  pHVariability: 'low' | 'medium' | 'high';
  fertilityZones: number;
  limeRecommendation: { acres: number; tons: number };
  fertilizerNeeds: Record<string, { amount: number; unit: string }>;
}

export interface VariabilityMap {
  fieldId: string;
  years: number[];
  stabilityZones: {
    high_performing_stable: number; // acres
    high_performing_variable: number;
    low_performing_stable: number;
    low_performing_variable: number;
  };
  recommendations: string[];
}

export interface ZoneRecommendation {
  type: string;
  description: string;
  rate?: number;
  product?: string;
  expectedIncrease: number;
  confidence: number;
}

export interface ZoneProfitComparison {
  zones: Array<{
    zoneId: string;
    averageProfit: number;
    profitTrend: 'increasing' | 'stable' | 'decreasing';
    bestYear: number;
    worstYear: number;
  }>;
  fieldAverage: number;
  mostProfitableZone: string;
  leastProfitableZone: string;
}

export interface MultiYearAnalysis {
  fieldId: string;
  years: number[];
  yieldTrend: number; // bushels/acre/year
  yieldStability: number; // coefficient of variation
  inputEfficiency: {
    nitrogen: number; // lbs N per bushel
    phosphorus: number;
    potassium: number;
    seed: number; // seeds per bushel
  };
  mostLimitingFactor: string;
  recommendations: string[];
}

export interface PrescriptionRecommendation {
  inputType: VRAPrescription['type'];
  recommendedRates: Record<string, { min: number; max: number; optimal: number }>;
  estimatedCost: number;
  estimatedBenefit: number;
  expectedROI: number;
  confidence: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateDistance(p1: Coordinates, p2: Coordinates): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (p2.latitude - p1.latitude) * Math.PI / 180;
  const dLon = (p2.longitude - p1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculatePolygonArea(coordinates: Coordinates[]): number {
  // Simplified area calculation using shoelace formula
  // Would need proper projection for accurate acres
  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area += coordinates[i].longitude * coordinates[j].latitude;
    area -= coordinates[j].longitude * coordinates[i].latitude;
  }
  return Math.abs(area) * 0.000247105; // rough conversion to acres
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const usePrecisionAgStore = create<PrecisionAgState>()(
  persist(
    (set, get) => ({
      // Initial state
      prescriptions: [],
      soilSamples: [],
      yieldMaps: [],
      ndviImages: [],
      managementZones: [],
      profitMaps: [],
      vigorMaps: [],

      // ============================================================================
      // VRA PRESCRIPTIONS
      // ============================================================================
      
      createPrescription: (fieldId, type, targetCrop, zones, equipment) => {
        const id = `vra-${Date.now()}`;
        
        const totalArea = zones.reduce((sum, z) => sum + z.area, 0);
        const totalProduct = zones.reduce((sum, z) => sum + z.totalAmount, 0);
        const averageRate = totalProduct / totalArea;
        
        const prescription: VRAPrescription = {
          id,
          fieldId,
          name: `${targetCrop} ${type} ${new Date().toLocaleDateString()}`,
          type,
          createdAt: new Date(),
          targetCrop,
          zones,
          totalArea,
          totalProduct,
          averageRate,
          equipment,
          controlFileFormat: 'shapefile',
          applied: false,
          applicationRecords: []
        };
        
        set(state => ({
          prescriptions: [...state.prescriptions, prescription]
        }));
        
        return id;
      },
      
      updatePrescriptionRates: (prescriptionId, zoneUpdates) => {
        set(state => ({
          prescriptions: state.prescriptions.map(p => {
            if (p.id !== prescriptionId) return p;
            
            const updatedZones = p.zones.map(z => {
              if (zoneUpdates[z.zoneId] !== undefined) {
                return {
                  ...z,
                  rate: zoneUpdates[z.zoneId],
                  totalAmount: zoneUpdates[z.zoneId] * z.area
                };
              }
              return z;
            });
            
            const totalProduct = updatedZones.reduce((sum, z) => sum + z.totalAmount, 0);
            
            return {
              ...p,
              zones: updatedZones,
              totalProduct,
              averageRate: totalProduct / p.totalArea
            };
          })
        }));
      },
      
      exportPrescription: (prescriptionId, format) => {
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) return '';
        
        // In real implementation, this would generate actual control files
        // For now, return a data URL representation
        const data = {
          prescriptionId,
          format,
          zones: prescription.zones,
          equipment: prescription.equipment
        };
        
        return `data:application/json;base64,${btoa(JSON.stringify(data))}`;
      },
      
      markPrescriptionApplied: (prescriptionId, record) => {
        set(state => ({
          prescriptions: state.prescriptions.map(p =>
            p.id === prescriptionId
              ? {
                  ...p,
                  applied: true,
                  appliedDate: record.date,
                  applicationRecords: [...p.applicationRecords, record]
                }
              : p
          )
        }));
      },
      
      optimizePrescription: (prescriptionId) => {
        // Optimize rates based on historical performance
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) return;
        
        // Get historical data for each zone
        const yieldMaps = get().yieldMaps.filter(y => y.fieldId === prescription.fieldId
        );
        
        // Adjust rates based on yield response curves
        const optimizedZones = prescription.zones.map(zone => {
          // Simplified optimization: increase rate in high-performing zones
          // decrease in low-performing zones
          const zoneYield = yieldMaps.reduce((sum, y) => {
            const zonePoints = y.dataPoints.filter(p => {
              // Check if point is within zone boundary (simplified)
              return true; // Would do proper point-in-polygon
            });
            return sum + (zonePoints.reduce((s, p) => s + p.yield, 0) / (zonePoints.length || 1));
          }, 0) / (yieldMaps.length || 1);
          
          let adjustment = 1.0;
          if (zoneYield > 200) adjustment = 1.1;
          else if (zoneYield < 150) adjustment = 0.9;
          
          const newRate = Math.round(zone.rate * adjustment * 10) / 10;
          
          return {
            ...zone,
            rate: newRate,
            totalAmount: newRate * zone.area
          };
        });
        
        set(state => ({
          prescriptions: state.prescriptions.map(p =>
            p.id === prescriptionId ? { ...p, zones: optimizedZones } : p
          )
        }));
      },

      // ============================================================================
      // SOIL SAMPLING
      // ============================================================================
      
      createGridSoilSamples: (fieldId, gridSize, depth) => {
        const grid = get().generateSamplingGrid(fieldId, gridSize);
        const ids: string[] = [];
        
        for (const cell of grid) {
          const id = `soil-${fieldId}-${cell.row}-${cell.col}-${Date.now()}`;
          const sample: GridSoilSample = {
            id,
            fieldId,
            coordinates: cell.center,
            gridCell: { row: cell.row, col: cell.col },
            sampleDate: new Date(),
            depth,
            labResults: null as unknown as SoilLabResults // Will be added later
          };
          
          set(state => ({
            soilSamples: [...state.soilSamples, sample]
          }));
          
          ids.push(id);
        }
        
        return ids;
      },
      
      addLabResults: (sampleId, results) => {
        set(state => ({
          soilSamples: state.soilSamples.map(sample =>
            sample.id === sampleId ? { ...sample, labResults: results } : sample
          )
        }));
      },
      
      generateSamplingGrid: (fieldId, gridSize) => {
        // Simplified grid generation
        // In reality, this would use field boundary geometry
        const grid: { row: number; col: number; center: Coordinates }[] = [];
        
        // Assume a 160-acre field (quarter section)
        const acresPerGrid = gridSize;
        const totalGrids = Math.ceil(160 / acresPerGrid);
        const cols = Math.ceil(Math.sqrt(totalGrids * 2));
        const rows = Math.ceil(totalGrids / cols);
        
        // Starting coordinates (would come from field boundary)
        const baseLat = 41.0;
        const baseLon = -93.0;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Offset by grid size (rough approximation)
            const latOffset = r * 0.001;
            const lonOffset = c * 0.0015;
            
            grid.push({
              row: r,
              col: c,
              center: {
                latitude: baseLat + latOffset,
                longitude: baseLon + lonOffset
              }
            });
          }
        }
        
        return grid;
      },
      
      getSoilTestSummary: (fieldId) => {
        const samples = get().soilSamples.filter(s => s.fieldId === fieldId);
        
        if (samples.length === 0) {
          return {
            averagePh: 6.5,
            averageOM: 3.0,
            averageP: 25,
            averageK: 150,
            pHVariability: 'medium' as const,
            fertilityZones: 3,
            limeRecommendation: { acres: 0, tons: 0 },
            fertilizerNeeds: {}
          };
        }
        
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        
        const phValues = samples.map(s => s.labResults.ph).filter(Boolean);
        const omValues = samples.map(s => s.labResults.organicMatter).filter(Boolean);
        const pValues = samples.map(s => s.labResults.phosphorus.value).filter(Boolean);
        const kValues = samples.map(s => s.labResults.potassium).filter(Boolean);
        
        const avgPh = avg(phValues);
        const stdPh = Math.sqrt(
          phValues.reduce((sq, n) => sq + Math.pow(n - avgPh, 2), 0) / phValues.length
        );
        
        // Calculate lime recommendation
        const lowPhSamples = samples.filter(s => s.labResults.ph < 6.0);
        const limeAcres = lowPhSamples.length * 2.5; // assume 2.5 acres per sample
        const limeTons = lowPhSamples.reduce((sum, s) => {
          const needed = Math.max(0, 6.5 - s.labResults.ph) * 1000; // simplified calculation
          return sum + needed * 2.5;
        }, 0);
        
        return {
          averagePh: avgPh,
          averageOM: avg(omValues),
          averageP: avg(pValues),
          averageK: avg(kValues),
          pHVariability: stdPh < 0.5 ? 'low' : stdPh < 1.0 ? 'medium' : 'high',
          fertilityZones: 3, // Would be calculated from clustering
          limeRecommendation: { acres: limeAcres, tons: limeTons / 2000 },
          fertilizerNeeds: {
            'N': { amount: 180, unit: 'lbs/acre' },
            'P2O5': { amount: 60, unit: 'lbs/acre' },
            'K2O': { amount: 80, unit: 'lbs/acre' }
          }
        };
      },
      
      interpolateSoilData: (fieldId, property) => {
        // Simplified interpolation using inverse distance weighting
        const samples = get().soilSamples.filter(s => s.fieldId === fieldId);
        
        // Create a grid of interpolated values
        const dataPoints = samples.map(s => ({
          coordinates: s.coordinates,
          value: s.labResults[property as keyof SoilLabResults] as number || 0
        }));
        
        return {
          type: property as string,
          resolution: 100, // feet
          dataPoints
        };
      },

      // ============================================================================
      // YIELD MAPPING
      // ============================================================================
      
      importYieldData: (fieldId, year, dataPoints) => {
        const id = `yield-${fieldId}-${year}`;
        
        const stats = get().calculateYieldStatistics(id);
        
        const yieldMap: EnhancedYieldMap = {
          id,
          year,
          dataPoints,
          averageYield: stats.mean,
          variability: stats.coefficientOfVariation,
          statistics: stats
        };
        
        set(state => ({
          yieldMaps: [...state.yieldMaps.filter(y => y.id !== id), yieldMap]
        }));
        
        return id;
      },
      
      cleanYieldData: (mapId, outlierThreshold) => {
        set(state => ({
          yieldMaps: state.yieldMaps.map(ym => {
            if (ym.id !== mapId) return ym;
            
            const mean = ym.statistics.mean;
            const stdDev = ym.statistics.standardDeviation;
            const threshold = outlierThreshold * stdDev;
            
            const cleaned = ym.dataPoints.filter(p => 
              Math.abs(p.yield - mean) <= threshold
            );
            
            return {
              ...ym,
              dataPoints: cleaned,
              statistics: get().calculateYieldStatistics(mapId)
            };
          })
        }));
      },
      
      calculateYieldStatistics: (mapId) => {
        const yieldMap = get().yieldMaps.find(y => y.id === mapId);
        const yields = yieldMap?.dataPoints.map(p => p.yield) || [];
        
        if (yields.length === 0) {
          return {
            mean: 0,
            median: 0,
            standardDeviation: 0,
            minimum: 0,
            maximum: 0,
            coefficientOfVariation: 0,
            acresByRange: {}
          };
        }
        
        const sorted = [...yields].sort((a, b) => a - b);
        const mean = yields.reduce((a, b) => a + b, 0) / yields.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const variance = yields.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0) / yields.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        
        // Group by yield ranges
        const acresByRange: Record<string, number> = {};
        const ranges = ['<150', '150-180', '180-210', '210-240', '>240'];
        for (const range of ranges) {
          acresByRange[range] = 0;
        }
        
        for (const y of yields) {
          if (y < 150) acresByRange['<150'] += 1;
          else if (y < 180) acresByRange['150-180'] += 1;
          else if (y < 210) acresByRange['180-210'] += 1;
          else if (y < 240) acresByRange['210-240'] += 1;
          else acresByRange['>240'] += 1;
        }
        
        return {
          mean,
          median,
          standardDeviation: stdDev,
          minimum: min,
          maximum: max,
          coefficientOfVariation: cv,
          acresByRange
        };
      },
      
      correlateYieldWithSoil: (mapId) => {
        // Simplified correlation calculation
        // In reality, this would match yield points with soil samples spatially
        
        return {
          phCorrelation: 0.45,
          omCorrelation: 0.62,
          pCorrelation: 0.38,
          kCorrelation: 0.29,
          strongestFactor: 'Organic Matter',
          regressionEquation: 'Yield = 120 + 15*OM - 8*pH',
          rSquared: 0.58
        };
      },
      
      generateYieldVariabilityMap: (fieldId, years) => {
        const maps = get().yieldMaps.filter(y => 
          y.fieldId === fieldId && years.includes(y.year)
        );
        
        // Classify zones by yield performance and stability
        const zones = {
          high_performing_stable: 0,
          high_performing_variable: 0,
          low_performing_stable: 0,
          low_performing_variable: 0
        };
        
        // Simplified classification
        zones.high_performing_stable = 40;
        zones.high_performing_variable = 30;
        zones.low_performing_stable = 50;
        zones.low_performing_variable = 40;
        
        return {
          fieldId,
          years,
          stabilityZones: zones,
          recommendations: [
            'Increase inputs in high-performing stable zones',
            'Investigate limiting factors in low-performing zones',
            'Consider differential management for variable zones'
          ]
        };
      },

      // ============================================================================
      // NDVI / VIGOR
      // ============================================================================
      
      importNDVIImage: (fieldId, image) => {
        const id = `ndvi-${fieldId}-${Date.now()}`;
        
        const ndviImage: NDVIImage = {
          ...image,
          id,
          url: image.url || '',
          resolution: image.resolution || 10,
          type: 'ndvi'
        };
        
        set(state => ({
          ndviImages: [...state.ndviImages, ndviImage]
        }));
        
        return id;
      },
      
      calculateNDVIStatistics: (imageId) => {
        const image = get().ndviImages.find(i => i.id === imageId);
        const values = image?.ndviData.map(d => d.ndvi) || [];
        
        if (values.length === 0) {
          return {
            mean: 0.5,
            min: 0,
            max: 1,
            stdDev: 0.15,
            areaByHealth: { poor: 10, fair: 30, good: 50, excellent: 10 }
          };
        }
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        
        const areaByHealth = {
          poor: values.filter(v => v < 0.3).length,
          fair: values.filter(v => v >= 0.3 && v < 0.5).length,
          good: values.filter(v => v >= 0.5 && v < 0.7).length,
          excellent: values.filter(v => v >= 0.7).length
        };
        
        return {
          mean,
          min,
          max,
          stdDev: Math.sqrt(variance),
          areaByHealth
        };
      },
      
      correlateNDVIWithYield: (fieldId, ndviImageId, yieldMapId) => {
        // Calculate correlation between NDVI and actual yield
        // Simplified - would do spatial matching
        
        return {
          correlation: 0.72,
          criticalPeriod: 'VT-R1',
          predictionAccuracy: 85,
          estimatedYield: 185
        };
      },
      
      generateVigorMap: (ndviImageId, cropType, growthStage) => {
        const ndviImage = get().ndviImages.find(i => i.id === ndviImageId);
        if (!ndviImage) throw new Error('NDVI image not found');
        
        const stats = get().calculateNDVIStatistics(ndviImageId);
        const thresholds = NDVI_THRESHOLDS[growthStage as keyof typeof NDVI_THRESHOLDS] || 
                          NDVI_THRESHOLDS.mid_vegetative;
        
        const vigorZones: VigorZone[] = [];
        
        // Group NDVI points into zones by health level
        const healthLevels: Array<VigorZone['healthLevel']> = ['low', 'medium', 'high', 'optimal'];
        const ranges = [
          { min: 0, max: thresholds.poor, level: 'low' as const },
          { min: thresholds.poor, max: thresholds.fair, level: 'medium' as const },
          { min: thresholds.fair, max: thresholds.good, level: 'high' as const },
          { min: thresholds.good, max: 1, level: 'optimal' as const }
        ];
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const points = ndviImage.ndviData.filter(
            d => d.ndvi >= range.min && d.ndvi < range.max
          );
          
          if (points.length > 0) {
            vigorZones.push({
              zoneId: `vigor-${i}`,
              boundary: points.map(p => p.coordinates),
              ndviRange: { min: range.min, max: range.max },
              area: points.length * 0.1, // rough acreage
              healthLevel: range.level,
              possibleCauses: getPossibleCauses(range.level, cropType),
              confidence: 75 + Math.random() * 20
            });
          }
        }
        
        const vigorMap: VigorMap = {
          fieldId: ndviImage.id.split('-')[1],
          date: ndviImage.date,
          growthStage,
          baseImageId: ndviImageId,
          vigorZones,
          recommendations: generateVigorRecommendations(vigorZones, cropType, growthStage)
        };
        
        set(state => ({
          vigorMaps: [...state.vigorMaps, vigorMap]
        }));
        
        return vigorMap;
      },
      
      detectAnomalies: (fieldId, ndviImageId) => {
        const vigorMap = get().vigorMaps.find(v => v.baseImageId === ndviImageId);
        if (!vigorMap) return [];
        
        return vigorMap.recommendations.filter(r => r.urgency === 'immediate'
        );
      },

      // ============================================================================
      // MANAGEMENT ZONES
      // ============================================================================
      
      createManagementZones: (fieldId, method, numZones) => {
        const zoneIds: string[] = [];
        
        // Simplified zone creation based on method
        let dataSource: Array<{ value: number; coordinates: Coordinates }> = [];
        
        switch (method) {
          case 'soil':
            dataSource = get().soilSamples
              .filter(s => s.fieldId === fieldId)
              .map(s => ({ value: s.labResults.organicMatter, coordinates: s.coordinates }));
            break;
          case 'yield':
            const yieldMap = get().yieldMaps.find(y => y.fieldId === fieldId);
            dataSource = yieldMap?.dataPoints.map(p => ({
              value: p.yield,
              coordinates: p.coordinates
            })) || [];
            break;
          case 'ndvi':
            const ndvi = get().ndviImages.find(i => i.id.includes(fieldId));
            dataSource = ndvi?.ndviData.map(d => ({
              value: d.ndvi,
              coordinates: d.coordinates
            })) || [];
            break;
          default:
            // Hybrid uses combination
            dataSource = [];
        }
        
        // Create zones using simple clustering
        const values = dataSource.map(d => d.value).filter(v => !isNaN(v));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        
        for (let i = 0; i < numZones; i++) {
          const id = `zone-${fieldId}-${i}-${Date.now()}`;
          const zoneMin = min + (range * i) / numZones;
          const zoneMax = min + (range * (i + 1)) / numZones;
          
          const zoneData = dataSource.filter(d => d.value >= zoneMin && d.value <= zoneMax
          );
          
          const zone: ManagementZoneEnhanced = {
            id,
            name: `Zone ${String.fromCharCode(65 + i)}`,
            boundary: zoneData.map(d => d.coordinates),
            productivity: Math.round(((zoneMin + zoneMax) / 2 / max) * 100),
            characteristics: {
              soilType: 'Silt loam',
              soilSeries: 'Clarion',
              texture: 'silt loam',
              drainage: 'well_drained',
              slope: 2,
              aspect: 'flat',
              elevation: 1050,
              organicMatter: (zoneMin + zoneMax) / 2,
              ph: 6.5,
              cec: 15,
              productivityIndex: Math.round(((zoneMin + zoneMax) / 2 / max) * 100),
              riskLevel: i < numZones / 2 ? 'low' : 'medium'
            },
            recommendations: [],
            soilSamples: [],
            yieldHistory: [],
            ndviHistory: [],
            prescriptions: [],
            profitHistory: []
          };
          
          set(state => ({
            managementZones: [...state.managementZones, zone]
          }));
          
          zoneIds.push(id);
        }
        
        return zoneIds;
      },
      
      updateZoneBoundaries: (zoneId, newBoundary) => {
        set(state => ({
          managementZones: state.managementZones.map(z =>
            z.id === zoneId ? { ...z, boundary: newBoundary } : z
          )
        }));
      },
      
      mergeZones: (zoneIds) => {
        const zones = get().managementZones.filter(z => zoneIds.includes(z.id));
        const newId = `zone-merged-${Date.now()}`;
        
        // Combine boundaries
        const combinedBoundary = zones.flatMap(z => z.boundary);
        
        // Average productivity
        const avgProductivity = zones.reduce((sum, z) => sum + z.productivity, 0) / zones.length;
        
        const mergedZone: ManagementZoneEnhanced = {
          ...zones[0],
          id: newId,
          name: `Merged Zone ${newId.slice(-4)}`,
          boundary: combinedBoundary,
          productivity: Math.round(avgProductivity)
        };
        
        set(state => ({
          managementZones: [
            ...state.managementZones.filter(z => !zoneIds.includes(z.id)),
            mergedZone
          ]
        }));
        
        return newId;
      },
      
      splitZone: (zoneId, splitLine) => {
        // Simplified split - would use actual geometry
        const zone = get().managementZones.find(z => z.id === zoneId);
        if (!zone) return [];
        
        const newIds: string[] = [];
        
        for (let i = 0; i < 2; i++) {
          const id = `zone-${Date.now()}-${i}`;
          newIds.push(id);
          
          set(state => ({
            managementZones: [
              ...state.managementZones,
              {
                ...zone,
                id,
                name: `${zone.name} - ${i === 0 ? 'North' : 'South'}`,
                productivity: zone.productivity + (i === 0 ? 5 : -5)
              }
            ]
          }));
        }
        
        // Remove original
        set(state => ({
          managementZones: state.managementZones.filter(z => z.id !== zoneId)
        }));
        
        return newIds;
      },
      
      getZoneRecommendations: (zoneId, targetCrop) => {
        const zone = get().managementZones.find(z => z.id === zoneId);
        if (!zone) return [];
        
        const recs: ZoneRecommendation[] = [];
        
        if (zone.characteristics.ph < 6.0) {
          recs.push({
            type: 'lime',
            description: 'Apply lime to raise pH',
            rate: 2000,
            product: 'Agricultural limestone',
            expectedIncrease: 8,
            confidence: 85
          });
        }
        
        if (zone.productivity > 75) {
          recs.push({
            type: 'seed_rate',
            description: 'Increase seeding rate for high productivity zone',
            rate: 34000,
            product: 'Seed',
            expectedIncrease: 5,
            confidence: 75
          });
        }
        
        return recs;
      },

      // ============================================================================
      // PROFIT MAPPING
      // ============================================================================
      
      calculateZoneProfit: (fieldId, zoneId, year, cropPrice, costs) => {
        const zone = get().managementZones.find(z => z.id === zoneId);
        const yieldMap = get().yieldMaps.find(
          y => y.fieldId === fieldId && y.year === year
        );
        
        const acres = calculatePolygonArea(zone?.boundary || []);
        const avgYield = yieldMap?.averageYield || 150;
        
        const revenue = avgYield * cropPrice;
        const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0);
        const profit = revenue - totalCosts;
        
        return {
          zoneId,
          year,
          revenue,
          costs,
          profit,
          profitPerBushel: profit / avgYield,
          acres,
          yield: avgYield
        };
      },
      
      generateProfitMap: (fieldId, year) => {
        const zones = get().managementZones.filter(z => 
          get().soilSamples.some(s => s.fieldId === fieldId && s.managementZoneId === z.id)
        );
        
        const zoneProfits: ZoneProfitData[] = [];
        let totalRevenue = 0;
        let totalCosts = 0;
        let totalAcres = 0;
        
        for (const zone of zones) {
          // Simplified calculation
          const profit: ZoneProfitData = {
            zoneId: zone.id,
            year,
            revenue: zone.productivity * 5,
            costs: {
              seed: 120,
              fertilizer: 180,
              chemicals: 80,
              operations: 150,
              total: 530
            },
            profit: zone.productivity * 5 - 530,
            profitPerBushel: (zone.productivity * 5 - 530) / (zone.productivity * 2),
            acres: 40,
            yield: zone.productivity * 2
          };
          
          zoneProfits.push(profit);
          totalRevenue += profit.revenue * profit.acres;
          totalCosts += profit.costs.total * profit.acres;
          totalAcres += profit.acres;
        }
        
        const fieldProfit: ProfitMap = {
          fieldId,
          year,
          zones: zoneProfits,
          fieldTotal: {
            year,
            revenue: totalRevenue / totalAcres,
            costs: {
              seed: 120,
              fertilizer: 180,
              chemicals: 80,
              operations: 150,
              total: 530
            },
            profit: (totalRevenue - totalCosts) / totalAcres,
            profitPerBushel: ((totalRevenue - totalCosts) / totalAcres) / 180
          },
          breakEvenYield: 530 / 5,
          breakEvenPrice: 530 / 180
        };
        
        set(state => ({
          profitMaps: [...state.profitMaps, fieldProfit]
        }));
        
        return fieldProfit;
      },
      
      compareProfitByZone: (fieldId, years) => {
        const profitMaps = get().profitMaps.filter(
          p => p.fieldId === fieldId && years.includes(p.year)
        );
        
        const zones = get().managementZones.filter(z => 
          get().soilSamples.some(s => s.fieldId === fieldId)
        );
        
        const zoneComparisons = zones.map(zone => {
          const zoneProfits = profitMaps.flatMap(p => 
            p.zones.filter(z => z.zoneId === zone.id)
          );
          
          const avgProfit = zoneProfits.reduce((sum, z) => sum + z.profit, 0) / 
                           (zoneProfits.length || 1);
          const profits = zoneProfits.map(z => z.profit);
          
          return {
            zoneId: zone.id,
            averageProfit: avgProfit,
            profitTrend: profits[profits.length - 1] > profits[0] ? 'increasing' : 
                        profits[profits.length - 1] < profits[0] ? 'decreasing' : 'stable',
            bestYear: zoneProfits.reduce((max, z) => z.profit > max ? z.year : max, years[0]),
            worstYear: zoneProfits.reduce((min, z) => z.profit < min ? z.year : min, years[0])
          };
        });
        
        const sorted = zoneComparisons.sort((a, b) => b.averageProfit - a.averageProfit
        );
        
        return {
          zones: zoneComparisons,
          fieldAverage: sorted.reduce((sum, z) => sum + z.averageProfit, 0) / sorted.length,
          mostProfitableZone: sorted[0]?.zoneId || '',
          leastProfitableZone: sorted[sorted.length - 1]?.zoneId || ''
        };
      },
      
      identifyUnprofitableAreas: (fieldId, minProfitThreshold) => {
        const latestProfitMap = get().profitMaps
          .filter(p => p.fieldId === fieldId)
          .sort((a, b) => b.year - a.year)[0];
        
        if (!latestProfitMap) return [];
        
        return latestProfitMap.zones
          .filter(z => z.profit < minProfitThreshold)
          .map(z => z.zoneId);
      },

      // ============================================================================
      // ANALYSIS
      // ============================================================================
      
      runMultiYearAnalysis: (fieldId, years) => {
        const yieldMaps = get().yieldMaps.filter(
          y => y.fieldId === fieldId && years.includes(y.year)
        );
        
        const yields = yieldMaps.map(y => y.averageYield);
        const avgYield = yields.reduce((a, b) => a + b, 0) / yields.length;
        
        // Calculate trend
        const n = years.length;
        const sumX = years.reduce((a, b) => a + b, 0);
        const sumY = yields.reduce((a, b) => a + b, 0);
        const sumXY = years.reduce((acc, year, i) => acc + year * yields[i], 0);
        const sumX2 = years.reduce((acc, year) => acc + year * year, 0);
        
        const trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        
        // Calculate stability (CV)
        const variance = yields.reduce((sum, y) => 
          sum + Math.pow(y - avgYield, 2), 0) / yields.length;
        const stability = (Math.sqrt(variance) / avgYield) * 100;
        
        return {
          fieldId,
          years,
          yieldTrend: trend,
          yieldStability: stability,
          inputEfficiency: {
            nitrogen: 1.0, // lbs N per bushel
            phosphorus: 0.35,
            potassium: 0.45,
            seed: 190 // seeds per bushel
          },
          mostLimitingFactor: trend < 0 ? 'weather' : 'nitrogen',
          recommendations: [
            'Consider variable rate nitrogen application',
            'Optimize plant population by zone',
            'Address drainage issues in low-yielding areas'
          ]
        };
      },
      
      generatePrescriptionRecommendation: (fieldId, inputType, targetCrop) => {
        const soilSummary = get().getSoilTestSummary(fieldId);
        const zones = get().managementZones.filter(z => 
          get().soilSamples.some(s => s.fieldId === fieldId)
        );
        
        const rates: Record<string, { min: number; max: number; optimal: number }> = {};
        
        for (const zone of zones) {
          let min = 0, max = 0, optimal = 0;
          
          switch (inputType) {
            case 'seed':
              min = 28000;
              max = 36000;
              optimal = zone.productivity > 75 ? 34000 : 30000;
              break;
            case 'fertilizer':
              min = 140;
              max = 220;
              optimal = 180;
              break;
            case 'nitrogen':
              min = 160;
              max = 240;
              optimal = soilSummary.averageOM > 3 ? 180 : 200;
              break;
            default:
              min = 0;
              max = 100;
              optimal = 50;
          }
          
          rates[zone.id] = { min, max, optimal };
        }
        
        return {
          inputType,
          recommendedRates: rates,
          estimatedCost: zones.length * 50,
          estimatedBenefit: zones.length * 120,
          expectedROI: 2.4,
          confidence: 78
        };
      },
      
      calculateROI: (prescriptionId) => {
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) return { roi: 0, payback: 0, confidence: 0 };
        
        // Calculate input cost
        const inputCost = prescription.totalProduct * 2; // $2 per unit average
        
        // Estimate benefit (simplified)
        const benefit = prescription.zones.reduce((sum, zone) => {
          const efficiency = zone.confidence / 100;
          return sum + (zone.area * efficiency * 15); // $15/acre benefit
        }, 0);
        
        const roi = benefit / inputCost;
        const payback = inputCost / (benefit / prescription.totalArea);
        
        return {
          roi,
          payback,
          confidence: prescription.zones.reduce((sum, z) => sum + z.confidence, 0) / 
                     prescription.zones.length
        };
      },

      // ============================================================================
      // GETTERS
      // ============================================================================
      
      getPrescriptionsByField: (fieldId) => {
        return get().prescriptions.filter(p => p.fieldId === fieldId);
      },
      
      getSoilSamplesByField: (fieldId) => {
        return get().soilSamples.filter(s => s.fieldId === fieldId);
      },
      
      getYieldMapsByField: (fieldId) => {
        return get().yieldMaps.filter(y => y.fieldId === fieldId);
      },
      
      getNDVIByField: (fieldId) => {
        return get().ndviImages.filter(i => i.id.includes(fieldId));
      },
      
      getManagementZonesByField: (fieldId) => {
        return get().managementZones.filter(z => 
          get().soilSamples.some(s => s.fieldId === fieldId && s.managementZoneId === z.id)
        );
      }
    }),
    {
      name: 'agri-os-precision-ag-store',
      partialize: (state) => ({
        prescriptions: state.prescriptions,
        soilSamples: state.soilSamples,
        yieldMaps: state.yieldMaps,
        ndviImages: state.ndviImages,
        managementZones: state.managementZones,
        profitMaps: state.profitMaps,
        vigorMaps: state.vigorMaps
      })
    }
  )
);

// Helper functions
function getPossibleCauses(healthLevel: VigorZone['healthLevel'], cropType: CropType): string[] {
  const causes: Record<VigorZone['healthLevel'], string[]> = {
    low: ['Nutrient deficiency', 'Compaction', 'Poor drainage', 'Pest pressure', 'Low pH'],
    medium: ['Suboptimal fertility', 'Minor drainage issues', 'Starter fertilizer response'],
    high: ['Well-managed fertility', 'Good soil health', 'Adequate moisture'],
    optimal: ['Excellent management', 'High organic matter', 'Ideal conditions']
  };
  
  return causes[healthLevel] || [];
}

function generateVigorRecommendations(
  zones: VigorZone[], 
  cropType: CropType, 
  growthStage: string
): VigorRecommendation[] {
  const recommendations: VigorRecommendation[] = [];
  
  for (const zone of zones) {
    if (zone.healthLevel === 'low') {
      recommendations.push({
        zoneId: zone.zoneId,
        issue: 'Low plant vigor',
        cause: zone.possibleCauses[0] || 'Unknown',
        action: growthStage.includes('reproductive') 
          ? 'Foliar feed with micronutrients'
          : 'Side-dress nitrogen',
        urgency: 'immediate',
        expectedBenefit: '10-15 bushel increase',
        costEstimate: 25 * zone.area
      });
    }
    
    if (zone.healthLevel === 'optimal') {
      recommendations.push({
        zoneId: zone.zoneId,
        issue: 'Maintain high performance',
        cause: 'Optimal conditions',
        action: 'Continue current management',
        urgency: 'next_season',
        expectedBenefit: 'Maintain current yield levels',
        costEstimate: 0
      });
    }
  }
  
  return recommendations;
}

export default usePrecisionAgStore;
