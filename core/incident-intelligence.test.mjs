import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEvidenceReadiness,
  createPreparationPack,
  extractIncident,
  orderEvents,
  refreshIncidentDerivedFields,
  selectNextActions,
  selectQuestions
} from "./incident-intelligence.mjs";

const narrative = "On WhatsApp, an investment contact sent a suspicious link. I sent ₹25,000 by UPI to dealdesk@upi and have the transaction screenshot. The contact stopped responding.";

test("incident intelligence stays deterministic, editable, and safety bounded", () => {
  const incident = extractIncident(narrative, "en");

  assert.equal(incident.incidentType, "fake-investment");
  assert.equal(incident.amount, 25000);
  assert.equal(incident.paymentMethod, "UPI");
  assert.equal(incident.identifiers.upi, "dealdesk@upi");
  assert.equal(incident.confirmedFacts.length, 0);
  assert.ok(incident.suggestedFacts.every((fact) => fact.status === "suggested"));
  assert.deepEqual(incident.events.map((event) => event.type), ["contact", "link", "payment", "contact-ended"]);

  const evidence = buildEvidenceReadiness(incident);
  assert.equal(evidence.find((item) => item.id === "transaction").status, "ready");
  assert.equal(evidence.find((item) => item.id === "url").status, "optional");

  const questions = selectQuestions(incident, "en");
  assert.ok(questions.length <= 3);
  assert.ok(questions.some((question) => question.id === "transactionReference"));
  assert.ok(questions.some((question) => question.id === "url"));

  const actions = selectNextActions(incident, "en");
  assert.deepEqual(actions.slice(0, 2).map((action) => action.id), ["call-1930", "official-portal"]);
  assert.ok(actions.every((action) => !/submitted|case id/i.test(action.title)));

  const ordered = orderEvents([
    { id: "later", occurredAt: "2026-08-25T18:47:00" },
    { id: "first", occurredAt: "2026-08-25T18:34:00" }
  ]);
  assert.deepEqual(ordered.map((event) => event.id), ["first", "later"]);

  const pack = createPreparationPack(incident, "en");
  assert.equal(pack.filename, "cyber-fraud-preparation-pack.txt");
  assert.match(pack.content, /Incident Summary/);
  assert.match(pack.content, /Official Next Actions/);
  assert.doesNotMatch(pack.content, /Complaint submitted|Case ID/);
});

test("Hindi demo input produces Hindi questions and official next actions", () => {
  const incident = extractIncident("व्हाट्सऐप पर निवेश का संदेश आया। मैंने यूपीआई से 25000 रुपये भेजे और फिर संपर्क ने जवाब बंद कर दिया।", "hi");
  assert.equal(incident.contactChannels[0], "WhatsApp");
  assert.equal(incident.amount, 25000);
  assert.ok(incident.questions.length <= 3);
  assert.ok(incident.questions.every((question) => /[\u0900-\u097F]/.test(question.text)));
  assert.ok(incident.nextActions.every((action) => /[\u0900-\u097F]|cybercrime\.gov\.in/.test(action.title)));
  assert.ok(incident.events.every((event) => /[\u0900-\u097F]/.test(event.title)));
  assert.ok(incident.evidence.every((item) => /[\u0900-\u097F]/.test(item.label)));
});

test("confirmed edits refresh missing facts, payment events, and next actions", () => {
  const incident = extractIncident("An investment contact asked me to make a UPI payment and then stopped responding.", "en");
  incident.amount = 18000;
  incident.happenedAt = "2026-08-25T18:40:00";
  incident.identifiers.transactionReference = "123456789012";
  incident.identifiers.upi = "demo@upi";
  refreshIncidentDerivedFields(incident, "en");

  assert.deepEqual(incident.missingFacts, []);
  assert.match(incident.events.find((event) => event.type === "payment").title, /₹18,000 UPI sent/);
  assert.equal(incident.events.every((event) => event.occurredAt === incident.happenedAt), true);
  assert.equal(incident.evidence.find((item) => item.id === "contact").status, "ready");
  assert.equal(incident.nextActions[0].id, "call-1930");
});
