"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import styles from "./page.module.css";
import { plushCharacters, storyAdventures, storyMoods } from "./data";
import { PlushTurtle } from "./plush-turtle";
import { QrStamp } from "./qr-stamp";

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

export function StoryLab() {
  const [name, setName] = useState("Milo");
  const [plushId, setPlushId] = useState(plushCharacters[0]?.id ?? "");
  const [adventureId, setAdventureId] = useState(storyAdventures[0]?.id ?? "");
  const [moodId, setMoodId] = useState(storyMoods[0]?.id ?? "");
  const [variant, setVariant] = useState(0);

  const plush =
    plushCharacters.find((item) => item.id === plushId) ?? plushCharacters[0];
  const adventure =
    storyAdventures.find((item) => item.id === adventureId) ?? storyAdventures[0];
  const mood = storyMoods.find((item) => item.id === moodId) ?? storyMoods[0];
  const heroName = name.trim() || "Your turtle";
  const titleBit = pick(adventure.titleBits, variant);
  const quest = pick(adventure.quests, variant + 1);
  const treasure = pick(adventure.treasures, variant + 2);
  const opener = pick(mood.openings, variant);
  const ending = pick(mood.endings, variant + 1);
  const storyTitle = `${heroName} and the ${titleBit}`;
  const storyText = `${opener} ${heroName} hugged ${plush.name}, tapped the tiny shell QR, and stepped into ${adventure.place}. Together they had to ${quest}. They came home carrying ${treasure}, a brand-new laugh, and a story worth retelling. ${ending}`;
  const artCue = `${mood.imageStyle}, ${adventure.visual}, plush turtle colors ${plush.palette.shell} and ${plush.palette.body}, picture-book lighting, child-safe whimsical tone`;

  return (
    <section className={styles.lab} id="story-lab">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionKicker}>Sample story lab</div>
        <h2 className={styles.sectionTitle}>
          Try a <span>mini generation.</span>
        </h2>
        <p className={styles.sectionCopy}>
          This preview shows the QR flow in action: name the turtle, pick a mission,
          and watch the sample story and art direction shift.
        </p>
      </div>

      <div className={styles.labWrap}>
        <div className={styles.labControls}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Kid name</span>
            <input
              className={styles.fieldInput}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              placeholder="Type a name"
            />
          </label>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>Pick a plush</div>
            <div className={styles.choiceGrid}>
              {plushCharacters.map((item) => {
                const isActive = item.id === plush.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      isActive
                        ? `${styles.choiceButton} ${styles.choiceButtonActive}`
                        : styles.choiceButton
                    }
                    style={
                      {
                        "--choice-accent": item.palette.shell,
                        "--choice-body": item.palette.body,
                      } as CSSProperties
                    }
                    onClick={() => {
                      setPlushId(item.id);
                    }}
                  >
                    <span className={styles.choiceSwatch} />
                    <span className={styles.choiceName}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>Choose a mission</div>
            <div className={styles.choiceStack}>
              {storyAdventures.map((item) => {
                const isActive = item.id === adventure.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      isActive
                        ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                        : styles.segmentButton
                    }
                    onClick={() => {
                      setAdventureId(item.id);
                    }}
                  >
                    <span>{item.label}</span>
                    <small>{item.place}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>Pick the story feeling</div>
            <div className={styles.moodRow}>
              {storyMoods.map((item) => {
                const isActive = item.id === mood.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      isActive
                        ? `${styles.moodButton} ${styles.moodButtonActive}`
                        : styles.moodButton
                    }
                    onClick={() => {
                      setMoodId(item.id);
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.labActions}>
            <button
              type="button"
              className={styles.generateButton}
              onClick={() => {
                setVariant((current) => current + 1);
              }}
            >
              Spin a new sample
            </button>
            <div className={styles.demoNote}>
              Demo preview only: the live product would generate fresh text and art
              from the turtle&apos;s QR-linked profile.
            </div>
          </div>
        </div>

        <div
          className={styles.labPreview}
          style={
            {
              "--story-sky": adventure.colors[0],
              "--story-sea": adventure.colors[1],
              "--story-sand": adventure.colors[2],
              "--story-accent": plush.palette.shell,
            } as CSSProperties
          }
        >
          <div className={styles.previewTop}>
            <div>
              <div className={styles.previewLabel}>Activated shell</div>
              <div className={styles.previewName}>{plush.name}</div>
            </div>
            <QrStamp className={styles.previewQr} />
          </div>

          <div className={styles.coverScene}>
            <div className={styles.coverSun} aria-hidden="true" />
            <div className={styles.coverWave} aria-hidden="true" />
            <PlushTurtle palette={plush.palette} className={styles.coverTurtle} />
          </div>

          <div className={styles.storyCard}>
            <div className={styles.storyHeader}>
              <span className={styles.storyMood}>{mood.label}</span>
              <span className={styles.storyLocation}>{adventure.label}</span>
            </div>
            <h3 className={styles.storyTitle}>{storyTitle}</h3>
            <p className={styles.storyText}>{storyText}</p>

            <div className={styles.promptCard}>
              <div className={styles.promptLabel}>AI image cue</div>
              <div className={styles.promptText}>{artCue}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
