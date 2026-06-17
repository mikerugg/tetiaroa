"use client";

import { useEffect } from "react";

export function DocumentLanguage({ lang }: { lang: string }) {
  useEffect(() => {
    const previousLang = document.documentElement.lang;

    document.documentElement.lang = lang;

    return () => {
      document.documentElement.lang = previousLang;
    };
  }, [lang]);

  return null;
}
