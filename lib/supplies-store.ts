// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// MOCK SUPPLIERS
// ============================================================================

export interface Supplier {
  id: string;
  name: string;
  type: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'fuel' | 'services';
  rating: number;
  deliveryDays: number;
  minOrder: number;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
}

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'AgriSeed Pro',
    type: 'seeds',
    rating: 4.8,
    deliveryDays: 3,
    minOrder: 500,
    location: 'Tbilisi, Georgia',
    contact: { phone: '+995 32 2 11 11 11', email: 'orders@agriseed.ge' }
  },
  {
    id: 'supplier-2',
    name: 'GreenGrow Fertilizers',
    type: 'fertilizer',
    rating: 4.5,
    deliveryDays: 5,
    minOrder: 1000,
    location: 'Kutaisi, Georgia',
    contact: { phone: '+995 431 2 22 22', email: 'sales@greengrow.ge' }
  },
  {
    id: 'supplier-3',
    name: 'CropShield Chemicals',
    type: 'pesticide',
    rating: 4.2,
    deliveryDays: 4,
    minOrder: 300,
    location: 'Batumi, Georgia',
    contact: { phone: '+995 422 3 33 33', email: 'info@cropshield.ge' }
  },
  {
    id: 'supplier-4',
    name: 'FarmTech Equipment',
    type: 'equipment',
    rating: 4.9,
    deliveryDays: 14,
    minOrder: 5000,
    location: 'Tbilisi, Georgia',
    contact: { phone: '+995 32 4 44 44', email: 'sales@farmtech.ge' }
  },
  {
    id: 'supplier-5',
    name: 'AgroFuel Georgia',
    type: 'fuel',
    rating: 4.6,
    deliveryDays: 2,
    minOrder: 200,
    location: 'Rustavi, Georgia',
    contact: { phone: '+995 341 5 55 55', email: 'delivery@agrofuel.ge' }
  },
  {
    id: 'supplier-6',
    name: 'AgriService Hub',
    type: 'services',
    rating: 4.7,
    deliveryDays: 1,
    minOrder: 100,
    location: 'Gori, Georgia',
    contact: { phone: '+995 370 6 66 66', email: 'book@agriservice.ge' }
  }
];

// ============================================================================
// MOCK SUPPLIES PRODUCTS
// ============================================================================

export interface SupplyProduct {
  id: string;
  supplierId: string;
  name: string;
  category: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'fuel' | 'services';
  description: string;
  price: number;
  unit: string;
  inStock: boolean;
  stockQuantity: number;
  imageUrl?: string;
  specifications: Record<string, string>;
  isCornRelated?: boolean;
}

export const MOCK_SUPPLY_PRODUCTS: SupplyProduct[] = [
  // Seeds
  {
    id: 'seed-1',
    supplierId: 'supplier-1',
    name: 'Premium Lettuce Seeds - Iceberg',
    category: 'seeds',
    description: 'High-yield iceberg lettuce seeds, 95% germination rate',
    price: 45,
    unit: 'kg',
    inStock: true,
    stockQuantity: 500,
    specifications: { variety: 'Iceberg', germination: '95%', origin: 'Netherlands' }
  },
  {
    id: 'seed-2',
    supplierId: 'supplier-1',
    name: 'Broccoli Seeds - Calabrese',
    category: 'seeds',
    description: 'Disease-resistant broccoli variety for cool climates',
    price: 62,
    unit: 'kg',
    inStock: true,
    stockQuantity: 300,
    specifications: { variety: 'Calabrese', germination: '92%', origin: 'Italy' }
  },
  {
    id: 'seed-3',
    supplierId: 'supplier-1',
    name: 'Strawberry Seeds - Albion',
    category: 'seeds',
    description: 'Day-neutral strawberry variety, high sweetness',
    price: 120,
    unit: '1000 seeds',
    inStock: true,
    stockQuantity: 150,
    specifications: { variety: 'Albion', germination: '88%', origin: 'USA' }
  },
  {
    id: 'seed-4',
    supplierId: 'supplier-1',
    name: 'Corn Seeds - Pioneer P1197',
    category: 'seeds',
    description: 'High-yield hybrid corn for grain production',
    price: 85,
    unit: 'kg',
    inStock: true,
    stockQuantity: 1000,
    specifications: { variety: 'P1197', germination: '96%', origin: 'USA' },
    isCornRelated: true
  },
  {
    id: 'seed-5',
    supplierId: 'supplier-1',
    name: 'Bayer Corn Seed - Dekalb',
    category: 'seeds',
    description: 'High-performance hybrid corn with built-in insect protection',
    price: 110,
    unit: 'kg',
    inStock: true,
    stockQuantity: 400,
    specifications: { variety: 'Dekalb', tech: 'Acceleron Elite', origin: 'USA' },
    isCornRelated: true
  },

  // Fertilizers
  {
    id: 'fert-1',
    supplierId: 'supplier-2',
    name: 'NPK 20-20-20 Complex Fertilizer',
    category: 'fertilizer',
    description: 'Balanced NPK formula for general crop nutrition',
    price: 2.5,
    unit: 'kg',
    inStock: true,
    stockQuantity: 5000,
    specifications: { N: '20%', P: '20%', K: '20%', type: 'Water soluble' }
  },
  {
    id: 'fert-2',
    supplierId: 'supplier-2',
    name: 'Urea 46% Nitrogen',
    category: 'fertilizer',
    description: 'High nitrogen content for vegetative growth',
    price: 1.8,
    unit: 'kg',
    inStock: true,
    stockQuantity: 8000,
    specifications: { N: '46%', type: 'Granular', application: 'Broadcast' },
    isCornRelated: true
  },
  {
    id: 'fert-3',
    supplierId: 'supplier-2',
    name: 'Organic Compost - Premium',
    category: 'fertilizer',
    description: 'Rich organic compost for soil improvement',
    price: 0.8,
    unit: 'kg',
    inStock: true,
    stockQuantity: 10000,
    specifications: { organic: '100%', NPK: '3-2-2', origin: 'Local' }
  },

  // Pesticides
  {
    id: 'pest-1',
    supplierId: 'supplier-3',
    name: 'Fungicide - Mancozeb 80% WP',
    category: 'pesticide',
    description: 'Broad-spectrum fungicide for disease control',
    price: 15,
    unit: 'kg',
    inStock: true,
    stockQuantity: 200,
    specifications: { active: 'Mancozeb 80%', type: 'WP', target: 'Fungi' }
  },
  {
    id: 'pest-2',
    supplierId: 'supplier-3',
    name: 'Insecticide - Imidacloprid 20% SL',
    category: 'pesticide',
    description: 'Systemic insecticide for sucking pests',
    price: 28,
    unit: 'L',
    inStock: true,
    stockQuantity: 150,
    specifications: { active: 'Imidacloprid 20%', type: 'SL', target: 'Aphids, Thrips' }
  },
  {
    id: 'pest-3',
    supplierId: 'supplier-3',
    name: 'Herbicide - Glyphosate 41% SL',
    category: 'pesticide',
    description: 'Non-selective herbicide for weed control',
    price: 12,
    unit: 'L',
    inStock: true,
    stockQuantity: 300,
    specifications: { active: 'Glyphosate 41%', type: 'SL', target: 'Broadleaf/Grass' }
  },
  // Bayer Corn Chemicals
  {
    id: 'pest-gaucho',
    supplierId: 'supplier-3',
    name: 'Gaucho 600 FS',
    category: 'pesticide',
    description: 'Bayer seed treatment for long-lasting protection against soil pests',
    price: 350,
    unit: 'L',
    inStock: true,
    stockQuantity: 100,
    specifications: { manufacturer: 'Bayer', active: 'Imidacloprid', target: 'Wireworms' },
    isCornRelated: true
  },
  {
    id: 'pest-maister-power',
    supplierId: 'supplier-3',
    name: 'Maister Power',
    category: 'pesticide',
    description: 'Bayer post-emergence herbicide for broad-spectrum weed control in corn',
    price: 420,
    unit: 'L',
    inStock: true,
    stockQuantity: 80,
    specifications: { manufacturer: 'Bayer', type: 'OD', timing: '2-6 leaf stage' },
    isCornRelated: true
  },
  {
    id: 'pest-decis-expert',
    supplierId: 'supplier-3',
    name: 'Decis Expert',
    category: 'pesticide',
    description: 'Bayer contact insecticide for rapid control of corn borer and aphids',
    price: 280,
    unit: 'L',
    inStock: true,
    stockQuantity: 120,
    specifications: { manufacturer: 'Bayer', active: 'Deltamethrin', target: 'Corn Borer' },
    isCornRelated: true
  },
  {
    id: 'pest-adengo',
    supplierId: 'supplier-3',
    name: 'Adengo 315 SC',
    category: 'pesticide',
    description: 'Bayer early post-emergence herbicide with long-lasting residual effect',
    price: 395,
    unit: 'L',
    inStock: true,
    stockQuantity: 90,
    specifications: { manufacturer: 'Bayer', tech: 'Synchronized Weed Control', timing: 'Pre-emergence' },
    isCornRelated: true
  },

  // Equipment
  {
    id: 'equip-1',
    supplierId: 'supplier-4',
    name: 'DJI Agras T40 Drone',
    category: 'equipment',
    description: 'Professional agricultural spraying drone',
    price: 25000,
    unit: 'unit',
    inStock: true,
    stockQuantity: 10,
    specifications: { tank: '40L', coverage: '32 acres/hour', range: '7km' }
  },
  {
    id: 'equip-2',
    supplierId: 'supplier-4',
    name: 'Soil pH Meter - Professional',
    category: 'equipment',
    description: 'Digital soil pH and moisture meter',
    price: 450,
    unit: 'unit',
    inStock: true,
    stockQuantity: 50,
    specifications: { pH_range: '3-9', accuracy: '±0.1', moisture: 'Yes' }
  },
  {
    id: 'equip-3',
    supplierId: 'supplier-4',
    name: 'Sprinkler System - 1 Hectare Kit',
    category: 'equipment',
    description: 'Complete irrigation system for 1 hectare',
    price: 3500,
    unit: 'kit',
    inStock: true,
    stockQuantity: 20,
    specifications: { coverage: '1 ha', flow: '15 m³/h', pressure: '2-4 bar' }
  },

  // Fuel
  {
    id: 'fuel-1',
    supplierId: 'supplier-5',
    name: 'Diesel Fuel - Agricultural Grade',
    category: 'fuel',
    description: 'High-quality diesel for tractors and machinery',
    price: 3.2,
    unit: 'L',
    inStock: true,
    stockQuantity: 50000,
    specifications: { type: 'Diesel EN 590', delivery: 'Tanker', min_order: '500L' },
    isCornRelated: true
  },
  {
    id: 'fuel-2',
    supplierId: 'supplier-5',
    name: 'Gasoline - 95 Octane',
    category: 'fuel',
    description: 'Premium gasoline for small equipment',
    price: 3.5,
    unit: 'L',
    inStock: true,
    stockQuantity: 30000,
    specifications: { octane: '95', delivery: 'Canisters', min_order: '200L' }
  },

  // Services
  {
    id: 'serv-1',
    supplierId: 'supplier-6',
    name: 'Drone Spraying Service',
    category: 'services',
    description: 'Professional drone spraying per hectare',
    price: 25,
    unit: 'hectare',
    inStock: true,
    stockQuantity: 999999,
    specifications: { coverage: 'Up to 40L/ha', crops: 'All types', booking: '48h advance' },
    isCornRelated: true
  },
  {
    id: 'serv-2',
    supplierId: 'supplier-6',
    name: 'Soil Analysis Laboratory',
    category: 'services',
    description: 'Complete soil nutrient and pH analysis',
    price: 150,
    unit: 'sample',
    inStock: true,
    stockQuantity: 999999,
    specifications: { parameters: 'NPK, pH, OM, Micronutrients', turnaround: '5 days' }
  },
  {
    id: 'serv-3',
    supplierId: 'supplier-6',
    name: 'Tractor Rental - Full Day',
    category: 'services',
    description: 'John Deere 6R tractor with operator',
    price: 400,
    unit: 'day',
    inStock: true,
    stockQuantity: 999999,
    specifications: { model: 'John Deere 6R', includes: 'Operator, Fuel', hours: '8h/day' },
    isCornRelated: true
  }
];

// ============================================================================
// SUPPLY ORDER TYPES
// ============================================================================

export interface SupplyOrder {
  id: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  supplierId: string;
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  expectedDelivery: Date;
  notes?: string;
}

// ============================================================================
// SUPPLIES STORE
// ============================================================================

interface SuppliesStore {
  // Data
  suppliers: Supplier[];
  products: SupplyProduct[];
  orders: SupplyOrder[];
  cart: { productId: string; quantity: number }[];

  // Actions
  getProductsByCategory: (category: SupplyProduct['category']) => SupplyProduct[];
  getProductsBySupplier: (supplierId: string) => SupplyProduct[];
  getSupplier: (id: string) => Supplier | undefined;
  getProduct: (id: string) => SupplyProduct | undefined;

  // Cart
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  createOrder: (supplierId: string, notes?: string) => SupplyOrder | null;
  updateOrderStatus: (orderId: string, status: SupplyOrder['status']) => void;
  getOrdersByStatus: (status: SupplyOrder['status']) => SupplyOrder[];

  // Search & Filter
  searchProducts: (query: string, category?: SupplyProduct['category']) => SupplyProduct[];
  filterByPriceRange: (min: number, max: number, category?: SupplyProduct['category']) => SupplyProduct[];
  filterByStock: (inStockOnly: boolean) => SupplyProduct[];
}

export const useSuppliesStore = create<SuppliesStore>()(
  persist(
    (set, get) => ({
      suppliers: MOCK_SUPPLIERS,
      products: MOCK_SUPPLY_PRODUCTS,
      orders: [],
      cart: [],

      getProductsByCategory: (category) => {
        return get().products.filter(p => p.category === category);
      },

      getProductsBySupplier: (supplierId) => {
        return get().products.filter(p => p.supplierId === supplierId);
      },

      getSupplier: (id) => {
        return get().suppliers.find(s => s.id === id);
      },

      getProduct: (id) => {
        return get().products.find(p => p.id === id);
      },

      addToCart: (productId, quantity) => {
        const { cart } = get();
        const existing = cart.find(item => item.productId === productId);

        if (existing) {
          set({
            cart: cart.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { productId, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart, products } = get();
        return cart.reduce((total, item) => {
          const product = products.find(p => p.id === item.productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0);
      },

      createOrder: (supplierId, notes) => {
        const { cart, products, suppliers } = get();
        const supplier = suppliers.find(s => s.id === supplierId);

        if (!supplier || cart.length === 0) return null;

        // Group cart items by supplier
        const supplierCartItems = cart.filter(item => {
          const product = products.find(p => p.id === item.productId);
          return product?.supplierId === supplierId;
        });

        if (supplierCartItems.length === 0) return null;

        const orderProducts = supplierCartItems.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price
          };
        });

        const totalAmount = orderProducts.reduce((sum, item) => {
          return sum + item.unitPrice * item.quantity;
        }, 0);

        // Check minimum order
        if (totalAmount < supplier.minOrder) {
          console.warn(`Order below minimum: ${totalAmount} < ${supplier.minOrder}`);
          return null;
        }

        const order: SupplyOrder = {
          id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
          products: orderProducts,
          supplierId,
          status: 'pending',
          totalAmount,
          createdAt: new Date(),
          expectedDelivery: new Date(Date.now() + supplier.deliveryDays * 24 * 60 * 60 * 1000),
          notes
        };

        set({
          orders: [...get().orders, order],
          cart: cart.filter(item => !supplierCartItems.find(si => si.productId === item.productId))
        });

        return order;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        });
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter(o => o.status === status);
      },

      searchProducts: (query, category) => {
        const lowerQuery = query.toLowerCase();
        let products = get().products;

        if (category) {
          products = products.filter(p => p.category === category);
        }

        return products.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
        );
      },

      filterByPriceRange: (min, max, category) => {
        let products = get().products;

        if (category) {
          products = products.filter(p => p.category === category);
        }

        return products.filter(p => p.price >= min && p.price <= max);
      },

      filterByStock: (inStockOnly) => {
        if (!inStockOnly) return get().products;
        return get().products.filter(p => p.inStock && p.stockQuantity > 0);
      }
    }),
    {
      name: 'agri-os-supplies',
      partialize: (state) => ({ orders: state.orders, cart: state.cart })
    }
  )
);

// Export helper functions
export function getSuppliersByType(type: Supplier['type']): Supplier[] {
  return MOCK_SUPPLIERS.filter(s => s.type === type);
}

export function getCategoryDisplayName(category: SupplyProduct['category']): string {
  const names: Record<string, string> = {
    seeds: 'Seeds & Plants',
    fertilizer: 'Fertilizers',
    pesticide: 'Pesticides & Chemicals',
    equipment: 'Equipment & Tools',
    fuel: 'Fuel & Energy',
    services: 'Services'
  };
  return names[category] || category;
}

export function getCategoryIcon(category: SupplyProduct['category']): string {
  const icons: Record<string, string> = {
    seeds: '🌱',
    fertilizer: '🧪',
    pesticide: '🛡️',
    equipment: '🔧',
    fuel: '⛽',
    services: '🚁'
  };
  return icons[category] || '📦';
}
