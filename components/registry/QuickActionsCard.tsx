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
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { ReportGeneratorModal } from '@/components/modals/ReportGeneratorModal';

export function QuickActionsCard() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const actions = [
        {
            label: 'Book Service',
            icon: Calendar,
            href: '/services',
            color: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
        },
        {
            label: 'Order Supplies',
            icon: ShoppingCart,
            href: '/procurement',
            color: 'text-green-400 bg-green-500/10 hover:bg-green-500/20',
        },
        {
            label: 'Maintenance',
            icon: Wrench,
            href: '/equipment',
            color: 'text-orange-400 bg-orange-500/10 hover:bg-orange-500/20',
        },
        {
            label: 'Manage Cards',
            icon: CreditCard,
            href: '/finance',
            color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20',
        },
        {
            label: 'Messages',
            icon: MessageCircle,
            href: '/bookings',
            color: 'text-pink-400 bg-pink-500/10 hover:bg-pink-500/20',
        },
        {
            label: 'Inventory',
            icon: Package,
            href: '/inventory',
            color: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20',
        },
        {
            label: 'Generate Report',
            icon: FileText,
            onClick: () => setIsReportModalOpen(true),
            color: 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20',
        },
    ];

    return (
        <Widget title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    if (action.onClick) {
                        return (
                            <button
                                key={action.label}
                                onClick={action.onClick}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${action.color}`}
                            >
                                <Icon className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium text-center">{action.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={action.label}
                            href={action.href!}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${action.color}`}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium text-center">{action.label}</span>
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
