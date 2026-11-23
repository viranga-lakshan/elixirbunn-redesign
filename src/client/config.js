// ─────────────────────────────────────────────────────────────
//  CLIENT CONFIG — the ONLY file (plus copy.js, products.json and
//  /public/client) you change to re-skin this template for a new client.
// ─────────────────────────────────────────────────────────────
export default {
  name: { en: 'Elixir Bunn', ar: 'إكسير البن' },
  tagline: { en: 'Coffee Roasters', ar: 'محمصة قهوة مختصة' },
  colors: { ivory: '#F5EFE6', paper: '#FBF8F3', ink: '#1A130E', accent: '#B0583A', gold: '#B8955A', sand: '#E6D9C6' },
  logo: { dark: 'client/logo-dark.png', light: 'client/logo-light.png', gold: 'client/logo-gold.png' },
  // image ids live in /public/client/img/<id>.webp
  img: {
    heroBox: 'cf161aaf', // white-background packshot (blended with multiply)
    manifesto: 'bf5327e0',
    journey: ['bf5327e0', '3714d0d2', 'cb519526', '611529a1'],
    farmers: 'e9cf8e38',
    latte: '84d170cb',
    gallery: ['95dd7e89', '1ca457b8', '03b4d820', '7066e569'],
    wholesale: 'da7a107f',
    giftBox: '93cdd10f',
    cherries: '3714d0d2',
    terrace: '70b5fe7a'
  },
  currency: { default: 'SAR', list: ['SAR', 'USD'] },
  shipping: { SAR: 25, USD: 6.68 },
  contact: {
    phone: '+966 58 133 6317',
    whatsapp: '966581336317',
    city: { en: 'Al Nakheel, Riyadh — Kingdom of Saudi Arabia', ar: 'النخيل، الرياض — المملكة العربية السعودية' },
    cr: '1010510548'
  },
  social: { instagram: 'https://www.instagram.com/elixirbunn', x: 'https://x.com/elixirbunn', tiktok: 'https://www.tiktok.com/@elixirbunn' },
  payments: ['Apple Pay', 'mada', 'Visa', 'Mastercard', 'Tabby', 'Tamara'],
  branches: [
    { name: { en: 'Nakheel', ar: 'النخيل' }, addr: { en: '7157 Salman Bin Maqel, Nakheel District, Riyadh 12392', ar: '7157 سلمان بن مقرن، حي النخيل، الرياض 12392' }, hours: { en: '6:30 AM – 1:00 AM · Sat–Wed  |  6:30 AM – 2:00 AM · Thu–Fri', ar: '6:30 ص – 1:00 ص · السبت–الأربعاء  |  6:30 ص – 2:00 ص · الخميس–الجمعة' } },
    { name: { en: 'Hamra', ar: 'الحمراء' }, addr: { en: '9035 King Abdullah Bin Abdulaziz Rd, Riyadh 13215', ar: '9035 طريق الملك عبدالله بن عبدالعزيز، الرياض 13215' }, hours: { en: '6:30 AM – 11:30 PM · Sat–Wed  |  6:30 AM – 1:00 AM · Thu–Fri', ar: '6:30 ص – 11:30 م · السبت–الأربعاء  |  6:30 ص – 1:00 ص · الخميس–الجمعة' } },
    { name: { en: 'Turki Square', ar: 'ميدان تركي' }, addr: { en: '5917 Makkah Al Mukarramah Rd, Umm Al Hamam Al Sharqi, Riyadh 12321', ar: '5917 طريق مكة المكرمة، أم الحمام الشرقي، الرياض 12321' }, hours: { en: 'Open 24 / 7', ar: 'مفتوح 24 ساعة' } },
    { name: { en: 'Qasr Al Hukm', ar: 'قصر الحكم' }, addr: { en: '7000 Imam Turki Bin Abdullah St, Al Deira, Riyadh 12634', ar: '7000 شارع الإمام تركي بن عبدالله، الديرة، الرياض 12634' }, hours: { en: '7:00 AM – 11:30 PM · Sun–Thu  |  1:00 PM – 11:30 PM · Fri–Sat', ar: '7:00 ص – 11:30 م · الأحد–الخميس  |  1:00 م – 11:30 م · الجمعة–السبت' } },
    { name: { en: 'Sekkah', ar: 'سكّة' }, addr: { en: '2641 Abi Bakr As-Siddiq Rd, Narjis, Riyadh 13327', ar: '2641 طريق أبي بكر الصديق، النرجس، الرياض 13327' }, hours: { en: '6:30 AM – 11:30 PM · Sat–Wed  |  6:30 AM – 2:00 AM · Thu–Fri', ar: '6:30 ص – 11:30 م · السبت–الأربعاء  |  6:30 ص – 2:00 ص · الخميس–الجمعة' } },
    { name: { en: 'Riyadh Park', ar: 'الرياض بارك' }, addr: { en: 'Northern Ring Branch Rd, Al Aqiq, Riyadh 13511', ar: 'طريق الدائري الشمالي، العقيق، الرياض 13511' }, hours: { en: '8:00 AM – 12:00 AM · All week', ar: '8:00 ص – 12:00 ص · طوال الأسبوع' } }
  ]
};
