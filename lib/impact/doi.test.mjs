import assert from "node:assert/strict";
import test from "node:test";
import {
  getDoiIdentifier,
  normalizeDoiUrl,
  validateDoiUrl,
} from "./doi.ts";

test("DOI URL validation accepts canonical resolver URLs", () => {
  assert.equal(validateDoiUrl("https://doi.org/10.1234/example"), true);
  assert.equal(
    validateDoiUrl("http://doi.org/10.1002/(SICI)1099-0844"),
    true,
  );
});

test("DOI URL validation allows an empty optional value", () => {
  assert.equal(validateDoiUrl(undefined), true);
  assert.equal(validateDoiUrl(null), true);
  assert.equal(validateDoiUrl(""), true);
});

test("DOI URL validation rejects malformed and non-resolver values", () => {
  assert.equal(typeof validateDoiUrl("10.1234/example"), "string");
  assert.equal(
    typeof validateDoiUrl("https://example.com/10.1234/example"),
    "string",
  );
  assert.equal(
    typeof validateDoiUrl("https://doi.org/not-a-doi"),
    "string",
  );
  assert.equal(typeof validateDoiUrl("https://doi.org/10.123/example"), "string");
  assert.equal(typeof validateDoiUrl("https://doi.org/10.1234/"), "string");
  assert.equal(
    typeof validateDoiUrl("https://doi.org/10.1234/example?source=test"),
    "string",
  );
});

test("DOI normalization preserves valid URLs and omits invalid values", () => {
  const doiUrl = "https://doi.org/10.1234/example";

  assert.equal(normalizeDoiUrl(doiUrl), doiUrl);
  assert.equal(normalizeDoiUrl("https://example.com/article"), undefined);
  assert.equal(normalizeDoiUrl(null), undefined);
});

test("DOI identifiers are derived from resolver URLs for display", () => {
  assert.equal(
    getDoiIdentifier("https://doi.org/10.1234/example%2Fpart"),
    "10.1234/example/part",
  );
});
