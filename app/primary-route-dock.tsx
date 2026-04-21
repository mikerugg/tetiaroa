import Link from "next/link";
import styles from "./primary-route-dock.module.css";

type DockRoute = "home" | "impact" | "turtle-tales";

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

const dockItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "impact", label: "Impact Feed", href: "/impact" },
  { id: "turtle-tales", label: "Turtle Tales", href: "/turtle-tales" },
  { id: "donate", label: "Donate", href: "/#join" },
] as const;

export function PrimaryRouteDock({
  active,
  className,
}: {
  active: DockRoute;
  className?: string;
}) {
  return (
    <nav className={cx(styles.dock, className)} aria-label="Primary mobile navigation">
      {dockItems.map((item) => {
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
