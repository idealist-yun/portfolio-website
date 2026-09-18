"use client";

import { useMemo, useState } from "react";
import {
  research,
  statusOrder,
  allTopics,
  type ResearchTopic,
} from "@/data/research";
import { Tag, Card } from "@/components/ui";

const statusStyle: Record<string, string> = {
  Published: "bg-accent text-white",
  "In Progress": "bg-warm text-white",
  Planned: "bg-border text-muted",
};

export default function ResearchList() {
  const [topic, setTopic] = useState<ResearchTopic | "All">("All");

  const filtered = useMemo(
    () =>
      topic === "All" ? research : research.filter((r) => r.topics.includes(topic)),
    [topic]
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        <Tag active={topic === "All"} onClick={() => setTopic("All")}>
          All topics
        </Tag>
        {allTopics.map((t) => (
          <Tag key={t} active={topic === t} onClick={() => setTopic(t)}>
            {t}
          </Tag>
        ))}
      </div>

      <div className="space-y-16">
        {statusOrder.map((status) => {
          const items = filtered.filter((r) => r.status === status);
          if (items.length === 0) return null;
          return (
            <div key={status}>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {status}
              </h2>
              <div className="mt-6 space-y-5">
                {items.map((item) => (
                  <Card key={item.slug}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">
                        {item.title}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {(item.venue || item.date) && (
                      <p className="mt-1 text-sm text-muted">
                        {[item.venue, item.date].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                    {item.bullets && (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                        {item.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.topics.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
