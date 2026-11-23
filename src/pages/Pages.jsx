import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import products from '../client/products.json';
import { useI18n } from '../core/i18n.jsx';
import { useCart, getProduct } from '../core/cart.jsx';
import { gsap, useGsap } from '../core/motion.jsx';
import { Reveal, SplitTitle, Magnetic } from '../core/ui.jsx';
import { ProductCard, img, unit } from '../components/Shell.jsx';
import Hero from '../components/Hero.jsx';
import { Marquee, Manifesto, Regions, Journey, Featured, Gallery, BranchesTeaser, BranchRows, WholesaleCTA } from '../components/Sections.jsx';

/* ───────── HOME ───────── */
export function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Marquee dark />
      <Regions />
      <Journey />
      <Featured />
      <Gallery />
      <BranchesTeaser />
      <WholesaleCTA />
    </>
  );
}

const PageHead = ({ label, title, sub }) => (
  <header className="phead wrap">
    {label && <p className="eyebrow">{label}</p>}
    <SplitTitle text={title} as="h1" className="h-xxl" />
    {sub && <p className="lead">{sub}</p>}
  </header>
);

/* ───────── SHOP ───────── */
export function Shop() {
  const { c, tr } = useI18n();
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('featured');
  const cats = ['all', 'saudi', 'specialty', 'drip', 'offers'];
  const list = useMemo(() => {
    let l = products.filter(p => cat === 'all' || p.category === cat);
    if (sort === 'low') l = [...l].sort((a, b) => a.price.SAR - b.price.SAR);
    if (sort === 'high') l = [...l].sort((a, b) => b.price.SAR - a.price.SAR);
    return l;
  }, [cat, sort]);
  return (
    <main className="page">
      <PageHead title={tr(c.shop.title)} sub={tr(c.shop.sub)} />
      <div className="wrap">
        <div className="filters">
          <div className="tabs" role="tablist">{cats.map(k => <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>{tr(c.shop[k])}</button>)}</div>
          <label className="sort"><span>{tr(c.shop.sort)}</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">{tr(c.shop.featured)}</option><option value="low">{tr(c.shop.low)}</option><option value="high">{tr(c.shop.high)}</option>
            </select></label>
          <span className="count">{list.length} {tr(c.shop.items)}</span>
        </div>
        <div className="grid4 shop-grid" key={cat + sort}>{list.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 0.06}><ProductCard p={p} index={i} /></Reveal>)}</div>
      </div>
    </main>
  );
}

/* ───────── PRODUCT ───────── */
export function Product() {
  const { id } = useParams();
  const { c, tr, lang, fmt, currency } = useI18n();
  const cart = useCart();
  const p = getProduct(decodeURIComponent(id));
  const [i, setI] = useState(0);
  const [grind, setGrind] = useState(0);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [zoom, setZoom] = useState(null);
  useEffect(() => { setI(0); setQty(1); setDone(false); }, [id]);
  if (!p) return <main className="page wrap"><PageHead title="404" /><Link className="btn dark" to="/shop">{tr(c.product.back)}</Link></main>;
  const related = products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  const more = related.length < 4 ? [...related, ...products.filter(x => x.id !== p.id && !related.includes(x)).slice(0, 4 - related.length)] : related;
  const desc = (p[lang].desc || tr(c.product.fallback)).split(/(?<=[.؟!؛])\s+(?=[A-Zأ-ي])/).reduce((acc, s, idx) => { const k = Math.floor(idx / 2); acc[k] = (acc[k] ? acc[k] + ' ' : '') + s; return acc; }, []);
  const liked = cart.wish.includes(p.id);
  const price = p.sale ? { SAR: p.sale.SAR, USD: unit(p, 'USD') } : p.price;
  const add = () => { cart.add(p.id, qty, grind); setDone(true); setTimeout(() => setDone(false), 1800); };
  const mv = e => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); };
  return (
    <main className="page pdp">
      <div className="wrap pdp-grid">
        <div className="pdp-gal">
          <div className="pdp-main" onMouseMove={mv} onMouseLeave={() => setZoom(null)} data-cursor="Zoom">
            <img src={img(p.images[i])} alt={p[lang].name} style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: 'scale(1.9)' } : undefined} />
          </div>
          {p.images.length > 1 && <div className="pdp-thumbs">{p.images.map((m, k) => <button key={m} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Image ${k + 1}`}><img src={img(m)} alt="" /></button>)}</div>}
        </div>
        <div className="pdp-info">
          <Link to="/shop" className="back">← {tr(c.product.back)}</Link>
          <p className="eyebrow">{tr(c.shop[p.category])}</p>
          <h1 className="h-xl">{p[lang].name}</h1>
          <p className="pdp-price">{p.sale && <s>{fmt(p.price)}</s>} {fmt(price)}</p>
          <div className="pdp-desc">{desc.map((d, k) => <p key={k}>{d}</p>)}</div>
          <div className="opt"><span className="lbl">{tr(c.product.grind)}</span>
            <div className="opts">{c.product.grinds.map((g, k) => <button key={k} className={`opt-b ${grind === k ? 'on' : ''}`} onClick={() => setGrind(k)}>{tr(g)}</button>)}</div></div>
          <div className="buy">
            <div className="qty"><button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="−">−</button><span>{qty}</span><button onClick={() => setQty(q => q + 1)} aria-label="+">+</button></div>
            <Magnetic><button className={`btn gold grow ${done ? 'ok' : ''}`} onClick={add}>{done ? tr(c.product.added) : `${tr(c.product.add)} · ${fmt(typeof price === 'object' ? { SAR: price.SAR * qty, USD: price.USD * qty } : price * qty)}`}</button></Magnetic>
            <button className={`heart lg ${liked ? 'on' : ''}`} onClick={() => cart.toggleWish(p.id)} aria-label={tr(c.product.wish)} aria-pressed={liked}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg></button>
          </div>
          <ul className="perks">{c.product.perks.map((k, n) => <li key={n}><i>✦</i>{tr(k)}</li>)}</ul>
        </div>
      </div>
      <section className="wrap related"><h2 className="h-lg">{tr(c.product.related)}</h2><div className="grid4">{more.map((x, n) => <ProductCard key={x.id} p={x} index={n} />)}</div></section>
      <i hidden>{currency}</i>
    </main>
  );
}

/* ───────── STORY ───────── */
export function Story() {
  const { c, tr, lang, config } = useI18n();
  const scope = useGsap(root => {
    root.querySelectorAll('.cnt').forEach(el => {
      const raw = el.dataset.n, num = parseFloat(raw.replace(/[^0-9.]/g, '')), suf = raw.replace(/[0-9.,]/g, ''); const o = { v: 0 };
      gsap.to(o, { v: num, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US') + suf; } });
    });
    gsap.fromTo(root.querySelector('.st-hero img'), { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.querySelector('.st-hero'), start: 'top top', end: 'bottom top', scrub: true } });
  }, [lang]);
  return (
    <main className="page" ref={scope}>
      <PageHead label={tr(c.story.label)} title={tr(c.story.title)} />
      <section className="st-hero"><img src={img(config.img.farmers)} alt="" /></section>
      <section className="wrap st-text"><Reveal as="p" className="lead big">{tr(c.story.p1)}</Reveal><Reveal as="p" delay={0.1}>{tr(c.story.p2)}</Reveal><Reveal as="p" delay={0.2}>{tr(c.story.p3)}</Reveal></section>
      <section className="st-stats"><div className="wrap stats">{c.story.stats.map((s, i) => <Reveal key={i} delay={i * 0.08}><b className="cnt" data-n={s.n}>{s.n}</b><span>{tr(s.l)}</span></Reveal>)}</div></section>
      <section className="wrap st-vals">{c.story.values.map((v, i) => <Reveal key={i} delay={i * 0.1} className="val"><span className="n">0{i + 1}</span><h3>{tr(v.t)}</h3><p>{tr(v.d)}</p></Reveal>)}</section>
      <section className="st-duo"><figure><img src={img(config.img.cherries)} alt="" loading="lazy" /></figure><figure><img src={img(config.img.latte)} alt="" loading="lazy" /></figure></section>
      <WholesaleCTA />
    </main>
  );
}

/* ───────── BRANCHES ───────── */
export function Branches() {
  const { c, tr } = useI18n();
  return (
    <main className="page">
      <PageHead label={tr(c.branches.label)} title={tr(c.branchesPage.title)} sub={tr(c.branches.sub)} />
      <div className="wrap"><BranchRows /></div>
    </main>
  );
}

/* ───────── WHOLESALE ───────── */
export function Wholesale() {
  const { c, tr, config } = useI18n();
  const [sent, setSent] = useState(false);
  const f = c.wholesalePage.form;
  return (
    <main className="page">
      <PageHead label={tr(c.wholesale.label)} title={tr(c.wholesalePage.title)} />
      <div className="wrap ws-grid">
        <div className="ws-l">
          {c.wholesalePage.p.map((p, i) => <Reveal as="p" key={i} className={i === 0 ? 'lead' : ''} delay={i * 0.08}>{tr(p)}</Reveal>)}
          <div className="ws-offers">{c.wholesalePage.offers.map((o, i) => <Reveal key={i} delay={i * 0.08} className="val"><span className="n">0{i + 1}</span><h3>{tr(o.t)}</h3><p>{tr(o.d)}</p></Reveal>)}</div>
        </div>
        <form className="form card" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          {sent ? <p className="sent">✓ {tr(f.sent)}</p> : (<>
            <label><span>{tr(f.name)}</span><input required /></label>
            <label><span>{tr(f.company)}</span><input required /></label>
            <label><span>{tr(f.phone)}</span><input required type="tel" dir="ltr" /></label>
            <label><span>{tr(f.msg)}</span><textarea rows="4" /></label>
            <Magnetic><button className="btn gold wide" type="submit">{tr(f.send)}</button></Magnetic>
            <a className="muted small" href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noreferrer" dir="ltr">WhatsApp {config.contact.phone}</a>
          </>)}
        </form>
      </div>
    </main>
  );
}

/* ───────── INFO ───────── */
export function Info() {
  const { id } = useParams();
  const { c, tr } = useI18n();
  const d = c.info[id];
  if (!d) return <main className="page wrap"><PageHead title="404" /></main>;
  return (
    <main className="page">
      <PageHead title={tr(d.title)} />
      <div className="wrap prose">{d.body.map((p, i) => <Reveal as="p" key={i} delay={i * 0.06}>{tr(p)}</Reveal>)}</div>
    </main>
  );
}

/* ───────── CHECKOUT ───────── */
export function Checkout() {
  const { c, tr, fmt, currency, config, lang } = useI18n();
  const cart = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: 'Riyadh', address: '', notes: '' });
  const [pay, setPay] = useState(config.payments[0]);
  const [errs, setErrs] = useState({});
  const [order, setOrder] = useState(null);
  const sub = cart.subtotal(currency), ship = cart.shipping(currency), total = sub + ship;
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const place = e => {
    e.preventDefault();
    const er = {}; ['name', 'phone', 'address'].forEach(k => { if (!form[k].trim()) er[k] = true; });
    if (form.phone && !/^[+\d\s-]{8,16}$/.test(form.phone)) er.phone = true;
    setErrs(er); if (Object.keys(er).length) return;
    setOrder({ no: 'EB-' + Math.floor(100000 + Math.random() * 899999), total, currency }); cart.clear();
  };
  if (order) return (
    <main className="page done">
      <div className="wrap done-in">
        <div className="tick"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg></div>
        <h1 className="h-xxl">{tr(c.checkout.thanks)}</h1>
        <p className="lead">{tr(c.checkout.thanksSub)}</p>
        <p className="ordno">{tr(c.checkout.orderNo)}: <b dir="ltr">{order.no}</b> · {fmt(order.total)}</p>
        <Link to="/shop" className="btn dark">{tr(c.checkout.continue)}</Link>
      </div>
    </main>
  );
  if (!cart.items.length) return <main className="page wrap"><PageHead title={tr(c.cart.title)} sub={tr(c.cart.empty)} /><Link to="/shop" className="btn dark">{tr(c.cart.emptyCta)}</Link></main>;
  const f = c.checkout.f;
  const field = (k, label, extra = {}) => <label className={errs[k] ? 'err' : ''}><span>{tr(label)}</span><input value={form[k]} onChange={set(k)} {...extra} /></label>;
  return (
    <main className="page">
      <PageHead title={tr(c.checkout.title)} />
      <form className="wrap co-grid" onSubmit={place} noValidate>
        <div className="co-l">
          <h3>{tr(c.checkout.delivery)}</h3>
          {field('name', f.name, { autoComplete: 'name' })}
          {field('phone', f.phone, { type: 'tel', dir: 'ltr', autoComplete: 'tel', placeholder: '+966 5X XXX XXXX' })}
          <label><span>{tr(f.city)}</span><select value={form.city} onChange={set('city')}>{c.checkout.cities.map(x => <option key={x}>{x}</option>)}</select></label>
          {field('address', f.address, { autoComplete: 'street-address' })}
          <label><span>{tr(f.notes)}</span><textarea rows="3" value={form.notes} onChange={set('notes')} /></label>
          <h3>{tr(c.checkout.payment)}</h3>
          <div className="pays">{config.payments.map(p => <button type="button" key={p} className={`pay-b ${pay === p ? 'on' : ''}`} onClick={() => setPay(p)}>{p}</button>)}</div>
          {Object.keys(errs).length > 0 && <p className="errmsg" role="alert">{tr(c.checkout.required)}</p>}
        </div>
        <aside className="co-r card">
          <h3>{tr(c.checkout.summary)}</h3>
          <ul>{cart.items.map(l => <li key={l.id + l.grind}><img src={img(l.product.images[0])} alt="" /><div><b>{tr(l.product).name}</b><span className="muted">{tr(c.product.grinds[l.grind])} × {l.qty}</span></div><span>{fmt(unit(l.product, currency) * l.qty)}</span></li>)}</ul>
          <div className="row"><span>{tr(c.cart.subtotal)}</span><span>{fmt(sub)}</span></div>
          <div className="row"><span>{tr(c.cart.shipping)}</span><span>{fmt(ship)}</span></div>
          <div className="row total"><span>{tr(c.cart.total)}</span><b>{fmt(total)}</b></div>
          <Magnetic><button className="btn gold wide" type="submit">{tr(c.checkout.place)}</button></Magnetic>
          <p className="muted small demo">{tr(c.checkout.demo)}</p>
          <button type="button" className="link" onClick={() => nav('/shop')}>{tr(c.checkout.continue)}</button>
        </aside>
      </form>
      <i hidden>{lang}</i>
    </main>
  );
}

export function NotFound() {
  const { c, tr } = useI18n();
  return <main className="page wrap"><PageHead title="404" /><Link to="/" className="btn dark">{tr(c.product.back)}</Link></main>;
}
