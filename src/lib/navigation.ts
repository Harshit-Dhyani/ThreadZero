import type { Language, LocalizedText } from "./types.ts";

export type NavigationItem = {
  route: string;
  label: LocalizedText;
  children?: readonly NavigationItem[];
};

const item = (route: string, en: string, hi: string): NavigationItem => ({ route, label: { en, hi } });

export const NAV_GROUPS: readonly NavigationItem[] = [
  item("home", "Home", "होम"),
  {
    ...item("complaints", "Prepare", "तैयारी"),
    children: [
      item("complaints", "Complaint paths", "शिकायत मार्ग"),
      item("women-children", "Women / Children", "महिला / बच्चे"),
      item("anonymous-report", "Anonymous report", "गुमनाम रिपोर्ट"),
      item("registered-report", "Registered report", "पंजीकृत रिपोर्ट"),
      item("other-cybercrime", "Other cybercrime", "अन्य साइबर अपराध")
    ]
  },
  item("track", "Track", "ट्रैक"),
  {
    ...item("official-tools", "Report / Check", "रिपोर्ट / जाँच"),
    children: [
      item("official-tools", "Official tools", "आधिकारिक उपकरण"),
      item("check-identifier", "Check identifier", "पहचानकर्ता जाँचें"),
      item("check-website", "Check website / app", "वेबसाइट / ऐप जाँचें"),
      item("report-suspect", "Report suspect", "संदिग्ध रिपोर्ट करें"),
      item("report-abuse", "Report platform abuse", "प्लेटफ़ॉर्म दुरुपयोग रिपोर्ट करें"),
      item("mobile-connections", "Mobile connections", "मोबाइल कनेक्शन"),
      item("appeal", "Appeal with GAC", "GAC में अपील")
    ]
  },
  item("guides", "Evidence", "साक्ष्य"),
  {
    ...item("learning-corner", "Learning", "सीखें"),
    children: [
      item("learning-corner", "Learning Corner", "लर्निंग कॉर्नर"),
      item("advisories", "Advisories", "सलाह"),
      item("safety", "Online safety", "ऑनलाइन सुरक्षा"),
      item("awareness", "Cyber awareness", "साइबर जागरूकता"),
      item("daily-digest", "Daily digest", "दैनिक डाइजेस्ट"),
      item("training", "Training resources", "प्रशिक्षण संसाधन"),
      item("media", "Media library", "मीडिया लाइब्रेरी"),
      item("accessibility", "Accessibility", "सुगम्यता")
    ]
  },
  {
    ...item("volunteers", "Cyber Volunteers", "साइबर स्वयंसेवक"),
    children: [
      item("volunteers", "Programme overview", "कार्यक्रम परिचय"),
      item("volunteer-terms", "Terms and limits", "नियम और सीमाएँ"),
      item("unlawful-content", "Unlawful-content guidance", "गैरकानूनी सामग्री मार्गदर्शन"),
      item("volunteer-register", "Registration practice", "पंजीकरण अभ्यास"),
      item("volunteer-login", "Login practice", "लॉगिन अभ्यास")
    ]
  },
  {
    ...item("faq", "Help", "सहायता"),
    children: [
      item("faq", "Frequently asked questions", "सामान्य प्रश्न"),
      item("contact", "Contact and help", "संपर्क और मदद"),
      item("feedback", "Portal feedback", "पोर्टल प्रतिक्रिया"),
      item("grievance", "Grievance guidance", "शिकायत मार्गदर्शन")
    ]
  }
];

export const navigationLabel = (entry: NavigationItem, language: Language) => entry.label[language];

export function navigationParent(route: string): NavigationItem | null {
  return NAV_GROUPS.find((entry) => entry.route !== route && entry.children?.some((child) => child.route === route)) ?? null;
}

export function navigationGroupFor(route: string): NavigationItem | null {
  return NAV_GROUPS.find((entry) => entry.route === route || entry.children?.some((child) => child.route === route)) ?? null;
}
