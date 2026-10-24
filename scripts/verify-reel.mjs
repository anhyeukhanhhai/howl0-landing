import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
const base = process.env.BASE_URL || "http://localhost:3010";
const out = ".qa/ultrawide-reel/final";
await mkdir(out, { recursive: true });

async function coverage(page) {
  return page.locator(".reel-viewport").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const spans = [...el.querySelectorAll(".reel-frame")]
      .map((n) => n.getBoundingClientRect())
      .filter((r) => r.right > rect.left && r.left < rect.right)
      .sort((a, b) => a.left - b.left);
    const gap = parseFloat(
      getComputedStyle(el.querySelector(".reel-sequence")).columnGap,
    );
    return {
      left: spans[0].left - rect.left,
      right: rect.right - spans.at(-1).right,
      gaps: spans.slice(1).map((r, i) => r.left - spans[i].right),
      gap,
    };
  });
}
function check(c) {
  assert(c.left <= c.gap + 1 && c.right <= c.gap + 1, JSON.stringify(c));
  assert(
    c.gaps.every((x) => x <= c.gap + 1),
    JSON.stringify(c),
  );
}

if (process.env.REAL_REEL_CYCLES) {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 3440, height: 1440 } });
  await c.addCookies([
    { name: "howl0-language-choice", value: "en", url: base },
  ]);
  const p = await c.newPage();
  await p.goto(base);
  await p.evaluate(() => document.fonts.ready);
  await p.locator(".reel-viewport").scrollIntoViewIfNeeded();
  await p.waitForFunction(
    () =>
      document.querySelector(".reel-track").getAnimations()[0]?.playState ===
      "running",
  );
  const duration = await p
    .locator(".reel-track")
    .evaluate((e) => e.getAnimations()[0].effect.getTiming().duration);
  console.log(
    `Watching two real cycles at 28px/s, ${Math.ceil((duration * 2) / 1000)} seconds`,
  );
  let start = null;
  let previous = null;
  let samples = 0;
  while (true) {
    const current = await p.locator(".reel-track").evaluate((e) => ({
      time: e.getAnimations()[0].currentTime,
      x: e.getBoundingClientRect().x,
    }));
    start ??= current.time;
    if (
      previous &&
      Math.floor(current.time / duration) ===
        Math.floor(previous.time / duration)
    )
      assert(current.x >= previous.x - 0.01, "Backwards motion");
    check(await coverage(p));
    samples++;
    if (current.time - start >= duration * 2) break;
    previous = current;
    await p.waitForTimeout(200);
  }
  console.log(
    `Two uninterrupted real cycles passed (${samples} coverage samples)`,
  );
  await p.screenshot({ path: `${out}/natural-two-cycles.png` });
  await b.close();
} else {
  for (const engine of [chromium, webkit]) {
    const b = await engine.launch();
    const sizes =
      engine === chromium
        ? [
            [1440, 900],
            [1920, 1080],
            [2560, 1080],
            [3440, 1440],
            [390, 844],
            [1440, 600],
            [844, 390],
          ]
        : [
            [3440, 1440],
            [390, 844],
          ];
    for (const [width, height] of sizes)
      for (const locale of ["en", "vi"])
        for (const theme of ["light", "dark"]) {
          const c = await b.newContext({
            viewport: { width, height },
            colorScheme: theme,
          });
          await c.addCookies([
            { name: "howl0-language-choice", value: locale, url: base },
          ]);
          const p = await c.newPage();
          const errors = [];
          p.on("pageerror", (e) => errors.push(e.message));
          await p.goto(base + (locale === "vi" ? "/vi" : ""));
          await p.evaluate(() => document.fonts.ready);
          await p.waitForTimeout(150);
          assert.equal(
            await p
              .locator("#belief .belief-photograph,#belief .belief-photo-scrim")
              .count(),
            0,
          );
          assert((await p.locator("canvas").count()) <= 1);
          const detailed = [3440, 390].includes(width);
          for (const id of detailed
            ? ["top", "submission-flow", "perspectives", "belief"]
            : ["top"]) {
            await p
              .locator("#" + id)
              .evaluate((e) => e.scrollIntoView({ behavior: "instant" }));
            await p.waitForTimeout(100);
            if (detailed)
              await p.screenshot({
                path: `${out}/${engine.name()}-${locale}-${width}-${theme}-${id}.png`,
              });
          }
          await p.locator(".reel-viewport").scrollIntoViewIfNeeded();
          await p.waitForTimeout(200);
          assert.equal(
            await p
              .locator(
                ".shared-wave-control,.reel-control,.belief-cycle-control",
              )
              .count(),
            0,
          );
          await p
            .locator(".reel-track")
            .evaluate((e) => e.getAnimations()[0].pause());
          const layout = await p.evaluate(() => {
            const r = (s) => document.querySelector(s).getBoundingClientRect();
            return {
              a: r(".final-available").bottom,
              v: r(".reel-viewport").top,
              b: r(".reel-viewport").bottom,
              n: r(".final-next-step").top,
            };
          });
          assert(
            layout.a < layout.v && layout.b < layout.n,
            JSON.stringify(layout),
          );
          const info = await p.locator(".reel-track").evaluate((e) => ({
            duration: e.getAnimations()[0].effect.getTiming().duration,
            length: e.querySelector(".reel-sequence").getBoundingClientRect()
              .width,
          }));
          assert(Math.abs(info.length / (info.duration / 1000) - 28) < 0.001);
          for (const phase of [
            0, 0.1, 0.2, 0.999999, 1.000001, 1.6, 1.999999, 2.000001,
          ]) {
            await p.locator(".reel-track").evaluate((e, t) => {
              e.getAnimations()[0].pause();
              e.getAnimations()[0].currentTime = t;
            }, phase * info.duration);
            check(await coverage(p));
          }
          // Isolate the seam from ambient WebGL lighting and deferred image
          // decoding; neither is owned by the marquee animation.
          await p.locator(".reel-track img").evaluateAll((imgs) =>
            Promise.all(
              imgs.map((img) => {
                img.loading = "eager";
                return img.decode().catch(() => {});
              }),
            ),
          );
          const seamStyle = await p.addStyleTag({
            content:
              ".shared-wave-layer .loop-waves-effect { visibility: hidden !important; }",
          });
          // Exactly the same repeated imagery on both sides of the native wrap.
          await p.locator(".reel-track").evaluate((e, t) => {
            e.getAnimations()[0].pause();
            e.getAnimations()[0].currentTime = t;
          }, info.duration * 0.999999);
          const before = await p.locator(".reel-viewport").screenshot();
          await p.locator(".reel-track").evaluate((e, t) => {
            e.getAnimations()[0].pause();
            e.getAnimations()[0].currentTime = t;
          }, info.duration * 1.000001);
          const after = await p.locator(".reel-viewport").screenshot();
          const aa = await sharp(before).removeAlpha().raw().toBuffer();
          const bb = await sharp(after).removeAlpha().raw().toBuffer();
          let delta = 0;
          for (let i = 0; i < aa.length; i++) delta += Math.abs(aa[i] - bb[i]);
          assert(
            delta / aa.length < 2,
            `Visible seam: pixel difference ${delta / aa.length}`,
          );
          await seamStyle.evaluate((e) => e.remove());
          assert.equal(
            await p.locator('.reel-track > .reel-sequence img[alt=""]').count(),
            0,
          );
          assert.equal(
            await p.locator('.reel-copies img:not([alt=""])').count(),
            0,
          );
          await p.screenshot({
            path: `${out}/${engine.name()}-${locale}-${width}-${theme}-reel.png`,
          });
          const oldPhase = await p.locator(".reel-track").evaluate((e) => {
            const a = e.getAnimations()[0];
            return (
              (a.currentTime % a.effect.getTiming().duration) /
              a.effect.getTiming().duration
            );
          });
          await p.setViewportSize({
            width: width === 3440 ? 1920 : 3440,
            height,
          });
          await p.waitForTimeout(100);
          check(await coverage(p));
          const newPhase = await p.locator(".reel-track").evaluate((e) => {
            const a = e.getAnimations()[0];
            return (
              (a.currentTime % a.effect.getTiming().duration) /
              a.effect.getTiming().duration
            );
          });
          assert(Math.abs(oldPhase - newPhase) < 0.01, "Resize lost phase");
          await p.setViewportSize({ width, height });
          await p.waitForTimeout(100);
          await p.evaluate(() =>
            scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "instant",
            }),
          );
          assert(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          assert(
            await p.evaluate(
              () =>
                Math.abs(
                  document.documentElement.scrollHeight -
                    (document.querySelector("#waitlist").getBoundingClientRect()
                      .bottom +
                      scrollY),
                ) < 1,
            ),
          );
          assert.equal(
            await p.locator(".final-action").getAttribute("href"),
            "https://paramuzic.com",
          );
          await p.screenshot({
            path: `${out}/${engine.name()}-${locale}-${width}-${theme}-end.png`,
          });
          await p.locator(".final-action").focus();
          assert(
            await p
              .locator(".final-action")
              .evaluate((e) => e === document.activeElement),
          );
          await p
            .locator("#top")
            .evaluate((e) => e.scrollIntoView({ behavior: "instant" }));
          await p.waitForTimeout(100);
          assert.equal(
            await p
              .locator(".reel-track")
              .evaluate((e) => e.getAnimations()[0].playState),
            "paused",
          );
          await p.emulateMedia({ reducedMotion: "reduce" });
          await p.waitForFunction(
            () =>
              document.querySelector(".reel-track").getAnimations().length ===
              0,
          );
          assert.equal(
            await p
              .locator(".reel-track")
              .evaluate((e) => e.getAnimations().length),
            0,
          );
          await p.locator(".reel-viewport").scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `${out}/${engine.name()}-${locale}-${width}-${theme}-static.png`,
          });
          assert.deepEqual(errors, []);
          console.log(
            `${engine.name()} ${locale} ${width}x${height} ${theme}: composition, reel coverage, 2 wrap boundaries, phase, keyboard, reduced motion and page end passed`,
          );
          await c.close();
        }
    await b.close();
  }
}
