// Guide intent router — maps raw user input to a section + reply string.
// Pure functions only: no React, no DOM, no side effects.
// Keyword matching is intentionally fuzzy (includes-based) — it's a
// navigation aid, not a semantic search engine.

export interface GuideIntent {
  /** Target section ID to smooth-scroll to. Empty string = no scroll. */
  section: string;
  /** Short reply text shown in the guide's chat bubble. */
  reply: string;
}

// Ordered by specificity. First match wins.
const INTENT_TABLE: Array<{
  keywords: string[];
  section: string;
  reply: string;
}> = [
  {
    keywords: ["about", "who are you", "yourself", "person", "background", "intro"],
    section: "about",
    reply: "Let me tell you a bit about who I am.",
  },
  {
    keywords: ["experience", "career", "job", "worked", "roles", "timeline", "history"],
    section: "experience",
    reply: "Here's where I've spent my time.",
  },
  {
    keywords: ["project", "portfolio", "built", "made", "show", "demo", "thing"],
    section: "projects",
    reply: "Here's what I've built.",
  },
  {
    keywords: ["skill", "stack", "technolog", "tech", "tool", "language", "framework"],
    section: "skills",
    reply: "Here's how I show up technically.",
  },
  {
    keywords: ["contact", "hire", "reach", "email", "message", "connect", "talk", "collaborat"],
    section: "contact",
    reply: "Let's talk — I reply to everything.",
  },
  {
    keywords: ["top", "home", "start", "beginning", "back", "hero"],
    section: "hero",
    reply: "Back to the top.",
  },
];

/**
 * Route a raw text input to a GuideIntent.
 * Always returns an intent — falls back to a friendly non-match reply.
 */
export function routeIntent(input: string): GuideIntent {
  const lower = input.toLowerCase().trim();

  for (const { keywords, section, reply } of INTENT_TABLE) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { section, reply };
    }
  }

  return {
    section: "",
    reply: "Hmm — try asking about my projects, experience, or skills.",
  };
}

/**
 * Smooth-scroll to a section, accounting for the fixed navbar height.
 */
export function scrollToSection(sectionId: string, navbarOffset = 64): void {
  if (!sectionId) return;
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
  window.scrollTo({ top, behavior: "smooth" });
}
