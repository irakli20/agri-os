import { NextRequest, NextResponse } from 'next/server';
import { generateEconomicBenchmarkReport } from '@/lib/orchestrator/economic-benchmark';

export const dynamic = 'force-dynamic';

/**
 * GET /api/benchmark/economics
 * Query params:
 * - scope?: field | crop | all (default: all)
 * - limit?: number (applied to sorted leaderboard arrays)
 * - includeInsights?: true | false (default: true)
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const scope = (url.searchParams.get('scope') || 'all').toLowerCase();
    const includeInsights = url.searchParams.get('includeInsights') !== 'false';
    const limitRaw = url.searchParams.get('limit');
    const limit = limitRaw ? Number(limitRaw) : undefined;

    if (!['field', 'crop', 'all'].includes(scope)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid `scope` value. Use field, crop, or all.',
        },
        { status: 400 }
      );
    }

    if (typeof limit !== 'undefined' && (!Number.isFinite(limit) || limit < 1 || !Number.isInteger(limit))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid `limit` value. Use a positive integer.',
        },
        { status: 400 }
      );
    }

    const report = generateEconomicBenchmarkReport();
    const fieldLeaderboard = typeof limit === 'number' ? report.byField.slice(0, limit) : report.byField;
    const cropLeaderboard = typeof limit === 'number' ? report.byCrop.slice(0, limit) : report.byCrop;

    return NextResponse.json({
      success: true,
      generatedAt: report.generatedAt,
      seasonContext: report.seasonContext,
      summary: report.summary,
      insights: includeInsights ? report.insights : [],
      byField: scope === 'crop' ? [] : fieldLeaderboard,
      byCrop: scope === 'field' ? [] : cropLeaderboard,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate economic benchmark report',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
