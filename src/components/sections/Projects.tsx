"use client";

import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "@/content/projects";
import type { Project } from "@/types";
import { FuzzyText } from "@/components/effects/FuzzyText";
import { HighlightText } from "@/components/effects/HighlightText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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

  // Stacking Cards Scroll Animations
  useGSAP(() => {
    // 1. Fade out the header as user scrolls down
    gsap.to(".projects-header", {
      opacity: 0,
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "top -500px",
        scrub: true,
      }
    });

    // 2. Scale down and darken each card as the NEXT card scrolls over it
    const cards = gsap.utils.toArray(".project-card-inner") as HTMLElement[];
    const wrappers = gsap.utils.toArray(".project-card-wrapper") as HTMLElement[];
    
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // The last card doesn't scale down
      
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: wrappers[i],
          start: "top 15vh", // Starts when this card locks into its sticky position
          end: "bottom 15vh", // Ends when the wrapper finishes scrolling (and the next card hits)
          scrub: true,
        }
      });
    });
  }, { scope: containerRef });

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
          minHeight: "100vh",
          backgroundColor: "#000",
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingBottom: "10vh"
        }}
      >
        {/* Section Header */}
        <div className="projects-header" style={{ position: "sticky", top: "4rem", paddingTop: "4rem", left: 0, paddingLeft: "clamp(2rem, 6vw, 5rem)", zIndex: 10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem" }}>
            <div style={{ width:"16px", height:"1px", background:"var(--color-accent-teal)" }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
              02 — Work
            </span>
          </div>
          <div style={{ margin: 0, lineHeight: 1 }}>
            <FuzzyText 
              fontSize="clamp(2.5rem, 4vw, 4rem)" 
              fontWeight={300} 
              fontFamily="var(--font-display)" 
              color="white"
            >
              Selected Projects
            </FuzzyText>
          </div>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)", marginTop: "1rem", maxWidth: "500px", lineHeight: 1.6 }}>
            A collection of digital experiences crafted with precision and passion. Scroll down to explore the portfolio.
          </p>
        </div>

        {/* Vertical Stacking Cards Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "10vh",
            paddingLeft: "clamp(1rem, 4vw, 5rem)",
            paddingRight: "clamp(1rem, 4vw, 5rem)",
          }}
        >
          {projects.map((project, index) => {
            const mediaItem = project.media?.[0];
            
            return (
              <div
                key={project.id}
                className="project-card-wrapper"
                style={{
                  position: "sticky",
                  top: `calc(15vh + ${index * 30}px)`, // Stacks them with a 30px offset like a deck
                  height: "100vh", // The wrapper takes up 100vh of scroll space
                  display: "flex",
                  alignItems: "flex-start",
                  zIndex: index, // Ensure natural stacking context
                }}
              >
                <div
                  onClick={() => openProject(project)}
                  className="project-card-inner"
                  style={{
                    height: "70vh", // Fixed height for the card
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "24px",
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr", // Left image, right content
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: "0 -20px 40px rgba(0,0,0,0.8)",
                    transformOrigin: "top center", // Scales from the top edge where it's stuck
                  } as React.CSSProperties}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = project.accentColor;
                    const bgLayer = e.currentTarget.querySelector('.bg-layer') as HTMLElement;
                    if(bgLayer) bgLayer.style.opacity = "0.15";
                  }}
                  onMouseOut={(e) => {
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
                      background: `radial-gradient(circle at top right, ${project.accentColor}, transparent 60%)`,
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                      pointerEvents: "none",
                      zIndex: 0,
                    }} 
                  />

                {/* Left Side: Media */}
                <div style={{ position: "relative", zIndex: 1, backgroundColor: "#000", borderRight: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  {mediaItem && mediaItem.type === "image" ? (
                    <img 
                      src={mediaItem.src} 
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
                    />
                  ) : mediaItem && mediaItem.type === "video" ? (
                    <video 
                      src={mediaItem.src} 
                      autoPlay loop muted playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "2rem" }}>No Media</span>
                    </div>
                  )}
                </div>

                {/* Right Side: Content */}
                <div style={{ position: "relative", zIndex: 1, padding: "4rem 3rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: project.accentColor, letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255,255,255,0.03)", padding: "0.3rem 0.8rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      ENGINEERING
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                      0{index + 1} / 0{projects.length}
                    </span>
                  </div>
                  
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3vw, 3.5rem)", fontWeight: 700, color: "white", margin: "0 0 1.5rem 0", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    {project.title}
                  </h3>
                  
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 auto 0" }}>
                    {project.summary}
                  </p>
                  
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "3rem", marginBottom: "3rem" }}>
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.4rem 1rem", borderRadius: "4px" }}>
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", padding: "0.4rem 0" }}>
                        +{project.tags.length - 4} more
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 600, color: "white", fontSize: "1.1rem" }}>
                    View Project <span style={{ transition: "transform 0.3s ease" }} className="arrow">↗</span>
                  </div>
                </div>
              </div>
              </div>
            );
          })}
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
                  <HighlightText 
                    text={activeProject.problem} 
                    keywords={["static content", "human monitoring", "complex editorial workflows", "manually verify"]} 
                    color={activeProject.accentColor} 
                  />
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  The Approach
                </h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                  <HighlightText 
                    text={activeProject.approach} 
                    keywords={["Retrieval-Augmented Generation", "Temporal Feature Extraction", "Service-Repository system", "Deterministic Rule Engine", "end-to-end architecture"]} 
                    color={activeProject.accentColor} 
                  />
                </p>
              </div>
            </div>

            <div style={{ padding: "2rem", borderLeft: `2px solid ${activeProject.accentColor}`, background: "rgba(255,255,255,0.02)", marginBottom: "4rem" }}>
              <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: activeProject.accentColor, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
                The Result
              </h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "white", lineHeight: 1.6, margin: 0 }}>
                <HighlightText 
                  text={activeProject.result} 
                  keywords={["automatic difficulty scaling", "F1-score", "one-click rollbacks", "robust pipeline"]} 
                  color={activeProject.accentColor} 
                />
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
