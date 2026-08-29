"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CircleHelp, Phone, X } from "lucide-react";
import { ASSISTANT_ACTIONS, assistantDestination, type AssistantActionId } from "@/features/assistant";
import { localized } from "@/lib/i18n";
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

function responseFor(action: AssistantActionId, language: "en" | "hi" | "hinglish") {
  const hi = language === "hi";
  if (action === "lost-money") return hi
    ? "अगर पैसा अभी-अभी गया है, पहले 1930 पर स्वयं कॉल करें। ThreadZero आपकी घटना, साक्ष्य और समयरेखा व्यवस्थित करने में मदद कर सकता है, लेकिन कॉल या सरकारी रिपोर्ट नहीं करता।"
    : "If money was just lost, call 1930 manually first. ThreadZero can organise the incident, evidence, and timeline, but it cannot place the call or submit a government report.";
  if (action === "check") return hi
    ? "एक ही Check कार्यक्षेत्र में संपर्क/खाता, वेबसाइट/ऐप या मोबाइल कनेक्शन मार्ग चुनें। डेमो मिलान लाइव फ्रॉड डेटाबेस नहीं है।"
    : "Use one Check workspace for a contact/account, website/app, or mobile connection path. Demo matching is not a live fraud database.";
  if (action === "continue") return hi
    ? "मैं आपको इस डिवाइस पर अगले अधूरे रिपोर्ट-तैयारी चरण पर ले जाऊँगा।"
    : "I’ll take you to the next unfinished report-preparation step on this device.";
  if (action === "learn") return hi
    ? "Learn में सुरक्षा, सामान्य स्कैम पैटर्न, साक्ष्य तैयारी और आधिकारिक अलर्ट एक जगह हैं।"
    : "Learn keeps safety, common scam patterns, evidence preparation, and official alerts in one place.";
  return hi
    ? "Help में तात्कालिक सहायता, सामान्य प्रश्न, आधिकारिक शिकायत/एस्केलेशन, गोपनीयता और सुगम्यता जानकारी है।"
    : "Help contains urgent help, FAQs, official escalation, privacy, and accessibility information.";
}

function AssistantDialog() {
  const { assistantOpen, assistantPreset, closeAssistant, language, report, navigate } = usePortal();
  const { dialog, closeWithFocus } = useDialog(assistantOpen, closeAssistant);
  const [selected, setSelected] = useState<AssistantActionId | null>(null);

  useEffect(() => {
    if (!assistantOpen) return;
    if (assistantPreset === "lost-money") setSelected("lost-money");
    else if (assistantPreset === "report") setSelected("continue");
    else setSelected(null);
  }, [assistantOpen, assistantPreset]);

  const go = (action: AssistantActionId) => {
    const route = assistantDestination(action, report);
    closeWithFocus();
    navigate(route);
  };

  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} className="m-auto max-h-[90dvh] w-[min(680px,calc(100%-2rem))] overflow-hidden rounded-special border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-950/65">
    <div className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6"><div className="flex gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-civic-50 text-civic-700"><CircleHelp className="size-5" /></span><div><h2 className="text-2xl font-semibold">{language === "hi" ? "मैं आपको सही जगह चुनने में मदद करूँ?" : "Help me choose"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{language === "hi" ? "यह नियम-आधारित सहायक है, AI चैटबॉट नहीं। यह केवल ThreadZero के सही अगले कदम तक ले जाता है।" : "This is a rule-based helper, not an AI agent. It only guides you to the right next step in ThreadZero."}</p></div></div><button aria-label={language === "hi" ? "बंद करें" : "Close"} className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-civic-50" onClick={closeWithFocus}><X className="size-5" /></button></div>
    <div className="max-h-[70dvh] overflow-y-auto p-5 sm:p-6">
      {!selected ? <div><p className="text-sm font-semibold">{language === "hi" ? "अभी आपको किस चीज़ में मदद चाहिए?" : "What do you need help with right now?"}</p><div className="mt-4 divide-y divide-line border-y border-line">{ASSISTANT_ACTIONS.map((action) => <button key={action.id} className="group flex min-h-20 w-full items-center justify-between gap-4 py-4 text-left" onClick={() => setSelected(action.id)}><span><strong className="block text-sm">{localized(action.title, language)}</strong><span className="mt-1 block text-xs leading-5 text-muted">{localized(action.body, language)}</span></span><ArrowRight className="size-4 shrink-0 text-civic-700 transition-transform group-hover:translate-x-1" /></button>)}</div><p className="mt-5 text-xs leading-5 text-muted">{language === "hi" ? "यह सहायक अपराध तय नहीं करता, धन-वापसी का अनुमान नहीं लगाता और सरकारी सिस्टम नहीं देख सकता।" : "This helper does not decide criminality, predict recovery, or access government systems."}</p></div> : <div>
        <button className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700" onClick={() => setSelected(null)}><ArrowLeft className="size-4" />{language === "hi" ? "विकल्पों पर वापस" : "Back to choices"}</button>
        {selected === "lost-money" && <div className="mt-4 border-y border-[#efaaa3] bg-urgent-soft py-5"><div className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-urgent" /><div><h3 className="font-semibold text-urgent">{language === "hi" ? "पैसा गया? 1930 पर स्वयं कॉल करें।" : "Lost money? Call 1930 manually."}</h3><p className="mt-2 text-sm leading-6 text-muted">{responseFor(selected, language)}</p></div></div></div>}
        {selected !== "lost-money" && <div className="mt-4 border-y border-line py-5"><h3 className="text-lg font-semibold">{localized(ASSISTANT_ACTIONS.find((item) => item.id === selected)?.title, language)}</h3><p className="mt-2 text-sm leading-6 text-muted">{responseFor(selected, language)}</p></div>}
        <button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white" onClick={() => go(selected)}>{selected === "continue" ? (language === "hi" ? "मेरी तैयारी जारी रखें" : "Continue preparation") : language === "hi" ? "यह खोलें" : "Open this"}<ArrowRight className="size-4" /></button>
      </div>}
    </div>
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
  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); closeWithFocus(); }} className="m-auto max-h-[90dvh] w-[min(560px,calc(100%-2rem))] overflow-y-auto rounded-special border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-950/65"><div className="flex items-start justify-between gap-4 border-b border-line p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{language === "hi" ? "मूल्यांकनकर्ता डेमो" : "Evaluator demo"}</p><h2 className="mt-2 text-2xl font-semibold">{language === "hi" ? "डेमो प्रोफ़ाइल चुनें" : "Choose a demo profile"}</h2><p className="mt-2 text-sm leading-6 text-muted">{language === "hi" ? "यह प्राथमिक नागरिक नेविगेशन का हिस्सा नहीं है। चुनी हुई डेमो स्थिति केवल इस ब्राउज़र में रहती है।" : "This is not part of the primary citizen navigation. Selected demo state stays in this browser only."}</p></div><button aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full border border-line" onClick={closeWithFocus}><X className="size-5" /></button></div><div className="p-5">
    <div className="grid gap-3"><button aria-pressed={profile === "anonymous"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "anonymous" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("anonymous")}><strong className="block">{language === "hi" ? "गुमनाम सत्र" : "Anonymous session"}</strong><span className="mt-1 block text-xs text-muted">{language === "hi" ? "कोई सहेजी डेमो पहचान नहीं" : "No saved demo identity"}</span></button><button aria-pressed={profile === "local"} className={`min-h-16 rounded-panel border p-4 text-left ${profile === "local" ? "border-civic-600 bg-civic-50" : "border-line"}`} onClick={() => choose("local")}><strong className="block">{language === "hi" ? "स्थानीय डेमो प्रोफ़ाइल" : "Local demo profile"}</strong><span className="mt-1 block text-xs text-muted">Demo Citizen · DEMO-08421</span></button></div>
    <form className="mt-6 border-t border-line pt-5" onSubmit={submit} noValidate><h3 className="font-semibold">{language === "hi" ? "डेमो मूल्यांकनकर्ता पहुँच" : "Demo evaluator access"}</h3><p className="mt-2 text-sm text-muted">Email: <code>demo.citizen@example.test</code><br />Password: <code>ThreadZero-Demo-2026!</code></p>{error && <div role="alert" className="mt-4 border-l-4 border-urgent bg-urgent-soft p-3 text-sm text-urgent">{error}</div>}<label className="mt-4 grid gap-2 text-sm font-semibold">Email<input ref={email} name="email" type="email" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><label className="mt-4 grid gap-2 text-sm font-semibold">Password<input name="password" type="password" autoComplete="off" className="min-h-11 rounded-control border border-line px-3 font-normal" /></label><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-11 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white">{language === "hi" ? "डेमो खोलें" : "Open demo"}</button><button type="button" className="min-h-11 rounded-control border border-line px-5 text-sm font-semibold" onClick={() => choose("anonymous")}>{language === "hi" ? "गुमनाम डेमो पर लौटें" : "Return to anonymous demo"}</button></div></form>
  </div></dialog>;
}

export function PortalDialogs() { return <><AssistantDialog /><ProfileDialog /></>; }
