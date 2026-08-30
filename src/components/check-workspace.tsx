"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, CircleHelp, ExternalLink, FileText, Globe2, SearchCheck, Smartphone, TriangleAlert, UserRound, Waypoints } from "lucide-react";
import { normalizeCheckMode, resolveCheckOutcome, type CheckMode, type CheckOutcome } from "@/features/check";
import { routeDefinition } from "@/lib/routes";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { createServiceRecord, validateServiceValues, type ServiceRecord } from "@/domains/report/service-form";
import { usePortal } from "./portal-provider";

const MODE_ROUTES: Record<Exclude<CheckMode, "overview">, string> = {
  identifier: "check-identifier",
  website: "check-website",
  mobile: "mobile-connections",
  abuse: "report-abuse",
  suspect: "report-suspect",
  appeal: "appeal"
};

const MODE_META: Record<CheckMode, { en: string; hi: string; enBody: string; hiBody: string }> = {
  overview: { en: "Overview", hi: "अवलोकन", enBody: "Choose the right Check tool for the situation.", hiBody: "स्थिति के लिए सही जाँच उपकरण चुनें।" },
  identifier: { en: "Person / account", hi: "व्यक्ति / खाता", enBody: "Email, UPI ID, phone number, or account identifier.", hiBody: "ईमेल, UPI ID, मोबाइल नंबर या खाता पहचान।" },
  website: { en: "Website / app", hi: "वेबसाइट / ऐप", enBody: "A URL, website, app address, or suspicious online destination.", hiBody: "URL, वेबसाइट, ऐप पता या संदिग्ध ऑनलाइन गंतव्य।" },
  mobile: { en: "Mobile / SIM", hi: "मोबाइल / SIM", enBody: "Prepare a mobile-connection or SIM-related demo check.", hiBody: "मोबाइल कनेक्शन या SIM से जुड़ी डेमो जाँच तैयार करें।" },
  abuse: { en: "Platform abuse", hi: "प्लेटफ़ॉर्म दुरुपयोग", enBody: "Preserve evidence and choose the right abuse-reporting path.", hiBody: "साक्ष्य सुरक्षित रखें और सही दुरुपयोग रिपोर्टिंग रास्ता चुनें।" },
  suspect: { en: "Report suspect", hi: "संदिग्ध रिपोर्ट करें", enBody: "Prepare suspicious contact or account information for the right handoff.", hiBody: "संदिग्ध संपर्क या खाता जानकारी सही हस्तांतरण के लिए तैयार करें।" },
  appeal: { en: "Appeal", hi: "अपील", enBody: "Prepare an appeal or follow-up request without sending it.", hiBody: "अपील या फॉलो-अप अनुरोध बिना भेजे तैयार करें।" }
};

const SUSPICIOUS_MODES: CheckMode[] = ["identifier", "website", "mobile"];
const ACTION_MODES: CheckMode[] = ["abuse", "suspect", "appeal"];

function modeLabel(mode: CheckMode, language: Language) {
  return language === "hi" ? MODE_META[mode].hi : MODE_META[mode].en;
}

function modeBody(mode: CheckMode, language: Language) {
  return language === "hi" ? MODE_META[mode].hiBody : MODE_META[mode].enBody;
}

function ModeIcon({ mode, className = "size-5" }: { mode: CheckMode; className?: string }) {
  if (mode === "identifier") return <UserRound className={className} />;
  if (mode === "website") return <Globe2 className={className} />;
  if (mode === "mobile") return <Smartphone className={className} />;
  if (mode === "abuse") return <TriangleAlert className={className} />;
  if (mode === "suspect") return <FileText className={className} />;
  if (mode === "appeal") return <CircleHelp className={className} />;
  return <Waypoints className={className} />;
}

export function CheckWorkspace() {
  const { language } = usePortal();
  const router = useRouter();
  const params = useSearchParams();
  const mode = normalizeCheckMode(params.get("mode"));
  const setMode = (next: CheckMode) => router.replace(next === "overview" ? "/official-tools" : `/official-tools?mode=${next}`);

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span aria-current="page">{language === "hi" ? "जाँच" : "Check"}</span></nav>

    <header className="mt-5 border-b border-line pb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{language === "hi" ? "डेमो जाँच कार्यक्षेत्र" : "Demo Check workspace"}</p>
      <h1 className="mt-3 max-w-[20ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{language === "hi" ? "संदिग्ध विवरण जाँचें" : "Check suspicious details"}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{language === "hi" ? "डेमो पहचान, वेबसाइट या मोबाइल विवरण जाँचें—या रिपोर्टिंग कार्रवाई चुनें। कुछ भी भेजा, अपलोड या सहेजा नहीं जाता।" : "Check a demo identifier, website, or mobile detail—or choose a reporting action. Nothing is sent, uploaded, or saved."}</p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted" aria-label={language === "hi" ? "जाँच सीमाएँ" : "Check boundaries"}>
        <span>● {language === "hi" ? "केवल डेमो" : "Demo only"}</span>
        <span>● {language === "hi" ? "कोई अपलोड नहीं" : "No upload"}</span>
        <span>● {language === "hi" ? "कोई लाइव जाँच नहीं" : "No live lookup"}</span>
        <span>● {language === "hi" ? "आधिकारिक हस्तांतरण" : "Official handoff"}</span>
      </div>
    </header>

    <div className="mt-7 grid min-w-0 gap-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
      <CheckToolRail mode={mode} setMode={setMode} language={language} />
      <section className="min-w-0" data-check-mode={mode}>
        {mode === "overview" ? <OverviewLauncher setMode={setMode} /> : mode === "identifier" || mode === "website" ? <IdentifierCheck mode={mode} /> : mode === "abuse" ? <AbuseMode /> : <LocalDraft mode={mode} />}
      </section>
    </div>
  </div>;
}

function CheckToolRail({ mode, setMode, language }: { mode: CheckMode; setMode: (mode: CheckMode) => void; language: Language }) {
  const renderButton = (item: CheckMode) => <button
    key={item}
    type="button"
    aria-current={mode === item ? "page" : undefined}
    onClick={() => setMode(item)}
    className={`flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-semibold transition-colors ${mode === item ? "bg-civic-50 text-civic-700" : "text-ink hover:bg-civic-50 hover:text-civic-700"}`}
  ><ModeIcon mode={item} className="size-4 shrink-0" /><span>{modeLabel(item, language)}</span></button>;

  return <aside className="min-w-0">
    <label className="grid gap-2 text-sm font-semibold lg:hidden"><span>{language === "hi" ? "जाँच उपकरण चुनें" : "Choose Check tool"}</span><select value={mode} onChange={(event) => setMode(event.target.value as CheckMode)} className="min-h-11 rounded-control border border-line bg-white px-3 font-normal">{(["overview", ...SUSPICIOUS_MODES, ...ACTION_MODES] as CheckMode[]).map((item) => <option key={item} value={item}>{modeLabel(item, language)}</option>)}</select></label>
    <nav aria-label={language === "hi" ? "जाँच उपकरण" : "Check tools"} className="sticky top-5 hidden rounded-panel border border-line bg-white p-3 lg:block">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "जाँच उपकरण" : "Check tools"}</p>
      {renderButton("overview")}
      <div className="mt-3 border-t border-line pt-3"><p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{language === "hi" ? "संदिग्ध चीज़ जाँचें" : "Check something suspicious"}</p>{SUSPICIOUS_MODES.map(renderButton)}</div>
      <div className="mt-3 border-t border-line pt-3"><p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{language === "hi" ? "रिपोर्ट या कार्रवाई" : "Report or take action"}</p>{ACTION_MODES.map(renderButton)}</div>
    </nav>
  </aside>;
}

function OverviewLauncher({ setMode }: { setMode: (mode: CheckMode) => void }) {
  const { language } = usePortal();
  return <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_320px]">
    <div className="min-w-0">
      <h2 className="text-2xl font-semibold">{language === "hi" ? "आप क्या जाँचना चाहते हैं?" : "What do you want to check?"}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{language === "hi" ? "पहले स्थिति चुनें। हर विकल्प इसी जाँच कार्यक्षेत्र में रहता है और सही आधिकारिक अगला कदम दिखाता है।" : "Start with the situation. Every option stays inside this Check workspace and points to the right official next step."}</p>

      <section className="mt-7" aria-labelledby="check-suspicious-title"><p id="check-suspicious-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "संदिग्ध चीज़ जाँचें" : "Check something suspicious"}</p><div className="mt-3 grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-3">{SUSPICIOUS_MODES.map((item) => <ModeLauncher key={item} mode={item} language={language} setMode={setMode} />)}</div></section>

      <section className="mt-8" aria-labelledby="check-actions-title"><p id="check-actions-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "रिपोर्ट या कार्रवाई" : "Report or take action"}</p><div className="mt-3 divide-y divide-line border-y border-line bg-white">{ACTION_MODES.map((item) => <button key={item} type="button" onClick={() => setMode(item)} className="group flex min-h-20 w-full items-center gap-4 py-4 text-left"><span className="grid size-11 shrink-0 place-items-center rounded-panel bg-civic-50 text-civic-700"><ModeIcon mode={item} /></span><span className="min-w-0 flex-1"><strong className="block">{modeLabel(item, language)}</strong><span className="mt-1 block text-sm leading-6 text-muted">{modeBody(item, language)}</span></span><ArrowRight className="size-4 shrink-0 text-civic-700 transition-transform group-hover:translate-x-1" /></button>)}</div></section>
    </div>
    <AboutThisCheck />
  </div>;
}

function ModeLauncher({ mode, language, setMode }: { mode: CheckMode; language: Language; setMode: (mode: CheckMode) => void }) {
  return <button type="button" onClick={() => setMode(mode)} className="group flex min-h-44 flex-col items-start border-b border-line p-5 text-left last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><ModeIcon mode={mode} /></span><strong className="mt-5 text-base">{modeLabel(mode, language)}</strong><span className="mt-2 flex-1 text-sm leading-6 text-muted">{modeBody(mode, language)}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-civic-700">{language === "hi" ? "खोलें" : "Open"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></button>;
}

function IdentifierCheck({ mode }: { mode: "identifier" | "website" }) {
  const { language } = usePortal();
  const [value, setValue] = useState("");
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const inferred = resolveCheckOutcome(value, mode).detectedType;
  const examples = mode === "website" ? ["https://example.test"] : ["demo@example.test", "demo@upi", "9000000000", "123456789012"];
  const submit = (event: FormEvent) => { event.preventDefault(); if (value.trim()) setOutcome(resolveCheckOutcome(value, mode)); };
  const reset = () => { setValue(""); setOutcome(null); };

  return <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
    <form onSubmit={submit} className="min-w-0 rounded-panel border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "केवल डेमो" : "Demo only"}</p><h2 className="mt-2 text-2xl font-semibold">{mode === "website" ? (language === "hi" ? "वेबसाइट या ऐप जाँचें" : "Check a website or app") : (language === "hi" ? "व्यक्ति या खाता जाँचें" : "Check a person or account")}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{mode === "website" ? (language === "hi" ? "एक डेमो URL दर्ज करें। यह लाइव वेबसाइट सुरक्षा स्कैन नहीं है।" : "Enter a demo URL. This is not a live website security scan.") : (language === "hi" ? "डेमो मोबाइल, ईमेल, UPI ID या खाता पहचान दर्ज करें।" : "Enter a demo phone number, email, UPI ID, or account identifier.")}</p></div></div>
      <label className="mt-6 grid gap-2 text-sm font-semibold"><span>{language === "hi" ? "डेमो विवरण" : "Demo detail"}</span><input required type={mode === "website" ? "url" : "text"} value={value} onChange={(event) => { setValue(event.target.value); setOutcome(null); }} className="min-h-12 rounded-control border border-line px-4 text-base font-normal outline-none focus:border-civic-600 focus:ring-2 focus:ring-civic-100" placeholder={mode === "website" ? "https://example.test" : "demo@example.test"} /></label>
      {value && <div className="mt-3 text-sm" aria-live="polite"><span className="font-semibold">{language === "hi" ? "पहचाना प्रकार:" : "Detected type:"}</span> <span className="text-civic-700">{typeLabel(inferred, language)}</span></div>}
      <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{language === "hi" ? "एक उदाहरण आज़माएँ" : "Try an example"}</p><div className="mt-2 flex flex-wrap gap-2">{examples.map((example) => <button key={example} type="button" onClick={() => { setValue(example); setOutcome(null); }} className="min-h-11 rounded-control border border-line bg-canvas px-3 text-xs font-medium text-civic-700 hover:border-civic-600 hover:bg-civic-50"><code>{example}</code></button>)}</div></div>
      <div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white hover:bg-civic-700">{language === "hi" ? "डेमो जाँच चलाएँ" : "Run demo check"}</button><button type="button" onClick={reset} className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold hover:bg-civic-50">{language === "hi" ? "रीसेट" : "Reset"}</button></div>
    </form>
    {outcome ? <Outcome outcome={outcome} onReset={reset} /> : <AboutThisCheck compact />}
  </div>;
}

function AboutThisCheck({ compact = false }: { compact?: boolean }) {
  const { language } = usePortal();
  return <aside className={`self-start rounded-panel border border-line bg-civic-50 ${compact ? "p-5" : "p-6"}`}>
    <SearchCheck className="size-7 text-civic-700" />
    <h2 className="mt-4 text-lg font-semibold">{language === "hi" ? "इस जाँच के बारे में" : "About this check"}</h2>
    <div className="mt-5 border-t border-line pt-4"><h3 className="text-sm font-semibold text-success">{language === "hi" ? "क्या कर सकता है" : "Can do"}</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-muted"><li>• {language === "hi" ? "डेमो विवरण का प्रकार पहचानना" : "Classify the entered demo detail"}</li><li>• {language === "hi" ? "निश्चित ThreadZero रिकॉर्ड से तुलना" : "Compare against fixed ThreadZero fixtures"}</li><li>• {language === "hi" ? "उपयोगी साक्ष्य और अगला कदम समझाना" : "Explain useful evidence and next steps"}</li></ul></div>
    <div className="mt-5 border-t border-line pt-4"><h3 className="text-sm font-semibold text-urgent">{language === "hi" ? "क्या नहीं कर सकता" : "Cannot do"}</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-muted"><li>• {language === "hi" ? "NCRP या पुलिस सिस्टम तक पहुँच" : "Access NCRP or query police systems"}</li><li>• {language === "hi" ? "किसी वास्तविक व्यक्ति को धोखेबाज़ साबित करना" : "Determine that a real person is fraudulent"}</li><li>• {language === "hi" ? "वेबसाइट को सुरक्षित प्रमाणित करना" : "Prove that a website is safe"}</li></ul></div>
    <p className="mt-5 border-t border-line pt-4 text-xs font-semibold leading-5 text-civic-700">{language === "hi" ? "कोई लाइव जाँच नहीं · वास्तविक कार्रवाई के लिए सत्यापित आधिकारिक गंतव्य उपयोग करें।" : "No live lookup · Use the verified official destination for real action."}</p>
  </aside>;
}

function Outcome({ outcome, onReset }: { outcome: CheckOutcome; onReset: () => void }) {
  const { language } = usePortal();
  const destination = OFFICIAL_DESTINATIONS[outcome.destination];
  const matched = outcome.status === "match";
  return <aside className="overflow-hidden rounded-panel border border-line bg-white" aria-live="polite">
    <div className={`border-l-4 p-5 ${matched ? "border-success bg-success-soft" : "border-warning bg-warning-soft"}`}>{matched ? <CheckCircle2 className="size-7 text-success" /> : <TriangleAlert className="size-7 text-warning" />}<p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em]">{language === "hi" ? "जाँच परिणाम" : "Check result"}</p><h2 className="mt-2 text-xl font-semibold">{matched ? (language === "hi" ? "उदाहरणात्मक मिलान मिला" : "Illustrative match found") : (language === "hi" ? "डेमो मिलान नहीं मिला" : "No illustrative match in this demo")}</h2>{!matched && <p className="mt-3 text-sm font-semibold leading-6 text-warning">{language === "hi" ? "इसका अर्थ यह नहीं कि व्यक्ति, खाता, वेबसाइट या नंबर सुरक्षित है।" : "This does not mean the person, account, website, or number is safe."}</p>}</div>
    <div className="p-5">
      <dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-semibold">{language === "hi" ? "जाँचा गया" : "Checked"}</dt><dd className="mt-1 break-all text-muted">{outcome.value}</dd></div><div><dt className="font-semibold">{language === "hi" ? "पहचाना प्रकार" : "Detected as"}</dt><dd className="mt-1 text-muted">{typeLabel(outcome.detectedType, language)}</dd></div></dl>
      <div className="mt-5 border-l-2 border-civic-600 pl-3 text-xs leading-5 text-muted"><strong className="text-ink">{language === "hi" ? "डेमो सीमा:" : "Demo boundary:"}</strong> {language === "hi" ? "यह एक डेमो परिणाम है। यह सरकारी या लाइव-डेटाबेस जाँच नहीं है।" : "This is a demonstration result. It is not a government or live-database lookup."}</div>
      <section className="mt-6 border-t border-line pt-5"><h3 className="text-sm font-semibold">{language === "hi" ? "आगे क्या सत्यापित करें" : "What to verify next"}</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-muted"><li>• {language === "hi" ? "पता और वर्तनी की जाँच करें" : "Check the address and spelling"}</li><li>• {language === "hi" ? "संपर्क और भुगतान संदर्भ स्वतंत्र रूप से सत्यापित करें" : "Verify contact and payment context independently"}</li><li>• {language === "hi" ? "किसी विश्वसनीय स्रोत से तुलना करें" : "Compare against a trusted source"}</li></ul></section>
      <section className="mt-5 border-t border-line pt-5"><h3 className="text-sm font-semibold">{language === "hi" ? "साक्ष्य सुरक्षित रखें" : "Evidence to keep"}</h3><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "मूल URL या पहचान, संदेश, समय और संबंधित भुगतान रिकॉर्ड सुरक्षित रखें।" : "Keep the original URL or identifier, messages, timestamps, and related payment records."}</p></section>
      <section className="mt-5 border-t border-line pt-5"><h3 className="text-sm font-semibold">{language === "hi" ? "आधिकारिक अगला कदम" : "Official next step"}</h3><a href={destination.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white hover:bg-civic-700">{localized(destination, language)}<ExternalLink className="size-4" /></a><button type="button" onClick={onReset} className="mt-2 inline-flex min-h-11 items-center px-3 text-sm font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "दूसरा विवरण जाँचें" : "Check another detail"}</button></section>
    </div>
  </aside>;
}

function LocalDraft({ mode }: { mode: "mobile" | "suspect" | "appeal" }) {
  const { language } = usePortal();
  const route = routeDefinition(MODE_ROUTES[mode], language);
  const [record, setRecord] = useState<ServiceRecord>(() => createServiceRecord());
  const errorRef = useRef<HTMLDivElement>(null);
  const fields = route?.fields || [];
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateServiceValues(fields, record.values, {
      required: language === "hi" ? "यह फ़ील्ड आवश्यक है।" : "This field is required.",
      short: language === "hi" ? "अधिक विवरण जोड़ें।" : "Add more detail.",
      invalid: language === "hi" ? "दिया गया डेमो उदाहरण उपयोग करें।" : "Use the documented demo example."
    });
    setRecord({ values: validation.normalized, errors: validation.errors, submitted: !validation.errors.length });
    if (validation.errors.length) requestAnimationFrame(() => errorRef.current?.focus());
  };
  if (!route) return null;
  if (record.submitted) return <div className="max-w-form rounded-panel border border-success bg-success-soft p-6"><CheckCircle2 className="size-7 text-success" /><h2 className="mt-4 text-xl font-semibold">{route.result}</h2><p className="mt-2 text-sm text-muted">{language === "hi" ? "मसौदा केवल इस पेज की मेमोरी में है। कुछ भी भेजा या सहेजा नहीं गया।" : "The draft exists only in this page memory. Nothing was sent or stored."}</p><button onClick={() => setRecord(createServiceRecord())} className="mt-5 min-h-11 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700">{language === "hi" ? "विवरण बदलें" : "Edit details"}</button></div>;
  return <form onSubmit={submit} noValidate className="max-w-form rounded-panel border border-line bg-white p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "स्थानीय डेमो तैयारी" : "Local demo preparation"}</p><h2 className="mt-2 text-2xl font-semibold">{route.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{route.intro}</p>{record.errors.length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-5 border-l-4 border-urgent bg-urgent-soft p-4"><h3 className="font-semibold text-urgent">{language === "hi" ? "चिह्नित फ़ील्ड जाँचें" : "Check the marked fields"}</h3></div>}<div className="mt-5 grid gap-5 sm:grid-cols-2">{fields.map((field) => <label key={field.name} className={`grid gap-2 text-sm font-semibold ${field.type === "textarea" ? "sm:col-span-2" : ""}`}><span>{field.label}</span>{field.type === "textarea" ? <textarea className="min-h-32 rounded-control border border-line p-3 font-normal" value={record.values[field.name] || ""} onChange={(event) => setRecord((old) => ({ ...old, values: { ...old.values, [field.name]: event.target.value }, errors: [] }))} /> : <input className="min-h-11 rounded-control border border-line px-3 font-normal" type={field.type} value={record.values[field.name] || ""} onChange={(event) => setRecord((old) => ({ ...old, values: { ...old.values, [field.name]: event.target.value }, errors: [] }))} />}{field.example && <span className="font-normal text-muted">{language === "hi" ? "डेमो उदाहरण" : "Demo example"}: <code>{field.example}</code></span>}</label>)}</div><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "स्थानीय मसौदा तैयार करें" : "Prepare local draft"}</button><button type="button" onClick={() => setRecord(createServiceRecord())} className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold">{language === "hi" ? "रीसेट" : "Reset"}</button></div></form>;
}

function AbuseMode() {
  const { language } = usePortal();
  return <div className="max-w-document"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "प्लेटफ़ॉर्म दुरुपयोग" : "Platform abuse"}</p><h2 className="mt-2 text-2xl font-semibold">{language === "hi" ? "साक्ष्य खोए बिना प्लेटफ़ॉर्म दुरुपयोग रिपोर्ट करें" : "Report platform abuse without losing evidence"}</h2><ol className="mt-5 divide-y divide-line border-y border-line">{(language === "hi" ? [["सुरक्षित रखें", "मूल प्रोफ़ाइल URL, पूरा संदेश संदर्भ, समय और स्क्रीनशॉट रखें।"], ["सही श्रेणी चुनें", "प्रतिरूपण, धमकी, धोखाधड़ी या उत्पीड़न सही चुनें।"], ["आधिकारिक कार्रवाई", "प्लेटफ़ॉर्म उपकरण उपयोग करें; अपराध के लिए cybercrime.gov.in खोलें।"]] : [["Preserve", "Keep the original profile URL, full message context, timestamps, and screenshots."], ["Choose the right category", "Classify impersonation, threats, fraud, or harassment accurately."], ["Take official action", "Use the platform tools; for a crime, open cybercrime.gov.in."]]).map(([title, body], index) => <li key={title} className="grid gap-3 py-5 sm:grid-cols-[44px_1fr]"><span className="grid size-11 place-items-center rounded-full border border-civic-600 font-semibold text-civic-700">{index + 1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{body}</p></div></li>)}</ol><a className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href={OFFICIAL_DESTINATIONS.officialReportAbuse.url} target="_blank" rel="noreferrer">{localized(OFFICIAL_DESTINATIONS.officialReportAbuse, language)}<ExternalLink className="size-4" /></a></div>;
}

function typeLabel(type: CheckOutcome["detectedType"], language: Language) {
  const labels = language === "hi" ? { url: "वेब पता", email: "ईमेल", phone: "मोबाइल", upi: "UPI ID", "bank-account": "बैंक खाता", unknown: "अज्ञात" } : { url: "web address", email: "email", phone: "mobile", upi: "UPI ID", "bank-account": "bank account", unknown: "unknown" };
  return labels[type];
}
