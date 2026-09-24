"use client";

import React, { useEffect, useRef, useState } from "react";

interface TextPressureProps {
  text: string;
  fontFamily?: string;
  baseWeight?: number;
  maxWeight?: number;
  baseWidth?: number;
  maxWidth?: number;
  influenceRadius?: number;
  className?: string;
  style?: React.CSSProperties;
  stroke?: boolean;
}

export function TextPressure({
  text,
  fontFamily = "'Roboto Flex', sans-serif",
  baseWeight = 100,
  maxWeight = 900,
  baseWidth = 50,
  maxWidth = 150,
  influenceRadius = 150,
  className = "",
  style = {},
  stroke = false,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Inject Roboto Flex if we are using it and it's not already loaded
    if (fontFamily.includes("Roboto Flex") && !document.getElementById("roboto-flex-font")) {
      const link = document.createElement("link");
      link.id = "roboto-flex-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap";
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      requestAnimationFrame(() => {
        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenterX = rect.left + rect.width / 2;
          const charCenterY = rect.top + rect.height / 2;

          const dx = clientX - charCenterX;
          const dy = clientY - charCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let weight = baseWeight;
          let width = baseWidth;

          if (distance < influenceRadius) {
            const intensity = 1 - distance / influenceRadius;
            // Interpolate based on intensity
            weight = baseWeight + (maxWeight - baseWeight) * intensity;
            width = baseWidth + (maxWidth - baseWidth) * intensity;
          }

          span.style.fontVariationSettings = `"wght" ${weight}, "wdth" ${width}`;
        });
      });
    };

    const handleMouseLeave = () => {
      requestAnimationFrame(() => {
        spansRef.current.forEach((span) => {
          if (!span) return;
          span.style.fontVariationSettings = `"wght" ${baseWeight}, "wdth" ${baseWidth}`;
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave); // Reset if mouse leaves window

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [baseWeight, maxWeight, baseWidth, maxWidth, influenceRadius]);

  const chars = text.split("");

  return (
    <div
      ref={containerRef}
      className={`inline-flex ${className}`}
      style={{ fontFamily, ...style }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            spansRef.current[index] = el;
          }}
          style={{
            display: "inline-block",
            transition: "font-variation-settings 0.1s ease-out",
            fontVariationSettings: `"wght" ${baseWeight}, "wdth" ${baseWidth}`,
            whiteSpace: char === " " ? "pre" : "normal",
            ...(stroke
              ? {
                  color: "transparent",
                  WebkitTextStroke: "1px #D5D0C5",
                }
              : {}),
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
