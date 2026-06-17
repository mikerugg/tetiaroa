"use client";

import { useEffect, useState } from "react";
import { Globe2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRENCH_HOME_PATH } from "./language-links";

const dismissedKey = "tetiaroa:french-version-prompt-dismissed";
const acceptedKey = "tetiaroa:french-version-prompt-accepted";

function hasFrenchPreference() {
  const languages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];

  return languages.some((language) =>
    language.toLocaleLowerCase().startsWith("fr"),
  );
}

function rememberPreference(key: string) {
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // Storage may be unavailable in private browsing or strict privacy modes.
  }
}

function hasRememberedChoice() {
  try {
    return (
      window.localStorage.getItem(dismissedKey) === "true" ||
      window.localStorage.getItem(acceptedKey) === "true"
    );
  } catch {
    return false;
  }
}

export function FrenchVersionPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasRememberedChoice() || !hasFrenchPreference()) {
      return;
    }

    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isVisible) {
    return null;
  }

  const dismissPrompt = () => {
    rememberPreference(dismissedKey);
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="French language option"
      className="fixed inset-x-4 top-16 bottom-auto z-40 mx-auto flex max-w-[420px] items-center gap-3 rounded-lg border border-border bg-background/90 p-3 text-foreground shadow-2xl backdrop-blur-md sm:top-auto sm:right-auto sm:bottom-20 sm:left-4 sm:mx-0"
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        aria-hidden="true"
      >
        <Globe2Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
          Version française
        </p>
        <p className="text-sm leading-snug text-foreground">
          Tetiaroa vous parle aussi en français.
        </p>
      </div>
      <Button asChild variant="secondary" size="sm" className="rounded-full">
        <a
          href={FRENCH_HOME_PATH}
          hrefLang="fr"
          lang="fr"
          onClick={() => rememberPreference(acceptedKey)}
        >
          Lire
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss French language prompt"
        className="rounded-full"
        onClick={dismissPrompt}
      >
        <XIcon data-icon="inline-start" aria-hidden="true" />
      </Button>
    </aside>
  );
}
