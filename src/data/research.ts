export type ResearchStatus = "Published" | "In Progress" | "Planned";
export type ResearchTopic =
  | "Disability & Accessibility"
  | "Military & HR"
  | "Industrial Engineering"
  | "Healthcare"
  | "Consumer Experience"
  | "Public Communication";

export type Section = { heading: string; body: string[] };

export type ResearchItem = {
  slug: string;
  title: string;
  status: ResearchStatus;
  venue?: string;
  date?: string;
  topics: ResearchTopic[];
  summary: string;
  images?: string[];
  collaborators?: string;
  sections: Section[];
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
    images: ["/images/cards/disability-persona-augmentation.jpg", "/images/research/disability-persona-augmentation.jpg"],
    summary:
      "Augmented 9 real caregiver interviews into 2,400 synthetic profiles and simulated daily-living support needs for people with developmental disabilities across 11 ADL/IADL scenarios — a reusable framework for a domain where data is always scarce.",
    sections: [
      {
        heading: "Where it started",
        body: [
          "Stanford's Generative Agents work suggested that if an AI agent could stand in for a person with a developmental disability, I could run experiments I could never ethically or practically run on real participants. That idea, combined with fieldwork at the National Rehabilitation Center that convinced me disability research needed exactly this kind of scalable, data-driven approach, became my graduate thesis.",
        ],
      },
      {
        heading: "Method (9 steps)",
        body: [
          "Interview people with developmental disabilities and their caregivers; rule-based amplification of their Vineland Adaptive Behavior Scale responses (combined with K-Vineland-II clinical norm statistics) from 9 individuals to 2,400 synthetic profiles; re-cluster by Vineland-domain characteristics; define 5 personas from the resulting clusters; lay out the adaptive-behavior level each step of 11 ADL/IADL daily-living scenarios requires; apply each persona to every scenario; identify where a persona's capability falls short; have an LLM explain why that gap matters; and auto-generate a disability-specific Customer Journey Map from the result.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The output was what I call an 'Augmented Double Diamond' — the standard design-thinking framework extended with a persona-augmentation step, letting service-design research proceed in domains where recruiting enough real participants is genuinely difficult. I'm now extending this into a full AI-agent simulation (see below), inspired by Altera's work on agents in 3D virtual environments like Minecraft and Unity.",
        ],
      },
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
    images: ["/images/cards/military-life-cycle-pattern.jpg"],
    summary:
      "Interviewed 18 high-performing soldiers to derive a 5-stage military life-cycle model — grounded in my own experience commanding 60+ personnel and managing HR as a company commander.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Existing soldier-support programs (counselors, 'green camp' rehabilitation) focus entirely on soldiers who are struggling to adapt. Almost nothing focuses on making already-strong soldiers stronger — even though most conscripts see their service as time lost rather than a growth opportunity, and junior officers rarely have the experience to address individual needs the way veteran officers can from instinct.",
        ],
      },
      {
        heading: "Research model",
        body: [
          "I combined life-cycle theory with persona theory: a soldier's 'marketing persona' at enlistment evolves toward a 'designated persona' by discharge, and how closely those converge — shaped by both internal military and external personal factors — represents real service progress.",
        ],
      },
      {
        heading: "Method & result",
        body: [
          "I interviewed 18 soldiers who had adapted successfully to military life and analyzed their traits, goals, and the internal/external factors behind their progress. The result: a 5-stage pattern — Adaptation, Growth, Maturity, Stagnation, Decline — with the highest overall achievement associated with soldiers who moved through all five. This is now feeding a planned predictive HR model for newly enlisted soldiers (see below).",
        ],
      },
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
      "Building the 'brain' behind the persona-augmentation thesis — profile-native AI agents grounded in clinical assessment data, simulated across daily-living scenarios in a virtual environment, on a 2-year roadmap toward becoming a general simulation methodology.",
    sections: [
      {
        heading: "Why this, and why now",
        body: [
          "My thesis defined disability personas from data but never made them think. This project builds the actual cognitive layer — an AI agent, in the Generative Agents sense, whose behavior is grounded in clinical assessment structures rather than a prompt describing a disability. It's the direct prerequisite for the Physical Disability project below, since a 'body' needs a 'brain' to wear.",
          "The bigger bet: simulation is becoming a new substrate for product and service design research (in the spirit of NVIDIA Omniverse), and I'm building toward a domain-general tool — a scenario plus a data-driven persona, run to get domain-specific results. Disability is where I'm starting; the military HR and consumer-experience research below share the same underlying architecture.",
        ],
      },
      {
        heading: "Research design",
        body: [
          "Three aims: (1) a clinically grounded cognitive-behavioral layer that internalizes VABS/SIS-A as quantitative parameters rather than text prompts; (2) a dynamic feedback loop between personality, emotion, and disability traits, so the agent's functional profile updates with repeated stimulus instead of staying fixed after one simulation pass; (3) an explainable behavior visualization layer that surfaces the agent's internal reasoning in plain language for researchers and caregivers.",
          "Architecturally, this combines a skill-library agent (Voyager-style) with Evolving Agents' dual behavior/personality system and Humanoid Agents' System-1/System-2 cognitive split, adapted to IDD-specific traits — initialized from the Vineland Adaptive Behavior Scale's 502 items across 13 subdomains and 5 domains, plus SIS-A-based dependency weighting to simulate high-dependency caregiver relationships.",
        ],
      },
      {
        heading: "Where it stands",
        body: [
          "Vineland-to-ADL/IADL mapping and SIS-A support-level/domain-aware partner matching are implemented; an architecture-validity harness (monotonicity, distinguishability, stability) passes; there's a browser-based experiment lab for building agents and scenarios and running them, plus a replay dashboard on a real virtual-town map. Over 100 automated tests currently pass. The goal is a submittable paper — target venue not yet decided.",
        ],
      },
    ],
  },
  {
    slug: "manufacturing-worker-training-paper",
    title: "AI-Simulation Training for Novice-to-Skilled Factory Workers",
    status: "In Progress",
    venue: "Co-authored, industrial engineering (target: SCI, may land KCI)",
    date: "2025 – 2026",
    topics: ["Industrial Engineering"],
    summary:
      "A defect-tracing AI tool for wire-harness assembly is complete; the harder second paper — what actually speeds up novice-to-skilled coaching — is being written now.",
    sections: [
      {
        heading: "Setup",
        body: [
          "Field research at a real automotive wire-harness factory in Weihai, China, run by a labmate whose graduating paper this is. I set the overall research direction and supervise; my labmate owns the implementation and the writing, and we're listed as co-authors.",
        ],
      },
      {
        heading: "Progress",
        body: [
          "The first deliverable — a working system that traces a defective finished harness back to the specific assembly stage and cause — is complete, built on a full dataset from a controlled comparison of unassisted vs. coached novice workers. The current paper asks which coaching interventions actually accelerate the novice-to-skilled transition, based on the trial-and-error patterns that showed up in that data. Target completion: second half of 2026.",
        ],
      },
    ],
  },
  {
    slug: "developmental-disability-paper-1-ijhci",
    title:
      "Raw Vineland-to-Scenario Mapping for Developmental Disability Support Identification",
    status: "Planned",
    venue: "Target journal: IJHCI (Q2+ SCI required)",
    topics: ["Disability & Accessibility"],
    summary:
      "Splitting my thesis into a standalone paper: mapping real (non-amplified) Vineland interview data directly onto ADL/IADL scenarios to auto-identify support gaps.",
    sections: [
      {
        heading: "Scope",
        body: [
          "This isolates steps 1 and 5–9 of my thesis methodology — interviews and raw Vineland responses mapped directly onto scenario-by-scenario adaptive-behavior requirements, skipping the amplification/clustering step covered separately in the RIDD-track paper below.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Not yet started, but the methodology already exists from the thesis, so this is a repackaging-and-rigor pass rather than new methodology. There's real deadline pressure: I need results before Fulbright applications open in April and before spring-semester lab outreach.",
        ],
      },
    ],
  },
  {
    slug: "developmental-disability-paper-2-ridd",
    title:
      "Validating Amplification-and-Clustering for Developmental Disability Personas",
    status: "Planned",
    venue: "Target journal: RIDD (Q2+ SCI required)",
    topics: ["Disability & Accessibility"],
    summary:
      "The other half of my thesis, split out: does the amplify-then-cluster method actually produce personas that match real developmental-disability populations?",
    sections: [
      {
        heading: "Scope",
        body: [
          "Covers steps 2–4 of the thesis: rule-based amplification of a small clinical sample, re-clustering by Vineland domain characteristics, and validating that the resulting personas hold up against real developmental-disability population data — the piece of the thesis this paper is entirely built to stress-test.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Not yet started; methodology already exists from the thesis. Same deadline pressure as the IJHCI-track paper above — results needed before Fulbright applications and lab outreach in spring.",
        ],
      },
    ],
  },
  {
    slug: "physical-disability-3d-sim",
    title: "Physical Disability AI Agent Simulation (3D)",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "The 'body' to the IDD project's 'brain' — simulating physical-disability movement and environment interaction in 3D, once the 2D architecture stabilizes.",
    sections: [
      {
        heading: "Why it's different from the IDD project",
        body: [
          "Unlike developmental disability, physical disability doesn't require rebuilding how an agent thinks — a RAG-based persona layer over a standard cognitive agent is probably enough. What it does require is real physical-environment interaction, which only a 3D simulation can capture.",
        ],
      },
      {
        heading: "Planned pipeline",
        body: [
          "Estimate a person's actual physical range of motion using an existing platform (e.g., OpenCap), translate that computationally, apply the same range-of-motion limits to an Omniverse avatar, layer a persona that 'thinks' it has a specific physical disability on top of an otherwise standard cognitive structure, and run the resulting agent through varied simulated environments. Candidate stack (unconfirmed): OpenCap → OpenSim → NVIDIA PhysX / Isaac Sim / Replicator / USD Composer / Omni.AnimPeople.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Outline stage, with real feasibility unverified. Start condition: once the IDD project's 2D architecture stabilizes — can run in parallel with the two disability papers above.",
        ],
      },
    ],
  },
  {
    slug: "assistive-device-mapping",
    title: "Assistive Technology Matching Simulation",
    status: "Planned",
    topics: ["Disability & Accessibility"],
    summary:
      "A virtual fitting platform for assistive devices, layered onto the Physical Disability simulation — addressing a market that's fragmented, expensive, and rarely accessible to try before buying.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Assistive devices are expensive, hard to try on before buying, and the right device for a given person is sometimes only sold in another country. Plenty of research describes this market fragmentation; very little proposes an actual fix.",
        ],
      },
      {
        heading: "Planned pipeline",
        body: [
          "Short term: a virtual assistive-device fitting and testing platform, built on the Physical Disability project's avatars and simulated environments. Medium term: implement every commercially available device type in simulation, so the physical-disability research generalizes across service-design contexts. Long term: a shared platform where any assistive device, anywhere, can be virtually fitted — and ultimately sold through the same platform.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Idea stage. Planned as a paper once the Physical Disability project is far enough along; target venue and timing undecided.",
        ],
      },
    ],
  },
  {
    slug: "military-hr-simulation",
    title: "Military HR Simulation",
    status: "Planned",
    collaborators: "with a Seoul National University HCI master's collaborator",
    topics: ["Military & HR"],
    summary:
      "A unit-scale digital twin built from soldier HR data — the micro-scale version of the war-game simulation below, and the direct successor to my published life-cycle paper.",
    sections: [
      {
        heading: "Problem",
        body: [
          "New-soldier intake interviews are supposed to capture family background, education, fitness, and more via a standard template — but they're often filled out poorly. A company commander accumulates real know-how about soldier patterns (aptitude, who works well with whom) over their ~18-month command, and nearly all of it disappears when that commander rotates out.",
        ],
      },
      {
        heading: "Idea",
        body: [
          "Define soldier persona clusters to predict how a service term is likely to unfold; predict friction or conflict between soldiers sharing living quarters early enough to prevent it; keep the model current with recurring fitness and performance data; and let interview data from multiple officers — not just the commander — accumulate into what becomes, in practice, a unit-level digital twin. A related but separate idea (tracked on the startup side): a tool that auto-drafts intake-interview notes, essentially a military-specific version of a counseling-notes assistant.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Idea stage — the direct successor to my published life-cycle-pattern paper, and the micro-scale counterpart to the war-game simulation below. Planned as a collaborator's paper; no progress yet.",
        ],
      },
    ],
  },
  {
    slug: "wargame-simulation",
    title: "War-Game Simulation",
    status: "Planned",
    collaborators: "with a Seoul National University HCI master's collaborator",
    topics: ["Military & HR"],
    images: ["/images/cards/wargame-simulation.jpg", "/images/research/wargame-simulation.jpg"],
    summary:
      "Scaling the HR simulation from unit to operation — the concept directly behind the 3D battlefield-mapping project I ran as a company commander.",
    sections: [
      {
        heading: "Idea",
        body: [
          "If units are digital twins, real and simulated training (e.g., KCTC exercises) could predict how personnel should be deployed together. A core military metric — how fast readiness is actually achieved — is hard to standardize because large, aging military organizations often pass procedure down orally rather than as documented, step-by-step process. The plan is to simulate readiness-stage progression like a customer journey map or service blueprint, folding in data like soldier fitness, then connect individual-level tracking with unit-level prediction across live operations like KCTC.",
        ],
      },
      {
        heading: "Where it comes from",
        body: [
          "This grew directly out of commanding a company at the DMZ and the 3D battlefield-mapping project on the Project page — the sense that this connected to service design kept surfacing during my military service, and sharpened while I was doing my thesis.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Idea stage; planned as a collaborator's paper with no progress yet.",
        ],
      },
    ],
  },
  {
    slug: "hospital-inpatient-persona",
    title: "Long-Term Hospital Inpatient Experience Persona Study",
    status: "Planned",
    collaborators: "with a fellow SDI Lab researcher, running his own care-tech startup",
    topics: ["Healthcare"],
    summary:
      "Persona-classifying long-term inpatients by experience rather than acuity — a classification that doesn't currently exist, built on real operating data from a bedside-request startup.",
    sections: [
      {
        heading: "Gap",
        body: [
          "Hospitals classify patients by acuity/surgical risk first, then long- vs. short-stay — but there's no experience-based classification layer after that, even though one would let providers define what a given persona actually needs.",
        ],
      },
      {
        heading: "Data source",
        body: [
          "A labmate runs a startup (bedside tablet requests routed to nurses, aimed at reducing unnecessary call load) and this paper turns the resulting operational data — interviews, call frequency, requested-service type, diagnosis, gender, age — into persona classification. Not a simulation-framework paper; grounded in real operating data.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Idea/early-methodology stage — currently reviewing whether hospitality-industry (hotel-stay) persona research offers a usable precedent. If personas land well, the natural next step connects to metaverse-style hospital simulation tools (e.g., long-term-care management), linking back to the IDD/Physical Disability research line.",
        ],
      },
    ],
  },
  {
    slug: "consumer-experience-simulation",
    title: "Consumer Experience Simulation",
    status: "Planned",
    collaborators: "with a fellow SDI Lab researcher nearing her defense",
    topics: ["Consumer Experience"],
    summary:
      "Strip the disability-specific traits out of the IDD simulation architecture, and it becomes a general-purpose consumer-experience simulator — the domain Samsung itself hasn't managed to build internally.",
    sections: [
      {
        heading: "Idea",
        body: [
          "Micro: digital-twin real stores (e.g., Starfield branches) and simulate what service a given consumer cluster actually needs. Macro: generalize the same simulation tool across consumer domains — fridge usage experience, mobile-app journeys, country-specific service variants — a space Samsung itself wants but hasn't managed to build in-house.",
        ],
      },
      {
        heading: "Starting point",
        body: [
          "My collaborator has been tracking Starfield-area consumer clusters against surrounding demographic data for a while — the same lab that ran the Starfield projects on the Project page — and that existing dataset is the likely starting point.",
        ],
      },
      {
        heading: "Status",
        body: [
          "Just floated as an idea; to be scoped together in the second half of 2026.",
        ],
      },
    ],
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
