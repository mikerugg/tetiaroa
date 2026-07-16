import assert from "node:assert/strict";
import test from "node:test";
import { impactEntryLocale } from "./impactEntryLocale.ts";

const slugField = impactEntryLocale.fields.find((field) => field.name === "slug");
const isUnique = slugField?.options?.isUnique;

test("slug uniqueness excludes every variant of the current document", async () => {
  let request;
  const result = await isUnique("crabby-3", {
    document: { _id: "versions.release-name.impact-entry-id" },
    path: ["english", "slug"],
    getClient: () => ({
      fetch: async (query, params) => {
        request = { params, query };
        return true;
      },
    }),
  });

  assert.equal(result, true);
  assert.match(request.query, /!sanity::versionOf\(\$publishedId\)/);
  assert.match(request.query, /english\.slug\.current == \$slug/);
  assert.deepEqual(request.params, {
    publishedId: "impact-entry-id",
    slug: "crabby-3",
  });
});

test("French slug uniqueness only checks French paths", async () => {
  let request;
  await isUnique("french-crabby-3", {
    document: { _id: "drafts.impact-entry-id" },
    path: ["french", "slug"],
    getClient: () => ({
      fetch: async (query, params) => {
        request = { params, query };
        return true;
      },
    }),
  });

  assert.match(request.query, /french\.slug\.current == \$slug/);
  assert.doesNotMatch(request.query, /english\.slug\.current == \$slug/);
  assert.equal(request.params.slug, "french-crabby-3");
});
