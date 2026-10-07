"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Pt = [number, number];
type State = "idle" | "move" | "speak" | "serve";
type RobotKey = "a" | "b" | "c";
type Seg = {
  t0: number;
  t1: number;
  pts: Pt[];
  len: number;
  text: string;
  state: State;
  spot?: string;
  g?: string;
  p?: string;
  carry?: boolean;
  follow?: { robot: RobotKey; dx: number; dy: number };
};
const ROBOTS: Record<RobotKey, { color: string; name: string; role: string }> = {
  a: { color: "var(--accent)", name: "Robot A", role: "Lobby host" },
  b: { color: "#3f7a5c", name: "Robot B", role: "Docent" },
  c: { color: "var(--warm)", name: "Robot C", role: "Beverage service" },
};

const SPEED = 110; // map units per second at 1x
const OFF_G: Pt = [-34, 28]; // guest walks behind-left of the escorting robot
const OFF_P: Pt = [-34, -28]; // the President walks beside the guest

// Editable: what each docent stop presents. Photos are cropped from the
// project's route-map slide; descriptions reflect what is visible there.
const SPOTS: Record<
  string,
  { n: string; title: string; short: string; body: string; img?: string }
> = {
  "B-1-1": {
    n: "①",
    title: "Exhibit ① · Ceramics display shelf",
    short: "Exhibit ①",
    body: "A tall wooden shelf displaying ceramic plates and ornaments. Robot B stops here and plays the narration script prepared for this piece.",
    img: "/images/vip/spot-1.jpg",
  },
  "B-1-2": {
    n: "②",
    title: "Exhibit ② · Framed calligraphy",
    short: "Exhibit ②",
    body: "A framed calligraphy work hung beside the secretary's desk. Robot B turns to face it and plays the script for this piece.",
    img: "/images/vip/spot-2.jpg",
  },
  "B-1-3": {
    n: "③",
    title: "Exhibit ③ · Display shelf",
    short: "Exhibit ③",
    body: "A wooden display shelf with a bowl and tableware. Robot B pauses here while the secretary triggers the script from the remote.",
    img: "/images/vip/spot-3.jpg",
  },
  "B-1-4": {
    n: "",
    title: "Crown Prince's Entrance Ceremony painting",
    short: "the Crown Prince's Entrance Ceremony painting",
    body: "The Joseon-era artwork that inspired the whole service concept: the six ceremonies of the crown prince's entrance to Seonggyungwan, retold here as the guest's visit.",
  },
  "B-1-5": {
    n: "④",
    title: "Exhibit ④ · Keepsake shelf",
    short: "Exhibit ④",
    body: "A display shelf of keepsakes and books at the far end of Zone C. The last stop before Robot B says farewell.",
    img: "/images/vip/spot-4.jpg",
  },
};

const GUEST = {
  name: "Dr. Park",
  role: "Visiting professor (sample guest)",
  drink: "tea",
};
const OFFICE: Pt = [1285, 150];
const SEAT_G: Pt = [535, 270];
const SEAT_P: Pt = [535, 330];
const CUPS: Pt[] = [
  [486, 272],
  [486, 328],
];
const B_DOOR: Pt = [898, 395];

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const pathLen = (pts: Pt[]) =>
  pts.reduce((s, p, i) => (i ? s + dist(pts[i - 1], p) : 0), 0);

function createTrack(start: Pt) {
  const segs: Seg[] = [];
  let t = 0;
  let cur = start;
  const api = {
    get t() {
      return t;
    },
    segs,
    wait(dur: number, text: string, state: State = "idle", extra: Partial<Seg> = {}) {
      segs.push({ t0: t, t1: t + dur, pts: [cur], len: 0, text, state, ...extra });
      t += dur;
      return api;
    },
    until(T: number, text: string, state: State = "idle", extra: Partial<Seg> = {}) {
      if (T > t) api.wait(T - t, text, state, extra);
      return api;
    },
    go(path: Pt[], text: string, extra: Partial<Seg> = {}) {
      const pts = [cur, ...path];
      const len = pathLen(pts);
      const dur = len / SPEED;
      segs.push({ t0: t, t1: t + dur, pts, len, text, state: "move", ...extra });
      t += dur;
      cur = path[path.length - 1];
      return api;
    },
    at(p: Pt) {
      cur = p;
      return api;
    },
    follow(robot: RobotKey, t0: number, t1: number, text: string, off: Pt) {
      if (t1 <= t0) return api;
      segs.push({
        t0,
        t1,
        pts: [[0, 0]],
        len: 0,
        text,
        state: "idle",
        follow: { robot, dx: off[0], dy: off[1] },
      });
      t = t1;
      return api;
    },
  };
  return api;
}

const WP = {
  A_SE: [1138, 653] as Pt,
  A_R: [898, 455] as Pt,
  B_SE: [981, 388] as Pt,
  B_1R: [737, 353] as Pt,
  C_S: [1265, 388] as Pt,
  C_1E: [597, 398] as Pt,
};

function followSegs(
  g: ReturnType<typeof createTrack>,
  robot: RobotKey,
  segs: Seg[],
  from: number,
  to: number,
  fallback: string,
  off: Pt,
  who: "g" | "p"
) {
  for (const s of segs) {
    const t0 = Math.max(s.t0, from);
    const t1 = Math.min(s.t1, to);
    if (t1 - t0 > 0.001) {
      g.follow(robot, t0, t1, (who === "p" ? s.p ?? s.g : s.g) ?? fallback, off);
    }
  }
}

const add = (v: Pt, o: Pt): Pt => [v[0] + o[0], v[1] + o[1]];

function buildScenario() {
  const A = createTrack(WP.A_SE);
  const B = createTrack(WP.B_SE);
  const C = createTrack(WP.C_S);
  const P = createTrack(OFFICE);
  const G = createTrack(add(WP.A_R, OFF_G));
  const name = GUEST.name;

  const gA = add(WP.A_R, OFF_G);
  const gDoor = add(B_DOOR, OFF_G);
  const pDoor = add(B_DOOR, OFF_P);
  const walkIn = pathLen([gA, gDoor]) / SPEED;
  const handDur = pathLen([gDoor, gA]) / SPEED;

  // Welcome in the lobby, guide to the Zone B door
  A.wait(3, `Welcomes ${name}: bows, the guest's name appears on the screen`, "speak", {
    g: "Arrives from the elevator and is welcomed by Robot A",
  }).go([[898, 653], WP.A_R], "Guides the guest to Room B (Zone B)", {
    g: "Follows Robot A to Room B",
  });
  const tBStart = A.t;
  const tGreetEnd = 3;
  const tBGreet = tBStart + walkIn;

  // Robot B steps out to the door first and waits there
  const toDoor: Pt[] = [[898, 388], B_DOOR];
  const toDoorDur = pathLen([WP.B_SE, ...toDoor]) / SPEED;
  B.until(tBStart - toDoorDur - 0.4, "Standing by at B-S/E")
    .go(toDoor, "Steps out to the Zone B door to meet the guest")
    .until(tBGreet, "Waiting at the door to receive the guests");

  // The President walks out to the same door
  const toDoorP: Pt[] = [[1180, 190], [1100, 300], [940, 380], pDoor];
  const pDur = pathLen([OFFICE, ...toDoorP]) / SPEED;
  const tPLeave = tBGreet - pDur - 0.3;
  P.until(tPLeave, "In the President's Office")
    .go(toDoorP, "Walks out to the Zone B door to receive the guest")
    .until(tBGreet, "Receives the guest at the Zone B door");

  // B greets both and leads the tour
  B.wait(3, `Greets ${name} and the President: “Welcome, ${name}. This way to the meeting room.”`, "speak", {
    g: "Is greeted by name by Robot B",
    p: "Welcomes the guest with Robot B",
  }).go([[898, 388], [614, 388], [614, 343]], "Leads the guests into Zone C", {
    g: "Follows Robot B into Zone C",
    p: "Walks with the guest into Zone C",
  });
  const tTourStart = B.t;
  const stops: { id: string; at: Pt[]; text: string }[] = [
    { id: "B-1-1", at: [], text: "Docent · Exhibit ① (script triggered by the secretary's remote)" },
    { id: "B-1-2", at: [[614, 271]], text: "Docent · Exhibit ②" },
    { id: "B-1-3", at: [[614, 205]], text: "Docent · Exhibit ③" },
    { id: "B-1-4", at: [[614, 175], [282, 175], [282, 269]], text: "Docent · Crown Prince's Entrance Ceremony painting" },
    { id: "B-1-5", at: [[282, 385]], text: "Docent · Exhibit ④" },
  ];
  for (const st of stops) {
    if (st.at.length) {
      B.go(st.at, `Leads the guests to ${SPOTS[st.id].short}`, { g: "Follows Robot B", p: "Walks with the guest" });
    }
    B.wait(2.5, st.text, "speak", {
      spot: st.id,
      g: `Listens to the docent: ${SPOTS[st.id].short}`,
    });
  }
  const tFarewellStart = B.t;
  B.wait(
    3,
    "Farewell: “Have a pleasant time. I'll be waiting outside; please call me if you need anything.”",
    "speak",
    { g: "Receives Robot B's farewell" }
  );
  const tExitStart = B.t;
  B.go([[282, 388], [737, 388], WP.B_1R], "Exits and returns to standby at B-1-R");

  // Robot C brings the tea and sets it on the table
  C.until(tExitStart - 2, "Standing by in the lounge (C-S)")
    .wait(3.5, "Back-end: staff load the tea onto the tray", "serve")
    .go([[1090, 398], [570, 398], [570, 300]], "Carries the tea to the table in Zone C", { carry: true });
  const tServe = C.t;
  C.wait(1.2, "Sets the tea cups on the table", "serve", { carry: true });
  const tPlace = C.t;
  C.wait(2.5, `Greets ${name} and the President: “Please enjoy your tea.”`, "serve").wait(
    1.5,
    "Bows and leaves the room",
    "speak"
  );
  const tMeetStart = C.t;
  C.go([[570, 398], [1090, 398]], "Returns to Room B");
  const tMeetEnd = tMeetStart + 12;

  // Walk-back from the table (both actors), B waits for the slower one
  const walkBackG: Pt[] = [SEAT_G, [600, 270], [600, 381], add(WP.B_1R, OFF_G)];
  const walkBackP: Pt[] = [SEAT_P, [600, 330], add(WP.B_1R, OFF_P)];
  const walkBack = Math.max(pathLen(walkBackG), pathLen(walkBackP)) / SPEED;
  const tFollow = tMeetEnd + walkBack;

  // Photo zone: B waits, guests step up to pose, then come back
  B.until(tFollow, "Standing by at B-1-R (meeting in progress)")
    .wait(2, "Greets the guests as the meeting ends", "speak", { g: "Is greeted by Robot B" })
    .go([[737, 388], [924, 388], [924, 208]], "Leads the guests to the photo zone", {
      g: "Follows Robot B to the photo zone",
    });
  const tPhotoStart = B.t;
  B.wait(0.8, "Invites the guests to step up to the photo zone", "speak")
    .wait(2.5, "Takes the photo: “Please smile. Three, two, one…”", "serve")
    .wait(0.8, "Thanks the guests and invites them back", "speak");
  const tHoldEnd = tPhotoStart + 3.3;
  const tPhotoEnd = B.t;
  const flash = { t0: tHoldEnd - 0.7, t1: tHoldEnd - 0.4 };
  B.go([[924, 388], [898, 388], B_DOOR], "Guides the guests to Room A", {
    g: "Follows Robot B to Room A",
  });
  const tHandoff = B.t;
  B.wait(2.5, "Greets the guests and hands over to Robot A", "speak", {
    g: "Is handed over to Robot A",
  }).go([[898, 388], WP.B_SE], "Returns to B-S/E");

  A.until(tHandoff, "Waiting at A-R")
    .wait(2.5, "Greets the guests and takes over from Robot B", "speak", {
      g: "Is welcomed by Robot A in the lobby",
    })
    .go([[898, 653], WP.A_SE], "Guides the guests to the elevator", {
      g: "Follows Robot A to the elevator",
    });
  const tFarewell = A.t;
  A.wait(3.5, "Farewell: sees the guests off", "speak", { g: "Is seen off by Robot A" });
  const tFarewellEnd = A.t;

  C.until(tMeetEnd + 4, "Standing by in Room B").go([WP.C_S], "Returns to the lounge (C-S)");

  // ---- actors ----
  const poseG: Pt = [915, 172];
  const poseP: Pt = [955, 172];
  const photoSpot: Pt = [924, 208];

  function runActor(
    T: ReturnType<typeof createTrack>,
    who: "g" | "p",
    off: Pt,
    seat: Pt,
    farewellFirst: Pt[],
    walkBackPath: Pt[],
    pose: Pt,
    texts: { seat: string; served: string; meeting: string }
  ) {
    followSegs(T, "b", B.segs, tBGreet, tFarewellStart + 1.2, "Accompanies the guest", off, who);
    T.at(add([282, 385], off)).go([...farewellFirst, seat], "Walks to the table in Zone C");
    T.until(tPlace, texts.seat);
    T.until(tMeetStart, texts.served, "serve");
    T.until(tMeetEnd, texts.meeting);
    T.go(walkBackPath.slice(1), "Walks to Robot B");
    T.until(tFollow, "Waits for Robot B");
    followSegs(T, "b", B.segs, tFollow, tPhotoStart, "Accompanies the guest", off, who);
    T.at(add(photoSpot, off)).go([pose], "Steps up to the photo zone");
    T.until(tHoldEnd, "Strikes a pose for the photo", "serve");
    T.go([add(photoSpot, off)], "Returns to Robot B");
    T.until(tPhotoEnd, "Returns to Robot B");
    followSegs(T, "b", B.segs, tPhotoEnd, tHandoff, "Accompanies the guest", off, who);
    T.at(add(B_DOOR, off)).go([add(WP.A_R, off)], "Walks to Robot A");
    followSegs(T, "a", A.segs, tHandoff + handDur, tFarewellEnd, "Accompanies the guest", off, who);
  }

  // The President's actor first (it ends with the walk back to the office)
  runActor(
    P,
    "p",
    OFF_P,
    SEAT_P,
    [[535, 357]],
    walkBackP,
    poseP,
    { seat: "Takes a seat in Zone C", served: "Is served tea by Robot C", meeting: "In the meeting with the guest" }
  );
  const retPath: Pt[] = [[985, 600], [985, 440], [985, 388], [1100, 300], [1154, 203], [1180, 190], OFFICE];
  P.at(add(WP.A_SE, OFF_P)).go(retPath, "Returns to the President's Office");

  const LOOP = Math.max(A.t, B.t, C.t, P.t) + 3;
  A.until(LOOP, "Standing by at A-S/E", "idle", { g: "Leaves by the elevator" });
  B.until(LOOP, "Standing by at B-S/E");
  C.until(LOOP, "Standing by in the lounge (C-S)");
  P.until(LOOP, "In the President's Office");

  followSegs(G, "a", A.segs, 0, tBStart, "Follows Robot A", OFF_G, "g");
  G.at(gA).go([gDoor], "Walks over to Robot B");
  runActor(
    G,
    "g",
    OFF_G,
    SEAT_G,
    [[535, 413]],
    walkBackG,
    poseG,
    { seat: "Takes a seat in Zone C", served: `Is served ${GUEST.drink} by Robot C`, meeting: "In the meeting with the President" }
  );
  // the guest keeps following Robot A through the farewell and beyond
  followSegs(G, "a", A.segs, tFarewellEnd, LOOP, "Leaves by the elevator", OFF_G, "g");

  const phases = [
    { t: 0, ko: "출궁의", en: "Welcoming the guest" },
    { t: tGreetEnd, ko: "작헌의", en: "Mutual greeting" },
    { t: tBStart, ko: "왕복의", en: "Moving to the meeting room" },
    { t: tExitStart - 2, ko: "수폐의", en: "Seated, tea served" },
    { t: tMeetStart, ko: "입학의", en: "Meeting" },
    { t: tMeetEnd, ko: "수하의", en: "Seeing the guests off" },
  ];

  const backend = [
    { t: 0, text: `Guest list synced with the robots: ${name}, ${GUEST.role}` },
    { t: tGreetEnd, text: `${name}'s name displayed on the robot screens` },
    { t: tPLeave, text: "Secretary notifies the President: the guest is on the way to Zone B" },
    { t: tTourStart, text: "Secretary triggers each exhibit's docent script by remote" },
    { t: tExitStart - 2, text: `Staff prepare ${name}'s tea and snacks` },
    { t: tServe - 3.5, text: "Robot C operated: tea placed on the tray" },
    { t: tMeetStart, text: "Meeting in progress: all robots on standby" },
    { t: tPhotoStart, text: "Secretary monitors the photo assist and hand-off" },
    { t: tFarewell, text: "Guest departs: session log closed" },
  ];

  return {
    tracks: { a: A.segs, b: B.segs, c: C.segs },
    guest: G.segs,
    president: P.segs,
    cups: { t0: tPlace, t1: tFollow },
    flash,
    LOOP,
    phases,
    backend,
  };
}

type Resolve = (k: RobotKey, time: number) => Pt;

function positionAt(segs: Seg[], time: number, resolve?: Resolve) {
  const seg =
    segs.find((s) => time >= s.t0 && time < s.t1) ?? segs[segs.length - 1];
  if (seg.follow && resolve) {
    const p = resolve(seg.follow.robot, time);
    return { pos: [p[0] + seg.follow.dx, p[1] + seg.follow.dy] as Pt, seg };
  }
  if (seg.len === 0) return { pos: seg.pts[0], seg };
  let d = ((time - seg.t0) / (seg.t1 - seg.t0)) * seg.len;
  for (let i = 1; i < seg.pts.length; i++) {
    const l = dist(seg.pts[i - 1], seg.pts[i]);
    if (d <= l || i === seg.pts.length - 1) {
      const k = l === 0 ? 0 : Math.min(1, d / l);
      return {
        pos: [
          seg.pts[i - 1][0] + (seg.pts[i][0] - seg.pts[i - 1][0]) * k,
          seg.pts[i - 1][1] + (seg.pts[i][1] - seg.pts[i - 1][1]) * k,
        ] as Pt,
        seg,
      };
    }
    d -= l;
  }
  return { pos: seg.pts[seg.pts.length - 1], seg };
}

const ROOMS = [
  { name: "Zone C · Exhibition", x: 232, y: 140, w: 470, h: 290, fill: "#f2e6da", stroke: "#d9bd9c" },
  { name: "Zone B · Reception", x: 702, y: 140, w: 468, h: 290, fill: "#e9efe6", stroke: "#bdd0b7" },
  { name: "Zone A · Lobby", x: 702, y: 430, w: 468, h: 290, fill: "#e7ecf2", stroke: "#bccadb" },
  { name: "President's Office", x: 1170, y: 10, w: 205, h: 207, fill: "#f7f1de", stroke: "#ddc98a" },
  { name: "Lounge", x: 1170, y: 330, w: 205, h: 100, fill: "#f5efe3", stroke: "#ddd0b4" },
  { name: "Pantry", x: 1170, y: 430, w: 85, h: 72, fill: "#f5efe3", stroke: "#ddd0b4" },
  { name: "Elevator", x: 1170, y: 560, w: 80, h: 108, fill: "#e4e2da", stroke: "#c3beaf" },
  { name: "Office", x: 828, y: 720, w: 217, h: 55, fill: "#e2e0d8", stroke: "#c3beaf" },
];

const FURNITURE = [
  { x: 418, y: 195, w: 86, h: 155, label: "Table" },
  { x: 418, y: 415, w: 86, h: 15, label: "" },
  { x: 702, y: 240, w: 28, h: 65, label: "" },
  { x: 1207, y: 30, w: 50, h: 92, label: "Table" },
];

const EXHIBITS = [
  { n: "③", x: 686, y: 190, w: 16, h: 27 },
  { n: "②", x: 686, y: 245, w: 16, h: 55 },
  { n: "①", x: 686, y: 335, w: 16, h: 24 },
  { n: "④", x: 232, y: 366, w: 16, h: 28 },
  { n: "", x: 232, y: 240, w: 16, h: 72 },
  { n: "⑤", x: 1170, y: 295, w: 12, h: 35 },
  { n: "⑥", x: 1205, y: 205, w: 75, h: 12 },
  { n: "⑦", x: 1182, y: 330, w: 60, h: 12 },
  { n: "⑧", x: 702, y: 468, w: 14, h: 42 },
];

const POINTS: { id: string; x: number; y: number; label?: boolean }[] = [
  { id: "B-1-1", x: 614, y: 343, label: true },
  { id: "B-1-2", x: 614, y: 271, label: true },
  { id: "B-1-3", x: 614, y: 205, label: true },
  { id: "B-1-4", x: 282, y: 269, label: true },
  { id: "B-1-5", x: 282, y: 385, label: true },
  { id: "B-1-R", x: 737, y: 353, label: true },
  { id: "B-Photo", x: 924, y: 208, label: true },
  { id: "B-D", x: 1127, y: 288, label: true },
  { id: "B-2-R", x: 1154, y: 203, label: true },
  { id: "C-1-E", x: 597, y: 398, label: true },
  { id: "C-2-E", x: 1320, y: 120, label: true },
  { id: "A-R", x: 898, y: 455, label: true },
];

const ENDPOINTS: { id: string; x: number; y: number; key: RobotKey }[] = [
  { id: "A-S/E", x: 1138, y: 653, key: "a" },
  { id: "B-S/E", x: 981, y: 388, key: "b" },
  { id: "C-S", x: 1265, y: 388, key: "c" },
];

const GUIDES: Record<string, { d: string; key: RobotKey }> = {
  a: { d: "M1138,653 H898 V455", key: "a" },
  b: { d: "M981,388 H282 V175 H614 V388 M737,388 V353 M981,388 V203 H1148", key: "b" },
  c1: { d: "M1265,392 H597", key: "c" },
  c2: { d: "M1265,388 H1110 V185 H1180 L1320,120", key: "c" },
};

const PHASE_COLORS = ["#dfe5ee", "#cdd8e8", "#b9c9e0", "#8fa8cc", "#5b7fb5", "#143c6e"];

export default function VipRobotSim() {
  const scenario = useMemo(() => buildScenario(), []);
  const { tracks, guest, president, cups, flash, LOOP, phases, backend } = scenario;

  const [time, setTime] = useState(0);
  const [hoverSpot, setHoverSpot] = useState<string | null>(null);
  const [pinnedSpot, setPinnedSpot] = useState<string | null>(null);
  const [playing, setPlaying] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (last.current != null) {
        const dt = (now - last.current) / 1000;
        setTime((t) => (t + dt * speed) % LOOP);
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, speed, LOOP]);

  const resolve = useCallback(
    (k: RobotKey, t: number) => positionAt(tracks[k], t).pos,
    [tracks]
  );
  const current = useMemo(() => {
    const out = {} as Record<RobotKey, ReturnType<typeof positionAt>>;
    (Object.keys(tracks) as RobotKey[]).forEach((k) => {
      out[k] = positionAt(tracks[k], time);
    });
    return out;
  }, [time, tracks]);
  const guestNow = useMemo(
    () => positionAt(guest, time, resolve),
    [time, guest, resolve]
  );
  const presNow = useMemo(
    () => positionAt(president, time, resolve),
    [time, president, resolve]
  );
  const robotSpot = current.b.seg.spot ?? null;
  const activeSpot = hoverSpot ?? pinnedSpot ?? robotSpot;
  const robotHere = activeSpot !== null && robotSpot === activeSpot;

  const phaseIdx = phases.reduce((acc, p, i) => (time >= p.t ? i : acc), 0);
  const backendNow = backend.reduce((acc, b) => (time >= b.t ? b : acc), backend[0]);

  const jumpToPhase = useCallback(
    (i: number) => {
      setTime(phases[i].t);
    },
    [phases]
  );

  const stateLabel: Record<State, string> = {
    idle: "Standing by",
    move: "Moving",
    speak: "Interacting",
    serve: "Serving",
  };

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
          Live simulation — service circulation
        </p>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            aria-label={playing ? "Pause simulation" : "Play simulation"}
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <rect x="3" y="2" width="3.4" height="12" rx="1" />
                <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M4 2.2v11.6a.6.6 0 0 0 .9.5l9-5.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTime(0)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            aria-label="Restart simulation"
            title="Restart"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2.5 8a5.5 5.5 0 1 0 1.8-4.1" />
              <path d="M2.2 2.2v3.2h3.2" />
            </svg>
          </button>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`rounded-full border px-2.5 py-1 font-medium transition-colors ${
                speed === s
                  ? "border-accent bg-accent text-white"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {phases.map((p, i) => (
            <li key={p.ko}>
              <button
                type="button"
                onClick={() => jumpToPhase(i)}
                className="block w-full text-left"
              >
                <span
                  className="block h-1.5 rounded-full transition-colors"
                  style={{
                    background:
                      i <= phaseIdx ? PHASE_COLORS[i] : "var(--border)",
                  }}
                />
                <span
                  className={`mt-1.5 block text-[11px] leading-tight ${
                    i === phaseIdx ? "font-semibold text-foreground" : "text-muted"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider text-warm">
                    {i + 1} · {p.ko}
                  </span>
                  {p.en}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <p className="mb-2 mt-5 text-[11px] text-muted">
          Modern ↔ Joseon narrative:{" "}
          <span className="text-foreground/80">Zone A = Seonggyungwan</span> ·{" "}
          <span className="text-foreground/80">Zone B = Donggung (East Palace)</span> ·{" "}
          <span className="text-foreground/80">Zone C = Seoyeonchŏ (study hall)</span>
        </p>

        <div className="relative">
        <svg
          viewBox="210 0 1190 790"
          className="h-auto w-full"
          role="img"
          aria-label="Floor plan of the President's Office with three serving robots moving along their service routes"
        >
          {ROOMS.map((r) => (
            <g key={r.name}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={10}
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth={2}
              />
              <text
                x={r.x + 14}
                y={r.y + r.h - 12}
                fontSize="15"
                fontWeight={600}
                fill="var(--foreground)"
                opacity={0.7}
              >
                {r.name}
              </text>
            </g>
          ))}

          {/* photo zone */}
          <rect
            x={865}
            y={128}
            width={140}
            height={30}
            rx={5}
            fill="#fff"
            stroke="#bdd0b7"
            strokeDasharray="4 3"
          />
          <text x={935} y={148} fontSize="13" textAnchor="middle" fill="var(--muted)">
            Photo zone
          </text>

          {FURNITURE.map((f, i) => (
            <g key={i}>
              <rect
                x={f.x}
                y={f.y}
                width={f.w}
                height={f.h}
                rx={6}
                fill="#d7d2c6"
                stroke="#b7b0a0"
              />
              {f.label && (
                <text
                  x={f.x + f.w / 2}
                  y={f.y + f.h / 2 + 5}
                  fontSize="13"
                  textAnchor="middle"
                  fill="var(--muted)"
                >
                  {f.label}
                </text>
              )}
            </g>
          ))}
          <text x={716} y={278} fontSize="11" fill="var(--muted)" transform="rotate(-90 716 278)" textAnchor="middle">
            Secretary desk
          </text>
          <text x={461} y={411} fontSize="11" textAnchor="middle" fill="var(--muted)">
            Monitor
          </text>
          <text
            x={246}
            y={276}
            fontSize="10"
            fill="var(--muted)"
            transform="rotate(-90 246 276)"
            textAnchor="middle"
          >
            Entrance painting
          </text>

          {/* exhibits */}
          {EXHIBITS.map((e, i) => (
            <g key={i}>
              <rect
                x={e.x}
                y={e.y}
                width={e.w}
                height={e.h}
                rx={3}
                fill="#fff"
                stroke="var(--muted)"
                strokeWidth={1.2}
              />
              {e.n && (
                <text
                  x={e.x + e.w / 2}
                  y={e.y + e.h / 2 + 5}
                  fontSize="13"
                  fontWeight={600}
                  textAnchor="middle"
                  fill="var(--foreground)"
                >
                  {e.n}
                </text>
              )}
            </g>
          ))}

          {/* doors */}
          {[
            [895, 430],
            [985, 430],
            [1270, 430],
          ].map(([x, y]) => (
            <path
              key={`${x}${y}`}
              d={`M${x - 14},${y} a14,14 0 0 1 28,0`}
              fill="#e8c9b0"
              stroke="#cf9a72"
            />
          ))}

          {/* route guides */}
          {Object.entries(GUIDES).map(([k, g]) => (
            <path
              key={k}
              d={g.d}
              fill="none"
              stroke={ROBOTS[g.key].color}
              strokeOpacity={k === "c2" ? 0.28 : 0.45}
              strokeWidth={3}
              strokeDasharray={k === "c2" ? "2 8" : "10 8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {POINTS.map((p) => (
            <g key={p.id}>
              {!(p.id in SPOTS) && (
                <circle cx={p.x} cy={p.y} r={6} fill="#fff" stroke="var(--muted)" strokeWidth={1.5} />
              )}
              {p.label && (
                <text x={p.x + 10} y={p.y - 8} fontSize="12" fill="var(--muted)">
                  {p.id}
                </text>
              )}
            </g>
          ))}

          {ENDPOINTS.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill="none"
                stroke={ROBOTS[p.key].color}
                strokeOpacity={0.5}
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y + 42}
                fontSize="12"
                textAnchor="middle"
                fill="var(--muted)"
              >
                {p.id}
              </text>
            </g>
          ))}

          {/* docent spots (hover / focus / click) */}
          {Object.keys(SPOTS).map((id) => {
            const pt = POINTS.find((p) => p.id === id)!;
            const on = activeSpot === id;
            return (
              <g
                key={id}
                tabIndex={0}
                role="button"
                aria-label={`Docent stop ${id}: ${SPOTS[id].title}`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHoverSpot(id)}
                onMouseLeave={() => setHoverSpot(null)}
                onFocus={() => setHoverSpot(id)}
                onBlur={() => setHoverSpot(null)}
                onClick={() => setPinnedSpot((p) => (p === id ? null : id))}
              >
                <circle cx={pt.x} cy={pt.y} r={26} fill="transparent" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={on ? 13 : 8}
                  fill={on ? "var(--accent)" : "#fff"}
                  fillOpacity={on ? 0.15 : 1}
                  stroke={on ? "var(--accent)" : "var(--muted)"}
                  strokeWidth={on ? 2.5 : 1.5}
                />
                <circle cx={pt.x} cy={pt.y} r={4} fill={on ? "var(--accent)" : "var(--muted)"} />
              </g>
            );
          })}

          {/* tea on the table */}
          {time >= cups.t0 && time < cups.t1 &&
            CUPS.map((c, i) => (
              <g key={i} transform={`translate(${c[0]} ${c[1]})`}>
                <ellipse cy={6} rx={13} ry={4} fill="#fff" stroke="#b7b0a0" />
                <path d="M-8,-4 h16 v6 a8,8 0 0 1 -16,0 z" fill="#fff" stroke="var(--warm)" strokeWidth={1.6} />
                <path d="M8,-1 a4,4 0 0 1 0,7" fill="none" stroke="var(--warm)" strokeWidth={1.6} />
                <path d="M-3,-9 q-3,-4 0,-8 M3,-9 q-3,-4 0,-8" fill="none" stroke="var(--muted)" strokeWidth={1.2} opacity={0.6}>
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.2s" repeatCount="indefinite" />
                </path>
              </g>
            ))}

          {/* camera flash */}
          {time >= flash.t0 && time < flash.t1 && (
            <circle cx={935} cy={160} r={70} fill="#fff" stroke="#f3d98b" strokeWidth={3} opacity={0.85} />
          )}

          {/* President + guest */}
          {[
            { pos: presNow.pos, fill: "#8a6d1c", label: "President", dy: 32 },
            { pos: guestNow.pos, fill: "#3a3d44", label: GUEST.name, dy: -22 },
          ].map((av) => (
            <g key={av.label} transform={`translate(${av.pos[0]} ${av.pos[1]})`}>
              <circle r={15} fill={av.fill} stroke="#fff" strokeWidth={3} />
              <circle cy={-4} r={4.5} fill="#fff" />
              <path d="M-8,9 a8,7 0 0 1 16,0 z" fill="#fff" />
              <text y={av.dy} fontSize="12" fontWeight={600} textAnchor="middle" fill="var(--foreground)">
                {av.label}
              </text>
            </g>
          ))}

          {/* robots */}
          {(Object.keys(ROBOTS) as RobotKey[]).map((k) => {
            const { pos, seg } = current[k];
            const active = seg.state === "speak" || seg.state === "serve";
            return (
              <g key={k} transform={`translate(${pos[0]} ${pos[1]})`}>
                {active && (
                  <circle r={28} fill={ROBOTS[k].color} opacity={0.18}>
                    <animate attributeName="r" values="22;32;22" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={17} fill={ROBOTS[k].color} stroke="#fff" strokeWidth={3} />
                {seg.carry && (
                  <g transform="translate(0 -30)">
                    <path d="M-7,-5 h14 v5 a7,7 0 0 1 -14,0 z" fill="#fff" stroke="var(--warm)" strokeWidth={1.6} />
                    <path d="M7,-2 a3.5,3.5 0 0 1 0,6" fill="none" stroke="var(--warm)" strokeWidth={1.6} />
                  </g>
                )}
                <text
                  fontSize="16"
                  fontWeight={700}
                  fill="#fff"
                  textAnchor="middle"
                  dy="5.5"
                >
                  {k.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-3 sm:absolute sm:left-0 sm:top-[57%] sm:mt-0 sm:w-[40%]">
          {activeSpot ? (
            <div className="rounded-xl border border-border bg-surface/95 p-3 shadow-[0_2px_12px_rgba(28,30,33,0.08)] backdrop-blur">
              <div className="flex gap-3">
                {SPOTS[activeSpot].img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={SPOTS[activeSpot].img}
                    alt=""
                    className="h-20 w-14 shrink-0 rounded-md border border-border object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-warm">
                    {activeSpot} ·{" "}
                    {robotHere
                      ? "Robot B is here now"
                      : hoverSpot === activeSpot
                        ? "Preview"
                        : "Pinned"}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold leading-snug text-foreground">
                    {SPOTS[activeSpot].title}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-muted">
                    {SPOTS[activeSpot].body}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-3 py-2 text-[12px] leading-snug text-muted">
              Hover a docent stop (B-1-1 to B-1-5), or watch Robot B, to see what
              it presents.
            </p>
          )}
        </div>

        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={LOOP}
            step={0.1}
            value={time}
            onChange={(e) => setTime(parseFloat(e.target.value))}
            className="h-1 w-full accent-[var(--accent)]"
            aria-label="Simulation timeline"
          />
          <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted">
            {time.toFixed(0)}s / {LOOP.toFixed(0)}s
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: `Guest · ${GUEST.name}`, sub: `${GUEST.role}`, text: guestNow.seg.text, fill: "#3a3d44" },
            { label: "President", sub: "Hosts the guest", text: presNow.seg.text, fill: "#8a6d1c" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-background/60 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: c.fill }}
                >
                  <svg viewBox="-10 -12 20 22" className="h-3 w-3" aria-hidden>
                    <circle cy={-4} r={4.5} fill="#fff" />
                    <path d="M-8,9 a8,7 0 0 1 16,0 z" fill="#fff" />
                  </svg>
                </span>
                {c.label}
                <span className="font-normal text-muted">· {c.sub}</span>
              </div>
              <p className="mt-2 min-h-[2.75rem] text-[13px] leading-snug text-foreground/80">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(Object.keys(ROBOTS) as RobotKey[]).map((k) => {
            const { seg } = current[k];
            return (
              <div
                key={k}
                className="rounded-xl border border-border bg-background/60 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: ROBOTS[k].color }}
                    />
                    {ROBOTS[k].name} · {ROBOTS[k].role}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                    {stateLabel[seg.state]}
                  </span>
                </div>
                <p className="mt-2 min-h-[2.75rem] text-[13px] leading-snug text-foreground/80">
                  {seg.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-border px-4 py-2.5 text-[12px] leading-snug text-muted">
          <span className="font-semibold uppercase tracking-wider text-warm">
            Back-end
          </span>{" "}
          <span className="text-foreground/80">{backendNow.text}</span>
        </div>

        <p className="mt-3 text-[11px] text-muted">
          Simulated from the project&apos;s service blueprint and floor-plan
          route map; positions and timings are illustrative.
        </p>
      </div>
    </div>
  );
}
