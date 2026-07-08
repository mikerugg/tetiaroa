import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const minimumRenderAgeMs = 2 * 1000;
const maximumRenderAgeMs = 30 * 60 * 1000;
const tokenSeparator = ".";

export type RenderTokenFailureReason =
  | "missing"
  | "malformed"
  | "invalid_timestamp"
  | "invalid_signature"
  | "too_fast"
  | "stale"
  | "missing_secret";

export type RenderTokenVerification =
  | { ok: true }
  | { ok: false; reason: RenderTokenFailureReason };

function getContactFormSecret() {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();

  if (!secret) {
    throw new Error("CONTACT_FORM_SECRET is required for the contact form.");
  }

  return secret;
}

function signTimestamp(timestamp: string) {
  return createHmac("sha256", getContactFormSecret())
    .update(timestamp)
    .digest("hex");
}

function signaturesMatch(received: string, expected: string) {
  const receivedSignature = Buffer.from(received, "hex");
  const expectedSignature = Buffer.from(expected, "hex");

  if (receivedSignature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(receivedSignature, expectedSignature);
}

export function mintRenderToken() {
  const timestamp = Date.now().toString();

  return `${timestamp}${tokenSeparator}${signTimestamp(timestamp)}`;
}

export function verifyRenderToken(token: unknown): RenderTokenVerification {
  if (typeof token !== "string" || !token) {
    return { ok: false, reason: "missing" };
  }

  const parts = token.split(tokenSeparator);

  if (parts.length !== 2) {
    return { ok: false, reason: "malformed" };
  }

  const [timestamp, signature] = parts;

  if (!/^\d+$/.test(timestamp)) {
    return { ok: false, reason: "invalid_timestamp" };
  }

  const issuedAt = Number(timestamp);

  if (!Number.isSafeInteger(issuedAt)) {
    return { ok: false, reason: "invalid_timestamp" };
  }

  let expectedSignature: string;

  try {
    expectedSignature = signTimestamp(timestamp);
  } catch {
    return { ok: false, reason: "missing_secret" };
  }

  if (!signaturesMatch(signature, expectedSignature)) {
    return { ok: false, reason: "invalid_signature" };
  }

  const elapsedMs = Date.now() - issuedAt;

  if (elapsedMs < minimumRenderAgeMs) {
    return { ok: false, reason: "too_fast" };
  }

  if (elapsedMs > maximumRenderAgeMs) {
    return { ok: false, reason: "stale" };
  }

  return { ok: true };
}
