"use client";

import Script from "next/script";
import { useActionState, useEffect, useState } from "react";
import { AlertCircleIcon, CheckCircle2Icon, SendIcon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { StationSlug } from "../stations-content";
import type { HomeLocale } from "@/app/home-copy";
import { submitStationApplication } from "./actions";
import {
  stationApplicationCopies,
  stationApplicationOptionLabels,
  type StationApplicationFormCopy,
} from "./apply-copy";
import {
  initialStationApplicationState,
  partySizeOptions,
  projectTypeOptions,
  roleOptions,
  stationApplicationMaxLengths,
  type StationApplicationFieldErrors,
  type StationApplicationFieldName,
} from "./validation";

/** Tokens go stale after 30 minutes, so refresh well inside that window. */
const tokenRefreshMs = 15 * 60 * 1000;

const fieldId = (field: StationApplicationFieldName) => `station-${field}`;

function errorsFor(
  fieldErrors: StationApplicationFieldErrors,
  field: StationApplicationFieldName,
) {
  return fieldErrors[field] ?? [];
}

/**
 * The station page is prerendered, so a token baked into its HTML would be
 * shared and stale for everyone. The form mints its own on mount instead.
 */
function useRenderToken() {
  const [renderToken, setRenderToken] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadToken = async () => {
      try {
        const response = await fetch("/api/render-token", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { token?: unknown };

        if (typeof payload.token === "string") {
          setRenderToken(payload.token);
        }
      } catch {
        // Offline or aborted: the server action rejects the empty token.
      }
    };

    void loadToken();
    const interval = window.setInterval(() => void loadToken(), tokenRefreshMs);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  return renderToken;
}

export function StationApplicationForm({
  slug,
  locale = "en",
  turnstileSiteKey,
}: {
  slug: StationSlug;
  locale?: HomeLocale;
  turnstileSiteKey?: string;
}) {
  const copy = stationApplicationCopies[locale];
  const optionLabels = stationApplicationOptionLabels[locale];
  const [state, formAction, isPending] = useActionState(
    submitStationApplication.bind(null, locale, slug),
    initialStationApplicationState,
  );
  const renderToken = useRenderToken();
  const [projectType, setProjectType] = useState("");
  const StatusIcon =
    state.status === "success" ? CheckCircle2Icon : AlertCircleIcon;

  if (state.status === "success") {
    return (
      <Alert>
        <CheckCircle2Icon aria-hidden="true" />
        <AlertTitle>{copy.successTitle}</AlertTitle>
        <AlertDescription>{copy.successMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-7">
      {state.alert ? (
        <Alert variant={state.status === "error" ? "destructive" : "default"}>
          <StatusIcon aria-hidden="true" />
          <AlertTitle>{state.alert.title}</AlertTitle>
          <AlertDescription>{state.alert.description}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <div className="grid gap-7 sm:grid-cols-2">
          <TextField
            copy={copy}
            field="name"
            type="text"
            autoComplete="name"
            fieldErrors={state.fieldErrors}
          />
          <TextField
            copy={copy}
            field="email"
            type="email"
            autoComplete="email"
            fieldErrors={state.fieldErrors}
          />
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <TextField
            copy={copy}
            field="institution"
            type="text"
            autoComplete="organization"
            description={copy.fields.institution.description}
            fieldErrors={state.fieldErrors}
          />
          <SelectField
            field="role"
            label={copy.fields.role.label}
            placeholder={copy.fields.role.placeholder}
            options={roleOptions}
            optionLabels={optionLabels.role}
            fieldErrors={state.fieldErrors}
          />
        </div>

        <TextField
            copy={copy}
          field="projectTitle"
          type="text"
          autoComplete="off"
          fieldErrors={state.fieldErrors}
        />

        <ProjectTypeField
          copy={copy}
          optionLabels={optionLabels.projectType}
          value={projectType}
          onChange={setProjectType}
          fieldErrors={state.fieldErrors}
        />

        <FieldSet>
          <FieldLegend variant="label">{copy.fields.dates.legend}</FieldLegend>
          <FieldDescription>{copy.fields.dates.description}</FieldDescription>
          <div className="grid gap-7 sm:grid-cols-2">
            <DateField
              field="arrival"
              label={copy.fields.arrival.label}
              fieldErrors={state.fieldErrors}
            />
            <DateField
              field="departure"
              label={copy.fields.departure.label}
              fieldErrors={state.fieldErrors}
            />
          </div>
        </FieldSet>

        <SelectField
          field="partySize"
          label={copy.fields.partySize.label}
          placeholder={copy.fields.partySize.placeholder}
          options={partySizeOptions}
          optionLabels={optionLabels.partySize}
          fieldErrors={state.fieldErrors}
          className="sm:max-w-xs"
        />

        <SummaryField copy={copy} fieldErrors={state.fieldErrors} />

        <AcknowledgementField copy={copy} fieldErrors={state.fieldErrors} />
      </FieldGroup>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="station-company">Company</label>
        <input
          id="station-company"
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
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="dark"
          />
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
        {isPending ? copy.pendingLabel : copy.submitLabel}
      </Button>
    </form>
  );
}

function TextField({
  copy,
  field,
  type,
  autoComplete,
  description,
  fieldErrors,
}: {
  field: Extract<
    StationApplicationFieldName,
    "name" | "email" | "institution" | "projectTitle"
  >;
  type: "text" | "email";
  autoComplete: string;
  description?: string;
  fieldErrors: StationApplicationFieldErrors;
  copy: StationApplicationFormCopy;
}) {
  const errors = errorsFor(fieldErrors, field);
  const isInvalid = errors.length > 0;
  const fieldCopy = copy.fields[field];

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldId(field)}>{fieldCopy.label}</FieldLabel>
      <Input
        id={fieldId(field)}
        name={field}
        type={type}
        autoComplete={autoComplete}
        placeholder={fieldCopy.placeholder}
        maxLength={stationApplicationMaxLengths[field]}
        aria-invalid={isInvalid}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={errors} />
    </Field>
  );
}

function DateField({
  field,
  label,
  fieldErrors,
}: {
  field: Extract<StationApplicationFieldName, "arrival" | "departure">;
  label: string;
  fieldErrors: StationApplicationFieldErrors;
}) {
  const errors = errorsFor(fieldErrors, field);
  const isInvalid = errors.length > 0;

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldId(field)}>{label}</FieldLabel>
      <Input
        id={fieldId(field)}
        name={field}
        type="date"
        aria-invalid={isInvalid}
      />
      <FieldError errors={errors} />
    </Field>
  );
}

function SelectField({
  field,
  label,
  placeholder,
  options,
  optionLabels,
  fieldErrors,
  className,
}: {
  field: Extract<StationApplicationFieldName, "role" | "partySize">;
  label: string;
  placeholder: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  optionLabels: Record<string, string>;
  fieldErrors: StationApplicationFieldErrors;
  className?: string;
}) {
  const errors = errorsFor(fieldErrors, field);
  const isInvalid = errors.length > 0;

  return (
    <Field className={className} data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldId(field)}>{label}</FieldLabel>
      <Select name={field}>
        <SelectTrigger id={fieldId(field)} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {optionLabels[option.value] ?? option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError errors={errors} />
    </Field>
  );
}

function ProjectTypeField({
  copy,
  optionLabels,
  value,
  onChange,
  fieldErrors,
}: {
  optionLabels: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  fieldErrors: StationApplicationFieldErrors;
  copy: StationApplicationFormCopy;
}) {
  const errors = errorsFor(fieldErrors, "projectType");
  const isInvalid = errors.length > 0;

  return (
    <FieldSet data-invalid={isInvalid ? true : undefined}>
      <FieldLegend
        variant="label"
        className={cn(isInvalid && "text-destructive")}
      >
        {copy.fields.projectType.legend}
      </FieldLegend>
      <FieldDescription>{copy.fields.projectType.description}</FieldDescription>
      <input type="hidden" name="projectType" value={value} />
      <ToggleGroup
        type="single"
        variant="outline"
        value={value}
        onValueChange={onChange}
        className="w-fit"
        aria-label={copy.fields.projectType.legend}
        aria-invalid={isInvalid}
      >
        {projectTypeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {optionLabels[option.value] ?? option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <FieldError errors={errors} />
    </FieldSet>
  );
}

function SummaryField({
  copy,
  fieldErrors,
}: {
  fieldErrors: StationApplicationFieldErrors;
  copy: StationApplicationFormCopy;
}) {
  const errors = errorsFor(fieldErrors, "summary");
  const isInvalid = errors.length > 0;

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldLabel htmlFor={fieldId("summary")}>
        {copy.fields.summary.label}
      </FieldLabel>
      <Textarea
        id={fieldId("summary")}
        name="summary"
        placeholder={copy.fields.summary.placeholder}
        maxLength={stationApplicationMaxLengths.summary}
        aria-invalid={isInvalid}
        className="min-h-40 resize-y"
      />
      <FieldDescription>{copy.fields.summary.description}</FieldDescription>
      <FieldError errors={errors} />
    </Field>
  );
}

function AcknowledgementField({
  copy,
  fieldErrors,
}: {
  fieldErrors: StationApplicationFieldErrors;
  copy: StationApplicationFormCopy;
}) {
  const errors = errorsFor(fieldErrors, "acknowledgement");
  const isInvalid = errors.length > 0;

  return (
    <FieldSet>
      <FieldLegend variant="label">
        {copy.fields.acknowledgement.legend}
      </FieldLegend>
      <Field
        orientation="horizontal"
        data-invalid={isInvalid ? true : undefined}
      >
        <Checkbox
          id={fieldId("acknowledgement")}
          name="acknowledgement"
          aria-invalid={isInvalid}
        />
        <FieldContent>
          <FieldLabel htmlFor={fieldId("acknowledgement")}>
            {copy.fields.acknowledgement.label}
          </FieldLabel>
          <FieldDescription>
            {copy.fields.acknowledgement.description}
          </FieldDescription>
          <FieldError errors={errors} />
        </FieldContent>
      </Field>
    </FieldSet>
  );
}
