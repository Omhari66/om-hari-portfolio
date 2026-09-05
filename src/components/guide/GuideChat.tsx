"use client";

// GuideChat — the floating reply bubble above the guide orb.
// AnimatePresence handles smooth enter/exit.
// Bubble tail points down-right toward the orb.

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  message: string | null;
  visible: boolean;
}

export function GuideChat({ message, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          key="guide-chat"
          initial={{ opacity: 0, y: 8, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{
            duration: 0.28,
            ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
          }}
          role="status"
          aria-live="polite"
          aria-label={`Guide says: ${message}`}
          style={{
            position: "absolute",
            // Sit above the orb with a small gap
            bottom: "calc(100% + 0.9rem)",
            right: 0,
            maxWidth: "260px",
            minWidth: "120px",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            // Chat bubble shape: flat bottom-right corner points toward orb
            borderRadius: "14px 14px 4px 14px",
            padding: "0.7rem 1rem",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(108,99,255,0.07)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Gradient accent line at top */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              borderRadius: "14px 14px 0 0",
              background: "var(--gradient-accent)",
            }}
          />

          {/* "guide" label */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "var(--color-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "0.3rem",
            }}
          >
            guide
          </span>

          {/* Reply text */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-primary)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
