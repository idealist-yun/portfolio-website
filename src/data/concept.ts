import { projects } from "./projects";

export type Universe = {
  id: string;
  name: string;
  color: string;
  blurb: string;
  slugs: string[];
};

// Design thinking sits at the centre; each domain it has been applied to is a "universe".
export const universes: Universe[] = [
  {
    id: "disability",
    name: "Disability & Healthcare",
    color: "#4c7df0",
    blurb:
      "Personas, service journeys and assistive design for people with developmental disabilities, the question behind everything else.",
    slugs: ["disability-persona-augmentation", "disability-as-market", "saihst-hospital-metaverse"],
  },
  {
    id: "simulation",
    name: "Simulation & AI",
    color: "#14b8a6",
    blurb:
      "AI personas and virtual worlds that let a service be tested before it reaches the real one.",
    slugs: ["idd-agent-simulation", "wargame-simulation-project", "manufacturing-worker-training-ai"],
  },
  {
    id: "robotics",
    name: "Robotics & HRI",
    color: "#ff6b4a",
    blurb: "Service design for robots that work among people, from a royal-court-inspired concierge to what comes next.",
    slugs: ["vip-concierge-robot"],
  },
  {
    id: "military",
    name: "Military",
    color: "#4caf6a",
    blurb: "Design and data for the most conservative system I know, from terrain training to soldier life cycles.",
    slugs: ["military-3d-battlefield-mapping", "military-hr-big-data", "veterans-reintegration"],
  },
  {
    id: "consumer",
    name: "Retail & Consumer",
    color: "#f5b301",
    blurb: "Customer data turned into service strategy for malls, appliances and apartment life.",
    slugs: [
      "starfield-existing-branch",
      "samsung-brand-fandom",
      "samsung-lifelog-minifridge",
      "samsung-raemian-metaverse",
    ],
  },
  {
    id: "public",
    name: "Public Sector",
    color: "#2fb5d9",
    blurb: "Communication and service strategy for government, grounded in how citizens actually behave.",
    slugs: ["mcst-public-communication"],
  },
];

export type Featured = {
  slug: string;
  kind: "project" | "research";
  universe: string;
  title: string;
  line: string;
  image: string;
};

// A curated handful instead of the full archive.
export const featured: Featured[] = [
  {
    slug: "disability-persona-augmentation",
    kind: "research",
    universe: "disability",
    title: "Disability Persona Augmentation",
    line: "Nine caregiver interviews augmented into 2,400 profiles, five personas, and eleven simulated daily-living scenarios.",
    image: "/images/cards/disability-persona-augmentation.jpg",
  },
  {
    slug: "idd-agent-simulation",
    kind: "research",
    universe: "simulation",
    title: "IDD Agent Simulation Testbed",
    line: "AI agents grounded in clinical assessment data, living through daily scenarios in a virtual world.",
    image: "/images/cards/idd-agent-simulation.jpg",
  },
  {
    slug: "vip-concierge-robot",
    kind: "project",
    universe: "robotics",
    title: "VIP Concierge Robot",
    line: "Three serving robots for the SKKU President's Office, choreographed after a Joseon royal-court ceremony.",
    image: "/images/cards/vip-concierge-robot.jpg",
  },
  {
    slug: "military-3d-battlefield-mapping",
    kind: "project",
    universe: "military",
    title: "3D Battlefield Mapping",
    line: "Terrain digitised so soldiers could train on a border-defense operation before walking it.",
    image: "/images/cards/military-3d-battlefield-mapping.jpg",
  },
  {
    slug: "starfield-existing-branch",
    kind: "project",
    universe: "consumer",
    title: "Starfield Mega-Mall Branches",
    line: "Data-driven service design for Shinsegae Starfield's existing mega-shopping mall branches.",
    image: "/images/cards/starfield-existing-branch.jpg",
  },
  {
    slug: "samsung-raemian-metaverse",
    kind: "project",
    universe: "consumer",
    title: "Metaverse for Raemian Residents",
    line: "Hyper-local housing data turned into metaverse services, prototyped as scenario videos for a Samsung C&T complex.",
    image: "/images/cards/samsung-raemian-metaverse.jpg",
  },
];

export const hrefFor = (f: Featured) =>
  f.kind === "research" ? `/research/${f.slug}` : `/project/${f.slug}`;

export const universeOf = (id: string) => universes.find((u) => u.id === id)!;

export const archiveCount = projects.length;

export const journey = [
  { year: "2017", title: "Business × Data Science", place: "Sungkyunkwan University", note: "Two degrees at once: how organisations work, and how data speaks.", universe: "consumer" },
  { year: "2020", title: "Founded GRU", place: "Service-design club", note: "Where design thinking started: consulting projects for startups, run by students.", universe: "public" },
  { year: "2022", title: "Army officer", place: "ROKA, Injae", note: "Led 60+ people as the youngest Headquarters Company Commander; built a 3D terrain trainer.", universe: "military" },
  { year: "2022", title: "Master of Service Design", place: "Sungkyunkwan University", note: "Thesis: personas of people with developmental disabilities, augmented by data and run through AI simulation.", universe: "disability" },
  { year: "2024", title: "SDI Lab researcher", place: "Data-driven service design", note: "Robots, metaverse and mall branches: quantified personas for real clients.", universe: "robotics" },
  { year: "2025", title: "Samsung Electronics", place: "Market Intelligence", note: "Demand forecasting, an enterprise dashboard, and a Bixby cooking assistant.", universe: "simulation" },
  { year: "2026", title: "UPenn M:IPD", place: "Philadelphia", note: "Engineering, design and Wharton: AI-driven strategic design, and then a company.", universe: "simulation" },
];

export const whyQuote =
  "How can we meaningfully improve the lives of people with disabilities?";
