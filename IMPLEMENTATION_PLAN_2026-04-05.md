# Agri-OS Implementation Plan

Date: 2026-04-05

## Goal
Advance Agri-OS without risking the currently working local app.

## Operating Principle
Prefer **consolidation and wiring** over adding new disconnected features.

---

## Immediate Priorities

### Priority 1 — Protect the working base
- Keep behavior-preserving changes only unless explicitly tested.
- Avoid destructive repo cleanup while the app is actively used.
- Treat the local working copy as canonical.

### Priority 2 — Consolidate system authority
Decide and enforce:
- `lib/orchestrator/*` = control plane authority
- `lib/twin/*` = digital twin authority
- `lib/game-*` = simulation/training authority
- `lib/autopilot-engine.ts` = legacy/experimental until merged or retired

### Priority 3 — Replace fake orchestration UI state with real state
Main target:
- `components/orchestrator/ControlPanel.tsx`

Current issue:
- local component state simulates orchestrator mode/status instead of using API/store truth.

Desired result:
- control panel reflects real orchestrator state
- mode/status changes call actual APIs or orchestrator store actions
- UI becomes trustworthy

### Priority 4 — Reduce prototype-grade debt in core files
Highest-value files to harden first:
- `types/orchestrator.ts`
- `lib/orchestrator.ts`
- `lib/orchestrator/decisions.ts`
- `lib/autopilot-engine.ts`

Main work:
- remove `@ts-nocheck` from authority files in stages
- eliminate missing/duplicated type definitions
- reduce mixed responsibilities

### Priority 5 — Clarify real mode vs demo mode
Need explicit separation between:
- mock/demo data flows
- simulation/game flows
- real-farm/orchestrator flows

Without this, future work will keep accumulating ambiguity.

---

## Suggested Execution Order

### Step 1
Add project-level architecture/status docs.  
**Status:** done.

### Step 2
Improve low-risk repo hygiene.  
**Status:** partially done (`.next_stale_*` added to `.gitignore`).

### Step 3
Wire orchestrator control UI to real state/actions.  
**Risk:** low to medium  
**Impact:** high

### Step 4
Refactor core orchestrator typing and decision-engine boundaries.  
**Risk:** medium  
**Impact:** very high

### Step 5
Audit and reduce duplicated “brain” logic between:
- orchestrator
- decision engine
- autopilot engine
- game layer

### Step 6
Harden persistence and API truthfulness.

---

## What Not To Do Right Now

- Do not delete local build directories unless explicitly requested.
- Do not perform large mechanical refactors across the whole app in one pass.
- Do not change user-facing workflows while subsystem authority is still unclear.
- Do not add more major feature surfaces before consolidation.

---

## Definition of Good Progress

Good progress means:
- the app still builds,
- the current UI still works,
- one more subsystem becomes trustworthy,
- future development becomes less confusing.

That is the standard for upcoming changes.
