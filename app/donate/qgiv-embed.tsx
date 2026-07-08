"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const QGIV_EMBED_ID = "87259";
const QGIV_EMBED_BASE_URL =
  "https://secure.qgiv.com/for/tetiaroasociety/embed/87259/";
const QGIV_EMBED_SCRIPT =
  "https://secure.qgiv.com/resources/core/js/embed.js";
const INITIAL_EMBED_HEIGHT = 1000;
const DESKTOP_EXPANDED_EMBED_HEIGHT = 1350;
const MOBILE_EXPANDED_EMBED_HEIGHT = 1600;

type QgivWindow = Window &
  typeof globalThis & {
    QGIV?: {
      Embed?: {
        initializeEmbeds?: () => void;
      };
    };
  };

type QgivEmbedMessage = {
  event?: string;
  data?: unknown;
  embed?: string | number;
};

export function QgivEmbed({
  amount = null,
  title,
}: {
  amount?: number | null;
  title: string;
}) {
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const embedUrl = getQgivEmbedUrl(amount);
  const embedKey = amount ? `amount-${amount}` : "default";

  useEffect(() => {
    function handleQgivMessage(event: MessageEvent) {
      if (event.origin !== "https://secure.qgiv.com") {
        return;
      }

      const message = getQgivMessage(event.data);

      if (!message) {
        return;
      }

      if (message.embed && String(message.embed) !== QGIV_EMBED_ID) {
        return;
      }

      if (message.event === "handshake") {
        disableIframeScrolling(embedContainerRef.current);
        sendHandshakeResponse(event);
      }

      if (message.event === "resize") {
        const height = getMessageHeight(message.data);

        if (height) {
          resizeEmbed(embedContainerRef.current, height);
        }
      }

      if (message.event === "top" || message.event?.includes("Step")) {
        expandEmbedForCheckout(embedContainerRef.current);
      }
    }

    window.addEventListener("message", handleQgivMessage);

    return () => {
      window.removeEventListener("message", handleQgivMessage);
    };
  }, []);

  useEffect(() => {
    initializeQgivEmbeds();
  }, [embedUrl]);

  useEffect(() => {
    const embedContainer = embedContainerRef.current;

    if (!embedContainer) {
      return;
    }

    function handleQgivStepChange() {
      expandEmbedForCheckout(embedContainer);
    }

    function handleWindowBlur() {
      if (document.activeElement === getQgivIframe(embedContainer)) {
        expandEmbedForCheckout(embedContainer);
      }
    }

    disableIframeScrolling(embedContainer);
    document.addEventListener(
      "QGIV.donationStepChange",
      handleQgivStepChange,
    );
    window.addEventListener("blur", handleWindowBlur);

    const observer = new MutationObserver(() => {
      disableIframeScrolling(embedContainer);
    });

    observer.observe(embedContainer, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener(
        "QGIV.donationStepChange",
        handleQgivStepChange,
      );
      window.removeEventListener("blur", handleWindowBlur);
      observer.disconnect();
    };
  }, [embedUrl]);

  return (
    <>
      <Script
        id="qgiv-embed-script"
        src={QGIV_EMBED_SCRIPT}
        strategy="afterInteractive"
        onReady={initializeQgivEmbeds}
      />
      <div
        key={embedKey}
        ref={embedContainerRef}
        data-qgiv-embed="true"
        data-embed-id={QGIV_EMBED_ID}
        data-embed={embedUrl}
        data-aria-title={title}
        className="min-h-[1000px] w-full"
      />
    </>
  );
}

function getQgivEmbedUrl(amount: number | null) {
  const safeAmount =
    typeof amount === "number" && Number.isFinite(amount) && amount > 0
      ? Math.trunc(amount)
      : null;

  // QGiv only pre-selects /amount/{value}/ for active suggested amounts.
  return safeAmount
    ? `${QGIV_EMBED_BASE_URL}amount/other/${safeAmount}/`
    : QGIV_EMBED_BASE_URL;
}

function initializeQgivEmbeds() {
  (window as QgivWindow).QGIV?.Embed?.initializeEmbeds?.();
}

function getQgivMessage(data: unknown): QgivEmbedMessage | null {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as QgivEmbedMessage;
    } catch {
      return null;
    }
  }

  return isRecord(data) ? (data as QgivEmbedMessage) : null;
}

function getMessageHeight(data: unknown) {
  if (typeof data === "number" && Number.isFinite(data)) {
    return data;
  }

  if (typeof data === "string") {
    const height = Number.parseInt(data, 10);

    return Number.isFinite(height) ? height : null;
  }

  if (!isRecord(data)) {
    return null;
  }

  const height = data.height ?? data.formHeight ?? data.bodyHeight;

  return getMessageHeight(height);
}

function resizeEmbed(embedContainer: HTMLDivElement | null, height: number) {
  const safeHeight = Math.max(INITIAL_EMBED_HEIGHT, Math.ceil(height));
  const iframe = getQgivIframe(embedContainer);

  if (embedContainer) {
    embedContainer.style.minHeight = `${safeHeight}px`;
  }

  if (iframe) {
    iframe.style.height = `${safeHeight}px`;
    disableIframeScrolling(embedContainer);
  }
}

function expandEmbedForCheckout(embedContainer: HTMLDivElement | null) {
  resizeEmbed(embedContainer, getExpandedEmbedHeight());
}

function getExpandedEmbedHeight() {
  if (window.matchMedia("(max-width: 640px)").matches) {
    return MOBILE_EXPANDED_EMBED_HEIGHT;
  }

  return DESKTOP_EXPANDED_EMBED_HEIGHT;
}

function disableIframeScrolling(embedContainer: HTMLDivElement | null) {
  const iframe = getQgivIframe(embedContainer);

  if (!iframe) {
    return;
  }

  iframe.style.overflow = "hidden";
  iframe.style.overflowY = "hidden";
  iframe.setAttribute("scrolling", "no");
}

function getQgivIframe(embedContainer: HTMLDivElement | null) {
  return embedContainer?.querySelector<HTMLIFrameElement>(
    "iframe.qgiv-embed-form",
  );
}

function sendHandshakeResponse(event: MessageEvent) {
  const source = event.source as Window | null;

  source?.postMessage(
    JSON.stringify({
      event: "handshake",
      data: {
        parentWindowHeight: window.innerHeight,
      },
    }),
    event.origin,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
