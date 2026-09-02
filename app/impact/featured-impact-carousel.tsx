"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type {
  ImpactFeedItem,
  ImpactLanguage,
} from "@/lib/impact/types";

const featuredCopy: Record<
  ImpactLanguage,
  {
    heading: string;
    carouselLabel: string;
    previousLabel: string;
    nextLabel: string;
    ofLabel: string;
  }
> = {
  en: {
    heading: "Featured",
    carouselLabel: "Featured stories from Tetiaroa",
    previousLabel: "Previous featured stories",
    nextLabel: "Next featured stories",
    ofLabel: "of",
  },
  fr: {
    heading: "À la une",
    carouselLabel: "Histoires de Tetiaroa à la une",
    previousLabel: "Histoires à la une précédentes",
    nextLabel: "Histoires à la une suivantes",
    ofLabel: "sur",
  },
};

export function FeaturedImpactCarousel({
  projects,
  locale,
}: {
  projects: ImpactFeedItem[];
  locale: ImpactLanguage;
}) {
  if (!projects.length) {
    return null;
  }

  const copy = featuredCopy[locale];
  const hasMultipleProjects = projects.length > 1;

  return (
    <section
      aria-labelledby="featured-impact-heading"
      className="mx-auto max-w-[1540px] px-4 py-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="overflow-hidden rounded-2xl bg-card/70 p-4 ring-1 ring-foreground/10 sm:p-5">
        <Carousel
          opts={{ align: "start", containScroll: "trimSnaps", dragFree: true }}
          aria-label={copy.carouselLabel}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="featured-impact-heading" className="font-display text-2xl">
              {copy.heading}
            </h2>

            {hasMultipleProjects ? (
              <div className="flex shrink-0 gap-2">
                <CarouselPrevious
                  className="static"
                  aria-label={copy.previousLabel}
                />
                <CarouselNext
                  className="static"
                  aria-label={copy.nextLabel}
                />
              </div>
            ) : null}
          </div>

          <CarouselContent className="-ml-3 mt-4">
            {projects.map((project, index) => (
              <CarouselItem
                key={project.id}
                className="basis-[84%] pl-3 sm:basis-[48%] lg:basis-[32%] xl:basis-[27%]"
                aria-label={`${index + 1} ${copy.ofLabel} ${projects.length}: ${project.title}`}
              >
                <Link
                  href={project.href}
                  aria-label={project.title}
                  className="group block h-full rounded-xl outline-none"
                >
                  <Card
                    size="sm"
                    className="h-full gap-0 py-0 transition-shadow group-hover:ring-foreground/20 group-focus-visible:ring-2 group-focus-visible:ring-ring"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        draggable={false}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, (max-width: 1280px) 32vw, 27vw"
                      />
                    </div>

                    <CardHeader className="gap-1.5 px-4 py-4">
                      <CardTitle>
                        <h3 className="line-clamp-2">{project.title}</h3>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 leading-5">
                        {project.summary}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
