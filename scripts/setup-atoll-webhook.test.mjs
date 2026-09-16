import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { desiredWebhook, planWebhook, applyWebhookPlan, testEndpoint, validateEndpoint, WEBHOOK_FILTER, WEBHOOK_PROJECTION } from "./setup-atoll-webhook.mjs";

const desired = desiredWebhook({ url: "https://example.com/api/revalidate", dataset: "production", secret: "test-only-secret" });

test("guide and related Impact changes trigger on create/update/delete and retain deleted routes", async () => {
  const require = createRequire(import.meta.url);
  const { parse, evaluate } = createRequire(require.resolve("sanity"))("groq-js");
  const filter = parse(WEBHOOK_FILTER, { mode: "delta" });
  const projection = parse(WEBHOOK_PROJECTION, { mode: "delta" });
  for (const _type of ["speciesGuide", "atollCategory", "atollHub", "impactEntry"]) {
    const document = { _id: `${_type}-example`, _type, slug: { current: "example" }, category: "birds", english: { slug: { current: "english" } }, french: { slug: { current: "francais" } } };
    for (const delta of [{ before: null, after: document }, { before: document, after: document }, { before: document, after: null }]) {
      assert.equal(await (await evaluate(filter, delta)).get(), true);
      assert.deepEqual(await (await evaluate(projection, delta)).get(), document);
    }
  }
  assert.equal(await (await evaluate(filter, { before: null, after: { _type: "unrelated" } })).get(), false);
});

test("hook plan preserves Impact hooks and a second import creates no duplicates", async () => {
  const impact = { id: "impact", name: "Impact publishing" };
  const hooks = [impact];
  const requests = [];
  const request = async (path, options) => {
    requests.push({ path, method: options.method });
    const hook = { ...JSON.parse(options.body), id: "guide" };
    hooks.push(hook);
    return hook;
  };
  await applyWebhookPlan({ plan: planWebhook(hooks, desired), desired, request });
  await applyWebhookPlan({ plan: planWebhook(hooks, desired), desired, request });
  assert.equal(hooks[0], impact);
  assert.equal(hooks.length, 2);
  assert.deepEqual(requests, [{ path: "", method: "POST" }]);
});

test("status changes patch only the dedicated hook and never rotate secrets", async () => {
  const existing = { ...desired, id: "guide", isDisabledByUser: true, secret: "remote-secret" };
  const plan = planWebhook([existing], desired);
  assert.equal(plan.action, "toggle");
  await applyWebhookPlan({ plan, desired, request: async (path, options) => {
    assert.equal(path, "/guide");
    assert.equal(options.method, "PATCH");
    assert.deepEqual(JSON.parse(options.body), { isDisabledByUser: false });
  } });
});

test("configuration drift and duplicate dedicated hooks prevent writes", async () => {
  const existing = { ...desired, id: "guide", url: "https://different.example/api/revalidate" };
  let called = false;
  await assert.rejects(applyWebhookPlan({ plan: planWebhook([existing], desired), desired, request: async () => { called = true; } }), /differs in: url/);
  assert.equal(called, false);
  assert.throws(() => planWebhook([existing, existing], desired), /Multiple Atoll Guide/);
});

test("endpoint validation prevents secrets in URLs and remote HTTP", () => {
  assert.equal(validateEndpoint("https://example.com/api/revalidate"), "https://example.com/api/revalidate");
  assert.equal(validateEndpoint("http://localhost:3298/api/revalidate", true), "http://localhost:3298/api/revalidate");
  for (const url of ["https://example.com/api/revalidate?secret=value", "https://user:secret@example.com/api/revalidate", "http://example.com/api/revalidate", "https://example.com/another-path"]) {
    assert.throws(() => validateEndpoint(url));
  }
});

test("endpoint verification sends valid Sanity signatures for each type and checks rejection", async () => {
  const require = createRequire(import.meta.url);
  const { isValidSignature, SIGNATURE_HEADER_NAME } = createRequire(require.resolve("next-sanity/webhook"))("@sanity/webhook");
  const types = [];
  const checks = await testEndpoint(desired.url, desired.secret, async (url, options) => {
    assert.equal(url, desired.url);
    const valid = await isValidSignature(options.body, options.headers[SIGNATURE_HEADER_NAME], desired.secret);
    if (!valid) return Response.json({ message: "Invalid signature" }, { status: 401 });
    const type = JSON.parse(options.body)._type;
    types.push(type);
    return Response.json({ revalidated: true, type });
  });
  assert.deepEqual(types, ["speciesGuide", "atollCategory", "atollHub"]);
  assert.deepEqual(checks.map((check) => check.status), [200, 200, 200, 401]);
});
