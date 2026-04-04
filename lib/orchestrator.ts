// @ts-nocheck
/**
 * Agri-OS Master Orchestrator
 * Central brain that coordinates all systems
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  OrchestratorState,
  OrchestratorConfig,
  AutomationLevel,
  SimulationMode,
  Decision,
  Alert,
  GameEvent,
  ActionResult,
  FieldStage,
  PerformanceMetrics,
  DecisionPriority,
  DigitalTwinState,
  SensorSystemStatus,
  ActionLifecycleStatus,
  ActionOverrideEvent,
} from '@/types/orchestrator';
import { DEFAULT_ORCHESTRATOR_CONFIG } from '@/types/orchestrator';
import { canTransitionActionStatus, isTerminalActionStatus } from './orchestrator/action-lifecycle';
import { evaluateDecisionExecutionPolicy } from './orchestrator/action-policy';
import { recordAuditEvent } from './orchestrator/audit';
import type { GameTime, Player } from './game-store';
import { useGameStore } from './game-store';

// ============================================================================
// ORCHESTRATOR STORE
// ============================================================================

const inMemoryPersistStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0;
  },
};

function getPersistStorage(): Storage {
  if (typeof window === 'undefined') {
    return inMemoryPersistStorage;
  }
  return localStorage;
}

function dispatchOrchestratorEvent<T>(eventName: string, detail: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

interface OrchestratorStore extends OrchestratorState {
  // Configuration
  config: OrchestratorConfig;
  setConfig: (config: Partial<OrchestratorConfig>) => void;

  // Control
  start: () => void;
  pause: () => void;
  stop: () => void;
  setAutomationLevel: (level: AutomationLevel) => void;
  setSimulationMode: (mode: SimulationMode) => void;

  // Game Loop
  tick: () => void;
  advanceTime: (weeks?: number) => void;

  // State Machine
  getFieldStage: (fieldId: string) => FieldStage;
  transitionFieldStage: (fieldId: string, from: FieldStage, to: FieldStage) => void;

  // Event System
  events: GameEvent[];
  triggerEvent: (event: Partial<GameEvent>) => void;
  resolveEvent: (eventId: string) => void;

  // Decision Management
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt'>) => Decision;
  approveDecision: (decisionId: string, approvedBy?: string) => { success: boolean; reason?: string };
  declineDecision: (decisionId: string, reason?: string) => void;
  removeDecision: (decisionId: string) => void;

  // Alert Management
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => Alert;
  acknowledgeAlert: (alertId: string) => void;
  removeAlert: (alertId: string) => void;

  // Action Tracking
  addActionResult: (action: ActionResult) => void;
  updateActionStatus: (actionId: string, status: ActionResult['status'], result?: any) => void;
  overrideAction: (
    actionId: string,
    override: {
      overriddenBy: string;
      overrideType: ActionOverrideEvent['overrideType'];
      note: string;
      forceStatus?: ActionLifecycleStatus;
    }
  ) => { success: boolean; reason?: string };
  triggerEmergencyStop: (params: { triggeredBy: string; reason: string }) => { success: boolean };
  releaseEmergencyStop: (params: { releasedBy: string; note?: string }) => { success: boolean; reason?: string };

  // Digital Twin
  updateDigitalTwin: (twin: Partial<DigitalTwinState>) => void;
  updateSensorStatus: (status: Partial<SensorSystemStatus>) => void;

  // Metrics
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;

  // Reset
  reset: () => void;
}

const createInitialState = (): Partial<OrchestratorState> => ({
  id: uuidv4(),
  status: 'idle',
  automationLevel: 'assisted',
  simulationMode: 'simulation',
  currentTick: 0,
  lastTickTime: new Date(),
  season: 'Spring',
  week: 1,
  year: 1,
  activeDecisions: [],
  completedActions: [],
  pendingAlerts: [],
  performanceMetrics: {
    totalDecisions: 0,
    approvedDecisions: 0,
    declinedDecisions: 0,
    autoExecutedDecisions: 0,
    averageConfidence: 0,
    averageROI: 0,
    predictionAccuracy: 0,
    systemUptime: 100,
    lastUpdated: new Date(),
    trends: [],
  },
  digitalTwin: {
    lastSync: new Date(),
    syncStatus: 'synced',
    virtualFields: [],
    driftReports: [],
    calibrationStatus: {
      lastCalibration: new Date(),
      nextCalibration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parametersCalibrated: [],
      accuracy: 85,
      modelVersion: '1.0.0',
    },
    predictions: [],
  },
  sensorStatus: {
    totalSensors: 0,
    onlineSensors: 0,
    offlineSensors: 0,
    lowBatterySensors: 0,
    calibrationDueSensors: 0,
    lastSync: new Date(),
    syncLatency: 0,
  },
  safety: {
    emergencyStopActive: false,
  },
});

export const useOrchestratorStore = create<OrchestratorStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      config: DEFAULT_ORCHESTRATOR_CONFIG,
      events: [],

      setConfig: (config) => {
        set((state) => ({
          config: { ...state.config, ...config },
        }));
      },

      start: () => {
        if (get().safety.emergencyStopActive) {
          console.warn('[Orchestrator] Start blocked: emergency stop is active.');
          recordAuditEvent({
            eventType: 'system_state_changed',
            severity: 'warning',
            entityType: 'system',
            message: 'Start blocked while emergency stop is active.',
          });
          return;
        }
        set({ status: 'running', lastTickTime: new Date() });
        recordAuditEvent({
          eventType: 'system_state_changed',
          entityType: 'system',
          message: 'Orchestrator started.',
        });
        console.log('[Orchestrator] Started');
      },

      pause: () => {
        set({ status: 'paused' });
        recordAuditEvent({
          eventType: 'system_state_changed',
          entityType: 'system',
          message: 'Orchestrator paused.',
        });
        console.log('[Orchestrator] Paused');
      },

      stop: () => {
        set({ status: 'idle' });
        recordAuditEvent({
          eventType: 'system_state_changed',
          entityType: 'system',
          message: 'Orchestrator stopped.',
        });
        console.log('[Orchestrator] Stopped');
      },

      setAutomationLevel: (level) => {
        set({ automationLevel: level });
        console.log(`[Orchestrator] Automation level set to: ${level}`);
      },

      setSimulationMode: (mode) => {
        set({ simulationMode: mode });
        console.log(`[Orchestrator] Simulation mode set to: ${mode}`);
      },

      tick: () => {
        const state = get();
        if (state.status !== 'running') return;

        const now = new Date();
        const timeSinceLastTick = now.getTime() - state.lastTickTime.getTime();

        // Only tick if enough time has passed (throttle)
        if (timeSinceLastTick < state.config.tickInterval) return;

        set((state) => ({
          currentTick: state.currentTick + 1,
          lastTickTime: now,
        }));

        // Trigger tick event for other systems
        dispatchOrchestratorEvent('orchestrator:tick', { tick: state.currentTick + 1, timestamp: now });
      },

      advanceTime: (weeks = 1) => {
        const gameStore = useGameStore.getState();

        for (let i = 0; i < weeks; i++) {
          gameStore.advanceWeek();
        }

        const { gameTime } = gameStore;
        set({
          season: gameTime.season,
          week: gameTime.week,
          year: gameTime.year,
        });

        console.log(`[Orchestrator] Advanced ${weeks} week(s) to ${gameTime.season} Week ${gameTime.week}, Year ${gameTime.year}`);
      },

      getFieldStage: (fieldId) => {
        // Get from game store
        const gameStore = useGameStore.getState();
        const field = gameStore.fields.find(f => f.id === fieldId);
        return (field?.stage || 'fallow') as FieldStage;
      },

      transitionFieldStage: (fieldId, from, to) => {
        const currentStage = get().getFieldStage(fieldId);
        if (currentStage !== from) {
          console.warn(`[Orchestrator] Cannot transition ${fieldId} from ${from} to ${to}: currently ${currentStage}`);
          return;
        }

        // Update game store
        const gameStore = useGameStore.getState();
        gameStore.updateFieldStage(fieldId, to);

        console.log(`[Orchestrator] Field ${fieldId} transitioned: ${from} → ${to}`);
      },

      triggerEvent: (event) => {
        const newEvent: GameEvent = {
          id: uuidv4(),
          type: event.type || 'weather_event',
          timestamp: new Date(),
          severity: event.severity || 'info',
          title: event.title || 'Unknown Event',
          description: event.description || '',
          affectedFields: event.affectedFields || [],
          duration: event.duration || 24,
          effects: event.effects || [],
          mitigations: event.mitigations || [],
          resolved: false,
          ...event,
        };

        set((state) => ({
          events: [newEvent, ...state.events],
        }));

        // Create alert for critical events
        if (newEvent.severity === 'critical' || newEvent.severity === 'catastrophic') {
          get().addAlert({
            type: newEvent.type.includes('weather') ? 'weather_warning' :
              newEvent.type.includes('pest') ? 'pest_outbreak' :
                newEvent.type.includes('disease') ? 'disease_risk' : 'market_opportunity',
            severity: newEvent.severity === 'catastrophic' ? 'critical' : 'warning',
            title: newEvent.title,
            message: newEvent.description,
            fieldId: newEvent.affectedFields[0],
            expiresAt: new Date(Date.now() + newEvent.duration * 60 * 60 * 1000),
            acknowledged: false,
            actions: newEvent.mitigations.map(m => ({
              label: m.action,
              action: 'mitigate_event',
              parameters: { eventId: newEvent.id, mitigation: m },
            })),
          });
        }

        console.log(`[Orchestrator] Event triggered: ${newEvent.title}`);
      },

      resolveEvent: (eventId) => {
        set((state) => ({
          events: state.events.map(e =>
            e.id === eventId ? { ...e, resolved: true, resolvedAt: new Date() } : e
          ),
        }));
      },

      addDecision: (decision) => {
        const executionPolicy = evaluateDecisionExecutionPolicy(decision, get().automationLevel);
        const newDecision: Decision = {
          ...decision,
          id: uuidv4(),
          createdAt: new Date(),
          expiresAt: decision.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
          executionPolicy,
        };

        set((state) => {
          // Check if we're at max pending decisions
          const pending = state.activeDecisions.filter(d => d.status === 'pending');
          if (pending.length >= state.config.maxPendingDecisions) {
            // Remove oldest low priority decision
            const oldest = pending
              .filter(d => d.priority === 'low' || d.priority === 'routine')
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

            if (oldest) {
              return {
                activeDecisions: [
                  newDecision,
                  ...state.activeDecisions.filter(d => d.id !== oldest.id),
                ],
              };
            }
          }

          return {
            activeDecisions: [newDecision, ...state.activeDecisions],
          };
        });

        recordAuditEvent({
          eventType: 'decision_created',
          entityType: 'decision',
          entityId: newDecision.id,
          message: `Decision created: ${newDecision.title}`,
          metadata: {
            priority: newDecision.priority,
            controlMode: newDecision.executionPolicy?.controlMode,
            requiresApproval: newDecision.executionPolicy?.requiresApproval,
            fieldId: newDecision.fieldId,
          },
        });

        // Auto-execute if in fully automated mode and confidence is high enough
        if (newDecision.executionPolicy?.controlMode === 'autopilot' &&
          !newDecision.executionPolicy?.requiresApproval &&
          newDecision.recommendation.confidence >= get().config.autoExecuteThreshold) {
          setTimeout(() => get().approveDecision(newDecision.id, 'system'), 100);
        }

        return newDecision;
      },

      approveDecision: (decisionId, approvedBy) => {
        const current = get().activeDecisions.find(d => d.id === decisionId);
        if (!current) {
          return { success: false, reason: 'Decision not found' };
        }

        if (current.status !== 'pending') {
          return { success: false, reason: `Decision is already ${current.status}` };
        }

        const policy = current.executionPolicy || evaluateDecisionExecutionPolicy(current, get().automationLevel);
        const approver = approvedBy?.trim();
        const isSystemApproval = !approver || approver === 'system';

        if (policy.requiresApproval && isSystemApproval) {
          get().addAlert({
            type: 'compliance_reminder',
            severity: 'critical',
            title: 'High-Risk Decision Requires Human Approval',
            message: `Decision ${current.title} is blocked from auto-approval.`,
            fieldId: current.fieldId,
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
            acknowledged: false,
            actions: [
              {
                label: 'Review Decision',
                action: 'open_decision',
                parameters: { decisionId: current.id },
              },
            ],
          });
          recordAuditEvent({
            eventType: 'decision_approval_blocked',
            severity: 'critical',
            entityType: 'decision',
            entityId: current.id,
            actor: { id: approver || 'system', type: 'system' },
            message: 'Decision approval blocked by high-risk policy.',
            metadata: {
              decisionTitle: current.title,
              reasons: policy.reasons,
            },
          });
          return { success: false, reason: 'High-risk decisions require explicit human approval.' };
        }

        set((state) => ({
          activeDecisions: state.activeDecisions.map(d =>
            d.id === decisionId
              ? {
                ...d,
                status: 'approved',
                approvedBy: approver || 'user',
                autoExecuted: (approver || 'system') === 'system',
                executionPolicy: policy,
              }
              : d
          ),
        }));

        // Trigger execution
        dispatchOrchestratorEvent('orchestrator:decision_approved', { decisionId, approvedBy });
        recordAuditEvent({
          eventType: 'decision_approved',
          entityType: 'decision',
          entityId: decisionId,
          actor: { id: approver || 'user', type: approver && approver !== 'system' ? 'user' : 'system' },
          message: `Decision approved by ${approver || 'user'}.`,
          metadata: {
            autoExecuted: (approver || 'system') === 'system',
            controlMode: policy.controlMode,
          },
        });

        return { success: true };
      },

      declineDecision: (decisionId, reason) => {
        set((state) => ({
          activeDecisions: state.activeDecisions.map(d =>
            d.id === decisionId
              ? { ...d, status: 'declined' }
              : d
          ),
        }));

        recordAuditEvent({
          eventType: 'decision_declined',
          entityType: 'decision',
          entityId: decisionId,
          actor: { id: 'user', type: 'user' },
          message: `Decision declined${reason ? `: ${reason}` : '.'}`,
          metadata: { reason },
        });

        console.log(`[Orchestrator] Decision ${decisionId} declined: ${reason}`);
      },

      removeDecision: (decisionId) => {
        set((state) => ({
          activeDecisions: state.activeDecisions.filter(d => d.id !== decisionId),
        }));
      },

      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: uuidv4(),
          timestamp: new Date(),
        };

        set((state) => ({
          pendingAlerts: [newAlert, ...state.pendingAlerts].slice(0, 50), // Keep last 50
        }));

        recordAuditEvent({
          eventType: 'alert_created',
          severity: newAlert.severity === 'critical' ? 'critical' : newAlert.severity === 'warning' ? 'warning' : 'info',
          entityType: 'alert',
          entityId: newAlert.id,
          message: newAlert.title,
          metadata: {
            type: newAlert.type,
            fieldId: newAlert.fieldId,
          },
        });

        return newAlert;
      },

      acknowledgeAlert: (alertId) => {
        set((state) => ({
          pendingAlerts: state.pendingAlerts.map(a =>
            a.id === alertId ? { ...a, acknowledged: true } : a
          ),
        }));
      },

      removeAlert: (alertId) => {
        set((state) => ({
          pendingAlerts: state.pendingAlerts.filter(a => a.id !== alertId),
        }));
      },

      addActionResult: (action) => {
        const now = new Date();
        const history = action.lifecycleHistory?.length
          ? action.lifecycleHistory
          : [{ status: action.status, timestamp: now, note: 'Action created' }];

        set((state) => ({
          completedActions: [{ ...action, lifecycleHistory: history }, ...state.completedActions].slice(0, 100),
        }));

        recordAuditEvent({
          eventType: 'action_created',
          entityType: 'action',
          entityId: action.id,
          message: `Action created: ${action.actionType}`,
          metadata: {
            status: action.status,
            controlMode: action.controlMode,
            decisionId: action.decisionId,
          },
        });
      },

      updateActionStatus: (actionId, status, result) => {
        const now = new Date();
        set((state) => ({
          completedActions: state.completedActions.map(a =>
            a.id !== actionId
              ? a
              : (() => {
                if (a.status === status) {
                  return a;
                }

                if (isTerminalActionStatus(a.status)) {
                  console.warn(`[Orchestrator] Action ${actionId} is terminal (${a.status}). Ignoring transition to ${status}.`);
                  return a;
                }

                if (!canTransitionActionStatus(a.status, status)) {
                  console.warn(`[Orchestrator] Invalid action transition for ${actionId}: ${a.status} -> ${status}`);
                  recordAuditEvent({
                    eventType: 'action_transition_invalid',
                    severity: 'warning',
                    entityType: 'action',
                    entityId: actionId,
                    message: `Invalid transition attempted: ${a.status} -> ${status}`,
                  });
                  return {
                    ...a,
                    status: 'failed',
                    error: `Invalid transition: ${a.status} -> ${status}`,
                    completedAt: now,
                    lifecycleHistory: [
                      ...(a.lifecycleHistory || []),
                      { status: 'failed', timestamp: now, note: `Invalid transition attempted: ${a.status} -> ${status}` },
                    ],
                  };
                }

                recordAuditEvent({
                  eventType: 'action_status_changed',
                  entityType: 'action',
                  entityId: actionId,
                  message: `Action status changed: ${a.status} -> ${status}`,
                  metadata: { result },
                });

                return {
                  ...a,
                  status,
                  result,
                  approvedAt: status === 'approved' ? now : a.approvedAt,
                  dispatchedAt: status === 'dispatched' ? now : a.dispatchedAt,
                  acknowledgedAt: status === 'acknowledged' ? now : a.acknowledgedAt,
                  startedAt: status === 'dispatched' ? now : a.startedAt,
                  completedAt: status === 'completed' || status === 'failed' || status === 'cancelled' ? now : a.completedAt,
                  lifecycleHistory: [
                    ...(a.lifecycleHistory || []),
                    { status, timestamp: now },
                  ],
                };
              })()
          ),
        }));
      },

      overrideAction: (actionId, override) => {
        const target = get().completedActions.find((a) => a.id === actionId);
        if (!target) {
          return { success: false, reason: 'Action not found' };
        }

        if (isTerminalActionStatus(target.status) && override.overrideType !== 'parameter_adjustment') {
          return { success: false, reason: `Action is terminal (${target.status})` };
        }

        const nextStatus: ActionLifecycleStatus =
          override.forceStatus ||
          (override.overrideType === 'force_cancel'
            ? 'cancelled'
            : override.overrideType === 'force_complete'
              ? 'completed'
              : 'acknowledged');

        const event: ActionOverrideEvent = {
          id: uuidv4(),
          overriddenBy: override.overriddenBy,
          overrideType: override.overrideType,
          note: override.note,
          at: new Date(),
          previousStatus: target.status,
          newStatus: nextStatus,
        };

        set((state) => ({
          completedActions: state.completedActions.map((action) =>
            action.id !== actionId
              ? action
              : {
                ...action,
                status: nextStatus,
                completedAt: nextStatus === 'completed' || nextStatus === 'cancelled' || nextStatus === 'failed'
                  ? new Date()
                  : action.completedAt,
                overrideEvents: [...(action.overrideEvents || []), event],
                lifecycleHistory: [
                  ...(action.lifecycleHistory || []),
                  {
                    status: nextStatus,
                    timestamp: new Date(),
                    note: `Override by ${override.overriddenBy}: ${override.note}`,
                  },
                ],
              }
          ),
        }));

        recordAuditEvent({
          eventType: 'action_overridden',
          severity: override.overrideType === 'emergency_stop' ? 'critical' : 'warning',
          entityType: 'action',
          entityId: actionId,
          actor: { id: override.overriddenBy, type: 'operator' },
          message: `Action overridden via ${override.overrideType}: ${override.note}`,
          metadata: {
            from: target.status,
            to: nextStatus,
          },
        });

        return { success: true };
      },

      triggerEmergencyStop: ({ triggeredBy, reason }) => {
        const now = new Date();
        set((state) => ({
          status: 'paused',
          safety: {
            emergencyStopActive: true,
            emergencyStopReason: reason,
            emergencyStopBy: triggeredBy,
            emergencyStopAt: now,
            lastReleaseAt: state.safety.lastReleaseAt,
          },
          completedActions: state.completedActions.map((action) => {
            if (isTerminalActionStatus(action.status)) {
              return action;
            }
            return {
              ...action,
              status: 'cancelled',
              completedAt: now,
              overrideEvents: [
                ...(action.overrideEvents || []),
                {
                  id: uuidv4(),
                  overriddenBy: triggeredBy,
                  overrideType: 'emergency_stop',
                  note: reason,
                  at: now,
                  previousStatus: action.status,
                  newStatus: 'cancelled',
                },
              ],
              lifecycleHistory: [
                ...(action.lifecycleHistory || []),
                { status: 'cancelled', timestamp: now, note: `Emergency stop: ${reason}` },
              ],
            };
          }),
        }));

        get().addAlert({
          type: 'compliance_reminder',
          severity: 'critical',
          title: 'Emergency Stop Active',
          message: reason,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
          acknowledged: false,
          actions: [{ label: 'Review Safety State', action: 'open_safety_panel' }],
        });

        dispatchOrchestratorEvent('orchestrator:emergency_stop', { triggeredBy, reason, at: now });
        recordAuditEvent({
          eventType: 'safety_emergency_stop_activated',
          severity: 'critical',
          entityType: 'safety',
          actor: { id: triggeredBy, type: 'operator' },
          message: `Emergency stop activated: ${reason}`,
        });
        return { success: true };
      },

      releaseEmergencyStop: ({ releasedBy, note }) => {
        if (!get().safety.emergencyStopActive) {
          return { success: false, reason: 'Emergency stop is not active' };
        }

        const now = new Date();
        set((state) => ({
          safety: {
            emergencyStopActive: false,
            emergencyStopReason: undefined,
            emergencyStopBy: undefined,
            emergencyStopAt: undefined,
            lastReleaseAt: now,
          },
          status: state.status === 'paused' ? 'running' : state.status,
        }));

        dispatchOrchestratorEvent('orchestrator:emergency_stop_released', { releasedBy, note, at: now });
        recordAuditEvent({
          eventType: 'safety_emergency_stop_released',
          severity: 'warning',
          entityType: 'safety',
          actor: { id: releasedBy, type: 'operator' },
          message: `Emergency stop released${note ? `: ${note}` : '.'}`,
        });
        return { success: true };
      },

      updateDigitalTwin: (twin) => {
        set((state) => ({
          digitalTwin: { ...state.digitalTwin, ...twin },
        }));
      },

      updateSensorStatus: (status) => {
        set((state) => ({
          sensorStatus: { ...state.sensorStatus, ...status },
        }));
      },

      updateMetrics: (metrics) => {
        set((state) => ({
          performanceMetrics: {
            ...state.performanceMetrics,
            ...metrics,
            lastUpdated: new Date(),
          },
        }));
      },

      reset: () => {
        set({ ...createInitialState(), config: DEFAULT_ORCHESTRATOR_CONFIG, events: [] });
      },
    }),
    {
      name: 'agri-os-orchestrator',
      storage: createJSONStorage(getPersistStorage),
      partialize: (state) => ({
        id: state.id,
        status: state.status,
        automationLevel: state.automationLevel,
        simulationMode: state.simulationMode,
        season: state.season,
        week: state.week,
        year: state.year,
        config: state.config,
        performanceMetrics: state.performanceMetrics,
        safety: state.safety,
      }),
    }
  )
);

// ============================================================================
// ORCHESTRATOR SERVICE
// ============================================================================

export class OrchestratorService {
  private static instance: OrchestratorService;
  private tickInterval: NodeJS.Timeout | null = null;
  private sensorSyncInterval: NodeJS.Timeout | null = null;
  private decisionInterval: NodeJS.Timeout | null = null;

  static getInstance(): OrchestratorService {
    if (!OrchestratorService.instance) {
      OrchestratorService.instance = new OrchestratorService();
    }
    return OrchestratorService.instance;
  }

  start(): void {
    const store = useOrchestratorStore.getState();
    if (store.status === 'running') return;

    store.start();

    // Start tick loop
    this.tickInterval = setInterval(() => {
      store.tick();
    }, store.config.tickInterval);

    // Start sensor sync loop
    this.sensorSyncInterval = setInterval(() => {
      this.syncSensors();
    }, store.config.sensorSyncInterval);

    // Start decision loop
    this.decisionInterval = setInterval(() => {
      this.runDecisionCycle();
    }, store.config.decisionInterval);

    console.log('[OrchestratorService] All loops started');
  }

  pause(): void {
    const store = useOrchestratorStore.getState();
    store.pause();
    this.stopIntervals();
  }

  stop(): void {
    const store = useOrchestratorStore.getState();
    store.stop();
    this.stopIntervals();
  }

  private stopIntervals(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    if (this.sensorSyncInterval) clearInterval(this.sensorSyncInterval);
    if (this.decisionInterval) clearInterval(this.decisionInterval);

    this.tickInterval = null;
    this.sensorSyncInterval = null;
    this.decisionInterval = null;
  }

  private syncSensors(): void {
    dispatchOrchestratorEvent('orchestrator:sync_sensors', {});
  }

  private runDecisionCycle(): void {
    dispatchOrchestratorEvent('orchestrator:decision_cycle', {});
  }

  // Field state machine helpers
  static readonly FIELD_STATE_TRANSITIONS: Record<FieldStage, FieldStage[]> = {
    fallow: ['prepared'],
    prepared: ['planted', 'fallow'],
    planted: ['germinating'],
    germinating: ['growing'],
    growing: ['reproductive'],
    reproductive: ['harvest_ready'],
    harvest_ready: ['harvested'],
    harvested: ['fallow', 'prepared'],
  };

  static canTransition(from: FieldStage, to: FieldStage): boolean {
    return this.FIELD_STATE_TRANSITIONS[from]?.includes(to) || false;
  }

  static getNextStates(from: FieldStage): FieldStage[] {
    return this.FIELD_STATE_TRANSITIONS[from] || [];
  }
}

// Export singleton instance
export const orchestratorService = OrchestratorService.getInstance();

// ============================================================================
// EVENT HELPERS
// ============================================================================

export function generateWeatherEvent(severity: GameEvent['severity'] = 'info'): Partial<GameEvent> {
  const events: Record<typeof severity, Array<{ title: string; description: string; duration: number }>> = {
    info: [
      { title: 'Light Rain', description: 'Gentle rainfall expected. Good for soil moisture.', duration: 4 },
      { title: 'Partly Cloudy', description: 'Mixed conditions. Good for fieldwork.', duration: 8 },
    ],
    warning: [
      { title: 'Heavy Rain Warning', description: 'Significant rainfall may delay fieldwork.', duration: 24 },
      { title: 'High Winds', description: 'Wind speeds may affect spraying operations.', duration: 12 },
    ],
    critical: [
      { title: 'Frost Warning', description: 'Temperatures may drop below freezing. Protect sensitive crops.', duration: 8 },
      { title: 'Drought Conditions', description: 'Extended dry period. Irrigation may be necessary.', duration: 168 },
    ],
    catastrophic: [
      { title: 'Hail Storm', description: 'Severe hail expected. Move equipment to shelter.', duration: 2 },
      { title: 'Flash Flood', description: 'Immediate flooding risk. Evacuate low-lying fields.', duration: 24 },
    ],
  };

  const pool = events[severity] || events.info;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  return {
    type: 'weather_event',
    severity,
    ...selected,
  };
}

export function generateMarketEvent(): Partial<GameEvent> {
  const events = [
    { title: 'Price Spike', description: 'Commodity prices rising rapidly due to supply shortage.', severity: 'warning' as const },
    { title: 'Market Opportunity', description: 'Favorable selling conditions detected.', severity: 'info' as const },
    { title: 'Supply Shortage', description: 'Input supplies constrained. Prices may rise.', severity: 'warning' as const },
  ];

  const selected = events[Math.floor(Math.random() * events.length)];

  return {
    type: 'market_shock',
    duration: 72,
    ...selected,
  };
}
