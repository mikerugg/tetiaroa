"use client"

import { PlayIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { homeVideoSources } from "./home-video-sources"

const FILM_URL = `${homeVideoSources.societyFilm.embedUrl}?autoPlay=true`

const filmLabels = {
  en: {
    close: "Close film",
    description: "A film about Tetiaroa Society.",
    title: "Tetiaroa Society film",
  },
  fr: {
    close: "Fermer le film",
    description: "Un film sur la Tetiaroa Society.",
    title: "Film de la Tetiaroa Society",
  },
} as const

export function HomeFilmLightbox({
  className,
  label,
  locale,
}: {
  className?: string
  label: string
  locale: keyof typeof filmLabels
}) {
  const labels = filmLabels[locale]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(className, "h-auto font-mono")}
        >
          <PlayIcon data-icon="inline-start" aria-hidden="true" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="group/video-lightbox w-full max-w-5xl gap-0 overflow-hidden bg-background p-0 ring-foreground/20 sm:max-w-5xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {labels.description}
        </DialogDescription>
        <iframe
          className="aspect-video w-full"
          src={FILM_URL}
          title={labels.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <DialogClose asChild>
          <Button
            aria-label={labels.close}
            className="pointer-events-none absolute top-3 right-3 bg-background/70 opacity-0 transition-opacity group-hover/video-lightbox:pointer-events-auto group-hover/video-lightbox:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 hover:bg-background"
            size="icon-sm"
            variant="ghost"
          >
            <XIcon data-icon="inline-start" aria-hidden="true" />
            <span className="sr-only">{labels.close}</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
