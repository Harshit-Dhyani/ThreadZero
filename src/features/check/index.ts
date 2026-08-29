import { inferIdentifierType } from "../guide/index.ts";

export type CheckMode = "overview" | "identifier" | "website" | "mobile" | "abuse" | "suspect" | "appeal";
export type CheckIdentifierType = ReturnType<typeof inferIdentifierType>;
export type CheckOutcome = {
  value: string;
  detectedType: CheckIdentifierType;
  status: "match" | "no-match";
  destination: "officialSuspectSearch" | "officialSuspectWebsite";
};

export const CHECK_MODE_REDIRECTS = Object.freeze({
  "check-identifier": "identifier",
  "check-website": "website",
  "mobile-connections": "mobile",
  "report-abuse": "abuse",
  "report-suspect": "suspect",
  appeal: "appeal"
} satisfies Record<string, CheckMode>);

export const CHECK_MODES = Object.freeze(["overview", "identifier", "website", "mobile", "abuse", "suspect", "appeal"] as const);

const FIXTURES = new Set([
  "demo@example.test",
  "demo@upi",
  "9000000000",
  "123456789012",
  "https://example.test"
]);

export function normalizeCheckMode(value: unknown): CheckMode {
  return CHECK_MODES.includes(value as CheckMode) ? value as CheckMode : "overview";
}

export function resolveCheckOutcome(value: unknown, mode: CheckMode): CheckOutcome {
  const normalized = String(value || "").trim().replace(/\/$/, "");
  const detectedType = inferIdentifierType(normalized);
  return {
    value: normalized,
    detectedType,
    status: FIXTURES.has(normalized.toLocaleLowerCase()) ? "match" : "no-match",
    destination: mode === "website" || detectedType === "url" ? "officialSuspectWebsite" : "officialSuspectSearch"
  };
}
