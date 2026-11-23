import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../core/i18n.jsx';
import { gsap, useGsap, reduced, isTouch } from '../core/motion.jsx';
import { Bean, Dust, Magnetic } from '../core/ui.jsx';
import { img } from './Shell.jsx';

const BEANS = [
  // [class, left%, top%, size(vw), rot, depth(+front/-back)]
  ['b1', 3, 6, 4.2, -30, -1], ['b2', 40, 78, 4.2, 40, -1], ['b3', 46, 10, 3.2, 70, -1], ['b4', 88, 14, 5.8, 25, -1], ['b5', 70, 84, 4.4, -60, -1],
  ['b6', 44, 40, 6.5, 20, 1], ['b7', 93, 60, 9.5, -40, 1], ['b8', 52, 90, 7.5, 50, 1], ['b9', 4, 86, 6.5, 100, 1]
];

export default function Hero() {
  const { c, tr, lang, isAr, config } = useI18n();
  const [ready, setReady] = useState(() => { try { return sessionStorage.getItem('pre') === '1'; } catch { return true; } });
  const mouse = useRef(null);

  useEffect(() => {
    if (ready) return undefined;
    const go = () => setReady(true);
    window.addEventListener('pre:out', go);
    const fb = setTimeout(go, 4500);
    return () => { window.removeEventListener('pre:out', go); clearTimeout(fb); };
  }, [ready]);

  const scope = useGsap(root => {
    const q = s => root.querySelector(s), qa = s => root.querySelectorAll(s);
    const sign = isAr ? -1 : 1;
    const mm = gsap.matchMedia();
    const build = (m) => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: q('.hero-pin'), start: 'top top', end: m.mobile ? '+=190%' : '+=280%', scrub: 1, pin: true, anticipatePin: 1 } });
      // 0 → 1 : box comes forward, copy leaves, badges land
      tl.to(q('.hero-copy'), { yPercent: -18, autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, 0)
        .to(q('.hb-scroll'), { scale: m.mobile ? 1.25 : 1.5, x: m.mobile ? 0 : -14 * sign + 'vw', rotationY: -14 * sign, rotationZ: 3 * sign, y: m.mobile ? '-2vh' : '2vh', duration: 1.2 }, 0)
        .to(q('.hero-word'), { scale: 1.3, yPercent: -6, opacity: 0.55, duration: 2 }, 0)
        .fromTo(qa('.badge'), { autoAlpha: 0, scale: 0.6, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.45, ease: 'back.out(1.6)' }, 0.55)
        .to(qa('.bean.front'), { yPercent: (i) => (i % 2 ? -90 : -140), xPercent: (i) => (i % 2 ? 30 : -30) * sign, rotation: '+=60', duration: 2.2 }, 0)
        .to(qa('.bean.back'), { yPercent: -40, rotation: '-=40', duration: 2.2 }, 0)
        // 1 → 2 : push in, badges scatter
        .to(q('.hb-scroll'), { scale: m.mobile ? 1.7 : 2.05, x: 0, rotationY: 0, rotationZ: 0, y: '4vh', duration: 1, ease: 'power1.inOut' }, 1.2)
        .to(qa('.badge'), { autoAlpha: 0, y: -30, stagger: 0.05, duration: 0.4 }, 1.55)
        .to(q('.hero-scroll'), { autoAlpha: 0, duration: 0.2 }, 0)
        // 2 → 3 : espresso iris wipe + statement
        .fromTo(q('.hero-wipe'), { clipPath: 'circle(0% at 50% 56%)' }, { clipPath: 'circle(150% at 50% 56%)', duration: 1.1, ease: 'power2.in' }, 2.1)
        .fromTo(q('.hero-line2'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2.75)
        .to(q('.hb-scroll'), { autoAlpha: 0.0, duration: 0.5 }, 2.6)
        .to({}, { duration: 0.5 });
    };
    mm.add('(max-width: 760px)', () => build({ mobile: true }));
    mm.add('(min-width: 761px)', () => build({ mobile: false }));

    // pointer parallax
    if (!isTouch() && !reduced()) {
      const layers = [...qa('[data-depth]')].map(el => ({ el, d: parseFloat(el.dataset.depth), x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }) }));
      const mv = e => { const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5; layers.forEach(l => { l.x(-nx * l.d); l.y(-ny * l.d); }); };
      window.addEventListener('mousemove', mv);
      return () => { window.removeEventListener('mousemove', mv); mm.revert(); };
    }
    return () => mm.revert();
  }, [lang]);

  const word = tr(c.hero.word);
  return (
    <section className={`hero ${ready ? 'ready' : ''}`} ref={scope}>
      <div className="hero-pin" ref={mouse}>
        <Dust count={60} />
        <div className="hero-word" aria-hidden="true" data-depth="14">{word}</div>

        <div className="hero-stage">
          {BEANS.map(([k, l, t, s, r, d]) => (
            <div key={k} className={`bean-pos ${d > 0 ? 'front' : 'back'}`} style={{ left: `${l}%`, top: `${t}%`, width: `${s}vw`, minWidth: d > 0 ? 54 : 28 }} data-depth={d > 0 ? 36 : 12}>
              <Bean className={`bean ${d > 0 ? 'front' : 'back'} ${k}`} style={{ transform: `rotate(${r}deg)` }} />
            </div>
          ))}
          <div className="hb-pos" data-depth="22">
            <div className="hb-scroll"><div className="hb-float"><img className="hero-box" src={img(config.img.heroBox)} alt={config.name[lang]} /></div></div>
          </div>
        </div>
        <div className="badges">
          <div className="badge bd1"><i />{tr(c.hero.badge1)}</div>
          <div className="badge bd2"><i />{tr(c.hero.badge2)}</div>
          <div className="badge bd3"><i />{tr(c.hero.badge3)}</div>
        </div>

        <div className="hero-copy">
          <p className="eyebrow hi" style={{ '--d': '.1s' }}>{tr(c.hero.eyebrow)}</p>
          <h1 className="hero-h1">
            <span className="mask"><span className="hi" style={{ '--d': '.2s' }}>{tr(c.hero.title1)}</span></span>
            <span className="mask"><em className="hi" style={{ '--d': '.34s' }}>{tr(c.hero.title2)}</em></span>
          </h1>
          <p className="hero-sub hi" style={{ '--d': '.5s' }}>{tr(c.hero.sub)}</p>
          <div className="hero-cta hi" style={{ '--d': '.62s' }}>
            <Magnetic><Link to="/shop" className="btn dark">{tr(c.hero.cta1)}</Link></Magnetic>
            <Link to="/story" className="btn ghost">{tr(c.hero.cta2)}</Link>
          </div>
        </div>

        <div className="hero-scroll hi" style={{ '--d': '1s' }}><span>{tr(c.hero.scroll)}</span><i /></div>
        <div className="hero-wipe"><Dust count={50} /></div>
        <p className="hero-line2">{tr(c.hero.line2)}</p>
      </div>
    </section>
  );
}
