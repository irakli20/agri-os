'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/lib/game-store';
import {
    LayoutDashboard,
    Map as MapIcon,
    Store,
    ChevronLeft,
    Target,
    DollarSign,
    Zap,
    Star
} from 'lucide-react';
import { NotificationBell } from '@/components/ui/NotificationsPanel';

interface GameShellProps {
    children: React.ReactNode;
    hideSidebar?: boolean;
    title?: string;
}

export function GameShell({ children, hideSidebar, title }: GameShellProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const {
        gameMode,
        toggleGameMode,
        players,
        currentPlayerId
    } = useGameStore();

    const player = players.find(p => p.id === currentPlayerId);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Game Dashboard', href: '/game/dashboard', hint: 'Strategy overview' },
        { icon: MapIcon, label: 'My Fields', href: '/game/my-fields', hint: 'Manage your owned/rented land' },
        { icon: Store, label: 'Marketplace', href: '/game/marketplace', hint: 'Buy/rent fields and equipment' },
    ];

    const activeNav = navItems.find(i => pathname.startsWith(i.href)) || navItems[0];

    const handleGameModeToggle = () => {
        toggleGameMode();
        router.push('/');
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
            {/* Sidebar - hidden on pages that don't need it */}
            {!hideSidebar && (
                <aside
                    className={cn(
                        "glass-sidebar relative z-50 flex flex-col transition-all duration-300 ease-in-out",
                        isSidebarCollapsed ? "w-16" : "w-64"
                    )}
                >
                    <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <span className={cn(
                                "font-bold text-lg tracking-tight transition-opacity duration-200 text-primary",
                                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                            )}>
                                Strategy Mode
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 py-6 px-2 overflow-y-auto space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "nav-item-active bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    )}
                                >
                                    <span className={cn(
                                        "icon-chip h-8 w-8 shrink-0 transition-colors",
                                        isActive ? "bg-primary/20 text-primary border border-primary/25 shadow-inner" : "text-muted-foreground"
                                    )}>
                                        <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                                    </span>
                                    <div className={cn(
                                        "min-w-0 transition-all duration-200",
                                        isSidebarCollapsed ? "opacity-0 w-0 translate-x-4" : "opacity-100 translate-x-0"
                                    )}>
                                        <span className="block font-medium text-sm whitespace-nowrap">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleGameModeToggle}
                            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground text-sm flex items-center gap-2 transition-colors border border-white/10"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {!isSidebarCollapsed && "Exit Strategy Mode"}
                        </button>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0">
                <header className="glass-header px-4 md:px-6 py-3 relative z-40 border-b border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-start gap-4">
                            <div>
                                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                                    {title || activeNav.label}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 xl:justify-end">
                            {mounted && player && (
                                <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                        <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-400">${player.balance.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                                        <span className="text-sm font-semibold text-purple-400">{player.xp} XP</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                        <Star className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-sm font-semibold text-foreground">Lv {player.level}</span>
                                    </div>
                                </div>
                            )}
                            <NotificationBell onClick={() => { }} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative overflow-hidden page-enter">
                    {children}
                </div>
            </main>
        </div>
    );
}
