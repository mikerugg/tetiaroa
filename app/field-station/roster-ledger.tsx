"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Tier = {
  id: string;
  amount: number | null;
  purpose: string;
};

const tiers: Tier[] = [
  { id: "t25", amount: 25, purpose: "Field notebooks, tags & batteries resupplied" },
  { id: "t100", amount: 100, purpose: "One turtle-patrol night, fully staffed" },
  { id: "t250", amount: 250, purpose: "One survey layer digitized into the twin" },
  { id: "t500", amount: 500, purpose: "A junior researcher's month at the Ecostation" },
  { id: "custom", amount: null, purpose: "Captain's discretion — name your own line" },
];

const pastEntries = [
  { date: "12 MAY 26", amount: "$40/MO", name: "R. TEHANI", purpose: "snorkel school kits" },
  { date: "27 MAY 26", amount: "$100/MO", name: "THE OPETAYA FAMILY", purpose: "patrol night" },
  { date: "02 JUN 26", amount: "$500/MO", name: "ANON.", purpose: "ecostation month" },
];

export function RosterLedger() {
  const [tierId, setTierId] = useState("t100");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);

  const tier = tiers.find((candidate) => candidate.id === tierId) ?? tiers[1];
  const amountLabel =
    tier.amount !== null
      ? `$${tier.amount}/MO`
      : customAmount.trim()
        ? `$${customAmount.trim().replace(/^\$+/, "")}/MO`
        : "$––/MO";
  const purposeShort =
    tier.id === "t25"
      ? "field resupply"
      : tier.id === "t100"
        ? "patrol night"
        : tier.id === "t250"
          ? "survey layer"
          : tier.id === "t500"
            ? "ecostation month"
            : "captain's discretion";

  const pickTier = (id: string) => {
    setTierId(id);
    setEntered(false);
  };

  return (
    <div className={styles.roster}>
      <div className={styles.ledger}>
        <header className={styles.ledgerHead}>
          <span>EXPEDITION LOGBOOK — CONTRIBUTIONS</span>
          <span>VOL. I · P. 38</span>
        </header>

        <ul className={styles.ledgerLines}>
          {pastEntries.map((entry) => (
            <li key={entry.date} className={styles.ledgerLine}>
              <span className={styles.ledgerDate}>{entry.date}</span>
              <span className={styles.ledgerAmount}>{entry.amount}</span>
              <span className={styles.ledgerWho}>
                {entry.name} — {entry.purpose}
              </span>
              <span className={styles.ledgerStatus}>ENTERED</span>
            </li>
          ))}
          <li className={`${styles.ledgerLine} ${styles.ledgerLineYours}`}>
            <span className={styles.ledgerDate}>TODAY</span>
            <span className={styles.ledgerAmount}>{amountLabel}</span>
            <span className={styles.ledgerWho}>
              {name.trim() ? name.trim().toUpperCase() : "____________"} — {purposeShort}
            </span>
            <span
              className={`${styles.ledgerStatus} ${entered ? styles.ledgerStatusEntered : styles.ledgerStatusPending}`}
            >
              {entered ? "ENTERED" : "PENDING"}
            </span>
          </li>
        </ul>

        <div className={styles.tierPick} role="group" aria-label="Choose a monthly line item">
          {tiers.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={tierId === candidate.id}
              className={`${styles.tierButton} ${tierId === candidate.id ? styles.tierButtonOn : ""}`}
              onClick={() => pickTier(candidate.id)}
            >
              <span className={styles.tierAmount}>
                {candidate.amount !== null ? `$${candidate.amount}` : "$—"}
                <em>/mo</em>
              </span>
              <span className={styles.tierPurpose}>{candidate.purpose}</span>
            </button>
          ))}
        </div>

        {tier.id === "custom" ? (
          <label className={styles.customRow}>
            <span>YOUR AMOUNT, USD —</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="75"
              value={customAmount}
              onChange={(event) => {
                setCustomAmount(event.target.value);
                setEntered(false);
              }}
            />
          </label>
        ) : null}

        <label className={styles.signRow}>
          <span>SIGN THE ROSTER — PRINT YOUR NAME:</span>
          <input
            type="text"
            placeholder="e.g. Moana Temaru"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setEntered(false);
            }}
          />
        </label>

        <button
          type="button"
          className={styles.enterButton}
          onClick={() => setEntered(true)}
        >
          Enter it in the logbook — {amountLabel.toLowerCase()}
        </button>
        <p className={styles.ledgerFine}>
          Monthly, cancel anytime. Every line item is reported back in the
          annual expedition ledger, posted to all members.
        </p>
      </div>

      <aside className={styles.memberCard} data-entered={entered ? "true" : "false"}>
        <p className={styles.memberKicker}>TETIAROA SOCIETY — FIELD STATION</p>
        <p className={styles.memberRole}>Expedition Member</p>
        <p className={styles.memberName}>
          {name.trim() ? name.trim() : "Your Name Here"}
        </p>
        <p className={styles.memberMeta}>№ 0249 · VOL. I · EST. 2010</p>
        <p className={styles.memberMeta}>17°00′ S — 149°34′ W</p>
        <span className={styles.memberSeal} aria-hidden="true">
          TS
        </span>
        <span className={styles.memberStamp} aria-hidden="true">
          ABOARD
        </span>
      </aside>
    </div>
  );
}
