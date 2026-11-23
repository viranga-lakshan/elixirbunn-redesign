import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../client/products.json';
import { useI18n } from '../core/i18n.jsx';
import { useCart } from '../core/cart.jsx';
import { gsap, ScrollTrigger, useGsap } from '../core/motion.jsx';
import { Reveal, SplitTitle, Magnetic, Dust } from '../core/ui.jsx';
import { ProductCard, img } from './Shell.jsx';

/* ───────── Marquee ───────── */
export function Marquee({ dark = false }) {
  const { c, tr } = useI18n();
  const items = [...c.marquee, ...c.marquee];
  return (
    <div className={`marquee ${dark ? 'dark' : ''}`} aria-hidden="true">
      <div className="mq-track">{[0, 1].map(k => <div className="mq-set" key={k}>{items.map((m, i) => <span key={i}>{tr(m)}<i>✦</i></span>)}</div>)}</div>
    </div>
  );
}

/* ───────── Manifesto: word-by-word scrub + arch image ───────── */
export function Manifesto() {
  const { c, tr, lang, config } = useI18n();
  const words = tr(c.manifesto.text).split(' ');
  const scope = useGsap(root => {
    const ws = root.querySelectorAll('.mw');
    gsap.fromTo(ws, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.man-text'), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 } });
    gsap.fromTo(root.querySelector('.arch'), { clipPath: 'inset(22% 18% 22% 18% round 300px 300px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 300px 300px 0 0)', ease: 'none', scrollTrigger: { trigger: root.querySelector('.arch'), start: 'top 90%', end: 'top 25%', scrub: 0.8 } });
    gsap.fromTo(root.querySelector('.arch img'), { yPercent: -12, scale: 1.25 }, { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.querySelector('.arch'), start: 'top bottom', end: 'bottom top', scrub: true } });
  }, [lang]);
  return (
    <section className="man dark-sec" ref={scope}>
      <Dust count={40} />
      <div className="wrap man-grid">
        <div className="man-l">
          <p className="eyebrow gold">{tr(c.manifesto.label)}</p>
          <p className="man-text">{words.map((w, i) => <span className="mw" key={i}>{w} </span>)}</p>
          <Magnetic><Link to="/story" className="btn light">{tr(c.hero.cta2)}</Link></Magnetic>
        </div>
        <div className="man-r"><div className="arch"><img src={img(config.img.manifesto)} alt="" loading="lazy" /></div></div>
      </div>
    </section>
  );
}

/* ───────── Regions: pinned horizontal scroll ───────── */
export function Regions() {
  const { c, tr, lang, isAr, fmt } = useI18n();
  const cart = useCart();
  const list = products.filter(p => p.category === 'saudi');
  const scope = useGsap(root => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = root.querySelector('.rg-track');
      const dist = () => track.scrollWidth - window.innerWidth;
      const s = isAr ? 1 : -1;
      const hz = gsap.to(track, { x: () => s * dist(), ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      gsap.fromTo(root.querySelector('.rg-bar i'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
      if (!isAr) root.querySelectorAll('.rcard-img img').forEach(im => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.rcard'), containerAnimation: hz, start: 'left right', end: 'right left', scrub: true } }));
    });
    return () => mm.revert();
  }, [lang]);
  return (
    <section className="rg" ref={scope}>
      <div className="rg-track">
        <div className="rg-intro">
          <p className="eyebrow">{tr(c.regions.label)}</p>
          <SplitTitle text={tr(c.regions.title)} as="h2" className="h-xl" />
          <p className="lead">{tr(c.regions.sub)}</p>
          <span className="hint">{tr(c.regions.hint)} →</span>
        </div>
        {list.map((p, i) => (
          <article className="rcard" key={p.id}>
            <span className="rnum">0{i + 1}</span>
            <Link to={`/product/${encodeURIComponent(p.id)}`} className="rcard-img" data-cursor="View"><img src={img(p.images[0])} alt={p[lang].name} loading="lazy" /></Link>
            <div className="rcard-b">
              <h3>{p[lang].name}</h3>
              <div className="rcard-row"><span className="price">{fmt(p.price)}</span><button className="btn sm dark" onClick={() => cart.add(p.id, 1, 0)}>{tr(c.product.add)}</button></div>
            </div>
          </article>
        ))}
      </div>
      <div className="rg-bar"><i /></div>
    </section>
  );
}

/* ───────── Journey: pinned story, images crossfade ───────── */
export function Journey() {
  const { c, tr, lang, config } = useI18n();
  const [active, setActive] = useState(0);
  const last = useRef(0);
  const steps = c.journey.steps;
  const scope = useGsap(root => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 0px)', () => {
      ScrollTrigger.create({
        trigger: root, start: 'top top', end: '+=' + steps.length * 90 + '%', pin: true, scrub: true, anticipatePin: 1,
        onUpdate: self => {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (i !== last.current) { last.current = i; setActive(i); }
          root.querySelector('.jr-prog i').style.transform = `scaleY(${self.progress})`;
        }
      });
    });
    return () => mm.revert();
  }, [lang]);
  return (
    <section className="jr dark-sec" ref={scope}>
      <div className="wrap jr-grid">
        <div className="jr-l">
          <p className="eyebrow gold">{tr(c.journey.label)}</p>
          <h2 className="h-xl">{tr(c.journey.title)}</h2>
          <div className="jr-steps">
            <div className="jr-prog"><i /></div>
            {steps.map((s, i) => (
              <div key={i} className={`jr-step ${active === i ? 'on' : ''} ${i < active ? 'past' : ''}`}>
                <span className="n">0{i + 1}</span>
                <div><h3>{tr(s.t)}</h3><p>{tr(s.d)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="jr-r">
          <div className="jr-frame">
            {config.img.journey.map((id, i) => <img key={id + i} src={img(id)} alt="" className={active === i ? 'on' : ''} loading="lazy" />)}
            <span className="jr-count">0{active + 1} / 0{steps.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Featured single origins ───────── */
export function Featured() {
  const { c, tr } = useI18n();
  const list = products.filter(p => p.category === 'specialty').sort((a, b) => b.price.SAR - a.price.SAR).slice(0, 4);
  return (
    <section className="feat">
      <div className="wrap">
        <div className="sec-h">
          <div><p className="eyebrow">{tr(c.featured.label)}</p><SplitTitle text={tr(c.featured.title)} className="h-xl" /></div>
          <Link to="/shop" className="link-arrow">{tr(c.featured.cta)} <span>→</span></Link>
        </div>
        <div className="grid4">{list.map((p, i) => <Reveal key={p.id} delay={i * 0.08}><ProductCard p={p} index={i} /></Reveal>)}</div>
      </div>
    </section>
  );
}

/* ───────── Gallery with parallax ───────── */
export function Gallery() {
  const { c, tr, lang, config } = useI18n();
  const scope = useGsap(root => {
    root.querySelectorAll('[data-speed]').forEach(el => {
      const sp = parseFloat(el.dataset.speed);
      gsap.fromTo(el.querySelector('img'), { yPercent: -sp }, { yPercent: sp, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(el, { clipPath: 'inset(12% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true } });
    });
  }, [lang]);
  const g = config.img.gallery;
  return (
    <section className="gal" ref={scope}>
      <div className="wrap">
        <div className="gal-head"><SplitTitle text={tr(c.gallery.title)} className="h-xxl" /><p className="lead">{tr(c.gallery.sub)}</p></div>
        <div className="gal-grid">
          <figure className="g1" data-speed="9"><img src={img(g[0])} alt="" loading="lazy" /></figure>
          <figure className="g2" data-speed="14"><img src={img(g[1])} alt="" loading="lazy" /></figure>
          <figure className="g3" data-speed="7"><img src={img(g[2])} alt="" loading="lazy" /></figure>
          <figure className="g4" data-speed="12"><img src={img(g[3])} alt="" loading="lazy" /></figure>
        </div>
      </div>
    </section>
  );
}

/* ───────── Branches list ───────── */
export const mapUrl = (cfg, b) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cfg.name.en} ${b.name.en} Riyadh`)}`;
export function BranchRows({ limit }) {
  const { c, tr, config } = useI18n();
  const list = limit ? config.branches.slice(0, limit) : config.branches;
  return (
    <ul className="brows">
      {list.map((b, i) => (
        <Reveal as="li" key={b.name.en} delay={i * 0.05}>
          <a href={mapUrl(config, b)} target="_blank" rel="noreferrer" className="brow" data-cursor={tr(c.branches.map)}>
            <span className="bn">0{i + 1}</span>
            <h3>{tr(b.name)}</h3>
            <div className="bi"><p>{tr(b.addr)}</p><p className="muted">{tr(b.hours)}</p></div>
            <span className="barrow">↗</span>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
export function BranchesTeaser() {
  const { c, tr } = useI18n();
  return (
    <section className="brn">
      <div className="wrap brn-grid">
        <div className="brn-l">
          <p className="eyebrow">{tr(c.branches.label)}</p>
          <SplitTitle text={tr(c.branches.title)} className="h-xl" />
          <p className="lead">{tr(c.branches.sub)}</p>
          <Magnetic><Link to="/branches" className="btn dark">{tr(c.branches.all)}</Link></Magnetic>
        </div>
        <BranchRows />
      </div>
    </section>
  );
}

/* ───────── Wholesale CTA ───────── */
export function WholesaleCTA() {
  const { c, tr, config } = useI18n();
  return (
    <section className="wcta dark-sec">
      <img src={img(config.img.wholesale)} alt="" className="wcta-bg" loading="lazy" />
      <div className="wcta-shade" />
      <div className="wrap wcta-in">
        <p className="eyebrow gold">{tr(c.wholesale.label)}</p>
        <SplitTitle text={tr(c.wholesale.title)} className="h-xxl" />
        <p className="lead">{tr(c.wholesale.text)}</p>
        <Magnetic><Link to="/wholesale" className="btn gold">{tr(c.wholesale.cta)}</Link></Magnetic>
      </div>
    </section>
  );
}
