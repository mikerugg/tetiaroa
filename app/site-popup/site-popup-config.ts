export type SitePopupVariant = "newsletter" | "announcement";

export type SitePopupTriggerConfig = {
  /** Time on page before the popup may open. Set to 0 to disable this trigger. */
  delayMs: number;
  /** Share of the page read before the popup may open, 0-1. Set to 0 to disable. */
  scrollDepth: number;
  /** Open when a mouse pointer leaves through the top of the window. */
  exitIntent: boolean;
};

export type SitePopupFrequencyConfig = {
  /** How long a dismissal is respected. */
  dismissedDays: number;
  /** How long a successful signup is respected. */
  subscribedDays: number;
  /** Never open twice in the same browser session. */
  oncePerSession: boolean;
};

export type SitePopupConfig = {
  enabled: boolean;
  /** Which panel opens. Copy for both variants lives in `site-popup-copy.ts`. */
  variant: SitePopupVariant;
  /**
   * Namespaces the "already seen this" storage. Bump it when the campaign
   * changes so people who dismissed the last one can see the new one.
   */
  campaignId: string;
  trigger: SitePopupTriggerConfig;
  frequency: SitePopupFrequencyConfig;
};

/**
 * The homepage popup, start to finish.
 *
 * Turn it off by setting `enabled: false` here, or without touching code by
 * setting `NEXT_PUBLIC_SITE_POPUP=off` and redeploying. Switch campaigns by
 * changing `variant` and bumping `campaignId`.
 */
export const sitePopupConfig: SitePopupConfig = {
  enabled: true,
  variant: "newsletter",
  campaignId: "2026-email-list",
  trigger: {
    delayMs: 18_000,
    scrollDepth: 0.4,
    exitIntent: true,
  },
  frequency: {
    dismissedDays: 30,
    subscribedDays: 365,
    oncePerSession: true,
  },
};

const offValues = new Set(["off", "false", "0", "disabled", "no"]);
const onValues = new Set(["on", "true", "1", "enabled", "yes"]);

export function resolveSitePopupSwitch(
  value: string | undefined,
  fallback: boolean,
) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (offValues.has(normalized)) {
    return false;
  }

  if (onValues.has(normalized)) {
    return true;
  }

  return fallback;
}

export function isSitePopupEnabled(config: SitePopupConfig = sitePopupConfig) {
  return resolveSitePopupSwitch(
    process.env.NEXT_PUBLIC_SITE_POPUP,
    config.enabled,
  );
}
