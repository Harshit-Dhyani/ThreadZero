"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle2, ExternalLink, SearchCheck, Smartphone, TriangleAlert } from "lucide-react";
import { CHECK_MODES, normalizeCheckMode, resolveCheckOutcome, type CheckMode, type CheckOutcome } from "@/features/check";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { usePortal } from "./portal-provider";

const MODE_LABELS: Record<CheckMode, { en: string; hi: string }> = {
  identifier: { en: "Contact / account", hi: "संपर्क / खाता" },
  website: { en: "Website / app", hi: "वेबसाइट / ऐप" },
  mobile: { en: "Mobile / SIM", hi: "मोबाइल / SIM" }
};

export function CheckWorkspace() {
  const { language } = usePortal();
  const router = useRouter();
  const params = useSearchParams();
  const mode = normalizeCheckMode(params.get("mode"));
  const setMode = (next: CheckMode) => router.replace(next === "identifier" ? "/official-tools" : `/official-tools?mode=${next}`);

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span aria-current="page">{language === "hi" ? "जाँच" : "Check"}</span></nav>
    <header className="mt-6 max-w-3xl"><h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{language === "hi" ? "किसी संदिग्ध चीज़ की जाँच करें" : "Check something suspicious"}</h1><p className="mt-4 text-base leading-7 text-muted">{language === "hi" ? "एक ही जगह पर सही जाँच प्रकार चुनें। ThreadZero केवल निश्चित डेमो उदाहरण दिखाता है; यह लाइव फ्रॉड डेटाबेस नहीं है।" : "Choose the right kind of check in one place. ThreadZero only shows fixed demo examples; it is not a live fraud database."}</p></header>

    <div className="mt-7 border-y border-line py-3"><div className="flex flex-wrap gap-2" role="group" aria-label={language === "hi" ? "जाँच प्रकार" : "Check type"}>{CHECK_MODES.map((entry) => <button key={entry} type="button" aria-pressed={mode === entry} onClick={() => setMode(entry)} className={`min-h-11 rounded-control px-4 text-sm font-semibold ${mode === entry ? "bg-civic-600 text-white" : "border border-line bg-white text-ink hover:bg-civic-50"}`}>{localized(MODE_LABELS[entry], language)}</button>)}</div></div>

    <section className="mt-7" data-check-mode={mode}>{mode === "mobile" ? <MobileCheck /> : <FixtureCheck mode={mode} />}</section>

    <aside className="mt-8 border-t border-line pt-6 text-sm leading-6 text-muted"><strong className="text-ink">{language === "hi" ? "किसी चीज़ का डेमो में न मिलना उसे सुरक्षित साबित नहीं करता।" : "Absence from this demo does not mean the item is safe."}</strong> {language === "hi" ? "वास्तविक जाँच या कार्रवाई के लिए दिए गए आधिकारिक गंतव्य का उपयोग करें।" : "Use the linked official destination for a real check or action."}</aside>
  </div>;
}

function FixtureCheck({ mode }: { mode: "identifier" | "website" }) {
  const { language } = usePortal();
  const [value, setValue] = useState("");
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const placeholder = mode === "website" ? "https://example.test" : "demo@example.test";
  const submit = (event: FormEvent) => { event.preventDefault(); if (value.trim()) setOutcome(resolveCheckOutcome(value, mode)); };

  return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]"><form onSubmit={submit} className="max-w-form"><h2 className="text-2xl font-semibold">{mode === "website" ? (language === "hi" ? "वेबसाइट या ऐप पता" : "Website or app address") : (language === "hi" ? "संपर्क या खाता पहचान" : "Contact or account identifier")}</h2><p className="mt-2 text-sm leading-6 text-muted">{mode === "website" ? (language === "hi" ? "डेमो URL डालें और देखें कि निश्चित उदाहरण कैसे दिखाया जाता है।" : "Enter the demo URL to see how a fixed example is presented.") : (language === "hi" ? "ईमेल, UPI ID, फोन या खाता जैसा डेमो मान दर्ज करें।" : "Enter a demo value such as an email, UPI ID, phone, or account number.")}</p><label className="mt-5 grid gap-2 text-sm font-semibold"><span>{language === "hi" ? "डेमो मान" : "Demo value"}</span><input required type={mode === "website" ? "url" : "text"} value={value} onChange={(event) => { setValue(event.target.value); setOutcome(null); }} className="min-h-11 rounded-control border border-line bg-white px-3 font-normal" placeholder={placeholder} /></label><p className="mt-3 text-xs leading-5 text-muted">{language === "hi" ? `उदाहरण: ${placeholder}` : `Example: ${placeholder}`}</p><div className="mt-5 flex flex-wrap gap-3"><button className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white"><SearchCheck className="size-4" />{language === "hi" ? "डेमो जाँच चलाएँ" : "Run demo check"}</button><button type="button" onClick={() => { setValue(""); setOutcome(null); }} className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold">{language === "hi" ? "रीसेट" : "Reset"}</button></div></form>{outcome ? <Outcome outcome={outcome} /> : <aside className="border-l border-line pl-5"><h2 className="text-lg font-semibold">{language === "hi" ? "परिणाम क्या बताएगा" : "What the result tells you"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "पहचाना प्रकार, डेमो मिलान और वास्तविक जाँच के लिए सही आधिकारिक लिंक।" : "Detected type, fixed demo match, and the correct official link for a real check."}</p></aside>}</div>;
}

function MobileCheck() {
  const { language } = usePortal();
  const destination = OFFICIAL_DESTINATIONS.officialTafcop;
  return <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="max-w-form"><Smartphone className="size-8 text-civic-700" /><h2 className="mt-4 text-2xl font-semibold">{language === "hi" ? "अपने नाम से जुड़े मोबाइल कनेक्शन जाँचें" : "Check mobile connections linked to you"}</h2><p className="mt-3 text-sm leading-6 text-muted">{language === "hi" ? "ThreadZero फोन नंबर डेटाबेस नहीं खोजता। वास्तविक मोबाइल/SIM कनेक्शन जाँच के लिए आधिकारिक TAFCOP सेवा खोलें और वहीं प्रक्रिया पूरी करें।" : "ThreadZero does not search a phone-number database. For a real mobile/SIM connection check, open the official TAFCOP service and complete the process there."}</p><a href={destination.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{localized(destination, language)}<ExternalLink className="size-4" /></a></div><aside className="border-l border-line pl-5"><h2 className="text-lg font-semibold">{language === "hi" ? "यह अलग क्यों है" : "Why this is different"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "संदिग्ध फोन नंबर और आपके नाम पर जारी SIM कनेक्शन एक ही समस्या नहीं हैं। इसलिए ThreadZero नकली एकीकृत परिणाम नहीं दिखाता।" : "A suspicious phone number and SIM connections issued in your name are different problems, so ThreadZero does not fake a single combined result."}</p></aside></div>;
}

function Outcome({ outcome }: { outcome: CheckOutcome }) {
  const { language } = usePortal();
  const destination = OFFICIAL_DESTINATIONS[outcome.destination];
  const matched = outcome.status === "match";
  return <aside className={`border-l-4 p-5 ${matched ? "border-success bg-success-soft" : "border-warning bg-warning-soft"}`} aria-live="polite">{matched ? <CheckCircle2 className="size-7 text-success" /> : <TriangleAlert className="size-7 text-warning" />}<h2 className="mt-4 text-xl font-semibold">{matched ? (language === "hi" ? "उदाहरणात्मक मिलान मिला" : "Illustrative match found") : (language === "hi" ? "डेमो मिलान नहीं मिला" : "No demo match found")}</h2><dl className="mt-4 grid gap-3 text-sm"><div><dt className="font-semibold">{language === "hi" ? "दिया गया मान" : "Entered value"}</dt><dd className="mt-1 break-all text-muted">{outcome.value}</dd></div><div><dt className="font-semibold">{language === "hi" ? "पहचाना प्रकार" : "Detected type"}</dt><dd className="mt-1 text-muted">{typeLabel(outcome.detectedType, language)}</dd></div></dl>{!matched && <p className="mt-4 font-semibold text-warning">{language === "hi" ? "डेमो में अनुपस्थिति का अर्थ यह नहीं कि विवरण सुरक्षित है।" : "Absence from this demo does not mean the item is safe."}</p>}<a href={destination.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white">{localized(destination, language)}<ExternalLink className="size-4" /></a></aside>;
}

function typeLabel(type: CheckOutcome["detectedType"], language: Language) {
  const labels: Record<CheckOutcome["detectedType"], { en: string; hi: string }> = { email: { en: "Email", hi: "ईमेल" }, phone: { en: "Phone", hi: "फ़ोन" }, upi: { en: "UPI ID", hi: "UPI ID" }, "bank-account": { en: "Bank/account number", hi: "बैंक/खाता नंबर" }, url: { en: "Website URL", hi: "वेबसाइट URL" }, unknown: { en: "Unknown", hi: "अज्ञात" } };
  return localized(labels[type], language);
}
