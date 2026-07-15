export interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Year-by-year narrative of the backend journey, used by the Professional
 * Timeline section. Kept as local static data — it's a narrative summary
 * rather than structured CMS content.
 */
export const PROFESSIONAL_JOURNEY: JourneyMilestone[] = [
  {
    year: "2023",
    title: "Started backend development journey",
    description:
      "Began building server-side applications with Python, learning core web fundamentals, databases, and REST API design principles.",
    icon: "🌱",
  },
  {
    year: "2024",
    title: "Built production Django applications",
    description:
      "Shipped production-grade Django REST Framework services for real users — authentication, payments, and media pipelines included.",
    icon: "🛠️",
  },
  {
    year: "2025",
    title: "Worked with AWS, Docker, Redis, and Celery",
    description:
      "Took ownership of cloud deployments and async infrastructure — containerizing services, queuing background jobs, and scaling on AWS.",
    icon: "☁️",
  },
  {
    year: "2026",
    title: "Exploring AI, FastAPI, GenAI, and LLMs",
    description:
      "Expanding into high-performance async APIs with FastAPI and building GenAI-powered products on top of large language models.",
    icon: "🤖",
  },
];
