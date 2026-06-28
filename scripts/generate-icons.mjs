import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const svg = readFileSync(resolve(root, "public/logo.svg"));
const sharp = (await import("sharp")).default;

console.log("Generating PNG assets from logo.svg ...");

await sharp(svg).resize(1024, 1024).png().toFile(resolve(root, "public/logo.png"));
console.log("  ✓ public/logo.png (1024×1024)");

await sharp(svg).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png"));
console.log("  ✓ public/apple-touch-icon.png (180×180)");

await sharp(svg).resize(32, 32).png().toFile(resolve(root, "public/favicon-32x32.png"));
console.log("  ✓ public/favicon-32x32.png");

await sharp(svg).resize(16, 16).png().toFile(resolve(root, "public/favicon-16x16.png"));
console.log("  ✓ public/favicon-16x16.png");

// Build favicon.ico in pure JS — modern ICO supports raw embedded PNG data
function buildIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;

  let dataSize = 0;
  for (const img of images) dataSize += img.data.length;

  const buf = Buffer.alloc(headerSize + dirEntrySize * count + dataSize);

  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // type = 1 (ICO)
  buf.writeUInt16LE(count, 4); // number of images

  let imageOffset = headerSize + dirEntrySize * count;

  for (let i = 0; i < images.length; i++) {
    const { width, height, data } = images[i];
    const base = headerSize + i * dirEntrySize;

    buf.writeUInt8(width >= 256 ? 0 : width, base);      // bWidth (0 = 256)
    buf.writeUInt8(height >= 256 ? 0 : height, base + 1); // bHeight
    buf.writeUInt8(0, base + 2);  // bColorCount
    buf.writeUInt8(0, base + 3);  // bReserved
    buf.writeUInt16LE(0, base + 4); // wPlanes (0 = PNG embedded)
    buf.writeUInt16LE(0, base + 6); // wBitCount (0 = PNG embedded)
    buf.writeUInt32LE(data.length, base + 8);  // dwBytesInRes
    buf.writeUInt32LE(imageOffset, base + 12); // dwImageOffset

    data.copy(buf, imageOffset);
    imageOffset += data.length;
  }

  return buf;
}

console.log("\nGenerating favicon.ico ...");
const png16 = readFileSync(resolve(root, "public/favicon-16x16.png"));
const png32 = readFileSync(resolve(root, "public/favicon-32x32.png"));

const ico = buildIco([
  { width: 16, height: 16, data: png16 },
  { width: 32, height: 32, data: png32 },
]);
writeFileSync(resolve(root, "public/favicon.ico"), ico);
console.log("  ✓ public/favicon.ico (16+32 px, PNG-embedded)");

console.log("\n✅ All icon assets generated successfully.");
