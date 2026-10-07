import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const phases = ["Basic", "Data-Driven", "AI-Driven"];

export default function WorkOverview() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
        Welcome to my past, present, and future!
      </h1>

      <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-white">
        <Image
          src="/images/work/overview.png"
          alt="Double Diamond model: Discover, Define, Ideate, Prototype"
          width={1394}
          height={606}
          className="h-auto w-full"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {phases.map((p) => (
          <Link
            key={p}
            href={`/project?phase=${encodeURIComponent(p)}`}
            className="rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {p} →
          </Link>
        ))}
      </div>

      <Reveal className="mt-20">
        <h2 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-accent">
          Work Overview
        </h2>
        <div className="mt-4 h-px w-10 bg-accent" />
        <div className="mt-6 space-y-5 text-[18px] leading-[1.7] text-foreground/80">
          <p>
            Over the years, I have pursued projects across diverse
            domains—including retail, finance, beauty, branding, military, and
            hospitality —as part of my journey toward becoming a strategic
            designer focused on vulnerability.
          </p>
          <p>These experiences can be distilled into three core competencies:</p>
          <p>
            Basic Design Thinking, Data-driven Service Design, and AI-driven
            Strategic Design.
          </p>
          <p>
            According to the Double Diamond model, problem-solving unfolds
            through discover, define, develop, and deliver.
          </p>
          <p>
            My Basic Service Design phase helped me internalize this process
            and build a solid foundation in design thinking.
          </p>
          <p>
            The Data-driven Service Design phase strengthened the first diamond
            by teaching me how to analyze personas quantitatively and extract
            behavioral insights from real-world data.
          </p>
          <p>
            The AI-driven Service Design phase represents the new possibility I
            discovered—leveraging AI personas and virtual simulation
            environments to accelerate rapid prototyping in the second diamond.
            This approach enables solutions to be tested, validated, and
            refined before they reach the real world.
          </p>
          <p>
            Building on these three stages, I aim to further explore
            human–robot interaction, human–AI interaction, and disability
            innovation in my future work.
          </p>
          <p>
            If you&apos;d like to explore the projects behind each stage, please
            take a look above!
          </p>
        </div>
      </Reveal>
    </div>
  );
}
