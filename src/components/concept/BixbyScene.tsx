// A scene for the Bixby cooking assistant: the cook faces the stove with their back to the fridge,
// and the fridge speaks the next step, so hands never leave the pan.
const INK = "#1d1b18";
const MUTED = "#6b655a";
const RED = "#c8431f";
const INDIGO = "#24386b";
const PAPER = "#fbf8ef";

export default function BixbyScene() {
  return (
    <svg viewBox="0 0 1500 803" role="img" aria-label="A cook stands at the stove with their back to the fridge while the fridge reads out the next recipe step" className="h-auto w-full" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <rect width="1500" height="803" fill={PAPER} />
      {/* title */}
      <text x="48" y="64" fontSize="30" fontWeight="600" fill={INK}>Hands on the pan, eyes on the food</text>
      <text x="48" y="96" fontSize="18" fill={MUTED}>The cook faces the stove with their back to the fridge, so the fridge does the reading.</text>

      {/* floor and wall line */}
      <rect x="0" y="700" width="1500" height="103" fill="#e9e3d2" />
      <line x1="0" x2="1500" y1="700" y2="700" stroke={INK} strokeOpacity="0.25" />

      {/* fridge */}
      <g>
        <rect x="90" y="150" width="330" height="552" rx="22" fill="#dfe4ea" stroke={INK} strokeWidth="3" />
        <line x1="90" x2="420" y1="430" y2="430" stroke={INK} strokeWidth="3" />
        <rect x="392" y="205" width="10" height="84" rx="5" fill={INK} opacity="0.55" />
        <rect x="392" y="470" width="10" height="130" rx="5" fill={INK} opacity="0.55" />
        {/* screen on the door */}
        <rect x="124" y="190" width="244" height="190" rx="12" fill="#18212c" />
        <text x="146" y="226" fontSize="16" fill="#9fb6d4">Tomato pasta</text>
        <text x="146" y="262" fontSize="26" fontWeight="600" fill="#ffffff">Step 3 of 6</text>
        <text x="146" y="296" fontSize="19" fill="#f3eee2">Add the onions.</text>
        <text x="146" y="320" fontSize="19" fill="#f3eee2">Stir for two minutes.</text>
        <rect x="146" y="344" width="200" height="8" rx="4" fill="#2f3d4f" />
        <rect x="146" y="344" width="100" height="8" rx="4" fill={RED} />
        {/* the voice */}
        <circle cx="146" cy="168" r="13" fill={PAPER} stroke={INDIGO} strokeWidth="3" />
        <circle cx="146" cy="168" r="5" fill={INDIGO} />
        <text x="170" y="174" fontSize="16" fontWeight="600" fill={INDIGO}>Bixby is speaking</text>
      </g>

      {/* sound waves, from the fridge toward the cook's back */}
      <g fill="none" stroke={INDIGO} strokeWidth="5" strokeLinecap="round">
        <path d="M452 340 q26 -34 0 -68" opacity="0.9" />
        <path d="M486 356 q40 -52 0 -100" opacity="0.65" />
        <path d="M520 372 q54 -70 0 -132" opacity="0.4" />
      </g>

      {/* speech bubble */}
      <g>
        <rect x="560" y="140" width="400" height="142" rx="24" fill="#ffffff" stroke={INDIGO} strokeWidth="3" />
        <path d="M560 232 l-34 20 l36 4 z" fill="#ffffff" stroke={INDIGO} strokeWidth="3" strokeLinejoin="round" />
        <rect x="562" y="228" width="6" height="22" fill="#ffffff" />
        <text x="590" y="190" fontSize="26" fontWeight="600" fill={INK}>&#8220;Next, add the onions</text>
        <text x="590" y="228" fontSize="26" fontWeight="600" fill={INK}>and stir for two minutes.&#8221;</text>
        <text x="590" y="262" fontSize="16" fill={MUTED}>Spoken, so no screen to tap</text>
      </g>

      {/* counter and stove */}
      <rect x="1000" y="540" width="440" height="162" fill="#cfc7b2" stroke={INK} strokeWidth="3" />
      <rect x="990" y="520" width="460" height="26" rx="6" fill="#ece6d4" stroke={INK} strokeWidth="3" />
      <line x1="1000" x2="1440" y1="620" y2="620" stroke={INK} strokeOpacity="0.3" />
      <rect x="1030" y="574" width="14" height="14" rx="7" fill={INK} opacity="0.5" />
      <rect x="1060" y="574" width="14" height="14" rx="7" fill={INK} opacity="0.5" />
      {/* pan */}
      <path d="M1110 520 h200 l-12 -50 h-176 z" fill="#3a3f48" stroke={INK} strokeWidth="3" />
      <line x1="1310" x2="1390" y1="492" y2="478" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="1210" cy="472" rx="82" ry="10" fill="#c8431f" opacity="0.8" />
      <g fill="none" stroke={MUTED} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <path d="M1170 440 q-14 -26 0 -50 q14 -24 0 -48" />
        <path d="M1220 438 q-14 -26 0 -50 q14 -24 0 -48" />
        <path d="M1270 440 q-14 -26 0 -50 q14 -24 0 -48" />
      </g>

      {/* the cook, seen from the side, back to the fridge, hair covering the head */}
      <g>
        {/* legs */}
        <rect x="868" y="560" width="34" height="140" rx="12" fill="#3b4256" />
        <rect x="910" y="560" width="34" height="140" rx="12" fill="#2f3547" />
        <rect x="858" y="684" width="56" height="18" rx="8" fill={INK} />
        <rect x="904" y="684" width="56" height="18" rx="8" fill={INK} />
        {/* torso with apron */}
        <rect x="852" y="352" width="108" height="214" rx="38" fill={RED} />
        <rect x="900" y="402" width="64" height="164" rx="14" fill="#f3eee2" stroke={INK} strokeOpacity="0.25" />
        {/* head: back of the head, no face */}
        <circle cx="892" cy="306" r="44" fill="#f1d3b8" />
        <path d="M848 306 a44 44 0 0 1 88 0 q-4 30 -44 36 q-40 -6 -44 -36z" fill="#2b2230" />
        {/* arm reaching to the pan with a spoon */}
        <path d="M930 408 q60 8 110 4 q40 -4 112 40" fill="none" stroke={RED} strokeWidth="30" strokeLinecap="round" />
        <circle cx="1156" cy="454" r="14" fill="#f1d3b8" />
        <line x1="1160" x2="1226" y1="456" y2="470" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* the point */}
      <g>
        <path d="M520 430 q160 70 330 60" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
        <path d="M850 490 l-18 -18 m18 18 l-24 6" stroke={RED} strokeWidth="4" strokeLinecap="round" fill="none" />
        <text x="548" y="520" fontSize="18" fontWeight="600" fill={RED}>The cook never turns around</text>
      </g>

      {/* steps */}
      <g fontSize="15">
        {["Prep", "Sauté", "Simmer", "Plate"].map((s, i) => (
          <g key={s} transform={`translate(${520 + i * 146} 744)`}>
            <rect width="132" height="30" rx="15" fill={i === 1 ? INDIGO : "#f3eee2"} stroke={INDIGO} strokeOpacity={i === 1 ? 1 : 0.4} />
            <text x="66" y="20" textAnchor="middle" fill={i === 1 ? "#f3eee2" : INK}>{i + 1} · {s}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
