import fs from 'node:fs';
const [src, out] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
const idOf = f => f.split('_').pop().slice(0, 8);
const ARX = /[\u0600-\u06FF]/;
const regions = { 'الوسطى': 'Central', 'الشرقية': 'Eastern', 'الشمالية': 'Northern', 'الغربية': 'Western', 'الجنوبية': 'Southern' };
const fixName = n => { if (!ARX.test(n)) return n.trim(); const m = n.match(/المنطقة (\S+)/); return m ? `Saudi Coffee – ${regions[m[1]] || ''} Region Blend` : n; };
const arFix = n => n.trim();
const products = raw.filter(p => p.en && p.ar).map(p => {
  const imgs = (p.en.images.length ? p.en.images : p.ar.images).map(idOf);
  return {
    id: p.slug.replace(/[^\w\u0600-\u06FF-]+/g, '-').toLowerCase(),
    slug: p.slug,
    category: ({ 'saudi coffee': 'saudi', 'specialty coffee': 'specialty', 'Specialty Drip Coffee bags': 'drip', 'White Friday Offers': 'offers', 'Wadi Alma': 'specialty' })[p.en.category] || 'specialty',
    price: { SAR: +p.ar.price, USD: +p.en.price },
    sale: p.ar.sale ? { SAR: +p.ar.sale } : null,
    en: { name: fixName(p.en.name), desc: ARX.test(p.en.desc) ? '' : p.en.desc },
    ar: { name: arFix(p.ar.name), desc: p.ar.desc },
    images: imgs
  };
});
fs.writeFileSync(out, JSON.stringify(products, null, 1));
products.forEach(p => console.log(p.category.padEnd(9), p.en.name.padEnd(48), p.price.SAR, p.images.join(','), '|', p.en.desc.slice(0, 70) || '(no en desc)', '|', p.ar.desc.slice(0, 30)));
