"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skills from "@/content/skills";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track which category is expanded
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useGSAP(() => {
    // Initial entrance animation
    gsap.fromTo(".skill-category-node",
      { scale: 0, opacity: 0, rotation: -45 },
      {
        scale: 1, opacity: 1, rotation: 0,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      }
    );
  }, { scope: containerRef });

  const handleCategoryClick = (category: string) => {
    const isOpening = activeCategory !== category;
    const safeCategory = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    if (isOpening) {
      setActiveCategory(category);
      // Animate the items in
      gsap.fromTo(`.skill-items-${safeCategory} .skill-item`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    } else {
      // Animate out and close
      gsap.to(`.skill-items-${safeCategory} .skill-item`, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.02,
        onComplete: () => setActiveCategory(null)
      });
    }
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "8rem clamp(2rem, 6vw, 5rem)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem" }}>
        <div style={{ width:"16px", height:"1px", background:"var(--color-accent-teal)" }} />
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
          04 — Arsenal
        </span>
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 300, color: "white", marginBottom: "4rem" }}>
        Technical Capabilities
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        {skills.map((group) => {
          const isActive = activeCategory === group.category;
          const safeCategory = group.category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

          return (
            <div 
              key={group.category}
              className="skill-category-node"
              style={{
                position: "relative",
                border: `1px solid ${isActive ? "var(--color-accent-teal)" : "rgba(255,255,255,0.1)"}`,
                backgroundColor: isActive ? "rgba(0, 217, 177, 0.05)" : "rgba(255,255,255,0.02)",
                padding: "2rem",
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
              onClick={() => handleCategoryClick(group.category)}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
              }}
            >
              <h3 style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "1.2rem", 
                letterSpacing: "0.2em", 
                color: isActive ? "var(--color-accent-teal)" : "white", 
                margin: "0 0 1rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {group.category}
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
                  {isActive ? "—" : "+"}
                </span>
              </h3>

              {/* Expandable Items */}
              <div 
                className={`skill-items-${safeCategory}`}
                style={{
                  height: isActive ? "auto" : 0,
                  opacity: isActive ? 1 : 0,
                  overflow: "hidden",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                  marginTop: isActive ? "2rem" : 0,
                }}
              >
                {group.items.map(item => (
                  <div 
                    key={item.name}
                    className="skill-item"
                    style={{
                      padding: "0.5rem 1rem",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "2px",
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
