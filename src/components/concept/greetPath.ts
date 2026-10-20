export type XY = { x: number; y: number };
export type Gate = XY & { k: number; left: number; top: number; bottom: number };
export type Frame = { left: number; top: number; right: number; bottom: number };
export type Greet = { start: XY; takeoff: XY; ctrl: XY; land: XY; frame: Frame; gate: Gate; mX: number };

// Letter-top measurements: the greeter stands on the "D" of the headline, walks along the letter tops,
// and jumps off the "w" of "how" into the museum frame.
function glyph(el: Element, from: "first" | "last"): { x: number; y: number; fs: number } | null {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let tn = walker.nextNode();
  let last = tn;
  while (from === "last" && tn) {
    last = tn;
    tn = walker.nextNode();
  }
  const node = from === "first" ? tn : last;
  if (!node || !node.textContent) return null;
  const i = from === "first" ? 0 : node.textContent.length - 1;
  const range = document.createRange();
  range.setStart(node, i);
  range.setEnd(node, i + 1);
  const r = range.getBoundingClientRect();
  const fs = parseFloat(getComputedStyle(el).fontSize) || 60;
  return { x: r.left + r.width * 0.5, y: r.top, fs };
}

export function measureStart(): XY | null {
  const h1 = document.querySelector("[data-greet-anchor]");
  if (!h1) return null;
  const d = glyph(h1, "first");
  return d ? { x: d.x, y: d.y + d.fs * 0.2 } : null;
}

export function measureGreet(): Greet | null {
  const h1 = document.querySelector("[data-greet-anchor]");
  const em = h1?.querySelector("em");
  const start = measureStart();
  if (!h1 || !em || !start) return null;
  const w = glyph(em, "last");
  if (!w) return null;
  let gate: Gate | null = null;
  window.dispatchEvent(new CustomEvent("museum:greet-gate", { detail: { cb: (g: Gate | null) => (gate = g) } }));
  if (!gate) return null;
  const g: Gate = gate;
  const takeoff = { x: w.x, y: start.y };
  // he lands on the outside of the frame's top edge, near its left corner
  const f = document.querySelector("[data-museum-frame]")?.getBoundingClientRect();
  if (!f) return null;
  const frame = { left: f.left, top: f.top, right: f.right, bottom: f.bottom };
  const land = { x: frame.left + 60, y: frame.top - 4 };
  // the arrow ends above the "M" of the "MUSEUM OF IAN" label inside the frame
  let mX = frame.left + 46;
  const label = Array.from(document.querySelectorAll("[data-museum-frame] *")).find((e) => e.children.length === 0 && (e.textContent ?? "").trim().toUpperCase().startsWith("MUSEUM OF IAN"));
  const tn = label ? document.createTreeWalker(label, NodeFilter.SHOW_TEXT).nextNode() : null;
  if (tn && tn.textContent) {
    const i = tn.textContent.search(/\S/);
    const range = document.createRange();
    range.setStart(tn, Math.max(0, i));
    range.setEnd(tn, Math.max(0, i) + 1);
    const r = range.getBoundingClientRect();
    if (r.width) mX = r.left + r.width / 2;
  }
  const ctrl = { x: (takeoff.x + land.x) / 2, y: Math.min(takeoff.y, land.y) - 34 };
  return { start, takeoff, ctrl, land, frame, gate: g, mX };
}

export function at(s: XY, c: XY, g: XY, t: number): XY {
  const u = 1 - t;
  return { x: u * u * s.x + 2 * u * t * c.x + t * t * g.x, y: u * u * s.y + 2 * u * t * c.y + t * t * g.y };
}
