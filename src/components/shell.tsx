"use client";

import Link from "next/link";
import { ArrowRight, CircleHelp, Globe2, Menu, Phone, Waypoints } from "lucide-react";
import { useRef } from "react";
import { NAV_GROUPS, navigationGroupFor, navigationLabel } from "@/lib/navigation";
import type { Language } from "@/lib/types";
import { usePortal } from "./portal-provider";
import { ResponsiveIllustration } from "./responsive-illustration";

const pathFor = (route: string) => route === "home" ? "/" : `/${route}`;

export function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, currentRoute, openAssistant } = usePortal();
  const mobile = useRef<HTMLDetailsElement>(null);
  const closeMobile = () => mobile.current?.removeAttribute("open");
  const title = "ThreadZero";

  return <div className="min-h-screen bg-canvas">
    <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-control bg-white px-4 py-3 text-sm font-semibold text-civic-700 shadow-xl focus:translate-y-0">{language === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}</a>
    <header className="text-white" data-no-print>
      <div className="bg-navy-950"><div className="mx-auto flex min-h-[72px] max-w-content items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={title}>
          <span className="grid size-10 shrink-0 place-items-center rounded-panel border border-white/30"><Waypoints className="size-6" strokeWidth={1.8} /></span>
          <span className="min-w-0"><span className="block text-[18px] font-semibold leading-none">{title}</span><span className="mt-1 hidden text-[11px] text-white/65 sm:block">{language === "hi" ? "स्वतंत्र अवधारणा · सरकारी सेवा नहीं" : "Independent concept · Not a government service"}</span></span>
        </Link>
        <div className="hidden items-center gap-2 nav:flex">
          <button className="inline-flex min-h-11 items-center gap-2 rounded-control border border-white/25 px-4 text-xs font-semibold hover:bg-white/10" onClick={() => openAssistant()}><CircleHelp className="size-4" />{language === "hi" ? "सही विकल्प चुनें" : "Help me choose"}</button>
          <LanguageSelect language={language} onChange={setLanguage} />
        </div>
        <details ref={mobile} className="group relative nav:hidden">
          <summary aria-label={language === "hi" ? "मेनू खोलें" : "Open menu"} className="grid size-11 cursor-pointer list-none place-items-center rounded-control border border-white/30"><Menu className="size-5" /></summary>
          <div className="fixed inset-x-4 top-[74px] z-50 hidden max-h-[calc(100dvh-90px)] overflow-y-auto rounded-panel border border-line bg-white p-3 text-ink shadow-xl group-open:block">
            <nav className="grid gap-1" aria-label={language === "hi" ? "मुख्य सेवाएँ" : "Primary services"}>{NAV_GROUPS.map((entry) => <Link key={entry.route} href={pathFor(entry.route)} aria-current={currentRoute === entry.route ? "page" : undefined} onClick={closeMobile} className={`flex min-h-12 items-center rounded-control px-3 text-sm font-semibold hover:bg-civic-50 ${navigationGroupFor(currentRoute)?.route === entry.route ? "bg-civic-50 text-civic-700" : ""}`}>{navigationLabel(entry, language)}</Link>)}</nav>
            <div className="mt-3 grid gap-2 border-t border-line pt-3"><button className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold" onClick={() => { closeMobile(); openAssistant(); }}>{language === "hi" ? "सही विकल्प चुनें" : "Help me choose"}</button><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="min-h-11 rounded-control border border-line bg-white px-3 text-sm font-semibold"><option value="en">English</option><option value="hi">हिन्दी</option><option value="hinglish">Hinglish</option></select></div>
          </div>
        </details>
      </div></div>

      <div className="hidden min-h-[58px] border-b border-line bg-white text-ink shadow-[0_8px_24px_rgb(6_26_54/0.04)] nav:block"><div className="mx-auto flex h-[58px] max-w-content items-stretch px-5 md:px-8"><nav className="flex min-w-0 flex-1" aria-label={language === "hi" ? "मुख्य सेवाएँ" : "Primary services"}>{NAV_GROUPS.map((entry) => {
        const active = navigationGroupFor(currentRoute)?.route === entry.route;
        return <Link key={entry.route} href={pathFor(entry.route)} aria-current={currentRoute === entry.route ? "page" : undefined} className={`flex min-w-0 flex-1 items-center justify-center border-b-2 px-3 text-center text-[13px] font-semibold transition-colors hover:text-civic-700 ${active ? "border-civic-600 text-civic-700" : "border-transparent text-ink"}`}>{navigationLabel(entry, language)}</Link>;
      })}</nav></div></div>

      <div className="border-b border-[#f1c6c2] bg-[#fff8f6] text-ink"><div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:gap-3 md:px-8"><Phone className="hidden size-4 shrink-0 text-urgent sm:block" /><p className="min-w-0 flex-1 leading-5"><strong className="text-urgent">{language === "hi" ? "पैसा गया? 1930 पर स्वयं कॉल करें।" : "Lost money? Call 1930 manually."}</strong> <span className="ml-1 text-muted">{language === "hi" ? "ThreadZero कॉल या सरकारी रिपोर्ट नहीं करता।" : "ThreadZero does not place calls or government reports."}</span></p><a className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-civic-700 underline decoration-civic-200 underline-offset-4 sm:self-auto" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{language === "hi" ? "cybercrime.gov.in खोलें" : "Open cybercrime.gov.in"}<ArrowRight className="size-3.5" /></a></div></div>
    </header>
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}

function LanguageSelect({ language, onChange }: { language: Language; onChange: (value: Language) => void }) {
  return <label className="relative"><span className="sr-only">Language</span><Globe2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" /><select value={language} onChange={(event) => onChange(event.target.value as Language)} className="min-h-11 appearance-none rounded-control border border-white/25 bg-transparent py-2 pl-9 pr-8 text-xs font-semibold text-white"><option className="text-ink" value="en">English</option><option className="text-ink" value="hi">हिन्दी</option><option className="text-ink" value="hinglish">Hinglish</option></select></label>;
}

function Footer() {
  const { language, openAssistant, openProfile } = usePortal();
  return <footer className="border-t border-line bg-white text-ink" data-no-print><div className="mx-auto grid max-w-content gap-8 px-5 py-10 md:grid-cols-[1.1fr_1fr] md:px-8"><div><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-panel bg-navy-950 text-white"><Waypoints className="size-5" /></span><div><strong className="block">ThreadZero</strong><span className="text-xs text-muted">{language === "hi" ? "स्वतंत्र हैकाथॉन अवधारणा" : "Independent hackathon concept"}</span></div></div><p className="mt-4 max-w-xl text-sm leading-6 text-muted">{language === "hi" ? "यह सरकारी सेवा नहीं है। वास्तविक साइबर अपराध के लिए आधिकारिक पोर्टल और 1930 मार्गदर्शन का उपयोग करें।" : "This is not a government service. For real cybercrime, use the official portal and 1930 guidance where applicable."}</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"><button className="min-h-11 font-semibold text-civic-700 underline underline-offset-4" onClick={() => openAssistant()}>{language === "hi" ? "सही विकल्प चुनें" : "Help me choose"}</button><Link className="inline-flex min-h-11 items-center font-semibold text-civic-700 underline underline-offset-4" href="/contact">{language === "hi" ? "सहायता" : "Help"}</Link><button className="min-h-11 text-xs text-muted underline underline-offset-4" onClick={openProfile}>{language === "hi" ? "मूल्यांकनकर्ता डेमो" : "Evaluator demo"}</button></div></div><div className="grid grid-cols-[1fr_150px] items-center gap-5 border-l-0 md:border-l md:border-line md:pl-8"><div className="text-sm"><p className="font-semibold">{language === "hi" ? "मुख्य रास्ते" : "Core paths"}</p><div className="mt-3 grid gap-2"><Link href="/incident" className="min-h-11 text-civic-700">{language === "hi" ? "रिपोर्ट तैयार करें" : "Prepare report"}</Link><Link href="/official-tools" className="min-h-11 text-civic-700">{language === "hi" ? "कुछ जाँचें" : "Check something"}</Link><Link href="/track" className="min-h-11 text-civic-700">{language === "hi" ? "प्रगति जारी रखें" : "Continue progress"}</Link></div></div><ResponsiveIllustration assetId="footerHelp" language={language} className="h-28 w-full object-contain" /></div></div></footer>;
}
