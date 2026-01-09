/**
 * Service Bookings Data
 * 
 * Tracks all service bookings with real-time status updates
 */

export type BookingStatus =
    | 'pending_confirmation'
    | 'confirmed'
    | 'provider_en_route'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export interface ServiceBooking {
    id: string;
    serviceId: string;
    serviceName: string;
    providerName: string;
    providerCompany: string;
    providerPhone: string;
    providerRating: number;
    fieldName: string;
    acres: number;
    scheduledDate: string;
    scheduledTime: string;
    status: BookingStatus;
    totalCost: number;
    createdAt: string;
    notes?: string;
    // Real-time tracking
    providerLocation?: {
        lat: number;
        lng: number;
        eta: string;
    };
    timeline: {
        status: BookingStatus;
        timestamp: string;
        note?: string;
    }[];
}

// Status display configuration
export const BOOKING_STATUS_CONFIG: Record<BookingStatus, {
    label: string;
    color: string;
    bgColor: string;
    description: string;
}> = {
    pending_confirmation: {
        label: 'Pending',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        description: 'Waiting for provider confirmation',
    },
    confirmed: {
        label: 'Confirmed',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        description: 'Provider has confirmed the booking',
    },
    provider_en_route: {
        label: 'En Route',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        description: 'Provider is on their way',
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        description: 'Service is currently being performed',
    },
    completed: {
        label: 'Completed',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
        description: 'Service has been completed',
    },
    cancelled: {
        label: 'Cancelled',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        description: 'Booking was cancelled',
    },
};

// Mock bookings data
export const BOOKINGS: ServiceBooking[] = [
    {
        id: 'BK-001',
        serviceId: 'svc-1',
        serviceName: 'Aerial Crop Spraying - DJI Agras T40',
        providerName: 'Mike Rodriguez',
        providerCompany: 'AgriSpray Pro',
        providerPhone: '+1 (555) 123-4567',
        providerRating: 4.9,
        fieldName: 'North 40',
        acres: 42,
        scheduledDate: '2025-12-04',
        scheduledTime: '08:00 AM',
        status: 'provider_en_route',
        totalCost: 504,
        createdAt: '2025-12-03T14:30:00Z',
        notes: 'Access through east gate. Watch for irrigation lines.',
        providerLocation: {
            lat: 38.5816,
            lng: -121.4944,
            eta: '15 min',
        },
        timeline: [
            { status: 'pending_confirmation', timestamp: '2025-12-03T14:30:00Z' },
            { status: 'confirmed', timestamp: '2025-12-03T14:45:00Z', note: 'Provider accepted the booking' },
            { status: 'provider_en_route', timestamp: '2025-12-04T07:30:00Z', note: 'Provider has departed' },
        ],
    },
    {
        id: 'BK-002',
        serviceId: 'svc-6',
        serviceName: 'Comprehensive Soil Analysis',
        providerName: 'Emily Watson',
        providerCompany: 'SoilTech Labs',
        providerPhone: '+1 (555) 234-5678',
        providerRating: 5.0,
        fieldName: 'South Vineyard',
        acres: 28,
        scheduledDate: '2025-12-05',
        scheduledTime: '09:00 AM',
        status: 'confirmed',
        totalCost: 420,
        createdAt: '2025-12-02T10:15:00Z',
        timeline: [
            { status: 'pending_confirmation', timestamp: '2025-12-02T10:15:00Z' },
            { status: 'confirmed', timestamp: '2025-12-02T11:00:00Z', note: 'Appointment confirmed' },
        ],
    },
    {
        id: 'BK-003',
        serviceId: 'svc-3',
        serviceName: 'Combine Harvesting Service',
        providerName: 'Sarah Chen',
        providerCompany: 'Precision Harvest Services',
        providerPhone: '+1 (555) 345-6789',
        providerRating: 4.8,
        fieldName: 'West Pasture',
        acres: 55,
        scheduledDate: '2025-12-10',
        scheduledTime: '06:00 AM',
        status: 'pending_confirmation',
        totalCost: 2475,
        createdAt: '2025-12-04T09:00:00Z',
        timeline: [
            { status: 'pending_confirmation', timestamp: '2025-12-04T09:00:00Z' },
        ],
    },
    {
        id: 'BK-004',
        serviceId: 'svc-8',
        serviceName: 'Crop Management Consultation',
        providerName: 'David Kim',
        providerCompany: 'AgriConsult Partners',
        providerPhone: '+1 (555) 456-7890',
        providerRating: 4.9,
        fieldName: 'East Orchard',
        acres: 35,
        scheduledDate: '2025-11-28',
        scheduledTime: '02:00 PM',
        status: 'completed',
        totalCost: 450,
        createdAt: '2025-11-25T16:00:00Z',
        timeline: [
            { status: 'pending_confirmation', timestamp: '2025-11-25T16:00:00Z' },
            { status: 'confirmed', timestamp: '2025-11-25T16:30:00Z' },
            { status: 'provider_en_route', timestamp: '2025-11-28T13:00:00Z' },
            { status: 'in_progress', timestamp: '2025-11-28T14:00:00Z' },
            { status: 'completed', timestamp: '2025-11-28T17:00:00Z', note: 'Consultation complete. Report sent via email.' },
        ],
    },
    {
        id: 'BK-005',
        serviceId: 'svc-2',
        serviceName: 'Ground Spraying - High Clearance Sprayer',
        providerName: 'Mike Rodriguez',
        providerCompany: 'AgriSpray Pro',
        providerPhone: '+1 (555) 123-4567',
        providerRating: 4.9,
        fieldName: 'North 40',
        acres: 42,
        scheduledDate: '2025-11-20',
        scheduledTime: '07:00 AM',
        status: 'completed',
        totalCost: 336,
        createdAt: '2025-11-18T08:00:00Z',
        timeline: [
            { status: 'pending_confirmation', timestamp: '2025-11-18T08:00:00Z' },
            { status: 'confirmed', timestamp: '2025-11-18T08:15:00Z' },
            { status: 'provider_en_route', timestamp: '2025-11-20T06:00:00Z' },
            { status: 'in_progress', timestamp: '2025-11-20T07:00:00Z' },
            { status: 'completed', timestamp: '2025-11-20T11:30:00Z', note: 'Application complete. Used 120 gal product.' },
        ],
    },
];

// Get bookings by status
export function getBookingsByStatus(status: BookingStatus): ServiceBooking[] {
    return BOOKINGS.filter(b => b.status === status);
}

// Get active bookings (not completed or cancelled)
export function getActiveBookings(): ServiceBooking[] {
    return BOOKINGS.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
}

// Get completed bookings
export function getCompletedBookings(): ServiceBooking[] {
    return BOOKINGS.filter(b => b.status === 'completed');
}

// Get booking stats
export function getBookingStats() {
    const active = getActiveBookings();
    const completed = getCompletedBookings();
    const totalSpent = BOOKINGS.reduce((sum, b) =>
        b.status === 'completed' ? sum + b.totalCost : sum, 0
    );
    const pending = BOOKINGS.reduce((sum, b) =>
        b.status !== 'completed' && b.status !== 'cancelled' ? sum + b.totalCost : sum, 0
    );

    return {
        activeCount: active.length,
        completedCount: completed.length,
        totalSpent,
        pendingCost: pending,
    };
}
