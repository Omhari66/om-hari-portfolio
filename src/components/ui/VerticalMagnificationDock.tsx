"use client";

/**
 * VerticalMagnificationDock — macOS-style magnification for a vertical column.
 *
 * Adapted from the MagnificationDock component:
 * - Vertical axis (mouseY instead of mouseX)
 * - Dark / transparent styling — no white backgrounds
 * - Tooltip appears to the RIGHT on hover
 * - Font size and letter-spacing scale with the spring size
 *
 * Drop this into the Hero's left social column.
 */

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────
export type VerticalDockItem = {
  label: string;       // short label shown in column (GH, LI, etc.)
  fullLabel: string;   // full name shown in tooltip (GitHub, LinkedIn, etc.)
  href: string;
};

type VerticalDockItemProps = {
  item: VerticalDockItem;
  mouseY: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

// ── Single dock item ─────────────────────────────────────────────────
function VerticalDockItem({
  item,
  mouseY,
  spring,
  distance,
  magnification,
  baseItemSize,
}: VerticalDockItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Distance from mouse centre to this item's centre (on Y axis)
  const mouseDistance = useTransform(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { top: 0, height: baseItemSize };
    return val - rect.top - rect.height / 2;
  });

  // Map distance → size
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  // Font size scales proportionally with the spring size
  const fontSize = useTransform(size, [baseItemSize, magnification], ["0.6rem", "0.82rem"]);
  // Letter-spacing tightens slightly when bigger
  const letterSpacing = useTransform(size, [baseItemSize, magnification], ["0.14em", "0.08em"]);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.fullLabel}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${baseItemSize}px`,   // fixed width — only height & font magnify
        height: size,
        textDecoration: "none",
        cursor: "pointer",
        zIndex: isHovered ? 10 : 1,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* The label text — scales via font-size spring */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize,
          letterSpacing,
          color: isHovered ? "var(--color-accent)" : "rgba(255,255,255,0.35)",
          transition: "color 0.18s",
          display: "block",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {item.label}
      </motion.span>

      {/* Tooltip — appears to the right */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            role="tooltip"
            style={{
              position: "absolute",
              left: "calc(100% + 10px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.88)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px",
              padding: "3px 8px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              textTransform: "uppercase",
            }}
          >
            {item.fullLabel}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

// ── Public component ─────────────────────────────────────────────────
interface VerticalMagnificationDockProps {
  items: VerticalDockItem[];
  distance?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
}

export function VerticalMagnificationDock({
  items,
  distance = 120,
  baseItemSize = 36,
  magnification = 58,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
}: VerticalMagnificationDockProps) {
  const mouseY = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    mouseY.set(Infinity);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="list"
      aria-label="Social links"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.25rem",     // tighter — magnification provides the visual spacing
      }}
    >
      {items.map((item) => (
        <VerticalDockItem
          key={item.label}
          item={item}
          mouseY={mouseY}
          spring={spring}
          distance={distance}
          baseItemSize={baseItemSize}
          magnification={magnification}
        />
      ))}
    </div>
  );
}
