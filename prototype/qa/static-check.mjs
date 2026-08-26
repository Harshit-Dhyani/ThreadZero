import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { DEMO, STEPS } from "../shared/demo-data.js";
import { SIMULATOR_SCENARIOS, checkDemoIndicator, trackDemoReference } from "../shared/portal-tools.js";
import {
  canEnterRoute,
  createInitialState,
  formatDateTime,
  formatMoney,
  getNextRoute,
  markRouteComplete,
  parseRoute,
  resolveRoute,
  validateChronologyEvent,
  validateDetails,
  validateEvidence
} from "../shared/flow-core.js";

const here = dirname(fileURLToPath(import.meta.url));
const prototypeRoot = resolve(here, "..");
const repoRoot = resolve(prototypeRoot, "..");
const conceptNames = ["parallel-ledger", "guided-verification", "continuous-thread"];
const fixture = JSON.parse(await readFile(join(repoRoot, "templates", "SYNTHETIC_FINANCIAL_FRAUD_FIXTURE.json"), "utf8"));
const compileInlineScripts = (html) => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  for (const script of scripts) assert.doesNotThrow(() => new Function(script));
};


assert.deepEqual(
  STEPS.map((step) => step.id),
  ["act-now", "incident", "readiness", "details", "evidence", "chronology", "review", "submit", "next"]
);
assert.equal(Number(DEMO.incident.amount), fixture.incident.amount_inr);
assert.equal(DEMO.incident.paymentMethod, fixture.incident.payment_method);
assert.equal(DEMO.incident.transactionReference, fixture.incident.transaction_reference);
assert.equal(DEMO.incident.recipientIdentifier, fixture.incident.recipient_identifier);
assert.equal(DEMO.incident.contactChannel, fixture.incident.contact_channel);
assert.equal(DEMO.reportReference, fixture.demo_report_reference);
assert.deepEqual(DEMO.events.map((event) => event.time), fixture.events.map((event) => event.time));
assert.deepEqual(DEMO.events.map((event) => event.description), fixture.events.map((event) => event.event));
assert.deepEqual(DEMO.evidence.map((item) => item.sourceState), fixture.evidence.map((item) => item.state));
assert.equal(DEMO.evidence.length, 5);
assert.equal(DEMO.events.length, 4);

const fresh = createInitialState();
assert.equal(fresh.route, "home");
assert.equal(parseRoute("#evidence"), "evidence");
assert.equal(parseRoute("#unknown"), "home");
assert.equal(canEnterRoute("act-now", fresh), true);
assert.equal(canEnterRoute("incident", fresh), false);
assert.equal(resolveRoute("#review", fresh), "home");
fresh.route = "act-now";
fresh.actNowAcknowledged = true;
markRouteComplete(fresh);
assert.equal(canEnterRoute("incident", fresh), true);
assert.equal(getNextRoute("act-now"), "incident");
assert.equal(getNextRoute("next"), null);

assert.equal(validateDetails({}).amount, "Enter the amount sent.");
assert.deepEqual(validateDetails(DEMO.incident), {});
assert.ok(validateEvidence(fresh.evidence, false).extraction);
assert.deepEqual(validateEvidence(fresh.evidence, true), {});
assert.ok(validateChronologyEvent({}).date);
assert.deepEqual(validateChronologyEvent(DEMO.events[0]), {});
assert.equal(formatMoney("25000").replace(/\s/g, ""), "₹25,000");
assert.match(formatDateTime("2026-08-25", "18:42"), /25 August 2026 at 18:42/);

for (const concept of conceptNames) {
  const root = join(prototypeRoot, "concepts", concept);
  const [html, css] = await Promise.all([
    readFile(join(root, "index.html"), "utf8"),
    readFile(join(root, "styles.css"), "utf8")
  ]);
  assert.match(html, /<main\b/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /National Cyber Crime Reporting Portal/);
  assert.match(html, /Independent concept redesign/);
  assert.match(html, /1930/);
  assert.match(html, /cybercrime\.gov\.in/);
  assert.match(html, /₹25,000/);
  assert.match(html, /dealdesk@upi/);
  assert.match(html, /419825901772/);
  assert.match(html, /Received WhatsApp message/);
  assert.match(html, /Opened investment link/);
  assert.match(html, /Contact stopped responding/);
  assert.match(html, />Ready</);
  assert.match(html, />Missing</);
  assert.match(html, />Optional</);
  assert.match(html, /data-confirm-extraction/);
  assert.match(html, /data-attach-evidence/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /concept-demo\.js/);
  assert.doesNotMatch(html, /\bThreadZero\b|class="tz|>tz</i);
  assert.doesNotMatch(html, /type="file"|href="tel:|<img\b|fetch\s*\(/i);
  assert.match(css, /concept-foundation\.css/);
  assert.match(css, /prefers-reduced-motion|transition:\s*[^;]*220ms/);
}

const parallelHtml = await readFile(join(prototypeRoot, "concepts", "parallel-ledger", "index.html"), "utf8");
const guidedHtml = await readFile(join(prototypeRoot, "concepts", "guided-verification", "index.html"), "utf8");
const threadHtml = await readFile(join(prototypeRoot, "concepts", "continuous-thread", "index.html"), "utf8");
assert.match(parallelHtml, /ledger-workspace/);
assert.doesNotMatch(parallelHtml, /guided-sequence|thread-record/);
assert.match(guidedHtml, /guided-sequence/);
assert.doesNotMatch(guidedHtml, /ledger-workspace|thread-record/);
assert.match(threadHtml, /thread-record/);
assert.doesNotMatch(threadHtml, /ledger-workspace|guided-sequence/);

const foundation = await readFile(join(prototypeRoot, "shared", "concept-foundation.css"), "utf8");
assert.match(foundation, /min-width:\s*320px/);
assert.match(foundation, /min-height:\s*44px/);
assert.match(foundation, /prefers-reduced-motion/);
assert.doesNotMatch(foundation, /linear-gradient|radial-gradient|backdrop-filter/i);

const conceptDemo = await readFile(join(prototypeRoot, "shared", "concept-demo.js"), "utf8");
assert.doesNotThrow(() => new Function(conceptDemo));

const flowCore = await readFile(join(prototypeRoot, "shared", "flow-core.js"), "utf8");
assert.doesNotMatch(flowCore, /innerHTML|mountFlow|direction\s*===/);

const comparison = await readFile(join(prototypeRoot, "comparison", "index.html"), "utf8");
for (const concept of conceptNames) assert.match(comparison, new RegExp(concept));
assert.match(comparison, /ncrp-concept:design-selection/);
assert.match(comparison, /rendered QA pending/);
assert.match(comparison, /No direction is selected by default/);
assert.doesNotMatch(comparison, /Verified ·|Recommendation after browser QA|9\.27/i);
assert.doesNotMatch(comparison, /<input[^>]+checked/i);

const harness = await readFile(join(prototypeRoot, "qa", "harness.html"), "utf8");
compileInlineScripts(comparison);
for (const concept of conceptNames) assert.match(harness, new RegExp(concept));
for (const width of ["1440", "1024", "390", "320"]) assert.match(harness, new RegExp(width));
assert.match(harness, /oneVisibleH1/);
assert.match(harness, /noHorizontalOverflow/);
assert.match(harness, /attachedProofVisible/);
assert.match(harness, /publicCodenameAbsent/);

compileInlineScripts(harness);
for (const doc of [
  "product-contract.md",
  "design-system.md",
  "accessibility-and-copy.md",
  "implementation-runbook.md",
  "verification.md",
  "service-blueprint.md"
]) {
  await readFile(join(repoRoot, "docs", doc), "utf8");
}

const appRoot = join(prototypeRoot, "app");
const [appHtml, appCss, appJs, appStandalone] = await Promise.all([readFile(join(appRoot, "index.html"), "utf8"), readFile(join(appRoot, "styles.css"), "utf8"), readFile(join(appRoot, "app.js"), "utf8"), readFile(join(appRoot, "app-standalone.js"), "utf8")]);
assert.match(appHtml, /<header class="portal-header">/);
assert.match(appHtml, /<nav class="primary-navigation"/);
assert.match(appHtml, /<footer class="service-footer"/);
assert.match(appHtml, /entryScript\.type = "module"/);
assert.match(appHtml, /entryScript\.src = "app\.js"/);
assert.match(appHtml, /entryScript\.src = "app-standalone\.js"/);
assert.equal((appHtml.match(/<script\b/g) || []).length, 1);
assert.doesNotMatch(appHtml + appJs + appStandalone, /href="tel:|type="file"|fetch\s*\(/i);
for (const value of ["National Cyber Crime Reporting Portal", "Independent concept redesign", "1930", "cybercrime.gov.in"]) assert.match(appHtml, new RegExp(value));
for (const value of ["₹25,000", "dealdesk@upi", "419825901772", "Scam Radar", "Scam simulator", "Register a complaint", "Suspect repository", "Cyber Volunteers", "Learning corner", "Contact us"]) assert.match(appJs + appStandalone, new RegExp(value));
assert.doesNotMatch(appStandalone, /\bimport\s|\bexport\s/);
assert.match(appCss, /--canvas:\s*#f3f6f9/);
assert.match(appCss, /home-hero__meta/);
assert.match(appCss, /evidence-ledger/);
assert.match(appCss, /font-family:\s*Arial/);
assert.doesNotMatch(appCss, /Georgia|Noto Serif|cursive|font-style:\s*italic/i);
assert.equal(checkDemoIndicator("upi", "dealdesk@upi").status, "match");
assert.equal(checkDemoIndicator("url", "https://example.org/path").status, "unknown");
assert.equal(checkDemoIndicator("phone", "123").status, "invalid");
assert.equal(trackDemoReference("DEMO-2026-08421").status, "found");
assert.equal(trackDemoReference("UNKNOWN").status, "unknown");
assert.equal(SIMULATOR_SCENARIOS.length, 4);

const wireframe = await readFile(join(prototypeRoot, "wireframes", "index.html"), "utf8");
assert.match(wireframe, /Golden wireframe review/);
assert.match(wireframe, /data-screen="home"/);
assert.match(wireframe, /data-screen="evidence"/);
assert.match(wireframe, /data-size="mobile"/);
assert.match(wireframe, /राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल/);
assert.match(wireframe, /run-20260825-204620/);
for (const value of ["₹25,000", "dealdesk@upi", "419825901772", "WhatsApp", "1930", "cybercrime.gov.in"]) {
  assert.match(wireframe, new RegExp(value));
}
assert.match(wireframe, /Official guidance, kept separate/);
assert.match(wireframe, /future RAG|भविष्य में RAG/);
assert.match(wireframe, /aria-live="polite"/);
assert.match(wireframe, /prefers-reduced-motion/);
assert.doesNotMatch(wireframe, /<img\b|type="file"|href="tel:|fetch\s*\(/i);
compileInlineScripts(wireframe);
console.log("NCRP Civic Evidence Ledger static contract: PASS");
console.log("Checked canonical fixture parity, behavior-only flow helpers, three distinct concepts, comparison board, QA harness, and authoritative docs.");
