import { COMPLAINTS_ROUTES } from "./portal-routes/complaints.mjs";
import { TRACKING_ROUTES } from "./portal-routes/tracking.mjs";
import { SUSPECT_ROUTES } from "./portal-routes/suspect.mjs";
import { VOLUNTEERS_ROUTES } from "./portal-routes/volunteers.mjs";
import { LEARNING_ROUTES } from "./portal-routes/learning.mjs";
import { HELP_ROUTES } from "./portal-routes/help.mjs";
import { LEGAL_ROUTES } from "./portal-routes/legal.mjs";

export const PORTAL_ROUTES = Object.freeze([
  ...COMPLAINTS_ROUTES,
  ...TRACKING_ROUTES,
  ...SUSPECT_ROUTES,
  ...VOLUNTEERS_ROUTES,
  ...LEARNING_ROUTES,
  ...HELP_ROUTES,
  ...LEGAL_ROUTES
]);

export const CONTENT_ROUTES = Object.freeze(PORTAL_ROUTES.map((route) => route.id));
export const ROUTE_BY_ID = Object.freeze(Object.fromEntries(PORTAL_ROUTES.map((route) => [route.id, route])));
export const ROUTE_GROUPS = Object.freeze([...new Set(PORTAL_ROUTES.map((route) => route.group))]);

export function localizeRoute(route, language = "en") {
  if (!route) return null;
  const localize = (value) => value?.[language] || value?.en || "";
  return {
    ...route,
    label: localize(route.label),
    eyebrow: localize(route.eyebrow),
    title: localize(route.title),
    intro: localize(route.intro),
    result: localize(route.result),
    items: route.items.map((entry) => ({ ...entry, title: localize(entry.title), body: localize(entry.body) })),
    fields: route.fields.map((entry) => ({ ...entry, label: localize(entry.label), options: entry.options?.map(localize) || [] }))
  };
}
