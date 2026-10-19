import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

// Explicit production allowlist. Never publish proposal marks or entire boards.
const source = "design-resources/PARA_Brand_Resources";
const destination = "public/brand/para/resources";
const assets = [];
function add(folder, file, target = file) {
  assets.push([`${folder}/${file}`, target]);
}
for (const tone of ["espresso", "ivory"])
  add("01_LOGO/Solid/Web", `para-horizontal-${tone}-optical.svg`);
for (const tone of ["light", "dark"])
  add(
    "01_LOGO/Grain_Gradient/Web",
    `para-horizontal-${tone}-grain-optical.svg`,
  );
add(
  "03_TYPOGRAPHY/Fonts_and_Licences/plusjakartasans",
  "PlusJakartaSans[wght].woff2",
);
add(
  "03_TYPOGRAPHY/Fonts_and_Licences/plusjakartasans",
  "OFL.txt",
  "PlusJakartaSans-OFL.txt",
);
for (const weight of ["Regular", "Medium", "SemiBold"])
  add(
    "03_TYPOGRAPHY/Fonts_and_Licences/bevietnampro",
    `BeVietnamPro-${weight}.woff2`,
  );
add(
  "03_TYPOGRAPHY/Fonts_and_Licences/bevietnampro",
  "OFL.txt",
  "BeVietnamPro-OFL.txt",
);
for (const name of [
  "assignment",
  "rhythm",
  "recording",
  "feedback",
  "next-step",
  "listening",
  "repeat-improve",
  "review",
  "practise",
  "progress",
])
  add(
    "04_ICONS/Landing_and_Communication",
    `para-expressive-${name}-grain.svg`,
  );
for (const name of [
  "forward",
  "assignment",
  "pause",
  "play",
  "menu",
  "close",
  "warning",
  "language",
  "comment",
  "upload",
  "review",
])
  add("04_ICONS/Application_UI", `para-ui-${name}-24-solid.svg`);
for (const locale of ["en", "vi"])
  add(
    "05_GRAPHIC_ARTWORK/Grain_Gradient",
    `para-art-03-listen-${locale}-grain.svg`,
  );
for (const name of ["warm", "deep", "quiet"])
  add(
    "06_GRADIENTS_AND_TEXTURES/Web_Exports",
    `para-material-${name}-grain.webp`,
  );
add("06_GRADIENTS_AND_TEXTURES/Grain_Overlays", "para-film-grain-256.png");

await mkdir(destination, { recursive: true });
const records = [];
for (const [original, target] of assets) {
  const data = await readFile(path.join(source, original));
  await copyFile(path.join(source, original), path.join(destination, target));
  records.push({
    source: original,
    file: target,
    sha256: createHash("sha256").update(data).digest("hex"),
  });
}
await writeFile(
  path.join(destination, "asset-provenance.json"),
  JSON.stringify({ source, assets: records }, null, 2) + "\n",
);
console.log(
  `Copied ${records.length} exact approved production assets; no proposals.`,
);
