import type { AssetRecord } from "../types.ts";

const asset = (id: string, width: number, height: number, decorative = true, en = "", hi = ""): AssetRecord => ({
  id,
  width,
  height,
  sources: { small: `/assets/images/${id}-640.webp`, large: `/assets/images/${id}-1200.webp` },
  focalPoint: "center",
  decorative,
  alt: { en, hi }
});

export const ASSETS = {
  advisories: asset("advisories-source-backed-v1", 1200, 546),
  accessibilityV2: asset("accessibility-everyone-v1", 1200, 600),
  awarenessV2: asset("cyber-awareness-everyone-v1", 1200, 566),
  footerHelp: asset("footer-guidance-v1", 1200, 657),
  help: asset("help-pathways-v1", 1200, 675),
  homeEvidenceThreadV5: asset("home-evidence-thread-illustration-v5", 1200, 675, false, "Illustrated evidence timeline linking messages, websites, transaction records, and account details.", "संदेश, वेबसाइट, लेन-देन रिकॉर्ड और खाता विवरण जोड़ती चित्रित साक्ष्य समयरेखा।"),
  homePreparationV5: asset("home-preparation-illustration-v5", 1200, 675, false, "Illustration of a citizen organising a phone, receipt, notebook, and laptop before reporting.", "रिपोर्ट करने से पहले फोन, रसीद, नोटबुक और लैपटॉप व्यवस्थित करते नागरिक का चित्रण।"),
  onboardingGuide: asset("onboarding-guide-host-v3", 1200, 1800),
  media: asset("media-library-civic-v1", 1200, 636),
  reportPreparation: asset("hero-report-preparation-illustration-v1", 1200, 676, false, "Illustration of a citizen organising a phone, transaction receipt, and notes before reporting.", "रिपोर्ट करने से पहले फोन, लेन-देन रसीद और नोट व्यवस्थित करते नागरिक का चित्रण।"),
  safetyV2: asset("online-safety-essentials-v1", 1200, 545),
  training: asset("learning-training-paths-v1", 1200, 549),
  volunteers: asset("cyber-volunteers-guidance-v1", 1200, 657),
  mediaVideo: asset("P08-media-video-cover-v1", 1200, 676, false, "Illustrated cyber-safety video preview", "चित्रित साइबर सुरक्षा वीडियो पूर्वावलोकन"),
  mediaCampaign: asset("P08-media-campaign-cover-v1", 1122, 1402, false, "Illustrated cyber-awareness campaign", "चित्रित साइबर जागरूकता अभियान"),
  mediaInfographic: asset("P08-media-infographic-cover-v1", 1200, 900, false, "Illustrated online-safety infographic", "चित्रित ऑनलाइन सुरक्षा इन्फोग्राफिक"),
  mediaGuide: asset("P08-media-guide-cover-v1", 1200, 900, false, "Illustrated citizen safety guide", "चित्रित नागरिक सुरक्षा मार्गदर्शिका")
} satisfies Record<string, AssetRecord>;

export type AssetId = keyof typeof ASSETS;
