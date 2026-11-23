import { useEffect, useRef, useState } from 'react';
import { gsap, isTouch, reduced } from './motion.jsx';

// Fade-up reveal when scrolled into view
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`rv ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }} {...rest}>{children}</Tag>;
}

// Per-line masked title reveal (splits by words so Arabic joins correctly)
export function SplitTitle({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`split ${on ? 'in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span className="w" key={i} aria-hidden="true"><span style={{ transitionDelay: `${delay + i * 0.07}s` }}>{w}</span>{' '}</span>
      ))}
    </Tag>
  );
}

// Magnetic hover effect for buttons
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || isTouch() || reduced()) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const move = e => { const r = el.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * strength); yTo((e.clientY - (r.top + r.height / 2)) * strength); };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [strength]);
  return <span ref={ref} className="mag">{children}</span>;
}

// Custom cursor (desktop only)
export function Cursor() {
  const dot = useRef(null); const ring = useRef(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (isTouch()) return undefined;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot.current, 'y', { duration: 0.1 });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
    const move = e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = e => {
      const t = e.target.closest?.('a,button,[data-cursor],input,select,textarea,label');
      ring.current?.classList.toggle('big', !!t);
      setLabel(t?.getAttribute?.('data-cursor') || '');
    };
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over);
    return () => { document.documentElement.classList.remove('has-cursor'); window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);
  if (isTouch()) return null;
  return (<><div ref={dot} className="cur-dot" /><div ref={ring} className={`cur-ring ${label ? 'lbl' : ''}`}><span>{label}</span></div></>);
}

// Floating gold dust (canvas), pointer-reactive, pauses when off-screen
export function Dust({ count = 70, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv || reduced()) return undefined;
    const ctx = cv.getContext('2d'); let w = 0, h = 0, raf, vis = true, mx = -999, my = -999;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const n = window.innerWidth < 700 ? Math.floor(count / 2) : count;
    const ps = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.00015 + 0.00005, a: Math.random() * 0.6 + 0.2, p: Math.random() * 6 }));
    const size = () => { const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ro = new ResizeObserver(size); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(cv);
    const mm = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    window.addEventListener('mousemove', mm);
    let t0 = performance.now();
    const draw = t => {
      raf = requestAnimationFrame(draw); if (!vis) return;
      const dt = t - t0; t0 = t; ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * dt; p.p += dt * 0.001; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        let x = p.x * w + Math.sin(p.p) * 12, y = p.y * h;
        const ddx = x - mx, ddy = y - my, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 14000) { const f = (1 - d2 / 14000) * 22; x += (ddx / Math.sqrt(d2 || 1)) * f; y += (ddy / Math.sqrt(d2 || 1)) * f; }
        ctx.beginPath(); ctx.fillStyle = `rgba(184,149,90,${p.a * (0.6 + 0.4 * Math.sin(p.p * 2))})`; ctx.shadowColor = 'rgba(184,149,90,.8)'; ctx.shadowBlur = 8; ctx.arc(x, y, p.r, 0, 6.283); ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('mousemove', mm); };
  }, [count]);
  return <canvas ref={ref} className={`dust ${className}`} aria-hidden="true" />;
}

// Coffee bean SVG
export function Bean({ className = '', style }) {
  return (
    <svg className={`bean ${className}`} style={style} viewBox="0 0 100 140" aria-hidden="true">
      <defs>
        <radialGradient id="bg" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6a4026" /><stop offset=".55" stopColor="#3b2314" /><stop offset="1" stopColor="#1d110a" /></radialGradient>
      </defs>
      <ellipse cx="50" cy="70" rx="42" ry="62" fill="url(#bg)" />
      <path d="M52 10 C 30 45, 70 85, 48 130" stroke="#120a05" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="38" rx="8" ry="16" fill="rgba(255,255,255,.12)" transform="rotate(-18 34 38)" />
    </svg>
  );
}
