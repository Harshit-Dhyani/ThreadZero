import { EN } from "./copy/en.js?v=20260828p";
import { HI } from "./copy/hi.js?v=20260828p";

export const COPY = Object.freeze({ en: EN, hi: HI });

export function assertCatalogParity(left = COPY.en, right = COPY.hi, path = "copy") {
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      throw new Error(`${path}: array shape mismatch`);
    }
    left.forEach((value, index) => assertCatalogParity(value, right[index], `${path}[${index}]`));
    return true;
  }

  if (left && typeof left === "object") {
    if (!right || typeof right !== "object") throw new Error(`${path}: object shape mismatch`);
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    if (leftKeys.join("|") !== rightKeys.join("|")) throw new Error(`${path}: key mismatch`);
    leftKeys.forEach((key) => assertCatalogParity(left[key], right[key], `${path}.${key}`));
    return true;
  }

  if (typeof left !== typeof right || (String(left).trim() && !String(right).trim())) {
    throw new Error(`${path}: missing translation`);
  }
  return true;
}
