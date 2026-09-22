import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const colorScheme = process.env.COLOR_SCHEME || "light";
const routes = [
  "/welcome",
  "/",
  "/product",
  "/how-it-works",
  "/why-howl0",
  "/for-you",
  "/people",
  "/faq",
  "/vi",
  "/vi/product",
  "/vi/how-it-works",
  "/vi/why-howl0",
  "/vi/for-you",
  "/vi/people",
  "/vi/faq",
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
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme,
  });
  await context.addCookies([
    { name: "howl0-language-choice", value: "en", url: base },
  ]);
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await scan(page, `${colorScheme} ${device} ${route}`);
    if (route.endsWith("/for-you")) {
      const tabs = page.getByRole("tab");
      for (const index of [1, 2]) {
        await tabs.nth(index).click();
        await scan(page, `${colorScheme} ${device} ${route} tab ${index + 1}`);
      }
    }
    if (route.endsWith("/faq")) {
      for (const summary of await page.locator("summary").all()) {
        await summary.click();
      }
      await scan(page, `${colorScheme} ${device} ${route} expanded`);
    }
  }
  await context.close();
}
const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
  colorScheme,
});
const reduced = await reducedContext.newPage();
await reduced.goto(`${base}/how-it-works`, { waitUntil: "networkidle" });
await scan(reduced, "mobile reduced motion /how-it-works");
await reducedContext.close();
await browser.close();
