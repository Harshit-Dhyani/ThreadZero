import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchIndex, inferIdentifierType, organiseGuide, searchGuideIndex } from "./guide-core.js";

test("the local Guide routes, searches, and infers without external services", () => {
  const index = buildSearchIndex();
  assert.equal(searchGuideIndex(index, "lost money", "en")[0].route, "contact");
  assert.equal(searchGuideIndex(index, "वेबसाइट", "hi")[0].workspace, "check");
  assert.equal(inferIdentifierType("https://example.test/path"), "url");
  assert.equal(inferIdentifierType("person@example.test"), "email");
  assert.equal(inferIdentifierType("9876543210"), "phone");
  assert.equal(inferIdentifierType("person@upi"), "upi");
  assert.equal(inferIdentifierType("not enough"), "unknown");
  const result = organiseGuide({ choice: "lost-money", narrative: "I lost ₹25,000 through UPI after a WhatsApp message", language: "en" });
  assert.equal(result.recommendedWorkspace, "report");
  assert.equal(result.draft.amount, 25000);
  assert.ok(result.questions.length <= 2);
});
