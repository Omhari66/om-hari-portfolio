import type { SkillGroup } from "@/types";

const skills: SkillGroup[] = [
  {
    category: "AI & ML",
    items: [
      { name: "PyTorch",         icon: "pytorch" },
      { name: "YOLOv8",          icon: "computervision" },
      { name: "RAG Pipelines",   icon: "rag" },
      { name: "NLP",             icon: "nlp" },
      { name: "Embeddings",      icon: "embeddings" },
      { name: "Vector Search",   icon: "vectorsearch" },
    ],
  },
  {
    category: "PROGRAMMING",
    items: [
      { name: "Python",          icon: "python" },
      { name: "C++",             icon: "cpp" },
      { name: "Java",            icon: "java" },
      { name: "C",               icon: "c" },
      { name: "SQL",             icon: "sql" },
    ],
  },
  {
    category: "BACKEND",
    items: [
      { name: "FastAPI",         icon: "fastapi" },
      { name: "Node.js",         icon: "nodejs" },
      { name: "Express.js",      icon: "express" },
      { name: "PostgreSQL",      icon: "postgresql" },
      { name: "MongoDB",         icon: "mongodb" },
      { name: "REST APIs",       icon: "api" },
    ],
  },
  {
    category: "FRONTEND",
    items: [
      { name: "Next.js",         icon: "nextjs" },
      { name: "React.js",        icon: "react" },
      { name: "Tailwind CSS",    icon: "tailwind" },
      { name: "HTML5/CSS3",      icon: "html" },
    ],
  },
];

export default skills;
