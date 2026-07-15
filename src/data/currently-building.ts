export type BuildStatus = "Planning" | "In Progress" | "Completed";

export interface CurrentlyBuildingItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  status: BuildStatus;
  icon: string;
  coverGradient: string;
}

/**
 * Side projects in active development. Kept as local static data (rather
 * than routed through the CMS/admin pipeline) since these change status
 * frequently and don't need the full portfolio content workflow.
 */
export const CURRENTLY_BUILDING: CurrentlyBuildingItem[] = [
  {
    id: "applypilot",
    name: "ApplyPilot",
    tagline: "AI Job Automation Platform",
    description:
      "An AI-driven platform that automates job discovery, resume tailoring, and application submission end-to-end, so job seekers can apply at scale without losing personalization.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Celery", "Redis", "LLMs"],
    status: "In Progress",
    icon: "🧭",
    coverGradient: "from-emerald-400/25 to-teal-500/20",
  },
  {
    id: "api-detective",
    name: "API Detective",
    tagline: "Automated API Discovery & Documentation Tool",
    description:
      "A backend tool that crawls a codebase to auto-detect REST endpoints, infer request/response schemas, and generate live, always-in-sync API documentation.",
    stack: ["Python", "Django", "OpenAPI", "Docker", "PostgreSQL"],
    status: "In Progress",
    icon: "🔍",
    coverGradient: "from-sky-400/25 to-indigo-500/20",
  },
  {
    id: "ai-chat-app",
    name: "AI Chat Application",
    tagline: "Real-Time GenAI Chat Platform",
    description:
      "A production-style chat application with streaming LLM responses, conversation memory, and multi-model support, built to explore real-time AI product architecture.",
    stack: ["FastAPI", "WebSockets", "Redis", "React", "LLMs"],
    status: "Planning",
    icon: "💬",
    coverGradient: "from-violet-400/25 to-fuchsia-500/20",
  },
  {
    id: "farm-management-system",
    name: "Farm Management System",
    tagline: "End-to-End Farm Operations Platform",
    description:
      "A Django-based system for tracking crops, livestock, inventory, and expenses on a farm, with role-based dashboards and automated reporting for owners and workers.",
    stack: ["Django", "Django REST Framework", "MySQL", "AWS", "Docker"],
    status: "Completed",
    icon: "🌾",
    coverGradient: "from-amber-400/25 to-lime-500/20",
  },
];
