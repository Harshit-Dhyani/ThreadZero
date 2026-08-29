export type Language = "en" | "hi";
export type LocalizedText = Record<Language, string>;
export type Workspace = "home" | "report" | "check" | "track" | "learn" | "help";
export type Readiness = "ready" | "missing" | "optional";
export type EvidenceAvailability = "have" | "missing" | "unsure";
export type EvidenceCategory = "payment" | "messages" | "person-account" | "links";
export type ReportEntryMode = "financial" | "women-child-anonymous" | "women-child-details" | "other";

export type RouteFieldOption = LocalizedText;
export type RouteField = {
  name: string;
  type: string;
  label: LocalizedText;
  required?: boolean;
  minLength?: number;
  pattern?: string;
  example?: string;
  options?: RouteFieldOption[];
};

export type RouteItem = { title: LocalizedText; body: LocalizedText; route?: string };
export type RouteDefinition = {
  id: string;
  group: string;
  composition: string;
  label: LocalizedText;
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro: LocalizedText;
  items: RouteItem[];
  fields: RouteField[];
  sources: string[];
  result: LocalizedText | null;
};

export type LocalizedRoute = Omit<RouteDefinition, "label" | "eyebrow" | "title" | "intro" | "items" | "fields" | "result"> & {
  label: string;
  eyebrow: string;
  title: string;
  intro: string;
  result: string;
  items: Array<{ title: string; body: string; route?: string }>;
  fields: Array<Omit<RouteField, "label" | "options"> & { label: string; options: string[] }>;
};

export type RoutePresentation = {
  workspace: Workspace;
  mode: string;
  archetype: string;
  actionModel: string;
  heroTreatment: string;
  heroAsset: string;
  heroStyle: string;
  sourceTreatment: "compact";
};

export type Incident = {
  type: string;
  amount: string;
  date: string;
  time: string;
  paymentMethod: string;
  transactionReference: string;
  recipientIdentifier: string;
  contactChannel: string;
  narrative: string;
};

export type EvidenceItem = {
  id: string;
  name: LocalizedText;
  category: EvidenceCategory;
  whyUseful: LocalizedText;
  whereToFind: LocalizedText;
  availability: EvidenceAvailability;
  relatedEventIds: string[];
  extractionRequired: boolean;
};

export type ChronologyEvent = {
  id: string;
  date: string;
  time: string;
  description: string;
  detail: string;
};

export type ReportState = {
  route: string;
  completed: string[];
  entryMode: ReportEntryMode;
  incident: Incident;
  evidence: EvidenceItem[];
  events: ChronologyEvent[];
  extracted: Record<string, string>;
  incidentChoice: string;
  extractionConfirmed: boolean;
  reviewed: boolean;
  submission: "idle" | "prepared";
  locked: boolean;
};

export type GuideTask = {
  id: "lost-money" | "suspicious" | "reported" | "report" | "learn" | "help";
  route: string;
  workspace: Workspace;
  title: LocalizedText;
  body: LocalizedText;
};

export type OfficialSource = { url: string; en: string; hi: string; verifiedOn?: string };
export type SourceBackedResource = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: string;
  sourceId: string;
  destination: string;
  verifiedOn: string;
  publishedOn?: string;
};
export type MediaKind = "video" | "campaign" | "infographic" | "guide";
export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: LocalizedText;
  summary: LocalizedText;
  tags: string[];
  assetId: string;
  sourceKey: string;
  destination: string;
  verifiedOn?: string;
  publishedOn?: string;
};

export type AssetRecord = {
  id: string;
  width: number;
  height: number;
  sources: { small: string; large: string };
  focalPoint: string;
  decorative: boolean;
  alt: LocalizedText;
};
