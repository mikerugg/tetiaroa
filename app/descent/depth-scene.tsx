"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export type DepthStop = {
  id: string;
  depth: number;
  label: string;
  color: string;
  transmission?: string;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
};

type Bubble = {
  x: number;
  y: number;
  radius: number;
  rise: number;
  phase: number;
  age: number;
};

const MAX_DEPTH = 104;
const BEAM_SECTION_IDS = new Set(["honu-xr", "sharks", "twin", "lanterns"]);

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");

  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DepthScene({
  stops,
  showSub = true,
}: {
  stops: DepthStop[];
  showSub?: boolean;
}) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const raysRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readingRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const subTiltRef = useRef<HTMLDivElement | null>(null);
  const commsRef = useRef<HTMLDivElement | null>(null);
  const pingRef = useRef<HTMLDivElement | null>(null);
  const plungeRef = useRef<HTMLDivElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const rays = raysRef.current;
    const vignette = vignetteRef.current;
    const canvas = canvasRef.current;
    const reading = readingRef.current;
    const track = trackRef.current;
    const sub = subRef.current;
    const subTilt = subTiltRef.current;
    const comms = commsRef.current;
    const ping = pingRef.current;
    const plunge = plungeRef.current;
    const bloom = bloomRef.current;

    if (
      !backdrop ||
      !rays ||
      !vignette ||
      !canvas ||
      !reading ||
      !track ||
      !sub ||
      !subTilt ||
      !comms ||
      !ping ||
      !plunge ||
      !bloom
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rgbStops = stops.map((stop) => hexToRgb(stop.color));
    const stopButtons = Array.from(
      track.querySelectorAll<HTMLButtonElement>("[data-stop-id]"),
    );
    const context = canvas.getContext("2d");

    let anchors: number[] = [];
    let particles: Particle[] = [];
    let bubbles: Bubble[] = [];
    let depthNow = 0;
    let activeIndex = -1;
    let frame = 0;
    let scrollQueued = false;
    let lastScrollY = window.scrollY;
    let smoothVel = 0;
    let plungeY = Number.MAX_SAFE_INTEGER;
    let bloomY = Number.MAX_SAFE_INTEGER;
    let prevProbe: number | null = null;
    let lastPlungeAt = 0;
    let lastBloomAt = 0;
    let firstApply = true;
    let commsTimer = 0;
    let gapTargetId: string | null = null;

    const measure = () => {
      anchors = stops.map((stop) => {
        const section = document.getElementById(stop.id);

        if (!section) {
          return 0;
        }

        const rect = section.getBoundingClientRect();

        return (
          rect.top +
          window.scrollY +
          Math.min(rect.height * 0.35, window.innerHeight * 0.5)
        );
      });

      // The waterline sits at the bottom of the last surface section before
      // the first deep stop.
      const diveIndex = stops.findIndex((stop) => stop.depth > 2);
      const surfaceStop = stops[Math.max(diveIndex - 1, 0)];
      const surface = document.getElementById(surfaceStop?.id ?? "");
      const history = document.getElementById("history");

      plungeY = surface
        ? surface.offsetTop + surface.offsetHeight - window.innerHeight * 0.25
        : Number.MAX_SAFE_INTEGER;
      bloomY = history
        ? history.offsetTop - window.innerHeight * 0.1
        : Number.MAX_SAFE_INTEGER;
    };

    const showTransmission = (text: string | undefined) => {
      if (!text) {
        return;
      }

      comms.textContent = text;
      comms.classList.remove(styles.commsShow);
      ping.classList.remove(styles.pingRun);
      void comms.offsetWidth;
      comms.classList.add(styles.commsShow);
      ping.classList.add(styles.pingRun);

      window.clearTimeout(commsTimer);
      commsTimer = window.setTimeout(() => {
        comms.classList.remove(styles.commsShow);
      }, 5000);
    };

    const hideTransmission = () => {
      window.clearTimeout(commsTimer);
      comms.classList.remove(styles.commsShow);
    };

    const triggerOverlay = (element: HTMLElement, className: string) => {
      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);
    };

    const apply = () => {
      const probe = window.scrollY + window.innerHeight * 0.55;
      let index = 0;

      while (index < anchors.length - 2 && probe > anchors[index + 1]) {
        index += 1;
      }

      const next = Math.min(index + 1, anchors.length - 1);
      const span = anchors[next] - anchors[index];
      const t = span > 0 ? clamp((probe - anchors[index]) / span, 0, 1) : 0;

      const r = Math.round(lerp(rgbStops[index][0], rgbStops[next][0], t));
      const g = Math.round(lerp(rgbStops[index][1], rgbStops[next][1], t));
      const b = Math.round(lerp(rgbStops[index][2], rgbStops[next][2], t));

      backdrop.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      depthNow = lerp(stops[index].depth, stops[next].depth, t);
      reading.textContent = `−${Math.max(Math.round(depthNow), 0)} m`;
      rays.style.opacity = String(clamp(1 - depthNow / 26, 0, 1) * 0.75);

      const depth01 = clamp(depthNow / MAX_DEPTH, 0, 1);

      document.documentElement.style.setProperty(
        "--depth01",
        depth01.toFixed(3),
      );
      vignette.style.opacity = String(depth01 * 0.85);

      const nearest = t < 0.5 ? index : next;

      if (nearest !== activeIndex) {
        activeIndex = nearest;
        stopButtons.forEach((button, buttonIndex) => {
          button.classList.toggle(
            styles.gaugeStopActive,
            buttonIndex === activeIndex,
          );
        });
        sub.classList.toggle(
          styles.subLights,
          BEAM_SECTION_IDS.has(stops[nearest].id),
        );
      }

      // Radio chatter only plays in the open water between stops: announce
      // the stop being approached, hush once we arrive.
      const probeDelta = prevProbe === null ? 0 : probe - prevProbe;
      const inGap = gapTargetId
        ? t > 0.24 && t < 0.76
        : t > 0.3 && t < 0.7;

      if (inGap && !firstApply && span > 0) {
        const approaching = probeDelta >= 0 ? next : index;
        const approachingId = stops[approaching].id;

        if (gapTargetId !== approachingId) {
          gapTargetId = approachingId;
          showTransmission(stops[approaching].transmission);
        }
      } else if (!inGap && gapTargetId) {
        gapTargetId = null;
        hideTransmission();
      }

      if (prevProbe !== null && !reducedMotion) {
        const now = performance.now();

        // The dive begins: crossing the hero waterline going down plunges,
        // coming back up through it surfaces.
        if (prevProbe < plungeY && probe >= plungeY && now - lastPlungeAt > 900) {
          lastPlungeAt = now;
          triggerOverlay(plunge, styles.plungeRun);
        } else if (
          prevProbe > plungeY &&
          probe <= plungeY &&
          now - lastBloomAt > 900
        ) {
          lastBloomAt = now;
          triggerOverlay(bloom, styles.bloomRun);
        }

        // The ascent ends at the 1967 beach: surfacing bloom on the way down
        // the page, re-submerging plunge when scrolling back up.
        if (prevProbe < bloomY && probe >= bloomY && now - lastBloomAt > 900) {
          lastBloomAt = now;
          triggerOverlay(bloom, styles.bloomRun);
        } else if (
          prevProbe > bloomY &&
          probe <= bloomY &&
          now - lastPlungeAt > 900
        ) {
          lastPlungeAt = now;
          triggerOverlay(plunge, styles.plungeRun);
        }
      }

      prevProbe = probe;
      firstApply = false;
    };

    const sizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0.6 + Math.random() * 1.7,
        speed: 0.12 + Math.random() * 0.4,
        drift: -0.15 + Math.random() * 0.3,
      }));
      bubbles = [];
    };

    const spawnBubble = (x: number, y: number, spread: number) => {
      bubbles.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread * 0.5,
        radius: 1.4 + Math.random() * 2.6,
        rise: 0.6 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        age: 0,
      });
    };

    const tick = () => {
      const y = window.scrollY;
      const rawVel = y - lastScrollY;

      lastScrollY = y;
      smoothVel = lerp(smoothVel, rawVel, 0.14);

      apply();

      // Sub dynamics: stay docked to the right while pitching with the dive.
      const rot = clamp(-smoothVel * 0.35, -16, 16);
      const ty = clamp(-smoothVel * 0.5, -30, 30);

      sub.style.transform = `translateY(${ty}px)`;
      subTilt.style.transform = `rotate(${rot}deg)`;

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Marine snow only becomes visible once the dive is underway.
        const visibility = clamp(depthNow / 12, 0, 1) * 0.55;
        const speedBoost = smoothVel * 0.85;
        const streak = Math.min(Math.abs(smoothVel) * 1.1, 36);

        for (const particle of particles) {
          particle.y -= particle.speed + speedBoost;
          particle.x += particle.drift;

          if (particle.y < -6) {
            particle.y = canvas.height + 6;
            particle.x = Math.random() * canvas.width;
          } else if (particle.y > canvas.height + 6) {
            particle.y = -6;
            particle.x = Math.random() * canvas.width;
          }

          if (particle.x < -4) {
            particle.x = canvas.width + 4;
          } else if (particle.x > canvas.width + 4) {
            particle.x = -4;
          }

          if (visibility <= 0.01) {
            continue;
          }

          const alpha = visibility * (0.35 + (particle.radius / 2.3) * 0.65);

          if (streak > 5) {
            context.strokeStyle = "rgb(189, 244, 235)";
            context.globalAlpha = alpha * 0.8;
            context.lineWidth = particle.radius * 0.9;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(
              particle.x,
              particle.y + streak * Math.sign(smoothVel || 1),
            );
            context.stroke();
          } else {
            context.fillStyle = "rgb(189, 244, 235)";
            context.globalAlpha = alpha;
            context.beginPath();
            context.arc(
              particle.x,
              particle.y,
              particle.radius,
              0,
              Math.PI * 2,
            );
            context.fill();
          }
        }

        const bubbleVisibility = clamp(depthNow / 6, 0, 1);

        if (bubbleVisibility > 0.05) {
          // Thruster wash off the sub's tail while the dive is moving.
          if (Math.abs(smoothVel) > 6 && Math.random() < 0.225) {
            const rect = sub.getBoundingClientRect();

            if (rect.width > 0) {
              const tailX = rect.right - 14;

              spawnBubble(tailX, rect.top + rect.height * 0.55, 18);
            }
          }

          // The occasional ambient exhale from somewhere below.
          if (Math.random() < 0.004) {
            const burstX = Math.random() * canvas.width;

            for (let i = 0; i < 4 + Math.floor(Math.random() * 4); i += 1) {
              spawnBubble(burstX, canvas.height + 12, 30);
            }
          }
        }

        for (let i = bubbles.length - 1; i >= 0; i -= 1) {
          const bubble = bubbles[i];

          bubble.age += 1;
          bubble.y -= bubble.rise + Math.max(speedBoost * 0.6, 0);
          bubble.x += Math.sin(bubble.phase + bubble.age * 0.12) * 0.35;

          if (bubble.y < -12 || bubble.y > canvas.height + 80) {
            bubbles.splice(i, 1);
            continue;
          }

          context.strokeStyle = "rgb(205, 242, 255)";
          context.globalAlpha = bubbleVisibility * 0.65;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          context.stroke();
        }

        context.globalAlpha = 1;
      }

      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      sizeCanvas();
      apply();
    };

    const onScroll = () => {
      if (reducedMotion && !scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(() => {
          scrollQueued = false;
          apply();
        });
      }
    };

    measure();
    sizeCanvas();
    apply();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reducedMotion) {
      canvas.style.display = "none";
    } else {
      frame = requestAnimationFrame(tick);
    }

    // Media loading shifts section offsets after mount.
    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(commsTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--depth01");
    };
  }, [stops]);

  return (
    <>
      <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />
      <div ref={raysRef} className={styles.rays} aria-hidden="true" />
      <div
        ref={vignetteRef}
        className={styles.deepVignette}
        aria-hidden="true"
      />
      <div ref={plungeRef} className={styles.plunge} aria-hidden="true">
        <svg
          className={styles.plungeWave}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q 60 8 120 40 T 240 40 T 360 40 T 480 40 T 600 40 T 720 40 T 840 40 T 960 40 T 1080 40 T 1200 40 T 1320 40 T 1440 40 L 1440 80 L 0 80 Z"
            fill="currentColor"
          />
        </svg>
        <div className={styles.plungeBody} />
      </div>
      <div ref={bloomRef} className={styles.bloom} aria-hidden="true">
        <span className={styles.streak} />
        <span className={styles.streak} />
        <span className={styles.streak} />
        <span className={styles.streak} />
        <span className={styles.streak} />
      </div>
      <div
        ref={subRef}
        className={showSub ? styles.sub : `${styles.sub} ${styles.subHidden}`}
        aria-hidden="true"
      >
        <div ref={commsRef} className={styles.subComms} />
        <div ref={pingRef} className={styles.subPing} />
        <div>
          <div className={styles.subBob}>
            <div ref={subTiltRef} className={styles.subTilt}>
              <div className={styles.subBeam} />
              <Image
                src="/Honu-Cartoon-Sub-sm.png"
                alt=""
                width={347}
                height={283}
                className={styles.subSprite}
                sizes="140px"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gauge} aria-label="Dive depth navigation">
        <div className={styles.gaugeReading}>
          <span ref={readingRef}>&minus;0 m</span>
        </div>
        <div ref={trackRef} className={styles.gaugeTrack}>
          {stops.map((stop) => (
            <button
              key={stop.id}
              type="button"
              data-stop-id={stop.id}
              className={styles.gaugeStop}
              onClick={() => {
                document.getElementById(stop.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <span className={styles.gaugeLabel}>{stop.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
