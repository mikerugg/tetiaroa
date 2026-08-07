"use client";

import { useState } from "react";
import { ViewportVideo } from "./viewport-video";

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
  const clip = clips[clipIndex];

  return (
    <ViewportVideo
      className={className}
      loop={false}
      sources={[{ src: clip.src, type: "video/mp4" }]}
      aria-hidden="true"
      onEnded={() => {
        setClipIndex((current) => (current + 1) % clips.length);
      }}
    />
  );
}
