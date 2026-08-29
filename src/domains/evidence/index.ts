import type { EvidenceItem } from "../../lib/types.ts";

export function validateEvidence(evidence: EvidenceItem[], extractionConfirmed: boolean): Record<string, string> {
  const errors: Record<string, string> = {};
  const allowed = new Set(["have", "missing", "unsure"]);
  evidence.forEach((item) => {
    if (!allowed.has(item.availability)) errors[item.id] = "Choose I have it, I don't have it, or Not sure.";
  });
  if (evidence.some((item) => item.availability === "have" && item.extractionRequired) && !extractionConfirmed) {
    errors.extraction = "Confirm the suggested payment details before continuing.";
  }
  return errors;
}
