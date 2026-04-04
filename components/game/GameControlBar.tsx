import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/game-store';
import { AlertTriangle, Calendar, DollarSign, ListChecks, PlusCircle } from 'lucide-react';
import { useFieldStore } from '@/lib/field-store';

export const GameControlBar = () => {
    const {
        gameTime,
        getCurrentPlayer,
        weeklyChallenges,
        refreshWeeklyChallenges,
        addFunds,
    } = useGameStore();
    const { gameFields } = useFieldStore();
    const player = getCurrentPlayer();
    const [fundsPulse, setFundsPulse] = useState(false);

    useEffect(() => {
        if (gameFields.length > 0 && weeklyChallenges.length === 0) {
            refreshWeeklyChallenges();
        }
    }, [gameFields.length, weeklyChallenges.length, refreshWeeklyChallenges]);

    if (!player) return null;

    const openCount = weeklyChallenges.filter((challenge) => challenge.status === 'open').length;

    const handleAddFunds = () => {
        addFunds(100_000);
        setFundsPulse(true);
        setTimeout(() => setFundsPulse(false), 800);
    };

    return (
        <div className="bg-black/60 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-50 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
                {/* Balance */}
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Funds</span>
                    <div className={`text-xl font-bold font-mono flex items-center transition-colors duration-300 ${fundsPulse ? 'text-primary' : 'text-green-400'}`}>
                        <DollarSign className="w-5 h-5" />
                        {player.balance.toLocaleString()}
                    </div>
                </div>

                {/* Add Funds button */}
                <button
                    onClick={handleAddFunds}
                    title="Add $100,000 to your balance"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/30 hover:border-primary/50 text-primary text-xs font-semibold transition-all duration-150 active:scale-95"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    +$100k
                </button>

                {/* Time */}
                <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Date</span>
                    <div className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <span>Year {gameTime.year}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-blue-300">{gameTime.season}</span>
                        <span className="text-muted-foreground">Week {gameTime.week}</span>
                    </div>
                </div>
            </div>

            {/* Situational status (actions are centralized in the AppShell header) */}
            <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-muted-foreground">
                    <ListChecks className="w-3.5 h-3.5 text-blue-300" />
                    Priorities: <strong className="text-foreground">{openCount}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-muted-foreground">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
                    Use header controls to execute plan and advance week
                </span>
            </div>
        </div>
    );
};
