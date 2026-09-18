import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
await mkdir(".qa", { recursive: true });
for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["tablet", 1024, 768],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    sections: document.querySelectorAll("main section").length,
  }));
  if (dimensions.scrollWidth > dimensions.innerWidth)
    throw new Error(
      `${name}: horizontal overflow ${JSON.stringify(dimensions)}`,
    );
  const brokenAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (link) =>
            !document.getElementById(link.getAttribute("href").slice(1)),
        )
        .map((link) => link.getAttribute("href")),
    );
  if (brokenAnchors.length)
    throw new Error(`${name}: broken anchors ${brokenAnchors.join(", ")}`);
  if (
    !(await page.evaluate(() =>
      document.fonts
        .load('16px "Be Vietnam Pro"', "Tiếng Việt: ă â ê ô ơ ư đ")
        .then((faces) => faces.length > 0),
    ))
  )
    throw new Error(`${name}: Vietnamese font did not load`);
  await page.screenshot({ path: `.qa/${name}.png`, fullPage: true });
  console.log(name, dimensions);
  if (name === "desktop") {
    const problem = await page.locator(".problem-scroll").evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.offsetHeight,
    }));
    for (const progress of [0.1, 0.8]) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        problem.top + progress * (problem.height - height),
      );
      const top = await page
        .locator(".problem-grid")
        .evaluate((el) => el.getBoundingClientRect().top);
      if (Math.abs(top - 81) > 3)
        throw new Error(`Problem scene lost sticky position (${top})`);
    }
  }
  if (name === "desktop" || name === "tablet") {
    const loop = page.locator("#practice-loop");
    const geometry = await loop.evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.offsetHeight,
    }));
    const sequence =
      name === "desktop" ? [0, 1, 2, 3, 4, 3, 2, 1, 0] : [0, 2, 4];
    for (const stage of sequence) {
      const target =
        geometry.top + ((geometry.height - height) * (stage + 0.5)) / 5;
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        target,
      );
      await page.waitForFunction(
        (expected) =>
          document
            .querySelector("#practice-loop")
            ?.getAttribute("data-stage") === String(expected),
        stage,
      );
      const stickyTop = await page
        .locator(".practice-sticky")
        .evaluate((el) => el.getBoundingClientRect().top);
      if (Math.abs(stickyTop - 81) > 3)
        throw new Error(
          `${name}: sticky loop jumped at stage ${stage} (${stickyTop})`,
        );
      if (name === "desktop" && [0, 2, 4].includes(stage)) {
        await page.waitForTimeout(420);
        await page.screenshot({ path: `.qa/practice-stage-${stage}.png` });
      }
    }
  }
  if (name === "mobile") {
    const position = await page
      .locator(".practice-sticky")
      .evaluate((el) => getComputedStyle(el).position);
    if (position !== "relative")
      throw new Error("Mobile practice loop should not be pinned");
    const lastStage = page.locator(".practice-step-4");
    await lastStage.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await page.waitForFunction(
      () =>
        document.querySelector("#practice-loop")?.getAttribute("data-stage") ===
        "4",
    );

    await page.getByRole("button", { name: /menu/i }).click();
    if (
      !(await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "How it works", exact: true })
        .isVisible())
    )
      throw new Error("Mobile menu did not open");
  }
  if (name === "desktop") {
    await page
      .getByRole("button", { name: "Play animation", exact: true })
      .click();
    if (
      !(await page.getByRole("button", { name: "Pause animation" }).isVisible())
    )
      throw new Error("Motion control failed");
    await page.getByRole("button", { name: "Pause animation" }).click();
    await page.getByRole("tab", { name: /Student/i }).click();
    if (
      !(await page
        .getByText("Submit your practice without the platform headache.")
        .isVisible())
    )
      throw new Error("Tab failed");
    await page.getByText("What is howl0?", { exact: true }).click();
    if (!(await page.getByText(/pronounced “Howl-lo”/).isVisible()))
      throw new Error("FAQ failed");
    await page.locator("#email").fill("test@example.com");
    await page
      .getByRole("button", { name: /Join the waitlist/i })
      .last()
      .click();
    await page
      .getByText(/not accepting submissions yet/i)
      .waitFor({ state: "visible", timeout: 3000 });
  }
  await page.close();
}
const reduced = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await reduced.goto("http://localhost:3000", { waitUntil: "networkidle" });
if (
  !(await reduced
    .getByText("One link. A clearer practice loop.", { exact: true })
    .first()
    .isVisible())
)
  throw new Error("Reduced motion fallback missing");
const reducedLoop = reduced.locator("#practice-loop");
if (await reducedLoop.evaluate((el) => getComputedStyle(el).height === "0px"))
  throw new Error("Reduced-motion loop disappeared");
await reducedLoop.scrollIntoViewIfNeeded();
await reduced.waitForFunction(
  () =>
    document.querySelector("#practice-loop")?.getAttribute("data-stage") ===
    "4",
);
if (
  !(await reducedLoop
    .getByText("The student understands what to practise next.")
    .isVisible())
)
  throw new Error("Reduced-motion sequence is incomplete");
await reduced.screenshot({ path: ".qa/reduced-motion.png", fullPage: true });
await browser.close();
console.log("Visual and interaction checks passed");
