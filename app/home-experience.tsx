import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DocumentLanguage } from "./document-language";
import { homeCopies, type HomeLocale } from "./home-copy";
import { ENGLISH_DONATE_PATH, FRENCH_DONATE_PATH } from "./language-links";
import { HomepageInitialScrollReset } from "./homepage-client";
import { DepthScene } from "./depth-scene";
import { LanternExperience } from "./lantern-experience";
import styles from "./home-experience.module.css";
import { FrenchVersionPrompt } from "./french-version-prompt";
import { SitePopup } from "./site-popup/site-popup";
import { SiteFooter } from "./site-footer";
import { TopToolbar } from "./top-toolbar";
import { HomeHighlightCarousel } from "./home-highlight-carousel";
import { HomePillarCards } from "./home-pillar-cards";
import { HomeStoryHandoff } from "./home-story-handoff";
import { HomepageViewportFrame } from "./homepage-viewport-frame";
import { HomeFilmLightbox } from "./home-film-lightbox";
import { homeVideoSources } from "./home-video-sources";
import { SproutBackgroundVideo } from "./sprout-background-video";
import { HomeVrLightbox, SproutVrPreview } from "./home-vr-experience";
import type { HomepageHighlight } from "@/lib/impact/homepage-highlight";

export default function HomeExperience({
  locale = "en",
  highlights = [],
}: {
  locale?: HomeLocale;
  highlights?: HomepageHighlight[];
}) {
  const copy = homeCopies[locale];
  const visibleKidPrograms = copy.kids.programs.filter(
    (program) => program.href !== "/turtle-tales",
  );
  const homepageHighlights = highlights.length
    ? highlights
    : [
        {
          id: `fallback-${locale}`,
          title: copy.highlight.title,
          summary: copy.highlight.copy,
          image: copy.highlight.image,
          imageAlt: copy.highlight.imageAlt,
          href: copy.highlight.href,
        },
      ];

  return (
    <>
      <DocumentLanguage lang={copy.locale} />
      <HomepageInitialScrollReset />
      <HomepageViewportFrame className={styles.page}>
        <DepthScene stops={copy.depthStops} ariaLabel={copy.depthAriaLabel} />
        <TopToolbar copy={copy.toolbar} homepageLayout />
        {copy.locale === "en" ? <FrenchVersionPrompt /> : null}
        <SitePopup locale={copy.locale} />

        <section className={styles.hero} id="hero">
          <SproutBackgroundVideo
            className={styles.heroVideo}
            embedUrl={homeVideoSources.hero.embedUrl}
            title={homeVideoSources.hero.title}
            eager
            poster="/homepage-hero-placeholder.png"
          />
          <div className={styles.heroScrim} aria-hidden="true" />

          <div className={`${styles.cornerCoords} font-mono`}>
            17&deg; 00&apos; 18&quot; S / 149&deg; 34&apos; 13&quot; W
            <br />
            {copy.hero.coordinatesPlace}
          </div>

          <div className={styles.heroInner}>
            {/* <div className={styles.heroBadge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Now streaming from Teti&#39;aroa
            </div> */}
            <h1 className={`${styles.heroTitle} ${styles.homeHeroTitle} font-header`}>
              {copy.hero.titleLine1}
              <br />
              <span className={styles.heroTitleAccent}>
                {copy.hero.titleLine2}
              </span>
            </h1>
            <HomeFilmLightbox
              className={styles.watchCta}
              label={copy.hero.watchCta}
              locale={copy.locale}
            />
          </div>
        </section>

        <HomeHighlightCarousel
          highlights={homepageHighlights}
          labels={copy.highlight}
        />

        <section className={styles.hero} id="dive">
          <SproutBackgroundVideo
            className={styles.heroVideo}
            embedUrl={homeVideoSources.atoll.embedUrl}
            title={homeVideoSources.atoll.title}
            poster="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=85&auto=format&fit=crop"
          />
          <div className={styles.heroScrim} aria-hidden="true" />

          <div className={`${styles.heroInner} ${styles.diveInner}`}>
            <div className={`${styles.eyebrow} font-mono`}>
              {copy.dive.eyebrow}
            </div>
            <h2 className={`${styles.heroTitle} font-header`}>
              {copy.dive.title}
            </h2>
            <p className={styles.heroSub}>
              {copy.dive.copy}
            </p>
          </div>

          <div className={`${styles.diveCue} font-mono`} aria-hidden="true">
            {copy.dive.cue}
            <span className={styles.diveChevron} />
          </div>
        </section>

        <section className={styles.deep} id="honu-xr">
          <div className={styles.deepInner}>
            <div className={styles.deepHead}>
              <div className={styles.deepText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.honu.kickerLine1}
                <br />
                {copy.honu.kickerLine2}
              </div>
              <h2 className={`${styles.bandTitle} ${styles.deepTitle} font-header`}>
                {copy.honu.title}
              </h2>
              <p className={`${styles.bandCopy} ${styles.deepCopy}`}>
                {copy.honu.copy}
              </p>
              <div className={styles.deepChips}>
                <Badge
                  variant="outline"
                  className={cn(styles.statChip, "h-auto font-mono")}
                >
                  {copy.honu.chips[0]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(styles.statChip, "h-auto font-mono")}
                >
                  {copy.honu.chips[1]}
                </Badge>
              </div>
            </div>
              <figure className={styles.deepRender}>
                <Image
                  src="/sub-render.webp"
                  alt={copy.honu.renderAlt}
                  width={1318}
                  height={1030}
                  className={styles.deepRenderImage}
                  sizes="(width < 1024px) 80vw, 480px"
                />
                <figcaption className={`${styles.deepRenderCaption} font-mono`}>
                  {copy.honu.renderCaption}
                </figcaption>
              </figure>
            </div>
            <SproutVrPreview
              source={homeVideoSources.vrClip}
              labels={copy.honu.viewer}
            />
            <HomeVrLightbox
              className={styles.deepCta}
              label={copy.honu.cta}
              labels={copy.honu.viewer}
              locale={copy.locale}
              src="/vr-clip.mp4"
              title={copy.honu.title}
            />
          </div>
        </section>

        <section className={`${styles.band} ${styles.sanctuaryBand}`} id="sanctuary">
          <div className={styles.sanctuaryGrid}>
            <div
              className={cn(
                styles.bandMedia,
                styles.sanctuaryMedia,
                "isolate transform-gpu",
              )}
            >
              <SproutBackgroundVideo
                className={styles.mediaVideo}
                embedUrl={homeVideoSources.sanctuary.embedUrl}
                title={homeVideoSources.sanctuary.title}
              />
              <Badge
                variant="secondary"
                className={cn(styles.mediaCaption, "h-auto font-mono")}
              >
                {copy.sanctuary.caption}
              </Badge>
            </div>

            <div className={styles.sanctuaryText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.sanctuary.kickerLine1}
                <br />
                {copy.sanctuary.kickerLine2}
              </div>
              <h2 className={`${styles.bandTitle} font-header`}>
                {copy.sanctuary.title}
              </h2>
              <p className={styles.bandCopy}>
                {copy.sanctuary.copy}
              </p>
              <div className={styles.sanctuaryStats}>
                {copy.sanctuary.stats.map((stat) => (
                  <Badge
                    key={stat}
                    variant="outline"
                    className={cn(styles.statChip, "h-auto font-mono")}
                  >
                    {stat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <aside className="mx-auto max-w-[1320px]" aria-labelledby="guardians-title">
            <a className={styles.logoCallout} href={copy.sanctuary.guardians.href}>
              <div className="relative my-3 aspect-3/2 overflow-hidden rounded-md">
                <Image
                  src="/stations/bailey-field-station/rangers.webp"
                  alt={copy.sanctuary.guardians.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(width < 640px) 86vw, (width < 1024px) 320px, 380px"
                />
              </div>
              <div className={styles.logoCalloutCopy}>
                <div className={cn(styles.logoCalloutEyebrow, "font-mono")}>
                  {copy.sanctuary.guardians.eyebrow}
                </div>
                <h3 id="guardians-title" className={cn(styles.logoCalloutTitle, "font-display")}>
                  {copy.sanctuary.guardians.title}
                </h3>
                <p>{copy.sanctuary.guardians.copy}</p>
                <span className={cn(styles.logoCalloutAction, "font-mono")}>
                  {copy.sanctuary.guardians.cta}
                  <ArrowUpRightIcon className={styles.logoCalloutActionIcon} aria-hidden="true" />
                </span>
              </div>
            </a>
          </aside>
        </section>

        <section className={styles.band} id="restoration" aria-labelledby="restoration-title">
          <div className="mx-auto grid max-w-[1240px] items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-[clamp(32px,5vw,80px)]">
            <div className="relative aspect-4/3 overflow-hidden rounded-[22px]">
              <Image
                src="/pillars/research-conservation/seabird-restoration.webp"
                alt={copy.restoration.imageAlt}
                fill
                className="object-cover"
                sizes="(width < 1024px) 86vw, 40vw"
              />
            </div>
            <div>
              <div className={cn(styles.bandKicker, "font-mono")}>
                {copy.restoration.kickerLine1}
                <br />
                {copy.restoration.kickerLine2}
              </div>
              <h2 id="restoration-title" className={cn(styles.bandTitle, "font-header")}>
                {copy.restoration.title}
              </h2>
              <div className="flex flex-col gap-5">
                {copy.restoration.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.bandCopy}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.band} ${styles.swacBand}`} id="swac">
          <div className={styles.bandGrid}>
            <div className={styles.bandText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.swac.kickerLine1}
                <br />
                {copy.swac.kickerLine2}
              </div>
              <h2 className={`${styles.bandTitle} font-header`}>
                {copy.swac.title}
              </h2>
              <p className={styles.bandCopy}>
                {copy.swac.copy}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  styles.statChip,
                  "h-auto max-w-full whitespace-normal text-center font-mono",
                )}
              >
                {copy.swac.stat}
              </Badge>
            </div>
            <Link
              href={copy.swac.href}
              aria-label={copy.swac.cta}
              className={cn(
                styles.scanPanel,
                "group block outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <Image
                src={copy.swac.image}
                alt={copy.swac.imageAlt}
                fill
                unoptimized
                className={styles.mediaImage}
                sizes="(width < 1024px) 100vw, 46vw"
              />
              <span
                className={cn(
                  buttonVariants({ variant: "impact", size: "lg" }),
                  "pointer-events-none absolute bottom-5 left-1/2 h-auto -translate-x-1/2 whitespace-nowrap px-4 py-3 group-hover:border-primary group-hover:bg-lagoon group-hover:text-ink-light! group-focus-visible:border-primary group-focus-visible:bg-lagoon group-focus-visible:text-ink-light! lg:px-5",
                )}
              >
                {copy.swac.cta}
                <ArrowUpRightIcon
                  data-icon="inline-end"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>

          <div className={styles.impactFeedCtaWrap}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(styles.impactFeedCta, "h-auto max-w-full font-mono")}
            >
              <a href={copy.impactFeedCta.href}>
                {copy.impactFeedCta.label}
                <ArrowUpRightIcon
                  data-icon="inline-end"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
        </section>

        <section className={styles.pillars} id="pillars">
          <div className="relative mx-auto max-w-[1380px] lg:pr-[clamp(0px,calc(50vw-560px),128px)]">
            <HomePillarCards
              copy={copy.pillars.copy}
              eyebrow={copy.pillars.eyebrow}
              items={copy.pillars.items}
              title={copy.pillars.title}
            />
          </div>
        </section>

        <section className={styles.shallows} id="kids">
          <div className={styles.shallowsInner}>
            <div className={`${styles.shallowsEyebrow} font-mono`}>
              {copy.kids.eyebrow}
            </div>
            <h2 className={styles.shallowsTitle}>
              <span className={`${styles.shallowsTitleLead} ${styles.wavy} font-header`}>
                {copy.kids.titleLead}
              </span>
              <br />
              <em className={`${styles.shallowsTitleEmphasis} font-display`}>
                {copy.kids.titleEmphasis}
              </em>
            </h2>
            <p className={styles.shallowsCopy}>
              {copy.kids.copy}
            </p>

            <div className={cn(styles.kidCards, "grid-cols-1 lg:grid-cols-2")}>
              {visibleKidPrograms.map((program) => (
                <Card
                  key={program.title}
                  size="sm"
                  className={cn(styles.kidCard, "gap-0 py-0")}
                >
                  <div className={styles.kidMedia}>
                    <Image
                      src={program.image}
                      alt={program.alt}
                      fill
                      className={cn(
                        styles.mediaImage,
                        program.imageFit === "contain" &&
                          styles.mediaImageContain,
                      )}
                      sizes="(width < 1024px) 100vw, 320px"
                    />
                  </div>
                  <CardHeader className={styles.kidBody}>
                    <Badge
                      variant="secondary"
                      className={cn(styles.kidBadge, "h-auto font-mono")}
                    >
                      {program.badge}
                    </Badge>
                    <CardTitle className={`${styles.kidTitle} font-display`}>
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={styles.kidCardContent}>
                    <p className={styles.kidCopy}>{program.copy}</p>
                  </CardContent>
                  <CardFooter className={styles.kidFooter}>
                    <Button
                      asChild
                      variant="link"
                      className={cn(styles.kidAction, "h-auto p-0 font-mono")}
                    >
                      <a href={program.href}>
                        {program.cta}
                        <ArrowUpRightIcon
                          data-icon="inline-end"
                          aria-hidden="true"
                        />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className={styles.shallowsBanner}>
              <SproutBackgroundVideo
                className={styles.mediaVideo}
                embedUrl={homeVideoSources.turtleCare.embedUrl}
                title={homeVideoSources.turtleCare.title}
                poster="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80&auto=format&fit=crop"
                posterSizes="(width < 1024px) 100vw, 1180px"
              />
              <Badge
                variant="secondary"
                className={cn(styles.mediaCaption, "h-auto font-mono")}
              >
                {copy.kids.bannerCaption}
              </Badge>
            </div>

            <aside>
              <a
                className={styles.logoCallout}
                href={copy.kids.logoCallout.href}
              >
                <div className={styles.logoCalloutMark}>
                  <Image
                    src={copy.kids.logoCallout.image}
                    alt={copy.kids.logoCallout.alt}
                    fill
                    className={styles.logoCalloutMarkImage}
                    sizes="(width < 1024px) 180px, 220px"
                  />
                </div>
                <div className={styles.logoCalloutCopy}>
                  <div className={`${styles.logoCalloutEyebrow} font-mono`}>
                    {copy.kids.logoCallout.eyebrow}
                  </div>
                  <h3 className={`${styles.logoCalloutTitle} font-display`}>
                    {copy.kids.logoCallout.title}
                  </h3>
                  <p>{copy.kids.logoCallout.copy}</p>
                  <span className={`${styles.logoCalloutAction} font-mono`}>
                    {copy.kids.logoCallout.cta}
                    <ArrowUpRightIcon
                      className={styles.logoCalloutActionIcon}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </a>
            </aside>
          </div>
        </section>

        <HomeStoryHandoff copy={copy.story} />

        <section
          id="lanterns"
          style={{ scrollMarginTop: "var(--site-header-height)" }}
        >
          <LanternExperience
            night={copy.night}
            tiers={copy.lantern.tiers}
            labels={copy.lantern.labels}
            donatePath={
              copy.locale === "fr" ? FRENCH_DONATE_PATH : ENGLISH_DONATE_PATH
            }
          />
        </section>

        <SiteFooter copy={copy.footer} homepageLayout />
      </HomepageViewportFrame>
    </>
  );
}
