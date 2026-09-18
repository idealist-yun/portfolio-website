export type ResearchStatus = "Published" | "In Progress" | "Planned";
export type ResearchTopic =
  | "Disability & Accessibility"
  | "Military & HR"
  | "Industrial Engineering"
  | "Healthcare"
  | "Consumer Experience"
  | "Public Communication";

export type ResearchItem = {
  slug: string;
  title: string;
  status: ResearchStatus;
  venue?: string;
  date?: string;
  topics: ResearchTopic[];
  summary: string;
  bullets?: string[];
  link?: string;
};

export const research: ResearchItem[] = [
  {
    slug: "disability-persona-augmentation",
    title:
      "Data-Driven Disability Persona Augmentation for Service Journey Inference: Focusing on Daily Living Support Needs of People with Developmental Disabilities",
    status: "Published",
    venue: "Master's Thesis, Sungkyunkwan University",
    date: "Jun. 2025",
    topics: ["Disability & Accessibility"],
    summary:
      "Augmented a small clinical dataset into 2,400 synthetic profiles and simulated daily-living support needs for people with developmental disabilities — a reusable framework for low-data disability research.",
    bullets: [
      "Augmented Vineland-based adaptive behavior data from 9 individuals with developmental disabilities to a dataset of 2,400 cases, addressing the small-sample constraint that typically blocks data-driven disability research",
      "Derived 5 representative developmental disability persona clusters via multidimensional analysis",
      "Implemented AI-driven personas and ran ADL/IADL scenario simulations to quantify support needs",
    ],
  },
  {
    slug: "military-life-cycle-pattern",
    title:
      "Patterning Military Experience for Quality Improvement of Enlisted Soldiers: A Persona-Based Study on Military Life Cycle Experience Design",
    status: "Published",
    venue: "Korean Academy of Military Social Welfare",
    date: "Dec. 2024",
    topics: ["Military & HR"],
    summary:
      "Interviewed 18 high-performing soldiers to derive a 5-stage military life-cycle model informing predictive HR programming for new recruits.",
    bullets: [
      "Interviewed 18 high-performing soldiers to quantitatively measure their military service experiences",
      "Derived a 5-stage life-cycle pattern model (Adaptation, Growth, Maturity, Stagnation, Decline) to inform predictive HR programming",
    ],
  },
  {
    slug: "idd-agent-simulation",
    title: "IDD AI Agent Simulation Testbed",
    status: "In Progress",
    venue: "Independent research project, UPenn M:IPD",
    date: "2026 –",
    topics: ["Disability & Accessibility"],
    summary:
      "Extending the persona-augmentation thesis from static clustering into a dynamic, agent-based simulation — profile-native AI agents built from clinical assessment structures (Vineland / SIS), tested against ADL/IADL scenarios in a virtual environment, with an experiment dashboard for researchers.",
    bullets: [
      "Building profile-native AI agents grounded in clinical assessment structures, not post-hoc filters on generic agents",
      "Simulating agents across ADL/IADL scenarios in a virtual environment, with support-partner and support-level modeling",
      "Developing a browser-based experiment lab for constructing agents/scenarios and reviewing simulation replay",
    ],
  },
  {
    slug: "developmental-disability-paper-2",
    title: "Developmental Disability Persona Methodology, Part II",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "A follow-on paper refining the augmentation-and-clustering methodology from the master's thesis for closer alignment with real developmental-disability populations.",
  },
  {
    slug: "developmental-disability-paper-3-2d-sim",
    title: "2D Scenario Simulation for Developmental Disability Support Needs",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "A new simulation-based paper modeling daily-living scenarios for people with developmental disabilities in a 2D environment.",
  },
  {
    slug: "physical-disability-3d-sim",
    title: "3D Scenario Simulation for Physical Disability Support Needs",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "Extending the simulation methodology to physical disability contexts using 3D environments.",
  },
  {
    slug: "assistive-device-mapping",
    title: "Assistive Device Mapping",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "Mapping assistive devices to support needs and daily-living contexts identified through the persona-simulation research line.",
  },
  {
    slug: "industrial-training-simulation",
    title: "AI Simulation Training Tool for Factory-Worker Skill Development",
    status: "Planned",
    topics: ["Industrial Engineering"],
    summary:
      "An AI-driven simulation tool for improving skill acquisition among factory workers, applying the persona-simulation approach to an industrial-engineering context.",
  },
  {
    slug: "hospital-inpatient-persona",
    title: "Long-Term Hospital Inpatient Experience Persona Study",
    status: "Planned",
    topics: ["Healthcare"],
    summary:
      "Classifying personas for patients undergoing long-term hospitalization to inform experience-design interventions.",
  },
  {
    slug: "military-hr-simulation",
    title: "Military HR Simulation",
    status: "Planned",
    topics: ["Military & HR"],
    summary:
      "Extending the military life-cycle pattern study into a simulation model for HR decision-making.",
  },
  {
    slug: "wargame-simulation",
    title: "War-Game Simulation",
    status: "Planned",
    topics: ["Military & HR"],
    summary:
      "Applying agent-based simulation methodology to military war-gaming scenarios.",
  },
  {
    slug: "consumer-experience-simulation",
    title: "Consumer Experience Simulation",
    status: "Planned",
    topics: ["Consumer Experience"],
    summary:
      "Applying persona-based agent simulation to model and pre-validate consumer experience scenarios.",
  },
];

export const statusOrder: ResearchStatus[] = [
  "Published",
  "In Progress",
  "Planned",
];

export const allTopics: ResearchTopic[] = [
  "Disability & Accessibility",
  "Military & HR",
  "Industrial Engineering",
  "Healthcare",
  "Consumer Experience",
  "Public Communication",
];
