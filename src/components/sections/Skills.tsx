// Skills section — futuristic grouped display on near-black.

import skills from "@/content/skills";
import { SkillGroupAnimated } from "@/components/signatures/SkillGroupAnimated";

const GROUP_ACCENTS = [
  "var(--color-accent)",
  "var(--color-accent-teal)",
  "var(--color-accent-cyan)",
] as const;

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vw, 9rem) 0",
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Top scan line */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(0,217,177,0.3), transparent)" }} />

      <div className="container-site">
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--color-accent-teal)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            04 — Skills
          </span>
        </div>

        <h2
          id="skills-heading"
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
          How I<br />
          <span style={{ color: "var(--color-accent-teal)" }}>show up.</span>
        </h2>

        <div className="layout-grid-3">
          {skills.map((group, idx) => (
            <SkillGroupAnimated
              key={group.category}
              group={group}
              accentColor={GROUP_ACCENTS[idx % GROUP_ACCENTS.length]}
            />
          ))}
        </div>

        {/* Current learning */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.2)",
            marginTop: "2.5rem",
            textAlign: "center",
            letterSpacing: "0.08em",
          }}
        >
          Always learning —{" "}
          <span style={{ color: "var(--color-accent-teal)" }}>
            currently: Rust memory model, WebGPU
          </span>
        </p>
      </div>

      {/* Bottom scan line */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(0,217,177,0.3), transparent)" }} />
    </section>
  );
}
