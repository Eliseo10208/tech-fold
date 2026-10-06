import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const read = locale => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
const es = read("es");
const en = read("en");
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, shape(value[key])]));
  return typeof value;
}
test("Spanish and English have matching content schemas and project routes", () => {
  assert.deepEqual(shape(es), shape(en));
  assert.deepEqual(es.Projects.map(p => p.slug), en.Projects.map(p => p.slug));
  assert.equal(new Set(es.Projects.map(p => p.slug)).size, 7);
});
test("Every project has meaningful case content, local assets and valid external URLs", () => {
  for (const content of [es, en]) {
    assert.ok(content.Metadata.description.length < 170);
    for (const p of content.Projects) {
      assert.match(p.slug, /^[a-z0-9-]+$/);
      for (const key of ["title", "summary", "problem", "contribution", "limits"]) assert.ok(p[key].length > 20, `${p.slug}: ${key}`);
      assert.ok(p.implementation.length >= 3);
      assert.ok(p.tags.length >= 3);
      if (p.image) {
        assert.ok(p.imageAlt);
        assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)));
      }
      for (const url of [p.url, p.code].filter(Boolean)) assert.equal(new URL(url).protocol, "https:");
      if (p.kind === "demo") { assert.ok(p.url); assert.ok(p.code); }
    }
  }
});
test("AulaQR leads demos and the approved Spanish CV is a real PDF", () => {
  assert.equal(es.Projects.filter(p => p.kind === "demo")[0].slug, "aula-qr");
  const pdf = readFileSync(new URL("../public/Rodrigo_CV.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.byteLength > 10000);
  assert.match(es.Site.about.languageText, /B1/);
  assert.match(es.Site.hero.location, /Tuxtla/);
});
