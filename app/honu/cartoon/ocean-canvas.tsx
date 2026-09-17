"use client";

import { getImageProps } from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type CreatureId =
  | "coral"
  | "butterflyfish"
  | "octopus"
  | "turtle"
  | "jellyfish"
  | "whale";

export type OceanHandle = {
  move: (dx: number, dy: number) => void;
  reset: () => void;
};

export type OceanCanvasProps = {
  active: boolean;
  lightsOn: boolean;
  sonarPulse: number;
  discovered: CreatureId[];
  reducedMotion: boolean;
  onSteer: () => void;
  onNearbyChange: (id: CreatureId | null) => void;
  onReady: () => void;
  onError: () => void;
};

export const CREATURE_POSITIONS: Record<CreatureId, { x: number; y: number }> =
  {
    coral: { x: 475, y: 715 },
    butterflyfish: { x: 630, y: 315 },
    octopus: { x: 1350, y: 850 },
    turtle: { x: 1250, y: 140 },
    jellyfish: { x: 1830, y: 390 },
    whale: { x: 2620, y: 520 },
  };

const WORLD = { width: 3000, height: 1000 };
const START = { x: 230, y: 190 };
const CREATURES = Object.keys(CREATURE_POSITIONS) as CreatureId[];
const NEARBY_DISTANCES: Record<CreatureId, number> = {
  coral: 205,
  butterflyfish: 230,
  octopus: 220,
  turtle: 320,
  jellyfish: 320,
  whale: 450,
};
const SPEED = 285;
const SPRITE_WIDTHS = {
  honu: 320,
  coral: 240,
  butterflyfish: 145,
  octopus: 190,
  turtle: 235,
  jellyfish: 195,
  whale: 610,
};
const MOVEMENT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
]);

type SpriteId = "ocean" | "honu" | CreatureId;
type Sprite = {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
};
type Engine = OceanHandle & { refresh: () => void; pulse: () => void };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

// Ignore transparent export margins so each painted character keeps its scale.
function spriteBounds(image: HTMLImageElement): Omit<Sprite, "image"> {
  const probe = document.createElement("canvas");
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  probe.width = Math.ceil(image.width * scale);
  probe.height = Math.ceil(image.height * scale);
  const context = probe.getContext("2d", { willReadFrequently: true });
  const fallback = { x: 0, y: 0, width: image.width, height: image.height };
  if (!context) return fallback;
  context.drawImage(image, 0, 0, probe.width, probe.height);
  const pixels = context.getImageData(0, 0, probe.width, probe.height).data;
  let left = probe.width;
  let right = 0;
  let top = probe.height;
  let bottom = 0;
  for (let y = 0; y < probe.height; y++) {
    for (let x = 0; x < probe.width; x++) {
      if (pixels[(y * probe.width + x) * 4 + 3] < 24) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (left >= right || top >= bottom) return fallback;
  const x = Math.max(0, (left - 2) / scale);
  const y = Math.max(0, (top - 2) / scale);
  return {
    x,
    y,
    width: Math.min(image.width - x, (right - left + 5) / scale),
    height: Math.min(image.height - y, (bottom - top + 5) / scale),
  };
}

export const OceanCanvas = forwardRef<OceanHandle, OceanCanvasProps>(
  function OceanCanvas(props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const propsRef = useRef(props);
    const engineRef = useRef<Engine | null>(null);
    const lastPulse = useRef(props.sonarPulse);
    const hasSteered = useRef(false);

    useImperativeHandle(
      ref,
      () => ({
        move: (dx, dy) => engineRef.current?.move(dx, dy),
        reset: () => engineRef.current?.reset(),
      }),
      [],
    );

    useEffect(() => {
      propsRef.current = props;
    }, [props]);

    useEffect(() => {
      if (props.sonarPulse > lastPulse.current) {
        engineRef.current?.pulse();
      }
      lastPulse.current = props.sonarPulse;
      engineRef.current?.refresh();
    }, [
      props.active,
      props.discovered,
      props.lightsOn,
      props.reducedMotion,
      props.sonarPulse,
    ]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        propsRef.current.onError();
        return;
      }

      let disposed = false;
      let ready = false;
      let failed = false;
      let frame = 0;
      let lastFrame = 0;
      let elapsed = 0;
      let width = 1;
      let height = 1;
      let pixelRatio = 1;
      let scale = 1;
      let viewportWidth = 1;
      let viewportHeight = 1;
      const camera = { x: 0, y: 0 };
      let position = { ...START };
      let target = { ...START };
      let facing = 1;
      let inView = true;
      let pointer: number | null = null;
      let lastNearby: CreatureId | null = null;
      let sonarStarted = -100;
      let sonarOrigin = { ...START };
      let whaleRevealed = false;
      const keys = new Set<string>();
      const sprites = {} as Record<SpriteId, Sprite>;

      const canAnimate = () =>
        propsRef.current.active &&
        inView &&
        document.visibilityState !== "hidden";

      function notifySteering() {
        if (hasSteered.current) return;
        hasSteered.current = true;
        propsRef.current.onSteer();
      }

      function setTarget(x: number, y: number) {
        target = {
          x: clamp(x, 190, WORLD.width - 195),
          y: clamp(y, 190, WORLD.height - 210),
        };
        requestDraw();
      }

      function reportNearby(force = false) {
        const distances = CREATURES.map((id) => ({
          id,
          distance: Math.hypot(
            CREATURE_POSITIONS[id].x - position.x,
            CREATURE_POSITIONS[id].y - position.y,
          ),
        }));
        const nearest = distances
          .filter(({ id, distance }) => distance <= NEARBY_DISTANCES[id])
          .sort((a, b) => a.distance - b.distance)[0];
        const current = distances.find(({ id }) => id === lastNearby);
        // In overlapping reef ranges, switch only when another animal is clearly closer.
        const keepCurrent =
          current &&
          current.distance <= NEARBY_DISTANCES[current.id] &&
          (!nearest || current.distance <= nearest.distance + 45);
        const nearby = keepCurrent ? current.id : (nearest?.id ?? null);
        if (nearby !== lastNearby || force) {
          lastNearby = nearby;
          propsRef.current.onNearbyChange(nearby);
        }
      }

      function updateCamera(immediate = false, dt = 0) {
        const focalPoint = viewportWidth < 1100 ? 0.32 : 0.39;
        const desired = {
          x: clamp(
            position.x - viewportWidth * focalPoint,
            0,
            WORLD.width - viewportWidth,
          ),
          y: clamp(
            position.y - viewportHeight * 0.48,
            0,
            WORLD.height - viewportHeight,
          ),
        };
        const blend = immediate ? 1 : 1 - Math.exp(-dt * 5);
        camera.x += (desired.x - camera.x) * blend;
        camera.y += (desired.y - camera.y) * blend;
      }

      function drawSprite(
        id: Exclude<SpriteId, "ocean">,
        x: number,
        y: number,
        flip = 1,
        angle = 0,
      ) {
        const sprite = sprites[id];
        const spriteWidth = SPRITE_WIDTHS[id];
        const spriteHeight = (sprite.height / sprite.width) * spriteWidth;
        context!.save();
        context!.translate(x, y);
        context!.rotate(angle);
        context!.scale(flip, 1);
        context!.drawImage(
          sprite.image,
          sprite.x,
          sprite.y,
          sprite.width,
          sprite.height,
          -spriteWidth / 2,
          -spriteHeight / 2,
          spriteWidth,
          spriteHeight,
        );
        context!.restore();
      }

      function drawScene(now: number) {
        if (!ready || width < 2 || height < 2) return;
        const { lightsOn, reducedMotion, discovered } = propsRef.current;
        context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context!.fillStyle = "#053d59";
        context!.fillRect(0, 0, width, height);
        context!.save();
        context!.scale(scale, scale);
        context!.translate(-camera.x, -camera.y);
        context!.drawImage(
          sprites.ocean.image,
          0,
          0,
          WORLD.width,
          WORLD.height,
        );

        // The painted world stays intact; translucent water adds depth as we travel.
        const deepWater = context!.createLinearGradient(0, 0, WORLD.width, 0);
        deepWater.addColorStop(0, "rgba(4,36,57,0)");
        deepWater.addColorStop(0.55, "rgba(4,24,62,0.13)");
        deepWater.addColorStop(1, "rgba(4,17,46,0.29)");
        context!.fillStyle = deepWater;
        context!.fillRect(0, 0, WORLD.width, WORLD.height);
        if (!lightsOn) {
          context!.fillStyle = "rgba(3,15,44,0.38)";
          context!.fillRect(0, 0, WORLD.width, WORLD.height);
        }

        const bob = (phase: number, amplitude: number) =>
          reducedMotion ? 0 : Math.sin(elapsed * 0.75 + phase) * amplitude;
        CREATURES.forEach((id, index) => {
          const creature = CREATURE_POSITIONS[id];
          const creatureX =
            creature.x +
            (id === "butterflyfish" ? bob(index + 1, 22) : 0);
          const creatureY =
            creature.y +
            bob(
              index,
              id === "octopus" || id === "coral"
                ? 0
                : id === "jellyfish"
                  ? 18
                  : id === "whale"
                    ? 12
                    : 7,
            );
          if (id === "jellyfish") {
            context!.save();
            context!.globalAlpha = lightsOn ? 1 : 0.16;
            const glow = context!.createRadialGradient(
              creature.x,
              creature.y,
              10,
              creature.x,
              creature.y,
              260,
            );
            glow.addColorStop(0, "rgba(143,167,255,0.24)");
            glow.addColorStop(0.5, "rgba(99,120,227,0.08)");
            glow.addColorStop(1, "rgba(100,127,242,0)");
            context!.fillStyle = glow;
            context!.fillRect(creature.x - 260, creature.y - 260, 520, 520);
            context!.shadowColor = "#b2d9ff";
            context!.shadowBlur = lightsOn ? 24 : 0;
            drawSprite(id, creatureX, creatureY);
            context!.restore();
          } else if (id === "coral") {
            drawSprite(id, creatureX, creatureY);
          } else if (id === "octopus") {
            context!.save();
            context!.globalAlpha = lightsOn ? 1 : 0.12;
            context!.translate(creatureX, creatureY);
            // A slow breath keeps the octopus alive while its arms stay on the reef.
            const breathing = reducedMotion
              ? 1
              : 1 + Math.sin(elapsed * 1.15) * 0.012;
            context!.scale(1, breathing);
            drawSprite(id, 0, 0);
            context!.restore();
          } else {
            context!.save();
            if (id === "whale" && !whaleRevealed && !discovered.includes(id)) {
              context!.globalAlpha = 0.16;
            }
            drawSprite(
              id,
              creatureX,
              creatureY,
              1,
              reducedMotion ? 0 : Math.sin(elapsed * 0.45 + index) * 0.018,
            );
            context!.restore();
          }
          if (discovered.includes(id)) {
            const sprite = sprites[id];
            const markerY =
              creatureY -
              (SPRITE_WIDTHS[id] * sprite.height) / sprite.width / 2 -
              30;
            context!.fillStyle = "rgba(241,254,242,0.95)";
            context!.beginPath();
            context!.arc(creatureX, markerY, 17, 0, Math.PI * 2);
            context!.fill();
            context!.strokeStyle = "#126349";
            context!.lineWidth = 4;
            context!.lineCap = "round";
            context!.beginPath();
            context!.moveTo(creatureX - 7, markerY);
            context!.lineTo(creatureX - 1, markerY + 6);
            context!.lineTo(creatureX + 8, markerY - 6);
            context!.stroke();
          }
        });

        if (lightsOn) {
          context!.save();
          context!.translate(position.x + facing * 105, position.y + 20);
          context!.scale(facing, 1);
          const beam = context!.createLinearGradient(0, 0, 470, 0);
          beam.addColorStop(0, "rgba(255,246,171,0.4)");
          beam.addColorStop(0.3, "rgba(255,246,183,0.11)");
          beam.addColorStop(1, "rgba(255,246,183,0)");
          context!.fillStyle = beam;
          context!.beginPath();
          context!.moveTo(0, -10);
          context!.lineTo(480, -185);
          context!.quadraticCurveTo(560, 0, 480, 185);
          context!.lineTo(0, 10);
          context!.closePath();
          context!.fill();
          context!.restore();
        }

        const moving =
          Math.hypot(target.x - position.x, target.y - position.y) > 5;
        const tilt =
          moving && !reducedMotion
            ? clamp((target.y - position.y) / 900, -0.09, 0.09) * facing
            : 0;
        drawSprite("honu", position.x, position.y + bob(0, 5), facing, tilt);

        // A few translucent bubbles feel at home alongside the gouache artwork.
        if (!reducedMotion) {
          for (let i = 0; i < 13; i++) {
            const age = (elapsed * 0.38 + i / 13) % 1;
            const x =
              position.x -
              facing * (135 + age * 225) +
              Math.sin(i * 3 + elapsed) * 5;
            const y = position.y + 5 - age * 100;
            context!.strokeStyle = `rgba(214,250,244,${(1 - age) * (moving ? 0.43 : 0.23)})`;
            context!.lineWidth = 1.7;
            context!.beginPath();
            context!.arc(x, y, 3 + age * 8, 0, Math.PI * 2);
            context!.stroke();
          }
          for (let i = 0; i < 28; i++) {
            const x = (i * 163.7 + elapsed * 3) % WORLD.width;
            const y = 170 + ((i * 79.3 + elapsed * 2) % 580);
            context!.fillStyle = `rgba(217,244,225,${0.12 + (i % 3) * 0.07})`;
            context!.beginPath();
            context!.arc(x, y, 1.4 + (i % 3) * 0.5, 0, Math.PI * 2);
            context!.fill();
          }
        }

        const sonarAge = now / 1000 - sonarStarted;
        if (sonarAge >= 0 && sonarAge < 3.1) {
          for (let i = 0; i < 3; i++) {
            const age = reducedMotion ? 0.7 + i * 0.55 : sonarAge - i * 0.32;
            if (age < 0 || age > 2.45) continue;
            context!.strokeStyle = `rgba(216,255,223,${(1 - age / 2.45) * 0.74})`;
            context!.lineWidth = 2.5;
            context!.beginPath();
            context!.arc(
              sonarOrigin.x,
              sonarOrigin.y,
              80 + age * 365,
              0,
              Math.PI * 2,
            );
            context!.stroke();
          }
          CREATURES.forEach((id) => {
            const creature = CREATURE_POSITIONS[id];
            if (
              Math.hypot(
                creature.x - sonarOrigin.x,
                creature.y - sonarOrigin.y,
              ) > 950
            )
              return;
            context!.strokeStyle = `rgba(216,255,223,${Math.max(0, 1 - sonarAge / 3.1)})`;
            context!.lineWidth = 2;
            context!.setLineDash([8, 8]);
            context!.beginPath();
            context!.arc(
              creature.x,
              creature.y,
              Math.max(105, SPRITE_WIDTHS[id] / 2 + 25),
              0,
              Math.PI * 2,
            );
            context!.stroke();
            context!.setLineDash([]);
          });
        }

        if (moving) {
          context!.strokeStyle = "rgba(255,250,222,0.6)";
          context!.lineWidth = 2;
          context!.beginPath();
          context!.arc(target.x, target.y, 13, 0, Math.PI * 2);
          context!.moveTo(target.x - 20, target.y);
          context!.lineTo(target.x - 7, target.y);
          context!.moveTo(target.x + 7, target.y);
          context!.lineTo(target.x + 20, target.y);
          context!.moveTo(target.x, target.y - 20);
          context!.lineTo(target.x, target.y - 7);
          context!.moveTo(target.x, target.y + 7);
          context!.lineTo(target.x, target.y + 20);
          context!.stroke();
        }
        context!.restore();
        // Soft edges give the viewport the feeling of a window into an illustrated world.
        const vignette = context!.createRadialGradient(
          width * 0.48,
          height * 0.4,
          width * 0.12,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.72,
        );
        vignette.addColorStop(0, "rgba(0,20,32,0)");
        vignette.addColorStop(1, "rgba(0,20,32,0.3)");
        context!.fillStyle = vignette;
        context!.fillRect(0, 0, width, height);
      }

      function animate(now: number) {
        frame = 0;
        if (disposed || !ready) return;
        const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.04) : 0;
        lastFrame = now;
        const running = canAnimate();
        if (running) {
          elapsed += dt;
          const keyboardX =
            Number(keys.has("ArrowRight") || keys.has("d")) -
            Number(keys.has("ArrowLeft") || keys.has("a"));
          const keyboardY =
            Number(keys.has("ArrowDown") || keys.has("s")) -
            Number(keys.has("ArrowUp") || keys.has("w"));
          if (keyboardX || keyboardY) {
            setTarget(position.x + keyboardX * 80, position.y + keyboardY * 80);
          }
          const dx = target.x - position.x;
          const dy = target.y - position.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.4) {
            const step = Math.min(distance, SPEED * dt);
            position.x += (dx / distance) * step;
            position.y += (dy / distance) * step;
            if (Math.abs(dx) > 2) facing = dx > 0 ? 1 : -1;
          } else {
            position = { ...target };
          }
          updateCamera(propsRef.current.reducedMotion, dt);
          reportNearby();
        }
        drawScene(now);
        const moving =
          Math.hypot(target.x - position.x, target.y - position.y) > 0.4;
        const sonarVisible = now / 1000 - sonarStarted < 3.1;
        if (
          running &&
          (!propsRef.current.reducedMotion ||
            moving ||
            sonarVisible ||
            keys.size)
        ) {
          requestDraw();
        }
      }

      function requestDraw() {
        if (disposed || frame || !ready) return;
        frame = requestAnimationFrame(animate);
      }

      function refresh() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
        requestDraw();
      }

      function resize() {
        const rect = canvas!.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = Math.max(1, Math.round(width * pixelRatio));
        canvas!.height = Math.max(1, Math.round(height * pixelRatio));
        scale = Math.max(height / WORLD.height, width / 1750, 0.1);
        viewportWidth = width / scale;
        viewportHeight = height / scale;
        updateCamera(true);
        refresh();
      }

      const engine: Engine = {
        move(dx, dy) {
          if (
            !ready ||
            !propsRef.current.active ||
            !Number.isFinite(dx) ||
            !Number.isFinite(dy) ||
            (!dx && !dy)
          )
            return;
          notifySteering();
          setTarget(target.x + dx * 120, target.y + dy * 120);
        },
        reset() {
          keys.clear();
          position = { ...START };
          target = { ...START };
          facing = 1;
          elapsed = 0;
          sonarStarted = -100;
          whaleRevealed = false;
          updateCamera(true);
          reportNearby(true);
          refresh();
        },
        refresh,
        pulse() {
          sonarStarted = performance.now() / 1000;
          sonarOrigin = { ...position };
          if (
            Math.hypot(
              position.x - CREATURE_POSITIONS.whale.x,
              position.y - CREATURE_POSITIONS.whale.y,
            ) <= NEARBY_DISTANCES.whale
          ) {
            whaleRevealed = true;
          }
          requestDraw();
        },
      };
      engineRef.current = engine;

      function steer(event: PointerEvent) {
        const rect = canvas!.getBoundingClientRect();
        notifySteering();
        setTarget(
          (event.clientX - rect.left) / scale + camera.x,
          (event.clientY - rect.top) / scale + camera.y,
        );
      }
      function pointerDown(event: PointerEvent) {
        if (
          !propsRef.current.active ||
          !ready ||
          (event.pointerType === "mouse" && event.button !== 0)
        )
          return;
        canvas!.focus({ preventScroll: true });
        pointer = event.pointerId;
        canvas!.setPointerCapture(pointer);
        steer(event);
      }
      function pointerMove(event: PointerEvent) {
        if (pointer !== event.pointerId || !propsRef.current.active) return;
        steer(event);
      }
      function pointerUp(event: PointerEvent) {
        if (pointer !== event.pointerId) return;
        if (canvas!.hasPointerCapture(pointer))
          canvas!.releasePointerCapture(pointer);
        pointer = null;
      }
      function keyDown(event: KeyboardEvent) {
        const key =
          event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (!MOVEMENT_KEYS.has(key)) return;
        event.preventDefault();
        if (!ready || !propsRef.current.active) return;
        notifySteering();
        keys.add(key);
        const dx =
          Number(key === "ArrowRight" || key === "d") -
          Number(key === "ArrowLeft" || key === "a");
        const dy =
          Number(key === "ArrowDown" || key === "s") -
          Number(key === "ArrowUp" || key === "w");
        setTarget(position.x + dx * 80, position.y + dy * 80);
        requestDraw();
      }
      function keyUp(event: KeyboardEvent) {
        const key =
          event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (!MOVEMENT_KEYS.has(key)) return;
        event.preventDefault();
        keys.delete(key);
      }
      function clearInput() {
        if (keys.size) target = { ...position };
        keys.clear();
        pointer = null;
      }
      function visibilityChange() {
        clearInput();
        refresh();
      }

      canvas.addEventListener("pointerdown", pointerDown);
      canvas.addEventListener("pointermove", pointerMove);
      canvas.addEventListener("pointerup", pointerUp);
      canvas.addEventListener("pointercancel", pointerUp);
      canvas.addEventListener("lostpointercapture", pointerUp);
      canvas.addEventListener("keydown", keyDown);
      canvas.addEventListener("keyup", keyUp);
      canvas.addEventListener("blur", clearInput);
      document.addEventListener("visibilitychange", visibilityChange);
      window.addEventListener("blur", clearInput);
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      const intersection = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) clearInput();
        refresh();
      });
      intersection.observe(canvas);
      resize();

      const assetIds: SpriteId[] = ["ocean", "honu", ...CREATURES];
      const images: HTMLImageElement[] = [];
      let loaded = 0;
      assetIds.forEach((id) => {
        const image = new Image();
        images.push(image);
        image.onload = () => {
          if (disposed || failed) return;
          try {
            sprites[id] = {
              image,
              ...(id === "ocean"
                ? { x: 0, y: 0, width: image.width, height: image.height }
                : spriteBounds(image)),
            };
            loaded++;
            if (loaded === assetIds.length) {
              ready = true;
              propsRef.current.onReady();
              reportNearby(true);
              refresh();
            }
          } catch {
            failed = true;
            propsRef.current.onError();
          }
        };
        image.onerror = () => {
          if (disposed || failed) return;
          failed = true;
          propsRef.current.onError();
        };
        // Next serves a smaller WebP with alpha; the generated source PNGs stay intact.
        const { props: imageProps } = getImageProps({
          src: `/honu-cartoon/${id}.png`,
          alt: "",
          width: id === "ocean" ? 1024 : 512,
          height: id === "ocean" ? 342 : 512,
        });
        image.src = imageProps.src;
      });

      return () => {
        disposed = true;
        if (frame) cancelAnimationFrame(frame);
        engineRef.current = null;
        images.forEach((image) => {
          image.onload = null;
          image.onerror = null;
        });
        observer.disconnect();
        intersection.disconnect();
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.removeEventListener("lostpointercapture", pointerUp);
        canvas.removeEventListener("keydown", keyDown);
        canvas.removeEventListener("keyup", keyUp);
        canvas.removeEventListener("blur", clearInput);
        document.removeEventListener("visibilitychange", visibilityChange);
        window.removeEventListener("blur", clearInput);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="Pilot HONU through the ocean. Click or drag to steer, or use the arrow keys or W, A, S, D."
        className="absolute inset-0 size-full touch-none outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary"
      >
        Click or drag in the ocean to steer HONU, or use the arrow keys or W,
        A, S, D.
      </canvas>
    );
  },
);

export default OceanCanvas;
