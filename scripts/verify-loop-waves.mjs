import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3004";
const out = ".qa/para-loop-waves/final";
await mkdir(out, { recursive: true });

function instrumentation() {
  window.__loopGPU = { draws: 0, time: 0, sun: [], deleted: 0, stamps: [] };
  window.__slow = false;
  let offset = 0;
  const raf = requestAnimationFrame;
  window.requestAnimationFrame = (callback) =>
    raf((now) => callback(now + (window.__slow ? (offset += 140) : 0)));
  if (!window.WebGL2RenderingContext) return;
  const proto = WebGL2RenderingContext.prototype;
  const names = new WeakMap();
  const get = proto.getUniformLocation;
  proto.getUniformLocation = function (program, name) {
    const result = get.call(this, program, name);
    if (result) names.set(result, name);
    return result;
  };
  const one = proto.uniform1f;
  proto.uniform1f = function (location, value) {
    if (names.get(location) === "uTime") window.__loopGPU.time = value;
    return one.call(this, location, value);
  };
  const three = proto.uniform3f;
  proto.uniform3f = function (location, ...value) {
    if (names.get(location) === "uSun") window.__loopGPU.sun = value;
    return three.call(this, location, ...value);
  };
  const draw = proto.drawArrays;
  proto.drawArrays = function (...args) {
    if (this.canvas.closest(".loop-atmosphere")) {
      window.__loopGPU.draws++;
      window.__loopGPU.stamps.push(performance.now());
    }
    return draw.apply(this, args);
  };
  const remove = proto.deleteProgram;
  proto.deleteProgram = function (...args) {
    window.__loopGPU.deleted++;
    return remove.apply(this, args);
  };
}

async function enter(page, fraction = 0.55) {
  await page.locator(".scene-loop").evaluate((el, fraction) => {
    const journey = el.closest(".hero-loop-journey");
    const root = journey || el;
    const intro = journey ? Number(journey.dataset.loopStart) : 0;
    scrollTo({
      top:
        root.getBoundingClientRect().top +
        scrollY +
        (root.clientHeight - innerHeight) * (intro + fraction * (1 - intro)),
      behavior: "instant",
    });
  }, fraction);
  await page.waitForTimeout(450);
}

for (const engine of [chromium, webkit]) {
  if (process.env.WAVES_ENGINE && process.env.WAVES_ENGINE !== engine.name())
    continue;
  const browser = await engine.launch();
  for (const width of [1440, 1024, 390])
    for (const locale of ["en", "vi"]) {
      if (process.env.WAVES_WIDTH && Number(process.env.WAVES_WIDTH) !== width)
        continue;
      if (process.env.WAVES_LOCALE && process.env.WAVES_LOCALE !== locale)
        continue;
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        hasTouch: width === 390,
        isMobile: width === 390,
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      await context.addInitScript(instrumentation);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + (locale === "vi" ? "/vi" : "/"), {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      const atmosphere = page.locator(".loop-atmosphere");
      await enter(page);
      await page.waitForFunction(() =>
        ["ready", "unavailable", "performance"].includes(
          document.querySelector(".loop-atmosphere").dataset.waveState,
        ),
      );
      const supported =
        (await atmosphere.getAttribute("data-wave-state")) === "ready";
      if (engine === chromium)
        assert(
          supported,
          "Chromium should render the actual shader, not only its fallback",
        );
      if (supported) {
        const size = await page
          .locator(".scene-loop canvas")
          .evaluate((el) => [el.width, el.height]);
        assert(size[0] <= 1100 && size[1] <= 700);
        if (width === 390)
          assert(size[0] <= 254, "Mobile render resolution not reduced");
        await page.waitForTimeout(600);
        const before = await page.evaluate(() => window.__loopGPU.draws);
        await page.waitForTimeout(700);
        const count = await page.evaluate(() => window.__loopGPU.draws);
        assert(
          count > before && count - before <= 24,
          "Renderer missing or frame cap exceeded",
        );
        const toggle = page.locator(".loop-wave-control");
        await toggle.click();
        await page.waitForTimeout(350);
        const held = await page.evaluate(() => ({ ...window.__loopGPU }));
        await page.waitForTimeout(350);
        assert.equal(
          await page.evaluate(() => window.__loopGPU.draws),
          held.draws,
          "Paused renderer kept drawing",
        );
        assert.equal(
          await page.evaluate(() => window.__loopGPU.time),
          held.time,
        );
        await toggle.click();
        await page.waitForTimeout(250);
        const sun = await page.evaluate(() => window.__loopGPU.sun);
        await page.mouse.move(width * 0.2, 520);
        await page.waitForTimeout(600);
        const changed = await page.evaluate(() => window.__loopGPU.sun);
        if (width === 390)
          assert.deepEqual(changed, sun, "Touch lighting should be disabled");
        else
          assert.notDeepEqual(changed, sun, "Pointer lighting did not respond");
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: true,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        const hidden = await page.evaluate(() => window.__loopGPU.draws);
        await page.waitForTimeout(350);
        assert.equal(
          await page.evaluate(() => window.__loopGPU.draws),
          hidden,
          "Hidden tab kept rendering",
        );
        await page.evaluate(() => {
          delete document.hidden;
          document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.waitForTimeout(200);
        await page.locator("#belief").scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        const offscreen = await page.evaluate(() => window.__loopGPU.draws);
        await page.waitForTimeout(350);
        assert.equal(
          await page.evaluate(() => window.__loopGPU.draws),
          offscreen,
          "Offscreen renderer kept drawing",
        );
      }
      let reserved;
      let previousTime = 0;
      for (const fraction of [0, 0.2, 0.55, 0.94, 0.55, 0.2, 0]) {
        await enter(page, fraction);
        const heading = page.locator(".loop-current-heading");
        const stage = Number(await heading.getAttribute("data-headline-stage"));
        assert.equal(await heading.locator("span").count(), 1);
        assert.equal(
          await page.locator(".scene-loop").getAttribute("data-stage"),
          String(Math.max(0, stage)),
        );
        const box = await page.locator(".loop-heading-slot").boundingBox();
        if (reserved) assert(Math.abs(box.height - reserved) < 1);
        reserved = box.height;
        assert(
          await heading.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        );
        assert((await page.locator(".scene-loop canvas").count()) <= 1);
        const time = await page.evaluate(() => window.__loopGPU.time);
        assert(time >= previousTime, "Scroll restarted wave time");
        previousTime = time;
        if ([0, 0.55, 0.94].includes(fraction))
          await page.screenshot({
            path: `${out}/${engine.name()}-${locale}-${width}-${fraction}.png`,
          });
      }
      assert.equal(
        await page.locator(".loop-material,.scene-loop .loop-step").count(),
        0,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        0,
      );
      await page.emulateMedia({ colorScheme: "dark" });
      await enter(page, 0.7);
      await page.waitForTimeout(450);
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-dark.png`,
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(200);
      assert.equal(await page.locator(".scene-loop canvas").count(), 0);
      assert.equal(await atmosphere.getAttribute("data-wave-state"), "static");
      assert(await page.locator(".loop-static-summary").isVisible());
      if (supported)
        assert(
          await page.evaluate(() => window.__loopGPU.deleted > 0),
          "GL resources not released",
        );
      assert.deepEqual(errors, []);
      console.log(
        engine.name(),
        locale,
        width,
        supported
          ? "shader, draw cap, pointer/touch, pause, visibility, sequence/reverse, cleanup and static presentation passed"
          : "WebGL unavailable: static fallback and complete sequence passed",
      );
      await context.close();
    }
  if (engine === chromium && !process.env.WAVES_QUICK) {
    for (const failure of ["blocked", "lost", "slow"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: "en", url: base },
      ]);
      await context.addInitScript(instrumentation);
      if (failure === "blocked")
        await context.addInitScript(() => {
          const get = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
            return kind === "webgl2" ? null : get.call(this, kind, ...args);
          };
        });
      const page = await context.newPage();
      await page.goto(base, { waitUntil: "networkidle" });
      await enter(page);
      if (failure !== "blocked") {
        await page.waitForFunction(
          () =>
            document.querySelector(".loop-atmosphere").dataset.waveState ===
            "ready",
        );
        if (failure === "lost")
          await page
            .locator(".scene-loop canvas")
            .evaluate((el) =>
              el
                .getContext("webgl2")
                .getExtension("WEBGL_lose_context")
                .loseContext(),
            );
        else await page.evaluate(() => (window.__slow = true));
      }
      const expected = failure === "slow" ? "performance" : "unavailable";
      await page.waitForFunction(
        (expected) =>
          document.querySelector(".loop-atmosphere").dataset.waveState ===
          expected,
        expected,
      );
      assert.equal(await page.locator(".scene-loop canvas").count(), 0);
      assert.equal(await page.locator(".loop-wave-control").count(), 0);
      assert(await page.locator(".loop-current-heading").isVisible());
      await page.screenshot({ path: `${out}/fallback-${failure}.png` });
      console.log(
        failure,
        "fallback passed (slow condition uses simulated frame gaps, not a hardware benchmark)",
      );
      await context.close();
    }
  }
  await browser.close();
}
