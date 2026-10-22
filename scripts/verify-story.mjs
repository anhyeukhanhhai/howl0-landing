import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = ".qa/para-focus";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [width, height] of [
  [1440, 900],
  [1024, 900],
  [390, 844],
])
  for (const locale of ["en", "vi"]) {
    if (process.env.STORY_WIDTH && width !== Number(process.env.STORY_WIDTH))
      continue;
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
              size: {
                width: Math.min(width, 1280),
                height: Math.min(height, 900),
              },
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
    await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page
        .locator(
          ".hero-stage-keys,.scene-hero .recording-glass,.submission-sequence,.loop-step-signal",
        )
        .count(),
      0,
    );
    assert.equal(await page.locator(".closing-mark svg").count(), 0);
    await page.screenshot({ path: `${out}/${locale}-${width}-hero.png` });
    const loop = page.locator(".scene-loop");
    const geometry = await loop.evaluate((el) => {
      const journey = el.closest(".hero-loop-journey");
      const root = journey || el;
      return {
        top: root.getBoundingClientRect().top + scrollY,
        height: root.clientHeight,
        intro: journey ? Number(journey.dataset.loopStart) : 0,
      };
    });
    const labels =
      locale === "en"
        ? ["Assign", "Practise", "Submit", "Respond", "Next step"]
        : ["Giao bài", "Luyện tập", "Gửi bài", "Góp ý", "Bước tiếp theo"];
    let headingHeight;
    for (const fraction of [0, 0.18, 0.36, 0.54, 0.72, 0.94, 0.72, 0.36, 0]) {
      const target =
        geometry.top +
        (geometry.intro + fraction * (1 - geometry.intro)) *
          (geometry.height - height);
      await page.evaluate(
        (top) => scrollTo({ top, behavior: "instant" }),
        target,
      );
      await page.waitForTimeout(700);
      const heading = page.locator(".loop-current-heading");
      const stage = Number(await heading.getAttribute("data-headline-stage"));
      assert.equal(
        await heading.locator("span").count(),
        1,
        "overlapping headlines",
      );
      assert.equal(
        await heading.innerText(),
        stage < 0
          ? locale === "en"
            ? "One attempt. A way forward."
            : "Mỗi lần thử. Một hướng đi tiếp."
          : labels[stage],
      );
      assert.equal(
        await loop.getAttribute("data-stage"),
        String(Math.max(0, stage)),
        "headline and artwork diverged",
      );
      const slot = await page.locator(".loop-heading-slot").boundingBox();
      const art = await page.locator(".loop-diagram").boundingBox();
      assert(
        slot.y >= 75 && art.y >= slot.y && art.y + art.height < height - 10,
        "headline and artwork must stay visible together",
      );
      if (headingHeight)
        assert(
          Math.abs(headingHeight - slot.height) < 1,
          "headline slot jumped",
        );
      headingHeight = slot.height;
      assert(
        await heading.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        "headline clipped",
      );
      await page.screenshot({
        path: `${out}/${locale}-${width}-loop-${fraction}.png`,
      });
    }
    await page.locator(".perspective-tabs button").nth(2).click();
    await page.waitForTimeout(600);
    await page
      .locator(".scene-perspectives")
      .screenshot({ path: `${out}/${locale}-${width}-audience.png` });
    const focus = page.locator(".belief-focus");
    // Scrolling must not accidentally hover a phrase at the old tab pointer
    // position before we measure its initial reading interval.
    await page.mouse.move(0, 0);
    await focus.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);
    const phrases = page.locator(".belief-phrase");
    if (width === 1440) {
      // Record actual browser timing. 400ms emphasis transition plus a full 3s hold.
      await focus.evaluate((el) => {
        window.__focusTimes = [];
        new MutationObserver(() =>
          window.__focusTimes.push({
            at: performance.now(),
            active: el.dataset.active,
          }),
        ).observe(el, { attributes: true, attributeFilter: ["data-active"] });
      });
      assert.equal(await focus.getAttribute("data-active"), "0");
      await page.waitForTimeout(3050);
      assert.equal(
        await focus.getAttribute("data-active"),
        "0",
        "first phrase did not get full reading interval",
      );
      await page.waitForTimeout(500);
      assert.equal(await focus.getAttribute("data-active"), "1");
      await page.waitForTimeout(10250);
      const timing = await page.evaluate(() => window.__focusTimes);
      assert.deepEqual(
        timing.slice(0, 4).map((x) => x.active),
        ["1", "2", "3", "0"],
      );
      for (let i = 1; i < 4; i++)
        assert(
          timing[i].at - timing[i - 1].at >= 3380,
          "3s hold excludes transition",
        );
      await phrases.nth(2).hover();
      await page.waitForTimeout(3600);
      assert.equal(
        await focus.getAttribute("data-active"),
        "2",
        "hover did not pause",
      );
      await page.mouse.move(0, 0);
      await phrases.nth(1).focus();
      await page.waitForTimeout(3500);
      assert.equal(
        await focus.getAttribute("data-active"),
        "1",
        "keyboard focus did not pause",
      );
      await phrases.nth(3).click();
      assert.equal(await focus.getAttribute("data-active"), "3");
      await focus.locator(".belief-cycle-control").click();
      await page.locator("h1").scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const off = await focus.getAttribute("data-active");
      await page.waitForTimeout(3500);
      assert.equal(
        await focus.getAttribute("data-active"),
        off,
        "offscreen cycle advanced",
      );
      await focus.scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          get: () => true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.waitForTimeout(3500);
      assert.equal(
        await focus.getAttribute("data-active"),
        off,
        "hidden tab cycle advanced",
      );
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
      });
    }
    await phrases.nth(0).click();
    await page.waitForTimeout(450);
    await page
      .locator(".scene-belief")
      .screenshot({ path: `${out}/${locale}-${width}-belief.png` });
    await page
      .locator("#waitlist")
      .screenshot({ path: `${out}/${locale}-${width}-waitlist.png` });
    // Native fast/reverse scroll, then resize at a restored scroll position.
    await page.mouse.wheel(0, -1800);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(200);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(
      () =>
        Number(getComputedStyle(document.querySelector(".hero-copy")).opacity) >
        0.98,
    );
    assert(
      (await page
        .locator(".hero-copy")
        .evaluate((el) => Number(getComputedStyle(el).opacity))) > 0.98,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      0,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    assert(await page.locator(".loop-static-summary").isVisible());
    assert.notEqual(
      await page
        .locator(".loop-sticky")
        .evaluate((el) => getComputedStyle(el).position),
      "sticky",
    );
    for (const phrase of await phrases.all())
      assert.deepEqual(
        await phrase.evaluate((el) => ({
          filter: getComputedStyle(el).filter,
          transform: getComputedStyle(el).transform,
          opacity: getComputedStyle(el).opacity,
        })),
        { filter: "none", transform: "none", opacity: "1" },
      );
    assert.deepEqual(errors, []);
    const video = page.video();
    await context.close();
    if (record)
      await video.saveAs(`${out}/walkthrough-${locale}-${width}.webm`);
    console.log(
      `${locale} ${width}: synchronised headings, reverse scroll, static story, screenshots and focus interaction passed`,
    );
  }
await browser.close();
