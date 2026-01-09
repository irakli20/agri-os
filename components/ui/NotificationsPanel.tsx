'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Bell,
    X,
    CheckCircle,
    CheckCircle2,
    XCircle,
    Truck,
    Play,
    DollarSign,
    CloudRain,
    MessageCircle,
    Star,
    ChevronRight,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    NOTIFICATIONS,
    NOTIFICATION_CONFIG,
    getUnreadCount,
    getRecentNotifications,
    formatRelativeTime,
    type Notification,
    type NotificationType
} from '@/lib/notifications-data';

const ICON_MAP: Record<string, React.ElementType> = {
    CheckCircle,
    CheckCircle2,
    XCircle,
    Truck,
    Play,
    DollarSign,
    CloudRain,
    MessageCircle,
    Star,
    Bell,
};

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.read).length;
    const recentNotifications = [...notifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-4 top-16 w-96 max-h-[calc(100vh-5rem)] glass-panel rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {recentNotifications.map((notification) => {
                                const config = NOTIFICATION_CONFIG[notification.type];
                                const IconComponent = ICON_MAP[config.icon] || Bell;

                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-white/5 transition-colors relative group",
                                            !notification.read && "bg-white/[0.02]"
                                        )}
                                    >
                                        {/* Unread indicator */}
                                        {!notification.read && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                        )}

                                        <div className="flex gap-3 pl-2">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                config.bgColor
                                            )}>
                                                <IconComponent className={cn("w-5 h-5", config.color)} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-sm">
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {formatRelativeTime(notification.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                {notification.actionUrl && notification.actionLabel && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        onClick={() => {
                                                            markAsRead(notification.id);
                                                            onClose();
                                                        }}
                                                        className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                                                    >
                                                        {notification.actionLabel}
                                                        <ChevronRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Mark as read button */}
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10">
                    <Link
                        href="/notifications"
                        onClick={onClose}
                        className="block text-center text-sm text-primary hover:underline"
                    >
                        View all notifications
                    </Link>
                </div>
            </div>
        </>
    );
}

// Bell button with badge for header
interface NotificationBellProps {
    onClick: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
    const unreadCount = getUnreadCount();

    return (
        <button
            onClick={onClick}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
}
