'use client';

import React from 'react';
import { useGameStore } from '@/lib/game-store';
import { cn } from '@/lib/utils';
import { Leaf, Box } from 'lucide-react';

export function CornFocusToggle() {
    const { cornFocusMode, toggleCornFocusMode } = useGameStore();

    return (
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
                onClick={() => !cornFocusMode && toggleCornFocusMode()}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    cornFocusMode
                        ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <Leaf className={cn("w-3.5 h-3.5", cornFocusMode ? "fill-black" : "")} />
                CORN EXPERT
            </button>
            <button
                onClick={() => cornFocusMode && toggleCornFocusMode()}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    !cornFocusMode
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <Box className="w-3.5 h-3.5" />
                MULTI-CROP
            </button>
        </div>
    );
}
