import assert from "node:assert/strict";
import test from "node:test";

const { contactFieldMaxLengths, validateContactFields } = await import(
  new URL("./validation.ts", import.meta.url).href
);

const messages = {
  nameRequired: "name required",
  nameTooLong: "name too long",
  emailRequired: "email required",
  emailInvalid: "email invalid",
  emailTooLong: "email too long",
  subjectRequired: "subject required",
  subjectTooLong: "subject too long",
  messageRequired: "message required",
  messageTooShort: "message too short",
  messageTooLong: "message too long",
};

function validFormData() {
  const formData = new FormData();
  formData.set("name", "Test Person");
  formData.set("email", "test@example.com");
  formData.set("subject", "Test subject");
  formData.set("message", "A valid test message.");
  return formData;
}

test("accepts contact fields at their maximum lengths", () => {
  const formData = validFormData();
  formData.set("name", "n".repeat(contactFieldMaxLengths.name));
  formData.set(
    "email",
    `${"e".repeat(contactFieldMaxLengths.email - 12)}@example.com`,
  );
  formData.set("subject", "s".repeat(contactFieldMaxLengths.subject));
  formData.set("message", "m".repeat(contactFieldMaxLengths.message));

  assert.equal(validateContactFields(formData, messages).hasErrors, false);
});

test("rejects every contact field above its maximum length", () => {
  for (const field of Object.keys(contactFieldMaxLengths)) {
    const formData = validFormData();
    formData.set(field, "x".repeat(contactFieldMaxLengths[field] + 1));
    const result = validateContactFields(formData, messages);

    assert.equal(result.hasErrors, true, `${field} should be rejected`);
    assert.ok(result.fieldErrors[field]?.length, `${field} should have an error`);
  }
});
