import { NextRequest, NextResponse } from 'next/server';
import { useOrchestratorStore } from '@/lib/orchestrator';
import { twinIntelligencePipeline } from '@/lib/twin/intelligence-pipeline';

/**
 * GET /api/twin
 * Get full digital twin state, timeline, and replay snapshots
 */
export async function GET(request: NextRequest) {
    try {
        const orchestrator = useOrchestratorStore.getState();
        const twinState = orchestrator.digitalTwin;
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode') || 'summary';
        const fieldId = searchParams.get('fieldId') || undefined;
        const start = searchParams.get('start') || undefined;
        const end = searchParams.get('end') || undefined;
        const speed = Number(searchParams.get('speed') || 1);

        if (mode === 'timeline') {
            return NextResponse.json({
                mode,
                timeline: twinIntelligencePipeline.getTimeline({ fieldId, start, end, limit: 2000 }),
                reconciliations: twinIntelligencePipeline.getReconciliationHistory(fieldId),
            });
        }

        if (mode === 'replay') {
            if (!fieldId) {
                return NextResponse.json(
                    { error: 'fieldId is required for replay mode' },
                    { status: 400 }
                );
            }
            return NextResponse.json({
                mode,
                replay: twinIntelligencePipeline.replay({ fieldId, start, end, speed }),
            });
        }

        return NextResponse.json({
            mode: 'summary',
            orchestratorTwin: twinState,
            stateEnvelope: twinIntelligencePipeline.getState(fieldId),
            freshness: twinIntelligencePipeline.getFreshness(fieldId),
            reconciliations: twinIntelligencePipeline.getReconciliationHistory(fieldId),
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch twin state', details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/twin
 * Record manual observations and reconcile against telemetry
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const action = body?.action;

        if (action === 'manual_observation') {
            const observation = twinIntelligencePipeline.addManualObservation({
                fieldId: body.fieldId,
                zoneId: body.zoneId,
                metric: body.metric,
                value: Number(body.value),
                unit: body.unit || '',
                observedAt: body.observedAt || new Date().toISOString(),
                observedBy: body.observedBy || 'operator',
                confidence: Number(body.confidence ?? 80),
                notes: body.notes,
            });
            return NextResponse.json({ success: true, observation });
        }

        if (action === 'reconcile') {
            const result = twinIntelligencePipeline.reconcile({
                fieldId: body.fieldId,
                metric: body.metric,
                tolerancePercent: body.tolerancePercent,
            });
            return NextResponse.json({ success: true, result });
        }

        return NextResponse.json(
            { error: 'Unsupported action. Use "manual_observation" or "reconcile".' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process twin operation', details: (error as Error).message },
            { status: 400 }
        );
    }
}
