"use client";

import { Shell } from "./shell";
import { PortalDialogs } from "./portal-dialogs";

export function PortalFrame({ children }: { children: React.ReactNode }) {
  return <Shell>{children}<PortalDialogs /></Shell>;
}
