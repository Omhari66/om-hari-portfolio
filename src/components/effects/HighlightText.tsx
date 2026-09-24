"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const HandDrawnUnderline = ({ children, color = 'var(--color-accent)' }: { children: React.ReactNode, color?: string }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    
    // Get the exact length of the squiggly path
    const length = path.getTotalLength();
    
    // Set initial state: dashed array equal to length, offset pushes it entirely out of view
    gsap.set(path, { 
      strokeDasharray: length, 
      strokeDashoffset: length 
    });
    
    // Animate the stroke into view
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: path,
        start: "top 95%", // Trigger when it enters the viewport
      }
    });
  }, []);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>{children}</span>
      <svg 
        viewBox="0 0 100 20" 
        preserveAspectRatio="none" 
        style={{ 
          position: 'absolute', 
          bottom: '-0.1em', 
          left: '-2%', 
          width: '104%', 
          height: '0.4em', 
          zIndex: 0,
          overflow: 'visible'
        }}
      >
        <path
          ref={pathRef}
          d="M 2 15 Q 25 18, 50 14 T 98 15"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.5))"
          }}
        />
      </svg>
    </span>
  );
};

export const HighlightText = ({ text, keywords, color }: { text: string, keywords: string[], color?: string }) => {
  if (!keywords || keywords.length === 0 || !text) return <>{text}</>;

  // Build a regex to match any of the keywords exactly (case-insensitive)
  const regex = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
          return <HandDrawnUnderline key={i} color={color}>{part}</HandDrawnUnderline>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};
