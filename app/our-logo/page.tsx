import Image from "next/image";
import Link from "next/link";
import { HomepageInitialScrollReset } from "../homepage-client";
import { TopToolbar } from "../top-toolbar";
import { LogoCanvas } from "./logo-canvas";
import { motifs } from "./motifs";
import styles from "./page.module.css";

export default function MarkPage() {
  return (
    <>
      <HomepageInitialScrollReset />
      <div className={styles.page}>
        <TopToolbar />

        <main>
          <section className={styles.hero} id="hero">
            <div className={styles.heroTexture} aria-hidden="true" />
            <div className={styles.heroMark} aria-hidden="true">
              <Image
                src="/logos/mark-segments/design-mark.png"
                alt=""
                width={1868}
                height={950}
                priority
              />
            </div>

            <div className={styles.cornerCoords}>
              17&deg; 00&apos; 18&quot; S / 149&deg; 34&apos; 13&quot; W
              <br />
              Tetiaroa Atoll / Society Islands
            </div>

            <div className={styles.heroInner}>
              <div className={styles.eyebrow}>Tetiaroa Society</div>
              <h1>Seven symbols.</h1>
              <h1>One home.</h1>
              <p>
               Discover the story and meaning behind our logo.
              </p>
              <a href="#drawing" className={styles.scrollCta}>
                Ink the story
              </a>
            </div>
          </section>

          <LogoCanvas motifs={motifs} />
        </main>

        <footer className={styles.footerMini}>
          <div className={styles.footerBrand}>
            <Image
              src="/logos/TSFP_Logo_2026_White.png"
              alt="Tetiaroa Society"
              width={596}
              height={371}
              className={styles.footerLogo}
            />
          </div>
          <div className={styles.footerLinks}>
            <Link href="/">Current homepage</Link>
            <Link href="/">Te Hohonu</Link>
            <Link href="/impact">Impact Feed</Link>
            <Link href="/turtle-tales">Turtle Tales</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
