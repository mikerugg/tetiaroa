import "server-only";

import { escapeHtml, sendGraphMail } from "@/app/contact/mailer";
import {
  getOptionLabel,
  partySizeOptions,
  projectTypeOptions,
  roleOptions,
  type StationApplicationValues,
} from "./validation";

type StationApplicationEmail = {
  stationName: string;
  values: StationApplicationValues;
};

function row(label: string, value: string) {
  return `<tr><td style="width:180px;padding:0 16px 14px 0;vertical-align:top;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b7b75;">${escapeHtml(
    label,
  )}</td><td style="padding:0 0 14px;font-size:16px;line-height:1.5;color:#1f2925;">${value}</td></tr>`;
}

function formatDates(values: StationApplicationValues) {
  if (values.arrival && values.departure) {
    return `${values.arrival} to ${values.departure}`;
  }

  return values.arrival || values.departure || "Not given yet";
}

function buildHtmlMessage({ stationName, values }: StationApplicationEmail) {
  const safeEmail = escapeHtml(values.email);
  const summary = escapeHtml(values.summary).replace(/\n/g, "<br>");

  return [
    '<div style="margin:0;background-color:#f4f6f5;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1f2925;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;max-width:640px;background-color:#ffffff;border:1px solid #dfe5e2;border-radius:12px;">',
    '<tr><td style="padding:32px 32px 24px;border-bottom:1px solid #e7ebe9;">',
    '<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#537065;">Tetiaroa Society</p>',
    '<h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:600;color:#16241f;">Field Station Enquiry</h1>',
    `<p style="margin:10px 0 0;font-size:15px;color:#537065;">${escapeHtml(stationName)}</p>`,
    "</td></tr>",
    '<tr><td style="padding:28px 32px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    row("Name", escapeHtml(values.name)),
    row(
      "Email",
      `<a href="mailto:${safeEmail}" style="color:#176b52;text-decoration:underline;">${safeEmail}</a>`,
    ),
    row("Institution", escapeHtml(values.institution)),
    row("Role", escapeHtml(getOptionLabel(roleOptions, values.role))),
    row("Project title", escapeHtml(values.projectTitle)),
    row(
      "Project type",
      escapeHtml(getOptionLabel(projectTypeOptions, values.projectType)),
    ),
    row("Proposed dates", escapeHtml(formatDates(values))),
    row(
      "Party size",
      escapeHtml(getOptionLabel(partySizeOptions, values.partySize)),
    ),
    "</table>",
    '<div style="margin-top:28px;padding:22px 24px;background-color:#f4f7f5;border-left:4px solid #2f7d65;border-radius:4px;">',
    '<p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#537065;">Project summary</p>',
    `<div style="font-size:16px;line-height:1.65;color:#1f2925;">${summary}</div>`,
    "</div>",
    '<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7b75;">The applicant confirmed they understand the three-to-six month lead time, the Scientific Advisory Board sponsorship requirement, and the full-funding requirement.</p>',
    "</td></tr>",
    "</table>",
    "</div>",
  ].join("");
}

export async function sendStationApplication(email: StationApplicationEmail) {
  await sendGraphMail({
    subject: `Field Station Enquiry — ${email.stationName} — ${email.values.name}`,
    html: buildHtmlMessage(email),
    replyTo: { address: email.values.email, name: email.values.name },
  });
}
