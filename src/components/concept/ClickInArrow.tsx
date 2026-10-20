"use client";

import { useEffect, useRef, useState } from "react";
import { measureGreet, type XY } from "@/components/concept/greetPath";

const INK = "#1d1b18";
const RED = "#c8431f";

type Geo = { d: string; head: string; tx: number; ty: number };

// A short hand-drawn arrow above the museum frame. It comes in from the right and points down at the "M" of the museum label, stopping outside the frame.
export default function ClickInArrow() {
  const box = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  // while the greeter is still on his way, the note stays hidden; it draws in when he lands
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const m = measureGreet();
      if (!m) return;
      const r = el.getBoundingClientRect();
      const sc = el.offsetWidth ? r.width / el.offsetWidth : 1;
      const loc = (p: XY): XY => ({ x: (p.x - r.left) / sc, y: (p.y - r.top) / sc });
      // outside the frame: the tip stops just above its top-left corner
      const tip = loc({ x: m.mX, y: m.frame.top - 5 });
      const a = loc({ x: m.frame.left + 92, y: m.frame.top - 22 });
      const c = { x: a.x - (a.x - tip.x) * 0.8, y: a.y - 10 };
      const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${tip.x.toFixed(1)} ${tip.y.toFixed(1)}`;
      const ang = Math.atan2(tip.y - c.y, tip.x - c.x);
      const wing = (w: number) => `M${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L${(tip.x - 14 * Math.cos(ang + w)).toFixed(1)} ${(tip.y - 14 * Math.sin(ang + w)).toFixed(1)}`;
      setGeo({ d, head: wing(0.5) + " " + wing(-0.5), tx: a.x + 10, ty: a.y + 12 });
    };
    setHold(document.documentElement.dataset.greeting === "1");
    const show = () => setHold(false);
    const hide = () => setHold(document.documentElement.dataset.greeting === "1");
    window.addEventListener("museum:greet-enter", show);
    window.addEventListener("museum:greet-cancel", show);
    window.addEventListener("museum:greet-hold", hide);
    const ts = [0, 300, 900, 1800].map((ms) => window.setTimeout(measure, ms));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ts.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("museum:greet-enter", show);
      window.removeEventListener("museum:greet-cancel", show);
      window.removeEventListener("museum:greet-hold", hide);
    };
  }, []);

  return (
    <div ref={box} aria-hidden={!geo} className="pointer-events-none absolute inset-0 z-[8] hidden transition-opacity duration-500 md:block"
      style={{ opacity: hold ? 0 : 1 }}
    >
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
            className="group pointer-events-auto absolute text-left"
            style={{ left: geo.tx, top: geo.ty, transform: "translateY(-100%) rotate(-2deg)", transformOrigin: "left bottom" }}
          >
            <span className="block whitespace-nowrap text-[1.4rem] leading-none transition-colors group-hover:text-[#c8431f]" style={{ fontFamily: "var(--font-hand)", fontWeight: 700, color: INK }}>
              <span style={{ color: RED }}>Click in!</span> A docent will walk you through my journey.
            </span>
          </button>
        </>
      )}
    </div>
  );
}
