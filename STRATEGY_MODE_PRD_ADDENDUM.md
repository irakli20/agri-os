# Strategy Mode PRD Addendum

Version: 1.3  
Updated: February 15, 2026

## Scope
This addendum defines requirements for dynamic, weekly, stage-driven farming orchestration in Strategy Mode.
It also defines the transition path from simulation gameplay to real-farm digital twin orchestration with sensor-driven actions and safe operational automation.

## Functional Requirements

### FR-SM-101 Weekly Planning Modal
- System provides a weekly planning modal with:
  - Current year/season/week
  - Per-field priorities
  - Priority level (critical/high/medium)
  - XP reward visibility
  - Action execution controls

Acceptance criteria:
- Opening planner shows all open weekly priorities.
- Executing an action updates field state and marks matching priority complete.

### FR-SM-102 Stage-Aware Weekly Challenge Generation
- System auto-generates weekly priorities from field stage and stress needs.

Acceptance criteria:
- `fallow` fields generate scouting priority.
- `scouted` fields generate soil-test priority.
- `soil_tested` and `plowed` fields generate prep priorities.
- `tilled` fields generate planting priority.
- `harvest_ready` fields generate harvest priority.
- growing fields with stress flags generate maintenance priorities.

### FR-SM-103 Weekly Turn Resolution
- Advancing week triggers:
  - Growth progression
  - Stress update for growing fields
  - Previous week summary (completed vs missed)
  - New challenge generation for next week

Acceptance criteria:
- Week index advances and rolls season/year correctly.
- Summary appears after week advance and can be dismissed.

### FR-SM-104 Task Board Integration
- Strategy mode task card displays weekly priorities instead of static tasks.

Acceptance criteria:
- Task card shows open weekly priorities with actionable controls.
- Completing a task removes it from pending count.

### FR-SM-105 Real-World Operational Constraints
- Weekly priorities and task execution must enforce:
  - Crop-specific planting and harvest windows
  - Weekly weather windows for fieldwork/spraying/harvest
  - Fuel availability for owned machinery runs
  - Operator capacity limits for in-house execution
  - Equipment readiness vs maintenance downtime

Acceptance criteria:
- Planting/harvest actions are blocked outside crop windows with clear error messaging.
- Fieldwork and spray operations are blocked in unsafe weather windows.
- Heavy machinery operations consume fuel and fail when fuel is insufficient.
- Owned machinery operations consume operator slots; hiring operators restores weekly capacity.
- Maintenance-state equipment cannot execute until serviced.

### FR-SM-106 Marketplace-Backed Contingency Loop
- When in-house execution is blocked, planner should provide marketplace fallback tasks.

Acceptance criteria:
- Planner includes actionable tasks for fuel purchase, operator hiring, and equipment service.
- Service booking enforces agronomic windows and required prerequisites (e.g., seed inventory for planting).
- Weekly planner card executes these meta-actions directly where possible.

### FR-SM-112 Stage-Integrity and Anti-Loop Execution
- Planner and guide must never regress the farmer into stale early-stage actions (e.g., scout/soil-test/plow loops) when field state has advanced.

Acceptance criteria:
- Executing a planner action resolves against live field state, not stale rendered snapshots.
- If task snapshot is stale, execution auto-switches to the current logical stage operation.
- Field state remains stable across navigation/remount (no stage reset on game-field sync).

### FR-SM-113 Nutrient and Chemical Decision Loop
- System supports realistic nutrient/protection workflows tied to stage and scouting intelligence.

Acceptance criteria:
- Supplies marketplace supports seed, fuel, fertilizer, and chemical purchasing tied to weekly priorities.
- Planner can recommend fertilizer at pre-plant incorporation or post/top-dress timing depending on stage.
- Protection loop supports chemical/herbicide application decisions from in-season stress state.

### FR-SM-114 Weed Pressure and Vigor Feedback
- Planner should provide actionable growth-stage and vigor notices from field health indicators.

Acceptance criteria:
- Weekly planner displays per-field crop stage, NDVI-derived vigor, and attention flags.
- Weed pressure is visible in planner notices and affects protection recommendations.

### FR-SM-107 Live Farm Data Ingestion & Digital Twin Sync
- System ingests real telemetry from field devices and keeps per-field digital twin state current.

Acceptance criteria:
- Platform supports timestamped ingestion for weather, soil moisture, equipment telemetry, and scouting observations.
- Every inbound datapoint is mapped to field, zone, and source metadata.
- Digital twin state updates are traceable with audit trail (`source`, `timestamp`, `confidence`).

### FR-SM-108 Recommendation Engine for Real Operations
- Strategy coach recommendations must be generated from live farm state, agronomic models, and operational constraints.

Acceptance criteria:
- Recommendations include rationale, expected impact, confidence, and execution deadline.
- Recommendations are prioritized by risk-to-yield and economics.
- Contradictory recommendations are detected and blocked from simultaneous execution.

### FR-SM-109 Safe Auto-Pilot Command Orchestration
- System supports controlled auto-execution of approved actions against real-world systems (irrigation, spray, work orders, machinery tasks).

Acceptance criteria:
- Action lifecycle is enforced: `proposed -> approved -> dispatched -> acknowledged -> completed/failed`.
- Every action has rollback/contingency plan and operator override capability.
- High-risk actions require explicit human approval before dispatch.

### FR-SM-110 Human-in-the-Loop Control & Explainability
- Farmer remains final decision authority while auto-pilot assists with timing and orchestration.

Acceptance criteria:
- UI always shows: why action is recommended, what data triggered it, and what happens if delayed.
- User can switch per-action mode: `manual`, `assisted`, `autopilot`.
- All automatic actions are explainable and replayable in history.

### FR-SM-111 Season Outcome Tracking & Continuous Learning
- Platform measures outcome of each decision cycle and improves recommendation quality over time.

Acceptance criteria:
- System tracks yield, input cost, timing adherence, stress events, and avoided losses per field.
- Post-season review quantifies value generated by decisions and automation.
- Model tuning pipeline exists for recalibration from historical outcomes.

## Implementation Plan (Current)
- ✅ Add crop calendar + weather window gates in `game-store`.
- ✅ Add fuel stock checks and consumption to direct operations.
- ✅ Add operator weekly capacity, assignment usage, and temporary hiring.
- ✅ Add maintenance-state equipment checks and service action.
- ✅ Regenerate weekly challenges from updated operational constraints.
- ✅ Expose weather/operator context and meta-action buttons in weekly planner UI.
- ✅ Add fuel item to supplies marketplace.
- ✅ Add anti-stale planner execution (live challenge resolution + stage-aware fallback execution).
- ✅ Preserve game field stage progression across `syncGameFields` merges (no reset on remount).
- ✅ Add fertilizer and chemical purchase/operation loops (`buy-fertilizer`, `buy-chemical`, pre/post application ops).
- ✅ Add weed-pressure tracking + planner growth/vigor notices.
- ✅ Add global "Reset Season" action to restart from marketplace acquisition.
- ✅ Add test-mode unlimited funds for integration/season-flow QA.

## Implementation Plan (Next - Real Farm Readiness)
1. Data foundation:
   - Add `sensor-events` schema and ingestion service contracts.
   - Add digital twin state envelope (`value`, `source`, `timestamp`, `confidence`).
2. Decision intelligence:
   - Introduce recommendation object with explicit rationale and confidence.
   - Add risk/economics scoring to priority stack.
3. Execution safety:
   - Implement command lifecycle state machine and approval gates.
   - Add manual override and failsafe policies per action type.
4. Integrations:
   - Define connector interfaces for weather stations, soil probes, irrigation controllers, and work-order providers.
5. Observability and audit:
   - End-to-end event log for `data in -> decision -> action -> outcome`.
   - Field-level timeline replay for compliance and debugging.

## Traceability
- `lib/game-store.ts`: FR-SM-102, FR-SM-103
- `lib/game-store.ts`: FR-SM-105, FR-SM-106
- `lib/game-store.ts`: FR-SM-112, FR-SM-113, FR-SM-114
- `components/modals/WeeklyPlanningModal.tsx`: FR-SM-101, FR-SM-106
- `components/modals/WeeklyPlanningModal.tsx`: FR-SM-112, FR-SM-113, FR-SM-114
- `components/game/GameControlBar.tsx`: FR-SM-101, FR-SM-103
- `components/registry/TaskListCard.tsx`: FR-SM-104
- `lib/marketplace-data.ts`: FR-SM-105
- `app/game/marketplace/supplies/page.tsx`: FR-SM-106
- `components/game/GuideOrchestrator.tsx`: FR-SM-112, FR-SM-113
- `lib/field-store.ts`: FR-SM-112
- `components/game/GameShell.tsx`, `components/layout/AppShell.tsx`: FR-SM-103, FR-SM-112
- `future: integrations + command orchestration modules`: FR-SM-107, FR-SM-108, FR-SM-109, FR-SM-110, FR-SM-111
