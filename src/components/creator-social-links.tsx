"use client";

import { ExternalLink, Github } from "lucide-react";
import { CREATOR_PROFILE } from "@/config/creator";
import type { Language } from "@/lib/types";

function SocialIcon({ platform }: { platform: (typeof CREATOR_PROFILE.socials)[number]["platform"] }) {
  if (platform === "github") return <Github className="size-4" aria-hidden="true" />;
  return <span aria-hidden="true" className="grid size-4 place-items-center text-[13px] font-bold leading-none">X</span>;
}

export function CreatorSocialLinks({ language, compact = false, showBoundary = true }: { language: Language; compact?: boolean; showBoundary?: boolean }) {
  return <div>
    {!compact && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "निर्माता लिंक" : "Creator links"}</p>}
    <div className={`${compact ? "mt-2" : "mt-3"} flex flex-wrap gap-2`}>
      {CREATOR_PROFILE.socials.map((social) => <a
        key={social.platform}
        href={social.url}
        target="_blank"
        rel="me noreferrer"
        aria-label={`${social.label} · ${social.handle}`}
        className={`inline-flex min-h-11 items-center gap-2 rounded-control border border-line bg-white font-semibold text-civic-700 hover:border-civic-600 hover:bg-civic-50 ${compact ? "px-3 text-xs" : "px-4 text-sm"}`}
      >
        <SocialIcon platform={social.platform} />
        <span>{social.label}</span>
        {!compact && <span className="font-normal text-muted">{social.handle}</span>}
        {!compact && <ExternalLink className="size-3.5" aria-hidden="true" />}
      </a>)}
    </div>
    {showBoundary && <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">{language === "hi" ? "ये निर्माता/प्रोजेक्ट प्रोफ़ाइल हैं। ये सरकारी, NCRP, पुलिस या साइबर अपराध रिपोर्टिंग चैनल नहीं हैं।" : "These are creator/project profiles. They are not government, NCRP, police, or cybercrime-reporting channels."}</p>}
  </div>;
}
