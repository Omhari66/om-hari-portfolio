"use client";

import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "@/content/projects";
import type { Project } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate how far to move the track
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(trackWidth - windowWidth);
    };

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1, // smooth scrubbing
        invalidateOnRefresh: true,
      }
    });

    return () => {
      tween.kill();
    };
  }, { scope: containerRef });

  // Overlay animations
  useGSAP(() => {
    if (isOverlayOpen && activeProject) {
      gsap.fromTo(overlayRef.current, 
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(".overlay-content > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
    } else if (!isOverlayOpen && overlayRef.current) {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  }, [isOverlayOpen, activeProject]);

  const openProject = (project: Project) => {
    setActiveProject(project);
    setIsOverlayOpen(true);
    // Lock body scroll when overlay is open to prevent accidental background scrolling
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    setIsOverlayOpen(false);
    setTimeout(() => {
      setActiveProject(null);
      document.body.style.overflow = "";
    }, 400); // Wait for exit animation
  };

  return (
    <>
      <section
        id="projects"
        ref={containerRef}
        style={{
          height: "100vh",
          backgroundColor: "#000",
          overflow: "hidden", // Hide the overflow so horizontal track works
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Section Header */}
        <div style={{ position: "absolute", top: "4rem", left: "clamp(2rem, 6vw, 5rem)", zIndex: 10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem" }}>
            <div style={{ width:"16px", height:"1px", background:"var(--color-accent-teal)" }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
              02 — Work
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, color: "white", margin: 0, lineHeight: 1 }}>
            Selected Projects
          </h2>
        </div>

        {/* Horizontal Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            height: "100%",
            paddingTop: "12rem", // Push below header
            paddingBottom: "4rem",
            paddingLeft: "clamp(2rem, 6vw, 5rem)",
            paddingRight: "clamp(2rem, 6vw, 5rem)", // Ensure space after last card
            gap: "4rem",
            width: "max-content", // Allow it to size based on content
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              className="project-card"
              style={{
                position: "relative",
                width: "min(85vw, 600px)",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "3rem",
                cursor: "pointer",
                transition: "all 0.4s ease",
                overflow: "hidden",
              } as React.CSSProperties}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = project.accentColor;
                const bgLayer = e.currentTarget.querySelector('.bg-layer') as HTMLElement;
                if(bgLayer) bgLayer.style.opacity = "0.2";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                const bgLayer = e.currentTarget.querySelector('.bg-layer') as HTMLElement;
                if(bgLayer) bgLayer.style.opacity = "0";
              }}
            >
              {/* Dynamic Glow Layer */}
              <div 
                className="bg-layer"
                style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(circle at top right, ${project.accentColor}, transparent 70%)`,
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: "none",
                  zIndex: 0,
                }} 
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: project.accentColor, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                  0{index + 1}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 700, color: "white", margin: "0 0 1rem 0", lineHeight: 1.1 }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 2rem 0", maxWidth: "90%" }}>
                  {project.summary}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {project.tags.slice(0, 4).map(tag => (
                    <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", padding: "0.2rem 0" }}>
                      +{project.tags.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full-Screen Detailed Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#050505",
          zIndex: 1000,
          visibility: "hidden", // managed by GSAP autoAlpha
          overflowY: "auto",
          padding: "clamp(2rem, 5vw, 5rem)",
        }}
      >
        <button
          onClick={closeProject}
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            padding: "0.75rem 1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            zIndex: 1010,
            transition: "all 0.3s",
            borderRadius: "100px"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; e.currentTarget.style.color = "white"; }}
        >
          CLOSE
        </button>

        {activeProject && (
          <div className="overlay-content" style={{ maxWidth: "900px", margin: "0 auto", position: "relative", paddingTop: "4rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: activeProject.accentColor, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Case Study
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 700, color: "white", margin: "1rem 0 3rem 0", lineHeight: 1 }}>
              {activeProject.title}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  The Problem
                </h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                  {activeProject.problem}
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  The Approach
                </h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                  {activeProject.approach}
                </p>
              </div>
            </div>

            <div style={{ padding: "2rem", borderLeft: `2px solid ${activeProject.accentColor}`, background: "rgba(255,255,255,0.02)", marginBottom: "4rem" }}>
              <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: activeProject.accentColor, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                The Result
              </h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "white", lineHeight: 1.6, margin: 0 }}>
                {activeProject.result}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "3rem", paddingBottom: "5rem" }}>
              {activeProject.links.map(link => (
                <a 
                  key={link.url} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    padding: "1rem 2rem",
                    background: activeProject.accentColor,
                    color: "black",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
