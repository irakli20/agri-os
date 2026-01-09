'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ComparisonSliderProps {
    leftImage: string;
    leftLabel: string;
    rightImage: string;
    rightLabel: string;
    className?: string;
}

export function ComparisonSlider({
    leftImage,
    leftLabel,
    rightImage,
    rightLabel,
    className,
}: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
    };

    const handleMouseDown = () => setIsDragging(true);

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden select-none", className)}
        >
            {/* Right Image (Background) */}
            <div className="absolute inset-0">
                <img
                    src={rightImage}
                    alt={rightLabel}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-medium text-white">
                    {rightLabel}
                </div>
            </div>

            {/* Left Image (Clipped) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={leftImage}
                    alt={leftLabel}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-medium text-white">
                    {leftLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
                    <div className="flex gap-1">
                        <div className="w-0.5 h-6 bg-gray-600 rounded"></div>
                        <div className="w-0.5 h-6 bg-gray-600 rounded"></div>
                    </div>
                </div>

                {/* Arrows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 pointer-events-none">
                    <svg className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full" width="12" height="12" viewBox="0 0 12 12" fill="white">
                        <path d="M8 6L2 2v8l6-4z" />
                    </svg>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full" width="12" height="12" viewBox="0 0 12 12" fill="white">
                        <path d="M4 6l6-4v8l-6-4z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
