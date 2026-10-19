import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = ".qa/para-material/story";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [width, height] of [
  [1440, 900],
  [1024, 900],
  [390, 844],
]) {
  if (process.env.STORY_WIDTH && width !== Number(process.env.STORY_WIDTH))
    continue;
  for (const locale of ["en", "vi"]) {
    if (process.env.STORY_LOCALE && locale !== process.env.STORY_LOCALE)
      continue;
    const record =
      (width === 1440 && locale === "en") || (width === 390 && locale === "vi");
    const context = await browser.newContext({
      viewport: { width, height },
      ...(record
        ? {
            recordVideo: {
              dir: `${out}/video`,
              size:
                width === 390
                  ? { width: 390, height: 844 }
                  : { width: 1280, height: 800 },
            },
          }
        : {}),
    });
    await context.addCookies([
      { name: "howl0-language-choice", value: locale, url: base },
    ]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    const keys = page.locator(".hero-stage-keys button");
    assert.equal(await keys.count(), 5);
    for (let i = 0; i < 5; i++) {
      await keys.nth(i).click();
      await page.waitForTimeout(900);
      assert.equal(
        await page.locator(".scene-hero").getAttribute("data-stage"),
        String(i),
      );
      await page
        .locator(".scene-hero")
        .screenshot({ path: `${out}/${locale}-${width}-hero-${i}.png` });
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(150);
    const box = await page.locator(".scene-loop").evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.clientHeight,
    }));
    const stages = [];
    for (const fraction of [0, 0.24, 0.44, 0.64, 0.84, 1, 0.64, 0.24, 0]) {
      const target =
        width > 900
          ? box.top + fraction * Math.max(1, box.height - height)
          : box.top - height * 0.2 + fraction * box.height * 0.6;
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        target,
      );
      await page.waitForTimeout(950);
      stages.push(await page.locator(".scene-loop").getAttribute("data-stage"));
      if ([0, 0.44, 0.84, 1].includes(fraction))
        await page.screenshot({
          path: `${out}/${locale}-${width}-loop-${fraction}.png`,
        });
    }
    if (width > 900) {
      assert(
        stages.includes("0") && stages.includes("4"),
        "scroll must reach both ends of learning sequence",
      );
      assert.equal(
        stages.at(-1),
        "0",
        "reverse scrolling did not restore loop",
      );
      assert.equal(
        await page
          .locator(".loop-sticky")
          .evaluate((el) => getComputedStyle(el).position),
        "sticky",
      );
    } else
      assert.notEqual(
        await page
          .locator(".loop-sticky")
          .evaluate((el) => getComputedStyle(el).position),
        "sticky",
      );
    await page.locator(".scene-perspectives").scrollIntoViewIfNeeded();
    const tabs = page.locator(".perspective-tabs [role=tab]");
    let bounds;
    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(900);
      const h = await page
        .locator(".perspective-switcher")
        .evaluate((el) => el.getBoundingClientRect().height);
      if (bounds)
        assert(Math.abs(h - bounds) < 1, "audience tab changed layout height");
      bounds = h;
      assert.equal(
        await page.getByRole("tabpanel").filter({ visible: true }).count(),
        1,
      );
      await page
        .locator(".scene-perspectives")
        .screenshot({ path: `${out}/${locale}-${width}-audience-${i}.png` });
    }
    await tabs.nth(2).press("ArrowLeft");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    assert(await tabs.nth(1).evaluate((el) => el === document.activeElement));
    for (const id of ["belief", "waitlist"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(950);
      await page.screenshot({ path: `${out}/${locale}-${width}-${id}.png` });
    }
    // Slow native wheel input, fast direction changes and return to the hero.
    await page.keyboard.press("Home");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    const max = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    );
    for (let y = 0; y < max; y += 180) {
      await page.mouse.wheel(0, 180);
      await page.waitForTimeout(record ? 90 : 20);
    }
    for (let y = max; y > 0; y -= 800) {
      await page.mouse.wheel(0, -800);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      0,
    );
    assert(
      (await page
        .locator(".hero-copy")
        .evaluate((el) => Number(getComputedStyle(el).opacity))) > 0.98,
      "hero did not recover on reverse scroll",
    );
    assert.deepEqual(errors, [], `browser errors ${locale} ${width}`);
    const video = page.video();
    await context.close();
    if (record)
      await video.saveAs(`${out}/walkthrough-${locale}-${width}.webm`);
    console.log(
      `${locale} ${width}: five stages, reverse scroll, stable tabs, screenshots and native scroll passed`,
    );
  }
}
for (const locale of ["en", "vi"]) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await context.addCookies([
    { name: "howl0-language-choice", value: locale, url: base },
  ]);
  const page = await context.newPage();
  await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
    waitUntil: "networkidle",
  });
  const state = await page.locator(".scene-hero").getAttribute("data-stage");
  await page.waitForTimeout(2500);
  assert.equal(
    await page.locator(".scene-hero").getAttribute("data-stage"),
    state,
  );
  assert.equal(await page.locator(".loop-step").count(), 5);
  assert.notEqual(
    await page
      .locator(".loop-sticky")
      .evaluate((el) => getComputedStyle(el).position),
    "sticky",
  );
  assert.equal(
    await page.locator(".scene-hero").evaluate((el) => el.dataset.playing),
    "false",
  );
  await page
    .getByRole("link", {
      name: locale === "en" ? "See the learning loop" : "Xem vòng học",
      exact: true,
    })
    .click();
  await page.waitForTimeout(100);
  assert.equal(new URL(page.url()).hash, "#submission-flow");
  assert(
    (await page.locator("#submission-flow-heading").boundingBox()).y >= 70,
    "header covers anchored heading",
  );
  await page.screenshot({ path: `${out}/${locale}-reduced-loop.png` });
  await context.close();
}
await browser.close();
console.log(
  "Studio story QA passed. Captures and available walkthroughs saved.",
);
