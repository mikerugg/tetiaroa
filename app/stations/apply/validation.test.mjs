import assert from "node:assert/strict";
import test from "node:test";

const {
  partySizeOptions,
  projectTypeOptions,
  roleOptions,
  stationApplicationMaxLengths,
  validateStationApplicationFields,
} = await import(new URL("./validation.ts", import.meta.url).href);

const messages = {
  nameRequired: "name required",
  nameTooLong: "name too long",
  emailRequired: "email required",
  emailInvalid: "email invalid",
  emailTooLong: "email too long",
  institutionRequired: "institution required",
  institutionTooLong: "institution too long",
  roleRequired: "role required",
  roleInvalid: "role invalid",
  projectTitleRequired: "title required",
  projectTitleTooLong: "title too long",
  projectTypeRequired: "type required",
  projectTypeInvalid: "type invalid",
  dateInvalid: "date invalid",
  departureBeforeArrival: "departure before arrival",
  partySizeRequired: "party size required",
  partySizeInvalid: "party size invalid",
  summaryRequired: "summary required",
  summaryTooShort: "summary too short",
  summaryTooLong: "summary too long",
  acknowledgementRequired: "acknowledgement required",
};

const summary =
  "We plan to monitor coral recruitment on the fore reef across two field seasons.";

function validFormData() {
  const formData = new FormData();
  formData.set("name", "Test Researcher");
  formData.set("email", "researcher@example.edu");
  formData.set("institution", "Example University");
  formData.set("role", "principal-investigator");
  formData.set("projectTitle", "Coral recruitment on Tetiaroa");
  formData.set("projectType", "research");
  formData.set("arrival", "2027-03-01");
  formData.set("departure", "2027-03-21");
  formData.set("partySize", "3-5");
  formData.set("summary", summary);
  formData.set("acknowledgement", "on");
  return formData;
}

function errorMessages(result, field) {
  return (result.fieldErrors[field] ?? []).map((error) => error.message);
}

test("accepts a complete application", () => {
  const result = validateStationApplicationFields(validFormData(), messages);

  assert.equal(result.hasErrors, false);
  assert.deepEqual(result.fieldErrors, {});
});

test("accepts every offered role, project type, and party size", () => {
  for (const role of roleOptions) {
    for (const projectType of projectTypeOptions) {
      for (const partySize of partySizeOptions) {
        const formData = validFormData();
        formData.set("role", role.value);
        formData.set("projectType", projectType.value);
        formData.set("partySize", partySize.value);

        assert.equal(
          validateStationApplicationFields(formData, messages).hasErrors,
          false,
          `${role.value}/${projectType.value}/${partySize.value} should be valid`,
        );
      }
    }
  }
});

test("requires every mandatory field when the form is empty", () => {
  const result = validateStationApplicationFields(new FormData(), messages);

  assert.equal(result.hasErrors, true);
  assert.deepEqual(errorMessages(result, "name"), [messages.nameRequired]);
  assert.deepEqual(errorMessages(result, "email"), [messages.emailRequired]);
  assert.deepEqual(errorMessages(result, "institution"), [
    messages.institutionRequired,
  ]);
  assert.deepEqual(errorMessages(result, "role"), [messages.roleRequired]);
  assert.deepEqual(errorMessages(result, "projectTitle"), [
    messages.projectTitleRequired,
  ]);
  assert.deepEqual(errorMessages(result, "projectType"), [
    messages.projectTypeRequired,
  ]);
  assert.deepEqual(errorMessages(result, "partySize"), [
    messages.partySizeRequired,
  ]);
  assert.deepEqual(errorMessages(result, "summary"), [
    messages.summaryRequired,
  ]);
  assert.deepEqual(errorMessages(result, "acknowledgement"), [
    messages.acknowledgementRequired,
  ]);
});

test("treats both dates as optional", () => {
  const formData = validFormData();
  formData.delete("arrival");
  formData.delete("departure");

  assert.equal(
    validateStationApplicationFields(formData, messages).hasErrors,
    false,
  );
});

test("rejects a departure earlier than the arrival", () => {
  const formData = validFormData();
  formData.set("arrival", "2027-03-21");
  formData.set("departure", "2027-03-01");

  const result = validateStationApplicationFields(formData, messages);

  assert.deepEqual(errorMessages(result, "departure"), [
    messages.departureBeforeArrival,
  ]);
});

test("accepts a same-day arrival and departure", () => {
  const formData = validFormData();
  formData.set("arrival", "2027-03-01");
  formData.set("departure", "2027-03-01");

  assert.equal(
    validateStationApplicationFields(formData, messages).hasErrors,
    false,
  );
});

test("rejects dates that are not real calendar days", () => {
  for (const value of ["2027-02-30", "2027-13-01", "March 1st", "2027-3-1"]) {
    const formData = validFormData();
    formData.set("arrival", value);

    assert.deepEqual(
      errorMessages(validateStationApplicationFields(formData, messages), "arrival"),
      [messages.dateInvalid],
      `${value} should be rejected`,
    );
  }
});

test("rejects options that are not on the offered lists", () => {
  const formData = validFormData();
  formData.set("role", "station-director");
  formData.set("projectType", "commercial");
  formData.set("partySize", "40");

  const result = validateStationApplicationFields(formData, messages);

  assert.deepEqual(errorMessages(result, "role"), [messages.roleInvalid]);
  assert.deepEqual(errorMessages(result, "projectType"), [
    messages.projectTypeInvalid,
  ]);
  assert.deepEqual(errorMessages(result, "partySize"), [
    messages.partySizeInvalid,
  ]);
});

test("rejects a summary that is too short and one that is too long", () => {
  const shortForm = validFormData();
  shortForm.set("summary", "Coral work.");

  assert.deepEqual(
    errorMessages(validateStationApplicationFields(shortForm, messages), "summary"),
    [messages.summaryTooShort],
  );

  const longForm = validFormData();
  longForm.set("summary", "s".repeat(stationApplicationMaxLengths.summary + 1));

  assert.deepEqual(
    errorMessages(validateStationApplicationFields(longForm, messages), "summary"),
    [messages.summaryTooLong],
  );
});

test("accepts fields at their maximum lengths", () => {
  const formData = validFormData();
  formData.set("name", "n".repeat(stationApplicationMaxLengths.name));
  formData.set(
    "email",
    `${"e".repeat(stationApplicationMaxLengths.email - 12)}@example.com`,
  );
  formData.set(
    "institution",
    "i".repeat(stationApplicationMaxLengths.institution),
  );
  formData.set(
    "projectTitle",
    "t".repeat(stationApplicationMaxLengths.projectTitle),
  );
  formData.set("summary", "s".repeat(stationApplicationMaxLengths.summary));

  assert.equal(
    validateStationApplicationFields(formData, messages).hasErrors,
    false,
  );
});

test("rejects a malformed email address", () => {
  const formData = validFormData();
  formData.set("email", "researcher-at-example.edu");

  assert.deepEqual(
    errorMessages(validateStationApplicationFields(formData, messages), "email"),
    [messages.emailInvalid],
  );
});
