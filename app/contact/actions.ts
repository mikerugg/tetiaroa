"use server";

import { headers } from "next/headers";

import {
  contactRouteCopy,
  type ContactLocale,
  type ContactFormCopy,
} from "./contact-route-copy";
import { sendContactMessage } from "./mailer";
import { isContactSubmissionAllowed } from "./rate-limit";
import { verifyRenderToken } from "./timing-token";
import { verifyTurnstileToken } from "./turnstile";
import {
  type ContactFormState,
  validateContactFields,
} from "./validation";

function getLocaleCopy(locale: ContactLocale) {
  return contactRouteCopy[locale === "fr" ? "fr" : "en"].form;
}

function successState(copy: ContactFormCopy): ContactFormState {
  return {
    status: "success",
    fieldErrors: {},
    alert: {
      title: copy.successTitle,
      description: copy.successMessage,
    },
  };
}

function errorState(copy: ContactFormCopy): ContactFormState {
  return {
    status: "error",
    fieldErrors: {},
    alert: {
      title: copy.errorTitle,
      description: copy.genericError,
    },
  };
}

function getTrimmedFormValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

async function getRemoteIp() {
  const incomingHeaders = await headers();
  const vercelIp = incomingHeaders.get("x-vercel-forwarded-for")?.trim();

  if (vercelIp) {
    return vercelIp.split(",").at(0)?.trim();
  }

  return incomingHeaders
    .get("x-forwarded-for")
    ?.split(",")
    .at(0)
    ?.trim();
}

export async function submitContactForm(
  locale: ContactLocale,
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const copy = getLocaleCopy(locale);

  if (getTrimmedFormValue(formData, "company")) {
    return successState(copy);
  }

  const renderTokenResult = verifyRenderToken(formData.get("renderToken"));

  if (!renderTokenResult.ok) {
    console.warn("Contact form render token rejected.", {
      reason: renderTokenResult.reason,
    });

    return errorState(copy);
  }

  const validation = validateContactFields(formData, copy.validation);

  if (validation.hasErrors) {
    return {
      status: "idle",
      fieldErrors: validation.fieldErrors,
    };
  }

  const remoteIp = await getRemoteIp();

  if (!(await isContactSubmissionAllowed(remoteIp))) {
    console.warn("Contact form submission rate limit exceeded.");

    return errorState(copy);
  }

  const turnstileOk = await verifyTurnstileToken(
    formData.get("cf-turnstile-response"),
    remoteIp,
  );

  if (!turnstileOk) {
    console.warn("Contact form Turnstile verification failed.");

    return errorState(copy);
  }

  try {
    await sendContactMessage(validation.values);

    return successState(copy);
  } catch (error) {
    console.error("Contact form email delivery failed.", error);

    return errorState(copy);
  }
}
