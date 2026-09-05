"use client";

// GuideOrb — the visual abstract energy form (Design Doc: Option B).
//
// Layers (outside → in):
//   1. Ambient glow     — blurred radial gradient, state-driven opacity
//   2. 3-D orbit rings  — CSS perspective + rotateX/rotateZ trick
//   3. Wisp particles   — 3 orbiting dots at different speeds/colors
//   4. Sphere body      — layered radial gradients, Framer breathe/pulse
//   5. Specular highlight — top-left lens flare
//
// Ring speed is controlled via --ring-dur CSS variable so changing
// state never triggers a Framer re-animation (purely CSS).
//
// All animations are disabled for prefers-reduced-motion.

import { motion, useReducedMotion } from "framer-motion";

export type GuideState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "signoff";

interface Props {
  state: GuideState;
  isOpen: boolean;
  onClick: () => void;
}

// Outer-container scale per state (Framer Motion controlled)
const OUTER_SCALE: Record<GuideState, number> = {
  idle: 1,
  listening: 1.1,
  thinking: 1.04,
  speaking: 1.07,
  signoff: 1.26,
};

// Ambient glow opacity per state
const GLOW_OPACITY: Record<GuideState, number> = {
  idle: 0.22,
  listening: 0.45,
  thinking: 0.38,
  speaking: 0.65,
  signoff: 0.9,
};

// CSS --ring-dur value per state (drives ring animation speed)
const RING_DUR: Record<GuideState, string> = {
  idle: "14s",
  listening: "9s",
  thinking: "3.2s",
  speaking: "7s",
  signoff: "3.8s",
};

export function GuideOrb({ state, isOpen, onClick }: Props) {
  const prefersReduced = useReducedMotion();
  const ringDur = RING_DUR[state];

  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={isOpen ? "Close guide" : "Open guide — ask me anything"}
      aria-expanded={isOpen}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      style={{
        position: "relative",
        width: "64px",
        height: "64px",
        cursor: "pointer",
        flexShrink: 0,
        userSelect: "none",
      }}
      animate={prefersReduced ? {} : { scale: OUTER_SCALE[state] }}
      transition={{
        duration: 0.45,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      }}
      whileHover={
        prefersReduced ? {} : { scale: OUTER_SCALE[state] * 1.07 }
      }
    >
      {/* ── 1. Ambient glow ───────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        animate={prefersReduced ? {} : { opacity: GLOW_OPACITY[state] }}
        transition={{ duration: 0.55 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(108,99,255,0.65) 0%, rgba(6,182,212,0.28) 45%, transparent 70%)",
          filter: "blur(18px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── 2. 3-D orbit rings ────────────────────────────── */}
      {!prefersReduced && (
        <div
          className="guide-orb-rings"
          aria-hidden="true"
          style={{ "--ring-dur": ringDur } as React.CSSProperties}
        >
          <div className="guide-ring guide-ring-cw" />
          <div className="guide-ring guide-ring-ccw" />
        </div>
      )}

      {/* ── 3. Wisp particles ────────────────────────────── */}
      {!prefersReduced && (
        <>
          <div className="guide-wisp guide-wisp-1" aria-hidden="true" />
          <div className="guide-wisp guide-wisp-2" aria-hidden="true" />
          <div className="guide-wisp guide-wisp-3" aria-hidden="true" />
        </>
      )}

      {/* ── 4. Sphere body ───────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReduced
            ? {}
            : state === "idle"
            ? { scale: [1, 1.045, 1] }
            : state === "thinking"
            ? { scale: [1, 1.07, 0.96, 1.05, 1], rotate: [0, 4, -4, 2, 0] }
            : state === "signoff"
            ? { scale: [1, 1.3, 1.15, 1.28, 1], rotate: [0, -8, 8, -3, 0] }
            : { scale: 1 }
        }
        transition={
          state === "idle"
            ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            : state === "thinking"
            ? { duration: 1.1, repeat: Infinity }
            : state === "signoff"
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 0.35 }
        }
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 35% 30%, rgba(205,165,255,0.95) 0%, rgba(108,99,255,0.75) 27%, rgba(6,182,212,0.42) 60%, rgba(10,11,15,0.95) 84%)",
          boxShadow:
            "inset 0 0 22px rgba(108,99,255,0.35), inset -5px -5px 14px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.13)",
        }}
      >
        {/* ── 5. Specular highlight ─────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "13%",
            left: "15%",
            width: "33%",
            height: "28%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(3px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
