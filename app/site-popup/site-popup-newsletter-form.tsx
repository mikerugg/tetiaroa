"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircleIcon, ArrowRightIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { submitEmailListForm } from "../email-list/actions";
import {
  emailListEmailMaxLength,
  initialEmailListFormState,
  type EmailListFormState,
  type EmailListLanguage,
} from "../email-list/validation";
import type { HomeLocale } from "../home-copy";
import type { SitePopupNewsletterCopy } from "./site-popup-copy";

/** Tokens go stale after 30 minutes, so refresh well inside that window. */
const tokenRefreshMs = 15 * 60 * 1000;

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => string | undefined;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * The popup lives on a prerendered page, so it fetches its own signed render
 * token when it opens instead of reading a baked-in, shared one.
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

/**
 * Turnstile only auto-scans the DOM when its script loads, and this widget
 * mounts later, so it renders explicitly and resets after a failed attempt.
 */
function PopupTurnstile({
  siteKey,
  formState,
}: {
  siteKey: string;
  formState: EmailListFormState;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;

    if (!isScriptReady || !container || !turnstile) {
      return;
    }

    widgetIdRef.current =
      turnstile.render(container, {
        sitekey: siteKey,
        appearance: "interaction-only",
        theme: "dark",
        size: "flexible",
      }) ?? null;

    return () => {
      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isScriptReady, siteKey]);

  useEffect(() => {
    // Tokens are single-use, so a rejected attempt needs a fresh one. The
    // action returns a new state object per submit, so repeats re-run this.
    if (formState.status !== "error" || !widgetIdRef.current) {
      return;
    }

    window.turnstile?.reset(widgetIdRef.current);
  }, [formState]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div ref={containerRef} className="empty:hidden" />
    </>
  );
}

export function SitePopupNewsletterForm({
  copy,
  locale,
  onSubscribed,
  turnstileSiteKey,
}: {
  copy: SitePopupNewsletterCopy;
  locale: HomeLocale;
  onSubscribed: () => void;
  turnstileSiteKey?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitEmailListForm.bind(null, locale),
    initialEmailListFormState,
  );
  const renderToken = useRenderToken();
  // The page's language is the likely answer, not the only one.
  const [language, setLanguage] = useState<EmailListLanguage>(locale);
  const emailErrors = state.fieldErrors.email ?? [];
  const languageErrors = state.fieldErrors.language ?? [];
  const consentErrors = state.fieldErrors.consent ?? [];

  useEffect(() => {
    if (state.status === "success") {
      onSubscribed();
    }
  }, [state.status, onSubscribed]);

  if (state.status === "success") {
    // The panel itself becomes the confirmation, so the form steps aside.
    return null;
  }

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-4">
      {state.alert ? (
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>{state.alert.title}</AlertTitle>
          <AlertDescription>{state.alert.description}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup className="gap-3">
        <Field data-invalid={emailErrors.length ? true : undefined}>
          <FieldLabel
            htmlFor="site-popup-email"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            {copy.emailLabel}
          </FieldLabel>
          <Input
            id="site-popup-email"
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

        <FieldSet
          className="gap-2"
          data-invalid={languageErrors.length ? true : undefined}
        >
          <FieldLegend
            variant="label"
            className="mb-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            {copy.languageLegend}
          </FieldLegend>
          <ToggleGroup
            type="single"
            value={language}
            onValueChange={(value) => {
              // Radix reports "" when the active item is pressed again; the
              // list has to go out in one language or the other.
              if (value === "en" || value === "fr") {
                setLanguage(value);
              }
            }}
            variant="outline"
            size="sm"
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
            id="site-popup-consent"
            name="consent"
            value="accepted"
            required
            aria-invalid={consentErrors.length > 0}
            disabled={isPending}
          />
          <FieldContent>
            <FieldLabel
              htmlFor="site-popup-consent"
              className="text-xs leading-5 font-normal text-muted-foreground"
            >
              <span>
                {copy.consentLabel}{" "}
                <Link
                  href={copy.privacyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline decoration-current underline-offset-4 transition-opacity hover:opacity-80"
                >
                  {copy.privacyLabel}
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
        <label htmlFor="site-popup-company">Company</label>
        <input
          id="site-popup-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="renderToken" value={renderToken} />

      {turnstileSiteKey ? (
        <PopupTurnstile siteKey={turnstileSiteKey} formState={state} />
      ) : null}

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : null}
        {isPending ? copy.pendingLabel : copy.submitLabel}
        {isPending ? null : (
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        )}
      </Button>
    </form>
  );
}
