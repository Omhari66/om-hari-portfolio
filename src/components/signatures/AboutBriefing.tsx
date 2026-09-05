"use client";

// AboutBriefing — About section signature (Design Doc §4.2 + Tech-Doc §5.5).
//
// Each bio line reveals individually on scroll, staggered ~170ms apart,
// like a guide briefing the visitor. Uses Framer Motion whileInView
// (IntersectionObserver under the hood) so the animation triggers once
// as the section scrolls into view — not on page load.
//
// Cap: 4-5 lines max per Tech-Doc §5.5.

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  lines: string[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.17,
      delayChildren: 0.08,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function AboutBriefing({ lines }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? undefined : containerVariants}
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        marginBottom: "2.5rem",
      }}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          variants={prefersReduced ? undefined : lineVariants}
          data-briefing-line={i}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
            color:
              i === 0
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            lineHeight: 1.65,
            fontWeight: i === 0 ? 500 : 400,
          }}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  );
}
