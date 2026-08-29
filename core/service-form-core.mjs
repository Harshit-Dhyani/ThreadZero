export function createServiceRecord() {
  return { values: Object.create(null), errors: [], submitted: false };
}

export function validateServiceValues(fields, values, messages) {
  const normalized = Object.create(null);
  const errors = [];
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

export function translateSelectValues(definition, record, fromLanguage, toLanguage) {
  for (const field of definition.fields) {
    if (!field.options?.length || !record.values[field.name]) continue;
    const option = field.options.find((candidate) => candidate[fromLanguage] === record.values[field.name]);
    if (option) record.values[field.name] = option[toLanguage];
  }
  return record;
}
