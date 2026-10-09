import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import WorkGrid from "@/components/WorkGrid";

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="Work"
        title="Welcome to my past, present, and future!"
      />

      <p className="-mt-8 mb-12">
        <Link href="/work" className="text-base font-medium text-accent hover:underline">
          Work overview →
        </Link>
      </p>

      <Suspense fallback={null}>
        <WorkGrid />
      </Suspense>
    </div>
  );
}
