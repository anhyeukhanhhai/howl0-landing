import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const routes = [
  "/",
  "/how-it-works",
  "/why-howlo",
  "/who-its-for",
  "/about",
  "/faq",
];
const browser = await chromium.launch({ headless: true });
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
async function scan(page, label) {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  console.log(label, `${results.violations.length} violations`);
  for (const violation of results.violations) {
    console.log(
      violation.id,
      violation.impact,
      violation.nodes.map((node) => node.target.join(" ")).join(", "),
    );
  }
  if (results.violations.length) process.exitCode = 1;
}
for (const [width, height, device] of [
  [1440, 900, "desktop"],
  [390, 844, "mobile"],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await scan(page, `${device} ${route}`);
  }
  await context.close();
}
const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const reduced = await reducedContext.newPage();
await reduced.goto(`${base}/how-it-works`, { waitUntil: "networkidle" });
await scan(reduced, "mobile reduced motion /how-it-works");
await reducedContext.close();
await browser.close();
