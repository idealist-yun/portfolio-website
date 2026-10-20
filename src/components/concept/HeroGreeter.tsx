"use client";

import { useEffect, useState } from "react";
import { Person } from "@/components/concept/ObservationRoom";
import { at, measureGreet, measureStart } from "@/components/concept/greetPath";

type View = { x: number; y: number; scale: number; bob: number; wave: boolean; say: string | null };

const W = 44; // px, svg viewBox is 28 x 42 units
const H = 66;
const HEAD = 34 * (W / 28); // feet to the top of the head, px
const FOOT = 38 / 42; // feet sit this far down the svg

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

    document.documentElement.dataset.greeting = "1";
    window.dispatchEvent(new Event("museum:greet-hold"));

    // he is already standing there when the page loads (under the opening), then waves once the page is open
    let started = false;
    const stand = () => {
      if (started || !alive) return;
      const p0 = measureStart();
      if (p0) setV({ x: p0.x, y: p0.y, scale: 1, bob: 0, wave: false, say: null });
    };
    after(stand, 450); // once the hero has settled, so he never jumps
    window.addEventListener("resize", stand);

    const stop = (handoff: boolean) => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ["wheel", "keydown", "pointerdown", "touchstart"].forEach((t) => window.removeEventListener(t, interrupt, true));
      document.removeEventListener("scroll", interrupt, true);
      window.removeEventListener("resize", stand);
      setV(null);
      delete document.documentElement.dataset.greeting;
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
      started = true;
      const m = measureGreet();
      if (!m) return stop(false);
      const { start, takeoff, ctrl, land, gate: g } = m;
      const endScale = (1.1 * g.k) / (W / 28);
      const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

      // 1. hello, standing on the D
      setV({ x: start.x, y: start.y, scale: 1, bob: 0, wave: true, say: "Hi, I'm Ian!" });
      after(() => {
        if (!alive) return;
        // 2. stroll along the tops of the letters (as fast as he used to walk), 3. jump off the "w" of "how",
        // 4. drop through the frame to the gate
        const walkMs = Math.max(1200, (Math.hypot(takeoff.x - start.x, takeoff.y - start.y) / 105) * 1000);
        const jumpMs = 900;
        const dropMs = 600;
        const t0 = performance.now();
        const tick = (now: number) => {
          if (!alive) return;
          const el = now - t0;
          if (el < walkMs) {
            const k = el / walkMs;
            setV({ x: start.x + (takeoff.x - start.x) * k, y: start.y + (takeoff.y - start.y) * k, scale: 1, bob: Math.sin(el / 90) * 1.5, wave: false, say: "Click the frame to see my whole journey." });
          } else if (el < walkMs + jumpMs) {
            const p = at(takeoff, ctrl, land, ease((el - walkMs) / jumpMs));
            setV({ x: p.x, y: p.y, scale: 1, bob: 0, wave: false, say: null });
          } else if (el < walkMs + jumpMs + dropMs) {
            const k = ease((el - walkMs - jumpMs) / dropMs);
            setV({ x: land.x + (g.x - land.x) * k, y: land.y + (g.y - land.y) * k, scale: 1 + (endScale - 1) * k, bob: 0, wave: false, say: null });
          } else {
            mark();
            stop(true);
            return;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, 1800);
    };

    // wait for the opening to be gone, then a beat
    const t = performance.now();
    const poll = window.setInterval(() => {
      const o = document.querySelector(".open-wrap") as HTMLElement | null;
      const gone = !o || getComputedStyle(o).visibility === "hidden" || getComputedStyle(o).display === "none";
      if (gone || performance.now() - t > 7000) {
        clearInterval(poll);
        after(begin, 250);
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
        window.removeEventListener("resize", stand);
        delete document.documentElement.dataset.greeting;
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
          className="absolute whitespace-nowrap rounded-full border border-[#c23d8c] bg-white px-3 py-1 text-[1.25rem] leading-none shadow-sm"
          style={{ top: H * FOOT - HEAD * v.scale, left: "78%", fontFamily: "var(--font-hand)", fontWeight: 700, color: "#1d1b18" }}
        >
          {v.say}
        </span>
      )}
    </div>
  );
}
