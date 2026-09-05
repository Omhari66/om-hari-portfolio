"use client";

/**
 * useVoiceAssistant — hybrid TTS hook.
 *
 * Strategy:
 *  1. Try ElevenLabs via /api/speak (premium quality, streams MP3)
 *  2. If ElevenLabs fails / not configured → fall back to Web Speech API
 *
 * This means the site works without an ElevenLabs key (falls back automatically)
 * and upgrades silently once the key is added.
 */

import { useState, useCallback, useEffect, useRef } from "react";

// ── Web Speech fallback voice picker ────────────────────────────────
function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const priority = [
    (v: SpeechSynthesisVoice) => v.name === "Google UK English Male",
    (v: SpeechSynthesisVoice) => v.name === "Google UK English Female",
    (v: SpeechSynthesisVoice) => v.name.includes("Google") && v.lang === "en-GB",
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.name.includes("Guy"),
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.name.includes("Aria"),
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.name.includes("Jenny"),
    (v: SpeechSynthesisVoice) => v.lang === "en-GB",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];
  for (const test of priority) {
    const match = voices.find(test);
    if (match) return match;
  }
  return null;
}

export function useVoiceAssistant() {
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [voices, setVoices]           = useState<SpeechSynthesisVoice[]>([]);
  const synthRef   = useRef<SpeechSynthesis | null>(null);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const stoppedRef = useRef(false);   // tracks intentional stop

  // Load Web Speech voices (used as fallback)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    window.speechSynthesis.onvoiceschanged = load;
    load();
  }, []);

  // ── ElevenLabs path ──────────────────────────────────────────────
  const speakElevenLabs = useCallback(
    async (text: string, onEnd?: () => void): Promise<boolean> => {
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) return false;   // not configured — fall through to Web Speech

        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);

        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(url);
        audioRef.current = audio;
        stoppedRef.current = false;

        audio.onplay  = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          onEnd?.();
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          onEnd?.();
        };

        await audio.play();
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  // ── Web Speech fallback path ─────────────────────────────────────
  const speakWebSpeech = useCallback(
    (text: string, onEnd?: () => void) => {
      const synth = synthRef.current;
      if (!synth) return;

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickBestVoice(voices);
      if (voice) utterance.voice = voice;

      utterance.pitch  = 1.0;
      utterance.rate   = 0.90;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => { setIsSpeaking(false); onEnd?.(); };
      utterance.onerror = (e) => {
        if (e.error !== "interrupted") console.error("Speech error:", e.error);
        setIsSpeaking(false);
        onEnd?.();
      };

      synth.speak(utterance);
    },
    [voices]
  );

  // ── Public speak() — tries ElevenLabs first, falls back ─────────
  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      stoppedRef.current = false;
      const usedElevenLabs = await speakElevenLabs(text, onEnd);
      if (!usedElevenLabs && !stoppedRef.current) {
        // ElevenLabs not configured or failed — use browser TTS
        speakWebSpeech(text, onEnd);
      }
    },
    [speakElevenLabs, speakWebSpeech]
  );

  // ── Public stop() ────────────────────────────────────────────────
  const stop = useCallback(() => {
    stoppedRef.current = true;

    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Stop Web Speech
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    voicesLoaded: voices.length > 0 || true,  // always ready (ElevenLabs needs no pre-load)
  };
}
