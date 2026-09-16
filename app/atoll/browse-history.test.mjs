import assert from "node:assert/strict";
import test from "node:test";
import { parseGuideBrowseState, safeGuideBrowseUrl } from "./browse-history.ts";

test("return destinations stay within browsing pages in the same language", () => {
  assert.equal(safeGuideBrowseUrl("/island/guide?q=tern&page=2", "en"), "/island/guide?q=tern&page=2");
  assert.equal(safeGuideBrowseUrl("/fr/island/plants?habitat=motu-shore", "fr"), "/fr/island/plants?habitat=motu-shore");
  assert.equal(safeGuideBrowseUrl("/island?q=tern&page=2", "en"), "/island/guide?q=tern&page=2");
  assert.equal(safeGuideBrowseUrl("/fr/island", "fr"), "/fr/island/guide");
  for (const value of ["https://other.example/island", "//other.example/island", "/\\other.example/island", "/fr/island", "/island/geology", "/island/birds/tern", "/impact", "/island#unknown"]) {
    assert.equal(safeGuideBrowseUrl(value, "en"), null);
  }
});

test("saved search, page, and scroll are retained while corrupt or expired state is ignored", () => {
  const savedAt = 100000000;
  const record = { url: "/island?category=birds&q=tern&page=2", profileHref: "/island/birds/white-tern", scrollY: 1480, savedAt };
  assert.deepEqual(parseGuideBrowseState(JSON.stringify(record), "en", savedAt + 1000), { ...record, url: "/island/guide?category=birds&q=tern&page=2" });
  assert.equal(parseGuideBrowseState(JSON.stringify(record), "en", savedAt + 25 * 60 * 60 * 1000), null);
  assert.equal(parseGuideBrowseState(JSON.stringify({ ...record, scrollY: -1 }), "en", savedAt), null);
  assert.equal(parseGuideBrowseState(JSON.stringify({ ...record, url: "//other.example" }), "en", savedAt), null);
  assert.equal(parseGuideBrowseState("not-json", "en", savedAt), null);
});
