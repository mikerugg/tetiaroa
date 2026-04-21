"use client";

import type { CSSProperties } from "react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import styles from "./page.module.css";

type ChronologyEntry = {
  year: string;
  label: string;
  title: string;
  description: string;
};

export function ChronologySection({
  items,
}: {
  items: ChronologyEntry[];
}) {
  const [activeYear, setActiveYear] = useState(items[0]?.year ?? "");
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleEntries = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    const visibleEntries = entries.filter((entry) => entry.isIntersecting);

    if (visibleEntries.length === 0) {
      return;
    }

    visibleEntries.sort((left, right) => {
      const viewportAnchor = window.innerHeight * 0.42;
      const leftCenter =
        left.boundingClientRect.top + left.boundingClientRect.height / 2;
      const rightCenter =
        right.boundingClientRect.top + right.boundingClientRect.height / 2;

      return Math.abs(leftCenter - viewportAnchor) - Math.abs(rightCenter - viewportAnchor);
    });

    const nextYear = visibleEntries[0].target.getAttribute("data-year");

    if (nextYear) {
      setActiveYear(nextYear);
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        handleEntries(entries);
      },
      {
        rootMargin: "-18% 0px -42% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    items.forEach((item) => {
      const card = cardRefs.current[item.year];

      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const activeNode = nodeRefs.current[activeYear];

    if (activeNode) {
      activeNode.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeYear]);

  const activeIndex = Math.max(
    items.findIndex((item) => item.year === activeYear),
    0,
  );
  const progress =
    items.length > 1 ? `${(activeIndex / (items.length - 1)) * 100}%` : "0%";

  return (
    <section className={styles.chronologySection} id="chronology">
      <div className={styles.chronologyWrap}>
        <div className={styles.chronologyIntro}>
          <div className={styles.sectionLead}>
            <div className={styles.sectionTag}>The chronology</div>
            <h2 className={styles.chronologyTitle}>
              Track the work.
              <br />
              <span className={styles.emphasis}>Follow the turn</span> in each year.
            </h2>
          </div>
          <p className={styles.chronologyCopy}>
            Move through six decisive moments. As you scroll, each node marks
            the next step in protecting Tetiaroa.
          </p>
        </div>

        <div className={styles.chronologySticky}>
          <div
            className={styles.chronologyRail}
            style={{ "--chronology-progress": progress } as CSSProperties}
          >
            <div className={styles.chronologyTrack} aria-hidden="true" />
            <div className={styles.chronologyProgress} aria-hidden="true" />
            <div className={styles.chronologyNodes}>
              {items.map((item) => {
                const isActive = item.year === activeYear;

                return (
                  <button
                    key={item.year}
                    ref={(node) => {
                      nodeRefs.current[item.year] = node;
                    }}
                    type="button"
                    className={
                      isActive
                        ? `${styles.chronologyNode} ${styles.chronologyNodeActive}`
                        : styles.chronologyNode
                    }
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => {
                      cardRefs.current[item.year]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                  >
                    <span className={styles.chronologyNodeMarker} aria-hidden="true" />
                    <span className={styles.chronologyNodeYear}>{item.year}</span>
                    <span className={styles.chronologyNodeLabel}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.chronologyCards}>
          {items.map((item) => {
            const isActive = item.year === activeYear;

            return (
              <article
                key={item.year}
                ref={(node) => {
                  cardRefs.current[item.year] = node;
                }}
                data-year={item.year}
                className={
                  isActive
                    ? `${styles.chronologyCard} ${styles.chronologyCardActive}`
                    : styles.chronologyCard
                }
                aria-current={isActive ? "step" : undefined}
              >
                <div className={styles.chronologyCardMeta}>
                  <div className={styles.chronologyCardYear}>{item.year}</div>
                  <div className={styles.chronologyCardLabel}>{item.label}</div>
                </div>
                <div className={styles.chronologyCardBody}>
                  <h3 className={styles.chronologyCardTitle}>{item.title}</h3>
                  <p className={styles.chronologyCardCopy}>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
