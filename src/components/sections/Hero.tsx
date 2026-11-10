"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { RoboticAvatar } from "@/components/effects/RoboticAvatar";
import { AmbientVoiceOverlay } from "@/components/guide/AmbientVoiceOverlay";
import { VerticalMagnificationDock } from "@/components/ui/VerticalMagnificationDock";

gsap.registerPlugin(useGSAP);

const SOCIAL_LINKS = [
  { label: "GH", fullLabel: "GitHub",    href: "https://github.com/Omhari66" },
  { label: "LI", fullLabel: "LinkedIn",  href: "https://www.linkedin.com/in/om66/" },
  { label: "IG", fullLabel: "Instagram", href: "https://www.instagram.com/om_hari_shukla/" },
  { label: "X",  fullLabel: "Twitter/X", href: "https://x.com/OmhariShukla4" },
  { label: "BG", fullLabel: "Blog",      href: "https://learnerslogbyom.blogspot.com/" },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isAiActive, setIsAiActive] = useState(false);
  const { voicesLoaded, isSpeaking } = useVoiceAssistant();

  // Initial cinematic load animation
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate the huge text lines individually
    const lines = textRef.current?.querySelectorAll('.hero-line');
    if (lines) {
      tl.fromTo(lines, 
        { y: 100, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );
    }
    
    // Fade in the tagline and UI
    tl.fromTo('.hero-fade', 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" }, 
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <>
      <section
        id="hero"
        ref={containerRef}
        aria-label="Introduction"
        className="hero-container-grid"
      >
        {/* Thin vertical grid lines (hidden on mobile) */}
        <div aria-hidden="true" className="hero-vertical-line-1" />
        <div aria-hidden="true" className="hero-vertical-line-2" />

        {/* ── LEFT COLUMN: social links (Desktop) ──────── */}
        <div
          className="hero-fade hero-social-dock-desktop"
        >
          <VerticalMagnificationDock
            items={SOCIAL_LINKS}
            distance={110}
            baseItemSize={34}
            magnification={54}
            spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
          />
        </div>

        {/* ── MIDDLE COLUMN: typography ─────────────────────── */}
        <div 
          className="hero-content-col"
        >
          {/* Eyebrow */}
          <div className="hero-fade" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ height: "1px", width: "22px", background: "var(--color-accent-teal)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Voice-First Portfolio
            </span>
          </div>

          {/* Huge Serif Typography (Mina Massoud style) */}
          <div ref={textRef} style={{ fontFamily: "serif", textTransform: "uppercase", lineHeight: 0.9 }}>
            <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
              <h1 className="hero-line" style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
                Om Hari
              </h1>
            </div>
            <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
              <h1 className="hero-line" style={{ 
                fontSize: "clamp(2.75rem, 8vw, 7rem)", 
                fontWeight: 300, 
                color: "transparent", 
                WebkitTextStroke: "1px rgba(255,255,255,0.5)" 
              }}>
                Engineer
              </h1>
            </div>
            <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
              <h1 className="hero-line" style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
                & Builder
              </h1>
            </div>
          </div>

          <p className="hero-fade" style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)", 
            color: "rgba(255,255,255,0.45)", 
            maxWidth: "380px", 
            lineHeight: 1.65, 
            marginTop: "1.5rem",
            marginBottom: "2rem" 
          }}>
            I build intelligent systems that work beyond the notebook. Click the core to initialize the AI.
          </p>

          <button
            suppressHydrationWarning
            className="hero-fade hero-cta-btn"
            onClick={() => voicesLoaded && setIsAiActive(true)}
            disabled={!voicesLoaded || isAiActive}
            style={{
              cursor: voicesLoaded ? "pointer" : "wait",
              opacity: isAiActive ? 0.3 : 1
            }}
            onMouseOver={(e) => { 
              if(!isAiActive) {
                e.currentTarget.style.background = "white"; 
                e.currentTarget.style.color = "black"; 
              }
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.background = "transparent"; 
              e.currentTarget.style.color = "white"; 
            }}
          >
            {voicesLoaded ? "Initialize AI" : "Loading Voice..."}
          </button>

          {/* Mobile Social Pills (shown only on mobile screens) */}
          <div className="hero-social-mobile">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Robotic Avatar ────────────────────────────── */}
        <div
          className="hero-fade hero-avatar-col"
        >
          <div style={{ position: "absolute", top: "12%", right: "8%", textAlign: "right", zIndex: 3 }}>
            <div style={{ width: "36px", height: "1px", background: "rgba(255,255,255,0.12)", marginLeft: "auto", marginBottom: "6px" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {isAiActive ? "SYSTEM ONLINE" : "AI CORE STANDBY"}
            </span>
          </div>

          <RoboticAvatar 
            isActive={isAiActive} 
            isSpeaking={isSpeaking}
            onClick={() => {
              if (voicesLoaded && !isAiActive) setIsAiActive(true);
            }} 
          />
        </div>
      </section>

      {/* The ambient overlay that handles all voice chat logic */}
      <AmbientVoiceOverlay 
        isActive={isAiActive} 
        onClose={() => setIsAiActive(false)} 
      />
    </>
  );
}
