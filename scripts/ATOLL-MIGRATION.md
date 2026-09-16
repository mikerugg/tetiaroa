# Atoll guide migration

The reviewed English/French manuscript is in `data/atoll-guide-reviewed.json`.
`data/atoll-migration-ledger.json` maps every public legacy profile to its Sanity
document, records both live-page checksums, and carries the source-coverage and
scientific-correction notes. Counts are guide entries, not a species census.

## Reproduce the inventory

Requirements: the existing Sanity environment variables, the Drupal SQL dump in
`.tetiaroa_old/db`, and original media in `.tetiaroa_old/files_live`.

```bash
node --max-old-space-size=4096 scripts/atoll-extract-source.mjs
node scripts/atoll-audit-live.mjs
node scripts/migrate-atoll-guide.mjs --manuscript=scripts/data/atoll-guide-reviewed.json
```

Extraction reads Drupal and existing Sanity content, including nested paragraphs.
It creates local source snapshots under `.migration-cache`; `--refresh` reparses
the SQL when the backup changes. The live audit preserves 300 English/French
profile responses and compares their text against the backup. Importing is a
dry run unless `--write` is present. Review the report before a write.

## Publish reviewed content

```bash
node scripts/migrate-atoll-guide.mjs --write \
  --manuscript=scripts/data/atoll-guide-reviewed.json \
  --refresh-generated --seed --include-drafts \
  --restore-stories --restore-audio --mark-replacements
```

- New records use stable IDs and `createIfNotExists`; ordinary reruns preserve
  existing records. An incomplete bilingual manuscript blocks a full write.
- `--refresh-generated` compares each field with its stored migration hash
  before updating reviewed copy. It skips and reports fields edited since import.
  Revision checks also prevent overwriting concurrent changes. Earlier prototype
  versions used verified local baselines; all final profiles carry durable hashes.
- Media uploads reuse cached assets. Originals, credits, bibliography, correction
  notes and live hashes remain in each profile’s read-only source snapshot.
- `--restore-stories` recovers omitted authored paragraphs and their media only
  when the original Impact body matches the saved baseline. It retains those
  articles; it does not turn their longform text into duplicate species prose.
- `--restore-audio` adds uploaded recordings as supported Impact document links
  and resolves the legacy serialized video embeds.
- `--mark-replacements` marks both language records for each of the 150 replaced
  profiles only after their bilingual replacement exists: 300 retained Impact
  records in this dataset. The hub and category pages have no previous Impact
  documents. The original records remain recoverable. Geology and history are
  not marked.
- The incomplete scorpion and orange coral guard crab remain unpublished drafts.
- `--allow-partial --categories=birds,plants,turtles` is reserved for reviewed
  prototypes; it is not the final migration command.

After an approved editorial batch, `node scripts/atoll-export-ledger.mjs` exports
the cached reviewed manuscripts and evidence into the tracked artifacts. Do not
rerun the temporary manuscript-writing helpers: the exported manuscripts include
independent copywriting and bilingual reviews. The exporter also merges
`atoll-metadata-review.json`, preserving the reviewed local-name regions and
photo-caption corrections. If a repeat-import dry run has replaced the current
report, pass `--import-report=.migration-cache/atoll-completion-import.json` to
the exporter to retain the completed write as its import evidence.

## Checks

```bash
node scripts/atoll-verify-migration.mjs --check-assets
node --test scripts/migrate-atoll-guide.test.mjs
pnpm exec eslint scripts/atoll-*.mjs scripts/migrate-atoll-guide*.mjs
```

After a write, verify 150 published profiles with both translations, six categories,
one hub, two unpublished drafts, 52 restored Impact story translations, working
asset URLs, unique Portable Text keys, and zero migration conflicts. A second dry run with `--refresh-generated` should
report no content updates. Full browser, build, locale, redirect and search checks
are part of the application verification, not substitutes for this content audit.
