// "ian" with a red dot over the italic i: the dot is placed from the glyph's measured stem
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-dm)] leading-none ${className}`}>
      <span className="relative inline-block italic">
        ı
        <span
          aria-hidden
          className="absolute h-[0.15em] w-[0.15em] rounded-full transition-transform duration-300 group-hover:scale-150"
          style={{ background: "var(--accent)", left: "0.15em", top: "0.15em" }}
        />
      </span>
      an
    </span>
  );
}
