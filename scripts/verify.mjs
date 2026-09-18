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
  if (name === "mobile") {
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
await reduced.screenshot({ path: ".qa/reduced-motion.png", fullPage: true });
await browser.close();
console.log("Visual and interaction checks passed");
