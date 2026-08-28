import assert from "node:assert/strict";
import test from "node:test";
import {
  MIN_DIVE_SCENE_MEMORY_GB,
  decideDiveSceneSupport,
} from "./dive-scene-support.ts";

test("iPhone-sized Safari viewports receive the compact WebGL scene", () => {
  const safariPhoneViewports = [
    { label: "portrait", viewportWidth: 390 },
    { label: "landscape", viewportWidth: 844 },
    { label: "large portrait", viewportWidth: 430 },
    { label: "large landscape", viewportWidth: 932 },
  ];

  for (const { label, viewportWidth } of safariPhoneViewports) {
    assert.deepEqual(
      decideDiveSceneSupport({
        viewportWidth,
        hasWebGL2: true,
        // Safari does not currently expose Navigator.deviceMemory.
        deviceMemory: undefined,
      }),
      {
        supported: true,
        quality: "compact",
        reason: "supported",
      },
      label,
    );
  }
});

test("viewport width selects quality without denying WebGL access", () => {
  assert.deepEqual(
    decideDiveSceneSupport({
      viewportWidth: 1023,
      hasWebGL2: true,
      deviceMemory: 8,
    }),
    { supported: true, quality: "compact", reason: "supported" },
  );
  assert.deepEqual(
    decideDiveSceneSupport({
      viewportWidth: 1024,
      hasWebGL2: true,
      deviceMemory: 8,
    }),
    { supported: true, quality: "full", reason: "supported" },
  );
});

test("a missing WebGL 2 context always selects the fallback", () => {
  assert.deepEqual(
    decideDiveSceneSupport({
      viewportWidth: 390,
      hasWebGL2: false,
      deviceMemory: undefined,
    }),
    {
      supported: false,
      quality: null,
      reason: "webgl2-unavailable",
    },
  );
});

test("only an explicitly low finite memory hint denies an otherwise capable browser", () => {
  assert.deepEqual(
    decideDiveSceneSupport({
      viewportWidth: 390,
      hasWebGL2: true,
      deviceMemory: MIN_DIVE_SCENE_MEMORY_GB - 1,
    }),
    {
      supported: false,
      quality: null,
      reason: "low-device-memory",
    },
  );

  for (const deviceMemory of [
    undefined,
    MIN_DIVE_SCENE_MEMORY_GB,
    Number.NaN,
  ]) {
    assert.equal(
      decideDiveSceneSupport({
        viewportWidth: 390,
        hasWebGL2: true,
        deviceMemory,
      }).supported,
      true,
    );
  }
});
