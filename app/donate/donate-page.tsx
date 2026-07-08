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

      <section className="px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
              {copy.title}
            </h1>
          </div>

          <Suspense fallback={<div className="mt-14 min-h-[680px]" />}>
            <DonateExperience copy={copy.experience} />
          </Suspense>
        </div>
      </section>

      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}
