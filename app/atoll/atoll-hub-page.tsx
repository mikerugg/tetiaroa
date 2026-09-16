import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { getAtollPath } from "@/lib/atoll/config";
import type { GuideImage, GuideLocale } from "@/lib/atoll/types";
import { getAtollHub } from "@/lib/sanity/atoll";
import { cn } from "@/lib/utils";
import { atollCopy } from "./atoll-copy";
import { AtollShell } from "./atoll-shell";
import { GuideImageCredit } from "./guide-media";

export async function AtollHubPage({ locale }: { locale: GuideLocale }) {
  const hub = await getAtollHub(locale);
  const copy = atollCopy[locale];
  const destinations: { path: string; title: string; description: string; image: GuideImage }[] = [
    { path: "guide", title: copy.guide, description: copy.speciesDestinationDescription, image: { url: "/wildlife/green-sea-turtle.webp", alt: "" } },
    { path: "geology", title: locale === "fr" ? "Géologie" : "Geology", description: copy.geologyDestinationDescription, image: { url: "/geology/atoll-foundation-poster.webp", alt: "" } },
    { path: "swac", title: "SWAC", description: copy.swacDestinationDescription, image: { url: "/swac/cooling-preview.svg", alt: "" } },
  ];

  return <AtollShell locale={locale} alternateHref={getAtollPath(locale === "en" ? "fr" : "en")}>
    <div className="mx-auto max-w-7xl px-5 pt-7 pb-12 sm:px-8 md:pt-10 md:pb-16 lg:px-12">
      <h1 className="mb-6 font-display text-4xl leading-tight sm:text-5xl md:mb-9">{copy.atoll}</h1>
      <nav aria-label={copy.atoll}>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {destinations.map((destination) => {
            const href = getAtollPath(locale, destination.path);
            const editorial = hub.experiences?.find((experience) => experience.href?.replace(/^\/fr\//, "/") === getAtollPath("en", destination.path));
            const image = editorial?.image?.url ? editorial.image : destination.image;
            return <li key={destination.path} className="min-w-0">
              <figure className="h-full">
                <Link href={href} className="group grid min-h-40 grid-cols-[43%_1fr] overflow-hidden rounded-sm bg-card outline-offset-4 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring md:grid-cols-1">
                  <div className="relative min-h-40 overflow-hidden md:aspect-[4/5]">
                    <Image src={image.url} alt="" fill loading="eager" sizes={destination.path === "geology" ? "(max-width: 767px) 80vw, (max-width: 1279px) 65vw, 840px" : "(max-width: 767px) 50vw, (max-width: 1279px) 40vw, 480px"} className={cn(destination.path === "swac" ? "object-contain" : "object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]")} />
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-4 md:min-h-40 md:justify-start md:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-header text-4xl leading-none md:text-5xl">{destination.title}</h2>
                      <ArrowRightIcon aria-hidden="true" className="size-5 shrink-0 text-primary transition-transform motion-safe:group-hover:translate-x-1" />
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-muted-foreground">{editorial?.description || destination.description}</p>
                  </div>
                </Link>
                <GuideImageCredit image={image} locale={locale} />
              </figure>
            </li>;
          })}
        </ul>
      </nav>
    </div>
  </AtollShell>;
}
