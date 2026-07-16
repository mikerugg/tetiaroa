#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const LOCALIZED_FIELDS = [
  "title",
  "slug",
  "summary",
  "heroImage",
  "status",
  "location",
  "metric",
  "tags",
  "htmlPackage",
  "body",
  "gallery",
  "projectDates",
  "affiliation",
  "seoTitle",
  "seoDescription",
  "legacyVid",
  "legacyPath",
];

const SHARED_FIELDS = [
  "entryType",
  "category",
  "secondaryCategories",
  "publishedAt",
  "updatedAt",
  "program",
  "topics",
  "team",
  "organizations",
  "relatedEntries",
  "translationKey",
  "legacyNodeId",
  "legacyBundle",
];

const REPORTED_CONFLICT_FIELDS = [
  "entryType",
  "category",
  "secondaryCategories",
  "publishedAt",
  "updatedAt",
  "program",
  "topics",
  "team",
  "organizations",
  "relatedEntries",
  "legacyNodeId",
  "legacyBundle",
];

const LEGACY_FIELDS_TO_UNSET = ["language", ...LOCALIZED_FIELDS];

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  );
}

function publishedId(id) {
  return id.replace(/^drafts\./, "");
}

function documentLanguage(document) {
  return document.language === "fr" ? "fr" : "en";
}

function groupKey(document) {
  return document.translationKey || `document:${publishedId(document._id)}`;
}

function groupByTranslationKey(documents) {
  const groups = new Map();

  for (const document of documents) {
    const key = groupKey(document);
    const group = groups.get(key) ?? [];
    group.push(document);
    groups.set(key, group);
  }

  return groups;
}

function findLanguageDocument(documents, language) {
  return documents.find((document) => documentLanguage(document) === language);
}

function remapReference(reference, idMap) {
  if (!reference?._ref) {
    return clone(reference);
  }

  const originalId = publishedId(reference._ref);
  const canonicalId = idMap.get(originalId) ?? originalId;

  return {
    ...clone(reference),
    _ref: reference._ref.startsWith("drafts.")
      ? `drafts.${canonicalId}`
      : canonicalId,
  };
}

function remapRelatedEntries(relatedEntries, idMap) {
  return relatedEntries?.map((reference) => remapReference(reference, idMap));
}

export function buildLocalizedContent(document) {
  if (!document) {
    return undefined;
  }

  return compactObject({
    _type: "impactEntryLocale",
    ...Object.fromEntries(
      LOCALIZED_FIELDS.map((field) => [field, clone(document[field])]),
    ),
  });
}

function buildSharedContent(document, idMap) {
  const shared = Object.fromEntries(
    SHARED_FIELDS.map((field) => [field, clone(document?.[field])]),
  );

  if (document?.relatedEntries) {
    shared.relatedEntries = remapRelatedEntries(document.relatedEntries, idMap);
  }

  return compactObject(shared);
}

function valuesMatch(left, right) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function buildConflicts(key, english, french) {
  if (!english || !french) {
    return [];
  }

  return REPORTED_CONFLICT_FIELDS.flatMap((field) =>
    valuesMatch(english[field], french[field])
      ? []
      : [
          {
            translationKey: key,
            field,
            english: clone(english[field]) ?? null,
            french: clone(french[field]) ?? null,
          },
        ],
  );
}

export function createMigrationPlan(publishedDocuments, draftDocuments = []) {
  const publishedGroups = groupByTranslationKey(publishedDocuments);
  const draftGroups = groupByTranslationKey(draftDocuments);
  const idMap = new Map();
  const groupDetails = [];

  for (const [key, documents] of publishedGroups) {
    const english = findLanguageDocument(documents, "en");
    const french = findLanguageDocument(documents, "fr");

    if (documents.length > 2 || documents.filter((doc) => documentLanguage(doc) === "en").length > 1 || documents.filter((doc) => documentLanguage(doc) === "fr").length > 1) {
      throw new Error(`Translation key ${key} does not have a unique document per language.`);
    }

    const canonical = english ?? french;
    if (!canonical) {
      throw new Error(`Translation key ${key} has no usable document.`);
    }

    const canonicalId = publishedId(canonical._id);
    for (const document of documents) {
      idMap.set(publishedId(document._id), canonicalId);
    }
    groupDetails.push({ key, canonicalId, english, french });
  }

  const publishedPatches = [];
  const draftWrites = [];
  const redundantPublishedIds = [];
  const redundantDraftIds = [];
  const conflicts = [];

  for (const group of groupDetails) {
    const sharedSource = group.english ?? group.french;
    const fields = compactObject({
      ...buildSharedContent(sharedSource, idMap),
      english: buildLocalizedContent(group.english),
      french: buildLocalizedContent(group.french),
    });

    publishedPatches.push({ id: group.canonicalId, fields });
    conflicts.push(...buildConflicts(group.key, group.english, group.french));

    if (group.french && publishedId(group.french._id) !== group.canonicalId) {
      redundantPublishedIds.push(publishedId(group.french._id));
    }

    const drafts = draftGroups.get(group.key) ?? [];
    if (!drafts.length) {
      continue;
    }

    const englishDraft = findLanguageDocument(drafts, "en");
    const frenchDraft = findLanguageDocument(drafts, "fr");
    const draftSharedSource = englishDraft ?? group.english ?? frenchDraft ?? group.french;
    const targetDraftId = `drafts.${group.canonicalId}`;
    const draftFields = compactObject({
      ...buildSharedContent(draftSharedSource, idMap),
      english: buildLocalizedContent(englishDraft ?? group.english),
      french: buildLocalizedContent(frenchDraft ?? group.french),
    });
    const targetExists = drafts.some((document) => document._id === targetDraftId);

    draftWrites.push({ id: targetDraftId, fields: draftFields, exists: targetExists });
    for (const draft of drafts) {
      if (draft._id !== targetDraftId) {
        redundantDraftIds.push(draft._id);
      }
    }
  }

  const paired = groupDetails.filter((group) => group.english && group.french).length;
  const englishOnly = groupDetails.filter((group) => group.english && !group.french).length;
  const frenchOnly = groupDetails.filter((group) => !group.english && group.french).length;

  return {
    idMap,
    publishedPatches,
    draftWrites,
    redundantPublishedIds,
    redundantDraftIds,
    conflicts,
    counts: {
      sourcePublished: publishedDocuments.length,
      canonicalPublished: publishedPatches.length,
      paired,
      englishOnly,
      frenchOnly,
      drafts: draftWrites.length,
    },
  };
}

function loadEnvFile(filename) {
  if (!existsSync(filename)) {
    return;
  }

  for (const line of readFileSync(filename, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) {
      continue;
    }

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function getClient() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are required.",
    );
  }

  return {
    dataset,
    client: createClient({
      projectId,
      dataset,
      token,
      apiVersion: "2026-07-02",
      useCdn: false,
      perspective: "raw",
    }),
  };
}

function createBackup(dataset, requestedPath) {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const backupPath = path.resolve(
    requestedPath ?? `.migration-backups/impact-localization-${timestamp}.tar.gz`,
  );
  mkdirSync(path.dirname(backupPath), { recursive: true });

  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "sanity",
      "datasets",
      "export",
      dataset,
      backupPath,
      "--raw",
      "--overwrite",
    ],
    { cwd: process.cwd(), stdio: "inherit" },
  );

  if (result.status !== 0) {
    throw new Error("The dataset backup failed; no migration changes were made.");
  }

  return backupPath;
}

async function writePatches(client, patches, label) {
  const batchSize = 50;

  for (let index = 0; index < patches.length; index += batchSize) {
    const batch = patches.slice(index, index + batchSize);
    let transaction = client.transaction();

    for (const item of batch) {
      transaction = transaction.patch(item.id, {
        set: item.fields,
        unset: LEGACY_FIELDS_TO_UNSET,
      });
    }

    await transaction.commit({ autoGenerateArrayKeys: true });
    console.log(`${label}: ${Math.min(index + batch.length, patches.length)} / ${patches.length}`);
  }
}

async function writeDrafts(client, draftWrites) {
  for (const draft of draftWrites) {
    if (draft.exists) {
      await client
        .patch(draft.id)
        .set(draft.fields)
        .unset(LEGACY_FIELDS_TO_UNSET)
        .commit({ autoGenerateArrayKeys: true });
    } else {
      await client.create({ _id: draft.id, _type: "impactEntry", ...draft.fields });
    }
  }
}

async function deleteDocuments(client, ids, label) {
  const batchSize = 100;

  for (let index = 0; index < ids.length; index += batchSize) {
    const batch = ids.slice(index, index + batchSize);
    let transaction = client.transaction();
    for (const id of batch) {
      transaction = transaction.delete(id);
    }
    await transaction.commit();
    console.log(`${label}: ${Math.min(index + batch.length, ids.length)} / ${ids.length}`);
  }
}

function printPlan(plan) {
  console.log("Impact localization migration");
  console.log(JSON.stringify(plan.counts, null, 2));
  console.log(`Shared-field conflicts (English wins): ${plan.conflicts.length}`);
  for (const conflict of plan.conflicts.slice(0, 80)) {
    console.log(`  ${conflict.translationKey}: ${conflict.field}`);
  }
  if (plan.conflicts.length > 80) {
    console.log(`  …and ${plan.conflicts.length - 80} more`);
  }
}

async function main() {
  loadEnvFile(path.resolve(".env.local"));
  loadEnvFile(path.resolve(".env"));

  const args = new Set(process.argv.slice(2));
  const commit = args.has("--commit");
  const backupArg = process.argv.find((arg) => arg.startsWith("--backup="));
  const backupPath = backupArg?.slice("--backup=".length);
  const { client, dataset } = getClient();
  const [publishedDocuments, draftDocuments, scheduledReleases] = await Promise.all([
    client.fetch(`*[
      _type == "impactEntry" &&
      !(_id in path("drafts.**")) &&
      !(_id in path("versions.**"))
    ]`),
    client.fetch(`*[_type == "impactEntry" && _id in path("drafts.**")]`),
    client.fetch(`*[
      _type == "system.release" &&
      state in ["scheduled", "scheduling"]
    ]{_id, name, "publishAt": metadata.intendedPublishAt}`),
  ]);

  const alreadyLocalized = publishedDocuments.filter(
    (document) => document.english || document.french,
  );
  if (alreadyLocalized.length) {
    throw new Error(
      `${alreadyLocalized.length} published entries already use the bilingual schema. Refusing a partial or repeated migration.`,
    );
  }

  const plan = createMigrationPlan(publishedDocuments, draftDocuments);
  printPlan(plan);

  const redundantIds = plan.redundantPublishedIds;
  const inboundReferences = redundantIds.length
    ? await client.fetch(
        `*[
          references($ids) &&
          !(_id in $migratedIds)
        ]{_id, _type}`,
        {
          ids: redundantIds,
          migratedIds: [
            ...publishedDocuments.map((document) => document._id),
            ...draftDocuments.map((document) => document._id),
          ],
        },
      )
    : [];

  if (inboundReferences.length) {
    throw new Error(
      `Found ${inboundReferences.length} references to French documents outside the migration set: ${inboundReferences
        .slice(0, 10)
        .map((document) => `${document._type}:${document._id}`)
        .join(", ")}`,
    );
  }

  if (!commit) {
    console.log("Dry run only. Re-run with --commit after the compatible application is deployed.");
    return;
  }

  if (scheduledReleases.length) {
    throw new Error(
      `Found ${scheduledReleases.length} scheduled release(s). Remove or publish them before committing this migration.`,
    );
  }

  const savedBackupPath = createBackup(dataset, backupPath);
  console.log(`Backup created: ${savedBackupPath}`);

  await writePatches(client, plan.publishedPatches, "Localized published entries");
  await writeDrafts(client, plan.draftWrites);
  await deleteDocuments(client, plan.redundantDraftIds, "Deleted redundant drafts");
  await deleteDocuments(
    client,
    plan.redundantPublishedIds,
    "Deleted redundant French entries",
  );

  const verification = await client.fetch(`{
    "published": count(*[
      _type == "impactEntry" &&
      !(_id in path("drafts.**")) &&
      !(_id in path("versions.**"))
    ]),
    "english": count(*[_type == "impactEntry" && defined(english.slug.current)]),
    "french": count(*[_type == "impactEntry" && defined(french.slug.current)]),
    "drafts": count(*[_type == "impactEntry" && _id in path("drafts.**")]),
    "legacyLanguageFields": count(*[_type == "impactEntry" && defined(language)])
  }`);

  console.log("Migration complete");
  console.log(JSON.stringify(verification, null, 2));
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
