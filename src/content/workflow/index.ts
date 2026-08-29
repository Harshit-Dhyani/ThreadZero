import { EN } from "./en.ts";
import { HI } from "./hi.ts";
import { romanizeCatalog } from "../../lib/i18n.ts";

export const HINGLISH = Object.freeze(romanizeCatalog(HI));
export const WORKFLOW_COPY = { en: EN, hi: HI, hinglish: HINGLISH } as const;

export function assertCatalogParity(left: unknown = EN, right: unknown = HI, path = "copy"): true {
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) throw new Error(`${path}: array shape mismatch`);
    left.forEach((value, index) => assertCatalogParity(value, right[index], `${path}[${index}]`));
    return true;
  }
  if (left && typeof left === "object") {
    if (!right || typeof right !== "object") throw new Error(`${path}: object shape mismatch`);
    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftRecord).sort();
    const rightKeys = Object.keys(rightRecord).sort();
    if (leftKeys.join("|") !== rightKeys.join("|")) throw new Error(`${path}: key mismatch`);
    leftKeys.forEach((key) => assertCatalogParity(leftRecord[key], rightRecord[key], `${path}.${key}`));
    return true;
  }
  if (typeof left !== typeof right || (String(left).trim() && !String(right).trim())) throw new Error(`${path}: missing translation`);
  return true;
}
