export const emailListLanguages = ["en", "fr"] as const;

export type EmailListLanguage = (typeof emailListLanguages)[number];

export type EmailListFieldName = "email" | "language" | "consent";

export type EmailListFieldError = {
  message: string;
};

export type EmailListFieldErrors = Partial<
  Record<EmailListFieldName, EmailListFieldError[]>
>;

export type EmailListFormState = {
  status: "idle" | "success" | "error";
  fieldErrors: EmailListFieldErrors;
  alert?: {
    title: string;
    description: string;
  };
};

export type EmailListValidationMessages = {
  emailInvalid: string;
  emailRequired: string;
  emailTooLong: string;
  consentRequired: string;
  languageInvalid: string;
  languageRequired: string;
};

export type EmailListFieldValues = {
  consent: true;
  email: string;
  language: EmailListLanguage;
};

export type EmailListValidationResult =
  | {
      hasErrors: false;
      fieldErrors: EmailListFieldErrors;
      values: EmailListFieldValues;
    }
  | {
      hasErrors: true;
      fieldErrors: EmailListFieldErrors;
    };

export const emailListEmailMaxLength = 254;

export const initialEmailListFormState: EmailListFormState = {
  status: "idle",
  fieldErrors: {},
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTrimmedFormValue(formData: FormData, name: EmailListFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function addFieldError(
  fieldErrors: EmailListFieldErrors,
  field: EmailListFieldName,
  message: string,
) {
  fieldErrors[field] = [...(fieldErrors[field] ?? []), { message }];
}

export function validateEmailListFields(
  formData: FormData,
  messages: EmailListValidationMessages,
): EmailListValidationResult {
  const email = getTrimmedFormValue(formData, "email").toLowerCase();
  const language = getTrimmedFormValue(formData, "language");
  const consent = getTrimmedFormValue(formData, "consent");
  const fieldErrors: EmailListFieldErrors = {};

  if (!email) {
    addFieldError(fieldErrors, "email", messages.emailRequired);
  } else if (email.length > emailListEmailMaxLength) {
    addFieldError(fieldErrors, "email", messages.emailTooLong);
  } else if (!emailPattern.test(email)) {
    addFieldError(fieldErrors, "email", messages.emailInvalid);
  }

  if (!language) {
    addFieldError(fieldErrors, "language", messages.languageRequired);
  } else if (!emailListLanguages.includes(language as EmailListLanguage)) {
    addFieldError(fieldErrors, "language", messages.languageInvalid);
  }

  if (consent !== "accepted") {
    addFieldError(fieldErrors, "consent", messages.consentRequired);
  }

  if (Object.keys(fieldErrors).length) {
    return { hasErrors: true, fieldErrors };
  }

  return {
    hasErrors: false,
    fieldErrors,
    values: { consent: true, email, language: language as EmailListLanguage },
  };
}
