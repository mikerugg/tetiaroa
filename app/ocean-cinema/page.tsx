import Link from "next/link";
import type { Metadata } from "next";
import { TetiaroaMark } from "../tetiaroa-mark";
import styles from "./page.module.css";

type Project = {
  id: string;
  number: string;
  title: string;
  deck: string;
  body: string;
  video: string;
  poster: string;
  runtime: string;
  theme: "honu" | "sanctuary" | "biocode";
};

type DonateAmount = {
  value: string;
  label: string;
  detail: string;
  defaultChecked?: boolean;
};

const projects: Project[] = [
  {
    id: "honu-xr",
    number: "01",
    title: "Honu XR",
    deck: "Deep-water VR and AR submersible storytelling.",
    body:
      "A cinematic portal into Tetiaroa's least-seen waters, built to turn expedition footage, spatial data, and ocean science into experiences students and supporters can enter.",
    video: "/turtleclip.mp4",
    poster:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1800&q=85&auto=format&fit=crop",
    runtime: "00:34",
    theme: "honu",
  },
  {
    id: "sanctuaries",
    number: "02",
    title: "Sea Turtle & Lemon Shark sanctuaries",
    deck: "Protected waters for animals that define the atoll.",
    body:
      "Nesting beaches, lagoon corridors, and nursery zones become a living protection system for honu, sharks, and the communities learning from their return.",
    video: "/turtlecare.mp4",
    poster:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1800&q=85&auto=format&fit=crop",
    runtime: "01:08",
    theme: "sanctuary",
  },
  {
    id: "digital-twin",
    number: "03",
    title: "Digital Twin + Biocode Project",
    deck: "A living model of island recovery.",
    body:
      "Satellite layers, reef observations, species records, and field protocols converge into a shared model that helps partners see change before it becomes irreversible.",
    video: "/atoll.mp4",
    poster:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1800&q=85&auto=format&fit=crop",
    runtime: "01:46",
    theme: "biocode",
  },
];

const donationAmounts: DonateAmount[] = [
  {
    value: "35",
    label: "$35",
    detail: "Kids field kit",
  },
  {
    value: "100",
    label: "$100",
    detail: "Turtle patrol night",
    defaultChecked: true,
  },
  {
    value: "250",
    label: "$250",
    detail: "Reef sensor care",
  },
  {
    value: "custom",
    label: "Other",
    detail: "Choose an amount",
  },
];

const historyMoments = [
  {
    year: "1967",
    title: "A promise to keep Tetiaroa whole.",
  },
  {
    year: "2010",
    title: "Tetiaroa Society becomes the vehicle for the work.",
  },
  {
    year: "Now",
    title: "Science, culture, and education move together.",
  },
];

export const metadata: Metadata = {
  title: "Ocean Cinema / Tetiaroa Society",
  description:
    "A temporary documentary-style homepage concept for Tetiaroa Society.",
};

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ProjectChapter({ project }: { project: Project }) {
  return (
    <article
      className={cx(styles.projectChapter, styles[project.theme])}
      id={project.id}
    >
      <div className={styles.chapterMedia}>
        <video
          className={styles.chapterVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.poster}
          aria-label={`${project.title} footage preview`}
        >
          <source src={project.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.chapterScrim} aria-hidden="true" />
        <div className={styles.motionGrid} aria-hidden="true" />
        <div className={styles.timecode}>
          <span>{project.number}</span>
          <span>{project.runtime}</span>
        </div>
      </div>

      <div className={styles.chapterCopy}>
        <div className={styles.chapterNumber}>Chapter {project.number}</div>
        <h3>{project.title}</h3>
        <p className={styles.chapterDeck}>{project.deck}</p>
        <p>{project.body}</p>
        <a href={`#${project.id}`} className={styles.chapterAction}>
          View chapter
        </a>
      </div>
    </article>
  );
}

export default function OceanCinemaPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.topNav} aria-label="Ocean Cinema navigation">
        <Link href="/" className={styles.brand}>
          <TetiaroaMark className={styles.brandMark} />
          <span>Tetiaroa Society</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#history">History</a>
          <a href="#donate">Donate</a>
        </div>
      </nav>

      <section className={styles.hero} id="reel">
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
          Your browser does not support the video tag.
        </video>
        <div className={styles.heroScrim} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1>Tetiaroa Society</h1>
            <p>
              A film-led invitation into the science, sanctuary, and education
              work protecting one of the Pacific&apos;s most important atolls.
            </p>
            <div className={styles.heroActions}>
              <a href="#projects" className={styles.playButton}>
                <span className={styles.playIcon} aria-hidden="true" />
                Watch the reel
              </a>
              <a href="#donate" className={styles.heroLink}>
                Get involved
              </a>
            </div>
          </div>

          <div className={styles.heroPanel} aria-label="Reel progress">
            <div className={styles.panelTitle}>Field reel</div>
            <div className={styles.panelLine}>
              <span>00:00</span>
              <span>02:14</span>
            </div>
            <div className={styles.progressTrack} aria-hidden="true">
              <span />
            </div>
            <div className={styles.panelCaption}>
              Tahiti project footage / muted preview
            </div>
          </div>
        </div>

        <div className={styles.heroPreview} aria-label="Next chapters">
          <span>Next</span>
          <a href="#honu-xr">Honu XR</a>
          <a href="#sanctuaries">Sanctuaries</a>
          <a href="#digital-twin">Digital Twin + Biocode</a>
        </div>
      </section>

      <section className={styles.projects} id="projects">
        <div className={styles.sectionIntro}>
          <span>Key environmental projects</span>
          <h2>Three chapters of protection, told in motion.</h2>
        </div>

        <div className={styles.chapterStack}>
          {projects.map((project) => (
            <ProjectChapter key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className={styles.education} id="education">
        <div className={styles.educationMedia}>
          <video
            className={styles.educationVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=85&auto=format&fit=crop"
            aria-label="Education and kids field learning footage"
          >
            <source src="/turtlecare.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={styles.educationFrame} aria-hidden="true" />
        </div>

        <div className={styles.educationCopy}>
          <span>Education + Kids</span>
          <h2>Ocean literacy starts with a place children can love.</h2>
          <p>
            Field lessons, classroom media, and kid-ready stories translate
            atoll science into wonder, care, and agency for the next generation
            of island stewards.
          </p>
          <div className={styles.lessonGrid}>
            <div>
              <strong>Story labs</strong>
              <p>Short films and hands-on prompts for classrooms.</p>
            </div>
            <div>
              <strong>Field kits</strong>
              <p>Simple tools for observing shorelines, nests, and reefs.</p>
            </div>
            <div>
              <strong>Turtle Tales</strong>
              <p>Characters and activities that connect kids to honu care.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.history} id="history">
        <div className={styles.historyArchive} aria-hidden="true">
          <div className={styles.archiveFrame}>
            <span>17.00 S</span>
            <span>149.34 W</span>
          </div>
          <div className={styles.archiveNote}>
            <span>Tetiaroa</span>
            <strong>Hold the atoll intact.</strong>
          </div>
        </div>

        <div className={styles.historyCopy}>
          <span>History</span>
          <h2>Started with Marlon Brando&apos;s promise to protect Tetiaroa.</h2>
          <p>
            The Society carries forward a founding idea: Tetiaroa should be a
            place where research, education, culture, and conservation reinforce
            each other instead of competing for the future.
          </p>
          <div className={styles.historyTimeline}>
            {historyMoments.map((moment) => (
              <div key={moment.year}>
                <strong>{moment.year}</strong>
                <p>{moment.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.join} id="donate">
        <div className={styles.joinMedia} aria-hidden="true">
          <video
            className={styles.joinVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1800&q=85&auto=format&fit=crop"
          >
            <source src="/atoll.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.joinScrim} aria-hidden="true" />

        <div className={styles.joinContent}>
          <div className={styles.joinCopy}>
            <span>Get involved</span>
            <h2>Help turn beautiful footage into protected futures.</h2>
            <p>
              Gifts support field patrols, education tools, research equipment,
              and the storytelling that brings Tetiaroa&apos;s work to new partners.
            </p>
          </div>

          <form className={styles.donateWidget} action="/ocean-cinema#donate">
            <fieldset className={styles.frequencyGroup}>
              <legend>Gift frequency</legend>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  defaultChecked
                />
                <span>Monthly</span>
              </label>
              <label>
                <input type="radio" name="frequency" value="once" />
                <span>One time</span>
              </label>
            </fieldset>

            <fieldset className={styles.amountGroup}>
              <legend>Choose an amount</legend>
              {donationAmounts.map((amount) => (
                <label key={amount.value} className={styles.amountChoice}>
                  <input
                    type="radio"
                    name="amount"
                    value={amount.value}
                    defaultChecked={amount.defaultChecked}
                  />
                  <span>
                    <strong>{amount.label}</strong>
                    <small>{amount.detail}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            <button className={styles.donateButton} type="submit">
              Donate
            </button>
            <a className={styles.partnerLink} href="mailto:info@tetiaroasociety.org">
              Start a partnership
            </a>
          </form>
        </div>
      </section>
    </main>
  );
}
