import assert from "node:assert/strict";
import test from "node:test";
import { getRorDataCiteUrl } from "./ror.ts";

test("ROR identifiers become canonical DataCite Commons URLs", () => {
  assert.equal(
    getRorDataCiteUrl("https://ror.org/01an7q238"),
    "https://commons.datacite.org/ror.org/01an7q238",
  );
  assert.equal(
    getRorDataCiteUrl("https://commons.datacite.org/ror.org/00CZ47042/"),
    "https://commons.datacite.org/ror.org/00cz47042",
  );
});

test("invalid ROR identifiers do not become outbound links", () => {
  assert.equal(getRorDataCiteUrl("https://example.com/01an7q238"), undefined);
  assert.equal(getRorDataCiteUrl("not-a-ror"), undefined);
  assert.equal(getRorDataCiteUrl(undefined), undefined);
});
