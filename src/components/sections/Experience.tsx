"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import experience from "@/content/experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  // Track which experience is currently expanded
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useGSAP(() => {
    // 1. Draw the center line down as you scroll
    gsap.fromTo(lineRef.current,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "bottom 80%",
          scrub: true,
        }
      }
    );

    // 2. Fade in each node
    const nodes = gsap.utils.toArray(".exp-node") as HTMLElement[];
    nodes.forEach((node) => {
      gsap.fromTo(node,
        { opacity: 0, x: -50 },
        {
          opacity: 1, 
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 75%",
          }
        }
      );
    });
  }, { scope: containerRef });

  const toggleExpand = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const isOpening = expandedId !== id;
    
    // We get the specific details container for this node
    const nodeEl = e.currentTarget;
    const detailsEl = nodeEl.querySelector('.exp-details') as HTMLElement;
    
    if (!detailsEl) return;

    if (isOpening) {
      setExpandedId(id);
      gsap.fromTo(detailsEl, 
        { height: 0, opacity: 0 }, 
        { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.to(detailsEl, { 
        height: 0, opacity: 0, duration: 0.4, ease: "power2.in",
        onComplete: () => setExpandedId(null)
      });
    }
  };

  return (
    <section
      id="experience"
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "8rem clamp(2rem, 6vw, 5rem)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"3rem" }}>
        <div style={{ width:"16px", height:"1px", background:"var(--color-accent-teal)" }} />
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
          03 — Experience
        </span>
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 300, color: "white", marginBottom: "6rem" }}>
        The Journey
      </h2>

      <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
        
        {/* The Circuit Line */}
        <div style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.05)" }} />
        <div 
          ref={lineRef}
          style={{ position: "absolute", left: "24px", top: 0, width: "2px", background: "linear-gradient(to bottom, var(--color-accent), var(--color-accent-teal))", zIndex: 1 }} 
        />

        {/* Nodes */}
        {experience.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div 
              key={exp.id}
              className="exp-node"
              onClick={(e) => toggleExpand(exp.id, e)}
              style={{
                position: "relative",
                paddingLeft: "5rem",
                paddingBottom: "4rem",
                cursor: "pointer",
              } as React.CSSProperties}
            >
              {/* Glowing Dot */}
              <div 
                style={{
                  position: "absolute",
                  left: "21px", // 24px line - 3px radius + 1px for alignment
                  top: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isExpanded ? "var(--color-accent-teal)" : "#000",
                  border: `2px solid ${isExpanded ? "var(--color-accent-teal)" : "rgba(255,255,255,0.3)"}`,
                  zIndex: 2,
                  transition: "all 0.3s ease",
                  boxShadow: isExpanded ? "0 0 15px var(--color-accent-teal)" : "none"
                }}
              />

              <div 
                style={{
                  transition: "transform 0.3s ease",
                  transform: isExpanded ? "translateX(10px)" : "translateX(0)",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-accent)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {exp.start} — {exp.end}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 500, color: "white", margin: "0 0 0.5rem 0" }}>
                  {exp.role}
                </h3>
                <h4 style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontWeight: 400, margin: 0 }}>
                  {exp.org}
                </h4>

                {/* The Expandable Details (Progressive Disclosure) */}
                <div 
                  className="exp-details"
                  style={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    marginTop: isExpanded ? "2rem" : 0,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    {exp.summary}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {exp.highlights.map((item, i) => (
                      <li key={i} style={{ 
                        fontFamily: "var(--font-body)", 
                        fontSize: "0.9rem", 
                        color: "rgba(255,255,255,0.6)", 
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        position: "relative",
                        paddingLeft: "1.5rem"
                      }}>
                        <span style={{ position: "absolute", left: 0, top: "8px", width: "4px", height: "4px", background: "var(--color-accent-teal)", borderRadius: "50%" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual affordance for clicking */}
                <div style={{ marginTop: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.3s ease" }}>
                  {isExpanded ? "[ CLOSE DETAILS ]" : "[ VIEW DETAILS ]"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
