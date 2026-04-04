import { NextRequest, NextResponse } from 'next/server';
import { buildFieldInsights } from '@/lib/strategy-coach';
import type { Field } from '@/lib/mock-data';
import type { WeeklyChallenge, WeeklyWeather } from '@/lib/game-store';

/**
 * POST /api/coach/preview
 * Smoke-test endpoint for field-level "why now" coaching logic.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fields = (body?.fields || []) as Field[];
    const weeklyChallenges = (body?.weeklyChallenges || []) as WeeklyChallenge[];
    const weeklyWeather = (body?.weeklyWeather || {
      condition: 'Dry and stable',
      windMph: 8,
      precipitationChance: 20,
      fieldworkOpen: true,
      sprayOpen: true,
      harvestOpen: true,
    }) as WeeklyWeather;

    const insights = buildFieldInsights(fields, weeklyChallenges, weeklyWeather);
    return NextResponse.json({
      success: true,
      count: insights.length,
      insights,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to preview coach insights', details: (error as Error).message },
      { status: 400 }
    );
  }
}
