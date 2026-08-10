"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SproutPlayerEvent = {
  data?: unknown;
  type: string;
};

type SproutPlayer = {
  bind: (event: string, handler: (event: SproutPlayerEvent) => void) => void;
  pause: () => void;
  play: () => void;
  setVolume: (volume: number) => void;
  unbind: (event: string, handler: (event: SproutPlayerEvent) => void) => void;
};

declare global {
  interface Window {
    SV?: {
      Player: new (options: {
        target: HTMLIFrameElement;
        videoId: string;
      }) => SproutPlayer;
    };
  }
}

type SproutBackgroundVideoProps = {
  className?: string;
  eager?: boolean;
  embedUrl: string;
  loop?: boolean;
  onCompleted?: () => void;
  playing?: boolean;
  poster?: string;
  posterSizes?: string;
  preloadMargin?: string;
  title: string;
};

function getVideoId(embedUrl: string) {
  return new URL(embedUrl).pathname.split("/").filter(Boolean).at(1) ?? "";
}

function getPlayerUrl(embedUrl: string, loop: boolean, preload: boolean) {
  const url = new URL(embedUrl);

  url.searchParams.set("autoPlay", "true");
  url.searchParams.set("showControls", "false");
  url.searchParams.set("loop", String(loop));
  url.searchParams.set("volume", "0");
  url.searchParams.set("background", "true");
  url.searchParams.set("scale", "fill");
  url.searchParams.set("playsinline", "true");
  url.searchParams.set("preload", String(preload));

  return url.toString();
}

export function SproutBackgroundVideo({
  className,
  eager = false,
  embedUrl,
  loop = true,
  onCompleted,
  playing = true,
  poster,
  posterSizes = "100vw",
  preloadMargin = "125% 0px",
  title,
}: SproutBackgroundVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<SproutPlayer | null>(null);
  const visibleRef = useRef(eager);
  const playingRef = useRef(playing);
  const [active, setActive] = useState(eager);
  const [apiReady, setApiReady] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const videoId = useMemo(() => getVideoId(embedUrl), [embedUrl]);
  const playerUrl = useMemo(
    () => getPlayerUrl(embedUrl, loop, eager),
    [eager, embedUrl, loop],
  );

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const wrap = wrapRef.current;

    if (!wrap) {
      return;
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIframeLoaded(false);
        }

        setActive(entry.isIntersecting);
      },
      { rootMargin: preloadMargin },
    );
    const playbackObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;

      if (!entry.isIntersecting || document.hidden || !playingRef.current) {
        playerRef.current?.pause();
      } else {
        playerRef.current?.play();
      }
    });
    const handleVisibilityChange = () => {
      if (document.hidden || !visibleRef.current || !playingRef.current) {
        playerRef.current?.pause();
      } else {
        playerRef.current?.play();
      }
    };

    preloadObserver.observe(wrap);
    playbackObserver.observe(wrap);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [preloadMargin]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (
      !active ||
      !apiReady ||
      !iframeLoaded ||
      !iframe ||
      !videoId ||
      !window.SV
    ) {
      return;
    }

    const player = new window.SV.Player({ target: iframe, videoId });
    const handleReady = () => {
      player.setVolume(0);

      if (visibleRef.current && !document.hidden && playingRef.current) {
        player.play();
      } else {
        player.pause();
      }
    };
    const handleCompleted = () => onCompleted?.();

    playerRef.current = player;
    player.bind("ready", handleReady);

    if (onCompleted) {
      player.bind("completed", handleCompleted);
    }

    return () => {
      player.unbind("ready", handleReady);

      if (onCompleted) {
        player.unbind("completed", handleCompleted);
      }

      if (playerRef.current === player) {
        playerRef.current = null;
      }
    };
  }, [active, apiReady, iframeLoaded, onCompleted, videoId]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    if (playing && visibleRef.current && !document.hidden) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [playing]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "overflow-hidden bg-black bg-cover bg-center",
        className,
      )}
      aria-hidden="true"
    >
      <Script
        id="sprout-player-api"
        src="https://c.sproutvideo.com/player_api.js"
        strategy="afterInteractive"
        onReady={() => setApiReady(true)}
      />
      <div className="relative size-full">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes={posterSizes}
            className="pointer-events-none object-cover"
            preload={eager}
          />
        ) : null}
        {active ? (
          <iframe
            ref={iframeRef}
            className="sproutvideo-player pointer-events-none absolute inset-0 size-full border-0"
            src={playerUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading={eager ? "eager" : "lazy"}
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            onLoad={() => setIframeLoaded(true)}
          />
        ) : null}
      </div>
    </div>
  );
}
