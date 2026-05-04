PRD — DroneLogbook

> Reference/archive status: this is a DroneLogbook research/reference PRD, not the Agri-OS master PRD. Use `PRODUCT_REQUIREMENTS.md` for Agri-OS product requirements.
Product: DroneLogbook — Drone Operations Compliance & Fleet Management SaaS Source
Document type: Polished PRD with Functional Requirements (FR-###), User Stories, Acceptance Criteria, and Traceability Matrix
Version: 1.0
Prepared: 2026-01-19 (UTC)
Primary sources used (exact pages):

Homepage
Features
Solutions
Pricing
Integrations Hub
FAQ
Terms of Service
API Docs (Swagger)
Key UI/media references (for PRD illustration):

Web dashboard preview image: https://www.dronelogbook.com/hp/1/img-min/macbook-dashboard.png
Mobile companion app preview image: https://www.dronelogbook.com/hp/1/img-min/mobileApp3.png
DLB Sync app preview image: https://www.dronelogbook.com/hp/1/img-min/mobileDlbsync.png
1) Executive Summary
DroneLogbook is a cloud + mobile platform for mission planning, flight logging (telemetry + non‑telemetry), compliance reporting, fleet maintenance/inspection scheduling, personnel currency tracking, documentation management, and integrations for automated flight log ingestion. It emphasizes automation of log importing and reporting across regulatory regimes (e.g., FAA/CAA/CASA/EASA, etc.) and supports a wide range of integration levels (Auto‑Sync, Cloud‑Sync, DLB‑Sync, Manual importers). Source Source

2) Goals & Success Metrics
2.1 Goals
Reduce compliance workload by enabling fast, repeatable compliance reporting and standardized records. Source
Enable end‑to‑end operational management: plan → approve → execute → log → maintain → report. Source
Support diverse fleets via broad ingestion support (“more than 80 log types” referenced). Source
2.2 Primary Success Metrics (KPIs)
Import coverage: % flights captured via Auto/Cloud/DLB sync vs manual entry. Source
Compliance throughput: median time to generate a compliant PDF report per authority template. Source
Maintenance effectiveness: reduction in overdue inspections; % drones flagged non‑operational due to overdue inspection (where enabled). Source
Ops quality: checklist completion rate + validation score (where applicable). Source
3) Personas & Core Jobs-to-be-Done
3.1 Personas
Remote Pilot / Operator: log flights, attach docs, complete checklists, report incidents. Source
Ops Manager: plan missions, assign personnel/equipment, manage approvals and schedule. Source
Maintenance Tech: track inspections, components, serials, lifespans, replacements, follow-ups. Source
Compliance/Safety Officer: generate legal reports, run audits, track document expiration. Source
Enterprise Admin: multi‑org oversight, audit trails, branding, notifications. Source
4) Scope (In / Out)
4.1 In Scope
Web app: Flights, Missions, Documents, Reporting, Fleet, Maintenance/Inspections, Personnel, Notifications, Multi‑org, Audit trail, Exports, API access. Source
Mobile: offline access/sync; airspace/weather/solar index; DLB‑Sync uploader. Source
Integrations hub: Auto‑Sync, Cloud‑Sync, DLB‑Sync compatible apps, Manual importers. Source
4.2 Out of Scope (for this PRD)
Flight control / autopilot / mission execution software (DroneLogbook is a management/logging platform).
Third‑party regulatory filing submission systems.
5) Product Overview (Modules)
5.1 Modules
Flight Logging & Import (telemetry + non‑telemetry, GPS trace, 3D playback, export tracks). Source
Mission Planning & Operations Calendar (airspace status, assignments, approvals, sharing, mission requests). Source Source
Compliance & Reporting (PDF branded reports, authority templates, custom reports, exports). Source
Documentation & Forms (document library, checklists, risk assessments, custom forms). Source Source
Fleet (drones, equipment, batteries, components; drone profiles). Source Source
Inspections & Maintenance (schedules, triggers, technician assignment, follow-ups, notifications). Source
Personnel (currency, docs, skills/capabilities tracking). Source
Notifications & Messaging (rule-driven alerts; templates). Source
Multi‑Org + Audit Trail + Branding. Source
API Data Access. Source Source
6) Assumptions, Constraints, and Open Questions
6.1 Assumptions (from public pages)
Flight logging can be done via telemetry import or “non‑telemetry flight logging”. Source
Inspection schedules can update automatically when flights are entered/imported. Source
Some features appear tiered by subscription plan (standard → private label). Source
6.2 Constraints
Public pages do not expose full UI field schemas, permission matrices, or workflow state diagrams (these must be validated with an authenticated product walkthrough).
6.3 Open Questions (must be validated in product)
RBAC: roles, permissions, and who can approve missions/edit templates/audit.
Notification channels (email vs in-app vs push) and escalation.
Approval workflow states and configurable steps.
Form builder: field types, conditional logic, scoring rules definition.
7) Functional Requirements (FR-###) + User Stories + Acceptance Criteria
7.1 Flight Logging & Import (FR-100 series)
Context: DroneLogbook supports importing logs, auto-filling flight data, GPS trace, 3D playback, and track exports; supports many manufacturers; and multiple integration levels. Source Source

FR-101 — Import telemetry logs (manual upload)
Requirement: Users can upload supported telemetry log files and import them into the system. Support is described as “more than 80 log types” (marketing claim). Source
User story: As a pilot, I want to upload a flight log file so that my flight record is created automatically.
Acceptance criteria:

Given a supported log file, when the user uploads it, then a new flight record is created (or an existing one is updated per dedupe rules).
Imported flight record contains populated flight attributes (at minimum: time/duration and location path if available in telemetry).
Import result indicates success/failure with actionable error message.
FR-102 — Non-telemetry flight logging (manual entry)
Requirement: Users can create flight records without telemetry (“non‑telemetry flight logging”). Source
User story: As a pilot, I want to manually enter a flight when no telemetry is available so that my logbook remains complete.
Acceptance criteria:

User can create a flight with required fields (exact list TBD; must be defined in product).
Flight appears in reporting and calendar views.
FR-103 — Auto-fill flight data from imports
Requirement: Imported logs auto-fill flight data. Source
User story: As a compliance officer, I want imported flights to be standardized and complete so that reports generate consistently.
Acceptance criteria:

Imported flight shows auto-populated values and identifies import source.
User can edit fields post-import (unless restricted).
FR-104 — Visualize GPS trace + 3D playback
Requirement: View GPS trace and “play back in 3D”; “3D View Replay”. Source Source
User story: As an ops manager, I want to replay a flight to review compliance and investigate incidents.
Acceptance criteria:

Flight detail view provides an interactive path view (2D) when GPS exists.
“Replay” view available for telemetry flights with adequate data.
FR-105 — Export flight track (KML + IGC)
Requirement: Export flight tracks as Google Earth KML and IGC. Source
User story: As a pilot, I want to export a track to share with stakeholders or other tools.
Acceptance criteria:

For eligible flights, user can download KML and IGC files.
Export matches the stored path and timestamps (within tolerance).
FR-106 — Large telemetry log import (>1GB)
Requirement: Ability to upload/import large telemetry logs (>1GB). Source
User story: As an enterprise user, I want to import very large logs so I can consolidate operations into a single system.
Acceptance criteria:

System accepts a log file greater than 1GB (where plan allows).
Import runs asynchronously with progress/status and completion notification.
FR-107 — Integration levels: Auto-Sync / Cloud-Sync / DLB-Sync / Manual
Requirement: System supports multiple integration levels described on Integration Hub. Source
User story: As an admin, I want to connect my drone ecosystem so that flights import automatically with minimal effort.
Acceptance criteria:

Admin can view supported integration categories (Auto‑Sync, Cloud‑Sync, DLB‑Sync, Manual).
For Auto‑Sync/Cloud‑Sync integrations, user can authorize and see sync status.
For DLB‑Sync, user can see instructions/compatibility list.
7.2 Mission Planning & Operations Calendar (FR-200 series)
Context: Mission planning includes personnel/equipment assignment, airspace status checking, calendar, and external sharing/mission request. Source Source

FR-201 — Create and manage missions
Requirement: Users can plan missions and attach necessary details and documentation. Source
User story: As an ops manager, I want to create a mission so that the team has a single source of truth for execution.
Acceptance criteria:

User can create a mission with title/date/time/location area (exact field list TBD).
Mission can be saved as draft and updated.
FR-202 — Assign personnel and equipment to missions
Requirement: Mission planning supports assigning personnel and equipment. Source
User story: As an ops manager, I want to assign qualified people and the right equipment so that operations are efficient and compliant.
Acceptance criteria:

Mission can include assigned personnel (with roles) and equipment/drone assets.
Assignments appear in mission detail and calendar view.
FR-203 — Draw flight areas and check airspace safety status
Requirement: “Draw Flight Areas and Check Airspace Safety Status” with dynamic controlled airspace safety info. Source
User story: As a pilot, I want to see airspace safety status when planning so that I avoid restricted areas.
Acceptance criteria:

Map UI allows drawing a mission area.
System returns an airspace status indicator for the drawn area (data source TBD).
FR-204 — Mission approval workflow
Requirement: “Send missions for approval”. Source
User story: As a compliance officer, I want missions to be approved before execution so that we enforce governance.
Acceptance criteria:

Mission can be submitted for approval.
Approver can approve/reject with comment.
Approval status is visible and auditable (audit trail tie-in FR-802).
FR-205 — Operations calendar (year/month/week/day)
Requirement: Calendar view for flights and planned missions. Source
User story: As an ops manager, I want a calendar view so that I can coordinate resources across the week.
Acceptance criteria:

Calendar view supports year/month/week/day.
Displays past flights and future planned missions.
FR-206 — External sharing via PIN-protected link
Requirement: Share mission details and ops calendar via PIN-protected link. Source
User story: As an ops manager, I want to share mission info with external stakeholders without giving them accounts.
Acceptance criteria:

System generates a shareable link protected by a PIN.
External viewer can access only permitted mission/calendar info.
Link can be revoked/rotated (implementation requirement).
FR-207 — External mission request (PIN-protected)
Requirement: External person can access PIN-protected form to request new mission. Source
User story: As a customer, I want to request a mission via a secure form so that the operator can schedule work.
Acceptance criteria:

External user can submit a mission request using a PIN-protected form.
Request is created as a new mission draft or request record for internal review.
7.3 Compliance & Reporting (FR-300 series)
Context: DroneLogbook generates compliance reports for multiple authorities and custom reports; outputs PDF and exports CSV. Source Source

FR-301 — Generate authority compliance reports
Requirement: Generate compliance reports for agencies (FAA, CAA, CASA, etc.). Source
User story: As a compliance officer, I want to generate a compliance report quickly so that I can respond to audits on demand.
Acceptance criteria:

User can select an authority template and a date range/filters (fields TBD).
System produces a downloadable report (PDF at minimum).
FR-302 — Branded PDF reporting
Requirement: PDF reports branded with organization logo/info. Source
User story: As an org admin, I want reports branded so that they look official and consistent.
Acceptance criteria:

Admin can configure organization name/logo.
Generated PDFs include branding elements.
FR-303 — Custom reporting across operational domains
Requirement: Custom reports for pilots, flights, maintenance, inventory, etc. Source
User story: As an ops manager, I want custom operational reports so that I can measure utilization and safety.
Acceptance criteria:

User can generate at least one custom report type (list TBD).
Report can be exported (PDF/CSV depending on plan).
FR-304 — Custom Report Template Engine (drag/drop)
Requirement: Create custom report layouts by drag‑dropping dataset snippets. Source
User story: As an enterprise admin, I want a report builder so that I can standardize internal reporting.
Acceptance criteria:

User can create a template using selectable data blocks.
Template can be saved and reused.
Output can be generated as PDF/CSV.
FR-305 — Data export (CSV)
Requirement: Export flights, equipment, battery, incident, and pilot 90‑day currency (CSV). Source
User story: As an analyst, I want CSV exports so that I can do downstream BI analysis.
Acceptance criteria:

User can export specified datasets to CSV.
Exports reflect applied filters/date ranges.
7.4 Documentation, Checklists, Custom Forms (FR-400 series)
Context: Digital document library, custom checklists/risk assessments, attach docs to flights, and custom digital forms + validation scoring. Source Source

FR-401 — Document library for org and flight documents
Requirement: Store/manage operations documents; upload hard copies. Source
User story: As a compliance officer, I want a central document library so that audits are easy.
Acceptance criteria:

Users can upload and categorize documents.
Documents can be linked/attached to flights/missions.
FR-402 — Attach pre- and post-flight documentation to flights
Requirement: Attach pre/post-flight documentation to flights. Source
User story: As a pilot, I want to attach completed documents to a flight so that the record is defensible.
Acceptance criteria:

Flight record supports document attachments.
Attachments are retrievable in reports/audits.
FR-403 — Custom checklists and risk assessments
Requirement: Create custom checklist and risk assessment forms. Source
User story: As a safety manager, I want standardized checklists so that operations follow SOP.
Acceptance criteria:

Admin can create checklist templates (fields TBD).
Missions/flights can require a checklist completion step.
FR-404 — Preflight forms templates
Requirement: Support preflight forms (examples include risk assessment, photo/video release, authorization, plan of activity). Source
User story: As an ops manager, I want standardized preflight forms so that approvals are consistent.
Acceptance criteria:

System provides preflight form templates or template creation capability.
Completed forms are stored with missions/flights.
FR-405 — Custom digital forms attachable to multiple entities
Requirement: Create custom digital forms and attach them to flight/mission/project/drone/etc. Source
User story: As an admin, I want custom forms to match our internal workflow.
Acceptance criteria:

Form templates can be created and assigned to one or more entity types.
Filled forms are linked to the target entity record.
FR-406 — Checklist validation rules + validation score
Requirement: Add validation rules and compute validation score for mission checklists. Source
User story: As a safety manager, I want checklist scoring so that I can measure compliance quality.
Acceptance criteria:

Admin can define validation rules per checklist template.
System displays completion status and a computed validation score.
7.5 Fleet, Equipment, Batteries, Drone Profiles (FR-500 series)
Context: Manage drone fleet, equipment flying time, batteries cycles and DJI battery health metrics, and drone profiles for presets. Source Source

FR-501 — Manage drone inventory
Requirement: Maintain drone records as assets used in flights and maintenance schedules. Source
User story: As an ops manager, I want an accurate fleet inventory so that assignment and compliance are reliable.
Acceptance criteria:

Admin can create/update drone records.
Drone can be linked to flights/missions and maintenance schedules.
FR-502 — Drone Profile presets (brand/model defaults + inspections config)
Requirement: Create a drone profile to preset new drones with defaults and scheduled inspections configuration. Source
User story: As a fleet admin, I want presets so that adding drones is fast and consistent.
Acceptance criteria:

Admin can define a profile tied to brand/model with default fields.
When creating a drone from a profile, defaults are applied including inspections schedule settings.
FR-503 — Manage equipment + flying time + maintenance
Requirement: Track equipment flying time and maintenance. Source
User story: As a maintenance tech, I want to track payload equipment usage so that servicing is timely.
Acceptance criteria:

Equipment items can be created and attached to flights.
System calculates time/usage metrics and supports maintenance records.
FR-504 — Battery cycles / charges tracking
Requirement: Add battery charges, check battery performance, control battery health over time. Source
User story: As a pilot, I want battery health tracked so that I avoid unsafe batteries.
Acceptance criteria:

Batteries can be managed as assets and linked to flights.
System records charge cycles/events and surfaces health indicators.
FR-505 — DJI battery health metrics from imported logs
Requirement: Display battery life, initial capacity, max temperature, efficiency (DJI battery health). Source
User story: As a fleet manager, I want telemetry-derived battery metrics so that I can detect deterioration early.
Acceptance criteria:

When DJI telemetry logs include battery metrics, system stores and displays them over time.
7.6 Inspections & Maintenance (FR-600 series)
Context: Inspection schedules, notifications, part serial/lifespan/replacement history, and maintenance follow-ups; schedules can trigger by flights/hours/days. Source

FR-601 — Create inspection schedules based on flights/hours/days
Requirement: Inspection schedules can be based on flights, hours, or days (2 of 3 on one schedule). Source
User story: As a maintenance tech, I want flexible triggers so that manufacturer and policy schedules can be modeled.
Acceptance criteria:

User can create an inspection schedule with defined trigger types and thresholds.
System calculates next due status.
FR-602 — Track parts serials, lifespan, and replacement history
Requirement: Track part serial number, lifespan, replacement history; add serial numbers to components. Source Source
User story: As a maintenance tech, I want serial-level tracking so that audits and safety investigations are accurate.
Acceptance criteria:

Components can store serial number and lifecycle limits.
Replacement actions create history entries.
FR-603 — Assign maintenance technician
Requirement: Maintenance can assign a technician. Source
User story: As a maintenance manager, I want assignments so that work is accountable.
Acceptance criteria:

Work items/schedules can be assigned to a technician user.
Assigned user can view their queue (view TBD).
FR-604 — Maintenance follow-up independent of inspection schedule
Requirement: Follow-up actions can be triggered independent of inspection schedule (example: tighten screws after X flights). Source
User story: As a maintenance tech, I want follow-up tasks so that corrective maintenance is verified.
Acceptance criteria:

User can define follow-up tasks with triggers.
System notifies when follow-up becomes due.
FR-605 — Auto-update inspections based on flights
Requirement: Inspections/maintenance modules automatically updated with each flight entered; immediate update for automated importers. Source
User story: As an ops manager, I want maintenance status to update automatically so that I don’t accidentally dispatch overdue drones.
Acceptance criteria:

After a flight is logged, system updates schedule counters and due states.
Near-real-time updates occur after import completion.
FR-606 — Overdue inspection handling (optional automation)
Requirement: Optional: flag flights where a drone is overdue; optional: move drone to maintenance/non-operational if overdue. Source
User story: As a compliance officer, I want enforcement so that overdue drones are not used.
Acceptance criteria:

Admin can enable/disable overdue enforcement.
If enabled: system flags flights and/or changes drone operational status.
7.7 Personnel & Currency (FR-700 series)
Context: Manage pilot currency, documents, personnel dashboard, skills/capabilities tracking and comparison. Source

FR-701 — Personnel dashboard and currency tracking
Requirement: Provide personnel dashboard; manage and monitor pilot currency. Source
User story: As an ops manager, I want to see pilot currency so that I assign only qualified personnel.
Acceptance criteria:

System tracks currency metrics (definition TBD) per pilot.
Dashboard surfaces currency state and warnings.
FR-702 — Store and track pilot/organization documents
Requirement: Store and track documents (pilot, organization). Source
User story: As a compliance officer, I want pilot docs tracked so that expired certifications are caught.
Acceptance criteria:

Upload and store pilot docs with expiration metadata.
Document expiration triggers notifications (see FR-901).
FR-703 — Skills and capabilities profiling (predefined + custom)
Requirement: Advanced personnel profiling with skills/capabilities; predefined skills + custom. Source Source
User story: As an ops manager, I want to filter pilots by skills so that mission requirements are met.
Acceptance criteria:

System provides predefined skill categories and allows custom skills.
Mission assignment UI can reference skills (implementation detail).
FR-704 — Compare skills across organization
Requirement: Compare skills and find the right pilot for a mission. Source
User story: As an ops manager, I want a comparison view so that I can quickly staff missions.
Acceptance criteria:

Provide a comparison UI/report that lists pilots vs skills/currency.
7.8 Incidents (FR-750 series)
FR-751 — Incident reporting linked to assets and personnel
Requirement: Report flight incidents; track pilots and drone/equipment involved; report incident to compliance service. Source
User story: As a pilot, I want to record an incident so that the organization can respond and document compliance.
Acceptance criteria:

Incident record can link to flight, pilot(s), drone, and equipment.
Incident appears in incident reporting outputs.
7.9 Multi-Org, Audit Trail, Branding (FR-800 series)
Context: Multi-org consolidated dashboard/reporting, audit trail across orgs, branding, private label capabilities. Source Source

FR-801 — Manage multiple organizations with consolidated reporting
Requirement: Multiple orgs consolidated dashboard/reporting; share documents/checklists/inventory/projects across orgs. Source
User story: As an enterprise admin, I want multi-org oversight so that I can govern distributed operations.
Acceptance criteria:

Admin can view multiple orgs under a parent.
Reports can be generated across orgs (where allowed).
FR-802 — Audit trail across multi-organizations
Requirement: Audit trail on all data, cross multi-organizations. Source
User story: As a compliance officer, I want change history so that audits can prove integrity.
Acceptance criteria:

System records create/update/delete events for key entities (scope TBD).
Audit entries show actor, timestamp, and field deltas (desired).
FR-803 — Organization branding
Requirement: Own branding; branded PDFs; private label includes full customer branding. Source Source
User story: As an org admin, I want branding so that reports and portals match our identity.
Acceptance criteria:

Admin can set logo and brand elements (minimum).
Branding applies to reports and potentially UI (plan-dependent).
FR-804 — Private Label customization (data tables, forms, templates, siloing)
Requirement: Private label platform offers customizable data tables (flight types, equipment, drone components), custom forms/templates, user siloing across orgs, and mission request for third parties. Source
User story: As a manufacturer or enterprise, I want a dedicated customizable instance so that it fits my workflow and customers.
Acceptance criteria:

System supports tenant-level configuration of tables/templates (implementation scope to be defined).
Supports master oversight + siloed orgs.
7.10 Notifications & Messaging (FR-900 series)
Context: Notifications for flight at night detection, document expiration, low pilot currency, overdue inspection, etc.; plus notification messaging templates. Source Source

FR-901 — System notifications for compliance and ops triggers
Requirement: Multiple notifications like flight at night detection, document expiration, low pilot currency, etc. Source
User story: As an ops manager, I want proactive alerts so I can prevent non-compliant operations.
Acceptance criteria:

System creates notifications when configured triggers fire.
Notifications are visible in-app (minimum) and recordable for audit.
FR-902 — Deviation detection from authorized operations
Requirement: Notifications if checklists aren’t completed, flights deviate from allowed parameters, compliance items violated, documentation expiring. Source
User story: As a safety manager, I want deviation alerts so that we catch issues early.
Acceptance criteria:

System can evaluate at least: checklist completion, document expiration, overdue inspection.
Deviation events produce notifications and are reportable.
FR-903 — Notification messaging + templates
Requirement: Send notifications to personnel in org or across multiple orgs; define auto-notification templates for triggers (pilot doc expiration, overdue mission, drone inspection overdue, part replacement overdue). Source
User story: As an admin, I want templated notifications so that messaging is consistent and scalable.
Acceptance criteria:

Admin can define message templates per trigger.
Notifications can target users or groups by org.
7.11 API Data Access (FR-950 series)
Context: Pricing page lists API data access; API docs show entity groupings. Source Source

FR-951 — Provide API access to core entities
Requirement: Provide programmatic access to data via API. Source
User story: As an enterprise customer, I want an API so that I can integrate DroneLogbook data into my internal systems.
Acceptance criteria:

API exposes endpoints for core resource families (equipment, flights, customers, projects, users, drones, company, place). Source
API requires authentication and supports standard CRUD where applicable (exact methods TBD by Swagger details).
8) Non-Functional Requirements (NFR-###)
NFR-001 — Data storage, backup, and retention baseline
Requirement: Data stored on secure cloud servers and backed up daily. Source
Acceptance criteria:

Daily backup job exists; restore procedures documented and tested (RTO/RPO defined).
NFR-002 — Privacy posture and anonymized usage
Requirement: Terms describe anonymized/internal identifier linkage and license for anonymized data usage. Source
Acceptance criteria:

Data model supports internal identifiers; anonymization boundaries documented.
Users can access privacy terms in-app.
NFR-003 — Security assurance claims
Requirement: Homepage states SOC 2 compliant and enterprise-level security measures. Source
Acceptance criteria:

Security controls mapped to SOC2 trust principles (implementation work product).
Access logs and audit trails available for admin review.
9) Traceability Matrix (Modules → FR IDs → Source Links)
This matrix ties each major capability area to FRs and the exact public source pages that substantiate them.

Capability / Module	FR IDs	Primary Sources
Flight logging & import (telemetry + non-telemetry)	FR-101, FR-102, FR-103	Features
GPS trace + 3D replay + track export	FR-104, FR-105	Features, Pricing
Large telemetry import	FR-106	Pricing
Integration levels (Auto/Cloud/DLB/Manual)	FR-107	Integrations Hub
Mission planning (assignments, approvals)	FR-201, FR-202, FR-204	Homepage, Features
Airspace status + draw flight area	FR-203	Pricing
Operations calendar (views)	FR-205	Pricing
External sharing + mission request	FR-206, FR-207	Pricing
Compliance reporting (authority + branded PDF)	FR-301, FR-302	Homepage, Features
Custom reporting + template engine + exports	FR-303, FR-304, FR-305	Homepage, Pricing
Documents & forms	FR-401, FR-402, FR-403, FR-404, FR-405, FR-406	Homepage, Features, Pricing
Fleet management (drones, equipment, batteries, DJI metrics, drone profile)	FR-501–FR-505	Features, Pricing
Inspections & maintenance (schedules, auto-update, follow-ups, enforcement)	FR-601–FR-606	Homepage, Features
Personnel (currency, docs, skills)	FR-701–FR-704	Homepage, Features
Incidents	FR-751	Features
Notifications & messaging	FR-901–FR-903	Features, Pricing
Multi-org + audit trail + branding + private label	FR-801–FR-804	Pricing, Solutions
API access	FR-951	Pricing, API Docs
Data storage/backup + privacy/terms	NFR-001, NFR-002	FAQ, Terms
10) Appendices
Appendix A — Integration Inventory (as described publicly)
Integrations are categorized into Auto‑Sync, Cloud‑Sync, DLB‑Sync compatible apps, and Manual Importers with many vendors listed. This taxonomy is explicitly documented on the Integrations Hub page. Source

Appendix B — API Resource Families (public Swagger)
Swagger UI lists major groups: equipment, flight, customer, project, user, drone, company, place. Source

Next step (optional, to make this “implementation-ready”)
If you share any authenticated screenshots (or a demo account) for Flights/Missions/Maintenance/Reports screens, I can extend each FR’s acceptance criteria to include exact field lists, statuses, and permission checks—especially for approvals, scoring rules, and audit trail details (which are not fully specified on public pages).
