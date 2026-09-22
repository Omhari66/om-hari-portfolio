# Project Master Context & Architecture Reference

> **Quick link:** The root copy of this document is maintained at [`../PROJECT_CONTEXT.md`](file:///c:/Users/OMHARI/Development/Projects/Full-Stack/PF/PROJECT_CONTEXT.md) and the agent auto-injected rules are at [`../AGENTS.md`](file:///c:/Users/OMHARI/Development/Projects/Full-Stack/PF/AGENTS.md).

---

## 1. Quick Project Overview

- **Owner / Developer:** Om Hari — AI/ML Engineer & Full-Stack Developer (Computer Science student at Lovely Professional University).
- **Project Type:** Next.js 16 Interactive Developer Portfolio with Ambient Voice AI, Generative UI Stage, and Futuristic Dark Aesthetics.
- **Core Premise:** The portfolio is not just a static showcase or a simple chatbot. It features a tool-driven AI Agent that answers questions aloud using Web Speech API while dynamically controlling a visual stage (`DynamicStage`) on the screen with real architecture diagrams, engineering decisions, and code evidence.
- **Working Directory:** `c:\Users\OMHARI\Development\Projects\Full-Stack\PF\portfolio\`
- **Dev Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Type Checking:** `npx tsc --noEmit` (Run inside `portfolio/`; must pass with 0 errors)

---

## 2. Locked Tech Stack & Exact Versions

| Layer | Technology | Exact Version | Key Details & Usage |
|---|---|---|---|
| **Framework** | Next.js | `16.3.3` | App Router (`src/app/`), Turbopack enabled |
| **Language** | TypeScript | `^5.0` | Strict mode enabled |
| **Runtime / UI** | React / React-DOM | `19.2.8` | Server components by default, client components when state/hooks needed |
| **Styling** | Tailwind CSS v4 | `^4.0` | `@tailwindcss/postcss`; layout utilities only, colors via CSS variables |
| **Animation** | GSAP + `@gsap/react` | `3.15.0` / `2.1.2` | Core animation engine (`ScrollTrigger`, entrance/exit choreographies) |
| **3D / Canvas FX** | Three.js + `@types/three` | `0.185.1` | `GhostCursor` fluid smoky cursor trail |
| **Component Motion** | Framer Motion | `13.1.1` | Isolated micro-interactions & signature animations |
| **AI SDK** | Vercel AI SDK (`ai`) | `^7.0.84` | `generateText`, `tool` definitions |
| **AI Provider** | `@ai-sdk/google` | `^4.0.57` | Google AI Studio provider |
| **AI Model** | Gemini 3.8 Flash | `gemini-3.8-flash` | Ultra-fast responses with multi-step tool calling |
| **Validation** | Zod | `^4.6.5` | Input parameter validation for AI agent tools |
| **Voice / Audio** | Web Speech API | Browser Native | `SpeechRecognition` / `webkitSpeechRecognition` + `SpeechSynthesis` |
| **Typography** | `next/font/google` | Self-hosted | Space Grotesk (display), Inter (body), JetBrains Mono (labels) |

---

## 3. Core Architectural Principles

### 3.1 The Knowledge Layer is the Source of Truth
- The LLM does **NOT** invent project data, technologies, or architectures.
- All factual data lives in `src/content/`:
  - `projects.ts` (detailed architecture pipelines, technical decisions, trade-offs, evidence files)
  - `about.ts` (tagline, bio lines, offbeat detail, location)
  - `experience.ts` (work history, roles, summaries)
  - `skills.ts` (grouped technical skills and competencies)
- The LLM tools (`show_project_architecture`, `show_technical_decision`, `show_evidence`) **validate** requests against `src/content/projects.ts` before returning structured data.

### 3.2 Decoupled State Machine Architecture
- The AI Agent never manipulates DOM or React components directly.
- The pipeline flows strictly through a state machine:
```
User speaks
  ↓ (Web Speech Recognition)
AmbientVoiceOverlay
  ↓ POST /api/chat { messages: [...] }
Gemini 2.0 Flash + Tools (route.ts)
  ↓ validates against src/content/projects.ts
Returns JSON: { text: "...", toolResults: [...] }
  ↓
AmbientVoiceOverlay
  ├─ 1. dispatch(PortfolioEvent) → Portfolio Reducer (state.tsx)
  │      ↓ updates PortfolioState
  │    DynamicStage re-renders with viewData
  └─ 2. speak(text) → SpeechSynthesis plays voice aloud
```

### 3.3 Server vs Client Component Rules
- **Server Components (Default):** Faster rendering, zero client JS bundle. Do NOT add `"use client"` or event handlers (`onClick`, `onMouseOver`, etc.) to these files (`About.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`).
- **Client Components (`"use client"`):** Must be used for components with hooks, state, GSAP, Three.js, browser APIs, or event handlers (`Navbar.tsx`, `Hero.tsx`, `Contact.tsx`, `DynamicStage.tsx`, `AmbientVoiceOverlay.tsx`, `BootSequence.tsx`, `GhostCursor.tsx`, signatures).

---

## 4. Design System & Tokens (Locked)

All design tokens are defined in **`src/app/globals.css`** under `:root`. **Never hardcode hex values in component styles.** Always use `var(--color-...)`.

### 4.1 Color Tokens
```css
/* Backgrounds */
--color-bg: #000000;              /* Pure black */
--color-bg-elevated: #0a0a0a;     /* Cards, dialogs, stage modals */
--color-bg-subtle: #111111;       /* Secondary containers */
--color-border: #1a1a1a;          /* Standard divider lines */

/* Accents */
--color-accent: #6C63FF;          /* Electric violet — PRIMARY brand color */
--color-accent-glow: #8B5CF6;     /* Secondary violet glow */
--color-accent-cyan: #06B6D4;     /* Cyan accent / Voice listening status */
--color-accent-teal: #00D9B1;     /* Success / secondary highlights */
```

### 4.2 Typography Tokens
```css
--font-display: var(--font-space-grotesk);  /* Section headings, hero titles */
--font-body: var(--font-inter);             /* Body copy, descriptions */
--font-mono: var(--font-jetbrains-mono);    /* Numbers, tags, code, labels */
```

---

## 5. Verified Solved Bugs & Gotchas (DO NOT REPEAT)

| Issue | Resolution |
|---|---|
| Model 404 / NOT_FOUND | Use `gemini-3.8-flash` (or `gemini-3.6-flash`). |
| API Key Format | Google AI Studio keys **must start with `AIza`**. Keys starting with `AQ.` are invalid. |
| Streaming vs JSON | `/api/chat` returns `{ text, toolResults }` JSON. This guarantees voice synthesis and stage rendering stay synchronized without streaming packet race conditions. |
| `maxSteps` SDK type error | Use `// @ts-ignore` before `maxSteps: 3` in `generateText`. |
| Autoplay Audio Policy | Browsers require a user gesture. Clicking the AI Core orb or "Initialize AI" satisfies the audio policy. |
