import type { ExperienceEntry } from "@/types";

const experience: ExperienceEntry[] = [
  {
    id: "exp-freelance",
    role: "Freelance Full-Stack Developer",
    org: "Independent Client Project",
    start: "2026-05",
    end: "present",
    summary:
      "Designed, developed, and deployed Khabar24Times, a live production news publishing platform. Acted as the sole developer, holding full engineering responsibility for architecture, implementation, and deployment.",
    highlights: [
      "Engineered a scalable 3-tier Service-Repository architecture to handle real-world traffic.",
      "Implemented a 4-tier granular Role-Based Access Control (RBAC) system for editorial workflows.",
      "Built an editorial state machine supporting Draft, Review, Legal Check, and Publish states.",
      "Set up comprehensive DevOps pipelines including Dockerized deployment, Incremental Static Regeneration, and Playwright E2E testing."
    ],
  },
  // Add earlier experience if any, otherwise this remains the only entry for now.
];

export default experience;
