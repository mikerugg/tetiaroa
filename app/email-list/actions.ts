"use server";

import { isIP } from "node:net";
import { headers } from "next/headers";
import { verifyRenderToken } from "../contact/timing-token";
import { verifyTurnstileToken } from "../contact/turnstile";
import { subscribeEmailListContact } from "./mailchimp";
import type {
  EmailListFormCopy,
  EmailListLocale,
} from "./email-list-route-copy";
import { emailListRouteCopy } from "./email-list-route-copy";
import { isEmailListSubmissionAllowed } from "./rate-limit";
import {
  type EmailListFormState,
  validateEmailListFields,
} from "./validation";

function getLocaleCopy(locale: EmailListLocale) {
  return emailListRouteCopy[locale === "fr" ? "fr" : "en"].form;
}

function errorState(copy: EmailListFormCopy): EmailListFormState {
  return {
    status: "error",
    fieldErrors: {},
    alert: { title: copy.errorTitle, description: copy.genericError },
  };
}

function getTrimmedFormValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function getRemoteIp() {
  const incomingHeaders = await headers();
  const vercelIp = incomingHeaders.get("x-vercel-forwarded-for")?.trim();

  const forwardedIp = vercelIp
    ? vercelIp.split(",").at(0)?.trim()
    : incomingHeaders.get("x-forwarded-for")?.split(",").at(0)?.trim();

  return forwardedIp && isIP(forwardedIp) ? forwardedIp : undefined;
}

export async function submitEmailListForm(
  locale: EmailListLocale,
  _prevState: EmailListFormState,
  formData: FormData,
): Promise<EmailListFormState> {
  const copy = getLocaleCopy(locale);

  if (getTrimmedFormValue(formData, "company")) {
    return {
      status: "success",
      fieldErrors: {},
      alert: {
        title: copy.successTitle,
        description: copy.successMessage,
      },
    };
  }

  const renderTokenResult = verifyRenderToken(formData.get("renderToken"));

  if (!renderTokenResult.ok) {
    console.warn("Email-list form render token rejected.", {
      reason: renderTokenResult.reason,
    });
    return errorState(copy);
  }

  const validation = validateEmailListFields(formData, copy.validation);

  if (validation.hasErrors) {
    return {
      status: "idle",
      fieldErrors: validation.fieldErrors,
    };
  }

  const remoteIp = await getRemoteIp();

  if (!(await isEmailListSubmissionAllowed(remoteIp))) {
    console.warn("Email-list form submission rate limit exceeded.");
    return errorState(copy);
  }

  const turnstileOk = await verifyTurnstileToken(
    formData.get("cf-turnstile-response"),
    remoteIp,
  );

  if (!turnstileOk) {
    console.warn("Email-list form Turnstile verification failed.");
    return errorState(copy);
  }

  try {
    await subscribeEmailListContact(validation.values, {
      ipAddress: remoteIp,
    });

    return {
      status: "success",
      fieldErrors: {},
      alert: {
        title: copy.successTitle,
        description: copy.successMessage,
      },
    };
  } catch (error) {
    console.error("Mailchimp email-list subscription failed.", error);
    return errorState(copy);
  }
}
