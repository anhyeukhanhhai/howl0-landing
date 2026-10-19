import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const source =
  "design-resources/PARA_Brand_Resources/PARA_Glassmorphism_Resources";
const target = "public/brand/para/glass";
await mkdir(target, { recursive: true });
await mkdir("src/app/glass", { recursive: true });
const records = [];
for (const file of [
  "03_OVERLAYS_AND_TEXTURES/PNG/para-film-grain-256.png",
  "03_OVERLAYS_AND_TEXTURES/SVG/para-glass-rising-edge-ivory.svg",
  "03_OVERLAYS_AND_TEXTURES/SVG/para-glass-rising-edge-smoke.svg",
]) {
  const name = file.split("/").at(-1);
  await copyFile(`${source}/${file}`, `${target}/${name}`);
  records.push({
    source: file,
    file: name,
    sha256: createHash("sha256")
      .update(await readFile(`${source}/${file}`))
      .digest("hex"),
  });
}
for (const file of [
  "01_TOKENS/para-glass-tokens.css",
  "02_EFFECTS_CSS/para-glass.css",
  "02_EFFECTS_CSS/para-glass-fallbacks.css",
]) {
  const original = await readFile(`${source}/${file}`, "utf8");
  // Only relocate asset URLs. Keep the supplied material and accessibility rules.
  const css = original.replaceAll(
    /\.\.\/03_OVERLAYS_AND_TEXTURES\/(PNG|SVG)\//g,
    "/brand/para/glass/",
  );
  await writeFile(`src/app/glass/${file.split("/").at(-1)}`, css);
}
await writeFile(
  `${target}/provenance.json`,
  JSON.stringify({ source, assets: records }, null, 2) + "\n",
);
console.log("Synced supplied glass CSS and 3 exact decorative assets.");
