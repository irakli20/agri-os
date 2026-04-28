import { NextRequest, NextResponse } from 'next/server';
import { OrchestratorState, OrchestratorAPIResponse, AutomationLevel } from '@/types/orchestrator';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';
import { evaluateOrchestratorGuardrails } from '@/lib/orchestrator/policy-guardrails';
import { createIncident, getIncidentSummary } from '@/lib/orchestrator/incidents';
import { recordAuditEvent } from '@/lib/orchestrator/audit';
import { useOrchestratorStore } from '@/lib/orchestrator';

/**
 * GET /api/orchestrator
 * Get orchestrator status
 */
export async function GET(): Promise<NextResponse> {
    const orchestrator = useOrchestratorStore.getState();
    const response: OrchestratorAPIResponse<OrchestratorState> = {
        success: true,
        data: orchestrator as any, // Cast to any to handle type overlap
        timestamp: new Date(),
    };

    return NextResponse.json(response);
}

/**
 * POST /api/orchestrator/start
 * Start automation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const orchestrator = useOrchestratorStore.getState();
        const authz = authorizeOrchestratorRequest(request, 'orchestrator.control', {
            action: 'change orchestrator runtime state',
            entityType: 'system',
            entityId: orchestrator.id,
        });
        if (!authz.ok) {
            return authz.response;
        }

        const url = new URL(request.url);
        const action = url.searchParams.get('action');
        const body = action === 'mode' ? await request.json().catch(() => ({})) : {};
        const targetMode = typeof body?.mode === 'string' ? body.mode : undefined;
        const guardrail = evaluateOrchestratorGuardrails({
            source: 'orchestrator_control',
            requestedOperation: action || 'unknown',
            targetMode,
        });
        if (guardrail.decision === 'block') {
            recordAuditEvent({
                eventType: 'policy_guardrail_blocked',
                severity: 'critical',
                entityType: 'policy',
                entityId: orchestrator.id,
                actor: { id: authz.actor.id, type: 'api' },
                message: `Orchestrator control blocked for action=${action}`,
                metadata: { guardrail, action, targetMode },
            });
            createIncident({
                title: 'Orchestrator control blocked by guardrail',
                description: `Control request action=${action} was blocked by safety policy.`,
                severity: 'high',
                source: 'policy',
                relatedEntityType: 'system',
                relatedEntityId: orchestrator.id,
                recommendedActions: guardrail.hits.map((hit) => hit.remediation),
                metadata: { guardrail, action, targetMode },
                actorId: authz.actor.id,
            });
            return NextResponse.json({
                success: false,
                error: 'Orchestrator control blocked by policy guardrails.',
                guardrail,
            }, { status: 409 });
        }
        if (guardrail.decision === 'warn') {
            recordAuditEvent({
                eventType: 'policy_guardrail_warning',
                severity: 'warning',
                entityType: 'policy',
                entityId: orchestrator.id,
                actor: { id: authz.actor.id, type: 'api' },
                message: `Orchestrator control warning for action=${action}`,
                metadata: { guardrail, action, targetMode },
            });
        }

        if (action === 'start') {
            orchestrator.start();
            
            return NextResponse.json({
                success: true,
                data: { status: 'running', message: 'Automation started' },
                timestamp: new Date(),
            });
        }

        if (action === 'pause') {
            orchestrator.pause();
            
            return NextResponse.json({
                success: true,
                data: { status: 'paused', message: 'Automation paused' },
                timestamp: new Date(),
            });
        }

        if (action === 'mode') {
            const { mode } = body as { mode: AutomationLevel };

            if (!mode || !['manual', 'assisted', 'fully_automated'].includes(mode)) {
                return NextResponse.json({
                    success: false,
                    error: 'Invalid mode. Must be one of: manual, assisted, fully_automated',
                    timestamp: new Date(),
                }, { status: 400 });
            }

            if (mode === 'fully_automated') {
                const incidents = getIncidentSummary();
                if (incidents.criticalOpen > 0) {
                    recordAuditEvent({
                        eventType: 'policy_guardrail_blocked',
                        severity: 'critical',
                        entityType: 'policy',
                        entityId: orchestrator.id,
                        actor: { id: authz.actor.id, type: 'api' },
                        message: 'Fully automated mode blocked by open critical incidents.',
                        metadata: {
                            incidents,
                            requestedMode: mode,
                        },
                    });
                    return NextResponse.json({
                        success: false,
                        error: 'Cannot switch to fully_automated mode while critical incidents are open.',
                        incidents,
                    }, { status: 409 });
                }
            }

            orchestrator.setAutomationLevel(mode);

            return NextResponse.json({
                success: true,
                data: { mode, message: `Automation mode set to ${mode}` },
                timestamp: new Date(),
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid action. Use ?action=start, ?action=pause, or ?action=mode',
            timestamp: new Date(),
        }, { status: 400 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date(),
        }, { status: 500 });
    }
}
