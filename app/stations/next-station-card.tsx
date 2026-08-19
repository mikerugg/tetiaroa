import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "./next-station-card.module.css";

export function NextStationCard({
  badge,
  title,
  line,
}: {
  badge: string;
  title: string;
  line: string;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-dashed pt-0">
      <div className={cn(styles.stripes, "h-3 w-full")} aria-hidden="true" />

      <div className="relative aspect-video overflow-hidden bg-muted/30 text-primary">
        <svg
          viewBox="0 0 480 270"
          className="size-full"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="A blueprint of an unbuilt field station, still being surveyed"
        >
          <defs>
            <pattern
              id="ns-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0H0V24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.16"
              />
            </pattern>
          </defs>

          <rect width="480" height="270" fill="url(#ns-grid)" />

          {/* Footprint: main block, lab wing, water tank. */}
          <g fill="none" stroke="currentColor" strokeWidth="2.25">
            <path
              className={styles.plan}
              d="M132 84h150v46h62v78H132z"
              opacity="0.85"
            />
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.42">
            <path d="M132 152h150M212 84v68M282 130h62" />
            <circle cx="372" cy="96" r="17" strokeDasharray="4 4" />
          </g>

          {/* Dimension run with the width still unknown. */}
          <g stroke="currentColor" strokeWidth="1" opacity="0.5">
            <path d="M132 234h212M132 227v14M344 227v14" />
          </g>
          <text
            x="238"
            y="228"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.75"
            style={{ font: "600 15px var(--font-mono), monospace" }}
          >
            ?
          </text>

          {/* North arrow. */}
          <g stroke="currentColor" strokeWidth="1.4" opacity="0.5">
            <path d="M62 118V74M62 74l-8 11M62 74l8 11" />
          </g>

          {/* Surveyor's crosshair, still choosing a site. */}
          <g className={styles.marker} opacity="0.9">
            <circle
              cx="404"
              cy="196"
              r="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="3 4"
            />
            <path
              d="M404 176v12M404 204v12M384 196h12M412 196h12"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </g>
        </svg>
      </div>

      <CardHeader>
        <Badge variant="outline" className="w-fit font-mono">
          {badge}
        </Badge>
        <CardTitle className="mt-3 font-header text-4xl leading-none tracking-normal sm:text-5xl">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-7 text-muted-foreground">{line}</p>
      </CardContent>
    </Card>
  );
}
