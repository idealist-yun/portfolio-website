"use client";

import { useEffect, useState } from "react";
import { Person } from "@/components/concept/ObservationRoom";
import { along, measureGreet, route } from "@/components/concept/greetPath";

type View = { x: number; y: number; scale: number; bob: number; wave: boolean; say: string | null };

const W = 56; // px, svg viewBox is 28 x 42 units
const H = 84;
const FOOT = 38 / 42; // feet sit this far down the svg
const SAY = "I'm the Ian at Penn, right now."; // the Penn Ian's own line from the museum

// Once per tab, after the opening: Penn Ian appears under the intro text, waves hello, then strolls right while introducing himself and walks into the museum frame.
// The map's own Penn Ian takes over at the gate with a hint to click the floor.
export default function HeroGreeter() {
  const [v, setV] = useState<View | null>(null);

  useEffect(() => {
    let done = false;
    try {
      done = sessionStorage.getItem("greeted") === "1";
    } catch {
      /* storage unavailable */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (done || reduced || window.innerWidth < 768) return;

    let alive = true;
    let raf = 0;
    const timers: number[] = [];
    const after = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const mark = () => {
      try {
        sessionStorage.setItem("greeted", "1");
      } catch {
        /* storage unavailable */
      }
    };

    window.dispatchEvent(new Event("museum:greet-hold"));

    const stop = (handoff: boolean) => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ["wheel", "keydown", "pointerdown", "touchstart"].forEach((t) => window.removeEventListener(t, interrupt, true));
      document.removeEventListener("scroll", interrupt, true);
      setV(null);
      window.dispatchEvent(new Event(handoff ? "museum:greet-enter" : "museum:greet-cancel"));
    };
    const interrupt = () => {
      mark();
      stop(false);
    };
    ["wheel", "keydown", "pointerdown", "touchstart"].forEach((t) => window.addEventListener(t, interrupt, { capture: true, passive: true }));
    document.addEventListener("scroll", interrupt, true);

    const begin = () => {
      if (!alive) return;
      const m = measureGreet();
      if (!m) return stop(false);
      const { start, gate: g } = m;
      const rt = route(m);
      const endScale = (1.1 * g.k) / (W / 28);

      // 1. hello
      const t0 = performance.now();
      setV({ x: start.x, y: start.y, scale: 1, bob: 0, wave: true, say: "Hi!" });
      after(() => {
        if (!alive) return;
        // 2. walk to the gate, shrinking into the picture
        // along the arrow, then a step through the frame to the gate
        const dur = Math.max(3000, Math.min(5400, (rt.total / 105) * 1000));
        const w0 = performance.now();
        const tick = (now: number) => {
          if (!alive) return;
          const k = Math.min(1, (now - w0) / dur);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const pos = along(rt, e * rt.total);
          const shrink = Math.max(0, (k - 0.45) / 0.55);
          const scale = 1 + (endScale - 1) * shrink * shrink;
          setV({ x: pos.x, y: pos.y, scale, bob: Math.sin((now - t0) / 90) * 1.5, wave: false, say: k < 0.42 ? SAY : null });
          if (k < 1) raf = requestAnimationFrame(tick);
          else {
            mark();
            stop(true);
          }
        };
        raf = requestAnimationFrame(tick);
      }, 1500);
    };

    // wait for the opening to be gone, then a beat
    const t = performance.now();
    const poll = window.setInterval(() => {
      const o = document.querySelector(".open-wrap") as HTMLElement | null;
      const gone = !o || getComputedStyle(o).visibility === "hidden" || getComputedStyle(o).display === "none";
      if (gone || performance.now() - t > 7000) {
        clearInterval(poll);
        after(begin, 450);
      }
    }, 120);
    timers.push(poll);

    return () => {
      if (alive) {
        alive = false;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        clearInterval(poll);
        ["wheel", "keydown", "pointerdown", "touchstart"].forEach((t2) => window.removeEventListener(t2, interrupt, true));
        document.removeEventListener("scroll", interrupt, true);
        window.dispatchEvent(new Event("museum:greet-cancel"));
      }
    };
  }, []);

  if (!v) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ transform: `translate(${v.x - W / 2}px, ${v.y - H * FOOT}px)`, width: W, height: H }}
    >
      <div style={{ transform: `scale(${v.scale})`, transformOrigin: `50% ${FOOT * 100}%`, width: W, height: H }}>
        <svg viewBox="-14 -38 28 42" width={W} height={H} overflow="visible">
          <Person kind="penn" face={1} bob={v.bob} wave={v.wave} />
        </svg>
      </div>
      {v.say && (
        <span
          className="absolute whitespace-nowrap rounded-full border border-[#c23d8c] bg-white px-3 py-1 text-[1.3rem] leading-none shadow-sm"
          style={{ top: v.wave ? H * FOOT - 66 * v.scale : H * FOOT + 6, left: v.wave ? "72%" : "30%", fontFamily: "var(--font-hand)", fontWeight: 700, color: "#1d1b18" }}
        >
          {v.say}
        </span>
      )}
    </div>
  );
}
