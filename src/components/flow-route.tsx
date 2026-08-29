"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Copy, Download, ExternalLink, Pencil, Phone, Plus, RotateCcw, X } from "lucide-react";
import { canEnterRoute, createReportPreparationPack, formatDateTime, formatMoney, getStepIndex, markRouteComplete, prepareSimulation, validateDetails, validateEvidence } from "@/domains/report";
import { moveChronologyEvent, validateChronologyEvent } from "@/domains/chronology";
import { WORKFLOW_COPY as COPY } from "@/content/workflow";
import { FLOW_STAGES } from "@/lib/routes";
import type { ChronologyEvent, EvidenceAvailability, EvidenceCategory, Incident } from "@/lib/types";
import { usePortal } from "./portal-provider";

const fieldClass = "min-h-11 w-full rounded-control border border-line bg-white px-3 font-normal";
const categories: EvidenceCategory[] = ["payment", "messages", "person-account", "links"];

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
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-civic-700"><Link className="inline-flex min-h-11 min-w-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="px-2">/</span><Link className="inline-flex min-h-11 min-w-11 items-center" href="/complaints">{language === "hi" ? "रिपोर्ट" : "Report"}</Link><span className="px-2">/</span><span>{c.flow.routes[routeId as keyof typeof c.flow.routes]}</span></nav>
    <div className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="min-w-0 self-start rounded-panel border border-line bg-white p-3 lg:sticky lg:top-4">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{c.flow.progress}</p>
        <ol className="flex gap-2 overflow-x-auto py-2 lg:grid lg:overflow-visible">{FLOW_STAGES.map((stage, stageIndex) => {
          const done = report.completed.includes(stage.id);
          return <li key={stage.id} className="shrink-0 lg:shrink"><button disabled={!canEnterRoute(stage.id, report) || report.locked && stage.id !== "review"} aria-current={stage.id === routeId ? "step" : undefined} className={`flex min-h-11 min-w-32 items-center gap-3 rounded-control px-3 text-left text-sm font-semibold lg:w-full ${stage.id === routeId ? "bg-civic-50 text-civic-700" : done ? "text-success" : "text-muted"}`} onClick={() => navigate(stage.id)}><span className={`grid size-7 shrink-0 place-items-center rounded-full border ${done ? "border-success bg-success text-white" : "border-line"}`}>{done ? <Check className="size-4" /> : stageIndex + 1}</span><span>{c.flow.routes[stage.id as keyof typeof c.flow.routes]}</span></button></li>;
        })}</ol>
        <div className="mt-3 rounded-panel bg-urgent-soft p-4"><Phone className="size-5 text-urgent" /><p className="mt-2 text-xs font-semibold">{c.common.actualIncident}</p><p className="mt-1 text-xs leading-5 text-urgent">{c.common.callManually}</p></div>
      </aside>
      <section className="min-w-0 rounded-panel border border-line bg-white p-5 sm:p-7">
        {Object.keys(errors).length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-6 border-l-4 border-urgent bg-urgent-soft p-4"><h2 className="font-semibold text-urgent">{c.common.errorsTitle}</h2><ul className="mt-2 list-disc pl-5 text-sm text-urgent">{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul></div>}
        {routeId === "incident" && <IncidentStep complete={() => complete("details")} fail={fail} />}
        {routeId === "details" && <DetailsStep complete={() => complete("evidence")} fail={fail} />}
        {routeId === "evidence" && <EvidenceStep complete={() => complete("chronology")} fail={fail} />}
        {routeId === "chronology" && <TimelineStep complete={() => complete("review")} fail={fail} />}
        {routeId === "review" && <ReviewStep fail={fail} />}
        <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-5">{index > 0 && !report.locked && <button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold" onClick={() => navigate(FLOW_STAGES[index - 1].id)}><ArrowLeft className="size-4" />{c.common.back}</button>}<button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold" onClick={() => { resetReport(); navigate("incident"); }}><RotateCcw className="size-4" />{c.common.reset}</button></div>
      </section>
    </div>
  </div>;
}

function Heading({ section }: { section: any }) {
  return <header><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{section.eyebrow}</p><h1 tabIndex={-1} className="mt-3 max-w-[24ch] text-[36px] font-semibold leading-tight tracking-[-0.03em] sm:text-[42px]">{section.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted">{section.intro}</p></header>;
}

function Primary({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white hover:bg-civic-700">{children}<ArrowRight className="size-4" /></button>;
}

function IncidentStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport, openGuide } = usePortal();
  const c = COPY[language];
  const s = c.flow.incident;
  const entryNotice = report.entryMode === "women-child-anonymous"
    ? (language === "hi" ? "आपने नाम साझा किए बिना महिला/बाल रिपोर्ट चुनी है। यही पाँच चरण घटना, साक्ष्य और समयरेखा व्यवस्थित करेंगे।" : "You chose a Women/Children report without sharing your name. These same five stages organise the incident, evidence, and Timeline.")
    : report.entryMode === "women-child-details"
      ? (language === "hi" ? "आपने विवरण के साथ महिला/बाल रिपोर्ट चुनी है। यह डेमो वास्तविक संपर्क विवरण नहीं लेता; आधिकारिक पोर्टल पर उन्हें स्वयं भरें।" : "You chose a Women/Children report with details. This demo does not collect real contact details; enter them yourself on the official portal.")
      : report.entryMode === "other"
        ? (language === "hi" ? "आपने अन्य साइबर अपराध चुना है। सबसे पास का विवरण चुनें; गलत श्रेणी चुनने के लिए मजबूर नहीं किया जाएगा।" : "You chose other cybercrime. Pick the closest description; you will not be forced into a category that may be wrong.")
        : "";
  return <>
    <Heading section={s} />
    {entryNotice && <aside className="mt-6 border-t border-line pt-4 text-sm leading-6 text-muted">{entryNotice}</aside>}
    <aside className="mt-7 border-l-4 border-urgent bg-urgent-soft p-5"><div className="flex gap-4"><Phone className="mt-1 size-6 shrink-0 text-urgent" /><div><h2 className="font-semibold text-urgent">{language === "hi" ? "क्या पैसे का नुकसान हुआ है?" : "Did you lose money?"}</h2><p className="mt-1 text-sm leading-6 text-muted">{language === "hi" ? "तत्काल सहायता के लिए 1930 पर स्वयं कॉल करें। फिर वर्तमान आधिकारिक प्रक्रिया के लिए cybercrime.gov.in उपयोग करें।" : "Call 1930 manually for urgent help, then use cybercrime.gov.in for the current official process."}</p></div></div></aside>
    <fieldset className="mt-7"><legend className="font-semibold">{s.legend}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{s.choices.map((choice: any) => <label key={choice.value} className={`flex min-h-24 cursor-pointer gap-3 rounded-panel border p-4 ${report.incidentChoice === choice.value ? "border-civic-600 bg-civic-50" : "border-line"}`}><input type="radio" name="incident-choice" value={choice.value} checked={report.incidentChoice === choice.value} onChange={() => mutateReport((draft) => { draft.incidentChoice = choice.value; })} className="mt-1 size-5" /><span><strong className="block">{choice.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{choice.body}</span></span></label>)}</div></fieldset>
    <button className="mt-4 min-h-11 text-sm font-semibold text-civic-700 underline" onClick={() => openGuide("report")}>{language === "hi" ? "मुझे यकीन नहीं है — मार्गदर्शिका खोलें" : "I’m not sure — open the Guide"}</button><br />
    <Primary onClick={() => report.incidentChoice ? complete() : fail({ flow: s.error })}>{c.common.continue}</Primary>
  </>;
}

function DetailsStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { report, mutateReport, language } = usePortal();
  const c = COPY[language];
  const s = c.flow.details;
  const set = (name: keyof Incident, value: string) => mutateReport((draft) => { draft.incident[name] = value; });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateDetails(report.incident);
    Object.keys(errors).length ? fail(Object.fromEntries(Object.keys(errors).map((key) => [key, s.errors[key as keyof typeof s.errors] || errors[key]]))) : complete();
  };
  const fields: Array<[keyof Incident, string, string]> = [["amount", "number", s.amount], ["date", "date", s.date], ["time", "time", s.time], ["transactionReference", "text", s.transactionReference], ["recipientIdentifier", "text", s.recipientIdentifier]];
  return <form onSubmit={submit} noValidate><Heading section={s} /><div className="mt-7 grid gap-5 sm:grid-cols-2">{fields.map(([name, type, label]) => <label key={name} className="grid gap-2 text-sm font-semibold"><span>{label}</span><input className={fieldClass} type={type} value={report.incident[name]} onChange={(event) => set(name, event.target.value)} /></label>)}<label className="grid gap-2 text-sm font-semibold"><span>{s.paymentMethod}</span><select className={fieldClass} value={report.incident.paymentMethod} onChange={(event) => set("paymentMethod", event.target.value)}><option value="">{s.choosePayment}</option>{s.paymentOptions.map((option: string) => <option key={option}>{option}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold"><span>{s.contactChannel}</span><select className={fieldClass} value={report.incident.contactChannel} onChange={(event) => set("contactChannel", event.target.value)}><option value="">{s.chooseChannel}</option>{s.channelOptions.map((option: string) => <option key={option}>{option}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>{s.narrative}</span><textarea className="min-h-36 rounded-control border border-line p-3 font-normal" maxLength={600} value={report.incident.narrative} onChange={(event) => set("narrative", event.target.value)} /><span className="font-normal text-muted">{s.narrativeHelp} · {report.incident.narrative.length}/600</span></label></div><p className="mt-5 text-sm text-muted">{language === "hi" ? "केवल डेमो। यहाँ दर्ज कुछ भी सरकार को नहीं भेजा जाता।" : "Demo only. Nothing entered here is sent to the government."}</p><Primary type="submit">{c.common.continue}</Primary></form>;
}

function EvidenceStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport } = usePortal();
  const c = COPY[language];
  const s = c.flow.evidence;
  const labels = language === "hi" ? { payment: "भुगतान", messages: "संदेश", "person-account": "व्यक्ति या खाता", links: "लिंक", have: "मेरे पास है", missing: "मेरे पास नहीं है", unsure: "पता नहीं", why: "यह क्यों उपयोगी है", where: "कहाँ मिलेगा", connect: "समयरेखा से जोड़ें" } : { payment: "Payment", messages: "Messages", "person-account": "Person or account", links: "Links", have: "I have it", missing: "I don’t have it", unsure: "Not sure", why: "Why it helps", where: "Where to find it", connect: "Connect to Timeline" };
  const setAvailability = (id: string, availability: EvidenceAvailability) => mutateReport((draft) => { const item = draft.evidence.find((candidate) => candidate.id === id); if (item) item.availability = availability; });
  const toggleEvent = (evidenceId: string, eventId: string) => mutateReport((draft) => { const item = draft.evidence.find((candidate) => candidate.id === evidenceId); if (!item) return; item.relatedEventIds = item.relatedEventIds.includes(eventId) ? item.relatedEventIds.filter((id) => id !== eventId) : [...item.relatedEventIds, eventId]; });
  const submit = () => {
    const errors = validateEvidence(report.evidence, report.extractionConfirmed);
    Object.keys(errors).length ? fail(Object.fromEntries(Object.keys(errors).map((key) => [key, key === "extraction" ? s.errors.extraction : s.errors.item]))) : complete();
  };
  const confirmNeeded = report.evidence.some((item) => item.extractionRequired && item.availability === "have");
  return <><Heading section={s} /><div className="mt-7 grid gap-8">{categories.map((category) => <section key={category}><h2 className="border-b border-line pb-3 text-xl font-semibold">{labels[category]}</h2><div className="divide-y divide-line">{report.evidence.filter((item) => item.category === category).map((item) => <article key={item.id} className="py-5"><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]"><div><h3 className="font-semibold">{item.name[language]}</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold text-civic-700">{labels.why}</dt><dd className="mt-1 leading-6 text-muted">{item.whyUseful[language]}</dd></div><div><dt className="font-semibold text-civic-700">{labels.where}</dt><dd className="mt-1 leading-6 text-muted">{item.whereToFind[language]}</dd></div></dl></div><fieldset><legend className="text-sm font-semibold">{language === "hi" ? "क्या यह आपके पास है?" : "Do you have it?"}</legend><div className="mt-2 grid grid-cols-3 gap-2">{(["have", "missing", "unsure"] as const).map((value) => <label key={value} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-control border px-2 text-center text-xs font-semibold ${item.availability === value ? "border-civic-600 bg-civic-50 text-civic-700" : "border-line"}`}><input className="sr-only" type="radio" name={`availability-${item.id}`} checked={item.availability === value} onChange={() => setAvailability(item.id, value)} />{labels[value]}</label>)}</div></fieldset></div><details className="mt-4"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-civic-700">{labels.connect} ({item.relatedEventIds.length})</summary><div className="grid gap-2 rounded-control bg-canvas p-3 sm:grid-cols-2">{report.events.map((event) => <label key={event.id} className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5" checked={item.relatedEventIds.includes(event.id)} onChange={() => toggleEvent(item.id, event.id)} /><span>{event.description}</span></label>)}</div></details></article>)}</div></section>)}</div>{confirmNeeded && <div className="mt-7 grid gap-5 rounded-panel bg-civic-50 p-5 md:grid-cols-[220px_1fr]"><Image src="/assets/images/transaction-review-illustration-v1-640.webp" width={640} height={420} alt="" className="w-full object-contain" /><div><h2 className="text-lg font-semibold">{s.extractionTitle}</h2><p className="mt-2 text-sm leading-6 text-muted">{s.extractionBody}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm">{Object.entries(report.extracted).map(([key, value]) => <div key={key}><dt className="text-xs text-muted">{key}</dt><dd className="font-semibold">{String(value)}</dd></div>)}</dl><label className="mt-5 flex gap-3"><input type="checkbox" className="mt-1 size-5" checked={report.extractionConfirmed} onChange={(event) => mutateReport((draft) => { draft.extractionConfirmed = event.target.checked; })} /><span className="text-sm">{s.extractionChoice}</span></label></div></div>}<Primary onClick={submit}>{c.common.continue}</Primary></>;
}

function TimelineStep({ complete, fail }: { complete: () => void; fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport } = usePortal();
  const c = COPY[language];
  const s = c.flow.chronology;
  const empty: ChronologyEvent = { id: "", date: "2026-08-25", time: "19:00", description: "", detail: "" };
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
  return <><Heading section={s} /><ol className="mt-7 divide-y divide-line border-y border-line">{report.events.map((event, index) => {
    const linked = report.evidence.filter((item) => item.relatedEventIds.includes(event.id));
    return <li key={event.id} className="grid gap-4 py-5 sm:grid-cols-[42px_1fr_auto]"><span className="grid size-9 place-items-center rounded-full bg-civic-600 font-semibold text-white">{index + 1}</span><div><h2 className="font-semibold">{event.description}</h2><p className="mt-1 text-sm text-muted">{event.date} · {event.time} · {event.detail}</p>{linked.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{linked.map((item) => <li key={item.id} className="rounded-full bg-civic-50 px-3 py-1 text-xs font-semibold text-civic-700">{item.name[language]}</li>)}</ul>}</div><div className="flex gap-1"><button aria-label={s.moveUp} className="grid size-11 place-items-center" disabled={index === 0} onClick={() => mutateReport((draft) => { moveChronologyEvent(draft.events, event.id, "up"); })}><ArrowUp className="size-4" /></button><button aria-label={s.moveDown} className="grid size-11 place-items-center" disabled={index === report.events.length - 1} onClick={() => mutateReport((draft) => { moveChronologyEvent(draft.events, event.id, "down"); })}><ArrowDown className="size-4" /></button><button aria-label={s.edit} className="grid size-11 place-items-center" onClick={() => setEditing({ ...event })}><Pencil className="size-4" /></button></div></li>;
  })}</ol><button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={() => setEditing({ ...empty })}><Plus className="size-4" />{s.add}</button>{editing && <form className="mt-5 rounded-panel border border-line bg-canvas p-5" onSubmit={save}><div className="flex justify-between gap-4"><h2 className="text-lg font-semibold">{editing.id ? s.edit : s.add}</h2><button type="button" aria-label={s.cancel} className="grid size-11 place-items-center" onClick={() => setEditing(null)}><X className="size-5" /></button></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{[["date", "date", s.date], ["time", "time", s.time], ["description", "text", s.description], ["detail", "text", s.detail]].map(([name, type, label]) => <label key={name} className="grid gap-2 text-sm font-semibold"><span>{label}</span><input className={fieldClass} type={type} value={editing[name as keyof ChronologyEvent]} onChange={(event) => setEditing({ ...editing, [name]: event.target.value })} />{eventErrors[name] && <span className="text-urgent">{s.errors[name as keyof typeof s.errors] || eventErrors[name]}</span>}</label>)}</div><p className="mt-4 text-sm text-muted">{language === "hi" ? "साक्ष्य जोड़ने के लिए पिछले साक्ष्य चरण पर वापस जाएँ।" : "Return to the Evidence step to connect records to this event."}</p><Primary type="submit">{s.save}</Primary></form>}<Primary onClick={complete}>{c.common.continue}</Primary></>;
}

function ReviewStep({ fail }: { fail: (errors: Record<string, string>) => void }) {
  const { language, report, mutateReport, resetReport, navigate } = usePortal();
  const c = COPY[language];
  const s = c.flow.review;
  const dialog = useRef<HTMLDialogElement>(null);
  const pack = createReportPreparationPack(report, language);
  if (report.submission === "prepared") {
    const download = () => { const href = URL.createObjectURL(new Blob([pack.content], { type: "text/plain;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = href; anchor.download = pack.filename; anchor.click(); URL.revokeObjectURL(href); };
    return <><Heading section={c.flow.next} /><div className="mt-7 rounded-panel border border-success bg-success-soft p-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-success">{c.common.syntheticReference}</p><p className="mt-2 text-2xl font-semibold">DEMO-2026-08421</p><p className="mt-2 text-sm text-muted">{c.flow.next.referenceHelp}</p></div><div className="mt-6 flex flex-wrap gap-3"><button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={() => navigator.clipboard.writeText(pack.content)}><Copy className="size-4" />{language === "hi" ? "तैयारी सारांश कॉपी करें" : "Copy preparation summary"}</button><button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-4 text-sm font-semibold text-civic-700" onClick={download}><Download className="size-4" />{language === "hi" ? "तैयारी पैक डाउनलोड करें" : "Download preparation pack"}</button><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{c.common.visitOfficial}<ExternalLink className="size-4" /></a></div><button className="mt-6 min-h-11 text-sm font-semibold text-civic-700 underline" onClick={() => { resetReport(); navigate("incident"); }}>{language === "hi" ? "डेमो रिपोर्ट रीसेट करें" : "Reset demo report"}</button></>;
  }
  const availabilityLabels = language === "hi" ? { have: "मेरे पास है", missing: "मेरे पास नहीं है", unsure: "पता नहीं" } : { have: "I have it", missing: "I don’t have it", unsure: "Not sure" };
  const evidenceGroups = (["have", "missing", "unsure"] as const).map((availability) => ({ availability, items: report.evidence.filter((item) => item.availability === availability) }));
  const openConfirmation = () => report.reviewed ? dialog.current?.showModal() : fail({ review: s.error });
  const confirm = () => { mutateReport((draft) => { draft.route = "review"; prepareSimulation(draft); }); dialog.current?.close(); };
  return <><Heading section={s} /><div className="mt-7 grid gap-5 lg:grid-cols-2"><article className="rounded-panel border border-line p-5"><h2 className="text-lg font-semibold">{s.incident}</h2><dl className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted">{c.flow.details.amount}</dt><dd className="font-semibold">{formatMoney(report.incident.amount)}</dd></div><div><dt className="text-muted">{c.flow.details.date}</dt><dd className="font-semibold">{formatDateTime(report.incident.date, report.incident.time)}</dd></div><div className="col-span-2"><dt className="text-muted">{c.flow.details.narrative}</dt><dd className="mt-1 leading-6">{report.incident.narrative}</dd></div></dl></article><article className="rounded-panel border border-line p-5"><h2 className="text-lg font-semibold">{s.evidence}</h2><div className="mt-4 space-y-5">{evidenceGroups.map((group) => <section key={group.availability}><h3 className="text-sm font-semibold text-civic-700">{availabilityLabels[group.availability]} ({group.items.length})</h3><ul className="mt-2 space-y-3 text-sm">{group.items.map((item) => { const linked = report.events.filter((event) => item.relatedEventIds.includes(event.id)); return <li key={item.id}><span className="font-medium">{item.name[language]}</span>{linked.length > 0 && <span className="mt-1 block text-xs text-muted">{language === "hi" ? "समयरेखा" : "Timeline"}: {linked.map((event) => event.description).join(", ")}</span>}</li>; })}</ul></section>)}</div></article><article className="rounded-panel border border-line p-5 lg:col-span-2"><h2 className="text-lg font-semibold">{language === "hi" ? "समयरेखा" : "Timeline"}</h2><ol className="mt-4 grid gap-4 sm:grid-cols-2">{report.events.map((event, index) => { const linked = report.evidence.filter((item) => item.relatedEventIds.includes(event.id)); return <li key={event.id} className="flex gap-3 text-sm"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-civic-600 text-white">{index + 1}</span><span><strong className="block">{event.description}</strong><span className="text-muted">{event.date} · {event.time}</span>{linked.length > 0 && <span className="mt-1 block text-xs text-civic-700">{linked.map((item) => item.name[language]).join(", ")}</span>}</span></li>; })}</ol></article></div><label className="mt-6 flex gap-3 border-t border-line pt-4"><input type="checkbox" className="mt-1 size-5" checked={report.reviewed} onChange={(event) => mutateReport((draft) => { draft.reviewed = event.target.checked; })} /><span className="text-sm">{s.choice}</span></label><Primary onClick={openConfirmation}>{language === "hi" ? "डेमो रिपोर्ट तैयार करें" : "Prepare demo report"}</Primary><dialog ref={dialog} className="m-auto w-[min(92vw,560px)] rounded-special border-0 p-0 shadow-2xl backdrop:bg-navy-950/65" onCancel={(event) => { event.preventDefault(); dialog.current?.close(); }}><div className="p-6"><h2 className="text-2xl font-semibold">{c.flow.submit.dialogTitle}</h2><p className="mt-3 text-sm leading-6 text-muted">{c.flow.submit.dialogBody}</p><div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" onClick={confirm}>{language === "hi" ? "डेमो तैयार करें" : "Prepare demo"}</button><button className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => dialog.current?.close()}>{c.flow.submit.cancel}</button></div></div></dialog></>;
}
