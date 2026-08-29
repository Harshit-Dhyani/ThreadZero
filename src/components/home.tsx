"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, CircleHelp, FileCheck2, FileText, SearchCheck, ShieldCheck, Users } from "lucide-react";
import { WORKFLOW_COPY as COPY } from "@/content/workflow";
import { GUIDE_TASKS } from "@/features/guide";
import { usePortal } from "./portal-provider";

const serviceIcons = [FileCheck2, SearchCheck, FileText, BookOpen, Users, CircleHelp];

export function Home() {
  const { language, navigate, openGuide } = usePortal();
  const onNavigate = (view: "home" | "report" | "track") => navigate(view === "report" ? "act-now" : view);
  const onGuide = openGuide;
  const c = COPY[language].home;
  const events = c.mechanism.visualSteps.map((title, index) => ({ id: index + 1, title, ...c.mechanism.evidenceLinks[index] }));
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{language === "en" ? "Independent concept" : "स्वतंत्र अवधारणा"}</p>
            <h1 className="mt-4 max-w-[13ch] text-[42px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[50px] lg:text-[52px]">{c.hero.title}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-7 text-muted">{c.hero.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex min-h-11 items-center gap-3 rounded-control bg-civic-600 px-6 text-sm font-semibold text-white hover:bg-civic-700" onClick={() => onNavigate("report")}>{c.hero.primary}<ArrowRight className="size-4" /></button>
              <button className="inline-flex min-h-11 items-center gap-3 rounded-control border border-civic-600 px-6 text-sm font-semibold text-civic-700 hover:bg-civic-50" onClick={() => document.getElementById("how-it-works")?.scrollIntoView()}>{c.hero.secondary}<ArrowRight className="size-4" /></button>
            </div>
          </div>

          <div className="rounded-panel border border-line bg-white p-6 sm:p-8">
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
          {c.process.steps.map((step, index) => <button key={step.title} className="group grid min-h-24 grid-cols-[32px_1fr_24px] gap-3 border-b border-line py-4 text-left last:border-b-0 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0" onClick={() => index === 0 ? onNavigate("report") : index === 3 ? window.open("https://cybercrime.gov.in/", "_blank", "noopener,noreferrer") : onGuide(index === 1 ? "report" : "home")}>
            <span className="text-xs font-semibold text-civic-700">0{index + 1}</span><span><strong className="block text-sm font-semibold">{step.title}</strong><span className="mt-1 block text-xs leading-5 text-muted">{step.body}</span></span><ArrowRight className="mt-1 size-4 transition-transform group-hover:translate-x-1" />
          </button>)}
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-12 md:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{c.tasks.eyebrow}</p><h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">{c.tasks.title}</h2></div><p className="max-w-lg text-sm leading-6 text-muted">{c.tasks.intro}</p></div>
        <div className="mt-7 grid overflow-hidden rounded-panel border border-line bg-white sm:grid-cols-2 lg:grid-cols-3">
          {GUIDE_TASKS.map((task, index) => {
            const Icon = serviceIcons[index];
            return <button key={task.id} className="group grid min-h-24 grid-cols-[44px_1fr_20px] items-center gap-3 border-b border-line p-4 text-left sm:min-h-28 sm:border-r sm:[&:nth-child(even)]:border-r-0 lg:[&:nth-child(even)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0" onClick={() => navigate(task.route)}><span className="grid size-11 place-items-center rounded-panel bg-civic-50 text-civic-700"><Icon className="size-5" /></span><span><strong className="block text-sm font-medium">{task.title[language]}</strong><span className="mt-1 block text-xs leading-5 text-muted">{task.body[language]}</span></span><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></button>;
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-content px-5 py-12 md:px-8 lg:py-16">
          <div className="grid gap-5 md:grid-cols-[1fr_0.75fr] md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{c.mechanism.eyebrow}</p><h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">{c.mechanism.title}</h2></div><p className="text-sm leading-6 text-muted">{c.mechanism.intro}</p></div>
          <div className="mt-7 grid overflow-hidden rounded-panel border border-line lg:grid-cols-[1fr_310px]">
            <div className="p-6">
              <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-4 sm:before:absolute sm:before:left-4 sm:before:right-4 sm:before:top-4 sm:before:h-px sm:before:bg-line">
                {events.map((event) => <li key={event.id} className="relative"><span className="grid size-8 place-items-center rounded-full bg-civic-600 text-xs font-semibold text-white">{event.id}</span><h3 className="mt-5 text-sm font-semibold">{event.title}</h3><p className="mt-2 text-xs leading-5 text-muted">{event.evidence}</p><p className={`mt-1 text-xs ${event.status === "missing" ? "text-warning" : "text-civic-700"}`}>{event.status === "missing" ? c.mechanism.readiness[1].label : c.mechanism.readiness[0].label}</p></li>)}
              </ol>
            </div>
            <div className="border-t border-line bg-canvas lg:border-l lg:border-t-0">
              {c.mechanism.readiness.map((item) => <div key={item.label} className={`border-b border-line border-l-[3px] p-4 last:border-b-0 ${item.tone === "success" ? "border-success" : item.tone === "warning" ? "border-warning" : "border-muted"}`}><p className="text-[11px] font-semibold uppercase tracking-[0.12em]">{item.label}</p><p className="mt-2 text-xs leading-5 text-muted">{item.body}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-12 md:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-civic-700">{c.resources.eyebrow}</p><h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">{c.resources.title}</h2></div><button className="hidden min-h-11 items-center gap-2 text-sm font-semibold text-civic-700 sm:flex" onClick={() => onGuide("learn")}>{c.resources.action}<ArrowRight className="size-4" /></button></div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {["learning-video.webp", "learning-infographic.webp", "learning-campaign.webp"].map((image, index) => <article key={image} className="overflow-hidden rounded-panel border border-line bg-white"><div className="relative aspect-[16/8] overflow-hidden bg-navy-900"><Image src={`/assets/images/${image}`} fill loading="eager" sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" alt="" /></div><div className="p-5"><h3 className="text-lg font-semibold">{c.resources.cards[index].title}</h3><p className="mt-2 text-sm leading-6 text-muted">{c.resources.cards[index].body}</p><button className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-civic-700" onClick={() => onGuide("learn")}>{language === "en" ? "Open guidance" : "मार्गदर्शन खोलें"}<ArrowRight className="size-4" /></button></div></article>)}
        </div>
      </section>
    </>
  );
}
