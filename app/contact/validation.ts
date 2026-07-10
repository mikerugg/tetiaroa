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
  nameTooLong: string;
  emailRequired: string;
  emailInvalid: string;
  emailTooLong: string;
  subjectRequired: string;
  subjectTooLong: string;
  messageRequired: string;
  messageTooShort: string;
  messageTooLong: string;
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

export const contactFieldMaxLengths: Record<ContactFieldName, number> = {
  name: 100,
  email: 254,
  subject: 200,
  message: 10_000,
};

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
  } else if (values.name.length > contactFieldMaxLengths.name) {
    addFieldError(fieldErrors, "name", messages.nameTooLong);
  }

  if (!values.email) {
    addFieldError(fieldErrors, "email", messages.emailRequired);
  } else if (values.email.length > contactFieldMaxLengths.email) {
    addFieldError(fieldErrors, "email", messages.emailTooLong);
  } else if (!emailPattern.test(values.email)) {
    addFieldError(fieldErrors, "email", messages.emailInvalid);
  }

  if (!values.subject) {
    addFieldError(fieldErrors, "subject", messages.subjectRequired);
  } else if (values.subject.length > contactFieldMaxLengths.subject) {
    addFieldError(fieldErrors, "subject", messages.subjectTooLong);
  }

  if (!values.message) {
    addFieldError(fieldErrors, "message", messages.messageRequired);
  } else if (values.message.length < minimumMessageLength) {
    addFieldError(fieldErrors, "message", messages.messageTooShort);
  } else if (values.message.length > contactFieldMaxLengths.message) {
    addFieldError(fieldErrors, "message", messages.messageTooLong);
  }

  return {
    values,
    fieldErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
  };
}
