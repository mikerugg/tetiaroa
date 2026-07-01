"use client";

import { useEffect, useRef, useState } from "react";

type SanctuaryClip = {
  src: string;
};

export function SanctuaryVideo({
  clips,
  className,
}: {
  clips: [SanctuaryClip, SanctuaryClip];
  className?: string;
}) {
  const [clipIndex, setClipIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.load();
    void video.play().catch(() => {});
  }, [clipIndex]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      playsInline
      preload="metadata"
      src={clips[clipIndex].src}
      aria-hidden="true"
      onEnded={() => {
        setClipIndex((current) => (current + 1) % clips.length);
      }}
    />
  );
}
