import assert from "node:assert/strict";
import test from "node:test";

const {
  createSitePopupRecord,
  getSitePopupStorageKey,
  isSitePopupSuppressed,
  parseSitePopupOverride,
  parseSitePopupRecord,
} = await import(new URL("./site-popup-storage.ts", import.meta.url).href);

const { resolveSitePopupSwitch } = await import(
  new URL("./site-popup-config.ts", import.meta.url).href
);

const frequency = {
  dismissedDays: 30,
  subscribedDays: 365,
  oncePerSession: true,
};

const now = Date.UTC(2026, 0, 1);
const dayMs = 24 * 60 * 60 * 1000;

test("namespaces stored state by campaign", () => {
  assert.notEqual(
    getSitePopupStorageKey("2026-email-list"),
    getSitePopupStorageKey("2026-year-end-match"),
  );
});

test("holds a dismissal for the configured window", () => {
  const record = createSitePopupRecord("dismissed", frequency, now);

  assert.equal(record.until, now + 30 * dayMs);
  assert.equal(isSitePopupSuppressed(record, now + 29 * dayMs), true);
  assert.equal(isSitePopupSuppressed(record, now + 31 * dayMs), false);
});

test("holds a signup far longer than a dismissal", () => {
  const dismissed = createSitePopupRecord("dismissed", frequency, now);
  const subscribed = createSitePopupRecord("subscribed", frequency, now);

  assert.ok(subscribed.until > dismissed.until);
  assert.equal(isSitePopupSuppressed(subscribed, now + 300 * dayMs), true);
});

test("survives a round trip through storage", () => {
  const record = createSitePopupRecord("subscribed", frequency, now);

  assert.deepEqual(parseSitePopupRecord(JSON.stringify(record)), record);
});

test("treats missing or damaged storage as never shown", () => {
  for (const raw of [
    null,
    undefined,
    "",
    "not json",
    "{}",
    '{"reason":"dismissed"}',
    '{"reason":"nope","until":123}',
    '{"reason":"dismissed","until":"soon"}',
  ]) {
    assert.equal(parseSitePopupRecord(raw), null);
    assert.equal(isSitePopupSuppressed(parseSitePopupRecord(raw), now), false);
  }
});

test("reads the popup query overrides used for QA", () => {
  assert.deepEqual(parseSitePopupOverride(""), { mode: "default" });
  assert.deepEqual(parseSitePopupOverride("?utm_source=x"), {
    mode: "default",
  });
  assert.deepEqual(parseSitePopupOverride("?popup=off"), { mode: "disabled" });
  assert.deepEqual(parseSitePopupOverride("?popup=reset"), { mode: "reset" });
  assert.deepEqual(parseSitePopupOverride("?popup=preview"), {
    mode: "forced",
  });
  assert.deepEqual(parseSitePopupOverride("?popup=ANNOUNCEMENT"), {
    mode: "forced",
    variant: "announcement",
  });
  assert.deepEqual(parseSitePopupOverride("?popup=newsletter"), {
    mode: "forced",
    variant: "newsletter",
  });
  assert.deepEqual(parseSitePopupOverride("?popup=whatever"), {
    mode: "default",
  });
});

test("lets the environment switch override the config flag", () => {
  assert.equal(resolveSitePopupSwitch(undefined, true), true);
  assert.equal(resolveSitePopupSwitch("", true), true);
  assert.equal(resolveSitePopupSwitch("off", true), false);
  assert.equal(resolveSitePopupSwitch("FALSE", true), false);
  assert.equal(resolveSitePopupSwitch("on", false), true);
  assert.equal(resolveSitePopupSwitch("1", false), true);
  assert.equal(resolveSitePopupSwitch("maybe", false), false);
});
