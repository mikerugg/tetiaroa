import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import styles from "./page.module.css";
import {
  activationSteps,
  grownupCards,
  plushCharacters,
} from "./data";
import { PlushTurtle } from "./plush-turtle";
import { QrStamp } from "./qr-stamp";
import { StoryLab } from "./story-lab";
import { TetiaroaMark } from "../tetiaroa-mark";

export const metadata: Metadata = {
  title: "Turtle Tales / Tetiaroa Society",
  description:
    "A playful product page for QR-linked turtle plush toys that unlock AI storybooks and custom art for kids.",
};

export default function TurtleTalesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.wordmark}>
          <TetiaroaMark className={styles.wordmarkIcon} />
          turtle.tales
        </div>
        <nav className={styles.navLinks} aria-label="Primary">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/impact" className={styles.navLink}>
            Impact Feed
          </Link>
          <Link
            href="/turtle-tales"
            className={`${styles.navLink} ${styles.navLinkActive}`}
            aria-current="page"
          >
            Turtle Tales
          </Link>
        </nav>
        <a href="#shop" className={styles.topAction}>
          Shop Hatchlings
        </a>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>Plush + QR + AI play</div>
            <h1 className={styles.title}>
              Adopt a turtle.
              <br />
              <span>Wake up its stories.</span>
            </h1>
            <p className={styles.copy}>
              Turtle Tales turns a stuffed turtle into a story friend. Each plush
              comes with a shell QR tag that unlocks kid-safe AI storybooks,
              collectible art, and bedtime adventures starring that exact turtle.
            </p>
            <div className={styles.heroActions}>
              <a href="#shop" className={styles.primaryAction}>
                Meet the hatchlings
              </a>
              <a href="#story-lab" className={styles.secondaryAction}>
                Try the sample lab
              </a>
            </div>
            <div className={styles.factRow}>
              <div className={styles.factPill}>QR shell tag in every box</div>
              <div className={styles.factPill}>AI text and image keepsakes</div>
              <div className={styles.factPill}>Guided prompts for kids</div>
              <div className={styles.factPill}>Supports turtle conservation</div>
            </div>
          </div>

          <div className={styles.heroStage}>
            <div className={styles.heroBurst} aria-hidden="true" />

            <div className={styles.heroToyCluster}>
              {plushCharacters.map((plush, index) => (
                <article
                  key={plush.id}
                  className={`${styles.heroToyCard} ${styles[`heroToy${index + 1}`]}`}
                  style={
                    {
                      "--toy-accent": plush.palette.shell,
                      "--toy-body": plush.palette.body,
                    } as CSSProperties
                  }
                >
                  <PlushTurtle palette={plush.palette} className={styles.heroToy} />
                  <div className={styles.heroToyMeta}>
                    <strong>{plush.name}</strong>
                    <span>{plush.persona}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.scanCard}>
              <div className={styles.scanLabel}>Scan the shell charm</div>
              <div className={styles.scanRow}>
                <QrStamp className={styles.heroQr} />
                <p className={styles.scanCopy}>
                  One quick scan opens the turtle&apos;s story passport, art gallery,
                  and adventure credits.
                </p>
              </div>
            </div>

            <div className={styles.sampleCard}>
              <div className={styles.sampleKicker}>Sample unlock</div>
              <h2 className={styles.sampleTitle}>Milo and the Moonbeam Parade</h2>
              <p className={styles.sampleCopy}>
                The first story can arrive seconds after the toy comes out of the box.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.shop} id="shop">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>Plush shop</div>
            <h2 className={styles.sectionTitle}>
              Pick a <span>story hatchling.</span>
            </h2>
            <p className={styles.sectionCopy}>
              Every turtle plush includes a scan-to-start shell tag, starter story
              credits, and a personality that shapes the kinds of tales kids can make.
            </p>
          </div>

          <div className={styles.productGrid}>
            {plushCharacters.map((plush) => (
              <article
                key={plush.id}
                className={styles.productCard}
                style={
                  {
                    "--card-accent": plush.palette.shell,
                    "--card-glow": plush.palette.sparkle,
                  } as CSSProperties
                }
              >
                <div className={styles.productScene}>
                  <div className={styles.productBadge}>{plush.badge}</div>
                  <PlushTurtle palette={plush.palette} className={styles.productTurtle} />
                </div>
                <div className={styles.productBody}>
                  <div className={styles.productTop}>
                    <div>
                      <div className={styles.productTag}>{plush.persona}</div>
                      <h3 className={styles.productName}>{plush.name}</h3>
                    </div>
                    <div className={styles.productPrice}>{plush.price}</div>
                  </div>
                  <p className={styles.productCopy}>{plush.blurb}</p>
                  <div className={styles.catchphrase}>{plush.catchphrase}</div>
                  <ul className={styles.packList}>
                    {plush.starterPack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className={styles.productFooter}>
                    <a href="#story-lab" className={styles.productAction}>
                      Adopt {plush.name.split(" ")[0]}
                    </a>
                    <div className={styles.productImpact}>{plush.impact}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workflow}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>How it works</div>
            <h2 className={styles.sectionTitle}>
              From plush friend to <span>story machine.</span>
            </h2>
            <p className={styles.sectionCopy}>
              The page does more than sell a toy. It sets up an easy ritual: choose,
              scan, personalize, and keep a library of turtle-made adventures.
            </p>
          </div>

          <div className={styles.workflowGrid}>
            <div className={styles.stepGrid}>
              {activationSteps.map((item) => (
                <article key={item.step} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{item.step}</div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepCopy}>{item.copy}</p>
                </article>
              ))}
            </div>

            <div className={styles.passportCard}>
              <div className={styles.passportTop}>
                <div>
                  <div className={styles.passportLabel}>Story passport</div>
                  <div className={styles.passportName}>Lani Lagoon</div>
                </div>
                <QrStamp className={styles.passportQr} />
              </div>
              <div className={styles.passportShelf}>
                <div className={styles.passportStory}>8 saved bedtime tales</div>
                <div className={styles.passportStory}>5 poster-style art cards</div>
                <div className={styles.passportStory}>1 birthday adventure slot</div>
              </div>
              <p className={styles.passportCopy}>
                The QR code becomes the child&apos;s doorway back into their turtle&apos;s
                world, not just a one-time trick.
              </p>
            </div>
          </div>
        </section>

        <StoryLab />

        <section className={styles.grownups}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>For grownups too</div>
            <h2 className={styles.sectionTitle}>
              Built to feel magical and <span>thought through.</span>
            </h2>
            <p className={styles.sectionCopy}>
              The fun part is obvious. The product thinking matters too: guidance,
              repeat play, ownership via QR, and a real connection back to turtles.
            </p>
          </div>

          <div className={styles.grownupGrid}>
            {grownupCards.map((card) => (
              <article key={card.title} className={styles.grownupCard}>
                <h3 className={styles.grownupTitle}>{card.title}</h3>
                <p className={styles.grownupCopy}>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCard}>
          <div className={styles.finalCopy}>
            <div className={styles.sectionKicker}>What the page proves</div>
            <h2 className={styles.finalTitle}>
              Plush toys can open a whole <span>story ecosystem.</span>
            </h2>
            <p className={styles.finalText}>
              This concept gives kids a character they can hold, stories they can
              make again and again, and art they can save like tiny trophies.
            </p>
          </div>
          <div className={styles.finalActions}>
            <a href="#shop" className={styles.primaryAction}>
              Start with a hatchling
            </a>
            <a href="#story-lab" className={styles.secondaryAction}>
              Watch the sample change
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
