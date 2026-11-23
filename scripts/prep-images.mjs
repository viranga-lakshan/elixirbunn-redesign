// Converts a client's raw downloaded images into optimised webp + builds a contact sheet.
import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const [src, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(src).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
const tiles = [];
for (const f of files) {
  const id = f.split('_').pop().replace(/\.\w+$/, '').slice(0, 8);
  const img = sharp(path.join(src, f));
  const meta = await img.metadata();
  await img.clone().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(out, id + '.webp'));
  tiles.push({ id, w: meta.width, h: meta.height, input: await img.clone().flatten({ background: '#777' }).resize(200, 200, { fit: 'contain', background: '#777' }).jpeg().toBuffer() });
}
const cols = 8, rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: cols * 200, height: rows * 200, channels: 3, background: '#555' } })
  .composite(tiles.map((t, i) => ({ input: t.input, left: (i % cols) * 200, top: Math.floor(i / cols) * 200 })))
  .jpeg().toFile(path.join(out, '..', 'sheet.jpg'));
fs.writeFileSync(path.join(out, '..', 'sheet.txt'), tiles.map((t, i) => `${i} ${t.id} ${t.w}x${t.h}`).join('\n'));
console.log(tiles.length, 'done');
