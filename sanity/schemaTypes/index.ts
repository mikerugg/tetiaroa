import { impactEntry } from "./documents/impactEntry";
import { organization } from "./documents/organization";
import { person } from "./documents/person";
import { program } from "./documents/program";
import { topic } from "./documents/topic";
import { blockContent } from "./objects/blockContent";
import { htmlPackage } from "./objects/htmlPackage";
import { impactEntryLocale } from "./objects/impactEntryLocale";

export const schemaTypes = [
  impactEntry,
  program,
  topic,
  person,
  organization,
  blockContent,
  htmlPackage,
  impactEntryLocale,
];
