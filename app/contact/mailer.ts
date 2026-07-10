import "server-only";

import type { ContactFieldValues } from "./validation";

type GraphTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required to send contact form email.`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlMessage({ name, email, subject, message }: ContactFieldValues) {
  return [
    "<p>New contact message from tetiaroasociety.org</p>",
    "<dl>",
    `<dt>Name</dt><dd>${escapeHtml(name)}</dd>`,
    `<dt>Email</dt><dd>${escapeHtml(email)}</dd>`,
    `<dt>Subject</dt><dd>${escapeHtml(subject)}</dd>`,
    "</dl>",
    `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  ].join("");
}

function getRecipients() {
  const recipients = getRequiredEnv("SMTP_TO")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new Error("SMTP_TO must contain at least one email address.");
  }

  return recipients.map((address) => ({ emailAddress: { address } }));
}

async function getGraphAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.value;
  }

  const tenantId = getRequiredEnv("MICROSOFT_GRAPH_TENANT_ID");
  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: getRequiredEnv("MICROSOFT_GRAPH_CLIENT_ID"),
        client_secret: getRequiredEnv("MICROSOFT_GRAPH_CLIENT_SECRET"),
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Microsoft identity token request failed (${response.status}).`);
  }

  const token = (await response.json()) as GraphTokenResponse;

  if (!token.access_token) {
    throw new Error("Microsoft identity token response did not include an access token.");
  }

  const lifetimeSeconds = token.expires_in ?? 3600;
  cachedAccessToken = {
    value: token.access_token,
    expiresAt: Date.now() + Math.max(lifetimeSeconds - 300, 60) * 1000,
  };

  return token.access_token;
}

export async function sendContactMessage(values: ContactFieldValues) {
  const sender = getRequiredEnv("MICROSOFT_GRAPH_SENDER");
  const accessToken = await getGraphAccessToken();
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `Tetiaroa Society contact: ${values.subject}`,
          body: {
            contentType: "HTML",
            content: buildHtmlMessage(values),
          },
          toRecipients: getRecipients(),
          replyTo: [{ emailAddress: { address: values.email, name: values.name } }],
        },
        saveToSentItems: true,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Microsoft Graph sendMail failed (${response.status}).`);
  }
}
