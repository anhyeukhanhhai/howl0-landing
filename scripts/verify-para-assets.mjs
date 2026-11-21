import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

/** Approved runtime bytes, verified without the local-only design package. */
export async function verifyParaAssets() {
  const manifest = JSON.parse(
    await readFile(
      new URL("./para-runtime-assets.json", import.meta.url),
      "utf8",
    ),
  );
  for (const [path, expected] of Object.entries(manifest)) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expected,
      `${path}: approved runtime asset changed`,
    );
  }
}
