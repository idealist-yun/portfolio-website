"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import VipRobotSim from "@/components/VipRobotSim";

const RED = "#c8431f";
const INDIGO = "#24386b";
const MUTED = "#6b655a";

type Step = {
  n: string;
  field: string;
  title: string;
  body: string;
  tools: string[];
  status?: string;
  project: string;
  href: string;
  linkLabel: string;
};

// Four steps of one method. Each slide has the method on top and one worked example below.
const steps: Step[] = [
  {
    n: "01",
    field: "Design thinking",
    title: "Start by understanding people.",
    body: "To understand what people actually want, I implement various mixed-methods approaches, including interviews, field studies, and surveys, and lay the findings out in visualizations such as journey maps and service blueprints. The patterns that emerge become a design direction the team can decide on.",
    tools: ["Mixed methods", "Interviews", "Field studies", "Surveys", "Journey mapping", "Service blueprint", "Miro", "Figma"],
    project: "Disability service design · Military HR system",
    href: "/project/disability-as-market",
    linkLabel: "Read the project →",
  },
  {
    n: "02",
    field: "Data + Business",
    title: "Back it with data.",
    body: "To put a strategy on evidence, I turn behavior and market data into data-driven analysis and personas. I use traditional data analysis, such as demand forecasting, to read the market, and sociological and computational methods, such as network analysis, process mining, and heatmaps, to visualize how people actually move and choose. All of it follows research-based methodology drawn from the literature.",
    tools: ["Network analysis", "Process mining", "Heatmap", "Data visualization", "Demand forecasting", "Research design", "Python", "R", "Tableau", "Power BI"],
    project: "Starfield · Samsung life-log",
    href: "/project/starfield-existing-branch",
    linkLabel: "Read the project →",
  },
  {
    n: "03",
    field: "Prototype",
    title: "Design and simulate prototypes of products, services, systems, and strategy.",
    body: "Once the strategy is set on that evidence, I prototype it quickly and lean, and test it. For products, that means 3D printing and laser cutting; for services, data visualization, simulation, and virtual prototypes in Unity; and for systems, a fully virtual environment where simulations produce a first draft and show where timing, routes, or hand-offs break. Each test checks a hypothesis about the prototype, keeping the strategic direction right.",
    tools: ["3D printing", "Laser cutting", "Unity", "SolidWorks", "Figma", "Service blueprint", "Rapid prototyping"],
    project: "VIP concierge robot · Raemian metaverse",
    href: "/project/vip-concierge-robot",
    linkLabel: "Read the project →",
  },
  {
    n: "04",
    field: "Simulation",
    title: "Test strategies on agentic simulation.",
    body: "Finally, I verify with data how the strategy will land with real users. Where the small, lean prototypes of the previous step give a first read, I turn data-driven defined personas into generative agents and run them through service scenarios in simulated environments, 2D today and 3D in development, to see which step breaks and why.",
    tools: ["Generative agents", "Data-driven personas", "Agent simulation", "Python", "2D / 3D environments"],
    status: "In progress",
    project: "IDD agent testbed",
    href: "/research/idd-agent-simulation",
    linkLabel: "Read the research →",
  },
];

function Visual({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div className="grid gap-3 md:grid-cols-[7fr_5fr]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-black/10 bg-white">
          <Image src="/images/full/disability-as-market-04.jpg" alt="An interview in progress with a map on the table" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="grid gap-3">
          <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-black/10 bg-white">
            <Image src="/images/full/disability-as-market-05.jpg" alt="Insights grouped on sticky notes during a hackathon" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-black/10 bg-white">
            <Image src="/images/full/military-hr-big-data-03.jpg" alt="Interview coding results for 18 participants" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </div>
    );
  }
  if (i === 1) {
    const tiles: [string, string, string][] = [
      ["/images/full/starfield-existing-branch-01.jpg", "Network analysis", "object-contain"],
      ["/images/full/starfield-existing-branch-04.jpg", "Process mining", "object-contain"],
      ["/images/full/samsung-lifelog-minifridge-04.jpg", "Heatmap + network", "object-cover object-top"],
      ["/images/full/starfield-existing-branch-02.jpg", "Persona model", "object-contain"],
    ];
    return (
      <div className="grid gap-3 md:grid-cols-[4fr_8fr]">
        <div className="relative aspect-[742/800] overflow-hidden rounded-lg border border-black/10 bg-white">
          <Image src="/images/home/step2-personas.jpg" alt="Personas drawn from a customer-network graph" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map(([src, label, fit]) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-white">
              <Image src={src} alt={label} fill sizes="(min-width: 768px) 30vw, 50vw" className={fit} />
              <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="grid gap-3">
        <div className="overflow-hidden rounded-lg border border-black/10 bg-[#fbf8ef] p-4 sm:p-6">
          <VipRobotSim />
        </div>
        <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-black/10 bg-white">
          <Image src="/images/full/samsung-raemian-metaverse-04.jpg" alt="Metaverse scenarios prototyped in Unity and tested with students" fill sizes="(min-width: 768px) 90vw, 100vw" className="object-cover object-top" />
          <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
            Unity prototype · Raemian metaverse
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto aspect-[1042/744] max-h-[520px] overflow-hidden rounded-lg border border-black/10 bg-white">
      <Image src="/images/home/step4-agents.jpg" alt="Three agents moving through a simulated town" fill sizes="720px" className="object-cover" />
    </div>
  );
}

export default function HowIWork() {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const go = (n: number) => setI((n + steps.length) % steps.length);
  const s = steps[i];

  return (
    <section className="border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
      <div
        className="mx-auto max-w-[1240px] px-6 py-14"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.02]">
              This is how I <em style={{ color: INDIGO }}>work.</em>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
              Classic design thinking, data and business, and new methods, in one process.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            {steps.map((st, k) => (
              <button
                key={st.n}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Step ${st.n}: ${st.title}`}
                aria-current={k === i}
                className="rounded-full border px-3 py-1.5 transition-colors"
                style={k === i ? { background: INDIGO, borderColor: INDIGO, color: "#f3eee2" } : { borderColor: "rgba(0,0,0,0.25)", color: MUTED }}
              >
                {st.n}
              </button>
            ))}
          </div>
        </div>

        <article key={s.n} className="how-slide mt-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8">
            <span className="font-[family-name:var(--font-instrument)] text-6xl leading-none" style={{ color: RED }}>
              {s.n}
            </span>
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: INDIGO }}>
                {s.field}
              </p>
              <h3 className="font-[family-name:var(--font-instrument)] text-3xl leading-tight">{s.title}</h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
                {s.body}
              </p>
            </div>
            <ul className="flex max-w-[320px] flex-wrap gap-1.5 md:justify-end">
              {s.tools.map((t) => (
                <li key={t} className="rounded-full border border-black/20 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider" style={{ color: MUTED }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-6">
            <Visual i={i} />
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(i + d)}
                aria-label={d < 0 ? "Previous step" : "Next step"}
                className={`absolute top-[210px] z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-[#f3eee2]/90 text-lg shadow-[0_6px_16px_-6px_rgba(29,27,24,0.5)] backdrop-blur transition-colors hover:bg-black hover:text-[#f3eee2] ${d < 0 ? "left-3" : "right-3"}`}
              >
                {d < 0 ? "←" : "→"}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <p className="font-[family-name:var(--font-instrument)] text-xl leading-tight">{s.project}</p>
              {s.status && (
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: RED }}>
                  {s.status}
                </span>
              )}
            </div>
            <Link href={s.href} className="font-mono text-[11px] uppercase tracking-wider underline underline-offset-4" style={{ color: RED }}>
              {s.linkLabel}
            </Link>
          </div>
        </article>
      </div>
      <style>{`.how-slide{animation:howIn .35s ease-out both}@keyframes howIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
