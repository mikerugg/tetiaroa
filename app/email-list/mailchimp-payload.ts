import type { EmailListFieldValues } from "./validation";

export type EmailListSignupEvidence = {
  ipAddress?: string;
};

export function buildMailchimpSubscribePayload(
  { email, language }: EmailListFieldValues,
  { ipAddress }: EmailListSignupEvidence,
) {
  return {
    email_address: email,
    language,
    status: "subscribed",
    status_if_new: "subscribed",
    ...(ipAddress ? { ip_opt: ipAddress } : {}),
  };
}
