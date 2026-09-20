"use client";

import { useState } from "react";

// Click-to-load: the lab boots a ~10 MB Python runtime (Pyodide), so it only
// starts when a visitor explicitly asks for it.
export default function LabEmbed({ href }: { href: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
      {open ? (
        <>
          <iframe
            src={href}
            title="IDD Agent Lab, live simulator"
            className="h-[820px] w-full bg-[#0b1210]"
            allow="fullscreen"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted">
            <span>
              Running live in your browser. Nothing you create leaves this page.
            </span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline"
            >
              Open full screen ↗
            </a>
          </div>
        </>
      ) : (
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
            Live demo
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">
            Run the simulator yourself
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Build a synthetic agent from a clinical-style functional profile,
            drop it into daily-living scenarios on a virtual town map, and see
            which step breaks down, and why, in caregiver language. The actual
            Python engine runs inside your browser (no server, no account), so
            it takes a few seconds to start the first time.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            All agents are synthetic. This is a research prototype, not a
            clinical tool.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Launch simulator
            </button>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              or open full screen ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
