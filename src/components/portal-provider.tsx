"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createInitialState } from "@/domains/report";
import type { Language, ReportState, Workspace } from "@/lib/types";
import { ACCESS_KEY, LANGUAGE_KEY, readSavedDemoAccess, writeSavedDemoAccess, type DemoProfile } from "@/lib/storage";
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
  closeGuide: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  profileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
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

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "hi" || storedLanguage === "hinglish") setLanguageState(storedLanguage);
    const saved = readSavedDemoAccess(localStorage);
    if (saved) { setProfile(saved.profile); setProfileLabel(saved.label); setReport(saved.report); }
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
      const editable = event.target instanceof HTMLElement && event.target.matches("input, textarea, select, [contenteditable='true']");
      if (editable) return;
      if ((event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  const value = useMemo<PortalContextValue>(() => ({
    hydrated,
    language,
    setLanguage(next) {
      setLanguageState(next);
      localStorage.setItem(LANGUAGE_KEY, next);
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
    openGuide(preset = "") { setGuidePreset(preset); setGuideOpen(true); },
    closeGuide() { setGuideOpen(false); },
    searchOpen,
    openSearch() { setSearchOpen(true); },
    closeSearch() { setSearchOpen(false); },
    profileOpen,
    openProfile() { setProfileOpen(true); },
    closeProfile() { setProfileOpen(false); }
  }), [currentRoute, currentWorkspace, guideOpen, guidePreset, hydrated, language, profile, profileLabel, profileOpen, report, router, searchOpen]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal must be used inside PortalProvider");
  return context;
}
