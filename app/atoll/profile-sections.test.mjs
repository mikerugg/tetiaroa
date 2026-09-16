import assert from "node:assert/strict";
import test from "node:test";
import { groupGuideBody } from "./profile-sections.ts";

const text = (key, value, style = "normal") => ({ _type: "block", _key: key, style, children: [{ _type: "span", text: value, marks: [] }], markDefs: [] });

test("authored headings group complete prose and mixed media without dropping metadata", () => {
  const source = [
    text("intro", "A note before the sections."),
    text("one", "Life on the reef", "h2"),
    { ...text("paragraph", "Read the study."), markDefs: [{ _key: "study", _type: "link", href: "https://example.org/study" }] },
    { _type: "image", _key: "photo", url: "/reef.jpg", credit: "Photographer", license: "CC BY" },
    { _type: "audio", _key: "sound", url: "/bird.mp3", credit: "Recordist" },
    text("two", "Names and traditions", "h2"),
    text("subheading", "Sources", "h3"),
    { _type: "fileLink", _key: "file", url: "/study.pdf", label: "Research paper" },
  ];
  const original = structuredClone(source);
  const result = groupGuideBody(source);
  assert.equal(result.introduction.length, 1);
  assert.deepEqual(result.sections.map((section) => section.title), ["Life on the reef", "Names and traditions"]);
  assert.deepEqual(result.sections.map((section) => section.blocks.length), [3, 2]);
  assert.deepEqual([...result.introduction, ...result.sections.flatMap((section) => [section.heading, ...section.blocks])], original);
  assert.deepEqual(source, original);
});

test("a short profile without headings remains intact", () => {
  const source = [text("short", "A complete short profile.")];
  assert.deepEqual(groupGuideBody(source), { introduction: source, sections: [] });
});

test("duplicate and adjacent headings remain distinct without losing empty or untitled blocks", () => {
  const source = [text("a", "Habitat", "h2"), text("b", "Habitat", "h2"), text("empty", "", "h2"), text("c", "Local detail.")];
  const result = groupGuideBody(source);
  assert.equal(result.sections.length, 2);
  assert.notEqual(result.sections[0].id, result.sections[1].id);
  assert.equal(result.sections[0].blocks.length, 0);
  assert.deepEqual(result.sections[1].blocks, source.slice(2));
});

test("heading text retains every span and lower headings stay with their section", () => {
  const heading = { ...text("title", "", "h1"), children: [{ _type: "span", text: "Noms ", marks: [] }, { _type: "span", text: "polynésiens", marks: ["em"] }] };
  const subheading = text("sub", "Dans les Tuamotu", "h3");
  const result = groupGuideBody([heading, subheading]);
  assert.equal(result.sections[0].title, "Noms polynésiens");
  assert.equal(result.sections[0].heading, heading);
  assert.deepEqual(result.sections[0].blocks, [subheading]);
});
