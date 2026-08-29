"use client";

import Link from "next/link";
import { ArrowRight, Check, Circle, ExternalLink, FileCheck2 } from "lucide-react";
import { evidenceForReportKind, reportProgressSummary } from "@/domains/report";
import { FLOW_STAGES } from "@/data/demo";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

export function TrackWorkspace() {
  const { language, report, navigate } = usePortal();
  const progress = reportProgressSummary(report);
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const official = OFFICIAL_DESTINATIONS.officialTrack;
  const hasStarted = report.reportKind !== "unselected" || report.completed.length > 0;

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span>{language === "hi" ? "प्रगति" : "Progress"}</span></nav>
    <header className="mt-6 max-w-3xl"><h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{language === "hi" ? "आपकी प्रगति" : "Your progress"}</h1><p className="mt-4 text-base leading-7 text-muted">{language === "hi" ? "यह पेज केवल इस ThreadZero डेमो में आपकी रिपोर्ट तैयारी दिखाता है। यह सरकारी शिकायत की स्थिति नहीं है।" : "This page shows only your report preparation inside this ThreadZero demo. It is not government complaint status."}</p></header>

    <section className="mt-8 border-y border-line py-6"><div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start"><div><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "रिपोर्ट तैयारी" : "Report preparation"}</p><h2 className="mt-2 text-2xl font-semibold">{hasStarted ? (language === "hi" ? `${progress.completed}/${progress.totalStages} चरण पूरे` : `${progress.completed}/${progress.totalStages} stages complete`) : (language === "hi" ? "अभी शुरू नहीं किया" : "Not started yet")}</h2></div><span className="text-sm font-semibold text-civic-700">{Math.round(progress.completed / progress.totalStages * 100)}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-civic-100" aria-label={language === "hi" ? "रिपोर्ट प्रगति" : "Report progress"}><div className="h-full bg-civic-600" style={{ width: `${Math.round(progress.completed / progress.totalStages * 100)}%` }} /></div><ol className="mt-6 divide-y divide-line border-y border-line">{FLOW_STAGES.map((stage, index) => {
      const done = report.completed.includes(stage.id);
      const current = !done && progress.next === stage.id;
      return <li key={stage.id} className="flex min-h-14 items-center gap-3 py-2"><span className={`grid size-8 shrink-0 place-items-center rounded-full ${done ? "bg-success text-white" : current ? "bg-civic-600 text-white" : "border border-line bg-white text-muted"}`}>{done ? <Check className="size-4" /> : index + 1}</span><span className="flex-1 text-sm font-semibold">{stageLabel(stage.id, language)}</span><span className="text-xs text-muted">{done ? (language === "hi" ? "पूरा" : "Done") : current ? (language === "hi" ? "अगला" : "Next") : ""}</span></li>;
    })}</ol><button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" onClick={() => navigate(hasStarted ? progress.next : "incident")}>{hasStarted ? (language === "hi" ? "तैयारी जारी रखें" : "Continue preparation") : (language === "hi" ? "रिपोर्ट तैयारी शुरू करें" : "Start report preparation")}<ArrowRight className="size-4" /></button></div>

    <aside className="border-l border-line pl-5"><FileCheck2 className="size-6 text-civic-700" /><h2 className="mt-3 text-lg font-semibold">{language === "hi" ? "साक्ष्य तैयारी" : "Evidence readiness"}</h2>{progress.evidence.total === 0 ? <p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "पहले What happened? चरण में घटना प्रकार चुनें।" : "Choose the incident type in What happened? first."}</p> : <dl className="mt-4 grid grid-cols-3 gap-3 text-center"><div><dt className="text-xs text-muted">{language === "hi" ? "है" : "Have"}</dt><dd className="mt-1 text-xl font-semibold text-success">{progress.evidence.have}</dd></div><div><dt className="text-xs text-muted">{language === "hi" ? "नहीं" : "Missing"}</dt><dd className="mt-1 text-xl font-semibold text-warning">{progress.evidence.missing}</dd></div><div><dt className="text-xs text-muted">{language === "hi" ? "पता नहीं" : "Unsure"}</dt><dd className="mt-1 text-xl font-semibold">{progress.evidence.unsure}</dd></div></dl>}<p className="mt-4 text-xs leading-5 text-muted">{language === "hi" ? "गायब साक्ष्य को विफलता न मानें। तात्कालिक रिपोर्टिंग को केवल हर बॉक्स भरने के लिए न रोकें।" : "Missing evidence is not failure. Do not delay urgent reporting just to fill every box."}</p></aside></div></section>

    {relevantEvidence.length > 0 && <section className="mt-8"><h2 className="text-xl font-semibold">{language === "hi" ? "अभी क्या उपलब्ध है" : "What you have right now"}</h2><ul className="mt-4 divide-y divide-line border-y border-line">{relevantEvidence.slice(0, 6).map((item) => <li key={item.id} className="flex min-h-14 items-center gap-3 py-2"><span className={`grid size-7 shrink-0 place-items-center rounded-full ${item.availability === "have" ? "bg-success-soft text-success" : "bg-canvas text-muted"}`}>{item.availability === "have" ? <Check className="size-4" /> : <Circle className="size-3" />}</span><span className="flex-1 text-sm font-medium">{localized(item.name, language)}</span><span className="text-xs text-muted">{item.availability === "have" ? (language === "hi" ? "मेरे पास है" : "I have it") : item.availability === "missing" ? (language === "hi" ? "नहीं है" : "Missing") : (language === "hi" ? "पता नहीं" : "Not sure")}</span></li>)}</ul></section>}

    <section className="mt-9 border-t border-line pt-7"><div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="text-xl font-semibold">{language === "hi" ? "पहले से आधिकारिक रिपोर्ट की है?" : "Already reported officially?"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted"><strong className="text-ink">{language === "hi" ? "ThreadZero सरकारी केस की स्थिति नहीं देख सकता।" : "ThreadZero cannot see government case status."}</strong> {language === "hi" ? "अपने आधिकारिक acknowledgement/reference के साथ NCRP की आधिकारिक ट्रैकिंग सेवा उपयोग करें।" : "Use the official NCRP tracking service with your official acknowledgement/reference."}</p></div><a className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" href={official.url} target="_blank" rel="noreferrer">{localized(official, language)}<ExternalLink className="size-4" /></a></div><p className="mt-4 text-xs text-muted">{language === "hi" ? `आधिकारिक लिंक जाँचा गया: ${official.verifiedOn}` : `Official link checked: ${official.verifiedOn}`}</p></section>
  </div>;
}

function stageLabel(id: string, language: "en" | "hi" | "hinglish") {
  const labels: Record<string, { en: string; hi: string }> = {
    incident: { en: "What happened?", hi: "क्या हुआ?" },
    details: { en: "Details", hi: "विवरण" },
    evidence: { en: "Evidence", hi: "साक्ष्य" },
    chronology: { en: "Timeline", hi: "समयरेखा" },
    review: { en: "Review & next", hi: "समीक्षा और अगला कदम" }
  };
  return localized(labels[id], language);
}
