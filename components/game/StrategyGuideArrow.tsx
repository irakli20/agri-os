'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/lib/game-store';

export function StrategyGuideArrow() {
    const { gameMode, guideTargetId, guideMessage } = useGameStore();
    const [targetRect, setTargetRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

    useEffect(() => {
        if (!guideTargetId) {
            setTargetRect(null);
            return;
        }

        const update = () => {
            const el = document.querySelector(`[data-guide-id="${guideTargetId}"]`) as HTMLElement | null;
            if (!el) {
                setTargetRect(null);
                return;
            }

            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (rect.width < 4 || rect.height < 4 || style.display === 'none' || style.visibility === 'hidden') {
                setTargetRect(null);
                return;
            }
            setTargetRect({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            });
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        const interval = window.setInterval(update, 600);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
            window.clearInterval(interval);
        };
    }, [guideTargetId]);

    const hidden = useMemo(() => !gameMode || !guideTargetId || !targetRect, [gameMode, guideTargetId, targetRect]);
    if (hidden) return null;

    const safeGap = 16;
    const calloutWidth = 240;
    const calloutHeight = 68;
    const outlinePadding = 6;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 720;
    const rightSpace = viewportWidth - (targetRect!.left + targetRect!.width);
    const leftSpace = targetRect!.left;
    const hasRoomRight = rightSpace > (calloutWidth + safeGap);
    const hasRoomLeft = leftSpace > (calloutWidth + safeGap);
    const hasRoomTop = targetRect!.top > (calloutHeight + safeGap);

    const placement: 'right' | 'left' | 'top' = hasRoomRight ? 'right' : hasRoomLeft ? 'left' : (hasRoomTop ? 'top' : 'right');

    const unclampedCalloutLeft = placement === 'right'
        ? targetRect!.left + targetRect!.width + safeGap
        : placement === 'left'
            ? targetRect!.left - calloutWidth - safeGap
            : targetRect!.left + targetRect!.width / 2 - calloutWidth / 2;

    const unclampedCalloutTop = placement === 'top'
        ? targetRect!.top - calloutHeight - safeGap
        : targetRect!.top + targetRect!.height / 2 - calloutHeight / 2;

    const calloutLeft = Math.min(Math.max(8, unclampedCalloutLeft), viewportWidth - calloutWidth - 8);
    const calloutTop = Math.min(Math.max(8, unclampedCalloutTop), viewportHeight - calloutHeight - 8);

    return (
        <div className="fixed inset-0 pointer-events-none z-[120]">
            <div
                className="absolute rounded-xl border-2 border-primary/85 shadow-[0_0_0_2px_rgba(52,211,153,0.25),0_0_22px_rgba(52,211,153,0.35)] animate-pulse"
                style={{
                    left: `${targetRect!.left - outlinePadding}px`,
                    top: `${targetRect!.top - outlinePadding}px`,
                    width: `${targetRect!.width + outlinePadding * 2}px`,
                    height: `${targetRect!.height + outlinePadding * 2}px`,
                }}
            />
        </div>
    );
}
