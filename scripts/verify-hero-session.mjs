import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://localhost:3011";
const out = ".qa/hero-session/final";
await mkdir(out, { recursive: true });
for (const tone of ["light", "dark"])
  assert.deepEqual(
    await readFile(
      `public/brand/para/resources/para-symbol-${tone}-grain-optical.svg`,
    ),
    await readFile(
      `design-resources/PARA_Brand_Resources/01_LOGO/Grain_Gradient/Web/para-symbol-${tone}-grain-optical.svg`,
    ),
  );
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const width of engine === chromium
    ? [390, 768, 1440, 1920, 2560]
    : [390, 1440])
    for (const locale of ["en", "vi"])
      for (const theme of ["light", "dark"]) {
        const height =
          width === 390
            ? 844
            : width === 768
              ? 1024
              : width >= 1920
                ? 1080
                : 900;
        const context = await browser.newContext({
          viewport: { width, height },
          colorScheme: theme,
        });
        await context.addCookies([
          { name: "howl0-language-choice", value: locale, url: base },
        ]);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base + (locale === "vi" ? "/vi" : ""));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(350);
        const hero = await page.evaluate(() => {
          const h = document.querySelector("h1").getBoundingClientRect(),
            s = document
              .querySelector(".hero-brand-symbol")
              .getBoundingClientRect(),
            a = document.querySelector(".hero-actions").getBoundingClientRect();
          return {
            heading: h.toJSON(),
            symbol: s.toJSON(),
            actions: a.toJSON(),
            lines: [
              ...document.querySelectorAll("h1 .headline-mask > span"),
            ].map((n) => {
              const r = document.createRange();
              r.selectNodeContents(n);
              return [...r.getClientRects()].filter((r) => r.width > 0).length;
            }),
          };
        });
        assert(
          hero.lines.every((n) => n === 1),
          `Heading lost intended line breaks: ${JSON.stringify(hero)}`,
        );
        assert(
          Math.abs(hero.symbol.width / hero.symbol.height - 290 / 300) < 0.01,
        );
        if (width > 700) {
          assert(
            Math.abs(
              hero.heading.y +
                hero.heading.height / 2 -
                (hero.symbol.y + hero.symbol.height / 2),
            ) < 2,
          );
          assert(
            hero.symbol.height / hero.heading.height >= 0.75 &&
              hero.symbol.height / hero.heading.height <= 0.9,
          );
          assert(hero.heading.right < hero.symbol.left);
        } else assert(hero.actions.bottom < hero.symbol.top);
        assert(
          hero.symbol.bottom <= height + 1,
          "Hero symbol clipped by viewport",
        );
        assert.equal(await page.locator(".hero-brand-symbol img").count(), 1);
        assert(
          (
            await page
              .locator(".hero-brand-symbol img")
              .evaluate((e) => e.currentSrc)
          ).includes(`symbol-${theme === "dark" ? "dark" : "light"}-grain`),
        );
        await page.waitForTimeout(650);
        await page.screenshot({
          path: `${out}/${engine.name()}-${locale}-${width}-${theme}-hero.png`,
        });
        // Both elements must depart as one scene through the existing parent.
        await page.locator(".hero-loop-journey").evaluate((e) =>
          scrollTo({
            top:
              e.getBoundingClientRect().top +
              scrollY +
              (e.clientHeight - innerHeight) * 0.12,
            behavior: "instant",
          }),
        );
        await page.waitForTimeout(300);
        assert(
          await page
            .locator(".simple-hero")
            .evaluate((e) => Number(getComputedStyle(e).opacity) < 1),
        );
        assert(
          await page
            .locator(".hero-brand-symbol")
            .evaluate(
              (e) =>
                e.closest(".simple-hero") ===
                document.querySelector("h1").closest(".simple-hero"),
            ),
        );
        await page
          .locator("#perspectives")
          .evaluate((e) => e.scrollIntoView({ behavior: "instant" }));
        await page.waitForTimeout(300);
        const section = page.locator("#perspectives"),
          visual = section.locator(".practice-session"),
          wave = await section.locator(".session-wave").getAttribute("d");
        assert.equal(await section.locator(".perspective-handoff").count(), 0);
        assert.deepEqual(
          await visual.evaluate((e) => {
            const s = getComputedStyle(e);
            return [
              s.backgroundColor,
              s.backdropFilter,
              s.boxShadow,
              s.borderTopWidth,
            ];
          }),
          ["rgba(0, 0, 0, 0)", "none", "none", "0px"],
        );
        assert.equal(
          await section
            .locator(
              ".perspective-emblems,.perspective-reading,.perspective-workspace",
            )
            .count(),
          0,
        );
        assert.equal(
          await visual.locator("button,a,audio,video").count(),
          0,
          "Illustration implies a working player",
        );
        const baseline = await section.boundingBox(),
          frame = await visual.boundingBox();
        const tabs = section.getByRole("tab");
        for (let role = 0; role < 3; role++) {
          await tabs.nth(role).click();
          await page.waitForTimeout(400);
          assert.equal(
            await tabs.nth(role).getAttribute("aria-selected"),
            "true",
          );
          assert.notEqual(
            await tabs
              .nth(role)
              .evaluate((e) => getComputedStyle(e).backgroundColor),
            await tabs
              .nth((role + 1) % 3)
              .evaluate((e) => getComputedStyle(e).backgroundColor),
            "Selected tab has no distinct fill",
          );
          assert.equal(
            await visual.getAttribute("data-perspective"),
            String(role),
          );
          assert.equal(
            await section.locator(".session-wave").getAttribute("d"),
            wave,
          );
          assert.equal(
            await section
              .locator('[role="tabpanel"]:not([aria-hidden="true"])')
              .count(),
            1,
          );
          assert.equal(
            await visual
              .locator('.session-annotation-panel:not([aria-hidden="true"])')
              .count(),
            1,
          );
          const changed = await section.boundingBox(),
            changedFrame = await visual.boundingBox();
          assert(
            Math.abs(baseline.height - changed.height) < 1,
            "Section jumps on role change",
          );
          assert(
            Math.abs(frame.height - changedFrame.height) < 1,
            "Session frame jumps on role change",
          );
          if ([390, 1440, 2560].includes(width))
            await section.screenshot({
              path: `${out}/${engine.name()}-${locale}-${width}-${theme}-role-${role}.png`,
            });
        }
        await tabs.nth(2).focus();
        await page.keyboard.press("Home");
        assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
        assert.equal(
          await tabs.nth(0).evaluate((e) => getComputedStyle(e).outlineStyle),
          "solid",
        );
        await page.keyboard.press("ArrowRight");
        assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
        await page.keyboard.press("End");
        assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
        await page.waitForTimeout(400);
        assert(
          (await section.getByRole("tabpanel").innerText()).includes(
            locale === "en" ? "In exploration." : "Đang tìm hiểu",
          ),
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        assert(
          !/[\p{Dash_Punctuation}\u2212]/u.test(
            await page.locator("body").innerText(),
          ),
          "Visible dash punctuation",
        );
        const axe = await new AxeBuilder({ page })
          .include("#perspectives")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.deepEqual(
          axe.violations.map((v) => v.id),
          [],
        );
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForTimeout(100);
        assert.equal(
          await page
            .locator(".para-word-portal")
            .evaluate((e) => getComputedStyle(e).display),
          "none",
        );
        await tabs.nth(0).click();
        assert.equal(await visual.getAttribute("data-perspective"), "0");
        assert.equal(
          await page.locator(".final-action").getAttribute("href"),
          "https://paramuzic.com",
        );
        assert.equal(
          await page.locator(".reel-track > .reel-sequence img").count(),
          3,
        );
        assert.equal(
          await page
            .getByRole("button", {
              name: /pause|resume|tạm dừng|tiếp tục chuyển động/i,
            })
            .count(),
          0,
        );
        assert.deepEqual(errors, []);
        console.log(
          `${engine.name()} ${locale} ${width} ${theme}: symbol, wrapping, shared exit, stable session, keyboard, illustration, reduced motion and accessibility passed`,
        );
        await context.close();
      }
  await browser.close();
}
