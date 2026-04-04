import { NextRequest, NextResponse } from 'next/server';
import {
  clearAuditEvents,
  getAuditEventCount,
  queryAuditEvents,
  recordAuditEvent,
  verifyAuditChain,
} from '@/lib/orchestrator/audit';

/**
 * GET /api/audit
 * Query audit events with optional filters:
 * - eventType, severity, entityType, entityId, since, until, limit
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const includeVerification = url.searchParams.get('verify') === 'true';
  const events = queryAuditEvents({
    eventType: (url.searchParams.get('eventType') as any) || undefined,
    severity: (url.searchParams.get('severity') as any) || undefined,
    entityType: (url.searchParams.get('entityType') as any) || undefined,
    entityId: url.searchParams.get('entityId') || undefined,
    since: url.searchParams.get('since') ? new Date(url.searchParams.get('since') as string) : undefined,
    until: url.searchParams.get('until') ? new Date(url.searchParams.get('until') as string) : undefined,
    limit: url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined,
  });

  return NextResponse.json({
    success: true,
    count: events.length,
    total: getAuditEventCount(),
    events,
    verification: includeVerification ? verifyAuditChain() : undefined,
  });
}

/**
 * POST /api/audit
 * Create a preview audit event for testing pipeline and UI integration.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const event = recordAuditEvent({
      eventType: body?.eventType || 'system_state_changed',
      severity: body?.severity || 'info',
      entityType: body?.entityType || 'system',
      entityId: body?.entityId,
      actor: body?.actor,
      message: body?.message || 'Preview audit event',
      metadata: body?.metadata || { preview: true },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create audit event', details: (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/audit
 * Clears in-memory audit events. Intended for local dev/test usage.
 */
export async function DELETE() {
  const cleared = clearAuditEvents();
  return NextResponse.json({ success: true, cleared });
}
