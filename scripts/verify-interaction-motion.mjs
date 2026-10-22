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
      const cta = page.locator(".hero-actions .button-primary");
      const before = await cta.boundingBox();
      await page.mouse.move(
        before.x + before.width * 0.8,
        before.y + before.height * 0.5,
      );
      await page.waitForTimeout(350);
      const after = await cta.boundingBox();
      const paint = await cta.evaluate((el) => {
        const style = getComputedStyle(el);
        return [style.color, style.backgroundColor].map((value) =>
          value
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number),
        );
      });
      // Conservative brightest-point composite, using full 0.30 alpha even
      // though the CTA caps the shared light at 80% (effective alpha 0.24).
      const bright = paint[1].map(
        (value, index) => value * 0.7 + [243, 237, 226][index] * 0.3,
      );
      const levels = [luminance(paint[0]), luminance(bright)].sort(
        (a, b) => b - a,
      );
      assert(
        (levels[0] + 0.05) / (levels[1] + 0.05) >= 4.5,
        "CTA highlight reduces label contrast",
      );
      assert(
        Math.abs(before.x - after.x) < 0.1 &&
          Math.abs(before.y - after.y) < 0.1,
        "CTA target moved",
      );
      if (!touch) {
        assert.equal(await cta.getAttribute("data-pointer-active"), "true");
      }
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-hero.png`,
      });
      const pane = page.locator(".perspective-pane.active");
      await pane.focus();
      await page.waitForTimeout(400);
      assert.equal(
        await page
          .locator(".perspective-reading > .surface-light")
          .evaluate((el) => getComputedStyle(el).opacity),
        "0.75",
        "Keyboard focus lacks the equivalent surface state",
      );
      await page.locator(".perspective-tabs button").nth(2).click();
      await page.waitForTimeout(450);
      const photo = page.locator(".performance-print-duo");
      await photo.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const box = await photo.boundingBox();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.25);
      await page.waitForTimeout(550);
      const tilt = await page
        .locator(".performance-print-duo .performance-photo-depth")
        .evaluate((el) => getComputedStyle(el).transform);
      if (touch)
        assert(
          await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
        );
      if (touch) assert.equal(tilt, "none", "Tilt enabled on touch");
      else assert(tilt.startsWith("matrix3d("), "Desktop photo depth absent");
      await page.locator(".closing-editorial").screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-photos.png`,
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(
        await page
          .locator(".para-word-portal")
          .evaluate((el) => getComputedStyle(el).display),
        "none",
      );
      assert.equal(
        await page
          .locator(".performance-photo-depth")
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
        "none",
      );
      assert.equal(
        await photo
          .locator(".surface-light")
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
        await photo
          .locator(".surface-light")
          .evaluate((el) => getComputedStyle(el).display),
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
          return [paint.color, paint.backgroundColor];
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
        "quiet opening, stable CTA, keyboard glass, photo depth, touch and preference fallbacks passed",
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
  assert(await page.locator(".hero-actions .button-primary").isVisible());
  await page.screenshot({
    path: `${out}/${engine.name()}-static-fallback.png`,
  });
  await fallback.close();
  await browser.close();
}
