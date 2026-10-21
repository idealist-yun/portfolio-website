const INK = "#1d1b18";
const MUTED = "#6b655a";
const RED = "#c8431f";
const INDIGO = "#24386b";
const PAPER = "#fbf8ef";
const RULE = "#d8d1c2";

export default function BixbyStrategyBoard() {
  return (
    <svg viewBox="0 0 1500 803" role="img" aria-label="Strategy proposal positioning the Family Hub refrigerator as a voice-first cooking orchestration hub" className="h-auto w-full" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <rect width="1500" height="803" fill={PAPER} />
      <text x="44" y="47" fontSize="13" letterSpacing="2.5" fill={RED}>STRATEGY PROPOSAL · SAMSUNG FAMILY HUB</text>
      <text x="1456" y="47" textAnchor="end" fontSize="13" letterSpacing="2.1" fill={MUTED}>SCREEN-BASED AI APPLIANCES · 2025</text>
      <line x1="44" x2="1456" y1="74" y2="74" stroke={RULE} strokeWidth="2" />

      <text x="44" y="140" fontSize="46" fontWeight="650" fill={INK}>Make the fridge the</text>
      <text x="44" y="196" fontSize="46" fontWeight="650" fill={INDIGO}>conductor of the kitchen.</text>
      <text x="44" y="239" fontSize="18" fill={MUTED}>Reframe the screen from a destination to an orchestration hub—</text>
      <text x="44" y="268" fontSize="18" fill={MUTED}>with Bixby carrying the recipe when eyes and hands are busy.</text>

      <g transform="translate(44 315)">
        <rect width="320" height="420" rx="18" fill="#ffffff" stroke={RULE} strokeWidth="2" />
        <text x="24" y="40" fontSize="13" letterSpacing="2.2" fill={MUTED}>THE SHIFT</text>
        <text x="24" y="94" fontSize="23" fontWeight="650" fill={INK}>A screen to visit</text>
        <line x1="24" x2="268" y1="106" y2="106" stroke={RED} strokeWidth="3" />
        <text x="24" y="142" fontSize="16" fill={MUTED}>Recipe content competes</text>
        <text x="24" y="168" fontSize="16" fill={MUTED}>for visual attention.</text>
        <path d="M160 202 v48" stroke={RED} strokeWidth="3" />
        <path d="M151 240 l9 11 l9 -11" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="274" width="280" height="118" rx="12" fill={INDIGO} />
        <text x="40" y="312" fontSize="13" letterSpacing="1.8" fill="#cbd3e8">TO</text>
        <text x="40" y="350" fontSize="23" fontWeight="650" fill="#ffffff">A service that follows</text>
        <text x="40" y="378" fontSize="16" fill="#dce1ee">Voice keeps the next step</text>
        <text x="40" y="401" fontSize="16" fill="#dce1ee">inside the cooking flow.</text>
      </g>

      <g transform="translate(388 315)">
        <rect width="690" height="420" rx="18" fill="#ffffff" stroke={RULE} strokeWidth="2" />
        <text x="24" y="40" fontSize="13" letterSpacing="2.2" fill={MUTED}>PROPOSED EXPERIENCE</text>

        <g transform="translate(28 66)">
          <rect width="190" height="308" rx="18" fill="#e4e7eb" stroke={INK} strokeWidth="2.5" />
          <line x1="0" x2="190" y1="222" y2="222" stroke={INK} strokeWidth="2" />
          <rect x="22" y="25" width="146" height="164" rx="11" fill="#121c2a" />
          <text x="40" y="53" fontSize="11" letterSpacing="1.5" fill="#9fb6d4">DINNER PLAN</text>
          <text x="40" y="82" fontSize="19" fontWeight="650" fill="#ffffff">Tomato pasta</text>
          <text x="40" y="111" fontSize="13" fill="#d9e0ea">3 of 6 · Sauté</text>
          <line x1="40" x2="150" y1="132" y2="132" stroke="#405067" strokeWidth="6" strokeLinecap="round" />
          <line x1="40" x2="96" y1="132" y2="132" stroke={RED} strokeWidth="6" strokeLinecap="round" />
          <rect x="40" y="151" width="110" height="25" rx="12" fill="#253552" />
          <text x="95" y="168" textAnchor="middle" fontSize="11" fill="#ffffff">BIXBY LISTENING</text>
          <text x="95" y="274" textAnchor="middle" fontSize="11" letterSpacing="1.5" fill={MUTED}>FAMILY HUB</text>
        </g>

        <g fill="none" stroke={INDIGO} strokeWidth="4" strokeLinecap="round">
          <path d="M240 180 q22 -31 0 -62" />
          <path d="M266 194 q36 -46 0 -90" opacity=".65" />
          <path d="M294 208 q52 -64 0 -118" opacity=".35" />
        </g>

        <g transform="translate(332 76)">
          <rect width="324" height="82" rx="15" fill={INDIGO} />
          <path d="M0 51 l-20 13 l21 2" fill={INDIGO} />
          <text x="22" y="34" fontSize="18" fontWeight="650" fill="#ffffff">“Next, add the onions.”</text>
          <text x="22" y="60" fontSize="14" fill="#dce1ee">Hands-free guidance, step by step</text>

          <g transform="translate(0 112)">
            <circle cx="45" cy="42" r="34" fill="#f3eee2" stroke={RULE} strokeWidth="2" />
            <path d="M28 43 h34 M45 26 v34" stroke={RED} strokeWidth="4" strokeLinecap="round" />
            <text x="94" y="33" fontSize="13" letterSpacing="1.8" fill={MUTED}>ONE RECIPE</text>
            <text x="94" y="60" fontSize="20" fontWeight="650" fill={INK}>Registered once</text>
          </g>
          <g transform="translate(0 210)">
            <circle cx="45" cy="42" r="34" fill="#f3eee2" stroke={RULE} strokeWidth="2" />
            <path d="M29 50 q16 -29 32 0 M29 34 q16 17 32 0" fill="none" stroke={INDIGO} strokeWidth="4" strokeLinecap="round" />
            <text x="94" y="33" fontSize="13" letterSpacing="1.8" fill={MUTED}>ONE VOICE LAYER</text>
            <text x="94" y="60" fontSize="20" fontWeight="650" fill={INK}>Guidance everywhere</text>
          </g>
        </g>
      </g>

      <g transform="translate(1102 315)">
        <rect width="354" height="420" rx="18" fill="#f3eee2" stroke={RULE} strokeWidth="2" />
        <text x="24" y="40" fontSize="13" letterSpacing="2.2" fill={MUTED}>WHY THIS WINS</text>
        <g transform="translate(24 76)">
          <text x="0" y="0" fontSize="34" fontWeight="650" fill={RED}>01</text>
          <text x="64" y="-2" fontSize="19" fontWeight="650" fill={INK}>Eyes stay on food</text>
          <text x="64" y="25" fontSize="15" fill={MUTED}>No turning back to read.</text>
        </g>
        <line x1="24" x2="330" y1="136" y2="136" stroke={RULE} strokeWidth="2" />
        <g transform="translate(24 180)">
          <text x="0" y="0" fontSize="34" fontWeight="650" fill={RED}>02</text>
          <text x="64" y="-2" fontSize="19" fontWeight="650" fill={INK}>Hands stay in task</text>
          <text x="64" y="25" fontSize="15" fill={MUTED}>No tapping with wet hands.</text>
        </g>
        <line x1="24" x2="330" y1="240" y2="240" stroke={RULE} strokeWidth="2" />
        <g transform="translate(24 284)">
          <text x="0" y="0" fontSize="34" fontWeight="650" fill={RED}>03</text>
          <text x="64" y="-2" fontSize="19" fontWeight="650" fill={INK}>Screen gains a role</text>
          <text x="64" y="25" fontSize="15" fill={MUTED}>The hub coordinates the meal.</text>
        </g>
        <rect x="24" y="352" width="306" height="44" rx="22" fill={RED} />
        <text x="177" y="380" textAnchor="middle" fontSize="13" fontWeight="650" letterSpacing="1.5" fill="#ffffff">VOICE-FIRST COOKING ASSISTANT</text>
      </g>
    </svg>
  );
}
