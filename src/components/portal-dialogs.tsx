"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { searchGuideIndex } from "@/features/guide";
import { GuideDrawer, INDEX } from "./guide-drawer";
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
  const { searchOpen, closeSearch, language, currentWorkspace, navigate } = usePortal();
  const { dialog, closeWithFocus } = useDialog(searchOpen, closeSearch);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = searchGuideIndex(INDEX, query, language, 10, currentWorkspace) as any[];
  useEffect(() => { if (searchOpen) requestAnimationFrame(() => input.current?.focus()); }, [searchOpen]);
  const go = (route: string) => { closeWithFocus(); navigate(route); };
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} className="m-auto max-h-[90dvh] w-[min(720px,calc(100%-2rem))] overflow-hidden rounded-special border-0 bg-white p-0 text-ink shadow-2xl"><div className="flex items-center gap-3 border-b border-line p-4"><Search className="size-5 text-muted" /><input ref={input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "hi" ? "पेज, कार्य या प्रश्न खोजें" : "Search pages, tasks, or questions"} className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-2 outline-none" /><button aria-label="Close search" className="grid size-11 place-items-center rounded-full hover:bg-civic-50" onClick={closeWithFocus}><X className="size-5" /></button></div><div className="max-h-[70dvh] overflow-y-auto p-4" aria-live="polite">{!query ? <p className="p-4 text-sm text-muted">{language === "hi" ? "“पैसा गया”, “साक्ष्य” या “शिकायत ट्रैक” आजमाएँ।" : "Try “lost money”, “evidence”, or “track complaint”."}</p> : !results.length ? <p className="p-4 text-sm text-muted">{language === "hi" ? "कोई मिलान नहीं मिला।" : "No matching route found."}</p> : <>{results.map((result, index) => <button key={result.id} className={`flex min-h-16 w-full items-center justify-between gap-4 border-b border-line p-4 text-left last:border-b-0 ${index === 0 ? "bg-civic-50" : "hover:bg-canvas"}`} onClick={() => go(result.route)}><span><span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-civic-700">{index === 0 ? (language === "hi" ? "सर्वोत्तम उत्तर" : "Best answer") : result.workspace}</span><strong className="mt-1 block text-sm">{result[language].title}</strong><span className="mt-1 block text-xs leading-5 text-muted">{result[language].body}</span></span><ArrowRight className="size-4 shrink-0" /></button>)}</>}</div></dialog>;
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
    if (!valid) { setError(language === "hi" ? "दिए गए काल्पनिक डेमो मान जाँचें।" : "Check the displayed fictional demo values."); email.current?.focus(); return; }
    setError(""); event.currentTarget.reset(); selectProfile("account", "Demo Citizen"); closeWithFocus();
  };
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} className="m-auto max-h-[90dvh] w-[min(560px,calc(100%-2rem))] overflow-y-auto rounded-special border-0 bg-white p-0 text-ink shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-line p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "ब्राउज़र-स्थानीय डेमो" : "Browser-local demo"}</p><h2 className="mt-2 text-2xl font-semibold">{language === "hi" ? "काल्पनिक डेमो प्रोफ़ाइल चुनें" : "Choose a fictional demo profile"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "केवल चुनी हुई प्रोफ़ाइल और स्थानीय रिपोर्ट स्थिति सहेजी जाती है। ईमेल या पासवर्ड कभी सहेजे या भेजे नहीं जाते।" : "Only the selected profile and local report state are saved. Entered email and password values are never stored or transmitted."}</p></div><button aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full border border-line" onClick={closeWithFocus}><X className="size-5" /></button></div><div className="p-5">
    <div className="grid gap-3"><button aria-pressed={profile === "anonymous"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "anonymous" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("anonymous")}><strong className="block">{language === "hi" ? "गुमनाम सत्र" : "Anonymous session"}</strong><span className="mt-1 block text-xs text-muted">{language === "hi" ? "कोई सहेजी डेमो पहचान नहीं" : "No saved demo identity"}</span></button><button aria-pressed={profile === "local"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "local" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("local")}><strong className="block">{language === "hi" ? "स्थानीय डेमो प्रोफ़ाइल" : "Local demo profile"}</strong><span className="mt-1 block text-xs text-muted">Demo Citizen · DEMO-08421</span></button></div>
    <form className="mt-6 border-t border-line pt-5" onSubmit={submit} noValidate><h3 className="font-semibold">{language === "hi" ? "काल्पनिक मूल्यांकनकर्ता पहुँच" : "Fictional evaluator access"}</h3><p className="mt-2 text-sm text-muted">Email: <code>demo.citizen@example.test</code><br />Password: <code>ThreadZero-Demo-2026!</code></p>{error && <div role="alert" className="mt-4 border-l-4 border-urgent bg-urgent-soft p-3 text-sm text-urgent">{error}</div>}<label className="mt-4 grid gap-2 text-sm font-semibold">Email<input ref={email} name="email" type="email" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><label className="mt-4 grid gap-2 text-sm font-semibold">Password<input name="password" type="password" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "काल्पनिक डेमो खोलें" : "Open fictional demo"}</button><button type="button" className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => choose("anonymous")}>{language === "hi" ? "गुमनाम डेमो पर लौटें" : "Return to anonymous demo"}</button></div></form>
  </div></dialog>;
}

export function PortalDialogs() { return <><GuideDrawer /><SearchDialog /><ProfileDialog /></>; }
