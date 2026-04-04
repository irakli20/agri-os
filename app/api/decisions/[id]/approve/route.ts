import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';
import { createIncident } from '@/lib/orchestrator/incidents';
import { recordAuditEvent } from '@/lib/orchestrator/audit';
import {
    evaluateOrchestratorGuardrails,
    resolveActionTypeFromDecisionType,
} from '@/lib/orchestrator/policy-guardrails';

/**
 * POST /api/decisions/[id]/approve
 * Approve and execute an AI recommendation
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id?: string } | Promise<{ id?: string }> }
) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const idFromPath = decodeURIComponent(request.nextUrl.pathname.split('/').filter(Boolean).slice(-2, -1)[0] || '');
        const decisionId = resolvedParams?.id || idFromPath;
        if (!decisionId) {
            return NextResponse.json(
                { error: 'Decision id is required' },
                { status: 400 }
            );
        }

        const authz = authorizeOrchestratorRequest(request, 'decisions.approve', {
            action: 'approve decision',
            entityType: 'decision',
            entityId: decisionId,
        });
        if (!authz.ok) {
            return authz.response;
        }

        const body = await request.json().catch(() => ({}));
        const approvedBy = typeof body?.approvedBy === 'string' ? body.approvedBy : authz.actor.id;

        const orchestrator = useOrchestratorStore.getState();
        const decision = orchestrator.activeDecisions.find(d => d.id === decisionId && d.status === 'pending');
        
        if (!decision) {
            return NextResponse.json(
                { error: 'Decision not found' },
                { status: 404 }
            );
        }

        const guardrail = evaluateOrchestratorGuardrails({
            source: 'decision_approval',
            actionType: resolveActionTypeFromDecisionType(decision.recommendation.actionType),
            controlMode: decision.executionPolicy?.controlMode,
            priority: decision.priority,
            parameters: decision.recommendation.parameters,
        });
        if (guardrail.decision === 'block') {
            recordAuditEvent({
                eventType: 'policy_guardrail_blocked',
                severity: 'critical',
                entityType: 'policy',
                entityId: decisionId,
                actor: { id: authz.actor.id, type: 'api' },
                message: `Decision approval blocked by guardrail policy for ${decision.title}`,
                metadata: {
                    guardrail,
                    decisionId,
                },
            });
            createIncident({
                title: 'Guardrail blocked decision approval',
                description: `Decision "${decision.title}" was blocked by safety policy.`,
                severity: 'high',
                source: 'policy',
                relatedEntityType: 'decision',
                relatedEntityId: decisionId,
                recommendedActions: guardrail.hits.map((hit) => hit.remediation),
                metadata: { guardrail },
                actorId: authz.actor.id,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: 'Decision blocked by policy guardrails.',
                    guardrail,
                },
                { status: 409 }
            );
        }
        if (guardrail.decision === 'warn') {
            recordAuditEvent({
                eventType: 'policy_guardrail_warning',
                severity: 'warning',
                entityType: 'policy',
                entityId: decisionId,
                actor: { id: authz.actor.id, type: 'api' },
                message: `Decision approval warning for ${decision.title}`,
                metadata: { guardrail, decisionId },
            });
        }

        const approvalResult = orchestrator.approveDecision(decisionId, approvedBy);
        if (!approvalResult.success) {
            return NextResponse.json(
                {
                    error: approvalResult.reason || 'Approval blocked',
                    requiresHumanApproval: !!decision.executionPolicy?.requiresApproval,
                    executionPolicy: decision.executionPolicy,
                },
                { status: 409 }
            );
        }

        const updated = useOrchestratorStore.getState().activeDecisions.find(d => d.id === decisionId);
        return NextResponse.json({ success: true, decision: updated, guardrail });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to execute decision', details: (error as Error).message },
            { status: 500 }
        );
    }
}
