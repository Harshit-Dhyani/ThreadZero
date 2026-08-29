"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, ExternalLink, FileCheck2, FileText, Search, SearchCheck, ShieldCheck, TriangleAlert, Users, Waypoints } from "lucide-react";
import { createServiceRecord, validateServiceValues, type ServiceRecord } from "@/domains/report/service-form";
import { inferIdentifierType } from "@/features/guide";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { ADVISORY_ITEMS, TRAINING_ITEMS } from "@/data/learning-resources";
import { presentationFor, routeDefinition, type LocalizedRoute } from "@/lib/routes";
import type { AssetId } from "@/lib/assets";
import type { SourceBackedResource } from "@/lib/types";
import { navigationLabel, navigationParent } from "@/lib/navigation";
import { ResponsiveIllustration } from "./responsive-illustration";
import { MediaLibrary } from "@/features/media-library/media-library";
import { usePortal } from "./portal-provider";
import { WorkspaceNavigator } from "./workspace-navigator";

const ICONS = [FileText, SearchCheck, ShieldCheck, BookOpen, Users, CircleHelp];
const HEROES: Record<string, AssetId> = {
  "learning-corner": "training", guides: "evidence", advisories: "advisories", safety: "safetyV2",
  awareness: "awarenessV2", accessibility: "accessibilityV2", faq: "faq", contact: "help",
  "report-abuse": "reportAbuse", media: "media", training: "training", volunteers: "volunteers",
  "volunteer-terms": "volunteers", "unlawful-content": "volunteers", "volunteer-register": "volunteers", "volunteer-login": "volunteers"
};

export function PublicRoute({ routeId }: { routeId: string }) {
  const { language } = usePortal();
  const route = routeDefinition(routeId, language);
  if (!route) return null;
  const presentation = presentationFor(routeId);
  const hero = HEROES[routeId];
  const parent = navigationParent(routeId);
  return <div className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-10">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-civic-700"><Link href="/">{language === "hi" ? "होम" : "Home"}</Link><span>/</span>{parent && <><Link href={`/${parent.route}`}>{navigationLabel(parent, language)}</Link><span>/</span></>}<span aria-current="page">{route.label}</span>{parent && <Link href={`/${parent.route}`} className="ml-auto inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{language === "hi" ? `${navigationLabel(parent, language)} पर वापस` : `Back to ${navigationLabel(parent, language)}`}</Link>}</nav>
    <WorkspaceNavigator routeId={routeId} />
    <header className={`mt-7 grid gap-7 border-b border-line pb-8 ${hero ? "md:grid-cols-[1fr_360px] md:items-center" : ""}`}>
      <div><h1 className="max-w-[22ch] text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{route.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted">{route.intro}</p></div>
      {hero && <ResponsiveIllustration assetId={hero} language={language} className="mx-auto max-h-48 w-full max-w-[360px] object-contain" priority />}
    </header>
    <section className="mt-8 rounded-panel border border-line bg-white p-5 sm:p-7" data-archetype={presentation.archetype}>
      <RouteComposition route={route} routeId={routeId} archetype={presentation.archetype} />
    </section>
    <SourceStrip route={route} />
  </div>;
}

function RouteComposition({ route, routeId, archetype }: { route: LocalizedRoute; routeId: string; archetype: string }) {
  if (route.fields.length) return <ServiceForm route={route} routeId={routeId} />;
  if (routeId === "faq") return <Faq route={route} />;
  if (routeId === "contact") return <Contact route={route} />;
  if (routeId === "report-abuse") return <Abuse route={route} />;
  if (routeId === "media") return <Media route={route} />;
  if (routeId === "grievance") return <Grievance route={route} />;
  if (archetype === "legal-index") return <Legal route={route} />;
  if (routeId === "advisories") return <ResourceIndex items={ADVISORY_ITEMS} groupByYear />;
  if (routeId === "training") return <ResourceIndex items={TRAINING_ITEMS} />;
  if (["safety", "awareness", "accessibility", "volunteer-terms", "unlawful-content"].includes(routeId)) return <TopicGuide route={route} />;
  return <ItemDirectory route={route} compact={archetype === "task-chooser" || route.id === "learning-corner" || route.id === "volunteers"} />;
}

function ItemDirectory({ route, compact = false }: { route: LocalizedRoute; compact?: boolean }) {
  return <div className={compact ? "divide-y divide-line" : "grid gap-4 md:grid-cols-3"}>{route.items.map((item, index) => {
    const Icon = ICONS[index % ICONS.length];
    const content = <><span className="grid size-11 shrink-0 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-base">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-muted">{item.body}</span></span>{item.route && <ArrowRight className="size-4 shrink-0" />}</>;
    return item.route ? <Link key={`${item.title}-${index}`} href={`/${item.route}`} className={`${compact ? "flex min-h-20 items-center gap-4 py-4" : "flex min-h-44 flex-col items-start gap-4 rounded-panel border border-line p-5"} hover:text-civic-700`}>{content}</Link> : <article key={`${item.title}-${index}`} className={compact ? "flex min-h-20 items-center gap-4 py-4" : "min-h-44 rounded-panel border border-line p-5"}>{compact ? content : <><Icon className="size-6 text-civic-700" /><h2 className="mt-5 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.body}</p></>}</article>;
  })}</div>;
}

function Faq({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  return <div className="grid gap-7 lg:grid-cols-[1fr_320px]"><div className="divide-y divide-line border-y border-line">{route.items.map((item, index) => <details key={item.title} className="group"><summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-civic-600 font-semibold text-white">{index + 1}</span><strong className="flex-1">{item.title}</strong><span className="text-xl">+</span></summary><p className="pb-5 pl-[52px] text-sm leading-6 text-muted">{item.body}</p></details>)}</div><aside className="rounded-panel border border-line p-5"><h2 className="text-lg font-semibold">{language === "hi" ? "त्वरित पहुँच" : "Quick access"}</h2><div className="mt-3 divide-y divide-line">{[[language === "hi" ? "आधिकारिक उपकरण" : "Official tools", "official-tools"], [language === "hi" ? "नोडल और शिकायत संपर्क" : "Nodal and grievance contacts", "grievance"], [language === "hi" ? "नीतियाँ और अस्वीकरण" : "Policies and disclaimers", "policies"], [language === "hi" ? "साइबर स्वयंसेवक" : "Cyber Volunteer information", "volunteers"]].map(([label, route]) => <Link key={route} href={`/${route}`} className="flex min-h-14 items-center justify-between gap-3 py-3 text-sm font-semibold hover:text-civic-700">{label}<ArrowRight className="size-4" /></Link>)}</div><div className="mt-5 rounded-panel bg-urgent-soft p-4"><p className="text-xs font-semibold uppercase text-urgent">{language === "hi" ? "आधिकारिक हेल्पलाइन" : "Official helpline"}</p><p className="mt-2 font-semibold">1930 · {language === "hi" ? "स्वयं कॉल करें" : "Call manually"}</p></div></aside></div>;
}

function Contact({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  return <><ItemDirectory route={route} /><div className="mt-7 grid gap-5 border-t border-line pt-7 lg:grid-cols-[1fr_320px]"><div><h2 className="text-xl font-semibold">{language === "hi" ? "आधिकारिक मदद के रास्ते" : "Official help paths"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "वास्तविक रिपोर्ट के लिए NCRP खोलें। लॉगिन, पंजीकरण या पोर्टल सुझाव के लिए आधिकारिक प्रतिक्रिया पेज उपयोग करें।" : "Open NCRP for a real report. Use the official feedback page for login, registration, or portal suggestions."}</p><div className="mt-5 flex flex-wrap gap-3"><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href={OFFICIAL_DESTINATIONS.officialHome.url} target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक पोर्टल" : "Official portal"}<ExternalLink className="size-4" /></a><a className="inline-flex min-h-11 items-center gap-2 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" href={OFFICIAL_DESTINATIONS.officialFeedback.url} target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक प्रतिक्रिया" : "Official feedback"}<ExternalLink className="size-4" /></a></div></div><aside className="rounded-panel bg-urgent-soft p-5"><p className="text-xs font-semibold uppercase text-urgent">{language === "hi" ? "तत्काल मदद" : "Immediate help"}</p><p className="mt-2 text-2xl font-semibold text-urgent">1930</p><p className="mt-2 text-sm text-muted">{language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी के लिए स्वयं कॉल करें और cybercrime.gov.in उपयोग करें।" : "Call manually for actual financial cyber fraud and use cybercrime.gov.in."}</p></aside></div></>;
}

function Abuse({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  return <><div className="grid gap-5 md:grid-cols-3">{route.items.map((item, index) => <article key={item.title} className="rounded-panel border border-line p-5"><span className="grid size-10 place-items-center rounded-full border border-civic-600 text-lg font-semibold text-civic-700">{index + 1}</span><h2 className="mt-5 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.body}</p></article>)}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-panel bg-civic-50 p-5"><div><h2 className="font-semibold">{language === "hi" ? "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल को हस्तांतरण" : "Hand off to the official reporting portal"}</h2><p className="mt-1 text-sm text-muted">{language === "hi" ? "मूल रिकॉर्ड सुरक्षित रखें और आधिकारिक निर्देशों का पालन करें।" : "Keep original records and follow the current official instructions."}</p></div><a className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक पोर्टल खोलें" : "Open official portal"}<ExternalLink className="size-4" /></a></div></>;
}

function Media({ route: _route }: { route: LocalizedRoute }) { return <MediaLibrary />; }

function Grievance({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  return <div className="grid gap-7 lg:grid-cols-[1fr_320px]"><ItemDirectory route={route} compact /><aside className="rounded-panel border border-line bg-civic-50 p-5"><Waypoints className="size-7 text-civic-700" /><h2 className="mt-4 text-lg font-semibold">{language === "hi" ? "सत्यापित आधिकारिक निर्देशिका" : "Verified official directory"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "अधिकारी, ईमेल, फोन और कार्यालय समय यहाँ नहीं बनाए गए हैं। वर्तमान सूची आधिकारिक पेज पर देखें।" : "Officers, emails, phone numbers, and office hours are not reproduced or invented here. Use the current official page."}</p><a className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white" href={OFFICIAL_DESTINATIONS.officialContacts.url} target="_blank" rel="noreferrer">{language === "hi" ? "आधिकारिक संपर्क खोलें" : "Open official contacts"}<ExternalLink className="size-4" /></a></aside></div>;
}

function Legal({ route }: { route: LocalizedRoute }) { return <div className="divide-y divide-line border-y border-line">{route.items.map((item, index) => <details key={item.title}><summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-3"><span className="grid size-9 place-items-center rounded-panel bg-civic-50 text-civic-700"><FileText className="size-5" /></span><strong className="flex-1">{item.title}</strong><span>+</span></summary><p className="pb-5 pl-[52px] text-sm leading-6 text-muted">{item.body}</p></details>)}</div>; }

function ResourceIndex({ items, groupByYear = false }: { items: readonly SourceBackedResource[]; groupByYear?: boolean }) {
  const { language } = usePortal();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => ["all", ...new Set(items.map((item) => item.category))], [items]);
  const visible = useMemo(() => items.filter((item) => {
    const text = `${item.title[language]} ${item.summary[language]}`.toLocaleLowerCase();
    return (category === "all" || item.category === category) && text.includes(query.trim().toLocaleLowerCase());
  }), [category, items, language, query]);
  const groups: Array<[string, SourceBackedResource[]]> = groupByYear ? Object.entries(visible.reduce<Record<string, SourceBackedResource[]>>((result, item) => { const year = item.publishedOn?.slice(0, 4) || (language === "hi" ? "तारीख उपलब्ध नहीं" : "Undated"); (result[year] ??= []).push(item); return result; }, {})).sort(([a], [b]) => b.localeCompare(a)) : [["", [...visible]]];
  const categoryLabel = (value: string) => value === "all" ? (language === "hi" ? "सभी" : "All") : value.replaceAll("-", " ");
  return <><div className="grid gap-4 lg:grid-cols-[minmax(240px,1fr)_2fr]"><label className="grid gap-2 text-sm font-semibold"><span>{language === "hi" ? "संसाधन खोजें" : "Search resources"}</span><span className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-5 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 w-full rounded-control border border-line pl-10 pr-3 font-normal" type="search" /></span></label><div><span className="text-sm font-semibold">{language === "hi" ? "श्रेणी" : "Category"}</span><div className="mt-2 flex gap-2 overflow-x-auto" aria-label={language === "hi" ? "श्रेणी फ़िल्टर" : "Category filters"}>{categories.map((value) => <button key={value} type="button" aria-pressed={category === value} className={`min-h-11 shrink-0 rounded-control border px-4 text-sm font-semibold capitalize ${category === value ? "border-civic-600 bg-civic-50 text-civic-700" : "border-line"}`} onClick={() => setCategory(value)}>{categoryLabel(value)}</button>)}</div></div></div><p className="mt-5 text-sm text-muted" aria-live="polite">{language === "hi" ? `${visible.length} संसाधन` : `${visible.length} resources`}</p>{groups.map(([heading, entries]) => <section key={heading || "all"} className="mt-6">{heading && <h2 className="text-2xl font-semibold">{heading}</h2>}<div className="mt-3 grid gap-4 md:grid-cols-2">{entries.map((item) => <article key={item.id} className="flex flex-col rounded-panel border border-line p-5"><p className="text-xs font-semibold uppercase tracking-wide text-civic-700">{categoryLabel(item.category)}{item.publishedOn ? ` · ${item.publishedOn}` : ""}</p><h3 className="mt-3 text-lg font-semibold">{item.title[language]}</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.summary[language]}</p><p className="mt-4 text-xs text-muted">{language === "hi" ? "स्रोत सत्यापित" : "Source verified"}: {item.verifiedOn}</p><a href={item.destination} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 self-start font-semibold text-civic-700 underline underline-offset-4">{language === "hi" ? "आधिकारिक स्रोत खोलें" : "Open official source"}<ExternalLink className="size-4" /></a></article>)}</div></section>)}{visible.length === 0 && <p className="mt-8 rounded-panel bg-civic-50 p-5 text-sm text-muted">{language === "hi" ? "कोई मेल खाता संसाधन नहीं मिला।" : "No matching resources found."}</p>}<p className="mt-7 text-sm leading-6 text-muted">{language === "hi" ? "स्थानीय सरल शैक्षिक सारांश। आधिकारिक सलाह या कानूनी निर्णय नहीं।" : "Local simplified educational summaries. Not an official advisory or legal determination."}</p></>;
}

function TopicGuide({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  return <><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{route.items.map((item, index) => { const Icon = ICONS[index % ICONS.length]; const content = <><Icon className="size-6 text-civic-700" /><h2 className="mt-4 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.body}</p></>; return item.route ? <Link key={item.title} href={`/${item.route}`} className="rounded-panel border border-line p-5 hover:border-civic-600">{content}</Link> : <article key={item.title} className="rounded-panel border border-line p-5">{content}</article>; })}</div><p className="mt-6 text-sm leading-6 text-muted">{language === "hi" ? "यह सरल शैक्षिक मार्गदर्शन है। वर्तमान आधिकारिक स्रोत सत्यापित करें।" : "This is simplified educational guidance. Verify the current official source."}</p></>;
}

function ServiceForm({ route, routeId }: { route: LocalizedRoute; routeId: string }) {
  const { language } = usePortal();
  const [record, setRecord] = useState<ServiceRecord>(() => createServiceRecord());
  const errorRef = useRef<HTMLDivElement>(null);
  const update = (name: string, value: string) => setRecord((previous) => ({ ...previous, values: { ...previous.values, [name]: value }, errors: [] }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateServiceValues(route.fields, record.values, { required: language === "hi" ? "यह फ़ील्ड आवश्यक है।" : "This field is required.", short: language === "hi" ? "अधिक विवरण जोड़ें।" : "Add more detail.", invalid: language === "hi" ? "दिए गए डेमो उदाहरण का उपयोग करें।" : "Use the documented demo example." });
    setRecord({ values: validation.normalized, errors: validation.errors, submitted: validation.errors.length === 0 });
    if (validation.errors.length) requestAnimationFrame(() => errorRef.current?.focus());
  };
  const inference = routeId === "check-identifier" ? inferIdentifierType(record.values.identifier || "") : "";
  if (record.submitted) return <div className="max-w-form"><div className="rounded-panel border border-success bg-success-soft p-5"><CheckCircle2 className="size-7 text-success" /><h2 className="mt-4 text-xl font-semibold">{route.result || (language === "hi" ? "स्थानीय तैयारी पूरी" : "Local preparation complete")}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "कुछ भी भेजा या अपलोड नहीं किया गया। आधिकारिक कार्रवाई के लिए सत्यापित गंतव्य उपयोग करें।" : "Nothing was sent or uploaded. Use the verified official destination for any real action."}</p></div><button className="mt-5 min-h-11 rounded-control border border-civic-600 px-5 text-sm font-semibold text-civic-700" onClick={() => setRecord(createServiceRecord())}>{language === "hi" ? "विवरण बदलें" : "Edit details"}</button></div>;
  return <form className="max-w-form" onSubmit={submit} noValidate>{record.errors.length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-5 border-l-4 border-urgent bg-urgent-soft p-4"><h2 className="font-semibold text-urgent">{language === "hi" ? "चिह्नित फ़ील्ड जाँचें" : "Check the marked fields"}</h2><ul className="mt-2 list-disc pl-5 text-sm text-urgent">{record.errors.map((error: any) => <li key={error.name}>{error.message}</li>)}</ul></div>}<div className="grid gap-5 sm:grid-cols-2">{route.fields.map((field) => {
    const label = routeId === "report-suspect" && field.name === "identifier" ? (language === "hi" ? "पहचानकर्ता या खाता" : "Identifier or account") : field.label;
    const error = record.errors.find((item) => item.name === field.name);
    return <label key={field.name} className={`grid gap-2 text-sm font-semibold ${field.type === "textarea" ? "sm:col-span-2" : ""}`}><span>{label}{field.required && <span className="ml-1 text-urgent">*</span>}</span>{field.type === "select" ? <select value={record.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-11 rounded-control border border-line bg-white px-3 font-normal"><option value="">—</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea value={record.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-32 rounded-control border border-line p-3 font-normal" /> : <input type={field.type} value={record.values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} aria-invalid={Boolean(error)} className="min-h-11 rounded-control border border-line px-3 font-normal" />}{field.example && <span className="font-normal text-muted">{language === "hi" ? "डेमो उदाहरण" : "Demo example"}: <code>{field.example}</code></span>}{field.name === "identifier" && routeId === "check-identifier" && record.values.identifier && <span className="font-normal text-civic-700">{language === "hi" ? "पहचाना गया प्रकार" : "Detected type"}: {inference}</span>}{error && <span className="font-normal text-urgent">{error.message}</span>}</label>;
  })}</div><div className="mt-6 border-t border-line pt-4 text-sm leading-6 text-muted">{language === "hi" ? "केवल काल्पनिक डेमो जानकारी उपयोग करें। वास्तविक कार्रवाई आधिकारिक सेवा पर पूरी करें।" : "Use fictional demo information only. Complete any real action on the official service."}</div><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "स्थानीय रूप से तैयार करें" : "Prepare locally"}</button><button type="button" className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => setRecord(createServiceRecord())}>{language === "hi" ? "रीसेट" : "Reset"}</button></div></form>;
}

function SourceStrip({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  if (!route.sources.length) return null;
  return <details className="mt-6 border-y border-line"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-sm font-semibold"><ExternalLink className="size-4" />{language === "hi" ? "स्रोत · आधिकारिक संदर्भ" : "Source · Official references"}<span className="ml-auto">+</span></summary><div className="grid gap-2 pb-4 sm:grid-cols-2">{route.sources.map((key) => { const source = (OFFICIAL_DESTINATIONS as Record<string, any>)[key]; return source ? <a key={key} href={source.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-line px-4 text-sm font-semibold text-civic-700 hover:bg-civic-50">{source[language]}<ExternalLink className="size-4" /></a> : null; })}</div></details>;
}
