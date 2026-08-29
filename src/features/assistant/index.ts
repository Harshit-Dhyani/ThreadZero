import type { LocalizedText, ReportState } from "../../lib/types.ts";
import { reportProgressSummary } from "../../domains/report/index.ts";

export type AssistantActionId = "lost-money" | "check" | "continue" | "learn" | "help";
export type AssistantAction = { id: AssistantActionId; title: LocalizedText; body: LocalizedText };

export const ASSISTANT_ACTIONS: readonly AssistantAction[] = Object.freeze([
  { id: "lost-money", title: { en: "I lost money", hi: "मेरे पैसे का नुकसान हुआ" }, body: { en: "See the urgent 1930 step and start preparing the report.", hi: "तात्कालिक 1930 कदम देखें और रिपोर्ट की तैयारी शुरू करें।" } },
  { id: "check", title: { en: "Check something suspicious", hi: "किसी संदिग्ध चीज़ की जाँच करें" }, body: { en: "Check a contact/account, website/app, or mobile connection path.", hi: "संपर्क/खाता, वेबसाइट/ऐप या मोबाइल कनेक्शन मार्ग जाँचें।" } },
  { id: "continue", title: { en: "Continue my report", hi: "मेरी रिपोर्ट जारी रखें" }, body: { en: "Resume the next unfinished preparation step on this device.", hi: "इस डिवाइस पर अगला अधूरा तैयारी चरण जारी रखें।" } },
  { id: "learn", title: { en: "Understand a scam or stay safe", hi: "स्कैम समझें या सुरक्षित रहें" }, body: { en: "Open simple safety, scam-pattern, evidence, and alert guidance.", hi: "सरल सुरक्षा, स्कैम पैटर्न, साक्ष्य और चेतावनी मार्गदर्शन खोलें।" } },
  { id: "help", title: { en: "Find official help", hi: "आधिकारिक सहायता खोजें" }, body: { en: "Find urgent help, official escalation, FAQ, privacy, and accessibility information.", hi: "तात्कालिक सहायता, आधिकारिक शिकायत, सामान्य प्रश्न, गोपनीयता और सुगम्यता जानकारी खोजें।" } }
]);

export function assistantDestination(action: AssistantActionId, report: ReportState) {
  if (action === "lost-money") return "incident";
  if (action === "check") return "official-tools";
  if (action === "learn") return "learning-corner";
  if (action === "help") return "contact";
  const next = reportProgressSummary(report).next;
  return report.reportKind === "unselected" ? "incident" : next;
}
