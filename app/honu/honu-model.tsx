"use client";

import {
  Component,
  type ComponentRef,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import * as THREE from "three";
import { Submersible } from "@/app/swac/dive-submersible";
import { Button } from "@/components/ui/button";

type Controls = ComponentRef<typeof OrbitControls>;
const PREVIEW_DEPTH = { get: () => 0 };
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function ModelFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="relative flex size-full items-end justify-center p-6">
      <Image
        src="/sub-render.webp"
        alt="HONU submersible with a clear passenger dome, side thrusters, and a sampling arm."
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-contain p-8 pb-20"
      />
      <p
        role="status"
        className="relative max-w-sm text-center text-sm text-muted-foreground"
      >
        {loading
          ? "Getting HONU ready for a closer look…"
          : "The 3D view isn’t available on this device. You can still explore every part of HONU on this page."}
      </p>
    </div>
  );
}

class ModelBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <ModelFallback /> : this.props.children;
  }
}

function ModelScene({
  controls,
  reset,
  reducedMotion,
  onContextLost,
}: {
  controls: RefObject<Controls | null>;
  reset: number;
  reducedMotion: boolean;
  onContextLost: () => void;
}) {
  const { camera, gl, invalidate, scene, size } = useThree();
  const framed = useRef("");

  useEffect(() => {
    // A reset changes React state, not a Three object, so demand mode needs
    // an explicit frame before the framing callback can move the camera.
    invalidate();
  }, [invalidate, reset, size.width, size.height]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [gl, onContextLost]);

  useFrame(() => {
    const key = `${reset}:${size.width}:${size.height}`;
    if (framed.current === key || !controls.current) return;

    const subject = scene.getObjectByName("honu-subject");
    if (!subject) return;
    const bounds = new THREE.Box3().setFromObject(subject);
    if (bounds.isEmpty()) return;

    const centre = bounds.getCenter(new THREE.Vector3());
    const radius = bounds.getSize(new THREE.Vector3()).length() / 2;
    const perspective = camera as THREE.PerspectiveCamera;
    const verticalFov = THREE.MathUtils.degToRad(perspective.fov);
    const horizontalFov =
      2 * Math.atan(Math.tan(verticalFov / 2) * perspective.aspect);
    const distance =
      (radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2)) * 1.05;
    const direction = new THREE.Vector3(1.35, 0.7, 1.65).normalize();

    controls.current.target.copy(centre);
    camera.position.copy(centre).addScaledVector(direction, distance);
    camera.lookAt(centre);
    controls.current.update();
    framed.current = key;
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 9, 5]} intensity={2.7} />
      <directionalLight
        position={[-7, 3, -4]}
        intensity={1.6}
        color="#a3e5ee"
      />
      <directionalLight position={[0, -6, 2]} intensity={0.7} />
      <group name="honu-subject">
        <Submersible depth={PREVIEW_DEPTH} preview />
      </group>
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
        minDistance={0.85}
        maxDistance={5}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />
    </>
  );
}

function ModelViewer() {
  const container = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [reset, setReset] = useState(0);
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => true,
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2");
        setSupported(Boolean(context));
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setSupported(false);
      }
    });
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (container.current) observer.observe(container.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={container} className="relative size-full">
      {supported ? (
        <>
          <Canvas
            camera={{ position: [2, 1, 2], fov: 40, near: 0.01, far: 100 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            frameloop={
              !visible || !inView
                ? "never"
                : reducedMotion
                  ? "demand"
                  : "always"
            }
            role="img"
            aria-label="Interactive 3D view of the HONU submersible"
            aria-describedby="honu-model-instructions"
          >
            <ModelScene
              controls={controls}
              reset={reset}
              reducedMotion={reducedMotion}
              onContextLost={() => setSupported(false)}
            />
          </Canvas>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-linear-to-t from-background/90 to-transparent px-4 pb-5 pt-12">
            <p
              id="honu-model-instructions"
              className="text-center text-xs text-muted-foreground"
            >
              Drag to turn. Pinch or scroll to zoom. Or use the buttons below.
            </p>
            <div
              className="pointer-events-auto flex items-center gap-2"
              role="group"
              aria-label="3D view controls"
            >
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Rotate HONU left"
                onClick={() => {
                  const current = controls.current;
                  if (current)
                    current.setAzimuthalAngle(
                      current.getAzimuthalAngle() - Math.PI / 6,
                    );
                }}
              >
                <RotateCcw data-icon="inline-start" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Rotate HONU right"
                onClick={() => {
                  const current = controls.current;
                  if (current)
                    current.setAzimuthalAngle(
                      current.getAzimuthalAngle() + Math.PI / 6,
                    );
                }}
              >
                <RotateCw data-icon="inline-start" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Zoom in on HONU"
                onClick={() => controls.current?.dollyIn(0.85)}
              >
                <ZoomIn data-icon="inline-start" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Zoom out from HONU"
                onClick={() => controls.current?.dollyOut(0.85)}
              >
                <ZoomOut data-icon="inline-start" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReset((value) => value + 1)}
              >
                Reset view
              </Button>
            </div>
          </div>
        </>
      ) : (
        <ModelFallback loading={supported === null} />
      )}
    </div>
  );
}

export default function HonuModel() {
  return (
    <ModelBoundary>
      <ModelViewer />
    </ModelBoundary>
  );
}
