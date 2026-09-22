# Portfolio — Deep Architecture Reference

> This file is the deep-dive companion to `AGENTS.md` and `PROJECT_CONTEXT.md`. Come here when you need to understand how each specific system works internally.

---

## 1. Design System — How Tokens Flow

```
globals.css (:root)
  ↓ CSS variables (--color-bg, --color-accent, etc.)
layout.tsx (injects font class names onto <html>)
  ↓ CSS custom properties
Every component (via style={{ color: "var(--color-accent)" }})
```

The `@theme` block in Tailwind v4 references these variables so Tailwind utility classes and inline styles stay in perfect sync.

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

## 3. The 5 Architectural Tiers

```
┌─────────────────────────────────────────────────────────────┐
│ 1. KNOWLEDGE LAYER (src/content/)                           │
│    about.ts | experience.ts | projects.ts | skills.ts       │
│    Strict source of truth. LLM cannot invent data.          │
└───────────────────────────┬─────────────────────────────────┘
                            │ Read by
┌───────────────────────────▼─────────────────────────────────┐
│ 2. AI AGENT & TOOLS (/api/chat/route.ts)                    │
│    Gemini 2.0 Flash + Tools (architecture, decision,        │
│    evidence) validating against Knowledge Layer             │
└───────────────────────────┬─────────────────────────────────┘
                            │ Returns { text, toolResults }
┌───────────────────────────▼─────────────────────────────────┐
│ 3. AMBIENT VOICE & OVERLAY (AmbientVoiceOverlay.tsx)        │
│    Web Speech API (SpeechRecognition + SpeechSynthesis)      │
│    Dispatches toolResults to Portfolio State Machine        │
└───────────────────────────┬─────────────────────────────────┘
                            │ dispatch(PortfolioEvent)
┌───────────────────────────▼─────────────────────────────────┐
│ 4. PORTFOLIO STATE MACHINE (src/portfolio/state.tsx)        │
│    State: { activeProject, activeView, viewData }           │
└───────────────────────────┬─────────────────────────────────┘
                            │ Triggers
┌───────────────────────────▼─────────────────────────────────┐
│ 5. DYNAMIC STAGE (src/components/stage/DynamicStage.tsx)    │
│    ArchitectureView | DecisionView | EvidenceView           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. AI Voice Assistant & Multi-Turn Data Flow

1. User clicks the animated `GuideOrb` in Hero or clicks "Initialize AI".
2. Browser `webkitSpeechRecognition` starts listening.
3. User asks: *"Why did you use Qdrant in AdaptIQ?"*
4. `AmbientVoiceOverlay` posts the conversation history `messages` to `POST /api/chat`.
5. In `/api/chat/route.ts`:
   - System prompt incorporates real profile and project details.
   - `gemini-3.8-flash` decides to call `show_technical_decision({ project: "project-adaptiq", technology: "Qdrant" })`.
   - Tool verifies `getProject("project-adaptiq")`, extracts Qdrant decision from `projects.ts`, and returns it.
   - Gemini returns brief spoken text + tool result payload.
6. `AmbientVoiceOverlay` receives `{ text, toolResults }`:
   - Dispatches `SHOW_DECISION` to `PortfolioState`.
   - `DynamicStage` displays the `DecisionView` modal overlay.
   - Calls `speak(text)` to read the explanation aloud.
   - When speech ends, automatically resumes listening for follow-up questions.

---

## 5. Responsive Grid Classes

All responsive layouts use **CSS grid utility classes** defined in `globals.css`:

| Class | Desktop | Mobile (≤767px) |
|---|---|---|
| `layout-grid-2` | 2 columns | 1 column |
| `layout-grid-3` | 3 columns | 1 column |
| `layout-sidebar` | 2 col (60/40) | 1 column |
| `layout-hero-grid` | 2 col with gap | stack vertical |
| `layout-about-grid` | 2 col (60/40) | stack vertical |

---

## 6. GhostCursor Three.js Integration

- Implemented in `src/components/effects/GhostCursor.tsx`.
- Uses Three.js canvas overlay with shader simulation for an ethereal smoke trail.
- Configured with `pointer-events: none`, `mixBlendMode: "screen"`, and `zIndex: 9999`.

---

## 7. Verification Checklist

Before completing any feature:
1. Run `npx tsc --noEmit` inside `portfolio/` — must return 0 errors.
2. Ensure no hardcoded hex colors are used (use `var(--color-*)`).
3. Ensure no server components have event handlers (`onClick`, `onMouseOver`, etc.).
4. Verify that any new project facts are added to `src/content/projects.ts` (Knowledge Layer), not hardcoded in the LLM prompt.
