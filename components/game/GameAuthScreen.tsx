'use client';

import React, { useState } from 'react';
import { useGameStore, STARTING_BALANCE } from '@/lib/game-store';
import { Sprout, Mail, Lock, User, ArrowRight, Gamepad2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GameAuthScreen() {
    const [tab, setTab] = useState<'login' | 'signup'>('signup');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup, login, rentField, players, currentPlayerId } = useGameStore();

    // Auto-login bypass
    React.useEffect(() => {
        const autoLogin = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Visual buffer

            // Try to signup guest if doesn't exist
            signup('Guest Farmer', 'guest@agrios.dev', 'guest123');
            // Login
            login('guest@agrios.dev', 'guest123');

            // Give starter field if none owned/rented
            const currentPlayer = players.find(p => p.email === 'guest@agrios.dev');
            if (currentPlayer && currentPlayer.ownedFieldIds.length === 0 && currentPlayer.rentedFieldIds.length === 0) {
                // Rent San Joaquin Farm (mkt-6) as it's corn suitable
                rentField('mkt-6', 4500);
            }

            setIsLoading(false);
        };
        autoLogin();
    }, [signup, login, rentField, players]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate brief loading for UX
        await new Promise(r => setTimeout(r, 500));

        const isDevBypass = tab === 'login' && email.trim().toLowerCase() === 'irakli' && password === '111';

        if (isDevBypass) {
            const signupResult = signup('irakli', 'irakli@local.dev', '111');
            if (!signupResult.success && signupResult.error !== 'An account with this email already exists.') {
                setError(signupResult.error || 'Bypass signup failed.');
                setIsLoading(false);
                return;
            }

            const loginResult = login('irakli@local.dev', '111');
            if (!loginResult.success) {
                setError(loginResult.error || 'Bypass login failed.');
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            return;
        }

        if (tab === 'signup') {
            if (!username.trim()) { setError('Username is required.'); setIsLoading(false); return; }
            if (!email.trim()) { setError('Email is required.'); setIsLoading(false); return; }
            if (password.length < 4) { setError('Password must be at least 4 characters.'); setIsLoading(false); return; }
            if (password !== confirmPassword) { setError('Passwords do not match.'); setIsLoading(false); return; }

            const result = signup(username.trim(), email.trim(), password);
            if (!result.success) { setError(result.error || 'Signup failed.'); setIsLoading(false); return; }
        } else {
            if (!email.trim()) { setError('Email is required.'); setIsLoading(false); return; }
            if (!password) { setError('Password is required.'); setIsLoading(false); return; }

            const result = login(email.trim(), password);
            if (!result.success) { setError(result.error || 'Login failed.'); setIsLoading(false); return; }
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#05080f] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#3b82f6' : '#f59e0b',
                            animation: `float-particle ${8 + Math.random() * 12}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Radial gradient */}
                <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent" style={{
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.08) 0%, transparent 60%)',
                }} />
            </div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-primary/20 border border-green-500/20 mb-4 shadow-lg shadow-green-500/10">
                        <Gamepad2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Agri-OS <span className="text-green-400">Strategy</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Build your farming empire. Choose your land. Grow your legacy.
                    </p>
                </div>

                {/* Card */}
                <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-white/10">
                    {/* Tabs */}
                    <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                        <button
                            onClick={() => { setTab('signup'); setError(''); }}
                            className={cn(
                                'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                                tab === 'signup'
                                    ? 'bg-green-500/20 text-green-400 shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => { setTab('login'); setError(''); }}
                            className={cn(
                                'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                                tab === 'login'
                                    ? 'bg-green-500/20 text-green-400 shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            Log In
                        </button>
                    </div>

                    {/* Starting Capital Banner (signup only) */}
                    {tab === 'signup' && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                                <DollarSign className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-yellow-400">
                                    Starting Capital: ${STARTING_BALANCE.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Use it wisely to rent or buy your first fields
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === 'signup' && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Email or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                            />
                        </div>

                        {tab === 'signup' && (
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                                />
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200',
                                isLoading
                                    ? 'bg-green-500/30 text-green-300 cursor-wait'
                                    : 'bg-gradient-to-r from-green-500 to-primary text-white hover:from-green-400 hover:to-primary shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                            )}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {tab === 'signup' ? 'Create Account & Start Playing' : 'Log In'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Agri-OS Strategy Mode • Client-side demo
                </p>
            </div>

            {/* CSS animation for floating particles */}
            <style jsx>{`
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
                    25% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
                    50% { transform: translateY(-40px) translateX(-5px); opacity: 0.2; }
                    75% { transform: translateY(-20px) translateX(15px); opacity: 0.35; }
                }
            `}</style>
        </div>
    );
}
