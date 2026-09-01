import type { LocalizedText, ReportKind, Workspace } from "../../lib/types.ts";

export type OnboardingScope = "core" | Workspace;
export type OnboardingCloseReason = "skip" | "complete" | "escape";
export type OnboardingPlacement = "top" | "right" | "bottom" | "left" | "center";

export type OnboardingStep = {
  id: string;
  scope: OnboardingScope;
  targetSelectors: readonly string[];
  placement: OnboardingPlacement;
  title: LocalizedText;
  body: LocalizedText;
};

const copy = (en: string, hi: string): LocalizedText => ({ en, hi });
const step = (
  scope: OnboardingScope,
  id: string,
  title: LocalizedText,
  body: LocalizedText,
  targetSelectors: readonly string[] = [],
  placement: OnboardingPlacement = "center"
): OnboardingStep => Object.freeze({ id, scope, title, body, targetSelectors, placement });

export const CORE_ONBOARDING_STEPS = Object.freeze([
  step("core", "core-welcome", copy("Welcome to ThreadZero", "ThreadZero में आपका स्वागत है"), copy("This short tour explains where to report, check something suspicious, track preparation, learn, and find official help. Nothing in this guide is submitted anywhere.", "यह छोटा दौरा बताता है कि रिपोर्ट कहाँ तैयार करें, संदिग्ध चीज़ जाँचें, तैयारी ट्रैक करें, सीखें और आधिकारिक मदद पाएँ। इस मार्गदर्शिका से कहीं कुछ जमा नहीं होता।")),
  step("core", "core-workspaces", copy("Six workspaces, one clear path", "छह कार्यक्षेत्र, एक स्पष्ट रास्ता"), copy("Use Home, Report, Check, Track, Learn, and Help to move through the site. On a phone, open the Services menu to reach the same destinations.", "साइट में आगे बढ़ने के लिए होम, रिपोर्ट, जाँच, ट्रैक, सीखें और सहायता उपयोग करें। फ़ोन पर इन्हीं स्थानों के लिए सेवा मेनू खोलें।"), ["[data-tour='workspace-navigation']", "[data-tour='mobile-services']"], "bottom"),
  step("core", "core-guide", copy("Start with what you need", "अपनी जरूरत से शुरू करें"), copy("Guide can recommend the right workspace for lost money, suspicious activity, an existing report, evidence preparation, learning, or help.", "मार्गदर्शिका पैसा जाने, संदिग्ध गतिविधि, मौजूदा रिपोर्ट, साक्ष्य तैयारी, सीखने या मदद के लिए सही कार्यक्षेत्र सुझाती है।"), ["[data-tour='guide-trigger-desktop']", "[data-tour='guide-trigger-mobile']"], "bottom"),
  step("core", "core-search", copy("Ask from any page", "किसी भी पेज से पूछें"), copy("The bottom-right assistant finds routes and guidance from plain-language questions. It uses the local route index; it does not call an AI or external service.", "नीचे-दाएँ सहायक साधारण भाषा के प्रश्नों से पेज और मार्गदर्शन ढूँढता है। यह स्थानीय मार्ग सूची उपयोग करता है; किसी AI या बाहरी सेवा को कॉल नहीं करता।"), ["[data-tour='search-chatbot-trigger']"], "top"),
  step("core", "core-report", copy("Prepare a report step by step", "रिपोर्ट चरण-दर-चरण तैयार करें"), copy("Report organises what happened, relevant details, evidence, a timeline, and a final preparation summary. It never sends a police or government report.", "रिपोर्ट क्या हुआ, संबंधित विवरण, साक्ष्य, समयरेखा और अंतिम तैयारी सारांश व्यवस्थित करती है। यह पुलिस या सरकार को कभी रिपोर्ट नहीं भेजती।"), ["[data-tour='home-report-action']", "[data-tour='report-stage-rail']", "[data-tour='workspace-navigation']"], "right"),
  step("core", "core-official-help", copy("Act quickly when money is lost", "पैसा जाने पर तुरंत कार्रवाई करें"), copy("For actual financial cyber fraud in India, call 1930 manually and use cybercrime.gov.in. ThreadZero cannot place the call, freeze funds, or guarantee recovery.", "भारत में वास्तविक वित्तीय साइबर धोखाधड़ी के लिए 1930 पर स्वयं कॉल करें और cybercrime.gov.in उपयोग करें। ThreadZero कॉल नहीं कर सकता, धन नहीं रोक सकता या वापसी की गारंटी नहीं दे सकता।"), ["[data-tour='urgent-help-desktop']", "[data-tour='official-guidance']", "[data-tour='help-immediate']"], "bottom"),
  step("core", "core-complete", copy("You are ready to explore", "अब आप आगे बढ़ने के लिए तैयार हैं"), copy("Open Guide at any time to replay this website tour or start a shorter tour for the workspace you are viewing.", "इस वेबसाइट दौरे को फिर चलाने या वर्तमान कार्यक्षेत्र का छोटा दौरा शुरू करने के लिए कभी भी मार्गदर्शिका खोलें।"))
] satisfies readonly OnboardingStep[]);

const WORKSPACE_ONBOARDING_STEPS: Record<Workspace, readonly OnboardingStep[]> = {
  home: Object.freeze([
    step("home", "home-start", copy("Start preparing", "तैयारी शुरू करें"), copy("Begin the five-stage report preparation flow, or jump to the explanation below before choosing.", "पाँच-चरण रिपोर्ट तैयारी शुरू करें, या चुनने से पहले नीचे दिया गया विवरण देखें।"), ["[data-tour='home-report-action']"], "right"),
    step("home", "home-process", copy("See how the process works", "प्रक्रिया कैसे काम करती है देखें"), copy("These four actions connect the first response, evidence preparation, timeline organisation, and official handoff.", "ये चार कार्रवाइयाँ पहली प्रतिक्रिया, साक्ष्य तैयारी, समयरेखा संगठन और आधिकारिक हस्तांतरण को जोड़ती हैं।"), ["[data-tour='home-process']"], "top"),
    step("home", "home-services", copy("Choose by situation", "स्थिति के अनुसार चुनें"), copy("Citizen services take you directly to reporting, checking, tracking, evidence, learning, or help.", "नागरिक सेवाएँ आपको सीधे रिपोर्ट, जाँच, ट्रैक, साक्ष्य, सीखने या मदद तक ले जाती हैं।"), ["[data-tour='home-services']"], "top"),
    step("home", "home-learning", copy("Learn before the next incident", "अगली घटना से पहले सीखें"), copy("The Learning Corner collects practical training, safety guidance, awareness material, and official references.", "लर्निंग कॉर्नर व्यावहारिक प्रशिक्षण, सुरक्षा मार्गदर्शन, जागरूकता सामग्री और आधिकारिक संदर्भ एकत्र करता है।"), ["[data-tour='home-learning']"], "top")
  ]),
  report: Object.freeze([
    step("report", "report-family", copy("Choose the closest situation", "सबसे निकट स्थिति चुनें"), copy("Your report family changes the details, evidence, timeline, and review guidance. Choosing Unsure is valid when the category is not clear.", "आपका रिपोर्ट परिवार विवरण, साक्ष्य, समयरेखा और समीक्षा मार्गदर्शन बदलता है। श्रेणी स्पष्ट न हो तो ‘पता नहीं’ चुनना सही है।"), ["[data-tour='report-family']", "[data-tour='report-active-step']"], "right"),
    step("report", "report-stages", copy("Five preparation stages", "तैयारी के पाँच चरण"), copy("Move through What happened, Details, Evidence, Timeline, and Review & next. Future stages remain unavailable until the required preparation is complete.", "क्या हुआ, विवरण, साक्ष्य, समयरेखा और समीक्षा व अगला कदम से आगे बढ़ें। जरूरी तैयारी पूरी होने तक आगे के चरण उपलब्ध नहीं होते।"), ["[data-tour='report-stage-rail']"], "right"),
    step("report", "report-current", copy("Work in the current stage", "वर्तमान चरण में काम करें"), copy("The active panel keeps the selected report family in context. This tour does not change fields, evidence, events, or saved preparation.", "सक्रिय पैनल चुने गए रिपोर्ट परिवार को संदर्भ में रखता है। यह दौरा फ़ील्ड, साक्ष्य, घटनाएँ या सहेजी तैयारी नहीं बदलता।"), ["[data-tour='report-active-step']"], "left"),
    step("report", "report-evidence", copy("Missing evidence is guidance", "गायब साक्ष्य मार्गदर्शन है"), copy("Evidence can be marked as I have it, Missing, or Not sure, then connected to timeline events. Do not delay urgent official action just to complete every item.", "साक्ष्य को मेरे पास है, गायब या पता नहीं के रूप में चिन्हित कर समयरेखा घटनाओं से जोड़ें। हर वस्तु पूरी करने के लिए तात्कालिक आधिकारिक कार्रवाई में देर न करें।"), ["[data-tour='report-evidence']", "[data-tour='report-active-step']"], "left")
  ]),
  check: Object.freeze([
    step("check", "check-tools", copy("Choose what you want to check", "क्या जाँचना है चुनें"), copy("Use Overview, Person / account, Website / app, Mobile / SIM, Platform abuse, Report suspect, or Appeal.", "परिचय, व्यक्ति / खाता, वेबसाइट / ऐप, मोबाइल / सिम, प्लेटफ़ॉर्म दुरुपयोग, संदिग्ध रिपोर्ट या अपील उपयोग करें।"), ["[data-tour='check-tools']"], "right"),
    step("check", "check-current", copy("Try a deterministic example", "निश्चित उदाहरण आजमाएँ"), copy("The current tool uses local demonstration rules. A match or no-match is not a government lookup and does not prove that something is safe.", "वर्तमान टूल स्थानीय प्रदर्शन नियम उपयोग करता है। मिलान या न मिलना सरकारी जाँच नहीं है और किसी चीज़ को सुरक्षित साबित नहीं करता।"), ["[data-tour='check-active-tool']"], "left"),
    step("check", "check-actions", copy("Keep evidence and use official action", "साक्ष्य रखें और आधिकारिक कार्रवाई करें"), copy("Use the bounded action rows to preserve useful records and open the verified official destination when real action is needed.", "उपयोगी रिकॉर्ड सुरक्षित रखने और वास्तविक कार्रवाई के लिए सत्यापित आधिकारिक गंतव्य खोलने हेतु सीमित कार्रवाई पंक्तियाँ उपयोग करें।"), ["[data-tour='check-actions']", "[data-tour='check-active-tool']"], "top")
  ]),
  track: Object.freeze([
    step("track", "track-preparation", copy("Track local preparation", "स्थानीय तैयारी ट्रैक करें"), copy("This progress shows which ThreadZero preparation stages are complete. It is not police, NCRP, or government case status.", "यह प्रगति दिखाती है कि ThreadZero की कौन-सी तैयारी पूरी है। यह पुलिस, NCRP या सरकारी केस स्थिति नहीं है।"), ["[data-tour='track-preparation']"], "top"),
    step("track", "track-reference", copy("Use a demo reference", "डेमो संदर्भ उपयोग करें"), copy("The reference tracker uses deterministic browser-local examples. It never queries an official system or sends the reference anywhere.", "संदर्भ ट्रैकर निश्चित ब्राउज़र-स्थानीय उदाहरण उपयोग करता है। यह किसी आधिकारिक प्रणाली को नहीं खोजता या संदर्भ कहीं नहीं भेजता।"), ["[data-tour='track-reference']"], "top")
  ]),
  learn: Object.freeze([
    step("learn", "learn-rail", copy("Move through learning sections", "सीखने के अनुभागों में जाएँ"), copy("Use the workspace rail on desktop or the section selector on mobile to reach safety, awareness, advisories, training, media, and accessibility.", "सुरक्षा, जागरूकता, सलाह, प्रशिक्षण, मीडिया और सुगम्यता तक पहुँचने के लिए डेस्कटॉप पर कार्यक्षेत्र रेल या मोबाइल पर अनुभाग चयन उपयोग करें।"), ["[data-tour='workspace-rail']"], "right"),
    step("learn", "learn-situations", copy("Choose by what you need", "अपनी जरूरत के अनुसार चुनें"), copy("Situation-first learning paths help you start with prevention, scam recognition, evidence preparation, or helping someone else.", "स्थिति-आधारित सीखने के रास्ते रोकथाम, घोटाला पहचान, साक्ष्य तैयारी या किसी और की मदद से शुरू करने में सहायता करते हैं।"), ["[data-tour='learn-situations']"], "top"),
    step("learn", "learn-library", copy("Use the resource library", "संसाधन पुस्तकालय उपयोग करें"), copy("Open guides, FAQs, daily updates, media, accessibility information, and verified official references without leaving the learning structure.", "सीखने की संरचना में रहते हुए मार्गदर्शिका, सामान्य प्रश्न, दैनिक अपडेट, मीडिया, सुगम्यता जानकारी और सत्यापित आधिकारिक संदर्भ खोलें।"), ["[data-tour='learn-library']"], "top")
  ]),
  help: Object.freeze([
    step("help", "help-rail", copy("Find the right help section", "सही सहायता अनुभाग पाएँ"), copy("Move between immediate help, FAQs, feedback, and escalation guidance from the shared Help workspace navigation.", "साझा सहायता कार्यक्षेत्र नेविगेशन से तत्काल मदद, सामान्य प्रश्न, प्रतिक्रिया और आगे की मदद के बीच जाएँ।"), ["[data-tour='workspace-rail']"], "right"),
    step("help", "help-immediate", copy("Money lost? Start with 1930", "पैसा गया? 1930 से शुरू करें"), copy("For actual financial cyber fraud, call 1930 manually before spending time completing this demo. ThreadZero cannot place the call or submit a report.", "वास्तविक वित्तीय साइबर धोखाधड़ी के लिए इस डेमो को पूरा करने से पहले 1930 पर स्वयं कॉल करें। ThreadZero कॉल या रिपोर्ट जमा नहीं कर सकता।"), ["[data-tour='help-immediate']"], "top"),
    step("help", "help-paths", copy("Choose ordinary or official help", "सामान्य या आधिकारिक मदद चुनें"), copy("Use FAQs, portal feedback, complaint guidance, or the verified official destinations according to the problem you are trying to solve.", "जिस समस्या को हल करना है उसके अनुसार सामान्य प्रश्न, पोर्टल प्रतिक्रिया, शिकायत मार्गदर्शन या सत्यापित आधिकारिक गंतव्य उपयोग करें।"), ["[data-tour='help-paths']"], "top")
  ])
};

const REPORT_KIND_CONTEXT: Record<ReportKind, LocalizedText> = {
  unselected: copy("Choose a report family before continuing. The later stages will adapt to that choice.", "आगे बढ़ने से पहले रिपोर्ट परिवार चुनें। बाद के चरण उसी चुनाव के अनुसार बदलेंगे।"),
  financial: copy("Financial preparation can include transaction details and payment evidence, while urgent official action remains first.", "वित्तीय तैयारी में लेन-देन विवरण और भुगतान साक्ष्य शामिल हो सकते हैं, जबकि तात्कालिक आधिकारिक कार्रवाई पहले रहती है।"),
  "women-child": copy("Women and Child preparation keeps its own category and reporting-mode guidance without inheriting financial fields.", "महिला और बाल तैयारी अपनी श्रेणी और रिपोर्टिंग-मोड मार्गदर्शन रखती है और वित्तीय फ़ील्ड नहीं लेती।"),
  other: copy("Other Cybercrime preparation uses incident-specific facts and evidence without inheriting financial fields.", "अन्य साइबर अपराध तैयारी घटना-विशिष्ट तथ्य और साक्ष्य उपयोग करती है और वित्तीय फ़ील्ड नहीं लेती।"),
  unsure: copy("Unsure keeps the guidance neutral until you can choose a closer situation; no financial example is assumed.", "पता नहीं चुनने पर मार्गदर्शन तब तक तटस्थ रहता है जब तक आप निकट स्थिति न चुनें; कोई वित्तीय उदाहरण नहीं माना जाता।")
};

export function getOnboardingSteps(scope: OnboardingScope, reportKind: ReportKind = "unselected"): readonly OnboardingStep[] {
  if (scope === "core") return CORE_ONBOARDING_STEPS;
  const steps = WORKSPACE_ONBOARDING_STEPS[scope];
  if (scope !== "report") return steps;
  return steps.map((candidate) => candidate.id === "report-current"
    ? { ...candidate, body: REPORT_KIND_CONTEXT[reportKind] }
    : candidate);
}

export function findFirstVisibleTarget<T>(selectors: readonly string[], candidates: (selector: string) => Iterable<T>, visible: (candidate: T) => boolean): T | null {
  for (const selector of selectors) for (const candidate of candidates(selector)) if (visible(candidate)) return candidate;
  return null;
}

export function assertOnboardingDefinitions() {
  const all = [CORE_ONBOARDING_STEPS, ...Object.values(WORKSPACE_ONBOARDING_STEPS)].flat();
  const ids = new Set<string>();
  for (const candidate of all) {
    if (ids.has(candidate.id)) throw new Error(`Duplicate onboarding step id: ${candidate.id}`);
    ids.add(candidate.id);
    if (!candidate.title.en || !candidate.title.hi || !candidate.body.en || !candidate.body.hi) throw new Error(`Incomplete onboarding copy: ${candidate.id}`);
    if (!candidate.targetSelectors.every((selector) => selector.startsWith("[data-tour='"))) throw new Error(`Unstable onboarding selector: ${candidate.id}`);
  }
  return true;
}
