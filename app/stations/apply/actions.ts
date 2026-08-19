"use server";

import { headers } from "next/headers";

import { isContactSubmissionAllowed } from "@/app/contact/rate-limit";
import { verifyRenderToken } from "@/app/contact/timing-token";
import { verifyTurnstileToken } from "@/app/contact/turnstile";
import { isStationSlug, stations, type StationSlug } from "../stations-content";
import { stationApplicationCopy } from "./apply-copy";
import { sendStationApplication } from "./mailer";
import {
  validateStationApplicationFields,
  type StationApplicationFormState,
} from "./validation";

const copy = stationApplicationCopy;

function successState(): StationApplicationFormState {
  return {
    status: "success",
    fieldErrors: {},
    alert: {
      title: copy.successTitle,
      description: copy.successMessage,
    },
  };
}

function errorState(): StationApplicationFormState {
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

  return incomingHeaders.get("x-forwarded-for")?.split(",").at(0)?.trim();
}

export async function submitStationApplication(
  slug: StationSlug,
  _prevState: StationApplicationFormState,
  formData: FormData,
): Promise<StationApplicationFormState> {
  if (!isStationSlug(slug)) {
    return errorState();
  }

  // Honeypot: bots fill it, people never see it.
  if (getTrimmedFormValue(formData, "company")) {
    return successState();
  }

  const renderTokenResult = verifyRenderToken(formData.get("renderToken"));

  if (!renderTokenResult.ok) {
    console.warn("Station application render token rejected.", {
      reason: renderTokenResult.reason,
    });

    return errorState();
  }

  const validation = validateStationApplicationFields(
    formData,
    copy.validation,
  );

  if (validation.hasErrors) {
    return {
      status: "idle",
      fieldErrors: validation.fieldErrors,
    };
  }

  const remoteIp = await getRemoteIp();

  if (!(await isContactSubmissionAllowed(remoteIp))) {
    console.warn("Station application rate limit exceeded.");

    return errorState();
  }

  const turnstileOk = await verifyTurnstileToken(
    formData.get("cf-turnstile-response"),
    remoteIp,
  );

  if (!turnstileOk) {
    console.warn("Station application Turnstile verification failed.");

    return errorState();
  }

  try {
    await sendStationApplication({
      stationName: stations[slug].name,
      values: validation.values,
    });

    return successState();
  } catch (error) {
    console.error("Station application email delivery failed.", error);

    return errorState();
  }
}
