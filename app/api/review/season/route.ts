import { NextResponse } from 'next/server';
import { generateSeasonReviewReport } from '@/lib/orchestrator/season-review';

export const dynamic = 'force-dynamic';

/**
 * GET /api/review/season
 * Returns post-season review with decision attribution analytics.
 */
export async function GET() {
  try {
    const report = generateSeasonReviewReport();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate season review report',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
