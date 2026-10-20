export type XY = { x: number; y: number };
export type Gate = XY & { k: number; left: number; top: number; bottom: number };
export type Greet = { start: XY; ctrl: XY; edge: XY; gate: Gate };

// Where the greeting starts and where it goes, in viewport pixels.
// Start: just under the handwritten line. The arrow runs along the foot of the text and up to the frame's left edge;
// the walker then steps through the frame to the museum's gate (read from the map itself).
export function measureGreet(): Greet | null {
  const anchor = document.querySelector("[data-greet-anchor]");
  if (!anchor) return null;
  const r = anchor.getBoundingClientRect();
  const start = { x: r.left + 56, y: r.bottom + 96 };
  let gate: Gate | null = null;
  window.dispatchEvent(new CustomEvent("museum:greet-gate", { detail: { cb: (g: Gate | null) => (gate = g) } }));
  if (!gate) return null;
  const g: Gate = gate;
  // the arrow lands on the frame's lower-left corner, so it stays nearly flat
  const edge = { x: g.left - 12, y: g.bottom + 12 };
  const ctrl = { x: edge.x - 90, y: start.y - 2 };
  return { start, ctrl, edge, gate: g };
}

// quadratic curve start -> ctrl -> edge, shared by the arrow and the walker
export function at(s: XY, c: XY, g: XY, t: number): XY {
  const u = 1 - t;
  return { x: u * u * s.x + 2 * u * t * c.x + t * t * g.x, y: u * u * s.y + 2 * u * t * c.y + t * t * g.y };
}
export function tangent(s: XY, c: XY, g: XY, t: number): XY {
  const u = 1 - t;
  return { x: 2 * u * (c.x - s.x) + 2 * t * (g.x - c.x), y: 2 * u * (c.y - s.y) + 2 * t * (g.y - c.y) };
}

// the walker's whole route: along the arrow, then a short step through the frame to the gate
export type Route = { pts: XY[]; cum: number[]; total: number };
export function route(m: Greet): Route {
  const pts: XY[] = [];
  for (let i = 0; i <= 60; i++) pts.push(at(m.start, m.ctrl, m.edge, i / 60));
  for (let i = 1; i <= 16; i++) pts.push({ x: m.edge.x + ((m.gate.x - m.edge.x) * i) / 16, y: m.edge.y + ((m.gate.y - m.edge.y) * i) / 16 });
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, total: cum[cum.length - 1] };
}
export function along(r: Route, d: number): XY {
  const x = Math.max(0, Math.min(r.total, d));
  let i = 1;
  while (i < r.cum.length - 1 && r.cum[i] < x) i++;
  const k = (x - r.cum[i - 1]) / Math.max(1e-6, r.cum[i] - r.cum[i - 1]);
  return { x: r.pts[i - 1].x + (r.pts[i].x - r.pts[i - 1].x) * k, y: r.pts[i - 1].y + (r.pts[i].y - r.pts[i - 1].y) * k };
}
