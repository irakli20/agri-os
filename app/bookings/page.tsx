'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
    BOOKINGS,
    BOOKING_STATUS_CONFIG,
    getBookingStats,
    getActiveBookings,
    getCompletedBookings,
    type ServiceBooking,
    type BookingStatus
} from '@/lib/bookings-data';
import {
    MapPin,
    Clock,
    Phone,
    MessageCircle,
    Star,
    Calendar,
    Truck,
    CheckCircle,
    XCircle,
    ChevronRight,
    Navigation,
    DollarSign,
    History,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { ProviderMessageModal } from '@/components/modals/ProviderMessageModal';
import { ProviderProfileModal, MOCK_PROVIDER } from '@/components/modals/ProviderProfileModal';

type TabType = 'active' | 'completed';

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
    const [reviewBooking, setReviewBooking] = useState<ServiceBooking | null>(null);
    const [invoiceBooking, setInvoiceBooking] = useState<ServiceBooking | null>(null);
    const [messageProvider, setMessageProvider] = useState<ServiceBooking | null>(null);
    const [showProviderProfile, setShowProviderProfile] = useState(false);

    const stats = getBookingStats();
    const activeBookings = getActiveBookings();
    const completedBookings = getCompletedBookings();

    const displayedBookings = activeTab === 'active' ? activeBookings : completedBookings;

    return (
        <AppShell>
            <div className="flex h-full">
                {/* Main Content */}
                <div className={cn(
                    "flex-1 p-6 space-y-6 overflow-y-auto transition-all",
                    selectedBooking ? "lg:pr-[420px]" : ""
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">My Bookings</h1>
                            <p className="text-muted-foreground mt-1">
                                Track and manage your service bookings
                            </p>
                        </div>
                        <Link href="/services" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            Book New Service
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="glass-panel rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.activeCount}</div>
                                    <div className="text-xs text-muted-foreground">Active Bookings</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.completedCount}</div>
                                    <div className="text-xs text-muted-foreground">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Total Spent</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">${stats.pendingCost.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Pending Cost</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={cn(
                                "px-4 py-2 rounded-lg font-medium transition-colors",
                                activeTab === 'active'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white/5 hover:bg-white/10"
                            )}
                        >
                            Active ({activeBookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={cn(
                                "px-4 py-2 rounded-lg font-medium transition-colors",
                                activeTab === 'completed'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white/5 hover:bg-white/10"
                            )}
                        >
                            Completed ({completedBookings.length})
                        </button>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {displayedBookings.length === 0 ? (
                            <div className="glass-panel rounded-xl p-12 text-center">
                                <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    {activeTab === 'active'
                                        ? "You don't have any active bookings"
                                        : "You don't have any completed bookings"}
                                </p>
                                <Link href="/services" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    Browse Services
                                </Link>
                            </div>
                        ) : (
                            displayedBookings.map((booking) => {
                                const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
                                const isActive = booking.status === 'provider_en_route' || booking.status === 'in_progress';

                                return (
                                    <div
                                        key={booking.id}
                                        onClick={() => setSelectedBooking(booking)}
                                        className={cn(
                                            "glass-panel rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group",
                                            selectedBooking?.id === booking.id && "ring-2 ring-primary",
                                            isActive && "border-l-4 border-l-green-400"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Header */}
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-medium",
                                                        statusConfig.bgColor,
                                                        statusConfig.color
                                                    )}>
                                                        {statusConfig.label}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {booking.id}
                                                    </span>
                                                    {isActive && booking.providerLocation && (
                                                        <span className="flex items-center gap-1 text-xs text-green-400 animate-pulse">
                                                            <Navigation className="w-3 h-3" />
                                                            ETA: {booking.providerLocation.eta}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Service Name */}
                                                <h3 className="font-semibold text-lg mb-1 truncate">
                                                    {booking.serviceName}
                                                </h3>

                                                {/* Provider */}
                                                <div className="flex items-center gap-2 text-sm mb-3">
                                                    <span className="text-muted-foreground">by</span>
                                                    <span className="font-medium">{booking.providerCompany}</span>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span className="text-xs">{booking.providerRating}</span>
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{booking.scheduledDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{booking.scheduledTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{booking.fieldName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{booking.acres} acres</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side */}
                                            <div className="text-right shrink-0">
                                                <div className="text-xl font-bold text-green-400 mb-1">
                                                    ${booking.totalCost.toLocaleString()}
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>

                                        {/* Live Tracking Bar */}
                                        {isActive && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                        <span className="text-green-400 font-medium">Live Tracking Active</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Booking Detail Panel */}
                {selectedBooking && (
                    <div className="fixed right-0 top-0 h-full w-[400px] glass-panel border-l border-white/10 p-6 overflow-y-auto hidden lg:block">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">Booking Details</h2>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className={cn(
                            "rounded-xl p-4 mb-6",
                            BOOKING_STATUS_CONFIG[selectedBooking.status].bgColor
                        )}>
                            <div className="flex items-center gap-3">
                                {selectedBooking.status === 'provider_en_route' ? (
                                    <Truck className={cn("w-6 h-6", BOOKING_STATUS_CONFIG[selectedBooking.status].color)} />
                                ) : selectedBooking.status === 'completed' ? (
                                    <CheckCircle className={cn("w-6 h-6", BOOKING_STATUS_CONFIG[selectedBooking.status].color)} />
                                ) : (
                                    <Clock className={cn("w-6 h-6", BOOKING_STATUS_CONFIG[selectedBooking.status].color)} />
                                )}
                                <div>
                                    <div className={cn("font-semibold", BOOKING_STATUS_CONFIG[selectedBooking.status].color)}>
                                        {BOOKING_STATUS_CONFIG[selectedBooking.status].label}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {BOOKING_STATUS_CONFIG[selectedBooking.status].description}
                                    </div>
                                </div>
                            </div>
                            {selectedBooking.providerLocation && (
                                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-sm">Estimated Arrival</span>
                                    <span className="text-lg font-bold text-green-400">
                                        {selectedBooking.providerLocation.eta}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Service Info */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Service</div>
                                <div className="font-medium">{selectedBooking.serviceName}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</div>
                                    <div className="font-medium">{selectedBooking.scheduledDate}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</div>
                                    <div className="font-medium">{selectedBooking.scheduledTime}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Field</div>
                                    <div className="font-medium">{selectedBooking.fieldName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Area</div>
                                    <div className="font-medium">{selectedBooking.acres} acres</div>
                                </div>
                            </div>
                            {selectedBooking.notes && (
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</div>
                                    <div className="text-sm bg-white/5 rounded-lg p-3">{selectedBooking.notes}</div>
                                </div>
                            )}
                        </div>

                        {/* Provider Info */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Provider</div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">
                                        {selectedBooking.providerName.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{selectedBooking.providerName}</div>
                                    <div className="text-sm text-muted-foreground">{selectedBooking.providerCompany}</div>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-medium">{selectedBooking.providerRating}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => alert('Calling ' + selectedBooking.providerPhone)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call
                                </button>
                                <button
                                    onClick={() => setMessageProvider(selectedBooking)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Message
                                </button>
                            </div>
                            <button
                                onClick={() => setShowProviderProfile(true)}
                                className="w-full mt-2 text-xs text-primary hover:underline text-center"
                            >
                                View Full Profile
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="mb-6">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Timeline</div>
                            <div className="space-y-3">
                                {selectedBooking.timeline.map((event, index) => {
                                    const config = BOOKING_STATUS_CONFIG[event.status];
                                    const isLast = index === selectedBooking.timeline.length - 1;

                                    return (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    isLast ? "bg-primary" : "bg-white/30"
                                                )} />
                                                {index < selectedBooking.timeline.length - 1 && (
                                                    <div className="w-0.5 h-8 bg-white/10" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={cn("text-sm font-medium", isLast && config.color)}>
                                                        {config.label}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(event.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                {event.note && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {event.note}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cost Summary */}
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Total Cost</span>
                                <span className="text-2xl font-bold text-green-400">
                                    ${selectedBooking.totalCost.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                            <div className="space-y-2">
                                {selectedBooking.status === 'pending_confirmation' && (
                                    <button className="w-full py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm font-medium">
                                        Cancel Booking
                                    </button>
                                )}
                                <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                                    Report Issue
                                </button>
                            </div>
                        )}

                        {selectedBooking.status === 'completed' && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setInvoiceBooking(selectedBooking)}
                                    className="w-full py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <DollarSign className="w-4 h-4" />
                                    View Invoice
                                </button>
                                <button
                                    onClick={() => setReviewBooking(selectedBooking)}
                                    className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium"
                                >
                                    Leave Review
                                </button>
                                <Link
                                    href="/services"
                                    className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-center"
                                >
                                    Book Again
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewBooking && (
                <ReviewModal
                    booking={reviewBooking}
                    isOpen={!!reviewBooking}
                    onClose={() => setReviewBooking(null)}
                    onSubmit={(review) => {
                        console.log('Review submitted:', review);
                        // In a real app, this would send to API
                    }}
                />
            )}

            {/* Invoice Modal */}
            {invoiceBooking && (
                <InvoiceModal
                    booking={invoiceBooking}
                    isOpen={!!invoiceBooking}
                    onClose={() => setInvoiceBooking(null)}
                />
            )}

            {/* Provider Message Modal */}
            {messageProvider && (
                <ProviderMessageModal
                    provider={{
                        name: messageProvider.providerName,
                        company: messageProvider.providerCompany,
                        phone: messageProvider.providerPhone,
                        rating: messageProvider.providerRating,
                        responseTime: '< 1 hr',
                        verified: true,
                    }}
                    bookingId={messageProvider.id}
                    isOpen={!!messageProvider}
                    onClose={() => setMessageProvider(null)}
                />
            )}

            {/* Provider Profile Modal */}
            {showProviderProfile && selectedBooking && (
                <ProviderProfileModal
                    provider={{
                        ...MOCK_PROVIDER,
                        name: selectedBooking.providerName,
                        company: selectedBooking.providerCompany,
                        phone: selectedBooking.providerPhone,
                        rating: selectedBooking.providerRating,
                    }}
                    isOpen={showProviderProfile}
                    onClose={() => setShowProviderProfile(false)}
                    onContact={() => {
                        setShowProviderProfile(false);
                        setMessageProvider(selectedBooking);
                    }}
                    onBook={() => {
                        setShowProviderProfile(false);
                        window.location.href = '/services';
                    }}
                />
            )}
        </AppShell>
    );
}
