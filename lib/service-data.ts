/**
 * Service Marketplace Data
 * 
 * Uber-style service hiring for agricultural services
 */

export type ServiceCategory = 'equipment_rental' | 'spraying' | 'harvesting' | 'soil_testing' | 'consulting' | 'maintenance';

export interface ServiceProvider {
    id: string;
    name: string;
    company: string;
    rating: number;
    reviewCount: number;
    completedJobs: number;
    responseTime: string; // e.g., "< 1 hour"
    verified: boolean;
    imageUrl?: string;
}

export interface Service {
    id: string;
    category: ServiceCategory;
    title: string;
    description: string;
    provider: ServiceProvider;
    pricing: {
        type: 'hourly' | 'daily' | 'per_acre' | 'fixed';
        amount: number;
        unit: string;
    };
    availability: 'immediate' | 'same_day' | 'next_day' | 'scheduled';
    minBooking?: string;
    equipment?: string[];
    certifications?: string[];
    serviceArea: string; // miles radius
}

// Service Providers
const PROVIDERS: ServiceProvider[] = [
    {
        id: 'prov-1',
        name: 'Mike Rodriguez',
        company: 'AgriSpray Pro',
        rating: 4.9,
        reviewCount: 127,
        completedJobs: 342,
        responseTime: '< 30 min',
        verified: true,
    },
    {
        id: 'prov-2',
        name: 'Sarah Chen',
        company: 'Precision Harvest Services',
        rating: 4.8,
        reviewCount: 89,
        completedJobs: 215,
        responseTime: '< 1 hour',
        verified: true,
    },
    {
        id: 'prov-3',
        name: 'John Martinez',
        company: 'Valley Equipment Rentals',
        rating: 4.7,
        reviewCount: 156,
        completedJobs: 428,
        responseTime: '< 2 hours',
        verified: true,
    },
    {
        id: 'prov-4',
        name: 'Emily Watson',
        company: 'SoilTech Labs',
        rating: 5.0,
        reviewCount: 64,
        completedJobs: 178,
        responseTime: '< 1 hour',
        verified: true,
    },
    {
        id: 'prov-5',
        name: 'David Kim',
        company: 'AgriConsult Partners',
        rating: 4.9,
        reviewCount: 92,
        completedJobs: 156,
        responseTime: '< 4 hours',
        verified: true,
    },
];

// Available Services
export const SERVICES: Service[] = [
    {
        id: 'svc-1',
        category: 'spraying',
        title: 'Aerial Crop Spraying - DJI Agras T40',
        description: 'Professional aerial spraying service with precision application. Includes pre-flight field analysis, weather monitoring, and detailed application reports.',
        provider: PROVIDERS[0],
        pricing: {
            type: 'per_acre',
            amount: 12,
            unit: 'acre',
        },
        availability: 'same_day',
        minBooking: '20 acres',
        equipment: ['DJI Agras T40', 'Weather station', 'GPS mapping'],
        certifications: ['FAA Part 107', 'Pesticide Applicator License'],
        serviceArea: '50 miles',
    },
    {
        id: 'svc-2',
        category: 'spraying',
        title: 'Ground Spraying - High Clearance Sprayer',
        description: 'Ground-based precision spraying with 120ft boom. Variable rate application available. Perfect for large fields and tall crops.',
        provider: PROVIDERS[0],
        pricing: {
            type: 'per_acre',
            amount: 8,
            unit: 'acre',
        },
        availability: 'next_day',
        minBooking: '50 acres',
        equipment: ['John Deere R4045', 'GPS guidance', 'VRA system'],
        certifications: ['Pesticide Applicator License', 'Certified Crop Advisor'],
        serviceArea: '75 miles',
    },
    {
        id: 'svc-3',
        category: 'harvesting',
        title: 'Combine Harvesting Service',
        description: 'Professional harvesting with modern John Deere S790 combine. Includes grain cart service, moisture testing, and yield mapping.',
        provider: PROVIDERS[1],
        pricing: {
            type: 'per_acre',
            amount: 45,
            unit: 'acre',
        },
        availability: 'scheduled',
        minBooking: '100 acres',
        equipment: ['John Deere S790', 'Grain cart', 'Moisture tester'],
        certifications: ['Certified Operator'],
        serviceArea: '100 miles',
    },
    {
        id: 'svc-4',
        category: 'equipment_rental',
        title: 'Tractor Rental - John Deere 8R Series',
        description: '370 HP tractor available for daily or weekly rental. Includes delivery and pickup within service area. Operator available for additional fee.',
        provider: PROVIDERS[2],
        pricing: {
            type: 'daily',
            amount: 850,
            unit: 'day',
        },
        availability: 'next_day',
        equipment: ['John Deere 8R 370', 'Various implements available'],
        serviceArea: '30 miles',
    },
    {
        id: 'svc-5',
        category: 'equipment_rental',
        title: 'Drone Rental - DJI Matrice 350 RTK',
        description: 'Survey-grade drone with multispectral camera. Includes training, batteries, and data processing software. Perfect for field mapping and analysis.',
        provider: PROVIDERS[2],
        pricing: {
            type: 'daily',
            amount: 450,
            unit: 'day',
        },
        availability: 'same_day',
        equipment: ['DJI Matrice 350 RTK', 'Multispectral camera', '6 batteries', 'Processing software'],
        serviceArea: '50 miles',
    },
    {
        id: 'svc-6',
        category: 'soil_testing',
        title: 'Comprehensive Soil Analysis',
        description: 'Complete soil testing package including NPK, pH, organic matter, micronutrients, and texture analysis. Results in 3-5 business days with detailed recommendations.',
        provider: PROVIDERS[3],
        pricing: {
            type: 'per_acre',
            amount: 15,
            unit: 'acre',
        },
        availability: 'same_day',
        minBooking: '10 acres',
        certifications: ['Certified Soil Scientist', 'NAPT Accredited Lab'],
        serviceArea: '100 miles',
    },
    {
        id: 'svc-7',
        category: 'soil_testing',
        title: 'Quick Soil Test - NPK Only',
        description: 'Fast turnaround soil testing for nitrogen, phosphorus, and potassium levels. Results within 24 hours. Ideal for in-season adjustments.',
        provider: PROVIDERS[3],
        pricing: {
            type: 'per_acre',
            amount: 8,
            unit: 'acre',
        },
        availability: 'immediate',
        minBooking: '5 acres',
        serviceArea: '100 miles',
    },
    {
        id: 'svc-8',
        category: 'consulting',
        title: 'Crop Management Consultation',
        description: 'Expert agronomic consultation including field walks, crop health assessment, pest/disease identification, and customized management recommendations.',
        provider: PROVIDERS[4],
        pricing: {
            type: 'hourly',
            amount: 150,
            unit: 'hour',
        },
        availability: 'scheduled',
        minBooking: '2 hours',
        certifications: ['Certified Crop Advisor', 'PhD Agronomy'],
        serviceArea: '60 miles',
    },
    {
        id: 'svc-9',
        category: 'consulting',
        title: 'Precision Agriculture Setup',
        description: 'Complete precision ag system setup including GPS guidance installation, yield monitor calibration, and VRA mapping. Training included.',
        provider: PROVIDERS[4],
        pricing: {
            type: 'fixed',
            amount: 2500,
            unit: 'project',
        },
        availability: 'scheduled',
        certifications: ['Precision Ag Specialist', 'John Deere Certified'],
        serviceArea: '75 miles',
    },
    {
        id: 'svc-10',
        category: 'maintenance',
        title: 'Equipment Maintenance & Repair',
        description: 'Mobile maintenance service for tractors, combines, and implements. Routine maintenance, diagnostics, and repairs performed on-site.',
        provider: PROVIDERS[2],
        pricing: {
            type: 'hourly',
            amount: 125,
            unit: 'hour',
        },
        availability: 'same_day',
        minBooking: '1 hour',
        certifications: ['ASE Certified', 'Manufacturer Trained'],
        serviceArea: '40 miles',
    },
];

// Get services by category
export function getServicesByCategory(category: ServiceCategory) {
    return SERVICES.filter(s => s.category === category);
}

// Get services by availability
export function getServicesByAvailability(availability: Service['availability']) {
    return SERVICES.filter(s => s.availability === availability);
}

// Calculate service cost
export function calculateServiceCost(service: Service, quantity: number): number {
    return service.pricing.amount * quantity;
}

// Service categories with metadata
export const SERVICE_CATEGORIES = {
    equipment_rental: {
        label: 'Equipment Rental',
        description: 'Rent tractors, drones, and other equipment',
        icon: 'Tractor',
    },
    spraying: {
        label: 'Spraying Services',
        description: 'Aerial and ground spraying',
        icon: 'Plane',
    },
    harvesting: {
        label: 'Harvesting',
        description: 'Professional harvesting services',
        icon: 'Wheat',
    },
    soil_testing: {
        label: 'Soil Testing',
        description: 'Laboratory soil analysis',
        icon: 'Flask',
    },
    consulting: {
        label: 'Consulting',
        description: 'Expert agronomic advice',
        icon: 'Users',
    },
    maintenance: {
        label: 'Maintenance',
        description: 'Equipment repair and service',
        icon: 'Wrench',
    },
};
