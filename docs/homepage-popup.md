# Homepage popup

One panel, two jobs: collect email-list signups, or announce something with a
deadline (a matching-gift window, a campaign close). It runs on the English and
French homepages only, and nowhere else on the site.

Everything that decides *whether* and *when* it appears lives in
[`app/site-popup/site-popup-config.ts`](../app/site-popup/site-popup-config.ts).
Everything it *says* lives in
[`app/site-popup/site-popup-copy.ts`](../app/site-popup/site-popup-copy.ts).

## Turning it off

Two switches, either one is enough:

- Set `enabled: false` in `site-popup-config.ts` and deploy.
- Or set `NEXT_PUBLIC_SITE_POPUP=off` in the environment and redeploy. This
  wins over the config flag, so it works as a kill switch without a code
  change. `NEXT_PUBLIC_SITE_POPUP=on` forces it back on. The value is read at
  build time, so a change needs a new deploy either way.

## Switching campaigns

1. Set `variant` to `"newsletter"` or `"announcement"`.
2. Bump `campaignId`. It namespaces the "already seen this" record in the
   visitor's browser, so people who dismissed the last campaign can see the
   new one.
3. For `"announcement"`, rewrite the placeholder terms in `site-popup-copy.ts`
   first — the shipped copy names a 2x match, a $50,000 cap, and a December 31
   deadline that no one has agreed to. Both locales need the real numbers.

## When it opens

Whichever comes first: `delayMs` on the page, `scrollDepth` of the page read,
or a mouse leaving through the top of the window (`exitIntent`, pointer
devices only). Scroll and exit-intent cannot fire in the first six seconds —
or sooner, if `delayMs` is set lower, since that reads as a deliberate choice.
Nothing opens while a tab is hidden or while another dialog is open: the film
lightbox and the VR viewer get right of way, and the popup re-checks every few
seconds until they close.

After that it respects itself: `dismissedDays` after a dismissal,
`subscribedDays` after a signup, and once per browser session. The dismissal
and signup records live in `localStorage` under
`tetiaroa:site-popup:<campaignId>`; the once-per-session flag lives in
`sessionStorage`, **which survives reloads in the same tab**. So once you have
seen it, refreshing will not bring it back — that is the intended behaviour for
visitors, and the usual reason it looks broken while you are working on it. In
development the console says which cap is holding it closed.

A visitor who blocks storage sees it at most once per page view.

## Previewing and QA

Query parameters on the homepage, which skip every frequency cap and write no
records:

| URL | Result |
| --- | --- |
| `/?popup=preview` | Opens the configured variant immediately |
| `/?popup=newsletter` | Opens the email panel |
| `/?popup=announcement` | Opens the announcement panel |
| `/?popup=reset` | Forgets this browser's dismissals and session flag, then triggers normally — the one to use for testing the real timing |
| `/?popup=off` | Suppresses it for this page view |
| `/fr?popup=preview` | Same, in French |

`preview` skips the caps without touching them; `reset` clears them and then
behaves exactly like a first visit.

## How the signup works

The panel posts to the same server action as `/email-list`, so signups land in
the same Mailchimp audience with the same consent record, rate limiting, and
Turnstile check ([docs/mailchimp-email-list-setup.md](mailchimp-email-list-setup.md)).
The language preference is taken from the page the visitor is on rather than
asked for.

One wrinkle worth knowing: the homepage is prerendered, so the signed render
token that the action requires cannot be baked into its HTML — every visitor
would share one stale token. The panel fetches its own from
`/api/render-token` when it opens, and refreshes it every fifteen minutes it
stays open.
