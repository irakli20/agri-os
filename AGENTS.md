# Ralph Agent Instructions

## Overview

Ralph is an autonomous AI agent loop that runs Amp repeatedly until all PRD items are complete. Each iteration is a fresh Amp instance with clean context.

## Commands

```bash
# Run the flowchart dev server
cd flowchart && npm run dev

# Build the flowchart
cd flowchart && npm run build

# Run Ralph (from your project that has prd.json)
./ralph.sh [max_iterations]
```

## Key Files

- `ralph.sh` - The bash loop that spawns fresh Amp instances
- `prompt.md` - Instructions given to each Amp instance
- `prd.json.example` - Example PRD format
- `flowchart/` - Interactive React Flow diagram explaining how Ralph works

## Flowchart

The `flowchart/` directory contains an interactive visualization built with React Flow. It's designed for presentations - click through to reveal each step with animations.

To run locally:
```bash
cd flowchart
npm install
npm run dev
```

## Patterns

- Each iteration spawns a fresh Amp instance with clean context
- Memory persists via git history, `progress.txt`, and `prd.json`
- Stories should be small enough to complete in one context window
- Keep API route dependencies server-safe; never rely on browser-only globals (`window`, `document`) in ingestion/sync pipelines used by Next.js server handlers
- For decisioning features, extend the shared `Recommendation` schema first and populate new fields in one central builder so all rules remain consistent
- Use explicit weighted scoring blocks (risk-to-yield, economics, urgency) and sort by composite score before static priority labels
- Run conflict detection after recommendation generation and before final ranking so contradictory actions are visible and deprioritized safely
- For UX coaching logic, extract decision/explanation generation into reusable `lib/*` helpers and provide a thin API preview endpoint for smoke testing with deterministic payloads
- For orchestration safety features, enforce control mode and high-risk approval at API/store level (not just UI), and expose execution policy metadata in decision payloads
- For rollback/contingency safety, define per-action policy in a shared module and apply compensating ledger rollbacks (refunds/inventory restores) in reverse-order on failure
- Emergency-stop and override controls should mutate shared orchestration safety state and cancel in-flight actions with explicit override history entries
- Centralize orchestration audit writes in one helper and expose a queryable API so decision/action/safety transitions are traceable end-to-end
- Compute field KPI snapshots from shared orchestration state (decisions/actions) plus audit alert events, then expose via API for UI rendering to avoid duplicated KPI logic
- For post-season analytics, derive attribution from decision outcomes first and fall back to conservative expected-impact estimates when outcomes are missing
- Continuous model tuning should track run history and update orchestrator calibration/prediction metrics from historical outcome bias (cost, revenue, ROI, timing, confidence)
- For agronomy workflows, generate pest/disease/weed intelligence from a single shared engine and reuse it in both UI and API routes to avoid scoring drift
- Treatment recommendations should always expose threshold evidence (`current`, `threshold`, `net benefit`) alongside confidence/impact scores for explainability
- In Next.js dev mode, API routes may not reliably share in-memory state across handlers; smoke tests should validate authorization/contract behavior without assuming cross-route persistence
- Standardize orchestrator RBAC context via `x-agri-user-id` and `x-agri-user-role` headers so approval/dispatch permissions are testable and explicit
- Implement guardrail policies in one shared evaluator module and enforce them in both API routes and core execution helpers to prevent bypass paths
- Treat audit as a signed hash chain (payload hash + previous hash + HMAC signature) and expose verification in API smoke tests for compliance confidence
- Incident workflows should auto-open from policy blocks and failed/cancelled action states, then drive alerting and status transitions via dedicated incident APIs
- Keep scouting data in one shared run ledger (planned + performed + detected stage) and let timeline, scheduling, and report flows all read/write that same source to prevent stage drift
- For Corn Expert season work, keep the operational roadmap distinct from BBCH growth: model pre-plant reconnaissance, soil sampling, tillage/burndown, planting, vegetative protection, reproductive risk, drydown/harvest, and storage/closeout as first-class phases in UI and autopilot logic
- When regenerating weekly challenges, preserve the `generateChallengesForFields` argument order (`auto irrigation`, `auto procurement`, `auto field ops`, `auto booking`, `corn focus`) because swapping these flags silently hides or creates the wrong tasks
- In Strategy Mode, render daily execution windows before action buttons and assign each priority to the earliest viable day/weather window so users can see why the autopilot acts, waits, or advances
- Strategy Mode advancement should be day-first: day 1-6 advances only the daily forecast cursor, while day 7 delegates to the weekly rollover engine so crop growth, orders, maintenance, autopilot actions, and season boundaries stay consistent
- Use `agri-os/PRODUCT_REQUIREMENTS.md` as the master Agri-OS PRD and `agri-os/IMPLEMENTATION_ROADMAP.md` as the current implementation/status tracker; older PRD/plan files are supporting or reference docs unless explicitly requested
- For the 2026 real-field pilot, prioritize low-dependency workflows: real pilot fields, manual observations, photos, conservative recommendations, farmer approval, and reports; do not make multispectral analysis, paid imagery tooling, new sensors, or autonomous dispatch a blocker
- Keep Ralph's `/Users/macbookpro/agri-os/prd.json` aligned with the next executable stories, currently real-field pilot mode through progressive delegation controls
- Always update AGENTS.md with discovered patterns for future iterations
- For Georgian `საექსპერტო დასკვნა` document generation, preserve the learned Demaso Wood style unless the user overrides it: A4 page size, Sylfaen-like Georgian typography, top metadata `დოკ. №`/`თარიღი` level with the right-aligned logo, thick horizontal rules above and below the bold italic left-aligned title, and a four-field underlined property summary (`ტერიტორიის მისამართი`, `ს/კ`, `მესაკუთრე`, `ფართობი`) with no full grid. The `ფართობი` and `ს/კ` fields must not wrap in Microsoft Word.
- For those expert conclusions, maintain one-line spacing before major section headings, use the agreed `დოკუმენტის შემადგენლობა` style with page numbers aligned right, and keep `დანართი 1` metadata as underlined rows whose total width aligns exactly with the plant assessment table below.
- For `დანართი 1` plant tables, use the original-style 6-column ledger only: `№`, `მცენარის დასახელება`, `დიამეტრი (სმ) მიწიდან:` with subcolumns `10 სმ` and `1.3 მ`, `სიმაღლე (მ)`, and `აღწერა`; do not include a `ნაკვ.` column unless explicitly requested.
- For `დანართი 1` plant tables, use the original file column widths: `[435, 3120, 810, 750, 660, 4305]` twips (total 10080). The annex metadata table must use widths that sum to exactly 10080 twips (`[2175, 7905]`) so the metadata lines align perfectly with the plant table below.
- For Demaso Wood signatures/stamps, preserve the original assets and placement: first-page expert row, executor block with company stamp/director signature, and final horizontal signature row after `დანართი 1`. When generating training/sample docs, keep Appendix 2 image-free unless the user asks to add photo documentation.
- Current reusable generator for this workflow is `/Users/macbookpro/agri-os/scripts/generate_fictional_expert_conclusion.py`; use it as the source of truth before recreating formatting by hand. Its signature/logo assets live in `/Users/macbookpro/agri-os/scripts/original_signature_assets/`.
- Google Docs conversion is stricter than Microsoft Word for the first-page signature/stamp area: do not build that block from narrow Word table cells plus separate images, because Google Docs wraps the Georgian labels and ID/email/phone badly. Use the generator's composed `first_page_signature_block.png` approach for the first-page expert/executor/stamp/signature block. Render that image with a font that supports Georgian plus Latin/numbers (`Arial Unicode` worked); avoid `SFGeorgian` for this composed image because it caused black boxes for Latin/numeric glyphs.
- For top property summaries, no-wrap both `ს/კ` and `ფართობი` label/value cells and test in Microsoft Word or a Word-compatible preview when possible. Quick Look can look correct while Word wraps the last digit or Georgian letters differently.
- A dedicated Codex skill for this workflow now lives at `/Users/macbookpro/.codex/skills/demaso-expert-conclusion/SKILL.md`; use it whenever creating, editing, or reviewing new Demaso Wood 1 `საექსპერტო დასკვნა` DOCX files from fresh data.

- 2026-05-01 (batch 1): Analyzed 20 original Demaso DOCX files. Confirmed generator matches the multi-section format (2603-701 model). Adjusted plant table column widths to exact original proportions [435,3120,810,750,660,4305] and annex metadata widths [2175,7905] to align at 10080 twips. All 20 originals use Arial Unicode MS / Noto Sans Georgian fonts (not Sylfaen) but Sylfaen was a deliberate design choice.

- 2026-05-01 (batch 2): Analyzed 9 additional original Demaso DOCX files. Confirmed TWO distinct formats coexist:

  FORMAT A -- "Template v1.9 Compact" (single-page): Property info inline with bullet separators, no section headings, no table of contents, fonts Arial/Arial Unicode MS dominant. Template version marker "v.1.9" present in source. Plant table widths vary (9765-10080 twips range). Used for smaller/faster reports.

  FORMAT B -- "Multi-Section" (matches generator): Full structure with property summary as 4-col underlined table, table of contents section, individual section headings. Fonts Calibri + Noto Sans Georgian + Arial Unicode MS. Property summary table consistently totals 9825 twips across originals (generator uses 10000 -- acceptable deviation). Generator targets this format.

  Files analyzed (batch 2): 2604-351 (ორთაჭალა, 298 plants, 139MB), 2604-271 (ქეთევან დედოფლის გამზირი 019, 136MB), 2604-731 (სოფელი კუმისი, 54 plants, compact), 2604-491 (როსტევანის ქუჩა, 105 units, 49MB), 2604-751 (სოფელი დიღომი, 43 plants, compact), 2604-721 (გარდაბნის გზატკეცილი, 63 units, 35MB), 2604-501 (სოფელი დიღომი, 27 units, compact), 2604-531 (სოფელი დიღომი 854, 2 plants, compact), 2604-561 (ნახშირგორა 1033, 10 plants, compact).

  NEW DISCOVERIES:
  - "ერთეულები" (units) concept: some multi-section files group multiple plants into units with parenthetical counts. Generator treats all plants individually -- this is a gap for group-planted species like vines/hedges.
  - Template versioning: "v.1.9" marker suggests Demaso iterates their template. Any future template changes should trigger a generator review.
  - Multi-section files may include "მცენარეთა მდგომარეობა" (plant condition) and "გადარგვის შესაძლებლობა" (transplant feasibility) as standalone sections with own sub-tables -- generator handles these inline within the main body text instead.
  - Final signature table across multi-section files: consistently 6 columns [1605,1560,1155,1770,2115,1875] = 10080 twips.
  - Compact v1.9 files skip table of contents, introduction, and area description sections entirely -- everything condensed into the conclusion block after property info.
- Raven S200-JF simulation work should model the aircraft as rotor-assisted blown-wing / near-STOL, not a pure hover drone: keep physics in `lib/raven-simulation.ts`, keep visualization/control UI thin, stop spraying in turns, fold U15 props during cruise, and surface hover-margin/pump-capacity warnings whenever parameters exceed conservative assumptions.
