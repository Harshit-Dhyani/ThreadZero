"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowRoute } from "./flow-route";
import { PublicRoute } from "./public-route";
import { TrackWorkspace } from "./track";
import { LearningV73, HelpV73 } from "./learning-help-v73";
import { FLOW_ROUTE_SET, LEGACY_FLOW_REDIRECTS } from "@/lib/routes";
import { REPORT_ENTRY_REDIRECTS } from "@/data/demo";
import type { ReportKind, ReportingMode } from "@/lib/types";
import { usePortal } from "./portal-provider";
import { CheckWorkspace } from "./check-workspace";
import { CHECK_MODE_REDIRECTS, type CheckMode } from "@/features/check";

type ReportEntry = { reportKind: ReportKind; reportingMode: ReportingMode };

export function RouteScreen({ routeId }: { routeId: string }) {
  const legacyTarget = (LEGACY_FLOW_REDIRECTS as Record<string, string>)[routeId];
  if (legacyTarget) return <LegacyFlowRedirect target={legacyTarget} />;
  const reportEntry = (REPORT_ENTRY_REDIRECTS as Record<string, ReportEntry>)[routeId];
  if (reportEntry) return <ReportEntryRedirect entry={reportEntry} />;
  const checkMode = (CHECK_MODE_REDIRECTS as Record<string, CheckMode>)[routeId];
  if (checkMode) return <CheckModeRedirect mode={checkMode} />;
  if (routeId === "official-tools") return <Suspense fallback={<CheckFallback />}><CheckWorkspace /></Suspense>;
  if (routeId === "track") return <TrackWorkspace />;
  if (routeId === "learning-corner") return <LearningV73 />;
  if (routeId === "contact") return <HelpV73 />;
  if (FLOW_ROUTE_SET.has(routeId)) return <FlowRoute routeId={routeId} />;
  return <PublicRoute routeId={routeId} />;
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
