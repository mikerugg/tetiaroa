"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-experience.module.css";

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vNdc;
void main() {
  vNdc = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec2 vNdc;
uniform sampler2D uTex;
uniform mat3 uRot;
uniform float uTanHalf;
uniform float uAspect;
const float PI = 3.141592653589793;
void main() {
  vec3 dir = normalize(uRot * vec3(vNdc.x * uTanHalf * uAspect, vNdc.y * uTanHalf, -1.0));
  float lon = atan(dir.x, -dir.z);
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  vec2 uv = vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - lat / PI);
  gl_FragColor = texture2D(uTex, uv);
}
`;

const FOV_Y = (58 * Math.PI) / 180;
const DRAG_SENSITIVITY = 0.0032;
const PITCH_LIMIT = 1.2;
const IDLE_DRIFT = 0.0007;

export type VrViewerLabels = {
  recording: string;
  depth: string;
  dragHint: string;
};

const defaultLabels: VrViewerLabels = {
  recording: "rec — capturing dive 15",
  depth: "−104 m · 8k 360°",
  dragHint: "drag to look",
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function VrViewer({
  src,
  labels = defaultLabels,
}: {
  src: string;
  labels?: VrViewerLabels;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const viewRef = useRef({ yaw: 0, pitch: 0 });
  const dragRef = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
  } | null>(null);
  const idleUntilRef = useRef(0);
  const visibleRef = useRef(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [sourceActive, setSourceActive] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const sourceType = src.endsWith(".mp4") ? "video/mp4" : "video/webm";

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!wrap || !canvas || !video) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
    });

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram();

    if (!vert || !frag || !program) {
      setWebglFailed(true);
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglFailed(true);
      return;
    }

    gl.useProgram(program);

    const quad = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, "aPos");

    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uRot = gl.getUniformLocation(program, "uRot");
    const uTanHalf = gl.getUniformLocation(program, "uTanHalf");
    const uAspect = gl.getUniformLocation(program, "uAspect");

    gl.uniform1f(uTanHalf, Math.tan(FOV_Y / 2));

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(Math.round(wrap.clientWidth * dpr), 2);
      canvas.height = Math.max(Math.round(wrap.clientHeight * dpr), 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uAspect, canvas.width / canvas.height);
    };

    const render = (time: number) => {
      frame = 0;

      if (!visible) {
        return;
      }

      if (!reducedMotion && !dragRef.current && time > idleUntilRef.current) {
        viewRef.current.yaw += IDLE_DRIFT;
      }

      if (video.readyState >= 2) {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGB,
          gl.RGB,
          gl.UNSIGNED_BYTE,
          video,
        );
      }

      const { yaw, pitch } = viewRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      // Ry(yaw) * Rx(pitch), column-major.
      gl.uniformMatrix3fv(uRot, false, [
        cy,
        0,
        -sy,
        sy * sp,
        cp,
        cy * sp,
        sy * cp,
        -sp,
        cy * cp,
      ]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSourceActive(true);
        }
      },
      { rootMargin: "100% 0px" },
    );
    const playbackObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visibleRef.current = visible;

      if (visible) {
        setSourceActive(true);
        void video.play().catch(() => {});
        if (!frame) {
          frame = requestAnimationFrame(render);
        }
      } else {
        video.pause();
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    preloadObserver.observe(wrap);
    playbackObserver.observe(wrap);
    resize();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(quad);
      gl.deleteTexture(texture);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !sourceActive) {
      return;
    }

    video.load();
    if (visibleRef.current) {
      void video.play().catch(() => {});
    }
  }, [sourceActive]);

  return (
    <div
      ref={wrapRef}
      className={styles.deepPanel}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          x: event.clientX,
          y: event.clientY,
          yaw: viewRef.current.yaw,
          pitch: viewRef.current.pitch,
        };
        setHintVisible(false);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;

        if (!drag) {
          return;
        }

        viewRef.current.yaw =
          drag.yaw + (event.clientX - drag.x) * DRAG_SENSITIVITY;
        viewRef.current.pitch = Math.min(
          Math.max(
            drag.pitch + (event.clientY - drag.y) * DRAG_SENSITIVITY,
            -PITCH_LIMIT,
          ),
          PITCH_LIMIT,
        );
      }}
      onPointerUp={() => {
        dragRef.current = null;
        idleUntilRef.current = performance.now() + 2500;
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        idleUntilRef.current = performance.now() + 2500;
      }}
    >
      <video
        ref={videoRef}
        className={webglFailed ? styles.deepVideo : styles.vrSource}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        {sourceActive ? <source src={src} type={sourceType} /> : null}
      </video>
      {webglFailed ? null : (
        <canvas ref={canvasRef} className={styles.vrCanvas} />
      )}

      <div className={styles.hudFrame} aria-hidden="true" />
      <div className={styles.reticle} aria-hidden="true" />
      <div className={`${styles.hudFeed} font-mono`} aria-hidden="true">
        <span className={styles.hudDot} />
        {labels.recording}
      </div>
      <div className={`${styles.hudDepth} font-mono`} aria-hidden="true">
        {labels.depth}
      </div>
      <div
        className={
          hintVisible
            ? `${styles.hudHint} font-mono`
            : `${styles.hudHint} ${styles.hudHintHidden} font-mono`
        }
        aria-hidden="true"
      >
        {labels.dragHint}
      </div>
    </div>
  );
}
