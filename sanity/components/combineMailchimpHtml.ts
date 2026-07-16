type HtmlDocumentParts = {
  bodyAttributes: string;
  bodyHtml: string;
  doctype: string;
  headAttributes: string;
  headHtml: string;
  htmlAttributes: string;
};

export type CombinedMailchimpHtml = {
  html: string;
  warnings: string[];
};

const DEFAULT_DOCTYPE = "<!doctype html>";
const META_TAG_PATTERN = /<meta\b[^>]*>/gi;
const CONTENT_SECURITY_POLICY_ATTRIBUTE =
  /\bhttp-equiv\s*=\s*(?:"content-security-policy"|'content-security-policy'|content-security-policy(?=[\s/>]))/i;

/** Remove the Studio-only iframe policy without changing the stored HTML package. */
export function prepareHtmlForEmailExport(html: string) {
  return html.replace(META_TAG_PATTERN, (metaTag) =>
    CONTENT_SECURITY_POLICY_ATTRIBUTE.test(metaTag) ? "" : metaTag,
  );
}

function extractDocumentParts(html: string, language: string): HtmlDocumentParts {
  const bodyMatch = html.match(/<body\b([^>]*)>([\s\S]*?)<\/body\s*>/i);

  if (!bodyMatch) {
    throw new Error(`The ${language} HTML does not contain a complete <body> element.`);
  }

  const headMatch = html.match(/<head\b([^>]*)>([\s\S]*?)<\/head\s*>/i);
  const htmlMatch = html.match(/<html\b([^>]*)>/i);
  const doctypeMatch = html.match(/<!doctype[^>]*>/i);

  return {
    bodyAttributes: bodyMatch[1].trim(),
    bodyHtml: bodyMatch[2].trim(),
    doctype: doctypeMatch?.[0] ?? DEFAULT_DOCTYPE,
    headAttributes: headMatch?.[1].trim() ?? "",
    headHtml: headMatch?.[2].trim() ?? "",
    htmlAttributes: htmlMatch?.[1].trim() ?? "",
  };
}

function openTag(name: string, attributes: string) {
  return attributes ? `<${name} ${attributes}>` : `<${name}>`;
}

function normalizeMarkup(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getStyleBlocks(headHtml: string) {
  return headHtml.match(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi) ?? [];
}

function mergeHeadStyles(englishHead: string, frenchHead: string) {
  const englishStyles = new Set(
    getStyleBlocks(englishHead).map((style) => normalizeMarkup(style)),
  );
  const frenchOnlyStyles = getStyleBlocks(frenchHead).filter(
    (style) => !englishStyles.has(normalizeMarkup(style)),
  );

  return [englishHead, ...frenchOnlyStyles].filter(Boolean).join("\n");
}

/**
 * Builds one complete Mailchimp document from the stored, deployment-ready locale
 * packages. French is selected for contacts whose Mailchimp language is `fr`;
 * English is the fallback for every other value, including an unset language.
 */
export function combineMailchimpHtml(
  englishHtml: string,
  frenchHtml: string,
): CombinedMailchimpHtml {
  const english = extractDocumentParts(
    prepareHtmlForEmailExport(englishHtml),
    "English",
  );
  const french = extractDocumentParts(
    prepareHtmlForEmailExport(frenchHtml),
    "French",
  );
  const warnings: string[] = [];

  if (
    normalizeMarkup(english.htmlAttributes) !==
    normalizeMarkup(french.htmlAttributes)
  ) {
    warnings.push(
      "The English and French <html> attributes differ. The combined export uses the English attributes.",
    );
  }

  if (
    normalizeMarkup(english.bodyAttributes) !==
    normalizeMarkup(french.bodyAttributes)
  ) {
    warnings.push(
      "The English and French <body> attributes differ. The combined export uses the English attributes.",
    );
  }

  const headHtml = mergeHeadStyles(english.headHtml, french.headHtml);
  const conditionalBody = [
    "*|IF:MC_LANGUAGE=fr|*",
    french.bodyHtml,
    "*|ELSE:|*",
    english.bodyHtml,
    "*|END:IF|*",
  ].join("\n");

  return {
    html: [
      english.doctype,
      openTag("html", english.htmlAttributes),
      openTag("head", english.headAttributes),
      headHtml,
      "</head>",
      openTag("body", english.bodyAttributes),
      conditionalBody,
      "</body>",
      "</html>",
    ].join("\n"),
    warnings,
  };
}
