import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { profile } from "@/data/profile";
import {
  header,
  education,
  technicalSkills,
  professionalExperience,
  projectsGroup,
  projects,
  publications,
  extracurricular,
  awards,
  type Role,
} from "@/data/resume";

const downloads = [
  { label: "Full resume", file: "/resume/Resume_SangyunLee_Full.pdf" },
  { label: "Designer", file: "/resume/Resume_SangyunLee_Designer.pdf" },
  { label: "PM", file: "/resume/Resume_SangyunLee_PM.pdf" },
  { label: "UX Research", file: "/resume/Resume_SangyunLee_UXR.pdf" },
  { label: "Business", file: "/resume/Resume_SangyunLee_Business.pdf" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif text-2xl font-semibold uppercase tracking-wide text-accent">{title}</h2>
      <div className="mt-2 border-t-2 border-accent" />
      <div>{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

function RoleBlock({ r, lead = "title" }: { r: Role; lead?: "title" | "org" }) {
  return (
    <div className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-lg font-semibold text-foreground">{lead === "org" ? r.org : r.title}</p>
        <p className="text-sm text-muted">{r.period}</p>
      </div>
      {(r.org || r.location) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm italic text-muted">{lead === "org" ? r.title : r.org}</p>
          {r.location && <p className="text-sm italic text-muted">{r.location}</p>}
        </div>
      )}
      <Bullets items={r.bullets} />
      {r.href && (
        <Link href={r.href} className="mt-3 inline-block text-sm text-accent underline underline-offset-4">
          View project →
        </Link>
      )}
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader eyebrow="Resume & Contact" title="Full career history, and how to reach me." />

      <div className="mb-14 rounded-2xl border border-border bg-surface p-6">
        <p className="font-serif text-xl font-semibold text-foreground">{header.name}</p>
        <p className="mt-1 text-sm text-muted">
          {profile.location} | {profile.email} | {profile.phone} | idealist-sangyun-lee.vercel.app
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-muted">Download (PDF)</span>
          {downloads.map((d, i) => (
            <a
              key={d.file}
              href={d.file}
              download
              className={
                i === 0
                  ? "rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  : "rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              }
            >
              {d.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Email me
          </a>
        </div>
      </div>

      <Section title="Education">
        {education.map((e, i) => (
          <div key={i} className="border-t border-border py-6 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-serif text-lg font-semibold text-foreground">{e.degree}</p>
              <p className="text-sm text-muted">{e.period}</p>
            </div>
            <p className="text-sm italic text-muted">{e.school}</p>
            <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
              {e.coursework && (
                <p>
                  <span className="font-medium text-foreground">Relevant Coursework:</span> {e.coursework}
                </p>
              )}
              {e.thesis && (
                <p>
                  <span className="font-medium text-foreground">Thesis:</span> {e.thesis}
                </p>
              )}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Technical Skills">
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
          {technicalSkills.map((s) => (
            <p key={s.label}>
              <span className="font-medium text-foreground">{s.label}:</span> {s.items}
            </p>
          ))}
        </div>
      </Section>

      <Section title="Professional Experience">
        {professionalExperience.map((r, i) => (
          <RoleBlock key={i} r={r} />
        ))}
      </Section>

      <Section title="Projects">
        <div className="pt-1">
          <p className="font-serif text-lg font-semibold text-foreground">{projectsGroup.org}</p>
          <p className="text-sm italic text-muted">{projectsGroup.location}</p>
        </div>
        <div className="mt-4 border-l-2 border-border pl-5">
          {projects.map((r, i) => (
            <RoleBlock key={i} r={r} />
          ))}
        </div>
      </Section>

      <Section title="Publications">
        {publications.map((r, i) => (
          <RoleBlock key={i} r={r} />
        ))}
      </Section>

      <Section title="Extra-Curricular Activity">
        {extracurricular.map((r, i) => (
          <RoleBlock key={i} r={r} lead="org" />
        ))}
      </Section>

      <Section title="Awards & Honors">
        <ul className="mt-4 divide-y divide-border text-sm">
          {awards.map((a, i) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
              <span className="text-foreground">
                {a.title} <span className="italic text-muted">· {a.org}</span>
              </span>
              <span className="text-muted">{a.period}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
