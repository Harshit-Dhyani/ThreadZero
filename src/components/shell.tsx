"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, CircleHelp, Globe2, Menu, Phone, Search, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NAV_GROUPS, navigationGroupFor, navigationLabel, type NavigationItem } from "@/lib/navigation";
import { usePortal } from "./portal-provider";
import { ResponsiveIllustration } from "./responsive-illustration";

const pathFor = (route: string) => route === "home" ? "/" : `/${route}`;
const utility = "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-white/25 px-3 text-xs font-semibold transition-colors hover:bg-white/10";

export function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, currentRoute, currentWorkspace, openGuide, openSearch, openProfile, profile, profileLabel } = usePortal();
  const header = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDetailsElement>(null);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const closeMobile = () => { mobile.current?.removeAttribute("open"); setMobileOpen(null); };
  const title = language === "hi" ? "वित्तीय साइबर धोखाधड़ी रिपोर्टिंग मार्गदर्शिका" : "Financial Cyber Fraud Reporting Guide";

  useEffect(() => {
    const close = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setDesktopOpen(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return <div className="min-h-screen bg-canvas">
    <header ref={header} className="text-white" data-no-print onKeyDown={(event) => { if (event.key === "Escape") setDesktopOpen(null); }}>
      <div className="bg-navy-950"><div className="mx-auto flex min-h-[76px] max-w-shell items-center justify-between gap-4 px-5 py-3 md:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={title}>
          <span className="grid size-11 shrink-0 place-items-center rounded-panel border border-white/35"><ShieldCheck className="size-7" strokeWidth={1.8} /></span>
          <span className="min-w-0"><span className="block max-w-[22rem] text-[16px] font-semibold leading-[1.08] sm:text-[19px]">{title}</span><span className="mt-1 hidden text-[11px] text-white/70 sm:block">{language === "hi" ? "स्वतंत्र अवधारणा · सरकारी सेवा नहीं" : "Independent concept · Not a government service"}</span></span>
        </Link>
        <div className="hidden items-center gap-2 nav:flex">
          <button className={utility} onClick={() => openGuide(currentWorkspace)}><CircleHelp className="size-4" />{language === "hi" ? "मार्गदर्शिका" : "Guide"}</button>
          <button className={utility} onClick={openSearch}><Search className="size-4" />{language === "hi" ? "खोजें / पूछें" : "Search / Ask"}</button>
          <button className={utility} onClick={() => openGuide("lost-money")}><Phone className="size-4" />1930</button>
          <button className={utility} onClick={openProfile}><UserRound className="size-4" />{profile === "anonymous" ? (language === "hi" ? "डेमो प्रोफ़ाइल" : "Demo profile") : profileLabel || (language === "hi" ? "स्थानीय डेमो" : "Local demo")}</button>
          <LanguageSelect language={language} onChange={setLanguage} />
        </div>
        <details ref={mobile} className="relative nav:hidden">
          <summary aria-label={language === "hi" ? "सेवा मेनू खोलें" : "Open services menu"} className="grid size-11 cursor-pointer list-none place-items-center rounded-control border border-white/30"><Menu className="size-5" /></summary>
          <div className="fixed inset-x-4 top-[78px] z-50 max-h-[calc(100dvh-94px)] overflow-y-auto rounded-panel border border-line bg-white p-3 text-ink shadow-xl">
            <nav className="grid gap-1" aria-label={language === "hi" ? "मोबाइल सेवाएँ" : "Mobile services"}>{NAV_GROUPS.map((entry) => {
              const active = navigationGroupFor(currentRoute)?.route === entry.route;
              const expanded = mobileOpen === entry.route;
              return <div key={entry.route} className="rounded-control border border-transparent has-[a[aria-current=page]]:border-line">
                <div className="flex items-stretch">
                  <Link href={pathFor(entry.route)} aria-current={currentRoute === entry.route ? "page" : undefined} onClick={closeMobile} className={`flex min-h-11 flex-1 items-center rounded-control px-3 text-sm font-semibold hover:bg-civic-50 ${active ? "text-civic-700" : ""}`}>{navigationLabel(entry, language)}</Link>
                  {entry.children && <button type="button" aria-expanded={expanded} aria-label={`${expanded ? (language === "hi" ? "बंद करें" : "Close") : (language === "hi" ? "खोलें" : "Open")} ${navigationLabel(entry, language)}`} onClick={() => setMobileOpen(expanded ? null : entry.route)} className="grid min-h-11 min-w-11 place-items-center rounded-control hover:bg-civic-50"><ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>}
                </div>
                {entry.children && expanded && <div className="grid gap-1 border-l-2 border-civic-100 pb-2 pl-3 pr-2">{entry.children.map((child) => <Link key={child.route} href={pathFor(child.route)} aria-current={currentRoute === child.route ? "page" : undefined} onClick={closeMobile} className="flex min-h-11 items-center rounded-control px-3 text-sm text-muted hover:bg-civic-50 hover:text-civic-700">{navigationLabel(child, language)}</Link>)}</div>}
              </div>;
            })}</nav>
            <div className="mt-2 grid gap-2 border-t border-line pt-3 sm:grid-cols-2">
              <button className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold" onClick={() => { closeMobile(); openGuide(currentWorkspace); }}>{language === "hi" ? "मार्गदर्शिका" : "Guide"}</button>
              <button className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold" onClick={() => { closeMobile(); openSearch(); }}>{language === "hi" ? "खोजें / पूछें" : "Search / Ask"}</button>
              <button className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold" onClick={() => { closeMobile(); openProfile(); }}>{language === "hi" ? "डेमो प्रोफ़ाइल" : "Demo profile"}</button>
              <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as "en" | "hi")} className="min-h-11 rounded-control border border-line bg-white px-3 text-sm font-semibold"><option value="en">English</option><option value="hi">हिन्दी</option></select>
            </div>
          </div>
        </details>
      </div></div>

      <div className="hidden min-h-[52px] bg-civic-700 nav:block"><div className="mx-auto flex h-[52px] max-w-shell items-stretch px-6 lg:px-10">
        <nav className="flex min-w-0 flex-1" aria-label={language === "hi" ? "मुख्य सेवाएँ" : "Primary services"}>{NAV_GROUPS.map((entry) => <DesktopNavigationItem key={entry.route} entry={entry} language={language} currentRoute={currentRoute} open={desktopOpen === entry.route} setOpen={setDesktopOpen} />)}</nav>
        <button className="my-1 ml-3 inline-flex min-h-11 items-center gap-2 rounded-control border border-white/70 px-4 text-xs font-semibold hover:bg-white/10" onClick={() => openGuide(currentWorkspace)}>{language === "hi" ? "शुरू करें" : "Get Started"}<ArrowRight className="size-4" /></button>
      </div></div>

      <div className="border-b border-[#f1c6c2] bg-urgent-soft text-ink"><div className="mx-auto flex min-h-10 max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 text-xs md:px-8"><p><strong className="text-urgent">{language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी?" : "Actual financial cyber fraud in India?"}</strong> <span className="ml-1 text-muted">{language === "hi" ? "तत्काल सहायता के लिए 1930 पर स्वयं कॉल करें। यह अवधारणा कॉल नहीं करती।" : "Call 1930 manually for urgent help. This concept does not place a call."}</span></p><a className="inline-flex min-h-11 items-center gap-1 font-semibold text-civic-700 hover:underline" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{language === "hi" ? "cybercrime.gov.in उपयोग करें" : "Use cybercrime.gov.in"}<ArrowRight className="size-3.5" /></a></div></div>
    </header>
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}

function DesktopNavigationItem({ entry, language, currentRoute, open, setOpen }: { entry: NavigationItem; language: "en" | "hi"; currentRoute: string; open: boolean; setOpen: (route: string | null) => void }) {
  const active = navigationGroupFor(currentRoute)?.route === entry.route;
  const [hovered, setHovered] = useState(false);
  const expanded = open || hovered;
  const base = `flex min-w-0 flex-1 items-center justify-center px-2 text-center text-[12px] font-semibold leading-tight hover:bg-white/10 ${active ? "bg-white/14" : ""}`;
  if (!entry.children) return <Link href={pathFor(entry.route)} aria-current={currentRoute === entry.route ? "page" : undefined} className={`${base} border-x border-white/10`}>{navigationLabel(entry, language)}</Link>;
  return <div className={`relative flex min-w-0 flex-1 border-x border-white/10 ${active ? "bg-white/14" : ""}`} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setOpen(entry.route)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(null); }}>
    <Link href={pathFor(entry.route)} aria-current={currentRoute === entry.route ? "page" : undefined} className={base}>{navigationLabel(entry, language)}</Link>
    <button type="button" aria-expanded={expanded} aria-label={`${expanded ? (language === "hi" ? "बंद करें" : "Close") : (language === "hi" ? "खोलें" : "Open")} ${navigationLabel(entry, language)}`} onClick={() => setOpen(open ? null : entry.route)} className="grid min-w-9 place-items-center hover:bg-white/10"><ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
    {expanded && <div className="absolute left-0 top-full z-50 w-64 rounded-b-panel border border-line bg-white p-2 text-ink shadow-xl">{entry.children.map((child) => <Link key={child.route} href={pathFor(child.route)} aria-current={currentRoute === child.route ? "page" : undefined} onClick={() => setOpen(null)} className={`flex min-h-11 items-center rounded-control px-3 text-left text-sm font-medium hover:bg-civic-50 hover:text-civic-700 ${currentRoute === child.route ? "bg-civic-50 text-civic-700" : ""}`}>{navigationLabel(child, language)}</Link>)}</div>}
  </div>;
}

function LanguageSelect({ language, onChange }: { language: "en" | "hi"; onChange: (value: "en" | "hi") => void }) {
  return <label className="relative"><span className="sr-only">Language</span><Globe2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" /><select value={language} onChange={(event) => onChange(event.target.value as "en" | "hi")} className="min-h-11 appearance-none rounded-control border border-white/25 bg-transparent py-2 pl-9 pr-8 text-xs font-semibold text-white"><option className="text-ink" value="en">English</option><option className="text-ink" value="hi">हिन्दी</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2" /></label>;
}

function Footer() {
  const { language } = usePortal();
  const groups = language === "hi" ? [
    ["रिपोर्ट और ट्रैक", [["वित्तीय धोखाधड़ी रिपोर्ट करें", "act-now"], ["शिकायत ट्रैक करें", "track"], ["स्थिति जाँचें", "track"], ["साक्ष्य तैयार करें", "evidence"]]],
    ["मार्गदर्शिकाएँ", [["यह कैसे काम करता है", "guides"], ["साक्ष्य मार्गदर्शिका", "guides"], ["सुरक्षा सुझाव", "safety"], ["शब्दावली", "faq"]]],
    ["सहायता", [["सहायता और समर्थन", "faq"], ["संपर्क और मदद", "contact"], ["सामान्य प्रश्न", "faq"], ["पोर्टल प्रतिक्रिया", "feedback"]]],
    ["परिचय", [["इस मार्गदर्शिका के बारे में", "about"], ["गोपनीयता नीति", "privacy"], ["उपयोग की शर्तें", "policies"], ["सुगम्यता", "accessibility"]]]
  ] : [
    ["Report & Track", [["Report financial fraud", "act-now"], ["Track complaint", "track"], ["Check status", "track"], ["Prepare evidence", "evidence"]]],
    ["Guides", [["How it works", "guides"], ["Evidence guide", "guides"], ["Safety tips", "safety"], ["Glossary", "faq"]]],
    ["Support", [["Help & support", "faq"], ["Contact and help", "contact"], ["FAQs", "faq"], ["Portal feedback", "feedback"]]],
    ["About", [["About this guide", "about"], ["Privacy policy", "privacy"], ["Terms of use", "policies"], ["Accessibility", "accessibility"]]]
  ];
  const brand = language === "hi" ? "वित्तीय साइबर धोखाधड़ी रिपोर्टिंग मार्गदर्शिका" : "Financial Cyber Fraud Reporting Guide";
  return <footer className="mt-16 border-t border-line bg-white">
    <div className="mx-auto grid max-w-shell gap-x-7 gap-y-8 px-5 py-9 md:grid-cols-2 md:px-8 lg:grid-cols-5 lg:px-12 lg:py-10 xl:grid-cols-[1.25fr_repeat(4,0.72fr)_1.7fr]">
      <section><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-panel border border-line text-civic-700"><ShieldCheck className="size-7" strokeWidth={1.8} /></span><div><h2 className="max-w-[15rem] text-[16px] font-semibold leading-tight">{brand}</h2><p className="mt-2 text-xs leading-5 text-muted">{language === "hi" ? "स्वतंत्र अवधारणा पुनर्रचना" : "Independent concept redesign"}<br />{language === "hi" ? "सरकारी सेवा नहीं" : "Not a government service"}</p></div></div></section>
      {groups.map(([group, links]) => <section key={group as string}><h2 className="text-xs font-semibold">{group as string}</h2><ul className="mt-2 text-xs text-muted">{(links as string[][]).map(([label, route]) => <li key={`${route}-${label}`}><Link className="inline-flex min-h-10 items-center hover:text-civic-700 hover:underline" href={pathFor(route)}>{label}</Link></li>)}</ul></section>)}
      <section className="relative min-h-64 overflow-hidden rounded-special border border-line bg-civic-50 p-5 md:col-span-2 md:min-h-56 lg:col-span-2 xl:col-span-1 xl:min-h-72"><div className="relative z-10 max-w-[15rem]"><h2 className="text-base font-semibold">{language === "hi" ? "सही मदद तक पहुँचें" : "Find the right next step"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "तथ्य और साक्ष्य तैयार करें, फिर सही आधिकारिक गंतव्य खोलें।" : "Prepare the facts and evidence, then open the right official destination."}</p><Link href={pathFor("contact")} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 hover:underline">{language === "hi" ? "मदद विकल्प देखें" : "View help options"}<ArrowRight className="size-4" /></Link></div><ResponsiveIllustration assetId="footerHelp" language={language} className="absolute bottom-0 right-0 h-[76%] w-auto max-w-[78%] object-contain object-bottom" /></section>
    </div>
    <div className="bg-navy-950 text-white/70"><div className="mx-auto grid min-h-12 max-w-shell items-center gap-2 px-5 py-3 text-center text-[11px] sm:grid-cols-3 md:px-8 lg:px-12"><span>{language === "hi" ? "स्वतंत्र अवधारणा पुनर्रचना" : "Independent concept redesign"}</span><span>{language === "hi" ? "स्पष्टता, सुरक्षा और आत्मविश्वास के लिए तैयार" : "Prepared for clarity, safety, and confidence"}</span><span>{language === "hi" ? "केवल सिंथेटिक डेटा · कोई सरकारी संबद्धता नहीं" : "Synthetic data only · No government affiliation"}</span></div></div>
  </footer>;
}
