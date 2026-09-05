"use client";

// ExperienceTimeline — Experience section signature (Design Doc §4.3 + Tech-Doc §5.5).
//
// Signature moves:
//   1. The circuit-trace spine DRAWS itself top-to-bottom via scaleY animation.
//   2. Entry cards STAGGER in from the left as the timeline enters the viewport.
//   3. Each role dot SCALES in with a spring for a "power on" feel.
//
// Proportional heights: getSegmentWeight() maps real role duration to minHeight,
// so longer roles visually dominate shorter ones — the layout encodes real info.
//
// Self-contained: imports its own data so Experience.tsx only renders the shell.

import { motion, useReducedMotion } from "framer-motion";
import experience from "@/content/experience";
import { getSegmentWeight } from "@/types";

const totalWeight = experience.reduce(
  (acc, e) => acc + getSegmentWeight(e),
  0
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.35 },
  },
};

const entryVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function ExperienceTimeline() {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* ── Spine column ──────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ width: "48px", flexShrink: 0, position: "relative" }}
      >
        {/* The circuit trace draws itself */}
        <motion.div
          initial={prefersReduced ? { scaleY: 1 } : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: "15px",
            top: "8px",
            bottom: "8px",
            width: "2px",
            background:
              "linear-gradient(to bottom, var(--color-accent) 0%, var(--color-accent-cyan) 50%, var(--color-border) 100%)",
            borderRadius: "var(--radius-full)",
            transformOrigin: "top",
          }}
        />
      </div>

      {/* ── Entries column ────────────────────────────── */}
      <motion.div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {experience.map((entry, idx) => {
          const weight = getSegmentWeight(entry);
          const minH = Math.max(
            140,
            Math.round((weight / totalWeight) * 780)
          );
          const isPresent = entry.end === "present";

          return (
            <motion.div
              key={entry.id}
              variants={prefersReduced ? undefined : entryVariants}
              data-entry-id={entry.id}
              style={{
                position: "relative",
                minHeight: `${minH}px`,
                paddingBottom: idx < experience.length - 1 ? "3rem" : "0",
              }}
            >
              {/* Role dot */}
              <motion.div
                aria-hidden="true"
                initial={prefersReduced ? { scale: 1 } : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 350,
                  damping: 18,
                }}
                style={{
                  position: "absolute",
                  left: "-40px",
                  top: "8px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: isPresent
                    ? "var(--color-accent)"
                    : "var(--color-bg-elevated)",
                  border: `2px solid ${
                    isPresent ? "var(--color-accent)" : "var(--color-border)"
                  }`,
                  boxShadow: isPresent
                    ? "0 0 12px rgba(108,99,255,0.55), 0 0 28px rgba(108,99,255,0.2)"
                    : "none",
                  zIndex: 1,
                }}
              />

              {/* Entry card */}
              <motion.div
                className="card"
                whileHover={
                  prefersReduced ? {} : { y: -2, transition: { duration: 0.2 } }
                }
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "var(--text-xl)",
                        letterSpacing: "-0.02em",
                        color: "var(--color-text-primary)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {entry.role}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-accent)",
                        fontWeight: 500,
                      }}
                    >
                      {entry.org}
                    </p>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-dim)",
                      letterSpacing: "0.06em",
                      background: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-full)",
                      padding: "0.25rem 0.75rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.start.replace("-", " / ")} →{" "}
                    {entry.end === "present"
                      ? "now"
                      : entry.end.replace("-", " / ")}
                  </span>
                </div>

                {/* Summary */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.65,
                    marginBottom: "1.25rem",
                  }}
                >
                  {entry.summary}
                </p>

                {/* Highlights */}
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.55rem",
                    listStyle: "none",
                  }}
                >
                  {entry.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.65rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          color: "var(--color-accent-teal)",
                          flexShrink: 0,
                          marginTop: "0.1em",
                        }}
                      >
                        ▸
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
