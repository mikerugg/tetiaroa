"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { GeologyCopy } from "./geology-content";
import { clampStageIndex, getStageIndex } from "./geology-content";
import { GeologyCrossSection } from "./geology-cross-section";
import styles from "./geology.module.css";

type FormationScrollyProps = Pick<GeologyCopy, "story" | "stages">;

export function FormationScrolly({
  story,
  stages,
}: FormationScrollyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((element, index) => {
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(clampStageIndex(index, stages.length));
          }
        },
        { rootMargin: "-38% 0px -48%", threshold: 0.01 },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [stages.length]);

  const activeStage = stages[activeIndex] ?? stages[0];

  const handleStageChange = (stageId: string) => {
    if (!stageId) {
      return;
    }

    const nextIndex = getStageIndex(stageId, stages);
    setActiveIndex(nextIndex);
    stepRefs.current[nextIndex]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  };

  return (
    <section id="formation" className="bg-background px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <header className="mx-auto flex max-w-4xl flex-col gap-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {story.eyebrow}
          </p>
          <h2 className="font-header text-5xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
            {story.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {story.intro}
          </p>
        </header>

        <div className={styles.scrollyGrid}>
          <div className={styles.stickyVisual}>
            <GeologyCrossSection
              activeStage={activeStage}
              activeIndex={activeIndex}
              ariaLabel={story.ariaLabel}
              title={story.visualTitle}
              summary={story.visualSummary}
            />

            <div className={styles.stageControls}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {story.instructions}
              </p>
              <div className="max-w-full overflow-x-auto pb-1">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  spacing={0}
                  value={activeStage.id}
                  onValueChange={handleStageChange}
                  aria-label={story.instructions}
                  className="min-w-max"
                >
                  {stages.map((stage, index) => (
                    <ToggleGroupItem
                      key={stage.id}
                      value={stage.id}
                      aria-label={`${story.stageLabel} ${index + 1}: ${stage.title}`}
                      className="font-mono"
                    >
                      {stage.number}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </div>

          <div className={styles.storySteps}>
            {stages.map((stage, index) => (
              <article
                key={stage.id}
                ref={(element) => {
                  stepRefs.current[index] = element;
                }}
                className={cn(
                  styles.storyStep,
                  index === activeIndex && styles.storyStepActive,
                )}
                data-stage-step={stage.id}
                aria-current={index === activeIndex ? "step" : undefined}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-header text-6xl leading-none text-primary/35">
                    {stage.number}
                  </span>
                </div>
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {stage.era} · {stage.kicker}
                </p>
                <h3 className="mt-4 max-w-xl font-display text-4xl leading-[1.02] text-foreground sm:text-5xl">
                  {stage.title}
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/85">
                  {stage.summary}
                </p>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  {stage.detail}
                </p>

                <Card size="sm" className="mt-8 max-w-xl border border-border bg-card/70">
                  <CardHeader>
                    <CardTitle className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      {story.factLabel}
                    </CardTitle>
                    <CardDescription className="sr-only">
                      Supporting fact for geological stage {stage.number}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-foreground/80">
                    {stage.fact}
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
