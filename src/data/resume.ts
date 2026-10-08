// Source of truth: "Bank Resume_SangyunLee (26.10.06)" in the Resume folder,
// plus Experience / Extra-curricular / Awards entries the Bank version leaves out
// (taken from the Master 2p resume, 26.09.23).

export type Role = {
  org: string;
  location?: string;
  title: string;
  period: string;
  bullets: string[];
  href?: string;
};

export type EduEntry = {
  school: string;
  degree: string;
  period: string;
  coursework?: string;
  thesis?: string;
};

export const header = {
  name: "Sang-yun Lee (Yun)",
};

export const education: EduEntry[] = [
  {
    school: "University of Pennsylvania",
    degree: "Master of Integrated Product Design (M:IPD)",
    period: "Expected May 2028",
    coursework: "Product Engineering, Human Systems Engineering, Accessibility Design, Rehab Engineering & Design, Ergonomics",
  },
  {
    school: "Sungkyunkwan University",
    degree: "Master of Service Design (GPA: 4.3/4.5)",
    period: "Sep. 2022 – Aug. 2025",
    coursework:
      "Product-Service Convergence Design, Advanced Convergence Service-Data Design, Product Anatomy and Consumer Studies, Social Service Innovation Design, Service Design Processes, Understanding Children with Disabilities",
    thesis: "Data-driven Disability Persona Augmentation for Service Journey Inference: Daily Living Support Needs of People with IDD",
  },
  {
    school: "Sungkyunkwan University",
    degree: "Dual Degree: B.B.A. & B.S. in Data Science (GPA: 3.95/4.5)",
    period: "Mar. 2017 – Feb. 2022",
    coursework:
      "Product/Service Development for Startups, Data Marketing, Platform Revolution and Business, Financing in Cultural Industry, Practice in Data Visualization, User Experience Capstone Design, Location-based Data Analytics, Intro to NLP, Applied Machine Learning, Strategic Management",
  },
];

export const technicalSkills: { label: string; items: string }[] = [
  {
    label: "Research",
    items:
      "Qualitative & Quantitative Synthesis, Interviews, Field Studies, Usability Testing, Surveys, Thematic Analysis, Behavioral Data Analysis, Persona Development, Segmentation/Clustering, Network Analysis, Process Mining, Journey Mapping, Co-Creation, A/B Testing",
  },
  {
    label: "Design & Strategy",
    items:
      "Service Design, Product Strategy, Market Research, Competitive Analysis, Scenario Planning, Interaction Design, Accessibility, Service Blueprinting, Data Visualization, Wireframes, Rapid Prototyping, 3D Printing, Laser Cutting, Digital Prototyping",
  },
  {
    label: "Software & Analytics",
    items: "Excel, Power BI, Tableau, Python, R, SPSS, Figma, Miro, Github, Unity, Magma, Rhino, Onshape, SolidWorks, Adobe Creative Suite, Vibe Coding, Generative Agents, Simulation",
  },
  { label: "Languages", items: "Korean (Native), English (Fluent), Chinese (Conversational)" },
];

export const professionalExperience: Role[] = [
  {
    title: "Business Developer, Market Intelligence Team (Customer Survey + Market Demand Analysis)",
    org: "Samsung Electronics | Digital Appliances Division",
    location: "Suwon, Korea",
    period: "Jul. 2025 – Jul. 2026",
    bullets: [
      "Analyzed global appliance market trends (market size, pricing, market share, B2B/B2C, etc.) across 12 regions and 8 product categories using GfK, Euromonitor, and BSRIA data, and produced 5-year demand forecasts through 2030, informing company-wide/regional strategy.",
      "Built an enterprise demand-intelligence dashboard and AI assistant, consolidating market, regional, and sales data into on-demand analyses and executive summaries for product management and sales teams; now deployed company-wide and in active use.",
      "Identified an opportunity for hands-free cooking support and conceived an AI-powered refrigerator service that saves recipes from personal collections & guides users through cooking via voice. Defined the concept, scope, and business model. Directed software engineers to execute.",
    ],
  },
  {
    title: "Data-driven UX Researcher & Service/Experience Designer",
    org: "SDI Lab | Data-Driven Service Design Business Strategy Consulting Institute (SKKU)",
    location: "Suwon, Korea",
    period: "Feb. 2021 – Jul. 2025",
    bullets: [
      "Conducted qualitative research including home-visit interviews, co-creation workshops, and persona interviews with people with disabilities, hospital patients, ministry staff, and mall visitors to uncover user needs.",
      "Analyzed behavioral data from social media, card transactions, and online communities using network analysis, clustering, process mining, and heatmaps to derive customer personas and journey patterns.",
      "Translated research findings into journey maps, service blueprints, and strategies for clients in retail, healthcare, and the public sector.",
      "Built generative-agent simulations of persona clusters to automate service-needs assessment for people with developmental disabilities.",
    ],
  },
  {
    title: "First Lieutenant, Headquarters Battery Commander",
    org: "ROKA | Republic of Korea Army",
    location: "Injae, Korea",
    period: "Mar. 2022 – Jun. 2024",
    bullets: [
      "Led 60+ soldiers across six functions (transportation/ammunition/communications/medical/operations/intelligence). Built a 3D terrain model to train soldiers on enemy infiltration routes, defending the battalion command post in a war-game against a tank assault and 15 raids.",
      "President of Korea ROTC 60th Officer Corps (3,561 alumni) — arranged 10 hospital partnerships & a job fair with Shinhan Financial Group.",
    ],
  },
  {
    title: "Research Analyst",
    org: "BCG | Boston Consulting Group",
    location: "Seoul, Korea",
    period: "Oct. 2021 – Dec. 2021",
    bullets: [
      "Analyzed manufacturing process, core-component supply chain, and regional regulations (e.g., ISO) to assess market-entry feasibility.",
      "Developed market-entry strategy scenarios based on the market analysis, including M&A target recommendations.",
    ],
  },
  {
    title: "IB, Corporate Finance Division Intern",
    org: "Mirae Asset Daewoo",
    location: "Seoul, Korea",
    period: "Jan. 2019 – Feb. 2019",
    bullets: [
      "Communicated with IR officers, contributed to IPO efforts, and prepared an analysis report on the domestic aviation market and LCC, scored highest in overall evaluation at the end of internship.",
    ],
  },
];

export const projectsGroup = {
  org: "SDI Lab | Data-Driven Service Design Business Strategy Consulting Institute (SKKU)",
  location: "Suwon, Korea",
};

export const projects: Role[] = [
  {
    title: "Aging with Disability Product/Service Design, National Rehabilitation Center",
    org: "",
    period: "Aug. 2024 – Dec. 2024",
    href: "/project/disability-as-market",
    bullets: [
      "Co-designed and conducted home-visit interviews with 9 people with spinal cord injury, developmental disabilities, or stroke.",
      "Synthesized findings into daily-living journey maps for each group that surfaced unmet needs and aging-related challenges.",
      "Directed a 40-student design hackathon to develop real products/services based on research; guided students to use the journey maps to identify opportunity areas and prototype 9 rehabilitation product/service concepts, which the center evaluated and awarded.",
    ],
  },
  {
    title: "VIP Concierge Robot Service Design, SKKU President’s Office",
    org: "",
    period: "Oct. 2024 – Jun. 2025",
    href: "/project/vip-concierge-robot",
    bullets: [
      "Owned experience design for VIP reception robot service, interviewing secretarial staff, the president, and VIP visitors to translate their wants into an end-to-end experience blending university's royal-court heritage with its technology.",
      "Designed 3 coordinated robot personas for welcome, tour, and refreshment, grounded in royal court protocol and the office’s existing greeting workflow; visualized them in service blueprints and directed mechanical engineering students on the build; the robots now operate.",
    ],
  },
  {
    title: "Inpatient Rehabilitation Service Design, Samsung Hospital (SAIHST)",
    org: "",
    period: "Aug. 2024 – Dec. 2024",
    href: "/project/saihst-hospital-metaverse",
    bullets: [
      "Co-designed gamified rehabilitation programs (step-count levels, meal-pickup and exercise missions) and the UI/UX of a hospital app to promote patient rehabilitation, grounded in interviews and surveys with long-term hospitalized patients.",
      "Conceived and prototyped in Unity and Magma a collaborative artwork service where patients find tags around the hospital like a treasure hunt, collect puzzle pieces, and combine them into a shared artwork displayed in public hospital spaces.",
    ],
  },
  {
    title: "Mega Shopping Mall Service Design, Shinsegae Starfield Shopping Mall",
    org: "",
    period: "Feb. 2021 – Dec. 2021",
    href: "/project/starfield-existing-branch",
    bullets: [
      "Conducted mixed-method research to define brand personality per branch via NLP-based social data analysis and within-branch customer personas via behavioral data analysis (demographic, network, process mining) with Power BI and persona interviews.",
      "Proposed mall-level service strategies based on the derived personas and journeys, including F&B-centered customer journeys, store flow and tenant changes, and social event planning, adopted in new branch operations.",
    ],
  },
  {
    title: "Mini-Fridge Subscription Service Design, Samsung Electronics",
    org: "",
    period: "Mar. 2023 – Jun. 2023",
    href: "/project/samsung-lifelog-minifridge",
    bullets: [
      "Classified users by lifestyle to devise mini-fridge sales strategies, analyzing life-log data from diary studies and focus group interviews through process-mining journey maps, network analysis, and heatmaps of living-radius patterns to derive 7 personas.",
      "Proposed a lifestyle-based subscription service that stocks mini-fridges with products matched to each derived persona.",
    ],
  },
  {
    title: "Digital Public Communication Strategy Design, Ministry of Culture, Sports & Tourism",
    org: "",
    period: "Jul. 2021 – Dec. 2021",
    href: "/project/mcst-public-communication",
    bullets: [
      "Designed citizen-participatory policy communication to address the ministry's ineffective social media information delivery.",
      "Led a 3-day co-creation workshop (ministry staff + students) via Miro-based card sorting & network-based context visualization to reveal how citizens interpret policy messaging; co-designed improved content; selected as an OECD Best Practice in public policy communication design.",
    ],
  },
  {
    title: "AIEX Design Talent Program, SKKU (National R&D Project)",
    org: "",
    period: "Jul. 2024 – Jun. 2025",
    bullets: ["Organized a 118-student design-talent training program — hackathons, startup design-thinking school, Tokyo capstone."],
  },
];

export const publications: Role[] = [
  {
    title: "Data-driven Disability Persona Augmentation for Service Journey Inference",
    org: "Published, Sungkyunkwan University",
    period: "Jun. 2025",
    href: "/research/disability-persona-augmentation",
    bullets: [
      "Developed a computational framework for studying disability service needs where experiments and data are hard to obtain.",
      "Augmented Vineland-adaptive behavior data from 9 individuals with developmental disabilities to 2,400 cases; derived 5 persona clusters and ran AI-driven daily life scenario (ADL/IADL) simulations that compute support-need levels and causes, visualized as a journey map.",
    ],
  },
  {
    title: "Patterning Military Experience for Quality Improvement of Enlisted Soldiers",
    org: "Published, Korean Academy of Military Social Welfare",
    period: "Dec. 2024",
    bullets: [
      "Developed a pattern model of high-performing soldiers' military life to give soldiers who struggle to adapt a clear path to follow.",
      "Interviewed 18 high-performing soldiers, combining longitudinal direct observation; yielded a 5-stage military life-cycle pattern model.",
    ],
  },
];

export const extracurricular: Role[] = [
  {
    title: "President",
    org: "DeepBridge | Regular Customer Management AI Tool Start-up",
    location: "Seoul, Korea",
    period: "May 2021 – Oct. 2021",
    bullets: ["Customer mgmt software startup using POS and CCTV data, previously registered in SKKU campus town."],
  },
  {
    title: "President",
    org: "GRU | Start-up Strategic Consulting Club",
    location: "Seoul, Korea",
    period: "Jan. 2020 – May 2021",
    bullets: [
      "Rebuilt curriculum and org structure; led design thinking education and ran consulting projects with startups across education, beauty, proptech, digital marketing, tourism, personal mobility and smart factory.",
    ],
  },
];

export const awards: { title: string; org: string; period: string }[] = [
  { title: "NEO The MacGyver Award (Problem Solving)", org: "Samsung Electronics", period: "Aug. 2025" },
  { title: "KD Pharma-Songcheon Foundation Scholarship (x2)", org: "Songcheon Foundation", period: "2024 – 2025" },
  { title: "GP Border Operation Merit Award", org: "Republic of Korea Army", period: "Mar. 2023" },
  { title: "3rd Prize, 2021 Mirae Asset Financial Big Data Festival", org: "Mirae Asset Daewoo", period: "Nov. 2021" },
  { title: "2nd Prize, 14th Convergence Foundation Project", org: "Sungkyunkwan University", period: "Feb. 2021" },
  { title: "Yoon Yong-taek SKKU Alumni Association Chairman's Scholarship (x2)", org: "Sungkyunkwan University", period: "Apr. 2020, Apr. 2021" },
];
