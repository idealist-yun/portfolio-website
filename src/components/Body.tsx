import Image from "next/image";
import type { ReactNode } from "react";
import type { BodyItem } from "@/data/body";
import VipRobotSim from "@/components/VipRobotSim";

const URL_RE = /(https?:\/\/[^\s]+)/g;

function withLinks(text: string): ReactNode {
  const parts = text.split(URL_RE);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline"
      >
        {p}
      </a>
    ) : (
      p
    )
  );
}

export default function Body({
  items,
  alt,
}: {
  items: BodyItem[];
  alt: string;
}) {
  return (
    <div className="mt-5 space-y-5">
      {items.map((item, j) => {
        if (typeof item === "string") {
          return (
            <p
              key={j}
              className="max-w-3xl whitespace-pre-line text-[18px] leading-[1.7] text-foreground/80"
            >
              {withLinks(item)}
            </p>
          );
        }
        if ("sub" in item) {
          return (
            <h3
              key={j}
              className="max-w-3xl pt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-foreground"
            >
              {item.sub}
            </h3>
          );
        }
        if ("list" in item) {
          return (
            <ul
              key={j}
              className="max-w-3xl list-disc space-y-2 pl-6 text-[18px] leading-[1.7] text-foreground/80"
            >
              {item.list.map((li, k) => (
                <li key={k}>{withLinks(li)}</li>
              ))}
            </ul>
          );
        }
        if ("img" in item) {
          return (
            <div
              key={j}
              className="overflow-hidden rounded-2xl border border-border shadow-[0_1px_3px_rgba(28,30,33,0.06)]"
            >
              <Image
                src={item.img}
                alt={alt}
                width={1400}
                height={900}
                className="h-auto w-full"
              />
            </div>
          );
        }
        if ("yt" in item) {
          return (
            <div
              key={j}
              className="aspect-video max-w-3xl overflow-hidden rounded-2xl border border-border bg-black"
            >
              <iframe
                src={`https://www.youtube.com/embed/${item.yt}?rel=0&modestbranding=1`}
                title={alt}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          );
        }
        if ("link" in item) {
          return (
            <a
              key={j}
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {item.link.label} ↓
            </a>
          );
        }
        return <VipRobotSim key={j} />;
      })}
    </div>
  );
}
