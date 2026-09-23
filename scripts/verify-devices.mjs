import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit, devices } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = ".qa/devices";
await mkdir(out, { recursive: true });
const routes = [
  "",
  "/product",
  "/how-it-works",
  "/for-you",
  "/people",
  "/faq",
  "/why-howl0",
];
const scenarios = [
  { name: "small-phone", viewport: { width: 320, height: 568 } },
  { name: "android", ...devices["Pixel 7"] },
  {
    name: "phone-landscape",
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  },
  { name: "tablet", viewport: { width: 768, height: 1024 }, hasTouch: true },
  { name: "short-laptop", viewport: { width: 1280, height: 720 } },
  { name: "laptop", viewport: { width: 1366, height: 768 } },
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "ultrawide", viewport: { width: 3440, height: 1440 } },
];

async function checkLogo(page, selector, suffix) {
  await page.waitForFunction(
    ({ selector, suffix }) => {
      const img = document.querySelector(selector);
      return img?.complete && img.currentSrc.endsWith(suffix);
    },
    { selector, suffix },
  );
}

async function checkLayout(page, label) {
  const issues = await page.evaluate(() => {
    const problems = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      problems.push("horizontal overflow");
    for (const el of document.querySelectorAll("h1,h2,h3,p,button")) {
      if (el.closest('[aria-hidden="true"]')) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width) continue;
      if (
        rect.left < -2 ||
        rect.right > innerWidth + 2 ||
        el.scrollWidth > el.clientWidth + 2
      ) {
        problems.push(`clipped ${el.tagName}: ${el.textContent.slice(0, 35)}`);
      }
    }
    const sticky = document.querySelector(".practice-sticky");
    if (sticky && getComputedStyle(sticky).position === "sticky") {
      const top = parseFloat(getComputedStyle(sticky).top);
      if (sticky.scrollHeight > innerHeight - top + 2)
        problems.push("pinned learning loop taller than viewport");
    }
    return problems;
  });
  assert.deepEqual(issues, [], `${label}: ${issues.join(", ")}`);
}

async function run(engine, settings) {
  const browser = await engine.launch();
  try {
    for (const { name, ...device } of settings) {
      delete device.defaultBrowserType;
      const context = await browser.newContext({
        ...device,
        colorScheme: "dark",
      });
      await context.addCookies([
        { name: "howl0-language-choice", value: "en", url: base },
      ]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const locale of ["en", "vi"]) {
        for (const route of routes) {
          const path = (locale === "vi" ? "/vi" : "") + route || "/";
          const response = await page.goto(`${base}${path}`, {
            waitUntil: "networkidle",
          });
          assert(response?.ok(), `${path}: route failed`);
          await page.evaluate(() => document.fonts.ready);
          await checkLayout(page, `${engine.name()} ${name} ${path}`);
          const bodyColor = await page
            .locator("body")
            .evaluate((el) => getComputedStyle(el).backgroundColor);
          assert.equal(
            bodyColor,
            "rgb(42, 27, 34)",
            `${path}: dark mode did not follow device`,
          );
          await checkLogo(page, ".brand img", "howl0-logo-dark.svg");
          if (
            ["", "/people", "/how-it-works"].includes(route) &&
            ["android", "iphone", "desktop", "ultrawide"].includes(name)
          ) {
            await page.screenshot({
              path: `${out}/${engine.name()}-${name}-${locale}-${route.slice(1) || "home"}-dark.png`,
              fullPage: true,
              animations: "disabled",
            });
          }
        }
      }
      await page.goto(`${base}/vi/people`, { waitUntil: "networkidle" });
      await page.emulateMedia({ colorScheme: "light" });
      assert.equal(
        await page
          .locator("body")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgb(255, 247, 242)",
        "live switch back to light failed",
      );
      await checkLogo(page, ".brand img", "howl0-logo-master.svg");
      await checkLayout(page, `${engine.name()} ${name} light`);
      const menu = page.locator(".menu-toggle");
      if (await menu.isVisible()) {
        await menu.click();
        const menuBounds = await page.locator(".nav-links").evaluate((el) => ({
          bottom: el.getBoundingClientRect().bottom,
          height: innerHeight,
        }));
        assert(
          menuBounds.bottom <= menuBounds.height + 1,
          `${name}: menu extends below screen`,
        );
        const last = page.locator(".nav-links .nav-cta");
        await last.focus();
        const visible = await last.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= innerHeight + 1;
        });
        assert(visible, `${name}: last menu link cannot be reached`);
        await last.press("Escape");
        assert.equal(await menu.getAttribute("aria-expanded"), "false");
      }
      await page.goto(`${base}/welcome`, { waitUntil: "networkidle" });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.evaluate(() => document.fonts.ready);
      await checkLayout(page, `${name} welcome`);
      await checkLogo(page, ".welcome-logo", "howl0-logo-dark.svg");
      if (["android", "iphone", "desktop", "ultrawide"].includes(name)) {
        await page.screenshot({
          path: `${out}/${engine.name()}-${name}-welcome-dark.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
      assert.deepEqual(errors, [], `${name}: browser errors`);
      await context.close();
      console.log(
        `${engine.name()} ${name}: dark routes, live theme change, layout and menu passed`,
      );
    }
    // The device theme must work before JavaScript or hydration is available.
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: "dark",
    });
    const page = await noJs.newPage();
    await page.goto(`${base}/people`);
    assert.equal(
      await page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(42, 27, 34)",
    );
    await noJs.close();
  } finally {
    await browser.close();
  }
}

await run(chromium, scenarios);
await run(webkit, [
  { name: "iphone", ...devices["iPhone 13"] },
  { name: "iphone-landscape", ...devices["iPhone 13 landscape"] },
  { name: "macbook", viewport: { width: 1440, height: 900 } },
]);
