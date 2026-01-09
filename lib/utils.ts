import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ShadCN UI utility for merging Tailwind classes
 * This is the core `cn` utility used throughout the component registry
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
