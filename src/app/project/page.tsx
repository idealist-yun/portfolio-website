import { PageHeader } from "@/components/ui";
import ProjectGrid from "@/components/ProjectGrid";

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="Project"
        title="What I've built with others."
        lede="Over the years I've pursued projects across retail, finance, healthcare, public sector, and the military — as part of a journey toward becoming a strategic designer focused on vulnerability. Filter by stage or domain below."
      />

      <div className="mb-14 max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          These experiences distill into three stages. <span className="text-foreground font-medium">Basic</span>{" "}
          built a solid foundation in design thinking — the Double Diamond&apos;s
          discover, define, develop, deliver. <span className="text-foreground font-medium">Data-Driven</span>{" "}
          strengthened the first diamond by teaching me to analyze personas
          quantitatively and extract behavioral insight from real data.{" "}
          <span className="text-foreground font-medium">AI-Driven</span> is the
          newest stage — using AI personas and virtual simulation to
          accelerate rapid prototyping in the second diamond, testing and
          refining solutions before they reach the real world.
        </p>
      </div>

      <ProjectGrid />
    </div>
  );
}
