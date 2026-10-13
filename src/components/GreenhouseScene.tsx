"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/*
 * Stylized model of the Gregory College House Greenhouse and the spaces around
 * it. Layout follows my Sensory & Social Map (plan view); proportions are
 * approximate and the model is not to scale.
 */

const S = 0.02; // metres per plan unit
const CX = 352;
const CZ = 237;

type Spot = {
  id: string;
  label: string;
  caption: string;
  photo: string;
  // plan position
  x: number;
  y: number;
  h: number;
};

const SPOTS: Spot[] = [
  {
    id: "glass",
    label: "Glass room",
    caption: "The glass-roofed Greenhouse: sofa, rug and plants along the windows.",
    photo: "/images/greenhouse/9218.jpg",
    x: 460,
    y: 470,
    h: 2.4,
  },
  {
    id: "table",
    label: "Social table",
    caption: "White tables and red chairs at the center of the room.",
    photo: "/images/greenhouse/9214.jpg",
    x: 600,
    y: 255,
    h: 1.7,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    caption: "A shared kitchen behind the sliding door, with a long island.",
    photo: "/images/greenhouse/9217.jpg",
    x: 190,
    y: 270,
    h: 1.7,
  },
  {
    id: "nook",
    label: "Papasan corner",
    caption: "A quiet corner by the window with two papasan chairs.",
    photo: "/images/greenhouse/9215.jpg",
    x: 80,
    y: 410,
    h: 1.6,
  },
  {
    id: "mosaic",
    label: "Mosaic wall",
    caption: "A mosaic wall at the back of the social table area.",
    photo: "/images/greenhouse/9113.jpg",
    x: 670,
    y: 215,
    h: 1.9,
  },
];

const ZONES: { name: string; x: number; y: number; h?: number }[] = [
  { name: "Aisle", x: 200, y: 146 },
  { name: "Kitchen", x: 95, y: 260 },
  { name: "Social Table", x: 440, y: 270 },
  { name: "Greenhouse", x: 330, y: 430 },
  { name: "Hidden space", x: 105, y: 440 },
  { name: "Guard", x: 628, y: 180, h: 1.75 },
];

function toWorld(px: number, py: number): [number, number] {
  return [(px - CX) * S, (py - CZ) * S];
}

export default function GreenhouseScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [active, setActive] = useState<Spot | null>(null);
  const activeRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [locked, setLocked] = useState(false);
  const youRef = useRef<HTMLDivElement | null>(null);
  const api = useRef<{ start: () => void; stop: () => void; press: (k: string, down: boolean) => void } | null>(null);

  useEffect(() => {
    activeRef.current = active?.id ?? null;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
    camera.position.set(0, 13.5, 18.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 48;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.target.set(0, 0.2, -0.3);
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.45;

    // ---------- light ----------
    scene.add(new THREE.HemisphereLight(0xfff6e6, 0xd8cfb8, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 1.7);
    sun.position.set(-6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    // ---------- helpers ----------
    const mats = new Map<number, THREE.MeshStandardMaterial>();
    const mat = (c: number, rough = 0.85) => {
      const k = c * 10 + Math.round(rough * 10);
      let m = mats.get(k);
      if (!m) {
        m = new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0 });
        mats.set(k, m);
      }
      return m;
    };
    const disposables: { dispose: () => void }[] = [];
    let guardHead: THREE.Group | null = null;

    const rect = (
      x0: number, y0: number, x1: number, y1: number,
      h: number, color: number, base = 0, rough = 0.85, cast = true,
    ) => {
      const [wx0, wz0] = toWorld(x0, y0);
      const [wx1, wz1] = toWorld(x1, y1);
      const g = new THREE.BoxGeometry(wx1 - wx0, h, wz1 - wz0);
      disposables.push(g);
      const m = new THREE.Mesh(g, mat(color, rough));
      m.position.set((wx0 + wx1) / 2, base + h / 2, (wz0 + wz1) / 2);
      m.castShadow = cast;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };


    // Boston fern (arching fronds in a cream pot) or, when tall, the artificial olive tree (black pot, moss, thin trunk)
    const plant = (px: number, py: number, scale = 1, tall = false, baseY = 0) => {
      const [wx, wz] = toWorld(px, py);
      const grp = new THREE.Group();
      const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => {
        disposables.push(geo);
        const o = new THREE.Mesh(geo, m);
        o.position.set(x, y, z);
        o.castShadow = true;
        grp.add(o);
        return o;
      };
      if (tall) {
        add(new THREE.CylinderGeometry(0.24, 0.2, 0.42, 18), mat(0x1d1b18, 0.8), 0, 0.21, 0);
        add(new THREE.CylinderGeometry(0.225, 0.225, 0.02, 18), mat(0x4f7a2a, 1), 0, 0.42, 0);
        const bark = mat(0x8a6a48, 0.9);
        const trunk = add(new THREE.CylinderGeometry(0.02, 0.035, 1.5, 6), bark, 0, 1.1, 0);
        trunk.rotation.z = 0.04;
        for (const [bx, bz, ry] of [[0.18, 0.05, -0.5], [-0.16, -0.08, 0.5], [0.04, 0.2, 0]] as [number, number, number][]) {
          const br = add(new THREE.CylinderGeometry(0.012, 0.02, 0.7, 5), bark, bx * 0.5, 1.45, bz * 0.5);
          br.rotation.z = ry;
          br.rotation.x = bz * 1.4;
        }
        const leaf = mat(0x93ab72, 0.85);
        const leaf2 = mat(0x7b9a5c, 0.85);
        for (let i = 0; i < 26; i++) {
          const a2 = i * 2.4;
          const h = 1.15 + (i % 9) * 0.1;
          const r = 0.12 + ((i * 37) % 10) * 0.035;
          const g = add(new THREE.SphereGeometry(0.1, 8, 6), i % 3 ? leaf : leaf2, Math.cos(a2) * r, h, Math.sin(a2) * r);
          g.scale.set(1.6, 0.35, 0.8);
          g.rotation.y = a2;
          g.rotation.z = (i % 2 ? 1 : -1) * 0.3;
        }
        grp.scale.setScalar(scale);
      } else {
        add(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16), mat(0xe9e0cc, 0.8), 0, 0.15, 0);
        const fr1 = mat(0x5c9140, 0.9);
        const fr2 = mat(0x6fa84a, 0.9);
        // each frond is three tapered segments, each bent further down than the last, so it arches and droops
        for (let i = 0; i < 20; i++) {
          const a2 = (i / 20) * Math.PI * 2 + (i % 2) * 0.1;
          const m = i % 2 ? fr1 : fr2;
          const root = new THREE.Group();
          root.position.set(0, 0.3, 0);
          root.rotation.order = "YXZ";
          root.rotation.y = a2;
          root.rotation.x = 0.55 + (i % 4) * 0.1;
          let parent: THREE.Object3D = root;
          const segLen = 0.3 + (i % 3) * 0.05;
          for (let k = 0; k < 3; k++) {
            const holder = new THREE.Group();
            holder.position.set(0, k === 0 ? 0 : segLen, 0);
            holder.rotation.x = k === 0 ? 0 : 0.55;
            const geo = new THREE.ConeGeometry(0.08 * (1 - k * 0.25), segLen, 3);
            geo.translate(0, segLen / 2, 0);
            disposables.push(geo);
            const seg = new THREE.Mesh(geo, m);
            seg.scale.set(1, 1, 0.3);
            seg.castShadow = true;
            holder.add(seg);
            parent.add(holder);
            parent = holder;
          }
          grp.add(root);
        }
        grp.scale.setScalar(scale);
      }
      grp.position.set(wx, baseY, wz);
      scene.add(grp);
    };
    // small helpers: a box centred on a plan position, sizes in metres
    const bx = (w: number, h: number, d: number, color: number, px: number, py: number, y0 = 0, rough = 0.7, rotY = 0, cast = true) => {
      const [wx, wz] = toWorld(px, py);
      const g = new THREE.BoxGeometry(w, h, d);
      disposables.push(g);
      const m = new THREE.Mesh(g, mat(color, rough));
      m.position.set(wx, y0 + h / 2, wz);
      m.rotation.y = rotY;
      m.castShadow = cast;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };
    const cy = (r: number, h: number, color: number, px: number, py: number, y0 = 0, rough = 0.7, seg = 20) => {
      const [wx, wz] = toWorld(px, py);
      const g = new THREE.CylinderGeometry(r, r, h, seg);
      disposables.push(g);
      const m = new THREE.Mesh(g, mat(color, rough));
      m.position.set(wx, y0 + h / 2, wz);
      m.castShadow = true;
      scene.add(m);
      return m;
    };
    // the red stacking chairs (IMG_9214): moulded shell, slightly raked back, slim light legs
    const chair = (px: number, py: number, rot: number) => {
      const [wx, wz] = toWorld(px, py);
      const grp = new THREE.Group();
      const red = mat(0xe03a2a, 0.45);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 0.44), red);
      seat.position.y = 0.46;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.04), red);
      back.position.set(0, 0.68, -0.21);
      back.rotation.x = -0.14;
      const lumbar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.05), red);
      lumbar.position.set(0, 0.5, -0.2);
      grp.add(seat, back, lumbar);
      for (const [lx, lz, tilt] of [[-0.18, -0.18, 0.06], [0.18, -0.18, -0.06], [-0.19, 0.19, 0.05], [0.19, 0.19, -0.05]] as [number, number, number][]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.01, 0.46, 6), mat(0xc9ccd0, 0.35));
        leg.position.set(lx, 0.23, lz);
        leg.rotation.z = tilt;
        grp.add(leg);
      }
      grp.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
      grp.position.set(wx, 0, wz);
      grp.rotation.y = rot;
      scene.add(grp);
    };

    // ---------- ground & base slab ----------
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(40, 64),
      new THREE.MeshStandardMaterial({ color: 0xf3eee2, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.21;
    ground.receiveShadow = true;
    scene.add(ground);
    rect(14, 28, 692, 458, 0.2, 0xe7dfcc, -0.2, 1, false);
    rect(514, -58, 692, 28, 0.2, 0xe7dfcc, -0.2, 1, false);
    rect(69, 458, 692, 513, 0.2, 0xe7dfcc, -0.2, 1, false);

    // ---------- floors by zone ----------
    const floor = (x0: number, y0: number, x1: number, y1: number, c: number) =>
      rect(x0, y0, x1, y1, 0.04, c, 0, 0.95, false);
    floor(519, -54, 685, 97, 0xbfdcae); // entrance (stretched north into a lobby with two door sets)
    floor(20, 95, 685, 197, 0xf1c867); // aisle
    floor(20, 197, 325, 352, 0xf2c3a8); // kitchen
    floor(325, 197, 685, 352, 0xa9d0ea); // social table
    floor(195, 352, 685, 507, 0xa6cadc); // greenhouse
    floor(20, 352, 195, 451.6, 0xcfe8f6); // hidden space
    floor(75.4, 451.6, 195, 507, 0xcfe8f6); // (south-west corner notched by one glass bay)

    // ---------- walls (low cutaway, so the plan stays readable) ----------
    const wallMeshes: { m: THREE.Mesh; h: number }[] = [];
    const wall = (x0: number, y0: number, x1: number, y1: number, h = 1.15) => {
      const m = rect(x0, y0, x1, y1, h, 0xf8f4e8, 0.04, 0.9);
      wallMeshes.push({ m, h });
      return m;
    };
    const T = 5;
    wall(18, 94 - T, 362, 98); // aisle north, up to the food elevator
    wall(420, 94 - T, 455, 98); // aisle north, between the elevator and the emergency exit door
    wall(495, 94 - T, 520, 98); // aisle north, past the emergency exit door
    wall(18, 94 - T, 18 + T, 354); // west (aisle + kitchen only)
    wall(685, -54, 685 + T, 197); // east (lobby and aisle side); the social table side is the mosaic wall below
    wall(20, 195, 40, 199); // aisle / kitchen
    wall(77, 195, 355, 199); // aisle / kitchen
    // aisle / social table: glass partition with a double glass door (below)
    wall(20, 350, 325, 354); // kitchen south wall: against the hidden space and the Greenhouse
    // kitchen / social table wall, with a doorway (sliding door) between y 232 and 276
    wall(325, 197, 329, 232);
    wall(325, 276, 329, 354);
    rect(323, 229, 331, 232, 2.0, 0xc79a66, 0, 0.7); // door jambs
    rect(323, 276, 331, 279, 2.0, 0xc79a66, 0, 0.7);

    // ---------- glass roof and curtain walls: hidden space + Greenhouse ----------
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfe9f2, transparent: true, opacity: 0.28, roughness: 0.05,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x1d1b18, transparent: true, opacity: 0.38 });
    const [gx0, gz0] = toWorld(20, 352);
    const [gx1, gz1] = toWorld(685, 507);
    const gw = gx1 - gx0;
    const gd = gz1 - gz0;
    const eave = 2.2;
    const ridge = 2.9;
    const roofH = (z: number) => ridge - ((ridge - eave) * (z - gz0)) / gd;
    const nx = 12;
    const BAY = gw / nx; // one glass bay
    // the south-west corner of the hidden space is notched by one bay in both directions
    const nxm = gx0 + BAY;
    const nzm = gz1 - BAY;

    const glassWall = (w: number, h: number) => {
      const g = new THREE.PlaneGeometry(w, h);
      disposables.push(g);
      return new THREE.Mesh(g, glassMat);
    };
    // glass pane along z whose top follows the sloping roof (local x runs north from the south end)
    const glassSlope = (len: number, hSouth: number, hNorth: number) => {
      const sh = new THREE.Shape();
      sh.moveTo(0, 0);
      sh.lineTo(len, 0);
      sh.lineTo(len, hNorth);
      sh.lineTo(0, hSouth);
      sh.closePath();
      const g = new THREE.ShapeGeometry(sh);
      disposables.push(g);
      const m = new THREE.Mesh(g, glassMat);
      m.rotation.y = Math.PI / 2;
      return m;
    };
    const postAt = (x: number, z: number, h: number) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.06), frameMat);
      post.position.set(x, h / 2, z);
      scene.add(post);
    };

    // roof: two pieces, so the notch is cut out of the glass roof as well
    const roofPiece = (x0: number, x1: number, z0: number, z1: number) => {
      const h0 = roofH(z0);
      const h1 = roofH(z1);
      const d = z1 - z0;
      const len = Math.hypot(d, h0 - h1);
      const tilt = Math.atan2(h0 - h1, d);
      const geo = new THREE.PlaneGeometry(x1 - x0, len);
      disposables.push(geo);
      const m = new THREE.Mesh(geo, glassMat);
      m.rotation.x = -Math.PI / 2 + tilt;
      m.position.set((x0 + x1) / 2, (h0 + h1) / 2, (z0 + z1) / 2);
      scene.add(m);
      return { len, tilt, h0, h1 };
    };
    roofPiece(gx0, nxm, gz0, nzm);
    roofPiece(nxm, gx1, gz0, gz1);
    // ribs along the slope
    for (let i = 0; i <= nx; i++) {
      const x = gx0 + BAY * i;
      const zEnd = i === 0 ? nzm : gz1;
      const h0 = roofH(gz0);
      const h1 = roofH(zEnd);
      const len = Math.hypot(zEnd - gz0, h0 - h1);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, len), frameMat);
      bar.position.set(x, (h0 + h1) / 2, (gz0 + zEnd) / 2);
      bar.rotation.x = Math.atan2(h0 - h1, zEnd - gz0);
      scene.add(bar);
    }
    // cross bars
    for (let j = 0; j <= 2; j++) {
      const z = gz0 + (gd * j) / 2;
      const xs = z <= nzm + 0.001 ? gx0 : nxm;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(gx1 - xs, 0.035, 0.035), frameMat);
      bar.position.set((xs + gx1) / 2, roofH(z), z);
      scene.add(bar);
    }
    // south glass (from the notch to the east end)
    const south = glassWall(gx1 - nxm, eave);
    south.position.set((nxm + gx1) / 2, eave / 2, gz1);
    scene.add(south);
    for (let i = 1; i <= nx; i++) postAt(gx0 + BAY * i, gz1, eave);
    // east glass
    const east = glassSlope(gd, eave, ridge);
    east.position.set(gx1, 0, gz1);
    scene.add(east);
    for (let j = 0; j <= 3; j++) {
      const z = gz0 + (gd * j) / 3;
      postAt(gx1, z, roofH(z));
    }
    // west glass (north of the notch)
    const west = glassSlope(nzm - gz0, roofH(nzm), ridge);
    west.position.set(gx0, 0, nzm);
    scene.add(west);
    for (let j = 0; j <= 3; j++) {
      const z = gz0 + ((nzm - gz0) * j) / 3;
      postAt(gx0, z, roofH(z));
    }
    // the notch: a step glass facing south, then a pane facing west
    const step = glassWall(BAY, roofH(nzm));
    step.position.set((gx0 + nxm) / 2, roofH(nzm) / 2, nzm);
    scene.add(step);
    const inner = glassSlope(BAY, eave, roofH(nzm));
    inner.position.set(nxm, 0, gz1);
    scene.add(inner);
    postAt(nxm, nzm, roofH(nzm));
    postAt(nxm, gz1, eave);

    const woodFrame = new THREE.MeshStandardMaterial({ color: 0xc79a66, roughness: 0.6 });
    // aisle / social table: the whole partition is glass, with a double glass door
    {
      const DOOR0 = 415; // the double door spans two glass bays, one leaf per bay
      const DOOR1 = 490;
      const span = (x0: number, x1: number, n: number) => {
        const [wx0, bz] = toWorld(x0, 197);
        const [wx1] = toWorld(x1, 197);
        const pane = glassWall(wx1 - wx0, eave);
        pane.position.set((wx0 + wx1) / 2, eave / 2, bz);
        scene.add(pane);
        for (let i = 0; i <= n; i++) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, eave, 0.06), woodFrame);
          post.position.set(wx0 + ((wx1 - wx0) * i) / n, eave / 2, bz);
          scene.add(post);
        }
        const rail = new THREE.Mesh(new THREE.BoxGeometry(wx1 - wx0, 0.05, 0.05), woodFrame);
        rail.position.set((wx0 + wx1) / 2, eave, bz);
        scene.add(rail);
      };
      span(355, DOOR0, 2);
      span(DOOR1, 685, 5);
      // double door: left leaf closed, right leaf open into the social table room
      const [dx0, dz] = toWorld(DOOR0, 197);
      const [dx1] = toWorld(DOOR1, 197);
      const leafW = (dx1 - dx0) / 2;
      const leafH = 2.05;
      const leaf = (hingeX: number, dir: 1 | -1, angle: number) => {
        const grp = new THREE.Group();
        grp.position.set(hingeX, 0, dz);
        const pane = glassWall(leafW - 0.04, leafH - 0.06);
        pane.position.set(-dir * leafW / 2, leafH / 2, 0);
        grp.add(pane);
        const bars: [number, number, number, number, number][] = [
          [leafW, 0.05, 0.05, -dir * leafW / 2, leafH],
          [leafW, 0.05, 0.05, -dir * leafW / 2, 0.03],
          [0.05, leafH, 0.05, 0, leafH / 2],
          [0.05, leafH, 0.05, -dir * leafW, leafH / 2],
        ];
        for (const [w, h, d, x, y] of bars) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodFrame);
          b.position.set(x, y, 0);
          grp.add(b);
        }
        grp.rotation.y = angle;
        scene.add(grp);
      };
      leaf(dx0, -1, 0); // left leaf, hinged on the left jamb, extends +x, closed
      leaf(dx1, 1, 1.45); // right leaf, hinged on the right jamb, swung open
      const header = new THREE.Mesh(new THREE.BoxGeometry(dx1 - dx0, 0.06, 0.06), woodFrame);
      header.position.set((dx0 + dx1) / 2, eave, dz);
      scene.add(header);
    }
    // ---------- furniture ----------
    // aisle: trash bins, EV/stairs/guard blocks
    rect(100, 98, 130, 118, 0.7, 0x3a5470);
    rect(143, 98, 173, 118, 0.7, 0x3a5470);
    rect(186, 98, 214, 118, 0.7, 0x3a5470);
    rect(362, 70, 420, 97, 1.8, 0x3a5470); // food elevator (kept)
    rect(366, 96, 416, 99, 1.5, 0xb7c0c8, 0, 0.4); // stainless doors on the elevator front
    rect(390, 96, 392, 99.4, 1.5, 0x6b7580, 0, 0.4);
    // emergency stairs: a door in the aisle's north wall (ajar), with an EXIT sign
    {
      const [hx, hz] = toWorld(455, 93.5);
      const [ex, ] = toWorld(495, 93.5);
      const wdoor = ex - hx;
      const leaf = new THREE.Group();
      leaf.position.set(hx, 0, hz);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(wdoor, 2.0, 0.05), mat(0x7a8b83, 0.6));
      slab.position.set(wdoor / 2, 1.0, 0);
      slab.castShadow = true;
      leaf.add(slab);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.06), mat(0xd9d4c8, 0.3));
      bar.position.set(wdoor - 0.2, 1.0, 0);
      leaf.add(bar);
      leaf.rotation.y = -0.9;
      scene.add(leaf);
      // jambs and header
      for (const jx of [hx, ex]) {
        const j = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.22), mat(0x5b6b64, 0.7));
        j.position.set(jx, 1.05, hz);
        scene.add(j);
      }
      const header = new THREE.Mesh(new THREE.BoxGeometry(ex - hx + 0.08, 0.1, 0.22), mat(0x5b6b64, 0.7));
      header.position.set((hx + ex) / 2, 2.1, hz);
      scene.add(header);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.06), new THREE.MeshBasicMaterial({ color: 0x1fa05a }));
      sign.position.set((hx + ex) / 2, 2.3, hz + 0.1);
      scene.add(sign);
      disposables.push(slab.geometry, bar.geometry, header.geometry, sign.geometry, sign.material);
    }
    // guard post: front desk, back counter, and a seated guard (NPC)
    // oak front desk with a white top, a monitor and a clear screen, between the guard and the entrance
    rect(598, 150, 664, 166, 1.0, 0xc99a5b, 0, 0.6);
    rect(596, 148, 666, 168, 0.04, 0xf4f2ee, 1.0, 0.5);
    rect(660, 150, 685, 194, 0.95, 0xc99a5b, 0, 0.6); // oak shelving and pin boards behind the guard
    rect(664, 152, 684, 192, 0.1, 0x3b4a5a, 1.2, 0.8, false);
    {
      const [mx, mz] = toWorld(630, 168);
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.03), mat(0x14161a, 0.4));
      mon.position.set(mx, 1.28, mz - 0.1);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.04), mat(0x14161a, 0.4));
      stand.position.set(mx, 1.14, mz - 0.1);
      scene.add(mon, stand);
      const [sx0, sz0] = toWorld(596, 148);
      const [sx1] = toWorld(666, 148);
      const screen = glassWall(sx1 - sx0, 0.55);
      screen.position.set((sx0 + sx1) / 2, 1.32, sz0);
      scene.add(screen);
      disposables.push(mon.geometry, stand.geometry);
    }
    rect(612, 168, 644, 192, 0.04, 0xd9d4c8, 0.04, 1, false); // chair mat
    {
      const [wx, wz] = toWorld(628, 180);
      const g = new THREE.Group();
      const skin = mat(0xe6bfa0, 0.7);
      const uni = mat(0xf2f2ef, 0.8);
      const pants = mat(0x2a2f3a, 0.8);
      const dark = mat(0x1d1b18, 0.7);
      const put = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => {
        disposables.push(geo);
        const o = new THREE.Mesh(geo, m);
        o.position.set(x, y, z);
        o.castShadow = true;
        g.add(o);
        return o;
      };
      // office chair
      put(new THREE.BoxGeometry(0.5, 0.07, 0.5), dark, 0, 0.45, 0);
      put(new THREE.BoxGeometry(0.5, 0.55, 0.07), dark, 0, 0.78, -0.25);
      put(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), dark, 0, 0.22, 0);
      // seated body (local +z is forward)
      put(new THREE.BoxGeometry(0.34, 0.1, 0.5), pants, 0, 0.54, 0.08); // thighs
      put(new THREE.BoxGeometry(0.34, 0.5, 0.2), uni, 0, 0.84, -0.08); // torso
      put(new THREE.BoxGeometry(0.1, 0.45, 0.12), dark, -0.09, 0.27, 0.33); // shins
      put(new THREE.BoxGeometry(0.1, 0.45, 0.12), dark, 0.09, 0.27, 0.33);
      for (const sx of [-0.21, 0.21]) {
        const arm = put(new THREE.BoxGeometry(0.09, 0.09, 0.42), uni, sx, 0.98, 0.14);
        arm.rotation.x = 0.35;
      }
      const head = new THREE.Group();
      head.position.set(0, 1.24, -0.06);
      const face = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), skin);
      face.castShadow = true;
      const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.07, 18), dark);
      capTop.position.y = 0.09;
      const brim = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, 0.1), dark);
      brim.position.set(0, 0.06, 0.13);
      for (const geo of [face.geometry, capTop.geometry, brim.geometry]) disposables.push(geo);
      head.add(face, capTop, brim);
      g.add(head);
      guardHead = head;
      g.position.set(wx, 0, wz);
      g.rotation.y = Math.PI; // facing north, toward the entrance
      scene.add(g);
    }

    // kitchen (IMG_9217, IMG_9216): maple cabinets with white stone tops, a white two-door fridge,
    // an island on two maple end panels, white drum pendants with red undersides
    const maple = 0xd2a469;
    const stone = 0xf1f0ec;
    // sink run along the north wall
    rect(98, 200, 285, 225, 0.86, maple, 0, 0.6);
    rect(96, 199, 287, 227, 0.035, stone, 0.86, 0.35);
    for (let i = 0; i < 6; i++) bx(0.28, 0.5, 0.012, 0xb98c56, 112 + i * 29, 226.4, 0.18, 0.6); // cabinet doors
    cy(0.012, 0.16, 0xd8dde0, 172, 205, 0.895, 0.2);
    {
      const [fx, fz] = toWorld(172, 207);
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14, Math.PI), mat(0xd8dde0, 0.2));
      hook.position.set(fx, 1.06, fz + 0.0);
      hook.rotation.z = Math.PI / 2;
      scene.add(hook);
      disposables.push(hook.geometry);
    }
    bx(0.42, 0.01, 0.34, 0x9aa0a5, 172, 213, 0.865, 0.3); // sink basin
    bx(0.22, 0.27, 0.14, 0x1a1c1f, 128, 200.8, 1.05, 0.4); // paper towel dispenser
    bx(0.1, 0.18, 0.08, 0xe9e5da, 200, 200.8, 1.05, 0.5); // soap dispenser
    // fridge: white, split into freezer and fridge doors, with vertical handles
    bx(0.74, 1.72, 0.7, 0xf4f4f1, 306, 212, 0, 0.35);
    bx(0.74, 0.012, 0.012, 0xc8cbce, 306, 226.4, 1.15, 0.3);
    bx(0.025, 0.4, 0.03, 0xb9bdc1, 292, 226.8, 1.25, 0.2);
    bx(0.025, 0.55, 0.03, 0xb9bdc1, 292, 226.8, 0.45, 0.2);
    // island: white top on two maple end panels
    rect(98, 257, 272, 300, 0.035, stone, 0.9, 0.35);
    rect(104, 258, 112, 299, 0.9, maple, 0, 0.6);
    rect(258, 258, 266, 299, 0.9, maple, 0, 0.6);
    // counter with the microwave, toaster, kettle and induction hob (south side of the kitchen)
    rect(98, 318, 325, 350, 0.86, maple, 0, 0.6);
    rect(96, 316, 327, 350, 0.035, stone, 0.86, 0.35);
    bx(0.5, 0.3, 0.36, 0xf4f4f1, 130, 334, 0.895, 0.4);
    bx(0.3, 0.2, 0.18, 0xc7ccd1, 178, 336, 0.895, 0.25);
    bx(0.2, 0.22, 0.16, 0x1d1b18, 208, 336, 0.895, 0.4);
    bx(0.55, 0.012, 0.45, 0x14161a, 255, 334, 0.895, 0.25);
    rect(20, 336, 98, 350, 0.6, 0xd9d6cc, 0, 0.6); // A/C unit
    // blue recycling bin by the door and a black waste bin
    bx(0.46, 0.84, 0.46, 0x2b5aa6, 306, 270, 0, 0.6);
    bx(0.3, 0.3, 0.012, 0xf4f4f1, 306, 281.5, 0.35, 0.5);
    // pendant lamps: white drums with a red underside, hung on thin cables
    for (const [lx, ly] of [[150, 280], [225, 280]] as [number, number][]) {
      const [px2, pz2] = toWorld(lx, ly);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 28), mat(0xf4f4f1, 0.5));
      drum.position.set(px2, 1.85, pz2);
      const under = new THREE.Mesh(new THREE.CircleGeometry(0.28, 28), new THREE.MeshBasicMaterial({ color: 0xd8483f }));
      under.rotation.x = Math.PI / 2;
      under.position.set(px2, 1.745, pz2);
      const glow = new THREE.Mesh(new THREE.CircleGeometry(0.18, 24), new THREE.MeshBasicMaterial({ color: 0xfff6e0 }));
      glow.rotation.x = Math.PI / 2;
      glow.position.set(px2, 1.742, pz2);
      const cab = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.6, 5), mat(0x1d1b18, 0.6));
      cab.position.set(px2, 2.25, pz2);
      scene.add(drum, under, glow, cab);
      disposables.push(drum.geometry, under.geometry, under.material, glow.geometry, glow.material, cab.geometry);
    }

    // social table (IMG_9214): white tables on grey legs with casters, red chairs, navy laundry carts,
    // a white boucle bean bag, black metal shelving with baskets and an orange mushroom lamp
    const whiteTable = (x0: number, y0: number, x1: number, y1: number, h = 0.74) => {
      rect(x0, y0, x1, y1, 0.035, 0xf4f4f1, h - 0.035, 0.35);
      for (const [lx, ly] of [[x0 + 3, y0 + 3], [x1 - 3, y0 + 3], [x0 + 3, y1 - 3], [x1 - 3, y1 - 3]] as [number, number][]) {
        cy(0.022, h - 0.07, 0xa9aeb3, lx, ly, 0.06, 0.3, 8);
        cy(0.03, 0.05, 0x2b2b2b, lx, ly, 0, 0.6, 8); // caster
      }
    };
    whiteTable(574, 222, 628, 276);
    whiteTable(574, 288, 628, 342);
    for (const [px, py, r] of [
      [552, 249, Math.PI / 2], [650, 249, -Math.PI / 2], [601, 212, 0],
      [552, 315, Math.PI / 2], [650, 315, -Math.PI / 2], [601, 352, Math.PI],
    ] as [number, number, number][]) chair(px, py, r);
    // small pot of flowers on the table
    cy(0.05, 0.08, 0xe6a1b8, 590, 232, 0.775, 0.5, 12);
    {
      const [fx, fz] = toWorld(590, 232);
      for (let i = 0; i < 6; i++) {
        const a2 = i * 1.05;
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), mat(i % 2 ? 0xf3c5d4 : 0xfaf1f4, 0.6));
        fl.position.set(fx + Math.cos(a2) * 0.05, 0.9 + (i % 3) * 0.03, fz + Math.sin(a2) * 0.05);
        scene.add(fl);
        disposables.push(fl.geometry);
      }
    }
    // navy laundry carts along the mosaic wall
    for (const cyc of [248, 300] as number[]) {
      bx(0.5, 0.86, 0.95, 0x1b2b45, 668, cyc, 0.1, 0.7);
      bx(0.01, 0.2, 0.3, 0xf4f4f1, 643.2, cyc, 0.45, 0.5); // label
      cy(0.04, 0.06, 0x14161a, 660, cyc - 17, 0, 0.6, 8);
      cy(0.04, 0.06, 0x14161a, 660, cyc + 17, 0, 0.6, 8);
    }
    // white boucle bean bag (the "couch" circle on the map)
    {
      const [bxw, bzw] = toWorld(350, 320);
      const boucle = new THREE.MeshStandardMaterial({ color: 0xf6f3ec, roughness: 1 });
      const seatG = new THREE.SphereGeometry(0.46, 20, 14);
      const backG = new THREE.SphereGeometry(0.36, 18, 12);
      const seatM = new THREE.Mesh(seatG, boucle);
      seatM.scale.set(1, 0.58, 1);
      seatM.position.set(bxw, 0.26, bzw);
      const backM = new THREE.Mesh(backG, boucle);
      backM.scale.set(1, 1.05, 0.7);
      backM.position.set(bxw - 0.25, 0.55, bzw);
      for (const m of [seatM, backM]) { m.castShadow = true; scene.add(m); }
      disposables.push(seatG, backG, boucle);
    }
    // black metal open shelving with woven baskets, and the orange mushroom lamp on top
    const metalShelf = (px: number, py: number, withLamp: boolean) => {
      const [sx, sz] = toWorld(px, py);
      const g = new THREE.Group();
      const blk = mat(0x1a1a1a, 0.5);
      const wood = mat(0x7a5a3a, 0.8);
      for (const [lx, lz] of [[-0.3, -0.13], [0.3, -0.13], [-0.3, 0.13], [0.3, 0.13]]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.5, 0.03), blk);
        post.position.set(lx, 0.75, lz);
        g.add(post);
      }
      for (const y of [0.04, 0.42, 0.8, 1.18, 1.5]) {
        const board = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.03, 0.3), y > 1.4 ? blk : wood);
        board.position.y = y;
        g.add(board);
      }
      const basketCols = [0x8aa890, 0x1f3a52, 0x2a2a2a, 0x8aa890, 0x1f3a52];
      [0.1, 0.48, 0.86].forEach((y, row) => {
        for (let i = 0; i < 2; i++) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.22, 0.25), mat(basketCols[(row + i) % 5], 0.95));
          b.position.set(-0.15 + i * 0.3, y + 0.13, 0);
          g.add(b);
        }
      });
      if (withLamp) {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf26b1d, roughness: 0.5 }));
        dome.position.set(0, 1.52, 0);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.1, 8), mat(0xf4f4f1, 0.6));
        stem.position.set(0, 1.56, 0);
        g.add(dome, stem);
        disposables.push(dome.geometry, dome.material, stem.geometry);
      }
      g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { (o as THREE.Mesh).castShadow = true; disposables.push((o as THREE.Mesh).geometry); } });
      g.position.set(sx, 0, sz);
      scene.add(g);
    };
    metalShelf(342, 346, true);
    metalShelf(342, 209, false);
    // low wooden bench with a brochure rack next to the sliding door
    bx(0.56, 0.38, 0.3, 0xc99a5b, 345, 286, 0, 0.7);
    bx(0.4, 0.28, 0.07, 0xf4f4f1, 345, 286, 0.38, 0.5, 0.2);
    // the wooden sliding door, pushed open along the wall
    bx(0.07, 2.05, 0.9, 0xd9b27a, 319, 222, 0, 0.6);
    bx(0.06, 0.05, 1.0, 0x3a3a3a, 316, 222, 2.05, 0.4);
    // mosaic wall: the whole east wall of the social table is covered in the mosaic
    const mosaicTex = (() => {
      const c = document.createElement("canvas");
      c.width = 896; c.height = 640;
      const g = c.getContext("2d")!;
      g.fillStyle = "#c98f86"; g.fillRect(0, 0, c.width, c.height);
      const pal = ["#d8b23a", "#2f7f86", "#24386b", "#e8c36a", "#b9552e", "#f2ddd0", "#5f8a4a", "#d8b23a", "#e3a79b"];
      for (let i = 0; i < 1500; i++) {
        g.fillStyle = pal[(Math.random() * pal.length) | 0];
        g.beginPath();
        g.ellipse(Math.random() * c.width, Math.random() * c.height, 5 + Math.random() * 16, 4 + Math.random() * 12, Math.random() * 3, 0, Math.PI * 2);
        g.fill();
      }
      // a few flowing ribbons, like the swirls in the real piece
      g.lineWidth = 7;
      for (let r = 0; r < 7; r++) {
        g.strokeStyle = pal[(Math.random() * pal.length) | 0];
        g.beginPath();
        let x = 0, y = Math.random() * c.height;
        g.moveTo(x, y);
        while (x < c.width) {
          x += 60 + Math.random() * 50;
          y += (Math.random() - 0.5) * 140;
          g.lineTo(x, y);
        }
        g.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      disposables.push(t);
      return t;
    })();
    {
      const [mx0, mz0] = toWorld(685, 197);
      const [, mz1] = toWorld(685, 352);
      const depth = mz1 - mz0;
      const g = new THREE.BoxGeometry(0.1, eave, depth);
      disposables.push(g);
      const plain = mat(0xf8f4e8, 0.9);
      const face = new THREE.MeshStandardMaterial({ map: mosaicTex, roughness: 0.8 });
      // +x, -x (room side, mosaic), +y, -y, +z, -z
      const m = new THREE.Mesh(g, [plain, face, plain, plain, plain, plain]);
      m.position.set(mx0 + 0.05, eave / 2, (mz0 + mz1) / 2);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      disposables.push(face);
    }

    // greenhouse (IMG_9107, IMG_2650): a charcoal fabric sofa with round pleated pillows, a blob rug,
    // a wicker tray on a black stand, cream-potted ferns along the windows
    {
      const [sx, sz] = toWorld(468, 478);
      const g = new THREE.Group();
      const fabric = mat(0x6b6c72, 0.95);
      const fabricD = mat(0x56575c, 0.95);
      const part = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        disposables.push(geo);
        const o = new THREE.Mesh(geo, m);
        o.position.set(x, y, z);
        o.castShadow = true;
        o.receiveShadow = true;
        g.add(o);
      };
      const L = 2.5;
      part(L, 0.2, 0.84, fabricD, 0, 0.28, 0); // base
      part(L - 0.5, 0.17, 0.68, fabric, 0, 0.47, -0.06); // seat cushions
      part(L - 0.5, 0.42, 0.18, fabric, 0, 0.7, 0.33); // back, on the window side
      part(0.25, 0.5, 0.84, fabricD, -L / 2 + 0.125, 0.5, 0); // arms
      part(0.25, 0.5, 0.84, fabricD, L / 2 - 0.125, 0.5, 0);
      for (const lx of [-L / 2 + 0.1, L / 2 - 0.1]) for (const lz of [-0.34, 0.34]) part(0.05, 0.18, 0.05, mat(0x5a4632, 0.8), lx, 0.09, lz);
      // round pleated pillows: crimson, two sage greens, and a tan one at the left end
      const pillows: [number, number, number, number][] = [[-0.85, 0.66, 0.2, 0xb4465a], [-0.35, 0.62, 0.15, 0x7a9a6a], [0.2, 0.62, 0.15, 0x6b8e5a], [-1.0, 0.6, -0.12, 0xd9a05b]];
      for (const [x, y, z, c] of pillows) {
        const pg = new THREE.CylinderGeometry(0.2, 0.2, 0.09, 24);
        disposables.push(pg);
        const pm = new THREE.Mesh(pg, mat(c, 0.7));
        pm.position.set(x, y, z);
        pm.rotation.x = Math.PI / 2 + 0.3;
        pm.castShadow = true;
        g.add(pm);
      }
      g.position.set(sx, 0, sz);
      scene.add(g);
    }
    // blob rug: a salmon shape with a lighter peach inner shape (IMG_9107)
    {
      const c = document.createElement("canvas");
      c.width = 1024; c.height = 640;
      const g = c.getContext("2d")!;
      const blob = (cx: number, cy2: number, rx: number, ry: number, col: string, wob: number) => {
        g.fillStyle = col;
        g.beginPath();
        for (let i = 0; i <= 64; i++) {
          const t = (i / 64) * Math.PI * 2;
          const r = 1 + Math.sin(t * 3 + wob) * 0.07 + Math.sin(t * 2 + wob * 2) * 0.05;
          const x = cx + Math.cos(t) * rx * r;
          const y = cy2 + Math.sin(t) * ry * r;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.closePath();
        g.fill();
      };
      blob(520, 330, 470, 290, "#d98a78", 0.4);
      blob(560, 350, 330, 190, "#ecaa94", 1.7);
      blob(610, 330, 190, 110, "#f4c4ac", 2.6);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      disposables.push(tex);
      const [rx, rz] = toWorld(450, 422);
      const geo = new THREE.PlaneGeometry(3.4, 2.1);
      disposables.push(geo);
      const rug = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 1 }));
      rug.rotation.x = -Math.PI / 2;
      rug.position.set(rx, 0.05, rz);
      rug.receiveShadow = true;
      scene.add(rug);
      disposables.push(rug.material);
    }
    // wicker tray on a black stand next to the sofa
    {
      const [wx, wz] = toWorld(392, 452);
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.09, 22, 1, true), new THREE.MeshStandardMaterial({ color: 0xb98a56, roughness: 0.9, side: THREE.DoubleSide }));
      tray.position.set(wx, 0.6, wz);
      const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.015, 22), mat(0xb98a56, 0.9));
      bottom.position.set(wx, 0.56, wz);
      scene.add(tray, bottom);
      disposables.push(tray.geometry, tray.material, bottom.geometry);
      for (let k = 0; k < 4; k++) {
        const ang = (k / 4) * Math.PI * 2 + 0.4;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.58, 6), mat(0x1d1b18, 0.5));
        leg.position.set(wx + Math.cos(ang) * 0.17, 0.29, wz + Math.sin(ang) * 0.17);
        scene.add(leg);
        disposables.push(leg.geometry);
      }
    }
    // a low white table with black legs by the hidden-space side
    rect(228, 485, 280, 500, 0.03, 0xf4f4f1, 0.45, 0.4);
    for (const [lx, ly] of [[231, 488], [277, 488], [231, 497], [277, 497]] as [number, number][]) cy(0.012, 0.45, 0x1d1b18, lx, ly, 0, 0.5, 6);
    // east end (IMG_9104): brown leather lounge chair on a light wood frame with an orange round pillow,
    // a round brown pouf in front, and a wicker tray table on thin black legs
    {
      const [cx, cz] = toWorld(640, 462);
      const chairG = new THREE.Group();
      const oak = mat(0xd1a672, 0.6);
      const leather = new THREE.MeshStandardMaterial({ color: 0x6e4f4a, roughness: 0.45, side: THREE.DoubleSide });
      const bits: THREE.Mesh[] = [];
      for (const [lx, lz] of [[-0.28, -0.24], [0.28, -0.24], [-0.28, 0.24], [0.28, 0.24]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.38, 0.045), oak);
        leg.position.set(lx, 0.19, lz);
        bits.push(leg);
      }
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.56), oak);
      rail.position.y = 0.38;
      bits.push(rail);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.56), leather);
      seat.position.y = 0.47;
      bits.push(seat);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.5, 24, 1, true, Math.PI / 2, Math.PI), leather);
      barrel.position.set(0, 0.72, 0);
      bits.push(barrel);
      const pillowG = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 10), mat(0xd9783f, 0.6));
      pillowG.scale.y = 0.35;
      pillowG.rotation.x = Math.PI / 2;
      pillowG.position.set(0, 0.72, -0.2);
      bits.push(pillowG);
      for (const b of bits) { b.castShadow = true; chairG.add(b); disposables.push(b.geometry); }
      chairG.position.set(cx, 0, cz);
      chairG.rotation.y = -(3 * Math.PI) / 4; // in the south-east corner, angled 45° toward the room (north-west)
      scene.add(chairG);
      disposables.push(leather);

      const [px, pz] = toWorld(612, 438);
      const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.4, 24), mat(0x5f4540, 0.5));
      pouf.position.set(px, 0.2, pz);
      pouf.castShadow = true;
      scene.add(pouf);
      disposables.push(pouf.geometry);

      const [tx, tz] = toWorld(640, 425);
      const wicker = mat(0xb98a56, 0.9);
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.08, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xb98a56, roughness: 0.9, side: THREE.DoubleSide }));
      tray.position.set(tx, 0.52, tz);
      const trayBase = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.015, 20), wicker);
      trayBase.position.set(tx, 0.49, tz);
      scene.add(tray, trayBase);
      disposables.push(tray.geometry, trayBase.geometry, tray.material);
      for (let k = 0; k < 3; k++) {
        const ang = (k / 3) * Math.PI * 2 + 0.4;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), mat(0x1d1b18, 0.5));
        leg.position.set(tx + Math.cos(ang) * 0.14, 0.25, tz + Math.sin(ang) * 0.14);
        scene.add(leg);
        disposables.push(leg.geometry);
      }
    }
    for (const [px, py, s, t] of [
      [308, 479, 1.0, false], [338, 491, 0.8, false], [575, 487, 1.0, false], [662, 487, 1.2, true],
      [240, 366, 1.1, true], [655, 360, 1.1, true], [250, 503, 0.7, false],
    ] as [number, number, number, boolean][]) plant(px, py, s, t);
    // window details (IMG_9107, IMG_9215, IMG_9108)
    const radiator = (x0: number, x1: number, y: number) => {
      rect(x0, y, x1, y + 8, 0.28, 0xeeeeea, 0, 0.5);
      for (let i = 0; i < 10; i++) {
        const sx = x0 + 4 + (i * (x1 - x0 - 8)) / 9;
        bx(0.02, 0.14, 0.012, 0xb7bbc0, sx, y + 8.5, 0.07, 0.4);
      }
    };
    radiator(200, 390, 495);
    radiator(560, 680, 495);
    radiator(80, 190, 355);
    // ledge along the south glass with small terracotta pots
    rect(200, 499, 683, 507, 0.03, 0x2a2826, 0.9, 0.7);
    for (let i = 0; i < 18; i++) {
      const px2 = 210 + i * 26 + (i % 3) * 3;
      cy(0.05 + (i % 2) * 0.012, 0.09 + (i % 3) * 0.02, [0xcf6a3a, 0x3f78a8, 0xe0a36a, 0xb4573a][i % 4], px2, 503, 0.93, 0.8, 12);
      if (i % 2 === 0) {
        const [qx, qz] = toWorld(px2, 503);
        const lf = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), mat(0x6a9a4a, 0.9));
        lf.position.set(qx, 1.1 + (i % 3) * 0.02, qz);
        scene.add(lf);
        disposables.push(lf.geometry);
      }
    }
    // framed botanical prints, a camera track and two cameras on the grey wall
    {
      const wallZ = toWorld(0, 354.5)[1];
      for (const [fx, fy2, col] of [[205, 1.55, 0x4f8a4a], [226, 1.55, 0xe7a7b8], [247, 1.55, 0x4f8a4a]] as [number, number, number][]) {
        const [wx] = toWorld(fx, 0);
        const frameG = new THREE.BoxGeometry(0.3, 0.4, 0.025);
        const picG = new THREE.PlaneGeometry(0.24, 0.34);
        disposables.push(frameG, picG);
        const frame = new THREE.Mesh(frameG, mat(0x1d1b18, 0.5));
        frame.position.set(wx, fy2, wallZ + 0.01);
        const pic = new THREE.Mesh(picG, mat(col, 0.9));
        pic.position.set(wx, fy2, wallZ + 0.03);
        const paper = new THREE.Mesh(picG, mat(0xf4f1e8, 0.9));
        paper.scale.set(1.04, 1.04, 1);
        paper.position.set(wx, fy2, wallZ + 0.027);
        scene.add(frame, paper, pic);
      }
      const [tx0] = toWorld(120, 0);
      const [tx1] = toWorld(300, 0);
      const trackG = new THREE.BoxGeometry(tx1 - tx0, 0.03, 0.03);
      disposables.push(trackG);
      const track = new THREE.Mesh(trackG, mat(0xf4f4f1, 0.5));
      track.position.set((tx0 + tx1) / 2, 2.0, wallZ + 0.05);
      scene.add(track);
      for (const cx2 of [150, 255]) {
        const [qx] = toWorld(cx2, 0);
        const camG = new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12);
        disposables.push(camG);
        const cam = new THREE.Mesh(camG, mat(0xf4f4f1, 0.4));
        cam.rotation.x = Math.PI / 2;
        cam.position.set(qx, 1.95, wallZ + 0.13);
        scene.add(cam);
      }
    }
    // hanging Boston ferns under the roof
    for (const [hx, hy] of [[330, 470], [610, 485], [500, 495]] as [number, number][]) {
      const [qx, qz] = toWorld(hx, hy);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.5, 5), mat(0x1d1b18, 0.6));
      chain.position.set(qx, 2.0, qz);
      scene.add(chain);
      disposables.push(chain.geometry);
      plant(hx, hy, 0.8, false, 1.5);
    }
    // hidden space
    rect(70, 355, 193, 372, 0.6, 0xd9d6cc);
    // papasan corner (IMG_9215, IMG_9105): saucer chairs on woven bases, a spindle side table, a white sculpture
    const papasan = (px: number, py: number, tx: number, ty: number, pillow: number) => {
      const [wx, wz] = toWorld(px, py);
      const [twx, twz] = toWorld(tx, ty);
      const grp = new THREE.Group();
      const dark = mat(0x1f1d1b, 0.95);
      const R = 0.5;
      const baseGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.42, 14);
      const base = new THREE.Mesh(baseGeo, dark);
      base.position.y = 0.21;
      base.castShadow = true;
      grp.add(base);
      const bowl = new THREE.Group();
      bowl.position.y = 0.62;
      bowl.rotation.x = 0.55; // tilted back, opening toward the room
      const shellGeo = new THREE.SphereGeometry(R, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const shell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({ color: 0x2a2826, roughness: 0.95, side: THREE.DoubleSide }));
      shell.scale.y = 0.62;
      shell.castShadow = true;
      bowl.add(shell);
      const padGeo = new THREE.SphereGeometry(R - 0.04, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const pad = new THREE.Mesh(padGeo, new THREE.MeshStandardMaterial({ color: 0x34302e, roughness: 1, side: THREE.DoubleSide }));
      pad.scale.y = 0.5;
      pad.position.y = 0.05;
      bowl.add(pad);
      const rimGeo = new THREE.TorusGeometry(R, 0.035, 8, 40);
      const rim = new THREE.Mesh(rimGeo, dark);
      rim.rotation.x = Math.PI / 2;
      bowl.add(rim);
      const pillowGeo = new THREE.SphereGeometry(0.17, 16, 10);
      const pil = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: pillow, roughness: 0.6 }));
      pil.scale.y = 0.45;
      pil.position.set(0, -0.12, 0.14);
      bowl.add(pil);
      grp.add(bowl);
      grp.position.set(wx, 0, wz);
      grp.rotation.y = Math.atan2(twx - wx, twz - wz);
      scene.add(grp);
      disposables.push(baseGeo, shellGeo, padGeo, rimGeo, pillowGeo, shell.material, pad.material, pil.material);
    };
    papasan(50, 392, 150, 400, 0xd9825b);
    papasan(50, 432, 150, 410, 0xb4465a);
    // long white table along the south glass with small potted plants on it (IMG_9105)
    rect(85, 484, 190, 497, 0.04, 0xf4f2ee, 0.16, 0.6);
    for (const [lx, ly] of [[88, 486], [185, 486], [88, 494], [185, 494]] as [number, number][]) rect(lx - 1, ly - 1, lx + 1, ly + 1, 0.16, 0x1d1b18);
    plant(110, 490, 0.38, false, 0.2);
    plant(140, 490, 0.34, false, 0.2);
    plant(170, 490, 0.4, false, 0.2);
    {
      // spindle side table between the chairs
      const [tx, tz] = toWorld(60, 412);
      const wood = mat(0x4a2f20, 0.6);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), wood);
      top.position.set(tx, 0.62, tz);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.6, 10), wood);
      stem.position.set(tx, 0.3, tz);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.025, 20), wood);
      foot.position.set(tx, 0.013, tz);
      for (const m of [top, stem, foot]) { m.castShadow = true; scene.add(m); disposables.push(m.geometry); }
      // white coral sculpture on a white cube
      const [sx, sz] = toWorld(40, 368);
      const white = mat(0xf4f2ee, 0.7);
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.36), white);
      cube.position.set(sx, 0.25, sz);
      cube.castShadow = true;
      scene.add(cube);
      disposables.push(cube.geometry);
      for (const [dx, dy, dz, r] of [[0, 0.72, 0, 0.17], [0.1, 0.92, 0.02, 0.13], [-0.1, 1.0, -0.03, 0.12], [0.02, 1.15, 0.05, 0.1], [-0.12, 0.75, 0.08, 0.1]] as [number, number, number, number][]) {
        const g = new THREE.IcosahedronGeometry(r, 1);
        const m = new THREE.Mesh(g, white);
        m.position.set(sx + dx, dy, sz + dz);
        m.castShadow = true;
        scene.add(m);
        disposables.push(g);
      }
    }

    // ---------- entrance lobby (from the walk-through video) ----------
    // two glass door sets in dark frames, a swing gate and a turnstile, the HOUSE STAFF board, a column
    {
      const darkMat = mat(0x1d1b18, 0.5);
      const steel = mat(0xb7c0c8, 0.35);
      const glassDoorSet = (x0: number, x1: number, y: number, openRight: boolean) => {
        const [wx0, wz] = toWorld(x0, y);
        const [wx1] = toWorld(x1, y);
        const w = wx1 - wx0;
        const doorH = 2.05;
        const leafW = w / 2;
        // jambs and header
        for (const jx of [wx0, (wx0 + wx1) / 2, wx1]) {
          const j = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.14), darkMat);
          j.position.set(jx, doorH / 2, wz);
          scene.add(j);
          disposables.push(j.geometry);
        }
        const hd = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.1, 0.14), darkMat);
        hd.position.set((wx0 + wx1) / 2, doorH, wz);
        scene.add(hd);
        disposables.push(hd.geometry);
        const leaf = (hx: number, dir: 1 | -1, angle: number) => {
          const g = new THREE.Group();
          g.position.set(hx, 0, wz);
          const pane = glassWall(leafW - 0.06, doorH - 0.14);
          pane.position.set(dir * leafW / 2, doorH / 2, 0);
          g.add(pane);
          for (const [bw, bh, bx, by] of [[leafW, 0.07, dir * leafW / 2, 0.05], [leafW, 0.07, dir * leafW / 2, doorH - 0.08], [0.06, doorH, 0.03 * dir, doorH / 2], [0.06, doorH, dir * (leafW - 0.03), doorH / 2]] as number[][]) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.05), darkMat);
            b.position.set(bx, by, 0);
            g.add(b);
            disposables.push(b.geometry);
          }
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.03), steel);
          bar.position.set(dir * (leafW - 0.12), 1.0, 0.06);
          g.add(bar);
          g.rotation.y = angle;
          scene.add(g);
        };
        leaf(wx0, 1, openRight ? 0 : 0.5);
        leaf(wx1, -1, openRight ? -0.9 : 0);
      };
      // outer set at the north face, inner set a step behind it
      glassDoorSet(555, 665, -52, true);
      glassDoorSet(555, 665, -6, false);
      // front wall and side lights around the door sets
      wall(519, -54, 555, -50);
      wall(665, -54, 690, -50);
      wall(517, -54, 521, 98); // lobby west wall
      wall(519, -8, 555, -4);
      wall(665, -8, 685, -4);
      // red EXIT sign over the inner doors
      const [ex, ez] = toWorld(610, -6);
      const exit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.06), new THREE.MeshBasicMaterial({ color: 0xd8322a }));
      exit.position.set(ex, 2.3, ez + 0.1);
      scene.add(exit);
      disposables.push(exit.geometry, exit.material);

      // swing gate (pickets) and a stainless turnstile cabinet with a card reader
      const gateY = 82;
      for (let i = 0; i <= 9; i++) {
        const [gx, gz] = toWorld(566 + i * 3.6, gateY);
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.95, 0.025), steel);
        post.position.set(gx, 0.5, gz);
        scene.add(post);
        disposables.push(post.geometry);
      }
      rect(564, gateY - 1, 600, gateY + 1, 0.04, 0xb7c0c8, 1.0, 0.35);
      rect(564, gateY - 1, 600, gateY + 1, 0.04, 0xb7c0c8, 0.08, 0.35);
      rect(636, gateY - 8, 670, gateY + 8, 1.0, 0xaeb6bd, 0, 0.35);
      rect(641, gateY - 6, 665, gateY + 6, 0.08, 0x8a949c, 1.0, 0.35);
      rect(638, gateY - 9, 644, gateY - 7, 0.18, 0x14161a, 0.95, 0.4);

      // HOUSE STAFF board on the east wall (teal, with a title)
      const boardTex = (() => {
        const c = document.createElement("canvas");
        c.width = 512; c.height = 256;
        const g = c.getContext("2d")!;
        g.fillStyle = "#7fb5b8"; g.fillRect(0, 0, 512, 256);
        g.fillStyle = "#1d1b18";
        g.font = "bold 58px sans-serif";
        g.textAlign = "center";
        g.fillText("HOUSE STAFF", 256, 88);
        g.fillStyle = "#f4f2ee";
        for (let i = 0; i < 4; i++) g.fillRect(52 + i * 112, 120, 84, 104);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        disposables.push(t);
        return t;
      })();
      const [bx, bz] = toWorld(685, 78);
      const boardGeo = new THREE.PlaneGeometry(1.5, 0.75);
      const board = new THREE.Mesh(boardGeo, new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.8 }));
      board.rotation.y = -Math.PI / 2;
      board.position.set(bx - 0.01, 1.55, bz);
      scene.add(board);
      disposables.push(boardGeo, board.material);

    }

    // ---------- outside the glass ----------
    // south (behind the sofa): overgrown with plants, a lawn and trees beyond, as in the photos
    // west / east / north: sparse, just a low hedge, the path and the street
    {
      let seed = 20260926;
      const rnd = () => {
        seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      let layer = 0; // each ground patch sits a hair above the previous one, to avoid flicker where they overlap
      const flat = (x0: number, x1: number, z0: number, z1: number, color: number) => {
        const y = -0.2 + 0.004 * ++layer;
        const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
        disposables.push(g);
        const m = new THREE.Mesh(g, mat(color, 1));
        m.rotation.x = -Math.PI / 2;
        m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
        m.receiveShadow = true;
        scene.add(m);
      };
      const greens = [0x4f7a43, 0x5f8a4a, 0x6f9a55, 0x3f6b3a, 0x7aa35c];
      const blob = (x: number, y: number, z: number, r: number, c: number) => {
        const g = new THREE.IcosahedronGeometry(r, 1);
        disposables.push(g);
        const m = new THREE.Mesh(g, mat(c, 0.95));
        m.position.set(x, y, z);
        scene.add(m);
      };
      const tree = (x: number, z: number, h: number, r: number) => {
        const tg = new THREE.CylinderGeometry(0.12, 0.2, h, 8);
        disposables.push(tg);
        const trunk = new THREE.Mesh(tg, mat(0x6a5238, 0.9));
        trunk.position.set(x, h / 2 - 0.2, z);
        scene.add(trunk);
        for (let k = 0; k < 4; k++) blob(x + (rnd() - 0.5) * r, h + (k - 1) * r * 0.45, z + (rnd() - 0.5) * r, r * (0.8 + rnd() * 0.4), greens[(rnd() * greens.length) | 0]);
      };

      const [wx0] = toWorld(14, 0);
      const [wx1] = toWorld(692, 0);
      const [, zN] = toWorld(0, -58);
      const [, zS] = toWorld(0, 513);

      // --- south: lush strip only behind the sofa, a plain lawn at both ends of the glass
      const sofaX0 = toWorld(368, 0)[0] - 0.8;
      const sofaX1 = toWorld(556, 0)[0] + 0.8;
      flat(wx0 - 8, wx1 + 8, zS, zS + 20, 0x86b06a); // lawn
      flat(sofaX0, sofaX1, zS, zS + 1.6, 0x6e9a58); // planting bed
      const inBand = () => sofaX0 + rnd() * (sofaX1 - sofaX0);
      for (let i = 0; i < 46; i++) {
        blob(inBand(), 0.25 + rnd() * 1.1, zS + 0.35 + rnd() * 1.2, 0.3 + rnd() * 0.45, greens[(rnd() * greens.length) | 0]);
      }
      // a taller layer of climbers and ferns at the glass
      for (let i = 0; i < 28; i++) {
        blob(inBand(), 1.0 + rnd() * 1.0, zS + 0.2 + rnd() * 0.5, 0.25 + rnd() * 0.3, greens[(rnd() * greens.length) | 0]);
      }
      // trees beyond the lawn, also only behind the sofa
      for (let i = 0; i < 5; i++) tree(sofaX0 + 0.5 + i * ((sofaX1 - sofaX0 - 1) / 4) + (rnd() - 0.5) * 0.6, zS + 6 + rnd() * 4, 1.8 + rnd() * 1.0, 0.8 + rnd() * 0.45);
      // --- west: sidewalk, street and a low hedge
      const xW = wx0 - 0.2;
      flat(xW - 12, xW, zN - 4, zS + 4, 0xd7d1c1); // sidewalk
      flat(xW - 12, xW - 3.4, zN - 4, zS + 4, 0x8a8a88); // street
      for (let i = 0; i < 12; i++) blob(xW - 0.4 - rnd() * 0.5, 0.2 + rnd() * 0.35, wx0 * 0 + zN + 1 + rnd() * (zS - zN + 2), 0.2 + rnd() * 0.15, greens[(rnd() * greens.length) | 0]);
      // --- east: a path along the park and a few shrubs
      const xE = wx1 + 0.2;
      flat(xE, xE + 12, zN - 4, zS + 4, 0xd7d1c1);
      flat(xE + 3.2, xE + 12, zN - 4, zS + 4, 0x86b06a);
      for (let i = 0; i < 10; i++) blob(xE + 0.3 + rnd() * 0.5, 0.2 + rnd() * 0.3, zN + 2 + rnd() * (zS - zN), 0.2 + rnd() * 0.15, greens[(rnd() * greens.length) | 0]);

      // --- north: pavement in front of the doors
      flat(wx0 - 4, wx1 + 4, zN - 6, zN, 0xd7d1c1);
    }

    // ---------- YOU: a playable avatar that starts in the aisle by the entrance ----------
    type Rect = [number, number, number, number];
    type Disc = [number, number, number];
    const WALK: Rect[] = [
      [523, -50, 683, 99], [22, 99, 683, 195], [40, 193, 77, 201], [22, 199, 323, 350], [323, 232, 331, 276],
      [331, 199, 683, 352], [453, 193, 490, 201], [197, 352, 683, 505], [22, 352, 197, 505],
    ];
    const BLOCK: Rect[] = [
      [100, 98, 130, 118], [143, 98, 173, 118], [186, 98, 214, 118], // bins
      [596, 148, 666, 168], [660, 150, 685, 194], // guard desk and shelving
      [564, 77, 600, 87], [636, 73, 670, 91], // swing gate and turnstile (the gap between them is the way through)
      [519, -9, 610, -3], [665, -9, 685, -3], // lobby door set (right leaf is open)
      [98, 200, 285, 225], [287, 200, 325, 225], [98, 257, 272, 300], [98, 318, 325, 350], [22, 336, 98, 350], // kitchen
      [546, 206, 656, 360], [327, 277, 360, 296], [327, 196, 358, 224], [327, 338, 358, 352], // social table
      [660, 220, 685, 322], [226, 483, 282, 502], // laundry carts and the low table
      [20, 452, 75, 513], [85, 484, 190, 497], // hidden space notch and long table
      [400, 452, 538, 500], // sofa
    ];
    const DISCS: Disc[] = [
      [628, 180, 14], [350, 320, 26], [306, 270, 12], [392, 452, 11], [50, 392, 26], [50, 432, 26], [60, 412, 12], [40, 368, 12], [240, 366, 18],
      [640, 462, 22], [612, 438, 16], [640, 425, 10], [308, 479, 18], [338, 491, 14], [575, 487, 18], [662, 487, 22],
      [655, 360, 22], [250, 503, 12],
    ];
    const R = 10;
    const inRect = (x: number, y: number, r: Rect, pad = 0) => x > r[0] - pad && x < r[2] + pad && y > r[1] - pad && y < r[3] + pad;
    const SAMPLES: [number, number][] = [[0, 0], [R, 0], [-R, 0], [0, R], [0, -R], [R * 0.7, R * 0.7], [-R * 0.7, R * 0.7], [R * 0.7, -R * 0.7], [-R * 0.7, -R * 0.7]];
    const canStand = (x: number, y: number) => {
      for (const [dx, dy] of SAMPLES) {
        const px = x + dx, py = y + dy;
        if (!WALK.some((r) => inRect(px, py, r))) return false;
      }
      for (const b of BLOCK) if (inRect(x, y, b, R * 0.9)) return false;
      for (const [cx, cy, cr] of DISCS) if (Math.hypot(x - cx, y - cy) < cr + R * 0.9) return false;
      return true;
    };

    const you = new THREE.Group();
    const shirt = mat(0xc8431f, 0.7);
    const trousers = mat(0x24386b, 0.8);
    const skin = mat(0xe6bfa0, 0.7);
    const hairM = mat(0x1d1b18, 0.8);
    const pack = mat(0x2a2f3a, 0.8);
    const addTo = (g: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => {
      disposables.push(geo);
      const o = new THREE.Mesh(geo, m);
      o.position.set(x, y, z);
      o.castShadow = true;
      g.add(o);
      return o;
    };
    addTo(you, new THREE.CapsuleGeometry(0.17, 0.46, 4, 10), shirt, 0, 1.12, 0);
    addTo(you, new THREE.SphereGeometry(0.13, 14, 12), skin, 0, 1.58, 0);
    const hair = addTo(you, new THREE.SphereGeometry(0.135, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM, 0, 1.6, -0.01);
    hair.rotation.x = -0.25;
    addTo(you, new THREE.BoxGeometry(0.3, 0.38, 0.14), pack, 0, 1.15, -0.2);
    const legL = new THREE.Group();
    const legR = new THREE.Group();
    legL.position.set(-0.08, 0.8, 0);
    legR.position.set(0.08, 0.8, 0);
    addTo(legL, new THREE.CapsuleGeometry(0.075, 0.55, 4, 8), trousers, 0, -0.38, 0);
    addTo(legR, new THREE.CapsuleGeometry(0.075, 0.55, 4, 8), trousers, 0, -0.38, 0);
    you.add(legL, legR);
    const [yx0, yz0] = toWorld(545, 140);
    you.position.set(yx0, 0, yz0);
    scene.add(you);
    const me = { x: 545, y: 140, face: Math.PI, moving: false, tx: null as number | null, ty: null as number | null };

    // first person: the camera sits at YOU's eyes
    let mode: "orbit" | "enter" | "play" | "exit" = "orbit";
    const saved = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), target: new THREE.Vector3(), fov: 36 };
    const keys = new Set<string>();
    const EYE = 1.35;
    let pitch = 0;
    const KEYS = new Set(["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    const keyName = (e: KeyboardEvent) => (e.code.startsWith("Key") ? e.code.slice(3).toLowerCase() : e.key);
    const onKeyDown = (e: KeyboardEvent) => {
      if (mode !== "play" && mode !== "enter") return;
      const k = keyName(e);
      if (KEYS.has(k)) { keys.add(k); e.preventDefault(); }
      if (e.key === "Escape") api.current?.stop();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.delete(keyName(e)); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const eyeQuat = new THREE.Quaternion();
    const eul = new THREE.Euler(0, 0, 0, "YXZ");
    const eyePos = new THREE.Vector3();
    const setEyePose = () => {
      const [wx, wz] = toWorld(me.x, me.y);
      eyePos.set(wx, EYE, wz);
      eul.set(pitch, me.face + Math.PI, 0, "YXZ");
      eyeQuat.setFromEuler(eul);
    };
    const raiseWalls = (up: boolean) => {
      for (const { m, h } of wallMeshes) {
        const k = up ? 2.3 / h : 1;
        m.scale.y = k;
        m.position.y = 0.04 + (h * k) / 2;
      }
    };

    const startPlay = () => {
      if (mode !== "orbit") return;
      saved.pos.copy(camera.position);
      saved.quat.copy(camera.quaternion);
      saved.target.copy(controls.target);
      saved.fov = camera.fov;
      controls.autoRotate = false;
      controls.enabled = false;
      pitch = 0;
      you.visible = false;
      raiseWalls(true);
      mode = "enter";
      setPlaying(true);
      capture();
    };
    const stopPlay = () => {
      if (mode !== "play" && mode !== "enter") return;
      keys.clear();
      you.visible = true;
      raiseWalls(false);
      mode = "exit";
      setPlaying(false);
      if (isLocked()) document.exitPointerLock();
    };
    api.current = {
      start: startPlay,
      stop: stopPlay,
      press: (k, down) => { if (down) keys.add(k); else keys.delete(k); },
    };

    // look around like an FPS: the mouse or trackpad turns the view once the pointer is captured;
    // if capture is not available, dragging works as a fallback
    const cv = renderer.domElement;
    const isLocked = () => document.pointerLockElement === cv;
    const capture = () => {
      try {
        const r = cv.requestPointerLock() as unknown as Promise<void> | undefined;
        r?.catch?.(() => {});
      } catch {
        /* not available: dragging still works */
      }
    };
    let dragging = false;
    let lastX = 0, lastY = 0;
    const look = (mx: number, my: number, k: number) => {
      me.face -= mx * k;
      pitch = Math.max(-1.2, Math.min(1.1, pitch - my * k * 0.85));
    };
    const onDown = (e: PointerEvent) => {
      if (mode !== "play") return;
      if (!isLocked()) capture();
      dragging = true; lastX = e.clientX; lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (mode !== "play") return;
      if (isLocked()) { look(e.movementX, e.movementY, 0.0024); return; }
      if (!dragging) return;
      look(e.clientX - lastX, e.clientY - lastY, 0.005);
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = () => { dragging = false; };
    const onLockChange = () => setLocked(isLocked());
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerlockchange", onLockChange);

    let lastT = performance.now();
    let autoId: string | null = null;
    const stepYou = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      if (mode === "play" || mode === "enter") {
        // arrows left/right turn, W/S and up/down walk, A/D strafe
        if (keys.has("ArrowLeft")) me.face += 1.9 * dt;
        if (keys.has("ArrowRight")) me.face -= 1.9 * dt;
        const fwd = (keys.has("w") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("s") || keys.has("ArrowDown") ? 1 : 0);
        const str = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
        let dx = Math.sin(me.face) * fwd - Math.cos(me.face) * str;
        let dy = Math.cos(me.face) * fwd + Math.sin(me.face) * str;
        const len = Math.hypot(dx, dy);
        me.moving = len > 0;
        if (len > 0) {
          dx /= len; dy /= len;
          const sp = 105 * dt;
          const nx = me.x + dx * sp, ny = me.y + dy * sp;
          if (canStand(nx, ny)) { me.x = nx; me.y = ny; }
          else if (canStand(nx, me.y)) me.x = nx;
          else if (canStand(me.x, ny)) me.y = ny;
        }
      } else {
        me.moving = false;
      }
      const [wx, wz] = toWorld(me.x, me.y);
      you.position.x = wx;
      you.position.z = wz;
      you.rotation.y = me.face;
      const sw = me.moving ? Math.sin(now / 120) * 0.7 : 0;
      legL.rotation.x = sw;
      legR.rotation.x = -sw;

      // camera
      const wantFov = mode === "orbit" || mode === "exit" ? saved.fov : 72;
      if (Math.abs(camera.fov - wantFov) > 0.05) {
        camera.fov += (wantFov - camera.fov) * Math.min(1, dt * 5);
        camera.updateProjectionMatrix();
      }
      if (mode === "enter") {
        setEyePose();
        const k = Math.min(1, dt * 4.5);
        camera.position.lerp(eyePos, k);
        camera.quaternion.slerp(eyeQuat, k);
        if (camera.position.distanceTo(eyePos) < 0.15) mode = "play";
      } else if (mode === "play") {
        setEyePose();
        const bob = me.moving ? Math.sin(now / 120) * 0.025 : 0;
        camera.position.set(eyePos.x, eyePos.y + bob, eyePos.z);
        camera.quaternion.copy(eyeQuat);
        // photo card pops up near a photo spot
        let near: Spot | null = null;
        let nd = 75;
        for (const sp2 of SPOTS) { const d = Math.hypot(me.x - sp2.x, me.y - sp2.y); if (d < nd) { nd = d; near = sp2; } }
        if (near && autoId !== near.id) { autoId = near.id; setActive(near); }
        else if (!near && autoId) { autoId = null; setActive(null); }
      } else if (mode === "exit") {
        const k = Math.min(1, dt * 3.5);
        camera.position.lerp(saved.pos, k);
        camera.quaternion.slerp(saved.quat, k);
        if (camera.position.distanceTo(saved.pos) < 0.08) {
          camera.position.copy(saved.pos);
          camera.quaternion.copy(saved.quat);
          controls.target.copy(saved.target);
          controls.enabled = true;
          mode = "orbit";
          autoId = null;
        }
      }
    };

    // ---------- size & loop ----------
    const dir0 = camera.position.clone().sub(controls.target).normalize();
    const dist0 = camera.position.distanceTo(controls.target);
    let touched = false;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      if (!touched && mode === "orbit") {
        // narrow screens: pull back and lower the model so it clears the title
        const narrow = camera.aspect < 1.9;
        const k = narrow ? Math.min(2.4, 1.9 / camera.aspect) : 1;
        controls.target.set(0, 0.2, -0.3);
        camera.position.copy(controls.target).addScaledVector(dir0, dist0 * k);
      }
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    controls.addEventListener("start", () => { controls.autoRotate = false; touched = true; });

    const v = new THREE.Vector3();
    const place = (el: HTMLElement | null, x: number, y: number, h: number, hideBehind = false) => {
      if (!el) return;
      const [wx, wz] = toWorld(x, y);
      v.set(wx, h, wz).project(camera);
      const w = mount.clientWidth;
      const hh = mount.clientHeight;
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      el.style.opacity = visible ? (hideBehind ? "0.9" : "1") : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
      el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * hh}px) translate(-50%, -50%)`;
    };

    let raf = 0;
    const tick = () => {
      stepYou(performance.now());
      if (mode === "orbit") controls.update();
      if (guardHead && !reduced) guardHead.rotation.y = Math.sin(performance.now() / 2600) * 0.45;
      renderer.render(scene, camera);
      for (const s of SPOTS) place(pinRefs.current[s.id], s.x, s.y, s.h);
      for (const z of ZONES) place(zoneRefs.current[z.name], z.x, z.y, z.h ?? 0.1, true);
      if (mode !== "orbit") for (const z of ZONES) { const el = zoneRefs.current[z.name]; if (el) el.style.opacity = "0"; }
      if (youRef.current && mode !== "orbit") youRef.current.style.opacity = "0";
      if (youRef.current && mode === "orbit") {
        youRef.current.style.opacity = "1";
        const [tx, tz] = toWorld(me.x, me.y);
        v.set(tx, 2.05, tz).project(camera);
        const w = mount.clientWidth;
        const hh = mount.clientHeight;
        youRef.current.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * hh}px) translate(-50%, -100%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cv.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === cv) document.exitPointerLock();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
      mats.forEach((m) => m.dispose());
      glassMat.dispose();
      frameMat.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="absolute inset-0 select-none">
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ZONES.map((z) => (
          <div
            key={z.name}
            ref={(el) => { zoneRefs.current[z.name] = el; }}
            className="absolute left-0 top-0 font-serif text-[15px] italic text-foreground/60"
            style={{ willChange: "transform" }}
          >
            {z.name}
          </div>
        ))}
        <div
          ref={youRef}
          className="absolute left-0 top-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow"
          style={{ willChange: "transform" }}
        >
          YOU
        </div>
        {SPOTS.map((s) => (
          <button
            key={s.id}
            ref={(el) => { pinRefs.current[s.id] = el; }}
            onClick={() => setActive(s)}
            aria-label={`Show photo: ${s.label}`}
            className={`group absolute left-0 top-0 flex items-center gap-2 ${playing ? "!pointer-events-none !opacity-0" : ""}`}
            style={{ willChange: "transform" }}
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-4 w-4 animate-ping rounded-full bg-accent/40" />
              <span className="relative h-3 w-3 rounded-full border-2 border-white bg-accent shadow" />
            </span>
            <span className="rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
        <button
          onClick={() => (playing ? api.current?.stop() : api.current?.start())}
          className="rounded-full border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-foreground shadow transition-colors hover:border-accent hover:text-accent"
        >
          {playing ? "Exit  ·  Esc" : "Take control of YOU"}
        </button>
        {playing && !locked && (
          <p className="max-w-[220px] rounded-md bg-accent px-3 py-2 text-right text-[11px] font-medium leading-relaxed text-white shadow">
            Click the view to capture the mouse, then look around with your trackpad
          </p>
        )}
        {playing && (
          <p className="max-w-[220px] rounded-md bg-surface/90 px-3 py-2 text-right text-[11px] leading-relaxed text-muted shadow">
            W A S D or arrows to move · move the mouse / trackpad to look · walk up to a spot for its photo
          </p>
        )}
      </div>
      {playing && (
        <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-1 sm:hidden" aria-hidden>
          {[["", ""], ["ArrowUp", "↑"], ["", ""], ["ArrowLeft", "↶"], ["ArrowDown", "↓"], ["ArrowRight", "↷"]].map(([k, label], i) =>
            k ? (
              <button
                key={i}
                onPointerDown={(e) => { e.preventDefault(); api.current?.press(k, true); }}
                onPointerUp={() => api.current?.press(k, false)}
                onPointerLeave={() => api.current?.press(k, false)}
                onPointerCancel={() => api.current?.press(k, false)}
                className="h-11 w-11 touch-none rounded-lg border border-border bg-surface/90 text-lg text-foreground shadow"
              >
                {label}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      )}

      {active && (
        <figure className="absolute bottom-4 right-4 w-[min(92%,300px)] overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.photo} alt={active.caption} className="aspect-[4/3] w-full object-cover" />
          <figcaption className="flex items-start justify-between gap-3 p-3 text-sm text-foreground/80">
            <span>
              <span className="block font-serif text-base text-foreground">{active.label}</span>
              {active.caption}
            </span>
            <button
              onClick={() => setActive(null)}
              className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted hover:text-accent"
              aria-label="Close photo"
            >
              Close
            </button>
          </figcaption>
        </figure>
      )}
    </div>
  );
}
