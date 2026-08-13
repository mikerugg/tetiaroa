"use client";

import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { DownloadIcon } from "lucide-react";
import {
  type DocumentActionDescription,
  type DocumentActionProps,
  useDocumentOperation,
} from "sanity";
import {
  buildIPlacesImpactValues,
  htmlToPlainText,
  parseIPlacesArticleUrl,
  type IPlacesRecord,
} from "@/lib/impact/iplaces";

type ImportResponse = {
  message?: unknown;
  record?: unknown;
};

const newImpactEntryDocument: Record<string, unknown> = {
  entryType: "Article",
  english: { _type: "impactEntryLocale" },
  french: { _type: "impactEntryLocale" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isIPlacesRecord(value: unknown): value is IPlacesRecord {
  return (
    isRecord(value) &&
    typeof value.canonicalUrl === "string" &&
    typeof value.groupName === "string" &&
    typeof value.shortId === "number" &&
    typeof value.manuscriptId === "string" &&
    typeof value.publishedAt === "string" &&
    typeof value.title === "string" &&
    typeof value.abstractHtml === "string" &&
    typeof value.sourceHtml === "string" &&
    Array.isArray(value.authors)
  );
}

function getExistingSourceUrl(document: Record<string, unknown> | null) {
  const source = document?.iplacesSource;
  return isRecord(source) && typeof source.url === "string" ? source.url : "";
}

function getErrorMessage(value: ImportResponse, fallback: string) {
  return typeof value.message === "string" ? value.message : fallback;
}

function formatPublishedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
}

type ImportDialogProps = {
  document: Record<string, unknown>;
  onApply: (record: IPlacesRecord, replaceExisting: boolean) => void;
};

function IPlacesImportDialog({ document, onApply }: ImportDialogProps) {
  const [url, setUrl] = useState(() => getExistingSourceUrl(document));
  const [record, setRecord] = useState<IPlacesRecord>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);

  const loadArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setRecord(undefined);

    try {
      parseIPlacesArticleUrl(url);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Paste a valid iPlaces article URL.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/iplaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = (await response.json()) as ImportResponse;

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            "We couldn’t load that iPlaces article. Try again.",
          ),
        );
      }

      if (!isIPlacesRecord(result.record)) {
        throw new Error(
          "iPlaces returned an incomplete article, so it can’t be imported.",
        );
      }

      setUrl(result.record.canonicalUrl);
      setRecord(result.record);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We couldn’t load that iPlaces article. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const applyImport = () => {
    if (!record) {
      return;
    }

    setIsApplying(true);
    setError("");

    try {
      onApply(record, replaceExisting);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We couldn’t add the iPlaces content to this draft.",
      );
      setIsApplying(false);
    }
  };

  const abstract = record ? htmlToPlainText(record.abstractHtml) : "";

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={2}>
          <Text size={2} weight="semibold">
            Bring in the facts. Shape the story here.
          </Text>
          <Text muted size={1}>
            Paste a published iPlaces article link. We’ll preview the source, then
            fill empty fields in the draft. You can choose to replace existing
            content; Sanity references remain yours to connect.
          </Text>
        </Stack>

        <form onSubmit={loadArticle}>
          <Stack space={3}>
            <Label as="label" htmlFor="iplaces-url" size={1}>
              iPlaces article URL
            </Label>
            <TextInput
              id="iplaces-url"
              value={url}
              onChange={(event) => setUrl(event.currentTarget.value)}
              placeholder="https://iplacesalliance.org/gumpstation/articles/46/"
              disabled={isLoading || isApplying}
            />
            <Flex justify="flex-end">
              <Button
                type="submit"
                text={isLoading ? "Loading preview…" : "Preview article"}
                tone="primary"
                disabled={isLoading || isApplying || !url.trim()}
                icon={isLoading ? Spinner : undefined}
              />
            </Flex>
          </Stack>
        </form>

        {error ? (
          <Card border padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        ) : null}

        {record ? (
          <Stack space={4}>
            <Card border padding={4} radius={2}>
              <Stack space={4}>
                <Stack space={2}>
                  <Text size={2} weight="semibold">
                    {record.title}
                  </Text>
                  <Text muted size={1}>
                    {record.groupName} · Article {record.shortId} · {formatPublishedDate(record.publishedAt)}
                  </Text>
                </Stack>

                {abstract ? <Text size={1}>{abstract}</Text> : null}

                <Stack space={2}>
                  {record.doiUrl ? (
                    <Text muted size={1}>
                      DOI: {record.doiUrl.replace("https://doi.org/", "")}
                    </Text>
                  ) : null}
                  {record.location ? (
                    <Text muted size={1}>
                      Location: {record.location}
                    </Text>
                  ) : null}
                  {record.authors.length ? (
                    <Text muted size={1}>
                      Authors: {record.authors.map((author) => author.name).join(", ")}
                    </Text>
                  ) : null}
                </Stack>
              </Stack>
            </Card>

            <Card border padding={3} radius={2} tone="caution">
              <Flex align="flex-start" gap={3}>
                <Checkbox
                  id="replace-existing"
                  checked={replaceExisting}
                  onChange={(event) =>
                    setReplaceExisting(event.currentTarget.checked)
                  }
                  disabled={isApplying}
                />
                <Stack space={2}>
                  <Label as="label" htmlFor="replace-existing" size={1}>
                    Replace existing field values
                  </Label>
                  <Text muted size={1}>
                    Leave this off to fill only blank fields. iPlaces source details
                    always refresh; Impact Entry titles, classifications, and
                    references remain yours to manage.
                  </Text>
                </Stack>
              </Flex>
            </Card>

            <Flex justify="flex-end">
              <Button
                text={isApplying ? "Importing…" : "Import into draft"}
                tone="primary"
                disabled={isApplying}
                icon={isApplying ? Spinner : undefined}
                onClick={applyImport}
              />
            </Flex>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

export function ImpactEntryIPlacesAction(
  props: DocumentActionProps,
): DocumentActionDescription {
  const [isOpen, setIsOpen] = useState(false);
  const { patch } = useDocumentOperation(props.id, props.type, props.release);
  const document = (props.version ?? props.draft ?? props.published) as
    | Record<string, unknown>
    | null;
  const importDocument = document ?? newImpactEntryDocument;

  const applyImport = (record: IPlacesRecord, replaceExisting: boolean) => {
    if (patch.disabled) {
      throw new Error("Sanity is still preparing this draft. Try again in a moment.");
    }

    const values = buildIPlacesImpactValues(record, importDocument, {
      replaceExisting,
    });
    patch.execute([{ set: values }], newImpactEntryDocument);
    setIsOpen(false);
  };

  return {
    label: "Import from iPlaces",
    icon: DownloadIcon,
    disabled: Boolean(patch.disabled),
    group: ["paneActions" as const],
    onHandle: () => setIsOpen(true),
    dialog:
      isOpen
        ? {
            type: "dialog" as const,
            header: "Import from iPlaces",
            width: "medium" as const,
            onClose: () => setIsOpen(false),
            content: (
              <IPlacesImportDialog
                key={getExistingSourceUrl(importDocument) || props.id}
                document={importDocument}
                onApply={applyImport}
              />
            ),
          }
        : false,
  };
}
