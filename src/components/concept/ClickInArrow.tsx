"use client";

import { useEffect, useRef, useState } from "react";
import { at, measureGreet, tangent, type XY } from "@/components/concept/greetPath";

const INK = "#1d1b18";
const RED = "#c8431f";

type Geo = { d: string; head: string; tx: number; ty: number };

// A long hand-drawn arrow from where the greeter first stands, along the foot of the intro text, up to the museum frame.
// The greeter walks this same curve. The "Click in!" note rides on the arrow.
export default function ClickInArrow() {
  const box = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const m = measureGreet();
      if (!m) return;
      const r = el.getBoundingClientRect();
      const sc = el.offsetWidth ? r.width / el.offsetWidth : 1;
      const loc = (p: XY): XY => ({ x: (p.x - r.left) / sc, y: (p.y - r.top) / sc });
      const s = loc(m.start);
      const c = loc(m.ctrl);
      const g = loc(m.edge);
      const t0 = 0.12;
      const t1 = 1;
      const pts: XY[] = [];
      for (let i = 0; i <= 40; i++) pts.push(at(s, c, g, t0 + ((t1 - t0) * i) / 40));
      const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
      const e = pts[pts.length - 1];
      const tg = tangent(s, c, g, t1);
      const ang = Math.atan2(tg.y, tg.x);
      const wing = (a: number) => `M${e.x.toFixed(1)} ${e.y.toFixed(1)} L${(e.x - 15 * Math.cos(ang + a)).toFixed(1)} ${(e.y - 15 * Math.sin(ang + a)).toFixed(1)}`;
      setGeo({ d, head: wing(0.5) + " " + wing(-0.5), tx: s.x + 48, ty: s.y - 24 });
    };
    const ts = [0, 300, 900, 1800].map((ms) => window.setTimeout(measure, ms));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ts.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={box} aria-hidden={!geo} className="pointer-events-none absolute inset-0 z-[8] hidden md:block">
      {geo && (
        <>
          <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={geo.d} />
            <path d={geo.head} />
          </svg>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("museum:enlarge"))}
            aria-label="Open the museum"
            className="group pointer-events-auto absolute w-[360px] text-left"
            style={{ left: geo.tx, top: geo.ty, transform: "translateY(-100%) rotate(-3deg)", transformOrigin: "left bottom" }}
          >
            <span
              className="block text-[1.55rem] leading-[1.05] transition-colors group-hover:text-[#c8431f]"
              style={{ fontFamily: "var(--font-hand)", fontWeight: 700, color: INK }}
            >
              <span className="block whitespace-nowrap">
                <span style={{ color: RED }}>Click in!</span> A docent will walk
              </span>
              <span className="block whitespace-nowrap">you through my journey.</span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
