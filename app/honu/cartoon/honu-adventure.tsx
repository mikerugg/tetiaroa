"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  EyeIcon,
  FishIcon,
  CompassIcon,
  LightbulbIcon,
  LightbulbOffIcon,
  PauseIcon,
  PlayIcon,
  RadarIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OceanCanvas, type OceanHandle } from "./ocean-canvas";
import {
  adventureCopy as copy,
  neighbors,
  type NeighborId,
} from "./adventure-content";

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HonuAdventure() {
  const ocean = useRef<OceanHandle>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { margin: "150px" });
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => true,
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [started, setStarted] = useState(false);
  const [hasSteered, setHasSteered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [sonarPulse, setSonarPulse] = useState(0);
  const [whaleScanned, setWhaleScanned] = useState(false);
  const [nearby, setNearby] = useState<NeighborId | null>(null);
  const [discoveries, setDiscoveries] = useState<NeighborId[]>([]);
  const [openNote, setOpenNote] = useState<NeighborId | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const neighbor = neighbors.find((item) => item.id === nearby);
  const note = neighbors.find((item) => item.id === openNote);
  const controlsEnabled = ready && started && !paused && !failed;
  const canObserve = Boolean(
    neighbor &&
    (discoveries.includes(neighbor.id) ||
      ((neighbor.id !== "jellyfish" || lightsOn) &&
        (neighbor.id !== "octopus" || lightsOn) &&
        (neighbor.id !== "whale" || whaleScanned))),
  );
  const sceneHint = neighbor
    ? discoveries.includes(neighbor.id)
      ? neighbor.after
      : canObserve && "readyHint" in neighbor
        ? neighbor.readyHint
        : neighbor.hint
    : hasSteered
      ? null
      : copy.exploreHint;
  const dismissSteeringHint = useCallback(() => setHasSteered(true), []);
  const sceneReady = useCallback(() => {
    setReady(true);
    setFailed(false);
  }, []);
  const sceneError = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);
  const receiveNearby = useCallback(
    (value: NeighborId | null) => setNearby(value),
    [],
  );

  function startDive() {
    setStarted(true);
    setPaused(false);
    setAnnouncement(
      "All aboard. Tap the water or use the arrow keys to steer HONU.",
    );
    stage.current?.querySelector("canvas")?.focus({ preventScroll: true });
    stage.current?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "center",
    });
  }

  function sonar() {
    setSonarPulse((value) => value + 1);
    stage.current?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "center",
    });
    if (nearby === "whale") {
      setWhaleScanned(true);
      setAnnouncement("There it is. A sperm whale.");
    } else {
      setAnnouncement("Sonar sent. Look ahead for signs of life.");
    }
  }

  function observe() {
    if (!nearby || !canObserve) return;
    setDiscoveries((items) =>
      items.includes(nearby) ? items : [...items, nearby],
    );
    setOpenNote(nearby);
    setAnnouncement(`${neighbor?.name} discovered.`);
  }

  function resetDive() {
    ocean.current?.reset();
    setDiscoveries([]);
    setNearby(null);
    setLightsOn(false);
    setWhaleScanned(false);
    setSonarPulse(0);
    setPaused(false);
    setStarted(false);
    setAnnouncement("Dive reset. Ready to start again.");
  }

  return (
    <>
      <section
        id="adventure"
        aria-label="Your HONU dive"
        className="mx-auto max-w-[1480px] scroll-mt-5 px-3 sm:px-8"
      >
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_18px_60px_-30px_rgba(23,62,59,0.4)] sm:rounded-[2.25rem]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <CompassIcon className="size-5 text-primary" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] sm:text-xs">
                Your first dive
              </p>
            </div>
            <Badge variant="secondary">
              <FishIcon />
              {discoveries.length} / {neighbors.length} discoveries
            </Badge>
          </div>
          <div
            ref={stage}
            className="relative h-[480px] overflow-hidden bg-lagoon sm:h-[520px] lg:h-[580px]"
          >
            <OceanCanvas
              key={retry}
              ref={ocean}
              active={
                started && !paused && !openNote && inView && visible && !failed
              }
              lightsOn={lightsOn}
              sonarPulse={sonarPulse}
              discovered={discoveries}
              reducedMotion={reducedMotion}
              onNearbyChange={receiveNearby}
              onSteer={dismissSteeringHint}
              onReady={sceneReady}
              onError={sceneError}
            />
            {started && ready && !paused && !failed && sceneHint && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-[color:var(--ink)]/60 via-[color:var(--ink)]/20 to-transparent"
                />
                <div
                  className={cn(
                    "pointer-events-none absolute left-5 right-16 top-6 flex flex-col items-start gap-4 sm:inset-x-16 sm:top-8 sm:items-center sm:text-center",
                    !neighbor && "top-44 sm:top-8",
                    neighbor?.id === "turtle" &&
                      "bottom-36 top-auto sm:bottom-auto",
                  )}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <motion.div
                    key={sceneHint}
                    initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.7 }}
                    className="flex max-w-xl flex-col gap-2 text-[color:var(--paper)] [text-shadow:0_2px_12px_var(--ink),0_0_28px_var(--glow)] sm:gap-3"
                  >
                    {neighbor && (
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--paper)]/80 sm:text-[10px]">
                        {neighbor.route}
                      </p>
                    )}
                    <p className="text-pretty font-display text-xl italic leading-[1.2] sm:text-3xl lg:text-[34px]">
                      {sceneHint}
                    </p>
                  </motion.div>
                  {neighbor && canObserve && (
                    <Button
                      disabled={!controlsEnabled}
                      onClick={observe}
                      className="pointer-events-auto rounded-full px-4"
                    >
                      <EyeIcon data-icon="inline-start" />
                      {discoveries.includes(neighbor.id)
                        ? "Learn more"
                        : neighbor.action}
                    </Button>
                  )}
                </div>
              </>
            )}
            {started && ready && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-16 rounded-full"
                onClick={resetDive}
                aria-label="Restart dive"
              >
                <RotateCcwIcon data-icon="inline-start" />
              </Button>
            )}
            {started && ready && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-4 rounded-full"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Resume adventure" : "Pause adventure"}
                aria-pressed={paused}
              >
                {paused ? (
                  <PlayIcon data-icon="inline-start" />
                ) : (
                  <PauseIcon data-icon="inline-start" />
                )}
              </Button>
            )}
            {!ready && !failed && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <p role="status" className="flex items-center gap-3 text-sm">
                  <Spinner />
                  Getting HONU ready…
                </p>
              </div>
            )}
            {failed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 p-6 text-center">
                <p role="status">Your dive couldn’t load. Please try again.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFailed(false);
                    setReady(false);
                    setRetry((value) => value + 1);
                  }}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  Try again
                </Button>
              </div>
            )}
            {!started && ready && (
              <div className="absolute inset-x-4 bottom-5 max-w-sm rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-auto sm:right-7 sm:p-6">
                <p className="mb-2 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                  First stop: the reef
                </p>
                <h2 className="font-display text-2xl leading-tight sm:text-3xl">
                  {copy.startTitle}
                </h2>
                <p className="mt-3 hidden text-sm leading-6 text-muted-foreground sm:block">
                  {copy.startBody}
                </p>
                <Button
                  size="lg"
                  className="mt-3 rounded-full px-5 sm:mt-5"
                  onClick={startDive}
                >
                  {copy.start}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            )}
            {started && paused && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/20">
                <p className="rounded-full bg-card px-6 py-3 font-display text-2xl">
                  Dive paused.
                </p>
              </div>
            )}
            {started && ready && (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                <div
                  className="pointer-events-auto ml-auto flex flex-col gap-2 sm:flex-row"
                  role="group"
                  aria-label="Submersible controls"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-4"
                    disabled={!controlsEnabled}
                    aria-pressed={lightsOn}
                    onClick={() => {
                      setLightsOn((value) => !value);
                      stage.current?.scrollIntoView({
                        behavior: reducedMotion ? "instant" : "smooth",
                        block: "center",
                      });
                    }}
                    aria-label={lightsOn ? "Turn lamps off" : "Turn lamps on"}
                  >
                    {lightsOn ? (
                      <LightbulbOffIcon data-icon="inline-start" />
                    ) : (
                      <LightbulbIcon data-icon="inline-start" />
                    )}
                    {lightsOn ? "Turn lamps off" : "Turn lamps on"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-4"
                    disabled={!controlsEnabled}
                    onClick={sonar}
                  >
                    <RadarIcon data-icon="inline-start" />
                    Sonar
                  </Button>
                </div>
                <div
                  className="pointer-events-auto order-first grid grid-cols-3 gap-1 lg:hidden"
                  role="group"
                  aria-label="Steer HONU"
                >
                  <span />
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    disabled={!controlsEnabled}
                    onClick={() => ocean.current?.move(0, -1)}
                    aria-label="Steer up"
                  >
                    <ArrowUpIcon data-icon="inline-start" />
                  </Button>
                  <span />
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    disabled={!controlsEnabled}
                    onClick={() => ocean.current?.move(-1, 0)}
                    aria-label="Steer left"
                  >
                    <ArrowLeftIcon data-icon="inline-start" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    disabled={!controlsEnabled}
                    onClick={() => ocean.current?.move(0, 1)}
                    aria-label="Steer down"
                  >
                    <ArrowDownIcon data-icon="inline-start" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    disabled={!controlsEnabled}
                    onClick={() => ocean.current?.move(1, 0)}
                    aria-label="Steer right"
                  >
                    <ArrowRightIcon data-icon="inline-start" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </section>

      <Dialog
        open={Boolean(note)}
        onOpenChange={(open) => {
          if (!open) setOpenNote(null);
        }}
      >
        <DialogContent className="honu-cartoon-theme max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          {note && (
            <>
              <DialogHeader>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {note.name}
                </p>
                <DialogTitle>{note.title}</DialogTitle>
                <DialogDescription>{note.fact}</DialogDescription>
              </DialogHeader>
              <figure className="flex flex-col gap-2">
                <Image
                  src={note.photo.src}
                  alt={note.photo.alt}
                  width={note.photo.width}
                  height={note.photo.height}
                  sizes="(max-width: 639px) calc(100vw - 80px), 526px"
                  className="h-auto w-full rounded-xl"
                />
                <figcaption className="text-[10px] leading-relaxed text-muted-foreground">
                  Photo:{" "}
                  <a
                    href={note.photo.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {note.photo.credit}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  {" · "}
                  <a
                    href={note.photo.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {note.photo.license}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </figcaption>
              </figure>
              <Separator />
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs text-primary">
                  <CompassIcon className="size-4" aria-hidden="true" />
                  On board HONU · {note.tool}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {note.subFact}
                </p>
              </div>
              <Link
                href={note.guideHref}
                className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4"
              >
                {note.guideLabel}
                <ArrowRightIcon className="size-3 shrink-0" aria-hidden="true" />
              </Link>
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => setOpenNote(null)}
              >
                Keep exploring
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
