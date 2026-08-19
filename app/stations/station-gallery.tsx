"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { StationImage } from "./stations-content";

export function StationGallery({
  images,
  label,
}: {
  images: StationImage[];
  label: string;
}) {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <div className="flex items-center justify-end gap-2 pb-5">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
      <CarouselContent className="-ml-4" aria-label={label}>
        {images.map((image) => (
          <CarouselItem
            key={image.src}
            className="pl-4 sm:basis-2/3 lg:basis-1/2 xl:basis-2/5"
          >
            <figure className="flex h-full flex-col gap-3">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 62vw, 42vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-sm leading-6 text-muted-foreground">
                {image.caption}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
