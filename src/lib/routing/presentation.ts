import type { RoutePresentation, Workspace } from "../types.ts";
import { FLOW_ROUTE_IDS } from "../../data/demo.ts";

const route = (workspace: Workspace, mode: string, archetype: string, actionModel: string, heroAsset = "", heroStyle = "standard"): RoutePresentation => ({
  workspace,
  mode,
  archetype,
  actionModel,
  heroTreatment: heroStyle,
  heroAsset,
  heroStyle,
  sourceTreatment: "compact"
});

export const WORKSPACES = Object.freeze({
  home: Object.freeze({ route: "home", en: "Home", hi: "होम" }),
  report: Object.freeze({ route: "complaints", en: "Report", hi: "रिपोर्ट" }),
  check: Object.freeze({ route: "official-tools", en: "Check", hi: "जाँच" }),
  track: Object.freeze({ route: "track", en: "Track", hi: "ट्रैक" }),
  learn: Object.freeze({ route: "learning-corner", en: "Learn", hi: "सीखें" }),
  help: Object.freeze({ route: "contact", en: "Help", hi: "सहायता" })
});

const FLOW_ROUTES = new Set(FLOW_ROUTE_IDS);

const ROUTE_PRESENTATION = Object.freeze({
  complaints: route("report", "paths", "task-chooser", "choose-report-path", "", "compact"),
  "women-children": route("report", "women-children", "complaint-guidance", "choose-official-path", "", "compact"),
  "anonymous-report": route("report", "anonymous", "local-form", "prepare-local-record", "", "compact"),
  "registered-report": route("report", "registered", "local-form", "prepare-local-record", "", "compact"),
  "other-cybercrime": route("report", "other", "local-form", "prepare-local-record", "", "compact"),
  "official-tools": route("check", "tools", "task-chooser", "choose-official-tool", "", "compact"),
  "check-identifier": route("check", "identifier", "local-form", "prepare-identifier", "", "compact"),
  "check-website": route("check", "website", "local-form", "prepare-address", "", "compact"),
  "report-suspect": route("check", "suspect", "local-form", "prepare-suspect-details", "", "compact"),
  "report-abuse": route("check", "abuse", "abuse-guidance", "preserve-and-handoff", "P06-evidence-thread-v1"),
  "mobile-connections": route("check", "mobile", "local-form", "prepare-mobile-details", "", "compact"),
  appeal: route("check", "appeal", "local-form", "prepare-appeal", "", "compact"),
  volunteers: route("learn", "community", "task-chooser", "learn-or-open-official", "", "compact"),
  "volunteer-terms": route("learn", "community-terms", "practical-guidance", "read-official-terms", "", "compact"),
  "unlawful-content": route("learn", "community-content", "practical-guidance", "preserve-and-report", "", "compact"),
  "volunteer-register": route("learn", "community-register", "local-form", "prepare-volunteer-details", "", "compact"),
  "volunteer-login": route("learn", "community-access", "local-form", "prepare-demo-access", "", "compact"),
  "learning-corner": route("learn", "overview", "learning-hub", "browse-learning", "", "standard"),
  guides: route("report", "guides", "evidence-guide", "prepare-evidence", "P06-evidence-thread-v1"),
  advisories: route("learn", "advisories", "advisories", "browse-current-sources", "", "standard"),
  safety: route("learn", "safety", "safety", "browse-practical-actions", "", "standard"),
  awareness: route("learn", "awareness", "awareness", "browse-awareness", "", "standard"),
  "daily-digest": route("learn", "digest", "advisories", "open-current-digest", "", "compact"),
  training: route("learn", "training", "training", "browse-modules", "", "standard"),
  media: route("learn", "media", "media-library", "browse-media", "", "compact"),
  accessibility: route("learn", "accessibility", "accessibility", "review-access-needs", "", "standard"),
  faq: route("help", "faq", "faq-help", "find-answer", "", "standard"),
  contact: route("help", "contact", "contact-help", "choose-help-path", "", "standard"),
  feedback: route("help", "feedback", "local-form", "prepare-feedback", "", "compact"),
  grievance: route("help", "grievance", "grievance-directory", "open-official-contacts", "", "compact"),
  policies: route("help", "policies", "legal-index", "read-official-policy", "", "compact"),
  privacy: route("help", "privacy", "legal-index", "read-official-policy", "", "compact"),
  disclaimer: route("help", "disclaimer", "legal-index", "read-official-policy", "", "compact"),
  notices: route("help", "notices", "legal-index", "read-official-notice", "", "compact"),
  about: route("help", "about", "legal-index", "understand-concept", "", "compact")
});

const PRESENTATION_BY_ID = ROUTE_PRESENTATION as Record<string, RoutePresentation>;

export function workspaceFor(routeId: string): Workspace {
  if (routeId === "home") return "home";
  if (routeId === "track") return "track";
  if (FLOW_ROUTES.has(routeId)) return "report";
  return PRESENTATION_BY_ID[routeId]?.workspace || "home";
}

export function presentationFor(routeId: string, fallback = "practical-guidance"): RoutePresentation {
  return PRESENTATION_BY_ID[routeId] || route(workspaceFor(routeId), routeId, fallback, "read");
}
