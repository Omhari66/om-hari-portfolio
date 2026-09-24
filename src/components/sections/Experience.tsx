"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import experience from "@/content/experience";
import { FuzzyText } from "@/components/effects/FuzzyText";
import { HighlightText } from "@/components/effects/HighlightText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Track scroll progress for the central "Journey Line" and the traveling particle
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 90%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Map the scroll progress (0-1) to the vertical percentage (0-100%) for the particle
  const particleY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useGSAP(() => {
    // Fade in and slide each node in from the right
    const nodes = gsap.utils.toArray(".exp-node") as HTMLElement[];
    nodes.forEach((node, i) => {
      
      // Animate the horizontal branch line
      const branch = node.querySelector('.exp-branch') as HTMLElement;
      if (branch) {
        gsap.fromTo(branch, 
          { width: "0px" }, 
          { 
            width: "30px", 
            duration: 0.6, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: node,
              start: "top 65%",
            }
          }
        );
      }

      // Animate the main node content
      gsap.fromTo(node.querySelector('.exp-content'),
        { opacity: 0, x: 30 },
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

      <div style={{ marginBottom: "6rem" }}>
        <FuzzyText 
          fontSize="clamp(2rem, 4vw, 4rem)" 
          fontWeight={300} 
          fontFamily="var(--font-display)" 
          color="white"
        >
          The Journey
        </FuzzyText>
      </div>

      <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto", paddingLeft: "1rem" }}>
        
        {/* ── CENTRAL TRUNK ── */}
        <div style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "32px", zIndex: 1 }}>
          <svg viewBox="0 0 32 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <linearGradient id="journey-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="50%" stopColor="var(--color-accent-glow)" />
                <stop offset="100%" stopColor="var(--color-accent-teal)" />
              </linearGradient>
            </defs>
            
            {/* Faded Background Track */}
            <path 
              d="M 16,0 L 16,100" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="2" 
              vectorEffect="non-scaling-stroke" 
              fill="none"
              strokeDasharray="4 4"
            />
            
            {/* Animated Solid Drawing Line */}
            <motion.path 
              d="M 16,0 L 16,100" 
              stroke="url(#journey-gradient)" 
              strokeWidth="3" 
              vectorEffect="non-scaling-stroke"
              fill="none"
              style={{ pathLength: smoothProgress }}
            />
          </svg>
          
          {/* Traveling Glowing Particle */}
          <motion.div
            style={{
              position: "absolute",
              left: "16px",
              top: particleY,
              width: "12px",
              height: "12px",
              background: "white",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 20px 5px var(--color-accent-teal), 0 0 40px var(--color-accent-glow)",
              zIndex: 10,
            }}
          />
        </div>

        {/* ── NODES ── */}
        {experience.map((exp, i) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div 
              key={exp.id}
              className="exp-node"
              onClick={(e) => toggleExpand(exp.id, e)}
              style={{
                position: "relative",
                paddingLeft: "6rem",
                paddingBottom: i === experience.length - 1 ? "0" : "5rem",
                cursor: "pointer",
              } as React.CSSProperties}
            >
              {/* Horizontal Branch Line connecting the Trunk to the Node */}
              <div 
                className="exp-branch"
                style={{
                  position: "absolute",
                  left: "40px", // Starts exactly at the center of the trunk
                  top: "10px",
                  height: "2px",
                  width: "0px", // Animated by GSAP
                  background: isExpanded ? "var(--color-accent-teal)" : "rgba(255,255,255,0.1)",
                  transition: "background 0.3s ease",
                  zIndex: 2,
                }}
              />

              {/* Diamond Node Marker */}
              <div 
                style={{
                  position: "absolute",
                  left: "70px", // End of the branch (40px + 30px width)
                  top: "11px",
                  width: "12px",
                  height: "12px",
                  background: isExpanded ? "var(--color-accent-teal)" : "#000",
                  border: `2px solid ${isExpanded ? "var(--color-accent-teal)" : "rgba(255,255,255,0.4)"}`,
                  transform: "translate(-50%, -50%) rotate(45deg)", // Diamond shape
                  zIndex: 3,
                  transition: "all 0.3s ease",
                  boxShadow: isExpanded ? "0 0 20px var(--color-accent-teal)" : "none"
                }}
              />

              <div className="exp-content">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-accent)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {exp.start} — {exp.end}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 500, color: "white", margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>
                  {exp.role}
                </h3>
                <h4 style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", fontWeight: 400, margin: 0 }}>
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
                    <HighlightText 
                      text={exp.summary} 
                      keywords={["full engineering responsibility", "Khabar24Times"]} 
                      color="var(--color-accent-teal)" 
                    />
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {exp.highlights.map((item, idx) => (
                      <li key={idx} style={{ 
                        fontFamily: "var(--font-body)", 
                        fontSize: "0.9rem", 
                        color: "rgba(255,255,255,0.6)", 
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        position: "relative",
                        paddingLeft: "1.5rem"
                      }}>
                        <span style={{ position: "absolute", left: 0, top: "8px", width: "4px", height: "4px", background: "var(--color-accent-teal)", transform: "rotate(45deg)" }} />
                        <HighlightText 
                          text={item} 
                          keywords={["Service-Repository architecture", "Role-Based Access Control", "state machine", "Playwright E2E testing"]} 
                          color="var(--color-accent)" 
                        />
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
