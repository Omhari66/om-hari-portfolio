"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { usePortfolioState } from "@/portfolio/state";

gsap.registerPlugin(useGSAP);

interface AmbientVoiceOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

export function AmbientVoiceOverlay({ isActive, onClose }: AmbientVoiceOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLParagraphElement>(null);

  const { speak, stop, isSpeaking } = useVoiceAssistant();
  const { dispatch } = usePortfolioState();

  const [transcript,  setTranscript]  = useState("");
  const [isListening, setIsListening] = useState(false);
  const [statusText,  setStatusText]  = useState("");

  // ── Refs to avoid stale closures ─────────────────────────────────
  const transcriptRef   = useRef("");
  const isActiveRef     = useRef(false);
  const isSpeakingRef   = useRef(false);
  const recognitionRef  = useRef<any>(null);
  const isProcessingRef = useRef(false);

  // Multi-turn conversation history
  const conversationRef = useRef<{ role: string; content: string }[]>([]);

  // Keep refs in sync
  useEffect(() => { transcriptRef.current  = transcript;  }, [transcript]);
  useEffect(() => { isActiveRef.current    = isActive;    }, [isActive]);
  useEffect(() => { isSpeakingRef.current  = isSpeaking;  }, [isSpeaking]);

  // ── startListening ────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isProcessingRef.current) {
      try { recognitionRef.current.start(); } catch (_) { /* already running */ }
    }
  }, []);

  // ── Core: send to API, speak reply, dispatch tool results ─────────
  const handleUserSpeechEnded = useCallback(async () => {
    const userText = transcriptRef.current.trim();
    if (!userText) {
      if (isActiveRef.current && !isSpeakingRef.current) startListening();
      return;
    }

    isProcessingRef.current = true;
    setStatusText("Thinking...");

    // Append user turn to history
    conversationRef.current.push({ role: "user", content: userText });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationRef.current }),
      });

      const data = await res.json() as { text: string; toolResults: Array<{ toolName: string; result: any }> };

      // ── 1. Dispatch tool results → portfolio state ──────────────
      if (data.toolResults?.length) {
        for (const tr of data.toolResults) {
          const result = tr.result;
          switch (tr.toolName) {
            case "show_project_architecture":
              dispatch({ type: "SHOW_ARCHITECTURE", project: result.projectId });
              break;
            case "show_technical_decision":
              dispatch({ type: "SHOW_DECISION", project: result.projectId, technology: result.technology });
              break;
            case "show_evidence":
              dispatch({ type: "SHOW_EVIDENCE", project: result.projectId });
              break;
          }
        }
      }

      // ── 2. Speak the AI's text reply ────────────────────────────
      const replyText = data.text?.trim();
      if (replyText) {
        // Append assistant turn to history for multi-turn context
        conversationRef.current.push({ role: "assistant", content: replyText });
        setStatusText("");
        setTranscript("");
        speak(replyText, () => {
          isProcessingRef.current = false;
          if (isActiveRef.current) startListening();
        });
      } else {
        // No text to speak — restart listening immediately
        setStatusText("");
        setTranscript("");
        isProcessingRef.current = false;
        if (isActiveRef.current) startListening();
      }

    } catch (err) {
      console.error("[AmbientVoiceOverlay] error:", err);
      const msg = "I'm sorry, my systems are currently offline.";
      setStatusText(msg);
      speak(msg, () => {
        setStatusText("");
        isProcessingRef.current = false;
        onClose();
      });
    }
  }, [speak, onClose, startListening, dispatch]);

  // ── Handler ref — keeps recognition.onend always fresh ──────────
  const handleUserSpeechEndedRef = useRef(handleUserSpeechEnded);
  useEffect(() => { handleUserSpeechEndedRef.current = handleUserSpeechEnded; }, [handleUserSpeechEnded]);

  // ── Initialize Web Speech Recognition ONCE ───────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const idx = event.resultIndex;
      let text = event.results[idx][0].transcript;
      // Normalize ASR misreadings of project names (Indian English accent compensation)
      text = text
        .replace(/smart\s*(home\s*central|home\s*sentinel|omni\s*sentinel|all.*sentinel)/gi, "SmartOmniSentinel")
        .replace(/adapt\s*i\s*q|adaptive\s*i\s*q|adapt\s*iq/gi, "AdaptIQ")
        .replace(/khabar\s*24|khabbar|khabar\s*news/gi, "Khabar24Times")
        .replace(/p\s*s\s*2\s*6|p\s*s\s*26034|project\s*sentinel/gi, "PS-26034");
      setTranscript(text);
      transcriptRef.current = text;
    };

    recognition.onend = () => {
      setIsListening(false);
      handleUserSpeechEndedRef.current();
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      if (e.error === "network") {
        setStatusText("Speech recognition blocked. Try Chrome.");
        setTimeout(() => { setStatusText(""); onClose(); }, 4000);
      }
    };

    recognitionRef.current = recognition;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Manage Active / Inactive ──────────────────────────────────────
  useEffect(() => {
    if (isActive) {
      isProcessingRef.current = false;
      setTimeout(() => {
        speak("Systems online. Welcome to my portfolio. I am an AI assistant trained on Om Hari's experience. You can ask me about my skills, or ask to see the architecture and source code for the projects I've built. How can I assist you today?", () => {
          startListening();
        });
      }, 500);
    } else {
      stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setTranscript("");
      setStatusText("");
      isProcessingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // ── GSAP entrance / exit ──────────────────────────────────────────
  useGSAP(() => {
    if (isActive) {
      gsap.to(containerRef.current,   { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(panelRef.current,
        { y: 50, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.5)" }
      );
    } else {
      gsap.to(containerRef.current, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
    }
  }, [isActive]);

  // ── GSAP status text fade-in ──────────────────────────────────────
  useGSAP(() => {
    if (statusText && textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, filter: "blur(4px)" },
        { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
      );
    }
  }, [statusText]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        visibility: "hidden",
        opacity: 0,
        pointerEvents: isActive ? "auto" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "18vh",
        background: "radial-gradient(circle at bottom, rgba(124, 58, 237, 0.05) 0%, rgba(0,0,0,0) 70%)",
      }}
    >
      {/* ── Close pill ── */}
      <button
        onClick={onClose}
        suppressHydrationWarning
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
          padding: "0.5rem 1.5rem",
          borderRadius: "999px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          cursor: "pointer",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        Close Overlay
      </button>

      {/* ── Content panel ── */}
      <div
        ref={panelRef}
        style={{ width: "min(90%, 600px)", textAlign: "center", fontFamily: "var(--font-display)" }}
      >
        {isListening && (
          <p style={{
            color: "var(--color-accent-cyan)",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "1rem",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}>
            Listening...
          </p>
        )}

        {transcript && (
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1.5rem",
            fontWeight: 300,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            &quot;{transcript}&quot;
          </p>
        )}

        {statusText && (
          <p
            ref={textRef}
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.6,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: "1rem",
            }}
          >
            {statusText}
          </p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .4; }
        }
      ` }} />
    </div>
  );
}
