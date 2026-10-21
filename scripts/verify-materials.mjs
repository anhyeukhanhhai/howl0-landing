import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const root = "public/brand/para/resources";
const out = ".qa/para-glass";
await mkdir(out, { recursive: true });
const provenance = JSON.parse(
  await readFile(`${root}/asset-provenance.json`, "utf8"),
);
const sourceManifest = new Map(
  (
    await readFile(
      `${provenance.source}/08_GUIDELINES_AND_CATALOGUE/file-manifest.csv`,
      "utf8",
    )
  )
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [file, , checksum] = line.split(",");
      return [file, checksum];
    }),
);
for (const asset of provenance.assets) {
  const copied = await readFile(`${root}/${asset.file}`);
  const original = await readFile(`${provenance.source}/${asset.source}`);
  assert(copied.equals(original), `${asset.file}: source changed`);
  assert.equal(createHash("sha256").update(copied).digest("hex"), asset.sha256);
  assert.equal(
    asset.sha256,
    sourceManifest.get(asset.source),
    `${asset.file}: package manifest mismatch`,
  );
  assert(!/PROPOSAL/.test(asset.source));
}
console.log(
  `${provenance.assets.length} production assets match original bytes; no proposals.`,
);
const glassSource = JSON.parse(
  await readFile("public/brand/para/glass/provenance.json", "utf8"),
);
for (const asset of glassSource.assets) {
  const data = await readFile(`public/brand/para/glass/${asset.file}`);
  assert(data.equals(await readFile(`${glassSource.source}/${asset.source}`)));
  assert.equal(createHash("sha256").update(data).digest("hex"), asset.sha256);
}
console.log("All 3 glass layer assets match the supplied originals.");
const browser = await chromium.launch();
for (const width of [1440, 1024, 390])
  for (const locale of ["en", "vi"]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.addCookies([
      { name: "howl0-language-choice", value: locale, url: base },
    ]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    const url = base + (locale === "vi" ? "/vi" : "/");
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert(
      (
        await page.locator(".brand img").evaluate((img) => img.currentSrc)
      ).endsWith("para-horizontal-espresso-optical.svg"),
    );
    assert(
      (
        await page
          .locator("h1")
          .evaluate((el) => getComputedStyle(el).fontFamily)
      ).includes("Plus Jakarta Sans"),
    );
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      ),
      "rgb(243, 237, 226)",
    );
    assert.equal(
      await page
        .locator(".brand img")
        .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
      140,
    );
    const art = await page
      .locator(".approved-listening img")
      .evaluate((img) => img.currentSrc);
    assert(
      art.endsWith(
        width >= 1200
          ? `para-art-03-listen-${locale}-grain.svg`
          : "para-expressive-listening-grain.svg",
      ),
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `${out}/${locale}-${width}-hero.png`,
    });
    const glass = await page
      .locator(".loop-recording-ground .para-glass__surface")
      .evaluate((el) => ({
        color: getComputedStyle(el).color,
        blur: getComputedStyle(el).backdropFilter,
      }));
    assert.equal(glass.color, "rgb(59, 47, 42)");
    assert.equal(glass.blur, `blur(${width > 640 ? 18 : 10}px) saturate(1)`);
    assert.equal(
      await page
        .locator(".loop-recording-ground > .para-glass")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    if (width <= 640)
      assert.equal(
        await page
          .locator(".perspective-reading > .para-glass__surface")
          .evaluate((el) => getComputedStyle(el).backdropFilter),
        "none",
      );
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    assert.equal(
      await page
        .locator(".loop-recording-ground .para-glass__surface")
        .evaluate((el) => getComputedStyle(el).backdropFilter),
      "none",
    );
    assert.equal(
      await page
        .locator(".loop-recording-ground .para-glass__surface")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(243, 237, 226)",
    );
    await cdp.send("Emulation.setEmulatedMedia", { features: [] });
    await page.evaluate(
      () => (document.documentElement.dataset.paraGlass = "solid"),
    );
    assert.equal(
      await page
        .locator(".loop-recording-ground .para-glass__surface")
        .evaluate((el) => getComputedStyle(el).backdropFilter),
      "none",
    );
    await page.evaluate(
      () => delete document.documentElement.dataset.paraGlass,
    );
    const before = await page
      .locator(".scene-loop")
      .evaluate((el) => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      before + 200,
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(200);
    assert.equal(
      await page
        .locator(".loop-current-heading")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    for (const size of [
      { width: 390, height: 844 },
      { width: 1024, height: 900 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(size);
      assert(
        (await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        )) <= 1,
      );
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(".hero-actions .button-primary").click();
    assert.equal(new URL(page.url()).hash, "#submission-flow");
    assert(
      (await page.locator("#submission-flow-heading").boundingBox()).y >= 80,
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `${locale} ${width}: logo, fonts, localised artwork, glass, transparency fallback, refresh, resize and anchors passed`,
    );
  }
const fallbackContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
});
await fallbackContext.addCookies([
  { name: "howl0-language-choice", value: "en", url: base },
]);
const fallback = await fallbackContext.newPage();
await fallback.goto(base, { waitUntil: "networkidle" });
assert(await fallback.locator("h1").isVisible());
assert(await fallback.locator(".loop-static-summary").isVisible());
await fallback.screenshot({ path: `${out}/no-js-mobile.png`, fullPage: true });
await browser.close();
console.log("No-JavaScript content passed.");
