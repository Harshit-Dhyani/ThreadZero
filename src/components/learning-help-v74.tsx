"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FileCheck2, FileText, Phone, SearchCheck, TriangleAlert, Users, Waypoints } from "lucide-react";
import { ADVISORY_ITEMS } from "@/data/learning-resources";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import { routeDefinition, type LocalizedRoute } from "@/lib/routes";
import type { Language } from "@/lib/types";
import { ResponsiveIllustration } from "./responsive-illustration";
import { SourceStrip } from "./source-strip";
import { usePortal } from "./portal-provider";
import { WorkspaceRail } from "./workspace-rail";

const text = (language: Language, en: string, hi: string) => language === "hi" ? hi : en;

function Breadcrumb({ label, language }: { label: string; language: Language }) {
  return <nav aria-label="Breadcrumb" className="text-xs text-civic-700"><Link className="inline-flex min-h-11 items-center" href="/">{text(language, "Home", "होम")}</Link><span className="mx-2">/</span><span aria-current="page">{label}</span></nav>;
}

function LandingHero({ route, language, assetId }: { route: LocalizedRoute; language: Language; assetId: "training" | "help" }) {
  return <header className="grid overflow-hidden rounded-special border border-line bg-white lg:grid-cols-[minmax(0,1fr)_420px] lg:items-stretch">
    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
      <h1 className="max-w-[18ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[46px]">{route.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{route.intro}</p>
    </div>
    <div className="flex min-h-64 items-end justify-center bg-gradient-to-br from-civic-50 via-white to-civic-50 p-5 sm:p-7">
      <ResponsiveIllustration assetId={assetId} language={language} className="max-h-80 w-full max-w-[460px] object-contain object-bottom" priority />
    </div>
  </header>;
}

function LandingFrame({ route, children }: { route: LocalizedRoute; children: React.ReactNode }) {
  const { language } = usePortal();
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <Breadcrumb label={route.label} language={language} />
    <div className="mt-6 grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
      <WorkspaceRail routeId={route.id} />
      <div className="min-w-0">{children}</div>
    </div>
  </div>;
}

export function LearningV74() {
  const { language } = usePortal();
  const route = routeDefinition("learning-corner", language);
  if (!route) return null;

  const tasks = [
    { route: "safety", icon: TriangleAlert, title: text(language, "A scam may be happening now", "अभी कोई घोटाला हो सकता है"), body: text(language, "Pause, stop the payment, verify through a trusted channel, and use urgent official help when money is at risk.", "रुकें, भुगतान रोकें, विश्वसनीय माध्यम से पुष्टि करें और पैसे का जोखिम हो तो तत्काल आधिकारिक मदद लें।") },
    { route: "advisories", icon: SearchCheck, title: text(language, "I want to recognise a scam", "मैं घोटाले पहचानना चाहता/चाहती हूँ"), body: text(language, "Learn the warning signs and compare what you are seeing with current scam patterns.", "चेतावनी संकेत सीखें और जो आप देख रहे हैं उसकी तुलना मौजूदा घोटाले के पैटर्न से करें।") },
    { route: "guides", icon: FileCheck2, title: text(language, "I need to prepare evidence", "मुझे साक्ष्य तैयार करने हैं"), body: text(language, "Organise messages, payment references, URLs, and timestamps into a useful record.", "संदेश, भुगतान संदर्भ, URL और समय को उपयोगी रिकॉर्ड में व्यवस्थित करें।") },
    { route: "awareness", icon: Users, title: text(language, "I want to help someone else", "मैं किसी और की मदद करना चाहता/चाहती हूँ"), body: text(language, "Explain safer choices without blame and avoid forwarding suspicious links or private evidence.", "दोष दिए बिना सुरक्षित विकल्प समझाएँ और संदिग्ध लिंक या निजी साक्ष्य आगे न भेजें।") }
  ];

  const latest = ADVISORY_ITEMS.slice(0, 3);
  const guided = [
    { route: "safety", icon: BookOpen, title: text(language, "Safety essentials", "सुरक्षा की जरूरी बातें"), body: text(language, "Practical account, payment, device, and impersonation protection.", "खाता, भुगतान, डिवाइस और प्रतिरूपण से बचाव के व्यावहारिक कदम।") },
    { route: "advisories", icon: SearchCheck, title: text(language, "Recognise current patterns", "मौजूदा पैटर्न पहचानें"), body: text(language, "Read source-backed advisories with an immediate action for each pattern.", "स्रोत-समर्थित सलाह पढ़ें और हर पैटर्न के लिए तत्काल कदम देखें।") },
    { route: "training", icon: FileCheck2, title: text(language, "Build confidence step by step", "चरण-दर-चरण आत्मविश्वास बनाएं"), body: text(language, "Follow structured learning paths for citizens and facilitators.", "नागरिकों और सहायकों के लिए संरचित सीखने के मार्ग अपनाएँ।") },
    { route: "awareness", icon: Users, title: text(language, "Share safer guidance", "सुरक्षित मार्गदर्शन साझा करें"), body: text(language, "Use prevention guidance that is simple enough to explain to someone else.", "ऐसा रोकथाम मार्गदर्शन उपयोग करें जिसे किसी और को आसानी से समझाया जा सके।") }
  ];

  const resourceRoutes = new Set(["faq", "daily-digest", "media", "accessibility"]);
  const resources = route.items.filter((item) => item.route && resourceRoutes.has(item.route));

  return <LandingFrame route={route}>
    <LandingHero route={route} language={language} assetId="training" />

    <section data-tour="learn-situations" className="mt-9" aria-labelledby="learning-needs-title">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{text(language, "Choose by situation", "स्थिति के अनुसार चुनें")}</p>
      <h2 id="learning-needs-title" className="mt-2 text-2xl font-semibold">{text(language, "What do you need help learning?", "आप क्या सीखने में मदद चाहते हैं?")}</h2>
      <div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-2">
        {tasks.map((item, index) => { const Icon = item.icon; return <Link key={item.route} href={`/${item.route}`} className={`group grid min-h-32 grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-4 p-5 transition-colors hover:bg-civic-50 ${index < 2 ? "border-b border-line" : ""} ${index % 2 === 0 ? "md:border-r md:border-line" : ""}`}><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span><strong className="block text-base">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>; })}
      </div>
    </section>

    {latest[0] && <section className="mt-10" aria-labelledby="featured-alert-title">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{text(language, "Featured alert", "मुख्य चेतावनी")}</p><h2 id="featured-alert-title" className="mt-2 text-2xl font-semibold">{text(language, "Selected official advisories", "चुनी हुई आधिकारिक सलाह")}</h2></div><Link href="/advisories" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 hover:underline">{text(language, "Browse all advisories", "सभी सलाह देखें")}<ArrowRight className="size-4" /></Link></div>
      <article className="mt-4 grid gap-5 border-y border-line bg-white py-6 md:grid-cols-[150px_minmax(0,1fr)_260px] md:items-center"><p className="text-xs font-semibold uppercase tracking-wide text-civic-700">{latest[0].publishedOn}</p><div><h3 className="max-w-3xl text-xl font-semibold">{localized(latest[0].title, language)}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{localized(latest[0].summary, language)}</p>{latest[0].action && <div className="mt-4 border-l-2 border-civic-600 pl-4"><p className="text-xs font-semibold text-civic-700">{text(language, "What to do now", "अभी क्या करें")}</p><p className="mt-1 text-sm leading-6">{localized(latest[0].action, language)}</p></div>}</div><ResponsiveIllustration assetId="advisories" language={language} className="mx-auto max-h-36 w-full max-w-[260px] object-contain" /></article>
      <div className="divide-y divide-line">{latest.slice(1).map((item) => <article key={item.id} className="grid gap-3 py-5 md:grid-cols-[150px_minmax(0,1fr)]"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.publishedOn}</p><div><h3 className="text-lg font-semibold">{localized(item.title, language)}</h3><p className="mt-1 text-sm leading-6 text-muted">{localized(item.summary, language)}</p></div></article>)}</div>
    </section>}

    <section className="mt-10" aria-labelledby="guided-learning-title">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{text(language, "Guided learning", "मार्गदर्शित सीख")}</p>
      <h2 id="guided-learning-title" className="mt-2 text-2xl font-semibold">{text(language, "Build understanding in the right order", "सही क्रम में समझ विकसित करें")}</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">{guided.map((item) => { const Icon = item.icon; return <Link key={item.route} href={`/${item.route}`} className="group grid min-h-20 grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-4 py-4"><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span><strong className="block">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>; })}</div>
    </section>

    <section data-tour="learn-library" className="mt-10" aria-labelledby="learning-library-title"><h2 id="learning-library-title" className="text-2xl font-semibold">{text(language, "Resource library", "संसाधन पुस्तकालय")}</h2><div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white sm:grid-cols-2">{resources.map((item, index) => <Link key={`${item.route}-${item.title}`} href={`/${item.route}`} className={`group flex min-h-20 items-center gap-4 p-4 hover:bg-civic-50 ${index < resources.length - 2 ? "border-b border-line" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-line" : ""}`}><span className="min-w-0 flex-1"><strong className="block">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 shrink-0 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>)}</div></section>

    <SourceStrip route={route} />
  </LandingFrame>;
}

export function HelpV74() {
  const { language } = usePortal();
  const route = routeDefinition("contact", language);
  if (!route) return null;

  const icons = [TriangleAlert, FileText, Waypoints];
  const secondary = [
    { route: "faq", icon: BookOpen, title: text(language, "Frequently asked questions", "सामान्य प्रश्न"), body: text(language, "Quick answers about evidence, timing, reporting, and safe next steps.", "साक्ष्य, समय, रिपोर्टिंग और सुरक्षित अगले कदमों के त्वरित उत्तर।") },
    { route: "track", icon: SearchCheck, title: text(language, "Track local preparation", "स्थानीय तैयारी ट्रैक करें"), body: text(language, "Continue a saved ThreadZero preparation or try the deterministic demo reference.", "सहेजी गई ThreadZero तैयारी जारी रखें या डेमो रेफरेंस आज़माएँ।") },
    { route: "safety", icon: FileCheck2, title: text(language, "Safety guidance", "सुरक्षा मार्गदर्शन"), body: text(language, "Use practical prevention guidance when you are unsure what to do next.", "अगला कदम स्पष्ट न हो तो व्यावहारिक रोकथाम मार्गदर्शन उपयोग करें।") }
  ];

  return <LandingFrame route={route}>
    <LandingHero route={route} language={language} assetId="help" />

    <section data-tour="help-immediate" className="mt-7 overflow-hidden rounded-special border border-[#f1c6c2] bg-[#fff8f6] p-5 sm:p-6" aria-labelledby="immediate-help-title">
      <div className="grid gap-4 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center"><span className="grid size-14 place-items-center rounded-full bg-white text-urgent"><Phone className="size-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-urgent">{text(language, "Money lost?", "पैसा गया?")}</p><h2 id="immediate-help-title" className="mt-1 text-xl font-semibold">{text(language, "Immediate help", "तत्काल मदद")}</h2><p className="mt-1 text-sm leading-6 text-muted">{text(language, "For actual financial cyber fraud, call 1930 manually. ThreadZero does not place the call or submit a report.", "वास्तविक वित्तीय साइबर धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें। ThreadZero कॉल या रिपोर्ट जमा नहीं करता।")}</p></div><div className="text-left sm:text-right"><p className="text-3xl font-semibold text-urgent">1930</p><a href={OFFICIAL_DESTINATIONS.officialHome.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 hover:underline">{text(language, "Open cybercrime.gov.in", "cybercrime.gov.in खोलें")}<ExternalLink className="size-4" /></a></div></div>
    </section>

    <section data-tour="help-paths" className="mt-9" aria-labelledby="help-choice-title"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{text(language, "Choose a path", "रास्ता चुनें")}</p><h2 id="help-choice-title" className="mt-2 text-2xl font-semibold">{text(language, "What kind of help do you need?", "आपको किस तरह की मदद चाहिए?")}</h2><div className="mt-4 grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-3">{route.items.map((item, index) => { const Icon = icons[index % icons.length]; return item.route ? <Link key={`${item.route}-${item.title}`} href={`/${item.route}`} className="group flex min-h-44 flex-col items-start p-5 transition-colors hover:bg-civic-50 md:border-r md:border-line md:last:border-r-0"><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><strong className="mt-5 text-base">{item.title}</strong><span className="mt-2 flex-1 text-sm leading-6 text-muted">{item.body}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-civic-700">{text(language, "Open", "खोलें")}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link> : null; })}</div></section>

    <section className="mt-10" aria-labelledby="secondary-help-title"><h2 id="secondary-help-title" className="text-2xl font-semibold">{text(language, "Common questions and next steps", "सामान्य प्रश्न और अगले कदम")}</h2><div className="mt-4 divide-y divide-line border-y border-line">{secondary.map((item) => { const Icon = item.icon; return <Link key={item.route} href={`/${item.route}`} className="group grid min-h-20 grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-4 py-4"><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span><strong className="block">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span><ArrowRight className="size-4 text-civic-700 transition-transform group-hover:translate-x-1" /></Link>; })}</div></section>

    <section className="mt-10 border-t border-line pt-8" aria-labelledby="official-help-title"><h2 id="official-help-title" className="text-2xl font-semibold">{text(language, "Official help destinations", "आधिकारिक सहायता गंतव्य")}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{text(language, "Use NCRP for a real report. Use the official feedback page for portal login, registration, or service suggestions.", "वास्तविक रिपोर्ट के लिए NCRP उपयोग करें। पोर्टल लॉगिन, पंजीकरण या सेवा सुझाव के लिए आधिकारिक प्रतिक्रिया पेज उपयोग करें।")}</p><div className="mt-5 flex flex-wrap gap-3"><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href={OFFICIAL_DESTINATIONS.officialHome.url} target="_blank" rel="noreferrer">{text(language, "Official portal", "आधिकारिक पोर्टल")}<ExternalLink className="size-4" /></a><a className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" href={OFFICIAL_DESTINATIONS.officialFeedback.url} target="_blank" rel="noreferrer">{text(language, "Official feedback", "आधिकारिक प्रतिक्रिया")}<ExternalLink className="size-4" /></a></div></section>

    <SourceStrip route={route} />
  </LandingFrame>;
}
