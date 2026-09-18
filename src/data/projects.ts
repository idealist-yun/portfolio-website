export type Phase = "Basic" | "Data-Driven" | "AI-Driven";
export type Domain =
  | "Disability & Healthcare"
  | "Retail & Consumer"
  | "Public Sector"
  | "Corporate Strategy"
  | "Military"
  | "Startup & Venture";

export type Project = {
  slug: string;
  title: string;
  org: string;
  period: string;
  location: string;
  phase: Phase;
  domains: Domain[];
  summary: string;
  bullets: string[];
};

export const projects: Project[] = [
  {
    slug: "samsung-ax-dashboard",
    title: "Enterprise Demand Dashboard & AI Chatbot (AX Project)",
    org: "Samsung Electronics · Digital Appliances Division",
    period: "Jul. 2025 – Jul. 2026",
    location: "Suwon, Korea",
    phase: "AI-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    summary:
      "Built and shipped a self-serve demand-intelligence tool via vibe coding, reconciling data across CMI, sales, and regional organizations for leadership decision-making.",
    bullets: [
      "Orchestrated global market demand analysis across all regions and product categories using GfK, Euromonitor, and BSRIA historical data (2017–2025), producing rolling 5-year-ahead demand projections through 2030",
      "Built an enterprise-wide demand dashboard and AI chatbot via vibe coding, aggregating and reconciling demand data across CMI, sales organizations (retail, subscription, online, B2B), and regional sales (RPM)",
      "Presented prototypes directly to sales leadership and executives for evaluation and adoption",
    ],
  },
  {
    slug: "samsung-bixby-cooking",
    title: "Bixby-Powered Cooking Assistant for Screen-Based Appliances",
    org: "Samsung Electronics · Digital Appliances Division",
    period: "Jul. 2025 – Jul. 2026",
    location: "Suwon, Korea",
    phase: "AI-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    summary:
      "Designed a hands-free, voice-driven cooking assistant service for Family Hub refrigerators, adopted as an official product development initiative.",
    bullets: [
      "Proposed a Bixby-powered cooking-assistant service for screen-based AI-appliances, enabling hands-free voice interaction while cooking",
      "Service concept was adopted as an official product development initiative within the Household Appliance Division",
    ],
  },
  {
    slug: "nrc-daily-living-hackathon",
    title: "Daily-Living Journey Research & Cross-Institutional Hackathon",
    org: "National Rehabilitation Center (via SDI Lab)",
    period: "Jul. 2024 – Dec. 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Disability & Healthcare", "Public Sector"],
    summary:
      "Led journey-map research with NRC researchers across spinal cord injury, developmental disability, and stroke populations, then closed the research-to-solution gap with a 40-participant hackathon.",
    bullets: [
      "Led daily-living journey-map research with NRC researchers across individuals with spinal cord injury, developmental disabilities, and stroke",
      "Identified the gap between research insight and actionable solutions, then bridged it by conceiving and directing a 40-participant cross-institutional hackathon with SKKU to translate the research into prototyped interventions",
    ],
  },
  {
    slug: "skku-vip-concierge-robots",
    title: "VIP Concierge Robot Service",
    org: "Sungkyunkwan University President's Office (via SDI Lab)",
    period: "2021 – 2025",
    location: "Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Public Sector"],
    summary:
      "Designed a robotic VIP-reception service inspired by Korea's ancient royal court protocol, orchestrating three robots into interlocking service personas.",
    bullets: [
      "Designed a robotic VIP-reception service for Sungkyunkwan University's President's Office inspired by Korea's ancient royal court protocol",
      "Orchestrated 3 robots into interlocking personas — welcome, guided tour and explanation, and refreshment service",
      "Coordinated with Mechanical Engineering robotics researchers to deploy all 3 robots",
    ],
  },
  {
    slug: "saihst-hospital-metaverse",
    title: "Hospital Welfare & Rehabilitation Service Design (Metaverse)",
    org: "SAIHST · Samsung Advanced Institute of Health Science & Technology",
    period: "Jul. 2024 – Feb. 2025",
    location: "Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Disability & Healthcare"],
    summary:
      "Designed welfare and rehabilitation services for hospitalized patients using metaverse environments, including UI/UX for a hospital super app.",
    bullets: [
      "Participated in a welfare & rehabilitation service design project for hospitalized patients using the metaverse",
      "Designed the UI/UX for planned welfare services within a hospital super app",
      "Prototyped a collaborative artwork service for hospitalized patients using Unity and Magma",
    ],
  },
  {
    slug: "aiex-design-talent-program",
    title: "AIEX Design Talent Training Program",
    org: "AIEX · Applied Innovation Experience Design Track, SKKU",
    period: "Jul. 2024 – Jul. 2025",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Public Sector"],
    summary:
      "Planned and organized a 118-student design-talent training program spanning hackathons, a design-thinking school, and an international capstone collaboration.",
    bullets: [
      "Planned & organized a 118-student design-talent training program, including the NRC joint hackathon and a design thinking school for building startups with Figma training",
      "Published a conference paper based on the project outcomes",
      "Conducted a capstone project in collaboration with Tokyo Polytechnic University",
    ],
  },
  {
    slug: "shinsegae-starfield",
    title: "Shinsegae Starfield Mega Mall Branding & Service Design",
    org: "Shinsegae (via SDI Lab)",
    period: "2021 – 2025",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    summary:
      "Conducted customer demographic analysis for mega-shopping-mall branding and designed F&B and overall service for newly opening malls.",
    bullets: [
      "Conducted a customer demographic analysis for mega-shopping mall branding",
      "Planned F&B services and designed overall service for newly opening malls",
    ],
  },
  {
    slug: "mcst-digital-communication",
    title: "Digital Public Communication Strategy",
    org: "Ministry of Culture, Sports and Tourism (via SDI Lab)",
    period: "2021 – 2025",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Public Sector"],
    summary:
      "Managed and experimented with digital public communication strategy for a government ministry; selected as an OECD Best Practice.",
    bullets: [
      "Managed and experimented digital public communication strategy",
      "Selected as an OECD Best Practice",
    ],
  },
  {
    slug: "samsung-fandom-raemian",
    title: "Brand Fandom Analysis & Virtual Urban Service Design",
    org: "Samsung Electronics / Raemian (via SDI Lab)",
    period: "2021 – 2025",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer", "Corporate Strategy"],
    summary:
      "Completed a brand fandom analysis and refrigerator service design with the Household Appliance Division, plus a virtual urban service design project with Raemian using the metaverse.",
    bullets: [
      "Completed a brand fandom analysis project and a refrigerator service design with the Household Appliance Division",
      "Designed a virtual urban service design project using the metaverse with Raemian",
    ],
  },
  {
    slug: "bcg-automotive-camera",
    title: "Automotive Camera Market-Entry Strategy",
    org: "BCG · Boston Consulting Group",
    period: "Oct. 2021 – Dec. 2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Corporate Strategy"],
    summary:
      "Contributed to a strategic market-entry analysis for a leading Korean electronics manufacturer's automotive camera business.",
    bullets: [
      "Deconstructed the component value chain and competitive landscape to identify build-vs-buy opportunities",
      "Proposed M&A targets based on regulatory and expert insight synthesis",
    ],
  },
  {
    slug: "roka-headquarters-command",
    title: "Headquarters Company Command & Forward Observation",
    org: "ROKA · Republic of Korea Army",
    period: "Mar. 2022 – Jun. 2024",
    location: "Injae, Korea",
    phase: "Basic",
    domains: ["Military"],
    summary:
      "As the youngest Headquarters Company Commander, led 60+ personnel across six functional sections and served as a Forward Observer Officer at a front-line Guard Post.",
    bullets: [
      "Coordinated and directed 60+ personnel across transportation, ammunition, communications, medical, operations, and intelligence sections",
      "Served as a Forward Observer Officer at a front-line Guard Post, maintaining operational stability during a North Korean missile provocation (Oct 2022)",
    ],
  },
  {
    slug: "deepbridge-startup",
    title: "DeepBridge — Regular Customer Management AI Tool",
    org: "DeepBridge (own startup)",
    period: "May 2021 – Oct. 2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Startup & Venture"],
    summary:
      "Founded and led a customer-management software startup using POS and CCTV data, registered in the SKKU campus-town startup program.",
    bullets: [
      "Built a customer management software product using POS and CCTV data",
      "Registered the venture in SKKU's campus-town startup program",
    ],
  },
  {
    slug: "gru-consulting-club",
    title: "GRU — Start-up Strategic Consulting Club",
    org: "GRU (President)",
    period: "Jan. 2020 – May 2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Startup & Venture", "Corporate Strategy"],
    summary:
      "Led design-thinking education and ran consulting projects with startups across education, beauty, proptech, marketing, tourism, mobility, and smart factory.",
    bullets: [
      "Led design thinking education and established the club's HR system",
      "Completed consulting projects with diverse startups across education, beauty, proptech, digital marketing, tourism, personal mobility, and smart factory",
      "Collaborated with SDI Lab on projects with the Ministry of Culture, Sports, and Tourism, and Samsung",
    ],
  },
];

export const allDomains: Domain[] = [
  "Disability & Healthcare",
  "Retail & Consumer",
  "Public Sector",
  "Corporate Strategy",
  "Military",
  "Startup & Venture",
];

export const allPhases: Phase[] = ["Basic", "Data-Driven", "AI-Driven"];
