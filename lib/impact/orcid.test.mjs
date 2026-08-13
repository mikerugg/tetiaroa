import assert from "node:assert/strict";
import test from "node:test";
import { getOrcidIdentifier, normalizeOrcidUrl } from "./orcid.ts";

test("ORCID identifiers are normalized into canonical profile URLs", () => {
  assert.equal(
    normalizeOrcidUrl("0000-0002-1825-0097"),
    "https://orcid.org/0000-0002-1825-0097",
  );
  assert.equal(
    normalizeOrcidUrl("http://orcid.org/0000-0002-1694-233X"),
    "https://orcid.org/0000-0002-1694-233X",
  );
  assert.equal(
    getOrcidIdentifier("ORCID: 0009-0001-9026-1241"),
    "0009-0001-9026-1241",
  );
});

test("malformed identifiers do not become outbound links", () => {
  assert.equal(normalizeOrcidUrl("0000-0002-1825-0098"), undefined);
  assert.equal(normalizeOrcidUrl("https://example.com/0000-0002-1825-0097"), undefined);
  assert.equal(normalizeOrcidUrl("not-an-orcid"), undefined);
  assert.equal(normalizeOrcidUrl(undefined), undefined);
});
