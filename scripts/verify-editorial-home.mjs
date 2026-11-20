import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { verifyParaAssets } from "./verify-para-assets.mjs";

const base = process.env.BASE_URL || "http://localhost:3010";
const out = ".qa/para-editorial";
await mkdir(out, { recursive: true });
await verifyParaAssets();
for (const [engine, name] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  const browser = await engine.launch();
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1280, 720],
    [1440, 900],
    [3440, 1440],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      new URL(page.url()).pathname,
      "/",
      "English homepage must load without a language cookie",
    );
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".para-feature").count(), 3);
    assert.equal(await page.locator(".para-feature video").count(), 3);
    assert.equal(await page.locator(".ed-recording-journey").count(), 0);
    assert.equal(
      await page
        .locator(
          ".language-switch, .performance-reel, .scene-atmosphere, .product-cta-material",
        )
        .count(),
      0,
    );
    const sizes = await page.evaluate(() => {
      const headline = document.querySelector("h1").getBoundingClientRect();
      const artwork = document
        .querySelector(".ed-hero-art")
        .getBoundingClientRect();
      const cta = document
        .querySelector(".ed-hero .ed-button")
        .getBoundingClientRect();
      const logo = document.querySelector(".ed-brand img");
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        ctaBottom: cta.bottom,
        intersect:
          headline.right > artwork.left &&
          headline.left < artwork.right &&
          headline.bottom > artwork.top &&
          headline.top < artwork.bottom,
        ratio: logo.width / logo.height,
        naturalRatio: logo.naturalWidth / logo.naturalHeight,
        background: getComputedStyle(document.body).backgroundColor,
      };
    });
    assert(
      !sizes.overflow && !sizes.intersect,
      `${name} ${width}: layout collision`,
    );
    assert(
      sizes.ctaBottom < height,
      `${name} ${width}: initial CTA not visible`,
    );
    assert(
      Math.abs(sizes.ratio - sizes.naturalRatio) < 0.1,
      "Logo ratio changed",
    );
    assert.equal(sizes.background, "rgb(255, 255, 255)");
    for (const link of await page
      .getByRole("link", { name: "Try for free" })
      .all()) {
      assert.equal(await link.getAttribute("href"), "https://paramuzic.com");
      assert.equal(await link.getAttribute("target"), null);
    }
    await page.getByRole("link", { name: "How it works", exact: true }).click();
    await page.waitForFunction(() => {
      const top = document
        .querySelector("#how-it-works")
        .getBoundingClientRect().top;
      return top >= 60 && top < 220;
    });
    await page.keyboard.press("Tab");
    await page.locator(".ed-header .ed-button").focus();
    assert.equal(
      await page
        .locator(".ed-header .ed-button")
        .evaluate((el) => getComputedStyle(el).outlineStyle),
      "solid",
    );
    await page.screenshot({ path: `${out}/${name}-${width}-focus.png` });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `${out}/${name}-${width}.png`,
      fullPage: true,
    });
    if (width === 390 || width === 1440) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        result.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        [],
      );
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`${name} ${width}x${height} passed`);
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator(".para-feature--feedback").scrollIntoViewIfNeeded();
  assert.equal(
    await page
      .locator(".para-feature video")
      .evaluateAll((nodes) => nodes.filter((n) => !n.paused).length),
    0,
  );
  await page.screenshot({ path: `${out}/${name}-reduced.png`, fullPage: true });
  // Shared routes and the existing Vietnamese homepage remain available.
  for (const route of [
    "/product",
    "/how-it-works",
    "/faq",
    "/for-you",
    "/vi/product",
    "/vi",
  ]) {
    const response = await page.goto(base + route, {
      waitUntil: "networkidle",
    });
    assert(response.ok(), route);
    assert.equal(
      await page.locator(".para-editorial").count(),
      0,
      `${route}: homepage leaked`,
    );
  }
  await browser.close();
}
console.log(
  "Editorial homepage assets, layout, CTAs, anchors, focus, motion, accessibility and route regressions passed",
);
