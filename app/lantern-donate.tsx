"use client";

import { useState } from "react";
import styles from "./home-experience.module.css";

export type LanternTier = {
  amount: string;
  period: string;
  name: string;
  description: string;
  custom?: boolean;
};

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

const lanternButtonClass =
  "flex cursor-pointer flex-col items-start gap-2.5 rounded-[20px] border border-white/[0.14] bg-[#0a1626]/60 px-[22px] pb-6 pt-[26px] text-left font-[inherit] text-[#f4f1ea]/90 transition-all duration-300 hover:-translate-y-[3px] hover:border-[#ffb454]/40";

export function LanternDonate({ tiers }: { tiers: LanternTier[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const selectedTier = selected === null ? null : tiers[selected];
  const buttonLabel = (() => {
    if (!selectedTier) {
      return "Pick a lantern to light";
    }

    if (selectedTier.custom) {
      return customAmount
        ? `Light the path — $${customAmount}/mo`
        : "Enter an amount to light it";
    }

    return `Light the path — ${selectedTier.amount}${selectedTier.period}`;
  })();

  return (
    <div
      id="donation-levels"
      className="mt-14 scroll-mt-[200px]"
      aria-label="Select your donation level"
    >
      <div className="grid grid-cols-4 gap-[22px] max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
        {tiers.map((tier, index) => {
          const isLit =
            selected === index && (!tier.custom || customAmount !== "");

          return (
            <button
              key={tier.name}
              type="button"
              className={cx(lanternButtonClass, isLit && styles.lanternLit)}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className={styles.flame} aria-hidden="true" />
              <span className="font-depth text-4xl leading-none text-[var(--paper)]">
                {tier.custom && customAmount ? `$${customAmount}` : tier.amount}
                <span className="ml-1 font-mono text-xs tracking-[0.1em] text-[#f4f1ea]/60">
                  {tier.period}
                </span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffd9a0]">
                {tier.name}
              </span>
              <span className="text-[13.5px] leading-[1.5] text-[#f4f1ea]/70">
                {tier.description}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTier?.custom ? (
        <label className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ffd9a0]/85">
          your amount
          <span className="ml-2 text-[15px] text-[var(--paper)]">$</span>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={customAmount}
            placeholder="50"
            className="w-[110px] rounded-[10px] border border-[#ffb454]/40 bg-[#0a1626]/70 px-3 py-2.5 font-mono text-[15px] tracking-[0.05em] text-[var(--paper)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#ffb454]/60"
            onChange={(event) =>
              setCustomAmount(event.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <span className="text-xs text-[#f4f1ea]/60">/mo</span>
        </label>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center gap-[22px] max-[640px]:flex-col max-[640px]:items-start">
        <button
          type="button"
          className="rounded-full bg-[var(--flame)] px-[30px] py-4 text-[15px] font-bold text-[#241303] transition-[opacity,transform] duration-300 enabled:cursor-pointer enabled:hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-[0.45]"
          disabled={
            selected === null || (selectedTier?.custom && customAmount === "")
          }
        >
          {buttonLabel}
        </button>
        <a
          href="#hero"
          className="border-b border-[#f4f1ea]/30 pb-0.5 text-[#f4f1ea]/75 hover:text-[var(--paper)]"
        >
          Back to the top &uarr;
        </a>
      </div>
    </div>
  );
}
