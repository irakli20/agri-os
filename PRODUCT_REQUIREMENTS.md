# Agri-OS Product Requirements

Version: 1.0
Updated: 2026-04-30
Status: Canonical product requirements document

## Purpose
Agri-OS is a staged AI agricultural autopilot. It starts as a high-touch field scouting and decision-support tool, then earns trust through real field pilots, then gradually expands into assisted scheduling, delegated season logistics, and bounded real-world autopilot.

The long-term product can also become a real-world farming strategy game: users manage actual fields through game-like season mechanics while real crops grow, real operations happen, and harvest revenue becomes the reward.

## Current Strategic Constraint
The 2026 pilot must work without depending on:
- paid multispectral analysis software,
- reliable multispectral drone capture,
- soil moisture sensors,
- weather stations,
- prescription-map workflows,
- fully autonomous dispatch,
- a dedicated agronomist on every decision.

The first credible product wedge is therefore:

**AI field scouting + spray decision log + farmer-facing pilot reports.**

## Users
- **Operator / founder**: sets up pilot fields, collects observations, flies drones when practical, performs or coordinates spraying, and uses Agri-OS to organize evidence and recommendations.
- **Farmer / customer**: reviews simple recommendations, approves or rejects actions, and gives feedback after seeing field outcomes.
- **Agronomist / expert advisor (future)**: validates higher-risk recommendations and improves decision templates.
- **Citizen / remote participant (future)**: participates in a game-like real-world farming season by funding or managing bounded decisions through the app.

## Product Maturity Levels
1. **Guided Pilot**
   - Manual field setup.
   - Manual scouting notes and photos.
   - Basic weather context.
   - Conservative recommendations.
   - Human approval for every action.
2. **Assisted Autopilot**
   - Repeatable field timelines.
   - Recommendation history.
   - Spray/scout scheduling suggestions.
   - Cost/benefit framing.
   - Follow-up outcome checks.
3. **Delegated Season Logistics**
   - Farmer delegates bounded tasks such as scout next week, prepare input purchase, book a spray window, or monitor drought risk.
   - Agri-OS coordinates timing, constraints, reminders, and exceptions.
4. **Bounded Autopilot**
   - Approved action classes can dispatch automatically under explicit policies, guardrails, audit logs, and emergency stop.
5. **Real-World Strategy Game**
   - Real fields can be managed through game-like season mechanics.
   - XP/rewards motivate good workflow behavior, but real dates, costs, actions, evidence, and outcomes stay traceable.

## Core Requirements

### PRD-001 Real-Field Pilot Mode
Agri-OS must support real pilot fields separate from demo/game fields.

Acceptance criteria:
- Capture farmer/contact, crop, area, location, planting date or crop stage, and notes.
- Show pilot fields in a clear real-world section or filter.
- Keep pilot fields usable without multispectral data or external sensors.

### PRD-002 Observation Logging
Operators must be able to log observations from manual scouting, phone photos, drone notes, or imported imagery.

Acceptance criteria:
- Observation fields include date, field, crop stage, issue type, severity, notes, photos, weather context, confidence, and source.
- Observations appear in a field timeline.
- Observations can feed recommendations without pretending low-confidence data is certain.

### PRD-003 Conservative Recommendation Records
Every recommendation must be an auditable record, not just UI text.

Acceptance criteria:
- Include evidence, missing data, uncertainty, expected cost/benefit, urgency, next check date, and recommended state.
- Support states: `monitor`, `recommended`, `needs confirmation`, `approved`, `rejected`, `completed`, `outcome pending`.
- High-risk actions require human approval.

### PRD-004 LLM Advisor Layer
The LLM should act as orchestrator, planner, explainer, and missing-data checker.

Acceptance criteria:
- LLM receives structured field, observation, weather, stage, and action context.
- Output includes summary, missing-data questions, action options, and farmer-friendly explanation.
- LLM output cannot bypass deterministic safety guardrails.
- Prompt context and response summary are auditable.

### PRD-005 Farmer-Facing Pilot Report
Agri-OS must generate a simple report farmers can understand.

Acceptance criteria:
- Show field metadata, timeline, observations, photos, recommendations, approvals/rejections, completed actions, and follow-up outcomes.
- Distinguish observed facts, AI-assisted interpretation, and operator/farmer decisions.
- Remain useful when no multispectral data exists.

### PRD-006 Progressive Delegation
Automation must be enabled gradually by trust level.

Acceptance criteria:
- Delegation levels are visible: `manual`, `assist`, `schedule`, `coordinate`, `autopilot`.
- User can delegate per field or action type.
- User can downgrade delegation immediately.
- Delegation changes are recorded in the timeline/audit log.

### PRD-007 Strategy Mode as Training and Real-World Mirror
Strategy Mode should continue to simulate season operations, but it must also be capable of mirroring real pilot progress.

Acceptance criteria:
- Game/demo fields stay clearly separate from real pilot fields.
- Real pilot fields can opt into a game-like season view without losing real dates, costs, observations, actions, and outcomes.
- Simulation rewards do not replace agronomic evidence.

### PRD-008 Long-Range Autopilot
Agri-OS should eventually coordinate live data, digital twin state, recommendations, approved actions, outcomes, and learning.

Acceptance criteria:
- Data ingestion supports field/source/timestamp/confidence metadata.
- Action lifecycle follows `proposed -> approved -> dispatched -> acknowledged -> completed/failed`.
- Safety policies block unsafe actions.
- Every action is replayable from evidence to decision to outcome.

## Non-Goals For The 2026 Pilot
- Full autonomous farm management.
- Paid imagery-processing dependency.
- Perfect multispectral pipeline.
- Sensor-heavy digital twin as a prerequisite.
- Farmer pitch centered on “AI replaces your decisions.”
- Broad feature expansion before one real pilot workflow works end to end.

## Success Metrics
- 2-5 friendly real pilot plots created in Agri-OS.
- At least one complete field timeline per plot.
- At least one farmer-facing report shown to a real farmer.
- Recommendations include evidence and uncertainty.
- Follow-up outcome recorded after each approved action.
- App builds and the pilot path is demoable without manual code edits.

## Canonical Supporting Docs
- `IMPLEMENTATION_ROADMAP.md`: implementation status and next work.
- `STRATEGY_MODE_PRD_ADDENDUM.md`: detailed Strategy Mode requirements.
- `REAL_FARM_AUTOPILOT_ROADMAP.md`: long-range real-farm autonomy architecture.
- `/Users/macbookpro/agri-os/prd.json`: Ralph execution queue, not the master PRD.
