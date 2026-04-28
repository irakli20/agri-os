# Agri-OS Architecture Audit

Date: 2026-04-05  
Auditor: Jerry

## Executive Summary

Agri-OS is currently a **hybrid system** composed of:

1. a rich farm operations UI,
2. a strategy/simulation layer,
3. an emerging real-farm orchestrator/control plane,
4. a digital twin ingestion/reconciliation layer.

The local working copy is the correct canonical source of truth for the project and **does build successfully** with `next build`.

This codebase is no longer just a static product mockup. It now contains meaningful implementation structure for:
- orchestration APIs,
- action lifecycle state handling,
- decision approval flows,
- policy/safety guardrails,
- incident and audit logging,
- digital twin sensor ingestion,
- replay/reconciliation mechanics.

At the same time, implementation maturity is uneven. A significant portion of the UX and domain model is still demo/mock-data driven, and some high-importance files remain prototype-grade (`@ts-nocheck`, local type stubs, mixed responsibilities, in-memory/server-local persistence).

---

## Current High-Level Architecture

### 1. Experience Layer
Primary user-facing screens live under `app/` and `components/`.

Major surfaces:
- dashboard/home map canvas
- fields / field details
- fleet
- equipment
- inventory
- procurement
- finance
- services / bookings
- weather
- crops
- review / runbooks
- game marketplace / strategy screens

### 2. Workflow & Modal Layer
`components/modals/*`

This layer implements concrete user workflows such as:
- adding fields/equipment/inventory/suppliers
- scouting reports and schedules
- pest/disease monitoring
- treatment scheduling
- weekly planning
- maintenance / invoices / provider messaging

This is the primary operational interaction layer for the app.

### 3. Registry / Map / Visualization Layer
`components/registry/*`, geospatial helpers in `lib/*`

Includes:
- `MapCanvas.tsx`
- field health and status cards
- spectral controls
- scouting route views
- imagery/LIDAR/overlay helpers
- GeoTIFF layer scaffolding

This confirms the app is designed as a **map-first agricultural operating interface**.

### 4. Strategy / Simulation Layer
`components/game/*`, `lib/game-*`, `lib/game-store.ts`

Implements:
- stage progression
- weekly turn logic
- planner flows
- marketplace constraints
- staffing / fuel / readiness mechanics
- test-mode style season loops

This is effectively a **simulation and prototyping environment** for farm operations logic.

### 5. Orchestrator / Control Plane Layer
`app/api/orchestrator*`, `lib/orchestrator*`, `types/orchestrator.ts`, `components/orchestrator/*`

Contains:
- orchestration status/mode APIs
- action lifecycle transitions
- decision approval/decline flows
- audit logging
- policy guardrails
- incidents
- KPI / benchmarking / season review hooks
- safety controls and emergency stop mechanics

This is the beginning of the real farm autonomy/control plane.

### 6. Digital Twin / Ingestion Layer
`lib/twin/*`, `lib/sensors/*`, `app/api/sensors`, `app/api/twin`

Contains:
- sensor ingestion pipeline
- state envelopes with provenance
- freshness checks
- manual observation ingestion
- telemetry/manual reconciliation
- replay/timeline generation

This is one of the strongest signs that the project is moving from concept toward a real farm-state platform.

---

## Canonical Subsystems

### Subsystem A — UI / App Shell
**Status:** implemented and active  
**Authority level:** high for presentation, low for business truth

Key files:
- `app/layout.tsx`
- `components/layout/AppShell.tsx`
- route pages in `app/*`

### Subsystem B — Game / Strategy Runtime
**Status:** substantial  
**Authority level:** medium, but conceptually overlaps with orchestrator

Key files:
- `lib/game-store.ts`
- `lib/game-logic/field-simulation.ts`
- `components/game/*`

Purpose:
- simulate season execution,
- drive strategic planning loops,
- encode operational constraints.

### Subsystem C — Orchestrator Store / Runtime
**Status:** partially real, architecturally important  
**Authority level:** should become high, but not fully authoritative yet

Key files:
- `lib/orchestrator.ts`
- `lib/orchestrator/*`
- `app/api/orchestrator/route.ts`
- `types/orchestrator.ts`

Purpose:
- manage decisions/actions,
- enforce lifecycle transitions,
- apply safety controls,
- provide control plane semantics.

### Subsystem D — Decision Engine / Recommendation Logic
**Status:** meaningful but still prototype-heavy  
**Authority level:** medium

Key files:
- `lib/orchestrator/decisions.ts`
- `lib/agronomy/treatment-intelligence.ts`
- `lib/autopilot-engine.ts`

Observation:
There are **multiple competing decision/orchestration brains** in the codebase.
That is the single largest conceptual risk.

### Subsystem E — Digital Twin
**Status:** real structure exists  
**Authority level:** emerging high-value backbone

Key files:
- `lib/twin/intelligence-pipeline.ts`
- `app/api/twin/route.ts`
- `app/api/sensors/route.ts`

Purpose:
- field state ingestion,
- event timeline storage,
- freshness tracking,
- manual observation reconciliation,
- replay.

---

## What Is Actually Strong Right Now

### 1. The project vision is coherent
The app clearly aims to become a:
- farm operating system,
- decision support platform,
- digital twin interface,
- human-in-the-loop autopilot.

### 2. The local codebase builds successfully
The local working copy is stable enough to compile in production mode.

### 3. Orchestrator concepts are well chosen
The following concepts are directionally correct:
- action lifecycle state machine,
- approval gates,
- policy guardrails,
- incidents,
- audit trail,
- emergency stop.

### 4. Digital twin concepts are valuable
The envelope/provenance/reconciliation approach is good and worth preserving.

### 5. The app remains map-native
This is correct for agricultural operations.

---

## Main Risks / Architectural Debt

### 1. Competing brains
There are overlapping sources of operational truth:
- `lib/autopilot-engine.ts`
- `lib/orchestrator.ts`
- `lib/orchestrator/decisions.ts`
- game/simulation logic in `lib/game-store.ts` and friends

This is the biggest structural problem.

### 2. Type authority is weak
`types/orchestrator.ts` is broad and important, but still uses `@ts-nocheck`, and some implementation files compensate with local type shortcuts.

### 3. Documentation overstates implementation completeness
Several docs/checklists mark systems as fully implemented, while code reality is closer to:
- scaffolded,
- partially wired,
- API-shaped but not production-backed,
- local-state/in-memory only.

### 4. Persistence is not yet production-grade
Some “system” behavior depends on:
- local Zustand persistence,
- in-memory route state,
- JSON files under project root,
- mock/default data.

### 5. Repo hygiene needs tightening
Local project contains:
- `.next`
- `.next_stale_*`
- `node_modules`
- nested backup directories

Even if ignored correctly, these create review and sync risk.

---

## Recommended Authority Model

To avoid future drift, Agri-OS should converge on this authority order:

### Source of truth for domain/system types
`types/orchestrator.ts` plus domain-specific type files

### Source of truth for control plane behavior
`lib/orchestrator/*`

### Source of truth for digital twin state
`lib/twin/*` + ingestion/reconciliation APIs

### Source of truth for simulation/training behavior
`lib/game-*`

### Non-authoritative / candidate for consolidation
`lib/autopilot-engine.ts`

Recommendation:
`lib/autopilot-engine.ts` should either:
- be merged into the orchestrator/decision engine model, or
- be explicitly reframed as an experimental legacy engine.

---

## Safe Next Steps

These are the lowest-risk, highest-value actions:

1. **Document the subsystem boundaries**
   - done in this audit
2. **Improve repo hygiene**
   - ensure stale build output and nested backups are ignored
3. **Create a consolidation plan for the decision/orchestrator layer**
4. **Wire orchestrator UI to real APIs instead of local mock state**
5. **Replace `@ts-nocheck` in core authority files gradually**
6. **Separate mock/demo mode from real-mode data paths**

---

## Recommended Work Sequence

### Phase 1 — Safety / clarity
- architecture documentation
- repo hygiene
- identify authoritative modules

### Phase 2 — Consolidation
- unify orchestrator and decision engine responsibilities
- reduce duplicate/autonomous logic paths
- strengthen type boundaries

### Phase 3 — Wiring
- connect orchestrator UI panels to API/state truth
- connect review/metrics surfaces to actual stores

### Phase 4 — Real-world hardening
- improve persistence model
- formalize live data contracts
- remove prototype shortcuts from critical paths

---

## Bottom Line

Agri-OS is promising and already materially beyond a pure mockup. The local codebase has enough architectural substance to support real continued development.

The most important thing now is **not adding more unrelated surface area**.
The most important thing is **consolidating the brains**:
- one authority for decisions,
- one authority for action execution,
- one authority for digital twin truth.

If that consolidation is done carefully, the rest of the system can scale in a sane way.
