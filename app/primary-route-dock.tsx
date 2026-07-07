import Link from "next/link";
import {
  ENGLISH_HOME_PATH,
  ENGLISH_IMPACT_PATH,
  FRENCH_HOME_PATH,
  FRENCH_IMPACT_PATH,
} from "./language-links";
import styles from "./primary-route-dock.module.css";

type DockRoute = "home" | "impact" | "turtle-tales";
type DockLocale = "en" | "fr";

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

const dockItems: Record<
  DockLocale,
  Array<{ id: DockRoute | "donate"; label: string; href: string }>
> = {
  en: [
    { id: "home", label: "Home", href: ENGLISH_HOME_PATH },
    { id: "impact", label: "Impact Feed", href: ENGLISH_IMPACT_PATH },
    { id: "turtle-tales", label: "Turtle Tales", href: "/turtle-tales" },
    { id: "donate", label: "Donate", href: `${ENGLISH_HOME_PATH}#join` },
  ],
  fr: [
    { id: "home", label: "Accueil", href: FRENCH_HOME_PATH },
    { id: "impact", label: "Impact", href: FRENCH_IMPACT_PATH },
    { id: "turtle-tales", label: "Tortues", href: "/turtle-tales" },
    { id: "donate", label: "Donner", href: `${FRENCH_HOME_PATH}#join` },
  ],
};

export function PrimaryRouteDock({
  active,
  className,
  locale = "en",
}: {
  active: DockRoute;
  className?: string;
  locale?: DockLocale;
}) {
  return (
    <nav className={cx(styles.dock, className)} aria-label="Primary mobile navigation">
      {dockItems[locale].map((item) => {
        const isActive = item.id === active;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cx(styles.link, isActive && styles.linkActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
