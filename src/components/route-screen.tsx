"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowRoute } from "./flow-route";
import { PublicRoute } from "./public-route";
import { TrackWorkspace } from "./track";
import { LearningV74, HelpV74 } from "./learning-help-v74";
import { WorkspaceRail } from "./workspace-rail";
import { FLOW_ROUTE_SET, LEGACY_FLOW_REDIRECTS, routeDefinition } from "@/lib/routes";
import { navigationLabel, navigationParent } from "@/lib/navigation";
import { REPORT_ENTRY_REDIRECTS } from "@/data/demo";
import type { ReportKind, ReportingMode } from "@/lib/types";
import { usePortal } from "./portal-provider";
import { CheckWorkspace } from "./check-workspace";
import { CHECK_MODE_REDIRECTS, type CheckMode } from "@/features/check";

type ReportEntry = { reportKind: ReportKind; reportingMode: ReportingMode };

const LEARN_SECONDARY = new Set(["safety", "awareness", "advisories", "daily-digest", "training", "media", "accessibility"]);
const HELP_SECONDARY = new Set(["faq", "feedback", "grievance"]);

export function RouteScreen({ routeId }: { routeId: string }) {
  const legacyTarget = (LEGACY_FLOW_REDIRECTS as Record<string, string>)[routeId];
  if (legacyTarget) return <LegacyFlowRedirect target={legacyTarget} />;
  const reportEntry = (REPORT_ENTRY_REDIRECTS as Record<string, ReportEntry>)[routeId];
  if (reportEntry) return <ReportEntryRedirect entry={reportEntry} />;
  const checkMode = (CHECK_MODE_REDIRECTS as Record<string, CheckMode>)[routeId];
  if (checkMode) return <CheckModeRedirect mode={checkMode} />;
  if (routeId === "official-tools") return <Suspense fallback={<CheckFallback />}><CheckWorkspace /></Suspense>;
  if (routeId === "track") return <div className="v74-track-frame"><TrackWorkspace /></div>;
  if (routeId === "learning-corner") return <LearningV74 />;
  if (routeId === "contact") return <HelpV74 />;
  if (FLOW_ROUTE_SET.has(routeId)) return <ReportV74Frame routeId={routeId} />;
  if (LEARN_SECONDARY.has(routeId) || HELP_SECONDARY.has(routeId)) return <SecondaryWorkspaceFrame routeId={routeId} />;
  return <PublicRoute routeId={routeId} />;
}

function ReportV74Frame({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  return <div className="v74-report-frame">
    <div className="mx-auto max-w-content px-5 pt-8 md:px-8 md:pt-10">
      <nav aria-label="Report breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span aria-current="page">{language === "hi" ? "रिपोर्ट" : "Report"}</span></nav>
      <header className="mt-5 border-b border-line pb-7">
        <p className="max-w-[22ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[44px]">{language === "hi" ? "साइबर अपराध रिपोर्ट तैयार करें" : "Prepare a cybercrime report"}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{language === "hi" ? "उचित आधिकारिक गंतव्य पर आगे बढ़ने से पहले क्या हुआ, महत्वपूर्ण विवरण, साक्ष्य और समयरेखा व्यवस्थित करें।" : "Organise what happened, important details, evidence, and the timeline before continuing to the appropriate official destination."}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "ThreadZero जानकारी स्थानीय रूप से तैयार करता है और आधिकारिक प्रणालियों में जमा नहीं करता।" : "ThreadZero prepares information locally and does not submit to official systems."}</p>
      </header>
    </div>
    <div className="v74-report-body"><FlowRoute routeId={routeId} /></div>
  </div>;
}

function SecondaryWorkspaceFrame({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  const route = routeDefinition(routeId, language);
  const parent = navigationParent(routeId);
  if (!route) return null;
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span>/</span>{parent && <><Link className="inline-flex min-h-11 items-center" href={`/${parent.route}`}>{navigationLabel(parent, language)}</Link><span>/</span></>}<span aria-current="page">{route.label}</span></nav>
    <div className="mt-6 grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
      <WorkspaceRail routeId={routeId} />
      <div className="v74-secondary-body min-w-0"><PublicRoute routeId={routeId} /></div>
    </div>
  </div>;
}

function CheckModeRedirect({ mode }: { mode: CheckMode }) {
  const router = useRouter();
  const { language } = usePortal();
  const destination = `/official-tools?mode=${mode}`;
  useEffect(() => { router.replace(destination); }, [destination, router]);
  return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">{language === "hi" ? "जाँच कार्यक्षेत्र खुल रहा है" : "Opening the Check workspace"}</h1><p className="mt-3 text-muted">{language === "hi" ? "यह लिंक अब एकीकृत जाँच कार्यक्षेत्र में जारी रहता है।" : "This link now continues in the unified Check workspace."}</p><Link href={destination} className="mt-5 inline-flex min-h-11 items-center rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "जारी रखें" : "Continue"}</Link></div>;
}

function CheckFallback() { return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">Check</h1></div>; }

function ReportEntryRedirect({ entry }: { entry: ReportEntry }) {
  const router = useRouter();
  const { hydrated, language, mutateReport } = usePortal();
  useEffect(() => {
    if (!hydrated) return;
    mutateReport((draft) => {
      draft.reportKind = entry.reportKind;
      draft.reportingMode = entry.reportingMode;
      draft.womenChildCategory = "";
      draft.incidentChoice = "";
      draft.route = "incident";
      draft.completed = [];
      draft.reviewed = false;
      draft.submission = "idle";
      draft.locked = false;
      draft.extractionConfirmed = false;
    });
    router.replace("/incident");
    // `mutateReport` is intentionally omitted: its identity follows report state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.reportKind, entry.reportingMode, hydrated, router]);
  return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">{language === "hi" ? "रिपोर्ट कार्यक्षेत्र खुल रहा है" : "Opening the report workspace"}</h1><p className="mt-3 text-muted">{language === "hi" ? "यह पुराना रास्ता अब उसी पाँच-चरण वाली रिपोर्ट में जारी रहता है।" : "This older entry now continues in the same five-stage report."}</p><Link href="/incident" className="mt-5 inline-flex min-h-11 items-center rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "जारी रखें" : "Continue"}</Link></div>;
}

function LegacyFlowRedirect({ target }: { target: string }) {
  const router = useRouter();
  const { language } = usePortal();
  const [href, setHref] = useState(`/${target}`);
  useEffect(() => {
    const destination = `/${target}${window.location.search}${window.location.hash}`;
    setHref(destination);
    router.replace(destination);
  }, [router, target]);
  return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">{language === "hi" ? "अपडेट किया गया रिपोर्ट चरण खुल रहा है" : "Opening the updated report step"}</h1><p className="mt-3 text-muted">{language === "hi" ? "यह पुराना लिंक अब सरल पाँच-चरण वाली रिपोर्ट में जारी रहता है।" : "This report link now continues in the simpler five-step journey."}</p><Link href={href} className="mt-5 inline-flex min-h-11 items-center rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "जारी रखें" : "Continue"}</Link></div>;
}
