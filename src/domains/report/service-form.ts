import type { LocalizedRoute } from "../../lib/types.ts";

export type ServiceRecord = { values: Record<string, string>; errors: Array<{ name: string; message: string }>; submitted: boolean };
export function createServiceRecord(): ServiceRecord { return { values: Object.create(null) as Record<string, string>, errors: [], submitted: false }; }

export function validateServiceValues(fields: LocalizedRoute["fields"], values: Record<string, string>, messages: { required: string; short: string; invalid: string }) {
  const normalized = Object.create(null) as Record<string, string>;
  const errors: ServiceRecord["errors"] = [];
  for (const field of fields) {
    const value = String(values[field.name] || "").trim();
    normalized[field.name] = value;
    let message = "";
    if (field.required && !value) message = messages.required;
    else if (value && field.minLength && value.length < field.minLength) message = messages.short;
    else if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = messages.invalid;
    else if (value && field.type === "url" && !/^https:\/\/[^\s]+$/i.test(value)) message = messages.invalid;
    else if (value && field.pattern && !new RegExp(field.pattern, "i").test(value)) message = messages.invalid;
    if (message) errors.push({ name: field.name, message });
  }
  return { normalized, errors };
}
