// The VIP reception service blueprint, redrawn in English from the project's Korean slide.
// Six ceremony stages along the top, front-end lanes by robot role, and the back-end work behind them.
const INK = "#1d1b18";
const MUTED = "#6b655a";

const ROLE = {
  host: { fill: "#cfe3f7", stroke: "#5b8fc4", name: "Robot A · Lobby host", short: "Lobby host" },
  docent: { fill: "#d3ebc8", stroke: "#6aa05a", name: "Robot B · Docent", short: "Docent" },
  drinks: { fill: "#f7d3b8", stroke: "#d08a52", name: "Robot C · Beverage service", short: "Beverages" },
} as const;
type Role = keyof typeof ROLE;
const ROBOT_IMG: Record<Role, string> = { host: "/images/home/robot-a.png", docent: "/images/home/robot-b.png", drinks: "/images/home/robot-c.png" };

// stage columns: x, width
const STAGES: { n: number; x: number; w: number; t: string[] }[] = [
  { n: 1, x: 66, w: 130, t: ["Welcoming", "the guest"] },
  { n: 2, x: 196, w: 190, t: ["Mutual", "greeting"] },
  { n: 3, x: 386, w: 290, t: ["Moving to the", "meeting room"] },
  { n: 4, x: 676, w: 190, t: ["Seated,", "tea served"] },
  { n: 5, x: 866, w: 100, t: ["Meeting"] },
  { n: 6, x: 966, w: 314, t: ["Seeing the", "guests off"] },
];

type Box = { x: number; w: number; row: 0 | 1 | 2; role: Role; t: string[] };
const FRONT: Box[] = [
  { x: 198, w: 40, row: 0, role: "host", t: ["Greet"] },
  { x: 242, w: 84, row: 0, role: "host", t: ["Guide to", "Room B"] },
  { x: 330, w: 52, row: 0, role: "host", t: ["Greet", "& wait"] },
  { x: 388, w: 40, row: 1, role: "docent", t: ["Greet"] },
  { x: 432, w: 78, row: 1, role: "docent", t: ["Guide to", "Room C"] },
  { x: 514, w: 76, row: 1, role: "docent", t: ["Docent", "tour"] },
  { x: 594, w: 78, row: 1, role: "docent", t: ["Greet", "& wait"] },
  { x: 514, w: 70, row: 2, role: "drinks", t: ["Receive", "drinks"] },
  { x: 588, w: 70, row: 2, role: "drinks", t: ["Move to", "Room C"] },
  { x: 662, w: 70, row: 2, role: "drinks", t: ["Greet", "& wait"] },
  { x: 736, w: 40, row: 2, role: "drinks", t: ["Greet"] },
  { x: 780, w: 80, row: 2, role: "drinks", t: ["Return to", "Room B"] },
  { x: 968, w: 40, row: 1, role: "docent", t: ["Greet"] },
  { x: 1012, w: 84, row: 1, role: "docent", t: ["Photo", "help"] },
  { x: 1100, w: 84, row: 1, role: "docent", t: ["Guide to", "Room A"] },
  { x: 1188, w: 86, row: 1, role: "docent", t: ["Greet", "& wait"] },
  { x: 1100, w: 40, row: 0, role: "host", t: ["Greet"] },
  { x: 1144, w: 76, row: 0, role: "host", t: ["To the", "elevator"] },
  { x: 1224, w: 50, row: 0, role: "host", t: ["Fare-", "well"] },
];

const BACK: { x: number; w: number; t: string[] }[] = [
  { x: 70, w: 120, t: ["Guest list synced", "with serving robots"] },
  { x: 200, w: 120, t: ["Guest name", "shown on screen"] },
  { x: 420, w: 110, t: ["Prepare guest", "drinks and tea"] },
  { x: 540, w: 120, t: ["Robot C serves", "the drinks"] },
];

const ROW_Y = [124, 190, 256];
const BH = 44;
const SHIFT = 112; // room on the left for the robot pictures

function Lines({ x, y, w, t, size = 10.5, bold = false }: { x: number; y: number; w: number; t: string[]; size?: number; bold?: boolean }) {
  const lh = size + 2.5;
  const top = y - ((t.length - 1) * lh) / 2;
  return (
    <>
      {t.map((l, i) => (
        <text key={i} x={x + w / 2} y={top + i * lh + size * 0.36} textAnchor="middle" fontSize={size} fontWeight={bold ? 600 : 400} fill={INK}>
          {l}
        </text>
      ))}
    </>
  );
}

export default function Blueprint() {
  return (
    <svg viewBox="0 0 1392 460" role="img" aria-label="Service blueprint of a robot-run reception: six stages, three robot roles, and the back-end work behind them" className="h-auto w-full" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <g transform={`translate(${SHIFT} 0)`}>
      {/* stage headers */}
      {STAGES.map((s) => (
        <g key={s.n}>
          <circle cx={s.x + s.w / 2} cy={14} r={11} fill={INK} />
          <text x={s.x + s.w / 2} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f3eee2">
            {s.n}
          </text>
          <Lines x={s.x} y={44} w={s.w} t={s.t} size={11.5} bold />
          <line x1={s.x + 4} x2={s.x + s.w - 4} y1={70} y2={70} stroke={INK} strokeOpacity={0.35} />
        </g>
      ))}

      {/* phases */}
      <g fontSize={10} fill={MUTED} letterSpacing="1.4">
        <text x={66 + 400} y={90} textAnchor="middle">BEFORE THE MEETING</text>
        <text x={966 + 157} y={90} textAnchor="middle">AFTER THE MEETING</text>
        <line x1={70} x2={862} y1={96} y2={96} stroke={MUTED} strokeOpacity={0.5} />
        <line x1={970} x2={1276} y1={96} y2={96} stroke={MUTED} strokeOpacity={0.5} />
      </g>

      {/* lanes */}
      <rect x={66} y={106} width={1214} height={216} rx={10} fill="#e9e3d2" opacity={0.55} />
      <rect x={66} y={330} width={1214} height={86} rx={10} fill="#e9e3d2" opacity={0.3} />

      {/* stage 1 standby + stage 5 meeting */}
      <rect x={72} y={ROW_Y[0]} width={118} height={BH} rx={7} fill="#ddd6c4" stroke={INK} strokeOpacity={0.45} />
      <Lines x={72} y={ROW_Y[0] + BH / 2} w={118} t={["Overall position", "and standby"]} />
      <rect x={872} y={ROW_Y[0]} width={88} height={ROW_Y[2] + BH - ROW_Y[0]} rx={9} fill="#ddd6c4" stroke={INK} strokeOpacity={0.45} />
      <Lines x={872} y={(ROW_Y[0] + ROW_Y[2] + BH) / 2} w={88} t={["Meeting"]} size={12} bold />

      {/* front-end boxes */}
      {FRONT.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={ROW_Y[b.row]} width={b.w} height={BH} rx={7} fill={ROLE[b.role].fill} stroke={ROLE[b.role].stroke} />
          <Lines x={b.x} y={ROW_Y[b.row] + BH / 2} w={b.w} t={b.t} size={b.w < 50 ? 9.5 : 10.5} />
        </g>
      ))}

      {/* back-end boxes */}
      {BACK.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={342} width={b.w} height={50} rx={8} fill="#fbf8ef" stroke={INK} strokeOpacity={0.4} />
          <Lines x={b.x} y={367} w={b.w} t={b.t} size={10.5} />
        </g>
      ))}

      {/* legend */}
      <g fontSize={10.5} fill={INK}>
        {(Object.keys(ROLE) as Role[]).map((r, i) => (
          <g key={r} transform={`translate(${690 + i * 196} 436)`}>
            <rect width={14} height={10} rx={3} fill={ROLE[r].fill} stroke={ROLE[r].stroke} />
            <text x={20} y={9}>{ROLE[r].name}</text>
          </g>
        ))}
      </g>
      </g>

      {/* lane labels and the robots that play each role */}
      <text transform="translate(16 214) rotate(-90)" textAnchor="middle" fontSize={11} fontWeight={600} letterSpacing="1.6" fill={INK}>FRONT-END</text>
      <text transform="translate(16 373) rotate(-90)" textAnchor="middle" fontSize={11} fontWeight={600} letterSpacing="1.6" fill={INK}>BACK-END</text>
      {(Object.keys(ROLE) as Role[]).map((r, i) => {
        const cy = ROW_Y[i] + BH / 2;
        return (
          <g key={r}>
            <rect x={26} y={ROW_Y[i] - 8} width={SHIFT + 38} height={BH + 16} rx={9} fill={ROLE[r].fill} opacity={0.55} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <image href={ROBOT_IMG[r]} x={30} y={cy - 29} width={42} height={58} preserveAspectRatio="xMidYMid meet" />
            <text x={80} y={cy - 3} fontSize={11.5} fontWeight={600} fill={INK}>{ROLE[r].name.split(" · ")[0]}</text>
            <text x={80} y={cy + 12} fontSize={10.5} fill={MUTED}>{ROLE[r].short}</text>
          </g>
        );
      })}
    </svg>
  );
}
