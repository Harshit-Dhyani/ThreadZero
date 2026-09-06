"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createInitialState } from "@/domains/report";
import type { OnboardingCloseReason, OnboardingScope } from "@/features/onboarding";
import type { Language, ReportState, Workspace } from "@/lib/types";
import { ACCESS_KEY, LANGUAGE_KEY, readOnboardingStatus, readSavedDemoAccess, readWorkspaceOnboardingStatus, writeOnboardingStatus, writeSavedDemoAccess, writeWorkspaceOnboardingStatus, type DemoProfile } from "@/lib/storage";
import { workspaceFor } from "@/lib/routes";

type PortalContextValue = {
  hydrated: boolean;
  language: Language;
  setLanguage: (language: Language) => void;
  currentRoute: string;
  currentWorkspace: Workspace;
  navigate: (route: string) => void;
  report: ReportState;
  mutateReport: (change: (draft: ReportState) => void) => void;
  resetReport: () => void;
  profile: DemoProfile;
  profileLabel: string;
  selectProfile: (profile: DemoProfile, label?: string) => void;
  guideOpen: boolean;
  guidePreset: string;
  openGuide: (preset?: string) => void;
  openAssistant: (preset?: string) => void;
  closeGuide: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  profileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  onboardingOpen: boolean;
  onboardingScope: OnboardingScope;
  openOnboarding: (scope?: OnboardingScope) => void;
  closeOnboarding: (reason?: OnboardingCloseReason) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);
const clone = <T,>(value: T): T => structuredClone(value);

function routeFromPath(pathname: string) {
  return pathname === "/" ? "home" : decodeURIComponent(pathname.slice(1).split("/")[0] || "home");
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentRoute = routeFromPath(pathname);
  const currentWorkspace = workspaceFor(currentRoute);
  const [language, setLanguageState] = useState<Language>("en");
  const [report, setReport] = useState<ReportState>(() => createInitialState());
  const [profile, setProfile] = useState<DemoProfile>("anonymous");
  const [profileLabel, setProfileLabel] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guidePreset, setGuidePreset] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingScope, setOnboardingScope] = useState<OnboardingScope>("core");
  const [coreOnboardingSettled, setCoreOnboardingSettled] = useState(false);
  const [coreOnboardingSkipped, setCoreOnboardingSkipped] = useState(false);
  const [workspaceToursSeen, setWorkspaceToursSeen] = useState<Workspace[]>([]);

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage === "en" || storedLanguage === "hi" || storedLanguage === "hinglish") setLanguageState(storedLanguage);
      const saved = readSavedDemoAccess(localStorage);
      if (saved) { setProfile(saved.profile); setProfileLabel(saved.label); setReport(saved.report); }
      const coreStatus = readOnboardingStatus(localStorage);
      setCoreOnboardingSettled(Boolean(coreStatus));
      setCoreOnboardingSkipped(coreStatus?.status === "skipped");
      setWorkspaceToursSeen(readWorkspaceOnboardingStatus(localStorage)?.seen ?? []);
      if (!coreStatus) setOnboardingOpen(true);
    } catch {
      setCoreOnboardingSettled(false);
      setOnboardingOpen(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hinglish" ? "hi-Latn" : language;
  }, [language]);

  useEffect(() => {
    if (!hydrated || profile === "anonymous") return;
    writeSavedDemoAccess(localStorage, { version: 2, profile, label: profileLabel, language, report });
  }, [hydrated, language, profile, profileLabel, report]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (onboardingOpen) return;
      const editable = event.target instanceof HTMLElement && event.target.matches("input, textarea, select, [contenteditable='true']");
      if (editable) return;
      if ((event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setGuideOpen(false);
        setProfileOpen(false);
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [onboardingOpen]);

  useEffect(() => {
    if (!hydrated || !coreOnboardingSettled || coreOnboardingSkipped || onboardingOpen || guideOpen || searchOpen || profileOpen || workspaceToursSeen.includes(currentWorkspace)) return;
    const timer = window.setTimeout(() => {
      setOnboardingScope(currentWorkspace);
      setOnboardingOpen(true);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [coreOnboardingSettled, coreOnboardingSkipped, currentWorkspace, guideOpen, hydrated, onboardingOpen, profileOpen, searchOpen, workspaceToursSeen]);

  const value = useMemo<PortalContextValue>(() => ({
    hydrated,
    language,
    setLanguage(next) {
      setLanguageState(next);
      try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Keep the active session usable when storage is unavailable. */ }
    },
    currentRoute,
    currentWorkspace,
    navigate(route) {
      router.push(route === "home" ? "/" : `/${route}`);
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    },
    report,
    mutateReport(change) {
      setReport((previous) => {
        const draft = clone(previous);
        change(draft);
        return draft;
      });
    },
    resetReport() { setReport(createInitialState()); },
    profile,
    profileLabel,
    selectProfile(next, label = "") {
      setProfile(next);
      setProfileLabel(label);
      if (next === "anonymous") localStorage.removeItem(ACCESS_KEY);
      else writeSavedDemoAccess(localStorage, { version: 2, profile: next, label, language, report });
    },
    guideOpen,
    guidePreset,
    openGuide(preset = "") {
      setOnboardingOpen(false); setSearchOpen(false); setProfileOpen(false);
      setGuidePreset(preset); setGuideOpen(true);
    },
    // V7 keeps Guide and Search as separate first-redesign surfaces. Adaptive Report uses
    // this compatibility name internally, but it intentionally opens the existing Guide.
    openAssistant(preset = "") {
      setOnboardingOpen(false); setSearchOpen(false); setProfileOpen(false);
      setGuidePreset(preset); setGuideOpen(true);
    },
    closeGuide() { setGuideOpen(false); },
    searchOpen,
    openSearch() { setGuideOpen(false); setOnboardingOpen(false); setProfileOpen(false); setSearchOpen(true); },
    closeSearch() { setSearchOpen(false); },
    profileOpen,
    openProfile() { setGuideOpen(false); setOnboardingOpen(false); setSearchOpen(false); setProfileOpen(true); },
    closeProfile() { setProfileOpen(false); },
    onboardingOpen,
    onboardingScope,
    openOnboarding(scope = "core") {
      setGuideOpen(false); setSearchOpen(false); setProfileOpen(false);
      setOnboardingScope(scope); setOnboardingOpen(true);
    },
    closeOnboarding(reason) {
      setOnboardingOpen(false);
      if (!reason) return;
      if (onboardingScope === "core") {
        setCoreOnboardingSettled(true);
        setCoreOnboardingSkipped(reason !== "complete");
        writeOnboardingStatus(localStorage, reason === "complete" ? "completed" : "skipped");
        return;
      }
      setWorkspaceToursSeen((seen) => {
        const next = seen.includes(onboardingScope) ? seen : [...seen, onboardingScope];
        writeWorkspaceOnboardingStatus(localStorage, next);
        return next;
      });
    }
  }), [coreOnboardingSettled, currentRoute, currentWorkspace, guideOpen, guidePreset, hydrated, language, onboardingOpen, onboardingScope, profile, profileLabel, profileOpen, report, router, searchOpen, workspaceToursSeen]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal must be used inside PortalProvider");
  return context;
}
