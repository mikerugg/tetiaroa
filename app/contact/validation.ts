export const contactFieldNames = [
  "name",
  "email",
  "subject",
  "message",
] as const;

export type ContactFieldName = (typeof contactFieldNames)[number];

export type ContactFieldError = {
  message: string;
};

export type ContactFieldErrors = Partial<
  Record<ContactFieldName, ContactFieldError[]>
>;

export type ContactFormStatus = "idle" | "success" | "error";

export type ContactFormState = {
  status: ContactFormStatus;
  fieldErrors: ContactFieldErrors;
  alert?: {
    title: string;
    description: string;
  };
};

export type ContactValidationMessages = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  subjectRequired: string;
  messageRequired: string;
  messageTooShort: string;
};

export type ContactFieldValues = Record<ContactFieldName, string>;

export type ContactValidationResult = {
  values: ContactFieldValues;
  fieldErrors: ContactFieldErrors;
  hasErrors: boolean;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumMessageLength = 10;

function getFormString(formData: FormData, name: ContactFieldName) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function addFieldError(
  fieldErrors: ContactFieldErrors,
  field: ContactFieldName,
  message: string,
) {
  fieldErrors[field] = [...(fieldErrors[field] ?? []), { message }];
}

export function validateContactFields(
  formData: FormData,
  messages: ContactValidationMessages,
): ContactValidationResult {
  const values: ContactFieldValues = {
    name: getFormString(formData, "name"),
    email: getFormString(formData, "email"),
    subject: getFormString(formData, "subject"),
    message: getFormString(formData, "message"),
  };
  const fieldErrors: ContactFieldErrors = {};

  if (!values.name) {
    addFieldError(fieldErrors, "name", messages.nameRequired);
  }

  if (!values.email) {
    addFieldError(fieldErrors, "email", messages.emailRequired);
  } else if (!emailPattern.test(values.email)) {
    addFieldError(fieldErrors, "email", messages.emailInvalid);
  }

  if (!values.subject) {
    addFieldError(fieldErrors, "subject", messages.subjectRequired);
  }

  if (!values.message) {
    addFieldError(fieldErrors, "message", messages.messageRequired);
  } else if (values.message.length < minimumMessageLength) {
    addFieldError(fieldErrors, "message", messages.messageTooShort);
  }

  return {
    values,
    fieldErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
  };
}
