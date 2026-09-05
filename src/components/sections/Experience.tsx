// Experience section — futuristic timeline on pure black.

import ExperienceTimeline from "@/components/signatures/ExperienceTimeline";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vw, 9rem) 0",
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Horizontal scan line accent */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(108,99,255,0.3), transparent)" }} />

      <div className="container-site">
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--color-accent)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            02 — Experience
          </span>
        </div>

        <h2
          id="experience-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            letterSpacing: "0.06em",
            lineHeight: 1.1,
            color: "white",
            textTransform: "uppercase",
            marginBottom: "clamp(2.5rem, 6vw, 4rem)",
          }}
        >
          Where I&apos;ve<br />
          <span style={{ color: "var(--color-accent)" }}>spent my time.</span>
        </h2>

        <ExperienceTimeline />
      </div>

      {/* Bottom scan line */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(108,99,255,0.3), transparent)" }} />
    </section>
  );
}
