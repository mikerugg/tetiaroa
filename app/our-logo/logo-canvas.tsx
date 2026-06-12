"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Motif, MotifId } from "./motifs";
import { TetiaroaLogo } from "./tetiaroa-logo";
import styles from "./page.module.css";

type LogoCanvasProps = {
  motifs: Motif[];
};

type MotifProgressVar =
  | `--progress-${MotifId}`
  | `--reveal-${MotifId}`;

type ProgressVars = CSSProperties & Record<MotifProgressVar, string>;

const REVEAL_SCROLL_FACTOR = 1;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);

  return t * t * (3 - 2 * t);
}

export function LogoCanvas({ motifs }: LogoCanvasProps) {
  const sequenceRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<MotifId>(motifs[0].id);
  const [highlightId, setHighlightId] = useState<MotifId | null>(null);

  const initialVars = useMemo(() => {
    return motifs.reduce(
      (vars, motif) => ({
        ...vars,
        [`--progress-${motif.id}`]: "0",
        [`--reveal-${motif.id}`]: "0%",
      }),
      {} as ProgressVars,
    );
  }, [motifs]);

  useEffect(() => {
    const sequence = sequenceRef.current;

    if (!sequence) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let start = 0;
    let end = 1;
    let anchors: number[] = [];
    let frame = 0;

    const measure = () => {
      const rect = sequence.getBoundingClientRect();
      const panels = Array.from(
        sequence.querySelectorAll<HTMLElement>("[data-motif-panel]"),
      );
      const lastPanel = panels.at(-1);

      start = rect.top + window.scrollY;
      end = lastPanel
        ? lastPanel.getBoundingClientRect().bottom + window.scrollY
        : start + sequence.offsetHeight;
      anchors = panels.map((panel) => {
        const heading = panel.querySelector<HTMLElement>("h2");
        const anchor = heading ?? panel;
        const anchorRect = anchor.getBoundingClientRect();

        return anchorRect.top + window.scrollY;
      });
    };

    const apply = () => {
      frame = 0;

      if (anchors.length === 0) {
        return;
      }

      const probe = window.scrollY + window.innerHeight;
      let activeIndex = 0;

      while (
        activeIndex < anchors.length - 1 &&
        probe >= anchors[activeIndex + 1]
      ) {
        activeIndex += 1;
      }

      const currentAnchor = anchors[activeIndex] ?? start;
      const nextAnchor =
        activeIndex < anchors.length - 1 ? anchors[activeIndex + 1] : end;
      const span = Math.max(nextAnchor - currentAnchor, 1);
      const activeProgress = clamp((probe - currentAnchor) / span, 0, 1);
      const nextActive = motifs[activeIndex].id;

      setActiveId((current) => (current === nextActive ? current : nextActive));

      motifs.forEach((motif, index) => {
        const local = reducedMotion
          ? index <= activeIndex
            ? 1
            : 0
          : index < activeIndex
            ? 1
            : index === activeIndex
              ? smoothstep(activeProgress / REVEAL_SCROLL_FACTOR)
              : 0;

        sequence.style.setProperty(
          `--progress-${motif.id}`,
          local.toFixed(3),
        );
        sequence.style.setProperty(
          `--reveal-${motif.id}`,
          `${(local * 100).toFixed(1)}%`,
        );
      });
    };

    const requestApply = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(apply);
    };

    const handleResize = () => {
      measure();
      requestApply();
    };

    measure();
    apply();

    window.addEventListener("scroll", requestApply, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestApply);
      window.removeEventListener("resize", handleResize);
    };
  }, [motifs]);

  return (
    <>
      <section
        ref={sequenceRef}
        className={styles.sequence}
        id="drawing"
        style={initialVars}
        aria-label="Scroll through the seven symbols in the Tetiaroa Society mark"
      >
        <div className={styles.stickyStage} aria-hidden="true">
          <div className={styles.stageGrid} />
          <div className={styles.stageHalo} />
          <TetiaroaLogo
            className={styles.stageLogo}
            activeId={activeId}
            title="Tetiaroa Society logo motifs drawing in sequence"
          />
          <div className={styles.stageCaption}>
            <span>{motifs.find((motif) => motif.id === activeId)?.shortName}</span>
            <span>{motifs.findIndex((motif) => motif.id === activeId) + 1}/07</span>
          </div>
        </div>

        <div className={styles.panelTrack}>
          {motifs.map((motif, index) => (
            <article
              className={[
                styles.motifPanel,
                index % 2 === 1 ? styles.motifPanelAlt : "",
                activeId === motif.id ? styles.motifPanelActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-motif-panel={motif.id}
              key={motif.id}
            >
              <div className={styles.panelNumber}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <h2>{motif.title}</h2>
              <p>{motif.meaning}</p>
              <div className={styles.keywordRow} aria-label={`${motif.title} keywords`}>
                {motif.keywords.map((keyword) => (
                  <span className={styles.statChip} key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.finale}
        id="legend"
        style={
          motifs.reduce(
            (vars, motif) => ({
              ...vars,
              [`--progress-${motif.id}`]: "1",
              [`--reveal-${motif.id}`]: "100%",
            }),
            {} as ProgressVars,
          )
        }
      >
        <div className={styles.finaleIntro}>
          <h2>Stronger together.</h2>
          <p>
            The story of Tetiaroa told in seven signs: the hands
            that build, the waves that feed life, the birds that carry
            messages, the light of research, and the strength to keep the
            atoll whole for the children who come next.
          </p>
        </div>

        <div className={styles.finaleGrid}>
          <div className={styles.finalMark}>
            <TetiaroaLogo
              className={styles.finalSymbol}
              activeId={highlightId}
              showWordmark
              title="Complete Tetiaroa Society logo with seven highlighted motifs"
            />
          </div>

          <div className={styles.legendList} aria-label="Logo motif legend">
            {motifs.map((motif, index) => (
              <button
                className={[
                  styles.legendItem,
                  highlightId === motif.id ? styles.legendItemActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={motif.id}
                type="button"
                onBlur={() => setHighlightId(null)}
                onClick={() =>
                  setHighlightId((current) =>
                    current === motif.id ? null : motif.id,
                  )
                }
                onFocus={() => setHighlightId(motif.id)}
                onMouseEnter={() => setHighlightId(motif.id)}
                onMouseLeave={() => setHighlightId(null)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{motif.shortName}</strong>
                <em>{motif.keywords.join(" / ")}</em>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
