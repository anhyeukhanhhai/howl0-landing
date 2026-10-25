import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3006";
await mkdir(".qa/final-scene", { recursive: true });
for (const engine of [chromium, webkit]) {
  if (process.env.FINAL_ENGINE && engine.name() !== process.env.FINAL_ENGINE)
    continue;
  const browser = await engine.launch();
  for (const locale of ["en", "vi"]) {
    for (const [width, height] of [
      [3440, 1440],
      [2560, 1080],
      [1920, 1080],
      [1440, 900],
      [1440, 768],
      [1440, 565],
      [1280, 600],
      [1280, 720],
      [1024, 768],
      [390, 844],
      [390, 700],
      [390, 680],
      [390, 580],
      [390, 550],
      [700, 760],
      [844, 390],
      [700, 450],
    ]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const path = locale === "en" ? "/" : "/vi";
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      const header = page.locator(".site-header");
      assert.deepEqual(
        await header.evaluate((el) => {
          const s = getComputedStyle(el);
          return [s.backgroundColor, s.borderBottomWidth, s.backdropFilter];
        }),
        ["rgba(0, 0, 0, 0)", "0px", "none"],
      );
      assert.equal(await page.locator(".footer").count(), 0);
      assert.equal(await page.locator("footer").count(), 1);
      if (width <= 1280) {
        const menu = page.locator(".menu-toggle");
        await menu.click();
        assert.equal(await menu.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("Tab");
        assert(
          await page
            .locator(".site-header")
            .evaluate((el) => el.contains(document.activeElement)),
        );
        await page.keyboard.press("Escape");
        assert.equal(await menu.getAttribute("aria-expanded"), "false");
        assert(await menu.evaluate((el) => el === document.activeElement));
      }
      await page.evaluate(() =>
        scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        }),
      );
      await page.waitForTimeout(200);
      const scene = page.locator(".final-scene");
      for (const [selector, alignment] of [
        [".final-available", "left"],
        [".final-next", "right"],
      ]) {
        const typography = await scene.locator(selector).evaluate((el) => ({
          weight: getComputedStyle(el).fontWeight,
          align: getComputedStyle(el).textAlign,
        }));
        assert.equal(typography.weight, "700");
        assert.equal(typography.align, alignment);
      }
      const action = await scene.locator(".final-action").boundingBox();
      assert(action.width >= 220 && action.width <= 280);
      assert(action.height >= 60 && action.height <= 80);
      assert.equal(
        await scene.locator("a").getAttribute("href"),
        "https://paramuzic.com",
      );
      assert.equal(await scene.locator("a").getAttribute("target"), null);
      assert.equal(await scene.locator(".final-utilities button").count(), 4);
      const url = page.url();
      for (const button of await scene
        .locator(".final-utilities button")
        .all()) {
        await button.click();
        assert.equal(page.url(), url);
      }
      assert.equal(context.pages().length, 1);
      const dimensions = await page.evaluate(() => {
        const end = document
          .querySelector(".final-scene")
          .getBoundingClientRect();
        const rect = (selector) =>
          document.querySelector(selector).getBoundingClientRect().toJSON();
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          tail: document.documentElement.scrollHeight - (end.bottom + scrollY),
          header: rect(".site-header"),
          logo: rect(".brand"),
          title: rect(".final-available"),
          reel: rect(".performance-reel"),
          next: rect(".final-next"),
          action: rect(".final-action"),
          controls: rect(".final-utilities"),
        };
      });
      assert(dimensions.overflow <= 1, JSON.stringify(dimensions));
      assert(Math.abs(dimensions.tail) <= 1, JSON.stringify(dimensions));
      assert(dimensions.logo.top >= 0 && dimensions.logo.bottom <= height);
      for (const [key, clearance] of [
        ["title", 24],
        ["reel", 16],
        ["next", 16],
        ["action", 16],
        ["controls", 16],
      ]) {
        const region = dimensions[key];
        if (region.bottom > 0 && region.top < height)
          assert(
            region.top >= dimensions.header.bottom + clearance - 1,
            `${locale} ${width}x${height}: ${key} intersects the header`,
          );
      }
      assert(
        dimensions.title.bottom <= dimensions.reel.top,
        "Upper statement enters the film reel row",
      );
      assert(
        dimensions.reel.bottom <= dimensions.next.top,
        "Film reel enters the lower statement row",
      );
      assert(
        Math.max(dimensions.next.bottom, dimensions.action.bottom) <=
          dimensions.controls.top,
        "Lower statement or action enters the utility row",
      );
      await page.screenshot({
        path: `.qa/final-scene/${engine.name()}-${locale}-${width}x${height}.png`,
      });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
      await page.waitForFunction(
        () =>
          getComputedStyle(document.querySelector(".reel-track")).transform ===
          "none",
      );
      assert.equal(
        await scene
          .locator(".reel-track")
          .evaluate((el) => getComputedStyle(el).transform),
        "none",
      );
      await page.screenshot({
        path: `.qa/final-scene/${engine.name()}-${locale}-${width}x${height}-dark.png`,
      });
      await page.goto(base + path + "#waitlist");
      await page.evaluate(() => document.fonts.ready);
      const anchor = await page.evaluate(() => ({
        header: document.querySelector(".site-header").getBoundingClientRect()
          .bottom,
        heading: document
          .querySelector(".final-available")
          .getBoundingClientRect().top,
      }));
      assert(
        anchor.heading >= anchor.header + 23,
        `${locale} ${width}x${height}: ending anchor obscures the headline`,
      );
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      assert(await page.locator(".brand").isVisible());
      await page.setViewportSize({ width: 1281, height });
      assert.equal(await page.locator(".menu-toggle").isVisible(), false);
      await page.setViewportSize({ width: 1280, height });
      assert.equal(await page.locator(".menu-toggle").isVisible(), true);
      await page.goto(base + (locale === "vi" ? "/vi" : "") + "/product");
      assert.equal(await page.locator(".footer").count(), 1);
      assert.deepEqual(errors, []);
      console.log(`${engine.name()} ${locale} ${width}x${height}: passed`);
      await context.close();
    }
  }
  await browser.close();
}
