"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type DonateExperienceCopy,
  type DonateFinancialCopy,
  type DonateFinancialYearCopy,
  type DonateMoreWaysCopy,
  type DonateSupportCopy,
} from "./donate-route-copy";
import { QgivEmbed } from "./qgiv-embed";

export function DonateExperience({ copy }: { copy: DonateExperienceCopy }) {
  const searchParams = useSearchParams();
  const amountFromQuery = getAmountFromSearchParams(searchParams);

  return (
    <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-16 md:mt-14 md:gap-20">
      <section
        id="secure-donation-form"
        aria-label={copy.embedTitleAttribute}
        className="w-full"
      >
        <QgivEmbed amount={amountFromQuery} title={copy.embedTitleAttribute} />
      </section>

      <SupportSection copy={copy.support} />
      <MoreWaysSection copy={copy.moreWays} />
      <FinancialSection copy={copy.financial} />
    </div>
  );
}

function SupportSection({ copy }: { copy: DonateSupportCopy }) {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {copy.title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {copy.lead}
        </p>
      </div>

      <CopyList title={copy.mattersTitle} items={copy.matters} />
      <CopyList title={copy.waysTitle} items={copy.ways} />

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl leading-tight">
          {copy.togetherTitle}
        </h3>
        <p className="text-base leading-7 text-muted-foreground">
          {copy.togetherBody}
        </p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
        {copy.taxLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function CopyList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold leading-6">{title}</h3>
      <ul className="flex list-disc flex-col gap-3 pl-5 text-base leading-7 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MoreWaysSection({ copy }: { copy: DonateMoreWaysCopy }) {
  return (
    <section className="flex flex-col gap-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {copy.title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          {copy.subtitle}
        </p>
      </div>

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
            <CardTitle>{copy.wireTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7 text-muted-foreground">
              {copy.wireBody}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FinancialSection({ copy }: { copy: DonateFinancialCopy }) {
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
