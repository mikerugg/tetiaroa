import "server-only";

import { createHash } from "node:crypto";
import {
  buildMailchimpSubscribePayload,
  type EmailListSignupEvidence,
} from "./mailchimp-payload";
import type { EmailListFieldValues } from "./validation";

type MailchimpMember = {
  status?: string;
};

type MailchimpError = {
  detail?: string;
  title?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for email-list subscriptions.`);
  }

  return value;
}

function getMailchimpConfig() {
  const apiKey = getRequiredEnv("MAILCHIMP_API_KEY");
  const audienceId = getRequiredEnv("MAILCHIMP_AUDIENCE_ID");
  const serverPrefix =
    process.env.MAILCHIMP_SERVER_PREFIX?.trim() || apiKey.match(/-([a-z\d]+)$/i)?.[1];

  if (!serverPrefix) {
    throw new Error(
      "MAILCHIMP_SERVER_PREFIX is required when it cannot be derived from MAILCHIMP_API_KEY.",
    );
  }

  return { apiKey, audienceId, serverPrefix };
}

function getSubscriberHash(email: string) {
  return createHash("md5").update(email.toLowerCase()).digest("hex");
}

async function getMailchimpError(response: Response) {
  try {
    const body = (await response.json()) as MailchimpError;
    return [body.title, body.detail].filter(Boolean).join(": ");
  } catch {
    return "Mailchimp returned an unreadable error response.";
  }
}

async function requestMailchimpMember(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(`tetiaroa:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await getMailchimpError(response);
    throw new Error(`Mailchimp member update failed (${response.status}): ${detail}`);
  }

  return (await response.json()) as MailchimpMember;
}

export async function subscribeEmailListContact({
  email,
  language,
}: EmailListFieldValues, {
  ipAddress,
}: EmailListSignupEvidence): Promise<void> {
  const { apiKey, audienceId, serverPrefix } = getMailchimpConfig();
  const subscriberHash = getSubscriberHash(email);
  const memberUrl = `https://${encodeURIComponent(serverPrefix)}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${subscriberHash}`;
  const member = await requestMailchimpMember(
    memberUrl,
    apiKey,
    buildMailchimpSubscribePayload(
      { consent: true, email, language },
      { ipAddress },
    ),
  );

  if (member.status === "subscribed") {
    return;
  }

  throw new Error(
    `Mailchimp did not accept the email-list subscription (status: ${member.status ?? "unknown"}).`,
  );
}
