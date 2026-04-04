import { NextRequest, NextResponse } from 'next/server';
import { generateAgronomyIntelligenceReport } from '@/lib/agronomy/treatment-intelligence';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agronomy/treatment-recommendations
 * Query params:
 * - fieldId?: string
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fieldId = url.searchParams.get('fieldId') || undefined;
    const report = generateAgronomyIntelligenceReport({ fieldId });

    if (fieldId && report.summary.fieldsAnalyzed === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Field not found: ${fieldId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate agronomy treatment recommendations',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
