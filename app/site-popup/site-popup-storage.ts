import type {
  SitePopupFrequencyConfig,
  SitePopupVariant,
} from "./site-popup-config";

const dayMs = 24 * 60 * 60 * 1000;

export const sitePopupSessionKey = "tetiaroa:site-popup-shown";

export type SitePopupSuppressionReason = "dismissed" | "subscribed";

export type SitePopupRecord = {
  reason: SitePopupSuppressionReason;
  /** Epoch milliseconds. The popup stays closed until this moment passes. */
  until: number;
};

export type SitePopupOverride =
  | { mode: "default" }
  | { mode: "disabled" }
  | { mode: "reset" }
  | { mode: "forced"; variant?: SitePopupVariant };

export function getSitePopupStorageKey(campaignId: string) {
  return `tetiaroa:site-popup:${campaignId}`;
}

function isSuppressionReason(
  value: unknown,
): value is SitePopupSuppressionReason {
  return value === "dismissed" || value === "subscribed";
}

/** Listing every variant here is enforced by the type: add one, handle it. */
const previewableVariants: Record<SitePopupVariant, true> = {
  newsletter: true,
  announcement: true,
};

function isSitePopupVariant(value: string): value is SitePopupVariant {
  return Object.hasOwn(previewableVariants, value);
}

export function parseSitePopupRecord(
  raw: string | null | undefined,
): SitePopupRecord | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const { reason, until } = parsed as Partial<SitePopupRecord>;

    if (!isSuppressionReason(reason) || !Number.isFinite(until)) {
      return null;
    }

    return { reason, until: until as number };
  } catch {
    return null;
  }
}

export function createSitePopupRecord(
  reason: SitePopupSuppressionReason,
  frequency: SitePopupFrequencyConfig,
  now: number,
): SitePopupRecord {
  const days =
    reason === "subscribed"
      ? frequency.subscribedDays
      : frequency.dismissedDays;

  return { reason, until: now + Math.max(0, days) * dayMs };
}

export function isSitePopupSuppressed(
  record: SitePopupRecord | null,
  now: number,
) {
  return record !== null && record.until > now;
}

/**
 * `?popup=off` silences the popup, `?popup=preview` forces it open past every
 * frequency cap, `?popup=reset` forgets this browser's history with it and
 * triggers normally, and `?popup=newsletter` / `?popup=announcement` preview a
 * specific panel. Anything else is ignored.
 */
export function parseSitePopupOverride(search: string): SitePopupOverride {
  const value = new URLSearchParams(search)
    .get("popup")
    ?.trim()
    .toLowerCase();

  if (!value) {
    return { mode: "default" };
  }

  if (value === "off" || value === "false" || value === "0") {
    return { mode: "disabled" };
  }

  if (value === "reset") {
    return { mode: "reset" };
  }

  if (isSitePopupVariant(value)) {
    return { mode: "forced", variant: value };
  }

  if (
    value === "preview" ||
    value === "on" ||
    value === "true" ||
    value === "1"
  ) {
    return { mode: "forced" };
  }

  return { mode: "default" };
}
