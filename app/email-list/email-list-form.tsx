"use client";

import Script from "next/script";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  MailPlusIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { submitEmailListForm } from "./actions";
import type {
  EmailListFormCopy,
  EmailListLocale,
} from "./email-list-route-copy";
import {
  initialEmailListFormState,
  emailListEmailMaxLength,
  type EmailListFieldName,
  type EmailListLanguage,
} from "./validation";

type EmailListFormProps = {
  locale: EmailListLocale;
  copy: EmailListFormCopy;
  renderToken: string;
  turnstileSiteKey?: string;
};

export function EmailListForm({
  locale,
  copy,
  renderToken,
  turnstileSiteKey,
}: EmailListFormProps) {
  const [language, setLanguage] = useState<EmailListLanguage>(locale);
  const [state, formAction, isPending] = useActionState(
    submitEmailListForm.bind(null, locale),
    initialEmailListFormState,
  );
  const emailErrors = getFieldErrors(state.fieldErrors, "email");
  const languageErrors = getFieldErrors(state.fieldErrors, "language");
  const consentErrors = getFieldErrors(state.fieldErrors, "consent");
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
        <Field data-invalid={emailErrors.length ? true : undefined}>
          <FieldLabel htmlFor="email-list-email">{copy.emailLabel}</FieldLabel>
          <Input
            id="email-list-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.emailPlaceholder}
            maxLength={emailListEmailMaxLength}
            aria-invalid={emailErrors.length > 0}
            disabled={isPending}
          />
          <FieldError errors={emailErrors} />
        </Field>

        <FieldSet data-invalid={languageErrors.length ? true : undefined}>
          <FieldLegend variant="label">{copy.languageLegend}</FieldLegend>
          <FieldDescription>{copy.languageDescription}</FieldDescription>
          <ToggleGroup
            type="single"
            value={language}
            onValueChange={(value) => {
              if (value === "en" || value === "fr") {
                setLanguage(value);
              }
            }}
            variant="outline"
            className="w-full"
            disabled={isPending}
            aria-label={copy.languageLegend}
            aria-invalid={languageErrors.length > 0}
          >
            <ToggleGroupItem value="en" className="flex-1">
              {copy.englishLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="fr" className="flex-1">
              {copy.frenchLabel}
            </ToggleGroupItem>
          </ToggleGroup>
          <input type="hidden" name="language" value={language} />
          <FieldError errors={languageErrors} />
        </FieldSet>

        <Field
          orientation="horizontal"
          data-invalid={consentErrors.length ? true : undefined}
        >
          <Checkbox
            id="email-list-consent"
            name="consent"
            value="accepted"
            required
            aria-invalid={consentErrors.length > 0}
            disabled={isPending}
          />
          <FieldContent>
            <FieldLabel htmlFor="email-list-consent">
              <span>
                {copy.consentLabel}{" "}
                <Link
                  href={copy.privacyPolicyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1 font-semibold underline decoration-current underline-offset-4 transition-opacity hover:opacity-80"
                  style={{
                    color: "var(--primary)",
                    textDecorationLine: "underline",
                  }}
                >
                  {copy.privacyPolicyLabel}
                  <ExternalLinkIcon
                    aria-hidden="true"
                    className="size-[0.8em] self-center"
                  />
                </Link>
                .
              </span>
            </FieldLabel>
            <FieldError errors={consentErrors} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="email-list-company">Company</label>
        <input
          id="email-list-company"
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

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <MailPlusIcon data-icon="inline-start" aria-hidden="true" />
        )}
        {isPending ? copy.pendingLabel : copy.submitLabel}
      </Button>
    </form>
  );
}

function getFieldErrors(
  fieldErrors: Partial<Record<EmailListFieldName, Array<{ message: string }>>>,
  field: EmailListFieldName,
) {
  return fieldErrors[field] ?? [];
}
