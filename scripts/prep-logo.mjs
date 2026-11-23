import sharp from 'sharp';
const [src, outDir] = process.argv.slice(2);
const trimmed = await sharp(src).trim({ threshold: 30 }).toBuffer();
const { data, info } = await sharp(trimmed).greyscale().negate().raw().toBuffer({ resolveWithObject: true });
const make = async (name, [r, g, b]) => {
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i++) { rgba[i*4] = r; rgba[i*4+1] = g; rgba[i*4+2] = b; rgba[i*4+3] = data[i]; }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(`${outDir}/${name}.png`);
};
await make('logo-dark', [26, 19, 14]); await make('logo-light', [245, 239, 230]); await make('logo-gold', [184, 149, 90]);
console.log(info.width, info.height);
