"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export function TypewriterLetter({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const id = setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          clearInterval(id);
          return current;
        }

        return reduceMotion ? text.length : current + 1;
      });
    }, 32);

    return () => clearInterval(id);
  }, [started, text]);

  const done = count >= text.length;

  return (
    <p ref={ref} className={styles.letterBody} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden="true"
        className={`${styles.letterCaret} ${done ? styles.letterCaretDone : ""}`}
      />
    </p>
  );
}
