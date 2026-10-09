"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { nav, profile } from "@/data/profile";

// The one header for every page, home included, so the logo and menu never move between pages.
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const linkClass = (active: boolean) =>
    `font-mono text-[11px] uppercase tracking-wider transition-colors ${
      active ? "text-accent" : "text-muted hover:text-foreground"
    }`;

  const linkedin = profile.linkedin ? (
    <a
      href={profile.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass(false)}
    >
      LinkedIn ↗
    </a>
  ) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group pt-1.5"
          title="Everything starts from a dot"
          onClick={() => setOpen(false)}
        >
          <Logo className="text-[1.8rem]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
          {linkedin}
        </nav>

        <button
          className="text-sm text-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-2 ${linkClass(isActive(item.href))}`}
            >
              {item.label}
            </Link>
          ))}
          {linkedin && <span className="py-2">{linkedin}</span>}
        </nav>
      )}
    </header>
  );
}
