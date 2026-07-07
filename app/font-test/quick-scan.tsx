"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export type FontOptionId = (typeof fontOptions)[number]["id"];
export type QuickScanRowId = (typeof quickScanRows)[number]["id"];

type FontOption = {
  id: string;
  label: string;
  selectLabel: string;
  className: string;
};

type QuickScanRow = {
  id: string;
  role: string;
  defaultLeftFontId: FontOptionId;
  defaultRightFontId: FontOptionId;
  sample: ReactNode;
  sampleClassName?: string;
};

type TypePairProps = {
  id: QuickScanRowId;
  role: string;
  defaultLeftFontId: FontOptionId;
  defaultRightFontId: FontOptionId;
  leftFontId?: FontOptionId;
  onLeftFontChange?: (rowId: QuickScanRowId, value: FontOptionId) => void;
  children: ReactNode;
  sampleClassName?: string;
};

export const fontOptions = [
  {
    id: "header",
    label: "Bebas Neue / font-header",
    selectLabel: "Bebas Neue",
    className: "font-header",
  },
  {
    id: "display",
    label: "Fraunces / font-display",
    selectLabel: "Fraunces",
    className: "font-display",
  },
  {
    id: "display-italic",
    label: "Fraunces italic / font-display",
    selectLabel: "Fraunces italic",
    className: "font-display italic",
  },
  {
    id: "cormorant",
    label: "Cormorant Garamond / display serif",
    selectLabel: "Cormorant",
    className: "font-test-cormorant",
  },
  {
    id: "cormorant-italic",
    label: "Cormorant Garamond italic / display serif",
    selectLabel: "Cormorant italic",
    className: "font-test-cormorant italic",
  },
  {
    id: "playfair",
    label: "Playfair Display / display serif",
    selectLabel: "Playfair",
    className: "font-test-playfair",
  },
  {
    id: "playfair-italic",
    label: "Playfair Display italic / display serif",
    selectLabel: "Playfair italic",
    className: "font-test-playfair italic",
  },
  {
    id: "dm-serif",
    label: "DM Serif Display / display serif",
    selectLabel: "DM Serif",
    className: "font-test-dm-serif",
  },
  {
    id: "dm-serif-italic",
    label: "DM Serif Display italic / display serif",
    selectLabel: "DM Serif italic",
    className: "font-test-dm-serif italic",
  },
  {
    id: "dm-serif-text",
    label: "DM Serif Text / text serif",
    selectLabel: "DM Serif Text",
    className: "font-test-dm-serif-text",
  },
  {
    id: "dm-serif-text-italic",
    label: "DM Serif Text italic / text serif",
    selectLabel: "DM Serif Text italic",
    className: "font-test-dm-serif-text italic",
  },
  {
    id: "libre-baskerville",
    label: "Libre Baskerville / book serif",
    selectLabel: "Libre Baskerville",
    className: "font-test-libre-baskerville",
  },
  {
    id: "source-serif",
    label: "Source Serif 4 / editorial serif",
    selectLabel: "Source Serif 4",
    className: "font-test-source-serif",
  },
  {
    id: "instrument-serif",
    label: "Instrument Serif / elegant display serif",
    selectLabel: "Instrument Serif",
    className: "font-test-instrument-serif",
  },
  {
    id: "instrument-serif-italic",
    label: "Instrument Serif italic / elegant display serif",
    selectLabel: "Instrument Serif italic",
    className: "font-test-instrument-serif italic",
  },
  {
    id: "newsreader",
    label: "Newsreader / editorial serif",
    selectLabel: "Newsreader",
    className: "font-test-newsreader",
  },
  {
    id: "newsreader-italic",
    label: "Newsreader italic / editorial serif",
    selectLabel: "Newsreader italic",
    className: "font-test-newsreader italic",
  },
  {
    id: "eb-garamond",
    label: "EB Garamond / classic serif",
    selectLabel: "EB Garamond",
    className: "font-test-eb-garamond",
  },
  {
    id: "crimson-pro",
    label: "Crimson Pro / book serif",
    selectLabel: "Crimson Pro",
    className: "font-test-crimson-pro",
  },
  {
    id: "spectral",
    label: "Spectral / editorial serif",
    selectLabel: "Spectral",
    className: "font-test-spectral",
  },
  {
    id: "literata",
    label: "Literata / literary serif",
    selectLabel: "Literata",
    className: "font-test-literata",
  },
  {
    id: "sans",
    label: "Inter / font-sans",
    selectLabel: "Inter",
    className: "font-sans",
  },
  {
    id: "manrope",
    label: "Manrope / geometric sans",
    selectLabel: "Manrope",
    className: "font-test-manrope",
  },
  {
    id: "ibm-plex-sans",
    label: "IBM Plex Sans / humanist sans",
    selectLabel: "IBM Plex Sans",
    className: "font-test-ibm-plex-sans",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk / geometric sans",
    selectLabel: "Space Grotesk",
    className: "font-test-space-grotesk",
  },
  {
    id: "public-sans",
    label: "Public Sans / utilitarian sans",
    selectLabel: "Public Sans",
    className: "font-test-public-sans",
  },
  {
    id: "source-sans",
    label: "Source Sans 3 / humanist sans",
    selectLabel: "Source Sans 3",
    className: "font-test-source-sans",
  },
  {
    id: "work-sans",
    label: "Work Sans / screen sans",
    selectLabel: "Work Sans",
    className: "font-test-work-sans",
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans / modern geometric sans",
    selectLabel: "Plus Jakarta Sans",
    className: "font-test-plus-jakarta",
  },
  {
    id: "outfit",
    label: "Outfit / clean geometric sans",
    selectLabel: "Outfit",
    className: "font-test-outfit",
  },
  {
    id: "albert-sans",
    label: "Albert Sans / neutral grotesk",
    selectLabel: "Albert Sans",
    className: "font-test-albert-sans",
  },
  {
    id: "mono",
    label: "JetBrains Mono / font-mono",
    selectLabel: "JetBrains Mono",
    className: "font-mono",
  },
  {
    id: "geist-sans",
    label: "Geist Sans / font-geist-sans",
    selectLabel: "Geist Sans",
    className: "font-geist-sans",
  },
  {
    id: "geist-sans-italic",
    label: "Geist Sans italic / font-geist-sans",
    selectLabel: "Geist Sans italic",
    className: "font-geist-sans italic",
  },
  {
    id: "geist-mono",
    label: "Geist Mono / font-geist-mono",
    selectLabel: "Geist Mono",
    className: "font-geist-mono",
  },
  {
    id: "bebas",
    label: "Bebas Neue / condensed display",
    selectLabel: "Bebas Neue",
    className: "font-test-bebas",
  },
  {
    id: "archivo-black",
    label: "Archivo Black / heavy display",
    selectLabel: "Archivo Black",
    className: "font-test-archivo-black",
  },
  {
    id: "league-gothic",
    label: "League Gothic / condensed display",
    selectLabel: "League Gothic",
    className: "font-test-league-gothic",
  },
  {
    id: "oswald",
    label: "Oswald / condensed sans",
    selectLabel: "Oswald",
    className: "font-test-oswald",
  },
  {
    id: "barlow-condensed",
    label: "Barlow Condensed / condensed sans",
    selectLabel: "Barlow Condensed",
    className: "font-test-barlow-condensed",
  },
  {
    id: "teko",
    label: "Teko / squared condensed display",
    selectLabel: "Teko",
    className: "font-test-teko",
  },
  {
    id: "fjalla",
    label: "Fjalla One / narrow display sans",
    selectLabel: "Fjalla One",
    className: "font-test-fjalla",
  },
  {
    id: "roboto-condensed",
    label: "Roboto Condensed / compact sans",
    selectLabel: "Roboto Condensed",
    className: "font-test-roboto-condensed",
  },
  {
    id: "archivo-narrow",
    label: "Archivo Narrow / compact grotesk",
    selectLabel: "Archivo Narrow",
    className: "font-test-archivo-narrow",
  },
  {
    id: "fira-code",
    label: "Fira Code / coding mono",
    selectLabel: "Fira Code",
    className: "font-test-fira-code",
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono / technical mono",
    selectLabel: "IBM Plex Mono",
    className: "font-test-ibm-plex-mono",
  },
  {
    id: "roboto-mono",
    label: "Roboto Mono / neutral mono",
    selectLabel: "Roboto Mono",
    className: "font-test-roboto-mono",
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro / coding mono",
    selectLabel: "Source Code Pro",
    className: "font-test-source-code-pro",
  },
  {
    id: "space-mono",
    label: "Space Mono / display mono",
    selectLabel: "Space Mono",
    className: "font-test-space-mono",
  },
  {
    id: "inconsolata",
    label: "Inconsolata / readable mono",
    selectLabel: "Inconsolata",
    className: "font-test-inconsolata",
  },
  {
    id: "dm-mono",
    label: "DM Mono / design mono",
    selectLabel: "DM Mono",
    className: "font-test-dm-mono",
  },
  {
    id: "azeret-mono",
    label: "Azeret Mono / sharp mono",
    selectLabel: "Azeret Mono",
    className: "font-test-azeret-mono",
  },
  {
    id: "red-hat-mono",
    label: "Red Hat Mono / technical mono",
    selectLabel: "Red Hat Mono",
    className: "font-test-red-hat-mono",
  },
] as const satisfies readonly FontOption[];

export const quickScanRows = [
  {
    id: "section-kicker",
    role: "Section kicker",
    defaultLeftFontId: "mono",
    defaultRightFontId: "mono",
    sample: (
      <>
        Project 01 &mdash; Honu XR
        <br />
        the deep-water submersible
      </>
    ),
    sampleClassName:
      "text-sm font-semibold uppercase leading-relaxed tracking-[0.22em] text-[#5be8d4]",
  },
  {
    id: "hero-headline",
    role: "Hero headline",
    defaultLeftFontId: "header",
    defaultRightFontId: "header",
    sample: "Meet Honu. Built to bring the ocean to everyone.",
    sampleClassName:
      "text-[clamp(3rem,6vw,6.8rem)] uppercase leading-[0.9] tracking-[0.01em]",
  },
  {
    id: "body-paragraph",
    role: "Body paragraph",
    defaultLeftFontId: "sans",
    defaultRightFontId: "sans",
    sample:
      "Built by Tetiaroa Society with DOER Marine and Google, Honu carries scientists and budding oceanographers to reefs and species too deep for a diver to reach.",
    sampleClassName: "max-w-3xl text-base leading-7 text-[#d8e9e4]/82 sm:text-lg",
  },
  {
    id: "program-chips",
    role: "Program chips",
    defaultLeftFontId: "mono",
    defaultRightFontId: "mono",
    sample: (
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.14em]">
          built with doer marine + google
        </span>
        <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.14em]">
          xr field trips for every classroom
        </span>
      </div>
    ),
    sampleClassName: undefined,
  },
  {
    id: "depth-watermark",
    role: "Depth watermark",
    defaultLeftFontId: "header",
    defaultRightFontId: "header",
    sample: "-104",
    sampleClassName:
      "text-[clamp(5rem,10vw,9rem)] uppercase leading-none text-white/[0.18]",
  },
  {
    id: "image-caption",
    role: "Image caption",
    defaultLeftFontId: "mono",
    defaultRightFontId: "mono",
    sample: "honu - design render - doer marine",
    sampleClassName:
      "text-[11px] uppercase tracking-[0.18em] text-[#5be8d4]/80",
  },
  {
    id: "editorial-story-line",
    role: "Editorial story line",
    defaultLeftFontId: "display-italic",
    defaultRightFontId: "display-italic",
    sample: "A classroom can put on a headset and go on a VR field trip to Tetiaroa. FIELD TRIP. f ff fff ",
    sampleClassName: "max-w-2xl text-2xl leading-snug sm:text-3xl",
  },
] as const satisfies readonly QuickScanRow[];

export function getFontOption(id: FontOptionId) {
  return fontOptions.find((font) => font.id === id) ?? fontOptions[0];
}

function FontSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: FontOptionId;
  onChange: (value: FontOptionId) => void;
}) {
  const selectedFont = getFontOption(value);

  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5be8d4]">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as FontOptionId)}
        className={`${selectedFont.className} h-11 w-full rounded-md border border-white/15 bg-[#071017] px-3 text-[15px] leading-none tracking-normal text-[#f4f1ea] outline-none transition hover:border-white/30 focus:border-[#5be8d4]`}
      >
        {fontOptions.map((font) => (
          <option
            key={font.id}
            value={font.id}
            className={`${font.className} bg-[#071017] text-[#f4f1ea]`}
          >
            {font.selectLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function TypePair({
  id,
  role,
  defaultLeftFontId,
  defaultRightFontId,
  leftFontId: controlledLeftFontId,
  onLeftFontChange,
  children,
  sampleClassName = "",
}: TypePairProps) {
  const [localLeftFontId, setLocalLeftFontId] =
    useState<FontOptionId>(defaultLeftFontId);
  const [rightFontId, setRightFontId] = useState<FontOptionId>(
    defaultRightFontId,
  );
  const leftFontId = controlledLeftFontId ?? localLeftFontId;
  const setLeftFontId = (value: FontOptionId) => {
    setLocalLeftFontId(value);
    onLeftFontChange?.(id, value);
  };
  const leftFont = getFontOption(leftFontId);
  const rightFont = getFontOption(rightFontId);

  return (
    <section className="grid gap-3 rounded-lg border border-white/[0.06] bg-white/[0.018] p-3 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-end">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5be8d4]">
          {role}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FontSelect
            id={`${id}-left-font`}
            label="Left font"
            value={leftFontId}
            onChange={setLeftFontId}
          />
          <FontSelect
            id={`${id}-right-font`}
            label="Right font"
            value={rightFontId}
            onChange={setRightFontId}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#5be8d4]/25 bg-[#5be8d4]/[0.055] p-4">
          <div className="font-mono mb-3 text-[10px] uppercase tracking-[0.16em] text-[#5be8d4]">
            Left: {leftFont.label}
          </div>
          <div
            className={`${leftFont.className} text-[#f4f1ea] ${sampleClassName}`}
          >
            {children}
          </div>
        </div>

        <div className="rounded-lg border border-white/12 bg-white/[0.045] p-4">
          <div className="font-mono mb-3 text-[10px] uppercase tracking-[0.16em] text-[#f4f1ea]/55">
            Right: {rightFont.label}
          </div>
          <div
            className={`${rightFont.className} text-[#f4f1ea] ${sampleClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuickScan({
  leftFontIds,
  onLeftFontChange,
}: {
  leftFontIds?: Partial<Record<QuickScanRowId, FontOptionId>>;
  onLeftFontChange?: (rowId: QuickScanRowId, value: FontOptionId) => void;
}) {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5be8d4]">
          Font compare : Left Fonts will update the above real section.
        </div>

        <div className="mt-7 grid gap-5">
          {quickScanRows.map((row) => (
            <TypePair
              key={row.id}
              id={row.id}
              role={row.role}
              defaultLeftFontId={row.defaultLeftFontId}
              defaultRightFontId={row.defaultRightFontId}
              leftFontId={leftFontIds?.[row.id]}
              onLeftFontChange={onLeftFontChange}
              sampleClassName={row.sampleClassName}
            >
              {row.sample}
            </TypePair>
          ))}
        </div>
      </div>
    </section>
  );
}
