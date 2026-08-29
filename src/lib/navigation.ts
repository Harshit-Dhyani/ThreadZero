import type { Language, LocalizedText } from "./types.ts";
import { localized } from "./i18n.ts";

export type NavigationItem = {
  route: string;
  label: LocalizedText;
  contextFamily?: string;
  contextLabel?: LocalizedText;
  showInMenu?: boolean;
  children?: readonly NavigationItem[];
};

const item = (route: string, en: string, hi: string, options: Omit<NavigationItem, "route" | "label" | "children"> = {}): NavigationItem => ({ route, label: { en, hi }, ...options });
const context = (contextFamily: string) => ({ contextFamily });
const hidden = { showInMenu: false } as const;

export const NAV_GROUPS: readonly NavigationItem[] = [
  item("home", "Home", "होम"),
  {
    ...item("complaints", "Report", "रिपोर्ट"),
    children: [
      item("complaints", "Overview", "परिचय", context("report")),
      item("incident", "Financial fraud report", "वित्तीय धोखाधड़ी रिपोर्ट"),
      item("women-children", "Women & Children", "महिलाएँ और बच्चे", context("report")),
      item("anonymous-report", "Without my name", "नाम साझा किए बिना", context("report")),
      item("registered-report", "With my details", "मेरे विवरण के साथ", context("report")),
      item("guides", "Evidence", "साक्ष्य", context("report")),
      item("other-cybercrime", "Other cybercrime", "अन्य साइबर अपराध", context("report")),
      item("act-now", "Old report link", "पुराना रिपोर्ट लिंक", hidden),
      item("readiness", "Old evidence link", "पुराना साक्ष्य लिंक", hidden),
      item("details", "Details", "विवरण", hidden),
      item("evidence", "Evidence step", "साक्ष्य चरण", hidden),
      item("chronology", "Timeline", "समयरेखा", hidden),
      item("review", "Review", "समीक्षा", hidden),
      item("submit", "Old review link", "पुराना समीक्षा लिंक", hidden),
      item("next", "Old next-step link", "पुराना अगला-कदम लिंक", hidden)
    ]
  },
  {
    ...item("official-tools", "Check", "जाँच"),
    children: [
      item("official-tools", "Overview", "परिचय", context("check")),
      item("check-identifier", "Person / account", "व्यक्ति / खाता", context("check")),
      item("check-website", "Website / app", "वेबसाइट / ऐप", context("check")),
      item("mobile-connections", "Mobile", "मोबाइल", context("check")),
      item("report-abuse", "Platform abuse", "प्लेटफ़ॉर्म दुरुपयोग", context("check")),
      item("report-suspect", "Report suspect", "संदिग्ध रिपोर्ट करें", context("check")),
      item("appeal", "Appeal", "अपील", context("check"))
    ]
  },
  item("track", "Track", "ट्रैक"),
  {
    ...item("learning-corner", "Learn", "सीखें"),
    children: [
      item("learning-corner", "Overview", "परिचय", context("learn")),
      item("safety", "Safety", "सुरक्षा", context("learn")),
      item("awareness", "Awareness", "जागरूकता", context("learn")),
      item("advisories", "Advisories", "सलाह", context("learn")),
      item("daily-digest", "Daily digest", "दैनिक डाइजेस्ट", context("learn")),
      item("training", "Training", "प्रशिक्षण", context("learn")),
      item("media", "Media", "मीडिया", context("learn")),
      item("accessibility", "Accessibility", "सुगम्यता", context("learn")),
      item("volunteers", "Cyber Volunteers", "साइबर स्वयंसेवक", { contextFamily: "volunteers", contextLabel: { en: "Cyber Volunteers", hi: "साइबर स्वयंसेवक" } }),
      item("volunteer-terms", "Volunteer terms", "स्वयंसेवक नियम", { ...context("volunteers"), ...hidden }),
      item("unlawful-content", "Content guidance", "सामग्री मार्गदर्शन", { ...context("volunteers"), ...hidden }),
      item("volunteer-register", "Registration demo", "पंजीकरण डेमो", { ...context("volunteers"), ...hidden }),
      item("volunteer-login", "Login demo", "लॉगिन डेमो", { ...context("volunteers"), ...hidden })
    ]
  },
  {
    ...item("contact", "Help", "सहायता"),
    children: [
      item("contact", "Help options", "सहायता विकल्प", context("help")),
      item("faq", "Frequently asked questions", "सामान्य प्रश्न", context("help")),
      item("feedback", "Portal feedback", "पोर्टल प्रतिक्रिया", context("help")),
      item("grievance", "Complaint / escalation help", "शिकायत / आगे की मदद", context("help")),
      item("policies", "Policies", "नीतियाँ", hidden),
      item("privacy", "Privacy", "गोपनीयता", hidden),
      item("disclaimer", "Disclaimer", "अस्वीकरण", hidden),
      item("notices", "Notices", "सूचनाएँ", hidden),
      item("about", "About", "परिचय", hidden)
    ]
  }
];

export const navigationLabel = (entry: NavigationItem, language: Language) => localized(entry.label, language);

export const navigationMenuChildren = (entry: NavigationItem) => entry.children?.filter((child) => child.showInMenu !== false) ?? [];

export function navigationParent(route: string): NavigationItem | null {
  return NAV_GROUPS.find((entry) => entry.route !== route && entry.children?.some((child) => child.route === route)) ?? null;
}

export function navigationGroupFor(route: string): NavigationItem | null {
  return NAV_GROUPS.find((entry) => entry.route === route || entry.children?.some((child) => child.route === route)) ?? null;
}

export function navigationContextFor(route: string) {
  const group = navigationGroupFor(route);
  const current = group?.children?.find((child) => child.route === route);
  if (!group || !current?.contextFamily) return null;
  const items = group.children?.filter((child) => child.contextFamily === current.contextFamily) ?? [];
  const label = items.find((child) => child.contextLabel)?.contextLabel ?? group.label;
  return { group, label, items };
}
