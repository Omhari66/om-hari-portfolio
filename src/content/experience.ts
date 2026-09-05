// ============================================================
// EXPERIENCE CONTENT
// Tech-Doc §3: start/end are ISO date strings ("YYYY-MM").
// getSegmentWeight() derives proportional timeline height from
// the actual duration — do NOT hand-set segment sizes.
// TODO: Replace with your real work history.
// ============================================================

import type { ExperienceEntry } from "@/types";

const experience: ExperienceEntry[] = [
  {
    id: "exp-current",
    role: "Senior Frontend Engineer",
    org: "Acme Corp",               // TODO: replace with real org
    start: "2023-06",
    end: "present",
    summary:
      "Leading the design system and performance initiative across three product teams. Reduced LCP by 40% and shipped a component library used by 12 engineers.",
    highlights: [
      "Architected a token-based design system adopted org-wide",
      "Cut bundle size by 35% via code-splitting and lazy loading",
      "Mentored two junior engineers through their first production releases",
      "Introduced Playwright E2E testing — coverage went from 12% to 78%",
    ],
  },
  {
    id: "exp-mid",
    role: "Full-Stack Developer",
    org: "Startup Studio",           // TODO: replace
    start: "2021-09",
    end: "2023-05",
    summary:
      "0-to-1 product builder at a B2B SaaS studio. Shipped four products in eighteen months, two of which reached paying customers within 90 days of launch.",
    highlights: [
      "Built and deployed a real-time collaboration tool (Next.js + Supabase)",
      "Owned the full stack: API design, database schema, and React UI",
      "Integrated Stripe billing and onboarding flows across two products",
      "Reduced average API response time from 800ms to 120ms via query optimization",
    ],
  },
  {
    id: "exp-early",
    role: "Frontend Developer",
    org: "Digital Agency",           // TODO: replace
    start: "2020-03",
    end: "2021-08",
    summary:
      "Client-facing web development across industries: e-commerce, fintech, and media. First professional exposure to design systems and component-driven development.",
    highlights: [
      "Delivered 11 client sites on time and within budget",
      "Introduced Storybook for component documentation — adopted by the team",
      "Led migration of a legacy jQuery codebase to React",
    ],
  },
  {
    id: "exp-internship",
    role: "Software Engineering Intern",
    org: "Tech Consultancy",         // TODO: replace
    start: "2019-06",
    end: "2019-12",
    summary:
      "Six-month internship focused on internal tooling. Shipped a dashboard that replaced a manual weekly reporting process.",
    highlights: [
      "Built a data visualization dashboard using D3.js",
      "Saved ~8 hours/week of manual report generation for the ops team",
    ],
  },
];

export default experience;
