"use client";

import Link from "next/link";
import { navigationContextFor, navigationLabel } from "@/lib/navigation";
import { usePortal } from "./portal-provider";

const pathFor = (route: string) => route === "home" ? "/" : `/${route}`;

export function WorkspaceNavigator({ routeId }: { routeId: string }) {
  const { language, navigate } = usePortal();
  const context = navigationContextFor(routeId);
  if (!context) return null;

  const label = context.label[language];
  return <nav aria-label={language === "hi" ? `${label} के पेज` : `${label} pages`} className="mt-6 border-b border-line pb-4">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
    <div className="mt-3 hidden gap-1 overflow-x-auto sm:flex">
      {context.items.map((item) => <Link key={item.route} href={pathFor(item.route)} aria-current={item.route === routeId ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center rounded-control px-4 text-sm font-semibold ${item.route === routeId ? "bg-civic-50 text-civic-700" : "text-muted hover:bg-civic-50 hover:text-civic-700"}`}>{navigationLabel(item, language)}</Link>)}
    </div>
    <label className="mt-2 grid gap-2 sm:hidden">
      <span className="sr-only">{language === "hi" ? `${label} पेज चुनें` : `Choose a ${label} page`}</span>
      <select value={routeId} onChange={(event) => navigate(event.target.value)} className="min-h-11 w-full rounded-control border border-line bg-white px-3 text-sm font-semibold text-ink">
        {context.items.map((item) => <option key={item.route} value={item.route}>{navigationLabel(item, language)}</option>)}
      </select>
    </label>
  </nav>;
}
