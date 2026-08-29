"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ExternalLink, LifeBuoy, Phone, Trash2 } from "lucide-react";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

export function HelpHub() {
  const { language, eraseLocalData, openAssistant } = usePortal();
  const [confirmErase, setConfirmErase] = useState(false);
  const [erased, setErased] = useState(false);
  const official = OFFICIAL_DESTINATIONS;
  const erase = () => { eraseLocalData(); setConfirmErase(false); setErased(true); };

  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span>{language === "hi" ? "सहायता" : "Help"}</span></nav>
    <header className="mt-6 max-w-3xl"><h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{language === "hi" ? "सही मदद जल्दी खोजें" : "Find the right help quickly"}</h1><p className="mt-4 text-base leading-7 text-muted">{language === "hi" ? "तात्कालिक मदद, ThreadZero के बारे में सवाल, आधिकारिक शिकायत/एस्केलेशन और आपकी स्थानीय डेमो जानकारी—सब एक जगह।" : "Urgent help, questions about ThreadZero, official escalation, and your local demo data are all in one place."}</p></header>

    <section className="mt-8 border-y border-[#efaaa3] bg-urgent-soft py-6"><div className="grid gap-4 md:grid-cols-[48px_1fr_auto] md:items-center"><span className="grid size-11 place-items-center rounded-full bg-white text-urgent"><Phone className="size-5" /></span><div><h2 className="text-lg font-semibold text-urgent">{language === "hi" ? "पैसा गया? पहले 1930 पर स्वयं कॉल करें।" : "Lost money? Call 1930 manually first."}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{language === "hi" ? "ThreadZero कॉल नहीं करता, धन फ्रीज़ नहीं करता और सरकारी रिपोर्ट नहीं भेजता।" : "ThreadZero cannot place the call, freeze funds, or submit a government report."}</p></div><a href={official.officialHome.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "आधिकारिक पोर्टल खोलें" : "Open official portal"}<ExternalLink className="size-4" /></a></div></section>

    <div className="divide-y divide-line border-b border-line">
      <section className="py-7"><h2 className="text-xl font-semibold">{language === "hi" ? "ThreadZero कैसे काम करता है?" : "Using ThreadZero"}</h2><div className="mt-4 divide-y divide-line">{[
        [language === "hi" ? "क्या ThreadZero मेरी रिपोर्ट सरकार को भेजता है?" : "Does ThreadZero submit my report?", language === "hi" ? "नहीं। यह केवल डेमो तैयारी उपकरण है। अंतिम कार्रवाई आधिकारिक सेवा पर ही होती है।" : "No. It is a preparation demo only. Final action happens on the official service."],
        [language === "hi" ? "अगर मेरे पास कुछ साक्ष्य नहीं हैं?" : "What if some evidence is missing?", language === "hi" ? "जो उपलब्ध है उसे चिन्हित करें। गायब साक्ष्य मार्गदर्शन है, रिपोर्ट रोकने का कारण नहीं।" : "Mark what is available. Missing evidence is guidance, not a reason to delay urgent reporting."],
        [language === "hi" ? "क्या मेरी जानकारी कहीं अपलोड होती है?" : "Is my information uploaded anywhere?", language === "hi" ? "नहीं। यह संस्करण बैकएंड, अपलोड या बाहरी लिखने वाली इंटीग्रेशन का उपयोग नहीं करता।" : "No. This version has no backend, uploads, or external write integration."],
        [language === "hi" ? "सरकारी केस की स्थिति कहाँ देखें?" : "Where do I check official case status?", language === "hi" ? "Progress पेज केवल ThreadZero की स्थानीय तैयारी दिखाता है। सरकारी स्थिति के लिए आधिकारिक ट्रैकिंग सेवा खोलें।" : "Progress only shows local ThreadZero preparation. Use the official tracking service for government case status."]
      ].map(([question, answer]) => <details key={question} className="py-3"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-civic-700">{question}</summary><p className="max-w-3xl pb-2 text-sm leading-6 text-muted">{answer}</p></details>)}</div><a href={official.officialFaq.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 underline underline-offset-4">{localized(official.officialFaq, language)}<ExternalLink className="size-4" /></a></section>

      <section className="py-7"><h2 className="text-xl font-semibold">{language === "hi" ? "आधिकारिक शिकायत, संदिग्ध रिपोर्ट और अपील" : "Official escalation, suspect reporting, and appeals"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "ये ‘Check’ नहीं हैं, इसलिए इन्हें एक ही सहायता सेक्शन में रखा गया है। सही आधिकारिक सेवा चुनें।" : "These are actions, not checks, so they live together in Help. Choose the relevant official service."}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{[
        official.officialContacts,
        official.officialSuspectReport,
        official.officialReportAbuse,
        official.officialGac,
        official.officialFeedback
      ].map((destination) => <a key={destination.url} href={destination.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 underline underline-offset-4">{localized(destination, language)}<ExternalLink className="size-4" /></a>)}</div></section>

      <section className="py-7"><div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start"><div><h2 className="text-xl font-semibold">{language === "hi" ? "इस डिवाइस पर सहेजा डेटा" : "Saved data on this device"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "चुनी हुई डेमो प्रोफ़ाइल रिपोर्ट प्रगति को localStorage में रख सकती है। आप इसे यहाँ से साफ कर सकते हैं।" : "A selected demo profile can keep report progress in localStorage. You can clear it here."}</p></div><span className="grid size-11 place-items-center rounded-full bg-civic-50 text-civic-700"><Trash2 className="size-5" /></span></div>{erased ? <p role="status" className="mt-4 text-sm font-semibold text-success">{language === "hi" ? "सहेजा स्थानीय डेटा मिटा दिया गया।" : "Saved local data was erased."}</p> : !confirmErase ? <button className="mt-4 min-h-11 rounded-control border border-urgent px-5 text-sm font-semibold text-urgent" onClick={() => setConfirmErase(true)}>{language === "hi" ? "सहेजा डेटा मिटाएँ" : "Erase saved data"}</button> : <div className="mt-4 flex flex-wrap items-center gap-3"><p className="w-full text-sm font-semibold">{language === "hi" ? "क्या आप रिपोर्ट प्रगति, डेमो प्रोफ़ाइल और भाषा पसंद साफ करना चाहते हैं?" : "Erase report progress, demo profile, and language preference?"}</p><button className="min-h-11 rounded-control bg-urgent px-5 text-sm font-semibold text-white" onClick={erase}>{language === "hi" ? "हाँ, सब मिटाएँ" : "Yes, erase all"}</button><button className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => setConfirmErase(false)}>{language === "hi" ? "रद्द करें" : "Cancel"}</button></div>}</section>

      <section className="py-7"><h2 className="text-xl font-semibold">{language === "hi" ? "गोपनीयता, सुगम्यता और अवधारणा जानकारी" : "Privacy, accessibility, and concept information"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "ये उपयोगी संदर्भ हैं, मुख्य नागरिक कार्य नहीं। इसलिए इन्हें सहायता के अंदर रखा गया है।" : "These are useful references, not primary citizen tasks, so they stay inside Help."}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link href="/privacy" className="inline-flex min-h-11 items-center text-sm font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "गोपनीयता" : "Privacy"}</Link><Link href="/accessibility" className="inline-flex min-h-11 items-center text-sm font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "सुगम्यता" : "Accessibility"}</Link><Link href="/about" className="inline-flex min-h-11 items-center text-sm font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "इस अवधारणा के बारे में" : "About this concept"}</Link></div></section>
    </div>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3 text-sm text-muted"><LifeBuoy className="size-5 text-civic-700" /><span>{language === "hi" ? `आधिकारिक लिंक जाँचे गए: ${official.officialHome.verifiedOn}` : `Official links checked: ${official.officialHome.verifiedOn}`}</span></div><button className="inline-flex min-h-11 items-center gap-2 font-semibold text-civic-700" onClick={() => openAssistant("help")}>{language === "hi" ? "अभी भी निश्चित नहीं?" : "Still not sure?"}<ArrowRight className="size-4" /></button></div>
  </div>;
}
