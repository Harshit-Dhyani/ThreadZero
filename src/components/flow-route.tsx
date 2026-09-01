"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Copy, Download, ExternalLink, Pencil, Phone, Plus, RotateCcw, X } from "lucide-react";
import { applyReportKindSelection, canEnterRoute, createReportPreparationPack, evidenceForReportKind, formatDateTime, formatMoney, getStepIndex, markRouteComplete, prepareSimulation, refreshTimelineForReport, reportPresentation, validateDetails, validateEvidence } from "@/domains/report";
import { moveChronologyEvent, validateChronologyEvent } from "@/domains/chronology";
import { WORKFLOW_COPY as COPY } from "@/content/workflow";
import { FLOW_STAGES } from "@/lib/routes";
import { localized } from "@/lib/i18n";
import type { ChronologyEvent, EvidenceAvailability, EvidenceCategory, Incident, Language, LocalizedText, ReportKind, ReportState, ReportingMode, WomenChildCategory } from "@/lib/types";
import { usePortal } from "./portal-provider";
import { ResponsiveIllustration } from "./responsive-illustration";

const fieldClass = "min-h-11 w-full rounded-control border border-line bg-white px-3 font-normal";
const categories: EvidenceCategory[] = ["payment", "messages", "person-account", "links"];
const t = (language: Language, en: string, hi: string) => localized({ en, hi }, language);
const ANONYMOUS_ELIGIBLE = new Set<WomenChildCategory>(["cseam", "sexually-explicit", "sexually-obscene", "rgr-content"]);

const REPORT_KIND_CHOICES: Array<{ value: Exclude<ReportKind, "unselected">; title: LocalizedText; body: LocalizedText }> = [
  { value: "financial", title: { en: "I lost money", hi: "मेरे पैसे का नुकसान हुआ" }, body: { en: "Payment, UPI, investment, marketplace, loan/job, or another financial fraud.", hi: "भुगतान, UPI, निवेश, मार्केटप्लेस, ऋण/नौकरी या अन्य वित्तीय धोखाधड़ी।" } },
  { value: "women-child", title: { en: "Women or child related", hi: "महिला या बच्चे से संबंधित" }, body: { en: "Harmful, abusive, obscene, or sexually explicit online content involving a woman or child.", hi: "महिला या बच्चे से जुड़ी हानिकारक, अपमानजनक, अश्लील या यौन रूप से स्पष्ट ऑनलाइन सामग्री।" } },
  { value: "other", title: { en: "Other cybercrime", hi: "अन्य साइबर अपराध" }, body: { en: "Account access, social-media abuse, impersonation, ransomware, crypto, or another cyber incident.", hi: "खाता एक्सेस, सोशल-मीडिया दुरुपयोग, प्रतिरूपण, रैनसमवेयर, क्रिप्टो या अन्य साइबर घटना।" } },
  { value: "unsure", title: { en: "I’m not sure", hi: "मैं निश्चित नहीं हूँ" }, body: { en: "Organise the facts first without forcing a category that may be wrong.", hi: "गलत श्रेणी चुनने की मजबूरी के बिना पहले तथ्य व्यवस्थित करें।" } }
];

const WOMEN_CHILD_CHOICES: Array<{ value: WomenChildCategory; title: LocalizedText; body: LocalizedText }> = [
  { value: "cseam", title: { en: "Child sexual abuse/exploitative material", hi: "बाल यौन शोषण/उत्पीड़न सामग्री" }, body: { en: "Prepare identifiers, URLs, account details, and timing without uploading content here.", hi: "यहाँ सामग्री अपलोड किए बिना पहचान, URL, खाता विवरण और समय तैयार करें।" } },
  { value: "sexually-explicit", title: { en: "Sexually explicit content", hi: "यौन रूप से स्पष्ट सामग्री" }, body: { en: "Content or communication that may fit the official Women/Children reporting route.", hi: "ऐसी सामग्री या बातचीत जो आधिकारिक महिला/बाल रिपोर्टिंग मार्ग में आ सकती है।" } },
  { value: "sexually-obscene", title: { en: "Sexually obscene content", hi: "यौन रूप से अश्लील सामग्री" }, body: { en: "Preserve the source, account, date, and URL; this demo stores no files.", hi: "स्रोत, खाता, तारीख और URL सुरक्षित रखें; यह डेमो कोई फ़ाइल संग्रहित नहीं करता।" } },
  { value: "rgr-content", title: { en: "Rape / gang-rape related online content", hi: "बलात्कार / सामूहिक बलात्कार से जुड़ी ऑनलाइन सामग्री" }, body: { en: "Prepare only the information needed to find and describe the online material.", hi: "ऑनलाइन सामग्री खोजने और बताने के लिए आवश्यक जानकारी ही तैयार करें।" } },
  { value: "other", title: { en: "Another women/child cybercrime", hi: "अन्य महिला/बाल साइबर अपराध" }, body: { en: "Use the registered official route when the anonymous categories above do not fit.", hi: "ऊपर की अनाम श्रेणियाँ लागू न हों तो पंजीकृत आधिकारिक मार्ग उपयोग करें।" } }
];

const OTHER_CHOICES: Array<{ value: string; title: LocalizedText; body: LocalizedText }> = [
  { value: "account-access", title: { en: "Account or device accessed", hi: "खाते या डिवाइस तक अनधिकृत पहुँच" }, body: { en: "Someone accessed, changed, or controlled an account or device without permission.", hi: "किसी ने बिना अनुमति खाते या डिवाइस तक पहुँच बनाई, बदलाव किया या नियंत्रण लिया।" } },
  { value: "social-media", title: { en: "Social-media cybercrime", hi: "सोशल-मीडिया साइबर अपराध" }, body: { en: "Harassment, misuse, fake profiles, or harmful account activity.", hi: "उत्पीड़न, दुरुपयोग, नकली प्रोफ़ाइल या हानिकारक खाता गतिविधि।" } },
  { value: "impersonation", title: { en: "Identity misuse or impersonation", hi: "पहचान का दुरुपयोग या प्रतिरूपण" }, body: { en: "Someone is using an identity, profile, or account to pose as another person.", hi: "कोई पहचान, प्रोफ़ाइल या खाते का उपयोग करके किसी और के रूप में पेश हो रहा है।" } },
  { value: "ransomware", title: { en: "Ransomware or extortion", hi: "रैनसमवेयर या जबरन वसूली" }, body: { en: "Files, accounts, or systems were locked or threatened for payment or leverage.", hi: "फ़ाइलें, खाते या सिस्टम लॉक किए गए या भुगतान/दबाव के लिए धमकी दी गई।" } },
  { value: "crypto", title: { en: "Cryptocurrency-related crime", hi: "क्रिप्टोकरेंसी से संबंधित अपराध" }, body: { en: "A wallet, exchange, token, or crypto transaction is part of the incident.", hi: "वॉलेट, एक्सचेंज, टोकन या क्रिप्टो लेन-देन घटना का हिस्सा है।" } },
  { value: "other", title: { en: "Something else", hi: "कुछ और" }, body: { en: "Continue with the facts even if none of these descriptions is exact.", hi: "इनमें से कोई विवरण सटीक न हो तब भी तथ्यों के साथ आगे बढ़ें।" } },
  { value: "unsure", title: { en: "I’m not sure", hi: "मैं निश्चित नहीं हूँ" }, body: { en: "Keep the category broad and organise what you know.", hi: "श्रेणी व्यापक रखें और जो जानते हैं उसे व्यवस्थित करें।" } }
];

export function FlowRoute({ routeId }: { routeId: string }) {
  const { hydrated, language, report, mutateReport, navigate, resetReport } = usePortal();
  const c = COPY[language];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorRef = useRef<HTMLDivElement>(null);
  const index = getStepIndex(routeId);

  useEffect(() => {
    if (!hydrated) return;
    if (!canEnterRoute(routeId, report) || report.locked && routeId !== "review") {
      navigate(report.locked ? "review" : report.route === "home" ? "incident" : report.route);
      return;
    }
    mutateReport((draft) => { draft.route = routeId; });
    // Route changes, not report edits, own this synchronization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, routeId]);

  const complete = (next: string) => {
    mutateReport((draft) => { draft.route = routeId; markRouteComplete(draft, routeId); });
    setErrors({});
    navigate(next);
  };
  const fail = (next: Record<string, string>) => {
    setErrors(next);
    requestAnimationFrame(() => errorRef.current?.focus());
  };

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{t(language, "Home", "होम")}</Link><span className="px-2">/</span><Link className="inline-flex min-h-11 items-center" href="/incident">{t(language, "Report", "रिपोर्ट")}</Link><span className="px-2">/</span><span>{c.flow.routes[routeId as keyof typeof c.flow.routes]}</span></nav>
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside data-tour="report-stage-rail" className="min-w-0 self-start rounded-panel border border-line bg-white p-3 lg:sticky lg:top-4">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{c.flow.progress}</p>
        <ol className="flow-step-scrollbar flex gap-2 overflow-x-auto py-2 lg:grid lg:overflow-visible">{FLOW_STAGES.map((stage, stageIndex) => {
          const done = report.completed.includes(stage.id);
          return <li key={stage.id} className="shrink-0 lg:shrink"><button disabled={!canEnterRoute(stage.id, report) || report.locked && stage.id !== "review"} aria-current={stage.id === routeId ? "step" : undefined} className={`flex min-h-11 min-w-32 items-center gap-3 rounded-control px-3 text-left text-sm font-semibold lg:w-full ${stage.id === routeId ? "bg-civic-50 text-civic-700" : done ? "text-success" : "text-muted"}`} onClick={() => navigate(stage.id)}><span className={`grid size-7 shrink-0 place-items-center rounded-full border ${done ? "border-success bg-success text-white" : "border-line"}`}>{done ? <Check className="size-4" /> : stageIndex + 1}</span><span>{c.flow.routes[stage.id as keyof typeof c.flow.routes]}</span></button></li>;
        })}</ol>
      </aside>
      <section data-tour="report-active-step" className="min-w-0 rounded-panel border border-line bg-white p-5 sm:p-7">
        {Object.keys(errors).length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-6 border-l-4 border-urgent bg-urgent-soft p-4"><h2 className="font-semibold text-urgent">{c.common.errorsTitle}</h2><ul className="mt-2 list-disc pl-5 text-sm text-urgent">{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul></div>}
        {routeId === "incident" && <IncidentStep complete={() => complete("details")} fail={fail} />}
        {routeId === "details" && <DetailsStep complete={() => complete("evidence")} fail={fail} />}
        {routeId === "evidence" && <div data-tour="report-evidence"><EvidenceStep complete={() => complete("chronology")} fail={fail} /></div>}
        {routeId === "chronology" && <TimelineStep complete={() => complete("review")} fail={fail} />}
        {routeId === "review" && <ReviewStep fail={fail} />}
        <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-5">{index > 0 && !report.locked && <button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold" onClick={() => navigate(FLOW_STAGES[index - 1].id)}><ArrowLeft className="size-4" />{c.common.back}</button>}<button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold" onClick={() => { resetReport(); navigate("incident"); }}><RotateCcw className="size-4" />{c.common.reset}</button></div>
      </section>
    </div>
  </div>;
}

function Heading({ section }: { section: { eyebrow?: string; title: string; intro: string } }) {
  const { language } = usePortal();
  return <header className="grid gap-5 md:grid-cols-[minmax(0,1fr)_280px] md:items-center"><div>{section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{section.eyebrow}</p> : null}<h1 tabIndex={-1} className={`${section.eyebrow ? "mt-3" : ""} max-w-[25ch] text-[36px] font-semibold leading-tight tracking-[-0.03em] sm:text-[42px]`}>{section.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted">{section.intro}</p></div><ResponsiveIllustration assetId="homePreparationV5" language={language} className="mx-auto max-h-44 w-full max-w-[280px] object-contain" priority /></header>;
}

function ContextBar({ label, language }: { label: string; language: Language }) {
  return <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-3 text-sm"><span className="text-muted">{t(language, "Preparing for", "तैयारी मार्ग")}</span><strong className="text-civic-700">{label}</strong><Link href="/incident" className="ml-auto inline-flex min-h-11 items-center text-xs font-semibold text-civic-700 underline underline-offset-4">{t(language, "Change", "बदलें")}</Link></div>;
}

function Primary({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white hover:bg-civic-700">{children}<ArrowRight className="size-4" /></button>;
}

function IncidentStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport, openAssistant } = usePortal();
  const c = COPY[language];
  const s = c.flow.incident;

  const chooseKind = (kind: Exclude<ReportKind, "unselected">) => mutateReport((draft) => { applyReportKindSelection(draft, kind); });
  const chooseFinancial = (value: string) => mutateReport((draft) => { draft.incidentChoice = value; draft.incident.type = `financial-${value}`; refreshTimelineForReport(draft); });
  const chooseWomenChild = (value: WomenChildCategory) => mutateReport((draft) => {
    draft.womenChildCategory = value;
    draft.incidentChoice = "women-child";
    draft.incident.type = `women-child-${value}`;
    draft.reportingMode = ANONYMOUS_ELIGIBLE.has(value) && draft.reportingMode === "anonymous" ? "anonymous" : "registered";
    refreshTimelineForReport(draft);
  });
  const chooseReportingMode = (mode: ReportingMode) => mutateReport((draft) => { draft.reportingMode = mode; });
  const chooseOther = (value: string) => mutateReport((draft) => { draft.incidentChoice = value; draft.incident.type = `other-${value}`; refreshTimelineForReport(draft); });

  const submit = () => {
    if (report.reportKind === "unselected") return fail({ reportKind: t(language, "Choose what happened before continuing.", "आगे बढ़ने से पहले बताएं क्या हुआ।") });
    if (report.reportKind === "financial" && !report.incidentChoice) return fail({ incidentChoice: s.error });
    if (report.reportKind === "women-child" && !report.womenChildCategory) return fail({ womenChildCategory: t(language, "Choose the closest Women/Child category.", "सबसे निकट महिला/बाल श्रेणी चुनें।") });
    if (report.reportKind === "other" && !report.incidentChoice) return fail({ incidentChoice: t(language, "Choose the closest cybercrime description.", "सबसे निकट साइबर अपराध विवरण चुनें।") });
    complete();
  };

  return <>
    <Heading section={{ eyebrow: s.eyebrow, title: t(language, "What happened?", "क्या हुआ?"), intro: t(language, "Start with your situation. Every later step changes from this choice, so you do not need to understand portal categories first.", "अपनी स्थिति से शुरू करें। आगे के सभी चरण इस चुनाव के अनुसार बदलेंगे, इसलिए पहले पोर्टल की श्रेणियाँ समझना जरूरी नहीं है।") }} />
    <fieldset data-tour="report-family" className="mt-7"><legend className="font-semibold">{t(language, "Which situation is closest?", "कौन-सी स्थिति सबसे निकट है?")}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{REPORT_KIND_CHOICES.map((choice) => <label key={choice.value} className={`flex min-h-28 cursor-pointer gap-3 rounded-panel border p-4 ${report.reportKind === choice.value ? "border-civic-600 bg-civic-50" : "border-line hover:border-civic-300"}`}><input type="radio" name="report-kind" value={choice.value} checked={report.reportKind === choice.value} onChange={() => chooseKind(choice.value)} className="mt-1 size-5" /><span><strong className="block">{localized(choice.title, language)}</strong><span className="mt-1 block text-sm leading-6 text-muted">{localized(choice.body, language)}</span></span></label>)}</div></fieldset>

    {report.reportKind === "financial" && <>
      <aside className="mt-6 border-l-4 border-urgent bg-urgent-soft p-4"><div className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-urgent" /><div><h2 className="font-semibold text-urgent">{t(language, "Lost money recently? Call 1930 now.", "हाल ही में पैसा गया? अभी 1930 पर कॉल करें।")}</h2><p className="mt-1 text-sm leading-6 text-muted">{t(language, "Call manually for urgent help. This demo cannot place the call or freeze funds.", "तात्कालिक सहायता के लिए स्वयं कॉल करें। यह डेमो कॉल नहीं कर सकता या धन नहीं रोक सकता।")}</p></div></div></aside>
      <fieldset className="mt-7"><legend className="font-semibold">{s.legend}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{s.choices.map((choice: any) => <label key={choice.value} className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.incidentChoice === choice.value ? "border-civic-600 bg-civic-50" : "border-line hover:border-civic-300"}`}><input type="radio" name="incident-choice" value={choice.value} checked={report.incidentChoice === choice.value} onChange={() => chooseFinancial(choice.value)} className="mt-1 size-5" /><span><strong className="block">{choice.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{choice.body}</span></span></label>)}</div></fieldset>
    </>}

    {report.reportKind === "women-child" && <>
      <fieldset className="mt-7"><legend className="font-semibold">{t(language, "What does the incident involve?", "घटना किससे संबंधित है?")}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{WOMEN_CHILD_CHOICES.map((choice) => <label key={choice.value} className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.womenChildCategory === choice.value ? "border-civic-600 bg-civic-50" : "border-line hover:border-civic-300"}`}><input type="radio" name="women-child-category" value={choice.value} checked={report.womenChildCategory === choice.value} onChange={() => chooseWomenChild(choice.value)} className="mt-1 size-5" /><span><strong className="block">{localized(choice.title, language)}</strong><span className="mt-1 block text-sm leading-6 text-muted">{localized(choice.body, language)}</span></span></label>)}</div></fieldset>
      {report.womenChildCategory && <fieldset className="mt-7"><legend className="font-semibold">{t(language, "Which official route are you preparing for?", "आप किस आधिकारिक मार्ग के लिए तैयारी कर रहे हैं?")}</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{ANONYMOUS_ELIGIBLE.has(report.womenChildCategory) && <label className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.reportingMode === "anonymous" ? "border-civic-600 bg-civic-50" : "border-line"}`}><input type="radio" name="reporting-mode" checked={report.reportingMode === "anonymous"} onChange={() => chooseReportingMode("anonymous")} className="mt-1 size-5" /><span><strong className="block">{t(language, "Without sharing my name", "नाम साझा किए बिना")}</strong><span className="mt-1 block text-sm leading-6 text-muted">{t(language, "Only for eligible Women/Child categories on the current official service.", "मौजूदा आधिकारिक सेवा पर केवल पात्र महिला/बाल श्रेणियों के लिए।")}</span></span></label>}<label className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.reportingMode === "registered" ? "border-civic-600 bg-civic-50" : "border-line"}`}><input type="radio" name="reporting-mode" checked={report.reportingMode === "registered"} onChange={() => chooseReportingMode("registered")} className="mt-1 size-5" /><span><strong className="block">{t(language, "With my details on the official portal", "आधिकारिक पोर्टल पर मेरे विवरण के साथ")}</strong><span className="mt-1 block text-sm leading-6 text-muted">{t(language, "This demo does not collect your real identity or contact details.", "यह डेमो आपकी वास्तविक पहचान या संपर्क विवरण नहीं लेता।")}</span></span></label></div></fieldset>}
    </>}

    {report.reportKind === "other" && <fieldset className="mt-7"><legend className="font-semibold">{t(language, "Which description is closest?", "कौन-सा विवरण सबसे निकट है?")}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{OTHER_CHOICES.map((choice) => <label key={choice.value} className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.incidentChoice === choice.value ? "border-civic-600 bg-civic-50" : "border-line hover:border-civic-300"}`}><input type="radio" name="other-incident-choice" value={choice.value} checked={report.incidentChoice === choice.value} onChange={() => chooseOther(choice.value)} className="mt-1 size-5" /><span><strong className="block">{localized(choice.title, language)}</strong><span className="mt-1 block text-sm leading-6 text-muted">{localized(choice.body, language)}</span></span></label>)}</div></fieldset>}

    <button className="mt-5 min-h-11 text-sm font-semibold text-civic-700 underline underline-offset-4" onClick={() => openAssistant("report")}>{t(language, "Need help choosing?", "चुनने में मदद चाहिए?")}</button><br />
    <Primary onClick={submit}>{c.common.continue}</Primary>
  </>;
}

function DetailsStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { report, mutateReport, language } = usePortal();
  const c = COPY[language];
  const s = c.flow.details;
  const presentation = reportPresentation(report, language);
  const financial = report.reportKind === "financial";
  const set = (name: keyof Incident, value: string) => mutateReport((draft) => { draft.incident[name] = value; });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateDetails(report.incident, report.reportKind);
    Object.keys(errors).length ? fail(Object.fromEntries(Object.keys(errors).map((key) => [key, s.errors[key as keyof typeof s.errors] || errors[key]]))) : complete();
  };

  return <form onSubmit={submit} noValidate><Heading section={{ eyebrow: s.eyebrow, title: presentation.details.title, intro: presentation.details.intro }} /><ContextBar label={presentation.review.label} language={language} /><div className="mt-7 grid gap-5 sm:grid-cols-2">
    <label className="grid gap-2 text-sm font-semibold"><span>{s.date}</span><input className={fieldClass} type="date" value={report.incident.date} onChange={(event) => set("date", event.target.value)} /></label>
    <label className="grid gap-2 text-sm font-semibold"><span>{s.time}</span><input className={fieldClass} type="time" value={report.incident.time} onChange={(event) => set("time", event.target.value)} /></label>
    {financial && <>
      <label className="grid gap-2 text-sm font-semibold"><span>{s.amount}</span><input className={fieldClass} type="number" min="0" value={report.incident.amount} onChange={(event) => set("amount", event.target.value)} /></label>
      <label className="grid gap-2 text-sm font-semibold"><span>{s.paymentMethod}</span><select className={fieldClass} value={report.incident.paymentMethod} onChange={(event) => set("paymentMethod", event.target.value)}><option value="">{s.choosePayment}</option>{s.paymentOptions.map((option: string) => <option key={option}>{option}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-semibold"><span>{s.transactionReference}</span><input className={fieldClass} type="text" inputMode="numeric" value={report.incident.transactionReference} onChange={(event) => set("transactionReference", event.target.value)} /></label>
      <label className="grid gap-2 text-sm font-semibold"><span>{s.recipientIdentifier}</span><input className={fieldClass} type="text" value={report.incident.recipientIdentifier} onChange={(event) => set("recipientIdentifier", event.target.value)} /></label>
    </>}
    <label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>{s.contactChannel}</span><select className={fieldClass} value={report.incident.contactChannel} onChange={(event) => set("contactChannel", event.target.value)}><option value="">{s.chooseChannel}</option>{s.channelOptions.map((option: string) => <option key={option}>{option}</option>)}</select></label>
    <label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>{financial ? s.narrative : t(language, "What happened?", "क्या हुआ?")}</span><textarea className="min-h-36 rounded-control border border-line p-3 font-normal" maxLength={600} value={report.incident.narrative} onChange={(event) => set("narrative", event.target.value)} /><span className="font-normal text-muted">{presentation.details.narrativeHelp} · {report.incident.narrative.length}/600</span></label>
  </div><p className="mt-5 text-sm text-muted">{t(language, "Demo only. Nothing entered here is sent to the government, and this demo does not need your real identity.", "केवल डेमो। यहाँ दर्ज कुछ भी सरकार को नहीं भेजा जाता और इस डेमो को आपकी वास्तविक पहचान की जरूरत नहीं है।")}</p><Primary type="submit">{c.common.continue}</Primary></form>;
}

function EvidenceStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport } = usePortal();
  const c = COPY[language];
  const s = c.flow.evidence;
  const presentation = reportPresentation(report, language);
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const visibleCategories = categories.filter((category) => relevantEvidence.some((item) => item.category === category));
  const labels = { payment: t(language, "Payment", "भुगतान"), messages: t(language, "Messages", "संदेश"), "person-account": t(language, "Person or account", "व्यक्ति या खाता"), links: t(language, "Links", "लिंक"), have: t(language, "I have it", "मेरे पास है"), missing: t(language, "I don’t have it", "मेरे पास नहीं है"), unsure: t(language, "Not sure", "पता नहीं"), why: t(language, "Why it helps", "यह क्यों उपयोगी है"), where: t(language, "Where to find it", "कहाँ मिलेगा"), connect: t(language, "Connect to Timeline", "समयरेखा से जोड़ें") };
  const setAvailability = (id: string, availability: EvidenceAvailability) => mutateReport((draft) => { const item = draft.evidence.find((candidate) => candidate.id === id); if (item) item.availability = availability; });
  const toggleEvent = (evidenceId: string, eventId: string) => mutateReport((draft) => { const item = draft.evidence.find((candidate) => candidate.id === evidenceId); if (!item) return; item.relatedEventIds = item.relatedEventIds.includes(eventId) ? item.relatedEventIds.filter((id) => id !== eventId) : [...item.relatedEventIds, eventId]; });
  const submit = () => {
    const errors = validateEvidence(relevantEvidence, report.extractionConfirmed);
    Object.keys(errors).length ? fail(Object.fromEntries(Object.keys(errors).map((key) => [key, key === "extraction" ? s.errors.extraction : s.errors.item]))) : complete();
  };
  const confirmNeeded = relevantEvidence.some((item) => item.extractionRequired && item.availability === "have");
  return <><Heading section={{ eyebrow: s.eyebrow, title: presentation.evidence.title, intro: presentation.evidence.intro }} /><ContextBar label={presentation.review.label} language={language} />{relevantEvidence.length === 0 ? <p className="mt-6 text-sm text-muted">{t(language, "Choose what happened in Step 1 before preparing evidence.", "साक्ष्य तैयार करने से पहले चरण 1 में बताएं क्या हुआ।")}</p> : <div className="mt-7 grid gap-8">{visibleCategories.map((category) => <section key={category}><h2 className="border-b border-line pb-3 text-xl font-semibold">{labels[category]}</h2><div className="divide-y divide-line">{relevantEvidence.filter((item) => item.category === category).map((item) => <article key={item.id} className="py-5"><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]"><div><h3 className="font-semibold">{localized(item.name, language)}</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold text-civic-700">{labels.why}</dt><dd className="mt-1 leading-6 text-muted">{localized(item.whyUseful, language)}</dd></div><div><dt className="font-semibold text-civic-700">{labels.where}</dt><dd className="mt-1 leading-6 text-muted">{localized(item.whereToFind, language)}</dd></div></dl></div><fieldset><legend className="text-sm font-semibold">{t(language, "Do you have it?", "क्या यह आपके पास है?")}</legend><div className="mt-2 grid grid-cols-3 gap-2">{(["have", "missing", "unsure"] as const).map((value) => <label key={value} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-control border px-2 text-center text-xs font-semibold ${item.availability === value ? "border-civic-600 bg-civic-50 text-civic-700" : "border-line"}`}><input className="sr-only" type="radio" name={`availability-${item.id}`} checked={item.availability === value} onChange={() => setAvailability(item.id, value)} />{labels[value]}</label>)}</div></fieldset></div><details className="mt-4"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-civic-700">{labels.connect} ({item.relatedEventIds.length})</summary><div className="grid gap-2 bg-canvas p-3 sm:grid-cols-2">{report.events.map((event) => <label key={event.id} className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5" checked={item.relatedEventIds.includes(event.id)} onChange={() => toggleEvent(item.id, event.id)} /><span>{event.description}</span></label>)}</div></details></article>)}</div></section>)}</div>}{confirmNeeded && <div className="mt-7 max-w-form border-y border-line bg-civic-50 py-5"><h2 className="text-lg font-semibold">{s.extractionTitle}</h2><p className="mt-2 text-sm leading-6 text-muted">{s.extractionBody}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm">{Object.entries(report.extracted).map(([key, value]) => <div key={key}><dt className="text-xs text-muted">{key}</dt><dd className="font-semibold">{String(value)}</dd></div>)}</dl><label className="mt-5 flex gap-3"><input type="checkbox" className="mt-1 size-5" checked={report.extractionConfirmed} onChange={(event) => mutateReport((draft) => { draft.extractionConfirmed = event.target.checked; })} /><span className="text-sm">{s.extractionChoice}</span></label></div>}<Primary onClick={submit}>{c.common.continue}</Primary></>;
}

function TimelineStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport } = usePortal();
  const c = COPY[language];
  const s = c.flow.chronology;
  const presentation = reportPresentation(report, language);
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const empty: ChronologyEvent = { id: "", date: report.incident.date || "2026-08-25", time: report.incident.time || "19:00", description: "", detail: "" };
  const [editing, setEditing] = useState<ChronologyEvent | null>(null);
  const [eventErrors, setEventErrors] = useState<Record<string, string>>({});
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const validation = validateChronologyEvent(editing);
    if (Object.keys(validation).length) { setEventErrors(validation); fail(Object.fromEntries(Object.keys(validation).map((key) => [key, s.errors[key as keyof typeof s.errors] || validation[key]]))); return; }
    mutateReport((draft) => {
      const index = draft.events.findIndex((item) => item.id === editing.id);
      const value = { ...editing, id: editing.id || `event-custom-${draft.events.length + 1}` };
      if (index >= 0) draft.events[index] = value;
      else draft.events.push(value);
    });
    setEditing(null);
    setEventErrors({});
  };
  return <><Heading section={{ eyebrow: s.eyebrow, title: presentation.timeline.title, intro: presentation.timeline.intro }} /><ContextBar label={presentation.review.label} language={language} /><ol className="mt-7 divide-y divide-line border-y border-line">{report.events.map((event, index) => {
    const linked = relevantEvidence.filter((item) => item.relatedEventIds.includes(event.id));
    return <li key={event.id} className="grid gap-4 py-5 sm:grid-cols-[42px_1fr_auto]"><span className="grid size-9 place-items-center rounded-full bg-civic-600 font-semibold text-white">{index + 1}</span><div><h2 className="font-semibold">{event.description}</h2><p className="mt-1 text-sm leading-6 text-muted">{event.date} · {event.time}{event.detail ? ` · ${event.detail}` : ""}</p>{linked.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{linked.map((item) => <li key={item.id} className="rounded-full bg-civic-50 px-3 py-1 text-xs font-semibold text-civic-700">{localized(item.name, language)}</li>)}</ul>}</div><div className="flex gap-1"><button aria-label={s.moveUp} className="grid size-11 place-items-center" disabled={index === 0} onClick={() => mutateReport((draft) => { moveChronologyEvent(draft.events, event.id, "up"); })}><ArrowUp className="size-4" /></button><button aria-label={s.moveDown} className="grid size-11 place-items-center" disabled={index === report.events.length - 1} onClick={() => mutateReport((draft) => { moveChronologyEvent(draft.events, event.id, "down"); })}><ArrowDown className="size-4" /></button><button aria-label={s.edit} className="grid size-11 place-items-center" onClick={() => setEditing({ ...event })}><Pencil className="size-4" /></button></div></li>;
  })}</ol><button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={() => setEditing({ ...empty })}><Plus className="size-4" />{s.add}</button>{editing && <form className="mt-5 border-y border-line bg-canvas p-5" onSubmit={save}><div className="flex justify-between gap-4"><h2 className="text-lg font-semibold">{editing.id ? s.edit : s.add}</h2><button type="button" aria-label={s.cancel} className="grid size-11 place-items-center" onClick={() => setEditing(null)}><X className="size-5" /></button></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{[["date", "date", s.date], ["time", "time", s.time], ["description", "text", s.description], ["detail", "text", s.detail]].map(([name, type, label]) => <label key={name} className="grid gap-2 text-sm font-semibold"><span>{label}</span><input className={fieldClass} type={type} value={editing[name as keyof ChronologyEvent]} onChange={(event) => setEditing({ ...editing, [name]: event.target.value })} />{eventErrors[name] && <span className="text-urgent">{s.errors[name as keyof typeof s.errors] || eventErrors[name]}</span>}</label>)}</div><p className="mt-4 text-sm text-muted">{t(language, "Return to Evidence if you want to connect a record to this event.", "किसी रिकॉर्ड को इस घटना से जोड़ने के लिए साक्ष्य चरण पर लौटें।")}</p><Primary type="submit">{s.save}</Primary></form>}<Primary onClick={complete}>{c.common.continue}</Primary></>;
}

function ReviewStep({ fail }: { fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport, resetReport, navigate } = usePortal();
  const c = COPY[language];
  const s = c.flow.review;
  const presentation = reportPresentation(report, language);
  const dialog = useRef<HTMLDialogElement>(null);
  const pack = createReportPreparationPack(report, language);
  const relevantEvidence = evidenceForReportKind(report.evidence, report.reportKind);
  const availabilityLabels = { have: t(language, "I have it", "मेरे पास है"), missing: t(language, "I don’t have it", "मेरे पास नहीं है"), unsure: t(language, "Not sure", "पता नहीं") };
  const evidenceGroups = (["have", "missing", "unsure"] as const).map((availability) => ({ availability, items: relevantEvidence.filter((item) => item.availability === availability) }));

  if (report.submission === "prepared") {
    const download = () => { const href = URL.createObjectURL(new Blob([pack.content], { type: "text/plain;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = href; anchor.download = pack.filename; anchor.click(); URL.revokeObjectURL(href); };
    return <><Heading section={{ title: t(language, "Preparation ready", "तैयारी तैयार है"), intro: presentation.review.nextAction }} /><ContextBar label={presentation.review.label} language={language} /><div className="mt-7 border-y border-success bg-success-soft py-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-success">{t(language, "Demo preparation reference", "डेमो तैयारी संदर्भ")}</p><p className="mt-2 text-2xl font-semibold">DEMO-2026-08421</p><p className="mt-2 text-sm text-muted">{t(language, "This is not an official acknowledgement or case number.", "यह आधिकारिक acknowledgement या केस नंबर नहीं है।")}</p></div><div className="mt-6 flex flex-wrap gap-3"><button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={() => navigator.clipboard.writeText(pack.content)}><Copy className="size-4" />{t(language, "Copy preparation summary", "तैयारी सारांश कॉपी करें")}</button><button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={download}><Download className="size-4" />{t(language, "Download preparation pack", "तैयारी पैक डाउनलोड करें")}</button><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{c.common.visitOfficial}<ExternalLink className="size-4" /></a></div><button className="mt-6 min-h-11 text-sm font-semibold text-civic-700 underline underline-offset-4" onClick={() => { resetReport(); navigate("incident"); }}>{t(language, "Reset demo report", "डेमो रिपोर्ट रीसेट करें")}</button></>;
  }

  const openConfirmation = () => report.reviewed ? dialog.current?.showModal() : fail({ review: s.error });
  const confirm = () => { mutateReport((draft) => { draft.route = "review"; prepareSimulation(draft); }); dialog.current?.close(); };
  return <><Heading section={{ eyebrow: s.eyebrow, title: presentation.review.title, intro: presentation.review.intro }} /><ContextBar label={presentation.review.label} language={language} /><div className="mt-6 grid gap-5 lg:grid-cols-2"><article className="border-y border-line py-5"><h2 className="text-lg font-semibold">{s.incident}</h2><dl className="mt-4 grid grid-cols-2 gap-4 text-sm">{report.reportKind === "financial" && <div><dt className="text-muted">{c.flow.details.amount}</dt><dd className="font-semibold">{formatMoney(report.incident.amount)}</dd></div>}<div><dt className="text-muted">{c.flow.details.date}</dt><dd className="font-semibold">{formatDateTime(report.incident.date, report.incident.time)}</dd></div><div><dt className="text-muted">{t(language, "Contact channel", "संपर्क माध्यम")}</dt><dd className="font-semibold">{report.incident.contactChannel || "—"}</dd></div><div className="col-span-2"><dt className="text-muted">{c.flow.details.narrative}</dt><dd className="mt-1 leading-6">{report.incident.narrative}</dd></div></dl></article><article className="border-y border-line py-5"><h2 className="text-lg font-semibold">{s.evidence}</h2><div className="mt-4 space-y-5">{evidenceGroups.map((group) => <section key={group.availability}><h3 className="text-sm font-semibold text-civic-700">{availabilityLabels[group.availability]} ({group.items.length})</h3><ul className="mt-2 space-y-3 text-sm">{group.items.slice(0, 5).map((item) => { const linked = report.events.filter((event) => item.relatedEventIds.includes(event.id)); return <li key={item.id}><span className="font-medium">{localized(item.name, language)}</span>{linked.length > 0 && <span className="mt-1 block text-xs text-muted">{t(language, "Timeline", "समयरेखा")}: {linked.map((event) => event.description).join(", ")}</span>}</li>; })}</ul></section>)}</div></article><article className="border-y border-line py-5 lg:col-span-2"><h2 className="text-lg font-semibold">{t(language, "Timeline", "समयरेखा")}</h2><ol className="mt-4 grid gap-4 sm:grid-cols-2">{report.events.map((event, index) => { const linked = relevantEvidence.filter((item) => item.relatedEventIds.includes(event.id)); return <li key={event.id} className="flex gap-3 text-sm"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-civic-600 text-white">{index + 1}</span><span><strong className="block">{event.description}</strong><span className="text-muted">{event.date} · {event.time}</span>{linked.length > 0 && <span className="mt-1 block text-xs text-civic-700">{linked.map((item) => localized(item.name, language)).join(", ")}</span>}</span></li>; })}</ol></article></div>
    <section className="mt-6 border-y border-line bg-canvas py-5"><h2 className="text-lg font-semibold">{t(language, "Readiness, not a score", "तैयारी, स्कोर नहीं")}</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{evidenceGroups.map((group) => <div key={group.availability}><span className="text-xs text-muted">{availabilityLabels[group.availability]}</span><strong className="mt-1 block text-xl">{group.items.length}</strong></div>)}</div><p className="mt-4 text-sm leading-6 text-muted">{t(language, "Missing evidence is guidance, not failure. Do not delay urgent reporting just to make every item complete.", "गायब साक्ष्य मार्गदर्शन है, विफलता नहीं। हर आइटम पूरा करने के लिए तात्कालिक रिपोर्टिंग में देरी न करें।")}</p></section>
    <label className="mt-6 flex gap-3 border-t border-line pt-4"><input type="checkbox" className="mt-1 size-5" checked={report.reviewed} onChange={(event) => mutateReport((draft) => { draft.reviewed = event.target.checked; })} /><span className="text-sm">{s.choice}</span></label><Primary onClick={openConfirmation}>{t(language, "Prepare demo report", "डेमो रिपोर्ट तैयार करें")}</Primary><dialog ref={dialog} className="m-auto w-[min(92vw,560px)] rounded-special border-0 p-0 shadow-2xl backdrop:bg-navy-950/65" onCancel={(event) => { event.preventDefault(); dialog.current?.close(); }}><div className="p-6"><h2 className="text-2xl font-semibold">{c.flow.submit.dialogTitle}</h2><p className="mt-3 text-sm leading-6 text-muted">{t(language, "This only prepares a local demo summary. Nothing is submitted to the government.", "यह केवल स्थानीय डेमो सारांश तैयार करता है। सरकार को कुछ भी जमा नहीं होता।")}</p><div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" onClick={confirm}>{t(language, "Prepare demo", "डेमो तैयार करें")}</button><button className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => dialog.current?.close()}>{c.flow.submit.cancel}</button></div></div></dialog></>;
}
