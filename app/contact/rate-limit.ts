import "server-only";

import { createHmac } from "node:crypto";
import { getCache, type RuntimeCache } from "@vercel/functions";

const attemptLimit = 5;
const windowSeconds = 10 * 60;

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

let runtimeCache: RuntimeCache | null = null;

function getRuntimeCache() {
  if (!runtimeCache) {
    runtimeCache = getCache({ namespace: "contact-form-rate-limit" });
  }

  return runtimeCache;
}

function isRateLimitRecord(value: unknown): value is RateLimitRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<RateLimitRecord>;

  return (
    Number.isInteger(record.count) &&
    typeof record.resetAt === "number" &&
    Number.isFinite(record.resetAt)
  );
}

function getIpKey(ip: string) {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();

  if (!secret) {
    throw new Error("CONTACT_FORM_SECRET is required for contact rate limiting.");
  }

  return createHmac("sha256", secret).update(ip).digest("hex");
}

export async function isContactSubmissionAllowed(ip?: string) {
  if (!ip) {
    return true;
  }

  try {
    const cache = getRuntimeCache();
    const key = getIpKey(ip);
    const now = Date.now();
    const cached = await cache.get(key);
    const record = isRateLimitRecord(cached) ? cached : null;

    if (!record || record.resetAt <= now) {
      await cache.set(
        key,
        { count: 1, resetAt: now + windowSeconds * 1000 },
        { ttl: windowSeconds, name: "contact-form-attempts" },
      );

      return true;
    }

    if (record.count >= attemptLimit) {
      return false;
    }

    await cache.set(
      key,
      { ...record, count: record.count + 1 },
      {
        ttl: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
        name: "contact-form-attempts",
      },
    );

    return true;
  } catch (error) {
    console.error("Contact form rate limit check failed open.", error);
    return true;
  }
}
