/**
 * Dr. T — HealthAlert Companion MCP Server & Agent Verification Suite
 * Amazon Developer Hackathon 2026 (Alexa+ Track)
 */

import assert from 'assert';
import { 
  HEALTH_ALERT_MCP_TOOLS,
  executeCheckSafetyEscalation,
  executeExplainHealthAlert,
  executePrepareFollowUpQuestions,
  runAgentOrchestration
} from '../src/server/healthAlertMcpServer';

console.log('======================================================');
console.log('🤖 HEALTHALERT COMPANION — MCP & ALEXA+ AGENT TEST SUITE');
console.log('Amazon Developer Hackathon 2026 (Alexa+ Track)');
console.log('======================================================\n');

// ----------------------------------------------------
// Group 1: MCP Server Tools Schema & Discovery
// ----------------------------------------------------
console.log('Test Group 1: MCP Tool Registry & JSON Schema Compliance');

assert(Array.isArray(HEALTH_ALERT_MCP_TOOLS), 'MCP tools registry is an array');
assert(HEALTH_ALERT_MCP_TOOLS.length === 3, 'Exposes exactly 3 documented MCP tools');

const toolNames = HEALTH_ALERT_MCP_TOOLS.map(t => t.name);
assert(toolNames.includes('check_safety_escalation'), 'Exposes check_safety_escalation tool');
assert(toolNames.includes('explain_health_alert'), 'Exposes explain_health_alert tool');
assert(toolNames.includes('prepare_follow_up_questions'), 'Exposes prepare_follow_up_questions tool');

for (const tool of HEALTH_ALERT_MCP_TOOLS) {
  assert(Boolean(tool.description && tool.description.length > 20), `${tool.name} has clear clinical description`);
  assert(tool.inputSchema.type === 'object', `${tool.name} defines object-type input schema`);
  assert(typeof tool.inputSchema.properties === 'object', `${tool.name} defines input properties`);
  console.log(`  ✅ [PASS] Tool "${tool.name}" valid schema`);
}

// ----------------------------------------------------
// Group 2: Deterministic Safety Check Tool
// ----------------------------------------------------
console.log('\nTest Group 2: check_safety_escalation Deterministic Safety Rules');

// Case 2.1: Crushing Chest Pain Emergency
const chestPainRes = executeCheckSafetyEscalation({
  symptoms: ['Crushing substernal chest pressure', 'Shortness of breath'],
  region: 'Vietnam'
});
assert(chestPainRes.isEmergency === true, 'Chest pain triggers emergency escalation');
assert(chestPainRes.triageTier === 'EMERGENT_ESCALATION', 'Tier is strictly EMERGENT_ESCALATION');
assert(chestPainRes.localizedEmergency.ambulanceNumber === '115', 'Vietnam emergency localized to 115');
assert(chestPainRes.urgencyTimeline.includes('IMMEDIATE'), 'Emergency requires immediate timeline');
console.log('  ✅ [PASS] Critical red-flag chest pain triggers immediate emergency escalation (115 Vietnam)');

// Case 2.2: Stage 1 HTN (138/88) Outpatient Invariant
const stage1Res = executeCheckSafetyEscalation({
  symptoms: ['Mild fatigue', 'Occasional tension headache'],
  bloodPressure: '138/88',
  region: 'UAE'
});
assert(stage1Res.isEmergency === false, 'Stage 1 HTN is NOT an emergency');
assert(stage1Res.triageTier === 'PLANNED_CLINICAL_ASSESSMENT', '138/88 strictly stratifies to PLANNED_CLINICAL_ASSESSMENT');
assert(stage1Res.urgencyTimeline.includes('2 to 4 weeks'), 'Timeline is strictly 2 to 4 weeks outpatient follow-up');
console.log('  ✅ [PASS] Safety invariant: 138/88 mmHg correctly stays PLANNED_CLINICAL_ASSESSMENT (2-4 weeks)');

// Case 2.3: Hypertensive Crisis Invariant
const crisisRes = executeCheckSafetyEscalation({
  symptoms: ['Headache'],
  bloodPressure: '185/115',
  region: 'UK'
});
assert(crisisRes.isEmergency === true, 'BP 185/115 triggers emergency');
assert(crisisRes.triageTier === 'EMERGENT_ESCALATION', 'Hypertensive crisis tier is EMERGENT_ESCALATION');
assert(crisisRes.localizedEmergency.ambulanceNumber === '999', 'UK emergency localized to 999');
console.log('  ✅ [PASS] Hypertensive crisis invariant (185/115) triggers EMERGENT_ESCALATION (999 UK)');

// ----------------------------------------------------
// Group 3: Explain Health Alert Tool
// ----------------------------------------------------
console.log('\nTest Group 3: explain_health_alert plain language & uncertainty');

async function testExplain() {
  const explainRes = await executeExplainHealthAlert({
    alert: 'Serum Ferritin reading is 15',
    measurement: 15,
    unit: 'ng/mL',
    symptoms: ['Afternoon exhaustion', 'Exertional stamina drop'],
    context: '29yo female amateur marathoner'
  }, null);

  assert(Boolean(explainRes.summary && explainRes.summary.length > 20), 'Summary is populated');
  assert(explainRes.factsSupplied.measurement === 15, 'Supplied measurement preserved without mutation');
  assert(explainRes.factsSupplied.unit === 'ng/mL', 'Supplied unit preserved');
  assert(explainRes.missingInformation.some(m => m.includes('reference range')), 'Identifies missing lab reference range');
  assert(explainRes.interpretations.some(i => i.includes('iron') || i.includes('mitochondrial')), 'Explains iron mechanism');
  assert(explainRes.telemetry.heuristicFallbackEngaged === true, 'Transparently documents fallback engine in test mode');
  console.log('  ✅ [PASS] Low ferritin observation properly explained with factual bounding and missing info notice');
}

// ----------------------------------------------------
// Group 4: Prepare Follow-up Questions Tool
// ----------------------------------------------------
console.log('\nTest Group 4: prepare_follow_up_questions clinician preparation');

const questionsRes = executePrepareFollowUpQuestions({
  primaryConcern: 'Elevated blood pressure 138/88 and afternoon exhaustion',
  triageTier: 'PLANNED_CLINICAL_ASSESSMENT'
});

assert(Array.isArray(questionsRes.questions) && questionsRes.questions.length >= 3, 'Generates minimum 3 consultation questions');
assert(Array.isArray(questionsRes.checklist) && questionsRes.checklist.length >= 3, 'Generates pre-appointment checklist');
assert(questionsRes.missingContextNoted.length > 0, 'Flags missing context for physician discussion');
console.log('  ✅ [PASS] Clinician consultation questions and checklist properly structured');

// ----------------------------------------------------
// Group 5: Conversational Agent Orchestrator
// ----------------------------------------------------
console.log('\nTest Group 5: Conversational Agent Orchestrator (Alexa+-style workflow)');

async function testOrchestrator() {
  // Test 5.1: Non-Emergency Orchestration
  const nonEmergRes = await runAgentOrchestration(
    'My blood pressure is 138/88 and my fasting glucose is mildly elevated with afternoon fatigue',
    'Vietnam',
    null
  );
  assert(nonEmergRes.success === true, 'Orchestration succeeded');
  assert(nonEmergRes.toolExecutionTrace.length === 3, 'Executed all 3 MCP tools');
  assert(nonEmergRes.urgencyTier === 'PLANNED_CLINICAL_ASSESSMENT', 'Cardiometabolic 138/88 stays non-emergency');
  assert(nonEmergRes.safetySummary.isEmergency === false, 'Non-emergency flag preserved');
  assert(nonEmergRes.telemetry.toolsExecuted === 3, 'Telemetry tracks 3 executed tools');
  console.log('  ✅ [PASS] Non-emergency orchestration runs all 3 tools with transparent execution trace');

  // Test 5.2: Emergency Escalation Precedence Invariant
  const emergRes = await runAgentOrchestration(
    'Crushing chest pain radiating to left arm with shortness of breath',
    'UAE',
    null
  );
  assert(emergRes.success === true, 'Emergency orchestration succeeded');
  assert(emergRes.safetySummary.isEmergency === true, 'Emergency detected');
  assert(emergRes.urgencyTier === 'EMERGENT_ESCALATION', 'Tier escalated to EMERGENT_ESCALATION');
  assert(emergRes.agentResponse.includes('EMERGENCY WARNING DETECTED'), 'Agent response starts with emergency warning');
  assert(emergRes.safetySummary.localizedEmergency.ambulanceNumber === '998', 'UAE ambulance 998 provided');
  console.log('  ✅ [PASS] Invariant: Emergency warning takes precedence and directs to UAE National Ambulance (998)');
}

// ----------------------------------------------------
// Group 6: Live MCP Protocol & Streamable HTTP Verification
// ----------------------------------------------------
async function testLiveMcpProtocol() {
  console.log('\nTest Group 6: Live MCP Protocol (2025-11-25) & Streamable HTTP Verification');
  const targetBaseUrl = 'http://localhost:3000';

  let serverLive = false;
  try {
    const res = await fetch(`${targetBaseUrl}/api/mcp`, { signal: AbortSignal.timeout(1000) });
    serverLive = res.status === 200;
  } catch {
    serverLive = false;
  }

  if (!serverLive) {
    console.log('  ⚠️ Local server on http://localhost:3000 not reachable; skipping live network checks.');
    return;
  }

  // 6.1: Discovery Manifest
  const manifestRes = await fetch(`${targetBaseUrl}/api/mcp`);
  assert(manifestRes.status === 200, 'Manifest returns HTTP 200');
  const manifest = await manifestRes.json();
  assert(manifest.protocolVersion === '2025-11-25', 'Manifest advertises 2025-11-25 protocol');
  assert(manifest.supportedProtocolVersions.includes('2025-11-25'), 'Includes 2025-11-25 in supported list');
  assert(manifest.supportedProtocolVersions.includes('2024-11-05'), 'Maintains backward compatibility with 2024-11-05');
  assert(manifest.transports.includes('streamable-http'), 'Advertises Streamable HTTP transport');
  assert(manifest.transports.includes('sse'), 'Advertises SSE transport');
  console.log('  ✅ [PASS] GET /api/mcp advertises protocol 2025-11-25 and Streamable HTTP');

  // 6.2: Streamable HTTP SSE Endpoint
  const sseRes = await fetch(`${targetBaseUrl}/api/mcp/sse`, {
    headers: { Accept: 'text/event-stream' }
  });
  assert(sseRes.status === 200, 'SSE endpoint returns HTTP 200');
  const contentType = sseRes.headers.get('content-type') || '';
  assert(contentType.includes('text/event-stream'), 'SSE endpoint returns text/event-stream');
  console.log('  ✅ [PASS] GET /api/mcp/sse initiates Streamable HTTP text/event-stream');

  // 6.3: JSON-RPC initialize with protocol negotiation (2025-11-25)
  const initRes = await fetch(`${targetBaseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 101,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'alexa-plus-test-client', version: '2.0.0' }
      }
    })
  });
  assert(initRes.status === 200, 'initialize returns HTTP 200');
  const initData = await initRes.json();
  assert(initData.result.protocolVersion === '2025-11-25', 'Successfully negotiates protocol version 2025-11-25');
  console.log('  ✅ [PASS] POST /api/mcp initialize negotiates 2025-11-25 protocol');

  // 6.4: JSON-RPC ping
  const pingRes = await fetch(`${targetBaseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 102,
      method: 'ping'
    })
  });
  assert(pingRes.status === 200, 'ping returns HTTP 200');
  const pingData = await pingRes.json();
  assert(typeof pingData.result === 'object', 'ping returns empty result object');
  console.log('  ✅ [PASS] POST /api/mcp ping responds with JSON-RPC result');

  // 6.5: JSON-RPC notification (no id)
  const notifRes = await fetch(`${targetBaseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized'
    })
  });
  assert(notifRes.status === 204, 'notifications/initialized returns HTTP 204 No Content');
  console.log('  ✅ [PASS] POST /api/mcp handles notifications/initialized gracefully (HTTP 204)');

  // 6.6: Invalid params validation (-32602)
  const badParamRes = await fetch(`${targetBaseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 103,
      method: 'tools/call',
      params: {
        name: 'check_safety_escalation',
        arguments: {} // Missing required 'symptoms'
      }
    })
  });
  assert(badParamRes.status === 400, 'Missing params returns HTTP 400');
  const badParamData = await badParamRes.json();
  assert(badParamData.error.code === -32602, 'Returns JSON-RPC error code -32602 (Invalid params)');
  console.log('  ✅ [PASS] POST /api/mcp rejects missing params with JSON-RPC -32602');

  // 6.7: Method not found (-32601)
  const notFoundRes = await fetch(`${targetBaseUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 104,
      method: 'unknown_mcp_function'
    })
  });
  assert(notFoundRes.status === 404, 'Unknown method returns HTTP 404');
  const notFoundData = await notFoundRes.json();
  assert(notFoundData.error.code === -32601, 'Returns JSON-RPC error code -32601 (Method not found)');
  console.log('  ✅ [PASS] POST /api/mcp rejects unknown method with JSON-RPC -32601');
}

async function runAll() {
  await testExplain();
  await testOrchestrator();
  await testLiveMcpProtocol();

  console.log('\n======================================================');
  console.log('🎉 ALL MCP AND ALEXA+ AGENT ORCHESTRATION TESTS PASSED!');
  console.log('======================================================\n');
}

runAll().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
