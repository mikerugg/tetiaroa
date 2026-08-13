import assert from "node:assert/strict";
import test from "node:test";
import { blockContent } from "./blockContent.ts";

const imageMember = blockContent.of.find((member) => member.name === "image");
const displaySizeField = imageMember?.fields?.find(
  (field) => field.name === "displaySize",
);

test("body images offer responsive display-size choices", () => {
  assert.equal(displaySizeField?.initialValue, "standard");
  assert.equal(displaySizeField?.options?.layout, "radio");
  assert.deepEqual(
    displaySizeField?.options?.list.map((option) => option.value),
    ["compact", "standard", "full"],
  );
});
