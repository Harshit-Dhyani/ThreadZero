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
  report: Object.freeze({ route: "incident", en: "Report", hi: "रिपोर्ट" }),
  check: Object.freeze({ route: "official-tools", en: "Check", hi: "जाँच" }),
  track: Object.freeze({ route: "track", en: "Progress", hi: "प्रगति" }),
  learn: Object.freeze({ route: "learning-corner", en: "Learn", hi: "सीखें" }),
  help: Object.freeze({ route: "contact", en: "Help", hi: "सहायता" })
});

const FLOW_ROUTES = new Set(FLOW_ROUTE_IDS);

const ROUTE_PRESENTATION = Object.freeze({
  complaints: route("report", "legacy-entry", "redirect", "open-report-workspace", "", "compact"),
  "women-children": route("report", "legacy-entry", "redirect", "open-report-workspace", "", "compact"),
  "anonymous-report": route("report", "legacy-entry", "redirect", "open-report-workspace", "", "compact"),
  "registered-report": route("report", "legacy-entry", "redirect", "open-report-workspace", "", "compact"),
  "other-cybercrime": route("report", "legacy-entry", "redirect", "open-report-workspace", "", "compact"),
  "official-tools": route("check", "tools", "task-chooser", "choose-official-tool", "", "compact"),
  "check-identifier": route("check", "identifier", "redirect", "open-check-workspace", "", "compact"),
  "check-website": route("check", "website", "redirect", "open-check-workspace", "", "compact"),
  "mobile-connections": route("check", "mobile", "redirect", "open-check-workspace", "", "compact"),
  "report-suspect": route("help", "suspect", "redirect", "open-help-hub", "", "compact"),
  "report-abuse": route("help", "abuse", "redirect", "open-help-hub", "", "compact"),
  appeal: route("help", "appeal", "redirect", "open-help-hub", "", "compact"),
  volunteers: route("learn", "community", "secondary-guidance", "open-official-program", "", "compact"),
  "volunteer-terms": route("learn", "community-terms", "secondary-guidance", "read-official-terms", "", "compact"),
  "unlawful-content": route("learn", "community-content", "secondary-guidance", "preserve-and-report", "", "compact"),
  "volunteer-register": route("learn", "community-register", "secondary-guidance", "prepare-volunteer-details", "", "compact"),
  "volunteer-login": route("learn", "community-access", "secondary-guidance", "prepare-demo-access", "", "compact"),
  "learning-corner": route("learn", "overview", "learning-hub", "browse-learning", "", "standard"),
  guides: route("report", "guides", "evidence-guide", "prepare-evidence", "P06-evidence-thread-v1"),
  advisories: route("learn", "advisories", "redirect", "open-learning-hub", "", "compact"),
  safety: route("learn", "safety", "redirect", "open-learning-hub", "", "compact"),
  awareness: route("learn", "awareness", "redirect", "open-learning-hub", "", "compact"),
  "daily-digest": route("learn", "digest", "redirect", "open-learning-hub", "", "compact"),
  training: route("learn", "training", "redirect", "open-learning-hub", "", "compact"),
  media: route("learn", "media", "redirect", "open-learning-hub", "", "compact"),
  accessibility: route("help", "accessibility", "accessibility", "review-access-needs", "", "standard"),
  faq: route("help", "faq", "redirect", "open-help-hub", "", "compact"),
  contact: route("help", "contact", "contact-help", "choose-help-path", "", "standard"),
  feedback: route("help", "feedback", "redirect", "open-help-hub", "", "compact"),
  grievance: route("help", "grievance", "redirect", "open-help-hub", "", "compact"),
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
