import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import type { ContactFieldValues } from "./validation";

let transporter: Transporter | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required to send contact form email.`);
  }

  return value;
}

function getSmtpPort() {
  const port = Number(getRequiredEnv("SMTP_PORT"));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  return port;
}

function getTransporter() {
  if (!transporter) {
    const port = getSmtpPort();

    transporter = nodemailer.createTransport({
      host: getRequiredEnv("SMTP_HOST"),
      port,
      secure: port === 465,
      auth: {
        user: getRequiredEnv("SMTP_USER"),
        pass: getRequiredEnv("SMTP_PASSWORD"),
      },
    });
  }

  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildTextMessage({ name, email, subject, message }: ContactFieldValues) {
  return [
    "New contact message from tetiaroasociety.org",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");
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

export async function sendContactMessage(values: ContactFieldValues) {
  const from = process.env.SMTP_FROM?.trim() || getRequiredEnv("SMTP_USER");
  const to = getRequiredEnv("SMTP_TO");

  await getTransporter().sendMail({
    from,
    to,
    replyTo: values.email,
    subject: `Tetiaroa Society contact: ${values.subject}`,
    text: buildTextMessage(values),
    html: buildHtmlMessage(values),
  });
}
