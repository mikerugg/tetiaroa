import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PrimaryRouteDock } from "../primary-route-dock";
import styles from "./page.module.css";
import { programs, stories, type Program } from "../site-content";
import { TetiaroaMark } from "../tetiaroa-mark";

type FeedPost = Program & {
  id: string;
  handle: string;
  location: string;
  likes: string;
  comments: string;
  stamp: string;
  accent: string;
  avatar: string;
  source: "Programs on the atoll" | "From the atoll";
  sourceHref: string;
  actionLabel: string;
};

export const metadata: Metadata = {
  title: "Impact Feed / Tetiaroa Society",
  description:
    "Programs on the atoll and field notes from Tetiaroa, remixed into a social feed.",
};

const programMeta = [
  {
    handle: "@reef.lab",
    location: "Rimatu'u / outer reef",
    likes: "1,482",
    comments: "34",
    stamp: "2h",
    accent: "#8fc9c9",
    avatar: "RL",
  },
  {
    handle: "@motu.patrol",
    location: "Motu One / south beach",
    likes: "2,104",
    comments: "61",
    stamp: "5h",
    accent: "#73e8f0",
    avatar: "MP",
  },
  {
    handle: "@bird.return",
    location: "Tahuna Iti / colony watch",
    likes: "1,266",
    comments: "29",
    stamp: "8h",
    accent: "#bfd776",
    avatar: "BR",
  },
  {
    handle: "@restoration.unit",
    location: "Across all 12 motu",
    likes: "3,012",
    comments: "88",
    stamp: "1d",
    accent: "#e7b27a",
    avatar: "RU",
  },
  {
    handle: "@biosecure.atoll",
    location: "Lagoon edge / test zone",
    likes: "918",
    comments: "22",
    stamp: "2d",
    accent: "#f0b57f",
    avatar: "BA",
  },
  {
    handle: "@ora.hoa",
    location: "Onetahi / learning ground",
    likes: "1,741",
    comments: "47",
    stamp: "3d",
    accent: "#d9ceaf",
    avatar: "OH",
  },
] as const;

const storyMeta = [
  {
    handle: "@field.notes",
    location: "Windward reef / storm memory",
    likes: "1,928",
    comments: "42",
    stamp: "4h",
    accent: "#8fc9c9",
    avatar: "FN",
  },
  {
    handle: "@night.watch",
    location: "Motu One / moonrise patrol",
    likes: "2,356",
    comments: "79",
    stamp: "11h",
    accent: "#73e8f0",
    avatar: "NW",
  },
  {
    handle: "@after.the.rats",
    location: "Leeward motu / return counts",
    likes: "2,802",
    comments: "96",
    stamp: "1d",
    accent: "#bfd776",
    avatar: "AR",
  },
  {
    handle: "@the.house",
    location: "Ecostation / open lab day",
    likes: "1,604",
    comments: "31",
    stamp: "2d",
    accent: "#e7b27a",
    avatar: "TH",
  },
] as const;

const programPosts = programs.map((item, index) => ({
  ...item,
  ...programMeta[index],
  id: `program-${index + 1}`,
  source: "Programs on the atoll" as const,
  sourceHref: "#programs-feed",
  actionLabel: "Jump to program posts",
}));

const storyPosts = stories.map((item, index) => ({
  ...item,
  ...storyMeta[index],
  id: `story-${index + 1}`,
  source: "From the atoll" as const,
  sourceHref: "#from-the-atoll",
  actionLabel: "Jump to field notes",
}));

function interleavePosts(left: FeedPost[], right: FeedPost[]) {
  const combined: FeedPost[] = [];
  const count = Math.max(left.length, right.length);

  for (let index = 0; index < count; index += 1) {
    if (left[index]) {
      combined.push(left[index]);
    }

    if (right[index]) {
      combined.push(right[index]);
    }
  }

  return combined;
}

const feedPosts = interleavePosts(programPosts, storyPosts);

const storyHighlights = [
  {
    label: "Programs",
    detail: "6 active posts",
    href: "#programs-feed",
  },
  {
    label: "Field Notes",
    detail: "4 dispatches",
    href: "#from-the-atoll",
  },
  {
    label: "Reef",
    detail: "Recovery watch",
    href: "#feed",
  },
  {
    label: "Patrol",
    detail: "Night shift",
    href: "#feed",
  },
  {
    label: "Ecostation",
    detail: "Open house",
    href: "#feed",
  },
];

export default function SocialPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.wordmark}>
          <TetiaroaMark className={styles.wordmarkIcon} />
          tetiaroa.social
        </div>
        <nav className={styles.navLinks} aria-label="Primary">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link
            href="/impact"
            className={`${styles.navLink} ${styles.navLinkActive}`}
            aria-current="page"
          >
            Impact Feed
          </Link>
          <Link href="/turtle-tales" className={styles.navLink}>
            Turtle Tales
          </Link>
        </nav>
        <Link href="/#join" className={styles.topAction}>
          Support the work
        </Link>
      </header>

      <PrimaryRouteDock active="impact" />

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={styles.profileCard}>
            <div className={styles.profileTop}>
              <div className={styles.profileSeal}>
                <TetiaroaMark className={styles.profileSealIcon} />
              </div>
              <div>
                <div className={styles.profileHandle}>@tetiaroasociety</div>
                <h1 className={styles.profileTitle}>
                  Programs and field notes, recut as a feed.
                </h1>
              </div>
            </div>
            
            <div className={styles.profileStats}>
              <div>
                <strong>10</strong>
                <span>posts</span>
              </div>
              <div>
                <strong>12</strong>
                <span>motu</span>
              </div>
              <div>
                <strong>22</strong>
                <span>labs</span>
              </div>
            </div>
            <div className={styles.profileActions}>
              <a href="#programs-feed" className={styles.primaryPill}>
                Programs on the atoll
              </a>
              <a href="#from-the-atoll" className={styles.secondaryPill}>
                From the atoll
              </a>
            </div>
          </section>

          
        </aside>

        <section className={styles.content}>
          <section className={styles.feedIntro}>
            <div className={styles.feedIntroText}>
              <div className={styles.feedKicker}>Social page</div>
              <h2 className={styles.feedTitle}>
                The <span>atoll feed.</span>
              </h2>
              <p className={styles.feedCopy}>
                Same research and same field stories, but framed like a social
                stream so visitors can scan, pause, and fall into the work.
              </p>
            </div>

            <div className={styles.highlightRail} aria-label="Story highlights">
              {storyHighlights.map((item) => (
                <a key={item.label} href={item.href} className={styles.highlight}>
                  <span className={styles.highlightRing}>
                    <span className={styles.highlightCore}>{item.label.slice(0, 2)}</span>
                  </span>
                  <span className={styles.highlightLabel}>{item.label}</span>
                  <span className={styles.highlightDetail}>{item.detail}</span>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.feed} id="feed">
            {feedPosts.map((post, index) => {
              const anchorId =
                post.source === "Programs on the atoll" && index === 0
                  ? "programs-feed"
                  : post.source === "From the atoll" &&
                      !feedPosts.slice(0, index).some((entry) => entry.source === post.source)
                    ? "from-the-atoll"
                    : undefined;

              return (
                <article
                  key={post.id}
                  id={anchorId}
                  className={styles.post}
                  style={{ "--post-accent": post.accent } as CSSProperties}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.avatar}>{post.avatar}</div>
                    <div className={styles.identity}>
                      <div className={styles.identityRow}>
                        <span className={styles.handle}>{post.handle}</span>
                        <span className={styles.identityDot} aria-hidden="true" />
                        <span className={styles.stamp}>{post.stamp}</span>
                      </div>
                      <div className={styles.location}>{post.location}</div>
                    </div>
                    <div className={styles.sourceBadge}>{post.source}</div>
                  </div>

                  <div className={styles.mediaWrap}>
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      className={styles.media}
                      sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1100px) min(100vw - 40px, 720px), 720px"
                    />
                  </div>

                    <div className={styles.postBody}>
                      <div className={styles.actionStrip} aria-hidden="true">
                        <span>Like</span>
                        <span>Comment</span>
                        <span>Share</span>
                        <span>Save</span>
                      </div>
                    <div className={styles.metrics}>
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.duration}</span>
                    </div>
                    <p className={styles.caption}>
                      <strong>{post.tag}</strong> {post.title} {post.description}
                    </p>
                    <div className={styles.postFooter}>
                      <span className={styles.footerChip}>{post.source}</span>
                      <Link href={post.sourceHref} className={styles.footerLink}>
                        {post.actionLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </section>
      </main>
    </div>
  );
}
