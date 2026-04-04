'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/lib/game-store';
import { useFieldStore } from '@/lib/field-store';
import { useRunbookStore } from '@/lib/runbook-store';
import { findRunbookTemplateById } from '@/lib/runbooks-data';

const PRIORITY_ORDER: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
};

function mapServiceOperationToServiceId(operationId?: string | null): string | null {
    if (!operationId) return null;
    if (operationId.startsWith('serv-')) return operationId;
    return null;
}

export function GuideOrchestrator() {
    const pathname = usePathname();
    const {
        gameMode,
        isWeeklyPlannerOpen,
        weeklyChallenges,
        getCurrentPlayer,
        guideTargetId,
        guideMessage,
        setGuideTarget,
        clearGuide,
    } = useGameStore();
    const { gameFields } = useFieldStore();
    const { activeRunbookId, sessions } = useRunbookStore();

    const openChallenges = useMemo(() => {
        return [...weeklyChallenges]
            .filter((challenge) => challenge.status === 'open')
            .sort((a, b) => {
                const priorityDelta = (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
                if (priorityDelta !== 0) return priorityDelta;
                return a.title.localeCompare(b.title);
            });
    }, [weeklyChallenges]);

    const player = getCurrentPlayer();

    useEffect(() => {
        const updateGuide = (target: string | null, message: string | null) => {
            if (!target) {
                if (guideTargetId || guideMessage) clearGuide();
                return;
            }
            if (guideTargetId !== target || (guideMessage || null) !== message) {
                setGuideTarget(target, message);
            }
        };

        if (!gameMode || !player) {
            updateGuide(null, null);
            return;
        }

        if ((player.ownedFieldIds.length + player.rentedFieldIds.length) === 0) {
            updateGuide('dashboard-open-marketplace', 'Acquire your first field');
            return;
        }

        if (pathname.startsWith('/runbooks')) {
            if (!activeRunbookId) {
                updateGuide('runbook-start-primary', 'Start a guided runbook');
                return;
            }

            const runbookTemplate = findRunbookTemplateById(activeRunbookId);
            const runbookSession = sessions[activeRunbookId];
            if (!runbookTemplate || !runbookSession) {
                updateGuide('runbook-start-primary', 'Start a guided runbook');
                return;
            }

            const currentStep = runbookTemplate.steps[runbookSession.currentStepIndex] || runbookTemplate.steps[0];

            if (runbookSession.status === 'completed') {
                updateGuide('runbook-reset-active', 'Reset or select the next runbook');
                return;
            }

            if (currentStep && !runbookSession.completedStepIds.includes(currentStep.id)) {
                updateGuide('runbook-step-toggle', 'Complete this runbook step');
                return;
            }

            updateGuide('runbook-step-next', 'Move to the next runbook step');
            return;
        }

        if (isWeeklyPlannerOpen) {
            updateGuide(null, null);
            return;
        }

        const topChallenge = openChallenges[0];

        if (pathname === '/fields') {
            updateGuide('fields-open-first-field', 'Open a field and execute this week\'s plan');
            return;
        }

        if (pathname.startsWith('/fields/')) {
            const pathFieldId = pathname.split('/')[2] || '';
            const field = gameFields.find((entry) => entry.id === pathFieldId);
            const fieldHasChallenge = openChallenges.some((challenge) => challenge.fieldId === pathFieldId);

            if (field) {
                if (field.farmingStage === 'harvest_ready') {
                    updateGuide('field-cta-log-harvest', 'Log harvest for this field');
                    return;
                }
                if (field.inputStatus?.needsProtection) {
                    updateGuide('field-cta-open-weekly-plan', 'Open weekly plan for protection strategy');
                    return;
                }
                if (field.inputStatus?.needsWater || field.inputStatus?.needsNutrients) {
                    updateGuide('field-cta-open-weekly-plan', 'Open weekly plan for nutrient/water actions');
                    return;
                }
            }

            if (fieldHasChallenge) {
                updateGuide('field-cta-open-weekly-plan', 'Open weekly plan');
                return;
            }

            updateGuide('field-cta-primary-operation', 'Execute next field operation');
            return;
        }

        if (pathname.startsWith('/game/marketplace/services')) {
            const serviceTask = openChallenges.find((challenge) => !!mapServiceOperationToServiceId(challenge.operationId));
            if (serviceTask) {
                updateGuide('services-hire-recommended', 'Hire recommended service');
                return;
            }
            updateGuide('services-hire-recommended', 'Book a field service');
            return;
        }

        if (pathname.startsWith('/game/marketplace/supplies')) {
            const requiresSeeds = openChallenges.some((challenge) => challenge.operationId === 'buy-seeds');
            const requiresFuel = openChallenges.some((challenge) => challenge.operationId === 'buy-fuel');
            const requiresFertilizer = openChallenges.some((challenge) => challenge.operationId === 'buy-fertilizer');
            const requiresChemical = openChallenges.some((challenge) => challenge.operationId === 'buy-chemical');
            if (requiresSeeds) {
                updateGuide('supplies-buy-seeds', 'Buy seeds');
                return;
            }
            if (requiresFertilizer) {
                updateGuide('supplies-buy-fertilizer', 'Buy fertilizer');
                return;
            }
            if (requiresChemical) {
                updateGuide('supplies-buy-chemical', 'Buy crop protection chemical');
                return;
            }
            if (requiresFuel) {
                updateGuide('supplies-buy-fuel', 'Buy fuel');
                return;
            }
            updateGuide('supplies-buy-default', 'Buy required supplies');
            return;
        }

        if (pathname.startsWith('/game/marketplace/equipment')) {
            const needsHarvester = openChallenges.some((challenge) => {
                const op = challenge.operationId || '';
                return op === 'serv-harvest-hand' || op === 'op-harvest';
            });
            const needsTractor = openChallenges.some((challenge) => {
                const op = challenge.operationId || '';
                return ['serv-plow', 'serv-till', 'serv-plant-drill', 'op-plow', 'op-till', 'op-plant'].includes(op);
            });

            if (needsHarvester) {
                updateGuide('equipment-buy-harvester', 'Buy a harvester for in-house harvest');
                return;
            }
            if (needsTractor) {
                updateGuide('equipment-buy-tractor', 'Buy a tractor for in-house operations');
                return;
            }

            updateGuide('equipment-buy-default', 'Expand your machinery fleet');
            return;
        }

        if (pathname === '/game/marketplace') {
            updateGuide('game-marketplace-first-field', 'Open a field listing');
            return;
        }

        if (pathname.startsWith('/game/marketplace/')) {
            updateGuide('game-marketplace-buy-field', 'Buy or rent this field');
            return;
        }

        if (openChallenges.length > 0) {
            updateGuide('game-cta-open-weekly-plan', 'Open weekly plan');
            return;
        }

        updateGuide('game-cta-next-week', 'Advance to next week');
    }, [
        pathname,
        gameMode,
        player,
        isWeeklyPlannerOpen,
        openChallenges,
        gameFields,
        activeRunbookId,
        sessions,
        guideTargetId,
        guideMessage,
        setGuideTarget,
        clearGuide,
    ]);

    return null;
}
