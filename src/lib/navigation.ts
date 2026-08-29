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
    ...item("incident", "Report", "रिपोर्ट"),
    children: [
      item("complaints", "Old report overview", "पुराना रिपोर्ट परिचय", hidden),
      item("women-children", "Women & Children entry", "महिला/बाल प्रवेश", hidden),
      item("anonymous-report", "Anonymous entry", "अनाम प्रवेश", hidden),
      item("registered-report", "Registered entry", "विवरण वाला प्रवेश", hidden),
      item("guides", "Evidence guide", "साक्ष्य मार्गदर्शिका", hidden),
      item("other-cybercrime", "Other cybercrime entry", "अन्य साइबर अपराध प्रवेश", hidden),
      item("act-now", "Old report link", "पुराना रिपोर्ट लिंक", hidden),
      item("readiness", "Old evidence link", "पुराना साक्ष्य लिंक", hidden),
      item("details", "Details", "विवरण", hidden),
      item("evidence", "Evidence", "साक्ष्य", hidden),
      item("chronology", "Timeline", "समयरेखा", hidden),
      item("review", "Review", "समीक्षा", hidden),
      item("submit", "Old review link", "पुराना समीक्षा लिंक", hidden),
      item("next", "Old next-step link", "पुराना अगला-कदम लिंक", hidden)
    ]
  },
  {
    ...item("official-tools", "Check", "जाँच"),
    children: [
      item("check-identifier", "Person / account", "व्यक्ति / खाता", { ...context("check"), ...hidden }),
      item("check-website", "Website / app", "वेबसाइट / ऐप", { ...context("check"), ...hidden }),
      item("mobile-connections", "Mobile / SIM", "मोबाइल / SIM", { ...context("check"), ...hidden }),
      item("report-abuse", "Platform abuse", "प्लेटफ़ॉर्म दुरुपयोग", { ...context("help"), ...hidden }),
      item("report-suspect", "Report suspect", "संदिग्ध रिपोर्ट करें", { ...context("help"), ...hidden }),
      item("appeal", "Appeal", "अपील", { ...context("help"), ...hidden })
    ]
  },
  item("track", "Progress", "प्रगति"),
  {
    ...item("learning-corner", "Learn", "सीखें"),
    children: [
      item("safety", "Safety", "सुरक्षा", { ...context("learn"), ...hidden }),
      item("awareness", "Awareness", "जागरूकता", { ...context("learn"), ...hidden }),
      item("advisories", "Advisories", "सलाह", { ...context("learn"), ...hidden }),
      item("daily-digest", "Daily digest", "दैनिक डाइजेस्ट", { ...context("learn"), ...hidden }),
      item("training", "Training", "प्रशिक्षण", { ...context("learn"), ...hidden }),
      item("media", "Media", "मीडिया", { ...context("learn"), ...hidden }),
      item("accessibility", "Accessibility", "सुगम्यता", { ...context("help"), ...hidden }),
      item("volunteers", "Cyber Volunteers", "साइबर स्वयंसेवक", { ...context("secondary"), ...hidden }),
      item("volunteer-terms", "Volunteer terms", "स्वयंसेवक नियम", { ...context("secondary"), ...hidden }),
      item("unlawful-content", "Content guidance", "सामग्री मार्गदर्शन", { ...context("secondary"), ...hidden }),
      item("volunteer-register", "Registration demo", "पंजीकरण डेमो", { ...context("secondary"), ...hidden }),
      item("volunteer-login", "Login demo", "लॉगिन डेमो", { ...context("secondary"), ...hidden })
    ]
  },
  {
    ...item("contact", "Help", "सहायता"),
    children: [
      item("faq", "Frequently asked questions", "सामान्य प्रश्न", { ...context("help"), ...hidden }),
      item("feedback", "Portal feedback", "पोर्टल प्रतिक्रिया", { ...context("help"), ...hidden }),
      item("grievance", "Complaint / escalation help", "शिकायत / आगे की मदद", { ...context("help"), ...hidden }),
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
