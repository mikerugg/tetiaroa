# Our Atoll: three destinations, one species browser

The atoll section uses the site's shared `TopToolbar` and `SiteFooter`, ink
backgrounds, paper text, lagoon accents, Fraunces and Bebas Neue headings,
monospace labels and Inter body text. `AtollToolbar` only preserves directory
queries in the language link; it does not introduce another visual header.

## Entry and navigation

- `/island` is the visual gateway: Species, Geology and SWAC, in that order.
  Three equal image panels sit together on desktop. On phones they become
  compact horizontal image/caption rows. Captions sit on solid backgrounds.
- Wildlife photography introduces Species; the existing atoll illustration
  introduces Geology. The static SWAC thumbnail adapts the existing seawater
  cooling diagram. The diagram remains fully visible rather than being cropped.
- The shared global toolbar opens Our Atoll. The gateway's three panels provide
  access to Species, Geology and SWAC; there is no secondary section toolbar.
  Species pages retain their breadcrumbs and return-to-results links.
- `/island/guide` is the species directory. The six existing category URLs render
  exactly the same layout with the corresponding species group selected.
- `/island/explore` permanently redirects to `/island`. Old directory queries
  on `/island` permanently redirect to `/island/guide`, preserving `q`,
  `category`, `subgroup`, `habitat` and `page`. Tracking-only links remain on the
  gateway. French counterparts use the same paths under `/fr`.

## Browsing and profiles

- Species group and habitat filters are both directly visible and combine.
  Desktop shows option rows. Mobile shows labelled selects, side by side from
  390px and stacked on narrower screens; long values wrap fully.
- Subgroups appear only when the selected species group has subdivisions.
  Changing the species group clears the subgroup and resets pagination while
  retaining search and habitat. Clear all also clears the search and fixed
  category route. Legacy links containing only a subgroup visibly select its
  containing species group; widening the subgroup keeps that group selected.
- Search matches English, French, scientific and local names, tolerating omitted
  accents and apostrophes. Results sort by the displayed common name and show
  24 entries per page. Cards retain scientific and local names.
- Category and habitat background, imagery, credits, downloads and related
  reading sit after results, updating with the active filters. Habitat tags do
  not assert a sighting at Tetiaroa.
- Query and pagination live in the URL. Language switching preserves filters.
  Returning from a profile restores the originating URL and scroll position;
  saved URLs from the former hub directory normalize to `/island/guide`.
- Every species uses the same profile template. Names precede the photograph on
  mobile. Existing facts, galleries, audio, video, references and sources remain.

## Sanity content

The existing Atoll hub's localized `experiences` fields supply destination
imagery and short captions. The page fixes the three destination labels, routes
and order. Habitat and related-reading fields continue supplying the directory.
Hub preview links now open `/island`.

`node --experimental-strip-types scripts/update-atoll-gateway.mjs --dry-run`
checks the destination content. `--write` populates missing Species entries and
replaces recognized legacy captions and the former SWAC animation. It preserves
other editorial values, reuses identical assets, guards the document revision,
and saves the original hub to `.migration-cache` before writing. A second run
makes no changes. No species documents or source records are rewritten.

## Verification

Use `agent-browser` for desktop/mobile layout, keyboard navigation, combined
filters, empty results, pagination, locale switching and profile return checks.
The route audit (`node scripts/verify-atoll-routes.mjs`) checks all 150 profiles
in both languages, category URLs, former Impact URLs, aliases, redirects,
unknown routes, canonicals, language alternates and sitemap coverage.

Run `pnpm test`, `pnpm lint` and `pnpm build` after changes. The signed local
publishing check is:

```sh
node scripts/setup-atoll-webhook.mjs --url http://localhost:3298/api/revalidate --test-endpoint
```

Content reconciliation and import safeguards are documented in
[ATOLL-MIGRATION.md](../scripts/ATOLL-MIGRATION.md). Publishing setup is documented
in [atoll-webhooks.md](atoll-webhooks.md).

## Deployment status

This change is implemented and verified locally. The staged Sanity webhook
remains disabled until a deployment has the matching secret and passes its
signed endpoint check. Authenticated Studio preview needs an editor session.
SproutVideo still applies its embedding domain allowlist; profile links to the
original public watch pages remain available.
