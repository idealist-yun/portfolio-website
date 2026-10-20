"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import VipRobotSim from "@/components/VipRobotSim";

const RED = "#c8431f";
const INDIGO = "#24386b";
const MUTED = "#6b655a";

type Step = {
  n: string;
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
    title: "Understand people",
    body: "Interviews, field observation, and surveys, combined into insights and a design direction.",
    tools: ["Interviews", "Field studies", "Surveys", "Journey mapping", "Miro", "Figma"],
    project: "Disability service design · Military HR system",
    href: "/project/disability-as-market",
    linkLabel: "Read the project →",
  },
  {
    n: "02",
    title: "Define personas from data",
    body: "Behavioral and survey data are clustered into personas that are measured, not imagined.",
    tools: ["Python", "R", "Clustering", "Network analysis", "Tableau", "Power BI"],
    project: "Starfield, new branch",
    href: "/project/starfield-new-branch-1",
    linkLabel: "Read the project →",
  },
  {
    n: "03",
    title: "Design and simulate the service",
    body: "Insights and personas become a service strategy, visualized and simulated before anything is built.",
    tools: ["Service blueprint", "Figma", "Unity", "Rapid prototyping"],
    project: "VIP concierge robot",
    href: "/project/vip-concierge-robot",
    linkLabel: "Read the project →",
  },
  {
    n: "04",
    title: "Verify with agents",
    body: "Data-driven personas become agents that run through the service, so it is tested before it reaches real people.",
    tools: ["Python", "Generative agents"],
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
    return (
      <div className="relative mx-auto aspect-[742/800] max-h-[520px] overflow-hidden rounded-lg border border-black/10 bg-white">
        <Image src="/images/home/step2-personas.jpg" alt="Personas drawn from a customer-network graph" fill sizes="520px" className="object-contain" />
      </div>
    );
  }
  if (i === 2) {
    return (
      <div data-nowheel className="overflow-hidden rounded-lg border border-black/10 bg-[#fbf8ef] p-4 sm:p-6">
        <VipRobotSim />
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
  const sec = useRef<HTMLElement>(null);
  const cur = useRef(0);
  const go = (n: number) => setI((n + steps.length) % steps.length);
  const s = steps[i];

  useEffect(() => {
    cur.current = i;
  }, [i]);

  // wheel (or a horizontal trackpad swipe) turns the slides, one step at a time.
  // It lets the page scroll normally before the first slide and after the last, when the section
  // is not yet at the top of the screen, and over the live simulator.
  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    let acc = 0;
    let lastEvt = 0;
    let lock = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || (e.target as Element).closest("[data-nowheel]")) return;
      const r = el.getBoundingClientRect();
      if (r.top > 150 || r.bottom < window.innerHeight * 0.55) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d) return;
      const dir = d > 0 ? 1 : -1;
      if ((dir > 0 && cur.current === steps.length - 1) || (dir < 0 && cur.current === 0)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastEvt > 220) acc = 0;
      lastEvt = now;
      if (now < lock) return;
      acc += d;
      if (Math.abs(acc) >= 50) {
        acc = 0;
        lock = now + 650;
        setI(cur.current + dir);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section ref={sec} className="border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
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
          <h2 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.02]">
            This is how I <em style={{ color: INDIGO }}>work.</em>
          </h2>
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
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(i + d)}
                aria-label={d < 0 ? "Previous step" : "Next step"}
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/25 transition-colors hover:bg-black hover:text-[#f3eee2]"
              >
                {d < 0 ? "←" : "→"}
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

          <div className="mt-6">
            <Visual i={i} />
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
