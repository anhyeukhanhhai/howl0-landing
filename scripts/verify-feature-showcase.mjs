import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { verifyParaAssets } from "./verify-para-assets.mjs";

const base = process.env.BASE_URL || "http://localhost:3010";
const out = ".qa/feature-showcase";
await mkdir(out, { recursive: true });
const ids = ["take", "feedback", "next"];
await verifyParaAssets();

async function panelCaptures(page, prefix) {
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const full = await page.screenshot({
    path: `${prefix}-page.png`,
    fullPage: true,
  });
  for (const id of ids) {
    const box = await page.locator(`.para-feature--${id}`).evaluate((e) => {
      const b = e.getBoundingClientRect();
      return {
        left: Math.round(b.left),
        top: Math.round(b.top + scrollY),
        width: Math.floor(b.width),
        height: Math.floor(b.height),
      };
    });
    await sharp(full).extract(box).png().toFile(`${prefix}-${id}.png`);
  }
}

// Layout and accessibility do not depend on playback timing.
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const colorScheme of ["light", "dark"]) {
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [390, 844],
      [2560, 1080],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        colorScheme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page
          .locator("body")
          .evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgb(255, 255, 255)",
      );
      assert.equal(
        await page
          .locator("html")
          .evaluate((e) => getComputedStyle(e).colorScheme),
        "light",
      );
      assert(
        (
          await page.locator(".ed-brand img").evaluate((e) => e.currentSrc)
        ).endsWith("para-horizontal-black.svg"),
      );
      assert.equal(await page.locator(".ed-signal-in").count(), 0);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("#how-it-works").count(), 1);
      assert.equal(await page.locator(".para-feature").count(), 3);
      assert.equal(
        await page
          .locator(
            ".ed-recording-journey,.ed-story-heading,.ed-journey-stages,.pin-spacer",
          )
          .count(),
        0,
      );
      assert(
        await page
          .locator("video")
          .evaluateAll((v) =>
            v.every(
              (e) =>
                e.paused &&
                !e.getAttribute("src") &&
                e.preload === "none" &&
                e.muted &&
                e.playsInline &&
                e.loop,
            ),
          ),
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      const geometry = await page
        .locator(".para-feature")
        .evaluateAll((panels) =>
          panels.map((p) => {
            const box = (e) => {
              const b = e.getBoundingClientRect();
              return { x: b.x, y: b.y, w: b.width, h: b.height };
            };
            const icon = p.querySelector(".para-feature-icon"),
              h = p.querySelector("h2");
            return {
              panel: box(p),
              copy: box(p.querySelector(".para-feature-copy")),
              media: box(p.querySelector("figure")),
              icon: box(icon),
              heading: box(h),
              radius: getComputedStyle(p).borderTopLeftRadius,
              background: getComputedStyle(p).backgroundColor,
              ink: getComputedStyle(h).color,
            };
          }),
        );
      for (const g of geometry) {
        assert.equal(g.background, "rgb(255, 255, 255)");
        assert.equal(g.ink, "rgb(17, 17, 17)");
        assert.equal(g.radius, width === 390 ? "20px" : "28px");
        assert(g.panel.w <= 1121 && g.panel.x >= 15);
        assert(
          !(
            g.icon.x < g.heading.x + g.heading.w &&
            g.icon.x + g.icon.w > g.heading.x &&
            g.icon.y < g.heading.y + g.heading.h &&
            g.icon.y + g.icon.h > g.heading.y
          ),
          "Icon overlaps heading",
        );
      }
      assert.equal(
        await page
          .locator("#how-it-works")
          .evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgb(245, 245, 247)",
      );
      if (width > 800) {
        assert(
          geometry[0].media.x > geometry[0].copy.x + geometry[0].copy.w - 1,
        );
        assert(
          geometry[1].media.x > geometry[1].copy.x + geometry[1].copy.w - 1,
        );
        assert(
          geometry[2].media.y >= geometry[2].copy.y + geometry[2].copy.h + 27,
        );
      } else
        for (const g of geometry) assert(g.media.y >= g.copy.y + g.copy.h + 23);
      for (const link of await page
        .getByRole("link", { name: "Try for free" })
        .all())
        assert.equal(await link.getAttribute("href"), "https://paramuzic.com");
      await page
        .getByRole("link", { name: "How it works", exact: true })
        .click();
      const anchorTop = await page
        .locator("#how-it-works")
        .evaluate((e) => e.getBoundingClientRect().top);
      assert(anchorTop >= 68 && anchorTop <= 100, `Anchor ${anchorTop}`);
      for (const id of ids) {
        const button = page.locator(`[data-demo="${id}"] button`);
        await page.keyboard.press("Tab");
        await button.focus();
        assert.equal(
          await button.evaluate((e) => getComputedStyle(e).outlineStyle),
          "solid",
        );
        assert((await button.boundingBox()).height >= 44);
      }
      const prefix = `${out}/${engine.name()}-${colorScheme}-${width}`;
      await panelCaptures(page, prefix);
      if (width === 1440 || width === 390) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.deepEqual(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        `${engine.name()} ${colorScheme} ${width}x${height}: layout, posters, focus, anchor and a11y passed`,
      );
    }
  }
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base);
  assert.equal(
    await staticPage.getByRole("link", { name: /^Watch Your/ }).count(),
    3,
  );
  await staticContext.close();
  await browser.close();
}

// Watch actual playback in the page, without seeking or changing playback rate.
for (const engine of process.env.LAYOUT_ONLY === "1"
  ? []
  : [chromium, webkit]) {
  const browser = await engine.launch();
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      colorScheme: "light",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "networkidle" });
    assert(
      await page
        .locator("video")
        .evaluateAll((v) => v.every((e) => !e.getAttribute("src"))),
      "Video loaded on first paint",
    );
    for (const id of ids) {
      const frame = page.locator(`[data-demo="${id}"] .para-demo-frame`),
        video = page.locator(`#demo-${id}`);
      await frame.evaluate((e) =>
        scrollTo({
          top: e.getBoundingClientRect().top + scrollY - 90,
          behavior: "instant",
        }),
      );
      await page.waitForFunction(
        (id) => {
          const v = document.querySelector(`#demo-${id}`);
          return v.currentTime > 1 && !v.paused;
        },
        id,
        { timeout: 20000 },
      );
      const metadata = await video.evaluate((v) => ({
        w: v.videoWidth,
        h: v.videoHeight,
        d: v.duration,
      }));
      assert.deepEqual(metadata, { w: 1440, h: 1080, d: 9.5 });
      assert(
        await page
          .locator("video")
          .evaluateAll((v) => v.filter((e) => !e.paused).length <= 1),
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${width}-${id}-playing.png`,
      });
      if (id === "take") {
        await page.locator(`[data-demo="${id}"] button`).focus();
        await page.keyboard.press("Space");
        const paused = await video.evaluate((v) => v.currentTime);
        await page.waitForTimeout(500);
        assert.equal(await video.evaluate((v) => v.currentTime), paused);
        await page.keyboard.press("Space");
      }
      await page.waitForFunction(
        (id) => document.querySelector(`#demo-${id}`).currentTime >= 4.8,
        id,
        { timeout: 15000 },
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${width}-${id}-middle.png`,
      });
      await page.waitForFunction(
        (id) => document.querySelector(`#demo-${id}`).currentTime >= 9.1,
        id,
        { timeout: 15000 },
      );
      const frameData = await video.evaluate((v) => {
        const c = document.createElement("canvas");
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        c.getContext("2d").drawImage(v, 0, 0);
        return c.toDataURL().split(",")[1];
      });
      await writeFile(
        `${out}/${engine.name()}-${width}-${id}-decoded-late.png`,
        Buffer.from(frameData, "base64"),
      );
      assert.equal(
        await page.locator(`[data-demo="${id}"] button`).innerText(),
        "Pause demo",
      );
      await page.waitForFunction(
        (id) => {
          const v = document.querySelector(`#demo-${id}`);
          return v.loop && !v.paused && v.currentTime < 2;
        },
        id,
        { timeout: 4000 },
      );
      assert.equal(
        await page.getByRole("button", { name: /Replay/ }).count(),
        0,
      );
      assert.equal(
        await page.locator(`[data-demo="${id}"] .para-demo-error`).count(),
        0,
      );
      assert(
        await frame.evaluate((e) => {
          const b = e.getBoundingClientRect(),
            v = e.querySelector("video").getBoundingClientRect();
          // Include the recorded Mac toolbar and complete task area in every demo.
          const roi = [110, 55, 1330, 1025];
          return (
            v.left + (roi[0] / 1440) * v.width >= b.left &&
            v.left + (roi[2] / 1440) * v.width <= b.right &&
            v.top + (roi[1] / 1080) * v.height >= b.top &&
            v.top + (roi[3] / 1080) * v.height <= b.bottom
          );
        }),
        `Important ${id} content is cropped`,
      );
    }
    const first = page.locator("#demo-take");
    await page
      .locator('[data-demo="take"] .para-demo-frame')
      .scrollIntoViewIfNeeded();
    await page.locator('[data-demo="take"] button').focus();
    if (await first.evaluate((v) => v.paused))
      await page.keyboard.press("Space");
    await page.waitForFunction(
      () =>
        document.querySelector("#demo-take").currentTime > 0.3 &&
        !document.querySelector("#demo-take").paused,
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(250);
    assert(await first.evaluate((v) => v.paused));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page
      .locator('[data-demo="feedback"] .para-demo-frame')
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert(
      await page.locator("video").evaluateAll((v) => v.every((e) => e.paused)),
    );
    assert(
      await page
        .locator(
          ".para-feature,.para-feature-media,.para-feature-icon,.ed-motion-word,.ed-hero-art",
        )
        .evaluateAll((nodes) =>
          nodes.every((e) => getComputedStyle(e).transform === "none"),
        ),
      "GSAP transforms survived reduced motion",
    );
    await page.locator('[data-demo="feedback"] button').click();
    await page.waitForFunction(
      () => !document.querySelector("#demo-feedback").paused,
    );
    await page.locator('[data-demo="feedback"] button').click();
    assert(await page.locator("#demo-feedback").evaluate((v) => v.paused));
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `${engine.name()} ${width}: all three demos looped; keyboard pause/resume, exclusivity, offscreen pause and GSAP reduced-motion cleanup passed`,
    );
  }
  await browser.close();
}
