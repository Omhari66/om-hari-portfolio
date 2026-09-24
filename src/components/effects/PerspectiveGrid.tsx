"use client";

import { useEffect, useRef } from "react";

export function PerspectiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" style={{ perspective: '1000px' }}>
      <div 
        className="absolute w-[200%] h-[150%] left-[-50%] top-[10%] transform-origin-top"
        style={{
          transform: 'rotateX(75deg)',
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 60%)',
          animation: 'grid-move 1.5s linear infinite'
        }}
      />
      
      {/* Bottom fade out so it doesn't just clip sharply at the bottom of the screen */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />

      <style>{`
        @keyframes grid-move {
          0% { transform: rotateX(75deg) translateY(0); }
          100% { transform: rotateX(75deg) translateY(50px); }
        }
      `}</style>
    </div>
  );
}
