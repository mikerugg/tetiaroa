import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HomeCopy } from "./home-copy";
import styles from "./home-experience.module.css";

export function LogoCallout({
  copy,
}: {
  copy: HomeCopy["kids"]["logoCallout"];
}) {
  return (
    <aside>
      <Link className={styles.logoCallout} href={copy.href}>
        <div className={styles.logoCalloutMark}>
          <Image
            src={copy.image}
            alt={copy.alt}
            fill
            className={styles.logoCalloutMarkImage}
            sizes="(width < 768px) 360px, (width < 1024px) 320px, 380px"
          />
        </div>
        <div className={styles.logoCalloutCopy}>
          <div className={cn(styles.logoCalloutEyebrow, "font-mono")}>
            {copy.eyebrow}
          </div>
          <h3 className={cn(styles.logoCalloutTitle, "font-display")}>
            {copy.title}
          </h3>
          <p>{copy.copy}</p>
          <span className={cn(styles.logoCalloutAction, "font-mono")}>
            {copy.cta}
            <ArrowUpRightIcon
              className={styles.logoCalloutActionIcon}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </aside>
  );
}
