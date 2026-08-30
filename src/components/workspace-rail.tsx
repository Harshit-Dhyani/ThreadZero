"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigationContextFor, navigationLabel } from "@/lib/navigation";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

const pathFor = (route: string) => route === "home" ? "/" : `/${route}`;

export function WorkspaceRail({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  const router = useRouter();
  const context = navigationContextFor(routeId);
  if (!context) return null;

  const label = localized(context.label, language);
  return <aside className="min-w-0">
    <label className="grid gap-2 text-sm font-semibold lg:hidden">
      <span>{language === "hi" ? `${label} अनुभाग चुनें` : `Choose ${label} section`}</span>
      <select value={routeId} onChange={(event) => router.push(pathFor(event.target.value))} className="min-h-11 rounded-control border border-line bg-white px-3 font-normal text-ink">
        {context.items.map((item) => <option key={item.route} value={item.route}>{navigationLabel(item, language)}</option>)}
      </select>
    </label>

    <nav aria-label={language === "hi" ? `${label} अनुभाग` : `${label} sections`} className="sticky top-5 hidden rounded-panel border border-line bg-white p-3 lg:block">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{label}</p>
      {context.items.map((item) => <Link key={item.route} href={pathFor(item.route)} aria-current={item.route === routeId ? "page" : undefined} className={`flex min-h-12 items-center rounded-control px-3 text-sm font-semibold transition-colors ${item.route === routeId ? "bg-civic-50 text-civic-700" : "text-ink hover:bg-civic-50 hover:text-civic-700"}`}>{navigationLabel(item, language)}</Link>)}
    </nav>
  </aside>;
}
