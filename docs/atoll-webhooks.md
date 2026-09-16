# Atoll Guide publishing refresh

Published changes to `speciesGuide`, `atollCategory`, and `atollHub` refresh both language versions of the guide, related Impact listings, and the sitemap through `POST /api/revalidate`. The hook also listens to `impactEntry` so editing related stories refreshes their guide cards. The route validates Sanity's webhook signature with the server-only `SANITY_REVALIDATE_SECRET`.

## Current setup

Verified on 16 September 2026:

- Sanity project `ondha1qz`, dataset `production`.
- Dedicated webhook **Tetiaroa Atoll Guide revalidation**, ID `mcYMNVmr4KOZ6Rmd`.
- Destination `https://tetiaroa.vercel.app/api/revalidate`, confirmed as a domain of the linked Vercel project `tetiaroa`.
- The hook is **disabled**. Its secret matches the local `.env.local` value, which is not committed.
- Sanity accepted the configuration, and a readback found no differences. No other webhook existed when it was created.
- The local handler returned `200` for correctly signed requests for all three guide types and `401` for an invalid signature.
- Vercel CLI authentication was unavailable. The production environment secret and deployed handler have **not** been verified. No deployment was performed.

The remaining launch work is to configure the same secret in Vercel, release the application, then enable and verify webhook delivery. The disabled hook will not send requests while that work is pending.

## Commands

Run from the repository root with Node 24 and installed project dependencies. Commands load `.env.local`, then `.env`; existing process environment variables take priority. The script uses `SANITY_WEBHOOK_TOKEN`, a saved Sanity CLI login, or `SANITY_API_TOKEN`, in that order, taking the first credential that can read webhooks. A token with content-write permission may lack project webhook permissions.

```bash
# Read-only plan: this is the default, with no writes.
node scripts/setup-atoll-webhook.mjs \
  --url https://tetiaroa.vercel.app/api/revalidate --disabled

# Confirm the staged hook's configuration and inspect recent delivery statuses.
node scripts/setup-atoll-webhook.mjs \
  --url https://tetiaroa.vercel.app/api/revalidate --check --disabled

# Repeatable provisioning of the disabled hook.
node scripts/setup-atoll-webhook.mjs \
  --url https://tetiaroa.vercel.app/api/revalidate --apply --disabled

# Check the running local handler, including rejection of an invalid signature.
node scripts/setup-atoll-webhook.mjs \
  --url http://localhost:3298/api/revalidate --test-endpoint
```

`ATOLL_REVALIDATE_URL` can supply the endpoint instead of `--url`. URLs must end in `/api/revalidate` and cannot contain credentials or query parameters. Only the standalone endpoint test allows HTTP loopback addresses.

The script owns only the hook with the exact dedicated name. Repeat runs do not duplicate it. It can create the hook or change its enabled state; configuration drift or duplicate names stop the operation for review. It does not change other hooks, replace a stored secret, modify Vercel variables, or deploy the application. Successful endpoint tests invalidate caches but do not edit content.

## Activate after the application is released

1. Authenticate with `pnpm dlx vercel login`, then use `pnpm dlx vercel env ls production` from this linked repository to check whether `SANITY_REVALIDATE_SECRET` already exists. If it exists, reconcile that value with the dedicated Sanity hook before changing either side. Do not replace a shared secret without checking other webhook consumers.

2. If the variable does not exist, add the **same value already used by this hook** to the production environment as a sensitive server variable. The following passes the local value over stdin without placing it in command history or printing it:

   ```bash
   node --input-type=module <<'NODE'
   import { spawnSync } from 'node:child_process';
   process.loadEnvFile('.env.local');
   const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
   if (!secret) throw new Error('SANITY_REVALIDATE_SECRET is missing locally');
   const result = spawnSync('pnpm', [
     'dlx', 'vercel', 'env', 'add', 'SANITY_REVALIDATE_SECRET',
     'production', '--sensitive'
   ], { input: secret, stdio: ['pipe', 'inherit', 'inherit'] });
   if (result.error) throw result.error;
   process.exitCode = result.status ?? 1;
   NODE
   ```

   Use the appropriate preview environment as well if a preview deployment will receive this hook. Keep secrets out of `NEXT_PUBLIC_*` variables. Adding an environment variable affects subsequent deployments; it does not update an already running deployment. See [Vercel environment commands](https://vercel.com/docs/cli/env) and [environment variable management](https://vercel.com/docs/environment-variables/manage-across-environments).

3. Release the application through the project's normal deployment process. Confirm that this endpoint resolves to the released application and is reachable by Sanity. If the destination changes to a custom domain, update the dedicated hook in Sanity and use that same endpoint in subsequent checks.

4. Run the explicit activation command. It first tests valid signatures for each guide type and rejection of an invalid signature. It enables the hook only after these checks pass:

   ```bash
   node scripts/setup-atoll-webhook.mjs \
     --url https://tetiaroa.vercel.app/api/revalidate --apply
   node scripts/setup-atoll-webhook.mjs \
     --url https://tetiaroa.vercel.app/api/revalidate --check
   ```

5. Publish a reviewed change through Sanity Studio. Check that the updated profile, directory, category, and language counterpart refresh. Run `--check` again to inspect the actual Sanity delivery status. A signed synthetic request verifies the handler and local secret; a successful Sanity delivery also verifies the secret stored on the webhook.

## Configuration reference

The settings are declared in [the setup script](../scripts/setup-atoll-webhook.mjs). The document hook listens for **create, update, and delete**, excludes drafts and release versions, and uses `POST`. The filter is:

```groq
coalesce(after()._type, before()._type) in [
  "speciesGuide", "atollCategory", "atollHub", "impactEntry"
]
```

The projection keeps identity and route information when a document is deleted:

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "slug": coalesce(after().slug, before().slug),
  "category": coalesce(after().category, before().category),
  "english": {"slug": coalesce(after().english.slug, before().english.slug)},
  "french": {"slug": coalesce(after().french.slug, before().french.slug)}
}
```

Sanity's webhook configuration API expects the filter/projection API version with a `v` prefix; this setup uses `v2025-02-19`. Any existing Impact hooks are preserved. The shared handler invalidates the guide cache for both guide and Impact changes so renamed slugs and changing related cards refresh without relying on a single projected path. See [Sanity's webhook API](https://www.sanity.io/docs/http-reference/webhooks) and [signature validation in Next.js](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs).

## Troubleshooting

| Result | Check |
| --- | --- |
| Webhook API `401` or `403` | Use a Sanity CLI login or management token with project webhook permissions. |
| Endpoint `500` | Confirm `SANITY_REVALIDATE_SECRET` is present in the deployment environment. |
| Endpoint `401` | Confirm the local, deployed, and Sanity hook secrets match; also check deployment protection. |
| Endpoint `404`, redirect, or HTML response | Confirm the endpoint points to this application and the release contains `/api/revalidate`. |
| `action: review` | Review the listed configuration differences in Sanity; the script made no change. |
| No delivery attempts | Confirm the hook is enabled and the change affected a published guide document. |
| Successful handler test, failed Sanity delivery | Check the stored webhook secret and delivery details in Sanity. |

Script regression checks run with `node --test scripts/setup-atoll-webhook.test.mjs` and are included in the repository's `pnpm test` command.
