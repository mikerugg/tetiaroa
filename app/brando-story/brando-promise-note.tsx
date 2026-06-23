"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import styles from "./story-pages.module.css";

type BrandoPromiseNoteProps = {
  className: string;
  lines: string[];
};

export function BrandoPromiseNote({
  className,
  lines,
}: BrandoPromiseNoteProps) {
  const noteRef = useRef<HTMLElement>(null);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const note = noteRef.current;

    if (!note) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWriting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.42 },
    );

    observer.observe(note);

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      ref={noteRef}
      className={`${className} ${isWriting ? styles.promiseNoteWriting : ""}`}
      aria-label="Brando promise note"
    >
      <span className={styles.noteText} aria-label={lines.join(" ")}>
        {lines.map((line, index) => (
          <span
            aria-hidden="true"
            className={styles.inkLine}
            key={line}
            style={{ "--line-delay": `${360 + index * 560}ms` } as CSSProperties}
          >
            <span>{line}</span>
          </span>
        ))}
      </span>
    </aside>
  );
}
