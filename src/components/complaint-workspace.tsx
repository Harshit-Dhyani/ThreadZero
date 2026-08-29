"use client";

import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { navigationLabel, navigationParent } from "@/lib/navigation";
import { routeDefinition } from "@/lib/routes";
import { usePortal } from "./portal-provider";
import { SourceStrip } from "./source-strip";
import { WorkspaceNavigator } from "./workspace-navigator";

export function ComplaintWorkspace({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  const route = routeDefinition(routeId, language);
  if (!route) return null;
  const parent = navigationParent(routeId);
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-civic-700"><Link className="inline-flex min-h-11 min-w-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span>/</span>{parent && <><Link className="inline-flex min-h-11 min-w-11 items-center" href={`/${parent.route}`}>{navigationLabel(parent, language)}</Link><span>/</span></>}<span aria-current="page">{route.label}</span>{parent && <Link href={`/${parent.route}`} className="ml-auto inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{language === "hi" ? `${navigationLabel(parent, language)} पर वापस` : `Back to ${navigationLabel(parent, language)}`}</Link>}</nav>
    <WorkspaceNavigator routeId={routeId} />
    <header className="mt-7 max-w-3xl border-b border-line pb-8"><h1 className="max-w-[22ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{route.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted">{route.intro}</p></header>
    <WomenChildChoices route={route} />
    <SourceStrip route={route} />
  </div>;
}

function WomenChildChoices({ route }: { route: NonNullable<ReturnType<typeof routeDefinition>> }) {
  const { language } = usePortal();
  const choices = route.items.slice(0, 2);
  const urgent = route.items[2];
  return <section className="mt-8 max-w-4xl"><h2 className="text-2xl font-semibold">{language === "hi" ? "आप कैसे आगे बढ़ना चाहेंगे?" : "How would you like to continue?"}</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{choices.map((choice, index) => <Link key={choice.title} href={`/${choice.route}`} className="group flex min-h-48 flex-col rounded-panel border border-line p-6 hover:border-civic-600"><h3 className="text-xl font-semibold">{choice.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted">{choice.body}</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-civic-700">{index === 0 ? (language === "hi" ? "नाम के बिना जारी रखें" : "Continue without my name") : (language === "hi" ? "विवरण के साथ जारी रखें" : "Continue with details")}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div>{urgent && <aside className="mt-6 flex gap-4 rounded-panel bg-urgent-soft p-5"><TriangleAlert className="mt-0.5 size-6 shrink-0 text-urgent" /><div><h2 className="font-semibold text-urgent">{urgent.title}</h2><p className="mt-1 text-sm leading-6 text-muted">{urgent.body}</p></div></aside>}</section>;
}
