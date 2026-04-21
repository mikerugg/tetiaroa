import type { CSSProperties } from "react";
import type { PlushPalette } from "./data";

export function PlushTurtle({
  palette,
  className,
  style,
}: {
  palette: PlushPalette;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 280 220"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g>
        <ellipse
          cx="82"
          cy="112"
          rx="30"
          ry="18"
          fill={palette.fin}
          transform="rotate(-26 82 112)"
        />
        <ellipse
          cx="198"
          cy="112"
          rx="30"
          ry="18"
          fill={palette.fin}
          transform="rotate(26 198 112)"
        />
        <ellipse
          cx="105"
          cy="182"
          rx="24"
          ry="14"
          fill={palette.fin}
          transform="rotate(12 105 182)"
        />
        <ellipse
          cx="175"
          cy="182"
          rx="24"
          ry="14"
          fill={palette.fin}
          transform="rotate(-12 175 182)"
        />
        <circle cx="228" cy="104" r="28" fill={palette.body} />
        <ellipse cx="140" cy="116" rx="72" ry="58" fill={palette.shell} />
        <ellipse cx="140" cy="118" rx="52" ry="40" fill={palette.body} opacity="0.22" />
        <ellipse cx="136" cy="128" rx="42" ry="28" fill={palette.belly} />
        <circle cx="222" cy="101" r="5.5" fill="#14343a" />
        <circle cx="242" cy="101" r="5.5" fill="#14343a" />
        <circle cx="216" cy="118" r="6" fill={palette.sparkle} opacity="0.8" />
        <circle cx="248" cy="118" r="6" fill={palette.sparkle} opacity="0.8" />
        <path
          d="M224 126 C229 131 237 131 242 126"
          stroke={palette.stitch}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M110 92 C126 76 154 72 176 88"
          stroke={palette.stitch}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M96 122 C118 142 158 146 186 126"
          stroke={palette.stitch}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M138 76 L138 154"
          stroke={palette.stitch}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <circle cx="126" cy="108" r="8" fill={palette.sparkle} opacity="0.45" />
        <circle cx="158" cy="94" r="8" fill={palette.sparkle} opacity="0.45" />
        <circle cx="161" cy="126" r="8" fill={palette.sparkle} opacity="0.45" />
      </g>
    </svg>
  );
}
