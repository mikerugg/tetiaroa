import { Suspense } from "react";
import { homeCopies } from "../home-copy";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { DonateExperience } from "./donate-experience";
import {
  donateRouteCopy,
  getDonateToolbarCopy,
  type DonateLocale,
} from "./donate-route-copy";

export function DonatePage({ locale = "en" }: { locale?: DonateLocale }) {
  const copy = donateRouteCopy[locale];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopToolbar copy={getDonateToolbarCopy(locale)} />

      <div className="mx-auto max-w-330 px-6 pb-24 pt-28 md:px-12 md:pt-32">
        <Suspense fallback={<div className="min-h-250" />}>
          <DonateExperience copy={copy.experience} title={copy.title} />
        </Suspense>
      </div>

      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}
