import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");

const targets = [
  "hero 5.jpg",
  "hero 6.png",
  "hero 8.png",
  "summit-networking.png",
  "summit-stage.png",
  "summit-audience.png",
  "summit-speaker.png",
];

async function optimizeImage(relativePath) {
  const inputPath = path.join(publicDir, relativePath);
  const tempPath = `${inputPath}.tmp`;
  const ext = path.extname(relativePath).toLowerCase();

  const before = await fs.stat(inputPath);
  let pipeline = sharp(inputPath);

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({
      quality: 78,
      mozjpeg: true,
      progressive: true,
    });
  } else if (ext === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true,
      quality: 82,
    });
  } else {
    return {
      file: relativePath,
      before: before.size,
      after: before.size,
      changed: false,
      note: "Skipped unsupported extension",
    };
  }

  await pipeline.toFile(tempPath);
  const after = await fs.stat(tempPath);

  if (after.size < before.size) {
    await fs.rename(tempPath, inputPath);
    return {
      file: relativePath,
      before: before.size,
      after: after.size,
      changed: true,
    };
  }

  await fs.rm(tempPath, { force: true });
  return {
    file: relativePath,
    before: before.size,
    after: before.size,
    changed: false,
    note: "Kept original (already smaller)",
  };
}

async function buildOgImage() {
  const source = path.join(publicDir, "hero 5.jpg");
  const output = path.join(publicDir, "og-image.jpg");

  await sharp(source)
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(output);
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const results = [];
  for (const file of targets) {
    results.push(await optimizeImage(file));
  }

  await buildOgImage();

  console.log("Image optimization summary:");
  for (const result of results) {
    const delta = result.before - result.after;
    const suffix = result.changed ? `saved ${formatSize(delta)}` : result.note ?? "unchanged";
    console.log(
      `- ${result.file}: ${formatSize(result.before)} -> ${formatSize(result.after)} (${suffix})`
    );
  }

  const ogStats = await fs.stat(path.join(publicDir, "og-image.jpg"));
  console.log(`- og-image.jpg: generated at ${formatSize(ogStats.size)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
