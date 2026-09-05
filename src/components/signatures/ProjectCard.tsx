"use client";

// ProjectCard — Projects section signature (Design Doc §4.4 + Tech-Doc §5.5).
//
// Signature: each card has its own micro-identity via --project-accent.
//   - Scoped to the card root only — never leaks to sibling cards.
//   - Hover: y-axis lift (Framer Motion) + accent-colored glow (CSS .project-card:hover).
//   - Scroll entrance: opacity + y, each card independent so they stagger
//     naturally as the user scrolls down the grid.
//
// Self-contained: renders the full card. Projects.tsx just maps over data.

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.article
      id={project.id}
      aria-label={project.title}
      className="project-card"
      // Scope the accent — never global
      style={
        {
          "--project-accent": project.accentColor,
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "var(--shadow-card)",
          // transition is on .project-card in globals.css
        } as React.CSSProperties
      }
      // Scroll entrance
      initial={prefersReduced ? {} : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      // Hover lift (CSS handles glow/border via .project-card:hover)
      whileHover={
        prefersReduced
          ? {}
          : { y: -5, transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] } }
      }
    >
      {/* Accent top bar — the card's micro-identity marker */}
      <div
        aria-hidden="true"
        style={{
          height: "3px",
          background: `linear-gradient(90deg, var(--project-accent), transparent)`,
        }}
      />

      <div style={{ padding: "1.75rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
            gap: "1rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-2xl)",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          >
            {project.title}
          </h3>

          {project.signatureInteraction !== "none" && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--project-accent)",
                border: "1px solid var(--project-accent)",
                borderRadius: "var(--radius-full)",
                padding: "0.2rem 0.6rem",
                opacity: 0.8,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {project.signatureInteraction.replace("-", " ")}
            </span>
          )}
        </div>

        {/* Summary */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          {project.summary}
        </p>

        {/* Problem → Approach → Result */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.25rem",
          }}
        >
          {(
            [
              ["Problem", project.problem],
              ["Approach", project.approach],
              ["Result", project.result],
            ] as const
          ).map(([label, text]) => (
            <div key={label}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--project-accent)",
                  display: "block",
                  marginBottom: "0.3rem",
                  opacity: 0.9,
                }}
              >
                {label}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "1.5rem",
          }}
        >
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1.25rem",
            }}
          >
            {project.links.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--project-accent)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  transition: "opacity var(--duration-fast)",
                }}
              >
                {label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
