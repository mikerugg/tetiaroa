import assert from "node:assert/strict";
import test from "node:test";

const { buildMailchimpSubscribePayload } = await import(
  new URL("./mailchimp-payload.ts", import.meta.url).href
);

test("creates a single-opt-in Mailchimp payload with consent evidence", () => {
  const payload = buildMailchimpSubscribePayload(
    { consent: true, email: "reader@example.com", language: "fr" },
    { ipAddress: "203.0.113.42" },
  );

  assert.deepEqual(payload, {
    email_address: "reader@example.com",
    language: "fr",
    status: "subscribed",
    status_if_new: "subscribed",
    ip_opt: "203.0.113.42",
  });
});

test("omits the originating IP when the request has no valid address", () => {
  const payload = buildMailchimpSubscribePayload(
    { consent: true, email: "reader@example.com", language: "en" },
    {},
  );

  assert.equal("ip_opt" in payload, false);
  assert.equal(payload.status, "subscribed");
});
