"use client";

import { Shell } from "./shell";
import { PortalDialogs } from "./portal-dialogs";
import { V74VisualOverrides } from "./v74-visual-overrides";

export function PortalFrame({ children }: { children: React.ReactNode }) {
  return <Shell><V74VisualOverrides />{children}<PortalDialogs /></Shell>;
}
