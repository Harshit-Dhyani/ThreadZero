"use client";

import { CREATOR_PROFILE } from "@/config/creator";
import type { Language } from "@/lib/types";

function SocialIcon({ platform }: { platform: (typeof CREATOR_PROFILE.socials)[number]["platform"] }) {
  if (platform === "x") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] fill-current"><path d="M18.244 2H21l-6.56 7.497L22 22h-5.956l-4.663-6.102L6.04 22H3.28l7.016-8.013L2 2h6.107l4.215 5.523L18.244 2Zm-1.044 18h1.527L7.276 3.896H5.638L17.2 20Z" /></svg>;
  if (platform === "github") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[19px] fill-current"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.223.682-.494 0-.244-.009-.89-.014-1.746-2.782.62-3.369-1.375-3.369-1.375-.455-1.185-1.11-1.5-1.11-1.5-.908-.637.069-.624.069-.624 1.003.072 1.53 1.056 1.53 1.056.892 1.565 2.341 1.113 2.91.851.091-.662.349-1.113.635-1.369-2.221-.259-4.555-1.14-4.555-5.067 0-1.119.39-2.034 1.029-2.751-.103-.26-.446-1.303.098-2.714 0 0 .84-.276 2.75 1.051A9.35 9.35 0 0 1 12 6.985a9.36 9.36 0 0 1 2.504.346c1.909-1.327 2.747-1.051 2.747-1.051.546 1.411.203 2.454.1 2.714.64.717 1.028 1.632 1.028 2.751 0 3.937-2.338 4.805-4.566 5.059.359.317.679.943.679 1.9 0 1.372-.013 2.479-.013 2.815 0 .274.18.594.688.493C19.137 20.623 22 16.781 22 12.253 22 6.59 17.523 2 12 2Z" clipRule="evenodd" /></svg>;
  if (platform === "instagram") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[19px] fill-none stroke-current" strokeWidth="1.9"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.8" r="1" className="fill-current stroke-none" /></svg>;
  if (platform === "youtube") return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M23 12s0-3.17-.4-4.7a3 3 0 0 0-2.1-2.12C18.96 4.75 12 4.75 12 4.75s-6.96 0-8.5.43A3 3 0 0 0 1.4 7.3C1 8.83 1 12 1 12s0 3.17.4 4.7a3 3 0 0 0 2.1 2.12c1.54.43 8.5.43 8.5.43s6.96 0 8.5-.43a3 3 0 0 0 2.1-2.12C23 15.17 23 12 23 12Zm-13.2 3.2V8.8l5.6 3.2-5.6 3.2Z" /></svg>;
  return null;
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
        title={social.label}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-line bg-white text-civic-700 transition-colors hover:border-civic-600 hover:bg-civic-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-civic-600"
      >
        <SocialIcon platform={social.platform} />
        <span className="sr-only">{social.label}</span>
      </a>)}
    </div>
    {showBoundary && <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">{language === "hi" ? "ये निर्माता/प्रोजेक्ट प्रोफ़ाइल हैं। ये सरकारी, NCRP, पुलिस या साइबर अपराध रिपोर्टिंग चैनल नहीं हैं।" : "These are creator/project profiles. They are not government, NCRP, police, or cybercrime-reporting channels."}</p>}
  </div>;
}
