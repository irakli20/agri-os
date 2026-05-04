# Agri-OS Implementation Roadmap

Version: 1.0
Updated: 2026-04-30
Status: Canonical implementation plan and status tracker

## Current App Reality
Agri-OS is a strong prototype/MVP codebase with substantial implemented surfaces:
- farm dashboard and app shell,
- fields and field detail workflows,
- scouting modals and image upload flows,
- field problem SVG overlays,
- Strategy Mode season simulation,
- marketplace/services/supplies flows,
- corn-specific strategy logic,
- orchestrator APIs and UI panels,
- digital twin and sensor API scaffolding,
- audit/incidents/review/model-tuning modules.

The app is not yet a production real-farm autopilot. The main risk is not lack of ideas; it is scattered authority, prototype persistence, mock/demo data, and several competing “brain” modules.

## Planning Source Of Truth

| File | Role | Status |
| --- | --- | --- |
| `PRODUCT_REQUIREMENTS.md` | Master product requirements and staged vision | Canonical |
| `IMPLEMENTATION_ROADMAP.md` | Current status, gaps, and execution order | Canonical |
| `STRATEGY_MODE_PRD_ADDENDUM.md` | Detailed Strategy Mode/gameplay requirements | Supporting |
| `REAL_FARM_AUTOPILOT_ROADMAP.md` | Long-range autonomy architecture | Supporting |
| `ARCHITECTURE_AUDIT_2026-04-05.md` | Architecture assessment and authority model | Reference |
| `AGRICULTURAL_INTELLIGENCE_FEATURES.md` | Historical feature checklist; optimistic status | Reference |
| `IMPLEMENTATION_PLAN_2026-04-05.md` | Earlier implementation plan | Reference, superseded |
| `additional prd.md` | DroneLogbook reference PRD | Reference/archive |
| `/Users/macbookpro/agri-os/prd.json` | Ralph agent execution queue | Operational queue |
| `/Users/macbookpro/agri-os/progress.txt` | Ralph historical progress log | Historical status |

## Implemented Or Substantially Present

### Product and UI
- Main Next.js app shell, dashboard, navigation, cards, and operational pages.
- Field list/detail pages with boundary editing, imagery surfaces, scouting actions, and harvest logging.
- Marketplace, supplies, services, inventory, procurement, finance, weather, crops, review, and runbook surfaces.
- README and project setup docs.

### Scouting and Image Intelligence
- Image upload types and modal.
- Mock image identification results.
- Quick scout modal with GPS capture.
- Scouting history modal.
- Scouting schedules/reports and local scouting storage.

### Strategy Mode
- Weekly planner, weekly turn advancement, priorities, XP/reputation, season reset, fast-forward/test funds.
- Crop-stage operations from scouting/soil testing through harvest.
- Corn Expert Mode and growth timeline.
- Weather windows, operator capacity, fuel, maintenance, service fallbacks, fertilizer/chemical loops.
- Season activity log and stage-aware challenge generation.

### Field Problem Overlays
- SVG heatmap overlays for pest, disease, weed, nutrient, and drought pressure.
- Overlay activation from weekly challenges and field status signals.
- Overlay rendering over existing field imagery.

### Orchestrator And Safety Scaffolding
- Orchestrator status/mode APIs and UI control panel.
- Decision queue concepts with confidence, ROI, evidence, and approvals.
- Action lifecycle modules and policy guardrails.
- Audit, incident, KPI, season review, model tuning, and economic benchmark modules.
- RBAC header pattern for testing approval/dispatch permissions.

### Digital Twin Scaffolding
- Sensor ingestion route and sensor ingress helper.
- Twin sync route and intelligence pipeline.
- State envelopes with source/timestamp/confidence concepts.
- Replay/reconciliation concepts.

## Partially Implemented / Needs Hardening

### Real-Farm Pilot Workflow
- Missing a clear “real pilot field” mode separate from demo/game.
- Existing scouting can log observations, but it is not yet a full pilot timeline with farmer/contact, approval states, and outcomes.
- No farmer-facing report that cleanly distinguishes facts, AI interpretation, and human decisions.

### LLM Orchestrator
- AI SDK dependencies exist, but there is no canonical LLM advisor workflow for real-field context.
- Current recommendation logic is mostly deterministic/prototype, with some mock/demo UI data.
- Prompt context and response summaries are not yet first-class audit records.

### Persistence
- Many workflows rely on localStorage, in-memory route state, mock data, or project JSON files.
- This is acceptable for a pilot demo, but not for real multi-user production.

### Authority Boundaries
- Decision/orchestration logic is split across:
  - `lib/orchestrator.ts`
  - `lib/orchestrator/decisions.ts`
  - `lib/orchestrator/actions.ts`
  - `lib/autopilot-engine.ts`
  - `lib/game-store.ts`
- This must be consolidated before serious autonomy.

### Type Safety
- Some core files still use `@ts-nocheck`.
- Domain types need a clearer authoritative home before broad real-farm workflow work.

### Repo Hygiene
- `.next_stale_*`, nested backups, and local generated files create status noise.
- Avoid destructive cleanup unless explicitly requested; keep ignoring unrelated generated churn.

## Not Implemented Yet
- Real-field pilot field type and UI path.
- Pilot observation model with source/confidence/outcome fields.
- Recommendation record model for pilot decisions.
- Farmer-facing pilot report.
- LLM advisor endpoint/helper with auditable context.
- Progressive delegation controls tied to field/action type.
- Production persistence, authentication, organization/user model, and cloud storage.
- Real sensor/weather/drone processing integrations.
- Robust multispectral workflow and analysis pipeline.

## Next 10-Day Execution Plan

### Day 1: Stabilize And Define Pilot Path
- Run build/lint/smoke where feasible.
- Identify one clean navigation path for a real-field pilot.
- Decide where pilot fields live in UI.
- Add or refine types for pilot fields, observations, recommendations, and outcomes.

### Day 2-3: Real-Field Pilot Mode
- Add real pilot field metadata.
- Separate pilot/demo/game labels in UI and state.
- Seed 2-3 realistic Georgian corn/spray customer pilot examples.

### Day 4-5: Observation Timeline
- Build or extend observation logging with manual notes, photos, crop stage, severity, weather context, confidence, and source.
- Render a field timeline that combines observations, recommendations, decisions, actions, and outcomes.

### Day 6: Recommendation Records
- Add conservative recommendation records.
- Include evidence, missing data, uncertainty, expected cost/benefit, urgency, next check date, and approval state.
- Block high-risk action states behind human approval.

### Day 7: LLM Advisor
- Add an advisor helper/API that takes structured pilot context and returns summary, missing-data questions, action options, and farmer-friendly explanation.
- Store prompt context and response summary for audit.
- Keep deterministic guardrails in charge of risky actions.

### Day 8: Farmer Report
- Build a simple report view for one field.
- Include timeline, photos, recommendations, approvals/rejections, completed actions, and follow-up outcomes.
- Make the report useful without multispectral data.

### Day 9: Demo Polish
- Polish the end-to-end pilot path.
- Add realistic sample data.
- Hide or de-emphasize broken/unfinished surfaces from the pilot path.

### Day 10: Field Test Package
- Capture screenshots/video.
- Prepare a farmer conversation script.
- Create a pilot checklist for field data collection.
- Verify build and smoke tests.

## Implementation Phases After 10 Days

### Phase 1: Pilot Validation
- Use 2-5 friendly plots.
- Collect observations and farmer feedback weekly.
- Record every recommendation outcome.
- Keep the farmer pitch practical: monitoring, reports, and better-timed decisions.

### Phase 2: Assisted Autopilot
- Add reminders and scheduled scouting/spray windows.
- Improve cost/ROI framing.
- Add more crop-stage-specific templates.
- Introduce agronomist review hooks.

### Phase 3: Delegated Logistics
- Let farmers delegate bounded tasks.
- Prepare service/input actions for approval.
- Add provider lead time, reliability, and SLA depth.
- Move critical data to production persistence.

### Phase 4: Bounded Autopilot
- Enforce formal policies, approvals, rollback plans, audit verification, and emergency stop.
- Integrate real weather stations, soil probes, drone processing, work orders, and controllers only after the manual workflow is trusted.

### Phase 5: Real-World Strategy Game
- Let real fields mirror into Strategy Mode.
- Add game mechanics around workflow quality, timeliness, learning, risk, and actual outcome reporting.
- Keep real revenue, estimated revenue, and simulation rewards clearly separate.

## Ralph Queue Alignment
The Ralph queue currently has `US-001` through `US-014` complete and `US-015` through `US-020` pending:
- `US-015`: Real-Field Pilot Mode
- `US-016`: Pilot observation logging
- `US-017`: Conservative recommendation records
- `US-018`: LLM advisor workflow
- `US-019`: Farmer-facing pilot report
- `US-020`: Progressive delegation controls

Future Ralph runs should work through those stories in order unless the build is broken.

## Build And Quality Standard
- Keep the app buildable.
- Prefer one reliable pilot workflow over five new surfaces.
- Do not make multispectral analysis a blocker.
- Keep recommendations conservative and auditable.
- Use human approval for all high-risk real-world actions.
- Update `PRODUCT_REQUIREMENTS.md`, `IMPLEMENTATION_ROADMAP.md`, and `AGENTS.md` when product patterns change.
