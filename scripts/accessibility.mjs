import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ headless: true });
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
async function scan(page, label) {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  console.log(label, `${results.violations.length} violations`);
  for (const v of results.violations)
    console.log(
      v.id,
      v.impact,
      v.nodes.map((n) => n.target.join(" ")).join(", "),
    );
  if (results.violations.length) process.exitCode = 1;
}
for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await scan(page, name);
  if (name === "desktop") {
    for (const [label, selector, mode, progress] of [
      ["problem end", ".problem-scroll", "pin", 0.8],
      ["practice submit", "#practice-loop", "pin", 0.5],
      ["one-link transition", ".diff-scroll", "enter", 0.5],
      ["belief transition", ".belief-scroll", "enter", 0.6],
    ]) {
      const geometry = await page.locator(selector).evaluate((el) => ({
        top: el.getBoundingClientRect().top + scrollY,
        height: el.offsetHeight,
      }));
      const y =
        mode === "pin"
          ? geometry.top + progress * (geometry.height - height)
          : geometry.top - height + progress * (geometry.height + height);
      await page.evaluate(
        (value) => window.scrollTo({ top: value, behavior: "instant" }),
        y,
      );
      await page.waitForTimeout(60);
      await scan(page, label);
    }
  }
  await context.close();
}
await browser.close();
