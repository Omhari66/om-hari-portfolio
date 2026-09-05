"use client";

// GuideWidget — main orchestrator (Tech-Doc §5.5 + Design Doc §4.1).
//
// State machine:
//   idle → listening (input focused / orb clicked)
//   listening → thinking (submit fired)
//   thinking → speaking (intent resolved + section scrolled)
//   speaking → idle (auto after REPLY_DURATION ms)
//   * → signoff (portfolio:signoff event from GuideSignoff.tsx)
//
// Wiring strategy (light coupling via data-attributes):
//   - Hero's <input data-guide-input> → attached via addEventListener
//   - Hero's <button id="hero-submit-btn"> → same
//   - Hero's chips [data-prompt] → same
//   - GuideSignoff fires window CustomEvent 'portfolio:signoff'
//
// Own mini input: clicking the orb expands a compact ask bar so
// visitors can ask questions from *any* section, not just the hero.
//
// Respects prefers-reduced-motion on GuideOrb; widget itself
// always appears (visibility, not motion, is reduced).

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { GuideOrb, type GuideState } from "./GuideOrb";
import { GuideChat } from "./GuideChat";
import { routeIntent, scrollToSection } from "@/lib/guideIntents";

// Timing constants
const THINKING_MS = 420;  // artificial thinking pause before scroll+reply
const REPLY_MS = 3800;    // how long the reply bubble stays visible
const BOOT_DELAY_MS = 2600; // wait for BootSequence to exit before appearing

export default function GuideWidget() {
  const prefersReduced = useReducedMotion();

  // ── Appearance delay (synced with BootSequence) ───────────────────
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If this isn't a fresh session, show the widget immediately
    if (sessionStorage.getItem("boot-done")) {
      setReady(true);
    } else {
      const t = setTimeout(() => setReady(true), BOOT_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, []);

  // ── State machine ────────────────────────────────────────────────
  const [guideState, setGuideState] = useState<GuideState>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReplyTimer = useCallback(() => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  const showReply = useCallback(
    (message: string) => {
      clearReplyTimer();
      setReply(message);
      setGuideState("speaking");
      replyTimer.current = setTimeout(() => {
        setGuideState("idle");
        setReply(null);
        setIsOpen(false);
      }, REPLY_MS);
    },
    [clearReplyTimer]
  );

  // ── Intent handler ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;

      setGuideState("thinking");
      setInputValue("");

      // Clear the hero input field if it was the source
      const heroInput = document.querySelector<HTMLInputElement>(
        "[data-guide-input]"
      );
      if (heroInput) heroInput.value = "";

      setTimeout(() => {
        const intent = routeIntent(input);
        if (intent.section) scrollToSection(intent.section);
        showReply(intent.reply);
      }, THINKING_MS);
    },
    [showReply]
  );

  // ── Wire Hero DOM elements ───────────────────────────────────────
  useEffect(() => {
    const heroInput =
      document.querySelector<HTMLInputElement>("[data-guide-input]");
    const heroSubmit = document.querySelector<HTMLButtonElement>(
      "#hero-submit-btn"
    );

    const onFocus = () => setGuideState("listening");
    // Small delay on blur so chip clicks can register first
    const onBlur = () =>
      setTimeout(
        () => setGuideState((s) => (s === "listening" ? "idle" : s)),
        150
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && heroInput) handleSubmit(heroInput.value);
    };
    const onSubmitClick = () => {
      if (heroInput) handleSubmit(heroInput.value);
    };

    heroInput?.addEventListener("focus", onFocus);
    heroInput?.addEventListener("blur", onBlur);
    heroInput?.addEventListener("keydown", onKeyDown);
    heroSubmit?.addEventListener("click", onSubmitClick);

    // Prompt chips
    const chips = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-prompt]")
    );
    const chipHandlers = chips.map((chip) => {
      const handler = () => handleSubmit(chip.dataset.prompt ?? "");
      chip.addEventListener("click", handler);
      return { chip, handler };
    });

    // GuideSignoff event (fired by GuideSignoff.tsx when Contact enters view)
    const onSignoff = () => {
      setGuideState("signoff");
      setTimeout(() => setGuideState("idle"), 1600);
    };
    window.addEventListener("portfolio:signoff", onSignoff);

    return () => {
      heroInput?.removeEventListener("focus", onFocus);
      heroInput?.removeEventListener("blur", onBlur);
      heroInput?.removeEventListener("keydown", onKeyDown);
      heroSubmit?.removeEventListener("click", onSubmitClick);
      chipHandlers.forEach(({ chip, handler }) =>
        chip.removeEventListener("click", handler)
      );
      window.removeEventListener("portfolio:signoff", onSignoff);
    };
  }, [handleSubmit]);

  // ── Orb click: toggle open/close ────────────────────────────────
  const handleOrbClick = useCallback(() => {
    // Don't interrupt thinking/speaking
    if (guideState === "thinking" || guideState === "speaking") return;
    setIsOpen((prev) => {
      const next = !prev;
      setGuideState(next ? "listening" : "idle");
      return next;
    });
  }, [guideState]);

  if (!ready) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="guide-widget"
        className="guide-widget-root"
        initial={
          prefersReduced ? {} : { opacity: 0, scale: 0.7, y: 24 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
        }}
        style={{
          position: "fixed",
          bottom: "1.75rem",
          right: "1.75rem",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.65rem",
          pointerEvents: "none",
        }}
      >
        {/* Orb + chat bubble — always visible */}
        <div style={{ position: "relative", pointerEvents: "auto" }}>
          <GuideChat message={reply} visible={guideState === "speaking"} />
          <GuideOrb state={guideState} isOpen={isOpen} onClick={handleOrbClick} />
        </div>

        {/* ── Mini input bar ────────────────────────────────────────
             Expands below the orb when clicked.
             Separate from the Hero input — works from any section.    */}
        <AnimatePresence>
          {isOpen && guideState !== "speaking" && (
            <motion.div
              key="guide-input-bar"
              className="guide-mini-input-bar"
              initial={prefersReduced ? {} : { opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                padding: "0.5rem 0.5rem 0.5rem 1rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.06)",
                width: "260px",
              }}
            >
              <input
                id="guide-widget-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(inputValue);
                  if (e.key === "Escape") {
                    setIsOpen(false);
                    setGuideState("idle");
                  }
                }}
                placeholder="Ask me anything…"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                aria-label="Ask the guide a question"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                  minWidth: 0,
                }}
              />
              <button
                type="button"
                aria-label="Submit question to guide"
                onClick={() => handleSubmit(inputValue)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-accent)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip: shown only in idle+closed state as a nudge */}
        <AnimatePresence>
          {guideState === "idle" && !isOpen && (
            <motion.p
              key="guide-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 4, duration: 1 }}
              style={{
                pointerEvents: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--color-text-dim)",
                letterSpacing: "0.08em",
                textAlign: "right",
                userSelect: "none",
              }}
            >
              tap to ask
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
