"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GuideLocale } from "@/lib/atoll/types";
import { getGuideBrowseState, prepareGuideBrowseReturn, saveGuideBrowseState } from "./browse-history";

export function GuideEntryLink({ locale, ...props }: ComponentProps<typeof Link> & { locale: GuideLocale }) {
  return <Link {...props} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) saveGuideBrowseState(String(props.href), locale);
  }} />;
}

export function BackToGuideResults({ locale, fallbackHref, label }: { locale: GuideLocale; fallbackHref: string; label: string }) {
  const router = useRouter();
  return <Button asChild variant="ghost" className="-ml-2.5 self-start">
    <Link href={fallbackHref} onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const saved = getGuideBrowseState(locale);
      if (!saved || saved.profileHref !== window.location.pathname) return;
      event.preventDefault();
      prepareGuideBrowseReturn(saved);
      router.push(saved.url, { scroll: false });
    }}><ArrowLeftIcon data-icon="inline-start" />{label}</Link>
  </Button>;
}
