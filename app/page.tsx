import Link from "next/link";
import Image from "next/image";
import { AtollMapSection } from "./atoll-map-section";
import { ChronologySection } from "./chronology-section";
import {
  HomepageInitialScrollReset,
  HomepageNavState,
} from "./homepage-client";
import { PrimaryRouteDock } from "./primary-route-dock";
import styles from "./page.module.css";
import { TetiaroaMark } from "./tetiaroa-mark";

type Species = {
  name: string;
  scientificName: string;
  status: "recovering" | "stable";
  sequence: string;
  image: string;
  alt: string;
};

type ImpactStat = {
  value: string;
  unit?: string;
  label: string;
};

type ChronologyEntry = {
  year: string;
  label: string;
  title: string;
  description: string;
};

type GivingLevel = {
  amount: string;
  period: string;
  description: string;
  label: string;
};

const species: Species[] = [
  {
    name: "Green sea turtle",
    scientificName: "Chelonia mydas / honu",
    status: "recovering",
    sequence: "01 / 10",
    image:
      "https://www.tetiaroasociety.org/sites/default/files/styles/hero_sm_square/public/2019-03/DSC09915.jpeg.webp?itok=995rcV0-",
    alt: "Green sea turtle underwater",
  },
  {
    name: "Red-footed booby",
    scientificName: "Sula sula",
    status: "stable",
    sequence: "02 / 10",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Sula_sula_by_Gregg_Yan_01.jpg",
    alt: "Red-footed booby standing on a branch",
  },
  {
    name: "Blacktip reef shark",
    scientificName: "Carcharhinus melanopterus",
    status: "stable",
    sequence: "03 / 10",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80&auto=format&fit=crop",
    alt: "Blacktip reef shark swimming through blue water",
  },
  {
    name: "Coconut crab",
    scientificName: "Birgus latro",
    status: "recovering",
    sequence: "04 / 10",
    image:
      "https://images.unsplash.com/photo-1572715376701-98568319fd0f?w=900&q=80&auto=format&fit=crop",
    alt: "Large coconut crab on rock",
  },
  {
    name: "Great frigatebird",
    scientificName: "Fregata minor",
    status: "stable",
    sequence: "05 / 10",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&q=80&auto=format&fit=crop",
    alt: "Great frigatebird in flight",
  },
  {
    name: "Acropora coral",
    scientificName: "Acropora spp.",
    status: "recovering",
    sequence: "06 / 10",
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=900&q=80&auto=format&fit=crop",
    alt: "Close view of branching coral",
  },
  {
    name: "Pacific reef heron",
    scientificName: "Egretta sacra",
    status: "stable",
    sequence: "07 / 10",
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=900&q=80&auto=format&fit=crop",
    alt: "Pacific reef heron near the shoreline",
  },
];

const impactStats: ImpactStat[] = [
  { value: "12", unit: "motu", label: "islets under continuous stewardship" },
  { value: "167", label: "native species actively monitored" },
  { value: "520", unit: "ha", label: "atoll surface now rat-free" },
  { value: "22", label: "research institutions, open data" },
];

const chronology: ChronologyEntry[] = [
  {
    year: "1967",
    label: "Promise",
    title: "Hold the atoll intact.",
    description: "Brando sets the first rule: protect the place before anything else.",
  },
  {
    year: "2010",
    label: "Foundation",
    title: "Build the institution.",
    description: "Tetiaroa Society launches and gives the work a permanent home.",
  },
  {
    year: "2014",
    label: "Ecostation",
    title: "Open the Ecostation.",
    description: "Researchers move onto the atoll and start working beside the systems they study.",
  },
  {
    year: "2018",
    label: "Baseline",
    title: "Measure everything.",
    description: "TARP sets the baseline across land, reef, shoreline, and lagoon.",
  },
  {
    year: "2022",
    label: "Turning Point",
    title: "Remove the rats.",
    description: "A 520-hectare eradication clears the pressure holding recovery back.",
  },
  {
    year: "2026",
    label: "Recovery",
    title: "Scale what works.",
    description: "Recovery data lands. Mosquito elimination expands. Proof turns into practice.",
  },
];

const givingLevels: GivingLevel[] = [
  {
    amount: "$25",
    period: "/mo",
    description: "A week of seabird transect supplies - tags, batteries, notebooks.",
    label: "Friend ->",
  },
  {
    amount: "$100",
    period: "/mo",
    description: "One full turtle-patrol night during nesting season.",
    label: "Steward ->",
  },
  {
    amount: "$500",
    period: "/mo",
    description: "A junior researcher at the Ecostation for a month of fieldwork.",
    label: "Patron ->",
  },
  {
    amount: "-",
    period: "other",
    description: "Pick an amount, or fund a program directly.",
    label: "Choose your own ->",
  },
];

const footerColumns = [
  {
    heading: "Programs",
    items: [
      "Atoll Restoration",
      "Seabird monitoring",
      "Turtle conservation",
      "Blue Climate Initiative",
      "Education",
    ],
  },
  {
    heading: "The Atoll",
    items: ["Geography & motu", "Cultural heritage", "Wildlife", "Ecostation"],
  },
  {
    heading: "Publications",
    items: ["Annual reports", "Field notes", "Open data", "CASUP plan"],
  },
  {
    heading: "Contact",
    items: ["Newsletter", "Press", "Partnerships", "Careers"],
  },
];

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SpeciesCard({ item }: { item: Species }) {
  return (
    <article className={cx(styles.card, styles.cardSpecies)}>
      <div className={styles.cardMedia}>
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className={styles.cardImage}
          sizes="(max-width: 700px) 200px, 260px"
        />
        <div className={styles.cardCorner}>{item.sequence}</div>
        <div className={cx(styles.status, styles[item.status])}>
          {item.status}
        </div>
      </div>
      <div className={styles.cardMeta}>
        <div className={styles.speciesName}>{item.name}</div>
        <div className={styles.scientificName}>{item.scientificName}</div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <HomepageInitialScrollReset />
      <HomepageNavState />
      <div className={styles.page}>
        <nav className={styles.topNav} data-topnav data-scrolled="false">
          <a href="#hero" className={styles.brand}>
            <TetiaroaMark className={styles.brandMark} />
            Tetiaroa Society
          </a>
          <div className={styles.links}>
            <Link href="/">Home</Link>
            <Link href="/impact">Impact Feed</Link>
            <Link href="/turtle-tales">Turtle Tales</Link>
          </div>
          <div className={styles.navActions}>
            <a href="#join" className={styles.donate}>
              Donate
            </a>
          </div>
        </nav>

        <PrimaryRouteDock active="home" className={styles.mobileRouteDock} />

        <section className={styles.hero} id="hero">
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1800&q=80"
            aria-hidden="true"
          >
            <source src="https://tetiaroa.vercel.app/turtleclip.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroScrim} />

          <div className={styles.cornerCopy}>
            17&deg; 00&apos; 18&quot; S / 149&deg; 34&apos; 13&quot; W
            <br />
            Society Islands / French Polynesia
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePill} />
              Now streaming from Tetiaroa
            </div>
            <h1 className={styles.heroTitle}>
              Save the <span className={styles.emphasis}>island.</span>
              <br />
              Save the world.
            </h1>
            <div className={styles.heroActions}>
              <a href="#join" className={styles.ctaPrimary}>
                Protect the atoll
                <span className={styles.ctaArrow} aria-hidden="true">
                  -&gt;
                </span>
              </a>
              <a href="#atoll" className={styles.ctaSecondary}>
                <span className={styles.playIcon} aria-hidden="true" />
                Watch the film / 2:14
              </a>
            </div>
          </div>
        </section>

        <ChronologySection items={chronology} />

        <section className={styles.panorama} id="atoll" aria-label="Atoll panorama">
          <video
            className={styles.panoramaVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=85&auto=format&fit=crop"
            aria-hidden="true"
          >
            <source src="https://tetiaroa.vercel.app/atoll.mp4" type="video/mp4" />
          </video>
          <div className={styles.panoramaOverlay} />
          <div className={styles.panoramaCopy}>
            <div className={styles.panoramaTitle}>
              A lab that doesn&apos;t
              <br />
              look like <span className={styles.emphasis}>a lab.</span>
            </div>
            <a href="#explore" className={styles.panoramaCta}>
              Explore the atoll -&gt;
            </a>
          </div>
        </section>

        <AtollMapSection />

        <section className={styles.railSection} id="wildlife">
          <div className={styles.railHead}>
            <div className={styles.sectionLead}>
              <div className={styles.sectionTag}>Now protected</div>
              <h2 className={styles.sectionTitle}>
                Meet the <span className={styles.emphasis}>residents.</span>
              </h2>
            </div>
            <span className={styles.seeAll}>See all 167 species -&gt;</span>
          </div>
          <div className={styles.rail}>
            {species.map((item) => (
              <SpeciesCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        <section className={styles.impact}>
          <div className={styles.impactIntro}>
            <h2>
              Small atoll. <span className={styles.emphasis}>Big numbers.</span>
            </h2>
            <p>
              Since 2010, Tetiaroa Society has run one of the most continuous
              conservation programs in the Pacific. The receipts:
            </p>
          </div>
          <div className={styles.impactStats}>
            {impactStats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div className={styles.statNumber}>
                  {stat.value}
                  {stat.unit ? <span className={styles.unit}>{stat.unit}</span> : null}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.join} id="join">
          <video
            className={styles.joinVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/turtlecare.mp4" type="video/mp4" />
          </video>
          <div className={styles.joinVideoScrim} aria-hidden="true" />
          <div className={styles.joinWrap}>
            <div className={styles.joinEyebrow}>Be part of it</div>
            <h2 className={styles.joinTitle}>
              A place worth <br /><span className={styles.emphasis}>keeping whole.</span>
            </h2>
            <div className={styles.joinCopy}>
              Tetiaroa Society runs entirely on members and donors. Every gift
              funds a specific monitoring program - with quarterly field updates
              from the team.
            </div>

            <div className={styles.joinActions}>
              <a href="#giving" className={styles.primaryButton}>
                Become a member -&gt;
              </a>
              <a href="/turtle-tales" className={styles.ghostButton}>
                Meet our Turtle Tales
              </a>
              <span className={styles.textButton}>Read the 2025 annual report -&gt;</span>
            </div>

            <div className={styles.givingGrid} id="giving">
              {givingLevels.map((level) => (
                <article className={styles.givingCard} key={`${level.amount}-${level.period}`}>
                  <div className={styles.givingAmount}>
                    {level.amount}
                    <span className={styles.per}>{level.period}</span>
                  </div>
                  <div className={styles.givingCopy}>{level.description}</div>
                  <div className={styles.givingArrow}>{level.label}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerWrap}>
            <div className={styles.footerColumns}>
              <div>
                <div className={styles.footerMark}>Tetiaroa Society</div>
                <div className={styles.footerTagline}>
                  A 501(c)(3) nonprofit dedicated to conservation, education,
                  and research on Tetiaroa Atoll - ensuring island communities
                  have a future as rich as their past.
                </div>
              </div>

              {footerColumns.map((column) => (
                <div key={column.heading}>
                  <h3 className={styles.footerHeading}>{column.heading}</h3>
                  <ul className={styles.footerList}>
                    {column.items.map((item) => (
                      <li key={item}>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.footerLegal}>
              <div>© 2026 Tetiaroa Society / EIN 45-1080688</div>
              <div className={styles.partners}>
                <span>Te Mana o Te Moana</span>
                <span>Island Conservation</span>
                <span>The Brando</span>
                <span>CRIOBE</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
