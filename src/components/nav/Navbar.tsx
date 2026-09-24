"use client";

// Navbar — floating pill design with animated sliding active indicator.
// Uses Framer Motion layoutId so the white pill smoothly slides
// between nav items on hover — exactly like the reference screenshot.

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { TextPressure } from "@/components/effects/TextPressure";

const NAV_LINKS = [
  { href: "#hero",       label: "Home"       },
  { href: "#about",      label: "About"      },
  { href: "#experience", label: "Experience" },
  { href: "#projects",   label: "Projects"   },
  { href: "#skills",     label: "Skills"     },
] as const;

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          background: "rgba(0,0,0,0.0)",   /* transparent — pill carries the bg */
          pointerEvents: "none",           /* let clicks through the empty bar */
        }}
      >
        {/* Logo ─ re-enable pointer events for just this element */}
        <a
          href="#hero"
          aria-label="Back to top"
          style={{
            pointerEvents: "all",
            textDecoration: "none",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{
            lineHeight: 0.85,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}>
            <TextPressure 
              text="OM" 
              baseWeight={400} 
              maxWeight={900} 
              baseWidth={50} 
              maxWidth={110} 
              influenceRadius={120}
              className="text-[#E8E6E1]"
              style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}
            />
            <TextPressure 
              text="HARI" 
              stroke={true}
              baseWeight={400} 
              maxWeight={900} 
              baseWidth={50} 
              maxWidth={110} 
              influenceRadius={120}
              style={{ fontSize: "1.75rem", letterSpacing: "-0.02em", marginTop: "-0.15em" }}
            />
          </div>
          <div style={{
            display: "flex",
            gap: "0.6rem",
            fontFamily: "serif",
            fontSize: "0.55rem",
            color: "#A39F96",
            letterSpacing: "0.15em",
            marginTop: "0.4rem",
            paddingLeft: "0.05rem"
          }}>
            <span>PORTFOLIO</span>
            <span>M.21</span>
          </div>
        </a>

        {/* ── Floating pill nav ─────────────────────────────────────── */}
        <div
          className="nav-desktop-links"
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9999px",
            padding: "5px",
            gap: "2px",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isHovered = hoveredId === href;
            return (
              <a
                key={href}
                href={href}
                onMouseEnter={() => setHoveredId(href)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.45rem 1.1rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  letterSpacing: "0.03em",
                  color: isHovered ? "#000" : "rgba(255,255,255,0.55)",
                  transition: "color 0.18s",
                  zIndex: 1,
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Sliding background pill — only rendered for the hovered item */}
                {isHovered && (
                  <motion.div
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "9999px",
                      background: "white",
                      zIndex: -1,
                    }}
                  />
                )}
                {label}
              </a>
            );
          })}
        </div>

        {/* RESUME & CONTACT pills ───────────────────────────────────── */}
        <div className="nav-desktop-cta" style={{ pointerEvents: "all", display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a
            href="/about/OmHari_CV_final.pdf"
            download="OmHari_CV_final.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "white"}
            onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
          >
            RESUME
          </a>

          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "white",
              textDecoration: "none",
              padding: "0.5rem 1.4rem",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "9999px",
              letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "black";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "white";
            }}
          >
            CONTACT
          </a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setIsOpen((p) => !p)}
          style={{ pointerEvents: "all" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <AnimatePresence initial={false} mode="wait">
              {isOpen ? (
                <motion.g key="x" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.15 }}>
                  <path d="M18 6 6 18" /><path d="M6 6l12 12" />
                </motion.g>
              ) : (
                <motion.g key="bars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <line x1="4" y1="6"  x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </button>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49,
              background: "rgba(0,0,0,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ padding: "1.25rem 2rem 1.75rem" }}>
              <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {([...NAV_LINKS, { href: "#contact", label: "Contact" }] as const).map(({ href, label }, i) => (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.22 }}
                  >
                    <Link
                      href={href}
                      onClick={close}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "var(--text-xl)",
                        color: "rgba(255,255,255,0.85)",
                        textDecoration: "none",
                        padding: "0.85rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a
                  href="/about/OmHari_CV_final.pdf" download="OmHari_CV_final.pdf" target="_blank" rel="noopener noreferrer" onClick={close}
                  style={{
                    display: "block", textAlign: "center", padding: "0.85rem",
                    color: "rgba(255,255,255,0.6)", textDecoration: "none",
                    fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em",
                  }}
                >
                  RESUME
                </a>
                <a
                  href="#contact" onClick={close}
                  style={{
                    display: "block", textAlign: "center", padding: "0.85rem",
                    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px",
                    color: "white", textDecoration: "none",
                    fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em",
                  }}
                >
                  CONTACT
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
