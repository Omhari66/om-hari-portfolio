"use client";

// Contact / Hire Me section — futuristic dark.

// GuideSignoff fires 'portfolio:signoff' on scroll-into-view.

import React, { useActionState, useEffect, useRef } from "react";
import { GuideSignoff } from "@/components/signatures/GuideSignoff";
import { PerspectiveGrid } from "@/components/effects/PerspectiveGrid";
import { MusicPlayer } from "@/components/effects/MusicPlayer";
import { sendContactEmail } from "@/app/actions/contact";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Omhari66",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/om66/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/om_hari_shukla/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/OmhariShukla4",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "https://learnerslogbyom.blogspot.com/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
] as const;

export default function Contact() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vw, 9rem) 0",
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Accent glow bottom-right */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      {/* 3D Perspective Grid Background */}
      <PerspectiveGrid />

      <div className="container-site" style={{ position: "relative", zIndex: 10 }}>
        <GuideSignoff>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "20px", height: "1px", background: "var(--color-accent)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  05 — Hire Me
                </span>
              </div>

              <h2
                id="contact-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.1,
                  color: "white",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Have an idea<br />
                <span style={{ color: "var(--color-accent)" }}>worth building?</span>
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "clamp(2.5rem, 6vw, 4rem)",
                  maxWidth: "540px",
                  lineHeight: 1.6,
                }}
              >
                I&apos;m interested in building intelligent products, solving difficult engineering problems, and working on ideas that deserve to exist.
              </p>
            </div>

            {/* Right side: Opportunities + Music Player */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", minWidth: "280px" }}>
              {/* Availability badge */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  border: "1px solid rgba(0,217,177,0.2)",
                  background: "rgba(0,217,177,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-accent-teal)", boxShadow: "0 0 8px var(--color-accent-teal)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", color: "white", marginBottom: "0.15rem" }}>
                    Open to opportunities
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                    Full-time · Freelance · Collaboration
                  </p>
                </div>
              </div>

              {/* Music Player */}
              <MusicPlayer 
                src="https://youtu.be/gbcexRAWJyY" 
                coverArt="https://upload.wikimedia.org/wikipedia/en/1/1c/Rick_Astley_-_Whenever_You_Need_Somebody.png" 
              />
            </div>
          </div>

          {/* Two-column: form + links */}
          <div className="layout-sidebar">
            {/* Form */}
            <form 
              ref={formRef}
              action={formAction}
              aria-label="Contact form" 
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="contact-name" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Name
                  </label>
                  <input
                    suppressHydrationWarning
                    id="contact-name" name="name" type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="contact-email" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Email
                  </label>
                  <input
                    suppressHydrationWarning
                    id="contact-email" name="email" type="email"
                    placeholder="ada@babbage.io"
                    autoComplete="email"
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="contact-message" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Message
                </label>
                <textarea
                  id="contact-message" name="message" rows={5}
                  placeholder="Tell me what you're building…"
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={isPending}
                  style={{
                    alignSelf: "flex-start",
                    padding: "0.85rem 2.5rem",
                    background: isPending ? "var(--color-border)" : "var(--color-accent)",
                    border: "none",
                    color: "white",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: isPending ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                  onMouseOver={(e) => { if (!isPending) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseOut={(e) => { if (!isPending) e.currentTarget.style.opacity = "1"; }}
                >
                  {isPending ? "Sending..." : "Send it"}
                  {!isPending && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
                {state?.success && (
                  <span style={{ color: "var(--color-accent-teal)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                    Message sent successfully!
                  </span>
                )}
                {state?.error && (
                  <span style={{ color: "red", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                    {state.error}
                  </span>
                )}
              </div>
            </form>

            {/* Social links list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Find me elsewhere
                </p>
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.75rem",
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.88rem",
                      border: "1px solid transparent",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {icon}
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </GuideSignoff>
      </div>
    </section>
  );
}
