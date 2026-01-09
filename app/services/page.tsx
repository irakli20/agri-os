'use client';

import { AppShell } from '@/components/layout/AppShell';
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from '@/lib/service-data';
import { ServiceBookingModal } from '@/components/modals/ServiceBookingModal';
import { Plane, Tractor, Wheat, FlaskConical, Users, Wrench, Star, Clock, MapPin, CheckCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CATEGORY_ICONS = {
    equipment_rental: Tractor,
    spraying: Plane,
    harvesting: Wheat,
    soil_testing: FlaskConical,
    consulting: Users,
    maintenance: Wrench,
};

const AVAILABILITY_COLORS = {
    immediate: 'text-green-400 bg-green-500/20',
    same_day: 'text-lime-400 bg-lime-500/20',
    next_day: 'text-yellow-400 bg-yellow-500/20',
    scheduled: 'text-blue-400 bg-blue-500/20',
};

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const filteredServices = activeCategory === 'all'
        ? SERVICES
        : SERVICES.filter(s => s.category === activeCategory);

    const selectedService = SERVICES.find(s => s.id === selectedServiceId);

    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Service Marketplace</h1>
                        <p className="text-muted-foreground mt-1">
                            Hire verified agricultural service providers
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/bookings" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            My Bookings
                        </Link>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            Become a Provider
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Available Services</div>
                        <div className="text-2xl font-bold">{SERVICES.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {SERVICES.filter(s => s.availability === 'immediate' || s.availability === 'same_day').length} available today
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Verified Providers</div>
                        <div className="text-2xl font-bold text-green-400">
                            {new Set(SERVICES.map(s => s.provider.id)).size}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            All background checked
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
                        <div className="text-2xl font-bold text-blue-400">&lt; 1 hour</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Typical provider response
                        </div>
                    </div>
                    <div className="glass-panel rounded-xl p-4">
                        <div className="text-sm text-muted-foreground mb-1">Avg Rating</div>
                        <div className="text-2xl font-bold text-yellow-400">4.8</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Based on 728 reviews
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            activeCategory === 'all'
                                ? "bg-primary text-primary-foreground"
                                : "bg-white/5 hover:bg-white/10"
                        )}
                    >
                        All Services
                    </button>
                    {Object.entries(SERVICE_CATEGORIES).map(([key, meta]) => {
                        const Icon = CATEGORY_ICONS[key as ServiceCategory];
                        const count = SERVICES.filter(s => s.category === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key as ServiceCategory)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                                    activeCategory === key
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {meta.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredServices.map((service) => {
                        const Icon = CATEGORY_ICONS[service.category];

                        return (
                            <div
                                key={service.id}
                                className="glass-panel rounded-xl p-6 hover:bg-white/10 transition-all group"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">{service.provider.company}</span>
                                                {service.provider.verified && (
                                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-medium">{service.provider.rating}</span>
                                                <span className="text-muted-foreground">({service.provider.reviewCount})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider shrink-0",
                                        AVAILABILITY_COLORS[service.availability]
                                    )}>
                                        {service.availability.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {service.description}
                                </p>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>{service.provider.responseTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{service.serviceArea} radius</span>
                                    </div>
                                    {service.minBooking && (
                                        <div className="flex items-center gap-2 col-span-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span>Min: {service.minBooking}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Equipment/Certifications */}
                                {(service.equipment || service.certifications) && (
                                    <div className="mb-4 space-y-2">
                                        {service.equipment && (
                                            <div className="flex flex-wrap gap-1">
                                                {service.equipment.slice(0, 3).map((eq, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded">
                                                        {eq}
                                                    </span>
                                                ))}
                                                {service.equipment.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-white/5 rounded">
                                                        +{service.equipment.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {service.certifications && (
                                            <div className="flex flex-wrap gap-1">
                                                {service.certifications.map((cert, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {cert}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pricing & Action */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div>
                                        <div className="text-2xl font-bold text-primary">
                                            ${service.pricing.amount}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                /{service.pricing.unit}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {service.pricing.type.replace('_', ' ')} pricing
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedServiceId(service.id)}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                    >
                                        Book Now
                                    </button>
                                </div>

                                {/* Provider Info */}
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{service.provider.completedJobs} completed jobs</span>
                                    <span>Response time: {service.provider.responseTime}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Booking Modal */}
                {selectedService && (
                    <ServiceBookingModal
                        service={selectedService}
                        isOpen={!!selectedService}
                        onClose={() => setSelectedServiceId(null)}
                    />
                )}
            </div>
        </AppShell>
    );
}
