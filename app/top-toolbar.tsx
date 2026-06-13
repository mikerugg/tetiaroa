import Image from "next/image";
import Link from "next/link";

const toolbarPillClass =
  "rounded-full border border-current px-3 py-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-[#5be8d4] hover:bg-[#5be8d4]/10 hover:text-[#8ff4e6]";

export function TopToolbar() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 flex h-14 justify-between gap-5 border-b border-white/10 bg-[#030c12]/30 px-5 backdrop-blur-md md:h-16 md:px-7"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="relative h-full w-40 shrink-0 overflow-hidden md:w-48"
      >
        <Image
          src="/logos/TSFP_Logo_2026_White.png"
          alt="Tetiaroa Society"
          width={596}
          height={371}
          className="absolute left-0 top-1/2 h-20 w-auto -translate-y-1/2 shrink-0 object-contain md:h-24"
          priority
        />
      </Link>
      <span className="self-center rounded-full border border-[#5be8d4]/40 px-3 py-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-[#5be8d4] max-[860px]:hidden">
        Concept 01 / Te Hohonu &middot; the deep
      </span>
      <div className="flex h-full items-center gap-[22px] text-sm text-[#f4f1ea]/85 max-[860px]:gap-3.5 max-[860px]:text-[13px]">
        <Link
          href="/first-prototype"
          className={`${toolbarPillClass} inline-flex max-[640px]:hidden`}
        >
          First Prototype
        </Link>
        <Link href="/our-logo" className={toolbarPillClass}>
          Our Logo
        </Link>
        <Link
          href="/#donation-levels"
          className="donate-lava relative isolate overflow-hidden rounded-full px-[18px] py-2 font-semibold text-[#241303] shadow-[0_0_18px_rgba(249,115,22,0.28)] transition-[filter,transform] duration-300 hover:-translate-y-px hover:text-[#241303] hover:brightness-110"
        >
          <span className="relative z-10">Donate</span>
        </Link>
      </div>
    </nav>
  );
}
