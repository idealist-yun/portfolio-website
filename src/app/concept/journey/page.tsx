import Link from "next/link";
import { journey, universeOf } from "@/data/concept";
import { phaseGroups, projectGroup, thesisCard } from "@/data/projectMeta";
import { projects, type Phase } from "@/data/projects";

const PAPER = "#f3eee2";
const INK = "#1d1b18";
const RED = "#c8431f";
const MUTED = "#6b655a";

const lanes: { phase: Phase; label: string; tool: string; color: string; tint: string }[] = [
  { phase: "Basic", label: "Basic", tool: "Design thinking, on its own", color: "#c99a2e", tint: "#fbf1d2" },
  { phase: "Data-Driven", label: "Data-driven", tool: "The same loop, with customer and market data", color: "#24386b", tint: "#dfe6f6" },
  { phase: "AI-Driven", label: "AI-driven", tool: "The same loop, with AI personas and simulation", color: "#c8431f", tint: "#fbe0d6" },
];

function Diamonds() {
  const dia = (x: number, w: number) => `${x},70 ${x + w / 2},10 ${x + w},70 ${x + w / 2},130`;
  return (
    <svg viewBox="0 0 760 150" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="The double diamond: discover, define, develop, deliver">
      <polygon points={dia(10, 170)} fill="#fbe0d6" stroke={INK} strokeWidth="2" />
      <polygon points={dia(190, 170)} fill="#fbf1d2" stroke={INK} strokeWidth="2" />
      <polygon points={dia(400, 170)} fill="#dfe6f6" stroke={INK} strokeWidth="2" />
      <polygon points={dia(580, 170)} fill="#e0f1e4" stroke={INK} strokeWidth="2" />
      {[
        ["Discover", 95, "diverge"],
        ["Define", 275, "converge"],
        ["Develop", 485, "diverge"],
        ["Deliver", 665, "converge"],
      ].map(([t, x, s]) => (
        <g key={t as string} textAnchor="middle">
          <text x={x as number} y="68" fontSize="17" fontWeight="700" fill={INK} style={{ fontFamily: "var(--font-bric)" }}>
            {t}
          </text>
          <text x={x as number} y="86" fontSize="10" fill={MUTED} style={{ fontFamily: "var(--font-hand)" }}>
            {s}
          </text>
        </g>
      ))}
      <text x="185" y="146" textAnchor="middle" fontSize="11" fill={MUTED} style={{ fontFamily: "var(--font-hand)", fontSize: 16 }}>
        the problem
      </text>
      <text x="575" y="146" textAnchor="middle" fontSize="11" fill={MUTED} style={{ fontFamily: "var(--font-hand)", fontSize: 16 }}>
        the solution
      </text>
    </svg>
  );
}

export default function Journey() {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden" style={{ background: PAPER, color: INK }}>
      <header className="sticky top-0 z-30 border-b border-black/10 backdrop-blur-md" style={{ background: "rgba(243,238,226,0.85)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <Link href="/concept/b" className="font-mono text-[11px] uppercase tracking-wider hover:underline">
            ← back to the museum
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
            Journey map
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 pb-28 pt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          one lens, three instruments
        </p>
        <h1 className="mt-3 max-w-[16ch] font-[family-name:var(--font-instrument)] text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] tracking-[-0.02em]">
          Every chapter is the same <em style={{ color: RED }}>diamond,</em> played again.
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed" style={{ color: MUTED }}>
          Design thinking sits at the centre. What changed over the years is the instrument I play it with: first on its own, then with data, now with AI simulation. The six halls of the museum are this map, walked.
        </p>

        <div className="mt-12 rounded-[10px] border border-black/10 bg-white/55 p-6 sm:p-8">
          <Diamonds />
          <div className="mx-auto mt-2 flex max-w-[760px] justify-around" aria-hidden>
            {lanes.map((l) => (
              <span key={l.phase} className="h-8 w-[2px]" style={{ background: l.color }} />
            ))}
          </div>
        </div>

        <div className="mt-2 space-y-8">
          {lanes.map((l) => (
            <section key={l.phase} className="rounded-[10px] border-2 p-5 sm:p-7" style={{ borderColor: l.color, background: l.tint }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[family-name:var(--font-instrument)] text-4xl" style={{ color: l.color }}>
                  {l.label}
                </h2>
                <p className="text-[14px]" style={{ color: MUTED }}>
                  {l.tool}
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {phaseGroups[l.phase].map((g) => {
                  const items = projects.filter((p) => p.phase === l.phase && projectGroup[p.slug] === g.key);
                  const thesis = l.phase === "AI-Driven" && thesisCard.group === g.key;
                  return (
                    <div key={g.key} className="rounded-[8px] bg-white/80 p-4 shadow-[0_8px_16px_-12px_rgba(29,27,24,0.6)]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: l.color }}>
                        {g.title}
                      </p>
                      <ul className="mt-2 space-y-1.5 text-[14px] leading-snug">
                        {thesis && (
                          <li>
                            <Link href={thesisCard.href} className="underline decoration-black/25 underline-offset-2 hover:decoration-black">
                              Disability Persona Augmentation (thesis)
                            </Link>
                          </li>
                        )}
                        {items.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/project/${p.slug}`} className="underline decoration-black/25 underline-offset-2 hover:decoration-black">
                              {p.title}
                            </Link>
                          </li>
                        ))}
                        {!thesis && items.length === 0 && <li style={{ color: MUTED }}>-</li>}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <h2 className="mt-16 font-[family-name:var(--font-instrument)] text-4xl">The same path, as years</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((j) => {
            const u = universeOf(j.universe);
            return (
              <li key={j.year + j.title} className="rounded-[8px] border border-black/10 bg-white/70 p-4">
                <p className="font-mono text-[11px] tracking-wider" style={{ color: u.color }}>
                  {j.year}
                </p>
                <p className="mt-1 font-[family-name:var(--font-instrument)] text-2xl leading-tight">{j.title}</p>
                <p className="text-[12px]" style={{ color: MUTED }}>
                  {j.place}
                </p>
                <p className="mt-2 text-[13px] leading-snug" style={{ color: MUTED }}>
                  {j.note}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider">
          <Link href="/concept/b" className="rounded-full bg-[#1d1b18] px-4 py-2 text-[#f3eee2]">
            Back to the museum
          </Link>
          <Link href="/project" className="rounded-full border border-black/30 px-4 py-2">
            All projects
          </Link>
        </div>
      </main>
    </div>
  );
}
