import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PillarMedia } from "./pillar-content";

export function PillarMediaFrame({
  media,
  className,
  imageClassName,
  priority = false,
  showCaption = true,
}: {
  media: PillarMedia;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showCaption?: boolean;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-md bg-muted",
        className,
      )}
    >
      {media.kind === "video" ? (
        <video
          className={cn(
            "size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]",
            imageClassName,
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 68vw"
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-[1.02]",
            imageClassName,
          )}
          priority={priority}
        />
      )}
      {showCaption ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgb(7_16_14/.84)_100%)]"
            aria-hidden="true"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.14em] text-white/85 sm:p-6">
            {media.caption}
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}
