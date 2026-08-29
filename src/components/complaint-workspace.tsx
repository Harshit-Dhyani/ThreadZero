"use client";

import Link from "next/link";
import { FormEvent, useRef } from "react";
import { ArrowRight, CheckCircle2, TriangleAlert } from "lucide-react";
import { validateServiceValues } from "@/domains/report/service-form";
import { navigationLabel, navigationParent } from "@/lib/navigation";
import { routeDefinition } from "@/lib/routes";
import { usePortal } from "./portal-provider";
import { SourceStrip } from "./source-strip";
import { WorkspaceNavigator } from "./workspace-navigator";

export type ComplaintWorkspaceMode = "women-child" | "anonymous" | "with-details" | "other";

const MODE_ROUTES: Record<Exclude<ComplaintWorkspaceMode, "women-child" | "other">, string> = {
  anonymous: "anonymous-report",
  "with-details": "registered-report"
};

export function ComplaintWorkspace({ mode, routeId }: { mode: ComplaintWorkspaceMode; routeId: string }) {
  const { language, complaintDraft, mutateComplaintDraft, navigate, resetComplaintDraft } = usePortal();
  const route = routeDefinition(routeId, language);
  const errorRef = useRef<HTMLDivElement>(null);
  if (!route) return null;
  const parent = navigationParent(routeId);

  const switchMode = (next: "anonymous" | "with-details") => {
    mutateComplaintDraft((draft) => { draft.errors = []; draft.submitted = false; });
    navigate(MODE_ROUTES[next]);
  };
  const update = (name: string, value: string) => mutateComplaintDraft((draft) => {
    draft.values[name] = value;
    draft.errors = [];
    draft.submitted = false;
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateServiceValues(route.fields, complaintDraft.values, {
      required: language === "hi" ? "यह जानकारी आवश्यक है।" : "This information is required.",
      short: language === "hi" ? "थोड़ा और विवरण जोड़ें।" : "Add a little more detail.",
      invalid: language === "hi" ? "दिया गया डेमो उदाहरण उपयोग करें।" : "Use the example shown."
    });
    mutateComplaintDraft((draft) => {
      draft.values = { ...draft.values, ...validation.normalized };
      draft.errors = validation.errors;
      draft.submitted = validation.errors.length === 0;
    });
    if (validation.errors.length) requestAnimationFrame(() => errorRef.current?.focus());
  };

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-civic-700"><Link href="/">{language === "hi" ? "होम" : "Home"}</Link><span>/</span>{parent && <><Link href={`/${parent.route}`}>{navigationLabel(parent, language)}</Link><span>/</span></>}<span aria-current="page">{route.label}</span>{parent && <Link href={`/${parent.route}`} className="ml-auto inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{language === "hi" ? `${navigationLabel(parent, language)} पर वापस` : `Back to ${navigationLabel(parent, language)}`}</Link>}</nav>
    <WorkspaceNavigator routeId={routeId} />
    <header className="mt-7 max-w-3xl border-b border-line pb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "रिपोर्ट" : "Report"}</p>
      <h1 className="mt-3 max-w-[22ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{route.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{route.intro}</p>
    </header>
    {mode === "women-child" ? <WomenChildChoices route={route} /> : <section className="mt-8 max-w-3xl">
      {mode !== "other" && <div className="inline-flex max-w-full rounded-control bg-civic-50 p-1" role="group" aria-label={language === "hi" ? "रिपोर्ट का तरीका" : "Reporting mode"}>
        <button type="button" aria-pressed={mode === "anonymous"} onClick={() => switchMode("anonymous")} className={`min-h-11 rounded-control px-4 text-sm font-semibold ${mode === "anonymous" ? "bg-white text-civic-700 shadow-sm" : "text-muted"}`}>{language === "hi" ? "नाम साझा किए बिना" : "Without my name"}</button>
        <button type="button" aria-pressed={mode === "with-details"} onClick={() => switchMode("with-details")} className={`min-h-11 rounded-control px-4 text-sm font-semibold ${mode === "with-details" ? "bg-white text-civic-700 shadow-sm" : "text-muted"}`}>{language === "hi" ? "मेरे विवरण के साथ" : "With my details"}</button>
      </div>}
      {complaintDraft.submitted ? <div className="mt-7 max-w-form"><CheckCircle2 className="size-8 text-success" /><h2 className="mt-4 text-2xl font-semibold">{route.result}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "डेमो पूरा हुआ। यहाँ दर्ज कुछ भी सरकार को नहीं भेजा गया।" : "Demo complete. Nothing entered here was sent to the government."}</p><button className="mt-5 min-h-11 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" onClick={() => mutateComplaintDraft((draft) => { draft.submitted = false; })}>{language === "hi" ? "विवरण बदलें" : "Edit details"}</button></div> : <form className="mt-7 max-w-form" onSubmit={submit} noValidate>
        {complaintDraft.errors.length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-6 border-l-4 border-urgent bg-urgent-soft p-4"><h2 className="font-semibold text-urgent">{language === "hi" ? "चिह्नित जानकारी जाँचें" : "Check the highlighted information"}</h2><ul className="mt-2 list-disc pl-5 text-sm text-urgent">{complaintDraft.errors.map((error) => <li key={error.name}>{error.message}</li>)}</ul></div>}
        <div className="grid gap-5 sm:grid-cols-2">{route.fields.map((field) => {
          const error = complaintDraft.errors.find((item) => item.name === field.name);
          return <label key={field.name} className={`grid gap-2 text-sm font-semibold ${field.type === "textarea" ? "sm:col-span-2" : ""}`}><span>{field.label}{field.required && <span className="ml-1 text-urgent">*</span>}</span>{field.type === "select" ? <select value={complaintDraft.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-11 rounded-control border border-line bg-white px-3 font-normal"><option value="">—</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea value={complaintDraft.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-32 rounded-control border border-line p-3 font-normal" /> : <input type={field.type} value={complaintDraft.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-11 rounded-control border border-line px-3 font-normal" />}{field.example && <span className="font-normal text-muted">{language === "hi" ? "उदाहरण" : "Example"}: <code>{field.example}</code></span>}{error && <span className="font-normal text-urgent">{error.message}</span>}</label>;
        })}</div>
        <p className="mt-6 text-sm leading-6 text-muted">{language === "hi" ? "केवल डेमो। यहाँ दर्ज कुछ भी सरकार को नहीं भेजा जाता।" : "Demo only. Nothing entered here is sent to the government."}</p>
        <div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "डेमो रिपोर्ट तैयार करें" : "Prepare demo report"}</button><button type="button" className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={resetComplaintDraft}>{language === "hi" ? "रीसेट" : "Reset"}</button></div>
      </form>}
    </section>}
    <SourceStrip route={route} />
  </div>;
}

function WomenChildChoices({ route }: { route: NonNullable<ReturnType<typeof routeDefinition>> }) {
  const { language } = usePortal();
  const choices = route.items.slice(0, 2);
  const urgent = route.items[2];
  return <section className="mt-8 max-w-4xl"><h2 className="text-2xl font-semibold">{language === "hi" ? "आप कैसे आगे बढ़ना चाहेंगे?" : "How would you like to continue?"}</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{choices.map((choice, index) => <Link key={choice.title} href={`/${choice.route}`} className="group flex min-h-48 flex-col rounded-panel border border-line p-6 hover:border-civic-600"><h3 className="text-xl font-semibold">{choice.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted">{choice.body}</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-civic-700">{index === 0 ? (language === "hi" ? "नाम के बिना जारी रखें" : "Continue without my name") : (language === "hi" ? "विवरण के साथ जारी रखें" : "Continue with details")}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div>{urgent && <aside className="mt-6 flex gap-4 rounded-panel bg-urgent-soft p-5"><TriangleAlert className="mt-0.5 size-6 shrink-0 text-urgent" /><div><h2 className="font-semibold text-urgent">{urgent.title}</h2><p className="mt-1 text-sm leading-6 text-muted">{urgent.body}</p></div></aside>}</section>;
}
