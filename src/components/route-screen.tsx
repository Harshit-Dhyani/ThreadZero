"use client";

import { FlowRoute } from "./flow-route";
import { PublicRoute } from "./public-route";
import { TrackWorkspace } from "./track";
import { ComplaintWorkspace, type ComplaintWorkspaceMode } from "./complaint-workspace";
import { FLOW_ROUTE_SET } from "@/lib/routes";

const COMPLAINT_MODES: Record<string, ComplaintWorkspaceMode> = {
  "women-children": "women-child",
  "anonymous-report": "anonymous",
  "registered-report": "with-details",
  "other-cybercrime": "other"
};

export function RouteScreen({ routeId }: { routeId: string }) {
  if (routeId === "track") return <TrackWorkspace />;
  if (FLOW_ROUTE_SET.has(routeId)) return <FlowRoute routeId={routeId} />;
  if (COMPLAINT_MODES[routeId]) return <ComplaintWorkspace mode={COMPLAINT_MODES[routeId]} routeId={routeId} />;
  return <PublicRoute routeId={routeId} />;
}
