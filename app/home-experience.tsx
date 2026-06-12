import Image from "next/image";
import Link from "next/link";
import { HomepageInitialScrollReset } from "../homepage-client";
import { DepthScene, type DepthStop } from "./depth-scene";
import { VrViewer } from "./vr-viewer";
import { LanternDonate, type LanternTier } from "./lantern-donate";
import { NightBeatCinema } from "./night-beat-cinema";
import { ScanPanel } from "./scan-panel";
import styles from "./page.module.css";

const depthStops: DepthStop[] = [
  {
    id: "hero",
    depth: 0,
    label: "Surface",
    color: "#2ea8b5",
    transmission: "0 m — thanks for diving with us",
  },
  {
    id: "dive",
    depth: 0,
    label: "The dive",
    color: "#1e96a6",
    transmission: "ballast trimmed — ready when you are",
  },
  {
    id: "honu-xr",
    depth: 104,
    label: "Honu XR",
    color: "#02060e",
    transmission: "−104 m — this is my dive. welcome aboard",
  },
  {
    id: "turtles",
    depth: 5,
    label: "Turtle sanctuary",
    color: "#0e7e8a",
    transmission: "−5 m — nursery on the port side",
  },
  {
    id: "sharks",
    depth: 20,
    label: "Shark nursery",
    color: "#0b4e66",
    transmission: "−20 m — easy… juveniles on the reef edge",
  },
  {
    id: "twin",
    depth: 40,
    label: "Digital twin",
    color: "#071f33",
    transmission: "−40 m — scanning. the twin is in sync",
  },
  {
    id: "kids",
    depth: 2,
    label: "The shallows",
    color: "#8fd8cf",
    transmission: "surfacing — warm water ahead",
  },
  {
    id: "history",
    depth: 0,
    label: "1967",
    color: "#d9a05f",
    transmission: "back at the waterline — 1967",
  },
  {
    id: "lanterns",
    depth: 0,
    label: "Night beach",
    color: "#04101e",
    transmission: "night ops — the chain starts on this beach",
  },
];

const lanternTiers: LanternTier[] = [
  {
    amount: "$25",
    period: "/mo",
    name: "Friend",
    description: "Keeps a patrol equipped on the beach — tags, batteries, red torches.",
  },
  {
    amount: "$100",
    period: "/mo",
    name: "Steward",
    description: "One full turtle-patrol night during nesting season.",
  },
  {
    amount: "$500",
    period: "/mo",
    name: "Patron",
    description:
      "A month of the science that travels — Ecostation fieldwork and the digital twin in sync.",
  },
  {
    amount: "$—",
    period: "/mo",
    name: "Your own",
    description: "Pick an amount, or fund a program directly.",
    custom: true,
  },
];

const nightEyebrow = "We need you";
const nightTitleLines: [string, string] = [
  "What hatches here",
  "doesn't stay here.",
];

// one subtitle per beat, one line on screen at a time
const beatLines = [
  "On Teti'aroa, a nest begins to hatch — the patrol guides 96 baby turtles to the water.",
  "Footage and data from the night steam to our servers and across the world.",
  "In a classroom on the other side of the world, a child puts on a headset and discovers a passion for the ocean.",
  "One of those kids starts a local beach clean-up.",
  "25 years later, one of those sea turtle hatchlings returns to the same beach to lay her own eggs.",
  "Those kids, now grown, start their own conservation projects and teach their own children about our place in this world.",
];

const scanReadouts = [
  { label: "bathymetry — mapped", at: 0.3 },
  { label: "reef cover — resolved", at: 0.52 },
  { label: "biocode — 167 spp sequenced", at: 0.74 },
];

const kidPrograms = [
  {
    badge: "Ages 6+",
    title: "Snorkel school",
    copy: "First fins, first reef. Lagoon safety and species spotting before the homework starts.",
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=900&q=80&auto=format&fit=crop",
    alt: "Bright coral in shallow water",
  },
  {
    badge: "Nesting season",
    title: "Junior night patrol",
    copy: "Kids walk a real nesting beach with the turtle team — torches off, eyes up.",
    image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=900&q=80&auto=format&fit=crop",
    alt: "Sea turtle near the surface at night",
  },
  {
    badge: "Every term",
    title: "Ora Hoa classroom",
    copy: "Ora Hoa — 'friends of life' — brings Polynesian students and Polynesian science to the Ecostation all year long.",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&q=80&auto=format&fit=crop",
    alt: "Students learning outdoors",
  },
];

const historyFrames = [
  {
    year: "1960",
    caption:
      "Filming Mutiny on the Bounty, Marlon Brando climbed the rigging and saw a ring of sand on the horizon.",
    image:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2000&q=85&auto=format&fit=crop",
    alt: "Aerial view of a Polynesian atoll",
  },
  {
    year: "1967",
    caption: "He bought Tetiaroa and set one rule: hold the atoll intact.",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=2000&q=85&auto=format&fit=crop",
    alt: "Sea turtle on a tropical beach at golden hour",
  },
];

export default function DescentPage() {
  return (
    <>
      <HomepageInitialScrollReset />
      <div className={styles.page}>
        <DepthScene stops={depthStops} />

        <nav className={styles.topNav}>
          <Link href="/descent" className={styles.brand}>
            <Image
              src="/logos/TSFP_Logo_2026_White.png"
              alt="Tetiaroa Society"
              width={596}
              height={371}
              className={styles.brandLogo}
              priority
            />
          </Link>
          <span className={styles.conceptTag}>
            Concept 01 / Te Hohonu &middot; the deep
          </span>
          <div className={styles.navLinks}>
            <Link href="/">Current homepage</Link>
            <a href="#lanterns" className={styles.donateLink}>
              Donate
            </a>
          </div>
        </nav>

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

          <div className={styles.cornerCoords}>
            17&deg; 00&apos; 18&quot; S / 149&deg; 34&apos; 13&quot; W
            <br />
            Society Islands / French Polynesia
          </div>

          <div className={styles.heroInner}>
            {/* <div className={styles.heroBadge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Now streaming from Teti&#39;aroa
            </div> */}
            <h1 className={styles.heroTitle}>
              Save the island.
              <br />
              <span className={styles.heroTitleAccent}>Save the world.</span>
            </h1>
            <a href="#dive" className={styles.watchCta}>
              <span className={styles.playIcon} aria-hidden="true" />
              Watch the film / 2:14
            </a>
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

          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>Te Hohonu &mdash; the deep</div>
            <h2 className={styles.heroTitle}>Dive deeper.</h2>
            <p className={styles.heroSub}>
              One atoll. A hundred metres of story. Scroll to dive.
            </p>
          </div>

          <div className={styles.diveCue} aria-hidden="true">
            <span className={styles.diveChevron} />
            dive &mdash; 0 m
          </div>
        </section>

        <section className={styles.deep} id="honu-xr">
          <div className={styles.depthWatermark} aria-hidden="true">
            &minus;104
          </div>
          <div className={styles.deepInner}>
            <div className={styles.deepHead}>
              <div className={styles.deepText}>
              <div className={styles.bandKicker}>
                Project 01 &mdash; Honu XR
                <br />
                the deep-water submersible
              </div>
              <h2 className={`${styles.bandTitle} ${styles.deepTitle}`}>
                Meet Honu. Built to bring the ocean to everyone.
              </h2>
              <p className={`${styles.bandCopy} ${styles.deepCopy}`}>
                Built by Tetiaroa Society with DOER Marine and Google, Honu
                &mdash; Tahitian for sea turtle &mdash; carries scientists and
                budding oceanographers to reefs and species too deep for a
                diver to reach. Descents will be filmed
                by state-of-the-art 360&deg; XR cameras:
                Now any classroom on Earth can put on a headset and
                go on a VR field trip to Tetiaroa.
              </p>
              <div className={styles.deepChips}>
                <span className={styles.statChip}>built with doer marine + google</span>
                <span className={styles.statChip}>xr field trips for every classroom</span>
              </div>
            </div>
              <figure className={styles.deepRender}>
                <Image
                  src="/sub-render.png"
                  alt="Render of the Honu submersible — acrylic dome, robotic arms, DOER Marine livery"
                  width={1318}
                  height={1030}
                  className={styles.deepRenderImage}
                  sizes="(max-width: 960px) 80vw, 480px"
                />
                <figcaption className={styles.deepRenderCaption}>
                  honu &middot; design render &middot; doer marine
                </figcaption>
              </figure>
            </div>
            <VrViewer src="/vr-clip.mp4" />
            <a
              href="https://www.youtube.com/watch?v=B9IGe7s6Ook"
              target="_blank"
              rel="noreferrer"
              className={styles.deepCta}
            >
              Watch in fullscreen / VR &rarr;
            </a>
          </div>
        </section>

        <section className={styles.band} id="turtles">
          <div className={styles.depthWatermark} aria-hidden="true">
            &minus;5
          </div>
          <div className={styles.bandGrid}>
            <div className={styles.bandText}>
              <div className={styles.bandKicker}>
                Project 02 &mdash; sea turtle sanctuary &middot; sunlit lagoon
              </div>
              <h2 className={styles.bandTitle}>The nursery in the shallows.</h2>
              <p className={styles.bandCopy}>
                Every November, green sea turtles emerge out on the same sand
                where they hatched. Last season the patrol counted 214 nests
                &mdash; each one mapped, shaded, and kept safe until the
                hatchlings made it to the sea.
              </p>
              <span className={styles.statChip}>214 nests / 2025 season</span>
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
              <span className={styles.mediaCaption}>
                honu &middot; green sea turtle &middot; &minus;5 m
              </span>
            </div>
          </div>
        </section>

        <section className={styles.band} id="sharks">
          <div className={styles.depthWatermark} aria-hidden="true">
            &minus;20
          </div>
          <div className={`${styles.bandGrid} ${styles.bandGridFlip}`}>
            <div className={styles.bandText}>
              <div className={styles.bandKicker}>
                Project 03 &mdash; lemon shark nursery &middot; reef edge
              </div>
              <h2 className={styles.bandTitle}>
                Where the lagoon raises predators.
              </h2>
              <p className={styles.bandCopy}>
                Juvenile lemon sharks spend their first years inside the
                reef&apos;s protection. The sanctuary keeps the nursery intact
                &mdash; and with it, the food web that holds the whole atoll
                together.
              </p>
              <span className={styles.statChip}>3 km of protected reef edge</span>
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
              <span className={styles.mediaCaption}>
                ma&#39;o &middot; lemon shark &middot; &minus;20 m
              </span>
            </div>
          </div>
        </section>

        <section className={styles.band} id="twin">
          <div className={styles.depthWatermark} aria-hidden="true">
            &minus;40
          </div>
          <div className={styles.bandGrid}>
            <div className={styles.bandText}>
              <div className={styles.bandKicker}>
                Project 04 &mdash; digital twin + biocode
              </div>
              <h2 className={styles.bandTitle}>An atoll that knows itself.</h2>
              <p className={styles.bandCopy}>
                Every reef head, every current, every one of 167 species
                &mdash; scanned, sequenced, and rebuilt as a living digital
                twin. When the real Tetiaroa changes, the twin sees it first.
              </p>
              <span className={styles.statChip}>167 species in the biocode</span>
            </div>
            <ScanPanel>
              <Image
                src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1400&q=85&auto=format&fit=crop"
                alt="Branching coral being mapped"
                fill
                className={styles.mediaImage}
                sizes="(max-width: 960px) 100vw, 46vw"
              />
              <div className={styles.scanGrid} aria-hidden="true" />
              <div className={styles.scanLine} aria-hidden="true" />
              <div className={styles.scanReadouts}>
                {scanReadouts.map((readout) => (
                  <span
                    key={readout.label}
                    className={styles.readout}
                    style={{ "--at": readout.at } as React.CSSProperties}
                  >
                    {readout.label}
                  </span>
                ))}
              </div>
            </ScanPanel>
          </div>
        </section>

        <section className={styles.shallows} id="kids">
          <div className={styles.shallowsInner}>
            <div className={styles.shallowsEyebrow}>Come up for air</div>
            <h2 className={styles.shallowsTitle}>
              Tamari&#39;i &mdash;{" "}
              <em className={styles.wavy}>little chiefs of the lagoon.</em>
            </h2>
            <p className={styles.shallowsCopy}>
              Tamari&#39;i means children &mdash; and these are science classes
              you can swim in. Tetiaroa&apos;s classrooms have no walls and the
              field trips have fins.
            </p>

            <div className={styles.kidCards}>
              {kidPrograms.map((program) => (
                <article key={program.title} className={styles.kidCard}>
                  <div className={styles.kidMedia}>
                    <Image
                      src={program.image}
                      alt={program.alt}
                      fill
                      className={styles.mediaImage}
                      sizes="(max-width: 700px) 100vw, 320px"
                    />
                  </div>
                  <div className={styles.kidBody}>
                    <span className={styles.kidBadge}>{program.badge}</span>
                    <h3 className={styles.kidTitle}>{program.title}</h3>
                    <p className={styles.kidCopy}>{program.copy}</p>
                  </div>
                </article>
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
              <span className={styles.mediaCaption}>
                release day at the sanctuary &mdash; the part nobody skips
              </span>
            </div>
          </div>
        </section>

        <section className={styles.history} id="history">
          <div className={styles.historyHead}>
            <div className={styles.historyEyebrow}>Back to the surface</div>
            <h2 className={styles.historyTitle}>
              1967. A promise at the waterline.
            </h2>
          </div>

          <div className={styles.frames}>
            {historyFrames.map((frame) => (
              <figure key={frame.year} className={styles.frame}>
                <Image
                  src={frame.image}
                  alt={frame.alt}
                  fill
                  className={`${styles.mediaImage} ${styles.frameSepia}`}
                  sizes="(max-width: 960px) 100vw, 1180px"
                />
                <div className={styles.grain} aria-hidden="true" />
                <span className={styles.frameYear}>{frame.year}</span>
                <figcaption className={styles.frameCaption}>
                  {frame.caption}
                </figcaption>
              </figure>
            ))}

            <figure className={styles.frame}>
              <video
                className={styles.mediaVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/atoll.mp4" type="video/mp4" />
              </video>
              <span className={styles.frameYear}>Today</span>
              <figcaption className={styles.frameCaption}>
                Tetiaroa Society has kept the promise since 2010. The film never
                stopped rolling.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.night} id="lanterns">
          <div className={styles.stars} aria-hidden="true" />
          <div className={styles.nightInner}>
            <NightBeatCinema
              lines={beatLines}
              eyebrow={nightEyebrow}
              titleLines={nightTitleLines}
            />
            <p className={styles.nightClose}>
              Every chain starts with one light on a beach.{" "}
              <strong className={styles.nightYours}>Yours.</strong>
            </p>

            <LanternDonate tiers={lanternTiers} />
          </div>
        </section>

        <footer className={styles.footerMini}>
          <div className={styles.footerBrand}>
            <Image
              src="/logos/TSFP_Logo_2026_White.png"
              alt="Tetiaroa Society"
              width={596}
              height={371}
              className={styles.footerLogo}
            />
            <div>
              Concept 01 &mdash; Te Hohonu. A homepage study for Tetiaroa
              Society / EIN 45-1080688.
            </div>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/">Current homepage</Link>
            <Link href="/our-logo">Logo meaning</Link>
            <Link href="/impact">Impact Feed</Link>
            <Link href="/turtle-tales">Turtle Tales</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
