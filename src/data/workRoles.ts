export type RoleKey = "designer" | "pm" | "uxr" | "strategist";

export type Role = {
  key: RoleKey;
  chip: string;
  // Featured: first is the hero, the next two sit beside it. Rest is the compact list.
  featured: [string, string, string];
  rest: string[];
};

// A slug here is either a project slug or a "research:" slug for a Research page.
export const roles: Role[] = [
  {
    key: "designer",
    chip: "Service / Experience Designer",
    featured: ["vip-concierge-robot", "saihst-hospital-metaverse", "samsung-lifelog-minifridge"],
    rest: [
      "starfield-existing-branch",
      "starfield-new-branch-1",
      "starfield-new-branch-2",
      "undergraduate-works",
      "samsung-bixby-cooking-assistant",
      "military-3d-battlefield-mapping",
    ],
  },
  {
    key: "pm",
    chip: "PM",
    featured: ["vip-concierge-robot", "disability-as-market", "military-3d-battlefield-mapping"],
    rest: [
      "manufacturing-worker-training-ai",
      "samsung-ax-dashboard",
      "samsung-bixby-cooking-assistant",
      "mcst-public-communication",
      "veterans-reintegration",
      "samsung-raemian-metaverse",
      "saihst-hospital-metaverse",
    ],
  },
  {
    key: "uxr",
    chip: "UX Researcher",
    featured: ["disability-as-market", "vip-concierge-robot", "samsung-lifelog-minifridge"],
    rest: [
      "starfield-existing-branch",
      "starfield-new-branch-1",
      "starfield-new-branch-2",
      "military-hr-big-data",
      "research:idd-agent-simulation",
    ],
  },
  {
    key: "strategist",
    chip: "Business Strategist",
    featured: ["samsung-ax-dashboard", "starfield-existing-branch", "samsung-lifelog-minifridge"],
    rest: [
      "samsung-bixby-cooking-assistant",
      "samsung-brand-fandom",
      "starfield-new-branch-1",
      "starfield-new-branch-2",
    ],
  },
];

// Not shown on Work: nothing has been done on it yet (kept on Research as Planned).
export const hiddenProjects = ["wargame-simulation-project"];

// Short tile labels (the full titles are long for a tile).
export const shortLabel: Record<string, string> = {
  "vip-concierge-robot": "VIP Concierge Robot",
  "saihst-hospital-metaverse": "Hospital inpatient app",
  "samsung-lifelog-minifridge": "Mini-Fridge life-log",
  "starfield-existing-branch": "Starfield, existing branch",
  "starfield-new-branch-1": "Starfield, new branch #1",
  "starfield-new-branch-2": "Starfield, new branch #2",
  "undergraduate-works": "Undergraduate works",
  "samsung-bixby-cooking-assistant": "Bixby cooking assistant",
  "military-3d-battlefield-mapping": "3D battlefield mapping",
  "disability-as-market": "Disability service design",
  "manufacturing-worker-training-ai": "Manufacturing digital twin",
  "samsung-ax-dashboard": "Demand dashboard (AX)",
  "mcst-public-communication": "Public communication",
  "veterans-reintegration": "Veterans reintegration",
  "samsung-raemian-metaverse": "Raemian metaverse",
  "military-hr-big-data": "Military HR system",
  "research:idd-agent-simulation": "IDD agent simulation",
  "samsung-brand-fandom": "Samsung brand fandom",
};
