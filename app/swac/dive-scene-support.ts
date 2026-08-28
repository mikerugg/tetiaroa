export const MIN_DIVE_SCENE_MEMORY_GB = 4;
export const COMPACT_DIVE_SCENE_MAX_WIDTH = 1023;

export type DiveSceneQuality = "compact" | "full";

export type DiveSceneCapabilities = Readonly<{
  /** CSS viewport width, used to choose rendering quality rather than access. */
  viewportWidth: number;
  /** Whether a temporary canvas returned a WebGL 2 rendering context. */
  hasWebGL2: boolean;
  /** Approximate memory hint when the browser exposes Navigator.deviceMemory. */
  deviceMemory?: number;
}>;

export type DiveSceneSupportDecision =
  | Readonly<{
      supported: true;
      quality: DiveSceneQuality;
      reason: "supported";
    }>
  | Readonly<{
      supported: false;
      quality: null;
      reason: "webgl2-unavailable" | "low-device-memory";
    }>;

/**
 * Converts browser capability signals into the descent scene's render policy.
 *
 * Viewport width deliberately affects quality only. A phone with a working
 * WebGL 2 implementation can render the compact scene just as a desktop can
 * render the full scene. Browsers such as Safari that do not expose
 * `navigator.deviceMemory` are treated as having an unknown (not low) amount
 * of memory.
 */
export function decideDiveSceneSupport({
  viewportWidth,
  hasWebGL2,
  deviceMemory,
}: DiveSceneCapabilities): DiveSceneSupportDecision {
  if (!hasWebGL2) {
    return {
      supported: false,
      quality: null,
      reason: "webgl2-unavailable",
    };
  }

  const hasExplicitlyLowMemory =
    typeof deviceMemory === "number" &&
    Number.isFinite(deviceMemory) &&
    deviceMemory < MIN_DIVE_SCENE_MEMORY_GB;

  if (hasExplicitlyLowMemory) {
    return {
      supported: false,
      quality: null,
      reason: "low-device-memory",
    };
  }

  return {
    supported: true,
    quality:
      viewportWidth <= COMPACT_DIVE_SCENE_MAX_WIDTH ? "compact" : "full",
    reason: "supported",
  };
}
