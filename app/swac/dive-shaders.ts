/**
 * GLSL for the descent. Two materials:
 *
 *   causticsMaterial — the underside of the sea surface, seen from below.
 *   snowMaterial     — marine snow, stretched along Y by scroll velocity.
 *
 * Both are declared through drei's shaderMaterial so they can be used as JSX
 * and driven from useFrame without React re-rendering.
 */

export const causticsVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * The standard layered-distortion caustic: iterate a point through a sine
 * feedback loop and take the reciprocal of its distance. Cheap, and it reads
 * unmistakably as light through moving water.
 */
export const causticsFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float caustic(vec2 uv, float time) {
    vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
    vec2 i = p;
    float c = 1.0;
    const float inten = 0.005;

    for (int n = 0; n < 5; n++) {
      float t = time * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
      c += 1.0 / length(vec2(
        p.x / (sin(i.x + t) / inten),
        p.y / (cos(i.y + t) / inten)
      ));
    }

    c /= 5.0;
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    float c = caustic(vUv * 2.2, uTime * 0.4);

    // Fade the pattern out towards the edges so the plane has no visible seam.
    vec2 centred = vUv - 0.5;
    float falloff = 1.0 - smoothstep(0.18, 0.5, length(centred));

    float alpha = clamp(c * uIntensity * falloff, 0.0, 1.0);
    gl_FragColor = vec4(uColor * (0.55 + c * 0.9), alpha);

    #include <colorspace_fragment>
  }
`;

export const snowVertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uStretch;
  uniform float uColumnHeight;
  uniform float uCameraY;

  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aSpeed;

  varying float vFade;

  void main() {
    // Each fleck drifts slowly downward in world space, then wraps into a tall
    // column centred on the camera, so the field is endless in both directions.
    float drift = uTime * aSpeed * 0.35;
    float y = aOffset.y - drift - uCameraY;
    y = mod(y + uColumnHeight * 0.5, uColumnHeight) - uColumnHeight * 0.5;

    vec3 instanceCentre = vec3(aOffset.x, y + uCameraY, aOffset.z);

    // Stretch the quad along Y with scroll velocity. Standing still it is a
    // speck; moving fast it is a streak.
    vec3 local = position;
    local.x *= aScale;
    local.y *= aScale * (1.0 + uStretch * 26.0);

    vec4 mvPosition = modelViewMatrix * vec4(instanceCentre, 1.0);
    mvPosition.xy += local.xy;

    // Fade the ones nearest the camera so nothing pops in your face.
    float distance = length(mvPosition.xyz);
    vFade = smoothstep(0.6, 4.0, distance) * (1.0 - smoothstep(30.0, 60.0, distance));

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const snowFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    gl_FragColor = vec4(uColor, vFade * uOpacity);

    #include <colorspace_fragment>
  }
`;
