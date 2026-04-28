'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StrategyActionVariant = 'primary' | 'secondary' | 'neutral' | 'danger' | 'warning';

const ACTION_VARIANTS: Record<StrategyActionVariant, string> = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20',
    secondary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20',
    neutral: 'bg-white/10 hover:bg-white/15 text-foreground border border-white/10',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500/90 hover:bg-amber-500 text-black',
};

export function strategyActionClass(variant: StrategyActionVariant = 'primary', className?: string) {
    return cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        ACTION_VARIANTS[variant],
        className
    );
}

type StrategyActionButtonProps = ComponentPropsWithoutRef<'button'> & {
    variant?: StrategyActionVariant;
};

export function StrategyActionButton({
    variant = 'primary',
    className,
    type = 'button',
    ...props
}: StrategyActionButtonProps) {
    return (
        <button
            type={type}
            className={strategyActionClass(variant, className)}
            {...props}
        />
    );
}

type StrategyActionLinkProps = ComponentPropsWithoutRef<typeof Link> & {
    variant?: StrategyActionVariant;
    children: ReactNode;
};

export function StrategyActionLink({
    variant = 'primary',
    className,
    ...props
}: StrategyActionLinkProps) {
    return <Link className={strategyActionClass(variant, className)} {...props} />;
}

export function strategyNoticeClass(type: 'success' | 'error' | 'info' = 'info', className?: string) {
    return cn(
        'rounded-lg border p-3 text-sm',
        type === 'success' && 'border-primary/40 bg-primary/10 text-primary',
        type === 'error' && 'border-red-400/40 bg-red-500/10 text-red-100',
        type === 'info' && 'border-white/10 bg-white/5 text-muted-foreground',
        className
    );
}
