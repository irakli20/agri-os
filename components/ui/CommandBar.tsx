'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { Command, CornerDownLeft, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AI } from '@/app/actions';

/**
 * CommandBar Component
 * 
 * The primary interface for "Chat-to-UI".
 * Allows the user to type natural language commands to control the map
 * and generate UI components.
 */
export function CommandBar() {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { submitUserMessage } = useActions<typeof AI>();
    const [messages, setMessages] = useUIState<typeof AI>();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Optimistically add user message
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                role: 'user' as const,
                display: <div className="text-right mb-2 text-sm text-muted-foreground">{inputValue}</div>,
            },
        ]);

        const value = inputValue;
        setInputValue('');
        setIsLoading(true);

        try {
            // Submit to AI and get response
            const responseMessage = await submitUserMessage(value);
            setMessages((currentMessages) => [...currentMessages, responseMessage]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="command-bar flex flex-col items-center">
            {/* Input Bar */}
            <div className="w-full max-w-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <form
                    onSubmit={handleSubmit}
                    className="relative bg-card/95 backdrop-blur-md border rounded-lg shadow-2xl flex items-center p-1 overflow-hidden ring-1 ring-white/10"
                >
                    <div className="pl-3 pr-2 text-muted-foreground">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                            <Sparkles className="w-5 h-5 text-primary" />
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask Agri-OS... (e.g., 'Show NDVI for Field B')"
                        className="flex-1 bg-transparent border-none outline-none h-10 px-2 text-sm placeholder:text-muted-foreground/50"
                        disabled={isLoading}
                    />

                    <div className="flex items-center gap-2 pr-2">
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <CornerDownLeft className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* AI Responses (Generative UI Container) */}
            <div className="w-full max-w-2xl mt-4 space-y-4 pointer-events-none">
                {messages.map((message: any) => (
                    <div key={message.id} className="pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
                        {message.display}
                    </div>
                ))}
            </div>
        </div>
    );
}
