"use client";

/**
 * About — Portal Reveal
 *
 * Animation sequence:
 * 1. "The Person / behind the code." heading appears
 * 2. On scroll → two black panels part LEFT and RIGHT
 *    uncovering the portrait behind (portal opening effect)
 * 3. Bio, offbeat detail, tags stagger in after reveal
 *
 * Every portal value is bound to scrollYProgress so it
 * plays in reverse when the reader scrolls back up.
 */

import { useRef, useEffect, useState } from "react";
import about from "@/content/about";
import { AboutBriefing } from "@/components/signatures/AboutBriefing";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

// ── Scroll-reveal wrapper (fires once) ───────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Portal portrait — panels part on scroll ───────────────────────────
function PortalPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.15"],   // starts opening early, fully open by 15% from top
  });

  // Panels travel outward — each goes past 100% so they clear the frame
  const leftX  = useTransform(scrollYProgress, [0, 1], ["0%",  "-110%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%",   "110%"]);

  // Photo scale settles from slight overscale to 1
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.0]);

  // Two accent dots travel toward opposite corners
  const dotLeftX  = useTransform(scrollYProgress, [0, 1], ["50%", "-5%"]);
  const dotRightX = useTransform(scrollYProgress, [0, 1], ["50%", "105%"]);

  // Springs make motion feel physical
  const leftXS  = useSpring(leftX,  { stiffness: 80, damping: 22 });
  const rightXS = useSpring(rightX, { stiffness: 80, damping: 22 });
  const scaleS  = useSpring(imgScale, { stiffness: 60, damping: 20 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        overflow: "hidden",
        isolation: "isolate",
        background: "#000",
      }}
    >
      {/* ── Layer 1: portrait ──────────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          scale: scaleS,
          transformOrigin: "center center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/portrait.jpg"
          alt="Om Hari — portrait"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            display: "block",
          }}
          onError={(e) => {
            // Graceful placeholder until portrait is added
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
          }}
        />

        {/* Warm duotone wash */}
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,217,177,0.08) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        {/* Radial edge veil */}
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "radial-gradient(ellipse 90% 88% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </motion.div>

      {/* ── Layer 2: two black panels — parting on scroll ─────── */}
      {/* Left panel */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          left: 0,
          width: "52%",              // slightly over half so they overlap at centre
          background: "#000",
          zIndex: 2,
          x: leftXS,
          transformOrigin: "left center",
        }}
      />
      {/* Right panel */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          right: 0,
          width: "52%",
          background: "#000",
          zIndex: 2,
          x: rightXS,
          transformOrigin: "right center",
        }}
      />

      {/* ── Layer 3: two accent dots travelling to corners ──── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "48%", left: 0,
          zIndex: 3,
          x: dotLeftX,
          width: "6px", height: "6px",
          borderRadius: "50%",
          background: "rgba(108,99,255,0.9)",
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "52%", left: 0,
          zIndex: 3,
          x: dotRightX,
          width: "4px", height: "4px",
          borderRadius: "50%",
          background: "rgba(0,217,177,0.9)",
        }}
      />

      {/* ── Corner hairline accents ────────────────────────── */}
      <div aria-hidden="true" style={{ position:"absolute", top:0, left:0, width:"20px", height:"1px", background:"rgba(108,99,255,0.4)", zIndex:4 }} />
      <div aria-hidden="true" style={{ position:"absolute", top:0, left:0, width:"1px", height:"20px", background:"rgba(108,99,255,0.4)", zIndex:4 }} />
      <div aria-hidden="true" style={{ position:"absolute", bottom:0, right:0, width:"20px", height:"1px", background:"rgba(108,99,255,0.4)", zIndex:4 }} />
      <div aria-hidden="true" style={{ position:"absolute", bottom:0, right:0, width:"1px", height:"20px", background:"rgba(108,99,255,0.4)", zIndex:4 }} />
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────
export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        position: "relative",
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
        paddingBottom: "clamp(6rem, 14vw, 10rem)",
      }}
    >
      {/* Vertical grid hairline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, bottom: 0, left: "56px",
          width: "1px", background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          paddingLeft: "clamp(2rem, 6vw, 5rem)",
          paddingRight: "clamp(2rem, 6vw, 5rem)",
          paddingTop: "clamp(5rem, 10vw, 8rem)",
        }}
      >
        {/* ── Eyebrow ──────────────────────────────────────────── */}
        <Reveal>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.5rem" }}>
            {/* Outlined index numeral */}
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.07)",
                userSelect: "none",
                marginRight: "0.5rem",
              }}
            >
              01
            </span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.3rem" }}>
                <div style={{ width:"16px", height:"1px", background:"var(--color-accent)" }} />
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(108,99,255,0.8)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
                  About
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Main heading ─────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <h2
            id="about-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              color: "white",
            }}
          >
            <span style={{ display:"block", color:"rgba(255,255,255,0.9)" }}>
              The Person
            </span>
            <span
              style={{
                display:"block",
                color:"transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                fontWeight: 800,
              }}
            >
              behind the code.
            </span>
          </h2>
        </Reveal>

        {/* ── Two-column: portal + bio ──────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(3rem, 6vw, 5rem)",
            alignItems: "start",
          }}
        >
          {/* LEFT: portrait with portal reveal */}
          <PortalPortrait />

          {/* RIGHT: bio content */}
          <div style={{ paddingTop: "1rem" }}>

            {/* Statement */}
            <Reveal delay={0.15}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 2.4vw, 2rem)",
                  fontWeight: 500,
                  lineHeight: 1.25,
                  letterSpacing: "-0.015em",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: "2rem",
                  maxWidth: "26ch",
                }}
              >
                Building things that feel{" "}
                <span style={{ color:"var(--color-accent)" }}>alive</span>
                {" "}at the edge of design and engineering.
              </p>
            </Reveal>

            {/* Bio lines */}
            <Reveal delay={0.22}>
              <AboutBriefing lines={about.bio} />
            </Reveal>

            {/* Offbeat detail */}
            <Reveal delay={0.3}>
              <div
                style={{
                  marginTop: "2rem",
                  padding: "0.9rem 1.1rem",
                  borderLeft: "1px solid var(--color-accent-teal)",
                  background: "rgba(0,217,177,0.03)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--color-accent-teal)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "0.4rem",
                  }}
                >
                  One more thing
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "rgba(255,255,255,0.48)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {about.offbeatDetail}
                </p>
              </div>
            </Reveal>

            {/* Tags */}
            <Reveal delay={0.38}>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  marginTop: "1.75rem",
                }}
              >
                {["Available for work", "Open to collaborate", "Remote-friendly"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "100px",
                      padding: "0.28rem 0.7rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Location + years */}
            <Reveal delay={0.44}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {about.location && (
                  <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color:"var(--color-accent-teal)" }} aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.06em" }}>
                      {about.location}
                    </span>
                  </div>
                )}

                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"rgba(108,99,255,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.15rem" }}>
                    Years XP
                  </div>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.6rem", color:"white", lineHeight:1 }}>
                    5+
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
