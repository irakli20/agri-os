'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    ClipboardList,
    Plus,
    Gamepad2,
    Zap,
    Star,
    RotateCcw,
    BookOpen,
    type LucideIcon,
    Leaf,
    Tractor,
    ShieldCheck,
    AlertTriangle,
    Target,
    Wind,
    BarChart3,
    Store,
} from 'lucide-react';
import { CommandBar } from '@/components/ui/CommandBar';
import { NotificationBell, NotificationsPanel } from '@/components/ui/NotificationsPanel';
import { QuickScoutModal } from '@/components/modals/QuickScoutModal';
import { WeeklyPlanningModal } from '@/components/modals/WeeklyPlanningModal';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { StrategyGuideArrow } from '@/components/game/StrategyGuideArrow';
import { GuideOrchestrator } from '@/components/game/GuideOrchestrator';
import { WEATHER } from '@/lib/mock-data';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isQuickScoutOpen, setIsQuickScoutOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const {
        gameMode,
        toggleGameMode,
        getCurrentPlayer,
        isWeeklyPlannerOpen,
        closeWeeklyPlanner,
        openWeeklyPlanner,
        advanceTime,
        weeklyChallenges,
        resetSeason,
    } = useGameStore();
    const { syncGameFields, getActiveFields } = useFieldStore();

    // Ensure we have the latest player state
    const player = getCurrentPlayer();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync Game Fields with Field Store whenever player ownership changes
    useEffect(() => {
        if (player) {
            syncGameFields(player.ownedFieldIds, player.rentedFieldIds);
        }
    }, [player, syncGameFields]);

    const handleGameModeToggle = () => {
        toggleGameMode();
        if (!gameMode) {
            // Switching TO game mode
            router.push('/game/dashboard');
        } else {
            // Switching back to farm manager
            router.push('/');
        }
    };

    type NavSection = 'operations' | 'agronomy' | 'business';
    interface NavItem {
        icon: LucideIcon;
        label: string;
        href: string;
        section: NavSection;
        hint: string;
    }
    const navItems: NavItem[] = [
        { icon: LayoutDashboard, label: 'Game Dashboard', href: '/game/dashboard', section: 'operations', hint: 'Live mission control overview' },
        { icon: MapIcon, label: 'My Fields', href: '/game/my-fields', section: 'operations', hint: 'Boundaries, zones, and field detail' },
        { icon: Store, label: 'Marketplace', href: '/game/marketplace', section: 'business', hint: 'Buy/rent land and equipment' },
        { icon: Plane, label: 'Fleet', href: '/fleet', section: 'operations', hint: 'Drone readiness and assignments' },
        { icon: Wrench, label: 'Equipment', href: '/equipment', section: 'operations', hint: 'Maintenance and uptime planning' },
        { icon: BookOpen, label: 'Runbooks', href: '/runbooks', section: 'operations', hint: 'Guided step-by-step operation playbooks' },
        { icon: Package, label: 'Inventory', href: '/inventory', section: 'business', hint: 'Stock, reorder points, and usage' },
        { icon: DollarSign, label: 'Procurement', href: '/procurement', section: 'business', hint: 'Input purchasing and vendors' },
        { icon: CreditCard, label: 'Finance', href: '/finance', section: 'business', hint: 'Cash flow and transactions' },
        { icon: BarChart3, label: 'Season Review', href: '/review', section: 'business', hint: 'Post-season decision attribution' },
        { icon: ShoppingCart, label: 'Services', href: '/services', section: 'business', hint: 'Book external farm services' },
        { icon: ClipboardList, label: 'Bookings', href: '/bookings', section: 'business', hint: 'Track service and task bookings' },
        { icon: Sprout, label: 'Crops', href: '/crops', section: 'agronomy', hint: 'Crop health and growth tracking' },
        { icon: CloudRain, label: 'Weather', href: '/weather', section: 'agronomy', hint: 'Forecast and spray windows' },
        { icon: Settings, label: 'Settings', href: '/settings', section: 'business', hint: 'Workspace preferences and controls' },
    ];
    const activeNav = navItems.find(i => i.href === pathname);
    const ActiveIcon = activeNav?.icon || LayoutDashboard;
    const navSections: { key: NavSection; label: string; icon: LucideIcon }[] = [
        { key: 'operations', label: 'Operations', icon: Tractor },
        { key: 'agronomy', label: 'Agronomy', icon: Leaf },
        { key: 'business', label: 'Business', icon: ShieldCheck },
    ];
    const openWeeklyChallenges = weeklyChallenges.filter((challenge) => challenge.status === 'open').length;
    const activeFields = getActiveFields(gameMode);
    const criticalFieldCount = activeFields.filter((field) => field.healthStatus === 'critical').length;
    const sprayReady = WEATHER.current.windSpeed < 10 && WEATHER.current.precipitation === 0;

    return (
        <div className="relative flex h-screen w-screen overflow-hidden agri-bg text-foreground">
            <div className="pointer-events-none absolute inset-0 agri-grid opacity-25" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 tracking-wide to-transparent" />
            {/* Sidebar */}
            <aside
                className={cn(
                    "glass-sidebar relative z-50 flex flex-col transition-all duration-300 ease-in-out",
                    isSidebarCollapsed ? "w-16" : "w-72"
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
                            Agri-OS Control
                        </span>
                    </div>
                </div>

                {!isSidebarCollapsed && (
                    <div className="px-3 py-3 border-b border-white/10">
                        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent p-3 shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.14em] text-primary/90">Farm Pulse</span>
                                <span className={cn(
                                    "text-[10px] rounded-full px-2 py-0.5 border",
                                    sprayReady
                                        ? "border-green-300/40 bg-green-500/20 text-green-200"
                                        : "border-red-300/30 bg-red-500/20 text-red-200"
                                )}>
                                    {sprayReady ? 'Spray-ready' : 'Hold spray'}
                                </span>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                    <p className="text-[10px] text-muted-foreground">Fields</p>
                                    <p className="font-semibold">{activeFields.length}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                    <p className="text-[10px] text-muted-foreground">Critical</p>
                                    <p className="font-semibold text-red-300">{criticalFieldCount}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                    <p className="text-[10px] text-muted-foreground">Wind</p>
                                    <p className="font-semibold">{WEATHER.current.windSpeed}mph</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Mode Toggle */}
                <div className="px-3 py-3 border-b border-white/5">
                    <button
                        onClick={handleGameModeToggle}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 border",
                            gameMode
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        )}
                    >
                        <Gamepad2 className={cn("w-5 h-5 shrink-0", gameMode ? "text-green-400" : "text-muted-foreground")} />
                        <span className={cn(
                            "text-sm font-medium whitespace-nowrap transition-all duration-200",
                            isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                        )}>
                            {gameMode ? 'Strategy Mode Active' : 'Switch To Strategy'}
                        </span>
                        {!isSidebarCollapsed && (
                            <div className={cn(
                                "ml-auto w-8 h-[18px] rounded-full transition-all duration-300 relative",
                                gameMode ? "bg-green-500" : "bg-white/20"
                            )}>
                                <div className={cn(
                                    "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-300 shadow-sm",
                                    gameMode ? "left-[15px]" : "left-[2px]"
                                )} />
                            </div>
                        )}
                    </button>

                    {/* Active Game Mode Indicator explanation (collapsed) */}
                    {isSidebarCollapsed && gameMode && (
                        <div className="absolute left-16 top-20 bg-green-500/90 text-white text-xs px-2 py-1 rounded ml-2 pointer-events-none whitespace-nowrap z-50">
                            Game Mode Active
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-5 px-2 overflow-y-auto">
                    <div className="space-y-4">
                        {navSections.map(({ key, label, icon: SectionIcon }) => (
                            <div key={key}>
                                {!isSidebarCollapsed && (
                                    <div className="px-3 pb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                                        <SectionIcon className="w-3 h-3" />
                                        <span>{label}</span>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    {navItems.filter((item) => item.section === key).map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                                    isActive
                                                        ? "nav-item-active bg-primary/10 text-primary border border-primary/20"
                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                )}
                                            >
                                                <span className={cn(
                                                    "icon-chip h-8 w-8 shrink-0 transition-colors",
                                                    isActive ? "bg-primary/20 text-primary border-primary/25" : "text-muted-foreground"
                                                )}>
                                                    <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                                                </span>
                                                <div className={cn(
                                                    "min-w-0 transition-all duration-200",
                                                    isSidebarCollapsed ? "opacity-0 w-0 translate-x-4" : "opacity-100 translate-x-0"
                                                )}>
                                                    <span className="block font-medium text-sm whitespace-nowrap">{item.label}</span>
                                                    <span className="block text-[10px] text-muted-foreground/80 truncate">{item.hint}</span>
                                                </div>

                                                {/* Tooltip for collapsed state */}
                                                {isSidebarCollapsed && (
                                                    <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10 whitespace-nowrap">
                                                        {item.label}
                                                    </div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>

                {!isSidebarCollapsed && (
                    <div className="px-3 pb-3">
                        <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs shadow-inner">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-primary">Today&apos;s Focus</span>
                                <span className="text-primary/90">{activeNav?.label ?? 'Dashboard'}</span>
                            </div>
                            <p className="text-primary/70 leading-relaxed">
                                {activeNav?.hint ?? 'Manage mission-critical farm operations from one place.'}
                            </p>
                        </div>
                    </div>
                )}

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
                <header className="glass-header px-4 md:px-6 py-3 relative z-40">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="icon-chip h-10 w-10 text-primary pulse-soft shrink-0 shadow-lg">
                                <ActiveIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                                    {activeNav?.label || 'Dashboard'}
                                </h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {activeNav?.hint || 'Operational overview and task prioritization'}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="status-chip">
                                        <Target className="h-3.5 w-3.5 text-primary" />
                                        {activeFields.length} active fields
                                    </span>
                                    <span className="status-chip">
                                        <AlertTriangle className="h-3.5 w-3.5 text-secondary" />
                                        {criticalFieldCount} critical
                                    </span>
                                    <span className="status-chip">
                                        <Wind className="h-3.5 w-3.5 text-blue-300" />
                                        {WEATHER.current.windSpeed} mph wind
                                    </span>
                                    {mounted && gameMode && (
                                        <span className="status-chip border-primary/40 bg-primary/20 text-primary shadow-sm">
                                            Strategy Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block w-full xl:w-[520px]">
                            <CommandBar />
                        </div>

                        <div className="flex items-center gap-3 xl:justify-end">
                            {mounted && gameMode && (
                                <>
                                    <button
                                        onClick={openWeeklyPlanner}
                                        data-guide-id="game-cta-open-weekly-plan"
                                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-foreground border border-white/10"
                                    >
                                        Weekly Plan
                                        {openWeeklyChallenges > 0 && (
                                            <span className="ml-1 rounded bg-orange-500/30 px-1 py-0.5 text-[10px] text-orange-200">
                                                {openWeeklyChallenges}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={advanceTime}
                                        data-guide-id="game-cta-next-week"
                                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                                    >
                                        Next Week
                                    </button>
                                </>
                            )}

                            {mounted && gameMode && player && (
                                <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
                                    <span className="status-chip">
                                        <DollarSign className="h-3.5 w-3.5 text-yellow-300" />
                                        ${player.balance.toLocaleString()}
                                    </span>
                                    <span className="status-chip">
                                        <Zap className="h-3.5 w-3.5 text-purple-300" />
                                        {player.xp} XP
                                    </span>
                                    <span className="status-chip">
                                        <Star className="h-3.5 w-3.5 text-yellow-300" />
                                        Lv {player.level}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={() => setIsQuickScoutOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground border border-white/10 bg-white/5"
                                title="Quick Scout"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <NotificationBell onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} />
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary/80 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-md">
                                {mounted && gameMode && player ? player.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            {mounted && gameMode && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Reset current season and clear all owned/rented fields?')) {
                                            resetSeason();
                                        }
                                    }}
                                    className="hidden 2xl:inline-flex px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 text-xs font-semibold items-center gap-1.5"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Reset Season
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    <NotificationsPanel
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                    />

                    {/* Quick Scout Modal */}
                    <QuickScoutModal
                        isOpen={isQuickScoutOpen}
                        onClose={() => setIsQuickScoutOpen(false)}
                    />
                </header>

                {/* Content */}
                <div className="flex-1 relative overflow-hidden px-2 md:px-6 page-enter">
                    {children}
                </div>
            </main>
            <WeeklyPlanningModal
                isOpen={isWeeklyPlannerOpen}
                onClose={closeWeeklyPlanner}
            />
            <GuideOrchestrator />
            <StrategyGuideArrow />
        </div>
    );
}
