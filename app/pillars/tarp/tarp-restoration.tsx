"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LeafIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { GuideImageCredit } from "@/app/atoll/guide-media";
import type { GuideCard } from "@/lib/atoll/types";
import { cn } from "@/lib/utils";
import type { PillarLocale } from "../pillar-content";
import { nativeLife, tarpCopy, type NativeLifeId } from "./tarp-content";
import {
  assetRoot,
  invaders,
  recoveryState,
  regrowth,
  removeInvader,
  type InvaderId,
} from "./tarp-scene";
import styles from "./tarp-motion.module.css";

const spriteFiles = [
  "rat.png",
  "yellow-crazy-ant.png",
  ...nativeLife.map((life) => life.image),
];

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function SpriteArt({ file, className }: { file: string; className?: string }) {
  return (
    <Image
      src={`${assetRoot}/sprites/${file}`}
      alt=""
      width={256}
      height={256}
      sizes="160px"
      draggable={false}
      className={cn(
        "pointer-events-none size-full select-none object-contain",
        className,
      )}
    />
  );
}

export function TarpRestoration({
  locale,
  species,
}: {
  locale: PillarLocale;
  species: Partial<Record<NativeLifeId, Pick<GuideCard, "href" | "image"> | null>>;
}) {
  const copy = tarpCopy[locale];
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  const inView = useInView(stage, { margin: "150px" });
  const loadSprites = useInView(stage, { margin: "400px", once: true });
  const reducedMotion = useReducedMotion();
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [removed, setRemoved] = useState<InvaderId[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [note, setNote] = useState<NativeLifeId | null>(null);
  const [hint, setHint] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const ready = loaded.length === spriteFiles.length + 1 && !failed;
  const recovery = recoveryState(removed);
  const moving = started && ready && !paused && inView && visible && !note;
  const active = started && ready && !paused && !note;
  const native = nativeLife.find((life) => life.id === note);
  const nativeCopy = native?.[locale];
  const guideEntry = note ? species[note] : null;
  const photograph = guideEntry?.image;

  function assetLoaded(id: string) {
    setLoaded((items) => (items.includes(id) ? items : [...items, id]));
  }

  function start() {
    setStarted(true);
    setPaused(false);
    setHint(copy.firstHint);
    setAnnouncement(copy.firstHint);
    viewport.current?.scrollTo({ left: 0, behavior: "instant" });
    frame.current?.scrollIntoView({
      block: "center",
      behavior: reducedMotion ? "instant" : "smooth",
    });
    requestAnimationFrame(() =>
      viewport.current
        ?.querySelector<HTMLButtonElement>("[data-invader]")
        ?.focus({ preventScroll: true }),
    );
  }

  function clear(id: InvaderId, keyboard: boolean) {
    if (!active || removed.includes(id)) return;
    const item = invaders.find((target) => target.id === id)!;
    const next = removeInvader(removed, id);
    const line =
      item.returns === "seedling"
        ? copy.seedlingsHint
        : item.returns === "crab"
          ? copy.crabsHint
          : copy.ternsHint;
    setRemoved((current) => removeInvader(current, id));
    setHint(line);
    setAnnouncement(
      `${item.kind === "rat" ? copy.ratRemoved : copy.antsRemoved} ${line} ${copy.progressLabel}: ${next.length} / ${invaders.length}.`,
    );
    if (keyboard) {
      const nextTarget = invaders.find((target) => !next.includes(target.id));
      requestAnimationFrame(() => {
        const target = viewport.current?.querySelector<HTMLButtonElement>(
          nextTarget ? `[data-invader="${nextTarget.id}"]` : "[data-native]",
        );
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reducedMotion ? "instant" : "smooth",
        });
      });
    }
  }

  function reset() {
    setRemoved([]);
    setStarted(false);
    setPaused(false);
    setNote(null);
    setHint("");
    setAnnouncement(copy.reset);
    viewport.current?.scrollTo({ left: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      startButton.current?.focus({ preventScroll: true }),
    );
  }

  function pan(direction: number) {
    viewport.current?.scrollBy({
      left: direction * 280,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <section
      id="tarp-restoration"
      aria-labelledby="tarp-title"
      className="tarp-theme scroll-mt-20 bg-background px-3 py-16 text-foreground sm:px-8 lg:py-24"
    >
      <div className="mx-auto mb-9 grid max-w-[1400px] gap-5 px-3 sm:px-2 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-16">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            <LeafIcon className="size-4 shrink-0" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h2
            id="tarp-title"
            className="max-w-xl text-balance font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            {copy.title}
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.intro}
        </p>
      </div>

      <div
        ref={frame}
        className="mx-auto max-w-[1440px] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_18px_60px_-30px_rgba(23,62,59,0.4)] sm:rounded-[2.25rem] md:max-w-[min(1440px,calc((80svh-3.5rem-2px)*1672/941+2px))] md:scroll-mt-16"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7 md:h-14 md:flex-nowrap md:py-0">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
            <LeafIcon className="size-4 text-primary" aria-hidden="true" />
            TARP
          </p>
          <div aria-label={copy.progressLabel} className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {copy.ratsLabel} {recovery.rats} / 3
            </Badge>
            <Badge variant="secondary">
              {copy.antsLabel} {recovery.ants} / 3
            </Badge>
          </div>
        </div>
        <div ref={stage} className="relative isolate overflow-hidden bg-lagoon">
          {loadSprites && (
            <div key={retry} className="sr-only" aria-hidden="true">
              {spriteFiles.map((file) => (
                <Image
                  key={file}
                  src={`${assetRoot}/sprites/${file}`}
                  alt=""
                  width={256}
                  height={256}
                  sizes="160px"
                  loading="eager"
                  onLoad={() => assetLoaded(file)}
                  onError={() => setFailed(true)}
                />
              ))}
            </div>
          )}
          <div
            ref={viewport}
            role="region"
            aria-label={copy.sceneLabel}
            aria-describedby="tarp-pan-hint"
            tabIndex={0}
            className="overflow-x-auto overscroll-x-contain outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary"
            onPointerDown={beginDrag}
            onPointerMove={(event) => {
              if (drag.current)
                event.currentTarget.scrollLeft =
                  drag.current.scroll - (event.clientX - drag.current.x);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
          >
            <div
              className={cn(
                "relative aspect-[1672/941] min-w-[760px] md:min-w-0",
                styles.scene,
              )}
              data-paused={!moving || reducedMotion}
            >
              <Image
                key={retry}
                src={`${assetRoot}/island-base.png`}
                alt=""
                fill
                sizes="(min-width: 1440px) 1440px, (min-width: 800px) 100vw, 800px"
                draggable={false}
                onLoad={() => assetLoaded("island")}
                onError={() => setFailed(true)}
                className="pointer-events-none select-none object-cover transition-[filter] duration-1000 motion-reduce:transition-none"
                style={{ filter: `saturate(${0.85 + removed.length * 0.045})` }}
              />

              <AnimatePresence>
                {started &&
                  regrowth
                    .filter((plant) => removed.length >= plant.after)
                    .map((plant) => (
                      <motion.div
                        key={`${plant.x}-${plant.y}`}
                        aria-hidden="true"
                        initial={
                          reducedMotion ? false : { opacity: 0, scale: 0.3 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.9,
                          delay: reducedMotion ? 0 : 0.15,
                        }}
                        className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 origin-bottom"
                        style={{
                          left: `${plant.x}%`,
                          top: `${plant.y}%`,
                          width: `${plant.width}%`,
                        }}
                      >
                        <SpriteArt
                          file="native-seedling.png"
                          className={styles.breathe}
                        />
                      </motion.div>
                    ))}
              </AnimatePresence>

              <AnimatePresence>
                {started &&
                  recovery.cleared.map((item) => {
                    const life = nativeLife.find(
                      (entry) => entry.id === item.returns,
                    )!;
                    return (
                      <motion.button
                        key={`native-${item.id}`}
                        type="button"
                        data-native={item.returns}
                        aria-label={life[locale].discoverLabel}
                        disabled={!active}
                        initial={
                          reducedMotion
                            ? false
                            : { opacity: 0, scale: 0.4, y: -6 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.7 }}
                        whileHover={reducedMotion ? undefined : { scale: 1.07 }}
                        onClick={(event) => {
                          returnFocus.current = event.currentTarget;
                          setNote(item.returns);
                        }}
                        className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-offset-2"
                        style={{
                          left: `${item.returnX}%`,
                          top: `${item.returnY}%`,
                          width: item.returns === "tern" ? "13%" : "11%",
                        }}
                      >
                        <SpriteArt
                          file={life.image}
                          className={
                            item.returns === "tern"
                              ? styles.flutter
                              : styles.breathe
                          }
                        />
                      </motion.button>
                    );
                  })}
              </AnimatePresence>

              <AnimatePresence>
                {started &&
                  invaders
                    .filter((item) => !removed.includes(item.id))
                    .map((item, index) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        data-invader={item.id}
                        aria-label={`${item.kind === "rat" ? copy.removeRat : copy.removeAnts} ${item.id.at(-1)}`}
                        disabled={!active}
                        initial={
                          reducedMotion ? false : { opacity: 0, scale: 0.7 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.25,
                          pointerEvents: "none",
                        }}
                        transition={{ duration: reducedMotion ? 0 : 0.3 }}
                        whileHover={reducedMotion ? undefined : { scale: 1.1 }}
                        whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                        onClick={(event) => clear(item.id, event.detail === 0)}
                        className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-3 focus-visible:ring-primary focus-visible:ring-offset-2"
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          width: `${item.width}%`,
                        }}
                      >
                        <span
                          className={cn("block size-full", styles.wander)}
                          style={{ animationDelay: `${-index * 0.7}s` }}
                        >
                          {item.kind === "rat" ? (
                            <SpriteArt
                              file="rat.png"
                              className={
                                item.mirror ? "-scale-x-100" : undefined
                              }
                            />
                          ) : (
                            <span
                              className="relative block size-full"
                              aria-hidden="true"
                            >
                              {[0, 1, 2].map((ant) => (
                                <span
                                  key={ant}
                                  className="absolute block size-[62%]"
                                  style={{
                                    left: `${ant === 1 ? 35 : 2}%`,
                                    top: `${ant * 21}%`,
                                    transform: `rotate(${ant === 1 ? -18 : 14}deg)`,
                                  }}
                                >
                                  <SpriteArt file="yellow-crazy-ant.png" />
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                      </motion.button>
                    ))}
              </AnimatePresence>
            </div>
          </div>

          {(!ready || failed) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 p-6 text-center">
              <p role="status" className="flex items-center gap-3 text-sm">
                {!failed && <Spinner />}
                {failed ? copy.error : copy.loading}
              </p>
              {failed && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoaded([]);
                    setFailed(false);
                    setRetry((value) => value + 1);
                  }}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  {copy.retry}
                </Button>
              )}
            </div>
          )}
          {ready && !started && (
            <div className="absolute inset-x-5 bottom-6 max-w-sm rounded-2xl border border-border bg-card/95 p-5 shadow-lg backdrop-blur-sm sm:left-auto sm:right-8 sm:bottom-8 sm:p-7">
              <h3 className="font-display text-3xl leading-tight">
                {copy.startTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy.startBody}
              </p>
              <Button
                ref={startButton}
                size="lg"
                className="mt-5 rounded-full px-5"
                onClick={start}
              >
                {copy.start}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          )}
          {started && ready && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-[color:var(--ink)]/65 to-transparent"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute left-5 right-20 top-5 sm:left-20 sm:top-7 sm:text-center">
                <motion.p
                  key={
                    paused ? "paused" : recovery.complete ? "complete" : hint
                  }
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto max-w-xl text-balance font-display text-2xl italic leading-tight text-[color:var(--paper)] [text-shadow:0_2px_12px_var(--ink)] sm:text-3xl"
                >
                  {paused
                    ? copy.pauseHint
                    : recovery.complete
                      ? copy.completeTitle
                      : hint}
                </motion.p>
              </div>
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label={paused ? copy.resume : copy.pause}
                  aria-pressed={paused}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? (
                    <PlayIcon data-icon="inline-start" />
                  ) : (
                    <PauseIcon data-icon="inline-start" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={reset}
                  aria-label={copy.reset}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => pan(-1)}
                  aria-label={copy.panLeft}
                >
                  <ArrowLeftIcon data-icon="inline-start" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => pan(1)}
                  aria-label={copy.panRight}
                >
                  <ArrowRightIcon data-icon="inline-start" />
                </Button>
              </div>
              {recovery.species.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary">
                    <LeafIcon />
                    {copy.returningLabel} {recovery.species.length} / 3
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <p
        id="tarp-pan-hint"
        className="mx-auto mt-3 max-w-[1440px] text-center text-xs text-muted-foreground md:sr-only"
      >
        {copy.panHint}
      </p>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </p>

      {recovery.complete && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-8 flex max-w-5xl flex-col items-start justify-between gap-6 px-3 sm:flex-row sm:items-center"
        >
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {copy.completeBody}
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={locale === "fr" ? "/fr/island/guide" : "/island/guide"}>
              {copy.explore}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </motion.div>
      )}

      <Dialog
        open={Boolean(note)}
        onOpenChange={(open) => {
          if (!open) setNote(null);
        }}
      >
        <DialogContent
          className="tarp-theme max-h-[85svh] overflow-y-auto sm:max-w-lg"
          showCloseButton={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus({ preventScroll: true });
          }}
        >
          {native && nativeCopy && (
            <>
              <DialogHeader>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {nativeCopy.name}
                </p>
                <DialogTitle>{nativeCopy.title}</DialogTitle>
                <DialogDescription>{nativeCopy.body}</DialogDescription>
              </DialogHeader>
              {photograph ? (
                <figure className="min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={photograph.url}
                      alt={nativeCopy.name}
                      fill
                      sizes="(max-width: 639px) calc(100vw - 5rem), 464px"
                      className="object-contain"
                    />
                  </div>
                  <GuideImageCredit image={photograph} locale={locale} />
                </figure>
              ) : native.id === "seedling" ? (
                <div className="mx-auto size-48 sm:size-56">
                  <SpriteArt file={native.image} />
                </div>
              ) : null}
              <Link
                href={guideEntry?.href ?? nativeCopy.guideHref}
                className="inline-flex items-center gap-2 text-xs text-primary underline underline-offset-4"
              >
                {nativeCopy.name} · {copy.guideLabel}
                <ArrowRightIcon
                  className="size-3 shrink-0"
                  aria-hidden="true"
                />
              </Link>
              <DialogClose asChild>
                <Button size="lg" className="rounded-full">
                  {copy.close}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
