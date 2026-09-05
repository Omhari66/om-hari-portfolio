"use client";

/**
 * GhostCursor — lightning-style cursor trail using Canvas 2D.
 *
 * Draws a thin, tapering polyline through recent mouse positions.
 * Looks like a sharp electric spark / lightning streak — not a cloud blob.
 *
 * Props match the original README interface.
 */

import { useEffect, useRef, CSSProperties } from "react";

interface GhostCursorProps {
  color?: string;
  brightness?: number;
  trailLength?: number;
  inertia?: number;
  bloomStrength?: number;  // controls shadowBlur size (keep small)
  bloomRadius?: number;    // unused (kept for API compat)
  bloomThreshold?: number; // unused
  grainIntensity?: number; // unused
  edgeIntensity?: number;  // unused
  mixBlendMode?: CSSProperties["mixBlendMode"];
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
  className?: string;
}

export function GhostCursor({
  color = "#6C63FF",
  brightness = 1,
  trailLength = 28,
  inertia = 0.28,
  bloomStrength = 0.04,   // maps to shadowBlur (0–1 → 0–8px)
  mixBlendMode = "screen",
  fadeDelayMs,
  fadeDurationMs,
  zIndex = 9999,
  className,
}: GhostCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match viewport
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Trail state ──────────────────────────────────────────────────
    // Each point: {x, y} in page-pixel space
    const trail: { x: number; y: number }[] = [];
    let targetX = -200;
    let targetY = -200;
    let smoothX = -200;
    let smoothY = -200;

    // Fade control
    const _fadeDelayMs    = fadeDelayMs    ?? 900;
    const _fadeDurationMs = fadeDurationMs ?? 1200;
    let lastMoveTime = Date.now();
    let isFading     = false;
    let fadeStart    = 0;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const p = "touches" in e ? e.touches[0] : e;
      targetX = p.clientX;
      targetY = p.clientY;
      lastMoveTime = Date.now();
      isFading = false;
    };
    window.addEventListener("mousemove", onMove as EventListener);
    window.addEventListener("touchmove", onMove as EventListener, { passive: true });

    // Parse hex → r,g,b components (supports 3 and 6 digit)
    const parseHex = (hex: string): [number, number, number] => {
      const h = hex.replace("#", "");
      if (h.length === 3) {
        return [
          parseInt(h[0] + h[0], 16),
          parseInt(h[1] + h[1], 16),
          parseInt(h[2] + h[2], 16),
        ];
      }
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const [r, g, b] = parseHex(color);

    // ── Animation loop ───────────────────────────────────────────────
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      // Lerp smooth position toward target
      const speed = 1 - Math.pow(1 - inertia, 0.16);
      smoothX += (targetX - smoothX) * speed;
      smoothY += (targetY - smoothY) * speed;

      // Manage idle fade
      const idleMs = Date.now() - lastMoveTime;
      if (!isFading && idleMs > _fadeDelayMs) {
        isFading = true;
        fadeStart = Date.now();
      }
      const globalAlpha = isFading
        ? Math.max(0, 1 - (Date.now() - fadeStart) / _fadeDurationMs)
        : 1;

      // Push new point
      trail.push({ x: smoothX, y: smoothY });
      if (trail.length > trailLength) trail.shift();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length < 2 || globalAlpha <= 0) return;

      // ── Draw lightning trail ──────────────────────────────────────
      // Draw multiple passes to layer the glow (thick dim → thin bright)
      const passes = [
        { lineWidth: 3.5, alpha: 0.08 * brightness, blur: bloomStrength * 12 },
        { lineWidth: 1.8, alpha: 0.22 * brightness, blur: bloomStrength * 6  },
        { lineWidth: 0.9, alpha: 0.55 * brightness, blur: bloomStrength * 3  },
        { lineWidth: 0.4, alpha: 0.90 * brightness, blur: 0                  },
      ];

      for (const pass of passes) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineJoin  = "round";
        ctx.lineCap   = "round";
        ctx.lineWidth = pass.lineWidth;
        ctx.shadowColor  = `rgb(${r},${g},${b})`;
        ctx.shadowBlur   = pass.blur;

        // Build gradient along trail: head is bright, tail is transparent
        const head = trail[trail.length - 1];
        const tail = trail[0];

        let grad: CanvasGradient;
        try {
          grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        } catch {
          ctx.restore();
          continue;
        }

        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${pass.alpha * 0.4 * globalAlpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${pass.alpha * globalAlpha})`);

        ctx.strokeStyle = grad;

        // Draw smooth catmull-rom-ish curve through trail points
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
          const mx = (trail[i].x + trail[i + 1].x) / 2;
          const my = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, mx, my);
        }

        const last = trail[trail.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();

        ctx.restore();
      }

      // ── Tiny bright dot at cursor tip ────────────────────────────
      if (globalAlpha > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur  = 6;
        ctx.fillStyle   = `rgba(${r},${g},${b},${0.9 * globalAlpha * brightness})`;
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove as EventListener);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("resize", resize);
    };
  }, [color, brightness, trailLength, inertia, bloomStrength, fadeDelayMs, fadeDurationMs]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex,
        mixBlendMode,
      }}
      aria-hidden="true"
    />
  );
}
