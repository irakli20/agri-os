'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MapPin, Package, Wrench } from 'lucide-react';
import { CornFocusToggle } from './CornFocusToggle';

export function MarketplaceNav() {
    // Basic navigation logic for the marketplace
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl w-fit">
                <Link
                    href="/game/marketplace"
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                >
                    <MapPin className="w-4 h-4" />
                    Land & Fields
                </Link>
                <Link
                    href="/game/marketplace/supplies"
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                >
                    <Package className="w-4 h-4" />
                    Farm Supplies
                </Link>
                <Link
                    href="/game/marketplace/services"
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                >
                    <Wrench className="w-4 h-4" />
                    Services & Rentals
                </Link>
                <Link
                    href="/game/marketplace/equipment"
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                >
                    <Package className="w-4 h-4" />
                    Machinery
                </Link>
            </div>

            <CornFocusToggle />
        </div>
    );
}
