"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { findFirstVisibleTarget, getOnboardingSteps, type OnboardingPlacement } from "@/features/onboarding";
import { localized } from "@/lib/i18n";
import type { LocalizedText } from "@/lib/types";
import { ResponsiveIllustration } from "./responsive-illustration";
import { usePortal } from "./portal-provider";

type TargetBox = { left: number; top: number; width: number; height: number };

const ui = {
  progress: { en: "Step", hi: "चरण" },
  of: { en: "of", hi: "में से" },
  back: { en: "Back", hi: "पीछे" },
  next: { en: "Next", hi: "अगला" },
  finish: { en: "Finish", hi: "पूरा करें" },
  skip: { en: "Skip tour", hi: "दौरा छोड़ें" },
  close: { en: "Close tour", hi: "दौरा बंद करें" },
  unavailable: {
    en: "This part is not visible in the current page state. You can still continue, then open the matching workspace from navigation.",
    hi: "यह हिस्सा वर्तमान पेज स्थिति में दिखाई नहीं दे रहा है। आप फिर भी आगे बढ़ सकते हैं और नेविगेशन से संबंधित कार्यक्षेत्र खोल सकते हैं।"
  }
} satisfies Record<string, LocalizedText>;

function firstVisibleTarget(selectors: readonly string[]) {
  return findFirstVisibleTarget(
    selectors,
    (selector) => document.querySelectorAll<HTMLElement>(selector),
    (node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }
  );
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), Math.max(minimum, maximum));

function panelPosition(box: TargetBox | null, placement: OnboardingPlacement, panel: HTMLElement | null): CSSProperties | undefined {
  if (!box || placement === "center" || typeof window === "undefined" || window.innerWidth <= 700) return undefined;
  const gap = 16;
  const margin = 16;
  const width = Math.min(panel?.offsetWidth || 440, window.innerWidth - margin * 2);
  const height = Math.min(panel?.offsetHeight || 430, window.innerHeight - margin * 2);
  const candidates: Record<Exclude<OnboardingPlacement, "center">, { left: number; top: number }> = {
    right: { left: box.left + box.width + gap, top: box.top },
    left: { left: box.left - width - gap, top: box.top },
    bottom: { left: box.left + box.width / 2 - width / 2, top: box.top + box.height + gap },
    top: { left: box.left + box.width / 2 - width / 2, top: box.top - height - gap }
  };
  const order = [placement, "right", "left", "bottom", "top"].filter((value, index, values): value is Exclude<OnboardingPlacement, "center"> => value !== "center" && values.indexOf(value) === index);
  const fit = order.map((candidate) => candidates[candidate]).find(({ left, top }) => left >= margin && top >= margin && left + width <= window.innerWidth - margin && top + height <= window.innerHeight - margin);
  const position = fit || candidates[placement];
  return {
    left: clamp(position.left, margin, window.innerWidth - width - margin),
    top: clamp(position.top, margin, window.innerHeight - height - margin)
  };
}

function DimmedBackdrop({ box }: { box: TargetBox | null }) {
  if (!box) return <div className="onboarding-dim onboarding-dim-full" aria-hidden="true" />;
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  return <div aria-hidden="true">
    <div className="onboarding-dim" style={{ left: 0, top: 0, width: "100%", height: box.top }} />
    <div className="onboarding-dim" style={{ left: 0, top: box.top, width: box.left, height: box.height }} />
    <div className="onboarding-dim" style={{ left: right, right: 0, top: box.top, height: box.height }} />
    <div className="onboarding-dim" style={{ left: 0, right: 0, top: bottom, bottom: 0 }} />
    <div className="onboarding-spotlight" style={{ left: box.left, top: box.top, width: box.width, height: box.height }} />
  </div>;
}

export function OnboardingTour() {
  const { language, onboardingOpen, onboardingScope, closeOnboarding, report } = usePortal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<TargetBox | null>(null);
  const [targetChecked, setTargetChecked] = useState(false);
  const steps = useMemo(() => getOnboardingSteps(onboardingScope, report.reportKind), [onboardingScope, report.reportKind]);
  const currentIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const current = steps[currentIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (onboardingOpen && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setStepIndex(0);
      dialog.showModal();
      requestAnimationFrame(() => nextRef.current?.focus());
    } else if (!onboardingOpen && dialog.open) {
      dialog.close();
      requestAnimationFrame(() => {
        if (returnFocus.current?.isConnected) returnFocus.current.focus();
        else firstVisibleTarget(["[data-tour='guide-trigger-desktop']", "[data-tour='guide-trigger-mobile']"])?.focus();
      });
    }
  }, [onboardingOpen, onboardingScope]);

  useEffect(() => {
    if (!onboardingOpen || !current) return;
    let frame = 0;
    let target: HTMLElement | null = null;
    let observer: ResizeObserver | null = null;
    let didScroll = false;

    setTargetBox(null);
    setTargetChecked(false);

    const measure = () => {
      frame = 0;
      const nextTarget = firstVisibleTarget(current.targetSelectors);
      if (nextTarget !== target) {
        observer?.disconnect();
        target = nextTarget;
        if (target && typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(schedule);
          observer.observe(target);
        }
      }

      if (!target) {
        setTargetBox(null);
        setTargetChecked(true);
        return;
      }

      const rect = target.getBoundingClientRect();
      if (!didScroll && (rect.top < 92 || rect.bottom > window.innerHeight - 24)) {
        didScroll = true;
        target.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        schedule();
        return;
      }

      const padding = 8;
      const left = clamp(rect.left - padding, 8, window.innerWidth - 16);
      const top = clamp(rect.top - padding, 8, window.innerHeight - 16);
      const width = clamp(rect.width + padding * 2, 0, window.innerWidth - left - 8);
      const height = clamp(rect.height + padding * 2, 0, window.innerHeight - top - 8);
      setTargetBox({ left, top, width, height });
      setTargetChecked(true);
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, [current, onboardingOpen]);

  if (!current) return null;
  const isLast = currentIndex === steps.length - 1;
  const hasMissingTarget = targetChecked && current.targetSelectors.length > 0 && !targetBox;
  const position = panelPosition(targetBox, current.placement, panelRef.current);

  const close = (reason: "skip" | "complete" | "escape") => closeOnboarding(reason);

  return <dialog
    ref={dialogRef}
    className="onboarding-dialog"
    aria-labelledby="onboarding-title"
    aria-describedby="onboarding-description"
    onCancel={(event) => { event.preventDefault(); close("escape"); }}
  >
    <div className="onboarding-stage">
      <DimmedBackdrop box={targetBox} />
      <div
        ref={panelRef}
        className={`onboarding-card ${!targetBox || current.placement === "center" ? "onboarding-card-centered" : ""}`}
        style={position}
      >
        <button type="button" className="onboarding-close" onClick={() => close("skip")} aria-label={localized(ui.close, language)}><X className="size-5" /></button>
        <div className="onboarding-character" aria-hidden="true">
          <ResponsiveIllustration assetId="onboardingGuide" language={language} className="onboarding-character-image" priority />
          <span className="onboarding-character-orbit onboarding-character-orbit-one" /><span className="onboarding-character-orbit onboarding-character-orbit-two" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-civic-700">{localized(ui.progress, language)} {currentIndex + 1} {localized(ui.of, language)} {steps.length}</p>
          <h2 id="onboarding-title" className="mt-2 text-2xl font-semibold leading-tight">{localized(current.title, language)}</h2>
          <p id="onboarding-description" className="mt-3 text-sm leading-6 text-muted">{localized(current.body, language)}</p>
          {hasMissingTarget ? <p className="mt-3 border-l-4 border-warning bg-warning-soft px-3 py-2 text-xs leading-5 text-muted">{localized(ui.unavailable, language)}</p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            {currentIndex > 0 ? <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold" onClick={() => setStepIndex((value) => Math.max(0, value - 1))}><ArrowLeft className="size-4" />{localized(ui.back, language)}</button> : null}
            <button ref={nextRef} type="button" className="inline-flex min-h-11 items-center gap-2 rounded-control bg-civic-600 px-5 text-sm font-semibold text-white hover:bg-civic-700" onClick={() => isLast ? close("complete") : setStepIndex((value) => Math.min(steps.length - 1, value + 1))}>{isLast ? <Check className="size-4" /> : null}{localized(isLast ? ui.finish : ui.next, language)}{!isLast ? <ArrowRight className="size-4" /> : null}</button>
            <button type="button" className="min-h-11 px-2 text-sm font-semibold text-muted underline underline-offset-4 hover:text-civic-700" onClick={() => close("skip")}>{localized(ui.skip, language)}</button>
          </div>
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">{localized(ui.progress, language)} {currentIndex + 1} {localized(ui.of, language)} {steps.length}: {localized(current.title, language)}</div>
      </div>
    </div>
  </dialog>;
}
