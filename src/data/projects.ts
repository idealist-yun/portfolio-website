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
  note?: string;
};

export const projects: Project[] = [
  // ---------------- BASIC ----------------
  {
    slug: "undergraduate-works",
    title: "Undergraduate Works",
    org: "GRU (Start-up Strategic Consulting Club), Sungkyunkwan University",
    period: "2020 – 2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Startup & Venture"],
    images: ["/images/cards/undergraduate-works.jpg", "/images/projects/undergraduate-works.jpg"],
    brief:
      "After being introduced to design thinking, founded a student club to practice and apply design-thinking methodologies in real projects.",
    role: "President, Team leader",
    outcome: [
      "Enhanced design-thinking capabilities across diverse domains, including finance, beauty, travel, and home appliances.",
    ],
    sections: [
      {
        heading: "Why",
        body: [
          "“To achieve universal relevance, you must think from the perspective of the majority, but true innovation happens when you think as an outlier. Become an outlier. Innovation begins there.”",
          "When I first entered university, I had no idea how to live my life. It was a journey of constantly seeking ways to design my future self.",
          "That all changed when I met a professor who introduced me to design thinking. He encouraged me to become an outlier. For the first time, I began to envision my future self—a Designated Persona—and I committed myself fully to shaping it. From that point on, my undergraduate years became an intense yet enjoyable journey.",
          "Driven by a desire to strengthen my design thinking skills, I actively sought out opportunities. The very first thing I did was organize a service-design club called GRU, bringing together students who shared an interest in design thinking.",
        ],
      },
      {
        heading: "What",
        body: [
          "With GRU, we conducted strategy consulting projects for startups across various industries:",
          "Designed content-based business models for an education startup",
          "Planned an app service for a travel-tech startup",
          "Organized a community festival for a co-living / co-working startup",
          "Proposed a character-based branding ecosystem for a shared e-scooter company",
          "These achievements helped GRU gain official recognition as a university-approved club. Since then, it has continued for more than five consecutive years, with new students carrying forward the organization and its mission.",
          "If you'd like to explore more of GRU's work: skku-startup-gru.net, Instagram @skku_gru",
          "Beyond GRU, I also worked on multiple toy projects throughout my undergraduate years. These ranged from designing new services for Samsung Bespoke and developing public health solutions, to creating mobile securities applications and customer loyalty services for small businesses.",
          "Among the projects that received awards, the following stand out:",
          "Samsung Home Appliance Award (1st Place): Designed a new subscription service and business model linking the Samsung Qooker to food-delivery ecosystems.",
          "Mirae Asset Securities Challenge (3rd Place): Developed an NLP-based easy search and stock-recommendation feature for a mobile trading system (MTS).",
          "Sungkyunkwan University Design Competition (2nd Place): Designed and prototyped a public-hygiene solution: an antibacterial handle-sanitizing device for shared bicycles during COVID-19.",
          "Through these diverse experiences, I steadily strengthened my capabilities in design thinking, learning how to frame problems, generate solutions, and prototype ideas across different domains.",
        ],
      },
    ],
  },
  {
    slug: "mcst-public-communication",
    title: "Ministry of Culture, Sports and Tourism - Public Communication Strategy Design",
    org: "Ministry of Culture, Sports and Tourism (via SDI Lab, GRU students)",
    period: "2021",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Public Sector"],
    images: ["/images/cards/mcst-public-communication.jpg", "/images/projects/mcst-public-communication.jpg"],
    brief:
      "Operation of a participatory policy communication lab and monitoring group for digital government branding",
    role: "Data Analysis, Visualization, and student management and operation",
    outcome: [
      "In the case of participatory government activities by the monitoring group, results showed high levels of digital literacy and satisfaction among citizens",
      "Evidence was gathered supporting the need for ongoing education based on data-driven evidence and an understanding of data context.",
      "The initiative was selected as an OECD best practice, leading to an actual presentation.",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "Under the OECD models of 'Open Government' and 'Public Communication,' public governance needs to shift from a one-way, asymmetric communication aimed at persuading citizens, to a two-way, symmetrical mode of participation and collaboration. We proposed and tested an educational strategy framework to strengthen these capabilities.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To design the educational model, we researched the fundamental concepts, principles, and policies of OECD's open government and public communication. Based on this, we reinterpreted the six key innovation strategies for public communication in future governments, as outlined by OECD, into an educational strategy to realize the values of open government policies.",
        ],
      },
      {
        heading: "Process",
        body: [
          "To apply and test the reinterpreted educational strategy framework, we planned to operate a participatory living lab for public officials engaged in public communication tasks. To facilitate experimentation with citizen engagement, we decided to organize a student monitoring group consisting of individuals in their early 20s. In this process, I involved the club I managed, 'GRU,' in the experiment. Consequently, I also took responsibility for the overall management of the students.",
          "To design the experiment, we analyzed exploratory context data by utilizing promotional materials previously posted on the government's social media platforms. Based on this analysis, we redefined hashtags to reflect the intended context that the government aimed to convey during the communication process and assigned them to each promotional material. Through this process, we successfully quantified qualitative data.",
          "The student monitoring group and public officials collaboratively conducted an experiment in the participatory living lab to redesign government promotional content. They performed card sorting on 100 government promotional materials with pre-designed context data, selecting those deemed meaningful. The context data of the selected cards were then analyzed using social network analysis to extract the contexts of information that are meaningfully conveyed to citizens.",
          "The student monitoring group and public officials collaboratively created new government promotional materials based on the visualized context data.",
          "As a result of citizens directly participating in and communicating during the production process, the outcomes received overall feedback highlighting improved clarity and better information delivery compared to previous materials. Furthermore, a subsequent citizen satisfaction survey demonstrated significant positive outcomes.",
        ],
      },
      {
        heading: "Result",
        body: [
          "This educational model was recognized as one of the best examples of OECD's Open Government and Public Communication initiatives. As a result, one of the student monitoring group members was invited to present these achievements.",
          "Furthermore, based on this education and experimentation, the Ministry of Culture, Sports, and Tourism is actively producing citizen-oriented and participatory content, such as those utilizing characters, and has received significantly better responses compared to previous efforts.",
        ],
      },
    ],
  },
  {
    slug: "military-3d-battlefield-mapping",
    title: "Military - 3D Battlefield Mapping",
    org: "ROKA, KCTC Exercise",
    period: "2022",
    location: "Injae, Korea",
    phase: "Basic",
    domains: ["Military"],
    images: ["/images/cards/military-3d-battlefield-mapping.jpg", "/images/projects/military-3d-battlefield-mapping.jpg"],
    brief:
      "Trained soldiers on terrain and implemented a 3D map for war games to ensure the success of the base defense operation during the KCTC exercise.",
    role: "Company Commander, responsible for operational planning",
    outcome: [
      "Implemented a terrain prototype and conducted training through digitization and visualization using 3D mapping.",
      "In a war game simulations, effectively improved the survival rate during operations.",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "To ensure the success of the border defense operation, it was crucial to carefully select the positions for soldiers' trenches and provide training to enable coordinated responses.",
          "The surrounding terrain is a dense forest, making it difficult for soldiers to familiarize themselves with the area through simple foot reconnaissance.",
          "Since the soldiers were not familiar with map reading, especially with 2D maps, it was challenging for them to understand the operational maps.",
          "Therefore, it was essential to help the soldiers understand the terrain and imagine potential enemy infiltration routes and movement, in order to increase their chances of survival.",
        ],
      },
      {
        heading: "Process",
        body: [
          "During the pre-operation preparation period, I conducted a foot reconnaissance and created a prototype using clay to select trench locations and potential enemy infiltration routes. Through 3D mapping and digitization, I visualized the terrain for the soldiers, providing simulation-based training on expected enemy movements and response strategies.",
          "* The digitalized materials could not be photographed due to military regulations",
        ],
      },
      {
        heading: "Result",
        body: [
          "During the 6-day operation, we encountered 15 ambushes. In the final defense operation, we executed a deceptive command post role for the nearby brigade command center.",
          "Thanks to the terrain familiarization training using the terrain model, we were able to respond effectively. Despite the tank assault, we achieved a 33% survival rate.",
        ],
      },
    ],
  },
  {
    slug: "veterans-reintegration",
    title: "Military - Supporting System for Veterans and Former Officers' Social Reintegration",
    org: "Federation of Korea ROTC 60th Officer",
    period: "2022 – Present",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Military"],
    images: ["/images/cards/veterans-reintegration.jpg", "/images/projects/veterans-reintegration.jpg"],
    brief:
      "Provided a service for supporting employment, healthcare, and other resources to assist the social reintegration of ROTC veterans.",
    role: "President, responsible for policy development and organizational governance",
    outcome: [
      "Promoted and enhanced discharge officer recruitment programs in collaboration with major corporations",
      "Hosted a job fair in partnership with Shinhan Financial group",
      "Activated a rolling recruitment pool with mid-sized and small enterprises, for discharged officers",
      "Secured hospital partnership services for discharged officers and their families",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "ROTC officers typically enlist at ages 24–26 and discharge at ages 26–28, which coincides with the typical period for young adults entering the workforce.",
          "However, due to their focus on military service, they are often unprepared for job searching and face challenges in competing with others who have been preparing for employment.",
          "This issue is especially prevalent among officers deployed to frontline positions, where enemy provocations, managing their threats, and overseeing unit operations make it difficult to prepare for post-service life.",
          "While recruitment programs for veterans existed in the past, such programs are now rare, necessitating support mechanisms for their reintegration into civilian careers.",
        ],
      },
      {
        heading: "Result",
        body: [
          "As the founder and president of the Federation of Korea ROTC 60th Officers, representing 3,561 officers of the ROTC 60th, I collaborated with organizations such as E-land and KB Kookmin Bank to promote and activate recruitment programs for discharged officers. Also, I led collaboration with senior discharged officers to create a continuous recruitment pool for companies they operate.",
          "Specifically, in partnership with Shinhan Financial Group, organized a joint job fair by consulting with various departments, including banking, cards, and insurance.",
          "In addition, I also established partnerships with hospitals to offer benefits to discharged officers and their families, securing agreements with healthcare providers.",
        ],
      },
    ],
  },
  {
    slug: "saihst-hospital-metaverse",
    title: "Hospital – Planning App-Based Services and Contents for Hospitalized Patients",
    org: "SAIHST · Samsung Advanced Institute of Health Science & Technology",
    period: "2024 – 2025",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Disability & Healthcare"],
    images: ["/images/cards/saihst-hospital-metaverse.jpg", "/images/projects/saihst-hospital-metaverse.jpg"],
    brief:
      "By using metaverse service, planning rehabilitation and welfare-oriented services, especially collaborative artwork, for hospitalized patients.",
    role: "UI/UX Design, Service Prototyping",
    outcome: [
      "The super app is scheduled for launch in 2025",
      "The collaborative artwork service is also planned to be integrated into the super app",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Consistent exercise is essential for rehabilitation after patient admission and surgery, yet patients often do not engage in it voluntarily, and there is a lack of systems to measure rehabilitation progress.",
          "The monotonous and solitary time patients endure during their hospital stay can also influence the hospital's overall image.",
          "Although many services are provided for patient welfare, it is challenging for patients to explore and utilize these services during their hospital stay due to their health conditions.",
        ],
      },
      {
        heading: "Process",
        body: [
          "Conducted patient interviews to understand rehabilitation schedules, daily routines, and movement patterns",
          "Categorized hospital-provided services and implement them into app-based service",
          "Designed a domain capable of measuring patient activity levels",
          "Develop and implement programs to promote and enhance patient rehabilitation, with a focus on UI/UX design",
          "Prototype a collaborative artwork service on the metaverse using tools such as Unity and Magma",
        ],
      },
      {
        heading: "Result",
        body: [
          "Developing UI/UX design for an integrated hospital service experience, with collaborative artwork services being discussed as additional content. The project is still ongoing.",
        ],
      },
    ],
  },
  {
    slug: "disability-as-market",
    title: "Disability Service Design: What I Truly Wish to Carve Out!",
    org: "Personal research essay + National Rehabilitation Center fieldwork",
    period: "2023 – 2024",
    location: "Seoul, Korea",
    phase: "Basic",
    domains: ["Disability & Healthcare"],
    images: ["/images/cards/disability-as-market.jpg", "/images/projects/disability-as-market.jpg"],
    brief:
      "Participated in a research initiative led by the National Rehabilitation Center, focusing on disability progression in an aging society. I later extended this work by connecting it to a graduate-level hackathon project at Sungkyunkwan University.",
    role: "Research Assistant",
    outcome: [
      "Developed daily-life Customer Journey Maps (CJMs) for three disability groups—developmental disabilities, stroke, and spinal cord injuries—and designed solution concepts based on these insights.",
      "This project later evolved into my graduate thesis.",
    ],
    sections: [
      {
        heading: "Beginning",
        body: [
          "Due to my younger sibling's developmental disability, I defined it as my mission to address issues such as improving the lives of people with disabilities and alleviating the guilt felt by their families. Through studying service design and business, I came to believe that these issues should be approached within the realm of the market. Over time, various experiences broadened my perspective to include designing for the vulnerable as a whole.",
          "While contemplating how to integrate service design with disability-related fields in my career, I had the opportunity in 2023 to participate in a publication project. This project brought together graduate students from diverse fields, including law, statistics, biotechnology, and service design, to discuss social trends within their respective disciplines.",
          "In my contribution, I explored the concept of approaching disability not merely from a welfare perspective, but as a market expansion strategy. Through this process, I refined my perspective and, in particular, predicted that the newly released AirPods 4 would incorporate hearing aid functionality.",
        ],
      },
      {
        heading: "Assumption",
        body: [
          "Based on this idea, I developed a hypothesis grounded in the Kano model. When interpreting traditional approaches to disability through the lens of the Kano model, I found that Must-be Quality, which refers to the minimum requirements that cause dissatisfaction if unmet, can be associated with Universal Design. Similarly, One-dimensional Quality, where satisfaction increases proportionally with performance improvement, aligns with Assistive Technology.",
          "Ultimately, I realized the need for something that had been previously overlooked—an element that provides satisfaction beyond mere performance and serves as an attractive factor. I concluded that this corresponds to the domain of service design, which offers a strategic approach within the market.",
        ],
      },
      {
        heading: "Example: Bradley Timepiece",
        body: [
          "The Bradley Timepiece is a tactile luxury watch designed to meet the needs of individuals with visual impairments, allowing them to “feel” the time through movable ball bearings. Inspired by the drawbacks of conventional talking watches, which often draw unwanted attention in public spaces, the Bradley introduces an innovative “touchable watch” concept.",
          "This project began with a successful Kickstarter campaign in 2013, raising $600,000 in its initial funding. Since then, the company has continued to thrive, with 98% of its sales coming from non-disabled customers. This serves as an excellent example of transforming the needs of individuals with disabilities into the wants of the general market.",
        ],
      },
      {
        heading: "My Trial",
        body: [
          "Based on this hypothesis, I participated in an internal project at the Korean National Rehabilitation Center to better understand the daily lives and needs of individuals with disabilities.",
          "The project involved observing and interviewing individuals with developmental disabilities, stroke, and spinal cord injuries. By applying the service design process, we identified their needs and worked on selecting and developing technologies to address their challenges.",
          "In this project, I was responsible for strategizing the commercialization of the proposed technologies and products, as well as exploring their potential expansion to non-disabled users.",
          "Building on the success of the project, I planned and hosted a hackathon in collaboration with Sungkyunkwan University and the Korea National Rehabilitation Center. Through these ongoing activities, I continue to seek solutions in the fields of service design for individuals with disabilities and the broader design for the vulnerable.",
        ],
      },
    ],
  },
  // ---------------- DATA-DRIVEN ----------------
  {
    slug: "starfield-existing-branch",
    title: "Shinesegae Starfield - Data-driven Service Design for Existing Mega-Shopping Mall Branches",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/cards/starfield-existing-branch.jpg", "/images/projects/starfield-existing-branch.jpg"],
    brief:
      "Analyzed crowd characteristics at existing Starfield locations to design a new journey with F&B experiences",
    role: "Data Analysis, Visualization, Social Media data collection and NLP",
    outcome: [
      "Identified prominent F&B brands to enhance the shopping mall's brand image",
      "Proposed route guidance by integrating the selected F&B brands into the existing key customer journeys",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "As the client aimed to actively incorporate F&B brands in their existing malls, it became necessary to quantify customers' existing shopping mall experiences, journey patterns, and customer characteristics for each mall to design tailored services.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "We utilized four research frameworks in this project: Graph Theory, Networking Persona, Brand Personality, and Process Mining.",
          "First, by using network-graph theory, we defined fandom behavior in shopping mall spaces as subjective and collective activities from a data-driven perspective. The Networking Persona model transitioned traditional service design personas, analyzed at an individual level, into collective-level personas.",
          "To analyze networking personas with graph theory, we used three key metrics: Average Degree, Average Weighted Degree, and Modularity. Average Degree indicates how many brands a specific customer is connected to — more diverse brand visits result in a higher number of connections, and the line weight represents cumulative spending by the customer at each brand. Average Weighted Degree shows that when customers frequently and heavily spend at specific brands, cluster density increases, reflecting stronger customer-brand connections. Modularity measures how closely brands are grouped based on customer usage — higher modularity indicates closer connections between brand clusters, revealing patterns such as the Diderot Effect and hidden brand linkages.",
          "Second, the Networking Persona model was categorized into four strategies: Independent, Distributed, Integrated, and Centralized. To track the evolution of consumer networking patterns over time, we employed a growth model analysis to analyze temporal changes.",
          "Third, customer preferences and loyalty vary by shopping mall branch. To evaluate this, we applied Aaker's Brand Personality Model. By aggregating social media hashtags related to each branch and brand, we assessed customer experiences based on the five dimensions of brand personality. This analysis identifies the brand personalities preferred at each branch, enabling strategic brand replacements.",
          "Fourth, by using process mining techniques, we identified key customer journeys for each branch. By segmenting customers, we examined their specific journeys and tailored strategies accordingly. This approach facilitates redesigning customer journeys to enhance overall experiences.",
        ],
      },
      {
        heading: "Process",
        body: [
          "In order to analyze the customer experience in our client's shopping malls, we conducted an analysis of core brand clusters and the relationships between in-mall brands and customer purchases by using Power BI.",
          "As a result, the changes over time at each branch were analyzed and categorized based on their characteristics using the Networking Persona model. This allowed us to identify the tendency of customers at each shopping mall to gravitate toward specific brands over time.",
          "To analyze the emotions customers associate with the shopping mall, social media data was collected and processed using NLP techniques. The preprocessed data was categorized according to the Brand Personality domain, enabling the quantification of the personality traits customers attribute to each branch and specific brands.",
          "Additionally, process mining was used to analyze customer movement paths at each mall branch. Process mining was conducted at the customer segment level, allowing us to examine key journey paths, including F&B experiences.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The compiled information on customer characteristics, expectations, and movement paths for each branch was used to identify key target personas and their preferences. Based on these personas, we selected the brands they seek and proposed guidance strategies and CX enhancement strategies to integrate these brands into the existing customer journey.",
          "The proposed strategies were adopted and are now being actively implemented at existing branches.",
        ],
      },
    ],
    note: "Early lab-project role: I was still learning to code at this point, and mostly assisted a senior teammate who led the technical implementation.",
  },
  {
    slug: "samsung-brand-fandom",
    title: "Samsung - Brand Fandom Analysis Between Samsung and Competitor",
    org: "Samsung Electronics, Household Appliance Division (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/cards/samsung-brand-fandom.jpg", "/images/projects/samsung-brand-fandom.jpg"],
    brief:
      "Consulting on Samsung Electronics' Branding Strategy Through a Comparative Analysis of Home Appliance Branding Strategies with Competitors",
    role: "Data Analysis, Visualization",
    outcome: [
      "Identified the factors necessary to transform customers into fans and owners",
      "Proposed branding strategies based on the findings",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "There were no quantitative metrics to evaluate the branding performance of our client; relying solely on sales data to assess the effectiveness of their branding. In this context, we aimed to define standardized metrics to understand the company's branding status and enhance its competitiveness.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To quantify the branding status, we selected Aaker's Brand Personality Model as a framework. We collected speech data from online discussions about the client and competitor's products and brands, preprocessed the data, and reclassified it into the domains of brand personality. This allowed us to establish metrics for quantifying customer perceptions of the brand according to branding theory.",
          "Rather than stopping at quantitative evaluation, we used social network analysis to propose strategies utilizing brand personality based on graph theory. In this process, the source node represented the social network source where the discussions occurred, while the target node was assigned values from the preprocessed data mapped to brand personality traits. Consequently, the edges reflected the frequency of customer mentions about the brand or product, representing the marketing power of the brand.",
        ],
      },
      {
        heading: "Process",
        body: [
          "In order to assess the branding performance of our client and its main competitor, I crawled and collected verbal data from online communities regarding products and brands of the two firms. Using the data, we conducted data cleansing to filter meaningful consumer-generated data, excluding advertisements, comparisons, and price inquiries.",
          "Then we analyzed the texts for each brand and quantitatively compared them based on their brand personalities. By using Social Network Analysis, we identified and analyzed consumer clusters and their characteristics (e.g., key emotions, active communities), providing tailored marketing strategies.",
          "Then, we classified customer verbal data into a 2x2 matrix based on their favorability: Fan & Owner, and analyzed the characteristics of each category. Through this, we were able to not only classify each verbal source into brand personality domains but also examine them in detail based on whether the customer was a fan or an owner of the specific product or brand.",
          "Additionally, we used process mining to process verbal data. Through this, we identified frequently mentioned keywords and their sequences for each brand and product. Furthermore, we observed differing patterns based on whether the customer was a fan or an owner.",
        ],
      },
      {
        heading: "Result",
        body: [
          "Based on these insights, we proposed a strategy to ultimately convert all customers into both Fans and Owners. This strategy includes using key brand personalities and online verbal sources specific to each group, as well as utilizing the keywords and their sequences mentioned for each product and brand.",
        ],
      },
    ],
    note: "Vault addition (not on the original page): this analysis fed a separate paper by a senior PhD labmate, 'Brand Fandom Dynamic Analysis Framework Based on Customer Data in Online Communities' — I contributed as an undergraduate researcher without formal co-authorship.",
  },
  {
    slug: "samsung-lifelog-minifridge",
    title: "Samsung - Life-log Analysis for New Product Service Planning",
    org: "Samsung Electronics, Household Appliance Division (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/cards/samsung-lifelog-minifridge.jpg", "/images/projects/samsung-lifelog-minifridge.jpg"],
    brief:
      "Analyzed the current usage of home appliances and customer lifestyles to develop a scenario for Samsung Affiliate A's new product",
    role: "Data Analysis, Visualization",
    outcome: [
      "Analyzed customer daily lives using social network analysis, process mining, and heatmaps, and proposed service designs for customer products based on these insights",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "There was a need to increase the sales volume of the client's new product, the mini-fridge.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "As I joined the project in its later stages, personas and their preferred services and brands had already been identified through data analysis. Therefore, I focused on quantifying the daily living patterns of customers within their households to determine where the proposed products and services could integrate into their routines. To achieve this, I aimed to visualize the data using social network analysis and process mining.",
        ],
      },
      {
        heading: "Process",
        body: [
          "Participants in the experiment were asked to keep a diary documenting 'when,' 'where,' and 'what' activities they performed within their homes during daily life. Using these completed life-logs, we conducted data analysis and visualization.",
          "Through network analysis, we were able to gain clear insights into where and what actions participants performed. Based on this, we redefined key domains within the home (e.g., kitchen, living room).",
          "Additionally, process mining was conducted for each previously identified persona to examine their activities during weekdays and weekends. This allowed us to determine where they spent their time, how long they stayed in each location, and in what sequence, thereby identifying patterns in their daily routines.",
          "By combining these two analyses and visualizing the results on an actual home environment blueprint, we were able to clearly represent the daily patterns of individuals with greater clarity.",
        ],
      },
      {
        heading: "Result",
        body: [
          "The results were reviewed for each persona, and service scenarios were created and proposed to integrate our products and services into their daily patterns.",
        ],
      },
    ],
  },
  {
    slug: "samsung-raemian-metaverse",
    title: "Samsung - Metaverse-Based Service Prototyping for Digital Twin",
    org: "Raemian, Samsung C&T (via SDI Lab)",
    period: "2022 – 2024",
    location: "Seoul, Korea",
    phase: "Data-Driven",
    domains: ["Corporate Strategy", "Retail & Consumer"],
    images: ["/images/cards/samsung-raemian-metaverse.jpg", "/images/projects/samsung-raemian-metaverse.jpg"],
    brief:
      "Identified metaverse services for residents through hyper-local data and a meta-analysis of Raemian, a Korean apartment brand.",
    role: "Service scenario development, service prototyping, and student management and operation",
    outcome: ["Prototype development and demonstration for the client"],
    sections: [
      {
        heading: "Goal",
        body: [
          "In order to achieve value expansion through spatial expansion, our client needed to provide an expansive digital twin experience to offer premium services tailored to the residents of B, a high-end luxury residential facility.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To develop a content strategy for the metaverse, two theories combining technology and humanities were applied. First, we used prior studies on factors determining apartment residential quality to identify key qualitative elements to consider. Second, we applied Professor Jae-bung Choi's 'Phono Sapiens' model to determine how to satisfy the digital generation.",
        ],
      },
      {
        heading: "Process",
        body: [
          "To achieve this, residential-related data was collected to analyze people's housing needs. Verbal data related to housing was preprocessed and reclassified based on architecture-based factors and phono-sapiens factors. The redefined data was visualized on a heatmap, with the X-axis representing architecture-based factors and the Y-axis representing phono-sapiens factors.",
          "Then analyzed their correlation, grouped the main contexts, defined user needs, and reinterpreted them based on resident context to derive the final scenario. Based on the derived scenario, developed service prototypes using metaverse platforms (e.g., Zepeto, Unity).",
          "In this process, the project was carried out with a team of undergraduates, and I participated as a mentor guiding the student leading the project. I utilized specialized student industry-academia clubs (e.g., GRU) to evaluate the prototype and create demonstration videos.",
        ],
      },
      {
        heading: "Result",
        body: [
          "As a result, videos were produced for each service scenario.",
          "Scenario #1. Prototype for a digital flea market utilizing parking space",
          "Scenario #2. Planning of an event-based walking experience",
          "Scenario #3. Utilizing community center for information dissemination",
        ],
      },
    ],
  },
  {
    slug: "starfield-new-branch-1",
    title: "Shinesegae Starfield - Data-Driven Service Design for Newly Emerging Branch #1",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021 – 2025",
    location: "Changwon, Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/cards/starfield-new-branch-1.jpg", "/images/projects/starfield-new-branch-1.jpg"],
    brief:
      "Consulting on predicting customer characteristics for a newly planned Starfield location and proposing corresponding services based on these predictions.",
    role: "Demography analysis, persona design",
    outcome: [
      "Analyzed the characteristics of expected visitors",
      "Designed expected visit locations for each customer persona, and developed strategies accordingly",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "As the client plans to establish a new location in Changwon, there was a need for brand-specific designs for the in-mall stores tailored to the local residents of the area.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To define customer personas based on data, Network Analysis was chosen as the primary method to identify and select clusters visualized based on Network Graph Theory. Also, to analyze the demographics of Location #1, the SQAM model, which classifies and defines collective behavior, was applied.",
        ],
      },
      {
        heading: "Process",
        body: [
          "By integrating Social Network Analysis of customer credit card data with demographic insights from public population, mobility, and geography data, we identified six representative personas from four clusters for Location #1. Subsequently, the number of posts on social media was analyzed to identify hot spots within Location #1.",
          "The identified locations were reclassified based on the SQAM model.",
          "Using customer movement data, an analysis was conducted to determine which customers frequently visit specific locations for each type of collective behavior. For each location in the SQAM model, we analyzed the destinations frequently visited by customers based on their purposes. As a result, we identified that customers in Location #1 exhibit specific collective behaviors based on their purposes, including major visits to 'Queue' type locations for daily convenience purposes.",
        ],
      },
      {
        heading: "Result",
        body: [
          "Using these insights, we designed the types of locations and services expected by each persona.",
          "Based on this, seven service strategies were proposed and adopted into the operational strategy of the currently under-construction Location #1.",
        ],
      },
    ],
  },
  {
    slug: "starfield-new-branch-2",
    title: "Shinesegae Starfield - Data-Driven Service Design for Newly Emerging Branch #2",
    org: "Shinsegae Starfield (via SDI Lab)",
    period: "2021 – 2025",
    location: "Korea",
    phase: "Data-Driven",
    domains: ["Retail & Consumer"],
    images: ["/images/cards/starfield-new-branch-2.jpg", "/images/projects/starfield-new-branch-2.jpg"],
    brief:
      "Consulting on predicting customer characteristics for a newly planning Starfield location and proposing corresponding services based on these predictions.",
    role: "Demographic analysis, Persona design",
    outcome: [
      "Analyzed the characteristics of expected visitors",
      "Designed expected visit locations for each customer persona, and developed strategies accordingly",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "As the client plans to establish a new branch in location #2, there was a need for brand-specific designs for the in-mall stores tailored to the local residents of the area.",
        ],
      },
      {
        heading: "Research Model",
        body: [
          "To design services, a research model was developed based on answers to four key questions. Through quantitative data analysis, our team aimed to define Who, How, and What Attitude to identify key personas in Location #2. We then conducted interviews with representative individuals from each persona to determine what they would want from Starfield branch #2.",
          "The interview framework was built based on the SQAM model and psychographic variable scales derived from prior research. Using this framework, our team classified places customers visit in Location #2 and their reasons for visiting, providing insights into what customers want from Starfield.",
        ],
      },
      {
        heading: "Process",
        body: [
          "To define personas, our team first analyzed the key commercial districts in Location #2. Using mobility data, we identified the areas with the highest foot traffic. Subsequently we analyzed the number of posts on social network services to pinpoint the hot spots within Location #2. Additionally, insights from demographic data analysis were incorporated, resulting in the identification of nine key commercial districts.",
          "Detailed analysis of the characteristics of nine commercial areas was conducted, and they were reclassified into three large-scale commercial districts based on common features.",
          "Through this, four personas based on the local commercial districts were identified.",
          "Based on the analysis of four representative personas, we selected interview participants tailored to each persona and conducted interviews. The interview questions included details about the places they frequently visit, their activities and purposes at those places, and their motivations.",
          "The interview results were coded, and the visited locations were reclassified according to the SQAM model. Additionally, the descriptions of their experiences at each type of location were reclassified using psychographic variable scales. By visualizing these findings on a heatmap with X and Y axes, we were able to identify an integrated persona of Location #2 residents and determine, based on a theoretical model, which places and experiences are valued by each persona.",
        ],
      },
      {
        heading: "Result",
        body: [
          "With these insights, we proposed tailored customer experience strategies for each persona.",
          "The proposed strategies were adopted and are now being actively implemented at the newly opened Starfield Branch #2.",
        ],
      },
    ],
  },

  // ---------------- AI-DRIVEN ----------------
  {
    slug: "vip-concierge-robot",
    title: "VIP Concierge Robot: Service Design for Premium Guest Experience",
    org: "Sungkyunkwan University President's Office (via SDI Lab)",
    period: "Oct. 2024 – Jun. 2025",
    location: "Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Public Sector", "Robotics & AI"],
    images: ["/images/cards/vip-concierge-robot.jpg", "/images/projects/vip-concierge-robot-1.jpg", "/images/projects/vip-concierge-robot-2.jpg", "/images/projects/vip-concierge-robot-3.jpg"],
    brief:
      "Commissioned by the President of Sungkyunkwan University to design a service and robotic interaction system for guest reception within the presidential office.",
    role: "Service Design, Human–Robot Interaction Design",
    outcome: [
      "Three serving robots were successfully deployed and are currently in operation, delivering high guest satisfaction.",
    ],
    sections: [
      {
        heading: "Goal",
        body: [
          "To create a serving-robot system for the President's Office at Sungkyunkwan University — designed to deliver a wow-point experience for visiting VIPs while partially replacing the traditional hospitality roles performed by the secretary staff.",
        ],
      },
      {
        heading: "Process — 1. Establishing collaboration and context research",
        body: [
          "Worked in collaboration with a robotics laboratory in the Department of Mechanical Engineering to set up the development environment for the robot system.",
          "Conducted interviews with secretary staff, the President, and various VIP visitors to understand their expectations.",
        ],
      },
      {
        heading: "Process — 2. Identifying stakeholder expectations",
        body: [
          "Secretary Staff: their existing roles consist of three main tasks — welcoming and hosting guests, providing guided explanations, and serving beverages and refreshments.",
          "President: desired a system that reflects the legacy and heritage of Sungkyunkwan University.",
          "VIP Visitors: wanted something novel, memorable, and unexpected.",
        ],
      },
      {
        heading: "Process — 3. Concept development inspired by SKKU heritage",
        body: [
          "We drew inspiration from the historical artwork 'The Prince's Entrance Ceremony', which depicts the six ceremonial stages the crown prince underwent when entering the state academy, Sungkyunkwan, during the Joseon Dynasty.",
          "Based on this narrative logic: visiting guests were framed as 'crown princes'; the President represented the 'royal mentor'; the service system — including the serving robots — became the attending 'court servants'. This cultural reinterpretation transformed the guest experience into a symbolic ceremonial journey.",
          "From this narrative structure, we derived three key personas in court servants — the Scholar, the Court Servant, and the Court Lady. These personas guided the interaction flow and ultimately informed the deployment of three serving robots.",
          "To accomplish this, we purchased three serving robots and initiated the development project. Based on this framework, we designed the complete service system by defining each role and mapping all touchpoints within the President's Office.",
          "Building on this service system, we collaborated with the Mechanical Engineering laboratory to program the serving robots. We scanned the President's Office to map the full circulation paths and assigned functional behaviors to each route, enabling features such as photo-taking, guided explanations, and beverage service. In particular, we utilized the robot's display to implement guided-tour videos, facial expressions, and AI-driven interaction capabilities.",
        ],
      },
      {
        heading: "Result",
        body: [
          "Finally, we designed custom housings tailored to each robot's concept. The robots are now fully operational and have become a strong wow-point within the President's Office.",
        ],
      },
    ],
  },
  {
    slug: "manufacturing-worker-training-ai",
    title: "Digital-Twin Service Design for Labor-Intensive Manufacturing System",
    org: "Co-research with a labmate, at a manufacturing partner in Weihai, China",
    period: "2025 –",
    location: "Weihai, China / Seoul, Korea",
    phase: "AI-Driven",
    domains: ["Robotics & AI", "Corporate Strategy"],
    images: ["/images/cards/manufacturing-worker-training-ai.jpg", "/images/projects/manufacturing-worker-training-ai-1.jpg", "/images/projects/manufacturing-worker-training-ai-2.jpg"],
    brief:
      "To build an AI persona–based digital simulation system for labor-intensive manufacturing environments where traditional digital-twin techniques are difficult to apply.",
    role: "Persona Design",
    outcome: ["In Progress"],
    sections: [
      {
        heading: "Problem",
        body: [
          "We conducted field collaboration with a factory in Weihai, China, which manufactures wire harnesses, a core component of automotive electronics.",
          "Wire-harness assembly is highly labor-intensive, and due to its manual, non-automatable nature, implementing a full digital twin is extremely challenging. Therefore, a new approach was needed: one that focuses on digitizing workers, not machines.",
          "The production process of wiring harness consists of four main stages: wire cutting, connector insertion, functional testing and error inspection, and taping and final assembly. Each product involves 20+ connector types, and each stage requires a team of three workers. Lead time varies significantly depending on how worker teams are composed.",
          "We analyzed real operational data from factory workers, including physical attributes (height, weight, body type, hand size), gender, wage and family information, assigned production stage, working hours, output and performance metrics, and defect rates.",
          "In our preliminary analysis, we found notable patterns — for example, in the connector-insertion stage, workers with smaller hands and smaller body frames tended to achieve higher output and better performance.",
          "Based on these attributes and performance patterns, we classified workers into distinct worker personas. These personas represent meaningful behavioral and performance groups that influence workflow efficiency.",
          "Using the defined worker personas, we are developing an AI persona–based HR simulation to determine which personas should be assigned to each production stage, which combinations of personas yield the highest operational efficiency, and how team structures impact lead time, output, and error rates.",
        ],
      },
      {
        heading: "Result (In Progress)",
        body: [
          "We are currently reconstructing the factory workflow in Unity, creating a 3D environment that enables dynamic simulation of worker–process interactions.",
          "Once completed, the system will identify the optimal persona combinations for each assembly stage, predict operational efficiency improvements when these combinations are applied, and serve as a decision-support tool for worker assignment, new-hire placement, and performance management.",
          "Ultimately, this approach aims to create a human-centered digital twin model that enhances productivity in environments where automation is not possible.",
        ],
      },
    ],
    note: "Known site bug, not yet resolved: the original page's GOAL section was actually copy-pasted from the Military Wargame page and describes soldier simulation, not manufacturing — omitted here rather than reproduced, since it would misdescribe this project. Also, per the vault: this description is the initial framing from when the project was scoped; the actual current status is further along (a defect-tracing AI tool is complete, and a second paper on coaching interventions is in progress) — see the previous version of this page for that update, pending your call on which to keep.",
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
    note: "Not on the old Framer site — this is current employment (2025–2026), added from the resume/vault.",
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
    note: "Not on the old Framer site — this is current employment (2025–2026), added from the resume/vault.",
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
