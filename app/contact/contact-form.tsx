"use client";

import Script from "next/script";
import { useActionState } from "react";
import { AlertCircleIcon, CheckCircle2Icon, SendIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "./actions";
import type { ContactFormCopy, ContactLocale } from "./contact-route-copy";
import {
  initialContactFormState,
  type ContactFieldErrors,
  type ContactFieldName,
} from "./validation";

type ContactFormProps = {
  locale: ContactLocale;
  copy: ContactFormCopy;
  renderToken: string;
  turnstileSiteKey?: string;
};

const fieldIds: Record<ContactFieldName, string> = {
  name: "contact-name",
  email: "contact-email",
  subject: "contact-subject",
  message: "contact-message",
};

function getFieldErrors(
  fieldErrors: ContactFieldErrors,
  field: ContactFieldName,
) {
  return fieldErrors[field] ?? [];
}

export function ContactForm({
  locale,
  copy,
  renderToken,
  turnstileSiteKey,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm.bind(null, locale),
    initialContactFormState,
  );
  const submitLabel = isPending ? copy.pendingLabel : copy.submitLabel;
  const StatusIcon =
    state.status === "success" ? CheckCircle2Icon : AlertCircleIcon;

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-6">
      {state.alert ? (
        <Alert variant={state.status === "error" ? "destructive" : "default"}>
          <StatusIcon aria-hidden="true" />
          <AlertTitle>{state.alert.title}</AlertTitle>
          <AlertDescription>{state.alert.description}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <ContactInputField
          field="name"
          type="text"
          autoComplete="name"
          copy={copy}
          fieldErrors={state.fieldErrors}
        />
        <ContactInputField
          field="email"
          type="email"
          autoComplete="email"
          copy={copy}
          fieldErrors={state.fieldErrors}
        />
        <ContactInputField
          field="subject"
          type="text"
          autoComplete="off"
          copy={copy}
          fieldErrors={state.fieldErrors}
        />

        <ContactMessageField copy={copy} fieldErrors={state.fieldErrors} />
      </FieldGroup>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="renderToken" value={renderToken} />

      {turnstileSiteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
            async
            defer
          />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-fit"
      >
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SendIcon data-icon="inline-start" aria-hidden="true" />
        )}
        {submitLabel}
      </Button>
    </form>
  );
}

function ContactInputField({
  field,
  type,
  autoComplete,
  copy,
  fieldErrors,
}: {
  field: Exclude<ContactFieldName, "message">;
  type: "text" | "email";
  autoComplete: string;
  copy: ContactFormCopy;
  fieldErrors: ContactFieldErrors;
}) {
  const errors = getFieldErrors(fieldErrors, field);
  const isInvalid = errors.length > 0;

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldIds[field]}>{copy.fields[field].label}</FieldLabel>
      <Input
        id={fieldIds[field]}
        name={field}
        type={type}
        autoComplete={autoComplete}
        placeholder={copy.fields[field].placeholder}
        aria-invalid={isInvalid}
      />
      <FieldError errors={errors} />
    </Field>
  );
}

function ContactMessageField({
  copy,
  fieldErrors,
}: {
  copy: ContactFormCopy;
  fieldErrors: ContactFieldErrors;
}) {
  const errors = getFieldErrors(fieldErrors, "message");
  const isInvalid = errors.length > 0;

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldIds.message}>
        {copy.fields.message.label}
      </FieldLabel>
      <Textarea
        id={fieldIds.message}
        name="message"
        placeholder={copy.fields.message.placeholder}
        aria-invalid={isInvalid}
        className="min-h-36 resize-y"
      />
      <FieldError errors={errors} />
    </Field>
  );
}
