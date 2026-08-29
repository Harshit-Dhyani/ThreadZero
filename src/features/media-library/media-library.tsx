"use client";

import { useDeferredValue, useState } from "react";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import { MEDIA_ITEMS } from "@/data/media";
import type { MediaKind } from "@/lib/types";
import type { AssetId } from "@/lib/assets";
import { ResponsiveIllustration } from "@/components/responsive-illustration";
import { localized } from "@/lib/i18n";
import { usePortal } from "@/components/portal-provider";

const FILTERS: Array<"all" | MediaKind> = ["all", "video", "campaign", "infographic", "guide"];
const SITUATIONS = ["all", "payments", "pressure", "jobs", "devices"] as const;

export function MediaLibrary() {
  const { language } = usePortal();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [situation, setSituation] = useState<(typeof SITUATIONS)[number]>("all");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const items = MEDIA_ITEMS.filter((item) => (filter === "all" || item.kind === filter) && (situation === "all" || item.tags.includes(situation)) && `${localized(item.title, language)} ${localized(item.summary, language)} ${item.tags.join(" ")}`.toLocaleLowerCase().includes(deferredQuery));
  const featured = items[0];
  const labels = language === "hi" ? ["सभी", "वीडियो", "अभियान", "इन्फोग्राफिक", "मार्गदर्शिका"] : ["All", "Video", "Campaign", "Infographic", "Guide"];
  const situationLabels = language === "hi" ? ["सभी स्थितियाँ", "पैसा और भुगतान", "दबाव और प्रतिरूपण", "नौकरी और संबंध", "डिवाइस और खाते"] : ["All situations", "Money & payments", "Pressure & impersonation", "Jobs & relationships", "Devices & accounts"];

  return <>
    <div>
      <p className="text-sm font-semibold">{language === "hi" ? "स्थिति के अनुसार देखें" : "Browse by situation"}</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label={language === "hi" ? "मीडिया स्थिति फ़िल्टर" : "Media situation filters"}>{SITUATIONS.map((value, index) => <button key={value} type="button" aria-pressed={situation === value} className={`min-h-11 shrink-0 rounded-control border px-4 text-sm font-semibold ${situation === value ? "border-civic-600 bg-civic-50 text-civic-700" : "border-line bg-white text-muted"}`} onClick={() => setSituation(value)}>{situationLabels[index]}</button>)}</div>
    </div>
    <div className="mt-5 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label={language === "hi" ? "मीडिया प्रकार" : "Media type"}>{FILTERS.map((value, index) => <button key={value} role="tab" aria-selected={filter === value} className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-medium ${filter === value ? "border-civic-600 text-civic-700" : "border-transparent text-muted"}`} onClick={() => setFilter(value)}>{labels[index]}</button>)}</div>
      <label className="relative block w-full sm:max-w-sm"><span className="sr-only">{language === "hi" ? "मीडिया खोजें" : "Search media"}</span><Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "hi" ? "मीडिया खोजें" : "Search media"} className="min-h-11 w-full rounded-control border border-line bg-white pl-11 pr-3" /></label>
    </div>

    {featured ? <>
      <article className="mt-6 grid overflow-hidden rounded-panel border border-line bg-civic-50 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="aspect-[16/9] overflow-hidden bg-white"><ResponsiveIllustration assetId={featured.assetId as AssetId} language={language} className="h-full w-full object-cover" priority /></div>
        <div className="p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "विशेष संसाधन" : "Featured resource"}</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{localized(featured.title, language)}</h2><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-civic-700">{language === "hi" ? "आप क्या सीखेंगे" : "What you will learn"}</p><p className="mt-2 text-sm leading-6 text-muted">{localized(featured.summary, language)}</p><a href={featured.destination} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "आधिकारिक संसाधन खोलें" : "Open official resource"}<ExternalLink className="size-4" /></a></div>
      </article>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.slice(1).map((item) => <article key={item.id} className="overflow-hidden rounded-panel border border-line bg-white"><div className="aspect-video overflow-hidden bg-canvas"><ResponsiveIllustration assetId={item.assetId as AssetId} language={language} className="h-full w-full object-cover" /></div><div className="p-5"><p className="text-xs font-medium uppercase tracking-[0.1em] text-civic-700">{item.kind}</p><h2 className="mt-2 text-lg font-medium">{localized(item.title, language)}</h2><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-civic-700">{language === "hi" ? "आप क्या सीखेंगे" : "What you will learn"}</p><p className="mt-2 text-sm leading-6 text-muted">{localized(item.summary, language)}</p><a href={item.destination} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-civic-700">{language === "hi" ? "स्रोत खोलें" : "Open source"}<ArrowRight className="size-4" /></a></div></article>)}</div>
    </> : <p className="mt-6 rounded-panel border border-line bg-canvas p-5 text-sm text-muted">{language === "hi" ? "कोई मीडिया नहीं मिला।" : "No media matched your search."}</p>}
  </>;
}
