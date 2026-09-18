import { PageHeader } from "@/components/ui";
import { profile } from "@/data/profile";
import {
  education,
  workExperience,
  publications,
  extracurricular,
  awards,
  skills,
  type Entry,
} from "@/data/resume";

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <div className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-lg font-semibold text-foreground">
          {entry.org}
        </p>
        <p className="text-sm text-muted">{entry.period}</p>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm italic text-muted">{entry.role}</p>
        {entry.location && (
          <p className="text-sm italic text-muted">{entry.location}</p>
        )}
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
        {entry.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="font-serif text-2xl font-semibold text-accent">
        {title}
      </h2>
      <div className="mt-2 border-t-2 border-accent" />
      <div>{children}</div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader
        eyebrow="Resume & Contact"
        title="Full career history, and how to reach me."
      />

      <div className="mb-14 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex-1 min-w-[200px]">
          <p className="font-serif text-lg font-semibold text-foreground">
            {profile.name}
          </p>
          <p className="text-sm text-muted">
            {profile.location} · {profile.email} · {profile.phone}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={profile.resumePdf}
            download
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Download full resume (PDF)
          </a>
          <a
            href={profile.resumeOnePagePdf}
            download
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            One-page version
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Email me
          </a>
        </div>
      </div>

      <Section title="Education">
        {education.map((e, i) => (
          <EntryBlock key={i} entry={e} />
        ))}
      </Section>

      <Section title="Work Experience">
        {workExperience.map((e, i) => (
          <EntryBlock key={i} entry={e} />
        ))}
      </Section>

      <Section title="Publications">
        {publications.map((e, i) => (
          <EntryBlock key={i} entry={e} />
        ))}
      </Section>

      <Section title="Extra-Curricular Activity">
        {extracurricular.map((e, i) => (
          <EntryBlock key={i} entry={e} />
        ))}
      </Section>

      <Section title="Awards & Honors">
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-muted">
          {awards.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section title="Skills">
        <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          <p>
            <span className="font-medium text-foreground">
              Tools & Software:
            </span>{" "}
            {skills.tools.join(", ")}
          </p>
          <p>
            <span className="font-medium text-foreground">Languages:</span>{" "}
            {skills.languages.join(", ")}
          </p>
        </div>
      </Section>
    </div>
  );
}
