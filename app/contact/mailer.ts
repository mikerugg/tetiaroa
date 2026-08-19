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

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlMessage({ name, email, subject, message }: ContactFieldValues) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return [
    '<div style="margin:0;background-color:#f4f6f5;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1f2925;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;max-width:640px;background-color:#ffffff;border:1px solid #dfe5e2;border-radius:12px;">',
    "<tr><td style=\"padding:32px 32px 24px;border-bottom:1px solid #e7ebe9;\">",
    '<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#537065;">Tetiaroa Society</p>',
    '<h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:600;color:#16241f;">New Contact Form Submission</h1>',
    "</td></tr>",
    '<tr><td style="padding:28px 32px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    `<tr><td style="width:96px;padding:0 16px 16px 0;vertical-align:top;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b7b75;">Name</td><td style="padding:0 0 16px;font-size:16px;line-height:1.5;color:#1f2925;">${safeName}</td></tr>`,
    `<tr><td style="width:96px;padding:0 16px 16px 0;vertical-align:top;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b7b75;">Email</td><td style="padding:0 0 16px;font-size:16px;line-height:1.5;"><a href="mailto:${safeEmail}" style="color:#176b52;text-decoration:underline;">${safeEmail}</a></td></tr>`,
    `<tr><td style="width:96px;padding:0 16px 0 0;vertical-align:top;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b7b75;">Subject</td><td style="padding:0;font-size:16px;line-height:1.5;color:#1f2925;">${safeSubject}</td></tr>`,
    "</table>",
    '<div style="margin-top:28px;padding:22px 24px;background-color:#f4f7f5;border-left:4px solid #2f7d65;border-radius:4px;">',
    '<p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#537065;">Message</p>',
    `<div style="font-size:16px;line-height:1.65;color:#1f2925;">${safeMessage}</div>`,
    "</div>",
    "</td></tr>",
    "</table>",
    "</div>",
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

export type GraphMailMessage = {
  subject: string;
  html: string;
  replyTo?: { address: string; name: string };
};

/**
 * Shared Graph send path. The contact form and the field station application
 * form both post through here so the token cache and recipient list stay in
 * one place.
 */
export async function sendGraphMail({
  subject,
  html,
  replyTo,
}: GraphMailMessage) {
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
          subject,
          body: {
            contentType: "HTML",
            content: html,
          },
          toRecipients: getRecipients(),
          ...(replyTo
            ? {
                replyTo: [
                  {
                    emailAddress: { address: replyTo.address, name: replyTo.name },
                  },
                ],
              }
            : {}),
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

export async function sendContactMessage(values: ContactFieldValues) {
  await sendGraphMail({
    subject: `Tetiaroa Society Contact Form: ${values.subject}`,
    html: buildHtmlMessage(values),
    replyTo: { address: values.email, name: values.name },
  });
}
