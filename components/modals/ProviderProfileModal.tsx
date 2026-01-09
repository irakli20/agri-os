'use client';

import { useState } from 'react';
import {
    X,
    Star,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    Calendar,
    Clock,
    Award,
    Shield,
    MessageCircle,
    ChevronRight,
    ThumbsUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderReview {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
}

interface ProviderDetails {
    id: string;
    name: string;
    company: string;
    avatar?: string;
    phone: string;
    email: string;
    website?: string;
    location: string;
    rating: number;
    totalReviews: number;
    completedJobs: number;
    yearsExperience: number;
    responseTime: string;
    verified: boolean;
    certifications: string[];
    specialties: string[];
    about: string;
    reviews: ProviderReview[];
}

interface ProviderProfileModalProps {
    provider: ProviderDetails;
    isOpen: boolean;
    onClose: () => void;
    onContact?: () => void;
    onBook?: () => void;
}

export function ProviderProfileModal({ provider, isOpen, onClose, onContact, onBook }: ProviderProfileModalProps) {
    const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header with Cover */}
                <div className="relative h-32 bg-gradient-to-r from-primary/30 to-accent/30">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-4 -mt-12">
                    <div className="flex items-end gap-4 mb-4">
                        <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center border-4 border-background">
                            <span className="text-3xl font-bold text-primary">
                                {provider.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold">{provider.name}</h2>
                                {provider.verified && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-xs text-blue-400 font-medium">Verified</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-muted-foreground">{provider.company}</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{provider.rating}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{provider.totalReviews} reviews</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="font-bold text-green-400 mb-1">{provider.completedJobs}</div>
                            <div className="text-xs text-muted-foreground">Jobs Done</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="font-bold mb-1">{provider.yearsExperience}+</div>
                            <div className="text-xs text-muted-foreground">Years Exp</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="font-bold text-blue-400 mb-1">{provider.responseTime}</div>
                            <div className="text-xs text-muted-foreground">Response</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={onContact}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Message</span>
                        </button>
                        <button
                            onClick={onBook}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Book Service</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('about')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                                activeTab === 'about'
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                                activeTab === 'reviews'
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Reviews ({provider.totalReviews})
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="px-6 pb-6 max-h-[40vh] overflow-y-auto">
                    {activeTab === 'about' && (
                        <div className="space-y-6 pt-4">
                            {/* Contact Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact</h3>
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{provider.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{provider.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{provider.email}</span>
                                    </div>
                                    {provider.website && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Globe className="w-4 h-4 text-muted-foreground" />
                                            <a href={provider.website} className="text-primary hover:underline">
                                                {provider.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* About */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {provider.about}
                                </p>
                            </div>

                            {/* Specialties */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {provider.specialties.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Certifications</h3>
                                <div className="space-y-2">
                                    {provider.certifications.map((cert) => (
                                        <div
                                            key={cert}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <Shield className="w-4 h-4 text-green-400" />
                                            <span>{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4 pt-4">
                            {/* Rating Summary */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-yellow-400">{provider.rating}</div>
                                    <div className="flex items-center gap-0.5 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "w-4 h-4",
                                                    star <= Math.round(provider.rating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-white/20"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {provider.totalReviews} reviews
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = provider.reviews.filter(r => Math.round(r.rating) === stars).length;
                                        const percentage = (count / provider.reviews.length) * 100 || 0;
                                        return (
                                            <div key={stars} className="flex items-center gap-2 text-xs">
                                                <span className="w-3">{stars}</span>
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-muted-foreground w-8">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {provider.reviews.map((review) => (
                                    <div key={review.id} className="p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-medium">{review.author}</div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-3 h-3",
                                                                    star <= review.rating
                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                        : "text-white/20"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {review.comment}
                                        </p>
                                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>Helpful ({review.helpful})</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mock provider data for demo
export const MOCK_PROVIDER: ProviderDetails = {
    id: 'prov-1',
    name: 'Mike Rodriguez',
    company: 'AgriSpray Pro',
    phone: '(555) 123-4567',
    email: 'mike@agrispraypro.com',
    website: 'www.agrispraypro.com',
    location: 'Central Valley, CA',
    rating: 4.9,
    totalReviews: 127,
    completedJobs: 342,
    yearsExperience: 12,
    responseTime: '< 1 hr',
    verified: true,
    certifications: [
        'FAA Part 107 Licensed',
        'EPA Pesticide Applicator',
        'Organic Farming Certified',
        'OSHA Safety Certified'
    ],
    specialties: [
        'Aerial Spraying',
        'Crop Dusting',
        'Precision Agriculture',
        'Drone Operations',
        'Ground Application'
    ],
    about: 'With over 12 years of experience in agricultural aviation and precision farming, AgriSpray Pro delivers exceptional crop spraying services using state-of-the-art drone technology. We specialize in both aerial and ground application methods, ensuring optimal coverage and minimal environmental impact.',
    reviews: [
        {
            id: 'rev-1',
            author: 'John Smith',
            rating: 5,
            date: 'Nov 28, 2024',
            comment: 'Excellent service! Mike was professional, on time, and the drone coverage was incredibly precise. Will definitely use again.',
            helpful: 12,
        },
        {
            id: 'rev-2',
            author: 'Sarah Johnson',
            rating: 5,
            date: 'Nov 20, 2024',
            comment: 'Very knowledgeable about organic treatments. Great communication throughout the process.',
            helpful: 8,
        },
        {
            id: 'rev-3',
            author: 'David Chen',
            rating: 4,
            date: 'Nov 15, 2024',
            comment: 'Good work overall. Scheduling was easy and the results were as expected.',
            helpful: 5,
        },
    ],
};
