// ============================================================
// SKILLS CONTENT
// Design Doc §4.5: grouped by USE, not alphabetized.
// Tech-Doc §5.5: grouping logic lives HERE in data,
// not computed at render time — keeps SkillGroup component clean.
// TODO: Replace/reorder to match your actual skill set.
// ============================================================

import type { SkillGroup } from "@/types";

// icon field: name of the skill for icon library lookup,
// or a path like "/icons/react.svg" for local SVGs.
const skills: SkillGroup[] = [
  {
    category: "Build with",
    items: [
      { name: "TypeScript",      icon: "typescript" },
      { name: "React",           icon: "react" },
      { name: "Next.js",         icon: "nextjs" },
      { name: "Node.js",         icon: "nodejs" },
      { name: "PostgreSQL",      icon: "postgresql" },
      { name: "Supabase",        icon: "supabase" },
    ],
  },
  {
    category: "Design with",
    items: [
      { name: "Figma",           icon: "figma" },
      { name: "Framer Motion",   icon: "framer" },
      { name: "Tailwind CSS",    icon: "tailwind" },
      { name: "CSS / SVG",       icon: "css" },
    ],
  },
  {
    category: "Explore with",
    items: [
      { name: "Rust",            icon: "rust" },
      { name: "WebAssembly",     icon: "webassembly" },
      { name: "LLM APIs",        icon: "openai" },
      { name: "Three.js",        icon: "threejs" },
    ],
  },
];

export default skills;
