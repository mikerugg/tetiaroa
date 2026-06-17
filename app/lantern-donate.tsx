"use client";

import { useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import styles from "./home-experience.module.css";

export type LanternTier = {
  amount: string;
  period: string;
  name: string;
  description: string;
  custom?: boolean;
};

export type LanternDonateLabels = {
  ariaLabel: string;
  emptySelection: string;
  customAmountRequired: string;
  lightPrefix: string;
  customAmountLabel: string;
  backToTop: string;
  currencySymbol: string;
};

const lanternButtonClass =
  "h-auto min-h-[220px] cursor-pointer flex-col items-start justify-start gap-2.5 whitespace-normal rounded-[20px] border-border bg-card px-[22px] pb-6 pt-[26px] text-left font-[inherit] text-card-foreground transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/40 hover:bg-card";

const defaultLabels: LanternDonateLabels = {
  ariaLabel: "Select your donation level",
  emptySelection: "Pick a lantern to light",
  customAmountRequired: "Enter an amount to light it",
  lightPrefix: "Light the path",
  customAmountLabel: "your amount",
  backToTop: "Back to the top",
  currencySymbol: "$",
};

export function LanternDonate({
  tiers,
  labels = defaultLabels,
}: {
  tiers: LanternTier[];
  labels?: LanternDonateLabels;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const selectedTier = selected === null ? null : tiers[selected];
  const buttonLabel = (() => {
    if (!selectedTier) {
      return labels.emptySelection;
    }

    if (selectedTier.custom) {
      return customAmount
        ? `${labels.lightPrefix} — ${labels.currencySymbol}${customAmount}${selectedTier.period}`
        : labels.customAmountRequired;
    }

    return `${labels.lightPrefix} — ${selectedTier.amount}${selectedTier.period}`;
  })();

  return (
    <div
      id="donation-levels"
      className="mt-14 scroll-mt-[200px]"
      aria-label={labels.ariaLabel}
    >
      <div className="grid grid-cols-4 gap-[22px] max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
        {tiers.map((tier, index) => {
          const isLit =
            selected === index && (!tier.custom || customAmount !== "");

          return (
            <Button
              key={tier.name}
              type="button"
              variant="outline"
              className={cn(lanternButtonClass, isLit && styles.lanternLit)}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className={styles.flame} aria-hidden="true" />
              <span className="font-depth text-4xl leading-none text-[var(--paper)]">
                {tier.custom && customAmount ? `$${customAmount}` : tier.amount}
                <span className="ml-1 font-mono text-xs tracking-[0.1em] text-muted-foreground">
                  {tier.period}
                </span>
              </span>
              <Badge
                variant={isLit ? "default" : "secondary"}
                className="h-auto font-mono text-[11px] uppercase tracking-[0.2em]"
              >
                {tier.name}
              </Badge>
              <span className="text-[13.5px] leading-[1.5] text-muted-foreground">
                {tier.description}
              </span>
            </Button>
          );
        })}
      </div>

      {selectedTier?.custom ? (
        <FieldGroup className="mt-6 max-w-sm gap-3">
          <Field orientation="horizontal" className="items-center gap-2">
            <FieldLabel
              htmlFor="custom-donation-amount"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-secondary-foreground"
            >
              {labels.customAmountLabel}
            </FieldLabel>
            <span className="ml-2 text-[15px] text-foreground">
              {labels.currencySymbol}
            </span>
            <Input
              id="custom-donation-amount"
              type="number"
              min="1"
              inputMode="numeric"
              value={customAmount}
              placeholder="50"
              className="w-[110px] font-mono text-[15px] tracking-[0.05em]"
              onChange={(event) =>
                setCustomAmount(event.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <span className="text-xs text-muted-foreground">
              {selectedTier.period}
            </span>
          </Field>
        </FieldGroup>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center gap-[22px] max-[640px]:flex-col max-[640px]:items-start">
        <Button
          type="button"
          className="donate-lava h-auto rounded-full px-[30px] py-4 text-[15px] font-bold text-[var(--ink)] shadow-[0_0_18px_rgba(249,115,22,0.28)] transition-[filter,opacity,transform] duration-300 enabled:hover:-translate-y-0.5 enabled:hover:brightness-110 disabled:opacity-[0.45]"
          disabled={
            selected === null || (selectedTier?.custom && customAmount === "")
          }
        >
          {buttonLabel}
        </Button>
        <Button
          asChild
          variant="link"
          className="h-auto p-0 text-muted-foreground hover:text-foreground"
        >
          <a href="#hero">
            {labels.backToTop}
            <ArrowUpIcon data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
}
