import type { CSSProperties } from "react";
import Image from "next/image";
import { Homemade_Apple } from "next/font/google";
import { ArrowUpRightIcon, PlayIcon } from "lucide-react";
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
import { HomepageInitialScrollReset } from "./homepage-client";
import { DepthScene } from "./depth-scene";
import { VrViewer } from "./vr-viewer";
import { LanternDonate } from "./lantern-donate";
import { NightBeatCinema } from "./night-beat-cinema";
import { ScanPanel } from "./scan-panel";
import { BrandoPromiseNote } from "./brando-story/brando-promise-note";
import styles from "./home-experience.module.css";
import { FrenchVersionPrompt } from "./french-version-prompt";
import { SiteFooter } from "./site-footer";
import { TopToolbar } from "./top-toolbar";

const handwriting = Homemade_Apple({ subsets: ["latin"], weight: "400" });

export default function HomeExperience({
  locale = "en",
}: {
  locale?: HomeLocale;
}) {
  const copy = homeCopies[locale];

  return (
    <>
      <DocumentLanguage lang={copy.locale} />
      <HomepageInitialScrollReset />
      <div className={styles.page}>
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(styles.watchCta, "h-auto font-mono")}
            >
              <a href="#dive">
                <PlayIcon data-icon="inline-start" aria-hidden="true" />
                {copy.hero.watchCta}
              </a>
            </Button>
          </div>
        </section>

        <section className={styles.highlight} id="highlight">
          <div className={styles.highlightInner}>
            <figure className={styles.highlightMedia}>
              <div className={styles.highlightFrame}>
                <Image
                  src="/launch-party.jpg"
                  alt={copy.highlight.imageAlt}
                  width={2048}
                  height={1365}
                  className={styles.highlightImage}
                  sizes="(max-width: 860px) 82vw, 460px"
                />
              </div>
              <figcaption className={`${styles.highlightCaption} font-mono`}>
                {copy.highlight.imageCaption}
              </figcaption>
            </figure>
            <div className={styles.highlightCopy}>
              <div className={`${styles.highlightEyebrow} font-mono`}>
                {copy.highlight.eyebrow}
              </div>
              <h2 className={`${styles.highlightTitle} font-header`}>
                {copy.highlight.title}
              </h2>
              <p className={styles.highlightText}>{copy.highlight.copy}</p>
              <Button
                asChild
                variant="outline"
                className={cn(styles.highlightAction, "h-auto font-mono")}
              >
                <a href={copy.highlight.href}>
                  {copy.highlight.cta}
                  <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

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

        <section className={styles.band} id="turtles">
          <div className={`${styles.depthWatermark} font-header`} aria-hidden="true">
            &minus;5
          </div>
          <div className={styles.bandGrid}>
            <div className={styles.bandText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.turtles.kicker}
              </div>
              <h2 className={`${styles.bandTitle} font-header`}>
                {copy.turtles.title}
              </h2>
              <p className={styles.bandCopy}>
                {copy.turtles.copy}
              </p>
              <Badge
                variant="outline"
                className={cn(styles.statChip, "h-auto font-mono")}
              >
                {copy.turtles.stat}
              </Badge>
            </div>
            <div className={styles.bandMedia}>
              <video
                className={styles.mediaVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/turtleclip.mp4" type="video/mp4" />
              </video>
              <Badge
                variant="secondary"
                className={cn(styles.mediaCaption, "h-auto font-mono")}
              >
                {copy.turtles.caption}
              </Badge>
            </div>
          </div>
        </section>

        <section className={styles.band} id="sharks">
          <div className={`${styles.depthWatermark} font-header`} aria-hidden="true">
            &minus;20
          </div>
          <div className={`${styles.bandGrid} ${styles.bandGridFlip}`}>
            <div className={styles.bandText}>
              <div className={`${styles.bandKicker} font-mono`}>
                {copy.sharks.kicker}
              </div>
              <h2 className={`${styles.bandTitle} font-header`}>
                {copy.sharks.title}
              </h2>
              <p className={styles.bandCopy}>
                {copy.sharks.copy}
              </p>
              <Badge
                variant="outline"
                className={cn(styles.statChip, "h-auto font-mono")}
              >
                {copy.sharks.stat}
              </Badge>
            </div>
            <div className={styles.bandMedia}>
              <video
                className={styles.mediaVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/lemon-shark.mp4" type="video/mp4" />
              </video>
              <Badge
                variant="secondary"
                className={cn(styles.mediaCaption, "h-auto font-mono")}
              >
                {copy.sharks.caption}
              </Badge>
            </div>
          </div>
        </section>

        <section className={styles.band} id="twin">
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
        </section>

        <section className={styles.pillars} id="pillars">
          <div className={styles.pillarsInner}>
            <div className={styles.pillarsIntro}>
              <div className={`${styles.pillarsEyebrow} font-mono`}>
                {copy.pillars.eyebrow}
              </div>
              <h2 className={`${styles.pillarsTitle} font-header`}>
                {copy.pillars.title}
              </h2>
              <p className={styles.pillarsCopy}>
                {copy.pillars.copy}
              </p>
            </div>

            <div className={styles.pillarCards}>
              {copy.pillars.items.map((pillar, index) => (
                <article className={styles.pillarCard} key={pillar.title}>
                  <div className={`${styles.pillarNumber} font-header`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className={styles.pillarMedia}>
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      fill
                      className={styles.pillarImage}
                      sizes="(max-width: 960px) 100vw, 260px"
                    />
                  </div>
                  <div className={styles.pillarBody}>
                    <h3 className={`${styles.pillarTitle} font-header`}>
                      {pillar.title}
                    </h3>
                    <p>{pillar.copy}</p>
                    <ul className={styles.pillarAreas}>
                      {pillar.areas.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
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

        <section className={styles.ourStory} id="our-story">
          <div className={styles.ourStoryPlate}>
            <Image
              src="/story/history-living-archive.png"
              alt=""
              fill
              className={styles.ourStoryImage}
              sizes="100vw"
              aria-hidden="true"
            />
            <div className={styles.ourStoryScrim} aria-hidden="true" />
            <div className={styles.ourStoryTexture} aria-hidden="true" />
            <div className={styles.ourStoryFrame} aria-hidden="true" />

            <div className={styles.ourStoryInner}>
              <div className={styles.ourStoryCopy}>
                <div className={`${styles.ourStoryEyebrow} font-mono`}>
                  {copy.story.eyebrow}
                </div>
                <h2 className={`${styles.ourStoryTitle} font-display`}>
                  {copy.story.title}
                </h2>
                <p className={styles.ourStoryLead}>
                  {copy.story.lead}
                </p>
                <p className={styles.ourStoryBody}>
                  {copy.story.body}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(styles.ourStoryCta, "h-auto font-mono")}
                >
                  <a href={copy.story.ctaHref}>
                    {copy.story.cta}
                    <ArrowUpRightIcon
                      data-icon="inline-end"
                      aria-hidden="true"
                    />
                  </a>
                </Button>
              </div>

              <BrandoPromiseNote
                className={`${styles.ourStoryPromiseNote} ${handwriting.className}`}
                lines={copy.story.promiseLines}
              />
            </div>
          </div>
        </section>

        <section className={styles.night} id="lanterns">
          <div className={styles.stars} aria-hidden="true" />
          <div className={styles.nightInner}>
            <NightBeatCinema
              lines={copy.night.beatLines}
              eyebrow={copy.night.eyebrow}
              titleLines={copy.night.titleLines}
            />
            <p className={`${styles.nightClose} font-display`}>
              {copy.night.closeLead}{" "}
              <strong className={styles.nightYours}>
                {copy.night.closeStrong}
              </strong>
            </p>

            <LanternDonate
              tiers={copy.lantern.tiers}
              labels={copy.lantern.labels}
            />
          </div>
        </section>

        <SiteFooter copy={copy.footer} />
      </div>
    </>
  );
}
