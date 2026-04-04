import { NextRequest, NextResponse } from 'next/server';
import { recordAuditEvent } from '@/lib/orchestrator/audit';

export type OrchestratorRole = 'viewer' | 'operator' | 'supervisor' | 'safety_officer' | 'admin';

export type OrchestratorPermission =
  | 'decisions.read'
  | 'decisions.create'
  | 'decisions.approve'
  | 'decisions.decline'
  | 'actions.dispatch'
  | 'actions.override'
  | 'safety.emergency_stop'
  | 'safety.release_stop'
  | 'orchestrator.control'
  | 'incidents.read'
  | 'incidents.manage';

export interface RequestActor {
  id: string;
  role: OrchestratorRole;
  explicitContext: boolean;
}

const VALID_ROLES = new Set<OrchestratorRole>([
  'viewer',
  'operator',
  'supervisor',
  'safety_officer',
  'admin',
]);

const ROLE_PERMISSIONS: Record<OrchestratorRole, OrchestratorPermission[]> = {
  viewer: ['decisions.read', 'incidents.read'],
  operator: [
    'decisions.read',
    'decisions.create',
    'decisions.decline',
    'actions.dispatch',
    'incidents.read',
  ],
  supervisor: [
    'decisions.read',
    'decisions.create',
    'decisions.approve',
    'decisions.decline',
    'actions.dispatch',
    'actions.override',
    'safety.emergency_stop',
    'safety.release_stop',
    'orchestrator.control',
    'incidents.read',
    'incidents.manage',
  ],
  safety_officer: [
    'decisions.read',
    'actions.override',
    'safety.emergency_stop',
    'safety.release_stop',
    'incidents.read',
    'incidents.manage',
  ],
  admin: [
    'decisions.read',
    'decisions.create',
    'decisions.approve',
    'decisions.decline',
    'actions.dispatch',
    'actions.override',
    'safety.emergency_stop',
    'safety.release_stop',
    'orchestrator.control',
    'incidents.read',
    'incidents.manage',
  ],
};

function parseRole(value: string | null | undefined): OrchestratorRole | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase() as OrchestratorRole;
  return VALID_ROLES.has(normalized) ? normalized : undefined;
}

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function getRequestActor(request: NextRequest): RequestActor {
  const explicitRole = parseRole(
    request.headers.get('x-agri-user-role') || request.headers.get('x-user-role')
  );
  const explicitId = request.headers.get('x-agri-user-id') || request.headers.get('x-user-id');
  const explicitContext = Boolean(explicitRole || explicitId);

  const configuredDefault = parseRole(process.env.AGRI_OS_DEFAULT_ROLE || undefined) || 'admin';
  const role = explicitRole || configuredDefault;
  const id = (explicitId || process.env.AGRI_OS_DEFAULT_USER_ID || 'local-dev').trim();

  return {
    id,
    role,
    explicitContext,
  };
}

export function roleHasPermission(role: OrchestratorRole, permission: OrchestratorPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

interface AuthorizeOptions {
  action: string;
  entityType?: 'decision' | 'action' | 'safety' | 'system' | 'incident' | 'policy';
  entityId?: string;
}

export function authorizeOrchestratorRequest(
  request: NextRequest,
  permission: OrchestratorPermission,
  options: AuthorizeOptions
): { ok: true; actor: RequestActor } | { ok: false; response: NextResponse } {
  const actor = getRequestActor(request);
  const requireExplicitContext = parseBool(process.env.AGRI_OS_REQUIRE_USER_CONTEXT);

  if (requireExplicitContext && !actor.explicitContext) {
    recordAuditEvent({
      eventType: 'system_state_changed',
      severity: 'warning',
      entityType: options.entityType || 'system',
      entityId: options.entityId,
      actor: { id: actor.id, type: 'api' },
      message: `RBAC blocked ${options.action}: missing explicit user context`,
      metadata: { permission, role: actor.role, requireExplicitContext: true },
    });
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Missing user identity context. Provide x-agri-user-id and x-agri-user-role headers.',
          requiredPermission: permission,
        },
        { status: 401 }
      ),
    };
  }

  if (!roleHasPermission(actor.role, permission)) {
    recordAuditEvent({
      eventType: 'system_state_changed',
      severity: 'warning',
      entityType: options.entityType || 'system',
      entityId: options.entityId,
      actor: { id: actor.id, type: 'api' },
      message: `RBAC denied ${options.action}`,
      metadata: {
        permission,
        role: actor.role,
      },
    });
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Role ${actor.role} is not allowed to perform ${options.action}.`,
          requiredPermission: permission,
          actor: {
            id: actor.id,
            role: actor.role,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, actor };
}
