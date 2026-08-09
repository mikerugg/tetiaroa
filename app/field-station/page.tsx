import Image from "next/image";
import Link from "next/link";
import { HomepageInitialScrollReset, HomepageNavState } from "../homepage-client";
import { homeVideoSources } from "../home-video-sources";
import { SproutBackgroundVideo } from "../sprout-background-video";
import { TetiaroaMark } from "../tetiaroa-mark";
import { AcetateMap } from "./acetate-map";
import { ExpeditionTicker } from "./expedition-ticker";
import { RevealObserver } from "./reveal";
import { RosterLedger } from "./roster-ledger";
import { TypewriterLetter } from "./typewriter-letter";
import styles from "./page.module.css";

const brandoQuote =
  "If I have my way, Tetiaroa will remain forever a place that reminds Tahitians of who they are and what they were centuries ago.";

const turtleLog = [
  "HONU №214 — TAGGED 2021 — FIRST NESTED 2023 — RETURNED ×3",
  "HONU №309 — HATCHED TIARAUNU — SAT-TRACKED 2 400 KM",
  "SEASON 25/26 — 410 NESTS LOGGED — STATION RECORD",
];

const sharkLog = [
  "N-23 — JUVENILE — LAGOON NURSERY — 86 CM",
  "N-31 — RE-SIGHTED ×11 — SAME CHANNEL, SAME HOUR",
  "NURSERY ZONE — NO-TAKE WATERS SINCE 2014",
];

const filmFrames = [
  {
    year: "1960",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Marlon_Brando_publicity_for_One-Eyed_Jacks.png",
    alt: "Marlon Brando in a 1961 publicity photograph",
    caption: "He climbed the rigging of the Bounty and saw a ring of sand.",
  },
  {
    year: "1967",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/31/Tetiaroa_from_sky.JPG",
    alt: "Tetiaroa atoll photographed from the air",
    caption: "He bought the whole ring — and set one rule: keep it intact.",
  },
  {
    year: "2014",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Tetiaroa_lagon.jpg",
    alt: "The turquoise lagoon of Tetiaroa",
    caption: "The Ecostation opens. Science moves in with the terns.",
  },
  {
    year: "Today",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Ancien_village_Tetiaroa.jpg",
    alt: "Palms and old village site on Tetiaroa",
    caption: "The Society keeps the record — and the promise.",
  },
];

const badges = [
  { icon: "❋", title: "REEF", sub: "READER" },
  { icon: "▲", title: "TURTLE", sub: "TAGGER" },
  { icon: "✳", title: "BIRD", sub: "COUNTER" },
  { icon: "◔", title: "LAGOON", sub: "CARTOGRAPHER" },
];

const activities = [
  {
    title: "Printable field notebook",
    detail: "12 pages, PDF — rule your own transects",
  },
  {
    title: "Species bingo — lagoon edition",
    detail: "first to five sightings calls 'HONU!'",
  },
  {
    title: "Badge chart",
    detail: "nine to earn, ages 6 and up, no exceptions for adults",
  },
];

export default function FieldStationPage() {
  return (
    <div className={styles.page}>
      <HomepageInitialScrollReset />
      <HomepageNavState />
      <RevealObserver />

      <header className={styles.topnav} data-topnav>
        <Link href="/field-station" className={styles.brand}>
          <TetiaroaMark className={styles.brandMark} />
          <span className={styles.brandText}>
            <strong>Tetiaroa Society</strong>
            <em>Field Station Edition</em>
          </span>
        </Link>
        <nav className={styles.navLinks} aria-label="Sections">
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#history">History</a>
          <a href="#join">Get involved</a>
        </nav>
        <a href="#join" className={styles.navDonate}>
          Donate
        </a>
      </header>

      <main>
        {/* ——— COVER / HERO ——— */}
        <section className={styles.hero} aria-label="Cover">
          <SproutBackgroundVideo
            className={styles.heroVideo}
            embedUrl={homeVideoSources.atoll.embedUrl}
            poster="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2000&q=85&auto=format&fit=crop"
            title={homeVideoSources.atoll.title}
            eager
          />
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroGrain} aria-hidden="true" />

          <div className={styles.filmLeader} aria-hidden="true">
            <span className={styles.leaderRing} />
            <span className={styles.leaderSweep} />
            <span className={styles.leaderCrossH} />
            <span className={styles.leaderCrossV} />
            <span className={`${styles.leaderNum} ${styles.leaderNum3}`}>3</span>
            <span className={`${styles.leaderNum} ${styles.leaderNum2}`}>2</span>
            <span className={`${styles.leaderNum} ${styles.leaderNum1}`}>1</span>
          </div>

          <div className={styles.heroMasthead}>
            <p className={styles.heroKicker}>The Tetiaroa Society presents</p>
            <h1 className={styles.heroTitle}>Tetiaroa</h1>
            <p className={styles.heroOrnament} aria-hidden="true">
              ──────── ❖ ────────
            </p>
            <p className={styles.heroSub}>An Atlas of One Atoll, Kept Whole</p>
            <p className={styles.heroEdition}>
              VOL. I — FIELD STATION EDITION · ASSEMBLED ON THE LAGOON, MMXXVI
            </p>
            <a href="#projects" className={styles.heroOpen}>
              Open to page one ↓
            </a>
          </div>

          <div className={styles.heroLabel}>
            <strong>Plate I.</strong> North-channel overflight at first light.
            Expedition reel, 4K — unretouched.
          </div>

          <div className={styles.heroTickerWrap}>
            <ExpeditionTicker />
          </div>

          <div className={styles.heroEdge} aria-hidden="true">
            <svg viewBox="0 0 1440 64" preserveAspectRatio="none">
              <path d="M0 64 L0 38 C40 30 70 44 120 36 C180 26 210 42 260 34 C320 24 360 44 420 35 C470 28 520 40 580 31 C640 22 690 42 740 33 C800 24 850 41 910 32 C960 25 1010 40 1070 31 C1130 23 1180 41 1240 33 C1300 26 1350 40 1400 32 C1415 30 1430 33 1440 31 L1440 64 Z" />
            </svg>
          </div>
        </section>

        {/* ——— PART ONE: PROJECTS ——— */}
        <section id="projects" className={styles.projects}>
          <header className={styles.partHead} data-reveal>
            <p className={styles.partKicker}>Part One — The Field Projects</p>
            <h2 className={styles.partTitle}>Three open dossiers</h2>
            <p className={styles.partLede}>
              Everything the Society runs is kept like a field record: numbered,
              dated, signed, and open. These are the three dossiers currently on
              the station table.
            </p>
            <span className={styles.partPlate}>PLATES II — VII</span>
          </header>

          {/* Dossier №1 — Honu XR */}
          <article className={styles.dossier} data-reveal>
            <header className={styles.dossierHead}>
              <span className={styles.dossierNo}>Dossier №1</span>
              <h3 className={styles.dossierTitle}>
                Honu XR — <em>the instrument</em>
              </h3>
              <span className={styles.stamp} data-tone="oxblood">
                ACTIVE · DEEP WATER
              </span>
            </header>

            <div className={styles.instrumentGrid}>
              <figure className={styles.blueprint}>
                <svg
                  viewBox="0 0 640 420"
                  role="img"
                  aria-label="Blueprint side elevation of the Honu XR research submersible"
                >
                  {/* hull + sphere */}
                  <circle className={styles.bpLine} cx="210" cy="210" r="92" />
                  <path
                    className={styles.bpLineThin}
                    d="M 150 158 A 92 92 0 0 1 248 132"
                  />
                  <rect
                    className={styles.bpLine}
                    x="248"
                    y="152"
                    width="262"
                    height="116"
                    rx="58"
                  />
                  {/* sensor mast */}
                  <line className={styles.bpLine} x1="380" y1="152" x2="380" y2="110" />
                  <rect className={styles.bpLine} x="372" y="96" width="16" height="14" />
                  {/* thruster */}
                  <circle className={styles.bpLine} cx="546" cy="210" r="40" />
                  <circle className={styles.bpLine} cx="546" cy="210" r="11" />
                  <line className={styles.bpLineThin} x1="546" y1="172" x2="546" y2="248" />
                  <line className={styles.bpLineThin} x1="510" y1="210" x2="582" y2="210" />
                  {/* skids */}
                  <line className={styles.bpLine} x1="158" y1="322" x2="486" y2="322" />
                  <line className={styles.bpLineThin} x1="252" y1="266" x2="240" y2="322" />
                  <line className={styles.bpLineThin} x1="438" y1="266" x2="450" y2="322" />
                  {/* XR array on sphere */}
                  <circle className={styles.bpLineThin} cx="138" cy="248" r="6" />
                  <circle className={styles.bpLineThin} cx="152" cy="268" r="6" />
                  <circle className={styles.bpLineThin} cx="172" cy="284" r="6" />
                  {/* ballast */}
                  <rect
                    className={styles.bpDashed}
                    x="300"
                    y="236"
                    width="160"
                    height="24"
                  />
                  <text className={styles.bpText} x="380" y="252" textAnchor="middle">
                    BALLAST &amp; TRIM
                  </text>
                  {/* LED bar */}
                  <path className={styles.bpLineThin} d="M 150 290 A 92 92 0 0 0 226 300" />
                  {/* dimensions */}
                  <line className={styles.bpDim} x1="118" y1="370" x2="586" y2="370" />
                  <line className={styles.bpDim} x1="118" y1="362" x2="118" y2="378" />
                  <line className={styles.bpDim} x1="586" y1="362" x2="586" y2="378" />
                  <text className={styles.bpText} x="352" y="388" textAnchor="middle">
                    OVERALL LENGTH — 4.6 m
                  </text>
                  <line className={styles.bpDim} x1="84" y1="118" x2="84" y2="302" />
                  <line className={styles.bpDim} x1="76" y1="118" x2="92" y2="118" />
                  <line className={styles.bpDim} x1="76" y1="302" x2="92" y2="302" />
                  <text
                    className={styles.bpText}
                    x="62"
                    y="214"
                    textAnchor="middle"
                    transform="rotate(-90 62 214)"
                  >
                    Ø 1.9 m SPHERE
                  </text>
                  {/* callouts */}
                  <line className={styles.bpLead} x1="166" y1="142" x2="96" y2="70" />
                  <text className={styles.bpText} x="30" y="60">
                    ACRYLIC SPHERE — 180° FIELD
                  </text>
                  <line className={styles.bpLead} x1="156" y1="272" x2="76" y2="340" />
                  <text className={styles.bpText} x="26" y="356">
                    XR CAPTURE ARRAY ×6
                  </text>
                  <line className={styles.bpLead} x1="380" y1="100" x2="430" y2="64" />
                  <text className={styles.bpText} x="436" y="60">
                    SENSOR MAST — TELEMETRY
                  </text>
                  <line className={styles.bpLead} x1="568" y1="178" x2="588" y2="118" />
                  <text className={styles.bpText} x="612" y="108" textAnchor="end">
                    MAIN THRUSTER — 4 kW
                  </text>
                  {/* title block */}
                  <g className={styles.bpBlock} transform="translate(424 318)">
                    <rect width="196" height="84" />
                    <text x="12" y="22">HONU XR — RESEARCH SUBMERSIBLE</text>
                    <text x="12" y="40">FIG. 1 — SIDE ELEVATION</text>
                    <text x="12" y="58">SCALE 1 : 24 · SHEET 2 OF 9</text>
                    <text x="12" y="76">DRAWN: FIELD STATION, ONETAHI</text>
                  </g>
                </svg>
                <figcaption className={styles.blueprintCaption}>
                  FIG. 1 — The deep-water VR &amp; AR submersible, drawn at the
                  station. Two seats, one lagoon, every classroom invited.
                </figcaption>
              </figure>

              <div className={styles.instrumentSide}>
                <figure className={styles.slideFrame}>
                  <SproutBackgroundVideo
                    className={styles.slideVideo}
                    embedUrl={homeVideoSources.turtleClip.embedUrl}
                    title={homeVideoSources.turtleClip.title}
                  />
                  <figcaption className={styles.slideLabel}>
                    <strong>Plate II.</strong> Descent trial, outer reef wall —
                    honu escort, unscripted.
                  </figcaption>
                </figure>
                <p className={styles.dossierBody}>
                  Honu XR carries a pilot, a researcher, and everyone else.
                  Every dive is captured as live VR and AR and streamed to
                  classrooms ashore — so the deep water off Tetiaroa is no
                  longer a rumor, it&apos;s a field trip.
                </p>
                <ul className={styles.specList}>
                  <li>
                    <span>DEPTH RATING</span>
                    <span>−120 m</span>
                  </li>
                  <li>
                    <span>CREW</span>
                    <span>1 pilot · 1 researcher</span>
                  </li>
                  <li>
                    <span>BROADCAST</span>
                    <span>live VR/AR to shore</span>
                  </li>
                  <li>
                    <span>FIRST SEASON</span>
                    <span>2026 — lagoon trials</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* Dossier №2 — Sanctuaries */}
          <article className={styles.dossier} data-reveal>
            <header className={styles.dossierHead}>
              <span className={styles.dossierNo}>Dossier №2</span>
              <h3 className={styles.dossierTitle}>
                The sanctuaries — <em>turtle &amp; lemon shark</em>
              </h3>
              <span className={styles.stamp} data-tone="survey">
                PROTECTED WATERS
              </span>
            </header>

            <p className={styles.dossierBody}>
              Nesting beaches on the north motu, a shark nursery in the
              southern lagoon — the sanctuaries are kept the way the rest of
              the atlas is kept: every individual logged, every return
              celebrated in ink.
            </p>

            <div className={styles.specimenGrid}>
              <figure className={styles.specimen}>
                <div className={styles.specimenPhoto}>
                  <Image
                    src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=80&auto=format&fit=crop"
                    alt="Green sea turtle gliding over the reef"
                    fill
                    sizes="(max-width: 760px) 100vw, 40vw"
                  />
                  <i className={styles.corner} data-corner="tl" aria-hidden="true" />
                  <i className={styles.corner} data-corner="tr" aria-hidden="true" />
                  <i className={styles.corner} data-corner="bl" aria-hidden="true" />
                  <i className={styles.corner} data-corner="br" aria-hidden="true" />
                </div>
                <figcaption className={styles.specimenText}>
                  <h4>Green sea turtle</h4>
                  <p className={styles.taxon}>
                    <em>Chelonia mydas</em> — &ldquo;honu&rdquo;
                  </p>
                  <ul className={styles.tagLog}>
                    {turtleLog.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </figcaption>
              </figure>

              <figure className={styles.specimen}>
                <div className={styles.specimenPhoto}>
                  <Image
                    src="https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=1200&q=80&auto=format&fit=crop"
                    alt="Shark cruising in shallow blue water"
                    fill
                    sizes="(max-width: 760px) 100vw, 40vw"
                  />
                  <i className={styles.corner} data-corner="tl" aria-hidden="true" />
                  <i className={styles.corner} data-corner="tr" aria-hidden="true" />
                  <i className={styles.corner} data-corner="bl" aria-hidden="true" />
                  <i className={styles.corner} data-corner="br" aria-hidden="true" />
                </div>
                <figcaption className={styles.specimenText}>
                  <h4>Sicklefin lemon shark</h4>
                  <p className={styles.taxon}>
                    <em>Negaprion acutidens</em> — lagoon-born
                  </p>
                  <ul className={styles.tagLog}>
                    {sharkLog.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </div>

            <p className={styles.marginNote}>
              “the sharks were here first — we just wrote it down.”
            </p>
          </article>

          {/* Dossier №3 — Digital Twin + Biocode */}
          <article className={styles.dossier} data-reveal>
            <header className={styles.dossierHead}>
              <span className={styles.dossierNo}>Dossier №3</span>
              <h3 className={styles.dossierTitle}>
                Digital Twin + Biocode — <em>the appendix</em>
              </h3>
              <span className={styles.stamp} data-tone="gold">
                IN SYNC · LIVE
              </span>
            </header>

            <p className={styles.dossierBody}>
              Every observation in this atlas — every nest, sounding, sequence,
              and sensor ping — lands in one living model of the atoll. The
              Digital Twin is the page that updates itself; the Biocode is its
              index of life.
            </p>

            <AcetateMap />

            <div className={styles.appendixRow}>
              <div>
                <strong>167</strong>
                <span>species sequenced into the Biocode</span>
              </div>
              <div>
                <strong>12</strong>
                <span>motu carried in one living model</span>
              </div>
              <div>
                <strong>hourly</strong>
                <span>sensor-net refresh, reef to ridge</span>
              </div>
            </div>
          </article>
        </section>

        {/* ——— PART TWO: EDUCATION & KIDS ——— */}
        <section id="education" className={styles.kids}>
          <header className={styles.partHead} data-reveal>
            <p className={styles.partKicker}>Part Two — Education &amp; Kids</p>
            <h2 className={styles.partTitle}>The Junior Naturalist&apos;s pages</h2>
            <p className={styles.partLede}>
              Ora Hoa classes, snorkel school, and night patrols with the
              turtle team — Polynesian students do real science here, and these
              are their pages of the atlas.
            </p>
            <span className={styles.partPlate}>PLATE VIII</span>
          </header>

          <div className={styles.kidsGrid}>
            <figure className={styles.stickerSheet} data-reveal>
              <div className={styles.stickerImage}>
                <Image
                  src="/submersible-ideas-sheet.png"
                  alt="A sheet of colorful submersible design studies drawn for kids"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <figcaption className={styles.stickerCaption}>
                STICKER SHEET №3 — &ldquo;design your own submersible&rdquo;
                studies, as voted on by the junior cohort. One of these grows up
                to be Honu XR.
              </figcaption>
            </figure>

            <div className={styles.kidsCol}>
              <div className={styles.badgeRow} data-reveal>
                {badges.map((badge) => (
                  <span key={badge.sub} className={styles.badge}>
                    <i aria-hidden="true">{badge.icon}</i>
                    <b>{badge.title}</b>
                    <small>{badge.sub}</small>
                  </span>
                ))}
              </div>

              <div className={styles.passport} data-reveal>
                <p className={styles.passportKicker}>TETIAROA SOCIETY — FORM J-1</p>
                <h3 className={styles.passportTitle}>Junior Naturalist Passport</h3>
                <div className={styles.passportRow}>
                  <span className={styles.passportPhoto}>
                    YOUR
                    <br />
                    PHOTO
                  </span>
                  <div className={styles.passportFields}>
                    <p>
                      NAME <span className={styles.dotted} />
                    </p>
                    <p>
                      SCHOOL <span className={styles.dotted} />
                    </p>
                    <p>
                      FAVORITE SPECIES <span className={styles.dotted} />
                    </p>
                  </div>
                </div>
                <div className={styles.passportStamps}>
                  <span data-filled="true">ECOSTATION ✓</span>
                  <span>LAGOON</span>
                  <span>REEF</span>
                  <span>NIGHT PATROL</span>
                </div>
              </div>
            </div>
          </div>

          <ul className={styles.activityRow} data-reveal>
            {activities.map((activity) => (
              <li key={activity.title} className={styles.activityCard}>
                <strong>{activity.title}</strong>
                <span>{activity.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— PART THREE: HISTORY ——— */}
        <section id="history" className={styles.history}>
          <header className={styles.partHead} data-reveal>
            <p className={styles.partKicker}>Part Three — Provenance</p>
            <h2 className={styles.partTitle}>Correspondence, 1967—</h2>
            <p className={styles.partLede}>
              How a film set became a field station: one actor, twelve motu,
              and a promise that outlived him.
            </p>
            <span className={styles.partPlate}>PLATE IX</span>
          </header>

          <div className={styles.historyGrid}>
            <article className={styles.letter} data-reveal>
              <header className={styles.letterHead}>
                <span>TETIAROA — VIA TAHITI</span>
                <span>c. 1971</span>
              </header>
              <TypewriterLetter text={brandoQuote} />
              <p className={styles.letterSig}>— Marlon Brando</p>
              <p className={styles.letterNote}>
                From the founding correspondence. Brando came to Polynesia in
                1960 to film <em>Mutiny on the Bounty</em>, bought the atoll in
                1967, and held it whole. The Tetiaroa Society exists to keep
                his word for him.
              </p>
            </article>

            <div className={styles.historySide}>
              <article className={styles.telegram} data-reveal>
                <header className={styles.telegramHead}>
                  RADIOGRAM — PAPEETE STATION
                </header>
                <p className={styles.telegramBody}>
                  1967 — BRANDO COMPLETES PURCHASE OF TETIAROA ATOLL = ALL
                  TWELVE MOTU = STATES INTENT = SCIENCE AND TAHITIAN CULTURE =
                  NO RUIN =
                </p>
              </article>

              <div className={styles.foundingStamp} data-reveal>
                <span className={styles.foundingStampInner}>
                  TETIAROA SOCIETY ★ EST. 2010 ★ HOLD THE ATOLL INTACT ★
                </span>
              </div>
            </div>
          </div>

          <div className={styles.filmstrip} data-reveal>
            {filmFrames.map((frame) => (
              <figure key={frame.year} className={styles.filmFrame}>
                <div className={styles.filmPhoto}>
                  <Image
                    src={frame.image}
                    alt={frame.alt}
                    fill
                    sizes="(max-width: 760px) 80vw, 24vw"
                  />
                </div>
                <figcaption className={styles.filmCaption}>
                  <b>{frame.year}</b> {frame.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ——— PART FOUR: GET INVOLVED ——— */}
        <section id="join" className={styles.join}>
          <header className={styles.partHead} data-reveal>
            <p className={styles.partKicker}>Part Four — Get Involved</p>
            <h2 className={styles.partTitle}>Join the expedition roster</h2>
            <p className={styles.partLede}>
              The atlas stays open because people keep it open. Pick a line
              item; we&apos;ll do the fieldwork and report back in ink.
            </p>
            <span className={styles.partPlate}>PLATE X — LAST</span>
          </header>

          <RosterLedger />

          <div className={styles.joinAlt} data-reveal>
            <a className={styles.joinAltCard} href="#join">
              <strong>Volunteer a field season →</strong>
              <span>Six weeks minimum. Blisters guaranteed, sunsets included.</span>
            </a>
            <a className={styles.joinAltCard} href="#join">
              <strong>Bring your classroom →</strong>
              <span>Honu XR dives stream live to schools, anywhere.</span>
            </a>
            <a className={styles.joinAltCard} href="#join">
              <strong>Read the dispatches →</strong>
              <span>A field letter, monthly. Typewritten in spirit.</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.colophon}>
        <TetiaroaMark className={styles.colophonMark} />
        <p className={styles.colophonLine}>
          Set in Cormorant, Source Serif &amp; Courier Prime. Assembled at the
          Ecostation, Onetahi, between tides.
        </p>
        <p className={styles.colophonLine}>
          © MMXXVI Tetiaroa Society — Field Station Edition · Concept 03
        </p>
        <nav className={styles.colophonNav} aria-label="Other editions">
          <span>OTHER EDITIONS:</span>
          <Link href="/">Current site</Link>
          <Link href="/">01 — Te Mau Tia&apos;i</Link>
          <Link href="/ocean-cinema">02 — Ocean Cinema</Link>
        </nav>
      </footer>
    </div>
  );
}
