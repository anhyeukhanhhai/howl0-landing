import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";

const base = process.env.BASE_URL || "http://localhost:3006";
const destination = "https://paramuzic.com";
const out = ".qa/para-product-cta/final";
await mkdir(out, { recursive: true });
const luminance = (rgb) =>
  rgb
    .map((n) => n / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
    .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);

async function contrast(link) {
  const ink = await link.locator(".product-cta-label").evaluate((el) =>
    getComputedStyle(el)
      .color.match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number),
  );
  await link.evaluate((el) => {
    for (const child of el.querySelectorAll(".product-cta-label,.para-icon"))
      child.style.visibility = "hidden";
  });
  const png = await link.screenshot();
  await link.evaluate((el) => {
    for (const child of el.querySelectorAll(".product-cta-label,.para-icon"))
      child.style.removeProperty("visibility");
  });
  const { data, info } = await sharp(png)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const text = luminance(ink);
  let minimum = Infinity;
  for (let y = 8; y < info.height - 8; y++)
    for (let x = 12; x < info.width - 12; x++) {
      const i = (y * info.width + x) * info.channels;
      const background = luminance([data[i], data[i + 1], data[i + 2]]);
      minimum = Math.min(
        minimum,
        (Math.max(text, background) + 0.05) /
          (Math.min(text, background) + 0.05),
      );
    }
  assert(
    minimum >= 4.5,
    `Actual gradient/grain contrast ${minimum.toFixed(2)} below 4.5`,
  );
  return minimum;
}

for (const engine of [chromium, webkit]) {
  if (process.env.CTA_ENGINE && engine.name() !== process.env.CTA_ENGINE)
    continue;
  const browser = await engine.launch();
  for (const width of [1440, 1101, 1024, 390])
    for (const locale of ["en", "vi"]) {
      if (process.env.CTA_WIDTH && Number(process.env.CTA_WIDTH) !== width)
        continue;
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        hasTouch: width === 390,
        isMobile: width === 390,
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: locale, url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const prefix = locale === "en" ? "" : "/vi";
      const label = locale === "en" ? "Try for free" : "Dùng thử miễn phí";
      const routes =
        engine === chromium
          ? [
              "",
              "/product",
              "/how-it-works",
              "/why-howl0",
              "/for-you",
              "/people",
              "/faq",
            ]
          : ["", "/product"];
      for (const route of routes) {
        await page.goto(base + prefix + (route || (prefix ? "" : "/")), {
          waitUntil: "networkidle",
        });
        const links = page.locator(".product-cta");
        assert((await links.count()) >= 2);
        for (const link of await links.all()) {
          assert.equal(await link.getAttribute("href"), destination);
          assert([null, "_self"].includes(await link.getAttribute("target")));
          assert.equal((await link.innerText()).trim(), label);
          assert(
            await link
              .locator(".product-cta-label")
              .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
          );
        }
        assert.equal(
          await page.locator("form.waitlist-form,#waitlist input").count(),
          0,
        );
        assert.equal(
          await page.locator('a[href*="#waitlist"]').count(),
          0,
          "Obsolete conversion destination",
        );
        const visible = await page.locator("body").innerText();
        assert(
          !/waitlist|submissions are not saved|in development|đang phát triển|hệ thống đăng ký/i.test(
            visible,
          ),
        );
        assert(
          !/[\p{Dash_Punctuation}]/u.test(
            visible.replace(/https?:\/\/\S+|\b[\w.+-]+@[\w.-]+/g, ""),
          ),
          "Visible dash punctuation",
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
          0,
        );
      }

      await page.goto(base + prefix + (prefix ? "" : "/"), {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(700);
      const hero = page.locator(".hero-actions .product-cta");
      const initial = await hero.boundingBox();
      assert(initial.height >= 44);
      let minimum = await contrast(hero);
      if (width !== 390) {
        await hero.hover();
        await page.waitForTimeout(240);
        assert.deepEqual(
          await hero.boundingBox(),
          initial,
          "Hover moved click target",
        );
        assert.notEqual(
          await hero
            .locator(".product-cta-material")
            .evaluate((el) => getComputedStyle(el).transform),
          "none",
        );
        minimum = Math.min(minimum, await contrast(hero));
        await page.mouse.down();
        await page.waitForTimeout(200);
        assert.deepEqual(
          await hero.boundingBox(),
          initial,
          "Press moved click target",
        );
        minimum = Math.min(minimum, await contrast(hero));
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
      await hero.focus();
      // Safari host preferences can skip links when tabbing. Keyboard-origin
      // focus still must expose the native focus-visible treatment.
      await page.keyboard.press("ArrowDown");
      await hero.focus();
      assert.equal(
        await hero.evaluate((el) => getComputedStyle(el).outlineStyle),
        "solid",
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-hero-focus.png`,
      });
      await hero.evaluate((el) => el.blur());
      await page.goto(base + prefix + (prefix ? "" : "/") + "#waitlist", {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(1200);
      const closing = page.locator(".final-scene");
      await closing.scrollIntoViewIfNeeded();
      assert.equal(
        (await closing.locator("h2").innerText()).replace(/\s+/g, " ").trim(),
        locale === "en" ? "PARA is available now" : "PARA đã sẵn sàng",
      );
      assert.equal(
        (await closing.locator("p").innerText()).replace(/\s+/g, " ").trim(),
        locale === "en"
          ? "Your next step starts here"
          : "Bắt đầu bước tiếp theo cùng PARA",
      );
      minimum = Math.min(
        minimum,
        await contrast(closing.locator(".product-cta")),
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-closing.png`,
      });
      let axe = await new AxeBuilder({ page })
        .include(".final-scene")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        axe.violations.map((v) => v.id),
        [],
      );

      // QA fixture only: check both materials on the existing dark photograph.
      const markup = await closing
        .locator(".product-cta")
        .evaluate((el) => el.outerHTML);
      await page.locator("#belief").evaluate((section, markup) => {
        const host = document.createElement("div");
        host.id = "qa-photo-product-cta";
        host.style.cssText = "position:absolute;z-index:4;top:180px;right:24px";
        host.innerHTML = markup;
        section.append(host);
      }, markup);
      const photoAction = page.locator("#qa-photo-product-cta .product-cta");
      await photoAction.scrollIntoViewIfNeeded();
      minimum = Math.min(minimum, await contrast(photoAction));
      await photoAction.evaluate((el) => {
        el.dataset.tone = "ivory";
      });
      minimum = Math.min(minimum, await contrast(photoAction));
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-photo-material-test.png`,
      });
      await page.locator("#qa-photo-product-cta").evaluate((el) => el.remove());

      await page.goto(base + prefix + "/product", { waitUntil: "networkidle" });
      await page.locator(".page-cta").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-secondary.png`,
      });
      minimum = Math.min(
        minimum,
        await contrast(page.locator(".page-cta .product-cta")),
      );
      await page.emulateMedia({ colorScheme: "dark" });
      await page.waitForTimeout(300);
      minimum = Math.min(
        minimum,
        await contrast(page.locator(".page-cta .product-cta")),
      );
      await page.screenshot({
        path: `${out}/${engine.name()}-${locale}-${width}-dark.png`,
      });
      axe = await new AxeBuilder({ page })
        .include(".page-cta")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        axe.violations.map((v) => v.id),
        [],
      );

      if (width <= 1100) {
        await page
          .getByRole("button", {
            name: locale === "en" ? "Menu" : "Trình đơn",
            exact: true,
          })
          .click();
        const nav = page.locator(".nav-cta.product-cta");
        assert(await nav.isVisible());
        assert((await nav.boundingBox()).height >= 44);
        minimum = Math.min(minimum, await contrast(nav));
        await page.screenshot({
          path: `${out}/${engine.name()}-${locale}-${width}-menu.png`,
        });
        await page.keyboard.press("Escape");
      } else {
        minimum = Math.min(
          minimum,
          await contrast(page.locator(".nav-cta.product-cta")),
        );
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      const action = page.locator(".page-cta .product-cta");
      await action.hover();
      assert.equal(
        await action
          .locator(".product-cta-material")
          .evaluate((el) => getComputedStyle(el).transform),
        "none",
      );
      assert.equal(
        await action
          .locator(".product-cta-label")
          .evaluate((el) => getComputedStyle(el).filter),
        "none",
      );
      // Exercise the supplied explicit solid fallback without claiming OS emulation.
      await page.evaluate(() => {
        document.documentElement.dataset.paraGlass = "solid";
      });
      assert.equal(
        await action
          .locator(".product-cta-glass")
          .evaluate((el) => getComputedStyle(el).backdropFilter),
        "none",
      );
      minimum = Math.min(minimum, await contrast(action));

      // Intercept only the destination in this test, so no product action or account
      // creation is performed. Enter must navigate this frame, not open a tab.
      await page.route(destination + "/", (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "Product destination",
        }),
      );
      await action.focus();
      await action.press("Enter");
      await page.waitForURL(destination + "/");
      assert.equal(context.pages().length, 1);
      assert.deepEqual(errors, []);
      console.log(
        engine.name(),
        locale,
        width,
        `routes, live CTA links, static targets, states, same tab, no form/dashes, accessibility, preferences and pixel contrast ≥ ${minimum.toFixed(2)} passed`,
      );
      await context.close();
    }
  await browser.close();
}
