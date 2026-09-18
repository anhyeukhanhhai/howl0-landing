import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = "http://localhost:3000";
const out = ".qa/revision";
const sizes = [
  [390, 844],
  [393, 852],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1280, 720],
  [1366, 768],
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
async function scrollProgress(page, selector, progress, mode = "pin") {
  const { top, height } = await page.locator(selector).evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    height: el.offsetHeight,
  }));
  const viewport = page.viewportSize().height;
  const y =
    mode === "pin"
      ? top + progress * (height - viewport)
      : top - viewport + progress * (height + viewport);
  await page.evaluate(
    (value) => scrollTo({ top: value, behavior: "instant" }),
    y,
  );
  await page.waitForTimeout(75);
}
for (const [width, height] of sizes) {
  const label = `${width}x${height}`;
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert(
    await page.evaluate(() =>
      document.fonts
        .load('16px "Be Vietnam Pro"', "Tiếng Việt: ă â ê ô ơ ư đ")
        .then((faces) => faces.length > 0),
    ),
    `${label}: Vietnamese font coverage did not load`,
  );
  const layout = await page.evaluate(() => {
    const box = (element) => {
      const r = element.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    };
    const headline = box(document.querySelector(".hero h1"));
    const visual = box(document.querySelector(".hero-visual"));
    const separated =
      headline.right <= visual.left + 1 ||
      visual.right <= headline.left + 1 ||
      headline.bottom <= visual.top + 1 ||
      visual.bottom <= headline.top + 1;
    const sections = [...document.querySelectorAll("main > section")];
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      separated,
      sections: sections.length,
      second: sections[1]?.id,
      loops: document.querySelectorAll("#practice-loop").length,
      previewBottom: visual.bottom,
      anchor:
        document.querySelector('.hero-actions a[href="#practice-loop"]') !==
        null,
      broken: [...document.querySelectorAll('a[href^="#"]')]
        .filter(
          (link) =>
            !document.getElementById(link.getAttribute("href").slice(1)),
        )
        .map((link) => link.getAttribute("href")),
    };
  });
  assert(
    layout.overflow <= 1,
    `${label}: horizontal overflow ${layout.overflow}`,
  );
  assert(layout.separated, `${label}: hero heading and visual intersect`);
  assert(
    layout.sections === 10 &&
      layout.second === "practice-loop" &&
      layout.loops === 1,
    `${label}: wrong page order or duplicate Practice Loop`,
  );
  assert(
    layout.anchor && !layout.broken.length,
    `${label}: broken hero CTA or anchor ${layout.broken}`,
  );
  if (width <= 430)
    assert(
      layout.previewBottom <= height + 2,
      `${label}: hero preview is below the first viewport`,
    );
  await page.screenshot({ path: `${out}/final-${label}-hero.png` });
  if ([390, 768, 1024, 1440, 2560, 3440].includes(width))
    await page.screenshot({
      path: `${out}/final-${label}-full.png`,
      fullPage: true,
    });
  if (width > 760) {
    const position = await page
      .locator(".practice-sticky")
      .evaluate((el) => getComputedStyle(el).position);
    assert(position === "sticky", `${label}: Practice Loop lost sticky scene`);
    for (const [progress, stage] of [
      [0.1, 0],
      [0.5, 2],
      [0.9, 4],
      [0.3, 1],
    ]) {
      await scrollProgress(page, "#practice-loop", progress);
      await page.waitForFunction(
        (expected) =>
          document.querySelector("#practice-loop")?.dataset.stage ===
          String(expected),
        stage,
      );
      if (width === 1440) {
        await page.waitForTimeout(420);
        await page.screenshot({
          path: `${out}/final-practice-${progress}.png`,
        });
      }
    }
  } else {
    const position = await page
      .locator(".practice-sticky")
      .evaluate((el) => getComputedStyle(el).position);
    assert(position === "relative", `${label}: mobile Practice Loop is pinned`);
    await page
      .locator(".practice-step-4")
      .evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
    await page.waitForFunction(
      () => document.querySelector("#practice-loop")?.dataset.stage === "4",
    );
  }
  if (width === 1440 || width === 1366) {
    for (const progress of [0.02, 0.35, 0.65, 0.95]) {
      await scrollProgress(page, ".diff-scroll", progress);
      const route = await page.evaluate(() => {
        const old = document.querySelector(".old-route");
        const newer = document.querySelector(".new-route");
        const container = old
          .querySelector(".route-steps")
          .getBoundingClientRect();
        return {
          oldOpacity: Number(getComputedStyle(old).opacity),
          newOpacity: Number(getComputedStyle(newer).opacity),
          oldClip: getComputedStyle(old).clipPath,
          wordsFit: [...old.querySelectorAll(".route-steps span")].every(
            (el) => {
              const r = el.getBoundingClientRect();
              return (
                r.left >= container.left - 1 && r.right <= container.right + 1
              );
            },
          ),
          newVisible: newer.getBoundingClientRect().top < innerHeight,
        };
      });
      assert(
        route.oldClip === "none" && route.wordsFit,
        `${label}: fragmented route clipped at ${progress}`,
      );
      if (progress === 0.35)
        assert(
          route.oldOpacity > 0.99,
          `${label}: fragmented route not readable in hold`,
        );
      if (progress >= 0.95)
        assert(
          route.newOpacity > 0.99 && route.newVisible,
          `${label}: howl0 route not resolved`,
        );
      if (width === 1440)
        await page.screenshot({ path: `${out}/final-diff-${progress}.png` });
    }
  }
  if (width === 390) {
    await page.getByRole("button", { name: /menu/i }).click();
    assert(
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "How it works", exact: true })
        .isVisible(),
      "Mobile menu failed",
    );
    await page.getByRole("button", { name: /close/i }).click();
    const routeLayout = await page
      .locator(".old-route .route-steps")
      .evaluate((el) => getComputedStyle(el).display);
    assert(routeLayout === "grid", "Mobile route did not stack vertically");
  }
  for (const name of ["Teacher", "Student", "Parent", "Teacher"]) {
    await page.getByRole("tab", { name: new RegExp(name, "i") }).click();
    const panel = await page.locator(".audience-content").evaluate((el) => {
      const outer = el.getBoundingClientRect();
      return [el.querySelector("h3"), el.querySelector("p")].every((child) => {
        const r = child.getBoundingClientRect();
        return (
          r.left >= outer.left - 1 &&
          r.right <= outer.right + 1 &&
          r.top >= outer.top - 1 &&
          r.bottom <= outer.bottom + 1
        );
      });
    });
    assert(panel, `${label}: ${name} panel text clipped`);
  }
  if (width === 1440) {
    await page.getByText("What is howl0?", { exact: true }).click();
    assert(
      await page.getByText(/pronounced “Howl-lo”/).isVisible(),
      "FAQ failed",
    );
    await page.locator("#email").fill("test@example.com");
    await page
      .getByRole("button", { name: /Join the waitlist/i })
      .last()
      .click();
    await page
      .getByText(/not accepting submissions yet/i)
      .waitFor({ state: "visible" });
  }
  assert(!errors.length, `${label}: application errors: ${errors.join("; ")}`);
  console.log(label, "passed");
  await page.close();
}
for (const [width, height] of [
  [390, 844],
  [1440, 900],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  await page.goto(base, { waitUntil: "networkidle" });
  const staticState = await page.evaluate(() => ({
    stage: document.querySelector("#practice-loop")?.dataset.stage,
    old: Number(getComputedStyle(document.querySelector(".old-route")).opacity),
    newer: Number(
      getComputedStyle(document.querySelector(".new-route")).opacity,
    ),
    preview: getComputedStyle(document.querySelector(".preview-link"))
      .animationName,
    hiddenCopy: [...document.querySelectorAll(".practice-step p")].some(
      (el) => Number(getComputedStyle(el).opacity) < 1,
    ),
  }));
  assert(
    staticState.stage === "4" &&
      staticState.old === 1 &&
      staticState.newer === 1 &&
      staticState.preview === "none" &&
      !staticState.hiddenCopy,
    `${width}: incomplete reduced-motion state ${JSON.stringify(staticState)}`,
  );
  await page.screenshot({
    path: `${out}/final-reduced-${width}.png`,
    fullPage: true,
  });
  await page.close();
}
await browser.close();
console.log("Responsive, motion, interaction and reduced-motion checks passed");
