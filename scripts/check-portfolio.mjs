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
const socialImagePath = "/og/portfolio-2026-10-21.png";
const nomRagImagePath = "/projects/nom-rag-preview-2026-10-21.png";
const nomRagImageBytes = readFileSync(new URL(`public${nomRagImagePath}`, root));
assert.equal(nomRagImageBytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "NOM RAG screenshot must be a real PNG");
assert.equal(nomRagImageBytes.subarray(12, 16).toString(), "IHDR");
const nomRagImageSize = { width: nomRagImageBytes.readUInt32BE(16), height: nomRagImageBytes.readUInt32BE(20) };
const qaDir = new URL(".codex/qa/", root);
mkdirSync(qaDir, { recursive: true });
const content = Object.fromEntries(["es", "en"].map(locale => [locale, JSON.parse(readFileSync(new URL(`messages/${locale}.json`, root), "utf8"))]));
const es = content.es;
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
    const nomRag = content[locale].Projects.find(project => project.slug === "nom-rag");
    for (const path of paths) {
      const route = `/${locale}${path}`;
      const nomRagCase = path === "/projects/nom-rag";
      const expectedSocialImagePath = nomRagCase ? nomRagImagePath : socialImagePath;
      const expectedSocialImageSize = nomRagCase ? nomRagImageSize : { width: 1731, height: 909 };
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.locator("h1").count(), 1, `${route}: one h1`);
      if (path === "/projects/handbook") {
        const handbook = content[locale].Projects.find(project => project.slug === "handbook");
        assert.equal(await page.locator("h1").textContent(), handbook.title);
        assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), handbook.summary);
        assert.equal(await page.locator('meta[property="og:description"]').getAttribute("content"), handbook.summary);
        assert.deepEqual(await page.locator(".case-delivery h3").allTextContents(), handbook.implementation.map(item => item.title));
        assert.deepEqual(await page.locator(".case-delivery p").allTextContents(), handbook.implementation.map(item => item.description));
      }
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://rodrigo-e-g.lat" + route);
      for (const alt of ["es", "en", "x-default"]) {
        const target = alt === "x-default" ? "es" : alt;
        assert.equal(await page.locator(`link[rel="alternate"][hreflang="${alt}"]`).getAttribute("href"), `https://rodrigo-e-g.lat/${target}${path}`);
      }
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"), "https://rodrigo-e-g.lat" + expectedSocialImagePath);
      assert.equal(await page.locator('meta[property="og:image:width"]').getAttribute("content"), String(expectedSocialImageSize.width));
      assert.equal(await page.locator('meta[property="og:image:height"]').getAttribute("content"), String(expectedSocialImageSize.height));
      assert.equal(await page.locator('meta[property="og:image:type"]').getAttribute("content"), "image/png");
      const socialImageAlt = await page.locator('meta[property="og:image:alt"]').getAttribute("content");
      if (nomRagCase) {
        assert.equal(socialImageAlt, nomRag.imageAlt);
        assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), `${nomRag.name} | Rodrigo Eliseo García`);
        assert.equal(await page.locator('meta[property="og:description"]').getAttribute("content"), nomRag.summary);
      } else {
        assert.match(socialImageAlt, /Rodrigo Eliseo García/);
      }
      assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"), "summary_large_image");
      assert.equal(await page.locator('meta[name="twitter:image"]').getAttribute("content"), "https://rodrigo-e-g.lat" + expectedSocialImagePath);
      assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute("content"), socialImageAlt);
      assert.equal(await page.locator('link[rel="icon"]').getAttribute("href"), "/favicon.png");
      assert.equal(await page.locator('link[rel="icon"]').getAttribute("sizes"), "96x96");
      assert.equal(await page.locator("iframe").count(), 0, `${route}: no embedded apps`);
      assert.equal(await page.locator(".live-project-preview, .live-preview-overlay").count(), 0);
      assert.doesNotMatch(await page.locator("body").textContent(), /[↗↘↙↖→←↓↑]/, `${route}: no font/emoji arrows`);
      const arrows = page.locator("svg.arrow-icon");
      assert.ok(await arrows.count() > 0, `${route}: SVG arrows exist`);
      for (const arrow of await arrows.all()) {
        assert.equal(await arrow.getAttribute("aria-hidden"), "true");
        assert.equal(await arrow.getAttribute("focusable"), "false");
        assert.equal(await arrow.getAttribute("stroke"), "currentColor");
      }
      // Let visible content remain part of link names for voice control.
      assert.equal(await page.locator(".brand-mark").getAttribute("aria-label"), null);
      assert.match(await page.locator(".brand-mark").ariaSnapshot(), /Rodrigo García.*Full Stack Engineer/);
      if (!path) {
        const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
        assert.equal(profile["@type"], "ProfilePage");
        assert.equal(profile.mainEntity["@type"], "Person");
        assert.equal(await page.locator(".project-card").count(), 7);
        for (const preview of await page.locator(".preview-link").all()) {
          assert.equal(await preview.getAttribute("aria-label"), null);
          assert.ok((await preview.locator(".sr-only").textContent()).trim().length > 0);
        }
        const previewLink = page.locator(`.preview-link[href="/${locale}/projects/nom-rag"]`);
        assert.equal(await previewLink.count(), 1);
        assert.equal(await previewLink.isVisible(), true);
        assert.match(await previewLink.ariaSnapshot(), /link ".*NOM RAG/);
        assert.ok((await previewLink.locator(".sr-only").textContent()).trim().length > 0);
        assert.equal(await previewLink.evaluate(link => link.tabIndex === 0), true);
        assert.equal(await previewLink.locator(".technical-preview").count(), 0);
      }
      if (!path || nomRagCase) {
        const previewImage = page.locator(".preview-nom-rag img");
        assert.equal(await previewImage.count(), 1);
        assert.equal(await previewImage.getAttribute("alt"), nomRag.imageAlt);
        assert.match(nomRag.imageAlt, /NOM RAG/);
        assert.ok(nomRag.imageAlt.trim().length > 30);
        const optimizedImageUrl = new URL(await previewImage.getAttribute("src"), base);
        assert.equal(optimizedImageUrl.pathname, "/_next/image");
        assert.equal(optimizedImageUrl.searchParams.get("url"), nomRagImagePath);
        assert.ok(await previewImage.getAttribute("srcset"), "Screenshot must use responsive image sizes");
        assert.ok(await previewImage.getAttribute("sizes"));
        assert.equal(await previewImage.getAttribute("loading"), "lazy");
        await previewImage.scrollIntoViewIfNeeded();
        await previewImage.evaluate(image => image.decode());
        assert.equal(await previewImage.evaluate(image => image.complete && image.naturalWidth > 0), true);
        assert.equal(await page.locator("iframe").count(), 0, "Scrolling to NOM RAG must not load the app");
        const appLink = page.locator('a.button-primary[href="https://nom-rag.vercel.app/"]');
        assert.equal(await appLink.count(), 1);
        assert.equal(await appLink.getAttribute("target"), "_blank");
        assert.match(await appLink.getAttribute("rel"), /noopener/);
      }
      const downloads = await page.locator('a[download]').evaluateAll(links => links.map(a => a.getAttribute("href")));
      assert.ok(downloads.length >= 2 && downloads.every(url => url === "/Rodrigo_CV.pdf"));
      for (const size of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 1280, height: 900 }]) {
        await page.setViewportSize(size);
        const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
        assert.ok(widths.document <= widths.viewport, `${route} overflows at ${size.width}: ${JSON.stringify(widths)}`);
      }
      if (path === "/projects/handbook") {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: fileURLToPath(new URL(`case-handbook-${locale}.png`, qaDir)), fullPage: true });
        await page.locator(".case-delivery").first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: fileURLToPath(new URL(`handbook-details-${locale}.png`, qaDir)) });
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
  assert.equal(await staticPage.locator(".project-card").count(), 7);
  assert.equal(await staticPage.locator("iframe").count(), 0, "No embedded app is loaded without JavaScript");
  assert.equal(await staticPage.locator('.preview-link[href="/es/projects/nom-rag"] img').count(), 1);
  assert.equal(await staticPage.locator('a.button-primary[href="https://nom-rag.vercel.app/"]').count(), 1);
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
  assert.equal(((await sitemap.text()).match(/<loc>/g) || []).length, 18);
  const og = await request.get(base + socialImagePath);
  assert.equal(og.status(), 200);
  assert.match(og.headers()["content-type"], /image\/png/);
  const ogBytes = await og.body();
  assert.equal(ogBytes.readUInt32BE(16), 1731);
  assert.equal(ogBytes.readUInt32BE(20), 909);
  assert.ok(ogBytes.equals(readFileSync(new URL(`public${socialImagePath}`, root))), "Served social cover must match the approved asset");
  const nomRagScreenshot = await request.get(base + nomRagImagePath);
  assert.equal(nomRagScreenshot.status(), 200);
  assert.match(nomRagScreenshot.headers()["content-type"], /image\/png/);
  assert.ok((await nomRagScreenshot.body()).equals(nomRagImageBytes), "Served NOM RAG screenshot must match the local asset");
  assert.equal((await request.get(base + "/og.png")).status(), 200, "Previous social image URL remains available");
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
  await page.goto(base + socialImagePath);
  await page.setViewportSize({ width: 1731, height: 909 });
  await page.screenshot({ path: fileURLToPath(new URL("og-preview.png", qaDir)) });
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log(JSON.stringify({ pages: checked, widths: [320, 360, 390, 430, 768, 1280], metadata: "passed", navigation: "passed", noJavaScript: "passed", files: "passed", browserErrors: errors, screenshots: ".codex/qa" }, null, 2));
} finally {
  await browser.close();
}
