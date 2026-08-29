"use client";

import { FlowRoute } from "./flow-route";
import { PublicRoute } from "./public-route";
import { TrackWorkspace } from "./track";
import { FLOW_ROUTE_SET } from "@/lib/routes";

export function RouteScreen({ routeId }: { routeId: string }) {
  if (routeId === "track") return <TrackWorkspace />;
  if (FLOW_ROUTE_SET.has(routeId)) return <FlowRoute routeId={routeId} />;
  return <PublicRoute routeId={routeId} />;
}
