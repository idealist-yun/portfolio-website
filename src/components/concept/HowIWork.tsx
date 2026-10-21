"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
  projects: { label: string; href: string }[];
};

// Four steps of one method. Each slide has the method on top and one worked example below.
const steps: Step[] = [
  {
    n: "01",
    field: "Design thinking",
    title: "Start by understanding people.",
    body: "To understand what people actually want, I implement various mixed-methods approaches, including interviews, field studies, and surveys, and lay the findings out in visualizations such as journey maps and service blueprints. The patterns that emerge become a design direction the team can decide on.",
    tools: ["Mixed methods", "Interviews", "Field studies", "Surveys", "Journey mapping", "Service blueprint", "Miro", "Figma"],
    projects: [{ label: "Disability service design", href: "/project/disability-as-market" }, { label: "Military HR system", href: "/project/military-hr-big-data" }, { label: "Hospital inpatient app", href: "/project/saihst-hospital-metaverse" }, { label: "Veterans reintegration", href: "/project/veterans-reintegration" }, { label: "Public communication", href: "/project/mcst-public-communication" }, { label: "Undergraduate works", href: "/project/undergraduate-works" }, { label: "VIP concierge robot", href: "/project/vip-concierge-robot" }],
  },
  {
    n: "02",
    field: "Data + Business",
    title: "Back it with data, build strategies.",
    body: "To put a strategy on evidence, I turn behavior and market data into data-driven analysis and personas. I use traditional data analysis, such as demand forecasting, to read the market, and sociological and computational methods, such as network analysis, process mining, and heatmaps, to visualize how people actually move and choose. All of it follows research-based methodology drawn from the literature.",
    tools: ["Network analysis", "Process mining", "Heatmap", "Data visualization", "Demand forecasting", "Research design", "Python", "R", "Tableau", "Power BI"],
    projects: [{ label: "Starfield, existing branch", href: "/project/starfield-existing-branch" }, { label: "Starfield, new branch #1", href: "/project/starfield-new-branch-1" }, { label: "Starfield, new branch #2", href: "/project/starfield-new-branch-2" }, { label: "Samsung life-log", href: "/project/samsung-lifelog-minifridge" }, { label: "Samsung brand fandom", href: "/project/samsung-brand-fandom" }, { label: "Raemian metaverse", href: "/project/samsung-raemian-metaverse" }, { label: "Demand dashboard (AX)", href: "/project/samsung-ax-dashboard" }, { label: "Public communication", href: "/project/mcst-public-communication" }, { label: "Disability persona thesis", href: "/research/disability-persona-augmentation" }],
  },
  {
    n: "03",
    field: "Prototype",
    title: "Design and simulate prototypes of products, services, systems, and strategy.",
    body: "Once the strategy is set on that evidence, I prototype it quickly and lean, and test it. For products, that means 3D printing and laser cutting; for services, data visualization, simulation, and virtual prototypes in Unity; and for systems, a fully virtual environment where simulations produce a first draft and show where timing, routes, or hand-offs break. Each test checks a hypothesis about the prototype, keeping the strategic direction right.",
    tools: ["3D printing", "Laser cutting", "Unity", "SolidWorks", "Figma", "Service blueprint", "Rapid prototyping"],
    projects: [{ label: "VIP concierge robot", href: "/project/vip-concierge-robot" }, { label: "3D battlefield mapping", href: "/project/military-3d-battlefield-mapping" }, { label: "Raemian metaverse", href: "/project/samsung-raemian-metaverse" }, { label: "Hospital inpatient app", href: "/project/saihst-hospital-metaverse" }, { label: "Manufacturing digital twin", href: "/project/manufacturing-worker-training-ai" }, { label: "Bixby cooking assistant", href: "/project/samsung-bixby-cooking-assistant" }, { label: "The Greenhouse", href: "/greenhouse" }],
  },
  {
    n: "04",
    field: "Simulation",
    title: "Test strategies on agentic simulation.",
    body: "Finally, I verify with data how the strategy will land with real users. Where the small, lean prototypes of the previous step give a first read, I turn data-driven defined personas into generative agents and run them through service scenarios in simulated environments, 2D today and 3D in development, to see which step breaks and why.",
    tools: ["Generative agents", "Data-driven personas", "Agent simulation", "Python", "2D / 3D environments"],
    status: "In progress",
    projects: [{ label: "IDD agent testbed", href: "/research/idd-agent-simulation" }, { label: "Disability persona thesis", href: "/research/disability-persona-augmentation" }, { label: "Manufacturing digital twin", href: "/project/manufacturing-worker-training-ai" }],
  },
];

// The Greenhouse model is a heavy three.js scene, so it only loads when asked.
const GreenhouseToBe = dynamic(() => import("@/components/GreenhouseSceneToBe"), { ssr: false });

// Renders its child at a fixed design width and scales it down to the column.
function Scaled({ width, children }: { width: number; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [h, setH] = useState<number | undefined>(undefined);
  useEffect(() => {
    const o = outer.current;
    const n = inner.current;
    if (!o || !n) return;
    const upd = () => {
      const sc = Math.min(1, o.clientWidth / width);
      setK(sc);
      setH(n.offsetHeight * sc);
    };
    const ro = new ResizeObserver(upd);
    ro.observe(o);
    ro.observe(n);
    upd();
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={outer} style={{ height: h }} className="overflow-hidden">
      <div ref={inner} style={{ width, transform: `scale(${k})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

function GreenhousePanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-black/10 bg-[#fbf8ef] max-md:h-[340px] md:min-h-[260px] md:flex-[3]">
      <GreenhouseToBe embed />
    </div>
  );
}

// The agent lab boots a Python runtime in the browser (about 10 MB), so it only starts when asked.
// It then plays a ready-made run (one agent, the baseline daily-living scenario) right inside the tile.
function LabPanel() {
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  const started = useRef(false);
  const start = () => {
    const f = frame.current;
    const d = f?.contentDocument;
    const w = f?.contentWindow as (Window & { toggleAgent?: (id: string) => void; toggleScen?: (file: string) => void; runExperiment?: () => void }) | null | undefined;
    if (!f || !d || !w || started.current) return;
    started.current = true;
    let tries = 0;
    const iv = window.setInterval(() => {
      tries += 1;
      const pill = d.getElementById("engine-pill");
      if (tries > 240) return window.clearInterval(iv);
      if (!pill || !/ready/i.test(pill.textContent || "")) return;
      window.clearInterval(iv);
      // pick by the lab's own functions, only when not already picked
      ["hana"].forEach((name) => {
        const card = [...d.querySelectorAll("#roster > *")].find((e) => (e as HTMLElement).innerText.trim().toLowerCase().startsWith(name));
        const id = card?.getAttribute("onclick")?.match(/toggleAgent\('([^']+)'\)/)?.[1];
        if (card && id && !card.classList.contains("on") && !card.classList.contains("sel")) w.toggleAgent?.(id);
      });
      const chip = [...d.querySelectorAll("#scenchips > *")].find((e) => (e as HTMLElement).innerText.includes("Baseline ADL/IADL"));
      const file = chip?.getAttribute("onclick")?.match(/toggleScen\('([^']+)'\)/)?.[1];
      if (chip && file && !chip.classList.contains("on")) w.toggleScen?.(file);
      window.setTimeout(() => {
        w.runExperiment?.();
        window.setTimeout(() => {
          // follow the single agent, a step closer than the default
          (d.getElementById("zoomInBtn") as HTMLButtonElement | null)?.click();
          setPlaying(true);
        }, 800);
      }, 300);
    }, 250);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-black/10 bg-[#0b1210] max-md:h-[340px] md:min-h-[360px] md:flex-[3]">
      {!on && (
        <>
          <Image src="/images/home/step4-agents.jpg" alt="Three agents moving through a simulated town" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/80">IDD agent lab · runs in your browser</span>
            <button
              type="button"
              onClick={() => setOn(true)}
              className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider"
              style={{ background: "#f3eee2", color: "#1d1b18" }}
            >
              Run the simulation
            </button>
          </div>
        </>
      )}
      {on && (
        <>
          <iframe ref={frame} src="/lab/index.html?embed=1" title="IDD agent lab, live simulator" onLoad={start} className="absolute inset-0 h-full w-full" allow="fullscreen" />
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0b1210] font-mono text-[11px] uppercase tracking-wider text-white/70">
              Starting the simulation…
            </div>
          )}
          <a
            href="/lab/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-3 z-10 rounded-full bg-[#f3eee2]/90 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider"
            style={{ color: "#1d1b18" }}
          >
            Open the full lab ↗
          </a>
        </>
      )}
    </div>
  );
}

function Visual({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div className="grid items-stretch gap-3 md:grid-cols-[7fr_5fr]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-black/10 bg-white">
          <Image src="/images/full/disability-as-market-04.jpg" alt="An interview in progress with a map on the table" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-black/10 bg-white">
            <Image src="/images/full/disability-as-market-05.jpg" alt="Insights grouped on sticky notes during a hackathon" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-black/10 bg-white md:aspect-auto md:min-h-0 md:flex-1">
            <Image src="/images/full/military-hr-big-data-03.jpg" alt="Interview coding results for 18 participants" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </div>
    );
  }
  if (i === 1) {
    const tiles: [string, string, string][] = [
      ["/images/full/starfield-existing-branch-01.jpg", "Network analysis", "object-contain"],
      ["/images/full/starfield-existing-branch-08.jpg", "Process mining", "object-contain"],
      ["/images/home/step2-heatmap.jpg", "Heatmap + network", "object-contain"],
      ["/images/home/step2-strategy-matrix-b.jpg", "Strategy matrix", "object-contain p-3"],
    ];
    return (
      <div className="grid gap-3 md:grid-cols-[8fr_4fr]">
        <div className="grid grid-cols-2 gap-3 md:grid-rows-2">
          {tiles.map(([src, label, fit]) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-white md:aspect-auto md:min-h-[170px]">
              <Image src={src} alt={label} fill sizes="(min-width: 768px) 30vw, 50vw" className={fit} />
              <span className="absolute bottom-2 right-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider md:bottom-2 md:left-2 md:right-auto" style={{ color: MUTED }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[1/0.88] overflow-hidden rounded-lg border border-black/10 bg-white md:aspect-auto md:min-h-[200px] md:flex-1">
            <Image src="/images/home/step2-personas-en.jpg" alt="Personas drawn from a customer-network graph, labeled by industry" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-2" />
          </div>
          <div className="relative aspect-[1400/600] overflow-hidden rounded-lg border border-black/10 bg-white">
            <Image src="/images/full/disability-persona-augmentation-04.jpg" alt="Persona pipeline" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain" />
            <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
              Persona pipeline
            </span>
          </div>
        </div>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="grid items-stretch gap-3 md:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-black/10 bg-[#fbf8ef] p-3">
          <Scaled width={900}>
            <VipRobotSim />
          </Scaled>
        </div>
        <div className="flex flex-col gap-3">
          <GreenhousePanel />
          <div className="relative overflow-hidden rounded-lg border border-black/10 bg-white max-md:aspect-[824/462] md:min-h-[180px] md:flex-[2]">
            <Image src="/images/home/step3-clay-terrain.jpg" alt="Two terrain models made quickly by hand for training before an exercise" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[5fr_7fr]">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[1400/1055] overflow-hidden rounded-lg border border-black/10 bg-white">
          <Image src="/images/full/disability-persona-augmentation-03.jpg" alt="Reference: generative agents built from interview transcripts are compared with the people they simulate" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-contain p-2" />
          <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
            Reference · 2024 Stanford study, generative agents
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-white md:aspect-auto md:min-h-[300px] md:flex-1">
          <Image src="/images/full/disability-persona-augmentation-18.jpg" alt="Reference: AI agents in a 3D Minecraft world, from Altera's research" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-contain p-3" />
          <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
            Reference · Altera, agents in 3D Minecraft
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <LabPanel />
        <div className="relative aspect-[1516/728] overflow-hidden rounded-lg border border-black/10 bg-[#0b1210]">
          <Image src="/images/home/step4-results.jpg" alt="A results grid showing which action each agent completed" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-contain" />
          <span className="absolute bottom-2 left-2 rounded-full bg-[#f3eee2]/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
            Which step breaks, and why
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HowIWork() {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const go = (n: number) => setI((n + steps.length) % steps.length);
  const s = steps[i];

  return (
    <section className="relative border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
      {/* on wide screens the arrows sit outside the content, in the side margins, and follow the scroll */}
      {[-1, 1].map((d) => {
        const t = steps[(i + d + steps.length) % steps.length];
        return (
          <div key={d} className={`pointer-events-none absolute inset-y-0 hidden w-[calc((100%-1240px)/2)] min-[1360px]:block ${d < 0 ? "left-0" : "right-0"}`}>
            <div className="sticky top-[44vh] flex justify-center">
              <button
                type="button"
                onClick={() => go(i + d)}
                aria-label={d < 0 ? `Previous step: ${t.field}` : `Next step: ${t.field}`}
                title={`${d < 0 ? "Previous" : "Next"}: ${t.n} ${t.field}`}
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/30 bg-[#f3eee2] text-xl shadow-[0_8px_18px_-8px_rgba(29,27,24,0.5)] transition-colors hover:bg-black hover:text-[#f3eee2]"
              >
                {d < 0 ? "←" : "→"}
              </button>
            </div>
          </div>
        );
      })}
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
          <div className="flex items-start gap-5 md:gap-8">
            <span className="font-[family-name:var(--font-instrument)] text-6xl leading-none" style={{ color: RED }}>
              {s.n}
            </span>
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: INDIGO }}>
                {s.field}
              </p>
              <h3 className="font-[family-name:var(--font-instrument)] text-3xl leading-tight">{s.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-[16px] leading-relaxed" style={{ color: MUTED }}>
            {s.body}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {s.tools.map((t) => (
              <li key={t} className="rounded-full border border-black/20 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider" style={{ color: MUTED }}>
                {t}
              </li>
            ))}
          </ul>

          <div className="relative mt-6">
            <Visual i={i} />
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1.5 border-t border-black/10 pt-4">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
              Where I did this{s.status ? ` · ${s.status}` : ""}
            </span>
            {s.projects.map((pr) => (
              <a
                key={pr.href + pr.label}
                href={pr.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/20 px-2.5 py-1 text-[12.5px] leading-none transition-colors hover:border-[#c8431f] hover:text-[#c8431f]"
              >
                {pr.label} ↗
              </a>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/15 pt-5 min-[1360px]:hidden">
            {[-1, 1].map((d) => {
              const t = steps[(i + d + steps.length) % steps.length];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => go(i + d)}
                  aria-label={d < 0 ? `Previous step: ${t.field}` : `Next step: ${t.field}`}
                  className={`group inline-flex items-center gap-3 rounded-full border border-black/30 bg-[#f3eee2] px-4 py-2.5 transition-colors hover:bg-black hover:text-[#f3eee2] ${d < 0 ? "" : "flex-row-reverse"}`}
                >
                  <span className="text-xl leading-none">{d < 0 ? "←" : "→"}</span>
                  <span className="text-left">
                    <span className="block font-mono text-[10px] uppercase tracking-wider opacity-60">{d < 0 ? "Previous" : "Next"} · {t.n}</span>
                    <span className="block font-[family-name:var(--font-instrument)] text-lg leading-tight">{t.field}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </article>
      </div>
      <style>{`.how-slide{animation:howIn .35s ease-out both}@keyframes howIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
