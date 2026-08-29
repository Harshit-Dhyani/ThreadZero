import assert from "node:assert/strict";
import test from "node:test";
import { buildSearchIndex, searchGuideIndex } from "../features/guide/index.ts";

const index = buildSearchIndex();

test("urgent official guidance stays first for lost-money searches", () => {
  assert.equal(searchGuideIndex(index, "lost money", "en", 6, "report")[0]?.id, "official-1930");
});

test("current workspace boosts otherwise comparable results", () => {
  assert.equal(searchGuideIndex(index, "evidence", "en", 6, "report")[0]?.workspace, "report");
});

test("Hindi guide search returns Hindi matches", () => {
  const results = searchGuideIndex(index, "रिपोर्ट ट्रैक", "hi", 6, "track");
  assert.ok(results.some((result) => result.id === "track"));
  assert.ok(results.every((result) => result.hi.title));
});
