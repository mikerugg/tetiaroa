import type { ImpactCategory, ImpactEntryType } from "./types";

export const topicDefinitions = [
  { value: "news", categories: ["News"] },
  {
    value: "conservation",
    categories: ["Conservation", "TARP", "Biosecurity"],
  },
  { value: "research", categories: ["Research", "Technology"] },
  { value: "wildlife", categories: ["Wildlife"] },
  { value: "education", categories: ["Education", "Culture"] },
  { value: "global-impact", categories: ["Global Impact"] },
] as const satisfies ReadonlyArray<{
  value: string;
  categories: readonly ImpactCategory[];
}>;

export type TopicValue = (typeof topicDefinitions)[number]["value"];
export type TopicFilter = "all" | TopicValue;
export type FormatFilter = "all" | ImpactEntryType;

export const sortModes = ["latest", "oldest", "az"] as const;
export type SortMode = (typeof sortModes)[number];

export const topicValues: TopicValue[] = topicDefinitions.map(
  (topic) => topic.value,
);

export const formatOrder: ImpactEntryType[] = [
  "Project",
  "Guide",
  "Profile",
  "Newsletter",
  "Video",
  "Report",
  "News",
  "Partner",
  "Article",
  "Project Update",
];

export type ImpactFeedFilters = {
  topic: TopicFilter;
  format: FormatFilter;
  query: string;
  sort: SortMode;
};

type SearchParamValues = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseImpactFilters(params: SearchParamValues): ImpactFeedFilters {
  const topic = firstValue(params.topic);
  const format = firstValue(params.format);
  const query = firstValue(params.q) ?? "";
  const sort = firstValue(params.sort);

  return {
    topic:
      topic && (topicValues as string[]).includes(topic)
        ? (topic as TopicValue)
        : "all",
    format:
      format && (formatOrder as string[]).includes(format)
        ? (format as ImpactEntryType)
        : "all",
    query,
    sort:
      sort && (sortModes as readonly string[]).includes(sort)
        ? (sort as SortMode)
        : "latest",
  };
}
