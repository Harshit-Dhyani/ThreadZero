"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Circle, Clock3, ExternalLink, Search } from "lucide-react";
import { WORKFLOW_COPY as COPY } from "@/content/workflow";
import { evidenceForReportKind, formatDateTime, formatMoney } from "@/domains/report";
import { resolveTrackRecord, type TrackRecord } from "@/features/track";
import { DEMO_FIXTURE } from "@/data/demo";
import { FLOW_STAGES } from "@/lib/routes";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

export function TrackWorkspace() {
  const { language, report: savedReport, navigate } = usePortal();
  const c = COPY[language].tracker;
  const flowCopy = COPY[language].flow;
  const [reference, setReference] = useState("");
  const [record, setRecord] = useState<TrackRecord | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const relevantEvidence = evidenceForReportKind(savedReport.evidence, savedReport.reportKind);
  const evidenceCounts = {
    have: relevantEvidence.filter((item) => item.availability === "have").length,
    missing: relevantEvidence.filter((item) => item.availability === "missing").length,
    unsure: relevantEvidence.filter((item) => item.availability === "unsure").length
  };
  const completedStages = FLOW_STAGES.filter((stage) => savedReport.completed.includes(stage.id));
  const nextStage = savedReport.locked
    ? "review"
    : savedReport.route !== "home"
      ? savedReport.route
      : FLOW_STAGES.find((stage) => !savedReport.completed.includes(stage.id))?.id ?? "incident";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = resolveTrackRecord(reference, savedReport);
    if (result.status !== "found" || !result.record) {
      setRecord(null);
      setError(result.status === "empty" ? c.empty : c.invalid);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setReference(result.normalized);
    setError("");
    setRecord(result.record);
  };

  const clear = () => {
    setReference("");
    setRecord(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const openDemo = () => {
    const result = resolveTrackRecord(DEMO_FIXTURE.reportReference, savedReport);
    setReference(DEMO_FIXTURE.reportReference);
    setError("");
    setRecord(result.record ?? null);
  };

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <p className="text-xs text-civic-700">{c.breadcrumb}</p>
    <header className="mt-7 max-w-document border-b border-line pb-8"><h1 className="max-w-[22ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{c.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted">{c.intro}</p></header>

    <section className="mt-7 overflow-hidden rounded-panel border border-line bg-white" aria-labelledby="preparation-progress-title">
      <div className="grid gap-5 border-b border-line bg-civic-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "इस डिवाइस पर स्थानीय स्थिति" : "Local status on this device"}</p>
          <h2 id="preparation-progress-title" className="mt-2 text-2xl font-semibold">{language === "hi" ? "तैयारी की प्रगति" : "Preparation progress"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? `${completedStages.length} / ${FLOW_STAGES.length} तैयारी चरण पूरे हैं। यह सरकारी केस स्थिति नहीं है।` : `${completedStages.length} of ${FLOW_STAGES.length} preparation stages are complete. This is not government case status.`}</p>
        </div>
        <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" onClick={() => navigate(nextStage)}>{language === "hi" ? "तैयारी जारी रखें" : "Continue preparation"}<ArrowRight className="size-4" /></button>
      </div>
      <div className="grid lg:grid-cols-[1fr_280px]">
        <ol className="grid gap-0 p-5 sm:grid-cols-5 sm:p-7">{FLOW_STAGES.map((stage, index) => {
          const done = savedReport.completed.includes(stage.id);
          const active = stage.id === savedReport.route && !done;
          return <li key={stage.id} className="relative flex gap-3 border-b border-line py-3 last:border-b-0 sm:block sm:border-b-0 sm:py-0 sm:pr-3">
            {index < FLOW_STAGES.length - 1 ? <span className="absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px bg-line sm:left-7 sm:right-0 sm:top-[13px] sm:h-px sm:w-auto" aria-hidden="true" /> : null}
            <span className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${done ? "bg-success text-white" : active ? "bg-civic-600 text-white" : "border border-line bg-white text-muted"}`}>{done ? <Check className="size-4" /> : index + 1}</span>
            <span className="text-sm font-medium sm:mt-3 sm:block">{flowCopy.routes[stage.id as keyof typeof flowCopy.routes]}</span>
          </li>;
        })}</ol>
        <div className="border-t border-line bg-canvas p-5 sm:p-7 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-semibold">{language === "hi" ? "साक्ष्य की तैयारी" : "Evidence readiness"}</h3>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-left">
            <div><dt className="text-xs text-muted">{language === "hi" ? "मेरे पास है" : "I have it"}</dt><dd className="mt-1 text-xl font-semibold text-success">{evidenceCounts.have}</dd></div>
            <div><dt className="text-xs text-muted">{language === "hi" ? "नहीं है" : "Missing"}</dt><dd className="mt-1 text-xl font-semibold text-warning">{evidenceCounts.missing}</dd></div>
            <div><dt className="text-xs text-muted">{language === "hi" ? "पता नहीं" : "Not sure"}</dt><dd className="mt-1 text-xl font-semibold">{evidenceCounts.unsure}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <aside className="mt-6 border-l-4 border-civic-600 bg-civic-50 p-4 text-sm leading-6 text-muted">
      {language === "hi" ? "ThreadZero सरकारी, NCRP या पुलिस केस की स्थिति नहीं देख सकता। नीचे का रेफरेंस ट्रैकर केवल डेमो या इस ब्राउज़र में सहेजी गई रिपोर्ट स्थिति दिखाता है।" : "ThreadZero cannot see government, NCRP, or police case status. The reference tracker below only shows deterministic demo or browser-saved report state."}
    </aside>

    <section className="mt-6 rounded-panel border border-line bg-white p-5 sm:p-7">
      <form className="flex max-w-form flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submit} noValidate>
        <label className="grid flex-1 gap-2"><span className="text-sm font-medium">{c.label}</span><input ref={inputRef} value={reference} onChange={(event) => setReference(event.target.value)} className="min-h-11 rounded-control border border-line px-3 font-mono text-sm uppercase" aria-invalid={Boolean(error)} aria-describedby="track-boundary" /></label>
        <div className="flex gap-2"><button className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white"><Search className="size-4" />{c.submit}</button><button type="button" className="min-h-11 rounded-control border border-line px-4 text-sm font-medium" onClick={clear}>{c.reset}</button></div>
      </form>
      <p id="track-boundary" className="mt-4 max-w-3xl text-sm leading-6 text-muted">{c.boundary}</p>
      {error ? <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 border-l-[3px] border-urgent bg-urgent-soft p-3 text-sm text-urgent">{error}</p> : null}
    </section>
    {!record && !error ? <aside className="mt-6 grid gap-4 border-t border-line py-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><h2 className="text-lg font-semibold">{language === "hi" ? "डेमो स्थिति देखें" : "Try the demo status"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? `उदाहरण रिपोर्ट देखने के लिए ${DEMO_FIXTURE.reportReference} उपयोग करें। यह NCRP या पुलिस स्थिति नहीं है।` : `Use ${DEMO_FIXTURE.reportReference} to view an example report. It is not an NCRP or police status.`}</p></div><button type="button" className="min-h-11 rounded-control border border-civic-600 bg-white px-5 text-sm font-semibold text-civic-700" onClick={openDemo}>{language === "hi" ? "डेमो स्थिति खोलें" : "Show demo status"}</button></aside> : null}
    {record ? <TrackResult record={record} /> : null}
  </div>;
}

function TrackResult({ record }: { record: TrackRecord }) {
  const { language } = usePortal();
  const c = COPY[language].tracker;
  const report = record.report;
  const ready = report.evidence.filter((item) => item.availability === "have");
  const missing = report.evidence.filter((item) => item.availability === "missing");
  return <div className="mt-6 grid gap-6">
    <section className="overflow-hidden rounded-panel border border-line bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-civic-50 p-5 sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-success">{c.found}</p><h2 className="mt-2 text-2xl font-semibold">{record.reference}</h2></div><div className="border-l-[3px] border-civic-600 bg-white px-4 py-3"><span className="block text-xs font-medium uppercase tracking-[0.1em] text-muted">{language === "hi" ? "वर्तमान स्थिति" : "Current state"}</span><strong className="mt-1 block font-medium text-civic-700">{c.status}</strong></div></div>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-5 sm:p-7"><h2 className="text-xl font-semibold">{c.facts}</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">{[[language === "hi" ? "राशि" : "Amount", formatMoney(report.incident.amount)], [language === "hi" ? "माध्यम" : "Method", report.incident.paymentMethod], [language === "hi" ? "संपर्क माध्यम" : "Channel", report.incident.contactChannel], [language === "hi" ? "दिनांक और समय" : "Date and time", formatDateTime(report.incident.date, report.incident.time)], [language === "hi" ? "प्राप्तकर्ता" : "Recipient", report.incident.recipientIdentifier], ["UTR", report.incident.transactionReference]].map(([label, value]) => <div key={`${label}-${value}`}><dt className="text-xs font-medium uppercase tracking-[0.1em] text-muted">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl></div>
        <div className="border-t border-line bg-canvas p-5 sm:p-7 lg:border-l lg:border-t-0"><h2 className="text-xl font-semibold">{c.readiness}</h2><ul className="mt-4 space-y-4">{[...ready.slice(0, 2), ...missing.slice(0, 1)].map((item) => <li key={item.id} className="flex items-center gap-3 text-sm"><span className={`grid size-7 shrink-0 place-items-center rounded-full ${item.availability === "have" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{item.availability === "have" ? <Check className="size-4" /> : <Circle className="size-3" />}</span><span><strong className="font-medium">{localized(item.name, language)}</strong><span className="block text-xs text-muted">{item.availability === "have" ? c.ready : c.missing}</span></span></li>)}</ul></div>
      </div>
    </section>
    <section className="rounded-panel border border-line bg-white p-5 sm:p-7"><h2 className="text-xl font-semibold">{c.timeline}</h2><ol className="mt-5 grid gap-5 md:grid-cols-4">{c.states.map((state, index) => <li key={state.title} className="relative grid grid-cols-[34px_1fr] gap-3 md:grid-cols-1">{index < c.states.length - 1 ? <span className="absolute left-4 top-7 h-full w-px bg-line md:left-8 md:right-0 md:top-4 md:h-px md:w-auto" /> : null}<span className={`relative z-10 grid size-8 place-items-center rounded-full ${index === 0 ? "bg-success text-white" : index === 1 ? "bg-civic-600 text-white" : "border border-line bg-white text-muted"}`}>{index === 0 ? <Check className="size-4" /> : index === 1 ? <Clock3 className="size-4" /> : index + 1}</span><div><h3 className="text-sm font-medium">{state.title}</h3><p className="mt-1 text-sm leading-6 text-muted">{state.body}</p></div></li>)}</ol></section>
    <aside className="flex flex-col gap-4 rounded-panel border border-line border-l-4 border-l-civic-600 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-lg font-semibold">{c.next}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{c.nextBody}</p></div><a className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{c.official}<ExternalLink className="size-4" /></a></aside>
  </div>;
}
