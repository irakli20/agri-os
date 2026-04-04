import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { authorizeOrchestratorRequest } from '@/lib/orchestrator/rbac';

/**
 * POST /api/decisions/[id]/decline
 * Decline an AI recommendation
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

        const authz = authorizeOrchestratorRequest(request, 'decisions.decline', {
            action: 'decline decision',
            entityType: 'decision',
            entityId: decisionId,
        });
        if (!authz.ok) {
            return authz.response;
        }

        const body = await request.json().catch(() => ({}));
        const reason = typeof body?.reason === 'string' ? body.reason : undefined;

        const orchestrator = useOrchestratorStore.getState();
        orchestrator.declineDecision(decisionId, reason);
        return NextResponse.json({ success: true, message: 'Decision declined' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to decline decision', details: (error as Error).message },
            { status: 500 }
        );
    }
}
