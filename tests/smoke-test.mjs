const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:3017';
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 20000);

function logPass(message) {
  console.log(`PASS ${message}`);
}

function formatBody(body) {
  return body.length > 800 ? `${body.slice(0, 800)}...` : body;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function expectStatus(path, expectedStatus = 200) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`);
  const body = await response.text();
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${path} -> ${expectedStatus}, got ${response.status}\n${formatBody(body)}`);
  }
  logPass(`${path} (${expectedStatus})`);
  return { response, body };
}

function parseJson(path, raw) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Expected JSON from ${path}\n${formatBody(raw)}`);
  }
}

async function expectSuccessJson(path, expectedStatus = 200) {
  const { body } = await expectStatus(path, expectedStatus);
  const payload = parseJson(path, body);
  if (payload.success !== true) {
    throw new Error(`Expected success=true from ${path}\n${formatBody(body)}`);
  }
  logPass(`${path} success=true`);
  return payload;
}

async function expectErrorJson(path, expectedStatus) {
  const { body } = await expectStatus(path, expectedStatus);
  const payload = parseJson(path, body);
  if (payload.success !== false || !payload.error) {
    throw new Error(`Expected structured error from ${path}\n${formatBody(body)}`);
  }
  logPass(`${path} structured error`);
  return payload;
}

async function run() {
  console.log(`Running smoke tests against ${baseUrl}`);

  const kpiPayload = await expectSuccessJson('/api/kpi/fields');
  const existingFieldId = kpiPayload?.fields?.[0]?.fieldId;

  await expectSuccessJson('/api/agronomy/treatment-recommendations');
  if (existingFieldId) {
    await expectSuccessJson(`/api/agronomy/treatment-recommendations?fieldId=${encodeURIComponent(existingFieldId)}`);
  } else {
    console.log('WARN could not find a field id in /api/kpi/fields; skipping known-field agronomy check');
  }
  await expectErrorJson('/api/agronomy/treatment-recommendations?fieldId=does-not-exist', 404);

  await expectSuccessJson('/api/benchmark/economics');
  await expectSuccessJson('/api/benchmark/economics?scope=crop&limit=2&includeInsights=false');
  await expectErrorJson('/api/benchmark/economics?scope=invalid', 400);
  await expectErrorJson('/api/benchmark/economics?limit=0', 400);

  await expectSuccessJson('/api/review/season');
  await expectSuccessJson('/api/models/tuning');
  await expectErrorJson('/api/kpi/fields?since=not-a-date', 400);

  // RBAC checks for decision approval and action dispatch.
  const decisionId = 'rbac-preview-decision';

  const deniedApproveResponse = await fetchWithTimeout(`${baseUrl}/api/decisions/${encodeURIComponent(decisionId)}/approve`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'viewer',
      'x-agri-user-id': 'rbac-viewer',
    },
    body: JSON.stringify({ approvedBy: 'rbac-viewer' }),
  });
  const deniedApproveBody = await deniedApproveResponse.text();
  if (deniedApproveResponse.status !== 403) {
    throw new Error(`Expected viewer approve denial -> 403, got ${deniedApproveResponse.status}\n${formatBody(deniedApproveBody)}`);
  }
  const deniedApproveJson = parseJson('/api/decisions/[id]/approve viewer', deniedApproveBody);
  if (deniedApproveJson.success !== false || !deniedApproveJson.error) {
    throw new Error(`Unexpected viewer deny payload\n${formatBody(deniedApproveBody)}`);
  }
  logPass('/api/decisions/[id]/approve denied for viewer');

  const allowedApproveResponse = await fetchWithTimeout(`${baseUrl}/api/decisions/${encodeURIComponent(decisionId)}/approve`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'supervisor',
      'x-agri-user-id': 'rbac-supervisor',
    },
    body: JSON.stringify({ approvedBy: 'rbac-supervisor' }),
  });
  const allowedApproveBody = await allowedApproveResponse.text();
  if (allowedApproveResponse.status === 403) {
    throw new Error(`Expected supervisor approval to pass RBAC, got 403\n${formatBody(allowedApproveBody)}`);
  }
  if (![200, 404, 409].includes(allowedApproveResponse.status)) {
    throw new Error(`Unexpected supervisor approve status ${allowedApproveResponse.status}\n${formatBody(allowedApproveBody)}`);
  }
  const allowedApproveJson = parseJson('/api/decisions/[id]/approve supervisor', allowedApproveBody);
  if (allowedApproveResponse.status === 200 && allowedApproveJson.success !== true) {
    throw new Error(`Unexpected supervisor approve payload\n${formatBody(allowedApproveBody)}`);
  }
  if (allowedApproveResponse.status !== 200 && !allowedApproveJson.error) {
    throw new Error(`Expected an error payload when approval preconditions fail\n${formatBody(allowedApproveBody)}`);
  }
  logPass('/api/decisions/[id]/approve allows supervisor role (non-403)');

  const deniedDispatchResponse = await fetchWithTimeout(`${baseUrl}/api/actions/lifecycle`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'viewer',
      'x-agri-user-id': 'rbac-viewer',
    },
    body: JSON.stringify({ actionType: 'apply_irrigation' }),
  });
  const deniedDispatchBody = await deniedDispatchResponse.text();
  if (deniedDispatchResponse.status !== 403) {
    throw new Error(`Expected viewer dispatch denial -> 403, got ${deniedDispatchResponse.status}\n${formatBody(deniedDispatchBody)}`);
  }
  const deniedDispatchJson = parseJson('/api/actions/lifecycle viewer', deniedDispatchBody);
  if (deniedDispatchJson.success !== false || !deniedDispatchJson.error) {
    throw new Error(`Unexpected dispatch denial payload\n${formatBody(deniedDispatchBody)}`);
  }
  logPass('/api/actions/lifecycle denied for viewer');

  const allowedDispatchResponse = await fetchWithTimeout(`${baseUrl}/api/actions/lifecycle`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'operator',
      'x-agri-user-id': 'rbac-operator',
    },
    body: JSON.stringify({ actionType: 'apply_irrigation' }),
  });
  const allowedDispatchBody = await allowedDispatchResponse.text();
  if (allowedDispatchResponse.status !== 200) {
    throw new Error(`Expected operator dispatch -> 200, got ${allowedDispatchResponse.status}\n${formatBody(allowedDispatchBody)}`);
  }
  const allowedDispatchJson = parseJson('/api/actions/lifecycle operator', allowedDispatchBody);
  if (allowedDispatchJson.success !== true) {
    throw new Error(`Unexpected dispatch payload\n${formatBody(allowedDispatchBody)}`);
  }
  logPass('/api/actions/lifecycle allowed for operator');

  // Policy guardrail block check (J3): unsafe spray window should be blocked.
  const blockedDispatchResponse = await fetchWithTimeout(`${baseUrl}/api/actions/lifecycle`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'operator',
      'x-agri-user-id': 'rbac-operator',
    },
    body: JSON.stringify({
      actionType: 'apply_treatment',
      parameters: {
        windMph: 25,
        precipitationChance: 10,
      },
    }),
  });
  const blockedDispatchBody = await blockedDispatchResponse.text();
  if (blockedDispatchResponse.status !== 409) {
    throw new Error(`Expected guardrail block -> 409, got ${blockedDispatchResponse.status}\n${formatBody(blockedDispatchBody)}`);
  }
  const blockedDispatchJson = parseJson('/api/actions/lifecycle guardrail block', blockedDispatchBody);
  if (blockedDispatchJson.success !== false || blockedDispatchJson?.guardrail?.decision !== 'block') {
    throw new Error(`Unexpected guardrail block payload\n${formatBody(blockedDispatchBody)}`);
  }
  logPass('/api/actions/lifecycle blocked by policy guardrail');

  const validTuningResponse = await fetchWithTimeout(`${baseUrl}/api/models/tuning`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ trigger: 'manual', force: true, minSamples: 1, minNewOutcomes: 1 }),
  });
  const validTuningBody = await validTuningResponse.text();
  if (validTuningResponse.status !== 200) {
    throw new Error(`Expected /api/models/tuning POST -> 200, got ${validTuningResponse.status}\n${formatBody(validTuningBody)}`);
  }
  const validTuningJson = parseJson('/api/models/tuning (POST)', validTuningBody);
  if (validTuningJson.success !== true || !validTuningJson.run || !validTuningJson.state) {
    throw new Error(`Unexpected /api/models/tuning POST payload\n${formatBody(validTuningBody)}`);
  }
  logPass('/api/models/tuning POST (manual)');

  const invalidTuningResponse = await fetchWithTimeout(`${baseUrl}/api/models/tuning`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ trigger: 'invalid' }),
  });
  const invalidTuningBody = await invalidTuningResponse.text();
  if (invalidTuningResponse.status !== 400) {
    throw new Error(`Expected /api/models/tuning invalid POST -> 400, got ${invalidTuningResponse.status}\n${formatBody(invalidTuningBody)}`);
  }
  const invalidTuningJson = parseJson('/api/models/tuning invalid (POST)', invalidTuningBody);
  if (invalidTuningJson.success !== false || !invalidTuningJson.error) {
    throw new Error(`Unexpected /api/models/tuning invalid POST payload\n${formatBody(invalidTuningBody)}`);
  }
  logPass('/api/models/tuning POST (invalid trigger)');

  // Signed audit verification (J2).
  const auditVerifyResponse = await fetchWithTimeout(`${baseUrl}/api/audit?verify=true`);
  const auditVerifyBody = await auditVerifyResponse.text();
  if (auditVerifyResponse.status !== 200) {
    throw new Error(`Expected /api/audit?verify=true -> 200, got ${auditVerifyResponse.status}\n${formatBody(auditVerifyBody)}`);
  }
  const auditVerifyJson = parseJson('/api/audit?verify=true', auditVerifyBody);
  if (auditVerifyJson.success !== true || !auditVerifyJson.verification || auditVerifyJson.verification.valid !== true) {
    throw new Error(`Audit signature verification failed\n${formatBody(auditVerifyBody)}`);
  }
  logPass('/api/audit signed chain verification');

  // Incident workflow check (J4).
  const incidentsResponse = await fetchWithTimeout(`${baseUrl}/api/incidents?limit=10`, {
    headers: {
      'x-agri-user-role': 'supervisor',
      'x-agri-user-id': 'rbac-supervisor',
    },
  });
  const incidentsBody = await incidentsResponse.text();
  if (incidentsResponse.status !== 200) {
    throw new Error(`Expected /api/incidents -> 200, got ${incidentsResponse.status}\n${formatBody(incidentsBody)}`);
  }
  const incidentsJson = parseJson('/api/incidents', incidentsBody);
  if (incidentsJson.success !== true || !Array.isArray(incidentsJson.incidents)) {
    throw new Error(`Unexpected incidents payload\n${formatBody(incidentsBody)}`);
  }
  if (!incidentsJson.incidents.length) {
    throw new Error('Expected at least one incident after guardrail block');
  }
  const incidentId = incidentsJson.incidents[0].id;
  const incidentPatchResponse = await fetchWithTimeout(`${baseUrl}/api/incidents/${encodeURIComponent(incidentId)}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-agri-user-role': 'supervisor',
      'x-agri-user-id': 'rbac-supervisor',
    },
    body: JSON.stringify({
      status: 'acknowledged',
      note: 'Smoke test acknowledgment',
    }),
  });
  const incidentPatchBody = await incidentPatchResponse.text();
  if (incidentPatchResponse.status !== 200) {
    throw new Error(`Expected /api/incidents/[id] PATCH -> 200, got ${incidentPatchResponse.status}\n${formatBody(incidentPatchBody)}`);
  }
  const incidentPatchJson = parseJson('/api/incidents/[id] PATCH', incidentPatchBody);
  if (incidentPatchJson.success !== true || incidentPatchJson?.incident?.status !== 'acknowledged') {
    throw new Error(`Unexpected incident update payload\n${formatBody(incidentPatchBody)}`);
  }
  logPass('/api/incidents workflow (list + acknowledge)');

  const agronomyPayload = await expectSuccessJson('/api/agronomy/treatment-recommendations');
  const recommendations = agronomyPayload?.report?.recommendations || [];
  const inconsistentRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation?.threshold?.treatmentJustified === true &&
      Number(recommendation?.threshold?.netBenefitPerAcre) <= 0
  );
  if (inconsistentRecommendations.length > 0) {
    throw new Error(
      `Agronomy economic consistency failed\n${JSON.stringify(inconsistentRecommendations[0], null, 2)}`
    );
  }
  logPass(`agronomy economic consistency (${recommendations.length} recommendations)`);

  await expectStatus('/review', 200);
  await expectStatus('/fleet', 200);
  await expectStatus('/runbooks', 200);

  console.log('ALL TESTS PASSED');
}

run().catch((error) => {
  console.error(`SMOKE TEST FAILED\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
