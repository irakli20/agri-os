'use client';

import React, { useState } from 'react';
import { Widget } from '@/components/dashboard/DashboardGrid';
import {
    Calendar,
    ShoppingCart,
    Wrench,
    CreditCard,
    MessageCircle,
    Package,
    FileText,
    ArrowRight,
    ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { ReportGeneratorModal } from '@/components/modals/ReportGeneratorModal';

export function QuickActionsCard() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const actions = [
        {
            label: 'Book Service',
            description: 'Schedule external support',
            icon: Calendar,
            href: '/services',
            color: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
        },
        {
            label: 'Order Supplies',
            description: 'Procure seeds and inputs',
            icon: ShoppingCart,
            href: '/procurement',
            color: 'text-green-400 bg-green-500/10 hover:bg-green-500/20',
        },
        {
            label: 'Maintenance',
            description: 'Prevent equipment downtime',
            icon: Wrench,
            href: '/equipment',
            color: 'text-orange-400 bg-orange-500/10 hover:bg-orange-500/20',
        },
        {
            label: 'Manage Cards',
            description: 'Control payment methods',
            icon: CreditCard,
            href: '/finance',
            color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20',
        },
        {
            label: 'Messages',
            description: 'Check provider updates',
            icon: MessageCircle,
            href: '/bookings',
            color: 'text-pink-400 bg-pink-500/10 hover:bg-pink-500/20',
        },
        {
            label: 'Inventory',
            description: 'Track stock on hand',
            icon: Package,
            href: '/inventory',
            color: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20',
        },
        {
            label: 'Generate Report',
            description: 'Export operation summary',
            icon: FileText,
            onClick: () => setIsReportModalOpen(true),
            color: 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20',
        },
    ];

    return (
        <Widget
            title="Quick Actions"
            action={<ClipboardCheck className="w-4 h-4 text-primary" />}
        >
            <div className="space-y-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    if (action.onClick) {
                        return (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border border-white/5 ${action.color}`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <div className="text-left min-w-0">
                                    <span className="block text-xs font-semibold">{action.label}</span>
                                    <span className="block text-[10px] text-muted-foreground truncate">{action.description}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={action.label}
                            href={action.href!}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border border-white/5 ${action.color}`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <div className="text-left min-w-0">
                                <span className="block text-xs font-semibold">{action.label}</span>
                                <span className="block text-[10px] text-muted-foreground truncate">{action.description}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
                        </Link>
                    );
                })}
            </div>

            <ReportGeneratorModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={(report) => {
                    console.log('Report generated:', report);
                }}
            />
        </Widget>
    );
}
