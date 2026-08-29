"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Phone, Search, X } from "lucide-react";
import { buildSearchIndex, GUIDE_TASKS, organiseGuide } from "@/features/guide";
import { PORTAL_ROUTES } from "@/lib/routes";
import { usePortal } from "./portal-provider";

const INDEX = buildSearchIndex(PORTAL_ROUTES);
const CHOICES = GUIDE_TASKS.map((task) => task.id);

export function GuideDrawer() {
  const { guideOpen, guidePreset, closeGuide, language, currentWorkspace, navigate, openSearch } = usePortal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const first = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<"guided" | "fast">("guided");
  const [choice, setChoice] = useState("");
  const [narrative, setNarrative] = useState("");
  const result = useMemo(() => choice || narrative.trim() ? organiseGuide({ choice, narrative, language }) : null, [choice, language, narrative]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (guideOpen && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      if (CHOICES.includes(guidePreset as typeof CHOICES[number])) setChoice(guidePreset);
      dialog.showModal();
      requestAnimationFrame(() => first.current?.focus());
    } else if (!guideOpen && dialog.open) dialog.close();
  }, [guideOpen, guidePreset]);

  const close = () => { closeGuide(); requestAnimationFrame(() => returnFocus.current?.focus()); };
  const go = (route: string) => { close(); navigate(route); };

  return <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => guideOpen && closeGuide()} className="m-0 ml-auto h-dvh max-h-none w-full max-w-[720px] overflow-y-auto border-0 bg-white p-0 text-ink shadow-2xl">
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-5 sm:px-7"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "निश्चित मार्गदर्शन" : "Deterministic guidance"}</p><h2 className="mt-2 text-2xl font-semibold">{language === "hi" ? "ThreadZero मार्गदर्शिका" : "ThreadZero Guide"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{language === "hi" ? "एक कार्य चुनें या काल्पनिक घटना बताएँ। कोई AI या नेटवर्क अनुरोध नहीं होता।" : "Choose a task or describe a fictional incident. No AI or network request is used."}</p></div><button ref={first} aria-label={language === "hi" ? "मार्गदर्शिका बंद करें" : "Close Guide"} className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-civic-50" onClick={close}><X className="size-5" /></button></div>
    <div className="p-5 sm:p-7">
      <div className="grid grid-cols-2 border-b border-line" role="tablist"><button role="tab" aria-selected={mode === "guided"} className={`min-h-11 border-b-2 text-sm font-semibold ${mode === "guided" ? "border-civic-600 text-civic-700" : "border-transparent text-muted"}`} onClick={() => setMode("guided")}>{language === "hi" ? "मार्गदर्शित" : "Guided"}</button><button role="tab" aria-selected={mode === "fast"} className={`min-h-11 border-b-2 text-sm font-semibold ${mode === "fast" ? "border-civic-600 text-civic-700" : "border-transparent text-muted"}`} onClick={() => setMode("fast")}>{language === "hi" ? "त्वरित" : "Fast"}</button></div>
      <button className="mt-5 flex min-h-11 w-full items-center gap-3 rounded-control border border-line px-4 text-left text-sm font-semibold text-muted hover:border-civic-600" onClick={() => { close(); openSearch(); }}><Search className="size-5" />{language === "hi" ? "सभी पेज खोजें या प्रश्न पूछें" : "Search every page or ask a question"}</button>
      {mode === "guided" ? <>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{GUIDE_TASKS.map((task) => <button key={task.id} aria-pressed={choice === task.id} className={`flex min-h-16 items-center justify-between gap-4 rounded-panel border p-4 text-left text-sm font-medium ${choice === task.id ? "border-civic-600 bg-civic-50" : "border-line hover:border-civic-600"}`} onClick={() => setChoice(task.id)}><span><span className="block">{task.title[language]}</span><span className="mt-1 block text-xs font-normal leading-5 text-muted">{task.body[language]}</span></span><ArrowRight className="size-4 shrink-0" /></button>)}</div>
        <label className="mt-6 grid gap-2"><span className="text-sm font-semibold">{language === "hi" ? "काल्पनिक घटना का वर्णन (वैकल्पिक)" : "Describe the fictional incident (optional)"}</span><textarea value={narrative} onChange={(event) => setNarrative(event.target.value)} className="min-h-28 rounded-control border border-line p-3" placeholder={language === "hi" ? "उदाहरण: WhatsApp पर निवेश संदेश आया..." : "Example: An investment message arrived on WhatsApp..."} /></label>
        {result && <article className="mt-6 rounded-panel border border-civic-100 bg-civic-50 p-5" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-civic-700">{language === "hi" ? "सुझाया गया अगला कदम" : "Recommended next step"}</p><h3 className="mt-2 text-lg font-semibold">{result.title}</h3>{result.missingFacts?.length > 0 && <p className="mt-2 text-sm text-muted">{language === "hi" ? "बाद में जोड़ें: " : "Add later: "}{result.missingFacts.slice(0, 3).join(", ")}</p>}<button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-4 text-sm font-semibold text-white" onClick={() => go(result.route)}>{language === "hi" ? "सुझाया पेज खोलें" : "Open recommended page"}<ArrowRight className="size-4" /></button></article>}
      </> : <div className="mt-6 divide-y divide-line border-y border-line">{INDEX.slice(0, 14).map((entry: any) => <button key={entry.id} className="flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left" onClick={() => go(entry.route)}><span><strong className="block text-sm">{entry[language].title}</strong><span className="mt-1 block text-xs text-muted">{entry[language].body}</span></span><ArrowRight className="size-4 shrink-0" /></button>)}</div>}
      <div className="mt-7 flex items-center gap-3 border-t border-line pt-5 text-sm text-urgent"><Phone className="size-5" /><strong>1930</strong><span>{language === "hi" ? "वास्तविक वित्तीय धोखाधड़ी के लिए स्वयं कॉल करें।" : "Call manually for actual financial cyber fraud."}</span></div>
    </div>
  </dialog>;
}

export { INDEX };
