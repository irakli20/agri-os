# Real Farm Autopilot Roadmap

Version: 1.0  
Updated: February 14, 2026

> Supporting status: long-range autonomy architecture. For the 2026 pilot, use the lower-dependency pilot plan in `PRODUCT_REQUIREMENTS.md` and `IMPLEMENTATION_ROADMAP.md`.

## Product Intent
Agri-OS is a real farm operating system, not only a simulation UI.  
The app must help farmers run daily operations using live field data and eventually enable safe auto-pilot orchestration.

## Non-Negotiable Principles
1. Reality-first data: decisions come from real sensor and operational data, not synthetic defaults.
2. Explainable automation: every recommendation/action must include rationale and confidence.
3. Farmer authority: auto-pilot assists, but farmer can approve, reject, or override at any time.
4. Safety gates: high-risk operations require explicit approval and fallback plan.
5. Traceability: every decision and action is auditable end-to-end.

## Core Architecture Layers
1. Data ingestion layer
   - Weather station data
   - Soil moisture/EC/temp probes
   - Machinery telemetry
   - Scouting/drone observations
2. Digital twin layer
   - Field + zone state with timestamps, confidence, and provenance
   - Seasonal stage and stress state
3. Decision layer
   - Prioritization by risk-to-yield, economics, and time window
   - Action recommendation generation
4. Orchestration layer
   - Command lifecycle and approval workflow
   - Dispatch to controllers/providers
5. Outcome layer
   - Yield and loss tracking
   - Decision quality scoring and model tuning

## Action Lifecycle Standard
`proposed -> approved -> dispatched -> acknowledged -> completed/failed`

Required fields on each action:
- `actionId`
- `fieldId` / `zoneId`
- `actionType`
- `triggerDataRefs`
- `reason`
- `expectedImpact`
- `riskLevel`
- `approvalMode` (`manual` | `assisted` | `autopilot`)
- `rollbackPlan`
- `status`
- `timestamps`

## MVP for Real-World Pilot
1. Live sensor ingestion with field mapping.
2. Read-only digital twin timeline.
3. Recommendation cards with reason/confidence/deadline.
4. Human-approved dispatch for low-risk actions.
5. Full audit timeline and simple season KPI report.

## Exit Criteria for "Autopilot Ready"
1. >95% data freshness SLA for critical sensors.
2. No untraceable actions in production.
3. Policy engine blocks unsafe actions reliably.
4. Farmer can replay any week and understand all actions taken.
5. Measurable improvement in timing adherence and loss prevention.
