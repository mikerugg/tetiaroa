"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isSitePopupEnabled,
  type SitePopupConfig,
  type SitePopupVariant,
} from "./site-popup-config";
import {
  createSitePopupRecord,
  getSitePopupStorageKey,
  isSitePopupSuppressed,
  parseSitePopupOverride,
  parseSitePopupRecord,
  sitePopupSessionKey,
  type SitePopupSuppressionReason,
} from "./site-popup-storage";

/** Floor for every trigger. Nothing interrupts the first seconds of the page. */
const earliestOpenMs = 6_000;
/** Re-check interval when the moment is wrong: hidden tab, another dialog open. */
const retryMs = 4_000;

const localStore = () => window.localStorage;
const sessionStore = () => window.sessionStorage;

function readStorageItem(getStorage: () => Storage, key: string) {
  try {
    return getStorage().getItem(key);
  } catch {
    // Storage may be unavailable in private browsing or strict privacy modes.
    return null;
  }
}

function writeStorageItem(
  getStorage: () => Storage,
  key: string,
  value: string,
) {
  try {
    getStorage().setItem(key, value);
  } catch {
    // Without storage the popup falls back to showing once per page view.
  }
}

function removeStorageItem(getStorage: () => Storage, key: string) {
  try {
    getStorage().removeItem(key);
  } catch {
    // Nothing to forget if storage is unavailable.
  }
}

/**
 * Frequency caps are invisible from the outside, which makes "why isn't it
 * opening?" a hard question during development. Answer it in the console.
 */
function explainWhyItStayedClosed(reason: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.info(
    `[site-popup] Staying closed: ${reason}. Add ?popup=preview to force it open, or ?popup=reset to clear this browser's history with it.`,
  );
}

/** Never talk over the film lightbox, the VR viewer, or the mobile menu. */
function isOverlayOpen() {
  return (
    document.querySelector(
      '[data-slot="dialog-content"][data-state="open"], [data-slot="sheet-content"][data-state="open"]',
    ) !== null
  );
}

type SitePopupTriggerState = {
  isOpen: boolean;
  variant: SitePopupVariant;
  /** True when opened by `?popup=…`, which must not write frequency caps. */
  isPreview: boolean;
};

export type SitePopupTrigger = SitePopupTriggerState & {
  close: () => void;
  handleSubscribed: () => void;
};

export function useSitePopupTrigger(config: SitePopupConfig): SitePopupTrigger {
  const [state, setState] = useState<SitePopupTriggerState>({
    isOpen: false,
    variant: config.variant,
    isPreview: false,
  });
  const isPreviewRef = useRef(false);
  const hasSubscribedRef = useRef(false);

  const suppress = useCallback(
    (reason: SitePopupSuppressionReason) => {
      if (isPreviewRef.current) {
        return;
      }

      writeStorageItem(
        localStore,
        getSitePopupStorageKey(config.campaignId),
        JSON.stringify(
          createSitePopupRecord(reason, config.frequency, Date.now()),
        ),
      );
    },
    [config],
  );

  const close = useCallback(() => {
    setState((current) => ({ ...current, isOpen: false }));

    if (!hasSubscribedRef.current) {
      suppress("dismissed");
    }
  }, [suppress]);

  const handleSubscribed = useCallback(() => {
    hasSubscribedRef.current = true;
    suppress("subscribed");
  }, [suppress]);

  useEffect(() => {
    if (!isSitePopupEnabled(config)) {
      return;
    }

    const override = parseSitePopupOverride(window.location.search);

    if (override.mode === "disabled") {
      return;
    }

    if (override.mode === "forced") {
      isPreviewRef.current = true;

      const frame = requestAnimationFrame(() =>
        setState({
          isOpen: true,
          variant: override.variant ?? config.variant,
          isPreview: true,
        }),
      );

      return () => cancelAnimationFrame(frame);
    }

    const storageKey = getSitePopupStorageKey(config.campaignId);

    if (override.mode === "reset") {
      // Forget this browser has ever seen it, then trigger as usual.
      removeStorageItem(localStore, storageKey);
      removeStorageItem(sessionStore, sitePopupSessionKey);
    } else {
      const record = parseSitePopupRecord(
        readStorageItem(localStore, storageKey),
      );

      if (isSitePopupSuppressed(record, Date.now())) {
        explainWhyItStayedClosed(
          `${record?.reason} on this browser until ${new Date(
            record?.until ?? 0,
          ).toLocaleDateString()}`,
        );
        return;
      }

      if (
        config.frequency.oncePerSession &&
        readStorageItem(sessionStore, sitePopupSessionKey) === config.campaignId
      ) {
        explainWhyItStayedClosed(
          "already shown in this browser session (session storage survives reloads)",
        );
        return;
      }
    }

    // The floor keeps scroll and exit-intent from firing in the first moments,
    // but a shorter configured delay is a deliberate choice, so honour it.
    const openFloorMs = config.trigger.delayMs
      ? Math.min(earliestOpenMs, config.trigger.delayMs)
      : earliestOpenMs;
    const cleanups: Array<() => void> = [];
    let isDisposed = false;

    const dispose = () => {
      if (isDisposed) {
        return;
      }

      isDisposed = true;

      while (cleanups.length) {
        cleanups.pop()?.();
      }
    };

    const retryLater = (delayMs: number) => {
      const timer = window.setTimeout(open, delayMs);
      cleanups.push(() => window.clearTimeout(timer));
    };

    function open() {
      if (isDisposed) {
        return;
      }

      const elapsedMs = performance.now();

      if (elapsedMs < openFloorMs) {
        retryLater(openFloorMs - elapsedMs + 100);
        return;
      }

      if (document.visibilityState === "hidden" || isOverlayOpen()) {
        retryLater(retryMs);
        return;
      }

      dispose();
      writeStorageItem(sessionStore, sitePopupSessionKey, config.campaignId);
      setState({ isOpen: true, variant: config.variant, isPreview: false });
    }

    if (config.trigger.delayMs > 0) {
      retryLater(config.trigger.delayMs);
    }

    if (config.trigger.scrollDepth > 0) {
      const handleScroll = () => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;

        if (scrollable <= 0) {
          return;
        }

        if (window.scrollY / scrollable >= config.trigger.scrollDepth) {
          open();
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      cleanups.push(() =>
        window.removeEventListener("scroll", handleScroll),
      );
    }

    if (
      config.trigger.exitIntent &&
      window.matchMedia("(pointer: fine)").matches
    ) {
      const handleMouseOut = (event: MouseEvent) => {
        if (event.relatedTarget || event.clientY > 0) {
          return;
        }

        open();
      };

      document.addEventListener("mouseout", handleMouseOut);
      cleanups.push(() =>
        document.removeEventListener("mouseout", handleMouseOut),
      );
    }

    return dispose;
  }, [config]);

  return { ...state, close, handleSubscribed };
}
