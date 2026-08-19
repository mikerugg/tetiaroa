export const stationApplicationFieldNames = [
  "name",
  "email",
  "institution",
  "role",
  "projectTitle",
  "projectType",
  "arrival",
  "departure",
  "partySize",
  "summary",
  "acknowledgement",
] as const;

export type StationApplicationFieldName =
  (typeof stationApplicationFieldNames)[number];

export type StationApplicationFieldError = {
  message: string;
};

export type StationApplicationFieldErrors = Partial<
  Record<StationApplicationFieldName, StationApplicationFieldError[]>
>;

export type StationApplicationStatus = "idle" | "success" | "error";

export type StationApplicationFormState = {
  status: StationApplicationStatus;
  fieldErrors: StationApplicationFieldErrors;
  alert?: {
    title: string;
    description: string;
  };
};

export type StationApplicationValues = Record<
  StationApplicationFieldName,
  string
>;

export type StationApplicationValidationResult = {
  values: StationApplicationValues;
  fieldErrors: StationApplicationFieldErrors;
  hasErrors: boolean;
};

export const initialStationApplicationState: StationApplicationFormState = {
  status: "idle",
  fieldErrors: {},
};

export const roleOptions = [
  { value: "principal-investigator", label: "Principal investigator" },
  { value: "postdoctoral-researcher", label: "Postdoctoral researcher" },
  { value: "graduate-student", label: "Graduate student" },
  { value: "undergraduate-student", label: "Undergraduate student" },
  { value: "course-instructor", label: "Field course instructor" },
  { value: "other", label: "Other" },
] as const;

export const projectTypeOptions = [
  { value: "research", label: "Research" },
  { value: "education", label: "Field course" },
  { value: "cultural", label: "Cultural" },
] as const;

export const partySizeOptions = [
  { value: "1-2", label: "1–2 people" },
  { value: "3-5", label: "3–5 people" },
  { value: "6-10", label: "6–10 people" },
  { value: "11-18", label: "11–18 people" },
] as const;

export const stationApplicationMaxLengths: Record<
  StationApplicationFieldName,
  number
> = {
  name: 100,
  email: 254,
  institution: 160,
  role: 40,
  projectTitle: 200,
  projectType: 20,
  arrival: 10,
  departure: 10,
  partySize: 10,
  summary: 5_000,
  acknowledgement: 10,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const minimumSummaryLength = 40;

export type StationApplicationMessages = {
  nameRequired: string;
  nameTooLong: string;
  emailRequired: string;
  emailInvalid: string;
  emailTooLong: string;
  institutionRequired: string;
  institutionTooLong: string;
  roleRequired: string;
  roleInvalid: string;
  projectTitleRequired: string;
  projectTitleTooLong: string;
  projectTypeRequired: string;
  projectTypeInvalid: string;
  dateInvalid: string;
  departureBeforeArrival: string;
  partySizeRequired: string;
  partySizeInvalid: string;
  summaryRequired: string;
  summaryTooShort: string;
  summaryTooLong: string;
  acknowledgementRequired: string;
};

function getFormString(formData: FormData, name: StationApplicationFieldName) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function addFieldError(
  fieldErrors: StationApplicationFieldErrors,
  field: StationApplicationFieldName,
  message: string,
) {
  fieldErrors[field] = [...(fieldErrors[field] ?? []), { message }];
}

function isAllowedOption(
  options: ReadonlyArray<{ value: string }>,
  value: string,
) {
  return options.some((option) => option.value === value);
}

/** Rejects impossible calendar dates that still match the ISO shape. */
function isRealDate(value: string) {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validateStationApplicationFields(
  formData: FormData,
  messages: StationApplicationMessages,
): StationApplicationValidationResult {
  const values = Object.fromEntries(
    stationApplicationFieldNames.map((field) => [
      field,
      getFormString(formData, field),
    ]),
  ) as StationApplicationValues;
  const fieldErrors: StationApplicationFieldErrors = {};

  if (!values.name) {
    addFieldError(fieldErrors, "name", messages.nameRequired);
  } else if (values.name.length > stationApplicationMaxLengths.name) {
    addFieldError(fieldErrors, "name", messages.nameTooLong);
  }

  if (!values.email) {
    addFieldError(fieldErrors, "email", messages.emailRequired);
  } else if (values.email.length > stationApplicationMaxLengths.email) {
    addFieldError(fieldErrors, "email", messages.emailTooLong);
  } else if (!emailPattern.test(values.email)) {
    addFieldError(fieldErrors, "email", messages.emailInvalid);
  }

  if (!values.institution) {
    addFieldError(fieldErrors, "institution", messages.institutionRequired);
  } else if (
    values.institution.length > stationApplicationMaxLengths.institution
  ) {
    addFieldError(fieldErrors, "institution", messages.institutionTooLong);
  }

  if (!values.role) {
    addFieldError(fieldErrors, "role", messages.roleRequired);
  } else if (!isAllowedOption(roleOptions, values.role)) {
    addFieldError(fieldErrors, "role", messages.roleInvalid);
  }

  if (!values.projectTitle) {
    addFieldError(fieldErrors, "projectTitle", messages.projectTitleRequired);
  } else if (
    values.projectTitle.length > stationApplicationMaxLengths.projectTitle
  ) {
    addFieldError(fieldErrors, "projectTitle", messages.projectTitleTooLong);
  }

  if (!values.projectType) {
    addFieldError(fieldErrors, "projectType", messages.projectTypeRequired);
  } else if (!isAllowedOption(projectTypeOptions, values.projectType)) {
    addFieldError(fieldErrors, "projectType", messages.projectTypeInvalid);
  }

  // Dates are optional: first contact often happens before a field season is set.
  if (values.arrival && !isRealDate(values.arrival)) {
    addFieldError(fieldErrors, "arrival", messages.dateInvalid);
  }

  if (values.departure && !isRealDate(values.departure)) {
    addFieldError(fieldErrors, "departure", messages.dateInvalid);
  }

  if (
    isRealDate(values.arrival) &&
    isRealDate(values.departure) &&
    values.departure < values.arrival
  ) {
    addFieldError(fieldErrors, "departure", messages.departureBeforeArrival);
  }

  if (!values.partySize) {
    addFieldError(fieldErrors, "partySize", messages.partySizeRequired);
  } else if (!isAllowedOption(partySizeOptions, values.partySize)) {
    addFieldError(fieldErrors, "partySize", messages.partySizeInvalid);
  }

  if (!values.summary) {
    addFieldError(fieldErrors, "summary", messages.summaryRequired);
  } else if (values.summary.length < minimumSummaryLength) {
    addFieldError(fieldErrors, "summary", messages.summaryTooShort);
  } else if (values.summary.length > stationApplicationMaxLengths.summary) {
    addFieldError(fieldErrors, "summary", messages.summaryTooLong);
  }

  if (!values.acknowledgement) {
    addFieldError(
      fieldErrors,
      "acknowledgement",
      messages.acknowledgementRequired,
    );
  }

  return {
    values,
    fieldErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
  };
}

export function getOptionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
