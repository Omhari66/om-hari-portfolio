"use client";

// SkillGroupAnimated — Skills section signature (Design Doc §4.5 + Tech-Doc §5.5).
//
// Signature: icons "light up" one by one as the group enters the viewport.
//   - The group card itself slides up on scroll.
//   - Each skill item fades + slides in staggered at 75ms intervals.
//   - The icon placeholder border and glow animate to accent color on in-view.
//
// Props: group data + accent color come from Skills.tsx (server component),
// keeping grouping logic in the content file per Tech-Doc §5.5.

import { motion, useReducedMotion } from "framer-motion";
import type { SkillGroup } from "@/types";

interface Props {
  group: SkillGroup;
  accentColor: string;
}

const itemContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function SkillGroupAnimated({ group, accentColor }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      {/* Category heading */}
      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: accentColor,
          marginBottom: "1.5rem",
        }}
      >
        {group.category}
      </h3>

      {/* Skill items — staggered light-up */}
      <motion.ul
        variants={prefersReduced ? undefined : itemContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {group.items.map((skill) => (
          <motion.li
            key={skill.name}
            variants={prefersReduced ? undefined : itemVariants}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            {/* Icon — lights up (border + glow) when scrolled into view */}
            <motion.div
              aria-hidden="true"
              whileInView={
                prefersReduced
                  ? {}
                  : {
                      borderColor: accentColor,
                      background: `color-mix(in srgb, ${accentColor} 10%, var(--color-bg-subtle))`,
                      boxShadow: `0 0 10px color-mix(in srgb, ${accentColor} 35%, transparent)`,
                    }
              }
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                color: accentColor,
                // Smooth color transition
                transition: "border-color 0.4s, background 0.4s, box-shadow 0.4s",
              }}
            >
              {skill.name.slice(0, 2).toUpperCase()}
            </motion.div>

            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
              }}
            >
              {skill.name}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
