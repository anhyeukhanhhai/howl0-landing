import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3004";
const out = ".qa/para-motion/after";
const luminance = (rgb) =>
  rgb
    .map((value) => value / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
      0,
    );
await mkdir(out, { recursive: true });
for (const engine of [chromium, webkit]) {
  if (process.env.MOTION_ENGINE && process.env.MOTION_ENGINE !== engine.name())
    continue;
  const browser = await engine.launch();
  for (const width of [1440, 1024, 390]) {
    if (process.env.MOTION_WIDTH && Number(process.env.MOTION_WIDTH) !== width)
      continue;
    for (const locale of ["en", "vi"]) {
      const touch = width === 390;
      const context = await browser.newContext({
        viewport: { width, height: touch ? 844 : 900 },
        hasTouch: touch,
        isMobile: touch,
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(1000);
      const hero = page.locator(".scene-hero");
      // The opening is now intentionally quiet. Portal/loop wave timing and
      // visibility are covered by verify-word-portal and verify-loop-waves.
      assert.equal(
        await page.locator(".gradient-wave,.hero-visual").count(),
        0,
      );
      assert.equal(await page.locator(".para-word-portal").count(), 1);
      assert.equal(await hero.getAttribute("data-playing"), "false");
      await page.waitForTimeout(500);
      const cta = page.locator(".hero-actions .product-cta");
      const before = await cta.boundingBox();
      await page.mouse.move(
        before.x + before.width * 0.8,
        before.y + before.height * 0.5,
      );
      await page.waitForTimeout(350);
      const after = await cta.boundingBox();
      // Actual composited gradient/grain contrast is sampled by
      // verify-product-cta; a transparent anchor has no nominal fill to test.
      assert.equal(
        await cta
          .locator(".product-cta-label")
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      assert(
        Math.abs(before.x - after.x) < 0.1 &&
          Math.abs(before.y - after.y) < 0.1,
        "CTA target moved",
      );
      if (!touch) {
        assert.equal(
          await cta
            .locator(".product-cta-material")
            .evaluate((el) => getComputedStyle(el).transform !== "none"),
          true,
        );
      }
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-hero.png`,
      });
      const pane = page.locator(".perspective-pane.active");
      await page.keyboard.press("Tab");
      await pane.focus();
      await page.waitForTimeout(400);
      assert.equal(
        await pane.evaluate((el) => getComputedStyle(el).outlineStyle),
        "solid",
        "Keyboard focus is not visible",
      );
      await page.locator(".perspective-tabs button").nth(2).click();
      await page.waitForTimeout(450);
      const photo = page.locator(".reel-viewport");
      await photo.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const box = await photo.boundingBox();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.25);
      await page.waitForTimeout(550);
      const playback = await page
        .locator(".reel-track")
        .evaluate((el) => el.getAnimations()[0].playState);
      if (touch)
        assert(
          await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
        );
      assert.equal(playback, "running", "Visible reel is not moving");
      await page.locator(".performance-reel").screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-photos.png`,
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(
        () =>
          getComputedStyle(document.querySelector(".reel-track")).transform ===
          "none",
      );
      assert.equal(
        await page
          .locator(".para-word-portal")
          .evaluate((el) => getComputedStyle(el).display),
        "none",
      );
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
      await page.emulateMedia({ reducedMotion: "no-preference" });
      if (engine === chromium) {
        // Playwright does not expose reduced transparency in emulateMedia.
        const session = await context.newCDPSession(page);
        await session.send("Emulation.setEmulatedMedia", {
          features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
        });
        assert(
          await page.evaluate(
            () => matchMedia("(prefers-reduced-transparency: reduce)").matches,
          ),
        );
      } else {
        // WebKit has no equivalent protocol emulation; test the explicit solid
        // override instead, without claiming OS preference emulation.
        await page.evaluate(
          () => (document.documentElement.dataset.paraGlass = "solid"),
        );
      }
      assert.equal(
        await page
          .locator(".practice-session")
          .evaluate((el) => getComputedStyle(el).backdropFilter),
        "none",
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        0,
      );
      assert.deepEqual(errors, []);
      await page.emulateMedia({
        colorScheme: "dark",
        reducedMotion: "no-preference",
      });
      const navPaint = await page
        .locator(".site-header .nav-cta")
        .evaluate((el) => {
          const paint = getComputedStyle(el);
          // The stationary anchor is transparent. In this solid preference
          // state the actual paint belongs to its inner glass surface.
          return [
            paint.color,
            getComputedStyle(el.querySelector(".product-cta-glass"))
              .backgroundColor,
          ];
        });
      assert.notEqual(
        navPaint[0],
        navPaint[1],
        "Dark navigation CTA lost its label contrast",
      );
      const navRgb = navPaint.map((value) =>
        value
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number),
      );
      const navLevels = navRgb.map(luminance).sort((a, b) => b - a);
      assert(
        (navLevels[0] + 0.05) / (navLevels[1] + 0.05) >= 4.5,
        "Theme transition faded the navigation label",
      );
      // Tall element screenshots may reset Chromium's emulated touch input
      // during a temporary viewport resize. Capture this after input checks.
      await page.locator(".scene-perspectives").screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-audience.png`,
      });
      console.log(
        engine.name(),
        locale,
        width,
        "quiet opening, stable CTA, session focus, reel, touch and preference fallbacks passed",
      );
      await context.close();
    }
  }
  const fallback = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await fallback.addCookies([
    { name: "howl0-language-choice", value: "en", url: base },
  ]);
  const page = await fallback.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(
    await page
      .locator(".para-word-portal")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  assert(await page.locator("h1").isVisible());
  assert(await page.locator(".hero-actions .product-cta").isVisible());
  await page.screenshot({
    path: `${out}/${engine.name()}-static-fallback.png`,
  });
  await fallback.close();
  await browser.close();
}
