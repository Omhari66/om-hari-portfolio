// ============================================================
// PROJECTS CONTENT
// Design Doc §4.4: each project has its own accentColor (set
// manually, never computed live) and exactly ONE
// signatureInteraction for its detail view.
// TODO: Replace with your real projects + media.
// ============================================================

import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "project-nova",
    title: "Nova",
    summary: "A real-time collaboration canvas for distributed design teams.",
    problem:
      "Remote design teams were context-switching between Figma, Slack, and Notion constantly — losing decisions in thread noise and duplicate files.",
    approach:
      "Built a single-surface tool where design specs, comments, and versioning live together. Designed a CRDT-based sync layer so conflicts are structurally impossible, not just handled after the fact.",
    result:
      "Adopted by 3 teams at beta, averaging 4+ hours of active use per day per team. Cold-start to first meaningful collaboration in under 90 seconds.",
    tags: ["Next.js", "TypeScript", "WebSockets", "CRDT", "Supabase", "Framer Motion"],
    links: [
      { label: "Live demo", url: "https://nova.example.com" },       // TODO
      { label: "GitHub", url: "https://github.com/you/nova" },       // TODO
    ],
    media: [
      { type: "image", src: "/projects/nova/screen-1.png" },         // TODO
      { type: "image", src: "/projects/nova/screen-2.png" },         // TODO
    ],
    accentColor: "#6C63FF",  // Electric violet — flagship product
    signatureInteraction: "live-embed",
  },
  {
    id: "project-shell",
    title: "Shell",
    summary: "A terminal-first developer environment config manager.",
    problem:
      "Every time I set up a new machine I'd spend half a day rebuilding my environment from memory. Existing dotfile tools were powerful but required reading docs before they did anything useful.",
    approach:
      "Built a CLI that interviews you about your workflow and generates a curated dotfile set. The opinionated defaults cover 90% of cases; escape hatches cover the rest.",
    result:
      "1,200 GitHub stars in the first month. Used as the setup script for two engineering teams' onboarding docs. My own machine setup time: 8 minutes.",
    tags: ["Node.js", "TypeScript", "CLI", "Shell", "Open Source"],
    links: [
      { label: "GitHub", url: "https://github.com/you/shell" },      // TODO
      { label: "npm", url: "https://npmjs.com/package/shell-setup" },// TODO
    ],
    media: [
      { type: "video", src: "/projects/shell/demo.mp4" },            // TODO
    ],
    accentColor: "#00D9B1",  // Teal — CLI/terminal personality
    signatureInteraction: "terminal-reveal",
  },
  {
    id: "project-pulse",
    title: "Pulse",
    summary: "Analytics dashboard redesign that turned data overload into daily decisions.",
    problem:
      "The existing dashboard had 47 charts on the home screen. Users called it 'the wall of graphs' and defaulted to exporting CSVs to actually make decisions.",
    approach:
      "Ran jobs-to-be-done interviews with 12 users to find the 3 metrics that actually changed behaviour. Redesigned around those, with everything else one click away. Built a before/after prototype to validate the reduction didn't lose critical information.",
    result:
      "Time-to-first-decision dropped from ~12 minutes to ~90 seconds in usability tests. CSV exports fell 60% post-launch — users were reading the dashboard instead.",
    tags: ["React", "D3.js", "TypeScript", "Figma", "User Research"],
    links: [
      { label: "Case study", url: "https://your.dev/pulse" },        // TODO
    ],
    media: [
      { type: "image", src: "/projects/pulse/before.png" },          // TODO
      { type: "image", src: "/projects/pulse/after.png" },           // TODO
    ],
    accentColor: "#F59E0B",  // Amber — data/warmth contrast
    signatureInteraction: "before-after",
  },
  {
    id: "project-flux",
    title: "Flux",
    summary: "An open-source state management library that actually stays out of your way.",
    problem:
      "Existing state solutions for React apps either required too much boilerplate for small projects or broke down in large ones. The middle ground was a graveyard of abandoned libraries.",
    approach:
      "Took the core ideas from Zustand and Jotai, stripped anything that didn't survive real usage across three different app sizes, and added a devtools layer that visualises state transitions as a graph rather than a diff.",
    result:
      "Published to npm, 400+ weekly downloads, used in production by 8 teams. Zero breaking changes in 14 months of active maintenance.",
    tags: ["TypeScript", "React", "npm", "Open Source", "Devtools"],
    links: [
      { label: "npm", url: "https://npmjs.com/package/flux-state" }, // TODO
      { label: "GitHub", url: "https://github.com/you/flux" },       // TODO
      { label: "Docs", url: "https://flux.example.com" },            // TODO
    ],
    media: [
      { type: "image", src: "/projects/flux/screen-1.png" },         // TODO
    ],
    accentColor: "#EC4899",  // Pink — library / OSS distinct personality
    signatureInteraction: "none",
  },
];

export default projects;
