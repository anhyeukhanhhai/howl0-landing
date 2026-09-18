import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ headless: true });
for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  console.log(name, `${results.violations.length} violations`);
  for (const v of results.violations)
    console.log(
      v.id,
      v.impact,
      v.nodes.map((n) => n.target.join(" ")).join(", "),
    );
  await context.close();
  if (results.violations.length) process.exitCode = 1;
}
await browser.close();
