"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import about from "@/content/about";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Scroll animations for the clean main view
  useGSAP(() => {
    // Parallax the huge background text
    gsap.to(".about-huge-text", {
      xPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Fade in the portrait
    gsap.fromTo(portraitRef.current,
      { opacity: 0, y: 100, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 1.5, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: portraitRef.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: containerRef });

  // Animation for opening/closing the details panel
  useGSAP(() => {
    if (isDetailOpen) {
      // Open panel: slide in from right, fade in content
      gsap.to(detailPanelRef.current, {
        x: "0%",
        duration: 0.8,
        ease: "power4.out"
      });
      gsap.fromTo(".detail-content", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    } else {
      // Close panel
      gsap.to(detailPanelRef.current, {
        x: "100%",
        duration: 0.6,
        ease: "power3.in"
      });
    }
  }, [isDetailOpen]);

  return (
    <section
      id="about"
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "5rem 0",
      }}
    >
      {/* ── CLEAN VIEW: Huge Scrolling Typography ── */}
      <div 
        className="about-huge-text"
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 15vw, 15rem)",
          fontWeight: 800,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        THE BUILDER BEHIND THE CODE
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        
        {/* Left: Interaction Prompt */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"2rem" }}>
            <div style={{ width:"16px", height:"1px", background:"var(--color-accent-teal)" }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
              01 — About
            </span>
          </div>
          
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 300, lineHeight: 1.1, color: "white", marginBottom: "2rem" }}>
            I am a <span style={{ fontStyle: "italic", color: "var(--color-accent)" }}>B.Tech Student</span> focused on AI/ML and Full-Stack Architecture.
          </h2>

          <button
            suppressHydrationWarning
            onClick={() => setIsDetailOpen(true)}
            style={{
              padding: "1rem 2rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "white"; }}
          >
            Read Full Dossier
          </button>
        </div>

        {/* Right: Portrait (Clickable) */}
        <div 
          ref={portraitRef}
          onClick={() => setIsDetailOpen(true)}
          style={{
            position: "relative",
            aspectRatio: "3/4",
            width: "100%",
            maxWidth: "450px",
            cursor: "pointer",
            overflow: "hidden",
            marginLeft: "auto",
          }}
        >
          <Image
            src="/about/portrait.jpg"
            alt="Om Hari"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            style={{
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.2)",
              transition: "filter 0.5s ease, transform 0.5s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.filter = "grayscale(0%) contrast(1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.filter = "grayscale(100%) contrast(1.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          
          {/* Hover overlay text */}
          <div style={{ position: "absolute", bottom: "2rem", right: "-2rem", transform: "rotate(-90deg)", transformOrigin: "bottom right" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-accent-teal)", letterSpacing: "0.2em", textTransform: "uppercase", background: "rgba(0,0,0,0.5)", padding: "0.5rem 1rem" }}>
              Expand Details
            </span>
          </div>
        </div>

      </div>

      {/* ── DETAILED VIEW: The Sliding Drawer ── */}
      <div
        ref={detailPanelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(100%, 600px)",
          height: "100vh",
          backgroundColor: "#0a0a0a",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          zIndex: 100,
          padding: "4rem",
          overflowY: "auto",
          transform: "translateX(100%)", // Initial state
        }}
      >
        <button
          onClick={() => setIsDetailOpen(false)}
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            cursor: "pointer",
            letterSpacing: "0.1em",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "white"}
          onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
        >
          [ CLOSE ]
        </button>

        <div className="detail-content" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "white", marginBottom: "2rem" }}>
            The Full Story
          </h3>
          
          {/* Map through the bio array from content/about.ts */}
          {about.bio.map((paragraph, index) => (
            <p key={index} style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="detail-content" style={{ padding: "1.5rem", borderLeft: "2px solid var(--color-accent)", background: "rgba(108,99,255,0.05)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--color-accent)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "0.8rem" }}>
            Offbeat Detail
          </span>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            {about.offbeatDetail}
          </p>
        </div>
      </div>
      
      {/* Dimmed background when drawer is open */}
      <div 
        onClick={() => setIsDetailOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 99,
          opacity: isDetailOpen ? 1 : 0,
          pointerEvents: isDetailOpen ? "auto" : "none",
          transition: "opacity 0.5s ease",
        }}
      />
    </section>
  );
}
