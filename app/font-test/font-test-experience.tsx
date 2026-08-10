"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  getFontOption,
  QuickScan,
  quickScanRows,
  type FontOptionId,
  type QuickScanRowId,
} from "./quick-scan";

const defaultLeftFontIds = Object.fromEntries(
  quickScanRows.map((row) => [row.id, row.defaultLeftFontId]),
) as Record<QuickScanRowId, FontOptionId>;

export function FontTestExperience() {
  const [leftFontIds, setLeftFontIds] =
    useState<Record<QuickScanRowId, FontOptionId>>(defaultLeftFontIds);

  const setLeftFontId = useCallback(
    (rowId: QuickScanRowId, fontId: FontOptionId) => {
      setLeftFontIds((currentFontIds) => {
        if (currentFontIds[rowId] === fontId) {
          return currentFontIds;
        }

        return {
          ...currentFontIds,
          [rowId]: fontId,
        };
      });
    },
    [],
  );

  const getRealSectionFontClass = (rowId: QuickScanRowId) =>
    getFontOption(leftFontIds[rowId]).className;

  return (
    <main className="min-h-screen bg-[#02070b] text-[var(--paper)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5be8d4] hover:text-[#9ff6ea]"
        >
          Back to home
        </Link>
      </div>

      <section className="overflow-hidden bg-[radial-gradient(circle_at_18%_16%,rgba(91,232,212,0.2),transparent_30%),radial-gradient(circle_at_86%_84%,rgba(226,74,43,0.14),transparent_28%),linear-gradient(135deg,#06131d_0%,#02050a_52%,#071426_100%)] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <div className="max-w-4xl">
            <div
              className={`${getRealSectionFontClass("section-kicker")} text-sm font-semibold uppercase leading-relaxed tracking-[0.22em] text-[#5be8d4]`}
            >
              Project 01 &mdash; Honu XR
              <br />
              the deep-water submersible
            </div>

            <h1
              className={`${getRealSectionFontClass("hero-headline")} mt-8 max-w-5xl text-[clamp(3.25rem,5.6vw,6.5rem)] uppercase leading-[0.92] tracking-[0.01em] text-[#f4f1ea]`}
            >
              Meet Honu. Built to bring the ocean to everyone.
            </h1>

            <p
              className={`${getRealSectionFontClass("body-paragraph")} mt-8 max-w-2xl text-base leading-7 text-[#d8e9e4]/82 sm:text-lg`}
            >
              Built by Tetiaroa Society with DOER Marine and Google, Honu
              carries scientists and budding oceanographers to reefs and species
              too deep for a diver to reach.
            </p>

            <div
              className={`${getRealSectionFontClass("program-chips")} mt-8 flex flex-wrap gap-3`}
            >
              <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#f4f1ea]/82">
                built with doer marine + google
              </span>
              <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#f4f1ea]/82">
                xr field trips for every classroom
              </span>
            </div>
          </div>

          <figure className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#030912]/70 px-5 py-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] sm:min-h-[520px] sm:px-7">
            <div
              className={`${getRealSectionFontClass("depth-watermark")} absolute left-5 top-4 text-[clamp(7rem,14vw,13rem)] uppercase leading-none text-white/[0.13] sm:left-8`}
            >
              -104
            </div>

            <Image
              src="/sub-render.webp"
              alt="Render of the Honu submersible"
              width={1318}
              height={1030}
              className="relative z-10 mx-auto mt-24 h-auto w-full max-w-[620px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
              priority
              sizes="(max-width: 1280px) 90vw, 620px"
            />

            <figcaption className="relative z-10 mt-8 grid gap-4">
              <div
                className={`${getRealSectionFontClass("image-caption")} text-[11px] uppercase tracking-[0.18em] text-[#5be8d4]/80`}
              >
                honu - design render - doer marine
              </div>
              <p
                className={`${getRealSectionFontClass("editorial-story-line")} max-w-xl text-2xl leading-snug text-[#f4f1ea] sm:text-3xl`}
              >
                A classroom can put on a headset and go on a VR field trip to
                Tetiaroa.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <QuickScan
        leftFontIds={leftFontIds}
        onLeftFontChange={setLeftFontId}
      />
    </main>
  );
}
