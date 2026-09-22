import type { AboutData } from "@/types";

const about: AboutData = {
  // Short one-liner that appears in hero area alongside the guide
  tagline: "I build intelligent systems that work beyond the notebook.",

  // Each string = one line revealed in the AboutBriefing stagger animation.
  // Write in first person, punchy. Think "briefing", not "bio paragraph".
  bio: [
    "I am an AI/ML Engineer and a student of Computer Science at Lovely Professional University.",
    "My focus is on applied intelligence — LLM applications, RAG pipelines, computer vision, and NLP.",
    "I don't just train models in notebooks. I build the full-stack infrastructure required to deploy them into production.",
    "My goal is to understand how complex systems work deeply enough to build them from the ground up."
  ],

  // One specific, offbeat personal detail — Design Doc 4.2:
  offbeatDetail:
    "I believe the best products hide their complexity. The AI should not replace the product; it should become the interface through which users understand it.",

  photo: "/about/portrait.jpg",

  location: "Punjab, India",
};

export default about;
