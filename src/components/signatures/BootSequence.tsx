"use client";

// BootSequence — Hero signature (Design Doc §4.1 + Tech-Doc §5.5).
//
// - Plays once per SESSION (sessionStorage, not localStorage) so
//   it replays on a fresh browser visit the next day.
// - Click-anywhere skip affordance.
// - prefers-reduced-motion: skips straight to idle hero state.
// - Renders as a fixed overlay; hero content loads underneath it.
// - Exported as default so page.tsx can drop it in as a portal.

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const LINES = [
  "Initializing core systems",
  "Loading experience modules",
  "Connecting guide interface",
  "Calibrating AI character",
  "All systems nominal.",
] as const;

const LINE_MS = 220;
const WELCOME_DELAY = LINES.length * LINE_MS + 300;
const AUTO_DISMISS = WELCOME_DELAY + 950;

export default function BootSequence() {
  const prefersReduced = useReducedMotion();

  // Avoid SSR/hydration mismatch — never read sessionStorage on server.
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [doneLines, setDoneLines] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    timers.current.forEach(clearTimeout);
    sessionStorage.setItem("boot-done", "1");
    setExiting(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!prefersReduced && !sessionStorage.getItem("boot-done")) {
      setShow(true);
    }
  }, [prefersReduced]);

  useEffect(() => {
    if (!show) return;
    const t: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((_, i) =>
      t.push(setTimeout(() => setDoneLines(i + 1), (i + 1) * LINE_MS))
    );
    t.push(setTimeout(() => setShowWelcome(true), WELCOME_DELAY));
    t.push(setTimeout(dismiss, AUTO_DISMISS));

    timers.current = t;
    return () => t.forEach(clearTimeout);
  }, [show, dismiss]);

  if (!mounted || !show) return null;

  return (
    <AnimatePresence onExitComplete={() => setShow(false)}>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
          onClick={dismiss}
          role="status"
          aria-label="Portfolio initializing — click to skip"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "var(--color-bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "520px", padding: "0 1.5rem" }}
          >
            {/* ── Logotype ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <span
                className="text-gradient"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.02em",
                }}
              >
                ◈ PORTFOLIO.SYS
              </span>
            </motion.div>

            {/* ── Divider ──────────────────────────────── */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: "1px",
                background: "var(--gradient-accent)",
                transformOrigin: "left",
                borderRadius: "var(--radius-full)",
                marginBottom: "1.75rem",
              }}
            />

            {/* ── Boot lines ───────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
                marginBottom: "1.75rem",
                minHeight: `${LINES.length * 1.85}rem`,
              }}
            >
              {LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={i < doneLines ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    <span
                      style={{
                        color: "var(--color-accent)",
                        marginRight: "0.5rem",
                      }}
                    >
                      {">"}
                    </span>
                    {line}
                  </span>

                  {i < doneLines && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-accent-teal)",
                        letterSpacing: "0.08em",
                        marginLeft: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      [ OK ]
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ── Progress bar ─────────────────────────── */}
            <div
              style={{
                height: "2px",
                background: "var(--color-bg-subtle)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                marginBottom: "1.75rem",
              }}
            >
              <motion.div
                style={{ height: "100%", background: "var(--gradient-accent)" }}
                initial={{ width: "0%" }}
                animate={{
                  width: `${(doneLines / LINES.length) * 100}%`,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>

            {/* ── WELCOME ──────────────────────────────── */}
            <div style={{ minHeight: "3.25rem" }}>
              <AnimatePresence>
                {showWelcome && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="text-gradient"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "var(--text-3xl)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    WELCOME.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Skip hint ────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              position: "absolute",
              bottom: "2.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-dim)",
              letterSpacing: "0.14em",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            — click anywhere to skip —
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
