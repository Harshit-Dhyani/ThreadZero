"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FileCheck2, ShieldCheck, TriangleAlert } from "lucide-react";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import { usePortal } from "./portal-provider";

export function LearnHub() {
  const { language, openAssistant } = usePortal();
  const official = OFFICIAL_DESTINATIONS;
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span>{language === "hi" ? "सीखें" : "Learn"}</span></nav>
    <header className="mt-6 max-w-3xl"><h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{language === "hi" ? "साइबर धोखाधड़ी समझें, बिना पोर्टल की जटिलता के" : "Understand cyber fraud without portal complexity"}</h1><p className="mt-4 text-base leading-7 text-muted">{language === "hi" ? "सुरक्षित रहने, सामान्य स्कैम पहचानने, साक्ष्य तैयार करने और आधिकारिक अलर्ट देखने के लिए चार सरल रास्ते।" : "Four simple paths for staying safe, recognising common scam patterns, preparing evidence, and checking official alerts."}</p></header>

    <div className="mt-8 divide-y divide-line border-y border-line">
      <LearnRow icon={<ShieldCheck className="size-5" />} title={language === "hi" ? "अभी सुरक्षित रहें" : "Stay safe right now"} body={language === "hi" ? "फिशिंग, भुगतान अनुरोध, खाते की सुरक्षा और संदिग्ध संपर्क पर आधिकारिक सुरक्षा सुझाव देखें।" : "Use official safety guidance for phishing, payment requests, account protection, and suspicious contact."} action={localized(official.officialSafety, language)} href={official.officialSafety.url} />
      <LearnRow icon={<TriangleAlert className="size-5" />} title={language === "hi" ? "सामान्य स्कैम पैटर्न पहचानें" : "Recognise common scam patterns"} body={language === "hi" ? "निवेश, नौकरी, मार्केटप्लेस, प्रतिरूपण, नकली वेबसाइट और अन्य पैटर्न के बारे में आधिकारिक जागरूकता सामग्री देखें।" : "Review official awareness material for investment, job, marketplace, impersonation, fake-site, and other scam patterns."} action={localized(official.officialAwareness, language)} href={official.officialAwareness.url} />
      <LearnRow icon={<FileCheck2 className="size-5" />} title={language === "hi" ? "साक्ष्य और समयरेखा तैयार करें" : "Prepare evidence and a timeline"} body={language === "hi" ? "जो रिकॉर्ड आपके पास हैं उन्हें व्यवस्थित करें और उन्हें घटना के क्रम से जोड़ें। गायब साक्ष्य को विफलता न मानें।" : "Organise the records you actually have and connect them to the incident sequence. Missing evidence is guidance, not failure."} action={language === "hi" ? "रिपोर्ट तैयारी खोलें" : "Open report preparation"} href="/incident" internal />
      <LearnRow icon={<BookOpen className="size-5" />} title={language === "hi" ? "आधिकारिक अलर्ट और अपडेट" : "Official alerts and updates"} body={language === "hi" ? "अलग-अलग ‘Advisory’ और ‘Daily digest’ मेनू के बजाय आधिकारिक चेतावनियाँ और डाइजेस्ट यहीं से खोलें।" : "Instead of separate Advisory and Daily Digest menus, open the official alerts and digest from here."} action={localized(official.officialAdvisories, language)} href={official.officialAdvisories.url} secondaryHref={official.officialDigest.url} secondaryAction={localized(official.officialDigest, language)} />
    </div>

    <section className="mt-9 grid gap-5 border-b border-line pb-9 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="text-xl font-semibold">{language === "hi" ? "वीडियो या प्रशिक्षण चाहिए?" : "Prefer video or training?"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{language === "hi" ? "ये अलग मुख्य सेक्शन नहीं हैं—सिर्फ सीखने के दूसरे प्रारूप हैं।" : "These are learning formats, not separate primary product sections."}</p></div><div className="flex flex-wrap gap-3"><a href={official.officialVideos.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 underline underline-offset-4">{localized(official.officialVideos, language)}<ExternalLink className="size-4" /></a><a href={official.officialTraining.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 underline underline-offset-4">{localized(official.officialTraining, language)}<ExternalLink className="size-4" /></a></div></section>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 text-sm"><p className="text-muted">{language === "hi" ? `आधिकारिक लिंक जाँचे गए: ${official.officialSafety.verifiedOn}` : `Official links checked: ${official.officialSafety.verifiedOn}`}</p><button className="inline-flex min-h-11 items-center gap-2 font-semibold text-civic-700" onClick={() => openAssistant("learn")}>{language === "hi" ? "पता नहीं कहाँ जाएँ?" : "Not sure where to go?"}<ArrowRight className="size-4" /></button></div>
  </div>;
}

function LearnRow({ icon, title, body, action, href, internal = false, secondaryHref, secondaryAction }: { icon: React.ReactNode; title: string; body: string; action: string; href: string; internal?: boolean; secondaryHref?: string; secondaryAction?: string }) {
  const actionClass = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 underline decoration-civic-200 underline-offset-4";
  return <section className="grid gap-4 py-6 md:grid-cols-[48px_minmax(0,1fr)_auto] md:items-center"><span className="grid size-11 place-items-center rounded-full bg-civic-50 text-civic-700">{icon}</span><div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{body}</p></div><div className="flex flex-wrap gap-x-4">{internal ? <Link href={href} className={actionClass}>{action}<ArrowRight className="size-4" /></Link> : <a href={href} target="_blank" rel="noreferrer" className={actionClass}>{action}<ExternalLink className="size-4" /></a>}{secondaryHref && secondaryAction ? <a href={secondaryHref} target="_blank" rel="noreferrer" className={actionClass}>{secondaryAction}<ExternalLink className="size-4" /></a> : null}</div></section>;
}
