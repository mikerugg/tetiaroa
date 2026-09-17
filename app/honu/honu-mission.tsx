import { HonuAdventure } from "./cartoon/honu-adventure";
import { adventureCopy as copy } from "./cartoon/adventure-content";

export function HonuMission() {
  return (
    <section
      id="field-mission"
      className="honu-cartoon-theme scroll-mt-36 bg-background py-20 text-foreground lg:py-28"
      aria-labelledby="mission-title"
    >
      <div className="mx-auto mb-10 grid max-w-[1400px] gap-6 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            02 / {copy.eyebrow}
          </p>
          <h2
            id="mission-title"
            className="font-display text-[clamp(3rem,5.7vw,5.5rem)] leading-[1.02] tracking-[-0.045em]"
          >
            {copy.title}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-muted-foreground lg:pb-1 lg:text-base">
          {copy.intro}
        </p>
      </div>
      <HonuAdventure />
    </section>
  );
}
