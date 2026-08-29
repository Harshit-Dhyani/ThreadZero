import { PORTAL_ROUTES, ROUTE_BY_ID, localizeRoute } from "../content/routes/index.ts";
import { STEPS } from "../data/demo.ts";
import { presentationFor, workspaceFor } from "./routing/presentation.ts";
import type { Language, LocalizedRoute, Workspace } from "./types.ts";

export const FLOW_ROUTE_IDS = STEPS.map((step: { id: string }) => step.id) as string[];
export const PUBLIC_ROUTE_IDS = PORTAL_ROUTES.map((route: { id: string }) => route.id) as string[];
export const ALL_ROUTE_IDS = [...new Set([...FLOW_ROUTE_IDS, ...PUBLIC_ROUTE_IDS])];
export const FLOW_ROUTE_SET = new Set(FLOW_ROUTE_IDS);

export function routeDefinition(routeId: string, language: Language): LocalizedRoute | null {
  const route = ROUTE_BY_ID[routeId];
  if (!route) return null;
  return localizeRoute(route, language);
}

export { PORTAL_ROUTES, STEPS, presentationFor, workspaceFor };
export type { Language, LocalizedRoute, Workspace };
