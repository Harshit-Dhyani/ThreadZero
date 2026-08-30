"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, FileCheck2, FileText, Phone, SearchCheck, TriangleAlert, Users, Waypoints } from "lucide-react";
import { ADVISORY_ITEMS } from "@/data/learning-resources";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import { routeDefinition, type LocalizedRoute } from "@/lib/routes";
import type { Language } from "@/lib/types";
import { ResponsiveIllustration } from "./responsive-illustration";
import { SourceStrip } from "./source-strip";
import { usePortal } from "./portal-provider";
import { WorkspaceNavigator } from "./workspace-navigator";

function SurfaceHeader({ route, language, assetId }: { route: LocalizedRoute; language: Language; assetId: "training" | "help" }) {
  return <>
    <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{language === "hi" ? "होम" : "Home"}</Link><span className="mx-2">/</span><span aria-current="page">{route.label}</span></nav>
    <WorkspaceNavigator routeId={route.id} />
    <header className="mt-7 grid gap-8 border-b border-line pb-9 md:grid-cols-[minmax(0,1fr)_430px] md:items-center lg:grid-cols-[minmax(0,1fr)_480px]">
      <div><h1 className="max-w-[19ch] text-[40px] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[46px]">{route.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted">{route.intro}</p></div>
      <div className="rounded-special bg-civic-50 p-4 sm:p-6"><ResponsiveIllustration assetId={assetId} language={language} className="mx-auto max-h-72 w-full max-w-[480px] object-contain" priority /></div>
    </header>
  </>;
}

export function LearningV73() {
  const { language } = usePortal();
  const route = routeDefinition("learning-corner", language);
  if (!route) return null;
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <SurfaceHeader route={route} language={language} assetId="training" />
    <LearningSituationGrid language={language} />
    <LatestAlerts language={language} />
    <LearningResourceDirectory route={route} language={language} />
    <SourceStrip route={route} />
  </div>;
}

function LearningSituationGrid({ language }: { language: Language }) {
  const items = [
    { route: "safety", icon: TriangleAlert, title: language === "hi" ? "अभी कोई घोटाला हो सकता है" : "A scam may be happening now", body: language === "hi" ? "भुगतान रोकें, विश्वसनीय माध्यम से पुष्टि करें और वास्तविक वित्तीय धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें।" : "Pause the payment, verify through a trusted channel, and call 1930 manually for real financial fraud." },
    { route: "advisories", icon: SearchCheck, title: language === "hi" ? "मैं घोटाले पहचानना चाहता/चाहती हूँ" : "I want to recognise a scam", body: language === "hi" ? "वर्तमान पैटर्न और चेतावनी संकेत पढ़ें, फिर तत्काल कदम देखें।" : "Read current patterns and warning signs, then see the immediate action." },
    { route: "guides", icon: FileCheck2, title: language === "hi" ? "मुझे साक्ष्य तैयार करने हैं" : "I need to prepare evidence", body: language === "hi" ? "संदेश, भुगतान संदर्भ, URL और समय को एक स्पष्ट रिकॉर्ड में व्यवस्थित करें।" : "Organise messages, payment references, URLs, and timestamps into a clear record." },
    { route: "awareness", icon: Users, title: language === "hi" ? "मैं किसी और की मदद करना चाहता/चाहती हूँ" : "I want to help someone else", body: language === "hi" ? "दोष दिए बिना सुरक्षा समझाएँ और संदिग्ध लिंक या निजी साक्ष्य आगे न भेजें।" : "Explain safety without blame and do not forward suspicious links or private evidence." }
  ];
  return <section className="mt-9" aria-labelledby="learning-situation-title"><h2 id="learning-situation-title" className="text-2xl font-semibold">{language === "hi" ? "अपनी स्थिति से शुरू करें" : "Start with your situation"}</h2><div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-2">{items.map((item, index) => { const Icon = item.icon; return <Link key={item.route} href={`/${item.route}`} className={`group grid min-h-32 grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-4 p-5 hover:bg-civic-50 ${index < 2 ? "border-b border-line" : ""} ${index % 2 === 0 ? "md:border-r md:border-line" : ""}`}><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span><strong className="block text-base">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>; })}</div></section>;
}

function LatestAlerts({ language }: { language: Language }) {
  const latest = ADVISORY_ITEMS.slice(0, 3);
  return <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-2xl font-semibold">{language === "hi" ? "नवीनतम व्यावहारिक चेतावनियाँ" : "Latest practical alerts"}</h2><Link href="/advisories" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 hover:underline">{language === "hi" ? "सभी सलाह देखें" : "Browse all advisories"}<ArrowRight className="size-4" /></Link></div><div className="mt-4 divide-y divide-line border-y border-line bg-white">{latest.map((item) => <article key={item.id} className="grid gap-3 py-5 md:grid-cols-[145px_minmax(0,1fr)]"><p className="text-xs font-semibold uppercase tracking-wide text-civic-700">{item.publishedOn}</p><div><h3 className="text-lg font-semibold">{localized(item.title, language)}</h3><p className="mt-2 text-sm leading-6 text-muted">{localized(item.summary, language)}</p>{item.action && <div className="mt-3 border-l-2 border-civic-600 pl-3"><p className="text-xs font-semibold text-civic-700">{language === "hi" ? "अभी क्या करें" : "What to do now"}</p><p className="mt-1 text-sm leading-6">{localized(item.action, language)}</p></div>}</div></article>)}</div></section>;
}

function LearningResourceDirectory({ route, language }: { route: LocalizedRoute; language: Language }) {
  const primary = new Set(["safety", "advisories", "guides", "awareness"]);
  const resources = route.items.filter((item) => item.route && !primary.has(item.route));
  return <section className="mt-10"><h2 className="text-2xl font-semibold">{language === "hi" ? "और संसाधन" : "More resources"}</h2><div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white sm:grid-cols-2">{resources.map((item, index) => <Link key={`${item.route}-${item.title}`} href={`/${item.route}`} className={`group flex min-h-20 items-center gap-4 p-4 hover:bg-civic-50 ${index < resources.length - 2 ? "border-b border-line" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-line" : ""}`}><span className="min-w-0 flex-1"><strong className="block">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 shrink-0 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>)}</div></section>;
}

export function HelpV73() {
  const { language } = usePortal();
  const route = routeDefinition("contact", language);
  if (!route) return null;
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <SurfaceHeader route={route} language={language} assetId="help" />
    <HelpPathGrid route={route} language={language} />
    <section className="mt-9 rounded-special border border-[#f1c6c2] bg-[#fff8f6] p-5 sm:p-6" aria-labelledby="immediate-help-title"><div className="grid gap-5 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center"><span className="grid size-14 place-items-center rounded-full bg-white text-urgent"><Phone className="size-6" /></span><div><h2 id="immediate-help-title" className="text-xl font-semibold">{language === "hi" ? "तत्काल मदद" : "Immediate help"}</h2><p className="mt-1 text-sm leading-6 text-muted">{language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।" : "For actual financial cyber fraud, call 1930 manually and use cybercrime.gov.in."}</p></div><div className="text-left sm:text-right"><p className="text-3xl font-semibold text-urgent">1930</p><a href={OFFICIAL_DESTINATIONS.officialHome.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 hover:underline">{language === "hi" ? "आधिकारिक पोर्टल खोलें" : "Open official portal"}<ExternalLink className="size-4" /></a></div></div></section>
    <section className="mt-9 border-t border-line pt-8" aria-labelledby="official-help-title"><h2 id="official-help-title" className="text-2xl font-semibold">{language === "hi" ? "आधिकारिक मदद के रास्ते" : "Official help paths"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "वास्तविक रिपोर्ट के लिए NCRP खोलें। लॉगिन, पंजीकरण या पोर्टल सुझाव के लिए आधिकारिक प्रतिक्रिया पेज उपयोग करें।" : "Open NCRP for a real report. Use the official feedback page for login, registration, or portal suggestions."}</p><div className="mt-5 flex flex-wrap gap-3"><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href={OFFICIAL_DESTINATIONS.officialHome.url} target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक पोर्टल" : "Official portal"}<ExternalLink className="size-4" /></a><a className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" href={OFFICIAL_DESTINATIONS.officialFeedback.url} target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक प्रतिक्रिया" : "Official feedback"}<ExternalLink className="size-4" /></a></div></section>
    <SourceStrip route={route} />
  </div>;
}

function HelpPathGrid({ route, language }: { route: LocalizedRoute; language: Language }) {
  const icons = [TriangleAlert, FileText, Waypoints];
  return <section className="mt-9" aria-labelledby="help-paths-title"><h2 id="help-paths-title" className="text-2xl font-semibold">{language === "hi" ? "आपको किस तरह की मदद चाहिए?" : "What kind of help do you need?"}</h2><div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-3">{route.items.map((item, index) => { const Icon = icons[index % icons.length]; return item.route ? <Link key={`${item.route}-${item.title}`} href={`/${item.route}`} className="group flex min-h-40 flex-col items-start p-5 hover:bg-civic-50 md:border-r md:border-line md:last:border-r-0"><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><strong className="mt-5 text-base">{item.title}</strong><span className="mt-2 flex-1 text-sm leading-6 text-muted">{item.body}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-civic-700">{language === "hi" ? "खोलें" : "Open"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link> : null; })}</div></section>;
}
