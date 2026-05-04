# Agri-OS Implementation Plan

Date: 2026-04-05
Updated: 2026-04-30

> Reference status: superseded by `IMPLEMENTATION_ROADMAP.md`. Keep this file as historical context for the April 5 stabilization plan, but use `PRODUCT_REQUIREMENTS.md` and `IMPLEMENTATION_ROADMAP.md` for current planning.

## Goal
Advance Agri-OS without risking the currently working local app.

The near-term product direction is a staged agricultural autopilot: start as a high-touch field scouting and decision-support assistant, earn trust through real pilot plots, then gradually increase delegation toward season logistics automation. The long-term vision is a real-world strategy game where users manage actual growing seasons through game-like mechanics and harvest revenue is the real reward.

## Operating Principle
Prefer **consolidation and wiring** over adding new disconnected features.

For the 2026 real-field pilot, prefer **trustworthy low-tech workflows** over fragile automation. The product must work with manual scouting notes, phone photos, operator observations, basic weather context, and farmer approval even when multispectral processing, paid imagery software, soil sensors, and weather stations are unavailable.

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

### Priority 6 — Add real-field pilot mode
Create a practical pilot workflow for 2-5 friendly farmer plots:
- create real pilot fields with farmer/contact, crop, area, location, and stage
- log manual observations, photos, weather context, and operator notes
- generate conservative recommendations with evidence, uncertainty, next check date, and approval state
- track action completion and follow-up outcome
- produce a simple field timeline/report that can be shown to farmers

This mode should not depend on multispectral success. Drone imagery can be attached as evidence, but the workflow must remain useful when only manual scouting and basic photos are available.

### Priority 7 — Define progressive delegation
Represent automation as increasing levels of trust:
- `manual`: user records and decides everything
- `assist`: Agri-OS suggests and explains
- `schedule`: Agri-OS proposes timing and reminders
- `coordinate`: Agri-OS prepares service/input actions for approval
- `autopilot`: Agri-OS dispatches bounded approved actions with safety controls

Farmers should be able to delegate one action type at a time and downgrade immediately.

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

### Step 7
Build Real-Field Pilot Mode.
**Risk:** low to medium
**Impact:** very high

Minimum useful workflow:
- pilot field setup
- observation log
- recommendation record
- approval/action state
- follow-up outcome
- farmer-facing report

### Step 8
Add LLM advisor layer on top of structured pilot data.
**Risk:** medium
**Impact:** high

The LLM should summarize context, ask for missing data, explain options, and draft farmer-facing recommendations. It should not bypass deterministic guardrails or human approval for spraying, irrigation, fertilizer, or service dispatch.

### Step 9
Connect Strategy Mode to real-field learning.
**Risk:** medium
**Impact:** high

Keep the game-like experience, but make it capable of mirroring real season progress. XP/rewards should motivate workflow completion while real dates, costs, observations, actions, and outcomes stay traceable.

---

## What Not To Do Right Now

- Do not delete local build directories unless explicitly requested.
- Do not perform large mechanical refactors across the whole app in one pass.
- Do not change user-facing workflows while subsystem authority is still unclear.
- Do not add more major feature surfaces before consolidation.
- Do not make the first pilot depend on multispectral analysis, paid imagery tooling, new sensors, or fully autonomous execution.
- Do not pitch conservative farmers on full AI autopilot before the product has earned trust through simple reports and useful recommendations.

---

## Definition of Good Progress

Good progress means:
- the app still builds,
- the current UI still works,
- one more subsystem becomes trustworthy,
- future development becomes less confusing.
- real pilot data can be captured without fragile dependencies,
- recommendations become more explainable and auditable,
- farmer trust increases through evidence and follow-up.

That is the standard for upcoming changes.

## 10-Day Pilot Sprint Direction

The next 10 days should prioritize a demoable, field-usable pilot path over broad feature expansion.

Day 1-2:
- stabilize build and identify the cleanest path through current app
- define real pilot field schema and UI placement
- separate pilot/demo/game concepts in labels and state

Day 3-4:
- implement observation logging for manual notes, photos, crop stage, weather context, and confidence
- add recommendation records with evidence, uncertainty, approval state, and next check date

Day 5-6:
- add LLM advisor endpoint or helper that turns structured field context into conservative recommendations and missing-data questions
- enforce human approval and guardrail language for high-risk actions

Day 7-8:
- build pilot field timeline and farmer-facing report view
- support follow-up outcomes after spray/scout/monitor decisions

Day 9-10:
- polish one end-to-end demo path
- add realistic sample pilot data
- test with one friendly farmer/customer conversation script
- capture screenshots/video for selling or recruiting pilot plots
