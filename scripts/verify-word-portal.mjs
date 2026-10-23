import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium, webkit } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3005";
const out = ".qa/para-portal/final";
await mkdir(out, { recursive: true });
const approved = await readFile(
  "design-resources/PARA_Brand_Resources/01_LOGO/Solid/Web/para-wordmark-white-optical.svg",
  "utf8",
);
const sourcePaths = [...approved.matchAll(/<path d="([^"]+)"/g)].map(
  (m) => m[1],
);

async function move(page, progress, delay = 450) {
  await page.locator(".hero-loop-journey").evaluate((el, progress) => {
    scrollTo({
      top:
        el.getBoundingClientRect().top +
        scrollY +
        (el.clientHeight - innerHeight) * progress,
      behavior: "instant",
    });
  }, progress);
  await page.waitForTimeout(delay);
}

async function state(page) {
  return page.locator(".hero-loop-journey").evaluate((el) => ({
    phase: el.dataset.phase,
    progress: Number(el.style.getPropertyValue("--scene-progress")),
    stage: Number(el.querySelector("h2").dataset.headlineStage),
    artwork: Number(el.querySelector(".scene-loop").dataset.stage),
    hiddenHero: el.querySelector(".simple-hero").inert,
    hiddenLoop: el.querySelector(".scene-loop").inert,
    reveal: Number(el.style.getPropertyValue("--journey-loop-reveal")),
    canvasCount: el.querySelectorAll("canvas").length,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
}

for (const engine of [chromium, webkit]) {
  if (process.env.PORTAL_ENGINE && engine.name() !== process.env.PORTAL_ENGINE)
    continue;
  const browser = await engine.launch();
  for (const width of [1440, 1024, 390, 2560, 3440]) {
    if (process.env.PORTAL_WIDTH && width !== Number(process.env.PORTAL_WIDTH))
      continue;
    for (const locale of ["en", "vi"]) {
      const height =
        width === 390
          ? 844
          : width === 3440
            ? 1440
            : width === 2560
              ? 1080
              : 900;
      const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width === 390,
        isMobile: width === 390,
        ...(width === 1440 && locale === "en"
          ? {
              recordVideo: {
                dir: `${out}/video`,
                size: { width: 1280, height: 800 },
              },
            }
          : {}),
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const url = base + (locale === "vi" ? "/vi" : "/");
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector('[data-journey-ready="true"]');
      assert.deepEqual(
        await page
          .locator('.para-word-portal defs > g[id$="-word"] path')
          .evaluateAll((paths) => paths.map((el) => el.getAttribute("d"))),
        sourcePaths,
        "Transition must use exact approved wordmark geometry",
      );
      await page.keyboard.press("Tab");
      assert(
        await page.locator(":focus-visible").count(),
        "Keyboard focus missing",
      );
      await page.locator(":focus").evaluate((el) => el.blur());
      let slotHeight;
      for (const progress of [
        0, 0.12, 0.2, 0.28, 0.36, 0.44, 0.549, 0.551, 0.62, 0.7, 0.77, 0.83,
        0.9, 0.98, 0.83, 0.7, 0.62, 0.44, 0.2, 0,
      ]) {
        await move(page, progress);
        const current = await state(page);
        assert.equal(current.overflow, 0, "Horizontal overflow");
        assert(current.canvasCount <= 1, "Duplicate wave canvases");
        assert.equal(current.artwork, Math.max(0, current.stage));
        if (progress < 0.62)
          assert.equal(current.stage, -1, "Loop advanced behind portal");
        if (progress >= 0.2)
          assert(current.hiddenHero, "Hidden hero remains focusable");
        if (progress === 0) assert(!current.hiddenHero);
        if (progress === 0.2) {
          const box = await page
            .locator(".para-word-portal .portal-word-ink")
            .evaluate((el) => {
              const r = el.getBoundingClientRect();
              return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
            });
          assert(
            box.x > 0 && box.right < width && box.y > 80 && box.bottom < height,
            "Complete word should fit during hold",
          );
        }
        if (progress === 0.549) {
          const covered = await page
            .locator(".para-word-portal")
            .evaluate((svg) => {
              const camera = svg.querySelector('defs > g[id$="-camera"]');
              const r = svg.getBoundingClientRect();
              const matrix = camera.getCTM().inverse();
              return [
                [0, 0],
                [r.width, 0],
                [0, r.height],
                [r.width, r.height],
              ].every(([x, y]) => {
                const point = new DOMPoint(x, y).matrixTransform(matrix);
                // The R's lower stem is solid x373..411, y137..206.
                return (
                  point.x > 373 &&
                  point.x < 411 &&
                  point.y > 137 &&
                  point.y < 206
                );
              });
            });
          assert(
            covered,
            "Mask removed before all viewport corners are inside the letter",
          );
        }
        if (progress >= 0.62) {
          const slot = await page.locator(".loop-heading-slot").boundingBox();
          const art = await page.locator(".loop-diagram").boundingBox();
          assert(
            slot.y >= 79 &&
              art.y >= slot.y &&
              art.y + art.height <= height - 10,
          );
          if (slotHeight) assert(Math.abs(slot.height - slotHeight) < 1);
          slotHeight = slot.height;
          assert.equal(
            await page.locator(".loop-current-heading span").count(),
            1,
          );
        }
        if ([0, 0.2, 0.36, 0.44, 0.549, 0.62, 0.83].includes(progress))
          await page.screenshot({
            path: `${out}/${engine.name()}-${locale}-${width}-${progress}.png`,
          });
      }
      // Slow scroll, fast scroll and reverse: the same clock owns the stages.
      for (let p = 0.18; p <= 0.66; p += 0.012) await move(page, p, 35);
      if (engine === webkit && width === 390)
        await page.evaluate(() => scrollBy({ top: 1200, behavior: "instant" }));
      else await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(500);
      if (engine === webkit && width === 390)
        await page.evaluate(() =>
          scrollBy({ top: -1200, behavior: "instant" }),
        );
      else await page.mouse.wheel(0, -1200);
      await page.waitForTimeout(500);
      await move(page, 0.4);
      const restored = (await state(page)).progress;
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      assert(
        Math.abs((await state(page)).progress - restored) < 0.02,
        "Refresh lost scroll phase",
      );
      await page.setViewportSize({
        width: width === 390 ? 430 : 1200,
        height: height - 60,
      });
      await page.waitForTimeout(400);
      await move(page, 0.549);
      assert.equal((await state(page)).overflow, 0);
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForTimeout(300);
      assert.equal(
        await page
          .locator(".hero-loop-journey")
          .getAttribute("data-journey-ready"),
        "false",
      );
      assert(await page.locator("h1").isVisible());
      await page.setViewportSize({ width, height });
      await move(page, 0);
      // The hero now opens the product. Legacy loop fragments remain native.
      await page.evaluate(() => {
        location.hash = "submission-flow";
      });
      await page.waitForTimeout(1400);
      assert.equal(new URL(page.url()).hash, "#submission-flow");
      assert(
        Math.abs((await state(page)).progress - 0.62) < 0.015,
        "Anchor missed intro",
      );
      assert.equal((await state(page)).stage, -1);
      await page.goBack();
      await page.waitForTimeout(600);
      await page.goForward();
      await page.waitForTimeout(600);
      assert.equal((await state(page)).stage, -1);
      await page.goto(url + "#submission-flow", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);
      assert(
        Math.abs((await state(page)).progress - 0.62) < 0.015,
        "Direct fragment missed intro",
      );
      await page.goto(url + "#waitlist", { waitUntil: "networkidle" });
      await page.waitForFunction(() => {
        const top = document
          .getElementById("waitlist")
          .getBoundingClientRect().top;
        return top >= 79 && top < 150;
      });
      const formTop = (await page.locator("#waitlist").boundingBox()).y;
      assert(
        formTop >= 79 && formTop < 150,
        "Direct waitlist fragment missed form",
      );
      await page.goto(url + "#top", { waitUntil: "networkidle" });
      // Native smooth-scroll rounding may settle a few pixels above zero.
      await page.waitForFunction(() => scrollY < 80);
      await page.waitForTimeout(300);
      assert((await state(page)).progress < 0.01, "Top fragment missed hero");
      await page.emulateMedia({ colorScheme: "dark" });
      await move(page, 0.36);
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-dark.png`,
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(350);
      assert.equal(
        await page
          .locator(".hero-loop-journey")
          .getAttribute("data-journey-ready"),
        "false",
      );
      assert.equal(
        await page
          .locator(".para-word-portal")
          .evaluate((el) => getComputedStyle(el).display),
        "none",
      );
      assert.equal(await page.locator(".scene-loop canvas").count(), 0);
      assert(await page.locator(".loop-static-summary").isVisible());
      assert.equal(
        await page.locator(".simple-hero").evaluate((el) => el.inert),
        false,
      );
      assert.equal(
        await page.locator(".scene-loop").evaluate((el) => el.inert),
        false,
      );
      assert.equal(
        await page
          .locator(".journey-viewport")
          .evaluate((el) => getComputedStyle(el).display),
        "contents",
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-reduced.png`,
        fullPage: true,
      });
      assert.deepEqual(errors, []);
      console.log(
        engine.name(),
        locale,
        width,
        "portal, coverage, gated sequence, reverse, refresh, resize, native anchors/history and reduced motion passed",
      );
      await context.close();
    }
  }
  // No JavaScript must preserve normal semantic document order and anchor use.
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await context.addCookies([
    { name: "howl0-language-choice", value: "en", url: base },
  ]);
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const hero = await page.locator(".simple-hero").boundingBox();
  const loop = await page.locator(".scene-loop").boundingBox();
  assert(loop.y >= hero.y + hero.height - 1, "No JS must preserve normal flow");
  assert(await page.locator(".loop-static-summary").isVisible());
  await page.screenshot({
    path: `${out}/${engine.name()}-no-js.png`,
    fullPage: true,
  });
  await context.close();
  await browser.close();
}
