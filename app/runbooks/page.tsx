'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Clock3,
    PlayCircle,
    RefreshCcw,
    ShieldAlert,
    Target,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useGameStore } from '@/lib/game-store';
import { cn } from '@/lib/utils';
import { getRunbookTemplateForOperation, RUNBOOK_TEMPLATES } from '@/lib/runbooks-data';
import {
    getRunbookProgress,
    getRunbookStatusLabel,
    getRunbookStatusTone,
    useRunbookStore,
} from '@/lib/runbook-store';

function categoryLabel(category: string): string {
    switch (category) {
        case 'crop-protection':
            return 'Crop Protection';
        case 'harvest':
            return 'Harvest';
        case 'safety':
            return 'Safety';
        default:
            return category;
    }
}

function riskTone(riskLevel: string): string {
    switch (riskLevel) {
        case 'high':
            return 'text-red-300 border-red-500/30 bg-red-500/10';
        case 'medium':
            return 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10';
        default:
            return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
    }
}

export default function RunbooksPage() {
    const [templateFromQuery, setTemplateFromQuery] = useState<string | null>(null);

    const { gameMode, weeklyChallenges } = useGameStore();
    const {
        activeRunbookId,
        sessions,
        startRunbook,
        setActiveRunbook,
        goToStep,
        setStepCompleted,
        nextStep,
        previousStep,
        completeRunbook,
        resetRunbook,
    } = useRunbookStore();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        setTemplateFromQuery(params.get('template'));
    }, []);

    useEffect(() => {
        if (!templateFromQuery) return;
        const requested = RUNBOOK_TEMPLATES.find((template) => template.id === templateFromQuery);
        if (!requested) return;
        if (activeRunbookId !== requested.id) {
            startRunbook(requested.id);
        }
    }, [templateFromQuery, activeRunbookId, startRunbook]);

    const recommendedTemplateId = useMemo(() => {
        const openChallenge = weeklyChallenges.find((challenge) => challenge.status === 'open');
        return getRunbookTemplateForOperation(openChallenge?.operationId);
    }, [weeklyChallenges]);

    const activeTemplate = RUNBOOK_TEMPLATES.find((template) => template.id === activeRunbookId) || null;
    const activeSession = activeTemplate ? sessions[activeTemplate.id] : undefined;
    const activeProgress = activeTemplate ? getRunbookProgress(activeTemplate.id, sessions) : { completed: 0, total: 0, percentage: 0 };
    const currentStep = activeTemplate?.steps[activeSession?.currentStepIndex || 0] || null;
    const currentStepCompleted = !!(currentStep && activeSession?.completedStepIds.includes(currentStep.id));

    const completedCount = Object.values(sessions).filter((session) => session.status === 'completed').length;
    const inProgressCount = Object.values(sessions).filter((session) => session.status === 'in_progress').length;

    return (
        <AppShell>
            <div className="h-full overflow-y-auto p-6 space-y-6">
                <section className="card-soft rounded-2xl p-5 border border-primary/20 bg-gradient-to-br from-primary/15 via-secondary/10 to-card/40">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Guided Operation Runbooks</h1>
                            <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                                Runbook mode guides critical workflows step-by-step so teams can execute safely, consistently, and with full traceability.
                            </p>
                            {!gameMode && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-200">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    Strategy mode is off. You can still review and rehearse runbooks.
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 min-w-[280px]">
                            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Total</p>
                                <p className="text-xl font-semibold mt-1">{RUNBOOK_TEMPLATES.length}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">In Progress</p>
                                <p className="text-xl font-semibold mt-1 text-blue-300">{inProgressCount}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Completed</p>
                                <p className="text-xl font-semibold mt-1 text-green-300">{completedCount}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-[minmax(380px,1fr)_minmax(0,1.5fr)] gap-6 items-start">
                    <div className="space-y-4">
                        {RUNBOOK_TEMPLATES.map((template, index) => {
                            const session = sessions[template.id];
                            const progress = getRunbookProgress(template.id, sessions);
                            const isActive = template.id === activeRunbookId;
                            const primaryGuideTarget = !activeRunbookId && (recommendedTemplateId === template.id || index === 0);

                            return (
                                <article
                                    key={template.id}
                                    className={cn(
                                        'rounded-2xl border p-4 transition-all',
                                        isActive ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-white/5'
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={cn('rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]', riskTone(template.riskLevel))}>
                                                    {template.riskLevel} risk
                                                </span>
                                                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                    {categoryLabel(template.category)}
                                                </span>
                                                {recommendedTemplateId === template.id && (
                                                    <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-blue-200">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-lg font-semibold">{template.title}</h2>
                                            <p className="text-sm text-muted-foreground mt-1">{template.summary}</p>
                                        </div>
                                        <span className={cn('text-xs rounded-full border px-2 py-1 whitespace-nowrap', getRunbookStatusTone(session))}>
                                            {getRunbookStatusLabel(session)}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 className="h-3.5 w-3.5" /> {template.estimatedMinutes} min
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <ClipboardList className="h-3.5 w-3.5" /> {template.steps.length} steps
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-primary transition-all" style={{ width: `${progress.percentage}%` }} />
                                        </div>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            {progress.completed}/{progress.total} steps complete ({progress.percentage}%)
                                        </p>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">{template.whenToUse}</p>

                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => startRunbook(template.id)}
                                            data-guide-id={primaryGuideTarget ? 'runbook-start-primary' : undefined}
                                            className="px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5"
                                        >
                                            <PlayCircle className="h-3.5 w-3.5" />
                                            {session?.status === 'completed' ? 'Review Runbook' : session ? 'Continue Runbook' : 'Start Runbook'}
                                        </button>
                                        {session && !isActive && (
                                            <button
                                                onClick={() => resetRunbook(template.id)}
                                                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs"
                                            >
                                                Reset
                                            </button>
                                        )}
                                        {isActive && (
                                            <button
                                                onClick={() => setActiveRunbook(null)}
                                                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                Collapse
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sticky top-4">
                        {!activeTemplate || !activeSession ? (
                            <div className="min-h-[420px] flex flex-col items-center justify-center text-center gap-3">
                                <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                                <h3 className="text-xl font-semibold">No active runbook</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Start one of the runbooks to get guided step-by-step execution with progress tracking.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
                                >
                                    Return to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-semibold">{activeTemplate.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{activeTemplate.summary}</p>
                                    </div>
                                    <span className={cn('rounded-full border px-2 py-1 text-xs', getRunbookStatusTone(activeSession))}>
                                        {getRunbookStatusLabel(activeSession)}
                                    </span>
                                </div>

                                <div>
                                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div className="h-full bg-secondary transition-all" style={{ width: `${activeProgress.percentage}%` }} />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {activeProgress.completed}/{activeProgress.total} steps complete
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.2fr)] gap-4">
                                    <div className="space-y-2">
                                        {activeTemplate.steps.map((step, index) => {
                                            const isSelected = index === activeSession.currentStepIndex;
                                            const done = activeSession.completedStepIds.includes(step.id);
                                            return (
                                                <button
                                                    key={step.id}
                                                    onClick={() => goToStep(activeTemplate.id, index)}
                                                    className={cn(
                                                        'w-full text-left rounded-xl border px-3 py-2 transition-colors',
                                                        isSelected ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-black/20 hover:bg-white/5'
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="text-sm font-medium truncate">{index + 1}. {step.title}</div>
                                                        {done ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-300 shrink-0" />
                                                        ) : (
                                                            <Target className="h-4 w-4 text-blue-300 shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {currentStep && (
                                        <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-4">
                                            <div>
                                                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Current Step</div>
                                                <h4 className="text-lg font-semibold mt-1">{currentStep.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{currentStep.objective}</p>
                                            </div>

                                            <div>
                                                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Instructions</div>
                                                <ul className="space-y-1 text-sm text-foreground/90">
                                                    {currentStep.instructions.map((instruction) => (
                                                        <li key={instruction} className="flex items-start gap-2">
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                                                            <span>{instruction}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Verification</div>
                                                <ul className="space-y-1 text-sm text-foreground/90">
                                                    {currentStep.verificationChecklist.map((item) => (
                                                        <li key={item} className="flex items-start gap-2">
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                                                <button
                                                    onClick={() => setStepCompleted(activeTemplate.id, currentStep.id, !currentStepCompleted)}
                                                    data-guide-id="runbook-step-toggle"
                                                    className={cn(
                                                        'px-3 py-2 rounded-lg text-xs font-semibold',
                                                        currentStepCompleted
                                                            ? 'bg-white/10 hover:bg-white/15'
                                                            : 'bg-primary hover:bg-primary text-white'
                                                    )}
                                                >
                                                    {currentStepCompleted ? 'Mark Incomplete' : 'Mark Step Complete'}
                                                </button>

                                                {currentStep.ctaLabel && currentStep.ctaHref && (
                                                    <Link
                                                        href={currentStep.ctaHref}
                                                        className="px-3 py-2 rounded-lg text-xs border border-white/10 hover:bg-white/10"
                                                    >
                                                        {currentStep.ctaLabel}
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => previousStep(activeTemplate.id)}
                                                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs"
                                                >
                                                    Previous
                                                </button>

                                                {activeSession.currentStepIndex < activeTemplate.steps.length - 1 ? (
                                                    <button
                                                        onClick={() => nextStep(activeTemplate.id)}
                                                        data-guide-id="runbook-step-next"
                                                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                                                    >
                                                        Next Step
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => completeRunbook(activeTemplate.id)}
                                                        data-guide-id="runbook-step-next"
                                                        className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold"
                                                    >
                                                        Complete Runbook
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => resetRunbook(activeTemplate.id)}
                                                    data-guide-id="runbook-reset-active"
                                                    className="ml-auto px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 text-xs inline-flex items-center gap-1.5"
                                                >
                                                    <RefreshCcw className="h-3.5 w-3.5" />
                                                    Reset Runbook
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
