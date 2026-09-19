import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = ".qa/ia-final";
const routes = [
  ["home", "/", "Music learning doesn’t stop when the lesson ends."],
  [
    "product",
    "/product",
    "A learning platform designed around how music actually happens.",
  ],
  [
    "how-it-works",
    "/how-it-works",
    "A simple start for the learning between lessons.",
  ],
  [
    "why-howl0",
    "/why-howl0",
    "Music learning gets fragmented between lessons.",
  ],
  [
    "for-educators",
    "/for-educators",
    "Spend less time finding homework and more time guiding improvement.",
  ],
  ["faq", "/faq", "A little more clarity."],
];
const viewports = [
  [390, 844],
  [430, 932],
  [768, 1024],
  [1440, 900],
  [1920, 1080],
  [2560, 1080],
  [3440, 1440],
];
const browser = await chromium.launch({ headless: true });
await mkdir(out, { recursive: true });
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
async function revealPage(page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const viewport = page.viewportSize().height;
  for (let y = 0; y < height; y += viewport * 0.72) {
    await page.evaluate(
      (value) => scrollTo({ top: value, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(35);
  }
}
async function inspectLayout(page, label) {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    mains: document.querySelectorAll("main").length,
    h1s: document.querySelectorAll("h1").length,
    footer: Boolean(document.querySelector("footer")),
    nav: Boolean(document.querySelector('nav[aria-label="Main navigation"]')),
  }));
  assert(
    result.overflow <= 1,
    `${label}: horizontal overflow ${result.overflow}`,
  );
  assert(
    result.mains === 1 && result.h1s === 1,
    `${label}: landmark or h1 structure is invalid`,
  );
  assert(
    result.nav && result.footer,
    `${label}: shared navigation or footer missing`,
  );
}

for (const [width, height] of viewports) {
  const size = `${width}x${height}`;
  for (const [name, route, heading] of routes) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "networkidle",
    });
    assert(
      response?.ok(),
      `${size} ${route}: direct route did not return success`,
    );
    assert(
      await page.getByRole("heading", { level: 1, name: heading }).isVisible(),
      `${size} ${route}: h1 missing`,
    );
    await inspectLayout(page, `${size} ${route}`);
    assert(
      !errors.length,
      `${size} ${route}: application errors ${errors.join("; ")}`,
    );
    if (route === "/") {
      const home = await page.evaluate(() => ({
        sections: document.querySelectorAll("main > section").length,
        screens: document.documentElement.scrollHeight / innerHeight,
        flow: document.querySelectorAll("#submission-flow").length,
        belief: document.querySelectorAll("#belief").length,
        product: document.querySelectorAll(".platform-reveal").length,
        faq: document.querySelectorAll(".faq-list").length,
        preview: Boolean(document.querySelector(".hero-preview")),
      }));
      assert(
        home.sections === 5 && home.screens < 8.5,
        `${size}: homepage is not concise ${JSON.stringify(home)}`,
      );
      assert(
        home.flow === 1 &&
          home.belief === 1 &&
          home.product === 1 &&
          home.faq === 0 &&
          home.preview,
        `${size}: homepage narrative is incomplete`,
      );
      assert(
        (await page
          .getByRole("link", { name: "See the submission flow" })
          .getAttribute("href")) === "#submission-flow",
        `${size}: hero flow CTA is not an in-page destination`,
      );
      const boxes = await page.evaluate(() => {
        const a = document.querySelector(".hero h1").getBoundingClientRect();
        const b = document
          .querySelector(".hero-visual")
          .getBoundingClientRect();
        return {
          separated:
            a.right <= b.left + 1 ||
            b.right <= a.left + 1 ||
            a.bottom <= b.top + 1 ||
            b.bottom <= a.top + 1,
          previewBottom: b.bottom,
        };
      });
      assert(boxes.separated, `${size}: hero copy intersects its visual`);
      if (width <= 430)
        assert(
          boxes.previewBottom <= height + 3,
          `${size}: Practice Loop preview misses first viewport`,
        );
      await revealPage(page);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: `${out}/home-${size}.png`,
        fullPage: true,
      });
    } else if (width === 390 || width === 1440) {
      await revealPage(page);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: `${out}/${name}-${size}.png`,
        fullPage: true,
      });
    }
    await page.close();
  }
  console.log(size, "all routes passed");
}

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await desktop.goto(base, { waitUntil: "networkidle" });
for (const [label, route, heading] of routes.slice(1)) {
  await desktop
    .getByRole("link", {
      name:
        label === "why-howl0"
          ? "Why howl0"
          : label === "for-educators"
            ? "For educators"
            : label === "how-it-works"
              ? "How it works"
              : label === "faq"
                ? "FAQ"
                : "Product",
      exact: true,
    })
    .first()
    .click();
  await desktop.waitForURL(`${base}${route}`);
  assert(
    await desktop.getByRole("heading", { level: 1, name: heading }).isVisible(),
    `${route}: client navigation failed`,
  );
  assert(
    (await desktop
      .locator(`.nav-links a[href="${route}"][aria-current="page"]`)
      .count()) === 1,
    `${route}: current page is not identified`,
  );
  await desktop.goBack({ waitUntil: "networkidle" });
  await desktop.waitForURL(base + "/");
  assert(
    new URL(desktop.url()).pathname === "/",
    `${route}: browser Back failed`,
  );
  await desktop.goForward({ waitUntil: "networkidle" });
  await desktop.waitForURL(`${base}${route}`);
  assert(
    new URL(desktop.url()).pathname === route,
    `${route}: browser Forward failed`,
  );
  await desktop.goto(base, { waitUntil: "networkidle" });
}

for (const [legacyRoute, target] of [
  ["/about", "/product"],
  ["/who-its-for", "/for-educators"],
  ["/why-howlo", "/why-howl0"],
]) {
  await desktop.goto(`${base}${legacyRoute}`, { waitUntil: "networkidle" });
  assert(
    new URL(desktop.url()).pathname === target,
    `${legacyRoute}: legacy route did not redirect to ${target}`,
  );
}

await desktop.goto(`${base}/for-educators`, { waitUntil: "networkidle" });
const teacher = desktop.getByRole("tab", { name: /Teacher/i });
await teacher.focus();
await teacher.press("ArrowRight");
assert(
  (await desktop
    .getByRole("tab", { name: /Student/i })
    .getAttribute("aria-selected")) === "true",
  "Audience keyboard navigation failed",
);
assert(
  await desktop.getByText("No complex sign-in", { exact: true }).isVisible(),
  "Student benefits missing",
);
await desktop.getByRole("tab", { name: /Parent/i }).click();
assert(
  await desktop.getByText("Student-led practice", { exact: true }).isVisible(),
  "Audience pointer interaction failed",
);

await desktop.goto(`${base}/faq`, { waitUntil: "networkidle" });
await desktop.getByText("What is howl0?", { exact: true }).click();
assert(
  await desktop.getByText(/pronounced “Howl-lo”/).isVisible(),
  "FAQ accordion failed",
);

await desktop.goto(`${base}/#waitlist`, { waitUntil: "networkidle" });
const email = desktop.locator("#email");
await desktop
  .getByRole("button", { name: "Join the waitlist", exact: true })
  .last()
  .click();
assert(
  !(await email.evaluate((node) => node.checkValidity())),
  "Required waitlist email was not validated",
);
await email.fill("test@example.com");
await desktop
  .getByRole("button", { name: "Join the waitlist", exact: true })
  .last()
  .click();
await desktop
  .getByText(/not accepting submissions yet/i)
  .waitFor({ state: "visible" });
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/product`, { waitUntil: "networkidle" });
const menu = mobile.getByRole("button", { name: "Menu" });
await menu.click();
const firstMobileLink = mobile
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("link", { name: "Product" });
assert(
  await firstMobileLink.evaluate(
    (element) => document.activeElement === element,
  ),
  "Mobile menu did not move focus to its first link",
);
await firstMobileLink.press("Escape");
assert(
  (await menu.evaluate((element) => document.activeElement === element)) &&
    (await menu.getAttribute("aria-expanded")) === "false",
  "Mobile menu Escape handling failed",
);
await menu.click();
await mobile
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("link", { name: "FAQ", exact: true })
  .click();
await mobile.waitForURL(`${base}/faq`);
assert(
  await mobile
    .getByRole("heading", { level: 1, name: "A little more clarity." })
    .isVisible(),
  "Mobile menu navigation failed",
);
await mobile.close();

for (const [route, selector] of [
  ["/", ".submission-sequence"],
  ["/how-it-works", "#practice-loop"],
]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  const state = await page.locator(selector).evaluate((element) => ({
    animation: getComputedStyle(element).animationName,
    hidden: [...element.querySelectorAll("p, strong, li")].some(
      (child) => Number(getComputedStyle(child).opacity) === 0,
    ),
    stage: element.getAttribute("data-stage"),
    sticky: getComputedStyle(
      element.querySelector(".practice-sticky") || element,
    ).position,
  }));
  assert(!state.hidden, `${route}: reduced-motion content is hidden`);
  if (route === "/how-it-works")
    assert(
      state.stage === "4" && state.sticky !== "sticky",
      "Reduced-motion Practice Loop is incomplete or pinned",
    );
  await page.screenshot({
    path: `${out}/reduced-${route === "/" ? "home" : "how-it-works"}.png`,
    fullPage: true,
  });
  await page.close();
}

await browser.close();
console.log(
  "Routing, responsive layout, interactions and reduced motion passed",
);
