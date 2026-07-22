"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { OurStoryCopy } from "./our-story-content";

type Chapter = OurStoryCopy["chapters"][number];

export function StoryChapterNav({ chapters }: { chapters: readonly Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0].id);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      () => {
        const passed = sections.filter(
          (section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35,
        );
        const current = passed[passed.length - 1] ?? sections[0];

        if (current) setActiveId(current.id as Chapter["id"]);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Our story chapters"
      className="sticky top-14 z-30 border-y border-border bg-background/92 backdrop-blur-xl md:top-16"
    >
      <div className="mx-auto flex max-w-[1600px] overflow-x-auto px-3 sm:px-6 lg:px-10">
        {chapters.map((chapter, index) => {
          const isActive = activeId === chapter.id;

          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => setActiveId(chapter.id)}
              className={cn(
                "group flex min-w-max flex-1 items-center gap-3 border-b-2 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors sm:px-5 sm:text-xs",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-primary/70">{String(index + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{chapter.label}</span>
              <span className="sm:hidden">{chapter.shortLabel}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
