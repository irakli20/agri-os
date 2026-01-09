'use client';

import { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle, ThumbsUp, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ServiceBooking } from '@/lib/bookings-data';

interface ReviewModalProps {
    booking: ServiceBooking;
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (review: ReviewData) => void;
}

export interface ReviewData {
    bookingId: string;
    rating: number;
    title: string;
    comment: string;
    wouldRecommend: boolean;
    photos: string[];
    tags: string[];
}

const QUICK_TAGS = [
    'Professional',
    'On Time',
    'Great Communication',
    'Quality Work',
    'Fair Price',
    'Fast Service',
    'Friendly',
    'Knowledgeable',
];

export function ReviewModal({ booking, isOpen, onClose, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const reviewData: ReviewData = {
            bookingId: booking.id,
            rating,
            title,
            comment,
            wouldRecommend,
            photos: [],
            tags: selectedTags,
        };

        onSubmit?.(reviewData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const getRatingLabel = (stars: number) => {
        switch (stars) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isSuccess ? 'Thank You!' : 'Leave a Review'}
                        </h2>
                        {!isSuccess && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Share your experience with {booking.providerCompany}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Review Submitted!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your feedback helps other farmers find great service providers.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Service Summary */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-sm text-muted-foreground mb-1">Service</div>
                                <div className="font-medium">{booking.serviceName}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {booking.scheduledDate} • {booking.fieldName}
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-3">
                                    How would you rate this service?
                                </div>
                                <div className="flex justify-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-10 h-10 transition-colors",
                                                    (hoverRating || rating) >= star
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-white/20"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="text-sm font-medium text-yellow-400">
                                    {getRatingLabel(hoverRating || rating)}
                                </div>
                            </div>

                            {/* Quick Tags */}
                            <div>
                                <div className="text-sm font-medium mb-3">What stood out?</div>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                                selectedTags.includes(tag)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Review Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Summarize your experience"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Tell others about your experience..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-dashed border-white/20">
                                    <Camera className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Add Photos (Optional)</span>
                                </button>
                            </div>

                            {/* Would Recommend */}
                            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <ThumbsUp className={cn(
                                        "w-5 h-5",
                                        wouldRecommend ? "text-green-400" : "text-muted-foreground"
                                    )} />
                                    <span className="text-sm">Would you recommend this provider?</span>
                                </div>
                                <button
                                    onClick={() => setWouldRecommend(!wouldRecommend)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        wouldRecommend ? "bg-green-500" : "bg-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                                        wouldRecommend ? "left-6" : "left-0.5"
                                    )} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !rating}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
