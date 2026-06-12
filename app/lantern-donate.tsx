"use client";

import Link from "next/link";
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
      className={styles.lanternBlock}
      aria-label="Select your donation level"
    >
      <div className={styles.lanternGrid}>
        {tiers.map((tier, index) => {
          const isLit =
            selected === index && (!tier.custom || customAmount !== "");

          return (
            <button
              key={tier.name}
              type="button"
              className={cx(styles.lantern, isLit && styles.lanternLit)}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className={styles.flame} aria-hidden="true" />
              <span className={styles.lanternAmount}>
                {tier.custom && customAmount ? `$${customAmount}` : tier.amount}
                <span className={styles.lanternPer}>{tier.period}</span>
              </span>
              <span className={styles.lanternName}>{tier.name}</span>
              <span className={styles.lanternDesc}>{tier.description}</span>
            </button>
          );
        })}
      </div>

      {selectedTier?.custom ? (
        <label className={styles.customField}>
          your amount
          <span className={styles.customCurrency}>$</span>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={customAmount}
            placeholder="50"
            className={styles.customInput}
            onChange={(event) =>
              setCustomAmount(event.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <span className={styles.customPer}>/mo</span>
        </label>
      ) : null}

      <div className={styles.donateBar}>
        <button
          type="button"
          className={styles.donateButton}
          disabled={
            selected === null || (selectedTier?.custom && customAmount === "")
          }
        >
          {buttonLabel}
        </button>
        <Link href="/" className={styles.ghostLink}>
          Back to the current homepage &rarr;
        </Link>
      </div>
    </div>
  );
}
