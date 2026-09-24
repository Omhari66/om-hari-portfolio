"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skills from "@/content/skills";
import { FuzzyText } from "@/components/effects/FuzzyText";
import ElectricBorder from "@/components/effects/ElectricBorder";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categoryColors = [
  "#00D9B1", // Teal
  "#a855f7", // Electric Purple
  "#ff0055", // Neon Pink
  "#7df9ff", // Cyan
  "#ccff00", // Volt Green
  "#3b82f6", // Electric Blue
];

const getRgba = (hex: string, alpha: number) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

      <div style={{ marginBottom: "4rem" }}>
        <FuzzyText 
          fontSize="clamp(2rem, 4vw, 4rem)" 
          fontWeight={300} 
          fontFamily="var(--font-display)" 
          color="white"
        >
          Technical Capabilities
        </FuzzyText>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        {skills.map((group, index) => {
          const isActive = activeCategory === group.category;
          const safeCategory = group.category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          const activeColor = categoryColors[index % categoryColors.length];

          return (
            <div key={group.category} className="skill-category-node" style={{ height: '100%' }}>
              <ElectricBorder
                color={isActive ? activeColor : "#1a1a1a"}
                speed={isActive ? 1.5 : 0.2}
                chaos={isActive ? 0.25 : 0.05}
                borderRadius={16}
                style={{ height: '100%' }}
              >
                <div 
                  style={{
                    position: "relative",
                    backgroundColor: isActive ? getRgba(activeColor, 0.05) : "rgba(255,255,255,0.02)",
                    padding: "2rem",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    height: '100%',
                    borderRadius: 16
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
                color: isActive ? activeColor : "white", 
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
              </ElectricBorder>
            </div>
          );
        })}
      </div>
    </section>
  );
}
