"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import about from "@/content/about";
import { VerticalMagnificationDock } from "@/components/ui/VerticalMagnificationDock";

const SOCIAL_LINKS = [
  { label: "GH", fullLabel: "GitHub",    href: "https://github.com/yourhandle" },
  { label: "LI", fullLabel: "LinkedIn",  href: "https://linkedin.com/in/yourhandle" },
  { label: "IG", fullLabel: "Instagram", href: "https://instagram.com/yourhandle" },
  { label: "X",  fullLabel: "Twitter/X", href: "https://x.com/yourhandle" },
  { label: "BE", fullLabel: "Behance",   href: "https://behance.net/yourhandle" },
];

// Typing indicator dots component
function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "var(--color-accent)",
            display: "inline-block",
            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

export default function Hero() {
  const [mounted, setMounted]       = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputText, setInputText]   = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [aiMessage, setAiMessage]   = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { speak, stop, isSpeaking, voicesLoaded } = useVoiceAssistant();

  useEffect(() => { setMounted(true); }, []);

  // Focus input after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && hasStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSpeaking, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    const greeting = `Hello! I'm the AI assistant for this portfolio. Ask me anything — about the projects, skills, experience, or the person behind it all.`;
    setAiMessage(greeting);
    speak(greeting);
  };

  const handleStop = () => {
    stop();
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const question = inputText.trim();
    setInputText("");
    setIsThinking(true);
    setAiMessage(null);
    stop();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAiMessage(data.reply);
      speak(data.reply);
    } catch {
      const err = "I'm having a moment — please try again.";
      setAiMessage(err);
      speak(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Pulse dot keyframe injected once */}
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes speaking-ring {
          0%   { opacity: 0.6; transform: scale(0.92); }
          50%  { opacity: 0.2; transform: scale(1.08); }
          100% { opacity: 0.6; transform: scale(0.92); }
        }
        @keyframes speaking-ring2 {
          0%   { opacity: 0.3; transform: scale(0.85); }
          50%  { opacity: 0.1; transform: scale(1.15); }
          100% { opacity: 0.3; transform: scale(0.85); }
        }
      `}</style>

      <section
        id="hero"
        aria-label="Introduction"
        style={{
          position: "relative",
          minHeight: "100dvh",
          backgroundColor: "#000000",
          overflow: "hidden",
          paddingTop: "64px",
          display: "grid",
          gridTemplateColumns: "56px 1fr 1fr",
        }}
      >
        {/* Thin vertical grid lines */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: "56px", width: "1px", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        {/* ── LEFT COLUMN: social links — magnification dock ──────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            zIndex: 10,
            overflow: "visible",   /* allow tooltip to extend beyond column */
          }}
        >
          <VerticalMagnificationDock
            items={SOCIAL_LINKS}
            distance={110}
            baseItemSize={34}
            magnification={54}
            spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
          />
        </div>


        {/* ── MIDDLE COLUMN: text + controls ─────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(2rem, 6vw, 5rem)", zIndex: 10 }}>

          {/* ── Eyebrow — slides in from left ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "22px" }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              style={{ height: "1px", background: "var(--color-accent)" }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Portfolio
            </span>
          </motion.div>

          {/* ── Hero heading — spring animated ──────────────────── */}
          <h1 style={{ fontFamily: "var(--font-display)", lineHeight: 1.0, margin: "0 0 1.75rem 0", overflow: "hidden" }}>

            {/* "Hi," — springs up with bounce */}
            <motion.span
              initial={{ opacity: 0, y: 60, skewY: 4 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: 0.25,
              }}
              style={{
                display: "block",
                fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
                fontWeight: 200,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.04em",
                lineHeight: 1.15,
              }}
            >
              Hi,
            </motion.span>

            {/* "I'm OM" — staggered spring */}
            <motion.span
              style={{
                display: "block",
                fontSize: "clamp(3.8rem, 8.5vw, 9.5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
              }}
            >
              {/* "I'm" — follows Hi, */}
              <motion.span
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  delay: 0.42,
                }}
                style={{ color: "rgba(255,255,255,0.72)", fontWeight: 300, display: "inline-block" }}
              >
                I&apos;m{" "}
              </motion.span>

              {/* "OM" — spring scale pop + floating glow loop */}
              <motion.span
                initial={{ opacity: 0, scale: 0.6, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 10,
                  delay: 0.58,
                }}
                style={{
                  display: "inline-block",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-teal) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                }}
              >
                {/* Continuous glow layer behind OM */}
                <motion.span
                  aria-hidden="true"
                  animate={{
                    opacity: [0.15, 0.45, 0.15],
                    scale:   [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    fontWeight: 800,
                    fontSize: "inherit",
                    background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-teal) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "blur(12px)",
                    zIndex: -1,
                  }}
                >
                  OM
                </motion.span>
                OM
              </motion.span>
            </motion.span>
          </h1>

          {/* Tagline — fades up after heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.9 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.85rem, 1.5vw, 1rem)", color: "rgba(255,255,255,0.45)", maxWidth: "380px", lineHeight: 1.65, marginBottom: "3rem" }}
          >
            {about.tagline} — building things that feel alive at the intersection of design and engineering.
          </motion.p>

          {/* ── Controls: mounted gate ──────────────────────────────── */}
          {mounted && (!hasStarted ? (
            <button
              onClick={handleStart}
              disabled={!voicesLoaded}
              style={{
                alignSelf: "flex-start",
                padding: "0.9rem 2.5rem",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent", color: "white",
                fontFamily: "var(--font-mono)", fontSize: "0.78rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: voicesLoaded ? "pointer" : "wait",
                transition: "all 0.22s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "white"; }}
            >
              {voicesLoaded ? "Initialize AI" : "Loading…"}
            </button>
          ) : (
            <div style={{ maxWidth: "420px", width: "100%" }}>

              {/* Message / thinking bubble */}
              <div
                style={{
                  marginBottom: "1rem",
                  minHeight: "52px",
                  padding: "0.85rem 1.1rem",
                  background: "rgba(108,99,255,0.06)",
                  borderLeft: "2px solid rgba(108,99,255,0.4)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.80)",
                  lineHeight: 1.55,
                  transition: "opacity 0.3s",
                  opacity: aiMessage || isThinking ? 1 : 0,
                }}
              >
                {isThinking ? <ThinkingDots /> : (aiMessage ?? "")}
              </div>

              {/* Chat input */}
              <form onSubmit={handleAsk} style={{ display: "flex" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isSpeaking ? "Listening…" : "Ask me anything…"}
                  disabled={isThinking}
                  aria-label="Ask the assistant a question"
                  style={{
                    flex: 1, padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRight: "none", color: "white",
                    fontFamily: "var(--font-body)", fontSize: "0.9rem",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputText.trim()}
                  style={{
                    padding: "0 1.4rem",
                    background: inputText.trim() ? "var(--color-accent)" : "rgba(108,99,255,0.2)",
                    border: "none", color: "white",
                    cursor: isThinking || !inputText.trim() ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    transition: "background 0.2s",
                  }}
                >
                  Send
                </button>
              </form>

              {/* Stop speaking */}
              {isSpeaking && (
                <button
                  onClick={handleStop}
                  style={{
                    marginTop: "0.6rem", fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.28)", background: "transparent",
                    border: "none", cursor: "pointer", letterSpacing: "0.05em",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", background: "rgba(255,100,100,0.7)", borderRadius: "2px", display: "inline-block" }} />
                  Stop speaking
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── RIGHT COLUMN: GIF avatar ────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Decorative label — top right */}
          <div style={{ position: "absolute", top: "22%", right: "8%", textAlign: "right", zIndex: 3 }}>
            <div style={{ width: "36px", height: "1px", background: "rgba(255,255,255,0.12)", marginLeft: "auto", marginBottom: "6px" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {isSpeaking ? "SPEAKING" : hasStarted ? "STANDBY" : "AI ASSISTANT"}
            </span>
          </div>

          {/* Speaking pulse rings — only when speaking */}
          {isSpeaking && (
            <>
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%", margin: "auto",
                width: "70%", height: "70%",
                border: "1px solid rgba(0,217,177,0.25)",
                animation: "speaking-ring 2s ease-in-out infinite",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%", margin: "auto",
                width: "85%", height: "85%",
                border: "1px solid rgba(0,217,177,0.1)",
                animation: "speaking-ring2 2s ease-in-out 0.4s infinite",
                pointerEvents: "none",
              }} />
            </>
          )}

          {/* ── GIF wrapper — edge-faded, blended ─────────────────── */}
          <div
            style={{
              position: "relative",
              width: "min(88%, 440px)",
              // Radial mask: fades all edges into black — blends into page
              maskImage: "radial-gradient(ellipse 80% 88% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 88% at 50% 50%, black 40%, transparent 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/download.gif"
              alt="AI assistant face"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                // Dark when not speaking → bright teal glow only when speaking
                filter: isSpeaking
                  ? "brightness(1.1) drop-shadow(0 0 18px rgba(0,217,177,0.5)) drop-shadow(0 0 48px rgba(0,217,177,0.15))"
                  : hasStarted
                  ? "brightness(0.55)"
                  : "brightness(0.28)",
                transition: "filter 0.8s ease",
                // mix-blend-mode so it naturally merges with black background
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, rgba(108,99,255,0.4), transparent)" }} />
        </div>
      </section>
    </>
  );
}
