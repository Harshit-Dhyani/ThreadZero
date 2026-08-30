"use client";

import { ArrowRight } from "lucide-react";
import { WORKFLOW_COPY as COPY } from "@/content/workflow";
import { usePortal } from "./portal-provider";

export function Home() {
  const { language, navigate, openGuide } = usePortal();
  const c = COPY[language].home;
  const events = c.mechanism.visualSteps.map((title, index) => ({ id: index + 1, title, ...c.mechanism.evidenceLinks[index] }));

  return <section className="bg-white">
    <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
      <div className="min-w-0">
        <h1 className="max-w-[13ch] text-[42px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[50px] lg:text-[52px]">{c.hero.title}</h1>
        <p className="mt-5 max-w-xl text-[17px] leading-7 text-muted">{c.hero.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button className="inline-flex min-h-11 items-center gap-3 rounded-control bg-civic-600 px-6 text-sm font-semibold text-white hover:bg-civic-700" onClick={() => navigate("incident")}>{c.hero.primary}<ArrowRight className="size-4" /></button>
          <button className="inline-flex min-h-11 items-center gap-3 rounded-control border border-civic-600 px-6 text-sm font-semibold text-civic-700 hover:bg-civic-50" onClick={() => document.getElementById("how-it-works")?.scrollIntoView()}>{c.hero.secondary}<ArrowRight className="size-4" /></button>
        </div>
      </div>

      <div className="min-w-0 rounded-panel border border-line bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{c.mechanism.eyebrow}</p>
        <ol className="mt-5 space-y-0">
          {events.map((event, index) => <li key={event.id} className="relative grid grid-cols-[28px_1fr] gap-4 pb-5 last:pb-0">
            {index < events.length - 1 && <span className="absolute left-[13px] top-5 h-full w-px bg-line" aria-hidden="true" />}
            <span className={`relative z-10 mt-0.5 size-7 rounded-full border-[6px] ${event.id === 3 ? "border-[#ffd2ce] bg-urgent" : "border-civic-100 bg-civic-600"}`} aria-hidden="true" />
            <div className={event.id === 3 ? "-my-2 rounded-control border border-[#efaaa3] bg-urgent-soft px-4 py-3" : ""}>
              <h2 className="text-sm font-semibold">{event.title}</h2>
              <p className="mt-1 text-sm text-muted">{event.evidence}</p>
            </div>
          </li>)}
        </ol>
      </div>
    </div>

    <div id="how-it-works" className="mx-auto grid max-w-content border-t border-line px-5 py-5 md:grid-cols-4 md:px-8">
      {c.process.steps.map((step, index) => <button key={step.title} className="group grid min-h-24 grid-cols-[32px_1fr_24px] gap-3 border-b border-line py-4 text-left last:border-b-0 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0" onClick={() => index === 0 ? navigate("incident") : index === 3 ? window.open("https://cybercrime.gov.in/", "_blank", "noopener,noreferrer") : openGuide(index === 1 ? "report" : "home") }>
        <span className="text-xs font-semibold text-civic-700">0{index + 1}</span>
        <span><strong className="block text-sm font-semibold">{step.title}</strong><span className="mt-1 block text-xs leading-5 text-muted">{step.body}</span></span>
        <ArrowRight className="mt-1 size-4 transition-transform group-hover:translate-x-1" />
      </button>)}
    </div>
  </section>;
}
