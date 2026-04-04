// @ts-nocheck
/**
 * Notifications Data
 * 
 * System notifications for booking updates, alerts, and messages
 */

export type NotificationType =
    | 'booking_confirmed'
    | 'provider_en_route'
    | 'service_started'
    | 'service_completed'
    | 'booking_cancelled'
    | 'payment_received'
    | 'weather_alert'
    | 'message_received'
    | 'review_reminder'
    | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
    relatedBookingId?: string;
    icon?: string;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, {
    color: string;
    bgColor: string;
    icon: string;
}> = {
    booking_confirmed: {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        icon: 'CheckCircle',
    },
    provider_en_route: {
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        icon: 'Truck',
    },
    service_started: {
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        icon: 'Play',
    },
    service_completed: {
        color: 'text-primary',
        bgColor: 'bg-primary/20',
        icon: 'CheckCircle2',
    },
    booking_cancelled: {
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        icon: 'XCircle',
    },
    payment_received: {
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        icon: 'DollarSign',
    },
    weather_alert: {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        icon: 'CloudRain',
    },
    message_received: {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        icon: 'MessageCircle',
    },
    review_reminder: {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        icon: 'Star',
    },
    system: {
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        icon: 'Bell',
    },
};

// Mock notifications
export const NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'provider_en_route',
        title: 'Provider On The Way',
        message: 'Mike Rodriguez from AgriSpray Pro is heading to North 40. ETA: 15 minutes.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
        read: false,
        relatedBookingId: 'BK-001',
        actionUrl: '/bookings',
        actionLabel: 'Track Provider',
    },
    {
        id: 'notif-2',
        type: 'weather_alert',
        title: 'Weather Advisory',
        message: 'Wind speeds increasing to 12mph tomorrow. Aerial spraying may need to be rescheduled.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
        read: false,
        actionUrl: '/weather',
        actionLabel: 'View Forecast',
    },
    {
        id: 'notif-3',
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your soil analysis booking with SoilTech Labs for Dec 5th has been confirmed.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        relatedBookingId: 'BK-002',
        actionUrl: '/bookings',
        actionLabel: 'View Booking',
    },
    {
        id: 'notif-4',
        type: 'review_reminder',
        title: 'Leave a Review',
        message: 'How was your consultation with AgriConsult Partners? Share your experience!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        relatedBookingId: 'BK-004',
        actionUrl: '/bookings',
        actionLabel: 'Write Review',
    },
    {
        id: 'notif-5',
        type: 'service_completed',
        title: 'Service Completed',
        message: 'Ground spraying at North 40 has been completed. Application report available.',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        read: true,
        relatedBookingId: 'BK-005',
        actionUrl: '/bookings',
        actionLabel: 'View Report',
    },
    {
        id: 'notif-6',
        type: 'payment_received',
        title: 'Payment Processed',
        message: 'Payment of $336.00 to AgriSpray Pro has been processed successfully.',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        read: true,
        relatedBookingId: 'BK-005',
        actionUrl: '/finance',
        actionLabel: 'View Receipt',
    },
    {
        id: 'notif-7',
        type: 'message_received',
        title: 'New Message',
        message: 'Sarah Chen sent you a message about your upcoming harvesting service.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        relatedBookingId: 'BK-003',
    },
];

// Get unread notifications
export function getUnreadNotifications(): Notification[] {
    return NOTIFICATIONS.filter(n => !n.read);
}

// Get unread count
export function getUnreadCount(): number {
    return NOTIFICATIONS.filter(n => !n.read).length;
}

// Get recent notifications
export function getRecentNotifications(limit: number = 10): Notification[] {
    return [...NOTIFICATIONS]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
}
