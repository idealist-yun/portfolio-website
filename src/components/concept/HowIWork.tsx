"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import VipRobotSim from "@/components/VipRobotSim";

const RED = "#c8431f";
const INDIGO = "#24386b";
const MUTED = "#6b655a";

type Step = {
  n: string;
  stage: string;
  project: string;
  href: string;
  status?: string;
  img?: string;
  sim?: boolean;
};

// Four chapters of one method, each shown by a representative project.
const steps: Step[] = [
  {
    n: "01",
    stage: "Service design",
    project: "Hospital inpatient app",
    href: "/project/saihst-hospital-metaverse",
    img: "/images/home/step1-hospital.jpg",
  },
  {
    n: "02",
    stage: "Data-driven personas",
    project: "Starfield, new branch",
    href: "/project/starfield-new-branch-1",
    img: "/images/home/step2-personas.jpg",
  },
  {
    n: "03",
    stage: "Simulation",
    project: "VIP concierge robot",
    href: "/project/vip-concierge-robot",
    sim: true,
  },
  {
    n: "04",
    stage: "Agents",
    project: "IDD agent testbed",
    href: "/research/idd-agent-simulation",
    status: "In progress",
    img: "/images/home/step4-agents.jpg",
  },
];

export default function HowIWork() {
  const ref = useRef<HTMLDivElement>(null);
  const step = (dir: number) =>
    ref.current?.scrollBy({ left: dir * Math.min(520, ref.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section className="border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
      <div className="mx-auto max-w-[1240px] px-6 pt-14">
        <h2 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.02]">
          This is how I <em style={{ color: INDIGO }}>work.</em>
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
          four steps, one example each, swipe or use the arrows →
        </p>
      </div>

      <div className="relative">
        <div
          ref={ref}
          className="flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-6 pb-6 pt-10 [scrollbar-width:none] sm:px-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((s) => (
            <article
              key={s.n}
              className={`snap-start shrink-0 scroll-ml-6 ${s.sim ? "w-[min(92vw,1020px)]" : "w-[min(86vw,440px)]"}`}
            >
              <div className="mb-3 flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-instrument)] text-4xl leading-none" style={{ color: RED }}>
                  {s.n}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
                  {s.stage}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-black/10 bg-[#fbf8ef] shadow-[0_14px_30px_-20px_rgba(29,27,24,0.6)]">
                {s.sim ? (
                  <div className="p-4 sm:p-6">
                    <VipRobotSim />
                  </div>
                ) : (
                  <Link href={s.href} className="group block">
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      {s.img && (
                        <Image
                          src={s.img}
                          alt={s.project}
                          fill
                          sizes="440px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                  </Link>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-instrument)] text-xl leading-tight">{s.project}</p>
                    {s.status && (
                      <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: RED }}>
                        {s.status}
                      </p>
                    )}
                  </div>
                  <Link
                    href={s.href}
                    className="shrink-0 font-mono text-[11px] uppercase tracking-wider underline underline-offset-4"
                    style={{ color: RED }}
                  >
                    {s.href.startsWith("/research") ? "Read the research →" : "Read the project →"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mb-10 flex max-w-[1240px] justify-end gap-2 px-6 font-mono text-[11px]">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d)}
              aria-label={d < 0 ? "Previous step" : "Next step"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/25 transition-colors hover:bg-black hover:text-[#f3eee2]"
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
