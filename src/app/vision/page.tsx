import Image from "next/image";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";

function Img({
  src,
  w,
  h,
  dark,
  className = "",
}: {
  src: string;
  w: number;
  h: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border ${
        dark ? "bg-[#0b0d12]" : "bg-white"
      } ${className}`}
    >
      <Image
        src={src}
        alt=""
        width={w}
        height={h}
        className="h-auto w-full"
      />
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-3xl text-[18px] leading-[1.7] text-foreground/80">
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl list-disc space-y-3 pl-5 text-[18px] leading-[1.7] text-foreground/80">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function Level({
  label,
  icon,
  title,
  children,
}: {
  label: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="grid gap-8 sm:grid-cols-[180px_1fr] sm:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
            {label}
          </p>
          <Img src={icon} w={600} h={600} dark className="mt-4 max-w-[180px]" />
        </div>
        <div className="space-y-5">
          <h3 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </Reveal>
  );
}

function Skill({
  n,
  title,
  body,
  imgs,
}: {
  n: string;
  title: string;
  body: string;
  imgs: { src: string; w: number; h: number }[];
}) {
  return (
    <Reveal>
      <p className="font-serif text-3xl font-semibold text-accent">{n}</p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mt-3 max-w-3xl text-[18px] leading-[1.7] text-foreground/80">
        {body}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {imgs.map((im) => (
          <Img key={im.src} src={im.src} w={im.w} h={im.h} />
        ))}
      </div>
    </Reveal>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Image
        src="/images/vision/bullet-icon.png"
        alt=""
        width={77}
        height={68}
        className="mt-1.5 h-[18px] w-auto shrink-0"
      />
      <span>{children}</span>
    </li>
  );
}

export default function VisionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
        Steps to Create a World Where Vulnerability Becomes a Trait, Not a
        Basis for Discrimination
      </h1>

      <div className="mt-20 space-y-20">
        <Level
          label="Personal Level"
          icon="/images/vision/level-personal.png"
          title="Become a T-Shaped Person"
        >
          <P>
            To address diverse social issues, I aspire to become a T-shaped
            professional with expertise across fields such as healthcare,
            medical sciences, social sciences, humanities, engineering, and
            business. By pursuing an expertise in strategic design, I aim to
            integrate these domains and enhance my interdisciplinary
            understanding.
          </P>
        </Level>

        <Level
          label="Societal Level"
          icon="/images/vision/level-societal.png"
          title="Build a Biz.Model for the Ecosystem of PwD"
        >
          <Bullets
            items={[
              "As a service designer, standardize inclusive product / service / system design systems through my own consulting firm.",
              "As a strategist, independently create and develop products / service / systems that the world truly needs, by utilizing the internal capabilities of a consulting firm.",
              "As an administrator, establish a foundation to secure the capabilities needed to provide essential support services through the life cycle, including treatment, rehabilitation, and education.",
            ]}
          />
        </Level>

        <Level
          label="Global Level"
          icon="/images/vision/level-global.png"
          title="Systematize an Ecosystem Applicable to all the Vulnerable"
        >
          <P>
            My ultimate goal is, through Social Innovation and Business,
            bringing changes to the most conservative fields. As a result of my
            efforts to address societal challenges, disabilities can be
            approached with comprehensive support systems:
          </P>
          <Bullets
            items={[
              "In the early stages of disability, individuals can quickly find stability through the foundation's support, including necessary interventions, treatment, and counseling.",
              "During their developmental years, they can receive tailored education for specific disabilities, utilizing the foundation's educational capabilities.",
              "In adulthood, they can benefit from vocational training and support for independence through the foundation and the businesses created by consulting firm's internal resources.",
              "After gaining independence (or in the event of a caregiver's passing), they can sustain stable employment and livelihoods through the foundation and its affiliated businesses.",
              "By that time, the consulting firm's activities and methodologies will have led to a world where far more products and services are accessible and usable for people with disabilities.",
            ]}
          />
          <P>
            While this system is fundamentally designed for addressing
            disabilities, it can also be applied to support other vulnerables.
          </P>
        </Level>
      </div>

      <section className="mt-24">
        <SectionHeading>Core Skills &amp; Research</SectionHeading>
        <div className="mt-8 space-y-10">
          <Img src="/images/vision/core-header.png" w={2000} h={1054} dark />
          <P>
            Based on the capabilities I have built—and the advanced skills I
            will continue to develop through my graduate studies—my future
            company will deliver three core solutions:
          </P>
        </div>
        <div className="mt-14 space-y-16">
          <Skill
            n="01"
            title="Data-driven persona analysis and behavioral modeling"
            body="We transform complex user behavior, needs, and constraints into multidimensional data models that reveal actionable insights."
            imgs={[
              { src: "/images/vision/skill1-a.png", w: 1600, h: 800 },
              { src: "/images/vision/skill1-b.png", w: 1600, h: 1132 },
            ]}
          />
          <Skill
            n="02"
            title="Design-thinking–driven solution development"
            body="Leveraging these insights, we create innovative product–service–system concepts rooted in rigorous design thinking and real user contexts."
            imgs={[
              { src: "/images/vision/skill2-a.png", w: 832, h: 581 },
              { src: "/images/vision/skill2-b.png", w: 1000, h: 563 },
            ]}
          />
          <Skill
            n="03"
            title="AI-integrated, 3D simulation-based prototyping"
            body="We combine modeled personas with AI agents and test solutions directly within virtual 3D environments, enabling rapid iteration, scenario testing, and pre-market validation."
            imgs={[
              { src: "/images/vision/skill3-a.png", w: 1600, h: 883 },
              { src: "/images/vision/skill3-b.png", w: 1600, h: 902 },
              { src: "/images/vision/skill3-c.png", w: 1296, h: 647 },
            ]}
          />
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading>Long-Term Goal</SectionHeading>
        <div className="mt-8 space-y-14">
          <P>
            These solutions will be applied across diverse domains—including
            disability and healthcare, consumer experience, robotics, military
            systems, public service design, and urban innovation—ultimately
            scaling into a global strategy-design and simulation-driven
            innovation firm.
          </P>

          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
              Phase 1
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              Strategic Design Consultancy
            </h3>
            <div className="mt-6 space-y-8">
              {[
                {
                  t: "Data-driven persona analysis & modeling",
                  i: [
                    { src: "/images/vision/skill1-a.png", w: 1600, h: 800 },
                    { src: "/images/vision/skill1-b.png", w: 1600, h: 1132 },
                  ],
                },
                {
                  t: "PSS concept development",
                  i: [
                    { src: "/images/vision/skill2-a.png", w: 832, h: 581 },
                    { src: "/images/vision/skill2-b.png", w: 1000, h: 563 },
                  ],
                },
                {
                  t: "AI-integrated 3D simulation prototyping",
                  i: [
                    { src: "/images/vision/skill3-b.png", w: 1600, h: 902 },
                    { src: "/images/vision/skill3-c.png", w: 1296, h: 647 },
                  ],
                },
              ].map((x) => (
                <div key={x.t}>
                  <p className="text-[18px] font-medium leading-snug text-foreground">
                    {x.t}
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {x.i.map((im) => (
                      <Img key={im.src} src={im.src} w={im.w} h={im.h} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
              Phase 2
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              Global Disability Product-Service-System Design &amp;
              Manufacturing Company
            </h3>
            <div className="mt-8 grid gap-10 sm:grid-cols-3">
              <div>
                <p className="font-serif text-xl font-semibold text-accent">
                  Essential Assistive Technologies
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/80">
                  <li>Wheelchairs, seating systems, mobility aids</li>
                  <li>Designed with a refined, modern aesthetic</li>
                  <li>
                    Products that allow users to blend naturally into everyday
                    environments
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-accent">
                  Mass-market Disability-Inclusive Products
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/80">
                  <li>
                    Based on my <strong>Kano-model insight</strong>:
                    disability-driven needs à mainstream wants
                  </li>
                  <li>
                    Products that begin in disability contexts but expand into
                    universal consumer markets
                  </li>
                  <li>
                    Examples: functional accessories, smart daily-living
                    devices, inclusive home appliances
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-accent">
                  Universal Robotics
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/80">
                  <li>
                    Robotics usable by both disabled and non-disabled
                    populations
                  </li>
                  <li>Universal human-robot interaction design</li>
                  <li>
                    Service robots for care, home tasks, customer service, and
                    accessibility support
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <p className="max-w-3xl font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground">
            Ultimately, I seek to build an integrated disability
            ecosystem—so that my family, and others who share our experiences,
            can live in a world where they can truly breathe.
          </p>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading>Disability ecosystem establishment</SectionHeading>
        <div className="mt-8 space-y-6">
          <P>
            <strong className="font-semibold text-foreground">
              Found Issang, a Global Strategic Design Product-Service-System
              Company
            </strong>
          </P>
          <P>Providing work environments for PwDs</P>
          <p className="pt-2 font-serif text-xl font-semibold text-accent">
            Establish a Foundation
          </p>
          <P>
            Offer product-service-systems, with considering in the perspective
            of disabilities, vulnerable. Utilize in-house ventures and startup
            teams to expand consultancy&apos;s own business.
          </P>
          <ul className="max-w-3xl space-y-4 text-[18px] leading-[1.7] text-foreground/80">
            <Check>
              Directly integrating PwDs into the business and expanding the
              opportunities where they can work
            </Check>
            <Check>
              Based on ROTC network, provide non-profit services related to
              healthcare and education
            </Check>
          </ul>
          <Reveal>
            <Img src="/images/vision/ecosystem.png" w={2000} h={778} />
          </Reveal>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading>Anticipated Outcomes of the Biz. Model</SectionHeading>
        <div className="mt-8 space-y-8">
          <p className="font-serif text-xl font-semibold text-accent">
            Impact to the Disability Domain
          </p>
          <P>
            Driving innovation in the most conservative fields, establishing a
            methodological framework that incorporates considerations for
            disabilities and vulnerable groups in the development of products,
            services, and systems (PSS).
          </P>
          <ul className="max-w-3xl space-y-4 text-[18px] leading-[1.7] text-foreground/80">
            <Check>
              Expand the pool of products and services accessible to
              disabilities, creating an environment where they can integrate
              into society more seamlessly than ever before
            </Check>
            <Check>
              Through developing projects independently, even without corporate
              collaborations, establish internal employment capabilities for
              PwD
            </Check>
          </ul>
          <p className="font-serif text-xl font-semibold text-accent">
            Support for employment and Social Independence of PwD
          </p>
          <ul className="max-w-3xl space-y-4 text-[18px] leading-[1.7] text-foreground/80">
            <Check>
              Expand support service capabilities for PwD beyond business
              operations
            </Check>
            <Check>
              Provision of treatment, education, and aging support for
              disabilities
            </Check>
          </ul>
        </div>
      </section>

      <section className="mt-24 border-t border-border pt-16">
        <Reveal>
          <p className="max-w-4xl font-serif text-3xl font-semibold leading-[1.2] tracking-tight text-foreground sm:text-5xl">
            Designing a Disability Ecosystem
          </p>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-foreground/80">
            Creating a <strong className="text-foreground">Comprehensive system</strong> that
            supports <strong className="text-foreground">every stage</strong> form
            the <strong className="text-foreground">onset of disability</strong> to{" "}
            <strong className="text-foreground">
              treatment, rehabilitation, education, employment, independence,
              adaptation, and aging
            </strong>{" "}
            – building a kinder, more inclusive world!
          </p>
        </Reveal>
      </section>
    </div>
  );
}
