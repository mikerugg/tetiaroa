"use client";

import dynamic from "next/dynamic";
import { ExpandIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { HomeLocale } from "./home-copy";
import type { SproutVideoSource } from "./home-video-sources";
import { SproutBackgroundVideo } from "./sprout-background-video";
import type { VrViewerLabels } from "./vr-viewer";
import styles from "./home-experience.module.css";

const VrViewer = dynamic(
  () => import("./vr-viewer").then((module) => module.VrViewer),
  { ssr: false },
);

const closeLabels: Record<HomeLocale, string> = {
  en: "Close XR experience",
  fr: "Fermer l’expérience XR",
};

export function SproutVrPreview({
  labels,
  source,
}: {
  labels: VrViewerLabels;
  source: SproutVideoSource;
}) {
  return (
    <div
      className={cn(
        styles.deepPanel,
        "cursor-default! touch-auto! select-auto!",
      )}
    >
      <SproutBackgroundVideo
        className="absolute inset-0 size-full"
        embedUrl={source.embedUrl}
        title={source.title}
        preloadMargin="100% 0px"
      />

      <div className={styles.hudFrame} aria-hidden="true" />
      <div className={styles.reticle} aria-hidden="true" />
      <div className={`${styles.hudFeed} font-mono`} aria-hidden="true">
        <span className={styles.hudDot} />
        {labels.recording}
      </div>
      <div className={`${styles.hudDepth} font-mono`} aria-hidden="true">
        {labels.depth}
      </div>
    </div>
  );
}

export function HomeVrLightbox({
  className,
  label,
  labels,
  locale,
  src,
  title,
}: {
  className?: string;
  label: string;
  labels: VrViewerLabels;
  locale: HomeLocale;
  src: string;
  title: string;
}) {
  const closeLabel = closeLabels[locale];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn(className, "h-auto p-0 font-mono")}
        >
          {label}
          <ExpandIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="group/vr-lightbox w-[calc(100vw-1rem)] max-w-none gap-0 overflow-hidden bg-black p-2 ring-foreground/20 sm:max-w-[min(96vw,1600px)]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {labels.dragHint}
        </DialogDescription>
        <VrViewer
          className="h-[min(82svh,900px)]! min-h-0! rounded-lg"
          src={src}
          labels={labels}
        />
        <DialogClose asChild>
          <Button
            aria-label={closeLabel}
            className="absolute top-4 right-4 bg-background/70 backdrop-blur-sm hover:bg-background"
            size="icon-sm"
            variant="ghost"
          >
            <XIcon data-icon="inline-start" aria-hidden="true" />
            <span className="sr-only">{closeLabel}</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
