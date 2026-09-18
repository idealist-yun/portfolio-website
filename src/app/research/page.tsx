import { PageHeader } from "@/components/ui";
import ResearchList from "@/components/ResearchList";

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="Research"
        title="What I'm building the evidence for."
        lede="Published work and an active research pipeline, centered on data-driven persona modeling and AI-agent simulation — starting in disability contexts and now extending outward."
      />
      <ResearchList />
    </div>
  );
}
