"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowRoute } from "./flow-route";
import { PublicRoute } from "./public-route";
import { TrackWorkspace } from "./track";
import { LearnHub } from "./learn-hub";
import { HelpHub } from "./help-hub";
import { applyReportKindSelection, createInitialState } from "@/domains/report";
import { FLOW_ROUTE_SET, LEGACY_FLOW_REDIRECTS } from "@/lib/routes";
import { REPORT_ENTRY_REDIRECTS } from "@/data/demo";
import type { ReportKind, ReportingMode } from "@/lib/types";
import { usePortal } from "./portal-provider";
import { CheckWorkspace } from "./check-workspace";
import { CHECK_MODE_REDIRECTS, type CheckMode } from "@/features/check";

export const HUB_ROUTE_REDIRECTS = Object.freeze({
  safety: "learning-corner",
  awareness: "learning-corner",
  advisories: "learning-corner",
  "daily-digest": "learning-corner",
  training: "learning-corner",
  media: "learning-corner",
  faq: "contact",
  feedback: "contact",
  grievance: "contact",
  "report-abuse": "contact",
  "report-suspect": "contact",
  appeal: "contact"
} as const);

type ReportEntry = { reportKind: ReportKind; reportingMode: ReportingMode };

export function RouteScreen({ routeId }: { routeId: string }) {
  const legacyTarget = (LEGACY_FLOW_REDIRECTS as Record<string, string>)[routeId];
  if (legacyTarget) return <LegacyFlowRedirect target={legacyTarget} />;
  const reportEntry = (REPORT_ENTRY_REDIRECTS as Record<string, ReportEntry>)[routeId];
  if (reportEntry) return <ReportEntryRedirect entry={reportEntry} />;
  const hubTarget = (HUB_ROUTE_REDIRECTS as Record<string, string>)[routeId];
  if (hubTarget) return <HubRedirect target={hubTarget} />;
  const checkMode = (CHECK_MODE_REDIRECTS as Record<string, CheckMode>)[routeId];
  if (checkMode) return <CheckModeRedirect mode={checkMode} />;
  if (routeId === "official-tools") return <Suspense fallback={<CheckFallback />}><CheckWorkspace /></Suspense>;
  if (routeId === "track") return <TrackWorkspace />;
  if (routeId === "learning-corner") return <LearnHub />;
  if (routeId === "contact") return <HelpHub />;
  if (FLOW_ROUTE_SET.has(routeId)) return <FlowRoute routeId={routeId} />;
  return <PublicRoute routeId={routeId} />;
}

function CheckModeRedirect({ mode }: { mode: CheckMode }) {
  const router = useRouter();
  const { language } = usePortal();
  const destination = mode === "identifier" ? "/official-tools" : `/official-tools?mode=${mode}`;
  useEffect(() => { router.replace(destination); }, [destination, router]);
  return <RedirectNotice title={language === "hi" ? "जाँच कार्यक्षेत्र खुल रहा है" : "Opening the Check workspace"} body={language === "hi" ? "यह पुराना लिंक अब एक ही सरल जाँच कार्यक्षेत्र में जारी रहता है।" : "This older link now continues in the single simplified Check workspace."} destination={destination} />;
}

function HubRedirect({ target }: { target: string }) {
  const router = useRouter();
  const { language } = usePortal();
  const destination = `/${target}`;
  useEffect(() => { router.replace(destination); }, [destination, router]);
  return <RedirectNotice title={language === "hi" ? "सरल हब खुल रहा है" : "Opening the simplified hub"} body={language === "hi" ? "यह पुरानी श्रेणी अब उसी एकीकृत Learn या Help हब में उपलब्ध है।" : "This older category now continues in the unified Learn or Help hub."} destination={destination} />;
}

function CheckFallback() { return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">Check</h1></div>; }

function ReportEntryRedirect({ entry }: { entry: ReportEntry }) {
  const router = useRouter();
  const { hydrated, language, mutateReport } = usePortal();
  useEffect(() => {
    if (!hydrated) return;
    mutateReport((draft) => {
      if (entry.reportKind === "unselected") Object.assign(draft, createInitialState());
      else applyReportKindSelection(draft, entry.reportKind);
      draft.reportingMode = entry.reportingMode;
      draft.route = "incident";
    });
    router.replace("/incident");
    // `mutateReport` intentionally follows report state; route hydration owns this one-time redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.reportKind, entry.reportingMode, hydrated, router]);
  return <RedirectNotice title={language === "hi" ? "रिपोर्ट कार्यक्षेत्र खुल रहा है" : "Opening the report workspace"} body={language === "hi" ? "यह पुराना रास्ता अब उसी पाँच-चरण वाली अनुकूल रिपोर्ट में जारी रहता है।" : "This older entry now continues in the same adaptive five-stage report."} destination="/incident" />;
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
  return <RedirectNotice title={language === "hi" ? "अपडेट किया गया रिपोर्ट चरण खुल रहा है" : "Opening the updated report step"} body={language === "hi" ? "यह पुराना लिंक अब सरल पाँच-चरण वाली रिपोर्ट में जारी रहता है।" : "This report link now continues in the simpler five-step journey."} destination={href} />;
}

function RedirectNotice({ title, body, destination }: { title: string; body: string; destination: string }) {
  const { language } = usePortal();
  return <div className="mx-auto max-w-content px-5 py-12 md:px-8"><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-3 max-w-2xl text-muted">{body}</p><Link href={destination} className="mt-5 inline-flex min-h-11 items-center rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "जारी रखें" : "Continue"}</Link></div>;
}
