import { usePortfolio } from "@/context/PortfolioProvider";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { CalloutBlock } from "@/components/notion/CalloutBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { SECTION_SCROLL_MT } from "@/lib/layout";

export function AboutSection() {
  const { portfolio } = usePortfolio();
  return (
    <FadeIn>
      <section id="about" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>About</NotionHeading>
          <SectionMeta kind="Page" label="Callout" />
        </NotionBlock>
        <div className="mt-3 space-y-3">
          <CalloutBlock icon="💡" title="About me" variant="blue">
            {portfolio.profile.summary}
          </CalloutBlock>
          <CalloutBlock icon="🎯" title="Currently building" variant="yellow">
            Working on an AI-powered learning platform designed to help students
            prepare more effectively for competitive exams. The platform enables
            students to take AI-assisted mock tests, identifies their strengths
            and knowledge gaps, provides personalized study recommendations,
            explains concepts in an easy-to-understand manner, and offers
            detailed performance analytics to track progress over time. I'm
            contributing to the backend architecture, API development, database
            design, AI integrations, and building scalable services to support a
            seamless learning experience.
          </CalloutBlock>
        </div>
      </section>
    </FadeIn>
  );
}
