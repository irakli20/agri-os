import { NextRequest, NextResponse } from 'next/server';
import {
  getModelTuningState,
  runContinuousModelTuning,
  type ModelTuningTrigger,
} from '@/lib/orchestrator/model-tuning';

export const dynamic = 'force-dynamic';

/**
 * GET /api/models/tuning
 * Optional query params:
 * - autoTune=true|false
 * - minSamples=number
 * - minNewOutcomes=number
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const autoTune = url.searchParams.get('autoTune') === 'true';
    const minSamples = url.searchParams.get('minSamples')
      ? Number(url.searchParams.get('minSamples'))
      : undefined;
    const minNewOutcomes = url.searchParams.get('minNewOutcomes')
      ? Number(url.searchParams.get('minNewOutcomes'))
      : undefined;

    const autoRun = autoTune
      ? runContinuousModelTuning({
        trigger: 'auto',
        minSamples: Number.isFinite(minSamples) ? minSamples : undefined,
        minNewOutcomes: Number.isFinite(minNewOutcomes) ? minNewOutcomes : undefined,
      })
      : null;

    return NextResponse.json({
      success: true,
      state: getModelTuningState(),
      autoRun,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read model tuning state',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/models/tuning
 * Body:
 * - trigger?: 'manual' | 'auto' | 'scheduled'
 * - force?: boolean
 * - minSamples?: number
 * - minNewOutcomes?: number
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const trigger = (body?.trigger as ModelTuningTrigger | undefined) || 'manual';
    if (!['manual', 'auto', 'scheduled'].includes(trigger)) {
      return NextResponse.json(
        { success: false, error: 'Invalid trigger. Use manual, auto, or scheduled.' },
        { status: 400 }
      );
    }

    const minSamples = Number(body?.minSamples);
    const minNewOutcomes = Number(body?.minNewOutcomes);
    const run = runContinuousModelTuning({
      trigger,
      force: Boolean(body?.force),
      minSamples: Number.isFinite(minSamples) ? minSamples : undefined,
      minNewOutcomes: Number.isFinite(minNewOutcomes) ? minNewOutcomes : undefined,
    });

    return NextResponse.json({
      success: true,
      run,
      state: getModelTuningState(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run continuous model tuning',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
