'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * DashboardGrid
 * 
 * A responsive grid container for dashboard widgets.
 * Designed to overlay the map or sit beside it.
 */
export function DashboardGrid({ children, className }: DashboardGridProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 pointer-events-none",
            className
        )}>
            {children}
        </div>
    );
}

interface WidgetProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
}

export function Widget({ children, className, title, action, icon: Icon }: WidgetProps) {
    return (
        <div className={cn(
            "glass-panel rounded-xl p-4 pointer-events-auto flex flex-col gap-2 animate-in fade-in zoom-in duration-300",
            className
        )}>
            {title && (
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {title}
                        </h3>
                    </div>
                    {action && <div className="flex items-center gap-1">{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
