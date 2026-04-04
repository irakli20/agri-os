# Agri-OS Unified Features and Status

Version: 2.1  
Updated: February 19, 2026  
Scope: Single source of truth for implemented, in-progress, and planned features.

## Status Legend
- `[x]` Implemented in app
- `[~]` Partially implemented / needs hardening
- `[ ]` Planned

## Product Goal
Build a real farm operations interface where farmers can orchestrate season execution from a digital twin, using live field data and safe automation to maximize yield and reduce losses.

## A. Core Strategy Operations
- [x] Weekly strategy planner modal with per-field priorities and action buttons
- [x] Stage-aware challenge generation (fallow -> scout -> soil test -> plow -> till -> plant -> harvest)
- [x] Weekly turn resolution (advance week, summary, new priorities)
- [x] Task board integration with strategy priorities
- [x] Strategy coach guidance in field workflow
- [x] Guided interaction arrow for key action targets

## B. Realistic Farm Constraints
- [x] Crop-specific planting windows
- [x] Crop-specific harvest windows
- [x] Weekly weather windows for fieldwork, spraying, and harvest blocking
- [x] Fuel as consumable input for owned heavy operations
- [x] Operator weekly capacity limits for in-house operations
- [x] Temporary operator hiring flow
- [x] Equipment readiness vs maintenance blocking
- [x] Equipment servicing action loop
- [x] Marketplace fallback loop when in-house execution is blocked

## C. Marketplace and Execution Flows
- [x] Services marketplace routing from planner priorities
- [x] Supplies marketplace routing from planner priorities
- [x] Fuel purchasable from supplies marketplace
- [x] Fertilizer purchasable from supplies marketplace
- [x] Chemicals purchasable from supplies marketplace
- [x] Seed prerequisite enforcement for planting flows
- [x] Fertilizer/chemical prerequisite enforcement for corresponding operations
- [x] Service bookings aligned to stage/weather/calendar gates
- [~] Provider booking depth (availability, lead time, SLA penalties)

## D. Agronomic Intelligence
- [x] Pest/disease monitoring modal and field context integration
- [x] Weed pressure tracking and planner feedback notices
- [x] Regional alert display
- [x] Weather intelligence cards and alert context
- [x] Economic threshold automation
- [x] Treatment recommendation confidence and impact scoring

## E. Digital Twin Readiness
- [x] Unified sensor event ingestion pipeline
- [x] Field/zone state envelope with provenance (`value`, `source`, `timestamp`, `confidence`)
- [x] Historical digital twin timeline and replay
- [x] Sensor freshness and data quality checks
- [x] Reconciliation between manual observations and sensor telemetry

## F. Decision Engine and Coach
- [x] Recommendation object model with rationale, confidence, deadline, and expected impact
- [x] Risk-to-yield and economics priority scoring
- [x] Conflict detection for contradictory recommendations
- [x] Field-level strategy coach with explicit "why now" explanations from live data

## G. Safe Auto-Pilot Orchestration
- [x] Action lifecycle state machine: `proposed -> approved -> dispatched -> acknowledged -> completed/failed`
- [x] Per-action control mode: `manual`, `assisted`, `autopilot`
- [x] Mandatory approval for high-risk actions
- [x] Rollback/contingency policy per action type
- [x] Operator override controls and emergency stop behavior
- [x] End-to-end action audit trail

## H. Season Outcomes and Learning
- [x] Field-level KPI tracking: yield, cost, timing adherence, stress events, avoided loss
- [x] Post-season review with decision attribution
- [x] Continuous model tuning from historical outcomes
- [x] Economic performance benchmarking by crop/field

## I. UX and Workflow Completeness
- [x] Weekly planner open/close behavior available globally
- [x] "Advance to next week" action accessible in planner
- [x] End-to-end modal completion checks for stale task snapshots (live challenge resolution)
- [~] Error messaging consistency across all action buttons and paths
- [x] Guided multi-step runbooks for real-world operation playbooks
- [x] Global stage-aware guide orchestration across pages/modals
- [x] Stage progression persistence across navigation/remount
- [x] Reset season control (restart from marketplace acquisition loop)
- [x] Test-mode unlimited funds for full-season QA

## J. Security, Safety, and Governance (Real Farm Mode)
- [x] Role-based access control for approval and dispatch actions
- [x] Signed command/event logs for compliance
- [x] Policy guardrails for unsafe operation prevention
- [x] Alerting and incident workflows for failed/partial execution

## Current Priorities (Execution Order)
1. Build sensor-event ingestion and digital twin state contracts.
2. Implement recommendation model with explainability and confidence.
3. Implement command lifecycle state machine with approval gates.
4. Add audit timeline and replay across data -> decision -> action -> outcome.
5. Harden provider booking realism (availability, lead time, reliability).

## Notes
- This file supersedes fragmented feature summaries as the canonical checklist.
- Strategy-mode and autopilot goals are intentionally in one document to keep implementation aligned with the real-farm target.
- Test mode currently includes unlimited funds to remove economic blockers during functional testing.

## Execution Tracker (Owner + Target Date)

| ID | Feature | Status | Owner | Target Date |
|---|---|---|---|---|
| A1 | Weekly strategy planner modal with per-field priorities and action buttons | [x] | Product + Frontend | 2026-02-14 |
| A2 | Stage-aware challenge generation | [x] | Gameplay Logic | 2026-02-14 |
| A3 | Weekly turn resolution | [x] | Gameplay Logic | 2026-02-14 |
| A4 | Task board integration with strategy priorities | [x] | Frontend | 2026-02-14 |
| A5 | Strategy coach guidance in field workflow | [x] | Frontend + Product | 2026-02-14 |
| A6 | Guided interaction arrow for key action targets | [x] | Frontend | 2026-02-14 |
| B1 | Crop-specific planting windows | [x] | Agronomy Logic | 2026-02-14 |
| B2 | Crop-specific harvest windows | [x] | Agronomy Logic | 2026-02-14 |
| B3 | Weekly weather windows for fieldwork/spraying/harvest blocking | [x] | Agronomy Logic | 2026-02-14 |
| B4 | Fuel as consumable input for owned heavy operations | [x] | Gameplay Logic | 2026-02-14 |
| B5 | Operator weekly capacity limits for in-house operations | [x] | Gameplay Logic | 2026-02-14 |
| B6 | Temporary operator hiring flow | [x] | Gameplay Logic + UI | 2026-02-14 |
| B7 | Equipment readiness vs maintenance blocking | [x] | Gameplay Logic | 2026-02-14 |
| B8 | Equipment servicing action loop | [x] | Gameplay Logic + UI | 2026-02-14 |
| B9 | Marketplace fallback loop when in-house execution is blocked | [x] | Gameplay Logic + UI | 2026-02-14 |
| C1 | Services marketplace routing from planner priorities | [x] | Frontend | 2026-02-14 |
| C2 | Supplies marketplace routing from planner priorities | [x] | Frontend | 2026-02-14 |
| C3 | Fuel purchasable from supplies marketplace | [x] | Marketplace | 2026-02-14 |
| C4 | Seed prerequisite enforcement for planting flows | [x] | Gameplay Logic | 2026-02-14 |
| C5 | Service bookings aligned to stage/weather/calendar gates | [x] | Gameplay Logic | 2026-02-14 |
| C6 | Provider booking depth (availability, lead time, SLA penalties) | [~] | Marketplace Ops | 2026-03-20 |
| D1 | Pest/disease monitoring modal and field context integration | [x] | Agronomy UI | 2026-02-14 |
| D2 | Weed pressure tracking views | [x] | Agronomy UI | 2026-02-14 |
| D3 | Regional alert display | [x] | Agronomy UI | 2026-02-14 |
| D4 | Weather intelligence cards and alert context | [x] | Weather UI | 2026-02-14 |
| D5 | Economic threshold automation | [x] | Agronomy Rules | 2026-02-19 |
| D6 | Treatment recommendation confidence and impact scoring | [x] | Decision Engine | 2026-02-19 |
| E1 | Unified sensor event ingestion pipeline | [x] | Data Platform | 2026-02-19 |
| E2 | Field/zone state envelope with provenance | [x] | Data Platform | 2026-02-19 |
| E3 | Historical digital twin timeline and replay | [x] | Platform + Frontend | 2026-02-19 |
| E4 | Sensor freshness and data quality checks | [x] | Data Platform | 2026-02-19 |
| E5 | Reconciliation between manual observations and sensor telemetry | [x] | Data + Agronomy | 2026-02-19 |
| F1 | Recommendation object model with rationale/confidence/deadline/impact | [x] | Decision Engine | 2026-02-19 |
| F2 | Risk-to-yield and economics priority scoring | [x] | Decision Engine | 2026-02-19 |
| F3 | Conflict detection for contradictory recommendations | [x] | Decision Engine | 2026-02-19 |
| F4 | Field-level strategy coach explanations from live data | [x] | Frontend + Decision Engine | 2026-02-19 |
| G1 | Action lifecycle state machine | [x] | Orchestration Platform | 2026-02-19 |
| G2 | Per-action control mode (`manual`, `assisted`, `autopilot`) | [x] | Orchestration Platform | 2026-02-19 |
| G3 | Mandatory approval for high-risk actions | [x] | Orchestration Platform | 2026-02-19 |
| G4 | Rollback/contingency policy per action type | [x] | Orchestration + Ops | 2026-02-19 |
| G5 | Operator override controls and emergency stop behavior | [x] | Orchestration + Frontend | 2026-02-19 |
| G6 | End-to-end action audit trail | [x] | Platform + Security | 2026-02-19 |
| H1 | Field-level KPI tracking | [x] | Analytics | 2026-02-19 |
| H2 | Post-season review with decision attribution | [x] | Analytics + Product | 2026-02-19 |
| H3 | Continuous model tuning from historical outcomes | [x] | ML + Data | 2026-02-19 |
| H4 | Economic performance benchmarking by crop/field | [x] | Analytics | 2026-02-19 |
| I1 | Weekly planner open/close behavior available globally | [x] | Frontend | 2026-02-14 |
| I2 | "Advance to next week" action accessible in planner | [x] | Frontend | 2026-02-14 |
| I3 | End-to-end modal completion checks for every critical loop | [~] | QA + Frontend | 2026-03-14 |
| I4 | Error messaging consistency across all action paths | [~] | Frontend + Product | 2026-03-14 |
| I5 | Guided multi-step runbooks for real-world operation playbooks | [x] | Product + Frontend | 2026-04-30 |
| J1 | Role-based access control for approval and dispatch actions | [x] | Security + Platform | 2026-02-20 |
| J2 | Signed command/event logs for compliance | [x] | Security + Platform | 2026-02-19 |
| J3 | Policy guardrails for unsafe operation prevention | [x] | Security + Orchestration | 2026-02-19 |
| J4 | Alerting and incident workflows for failed/partial execution | [x] | SRE + Platform | 2026-02-19 |
