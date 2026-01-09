'use client';

import {
    Clock,
    CheckCircle,
    AlertTriangle,
    User,
    FileText,
    Settings,
    ShoppingCart,
    Wrench,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActivityType = 'system' | 'user' | 'alert' | 'transaction' | 'maintenance';

export interface ActivityLog {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    user?: string;
    metadata?: Record<string, any>;
}

interface ActivityLogPanelProps {
    activities: ActivityLog[];
    className?: string;
}

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
    system: Settings,
    user: User,
    alert: AlertTriangle,
    transaction: DollarSign,
    maintenance: Wrench,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
    system: 'text-gray-400 bg-gray-500/20',
    user: 'text-blue-400 bg-blue-500/20',
    alert: 'text-yellow-400 bg-yellow-500/20',
    transaction: 'text-green-400 bg-green-500/20',
    maintenance: 'text-orange-400 bg-orange-500/20',
};

export function ActivityLogPanel({ activities, className }: ActivityLogPanelProps) {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className={cn("glass-panel rounded-xl overflow-hidden flex flex-col h-full", className)}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Activity Log</h3>
                </div>
                <button className="text-xs text-primary hover:underline">View All</button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = ACTIVITY_ICONS[activity.type];
                        const isLast = index === activities.length - 1;

                        return (
                            <div key={activity.id} className="relative flex gap-4">
                                {/* Timeline Line */}
                                {!isLast && (
                                    <div className="absolute left-[19px] top-10 bottom-[-16px] w-0.5 bg-white/10" />
                                )}

                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-background",
                                    ACTIVITY_COLORS[activity.type]
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 pb-1">
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium text-sm">{activity.title}</div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatTime(activity.timestamp)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {activity.description}
                                    </p>
                                    {activity.user && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                            <User className="w-3 h-3" />
                                            <span>{activity.user}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Mock data generator
export const MOCK_ACTIVITIES: ActivityLog[] = [
    {
        id: '1',
        type: 'transaction',
        title: 'Payment Processed',
        description: 'Invoice #INV-2024-001 paid to AgriSpray Pro',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        user: 'System',
    },
    {
        id: '2',
        type: 'maintenance',
        title: 'Maintenance Scheduled',
        description: 'Preventive maintenance for John Deere 8R',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: 'Mike Wilson',
    },
    {
        id: '3',
        type: 'alert',
        title: 'Low Stock Alert',
        description: 'Nitrogen Fertilizer fell below reorder point',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
        id: '4',
        type: 'user',
        title: 'New User Added',
        description: 'Sarah Jenkins added as Field Manager',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        user: 'Admin',
    },
    {
        id: '5',
        type: 'system',
        title: 'System Backup',
        description: 'Daily database backup completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day, 2 hours ago
    },
];
