import { NextRequest, NextResponse } from 'next/server';
import { twinIntelligencePipeline } from '@/lib/twin/intelligence-pipeline';

/**
 * POST /api/sensors
 * Ingest sensor data from IoT devices, weather stations, drones, equipment
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const result = twinIntelligencePipeline.ingest(data);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to ingest sensor data', details: (error as Error).message },
            { status: 400 }
        );
    }
}

/**
 * GET /api/sensors
 * Get recent sensor readings for all connected devices
 */
export async function GET() {
    try {
        const state = twinIntelligencePipeline.getState();
        const timeline = twinIntelligencePipeline.getTimeline({ limit: 200 });
        const freshness = twinIntelligencePipeline.getFreshness();
        return NextResponse.json({
            state,
            timeline,
            freshness,
            staleSensors: freshness.filter((s) => s.isStale).length,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch sensor data', details: (error as Error).message },
            { status: 500 }
        );
    }
}
