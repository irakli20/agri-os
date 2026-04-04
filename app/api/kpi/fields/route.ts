import { NextRequest, NextResponse } from 'next/server';
import { getFieldKpiSnapshots } from '@/lib/orchestrator/kpi';

/**
 * GET /api/kpi/fields
 * Query params:
 * - fieldId?: string
 * - since?: ISO date string
 * - until?: ISO date string
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fieldId = url.searchParams.get('fieldId') || undefined;
    const sinceRaw = url.searchParams.get('since');
    const untilRaw = url.searchParams.get('until');

    const since = sinceRaw ? new Date(sinceRaw) : undefined;
    const until = untilRaw ? new Date(untilRaw) : undefined;

    if (sinceRaw && Number.isNaN(since?.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid `since` date. Use ISO format.' },
        { status: 400 }
      );
    }
    if (untilRaw && Number.isNaN(until?.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid `until` date. Use ISO format.' },
        { status: 400 }
      );
    }

    const payload = getFieldKpiSnapshots({ fieldId, since, until });

    return NextResponse.json({
      success: true,
      ...payload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to compute field KPIs', details: (error as Error).message },
      { status: 500 }
    );
  }
}
