import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { VrViewer } from "./vr-viewer";
import { SanctuaryVideo } from "./sanctuary-video";
import { LanternExperience } from "./lantern-experience";
import { ScanPanel } from "./scan-panel";
import styles from "./home-experience.module.css";
import { FrenchVersionPrompt } from "./french-version-prompt";
import { SiteFooter } from "./site-footer";
import { TopToolbar } from "./top-toolbar";
import { HomeHighlightCarousel } from "./home-highlight-carousel";
import { HomePillarCards } from "./home-pillar-cards";
import { HomeStoryHandoff } from "./home-story-handoff";
import { HomepageViewportFrame } from "./homepage-viewport-frame";
import { HomeFilmLightbox } from "./home-film-lightbox";
import type { HomepageHighlight } from "@/lib/impact/homepage-highlight";

export default function HomeExperience({
  locale = "en",
  highlights = [],
}: {
  locale?: HomeLocale;
  highlights?: HomepageHighlight[];
}) {
  const copy = homeCopies[locale];
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
        <TopToolbar copy={copy.toolbar} />
        {copy.locale === "en" ? <FrenchVersionPrompt /> : null}

        <section className={styles.hero} id="hero">
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2400&q=85&auto=format&fit=crop"
            aria-hidden="true"
          >
            <source src="/turtleclip.mp4" type="video/mp4" />
          </video>
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
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=85&auto=format&fit=crop"
            aria-hidden="true"
          >
            <source src="/atoll.mp4" type="video/mp4" />
          </video>
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
          <div className={`${styles.depthWatermark} font-header`} aria-hidden="true">
            &minus;104
          </div>
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
                  src="/sub-render.png"
                  alt={copy.honu.renderAlt}
                  width={1318}
                  height={1030}
                  className={styles.deepRenderImage}
                  sizes="(max-width: 960px) 80vw, 480px"
                />
                <figcaption className={`${styles.deepRenderCaption} font-mono`}>
                  {copy.honu.renderCaption}
                </figcaption>
              </figure>
            </div>
            <VrViewer src="/vr-clip.mp4" labels={copy.honu.viewer} />
            <Button
              asChild
              variant="link"
              className={cn(styles.deepCta, "h-auto p-0 font-mono")}
            >
              <a
                href="https://www.youtube.com/watch?v=B9IGe7s6Ook"
                target="_blank"
                rel="noreferrer"
              >
                {copy.honu.cta}
                <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </section>

        <section className={`${styles.band} ${styles.sanctuaryBand}`} id="sanctuary">
          <div className={`${styles.depthWatermark} font-header`} aria-hidden="true">
            &minus;5/20
          </div>
          <div className={styles.sanctuaryGrid}>
            <div className={`${styles.bandMedia} ${styles.sanctuaryMedia}`}>
              <SanctuaryVideo
                className={styles.mediaVideo}
                clips={[{ src: "/turtleclip.mp4" }, { src: "/lemon-shark.mp4" }]}
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
                {copy.sanctuary.kicker}
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
        </section>

        <section className={`${styles.band} ${styles.twinBand}`} id="twin">
          <div className={`${styles.depthWatermark} font-header`} aria-hidden="true">
            &minus;40
          </div>
          <div className={styles.bandGrid}>
            <div className={styles.bandText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.twin.kicker}
              </div>
              <h2 className={`${styles.bandTitle} font-header`}>
                {copy.twin.title}
              </h2>
              <p className={styles.bandCopy}>
                {copy.twin.copy}
              </p>
              <Badge
                variant="outline"
                className={cn(styles.statChip, "h-auto font-mono")}
              >
                {copy.twin.stat}
              </Badge>
            </div>
            <ScanPanel>
              <Image
                src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1400&q=85&auto=format&fit=crop"
                alt={copy.twin.imageAlt}
                fill
                className={styles.mediaImage}
                sizes="(max-width: 960px) 100vw, 46vw"
              />
              <div className={styles.scanGrid} aria-hidden="true" />
              <div className={styles.scanLine} aria-hidden="true" />
              <div className={styles.scanReadouts}>
                {copy.twin.readouts.map((readout) => (
                  <Badge
                    key={readout.label}
                    variant="secondary"
                    className={cn(styles.readout, "h-auto font-mono")}
                    style={{ "--at": readout.at } as CSSProperties}
                  >
                    {readout.label}
                  </Badge>
                ))}
              </div>
            </ScanPanel>
          </div>

          <div className={styles.impactFeedCtaWrap}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(styles.impactFeedCta, "h-auto font-mono")}
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
          <div className="relative mx-auto max-w-[1380px] xl:pr-32">
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

            <div className={styles.kidCards}>
              {copy.kids.programs.map((program) => (
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
                      sizes="(max-width: 700px) 100vw, 320px"
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
              <video
                className={styles.mediaVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/turtlecare.mp4" type="video/mp4" />
              </video>
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
                    sizes="(max-width: 720px) 180px, 220px"
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

        <SiteFooter copy={copy.footer} />
      </HomepageViewportFrame>
    </>
  );
}
