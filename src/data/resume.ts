export type Entry = {
  org: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
};

export const education: Entry[] = [
  {
    org: "University of Pennsylvania",
    location: "Philadelphia, USA",
    role: "Master of Integrated Product Design (M:IPD)",
    period: "Aug. 2026 – Present (Expected 2028)",
    bullets: [
      "Interdisciplinary program at the intersection of Penn Engineering, Weitzman School of Design, and Wharton — pursuing technology-driven strategic design with an early focus on healthcare and accessibility applications",
    ],
  },
  {
    org: "Sungkyunkwan University",
    location: "Seoul, Korea",
    role: "Master of Service Design (4.3 / 4.5)",
    period: "Sep. 2022 – Aug. 2025",
    bullets: [
      "B.A. in Global Business Administration & B.S. in Data Science (3.95 / 4.5), Mar. 2017 – Feb. 2022",
      "Collaborated on strategic service design, CX improvement, service planning, and branding strategy projects with Samsung, Ministry of Culture, Sports and Tourism, Samsung Seoul Hospital, etc.",
      "Thesis: Data-driven Disability Persona Augmentation for Service Journey Inference — Focusing on Daily Living Support Needs of People with Developmental Disabilities",
    ],
  },
];

export const workExperience: Entry[] = [
  {
    org: "Samsung Electronics | Digital Appliances Division",
    location: "Suwon, Korea",
    role: "Business Developer, Market Intelligence Team",
    period: "Jul. 2025 – Jul. 2026",
    bullets: [
      "Identified business opportunities through customer usage data analysis, demand forecast, and market sensing; orchestrated global market demand analysis using GfK, Euromonitor, and BSRIA historical data (2017–2025), producing 5-year-ahead demand projections through 2030",
      "Built an enterprise-wide demand dashboard and AI chatbot via vibe coding (AX project), aggregating and reconciling demand data across CMI, sales organizations (retail, subscription, online, B2B), and regional sales (RPM); presented prototypes to sales leadership and executives for evaluation",
      "Proposed a Bixby-powered cooking-assistant service for screen-based AI-appliances (Family Hub refrigerators), enabling hands-free voice interaction while cooking; adopted as an official product development initiative",
    ],
  },
  {
    org: "SDI Lab | Data-Driven Service Design Business Strategy Consulting Institute",
    location: "Suwon, Korea",
    role: "Researcher",
    period: "Jul. 2024 – Jul. 2025",
    bullets: [
      "Conducted data-driven service design research and consulting projects across public-sector, corporate, and healthcare clients, quantifying personas from behavioral and usage data and deriving service strategy from them",
      "Led disability- and aging-focused service design research, defining user personas from real behavioral data and using AI-driven simulation to experiment with service strategies against them",
      "Co-organized and ran large-scale, cross-institutional student programs (100+ participants), mentoring students on design thinking methods",
    ],
  },
  {
    org: "ROKA | Republic of Korea Army",
    location: "Injae, Korea",
    role: "Headquarters Company Commander, Forward Observer Officer",
    period: "Mar. 2022 – Jun. 2024",
    bullets: [
      "As the youngest Headquarters Company Commander, coordinated and directed 60+ personnel across six functional sections — transportation, ammunition, communications, medical, operations, and intelligence — as the cross-functional program lead for all non-combat support",
      "Served as a Forward Observer Officer at a front-line Guard Post, maintaining operational stability during a North Korean missile provocation (Oct 2022)",
    ],
  },
  {
    org: "BCG | Boston Consulting Group",
    location: "Seoul, Korea",
    role: "Research Analyst",
    period: "Oct. 2021 – Dec. 2021",
    bullets: [
      "Contributed to a strategic market-entry analysis for a leading Korean electronics manufacturer's automotive camera business, deconstructing the component value chain and competitive landscape to identify build-vs-buy opportunities and propose M&A targets",
    ],
  },
  {
    org: "Mirae Asset Daewoo",
    location: "Seoul, Korea",
    role: "IB, Corporate Finance Division Intern",
    period: "Jan. 2019 – Feb. 2019",
    bullets: [
      "Communicated with IR officers, contributed to IPO efforts, and prepared an analysis report on the domestic aviation market and LCC, scored highest in overall evaluation at the end of internship",
    ],
  },
];

export const publications: Entry[] = [
  {
    org: "Data-driven Disability Persona Augmentation for Service Journey Inference: Focusing on Daily Living Support Needs of People with Developmental Disabilities",
    location: "",
    role: "Published, Sungkyunkwan University",
    period: "Jun. 2025",
    bullets: [
      "Augmented Vineland-based adaptive behavior data from 9 individuals with developmental disabilities to a dataset of 2,400 cases, addressing the small-sample constraint that typically blocks data-driven disability research",
      "Derived 5 representative developmental disability persona clusters via multidimensional analysis",
      "Implemented AI-driven personas and ran ADL/IADL scenario simulations to quantify support needs, providing a reusable framework for service design in low-data disability domains",
    ],
  },
  {
    org: "Patterning Military Experience for Quality Improvement of Enlisted Soldiers: A Persona-Based Study on Military Life Cycle Experience Design",
    location: "",
    role: "Published, Korean Academy of Military Social Welfare",
    period: "Dec. 2024",
    bullets: [
      "Interviewed 18 high-performing soldiers to quantitatively measure their military service experiences, deriving a 5-stage life-cycle pattern model (Adaptation, Growth, Maturity, Stagnation, Decline) to inform predictive HR programming for new recruits",
    ],
  },
];

export const extracurricular: Entry[] = [
  {
    org: "Federation of Korea ROTC 60th Officer",
    location: "Seoul, Korea",
    role: "President",
    period: "Mar. 2022 – Present",
    bullets: [
      "Represent 3,561 ROTC 60th officers; organized a job fair with Shinhan Financial Group, promoted veteran recruitment with KB Kookmin Bank and E-Land. Partnered with 10 hospitals for their families",
    ],
  },
  {
    org: "DeepBridge | Regular Customer Management AI Tool Start-up",
    location: "Seoul, Korea",
    role: "President",
    period: "May 2021 – Oct. 2021",
    bullets: [
      "Customer mgmt software startup using POS and CCTV data, previously registered in SKKU campus town",
    ],
  },
  {
    org: "GRU | Start-up Strategic Consulting Club",
    location: "Seoul, Korea",
    role: "President",
    period: "Jan. 2020 – May 2021",
    bullets: [
      "Led design thinking education and established HR system, completed consulting projects with diverse startups in education, beauty, proptech, digital marketing, tourism, personal mobility and smart factory",
      "Collaborated with SDI Lab, managed projects with Ministry of Culture, Sports, and Tourism, and Samsung",
    ],
  },
];

export const awards = [
  "NEO The MacGyver Award, Samsung Electronics (Aug. 2025)",
  "KD Pharma-Songcheon Foundation Scholarship, x2 (2024–2025)",
  "GP Border Operation Merit Award, ROKA (Mar. 2023)",
  "3rd Prize, Mirae Asset Financial Big Data Festival (Nov. 2021)",
  "Yoon Yong-taek SKKU Alumni Chairman's Scholarship, x2 & 2nd Prize, 14th Convergence Foundation Project (2020–2021)",
];

export const skills = {
  tools: [
    "MS Office (PowerPoint, Excel)",
    "Rapid Prototyping",
    "Vibe Coding",
    "Figma",
    "Unity",
    "Magma",
    "Rhino",
    "Onshape",
  ],
  languages: ["Korean (Native)", "English (Fluent)", "Chinese (Conversational)"],
};
