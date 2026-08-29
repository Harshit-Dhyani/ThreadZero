"use client";

import { ExternalLink } from "lucide-react";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import type { LocalizedRoute } from "@/lib/routes";
import { usePortal } from "./portal-provider";

export function SourceStrip({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  if (!route.sources.length) return null;
  return <details className="mt-6 border-y border-line"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-sm font-semibold"><ExternalLink className="size-4" />{language === "hi" ? "स्रोत · आधिकारिक संदर्भ" : "Source · Official references"}<span className="ml-auto">+</span></summary><div className="grid gap-2 pb-4 sm:grid-cols-2">{route.sources.map((key) => { const source = (OFFICIAL_DESTINATIONS as Record<string, any>)[key]; return source ? <a key={key} href={source.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-line px-4 text-sm font-semibold text-civic-700 hover:bg-civic-50">{source[language]}<ExternalLink className="size-4" /></a> : null; })}</div></details>;
}
