import type { ImpactBodyBlock } from "./types";

export const IPLACES_GRAPHQL_ENDPOINT =
  "https://api.iplacesalliance.org/graphql";

export type IPlacesArticleReference = {
  canonicalUrl: string;
  groupName: string;
  shortId: number;
};

export type IPlacesAffiliation = {
  name: string;
  ror?: string;
};

export type IPlacesAuthor = {
  name: string;
  firstName?: string;
  lastName?: string;
  orcid?: string;
  affiliations: IPlacesAffiliation[];
};

export type IPlacesRecord = IPlacesArticleReference & {
  abstractHtml: string;
  authors: IPlacesAuthor[];
  datePublished?: string;
  doiUrl?: string;
  editedAt?: string;
  funders: string[];
  license?: string;
  location?: string;
  manuscriptId: string;
  publishedAt: string;
  relatedIdentifiers: string[];
  sourceHtml: string;
  title: string;
};

type IPlacesApiRecord = {
  id?: unknown;
  shortId?: unknown;
  publishedDate?: unknown;
  meta?: {
    source?: unknown;
  } | null;
  submission?: unknown;
};

type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

type PortableTextMarkDefinition = {
  _key: string;
  _type: "link";
  href: string;
};

type PortableTextTextBlock = {
  _key: string;
  _type: "block";
  children: PortableTextSpan[];
  level?: number;
  listItem?: "bullet" | "number";
  markDefs: PortableTextMarkDefinition[];
  style: "normal" | "h2" | "h3" | "blockquote";
};

type ImpactEntryDocument = Record<string, unknown> & {
  english?: unknown;
  iplacesSource?: unknown;
  publishedAt?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function unique(values: Array<string | undefined>) {
  return [
    ...new Map(
      values
        .flatMap((value) => (value ? [value.trim()] : []))
        .filter(Boolean)
        .map((value) => [value.toLocaleLowerCase(), value]),
    ).values(),
  ];
}

function normalizeDoi(value: unknown) {
  const doi = asString(value)
    ?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "");

  return doi && /^10\.\d{4,9}\/\S+$/i.test(doi)
    ? `https://doi.org/${doi}`
    : undefined;
}

function normalizeOrcid(value: unknown) {
  const orcid = asString(value)?.replace(/^https?:\/\/orcid\.org\//i, "");
  return orcid && /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i.test(orcid)
    ? orcid.toUpperCase()
    : undefined;
}

function normalizeAffiliations(value: unknown): IPlacesAffiliation[] {
  const directName = asString(value);
  if (directName) {
    return [{ name: directName }];
  }

  const values = Array.isArray(value) ? value : isRecord(value) ? [value] : [];

  return values.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = asString(item.label) ?? asString(item.name);
    if (!name) {
      return [];
    }

    return [{ name, ror: asString(item.value) ?? asString(item.ror) }];
  });
}

function normalizeAuthors(value: unknown): IPlacesAuthor[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const firstName = asString(item.firstName);
    const middleName = asString(item.middleName);
    const lastName = asString(item.lastName);
    const name =
      asString(item.name) ??
      [firstName, middleName, lastName].filter(Boolean).join(" ");

    if (!name) {
      return [];
    }

    return [
      {
        name,
        firstName,
        lastName,
        orcid: normalizeOrcid(item.orcid),
        affiliations: [
          ...normalizeAffiliations(item.ror),
          ...normalizeAffiliations(item.affiliation),
        ].filter(
          (affiliation, index, affiliations) =>
            affiliations.findIndex(
              (candidate) =>
                candidate.name.toLocaleLowerCase() ===
                affiliation.name.toLocaleLowerCase(),
            ) === index,
        ),
      },
    ];
  });
}

function normalizeFunders(submission: Record<string, unknown>) {
  const fundingReferences = Array.isArray(submission.fundingReferences)
    ? submission.fundingReferences
    : [];

  return unique([
    asString(submission.Funding),
    ...fundingReferences.flatMap((reference) => {
      if (!isRecord(reference)) {
        return [];
      }

      const funder = reference.funder;
      if (typeof funder === "string") {
        return [funder];
      }

      return isRecord(funder)
        ? [asString(funder.label) ?? asString(funder.name)]
        : [];
    }),
  ]);
}

function normalizeRelatedIdentifiers(submission: Record<string, unknown>) {
  const collections = [
    submission.$dois,
    submission.relatedIdentifiers,
    submission.GEOME,
  ];

  return unique(
    collections.flatMap((collection) =>
      Array.isArray(collection)
        ? collection.flatMap((item) => {
            if (typeof item === "string") {
              return [item];
            }

            if (!isRecord(item)) {
              return [];
            }

            return [
              asString(item.doi) ??
                asString(item.url) ??
                asString(item.relatedIdentifier) ??
                asString(item.identifier),
            ];
          })
        : [],
    ),
  );
}

function normalizeDateTime(value: unknown) {
  const rawValue = asString(value);
  if (!rawValue) {
    return undefined;
  }

  const date = new Date(rawValue);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    nbsp: " ",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(
    /&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi,
    (match, entity: string) => {
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        const codePoint = Number.parseInt(entity.slice(2), 16);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }

      if (entity.startsWith("#")) {
        const codePoint = Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }

      return namedEntities[entity.toLowerCase()] ?? match;
    },
  );
}

export function htmlToPlainText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(?:p|div|h[1-6]|li|blockquote|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function parseIPlacesArticleUrl(value: string): IPlacesArticleReference {
  const rawValue = value.trim();
  let url: URL;

  try {
    url = new URL(rawValue);
  } catch {
    throw new Error("Paste the full iPlaces article URL.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.hostname.toLowerCase() !== "iplacesalliance.org" ||
    url.port ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "Use an article link from iplacesalliance.org, such as https://iplacesalliance.org/gumpstation/articles/46/.",
    );
  }

  const match = url.pathname.match(
    /^\/([a-z\d][a-z\d_-]*)\/articles\/(\d+)(?:\/(?:index\.html)?)?$/i,
  );
  if (!match) {
    throw new Error(
      "Use an iPlaces article link in this format: /station/articles/number/.",
    );
  }

  const shortId = Number(match[2]);
  if (!Number.isSafeInteger(shortId) || shortId < 1) {
    throw new Error("That iPlaces article number isn’t valid.");
  }

  const groupName = match[1].toLowerCase();

  return {
    canonicalUrl: `https://iplacesalliance.org/${groupName}/articles/${shortId}/`,
    groupName,
    shortId,
  };
}

export function normalizeIPlacesRecord(
  value: unknown,
  reference: IPlacesArticleReference,
): IPlacesRecord {
  if (!isRecord(value)) {
    throw new Error("iPlaces returned the article in an unexpected format.");
  }

  const record = value as IPlacesApiRecord;
  const manuscriptId = asString(record.id);
  const publishedAt = normalizeDateTime(record.publishedDate);
  const returnedShortId =
    typeof record.shortId === "number" ? record.shortId : Number(record.shortId);

  if (!manuscriptId || !publishedAt || returnedShortId !== reference.shortId) {
    throw new Error("The iPlaces article is missing required publication details.");
  }

  if (typeof record.submission !== "string") {
    throw new Error("The iPlaces article is missing its source details.");
  }

  let submission: unknown;
  try {
    submission = JSON.parse(record.submission);
  } catch {
    throw new Error("iPlaces returned source details we couldn’t read.");
  }

  if (!isRecord(submission)) {
    throw new Error("iPlaces returned source details in an unexpected format.");
  }

  const title = asString(submission.$title);
  if (!title) {
    throw new Error("This iPlaces article has no title, so it can’t be imported.");
  }

  return {
    ...reference,
    abstractHtml: asString(submission.$abstract) ?? "",
    authors: normalizeAuthors(submission.$authors),
    datePublished: asString(submission.datePublished),
    doiUrl: normalizeDoi(submission.$doi),
    editedAt: asString(submission.$editDate),
    funders: normalizeFunders(submission),
    license: asString(submission.license),
    location: asString(submission.geolocation),
    manuscriptId,
    publishedAt,
    relatedIdentifiers: normalizeRelatedIdentifiers(submission),
    sourceHtml:
      record.meta && asString(record.meta.source)
        ? (record.meta.source as string)
        : "",
    title,
  };
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getSafeLink(value: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value, "https://iplacesalliance.org");
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

function getTextBlock(
  element: Element,
  index: number,
): PortableTextTextBlock | undefined {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll("ul, ol").forEach((list) => list.remove());
  const markDefinitions: PortableTextMarkDefinition[] = [];
  const children: PortableTextSpan[] = [];
  let spanIndex = 0;
  let pendingSpace = false;

  const appendText = (text: string, marks: string[]) => {
    const normalizedText = normalizeWhitespace(text);
    if (!normalizedText) {
      pendingSpace ||= /\s/.test(text);
      return;
    }

    const previous = children.at(-1);
    const prefix =
      previous && (pendingSpace || /^\s/.test(text)) && !previous.text.endsWith(" ")
        ? " "
        : "";
    if (previous && previous.marks.join(":") === marks.join(":")) {
      previous.text = `${previous.text}${prefix}${normalizedText}`;
      pendingSpace = /\s$/.test(text);
      return;
    }

    children.push({
      _key: `iplaces-span-${index}-${spanIndex}`,
      _type: "span",
      marks,
      text: `${prefix}${normalizedText}`,
    });
    spanIndex += 1;
    pendingSpace = /\s$/.test(text);
  };

  const visit = (node: Node, inheritedMarks: string[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(node.textContent ?? "", inheritedMarks);
      return;
    }

    if (!(node instanceof Element)) {
      return;
    }

    if (node.tagName === "BR") {
      pendingSpace = true;
      return;
    }

    const marks = [...inheritedMarks];
    if (["STRONG", "B"].includes(node.tagName)) {
      marks.push("strong");
    }
    if (["EM", "I"].includes(node.tagName)) {
      marks.push("em");
    }
    if (node.tagName === "A") {
      const href = getSafeLink(node.getAttribute("href"));
      if (href) {
        const key = `iplaces-link-${index}-${markDefinitions.length}`;
        markDefinitions.push({ _key: key, _type: "link", href });
        marks.push(key);
      }
    }

    node.childNodes.forEach((child) => visit(child, marks));
  };

  clone.childNodes.forEach((child) => visit(child, []));
  if (!children.length) {
    return undefined;
  }

  const tagName = element.tagName.toLowerCase();
  const list = element.closest("li")?.parentElement;
  const listItem =
    tagName === "li"
      ? list?.tagName.toLowerCase() === "ol"
        ? "number"
        : "bullet"
      : undefined;
  let level: number | undefined;
  if (listItem) {
    level = 0;
    let ancestor = element.parentElement;
    while (ancestor) {
      if (["UL", "OL"].includes(ancestor.tagName)) {
        level += 1;
      }
      ancestor = ancestor.parentElement;
    }
    level = Math.max(1, level);
  }
  const style =
    tagName === "h1" || tagName === "h2"
      ? "h2"
      : /^h[3-6]$/.test(tagName)
        ? "h3"
        : tagName === "blockquote"
          ? "blockquote"
          : "normal";

  return {
    _key: `iplaces-block-${index}`,
    _type: "block",
    children,
    ...(level ? { level } : {}),
    ...(listItem ? { listItem } : {}),
    markDefs: markDefinitions,
    style,
  };
}

export function htmlToPortableText(value: string): ImpactBodyBlock[] {
  if (!htmlToPlainText(value)) {
    return [];
  }

  if (typeof DOMParser === "undefined") {
    throw new Error("HTML conversion is only available in the Studio browser.");
  }

  const document = new DOMParser().parseFromString(value, "text/html");
  document.querySelectorAll("script, style, iframe, object, embed").forEach((node) =>
    node.remove(),
  );

  return [...document.body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, blockquote, li")]
    .filter((element) => {
      if (element.tagName === "P") {
        return !element.closest("li, blockquote");
      }

      return element.tagName !== "BLOCKQUOTE" || !element.parentElement?.closest("blockquote");
    })
    .flatMap((element, index) => {
      const block = getTextBlock(element, index);
      return block ? [block] : [];
    });
}

function truncateText(value: string, maximumLength: number) {
  if (value.length <= maximumLength) {
    return value;
  }

  const clipped = value.slice(0, maximumLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const breakpoint = lastSpace > maximumLength * 0.65 ? lastSpace : clipped.length;
  return `${clipped.slice(0, breakpoint).trimEnd()}…`;
}

function isBlank(value: unknown) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return !value.trim();
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isRecord(value) && "current" in value) {
    return isBlank(value.current);
  }

  return false;
}

function removeRepeatedTitle(body: ImpactBodyBlock[], title: string) {
  const firstBlock = body[0];
  if (!isRecord(firstBlock) || firstBlock.style !== "h2" || !Array.isArray(firstBlock.children)) {
    return body;
  }

  const heading = firstBlock.children
    .flatMap((child) =>
      isRecord(child) && typeof child.text === "string" ? [child.text] : [],
    )
    .join("");

  return normalizeWhitespace(heading).toLocaleLowerCase() ===
    normalizeWhitespace(title).toLocaleLowerCase()
    ? body.slice(1)
    : body;
}

function setImportedValue(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
  currentValue: unknown,
  replaceExisting: boolean,
) {
  if (value === undefined || value === "" || (Array.isArray(value) && !value.length)) {
    return;
  }

  if (replaceExisting || isBlank(currentValue)) {
    target[key] = value;
  }
}

function removeLegacySourceTopicsFromTags(
  value: unknown,
  source: unknown,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  const sourceTopics = isRecord(source) && Array.isArray(source.topics)
    ? source.topics.flatMap((topic) =>
        typeof topic === "string" && topic.trim() ? [topic] : [],
      )
    : [];
  const sourceTopicKeys = new Set(
    sourceTopics.map((topic) => topic.trim().toLocaleLowerCase()),
  );

  return value.filter(
    (tag) =>
      typeof tag !== "string" ||
      !sourceTopicKeys.has(tag.trim().toLocaleLowerCase()),
  );
}

export function buildIPlacesImpactValues(
  record: IPlacesRecord,
  document: ImpactEntryDocument,
  options: {
    body?: ImpactBodyBlock[];
    importedAt?: string;
    replaceExisting?: boolean;
  } = {},
) {
  const replaceExisting = options.replaceExisting ?? false;
  const currentEnglish = isRecord(document.english) ? document.english : {};
  const nextEnglish: Record<string, unknown> = {
    ...currentEnglish,
    _type: "impactEntryLocale",
  };
  delete nextEnglish.affiliation;
  const retainedTags = removeLegacySourceTopicsFromTags(
    currentEnglish.tags,
    document.iplacesSource,
  );
  if (retainedTags.length) {
    nextEnglish.tags = retainedTags;
  } else {
    delete nextEnglish.tags;
  }
  const abstract = htmlToPlainText(record.abstractHtml);
  const bodySource = htmlToPlainText(record.sourceHtml)
    ? record.sourceHtml
    : record.abstractHtml;
  const body = removeRepeatedTitle(
    options.body ?? htmlToPortableText(bodySource),
    record.title,
  );
  const affiliations = record.authors
    .flatMap((author) => author.affiliations)
    .filter(
      (affiliation, index, allAffiliations) =>
        allAffiliations.findIndex(
          (candidate) =>
            candidate.name.toLocaleLowerCase() ===
            affiliation.name.toLocaleLowerCase(),
        ) === index,
    );
  setImportedValue(
    nextEnglish,
    "summary",
    truncateText(abstract || htmlToPlainText(bodySource), 260),
    currentEnglish.summary,
    replaceExisting,
  );
  setImportedValue(nextEnglish, "body", body, currentEnglish.body, replaceExisting);
  setImportedValue(
    nextEnglish,
    "location",
    record.location,
    currentEnglish.location,
    replaceExisting,
  );
  setImportedValue(
    nextEnglish,
    "projectDates",
    record.datePublished,
    currentEnglish.projectDates,
    replaceExisting,
  );
  setImportedValue(
    nextEnglish,
    "seoDescription",
    truncateText(abstract, 160),
    currentEnglish.seoDescription,
    replaceExisting,
  );

  const values: Record<string, unknown> = {
    english: nextEnglish,
    iplacesSource: {
      _type: "iplacesSource",
      url: record.canonicalUrl,
      title: record.title,
      groupName: record.groupName,
      shortId: record.shortId,
      ...(record.doiUrl ? { doiUrl: record.doiUrl } : {}),
      manuscriptId: record.manuscriptId,
      sourcePublishedAt: record.publishedAt,
      importedAt: options.importedAt ?? new Date().toISOString(),
      ...(record.license ? { license: record.license } : {}),
      authors: record.authors.map((author, index) => ({
        _key: `author-${index}`,
        _type: "iplacesAuthor",
        name: author.name,
        ...(author.orcid ? { orcid: author.orcid } : {}),
        affiliations: author.affiliations.map((affiliation) => affiliation.name),
      })),
      affiliations: affiliations.map((affiliation, index) => ({
        _key: `affiliation-${index}`,
        _type: "iplacesAffiliation",
        name: affiliation.name,
        ...(affiliation.ror ? { ror: affiliation.ror } : {}),
      })),
      funders: record.funders,
      relatedIdentifiers: record.relatedIdentifiers,
    },
  };
  setImportedValue(
    values,
    "publishedAt",
    record.publishedAt,
    document.publishedAt,
    replaceExisting,
  );

  return values;
}
