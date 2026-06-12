import Image from "next/image";
import type { CSSProperties } from "react";
import type { MotifId } from "./motifs";
import styles from "./page.module.css";

type TetiaroaLogoProps = {
  activeId?: MotifId | null;
  className?: string;
  showWordmark?: boolean;
  title?: string;
};

type Segment = {
  id: MotifId;
  src: string;
  revealClassName: string;
};

type SegmentStyle = CSSProperties & {
  "--motif-progress": string;
  "--motif-reveal": string;
};

const segmentSize = {
  width: 1868,
  height: 950,
};

const motifClassNames: Record<MotifId, string> = {
  fern: styles.motifFern,
  "shark-teeth": styles.motifSharkTeeth,
  braid: styles.motifBraid,
  spiral: styles.motifSpiral,
  waves: styles.motifWaves,
  "eye-of-light": styles.motifEyeOfLight,
  bird: styles.motifBird,
};

const segments: Segment[] = [
  {
    id: "fern",
    src: "/logos/mark-segments/fern.png",
    revealClassName: styles.revealFromLeft,
  },
  {
    id: "shark-teeth",
    src: "/logos/mark-segments/shark-teeth.png",
    revealClassName: styles.revealFromTop,
  },
  {
    id: "braid",
    src: "/logos/mark-segments/braid.png",
    revealClassName: styles.revealFromLeft,
  },
  {
    id: "spiral",
    src: "/logos/mark-segments/spiral.png",
    revealClassName: styles.revealCircle,
  },
  {
    id: "waves",
    src: "/logos/mark-segments/waves.png",
    revealClassName: styles.revealFromLeft,
  },
  {
    id: "eye-of-light",
    src: "/logos/mark-segments/eye-of-light.png",
    revealClassName: styles.revealCircleRight,
  },
  {
    id: "bird",
    src: "/logos/mark-segments/bird.png",
    revealClassName: styles.revealFromRight,
  },
];

function segmentStyle(id: MotifId): SegmentStyle {
  return {
    "--motif-progress": `var(--progress-${id}, 1)`,
    "--motif-reveal": `var(--reveal-${id}, 100%)`,
  };
}

function segmentClass(segment: Segment, activeId?: MotifId | null) {
  return [
    styles.logoImage,
    styles.logoMotif,
    motifClassNames[segment.id],
    segment.revealClassName,
    activeId === segment.id ? styles.logoMotifActive : "",
    activeId && activeId !== segment.id ? styles.logoMotifMuted : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function TetiaroaLogo({
  activeId,
  className,
  showWordmark = false,
  title,
}: TetiaroaLogoProps) {
  const labelled = Boolean(title);

  return (
    <div
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
      className={[
        styles.logoSvg,
        showWordmark ? "" : styles.logoSymbolOnly,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={labelled ? "img" : undefined}
    >
      {segments.map((segment) => (
        <Image
          alt=""
          className={segmentClass(segment, activeId)}
          draggable={false}
          height={segmentSize.height}
          key={segment.id}
          priority={segment.id === "fern"}
          sizes="(max-width: 760px) 100vw, 760px"
          src={segment.src}
          style={segmentStyle(segment.id)}
          width={segmentSize.width}
        />
      ))}

      {showWordmark ? (
        <Image
          alt=""
          className={[styles.logoImage, styles.wordmarkLayer]
            .filter(Boolean)
            .join(" ")}
          draggable={false}
          height={segmentSize.height}
          sizes="(max-width: 760px) 100vw, 760px"
          src="/logos/mark-segments/wordmark.png"
          width={segmentSize.width}
        />
      ) : null}
    </div>
  );
}
