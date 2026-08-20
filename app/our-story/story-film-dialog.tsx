"use client";

import { PlayIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { homeVideoSources } from "../home-video-sources";
import type { OurStoryCopy } from "./our-story-content";

const film = homeVideoSources.societyFilm;

const playerUrl = `${film.embedUrl}?autoPlay=true&playerTheme=dark&playerColor=1f6b6e&type=hd`;

export function StoryFilmDialog({
  copy,
  onOpenChange,
}: {
  copy: OurStoryCopy["hero"];
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="impact"
          size="lg"
          aria-label={`${copy.filmLabel} — ${copy.filmRuntimeLabel}`}
          className="h-auto w-fit rounded-full px-5 py-4 font-mono text-base uppercase tracking-[0.14em]"
        >
          <PlayIcon className="mx-2 flex-shrink-0" data-icon="inline-start" aria-hidden="true" />
          {copy.filmLabel} · {copy.filmRuntime}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-[rgb(3_14_17_/_0.9)] supports-backdrop-filter:backdrop-blur-md"
        className="w-full max-w-[min(90rem,calc(100vw-2rem),calc((100svh-4rem)*16/9))] gap-0 overflow-hidden rounded-2xl bg-black p-0 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.95)] ring-white/10 sm:max-w-[min(90rem,calc(100vw-3rem),calc((100svh-6rem)*16/9))]"
      >
        <DialogTitle className="sr-only">{copy.filmTitle}</DialogTitle>
        <DialogDescription className="sr-only">{copy.filmNote}</DialogDescription>
        <iframe
          className="aspect-video w-full border-0"
          src={playerUrl}
          title={copy.filmTitle}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute right-3 top-3 rounded-full bg-background/40 backdrop-blur-md sm:right-4 sm:top-4"
          >
            <XIcon data-icon="inline-start" aria-hidden="true" />
            <span className="sr-only">{copy.filmClose}</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
