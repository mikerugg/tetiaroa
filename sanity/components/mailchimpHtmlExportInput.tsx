"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import {
  getPublishedId,
  getVersionId,
  useClient,
  useEditState,
  useFormValue,
} from "sanity";
import { sanityApiVersion } from "../../lib/sanity/env";
import {
  combineMailchimpHtml,
  type CombinedMailchimpHtml,
} from "./combineMailchimpHtml";

type HtmlPackageValue = {
  html?: string;
  removed?: boolean;
};

type LocalizedImpactDocument = {
  english?: { htmlPackage?: HtmlPackageValue };
  french?: { htmlPackage?: HtmlPackageValue };
};

type ScheduledRelease = {
  _id: string;
  name: string;
  publishAt?: string;
};

type ScheduledReleaseProbe = {
  document?: LocalizedImpactDocument;
  error?: string;
  key: string;
  release?: ScheduledRelease;
};

type ExportSource = "published" | "scheduled";

type ExportState = {
  combined?: CombinedMailchimpHtml;
  englishHtml?: string;
  error?: string;
  frenchHtml?: string;
};

function getLocaleHtml(
  document: LocalizedImpactDocument | null | undefined,
  locale: "english" | "french",
) {
  const htmlPackage = document?.[locale]?.htmlPackage;
  return htmlPackage?.html && !htmlPackage.removed ? htmlPackage.html : undefined;
}

function getExportState(
  document: LocalizedImpactDocument | null | undefined,
): ExportState {
  const englishHtml = getLocaleHtml(document, "english");
  const frenchHtml = getLocaleHtml(document, "french");

  if (!englishHtml || !frenchHtml) {
    return { englishHtml, frenchHtml };
  }

  try {
    return {
      combined: combineMailchimpHtml(englishHtml, frenchHtml),
      englishHtml,
      frenchHtml,
    };
  } catch (caughtError) {
    return {
      englishHtml,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "The two HTML packages could not be combined.",
      frenchHtml,
    };
  }
}

function MissingPackageNotice({
  label,
  state,
}: {
  label: string;
  state: ExportState;
}) {
  const missing = [
    state.englishHtml ? "" : "English",
    state.frenchHtml ? "" : "French",
  ].filter(Boolean);

  if (!missing.length || (!state.englishHtml && !state.frenchHtml)) {
    return null;
  }

  return (
    <Card border padding={3} radius={2} tone="caution">
      <Stack space={2}>
        <Text size={1} weight="semibold">
          {label} bilingual HTML is incomplete
        </Text>
        <Text muted size={1}>
          Add the {missing.join(" and ")} HTML package before copying this version.
        </Text>
      </Stack>
    </Card>
  );
}

export function MailchimpHtmlExportInput() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const documentId = useFormValue(["_id"]);
  const publishedDocumentId =
    typeof documentId === "string"
      ? getPublishedId(documentId)
      : "new-impact-entry";
  const releaseProbeKey = `bilingual-mailchimp-v1:${publishedDocumentId}`;
  const [scheduledReleaseProbe, setScheduledReleaseProbe] =
    useState<ScheduledReleaseProbe>();
  const [copied, setCopied] = useState<{
    html: string;
    source: ExportSource;
  }>();
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const scheduledReleases = await client.fetch<ScheduledRelease[]>(
          `*[
            _type == "system.release" &&
            metadata.releaseType == "scheduled" &&
            state in ["scheduled", "scheduling"]
          ] | order(coalesce(publishAt, metadata.intendedPublishAt) asc) {
            _id,
            name,
            "publishAt": coalesce(publishAt, metadata.intendedPublishAt)
          }`,
          {},
          { perspective: "raw", signal: controller.signal },
        );
        const versionIds = scheduledReleases.map((release) =>
          getVersionId(publishedDocumentId, release.name),
        );
        const versionDocuments = versionIds.length
          ? await client.getDocuments<LocalizedImpactDocument>(versionIds, {
              signal: controller.signal,
            })
          : [];

        if (controller.signal.aborted) {
          return;
        }

        const matchingIndex = versionDocuments.findIndex(Boolean);
        setScheduledReleaseProbe({
          document:
            matchingIndex >= 0
              ? (versionDocuments[matchingIndex] ?? undefined)
              : undefined,
          key: releaseProbeKey,
          release:
            matchingIndex >= 0 ? scheduledReleases[matchingIndex] : undefined,
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
  }, [client, publishedDocumentId, releaseProbeKey]);

  const scheduledRelease =
    scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.release
      : undefined;
  const scheduledLookupPending =
    scheduledReleaseProbe?.key !== releaseProbeKey;
  const scheduledLookupError =
    scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.error
      : undefined;
  const editState = useEditState(
    publishedDocumentId,
    "impactEntry",
    "low",
    scheduledRelease?.name,
  );
  const scheduledDocument =
    (editState.version as LocalizedImpactDocument | null) ??
    (scheduledReleaseProbe?.key === releaseProbeKey
      ? scheduledReleaseProbe.document
      : undefined);
  const scheduledState = useMemo(
    () => getExportState(scheduledDocument),
    [scheduledDocument],
  );
  const publishedDocument = editState.published as LocalizedImpactDocument | null;
  const publishedState = useMemo(
    () => getExportState(publishedDocument),
    [publishedDocument],
  );
  const draftDocument = editState.draft as LocalizedImpactDocument | null;
  const draftState = useMemo(() => getExportState(draftDocument), [draftDocument]);
  const hasDraftHtml = Boolean(draftState.englishHtml || draftState.frenchHtml);
  const hasPublishedHtml = Boolean(
    publishedState.englishHtml || publishedState.frenchHtml,
  );
  const hasScheduledHtml = Boolean(
    scheduledState.englishHtml || scheduledState.frenchHtml,
  );

  const copyHtml = async (html: string, source: ExportSource) => {
    setCopyError("");

    try {
      await navigator.clipboard.writeText(html);
      setCopied({ html, source });
    } catch {
      setCopyError(
        "The HTML could not be copied. Check this browser's clipboard permission and try again.",
      );
    }
  };

  return (
    <Stack space={3}>
      <Card border padding={4} radius={2} tone="transparent">
        <Stack space={2}>
          <Text size={1} weight="semibold">
            One email, both languages
          </Text>
          <Text muted size={1}>
            Mailchimp displays French when <code>MC_LANGUAGE</code> is
            <code> fr</code>; English is used when that value is missing or anything
            else. The copied code contains the original stored HTML and hosted image
            URLs—not the Studio preview renderer.
          </Text>
        </Stack>
      </Card>

      {scheduledLookupPending && hasDraftHtml ? (
        <Card border padding={3} radius={2} tone="transparent">
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted size={1}>Checking scheduled publication…</Text>
          </Flex>
        </Card>
      ) : null}

      {scheduledLookupError ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>
            The scheduled HTML could not be checked. {scheduledLookupError}
          </Text>
        </Card>
      ) : null}

      {scheduledState.error ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>Scheduled HTML could not be combined. {scheduledState.error}</Text>
        </Card>
      ) : null}

      {scheduledState.combined ? (
        <Card border padding={3} radius={2} tone="caution">
          <Stack space={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">Scheduled bilingual HTML</Text>
              <Text muted size={1}>
                {scheduledRelease?.publishAt
                  ? `Scheduled for ${new Date(scheduledRelease.publishAt).toLocaleString()}. `
                  : "Scheduled for publication. "}
                Copy the combined HTML now so the Mailchimp campaign is ready before
                the entry goes live.
              </Text>
            </Stack>
            <Button
              text={
                copied?.source === "scheduled" &&
                copied.html === scheduledState.combined.html
                  ? "Scheduled bilingual HTML copied"
                  : "Copy scheduled bilingual HTML"
              }
              mode="ghost"
              tone="primary"
              onClick={() =>
                void copyHtml(scheduledState.combined!.html, "scheduled")
              }
            />
            {scheduledState.combined.warnings.map((warning) => (
              <Text key={warning} muted size={1}>{warning}</Text>
            ))}
          </Stack>
        </Card>
      ) : null}

      <MissingPackageNotice label="Scheduled" state={scheduledState} />

      {publishedState.error ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>Published HTML could not be combined. {publishedState.error}</Text>
        </Card>
      ) : null}

      {publishedState.combined ? (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">Published bilingual HTML</Text>
              <Text muted size={1}>
                Copy one Mailchimp-ready HTML document containing both deployed
                language packages and their hosted image URLs.
              </Text>
            </Stack>
            <Button
              text={
                copied?.source === "published" &&
                copied.html === publishedState.combined.html
                  ? "Published bilingual HTML copied"
                  : "Copy published bilingual HTML"
              }
              mode="ghost"
              tone="primary"
              onClick={() =>
                void copyHtml(publishedState.combined!.html, "published")
              }
            />
            {publishedState.combined.warnings.map((warning) => (
              <Text key={warning} muted size={1}>{warning}</Text>
            ))}
          </Stack>
        </Card>
      ) : null}

      <MissingPackageNotice label="Published" state={publishedState} />

      {hasDraftHtml &&
      !scheduledState.combined &&
      !publishedState.combined &&
      !scheduledLookupPending &&
      !scheduledLookupError ? (
        <Card border padding={3} radius={2} tone="caution">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Bilingual HTML copy unavailable for drafts
            </Text>
            <Text muted size={1}>
              Schedule or publish this entry first. Once that version includes both
              language packages, its copy button will appear here.
            </Text>
          </Stack>
        </Card>
      ) : null}

      {!hasDraftHtml && !hasPublishedHtml && !hasScheduledHtml ? (
        <Card border padding={3} radius={2} tone="transparent">
          <Text muted size={1}>
            Upload rich HTML packages in both English and French to create a
            bilingual Mailchimp export.
          </Text>
        </Card>
      ) : null}

      {copyError ? (
        <Card border padding={3} radius={2} tone="critical">
          <Text size={1}>{copyError}</Text>
        </Card>
      ) : null}
    </Stack>
  );
}
