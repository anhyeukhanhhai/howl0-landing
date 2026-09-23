import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = ".qa/reposition";
const pages = [
  [
    "",
    "See the progress between lessons.",
    "Thấy được từng bước tiến bộ giữa những buổi học.",
  ],
  [
    "product",
    "Turn practice into visible progress.",
    "Để mỗi lần luyện tập trở thành một bước tiến có thể nhìn thấy.",
  ],
  [
    "how-it-works",
    "From one task to a clearer picture of progress.",
    "Từ một bài tập đến một hành trình tiến bộ rõ ràng hơn.",
  ],
  [
    "why-howl0",
    "The most important learning is often the hardest to see.",
    "Phần quan trọng nhất của việc học đôi khi lại khó nhìn thấy nhất.",
  ],
  [
    "for-you",
    "One journey, with a clearer role for everyone.",
    "Một hành trình, với vai trò rõ ràng hơn cho mỗi người.",
  ],
  ["people", "Meet Henry and Aaron.", "Gặp gỡ Henry và Aaron."],
  [
    "faq",
    "What we know while howl0 takes shape.",
    "Những điều chúng tôi có thể chia sẻ khi howl0 đang thành hình.",
  ],
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

for (const [width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(base, { waitUntil: "networkidle" });
  assert(
    new URL(page.url()).pathname === "/welcome",
    `${width}: first visit did not show welcome`,
  );
  assert(
    await page.getByRole("heading", { name: "Welcome to howl0." }).isVisible(),
    `${width}: welcome heading missing`,
  );
  assert(
    (await page.locator("html").getAttribute("lang")) === "en",
    `${width}: welcome language missing`,
  );
  assert(
    (await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    )) <= 1,
    `${width}: welcome horizontal overflow`,
  );
  await page.screenshot({
    path: `${out}/welcome-${width}x${height}.png`,
    fullPage: true,
  });
  await page.close();
}

for (const [choice, target, lang] of [
  ["English", "/", "en"],
  ["Tiếng Việt", "/vi", "vi"],
]) {
  const page = await browser.newPage();
  await page.goto(`${base}/welcome`, { waitUntil: "networkidle" });
  if (lang === "en") {
    await page.keyboard.press("Tab");
    assert(
      await page
        .getByRole("link", { name: choice })
        .evaluate((node) => document.activeElement === node),
      "welcome choice is not keyboard reachable",
    );
    await page.keyboard.press("Enter");
  } else {
    await page.getByRole("link", { name: choice }).click();
  }
  await page.waitForURL(`${base}${target}`);
  assert(
    (await page.locator("html").getAttribute("lang")) === lang,
    `${choice}: language choice did not open localized site`,
  );
  assert(
    (await page.context().cookies()).some(
      (cookie) =>
        cookie.name === "howl0-language-choice" && cookie.value === lang,
    ),
    `${choice}: language choice not persisted`,
  );
  await page.goto(base, { waitUntil: "networkidle" });
  assert(
    new URL(page.url()).pathname === target,
    `${choice}: repeat visit unexpectedly gated`,
  );
  await page.close();
}

const anchored = await browser.newPage();
await anchored.goto(`${base}/#waitlist`, { waitUntil: "networkidle" });
await anchored.waitForURL(`${base}/#waitlist`);
assert(
  await anchored.locator("#waitlist").isVisible(),
  "legacy waitlist anchor did not reach the form",
);
await anchored.close();

const directSubpage = await browser.newPage();
await directSubpage.goto(`${base}/people`, { waitUntil: "networkidle" });
await directSubpage
  .getByRole("link", { name: "Join the waitlist" })
  .first()
  .click();
await directSubpage.waitForURL(`${base}/#waitlist`);
assert(
  await directSubpage.locator("#waitlist").isVisible(),
  "first-time visitor from People did not reach waitlist",
);
await directSubpage.close();

async function revealPage(page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const viewport = page.viewportSize().height;
  for (let y = 0; y < height; y += viewport * 0.8) {
    await page.evaluate(
      (value) => scrollTo({ top: value, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(25);
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
}

for (const [width, height] of viewports) {
  for (const locale of ["en", "vi"]) {
    for (const [slug, english, vietnamese] of pages) {
      const path =
        `${locale === "vi" ? "/vi" : ""}${slug ? `/${slug}` : ""}` || "/";
      const page = await browser.newPage({ viewport: { width, height } });
      await page
        .context()
        .addCookies([
          { name: "howl0-language-choice", value: locale, url: base },
        ]);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(`${base}${path}`, {
        waitUntil: "networkidle",
      });
      assert(response?.ok(), `${path} ${width}: direct route failed`);
      assert(
        await page
          .getByRole("heading", {
            level: 1,
            name: locale === "vi" ? vietnamese : english,
          })
          .isVisible(),
        `${path} ${width}: heading missing`,
      );
      const layout = await page.evaluate(() => {
        const headings = [...document.querySelectorAll("h1,h2,h3")];
        const clipped = headings
          .filter((node) => node.scrollWidth > node.clientWidth + 2)
          .map((node) => node.textContent?.slice(0, 45));
        return {
          lang: document.documentElement.lang,
          title: document.title,
          description: document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content"),
          overflow: document.documentElement.scrollWidth - innerWidth,
          mains: document.querySelectorAll("main").length,
          h1s: document.querySelectorAll("h1").length,
          clipped,
          heroSeparated: (() => {
            const copy = document.querySelector(".home-hero .hero-copy");
            const visual = document.querySelector(".home-hero .hero-visual");
            if (!copy || !visual) return true;
            const a = copy.getBoundingClientRect();
            const b = visual.getBoundingClientRect();
            return (
              a.right <= b.left + 1 ||
              b.right <= a.left + 1 ||
              a.bottom <= b.top + 1 ||
              b.bottom <= a.top + 1
            );
          })(),
          heroContained: (() => {
            const hero = document.querySelector(".home-hero");
            const logo = document.querySelector(".home-hero .hero-loop");
            const message = document.querySelector(
              ".home-hero .preview-message",
            );
            if (!hero || !logo || !message) return true;
            const bottom = hero.getBoundingClientRect().bottom;
            return (
              logo.getBoundingClientRect().bottom <= bottom + 1 &&
              message.getBoundingClientRect().bottom <= bottom + 1
            );
          })(),
        };
      });
      assert(layout.lang === locale, `${path}: html lang ${layout.lang}`);
      assert(
        layout.title.includes("howl0") && layout.description,
        `${path}: localized metadata missing`,
      );
      assert(
        layout.overflow <= 1,
        `${path} ${width}: horizontal overflow ${layout.overflow}`,
      );
      assert(
        layout.mains === 1 && layout.h1s === 1,
        `${path}: landmarks invalid`,
      );
      assert(
        !layout.clipped.length,
        `${path} ${width}: clipped headings ${layout.clipped}`,
      );
      assert(
        layout.heroSeparated,
        `${path} ${width}: hero copy overlaps visual`,
      );
      assert(
        layout.heroContained,
        `${path} ${width}: hero visual escapes its section`,
      );
      assert(!errors.length, `${path}: page errors ${errors.join("; ")}`);
      if (
        !slug ||
        (slug === "people" && width === 3440) ||
        ((width === 390 || width === 1440) &&
          [
            "product",
            "how-it-works",
            "why-howl0",
            "for-you",
            "people",
            "faq",
          ].includes(slug))
      ) {
        await revealPage(page);
        await page.screenshot({
          path: `${out}/${locale}-${slug || "home"}-${width}x${height}.png`,
          fullPage: true,
        });
      }
      await page.close();
    }
  }
  console.log(`${width}x${height}: both languages, seven routes passed`);
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page
  .context()
  .addCookies([{ name: "howl0-language-choice", value: "en", url: base }]);
for (const [source, target] of [
  ["/for-educators", "/for-you"],
  ["/vi/for-educators", "/vi/for-you"],
  ["/who-its-for", "/for-you"],
  ["/about", "/product"],
  ["/why-howlo", "/why-howl0"],
]) {
  const response = await page.goto(`${base}${source}`, {
    waitUntil: "networkidle",
  });
  assert(
    response?.ok() && new URL(page.url()).pathname === target,
    `${source}: redirect failed`,
  );
}
await page.goto(base, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Switch to Vietnamese" }).click();
await page.waitForURL(`${base}/vi`);
assert(
  (await page.locator("html").getAttribute("lang")) === "vi",
  "language switch did not update document language",
);
assert(
  (await page.context().cookies()).some(
    (cookie) =>
      cookie.name === "howl0-language-choice" && cookie.value === "vi",
  ),
  "language switch did not remember Vietnamese",
);
await page.getByRole("link", { name: "Sản phẩm", exact: true }).first().click();
await page.waitForURL(`${base}/vi/product`);
await page.getByRole("link", { name: "Chuyển sang tiếng Anh" }).click();
await page.waitForURL(`${base}/product`);
assert(
  (await page.context().cookies()).some(
    (cookie) =>
      cookie.name === "howl0-language-choice" && cookie.value === "en",
  ),
  "language switch did not remember English",
);
await page.goBack({ waitUntil: "networkidle" });
assert(
  new URL(page.url()).pathname === "/vi/product",
  "Back failed after language switch",
);
await page.goForward({ waitUntil: "networkidle" });
assert(
  new URL(page.url()).pathname === "/product",
  "Forward failed after language switch",
);

await page.goto(`${base}/for-you`, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: /Teacher/ }).focus();
await page.getByRole("tab", { name: /Teacher/ }).press("ArrowRight");
assert(
  (await page
    .getByRole("tab", { name: /Student/ })
    .getAttribute("aria-selected")) === "true",
  "audience tabs keyboard failed",
);
await page.goto(`${base}/faq`, { waitUntil: "networkidle" });
await page.getByText("What is howl0?", { exact: true }).click();
assert(
  await page
    .getByText(/music learning progress platform in development/)
    .isVisible(),
  "FAQ accordion failed",
);
await page.goto(`${base}/people`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Switch to Vietnamese" }).click();
await page.waitForURL(`${base}/vi/people`);
assert(
  await page
    .getByRole("heading", { name: "Gặp gỡ Henry và Aaron." })
    .isVisible(),
  "People language switch failed",
);

for (const locale of ["en", "vi"]) {
  await page
    .context()
    .addCookies([{ name: "howl0-language-choice", value: locale, url: base }]);
  await page.goto(`${base}${locale === "en" ? "/" : "/vi"}#waitlist`, {
    waitUntil: "networkidle",
  });
  const form = page.locator(".waitlist-form");
  assert(
    (await form.locator("input").count()) === 2,
    `${locale}: form has more than two inputs`,
  );
  assert(
    (await form.locator("select,textarea").count()) === 0,
    `${locale}: removed fields remain`,
  );
  await form
    .getByRole("button", {
      name: locale === "en" ? "Join the waitlist" : "Đăng ký nhận tin",
    })
    .click();
  assert(
    !(await form
      .locator('[name="name"]')
      .evaluate((node) => node.checkValidity())),
    `${locale}: name not required`,
  );
  await form.locator('[name="name"]').fill("Test Name");
  await form.locator('[name="email"]').fill("test@example.com");
  await form
    .getByRole("button", {
      name: locale === "en" ? "Join the waitlist" : "Đăng ký nhận tin",
    })
    .click();
  await form
    .getByRole("status")
    .getByText(
      locale === "en" ? /not accepting submissions yet/ : /chưa nhận thông tin/,
    )
    .waitFor();
  assert(
    !(await form
      .getByText(
        locale === "en"
          ? "You're in the loop. We'll keep you posted."
          : "Bạn đã vào nhịp cùng howl0. Chúng tôi sẽ sớm cập nhật.",
      )
      .count()),
    `${locale}: false success`,
  );
}
await page.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/vi/product`, { waitUntil: "networkidle" });
const menu = mobile.getByRole("button", { name: "Trình đơn" });
await menu.click();
const firstLink = mobile
  .getByRole("navigation", { name: "Điều hướng chính" })
  .getByRole("link", { name: "Sản phẩm" });
assert(
  await firstLink.evaluate((node) => document.activeElement === node),
  "mobile menu focus failed",
);
await firstLink.press("Escape");
assert(
  (await menu.getAttribute("aria-expanded")) === "false",
  "mobile Escape failed",
);
await menu.click();
await mobile.getByRole("link", { name: "Chuyển sang tiếng Anh" }).click();
await mobile.waitForURL(`${base}/product`);
await mobile.close();

for (const [path, selector] of [
  ["/", ".submission-sequence"],
  ["/vi/how-it-works", "#practice-loop"],
]) {
  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reduced
    .context()
    .addCookies([{ name: "howl0-language-choice", value: "en", url: base }]);
  await reduced.goto(`${base}${path}`, { waitUntil: "networkidle" });
  assert(
    await reduced.locator(selector).isVisible(),
    `${path}: reduced-motion content missing`,
  );
  if (path.includes("how-it-works")) {
    assert(
      (await reduced.locator(selector).getAttribute("data-stage")) === "4",
      "reduced-motion loop is incomplete",
    );
  }
  await reduced.screenshot({
    path: `${out}/reduced-${path.includes("how-it-works") ? "vi-loop" : "en-home"}.png`,
    fullPage: true,
  });
  await reduced.close();
}

await browser.close();
console.log(
  "Bilingual routing, redirects, history, tabs, FAQ, form, mobile menu and reduced motion passed",
);
