import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-16 max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
        {title}
      </h1>
      {lede && (
        <p className="mt-6 text-xl leading-relaxed text-foreground/80">
          {lede}
        </p>
      )}
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-accent sm:text-3xl">
        {children}
      </h2>
      <div className="mt-2 border-t-2 border-accent" />
    </div>
  );
}

export function Tag({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors";
  if (!onClick) {
    return (
      <span className={`${base} border-border bg-accent-soft text-accent`}>
        {children}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(28,30,33,0.04)] transition-colors group-hover:border-accent">
      {children}
    </div>
  );
}
