export type RunbookRiskLevel = 'low' | 'medium' | 'high';

export interface RunbookStep {
    id: string;
    title: string;
    objective: string;
    instructions: string[];
    verificationChecklist: string[];
    ctaLabel?: string;
    ctaHref?: string;
}

export interface RunbookTemplate {
    id: string;
    title: string;
    summary: string;
    category: 'crop-protection' | 'harvest' | 'safety';
    riskLevel: RunbookRiskLevel;
    estimatedMinutes: number;
    whenToUse: string;
    steps: RunbookStep[];
}

export const RUNBOOK_TEMPLATES: RunbookTemplate[] = [
    {
        id: 'spray-window-readiness',
        title: 'Spray Window Readiness',
        summary: 'Prevent drift, missed windows, and coverage gaps before any chemical application.',
        category: 'crop-protection',
        riskLevel: 'high',
        estimatedMinutes: 20,
        whenToUse: 'Before drone spraying, herbicide passes, or contractor spray bookings.',
        steps: [
            {
                id: 'weather-and-compliance-check',
                title: 'Confirm weather and compliance window',
                objective: 'Verify conditions are safe and legal before dispatch.',
                instructions: [
                    'Check wind speed, precipitation risk, and forecast trend for the next 3-6 hours.',
                    'Confirm buffer zone constraints and protected area restrictions for the target field.',
                    'Hold operation if any hard stop threshold is violated.'
                ],
                verificationChecklist: [
                    'Wind and rain thresholds are acceptable.',
                    'No active compliance blockers.',
                    'Spray window remains open for the planned duration.'
                ],
                ctaLabel: 'Open Weather',
                ctaHref: '/weather'
            },
            {
                id: 'field-and-prescription-validate',
                title: 'Validate field target and prescription',
                objective: 'Ensure the right field receives the right treatment at the right rate.',
                instructions: [
                    'Confirm the target field boundary and current risk pressure from scouting data.',
                    'Review treatment recommendation confidence and expected impact.',
                    'Use variable-rate map if available for patchy pressure zones.'
                ],
                verificationChecklist: [
                    'Target field and zone selection is correct.',
                    'Recommended treatment aligns with observed pressure.',
                    'Application rate and product plan are documented.'
                ],
                ctaLabel: 'Open Fields',
                ctaHref: '/fields'
            },
            {
                id: 'inventory-and-equipment-ready',
                title: 'Verify chemical inventory and equipment readiness',
                objective: 'Avoid dispatch failures from missing inputs or downtime.',
                instructions: [
                    'Confirm chemical inventory, adjuvants, and fuel are available.',
                    'Check aircraft/sprayer readiness and operator assignment coverage.',
                    'If in-house asset is blocked, route to marketplace service booking.'
                ],
                verificationChecklist: [
                    'All required inputs are in stock.',
                    'Assigned equipment is ready and not in maintenance.',
                    'Backup provider option identified.'
                ],
                ctaLabel: 'Open Inventory',
                ctaHref: '/inventory'
            },
            {
                id: 'dispatch-and-verify-coverage',
                title: 'Dispatch and verify coverage outcome',
                objective: 'Close the loop with execution proof and follow-up monitoring.',
                instructions: [
                    'Dispatch the job and monitor execution telemetry.',
                    'Capture completion evidence and note any partial coverage or interruptions.',
                    'Schedule follow-up scouting to validate treatment effect.'
                ],
                verificationChecklist: [
                    'Operation dispatched and acknowledged.',
                    'Coverage confirmation logged.',
                    'Follow-up observation task created.'
                ],
                ctaLabel: 'Open Services',
                ctaHref: '/services'
            }
        ]
    },
    {
        id: 'harvest-dispatch-readiness',
        title: 'Harvest Dispatch Readiness',
        summary: 'Stage harvest execution with minimal quality loss and fewer bottlenecks.',
        category: 'harvest',
        riskLevel: 'high',
        estimatedMinutes: 25,
        whenToUse: 'When fields are harvest-ready or harvest windows are tight.',
        steps: [
            {
                id: 'harvest-window-go-no-go',
                title: 'Run harvest go/no-go check',
                objective: 'Decide whether to execute now or hold safely.',
                instructions: [
                    'Review harvest weather window and expected precipitation risk.',
                    'Confirm crop maturity and quality threshold in field notes.',
                    'Escalate to alternate field if current field is weather-blocked.'
                ],
                verificationChecklist: [
                    'Harvest weather gate is open.',
                    'Field maturity supports harvest action.',
                    'Primary and fallback field priority is decided.'
                ],
                ctaLabel: 'Open Weekly Plan',
                ctaHref: '/'
            },
            {
                id: 'capacity-and-logistics-check',
                title: 'Validate machine, labor, and logistics capacity',
                objective: 'Ensure enough capacity to finish without stalled loads.',
                instructions: [
                    'Check harvester status, fuel, and daily throughput assumptions.',
                    'Confirm operator availability and temporary labor needs.',
                    'Verify transport and storage/booking capacity for expected volume.'
                ],
                verificationChecklist: [
                    'Harvester and support assets are available.',
                    'Operator or contractor capacity is confirmed.',
                    'Transport/storage bottlenecks are addressed.'
                ],
                ctaLabel: 'Open Fleet',
                ctaHref: '/fleet'
            },
            {
                id: 'execute-and-track-loss-risk',
                title: 'Execute harvest and track loss risk',
                objective: 'Run harvest while actively reducing avoidable losses.',
                instructions: [
                    'Dispatch harvest operation and monitor completion status.',
                    'Track delay causes and quality impact signals during execution.',
                    'Re-prioritize remaining fields if conditions degrade.'
                ],
                verificationChecklist: [
                    'Harvest action is dispatched.',
                    'Delay/loss events are noted with timestamps.',
                    'Remaining field sequence updated.'
                ],
                ctaLabel: 'Open Bookings',
                ctaHref: '/bookings'
            },
            {
                id: 'closeout-and-review',
                title: 'Close out and update season outcomes',
                objective: 'Capture outcomes for KPI and next-week planning quality.',
                instructions: [
                    'Log harvested output and completion evidence.',
                    'Review cost, timing adherence, and avoided-loss indicators.',
                    'Feed insights into the next weekly planning cycle.'
                ],
                verificationChecklist: [
                    'Harvest log is complete.',
                    'Economic and timing metrics are captured.',
                    'Next-week priority updates are planned.'
                ],
                ctaLabel: 'Open Season Review',
                ctaHref: '/review'
            }
        ]
    },
    {
        id: 'emergency-stop-recovery',
        title: 'Emergency Stop Recovery',
        summary: 'Stabilize operations after an incident and resume only with safe controls.',
        category: 'safety',
        riskLevel: 'high',
        estimatedMinutes: 15,
        whenToUse: 'After emergency stop, policy guardrail block, or partial execution incident.',
        steps: [
            {
                id: 'stabilize-and-secure',
                title: 'Stabilize operation and secure personnel',
                objective: 'Prevent secondary incidents during the first response window.',
                instructions: [
                    'Confirm emergency stop is active and all moving assets are halted.',
                    'Notify field personnel and establish a temporary exclusion zone.',
                    'Suspend related automated dispatches until investigation completes.'
                ],
                verificationChecklist: [
                    'All affected operations are safely halted.',
                    'Personnel are accounted for and informed.',
                    'No autonomous retries are active.'
                ],
                ctaLabel: 'Open Fleet',
                ctaHref: '/fleet'
            },
            {
                id: 'capture-incident-context',
                title: 'Capture incident context',
                objective: 'Preserve facts for root-cause analysis and compliance.',
                instructions: [
                    'Record time, location, action type, and observed failure mode.',
                    'Document environmental conditions and telemetry anomalies.',
                    'Attach operator notes and any corrective actions already taken.'
                ],
                verificationChecklist: [
                    'Incident context is logged.',
                    'Supporting telemetry references are captured.',
                    'Initial corrective hypothesis is documented.'
                ],
                ctaLabel: 'Open Dashboard',
                ctaHref: '/'
            },
            {
                id: 'recover-and-validate',
                title: 'Recover assets and validate readiness',
                objective: 'Return to an operationally safe state before re-dispatch.',
                instructions: [
                    'Inspect equipment health and maintenance status.',
                    'Address policy guardrail blockers or parameter issues.',
                    'Rehearse rollback path and confirm manual override availability.'
                ],
                verificationChecklist: [
                    'Equipment health check passes.',
                    'Safety guardrails are satisfied.',
                    'Override and rollback paths are ready.'
                ],
                ctaLabel: 'Open Equipment',
                ctaHref: '/equipment'
            },
            {
                id: 'resume-with-approval',
                title: 'Resume with supervised approval',
                objective: 'Restart work only with explicit accountability and traceability.',
                instructions: [
                    'Request supervisor approval for resumed execution.',
                    'Restart with limited scope and monitor early telemetry closely.',
                    'Track completion and finalize incident status after validation.'
                ],
                verificationChecklist: [
                    'Supervisor sign-off is confirmed.',
                    'Controlled restart is completed.',
                    'Incident follow-up actions are assigned.'
                ],
                ctaLabel: 'Open Bookings',
                ctaHref: '/bookings'
            }
        ]
    }
];

const RUNBOOK_BY_ID = RUNBOOK_TEMPLATES.reduce<Record<string, RunbookTemplate>>((acc, template) => {
    acc[template.id] = template;
    return acc;
}, {});

const OPERATION_TO_RUNBOOK: Record<string, string> = {
    'serv-spray-drone': 'spray-window-readiness',
    'op-apply-herbicide': 'spray-window-readiness',
    'buy-chemical': 'spray-window-readiness',
    'op-harvest': 'harvest-dispatch-readiness',
    'serv-harvest-hand': 'harvest-dispatch-readiness',
    'maint-equipment': 'emergency-stop-recovery',
};

export function findRunbookTemplateById(runbookId: string): RunbookTemplate | undefined {
    return RUNBOOK_BY_ID[runbookId];
}

export function getRunbookTemplateForOperation(operationId?: string | null): string | null {
    if (!operationId) return null;
    return OPERATION_TO_RUNBOOK[operationId] || null;
}
