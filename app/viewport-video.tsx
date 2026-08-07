"use client";

import type { VideoHTMLAttributes } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ViewportVideoSource = {
  src: string;
  type: string;
};

type ViewportVideoProps = Pick<
  VideoHTMLAttributes<HTMLVideoElement>,
  "aria-hidden" | "className" | "loop" | "onEnded" | "poster"
> & {
  preloadMargin?: string;
  sources: readonly ViewportVideoSource[];
};

export function ViewportVideo({
  className,
  loop = true,
  onEnded,
  poster,
  preloadMargin = "125% 0px",
  sources,
  ...props
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [activated, setActivated] = useState(false);
  const sourceKey = useMemo(
    () => sources.map((source) => source.src).join("|"),
    [sources],
  );

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
        }
      },
      { rootMargin: preloadMargin },
    );
    const playbackObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;

      if (!entry.isIntersecting || document.hidden) {
        video.pause();
        return;
      }

      void video.play().catch(() => {});
    });
    const handleVisibilityChange = () => {
      if (document.hidden || !visibleRef.current) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    preloadObserver.observe(video);
    playbackObserver.observe(video);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [preloadMargin]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !activated) {
      return;
    }

    video.load();
    if (visibleRef.current && !document.hidden) {
      void video.play().catch(() => {});
    }
  }, [activated, sourceKey]);

  return (
    <video
      ref={videoRef}
      className={className}
      loop={loop}
      muted
      onEnded={onEnded}
      playsInline
      poster={poster}
      preload={activated ? "metadata" : "none"}
      {...props}
    >
      {activated
        ? sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))
        : null}
    </video>
  );
}
