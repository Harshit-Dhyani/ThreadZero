import type { ChronologyEvent } from "../../lib/types.ts";

export function validateChronologyEvent(event: ChronologyEvent) {
  const errors: Record<string, string> = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.date = "Enter the event date.";
  if (!/^\d{2}:\d{2}$/.test(event.time)) errors.time = "Enter the event time.";
  const length = event.description.trim().length;
  if (length < 8 || length > 240) errors.description = "Describe the event in 8 to 240 characters.";
  return errors;
}

export function moveChronologyEvent(events: ChronologyEvent[], id: string, direction: "up" | "down") {
  const index = events.findIndex((event) => event.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= events.length) return false;
  const [event] = events.splice(index, 1);
  events.splice(target, 0, event);
  return true;
}
