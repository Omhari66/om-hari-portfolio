// Projects section — futuristic grid on pure black.

import projects from "@/content/projects";
import { ProjectCard } from "@/components/signatures/ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vw, 9rem) 0",
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Faint diagonal texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 20% 80%, rgba(108,99,255,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="container-site">
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--color-accent)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            03 — Projects
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "clamp(2.5rem, 6vw, 4rem)",
          }}
        >
          <h2
            id="projects-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              color: "white",
              textTransform: "uppercase",
            }}
          >
            Things I&apos;ve<br />
            <span style={{ color: "var(--color-accent)" }}>built.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", maxWidth: "260px", lineHeight: 1.5, textAlign: "right", letterSpacing: "0.04em" }}>
            Each project has its own accent — hover to feel the difference.
          </p>
        </div>

        <div className="layout-grid-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
