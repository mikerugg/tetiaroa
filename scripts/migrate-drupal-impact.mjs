#!/usr/bin/env node

import { createReadStream, existsSync, readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@sanity/client";

const rootDir = process.cwd();
const legacyDir = path.join(rootDir, "tetiaroa-old");
const sqlPath = path.join(
  legacyDir,
  "tetiaroa_dev_2026-06-05T17-48-47_UTC_database.sql",
);
const filesDir = path.join(legacyDir, "files_dev");
const cacheDir = path.join(rootDir, ".migration-cache");
const assetCachePath = path.join(cacheDir, "drupal-impact-assets.json");

loadLocalEnvFile(path.join(rootDir, ".env.local"));
loadLocalEnvFile(path.join(rootDir, ".env"));

const args = new Set(process.argv.slice(2));
const isWrite = args.has("--write") || args.has("--import");
const isDryRun = !isWrite || args.has("--dry-run");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : 0;
const migrationConcurrency = Math.max(
  1,
  Number.parseInt(
    process.env.MIGRATION_CONCURRENCY ?? (isDryRun ? "16" : "8"),
    10,
  ) || 1,
);

const supportedLanguages = ["en", "fr"];
const publishedBundles = new Set([
  "article",
  "casup_project",
  "document",
  "educ_activity",
  "guide_content",
  "nature_notes",
  "nature_series",
  "news_videos",
  "newsletter",
  "organism_p",
  "organisms",
  "partner",
  "plain_page",
  "simple_page",
  "ts_people",
  "video_series_landing",
]);
const draftBundles = new Set(["project_updates"]);

const bodyFieldTables = [
  "node__field_body_top",
  "node__field_bodytop",
  "node__body",
  "node__field_intro",
  "node__field_intro_text",
  "node__field_description",
  "node__field_body2",
  "node__field_body3",
  "node__field_gallery_intro",
  "node__field_meta",
  "node__field_header",
  "node__field_quote",
];

const heroFieldTables = [
  "node__field_news_thumb",
  "node__field_header_image",
  "node__field_teaser_thumb",
  "node__field_image",
  "node__field_doc_thumb",
  "node__field_pdf_thumb",
  "node__field_video_thumb",
];

const mediaHeroFieldTables = [
  "node__field_teaser_media",
  "node__field_video_hero",
  "node__field_hero",
  "node__field_media_gallery",
];

const galleryFieldTables = [
  "node__field_images",
  "node__field_image2",
  "node__field_image3",
  "node__field_media_gallery",
];

const fileFieldTables = [
  "node__field_docs",
  "node__field_documents",
  "node__field_resource_doc",
  "node__field_user_guide_doc",
  "node__field_gdoc",
  "node__field_files_over_ajax",
];

const dateFieldTables = [
  "node__field_post_date",
  "node__field_date",
  "node__field_project_startdate",
  "node__field_dates",
  "node__field_mission_dates",
];

const tagFieldTables = [
  "node__field_tags",
  "node__field_blog_tags",
  "node__field_tag2",
];

const relatedFieldTables = [
  "node__field_related_projects",
  "node__field_related_content",
  "node__field_project_reference",
];

const linkFieldTables = [
  "node__field_article_link",
  "node__field_link_to_article",
  "node__field_website",
  "node__field_source",
  "node__field_sources",
  "node__field_video_embed",
  "node__field_embedded_video",
  "node__field_video",
  "node__field_sprout_vid",
  "node__field_sprout_vid2",
  "node__field_sprout_video",
  "node__field_sproutvideo",
];

const mediaFieldTables = [
  "media",
  "media_field_data",
  "media__field_media_image",
  "media__field_media_document",
  "media__field_media_video_file",
  "media__field_media_audio_file",
  "media__field_media_oembed_video",
  "media__field_media_oembed_youtube_vimeo",
  "media__field_media_oembed_sprout",
  "media__field_pdf_thumb",
  "media__field_cover_page",
];

const allTables = [
  "node_field_data",
  "node__body",
  "path_alias",
  "file_managed",
  "taxonomy_term_field_data",
  ...bodyFieldTables,
  ...heroFieldTables,
  ...mediaHeroFieldTables,
  ...galleryFieldTables,
  ...fileFieldTables,
  ...dateFieldTables,
  ...tagFieldTables,
  ...relatedFieldTables,
  ...linkFieldTables,
  "node__field_affiliation",
  "node__field_position",
  "node__field_principal_investigator",
  "node__field_funding",
  ...mediaFieldTables,
];

const uniqueTables = [...new Set(allTables)];

const report = {
  mode: isDryRun ? "dry-run" : "write",
  included: { published: 0, drafts: 0 },
  skipped: 0,
  byBundleLanguageStatus: new Map(),
  includedByBundleLanguage: new Map(),
  skippedByBundleLanguage: new Map(),
  missingAssets: new Map(),
  referencedAssets: 0,
  uploadedAssets: 0,
  cachedAssets: 0,
  slugCollisions: [],
  bodyWarnings: [],
  documentsBuilt: 0,
};

if (!existsSync(sqlPath)) {
  throw new Error(`Drupal SQL dump not found at ${sqlPath}`);
}

if (!existsSync(filesDir)) {
  throw new Error(`Drupal files directory not found at ${filesDir}`);
}

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN;

if (!isDryRun && (!projectId || !dataset || !token)) {
  throw new Error(
    "Write mode requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN.",
  );
}

const client =
  !isDryRun && projectId && dataset && token
    ? createClient({
        projectId,
        dataset,
        token,
        apiVersion: "2026-07-02",
        useCdn: false,
      })
    : null;

function loadLocalEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

    if (!match || process.env[match[1]] !== undefined) {
      continue;
    }

    process.env[match[1]] = normalizeEnvValue(match[2]);
  }
}

function normalizeEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if (
    (quote === "\"" || quote === "'") &&
    trimmed.endsWith(quote)
  ) {
    const unquoted = trimmed.slice(1, -1);
    return quote === "\""
      ? unquoted.replace(/\\n/g, "\n").replace(/\\r/g, "\r")
      : unquoted;
  }

  return trimmed;
}

let tables;
let indexes;
let assetResolver;
let selectedRows;
let docIdByNodeLanguage;
let pathByNodeLanguage;
let usedSlugsByLanguage;
let slugByNodeLanguage;
let aliasToImpactHref;

async function main() {
  const sql = await fs.readFile(sqlPath, "utf8");
  tables = parseNeededTables(sql, uniqueTables);
  indexes = buildIndexes(tables);
  assetResolver = new AssetResolver(client);
  await assetResolver.loadCache();

  const importedRows = getImportRows(tables.node_field_data ?? []);
  selectedRows = limit > 0 ? importedRows.slice(0, limit) : importedRows;
  docIdByNodeLanguage = new Map();
  pathByNodeLanguage = new Map();
  usedSlugsByLanguage = new Map([
    ["en", new Map()],
    ["fr", new Map()],
  ]);
  slugByNodeLanguage = new Map();

  for (const row of selectedRows) {
    const language = normalizeLanguage(row.langcode);
    const nid = numberValue(row.nid);
    const isDraft = shouldCreateDraft(row);
    const id = getDocumentId(nid, language, isDraft);
    docIdByNodeLanguage.set(`${nid}:${language}`, id);
    pathByNodeLanguage.set(
      `${nid}:${language}`,
      getLegacyAlias(nid, language) ?? `/node/${nid}`,
    );
  }

  aliasToImpactHref = buildAliasToImpactHref();
  const documents = (
    await mapWithConcurrency(selectedRows, migrationConcurrency, async (row) => {
      const doc = await buildImpactDocument(row);
      return doc;
    })
  ).filter(Boolean);

  applyRelatedEntryReferences(documents);
  report.documentsBuilt = documents.length;

  if (!isDryRun) {
    await deleteLegacyDottedMigrationDocuments();
    await writeDocuments(documents);
    await assetResolver.saveCache();
  }

  printReport(documents);
}

function parseNeededTables(dump, tableNames) {
  const parsed = {};

  for (const tableName of tableNames) {
    const columns = getTableColumns(dump, tableName);

    if (!columns.length) {
      parsed[tableName] = [];
      continue;
    }

    parsed[tableName] = parseTableRows(dump, tableName, columns);
  }

  return parsed;
}

function getTableColumns(dump, tableName) {
  const start = dump.indexOf(`CREATE TABLE \`${tableName}\``);

  if (start === -1) {
    return [];
  }

  const end = dump.indexOf("\n) ENGINE=", start);
  const block = dump.slice(start, end === -1 ? start + 5000 : end);

  return block
    .split("\n")
    .flatMap((line) => {
      const match = line.match(/^\s*`([^`]+)`\s+/);
      return match ? [match[1]] : [];
    });
}

function parseTableRows(dump, tableName, columns) {
  const marker = `INSERT INTO \`${tableName}\` VALUES `;
  const rows = [];
  let index = 0;

  while (index < dump.length) {
    const start = dump.indexOf(marker, index);

    if (start === -1) {
      break;
    }

    const valuesStart = start + marker.length;
    const end = dump.indexOf(";\n", valuesStart);
    const values = dump.slice(valuesStart, end === -1 ? dump.length : end);
    parseInsertValues(values, columns, rows);
    index = end === -1 ? dump.length : end + 2;
  }

  return rows;
}

function parseInsertValues(values, columns, rows) {
  let index = 0;

  while (index < values.length) {
    if (values[index] !== "(") {
      index += 1;
      continue;
    }

    index += 1;
    const rowValues = [];

    while (index < values.length && values[index] !== ")") {
      const parsed = parseSqlValue(values, index);
      rowValues.push(parsed.value);
      index = parsed.nextIndex;

      if (values[index] === ",") {
        index += 1;
      }
    }

    if (values[index] === ")") {
      index += 1;
    }

    const row = {};

    for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      row[columns[columnIndex]] = rowValues[columnIndex] ?? null;
    }

    rows.push(row);
  }
}

function parseSqlValue(input, startIndex) {
  if (input[startIndex] === "'") {
    let index = startIndex + 1;
    let value = "";

    while (index < input.length) {
      const char = input[index];

      if (char === "\\") {
        const next = input[index + 1];
        value += decodeEscape(next);
        index += 2;
        continue;
      }

      if (char === "'") {
        return { value, nextIndex: index + 1 };
      }

      value += char;
      index += 1;
    }

    return { value, nextIndex: index };
  }

  let index = startIndex;

  while (
    index < input.length &&
    input[index] !== "," &&
    input[index] !== ")"
  ) {
    index += 1;
  }

  const rawValue = input.slice(startIndex, index).trim();

  if (rawValue === "NULL") {
    return { value: null, nextIndex: index };
  }

  if (/^-?\d+(?:\.\d+)?$/.test(rawValue)) {
    return { value: Number(rawValue), nextIndex: index };
  }

  return { value: rawValue, nextIndex: index };
}

function decodeEscape(value) {
  switch (value) {
    case "n":
      return "\n";
    case "r":
      return "\r";
    case "t":
      return "\t";
    case "0":
      return "\0";
    case undefined:
      return "";
    default:
      return value;
  }
}

function buildIndexes(parsedTables) {
  const fieldIndex = new Map();
  const mediaFieldIndex = new Map();
  const filesByFid = new Map();
  const filesByUri = new Map();
  const filesByBasename = new Map();
  const taxonomyByTidLanguage = new Map();
  const mediaByMid = new Map();
  const mediaUuidByMid = new Map();
  const mediaMidByUuid = new Map();
  const aliasesByNodeLanguage = new Map();

  for (const row of parsedTables.file_managed ?? []) {
    const fid = numberValue(row.fid);

    if (!fid) {
      continue;
    }

    filesByFid.set(fid, row);

    if (row.uri) {
      filesByUri.set(String(row.uri), row);
    }

    const basename = row.filename ? String(row.filename).toLowerCase() : "";

    if (basename) {
      const existing = filesByBasename.get(basename) ?? [];
      existing.push(row);
      filesByBasename.set(basename, existing);
    }
  }

  for (const row of parsedTables.taxonomy_term_field_data ?? []) {
    taxonomyByTidLanguage.set(`${row.tid}:${row.langcode}`, row.name);
  }

  for (const row of parsedTables.media_field_data ?? []) {
    mediaByMid.set(numberValue(row.mid), row);
  }

  for (const row of parsedTables.media ?? []) {
    const mid = numberValue(row.mid);
    const uuid = stringValue(row.uuid);

    if (mid && uuid) {
      mediaUuidByMid.set(mid, uuid);
      mediaMidByUuid.set(uuid, mid);
    }
  }

  for (const row of parsedTables.path_alias ?? []) {
    if (numberValue(row.status) !== 1) {
      continue;
    }

    const pathValue = stringValue(row.path);
    const match = pathValue.match(/^\/node\/(\d+)$/);

    if (!match) {
      continue;
    }

    aliasesByNodeLanguage.set(
      `${match[1]}:${row.langcode}`,
      normalizePath(row.alias),
    );
  }

  for (const [tableName, rows] of Object.entries(parsedTables)) {
    if (!tableName.startsWith("node__field_") && tableName !== "node__body") {
      continue;
    }

    const tableIndex = new Map();

    for (const row of rows) {
      if (numberValue(row.deleted) !== 0) {
        continue;
      }

      const key = `${row.entity_id}:${row.langcode}`;
      const existing = tableIndex.get(key) ?? [];
      existing.push(row);
      tableIndex.set(key, existing);
    }

    for (const value of tableIndex.values()) {
      value.sort((left, right) => numberValue(left.delta) - numberValue(right.delta));
    }

    fieldIndex.set(tableName, tableIndex);
  }

  for (const [tableName, rows] of Object.entries(parsedTables)) {
    if (!tableName.startsWith("media__field_")) {
      continue;
    }

    const tableIndex = new Map();

    for (const row of rows) {
      if (numberValue(row.deleted) !== 0) {
        continue;
      }

      const key = `${row.entity_id}:${row.langcode}`;
      const existing = tableIndex.get(key) ?? [];
      existing.push(row);
      tableIndex.set(key, existing);
    }

    mediaFieldIndex.set(tableName, tableIndex);
  }

  return {
    aliasesByNodeLanguage,
    fieldIndex,
    filesByBasename,
    filesByFid,
    filesByUri,
    mediaByMid,
    mediaFieldIndex,
    mediaMidByUuid,
    mediaUuidByMid,
    taxonomyByTidLanguage,
  };
}

function getImportRows(rows) {
  const importRows = [];

  for (const row of rows) {
    const language = normalizeLanguage(row.langcode);
    const bundle = stringValue(row.type);
    const status = numberValue(row.status);
    const countKey = `${bundle}:${language}:${status ? "published" : "unpublished"}`;

    incrementMap(report.byBundleLanguageStatus, countKey);

    if (!language || !supportedLanguages.includes(language)) {
      report.skipped += 1;
      continue;
    }

    const includePublished = publishedBundles.has(bundle) && status === 1;
    const includeDraft = draftBundles.has(bundle) && status === 0;

    if (includePublished || includeDraft) {
      importRows.push(row);
      incrementMap(report.includedByBundleLanguage, `${bundle}:${language}`);

      if (includeDraft) {
        report.included.drafts += 1;
      } else {
        report.included.published += 1;
      }
    } else {
      report.skipped += 1;
      incrementMap(report.skippedByBundleLanguage, `${bundle}:${language}`);
    }
  }

  return importRows;
}

async function buildImpactDocument(row) {
  const nid = numberValue(row.nid);
  const language = normalizeLanguage(row.langcode);
  const bundle = stringValue(row.type);
  const title = getDocumentTitle(row, nid, language);
  const legacyAlias = getLegacyAlias(nid, language) ?? `/node/${nid}`;
  const slug = getSlugForRow(row, legacyAlias);
  const isDraft = shouldCreateDraft(row);
  const id = getDocumentId(nid, language, isDraft);
  const bodyHtml = getBodyHtml(nid, language);
  const fieldDocumentBlocks = await getDocumentBlocks(nid, language);
  const fieldVideoBlocks = getVideoBlocks(nid, language);
  const body = [
    ...(await htmlToPortableText(bodyHtml, {
      nid,
      language,
      title,
    })),
    ...fieldDocumentBlocks,
    ...fieldVideoBlocks,
  ];
  const heroImage = await getHeroImage(nid, language, row, title);
  const gallery = await getGallery(nid, language, heroImage?._sourceFid);
  const summary = getSummary(nid, language, row);
  const publishedAt = getPublishedAt(nid, language, row);
  const updatedAt = unixToIso(row.changed) ?? publishedAt;
  const category = getCategory(bundle, legacyAlias, row.title);
  const secondaryCategories = getSecondaryCategories(bundle, category);
  const tags = getTags(nid, language, bundle, row);
  const projectDates = getProjectDates(nid, language);
  const affiliation = getFirstTextField(nid, language, [
    "node__field_affiliation",
    "node__field_position",
  ]);
  const doc = pruneUndefined({
    _id: id,
    _type: "impactEntry",
    title,
    slug: { _type: "slug", current: slug },
    language,
    translationKey: `drupal-node-${nid}`,
    legacyNodeId: nid,
    legacyVid: numberValue(row.vid) || undefined,
    legacyBundle: bundle,
    legacyPath: legacyAlias,
    entryType: getEntryType(bundle),
    summary,
    heroImage: heroImage ? omitSourceMeta(heroImage) : undefined,
    publishedAt,
    updatedAt,
    status: isDraft ? "Needs editorial review" : "Published",
    location: getLocation(bundle),
    metric: getMetric(bundle),
    category,
    secondaryCategories,
    tags,
    body,
    gallery,
    projectDates,
    affiliation: affiliation || undefined,
    relatedEntries: [],
    seoTitle: title,
    seoDescription: summary,
  });

  return doc;
}

function getDocumentTitle(row, nid, language) {
  if (nid === 708 && language === "en") {
    return "Elena Hereiti Lelong";
  }

  return stringValue(row.title) || `Drupal node ${nid}`;
}

function getDocumentId(nid, language, isDraft) {
  const baseId = `impactEntry-drupal-${nid}-${language}`;
  return isDraft ? `drafts.${baseId}` : baseId;
}

function shouldCreateDraft(row) {
  return draftBundles.has(stringValue(row.type)) && numberValue(row.status) === 0;
}

function getLegacyAlias(nid, language) {
  return (
    indexes.aliasesByNodeLanguage.get(`${nid}:${language}`) ??
    indexes.aliasesByNodeLanguage.get(`${nid}:en`) ??
    null
  );
}

function buildAliasToImpactHref() {
  const aliasMap = new Map();

  for (const row of selectedRows) {
    const language = normalizeLanguage(row.langcode);
    const nid = numberValue(row.nid);
    const alias = pathByNodeLanguage.get(`${nid}:${language}`);
    const isDraft = shouldCreateDraft(row);

    if (!alias || isDraft) {
      continue;
    }

    const slug = getSlugForRow(row, alias);
    const href = language === "fr" ? `/fr/impact/${slug}` : `/impact/${slug}`;
    aliasMap.set(alias, href);
    aliasMap.set(`/node/${nid}`, href);
  }

  return aliasMap;
}

function getSlugForRow(row, legacyAlias) {
  const language = normalizeLanguage(row.langcode);
  const nid = numberValue(row.nid);
  const nodeLanguageKey = `${nid}:${language}`;
  const cachedSlug = slugByNodeLanguage.get(nodeLanguageKey);

  if (cachedSlug) {
    return cachedSlug;
  }

  const lastSegment = legacyAlias.split("/").filter(Boolean).at(-1);
  const base = slugify(lastSegment || stringValue(row.title) || `node-${nid}`);
  const languageSlugs = usedSlugsByLanguage.get(language);
  const existing = languageSlugs.get(base);

  if (!existing || existing === nid) {
    languageSlugs.set(base, nid);
    slugByNodeLanguage.set(nodeLanguageKey, base);
    return base;
  }

  const withNid = `${base}-${nid}`;
  report.slugCollisions.push({
    language,
    slug: base,
    nid,
    existingNid: existing,
    resolvedSlug: withNid,
  });
  languageSlugs.set(withNid, nid);
  slugByNodeLanguage.set(nodeLanguageKey, withNid);
  return withNid;
}

function getBodyHtml(nid, language) {
  const chunks = [];

  for (const tableName of bodyFieldTables) {
    for (const row of getFieldRows(tableName, nid, language)) {
      const value = getTextValueFromRow(row);

      if (value && !chunks.includes(value)) {
        chunks.push(value);
      }
    }
  }

  return chunks.join("\n\n");
}

function getSummary(nid, language, row) {
  const bodyRows = getFieldRows("node__body", nid, language);
  const explicitSummary = firstNonEmpty(
    ...bodyRows.map((bodyRow) => stringValue(bodyRow.body_summary)),
    getFirstTextField(nid, language, [
      "node__field_intro",
      "node__field_intro_text",
      "node__field_description",
      "node__field_meta",
    ]),
  );
  const source = explicitSummary || getBodyHtml(nid, language) || stringValue(row.title);
  return truncateText(cleanText(source), 260) || "From the Tetiaroa Society archive.";
}

function getPublishedAt(nid, language, row) {
  for (const tableName of dateFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const dateValue = getDateValueFromRow(fieldRow);
      const iso = normalizeDateToIso(dateValue);

      if (iso) {
        return iso;
      }
    }
  }

  return unixToIso(row.created) ?? "1970-01-01T00:00:00.000Z";
}

function getProjectDates(nid, language) {
  const missionDates = getFirstTextField(nid, language, [
    "node__field_dates",
    "node__field_mission_dates",
  ]);

  if (missionDates) {
    return cleanText(missionDates);
  }

  const startDate = getFirstDateField(nid, language, [
    "node__field_project_startdate",
  ]);

  return startDate ? startDate.slice(0, 10) : undefined;
}

function getFirstDateField(nid, language, tableNames) {
  for (const tableName of tableNames) {
    for (const row of getFieldRows(tableName, nid, language)) {
      const iso = normalizeDateToIso(getDateValueFromRow(row));

      if (iso) {
        return iso;
      }
    }
  }

  return null;
}

function getFirstTextField(nid, language, tableNames) {
  for (const tableName of tableNames) {
    for (const row of getFieldRows(tableName, nid, language)) {
      const value = cleanText(getTextValueFromRow(row));

      if (value) {
        return value;
      }
    }
  }

  return "";
}

const structuralTagKeys = new Set(
  [
    "Project",
    "Article",
    "News",
    "Report",
    "Profile",
    "Partner",
    "Document",
    "Documents",
    "Reports",
    "Newsletter",
    "Guide",
    "Video",
    "Project Update",
  ].map(normalizeImportedTagKey),
);

function normalizeImportedTagKey(value) {
  return String(value)
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isStructuralTag(value) {
  return structuralTagKeys.has(normalizeImportedTagKey(value));
}

function getTags(nid, language, bundle, row) {
  const values = new Set();

  for (const tableName of tagFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const tid = getTargetId(fieldRow);
      const label =
        indexes.taxonomyByTidLanguage.get(`${tid}:${language}`) ??
        indexes.taxonomyByTidLanguage.get(`${tid}:en`);

      if (label) {
        values.add(getImportedTagLabel(cleanText(label), bundle));
      }
    }
  }

  if (bundle === "ts_people") {
    const position = getFirstTextField(nid, language, ["node__field_position"]);
    const isStaffProfile = [...values].some(
      (value) => String(value).toLowerCase() === "staff",
    );

    if (position && !isStaffProfile) {
      values.add(position);
    }
  }

  if (bundle === "casup_project") {
    const investigator = getFirstTextField(nid, language, [
      "node__field_principal_investigator",
    ]);

    if (investigator) {
      values.add(investigator);
    }
  }

  const title = stringValue(row.title).toLowerCase();

  if (title.includes("tarp")) {
    values.add("TARP");
  }

  return [...values]
    .filter((value) => value && !isStructuralTag(value))
    .slice(0, 12);
}

function getImportedTagLabel(label, bundle) {
  if (bundle === "ts_people") {
    switch (label.toLowerCase()) {
      case "board-member":
      case "board member":
      case "board":
        return "Board Member";
      case "staff":
      case "management":
        return "Staff";
      default:
        return label;
    }
  }

  return label;
}

function getEntryType(bundle) {
  switch (bundle) {
    case "casup_project":
      return "Project";
    case "project_updates":
      return "Project Update";
    case "document":
      return "Report";
    case "newsletter":
      return "Newsletter";
    case "guide_content":
    case "organism_p":
    case "organisms":
    case "educ_activity":
      return "Guide";
    case "news_videos":
    case "video_series_landing":
      return "Video";
    case "ts_people":
      return "Profile";
    case "partner":
      return "Partner";
    case "nature_notes":
      return "News";
    default:
      return "Article";
  }
}

function getCategory(bundle, legacyAlias, title) {
  const haystack = `${legacyAlias} ${title}`.toLowerCase();

  if (bundle === "ts_people") {
    return "People";
  }

  if (bundle === "partner") {
    return "Partners";
  }

  if (bundle === "document") {
    return "Reports";
  }

  if (["guide_content", "organism_p", "organisms"].includes(bundle)) {
    return "Nature Guide";
  }

  if (bundle === "newsletter" || bundle === "news_videos") {
    return "News";
  }

  if (bundle === "educ_activity") {
    return "Education";
  }

  if (haystack.includes("biosecurity")) {
    return "Biosecurity";
  }

  if (haystack.includes("turtle") || haystack.includes("bird")) {
    return "Wildlife";
  }

  if (haystack.includes("culture")) {
    return "Culture";
  }

  if (haystack.includes("tarp")) {
    return "TARP";
  }

  if (bundle === "nature_notes" || bundle === "nature_series") {
    return "News";
  }

  return "Research";
}

function getSecondaryCategories(bundle, primaryCategory) {
  const categories = new Set();

  if (bundle === "casup_project") {
    categories.add("Conservation");
  }

  if (["guide_content", "organism_p", "organisms", "nature_notes"].includes(bundle)) {
    categories.add("Wildlife");
  }

  if (["article", "plain_page", "simple_page"].includes(bundle)) {
    categories.add("News");
  }

  categories.delete(primaryCategory);
  return [...categories];
}

function getMetric(bundle) {
  switch (bundle) {
    case "casup_project":
      return "Research project";
    case "project_updates":
      return "Project update";
    case "document":
      return "Report";
    case "newsletter":
      return "Newsletter";
    case "ts_people":
      return "Profile";
    case "partner":
      return "Partner";
    case "guide_content":
    case "organism_p":
    case "organisms":
      return "Nature guide entry";
    default:
      return "From the Archive";
  }
}

function getLocation(bundle) {
  if (bundle === "partner" || bundle === "ts_people") {
    return "Global network";
  }

  return "Tetiaroa";
}

async function getHeroImage(nid, language, row, fallbackAlt = stringValue(row.title)) {
  for (const tableName of heroFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const image = await imageFromFileField(fieldRow, fallbackAlt);

      if (image) {
        return image;
      }
    }
  }

  for (const tableName of mediaHeroFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const image = await imageFromMediaReference(fieldRow, fallbackAlt, language);

      if (image) {
        return image;
      }
    }
  }

  return null;
}

async function getGallery(nid, language, heroFid) {
  const gallery = [];
  const seen = new Set([heroFid].filter(Boolean));

  for (const tableName of galleryFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const image =
        tableName === "node__field_media_gallery"
          ? await imageFromMediaReference(fieldRow, "", language)
          : await imageFromFileField(fieldRow, "");

      if (!image || seen.has(image._sourceFid)) {
        continue;
      }

      seen.add(image._sourceFid);
      gallery.push({
        _key: createKey("gallery", nid, gallery.length),
        image: omitSourceMeta(image),
        alt: image.alt ?? "",
        caption: image.caption,
      });
    }
  }

  return gallery;
}

async function imageFromFileField(fieldRow, fallbackAlt) {
  const fid = getTargetId(fieldRow);
  const fileRow = indexes.filesByFid.get(fid);

  if (!fileRow || !isImageFile(fileRow)) {
    return null;
  }

  const asset = await assetResolver.resolveFile(fileRow, "image");

  if (!asset) {
    return null;
  }

  return pruneUndefined({
    _type: "image",
    _sourceFid: fid,
    asset,
    alt: getAltFromRow(fieldRow) || fallbackAlt || stringValue(fileRow.filename),
    caption: getTitleFromRow(fieldRow) || undefined,
  });
}

async function imageFromMediaReference(fieldRow, fallbackAlt, language) {
  const mediaId = getTargetId(fieldRow) || mediaIdFromUuid(getEntityUuid(fieldRow));

  if (!mediaId) {
    return null;
  }

  const mediaRow = indexes.mediaByMid.get(mediaId);
  const imageRows = getMediaFieldRows(
    "media__field_media_image",
    mediaId,
    language,
  );
  const coverRows = getMediaFieldRows("media__field_cover_page", mediaId, language);
  const pdfThumbRows = getMediaFieldRows("media__field_pdf_thumb", mediaId, language);
  const fieldFileRow = [...imageRows, ...coverRows, ...pdfThumbRows][0];

  if (!fieldFileRow) {
    return null;
  }

  return imageFromFileField(
    fieldFileRow,
    getAltFromRow(fieldFileRow) ||
      fallbackAlt ||
      stringValue(mediaRow?.name) ||
      "",
  );
}

async function getDocumentBlocks(nid, language) {
  const blocks = [];

  for (const tableName of fileFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const fid = getTargetId(fieldRow);
      const fileRow = indexes.filesByFid.get(fid);

      if (!fileRow) {
        continue;
      }

      const asset = await assetResolver.resolveFile(fileRow, "file");

      if (!asset) {
        continue;
      }

      blocks.push({
        _key: createKey("doc", nid, blocks.length),
        _type: "documentLink",
        title:
          getTitleFromRow(fieldRow) ||
          stringValue(fileRow.filename) ||
          "Document",
        file: { _type: "file", asset },
      });
    }
  }

  for (const tableName of mediaHeroFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const mediaId = getTargetId(fieldRow);
      const mediaRow = indexes.mediaByMid.get(mediaId);
      const documentRows = getMediaFieldRows(
        "media__field_media_document",
        mediaId,
        language,
      );

      for (const documentRow of documentRows) {
        const fid = getTargetId(documentRow);
        const fileRow = indexes.filesByFid.get(fid);

        if (!fileRow) {
          continue;
        }

        const asset = await assetResolver.resolveFile(fileRow, "file");

        if (!asset) {
          continue;
        }

        blocks.push({
          _key: createKey("media-doc", nid, blocks.length),
          _type: "documentLink",
          title:
            getTitleFromRow(documentRow) ||
            stringValue(mediaRow?.name) ||
            stringValue(fileRow.filename) ||
            "Document",
          file: { _type: "file", asset },
        });
      }
    }
  }

  return blocks;
}

function getVideoBlocks(nid, language) {
  const blocks = [];

  for (const tableName of linkFieldTables) {
    for (const fieldRow of getFieldRows(tableName, nid, language)) {
      const href = getHrefFromRow(fieldRow);

      if (!href || !isVideoUrl(href)) {
        continue;
      }

      blocks.push({
        _key: createKey("video", nid, blocks.length),
        _type: "videoEmbed",
        url: absolutizeUrl(href),
        caption: getTitleFromRow(fieldRow) || undefined,
      });
    }
  }

  return blocks;
}

function applyRelatedEntryReferences(documents) {
  for (const doc of documents) {
    const refs = [];
    const rows = selectedRows.filter(
      (row) => getDocumentId(numberValue(row.nid), normalizeLanguage(row.langcode), shouldCreateDraft(row)) === doc._id,
    );
    const sourceRow = rows[0];

    if (!sourceRow) {
      continue;
    }

    const nid = numberValue(sourceRow.nid);
    const language = normalizeLanguage(sourceRow.langcode);

    for (const tableName of relatedFieldTables) {
      for (const fieldRow of getFieldRows(tableName, nid, language)) {
        const targetNid = getTargetId(fieldRow);
        const ref =
          docIdByNodeLanguage.get(`${targetNid}:${language}`) ??
          docIdByNodeLanguage.get(`${targetNid}:en`);

        if (ref && !refs.includes(ref)) {
          refs.push(ref);
        }
      }
    }

    doc.relatedEntries = refs.map((ref, index) => ({
      _key: createKey("related", nid, index),
      _type: "reference",
      _ref: ref,
      _weak: true,
    }));
  }
}

async function htmlToPortableText(html, context) {
  const blocks = [];
  const normalized = String(html ?? "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\r\n/g, "\n");
  const chunkRegex =
    /<(h[1-6]|p|blockquote|ul|ol|figure)\b[\s\S]*?<\/\1>|<img\b[^>]*>|<iframe\b[\s\S]*?<\/iframe>|<a\b[^>]*>[\s\S]*?<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = chunkRegex.exec(normalized))) {
    const before = normalized.slice(lastIndex, match.index);
    pushParagraphFromHtml(blocks, before, "normal", context);
    await pushChunk(blocks, match[0], match[1]?.toLowerCase(), context);
    lastIndex = chunkRegex.lastIndex;
  }

  pushParagraphFromHtml(blocks, normalized.slice(lastIndex), "normal", context);
  return blocks;
}

async function pushChunk(blocks, chunk, tagName, context) {
  if (tagName === "ul" || tagName === "ol") {
    const listItemRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let itemMatch;
    let index = 0;

    while ((itemMatch = listItemRegex.exec(chunk))) {
      const block = inlineBlockFromHtml(
        itemMatch[1],
        "normal",
        context,
        tagName === "ol" ? "number" : "bullet",
      );

      if (block) {
        block._key = createKey("li", context.nid, blocks.length + index);
        blocks.push(block);
        index += 1;
      }
    }

    return;
  }

  if (tagName === "figure") {
    await pushImagesFromHtml(blocks, chunk, context);
    pushParagraphFromHtml(blocks, chunk, "normal", context);
    return;
  }

  if (tagName?.startsWith("h")) {
    const style = tagName === "h2" || tagName === "h1" ? "h2" : "h3";
    pushParagraphFromHtml(blocks, chunk, style, context);
    return;
  }

  if (tagName === "blockquote") {
    pushParagraphFromHtml(blocks, chunk, "blockquote", context);
    return;
  }

  if (/^<img\b/i.test(chunk)) {
    await pushImagesFromHtml(blocks, chunk, context);
    return;
  }

  if (/^<iframe\b/i.test(chunk)) {
    const src = getAttr(chunk, "src");

    if (src) {
      blocks.push({
        _key: createKey("iframe", context.nid, blocks.length),
        _type: "videoEmbed",
        url: absolutizeUrl(src),
      });
    }

    return;
  }

  if (/^<a\b/i.test(chunk)) {
    const href = getAttr(chunk, "href");
    const title = cleanText(chunk);

    if (href && isFileUrl(href)) {
      const documentBlock = await documentBlockFromHref(
        href,
        title || "Document",
        context,
        blocks.length,
      );

      if (documentBlock) {
        blocks.push(documentBlock);
        return;
      }
    }

    if (href && isVideoUrl(href)) {
      blocks.push({
        _key: createKey("video-link", context.nid, blocks.length),
        _type: "videoEmbed",
        url: absolutizeUrl(href),
        caption: title || undefined,
      });
      return;
    }
  }

  await pushImagesFromHtml(blocks, chunk, context);
  pushParagraphFromHtml(blocks, chunk, "normal", context);
}

async function pushImagesFromHtml(blocks, html, context) {
  const imageRegex = /<img\b([^>]*)>/gi;
  let match;

  while ((match = imageRegex.exec(html))) {
    const attrs = match[0];
    const src = getAttr(attrs, "src");

    if (!src) {
      continue;
    }

    const fileRow = findFileByHref(src);

    if (!fileRow || !isImageFile(fileRow)) {
      addWarning(context, `Image not found or unsupported: ${src}`);
      continue;
    }

    const asset = await assetResolver.resolveFile(fileRow, "image");

    if (!asset) {
      continue;
    }

    blocks.push({
      _key: createKey("body-image", context.nid, blocks.length),
      _type: "image",
      asset,
      alt: getAttr(attrs, "alt") || context.title || stringValue(fileRow.filename),
      caption: getAttr(attrs, "title") || undefined,
    });
  }
}

function pushParagraphFromHtml(blocks, html, style, context) {
  const withoutMedia = String(html ?? "")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ");
  const block = inlineBlockFromHtml(withoutMedia, style, context);

  if (block) {
    block._key = createKey("block", context.nid, blocks.length);
    blocks.push(block);
  }
}

function inlineBlockFromHtml(html, style, context, listItem) {
  const markDefs = [];
  const children = [];
  const linkRegex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(html))) {
    pushSpan(children, html.slice(lastIndex, match.index));

    const rawHref = getAttr(match[0], "href");
    const href = rewriteHref(rawHref);
    const text = cleanText(match[2]);

    if (href && text && !isFileUrl(rawHref) && !isVideoUrl(rawHref)) {
      const key = createKey("link", context.nid, markDefs.length);
      markDefs.push({ _key: key, _type: "link", href });
      children.push({
        _key: createKey("span", context.nid, children.length),
        _type: "span",
        marks: [key],
        text,
      });
    } else {
      pushSpan(children, text);
    }

    lastIndex = linkRegex.lastIndex;
  }

  pushSpan(children, html.slice(lastIndex));

  const text = children.map((child) => child.text).join("").trim();

  if (!text) {
    return null;
  }

  return pruneUndefined({
    _type: "block",
    style,
    listItem,
    level: listItem ? 1 : undefined,
    markDefs,
    children,
  });
}

function pushSpan(children, html) {
  const text = cleanText(html);

  if (!text) {
    return;
  }

  children.push({
    _key: `s${children.length}`,
    _type: "span",
    marks: [],
    text,
  });
}

async function documentBlockFromHref(href, title, context, index) {
  const fileRow = findFileByHref(href);

  if (!fileRow) {
    addWarning(context, `Document file not found: ${href}`);
    return {
      _key: createKey("doc-url", context.nid, index),
      _type: "documentLink",
      title,
      url: absolutizeUrl(href),
    };
  }

  const asset = await assetResolver.resolveFile(fileRow, "file");

  if (!asset) {
    return null;
  }

  return {
    _key: createKey("doc-link", context.nid, index),
    _type: "documentLink",
    title,
    file: { _type: "file", asset },
  };
}

function rewriteHref(href) {
  if (!href) {
    return "";
  }

  const normalized = normalizePath(href);
  const rewritten = aliasToImpactHref.get(normalized);

  if (rewritten) {
    return absolutizeUrl(rewritten);
  }

  const nodeMatch = normalized.match(/^\/node\/(\d+)/);

  if (nodeMatch) {
    const rewrittenNode = aliasToImpactHref.get(`/node/${nodeMatch[1]}`);

    if (rewrittenNode) {
      return absolutizeUrl(rewrittenNode);
    }
  }

  return absolutizeUrl(href);
}

function findFileByHref(href) {
  const value = String(href ?? "").split("#")[0].split("?")[0];
  const decoded = safeDecodeUri(value);
  const publicMarker = "/sites/default/files/";
  const publicIndex = decoded.indexOf(publicMarker);

  if (publicIndex !== -1) {
    const relative = decoded.slice(publicIndex + publicMarker.length);
    return (
      indexes.filesByUri.get(`public://${relative}`) ??
      indexes.filesByBasename.get(path.basename(relative).toLowerCase())?.[0] ??
      null
    );
  }

  if (decoded.startsWith("public://")) {
    return indexes.filesByUri.get(decoded) ?? null;
  }

  return indexes.filesByBasename.get(path.basename(decoded).toLowerCase())?.[0] ?? null;
}

function getFieldRows(tableName, nid, language) {
  const tableIndex = indexes.fieldIndex.get(tableName);

  if (!tableIndex) {
    return [];
  }

  return (
    tableIndex.get(`${nid}:${language}`) ??
    tableIndex.get(`${nid}:en`) ??
    []
  );
}

function getMediaFieldRows(tableName, mediaId, language) {
  const tableIndex = indexes.mediaFieldIndex.get(tableName);

  if (!tableIndex) {
    return [];
  }

  return (
    tableIndex.get(`${mediaId}:${language}`) ??
    tableIndex.get(`${mediaId}:en`) ??
    []
  );
}

function getTargetId(row) {
  for (const [key, value] of Object.entries(row ?? {})) {
    if (key.endsWith("_target_id") && value !== null) {
      return numberValue(value);
    }
  }

  return 0;
}

function getEntityUuid(row) {
  for (const [key, value] of Object.entries(row ?? {})) {
    if (key.endsWith("_target_uuid") && value) {
      return String(value);
    }
  }

  return "";
}

function mediaIdFromUuid(uuid) {
  return uuid ? indexes.mediaMidByUuid.get(uuid) : 0;
}

function getTextValueFromRow(row) {
  const preferred = [
    "body_value",
    "field_body_top_value",
    "field_bodytop_value",
    "field_intro_value",
    "field_intro_text_value",
    "field_description_value",
    "field_body2_value",
    "field_body3_value",
    "field_gallery_intro_value",
    "field_meta_value",
    "field_header_value",
    "field_quote_value",
    "field_affiliation_value",
    "field_position_value",
  ];

  for (const key of preferred) {
    if (row[key]) {
      return String(row[key]);
    }
  }

  const valueEntry = Object.entries(row).find(
    ([key, value]) =>
      (key.endsWith("_value") || key.endsWith("_summary")) &&
      typeof value === "string" &&
      value.trim(),
  );

  return valueEntry ? String(valueEntry[1]) : "";
}

function getDateValueFromRow(row) {
  const entry = Object.entries(row).find(
    ([key, value]) =>
      (key.endsWith("_value") || key.endsWith("_end_value")) && value,
  );
  return entry ? entry[1] : null;
}

function getHrefFromRow(row) {
  const uriEntry = Object.entries(row ?? {}).find(
    ([key, value]) => key.endsWith("_uri") && value,
  );
  const valueEntry = Object.entries(row ?? {}).find(
    ([key, value]) => key.endsWith("_value") && value,
  );

  return stringValue(uriEntry?.[1] ?? valueEntry?.[1]);
}

function getTitleFromRow(row) {
  const entry = Object.entries(row ?? {}).find(
    ([key, value]) =>
      (key.endsWith("_title") || key.endsWith("_alt")) &&
      typeof value === "string" &&
      value.trim(),
  );

  return stringValue(entry?.[1]);
}

function getAltFromRow(row) {
  const entry = Object.entries(row ?? {}).find(
    ([key, value]) =>
      key.endsWith("_alt") && typeof value === "string" && value.trim(),
  );

  return stringValue(entry?.[1]);
}

function getAttr(html, attrName) {
  const pattern = new RegExp(`${attrName}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = String(html ?? "").match(pattern);
  return safeDecodeHtml(match?.[2] ?? match?.[3] ?? match?.[4] ?? "");
}

function cleanText(value) {
  return safeDecodeHtml(
    String(value ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function safeDecodeHtml(value) {
  return String(value ?? "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function safeDecodeUri(value) {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

function normalizeLanguage(value) {
  return value === "fr" ? "fr" : "en";
}

function normalizePath(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("internal:")) {
    return normalizePath(trimmed.slice("internal:".length));
  }

  if (trimmed.startsWith("entity:node/")) {
    return `/node/${trimmed.slice("entity:node/".length)}`;
  }

  if (/^https?:\/\//.test(trimmed)) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed;
    }
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function absolutizeUrl(value) {
  const href = String(value ?? "").trim();

  if (!href) {
    return "";
  }

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return href;
  }

  if (href.startsWith("//")) {
    return `https:${href}`;
  }

  if (href.startsWith("internal:") || href.startsWith("entity:")) {
    return absolutizeUrl(normalizePath(href));
  }

  return new URL(href.startsWith("/") ? href : `/${href}`, "https://www.tetiaroasociety.org").toString();
}

function isFileUrl(value) {
  return (
    /\/sites\/default\/files\//.test(String(value)) ||
    /\.(pdf|docx?|xlsx?|pptx?|zip|csv)(?:[?#]|$)/i.test(String(value))
  );
}

function isVideoUrl(value) {
  return /(youtube|youtu\.be|vimeo|sproutvideo|wistia|\.mp4(?:[?#]|$))/i.test(
    String(value),
  );
}

function isImageFile(fileRow) {
  const mime = stringValue(fileRow?.filemime);
  const filename = stringValue(fileRow?.filename);
  return (
    mime.startsWith("image/") &&
    mime !== "image/svg+xml" &&
    /\.(jpe?g|png|gif|webp)$/i.test(filename)
  );
}

function localPathFromFileRow(fileRow) {
  const uri = stringValue(fileRow.uri);

  if (uri.startsWith("public://")) {
    return path.join(filesDir, uri.slice("public://".length));
  }

  if (uri.startsWith("private://")) {
    return path.join(filesDir, "private", uri.slice("private://".length));
  }

  return path.join(filesDir, stringValue(fileRow.filename));
}

function unixToIso(value) {
  const timestamp = numberValue(value);

  if (!timestamp) {
    return null;
  }

  return new Date(timestamp * 1000).toISOString();
}

function normalizeDateToIso(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return unixToIso(value);
  }

  const text = String(value);

  if (/^\d+$/.test(text)) {
    return unixToIso(Number(text));
  }

  const date = new Date(text.length === 10 ? `${text}T00:00:00Z` : text);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function slugify(value) {
  return (
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 110) || "legacy-entry"
  );
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`.slice(0, maxLength);
}

function firstNonEmpty(...values) {
  return values.find((value) => String(value ?? "").trim()) ?? "";
}

function numberValue(value) {
  return typeof value === "number" ? value : Number.parseInt(value ?? "0", 10) || 0;
}

function stringValue(value) {
  return typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
}

function createKey(prefix, id, index) {
  return `${prefix}-${id}-${index}`;
}

function pruneUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(pruneUndefined);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, pruneUndefined(entryValue)]),
  );
}

function omitSourceMeta(image) {
  const rest = { ...image };
  delete rest._sourceFid;
  return rest;
}

function incrementMap(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function addWarning(context, message) {
  if (report.bodyWarnings.length < 100) {
    report.bodyWarnings.push({
      nid: context.nid,
      language: context.language,
      message,
    });
  }
}

async function writeDocuments(documents) {
  const batchSize = 50;

  for (let index = 0; index < documents.length; index += batchSize) {
    const batch = documents.slice(index, index + batchSize);
    let transaction = client.transaction();

    for (const doc of batch) {
      transaction = transaction.createOrReplace(doc);
    }

    await transaction.commit();
    console.log(`Imported ${Math.min(index + batch.length, documents.length)} / ${documents.length}`);
  }
}

async function deleteLegacyDottedMigrationDocuments() {
  const oldIds = await client
    .withConfig({ perspective: "raw" })
    .fetch(
      `*[
        _type == "impactEntry" &&
        (
          _id in path("impactEntry.drupal.**") ||
          _id in path("drafts.impactEntry.drupal.**")
        )
      ]._id`,
    );

  if (!oldIds.length) {
    return;
  }

  const batchSize = 100;

  for (let index = 0; index < oldIds.length; index += batchSize) {
    const batch = oldIds.slice(index, index + batchSize);
    let transaction = client.transaction();

    for (const id of batch) {
      transaction = transaction.delete(id);
    }

    await transaction.commit();
    console.log(
      `Deleted ${Math.min(index + batch.length, oldIds.length)} / ${oldIds.length} old dotted migration documents`,
    );
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
      completed += 1;

      if (
        !isDryRun &&
        (completed % 25 === 0 || completed === items.length)
      ) {
        console.log(
          `Built ${completed} / ${items.length} documents; uploaded ${report.uploadedAssets} assets; ${report.cachedAssets} cache hits`,
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

function printReport(documents) {
  console.log(`Drupal impact migration ${report.mode}`);
  console.log(`Documents built: ${report.documentsBuilt}`);
  console.log(
    `Included published: ${report.included.published}; draft project updates: ${report.included.drafts}; skipped rows: ${report.skipped}`,
  );
  console.log(`Expected broad archive: about 457 English + 423 French published, 34 drafts.`);
  console.log("");
  printMap("Included by bundle/language", report.includedByBundleLanguage);
  printMap("Skipped by bundle/language", report.skippedByBundleLanguage, 40);
  console.log("");
  console.log(
    `Assets referenced: ${report.referencedAssets}; uploaded: ${report.uploadedAssets}; cache hits: ${report.cachedAssets}; missing: ${report.missingAssets.size}`,
  );

  if (report.missingAssets.size) {
    printMap("Missing assets", report.missingAssets, 20);
  }

  if (report.slugCollisions.length) {
    console.log("");
    console.log("Slug collisions:");
    for (const collision of report.slugCollisions.slice(0, 30)) {
      console.log(
        `  ${collision.language} ${collision.slug}: node ${collision.existingNid} -> node ${collision.nid} as ${collision.resolvedSlug}`,
      );
    }
  }

  if (report.bodyWarnings.length) {
    console.log("");
    console.log("Body conversion warnings:");
    for (const warning of report.bodyWarnings.slice(0, 30)) {
      console.log(`  node ${warning.nid} ${warning.language}: ${warning.message}`);
    }
  }

  if (isDryRun) {
    console.log("");
    console.log("Dry run only. Re-run with --write to upload assets and create/replace Sanity documents.");
  } else {
    console.log("");
    console.log(`Imported ${documents.length} Sanity impactEntry documents.`);
  }
}

function printMap(title, map, limitCount = 80) {
  console.log(`${title}:`);

  for (const [key, value] of [...map.entries()].sort().slice(0, limitCount)) {
    console.log(`  ${key}: ${value}`);
  }
}

class AssetResolver {
  constructor(sanityClient) {
    this.client = sanityClient;
    this.cache = {};
    this.inFlight = new Map();
    this.pendingSave = Promise.resolve();
  }

  async loadCache() {
    if (isDryRun || !existsSync(assetCachePath)) {
      return;
    }

    this.cache = JSON.parse(await fs.readFile(assetCachePath, "utf8"));
  }

  async saveCache() {
    if (isDryRun) {
      return;
    }

    const writeCache = async () => {
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(assetCachePath, JSON.stringify(this.cache, null, 2));
    };

    this.pendingSave = this.pendingSave.then(writeCache, writeCache);
    await this.pendingSave;
  }

  async resolveFile(fileRow, kind) {
    report.referencedAssets += 1;

    const fid = numberValue(fileRow.fid);
    const cacheKey = `${kind}:${fid}:${fileRow.changed ?? fileRow.timestamp ?? ""}`;

    if (this.cache[cacheKey]) {
      report.cachedAssets += 1;
      return { _type: "reference", _ref: this.cache[cacheKey] };
    }

    const localPath = localPathFromFileRow(fileRow);

    if (!existsSync(localPath)) {
      incrementMap(report.missingAssets, `${fileRow.uri} -> ${localPath}`);
      return null;
    }

    if (isDryRun) {
      return { _type: "reference", _ref: `dry-run-${kind}-${fid}` };
    }

    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }

    const uploadPromise = this.uploadFile(fileRow, kind, cacheKey, localPath);
    this.inFlight.set(cacheKey, uploadPromise);

    try {
      return await uploadPromise;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }

  async uploadFile(fileRow, kind, cacheKey, localPath) {
    const assetKind = kind === "image" ? "image" : "file";
    const asset = await this.client.assets.upload(
      assetKind,
      createReadStream(localPath),
      {
        filename: stringValue(fileRow.filename) || path.basename(localPath),
        contentType: stringValue(fileRow.filemime) || undefined,
        title: stringValue(fileRow.filename) || undefined,
      },
    );

    report.uploadedAssets += 1;
    this.cache[cacheKey] = asset._id;
    await this.saveCache();
    return { _type: "reference", _ref: asset._id };
  }
}

await main();
