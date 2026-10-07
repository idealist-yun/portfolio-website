import type { Phase } from "./projects";

export type GroupDef = { key: string; title: string; chip: string };

// Mirrors the grouping on the original work-basic / work-data / work-ai pages.
export const phaseGroups: Record<Phase, GroupDef[]> = {
  Basic: [
    { key: "design-thinking", title: "01. Design thinking", chip: "Design Thinking" },
    { key: "military", title: "02. Military service design", chip: "Military" },
    { key: "vulnerable", title: "03. Vulnerable design", chip: "Vulnerable" },
  ],
  "Data-Driven": [
    { key: "branding", title: "01. Branding", chip: "Branding" },
    { key: "service-design", title: "02. Service Design", chip: "Service Design" },
    { key: "biz-dev", title: "03. Biz Development", chip: "Biz Development" },
  ],
  "AI-Driven": [
    { key: "disability", title: "01. Disability Service Design", chip: "Disability" },
    { key: "robotics", title: "02. Robotics Service Design", chip: "Robotics" },
    { key: "industrial", title: "03. Industrial engineering Design", chip: "Industrial" },
    { key: "military", title: "04. Military Service Design", chip: "Military" },
    { key: "additional", title: "05. Additional work", chip: "Additional" },
  ],
};

export const projectGroup: Record<string, string> = {
  "undergraduate-works": "design-thinking",
  "mcst-public-communication": "design-thinking",
  "military-3d-battlefield-mapping": "military",
  "military-hr-big-data": "military",
  "veterans-reintegration": "military",
  "saihst-hospital-metaverse": "vulnerable",
  "disability-as-market": "vulnerable",
  "starfield-existing-branch": "branding",
  "samsung-brand-fandom": "branding",
  "samsung-lifelog-minifridge": "service-design",
  "samsung-raemian-metaverse": "service-design",
  "starfield-new-branch-1": "biz-dev",
  "starfield-new-branch-2": "biz-dev",
  "vip-concierge-robot": "robotics",
  "manufacturing-worker-training-ai": "industrial",
  "wargame-simulation-project": "military",
  "samsung-ax-dashboard": "additional",
  "samsung-bixby-cooking-assistant": "additional",
};

// The graduate thesis lives under Research on this site; the original listed
// it as the first AI-Driven card.
export const thesisCard = {
  href: "/research/disability-persona-augmentation",
  group: "disability",
};

const basicOthers = [
  "military-3d-battlefield-mapping",
  "military-hr-big-data",
  "veterans-reintegration",
  "undergraduate-works",
];
const dataOthers = [
  "starfield-existing-branch",
  "samsung-brand-fandom",
  "starfield-new-branch-1",
  "starfield-new-branch-2",
];

// "Want to check more? Discover my other projects." lists, as on the original
// pages (static lists; Basic pages and Data-Driven pages only).
export function relatedFor(slug: string): string[] {
  if (slug === "disability-as-market") return basicOthers.slice(0, 2);
  const g = projectGroup[slug];
  if (["design-thinking", "military", "vulnerable"].includes(g) && slug !== "wargame-simulation-project")
    return basicOthers;
  if (["branding", "service-design", "biz-dev"].includes(g)) return dataOthers;
  return [];
}
