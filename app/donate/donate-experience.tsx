"use client";

import { useSearchParams } from "next/navigation";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type DonateExperienceCopy,
  type DonateFinancialCopy,
  type DonateFinancialYearCopy,
  type DonateMoreWaysCopy,
  type DonateStatementCopy,
} from "./donate-route-copy";
import { QgivEmbed } from "./qgiv-embed";

export function DonateExperience({
  copy,
  title,
}: {
  copy: DonateExperienceCopy;
  title: string;
}) {
  const searchParams = useSearchParams();
  const amountFromQuery = getAmountFromSearchParams(searchParams);

  return (
    <>
      {/*
        Splits at xl so the statement is never squeezed beside the widget: the
        QGiv form paints its own fixed ~600px card and cannot shrink with it.
      */}
      <div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_660px] xl:gap-16">
        <StatementColumn copy={copy.statement} title={title} />

        <section
          id="secure-donation-form"
          aria-label={copy.embedTitleAttribute}
          className="w-full max-w-165"
        >
          <QgivEmbed amount={amountFromQuery} title={copy.embedTitleAttribute} />
        </section>
      </div>

      <div className="mt-24">
        <FinancialSection copy={copy.financial} />
      </div>

      <MoreWaysSection copy={copy.moreWays} />
    </>
  );
}

function StatementColumn({
  copy,
  title,
}: {
  copy: DonateStatementCopy;
  title: string;
}) {
  return (
    <div className="xl:sticky xl:top-28 xl:self-start">
      {/* Matches the footer column eyebrows: mono, uppercase, primary/glow. */}
      <p className="font-mono text-sm uppercase tracking-[0.24em] text-primary">
        {copy.eyebrow}
      </p>

      <div className="mt-4 flex max-w-[48ch] flex-col gap-4">
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.02] text-foreground">
          {title}
        </h1>
        <p className="text-[17px] leading-[1.85] text-muted-foreground">
          {copy.paragraph}
        </p>

        {/*
          Below xl the widget stacks underneath, so the anchor earns its place.
          At xl the widget sits alongside and a second button would only
          compete with the one that actually completes a gift.
        */}
        <Button asChild size="lg" className="mt-2 w-fit rounded-full xl:hidden">
          <a href="#secure-donation-form">
            {copy.ctaLabel}
            <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function MoreWaysSection({ copy }: { copy: DonateMoreWaysCopy }) {
  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="font-display text-2xl leading-tight md:text-3xl">
        {copy.title}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{copy.checkTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-base leading-7 text-muted-foreground">
            <p>{copy.checkBody}</p>
            <address className="flex flex-col gap-1 not-italic text-foreground">
              {copy.checkAddress.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{copy.assetsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-base leading-7 text-muted-foreground">
            <p>{copy.assetsBody}</p>
            <div className="flex flex-col gap-1 text-foreground">
              <span>
                {copy.contactName}, {copy.contactTitle}
              </span>
              <a
                href={`mailto:${copy.contactEmail}`}
                className="w-fit underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {copy.contactEmail}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function FinancialSection({ copy }: { copy: DonateFinancialCopy }) {
  return (
    <section className="flex flex-col gap-8 rounded-md bg-muted px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 text-center">
        {copy.body.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-7 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {copy.years.map((year) => (
          <FinancialYearCard
            key={year.year}
            year={year}
            annualReportLabel={copy.annualReportLabel}
            form990Label={copy.form990Label}
            unavailableLabel={copy.unavailableLabel}
          />
        ))}
      </div>
    </section>
  );
}

function FinancialYearCard({
  year,
  annualReportLabel,
  form990Label,
  unavailableLabel,
}: {
  year: DonateFinancialYearCopy;
  annualReportLabel: string;
  form990Label: string;
  unavailableLabel: string;
}) {
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>{year.year}</CardTitle>
        <CardDescription>{year.dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button asChild variant="outline" size="sm" className="justify-between">
          <a href={year.annualReportHref}>
            {annualReportLabel}
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>

        {year.form990Href ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="justify-between"
          >
            <a href={year.form990Href}>
              {form990Label}
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            {unavailableLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function getAmountFromSearchParams(searchParams: Pick<URLSearchParams, "get">) {
  const rawAmount = searchParams.get("amount");

  if (!rawAmount) {
    return null;
  }

  const amount = Number.parseInt(rawAmount.replace(/[^0-9]/g, ""), 10);

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}
