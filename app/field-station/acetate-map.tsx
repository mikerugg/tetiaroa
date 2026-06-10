"use client";

import { useState } from "react";
import styles from "./page.module.css";

const sheets = [
  { id: "reef", label: "Reef cover", note: "crest & coral gardens" },
  { id: "bathy", label: "Bathymetry", note: "lagoon soundings" },
  { id: "life", label: "Living records", note: "nests · colonies · nursery" },
  { id: "sensors", label: "Sensor net", note: "biocode & telemetry" },
] as const;

type SheetId = (typeof sheets)[number]["id"];

const motu = [
  { name: "Tiaraunu", cx: 360, cy: 122, rx: 96, ry: 16, angle: -7 },
  { name: "Tauini", cx: 490, cy: 138, rx: 22, ry: 10, angle: -24 },
  { name: "Auroa", cx: 532, cy: 165, rx: 18, ry: 9, angle: -38 },
  { name: "Hīra'a'ānae", cx: 568, cy: 202, rx: 20, ry: 9, angle: -55 },
  { name: "'Ōroatera", cx: 596, cy: 262, rx: 16, ry: 34, angle: -8 },
  { name: "'Āi'e", cx: 600, cy: 330, rx: 10, ry: 20, angle: 6 },
  { name: "Tahuna Iti", cx: 588, cy: 382, rx: 8, ry: 11, angle: 14 },
  { name: "Tahuna Rahi", cx: 564, cy: 424, rx: 11, ry: 16, angle: 28 },
  { name: "Rimatu'u", cx: 500, cy: 478, rx: 44, ry: 14, angle: 27 },
  { name: "Reiono", cx: 398, cy: 506, rx: 20, ry: 11, angle: 4 },
  { name: "Onetahi", cx: 254, cy: 452, rx: 42, ry: 13, angle: -34 },
  { name: "Honuea", cx: 192, cy: 344, rx: 13, ry: 24, angle: 10 },
];

const coralPatches = [
  [330, 250],
  [420, 230],
  [470, 300],
  [350, 330],
  [290, 300],
  [430, 380],
  [330, 410],
  [490, 390],
] as const;

const sensorNodes = [
  [320, 180],
  [520, 240],
  [540, 400],
  [360, 440],
  [250, 380],
] as const;

const nestMarks = [
  [300, 102],
  [352, 96],
  [408, 98],
  [388, 528],
  [416, 524],
] as const;

export function AcetateMap() {
  const [active, setActive] = useState<Record<SheetId, boolean>>({
    reef: true,
    bathy: true,
    life: true,
    sensors: true,
  });

  const lifted = sheets.filter((sheet) => !active[sheet.id]).length;

  const toggle = (id: SheetId) =>
    setActive((current) => ({ ...current, [id]: !current[id] }));

  return (
    <figure className={styles.acetate}>
      <div className={styles.acetateTabs} role="group" aria-label="Acetate overlay sheets">
        {sheets.map((sheet) => (
          <button
            key={sheet.id}
            type="button"
            aria-pressed={active[sheet.id]}
            data-sheet={sheet.id}
            className={`${styles.acetateTab} ${active[sheet.id] ? styles.acetateTabOn : ""}`}
            onClick={() => toggle(sheet.id)}
          >
            <span className={styles.acetateChip} aria-hidden="true" />
            <span className={styles.acetateTabLabel}>{sheet.label}</span>
            <span className={styles.acetateTabNote}>{sheet.note}</span>
          </button>
        ))}
        <p className={styles.acetateCount}>
          {lifted === 0
            ? "ALL SHEETS DOWN — FULL TWIN"
            : `${lifted} SHEET${lifted > 1 ? "S" : ""} LIFTED`}
        </p>
      </div>

      <div className={styles.acetatePlate}>
        <svg
          viewBox="0 0 760 600"
          className={styles.acetateSvg}
          role="img"
          aria-label="Hand-drawn survey map of Tetiaroa Atoll with reef, bathymetry, wildlife, and sensor overlays"
        >
          {/* ——— base sheet: the atoll itself ——— */}
          <g className={styles.mapBase}>
            <ellipse className={styles.mapLagoon} cx="392" cy="306" rx="226" ry="216" />
            <ellipse className={styles.mapRim} cx="392" cy="306" rx="238" ry="228" />

            {/* graticule */}
            <line className={styles.mapGrid} x1="30" y1="306" x2="754" y2="306" />
            <line className={styles.mapGrid} x1="392" y1="14" x2="392" y2="592" />
            <text className={styles.mapGridLabel} x="38" y="298">
              17°00′ S
            </text>
            <text className={styles.mapGridLabel} x="400" y="28">
              149°34′ W
            </text>

            {motu.map((m) => (
              <g key={m.name} transform={`rotate(${m.angle} ${m.cx} ${m.cy})`}>
                <ellipse className={styles.mapMotu} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} />
              </g>
            ))}
            {motu.map((m) => (
              <text key={`${m.name}-label`} className={styles.mapName} x={m.cx} y={m.cy - m.ry - 7} textAnchor="middle">
                {m.name}
              </text>
            ))}

            {/* airstrip on Onetahi */}
            <line className={styles.mapStrip} x1="222" y1="470" x2="288" y2="432" />

            {/* compass rose */}
            <g className={styles.mapRose} transform="translate(692 84)">
              <circle r="26" />
              <line x1="0" y1="-26" x2="0" y2="26" />
              <line x1="-26" y1="0" x2="26" y2="0" />
              <path d="M 0 -26 L 5 -8 L 0 -12 L -5 -8 Z" className={styles.mapRoseNeedle} />
              <text x="0" y="-32" textAnchor="middle">
                N
              </text>
            </g>

            {/* scale bar */}
            <g className={styles.mapScale} transform="translate(560 564)">
              <line x1="0" y1="0" x2="120" y2="0" />
              <line x1="0" y1="-4" x2="0" y2="4" />
              <line x1="60" y1="-3" x2="60" y2="3" />
              <line x1="120" y1="-4" x2="120" y2="4" />
              <text x="60" y="16" textAnchor="middle">
                0 ——— 1 ——— 2 km
              </text>
            </g>

            {/* title block */}
            <g className={styles.mapTitleBlock} transform="translate(28 470)">
              <rect width="190" height="104" />
              <text x="14" y="26" className={styles.mapTitleMain}>
                TETIAROA ATOLL
              </text>
              <text x="14" y="44">SOCIETY ISLANDS — POLYNESIA</text>
              <text x="14" y="60">SURVEY: FIELD STATION, SHEET №7</text>
              <text x="14" y="76">DATUM: MEAN LAGOON LIGHT</text>
              <text x="14" y="92">SCALE 1 : 60 000 (APPROX.)</text>
            </g>
          </g>

          {/* ——— acetate №1: reef cover ——— */}
          <g className={`${styles.sheet} ${styles.sheetReef} ${active.reef ? styles.sheetOn : ""}`}>
            <ellipse className={styles.reefCrest} cx="392" cy="306" rx="252" ry="242" />
            {coralPatches.map(([x, y], index) => (
              <g key={index} transform={`translate(${x} ${y})`}>
                <circle className={styles.reefPatch} r="13" />
                <circle className={styles.reefPatchCore} r="3.5" />
              </g>
            ))}
            <text className={styles.sheetLabel} x="78" y="120">
              FIG. 7a — REEF COVER
            </text>
            <text className={styles.sheetSub} x="78" y="136">
              crest unbroken · no navigable pass
            </text>
          </g>

          {/* ——— acetate №2: bathymetry ——— */}
          <g className={`${styles.sheet} ${styles.sheetBathy} ${active.bathy ? styles.sheetOn : ""}`}>
            <ellipse className={styles.bathyLine} cx="392" cy="306" rx="190" ry="180" />
            <ellipse className={styles.bathyLine} cx="396" cy="310" rx="138" ry="126" />
            <ellipse className={styles.bathyLine} cx="400" cy="314" rx="82" ry="72" />
            <text className={styles.bathyLabel} x="392" y="118">−2 m</text>
            <text className={styles.bathyLabel} x="396" y="176">−8 m</text>
            <text className={styles.bathyLabel} x="400" y="236">−25 m</text>
            <text className={styles.sheetLabel} x="78" y="160">
              FIG. 7b — SOUNDINGS
            </text>
            <text className={styles.sheetSub} x="78" y="176">
              lagoon closed since the last high stand
            </text>
          </g>

          {/* ——— acetate №3: living records ——— */}
          <g className={`${styles.sheet} ${styles.sheetLife} ${active.life ? styles.sheetOn : ""}`}>
            {nestMarks.map(([x, y], index) => (
              <path
                key={index}
                className={styles.lifeNest}
                d={`M ${x} ${y - 6} L ${x + 6} ${y + 5} L ${x - 6} ${y + 5} Z`}
              />
            ))}
            <g className={styles.lifeColony}>
              <text x="588" y="368" textAnchor="middle">✳</text>
              <text x="566" y="412" textAnchor="middle">✳</text>
            </g>
            <ellipse className={styles.lifeNursery} cx="440" cy="430" rx="74" ry="40" />
            <text className={styles.lifeNurseryLabel} x="440" y="434" textAnchor="middle">
              LEMON SHARK NURSERY
            </text>
            <text className={styles.lifeNoteTurtle} x="360" y="78" textAnchor="middle">
              ▲ honu nesting beaches
            </text>
            <text className={styles.lifeNoteBird} x="648" y="396">
              ✳ seabird colonies
            </text>
            <text className={styles.sheetLabel} x="78" y="200">
              FIG. 7c — LIVING RECORDS
            </text>
            <text className={styles.sheetSub} x="78" y="216">
              167 spp sequenced to date
            </text>
          </g>

          {/* ——— acetate №4: sensor net ——— */}
          <g className={`${styles.sheet} ${styles.sheetSensors} ${active.sensors ? styles.sheetOn : ""}`}>
            <path
              className={styles.sensorLink}
              d="M 254 452 L 250 380 L 360 440 M 254 452 L 320 180 M 254 452 L 520 240 M 254 452 L 540 400"
            />
            {sensorNodes.map(([x, y], index) => (
              <rect key={index} className={styles.sensorNode} x={x - 5} y={y - 5} width="10" height="10" />
            ))}
            <circle className={styles.sensorStation} cx="254" cy="452" r="9" />
            <text className={styles.sensorLabel} x="240" y="432" textAnchor="end">
              ECOSTATION — UPLINK
            </text>
            <circle className={styles.sensorDock} cx="178" cy="486" r="6" />
            <text className={styles.sensorLabel} x="170" y="508" textAnchor="end">
              HONU XR DOCK
            </text>
            <text className={styles.sheetLabel} x="78" y="240">
              FIG. 7d — SENSOR NET
            </text>
            <text className={styles.sheetSub} x="78" y="256">
              telemetry refreshed hourly
            </text>
          </g>
        </svg>
      </div>

      <figcaption className={styles.acetateCaption}>
        Plate VII. — The Digital Twin, read the old way: a hand-drawn base
        survey under four acetate sheets. Lift a sheet to see what the model
        carries; in the field, every layer updates itself.
      </figcaption>
    </figure>
  );
}
