import { PageHeader } from "@/components/ui";
import ResumeView from "@/components/ResumeView";

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader eyebrow="Resume & Contact" title="Full career history, and how to reach me." />
      <ResumeView />
    </div>
  );
}
