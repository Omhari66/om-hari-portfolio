# Portfolio — Deep Architecture Reference

> This file is the deep-dive companion to `AGENTS.md`. Read `AGENTS.md` first for the overview. Come here when you need to understand how a specific system works internally.

---

## 1. Design System — How Tokens Flow

```
globals.css (:root)
  ↓ CSS variables
layout.tsx (injects font class names onto <html>)
  ↓ CSS custom properties
Every component (via style={{ color: "var(--color-accent)" }})
```

The `@theme` block in Tailwind v4 also references these same variables so Tailwind utility classes and inline styles stay in sync.

---

## 2. Section Anatomy (Pattern Every Section Follows)

```tsx
<section id="section-name" aria-labelledby="section-heading" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)", ... }}>
  
  {/* Eyebrow */}
  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    <div style={{ width: "20px", height: "1px", background: "var(--color-accent)" }} />
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", ... }}>
      01 — Section Name
    </span>
  </div>

  {/* Heading — always fontWeight 300, letterSpacing wide, uppercase */}
  <h2 id="section-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 300, ... }}>
    Main Title<br />
    <span style={{ color: "var(--color-accent)" }}>gradient word.</span>
  </h2>

  {/* Content */}
</section>
```

Alternate sections use `background: "#050505"` (near-black) with horizontal accent scan lines.

---

## 3. AI Voice Assistant — Data Flow

```
User types question in Hero input
  → form onSubmit → handleAsk()
    → POST /api/chat { prompt: "..." }
      → route.ts: reads all content/*.ts files
      → builds system prompt with user's real data
      → calls Gemini 1.5 Flash
      → returns { reply: "..." }
    → setAiMessage(reply)
    → speak(reply)   ← useVoiceAssistant hook
      → SpeechSynthesis.speak(utterance)
        → best available device voice, pitch=0.95, rate=0.95
```

**Browser autoplay restriction workaround:**  
The "Initialize AI" button is required — browsers block audio without a user gesture. Once clicked, `hasStarted = true` and all subsequent responses auto-play.

**Mount gate in Hero.tsx:**  
`mounted` state starts `false` (server) and becomes `true` after first `useEffect`. The entire chat UI renders as `null` during SSR to prevent hydration mismatches from `voicesLoaded` or `hasStarted` state.

---

## 4. GuideWidget — State Machine

```
States: "idle" | "greeting" | "listening" | "explaining"

idle → (BootSequence finishes) → greeting
greeting → (user input) → listening
listening → (intent resolved) → explaining
explaining → (timeout REPLY_MS) → idle
```

The widget also listens for `CustomEvent("portfolio:signoff")` dispatched by `GuideSignoff` when the Contact section enters the viewport.

Intent routing is pure/functional in `src/lib/guideIntents.ts` — add new intents there without touching GuideWidget.

---

## 5. Content Data → AI System Prompt

`/api/chat/route.ts` imports all four content files and assembles a system prompt:

```ts
import about from "@/content/about";
import experience from "@/content/experience";
import projects from "@/content/projects";
import skills from "@/content/skills";
```

When the owner updates content files, the AI instantly knows the new information — no code changes needed.

---

## 6. Responsive Strategy

All responsive layout uses **CSS grid utility classes** defined in `globals.css`:

| Class | Desktop | Mobile (≤767px) |
|---|---|---|
| `layout-grid-2` | 2 columns | 1 column |
| `layout-grid-3` | 3 columns | 1 column |
| `layout-sidebar` | 2 col (60/40) | 1 column |
| `layout-hero-grid` | 2 col with gap | stack vertical |
| `layout-about-grid` | 2 col (60/40) | stack vertical |

The Hero section uses a 3-column CSS grid inline: `gridTemplateColumns: "56px 1fr 1fr"`. On mobile the left social column collapses via the `.hero-guide-orb` class in globals.css.

---

## 7. BootSequence — Persistence

- Uses `sessionStorage` key `"boot-done"`
- First visit: plays full terminal animation, then sets the key
- Return visit: skips animation entirely (guard in `useEffect`)
- GuideWidget reads the same key to decide whether to appear immediately or wait

---

## 8. Signatures — Isolation Contract

Each signature in `src/components/signatures/` must:
1. Be self-contained (no imports from other signatures or sections)
2. Accept only simple props (strings, arrays of strings, hex colors)
3. Handle its own IntersectionObserver/scroll logic internally
4. Respect `useReducedMotion()` from Framer Motion

---

## 9. Adding a New Section (Step-by-Step)

1. Create `src/components/sections/NewSection.tsx`
2. Add `"use client"` only if you need event handlers
3. Follow the section anatomy pattern (eyebrow, heading, content)
4. Use the next number in the eyebrow: `06 — New Section`
5. Import and add it to `src/app/page.tsx` between existing sections
6. Add a `#new-section` nav link to `Navbar.tsx`'s `NAV_LINKS` array
7. Add a matching intent in `src/lib/guideIntents.ts` if needed

---

## 10. TypeScript Conventions

- All content types are in `src/types/index.ts` — add new types there
- `Project` type uses `summary` (not `description`) for the card text
- `ExperienceEntry.end` is `string | "present"` — handle both in any mapping
- Always run `npx tsc --noEmit` and achieve **0 errors** before completing a task

---

## 11. Known Gotchas

| Gotcha | Explanation |
|---|---|
| Hydration warning in console | Grammarly browser extension mutates `<body>`. Suppressed via `suppressHydrationWarning` on `<body>` in `layout.tsx`. Normal. |
| GIF not animating | Only happens if rendered via `next/image`. Always use plain `<img>` for the avatar GIF. |
| Voice not playing | Browser requires a user gesture first. "Initialize AI" button handles this. |
| `project.description` TS error | The field is `project.summary`, not `project.description`. Check `src/types/index.ts`. |
| Gemini 500 error | Missing `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local`. |
