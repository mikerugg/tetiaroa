import assert from "node:assert/strict";
import test from "node:test";
import {
  combineMailchimpHtml,
  prepareHtmlForEmailExport,
} from "./combineMailchimpHtml.ts";

const english = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>.shared { color: blue; }</style></head>
<body class="email"><main lang="en"><img src="https://cdn.sanity.io/en.jpg">English</main></body></html>`;

const french = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>.shared { color: blue; }</style><style>.fr { color: red; }</style></head>
<body class="email"><main lang="fr"><img src="https://cdn.sanity.io/fr.jpg">Français</main></body></html>`;

test("combines both locale bodies into one complete Mailchimp document", () => {
  const result = combineMailchimpHtml(english, french);

  assert.match(result.html, /^<!doctype html>/i);
  assert.equal((result.html.match(/<html\b/gi) ?? []).length, 1);
  assert.equal((result.html.match(/<body\b/gi) ?? []).length, 1);
  assert.ok(result.html.indexOf("*|IF:MC_LANGUAGE=fr|*") < result.html.indexOf("Français"));
  assert.ok(result.html.indexOf("Français") < result.html.indexOf("*|ELSE:|*"));
  assert.ok(result.html.indexOf("*|ELSE:|*") < result.html.indexOf("English"));
  assert.ok(result.html.indexOf("English") < result.html.indexOf("*|END:IF|*"));
});

test("keeps deployment-ready hosted image URLs", () => {
  const result = combineMailchimpHtml(english, french);

  assert.match(result.html, /https:\/\/cdn\.sanity\.io\/en\.jpg/);
  assert.match(result.html, /https:\/\/cdn\.sanity\.io\/fr\.jpg/);
});

test("removes the Studio CSP from bilingual Mailchimp exports", () => {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https://cdn.sanity.io data:">`;
  const result = combineMailchimpHtml(
    english.replace("<meta charset=\"utf-8\">", `<meta charset="utf-8">${policy}`),
    french.replace("<meta charset=\"utf-8\">", `<meta charset="utf-8">${policy}`),
  );

  assert.doesNotMatch(result.html, /content-security-policy/i);
  assert.match(result.html, /<meta charset="utf-8">/i);
});

test("removes the Studio CSP from individual email exports", () => {
  const html = `<head><meta charset="utf-8"><meta content="default-src 'none'" http-equiv='Content-Security-Policy'></head>`;
  const result = prepareHtmlForEmailExport(html);

  assert.equal(result, `<head><meta charset="utf-8"></head>`);
});

test("adds French-only styles without duplicating shared styles", () => {
  const result = combineMailchimpHtml(english, french);

  assert.equal((result.html.match(/\.shared \{ color: blue; \}/g) ?? []).length, 1);
  assert.equal((result.html.match(/\.fr \{ color: red; \}/g) ?? []).length, 1);
});

test("uses English document attributes and reports differences", () => {
  const result = combineMailchimpHtml(english, french);

  assert.match(result.html, /<html lang="en">/);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /<html> attributes differ/);
});

test("rejects a package without a complete body", () => {
  assert.throws(
    () => combineMailchimpHtml("<html><head></head></html>", french),
    /English HTML does not contain a complete <body>/,
  );
});
