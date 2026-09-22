// ============================================================
// PORTFOLIO TYPE DEFINITIONS
// Source of truth: Tech-Doc.md §3
// All content data files (/content/*.ts) must conform to these.
// ============================================================

export type EngineeringDecision = {
  topic: string;
  decision: string;
  reason: string[];
  alternatives?: string[];
  implementationContext?: string;
};

export type ArchitectureNode = {
  id: string; // Internal identifier
  name: string; // Display name
  icon?: string; // lucide-react icon name
  role: string;
  input?: string;
  output?: string;
  decisionTopic?: string; // Must exactly match a topic in the decisions array
  evidenceIds?: string[]; // References evidence strings in the evidence array
};

export type Project = {
  id: string;
  title: string;
  summary: string;          // 1-2 lines for cards
  problem: string;
  approach: string;
  result: string;
  tags: string[];
  links: { label: string; url: string }[];
  media: { type: "image" | "video"; src: string }[];
  accentColor: string;      // hex — per-project micro-identity
  signatureInteraction: "before-after" | "live-embed" | "terminal-reveal" | "none";
  
  // --- AGENT KNOWLEDGE LAYER ---
  architecture: ArchitectureNode[];
  features?: string[];
  performance?: Record<string, string>;
  decisions: EngineeringDecision[];
  challenges: string[];
  limitations: string[];
  future: string[];
  evidence: string[];
  githubUrl?: string;
  demoUrl?: string;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  start: string;            // ISO date string, e.g. "2022-01"
  end: string | "present";
  summary: string;
  highlights: string[];
};

// Derives proportional timeline weight from actual role duration.
// Tech-Doc §3: "segment length on the timeline reflects actual duration"
// so longer roles visually take more space than short ones.
export function getSegmentWeight(entry: ExperienceEntry): number {
  const start = new Date(entry.start);
  const end = entry.end === "present" ? new Date() : new Date(entry.end);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(months, 1); // floor at 1 so very short stints stay visible
}

export type GuideState = "idle" | "greeting" | "listening" | "explaining";

export type GuideResponse = {
  intent: string;
  reply: string;
  section: string | null;   // CSS selector to scroll to, e.g. "#experience"
  videoState: GuideState;
};

export type SkillItem = {
  name: string;
  icon?: string;            // path to icon SVG/PNG or icon name for a library
};

export type SkillGroup = {
  category: string;         // e.g. "Build with", "Design with", "Explore with"
  items: SkillItem[];
};

export type AboutData = {
  tagline: string;          // short one-liner for hero area
  bio: string[];            // array of punchy lines for AboutBriefing reveal
  offbeatDetail: string;    // one specific, personal detail (Design Doc 4.2)
  photo?: string;           // path to portrait image
  location?: string;
};
