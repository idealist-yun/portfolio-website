import Link from "next/link";

export default function Switcher({ current, dark }: { current: "a" | "b"; dark?: boolean }) {
  const item = (on: boolean) =>
    `rounded-full px-3 py-1.5 transition-colors ${
      on
        ? dark
          ? "bg-white text-black"
          : "bg-[#1c1a17] text-[#f4efe4]"
        : dark
          ? "text-white/60 hover:text-white"
          : "text-black/55 hover:text-black"
    }`;
  return (
    <div
      className={`fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-full border p-1 font-mono text-[11px] uppercase tracking-wider shadow-lg backdrop-blur ${
        dark ? "border-white/15 bg-black/60 text-white" : "border-black/10 bg-[#f4efe4]/85 text-black"
      }`}
    >
      <Link href="/concept/a" className={item(current === "a")}>
        A<span className="hidden sm:inline"> · Multiverse</span>
      </Link>
      <Link href="/concept/b" className={item(current === "b")}>
        B<span className="hidden sm:inline"> · Paper &amp; ink</span>
      </Link>
      <Link href="/" className={item(false)}>
        <span className="sm:hidden">Site</span>
        <span className="hidden sm:inline">Current site</span>
      </Link>
    </div>
  );
}
