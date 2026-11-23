import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../core/i18n.jsx';
import { useCart } from '../core/cart.jsx';
import { gsap, useLockScroll } from '../core/motion.jsx';
import { Magnetic } from '../core/ui.jsx';

export const asset = p => `${import.meta.env.BASE_URL}${p}`.replace('//', '/');
export const img = id => asset(`client/img/${id}.webp`);

export function Logo({ tone = 'dark', className = '' }) {
  const { config, lang } = useI18n();
  return <img className={`logo ${className}`} src={asset(config.logo[tone])} alt={config.name[lang]} />;
}

/* ───────────── Preloader ───────────── */
export function Preloader() {
  const { c, tr } = useI18n();
  const [done, setDone] = useState(() => { try { return sessionStorage.getItem('pre') === '1'; } catch { return false; } });
  const root = useRef(null), bar = useRef(null), num = useRef(null);
  useEffect(() => {
    if (done) return undefined;
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { try { sessionStorage.setItem('pre', '1'); } catch { /* */ } setDone(true); } });
    tl.to(o, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(2, '0'); if (bar.current) bar.current.style.transform = `scaleX(${o.v / 100})`; } })
      .add(() => window.dispatchEvent(new Event('pre:out')), '+=0.05')
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.15');
    return () => tl.kill();
  }, [done]);
  if (done) return null;
  return (
    <div className="preloader" ref={root}>
      <Logo tone="light" className="pre-logo" />
      <div className="pre-line"><i ref={bar} /></div>
      <div className="pre-meta"><span>{tr(c.preloader)}</span><b ref={num}>00</b></div>
    </div>
  );
}

/* ───────────── Header ───────────── */
export function Header() {
  const { c, tr, lang, setLang, currency, setCurrency, config } = useI18n();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useLockScroll(menu);
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  const links = [['/shop', c.nav.shop], ['/story', c.nav.story], ['/branches', c.nav.branches], ['/wholesale', c.nav.wholesale]];
  return (
    <>
      <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
        <nav className="hdr-nav" aria-label="Primary">
          {links.map(([to, l]) => <NavLink key={to} to={to} data-cursor="">{tr(l)}</NavLink>)}
        </nav>
        <Link to="/" className="hdr-logo" aria-label={config.name[lang]}><Logo tone="dark" /></Link>
        <div className="hdr-tools">
          <button className="chip" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label="Language">{lang === 'en' ? 'عربي' : 'EN'}</button>
          <button className="chip hide-s" onClick={() => setCurrency(currency === 'SAR' ? 'USD' : 'SAR')} aria-label="Currency">{currency === 'SAR' ? 'SAR' : 'USD'}</button>
          <button className="cart-btn" onClick={() => cart.setOpen(true)} aria-label={tr(c.nav.cart)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
            <span className={`cart-n ${cart.count ? 'on' : ''}`}>{cart.count}</span>
          </button>
          <button className={`burger ${menu ? 'x' : ''}`} onClick={() => setMenu(m => !m)} aria-label={tr(c.nav.menu)} aria-expanded={menu}><i /><i /></button>
        </div>
      </header>
      <div className={`mmenu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        <div className="mmenu-in">
          {links.map(([to, l], i) => <Link key={to} to={to} style={{ transitionDelay: `${0.08 * i + 0.15}s` }}>{tr(l)}</Link>)}
          <div className="mmenu-foot">
            <button className="chip" onClick={() => setCurrency(currency === 'SAR' ? 'USD' : 'SAR')}>{currency}</button>
            <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ───────────── Cart drawer ───────────── */
export function CartDrawer() {
  const { c, tr, fmt, currency, config } = useI18n();
  const cart = useCart();
  const nav = useNavigate();
  useLockScroll(cart.open);
  useEffect(() => { const k = e => e.key === 'Escape' && cart.setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [cart]);
  const sub = cart.subtotal(currency);
  return (
    <div className={`drawer-wrap ${cart.open ? 'open' : ''}`} aria-hidden={!cart.open}>
      <div className="drawer-bg" onClick={() => cart.setOpen(false)} />
      <aside className="drawer" role="dialog" aria-label={tr(c.cart.title)} data-lenis-prevent>
        <div className="drawer-h"><h3>{tr(c.cart.title)} <small>({cart.count})</small></h3><button onClick={() => cart.setOpen(false)} aria-label={tr(c.nav.close)}>✕</button></div>
        {cart.items.length === 0 ? (
          <div className="drawer-empty"><p>{tr(c.cart.empty)}</p><Link to="/shop" className="btn" onClick={() => cart.setOpen(false)}>{tr(c.cart.emptyCta)}</Link></div>
        ) : (
          <>
            <ul className="drawer-list">
              {cart.items.map(l => (
                <li key={l.id + l.grind}>
                  <Link to={`/product/${encodeURIComponent(l.id)}`} onClick={() => cart.setOpen(false)} className="di-img"><img src={img(l.product.images[0])} alt="" /></Link>
                  <div className="di-b">
                    <b>{tr(l.product).name}</b>
                    <span className="muted">{tr(c.product.grinds[l.grind])}</span>
                    <div className="qty sm"><button onClick={() => cart.setQty(l.id, l.grind, l.qty - 1)} aria-label="−">−</button><span>{l.qty}</span><button onClick={() => cart.setQty(l.id, l.grind, l.qty + 1)} aria-label="+">+</button></div>
                  </div>
                  <div className="di-r"><span>{fmt(unit(l.product, currency) * l.qty)}</span><button className="link" onClick={() => cart.remove(l.id, l.grind)}>{tr(c.cart.remove)}</button></div>
                </li>
              ))}
            </ul>
            <div className="drawer-f">
              <div className="row"><span>{tr(c.cart.subtotal)}</span><b>{fmt(sub)}</b></div>
              <p className="muted small">{tr(c.cart.note)}</p>
              <button className="btn gold wide" onClick={() => { cart.setOpen(false); nav('/checkout'); }}>{tr(c.cart.checkout)} · {fmt(sub)}</button>
            </div>
          </>
        )}
        <span hidden>{config.name.en}</span>
      </aside>
    </div>
  );
}
export const unit = (p, cur) => (p.sale ? (cur === 'USD' ? (p.price.USD * p.sale.SAR) / p.price.SAR : p.sale.SAR) : p.price[cur]);

/* ───────────── Toast ───────────── */
export function Toast() {
  const { c, tr, lang } = useI18n();
  const { toast, setToast, setOpen } = useCart();
  useEffect(() => { if (!toast) return undefined; const id = setTimeout(() => setToast(null), 2600); return () => clearTimeout(id); }, [toast, setToast]);
  return (
    <div className={`toast ${toast ? 'on' : ''}`} role="status">
      <span>{tr(c.product.added)}</span><button onClick={() => { setToast(null); setOpen(true); }}>{tr(c.cart.title)} →</button>
      <i hidden>{lang}</i>
    </div>
  );
}

/* ───────────── Sticky order pill ───────────── */
export function OrderPill() {
  const { c, tr } = useI18n();
  const { pathname } = useLocation();
  const hidden = pathname.startsWith('/checkout') || pathname.startsWith('/product');
  return (
    <div className={`pill-wrap ${hidden ? 'off' : ''}`}>
      <Magnetic strength={0.25}><Link to="/shop" className="order-pill"><i /> {tr(c.order)}</Link></Magnetic>
    </div>
  );
}

/* ───────────── Footer ───────────── */
export function Footer() {
  const { c, tr, config, lang } = useI18n();
  return (
    <footer className="ftr">
      <div className="wrap ftr-top">
        <div className="ftr-brand">
          <Logo tone="light" className="ftr-logo" />
          <p>{tr(c.footer.blurb)}</p>
          <div className="pay">{config.payments.map(p => <span key={p}>{p}</span>)}</div>
        </div>
        <div><h4>{tr(c.footer.explore)}</h4>
          <Link to="/shop">{tr(c.nav.shop)}</Link><Link to="/story">{tr(c.nav.story)}</Link><Link to="/branches">{tr(c.nav.branches)}</Link><Link to="/wholesale">{tr(c.nav.wholesale)}</Link></div>
        <div><h4>{tr(c.footer.help)}</h4>
          <Link to="/info/shipping">{tr(c.info.shipping.title)}</Link><Link to="/info/returns">{tr(c.info.returns.title)}</Link><Link to="/info/privacy">{tr(c.info.privacy.title)}</Link><Link to="/info/careers">{tr(c.info.careers.title)}</Link></div>
        <div><h4>{tr(c.footer.follow)}</h4>
          <a href={config.social.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={config.social.x} target="_blank" rel="noreferrer">X</a><a href={config.social.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noreferrer" dir="ltr">{config.contact.phone}</a></div>
      </div>
      <div className="ftr-giant" aria-hidden="true">{lang === 'ar' ? 'إكسير البن' : 'ELIXIR BUNN'}</div>
      <div className="wrap ftr-bot">
        <span>© 2026 {config.name[lang]} · {tr(c.footer.rights)}</span>
        <span>{tr(c.footer.cr)} {config.contact.cr} · {tr(config.contact.city)}</span>
        <span className="concept">{tr(c.footer.concept)}</span>
      </div>
    </footer>
  );
}

/* ───────────── Product card ───────────── */
export function ProductCard({ p, index = 0 }) {
  const { c, tr, lang, fmt, currency } = useI18n();
  const cart = useCart();
  const liked = cart.wish.includes(p.id);
  const second = p.images[1];
  return (
    <article className="pcard">
      <Link to={`/product/${encodeURIComponent(p.id)}`} className="pc-img" data-cursor="View">
        <img src={img(p.images[0])} alt={p[lang].name} loading="lazy" />
        {second && <img className="alt" src={img(second)} alt="" loading="lazy" />}
        {p.sale && <em className="tag">%</em>}
      </Link>
      <button className={`heart ${liked ? 'on' : ''}`} onClick={() => cart.toggleWish(p.id)} aria-label={tr(c.product.wish)} aria-pressed={liked}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
      </button>
      <div className="pc-b">
        <Link to={`/product/${encodeURIComponent(p.id)}`}><h3>{p[lang].name}</h3></Link>
        <div className="pc-row"><span className="price">{p.sale && <s>{fmt(p.price)}</s>} {fmt(p.sale ? { SAR: p.sale.SAR, USD: unit(p, 'USD') } : p.price)}</span>
          <button className="quick" onClick={() => cart.add(p.id, 1, 0)} aria-label={tr(c.product.add)}>+</button></div>
      </div>
      <i hidden>{index}{currency}</i>
    </article>
  );
}
