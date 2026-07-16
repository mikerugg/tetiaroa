"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { unzipSync } from "fflate";
import {
  getPublishedId,
  getVersionId,
  PatchEvent,
  set,
  type ObjectInputProps,
  useClient,
  useEditState,
  useFormValue,
} from "sanity";
import { sanityApiVersion } from "../../lib/sanity/env";
import { prepareHtmlForEmailExport } from "./combineMailchimpHtml";

type HtmlPackageValue = {
  _type?: "htmlPackage";
  archive?: {
    _type: "file";
    asset: { _type: "reference"; _ref: string };
  };
  html?: string;
  originalFilename?: string;
  importedAt?: string;
  imageCount?: number;
  images?: Array<{
    _key: string;
    _type: "htmlPackageImage";
    originalPath: string;
    image: {
      _type: "image";
      asset: { _type: "reference"; _ref: string };
    };
  }>;
  warnings?: string[];
  removed?: boolean;
  cleanupAssetIds?: string[];
};

type PublishedImpactEntry = {
  english?: { htmlPackage?: HtmlPackageValue };
  french?: { htmlPackage?: HtmlPackageValue };
  htmlPackage?: HtmlPackageValue;
};

type HtmlPackageLocale = "english" | "french" | "legacy";

type HtmlCopySource = "published" | "scheduled";

type ScheduledRelease = {
  _id: string;
  _rev: string;
  name: string;
  publishAt?: string;
};

type ScheduledReleaseProbe = {
  error?: string;
  htmlPackage?: HtmlPackageValue;
  key: string;
  release?: ScheduledRelease;
};

type PackageFile = {
  path: string;
  bytes: Uint8Array;
};

type PackageImage = PackageFile & {
  mimeType: string;
};

const MAX_ARCHIVE_BYTES = 25_000_000;
const MAX_EXPANDED_BYTES = 75_000_000;
const MAX_HTML_BYTES = 5_000_000;
const MAX_FILE_COUNT = 300;
const MAX_IMAGE_COUNT = 200;

const imageMimeTypes: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  tif: "image/tiff",
  tiff: "image/tiff",
  webp: "image/webp",
};

function normalizeArchivePath(value: string) {
  const cleanValue = value
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .split(/[?#]/, 1)[0];
  const segments: string[] = [];

  for (const segment of cleanValue.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      if (!segments.length) {
        return null;
      }

      segments.pop();
      continue;
    }

    segments.push(segment);
  }

  return segments.join("/");
}

function safeDecodeUri(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getDirectory(path: string) {
  const index = path.lastIndexOf("/");
  return index === -1 ? "" : path.slice(0, index);
}

function getFilename(path: string) {
  return path.slice(path.lastIndexOf("/") + 1);
}

function resolvePackageReference(htmlPath: string, reference: string) {
  const cleanReference = safeDecodeUri(reference.trim());

  if (
    !cleanReference ||
    cleanReference.startsWith("#") ||
    cleanReference.startsWith("data:") ||
    cleanReference.startsWith("cid:")
  ) {
    return null;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(cleanReference) || cleanReference.startsWith("//")) {
    return null;
  }

  const joinedPath = cleanReference.startsWith("/")
    ? cleanReference
    : [getDirectory(htmlPath), cleanReference].filter(Boolean).join("/");

  return normalizeArchivePath(joinedPath);
}

function findHtmlFile(files: PackageFile[]) {
  const htmlFiles = files.filter((file) => /\.html?$/i.test(file.path));

  if (!htmlFiles.length) {
    throw new Error("No HTML file found. Add an .html file to the ZIP and try again.");
  }

  const emailFiles = htmlFiles.filter((file) => /(^|\/)email\.html?$/i.test(file.path));

  if (emailFiles.length === 1) {
    return emailFiles[0];
  }

  const indexFiles = htmlFiles.filter((file) => /(^|\/)index\.html?$/i.test(file.path));

  if (indexFiles.length === 1) {
    return indexFiles[0];
  }

  if (htmlFiles.length === 1) {
    return htmlFiles[0];
  }

  throw new Error(
    "We found multiple HTML files. Keep only the one you want to publish, or name the main file email.html.",
  );
}

function getPackageFiles(zipFile: File) {
  return zipFile.arrayBuffer().then((buffer) => {
    const entries = unzipSync(new Uint8Array(buffer));
    const files = Object.entries(entries).flatMap(([rawPath, bytes]) => {
      const path = normalizeArchivePath(rawPath);

      if (!path || rawPath.endsWith("/") || path.startsWith("__MACOSX/")) {
        return [];
      }

      return [{ path, bytes }];
    });
    const expandedSize = files.reduce((total, file) => total + file.bytes.byteLength, 0);

    if (files.length > MAX_FILE_COUNT) {
      throw new Error(
        `This ZIP contains more than ${MAX_FILE_COUNT} files. Remove anything the HTML does not need and try again.`,
      );
    }

    if (expandedSize > MAX_EXPANDED_BYTES) {
      throw new Error("The unzipped package is over 75 MB. Reduce its size and try again.");
    }

    return files;
  });
}

function getPackageImages(files: PackageFile[]) {
  const images = files.flatMap((file): PackageImage[] => {
    const extension = file.path.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = imageMimeTypes[extension];
    return mimeType ? [{ ...file, mimeType }] : [];
  });

  if (images.length > MAX_IMAGE_COUNT) {
    throw new Error(
      `This ZIP contains more than ${MAX_IMAGE_COUNT} images. Remove unused images and try again.`,
    );
  }

  return images;
}

function sanitizeDocument(sourceHtml: string) {
  const document = new DOMParser().parseFromString(sourceHtml, "text/html");

  document
    .querySelectorAll(
      "script, iframe, frame, frameset, object, embed, form, input, button, textarea, select, base, link, noscript",
    )
    .forEach((node) => node.remove());

  document.querySelectorAll("meta[http-equiv]").forEach((node) => node.remove());

  document.querySelectorAll("*").forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (/^on/i.test(attribute.name) || attribute.name.toLowerCase() === "srcdoc") {
        element.removeAttribute(attribute.name);
      }
    }
  });

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href")?.trim() ?? "";

    if (!/^(https?:|mailto:|tel:|#)/i.test(href)) {
      anchor.removeAttribute("href");
      return;
    }

    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });

  let head = document.head;
  if (!head) {
    head = document.createElement("head");
    document.documentElement.prepend(head);
  }

  const charset = document.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  head.prepend(charset);

  const viewport = document.createElement("meta");
  viewport.setAttribute("name", "viewport");
  viewport.setAttribute("content", "width=device-width, initial-scale=1");
  head.append(viewport);

  const contentSecurityPolicy = document.createElement("meta");
  contentSecurityPolicy.setAttribute("http-equiv", "Content-Security-Policy");
  contentSecurityPolicy.setAttribute(
    "content",
    "default-src 'none'; img-src https://cdn.sanity.io data:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none';",
  );
  head.append(contentSecurityPolicy);

  return document;
}

function rewriteCssUrls(
  css: string,
  htmlPath: string,
  assetUrls: Map<string, string>,
  missing: Set<string>,
  referenced: Set<string>,
) {
  return css.replace(
    /url\(\s*(["']?)([^"')]+)\1\s*\)/gi,
    (match, quote: string, rawReference: string) => {
      const path = resolvePackageReference(htmlPath, rawReference);

      if (!path) {
        return match;
      }

      const url = assetUrls.get(path);
      if (!url) {
        missing.add(path);
        return match;
      }

      referenced.add(path);
      return `url(${quote}${url}${quote})`;
    },
  );
}

function rewriteDocumentAssets(
  document: Document,
  htmlPath: string,
  assetUrls: Map<string, string>,
) {
  const missing = new Set<string>();
  const referenced = new Set<string>();

  const rewriteAttribute = (element: Element, attribute: string) => {
    const reference = element.getAttribute(attribute);
    if (!reference) {
      return;
    }

    const path = resolvePackageReference(htmlPath, reference);
    if (!path) {
      return;
    }

    const url = assetUrls.get(path);
    if (!url) {
      missing.add(path);
      return;
    }

    referenced.add(path);
    element.setAttribute(attribute, url);
  };

  document.querySelectorAll("img[src], source[src], video[poster], [background]").forEach(
    (element) => {
      if (element.hasAttribute("src")) {
        rewriteAttribute(element, "src");
      }
      if (element.hasAttribute("poster")) {
        rewriteAttribute(element, "poster");
      }
      if (element.hasAttribute("background")) {
        rewriteAttribute(element, "background");
      }
    },
  );

  document.querySelectorAll("img[srcset], source[srcset]").forEach((element) => {
    const srcset = element.getAttribute("srcset");
    if (!srcset) {
      return;
    }

    const rewritten = srcset
      .split(",")
      .map((candidate) => {
        const [reference, ...descriptor] = candidate.trim().split(/\s+/);
        const path = resolvePackageReference(htmlPath, reference);

        if (!path) {
          return candidate.trim();
        }

        const url = assetUrls.get(path);
        if (!url) {
          missing.add(path);
          return candidate.trim();
        }

        referenced.add(path);
        return [url, ...descriptor].join(" ");
      })
      .join(", ");

    element.setAttribute("srcset", rewritten);
  });

  document.querySelectorAll("[style]").forEach((element) => {
    const style = element.getAttribute("style");
    if (style) {
      element.setAttribute(
        "style",
        rewriteCssUrls(style, htmlPath, assetUrls, missing, referenced),
      );
    }
  });

  document.querySelectorAll("style").forEach((element) => {
    element.textContent = rewriteCssUrls(
      element.textContent ?? "",
      htmlPath,
      assetUrls,
      missing,
      referenced,
    );
  });

  return { missing, referenced };
}

function serializeDocument(document: Document) {
  return `<!doctype html>\n${document.documentElement.outerHTML}`;
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  }

  const workers = await Promise.allSettled(
    Array.from({ length: Math.min(concurrency, values.length) }, () => worker()),
  );

  const failedWorker = workers.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failedWorker) {
    throw failedWorker.reason;
  }

  return results;
}

function getPackageAssetIds(value?: HtmlPackageValue) {
  return [
    ...(value?.cleanupAssetIds ?? []),
    value?.archive?.asset._ref,
    ...(value?.images ?? []).map((item) => item.image.asset._ref),
  ].filter((assetId): assetId is string => Boolean(assetId));
}

function getHtmlPackageLocale(path: readonly unknown[] | undefined): HtmlPackageLocale {
  if (path?.[0] === "french") {
    return "french";
  }

  if (path?.[0] === "english") {
    return "english";
  }

  return "legacy";
}

function getDocumentHtmlPackage(
  document: PublishedImpactEntry | null | undefined,
  locale: HtmlPackageLocale,
) {
  if (locale === "english") {
    return document?.english?.htmlPackage;
  }

  if (locale === "french") {
    return document?.french?.htmlPackage;
  }

  return document?.htmlPackage;
}

export function HtmlPackageInput(props: ObjectInputProps<HtmlPackageValue>) {
  const { onChange, readOnly, value } = props;
  const htmlPackageLocale = getHtmlPackageLocale(props.path);
  const client = useClient({ apiVersion: sanityApiVersion });
  const documentId = useFormValue(["_id"]);
  const publishedDocumentId =
    typeof documentId === "string"
      ? getPublishedId(documentId)
      : "new-impact-entry";
  const releaseProbeKey = `direct-scheduled-v2:${publishedDocumentId}:${htmlPackageLocale}`;
  const [scheduledReleaseProbe, setScheduledReleaseProbe] =
    useState<ScheduledReleaseProbe>();

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const scheduledReleases = await client.fetch<ScheduledRelease[]>(
          `*[
            _type == "system.release" &&
            metadata.releaseType == "scheduled" &&
            state in ["scheduled", "scheduling"]
          ] | order(publishAt asc) {
            _id,
            _rev,
            name,
            publishAt
          }`,
          {},
          { perspective: "raw", signal: controller.signal },
        );
        const versionIds = scheduledReleases.map((release) =>
          getVersionId(publishedDocumentId, release.name),
        );
        const versionDocuments = versionIds.length
          ? await client.getDocuments<PublishedImpactEntry>(versionIds, {
              signal: controller.signal,
            })
          : [];

        if (controller.signal.aborted) {
          return;
        }

        const matchingIndex = versionDocuments.findIndex(Boolean);
        const matchingRelease =
          matchingIndex >= 0 ? scheduledReleases[matchingIndex] : undefined;
        setScheduledReleaseProbe({
          htmlPackage:
            matchingIndex >= 0
              ? getDocumentHtmlPackage(
                  versionDocuments[matchingIndex],
                  htmlPackageLocale,
                )
              : undefined,
          key: releaseProbeKey,
          release: matchingRelease,
        });
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setScheduledReleaseProbe({
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "The scheduled version could not be checked.",
          key: releaseProbeKey,
        });
      }
    })();

    return () => controller.abort();
  }, [client, htmlPackageLocale, publishedDocumentId, releaseProbeKey]);

  const scheduledLookupError =
    scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.error
      : undefined;
  const scheduledLookupPending =
    scheduledReleaseProbe?.key !== releaseProbeKey;
  const scheduledRelease =
    scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.release
      : undefined;
  const editState = useEditState(
    publishedDocumentId,
    "impactEntry",
    "low",
    scheduledRelease?.name,
  );
  const publishedPackage = getDocumentHtmlPackage(
    editState.published as PublishedImpactEntry | null,
    htmlPackageLocale,
  );
  const publishedHtml =
    publishedPackage?.html && !publishedPackage.removed
      ? publishedPackage.html
      : undefined;
  const draftPackage = getDocumentHtmlPackage(
    editState.draft as PublishedImpactEntry | null,
    htmlPackageLocale,
  );
  const draftHtml =
    draftPackage?.html && !draftPackage.removed ? draftPackage.html : undefined;
  const scheduledPackage =
    getDocumentHtmlPackage(
      editState.version as PublishedImpactEntry | null,
      htmlPackageLocale,
    ) ??
    (scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.htmlPackage
      : undefined);
  const scheduledHtml =
    scheduledPackage?.html && !scheduledPackage.removed
      ? scheduledPackage.html
      : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [copyError, setCopyError] = useState("");
  const [copiedHtml, setCopiedHtml] = useState<{
    html: string;
    source: HtmlCopySource;
  }>();

  const copyHtml = async (html: string, source: HtmlCopySource) => {
    setCopyError("");

    try {
      await navigator.clipboard.writeText(prepareHtmlForEmailExport(html));
      setCopiedHtml({ html, source });
    } catch {
      setCopyError(
        "The HTML could not be copied. Check this browser's clipboard permission and try again.",
      );
    }
  };

  const importPackage = async (zipFile: File) => {
    setIsImporting(true);
    setError("");
    const newAssetIds: string[] = [];

    try {
      if (zipFile.size > MAX_ARCHIVE_BYTES) {
        throw new Error("This ZIP is over 25 MB. Reduce its size and try again.");
      }

      setProgress("Checking ZIP…");
      const files = await getPackageFiles(zipFile);
      const htmlFile = findHtmlFile(files);
      if (htmlFile.bytes.byteLength > MAX_HTML_BYTES) {
        throw new Error("The HTML file is over 5 MB. Reduce its size and try again.");
      }
      const images = getPackageImages(files);
      const sourceHtml = new TextDecoder().decode(htmlFile.bytes);
      const availableImages = new Map(images.map((image) => [image.path, image.path]));
      const validationDocument = sanitizeDocument(sourceHtml);
      const validation = rewriteDocumentAssets(
        validationDocument,
        htmlFile.path,
        availableImages,
      );

      if (validation.missing.size) {
        const paths = [...validation.missing].slice(0, 8).join(", ");
        const suffix = validation.missing.size > 8 ? ", …" : "";
        throw new Error(
          `These local files are referenced by the HTML but missing from the ZIP: ${paths}${suffix}`,
        );
      }

      setProgress(`Uploading ${images.length} image${images.length === 1 ? "" : "s"}…`);
      let completedImages = 0;
      const uploadedImages = await mapWithConcurrency(images, 4, async (image) => {
        const imageBuffer = new ArrayBuffer(image.bytes.byteLength);
        new Uint8Array(imageBuffer).set(image.bytes);
        const file = new File([imageBuffer], getFilename(image.path), {
          type: image.mimeType,
        });
        const asset = await client.assets.upload("image", file, {
          filename: getFilename(image.path),
        });
        newAssetIds.push(asset._id);
        completedImages += 1;
        setProgress(`Uploading images… ${completedImages}/${images.length}`);
        return { image, asset };
      });

      const assetUrls = new Map(
        uploadedImages.map(({ image, asset }) => [image.path, asset.url]),
      );
      const processedDocument = sanitizeDocument(sourceHtml);
      const { referenced } = rewriteDocumentAssets(
        processedDocument,
        htmlFile.path,
        assetUrls,
      );
      const unusedImages = images.filter((image) => !referenced.has(image.path));
      const warnings = unusedImages.length
        ? [
            `${unusedImages.length} image${
              unusedImages.length === 1 ? " in the ZIP is" : "s in the ZIP are"
            } not used by the HTML. ${
              unusedImages.length === 1 ? "It was" : "They were"
            } imported anyway.`,
          ]
        : [];

      setProgress("Saving source ZIP…");
      const archiveAsset = await client.assets.upload("file", zipFile, {
        filename: zipFile.name,
      });
      newAssetIds.push(archiveAsset._id);

      const activeAssetIds = new Set(newAssetIds);
      const cleanupAssetIds = [
        ...new Set(
          getPackageAssetIds(value).filter((assetId) => !activeAssetIds.has(assetId)),
        ),
      ];

      onChange(
        PatchEvent.from(
          set({
            _type: "htmlPackage",
            archive: {
              _type: "file",
              asset: { _type: "reference", _ref: archiveAsset._id },
            },
            html: serializeDocument(processedDocument),
            originalFilename: zipFile.name,
            importedAt: new Date().toISOString(),
            imageCount: uploadedImages.length,
            images: uploadedImages.map(({ image, asset }) => ({
              _key: asset._id,
              _type: "htmlPackageImage",
              originalPath: image.path,
              image: {
                _type: "image",
                asset: { _type: "reference", _ref: asset._id },
              },
            })),
            warnings,
            ...(cleanupAssetIds.length ? { cleanupAssetIds } : {}),
          }),
        ),
      );
      setProgress("HTML package imported.");
    } catch (caughtError) {
      const cleanupResults = await Promise.allSettled(
        [...new Set(newAssetIds)].map((assetId) => client.delete(assetId)),
      );
      const cleanupFailed = cleanupResults.some(
        (result) => result.status === "rejected",
      );
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while importing the ZIP. Try again.";

      setError(
        cleanupFailed
          ? `${message} Some temporary uploads could not be deleted; try the import again or ask an administrator to check Sanity assets.`
          : message,
      );
      setProgress("");
    } finally {
      setIsImporting(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Stack space={3}>
      <Card border padding={4} radius={2} tone="transparent">
        <Stack space={4}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Upload the HTML and its images
            </Text>
            <Text muted size={1}>
              Choose the ZIP containing email.html or index.html and its &quot;images&quot; folder.
            </Text>
          </Stack>

          <input
            ref={inputRef}
            type="file"
            accept=".zip,application/zip"
            disabled={readOnly || isImporting}
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                void importPackage(file);
              }
            }}
          />

          <Flex align="center" gap={3} wrap="wrap">
            <Button
              text={value?.html ? "Replace ZIP" : "Upload ZIP"}
              tone="primary"
              disabled={readOnly || isImporting}
              onClick={() => inputRef.current?.click()}
            />
            {value?.html && !value.removed ? (
              <Button
                text="Remove HTML package"
                tone="critical"
                mode="ghost"
                disabled={readOnly || isImporting}
                onClick={() =>
                  onChange(
                    PatchEvent.from(
                      set({
                        _type: "htmlPackage",
                        removed: true,
                        cleanupAssetIds: [...new Set(getPackageAssetIds(value))],
                      }),
                    ),
                  )
                }
              />
            ) : null}
            {isImporting ? <Spinner muted /> : null}
            {progress ? <Text muted size={1}>{progress}</Text> : null}
          </Flex>
        </Stack>
      </Card>

      {value?.html && !value.removed ? (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              {value.originalFilename ?? "HTML package"}
            </Text>
            <Text size={1}>
              {value.imageCount ?? 0} image{value.imageCount === 1 ? "" : "s"} imported
              {value.importedAt
                ? ` on ${new Date(value.importedAt).toLocaleString()}`
                : ""}
            </Text>
            {value.warnings?.map((warning) => (
              <Text key={warning} muted size={1}>
                {warning}
              </Text>
            ))}
          </Stack>
        </Card>
      ) : null}

      {draftHtml && scheduledLookupPending ? (
        <Card border padding={3} radius={2} tone="transparent">
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted size={1}>Checking scheduled publication…</Text>
          </Flex>
        </Card>
      ) : null}

      {draftHtml && scheduledLookupError ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>
            The scheduled HTML could not be checked. {scheduledLookupError}
          </Text>
        </Card>
      ) : null}

      {draftHtml &&
      !scheduledHtml &&
      !scheduledLookupPending &&
      !scheduledLookupError ? (
        <Card border padding={3} radius={2} tone="caution">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              HTML copy unavailable for drafts
            </Text>
            <Text muted size={1}>
              Schedule or publish this entry first. The corresponding HTML copy
              option will appear here once the entry has a scheduled or published
              version.
            </Text>
          </Stack>
        </Card>
      ) : null}

      {scheduledHtml ? (
        <Card border padding={3} radius={2} tone="caution">
          <Stack space={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Scheduled HTML
              </Text>
              <Text muted size={1}>
                {scheduledRelease?.publishAt
                  ? `Scheduled for ${new Date(scheduledRelease.publishAt).toLocaleString()}. `
                  : "Scheduled for publication. "}
                Copy it now to prepare the Mailchimp campaign. Hosted image URLs are
                included; preview-only iframe changes are not.
              </Text>
            </Stack>
            <Flex align="center" gap={3} wrap="wrap">
              <Button
                text={
                  copiedHtml?.source === "scheduled" &&
                  copiedHtml.html === scheduledHtml
                    ? "Scheduled HTML copied"
                    : "Copy scheduled HTML"
                }
                mode="ghost"
                tone="primary"
                onClick={() => void copyHtml(scheduledHtml, "scheduled")}
              />
            </Flex>
          </Stack>
        </Card>
      ) : null}

      {publishedHtml ? (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Published HTML
              </Text>
              <Text muted size={1}>
                Copy the deployed HTML for Mailchimp. It includes the hosted image URLs.
              </Text>
            </Stack>
            <Flex align="center" gap={3} wrap="wrap">
              <Button
                text={
                  copiedHtml?.source === "published" &&
                  copiedHtml.html === publishedHtml
                    ? "Published HTML copied"
                    : "Copy published HTML"
                }
                mode="ghost"
                tone="primary"
                onClick={() => void copyHtml(publishedHtml, "published")}
              />
            </Flex>
          </Stack>
        </Card>
      ) : null}

      {value?.removed ? (
        <Card border padding={3} radius={2} tone="caution">
          <Text size={1}>
            This HTML package will be removed and its ZIP and images will be deleted
            when you publish the entry.
          </Text>
        </Card>
      ) : null}

      {error ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}

      {copyError ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>{copyError}</Text>
        </Card>
      ) : null}

      <Box>
        <Text muted size={1}>
          This HTML package will be published instead of Body. Remove it to publish Body
          again.
        </Text>
      </Box>
    </Stack>
  );
}
