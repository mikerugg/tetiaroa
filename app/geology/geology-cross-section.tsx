import type { GeologyStage } from "./geology-content";
import styles from "./geology.module.css";

type GeologyCrossSectionProps = {
  activeStage: GeologyStage;
  activeIndex: number;
  ariaLabel: string;
  title: string;
  summary: string;
};

const waterSurface =
  "M0 205 C90 197 155 212 244 204 C342 195 405 213 495 203 C586 194 678 213 762 204 C840 196 899 210 960 202";

const lowstandSurface =
  "M0 430 C90 422 155 437 244 429 C342 420 405 438 495 428 C586 419 678 438 762 429 C840 421 899 435 960 427";

const karstPlatform =
  "M77 415 C91 330 108 238 142 205 C173 185 205 254 240 309 C280 361 330 381 376 359 C420 338 447 305 480 298 C513 305 540 338 584 359 C630 381 680 361 720 309 C755 254 787 185 818 205 C852 238 869 330 883 415 Z";

export function GeologyCrossSection({
  activeStage,
  activeIndex,
  ariaLabel,
  title,
  summary,
}: GeologyCrossSectionProps) {
  return (
    <figure className={styles.crossSectionFigure} data-stage={activeIndex}>
      <svg
        className={styles.crossSection}
        viewBox="0 0 960 620"
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>{title}</title>
        <desc>{summary}</desc>
        <defs>
          <linearGradient id="geo-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#081c2a" />
            <stop offset="1" stopColor="#174f5d" />
          </linearGradient>
          <linearGradient id="geo-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#47d9d4" stopOpacity="0.82" />
            <stop offset="0.24" stopColor="#168aa2" stopOpacity="0.92" />
            <stop offset="1" stopColor="#062337" />
          </linearGradient>
          <linearGradient id="geo-rock" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#684941" />
            <stop offset="0.5" stopColor="#303038" />
            <stop offset="1" stopColor="#111921" />
          </linearGradient>
          <linearGradient id="geo-limestone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eadcae" />
            <stop offset="1" stopColor="#8b725b" />
          </linearGradient>
          <linearGradient id="geo-magma" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f34125" stopOpacity="0" />
            <stop offset="0.48" stopColor="#f15c2e" stopOpacity="0.84" />
            <stop offset="1" stopColor="#ffd06a" />
          </linearGradient>
          <filter id="geo-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <pattern id="geo-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.2" fill="#b9f3e6" opacity="0.22" />
          </pattern>
        </defs>

        <rect width="960" height="620" fill="url(#geo-sky)" />
        <path d="M0 0h960v620H0z" fill="url(#geo-dots)" opacity="0.52" aria-hidden="true" />

        {/* 01 — An active volcano grows directly above the hotspot. */}
        <g className={`${styles.geologyScene} ${styles.sceneHotspot}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <ellipse cx="480" cy="574" rx="118" ry="30" fill="#ff5a34" opacity="0.18" filter="url(#geo-glow)" />
          <path d="M150 526 C275 499 350 388 408 265 C438 202 458 157 480 125 C508 164 532 218 566 289 C628 419 710 498 834 516 Z" fill="url(#geo-rock)" />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M418 610 C440 540 451 475 460 397 C470 309 474 222 480 139 C497 232 503 322 512 410 C520 487 533 551 553 620 Z" fill="url(#geo-magma)" opacity="0.78" />
          <path d="M480 541 C475 438 479 319 480 153" fill="none" stroke="#ffd478" strokeWidth="7" strokeLinecap="round" strokeDasharray="4 17" />
          <path d="M465 132 C456 103 474 86 467 57 C498 80 509 105 492 133 Z" fill="#ffb343" />
          <circle cx="448" cy="54" r="7" fill="#ff7647" />
          <circle cx="504" cy="69" r="5" fill="#ffd277" />
        </g>

        {/* 02 — The plate moves, but the hotspot remains fixed beneath it. */}
        <g className={`${styles.geologyScene} ${styles.sceneDrift}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <ellipse cx="748" cy="574" rx="104" ry="28" fill="#ff5a34" opacity="0.15" filter="url(#geo-glow)" />
          <path d="M20 526 C145 499 220 388 278 270 C307 210 328 165 350 138 C377 174 403 229 438 296 C501 419 582 498 706 516 Z" fill="url(#geo-rock)" />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M700 620 C715 577 724 543 738 510 C748 488 756 470 765 454 C773 496 784 544 810 620 Z" fill="url(#geo-magma)" opacity="0.72" />
          <path d="M350 138 L334 153 L365 153 Z" fill="#141b21" />
          <g className={styles.sceneMotionArrows}>
            <path d="M750 100 L585 100" />
            <path d="m607 78-24 22 24 22" />
            <path d="M690 145 L555 145" opacity="0.58" />
            <path d="m577 126-22 19 22 19" opacity="0.58" />
          </g>
        </g>

        {/* 03 — A smaller island remains while reef grows at sea level. */}
        <g className={`${styles.geologyScene} ${styles.sceneReef}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <path d="M125 526 C248 495 325 399 392 276 C426 214 455 177 480 154 C505 177 534 214 568 276 C635 399 712 495 835 526 Z" fill="url(#geo-rock)" />
          <path d="M85 470 L85 268 C112 225 143 205 183 203 C228 205 267 253 305 292 C365 346 595 346 655 292 C693 253 732 205 777 203 C817 205 848 225 875 268 L875 470 Z" fill="url(#geo-limestone)" opacity="0.9" />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M238 211 C257 199 279 198 303 207 M657 207 C681 198 703 199 722 211" className={styles.sceneLivingReef} />
          <path d="M278 238 V209 M278 224 L263 211 M278 220 L293 207 M682 238 V209 M682 224 L667 207 M682 220 L697 211" className={styles.sceneCoralGrowth} />
          <path d="M421 203 C440 190 460 183 480 181 C500 183 520 190 539 203" fill="none" stroke="#7f7567" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* 04 — Tahiti's load and the flexural depression are shown in context. */}
        <g className={`${styles.geologyScene} ${styles.sceneFlexure}`} aria-hidden="true">
          <path d="M0 484 C146 464 255 474 350 494 C453 516 532 552 650 558 C759 563 842 524 960 498 L960 620 L0 620 Z" fill="#202d33" />
          <path d="M65 490 C125 462 163 394 195 300 C214 246 233 211 252 185 C275 216 293 254 319 313 C354 393 398 457 456 507 Z" fill="url(#geo-rock)" />
          <path d="M346 530 C463 503 540 385 606 249 C647 164 686 106 724 72 C763 111 797 171 832 250 C879 356 920 436 960 474 L960 548 Z" fill="url(#geo-rock)" />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M0 484 C146 464 255 474 350 494 C453 516 532 552 650 558 C759 563 842 524 960 498" className={styles.sceneFlexureLine} />
          <path d="M210 207 C233 195 260 195 286 208" className={styles.sceneLivingReef} />
          <path d="M724 207 V415 M699 389 L724 419 L749 389" className={styles.sceneLoadArrow} />
          <text x="177" y="166" className={styles.scenePlaceLabel}>TETIAROA</text>
          <text x="694" y="50" className={styles.scenePlaceLabel}>TAHITI</text>
        </g>

        {/* 05 — The volcano is submerged; reef rock and motu remain at the surface. */}
        <g className={`${styles.geologyScene} ${styles.sceneMotu}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <path d="M170 526 C278 493 363 390 480 278 C597 390 682 493 790 526 Z" fill="url(#geo-rock)" opacity="0.82" />
          <path d="M85 470 L85 268 C112 225 143 205 183 203 C228 205 267 253 305 292 C365 346 595 346 655 292 C693 253 732 205 777 203 C817 205 848 225 875 268 L875 470 Z" fill="url(#geo-limestone)" />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M130 207 C150 194 174 194 199 206 M761 206 C786 194 810 194 830 207" className={styles.sceneLivingReef} />
          <path d="M127 204 C143 185 164 178 186 181 C206 183 219 192 233 205 Z M727 205 C741 192 754 183 774 181 C796 178 817 185 833 204 Z" className={styles.sceneMotuLand} />
          <g className={styles.sceneStormArrows}>
            <path d="M45 172 C80 155 112 158 144 180" />
            <path d="m127 161 19 20-27 4" />
            <path d="M915 172 C880 155 848 158 816 180" />
            <path d="m833 161-19 20 27 4" />
          </g>
          <circle cx="151" cy="190" r="5" fill="#f1df9e" />
          <circle cx="187" cy="187" r="4" fill="#f1df9e" />
          <circle cx="775" cy="188" r="5" fill="#f1df9e" />
          <circle cx="807" cy="191" r="4" fill="#f1df9e" />
        </g>

        {/* 06 — The same reef platform stands above the glacial ocean. */}
        <g className={`${styles.geologyScene} ${styles.sceneLowstand}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <path d="M170 526 C278 493 363 390 480 278 C597 390 682 493 790 526 Z" fill="url(#geo-rock)" opacity="0.72" />
          <path d={karstPlatform} fill="url(#geo-limestone)" />
          <path d="M77 415 C91 330 108 238 142 205 C173 185 205 254 240 309 C280 361 330 381 376 359 C420 338 447 305 480 298 C513 305 540 338 584 359 C630 381 680 361 720 309 C755 254 787 185 818 205 C852 238 869 330 883 415" className={styles.sceneTerrainEdge} />
          <ellipse cx="304" cy="384" rx="26" ry="30" className={styles.sceneKarstVoid} />
          <ellipse cx="480" cy="366" rx="24" ry="34" className={styles.sceneKarstVoid} />
          <ellipse cx="656" cy="384" rx="26" ry="30" className={styles.sceneKarstVoid} />
          <path d="M336 368 C350 342 366 341 382 361 M578 361 C594 341 610 342 624 368" className={styles.sceneKarstArch} />
          <rect y="430" width="960" height="190" fill="url(#geo-water)" />
          <path d={lowstandSurface} className={styles.sceneWaterLine} />
          <g className={styles.sceneRain}>
            <path d="M265 102 l-14 32 M387 82 l-14 32 M512 102 l-14 32 M638 78 l-14 32 M740 112 l-14 32" />
          </g>
        </g>

        {/* 07 — Reflooding preserves the karst relief beneath the modern lagoon. */}
        <g className={`${styles.geologyScene} ${styles.sceneLagoon}`} aria-hidden="true">
          <path d="M0 526 C146 507 275 520 404 512 C559 502 730 519 960 490 L960 620 L0 620 Z" fill="#17242b" />
          <path d="M170 526 C278 493 363 390 480 278 C597 390 682 493 790 526 Z" fill="url(#geo-rock)" opacity="0.72" />
          <path d={karstPlatform} fill="url(#geo-limestone)" />
          <path d="M77 415 C91 330 108 238 142 205 C173 185 205 254 240 309 C280 361 330 381 376 359 C420 338 447 305 480 298 C513 305 540 338 584 359 C630 381 680 361 720 309 C755 254 787 185 818 205 C852 238 869 330 883 415" className={styles.sceneTerrainEdge} />
          <path d="M240 309 C280 361 330 381 376 359 C408 344 429 320 447 305 L451 318 C429 335 409 356 379 371 C330 394 276 373 234 320 Z M509 318 L513 305 C531 320 552 344 584 359 C630 381 680 361 720 309 L726 320 C684 373 630 394 581 371 C551 356 531 335 509 318 Z" className={styles.sceneLagoonSediment} />
          <rect y="205" width="960" height="415" fill="url(#geo-water)" />
          <path d={waterSurface} className={styles.sceneWaterLine} />
          <path d="M112 224 C122 195 134 205 153 205 C170 205 183 214 195 234 M765 234 C778 214 790 205 807 205 C826 205 838 195 848 224" className={styles.sceneLivingReef} />
          <path d="M108 205 C124 186 144 179 166 182 C186 184 199 193 213 205 Z M747 205 C761 193 774 184 794 182 C816 179 836 186 852 205 Z" className={styles.sceneMotuLand} />
          <path d="M240 309 V278 M240 294 L224 278 M240 289 L257 270 M480 298 V269 M480 283 L465 268 M480 279 L496 260 M720 309 V278 M720 294 L704 278 M720 289 L737 270" className={styles.sceneCoralGrowth} />
          <ellipse cx="304" cy="384" rx="26" ry="30" className={styles.sceneSubmergedVoid} />
          <ellipse cx="480" cy="366" rx="24" ry="34" className={styles.sceneSubmergedVoid} />
          <ellipse cx="656" cy="384" rx="26" ry="30" className={styles.sceneSubmergedVoid} />
        </g>
      </svg>

      <figcaption className={styles.crossSectionCaption}>
        <span className="font-mono">{activeStage.number}</span>
        <span>{activeStage.visualDescription}</span>
      </figcaption>
    </figure>
  );
}
