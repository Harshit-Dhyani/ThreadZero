import { inferIdentifierType } from "../guide/index.ts";

export type CheckMode = "identifier" | "website" | "mobile";
export type CheckIdentifierType = ReturnType<typeof inferIdentifierType>;
export type CheckOutcome = {
  value: string;
  detectedType: CheckIdentifierType;
  status: "match" | "no-match";
  destination: "officialSuspectSearch" | "officialSuspectWebsite" | "officialTafcop";
};

export const CHECK_MODE_REDIRECTS = Object.freeze({
  "check-identifier": "identifier",
  "check-website": "website",
  "mobile-connections": "mobile"
} satisfies Record<string, CheckMode>);

export const CHECK_LEGACY_DESTINATIONS = Object.freeze({
  "report-abuse": "contact",
  "report-suspect": "contact",
  appeal: "contact"
} as const);

export const CHECK_MODES = Object.freeze(["identifier", "website", "mobile"] as const);

const FIXTURES = new Set([
  "demo@example.test",
  "demo@upi",
  "9000000000",
  "123456789012",
  "https://example.test"
]);

export function normalizeCheckMode(value: unknown): CheckMode {
  return CHECK_MODES.includes(value as CheckMode) ? value as CheckMode : "identifier";
}

export function resolveCheckOutcome(value: unknown, mode: CheckMode): CheckOutcome {
  const normalized = String(value || "").trim().replace(/\/$/, "");
  const detectedType = inferIdentifierType(normalized);
  return {
    value: normalized,
    detectedType,
    status: FIXTURES.has(normalized.toLocaleLowerCase()) ? "match" : "no-match",
    destination: mode === "mobile" ? "officialTafcop" : mode === "website" || detectedType === "url" ? "officialSuspectWebsite" : "officialSuspectSearch"
  };
}
