"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GiantSquid } from "@/app/swac/dive-deep-life";
import { SpermWhale } from "@/app/swac/dive-sperm-whale";
import { JellyfishSchool } from "@/app/swac/dive-jellyfish";
import { PipeIntake } from "@/app/swac/dive-intake";
import { Submersible } from "@/app/swac/dive-submersible";
import {
  GiantJack,
  LemonShark,
  SeaTurtle,
} from "@/app/swac/dive-marine-life";
import {
  createAlgaeGeometry,
  createBarrelSpongeGeometry,
  createBranchingCoralGeometry,
  createMoundCoralGeometry,
  createPlateCoralGeometry,
  createSeaFanGeometry,
  createSeaWhipGeometry,
  createStarfishGeometry,
} from "@/app/swac/dive-reef-geometry";

/*
 * A bench for looking at the scene's models on their own, lit plainly and from
 * a known angle.
 *
 * Judging a shape from the dive itself means judging it in fog, at depth, at
 * whatever angle it happens to be passing — which is how a whale ended up 58 m
 * long and shaped like a trumpet. Everything here is deterministic and
 * URL-addressable so a given model and angle can be screenshotted directly.
 */

/** The scene's convention: one world unit is ten metres. */
const METRES_PER_UNIT = 10;

const GEOMETRY_MODELS = {
  starfish: createStarfishGeometry,
  "coral-branching": createBranchingCoralGeometry,
  "coral-mound": createMoundCoralGeometry,
  "coral-plate": createPlateCoralGeometry,
  "sea-fan": createSeaFanGeometry,
  sponge: createBarrelSpongeGeometry,
  "sea-whip": createSeaWhipGeometry,
  algae: createAlgaeGeometry,
} as const;

const MODELS = [
  "whale",
  "squid",
  "jellyfish",
  "giant-jack",
  "sea-turtle",
  "shark",
  "pipe-intake",
  "submersible",
  ...Object.keys(GEOMETRY_MODELS),
] as const;
export type ModelName = (typeof MODELS)[number];

const VIEWS = {
  side: [1, 0, 0],
  front: [0, 0, 1],
  back: [0, 0, -1],
  top: [0, 1, 0],
  quarter: [0.72, 0.42, 0.72],
} as const;
export type ViewName = keyof typeof VIEWS;

const stillDepth = { get: () => 0 };
const TURTLE_VIEWS = {
  side: [0, 0, -1],
  front: [1, 0, 0],
  back: [-1, 0, 0],
  top: [0, 1, 0],
  quarter: [0.28, 0.34, -1],
} as const;
const SHARK_VIEWS = {
  side: [0, 0, -1],
  front: [1, 0, 0],
  back: [-1, 0, 0],
  top: [0, 1, 0],
  quarter: [0.18, 0.32, -1],
} as const;
const WHALE_VIEWS = {
  ...VIEWS,
  // Mostly lateral, with just enough height and nose angle to match the
  // supplied low-poly reference instead of foreshortening the whole animal.
  quarter: [1, 0.3, 0.34],
} as const;

/** The bench has its own light chrome; the site's dark Button is invisible here. */
function chipClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
    active
      ? "border-[#101418] bg-[#101418] text-[#f2f3f1]"
      : "border-black/20 bg-white text-[#101418] hover:border-black/45",
  ].join(" ");
}

function ModelSubject({ name }: { name: ModelName }) {
  const geometry = useMemo(() => {
    const build = GEOMETRY_MODELS[name as keyof typeof GEOMETRY_MODELS];
    return build ? build() : null;
  }, [name]);

  if (name === "whale") {
    return <SpermWhale depth={stillDepth} preview />;
  }
  if (name === "squid") {
    return <GiantSquid depth={stillDepth} preview />;
  }
  if (name === "jellyfish") {
    return <JellyfishSchool depth={stillDepth} preview />;
  }
  if (name === "giant-jack") {
    return <GiantJack preview />;
  }
  if (name === "sea-turtle") {
    return <SeaTurtle preview />;
  }
  if (name === "shark") {
    return <LemonShark preview />;
  }
  if (name === "pipe-intake") {
    return <PipeIntake preview />;
  }
  if (name === "submersible") {
    return <Submersible depth={stillDepth} preview />;
  }
  return (
    <mesh geometry={geometry ?? undefined}>
      <meshStandardMaterial
        color="#9fb0bd"
        roughness={0.75}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

/**
 * Frames the subject and reports its real size. A model that measures wrong is
 * the single most common fault, and it is invisible until something states it.
 */
function Rig({
  view,
  model,
  onMeasure,
}: {
  view: ViewName;
  model: ModelName;
  onMeasure: (size: THREE.Vector3) => void;
}) {
  const { scene, camera } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const framed = useRef("");

  // Framing happens in the frame loop rather than an effect: on mount the
  // subject's meshes do not exist yet, so an effect measures an empty box and
  // leaves the camera wherever it started.
  useFrame(() => {
    const key = `${model}:${view}`;
    if (framed.current === key) {
      return;
    }

    const subject = scene.getObjectByName("subject");
    if (!subject) {
      return;
    }

    const box = new THREE.Box3().setFromObject(subject);
    if (box.isEmpty()) {
      return;
    }

    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    onMeasure(size);

    // Fit the bounding sphere, which works from any angle without caring
    // which axis the model happens to be long on.
    const perspective = camera as THREE.PerspectiveCamera;
    const radius = size.length() / 2 || 1;
    const turtleFramingScale =
      view === "top"
        ? 0.76
        : view === "front" || view === "back"
          ? 0.68
          : view === "quarter"
            ? 0.52
            : 0.54;
    const whaleFramingScale =
      view === "top"
        ? 1.05
        : view === "front" || view === "back"
          ? 0.65
          : 0.48;
    const framingScale =
      model === "whale"
        ? whaleFramingScale
        : model === "sea-turtle"
          ? turtleFramingScale
          : model === "shark"
            ? 0.55
            : model === "submersible"
              ? 0.68
              : 0.8;
    const distance =
      (radius / Math.sin((perspective.fov * Math.PI) / 360)) * framingScale;
    const viewDirection =
      model === "whale"
        ? WHALE_VIEWS[view]
        : model === "sea-turtle"
          ? TURTLE_VIEWS[view]
          : model === "shark"
            ? SHARK_VIEWS[view]
            : VIEWS[view];
    const direction = new THREE.Vector3(...viewDirection).normalize();

    // Order matters: OrbitControls derives its state from target and camera
    // position, so moving the camera and *then* calling update() reverts it.
    // Set the target first, place the camera, update last.
    if (controls.current) {
      controls.current.target.copy(centre);
    }
    camera.position.copy(centre).addScaledVector(direction, distance);
    camera.lookAt(centre);
    controls.current?.update();

    framed.current = key;
  });

  return <OrbitControls ref={controls} makeDefault />;
}

export function ModelLab({
  initialModel,
  initialView,
}: {
  initialModel: ModelName;
  initialView: ViewName;
}) {
  const [model, setModel] = useState<ModelName>(initialModel);
  const [view, setView] = useState<ViewName>(initialView);
  const [wireframe, setWireframe] = useState(false);
  const [size, setSize] = useState<THREE.Vector3 | null>(null);

  // Keep the URL in step so any state here can be linked to or screenshotted.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("model", model);
    url.searchParams.set("view", view);
    window.history.replaceState(null, "", url);
  }, [model, view]);

  return (
    <div className="flex min-h-svh flex-col bg-[#f2f3f1] text-[#101418]">
      <header className="flex flex-wrap items-center gap-4 border-b border-black/10 px-5 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50">
          Model lab
        </span>

        <div className="flex flex-wrap gap-1.5">
          {MODELS.map((name) => (
            <button
              key={name}
              type="button"
              className={chipClass(name === model)}
              onClick={() => setModel(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(VIEWS) as ViewName[]).map((name) => (
            <button
              key={name}
              type="button"
              className={chipClass(name === view)}
              onClick={() => setView(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={chipClass(wireframe)}
          onClick={() => setWireframe((on) => !on)}
        >
          wireframe
        </button>

        <span
          className="ml-auto font-mono text-[11px] text-black/60"
          aria-live="polite"
        >
          {size
            ? `${(size.x * METRES_PER_UNIT).toFixed(1)} × ${(
                size.y * METRES_PER_UNIT
              ).toFixed(1)} × ${(size.z * METRES_PER_UNIT).toFixed(1)} m`
            : "measuring…"}
        </span>
      </header>

      <div className="relative min-h-0 flex-1">
        <Canvas
          camera={{ position: [4, 2, 4], fov: 50, near: 0.01, far: 500 }}
          gl={{ antialias: true }}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color("#f2f3f1");
          }}
        >
          {/* Plain three-point light, so form reads and nothing is hidden. */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 9, 5]} intensity={2.4} />
          <directionalLight position={[-7, 3, -4]} intensity={1.1} />
          <directionalLight position={[0, -6, 2]} intensity={0.5} />

          <group name="subject">
            <ModelSubject name={model} />
          </group>

          <Grid
            args={[40, 40]}
            cellSize={0.1}
            cellColor="#c8ccc9"
            sectionSize={1}
            sectionColor="#8f9a95"
            infiniteGrid
            fadeDistance={40}
            position={[0, -0.001, 0]}
          />
          <axesHelper args={[1]} />

          <Wireframe enabled={wireframe} model={model} />
          <Rig view={view} model={model} onMeasure={setSize} />
        </Canvas>
      </div>

      <footer className="border-t border-black/10 px-5 py-3 font-mono text-[11px] text-black/50">
        Grid squares are 1 m; heavy lines 10 m. Drag to orbit, scroll to zoom.
        Model and view are mirrored into the URL.
      </footer>
    </div>
  );
}

/**
 * Flips the subject's materials to wireframe. Useful for seeing where a loft
 * has collapsed into slivers, which is invisible on a shaded surface.
 */
function Wireframe({
  enabled,
  model,
}: {
  enabled: boolean;
  model: ModelName;
}) {
  const { scene } = useThree();

  useEffect(() => {
    const subject = scene.getObjectByName("subject");
    if (!subject) {
      return;
    }
    subject.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const material of materials) {
        if ("wireframe" in material) {
          (material as THREE.MeshStandardMaterial).wireframe = enabled;
        }
      }
    });
    // `model` is a dependency because swapping subjects remounts the meshes.
  }, [scene, enabled, model]);

  return null;
}
