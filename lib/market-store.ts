// @ts-nocheck
/**
 * Market Store - Commodity Price Simulation and Trading
 * 
 * Features:
 * - Realistic commodity price volatility
 * - Seasonal price patterns (harvest lows, spring highs)
 * - Basis calculations (local vs CBOT futures)
 * - Futures contracts and hedging
 * - Market news and events impact
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MarketPrices, 
  CommodityPrice, 
  FuturesContract,
  CropType,
  GameState,
} from '../types';

// Market Store State
interface MarketState {
  currentPrices: Record<CropType, CommodityPrice>;
  futures: FuturesContract[];
  basisHistory: Record<string, number[]>; // location -> basis history
  priceHistory: Record<CropType, PricePoint[]>;
  marketEvents: MarketEvent[];
  volatilityIndex: number; // 0-100
  tradingVolume: Record<CropType, number>;
  lastUpdate: Date;
}

// Price point for history
interface PricePoint {
  date: Date;
  price: number;
  volume: number;
  basis: number;
}

// Market event
interface MarketEvent {
  id: string;
  type: 'weather' | 'usda_report' | 'trade' | 'policy' | 'currency' | 'supply_demand';
  severity: 'low' | 'medium' | 'high' | 'critical';
  headline: string;
  description: string;
  affectedCrops: CropType[];
  priceImpact: Record<CropType, number>; // percentage impact
  duration: number; // days
  startDate: Date;
}

// Market Store Actions
interface MarketActions {
  // Price updates
  updatePrices: (gameState: GameState) => void;
  simulateDailyPriceChange: (crop: CropType) => number;
  applyMarketEvent: (event: Omit<MarketEvent, 'id' | 'startDate'>) => string;
  removeMarketEvent: (eventId: string) => void;
  
  // Price queries
  getCurrentPrice: (crop: CropType) => number;
  getPriceWithBasis: (crop: CropType, location: string) => number;
  calculateBasis: (localPrice: number, futuresPrice: number) => number;
  getSeasonalTrend: (crop: CropType, week: number) => number;
  
  // Futures
  addFuturesContract: (contract: Omit<FuturesContract, 'volume' | 'openInterest'>) => void;
  updateFuturesPrices: () => void;
  getFuturesForCrop: (crop: CropType) => FuturesContract[];
  
  // Hedging simulation
  calculateHedgeEffectiveness: (crop: CropType, futuresPosition: number, cashPosition: number) => number;
  
  // Market analysis
  getPriceTrend: (crop: CropType, days: number) => 'up' | 'down' | 'sideways';
  getVolatility: (crop: CropType) => number;
  getSupportResistance: (crop: CropType) => { support: number; resistance: number };
  
  // History and charts
  getPriceHistory: (crop: CropType, days: number) => PricePoint[];
  getMovingAverage: (crop: CropType, period: number) => number;
  
  // Selling decisions
  getSellRecommendation: (crop: CropType, quantity: number, storageCost: number) => SellRecommendation;
  calculateStorageVsSell: (crop: CropType, currentPrice: number, storageWeeks: number, storageCost: number) => StorageAnalysis;
}

// Sell recommendation
interface SellRecommendation {
  action: 'sell_now' | 'hold' | 'sell_partial';
  targetPrice: number;
  reasoning: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

// Storage analysis
interface StorageAnalysis {
  currentPrice: number;
  projectedPrice: number;
  storageCosts: number;
  opportunityCost: number;
  netReturn: number;
  recommendation: 'store' | 'sell';
  breakEvenWeeks: number;
}

// USDA/NASS Base Prices (5-year averages, approximated)
const BASE_PRICES: Record<CropType, { cash: number; futures: number; volatility: number }> = {
  corn: { cash: 4.50, futures: 4.75, volatility: 0.25 },
  soybeans: { cash: 12.00, futures: 12.25, volatility: 0.30 },
  wheat: { cash: 7.50, futures: 7.75, volatility: 0.35 },
  lettuce: { cash: 25.00, futures: 0, volatility: 0.40 }, // Cash market only
  broccoli: { cash: 22.00, futures: 0, volatility: 0.35 },
  strawberries: { cash: 35.00, futures: 0, volatility: 0.45 },
  cotton: { cash: 0.75, futures: 0.78, volatility: 0.20 },
  tomatoes: { cash: 30.00, futures: 0, volatility: 0.40 },
  potatoes: { cash: 12.00, futures: 0, volatility: 0.30 },
  alfalfa: { cash: 150.00, futures: 0, volatility: 0.25 },
  oats: { cash: 4.00, futures: 4.20, volatility: 0.30 },
  barley: { cash: 5.50, futures: 5.75, volatility: 0.28 },
  canola: { cash: 16.00, futures: 16.50, volatility: 0.32 },
  sunflowers: { cash: 20.00, futures: 0, volatility: 0.30 },
  rice: { cash: 15.00, futures: 15.50, volatility: 0.25 },
};

// Seasonal patterns (multiplier by week of year)
// 1.0 = average, >1.0 = higher prices, <1.0 = lower prices
const SEASONAL_PATTERNS: Record<CropType, number[]> = {
  // Corn: Harvest lows in Oct-Nov (weeks 40-48), Spring highs in June-July (weeks 22-30)
  corn: [
    1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.07, 1.06, 1.05, // Weeks 1-10 (Winter)
    1.04, 1.03, 1.02, 1.01, 1.00, 1.00, 1.01, 1.02, 1.03, 1.04, // Weeks 11-20 (Spring)
    1.05, 1.06, 1.07, 1.08, 1.09, 1.08, 1.07, 1.06, 1.05, 1.04, // Weeks 21-30 (Summer)
    1.03, 1.02, 1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.95, 0.94, // Weeks 31-40 (Early Fall)
    0.93, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00, // Weeks 41-50 (Harvest)
    1.01, 1.02, // Weeks 51-52 (Year end)
  ],
  
  // Soybeans: Similar to corn
  soybeans: [
    1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.07, 1.06, 1.05, 1.04,
    1.03, 1.02, 1.01, 1.00, 1.00, 1.01, 1.02, 1.03, 1.04, 1.05,
    1.06, 1.07, 1.08, 1.09, 1.10, 1.09, 1.08, 1.07, 1.06, 1.05,
    1.04, 1.03, 1.02, 1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.95,
    0.94, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00, 1.01,
    1.02, 1.03,
  ],
  
  // Wheat: Winter wheat harvest in July (weeks 26-30), Spring wheat in August (weeks 30-34)
  wheat: [
    1.05, 1.06, 1.07, 1.08, 1.07, 1.06, 1.05, 1.04, 1.03, 1.02, // Winter
    1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.97, 0.98, 0.99, 1.00,
    1.01, 1.02, 1.03, 1.04, 1.05, 1.04, 1.03, 1.02, 1.01, 1.00, // Summer harvest
    0.99, 0.98, 0.97, 0.96, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00,
    1.01, 1.02, 1.03, 1.04, 1.05, 1.04, 1.03, 1.02, 1.01, 1.00, // Fall
    1.01, 1.02,
  ],
  
  // Specialty crops (simplified patterns)
  lettuce: Array(52).fill(1).map((_, i) => 1 + 0.1 * Math.sin((i - 10) * 2 * Math.PI / 52)),
  broccoli: Array(52).fill(1).map((_, i) => 1 + 0.15 * Math.sin((i - 8) * 2 * Math.PI / 52)),
  strawberries: Array(52).fill(1).map((_, i) => 1 + 0.2 * Math.sin((i - 15) * 2 * Math.PI / 52)),
  tomatoes: Array(52).fill(1).map((_, i) => 1 + 0.25 * Math.sin((i - 20) * 2 * Math.PI / 52)),
  potatoes: Array(52).fill(1).map((_, i) => 1 + 0.15 * Math.sin((i - 5) * 2 * Math.PI / 52)),
  
  // Other grains
  cotton: Array(52).fill(1).map((_, i) => 1 + 0.1 * Math.sin((i - 35) * 2 * Math.PI / 52)),
  alfalfa: Array(52).fill(1).map((_, i) => 1 + 0.08 * Math.sin((i - 12) * 2 * Math.PI / 52)),
  oats: Array(52).fill(1).map((_, i) => 1 + 0.1 * Math.sin((i - 30) * 2 * Math.PI / 52)),
  barley: Array(52).fill(1).map((_, i) => 1 + 0.1 * Math.sin((i - 32) * 2 * Math.PI / 52)),
  canola: Array(52).fill(1).map((_, i) => 1 + 0.12 * Math.sin((i - 28) * 2 * Math.PI / 52)),
  sunflowers: Array(52).fill(1).map((_, i) => 1 + 0.11 * Math.sin((i - 33) * 2 * Math.PI / 52)),
  rice: Array(52).fill(1).map((_, i) => 1 + 0.09 * Math.sin((i - 36) * 2 * Math.PI / 52)),
};

// Generate unique IDs
const generateId = () => `mkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// MARKET STORE
// ============================================================================

export const useMarketStore = create<MarketState & MarketActions>()(
  persist(
    (set, get) => ({
      // Initial State
      currentPrices: Object.entries(BASE_PRICES).reduce((acc, [crop, data]) => {
        acc[crop as CropType] = {
          spot: data.cash,
          futures: data.futures,
          basis: data.futures - data.cash,
          weeklyChange: 0,
          yearlyChange: 0,
          volatility: data.volatility * 100,
          seasonalFactor: 1.0,
        };
        return acc;
      }, {} as Record<CropType, CommodityPrice>),
      futures: [],
      basisHistory: {},
      priceHistory: Object.keys(BASE_PRICES).reduce((acc, crop) => {
        acc[crop as CropType] = [];
        return acc;
      }, {} as Record<CropType, PricePoint[]>),
      marketEvents: [],
      volatilityIndex: 25,
      tradingVolume: Object.keys(BASE_PRICES).reduce((acc, crop) => {
        acc[crop as CropType] = 1000 + Math.random() * 9000;
        return acc;
      }, {} as Record<CropType, number>),
      lastUpdate: new Date(),

      // Price updates
      updatePrices: (gameState) => {
        const currentWeek = gameState.currentWeek;
        const updatedPrices = { ...get().currentPrices };
        
        Object.keys(updatedPrices).forEach((crop) => {
          const cropType = crop as CropType;
          const currentPrice = updatedPrices[cropType];
          
          // Apply seasonal factor
          const seasonalFactor = SEASONAL_PATTERNS[cropType]?.[currentWeek - 1] || 1.0;
          
          // Calculate daily volatility
          const dailyChange = get().simulateDailyPriceChange(cropType);
          
          // Apply market event impacts
          let eventImpact = 0;
          get().marketEvents.forEach((event) => {
            if (event.affectedCrops.includes(cropType)) {
              eventImpact += event.priceImpact[cropType] || 0;
            }
          });
          
          // Update spot price
          const basePrice = BASE_PRICES[cropType].cash;
          const newSpotPrice = basePrice * seasonalFactor * (1 + dailyChange) * (1 + eventImpact);
          
          // Calculate weekly change
          const oldPrice = currentPrice.spot;
          const weeklyChange = oldPrice > 0 ? ((newSpotPrice - oldPrice) / oldPrice) * 100 : 0;
          
          updatedPrices[cropType] = {
            ...currentPrice,
            spot: Math.max(0.01, newSpotPrice),
            futures: newSpotPrice + currentPrice.basis,
            weeklyChange,
            seasonalFactor,
          };
          
          // Update price history
          set((state) => ({
            priceHistory: {
              ...state.priceHistory,
              [cropType]: [
                ...state.priceHistory[cropType].slice(-364),
                {
                  date: new Date(),
                  price: newSpotPrice,
                  volume: state.tradingVolume[cropType],
                  basis: currentPrice.basis,
                },
              ],
            },
          }));
        });
        
        set({ 
          currentPrices: updatedPrices,
          lastUpdate: new Date(),
        });
      },

      // Simulate daily price change using random walk with mean reversion
      simulateDailyPriceChange: (crop) => {
        const baseVolatility = BASE_PRICES[crop]?.volatility || 0.25;
        const currentEvents = get().marketEvents.filter((e) => 
          e.affectedCrops.includes(crop) && e.severity === 'critical'
        ).length;
        
        // Increase volatility during market events
        const eventMultiplier = 1 + currentEvents * 0.5;
        const adjustedVolatility = baseVolatility * eventMultiplier;
        
        // Random walk with slight mean reversion
        const drift = 0; // No long-term drift
        const shock = (Math.random() - 0.5) * 2 * adjustedVolatility;
        
        return drift + shock;
      },

      // Apply market event
      applyMarketEvent: (event) => {
        const id = generateId();
        const marketEvent: MarketEvent = {
          ...event,
          id,
          startDate: new Date(),
        };
        
        set((state) => ({
          marketEvents: [...state.marketEvents, marketEvent],
          volatilityIndex: Math.min(100, state.volatilityIndex + 
            (event.severity === 'critical' ? 30 : event.severity === 'high' ? 20 : 10)),
        }));
        
        return id;
      },

      // Remove market event
      removeMarketEvent: (eventId) => {
        set((state) => ({
          marketEvents: state.marketEvents.filter((e) => e.id !== eventId),
        }));
      },

      // Get current price
      getCurrentPrice: (crop) => {
        return get().currentPrices[crop]?.spot || BASE_PRICES[crop]?.cash || 0;
      },

      // Get price with basis
      getPriceWithBasis: (crop, location) => {
        const basePrice = get().getCurrentPrice(crop);
        const locationBasis = get().basisHistory[location]?.slice(-1)[0] || 0;
        return basePrice + locationBasis;
      },

      // Calculate basis
      calculateBasis: (localPrice, futuresPrice) => {
        return localPrice - futuresPrice;
      },

      // Get seasonal trend
      getSeasonalTrend: (crop, week) => {
        return SEASONAL_PATTERNS[crop]?.[week - 1] || 1.0;
      },

      // Add futures contract
      addFuturesContract: (contract) => {
        const newContract: FuturesContract = {
          ...contract,
          volume: Math.floor(Math.random() * 10000),
          openInterest: Math.floor(Math.random() * 50000),
        };
        
        set((state) => ({
          futures: [...state.futures, newContract],
        }));
      },

      // Update futures prices
      updateFuturesPrices: () => {
        set((state) => ({
          futures: state.futures.map((contract) => {
            const spotPrice = state.currentPrices[contract.commodity]?.spot || 0;
            const timeToExpiration = getMonthsToExpiration(contract.month);
            
            // Futures price = spot price + cost of carry
            const costOfCarry = spotPrice * 0.05 * (timeToExpiration / 12);
            const newPrice = spotPrice + costOfCarry;
            
            return {
              ...contract,
              price: Math.max(0.01, newPrice + (Math.random() - 0.5) * 0.1),
            };
          }),
        }));
      },

      // Get futures for crop
      getFuturesForCrop: (crop) => {
        return get().futures.filter((f) => f.commodity === crop);
      },

      // Calculate hedge effectiveness
      calculateHedgeEffectiveness: (crop, futuresPosition, cashPosition) => {
        // Correlation between futures and cash prices (typically 0.8-0.95)
        const correlation = 0.9;
        
        // If positions offset each other
        if (Math.sign(futuresPosition) !== Math.sign(cashPosition)) {
          const hedgeRatio = Math.abs(futuresPosition / cashPosition);
          return correlation * Math.min(1, hedgeRatio);
        }
        
        return 0; // No hedge if positions are same direction
      },

      // Get price trend
      getPriceTrend: (crop, days) => {
        const history = get().priceHistory[crop].slice(-days);
        if (history.length < 3) return 'sideways';
        
        const startPrice = history[0].price;
        const endPrice = history[history.length - 1].price;
        const change = (endPrice - startPrice) / startPrice;
        
        if (change > 0.05) return 'up';
        if (change < -0.05) return 'down';
        return 'sideways';
      },

      // Get volatility
      getVolatility: (crop) => {
        const history = get().priceHistory[crop].slice(-30);
        if (history.length < 2) return 0;
        
        const prices = history.map((h) => h.price);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
        const stdDev = Math.sqrt(variance);
        
        return (stdDev / mean) * 100; // CV as percentage
      },

      // Get support and resistance levels
      getSupportResistance: (crop) => {
        const history = get().priceHistory[crop].slice(-60);
        if (history.length < 10) return { support: 0, resistance: 999999 };
        
        const prices = history.map((h) => h.price);
        const sorted = [...prices].sort((a, b) => a - b);
        
        // 20th percentile as support
        const supportIndex = Math.floor(sorted.length * 0.2);
        // 80th percentile as resistance
        const resistanceIndex = Math.floor(sorted.length * 0.8);
        
        return {
          support: sorted[supportIndex],
          resistance: sorted[resistanceIndex],
        };
      },

      // Get price history
      getPriceHistory: (crop, days) => {
        return get().priceHistory[crop].slice(-days);
      },

      // Get moving average
      getMovingAverage: (crop, period) => {
        const history = get().priceHistory[crop].slice(-period);
        if (history.length === 0) return 0;
        
        const sum = history.reduce((acc, h) => acc + h.price, 0);
        return sum / history.length;
      },

      // Get sell recommendation
      getSellRecommendation: (crop, quantity, storageCost) => {
        const currentPrice = get().getCurrentPrice(crop);
        const trend = get().getPriceTrend(crop, 30);
        const seasonalFactor = get().getSeasonalTrend(crop, new Date().getWeek());
        const { support, resistance } = get().getSupportResistance(crop);
        const volatility = get().getVolatility(crop);
        
        const reasoning: string[] = [];
        let action: SellRecommendation['action'] = 'hold';
        let riskLevel: SellRecommendation['riskLevel'] = 'medium';
        let confidence = 50;
        
        // Price near resistance
        if (currentPrice >= resistance * 0.95) {
          action = 'sell_now';
          reasoning.push('Price near resistance level');
          confidence += 15;
        }
        
        // Strong uptrend
        if (trend === 'up') {
          reasoning.push('Prices in uptrend');
          if (action === 'hold') {
            action = 'sell_partial';
            confidence += 10;
          }
        }
        
        // Downtrend
        if (trend === 'down') {
          reasoning.push('Prices declining - sell to avoid further losses');
          action = 'sell_now';
          riskLevel = 'high';
          confidence += 20;
        }
        
        // Seasonal factor
        if (seasonalFactor < 0.95) {
          reasoning.push('Seasonal price weakness expected');
          action = 'sell_now';
          confidence += 10;
        } else if (seasonalFactor > 1.05) {
          reasoning.push('Seasonal strength may continue');
          if (action === 'sell_now') action = 'sell_partial';
        }
        
        // Storage costs consideration
        const weeklyStorageCost = storageCost;
        const priceChangeNeeded = (weeklyStorageCost / currentPrice) * 100;
        
        if (volatility < priceChangeNeeded * 2) {
          reasoning.push(`Storage costs high relative to price volatility`);
          if (action === 'hold') action = 'sell_now';
        }
        
        // Calculate target price
        const targetPrice = resistance * 1.02;
        
        return {
          action,
          targetPrice,
          reasoning,
          riskLevel,
          confidence: Math.min(95, confidence),
        };
      },

      // Calculate storage vs sell decision
      calculateStorageVsSell: (crop, currentPrice, storageWeeks, storageCost) => {
        const seasonalFactor = get().getSeasonalTrend(crop, (new Date().getWeek() + storageWeeks) % 52);
        const projectedPrice = currentPrice * seasonalFactor;
        const storageCosts = storageCost * storageWeeks;
        
        // Opportunity cost (what you could earn with the money now)
        const annualInterestRate = 0.05;
        const opportunityCost = currentPrice * (annualInterestRate / 52) * storageWeeks;
        
        const netReturn = projectedPrice - storageCosts - opportunityCost;
        
        // Break-even weeks
        const weeklyGainNeeded = storageCost + (currentPrice * annualInterestRate / 52);
        const expectedWeeklyGain = (projectedPrice - currentPrice) / storageWeeks;
        const breakEvenWeeks = weeklyGainNeeded > 0 ? (projectedPrice - currentPrice) / weeklyGainNeeded : 0;
        
        return {
          currentPrice,
          projectedPrice,
          storageCosts,
          opportunityCost,
          netReturn,
          recommendation: netReturn > currentPrice ? 'store' : 'sell',
          breakEvenWeeks,
        };
      },
    }),
    {
      name: 'agri-os-market',
    }
  )
);

// Helper: Get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
};

// Helper: Get months to expiration
function getMonthsToExpiration(expirationMonth: string): number {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const currentMonth = new Date().getMonth();
  const expMonth = months.indexOf(expirationMonth.toLowerCase().substring(0, 3));
  
  if (expMonth === -1) return 3; // Default
  
  let diff = expMonth - currentMonth;
  if (diff < 0) diff += 12;
  
  return diff;
}

// ============================================================================
// TEST FUNCTION
// ============================================================================

export function testMarketSystem(): void {
  const store = useMarketStore.getState();

  console.log('=== Market Price Simulation Tests ===\n');

  // Test 1: Get current prices
  console.log('Test 1: Current commodity prices');
  const crops: CropType[] = ['corn', 'soybeans', 'wheat'];
  crops.forEach((crop) => {
    const price = store.getCurrentPrice(crop);
    console.log(`✓ ${crop}: $${price.toFixed(2)}`);
  });

  // Test 2: Seasonal trends
  console.log('\nTest 2: Seasonal trends');
  const week = 30; // Mid-summer
  crops.forEach((crop) => {
    const trend = store.getSeasonalTrend(crop, week);
    console.log(`✓ ${crop} week ${week}: ${(trend * 100 - 100).toFixed(1)}% vs average`);
  });

  // Test 3: Apply market event
  console.log('\nTest 3: Market event impact');
  const eventId = store.applyMarketEvent({
    type: 'weather',
    severity: 'high',
    headline: 'Drought Concerns in Corn Belt',
    description: 'Extended dry period raising yield concerns',
    affectedCrops: ['corn', 'soybeans'],
    priceImpact: { corn: 0.05, soybeans: 0.03, wheat: 0, lettuce: 0, broccoli: 0, strawberries: 0, cotton: 0, tomatoes: 0, potatoes: 0, alfalfa: 0, oats: 0, barley: 0, canola: 0, sunflowers: 0, rice: 0 },
    duration: 14,
  });
  console.log(`✓ Market event applied: ${eventId}`);

  // Test 4: Price update simulation
  console.log('\nTest 4: Price update simulation');
  const mockGameState: GameState = {
    currentWeek: 30,
    currentYear: 2024,
    season: 'summer',
    weather: { current: { temperature: 85, humidity: 60, windSpeed: 10, windDirection: 'S', precipitation: 0, cloudCover: 10, uvIndex: 9, soilTemperature: 78, pressure: 1010, visibility: 10 }, forecast: [], historical: [], alerts: [] },
    player: { id: 'p1', name: 'Test', email: 'test@test.com', cash: 50000, totalDebt: 0, creditScore: 750, experience: 50, level: 3, createdAt: new Date(), lastPlayed: new Date() },
    fields: [],
    inventory: { seeds: [], fertilizers: [], chemicals: [], fuel: { diesel: 0, gasoline: 0, propane: 0, costPerGallon: { diesel: 3.5, gasoline: 3.2, propane: 2.8 } }, parts: [] },
    equipment: [],
    operators: [],
    storage: [],
    marketPrices: { commodities: { 
      lettuce: { spot: 25, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 40, seasonalFactor: 1 },
      broccoli: { spot: 22, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 35, seasonalFactor: 1 },
      wheat: { spot: 7.50, futures: 7.75, basis: -0.25, weeklyChange: 0, yearlyChange: 0, volatility: 35, seasonalFactor: 1 },
      strawberries: { spot: 35, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 45, seasonalFactor: 1 },
      corn: { spot: 4.50, futures: 4.75, basis: -0.25, weeklyChange: 0, yearlyChange: 0, volatility: 25, seasonalFactor: 1 },
      soybeans: { spot: 12, futures: 12.25, basis: -0.25, weeklyChange: 0, yearlyChange: 0, volatility: 30, seasonalFactor: 1 },
      cotton: { spot: 0.75, futures: 0.78, basis: -0.03, weeklyChange: 0, yearlyChange: 0, volatility: 20, seasonalFactor: 1 },
      tomatoes: { spot: 30, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 40, seasonalFactor: 1 },
      potatoes: { spot: 12, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 30, seasonalFactor: 1 },
      alfalfa: { spot: 150, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 25, seasonalFactor: 1 },
      oats: { spot: 4, futures: 4.20, basis: -0.20, weeklyChange: 0, yearlyChange: 0, volatility: 30, seasonalFactor: 1 },
      barley: { spot: 5.50, futures: 5.75, basis: -0.25, weeklyChange: 0, yearlyChange: 0, volatility: 28, seasonalFactor: 1 },
      canola: { spot: 16, futures: 16.50, basis: -0.50, weeklyChange: 0, yearlyChange: 0, volatility: 32, seasonalFactor: 1 },
      sunflowers: { spot: 20, futures: 0, basis: 0, weeklyChange: 0, yearlyChange: 0, volatility: 30, seasonalFactor: 1 },
      rice: { spot: 15, futures: 15.50, basis: -0.50, weeklyChange: 0, yearlyChange: 0, volatility: 25, seasonalFactor: 1 },
    }, futures: [], basis: {}, lastUpdated: new Date() },
    pendingDecisions: [],
    gameEvents: [],
  };
  
  store.updatePrices(mockGameState);
  
  crops.forEach((crop) => {
    const price = store.getCurrentPrice(crop);
    const priceData = store.currentPrices[crop];
    console.log(`✓ ${crop}: $${price.toFixed(2)} (${priceData.weeklyChange >= 0 ? '+' : ''}${priceData.weeklyChange.toFixed(2)}%)`);
  });

  // Test 5: Support and resistance
  console.log('\nTest 5: Support and resistance levels');
  crops.forEach((crop) => {
    const { support, resistance } = store.getSupportResistance(crop);
    console.log(`✓ ${crop}: Support $${support.toFixed(2)}, Resistance $${resistance.toFixed(2)}`);
  });

  // Test 6: Sell recommendation
  console.log('\nTest 6: Sell recommendations');
  crops.forEach((crop) => {
    const rec = store.getSellRecommendation(crop, 1000, 0.02);
    console.log(`✓ ${crop}: ${rec.action.toUpperCase()} - Confidence ${rec.confidence}%`);
    console.log(`  Reasoning: ${rec.reasoning.join(', ')}`);
  });

  // Test 7: Storage vs sell analysis
  console.log('\nTest 7: Storage vs sell analysis');
  const analysis = store.calculateStorageVsSell('corn', 4.50, 12, 0.05);
  console.log(`✓ Current price: $${analysis.currentPrice.toFixed(2)}`);
  console.log(`✓ Projected price: $${analysis.projectedPrice.toFixed(2)}`);
  console.log(`✓ Storage costs: $${analysis.storageCosts.toFixed(2)}`);
  console.log(`✓ Net return: $${analysis.netReturn.toFixed(2)}`);
  console.log(`✓ Recommendation: ${analysis.recommendation.toUpperCase()}`);

  // Test 8: Volatility calculation
  console.log('\nTest 8: Volatility metrics');
  crops.forEach((crop) => {
    const volatility = store.getVolatility(crop);
    const trend = store.getPriceTrend(crop, 30);
    console.log(`✓ ${crop}: Volatility ${volatility.toFixed(1)}%, Trend: ${trend}`);
  });

  // Clean up
  store.removeMarketEvent(eventId);
  console.log('\n✓ Test event removed');

  console.log('\n=== All Market Tests Complete ===');
}

// Export for use in other modules
export { BASE_PRICES as basePrices, SEASONAL_PATTERNS as seasonalPatterns };
