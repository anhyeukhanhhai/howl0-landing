import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3009";
const output = ".qa/shared-waves";
await mkdir(output, { recursive: true });
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const width of [1440, 390])
    for (const locale of ["en", "vi"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const url = base + (locale === "en" ? "/" : "/vi");
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("#perspectives").evaluate((el) =>
        scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 450,
          behavior: "instant",
        }),
      );
      await page.waitForTimeout(700);
      await page.evaluate(() => {
        window.sharedCanvas = document.querySelector("canvas");
      });
      assert.equal(await page.locator(".loop-atmosphere").count(), 1);
      assert((await page.locator("canvas").count()) <= 1);
      assert.equal(
        await page
          .locator(".shared-wave-control,.reel-control,.belief-cycle-control")
          .count(),
        0,
      );
      for (const mode of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme: mode });
        await page.waitForTimeout(100);
        for (const id of ["perspectives", "belief", "waitlist"]) {
          const y = await page
            .locator("#" + id)
            .evaluate((el) => el.getBoundingClientRect().top + scrollY - 450);
          for (const delta of [-60, -30, 0, 60, 0]) {
            await page.evaluate(
              (y) => scrollTo({ top: y, behavior: "instant" }),
              y + delta,
            );
            await page.waitForTimeout(40);
          }
          await page.screenshot({
            path: `${output}/${engine.name()}-${locale}-${width}-${mode}-${id}.png`,
          });
          assert.equal(
            await page
              .locator("#" + id)
              .evaluate((el) => getComputedStyle(el).backgroundColor),
            "rgba(0, 0, 0, 0)",
          );
          assert(
            await page.evaluate(
              () =>
                !window.sharedCanvas ||
                document.querySelector("canvas") === window.sharedCanvas ||
                !document.querySelector("canvas"),
            ),
            "Canvas replaced while scrolling/theme switching",
          );
        }
        await page.evaluate(() =>
          scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "instant",
          }),
        );
        await page.waitForTimeout(100);
        assert(
          Number(
            await page
              .locator("main")
              .evaluate((el) =>
                getComputedStyle(el).getPropertyValue("--wave-progress").trim(),
              ),
          ) > 0.999,
        );
        assert.equal(
          await page.locator(".final-action").getAttribute("href"),
          "https://paramuzic.com",
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        assert(
          await page.evaluate(
            () =>
              Math.abs(
                document.documentElement.scrollHeight -
                  (document.querySelector("#waitlist").getBoundingClientRect()
                    .bottom +
                    scrollY),
              ) < 1,
          ),
        );
        await page.screenshot({
          path: `${output}/${engine.name()}-${locale}-${width}-${mode}-end.png`,
        });
        const before = await page
          .locator("main")
          .evaluate((el) =>
            getComputedStyle(el).getPropertyValue("--wave-progress"),
          );
        await page.reload();
        await page.waitForTimeout(700);
        const after = await page
          .locator("main")
          .evaluate((el) =>
            getComputedStyle(el).getPropertyValue("--wave-progress"),
          );
        assert(
          Math.abs(Number(before) - Number(after)) < 0.03,
          "Reload brightness incorrect",
        );
        await page.goto(url + "#belief");
        await page.waitForTimeout(300);
        assert(
          Number(
            await page
              .locator("main")
              .evaluate((el) =>
                getComputedStyle(el).getPropertyValue("--wave-progress"),
              ),
          ) > 0,
        );
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(100);
      assert.equal(await page.locator("canvas").count(), 0);
      assert.equal(await page.locator(".shared-wave-control").count(), 0);
      assert(await page.locator(".loop-static-summary").isVisible());
      await page.screenshot({
        path: `${output}/${engine.name()}-${locale}-${width}-reduced.png`,
      });
      await page.setViewportSize({
        width: width === 390 ? 844 : 1024,
        height: width === 390 ? 390 : 768,
      });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      console.log(
        `${engine.name()} ${locale} ${width}: shared instance, transparent boundaries, theme, brightness, reverse, reload, anchors, reduced motion and page end passed`,
      );
      await context.close();
    }
  await browser.close();
}
