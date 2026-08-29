"use client";

import { ExternalLink } from "lucide-react";
import { CREATOR_PROFILE } from "@/config/creator";
import { OFFICIAL_DESTINATIONS } from "@/data/official-sources";
import { localized } from "@/lib/i18n";
import type { LocalizedRoute } from "@/lib/routes";
import { CreatorSocialLinks } from "./creator-social-links";
import { usePortal } from "./portal-provider";

export function SourceStrip({ route }: { route: LocalizedRoute }) {
  const { language } = usePortal();
  const creator = route.id === "about" ? <section className="mt-8 rounded-panel border border-line bg-white p-5 sm:p-7" aria-labelledby="project-creator-title">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{language === "hi" ? "प्रोजेक्ट निर्माता" : "Project creator"}</p>
    <h2 id="project-creator-title" className="mt-3 text-2xl font-semibold">{language === "hi" ? `${CREATOR_PROFILE.name} · ${CREATOR_PROFILE.brand}` : `Built by ${CREATOR_PROFILE.name} · ${CREATOR_PROFILE.brand}`}</h2>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{language === "hi" ? "ThreadZero एक स्वतंत्र उत्पाद-डिज़ाइन और इंजीनियरिंग कॉन्सेप्ट है। नीचे दिए गए लिंक निर्माता/प्रोजेक्ट की सार्वजनिक प्रोफ़ाइल हैं, सहायता या रिपोर्टिंग चैनल नहीं।" : "ThreadZero is an independent product-design and engineering concept. The links below are public creator/project profiles, not support or reporting channels."}</p>
    <div className="mt-5"><CreatorSocialLinks language={language} /></div>
  </section> : null;

  if (!route.sources.length) return creator;
  return <>{creator}<details className="mt-6 border-y border-line"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-sm font-semibold"><ExternalLink className="size-4" />{language === "hi" ? "स्रोत · आधिकारिक संदर्भ" : "Source · Official references"}<span className="ml-auto">+</span></summary><div className="grid gap-2 pb-4 sm:grid-cols-2">{route.sources.map((key) => { const source = (OFFICIAL_DESTINATIONS as Record<string, any>)[key]; return source ? <a key={key} href={source.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-line px-4 text-sm font-semibold text-civic-700 hover:bg-civic-50">{localized(source, language)}<ExternalLink className="size-4" /></a> : null; })}</div></details></>;
}
