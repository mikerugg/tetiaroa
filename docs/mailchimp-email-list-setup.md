# Mailchimp email-list signup setup

The website signup form writes the selected `en` or `fr` value to Mailchimp's
built-in contact language. It does not rely on an `en` or `fr` contact tag.

## API configuration

Add these server-only environment variables locally and in Vercel:

- `MAILCHIMP_API_KEY`: a Mailchimp Marketing API key.
- `MAILCHIMP_AUDIENCE_ID`: the ID of the email-list audience.
- `MAILCHIMP_SERVER_PREFIX`: the API data center, such as `us21`. This is
  optional when the API key ends with the usual `-us21` suffix.

The existing Turnstile and `CONTACT_FORM_SECRET` variables protect the signup
form as well as the contact form. The email-list form also requires explicit,
unchecked consent and links to the localized privacy policy.

New contacts are created as `subscribed` using single opt-in, so Mailchimp does
not send an opt-in confirmation email. The request sends the originating IP,
when available, to Mailchimp's built-in opt-in audit field; Mailchimp records
the opt-in timestamp when it changes the contact to `subscribed`.
Existing contacts who submit the form again have their language preference and
latest opt-in evidence updated.

## Configure Mailchimp's Other forms area

1. In Mailchimp, open **Forms**, then **Other forms**.
2. Find **Form builder** and select **Manage forms**.
3. Select the same audience used by `MAILCHIMP_AUDIENCE_ID`.
4. Open **Translate it** and enable **Auto-translate**. This enables
   Mailchimp's real Language field for the audience.
5. Keep **Email Address** required. Do not use an `en` or `fr` tag as a
   replacement for Language.
6. Ensure every campaign includes Mailchimp's required unsubscribe link.
7. Test once with English selected and once with French selected on the website.
   Each test contact should appear immediately as **Subscribed** without an
   opt-in confirmation email. Confirm that **Settings → Language** shows `en` or
   `fr` before testing bilingual campaign content.

The website routes are `/email-list` and `/fr/email-list`.
