import assert from "node:assert/strict";
import test from "node:test";

const { emailListEmailMaxLength, validateEmailListFields } = await import(
  new URL("./validation.ts", import.meta.url).href
);

const messages = {
  emailInvalid: "email invalid",
  emailRequired: "email required",
  emailTooLong: "email too long",
  consentRequired: "consent required",
  languageInvalid: "language invalid",
  languageRequired: "language required",
};

function validFormData() {
  const formData = new FormData();
  formData.set("email", "reader@example.com");
  formData.set("language", "fr");
  formData.set("consent", "accepted");
  return formData;
}

test("accepts English and French email-list preferences", () => {
  for (const language of ["en", "fr"]) {
    const formData = validFormData();
    formData.set("language", language);
    const result = validateEmailListFields(formData, messages);

    assert.equal(result.hasErrors, false);
    assert.equal(result.values.language, language);
  }
});

test("normalizes email addresses before subscribing", () => {
  const formData = validFormData();
  formData.set("email", "  READER@EXAMPLE.COM  ");
  const result = validateEmailListFields(formData, messages);

  assert.equal(result.hasErrors, false);
  assert.equal(result.values.email, "reader@example.com");
});

test("rejects unsupported language values", () => {
  const formData = validFormData();
  formData.set("language", "es");
  const result = validateEmailListFields(formData, messages);

  assert.equal(result.hasErrors, true);
  assert.deepEqual(result.fieldErrors.language, [{ message: "language invalid" }]);
});

test("rejects an email address over the maximum length", () => {
  const formData = validFormData();
  formData.set("email", `${"a".repeat(emailListEmailMaxLength)}@example.com`);
  const result = validateEmailListFields(formData, messages);

  assert.equal(result.hasErrors, true);
  assert.deepEqual(result.fieldErrors.email, [{ message: "email too long" }]);
});

test("requires explicit email consent", () => {
  const formData = validFormData();
  formData.delete("consent");
  const result = validateEmailListFields(formData, messages);

  assert.equal(result.hasErrors, true);
  assert.deepEqual(result.fieldErrors.consent, [{ message: "consent required" }]);
});

test("rejects a forged consent value", () => {
  const formData = validFormData();
  formData.set("consent", "yes");
  const result = validateEmailListFields(formData, messages);

  assert.equal(result.hasErrors, true);
  assert.deepEqual(result.fieldErrors.consent, [{ message: "consent required" }]);
});
