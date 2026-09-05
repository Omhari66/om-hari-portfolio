// ============================================================
// ABOUT CONTENT
// TODO: Replace all placeholder content with your real bio
//       before launch. Keep bio[] to 4-5 punchy lines max —
//       Tech-Doc §5.5 (AboutBriefing) caps at 5 lines.
// ============================================================

import type { AboutData } from "@/types";

const about: AboutData = {
  // Short one-liner that appears in hero area alongside the guide
  tagline: "I build things that feel alive.",

  // Each string = one line revealed in the AboutBriefing stagger animation.
  // Write in first person, punchy. Think "briefing", not "bio paragraph".
  bio: [
    "Full-stack developer obsessed with the edge where design meets engineering.",
    "I've shipped products used by tens of thousands — from zero to production.",
    "TypeScript, React, and systems thinking are my daily tools.",
    "I care about craft: the micro-interactions, the load time, the copy.",
    "When I'm not coding, I'm usually breaking something on purpose to learn how it works.",
  ],

  // One specific, offbeat personal detail — Design Doc 4.2:
  // "specificity reads as more genuine than polish"
  // TODO: replace with something real and personal
  offbeatDetail:
    "I once spent three days tuning a terminal prompt. No regrets.",

  // TODO: add your real portrait — place in /public/about/portrait.jpg
  photo: "/about/portrait.jpg",

  // TODO: replace with your real location
  location: "Bangalore, India",
};

export default about;
