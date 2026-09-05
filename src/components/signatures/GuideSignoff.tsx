"use client";

// GuideSignoff — Contact section signature (Design Doc §4.6 + Tech-Doc §5.5).
//
// Signature: a dramatic section-level entrance when #contact enters the viewport.
//   - Content reveals with a slow, confident upward sweep (not the generic
//     scroll-fade used elsewhere — this one is heavier and more final).
//   - Dispatches a 'portfolio:signoff' CustomEvent so the GuideWidget
//     (Step 5) can play the guide's wave/sign-off animation automatically.
//     Until Step 5 is built, this event fires harmlessly into the void.
//
// Pattern matches AboutBriefing: IntersectionObserver-driven, once only.
// Wraps any children — Contact.tsx passes its content as server-rendered JSX.

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

export function GuideSignoff({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const prefersReduced = useReducedMotion();

  // Notify the GuideWidget when contact comes into view.
  // Step 5 adds the listener on window; this fires harmlessly until then.
  useEffect(() => {
    if (!inView) return;
    window.dispatchEvent(new CustomEvent("portfolio:signoff"));
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      // Heavier, slower entrance — more "final" than the standard scroll-fade
      initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
