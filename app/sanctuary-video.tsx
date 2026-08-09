"use client";

import { useCallback, useState } from "react";
import type { SproutVideoSource } from "./home-video-sources";
import { SproutBackgroundVideo } from "./sprout-background-video";

export function SanctuaryVideo({
  clips,
  className,
}: {
  clips: [SproutVideoSource, SproutVideoSource];
  className?: string;
}) {
  const [clipIndex, setClipIndex] = useState(0);
  const clip = clips[clipIndex];
  const showNextClip = useCallback(() => {
    setClipIndex((current) => (current + 1) % clips.length);
  }, [clips.length]);

  return (
    <SproutBackgroundVideo
      key={clip.embedUrl}
      className={className}
      embedUrl={clip.embedUrl}
      title={clip.title}
      loop={false}
      onCompleted={showNextClip}
    />
  );
}
