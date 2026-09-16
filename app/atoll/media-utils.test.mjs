import assert from "node:assert/strict";
import test from "node:test";
import { getGuideVideoSource, safeGuideHref } from "./media-utils.ts";

test("resolved SproutVideo embeds retain their video token and query", () => {
  const url = "https://videos.sproutvideo.com/embed/ab1234/cd5678?type=sd";
  assert.deepEqual(getGuideVideoSource(url), { kind: "iframe", url });
  assert.equal(getGuideVideoSource("https://videos.sproutvideo.com.evil.test/embed/ab1234/cd5678"), null);
});

test("YouTube links normalize to the privacy-enhanced player", () => {
  const expected = { kind: "iframe", url: "https://www.youtube-nocookie.com/embed/clip_123" };
  for (const url of ["https://youtu.be/clip_123", "https://www.youtube.com/watch?v=clip_123", "https://www.youtube.com/embed/clip_123"]) assert.deepEqual(getGuideVideoSource(url), expected);
});

test("Vimeo and direct video files use the correct player", () => {
  assert.deepEqual(getGuideVideoSource("https://vimeo.com/12345"), { kind: "iframe", url: "https://player.vimeo.com/video/12345" });
  assert.deepEqual(getGuideVideoSource("/atoll/reef.mp4"), { kind: "video", url: "/atoll/reef.mp4" });
});

test("unsafe or unknown iframe sources cannot become embeds", () => {
  for (const value of ["javascript:alert(1)", "data:text/html,test", "https://example.org/unknown", "https://www.tetiaroasociety.org/media/42"]) assert.equal(getGuideVideoSource(value), null);
  assert.equal(safeGuideHref("javascript:alert(1)"), undefined);
  assert.equal(safeGuideHref("//example.org/file"), undefined);
  assert.equal(safeGuideHref("/\\example.org/file"), undefined);
  assert.equal(safeGuideHref("/island"), "/island");
});
