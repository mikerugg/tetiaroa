"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState, useTransition } from "react";
import styles from "./atoll-map-section.module.css";

const GOOGLE_MAPS_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const TETIAROA_CENTER = {
  lat: -17.01,
  lng: -149.56,
};
const DEFAULT_ZOOM = 14;
const MOBILE_DEFAULT_ZOOM = DEFAULT_ZOOM - 1;
const MOBILE_VIEWPORT_MEDIA_QUERY = "(max-width: 700px)";

const filters = [
  "All Sites",
  "Turtles",
  "Birds",
  "Coral Reefs",
  "Cultural",
] as const;

const tabs = [
  { id: "map", label: "Map", eyebrow: "Explore" },
  { id: "research", label: "Research", eyebrow: "Field Notes" },
  { id: "sanctuaries", label: "Sanctuaries", eyebrow: "Protection" },
  { id: "support", label: "Support", eyebrow: "Next Action" },
] as const;

type SiteFilter = (typeof filters)[number];
type SiteCategory = Exclude<SiteFilter, "All Sites">;
type TabId = (typeof tabs)[number]["id"];

type MapSite = {
  id: string;
  name: string;
  marker: string;
  category: SiteCategory;
  status: string;
  title: string;
  summary: string;
  focus: string;
  nextNeed: string;
  supportNeed: string;
  left: string;
  top: string;
  color: string;
  image: string;
  alt: string;
  statA: string;
  statB: string;
};

const mapSites: MapSite[] = [
  {
    id: "motu-one",
    name: "Motu One",
    marker: "MO",
    category: "Turtles",
    status: "Nesting Sanctuary",
    title: "Motu One protected zone",
    summary:
      "Prototype layer for turtle patrols, tagged nests, and shoreline movement around the southern edge.",
    focus: "Green turtle nesting corridor",
    nextNeed: "Placeholder feed for nightly patrol logs and hatch timing.",
    supportNeed: "Boat fuel and night-shift supplies.",
    left: "26%",
    top: "38%",
    color: "#73e8f0",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85&auto=format&fit=crop",
    alt: "Sea turtle nesting on a tropical beach",
    statA: "12 active tags",
    statB: "4 patrol nights",
  },
  {
    id: "tahuna-iti",
    name: "Tahuna Iti",
    marker: "TI",
    category: "Birds",
    status: "Colony Watch",
    title: "Tahuna Iti seabird rise",
    summary:
      "Prototype layer for colony counts, nest success, and seasonal arrival windows on the lagoon-facing ridge.",
    focus: "Red-footed booby return site",
    nextNeed: "Placeholder feed for transects, blinds, and chick counts.",
    supportNeed: "Field batteries and observation blinds.",
    left: "52%",
    top: "50%",
    color: "#bfd776",
    image:
      "https://images.unsplash.com/photo-1587613864411-ac83abff7c2e?w=1200&q=85&auto=format&fit=crop",
    alt: "Seabirds flying over the ocean",
    statA: "18 count points",
    statB: "6 survey blinds",
  },
  {
    id: "rimatuu",
    name: "Rimatu'u",
    marker: "RM",
    category: "Coral Reefs",
    status: "Reef Transect",
    title: "Rimatu'u coral grid",
    summary:
      "Prototype layer for bleaching recovery, fish activity, and reef-edge transects on the outer rim.",
    focus: "Coral resilience checkpoints",
    nextNeed: "Placeholder feed for reef photo quadrats and temperature spikes.",
    supportNeed: "Dive windows and sensor maintenance.",
    left: "69%",
    top: "62%",
    color: "#8fc9c9",
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&q=85&auto=format&fit=crop",
    alt: "Close view of branching coral underwater",
    statA: "9 reef lines",
    statB: "3 temp arrays",
  },
  {
    id: "onetahi",
    name: "Onetahi",
    marker: "ON",
    category: "Cultural",
    status: "Learning Ground",
    title: "Onetahi field campus",
    summary:
      "Prototype layer for classrooms, cultural routes, and open-station moments shared with students and visiting teams.",
    focus: "Community and research gateway",
    nextNeed: "Placeholder feed for class visits, oral histories, and station activity.",
    supportNeed: "Scholar travel and field-kit support.",
    left: "61%",
    top: "28%",
    color: "#e7b27a",
    image:
      "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=1200&q=85&auto=format&fit=crop",
    alt: "Research station facing tropical water",
    statA: "22 partner labs",
    statB: "14 live projects",
  },
];

function getPanel(site: MapSite, tab: TabId) {
  switch (tab) {
    case "research":
      return {
        eyebrow: "Field Notes",
        title: `${site.name}: read the signals.`,
        description: `${site.nextNeed} Placeholder space for instruments, logs, and field summaries tied to ${site.focus.toLowerCase()}.`,
        actionLabel: "See active programs",
        actionHref: "#programs",
        metaA: site.statA,
        metaB: "beta schema",
      };
    case "sanctuaries":
      return {
        eyebrow: "Protection",
        title: `${site.name}: guard the edge.`,
        description: `Placeholder space for access rules, pressure alerts, and recovery thresholds around ${site.title.toLowerCase()}.`,
        actionLabel: "Review the timeline",
        actionHref: "#chronology",
        metaA: "status: watched",
        metaB: site.category.toLowerCase(),
      };
    case "support":
      return {
        eyebrow: "Next Action",
        title: `Back ${site.name}.`,
        description: `${site.supportNeed} Placeholder space for donor actions, volunteer asks, and next-step briefs.`,
        actionLabel: "Support this work",
        actionHref: "#join",
        metaA: "window: open",
        metaB: "brief: placeholder",
      };
    case "map":
    default:
      return {
        eyebrow: site.status,
        title: site.title,
        description: site.summary,
        actionLabel: "See nearby species",
        actionHref: "#wildlife",
        metaA: site.statA,
        metaB: site.statB,
      };
  }
}

function getDefaultZoom(isMobileViewport: boolean) {
  return isMobileViewport ? MOBILE_DEFAULT_ZOOM : DEFAULT_ZOOM;
}

export function AtollMapSection() {
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<SiteFilter>("All Sites");
  const [activeTab, setActiveTab] = useState<TabId>("map");
  const [selectedSiteId, setSelectedSiteId] = useState(mapSites[0]?.id ?? "");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY);

    const syncViewport = (nextIsMobileViewport: boolean) => {
      setIsMobileViewport(nextIsMobileViewport);
      setZoom((currentZoom) => {
        if (currentZoom === DEFAULT_ZOOM || currentZoom === MOBILE_DEFAULT_ZOOM) {
          return getDefaultZoom(nextIsMobileViewport);
        }

        return currentZoom;
      });
    };

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewport(event.matches);
    };

    syncViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const visibleSites =
    activeFilter === "All Sites"
      ? mapSites
      : mapSites.filter((site) => site.category === activeFilter);

  const selectedSite =
    visibleSites.find((site) => site.id === selectedSiteId) ?? visibleSites[0] ?? mapSites[0];
  const panel = getPanel(selectedSite, activeTab);
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.eyebrow ?? "Explore";
  const mapSrc = GOOGLE_MAPS_EMBED_KEY
    ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(
        GOOGLE_MAPS_EMBED_KEY,
      )}&center=${TETIAROA_CENTER.lat},${TETIAROA_CENTER.lng}&zoom=${zoom}&maptype=satellite&language=en`
    : null;

  const handleFilterChange = (nextFilter: SiteFilter) => {
    if (nextFilter === activeFilter) {
      return;
    }

    const nextVisible =
      nextFilter === "All Sites"
        ? mapSites
        : mapSites.filter((site) => site.category === nextFilter);

    startTransition(() => {
      setActiveFilter(nextFilter);
      setSelectedSiteId(nextVisible[0]?.id ?? mapSites[0]?.id ?? "");
      setZoom(getDefaultZoom(isMobileViewport));
    });
  };

  const handleSelectSite = (siteId: string) => {
    startTransition(() => {
      setSelectedSiteId(siteId);
    });
  };

  const handleTabChange = (nextTab: TabId) => {
    if (nextTab === activeTab) {
      return;
    }

    startTransition(() => {
      setActiveTab(nextTab);
    });
  };

  return (
    <section className={styles.section} id="explore" aria-labelledby="explore-title">
      <div className={styles.intro}>
        <div className={styles.kicker}>Prototype widget</div>
        <h2 className={styles.title} id="explore-title">
          Explore the <span>atoll.</span>
        </h2>
        <p className={styles.copy}>
          Filter placeholder layers, jump between pins, and switch the panel
          view as if the field map were already live.
        </p>
      </div>

      <div className={styles.shell} data-pending={isPending ? "true" : "false"}>
        <div className={styles.topBar}>
          <div>
            <div className={styles.shellEyebrow}>{activeTabLabel}</div>
            <h3 className={styles.shellTitle}>Field console: Tetiaroa</h3>
          </div>
          <div className={styles.topMeta}>
            <span className={styles.coordinate}>17.01° S, 149.56° W</span>
            <span className={styles.zoomBadge}>Zoom {zoom}</span>
          </div>
        </div>

        <div className={styles.filterRail} aria-label="Site categories">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                className={isActive ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip}
                aria-pressed={isActive}
                onClick={() => {
                  handleFilterChange(filter);
                }}
              >
                {filter}
              </button>
            );
          })}
          <div className={styles.siteCount}>{visibleSites.length} sites visible</div>
        </div>

        <div className={styles.mapPane}>
          <div
            className={styles.mapSurface}
            aria-label="Google map of Tetiaroa"
          >
            {mapSrc ? (
              <iframe
                key={zoom}
                className={styles.mapFrame}
                title="Google map of Tetiaroa"
                src={mapSrc}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className={styles.mapFallback}>
                <div className={styles.mapFallbackCard}>
                  <div className={styles.mapFallbackEyebrow}>Google Maps required</div>
                  <h4 className={styles.mapFallbackTitle}>Add the embed key.</h4>
                  <p className={styles.mapFallbackCopy}>
                    Set <code>NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY</code> to load the
                    live satellite map of Tetiaroa in this widget.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=-17.01,-149.56"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.mapFallbackAction}
                  >
                    Open Tetiaroa in Google Maps
                  </a>
                </div>
              </div>
            )}
            <div className={styles.mapWash} aria-hidden="true" />
            <div className={styles.hotspots}>
              {visibleSites.map((site) => {
                const isActive = site.id === selectedSite.id;

                return (
                  <button
                    key={site.id}
                    type="button"
                    className={isActive ? `${styles.pin} ${styles.pinActive}` : styles.pin}
                    aria-pressed={isActive}
                    aria-label={`Focus ${site.name}`}
                    style={
                      {
                        "--pin-color": site.color,
                        left: site.left,
                        top: site.top,
                      } as CSSProperties
                    }
                    onClick={() => {
                      handleSelectSite(site.id);
                    }}
                  >
                    <span className={styles.pinMarker}>
                      <span className={styles.pinHalo} aria-hidden="true" />
                      <span className={styles.pinCore}>
                        <span className={styles.pinCode}>{site.marker}</span>
                      </span>
                    </span>
                    <span className={styles.pinLabel}>{site.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.controls} aria-label="Map controls">
            <button
              type="button"
              className={styles.controlButton}
              aria-label="Zoom in"
              onClick={() => {
                setZoom((current) => Math.min(current + 1, 17));
              }}
            >
              +
            </button>
            <button
              type="button"
              className={styles.controlButton}
              aria-label="Zoom out"
              onClick={() => {
                setZoom((current) => Math.max(current - 1, 12));
              }}
            >
              -
            </button>
            <button
              type="button"
              className={`${styles.controlButton} ${styles.controlButtonWide}`}
              onClick={() => {
                startTransition(() => {
                  setZoom(getDefaultZoom(isMobileViewport));
                  setSelectedSiteId(visibleSites[0]?.id ?? mapSites[0]?.id ?? "");
                });
              }}
            >
              Focus
            </button>
          </div>

          <article className={styles.infoCard}>
            <div className={styles.infoMedia}>
              <Image
                src={selectedSite.image}
                alt={selectedSite.alt}
                fill
                sizes="(max-width: 700px) 100vw, 320px"
                className={styles.infoImage}
              />
              <div className={styles.infoBadge}>{selectedSite.category}</div>
            </div>

            <div className={styles.infoBody}>
              <div className={styles.infoMeta}>
                <span className={styles.infoDot} aria-hidden="true" />
                <span className={styles.infoEyebrow}>{panel.eyebrow}</span>
              </div>
              <h3 className={styles.infoTitle}>{panel.title}</h3>
              <p className={styles.infoCopy}>{panel.description}</p>
              <div className={styles.infoFooter}>
                <div className={styles.infoStats}>
                  <span>{panel.metaA}</span>
                  <span>{panel.metaB}</span>
                </div>
                <a href={panel.actionHref} className={styles.infoAction}>
                  {panel.actionLabel}
                </a>
              </div>
            </div>
          </article>
        </div>

        <nav className={styles.tabBar} aria-label="Map views">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                className={isActive ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                aria-pressed={isActive}
                onClick={() => {
                  handleTabChange(tab.id);
                }}
              >
                <span className={styles.tabEyebrow}>{tab.eyebrow}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
