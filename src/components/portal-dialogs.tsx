"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Map, Maximize2, MessageCircle, Minimize2, Search, Send, X } from "lucide-react";
import { searchGuideIndex } from "@/features/guide";
import { GuideDrawer, INDEX } from "./guide-drawer";
import { OnboardingTour } from "./onboarding-tour";
import { ResponsiveIllustration } from "./responsive-illustration";
import { usePortal } from "./portal-provider";

function useDialog(open: boolean, close: () => void) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!dialog.current) return;
    if (open && !dialog.current.open) { returnFocus.current = document.activeElement as HTMLElement; dialog.current.showModal(); }
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  const closeWithFocus = () => { close(); requestAnimationFrame(() => returnFocus.current?.focus()); };
  return { dialog, closeWithFocus };
}

function SearchDialog() {
  const { searchOpen, closeSearch, language, currentWorkspace, navigate, openOnboarding } = usePortal();
  const { dialog, closeWithFocus } = useDialog(searchOpen, closeSearch);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(true);
  const results = searchGuideIndex(INDEX, query, language, 6, currentWorkspace) as any[];
  const prompts = language === "hi" ? ["पैसा गया", "साक्ष्य तैयार करें", "शिकायत ट्रैक करें"] : ["I lost money", "Prepare evidence", "Track a complaint"];
  useEffect(() => { if (searchOpen) requestAnimationFrame(() => input.current?.focus()); }, [searchOpen]);
  const go = (route: string) => { closeWithFocus(); navigate(route); };
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} aria-labelledby="assistant-title" aria-describedby="assistant-boundary" className={`assistant-dialog ${expanded ? "assistant-dialog-expanded" : ""}`}>
    <header className="assistant-dialog-header">
      <div className="assistant-dialog-avatar" aria-hidden="true"><ResponsiveIllustration assetId="onboardingGuide" language={language} className="assistant-dialog-avatar-image" priority /></div>
      <div className="min-w-0 flex-1"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "स्थानीय मार्ग सहायक" : "Local route assistant"}</p><h2 id="assistant-title" className="mt-1 text-xl font-semibold">{language === "hi" ? "ThreadZero से पूछें" : "Ask ThreadZero"}</h2><p id="assistant-boundary" className="mt-1 text-xs leading-5 text-muted">{language === "hi" ? "निश्चित स्थानीय उत्तर · कोई AI या नेटवर्क कॉल नहीं" : "Deterministic local answers · no AI or network call"}</p></div>
      <button type="button" className="assistant-header-action" onClick={() => openOnboarding("core")}><Map className="size-4" /><span>{language === "hi" ? "दौरा" : "Tour"}</span></button>
      <button type="button" aria-pressed={expanded} aria-label={expanded ? (language === "hi" ? "सहायक छोटा करें" : "Make assistant smaller") : (language === "hi" ? "सहायक बड़ा करें" : "Make assistant bigger")} className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white text-civic-700 hover:bg-civic-50" onClick={() => setExpanded((value) => !value)}>{expanded ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}</button>
      <button type="button" aria-label={language === "hi" ? "सहायक बंद करें" : "Close assistant"} className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-civic-50" onClick={closeWithFocus}><X className="size-5" /></button>
    </header>
    <div className="assistant-conversation" aria-live="polite" aria-atomic="false">
      <div className="assistant-message assistant-message-guide"><MessageCircle className="mt-0.5 size-4 shrink-0 text-civic-700" /><p>{language === "hi" ? "बताइए आप क्या करना चाहते हैं। मैं इस वेबसाइट में सही पेज और अगला कदम ढूँढूँगा।" : "Tell me what you need to do. I’ll find the right page and next step inside this website."}</p></div>
      {!query ? <div className="assistant-quick-prompts" aria-label={language === "hi" ? "उदाहरण प्रश्न" : "Example questions"}>{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => setQuery(prompt)}>{prompt}</button>)}</div> : <>
        <div className="assistant-message assistant-message-user"><p>{query}</p></div>
        {!results.length ? <div className="assistant-message assistant-message-guide"><MessageCircle className="mt-0.5 size-4 shrink-0 text-civic-700" /><p>{language === "hi" ? "मुझे कोई स्पष्ट स्थानीय मार्ग नहीं मिला। अलग शब्द आजमाएँ या वेबसाइट दौरा खोलें।" : "I couldn’t find a clear local route. Try different words or open the website tour."}</p></div> : <div className="assistant-results"><p className="px-1 text-xs font-semibold text-muted">{language === "hi" ? "ये स्थानीय मार्ग सबसे उपयोगी लगते हैं:" : "These local routes look most useful:"}</p>{results.map((result, index) => <button key={result.id} type="button" className={index === 0 ? "assistant-result assistant-result-best" : "assistant-result"} onClick={() => go(result.route)}><span><span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-civic-700">{index === 0 ? (language === "hi" ? "सर्वोत्तम उत्तर" : "Best answer") : result.workspace}</span><strong className="mt-1 block text-sm">{result[language].title}</strong><span className="mt-1 block text-xs leading-5 text-muted">{result[language].body}</span></span><ArrowRight className="size-4 shrink-0 text-civic-700" /></button>)}</div>}
      </>}
    </div>
    <form className="assistant-composer" onSubmit={(event) => { event.preventDefault(); input.current?.focus(); }}>
      <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
      <label className="sr-only" htmlFor="assistant-query">{language === "hi" ? "अपना प्रश्न लिखें" : "Type your question"}</label>
      <input id="assistant-query" ref={input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "hi" ? "जैसे: पैसा गया, अब क्या करूँ?" : "For example: I lost money—what now?"} autoComplete="off" />
      <button type="submit" aria-label={language === "hi" ? "प्रश्न खोजें" : "Search this question"}><Send className="size-4" /></button>
    </form>
  </dialog>;
}

function ProfileDialog() {
  const { profileOpen, closeProfile, language, profile, selectProfile } = usePortal();
  const { dialog, closeWithFocus } = useDialog(profileOpen, closeProfile);
  const email = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (profileOpen) requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus()); }, [profileOpen, dialog]);
  const choose = (value: "anonymous" | "local") => { selectProfile(value, value === "local" ? "Demo Citizen · DEMO-08421" : ""); closeWithFocus(); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const valid = String(data.get("email") || "").trim().toLowerCase() === "demo.citizen@example.test" && String(data.get("password") || "") === "ThreadZero-Demo-2026!";
    if (!valid) { setError(language === "hi" ? "दिए गए डेमो मान जाँचें।" : "Check the displayed demo values."); email.current?.focus(); return; }
    setError(""); event.currentTarget.reset(); selectProfile("account", "Demo Citizen"); closeWithFocus();
  };
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} className="m-auto max-h-[90dvh] w-[min(560px,calc(100%-2rem))] overflow-y-auto rounded-special border-0 bg-white p-0 text-ink shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-line p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "ब्राउज़र-स्थानीय डेमो" : "Browser-local demo"}</p><h2 className="mt-2 text-2xl font-semibold">{language === "hi" ? "डेमो प्रोफ़ाइल चुनें" : "Choose a demo profile"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "केवल चुनी हुई प्रोफ़ाइल और स्थानीय रिपोर्ट स्थिति सहेजी जाती है। ईमेल या पासवर्ड कभी सहेजे या भेजे नहीं जाते।" : "Only the selected profile and local report state are saved. Entered email and password values are never stored or transmitted."}</p></div><button aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full border border-line" onClick={closeWithFocus}><X className="size-5" /></button></div><div className="p-5">
    <div className="grid gap-3"><button aria-pressed={profile === "anonymous"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "anonymous" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("anonymous")}><strong className="block">{language === "hi" ? "गुमनाम सत्र" : "Anonymous session"}</strong><span className="mt-1 block text-xs text-muted">{language === "hi" ? "कोई सहेजी डेमो पहचान नहीं" : "No saved demo identity"}</span></button><button aria-pressed={profile === "local"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "local" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("local")}><strong className="block">{language === "hi" ? "स्थानीय डेमो प्रोफ़ाइल" : "Local demo profile"}</strong><span className="mt-1 block text-xs text-muted">Demo Citizen · DEMO-08421</span></button></div>
    <form className="mt-6 border-t border-line pt-5" onSubmit={submit} noValidate><h3 className="font-semibold">{language === "hi" ? "डेमो मूल्यांकनकर्ता पहुँच" : "Demo evaluator access"}</h3><p className="mt-2 text-sm text-muted">Email: <code>demo.citizen@example.test</code><br />Password: <code>ThreadZero-Demo-2026!</code></p>{error && <div role="alert" className="mt-4 border-l-4 border-urgent bg-urgent-soft p-3 text-sm text-urgent">{error}</div>}<label className="mt-4 grid gap-2 text-sm font-semibold">Email<input ref={email} name="email" type="email" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><label className="mt-4 grid gap-2 text-sm font-semibold">Password<input name="password" type="password" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "डेमो खोलें" : "Open demo"}</button><button type="button" className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => choose("anonymous")}>{language === "hi" ? "गुमनाम डेमो पर लौटें" : "Return to anonymous demo"}</button></div></form>
  </div></dialog>;
}

export function PortalDialogs() { return <><GuideDrawer /><SearchDialog /><ProfileDialog /><OnboardingTour /></>; }
