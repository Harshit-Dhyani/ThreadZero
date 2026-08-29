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
  accessibility: asset("accessibility-illustration-v1", 1200, 676),
  accessibilityV2: asset("accessibility-everyone-v1", 1200, 600),
  awareness: asset("awareness-community-illustration-v1", 1200, 676),
  awarenessV2: asset("cyber-awareness-everyone-v1", 1200, 566),
  evidence: asset("evidence-thread-illustration-v1", 1200, 676),
  faq: asset("faq-support-illustration-v5", 1200, 800),
  footerHelp: asset("footer-guidance-v1", 1200, 657),
  guides: asset("guides-learning-illustration-v1", 1200, 676),
  help: asset("help-pathways-v1", 1200, 675),
  media: asset("media-library-civic-v1", 1200, 636),
  reportAbuse: asset("P06-evidence-thread-v1", 1200, 676),
  contact: asset("P07-editorial-help-scene-v1", 1200, 676),
  safety: asset("safety-advisory-illustration-v1", 1200, 676),
  safetyV2: asset("online-safety-essentials-v1", 1200, 545),
  training: asset("learning-training-paths-v1", 1200, 549),
  transactionReview: asset("transaction-review-illustration-v1", 1200, 676),
  volunteers: asset("cyber-volunteers-guidance-v1", 1200, 657),
  mediaVideo: asset("P08-media-video-cover-v1", 1200, 676, false, "Illustrated cyber-safety video preview", "चित्रित साइबर सुरक्षा वीडियो पूर्वावलोकन"),
  mediaCampaign: asset("P08-media-campaign-cover-v1", 1122, 1402, false, "Illustrated cyber-awareness campaign", "चित्रित साइबर जागरूकता अभियान"),
  mediaInfographic: asset("P08-media-infographic-cover-v1", 1200, 900, false, "Illustrated online-safety infographic", "चित्रित ऑनलाइन सुरक्षा इन्फोग्राफिक"),
  mediaGuide: asset("P08-media-guide-cover-v1", 1200, 900, false, "Illustrated citizen safety guide", "चित्रित नागरिक सुरक्षा मार्गदर्शिका")
} satisfies Record<string, AssetRecord>;

export type AssetId = keyof typeof ASSETS;
