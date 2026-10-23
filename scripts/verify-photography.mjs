import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3004";
const out = ".qa/para-photos/after";
await mkdir(out, { recursive: true });
const manifest = JSON.parse(
  await readFile("public/images/performance/provenance.json", "utf8"),
);
for (const asset of manifest.assets) {
  const original = await readFile(`${manifest.source}/${asset.source}`);
  assert.equal(
    createHash("sha256").update(original).digest("hex"),
    asset.sourceSha256,
    "Original changed",
  );
  assert(
    asset.bytes < original.length * 0.2,
    "Web export must be substantially smaller",
  );
}
const browser = await chromium.launch();
for (const [width, height] of [
  [1440, 900],
  [1024, 900],
  [390, 844],
])
  for (const locale of ["en", "vi"]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2,
    });
    await context.addCookies([
      { name: "howl0-language-choice", value: locale, url: base },
    ]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    const images = page.locator(".reel-track > .reel-sequence img");
    assert.equal(await images.count(), 3);
    for (const img of await images.all())
      assert.equal(await img.getAttribute("loading"), "lazy");
    assert.equal(await page.locator("#belief .belief-photograph").count(), 0);
    for (const img of await images.all())
      assert((await img.getAttribute("alt")).length > 10);
    const before = await page.locator(".reel-viewport").boundingBox();
    for (const id of ["belief", "waitlist"]) {
      await page.evaluate(
        (id) =>
          scrollTo({
            top:
              document.querySelector("#" + id).getBoundingClientRect().top +
              scrollY -
              90,
            behavior: "instant",
          }),
        id,
      );
      await page.locator("#" + id + " img").evaluateAll((imgs) =>
        Promise.all(
          imgs.map((img) => {
            img.loading = "eager";
            return img.decode();
          }),
        ),
      );
      await page.waitForTimeout(650);
      await page.screenshot({ path: `${out}/${locale}-${width}-${id}.png` });
      await page
        .locator("#" + id)
        .screenshot({ path: `${out}/${locale}-${width}-${id}-full.png` });
    }
    const after = await page.locator(".reel-viewport").boundingBox();
    assert(
      Math.abs(before.height - after.height) < 1,
      "Image loading changed reserved layout height",
    );
    assert.equal(
      await page
        .locator(".reel-track > .reel-sequence img")
        .first()
        .evaluate((img) => getComputedStyle(img).objectFit),
      "contain",
    );
    for (const img of await images.all()) {
      assert(
        await img.evaluate(
          (el) =>
            Math.abs(
              el.clientWidth / el.clientHeight -
                Number(el.getAttribute("width")) /
                  Number(el.getAttribute("height")),
            ) < 0.01,
        ),
        "Portrait crop changed original aspect ratio",
      );
    }
    const delivered = [];
    for (const img of await images.all()) {
      const src = await img.evaluate((el) => el.currentSrc);
      assert(src.includes("/_next/image?"), "Framework optimisation missing");
      const response = await context.request.get(src);
      assert(response.ok());
      delivered.push((await response.body()).length);
    }
    assert(
      delivered.reduce((a, b) => a + b, 0) < 800000,
      "Photo payload exceeds conservative DPR 2 budget",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      0,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".reel-track")
        .evaluate((el) => getComputedStyle(el).transform),
      "none",
    );
    assert.equal(
      await page
        .locator(".reel-copies")
        .evaluate((el) => getComputedStyle(el).display),
      "none",
    );
    assert.deepEqual(errors, []);
    console.log(
      locale,
      width,
      `DPR 2 photo bytes: ${delivered.join(" + ")} = ${delivered.reduce((a, b) => a + b, 0)}; source hashes, responsive delivery, ratios, layout reservation and static fallback passed`,
    );
    await context.close();
  }
await browser.close();
