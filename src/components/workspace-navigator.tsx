"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CHECK_MODE_REDIRECTS } from "@/features/check";
import { navigationContextFor, navigationLabel } from "@/lib/navigation";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

const pathFor = (route: string) => route === "home" ? "/" : `/${route}`;
const destinationFor = (route: string) => {
  const mode = CHECK_MODE_REDIRECTS[route as keyof typeof CHECK_MODE_REDIRECTS];
  return mode ? `/official-tools?mode=${mode}` : pathFor(route);
};

export function WorkspaceNavigator({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  const router = useRouter();
  const context = navigationContextFor(routeId);
  if (!context) return null;

  const label = localized(context.label, language);
  return <nav aria-label={language === "hi" ? `${label} के पेज` : `${label} pages`} className="mt-6">
    <div className="hidden gap-6 overflow-x-auto border-b border-line md:flex">
      {context.items.map((item) => <Link key={item.route} href={destinationFor(item.route)} aria-current={item.route === routeId ? "page" : undefined} className={`-mb-px flex min-h-11 min-w-11 shrink-0 items-center justify-center border-b-2 px-1 text-sm font-semibold ${item.route === routeId ? "border-civic-600 text-civic-700" : "border-transparent text-muted hover:border-civic-100 hover:text-civic-700"}`}>{navigationLabel(item, language)}</Link>)}
    </div>
    <label className="grid gap-2 md:hidden">
      <span className="text-xs font-semibold text-muted">{language === "hi" ? `${label} पेज चुनें` : `Choose a ${label} page`}</span>
      <select value={routeId} onChange={(event) => router.push(destinationFor(event.target.value))} className="min-h-11 w-full rounded-control border border-line bg-white px-3 text-sm font-semibold text-ink">
        {context.items.map((item) => <option key={item.route} value={item.route}>{navigationLabel(item, language)}</option>)}
      </select>
    </label>
  </nav>;
}
