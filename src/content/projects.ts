import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "project-adaptiq",
    title: "AdaptIQ",
    summary: "A full-stack adaptive learning platform built around a RAG pipeline.",
    problem:
      "Traditional learning platforms offer static content. AdaptIQ dynamically generates tailored tutoring experiences by semantically understanding the study material through a Retrieval-Augmented Generation (RAG) pipeline.",
    approach:
      "Engineered an end-to-end architecture: Parsing (PDF/DOCX) → Semantic Chunking → Embeddings → Qdrant Retrieval → Cross-Encoder Reranking → Citation-backed LLM Response. Supported by async document processing (Celery) and real-time SSE streaming.",
    result:
      "Delivered four adaptive tutoring modes (Teacher, Revision, Exam, Normal) with automatic difficulty scaling and confidence-based weak-topic detection.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Qdrant", "Redis", "Groq API", "Docker", "Celery"],
    links: [
      { label: "GitHub", url: "https://github.com/Omhari66/adaptive-ai-tutor" },
    ],
    media: [
      { type: "image", src: "/projects/adaptiq/screen-1.jpg" },
    ],
    accentColor: "#6C63FF",  // Electric violet
    signatureInteraction: "live-embed",
    
    // --- AGENT KNOWLEDGE LAYER ---
    architecture: [
      {
        id: "pymupdf",
        name: "Document Parsing (PyMuPDF)",
        icon: "FileText",
        role: "Extracts text from PDF/DOCX files while preserving markdown tables.",
        input: "Raw PDF/DOCX documents",
        output: "Markdown text",
      },
      {
        id: "chunking",
        name: "Sentence-Boundary Chunking",
        icon: "Layers",
        role: "Splits extracted text into overlapping chunks without breaking grammatical sentences.",
        input: "Markdown text",
        output: "512-character text chunks",
        decisionTopic: "Chunking",
      },
      {
        id: "embeddings",
        name: "MiniLM Embeddings",
        icon: "Network",
        role: "Generates 384-dimensional vector representations of text chunks.",
        input: "Text chunks",
        output: "Vector embeddings",
        decisionTopic: "Embeddings",
        evidenceIds: ["embedding_service.py"],
      },
      {
        id: "qdrant",
        name: "Qdrant Retrieval",
        icon: "Database",
        role: "Vector database used for high-throughput semantic similarity search.",
        input: "Query embeddings",
        output: "Candidate chunks",
        decisionTopic: "Qdrant",
        evidenceIds: ["document_service.py"],
      },
      {
        id: "reranking",
        name: "Cross-Encoder Reranking",
        icon: "Filter",
        role: "Scores queries against candidate chunks to capture deep contextual nuance.",
        input: "Query + Candidate chunks",
        output: "Reranked relevant chunks",
        decisionTopic: "Reranking",
      },
      {
        id: "llm_groq",
        name: "LLM Generation (Groq)",
        icon: "Sparkles",
        role: "Streams answers based strictly on retrieved context using an ultra-fast LPU architecture.",
        input: "System Prompt + Reranked context + Query",
        output: "Streamed text response",
        decisionTopic: "Groq",
      }
    ],
    features: [
      "4 adaptive tutoring modes (Normal, Teacher, Revision, Exam)",
      "Mathematical confidence-decay engine",
      "Dynamic Prompt engineering",
      "Asynchronous document processing (Celery/FastAPI BackgroundTasks)",
      "Server-Sent Events (SSE) streaming"
    ],
    decisions: [
      {
        topic: "AdaptIQ",
        decision: "Build a stateful adaptive tutoring system.",
        reason: ["Most ChatGPT wrappers are stateless and don't track what students struggle with.", "Wanted a system that mathematically decays confidence and forces 'Revision Mode' if students fail."],
      },
      {
        topic: "Qdrant",
        decision: "Use Qdrant for vector storage.",
        reason: ["Written in Rust for high-throughput.", "Supports local file-based storage for zero-container local dev, but scales to cloud seamlessly."],
        alternatives: ["Pinecone", "Chroma", "FAISS"]
      },
      {
        topic: "Embeddings",
        decision: "Use all-MiniLM-L6-v2 locally.",
        reason: ["Produces 384-dimensional vectors (much smaller than OpenAI's 1536).", "Uses less RAM, runs locally at zero API cost without a GPU, excellent semantic matching."],
      },
      {
        topic: "Reranking",
        decision: "Use ms-marco-MiniLM-L-6 cross-encoder.",
        reason: ["Cosine similarity finds topical matches but fails at contextual nuance (e.g. 'cat ate mouse' vs 'mouse ate cat').", "Reranking scores query and chunk together to prevent hallucinations."],
      },
      {
        topic: "Groq",
        decision: "Use Groq API for LLM inference.",
        reason: ["LPU architecture achieves 800+ tokens/sec.", "Near-instant Time-To-First-Token (TTFT) prevents dead UX for students waiting for answers."],
      },
      {
        topic: "Chunking",
        decision: "Overlapping fixed-size with sentence-boundary awareness.",
        reason: ["512 chars with 50 char overlap.", "Scans last 50 chars for punctuation to break cleanly, ensuring LLM never gets a grammatically broken thought."],
      }
    ],
    challenges: [
      "Building a Dual-Retrieval pipeline to handle requests like 'Read this page by page', which breaks standard semantic search.",
      "Parsing PDF tables. PyPDF2 mangled tabular data. Ripped it out for PyMuPDF to preserve tables as Markdown before embedding."
    ],
    limitations: [
      "The TopicService relies on regex-based keyword dictionaries which struggles with highly niche sub-topics or synonyms."
    ],
    future: [
      "Implement Semantic Caching using Redis to instantly return identical queries without running the embedding/LLM pipeline again.",
      "Replace regex topic detection with a lightweight zero-shot classification model (e.g., spaCy)."
    ],
    evidence: [
      "document_service.py",
      "embedding_service.py"
    ],
    githubUrl: "https://github.com/Omhari66/adaptive-ai-tutor"
  },
  {
    id: "project-smartomnisentinel",
    title: "SmartOmniSentinel",
    summary: "A real-time computer-vision incident detection system.",
    problem:
      "Standard security systems require human monitoring to detect incidents. This project automates threat detection by running an end-to-end ML pipeline on live video streams.",
    approach:
      "Built a complete inference pipeline: Video → YOLOv8 Object Detection → Centroid Tracking → Pose Estimation → Temporal Feature Extraction → GRU Classification → Multi-Signal Risk Scoring → Incident Detection.",
    result:
      "Achieved a validation F1-score of 0.734 using class-imbalance correction and data augmentation. Deployed with a FastAPI backend, WebSocket event streaming, and tamper-evident evidence management.",
    tags: ["Python", "PyTorch", "YOLOv8", "OpenCV", "FastAPI", "PostgreSQL", "Docker", "GRU"],
    links: [
      { label: "GitHub", url: "https://github.com/Omhari66/smart-omnisentinel-final/tree/main/smart-omnisentinel" },
    ],
    media: [
      { type: "image", src: "/projects/smartomnisentinel/demo.jpg" },
    ],
    accentColor: "#00D9B1",  // Teal
    signatureInteraction: "terminal-reveal",
    
    // --- AGENT KNOWLEDGE LAYER ---
    architecture: [
      {
        id: "video_input",
        name: "Video Input",
        icon: "Video",
        role: "Ingests raw CCTV video streams.",
        output: "RGB frames at 4 FPS",
      },
      {
        id: "yolo_pose",
        name: "YOLOv8 Pose Estimation",
        icon: "Activity",
        role: "Extracts human skeletal keypoints to reduce computational load and lighting variance.",
        input: "RGB frames",
        output: "17 keypoints per person",
        decisionTopic: "YOLOv8 Pose",
      },
      {
        id: "centroid_tracking",
        name: "Centroid Tracking",
        icon: "Crosshair",
        role: "Maintains temporal identity of individuals across frames.",
        input: "Keypoint bounding boxes",
        output: "Tracked IDs",
      },
      {
        id: "temporal_features",
        name: "Temporal Feature Extraction",
        icon: "TrendingUp",
        role: "Calculates velocities and angles between joints over time.",
        input: "Tracked keypoints",
        output: "34-dimensional feature vectors",
      },
      {
        id: "gru_classifier",
        name: "GRU Classifier",
        icon: "Brain",
        role: "Analyzes 4-second temporal sequences to classify actions like fighting or falling.",
        input: "16-frame sliding window of feature vectors",
        output: "Action probabilities",
        decisionTopic: "GRU",
        evidenceIds: ["temporal_model.py"],
      },
      {
        id: "temporal_smoother",
        name: "Temporal Smoother",
        icon: "Waveform",
        role: "Eliminates flickering false positives by voting across recent frames.",
        input: "Raw action probabilities",
        output: "Smoothed predictions",
        decisionTopic: "Temporal Smoother",
      },
      {
        id: "risk_scorer",
        name: "Risk Scorer",
        icon: "ShieldAlert",
        role: "Fuses smoothed predictions into a final threat level and triggers alerts.",
        input: "Smoothed predictions",
        output: "Incident alerts",
      }
    ],
    performance: {
      "FPS": "4",
      "F1 Score": "0.806",
      "Precision": "0.75",
      "Recall": "0.87"
    },
    decisions: [
      {
        topic: "YOLOv8 Pose",
        decision: "Use keypoints instead of raw RGB video.",
        reason: ["Raw pixels for action recognition are too computationally heavy and confused by lighting/clutter.", "Skeletons reduce data to pure body mechanics, making it lightweight for edge deployment and highly robust."],
        alternatives: ["3D CNNs", "Raw Video Analysis"]
      },
      {
        topic: "GRU",
        decision: "Use GRU over LSTM or Transformers.",
        reason: ["Fewer gates than LSTM makes it computationally lighter while maintaining identical short-term temporal performance.", "Transformers were overkill and too slow for edge-inference."],
        alternatives: ["LSTM", "Transformers"]
      },
      {
        topic: "Sliding Window",
        decision: "Use a 16-frame sliding window at 4 FPS.",
        reason: ["Equals exactly 4 seconds of context.", "Long enough to distinguish a fight from a sudden jump, short enough to trigger alerts while the event happens."],
      },
      {
        topic: "Temporal Smoother",
        decision: "Implement a sliding majority vote (5 out of last 8).",
        reason: ["Prevents flickering false positives caused by a single weird pose detection frame."],
      }
    ],
    challenges: [
      "ID switching during close-quarters tracking. Centroid trackers swap IDs when fighters overlap, breaking the temporal sequence. Tuned persistence frames to fix this."
    ],
    limitations: [
      "Relies on 2D pose estimation. YOLO struggles to extract keypoints in highly crowded scenes where lower bodies are occluded.",
      "Gemini Vision API for scene summaries requires an active internet connection."
    ],
    future: [
      "Upgrade centroid tracker to ByteTrack or DeepSORT for better re-identification during heavy occlusions.",
      "Explore 3D pose estimation to better understand depth and body orientation."
    ],
    evidence: [
      "temporal_model.py",
      "dataset_builder.py",
      "Start_Project.bat"
    ],
  },
  {
    id: "project-khabar24times",
    title: "KHABAR24TIMES",
    summary: "A live production news publishing platform developed for an independent client.",
    problem:
      "A media organization needed a highly robust, scalable, and role-based CMS capable of handling complex editorial workflows and high traffic without performance degradation.",
    approach:
      "Architected a 3-tier Service-Repository system. Implemented an editorial state machine (Draft → Review → Legal Check → Publish) backed by a 4-tier granular RBAC system. Integrated TipTap, signed Cloudinary uploads, and automated PDF/QR press-badge generation.",
    result:
      "Successfully launched a production-grade platform featuring one-click rollbacks, soft-delete recovery, Incremental Static Regeneration, and comprehensive Playwright E2E testing.",
    tags: ["Next.js 14", "TypeScript", "PostgreSQL", "Docker", "Playwright", "TipTap", "Cloudinary"],
    links: [
      { label: "GitHub", url: "https://github.com/Omhari66/khabar-24-times" },
      { label: "Live Site", url: "https://khabar24times.com" },
    ],
    media: [
      { type: "image", src: "/projects/khabar/screen-1.jpg" },
    ],
    accentColor: "#F59E0B",  // Amber
    signatureInteraction: "before-after",
    
    // --- AGENT KNOWLEDGE LAYER ---
    architecture: [
      {
        id: "nextjs",
        name: "Next.js 14 App Router",
        icon: "Layout",
        role: "Provides SSR/ISR for instant page loads and unified frontend/CMS.",
        decisionTopic: "Next.js",
      },
      {
        id: "postgresql",
        name: "PostgreSQL Database",
        icon: "Database",
        role: "Relational database ensuring data integrity for complex editorial schemas.",
        decisionTopic: "PostgreSQL",
        evidenceIds: ["db-stats.cjs"],
      },
      {
        id: "prisma",
        name: "Prisma ORM",
        icon: "Box",
        role: "Provides type-safe database queries.",
      },
      {
        id: "service_repo",
        name: "Service-Repository Layer",
        icon: "Layers",
        role: "Separates business logic and permissions from raw HTTP API routes.",
        decisionTopic: "Service-Repository Architecture",
      },
      {
        id: "cloudinary",
        name: "Cloudinary Pipeline",
        icon: "Cloud",
        role: "Handles image compression, resizing, and secure signed uploads.",
        evidenceIds: ["next.config.mjs"],
      }
    ],
    features: [
      "4-tier RBAC (Admin, Editor, Reporter, User)",
      "Editorial Workflow (Draft → Review → Legal Check → Publish)",
      "Versioning and one-click rollback",
      "Soft delete",
      "Incremental Static Regeneration (ISR)",
      "Automated PDF/QR Press-Badge Generation"
    ],
    decisions: [
      {
        topic: "Next.js",
        decision: "Use Next.js 14 App Router.",
        reason: ["SEO and initial page load speed are non-negotiable for a news portal.", "SSR and ISR serve cached HTML instantly while keeping content fresh.", "Allowed building public site and secure CMS in a single unified repo."],
      },
      {
        topic: "PostgreSQL",
        decision: "Use PostgreSQL instead of NoSQL.",
        reason: ["News CMS is inherently relational (Article -> Category -> Author -> Comments).", "Enforces data integrity. Prisma ORM made querying incredibly type-safe."],
      },
      {
        topic: "Service-Repository Architecture",
        decision: "Separate Prisma queries from API routes.",
        reason: ["Keeps codebase maintainable.", "API routes handle HTTP, Service layer handles business rules (permissions), Repository handles raw DB queries."],
      },
      {
        topic: "Versioning",
        decision: "Save snapshots on every major edit.",
        reason: ["In live journalism, mistakes happen.", "Provides a 'panic button' for editors to instantly restore a previous version rather than taking the site down while investigating errors."],
      }
    ],
    challenges: [
      "WhatsApp Link Preview Failure. High-res cover photos (2MB+) were failing to show on WhatsApp shares because WhatsApp Android drops OG images over 300KB.",
      "Fixed by intercepting Cloudinary URLs in Next.js metadata and injecting transformation parameters to resize/compress images specifically for OG tags, guaranteeing <100KB."
    ],
    limitations: [],
    future: [],
    evidence: [
      "db-stats.cjs",
      "next.config.mjs"
    ],
    demoUrl: "https://www.khabar24times.in"
  },
  {
    id: "project-ps26034",
    title: "AI Legal Metrology (PS26034)",
    summary: "AI-assisted compliance platform built for the Smart India Hackathon 2026.",
    problem:
      "Inspectors struggle to manually verify FMCG packaging against Legal Metrology laws. The system automates compliance inspection by fusing OCR and Multimodal AI.",
    approach:
      "Active Capture Engine → Multi-image fusion → Primary OCR (EasyOCR) + Secondary OCR (Tesseract) + VLM (Gemini) → Deterministic Rule Engine → Reconcile Dashboard.",
    result:
      "Developed a robust pipeline with 275 passing tests covering multi-image OCR fusion and deterministic legal rule engines.",
    tags: ["Python", "FastAPI", "Gemini VLM", "Tesseract", "EasyOCR", "React Native", "Next.js"],
    links: [
      { label: "GitHub", url: "https://github.com/Omhari66/PS26034" }
    ],
    media: [
      { type: "image", src: "/projects/sih/screen-1.jpg" },
    ],
    accentColor: "#3B82F6",  // Blue
    signatureInteraction: "live-embed",
    
    // --- AGENT KNOWLEDGE LAYER ---
    architecture: [
      {
        id: "image_capture",
        name: "Image Capture",
        icon: "Camera",
        role: "Acquires product packaging images and runs quality gate checks.",
        evidenceIds: ["quality.py"],
      },
      {
        id: "primary_ocr",
        name: "Primary OCR",
        icon: "ScanText",
        role: "Scans full image for textual bounding boxes.",
      },
      {
        id: "secondary_ocr",
        name: "Secondary OCR (Tesseract)",
        icon: "Search",
        role: "Zooms into specific bounding boxes for independent cross-checking.",
        decisionTopic: "Tesseract",
      },
      {
        id: "vlm_processing",
        name: "VLM Processing (Gemini)",
        icon: "Sparkles",
        role: "Provides semantic reasoning to identify specific fields like MRP or Date.",
        decisionTopic: "Multimodal (VLM + OCR)",
        evidenceIds: ["field_extractor.py"],
      },
      {
        id: "evidence_fusion",
        name: "Evidence Fusion Layer",
        icon: "Combine",
        role: "Combines outputs from multiple AI engines. Flags human review if engines conflict.",
        decisionTopic: "Conflict Handling",
      },
      {
        id: "compliance_engine",
        name: "Compliance Rule Engine",
        icon: "ShieldCheck",
        role: "Applies exact Indian Legal Metrology laws using deterministic Python rules, avoiding LLM hallucinations.",
        decisionTopic: "Compliance Engine",
        evidenceIds: ["compliance_engine.py", "tests/"],
      }
    ],
    decisions: [
      {
        topic: "Multimodal (VLM + OCR)",
        decision: "Use both VLM and OCR instead of just OCR.",
        reason: ["OCR provides provenance (exact bounding boxes) but lacks semantic understanding (can't distinguish a random barcode from an MRP).", "VLM provides semantic reasoning but can hallucinate.", "Fusion leverages strengths of both. No single model is trusted blindly."],
      },
      {
        topic: "Tesseract",
        decision: "Use as Secondary OCR Engine.",
        reason: ["Used for independent cross-checking.", "After primary engine scans the whole image, Tesseract zooms into specific bounding boxes to re-read them. Matches cause confidence to skyrocket."],
      },
      {
        topic: "Conflict Handling",
        decision: "Do not automatically fail products on AI conflict.",
        reason: ["If AI engines disagree, EvidenceState is marked CONFLICTING.", "Forces a human inspector to REVIEW the discrepancy rather than failing legally compliant products due to AI error."],
      },
      {
        topic: "Compliance Engine",
        decision: "Use a pure deterministic Python function for final decision.",
        reason: ["Absolutely no LLMs involved in the final legal decision.", "Uses an exact decision table based on Indian Legal Metrology laws comparing AI EvidenceState against required fields."],
      }
    ],
    challenges: [
      "PaddleOCR lacking Python 3.14 Windows wheels forced use of slower EasyOCR.",
      "Missing Tesseract binaries on local Windows triggered single_engine_only safety mode."
    ],
    limitations: [
      "Advanced cylindrical unwrapping for highly curved bottles is not fully implemented."
    ],
    future: [
      "Downgrade to Python 3.12 to unlock PaddleOCR.",
      "Enable CUDA GPU acceleration to drop image processing times from 90s to 3s."
    ],
    evidence: [
      "compliance_engine.py",
      "quality.py",
      "field_extractor.py",
      "tests/"
    ]
  }
];

export default projects;
