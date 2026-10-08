"use client";

import Link from "next/link";
import { useState } from "react";
import tracksJson from "@/data/resumeTracks.json";
import {
  header,
  education,
  technicalSkills,
  professionalExperience,
  projectsGroup,
  projects,
  publications,
  bookChapter,
  extracurricular,
  awards,
  type Role,
} from "@/data/resume";
import { profile } from "@/data/profile";

type Version = "full" | "designer" | "pm" | "uxr" | "business";

const versions: { id: Version; label: string; file: string; blurb: string }[] = [
  { id: "full", label: "Full", file: "/resume/Resume_SangyunLee_Full.pdf", blurb: "Everything, with awards and extra-curriculars." },
  { id: "designer", label: "Designer", file: "/resume/Resume_SangyunLee_Designer.pdf", blurb: "Service and product design first." },
  { id: "pm", label: "PM", file: "/resume/Resume_SangyunLee_PM.pdf", blurb: "Product and strategy first." },
  { id: "uxr", label: "UX Research", file: "/resume/Resume_SangyunLee_UXR.pdf", blurb: "Research methods first." },
  { id: "business", label: "Business", file: "/resume/Resume_SangyunLee_Business.pdf", blurb: "Market and customer analytics first." },
];

type TrackBlock =
  | { type: "line"; label: string; text: string }
  | { type: "entry"; title: string; right: string; sub: string; subRight: string; bullets: string[] };
type TrackDoc = { name: string; contact: string; sections: { title: string; blocks: TrackBlock[] }[] };
const tracks = tracksJson as unknown as Record<string, TrackDoc>;

const linkFor = (title: string): string | undefined => {
  const t = title.toLowerCase();
  if (t.includes("vip concierge")) return "/project/vip-concierge-robot";
  if (t.includes("rehabilitation center") || t.includes("aging with disability")) return "/project/disability-as-market";
  if (t.includes("saihst") || t.includes("inpatient rehabilitation")) return "/project/saihst-hospital-metaverse";
  if (t.includes("starfield") || t.includes("mega shopping mall")) return "/project/starfield-existing-branch";
  if (t.includes("mini-fridge")) return "/project/samsung-lifelog-minifridge";
  if (t.includes("ministry of culture")) return "/project/mcst-public-communication";
  if (t.includes("disability persona augmentation")) return "/research/disability-persona-augmentation";
  if (t.includes("patterning military")) return "/research/military-life-cycle-pattern";
  return undefined;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-serif text-2xl font-semibold uppercase tracking-wide text-accent">{title}</h2>
      <div className="mt-2 border-t-2 border-accent" />
      <div>{children}</div>
    </section>
  );
}

// splits "Business Developer, Team (long parenthetical)" so the parenthetical sits in a lighter, smaller voice
function Title({ text }: { text: string }) {
  const i = text.indexOf(" (");
  if (i < 0 || !text.endsWith(")")) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)} <span className="font-sans text-sm font-normal text-muted">{text.slice(i + 1)}</span>
    </>
  );
}

function Employer({ text }: { text: string }) {
  const parts = text.split(" | ");
  return (
    <>
      <span className="font-semibold text-accent">{parts[0]}</span>
      {parts.length > 1 && <span className="text-muted"> | {parts.slice(1).join(" | ")}</span>}
    </>
  );
}

function Entry({
  title,
  right,
  sub,
  subRight,
  bullets,
  href,
  links,
  employer,
  leadOrg,
}: {
  title: string;
  right?: string;
  sub?: string;
  subRight?: string;
  bullets: string[];
  href?: string;
  links?: { label: string; href: string }[];
  employer?: boolean;
  leadOrg?: boolean;
}) {
  return (
    <div className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-lg font-semibold text-foreground">
          {leadOrg ? (
            <>
              <span className="text-accent">{title.split(" | ")[0]}</span>
              {title.includes(" | ") && <span className="text-base font-normal text-muted"> | {title.split(" | ").slice(1).join(" | ")}</span>}
            </>
          ) : (
            <Title text={title} />
          )}
        </p>
        {right && <p className="text-sm text-muted">{right}</p>}
      </div>
      {(sub || subRight) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm italic text-muted">{employer && sub ? <Employer text={sub} /> : sub}</p>
          {subRight && <p className="text-sm italic text-muted">{subRight}</p>}
        </div>
      )}
      {bullets.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
          {bullets.map((b, i) => {
            const m = b.match(/^(Relevant Coursework|Thesis):\s*(.*)$/);
            return m ? (
              <li key={i} className="list-none pl-0 -ml-5">
                <span className="font-medium text-foreground">{m[1]}:</span> {m[2]}
              </li>
            ) : (
              <li key={i}>{b}</li>
            );
          })}
        </ul>
      )}
      {(href || links) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {href && (
            <Link href={href} className="text-sm text-accent underline underline-offset-4">
              View project →
            </Link>
          )}
          {links?.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-accent underline underline-offset-4">
              {l.label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function RoleEntry({ r, employer, leadOrg }: { r: Role; employer?: boolean; leadOrg?: boolean }) {
  return leadOrg ? (
    <Entry title={r.org} right={r.period} sub={r.title} subRight={r.location} bullets={r.bullets} href={r.href} links={r.links} leadOrg />
  ) : (
    <Entry title={r.title} right={r.period} sub={r.org} subRight={r.location} bullets={r.bullets} href={r.href} links={r.links} employer={employer} />
  );
}

function FullView() {
  return (
    <>
      <Section title="Education">
        {education.map((e, i) => (
          <Entry
            key={i}
            title={e.degree}
            right={e.period}
            sub={e.school}
            bullets={[...(e.coursework ? [`Relevant Coursework: ${e.coursework}`] : []), ...(e.thesis ? [`Thesis: ${e.thesis}`] : [])]}
          />
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
          <RoleEntry key={i} r={r} employer />
        ))}
      </Section>
      <Section title="Projects">
        <div className="pt-1">
          <p className="font-serif text-lg font-semibold text-accent">{projectsGroup.org.split(" | ")[0]}</p>
          <p className="text-sm italic text-muted">
            {projectsGroup.org.split(" | ").slice(1).join(" | ")} · {projectsGroup.location}
          </p>
        </div>
        <div className="mt-4 border-l-2 border-border pl-5">
          {projects.map((r, i) => (
            <RoleEntry key={i} r={r} />
          ))}
        </div>
      </Section>
      <Section title="Publications">
        {[...publications, bookChapter].map((r, i) => (
          <RoleEntry key={i} r={r} />
        ))}
      </Section>
      <Section title="Extra-Curricular Activity">
        {extracurricular.map((r, i) => (
          <RoleEntry key={i} r={r} leadOrg />
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
    </>
  );
}

function TrackView({ doc }: { doc: TrackDoc }) {
  return (
    <>
      {doc.sections.map((s) => {
        const isEdu = s.title === "EDUCATION";
        const isExp = s.title === "PROFESSIONAL EXPERIENCE";
        return (
          <Section key={s.title} title={s.title}>
            {s.blocks.every((b) => b.type === "line") ? (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                {s.blocks.map((b, i) =>
                  b.type === "line" ? (
                    <p key={i}>
                      {b.label && <span className="font-medium text-foreground">{b.label}:</span>} {b.text}
                    </p>
                  ) : null
                )}
              </div>
            ) : (
              s.blocks.map((b, i) => {
                if (b.type !== "entry") return null;
                if (isEdu) {
                  const [deg, ...rest] = b.title.split(" | ");
                  return <Entry key={i} title={deg} right={b.right} sub={rest.join(" | ")} bullets={b.bullets} />;
                }
                return (
                  <Entry
                    key={i}
                    title={b.title}
                    right={b.right}
                    sub={b.sub}
                    subRight={b.subRight}
                    bullets={b.bullets}
                    href={isExp ? undefined : linkFor(b.title)}
                    employer={isExp}
                  />
                );
              })
            )}
          </Section>
        );
      })}
    </>
  );
}

export default function ResumeView() {
  const [version, setVersion] = useState<Version>("full");
  const cur = versions.find((v) => v.id === version)!;

  const pick = (v: (typeof versions)[number]) => {
    setVersion(v.id);
    const a = document.createElement("a");
    a.href = v.file;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <div className="mb-10 rounded-2xl border border-border bg-surface p-6">
        <p className="font-serif text-xl font-semibold text-foreground">{header.name}</p>
        <p className="mt-1 text-sm text-muted">
          {profile.location} | {profile.email} | {profile.phone} | idealist-sangyun-lee.vercel.app
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-wider text-muted">Pick a version · downloads and reshapes the page</span>
        </div>
        <div role="tablist" aria-label="Resume version" className="mt-2 flex flex-wrap gap-2">
          {versions.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={version === v.id}
              type="button"
              onClick={() => pick(v)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                version === v.id ? "border-accent bg-accent text-white" : "border-border text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {v.label}
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Email me
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">
          Showing the <span className="font-medium text-foreground">{cur.label}</span> version. {cur.blurb}{" "}
          <a href={cur.file} download className="text-accent underline underline-offset-4">
            Download again (PDF)
          </a>
        </p>
      </div>

      <div key={version} className="animate-[resumeIn_.35s_ease-out]">
        {version === "full" ? <FullView /> : <TrackView doc={tracks[version]} />}
      </div>
      <style>{`@keyframes resumeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
