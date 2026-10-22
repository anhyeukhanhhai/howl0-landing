import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Mechanical web export only. Originals, crops and supplied colours are kept.
const source = "design-resources/images";
const target = "public/images/performance";
const selections = [
  ["Grainy Nirvana Guitar Stage Lights.png", "guitar-stage.webp", 1436],
  ["Grainy Retro Guitar Duo on Stage.png", "stage-duo.webp", 900],
  ["Grainy Bassist in Sunlit Crowd.png", "bass-performance.webp", 800],
];
await mkdir(target, { recursive: true });
const assets = [];
for (const [original, file, width] of selections) {
  const input = await readFile(`${source}/${original}`);
  const output = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 83, effort: 6 })
    .toBuffer();
  const metadata = await sharp(output).metadata();
  await writeFile(`${target}/${file}`, output);
  assets.push({
    source: original,
    file,
    sourceSha256: createHash("sha256").update(input).digest("hex"),
    width: metadata.width,
    height: metadata.height,
    bytes: output.length,
  });
}
await writeFile(
  `${target}/provenance.json`,
  JSON.stringify({ source, assets }, null, 2) + "\n",
);
console.log(assets);
