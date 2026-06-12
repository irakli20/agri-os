'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Map as MapIcon,
    Sprout,
    Settings,
    Menu,
    ChevronLeft,
    Plane,
    CloudRain,
    Wrench,
    ShoppingCart,
    Package,
    DollarSign,
    CreditCard,
    ClipboardList
} from 'lucide-react';
import { CommandBar } from '@/components/ui/CommandBar';
import { NotificationBell, NotificationsPanel } from '@/components/ui/NotificationsPanel';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: MapIcon, label: 'Fields', href: '/fields' },
        { icon: Plane, label: 'Fleet', href: '/fleet' },
        { icon: Plane, label: 'Raven Sim', href: '/raven-simulation' },
        { icon: Wrench, label: 'Equipment', href: '/equipment' },
        { icon: Package, label: 'Inventory', href: '/inventory' },
        { icon: DollarSign, label: 'Procurement', href: '/procurement' },
        { icon: CreditCard, label: 'Finance', href: '/finance' },
        { icon: ShoppingCart, label: 'Services', href: '/services' },
        { icon: ClipboardList, label: 'Bookings', href: '/bookings' },
        { icon: Sprout, label: 'Crops', href: '/crops' },
        { icon: CloudRain, label: 'Weather', href: '/weather' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#05080f] text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "glass-sidebar relative z-50 flex flex-col transition-all duration-300 ease-in-out",
                    isSidebarCollapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <Sprout className="w-5 h-5 text-primary" />
                        </div>
                        <span className={cn(
                            "font-bold text-lg tracking-tight transition-opacity duration-200",
                            isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                        )}>
                            Agri-OS
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                                <span className={cn(
                                    "font-medium text-sm whitespace-nowrap transition-all duration-200",
                                    isSidebarCollapsed ? "opacity-0 w-0 translate-x-4" : "opacity-100 translate-x-0"
                                )}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {isSidebarCollapsed && (
                                    <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="h-12 flex items-center justify-center border-t border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                    {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* Header */}
                <header className="h-16 glass-header flex items-center justify-between px-6 relative z-40">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-foreground/90">
                            {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Command Bar Container */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
                        <CommandBar />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <NotificationBell onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} />
                        {/* User Profile Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent border border-white/10" />
                    </div>

                    {/* Notifications Panel */}
                    <NotificationsPanel
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                    />
                </header>

                {/* Content */}
                <div className="flex-1 relative overflow-hidden px-2 md:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
