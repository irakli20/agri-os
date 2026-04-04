import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RUNBOOK_TEMPLATES, findRunbookTemplateById } from '@/lib/runbooks-data';

export type RunbookSessionStatus = 'not_started' | 'in_progress' | 'completed';

export interface RunbookSession {
    runbookId: string;
    status: RunbookSessionStatus;
    currentStepIndex: number;
    completedStepIds: string[];
    startedAt: string;
    completedAt: string | null;
    updatedAt: string;
}

interface RunbookStore {
    activeRunbookId: string | null;
    sessions: Record<string, RunbookSession>;

    startRunbook: (runbookId: string) => { success: boolean; error?: string };
    setActiveRunbook: (runbookId: string | null) => void;
    goToStep: (runbookId: string, stepIndex: number) => void;
    setStepCompleted: (runbookId: string, stepId: string, completed: boolean) => void;
    nextStep: (runbookId: string) => void;
    previousStep: (runbookId: string) => void;
    completeRunbook: (runbookId: string) => void;
    resetRunbook: (runbookId: string) => void;
}

function nowIso(): string {
    return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

function createInitialSession(runbookId: string): RunbookSession {
    const now = nowIso();
    return {
        runbookId,
        status: 'in_progress',
        currentStepIndex: 0,
        completedStepIds: [],
        startedAt: now,
        completedAt: null,
        updatedAt: now,
    };
}

function createResetSession(runbookId: string): RunbookSession {
    const now = nowIso();
    return {
        runbookId,
        status: 'not_started',
        currentStepIndex: 0,
        completedStepIds: [],
        startedAt: now,
        completedAt: null,
        updatedAt: now,
    };
}

export const useRunbookStore = create<RunbookStore>()(
    persist(
        (set, get) => ({
            activeRunbookId: null,
            sessions: {},

            startRunbook: (runbookId) => {
                const template = findRunbookTemplateById(runbookId);
                if (!template) {
                    return { success: false, error: `Unknown runbook: ${runbookId}` };
                }

                const existing = get().sessions[runbookId];
                if (!existing) {
                    const session = createInitialSession(runbookId);
                    set((state) => ({
                        activeRunbookId: runbookId,
                        sessions: {
                            ...state.sessions,
                            [runbookId]: session,
                        },
                    }));
                    return { success: true };
                }

                set((state) => ({
                    activeRunbookId: runbookId,
                    sessions: {
                        ...state.sessions,
                        [runbookId]: {
                            ...existing,
                            status: existing.status === 'completed' ? 'completed' : 'in_progress',
                            updatedAt: nowIso(),
                        },
                    },
                }));

                return { success: true };
            },

            setActiveRunbook: (runbookId) => set({ activeRunbookId: runbookId }),

            goToStep: (runbookId, stepIndex) => {
                const template = findRunbookTemplateById(runbookId);
                if (!template) return;
                const existing = get().sessions[runbookId] || createInitialSession(runbookId);
                const nextIndex = clamp(stepIndex, 0, Math.max(0, template.steps.length - 1));
                set((state) => ({
                    activeRunbookId: runbookId,
                    sessions: {
                        ...state.sessions,
                        [runbookId]: {
                            ...existing,
                            currentStepIndex: nextIndex,
                            status: existing.status === 'not_started' ? 'in_progress' : existing.status,
                            updatedAt: nowIso(),
                        },
                    },
                }));
            },

            setStepCompleted: (runbookId, stepId, completed) => {
                const template = findRunbookTemplateById(runbookId);
                if (!template) return;

                const existing = get().sessions[runbookId] || createInitialSession(runbookId);
                const completedSet = new Set(existing.completedStepIds);

                if (completed) {
                    completedSet.add(stepId);
                } else {
                    completedSet.delete(stepId);
                }

                const completedStepIds = template.steps
                    .map((step) => step.id)
                    .filter((id) => completedSet.has(id));
                const firstIncompleteIndex = template.steps.findIndex((step) => !completedSet.has(step.id));
                const allStepsCompleted = firstIncompleteIndex === -1;

                const nextIndex = allStepsCompleted
                    ? Math.max(0, template.steps.length - 1)
                    : firstIncompleteIndex;

                set((state) => ({
                    activeRunbookId: runbookId,
                    sessions: {
                        ...state.sessions,
                        [runbookId]: {
                            ...existing,
                            status: allStepsCompleted ? 'completed' : 'in_progress',
                            currentStepIndex: nextIndex,
                            completedStepIds,
                            completedAt: allStepsCompleted ? nowIso() : null,
                            updatedAt: nowIso(),
                        },
                    },
                }));
            },

            nextStep: (runbookId) => {
                const template = findRunbookTemplateById(runbookId);
                if (!template) return;
                const existing = get().sessions[runbookId] || createInitialSession(runbookId);
                const nextIndex = clamp(existing.currentStepIndex + 1, 0, Math.max(0, template.steps.length - 1));
                get().goToStep(runbookId, nextIndex);
            },

            previousStep: (runbookId) => {
                const existing = get().sessions[runbookId] || createInitialSession(runbookId);
                const previousIndex = clamp(existing.currentStepIndex - 1, 0, existing.currentStepIndex);
                get().goToStep(runbookId, previousIndex);
            },

            completeRunbook: (runbookId) => {
                const template = findRunbookTemplateById(runbookId);
                if (!template) return;
                const existing = get().sessions[runbookId] || createInitialSession(runbookId);
                const completedAt = nowIso();
                set((state) => ({
                    activeRunbookId: runbookId,
                    sessions: {
                        ...state.sessions,
                        [runbookId]: {
                            ...existing,
                            status: 'completed',
                            currentStepIndex: Math.max(0, template.steps.length - 1),
                            completedStepIds: template.steps.map((step) => step.id),
                            completedAt,
                            updatedAt: completedAt,
                        },
                    },
                }));
            },

            resetRunbook: (runbookId) => {
                if (!findRunbookTemplateById(runbookId)) return;
                set((state) => ({
                    activeRunbookId: runbookId,
                    sessions: {
                        ...state.sessions,
                        [runbookId]: createResetSession(runbookId),
                    },
                }));
            },
        }),
        {
            name: 'agri-os-runbook-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                activeRunbookId: state.activeRunbookId,
                sessions: state.sessions,
            }),
        }
    )
);

export function getRunbookProgress(runbookId: string, sessions: Record<string, RunbookSession>): {
    completed: number;
    total: number;
    percentage: number;
} {
    const template = findRunbookTemplateById(runbookId);
    if (!template) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    const session = sessions[runbookId];
    const total = template.steps.length;
    const completed = session?.completedStepIds.length || 0;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { completed, total, percentage };
}

export function getRunbookStatusLabel(session?: RunbookSession): string {
    if (!session) return 'Not started';
    if (session.status === 'completed') return 'Completed';
    if (session.status === 'in_progress') return 'In progress';
    return 'Not started';
}

export function getRunbookStatusTone(session?: RunbookSession): string {
    if (!session) return 'text-slate-300 border-slate-500/30 bg-slate-500/10';
    if (session.status === 'completed') return 'text-green-300 border-green-500/30 bg-green-500/10';
    if (session.status === 'in_progress') return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
    return 'text-slate-300 border-slate-500/30 bg-slate-500/10';
}

export const RUNBOOK_COUNT = RUNBOOK_TEMPLATES.length;
