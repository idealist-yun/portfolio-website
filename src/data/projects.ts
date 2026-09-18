export type Phase = "Basic" | "Data-Driven" | "AI-Driven";
export type Domain =
  | "Disability & Healthcare"
  | "Retail & Consumer"
  | "Public Sector"
  | "Corporate Strategy"
  | "Military"
  | "Startup & Venture"
  | "Robotics & AI";

export type Section = { heading: string; body: string[] };

export type Project = {
  slug: string;
  title: string;
  org: string;
  period: string;
  location: string;
  phase: Phase;
  domains: Domain[];
  brief: string;
  images?: string[];
  role: string;
  outcome: string[];
  sections: Section[];
};

export const projects: Project[] = [
  // ---------------- BASIC ----------------
  {
    slug: "undergraduate-works",
    title: "Undergraduate Works — Founding GRU",
    org: "GRU (Start-up Strategic Consulting Club), Sungkyunkwan University",
    period: "2020 – 2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Startup & Venture"],
    images: ["/images/projects/undergraduate-works.jpg"],
    brief:
      "Founded and ran a student strategy-consulting club after a professor's design-thinking class reframed how I saw my own future.",
    role: "Founder & President",
    outcome: [
      "Ran consulting engagements for four early-stage startups across education, travel-tech, co-living, and micro-mobility",
      "Rebuilt the club's curriculum, HR system, and org structure from scratch; it became an officially approved university club and is still running, five+ years later",
      "Placed in three undergraduate competitions, including 3rd Prize at the Mirae Asset Financial Big Data Festival",
    ],
    sections: [
      {
        heading: "Why",
        body: [
          "I started university without a clear sense of direction. That changed when a professor introduced me to design thinking and pushed me to think like an outlier instead of chasing universal relevance. I began trying to actively design who I wanted to become, and the first thing I did with that energy was found a service-design club — GRU — to practice design thinking on real problems.",
        ],
      },
      {
        heading: "What",
        body: [
          "GRU ran strategy-consulting projects for startups across industries: a content-based business model for an education startup, an app-service plan for a travel-tech company, a community festival for a co-living/co-working startup, and a character-based branding ecosystem for a shared e-scooter company.",
          "I rebuilt the club end to end — a new education curriculum, a member-selection and HR process, and an operating structure (HR/ops/finance teams) — because I felt the most important part of design thinking, prototyping and testing, was routinely skipped in real consulting work. I redesigned the program so each semester ran strategy through mid-terms, prototyping between mid-terms and finals, and a final client presentation — a complete cycle every term, three client companies per semester.",
          "Alongside GRU, I worked on toy projects: a subscription model linking Samsung's Bespoke Qooker to food-delivery services (2nd Prize, Samsung Home Appliance competition — left off my resume since it was a coursework project), an NLP-based stock search/recommendation feature for a mobile trading app (3rd Prize, Mirae Asset Financial Big Data Festival), and an antibacterial handle-sanitizing device for shared bicycles during COVID (2nd Prize, SKKU Design Competition).",
        ],
      },
      {
        heading: "What stuck",
        body: [
          "Bringing my club work and consulting projects to my professor for feedback, over and over, built the relationship that later got me directly into SDI Lab — see the National Rehabilitation Center and Ministry of Culture, Sports and Tourism projects below. GRU's curriculum and org structure are still recognizable in the club's handoff documents today.",
        ],
      },
    ],
  },
  {
    slug: "mcst-public-communication",
    title: "Public Communication Strategy Design",
    org: "Ministry of Culture, Sports and Tourism (via SDI Lab, GRU students)",
    period: "2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Public Sector"],
    images: ["/images/projects/mcst-public-communication.jpg"],
    brief:
      "Designed and ran a 3-day participatory co-design lab that turned qualitative citizen data into a communication strategy — later recognized as an OECD Best Practice.",
    role: "Data analysis, visualization, and student-team management",
    outcome: [
      "Selected as an OECD Best Practice in Open Government and Public Communication",
      "A student from the monitoring group was invited to present the results directly to the OECD",
      "The ministry now actively produces citizen-oriented content (e.g., character-based formats) and reports meaningfully better public response than before",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "Under OECD's 'Open Government' framing, public communication needs to shift from one-way persuasion to two-way, symmetrical participation. My professor's project — which I helped staff by bringing in GRU students I managed directly — set out to design and test an educational strategy for that shift, working with the Ministry's own communication staff.",
        ],
      },
      {
        heading: "Process",
        body: [
          "We ran a participatory living lab pairing ministry officials with a student monitoring group. Using 100 pre-analyzed government social-media posts, each tagged with hidden context metadata, participants ran a timed card-sorting exercise — 100 down to 50, 30, then 10 images — choosing the ones that felt most meaningful for a given macro-theme like carbon neutrality.",
          "Revealing the hidden tags behind the final 10 images let officials see, empirically, how citizens actually interpret their messaging — instead of guessing. Over the following two days, officials and students used that context to co-create new promotional material together.",
        ],
      },
      {
        heading: "Result",
        body: [
          "A follow-up citizen satisfaction survey showed a clear improvement in clarity and communication quality. The methodology was presented to the OECD as a best-practice case, and the same format was later reused for a TikTok-focused project aimed at high-school students.",
        ],
      },
    ],
  },
  {
    slug: "military-3d-battlefield-mapping",
    title: "3D Battlefield Mapping for a Front-Line Defense Operation",
    org: "ROKA, KCTC Exercise",
    period: "2022",
    location: "Injae, Korea",
    phase: "Basic",
    domains: ["Military"],
    images: ["/images/projects/military-3d-battlefield-mapping.jpg"],
    brief:
      "Turned a dense-forest front-line area no one could read from 2D maps into a physical clay terrain model and 3D-mapped training tool, ahead of a live defense operation.",
    role: "Company Commander, operational planning",
    outcome: [
      "6-day operation, 15 simulated ambushes encountered",
      "Executed a deception command-post role for the neighboring brigade during the final defense operation",
      "33% survival rate against a tank assault, attributed directly to terrain-familiarization training",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Trench placement and coordinated response depended on soldiers actually understanding the terrain — dense forest that foot reconnaissance alone couldn't teach, and 2D operational maps most soldiers couldn't read fluently. Without that shared mental model, predicting enemy infiltration routes and reacting together was close to impossible.",
        ],
      },
      {
        heading: "Process",
        body: [
          "During pre-operation prep, I ran foot reconnaissance and built a clay terrain prototype to choose trench locations and likely infiltration routes. I then digitized that into a 3D map and used it to run simulation-based training on expected enemy movement and response — the digitized materials themselves couldn't be photographed under military regulations.",
        ],
      },
      {
        heading: "Result",
        body: [
          "Across the 6-day operation we handled 15 ambush scenarios, and in the final defense operation acted as a deception command post for the nearby brigade. Despite a tank assault, terrain-familiarization training got us a 33% survival rate. This is the direct, lived origin of the war-game simulation concept I'm now developing on the Research side.",
        ],
      },
    ],
  },
  {
    slug: "veterans-reintegration",
    title: "Supporting Systems for Veterans' Social Reintegration",
    org: "Federation of Korea ROTC 60th Officer",
    period: "2022 – Present",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Military"],
    images: ["/images/projects/veterans-reintegration.jpg"],
    brief:
      "Built employment and healthcare support infrastructure for 3,561 discharging ROTC officers, from scratch, as founding president.",
    role: "Founder & President",
    outcome: [
      "Represent 3,561 ROTC 60th officers",
      "Joint job fair with Shinhan Financial Group; recruitment partnerships with KB Kookmin Bank and E-Land",
      "Hospital partnerships offering discharged officers and their families 15–20% discounts across ophthalmology, dermatology, plastic surgery, and dentistry",
      "A rolling recruitment pool with small/mid-size companies run by senior discharged officers",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "ROTC officers discharge around age 26–28 — exactly when peers are deep into job hunting — but years of military focus leave most unprepared to compete. That's worse for those on front-line postings, where managing real provocations leaves no time to prepare for civilian life. Alumni networks like this used to exist and mostly don't anymore.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "As founding president of the Federation of Korea ROTC 60th Officer, I partnered with companies like E-Land and KB Kookmin Bank to activate recruitment programs for discharged officers, and organized a joint job fair with Shinhan Financial Group across their banking, card, and insurance divisions.",
          "I also built healthcare partnerships — cold-emailing hospitals directly to secure discount agreements for officers and their families — and, with senior officers who now run their own companies, set up an ongoing recruitment pool for discharging members at small and mid-size firms.",
        ],
      },
    ],
  },
  {
    slug: "saihst-hospital-metaverse",
    title: "App-Based Rehabilitation & Welfare Services for Hospitalized Patients",
    org: "SAIHST · Samsung Advanced Institute of Health Science & Technology",
    period: "2024 – 2025",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Disability & Healthcare"],
    images: ["/images/projects/saihst-hospital-metaverse.jpg"],
    brief:
      "Designed UI/UX for a hospital super app and prototyped a collaborative, gamified rehabilitation service for Samsung Seoul Hospital's long-stay patients.",
    role: "UI/UX design, service prototyping",
    outcome: [
      "Full UI/UX for an integrated hospital super app, planned for a 2025 launch",
      "A collaborative artwork rehabilitation concept scoped for inclusion in the same app",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Consistent movement is essential to post-surgery rehabilitation, but patients rarely do it voluntarily and there was no real way to track their progress. Long, solitary hospital stays also weigh on how patients experience the hospital itself — and existing welfare services were hard to discover and use while unwell.",
        ],
      },
      {
        heading: "Process",
        body: [
          "I interviewed patients to map rehab schedules, daily routines, and movement patterns, then categorized existing hospital services into an app-based structure with a domain for measuring patient activity. For rehab itself, I prototyped a collaborative-artwork concept in Unity and Magma: patients find tags placed around the hospital as they move (rehab framed as a treasure hunt), each tag yielding a puzzle piece, and pieces from multiple patients combine into one shared artwork.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The project closed at the concept-and-prototype stage rather than full implementation, with the super app itself planned for a 2025 launch and the artwork service discussed as additional content for it.",
        ],
      },
    ],
  },
  {
    slug: "disability-as-market",
    title: "Disability Service Design: What I Truly Wish to Carve Out",
    org: "Personal research essay + National Rehabilitation Center fieldwork",
    period: "2023 – 2024",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Disability & Healthcare"],
    images: ["/images/projects/disability-as-market.jpg"],
    brief:
      "The essay where I first argued disability should be approached as a market-expansion strategy, not only a welfare issue — the direct origin of my thesis and my current research direction.",
    role: "Author; later, field researcher at NRC",
    outcome: [
      "Published as a chapter in a 2023 cross-disciplinary social-trends book",
      "Directly shaped the National Rehabilitation Center fieldwork, which became my graduate thesis",
    ],
    sections: [
      {
        heading: "Beginning",
        body: [
          "My younger sibling's developmental disability made 'how do we meaningfully improve the lives of people with disabilities' a mission for me early on. Studying service design and business convinced me this belongs in the market, not only in welfare — and broadened into a wider interest in designing for the vulnerable.",
          "In 2023 I contributed a chapter to a publication project bringing together graduate students from law, statistics, biotech, and service design, each writing on trends in their own field. I argued for reframing disability as a market-expansion strategy rather than only a welfare category — and, in the same piece, predicted the AirPods 4 would add hearing-aid functionality, which later happened in a similar direction.",
        ],
      },
      {
        heading: "The framework",
        body: [
          "I read traditional disability approaches through the Kano model: Must-be Quality (dissatisfaction if unmet) maps to Universal Design; One-dimensional Quality (satisfaction scales with performance) maps to Assistive Technology. What was missing was the Attractive Quality layer — value beyond raw performance — which I placed squarely in service design's territory, and the one genuinely strategic, market-facing lever.",
          "The Bradley Timepiece — a tactile watch for blind users, funded via a $600K Kickstarter in 2013 — is the case I kept coming back to: 98% of its sales now come from non-disabled customers. It's the clearest example I know of a disability-specific need becoming a mainstream want.",
        ],
      },
      {
        heading: "Testing it",
        body: [
          "To test the hypothesis, I joined an internal National Rehabilitation Center project observing and interviewing people with developmental disabilities, stroke, and spinal cord injuries about their daily needs. My role there included commercialization strategy for proposed technologies and exploring how they might extend to non-disabled users — and this fieldwork is what turned directly into my graduate thesis on data-driven disability personas.",
        ],
      },
    ],
  },
  {
    slug: "deepbridge-startup",
    title: "DeepBridge — Regular Customer Management AI Tool",
    org: "DeepBridge (own startup)",
    period: "2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Startup & Venture"],
    brief:
      "My first real startup attempt — a CCTV+POS customer-loyalty tool that unexpectedly won a university incubation slot, cut short by mandatory military service.",
    role: "Founder & President",
    outcome: [
      "Selected for SKKU's campus-town startup incubation program (funding + education)",
      "Signed MOUs with local shop owners in the surrounding commercial district",
      "Wound down after ~6 months when military service began",
    ],
    sections: [
      {
        heading: "The idea",
        body: [
          "Customers feel like they haven't visited in a while; owners see the same faces daily and can't calibrate to that gap — and that mismatch is where customers quietly churn. Customers, in turn, feel like their own preferences and visit history are never really remembered. We combined in-store CCTV and POS data to build two things: a loyalty-management tool for owners (who's coming back, and how often), and a personalized 'food map' service for customers based on their own taste profile.",
        ],
      },
      {
        heading: "What happened",
        body: [
          "I entered what I thought was a business-plan competition with three teammates a week before the deadline. It turned out to be a university startup-school selection process — we were accepted into the campus-town incubation program, with real funding and education attached. Over about six months we completed the startup curriculum, built a prototype, and signed MOUs with shop owners in the area. Mandatory military service started in March 2022, cutting the run short before it could go further.",
        ],
      },
    ],
  },

  // ---------------- DATA-DRIVEN ----------------
  {
    slug: "starfield-existing-branch",
    title: "Data-Driven Branding for Existing Starfield Branches",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/projects/starfield-existing-branch.jpg"],
    brief:
      "My first SDI Lab project — quantified mall-branch 'fandom' from Instagram and card data to guide new F&B brand placement.",
    role: "Data analysis, visualization, social-media collection & NLP (early role: assisting a senior teammate while learning to code)",
    outcome: [
      "Identified F&B brands to strengthen brand image at existing malls",
      "Proposed route guidance integrating those brands into existing customer journeys",
      "Strategies adopted and actively implemented at existing branches",
    ],
    sections: [
      {
        heading: "Research model",
        body: [
          "We combined four frameworks: graph theory to treat mall 'fandom' as a collective, data-driven behavior rather than an individual-level trait (a Networking Persona model, scored on Average Degree, Average Weighted Degree, and Modularity); a growth-model analysis to track how networking patterns shift over time; Aaker's Brand Personality Model applied to social-media hashtags per branch and brand; and process mining to reconstruct actual customer journeys, including F&B stops.",
        ],
      },
      {
        heading: "Process",
        body: [
          "I crawled Instagram data from real Starfield visitors and classified photos/hashtags into a brand-personality framework, then extended the analysis to card-transaction data for network personas and process mining. This was my first lab project and I was still learning to code — a teammate led the technical implementation while I supported and learned alongside them.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The combined customer-characteristic, expectation, and movement-path data let us define target personas per branch, select the F&B brands they'd respond to, and propose guidance and CX strategies to integrate them into existing customer journeys — adopted and running at existing branches.",
        ],
      },
    ],
  },
  {
    slug: "samsung-brand-fandom",
    title: "Brand Fandom Analysis: Samsung vs. Competitor",
    org: "Samsung Electronics, Household Appliance Division (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/projects/samsung-brand-fandom.jpg"],
    brief:
      "Gave Samsung's appliance executives their first quantitative read on why they felt they were losing brand-power ground to LG.",
    role: "Data analysis, visualization",
    outcome: [
      "Defined standardized brand-personality metrics where previously only sales data existed",
      "Segmented customers into a Fan/Owner matrix with tailored conversion strategies",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "Samsung's appliance executives sensed they were losing branding ground to LG but had no quantitative way to evaluate branding performance — only sales figures. The brief was to define standardized metrics for brand status and competitiveness.",
        ],
      },
      {
        heading: "Process",
        body: [
          "I crawled and cleaned online community discussion data for both brands, classified it against Aaker's Brand Personality Model, and ran social network analysis where the source node was the discussion origin and edges reflected mention frequency — a proxy for marketing power. I then segmented customers into a 2×2 Fan/Owner matrix and used process mining to surface frequently mentioned keyword sequences per brand and segment.",
        ],
      },
      {
        heading: "Result",
        body: [
          "We proposed a strategy to convert customers into both Fans and Owners, tailored to each segment's dominant brand personality and language. This analysis fed a separate paper by a senior PhD labmate ('Brand Fandom Dynamic Analysis Framework Based on Customer Data in Online Communities') — I contributed as an undergraduate researcher without formal co-authorship.",
        ],
      },
    ],
  },
  {
    slug: "samsung-lifelog-minifridge",
    title: "Life-Log Analysis for a New Mini-Fridge Product Line",
    org: "Samsung Electronics, Household Appliance Division (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/projects/samsung-lifelog-minifridge.jpg"],
    brief:
      "Mapped daily household behavior onto real floor plans to find where a new mini-fridge line actually belonged in people's homes.",
    role: "Data analysis, visualization (joined in the project's later stage)",
    outcome: [
      "Persona-specific placement and subscription strategies for the mini-fridge line",
      "e.g., runners → sports drinks/energy bars; wine drinkers → curated alcohol — each tied to a specific room",
    ],
    sections: [
      {
        heading: "Goal & process",
        body: [
          "The goal was straightforward: grow sales of the client's new mini-fridge. I joined after personas and preferred brands were already defined from earlier analysis, so my job was quantifying how customers actually live inside their homes — where, and how their days move.",
          "Participants kept diaries of when, where, and what they did at home. I used social network analysis to define key household domains (kitchen, living room, etc.) and process mining, per persona, to trace weekday/weekend routines — how long they stayed where, and in what sequence — then overlaid both on real home floor plans.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The visualized patterns let us propose service scenarios placing the product directly into each persona's routine — for example, a runner's fridge stocked with sports drinks and energy bars, or a wine enthusiast's fridge positioned and stocked accordingly.",
        ],
      },
    ],
  },
  {
    slug: "samsung-raemian-metaverse",
    title: "Metaverse Digital-Twin Prototyping for a Luxury Residence",
    org: "Raemian, Samsung C&T (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/projects/samsung-raemian-metaverse.jpg"],
    brief:
      "Designed metaverse resident services for a premium apartment brand by combining housing-quality theory with Prof. Choi Jae-bung's 'Phono Sapiens' model.",
    role: "Service scenario development, prototyping, student-team mentoring",
    outcome: [
      "Three prototyped and demoed scenarios: a digital flea market using parking space, an event-based walking experience, and community-center information sharing",
    ],
    sections: [
      {
        heading: "Goal & research model",
        body: [
          "For a premium residential brand, value beyond land and construction cost needed to come from an expansive digital-twin experience for residents. I combined prior research on residential-quality factors with Prof. Choi Jae-bung's Phono Sapiens model to design a content strategy, then plotted housing-related verbal data on a heatmap — architecture-based factors on one axis, Phono Sapiens factors on the other.",
        ],
      },
      {
        heading: "Process & result",
        body: [
          "I mentored an undergraduate team building the prototypes on Zepeto and Unity — developing scenarios myself and guiding the student who led implementation — then used my GRU network to run prototype evaluations and produce demo videos: a digital flea market using parking space, an event-based walking experience, and a community-center information-sharing scenario.",
        ],
      },
    ],
  },
  {
    slug: "starfield-new-branch-1",
    title: "Predicting Customer Personas for a New Starfield Branch (#1)",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021 – 2025",
    location: "Changwon, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/projects/starfield-new-branch-1.jpg"],
    brief:
      "Predicted who would actually shop a not-yet-built mall branch, and what they'd want, from card and demographic data alone.",
    role: "Demographic analysis, persona design",
    outcome: [
      "Six representative personas across four clusters",
      "Seven service strategies proposed and adopted into the branch's operating strategy while it was still under construction",
    ],
    sections: [
      {
        heading: "Research model & process",
        body: [
          "With no branch open yet to observe, I combined social network analysis of customer card data with public demographic, mobility, and geography data — using the SQAM model to classify and define collective behavior at the planned site. This surfaced six representative personas across four clusters, and social-media post density pinpointed likely hot spots, which I reclassified under SQAM and cross-referenced against which persona-purposes drove visits to each location type — for instance, heavy 'Queue'-type visits tied to daily-convenience purposes.",
        ],
      },
      {
        heading: "Result",
        body: [
          "From this, we designed the location types and services each persona would expect and proposed seven service strategies — adopted into the operating strategy for the branch while it was still under construction.",
        ],
      },
    ],
  },
  {
    slug: "starfield-new-branch-2",
    title: "Predicting Customer Personas for a New Starfield Branch (#2)",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021 – 2025",
    location: "Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/projects/starfield-new-branch-2.jpg"],
    brief:
      "A second new-branch prediction project, this time pairing the quantitative model with direct persona interviews.",
    role: "Demographic analysis, persona design",
    outcome: [
      "Four personas derived from nine identified commercial districts",
      "Proposed CX strategies adopted and now running at the newly opened branch",
    ],
    sections: [
      {
        heading: "Research model",
        body: [
          "Unlike the first new-branch project, this one paired quantitative persona definition (who, how, and what attitude) with qualitative interviews, structured around the SQAM model and psychographic scales from prior research.",
        ],
      },
      {
        heading: "Process",
        body: [
          "Using mobility and social-post data, I identified nine key commercial districts around the site, then consolidated them into three larger district types and derived four district-based personas. I interviewed representative participants for each — where they go, what they do there, why — coded the results against SQAM, and reclassified the experience descriptions using psychographic scales, visualized on a heatmap to surface an integrated persona of the area's residents.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The resulting customer-experience strategies were adopted and are actively running at the newly opened branch.",
        ],
      },
    ],
  },

  // ---------------- AI-DRIVEN ----------------
  {
    slug: "vip-concierge-robot",
    title: "VIP Concierge Robot: Service Design for a Presidential Office",
    org: "Sungkyunkwan University President's Office (via SDI Lab)",
    period: "Oct. 2024 – Jun. 2025",
    location: "Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Public Sector", "Robotics & AI"],
    images: ["/images/projects/vip-concierge-robot-1.jpg", "/images/projects/vip-concierge-robot-2.jpg", "/images/projects/vip-concierge-robot-3.jpg"],
    brief:
      "Turned a royal-court induction ceremony from the Joseon dynasty into the interaction design for three serving robots greeting VIP guests — not on my resume, only surfaced once I audited this site.",
    role: "Service design, human-robot interaction design, cross-lab coordination",
    outcome: [
      "Three serving robots deployed and in active operation in the President's Office",
      "Became the clearest 'wow point' of the guest experience there",
      "Sparked my ongoing interest in human-robot interaction as a research direction",
    ],
    sections: [
      {
        heading: "How it reached me",
        body: [
          "Prof. Choi Jae-bung (the Phono Sapiens theorist behind the Raemian metaverse project, and concurrently SKKU's vice president) had the university president's request routed through him to my advisor, and from there to me. I led overall service design; SKKU's Mechanical Engineering robotics lab handled the physical robot build.",
        ],
      },
      {
        heading: "Process",
        body: [
          "I interviewed secretarial staff, the university president, and past VIP visitors: staff wanted their three core tasks (welcome/hosting, guided explanation, refreshment service) partly automated; the president wanted the university's heritage reflected; VIPs wanted something memorable.",
          "The concept drew on 'The Prince's Entrance Ceremony,' a historical painting depicting the six ceremonial stages a Joseon crown prince underwent entering Sungkyunkwan — guests became visiting 'crown princes,' the president the 'royal mentor,' and the service system (including the robots) the attending court. That reframing yielded three personas — Scholar, Court Servant, Court Lady — which shaped both the interaction flow and the three robots' distinct roles.",
          "I scanned the President's Office to map circulation paths, assigned each robot a functional route (photo-taking, guided explanation, beverage service), and worked with the robotics lab to implement AI-driven interaction, guided-tour video, and expression displays — plus custom housing designed around each robot's persona.",
        ],
      },
      {
        heading: "Result",
        body: [
          "All three robots are deployed and operating, and this project is what pulled me toward human-robot interaction as a research interest I'm still pursuing.",
        ],
      },
    ],
  },
  {
    slug: "manufacturing-worker-training-ai",
    title: "AI Training Tool for Wire-Harness Assembly Workers",
    org: "Co-research with a labmate, at a manufacturing partner in Weihai, China",
    period: "2025 –",
    location: "Weihai, China / Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Robotics & AI", "Corporate Strategy"],
    images: ["/images/projects/manufacturing-worker-training-ai-1.jpg", "/images/projects/manufacturing-worker-training-ai-2.jpg"],
    brief:
      "Digitizing workers instead of machines, in a labor-intensive process too manual for a traditional digital twin — now an AI tool that pinpoints exactly where a finished wire harness went wrong.",
    role: "Overall research design and supervision (co-research with a labmate handling implementation and authorship)",
    outcome: [
      "A working AI tool that traces defects in a finished wire harness back to the exact assembly stage that caused them — complete",
      "A second paper on which coaching interventions best speed novice-to-skilled progression — in progress, targeted for late 2026",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Wire-harness assembly — a core automotive-electronics component — is too manual and non-automatable for a full digital twin. New workers need to reach proficiency fast, but there usually isn't a skilled worker free to watch each one and correct mistakes in real time. Each product runs through wire cutting, connector insertion, functional testing, and taping/final assembly, with 20+ connector types per product and three-person teams per stage — so how a team is composed changes lead time significantly.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "We ran a controlled comparison at a real factory: one group of new workers practiced with no assistance, another was coached by a skilled worker, and we tracked both groups' skill-acquisition curves. The first deliverable — complete — is a working AI system that traces a finished harness back to the specific stage and cause of a defect. The second, now being written, asks a sharper question: given the repeating patterns of trial-and-error we saw in the novice-to-skilled transition, which coaching interventions actually work.",
        ],
      },
      {
        heading: "My role",
        body: [
          "This is a co-research project with a labmate whose graduating paper this is — I set the overall research direction and supervise, while he owns the implementation and writing. The published portfolio site described an earlier version of this project (persona-based optimal worker placement); the direction above reflects where the research actually stands now.",
        ],
      },
    ],
  },
  {
    slug: "samsung-ax-dashboard",
    title: "Enterprise Demand Dashboard & AI Chatbot (AX Project)",
    org: "Samsung Electronics · Digital Appliances Division",
    period: "Jul. 2025 – Jul. 2026",
    location: "Suwon, Korea",
    phase: "AI-Driven",
    domains: ["Corporate Strategy", "Robotics & AI"],
    brief:
      "Built a self-serve demand-intelligence tool solo, via vibe coding, reconciling data across CMI and every regional sales org for leadership decision-making.",
    role: "Sole builder (vibe coding); cross-team data reconciliation",
    outcome: [
      "Rolling 5-year-ahead demand projections through 2030, built on 2017–2025 GfK/Euromonitor/BSRIA historical data",
      "Prototype reviewed directly by sales leadership and executives",
    ],
    sections: [
      {
        heading: "Context",
        body: [
          "I joined Samsung's Digital Appliances Division as a marketer, aiming for early-stage product planning — but was routed into Consumer Market Insight because of my data science background. Within CMI, I ended up on the Business Analysis side, aggregating GfK/Euromonitor/BSRIA data into rolling demand projections by product and country — work that's normally closer to a sales function, but landed on me anyway.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "Rather than requesting an engineering or design build, I built the dashboard and an accompanying AI chatbot myself, using AI-assisted (vibe) coding — aggregating and reconciling demand data across CMI and the different sales organizations (retail, subscription, online, B2B) plus regional sales (RPM), and giving leadership self-serve access instead of one-off requests. I presented the working prototype to sales leadership and executives for evaluation.",
        ],
      },
    ],
  },
  {
    slug: "samsung-bixby-cooking-assistant",
    title: "Bixby-Powered Cooking Assistant for Screen-Based Appliances",
    org: "Samsung Electronics · Digital Appliances Division",
    period: "Jul. 2025 – Jul. 2026",
    location: "Suwon, Korea",
    phase: "AI-Driven",
    domains: ["Corporate Strategy", "Robotics & AI"],
    brief:
      "Found the real reason a screen-based fridge wasn't earning its screen, and proposed a hands-free voice service instead — since adopted as an official product initiative.",
    role: "Concept design & proposal",
    outcome: [
      "Adopted as an official product-development initiative for Family Hub refrigerators",
    ],
    sections: [
      {
        heading: "Insight",
        body: [
          "A new-hire product-concept assignment asked: what is the screen on a Family Hub fridge actually for? Watching how people cook answered it — while chopping or stirring, people usually have their backs to the fridge and barely look at its screen at all.",
        ],
      },
      {
        heading: "Proposal",
        body: [
          "I proposed a Bixby-powered cooking assistant: register a recipe on the fridge, and it becomes a voice-driven cooking companion that walks you through the next step hands-free, even with your back turned and hands full. It got noticed by a company executive and was adopted as an official product-development initiative — I wasn't involved in the later implementation.",
        ],
      },
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
  "Robotics & AI",
];

export const allPhases: Phase[] = ["Basic", "Data-Driven", "AI-Driven"];
