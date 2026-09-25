export type ResearchStatus = "Published" | "In Progress" | "Planned";
export type ResearchTopic =
  | "Disability & Accessibility"
  | "Military & HR"
  | "Industrial Engineering"
  | "Healthcare"
  | "Consumer Experience"
  | "Public Communication";

export type BodyItem = string | { img: string };
export type Section = { heading: string; body: BodyItem[] };

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
  note?: string;
  demo?: { href: string };
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
    images: ["/images/cards/disability-persona-augmentation.jpg"],
    summary:
      "Defined data-driven personas of individuals with developmental disabilities and trained AI-based personas to simulate their behaviors across diverse daily-living scenarios, with the goal of identifying unmet service needs.",
    sections: [
      {
        heading: "My Role",
        body: [
          { img: "/images/full/disability-persona-augmentation-01.jpg" },
          { img: "/images/full/disability-persona-augmentation-02.jpg" },
          "Responsible for the entire end-to-end research and execution process.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Developed five developmental-disability personas and derived service needs across eleven daily-living scenarios for each persona. These findings form the core foundation of the ongoing thesis manuscript.",
        ],
      },
      {
        heading: "Goal",
        body: [
          "To develop a data-driven service-design framework for people with developmental disabilities, which later evolved into the foundation of my graduate thesis.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To quantify the functional levels of individuals with developmental disabilities, I applied the Vineland Adaptive Behavior Scales, the gold standard for assessing adaptive behavior.",
          { img: "/images/full/disability-persona-augmentation-03.jpg" },
          "To measure service needs across daily-living scenarios, it was essential to build AI personas capable of simulating realistic behavior patterns. In doing so, I drew inspiration from a 2024 Stanford study demonstrating AI personas that replicate approximately 85% of human behavioral patterns.",
          { img: "/images/full/disability-persona-augmentation-04.jpg" },
        ],
      },
      {
        heading: "Process",
        body: [
          "The research followed the steps below: I first reviewed existing persona design components and adapted them to create a framework specialized for developmental disabilities.",
          { img: "/images/full/disability-persona-augmentation-05.jpg" },
          { img: "/images/full/disability-persona-augmentation-06.jpg" },
          "Then, I interviewed the caregivers of nine people with developmental disabilities, documenting their functional levels based on the Vineland Adaptive Behavior Scales.",
          { img: "/images/full/disability-persona-augmentation-07.jpg" },
          { img: "/images/full/disability-persona-augmentation-08.jpg" },
          "Using inter-item relationships within the Vineland model, I constructed rule-based mappings that allowed me to augment the dataset from 9 to 2,400 profiles. These 2,400 profiles were then clustered to derive five distinct disability personas.",
          { img: "/images/full/disability-persona-augmentation-09.jpg" },
          { img: "/images/full/disability-persona-augmentation-10.jpg" },
          { img: "/images/full/disability-persona-augmentation-11.jpg" },
          { img: "/images/full/disability-persona-augmentation-12.jpg" },
          { img: "/images/full/disability-persona-augmentation-13.jpg" },
          { img: "/images/full/disability-persona-augmentation-14.jpg" },
          "The resulting personas were embedded into an AI persona model and applied across 11 ADL/IADL-based daily-living scenarios. This enabled me to identify potential difficulties and support needs without direct observation, significantly improving efficiency and scalability.",
          { img: "/images/full/disability-persona-augmentation-15.jpg" },
          { img: "/images/full/disability-persona-augmentation-16.jpg" },
        ],
      },
      {
        heading: "Result",
        body: [
          "Through this end-to-end process, I developed an 'Augmented Double Diamond' model — an extension of the traditional design-thinking framework that incorporates persona augmentation into the problem-solving cycle. This work successfully formed the foundation of my graduate thesis.",
          { img: "/images/full/disability-persona-augmentation-17.jpg" },
          { img: "/images/full/disability-persona-augmentation-18.jpg" },
          "Looking ahead, I plan to build upon this approach by simulating AI personas within 3D virtual environments — such as Minecraft or Unity — similar to the methodology demonstrated in Altera's research. This will enable more immersive, interactive, and context-rich evaluations of daily-living challenges for people with developmental disabilities.",
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
      "By measuring soldiers' military service experiences, I proposed an HR system that uses data to predict the military service trajectory of newly enlisted personnel.",
    sections: [
      {
        heading: "My Role",
        body: ["Company Commander, overseeing personnel and HR management."],
      },
      {
        heading: "Outcome",
        body: [
          "Found five stages in military life experiences: 'Adaptation,' 'Growth,' 'Maturity,' 'Stagnation,' and 'Decline.'",
          "Paper was published on Korean Academy of Military Social Welfare.",
        ],
      },
      {
        heading: "Problem",
        body: [
          "Due to conscription in South Korea, many soldiers struggle to adapt to military life, resulting in frequent disciplinary issues.",
          "While programs like military life counselors and green camps aim to address the adaptation problems, there is a lack of focus on developing high-performing soldiers.",
          "Most research focuses on helping struggling soldiers, but true strength lies in improving all soldiers, particularly those who are excelling. Many conscripted soldiers view their service as a waste of time and not an opportunity for growth.",
          "Junior officers often lack the experience to address individual needs, while senior officers can predict a soldier's service based on their own experience. By collecting data on soldiers' experiences, a predictive model can be created to forecast the military life of new recruits, tracking factors such as challenges, goals, self-realization, and skill development, which can lead to more personalized training programs for high-performing soldiers.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "This study aimed to develop a research model for understanding the patterns of soldiers' military lives, grounded in life cycle theory and persona theory. From enlistment to discharge, soldiers grow through their military experiences. Over time, their initial marketing persona at enlistment evolves toward the designated persona they aimed to achieve.",
          "The degree to which the marketing persona at discharge aligns with the designated persona represents a soldier's progress. The extent of goal achievement during military service constitutes the positive gap, while unachieved goals form the negative gap. These gaps are influenced by both internal military factors and external factors.",
          "The focus of this research is to quantify the experiences of exemplary soldiers through interviews and define patterns specific to each persona. Through a series of studies, the ultimate goal is to develop an HR model capable of predicting the military life of newly enlisted soldiers based on historical data.",
        ],
      },
      {
        heading: "Process",
        body: [
          "I conducted interviews with 18 soldiers who successfully adapted to military life and analyzed their characteristics. I identified the personal traits (personas) of high-performing soldiers, measured their military life experiences, and identified both positive and negative factors contributing to goal achievement. I then analyzed the common factors among them.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The military life experience has been patterned into five stages: 'Adaptation,' 'Growth,' 'Maturity,' 'Stagnation,' and 'Decline.' It was found that the highest achievement rates are associated with experiencing all five stages. Based on these findings, I have written a paper and submitted it to Korean Academy of Military Social Welfare, which is currently under review. In the future, I plan to develop a predictive model using big data collected from these patterns.",
        ],
      },
    ],
    note: "This RESULT paragraph is the original site's wording from while the paper was under review — it has since actually been published (Dec. 2024), which is why the status badge above says Published rather than matching 'currently under review.'",
  },
  {
    slug: "idd-agent-simulation",
    title: "IDD AI Agent Simulation Testbed",
    status: "In Progress",
    venue: "Independent research project, UPenn M:IPD",
    date: "2026 –",
    topics: ["Disability & Accessibility"],
    images: ["/images/cards/idd-agent-simulation.jpg"],
    summary:
      "Building the 'brain' behind the persona-augmentation thesis — profile-native AI agents grounded in clinical assessment data, simulated across daily-living scenarios in a virtual environment, on a 2-year roadmap toward becoming a general simulation methodology.",
    demo: { href: "/lab/index.html" },
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
    images: ["/images/cards/wargame-simulation.jpg"],
    summary:
      "As a Forward Observation Officer, I experienced two GP operations during which I encountered North Korean provocations (artillery attacks, missile launches, and drone incursions). Also, as a HQ company commander, I planned and simulated military operations. These experiences underscored the critical importance of simulation for real-war situations, which is why I aim to develop an AI-driven military operation simulator.",
    sections: [
      {
        heading: "My Role",
        body: [
          "Forward Observation Officer, HQ Company Commander, Persona modeling, System design.",
        ],
      },
      {
        heading: "Outcome",
        body: ["(In progress) Developing AI-driven wartime simulation model."],
      },
      {
        heading: "Goal",
        body: [
          "To model a digital AI-driven military unit by transforming real soldiers' HR data — such as mission capabilities, physical performance, and assigned roles — into computational representations.",
          "To build a wargame simulation model by recreating actual military terrain in Unity and simulating friendly-force responses under assumed enemy attack scenarios.",
          "To further refine the system for real-world military application and ultimately distribute it as an AI defense solution.",
        ],
      },
      {
        heading: "Process",
        body: [
          "During my service as a forward observer, I was deployed to a frontline Guard Post (GP) for operational missions. Initially, I tried to digitize the terrain data of forward areas, which had previously been informally understood through hand-drawn maps. This was intended to address the inconsistency in information delivery and comprehension caused by variations in map quality depending on the individual who created them.",
          "Using the TAS-1K artillery observation equipment, precise coordinates for each point were calculated and used to create accurate 2D visual materials that reflect distances and positions on a two-dimensional plane.",
          "Subsequently, all key elements — including enemy coordinates, targeting plans, anticipated enemy infiltration routes, and bypass routes — were diagrammed to create a comprehensive visual guidebook for use within the GP. (Due to security regulations, this guidebook cannot be taken outside the GP.)",
          { img: "/images/full/wargame-simulation-01.jpg" },
          "Next, the goal was to create a comprehensive manual covering peacetime, wartime, and provocation scenarios using service scenarios. Observation officers are required to have both the expertise of a firepower specialist and the command capabilities to oversee the entire GP in emergencies. However, after experiencing provocations from North Korea, it became evident that the materials handed down by predecessors lacked critical guidance on wartime response. To address this gap, I conducted interviews with 31 soldiers in the GP, categorized by their roles.",
          "Within the GP, roles such as sentry, situation monitor, observer, medic, and driver must function seamlessly like interlocking gears to ensure the success and sustainability of operations. However, due to the lack of clear regulations and reliance on oral transmission for handovers, inconsistencies in role interpretation often arose, even among soldiers performing the same tasks.",
          "To resolve this issue, service scenarios were developed for each role through repeated interviews. These were consolidated into a comprehensive, diagrammed manual covering all potential situations, including peacetime, wartime, and provocations. The manual also includes visualizations of operational plans and command structures within the division, response scenarios for provocations such as gunfire or artillery strikes (based on the location and origin of the attack), and contingency plans for equipment malfunctions.",
        ],
      },
      {
        heading: "Result",
        body: [
          "Based on this experience, I was invited by the ROTC Central Association to deliver lectures to cadets yet to be commissioned, newly commissioned second lieutenants aspiring to field assignments, and mid-level officers newly assigned to forward areas.",
          { img: "/images/full/wargame-simulation-02.jpg" },
          { img: "/images/full/wargame-simulation-03.jpg" },
          { img: "/images/full/wargame-simulation-04.jpg" },
          "During one of these lectures, I had the opportunity to meet the former Chief of Staff of the Army. We discussed the realities faced in forward areas and exchanged ideas on potential institutional improvements.",
          { img: "/images/full/wargame-simulation-05.jpg" },
          "The discussion led to the following conclusion: through multiple operational deployments, I accumulated substantial knowledge of military operations. These experiences made it clear to me that the outcome of an operation depends heavily on the capabilities of its commanders. Yet, in Korea, there are no tools that allow proper simulation of real operations, nor any system capable of reflecting the actual capabilities of one's own soldiers.",
          "Based on this gap, I began developing a new line of research. Just as I previously studied the soldier life cycle, I am now working on creating AI soldier personas using HR data collected at the time of enlistment. These personas will be continuously updated throughout a soldier's service period — tracking changes in physical performance, personality traits, interpersonal dynamics, and role competency — to build a system capable of capturing an entire unit's HR state in real time.",
          "Using this foundation, I am developing an AI-driven military wargame simulator that reconstructs real battlefield environments from terrain data and allows commanders to deploy their actual personnel profiles. This enables the simulation of real combat scenarios in multiple configurations and improves decision-making accuracy under wartime conditions.",
          { img: "/images/full/wargame-simulation-06.jpg" },
          { img: "/images/full/wargame-simulation-07.jpg" },
        ],
      },
    ],
    note: "The site's Outcome field literally says '(In progress)'; per the vault, this is actually still idea-stage (no progress made yet), planned as a collaborator's (Seoul National University HCI) paper — the status badge above reflects that vault correction rather than the site's wording.",
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
