// Run against a local build. No logins, form submissions or third-party UI actions.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:3012";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Only local QA servers are allowed");
const root = new URL("../", import.meta.url);
const qaDir = new URL(".codex/qa/", root);
mkdirSync(qaDir, { recursive: true });
const es = JSON.parse(readFileSync(new URL("messages/es.json", root), "utf8"));
const paths = ["", ...es.Projects.map(p => `/projects/${p.slug}`)];
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
});
let checked = 0;
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["es", "en"]) {
    for (const path of paths) {
      const route = `/${locale}${path}`;
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.locator("h1").count(), 1, `${route}: one h1`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://rodrigo-e-g.lat" + route);
      for (const alt of ["es", "en", "x-default"]) {
        const target = alt === "x-default" ? "es" : alt;
        assert.equal(await page.locator(`link[rel="alternate"][hreflang="${alt}"]`).getAttribute("href"), `https://rodrigo-e-g.lat/${target}${path}`);
      }
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"), "https://rodrigo-e-g.lat/og.png");
      assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"), "summary_large_image");
      assert.equal(await page.locator('link[rel="icon"]').getAttribute("href"), "/favicon.png");
      assert.equal(await page.locator('link[rel="icon"]').getAttribute("sizes"), "96x96");
      assert.equal(await page.locator("iframe").count(), 0);
      // Let visible content remain part of link names for voice control.
      assert.equal(await page.locator(".brand-mark").getAttribute("aria-label"), null);
      assert.match(await page.locator(".brand-mark").ariaSnapshot(), /Rodrigo García.*Full Stack Engineer/);
      if (!path) {
        const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
        assert.equal(profile["@type"], "ProfilePage");
        assert.equal(profile.mainEntity["@type"], "Person");
        assert.equal(await page.locator(".project-card").count(), 6);
        for (const preview of await page.locator(".preview-link").all()) {
          assert.equal(await preview.getAttribute("aria-label"), null);
          assert.ok((await preview.locator(".sr-only").textContent()).trim().length > 0);
        }
        assert.match(await page.locator('.preview-link[href$="/nom-rag"]').ariaSnapshot(), /NOM RAG.*Query.*Retrieval.*Citations/);
      }
      const downloads = await page.locator('a[download]').evaluateAll(links => links.map(a => a.getAttribute("href")));
      assert.ok(downloads.length >= 2 && downloads.every(url => url === "/Rodrigo_CV.pdf"));
      for (const size of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 1280, height: 900 }]) {
        await page.setViewportSize(size);
        const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
        assert.ok(widths.document <= widths.viewport, `${route} overflows at ${size.width}: ${JSON.stringify(widths)}`);
      }
      if (path === "/projects/aula-qr") {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: fileURLToPath(new URL(`case-aula-${locale}.png`, qaDir)), fullPage: true });
      }
      checked++;
    }
  }
  await page.goto(base + "/es");
  for (const width of [320, 360, 390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport, `Home overflows at ${width}`);
    // Scroll through lazy-loaded images before taking a full-page capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 650) {
        scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 60));
      }
      await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
      scrollTo(0, 0);
    });
    assert.equal(await page.locator("img").evaluateAll(imgs => imgs.filter(i => i.complete && i.naturalWidth === 0).length), 0);
    await page.screenshot({ path: fileURLToPath(new URL(`home-${width}.png`, qaDir)), fullPage: true });
    await page.screenshot({ path: fileURLToPath(new URL(`hero-${width}.png`, qaDir)) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator(".mobileNavToggle");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  assert.equal(await page.locator(".mobileNavPanel").isVisible(), true);
  await page.screenshot({ path: fileURLToPath(new URL("menu-mobile.png", qaDir)) });
  await page.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
  await toggle.click();
  await page.locator('.mobileNavPanel a[href="/es#demos"]').click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await page.screenshot({ path: fileURLToPath(new URL("demos-mobile.png", qaDir)) });
  await page.locator(".more-experience summary").click();
  assert.ok(await page.locator('.more-experience a[href="/es/projects/voting"]').isVisible());
  await page.goto(base + "/es");
  const tapTargets = await page.locator(".button, .locale-pill, .mobileNavToggle, .mobile-contact-bar a").evaluateAll(els => els.filter(el => el.getBoundingClientRect().width > 0).map(el => ({ text: el.textContent, height: el.getBoundingClientRect().height })));
  assert.ok(tapTargets.every(target => target.height >= 44), JSON.stringify(tapTargets));
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(".skip-link").evaluate(el => el === document.activeElement), true);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("main").evaluate(el => el === document.activeElement), true);
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base + "/es");
  assert.equal(await staticPage.locator(".project-card").count(), 6);
  await staticPage.locator('.project-card h3 a[href="/es/projects/aula-qr"]').click();
  assert.ok((await staticPage.locator("h1").textContent()).includes("Asistencia"));
  await noJs.close();
  const request = context.request;
  assert.equal((await request.get(base + "/es/projects/does-not-exist")).status(), 404);
  assert.equal((await request.get(base + "/es/does-not-exist")).status(), 404);
  const robots = await request.get(base + "/robots.txt");
  assert.equal(robots.status(), 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/rodrigo-e-g.lat\/sitemap.xml/);
  const sitemap = await request.get(base + "/sitemap.xml");
  assert.equal(sitemap.status(), 200);
  assert.equal(((await sitemap.text()).match(/<loc>/g) || []).length, 16);
  const og = await request.get(base + "/og.png");
  assert.equal(og.status(), 200);
  assert.match(og.headers()["content-type"], /image\/png/);
  const pdf = await request.get(base + "/Rodrigo_CV.pdf");
  assert.equal(pdf.status(), 200);
  const hash = buffer => createHash("sha256").update(buffer).digest("hex");
  assert.equal(hash(await pdf.body()), hash(readFileSync(new URL("public/Rodrigo_CV.pdf", root))));
  const favicon = await request.get(base + "/favicon.png");
  assert.equal(favicon.status(), 200);
  assert.match(favicon.headers()["content-type"], /image\/png/);
  const iconBytes = await favicon.body();
  assert.equal(iconBytes.readUInt32BE(16), 96);
  assert.equal(iconBytes.readUInt32BE(20), 96);
  assert.ok(iconBytes.length < 10000, "Favicon must stay under 10 KB");
  await page.goto(base + "/favicon.png");
  await page.screenshot({ path: fileURLToPath(new URL("favicon-preview.png", qaDir)) });
  await page.goto(base + "/og.png");
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.screenshot({ path: fileURLToPath(new URL("og-preview.png", qaDir)) });
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log(JSON.stringify({ pages: checked, widths: [320, 360, 390, 430, 768, 1280], metadata: "passed", navigation: "passed", noJavaScript: "passed", files: "passed", browserErrors: errors, screenshots: ".codex/qa" }, null, 2));
} finally {
  await browser.close();
}
