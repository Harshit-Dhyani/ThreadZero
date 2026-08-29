import { COMPLAINTS_ROUTES } from "./complaints.ts";
import { HELP_ROUTES } from "./help.ts";
import { LEARNING_ROUTES } from "./learning.ts";
import { LEGAL_ROUTES } from "./legal.ts";
import { SUSPECT_ROUTES } from "./suspect.ts";
import { TRACKING_ROUTES } from "./tracking.ts";
import { VOLUNTEERS_ROUTES } from "./volunteers.ts";
import type { Language, LocalizedRoute, LocalizedText, RouteDefinition } from "../../lib/types.ts";
import { localized } from "../../lib/i18n.ts";

export const PORTAL_ROUTES = [
  ...COMPLAINTS_ROUTES,
  ...TRACKING_ROUTES,
  ...SUSPECT_ROUTES,
  ...VOLUNTEERS_ROUTES,
  ...LEARNING_ROUTES,
  ...HELP_ROUTES,
  ...LEGAL_ROUTES
] as RouteDefinition[];

export const ROUTE_BY_ID = Object.fromEntries(PORTAL_ROUTES.map((route) => [route.id, route])) as Record<string, RouteDefinition>;

const text = (value: LocalizedText | null | undefined, language: Language) => localized(value, language);
export function localizeRoute(route: RouteDefinition | undefined, language: Language): LocalizedRoute | null {
  if (!route) return null;
  return {
    ...route,
    label: text(route.label, language),
    eyebrow: text(route.eyebrow, language),
    title: text(route.title, language),
    intro: text(route.intro, language),
    result: text(route.result, language),
    items: route.items.map((item) => ({ ...item, title: text(item.title, language), body: text(item.body, language) })),
    fields: route.fields.map((field) => ({ ...field, label: text(field.label, language), options: field.options?.map((option) => text(option, language)) || [] }))
  };
}
