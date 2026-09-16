import type { GuideLocale } from "../../lib/atoll/types";

const STORAGE_KEY = "tetiaroa-guide-browse";
const PENDING_KEY = "tetiaroa-guide-return";
const HISTORY_KEY = "atollGuideBrowse";
const MAX_AGE = 24 * 60 * 60 * 1000;

export type GuideBrowseState = {
  url: string;
  profileHref: string;
  scrollY: number;
  savedAt: number;
};

export function safeGuideBrowseUrl(value: unknown, locale: GuideLocale) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.length > 4096) return null;
  const url = new URL(value, "https://guide.invalid");
  const prefix = locale === "fr" ? "/fr/island" : "/island";
  const allowed = [prefix, ...["guide", "birds", "plants", "fish", "turtles", "marine-mammals", "invertebrates"].map((suffix) => `${prefix}/${suffix}`)];
  if (url.origin !== "https://guide.invalid" || !allowed.includes(url.pathname) || url.hash) return null;
  // Sessions saved before the gateway cutover still point at the old root directory.
  return `${url.pathname === prefix ? `${prefix}/guide` : url.pathname}${url.search}`;
}

export function parseGuideBrowseState(value: string | null, locale: GuideLocale, now = Date.now()): GuideBrowseState | null {
  if (!value) return null;
  try {
    const record = JSON.parse(value) as Partial<GuideBrowseState>;
    const url = safeGuideBrowseUrl(record.url, locale);
    const prefix = locale === "fr" ? "/fr/island/" : "/island/";
    if (!url || typeof record.profileHref !== "string" || !record.profileHref.startsWith(prefix) || !Number.isFinite(record.scrollY) || (record.scrollY ?? -1) < 0 || !Number.isFinite(record.savedAt) || now - (record.savedAt ?? 0) > MAX_AGE || (record.savedAt ?? Infinity) > now) return null;
    return { url, profileHref: record.profileHref, scrollY: record.scrollY as number, savedAt: record.savedAt as number };
  } catch { return null; }
}

export function getGuideBrowseState(locale: GuideLocale) {
  try { return parseGuideBrowseState(window.sessionStorage.getItem(`${STORAGE_KEY}:${locale}`), locale); }
  catch { return null; }
}

export function saveGuideBrowseState(profileHref: string, locale: GuideLocale) {
  const url = safeGuideBrowseUrl(`${window.location.pathname}${window.location.search}`, locale);
  if (!url) return;
  const record: GuideBrowseState = { url, profileHref: new URL(profileHref, window.location.origin).pathname, scrollY: window.scrollY, savedAt: Date.now() };
  try {
    window.sessionStorage.setItem(`${STORAGE_KEY}:${locale}`, JSON.stringify(record));
    window.history.replaceState({ ...window.history.state, [HISTORY_KEY]: record.savedAt }, "");
  } catch { /* Navigation still works when browser storage is unavailable. */ }
}

export function prepareGuideBrowseReturn(record: GuideBrowseState) {
  try { window.sessionStorage.setItem(PENDING_KEY, String(record.savedAt)); }
  catch { /* The destination URL remains a complete fallback. */ }
}

export function restoreGuideBrowsePosition(locale: GuideLocale) {
  const record = getGuideBrowseState(locale);
  if (!record || record.url !== `${window.location.pathname}${window.location.search}`) return;
  let pending = false;
  try { pending = window.sessionStorage.getItem(PENDING_KEY) === String(record.savedAt); }
  catch { /* History state can still restore a browser-back navigation. */ }
  if (!pending && window.history.state?.[HISTORY_KEY] !== record.savedAt) return;
  let restoreFrame: number | undefined;
  const frame = requestAnimationFrame(() => { restoreFrame = requestAnimationFrame(() => {
    window.scrollTo({ top: record.scrollY, behavior: "instant" });
    try { window.sessionStorage.removeItem(PENDING_KEY); } catch { /* Storage is optional. */ }
  }); });
  return () => { cancelAnimationFrame(frame); if (restoreFrame !== undefined) cancelAnimationFrame(restoreFrame); };
}
