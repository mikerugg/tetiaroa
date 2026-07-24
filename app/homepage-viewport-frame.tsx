"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import {
  captureViewportLayout,
  measureSafeViewportHeight,
  measureStageViewportHeight,
  shouldRefreshStableViewport,
} from "./stable-viewport";

type HomepageViewportFrameProps = PropsWithChildren<{
  className: string;
}>;

export function HomepageViewportFrame({
  children,
  className,
}: HomepageViewportFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    let viewportLayout = captureViewportLayout();

    const lockViewportTokens = () => {
      const safeHeight = measureSafeViewportHeight();
      const stageHeight = measureStageViewportHeight();

      frame.style.setProperty("--viewport-safe-height", `${safeHeight}px`);
      frame.style.setProperty("--viewport-stage-height", `${stageHeight}px`);
      frame.style.setProperty(
        "--viewport-height-unit",
        `${stageHeight / 100}px`,
      );
    };

    const onResize = () => {
      const nextLayout = captureViewportLayout();
      const shouldRefresh = shouldRefreshStableViewport(
        viewportLayout,
        nextLayout,
      );

      viewportLayout = nextLayout;

      if (shouldRefresh) {
        lockViewportTokens();
      }
    };

    lockViewportTokens();
    window.addEventListener("resize", onResize, { capture: true });

    return () => {
      window.removeEventListener("resize", onResize, { capture: true });
      frame.style.removeProperty("--viewport-safe-height");
      frame.style.removeProperty("--viewport-stage-height");
      frame.style.removeProperty("--viewport-height-unit");
    };
  }, []);

  return (
    <div ref={frameRef} className={className}>
      {children}
    </div>
  );
}
