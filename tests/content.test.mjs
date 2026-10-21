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
  assert.equal(new Set(es.Projects.map(p => p.slug)).size, 8);
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

test("The portfolio social cover is a valid, shareable landscape PNG", () => {
  const png = readFileSync(new URL("../public/og/portfolio-2026-10-21.png", import.meta.url));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.subarray(12, 16).toString(), "IHDR");
  assert.equal(png.readUInt32BE(16), 1731);
  assert.equal(png.readUInt32BE(20), 909);
  assert.ok(Math.abs(png.readUInt32BE(16) / png.readUInt32BE(20) - 1.91) < 0.02);
  assert.ok(png.byteLength < 5 * 1024 * 1024, "Social cover must remain below 5 MB");
});

test("NOM RAG uses a local interface screenshot and its current app URL", () => {
  const imagePath = "/projects/nom-rag-preview-2026-10-21.png";
  const png = readFileSync(new URL(`../public${imagePath}`, import.meta.url));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.subarray(12, 16).toString(), "IHDR");
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 720);
  assert.ok(png.byteLength < 5 * 1024 * 1024, "Social preview must remain below 5 MB");
  for (const content of [es, en]) {
    const project = content.Projects.find(item => item.slug === "nom-rag");
    assert.equal(project.image, imagePath);
    assert.match(project.imageAlt, /NOM RAG/);
    assert.ok(project.imageAlt.trim().length > 30, "Screenshot needs descriptive alternative text");
    assert.equal(project.url, "https://nom-rag.vercel.app/");
    assert.deepEqual(content.Projects.filter(item => item.previewUrl).map(item => item.slug), [], "Projects must not auto-load embedded apps");
  }
  assert.notEqual(es.Projects.find(item => item.slug === "nom-rag").imageAlt, en.Projects.find(item => item.slug === "nom-rag").imageAlt);
});
