"use server";

import { headers } from "next/headers";

import { isContactSubmissionAllowed } from "@/app/contact/rate-limit";
import { verifyRenderToken } from "@/app/contact/timing-token";
import { verifyTurnstileToken } from "@/app/contact/turnstile";
import { isStationSlug, stations, type StationSlug } from "../stations-content";
import type { HomeLocale } from "@/app/home-copy";
import { stationApplicationCopies } from "./apply-copy";
import { sendStationApplication } from "./mailer";
import {
  validateStationApplicationFields,
  type StationApplicationFormState,
} from "./validation";

function successState(
  copy: (typeof stationApplicationCopies)[HomeLocale],
): StationApplicationFormState {
  return {
    status: "success",
    fieldErrors: {},
    alert: {
      title: copy.successTitle,
      description: copy.successMessage,
    },
  };
}

function errorState(
  copy: (typeof stationApplicationCopies)[HomeLocale],
): StationApplicationFormState {
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
  locale: HomeLocale,
  slug: StationSlug,
  _prevState: StationApplicationFormState,
  formData: FormData,
): Promise<StationApplicationFormState> {
  const copy = stationApplicationCopies[locale] ?? stationApplicationCopies.en;

  if (!isStationSlug(slug)) {
    return errorState(copy);
  }

  // Honeypot: bots fill it, people never see it.
  if (getTrimmedFormValue(formData, "company")) {
    return successState(copy);
  }

  const renderTokenResult = verifyRenderToken(formData.get("renderToken"));

  if (!renderTokenResult.ok) {
    console.warn("Station application render token rejected.", {
      reason: renderTokenResult.reason,
    });

    return errorState(copy);
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

    return errorState(copy);
  }

  const turnstileOk = await verifyTurnstileToken(
    formData.get("cf-turnstile-response"),
    remoteIp,
  );

  if (!turnstileOk) {
    console.warn("Station application Turnstile verification failed.");

    return errorState(copy);
  }

  try {
    await sendStationApplication({
      stationName: stations[slug].name,
      values: validation.values,
    });

    return successState(copy);
  } catch (error) {
    console.error("Station application email delivery failed.", error);

    return errorState(copy);
  }
}
